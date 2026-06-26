import React from 'react';
import { Link } from 'react-router-dom';
import { FULL_ROUTE_MAP } from '../data/full-route-map-2026-06-19.js';
import RelatedLinks from '../components/RelatedLinks.jsx';
import { STATE_OF_PROGRAM_TRUTHS } from '../data/state-of-program-truths.js';

// The honest, single canonical top-of-funnel summary. Facts are sourced from
// the shared STATE_OF_PROGRAM_TRUTHS data module (mirroring FULL_ROUTE_MAP,
// 2026-06-19) so this page and the DashboardPage summary card cannot drift.
// No heavy zeros-bundle import.

const TRUTHS = STATE_OF_PROGRAM_TRUTHS;

export default function StateOfProgramPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>State of the Program</h1>
        <p>
          One honest, plain-language summary of where this RH / de&nbsp;Bruijn-Newman Λ attack actually stands.
          The truth is otherwise scattered across the route map, dashboards and withdrawn-claims notes — this page
          exists so a reader cannot over-read any single partial page. Facts are sourced directly from the{' '}
          <strong>full route map ({FULL_ROUTE_MAP.date})</strong>, which enumerates{' '}
          <strong>{FULL_ROUTE_MAP.totalRoutes} routes</strong>. The one-line truth:{' '}
          <strong>there is no shortcut below RH anywhere in the map.</strong>
        </p>
      </div>

      {TRUTHS.map((t, i) => (
        <div className="card" key={i} style={{ marginBottom: 16, borderLeft: `3px solid ${t.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: t.color,
                border: `1px solid ${t.color}`,
                borderRadius: 4,
                padding: '2px 7px',
              }}
            >
              {t.badge}
            </span>
            <strong style={{ color: '#e2e8f0', fontSize: 14.5 }}>{t.title}</strong>
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{t.body}</div>
        </div>
      ))}

      <div className="card" style={{ marginTop: 8 }}>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
          For the full route-by-route classification ({FULL_ROUTE_MAP.totalRoutes} routes across 5 clusters,
          with status badges and ranked genuine opportunities), see the{' '}
          <Link to="/route-map">Route Map</Link>.
        </p>
      </div>

      <RelatedLinks links={[
        { to: '/route-map', label: 'Route Map' },
        { to: '/rh-dag', label: 'Proof DAG' },
        { to: '/lambda-bounds', label: 'Lambda Bounds' },
        { to: '/rigor-dashboard', label: 'Rigor Dashboard' },
        { to: '/research-journal', label: 'Research Journal', color: '#22c55e' },
      ]} />
    </div>
  );
}
