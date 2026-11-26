import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96453_SIGNAL_SERIES,
  IMP96453_FLOOR_LINES,
  IMP96453_LANDMARKS,
  IMP96453_HONEST_BANNER,
} from '../data/imp-96453-basis-c-corroboration-crossover-viz-data.js';
import { IMP96531_BASIS_C_CROSSOVER_MEASURED_FLOOR } from '../data/imp-96531-basis-c-crossover-measured-floor.js';
import { IMP96588_BASIS_C_FLOOR_1E8_RUNG_POWERLAW_BEND } from '../data/imp-96588-basis-c-floor-1e8-rung-powerlaw-bend.js';
import { IMP96735_HONEST_BANNER } from '../data/imp-96735-basis-c-lstar-bracket-leave-one-out-robustness.js';
import { IMP96733_HONEST_BANNER } from '../data/imp-96733-basis-c-real-zero-intermediate-signal.js';
import { ED } from '../styles/tokens.js';

function CrossoverChart() {
  const svgW = 720;
  const svgH = 340;
  const padL = 68;
  const padR = 16;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 1.2;
  const xMax = 12.8;
  const yMin = -16;
  const yMax = -1;

  const xOf = (log10L) => padL + ((log10L - xMin) / (xMax - xMin)) * plotW;
  const yOf = (log10v) => padT + plotH - ((log10v - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [2, 4, 6, 8, 10, 12];
  const yTicks = [-14, -12, -10, -8, -6, -4, -2];

  const signalD = IMP96453_SIGNAL_SERIES
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10L).toFixed(2)} ${yOf(p.log10Signal).toFixed(2)}`)
    .join(' ');

  const lineD = (pts) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10L).toFixed(2)} ${yOf(p.log10Floor).toFixed(2)}`).join(' ');

  const bandX0 = xOf(Math.log10(IMP96453_LANDMARKS.crossoverBand[0]));
  const bandX1 = xOf(Math.log10(IMP96453_LANDMARKS.crossoverBand[1]));
  const anchorX = xOf(Math.log10(IMP96453_LANDMARKS.ptAnchorL));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{`1e${v}`}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {v}
        </text>
      ))}

      {/* crossover band */}
      <rect x={bandX0} y={padT} width={bandX1 - bandX0} height={plotH} fill={ED.series5} opacity={0.12} />
      <text x={(bandX0 + bandX1) / 2} y={padT + 12} textAnchor="middle" fill={ED.series5} fontSize={8}>
        crossover band
      </text>

      {/* PT anchor */}
      <line x1={anchorX} y1={padT} x2={anchorX} y2={padT + plotH} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
      <text x={anchorX + 4} y={padT + 10} fill={ED.brass} fontSize={8}>
        PT anchor L=5.9e6
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={lineD(IMP96453_FLOOR_LINES.endpointSlope)} fill="none" stroke={ED.series2} strokeWidth={1.5} strokeDasharray="5 3" opacity={0.9} />
      <path d={lineD(IMP96453_FLOOR_LINES.meanSlope)} fill="none" stroke={ED.series4} strokeWidth={1} strokeDasharray="2 3" opacity={0.85} />
      <path d={signalD} fill="none" stroke={ED.series1} strokeWidth={2} opacity={0.95} />

      {IMP96453_SIGNAL_SERIES.map((p) => (
        <circle key={`s-${p.L}`} cx={xOf(p.log10L)} cy={yOf(p.log10Signal)} r={2.6} fill={ED.series1} />
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 L (L = 30 .. {IMP96453_LANDMARKS.crossoverBand[1].toExponential(1)})
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 28})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={ED.series1} strokeWidth={2} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>|rho + 1/2| rigidity signal (shrinks)</text>
        <line x1={0} y1={14} x2={18} y2={14} stroke={ED.series2} strokeWidth={1.5} strokeDasharray="5 3" />
        <text x={22} y={17} fill={ED.inkSoft} fontSize={8.5}>floor model, endpoint slope (grows)</text>
        <line x1={0} y1={28} x2={18} y2={28} stroke={ED.series4} strokeWidth={1} strokeDasharray="2 3" />
        <text x={22} y={31} fill={ED.inkSoft} fontSize={8.5}>floor model, mean slope (grows)</text>
      </g>
    </svg>
  );
}

