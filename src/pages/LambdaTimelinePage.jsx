// LambdaTimelinePage — imp-1093
// Horizontal log-N timeline visualizing the three Lambda-bound regimes:
//   GREEN  [100, 1e4]      rigorous unconditional MEASURED        (imp-440 + imp-963)
//   YELLOW (1e4, 1e6]      rigorous unconditional CARRYFORWARD    (imp-1082 + imp-1087 + imp-1088)
//   RED    (1e6, infinity) GUE-conditional / ESY-open             (imp-486 barrier; imp-370 named)
//
// Renders LAMBDA_BOUNDS (lambda-roadmap.js) as horizontal reference lines,
// K_PLATEAU_LADDER (finite-k-c-mb-unconditional.js) as per-plateau rescue
// margin markers on a secondary axis, and the rigorousUnconditionalBeat /
// rigorousUnconditionalBeatCarryforwardN1e6 entries from
// finite-height-beats-platt-trudgian.js as the regime transitions.
//
// Pure SVG + React. d3-scale used for the log-N axis.

import React from 'react';
import { Link } from 'react-router-dom';
import { scaleLog, scaleLinear } from 'd3-scale';
import { LAMBDA_BOUNDS } from '../data/lambda-roadmap.js';
// IMPORTANT: do NOT import (statically OR via dynamic import()) the modules
// finite-k-c-mb-unconditional.js or finite-height-beats-platt-trudgian.js
// here. Both transitively import imp-962-plateau-structure-N10k-to-N1e6.js,
// which imports ZEROS_EXTENDED from zeros-to-1e6.js — the ~16.7 MB data-zeros
// bundle. Pulling that in (even lazily) forces the browser to download +
// parse + evaluate 16.7 MB of array literals on the main thread, which wedges
// the renderer (the page goes blank / unresponsive with no JS error). See
// MEMORY: "No heavy imports in pages". The two small pieces of data this chart
// needs (the 9-row K_PLATEAU_LADDER rescue margins and the two beats-PT
// L_star values) are deterministic published constants and are inlined below.

// PT 2021 SOTA upper bound.
const PT_BOUND = 0.2;

// X-axis log-N range.
const N_MIN = 100;
const N_MAX = 1e9;

// Y-axis Lambda range.
const LAMBDA_MIN = 0;
const LAMBDA_MAX = 0.25;

// Margin-factor (secondary axis) range.
const MARGIN_MIN = 0;
const MARGIN_MAX = 60;

// SVG geometry.
const W = 960;
const H = 460;
const M = { top: 50, right: 80, bottom: 80, left: 70 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;

// Regime bands (start and end N).
const REGIMES = [
  {
    id: 'measured',
    label: 'rigorous unconditional MEASURED',
    nLo: 100,
    nHi: 1e4,
    fill: 'rgba(34,197,94,0.18)',
    stroke: 'rgba(34,197,94,0.55)',
    text: '#86efac',
    tickets: ['imp-440', 'imp-963'],
    method: 'measured interval-RK4 sweep on [100, 1e4]',
  },
  {
    id: 'carryforward',
    label: 'rigorous unconditional CARRYFORWARD',
    nLo: 1e4,
    nHi: 1e6,
    fill: 'rgba(234,179,8,0.16)',
    stroke: 'rgba(234,179,8,0.55)',
    text: '#facc15',
    tickets: ['imp-1082', 'imp-1087', 'imp-1088'],
    method: 'K_PLATEAU_LADDER conservative-carryforward (rescue formula holds)',
  },
  {
    id: 'esy-open',
    label: 'GUE-CONDITIONAL / ESY-open',
    nLo: 1e6,
    nHi: N_MAX,
    fill: 'rgba(239,68,68,0.14)',
    stroke: 'rgba(239,68,68,0.55)',
    text: '#fca5a5',
    tickets: ['imp-486', 'imp-370'],
    method: 'imp-486 rate barrier; ESY arithmetic-input port (imp-370 partial)',
  },
];

// Style helpers.
const labelStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  fill: 'var(--text-secondary)',
};

const tickStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  fill: '#94a3b8',
};

function fmtN(n) {
  if (n >= 1e9) return '1e9';
  if (n >= 1e6) return '1e' + Math.round(Math.log10(n));
  if (n >= 1e3) return n.toExponential(0).replace('+0', '').replace('e', 'e');
  return String(n);
}

