import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
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
    </div>
  );
}
