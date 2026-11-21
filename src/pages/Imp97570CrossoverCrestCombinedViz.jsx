import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97570_MERGED_ROWS,
  IMP97570_CRESTS,
  IMP97570_STEP,
  IMP97570_B_LADDER,
} from '../data/imp-97570-crossover-crest-combined-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97570: merges the imp-97441 four-tolerance x*(eps) table with the
// imp-97459 crest amplitude table on the SAME b-ladder axis, so the eps=1%
// branch flip (0.199 -> 0.1665) is visually pinned to the row where the 1/6
// crest amplitude crosses the 1% threshold line while the 1/5 crest and the
// other three tolerances stay flat.

function CrestPanel() {
  const svgW = 640;
  const svgH = 190;
  const padL = 70;
  const padR = 24;
  const padT = 20;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logB = IMP97570_B_LADDER.map((b) => Math.log2(b));
  const minLogB = logB[0];
  const maxLogB = logB[logB.length - 1];
  const xOf = (b) => padL + ((Math.log2(b) - minLogB) / (maxLogB - minLogB)) * plotW;

  const lo = 0.7;
  const hi = 1.5;
  const yOf = (v) => padT + plotH - ((v - lo) / (hi - lo)) * plotH;

  return (
    <div style={{ marginBottom: '1rem' }}>
      <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
        <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

        {/* 1% threshold line */}
        <line x1={padL} y1={yOf(1.0)} x2={padL + plotW} y2={yOf(1.0)} stroke={ED.series2} strokeWidth={1} strokeDasharray="4 3" />
        <text x={padL + plotW} y={yOf(1.0) - 3} textAnchor="end" fill={ED.series2} fontSize={9}>1% level</text>

        {/* continuum tips as horizontal guides */}
        <line x1={padL} y1={yOf(IMP97570_CRESTS.lower.continuumTipPct)} x2={padL + plotW} y2={yOf(IMP97570_CRESTS.lower.continuumTipPct)} stroke={ED.series1} strokeWidth={0.75} strokeDasharray="2 4" opacity={0.6} />
        <line x1={padL} y1={yOf(IMP97570_CRESTS.upper.continuumTipPct)} x2={padL + plotW} y2={yOf(IMP97570_CRESTS.upper.continuumTipPct)} stroke={ED.series5} strokeWidth={0.75} strokeDasharray="2 4" opacity={0.6} />

        {[0.7, 0.9, 1.0, 1.1, 1.3, 1.5].map((v) => (
          <g key={`y${v}`}>
            <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
            <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
              {v.toFixed(1)}%
            </text>
          </g>
        ))}

        {IMP97570_B_LADDER.map((b) => (
          <text key={`x${b}`} x={xOf(b)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {b}
          </text>
        ))}

        {/* lower crest (1/6) -- sampled amplitude climbing toward the 1.113% continuum tip */}
        <polyline
          points={IMP97570_MERGED_ROWS.map((r) => `${xOf(r.b)},${yOf(r.ampLowerPct)}`).join(' ')}
          fill="none"
          stroke={ED.series1}
          strokeWidth={2}
        />
        {IMP97570_MERGED_ROWS.map((r) => (
          <circle key={`lo${r.b}`} cx={xOf(r.b)} cy={yOf(r.ampLowerPct)} r={3} fill={r.lowerOver1 ? ED.series1 : ED.paper3} stroke={ED.series1} strokeWidth={1.5} />
        ))}

        {/* upper crest (1/5) -- dead flat, always above 1% */}
        <polyline
          points={IMP97570_MERGED_ROWS.map((r) => `${xOf(r.b)},${yOf(r.ampUpperPct)}`).join(' ')}
          fill="none"
          stroke={ED.series5}
          strokeWidth={2}
        />
        {IMP97570_MERGED_ROWS.map((r) => (
          <circle key={`up${r.b}`} cx={xOf(r.b)} cy={yOf(r.ampUpperPct)} r={3} fill={ED.series5} />
        ))}

        {/* step-point marker: the row where the branch flips */}
        <line
          x1={(xOf(IMP97570_STEP.ladderStepLoB) + xOf(IMP97570_STEP.ladderStepHiB)) / 2}
          y1={padT}
          x2={(xOf(IMP97570_STEP.ladderStepLoB) + xOf(IMP97570_STEP.ladderStepHiB)) / 2}
          y2={padT + plotH}
          stroke={ED.brassDeco}
          strokeWidth={1}
          strokeDasharray="2 2"
          opacity={0.7}
        />

        <text x={padL} y={padT - 6} fill={ED.ink} fontSize={10} fontWeight="bold">
          Crest amplitudes vs b: lower (1/6, blue) crosses 1%; upper (1/5, purple) stays above it
        </text>
      </svg>
      <div style={{ paddingLeft: padL, fontSize: '0.72rem', color: 'var(--ink-faint)' }}>
        Yellow dashed line: the branch-flip step point between b={IMP97570_STEP.ladderStepLoB} and b={IMP97570_STEP.ladderStepHiB}.
        Filled blue dots: lower-crest amplitude &gt; 1% (branch active). Open dots: &le; 1%.
      </div>
    </div>
  );
}

function MergedTable() {
  const epsList = [0.005, 0.01, 0.02, 0.05];
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.78rem', marginBottom: '1rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'right', padding: '4px 8px' }}>b</th>
          {epsList.map((e) => (
            <th key={e} style={{ textAlign: 'right', padding: '4px 8px' }}>
              x*({(e * 100).toFixed(1)}%)
            </th>
          ))}
          <th style={{ textAlign: 'right', padding: '4px 8px' }}>amp(1/6)</th>
          <th style={{ textAlign: 'right', padding: '4px 8px' }}>amp(1/5)</th>
          <th style={{ textAlign: 'left', padding: '4px 8px' }}>1% branch</th>
        </tr>
      </thead>
      <tbody>
        {IMP97570_MERGED_ROWS.map((r) => (
          <tr key={r.b} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ textAlign: 'right', padding: '4px 8px' }}>{r.b}</td>
            {epsList.map((e) => (
              <td
                key={e}
                style={{
                  textAlign: 'right',
                  padding: '4px 8px',
                  color: e === 0.01 ? 'var(--series-2)' : 'var(--ink)',
                  fontWeight: e === 0.01 ? 'bold' : 'normal',
                }}
              >
                {r.xStar[e].toFixed(5)}
              </td>
            ))}
            <td style={{ textAlign: 'right', padding: '4px 8px', color: r.lowerOver1 ? 'var(--series-1)' : 'var(--ink-faint)' }}>
              {r.ampLowerPct.toFixed(4)}%
            </td>
            <td style={{ textAlign: 'right', padding: '4px 8px', color: 'var(--series-5)' }}>{r.ampUpperPct.toFixed(4)}%</td>
            <td style={{ textAlign: 'left', padding: '4px 8px' }}>{r.branch}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp97570CrossoverCrestCombinedViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97441 / imp-97459: The Bimodal 1% Crossover Merged With Its Two Crests" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> measurement
        only, reusing two upstream measurements verbatim (no re-derivation).
        Establishes no operator positivity; changes no bound. The rigorous
        anchor stays T = 2.594e7; no refereed bound is changed; RH open; NO
        QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97441 tabulated the crossover fraction x*(eps) = A(b)/b across four
        tolerances on the same b-ladder {'{'}1000,2000,4000,8000,16000{'}'}, and
        flagged the eps=1% row as BIMODAL (0.199 &rarr; 0.1665). imp-97459
        traced that bimodality to two fixed arithmetic crests of the signed
        deviation: a lower crest at x=1/6 (continuum tip 1.113%) and an upper
        crest at x=1/5 (dead-flat 1.3934%, always above 1%). This page merges
        both tables into one row-aligned view: the crest-amplitude chart below
        shows the lower crest climbing across the SAME b values where the
        table's 1% column steps, while the other three tolerance columns and
        the upper crest stay flat.
      </p>

      <CrestPanel />
      <MergedTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the merged view:</strong>{' '}
        the 1% column (red, bold) is the only tolerance column that changes
        value down the table; it flips from 0.199 to 0.1665 exactly at the row
        where amp(1/6) crosses from an open dot (&le;1%, b=2000, 0.9964%) to a
        filled dot (&gt;1%, b=4000, 1.0456%). amp(1/5) stays above 1% (filled)
        at every rung, so it can never be the row that flips as b grows past
        b=2000 &mdash; the flip is entirely decided by which crest the
        integer-a grid resolves above the 1% line first, not by a change in
        the underlying linear scale A(b) = x*(eps) b.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page
        consuming the imp-97441 and imp-97459 tables verbatim; no re-solve.
        Establishes no operator positivity; changes no bound; RH open; NO QED.
      </div>
    </div>
  );
}
