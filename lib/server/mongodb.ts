import { MongoClient, Db } from 'mongodb';
import dns from 'dns';

// Fix for Windows / ISP DNS resolution issues with MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Ignore in environments where setting custom DNS servers is not permitted
}

const uri = process.env.MONGODB_URI;

const options = {
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
  socketTimeoutMS: 30000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientInstance: MongoClient | undefined;
}

let activeClientPromise: Promise<MongoClient> | null = null;

export async function getConnectedClient(): Promise<MongoClient> {
  if (!uri) {
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
      const client = new MongoClient(uri, options);
      const connected = await client.connect();
      if (process.env.NODE_ENV === 'development') {
        global._mongoClientInstance = connected;
      }
      return connected;
    } catch (err) {
      activeClientPromise = null;
      global._mongoClientInstance = undefined;
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
