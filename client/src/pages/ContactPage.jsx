import { useState, useEffect } from 'react';
import api from '../utils/api';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { HiMail, HiPhone, HiLocationMarker, HiPaperAirplane } from 'react-icons/hi';

const ContactPage = () => {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState('contact'); // contact | feedback | grievance
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [feedbackData, setFeedbackData] = useState({ name: '', email: '', message: '', type: 'Feedback' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/college-profile').then(({ data }) => {
      if (data.success) setProfile(data.data);
    }).catch(() => {});
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/public/contact', formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send');
    } finally { setLoading(false); }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/public/feedback', feedbackData);
      toast.success(`${feedbackData.type} submitted successfully!`);
      setFeedbackData({ name: '', email: '', message: '', type: feedbackData.type });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <SEO title="Contact Us" description="Get in touch with Government Degree College Adilpur. Send messages, feedback, or grievances." />
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', padding: '3.5rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem' }}>Contact Us</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>We'd love to hear from you</p>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Get in Touch</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                {profile?.address && (
                  <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <HiLocationMarker style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Address</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{profile.address}</p>
                    </div>
                  </div>
                )}
                {profile?.phone && (
                  <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--color-secondary)', background: 'rgba(26,122,92,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <HiPhone style={{ fontSize: '1.25rem', color: 'var(--color-secondary)' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Phone</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{profile.phone}</p>
                    </div>
                  </div>
                )}
                {profile?.email && (
                  <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <HiMail style={{ fontSize: '1.25rem', color: 'var(--color-accent)' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Email</h4>
                      <a href={`mailto:${profile.email}`} style={{ fontSize: '0.875rem', color: 'var(--text-link)' }}>{profile.email}</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Map Embed */}
              <div className="map-embed card" style={{ overflow: 'hidden', height: '220px' }}>
                <iframe
                  title="GDC Adilpur Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3589.5!2d69.3167!3d27.9375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDU2JzE1LjAiTiA2OcKwMTknMDAuMCJF!5e0!3m2!1sen!2spk!4v1"
                  width="100%" height="220" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                />
              </div>
            </div>

            {/* Forms */}
            <div>
              {/* Tab Switcher */}
              <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {[
                  { key: 'contact', label: 'Contact Us' },
                  { key: 'feedback', label: 'Feedback' },
                  { key: 'grievance', label: 'Grievance' },
                ].map((t) => (
                  <button key={t.key}
                    className={`btn ${tab === t.key ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => { setTab(t.key); if (t.key === 'grievance') setFeedbackData((p) => ({ ...p, type: 'Grievance' })); else if (t.key === 'feedback') setFeedbackData((p) => ({ ...p, type: 'Feedback' })); }}
                  >{t.label}</button>
                ))}
              </div>

              {/* Contact Form */}
              {tab === 'contact' && (
                <div className="card" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Send us a Message</h3>
                  <form onSubmit={handleContactSubmit}>
                    <div className="form-group">
                      <label className="form-label">Name <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                      <input className="form-input" required value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="form-row-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input className="form-input" type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input className="form-input" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input className="form-input" value={formData.subject} onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                      <textarea className="form-textarea" rows={5} required value={formData.message} onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      <HiPaperAirplane /> {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>
              )}

              {/* Feedback / Grievance Form */}
              {(tab === 'feedback' || tab === 'grievance') && (
                <div className="card" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {tab === 'grievance' ? 'Submit a Grievance' : 'Share Your Feedback'}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginBottom: '1.25rem' }}>
                    {tab === 'grievance' ? 'Report issues or concerns. Your grievance will be reviewed by the administration.' : 'Help us improve by sharing your thoughts and suggestions.'}
                  </p>
                  <form onSubmit={handleFeedbackSubmit}>
                    <div className="form-group">
                      <label className="form-label">Name <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                      <input className="form-input" required value={feedbackData.name} onChange={(e) => setFeedbackData((p) => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" value={feedbackData.email} onChange={(e) => setFeedbackData((p) => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                      <textarea className="form-textarea" rows={6} required value={feedbackData.message} onChange={(e) => setFeedbackData((p) => ({ ...p, message: e.target.value }))} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      <HiPaperAirplane /> {loading ? 'Submitting...' : `Submit ${tab === 'grievance' ? 'Grievance' : 'Feedback'}`}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

