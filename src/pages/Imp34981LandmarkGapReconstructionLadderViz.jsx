import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34954_SURPLUS_CLOSED_FORM_VS_LANDMARK_GAP_CROSSCHECK } from '../data/imp-34954-surplus-closed-form-vs-landmark-gap-crosscheck.js';
import { ED } from '../styles/tokens.js';

const D = IMP34954_SURPLUS_CLOSED_FORM_VS_LANDMARK_GAP_CROSSCHECK;
const GAP = D.leadingConversion.rel_N_gap_L1_L3; // ~3.981092e-3 (~0.407%)

// The three successive approximations of the measured L1-L3 relative-N landmark gap, each
// closing the residual against the prior rung -- the "ladder" this page renders.
const RUNGS = [
  {
    label: 'leading 2r (const E_flow, ideal -1/2 slope)',
    value: D.leadingConversion.two_r,
    residual: D.leadingConversion.resid_2r,
    color: ED.series2,
  },
  {
    label: 'measured E_coll log-slope (-0.4773)',
    value: D.refinedConversion.gap_refined_measured_slope,
    residual: D.refinedConversion.resid_refined_slope,
    color: ED.brass,
  },
  {
    label: '+ E_flow drift across the gap',
    value: D.refinedConversion.gap_refined_slope_plus_eflow_drift,
    residual: D.refinedConversion.resid_refined_full,
    color: ED.series3,
  },
];

// Log-scale residual ladder: each rung's |residual| against the measured gap, descending
// from ~4.6% to ~4e-6 -- the residual "driven to floating point" claim.
function ResidualLadderChart() {
  const svgW = 720;
  const svgH = 220;
  const padL = 64;
  const padR = 20;
  const padT = 20;
  const padB = 70;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logs = RUNGS.map((r) => Math.log10(Math.abs(r.residual)));
  const yMax = Math.ceil(Math.max(...logs)); // ~-1 (4.6%)
  const yMin = Math.floor(Math.min(...logs)); // ~-6 (4e-6)
  const yAt = (logv) => padT + cH - ((logv - yMin) / (yMax - yMin)) * cH;
  const barW = cW / RUNGS.length - 40;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i).map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {`1e${t}`}
          </text>
        </g>
      ))}

      {RUNGS.map((r, i) => {
        const cx = padL + ((i + 0.5) / RUNGS.length) * cW;
        const top = yAt(Math.log10(Math.abs(r.residual)));
        const base = padT + cH;
        return (
          <g key={r.label}>
            <rect x={cx - barW / 2} y={top} width={barW} height={base - top} fill={r.color} opacity={0.85} />
            <text x={cx} y={top - 6} textAnchor="middle" fill={ED.ink} fontSize={10}>
              {(Math.abs(r.residual) * 100).toPrecision(3)}%
            </text>
            <text x={cx} y={base + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
              rung {i + 1}
            </text>
          </g>
        );
      })}

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        residual vs measured L1-L3 gap ({(GAP * 100).toPrecision(4)}%), log scale
      </text>
    </svg>
  );
}

function LadderTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: '0.78rem', color: 'var(--ink-soft)', minWidth: 640 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>rung</th>
            <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>approximation</th>
            <th style={{ textAlign: 'right', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>value</th>
            <th style={{ textAlign: 'right', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>residual</th>
          </tr>
        </thead>
        <tbody>
          {RUNGS.map((r, i) => (
            <tr key={r.label}>
              <td style={{ padding: '3px 8px' }}>{i + 1}</td>
              <td style={{ padding: '3px 8px' }}>{r.label}</td>
              <td style={{ padding: '3px 8px', textAlign: 'right', fontFamily: 'monospace' }}>
                {r.value.toExponential(6)}
              </td>
              <td style={{ padding: '3px 8px', textAlign: 'right', fontFamily: 'monospace', color: r.color }}>
                {(Math.abs(r.residual) * 100).toPrecision(3)}%
              </td>
            </tr>
          ))}
          <tr>
            <td style={{ padding: '3px 8px' }} colSpan={2}>
              measured L1-L3 gap (imp-34904)
            </td>
            <td style={{ padding: '3px 8px', textAlign: 'right', fontFamily: 'monospace' }}>
              {GAP.toExponential(6)}
            </td>
            <td style={{ padding: '3px 8px', textAlign: 'right' }}>&mdash;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function Imp34981LandmarkGapReconstructionLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Landmark-Gap Reconstruction Ladder (imp-34981 / imp-34954)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Three successive approximations reconstruct the measured {(GAP * 100).toPrecision(4)}% L1-L3
        relative-N landmark gap, each closing the residual of the prior rung: the leading 2r
        conversion (constant E_flow, ideal -1/2 slope) reproduces it only to{' '}
        {(Math.abs(D.leadingConversion.resid_2r) * 100).toPrecision(3)}%, using the measured E_coll
        log-slope (-0.4773, not -1/2) drops the residual to{' '}
        {(Math.abs(D.refinedConversion.resid_refined_slope) * 100).toPrecision(3)}%, and adding the
        E_flow drift across the gap closes it to floating point (
        {(Math.abs(D.refinedConversion.resid_refined_full) * 100).toPrecision(3)}%).
      </p>
      <ResidualLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Rung-by-rung values against the measured gap.
      </p>
      <LadderTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-34954 literals verbatim (no new computation). The surplus closed form r/(2(2+r)) itself
        is exact; the ladder shown here is entirely a sigma-to-N CONVERSION diagnostic on the
        inherited imp-3220/imp-3406 surrogate crossover map. C_mb GUE-conditional per imp-486 and
        C_C 1/8 ansatz UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound;
        establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
