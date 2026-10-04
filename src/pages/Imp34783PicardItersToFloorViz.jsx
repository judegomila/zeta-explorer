import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34755_TWO_ROUTE_RESIDUAL_ACROSS_N } from '../data/imp-34755-two-route-residual-across-N.js';
import { ED, alpha } from '../styles/tokens.js';

const DATA = IMP34755_TWO_ROUTE_RESIDUAL_ACROSS_N;
const TABLE = DATA.table;
const [MIN_DECADE, MAX_DECADE] = DATA.summary.iters_to_floor_decade_grid_range; // [12, 13]
const MAX_ITERS = DATA.summary.max_iters_to_floor_across_grid; // 14

// -- iters-to-floor vs seed decade: x = seed_exponent (2..12, then the far seeds 50, 300 compressed onto
// the same axis by rank rather than raw exponent, so the plateau and the far-seed rise are both visible),
// y = Picard iterates needed to reach bit-identical agreement with the fixed point. --
function ItersToFloorChart() {
  const rows = TABLE;
  const xs = rows.map((_, i) => i); // rank position along the grid, not raw exponent (50/300 would dwarf 2..12)
  const xMax = xs[xs.length - 1];

  const svgW = 680;
  const svgH = 300;
  const padL = 48;
  const padR = 24;
  const padT = 20;
  const padB = 56;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const yMin = 10;
  const yMax = 16;
  const sx = (i) => padL + (i / xMax) * plotW;
  const sy = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const path = rows
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${sx(i).toFixed(2)} ${sy(r.iters_to_floor).toFixed(2)}`)
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={11}>
        seed (decade grid 1e2..1e12, then far seeds 1e50, 1e300)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={11}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        Picard iterates to floor
      </text>

      {/* the flat 12-13 plateau band across the decade grid */}
      <rect
        x={padL}
        y={sy(MAX_DECADE)}
        width={plotW}
        height={sy(MIN_DECADE) - sy(MAX_DECADE)}
        fill={alpha(ED.series1, 0.08)}
      />
      <text x={padL + 6} y={sy(MAX_DECADE) - 6} fill={ED.series1} fontSize={11}>
        flat {MIN_DECADE}-{MAX_DECADE} plateau (seeds 1e2..1e12)
      </text>

      <path d={path} fill="none" stroke={ED.series2} strokeWidth={1.5} />
      {rows.map((r, i) => (
        <circle
          key={r.seed_exponent}
          cx={sx(i)}
          cy={sy(r.iters_to_floor)}
          r={3.6}
          fill={r.seed_exponent > 12 ? ED.brassDeco : ED.series2}
          stroke={ED.paper}
          strokeWidth={0.5}
        />
      ))}

      {rows.map((r, i) => (
        <text
          key={`lbl-${r.seed_exponent}`}
          x={sx(i)}
          y={svgH - padB + 16}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={9}
        >
          1e{r.seed_exponent}
        </text>
      ))}
    </svg>
  );
}

export default function Imp34783PicardItersToFloorViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Picard Iters-to-Floor vs Seed Decade (imp-34783 / imp-34755)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34755 tabulated the two-route (closed-form vs Picard) bit-agreement residual for the
        N_cross&nbsp;~&nbsp;3.280294e9 crossover across the imp-3220 decade grid of seeds
        {' '}1e2&hellip;1e12 plus two far seeds 1e50 and 1e300, and recorded not just the residual (exactly
        0 everywhere) but the Picard iterate count needed to reach the machine-epsilon floor from each seed.
        The chart below plots that count. It is a flat {MIN_DECADE}-{MAX_DECADE} iterates across the entire
        decade grid, rising only to {MAX_ITERS} at the two extreme far seeds &mdash; the map
        g(N)&nbsp;=&nbsp;K&nbsp;log&nbsp;T0(N) collapses any seed into the same bounded log-region in a
        single iterate, after which the contraction |g&prime;(N_cross)|&nbsp;~&nbsp;0.045 removes
        ~1.35 decimal digits per step.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Iterates to reach the double-precision floor, by seed
      </p>
      <ItersToFloorChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>seed</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>iters to floor</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>bit-identical to N_cross</th>
          </tr>
        </thead>
        <tbody>
          {TABLE.map((r) => (
            <tr key={r.seed_exponent} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>1e{r.seed_exponent}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.iters_to_floor}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{String(r.bit_identical)}</td>
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
        The plateau never grows across ten decades of seed (1e2&hellip;1e12), then rises by exactly one
        iterate over the next ~290 decades (to the far seeds 1e50, 1e300). The growth is doubly-logarithmic
        in the seed, which is why the count can never diverge in practice.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-34755
        seed-range table (imported literals, no new computation); establishes no new numerical claim. Two
        inherited routes on the imp-3220/imp-3406 surrogate map, IEEE-754 double precision, no interval
        enclosure (compare the imp-34693a sub-gap). C_C&nbsp;=&nbsp;(1/8)&radic;(3&pi;) (imp-2642/imp-2643)
        and C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no
        bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
