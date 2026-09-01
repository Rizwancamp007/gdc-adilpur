import { useState, useEffect } from 'react';
import useCrud from '../../hooks/useCrud';
import { HiSave, HiChartBar, HiAcademicCap, HiUserGroup, HiOfficeBuilding, HiTrendingUp, HiGlobeAlt } from 'react-icons/hi';
import toast from 'react-hot-toast';

const StatsPage = () => {
  const { loading, fetchSingleton, updateSingleton } = useCrud('/college-profile', { autoFetch: false });
  const [stats, setStats] = useState({
    studentCount: 0,
    facultyCount: 0,
    departmentCount: 0,
    passPercentage: 95,
    campusArea: '15 Acres',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const d = await fetchSingleton();
    if (d?.stats) {
      setStats({
        studentCount: d.stats.studentCount ?? 0,
        facultyCount: d.stats.facultyCount ?? 0,
        departmentCount: d.stats.departmentCount ?? 0,
        passPercentage: d.stats.passPercentage ?? 95,
        campusArea: d.stats.campusArea ?? '15 Acres',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSingleton({ stats });
      toast.success('Stats updated successfully');
    } catch {
      toast.error('Failed to update stats');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
        <div style={{
          width: '36px', height: '36px', border: '3px solid var(--border-default)',
          borderTopColor: 'var(--color-primary)', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
        }} />
        Loading stats...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const statFields = [
    { key: 'studentCount', label: 'Total Students', icon: HiAcademicCap, type: 'number', color: 'var(--color-primary)' },
    { key: 'facultyCount', label: 'Faculty Members', icon: HiUserGroup, type: 'number', color: 'var(--color-secondary)' },
    { key: 'departmentCount', label: 'Departments', icon: HiOfficeBuilding, type: 'number', color: 'var(--color-accent)' },
    { key: 'passPercentage', label: 'Pass Percentage (%)', icon: HiTrendingUp, type: 'number', color: 'var(--color-success)' },
    { key: 'campusArea', label: 'Campus Area', icon: HiGlobeAlt, type: 'text', color: 'var(--color-info)' },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <HiChartBar style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>Home Page Statistics</h1>
      </div>
      <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        These numbers appear as animated counters on the public home page. Update them to reflect current academic data.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', maxWidth: '800px' }}>
          {statFields.map((f, idx) => (
            <div
              key={f.key}
              className="card-elevated"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem 1.25rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                animation: `slideUp 0.5s ease ${idx * 0.08}s both`,
              }}
            >
              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: f.color,
              }} />
              <f.icon style={{ fontSize: '2rem', color: f.color, marginBottom: '0.75rem' }} />
              <label className="form-label" style={{ textAlign: 'center', display: 'block', fontSize: '0.8125rem' }}>{f.label}</label>
              <input
                className="form-input"
                type={f.type || 'number'}
                min={f.type === 'number' ? '0' : undefined}
                value={stats[f.key] ?? ''}
                onChange={(e) => setStats((p) => ({
                  ...p,
                  [f.key]: f.type === 'number' ? Number(e.target.value) || 0 : e.target.value,
                }))}
                style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '700', marginTop: '0.5rem' }}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            <HiSave /> {saving ? 'Saving...' : 'Save Statistics'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatsPage;
