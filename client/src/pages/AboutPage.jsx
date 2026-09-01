import { useState, useEffect } from 'react';
import api from '../utils/api';
import { HiAcademicCap, HiEye, HiFlag, HiUserCircle, HiBookOpen } from 'react-icons/hi';
import SEO from '../components/SEO';
import Loader from '../components/Loader';

const SectionHeader = ({ tagline, title }) => (
  <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: '700', marginBottom: '0.375rem' }}>{tagline}</p>
    <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>{title}</h2>
  </div>
);

const AboutPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/college-profile').then(({ data }) => {
      if (data.success) setProfile(data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading about page..." />;

  const dir = profile?.directorMessage;

  return (
    <div>
      <SEO title="About Us" description="Learn about Government Degree College Adilpur — our history, mission, vision, and leadership." />
      {/* Page Header Banner */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', padding: '3.5rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem' }}>About Us</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>{profile?.name || 'Government Degree College Adilpur'}</p>
      </section>

      {/* History */}
      {profile?.history && (
        <section className="section-padding" style={{ background: 'var(--bg-surface)' }}>
          <div className="container-custom" style={{ maxWidth: '800px' }}>
            <SectionHeader tagline="Our Story" title="History" />
            <div className="card" style={{ padding: '2rem' }}>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{profile.history}</p>
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      <section className="section-padding" style={{ background: 'var(--bg-body)' }}>
        <div className="container-custom">
          <SectionHeader tagline="What We Stand For" title="Mission & Vision" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {profile?.mission && (
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HiFlag style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Our Mission</h3>
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{profile.mission}</p>
              </div>
            )}
            {profile?.vision && (
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HiEye style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Our Vision</h3>
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{profile.vision}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Director's Full Message */}
      {dir?.name && (
        <section className="section-padding" style={{ background: 'var(--bg-surface)' }}>
          <div className="container-custom" style={{ maxWidth: '900px' }}>
            <SectionHeader tagline="From the Leadership" title="Principal's Message" />
            <div className="card" style={{ padding: '2.5rem' }}>
              <div className="director-grid" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'center' }}>
                  {dir.photoUrl ? (
                    <img src={dir.photoUrl} alt={dir.name} style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '50%', border: '4px solid var(--color-accent)', boxShadow: 'var(--shadow-lg)' }} />
                  ) : (
                    <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <HiUserCircle style={{ fontSize: '4rem', color: 'var(--text-muted)' }} />
                    </div>
                  )}
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.75rem' }}>{dir.name}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-accent)', fontWeight: '500' }}>{dir.designation}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.9', whiteSpace: 'pre-wrap' }}>{dir.message}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Compliance & Affiliation */}
      {profile?.compliance?.affiliatedBoard && (
        <section className="section-padding" style={{ background: 'var(--bg-body)' }}>
          <div className="container-custom" style={{ maxWidth: '700px' }}>
            <SectionHeader tagline="Recognition" title="Affiliation & Compliance" />
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <HiBookOpen style={{ fontSize: '1.75rem', color: '#fff' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Affiliated With</h3>
              <p style={{ fontSize: '1.125rem', color: 'var(--color-primary)', fontWeight: '600' }}>{profile.compliance.affiliatedBoard}</p>
              {profile.compliance.regulatoryNotes && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: '1.7' }}>{profile.compliance.regulatoryNotes}</p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutPage;
