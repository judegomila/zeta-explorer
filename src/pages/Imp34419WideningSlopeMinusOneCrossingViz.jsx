import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { effectiveHeightForN } from '../data/lambda-rh-height-mapping.js';
import { IMP34327_WIDENING_SLOPE_MINUS_ONE_CROSSING } from '../data/imp-34327-widening-slope-minus-one-crossing-location.js';
import { ED, alpha } from '../styles/tokens.js';

const {
  uStar,
  kStarNaive,
  kStarMapped,
  fittedWindowKRange,
  windowTwoTermSlopes,
  m2CeilingKStar,
  leadingSlope,
  verdict,
} = IMP34327_WIDENING_SLOPE_MINUS_ONE_CROSSING;

const TWO_PI = 2 * Math.PI;
const LN10 = Math.LN10;
const slopeOfU = (u) => -LN10 / 2 + (LN10 * 3) / u;
const uOfK = (k) => Math.log(effectiveHeightForN(Math.pow(10, k + 1)) / TWO_PI);

// Sample the widening-slope curve across k=10..22, spanning the fit window, the -1 crossing at
// k*~20.48, and the imp-34023 M2 ceiling at k*~21.281.
const CURVE = Array.from({ length: (22 - 10) * 8 + 1 }, (_, i) => {
  const k = 10 + i / 8;
  return { k, slope: slopeOfU(uOfK(k)) };
});

function SlopeChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 46;
  const padR = 20;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 10;
  const xMax = 22;
  const yMin = -1.2;
  const yMax = -0.85;
  const xAt = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const curvePts = CURVE.map((r) => `${xAt(r.k)},${yAt(r.slope)}`).join(' ');
  const windowPts = windowTwoTermSlopes.map((r) => `${xAt(r.k)},${yAt(r.slope)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {[-1.2, -1.15, -1.1, -1.05, -1.0, -0.95, -0.9, -0.85].map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {[10, 12, 14, 16, 18, 20, 22].map((k) => (
        <text key={'x' + k} x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {k}
        </text>
      ))}

      {/* -1.0 reference line */}
      <line x1={padL} y1={yAt(-1)} x2={padL + cW} y2={yAt(-1)} stroke={ED.rule} strokeWidth={1} strokeDasharray="3,3" />
      {/* leading value -ln10/2 asymptote */}
      <line x1={padL} y1={yAt(leadingSlope)} x2={padL + cW} y2={yAt(leadingSlope)} stroke={ED.rule} strokeWidth={1} strokeDasharray="1,3" />
      <text x={padL + cW - 4} y={yAt(leadingSlope) - 4} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        leading -ln10/2 = {leadingSlope}
      </text>

      {/* fitted window shading */}
      <rect
        x={xAt(fittedWindowKRange[0])}
        y={padT}
        width={xAt(fittedWindowKRange[1]) - xAt(fittedWindowKRange[0])}
        height={cH}
        fill={alpha(ED.series1, 0.08)}
      />
      <text x={xAt((fittedWindowKRange[0] + fittedWindowKRange[1]) / 2)} y={padT + 12} textAnchor="middle" fill={ED.series1} fontSize={9}>
        fit window k=12..18
      </text>

      {/* the full curve */}
      <polyline points={curvePts} fill="none" stroke={ED.rule} strokeWidth={1.5} strokeDasharray="5,3" />
      {/* the sampled window points, highlighted */}
      <polyline points={windowPts} fill="none" stroke={ED.series1} strokeWidth={2.5} />

      {/* -1 crossing marker at k*_mapped */}
      <line x1={xAt(kStarMapped)} y1={padT} x2={xAt(kStarMapped)} y2={padT + cH} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="4,3" />
      <circle cx={xAt(kStarMapped)} cy={yAt(-1)} r={4} fill={ED.brassDeco} />
      <text x={xAt(kStarMapped)} y={padT + cH + 30} textAnchor="middle" fill={ED.brass} fontSize={9}>
        k*~{kStarMapped} (-1 crossing)
      </text>

      {/* M2 ceiling marker */}
      <line x1={xAt(m2CeilingKStar)} y1={padT} x2={xAt(m2CeilingKStar)} y2={padT + cH} stroke={ED.series2} strokeWidth={1} strokeDasharray="2,2" />
      <text x={xAt(m2CeilingKStar)} y={padT - 6} textAnchor="middle" fill={ED.series2} fontSize={9}>
        M2 ceiling k*~{m2CeilingKStar}
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 12 ${padT + cH / 2})`}
      >
        two-term slope
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        k (decade exponent, N = 10^k)
      </text>
    </svg>
  );
}

export default function Imp34419WideningSlopeMinusOneCrossingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Widening-Slope -1 Crossing: Above the Fit Window, Below the M2 Ceiling (imp-34419 / imp-34327)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP34327_WIDENING_SLOPE_MINUS_ONE_CROSSING.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        The imp-34246 two-term slope -ln10/2 + ln10&middot;3/u stays entirely above -1 across the fitted
        window k=12..18 (shaded), crosses exactly -1 at u*~{uStar} (k*~{kStarMapped} mapped, {kStarNaive} naive) &mdash;
        ~2.48 decades above the window &mdash; and does so ~0.80 decades before the imp-34023 M2 sign-change
        ceiling k*~{m2CeilingKStar}.
      </p>
      <SlopeChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>u</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>slope</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>gap above leading</th>
          </tr>
        </thead>
        <tbody>
          {windowTwoTermSlopes.map((row) => (
            <tr key={row.k} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.k}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.u}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.slope}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.gapAboveLeading}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {verdict}
      </div>
    </div>
  );
}
