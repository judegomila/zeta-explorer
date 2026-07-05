import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from '../data/imp-33810-eflow-resid-ratio-N-ladder.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from '../data/imp-33878-hump-argmax-grid-refinement.js';

const LADDER = IMP33810_EFLOW_RESID_RATIO_N_LADDER.ladder;
const { kStar: K_STAR } = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax;
const { kCrossContinuous: K_CROSS, gap_kCross_minus_kStar: GAP } =
  IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.crossoverComparison;

const GRID_ARGMAX = LADDER.reduce((best, r) => (r.resid_exp > best.resid_exp ? r : best), LADDER[0]);

// resid_exp(k) across the imp-33810 21-rung ladder, with the continuum argmax k*~8.821 and the
// pointwise E_coll=E_trunc crossover k_cross~9.516 marked as vertical reference lines beyond the
// discrete grid points that actually exist in LADDER.
function ResidExpHumpChart() {
  const svgW = 720;
  const svgH = 320;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kMin = 6;
  const kMax = 11;
  const xAt = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;

  const yMax = Math.max(...LADDER.map((r) => r.resid_exp)) * 1.15;
  const yMin = Math.min(0, Math.min(...LADDER.map((r) => r.resid_exp)));
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke="#334155" strokeWidth={1} />

      {[6, 7, 8, 9, 10, 11].map((k) => (
        <g key={'xt' + k}>
          <line x1={xAt(k)} y1={padT + cH} x2={xAt(k)} y2={padT + cH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xAt(k)} y={padT + cH + 18} textAnchor="middle" fill="#64748b" fontSize={9}>
            {k}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        k (ladder rung, N = 10^k)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        resid_exp(k)
      </text>

      <polyline
        points={LADDER.map((r) => `${xAt(r.k)},${yAt(r.resid_exp)}`).join(' ')}
        fill="none"
        stroke="#38bdf8"
        strokeWidth={1.75}
      />
      {LADDER.map((r) => (
        <circle
          key={'pt' + r.k}
          cx={xAt(r.k)}
          cy={yAt(r.resid_exp)}
          r={r.k === GRID_ARGMAX.k ? 4 : 2.25}
          fill={r.k === GRID_ARGMAX.k ? '#4ade80' : '#38bdf8'}
          stroke="#0a0f1a"
          strokeWidth={0.5}
        />
      ))}

      <line
        x1={xAt(K_STAR)}
        y1={padT}
        x2={xAt(K_STAR)}
        y2={padT + cH}
        stroke="#4ade80"
        strokeWidth={1.25}
        strokeDasharray="5,3"
      />
      <text x={xAt(K_STAR)} y={padT - 6} textAnchor="middle" fill="#4ade80" fontSize={9.5}>
        k*&sim;{K_STAR}
      </text>

      <line
        x1={xAt(K_CROSS)}
        y1={padT}
        x2={xAt(K_CROSS)}
        y2={padT + cH}
        stroke="#f87171"
        strokeWidth={1.25}
        strokeDasharray="5,3"
      />
      <text x={xAt(K_CROSS)} y={padT - 6} textAnchor="middle" fill="#f87171" fontSize={9.5}>
        k_cross&sim;{K_CROSS}
      </text>
    </svg>
  );
}

export default function Imp33953ResidExpHumpArgmaxCrossoverViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="resid_exp(k) Hump, Continuum Argmax & Crossover (imp-33810 / imp-33878 / imp-33905 / imp-33953)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-33810 ladder tracks resid_exp(k) = p_ecoll(1 - sigma_hi) - p_sigma over 21
        quarter-decade rungs k=6.00..11.00, but had no visual surface of the shape itself. The
        curve below is a single broad quadratic hump, peaking on the discrete grid at k=
        {GRID_ARGMAX.k.toFixed(2)} (green dot, resid_exp&sim;{GRID_ARGMAX.resid_exp}). imp-33878
        refined the grid to 1/128-decade and located the underlying continuum argmax at k*&sim;
        {K_STAR} (green dashed line) -- BELOW, not converging toward, the pointwise E_coll=E_trunc
        crossover k_cross&sim;{K_CROSS} (red dashed line) that imp-33844/imp-33723 derived in
        closed form. imp-33905 attributed the resulting k_cross&nbsp;-&nbsp;k*&sim;{GAP}-decade gap
        to the step=0.25 grid-discretization distance; the gap is grid-independent, a genuine
        window-lag between the decade-integrated hump and the pointwise sigma=1/2 crossover.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        resid_exp(k) across the imp-33810 21-rung ladder, k = 6.00 .. 11.00
      </p>
      <ResidExpHumpChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/visualization only.
        The discrete-grid hump argmax (k={GRID_ARGMAX.k.toFixed(2)}) and the continuum argmax
        (k*&sim;{K_STAR}) are two readings of the SAME resid_exp(k) surrogate, not two features; the
        crossover k_cross&sim;{K_CROSS} is a distinct pointwise quantity. The component model is the
        inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
        GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
        positivity; imp-3066 K_a &ge; 0 remains untouched. No RH verdict, NO QED. Platt-Trudgian
        &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
