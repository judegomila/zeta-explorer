import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96739_LADDER,
  IMP96739_OLS_CROSSOVER,
  IMP96739_LSTAR_BRACKET,
  IMP96739_OLD_PROJECTION,
  IMP96739_PT_ANCHOR_L,
  IMP96739_HONEST_BANNER,
} from '../data/imp-96739-basis-c-above-anchor-ladder-lstar-crossover-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

// Log-log scatter of the imp-96690 above-anchor floor(L) ladder (five rungs),
// with vertical reference lines marking the imp-96712 L* bracket, the
// imp-96690 constant-OLS crossover baseline inside it, and the earlier
// imp-96568 two-point projection far to the right for scale contrast.
function LadderCrossoverPanel() {
  const rows = IMP96739_LADDER;
  const svgW = 760;
  const padL = 60;
  const padR = 24;
  const svgH = 340;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xs = [...rows.map((r) => r.logL), IMP96739_OLD_PROJECTION.logL];
  const ys = rows.map((r) => r.logFloor);
  const minX = Math.min(...xs) - 0.3;
  const maxX = Math.max(...xs) + 0.3;
  const minY = Math.min(...ys) - 0.6;
  const maxY = Math.max(...ys) + 0.6;

  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[Math.ceil(minY), Math.floor((minY + maxY) / 2), Math.floor(maxY)].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            1e{v}
          </text>
        </g>
      ))}

      {/* imp-96712 L* bracket band */}
      <rect
        x={xOf(IMP96739_LSTAR_BRACKET.logLo)}
        y={padT}
        width={xOf(IMP96739_LSTAR_BRACKET.logHi) - xOf(IMP96739_LSTAR_BRACKET.logLo)}
        height={plotH}
        fill={alpha(ED.brassDeco, 0.12)}
      />
      <text
        x={(xOf(IMP96739_LSTAR_BRACKET.logLo) + xOf(IMP96739_LSTAR_BRACKET.logHi)) / 2}
        y={padT + 10}
        textAnchor="middle"
        fill={ED.brass}
        fontSize={8}
      >
        L* bracket
      </text>

      {/* imp-96690 constant-OLS crossover baseline, inside the bracket */}
      <line
        x1={xOf(IMP96739_OLS_CROSSOVER.logL)}
        y1={padT}
        x2={xOf(IMP96739_OLS_CROSSOVER.logL)}
        y2={padT + plotH}
        stroke={ED.series2}
        strokeWidth={1.4}
        strokeDasharray="4 3"
      />
      <text x={xOf(IMP96739_OLS_CROSSOVER.logL) + 4} y={padT + plotH - 6} fill={ED.series2} fontSize={8}>
        OLS L*&asymp;{IMP96739_OLS_CROSSOVER.L.toExponential(2)}
      </text>

      {/* imp-96568 earlier two-point projection, far outside the bracket */}
      <line
        x1={xOf(IMP96739_OLD_PROJECTION.logL)}
        y1={padT}
        x2={xOf(IMP96739_OLD_PROJECTION.logL)}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1.2}
        strokeDasharray="1 3"
      />
      <text
        x={xOf(IMP96739_OLD_PROJECTION.logL) - 4}
        y={padT + 22}
        textAnchor="end"
        fill={ED.inkSoft}
        fontSize={8}
      >
        imp-96568 p&asymp;{IMP96739_OLD_PROJECTION.exponent.toFixed(2)} proj. L*&asymp;
        {IMP96739_OLD_PROJECTION.L.toExponential(2)}
      </text>

      {rows.map((r) => (
        <g key={`x${r.L}`}>
          <line x1={xOf(r.logL)} y1={padT + plotH} x2={xOf(r.logL)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(r.logL)} y={padT + plotH + 15} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            1e{r.logL.toFixed(1)}
          </text>
        </g>
      ))}

      <polyline
        points={rows.map((r) => `${xOf(r.logL)},${yOf(r.logFloor)}`).join(' ')}
        fill="none"
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="2 2"
      />
      {rows.map((r) => (
        <g key={`pt${r.L}`}>
          <circle cx={xOf(r.logL)} cy={yOf(r.logFloor)} r={4} fill={ED.series1} />
          <text x={xOf(r.logL) + 6} y={yOf(r.logFloor) - 6} fill={ED.series1} fontSize={8.5}>
            ppp={r.optPpp}
          </text>
        </g>
      ))}

      <text x={padL + plotW / 2} y={padT + plotH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        L (log scale)
      </text>
      <text x={16} y={padT + plotH / 2} fill={ED.inkSoft} fontSize={9} transform={`rotate(-90 16 ${padT + plotH / 2})`}>
        floor (log scale)
      </text>
    </svg>
  );
}

export default function Imp96739BasisCAboveAnchorLadderLstarCrossoverViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Basis-C Above-Anchor Floor Ladder and the L* Corroboration-Reach Crossover" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96739_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96690 extended the basis-C above-anchor floor(L) ladder to five rungs (PT anchor{' '}
        {IMP96739_PT_ANCHOR_L.toExponential(1)} through 5e7, blue points) and fit a single log-log OLS
        exponent p&asymp;2.42, bisecting the corroboration reach where floor(L)=signal(L) to L*&asymp;
        {IMP96739_OLS_CROSSOVER.L.toExponential(2)} (red dashed line). imp-96712 then modeled the
        accelerating local exponent explicitly, bracketing that crossover to{' '}
        [{IMP96739_LSTAR_BRACKET.lo.toExponential(2)}, {IMP96739_LSTAR_BRACKET.hi.toExponential(2)}]
        (yellow band) &mdash; the OLS baseline sits inside it. Both sit well below the earlier imp-96568
        two-point projection (grey dotted line, p&asymp;{IMP96739_OLD_PROJECTION.exponent.toFixed(2)}), which
        used only two ppp-pinned rungs.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        floor(L) ladder with the L* bracket and crossover baseline
      </h3>
      <LadderCrossoverPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> blue points are the five measured
        above-anchor floors (labels show the optimum panels-per-period, which collapses 3&rarr;2 above 1e7).
        The yellow band is the imp-96712 three-model L* bracket (~&plusmn;6% around the OLS baseline, all
        landing ~{IMP96739_LSTAR_BRACKET.decadesPastAnchorLo.toFixed(2)}&ndash;
        {IMP96739_LSTAR_BRACKET.decadesPastAnchorHi.toFixed(2)} decades past the PT anchor). The grey dotted
        line is the earlier, looser imp-96568 two-rung projection, shown only for scale contrast &mdash; none of
        these move the Platt-Trudgian bound.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96739 viz-data
        (ladder and crossover figures reused verbatim from imp-96690/imp-96712). {IMP96739_HONEST_BANNER}
      </div>
    </div>
  );
}
