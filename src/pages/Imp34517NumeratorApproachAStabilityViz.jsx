import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34517_WINDOW_ROWS,
  IMP34517_BAND,
  IMP34517_SUMMARY,
} from '../data/imp-34517-numerator-approach-a-stability-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

// Grouped bar chart: two-term / three-term / four-term leading coefficient a per window, with the
// imp-34286 bias-corrected band shaded across the full width.
function LeadingCoefficientBars() {
  const svgW = 680;
  const svgH = 280;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 60;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = IMP34517_WINDOW_ROWS;
  const n = rows.length;
  const slot = cW / n;
  const barWidth = 16;
  const gap = 4;

  const yMin = 0.4335;
  const yMax = 0.4395;
  const yAt = (v) => padT + ((yMax - v) / (yMax - yMin)) * cH;
  const xAt = (i) => padL + slot * i + slot / 2;

  const yTicks = [0.434, 0.4355, 0.437, 0.4385];

  const bandY1 = yAt(IMP34517_BAND.hi);
  const bandY2 = yAt(IMP34517_BAND.lo);

  const series = [
    { key: 'twoTermA', color: ED.series7, label: 'two-term' },
    { key: 'threeTermA', color: ED.series1, label: 'three-term' },
    { key: 'fourTermA', color: ED.series3, label: 'four-term' },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={bandY1} width={cW} height={bandY2 - bandY1} fill={alpha(ED.series3, 0.1)} />

      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(4)}
          </text>
        </g>
      ))}

      {rows.map((r, i) => {
        const groupW = series.length * barWidth + (series.length - 1) * gap;
        const groupX0 = xAt(i) - groupW / 2;
        return (
          <g key={r.window}>
            {series.map((s, j) => {
              const val = r[s.key];
              const x = groupX0 + j * (barWidth + gap);
              return (
                <g key={s.key}>
                  <rect
                    x={x}
                    y={yAt(val)}
                    width={barWidth}
                    height={padT + cH - yAt(val)}
                    fill={s.color}
                    stroke={ED.paper}
                    strokeWidth={0.75}
                  />
                  <text
                    x={x + barWidth / 2}
                    y={yAt(val) - 4}
                    textAnchor="middle"
                    fill={ED.ink}
                    fontSize={7.5}
                    transform={`rotate(-90 ${x + barWidth / 2} ${yAt(val) - 4})`}
                  >
                    {val.toFixed(4)}
                  </text>
                </g>
              );
            })}
            <text
              x={xAt(i)}
              y={padT + cH + 16}
              textAnchor="middle"
              fill={ED.inkFaint}
              fontSize={8.5}
            >
              {r.kEndLo}..{r.kEndHi}
            </text>
          </g>
        );
      })}

      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
        window (kEnd range) &mdash; pink = two-term a, blue = three-term a, green = four-term a
      </text>
      <text x={padL + cW / 2} y={padT + cH + 48} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        shaded band = imp-34286 bias-corrected range [{IMP34517_BAND.lo}, {IMP34517_BAND.hi}]
      </text>
    </svg>
  );
}

export default function Imp34517NumeratorApproachAStabilityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Numerator-Approach Leading-Coefficient a-Stability (imp-34489)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The numerator-approach gap g(kEnd) = 1 - numerator has been fit to progressively higher order
        in u = 1/kEnd: two-term (imp-34375), three-term (imp-34450), and four-term (imp-34489). Each
        added term shifts the leading coefficient a down slightly, but the order-to-order shift
        SHRINKS &mdash; ~{IMP34517_SUMMARY.imp34450ThreeTermMaxShift.toFixed(6)} going from two- to
        three-term, only ~{IMP34517_SUMMARY.maxAbsLeadShift34.toFixed(6)} (about 3&times; smaller) going
        from three- to four-term. That shrinking-shift pattern is the signature of a converging
        expansion, not a leading coefficient that keeps relocating.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        leading coefficient a vs window, across the two-, three-, and four-term fits
      </p>
      <LeadingCoefficientBars />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.76rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.5rem' }}>window</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>two-term a</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>three-term a</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>four-term a</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>c4</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>shift 3&rarr;4</th>
          </tr>
        </thead>
        <tbody>
          {IMP34517_WINDOW_ROWS.map((r) => (
            <tr key={r.window} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.5rem' }}>{r.window}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.twoTermA.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.threeTermA.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.fourTermA.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.curvatureC4.toFixed(3)}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>
                {r.leadShift34 >= 0 ? '+' : ''}
                {r.leadShift34.toFixed(6)}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Summary:</strong> across all four windows the leading
        coefficient a lands at 0.4349&ndash;0.4355 in the four-term fit, within ~0.0021 of the
        0.437&ndash;0.438 band, and the order-to-order shift keeps shrinking (~0.0022 at two-to-three,
        ~0.00067 at three-to-four) &mdash; a converging expansion, not a relocating leading coefficient.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-34489 measurement; no new derivation, no bound changed. Component model is
        the inherited surrogate diagnostic, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486
        UNTOUCHED; imp-3066 K_a&ge;0 untouched; NO QED.
      </div>
    </div>
  );
}
