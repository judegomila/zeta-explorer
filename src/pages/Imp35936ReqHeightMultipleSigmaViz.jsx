import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35936_DISPLAY_CURVE,
  IMP35936_PT_ANCHOR,
  IMP35936_KNEEDLE_ELBOW,
  IMP35936_FLATTEST_POINT,
  IMP35936_FLOOR_APPROACH,
} from '../data/imp-35936-req4-height-multiple-sigma-viz-data.js';
import { ED } from '../styles/tokens.js';

const CURVE_COLOR = ED.series1;
const KNEE_COLOR = ED.series4;
const FLAT_COLOR = ED.series3;
const PT_COLOR = ED.series2;

function HeightMultipleChart() {
  const w = 680;
  const padL = 56;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const plotW = w - padL - padR;
  const plotH = 300;
  const h = padT + plotH + padB;

  const sMax = IMP35936_DISPLAY_CURVE[0].sigma; // 0.94
  const sMin = IMP35936_PT_ANCHOR.sigma; // ~0.0188
  const mMax = IMP35936_DISPLAY_CURVE[0].multiple;
  const mMin = IMP35936_PT_ANCHOR.multiple;

  // sigma axis runs high -> low left to right (descending downslope).
  const xOf = (sigma) => padL + ((sMax - sigma) / (sMax - sMin)) * plotW;
  const yOf = (multiple) => padT + plotH - ((multiple - mMin) / (mMax - mMin)) * plotH;

  const linePath = IMP35936_DISPLAY_CURVE.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.sigma)} ${yOf(p.multiple)}`
  ).join(' ');

  const yTicks = [14, 12, 10, 8, 6];

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 8} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        required-height multiple (200 / log T0) vs sigma
      </text>

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}x
          </text>
        </g>
      ))}

      <path d={linePath} fill="none" stroke={CURVE_COLOR} strokeWidth={2.25} />

      {IMP35936_DISPLAY_CURVE.map((p) => (
        <circle key={p.sigma} cx={xOf(p.sigma)} cy={yOf(p.multiple)} r={2.5} fill={CURVE_COLOR} />
      ))}

      {/* Kneedle elbow marker */}
      <circle cx={xOf(IMP35936_KNEEDLE_ELBOW.sigma)} cy={yOf(IMP35936_KNEEDLE_ELBOW.multiple)} r={5} fill="none" stroke={KNEE_COLOR} strokeWidth={2} />
      {/* Flattest point marker */}
      <circle cx={xOf(IMP35936_FLATTEST_POINT.sigma)} cy={yOf(IMP35936_FLATTEST_POINT.multiple)} r={5} fill="none" stroke={FLAT_COLOR} strokeWidth={2} />
      {/* PT anchor marker */}
      <circle cx={xOf(IMP35936_PT_ANCHOR.sigma)} cy={yOf(IMP35936_PT_ANCHOR.multiple)} r={5} fill="none" stroke={PT_COLOR} strokeWidth={2} />

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={h - 8} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        sigma -- peak ~0.94 (left) down to the PT-anchor sigma ~0.019 (right)
      </text>

      <g>
        <circle cx={padL + 4} cy={padT + 8} r={3} fill={CURVE_COLOR} />
        <text x={padL + 12} y={padT + 11} fill={CURVE_COLOR} fontSize={8.5}>
          multiple(sigma)
        </text>
        <circle cx={padL + 100} cy={padT + 8} r={4} fill="none" stroke={KNEE_COLOR} strokeWidth={2} />
        <text x={padL + 110} y={padT + 11} fill={KNEE_COLOR} fontSize={8.5}>
          Kneedle elbow
        </text>
        <circle cx={padL + 210} cy={padT + 8} r={4} fill="none" stroke={FLAT_COLOR} strokeWidth={2} />
        <text x={padL + 220} y={padT + 11} fill={FLAT_COLOR} fontSize={8.5}>
          flattest point
        </text>
        <circle cx={padL + 320} cy={padT + 8} r={4} fill="none" stroke={PT_COLOR} strokeWidth={2} />
        <text x={padL + 330} y={padT + 11} fill={PT_COLOR} fontSize={8.5}>
          PT anchor
        </text>
      </g>
    </svg>
  );
}

function CurveTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '0.4rem 0.6rem' }}>sigma</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>log T0</th>
          <th style={{ padding: '0.4rem 0.6rem', color: CURVE_COLOR }}>multiple (200/log T0)</th>
        </tr>
      </thead>
      <tbody>
        {IMP35936_DISPLAY_CURVE.map((p) => (
          <tr key={p.sigma} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {p.sigma}
              {p.ptAnchor ? ' (PT anchor)' : ''}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.logT0.toFixed(2)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: CURVE_COLOR }}>{p.multiple.toFixed(2)}x</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35936ReqHeightMultipleSigmaViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="REQ-4 Required-Height Multiple vs Sigma (imp-35936 / imp-35853)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35853 tabulated the imp-35813 REQ-4 required-height multiple 200&nbsp;/&nbsp;log&nbsp;T0
        CONTINUOUSLY versus sigma along the full peak-to-PT downslope, interpolating between the
        discrete imp-35813 sigma landmark rungs. The chart below plots the resulting curve and marks
        three complementary knee/flatness locators against the ~
        {IMP35936_PT_ANCHOR.multiple.toFixed(2)}x Platt-Trudgian anchor value.
      </p>

      <HeightMultipleChart />

      <div style={{ marginTop: '1.5rem' }}>
        <CurveTable />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The multiple descends monotonically from ~13.6x (sigma&nbsp;~&nbsp;0.94) to the
        ~{IMP35936_PT_ANCHOR.multiple.toFixed(2)}x value at the PT anchor (log&nbsp;T0&nbsp;~&nbsp;
        {IMP35936_PT_ANCHOR.logT0.toFixed(2)}, sigma&nbsp;~&nbsp;{IMP35936_PT_ANCHOR.sigma}), but it does
        NOT flatten onto that value in sigma-space. Its rate of change is largest just below the peak,
        reaches a shallow minimum at the mid-downslope <strong style={{ color: FLAT_COLOR }}>flattest
        point</strong> (sigma&nbsp;~&nbsp;{IMP35936_FLATTEST_POINT.sigma}, multiple&nbsp;~&nbsp;
        {IMP35936_FLATTEST_POINT.multiple}x), then RE-STEEPENS on the deep approach to the anchor. The{' '}
        <strong style={{ color: KNEE_COLOR }}>Kneedle elbow</strong> of the steep initial descent sits at
        sigma&nbsp;~&nbsp;{IMP35936_KNEEDLE_ELBOW.sigma} (multiple&nbsp;~&nbsp;
        {IMP35936_KNEEDLE_ELBOW.multiple}x); the multiple first comes within 10% of the anchor value at
        sigma&nbsp;~&nbsp;{IMP35936_FLOOR_APPROACH.within10pct.sigma} and within 5% at sigma&nbsp;~&nbsp;
        {IMP35936_FLOOR_APPROACH.within5pct.sigma}, both deep below the s0.1 rung.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only of the
        already-derived imp-35853 measurement (no new derivation, no heavy data-module import, no
        re-running the bisection sweep at page load); measurement only; the ~
        {IMP35936_PT_ANCHOR.multiple.toFixed(2)}x figure is the multiple AT the PT-verified height, not
        an asymptotic floor -- the multiple would keep descending below it for smaller sigma / larger
        height; establishes no operator positivity; imp-35337a stays OPEN; NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/viz-imp35934-kappa-sweep-ladder', label: 'Summation-Scheme Error vs Condition Number kappa' },
          { to: '/rh-proof-state', label: 'RH Proof State Dashboard' },
          { to: '/improvements', label: 'Improvements Log' },
        ]}
      />
    </div>
  );
}
