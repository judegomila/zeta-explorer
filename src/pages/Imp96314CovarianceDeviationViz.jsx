import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96314_DEVIATION_SERIES,
  IMP96314_CROSSINGS,
  IMP96314_ANCHORS,
  IMP96314_HONEST_BANNER,
} from '../data/imp-96314-covariance-deviation-viz-data.js';
import { ED } from '../styles/tokens.js';

function DeviationChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 60;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = IMP96314_ANCHORS.firstLog10T;
  const xMax = IMP96314_ANCHORS.plattTrudgianLog10T;
  const yMin = 0;
  const yMax = 0.05;

  const xOf = (log10T) => padL + ((log10T - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const pathOf = (points) => points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10T).toFixed(2)} ${yOf(p.deviation).toFixed(2)}`)
    .join(' ');

  const yTicks = [0, 0.01, 0.02, 0.03, 0.04, 0.05];
  const xTicks = [4, 5, 6, 7, 8, 9, 10, 11, 12, IMP96314_ANCHORS.plattTrudgianLog10T];

  const plattRow = IMP96314_DEVIATION_SERIES.find((p) => p.isPlattTrudgianAnchor);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{v.toFixed(2)}</text>
        </g>
      ))}

      {/* epsilon = 1e-2 target reference line (not reached on this ladder) */}
      <line x1={padL} y1={yOf(0.01)} x2={padL + plotW} y2={yOf(0.01)} stroke={ED.rule} strokeWidth={0.75} strokeDasharray="2 3" opacity={0.6} />

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={pathOf(IMP96314_DEVIATION_SERIES)} fill="none" stroke={ED.series7} strokeWidth={1.75} opacity={0.95} />

      {IMP96314_DEVIATION_SERIES.map((p) => (
        <circle
          key={`d-${p.log10T}`}
          cx={xOf(p.log10T)}
          cy={yOf(p.deviation)}
          r={p.isPlattTrudgianAnchor ? 3.4 : 2.4}
          fill={p.isPlattTrudgianAnchor ? ED.brassDeco : ED.series7}
        />
      ))}

      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
          {v === IMP96314_ANCHORS.plattTrudgianLog10T ? '12.48(PT)' : v}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 T (decade ladder 1e4..1e12, plus the Platt&ndash;Trudgian verified anchor 3e12)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={ED.series7} strokeWidth={1.75} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>
          |rho_exact + 1/2| (deviation from the GUE-rigidity limit, decade ladder)
        </text>
        <circle cx={9} cy={16} r={3.4} fill={ED.brassDeco} />
        <text x={22} y={19} fill={ED.inkSoft} fontSize={8.5}>
          Platt&ndash;Trudgian verified anchor (T = 3e12, deviation {plattRow ? plattRow.deviation.toFixed(4) : ''})
        </text>
        <line x1={0} y1={30} x2={18} y2={30} stroke={ED.rule} strokeWidth={0.75} strokeDasharray="2 3" />
        <text x={22} y={33} fill={ED.inkSoft} fontSize={8.5}>epsilon = 1e-2 target (not reached on this ladder)</text>
      </g>
    </svg>
  );
}

export default function Imp96314CovarianceDeviationViz() {
  const eps2 = IMP96314_CROSSINGS.find((c) => c.epsilon === 1e-2);
  const eps3 = IMP96314_CROSSINGS.find((c) => c.epsilon === 1e-3);
  const plattRow = IMP96314_DEVIATION_SERIES.find((p) => p.isPlattTrudgianAnchor);
  const firstRow = IMP96314_DEVIATION_SERIES[0];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96267: GUE Two-Interval Covariance Deviation vs Height" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96314_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96150/imp-96177 found the exact GUE two-interval correlation rho_exact drifts
        monotonically toward the rigidity limit -1/2 across five held-out heights, without
        quantifying how slowly. imp-96267 computed the deviation |rho_exact + 1/2| on a decade
        ladder from 1e4 to 1e12 (plus the Platt&ndash;Trudgian verified anchor 3e12): it only falls
        from {firstRow.deviation.toFixed(4)} to {plattRow ? plattRow.deviation.toFixed(4) : ''}
        {' '}across nine decades &mdash; a 1/log T crawl, not a real convergence at any accessible height.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        |rho_exact + 1/2| vs log10 T (decade ladder, logarithmically slow approach to 0)
      </h3>
      <DeviationChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the pink curve is nowhere
        near flat but its descent is glacial: even at the Platt&ndash;Trudgian verified height
        T = 3e12 (yellow dot), the deviation is still {plattRow ? plattRow.deviation.toFixed(4) : ''}
        {' '}&mdash; well above the epsilon = 1e-2 target line (dashed). Extrapolating the same 1/log T
        envelope, the deviation first drops below 1e-2 only at T &asymp; 10^{eps2 ? eps2.log10Height.toFixed(1) : ''}
        {' '}({eps2 ? eps2.decadesPastPlattTrudgian.toFixed(1) : ''} decades past the PT verified height),
        and below 1e-3 only at T &asymp; 10^{eps3 ? eps3.log10Height.toFixed(1) : ''} &mdash; both far
        outside the plotted range and any accessible height.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96267
        baked decade ladder and crossing literals verbatim (only the log10 T axis reshaping is
        computed here). rho_exact is the theoretical GUE (sine-kernel, universality) two-interval
        correlation, not a measurement of the actual Riemann zeros. Changes no bound, establishes
        no operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA.
        NO QED.
      </div>
    </div>
  );
}
