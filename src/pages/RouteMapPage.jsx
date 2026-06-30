import React from 'react';
import { Link } from 'react-router-dom';
import {
  FULL_ROUTE_MAP,
  RANKED_OPPORTUNITIES,
  FULL_ROUTE_MAP_NEXT_MOVE,
  ROUTE_MAP_CROSS_CHECK,
} from '../data/full-route-map-2026-06-19.js';
import { CH_WALL_FRONTIER } from '../data/ch-wall-frontier-verdict-2026-06-26.js';
import { C_SHOCK_CROSS_VALIDATION_IMP3026 } from '../data/imp-3026-c-shock-cross-validation.js';
import { C_SHOCK_N_DEPENDENCE_IMP3070 } from '../data/imp-3070-c-shock-n-dependence.js';
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

// imp-3118 — viz of the imp-3070 C_shock(N) monotone decay against the 1/3 cap,
// with the (1/3 - C_shock) margin band shaded and the worst-case N=2458 marked.
function CShockDecayViz() {
  const D = C_SHOCK_N_DEPENDENCE_IMP3070;
  const rows = D.table;
  const cap = D.cap;
  const W = 660, H = 300;
  const padL = 58, padR = 18, padT = 22, padB = 46;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  // log-x over the assembly N-range, fixed y-window framing both the curve and the cap.
  const lxMin = Math.log10(D.nMin);
  const lxMax = Math.log10(D.nMax);
  const yMin = 0.20, yMax = 0.34;
  const xOf = (N) => padL + ((Math.log10(N) - lxMin) / (lxMax - lxMin)) * plotW;
  const yOf = (v) => padT + (1 - (v - yMin) / (yMax - yMin)) * plotH;
  const curve = rows.map((r) => `${xOf(r.N).toFixed(1)},${yOf(r.C_shock).toFixed(1)}`).join(' ');
  // Margin band = area between the C_shock(N) curve and the cap line.
  const bandTop = rows.map((r) => `${xOf(r.N).toFixed(1)},${yOf(cap).toFixed(1)}`);
  const bandBot = rows.map((r) => `${xOf(r.N).toFixed(1)},${yOf(r.C_shock).toFixed(1)}`).reverse();
  const bandPts = bandTop.concat(bandBot).join(' ');
  const worst = rows.find((r) => r.N === D.worstN) || rows[0];
  const xTicks = [2458, 1e4, 1e5, 1e6];
  const yTicks = [0.20, 0.24, 0.28, cap, 0.34];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label="C_shock(N) monotone decay against the 1/3 cap with margin band shaded">
      {/* y grid + labels */}
      {yTicks.map((t, i) => (
        <g key={`y${i}`}>
          <line x1={padL} y1={yOf(t)} x2={W - padR} y2={yOf(t)} stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
          <text x={padL - 8} y={yOf(t) + 3} textAnchor="end" fontSize="10"
            fill={Math.abs(t - cap) < 1e-9 ? '#f87171' : '#94a3b8'} fontFamily="var(--font-mono, monospace)">
            {Math.abs(t - cap) < 1e-9 ? '1/3' : t.toFixed(2)}
          </text>
        </g>
      ))}
      {/* x labels */}
      {xTicks.map((t, i) => (
        <text key={`x${i}`} x={xOf(t)} y={H - padB + 16} textAnchor="middle" fontSize="10"
          fill="#94a3b8" fontFamily="var(--font-mono, monospace)">
          {t >= 1e4 ? `${(t / 1000).toFixed(0)}k` : t}
        </text>
      ))}
      <text x={padL + plotW / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="#cbd5e1">
        assembly level N (log scale)
      </text>
      {/* margin band */}
      <polygon points={bandPts} fill="rgba(34,211,238,0.10)" stroke="none" />
      {/* cap line */}
      <line x1={padL} y1={yOf(cap)} x2={W - padR} y2={yOf(cap)} stroke="#f87171" strokeWidth="1.6" strokeDasharray="6 4" />
      <text x={W - padR} y={yOf(cap) - 5} textAnchor="end" fontSize="10.5" fill="#f87171">
        imp-2786 cap C_shock &lt; 1/3
      </text>
      {/* C_shock(N) curve */}
      <polyline points={curve} fill="none" stroke="#22d3ee" strokeWidth="2" />
      {rows.map((r, i) => (
        <circle key={`p${i}`} cx={xOf(r.N)} cy={yOf(r.C_shock)} r="2.6" fill="#22d3ee" />
      ))}
      {/* worst-case marker */}
      <circle cx={xOf(worst.N)} cy={yOf(worst.C_shock)} r="5.5" fill="none" stroke="#fbbf24" strokeWidth="2" />
      <text x={xOf(worst.N) + 10} y={yOf(worst.C_shock) - 8} fontSize="10.5" fill="#fbbf24"
        fontFamily="var(--font-mono, monospace)">
        worst N={worst.N}: C_shock={worst.C_shock.toFixed(4)} (margin {worst.margin_to_cap.toFixed(4)})
      </text>
    </svg>
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

      {/* Foreclosure notice — top-of-page anchor */}
      <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.04)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ padding: '10px 12px', borderRadius: 6, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', letterSpacing: '0.06em', marginBottom: 5 }}>
              FORECLOSED — IMPOSSIBILITY
            </div>
            <div style={{ fontSize: 12.5, color: '#e2e8f0', fontWeight: 600, marginBottom: 3 }}>
              C_H Lipschitz Route
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>
              Three independent proofs: (1) Holder-1/2 lower bound C_Lip &ge; C_shock/(2&#x221A;W_1) &rarr; &infin;;
              (2) linear-N norm-mismatch (exact closed form); (3) all squared-gap surrogates refuted.
              No analytic bypass exists — the route is permanently closed.
            </div>
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 6, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.35)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', letterSpacing: '0.06em', marginBottom: 5 }}>
              SOLE DETERMINISTIC FORWARD MOVE
            </div>
            <div style={{ fontSize: 12.5, color: '#e2e8f0', fontWeight: 600, marginBottom: 3 }}>
              R2-T Multi-Body Isolation Constant (closed form)
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>
              Single-shell closed form: <em>c</em>* = &#x221A;(2+&#x221A;3)&minus;1 &#x2248; 0.9319 (imp-3005).
              Global multi-body <em>c</em> not yet in closed form; asymmetric configs worsen to ~0.927.
              Theorem C holds at <em>c</em> = 0.72. NOT RH-hard — a concrete analytic target.
            </div>
          </div>
        </div>
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

      {/* imp-3026 — C_shock dual-appearance cross-validation (consistency, NOT a bound) */}
      <div className="card" style={{ marginBottom: 18, borderColor: 'rgba(34,211,238,0.35)' }}>
        <h3 style={{ color: '#22d3ee', marginTop: 0 }}>
          C_shock dual-appearance identity (imp-3026 cross-validation)
        </h3>
        <p style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 0, marginBottom: 12 }}>
          The constant <strong style={{ color: '#e2e8f0' }}>C_shock</strong> shows up TWICE in the
          frontier verdict above — once as the cusp-law prefactor g_min ≈ C_shock·W₁<sup>1/2</sup>{' '}
          (Hölder-½, capped &lt;&nbsp;1/3 by imp-2786) and once as the squared-gap surrogate
          constant C_shock²/8. Along the 1-parameter cusp family both appearances recover the SAME
          number, confirming they are one constant rather than two independently-fitted values.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div style={{ padding: '10px 12px', borderRadius: 6, background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.3)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#22d3ee', marginBottom: 6, letterSpacing: '0.04em' }}>
              ROUTE A — cusp law (log-log fit)
            </div>
            <div style={{ fontSize: 13, color: '#cbd5e1', fontFamily: 'var(--font-mono, monospace)' }}>
              C_shock = {C_SHOCK_CROSS_VALIDATION_IMP3026.cShockRouteA_star.toFixed(6)}
            </div>
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 6, background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.3)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#22d3ee', marginBottom: 6, letterSpacing: '0.04em' }}>
              ROUTE B — √(8·C_shock²/8) from squared gap
            </div>
            <div style={{ fontSize: 13, color: '#cbd5e1', fontFamily: 'var(--font-mono, monospace)' }}>
              C_shock = {C_SHOCK_CROSS_VALIDATION_IMP3026.cShockRouteB_star.toFixed(6)}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
          At N* = {C_SHOCK_CROSS_VALIDATION_IMP3026.nStar.toLocaleString()} the two routes agree to{' '}
          |Δ| = {C_SHOCK_CROSS_VALIDATION_IMP3026.absDiffAB_star.toExponential(1)} (surrogate bounded
          constant C_shock²/8 ≈ {C_SHOCK_CROSS_VALIDATION_IMP3026.squaredGapBoundedConst_star.toFixed(5)}),
          both safely under the imp-2786 cap of 1/3.
        </div>
        <div style={{ padding: '9px 11px', borderRadius: 6, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', marginBottom: 5, letterSpacing: '0.04em' }}>
            HONEST SCOPE — NOT A BOUND
          </div>
          <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
            {C_SHOCK_CROSS_VALIDATION_IMP3026.surrogateStillRefuted} {C_SHOCK_CROSS_VALIDATION_IMP3026.honestNote}
          </div>
        </div>
      </div>

      {/* imp-3118 — viz of the imp-3070 C_shock(N) monotone decay vs the 1/3 cap */}
      <div className="card" style={{ marginBottom: 18, borderColor: 'rgba(34,211,238,0.35)' }}>
        <h3 style={{ color: '#22d3ee', marginTop: 0 }}>
          C_shock(N) decay vs the 1/3 cap (imp-3070 uniformity, imp-3118 viz)
        </h3>
        <p style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 0, marginBottom: 12 }}>
          imp-3070 tabulates C_shock(N) = √(2 / (3·log γ<sub>N</sub>)) across a 13-point log-spaced N
          grid. It is <strong style={{ color: '#e2e8f0' }}>strictly decreasing</strong> in N (the slow
          1/√(log γ<sub>N</sub>) factor), falling from ≈{C_SHOCK_N_DEPENDENCE_IMP3070.maxCShock.toFixed(4)}{' '}
          at N={C_SHOCK_N_DEPENDENCE_IMP3070.worstN.toLocaleString()} to ≈
          {C_SHOCK_N_DEPENDENCE_IMP3070.table[C_SHOCK_N_DEPENDENCE_IMP3070.table.length - 1].C_shock.toFixed(4)}{' '}
          at N=1e6. The cap C_shock &lt; 1/3 reduces to log γ<sub>N</sub> &gt; 6 ⟺ γ<sub>N</sub> &gt;
          e<sup>6</sup> ≈ 403, which every assembly height clears by an order of magnitude. The worst
          case (smallest margin {C_SHOCK_N_DEPENDENCE_IMP3070.minMargin.toFixed(4)}) is the smallest N.
        </p>
        <CShockDecayViz />
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 10, marginBottom: 12 }}>
          Cyan curve: C_shock(N). Red dashed line: the imp-2786 cap 1/3. Shaded band: the margin
          (1/3 − C_shock), widening monotonically as N grows. Amber ring: the worst-case N=
          {C_SHOCK_N_DEPENDENCE_IMP3070.worstN.toLocaleString()} point.
        </div>
        <div style={{ padding: '9px 11px', borderRadius: 6, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', marginBottom: 5, letterSpacing: '0.04em' }}>
            HONEST SCOPE — NOT A NEW BOUND
          </div>
          <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
            {C_SHOCK_N_DEPENDENCE_IMP3070.honestNote} This viz certifies the uniformity of an
            already-proven cap; it does NOT close C_H. Platt-Trudgian Λ ≤ 0.2 remains the rigorous SOTA.
          </div>
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
