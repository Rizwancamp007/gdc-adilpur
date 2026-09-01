import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { HiMail, HiPhone, HiLocationMarker, HiChevronRight, HiAcademicCap } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const [profile, setProfile] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/college-profile').then(({ data }) => {
      if (data.success) setProfile(data.data);
    }).catch(() => {});
  }, []);

  const quickLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/departments', label: 'Departments' },
    { to: '/programs', label: 'Programs' },
    { to: '/admissions', label: 'Admissions' },
    { to: '/notices', label: 'Notices' },
    { to: '/downloads', label: 'Downloads' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/success-stories', label: 'Success Stories' },
    { to: user ? '/admin' : '/admin/login', label: user ? 'Admin Dashboard' : 'Staff / Admin Login' },
  ];

  const socialIcons = [
    { key: 'facebook', icon: <FaFacebook />, url: profile?.socialLinks?.facebook || '#' },
    { key: 'twitter', icon: <FaTwitter />, url: profile?.socialLinks?.twitter || '#' },
    { key: 'youtube', icon: <FaYoutube />, url: profile?.socialLinks?.youtube || '#' },
    { key: 'instagram', icon: <FaInstagram />, url: profile?.socialLinks?.instagram || '#' },
  ];

  return (
    <footer style={{
      background: 'linear-gradient(180deg, var(--color-primary-dark) 0%, #0A1929 100%)',
      color: '#C5D9EC',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top Gold Gradient Line */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--color-accent), #E0B44F, var(--color-primary-light), var(--color-accent))' }} />

      {/* Main Footer Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 1.5rem 2.5rem 1.5rem' }}>
        <div className="grid-responsive" style={{ gridTemplateColumns: '1.2fr 1.5fr 1.1fr', gap: '3rem' }}>

          {/* College Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
              <img src="/gdc-logo.png" alt="GDC Adilpur" style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid var(--color-accent)', boxShadow: '0 0 15px rgba(200, 149, 46, 0.3)' }} />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>GDC Adilpur</h3>
                <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: '700' }}>Government Degree College</p>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.75', marginBottom: '1.5rem', color: '#A0AEC0' }}>
              {profile?.mission ? profile.mission.substring(0, 160) + (profile.mission.length > 160 ? '...' : '') : 'Fostering academic excellence, discipline, and modern education in District Ghotki, Sindh.'}
            </p>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {socialIcons.map((s) => (
                <a key={s.key} href={s.url} target="_blank" rel="noreferrer"
                  style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: '#C5D9EC',
                    fontSize: '1.125rem', transition: 'all 0.3s ease',
                    textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-accent)';
                    e.currentTarget.style.color = '#1A202C';
                    e.currentTarget.style.borderColor = 'var(--color-accent)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(200, 149, 46, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = '#C5D9EC';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links in 2 Columns */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#fff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.06em', position: 'relative', display: 'inline-block' }}>
              Quick Links
              <span style={{ display: 'block', width: '30px', height: '3px', background: 'var(--color-accent)', marginTop: '0.375rem', borderRadius: '2px' }} />
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem 1.25rem' }}>
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    fontSize: '0.875rem',
                    color: '#A0AEC0',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.25rem 0',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-accent)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#A0AEC0';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <HiChevronRight style={{ fontSize: '0.875rem', color: 'var(--color-accent)', flexShrink: 0 }} />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info & Affiliation Badge */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#fff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.06em', position: 'relative', display: 'inline-block' }}>
              Contact Details
              <span style={{ display: 'block', width: '30px', height: '3px', background: 'var(--color-accent)', marginTop: '0.375rem', borderRadius: '2px' }} />
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {profile?.address && (
                <div style={{ display: 'flex', gap: '0.625rem', fontSize: '0.875rem', color: '#A0AEC0', alignItems: 'flex-start' }}>
                  <HiLocationMarker style={{ flexShrink: 0, marginTop: '0.25rem', color: 'var(--color-accent)', fontSize: '1.125rem' }} />
                  <span style={{ lineHeight: '1.5' }}>{profile.address}</span>
                </div>
              )}
              {profile?.phone && (
                <div style={{ display: 'flex', gap: '0.625rem', fontSize: '0.875rem', color: '#A0AEC0', alignItems: 'center' }}>
                  <HiPhone style={{ flexShrink: 0, color: 'var(--color-accent)', fontSize: '1.125rem' }} />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile?.email && (
                <div style={{ display: 'flex', gap: '0.625rem', fontSize: '0.875rem', color: '#A0AEC0', alignItems: 'center' }}>
                  <HiMail style={{ flexShrink: 0, color: 'var(--color-accent)', fontSize: '1.125rem' }} />
                  <a href={`mailto:${profile.email}`} style={{ color: '#A0AEC0', textDecoration: 'none', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#A0AEC0'}
                  >
                    {profile.email}
                  </a>
                </div>
              )}
            </div>

            {/* Affiliated Board Card */}
            <div style={{ marginTop: '1.5rem', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(200, 149, 46, 0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <HiAcademicCap style={{ fontSize: '1.75rem', color: 'var(--color-accent)', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>Affiliation</p>
                <p style={{ fontSize: '0.875rem', color: '#fff', fontWeight: '600' }}>{profile?.compliance?.affiliatedBoard || 'Board of Intermediate & Secondary Education'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)', padding: '1.25rem 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.8125rem', color: '#718096' }}>
            © {new Date().getFullYear()} <strong style={{ color: '#A0AEC0' }}>Government Degree College Adilpur</strong>. All Rights Reserved.
          </p>
          <p style={{ fontSize: '0.75rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span>District Ghotki, Sindh, Pakistan</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
