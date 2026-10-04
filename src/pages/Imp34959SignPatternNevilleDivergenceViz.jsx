import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34932_SIGMA_KNEE_EXTENDED_ORDER_DOMB_SYKES as D } from '../data/imp-34932-sigma-knee-extended-order-domb-sykes.js';
import { ED } from '../styles/tokens.js';

const RUN_LENGTHS = D.signPattern.runLengths; // [1,5,4,5,4,5,4,2] -- interior +5/-4 repeating
const FIRST_SIGN = Math.sign(D.extendedLadder.delta_1); // delta_1 ~ -5.6522e-3 -> starts negative
const K_MAX = D.kMax; // 30

// Reconstruct the full k=1..30 sign sequence from the run-length encoding (verbatim literals,
// no new measurement) so the periodic +5/-4 cycle can be drawn bar-by-bar.
const SIGNS = [];
{
  let s = FIRST_SIGN;
  for (const len of RUN_LENGTHS) {
    for (let i = 0; i < len; i++) SIGNS.push(s);
    s = -s;
  }
}

const NEVILLE_4PT = D.dombSykesReads.neville_4pt_invR; // ~1.45e1
const NEVILLE_30PT = D.dombSykesReads.neville_full30_invR; // ~-1.52e11
const BLOWUP_RATIO = D.dombSykesReads.neville_blowupRatio_full_over_4pt; // ~1e10
const LINEAR_MEDIAN_INVR = D.dombSykesReads.linearMedian_invR; // ~1.278e-2
const LINEAR_MEDIAN_R = D.dombSykesReads.linearMedian_R; // ~78
const ARG_DEG = D.signPattern.argDegreesOffRealAxis; // ~40
const SIGN_PERIOD = D.signPattern.signPeriod_k; // ~9

// Bar chart of delta_k signs, k=1..30, colored by the interior +5/-4 run pattern.
function SignPatternChart() {
  const svgW = 720;
  const svgH = 240;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;
  const midY = padT + cH / 2;
  const barW = (cW / K_MAX) * 0.7;
  const barH = cH / 2 - 8;

  const xAt = (i) => padL + ((i + 0.5) / K_MAX) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={midY} x2={padL + cW} y2={midY} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL - 6} y={midY + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        0
      </text>
      {SIGNS.map((sgn, i) => {
        const k = i + 1;
        const color = sgn > 0 ? ED.series3 : ED.series2;
        const y = sgn > 0 ? midY - barH : midY;
        return (
          <rect
            key={k}
            x={xAt(i) - barW / 2}
            y={y}
            width={barW}
            height={barH}
            fill={color}
            opacity={0.85}
          />
        );
      })}
      {[1, 5, 10, 15, 20, 25, 30].map((k) => (
        <text key={k} x={xAt(k - 1)} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {k}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - padB + 22} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        k (delta_k index, k=1..30); green = positive, red = negative -- periodic +5/-4 interior runs
      </text>
    </svg>
  );
}

// Neville tail-window intercept: the resolvable 4-point read vs the full 30-point read, log10|1/R|
// scale, with the robust linear/median 1/R drawn as a reference line for contrast.
function NevilleDivergenceChart() {
  const svgW = 720;
  const svgH = 190;
  const padL = 190;
  const padR = 30;
  const padT = 20;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = [
    { label: 'linear/median |1/R| (robust, R~78)', v: LINEAR_MEDIAN_INVR, color: ED.series1 },
    { label: '4-pt Neville |1/R|', v: Math.abs(NEVILLE_4PT), color: ED.brass },
    { label: '30-pt Neville |1/R| (diverged)', v: Math.abs(NEVILLE_30PT), color: ED.series2 },
  ];
  const xMin = -3; // log10(1e-3)
  const xMax = 12; // log10(1e12)
  const xAt = (v) => padL + ((Math.log10(v) - xMin) / (xMax - xMin)) * cW;
  const rowH = cH / rows.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => (
        <g key={r.label}>
          <text
            x={padL - 6}
            y={padT + i * rowH + rowH / 2 + 3}
            textAnchor="end"
            fill={ED.inkSoft}
            fontSize={9}
            fontFamily="monospace"
          >
            {r.label}
          </text>
          <line
            x1={padL}
            y1={padT + i * rowH + rowH / 2}
            x2={xAt(r.v)}
            y2={padT + i * rowH + rowH / 2}
            stroke={r.color}
            strokeWidth={10}
            strokeLinecap="round"
          />
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10 scale -- the tail-window Neville read blows up ~1e10x as the window lengthens 4pt -&gt; 30pt
      </text>
    </svg>
  );
}

export default function Imp34959SignPatternNevilleDivergenceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-Knee Sign-Cycle &amp; Neville Divergence (imp-34959 / imp-34932)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        The delta_k signs are PERIODIC over the extended 30-term ladder: interior runs alternate
        +5, -4, +5, -4, +5, -4 (full cycle P &asymp; {SIGN_PERIOD} in k), the fingerprint of a
        complex-conjugate dominant singularity pair &asymp;{ARG_DEG}&deg; off the positive real axis
        rather than a single real dominant singularity.
      </p>
      <SignPatternChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Because the singularity pair is complex, a real-axis Domb-Sykes/Neville intercept cannot
        converge on the oscillatory root sequence: the tail-window Neville read WORSENS as the
        window lengthens, from |1/R| &asymp; {Math.abs(NEVILLE_4PT).toExponential(2)} at 4 points to
        |1/R| &asymp; {Math.abs(NEVILLE_30PT).toExponential(2)} at the full 30 points -- a
        &asymp;{BLOWUP_RATIO.toExponential(1)}x blow-up -- while the robust linear/median intercept
        stays pinned at 1/R &asymp; {LINEAR_MEDIAN_INVR.toExponential(3)} (R &asymp; {LINEAR_MEDIAN_R}).
      </p>
      <NevilleDivergenceChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-34932 extended-order sign-pattern and Neville-window literals verbatim (sign sequence
        reconstructed from the exported run-length encoding, no new computation). Measurement on the
        INHERITED imp-3220/imp-3406 surrogate crossover map, NOT a rigorous asymptotic; C_mb
        GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched; far-tail exponent stays
        1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
