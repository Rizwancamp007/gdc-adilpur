import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import { HiArrowLeft, HiUsers, HiUserCircle } from 'react-icons/hi';

const DepartmentsPage = () => {
  const { id } = useParams();
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/departments').then(({ data }) => {
      if (data.success) setDepartments(data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (id) {
      const dept = departments.find((d) => d._id === id);
      if (dept) {
        setSelectedDept(dept);
        api.get(`/faculty?departmentId=${id}&isActive=true`).then(({ data }) => {
          if (data.success) setFaculty(data.data || []);
        });
      }
    } else {
      setSelectedDept(null);
      setFaculty([]);
    }
  }, [id, departments]);

  if (loading) return <Loader />;

  // Single department view with faculty
  if (selectedDept) {
    return (
      <div>
      <SEO title="Departments" description="Explore academic departments and faculty at GDC Adilpur." />
        <section style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', padding: '3.5rem 1.5rem', textAlign: 'center', color: '#fff' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem' }}>{selectedDept.name}</h1>
          {selectedDept.description && <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto' }}>{selectedDept.description}</p>}
        </section>
        <section className="section-padding">
          <div className="container-custom">
            <Link to="/departments" className="btn btn-ghost" style={{ marginBottom: '1.5rem' }}>
              <HiArrowLeft /> Back to Departments
            </Link>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Faculty Members</h2>
            {faculty.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)' }}>No faculty members listed for this department yet.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {faculty.map((f) => (
                  <div key={f._id} className="card" style={{ textAlign: 'center' }}>
                    <div className="card-body" style={{ padding: '2rem 1.5rem' }}>
                      {f.photoUrl ? (
                        <img src={f.photoUrl} alt={f.name} style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem', border: '3px solid var(--color-primary-50)' }} />
                      ) : (
                        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--bg-muted)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <HiUserCircle style={{ fontSize: '2.5rem', color: 'var(--text-muted)' }} />
                        </div>
                      )}
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{f.name}</h3>
                      {f.designation && <p style={{ fontSize: '0.8125rem', color: 'var(--color-accent)', fontWeight: '500', marginBottom: '0.25rem' }}>{f.designation}</p>}
                      {f.qualification && <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{f.qualification}</p>}
                      {f.subject && <span className="badge badge-primary" style={{ marginTop: '0.5rem' }}>{f.subject}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  // Departments list
  return (
    <div>
      <SEO title="Departments" description="Explore academic departments and faculty at GDC Adilpur." />
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', padding: '3.5rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem' }}>Departments</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Explore our academic departments</p>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          {departments.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>No departments listed yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {departments.map((dept, idx) => (
                <Link key={dept._id} to={`/departments/${dept._id}`} className="card" style={{ textDecoration: 'none', animationDelay: `${idx * 0.08}s` }}>
                  <div className="card-body" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <HiUsers style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }} />
                      </div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)' }}>{dept.name}</h3>
                    </div>
                    {dept.description && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{dept.description.substring(0, 120)}</p>}
                    <div style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      View Faculty†’
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DepartmentsPage;

