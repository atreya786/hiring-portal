'use client';

import React, { useState, useEffect } from 'react';
import { getJobAlerts, createJobAlert, toggleJobAlert, deleteJobAlert } from '../../../lib/services';
import { JobAlert } from '../../../lib/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../lib/context/ToastContext';
import { Bell, Plus, Trash2, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';
import { formatDate } from '../../../lib/utils';

export default function CandidateAlertsPage() {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('Bhubaneswar, Odisha');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');

  const { success } = useToast();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getJobAlerts();
        setAlerts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const kwArray = keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const newAlert = await createJobAlert({
      candidateId: 'cand_01',
      title,
      keywords: kwArray.length > 0 ? kwArray : [title],
      location,
      frequency,
      active: true,
    });

    setAlerts((prev) => [newAlert, ...prev]);
    setIsCreateOpen(false);
    setTitle('');
    setKeywords('');
    success('Job Alert Created', `You will receive ${frequency} email notifications for ${title}.`);
  };

  const handleToggle = async (alertId: string) => {
    const updated = await toggleJobAlert(alertId);
    setAlerts(updated);
  };

  const handleDelete = async (alertId: string) => {
    const updated = await deleteJobAlert(alertId);
    setAlerts(updated);
    success('Alert Removed', 'The job alert was deleted.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Custom Job Alerts</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Get notified immediately when new opportunities matching your exact skills are posted.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold text-xs"
        >
          Create Job Alert
        </Button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{alert.title}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    alert.active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {alert.active ? 'Active' : 'Paused'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {alert.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {alert.frequency === 'daily' ? 'Daily Digest' : 'Weekly Digest'}
                </span>
                <span className="text-indigo-600 font-semibold">
                  {alert.matchCount} matching openings
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {alert.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <Button
                variant={alert.active ? 'outline' : 'secondary'}
                size="sm"
                onClick={() => handleToggle(alert.id)}
                className="text-xs font-semibold"
              >
                {alert.active ? 'Pause Alert' : 'Resume'}
              </Button>
              <button
                onClick={() => handleDelete(alert.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Delete Alert"
                aria-label="Delete Alert"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        maxWidth="md"
        title="Create Job Alert"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Alert Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior React Developer in Bhubaneswar"
            required
          />

          <Input
            label="Target Keywords (comma separated)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="React, Next.js, TypeScript"
            helperText="Separate multiple keywords with commas"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="Bhubaneswar, Odisha">Bhubaneswar, Odisha</option>
              <option value="Cuttack, Odisha">Cuttack, Odisha</option>
              <option value="Bengaluru, Karnataka">Bengaluru, Karnataka</option>
              <option value="Hyderabad, Telangana">Hyderabad, Telangana</option>
              <option value="Pune, Maharashtra">Pune, Maharashtra</option>
              <option value="Remote">Remote Only</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Alert Frequency</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFrequency('daily')}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  frequency === 'daily'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                Daily Email Digest
              </button>
              <button
                type="button"
                onClick={() => setFrequency('weekly')}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  frequency === 'weekly'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                Weekly Summary
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" className="font-bold">
              Save Job Alert
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
