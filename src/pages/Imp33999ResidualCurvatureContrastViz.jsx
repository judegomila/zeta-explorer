import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW } from '../data/imp-33917-endpoint-residual-growth-law.js';
import { IMP33940_INTERIOR_RESIDUAL_BOUNDARY_STABILITY } from '../data/imp-33940-interior-residual-boundary-stability.js';
import { ED } from '../styles/tokens.js';

const { boundarySweep: ENDPOINT_ROWS } = IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW;
const { interiorRows: INTERIOR_ROWS, fixedBandRows: FIXED_BAND_ROWS, fixedBandKMax } =
  IMP33940_INTERIOR_RESIDUAL_BOUNDARY_STABILITY;

// Three residual-vs-kEnd curves on one axis: endpoint (concave), penultimate rung (concave,
// sub-linear), and fixed low-k band k<=10 (convex) -- the opposite curvatures of the OLS-window
// edge artifact from imp-33917/imp-33940.
function ResidualCurvatureChart() {
  const svgW = 640;
  const svgH = 340;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = ENDPOINT_ROWS.map((r) => r.kEnd);
  const endpointYs = ENDPOINT_ROWS.map((r) => r.peak);
  const interiorYs = INTERIOR_ROWS.map((r) => r.peak);
  const fixedBandYs = FIXED_BAND_ROWS.map((r) => r.peak);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const allYs = [...endpointYs, ...interiorYs, ...fixedBandYs];
  const minY = Math.min(...allYs);
  const maxY = Math.max(...allYs);
  const padY = (maxY - minY) * 0.08;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY - padY) / (maxY - minY + 2 * padY)) * cH;

  const pointsOf = (ys) => xs.map((x, i) => `${xAt(x)},${yAt(ys[i])}`).join(' ');
  const endpointPoints = pointsOf(endpointYs);
  const interiorPoints = pointsOf(interiorYs);
  const fixedBandPoints = pointsOf(fixedBandYs);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={fixedBandPoints} fill="none" stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="6,3" />
      <polyline points={interiorPoints} fill="none" stroke={ED.series5} strokeWidth={1.5} strokeDasharray="2,3" />
      <polyline points={endpointPoints} fill="none" stroke={ED.series1} strokeWidth={2} />
      {xs.map((x, i) => (
        <circle key={`ep-${x}`} cx={xAt(x)} cy={yAt(endpointYs[i])} r={3.5} fill={ED.series1} stroke={ED.paper} strokeWidth={0.75} />
      ))}
      {xs.map((x, i) => (
        <circle key={`in-${x}`} cx={xAt(x)} cy={yAt(interiorYs[i])} r={3} fill={ED.series5} stroke={ED.paper} strokeWidth={0.75} />
      ))}
      {xs.map((x, i) => (
        <circle key={`fb-${x}`} cx={xAt(x)} cy={yAt(fixedBandYs[i])} r={3} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={0.75} />
      ))}
      {xs.map((x) => (
        <text key={`xt-${x}`} x={xAt(x)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {x}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        kEnd (OLS fit boundary)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        signed residual (peak)
      </text>
      <text x={padL + 4} y={padT + 12} fill={ED.series1} fontSize={9.5}>
        endpoint (last rung) -- concave
      </text>
      <text x={padL + 4} y={padT + 26} fill={ED.series5} fontSize={9.5}>
        penultimate rung k=kEnd-0.25 -- concave, sub-linear
      </text>
      <text x={padL + 4} y={padT + 40} fill={ED.brass} fontSize={9.5}>
        fixed low-k band k&lt;={fixedBandKMax.toFixed(0)} -- convex
      </text>
    </svg>
  );
}

export default function Imp33999ResidualCurvatureContrastViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Residual-vs-kEnd Curvature Contrast (imp-33940 / imp-33999)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33917 fit the growth of the imp-33843 log-linear OLS endpoint peak residual across the
        boundary sweep kEnd = 11..13, finding it CONCAVE (sub-linear). imp-33940 asked whether the
        interior residual structure is boundary-stable and found it is not: the largest non-last-rung
        residual sits at the penultimate rung k = kEnd-0.25 in every window and is also CONCAVE, while
        the largest residual in a fixed low-k band (k&lt;={fixedBandKMax.toFixed(0)}, rungs common to
        every window) is CONVEX -- proof that the whole OLS line pivots as the boundary recedes, not
        just the endpoint. The chart below plots all three curves on one axis to display the opposite
        curvatures directly.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        signed residual vs kEnd -- endpoint, penultimate rung, fixed low-k band
      </p>
      <ResidualCurvatureChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/reconciliation only,
        no proof, no fresh derivation. {IMP33940_INTERIOR_RESIDUAL_BOUNDARY_STABILITY.finding.R3_interior_not_boundary_stable_imp33917_refined}{' '}
        The component model is the inherited imp-3220/imp-3406 extrapolation; the OLS surrogate is
        descriptive, not derived; C_mb GUE-conditional per imp-486 untouched; NO QED.
      </div>
    </div>
  );
}
