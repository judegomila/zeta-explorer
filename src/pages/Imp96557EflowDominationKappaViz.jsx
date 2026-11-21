import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96557_KAPPA_SERIES,
  IMP96557_LANDMARKS,
  IMP96557_HONEST_BANNER,
} from '../data/imp-96557-eflow-domination-kappa-viz-data.js';
import { ED } from '../styles/tokens.js';

function KappaChart() {
  const svgW = 720;
  const svgH = 360;
  const padL = 68;
  const padR = 16;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const { globalMin } = IMP96557_LANDMARKS;
  const allLog10N = [globalMin.log10N, ...IMP96557_KAPPA_SERIES.map((p) => p.log10N)];
  const allLog10Kappa = [globalMin.log10Kappa, ...IMP96557_KAPPA_SERIES.map((p) => p.log10Kappa)];
  const xMin = Math.floor(Math.min(...allLog10N) - 0.4);
  const xMax = Math.ceil(Math.max(...allLog10N) + 0.4);
  const yMin = Math.floor(Math.min(...allLog10Kappa) - 0.15);
  const yMax = Math.ceil(Math.max(...allLog10Kappa) + 0.15);

  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (log10Kappa) => padT + plotH - ((log10Kappa - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [];
  for (let d = xMin; d <= xMax; d += 2) xTicks.push(d);
  const yTicks = [];
  for (let d = yMin; d <= yMax; d += 1) yTicks.push(d);

  const ladderD = IMP96557_KAPPA_SERIES
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N).toFixed(2)} ${yOf(p.log10Kappa).toFixed(2)}`)
    .join(' ');

  // parity line: kappa = 1 (log10Kappa = 0) -- never reached anywhere on the chart.
  const parityY = yOf(0);
  const parityVisible = parityY >= padT && parityY <= padT + plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {`1e${v}`}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {`1e${v}`}
        </text>
      ))}

      {parityVisible && (
        <line
          x1={padL}
          y1={parityY}
          x2={padL + plotW}
          y2={parityY}
          stroke={ED.series2}
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.6}
        />
      )}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={ladderD} fill="none" stroke={ED.series1} strokeWidth={2} opacity={0.95} />
      {IMP96557_KAPPA_SERIES.map((p) => (
        <circle key={p.N} cx={xOf(p.log10N)} cy={yOf(p.log10Kappa)} r={2.5} fill={ED.series1} />
      ))}

      <circle
        cx={xOf(globalMin.log10N)}
        cy={yOf(globalMin.log10Kappa)}
        r={3.5}
        fill={ED.brassDeco}
        stroke={ED.paper}
        strokeWidth={1}
      />
      <text x={xOf(globalMin.log10N) + 6} y={yOf(globalMin.log10Kappa) - 6} fill={ED.brass} fontSize={8}>
        global min N~95.5
      </text>

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        N
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 10})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={ED.series1} strokeWidth={2} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>kappa(N) diagnostic-regime ladder</text>
        <circle cx={9} cy={14} r={3} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
        <text x={22} y={17} fill={ED.inkSoft} fontSize={8.5}>global infimum (N~95.5)</text>
        <line x1={0} y1={28} x2={18} y2={28} stroke={ED.series2} strokeWidth={1} strokeDasharray="3 3" />
        <text x={22} y={31} fill={ED.inkSoft} fontSize={8.5}>parity line (kappa=1, unreached)</text>
      </g>
    </svg>
  );
}

export default function Imp96557EflowDominationKappaViz() {
  const { globalMin, inRegimeMin } = IMP96557_LANDMARKS;
  const lastRung = IMP96557_KAPPA_SERIES[IMP96557_KAPPA_SERIES.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96409: E_flow-Domination Required Factor kappa(N)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96557_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        kappa(N) = E_coll(N) / E_flow(N) is the factor by which the unconditionally rigorous
        Gronwall flow term would need to be enlarged to tie the GUE-conditional collapse term.
        Over the N in [1e3,1e12] diagnostic regime it never drops below&nbsp;
        {inRegimeMin.kappaRequired.toFixed(2)} and rises monotonically to&nbsp;
        {lastRung.kappaRequired.toExponential(2)} at N=1e12. A wider sweep finds a shallow global
        infimum of only&nbsp;{globalMin.kappaRequired.toFixed(2)} at N&asymp;{globalMin.N.toFixed(1)}
        &nbsp;&mdash; still far above the kappa=1 parity line, which is never reached anywhere.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        log-log kappa(N): diagnostic-regime ladder vs the global infimum
      </h3>
      <KappaChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue ladder is the
        required factor at each diagnostic N; it climbs from {inRegimeMin.kappaRequired.toFixed(2)}
        &nbsp;at N=1e3 to {lastRung.kappaRequired.toExponential(2)} at N=1e12, with no crossover of
        the red parity line. The yellow marker at N&asymp;{globalMin.N.toFixed(1)} (below the
        diagnostic floor) is the shallow global minimum kappa&asymp;{globalMin.kappaRequired.toFixed(3)}
        &nbsp;&mdash; even there, reaching parity would require inflating the imp-398 pinned C_F from
        &asymp;{globalMin.C_F.toFixed(4)} to &asymp;{globalMin.C_FNeededForParity.toFixed(2)}, a
        &times;{globalMin.kappaRequired.toFixed(2)} enlargement outside any admissible mollifier
        reshaping.
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
        imp-96409 required-factor measurement verbatim (the only new step is parsing N-labels and
        taking log10 for the plotting grid). Presentation / measurement diagnostic only; changes
        no bound; establishes no operator positivity; RH open; NO QED.
      </div>
    </div>
  );
}
