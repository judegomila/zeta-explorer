import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP36097_E_SHARE_THRESHOLD_CROSSINGS } from '../data/imp-36097-e-share-threshold-crossings-viz-data.js';
import { IMP36046_E_SHARE_TAIL_BARS } from '../data/imp-36046-e-share-tail-landmarks-viz-data.js';
import { IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS } from '../data/imp-36138-sharecoll-subpercent-threshold-crossings-viz-data.js';
import { IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR } from '../data/imp-36155-sharecoll-crossing-precedes-sole-survivor.js';
import { ED } from '../styles/tokens.js';

// The imp-36138 sub-1% shareColl crossings (1e-3, 1e-4); the 1e-2 rung is dropped here
// since it already appears via IMP36097_E_SHARE_THRESHOLD_CROSSINGS (same anchor point).
const IMP36138_NEW_CROSSINGS = IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS.filter((c) => c.isNew);

const SOLE_SURVIVOR_LOG10_N = IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR.soleSurvivor.log10N;
const IMP36155_GAP = IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR.gap;

const SERIES = [
  { key: 'shareTrunc', label: 'E_trunc share', color: ED.series1 },
  { key: 'shareFlow', label: 'E_flow share', color: ED.series5 },
  { key: 'shareColl', label: 'E_coll share', color: ED.series7 },
];

// Combine the imp-36046 tail landmarks with the imp-36097 threshold crossings into a
// single log10 N-ordered ladder of the imp-35889 E(N) three-way fractional share.
const LADDER_POINTS = [
  ...IMP36046_E_SHARE_TAIL_BARS.map((b) => ({ ...b, isCrossing: false })),
  ...IMP36097_E_SHARE_THRESHOLD_CROSSINGS.map((c) => ({ ...c, isCrossing: true })),
  ...IMP36138_NEW_CROSSINGS.map((c) => ({ ...c, isCrossing: true, isSubPercent: true })),
].sort((a, b) => a.log10_N - b.log10_N);

// Line chart of shareTrunc / shareFlow / shareColl vs log10 N across the combined
// imp-36046 tail landmarks and imp-36097 threshold-crossing ladder, with the four
// imp-36097 crossings marked distinctly and the imp-35971 sole-survivor height
// marked with a vertical guide.
function ShareLadderChart() {
  const svgW = 680;
  const padL = 44;
  const padR = 24;
  const plotW = svgW - padL - padR;
  const svgH = 340;
  const padT = 24;
  const padB = 46;
  const plotH = svgH - padT - padB;

  const minX = Math.min(...LADDER_POINTS.map((p) => p.log10_N));
  const maxX = Math.max(...LADDER_POINTS.map((p) => p.log10_N));
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - v * plotH;

  const xTicks = [9, 11, 13, 15, 17];
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 N
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        fractional share
      </text>

      {/* the imp-35971 sole-survivor height guide */}
      <line
        x1={xOf(SOLE_SURVIVOR_LOG10_N)}
        y1={padT}
        x2={xOf(SOLE_SURVIVOR_LOG10_N)}
        y2={padT + plotH}
        stroke={ED.brassDeco}
        strokeWidth={1.5}
        strokeDasharray="4 3"
        opacity={0.8}
      />
      <text x={xOf(SOLE_SURVIVOR_LOG10_N) - 4} y={padT + 10} textAnchor="end" fill={ED.brass} fontSize={8.5}>
        sole-survivor N*
      </text>

      {SERIES.map((s) => (
        <polyline
          key={s.key}
          points={LADDER_POINTS.map((p) => `${xOf(p.log10_N)},${yOf(p[s.key])}`).join(' ')}
          fill="none"
          stroke={s.color}
          strokeWidth={2}
          opacity={0.85}
        />
      ))}

      {LADDER_POINTS.map((p) =>
        SERIES.map((s) => (
          <circle
            key={`${p.label}-${s.key}`}
            cx={xOf(p.log10_N)}
            cy={yOf(p[s.key])}
            r={p.isCrossing ? 5 : 3.5}
            fill={s.color}
            stroke={ED.paper}
            strokeWidth={p.isCrossing ? 1.5 : 1}
          />
        )),
      )}
    </svg>
  );
}

export default function Imp36143EShareThresholdCrossingLadderViz() {
  const crossings = IMP36097_E_SHARE_THRESHOLD_CROSSINGS;
  const [subPct1e3, subPct1e4] = IMP36138_NEW_CROSSINGS;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E-Share Threshold-Crossing Ladder (imp-36097 / imp-36046 / imp-35971 / imp-36138 / imp-36155)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-35889 E(N) = E_trunc + E_flow + E_coll fractional-share split, traced from the
        imp-36046 tail landmarks through the imp-36097 threshold crossings where shareFlow first
        drops below 1e-3, 1e-5, and 1e-6, and where shareColl first drops below 1%. The shareColl
        &lt; 1% crossing (log10 N &asymp; {crossings[3].log10_N}) sits {IMP36155_GAP.ratioStarOverCross}x
        below (&asymp;{IMP36155_GAP.pctApart}%, &asymp;{IMP36155_GAP.log10Gap} decades in log10 N) the
        imp-35971 sole-survivor height N* &asymp; {SOLE_SURVIVOR_LOG10_N} (marked with the dashed guide).
        Per imp-36155 this ordering is structural, not a tabulation accident: the crossing divides
        E_coll by E(N) while the sole-survivor divides it by E_trunc alone, and since
        E(N) = E_trunc + E_flow + E_coll &gt; E_trunc strictly, the share E_coll / E(N) always
        reaches the 1% level at a smaller N than the ratio E_coll / E_trunc does. At N*, E_trunc
        stands alone and E_coll (the last surviving competitor) has fallen to &asymp;1% of the mass.
        The imp-36138 extension continues the shareColl ladder past 1% down to
        &lt; 0.1% (log10 N &asymp; {subPct1e3.log10_N}) and &lt; 0.01% (log10 N &asymp;{' '}
        {subPct1e4.log10_N}), where shareTrunc rises to &asymp;99.9% and &asymp;99.99% of the mass
        respectively -- each 10x tightening of shareColl costs &asymp;2.06 decades of N, just above
        the naive N^(-1/2) prediction of 2.0.
      </p>

      <ShareLadderChart />

      <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginTop: '0.5rem' }}>
        {SERIES.map((s) => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
            <span style={{ width: 12, height: 12, background: s.color, display: 'inline-block', borderRadius: 2 }} />
            {s.label}
          </div>
        ))}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation-only consumer of
        the baked imp-36097, imp-36046, imp-36138, and imp-36155 viz-data literals (all reusing the
        recorded imp-35971 / imp-35889 shares); no new derivation, no bound changed. C_C GUE-conditional
        (imp-2642 / imp-2643 / imp-486) untouched; no RH verdict, NO QED.
      </div>
    </div>
  );
}
