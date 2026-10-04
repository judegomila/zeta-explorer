import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3862_RUNGS,
  IMP3862_CROSSING_N_STAR,
  IMP3862_UNDERSHOOT_MIN_N,
  IMP3862_UNDERSHOOT_MIN_R,
} from '../data/imp-3862-saddle-ratio-crossing-viz-data.js';
import { ED } from '../styles/tokens.js';

const N_MIN = 150;
const N_MAX = 280;

function SaddleRatioCrossingChart() {
  const svgW = 640;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const yMin = -0.00013;
  const yMax = 0.00105;

  const xS = (n) => padL + ((n - N_MIN) / (N_MAX - N_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const path = IMP3862_RUNGS.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.r).toFixed(2),
  ).join(' ');

  const yTicks = [-0.0001, 0, 0.0002, 0.0004, 0.0006, 0.0008, 0.001];
  const xTicks = [150, 175, 200, 225, 250, 275];

  const undershootRow = IMP3862_RUNGS.find((r) => r.n === IMP3862_UNDERSHOOT_MIN_N);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(1)}
          </text>
        </g>
      ))}

      {/* zero line: R_n = 1 */}
      <line x1={padL} y1={yS(0)} x2={padL + cW} y2={yS(0)} stroke={ED.series7} strokeWidth={1.2} strokeDasharray="4,3" />
      <text x={padL + cW - 4} y={yS(0) - 5} textAnchor="end" fill={ED.series7} fontSize={8.5}>
        R_n = 1 (r_n = 0)
      </text>

      {/* the crossing n* ~ 225.54 */}
      <line
        x1={xS(IMP3862_CROSSING_N_STAR)}
        y1={padT}
        x2={xS(IMP3862_CROSSING_N_STAR)}
        y2={padT + cH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="2,3"
      />
      <text x={xS(IMP3862_CROSSING_N_STAR) + 4} y={padT + 12} fill={ED.brass} fontSize={8.5}>
        n* = {IMP3862_CROSSING_N_STAR.toFixed(2)}
      </text>

      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2.4} />
      {IMP3862_RUNGS.map((r) => (
        <circle
          key={r.n}
          cx={xS(r.n)}
          cy={yS(r.r)}
          r={r.n === 225 || r.n === 226 ? 3.6 : 2.4}
          fill={r.n === 225 || r.n === 226 ? ED.brassDeco : ED.series1}
        />
      ))}

      {/* undershoot minimum marker at n=276 */}
      <circle cx={xS(IMP3862_UNDERSHOOT_MIN_N)} cy={yS(IMP3862_UNDERSHOOT_MIN_R)} r={4.5} fill="none" stroke={ED.series7} strokeWidth={1.6} />

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {xTicks.map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {n}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        n
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        r_n = R_n - 1
      </text>
    </svg>
  );
}

export default function Imp3862SaddleRatioCrossingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Exact-Saddle Ratio Crossing r_n = R_n - 1 at n* ~ 225.54 (imp-3731 / imp-3862)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3731 pinned the imp-3713 exact-Laplace-saddle ratio R_n = |D_n|/|D_n<sup>saddle</sup>|
        crossing of unity to a grid-stable n* = 225.5427323 (compensated Neumaier moment solve,
        baseline vs finer grid differ by only 1.35e-9), and traced the sub-unity undershoot beyond
        it out to n=280. The chart below plots r_n = R_n - 1 across n=150..280: r_n falls from
        +1.03e-3 at n=150, crosses zero between the imp-3713 bracket rungs r_225 = +2.746e-6 and
        r_226 = -2.314e-6 (gold markers), then deepens to a shallow-well minimum r_min = -1.129e-4
        at n=276 (pink ring) before beginning to recover toward zero.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        r_n = R_n - 1 vs n, n=150..280: the unity crossing at n*=225.54 (yellow dashed line),
        the r_225/r_226 sign-flip bracket (gold points), and the undershoot minimum at n=276
      </p>
      <SaddleRatioCrossingChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the ratio does not
        asymptote to 1 from above -- it OVERSHOOTS past unity at a finite n, dips into a shallow
        sub-unity well bottoming out at n=276 (R_n &asymp; 0.99989), then slowly recovers back
        toward 1 for n &gt; 276. This crossing-then-recovery shape, not a monotone approach, is
        the residual imp-3713 first flagged and imp-3731 pinned to ~1e-9 grid-stability.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)',
          borderLeft: '3px solid var(--brass-deco)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        <strong style={{ color: 'var(--brass)' }}>Superseded by imp-3849:</strong> this n* = 225.54
        crossing and its ~1.13e-4-deep well are grid-stable against the OUTER moment-solve grid,
        but both imp-3713 and imp-3731 fix the INNER A(tau) autocorrelation quadrature at a
        coarse inner=1200 panel count. imp-3849 later showed that converging that inner
        quadrature moves the true crossing to n* = 215.2 and deepens the well roughly 5x (to
        r_min &asymp; -5.845e-4 near n~500). So the curve above is a real, reproducible ladder --
        just one now identified as an inner-quadrature artifact rather than the fully-converged
        crossing; see the imp-3849 inner-converged ladder for the superseding result.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/visualization
        only -- no proof, no reduction below RH. This pins the convergence-diagnostic crossing of
        a moment-ratio ladder; mass-feasibility is necessary-but-not-sufficient and the
        operator-level K_a &ge; 0 sign-positivity residual (imp-3066) remains untouched.
      </div>
    </div>
  );
}
