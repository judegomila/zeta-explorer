import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97614_RSWEEP_ROWS,
  IMP97614_SIGN_CHANGE_R,
  IMP97614_FAR_FIELD_OPTIMUM_R,
  IMP97614_SUMMARY,
} from '../data/imp-97614-tailbias-Rsweep-viz-data.js';
import { ED } from '../styles/tokens.js';

// Line chart of relBias(R) across the R ladder, with vertical markers at Rc = 1/a (sign change,
// bias exactly zero) and R* = 3.36 (imp-97497 far-field-cost optimum, bias -2.7e-5).
function TailBiasChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const rows = IMP97614_RSWEEP_ROWS; // R ascending: 0.5 -> 5.0
  const xMin = Math.min(...rows.map((r) => r.R));
  const xMax = Math.max(...rows.map((r) => r.R));
  const xOf = (R) => padL + ((R - xMin) / (xMax - xMin)) * plotW;

  const yMax = Math.max(...rows.map((r) => r.relBias));
  const yMin = Math.min(...rows.map((r) => r.relBias));
  const span = yMax - yMin;
  const yOf = (v) => padT + plotH - ((v - yMin) / span) * plotH;

  const linePts = rows.map((r) => `${xOf(r.R)},${yOf(r.relBias)}`).join(' ');
  const zeroY = yOf(0);
  const rcX = xOf(IMP97614_SIGN_CHANGE_R);
  const rStarX = xOf(IMP97614_FAR_FIELD_OPTIMUM_R);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

      {/* zero-bias reference line */}
      <line x1={padL} y1={zeroY} x2={padL + plotW} y2={zeroY} stroke={ED.rule} strokeDasharray="3 3" strokeWidth={1} />

      {/* Rc = 1/a sign-change marker */}
      <line x1={rcX} y1={padT} x2={rcX} y2={padT + plotH} stroke={ED.series3} strokeDasharray="4 3" strokeWidth={1} />
      <text x={rcX} y={padT - 4} textAnchor="middle" fill={ED.series3} fontSize={9}>
        Rc = 1/a = {IMP97614_SIGN_CHANGE_R.toFixed(4)}
      </text>

      {/* R* = 3.36 far-field-cost optimum marker */}
      <line x1={rStarX} y1={padT} x2={rStarX} y2={padT + plotH} stroke={ED.brassDeco} strokeDasharray="4 3" strokeWidth={1} />
      <text x={rStarX} y={padT + 10} textAnchor="middle" fill={ED.brass} fontSize={9}>
        R* = {IMP97614_FAR_FIELD_OPTIMUM_R}
      </text>

      <polyline points={linePts} fill="none" stroke={ED.series1} strokeWidth={2} />
      {rows.map((r) => (
        <circle
          key={`pt-${r.R}`}
          cx={xOf(r.R)}
          cy={yOf(r.relBias)}
          r={r.isSignChange || r.isFarFieldOptimum ? 4 : 3}
          fill={r.isSignChange ? ED.series3 : r.isFarFieldOptimum ? ED.brassDeco : ED.series1}
        />
      ))}

      <text x={padL + plotW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
        R (Gaussian width)
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        relBias(R)
      </text>
    </svg>
  );
}

export default function Imp97614TailBiasRSweepViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Far-Field Tail-Bias Sign Change: relBias(R) Across the R Ladder (imp-97614 / imp-97580)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement/presentation-only
        page reshaping the frozen imp-97580 R-sweep verbatim (no re-derivation, no new computation).
        Changes no bound; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97614_SUMMARY.reading}
      </p>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
        The endpoint-asymptotic tail bias relBias(R) = 3(1/a &minus; a R&sup2;) &middot; (I2/I1)
        changes sign exactly at Rc = 1/a, marked in green; the imp-97497 far-field-cost optimum
        R* = 3.36 is marked in amber, well past the sign change and already inside the &lt; 1e-3
        tail error bar:
      </p>
      <TailBiasChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>R</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>relBias(R)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>marker</th>
          </tr>
        </thead>
        <tbody>
          {IMP97614_RSWEEP_ROWS.map((r) => (
            <tr key={r.R} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.R}</td>
              <td style={{ textAlign: 'right' }}>{r.relBias.toExponential(3)}</td>
              <td style={{ textAlign: 'right' }}>
                {r.isSignChange ? 'Rc = 1/a' : r.isFarFieldOptimum ? 'R* (imp-97497)' : ''}
              </td>
            </tr>
          ))}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP97614_SUMMARY.verdict}
      </div>
    </div>
  );
}
