import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96393_DISCREPANCY_SERIES,
  IMP96393_LANDMARKS,
  IMP96393_HONEST_BANNER,
} from '../data/imp-96393-discrepancy-envelope-viz-data.js';

function DiscrepancyChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 68;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 4;
  const xMax = 12.5;
  const yMin = -13;
  const yMax = -6;

  const xOf = (log10T) => padL + ((log10T - xMin) / (xMax - xMin)) * plotW;
  const yOf = (log10D) => padT + plotH - ((log10D - yMin) / (yMax - yMin)) * plotH;

  const pathD = IMP96393_DISCREPANCY_SERIES
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10T).toFixed(2)} ${yOf(p.log10Discrepancy).toFixed(2)}`)
    .join(' ');

  const xTicks = [4, 5, 6, 7, 8, 9, 10, 11, 12];
  const yTicks = [-13, -12, -11, -10, -9, -8, -7, -6];

  const worstX = xOf(IMP96393_LANDMARKS.worst.log10T);
  const floorX = xOf(IMP96393_LANDMARKS.floor.log10T);
  const ptX = xOf(IMP96393_LANDMARKS.ptAnchor.log10T);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#334155" strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>{`1e${v}`}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {v}
        </text>
      ))}

      {/* roundoff floor marker (T ~ 1e9) */}
      <line x1={floorX} y1={padT} x2={floorX} y2={padT + plotH} stroke="#4ade80" strokeWidth={1} strokeDasharray="3 3" opacity={0.55} />
      <text x={floorX + 4} y={padT + 12} fill="#4ade80" fontSize={8}>
        floor T&asymp;{IMP96393_LANDMARKS.floor.T.toExponential(0)}
      </text>

      {/* worst-rung marker (T = 1e4) */}
      <line x1={worstX} y1={padT} x2={worstX} y2={padT + plotH} stroke="#f87171" strokeWidth={1} strokeDasharray="3 3" opacity={0.55} />
      <text x={worstX + 4} y={padT + 24} fill="#f87171" fontSize={8}>
        worst T={IMP96393_LANDMARKS.worst.T.toExponential(0)}
      </text>

      {/* Platt-Trudgian anchor marker (T = 3e12) */}
      <line x1={ptX} y1={padT} x2={ptX} y2={padT + plotH} stroke="#fbbf24" strokeWidth={1} strokeDasharray="3 3" opacity={0.55} />
      <text x={ptX - 4} y={padT + 36} fill="#fbbf24" fontSize={8} textAnchor="end">
        PT anchor 3e12
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth={2} opacity={0.95} />
      {IMP96393_DISCREPANCY_SERIES.map((p) => (
        <circle key={`d-${p.log10T}`} cx={xOf(p.log10T)} cy={yOf(p.log10Discrepancy)} r={2.6} fill="#38bdf8" />
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        log10 T (decade ladder 1e4 to 3e12)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke="#38bdf8" strokeWidth={2} />
        <text x={22} y={3} fill="#94a3b8" fontSize={8.5}>|rho_exact - rho_asymp| (log scale, U-shaped)</text>
      </g>
    </svg>
  );
}

export default function Imp96393DiscrepancyEnvelopeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96371: Exact-vs-Asymptotic Number-Variance Discrepancy Envelope" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96393_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96350 measured the gap between the exact Dyson&ndash;Mehta number variance and its
        large-L asymptotic form &mdash; |rho_exact &minus; rho_asymp| = 2.52e-10 &mdash; only at the
        single Platt&ndash;Trudgian anchor T = 3e12. imp-96371 extended that measurement across the
        full imp-96267 decade ladder of heights and found the discrepancy is U-shaped in log T, not
        flat: it grows to 1.47e-7 at the smallest height T = 1e4 (dropped oscillatory Ci/Si
        corrections matter most at small L), falls to a double-precision roundoff floor
        (&asymp;3.23e-13) near T = 1e8&ndash;1e9, then rises back to the 2.52e-10 PT-anchor reading.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        |rho_exact &minus; rho_asymp| vs log10 T (log scale, U-shaped envelope)
      </h3>
      <DiscrepancyChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the worst rung (T = 1e4)
        is &asymp;{IMP96393_LANDMARKS.ratioWorstToPt.toFixed(0)}&times; larger than the
        Platt&ndash;Trudgian anchor value, so the 2.52e-10 PT figure represents the large-L branch
        of the envelope, not the worst case. The floor near T&asymp;{IMP96393_LANDMARKS.floor.T.toExponential(0)}
        {' '}sits at the double-precision roundoff limit of the rho ratio, so the true out-of-family
        discrepancy there is only bounded, not resolved. At every rung the discrepancy stays below
        &asymp;1.5e-7, so the &minus;0.4818 rho value survives out-of-family at every decade, not
        only at the PT anchor.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the
        imp-96371 baked decade ladder verbatim (only the chart-axis reshaping is computed here).
        rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes
        of unfolded length L(T); at these heights (and at 3e12) there are no computed Riemann
        zeros, so this cross-validates two closed-form evaluations of the same envelope, not a
        measurement of actual zeros. Changes no bound, establishes no operator positivity, no RH
        claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
