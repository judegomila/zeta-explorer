import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import IMP95562_MEANSQUARE_VS_POINTWISE_GAP from '../data/imp-95562-meansquare-vs-pointwise-gap.js';
import { ED } from '../styles/tokens.js';

const ROWS = IMP95562_MEANSQUARE_VS_POINTWISE_GAP.rows;

// Grouped-bar chart: measured sd(D) (D = C - E) vs the GUE number-variance
// prediction sd, across the six sample heights, plus a mean(D) dot near zero.
function DiscrepancyVsGueChart() {
  const svgW = 640;
  const padL = 48;
  const padR = 16;
  const padT = 24;
  const padB = 54;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = padT + plotH + padB;

  const n = ROWS.length;
  const groupW = plotW / n;
  const barW = groupW * 0.32;
  const yMax = Math.max(...ROWS.map((r) => Math.max(r.sdDiscrepancy, r.sdGUE))) * 1.15;
  const yOf = (v) => padT + plotH - (v / yMax) * plotH;
  const ticksY = [0, 0.2, 0.4, 0.6, 0.8, 1.0].filter((v) => v <= yMax + 1e-9);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {ticksY.map((v) => (
        <line key={`gy${v}`} x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}
      {ROWS.map((r, i) => {
        const cx = padL + groupW * (i + 0.5);
        const xMeasured = cx - barW - 2;
        const xGue = cx + 2;
        const hMeasured = (r.sdDiscrepancy / yMax) * plotH;
        const hGue = (r.sdGUE / yMax) * plotH;
        return (
          <g key={r.Tc}>
            <rect x={xMeasured} y={yOf(r.sdDiscrepancy)} width={barW} height={hMeasured} fill={ED.series1} opacity={0.9} />
            <rect x={xGue} y={yOf(r.sdGUE)} width={barW} height={hGue} fill={ED.brassDeco} opacity={0.85} />
            <text x={cx} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              {r.Tc.toExponential(0).replace('e+', 'e')}
            </text>
          </g>
        );
      })}
      {ticksY.map((v) => (
        <text key={`ty${v}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v.toFixed(1)}
        </text>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 32} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        sample height T_c
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        std of D = C - E (zeros)
      </text>
      <rect x={padL} y={svgH - 16} width={10} height={10} fill={ED.series1} />
      <text x={padL + 14} y={svgH - 7} fill={ED.inkSoft} fontSize={9.5}>
        measured sd(D)
      </text>
      <rect x={padL + 130} y={svgH - 16} width={10} height={10} fill={ED.brassDeco} />
      <text x={padL + 144} y={svgH - 7} fill={ED.inkSoft} fontSize={9.5}>
        GUE number-variance sd
      </text>
    </svg>
  );
}

export default function Imp95588MsqGueEnvelopeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Discrepancy D = C - E vs the GUE Number-Variance Envelope (imp-95562)" />

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
        measurement/presentation-only page rendering the frozen imp-95562
        discrepancy statistics measured over the actual Odlyzko zeros (no
        re-derivation). It changes no bound and proves no RH-relevant
        theorem. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        At six sample heights T<sub>c</sub>, imp-95562 tiled non-overlapping
        hard-box windows of half-width &Delta;(t) = sqrt(t/2&pi;) and tabulated
        the discrepancy D = C - E between the pointwise local zero count C and
        the mean-square envelope E = 2&Delta;&delta;(t). The bars below compare
        the measured fluctuation sd(D) (blue) against the Dyson&ndash;Mehta GUE
        number-variance prediction sd = sqrt(&Sigma;&sup2;(L)) for the same mean
        count L (gold). The measured fluctuation sits well below the GUE
        envelope at every height (average variance ratio {IMP95562_MEANSQUARE_VS_POINTWISE_GAP.aggregates.avgVarRatioMeasuredOverGUE.toFixed(2)}),
        showing the GUE envelope over-estimates the true pointwise fluctuation
        in this accessible regime.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Measured sd(D) vs GUE-predicted sd, by height
      </h3>
      <DiscrepancyVsGueChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>T_c</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>envelope L</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>mean(D)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>sd(D) measured</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>sd GUE</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>var ratio</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>worst excess (&sigma;)</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.Tc} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.Tc.toExponential(1)}</td>
              <td style={{ textAlign: 'right' }}>{r.meanLocalCountL.toFixed(2)}</td>
              <td style={{ textAlign: 'right' }}>{r.meanDiscrepancy.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.sdDiscrepancy.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.sdGUE.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.varRatioMeasuredOverGUE.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.worstSigma.toFixed(2)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page
        rendering the frozen imp-95562 discrepancy/GUE statistics verbatim (no
        re-derivation). Supplies no pointwise-control theorem, changes no
        bound, establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
