import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96621_SIGMA2_LADDER,
  IMP96621_SIGMA2_CROSSING,
  IMP96621_SIGMA1_LADDER,
  IMP96621_SIGMA1_AMBIGUOUS_POINT,
  IMP96621_HONEST_BANNER,
} from '../data/imp-96621-sigma2-lammin-margin-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// lambda_min(T_a[sigma_2]) vs 2a: falls from 56 at 2a=0.9 through 0.552 at
// (ln 3)/2 and crosses zero between 2a=1.12 and 1.1316. Linear y-axis with a
// highlighted zero line so the sign flip reads directly off the chart.
function Sigma2Panel() {
  const rows = IMP96621_SIGMA2_LADDER;
  const svgW = 700;
  const padL = 60;
  const padR = 20;
  const svgH = 300;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xs = rows.map((r) => r.twoA);
  const minX = Math.min(...xs) - 0.02;
  const maxX = Math.max(...xs) + 0.02;
  const ys = rows.map((r) => r.lambdaMinN36);
  const minY = Math.min(...ys) - 5;
  const maxY = Math.max(...ys) + 5;

  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {/* zero line */}
      <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke={ED.series2} strokeWidth={1} strokeDasharray="3 3" />
      <text x={padL + plotW - 4} y={yOf(0) - 5} textAnchor="end" fill={ED.series2} fontSize={8}>
        lambda_min = 0
      </text>

      {/* theorem-range boundary at 2a = 0.96 */}
      <line x1={xOf(0.96)} y1={padT} x2={xOf(0.96)} y2={padT + plotH} stroke={ED.series3} strokeWidth={1} strokeDasharray="4 3" />
      <text x={xOf(0.96)} y={padT - 6} textAnchor="middle" fill={ED.series3} fontSize={8}>
        theorem wall 2a=0.96
      </text>

      {/* ln 3 boundary */}
      <line x1={xOf(Math.log(3))} y1={padT} x2={xOf(Math.log(3))} y2={padT + plotH} stroke={ED.series5} strokeWidth={1} strokeDasharray="4 3" />
      <text x={xOf(Math.log(3))} y={padT + plotH + 34} textAnchor="middle" fill={ED.series5} fontSize={8}>
        ln 3
      </text>

      {[minY, 0, maxY].map((v) => (
        <text key={`y${v.toFixed(1)}`} x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
          {v.toFixed(0)}
        </text>
      ))}
      {rows.map((r) => (
        <text key={`x${r.twoA}`} x={xOf(r.twoA)} y={padT + plotH + 15} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
          {r.twoA.toFixed(2)}
        </text>
      ))}

      <polyline
        points={rows.map((r) => `${xOf(r.twoA)},${yOf(r.lambdaMinN36)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={1.4}
      />
      {rows.map((r) => (
        <circle
          key={`p${r.twoA}`}
          cx={xOf(r.twoA)}
          cy={yOf(r.lambdaMinN36)}
          r={3.5}
          fill={r.lambdaMinN36 >= 0 ? ED.series1 : ED.series2}
        />
      ))}

      <text x={padL + plotW / 2} y={padT + plotH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        2a
      </text>
      <text x={16} y={padT + plotH / 2} fill={ED.inkSoft} fontSize={9} transform={`rotate(-90 16 ${padT + plotH / 2})`}>
        lambda_min(T_a[sigma_2])
      </text>
    </svg>
  );
}

// lambda_min(T_a[sigma_1]) vs 2a on a small range (0.04 down to ~2e-4), plus
// the (ln 3)/2 point with an error bar showing the superseded raw straddle.
function Sigma1Panel() {
  const rows = IMP96621_SIGMA1_LADDER;
  const amb = IMP96621_SIGMA1_AMBIGUOUS_POINT;
  const svgW = 700;
  const padL = 70;
  const padR = 20;
  const svgH = 260;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const allTwoA = [...rows.map((r) => r.twoA), amb.twoA];
  const minX = Math.min(...allTwoA) - 0.01;
  const maxX = Math.max(...allTwoA) + 0.01;
  const allY = [...rows.map((r) => r.lambdaMin), amb.rawTcut300, amb.rawTcut800, amb.resolvedConverged];
  const minY = Math.min(...allY) - 0.003;
  const maxY = Math.max(...allY) + 0.003;

  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke={ED.series2} strokeWidth={1} strokeDasharray="3 3" />

      {[minY, 0, maxY].map((v) => (
        <text key={`y${v.toFixed(4)}`} x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
          {v.toFixed(3)}
        </text>
      ))}
      {rows.map((r) => (
        <text key={`x${r.twoA}`} x={xOf(r.twoA)} y={padT + plotH + 15} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
          {r.twoA.toFixed(2)}
        </text>
      ))}
      <text x={xOf(amb.twoA)} y={padT + plotH + 15} textAnchor="middle" fill={ED.series5} fontSize={7.5}>
        ln3
      </text>

      <polyline
        points={rows.map((r) => `${xOf(r.twoA)},${yOf(r.lambdaMin)}`).join(' ')}
        fill="none"
        stroke={ED.brassDeco}
        strokeWidth={1.4}
      />
      {rows.map((r) => (
        <circle key={`p${r.twoA}`} cx={xOf(r.twoA)} cy={yOf(r.lambdaMin)} r={3.5} fill={ED.brassDeco} />
      ))}

      {/* ambiguous point: error bar spanning the raw tcut300/tcut800 straddle, resolved value marked */}
      <line
        x1={xOf(amb.twoA)}
        y1={yOf(amb.rawTcut300)}
        x2={xOf(amb.twoA)}
        y2={yOf(amb.rawTcut800)}
        stroke={ED.series5}
        strokeWidth={1.5}
      />
      <circle cx={xOf(amb.twoA)} cy={yOf(amb.resolvedConverged)} r={4} fill={ED.series5} stroke={ED.inkSoft} strokeWidth={1} />

      <text x={padL + plotW / 2} y={padT + plotH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        2a
      </text>
      <text x={16} y={padT + plotH / 2} fill={ED.inkSoft} fontSize={9} transform={`rotate(-90 16 ${padT + plotH / 2})`}>
        lambda_min(T_a[sigma_1])
      </text>
    </svg>
  );
}

export default function Imp96621Sigma2LamminMarginLadderViz() {
  const crossLo = IMP96621_SIGMA2_CROSSING.lastPositive;
  const crossHi = IMP96621_SIGMA2_CROSSING.firstNegative;
  const amb = IMP96621_SIGMA1_AMBIGUOUS_POINT;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="lambda_min(T_a[sigma_2]) Margin Ladder vs 2a, and the sigma_1 Sign Ambiguity Near ln 3" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96621_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The pole-free Route I Weil-positivity target is T_a[sigma_2] &gt;= 0, sigma_2 = (t^2+1/4)^2 w_1.
        Its measured Rayleigh-Ritz floor lambda_min(T_a[sigma_2]) falls from 56.05 at 2a=0.90 through
        0.552 at (ln 3)/2 = {(Math.log(3) / 2).toFixed(4)}, staying positive through the interval-verified
        theorem wall 2a=0.96, then crosses zero between 2a={crossLo.twoA.toFixed(2)}
        {' '}(lambda_min={crossLo.lambdaMin.toFixed(3)}) and 2a={crossHi.twoA.toFixed(4)}
        {' '}(lambda_min={crossHi.lambdaMin.toFixed(2)}).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        lambda_min(T_a[sigma_2]) vs 2a
      </h3>
      <Sigma2Panel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        lambda_min(T_a[sigma_1]) vs 2a (CC Q-trick, half-pole-free symbol)
      </h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        The half-pole-free symbol sigma_1 = (t^2+1/4) w_1 gives a margin that also falls, by two orders
        of magnitude, from 0.0400 at a=0.45 to 2.1e-4 at a=0.54. At exactly (ln 3)/2 the raw finite
        t-cutoff estimates straddle zero (tcut300={amb.rawTcut300.toExponential(2)}, tcut800=
        {' '}{amb.rawTcut800.toExponential(2)}, purple error bar); the tail-inclusive recompute (imp-96607)
        resolves the sign positive at {amb.resolvedConverged.toExponential(2)} (purple dot).
      </p>
      <Sigma1Panel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the sky-blue curve is
        lambda_min(T_a[sigma_2]) descending through the red zero line, with the green dashed marker at
        the interval-verified theorem wall 2a=0.96 and the violet dashed marker at ln 3. The crossing
        (red-filled point) sits well past both, so it has no bearing on the proved range. In the lower
        panel the amber curve is the sigma_1 margin decaying by two decades; the purple error bar at
        ln 3 shows the historical sign-unresolved spread that the tail-inclusive recompute closed to a
        small positive value.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96621
        viz-data (ladders reshaped verbatim from the Route I Toeplitz/Krein certificate literals).
        {' '}{IMP96621_HONEST_BANNER}
      </div>
    </div>
  );
}
