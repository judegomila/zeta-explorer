import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34498_LADDER,
  IMP34498_E_TRUNC_FLOOR,
  IMP34498_SIGMA_PEAK_N,
  IMP34498_E_N_AT_SIGMA_PEAK,
  IMP34498_N_WITHIN_10PCT,
  IMP34498_N_WITHIN_1PCT,
} from '../data/imp-34498-en-monotone-descent-viz-data.js';
import { ED } from '../styles/tokens.js';

// Log-log descent curve: the bridge TOTAL E(N) sliding monotonically toward the E_trunc floor,
// with the sigma-peak and 10%/1% floor-proximity landmarks annotated.
function MonotoneDescentCurve() {
  const svgW = 700;
  const svgH = 340;
  const padL = 60;
  const padR = 30;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const ns = IMP34498_LADDER.map((r) => r.N);
  const logMin = Math.log10(Math.min(...ns));
  const logMax = Math.log10(IMP34498_N_WITHIN_1PCT) + 0.5;
  const eMax = Math.log10(IMP34498_LADDER[0].E_N) + 0.3;
  const eMin = Math.log10(IMP34498_E_TRUNC_FLOOR) - 0.3;

  const xAt = (N) => padL + ((Math.log10(N) - logMin) / (logMax - logMin)) * cW;
  const yAt = (E) => padT + cH - ((Math.log10(E) - eMin) / (eMax - eMin)) * cH;

  const path = IMP34498_LADDER.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xAt(r.N)} ${yAt(r.E_N)}`).join(' ');

  const floorY = yAt(IMP34498_E_TRUNC_FLOOR);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* floor asymptote */}
      <line x1={padL} y1={floorY} x2={padL + cW} y2={floorY} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + cW} y={floorY - 6} textAnchor="end" fill={ED.brass} fontSize={10}>
        E_trunc floor = {IMP34498_E_TRUNC_FLOOR.toExponential(2)}
      </text>

      {/* the monotone descent curve */}
      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2.5} />
      {IMP34498_LADDER.map((r) => (
        <circle key={r.N} cx={xAt(r.N)} cy={yAt(r.E_N)} r={2.5} fill={ED.series1} />
      ))}

      {/* sigma peak landmark */}
      <circle cx={xAt(IMP34498_SIGMA_PEAK_N)} cy={yAt(IMP34498_E_N_AT_SIGMA_PEAK)} r={5} fill="none" stroke={ED.series3} strokeWidth={2} />
      <text x={xAt(IMP34498_SIGMA_PEAK_N)} y={yAt(IMP34498_E_N_AT_SIGMA_PEAK) - 12} textAnchor="middle" fill={ED.series3} fontSize={9.5}>
        sigma peak (~50x above floor)
      </text>

      {/* 10% and 1% floor-proximity landmarks */}
      <line x1={xAt(IMP34498_N_WITHIN_10PCT)} y1={padT} x2={xAt(IMP34498_N_WITHIN_10PCT)} y2={padT + cH} stroke={ED.series5} strokeWidth={1} strokeDasharray="2,3" />
      <text x={xAt(IMP34498_N_WITHIN_10PCT)} y={padT + 12} textAnchor="middle" fill={ED.series5} fontSize={9}>
        10% of floor
      </text>
      <line x1={xAt(IMP34498_N_WITHIN_1PCT)} y1={padT} x2={xAt(IMP34498_N_WITHIN_1PCT)} y2={padT + cH} stroke={ED.series5} strokeWidth={1} strokeDasharray="2,3" />
      <text x={xAt(IMP34498_N_WITHIN_1PCT)} y={padT + 26} textAnchor="middle" fill={ED.series5} fontSize={9}>
        1% of floor
      </text>

      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />
      <text x={padL} y={svgH - 6} fill={ED.inkFaint} fontSize={9.5}>
        N = {ns[0].toExponential(0)}
      </text>
      <text x={padL + cW} y={svgH - 6} textAnchor="end" fill={ED.inkFaint} fontSize={9.5}>
        N &rarr; &infin;
      </text>
      <text x={padL} y={14} fill={ED.inkSoft} fontSize={10.5} fontWeight={700}>
        E(N) monotone descent (log&#8321;&#8320; N vs log&#8321;&#8320; E(N))
      </text>
    </svg>
  );
}

export default function Imp34498EnMonotoneDescentViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Bridge Total E(N) Monotone Descent to the E_trunc Floor (imp-34498 / imp-34434)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34434 found the bridge TOTAL E(N) = E_trunc + E_flow + E_coll has NO interior
        minimum: it slides monotonically from ~0.54 at N=2 toward the constant floor
        E_trunc&nbsp;=&nbsp;{IMP34498_E_TRUNC_FLOOR.toExponential(2)}. The imp-3406 sigma-SHARE
        peak at N&nbsp;&asymp;&nbsp;{IMP34498_SIGMA_PEAK_N.toExponential(2)} is NOT an E(N)
        minimum -- there E(N)&nbsp;&asymp;&nbsp;{IMP34498_E_N_AT_SIGMA_PEAK.toExponential(2)} is
        still ~50x above the floor. The descent is logarithmically slow: E(N) comes within 10% of
        the floor only near N&nbsp;&asymp;&nbsp;{IMP34498_N_WITHIN_10PCT.toExponential(2)} and
        within 1% near N&nbsp;&asymp;&nbsp;{IMP34498_N_WITHIN_1PCT.toExponential(2)}. No viz
        existed for this descent.
      </p>

      <MonotoneDescentCurve />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, the ladder and
        landmarks are reused verbatim from imp-34434. Measurement only within the inherited
        imp-3220/imp-3406 component model, NOT a rigorous asymptotic; C_mb GUE-conditional per
        imp-486 UNTOUCHED; E(N) are bridge CONSTANTS not the headline inequality (imp-2564);
        changes no bound; no RH verdict, NO QED.
      </div>
    </div>
  );
}
