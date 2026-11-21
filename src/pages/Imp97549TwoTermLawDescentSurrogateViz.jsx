import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97549_SERIES,
  IMP97549_TARGET_LINE,
} from '../data/imp-97549-two-term-law-descent-surrogate-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97549: visualizes the imp-97500 two-term law
// surrogate([P0,Y]) = L(P0) + A(P0)/log Y for several min-primes P0 vs
// log Y, overlaid with the exact -1/4-R(1) crossing threshold and the
// baked exact crossing points where each curve first dips below it.

const COLORS = {
  2: ED.series8,
  101: ED.series1,
  379: ED.series3,
  1009: ED.series4,
  10007: ED.series7,
};
const COLOR_TARGET = ED.series2;

function DescentPanel() {
  const svgW = 720;
  const svgH = 380;
  const padL = 66;
  const padR = 20;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const allValues = IMP97549_SERIES.flatMap((s) => s.curve.map((pt) => pt.value));
  const xMin = Math.min(...IMP97549_SERIES.map((s) => s.curve[0].logY));
  const xMax = Math.max(...IMP97549_SERIES.map((s) => s.curve[s.curve.length - 1].logY));
  const yMax = Math.max(...allValues) + 0.05;
  const yMin = Math.min(IMP97549_TARGET_LINE.value, ...allValues) - 0.05;

  const xOf = (logY) => padL + ((logY - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* -1/4-R(1) crossing threshold */}
      <line
        x1={padL}
        y1={yOf(IMP97549_TARGET_LINE.value)}
        x2={padL + plotW}
        y2={yOf(IMP97549_TARGET_LINE.value)}
        stroke={COLOR_TARGET}
        strokeWidth={1.4}
        strokeDasharray="5,4"
      />
      <text x={padL + plotW - 4} y={yOf(IMP97549_TARGET_LINE.value) - 5} textAnchor="end" fill={COLOR_TARGET} fontSize={9}>
        {IMP97549_TARGET_LINE.label} = {IMP97549_TARGET_LINE.value.toFixed(6)}
      </text>

      {/* per-P0 two-term-law curves */}
      {IMP97549_SERIES.map((s) => (
        <polyline
          key={`curve-${s.P0}`}
          points={s.curve.map((pt) => `${xOf(pt.logY)},${yOf(pt.value)}`).join(' ')}
          fill="none"
          stroke={COLORS[s.P0] || ED.rule}
          strokeWidth={1.8}
        />
      ))}

      {/* baked exact crossing markers */}
      {IMP97549_SERIES.filter((s) => s.crossing && s.crossing.crossY != null).map((s) => {
        const logY = Math.log(s.crossing.crossY);
        const value = s.L + s.A / logY;
        return (
          <circle
            key={`cross-${s.P0}`}
            cx={xOf(logY)}
            cy={yOf(value)}
            r={4.5}
            fill={COLORS[s.P0] || '#94a3b8'}
            stroke={ED.paper}
            strokeWidth={1}
          />
        );
      })}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[3, 4, 5, 6, 7, 8, 9].map((exp) => (
        <text key={`xt${exp}`} x={xOf(exp * Math.LN10)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          1e{exp}
        </text>
      ))}
      {[0.5, 0, -0.25, -0.5, -0.75].map((v) => (
        <text key={`yv${v}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
          {v.toFixed(2)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        Y (log scale) &mdash; surrogate([P0,Y]) = L(P0) + A(P0)/log Y
      </text>
    </svg>
  );
}

export default function Imp97549TwoTermLawDescentSurrogateViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97500: Two-Term-Law Descent Surrogate vs log Y" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-1) 6%, transparent)',
          borderLeft: '3px solid var(--series-1)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-1)' }}>Honest status:</strong> every
        curve below is the imp-97500 two-term law evaluated verbatim from
        the baked descent-rate table; every marker is a baked exact
        crossing point. Measurement only &mdash; no operator positivity, no
        bound moves; the b/4-ceiling was already REFUTED (imp-97481) and is
        a dead route; kappa_arith unchanged; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97500 measured that the imp-97481 window-set surrogate
        approaches its exact Mertens limit L(P0) purely logarithmically:
        surrogate([P0,Y]) = L(P0) + A(P0)/log Y, with gap*log Y flat to
        ~5 significant figures across five orders of Y. The chart below
        plots this two-term law for P0 in {'{2, 101, 379, 1009, 10007}'}
        against log Y, with the exact -1/4-R(1) = -0.251246 threshold
        (surrogate below this forces T(b) &lt; -1/4) and the baked exact
        crossing witnesses (P0=379 at Y=73,612,801, P0=1009 at
        Y=42,333,157, P0=10007 at Y=75,415,303).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        surrogate([P0,Y]) = L(P0) + A(P0)/log Y vs log Y, several P0
      </h3>
      <DescentPanel />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem' }}>
        {IMP97549_SERIES.map((s) => (
          <div key={`legend-${s.P0}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
            <span style={{ width: 12, height: 3, background: COLORS[s.P0] || '#94a3b8', display: 'inline-block' }} />
            P0={s.P0} (A={s.A}, L={s.L})
          </div>
        ))}
      </div>

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem', maxWidth: 700 }}>
        P0=2 and P0=101 never dip below the threshold within the charted
        window (P0=101 stays in the Rosser-Schoenfeld effective-Mertens
        regime, crossing only past Y~2.63e9). The two-term law reproduces
        the exact finite-sieve crossing Y for P0=379, 1009, and 10007 to
        within the imp-97500 cross-check tolerance, confirming the purely
        logarithmic (1/log Y) descent.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation
        only, consuming the imp-97500 two-term law and baked crossings
        verbatim. Establishes no operator positivity; changes no bound; the
        b/4-ceiling lower edge is a dead route; kappa_arith unchanged; RH open; NO QED.
      </div>
    </div>
  );
}
