import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95647_ROWS,
  IMP95647_DELTA_STAR,
  IMP95647_TWO_SAMPLED_POINTS,
  IMP95647_SUMMARY,
} from '../data/imp-95647-condition-number-viz-data.js';
import { ED } from '../styles/tokens.js';

const ROWS = IMP95647_ROWS;

// Semilog-y chart: log10(relative error) vs delta, for both the measured alternating-form
// error and the kappa(delta)*EPS predictor, with the 1 percent line and delta* marked.
function ConditionNumberChart() {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xMin = ROWS[0].delta;
  const xMax = ROWS[ROWS.length - 1].delta;
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  const log10 = (v) => Math.log10(Math.max(v, 1e-300));
  const yMax = Math.ceil(Math.max(...ROWS.map((r) => log10(r.predictedRelErr))) + 0.5);
  const yMin = Math.floor(Math.min(...ROWS.map((r) => log10(r.measuredRelErr))) - 0.5);
  const yOf = (logV) => padT + ((yMax - logV) / (yMax - yMin)) * plotH;

  const predictedPath = ROWS.map(
    (r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.delta)} ${yOf(log10(r.predictedRelErr))}`,
  ).join(' ');
  const measuredPath = ROWS.map(
    (r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.delta)} ${yOf(log10(r.measuredRelErr))}`,
  ).join(' ');

  const onePercentY = yOf(log10(0.01));
  const deltaStarX = xOf(IMP95647_DELTA_STAR.analytic);

  const yTicks = [];
  for (let t = yMax; t >= yMin; t -= Math.max(1, Math.round((yMax - yMin) / 6))) yTicks.push(t);
  const xTicks = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7].filter((v) => v >= xMin && v <= xMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <line key={`gy${t}`} x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}

      {/* delta* threshold marker */}
      <line x1={deltaStarX} y1={padT} x2={deltaStarX} y2={padT + plotH} stroke={ED.series2} strokeWidth={1.5} strokeDasharray="3 3" />
      <text x={deltaStarX + 4} y={padT + 10} fill={ED.series2} fontSize={9.5}>
        delta* &asymp; {IMP95647_DELTA_STAR.analytic.toFixed(4)}
      </text>

      {/* 1 percent horizontal line */}
      <line x1={padL} y1={onePercentY} x2={padL + plotW} y2={onePercentY} stroke={ED.rule} strokeWidth={1} strokeDasharray="4 4" />
      <text x={padL + plotW - 4} y={onePercentY - 5} textAnchor="end" fill={ED.inkSoft} fontSize={9}>
        1% error
      </text>

      <path d={predictedPath} fill="none" stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="2 3" />
      <path d={measuredPath} fill="none" stroke={ED.series1} strokeWidth={2} />

      {xTicks.map((v) => (
        <text key={`tx${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
          {v}
        </text>
      ))}
      {yTicks.map((t) => (
        <text key={`ty${t}`} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          1e{t}
        </text>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        delta
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        relative error (log scale)
      </text>
    </svg>
  );
}

export default function Imp95647ConditionNumberViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Alternating-Form Condition Number kappa(delta) vs the delta* Float Trap (imp-95621)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a
        measurement/presentation-only page re-plotting the frozen imp-95621
        condition-number threshold derivation (no re-derivation, no new claim).
        It changes no bound and proves no RH-relevant theorem. Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains state of the art. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The alternating class-optimal off-lattice Riesz floor form A_opt(&delta;)&nbsp;=&nbsp;
        &sum;<sub>n</sub> (-1)<sup>n</sup> sech(n&delta;/2) sums O(1)-sized alternating terms that cancel down to
        an exponentially small value &sim; (4&pi;/&delta;) e<sup>-&pi;&sup2;/&delta;</sup>. The summation
        condition number &kappa;(&delta;)&nbsp;=&nbsp;(&sum;|term|)/|A<sub>opt</sub>|&nbsp;&sim;&nbsp;
        (1/2) e<sup>&pi;&sup2;/&delta;</sup> sets the alternating form&apos;s relative error at double
        precision to &sim;&nbsp;&kappa;(&delta;)&nbsp;&middot;&nbsp;EPS. The chart below tracks the measured
        error (solid blue, against the stable theta-dual reference) and the &kappa;&middot;EPS predictor
        (dashed gold) against &delta;, crossing the 1&nbsp;percent line (dashed gray) at
        &delta;*&nbsp;&asymp;&nbsp;{IMP95647_DELTA_STAR.analytic.toFixed(4)} (ratio r&nbsp;&asymp;&nbsp;
        {IMP95647_DELTA_STAR.ratioAnalytic.toFixed(4)}, marked red): below it the alternating form is
        trapped by cancellation, above it it is clean.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Relative error vs delta (log scale)
      </h3>
      <ConditionNumberChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>point</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>delta</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>measured rel. error</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>verdict</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>ln 1.3</td>
            <td style={{ textAlign: 'right' }}>{IMP95647_TWO_SAMPLED_POINTS.ln13.delta.toFixed(5)}</td>
            <td style={{ textAlign: 'right' }}>{IMP95647_TWO_SAMPLED_POINTS.ln13.measuredRelErr.toExponential(3)}</td>
            <td style={{ textAlign: 'right', color: 'var(--series-2)' }}>{IMP95647_TWO_SAMPLED_POINTS.ln13.verdict}</td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>delta* (threshold)</td>
            <td style={{ textAlign: 'right' }}>{IMP95647_DELTA_STAR.analytic.toFixed(5)}</td>
            <td style={{ textAlign: 'right' }}>{IMP95647_DELTA_STAR.measuredRelErrAtStar.toExponential(3)}</td>
            <td style={{ textAlign: 'right', color: 'var(--ink-soft)' }}>&asymp;1%</td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>ln 2</td>
            <td style={{ textAlign: 'right' }}>{IMP95647_TWO_SAMPLED_POINTS.ln2.delta.toFixed(5)}</td>
            <td style={{ textAlign: 'right' }}>{IMP95647_TWO_SAMPLED_POINTS.ln2.measuredRelErr.toExponential(3)}</td>
            <td style={{ textAlign: 'right', color: 'var(--series-3)' }}>{IMP95647_TWO_SAMPLED_POINTS.ln2.verdict}</td>
          </tr>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page
        rendering the frozen imp-95621 condition-number threshold derivation (no
        re-derivation). Supplies no off-lattice floor theorem, changes no
        bound, establishes no operator positivity, no RH claim;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
