import { useState, useEffect } from 'react';
import api from '../utils/api';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import { HiAcademicCap } from 'react-icons/hi';

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/programs').then(({ data }) => {
      if (data.success) setPrograms(data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <SEO title="Programs" description="Browse degree programs, eligibility criteria, and subjects at GDC Adilpur." />
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', padding: '3.5rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem' }}>Academic Programs</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Explore our degree and certificate programs</p>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          {programs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>No programs listed yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {programs.map((prog, idx) => (
                <div key={prog._id} className="card" style={{ animationDelay: `${idx * 0.08}s` }}>
                  <div className="card-body" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <HiAcademicCap style={{ fontSize: '1.25rem', color: 'var(--color-accent)' }} />
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{prog.name}</h3>
                    </div>
                    {prog.description && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>{prog.description}</p>}
                    {prog.eligibility && (
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Eligibility</h4>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', lineHeight: '1.6' }}>{prog.eligibility}</p>
                      </div>
                    )}
                    {prog.subjectsOffered?.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Subjects Offered</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                          {prog.subjectsOffered.filter(Boolean).map((sub, i) => (
                            <span key={i} className="badge badge-primary">{sub}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProgramsPage;

