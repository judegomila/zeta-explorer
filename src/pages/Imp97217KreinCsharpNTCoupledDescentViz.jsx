import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97183_N_LADDER_T800,
  IMP97183_T_SWEEP_N100,
  IMP97183_VERDICT,
} from '../data/imp-97183-krein-csharp-extprec-ladder.js';
import { ED } from '../styles/tokens.js';

// imp-97217: first viz page for the imp-97183 extended-precision c_sharp ladder.
// Two panels on the same lambda_min axis show the coupled-truncation picture:
// the fixed-T=800 N-ladder keeps descending past the double-precision wall,
// while a T-sweep at N=100 rises back up -- the two truncations push
// lambda_min in opposite directions, so neither alone signals a zero-crossing.
function NLadderPanel() {
  const rows = IMP97183_N_LADDER_T800;
  const svgW = 720;
  const padL = 48;
  const padR = 20;
  const svgH = 260;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const ns = rows.map((r) => r.N);
  const vals = rows.map((r) => r.lamMin);
  const minX = Math.min(...ns);
  const maxX = Math.max(...ns);
  const minY = 0.45;
  const maxY = 0.65;

  const xOf = (n) => padL + ((n - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[0.45, 0.5, 0.55, 0.6, 0.65].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {ns.map((n, i) => (i % 2 === 0 ? (
        <text key={`x${n}`} x={xOf(n)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {n}
        </text>
      ) : null))}
      <polyline
        points={ns.map((n, i) => `${xOf(n)},${yOf(vals[i])}`).join(' ')}
        fill="none"
        stroke={ED.series2}
        strokeWidth={1.9}
      />
      {ns.map((n, i) => (
        <circle key={`p${n}`} cx={xOf(n)} cy={yOf(vals[i])} r={2.4} fill={ED.series2} />
      ))}
      {/* mark the double-precision condB~1e16 wall at N=100 */}
      <line
        x1={xOf(100)}
        y1={padT}
        x2={xOf(100)}
        y2={padT + plotH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      <text x={xOf(100) + 4} y={padT + 10} fill={ED.brass} fontSize={8}>
        double-precision wall (N=100)
      </text>
      <text x={padL + plotW / 2} y={padT + plotH + 30} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        N (fixed T=800, dps=50) -- descending, still moving at N=132
      </text>
    </svg>
  );
}

function TSweepPanel() {
  const rows = IMP97183_T_SWEEP_N100;
  const svgW = 720;
  const padL = 48;
  const padR = 20;
  const svgH = 260;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const ts = rows.map((r) => r.T);
  const vals = rows.map((r) => r.lamMin);
  const minX = Math.min(...ts);
  const maxX = Math.max(...ts);
  const minY = 0.45;
  const maxY = 0.65;

  const xOf = (t) => padL + ((t - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[0.45, 0.5, 0.55, 0.6, 0.65].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {ts.map((t) => (
        <text key={`x${t}`} x={xOf(t)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {t}
        </text>
      ))}
      <polyline
        points={ts.map((t, i) => `${xOf(t)},${yOf(vals[i])}`).join(' ')}
        fill="none"
        stroke={ED.series3}
        strokeWidth={1.9}
      />
      {ts.map((t, i) => (
        <circle key={`p${t}`} cx={xOf(t)} cy={yOf(vals[i])} r={2.4} fill={ED.series3} />
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 30} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        T-cutoff (fixed N=100) -- rising, leveling toward ~0.58
      </text>
    </svg>
  );
}

export default function Imp97217KreinCsharpNTCoupledDescentViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I Krein c_sharp: Coupled N/T Descent Ladder and T-Sweep" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> measurement only.
        Rayleigh-Ritz floors are UPPER bounds on the true infinite-dimensional c_sharp; no
        operator positivity established; interval-rigorous certificate reach stays 2a&le;
        {IMP97183_VERDICT.intervalRigorousReachUnchanged}; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97183 pushed the extended-precision (dps=50) c_sharp = lambda_min(P_a M_sigma2 P_a)
        floor at 2a=ln3 past the double-precision Gram-conditioning wall. At fixed t-cutoff
        T=800 the floor keeps descending as N grows, with no stabilisation by N=132. But a
        T-sweep at fixed N=100 shows the floor rises as T grows, leveling toward ~0.58. The
        two truncations push lambda_min in <strong>opposite</strong> directions, so the
        fixed-T descent alone is largely a t-truncation artifact, not evidence of a
        zero-crossing.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Finding 1 -- fixed T=800: descends, no stabilisation
      </h3>
      <NLadderPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Finding 2 -- fixed N=100: rises with T, leveling near ~0.58
      </h3>
      <TSweepPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> the still-moving
        bracket ~[0.50, 0.58] is consistent with a positive limit near ~0.58 but does not
        converge in either N or T alone, and no zero-crossing is observed or approached.
        Deciding positivity needs a single bound controlling both truncations together
        (sub-gap IMP97183_CSHARP_LIMIT_NEEDS_COUPLED_NT_LOWER_BOUND).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-97183 data module directly (every value reused verbatim, no recomputation).
        Changes no bound, establishes no operator positivity; Platt-Trudgian Lambda&le;0.2
        remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
