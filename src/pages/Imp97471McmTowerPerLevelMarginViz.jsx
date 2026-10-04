import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP97471_LADDERS } from '../data/imp-97471-mcm-tower-per-level-margin-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97471: visualizes the imp-97442 MCM tower per-level margin at
// omega=5,6: the LEVEL-1 base term (~1.4e-6, largest x) is where the
// smallness lives, while the TOP induction term T(b) (level=omega, x=1)
// stays four orders of magnitude away from zero -- the tower is small at
// its base, not where the MCM induction actually rides.

function LevelBarPanel({ ladder }) {
  const svgW = 640;
  const svgH = 200;
  const padL = 90;
  const padR = 24;
  const padT = 18;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const values = ladder.points.map((p) => p.minDiff);
  const logMin = Math.log10(Math.min(...values));
  const logMax = Math.log10(Math.max(...values));
  const lo = logMin - 0.5;
  const hi = logMax + 0.5;

  const barGap = 14;
  const barW = (plotW - barGap * (ladder.points.length - 1)) / ladder.points.length;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - lo) / (hi - lo)) * plotH;

  return (
    <div style={{ marginBottom: '1rem' }}>
      <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
        <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

        {/* log-scale y ticks (decades) */}
        {Array.from({ length: Math.floor(hi) - Math.ceil(lo) + 1 }, (_, i) => Math.ceil(lo) + i).map((dec) => (
          <g key={`y${dec}`}>
            <line x1={padL - 4} y1={yOf(10 ** dec)} x2={padL + plotW} y2={yOf(10 ** dec)} stroke={ED.ruleSoft} strokeWidth={1} />
            <text x={padL - 8} y={yOf(10 ** dec) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
              1e{dec}
            </text>
          </g>
        ))}

        {ladder.points.map((p, i) => {
          const x = padL + i * (barW + barGap);
          const y = yOf(p.minDiff);
          const h = padT + plotH - y;
          const color = p.isBase ? ED.series2 : p.isTop ? ED.series3 : ED.inkFaint;
          return (
            <g key={p.level}>
              <rect x={x} y={y} width={barW} height={h} fill={color} opacity={0.85} />
              <text x={x + barW / 2} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
                L{p.level}
              </text>
              <text x={x + barW / 2} y={y - 5} textAnchor="middle" fill={ED.ink} fontSize={8}>
                {p.minDiff.toExponential(2)}
              </text>
            </g>
          );
        })}

        <text x={padL} y={padT - 4} fill={ED.ink} fontSize={10} fontWeight="bold">
          omega = {ladder.omega} per-level minimum tower difference (log scale)
        </text>
      </svg>
      <div style={{ paddingLeft: padL, fontSize: '0.72rem', color: 'var(--ink-faint)' }}>
        <span style={{ color: 'var(--series-2)' }}>red = level 1 base</span> (h(x)-h(2x) at large x) &mdash;{' '}
        <span style={{ color: 'var(--series-3)' }}>green = top induction term T(b)</span> (level = omega, x = 1) &mdash; gap{' '}
        {ladder.ordersOfMagnitudeGap.toFixed(2)} orders of magnitude.
      </div>
    </div>
  );
}

export default function Imp97471McmTowerPerLevelMarginViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97442: The MCM Tower Per-Level Margin at omega=5,6" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> measurement
        only. MCM (non-negativity of every iterated multiplicative difference
        of h = g/m) is VERIFIED, not proved, on the omega=5,6 squarefree
        classes in (2e5, 1e6]. This chart establishes no operator positivity
        and moves no bound. MCM is FALSE from omega=11 (imp-97432); PT
        Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Each panel bars the minimum difference found at every level of the
        iterated multiplicative-difference tower (log scale), for one omega.
        The minimum keeps shrinking level by level as x grows toward the top
        of the window &mdash; but the LAST bar (level = omega, x = 1, i.e.
        T(b)) is the one the MCM induction actually depends on, and it sits
        four orders of magnitude above the tiny level-1 base term. The
        smallness at the base is a slope artifact of h flattening at large x,
        not a sign that the induction is close to failing.
      </p>

      {IMP97471_LADDERS.map((ladder) => (
        <LevelBarPanel key={ladder.omega} ladder={ladder} />
      ))}

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page
        consuming the imp-97442 per-level minima verbatim; no re-solve.
        Establishes no operator positivity; changes no bound; the margin
        narrows only at high omega (MCM refuted first at omega=11, imp-97432);
        PT Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
