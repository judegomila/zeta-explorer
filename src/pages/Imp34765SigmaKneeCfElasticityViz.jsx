import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34729_SIGMA_KNEE_CF_ELASTICITY } from '../data/imp-34729-sigma-knee-cf-elasticity.js';
import { ED, alpha } from '../styles/tokens.js';

const M = IMP34729_SIGMA_KNEE_CF_ELASTICITY;

// Knee grid ordered by cfScale, spanning 0 (no E_flow) through 1.1 (+10% C_F).
const GRID = [
  { cfScale: 0, log10Nstar: M.kneeLocations.log10NstarNoEflow, label: 'no E_flow' },
  { cfScale: 0.9, log10Nstar: M.kneeLocations.log10NstarCFminus10, label: '-10%' },
  { cfScale: 0.99, log10Nstar: M.kneeLocations.log10NstarCFminus1, label: '-1%' },
  { cfScale: 1.0, log10Nstar: M.kneeLocations.log10NstarBase, label: 'baseline' },
  { cfScale: 1.01, log10Nstar: M.kneeLocations.log10NstarCFplus1, label: '+1%' },
  { cfScale: 1.1, log10Nstar: M.kneeLocations.log10NstarCFplus10, label: '+10%' },
];

// -- knee log10 N* vs cfScale from 0 (no-E_flow) to 1.1 (+10% C_F), with the +-10% band
// shaded around cfScale=1 to show how little the knee moves inside a realistic C_F uncertainty. --
function KneeVsCfScaleChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 68;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = -0.05;
  const xMax = 1.15;
  const yMin = 9.527;
  const yMax = 9.5375;
  const sx = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const linePath = GRID.map((g, i) => `${i === 0 ? 'M' : 'L'} ${sx(g.cfScale).toFixed(2)} ${sy(g.log10Nstar).toFixed(2)}`).join(' ');

  const bandX0 = sx(0.9);
  const bandX1 = sx(1.1);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={11}>
        cfScale (E_flow prefactor C_F multiplier; 0 = dropped, 1 = imp-398 pinned baseline)
      </text>
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={11}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        log10 N* (knee location)
      </text>

      <rect
        x={bandX0}
        y={padT}
        width={bandX1 - bandX0}
        height={plotH}
        fill={alpha(ED.brassDeco, 0.1)}
        stroke="none"
      />
      <text x={bandX0 + 4} y={padT + 14} fill={ED.brass} fontSize={10}>
        +-10% C_F band: knee moves &le; {Math.abs(M.elasticity.shiftForCFplus10Log10).toExponential(2)} dex
      </text>

      <path d={linePath} fill="none" stroke={ED.series1} strokeWidth={1.5} />
      {GRID.map((g) => (
        <circle
          key={g.cfScale}
          cx={sx(g.cfScale)}
          cy={sy(g.log10Nstar)}
          r={3.6}
          fill={ED.series1}
          stroke={ED.paper}
          strokeWidth={0.5}
        />
      ))}

      <text x={sx(0)} y={sy(GRID[0].log10Nstar) - 10} fill={ED.inkSoft} fontSize={10} textAnchor="middle">
        {GRID[0].log10Nstar.toFixed(5)} (no E_flow)
      </text>
      <text x={sx(1.0)} y={sy(M.kneeLocations.log10NstarBase) + 20} fill={ED.inkSoft} fontSize={10} textAnchor="middle">
        {M.kneeLocations.log10NstarBase.toFixed(5)} (baseline)
      </text>

      <text x={padL + 8} y={padT + 32} fill={ED.inkSoft} fontSize={11}>
        near-linear local elasticity dX*/dC_F ~ {M.elasticity.dXstar_dCF_pm10pct.toExponential(3)} dex/unit
      </text>
    </svg>
  );
}

export default function Imp34765SigmaKneeCfElasticityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-Knee C_F Elasticity: Near-Linear Response, Tiny +-10% Sensitivity Band (imp-34765 / imp-34729)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34710 found that ~99% of the imp-34694 sigma-exponent-knee residual (the ~7.4e-3 dex gap between
        the direct knee log10&nbsp;N*&nbsp;=&nbsp;{M.kneeLocations.log10NstarBase} and the no-E_flow knee
        ~{M.kneeLocations.log10NstarNoEflow}) is the dropped E_flow term, whose prefactor is the imp-398 pinned
        constant C_F. imp-34729 re-root-found the p_secondDeriv(ln&nbsp;N)&nbsp;=&nbsp;0 knee on the exact full
        model while scaling C_F by cfScale, from 0 (E_flow fully dropped) to the baseline at 1. The knee moves
        the full {Math.abs(M.elasticity.fullDropResidualLog10).toExponential(3)} dex across that whole range,
        but only {Math.abs(M.elasticity.shiftForCFplus10Log10).toExponential(2)}&nbsp;dex inside a realistic
        &plusmn;10% C_F uncertainty band &mdash; the knee is C_F-robust, not C_F-fragile.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        knee log10 N* vs cfScale, 0 (no E_flow) to 1.1 (+10% C_F), with the +-10% sensitivity band shaded
      </p>
      <KneeVsCfScaleChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>cfScale</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>label</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>log10 N*</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>shift from baseline (dex)</th>
          </tr>
        </thead>
        <tbody>
          {GRID.map((g) => (
            <tr key={g.cfScale} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{g.cfScale}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{g.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{g.log10Nstar.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {(g.log10Nstar - M.kneeLocations.log10NstarBase).toExponential(3)}
              </td>
            </tr>
          ))}
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
        Local elasticity dX*/dC_F&nbsp;~&nbsp;{M.elasticity.dXstar_dCF_pm10pct.toExponential(4)} dex per unit
        fractional C_F on the &plusmn;10% secant (&nbsp;{M.elasticity.dXstar_dCF_pm1pct.toExponential(4)} on the
        finer &plusmn;1% secant), close to the {M.elasticity.linearSlopeFromFullDrop.toExponential(4)} one-sided
        slope implied by the full cfScale&nbsp;1&nbsp;&rarr;&nbsp;0 drop &mdash; the knee responds linearly to
        C_F to leading order. The imp-34710 residual is what a -100% C_F change (E_flow dropped entirely)
        produces, not any plausible C_F mis-pinning.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page presenting the imp-34729
        C_F-elasticity measurement (imported literals, no new computation) for the INHERITED imp-3220/imp-3406
        surrogate crossover map. C_mb stays GUE-conditional (imp-486); far-tail exponent stays 1/2 (imp-3463);
        changes no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
