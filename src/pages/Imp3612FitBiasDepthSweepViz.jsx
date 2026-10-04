import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3612_DEPTH_SWEEP,
  IMP3612_NINE_RUNG_DEPTH,
  IMP3612_NINE_RUNG_DEV,
  IMP3612_MAX_MODEL_REL_ERR,
} from '../data/imp-3612-fit-bias-depth-sweep-viz-data.js';
import { ED } from '../styles/tokens.js';

const ACTUAL_COLOR = ED.series1;
const PREDICTED_COLOR = ED.series3;
const MARK_COLOR = ED.series7;

function DepthSweepChart() {
  const svgW = 640;
  const padL = 70;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const depths = IMP3612_DEPTH_SWEEP.map((d) => d.depth);
  const dMin = depths[0];
  const dMax = depths[depths.length - 1];
  const logYMin = Math.log10(2e-6);
  const logYMax = Math.log10(1e-4);

  const xS = (depth) => padL + ((depth - dMin) / (dMax - dMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logYMin) / (logYMax - logYMin));

  const actualPath = IMP3612_DEPTH_SWEEP.map(
    (d, i) => (i === 0 ? 'M' : 'L') + xS(d.depth).toFixed(1) + ',' + yS(d.actualDev).toFixed(2),
  ).join(' ');
  const predictedPath = IMP3612_DEPTH_SWEEP.map(
    (d, i) => (i === 0 ? 'M' : 'L') + xS(d.depth).toFixed(1) + ',' + yS(d.predictedDev).toFixed(2),
  ).join(' ');

  const nineRung = IMP3612_DEPTH_SWEEP.find((d) => d.depth === IMP3612_NINE_RUNG_DEPTH);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[2e-6, 5e-6, 1e-5, 2e-5, 5e-5, 1e-4].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      <path d={predictedPath} fill="none" stroke={PREDICTED_COLOR} strokeWidth={1.6} strokeDasharray="4,3" />
      {IMP3612_DEPTH_SWEEP.map((d) => (
        <circle key={'p' + d.depth} cx={xS(d.depth)} cy={yS(d.predictedDev)} r={2.4} fill={PREDICTED_COLOR} />
      ))}

      <path d={actualPath} fill="none" stroke={ACTUAL_COLOR} strokeWidth={2} />
      {IMP3612_DEPTH_SWEEP.map((d) => (
        <circle
          key={'a' + d.depth}
          cx={xS(d.depth)}
          cy={yS(d.actualDev)}
          r={d.depth === IMP3612_NINE_RUNG_DEPTH ? 3.6 : 2.6}
          fill={d.depth === IMP3612_NINE_RUNG_DEPTH ? MARK_COLOR : ACTUAL_COLOR}
        />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {depths.map((depth) => (
        <g key={'x' + depth}>
          <line x1={xS(depth)} y1={padT + cH} x2={xS(depth)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(depth)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {depth}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        ladder depth (rungs)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        |p_fit - 2| (log scale)
      </text>

      <g fontSize={9}>
        <circle cx={padL + 8} cy={padT + 12} r={3.6} fill={MARK_COLOR} />
        <text x={padL + 16} y={padT + 15} fill={ED.series7}>imp-3553 nine-rung point ({nineRung.actualDev.toExponential(2)})</text>
        <line x1={padL + 2} y1={padT + 26} x2={padL + 10} y2={padT + 26} stroke={ACTUAL_COLOR} strokeWidth={2} />
        <text x={padL + 14} y={padT + 29} fill={ED.series1}>Actual least-squares |p_fit - 2|</text>
        <line x1={padL + 2} y1={padT + 40} x2={padL + 10} y2={padT + 40} stroke={PREDICTED_COLOR} strokeWidth={1.6} strokeDasharray="4,2" />
        <text x={padL + 14} y={padT + 43} fill={ED.series3}>Predicted p_fit = 2 + D_3 cov(a^2,ln a)/var(ln a)</text>
      </g>
    </svg>
  );
}

export default function Imp3612FitBiasDepthSweepViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Remainder-Tail Fit-Bias Depth Sweep (imp-3581 / imp-3612)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3581 derived the moment-remainder tail exponent p = 2 in closed form and showed that
        the fitted least-squares slope reads slightly below 2 purely because of an O(a^2) log-log
        curvature bias, p_fit = 2 + D_3 cov(a^2, ln a)/var(ln a). Deepening the odd R_3 ladder
        (smaller deepest a) shrinks this bias monotonically toward 0: |p_fit - 2| falls from{' '}
        {IMP3612_DEPTH_SWEEP[0].actualDev.toExponential(2)} at depth 3 to{' '}
        {IMP3612_DEPTH_SWEEP[IMP3612_DEPTH_SWEEP.length - 1].actualDev.toExponential(2)} at depth 18.
        The imp-3553 nine-rung cancellation-free fit ({IMP3612_NINE_RUNG_DEV.toExponential(2)}) sits
        exactly on this curve, and the closed-form predicted curve reproduces the actual
        least-squares slope to within {IMP3612_MAX_MODEL_REL_ERR.toExponential(1)} relative error
        at every depth.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        |p_fit - 2| vs deepest clean rung: actual fit vs the D_3-driven predicted curve
      </p>
      <DepthSweepChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the solid line is the
        actual least-squares slope deviation measured on each depth-k geometric ladder; the dashed
        line is the closed prediction 2 + D_3 cov(a^2, ln a)/var(ln a) from the same derivation.
        The two curves are visually indistinguishable because the model error is ~1e-9 in absolute
        terms -- the shortfall from 2 is fully explained curvature, not exponent drift. The marked
        point is the imp-3553 nine-rung fit, whose deepest rung a = 2^-9 is set by the odd
        cancellation floor a0*M_1*eps ~ 5e-21.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/derivation only --
        this certifies the decay ORDER (p=2) of a fixed-weight Taylor remainder and explains a
        fit-bias artifact; it establishes NO operator positivity. RH-equivalent,
        necessary-but-not-sufficient; the imp-3066 K_a &ge; 0 sign-positivity obstruction is
        UNTOUCHED. No RH verdict, no QED.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3611-skew-toeplitz-krylov-gap-ladder" style={{ color: 'var(--series-5)' }}>
          Corrected-Krylov Skew-Toeplitz Gap Ladder (imp-3611)
        </Link>
      </div>
    </div>
  );
}
