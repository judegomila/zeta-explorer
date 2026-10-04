import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34651_Q2_Q4_SHARE_ROUNDOFF_VALLEY_SPREAD } from '../data/imp-34651-q2-q4-share-roundoff-valley-spread.js';
import { ED } from '../styles/tokens.js';

const M = IMP34651_Q2_Q4_SHARE_ROUNDOFF_VALLEY_SPREAD;

const CHANNEL_ROWS = [
  {
    label: 'q2 (2nd difference)',
    fullSpread: M.q2_full_tail_spread,
    flatSpread: M.q2_flat_tail_spread,
    collapse: M.q2_collapse_factor,
    dpAtMax: M.q2_dp_at_max_deviation,
  },
  {
    label: 'q3 (3rd difference)',
    fullSpread: M.q3_full_tail_spread,
    flatSpread: M.q3_flat_tail_spread,
    collapse: M.q3_collapse_factor,
    dpAtMax: M.q3_dp_at_max_deviation,
  },
  {
    label: 'q4 (4th difference)',
    fullSpread: M.q4_full_tail_spread,
    flatSpread: M.q4_flat_tail_spread,
    collapse: M.q4_collapse_factor,
    dpAtMax: M.q4_dp_at_max_deviation,
  },
];

// Log-scale grouped bars: full-tail spread (includes the small-dp roundoff valley) vs the
// flat-tail spread (dp >= 3e-2, past the valley), per channel. All three channels show the same
// qualitative signature -- a large full-tail bar collapsing to a much smaller flat-tail bar --
// even though the absolute spreads span five orders of magnitude (q2 ~1e-6 .. q4 ~1e-2).
function SpreadCollapseChart() {
  const svgW = 680;
  const svgH = 300;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const allVals = CHANNEL_ROWS.flatMap((r) => [r.fullSpread, r.flatSpread]);
  const yMin = Math.log10(Math.min(...allVals)) - 0.3;
  const yMax = Math.log10(Math.max(...allVals)) + 0.3;
  const yAt = (v) => padT + cH - ((Math.log10(v) - yMin) / (yMax - yMin)) * cH;

  const groupW = cW / CHANNEL_ROWS.length;
  const barW = groupW * 0.3;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {CHANNEL_ROWS.map((r, i) => {
        const groupCx = padL + groupW * (i + 0.5);
        const fullX = groupCx - barW - 4;
        const flatX = groupCx + 4;
        const fullY = yAt(r.fullSpread);
        const flatY = yAt(r.flatSpread);
        return (
          <g key={r.label}>
            <rect x={fullX} y={fullY} width={barW} height={padT + cH - fullY} fill={ED.series2} opacity={0.85} />
            <text x={fullX + barW / 2} y={fullY - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
              {r.fullSpread.toExponential(2)}
            </text>
            <rect x={flatX} y={flatY} width={barW} height={padT + cH - flatY} fill={ED.series3} opacity={0.85} />
            <text x={flatX + barW / 2} y={flatY - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
              {r.flatSpread.toExponential(2)}
            </text>
            <text x={groupCx} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
              {r.label}
            </text>
            <text x={groupCx} y={svgH - padB + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              {r.collapse}x collapse
            </text>
          </g>
        );
      })}

      <text x={padL - 8} y={padT - 8} textAnchor="end" fill={ED.series2} fontSize={9.5}>
        full-tail (dp&nbsp;=&nbsp;1.5e-2..3e-1)
      </text>
      <text x={padL + 170} y={padT - 8} textAnchor="start" fill={ED.series3} fontSize={9.5}>
        flat-tail (dp&nbsp;&ge;&nbsp;3e-2)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 16 ${padT + cH / 2})`}>
        deep-vs-mid drift spread (log scale)
      </text>
    </svg>
  );
}

// Collapse-factor ladder: q2 < q3 < q4, monotone in the finite-difference order of the share.
function CollapseLadderChart() {
  const svgW = 680;
  const svgH = 200;
  const padL = 60;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const maxY = Math.max(...CHANNEL_ROWS.map((r) => r.collapse)) * 1.15;
  const groupW = cW / CHANNEL_ROWS.length;
  const barW = groupW * 0.4;
  const yAt = (v) => padT + cH - (v / maxY) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {CHANNEL_ROWS.map((r, i) => {
        const cx = padL + groupW * (i + 0.5);
        const y = yAt(r.collapse);
        return (
          <g key={r.label}>
            <rect x={cx - barW / 2} y={y} width={barW} height={padT + cH - y} fill={ED.series5} opacity={0.85} />
            <text x={cx} y={y - 8} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
              {r.collapse}x
            </text>
            <text x={cx} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
              {r.label}
            </text>
          </g>
        );
      })}
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 16 ${padT + cH / 2})`}>
        collapse factor
      </text>
    </svg>
  );
}

