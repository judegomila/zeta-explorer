import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  ROUTE_B_LEADING_EXPONENT,
  SLOPE_LADDER,
} from '../data/imp-36288-routeB-slope-convergence-viz-data.js';
import { ED } from '../styles/tokens.js';

const POINTS = SLOPE_LADDER.map((row, i) => ({ ...row, idx: i }));

function SlopeConvergenceChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xs = POINTS.map((p) => p.idx);
  const ys = POINTS.map((p) => p.slope);

  const xMin = 0;
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys, ROUTE_B_LEADING_EXPONENT) - 0.005;
  const yMax = Math.max(...ys) + 0.005;

  const px = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const py = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const pathD = POINTS.map((p, i) => {
    const x = px(p.idx);
    const y = py(p.slope);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const limitY = py(ROUTE_B_LEADING_EXPONENT);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1.5}
      />

      <line
        x1={padL}
        y1={limitY}
        x2={padL + plotW}
        y2={limitY}
        stroke={ED.series7}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 4} y={limitY - 6} textAnchor="end" fill={ED.series7} fontSize={9}>
        limit -1/4
      </text>

      <path d={pathD} fill="none" stroke={ED.series1} strokeWidth={2} />
      {POINTS.map((p) => (
        <circle key={p.window} cx={px(p.idx)} cy={py(p.slope)} r={4} fill={ED.series1} />
      ))}

      <text x={padL + plotW / 2} y={svgH - 8} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
        ladder window (N growing left to right, 1e2 &rarr; 1e300)
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        local log-log slope of r_B(N)
      </text>
    </svg>
  );
}

export default function Imp36288RouteBSlopeConvergenceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route-B Rate Slope Convergence to -1/4 (imp-36288 / imp-36151)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-36082 derived the explicit, unconditional Route-B per-N rate r_B(N) = C&prime;
        &radic;(log &gamma;<sub>N</sub>) N<sup>-1/4</sup>, with pinned leading exponent -1/4.
        Because the sqrt(log &gamma;<sub>N</sub>) dressing is slowly varying, the local (finite-window)
        log-log slope sits ABOVE -1/4 at any finite N and only tightens toward the limit as N grows.
        imp-36151 witnessed this qualitatively with a two-point check; this chart bakes the same
        r_B(N) machinery across ten consecutive windows spanning N = 1e2 through 1e300, showing the
        local slope monotonically approaching {ROUTE_B_LEADING_EXPONENT} from above and never
        crossing it.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        local log-log slope of r_B(N) per ladder window, approaching the -1/4 limit from above
      </p>
      <SlopeConvergenceChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>window</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>local slope</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>gap to -1/4</th>
          </tr>
        </thead>
        <tbody>
          {POINTS.map((p) => (
            <tr key={p.window} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.window}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {p.slope.toFixed(6)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {(p.slope - ROUTE_B_LEADING_EXPONENT).toExponential(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only, baking the
        imp-36082 r_B(N) rate formula and the imp-36151 slope-convergence witness unchanged across a
        wider ladder. r_B(N) bounds a shock-time DEVIATION, not |t_c(N)| absolutely (imp-36082
        CONSUMABLE-MODULO-ANCHOR); per imp-36151, Route-B owning the only pinned per-N exponent does
        NOT mean the imp-36045 Route-C &gt; Route-B ranking reflects a faster exponent -- that ranking
        is on unconditional-consumability readiness. Certifies no bound; C_mb GUE-conditional
        (imp-486) untouched; no RH verdict, NO QED.
      </div>
    </div>
  );
}
