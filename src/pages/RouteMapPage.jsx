import React from 'react';
import { Link } from 'react-router-dom';
import {
  FULL_ROUTE_MAP,
  RANKED_OPPORTUNITIES,
  FULL_ROUTE_MAP_NEXT_MOVE,
  ROUTE_MAP_CROSS_CHECK,
} from '../data/full-route-map-2026-06-19.js';

// Status -> color. Ordered by "how alive" the route is.
const STATUS_COLOR = {
  'RIGOROUS-SOTA':  { bg: 'rgba(16,185,129,0.13)',  bd: 'rgba(16,185,129,0.45)',  fg: '#10b981' },
  'UNDER-EXPLORED': { bg: 'rgba(34,211,238,0.13)',  bd: 'rgba(34,211,238,0.5)',   fg: '#22d3ee' },
  'OPEN-HARD':      { bg: 'rgba(139,92,246,0.13)',  bd: 'rgba(139,92,246,0.45)',  fg: '#a78bfa' },
  'CONDITIONAL':    { bg: 'rgba(245,158,11,0.13)',  bd: 'rgba(245,158,11,0.45)',  fg: '#f59e0b' },
  'ESTIMATE':       { bg: 'rgba(59,130,246,0.13)',  bd: 'rgba(59,130,246,0.4)',   fg: '#60a5fa' },
  'RH-EQUIVALENT':  { bg: 'rgba(148,163,184,0.12)', bd: 'rgba(148,163,184,0.35)', fg: '#94a3b8' },
  'DEAD-END':       { bg: 'rgba(239,68,68,0.10)',   bd: 'rgba(239,68,68,0.35)',   fg: '#f87171' },
  'REFUTED':        { bg: 'rgba(127,29,29,0.25)',   bd: 'rgba(239,68,68,0.5)',    fg: '#fca5a5' },
};

const CLUSTER_TITLES = {
  lambdaUpper: 'Λ Upper-Bound Routes',
  directRH: 'Direct-RH Routes (not via Λ)',
  machineryCrossvalLower: 'Machinery · Cross-Validation · Lower Bounds',
  literaturePCC: 'Literature Ports & the Montgomery-PCC Surface',
  originalIdeas: 'Original / Novel-Angle Ideas',
};

function StatusTag({ status }) {
  const c = STATUS_COLOR[status] || STATUS_COLOR['ESTIMATE'];
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 4,
      background: c.bg, border: `1px solid ${c.bd}`, color: c.fg,
      fontSize: 10.5, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)',
      letterSpacing: '0.02em', whiteSpace: 'nowrap',
    }}>{status}</span>
  );
}

function OppDots({ score }) {
  return (
    <span title={`opportunity ${score}/10`} style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, color: score >= 5 ? '#22d3ee' : score >= 3 ? '#94a3b8' : '#475569' }}>
      {score}/10
    </span>
  );
}

