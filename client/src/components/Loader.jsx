const Loader = ({ text = 'Loading...' }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '4rem 2rem', gap: '1rem', color: 'var(--text-tertiary)',
  }}>
    <div style={{
      width: '40px', height: '40px',
      border: '3px solid var(--border-default)',
      borderTopColor: 'var(--color-primary)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
    <span style={{ fontSize: '0.875rem' }}>{text}</span>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

export default Loader;
