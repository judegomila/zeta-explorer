import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34752_KRAWCZYK_OUTWARD_ULP_SLACK_N } from '../data/imp-34752-krawczyk-outward-ulp-slack-N.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP34752_KRAWCZYK_OUTWARD_ULP_SLACK_N;
const M = DATA.measurement;
const N_LADDER = M.N_ladder; // [1e9, 2e9, 3.28e9, 5e9, 1e10]
const MARGIN_LO = M.margin_lo_nominal; // grows ~9x, 7.4374e4 .. 6.5871e5
const K_STAR = M.k_star; // ~4.5034e11 at every rung
const CROSSOVER_N = M.crossover_N; // 3.28e9

// -- two stacked panels sharing an x-axis of log10(N): top shows the k*(N) budget as a FLAT line,
// bottom shows the nominal inclusion margin RISING ~9x, illustrating the delta/(2 eps) scale
// invariance (both scale with |value|, but the budget's relative widening cancels N out). --
function SlackLadderChart() {
  const xs = N_LADDER.map((n) => Math.log10(n));
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);

  const svgW = 680;
  const panelH = 150;
  const gap = 26;
  const padL = 62;
  const padR = 24;
  const padT = 16;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const svgH = padT + panelH + gap + panelH + padB;

  const sx = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;

  // top panel: k*(N), forced to a tight band around the constant value so the flatness is visible.
  const kMid = K_STAR.reduce((a, b) => a + b, 0) / K_STAR.length;
  const kLo = kMid * 0.9995;
  const kHi = kMid * 1.0005;
  const syK = (v) => padT + panelH - ((v - kLo) / (kHi - kLo)) * panelH;

  // bottom panel: margin, log scale over its own ~9x range.
  const mLogs = MARGIN_LO.map((v) => Math.log10(v));
  const mMin = Math.min(...mLogs);
  const mMax = Math.max(...mLogs);
  const panelTopB = padT + panelH + gap;
  const syM = (v) => panelTopB + panelH - ((Math.log10(v) - mMin) / (mMax - mMin)) * panelH;

  const kPath = N_LADDER.map((n, i) => `${i === 0 ? 'M' : 'L'} ${sx(xs[i]).toFixed(2)} ${syK(K_STAR[i]).toFixed(2)}`).join(' ');
  const mPath = N_LADDER.map((n, i) => `${i === 0 ? 'M' : 'L'} ${sx(xs[i]).toFixed(2)} ${syM(MARGIN_LO[i]).toFixed(2)}`).join(' ');

  const crossoverIdx = N_LADDER.findIndex((n) => Math.abs(n - CROSSOVER_N) / CROSSOVER_N < 0.01);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* top panel: k*(N), essentially flat */}
      <rect x={padL} y={padT} width={plotW} height={panelH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL} y={padT - 4} fill={ED.series1} fontSize={11} fontWeight={700}>
        k*(N): outward-ULP budget (flat)
      </text>
      <path d={kPath} fill="none" stroke={ED.series1} strokeWidth={1.5} />
      {N_LADDER.map((n, i) => (
        <circle key={`k-${n}`} cx={sx(xs[i])} cy={syK(K_STAR[i])} r={3.6} fill={i === crossoverIdx ? ED.brassDeco : ED.series1} stroke={ED.paper} strokeWidth={0.5} />
      ))}
      <text x={padL + 6} y={padT + 16} fill={ED.inkFaint} fontSize={9}>
        ~{(kMid / 1e11).toFixed(4)}e11 ULP at every rung (relative widening ~delta/2)
      </text>

      {/* bottom panel: nominal margin, rising ~9x */}
      <rect x={padL} y={panelTopB} width={plotW} height={panelH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL} y={panelTopB - 4} fill={ED.series2} fontSize={11} fontWeight={700}>
        strict-inclusion margin N_lo &minus; T_lo (rising ~9x)
      </text>
      <path d={mPath} fill="none" stroke={ED.series2} strokeWidth={1.5} />
      {N_LADDER.map((n, i) => (
        <circle key={`m-${n}`} cx={sx(xs[i])} cy={syM(MARGIN_LO[i])} r={3.6} fill={i === crossoverIdx ? ED.brassDeco : ED.series2} stroke={ED.paper} strokeWidth={0.5} />
      ))}

      {/* shared x labels along the bottom */}
      {N_LADDER.map((n, i) => (
        <text key={`lbl-${n}`} x={sx(xs[i])} y={svgH - 8} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {n.toExponential(2).replace('+', '')}
        </text>
      ))}
    </svg>
  );
}

export default function Imp34784KrawczykOutwardUlpSlackNViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Krawczyk Outward-ULP Slack vs N (imp-34784 / imp-34752)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34752 recomputed the imp-34726 outward-ULP Krawczyk budget k* &mdash; the largest relative
        widening under which (H1) 0&nbsp;&notin;&nbsp;[f&prime;] and (H2) N([T])&nbsp;&sube;&nbsp;int([T])
        both survive &mdash; across the imp-3444 crossover ladder N&nbsp;=&nbsp;1e9&hellip;1e10 (yellow
        marker: the crossover rung N&nbsp;~&nbsp;3.28e9). The top panel plots k*(N): it is a flat line at
        ~4.5034e11 ULP everywhere. The bottom panel plots the nominal strict-inclusion margin over the same
        ladder: it climbs ~9&times; alongside T0(N). Both quantities scale with |value|, so the break
        condition 2k&middot;eps&nbsp;~&nbsp;delta cancels N out of k* while leaving the absolute margin to
        grow with it &mdash; the flat top panel and the rising bottom panel are the same scale invariance
        seen from its two sides.
      </p>

      <SlackLadderChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>margin_lo (N_lo &minus; T_lo)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>k*(N) (ULP)</th>
          </tr>
        </thead>
        <tbody>
          {N_LADDER.map((n, i) => (
            <tr
              key={n}
              style={{
                borderBottom: '1px solid var(--rule-soft)',
                color: i === crossoverIndexSafe(N_LADDER, CROSSOVER_N) ? 'var(--brass)' : 'var(--ink)',
              }}
            >
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{n.toExponential(2)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{MARGIN_LO[i].toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{K_STAR[i].toExponential(4)}</td>
            </tr>
          ))}
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
        Relative spread of k*(N) across the whole ladder: {M.k_star_relative_spread.toExponential(4)}
        &nbsp;(essentially zero) &mdash; while the margin grows from {MARGIN_LO[0].toExponential(4)} to{' '}
        {MARGIN_LO[MARGIN_LO.length - 1].toExponential(4)}, about {(MARGIN_LO[MARGIN_LO.length - 1] / MARGIN_LO[0]).toFixed(1)}&times;.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-34752
        table (imported literals, no new computation); establishes no new numerical claim. Double-precision
        surrogate for the imp-34687a directed-rounding layer; does NOT close the imp-34714a machine
        certificate, which REMAINS OPEN. Inherited imp-3220/imp-3406 surrogate crossover map; C_C&nbsp;=
        &nbsp;(1/8)&radic;(3&pi;) (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 untouched;
        imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; establishes no operator positivity; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}

function crossoverIndexSafe(ladder, crossoverN) {
  return ladder.findIndex((n) => Math.abs(n - crossoverN) / crossoverN < 0.01);
}
