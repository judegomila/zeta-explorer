import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35238_REAL_ORDINATE_THREE_FACTOR_INVARIANT } from '../data/imp-35238-real-ordinate-three-factor-invariant.js';
import { ED } from '../styles/tokens.js';

// Baked literals imported verbatim from the imp-35238 data module; no new
// computation is performed here (viz/UX only).
const { nearFrontTable: NEAR_FRONT_TABLE, invariantTrajectory: TRAJECTORY } =
  IMP35238_REAL_ORDINATE_THREE_FACTOR_INVARIANT;

function TrajectoryChart() {
  const svgW = 700;
  const padL = 60;
  const padR = 24;
  const padT = 44;
  const padB = 48;
  const plotW = svgW - padL - padR;
  const plotH = 280;
  const svgH = padT + plotH + padB;

  // Log-x across min-gap fraction (0.5 .. 1e-4), linear-y across the two products (0 .. ~1.6).
  const xMin = Math.log10(0.00007);
  const xMax = Math.log10(0.7);
  const yMin = 0;
  const yMax = 1.6;

  const xOf = (frac) => padL + ((Math.log10(frac) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const invariantPath = TRAJECTORY.map(
    (s, i) => `${i === 0 ? 'M' : 'L'} ${xOf(s.fraction)} ${yOf(s.invariant)}`,
  ).join(' ');
  const bareProductPath = TRAJECTORY.map(
    (s, i) => `${i === 0 ? 'M' : 'L'} ${xOf(s.fraction)} ${yOf(s.bareProduct)}`,
  ).join(' ');

  const yLimitLine = yOf(1);
  const xTicks = [0.5, 0.1, 0.01, 0.001, 0.0001];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 26} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        N=100 real-ordinate flow: three-factor invariant vs bare product across min-gap fraction
      </text>

      <line
        x1={padL}
        y1={yLimitLine}
        x2={padL + plotW}
        y2={yLimitLine}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={padL + plotW} y={yLimitLine - 4} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
        invariant limit = 1
      </text>

      {bareProductPath && <path d={bareProductPath} fill="none" stroke={ED.series2} strokeWidth={2} strokeDasharray="4 3" />}
      {invariantPath && <path d={invariantPath} fill="none" stroke={ED.series5} strokeWidth={2.25} />}

      {TRAJECTORY.map((s) => (
        <circle key={`inv-${s.fraction}`} cx={xOf(s.fraction)} cy={yOf(s.invariant)} r={3.5} fill={ED.brassDeco} />
      ))}
      {TRAJECTORY.map((s) => (
        <circle key={`bp-${s.fraction}`} cx={xOf(s.fraction)} cy={yOf(s.bareProduct)} r={3} fill={ED.series2} />
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((f) => (
        <text key={f} x={xOf(f)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {f}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        min-gap fraction (log scale, decreasing toward the front)
      </text>

      {[0, 0.4, 0.8, 1.2, 1.6].map((v) => (
        <text key={v} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v}
        </text>
      ))}

      <g>
        <line x1={padL + 4} y1={padT - 12} x2={padL + 24} y2={padT - 12} stroke={ED.series5} strokeWidth={2.25} />
        <text x={padL + 30} y={padT - 8} fill={ED.series5} fontSize={8.5}>
          three-factor invariant beta*g_min*(x_2-x_0)
        </text>
        <line x1={padL + 300} y1={padT - 12} x2={padL + 320} y2={padT - 12} stroke={ED.series2} strokeWidth={2} strokeDasharray="4 3" />
        <text x={padL + 326} y={padT - 8} fill={ED.series2} fontSize={8.5}>
          bare product beta*g_min
        </text>
      </g>
    </svg>
  );
}

export default function Imp35293ThreeFactorInvariantRealOrdinatesViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Three-Factor Invariant Convergence on Real Ordinates (imp-35293)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-35238 measurement re-runs the imp-35218 real-ordinate backward-Dyson flow (first N
        real Riemann zero ordinates) to min-gap fraction 1e-4. The three-factor product
        beta&middot;g_min&middot;(x_2&minus;x_0) converges to the SAME rational constant 1 that the
        imp-35215 unit-spacing derivation gave, even though the bare product beta&middot;g_min lands
        in a smaller, N-dependent 0.36&ndash;0.64 band (imp-35218 R2). The gap between the two curves
        is closed by the local-span factor x_2&minus;x_0, which is the LOCAL real spacing at the
        collapsing pair (not the unit ambient scale).
      </p>

      <TrajectoryChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>invariant (front, frac 1e-4)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>bare product beta*g_min</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>span (x_2-x_0)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>1/span</th>
          </tr>
        </thead>
        <tbody>
          {NEAR_FRONT_TABLE.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: 'var(--series-3)' }}>
                {r.invariant.toFixed(6)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.bareProduct.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.span.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.reciprocalSpan.toFixed(6)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The invariant column sits at 1 to within a few &times;1e-4 at every N &mdash; N-uniform &mdash;
        while the bare product spreads across the whole 0.35&ndash;0.53 band because it tracks
        1/span, and span (the local real spacing at the collapsing pair) is itself non-monotone in N.
        The invariant restores what the bare product alone cannot show.
      </p>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page reusing the
        imp-35238 baked nearFrontTable/invariantTrajectory literals verbatim (no new computation).
        Measurement only; beta itself still diverges ~1/g_min toward the front, so M2/M5 stay OPEN;
        C_mb GUE-conditional (imp-486) untouched; changes no bound; establishes no operator
        positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
