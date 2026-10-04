import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34734_SIGMA_PEAK_CMB_ELASTICITY } from '../data/imp-34734-sigma-peak-cmb-elasticity.js';
import { ED } from '../styles/tokens.js';

const M = IMP34734_SIGMA_PEAK_CMB_ELASTICITY;

// -- sigma_max vs C_mb: the grid re-run points, a linear tangent at C_mb=1 with slope
// dSigma/dC_mb ~ 0.048/unit, and the C_mb-invariant peak LOCATION N* annotated per-point. --
function SigmaMaxVsCmbChart() {
  const grid = M.grid;
  const slope = M.derivative.dSigma_dCmb_closed;

  const svgW = 680;
  const svgH = 320;
  const padL = 64;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 0;
  const xMax = 1.02;
  const yMin = 0.5;
  const yMax = 1.0;
  const sx = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const gridPath = grid
    .slice()
    .sort((a, b) => a.C_mb - b.C_mb)
    .map((g, i) => `${i === 0 ? 'M' : 'L'} ${sx(g.C_mb).toFixed(2)} ${sy(g.sigma_max).toFixed(2)}`)
    .join(' ');

  // tangent line at C_mb=1: sigma_max(C_mb=1) + slope * (c - 1), drawn back to C_mb=0.6
  const base = M.baseline.sigma_max;
  const tanX0 = 0.6;
  const tanX1 = 1.0;
  const tanY0 = base + slope * (tanX0 - 1);
  const tanY1 = base;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={11}>
        C_mb (GUE-conditional, bounded &le; 1 per imp-486)
      </text>
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={11}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        sigma_max(C_mb)
      </text>

      <line
        x1={sx(tanX0)}
        y1={sy(tanY0)}
        x2={sx(tanX1)}
        y2={sy(tanY1)}
        stroke={ED.brassDeco}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <text x={sx(tanX0)} y={sy(tanY0) - 8} fill={ED.brass} fontSize={11}>
        tangent at C_mb=1, slope ~ {slope.toFixed(4)}/unit
      </text>

      <path d={gridPath} fill="none" stroke={ED.series1} strokeWidth={1.5} />
      {grid.map((g) => (
        <circle
          key={g.C_mb}
          cx={sx(g.C_mb)}
          cy={sy(g.sigma_max)}
          r={3.4}
          fill={ED.series1}
          stroke={ED.paper}
          strokeWidth={0.5}
        />
      ))}

      <text x={padL + 8} y={padT + 16} fill={ED.series1} fontSize={11}>
        re-run grid: sigma_max(C_mb) = C_mb r* / (1 + C_mb r*), r* ~ {M.baseline.r_star.toFixed(3)}
      </text>
      <text x={padL + 8} y={padT + 32} fill={ED.inkSoft} fontSize={11}>
        peak LOCATION N* ~ {M.baseline.N_max.toExponential(3)} is C_mb-invariant at every grid point
      </text>
    </svg>
  );
}

export default function Imp34763CmbElasticitySigmaPeakViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="C_mb Elasticity at the Sigma Peak: ~0.048/unit Linear Response, C_mb-Invariant Location (imp-34763 / imp-34734)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34734 inserts the GUE-conditional many-body constant C_mb (imp-486, bounded &le; 1) as a
        multiplicative factor on the collision term E_coll in the imp-3220/imp-3406 conditional share
        sigma(N)&nbsp;=&nbsp;E_coll/(E_trunc+E_flow+E_coll), then re-runs the imp-3406 ternary argmax over
        a C_mb grid. The peak HEIGHT sigma_max moves linearly at d&sigma;/dC_mb&nbsp;=&nbsp;&sigma;(1-&sigma;)/C_mb
        &nbsp;~&nbsp;{M.derivative.dSigma_dCmb_closed.toFixed(4)} per unit at C_mb&nbsp;=&nbsp;1 (closed form
        matches the numeric central difference to full precision), while the peak LOCATION
        N*&nbsp;~&nbsp;{M.baseline.N_max.toExponential(3)} stays pinned across the entire grid &mdash;
        exactly C_mb-invariant, because sigma is a strictly increasing function of a ratio in which C_mb
        enters only as a constant multiplier.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        sigma_max vs C_mb: the re-run grid, the closed-form curve, and the C_mb=1 tangent slope
      </p>
      <SigmaMaxVsCmbChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>C_mb</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N* (grid)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>log10 N*</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>sigma_max</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>location shift (dex)</th>
          </tr>
        </thead>
        <tbody>
          {M.grid.map((g) => (
            <tr key={g.C_mb} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{g.C_mb}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{g.N_star.toExponential ? g.N_star.toExponential(5) : g.N_star}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{g.log10_N_star}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{g.sigma_max}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{g.location_shift_dex}</td>
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
        Baseline (C_mb&nbsp;=&nbsp;1) reproduces the imp-3406 peak: sigma_max&nbsp;~&nbsp;{M.baseline.sigma_max},
        N_max&nbsp;~&nbsp;{M.baseline.N_max.toExponential(4)} (log10&nbsp;{M.baseline.log10_N_max}). A -10% C_mb
        (to 0.90) lowers sigma_max by {M.leverage.height_shift_minus10pct} (to {M.leverage.sigma_max_minus10pct})
        while the location shift stays {M.leverage.location_shift_minus10pct_dex} dex; sigma_max reaches 0.5 only
        at C_mb&nbsp;=&nbsp;1/r*&nbsp;~&nbsp;{M.leverage.Cmb_at_sigma_half}, far below the GUE bound of 1.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page presenting the imp-34734
        C_mb-leverage measurement (imported literals, no new computation) for the INHERITED imp-3220/imp-3406
        surrogate crossover map. This does NOT discharge the GUE conditional on C_mb (imp-486) &mdash; C_mb is
        treated as a free knob to quantify leverage, not tightened. Even the GUE saturation C_mb&nbsp;=&nbsp;1
        gives sigma_max&nbsp;&lt;&nbsp;1, so a tighter C_mb only LOWERS the peak, never raises it. Changes no
        bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
