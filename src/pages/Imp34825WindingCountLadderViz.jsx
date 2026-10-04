import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { WINDING_MONOTONICITY_RIGOR } from '../data/imp-34813-winding-monotonicity-rigor.js';
import { ED } from '../styles/tokens.js';

const DATA = WINDING_MONOTONICITY_RIGOR;
const T_GRID = DATA.tGrid; // decreasing t, +1 .. -20
const EXACT_COUNT = DATA.exactCount; // real-zero count in window [20,104]
const MIN_GAP = DATA.minGapLadder;
const FIRST_COLLISION = DATA.firstCollision; // t_c = -1.8837 for gamma_9,gamma_10

// -- dual-axis chart: exact real-zero count (step line, left axis) and minGap ladder
// (line, right axis) against de Bruijn time t, with vertical markers at every even
// count-drop (pair merger) and the imp-34813 first-collision landmark t_c = -1.8837. --
function WindingLadderChart() {
  const xs = T_GRID;
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);

  const countMin = 0;
  const countMax = Math.max(...EXACT_COUNT) + 1;
  const gapMax = Math.max(...MIN_GAP);

  const svgW = 720;
  const svgH = 380;
  const padL = 50;
  const padR = 56;
  const padT = 28;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const sx = (t) => padL + ((t - xMin) / (xMax - xMin)) * plotW;
  const syCount = (c) => padT + plotH - ((c - countMin) / (countMax - countMin)) * plotH;
  const syGap = (g) => padT + plotH - (g / gapMax) * plotH;

  const countPath = xs
    .map((t, i) => `${i === 0 ? 'M' : 'L'} ${sx(t).toFixed(2)} ${syCount(EXACT_COUNT[i]).toFixed(2)}`)
    .join(' ');
  const gapPath = xs
    .map((t, i) => `${i === 0 ? 'M' : 'L'} ${sx(t).toFixed(2)} ${syGap(MIN_GAP[i]).toFixed(2)}`)
    .join(' ');

  // Mark every index where the count drops relative to the previous rung (a pair merger).
  const mergerIndices = EXACT_COUNT.map((c, i) => (i > 0 && c < EXACT_COUNT[i - 1] ? i : -1)).filter((i) => i >= 0);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL} y={padT - 10} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Exact real-zero count and minGap ladder vs de Bruijn time t (window [20,104])
      </text>

      {/* first-collision landmark: vertical dashed line at t_c = -1.8837 */}
      <line
        x1={sx(FIRST_COLLISION.tExact)}
        x2={sx(FIRST_COLLISION.tExact)}
        y1={padT}
        y2={padT + plotH}
        stroke={ED.series7}
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />
      <text x={sx(FIRST_COLLISION.tExact) + 4} y={padT + 12} fill={ED.series7} fontSize={9}>
        t_c={FIRST_COLLISION.tExact}
      </text>

      {/* pair-merger markers: vertical ticks at every count-drop rung */}
      {mergerIndices.map((i) => (
        <line
          key={`merge-${i}`}
          x1={sx(T_GRID[i])}
          x2={sx(T_GRID[i])}
          y1={padT + plotH}
          y2={padT + plotH - 8}
          stroke={ED.brassDeco}
          strokeWidth={2}
        />
      ))}

      {/* minGap ladder (right axis) */}
      <path d={gapPath} fill="none" stroke={ED.series3} strokeWidth={1.4} strokeDasharray="3 3" />
      {xs.map((t, i) => (
        <circle key={`gap-${i}`} cx={sx(t)} cy={syGap(MIN_GAP[i])} r={2.4} fill={ED.series3} />
      ))}

      {/* exact real-zero count (left axis, step-like line) */}
      <path d={countPath} fill="none" stroke={ED.series1} strokeWidth={2} />
      {xs.map((t, i) => (
        <circle
          key={`cnt-${i}`}
          cx={sx(t)}
          cy={syCount(EXACT_COUNT[i])}
          r={mergerIndices.includes(i) ? 4.6 : 3.4}
          fill={mergerIndices.includes(i) ? ED.brassDeco : ED.series1}
          stroke={ED.paper}
          strokeWidth={0.6}
        />
      ))}

      {/* left axis ticks (count) */}
      {[0, 2, 4, 6, 8, 10].map((c) => (
        <text key={`ylbl-${c}`} x={padL - 8} y={syCount(c) + 3} textAnchor="end" fill={ED.series1} fontSize={9}>
          {c}
        </text>
      ))}
      {/* right axis ticks (minGap) */}
      {[0, gapMax / 2, gapMax].map((g, i) => (
        <text key={`gylbl-${i}`} x={padL + plotW + 8} y={syGap(g) + 3} fill={ED.series3} fontSize={9}>
          {g.toFixed(1)}
        </text>
      ))}

      {/* x-axis labels */}
      {xs.map((t, i) => (
        <text key={`xlbl-${i}`} x={sx(t)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {t}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
        de Bruijn time t (decreasing &rarr;)
      </text>

      {/* legend */}
      <rect x={padL + 12} y={padT + 8} width={12} height={2.5} fill={ED.series1} />
      <text x={padL + 30} y={padT + 13} fill={ED.series1} fontSize={9.5}>
        exact real-zero count (left)
      </text>
      <rect x={padL + 12} y={padT + 24} width={12} height={2.5} fill={ED.series3} />
      <text x={padL + 30} y={padT + 29} fill={ED.series3} fontSize={9.5}>
        minGap ladder (right)
      </text>
      <circle cx={padL + 18} cy={padT + 40} r={4.6} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={0.6} />
      <text x={padL + 30} y={padT + 44} fill={ED.brass} fontSize={9.5}>
        pair-merger rung (count drop)
      </text>
    </svg>
  );
}

export default function Imp34825WindingCountLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Exact de Bruijn Winding Count Ladder (imp-34825 / imp-34813)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34813 solved the exact de Bruijn family H_t on the window gamma&nbsp;&isin;&nbsp;[10,52]
        (x&nbsp;&isin;&nbsp;[20,104], 10 zeros at t=0) across a t-grid spanning +1 down to -20, tabulating
        the real-zero count and the minimum window gap at each rung. Every count drop
        (10&rarr;8&rarr;6&rarr;4&rarr;2) is even &mdash; a pure conjugate-pair merger, no boundary flux in
        this range &mdash; and the first such merger (the tightest pair, gamma_9&nbsp;=&nbsp;48.005,
        gamma_10&nbsp;=&nbsp;49.774) lands at the exact collision time t_c&nbsp;=
        &nbsp;{FIRST_COLLISION.tExact}, retarded relative to the isolated two-body prediction t_2b&nbsp;=
        &nbsp;{FIRST_COLLISION.tTwoBody} by the many-body neighbour interaction.
      </p>

      <WindingLadderChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>t</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>exact count</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>minGap</th>
          </tr>
        </thead>
        <tbody>
          {T_GRID.map((t, i) => {
            const isMerger = i > 0 && EXACT_COUNT[i] < EXACT_COUNT[i - 1];
            return (
              <tr
                key={t}
                style={{
                  borderBottom: '1px solid var(--rule-soft)',
                  color: isMerger ? 'var(--brass)' : 'var(--ink)',
                }}
              >
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{t}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{EXACT_COUNT[i]}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{MIN_GAP[i].toFixed(3)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        First-collision pair: {FIRST_COLLISION.pair}. Exact t_c&nbsp;=&nbsp;{FIRST_COLLISION.tExact} vs
        two-body t_2b&nbsp;=&nbsp;{FIRST_COLLISION.tTwoBody} (tau_repo&nbsp;&asymp;
        &nbsp;{FIRST_COLLISION.tauRepoUnits}). {FIRST_COLLISION.reconciles}.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-34813
        tGrid/exactCount/minGapLadder literals verbatim (no new computation). Negative t is the EXACT
        de Bruijn flow at negative time, equal to Gaussian convolution of H_0 with width
        sqrt(2&nbsp;tau) at t&nbsp;=&nbsp;-4&nbsp;tau_repo &mdash; the imp-2673/2696 "smoothing artifact"
        claim was a time-orientation error, not a numerical one; the monotonicity itself is classical
        (de Bruijn 1950 Thm&nbsp;13 + jet lemma), not a new theorem. Establishes no new bound: the lower
        side is hard-capped (Lambda&nbsp;&gt;&nbsp;0 iff RH false) and the upper side re-derives the
        existing Platt-Trudgian Lambda&nbsp;&le;&nbsp;0.2 architecture. NO QED.
      </div>
    </div>
  );
}
