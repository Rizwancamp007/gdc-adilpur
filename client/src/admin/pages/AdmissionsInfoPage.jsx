import { useState, useEffect } from 'react';
import useCrud from '../../hooks/useCrud';
import { HiSave, HiInformationCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdmissionsInfoPage = () => {
  const { loading, fetchSingleton, updateSingleton } = useCrud('/admissions-info', { autoFetch: false });
  const [formData, setFormData] = useState({ eligibilityText: '', howToApplyText: '', importantDatesText: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => { const d = await fetchSingleton(); if (d) setFormData(d); };
  const handleChange = (f, v) => setFormData((p) => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await updateSingleton(formData); }
    catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <HiInformationCircle style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>Admissions Information</h1>
      </div>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', maxWidth: '720px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Eligibility Criteria</label>
            <textarea className="form-textarea" rows={5} value={formData.eligibilityText || ''} onChange={(e) => handleChange('eligibilityText', e.target.value)} placeholder="Who is eligible to apply..." />
          </div>
          <div className="form-group">
            <label className="form-label">How to Apply</label>
            <textarea className="form-textarea" rows={5} value={formData.howToApplyText || ''} onChange={(e) => handleChange('howToApplyText', e.target.value)} placeholder="Application process steps..." />
          </div>
          <div className="form-group">
            <label className="form-label">Important Dates</label>
            <textarea className="form-textarea" rows={5} value={formData.importantDatesText || ''} onChange={(e) => handleChange('importantDatesText', e.target.value)} placeholder="Key dates for admissions..." />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <HiSave /> {saving ? 'Saving...' : 'Save Information'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdmissionsInfoPage;
