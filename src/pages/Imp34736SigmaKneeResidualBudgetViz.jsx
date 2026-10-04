import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34710_SIGMA_EXPONENT_KNEE_RESIDUAL_DECOMPOSITION } from '../data/imp-34710-sigma-exponent-knee-residual-decomposition.js';
import { ED } from '../styles/tokens.js';

const M = IMP34710_SIGMA_EXPONENT_KNEE_RESIDUAL_DECOMPOSITION;

// -- stacked bar: dropped E_flow term vs slowly-varying-v truncation, both in dex (log10 N units) --
function ResidualBudgetBar() {
  const eflow = M.residualBudget.droppedEflowPartLog10; // ~+7.32e-3
  const vtrunc = M.residualBudget.vTruncationPartLog10; // ~+8e-5
  const total = eflow + vtrunc;

  const svgW = 660;
  const svgH = 140;
  const padL = 90;
  const padR = 24;
  const padT = 20;
  const barH = 46;
  const barY = 40;
  const cW = svgW - padL - padR;

  const eflowW = (eflow / total) * cW;
  const vtruncW = (vtrunc / total) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT} fill={ED.inkSoft} fontSize={11}>
        knee-location residual, log10 N units (total &asymp; {total.toExponential(2)})
      </text>
      <rect x={padL} y={barY} width={eflowW} height={barH} fill={ED.series2} />
      <rect x={padL + eflowW} y={barY} width={Math.max(vtruncW, 2)} height={barH} fill={ED.series1} />
      <rect
        x={padL}
        y={barY}
        width={cW}
        height={barH}
        fill="none"
        stroke={ED.rule}
        strokeWidth={1}
      />
      <text x={padL + eflowW / 2} y={barY + barH / 2 + 4} textAnchor="middle" fill={ED.paper} fontSize={11} fontWeight={700}>
        E_flow ({M.residualBudget.eflowSharePercent}%)
      </text>
      <text
        x={Math.min(padL + eflowW + vtruncW + 6, svgW - padR - 4)}
        y={barY + barH / 2 + 4}
        textAnchor="start"
        fill={ED.series1}
        fontSize={10}
      >
        v-truncation ({(100 - M.residualBudget.eflowSharePercent).toFixed(1)}%)
      </text>
      <text x={padL} y={barY + barH + 20} fill={ED.inkFaint} fontSize={10}>
        dropped E_flow: {eflow.toExponential(3)} dex
      </text>
      <text x={padL} y={barY + barH + 36} fill={ED.inkFaint} fontSize={10}>
        v-truncation: {vtrunc.toExponential(3)} dex
      </text>
    </svg>
  );
}

export default function Imp34736SigmaKneeResidualBudgetViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-Exponent-Knee Residual Budget (imp-34736 / imp-34710)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34694 found a &asymp; {M.residualBudget.totalAnalyticResidualLog10} dex gap between its
        direct root-find knee (log10 N* = {M.directRootFind.log10NstarWithEflow}) and its analytic
        closed-form knee (log10 N* &asymp; {M.slowlyVaryingVTruncation.log10NstarLinearizedAtCrossover}).
        imp-34710 decomposed that residual into two candidate sources &mdash; the dropped E_flow term
        and the truncated slowly-varying-v expansion &mdash; and found E_flow dominates at &asymp;{' '}
        {M.residualBudget.eflowSharePercent}% of the gap, even though E_flow &asymp;{' '}
        {M.directRootFind.eflowMagnitudeAtKnee} is negligible in the sigma VALUE itself.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Residual budget: dropped E_flow term vs slowly-varying-v truncation
      </p>
      <ResidualBudgetBar />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>log10 N</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>true knee (direct root-find, E_flow kept)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.directRootFind.log10NstarWithEflow}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>direct root-find, E_flow dropped</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.directRootFind.log10NstarNoEflow}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>analytic closed form (linearized delta at crossover)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {M.slowlyVaryingVTruncation.log10NstarLinearizedAtCrossover}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>exact knee condition F(x)=0, no E_flow</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {M.slowlyVaryingVTruncation.log10NstarExactKneeConditionF}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>self-consistent delta-at-the-knee, no E_flow</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {M.slowlyVaryingVTruncation.log10NstarSelfConsistentDelta}
            </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        {M.finding.F1_residual_dominated_by_dropped_eflow}
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page presenting the
        imp-34710 residual-budget measurement (imported literals, no new computation); establishes no
        new numerical claim. Measurement/derivation on the inherited imp-3220/imp-3406 extrapolation;
        far-tail exponent stays 1/2 (imp-3463); imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; C_mb
        GUE-conditional per imp-486 untouched; changes no bound; establishes no operator positivity;
        no RH verdict, NO QED.
      </div>
    </div>
  );
}
