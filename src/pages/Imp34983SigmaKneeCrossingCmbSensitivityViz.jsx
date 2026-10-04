import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34955_SIGMA_KNEE_CROSSING_CMB_SENSITIVITY as D } from '../data/imp-34955-sigma-knee-crossing-cmb-sensitivity.js';
import { ED, alpha } from '../styles/tokens.js';

const SWEEP = D.sweep; // 11-point C_mb in [0.5,1] grid: epsAt5pct, epsAt25pct
const R_DS = D.radiusContext.dombSykesRadius; // 91
const [R_DS_LO, R_DS_HI] = D.radiusContext.dombSykesRange; // [79, 106]
const ELASTICITY_5 = D.drift.elasticity5pct; // ~0.1888
const ELASTICITY_25 = D.drift.elasticity25pct; // ~0.1751

// Both raw-total crossing-eps series (5% and 25%) plotted against the swept C_mb, overlaid on the
// imp-34882 Domb-Sykes band [79,106] and point estimate R ~ 91.
function CmbSensitivityChart() {
  const svgW = 760;
  const svgH = 320;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const cmbLo = 0.5;
  const cmbHi = 1.0;
  const yLo = 60;
  const yHi = 112;

  const xAt = (cmb) => padL + ((cmb - cmbLo) / (cmbHi - cmbLo)) * cW;
  const yAt = (eps) => padT + cH - ((eps - yLo) / (yHi - yLo)) * cH;

  const path5 = SWEEP.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(p.cmb)},${yAt(p.epsAt5pct)}`).join(' ');
  const path25 = SWEEP.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(p.cmb)},${yAt(p.epsAt25pct)}`).join(' ');

  const xTicks = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
  const yTicks = [60, 70, 80, 90, 100, 110];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* imp-34882 Domb-Sykes uncertainty band [79, 106] */}
      <rect x={padL} y={yAt(R_DS_HI)} width={cW} height={yAt(R_DS_LO) - yAt(R_DS_HI)} fill={alpha(ED.series1, 0.1)} />

      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={v}>
          <line x1={xAt(v)} y1={padT + cH} x2={xAt(v)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(v)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      {/* Domb-Sykes point estimate R ~ 91 */}
      <line x1={padL} y1={yAt(R_DS)} x2={padL + cW} y2={yAt(R_DS)} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="4 3" />
      <text x={padL + cW - 4} y={yAt(R_DS) - 5} textAnchor="end" fill={ED.brass} fontSize={9}>
        R_DombSykes ~ {R_DS}
      </text>

      {/* 25% crossing (stays inside the band band-wide) */}
      <path d={path25} fill="none" stroke={ED.series3} strokeWidth={2} />
      {SWEEP.map((p) => (
        <circle key={`25-${p.cmb}`} cx={xAt(p.cmb)} cy={yAt(p.epsAt25pct)} r={2.5} fill={ED.series3} />
      ))}
      <text x={xAt(0.52)} y={yAt(SWEEP[0].epsAt25pct) - 8} fill={ED.series3} fontSize={9}>
        25% crossing
      </text>

      {/* 5% crossing (exits the low edge for C_mb < ~1) */}
      <path d={path5} fill="none" stroke={ED.series2} strokeWidth={2} />
      {SWEEP.map((p) => (
        <circle key={`5-${p.cmb}`} cx={xAt(p.cmb)} cy={yAt(p.epsAt5pct)} r={2.5} fill={ED.series2} />
      ))}
      <text x={xAt(0.52)} y={yAt(SWEEP[0].epsAt5pct) + 14} fill={ED.series2} fontSize={9}>
        5% crossing
      </text>

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        C_mb (multiplicative factor on E_coll); y = raw-total resummed-deviation crossing-eps
      </text>
    </svg>
  );
}

export default function Imp34983SigmaKneeCrossingCmbSensitivityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-Knee Resummation-Crossing C_mb Sensitivity (imp-34983 / imp-34955)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Both crossings drift monotonically and sublinearly as C_mb runs 0.5&nbsp;&rarr;&nbsp;1 (5%:{' '}
        {D.drift.eps5AtCmbLo.toFixed(2)}&nbsp;&rarr;&nbsp;{D.drift.eps5AtCmbHi.toFixed(2)}, elasticity ~
        {ELASTICITY_5.toFixed(2)}; 25%: {D.drift.eps25AtCmbLo.toFixed(2)}&nbsp;&rarr;&nbsp;
        {D.drift.eps25AtCmbHi.toFixed(2)}, elasticity ~{ELASTICITY_25.toFixed(2)}). The shaded band is
        the imp-34882 Domb-Sykes uncertainty range [{R_DS_LO},&nbsp;{R_DS_HI}] with the point estimate
        R&nbsp;~&nbsp;{R_DS} marked. The 25% crossing (green) stays inside the band for every swept
        C_mb, but the 5% crossing (red) drops below the {R_DS_LO} low edge for C_mb&nbsp;&lt;&nbsp;~1.
      </p>
      <CmbSensitivityChart />

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
        imp-34955 C_mb sweep verbatim (no new computation). The range-level coincidence -- the 25%
        crossing landing inside [{R_DS_LO}, {R_DS_HI}] -- is ROBUST to the GUE-conditional C_mb knob
        (imp-486), but the tight point-level landing on R&nbsp;~&nbsp;{R_DS} is C_mb-specific. Measurement
        only on the inherited imp-3220/imp-3406 surrogate; C_mb swept as a sensitivity knob, its pinned
        value UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
