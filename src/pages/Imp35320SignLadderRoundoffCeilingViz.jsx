import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35113_CROSSOVER_DERIV_SIGN_LADDER_FINITE_DIFFERENCE as R,
} from '../data/imp-35113-crossover-deriv-sign-ladder-finite-difference.js';
import { ED, alpha } from '../styles/tokens.js';

// Baked literals imported verbatim from the imp-35113 data module; no new
// computation is performed here (viz/UX only).
const LARGEST_RESOLVED_N = R.largestResolvedN; // 4
const FIRST_UNRESOLVED_N = R.firstUnresolvedN; // 5
const FIRST_UNRESOLVED_FLIPS = R.firstUnresolvedSignFlips; // true
const MAG = R.representativeMagnitudesAtCross; // { g1..g5, N, relStep, note }

function orderStatus(n) {
  if (n <= LARGEST_RESOLVED_N) return { label: 'resolved', color: ED.series3 };
  if (n === FIRST_UNRESOLVED_N) return { label: FIRST_UNRESOLVED_FLIPS ? 'flips' : 'unresolved', color: ED.brass };
  return { label: 'round-off', color: ED.inkFaint };
}

function SignLadderRow() {
  const orders = [1, 2, 3, 4, 5, 6];
  const cardW = 108;
  const gap = 10;
  const svgW = orders.length * cardW + (orders.length - 1) * gap;
  const svgH = 128;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {orders.map((n, i) => {
        const x = i * (cardW + gap);
        const st = orderStatus(n);
        const analyticSign = n % 2 === 1 ? '+' : '−';
        return (
          <g key={n} transform={`translate(${x}, 0)`}>
            <rect
              x={0}
              y={0}
              width={cardW}
              height={svgH}
              rx={6}
              fill={`${st.color}1f`}
              stroke={st.color}
              strokeWidth={1.5}
            />
            <text x={cardW / 2} y={26} textAnchor="middle" fill={st.color} fontSize={16} fontWeight={700} fontFamily="monospace">
              n={n}
            </text>
            <text x={cardW / 2} y={54} textAnchor="middle" fill={ED.inkSoft} fontSize={22} fontFamily="monospace">
              {n <= LARGEST_RESOLVED_N ? analyticSign : '?'}
            </text>
            <text x={cardW / 2} y={78} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              analytic {analyticSign}
            </text>
            <rect x={8} y={svgH - 34} width={cardW - 16} height={24} rx={4} fill={alpha(ED.paper2, 0.5)} stroke={st.color} strokeWidth={1} />
            <text x={cardW / 2} y={svgH - 17} textAnchor="middle" fill={st.color} fontSize={9.5} fontWeight={700}>
              {st.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function MagnitudeBars() {
  const mags = [Math.abs(MAG.g1), Math.abs(MAG.g2), Math.abs(MAG.g3), Math.abs(MAG.g4), Math.abs(MAG.g5)];
  const logs = mags.map((m) => Math.log10(m));
  const maxLog = Math.max(...logs);
  const minLog = Math.min(...logs);
  const span = maxLog - minLog || 1;
  const barW = 64;
  const gap = 18;
  const chartH = 180;
  const svgW = mags.length * barW + (mags.length - 1) * gap;
  const svgH = chartH + 50;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {mags.map((m, i) => {
        const h = ((logs[i] - minLog) / span) * (chartH - 20) + 20;
        const x = i * (barW + gap);
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x={0} y={chartH - h} width={barW} height={h} rx={3} fill={alpha(ED.series1, 0.35)} stroke={ED.series1} strokeWidth={1} />
            <text x={barW / 2} y={chartH - h - 8} textAnchor="middle" fill={ED.series1} fontSize={9} fontFamily="monospace">
              {m.toExponential(2)}
            </text>
            <text x={barW / 2} y={chartH + 20} textAnchor="middle" fill={ED.inkSoft} fontSize={11} fontWeight={700}>
              |g^({i + 1})|
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp35320SignLadderRoundoffCeilingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <PageHeader title="Sign-Ladder Round-off Ceiling: Recovered Sign vs Order (imp-35320)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35113 cross-checked the analytic derivative-sign ladder sign(g^(n)) = (-1)^(n+1) of the
        inherited surrogate crossover map g = K log T0(N) by Richardson-extrapolated central finite
        differences. The recovered sign matches the analytic ladder robustly through n* = {LARGEST_RESOLVED_N},
        becomes step-dependent (flips across the step bracket) at n = {FIRST_UNRESOLVED_N}, and is
        round-off dominated for every larger order the module examined. This page renders that ladder
        alongside the geometric collapse of the derivative magnitudes that causes it.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Recovered sign by order</h3>
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <SignLadderRow />
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Derivative-magnitude collapse at N_cross &asymp; {MAG.N.toExponential(2)} (log scale)
      </h3>
      <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
        <MagnitudeBars />
      </div>

      <div
        style={{
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page reusing the imp-35113
        resolvedTable / firstUnresolvedN / firstUnresolvedSignFlips / representativeMagnitudesAtCross
        literals verbatim (no new computation). This is a numerical-differentiation reach limit, not a
        sign change: the analytic ladder holds for ALL n by the imp-34880 coefficient-positivity
        induction (re-verified exactly to n=22 by imp-35107). MEASUREMENT ONLY on the inherited
        imp-3220/imp-3406 surrogate map; C_mb GUE-conditional per imp-486; establishes no operator
        positivity; changes no bound; no RH verdict, NO QED.
      </div>
    </div>
  );
}
