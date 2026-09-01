import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';
import toast from 'react-hot-toast';
import {
  HiHome, HiPhotograph, HiUserCircle, HiSpeakerphone,
  HiAcademicCap, HiCurrencyDollar, HiDocumentText, HiDownload,
  HiStar, HiCamera, HiChatAlt2, HiMail, HiChartBar,
  HiCollection, HiUsers, HiClipboardList, HiLogout,
  HiMenuAlt2, HiX, HiChevronLeft, HiOfficeBuilding,
  HiInformationCircle, HiCog, HiGlobeAlt
} from 'react-icons/hi';

const sidebarItems = [
  { label: 'Public Website', path: '/', icon: HiGlobeAlt, external: true },
  { label: 'Dashboard', path: '/admin', icon: HiHome, end: true },
  { label: 'College Profile', path: '/admin/college-profile', icon: HiOfficeBuilding },
  { label: 'Hero Slides', path: '/admin/hero-slides', icon: HiPhotograph },
  { label: 'Director Message', path: '/admin/director-message', icon: HiUserCircle },
  { label: 'Departments & Faculty', path: '/admin/departments-faculty', icon: HiAcademicCap },
  { label: 'Programs', path: '/admin/programs', icon: HiAcademicCap },
  { label: 'Admissions Info', path: '/admin/admissions-info', icon: HiInformationCircle },
  { label: 'Fee Schemes', path: '/admin/fee-schemes', icon: HiCurrencyDollar, adminOnly: true },
  { label: 'Notices', path: '/admin/notices', icon: HiSpeakerphone },
  { label: 'Downloads', path: '/admin/downloads', icon: HiDownload },
  { label: 'Success Stories', path: '/admin/success-stories', icon: HiStar },
  { label: 'Gallery', path: '/admin/gallery', icon: HiCamera },
  { label: 'Feedback', path: '/admin/feedback', icon: HiChatAlt2 },
  { label: 'Messages', path: '/admin/messages', icon: HiMail },
  { label: 'Stats', path: '/admin/stats', icon: HiChartBar },
  { label: 'Pages', path: '/admin/pages', icon: HiCollection },
  { label: 'Users', path: '/admin/users', icon: HiUsers, adminOnly: true },
  { label: 'Activity Log', path: '/admin/activity-log', icon: HiClipboardList, adminOnly: true },
  { label: 'Settings', path: '/admin/settings', icon: HiCog },
];

const AdminLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  const filteredItems = sidebarItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-body)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
            display: 'block',
          }}
          className="lg-hide-overlay"
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? '72px' : '260px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-base), transform var(--transition-base)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : '',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
        className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
      >
        {/* Logo Area */}
        <div style={{
          padding: collapsed ? '1.25rem 0.75rem' : '1.25rem 1.25rem',
          borderBottom: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: '64px',
        }}>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <h2 style={{
                fontSize: '0.9375rem',
                fontWeight: '700',
                color: 'var(--color-primary)',
                whiteSpace: 'nowrap',
              }}>
                GDC Adilpur
              </h2>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              setSidebarOpen(false);
            }}
            className="btn btn-ghost btn-icon"
            style={{ flexShrink: 0, fontSize: '1.125rem' }}
            aria-label="Toggle sidebar"
          >
            <HiChevronLeft style={{
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform var(--transition-fast)',
            }} />
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', overflowY: 'auto' }}>
          {filteredItems.map((item) => item.external ? (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? '0' : '0.75rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '0.625rem' : '0.625rem 0.875rem',
                marginBottom: '6px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--color-primary)',
                background: 'var(--color-primary-50)',
                border: '1px solid var(--color-primary-100)',
                transition: 'all var(--transition-fast)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
              title={collapsed ? item.label : undefined}
            >
              <item.icon style={{ fontSize: '1.125rem', flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? '0' : '0.75rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '0.625rem' : '0.625rem 0.875rem',
                marginBottom: '2px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: isActive ? '600' : '500',
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--color-primary-50)' : 'transparent',
                transition: 'all var(--transition-fast)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              })}
              title={collapsed ? item.label : undefined}
            >
              <item.icon style={{ fontSize: '1.125rem', flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Info + Logout */}
        <div style={{
          padding: collapsed ? '0.75rem' : '0.75rem 1rem',
          borderTop: '1px solid var(--border-default)',
        }}>
          {!collapsed && user && (
            <div style={{
              marginBottom: '0.5rem',
              padding: '0.5rem 0.625rem',
              background: 'var(--bg-muted)',
              borderRadius: 'var(--radius-md)',
            }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-primary)' }}>{user.name}</p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>{user.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="btn btn-ghost"
            style={{
              width: '100%',
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: 'var(--color-danger)',
              fontSize: '0.875rem',
            }}
            title="Logout"
          >
            <HiLogout style={{ fontSize: '1.125rem' }} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: collapsed ? '72px' : '260px',
        transition: 'margin-left var(--transition-base)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
        className="admin-main"
      >
        {/* Top Bar */}
        <header style={{
          height: '64px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-ghost btn-icon mobile-menu-btn"
            style={{ fontSize: '1.25rem', display: 'none' }}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <HiX /> : <HiMenuAlt2 />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/"
              className="btn btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.8125rem',
                padding: '0.375rem 0.875rem',
                borderColor: 'var(--border-strong)',
                color: 'var(--text-primary)',
              }}
              title="Return to public website"
            >
              <HiGlobeAlt style={{ fontSize: '1rem', color: 'var(--color-primary)' }} />
              <span>Public Website</span>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, padding: '1.5rem' }}>
          <Outlet />
        </div>
      </main>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1024px) {
          .admin-sidebar {
            transform: translateX(-100%);
            width: 260px !important;
          }
          .admin-sidebar.sidebar-open {
            transform: translateX(0) !important;
          }
          .admin-main {
            margin-left: 0 !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
