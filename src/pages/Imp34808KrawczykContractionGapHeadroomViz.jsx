import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34774_KRAWCZYK_FIXED_POINT_MAP_ENCLOSURE } from '../data/imp-34774-krawczyk-fixed-point-map-enclosure.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP34774_KRAWCZYK_FIXED_POINT_MAP_ENCLOSURE;
const M = DATA.measurement;
const K_STAR = M.k_star; // ~4.5034e11 -- the binding (H1 AND H2) budget
const K_STAR_H1 = M.k_star_H1_only; // ~4.5036e15 -- the (H1)-alone budget, ~4 orders higher
const F_PRIME_RANGE = M.F_prime_range; // ~[0.954568, 0.954586]
const CONTRACTION_GAP = DATA.constants.contraction_gap; // ~0.954577

// -- top panel: log-scale bars contrasting the binding k* against the (H1)-alone k*_H1, making the
// ~4-order head-room visually obvious. bottom panel: [F_prime] plotted against 0, showing the (H1)
// margin IS the contraction gap 1 - |g_prime|. --
function HeadroomChart() {
  const svgW = 680;
  const barPanelH = 160;
  const gap = 30;
  const linePanelH = 90;
  const padL = 70;
  const padR = 24;
  const padT = 20;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const svgH = padT + barPanelH + gap + linePanelH + padB;

  const logKStar = Math.log10(K_STAR);
  const logKStarH1 = Math.log10(K_STAR_H1);
  const logMin = Math.floor(logKStar) - 0.5;
  const logMax = Math.ceil(logKStarH1) + 0.5;
  const barW = 140;
  const barGapX = 220;
  const x1 = padL + 90;
  const x2 = x1 + barGapX;

  const syBar = (logV) => padT + barPanelH - ((logV - logMin) / (logMax - logMin)) * barPanelH;

  const h1 = syBar(logKStar);
  const h2 = syBar(logKStarH1);

  // bottom panel: number line from 0 to just above F_prime range, showing the (H1) gap from zero.
  const lineTop = padT + barPanelH + gap;
  const lineMax = F_PRIME_RANGE[1] * 1.15;
  const sxLine = (v) => padL + (v / lineMax) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* top panel: k* vs k*_H1 log-scale bars */}
      <rect x={padL} y={padT} width={plotW} height={barPanelH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL} y={padT - 6} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Outward-ULP budget k* (log10 scale) &mdash; binding (H2) vs (H1)-alone head-room
      </text>

      <rect x={x1 - barW / 2} y={h1} width={barW} height={padT + barPanelH - h1} fill={ED.series2} opacity={0.85} />
      <text x={x1} y={h1 - 8} textAnchor="middle" fill={ED.series2} fontSize={11} fontWeight={700}>
        k* &asymp; {K_STAR.toExponential(3)}
      </text>
      <text x={x1} y={padT + barPanelH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
        binding (H1 AND H2)
      </text>

      <rect x={x2 - barW / 2} y={h2} width={barW} height={padT + barPanelH - h2} fill={ED.series1} opacity={0.85} />
      <text x={x2} y={h2 - 8} textAnchor="middle" fill={ED.series1} fontSize={11} fontWeight={700}>
        k*_H1 &asymp; {K_STAR_H1.toExponential(3)}
      </text>
      <text x={x2} y={padT + barPanelH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
        (H1) alone (~1/eps)
      </text>

      <text x={(x1 + x2) / 2} y={padT + barPanelH / 2} textAnchor="middle" fill={ED.brass} fontSize={11} fontWeight={700}>
        ~{M.H1_headroom_orders_over_binding.toFixed(2)} orders
      </text>

      {/* bottom panel: [F_prime] margin from 0 == contraction gap */}
      <text x={padL} y={lineTop - 6} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        [F&prime;] range vs 0 &mdash; the (H1) margin IS the contraction gap 1&nbsp;&minus;&nbsp;|g&prime;|
      </text>
      <line x1={padL} y1={lineTop + linePanelH / 2} x2={padL + plotW} y2={lineTop + linePanelH / 2} stroke={ED.rule} strokeWidth={1} />
      <circle cx={sxLine(0)} cy={lineTop + linePanelH / 2} r={4} fill="#64748b" />
      <text x={sxLine(0)} y={lineTop + linePanelH / 2 + 20} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        0
      </text>
      <rect
        x={sxLine(F_PRIME_RANGE[0])}
        y={lineTop + linePanelH / 2 - 10}
        width={sxLine(F_PRIME_RANGE[1]) - sxLine(F_PRIME_RANGE[0]) || 1.5}
        height={20}
        fill={ED.series3}
        opacity={0.9}
      />
      <text x={sxLine(CONTRACTION_GAP)} y={lineTop + linePanelH / 2 - 16} textAnchor="middle" fill={ED.series3} fontSize={10} fontWeight={700}>
        [F&prime;] &asymp; [{F_PRIME_RANGE[0]}, {F_PRIME_RANGE[1]}]
      </text>
      <line
        x1={sxLine(0)}
        y1={lineTop + linePanelH / 2}
        x2={sxLine(F_PRIME_RANGE[0])}
        y2={lineTop + linePanelH / 2}
        stroke={ED.brassDeco}
        strokeWidth={2}
        strokeDasharray="4 3"
      />
      <text x={sxLine(0) + 10} y={lineTop + linePanelH / 2 + 20} textAnchor="start" fill={ED.brass} fontSize={9}>
        gap &asymp; {CONTRACTION_GAP} = 1 &minus; |g&prime;(N_cross)|
      </text>
    </svg>
  );
}

export default function Imp34808KrawczykContractionGapHeadroomViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Krawczyk Contraction-Gap Head-Room (imp-34808 / imp-34774)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34774 assessed a Krawczyk enclosure of the crossover fixed point N_cross by applying the
        outward-ULP operator to the residual F(N)&nbsp;=&nbsp;N&nbsp;&minus;&nbsp;g(N) of the Banach map
        g(N)&nbsp;=&nbsp;K&nbsp;log&nbsp;T0(N). Unlike a generic root, (H1)&nbsp;0&nbsp;&notin;&nbsp;[F&prime;]
        here is a structural consequence of the Banach contraction: F&prime;&nbsp;=&nbsp;1&nbsp;&minus;&nbsp;g&prime;
        is bounded away from 0 by the contraction gap 1&nbsp;&minus;&nbsp;|g&prime;(N_cross)|&nbsp;&asymp;&nbsp;0.955.
        The top panel contrasts the binding outward-ULP budget k*&nbsp;(where both (H1) and (H2) survive)
        against the (H1)-alone budget k*_H1&nbsp;&asymp;&nbsp;1/eps: it sits ~{M.H1_headroom_orders_over_binding.toFixed(1)}
        {' '}orders above k*, so (H2) &mdash; not (H1) &mdash; is what actually binds. The bottom panel shows
        [F&prime;] sitting far from 0, exactly at the contraction-gap distance.
      </p>

      <HeadroomChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>quantity</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>value</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['g_prime(N_cross) [closed form]', DATA.constants.g_prime_at_N_cross_closed],
            ['contraction gap 1 - |g_prime|', CONTRACTION_GAP],
            ['[F_prime] range', `[${F_PRIME_RANGE[0]}, ${F_PRIME_RANGE[1]}]`],
            ['k* (H1 and H2, binding)', K_STAR.toExponential(4)],
            ['k*_H1 (H1 alone)', K_STAR_H1.toExponential(4)],
            ['H1 head-room over binding k*', `~${M.H1_headroom_orders_over_binding.toFixed(2)} orders`],
          ].map(([label, value]) => (
            <tr key={label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{value}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-34774
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
