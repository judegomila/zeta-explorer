import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33214_RUNGS,
  IMP33214_WELL_MIN_N,
  IMP33214_WELL_MIN_R,
  IMP33214_SHOULDER_N,
  IMP33214_TAIL_HI_N,
  IMP33214_TAIL_HI_R,
  IMP33214_RECOVERY_FRACTION,
} from '../data/imp-33214-saddle-ratio-deep-tail-recovery-viz-data.js';
import { ED } from '../styles/tokens.js';

const X_MIN = 500;
const X_MAX = 1424;

function DeepTailChart() {
  const svgW = 640;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const yMin = -0.00062;
  const yMax = -0.00034;

  const xS = (n) => padL + ((n - X_MIN) / (X_MAX - X_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const path = IMP33214_RUNGS.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.r).toFixed(2),
  ).join(' ');

  const yTicks = [-0.0006, -0.00055, -0.0005, -0.00045, -0.0004, -0.00035];
  const xTicks = [500, 624, 790, 1000, 1200, 1424];

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

      {/* imp-3849 well minimum marker at n=500 */}
      <circle cx={xS(IMP33214_WELL_MIN_N)} cy={yS(IMP33214_WELL_MIN_R)} r={4.5} fill="none" stroke={ED.series1} strokeWidth={1.6} />
      <text x={xS(IMP33214_WELL_MIN_N) + 6} y={yS(IMP33214_WELL_MIN_R) - 8} fill={ED.series1} fontSize={8.5}>
        well min n={IMP33214_WELL_MIN_N}
      </text>

      {/* imp-3869 recovery-rate shoulder marker at n~790 */}
      <line
        x1={xS(IMP33214_SHOULDER_N)}
        y1={padT}
        x2={xS(IMP33214_SHOULDER_N)}
        y2={padT + cH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="2,3"
      />
      <text x={xS(IMP33214_SHOULDER_N) + 4} y={padT + 12} fill={ED.brass} fontSize={8.5}>
        rate shoulder n~{IMP33214_SHOULDER_N}
      </text>

      {/* imp-3869 last rung marker at n=1424 */}
      <circle cx={xS(IMP33214_TAIL_HI_N)} cy={yS(IMP33214_TAIL_HI_R)} r={4.5} fill="none" stroke={ED.series3} strokeWidth={1.6} />
      <text x={xS(IMP33214_TAIL_HI_N) - 6} y={yS(IMP33214_TAIL_HI_R) - 8} textAnchor="end" fill={ED.series3} fontSize={8.5}>
        n=1424, ~{(IMP33214_RECOVERY_FRACTION * 100).toFixed(0)}% recovered
      </text>

      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2.4} />
      {IMP33214_RUNGS.map((r) => (
        <circle key={r.n} cx={xS(r.n)} cy={yS(r.r)} r={1.8} fill={ED.series1} />
      ))}

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

export default function Imp33214SaddleRatioDeepTailRecoveryViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Deep-Tail Exact-Saddle Ratio Recovery, n=500..1424 (imp-3849 / imp-3869)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3869 extended the imp-3849 inner-converged exact-saddle ratio ladder
        r_n = R_n - 1 = |D_n|/|D_n<sup>saddle</sup>| - 1 past its last rung n = 624
        (blue well marker at n = 500, r_min = -5.845e-4) a further ~800 rungs to n = 1424
        (green marker). Across the whole extended range R_n stays BELOW 1 and climbs back
        toward 1 MONOTONICALLY, with no second sign change and no second well -- the sole
        excursion is the single n~500 basin. The only additional feature is a shoulder
        (inflection of the recovery rate dr/dn) near n~790 (yellow dashed line), where the
        climb stops accelerating and begins to decelerate.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        r_n vs n, n=500..1424 (linear): the slow monotone climb out of the basin, past the
        recovery-rate shoulder, to the last measured rung
      </p>
      <DeepTailChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the recovery is slow
        and incomplete -- at n = 1424 the ratio is only R_1424 = 0.999617
        (r_1424 = -3.828e-4), about {(IMP33214_RECOVERY_FRACTION * 100).toFixed(0)}% of the
        way back from the well minimum to 0. The recovery rate dr/dn accelerates out of the
        well, peaks near n~790 (the shoulder), then decelerates monotonically as it tracks
        the imp-3735 |eps_n| Laplace tail vanishing at large n -- an inflection in the curve,
        not a new crossing.
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
        only -- no proof, no reduction below RH. This extends a moment-ratio convergence
        diagnostic into the deep-n tail; mass-feasibility is necessary-but-not-sufficient and
        the operator-level K_a &ge; 0 sign-positivity residual (imp-3066) remains untouched.
        The imp-3849 and imp-3731 assertions are left intact.
      </div>
    </div>
  );
}
