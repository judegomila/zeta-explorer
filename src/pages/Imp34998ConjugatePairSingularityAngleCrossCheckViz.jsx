import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34947_CONJUGATE_PAIR_ARGUMENT_THETA_CROSS_CHECK as D } from '../data/imp-34947-conjugate-pair-argument-theta-cross-check.js';
import { ED } from '../styles/tokens.js';

const THETA_SIGN_CYCLE = D.crossCheck.theta_signCycle_deg; // 40.000
const THETA_RECURRENCE = D.crossCheck.theta_recurrence_deg; // ~39.043
const SPREAD_DEG = D.crossCheck.spread_deg; // ~0.957
const SPREAD_REL = D.crossCheck.spread_relative; // ~0.0239
const R_RECURRENCE = D.recurrenceRead.R_median; // ~85.6
const R_IMP34932 = D.crossCheck.imp34932_R; // ~78
const R_IMP34900 = D.crossCheck.imp34900_R; // 89.6
const EPS_PHYSICAL = 1;

// Two independent theta reads on a shared 0..90 deg angle axis: the sign-cycle read
// (quantized to 360/P) and the local-recurrence Darboux read (continuous, magnitude-based).
function ThetaCompareChart() {
  const svgW = 720;
  const svgH = 150;
  const padL = 60;
  const padR = 24;
  const padT = 20;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;
  const AXIS_MAX = 90;
  const xAt = (deg) => padL + (deg / AXIS_MAX) * cW;

  const rows = [
    { label: 'sign-cycle (P=9 -> 360/P)', deg: THETA_SIGN_CYCLE, color: ED.series7, y: padT + cH * 0.3 },
    { label: 'recurrence (Darboux, magnitude-based)', deg: THETA_RECURRENCE, color: ED.series1, y: padT + cH * 0.7 },
  ];
  const ticks = [0, 15, 30, 45, 60, 75, 90];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={xAt(t)} y1={padT} x2={xAt(t)} y2={padT + cH} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={xAt(t)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {t}
          </text>
        </g>
      ))}
      {rows.map((r) => (
        <g key={r.label}>
          <line x1={padL} y1={r.y} x2={xAt(r.deg)} y2={r.y} stroke={r.color} strokeWidth={3} />
          <circle cx={xAt(r.deg)} cy={r.y} r={4.5} fill={r.color} stroke={ED.paper} strokeWidth={1} />
          <text x={xAt(r.deg) + 8} y={r.y + 3} fill={r.color} fontSize={9}>
            {r.deg.toFixed(3)}&deg; ({r.label})
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        theta off the positive real axis (degrees)
      </text>
    </svg>
  );
}

// Log-scale axis placing the physical eps = 1 point against the O(1e2) convergent radius
// cluster (recurrence median, imp-34932, imp-34900 reads) -- eps sits deep inside |eps| < R.
function RadiusEpsChart() {
  const svgW = 720;
  const svgH = 130;
  const padL = 60;
  const padR = 24;
  const padT = 20;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;
  const logLo = 0; // 10^0 = 1
  const logHi = 2.3; // ~200
  const xAt = (v) => padL + ((Math.log10(v) - logLo) / (logHi - logLo)) * cW;

  const rPoints = [
    { label: 'recurrence R median', v: R_RECURRENCE, color: ED.series1 },
    { label: 'imp-34932 R', v: R_IMP34932, color: ED.series7 },
    { label: 'imp-34900 R', v: R_IMP34900, color: ED.series3 },
  ];
  const ticks = [1, 3, 10, 30, 100, 200];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH / 2} x2={padL + cW} y2={padT + cH / 2} stroke={ED.rule} strokeWidth={1.5} />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={xAt(t)} y1={padT} x2={xAt(t)} y2={padT + cH} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={xAt(t)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {t}
          </text>
        </g>
      ))}

      <circle cx={xAt(EPS_PHYSICAL)} cy={padT + cH / 2} r={5} fill={ED.series2} stroke={ED.paper} strokeWidth={1} />
      <text x={xAt(EPS_PHYSICAL)} y={padT - 6} textAnchor="middle" fill={ED.series2} fontSize={9}>
        eps = 1 (physical)
      </text>

      {rPoints.map((r, i) => (
        <g key={r.label}>
          <circle cx={xAt(r.v)} cy={padT + cH / 2} r={4} fill={r.color} stroke={ED.paper} strokeWidth={1} />
          <text
            x={xAt(r.v)}
            y={padT + cH + 26 + (i % 2) * 11}
            textAnchor="middle"
            fill={r.color}
            fontSize={9}
          >
            {r.label} ~{r.v.toFixed(1)}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={12} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        |eps| / R, log scale -- eps=1 sits deep inside |eps| &lt; R
      </text>
    </svg>
  );
}

export default function Imp34998ConjugatePairSingularityAngleCrossCheckViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Conjugate-Pair Singularity-Angle Cross-Check (imp-34998 / imp-34947)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The dominant complex-conjugate singularity pair R e^(&plusmn;i theta) is measured two
        INDEPENDENT ways: the imp-34932 sign-cycle read (period P&nbsp;=&nbsp;9 &rarr; theta&nbsp;=&nbsp;
        {THETA_SIGN_CYCLE.toFixed(1)}&deg;) and a direct local 2-step linear-recurrence (Darboux)
        argument read from the coefficient magnitudes (theta&nbsp;&asymp;&nbsp;
        {THETA_RECURRENCE.toFixed(3)}&deg;). The two reads agree to {SPREAD_DEG.toFixed(3)}&deg;
        (&asymp;{(SPREAD_REL * 100).toFixed(1)}%).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
        Two independent theta estimates of the same off-axis pole pair
      </p>
      <ThetaCompareChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.25rem' }}>
        Convergent radius R ~ O(1e2) versus the physical eps = 1
      </p>
      <RadiusEpsChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering imp-34947
        literals verbatim (no new computation beyond re-deriving the same delta ladder for the plot).
        The sign-cycle read quantizes theta to the 360/P grid ({THETA_SIGN_CYCLE.toFixed(1)}&deg; for
        P=9); the continuous recurrence read resolves the true angle just below at
        &asymp;{THETA_RECURRENCE.toFixed(1)}&deg; -- the {SPREAD_DEG.toFixed(2)}&deg; gap is that
        quantization step, not a disagreement. The recurrence radius median R&nbsp;&asymp;&nbsp;
        {R_RECURRENCE.toFixed(1)} sits inside the imp-34932 (R&nbsp;&asymp;&nbsp;{R_IMP34932}) /
        imp-34900 (R&nbsp;&asymp;&nbsp;{R_IMP34900}) band, and the physical eps&nbsp;=&nbsp;1 sits deep
        inside |eps|&nbsp;&lt;&nbsp;R on a log scale -- this changes no bound. Measurement only on the
        inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486 untouched; establishes
        no operator positivity; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; far-tail exponent stays 1/2
        (imp-3463); no RH verdict, NO QED.
      </div>
    </div>
  );
}
