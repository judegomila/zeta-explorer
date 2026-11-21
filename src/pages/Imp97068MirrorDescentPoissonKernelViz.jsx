import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97068_KERNEL_SERIES,
  IMP97068_PAIR_LEMMA_CURVE,
  IMP97068_POISSON_DOMINATION_LIMIT,
} from '../data/imp-97068-mirror-descent-poisson-kernel-viz-data.js';
import { IMP97141_ASSESSMENT } from '../data/imp-97141-euler-product-flow-continuity-bridge-assessment.js';
import { ED } from '../styles/tokens.js';

// imp-97068: rh-bridge-mirror-descent-2026-09-25 proved the pair (mirror) lemma A1 -- a nonreal
// neighbour no higher than a nonreal zero z = x + iy pulls z down by at least
// f(2y, Delta) = 2y/(Delta^2 + 4y^2) per zero -- but shipped with no visualization. This page
// renders the descent-kernel floor as a function of horizontal offset Delta, and the pair-lemma
// inequality itself (the sum never dips below its floor), so the proved geometric mechanism is
// legible next to the conditional flow-descent theorem it feeds.

function LineChart({ series, xLabel, yLabel, floor, floorLabel }) {
  const svgW = 640;
  const svgH = 280;
  const padL = 54;
  const padR = 20;
  const padT = 16;
  const padB = 42;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const allX = series.flatMap((s) => s.points.map((p) => p.x));
  const allY = series.flatMap((s) => s.points.map((p) => p.y)).concat(floor !== undefined ? [floor] : []);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = 0;
  const maxY = Math.max(...allY) * 1.08;
  const spanY = maxY - minY || 1;

  const xOf = (x) => padL + ((x - minX) / (maxX - minX || 1)) * plotW;
  const yOf = (y) => padT + plotH - ((y - minY) / spanY) * plotH;

  const xTicks = Array.from({ length: 6 }, (_, i) => minX + (i / 5) * (maxX - minX));
  const yTicks = Array.from({ length: 5 }, (_, i) => minY + (i / 4) * spanY);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {floor !== undefined && (
        <g>
          <line
            x1={padL}
            y1={yOf(floor)}
            x2={padL + plotW}
            y2={yOf(floor)}
            stroke={ED.series2}
            strokeWidth={1.2}
            strokeDasharray="4,3"
          />
          <text x={padL + plotW - 4} y={yOf(floor) - 5} textAnchor="end" fill={ED.series2} fontSize={8}>
            {floorLabel}
          </text>
        </g>
      )}
      {series.map((s) => (
        <g key={s.label}>
          <polyline
            points={s.points.map((p) => `${xOf(p.x)},${yOf(p.y)}`).join(' ')}
            fill="none"
            stroke={s.color}
            strokeWidth={1.9}
          />
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        {xLabel}
      </text>
      <text x={12} y={padT + 8} fill={ED.inkSoft} fontSize={9}>
        {yLabel}
      </text>
    </svg>
  );
}

function Legend({ series }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
      {series.map((s) => (
        <span key={s.label} style={{ color: s.color }}>
          &#9632; {s.label}
        </span>
      ))}
    </div>
  );
}

export default function Imp97068MirrorDescentPoissonKernelViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Mirror-Descent Pair Lemma: the Poisson-Kernel Descent Floor" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> the pair lemma (A1) and
        Poisson domination (A4) below are <strong>PROVED</strong>, elementary facts. The
        flow-descent theorem they feed (H_desc-mirror &rArr; &Lambda; &le; t0 + y0&sup2;/2) stays{' '}
        <strong>CONDITIONAL</strong> -- its hypothesis is open and, below y = 1/2, a pointwise
        statement at &sigma; &lt; 1 (NS-RIGID class). No new &Lambda; bound follows here;
        no refereed bound is changed. RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        A nonreal neighbour no higher than a nonreal zero z = x + iy pulls z down by at least{' '}
        <code>f(2y, &Delta;) = 2y / (&Delta;&sup2; + 4y&sup2;)</code> per zero (half-weight
        Poisson kernel at double width). The chart below shows this descent-kernel floor as a
        function of the horizontal offset &Delta;, at the three tabulated heights: the seam
        y0&nbsp;=&nbsp;0.165, y&nbsp;=&nbsp;0.5, and y&nbsp;=&nbsp;1.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Descent-kernel floor f(2y, &Delta;) vs horizontal offset &Delta;
      </h3>
      <LineChart
        series={IMP97068_KERNEL_SERIES}
        xLabel="Delta (horizontal offset)"
        yLabel="f(2y, Delta)"
      />
      <Legend series={IMP97068_KERNEL_SERIES} />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', margin: '1.5rem 0 1rem', maxWidth: 700 }}>
        The pair lemma (A1) says more than the floor value: for <em>every</em> split a + b = 2y
        (a, b &ge; 0), the two-term sum f(a, &Delta;) + f(b, &Delta;) never dips below f(2y,
        &Delta;), with equality only at the endpoints (a neighbour at the same height as the
        zero). The chart below fixes y&nbsp;=&nbsp;{IMP97068_PAIR_LEMMA_CURVE.y} and
        &Delta;&nbsp;=&nbsp;{IMP97068_PAIR_LEMMA_CURVE.D} and sweeps a across [0, 2y].
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Pair-lemma inequality: f(a) + f(2y&minus;a) vs its floor f(2y)
      </h3>
      <LineChart
        series={[{ label: 'f(a) + f(2y-a)', color: ED.series1, points: IMP97068_PAIR_LEMMA_CURVE.points }]}
        xLabel="a (in [0, 2y])"
        yLabel="sum"
        floor={IMP97068_PAIR_LEMMA_CURVE.floor}
        floorLabel={`floor = f(2y) = ${IMP97068_PAIR_LEMMA_CURVE.floor.toFixed(3)}`}
      />

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
        <strong style={{ color: 'var(--ink-soft)' }}>A4 Poisson domination:</strong>{' '}
        {IMP97068_POISSON_DOMINATION_LIMIT.note} The best constant is exactly{' '}
        {IMP97068_POISSON_DOMINATION_LIMIT.bestConstant} at &eta; = 2y, but this value is a{' '}
        <strong>limit, never attained</strong>.
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>imp-97141 bridge no-go:</strong> theorem B1 (the
        flow-descent statement above) needs a uniform lower bound M &ge; p_req&nbsp;=&nbsp;
        {IMP97141_ASSESSMENT.pReq.toFixed(3)} over the whole continuum t &isin; (0, t0]. The
        arithmetic Euler product available at t&nbsp;=&nbsp;0 cannot bridge that: it sits at the{' '}
        <strong>non-binding maximum</strong> of a flow-decreasing quantity (the de Bruijn flow
        only spreads the spacing for t &gt; 0), while the bound must bind at the far endpoint
        t0 where no Euler product exists. Worse, the t&nbsp;=&nbsp;0 count itself, M(0)&nbsp;=
        &nbsp;{IMP97141_ASSESSMENT.countT0.toFixed(4)}, is already{' '}
        {IMP97141_ASSESSMENT.finding2.supShortfall.toFixed(2)}x short of p_req, so the entire
        flow trajectory lies below p_req regardless of endpoint. Assessment only; no &Lambda;
        bound follows; no refereed bound is changed; RH open; NO QED.
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
        imp-97068 viz-data leaf (every value computed with the imported f() verbatim, no
        re-derivation). Changes no bound, establishes no operator positivity; RH open; NO QED.
      </div>
    </div>
  );
}
