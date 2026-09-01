import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import { HiInformationCircle, HiClipboardList, HiCalendar, HiCurrencyDollar } from 'react-icons/hi';

const AdmissionsPage = () => {
  const [info, setInfo] = useState(null);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get('/admissions-info'),
      api.get('/fee-schemes'),
    ]).then(([infoR, feesR]) => {
      if (infoR.status === 'fulfilled') setInfo(infoR.value.data.data);
      if (feesR.status === 'fulfilled') setFees(feesR.value.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const sections = [
    { icon: <HiClipboardList />, title: 'Eligibility Criteria', content: info?.eligibilityText, color: 'var(--color-primary)' },
    { icon: <HiInformationCircle />, title: 'How to Apply', content: info?.howToApplyText, color: 'var(--color-secondary)' },
    { icon: <HiCalendar />, title: 'Important Dates', content: info?.importantDatesText, color: 'var(--color-accent)' },
  ].filter((s) => s.content);

  return (
    <div>
      <SEO title="Admissions" description="Admission requirements, fee structure, and application process at GDC Adilpur." />
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', padding: '3.5rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem' }}>Admissions</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Everything you need to know about joining GDC Adilpur</p>
      </section>

      {/* Info Sections */}
      {sections.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--bg-body)' }}>
          <div className="container-custom">
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {sections.map((sec, idx) => (
                <div key={idx} className="card" style={{ borderLeft: `4px solid ${sec.color}`, animationDelay: `${idx * 0.1}s` }}>
                  <div className="card-body" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '1.5rem', color: sec.color }}>{sec.icon}</div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{sec.title}</h2>
                    </div>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{sec.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fee Schemes */}
      {fees.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--bg-surface)' }}>
          <div className="container-custom">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: '700', marginBottom: '0.375rem' }}>Fee Structure</p>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>Fee Schemes</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {fees.map((fee, idx) => {
                const total = (fee.feeBreakdown || []).reduce((s, f) => s + (f.amount || 0), 0);
                return (
                  <div key={fee._id} className="card" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)' }}>{fee.programName}</h3>
                      {fee.effectiveYear && <span className="badge badge-info">{fee.effectiveYear}</span>}
                    </div>
                    <div style={{ padding: '1rem 1.5rem' }}>
                      {(fee.feeBreakdown || []).map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: i < fee.feeBreakdown.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>PKR {(item.amount || 0).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Total</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-primary)' }}>PKR {total.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'var(--color-accent)', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-on-accent)', marginBottom: '0.75rem' }}>Ready to Apply?</h3>
        <p style={{ color: 'var(--text-on-accent)', opacity: 0.85, marginBottom: '1.25rem' }}>Visit the college or download the admission form to get started.</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/downloads" className="btn btn-primary btn-lg">Download Forms</Link>
          <Link to="/contact" className="btn btn-lg" style={{ background: 'rgba(0,0,0,0.15)', color: '#fff', border: '1px solid rgba(0,0,0,0.2)' }}>Contact Us</Link>
        </div>
      </section>
    </div>
  );
};

export default AdmissionsPage;

