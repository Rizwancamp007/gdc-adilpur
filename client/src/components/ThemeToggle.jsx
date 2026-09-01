import { useTheme } from '../context/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`btn btn-ghost btn-icon ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      style={{
        fontSize: '1.25rem',
        color: 'var(--text-secondary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <span style={{
        display: 'inline-flex',
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        transform: isDark ? 'rotate(180deg) scale(0)' : 'rotate(0) scale(1)',
        opacity: isDark ? 0 : 1,
        position: isDark ? 'absolute' : 'static',
      }}>
        <HiSun />
      </span>
      <span style={{
        display: 'inline-flex',
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        transform: isDark ? 'rotate(0) scale(1)' : 'rotate(-180deg) scale(0)',
        opacity: isDark ? 1 : 0,
        position: isDark ? 'static' : 'absolute',
      }}>
        <HiMoon />
      </span>
    </button>
  );
};

export default ThemeToggle;
