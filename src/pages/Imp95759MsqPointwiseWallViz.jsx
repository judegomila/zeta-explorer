import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95759_RATIO_SERIES,
  IMP95759_EXCESS_SERIES,
  IMP95759_RATIO_BAND,
  IMP95759_EXCESS_DECAY,
  IMP95759_CAVEAT_BANNER,
} from '../data/imp-95759-msq-pointwise-wall-viz-data.js';
import { ED } from '../styles/tokens.js';

function VarianceRatioPanel() {
  const svgW = 640;
  const svgH = 220;
  const padL = 48;
  const padR = 24;
  const padT = 24;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xLo = IMP95759_RATIO_SERIES[0].log10T - 0.3;
  const xHi = IMP95759_RATIO_SERIES[IMP95759_RATIO_SERIES.length - 1].log10T + 0.3;
  const yLo = 0;
  const yHi = 1.05;
  const xOf = (log10T) => padL + ((log10T - xLo) / (xHi - xLo)) * plotW;
  const yOf = (ratio) => padT + plotH - ((ratio - yLo) / (yHi - yLo)) * plotH;

  const points = IMP95759_RATIO_SERIES.map((p) => `${xOf(p.log10T)},${yOf(p.varRatio)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* measured band */}
      <rect
        x={padL}
        y={yOf(IMP95759_RATIO_BAND.max)}
        width={plotW}
        height={yOf(IMP95759_RATIO_BAND.min) - yOf(IMP95759_RATIO_BAND.max)}
        fill={ED.series1}
        opacity={0.12}
      />
      <line x1={padL} y1={yOf(IMP95759_RATIO_BAND.mean)} x2={padL + plotW} y2={yOf(IMP95759_RATIO_BAND.mean)} stroke={ED.series1} strokeDasharray="4 3" strokeWidth={1} />
      <text x={padL + plotW - 4} y={yOf(IMP95759_RATIO_BAND.mean) - 6} textAnchor="end" fill={ED.series1} fontSize={9.5}>
        {`mean ratio ${IMP95759_RATIO_BAND.mean}`}
      </text>

      {/* GUE = 1 reference */}
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke={ED.rule} strokeWidth={1} />
      <text x={padL + 4} y={yOf(1) - 6} fill={ED.inkFaint} fontSize={9.5}>GUE asymptote r = 1</text>

      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <polyline points={points} fill="none" stroke={ED.brassDeco} strokeWidth={2} />
      {IMP95759_RATIO_SERIES.map((p) => (
        <circle key={p.Tc} cx={xOf(p.log10T)} cy={yOf(p.varRatio)} r={4} fill={ED.brassDeco} />
      ))}

      {IMP95759_RATIO_SERIES.map((p) => (
        <text key={`lbl-${p.Tc}`} x={xOf(p.log10T)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
          {p.log10T}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 T
      </text>
      <text x={12} y={padT + plotH / 2} transform={`rotate(-90 12 ${padT + plotH / 2})`} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        r(T)
      </text>
    </svg>
  );
}

function WorstExcessDecayPanel() {
  const svgW = 640;
  const svgH = 220;
  const padL = 48;
  const padR = 24;
  const padT = 24;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xLo = IMP95759_EXCESS_SERIES[0].log10L - 0.2;
  const xHi = IMP95759_EXCESS_SERIES[IMP95759_EXCESS_SERIES.length - 1].log10L + 0.2;
  const yLo = Math.min(...IMP95759_EXCESS_SERIES.map((p) => p.log10WorstRelExcess)) - 0.2;
  const yHi = Math.max(...IMP95759_EXCESS_SERIES.map((p) => p.log10WorstRelExcess)) + 0.2;
  const xOf = (log10L) => padL + ((log10L - xLo) / (xHi - xLo)) * plotW;
  const yOf = (log10Val) => padT + plotH - ((log10Val - yLo) / (yHi - yLo)) * plotH;

  const points = IMP95759_EXCESS_SERIES.map((p) => `${xOf(p.log10L)},${yOf(p.log10WorstRelExcess)}`).join(' ');

  // reference slope -1 line (additive-gap prediction) anchored at the first point
  const first = IMP95759_EXCESS_SERIES[0];
  const refX1 = xOf(first.log10L);
  const refY1 = yOf(first.log10WorstRelExcess);
  const refX2 = xOf(xHi - 0.2);
  const refY2 = yOf(first.log10WorstRelExcess - ((xHi - 0.2) - first.log10L));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={refX1} y1={refY1} x2={refX2} y2={refY2} stroke={ED.rule} strokeDasharray="4 3" strokeWidth={1} />
      <text x={refX2 - 4} y={refY2 - 6} textAnchor="end" fill={ED.inkFaint} fontSize={9.5}>slope -1 (additive)</text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <polyline points={points} fill="none" stroke={ED.series5} strokeWidth={2} />
      {IMP95759_EXCESS_SERIES.map((p) => (
        <circle key={p.Tc} cx={xOf(p.log10L)} cy={yOf(p.log10WorstRelExcess)} r={4} fill={ED.series5} />
      ))}

      {IMP95759_EXCESS_SERIES.map((p) => (
        <text key={`lbl-${p.Tc}`} x={xOf(p.log10L)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
          {p.log10L}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 L (envelope count)
      </text>
      <text x={12} y={padT + plotH / 2} transform={`rotate(-90 12 ${padT + plotH / 2})`} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10(maxExcess / L)
      </text>
    </svg>
  );
}

export default function Imp95759MsqPointwiseWallViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Mean-Square-vs-Pointwise Wall: Two Faces of One Object (imp-95728 / imp-95759)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95728 wall assembly measured the mean-square-vs-pointwise gap on actual zeta zeros
        two ways. The variance ratio r(T) = sd(C-E)^2 / Sigma^2(L) stays FLAT near{' '}
        {IMP95759_RATIO_BAND.mean} (band [{IMP95759_RATIO_BAND.min}, {IMP95759_RATIO_BAND.max}])
        across T = 1e4..5e5, never trending toward the GUE value 1 -- the normalised residual is
        scale-invariant. At the same time the worst-window excess relative to the envelope,
        maxExcess/L, DECAYS like 1/L (log-log slope {IMP95759_EXCESS_DECAY.logLogSlope}, close to
        the additive-gap prediction of -1), falling from {IMP95759_EXCESS_DECAY.lo.toExponential(2)}{' '}
        to {IMP95759_EXCESS_DECAY.hi.toExponential(2)}. Same wall, two faces: constant in
        normalised terms, decaying in absolute-relative terms.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
        Variance ratio r(T) vs height -- flat, no GUE-closure trend
      </h3>
      <VarianceRatioPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.85rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        Worst relative excess maxExcess/L vs envelope count L -- decays ~1/L (log-log)
      </h3>
      <WorstExcessDecayPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95759_CAVEAT_BANNER}
      </div>
    </div>
  );
}
