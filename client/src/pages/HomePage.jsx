import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import {
  HiAcademicCap, HiUsers, HiOfficeBuilding, HiArrowRight,
  HiSpeakerphone, HiChevronLeft, HiChevronRight, HiStar, HiCalendar,
} from 'react-icons/hi';
import SEO from '../components/SEO';

const HomePage = () => {
  const [profile, setProfile] = useState(null);
  const [slides, setSlides] = useState([]);
  const [notices, setNotices] = useState([]);
  const [stories, setStories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    Promise.allSettled([
      api.get('/college-profile'),
      api.get('/hero-slides?isActive=true'),
      api.get('/notices?isActive=true&limit=6'),
      api.get('/success-stories?limit=6'),
    ]).then(([profileR, slidesR, noticesR, storiesR]) => {
      if (profileR.status === 'fulfilled') setProfile(profileR.value.data.data);
      if (slidesR.status === 'fulfilled') setSlides(slidesR.value.data.data || []);
      if (noticesR.status === 'fulfilled') setNotices(noticesR.value.data.data || []);
      if (storiesR.status === 'fulfilled') setStories(storiesR.value.data.data || []);
    });
  }, []);

  // Auto-advance hero slider
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Intersection observer for stats counter animation
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStatsVisible(true);
    }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const dir = profile?.directorMessage;
  const stats = profile?.stats || {};

  return (
    <div>
      <SEO title="Home" description="Government Degree College Adilpur — Providing quality higher education in District Ghotki, Sindh, Pakistan." />
      {/*”€â”€â”€ HERO SECTION”€â”€â”€ */}
      <section style={{
        position: 'relative', height: '520px', overflow: 'hidden',
        background: slides.length > 0 ? 'transparent' : 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
      }}>
        {slides.length > 0 ? (
          <>
            {slides.map((slide, idx) => (
              <div key={slide._id} style={{
                position: 'absolute', inset: 0,
                opacity: idx === currentSlide ? 1 : 0,
                transition: 'opacity 1s ease',
              }}>
                <img src={slide.imageUrl} alt={slide.caption || 'Hero'} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
                }} />
              </div>
            ))}
            {/* Slide indicators */}
            {slides.length > 1 && (
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                {slides.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentSlide(idx)}
                    style={{
                      width: idx === currentSlide ? '32px' : '10px', height: '10px',
                      borderRadius: '5px', border: 'none', cursor: 'pointer',
                      background: idx === currentSlide ? 'var(--color-accent)' : 'rgba(255,255,255,0.5)',
                      transition: 'all 0.3s ease',
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
            {/* Arrows */}
            {slides.length > 1 && (
              <>
                <button onClick={() => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length)}
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', zIndex: 10 }}
                  aria-label="Previous slide"><HiChevronLeft /></button>
                <button onClick={() => setCurrentSlide((p) => (p + 1) % slides.length)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', zIndex: 10 }}
                  aria-label="Next slide"><HiChevronRight /></button>
              </>
            )}
          </>
        ) : null}

        {/* Hero Content Overlay */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 5, textAlign: 'center', padding: '2rem',
        }}>
          <div className="animate-fade-in">
            <img src="/gdc-logo.png" alt="GDC Adilpur Logo" style={{ width: '90px', height: '90px', borderRadius: '50%', margin: '0 auto 1rem', border: '3px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: '800', color: '#fff', marginBottom: '0.5rem', textShadow: '0 2px 8px rgba(0,0,0,0.4)', fontFamily: "'Playfair Display', serif" }}>
              Government Degree College
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', color: 'rgba(255,255,255,0.9)', fontWeight: '300', marginBottom: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Adilpur
            </p>
            <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.75)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
              Knowledge· Character· Service
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/admissions" className="btn btn-accent btn-lg" style={{ fontSize: '0.875rem' }}>
                Admissions <HiArrowRight />
              </Link>
              <Link to="/about" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)', fontSize: '0.875rem' }}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/*”€â”€â”€ PINNED NOTICES TICKER”€â”€â”€ */}
      {notices.filter((n) => n.isPinned).length > 0 && (
        <section style={{ background: 'var(--color-primary)', color: '#fff', padding: '0.75rem 1.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0, background: 'var(--color-accent)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-on-accent)' }}>
              <HiSpeakerphone /> NOTICE
            </div>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
              <div style={{ display: 'inline-block', animation: 'marquee 20s linear infinite' }}>
                {notices.filter((n) => n.isPinned).map((n) => (
                  <Link key={n._id} to={`/notices`} style={{ color: '#fff', marginRight: '3rem', fontSize: '0.875rem', textDecoration: 'none' }}>
                    {n.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>
        </section>
      )}

      {/*”€â”€â”€ DIRECTOR'S MESSAGE”€â”€â”€ */}
      {dir?.name && (
        <section className="section-padding" style={{ background: 'var(--bg-surface)' }}>
          <div className="container-custom">
            <div className="grid-2col" style={{ alignItems: 'center' }}>
              <div className="animate-slide-in-left" style={{ textAlign: 'center' }}>
                {dir.photoUrl ? (
                  <img src={dir.photoUrl} alt={dir.name} style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '50%', border: '4px solid var(--color-accent)', boxShadow: 'var(--shadow-xl)', margin: '0 auto' }} />
                ) : (
                  <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: 'var(--bg-muted)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: 'var(--text-muted)' }}>ðŸ‘¤</div>
                )}
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '1rem' }}>{dir.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-accent)', fontWeight: '500' }}>{dir.designation}</p>
              </div>
              <div className="animate-slide-in-right">
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: '700', marginBottom: '0.5rem' }}>
                  Message from the Principal
                </p>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem', fontFamily: "'Playfair Display', serif" }}>
                  Welcome to GDC Adilpur
                </h2>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                  {dir.message ? (dir.message.substring(0, 400) + (dir.message.length > 400 ? '...' : '')) : ''}
                </p>
                <Link to="/about" className="btn btn-outline" style={{ borderColor: 'var(--color-primary)' }}>
                  Read Full Message <HiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/*”€â”€â”€ STATS COUNTERS”€â”€â”€ */}
      <section ref={statsRef} style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
        padding: '3.5rem 1.5rem', color: '#fff',
      }}>
        <div className="grid-stats" style={{ maxWidth: '1280px', margin: '0 auto', color: '#fff' }}>
          {[
            { value: stats.studentCount ? `${stats.studentCount}+` : '500+', label: 'Students Enrolled', icon: <HiAcademicCap /> },
            { value: stats.facultyCount ? `${stats.facultyCount}+` : '35+', label: 'Faculty Members', icon: <HiUsers /> },
            { value: stats.departmentCount ? `${stats.departmentCount}` : '8', label: 'Academic Departments', icon: <HiOfficeBuilding /> },
            { value: stats.passPercentage ? `${stats.passPercentage}%` : '98%', label: 'Pass Rate', icon: <HiCalendar /> },
            { value: profile?.establishedYear || '2010', label: 'Established Year', icon: <HiCalendar /> },
          ].map((stat, idx) => (
            <div key={idx} className={statsVisible ? 'animate-slide-up' : ''} style={{ opacity: statsVisible ? 1 : 0, animationDelay: `${idx * 0.15}s` }}>
              <div style={{ fontSize: '1.75rem', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', marginBottom: '0.25rem', fontFamily: "'Playfair Display', serif" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.02em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/*”€â”€â”€ LATEST NOTICES”€â”€â”€ */}
      {notices.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--bg-body)' }}>
          <div className="container-custom">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: '700', marginBottom: '0.375rem' }}>Stay Updated</p>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>Latest Notices</h2>
            </div>
            <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {notices.slice(0, 6).map((notice, idx) => (
                <Link to="/notices" key={notice._id} className="card" style={{ textDecoration: 'none', animationDelay: `${idx * 0.1}s` }}>
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary">{notice.category}</span>
                      {notice.isPinned && <span className="badge badge-warning"> Pinned</span>}
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: '1.4' }}>{notice.title}</h3>
                    {notice.body && <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', lineHeight: '1.6' }}>{notice.body.substring(0, 100)}{notice.body.length > 100 ? '...' : ''}</p>}
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                      {notice.publishDate ? new Date(notice.publishDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/notices" className="btn btn-outline">View All Notices <HiArrowRight /></Link>
            </div>
          </div>
        </section>
      )}

      {/*”€â”€â”€ SUCCESS STORIES”€â”€â”€ */}
      {stories.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--bg-surface)' }}>
          <div className="container-custom">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: '700', marginBottom: '0.375rem' }}>Our Pride</p>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>Success Stories</h2>
            </div>
            <div className="grid-responsive-3" style={{ display: 'grid', gap: '1.5rem' }}>
              {stories.slice(0, 6).map((story, idx) => (
                <div key={story._id} className="card" style={{ textAlign: 'center', animationDelay: `${idx * 0.1}s` }}>
                  <div className="card-body" style={{ padding: '2rem 1.5rem' }}>
                    {story.photoUrl ? (
                      <img src={story.photoUrl} alt={story.studentName} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem', border: '3px solid var(--color-accent)' }} />
                    ) : (
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-muted)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <HiStar style={{ fontSize: '2rem', color: 'var(--color-accent)' }} />
                      </div>
                    )}
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.375rem' }}>{story.studentName}</h3>
                    {story.year && <span className="badge badge-info" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>{story.year}</span>}
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: '0.5rem' }}>
                      {story.achievement.substring(0, 120)}{story.achievement.length > 120 ? '...' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/success-stories" className="btn btn-outline">View All Stories <HiArrowRight /></Link>
            </div>
          </div>
        </section>
      )}

      {/*”€â”€â”€ CTA SECTION”€â”€â”€ */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', padding: '4rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <div className="container-custom">
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.75rem', fontFamily: "'Playfair Display', serif" }}>
            Ready to Shape Your Future?
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Join thousands of students at Government Degree College Adilpur and begin your academic journey today.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/admissions" className="btn btn-accent btn-lg">Apply Now</Link>
            <Link to="/contact" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
