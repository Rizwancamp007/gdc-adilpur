import { useState, useEffect } from 'react';
import useCrud from '../../hooks/useCrud';
import { HiSave, HiOfficeBuilding } from 'react-icons/hi';
import toast from 'react-hot-toast';

const CollegeProfilePage = () => {
  const { loading, fetchSingleton, updateSingleton } = useCrud('/college-profile', { autoFetch: false });
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const data = await fetchSingleton();
    if (data) setFormData(data);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] || {}), [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSingleton(formData);
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading profile...</div>;
  }

  const inputStyle = { marginBottom: '1rem' };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <HiOfficeBuilding style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>College Profile</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
          {/* Basic Info */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>Basic Information</h3>
            <div style={inputStyle}>
              <label className="form-label">College Name</label>
              <input className="form-input" value={formData.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
            </div>
            <div style={inputStyle}>
              <label className="form-label">Address</label>
              <input className="form-input" value={formData.address || ''} onChange={(e) => handleChange('address', e.target.value)} />
            </div>
            <div style={inputStyle}>
              <label className="form-label">Phone</label>
              <input className="form-input" value={formData.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
            </div>
            <div style={inputStyle}>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
            </div>
            <div style={inputStyle}>
              <label className="form-label">Established Year</label>
              <input className="form-input" type="number" value={formData.establishedYear || ''} onChange={(e) => handleChange('establishedYear', e.target.value ? Number(e.target.value) : null)} />
            </div>
          </div>

          {/* Mission & Vision */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>Mission & Vision</h3>
            <div style={inputStyle}>
              <label className="form-label">Mission</label>
              <textarea className="form-textarea" rows={4} value={formData.mission || ''} onChange={(e) => handleChange('mission', e.target.value)} />
            </div>
            <div style={inputStyle}>
              <label className="form-label">Vision</label>
              <textarea className="form-textarea" rows={4} value={formData.vision || ''} onChange={(e) => handleChange('vision', e.target.value)} />
            </div>
            <div style={inputStyle}>
              <label className="form-label">History</label>
              <textarea className="form-textarea" rows={4} value={formData.history || ''} onChange={(e) => handleChange('history', e.target.value)} />
            </div>
          </div>

          {/* Compliance */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>Compliance & Affiliation</h3>
            <div style={inputStyle}>
              <label className="form-label">Affiliated Board/University</label>
              <input className="form-input" value={formData.compliance?.affiliatedBoard || ''} onChange={(e) => handleNestedChange('compliance', 'affiliatedBoard', e.target.value)} />
            </div>
            <div style={inputStyle}>
              <label className="form-label">Regulatory Notes</label>
              <textarea className="form-textarea" rows={3} value={formData.compliance?.regulatoryNotes || ''} onChange={(e) => handleNestedChange('compliance', 'regulatoryNotes', e.target.value)} />
            </div>
          </div>

          {/* Social Links */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>Social Links</h3>
            {['facebook', 'twitter', 'youtube', 'instagram'].map((platform) => (
              <div key={platform} style={inputStyle}>
                <label className="form-label" style={{ textTransform: 'capitalize' }}>{platform}</label>
                <input className="form-input" type="url" placeholder={`https://${platform}.com/...`} value={formData.socialLinks?.[platform] || ''} onChange={(e) => handleNestedChange('socialLinks', platform, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div style={{ marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            <HiSave /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollegeProfilePage;
