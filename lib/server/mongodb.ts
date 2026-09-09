import { MongoClient, Db } from 'mongodb';
import dns from 'dns';

// Configure DNS servers globally as primary fallback for Windows/ISP SRV record blocks
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Ignore in restricted environments
}

const rawUri = process.env.MONGODB_URI;

const options = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientInstance: MongoClient | undefined;
}

let activeClientPromise: Promise<MongoClient> | null = null;

/**
 * Resolves mongodb+srv:// URIs to direct standard replica set connection strings
 * using Google & Cloudflare DNS resolvers to avoid Windows loopback DNS querySrv ECONNREFUSED errors.
 */
async function resolveSrvUriIfNeeded(connectionUri: string): Promise<string> {
  if (!connectionUri.startsWith('mongodb+srv://')) {
    return connectionUri;
  }

  try {
    const match = connectionUri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(\/[^?]*)?(\?.*)?$/);
    if (!match) return connectionUri;

    const [, user, pass, host, dbPath = '', query = ''] = match;
    const resolver = new dns.promises.Resolver();
    resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

    const srvRecords = await resolver.resolveSrv('_mongodb._tcp.' + host);
    if (!srvRecords || srvRecords.length === 0) return connectionUri;

    const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(',');

    let txtParams = '';
    try {
      const txtRecords = await resolver.resolveTxt(host);
      if (txtRecords && txtRecords.length > 0) {
        txtParams = txtRecords.flat().join('&');
      }
    } catch {
      // TXT record is optional
    }

    const cleanDb = dbPath || '/';
    const existingParams = query ? query.replace(/^\?/, '') : '';
    const allParams = ['ssl=true', txtParams, existingParams].filter(Boolean).join('&');

    const resolved = `mongodb://${user}:${pass}@${hosts}${cleanDb}${allParams ? '?' + allParams : ''}`;
    return resolved;
  } catch (err) {
    console.warn('Could not pre-resolve SRV records via DNS resolver, proceeding with original URI:', err);
    return connectionUri;
  }
}

export async function getConnectedClient(): Promise<MongoClient> {
  if (!rawUri) {
    throw new Error('MONGODB_URI is not defined in environment variables. Please check your .env file.');
  }

  // Reuse existing connected instance if available
  if (global._mongoClientInstance) {
    return global._mongoClientInstance;
  }

  if (activeClientPromise) {
    try {
      return await activeClientPromise;
    } catch {
      activeClientPromise = null;
    }
  }

  activeClientPromise = (async () => {
    try {
      // 1. Resolve SRV record to standard URI if needed
      const effectiveUri = await resolveSrvUriIfNeeded(rawUri);

      // 2. Connect using effective URI
      const client = new MongoClient(effectiveUri, options);
      const connected = await client.connect();

      if (process.env.NODE_ENV === 'development') {
        global._mongoClientInstance = connected;
      }
      return connected;
    } catch (err: any) {
      activeClientPromise = null;
      global._mongoClientInstance = undefined;

      // If initial connection failed with querySrv error, attempt secondary resolution
      if (err?.code === 'ECONNREFUSED' && rawUri.startsWith('mongodb+srv://')) {
        try {
          const fallbackUri = await resolveSrvUriIfNeeded(rawUri);
          const fallbackClient = new MongoClient(fallbackUri, options);
          const connected = await fallbackClient.connect();
          if (process.env.NODE_ENV === 'development') {
            global._mongoClientInstance = connected;
          }
          return connected;
        } catch (fallbackErr) {
          throw fallbackErr;
        }
      }

      throw err;
    }
  })();

  return activeClientPromise;
}

// Default export for backward compatibility
const clientPromise = {
  then: (onfulfilled?: any, onrejected?: any) => getConnectedClient().then(onfulfilled, onrejected),
  catch: (onrejected?: any) => getConnectedClient().catch(onrejected),
};

export default clientPromise as unknown as Promise<MongoClient>;

/**
 * Access the database instance from the connected client
 */
export async function getDatabase(dbName?: string): Promise<Db> {
  const connectedClient = await getConnectedClient();
  return connectedClient.db(dbName);
}

/**
 * Verifies the database connection and returns connection status
 * without exposing sensitive credentials or the connection URI
 */
export async function verifyDatabaseConnection(): Promise<{
  connected: boolean;
  databaseName?: string;
  error?: string;
}> {
  try {
    const connectedClient = await getConnectedClient();
    const db = connectedClient.db();
    await db.command({ ping: 1 });
    return {
      connected: true,
      databaseName: db.databaseName,
    };
  } catch (error: any) {
    return {
      connected: false,
      error: error?.message || 'Database connection error',
    };
  }
}
