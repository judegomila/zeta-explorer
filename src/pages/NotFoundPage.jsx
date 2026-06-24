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
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          background: '#334155',
          border: '1px solid #475569',
          borderRadius: '6px',
          color: '#e2e8f0',
          textDecoration: 'none',
          fontSize: '14px',
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
          transition: 'all 200ms ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#475569';
          e.target.style.borderColor = '#64748b';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#334155';
          e.target.style.borderColor = '#475569';
        }}
      >
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
            style={{
              padding: '6px 14px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '4px',
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              transition: 'color 150ms ease, border-color 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#e2e8f0';
              e.currentTarget.style.borderColor = '#475569';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.borderColor = '#334155';
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <button
        onClick={goToRandomPage}
        style={{
          padding: '6px 14px',
          background: 'transparent',
          border: '1px dashed #334155',
          borderRadius: '4px',
          color: '#64748b',
          fontSize: '13px',
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
          transition: 'color 150ms ease, border-color 150ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#94a3b8';
          e.currentTarget.style.borderColor = '#475569';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#64748b';
          e.currentTarget.style.borderColor = '#334155';
        }}
      >
        Go to a random page
      </button>
    </div>
  );
}
