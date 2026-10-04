import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34883_KRAWCZYK_WORSTCASE_HEADROOM_BAND } from '../data/imp-34883-krawczyk-worstcase-headroom-band.js';
import { ED } from '../styles/tokens.js';

const D = IMP34883_KRAWCZYK_WORSTCASE_HEADROOM_BAND;

// The three anchor points the ticket asks for: lower edge (best case), center (imp-34843 single-G
// crosscheck), upper edge (worst case) -- baked literals only, no re-derivation of the sweep.
const BAND_POINTS = [
  { label: 'lower edge (best case)', N: D.constants.band_lo, star: D.minimisation.star_over_H2_max },
  { label: 'center N_cross', N: D.constants.N_cross, star: D.crosscheck.published_center_imp34843 },
  { label: 'upper edge (worst case)', N: D.constants.band_hi, star: D.minimisation.star_over_H2_min },
];

// star_over_H2(N) monotone decreasing across the widest k=10 band, marking the worst-case top-edge
// minimum and the best-case lower-edge maximum.
function HeadroomBandChart() {
  const svgW = 720;
  const svgH = 300;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const nMin = BAND_POINTS[0].N;
  const nMax = BAND_POINTS[2].N;
  const yMin = 2550;
  const yMax = 2565;
  const xAt = (n) => padL + ((n - nMin) / (nMax - nMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const yTicks = [2550, 2555, 2560, 2565];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t}
          </text>
        </g>
      ))}

      <polyline
        points={BAND_POINTS.map((p) => `${xAt(p.N)},${yAt(p.star)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
      />
      {BAND_POINTS.map((p, i) => (
        <g key={p.label}>
          <circle
            cx={xAt(p.N)}
            cy={yAt(p.star)}
            r={5}
            fill={i === 2 ? ED.series2 : i === 0 ? ED.series3 : ED.series1}
          />
          <text
            x={xAt(p.N)}
            y={yAt(p.star) - 10}
            textAnchor="middle"
            fill={ED.inkSoft}
            fontSize={9.5}
            fontWeight={700}
          >
            {p.star.toFixed(2)}x
          </text>
          <text x={xAt(p.N)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {p.label}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N across the widest imp-34693 k={D.constants.widest_band_k} rung
      </text>
    </svg>
  );
}

// The worst-case (minimum) headroom against the stated 100x safety floor, log10-scaled since the two
// quantities span more than an order of magnitude.
function SafetyFloorChart() {
  const svgW = 720;
  const svgH = 160;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = [
    { label: '100x safety floor', v: D.safety.safety_factor, color: ED.series2 },
    { label: 'worst-case min', v: D.minimisation.star_over_H2_min, color: ED.series3 },
  ];
  const xMin = 0; // log10(1)
  const xMax = 4; // log10(10000)
  const xAt = (v) => padL + ((Math.log10(v) - xMin) / (xMax - xMin)) * cW;
  const rowH = cH / rows.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => (
        <g key={r.label}>
          <text
            x={padL - 6}
            y={padT + i * rowH + rowH / 2 + 3}
            textAnchor="end"
            fill={ED.inkSoft}
            fontSize={9}
            fontFamily="monospace"
          >
            {r.label}
          </text>
          <line
            x1={padL}
            y1={padT + i * rowH + rowH / 2}
            x2={xAt(r.v)}
            y2={padT + i * rowH + rowH / 2}
            stroke={r.color}
            strokeWidth={10}
            strokeLinecap="round"
          />
          <text x={xAt(r.v) + 6} y={padT + i * rowH + rowH / 2 + 3} fill={ED.inkFaint} fontSize={9}>
            {r.v.toFixed(2)}x
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10 scale -- worst-case clears the floor by {D.safety.worst_case_over_safety_factor}x
      </text>
    </svg>
  );
}

export default function Imp34915KrawczykWorstcaseHeadroomBandViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Krawczyk Worst-Case Contraction Headroom (imp-34915 / imp-34883)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        star_over_H2(N) = G/((1+G) delta FP_LO) is monotone DECREASING across the widest k={D.constants.widest_band_k}{' '}
        imp-34693 rung (rho &asymp; {D.constants.widest_band_half_width}, &asymp;{' '}
        {(D.constants.widest_band_frac_of_N_cross * 100).toFixed(1)}% of N_cross): the worst-case band-top
        minimum is {D.minimisation.star_over_H2_min}x and the best-case lower-edge is{' '}
        {D.minimisation.star_over_H2_max}x.
      </p>
      <HeadroomBandChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        The worst-case headroom clears the stated {D.safety.safety_factor}x safety factor by{' '}
        {D.safety.worst_case_over_safety_factor}x -- the margin never dips below {D.safety.safety_factor}x
        anywhere in the admissible band.
      </p>
      <SafetyFloorChart />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        Dense {D.constants.sweep_points}-point sweep of [{D.constants.band_lo.toExponential(4)},{' '}
        {D.constants.band_hi.toExponential(4)}]: no interior minimum (
        {D.minimisation.monotone_decreasing_no_interior_min ? 'confirmed monotone' : 'NOT monotone'}), matching
        the published imp-34861 edge-only band-min {D.crosscheck.published_band_min_imp34861} and band-max{' '}
        {D.crosscheck.published_band_max_imp34861} literals verbatim.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-34883 constants/minimisation/safety/crosscheck literals verbatim (no new computation).
        Measurement on the INHERITED imp-3220/imp-3406 surrogate crossover map; does NOT instantiate the
        imp-34687a directed-rounding layer; imp-34714a REMAINS OPEN. C_C 1/8 ansatz (imp-2642/imp-2643) and
        C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched; changes no bound;
        establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
