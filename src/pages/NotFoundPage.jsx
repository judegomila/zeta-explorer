import React from 'react';
import { Link } from 'react-router-dom';

function openCommandPalette() {
  window.dispatchEvent(new CustomEvent('open-command-palette'));
}

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
        The route you&#39;re looking for doesn&#39;t exist. Search all pages or return home.
      </p>

      <button
        onClick={openCommandPalette}
        className="not-found-home-btn"
        style={{ marginBottom: '16px' }}
      >
        Search all pages
      </button>

      <Link to="/" className="not-found-nav-link" style={{ fontSize: '13px' }}>
        Go Home
      </Link>

      <p style={{ marginTop: '24px', fontSize: '12px', color: '#475569', fontFamily: 'var(--font-mono)' }}>
        tip: press Cmd+K / Ctrl+K to search from anywhere
      </p>
    </div>
  );
}
