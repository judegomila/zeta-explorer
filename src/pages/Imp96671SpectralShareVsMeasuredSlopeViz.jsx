import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96671_TWOSCALE_PARAMS,
  IMP96671_MEASURED_FRACTION,
  IMP96671_EXACT_SHARE_N3000,
} from '../data/imp-96671-spectral-share-vs-measured-slope-viz-data.js';
import { ED } from '../styles/tokens.js';

// two-scale closed-form: s_r = 1 / (1 + exp(-(r-r0)/k))
function twoScaleShare(r, r0, k) {
  return 1 / (1 + Math.exp(-(r - r0) / k));
}

function CurvePanel() {
  const svgW = 720;
  const padL = 48;
  const padR = 16;
  const svgH = 320;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const rMax = 11;
  const yMax = 1.0;
  const xOf = (r) => padL + (r / rMax) * plotW;
  const yOf = (v) => padT + plotH - (v / yMax) * plotH;

  const { r0, k } = IMP96671_TWOSCALE_PARAMS;
  const twoScalePts = [];
  for (let i = 0; i <= 220; i += 1) {
    const r = (i / 220) * rMax;
    twoScalePts.push([r, twoScaleShare(r, r0, k)]);
  }
  const twoScalePath = twoScalePts.map(([r, v], i) => `${i === 0 ? 'M' : 'L'} ${xOf(r)} ${yOf(v)}`).join(' ');
  const exactPath = IMP96671_EXACT_SHARE_N3000.map(
    ([r, v], i) => `${i === 0 ? 'M' : 'L'} ${xOf(r)} ${yOf(v)}`,
  ).join(' ');

  const xTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkSoft} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {xTicks.map((r) => (
        <g key={`x${r}`}>
          <line x1={xOf(r)} y1={padT} x2={xOf(r)} y2={padT + plotH} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={xOf(r)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
            {r}
          </text>
        </g>
      ))}

      {/* exact top-share s_r at N=3000, full eigendecomposition (not the two-scale idealization) */}
      <path d={exactPath} fill="none" stroke={ED.series5} strokeWidth={1.2} strokeDasharray="2 3" />

      {/* two-scale closed-form s_r = 1/(1+exp(-(r-r0)/k)) */}
      <path d={twoScalePath} fill="none" stroke={ED.series1} strokeWidth={1.6} />

      {/* measured rank-r Rayleigh slope fraction b_r/L */}
      {IMP96671_MEASURED_FRACTION.map(([r, v]) => (
        <circle key={`m${r}`} cx={xOf(r)} cy={yOf(v)} r={3.2} fill={ED.brassDeco} stroke={ED.ruleSoft} strokeWidth={0.5} />
      ))}

      {/* half-saturation marker r0 on the two-scale curve */}
      <circle cx={xOf(r0)} cy={yOf(0.5)} r={4.5} fill="none" stroke={ED.series1} strokeWidth={1.5} />
      <text x={xOf(r0)} y={yOf(0.5) - 10} textAnchor="middle" fill={ED.series1} fontSize={8.5}>
        r0 = {r0.toFixed(2)}
      </text>

      <text x={padL + plotW / 2} y={padT + plotH + 30} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        rank r
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        weight share / slope fraction
      </text>
    </svg>
  );
}

export default function Imp96671SpectralShareVsMeasuredSlopeViz() {
  const { r0, k, gap, w1 } = IMP96671_TWOSCALE_PARAMS;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Sigmoid Onset: Two-Scale Weight Share vs Measured Slope Fraction" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-96636 sigmoidal onset of the rank-r Rayleigh log-slopes b_r (yellow points, shown
        as the fraction b_r/L) is a top-eigenpair weight-share effect: imp-96652 shows the exact
        share s_r = w1 lam1^r / sum_i w_i lam_i^r is a logistic in the two-scale (top + bulk-edge)
        idealization, s_r = 1 / (1 + e^-((r-r0)/k)) (blue), with width{' '}
        k = 1/ln(lam1/lam2) = {k.toFixed(3)} set by the top spectral gap ratio ({gap.toFixed(3)})
        and half-saturation r0 = k&middot;ln((1-w1)/w1) = {r0.toFixed(3)} set by the small top
        overlap w1 = {(w1 * 100).toFixed(1)}%. The purple dashed curve is the exact (non-idealized)
        top-share from the full N=3000 eigendecomposition, shown for reference.
      </p>

      <CurvePanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the two-scale closed form
        (blue) reproduces the delayed, S-shaped rise of the measured slope fraction (yellow) using
        only two measured spectral quantities -- the top overlap w1 and the top gap ratio
        lam1/lam2 -- with no free fit parameters. Its half-saturation r0 = {r0.toFixed(2)} sits
        within ~10% of the imp-96636 directly fitted r0 = 2.94, climbing toward it as N grows
        (the two-scale idealization undercounts the true bulk contribution at finite N).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page. The two-scale curve is
        computed at render time from the baked closed-form parameters (r0, k) already reported in
        imp-96652-route-m-lammax-sigmoid-onset-spectral-derivation.js; the measured points and the
        exact-share reference curve are baked literals reused verbatim from the same module (no
        live import, no new numerics). This does not close IMP96562_SUBGAP: no closed form for the
        0.3526 coefficient is produced, no bound moved, no operator positivity established. RH open. NO QED.
      </div>
    </div>
  );
}
