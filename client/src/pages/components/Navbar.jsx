import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';
import SearchModal from '../../components/SearchModal';
import { HiMenuAlt3, HiX, HiLockClosed, HiViewGrid, HiSearch } from 'react-icons/hi';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/departments', label: 'Departments' },
  { to: '/programs', label: 'Programs' },
  { to: '/admissions', label: 'Admissions' },
  { to: '/notices', label: 'Notices' },
  { to: '/downloads', label: 'Downloads' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();

  const linkStyle = (isActive) => ({
    fontSize: '0.875rem',
    fontWeight: isActive ? '700' : '500',
    color: isActive ? 'var(--color-accent)' : 'var(--text-primary)',
    padding: '0.5rem 0',
    position: 'relative',
    transition: 'color var(--transition-fast)',
    textDecoration: 'none',
  });

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'background var(--transition-base)',
    }}>
      {/* Search Modal Overlay */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Top accent bar */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-secondary))' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', flexShrink: 0 }}>
            <img src="/gdc-logo.png" alt="GDC Adilpur Logo" style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-primary)', lineHeight: '1.2', letterSpacing: '-0.01em' }}>
                GDC Adilpur
              </div>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Government Degree College
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'}
                style={({ isActive }) => linkStyle(isActive)}
              >
                {({ isActive }) => (
                  <span>
                    {link.label}
                    {isActive && (
                      <span style={{ position: 'absolute', bottom: '-2px', left: 0, right: 0, height: '2px', background: 'var(--color-accent)', borderRadius: '1px' }} />
                    )}
                  </span>
                )}
              </NavLink>
            ))}

            {/* Global Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="btn btn-ghost btn-icon"
              style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}
              title="Search Notices, Programs & Downloads (Ctrl + K)"
              aria-label="Search"
            >
              <HiSearch />
            </button>

            {user ? (
              <Link
                to="/admin"
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.875rem',
                  fontSize: '0.8125rem',
                  fontWeight: '600',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                title={`Signed in as ${user.name} (${user.role}) - Go to Dashboard`}
              >
                <HiViewGrid style={{ fontSize: '0.9375rem' }} />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="btn btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8125rem',
                  fontWeight: '600',
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  borderRadius: 'var(--radius-md)',
                }}
                title="Staff / Admin Portal Login"
              >
                <HiLockClosed style={{ fontSize: '0.875rem' }} />
                <span>Portal Login</span>
              </Link>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile Toggle */}
          <div className="mobile-nav-toggle">
            <button
              onClick={() => setSearchOpen(true)}
              className="btn btn-ghost btn-icon"
              style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}
              title="Search"
              aria-label="Search"
            >
              <HiSearch />
            </button>
            <ThemeToggle />
            <button className="btn btn-ghost btn-icon" onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu" style={{ fontSize: '1.5rem' }}>
              {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="animate-slide-up" style={{
          position: 'absolute', top: '73px', left: 0, right: 0,
          background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-lg)', padding: '1rem 1.5rem', zIndex: 99,
        }}>
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'block', padding: '0.75rem 0',
                fontSize: '0.9375rem', fontWeight: isActive ? '700' : '500',
                color: isActive ? 'var(--color-accent)' : 'var(--text-primary)',
                borderBottom: '1px solid var(--border-light)', textDecoration: 'none',
              })}
            >
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                padding: '0.75rem',
                background: 'var(--color-accent)',
                color: '#1A202C',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '0.875rem',
              }}
            >
              <HiViewGrid /> Go to Dashboard ({user.name})
            </Link>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                padding: '0.75rem',
                background: 'var(--color-primary)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.875rem',
              }}
            >
              <HiLockClosed /> Staff / Admin Portal Login
            </Link>
          )}
        </div>
      )}

      <style>{`
        .mobile-nav-toggle { display: none; align-items: center; gap: 0.5rem; }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
