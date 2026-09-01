import { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { HiLockClosed, HiEye, HiEyeOff, HiCheckCircle, HiExclamationCircle, HiShieldCheck } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const SettingsPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Real-time Password Strength Meter Calculation
  const checkStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) score++;
    return score;
  };

  const strengthScore = checkStrength(formData.newPassword);

  const getStrengthLabel = () => {
    if (!formData.newPassword) return { label: '', color: 'transparent' };
    if (strengthScore <= 2) return { label: 'Weak', color: 'var(--color-danger)' };
    if (strengthScore <= 4) return { label: 'Medium', color: 'var(--color-warning)' };
    return { label: 'Strong', color: 'var(--color-success)' };
  };

  const strengthInfo = getStrengthLabel();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (strengthScore < 5) {
      toast.error('Password must meet all security requirements');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (res.data.success) {
        toast.success('Password changed successfully');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <HiShieldCheck style={{ color: 'var(--color-accent)' }} /> Security Settings
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Manage password and security preferences for <strong>{user?.name}</strong> ({user?.role})
        </p>
      </div>

      {/* Account Info Card */}
      <div className="card glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Account Credentials
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>FULL NAME</label>
            <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user?.name}</p>
          </div>
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>EMAIL ADDRESS</label>
            <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user?.email}</p>
          </div>
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>SYSTEM ROLE</label>
            <span className={`badge ${user?.role === 'Admin' ? 'badge-primary' : 'badge-info'}`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="card glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <HiLockClosed style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Change Password
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">
              Current Password <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrent ? 'text' : 'password'}
                className="form-input"
                required
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                placeholder="Enter current password"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '1.125rem' }}
              >
                {showCurrent ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">
              New Password <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNew ? 'text' : 'password'}
                className="form-input"
                required
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="Enter strong new password"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '1.125rem' }}
              >
                {showNew ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Password Strength:</span>
                  <span style={{ color: strengthInfo.color }}>{strengthInfo.label}</span>
                </div>
                <div style={{ height: '6px', width: '100%', background: 'var(--bg-muted)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(strengthScore / 5) * 100}%`,
                      background: strengthInfo.color,
                      transition: 'all 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              Confirm New Password <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                className="form-input"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '1.125rem' }}
              >
                {showConfirm ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
          </div>

          {/* Security Rules Checklist */}
          <div style={{ background: 'var(--bg-body)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.8125rem' }}>
            <p style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Password Requirements:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.375rem' }}>
              <RequirementItem met={formData.newPassword.length >= 8} label="At least 8 characters long" />
              <RequirementItem met={/[A-Z]/.test(formData.newPassword)} label="One uppercase letter (A-Z)" />
              <RequirementItem met={/[a-z]/.test(formData.newPassword)} label="One lowercase letter (a-z)" />
              <RequirementItem met={/[0-9]/.test(formData.newPassword)} label="One number (0-9)" />
              <RequirementItem met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.newPassword)} label="One special character (!@#$...)" />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-accent"
            disabled={submitting}
            style={{ width: '100%', padding: '0.75rem', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          >
            <HiShieldCheck style={{ fontSize: '1.25rem' }} />
            {submitting ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

const RequirementItem = ({ met, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: met ? 'var(--color-success)' : 'var(--text-muted)' }}>
    {met ? <HiCheckCircle style={{ color: 'var(--color-success)', flexShrink: 0 }} /> : <HiExclamationCircle style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
    <span>{label}</span>
  </div>
);

export default SettingsPage;
