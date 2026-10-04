import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT } from '../data/imp-35243-reentry-band-surrogate-fidelity-assessment.js';
import { ED } from '../styles/tokens.js';

// Baked literals imported verbatim from the imp-35243 data module; no new
// computation is performed here (viz/UX only). The slope itself,
// decade_shift_per_floor_halving = log(2)/(LN_INV_R*DRIFT_PER_DECADE), is
// re-derived from the module's own D1 output for the k-range curve below.
const { demonstration_D1_floor_sensitivity: D1, demonstration_D2_extrapolation_gap: D2 } =
  IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT;

const REENTRY_EXP = D2.reentry_decades_above_verified + D2.pt_verified_height_log10;
const K_RANGE = [-3, -2, -1, 0, 1, 2, 3];
const CURVE_POINTS = K_RANGE.map((k) => ({
  k,
  log10N: REENTRY_EXP + k * D1.decade_shift_per_floor_halving,
}));

function FloorFactorCurve() {
  const svgW = 700;
  const padL = 56;
  const padR = 24;
  const padT = 44;
  const padB = 48;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const kMin = K_RANGE[0];
  const kMax = K_RANGE[K_RANGE.length - 1];
  const xOf = (k) => padL + ((k - kMin) / (kMax - kMin)) * plotW;

  const yMin = CURVE_POINTS[0].log10N;
  const yMax = CURVE_POINTS[CURVE_POINTS.length - 1].log10N;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const linePath = CURVE_POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.k)} ${yOf(p.log10N)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 20} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        D1: reentry-band position vs. machine-epsilon floor factor EPS_FP&nbsp;&times;&nbsp;2^k
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {K_RANGE.map((k) => (
        <g key={k}>
          <line x1={xOf(k)} y1={padT + plotH} x2={xOf(k)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(k)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {k >= 0 ? `2^${k}` : `2^(${k})`}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        EPS_FP scale factor (k)
      </text>

      {[yMin, (yMin + yMax) / 2, yMax].map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            10^{v.toFixed(1)}
          </text>
        </g>
      ))}
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        band position, log10 N
      </text>

      <path d={linePath} fill="none" stroke={ED.series5} strokeWidth={2} />
      {CURVE_POINTS.map((p) => (
        <circle key={p.k} cx={xOf(p.k)} cy={yOf(p.log10N)} r={4} fill={ED.series5} />
      ))}

      <circle cx={xOf(0)} cy={yOf(REENTRY_EXP)} r={5} fill={ED.series3} />
      <text x={xOf(0)} y={yOf(REENTRY_EXP) - 12} textAnchor="middle" fill={ED.series3} fontSize={9}>
        k=0: 10^{REENTRY_EXP.toFixed(2)} (present EPS_FP)
      </text>
    </svg>
  );
}

export default function Imp35344FloorSensitivityCurveViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="D1 Floor-Sensitivity Curve: Reentry Band vs. EPS_FP Scale (imp-35344)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-35243 D1 demonstration shows the iters-to-floor reentry-band position is a linear
        function of k in the machine-epsilon agreement floor EPS_FP&nbsp;&times;&nbsp;2^k: the slope
        is exactly log(2)/(LN_INV_R&nbsp;&times;&nbsp;DRIFT_PER_DECADE)&nbsp;&asymp;&nbsp;
        {D1.decade_shift_per_floor_halving.toFixed(2)} decades in N per unit of k. The chart below
        plots this line over k&nbsp;=&nbsp;&minus;3..3, baked from the imp-35243 module&rsquo;s own D1
        literals (no re-derivation).
      </p>

      <FloorFactorCurve />

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
        imp-35243 baked demonstration_D1_floor_sensitivity literals verbatim (the per-k points are
        arithmetic extensions of the same linear slope, not new computation). The true
        infinite-precision continuum has no machine-epsilon floor and hence no counterpart to this
        curve at all &mdash; the line exists only because the surrogate is discrete and
        floor-limited (imp-35243). Changes no bound; establishes no operator positivity; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