// ── Inlined K_PLATEAU_LADDER rescue margins (imp-1082/1087/1088) ─────────────
// Mirrors finite-k-c-mb-unconditional.js K_PLATEAU_LADDER, but computed inline
// from the published rescue formula so this page never imports that module
// (which drags in the 16.7 MB zeros bundle — see note at top of file).
//   rescue_margin_factor(N) = RESCUE_THRESHOLD / (K * ln(N) / sqrt(N))
// with the imp-963-headline carryforward K = 0.2014 and the imp-486 rescue
// threshold 0.12751. The 9 ladder N values are the batch-1/2/3 plateau
// interiors. Verified to match the module's emitted rescue_margin_factor
// values (e.g. 45.83 at N = 1e6, 34.12 at N = 5e5, 9.04 at N = 2e4).
const RESCUE_THRESHOLD = 0.12751;
const CARRYFORWARD_K = 0.2014;
const K_PLATEAU_LADDER_NS = [
  20000, 50000, 100000, 200000, 300000, 500000, 600000, 800000, 1000000,
];
const K_PLATEAU_LADDER = K_PLATEAU_LADDER_NS.map((N) => {
  const lhs = (CARRYFORWARD_K * Math.log(N)) / Math.sqrt(N);
  return {
    N,
    rescue_margin_factor: lhs > 0 ? +(RESCUE_THRESHOLD / lhs).toFixed(2) : null,
  };
});

// ── Inlined beats-Platt-Trudgian L_star values ──────────────────────────────
// Mirrors finite-height-beats-platt-trudgian.js rigorousUnconditionalBeat
// (.L_star at N = 1e4) and rigorousUnconditionalBeatCarryforwardN1e6 (.L_star
// at N = 1e6). These are the published MEASURED (0.02, imp-440+imp-963) and
// CARRYFORWARD (0.121, imp-1088) Lambda upper bounds used as the two regime-
// transition dots. Inlined to avoid importing that module (it imports
// finite-k-c-mb-unconditional.js → the 16.7 MB zeros bundle).
const LAMBDA_1E4_MEASURED = 0.02;
const LAMBDA_1E6_CARRYFORWARD = 0.121;

// Reference card chip.
function pill(color, text) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 6,
      fontSize: 10,
      fontFamily: 'var(--font-mono)',
      background: 'rgba(255,255,255,0.04)',
      color,
      border: '1px solid ' + color + '40',
      marginRight: 6,
    }}>{text}</span>
  );
}

