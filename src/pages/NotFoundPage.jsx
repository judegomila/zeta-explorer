import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const POPULAR_PAGES = [
  { label: 'Home', path: '/' },
  { label: 'Λ Bounds', path: '/lambda-bounds' },
  { label: 'Route Map', path: '/route-map' },
  { label: 'Visualizations', path: '/visualizations' },
  { label: 'Concepts', path: '/concepts' },
  { label: 'Statistics', path: '/statistics' },
];

export default function NotFoundPage() {
  const navigate = useNavigate();

  function goToRandomPage() {
    const pick = POPULAR_PAGES[Math.floor(Math.random() * POPULAR_PAGES.length)];
    navigate(pick.path);
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '40px 20px',
      textAlign: 'center',
      color: '#e2e8f0',
    }}>
      <h1 style={{
        fontSize: '64px',
        fontWeight: 'bold',
        margin: '0 0 16px 0',
        color: '#f1f5f9',
        fontFamily: 'var(--font-mono)',
      }}>404</h1>
      <p style={{
        fontSize: '20px',
        margin: '0 0 24px 0',
        color: '#cbd5e1',
      }}>Page not found</p>
      <p style={{
        fontSize: '14px',
        margin: '0 0 32px 0',
        color: '#94a3b8',
        maxWidth: '400px',
      }}>
        The route you're looking for doesn't exist. Check the navigation or return home.
      </p>
      <Link to="/" className="not-found-home-btn">
        Go Home
      </Link>

      <div style={{ margin: '32px 0 16px 0', color: '#64748b', fontSize: '13px' }}>
        — or go somewhere useful —
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        maxWidth: '420px',
        marginBottom: '16px',
      }}>
        {POPULAR_PAGES.map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            className="not-found-nav-link"
          >
            {label}
          </Link>
        ))}
      </div>

      <button
        onClick={goToRandomPage}
        className="not-found-random-btn"
      >
        Go to a random page
      </button>
    </div>
  );
}
