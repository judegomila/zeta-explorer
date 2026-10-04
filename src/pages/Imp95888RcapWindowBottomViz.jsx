import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95888_ENVELOPE_CURVE,
  IMP95888_MEASURED_POINTS,
  IMP95888_LANDMARKS,
  IMP95888_GAP_DECADES,
  IMP95888_CAVEAT_BANNER,
} from '../data/imp-95888-rcap-window-bottom-viz-data.js';
import {
  IMP95812_OFFSET_ROWS,
  IMP95812_ANCHOR_ROWS,
  IMP95812_OFFSET_SPREAD,
} from '../data/imp-95812-number-variance-c0-estimator-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

const LANDMARK_COLOR = {
  measured_ceiling: ED.series1,
  window_bottom: ED.series5,
};

// r_cap(T) vs log10 T: the six imp-95710 measured points (dots) plus the
// fine-grid closed-form bridge (line) all the way out to the imp-95519
// window bottom -- the only in-repo lever that reaches T=3e12 at all.
function RCapWindowBottomChart() {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 30;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xMin = IMP95888_MEASURED_POINTS[0].log10T;
  const xMax = IMP95888_ENVELOPE_CURVE[IMP95888_ENVELOPE_CURVE.length - 1].log10T;
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  const yMin = 0;
  const yMax = 1.05;
  const yOf = (v) => padT + ((yMax - v) / (yMax - yMin)) * plotH;

  const curvePath = IMP95888_ENVELOPE_CURVE.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10T)} ${yOf(p.rCap)}`,
  ).join(' ');
  const measuredCapPath = IMP95888_MEASURED_POINTS.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10T)} ${yOf(p.rCap)}`,
  ).join(' ');

  const gueY = yOf(1);
  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
  const measuredCeilingLog10T = IMP95888_LANDMARKS[0].log10T;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={xOf(xMin)} y={padT} width={xOf(measuredCeilingLog10T) - xOf(xMin)} height={plotH} fill={alpha(ED.series3, 0.05)} />
      <rect x={xOf(measuredCeilingLog10T)} y={padT} width={xOf(xMax) - xOf(measuredCeilingLog10T)} height={plotH} fill={alpha(ED.series2, 0.04)} />
      <text x={xOf(xMin) + 4} y={padT - 6} textAnchor="start" fill={ED.series3} fontSize={9}>
        imp-95710 measured range
      </text>
      <text x={xOf(xMax) - 4} y={padT - 6} textAnchor="end" fill={ED.series2} fontSize={9}>
        {'>'} 6.7-decade gap: no in-repo data, only the derived envelope
      </text>

      {yTicks.map((t) => (
        <line key={`gy${t}`} x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}

      <line x1={padL} y1={gueY} x2={padL + plotW} y2={gueY} stroke={ED.rule} strokeWidth={1} strokeDasharray="4 4" />
      <text x={padL + plotW - 4} y={gueY - 5} textAnchor="end" fill={ED.inkSoft} fontSize={9}>
        conservatism ceiling r_cap=1
      </text>

      <path d={curvePath} fill="none" stroke={ED.series1} strokeWidth={2} strokeDasharray="5 4" />
      <path d={measuredCapPath} fill="none" stroke={ED.series3} strokeWidth={2} />
      {IMP95888_MEASURED_POINTS.map((p) => (
        <circle key={`m-${p.T}`} cx={xOf(p.log10T)} cy={yOf(p.rCap)} r={3} fill={ED.series3} />
      ))}

      {IMP95888_LANDMARKS.map((m) => {
        const x = xOf(m.log10T);
        const color = LANDMARK_COLOR[m.name];
        return (
          <g key={m.name}>
            <line x1={x} y1={padT} x2={x} y2={padT + plotH} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={x} cy={yOf(m.rCap)} r={4} fill={color} />
          </g>
        );
      })}

      {IMP95888_LANDMARKS.map((m, i) => {
        const x = xOf(m.log10T);
        const color = LANDMARK_COLOR[m.name];
        const anchor = i === 0 ? 'start' : 'end';
        return (
          <text key={`lbl-${m.name}`} x={x} y={padT + 12} textAnchor={anchor} fill={color} fontSize={9}>
            {`${m.label}: r_cap=${m.rCap.toFixed(4)}`}
          </text>
        );
      })}

      <text x={xOf(xMin) + 4} y={yOf(IMP95888_MEASURED_POINTS[0].rCap) - 8} fill={ED.series3} fontSize={9}>
        measured six points (solid)
      </text>
      <text x={xOf(xMax) - 4} y={yOf(0.05)} textAnchor="end" fill={ED.series1} fontSize={9}>
        closed-form bridge (dashed)
      </text>

      {[xMin, measuredCeilingLog10T, xMax].map((lt) => (
        <text key={`tx${lt}`} x={xOf(lt)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {lt.toFixed(1)}
        </text>
      ))}
      {yTicks.map((t) => (
        <text key={`ty${t}`} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {t.toFixed(1)}
        </text>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 T
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        r_cap(T)
      </text>
    </svg>
  );
}

export default function Imp95888RcapWindowBottomViz() {
  const ceiling = IMP95888_LANDMARKS[0];
  const windowBottom = IMP95888_LANDMARKS[1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Number-Variance Ratio Cap r_cap(T): Window-Bottom Envelope (imp-95722 / imp-95888)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP95888_CAVEAT_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95710 measured the pointwise-variance / GUE number-variance ratio r(T) across six
        heights spanning only T&nbsp;=&nbsp;1e4..{ceiling.T.toExponential(0)} (~1.7 decades) --
        a{' '}
        {IMP95888_GAP_DECADES.toFixed(2)}-decade gap short of the imp-95519 window bottom
        T&nbsp;=&nbsp;3.0e12. imp-95722 closed that reach gap analytically: the numerator
        (pointwise counting-fluctuation variance) grows at most like Selberg&apos;s unconditional
        log log T law while the GUE denominator grows like log T, giving a derived envelope
        r_cap(T) that provably falls from {ceiling.rCap.toFixed(4)} at the measured ceiling to{' '}
        {windowBottom.rCap.toFixed(4)} at the window bottom -- the only in-repo lever that reaches
        that far at all.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        r_cap(T) vs height (log scale): measured range vs the closed-form bridge
      </h3>
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        Green shading (solid line, dots): the six imp-95710 measured heights, where the envelope
        is anchored against real sd(C&minus;E) data. Red shading (dashed line): the
        {' '}{IMP95888_GAP_DECADES.toFixed(1)}-decade span above the measured ceiling, where the
        curve is the imp-95722 closed form evaluated on a fine grid for chart resolution only --
        no measurement exists there.
      </p>
      <RCapWindowBottomChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>T</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>log10 T</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>r(T) measured</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>r_cap(T)</th>
          </tr>
        </thead>
        <tbody>
          {IMP95888_MEASURED_POINTS.map((p) => (
            <tr key={p.T} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{p.T.toExponential(1)}</td>
              <td style={{ textAlign: 'right' }}>{p.log10T.toFixed(2)}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-3)' }}>{p.rMeasured.toFixed(4)}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-1)' }}>{p.rCap.toFixed(4)}</td>
            </tr>
          ))}
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 35%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>{windowBottom.T.toExponential(1)}</td>
            <td style={{ textAlign: 'right' }}>{windowBottom.log10T.toFixed(2)}</td>
            <td style={{ textAlign: 'right', color: 'var(--ink-faint)' }}>&mdash; (no measurement)</td>
            <td style={{ textAlign: 'right', color: 'var(--series-5)' }}>{windowBottom.rCap.toFixed(4)}</td>
          </tr>
        </tbody>
      </table>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        Estimator-choice sensitivity of C0 (imp-95812/imp-95787)
      </h3>
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        The window-bottom landmark above pins the offset C0 as the MAX over the six imp-95710
        heights (the conservative upper-envelope choice). The per-height offsets spread{' '}
        {IMP95812_OFFSET_SPREAD.toFixed(4)} (max&nbsp;&minus;&nbsp;min), driven by a single
        anomalous T&nbsp;=&nbsp;1.5e5 height rather than a trend. Swapping the max for a mean- or
        min-based estimator still leaves r_cap(3e12) far below the GUE asymptote 1:
      </p>
      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginBottom: '1rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>estimator</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>C0</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>r_cap(3e12)</th>
          </tr>
        </thead>
        <tbody>
          {IMP95812_ANCHOR_ROWS.map((a) => (
            <tr key={a.label} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{a.label}</td>
              <td style={{ textAlign: 'right' }}>{a.c0.toFixed(4)}</td>
              <td style={{ textAlign: 'right', color: a.label === 'max' ? 'var(--series-5)' : 'var(--ink-soft)' }}>
                {a.rCap.toFixed(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginBottom: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>T</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>ln T</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>per-height offset</th>
          </tr>
        </thead>
        <tbody>
          {IMP95812_OFFSET_ROWS.map((r) => (
            <tr key={r.Tc} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.Tc.toExponential(1)}</td>
              <td style={{ textAlign: 'right' }}>{r.logT.toFixed(2)}</td>
              <td style={{ textAlign: 'right', color: r.isArgmax ? 'var(--series-5)' : 'var(--ink)' }}>
                {r.offset.toFixed(4)}
                {r.isArgmax ? ' (argmax)' : ''}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page rendering the frozen
        imp-95722 derived envelope and imp-95787 estimator-bias table verbatim (no
        re-derivation). Supplies no new bound, establishes no operator positivity, no RH claim;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