export default function RouteMapPage() {
  const clusters = FULL_ROUTE_MAP.clusters;
  return (
    <div className="page">
      <div className="page-header">
        <h1>RH / Λ Route Map</h1>
        <p>
          The complete map of every route the project has tried —{' '}
          <strong>{FULL_ROUTE_MAP.totalRoutes} routes</strong> across 5 clusters, classified by
          status and genuine remaining opportunity (full-route-map workflow, {FULL_ROUTE_MAP.date}).
          The honest one-line truth: <strong>there is no shortcut below RH anywhere in the map</strong> —
          every route that could give an actual Λ&nbsp;&lt;&nbsp;0.2 funnels into one object, the{' '}
          <strong style={{ color: '#a78bfa' }}>C_H Hölder-½ shock modulus</strong> (RH-hard at the
          modulus). Platt–Trudgian Λ ≤ 0.2 remains the rigorous SOTA.
        </p>
      </div>

      {/* Legend */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#94a3b8', marginRight: 4 }}>Legend:</span>
        {Object.keys(STATUS_COLOR).map((s) => <StatusTag key={s} status={s} />)}
      </div>

      {/* Ranked opportunities — the actionable part */}
      <div className="card" style={{ marginBottom: 24, borderColor: 'rgba(34,211,238,0.4)' }}>
        <h3 style={{ color: '#22d3ee', marginTop: 0 }}>Ranked Genuine Opportunities</h3>
        <p style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 0 }}>
          Scored by upside that is <em>not</em> just another RH reformulation.
        </p>
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          {RANKED_OPPORTUNITIES.map((o) => (
            <li key={o.rank} style={{ marginBottom: 10 }}>
              <strong style={{ color: '#e2e8f0' }}>{o.target}</strong>
              <div style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 3, lineHeight: 1.55 }}>{o.why}</div>
            </li>
          ))}
        </ol>
      </div>

      {/* Route table by cluster */}
      {Object.entries(clusters).map(([key, routes]) => (
        <div className="card" key={key} style={{ marginBottom: 18 }}>
          <h3 style={{ color: '#cbd5e1', marginTop: 0, fontSize: 15 }}>{CLUSTER_TITLES[key] || key}</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {routes.map((r) => (
              <div key={r.name} style={{
                display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'start',
                padding: '8px 10px', borderRadius: 6, background: 'rgba(15,23,42,0.5)',
                border: '1px solid #1e293b',
              }}>
                <div>
                  <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, lineHeight: 1.5 }}>{r.note}</div>
                </div>
                <StatusTag status={r.status} />
                <OppDots score={r.opp} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Next move */}
      <div className="card" style={{ marginTop: 8, borderColor: 'rgba(167,139,250,0.4)' }}>
        <h3 style={{ color: '#a78bfa', marginTop: 0 }}>Highest-Value Next Move</h3>
        <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>
          <strong style={{ color: '#a78bfa' }}>Primary:</strong> {FULL_ROUTE_MAP_NEXT_MOVE.primary}
        </p>
        <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>
          <strong style={{ color: '#22d3ee' }}>Secondary:</strong> {FULL_ROUTE_MAP_NEXT_MOVE.secondary}
        </p>
        <p style={{ fontSize: 12.5, color: '#f87171', lineHeight: 1.6 }}>
          <strong>Do NOT invest:</strong> {FULL_ROUTE_MAP_NEXT_MOVE.doNotInvest}
        </p>
      </div>

      {/* Cross-check against the DAG and roadmap */}
      <div className="card" style={{ marginTop: 18, borderColor: 'rgba(245,158,11,0.4)' }}>
        <h3 style={{ color: '#f59e0b', marginTop: 0 }}>Consistency Cross-Check (vs the DAG & roadmap)</h3>
        <p style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 0 }}>{ROUTE_MAP_CROSS_CHECK.netVerdict}</p>
        {ROUTE_MAP_CROSS_CHECK.inconsistencies.map((x, i) => (
          <div key={i} style={{ marginTop: 10, padding: '8px 10px', borderRadius: 6, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 12.5, color: '#fbbf24', fontWeight: 600 }}>{x.view} <StatusTag status={x.severity === 'high' ? 'DEAD-END' : 'CONDITIONAL'} /></div>
            <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 3 }}><strong>asserts:</strong> {x.asserts}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}><strong>map says:</strong> {x.mapVerdict}</div>
            <div style={{ fontSize: 12, color: '#22d3ee', marginTop: 2 }}><strong>fix:</strong> {x.fix}</div>
          </div>
        ))}
        <details style={{ marginTop: 10 }}>
          <summary style={{ cursor: 'pointer', color: '#64748b', fontSize: 12 }}>Views that ARE consistent ({ROUTE_MAP_CROSS_CHECK.consistent.length})</summary>
          <ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: 12, color: '#94a3b8' }}>
            {ROUTE_MAP_CROSS_CHECK.consistent.map((c, i) => <li key={i} style={{ marginBottom: 4 }}>{c}</li>)}
          </ul>
        </details>
      </div>

      <div className="card" style={{ marginTop: 18, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10, marginTop: 0 }}>Related Views</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/rh-proof-state" style={{ color: '#3b82f6', fontSize: 13 }}>RH Proof State</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/rigor-dashboard" style={{ color: '#3b82f6', fontSize: 13 }}>Rigor Dashboard</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/lambda-bounds" style={{ color: '#3b82f6', fontSize: 13 }}>Λ Bounds</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/rh-dag" style={{ color: '#3b82f6', fontSize: 13 }}>Proof DAG</Link>
        </div>
      </div>
    </div>
  );
}
