import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION } from '../data/imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident.js';
import { ED } from '../styles/tokens.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

// N_peak/N_flow ratio across the imp-96187 E_trunc sensitivity sweep (0.25x..16x), plotted against
// log2(scale) so the six geometrically-spaced rungs are evenly spread, with the 1/sqrt(3) line drawn
// through the middle to show it is crossed, not approached asymptotically.
function SensitivityPanel() {
  const rows = IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION.sensitivity.ratios;
  const oneOverSqrt3 = IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION.landmarks.one_over_sqrt3;
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const xVals = rows.map((r) => Math.log2(r.etrunc_scale));
  const minX = xVals[0];
  const maxX = xVals[xVals.length - 1];
  const minY = 0.33;
  const maxY = 0.66;
  const xOf = (logScale) => padL + ((logScale - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;
  const yTicks = [0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65];

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xLabel="E_trunc scale (log2, 0.25x .. 16x)"
      yLabel="N_peak / N_flow"
    >
      <line
        x1={padL}
        y1={yOf(oneOverSqrt3)}
        x2={padL + plotW}
        y2={yOf(oneOverSqrt3)}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.7}
      />
      <text x={padL + plotW - 4} y={yOf(oneOverSqrt3) - 5} textAnchor="end" fill={ED.series2} fontSize={9}>
        1/sqrt(3) = {oneOverSqrt3.toFixed(5)} (crossing, not a fixed point)
      </text>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {rows.map((r) => (
        <text
          key={`x${r.etrunc_scale}`}
          x={xOf(Math.log2(r.etrunc_scale))}
          y={padT + plotH + 16}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={9}
        >
          {r.etrunc_scale}x
        </text>
      ))}
      <polyline
        points={rows.map((r) => `${xOf(Math.log2(r.etrunc_scale))},${yOf(r.peak_over_N_flow)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
        opacity={0.9}
      />
      {rows.map((r) => (
        <circle
          key={r.etrunc_scale}
          cx={xOf(Math.log2(r.etrunc_scale))}
          cy={yOf(r.peak_over_N_flow)}
          r={r.etrunc_scale === 1 ? 4 : 2.5}
          fill={r.etrunc_scale === 1 ? ED.brassDeco : ED.series1}
        />
      ))}
    </AxisFrame>
  );
}

export default function Imp96215UshapePeakAccidentViz() {
  const D = IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION;
  const rows = D.sensitivity.ratios;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96187: The U-Shape Peak-Ratio 1/sqrt(3) Accident" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> Measurement/derivation only, not
        rigorous. Changes no bound, establishes no operator positivity, no RH claim; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-3220 sigma U-shape peak sits at N_peak &asymp; 0.577&nbsp;N_flow, close to
        1/sqrt(3)&nbsp;=&nbsp;0.57735 (imp-96162). imp-96187 derived the exact location ratio
        N_peak/N_flow&nbsp;=&nbsp;(b/a)^(1/(a+b)) from the local log-slopes a, b of E_trunc/E_coll and
        E_flow/E_coll, and asked whether the 1/sqrt(3) proximity is forced or accidental. Scaling the
        E_trunc truncation floor from 0.25x to 16x its pinned value sweeps the measured ratio smoothly
        through 1/sqrt(3), with no plateau or fixed point at it.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        N_peak/N_flow vs E_trunc scaling: a monotone crossing, not a pinned constant
      </h3>
      <SensitivityPanel />
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the ratio falls monotonically
        from {rows[0].peak_over_N_flow.toFixed(3)} at 0.25x to {rows[rows.length - 1].peak_over_N_flow.toFixed(3)}{' '}
        at 16x (the highlighted point is the actual pinned E_trunc = 3.06e-5, scale 1x). The 1/sqrt(3)
        line is crossed somewhere in the middle of the sweep rather than approached and held, which is
        the signature of an accidental proximity rather than a derived identity.
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginTop: '1.75rem', marginBottom: '0.5rem' }}>
        Why: leading order gives exactly 1, not 1/sqrt(3)
      </h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', maxWidth: 700 }}>
        At clean leading order the two log-slopes coincide (a&nbsp;=&nbsp;b&nbsp;=&nbsp;1/2), so the
        derived formula collapses to (b/a)^(1/(a+b))&nbsp;=&nbsp;{D.landmarks.leading_order_ratio_a_eq_b.toFixed(6)}{' '}
        exactly &mdash; the peak would sit at N_flow itself. The entire 0.577 comes from the sub-leading
        log-corrections (a&nbsp;&asymp;&nbsp;{D.landmarks.slope_a_g_t}, b&nbsp;&asymp;&nbsp;{D.landmarks.slope_b_g_f}) that split a
        from b at the finite peak height, which is exactly why scaling the inherited constants moves the
        ratio away from 1/sqrt(3) instead of holding it there.
      </p>

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
        <strong style={{ color: 'var(--series-2)' }}>Verdict:</strong> {D.finding.F3_proximity_to_one_over_sqrt3_is_an_accident}
      </div>
    </div>
  );
}
