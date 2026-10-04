import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96514_SCAN_POINTS,
  IMP96514_REFERENCE_POINT,
  IMP96514_LANDMARKS,
  IMP96514_HONEST_BANNER,
} from '../data/imp-96514-excursion-2sigma-interior-scan-viz-data.js';
import { ED } from '../styles/tokens.js';

const MARKER_COLOR = {
  'clean-interior-dip': ED.series1,
  'clipped-ceiling': ED.series8,
  'above-envelope-interior': ED.series4,
  'reference-excursion': ED.series4,
};

function InteriorScanChart() {
  const svgW = 720;
  const svgH = 340;
  const padL = 56;
  const padR = 16;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 1.4e5;
  const xMax = 6.5e5;
  const yMin = 0;
  const yMax = 2.2;

  const xOf = (Tc) => padL + ((Tc - xMin) / (xMax - xMin)) * plotW;
  const yOf = (z) => padT + plotH - ((z - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [2e5, 3e5, 4e5, 5e5, 6e5];
  const yTicks = [0, 0.5, 1.0, 1.5, 2.0];

  const allPoints = [
    { ...IMP96514_REFERENCE_POINT, isReference: true },
    ...IMP96514_SCAN_POINTS.map((p) => ({ ...p, isReference: false })),
  ].sort((a, b) => a.Tc - b.Tc);

  const lineD = allPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.Tc).toFixed(2)} ${yOf(p.z).toFixed(2)}`)
    .join(' ');

  const clipX = xOf(IMP96514_LANDMARKS.tClip);
  const twoSigmaY = yOf(IMP96514_LANDMARKS.zTwoSigmaTarget);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{v.toFixed(1)}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {(v / 1e5).toFixed(0)}e5
        </text>
      ))}

      {/* 2-sigma target line */}
      <line x1={padL} y1={twoSigmaY} x2={padL + plotW} y2={twoSigmaY} stroke={ED.series2} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
      <text x={padL + 4} y={twoSigmaY - 4} fill={ED.series2} fontSize={8}>z = 2 (2-sigma target)</text>

      {/* clip threshold */}
      <line x1={clipX} y1={padT} x2={clipX} y2={padT + plotH} stroke={ED.series5} strokeWidth={1} strokeDasharray="2 3" opacity={0.7} />
      <text x={clipX + 4} y={padT + 10} fill={ED.series5} fontSize={8}>T_clip ~4.6175e5</text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={lineD} fill="none" stroke={ED.rule} strokeWidth={1} opacity={0.6} />

      {allPoints.map((p) => (
        <circle
          key={`pt-${p.Tc}`}
          cx={xOf(p.Tc)}
          cy={yOf(p.z)}
          r={p.isReference ? 4.5 : 3}
          fill={MARKER_COLOR[p.marker]}
          stroke={p.isReference ? ED.ruleSoft : 'none'}
          strokeWidth={p.isReference ? 1 : 0}
        />
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        T (interior height, unclipped candidates 1.5e5 .. 6.4e5)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <circle cx={5} cy={0} r={4.5} fill={MARKER_COLOR['reference-excursion']} stroke={ED.ruleSoft} strokeWidth={1} />
        <text x={16} y={3} fill={ED.inkSoft} fontSize={8.5}>T=1.5e5 reference excursion (z=1.9234)</text>
        <circle cx={5} cy={14} r={3} fill={MARKER_COLOR['clean-interior-dip']} />
        <text x={16} y={17} fill={ED.inkSoft} fontSize={8.5}>clean interior dip (below-envelope, unclipped)</text>
        <circle cx={5} cy={28} r={3} fill={MARKER_COLOR['above-envelope-interior']} />
        <text x={16} y={31} fill={ED.inkSoft} fontSize={8.5}>above-envelope interior (not a dip)</text>
        <circle cx={5} cy={42} r={3} fill={MARKER_COLOR['clipped-ceiling']} />
        <text x={16} y={45} fill={ED.inkSoft} fontSize={8.5}>clipped by ordinate ceiling (T &gt; T_clip)</text>
      </g>
    </svg>
  );
}

export default function Imp96514Excursion2SigmaInteriorScanViz() {
  const { deepestInteriorTc, deepestInteriorZ, referenceZ, anyInteriorHeightReachesTwoSigma } = IMP96514_LANDMARKS;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96493: Interior-Height 2-Sigma Scan" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96514_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96452 named the only genuine lever to reach a clean 2-sigma below-envelope
        number-variance excursion: observe a comparably deep dip at a higher unclipped
        height. imp-96493 scanned the existing 10^6 Odlyzko ordinates at every unclipped
        interior height T &gt; 1.5e5 the data reaches. This chart plots the resulting z-score
        z(T) at all ten candidates against the T=1.5e5 reference excursion, the z=2 target,
        and the ordinate-ceiling clip threshold.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        z(T) across the interior-height scan, reference excursion, 2-sigma line, and clip threshold
      </h3>
      <InteriorScanChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the yellow reference
        point (T=1.5e5, z={referenceZ.toFixed(4)}) sits above every other candidate. The
        deepest clean interior dip is at T={deepestInteriorTc.toExponential(3)}, z=
        {deepestInteriorZ.toFixed(4)} -- only about {(100 * deepestInteriorZ / referenceZ).toFixed(0)}%
        of the reference and well short of the dashed z=2 target. The two candidates past the
        purple clip threshold are grey (span-clipped by the ordinate ceiling) and sit above
        the envelope, not below it, so they cannot supply the lever either.
        {anyInteriorHeightReachesTwoSigma ? '' : ' No scanned height reaches z=2.'}
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
        imp-96493 baked ten-candidate scan verbatim (the only new step is merging in the
        T=1.5e5 reference point and labelling each marker category). Measurement only:
        changes no bound, establishes no operator positivity; RH open; NO QED;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA.
      </div>
    </div>
  );
}
