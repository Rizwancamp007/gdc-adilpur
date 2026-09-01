import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import {
  HiSpeakerphone, HiMail, HiChatAlt2, HiUsers,
  HiAcademicCap, HiPhotograph, HiDocumentText, HiStar,
  HiClipboardList, HiArrowRight
} from 'react-icons/hi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    notices: 0, messages: 0, unreadMessages: 0,
    feedback: 0, newFeedback: 0, faculty: 0,
    departments: 0, programs: 0, downloads: 0,
    successStories: 0, gallery: 0, heroSlides: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        noticesRes, messagesRes, feedbackRes, facultyRes,
        deptsRes, progsRes, downloadsRes, storiesRes,
        galleryRes, slidesRes, activityRes,
      ] = await Promise.allSettled([
        api.get('/notices?limit=1'),
        api.get('/contact-messages?limit=1'),
        api.get('/feedback?limit=1'),
        api.get('/faculty?limit=1'),
        api.get('/departments?limit=1'),
        api.get('/programs?limit=1'),
        api.get('/downloads?limit=1'),
        api.get('/success-stories?limit=1'),
        api.get('/gallery?limit=1'),
        api.get('/hero-slides?limit=1'),
        api.get('/activity-log?limit=5'),
      ]);

      const get = (res) => res.status === 'fulfilled' ? res.value.data : {};

      setStats({
        notices: get(noticesRes).total || 0,
        messages: get(messagesRes).total || 0,
        unreadMessages: get(messagesRes).data?.filter?.(m => m.status === 'Unread')?.length || 0,
        feedback: get(feedbackRes).total || 0,
        newFeedback: get(feedbackRes).data?.filter?.(f => f.status === 'New')?.length || 0,
        faculty: get(facultyRes).total || 0,
        departments: get(deptsRes).total || 0,
        programs: get(progsRes).total || 0,
        downloads: get(downloadsRes).total || 0,
        successStories: get(storiesRes).total || 0,
        gallery: get(galleryRes).total || 0,
        heroSlides: get(slidesRes).total || 0,
      });

      if (activityRes.status === 'fulfilled') {
        setRecentActivity(activityRes.value.data.data || []);
      }
    } catch (e) {
      console.error('Dashboard load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const quickCards = [
    { label: 'Notices', value: stats.notices, icon: HiSpeakerphone, path: '/admin/notices', color: '#3182CE' },
    { label: 'Messages', value: stats.messages, icon: HiMail, path: '/admin/messages', color: '#D69E2E', badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : null },
    { label: 'Feedback', value: stats.feedback, icon: HiChatAlt2, path: '/admin/feedback', color: '#E53E3E', badge: stats.newFeedback > 0 ? `${stats.newFeedback} new` : null },
    { label: 'Faculty', value: stats.faculty, icon: HiUsers, path: '/admin/departments-faculty', color: '#38A169' },
    { label: 'Departments', value: stats.departments, icon: HiAcademicCap, path: '/admin/departments-faculty', color: '#805AD5' },
    { label: 'Programs', value: stats.programs, icon: HiAcademicCap, path: '/admin/programs', color: '#DD6B20' },
    { label: 'Downloads', value: stats.downloads, icon: HiDocumentText, path: '/admin/downloads', color: '#2B6CB0' },
    { label: 'Gallery', value: stats.gallery, icon: HiPhotograph, path: '/admin/gallery', color: '#D53F8C' },
    { label: 'Success Stories', value: stats.successStories, icon: HiStar, path: '/admin/success-stories', color: '#C8952E' },
    { label: 'Hero Slides', value: stats.heroSlides, icon: HiPhotograph, path: '/admin/hero-slides', color: '#319795' },
  ];

  const actionBadge = (action) => {
    const map = { create: 'badge-success', update: 'badge-info', delete: 'badge-danger', login: 'badge-primary', logout: 'badge-warning' };
    return <span className={`badge ${map[action] || 'badge-primary'}`} style={{ textTransform: 'capitalize' }}>{action}</span>;
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-default)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        Loading dashboard...
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Welcome */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Welcome back, {user?.name || 'Admin'}
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9375rem' }}>
          GDC Adilpur Admin Dashboard — manage your college website content from here.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {quickCards.map((card) => (
          <div key={card.label} onClick={() => navigate(card.path)}
            style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)', padding: '1.25rem', cursor: 'pointer',
              transition: 'all var(--transition-base)', position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.borderColor = card.color; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <card.icon style={{ fontSize: '1.5rem', color: card.color }} />
              {card.badge && <span className="badge badge-warning" style={{ fontSize: '0.625rem' }}>{card.badge}</span>}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.125rem' }}>
              {card.value}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
              {card.label}
            </div>
            {/* Accent bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: card.color, opacity: 0.6 }} />
          </div>
        ))}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
        {/* Quick Actions */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Add a Notice', path: '/admin/notices' },
              { label: 'Update College Profile', path: '/admin/college-profile' },
              { label: 'Upload to Gallery', path: '/admin/gallery' },
              { label: 'Manage Hero Slides', path: '/admin/hero-slides' },
              { label: 'Check Messages', path: '/admin/messages' },
            ].map((action) => (
              <button key={action.label} className="btn btn-ghost"
                style={{ justifyContent: 'space-between', width: '100%', textAlign: 'left' }}
                onClick={() => navigate(action.path)}
              >
                <span>{action.label}</span>
                <HiArrowRight style={{ fontSize: '0.875rem' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>Recent Activity</h3>
            {user?.role === 'Admin' && (
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/activity-log')}>
                View All <HiArrowRight />
              </button>
            )}
          </div>
          {recentActivity.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No recent activity.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentActivity.map((log) => (
                <div key={log._id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.125rem' }}>
                      <span style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-primary)' }}>{log.userName}</span>
                      {actionBadge(log.action)}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.description}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
