import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3903_ROWS,
  IMP3903_MIN_DMIN_OVER_SMIN_SQ,
  IMP3903_MAX_DMIN_OVER_SMIN_SQ,
  IMP3903_MIN_OFFSET,
  IMP3903_MAX_OFFSET,
} from '../data/imp-3903-smin-dmin-slack-viz-data.js';
import { ED } from '../styles/tokens.js';

const RATIO_COLOR = ED.series7;
const OFFSET_COLOR = ED.series1;

function InflationRatioChart() {
  const svgW = 680;
  const padL = 70;
  const padR = 24;
  const padT = 16;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const yMin = 1e3;
  const yMax = 4e4;
  const logYMin = Math.log10(yMin);
  const logYMax = Math.log10(yMax);
  const xS = (i) => padL + ((i + 0.5) / IMP3903_ROWS.length) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logYMin) / (logYMax - logYMin));

  const yTicks = [1e3, 1e4, 3e4];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      {IMP3903_ROWS.map((r) => {
        const barTop = yS(r.dminOverSminSq);
        const barBottom = padT + cH;
        const isMin = r.dminOverSminSq === IMP3903_MIN_DMIN_OVER_SMIN_SQ;
        const isMax = r.dminOverSminSq === IMP3903_MAX_DMIN_OVER_SMIN_SQ;
        return (
          <g key={r.plateauIndex}>
            <rect
              x={xS(r.plateauIndex) - 16}
              y={barTop}
              width={32}
              height={Math.max(barBottom - barTop, 0)}
              fill={isMin || isMax ? '#fbcfe8' : RATIO_COLOR}
              opacity={isMin || isMax ? 1 : 0.75}
              rx={2}
            />
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {IMP3903_ROWS.map((r) => (
        <text key={'x' + r.plateauIndex} x={xS(r.plateauIndex)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {r.plateauIndex}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        plateau index (0..9, log axis)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        (D_min / s_min)^2
      </text>
    </svg>
  );
}

function OffsetSpreadChart() {
  const svgW = 680;
  const padL = 70;
  const padR = 24;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const xMin = -300000;
  const xMax = 450000;
  const xS = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yFor = (i) => padT + ((i + 0.5) / IMP3903_ROWS.length) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      <line x1={xS(0)} y1={padT} x2={xS(0)} y2={padT + cH} stroke={ED.rule} strokeWidth={1} strokeDasharray="4,3" />
      <text x={xS(0)} y={padT - 6} textAnchor="middle" fill={ED.series1} fontSize={8.5}>
        record pair (offset = 0)
      </text>

      {IMP3903_ROWS.map((r) => (
        <line
          key={'l' + r.plateauIndex}
          x1={xS(0)}
          y1={yFor(r.plateauIndex)}
          x2={xS(r.distFromPair)}
          y2={yFor(r.plateauIndex)}
          stroke={ED.ruleSoft}
          strokeWidth={1}
        />
      ))}
      {IMP3903_ROWS.map((r) => (
        <circle key={r.plateauIndex} cx={xS(r.distFromPair)} cy={yFor(r.plateauIndex)} r={4} fill={OFFSET_COLOR} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {IMP3903_ROWS.map((r) => (
        <text key={'y' + r.plateauIndex} x={padL - 6} y={yFor(r.plateauIndex) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          p{r.plateauIndex}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        tightest-gap offset from the record pair (gap-index units)
      </text>
    </svg>
  );
}

export default function Imp3903SminDminSlackViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="smin/Dmin Slack: Rigorous Elasticity Inflates 1987x-35492x, Tightest Gap Never Adjacent (imp-3870/imp-3903)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3870 measured the smallest INDIVIDUAL shrunk gap s_min against the nearest CUMULATIVE
        frozen distance D_min across all 10 imp-3725 plateaus, testing the imp-3854 note that "the
        nearest zero is also the tightest gap, so s_min &asymp; D_min." It is FALSE on every plateau:
        s_min/D_min sits at 0.0053-0.0224, so substituting the rigorous (H/s_min)&sup2; constant for
        the effective (H/D_min)&sup2; one would inflate the predicted elasticity by (D_min/s_min)&sup2;
        &mdash; {IMP3903_MIN_DMIN_OVER_SMIN_SQ.toFixed(0)}x (plateau 4) to {IMP3903_MAX_DMIN_OVER_SMIN_SQ.toFixed(0)}x
        (plateau 9), a 1000x-4000x overshoot of the measured near-1 predictionRatio. The tightest
        individual gap is also NEVER adjacent to the record pair, sitting {IMP3903_MIN_OFFSET} to{' '}
        {IMP3903_MAX_OFFSET} gap-indices away on every plateau.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        (D_min/s_min)^2 per plateau, log axis -- the rigorous-elasticity inflation factor if s_min replaced D_min
      </p>
      <InflationRatioChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        tightest-individual-gap offset from the record pair, per plateau -- always far from zero, never adjacent
      </p>
      <OffsetSpreadChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the top chart shows
        (D_min/s_min)&sup2; ranging from ~2383x to ~35492x with the two labelled bars marking the
        overall min (plateau 4) and max (plateau 9) &mdash; every plateau sits well above 1000x, so
        the s_min/D_min slack is orders of magnitude too large to explain the imp-3854 [0.79, 1.56]
        residual. The bottom chart plots each plateau's tightest-gap offset relative to the record
        pair at offset 0; every marker sits far from the dashed centre line, confirming the tightest
        individual gap is a distant tail gap, not the adjacent pair imp-3854 assumed.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> this corrects an imp-3854
        CHARACTERIZATION (the residual mechanism), not its inequality &mdash; LEMMA 3854 stays a
        valid (loose) over-bound and the certified K_paper enclosure is untouched. Measurement only;
        the imp-3870-sub-concavity-fit sub-gap stays open; no new Lambda bound; imp-3066 K_a &ge; 0
        positivity untouched. NO QED.
      </div>
    </div>
  );
}
