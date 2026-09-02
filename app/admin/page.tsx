'use client';

import React, { useState, useEffect } from 'react';
import { getCompanies, getJobs, getPlatformStats, getRecentAuditLogs, verifyCompany } from '../../lib/services';
import { Company, Job, PlatformStats } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DemoBadge } from '../../components/demo/DemoBadge';
import { useToast } from '../../lib/context/ToastContext';
import {
  ShieldCheck,
  Building2,
  Users,
  Briefcase,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function AdminPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  const { success, info } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [compData, jobsData, statsData, logsData] = await Promise.all([
        getCompanies(),
        getJobs(),
        getPlatformStats(),
        getRecentAuditLogs(),
      ]);
      setCompanies(compData);
      setJobs(jobsData);
      setStats(statsData);
      setAuditLogs(logsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (companyId: string, currentStatus: boolean) => {
    const updated = await verifyCompany(companyId, !currentStatus);
    if (updated) {
      setCompanies((prev) =>
        prev.map((c) => (c.id === companyId ? { ...c, verified: !currentStatus } : c))
      );
      if (!currentStatus) {
        success('Employer Verified', `${updated.name} badge updated to Verified Enterprise.`);
      } else {
        info('Verification Revoked', `${updated.name} badge removed.`);
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              SuperAdmin Command Center
            </span>
            <DemoBadge variant="subtle" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Sallet Hire Platform Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Platform governance, employer verification queues, and audit trail metrics.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Live Postings</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalJobs || 1248}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across 12 Indian Hubs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Companies</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{companies.length} Registered</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            {companies.filter((c) => c.verified).length} Verified Employers
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Active Candidates</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalCandidates || 28400}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Verified Technical Profiles</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">System Health</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">99.98%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Zero Incident SLA</p>
        </div>
      </div>

      {/* Main Grid: Employer Moderation Queue & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Employer Verification Queue (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Employer Moderation & Verification</h2>
            <span className="text-xs font-semibold text-slate-500">
              {companies.length} Total Partners
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {companies.slice(0, 8).map((comp) => (
              <div
                key={comp.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={comp.logo} alt={comp.name} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{comp.name}</h3>
                      {comp.verified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{comp.industry} &bull; {comp.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <Badge
                    variant={comp.verified ? 'success' : 'warning'}
                    size="sm"
                    className="font-bold"
                  >
                    {comp.verified ? 'Verified Partner' : 'Pending Verification'}
                  </Badge>

                  <Button
                    variant={comp.verified ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => handleVerify(comp.id, comp.verified)}
                    className="text-xs font-bold"
                  >
                    {comp.verified ? 'Revoke' : 'Approve & Verify'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log (Right col) */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Recent Platform Operations</h2>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="text-xs space-y-1 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.user}</span>
                  <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{log.action}</p>
                <Badge variant="subtle" size="sm" className="capitalize text-[10px]">
                  {log.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
