import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN } from '../data/imp-33269-all-plateaus-majorant-ratio-scan.js';
import { ED } from '../styles/tokens.js';

const ROWS = IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN.rows;
const VERDICT = IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN.verdict;

function TailWeightRatioBars() {
  const svgW = 680;
  const padL = 44;
  const padR = 16;
  const padT = 20;
  const padB = 54;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const yMax = 12;
  const yS = (v) => padT + cH * (1 - v / yMax);
  const groupW = cW / ROWS.length;
  const barW = groupW * 0.36;

  const yTicks = [0, 2, 4, 6, 8, 10, 12];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(1)} x2={padL + cW} y2={yS(1)} stroke={ED.series3} strokeWidth={1} strokeDasharray="3,3" />
      <text x={padL + cW - 2} y={yS(1) - 4} textAnchor="end" fill={ED.series3} fontSize={8.5}>
        R_real ~ O(1)
      </text>

      {ROWS.map((r, i) => {
        const gx = padL + i * groupW;
        const realX = gx + groupW * 0.12;
        const majX = gx + groupW * 0.52;
        const isArgmax = r.plateauIndex === VERDICT.rMajMaxPlateau;
        const isLastN = r.plateauIndex === ROWS.length - 1;
        return (
          <g key={r.plateauIndex}>
            <rect
              x={realX}
              y={yS(r.rReal)}
              width={barW}
              height={cH - (yS(r.rReal) - padT)}
              fill={ED.series1}
            />
            <rect
              x={majX}
              y={yS(r.rMaj)}
              width={barW}
              height={cH - (yS(r.rMaj) - padT)}
              fill={isArgmax ? ED.series4 : isLastN ? ED.series7 : ED.series5}
              stroke={isArgmax ? ED.series4 : 'none'}
              strokeWidth={isArgmax ? 1.5 : 0}
            />
            <text x={gx + groupW / 2} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
              P{r.plateauIndex}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        plateau index (increasing endN, left to right: 18859 .. 1e6)
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        ratio
      </text>

      <g transform={`translate(${padL + cW - 210}, ${padT + 8})`}>
        <rect x={0} y={0} width={9} height={9} fill={ED.series1} />
        <text x={13} y={8.5} fill={ED.inkSoft} fontSize={9}>R_real (realised)</text>
        <rect x={0} y={16} width={9} height={9} fill={ED.series5} />
        <text x={13} y={24.5} fill={ED.inkSoft} fontSize={9}>R_maj (certified)</text>
        <rect x={0} y={32} width={9} height={9} fill={ED.series4} />
        <text x={13} y={40.5} fill={ED.inkSoft} fontSize={9}>R_maj interior max (P5)</text>
        <rect x={0} y={48} width={9} height={9} fill={ED.series7} />
        <text x={13} y={56.5} fill={ED.inkSoft} fontSize={9}>R_maj largest-N (P9)</text>
      </g>
    </svg>
  );
}

export default function Imp33286RealisedVsCertifiedTailWeightRatioViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Realised vs Certified Tail-Weight Ratio per Plateau (imp-33250 / imp-33269 / imp-33286)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33250 compared the realised path-local tail-weight elasticity ratio R_real
        (blue bars) against the imp-3910 certified weighted-majorant ratio R_maj (purple/
        orange/pink bars) on 3 of the 10 imp-3725 running-min plateaus, and found R_real
        N-flat at O(1) while R_maj rose to its sample maximum (6.82) at the largest-N
        plateau. imp-33269 then scanned all 10 plateaus: R_maj does NOT keep climbing with
        N -- it TURNS OVER, reaching its true maximum ({VERDICT.rMajMax.toFixed(2)}) at the
        INTERIOR plateau {VERDICT.rMajMaxPlateau} (orange), with the largest-N plateau 9
        (pink) sitting below it at {VERDICT.plateau9RMaj.toFixed(2)}. R_real (blue) stays
        O(1) and non-monotone across all 10 plateaus without a growth trend.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        R_real vs R_maj per plateau, R_real~1 reference line dashed green
      </p>
      <TailWeightRatioBars />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> R_maj (majorant)
        dominates R_real (realised) on every plateau, as a certified upper bound must. But
        R_maj's peak sits at the interior plateau 5, not the largest-N plateau 9 -- the
        imp-33250 endpoint reading (3 samples) was a sparse-sampling artifact of the plateau
        set, not evidence of unbounded growth with N.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/visualization
        only -- no proof, no reduction below RH. Both ratios are bounded O(1) on this finite
        10-plateau sample of N in [1e4,1e6]; the N-to-infinity sup of R_maj remains
        uncertified (imp-3917-sub-all-plateaus residual). imp-3910's certified C&le;54.56 (3
        samples) / C&le;88.64 (10 samples) stands, imp-3066 K_a&ge;0 is untouched, and.
      </div>
    </div>
  );
}
