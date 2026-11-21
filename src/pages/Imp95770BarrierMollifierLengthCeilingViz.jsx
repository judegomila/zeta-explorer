import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  LAMBDA_CEIL_CURVE,
  THRESHOLD_0145,
  THRESHOLD_014,
  CURRENT_HEIGHT_POINT,
  IMP95770_SUMMARY,
} from '../data/imp-95770-barrier-mollifier-length-ceiling-viz-data.js';
import { ED } from '../styles/tokens.js';

// Chart: Lambda_ceil(X) vs log10(X), the fixed-height Wiener-algebra ceiling of the
// barrier/y-transfer mollifier-length certificate at four verified-height rungs
// (N0, 1.5e6, 2.0e6, 6.0e6), with the current verified-height point and the 0.145 /
// 0.14 target thresholds marked.
function LambdaCeilChart() {
  const svgW = 700;
  const padL = 56;
  const padR = 20;
  const padT = 22;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const logX = (x) => Math.log10(x);
  const xVals = LAMBDA_CEIL_CURVE.map((p) => logX(p.X));
  const xMin = Math.min(...xVals) - 0.15;
  const xMax = Math.max(...xVals) + 0.15;
  const yMin = 0.125;
  const yMax = 0.16;

  const xOf = (x) => padL + ((logX(x) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + ((yMax - v) / (yMax - yMin)) * plotH;

  const xTicks = [13, 13.5, 14, 14.5].filter((v) => v >= xMin && v <= xMax);
  const yTicks = [0.13, 0.135, 0.14, 0.145, 0.15, 0.155, 0.16];

  const path = LAMBDA_CEIL_CURVE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.X)} ${yOf(p.lambdaCeil)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <line key={`gy${t}`} x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}

      {/* 0.145 / 0.14 target threshold lines */}
      <line x1={padL} y1={yOf(0.145)} x2={padL + plotW} y2={yOf(0.145)} stroke={ED.brassDeco} strokeDasharray="4,3" strokeWidth={1.25} />
      <text x={padL + plotW - 2} y={yOf(0.145) - 4} textAnchor="end" fill={ED.brass} fontSize={9}>0.145 target</text>
      <line x1={padL} y1={yOf(0.14)} x2={padL + plotW} y2={yOf(0.14)} stroke={ED.series2} strokeDasharray="4,3" strokeWidth={1.25} />
      <text x={padL + plotW - 2} y={yOf(0.14) - 4} textAnchor="end" fill={ED.series2} fontSize={9}>0.14 target</text>

      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2} />
      {LAMBDA_CEIL_CURVE.map((p) => (
        <circle key={p.N} cx={xOf(p.X)} cy={yOf(p.lambdaCeil)} r={3.5} fill={ED.series1} />
      ))}

      {/* current verified-height point */}
      <circle cx={xOf(CURRENT_HEIGHT_POINT.X)} cy={yOf(CURRENT_HEIGHT_POINT.lambdaCeil)} r={5} fill="none" stroke={ED.series3} strokeWidth={2} />
      <text x={xOf(CURRENT_HEIGHT_POINT.X) + 7} y={yOf(CURRENT_HEIGHT_POINT.lambdaCeil) - 6} fill={ED.series3} fontSize={9}>
        current X=6.0e12
      </text>

      {/* threshold crossing X markers */}
      <circle cx={xOf(THRESHOLD_0145.X)} cy={yOf(0.145)} r={3} fill={ED.brassDeco} />
      <circle cx={xOf(THRESHOLD_014.X)} cy={yOf(0.14)} r={3} fill={ED.series2} />

      {xTicks.map((v) => (
        <text key={`tx${v}`} x={xOf(Math.pow(10, v))} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
          {v}
        </text>
      ))}
      {yTicks.map((t) => (
        <text key={`ty${t}`} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {t.toFixed(3)}
        </text>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10(verified height X)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        &Lambda;_ceil(X)
      </text>
    </svg>
  );
}

export default function Imp95770BarrierMollifierLengthCeilingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Barrier Mollifier-Length Ceiling &Lambda;_ceil(X) vs Verified Height (imp-95770 / barrier-mollifier-length-ceiling-2026-09)" />

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
        measurement/presentation-only page re-plotting the frozen
        barrier-mollifier-length-ceiling-2026-09 fixed-height ceiling (no re-derivation,
        no new term). It changes no bound and proves no RH-relevant theorem.
        No refereed bound is changed; the 0.1758354
        candidate remains unrefereed. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        For ANY mollifier (any length, any coefficients) plugged into the barrier /
        y-transfer certificate at a fixed verified zero-checking height X = 4&pi;N&sup2;,
        the TRIANGLE-weight mass is bounded below by the Wiener-algebra ceiling
        &Lambda;_ceil(X) = min(1, &gamma;&middot;&Vert;A/B&Vert;), realised in the limit by
        the truncations of B&#8315;&sup1;. The chart below plots this ceiling across the
        four height rungs the source module measured (N = 690,988 / 1.5M / 2.0M / 6.0M),
        with the current verified height (green) and the 0.145 / 0.14 target thresholds
        (gold / red dashed) marked at the X where the curve crosses them.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        &Lambda;_ceil(X) vs log<sub>10</sub>(verified height X)
      </h3>
      <LambdaCeilChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>height rung N</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>X = 4&pi;N&sup2;</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>&Lambda;_ceil(X)</th>
          </tr>
        </thead>
        <tbody>
          {LAMBDA_CEIL_CURVE.map((p) => (
            <tr key={p.N} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{p.N.toLocaleString()}{p.N === CURRENT_HEIGHT_POINT.N ? ' (current)' : ''}</td>
              <td style={{ textAlign: 'right' }}>{p.X.toExponential(3)}</td>
              <td style={{ textAlign: 'right', color: p.N === CURRENT_HEIGHT_POINT.N ? 'var(--series-3)' : undefined }}>{p.lambdaCeil.toFixed(5)}</td>
            </tr>
          ))}
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 30%, transparent)' }}>
            <td style={{ padding: '3px 0', color: 'var(--brass)' }}>0.145 target crossing</td>
            <td style={{ textAlign: 'right', color: 'var(--brass)' }}>{THRESHOLD_0145.X.toExponential(3)}</td>
            <td style={{ textAlign: 'right', color: 'var(--brass)' }}>0.145</td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0', color: 'var(--series-2)' }}>0.14 target crossing</td>
            <td style={{ textAlign: 'right', color: 'var(--series-2)' }}>{THRESHOLD_014.X.toExponential(3)}</td>
            <td style={{ textAlign: 'right', color: 'var(--series-2)' }}>0.14</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> {IMP95770_SUMMARY.reading}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95770_SUMMARY.verdict}
      </div>
    </div>
  );
}