export default function Imp34680ThreeTermShareSpreadRoundoffValleyViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Three-Term q2/q3/q4 Share-Spread Roundoff Valley (imp-34680 / imp-34651)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34630 showed the q3-share&apos;s reported large-dp drift spread was actually a small-dp
        roundoff-valley artifact, not genuine truncation. imp-34651 extended that test to the full
        3-term partition (q2, q3, q4): every channel&apos;s deep-vs-mid drift spread peaks at the
        smallest step dp&nbsp;=&nbsp;{M.q2_dp_at_max_deviation}, and collapses once the small-dp
        valley is dropped (dp&nbsp;&ge;&nbsp;3e-2) &mdash; with no share left carrying a resolvable
        large-dp truncation drift.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        full-tail vs flat-tail drift spread per channel (log scale): every channel collapses
        &ge;5x once the two smallest steps are dropped
      </p>
      <SpreadCollapseChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        collapse factor by channel: monotone q2 &lt; q3 &lt; q4, ordered by finite-difference order
      </p>
      <CollapseLadderChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>channel</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>full-tail spread</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>flat-tail spread</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>collapse factor</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dp at max deviation</th>
          </tr>
        </thead>
        <tbody>
          {CHANNEL_ROWS.map((r) => (
            <tr key={r.label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{r.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.fullSpread.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.flatSpread.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.collapse}x</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.dpAtMax.toExponential(2)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Finding:</strong> all three shares of the natural
        3-term partition share_qk&nbsp;=&nbsp;C_qk/(C_q2&nbsp;+&nbsp;C_q3&nbsp;+&nbsp;C_q4) are
        small-dp roundoff-valley dominated, not large-dp truncation drift: q2 collapses{' '}
        {M.q2_collapse_factor}x ({M.q2_full_tail_spread.toExponential(2)}&nbsp;&rarr;&nbsp;
        {M.q2_flat_tail_spread.toExponential(2)}), q3 collapses {M.q3_collapse_factor}x ({M.q3_full_tail_spread.toExponential(2)}&nbsp;&rarr;&nbsp;{M.q3_flat_tail_spread.toExponential(2)}),
        and q4 &mdash; the least well-conditioned channel &mdash; collapses {M.q4_collapse_factor}x
        ({M.q4_full_tail_spread.toExponential(2)}&nbsp;&rarr;&nbsp;{M.q4_flat_tail_spread.toExponential(2)}).
        The collapse factor orders the channels by finite-difference conditioning
        (q2&nbsp;&lt;&nbsp;q3&nbsp;&lt;&nbsp;q4), the same 1/dp^k ladder imp-34633/imp-34646
        measured.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, reusing the
        imp-34651 exported literals verbatim (per-channel full-tail/flat-tail spreads, collapse
        factors, dp-at-max-deviation). q1..q4 are inherited central differences, NOT fresh
        analytic closed forms, so the sigma&nbsp;-&gt;&nbsp;1 deep-tail regime (imp-3220/imp-3406
        component model least trustworthy) is inherited as-is &mdash; this diagnoses
        finite-difference conditioning, it does not rehabilitate the model. The -2 asymptote and
        C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi) (imp-2714) ansatz are UNTOUCHED; C_mb GUE-conditional
        per imp-486 UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; no
        operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
