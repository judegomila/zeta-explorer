import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95319_A_BLK,
  IMP95319_A_LOO_CURVE,
  IMP95319_CROSSOVER,
  IMP95319_R,
} from '../data/imp-95319-splitrz-vs-splitloo-collar-viz-data.js';
import { ED } from '../styles/tokens.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xTicks, yTicks, xOf, yOf, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
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
            {v}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

// log10(A_LOO(m)) vs m, against the flat log10(A_blk) reference line
function SplitRzVsSplitLooCollarPanel() {
  const points = IMP95319_A_LOO_CURVE;
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const svgH = 340;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minX = 0;
  const maxX = 33;
  const minY = -18;
  const maxY = 1;
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const blkLog = Math.log10(IMP95319_A_BLK);
  const looLine = points.map((p) => `${xOf(p.m)},${yOf(Math.log10(p.aLoo))}`).join(' ');

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={[0, 4, 8, 12, 16, 20, 24, 28, 32]}
      yTicks={[-16, -12, -8, -4, 0]}
      xOf={xOf}
      yOf={yOf}
      xLabel="m (octave-block count)"
      yLabel="log10(constant)"
    >
      <line
        x1={padL}
        y1={yOf(blkLog)}
        x2={padL + plotW}
        y2={yOf(blkLog)}
        stroke={ED.series1}
        strokeWidth={1.5}
        strokeDasharray="6 3"
        opacity={0.85}
      />
      <text x={padL + plotW - 4} y={yOf(blkLog) - 5} textAnchor="end" fill={ED.series1} fontSize={8.5}>
        A_blk (imp-95252, flat, m-independent)
      </text>
      <polyline points={looLine} fill="none" stroke={ED.series4} strokeWidth={2} opacity={0.9} />
      {points.map((p) => (
        <circle key={p.m} cx={xOf(p.m)} cy={yOf(Math.log10(p.aLoo))} r={2.5} fill={ED.series4} />
      ))}
      <circle
        cx={xOf(IMP95319_CROSSOVER.aboveM)}
        cy={yOf(
          Math.log10(points.find((p) => p.m === IMP95319_CROSSOVER.aboveM).aLoo),
        )}
        r={4.5}
        fill="none"
        stroke={ED.series7}
        strokeWidth={2}
      />
      <text x={padL + 8} y={padT + 14} fill={ED.series4} fontSize={9}>
        A_LOO(m) (imp-95250 naive per-block reciprocal-sum constant)
      </text>
      <text x={padL + 8} y={padT + 27} fill={ED.series7} fontSize={9}>
        circled: m = {IMP95319_CROSSOVER.aboveM}, first m below A_blk
      </text>
    </AxisFrame>
  );
}

export default function Imp95319SplitRzVsSplitLooCollarViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="SPLIT-RZ Flat Constant vs the SPLIT-LOO Linear-in-m Collar (imp-95252 / imp-95250 / imp-95319)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a model-family numeric
        illustration, not a new theorem. It changes no Lambda bound and establishes no operator
        positivity. RH does not
        follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95250 HONEST LIMITS (d) names the constant LEMMA LOO alone would give for a direct
        block-Riesz-basis statement: A_LOO(m) = [ sum of (1&minus;sigma_k&sup2;)&#8315;&sup1; over
        m blocks ]&#8315;&sup1;, estimated here via the imp-95249 LEMMA ANG-DET fence. This panel
        plots A_LOO(m) (orange, window ratio r = {IMP95319_R}) against the imp-95252 flat,
        m-independent block-Riesz constant A_blk (blue dashed) that THEOREM RZ-TWIN actually
        delivers. For m &le; 4 the naive per-block constant is larger (less costly); at
        m = {IMP95319_CROSSOVER.aboveM} it drops below A_blk and continues to decay, matching the
        "linear-in-m" description &mdash; A_LOO(m)&middot;m converges toward a positive limit as m
        grows, i.e. the summed per-block collar 1/A_LOO(m) grows roughly linearly in m.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        A_LOO(m) vs the flat A_blk reference, r = {IMP95319_R}
      </h3>
      <SplitRzVsSplitLooCollarPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> at small octave counts
        (m &le; 4) SPLIT-LOO's naive per-block constant actually beats the flat SPLIT-RZ constant
        &mdash; consistent with imp-95252's own scope note that "small-m regimes stay with
        SPLIT-LOO / SPLIT-2." But the naive constant keeps shrinking as blocks are added (it has no
        floor), while A_blk is a single number that works for EVERY m, including m &rarr; infinity.
        This is exactly the gap imp-95252's Toeplitz/Fourier symbol analysis (THEOREM RZ-TWIN)
        closes, and it is why the every-octave certificate onset could drop from the
        depth-suppressed EV-OCT-UNIF value 27.0356 to the flat SPLIT-RZ value 15.9816 at r = 1.3.
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
        imp-95319 baked viz-data (values recomputed independently from the imp-95249 LEMMA ANG-DET
        fence definition and the imp-95252 aBlkRho2R13 constant). Changes no bound, establishes no
        operator positivity, no RH claim.
        NO QED.
      </div>
    </div>
  );
}
