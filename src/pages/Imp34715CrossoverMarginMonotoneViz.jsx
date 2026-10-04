import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34686_CROSSOVER_CONTRACTION_MARGIN_MONOTONE_PROOF } from '../data/imp-34686-crossover-contraction-margin-monotone-proof.js';
import { ED, alpha } from '../styles/tokens.js';

const DATA = IMP34686_CROSSOVER_CONTRACTION_MARGIN_MONOTONE_PROOF;
const TABLE = DATA.marginTable;
const N_STAR = DATA.anchors.N_star;
const N_CROSS = DATA.anchors.N_cross;

const svgW = 680;
const svgH = 320;
const padL = 66;
const padR = 24;
const padT = 24;
const padB = 46;
const cW = svgW - padL - padR;
const cH = svgH - padT - padB;

const minLogN = Math.log10(N_STAR) - 0.4;
const maxLogN = Math.log10(TABLE[TABLE.length - 1].N) + 6;
const xAt = (N) => padL + ((Math.log10(N) - minLogN) / (maxLogN - minLogN)) * cW;

// Signed-log transform so the margin (which spans -2.1e9 up to 1e300) fits a single bounded axis
// while preserving the sign change at N_cross.
function signedLog(m) {
  const s = m > 0 ? 1 : m < 0 ? -1 : 0;
  return s * Math.log10(1 + Math.abs(m));
}

function MarginSignChart() {
  const vals = TABLE.map((r) => signedLog(r.margin_m));
  const minY = Math.min(...vals) - 1;
  const maxY = Math.max(...vals) + 1;
  const yAt = (v) => padT + cH - ((v - minY) / (maxY - minY)) * cH;
  const zeroY = yAt(0);
  const nStarX = xAt(N_STAR);
  const nCrossX = xAt(N_CROSS);
  const linePoints = TABLE.map((r) => `${xAt(r.N)},${yAt(signedLog(r.margin_m))}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* Strict-increase region: N > N_cross, where the monotone-margin argument forces m(N) > 0. */}
      <rect
        x={nCrossX}
        y={padT}
        width={Math.max(0, padL + cW - nCrossX)}
        height={cH}
        fill={alpha(ED.series3, 0.07)}
      />

      <line x1={padL} y1={zeroY} x2={padL + cW} y2={zeroY} stroke={ED.rule} strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + 4} y={zeroY - 6} fill={ED.inkSoft} fontSize={9.5}>
        m = 0
      </text>

      <line x1={nStarX} y1={padT} x2={nStarX} y2={padT + cH} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="3,3" />
      <text x={nStarX + 4} y={padT + 12} fill={ED.brass} fontSize={9}>
        N_star &asymp; {N_STAR.toExponential(2)} (g_prime crosses 1)
      </text>

      <line x1={nCrossX} y1={padT} x2={nCrossX} y2={padT + cH} stroke={ED.series7} strokeWidth={1.25} />
      <text x={nCrossX + 4} y={padT + 26} fill={ED.series7} fontSize={9}>
        N_cross &asymp; {N_CROSS.toExponential(4)} (fixed point, m = 0)
      </text>

      <polyline points={linePoints} fill="none" stroke={ED.series1} strokeWidth={1.75} />
      {TABLE.map((r) => (
        <circle
          key={r.N}
          cx={xAt(r.N)}
          cy={yAt(signedLog(r.margin_m))}
          r={4}
          fill={r.margin_m > 0 ? ED.series3 : ED.series2}
          stroke={ED.paper}
          strokeWidth={0.75}
        />
      ))}

      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        sign(m)&middot;log&#8321;&#8320;(1+|m|)
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (log scale, N_star &hellip; 1e300) &mdash; shaded: N &gt; N_cross, where m(N) &gt; 0 by strict monotonicity
      </text>
    </svg>
  );
}

export default function Imp34715CrossoverMarginMonotoneViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Monotone Margin m(N) = N &minus; g(N) Across the Crossover (imp-34686)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34676 verified the crossover self-map endpoint g(N) &le; N only by SAMPLING g on a
        b-ladder. imp-34686 replaces that with an analytic argument: the margin
        m(N) = N &minus; g(N) has derivative m&prime;(N) = 1 &minus; g&prime;(N), strictly positive
        for every N &gt; N_star &asymp; {N_STAR.toExponential(3)} (the closed-form left edge where
        g&prime; crosses 1, imp-34675). So m is strictly increasing on [N_star, &infin;), and since
        N_cross &asymp; {N_CROSS.toExponential(4)} is the unique fixed point (m(N_cross) = 0,
        imp-33723), strict monotonicity forces m(N) &gt; 0 &mdash; i.e. g(N) &lt; N &mdash; for ALL
        N &gt; N_cross, with no sampling.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Signed margin vs N, straddling the fixed point at N_cross
      </p>
      <MarginSignChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>g(N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>m(N) = N &minus; g(N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>m&prime;(N) = 1 &minus; g&prime;(N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>above N_cross</th>
          </tr>
        </thead>
        <tbody>
          {TABLE.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.g_of_N}</td>
              <td
                style={{
                  padding: '0.4rem 0.6rem',
                  fontFamily: 'monospace',
                  color: r.margin_m > 0 ? 'var(--series-3)' : r.margin_m < 0 ? 'var(--series-2)' : 'var(--ink-soft)',
                }}
              >
                {r.margin_m}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.margin_prime}</td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{r.above_N_cross ? 'yes' : 'no'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem' }}>
        m&prime;(N) &gt; 0 at every sampled N &gt; N_star, so m climbs monotonically through its zero
        at N_cross: negative below the fixed point (the sampled upper self-map endpoint fails there),
        exactly zero at N_cross, and strictly positive for every N above it out to 1e300 &mdash; the
        shaded region where g(N) &lt; N is now a consequence of monotonicity, not a grid check.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> visualization of an existing
        derivation/measurement, isRigorous false. The inputs g&prime;(N) &lt; 1 for N &gt; N_star and
        g&prime; strictly decreasing are still IEEE-754 double precision, not interval-arithmetic
        enclosures (named sub-gap imp-34686a remains open). Certifies a property of the inherited
        imp-3220/imp-3406 surrogate crossover map; C_C = (1/8)&radic;(3&pi;) 1/8 ansatz
        (imp-2642/imp-2643) and the C_mb GUE-conditional share per imp-486 are UNTOUCHED; imp-3066
        K_a &ge; 0 untouched; changes no bound; no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
