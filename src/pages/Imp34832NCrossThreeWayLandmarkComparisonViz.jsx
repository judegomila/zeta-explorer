import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34800_NCROSS_THREE_WAY_CROSSVALIDATION_BANACH_KRAWCZYK_INFLECTION } from '../data/imp-34800-ncross-three-way-crossvalidation-banach-krawczyk-inflection.js';
import { ED } from '../styles/tokens.js';

const D = IMP34800_NCROSS_THREE_WAY_CROSSVALIDATION_BANACH_KRAWCZYK_INFLECTION;

// -- shared-axis dot/band chart: the three N_cross landmarks (in units of 1e9), Krawczyk drawn as a band. --
function LandmarkDots({ banach, krawczykLo, krawczykHi, inflection }) {
  const svgW = 660;
  const padL = 130;
  const padR = 70;
  const padT = 20;
  const padB = 34;
  const rowH = 48;
  const plotW = svgW - padL - padR;
  const svgH = rowH * 3 + padT + padB;

  const vMin = banach * 0.997;
  const vMax = inflection * 1.003;
  const xOf = (v) => padL + ((v - vMin) / (vMax - vMin)) * plotW;

  const rows = [
    { label: 'R1 Banach', kind: 'dot', v: banach, color: ED.series1 },
    { label: 'R2 Krawczyk', kind: 'band', lo: krawczykLo, hi: krawczykHi, color: ED.series3 },
    { label: 'R3 Inflection', kind: 'dot', v: inflection, color: ED.series2 },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((row, i) => {
        const y = padT + rowH * i + rowH / 2;
        return (
          <g key={row.label}>
            <text x={padL - 10} y={y + 4} textAnchor="end" fill={ED.inkSoft} fontSize={12}>
              {row.label}
            </text>
            <line x1={padL} x2={svgW - padR} y1={y} y2={y} stroke={ED.ruleSoft} strokeWidth={1} />
            {row.kind === 'dot' ? (
              <>
                <circle cx={xOf(row.v)} cy={y} r={5} fill={row.color} />
                <text x={xOf(row.v) + 9} y={y + 4} fill={row.color} fontSize={11} fontFamily="monospace">
                  {(row.v / 1e9).toFixed(4)}e9
                </text>
              </>
            ) : (
              <>
                <rect x={xOf(row.lo)} y={y - 8} width={Math.max(xOf(row.hi) - xOf(row.lo), 2)} height={16} fill={row.color} opacity={0.35} rx={3} />
                <circle cx={xOf((row.lo + row.hi) / 2)} cy={y} r={4} fill={row.color} />
                <text x={xOf(row.hi) + 9} y={y + 4} fill={row.color} fontSize={11} fontFamily="monospace">
                  center {((row.lo + row.hi) / 2 / 1e9).toFixed(4)}e9
                </text>
              </>
            )}
          </g>
        );
      })}
      <text x={svgW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (billions) -- shared axis, not to scale near the R1/R2 overlap
      </text>
    </svg>
  );
}

export default function Imp34832NCrossThreeWayLandmarkComparisonViz() {
  const banach = D.routes.R1_banach_closed_form.N_cross;
  const [krawczykLo, krawczykHi] = D.routes.R2_krawczyk_enclosure.bracket;
  const inflection = D.routes.R3_sigmoid_inflection.N_star;
  const gapR3vR1 = D.pairwiseGaps['rel(R3_infl,R1_banach)'];
  const gapR1vR2 = D.pairwiseGaps['rel(R1_banach,R2_krawczyk)'];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="N_cross Three-Way Landmark Comparison (imp-34832 / imp-34800)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Three independent routes locate the N_cross ~3.28e9 region: the imp-33723 Banach closed-form fixed
        point (R1), the imp-34774 Krawczyk enclosure of that same fixed point (R2), and the imp-33721
        sigmoid-inflection knee (R3). R1 and R2 agree to floating point; R3 sits ~
        {(gapR3vR1 * 100).toFixed(2)}% above them -- a landmark-definition residual, not a disagreement.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Landmark values on one N axis
      </p>
      <LandmarkDots banach={banach} krawczykLo={krawczykLo} krawczykHi={krawczykHi} inflection={inflection} />

      <div
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        R1 vs R2 gap: {(gapR1vR2 * 100).toExponential(2)}% (point-identical; the enclosure is centred on the
        Banach fixed point, so the only genuine separation is the verified bracket half-width). R3 vs R1
        gap: +{(gapR3vR1 * 100).toFixed(2)}% -- the sigmoid D2-zero knee is a DIFFERENT landmark from the
        E_coll&nbsp;=&nbsp;E_trunc crossover balance, sitting {D.pairwiseGaps.infl_half_widths_above_bracket_hi.toFixed(0)}{' '}
        enclosure half-widths above the upper bracket endpoint -- far too large to be an enclosure artifact.
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page presenting the imp-34800
        literals verbatim (no new computation). The Krawczyk enclosure is the imp-34774 double-precision
        SURROGATE; sub-gap imp-34714a REMAINS OPEN (no machine certificate). The C_C&nbsp;=&nbsp;(1/8)&radic;(3&pi;)
        ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED;
        imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; no operator positivity; no RH verdict, NO
        QED.
      </div>
    </div>
  );
}
