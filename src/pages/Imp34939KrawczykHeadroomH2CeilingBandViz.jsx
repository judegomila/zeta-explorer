import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34906_KRAWCZYK_HEADROOM_H2_CEILING_RECONCILE } from '../data/imp-34906-krawczyk-headroom-h2-ceiling-reconcile.js';
import { ED } from '../styles/tokens.js';

const D = IMP34906_KRAWCZYK_HEADROOM_H2_CEILING_RECONCILE;

// The three anchor points the ticket asks for, re-derived FROM the imp-34799 (H2)-margin ceiling
// directly (n_op*/n_op^max) rather than the pre-collapsed closed form -- baked literals only.
const BAND_LO_N = 2 * D.constants.N_cross - D.constants.band_top_worst_case_N;
const BAND_POINTS = [
  { label: 'band-lo (best case)', N: BAND_LO_N, star: D.reDerivation.headroom_direct_ratio_lo, color: ED.series3 },
  { label: 'Banach fixed point N_cross', N: D.constants.N_cross, star: D.reDerivation.headroom_direct_ratio_center, color: ED.series1 },
  { label: 'band-top (worst case)', N: D.constants.band_top_worst_case_N, star: D.reDerivation.headroom_direct_ratio_top, color: ED.series2 },
];

// star_over_H2(N) monotone decreasing across the widest k=10 imp-34693 rung, marking the three
// re-derived anchor points.
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
      {BAND_POINTS.map((p) => (
        <g key={p.label}>
          <circle cx={xAt(p.N)} cy={yAt(p.star)} r={5} fill={p.color} />
          <text x={xAt(p.N)} y={yAt(p.star) - 10} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5} fontWeight={700}>
            {p.star.toFixed(2)}x
          </text>
          <text x={xAt(p.N)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {p.label}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N across the widest imp-34693 k={D.constants.widest_band_k} rung, re-derived from n_op*/n_op^max directly
      </text>
    </svg>
  );
}

// The worst-case (minimum) headroom against the stated 100x safety factor, log10-scaled since the
// two quantities span more than an order of magnitude.
function SafetyFactorChart() {
  const svgW = 720;
  const svgH = 160;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = [
    { label: '100x safety factor', v: D.safety.safety_factor, color: ED.series2 },
    { label: 'worst-case min', v: D.reDerivation.headroom_direct_ratio_top, color: ED.series3 },
  ];
  const xMin = 0; // log10(1)
  const xMax = 4; // log10(10000)
  const xAt = (v) => padL + ((Math.log10(v) - xMin) / (xMax - xMin)) * cW;
  const rowH = cH / rows.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => (
        <g key={r.label}>
          <text x={padL - 6} y={padT + i * rowH + rowH / 2 + 3} textAnchor="end" fill={ED.inkSoft} fontSize={9} fontFamily="monospace">
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

// The two independently-published op ceilings at N_cross whose ratio reproduces the 2558.12x center
// bit-for-bit -- n_op^max (H2-margin, BINDING) vs n_op* (contraction-validity).
function TwoConstituentCeilingChart() {
  const svgW = 720;
  const svgH = 160;
  const padL = 130;
  const padR = 20;
  const padT = 20;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = [
    { label: 'n_op^max (H2-margin, binding)', v: D.reDerivation.n_op_max_H2_ceiling_center, color: ED.series2 },
    { label: 'n_op* (contraction-validity)', v: D.reDerivation.n_op_star_center, color: ED.series1 },
  ];
  const xMin = 11; // log10(1e11)
  const xMax = 16; // log10(1e16)
  const xAt = (v) => padL + ((Math.log10(v) - xMin) / (xMax - xMin)) * cW;
  const rowH = cH / rows.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => (
        <g key={r.label}>
          <text x={padL - 6} y={padT + i * rowH + rowH / 2 + 3} textAnchor="end" fill={ED.inkSoft} fontSize={9} fontFamily="monospace">
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
            {r.v.toExponential(4)}
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10 scale -- ratio n_op*/n_op^max reproduces {D.reDerivation.headroom_direct_ratio_center}x bit-for-bit
      </text>
    </svg>
  );
}

export default function Imp34939KrawczykHeadroomH2CeilingBandViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Krawczyk Headroom Band, Re-Derived From the (H2)-Ceiling (imp-34939 / imp-34906)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        star_over_H2(N) = n_op*(N)/n_op^max(N), rebuilt directly from the two independently-published
        op ceilings, is monotone DECREASING across the widest k={D.constants.widest_band_k} imp-34693
        rung: {BAND_POINTS[0].star.toFixed(2)}x at the band-lo best case down to{' '}
        {BAND_POINTS[2].star.toFixed(2)}x at the band-top worst case, with the Banach fixed point
        N_cross landing at {BAND_POINTS[1].star.toFixed(2)}x in between.
      </p>
      <HeadroomBandChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        The worst-case headroom clears the stated {D.safety.safety_factor}x safety factor by{' '}
        {D.safety.worst_case_over_safety_factor}x -- the margin never dips below{' '}
        {D.safety.safety_factor}x anywhere in the admissible band.
      </p>
      <SafetyFactorChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        The headroom is rebuilt directly from its two independently-published constituents at
        N_cross -- not the pre-collapsed closed form -- and their ratio reproduces{' '}
        {D.reDerivation.headroom_direct_ratio_center}x bit-for-bit (
        {D.reDerivation.direct_equals_closed_form_all_seeds ? 'confirmed' : 'NOT confirmed'} at every seed).
      </p>
      <TwoConstituentCeilingChart />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        The ~{D.reconciliation.center_minus_top_spread} spread between the imp-34843 center and the
        imp-34883 band-min is exactly the N-drift of this same monotone curve, not a discrepancy.
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
        imp-34906 constants/reDerivation/safety/reconciliation literals verbatim (no new computation).
        Measurement on the INHERITED imp-3220/imp-3406 surrogate crossover map; both op ceilings rest
        on the gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not the layer
        itself; imp-34714a REMAINS OPEN. C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per
        imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched; changes no bound; establishes no operator
        positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
