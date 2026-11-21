import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96515_RUNG_POINTS,
  IMP96515_LANDMARKS,
  IMP96515_HONEST_BANNER,
} from '../data/imp-96515-ppp-collapse-viz-data.js';
import { ED } from '../styles/tokens.js';

const BRANCH_COLOR = {
  cancellation: ED.series1,
  truncation: ED.series4,
};

function LogLogChart({ points, yKey, yMin, yMax, yTicks, yLabel, yFormat }) {
  const svgW = 720;
  const svgH = 280;
  const padL = 60;
  const padR = 16;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 800;
  const xMax = 7e6;
  const xTicks = [1e3, 1e4, 1e5, 1e6];

  const xOf = (L) => padL + ((Math.log10(L) - Math.log10(xMin)) / (Math.log10(xMax) - Math.log10(xMin))) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - Math.log10(yMin)) / (Math.log10(yMax) - Math.log10(yMin))) * plotH;

  const truncX = xOf(IMP96515_LANDMARKS.truncationOnsetL);

  const lineD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.L).toFixed(2)} ${yOf(p[yKey]).toFixed(2)}`)
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{yFormat(v)}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {v.toExponential(0).replace('+', '')}
        </text>
      ))}

      {/* cancellation/truncation branch boundary */}
      <line x1={truncX} y1={padT} x2={truncX} y2={padT + plotH} stroke={ED.series5} strokeWidth={1} strokeDasharray="2 3" opacity={0.7} />
      <text x={truncX + 4} y={padT + 10} fill={ED.series5} fontSize={8}>truncation onset L~3e5</text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={lineD} fill="none" stroke={ED.rule} strokeWidth={1} opacity={0.6} />

      {points.map((p) => (
        <circle
          key={`pt-${p.L}`}
          cx={xOf(p.L)}
          cy={yOf(p[yKey])}
          r={3.5}
          fill={BRANCH_COLOR[p.branch]}
        />
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        L (unfolded box length, log scale, 960 .. 5.9e6)
      </text>
      <text x={14} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 14 ${padT + plotH / 2})`}>
        {yLabel}
      </text>
    </svg>
  );
}

export default function Imp96515PppCollapseViz() {
  const { anchorFloorOverModel, truncationOnsetL, truncationOnsetOptPpp, lastCancellationOptimalL } = IMP96515_LANDMARKS;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96486: Basis-C ppp-Collapse Map" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96515_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96486 swept the direct basis-C floor across nine L rungs from 960 to the PT
        anchor 5.9e6. The optimal panels-per-period (ppp) collapses monotonically from 640
        down to 3, and the achievable floor tracks the imp-96430 L-linear cancellation model
        only while ppp* stays above ~16 (L &le; ~1e5); past that it departs into a
        ppp-truncation regime, reaching {anchorFloorOverModel.toFixed(0)}x above the model
        at the anchor. Both charts below mark the same crossover.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Optimal ppp vs L (log-log)
      </h3>
      <LogLogChart
        points={IMP96515_RUNG_POINTS}
        yKey="optPpp"
        yMin={2}
        yMax={800}
        yTicks={[3, 8, 32, 128, 640]}
        yLabel="optimal ppp"
        yFormat={(v) => String(v)}
      />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Floor-over-model ratio vs L (log-log)
      </h3>
      <LogLogChart
        points={IMP96515_RUNG_POINTS}
        yKey="floorOverModel"
        yMin={0.05}
        yMax={700}
        yTicks={[0.1, 1, 10, 100, 573]}
        yLabel="floor / L-linear model"
        yFormat={(v) => (v >= 1 ? String(v) : v.toFixed(2))}
      />

      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
        <span><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: BRANCH_COLOR.cancellation, marginRight: 6 }} />cancellation branch (L &le; {truncationOnsetL.toExponential(0)})</span>
        <span><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: BRANCH_COLOR.truncation, marginRight: 6 }} />truncation branch (L &gt; {truncationOnsetL.toExponential(0)})</span>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the top panel shows
        the true U-shape optimum -- ppp is already sub-640 by L={lastCancellationOptimalL === 960 ? '3e3' : lastCancellationOptimalL}, and
        falls to {truncationOnsetOptPpp} by the truncation onset near L={truncationOnsetL.toExponential(0)},
        then to 3 at the anchor. The bottom panel shows the achievable floor tracking the
        L-linear model closely (blue points, ratio within ~2-4x) until that same onset, then
        climbing far above it (orange points) up to {anchorFloorOverModel.toFixed(0)}x at the anchor.
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
        imp-96486 baked nine-rung map verbatim (the only new step is the cancellation /
        truncation branch label). Feasibility / cross-validation numerics only: theoretical
        GUE quantity, not real zeros; changes no bound, establishes no operator positivity;
        RH open; NO QED.
      </div>
    </div>
  );
}
