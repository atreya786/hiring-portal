'use client';

import React, { useState, useEffect } from 'react';
import { getCompanyById, updateCompany } from '../../../lib/services';
import { Company } from '../../../lib/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useToast } from '../../../lib/context/ToastContext';
import { Building2, Save, MapPin, Globe, ShieldCheck, Plus, Trash2 } from 'lucide-react';

export default function EmployerCompanySettingsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newPerk, setNewPerk] = useState('');
  const { success } = useToast();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getCompanyById('comp_sallet');
        setCompany(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !company) {
    return <div className="p-8 text-center text-slate-500">Loading company settings...</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCompany(company.id, company);
      success('Company Profile Saved', 'Updated employer branding details.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPerk = () => {
    if (newPerk.trim()) {
      setCompany({
        ...company,
        benefits: [...company.benefits, newPerk.trim()],
      });
      setNewPerk('');
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Employer Branding & Profile</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Showcase your company mission, office locations, and benefits to candidates.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSaving}
          className="font-bold px-6 shadow-md shadow-indigo-600/20"
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Company Profile
        </Button>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span>General Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            value={company.name}
            onChange={(e) => setCompany({ ...company, name: e.target.value })}
            required
          />

          <Input
            label="Industry Domain"
            value={company.industry}
            onChange={(e) => setCompany({ ...company, industry: e.target.value })}
            required
          />

          <Input
            label="Website URL"
            value={company.website}
            onChange={(e) => setCompany({ ...company, website: e.target.value })}
            leftIcon={<Globe className="w-4 h-4" />}
          />

          <Input
            label="Headquarters Location"
            value={company.location}
            onChange={(e) => setCompany({ ...company, location: e.target.value })}
            leftIcon={<MapPin className="w-4 h-4" />}
          />

          <Input
            label="Company Size"
            value={company.size}
            onChange={(e) => setCompany({ ...company, size: e.target.value })}
          />

          <Input
            label="Founded Year"
            type="number"
            value={company.foundedYear}
            onChange={(e) => setCompany({ ...company, foundedYear: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">Tagline / Mission</label>
          <Input
            value={company.tagline}
            onChange={(e) => setCompany({ ...company, tagline: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">About the Company</label>
          <textarea
            rows={4}
            value={company.about}
            onChange={(e) => setCompany({ ...company, about: e.target.value })}
            className="w-full bg-white text-xs sm:text-sm text-slate-900 rounded-lg border border-slate-200 p-3 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Perks and Benefits */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider">
          Employee Benefits & Perks
        </h2>

        <div className="flex gap-2 max-w-md">
          <Input
            value={newPerk}
            onChange={(e) => setNewPerk(e.target.value)}
            placeholder="e.g. Annual Gym Stipend..."
          />
          <Button type="button" variant="outline" onClick={handleAddPerk} leftIcon={<Plus className="w-4 h-4" />}>
            Add
          </Button>
        </div>

        <div className="space-y-2 pt-2">
          {company.benefits.map((b, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
              <span>&bull; {b}</span>
              <button
                type="button"
                onClick={() => setCompany({ ...company, benefits: company.benefits.filter((_, idx) => idx !== i) })}
                className="text-slate-400 hover:text-rose-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" variant="primary" size="lg" isLoading={isSaving} className="font-bold px-8 shadow-md">
          Save All Changes
        </Button>
      </div>
    </form>
  );
}
