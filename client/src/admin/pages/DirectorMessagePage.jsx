import { useState, useEffect } from 'react';
import useCrud from '../../hooks/useCrud';
import { HiSave, HiUserCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const DirectorMessagePage = () => {
  const { loading, fetchSingleton, updateSingleton } = useCrud('/college-profile', { autoFetch: false });
  const [formData, setFormData] = useState({ name: '', designation: '', photoUrl: '', message: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const profile = await fetchSingleton();
    if (profile?.directorMessage) setFormData(profile.directorMessage);
  };

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSingleton({ directorMessage: formData });
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <HiUserCircle style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>Director / Principal's Message</h1>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', maxWidth: '900px' }}>
        {/* Form */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="e.g. Prof. Ahmed Khan" />
            </div>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input className="form-input" value={formData.designation} onChange={(e) => handleChange('designation', e.target.value)} placeholder="e.g. Principal" />
            </div>
            <div className="form-group">
              <label className="form-label">Photo URL</label>
              <input className="form-input" type="url" value={formData.photoUrl} onChange={(e) => handleChange('photoUrl', e.target.value)} placeholder="https://res.cloudinary.com/..." />
              <p className="form-hint">Upload photo to Cloudinary and paste the URL</p>
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-textarea" rows={8} value={formData.message} onChange={(e) => handleChange('message', e.target.value)} placeholder="The director's welcome message..." />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <HiSave /> {saving ? 'Saving...' : 'Save Message'}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-tertiary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Preview</h3>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            {formData.photoUrl ? (
              <img src={formData.photoUrl} alt={formData.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', border: '3px solid var(--border-default)', margin: '0 auto' }} />
            ) : (
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'var(--text-muted)', fontSize: '2rem' }}>
                <HiUserCircle />
              </div>
            )}
          </div>
          <h4 style={{ textAlign: 'center', fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{formData.name || 'Director Name'}</h4>
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>{formData.designation || 'Designation'}</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{formData.message || 'The message will appear here...'}</p>
        </div>
      </div>
    </div>
  );
};

export default DirectorMessagePage;
