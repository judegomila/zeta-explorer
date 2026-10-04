import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34200_LTO_FOLDS_RANKED, IMP34200_SUMMARY } from '../data/imp-34200-lto-per-pair-influence-bar-chart-viz-data.js';
import { ED } from '../styles/tokens.js';

// Horizontal bar chart: one bar per fold (36 total), sorted by rmsShift descending
// (already the ranked order), with the two boundary-edge pairs picked out in red.
function PerPairInfluenceBarChart() {
  const rowH = 12;
  const gapY = 2;
  const svgW = 680;
  const padL = 88;
  const padR = 60;
  const padT = 8;
  const barAreaW = svgW - padL - padR;
  const svgH = padT + IMP34200_LTO_FOLDS_RANKED.length * (rowH + gapY);

  const maxShift = Math.max(...IMP34200_LTO_FOLDS_RANKED.map((f) => f.rmsShift));
  const widthOf = (v) => (v / maxShift) * barAreaW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP34200_LTO_FOLDS_RANKED.map((f, i) => {
        const y = padT + i * (rowH + gapY);
        const w = widthOf(f.rmsShift);
        const color = f.isBoundaryEdge ? ED.series2 : ED.series1;
        return (
          <g key={`fold-${f.droppedKEnds[0]}-${f.droppedKEnds[1]}`}>
            <text x={padL - 6} y={y + rowH - 3} textAnchor="end" fill={ED.inkFaint} fontSize={7.5}>
              {`{${f.droppedKEnds[0]}, ${f.droppedKEnds[1]}}`}
            </text>
            <rect x={padL} y={y} width={Math.max(w, 1)} height={rowH} fill={color} opacity={f.isBoundaryEdge ? 0.95 : 0.65} />
            <text x={padL + w + 4} y={y + rowH - 3} fill={ED.inkSoft} fontSize={7.5}>
              {f.rmsShift.toExponential(2)}
            </text>
          </g>
        );
      })}
      <text x={padL + barAreaW / 2} y={svgH - 0} textAnchor="middle" fill={ED.inkFaint} fontSize={9} />
    </svg>
  );
}

export default function Imp34200LtoPerPairInfluenceBarChartViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Leave-Two-Out Per-Pair Influence Ranking (imp-34110)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34110 ranked all C(9,2) = {IMP34200_SUMMARY.nFolds} leave-two-out folds of the
        imp-34042 sensitivity test by how far each dropped pair of imp-33917 boundary
        windows moves the fitted imp-33941 log curve (rmsShift). The chart below shows
        all 36 pairs in ranked order, with the two dominating boundary-edge pairs
        highlighted in red: the LOW edge {`{${IMP34200_SUMMARY.mostDestabilizingPair[0]}, ${IMP34200_SUMMARY.mostDestabilizingPair[1]}}`}{' '}
        (rmsShift {IMP34200_SUMMARY.mostDestabilizingRmsShift.toExponential(3)}) is the single
        worst, and the HIGH edge {`{${IMP34200_SUMMARY.secondDestabilizingPair[0]}, ${IMP34200_SUMMARY.secondDestabilizingPair[1]}}`}{' '}
        (rmsShift {IMP34200_SUMMARY.secondDestabilizingRmsShift.toExponential(3)}) is a near-tied
        second -- both roughly {IMP34200_SUMMARY.ratioWorstToLeast}x more destabilizing than the
        least influential interior-adjacent pair {`{${IMP34200_SUMMARY.leastDestabilizingPair[0]}, ${IMP34200_SUMMARY.leastDestabilizingPair[1]}}`}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        rmsShift by dropped-pair, ranked descending (red = the two boundary-edge pairs)
      </p>
      <PerPairInfluenceBarChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Fitted-log parameter shift (Delta a, Delta b) for the top 4 folds -- the two boundary
        edges are near mirror images
      </p>
      <table style={{ width: '100%', maxWidth: 460, borderCollapse: 'collapse', fontSize: '0.78rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>Dropped pair</th>
            <th style={{ paddingBottom: 4 }}>Delta a</th>
            <th style={{ paddingBottom: 4 }}>Delta b</th>
            <th style={{ paddingBottom: 4 }}>rmsShift</th>
          </tr>
        </thead>
        <tbody>
          {IMP34200_LTO_FOLDS_RANKED.slice(0, 4).map((f) => (
            <tr key={`delta-row-${f.droppedKEnds[0]}-${f.droppedKEnds[1]}`} style={{ color: f.isBoundaryEdge ? 'var(--series-2)' : 'var(--ink-soft)' }}>
              <td style={{ textAlign: 'left', padding: '2px 0' }}>{`{${f.droppedKEnds[0]}, ${f.droppedKEnds[1]}}`}</td>
              <td style={{ textAlign: 'right', padding: '2px 0' }}>{f.deltaA >= 0 ? `+${f.deltaA.toFixed(4)}` : f.deltaA.toFixed(4)}</td>
              <td style={{ textAlign: 'right', padding: '2px 0' }}>{f.deltaB >= 0 ? `+${f.deltaB.toFixed(4)}` : f.deltaB.toFixed(4)}</td>
              <td style={{ textAlign: 'right', padding: '2px 0' }}>{f.rmsShift.toExponential(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the ranking:</strong> influence is
        concentrated almost entirely at the two boundary edges. Interior-adjacent pairs
        (the bulk of the 36 folds) barely move the fitted log curve -- dropping the two
        adjacent lowest rungs (the low edge) or the two adjacent highest rungs (the high
        edge) is what destabilizes the fit, not dropping the two opposite extremes
        together (which only ranks ~11th of 36, since their lever arms partly cancel).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation of the
        already-established imp-34110 measurement (a per-pair influence ranking of an
        inherited imp-34042 leave-two-out sensitivity), no new computation on the
        underlying component model. Both the log and linear growth forms are descriptive,
        not derived; the OLS surrogate is descriptive; the imp-33843 log-linear-vs-power-
        law FORM verdict is UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; changes
        no bound; establishes no operator positivity; imp-3066 K_a&gt;=0 untouched; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
