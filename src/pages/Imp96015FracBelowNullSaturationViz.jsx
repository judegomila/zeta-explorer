import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { C_ODD_DEPARTURE_GROWTH_LAW_SATURATION } from '../data/imp-95982-c-odd-departure-growth-law-saturation.js';
import { ED } from '../styles/tokens.js';

// plots fracBelowNull(m) approaching the finite DEPARTURE_LIMIT ceiling as m grows.
function SaturationPanel() {
  const { departure, finding } = C_ODD_DEPARTURE_GROWTH_LAW_SATURATION;
  const svgW = 640;
  const svgH = 320;
  const padL = 68;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const moduli = departure.map((r) => r.m);
  const vals = departure.map((r) => r.fracBelowNull);
  const limit = finding.departureLimit;
  const minX = Math.min(...moduli);
  const maxX = Math.max(...moduli);
  const minY = Math.min(...vals, limit) * 1.05;
  const maxY = 0;
  const xOf = (m) => padL + ((m - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const xTickVals = [20, 30, 60, 80, 110, 150];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1.5}
      />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        m (modulus)
      </text>
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        fracBelowNull(m)
      </text>
      {xTickVals.map((v) => (
        <g key={`x${v}`}>
          <line
            x1={xOf(v)}
            y1={padT + plotH}
            x2={xOf(v)}
            y2={padT + plotH + 4}
            stroke={ED.rule}
            strokeWidth={1}
          />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {/* finite ceiling reference line */}
      <line
        x1={padL}
        y1={yOf(limit)}
        x2={padL + plotW}
        y2={yOf(limit)}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 4} y={yOf(limit) - 5} textAnchor="end" fill={ED.series2} fontSize={9}>
        ceiling {limit.toExponential(3)}
      </text>
      <polyline
        points={departure.map((r) => `${xOf(r.m)},${yOf(r.fracBelowNull)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={1.5}
      />
      {departure.map((r) => (
        <circle
          key={r.m}
          cx={xOf(r.m)}
          cy={yOf(r.fracBelowNull)}
          r={r.parity === 'even' ? 4 : 3}
          fill={r.parity === 'even' ? ED.series1 : ED.series5}
        />
      ))}
      <text x={padL + 8} y={padT + 12} fill={ED.series1} fontSize={9}>
        even-branch (fit points)
      </text>
      <text x={padL + 8} y={padT + 25} fill={ED.series5} fontSize={9}>
        odd-branch (m = 41)
      </text>
    </svg>
  );
}

export default function Imp96015FracBelowNullSaturationViz() {
  const { finding, fit, departure } = C_ODD_DEPARTURE_GROWTH_LAW_SATURATION;
  const at150 = departure.find((r) => r.m === 150);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-95982: c_odd Departure Saturation to a Finite Floor" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement/fit-only plot of
        an already-computed reconstruction quantity. It changes no Lambda bound and establishes no
        operator positivity.
        Catalan G irrationality stays OPEN; Sun arXiv:2609.04176 is single-author and unrefereed.
        RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95966 fractional departure of c_odd_recon below the pure-rho&sup2; null, tabulated
        at only three moduli (m = 41, 60, 150), is extended here to the full imp-95925 eight-modulus
        grid and fit on the parity-clean even branch. Fit form Q0_RECON(m) = L &minus; c&middot;m
        <sup>&minus;p</sup> gives p = {fit.p.toFixed(4)} (&asymp; 2), so the departure approaches a{' '}
        <strong>finite</strong> limit of {finding.departureLimit.toExponential(3)} rather than
        diverging &mdash; at m = 150 it has already reached{' '}
        {(finding.fractionOfLimitAt150 * 100).toFixed(1)}% of that ceiling (value{' '}
        {at150.fracBelowNull.toExponential(4)}).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        fracBelowNull(m) approaching the finite ceiling
      </h3>
      <SaturationPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the curve bends toward the
        dashed ceiling rather than continuing to fall, consistent with the exact closed-form
        cancellation fracBelowNull(m) = (Q0_RECON(20) &minus; Q0_RECON(m))/kappa inheriting the
        finite imp-95925 Q0_RECON asymptote. The lone odd-branch point (m = 41) sits off the
        even-branch fit curve, matching the imp-95967 parity split.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-95982
        baked fit literals (values copied verbatim, no re-derivation). Changes no bound,
        establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