export default function LambdaTimelinePage() {
  const x = scaleLog().domain([N_MIN, N_MAX]).range([0, IW]);
  const y = scaleLinear().domain([LAMBDA_MIN, LAMBDA_MAX]).range([IH, 0]);
  const yMargin = scaleLinear().domain([MARGIN_MIN, MARGIN_MAX]).range([IH, 0]);

  const xTicks = [100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];
  const yTicks = [0, 0.05, 0.1, 0.15, 0.2, 0.25];
  const yMarginTicks = [0, 10, 20, 30, 40, 50];

  // Ladder rescue-margin markers and the two regime-transition Lambda dots are
  // sourced from the inlined published constants above (NOT from a dynamic
  // import — that pulled the 16.7 MB zeros bundle and wedged the renderer).
  const ladderRows = K_PLATEAU_LADDER;
  const lambda1e4 = LAMBDA_1E4_MEASURED;
  const lambda1e6 = LAMBDA_1E6_CARRYFORWARD;

  // Helper for plotting Lambda dot at (N, value).
  function dotL(N, val, color, label) {
    return (
      <g key={N + '-' + label}>
        <circle cx={x(N)} cy={y(val)} r={5} fill={color} stroke="#0f172a" strokeWidth={1.5} />
        <text x={x(N) + 8} y={y(val) - 6} style={{ ...labelStyle, fill: color }}>
          {label}
        </text>
      </g>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Lambda Timeline (imp-1093)</h1>
        <p className="page-subtitle">
          Horizontal log-N timeline of the three rigorous-regime bands for
          Lambda upper bounds: MEASURED on [100, 1e4] (imp-440 + imp-963),
          CARRYFORWARD on (1e4, 1e6] (imp-1082 + imp-1087 + imp-1088), and
          GUE-CONDITIONAL above the imp-486 rate barrier at N = 1e6.
          The reference SOTA bound from Platt-Trudgian 2021 (Lambda &le; 0.2)
          is shown across the entire x-axis.
        </p>
        <div style={{ marginTop: 10 }}>
          <Link to="/lambda-bounds" style={{ color: '#a855f7', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            &larr; back to Lambda Bounds &amp; RH Roadmap
          </Link>
        </div>
      </div>

      <div style={{ overflowX: 'auto', marginTop: 16, background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
        <svg width={W} height={H} role="img" aria-label="Lambda bound timeline by log-N">
          <g transform={'translate(' + M.left + ',' + M.top + ')'}>
            {/* Regime band rectangles. */}
            {REGIMES.map((r) => {
              const xLo = x(Math.max(r.nLo, N_MIN));
              const xHi = x(Math.min(r.nHi, N_MAX));
              return (
                <g key={r.id}>
                  <rect x={xLo} y={0} width={xHi - xLo} height={IH} fill={r.fill} stroke={r.stroke} strokeDasharray="2,3" />
                  <text x={(xLo + xHi) / 2} y={18} textAnchor="middle" style={{ ...labelStyle, fill: r.text, fontWeight: 700 }}>
                    {r.label}
                  </text>
                </g>
              );
            })}

            {/* PT 2021 reference line across full x-axis. */}
            <line x1={0} x2={IW} y1={y(PT_BOUND)} y2={y(PT_BOUND)} stroke="#ef4444" strokeWidth={2} strokeDasharray="6,4" />
            <text x={IW - 4} y={y(PT_BOUND) - 6} textAnchor="end" style={{ ...labelStyle, fill: '#fca5a5', fontWeight: 700 }}>
              Lambda &le; 0.2 (Platt-Trudgian 2021 = PT_BOUND)
            </text>

            {/* Rodgers-Tao Lambda >= 0 reference line. */}
            <line x1={0} x2={IW} y1={y(0)} y2={y(0)} stroke="#22c55e" strokeWidth={1.5} strokeDasharray="3,3" />
            <text x={IW - 4} y={y(0) + 14} textAnchor="end" style={{ ...labelStyle, fill: '#86efac' }}>
              Lambda &ge; 0 (Rodgers-Tao 2020)
            </text>

            {/* Our target bound. */}
            <line x1={0} x2={IW} y1={y(0.02)} y2={y(0.02)} stroke="#06b6d4" strokeWidth={1} strokeDasharray="2,4" />
            <text x={4} y={y(0.02) - 4} style={{ ...labelStyle, fill: '#67e8f9' }}>
              target Lambda &le; 0.02
            </text>

            {/* imp-486 barrier vertical at N = 1e6. */}
            <line x1={x(1e6)} x2={x(1e6)} y1={0} y2={IH} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4,4" />
            <text x={x(1e6) + 6} y={IH - 8} style={{ ...labelStyle, fill: '#fca5a5', fontWeight: 700 }}>
              imp-486 rate barrier (N = 1e6)
            </text>

            {/* Rescue-margin secondary axis: render K_PLATEAU_LADDER plateau margins. */}
            {ladderRows.map((row) => {
              if (row == null || row.rescue_margin_factor == null) return null;
              const m = Math.min(row.rescue_margin_factor, MARGIN_MAX);
              return (
                <g key={'plateau-' + row.N}>
                  <line x1={x(row.N)} x2={x(row.N)} y1={IH} y2={yMargin(m)} stroke="#facc15" strokeOpacity={0.4} strokeWidth={1} />
                  <circle cx={x(row.N)} cy={yMargin(m)} r={3.5} fill="#facc15" stroke="#0f172a" strokeWidth={1} />
                </g>
              );
            })}

            {/* Plot Lambda(N) MEASURED dot at N = 1e4. */}
            {dotL(1e4, lambda1e4, '#86efac', 'imp-440 L*=' + lambda1e4.toFixed(4))}

            {/* Plot Lambda(N) CARRYFORWARD dot at N = 1e6. */}
            {dotL(1e6, lambda1e6, '#facc15', 'imp-1088 L*=' + lambda1e6.toFixed(4))}

            {/* X-axis. */}
            <line x1={0} x2={IW} y1={IH} y2={IH} stroke="#475569" />
            {xTicks.map((t) => (
              <g key={'xt-' + t} transform={'translate(' + x(t) + ',' + IH + ')'}>
                <line y1={0} y2={5} stroke="#475569" />
                <text y={18} textAnchor="middle" style={tickStyle}>{fmtN(t)}</text>
              </g>
            ))}
            <text x={IW / 2} y={IH + 42} textAnchor="middle" style={{ ...labelStyle, fontSize: 11 }}>N (log scale)</text>

            {/* Left y-axis (Lambda). */}
            <line x1={0} x2={0} y1={0} y2={IH} stroke="#475569" />
            {yTicks.map((t) => (
              <g key={'yt-' + t} transform={'translate(0,' + y(t) + ')'}>
                <line x1={-5} x2={0} stroke="#475569" />
                <text x={-8} y={3} textAnchor="end" style={tickStyle}>{t.toFixed(2)}</text>
              </g>
            ))}
            <text transform={'translate(-46,' + IH / 2 + ') rotate(-90)'} textAnchor="middle" style={{ ...labelStyle, fontSize: 11 }}>
              Lambda upper bound
            </text>

            {/* Right y-axis (rescue margin). */}
            <line x1={IW} x2={IW} y1={0} y2={IH} stroke="#facc15" strokeOpacity={0.5} />
            {yMarginTicks.map((t) => (
              <g key={'ym-' + t} transform={'translate(' + IW + ',' + yMargin(t) + ')'}>
                <line x1={0} x2={5} stroke="#facc15" strokeOpacity={0.5} />
                <text x={8} y={3} textAnchor="start" style={{ ...tickStyle, fill: '#facc15' }}>{t}x</text>
              </g>
            ))}
            <text transform={'translate(' + (IW + 58) + ',' + IH / 2 + ') rotate(90)'} textAnchor="middle" style={{ ...labelStyle, fontSize: 11, fill: '#facc15' }}>
              rescue margin factor
            </text>
          </g>
        </svg>
      </div>

      {/* Legend cards for each regime. */}
      <div className="card-grid" style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {REGIMES.map((r) => (
          <div key={r.id} className="card" style={{ borderLeft: '3px solid ' + r.text, padding: 14 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5, marginBottom: 6 }}>
              {fmtN(r.nLo)} to {fmtN(r.nHi)}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: r.text, marginBottom: 8 }}>
              {r.label}
            </div>
            <div style={{ marginBottom: 8 }}>
              {r.tickets.map((tid) => pill(r.text, tid))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{r.method}</div>
          </div>
        ))}
      </div>

      {/* Numeric reference table. */}
      <div className="card" style={{ marginTop: 24, padding: 14 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5, marginBottom: 8 }}>
          LAMBDA_BOUNDS (from lambda-roadmap.js)
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
          <thead>
            <tr style={{ background: 'var(--bg-primary)' }}>
              <th style={{ textAlign: 'left', padding: 6 }}>id</th>
              <th style={{ textAlign: 'left', padding: 6 }}>label</th>
              <th style={{ textAlign: 'left', padding: 6 }}>status</th>
              <th style={{ textAlign: 'left', padding: 6 }}>source</th>
            </tr>
          </thead>
          <tbody>
            {LAMBDA_BOUNDS.map((b) => (
              <tr key={b.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: 6, color: '#a855f7' }}>{b.id}</td>
                <td style={{ padding: 6 }}>{b.label}</td>
                <td style={{ padding: 6, color: 'var(--text-secondary)' }}>{b.status}</td>
                <td style={{ padding: 6, color: 'var(--text-muted)' }}>{b.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Source citation. */}
      <div style={{ marginTop: 16, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Data sources: LAMBDA_BOUNDS (src/data/lambda-roadmap.js),
        K_PLATEAU_LADDER (src/data/finite-k-c-mb-unconditional.js),
        FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN.rigorousUnconditionalBeat and
        rigorousUnconditionalBeatCarryforwardN1e6 (src/data/finite-height-beats-platt-trudgian.js).
        Closing tickets: imp-440 (measured beat at N = 1e4), imp-1082 / imp-1087 / imp-1088
        (batch-1 / batch-2 / batch-3 CAPSTONE conservative carryforward to N = 1e6),
        imp-486 (asymptotic-rate barrier at N = 1e6), imp-370 (ESY arithmetic-input port,
        partial closure of obstacle O1).
      </div>
    </div>
  );
}