export default function Imp96453BasisCCorroborationCrossoverViz() {
  const { ptAnchorSignal, ptAnchorFloorModel, ptAnchorHeadroomModel, crossoverBand, crossoverEndpoint } =
    IMP96453_LANDMARKS;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96430: Basis-C Corroboration-Reach Crossover" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96453_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        Basis C (the direct pair-correlation double integral) is only useful as an independent
        cross-check of the exact number-variance basis A while its own catastrophic-cancellation
        floor stays below the corroboration signal |rho + 1/2|. The floor grows roughly linearly
        in L; the signal shrinks logarithmically toward the -1/2 rigidity limit as rho(L) &rarr;
        -1/2. imp-96430 bisected where the two curves cross.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Signal vs floor-model on log-log, PT anchor and crossover band marked
      </h3>
      <CrossoverChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue curve (signal)
        falls steadily across the accessible rungs and beyond, while the red and orange lines
        (the two floor-model calibrations) rise linearly. At the PT anchor (yellow dashed, L =
        {' '}{IMP96453_LANDMARKS.ptAnchorL.toExponential(1)}) the signal ({ptAnchorSignal.toExponential(2)})
        sits far above the model floor ({ptAnchorFloorModel.toExponential(2)}), a model-quoted
        ratio of ~{ptAnchorHeadroomModel.toExponential(1)}. The purple band marks where the lines
        actually meet: [{crossoverBand[0].toExponential(2)}, {crossoverBand[1].toExponential(2)}],
        five-to-six decades past the anchor, where rho has nearly reached the -1/2 rigidity limit
        (rho &asymp; {crossoverEndpoint.rho.toFixed(5)}).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-96430 baked crossover object verbatim (only the log10 axis reshaping and the two
        exact floor-model lines are computed here). rho is the theoretical GUE (sine-kernel,
        universality) two-interval correlation for boxes of unfolded length L; there are no
        computed Riemann zeros behind these values, and the crossover band is an extrapolation of
        a floor model calibrated only on accessible L (&le; 960). The PT-anchor headroom marked
        above is the imp-96430 model figure; imp-96448 directly measured the anchor floor and
        found the true headroom is ~640, not ~3.7e5 &mdash; see that module for the reconciled
        figure. Changes no bound, establishes no operator positivity, no RH claim. NO QED.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)',
          borderLeft: '3px solid var(--brass-deco)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        <strong style={{ color: 'var(--brass)' }}>Update &mdash; the band above is stale:</strong> the
        crossover band [{crossoverBand[0].toExponential(2)}, {crossoverBand[1].toExponential(2)}]
        charted above is the imp-96430 L-linear MODEL-floor band. imp-96531 re-anchored that same
        L-linear form to the imp-96448 <em>measured</em> anchor floor and moved the crossover down
        ~460x to L* &asymp;{' '}
        {IMP96531_BASIS_C_CROSSOVER_MEASURED_FLOOR.crossover.measuredFloor.L.toExponential(2)}{' '}
        (&asymp;{IMP96531_BASIS_C_CROSSOVER_MEASURED_FLOOR.crossover.decadesPastAnchor.toFixed(1)}{' '}
        decades past the anchor). imp-96588 then measured a further rung at L = 1e8 and found the
        floor bends upward past 1e7, sharpening the projection further to L* &asymp;{' '}
        {IMP96588_BASIS_C_FLOOR_1E8_RUNG_POWERLAW_BEND.crossover.measuredLstarPpp3.toExponential(2)}
        {' '}(ppp = 3) / &asymp;{' '}
        {IMP96588_BASIS_C_FLOOR_1E8_RUNG_POWERLAW_BEND.crossover.measuredLstarBest.toExponential(2)}
        {' '}(best ppp = 2), only &asymp;{' '}
        {IMP96588_BASIS_C_FLOOR_1E8_RUNG_POWERLAW_BEND.crossover.decadesPastAnchorPpp3.toFixed(1)}
        {' '}decades past the anchor. These two figures come from different floor-growth models
        (re-anchored L-linear vs. an above-anchor power law with a measured bend) evaluated in the
        noisy ppp-transition regime, so neither is a converged floor &mdash; but the current
        best (most recent, most sharpened) estimate of the corroboration reach is L* &asymp; 8e7&ndash;9.5e7,
        roughly 1.1&ndash;1.2 decades past the PT anchor, not the multi-decade band charted above.
        Measurement/extrapolation only; changes no bound; RH open. NO QED.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)',
          borderLeft: '3px solid var(--brass-deco)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        <strong style={{ color: 'var(--brass)' }}>Honest status &mdash; the L* point estimate is not a tight bracket:</strong>{' '}
        {IMP96735_HONEST_BANNER}
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status &mdash; L* is real-zero uncorroborable:</strong>{' '}
        {IMP96733_HONEST_BANNER}
      </div>
    </div>
  );
}
