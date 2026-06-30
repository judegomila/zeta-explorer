import React from 'react';
import { Link } from 'react-router-dom';
import {
  FULL_ROUTE_MAP,
  RANKED_OPPORTUNITIES,
  FULL_ROUTE_MAP_NEXT_MOVE,
  ROUTE_MAP_CROSS_CHECK,
} from '../data/full-route-map-2026-06-19.js';
import { CH_WALL_FRONTIER } from '../data/ch-wall-frontier-verdict-2026-06-26.js';
import { STATUS_COLOR, StatusTag, StatusLegend } from '../components/StatusLegend.jsx';

const CLUSTER_TITLES = {
  lambdaUpper: 'Λ Upper-Bound Routes',
  directRH: 'Direct-RH Routes (not via Λ)',
  machineryCrossvalLower: 'Machinery · Cross-Validation · Lower Bounds',
  literaturePCC: 'Literature Ports & the Montgomery-PCC Surface',
  originalIdeas: 'Original / Novel-Angle Ideas',
};

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
      <div className="card" style={{ marginBottom: 20 }}>
        <StatusLegend />
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

      {/* Frontier residuals: deterministic vs RH-hard */}
      <div className="card" style={{ marginBottom: 18, borderColor: 'rgba(239,68,68,0.35)' }}>
        <h3 style={{ color: '#f87171', marginTop: 0 }}>Frontier Assault Verdict ({CH_WALL_FRONTIER.date})</h3>
        <p style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 0, marginBottom: 14 }}>
          Status: <strong style={{ color: '#f87171' }}>{CH_WALL_FRONTIER.verdict}</strong> — the Lipschitz route is{' '}
          provably closed three independent ways. The only remaining forward move is deterministic.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ padding: '10px 12px', borderRadius: 6, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', marginBottom: 6, letterSpacing: '0.04em' }}>DETERMINISTIC RESIDUAL</div>
            <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
              sg1c R2-T multi-body isolation constant <em>c</em>: closed-form symmetric
              single-shell gives <em>c*</em> = sqrt(2+sqrt(3))-1 ≈ 0.9319 (imp-3005);
              global multi-body <em>c</em> not yet in closed form (asymmetric configs
              worsen to ~0.927). Theorem C holds safely at <em>c</em> = 0.72.
              <strong style={{ color: '#10b981' }}> NOT RH-hard — a concrete analytic gap.</strong>
            </div>
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 6, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#f87171', marginBottom: 6, letterSpacing: '0.04em' }}>RH-HARD WALLS (FORECLOSED)</div>
            <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Global-W_1 C_Lip:</strong> lower bound C_Lip >= C_shock/(2 sqrt(W_1)) &rarr; &infin; (Holder-1/2 impossibility);
              linear-N norm-mismatch (exact closed form); both surrogates refuted.
              <br />
              <strong>GUE cusp-spacing:</strong> two-sided Montgomery–PCC spacing content; no analytic bypass found.
            </div>
          </div>
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: '#64748b' }}>
          Sharpest diagnosis: {CH_WALL_FRONTIER.sharpestDiagnosis}
        </div>
      </div>

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
            <div style={{ fontSize: 12.5, color: '#fbbf24', fontWeight: 600, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
              <span>{x.view}</span>
              <StatusTag status={x.severity === 'high' ? 'DEAD-END' : 'CONDITIONAL'} />
              <span style={{
                display: 'inline-block', padding: '2px 7px', borderRadius: 4, fontSize: 10.5, fontWeight: 700,
                fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.02em', whiteSpace: 'nowrap',
                background: x.resolution === 'reconciled' ? 'rgba(16,185,129,0.13)' : 'rgba(239,68,68,0.12)',
                border: x.resolution === 'reconciled' ? '1px solid rgba(16,185,129,0.45)' : '1px solid rgba(239,68,68,0.35)',
                color: x.resolution === 'reconciled' ? '#10b981' : '#f87171',
              }}>{x.resolution === 'reconciled' ? 'RECONCILED' : 'OPEN'}</span>
            </div>
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
