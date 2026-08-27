import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34930_BREACH_STEP_LAW_VERIFICATION as D } from '../data/imp-34930-breach-step-law-verification.js';

const R_SEED = D.recompute.r_seed_recomputed; // 1
const R_MARGIN = D.recompute.r_margin_direct_N_FP_LO_over_K; // ~19.9101
const NSTAR_SEED = D.law.nstar_seed; // 1
const NSTAR_MARGIN = D.law.nstar_margin; // 5
const DEPTH_SEED = D.law.op_depth_from_seed; // 8
const DEPTH_MARGIN = D.law.op_depth_from_margin; // 40
const LOG2_GAP = D.law.log2_threshold_gap_doublings; // ~4.3154
const STEP_GAP = D.law.breach_step_gap; // 4

// Staircase of the 2^n forward-width doubling curve nStar(R) = floor(log2 R) + 1, with the two
// independently recomputed breach ratios (imp-34930) marked as horizontal reference lines and
// their crossing steps as vertical markers. All literals baked from imp-34930; no new computation.
function BreachStepDoublingChart() {
  const svgW = 720;
  const svgH = 340;
  const padL = 60;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const nMin = 0;
  const nMax = 6;
  const yMinLog2 = -1; // 2^-1 = 0.5
  const yMaxLog2 = 6; // 2^6 = 64

  const xAt = (n) => padL + ((n - nMin) / (nMax - nMin)) * cW;
  const yAt = (value) => padT + cH - ((Math.log2(value) - yMinLog2) / (yMaxLog2 - yMinLog2)) * cH;

  // Staircase of 2^n for n = 0..6 (the forward-width doubling curve).
  const steps = [];
  for (let n = 0; n <= 6; n++) {
    steps.push({ n, value: Math.pow(2, n) });
  }
  const stepPath = steps
    .map((s, i) => {
      const x0 = xAt(s.n);
      const x1 = i < steps.length - 1 ? xAt(steps[i + 1].n) : xAt(nMax);
      const y = yAt(s.value);
      return `M ${x0},${y} L ${x1},${y}`;
    })
    .join(' ');

  const yTickValues = [0.5, 1, 2, 4, 8, 16, 32, 64];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      {yTickValues.map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL} y2={yAt(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((n) => (
        <g key={n}>
          <line x1={xAt(n)} y1={padT + cH} x2={xAt(n)} y2={padT + cH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xAt(n)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {n}
          </text>
        </g>
      ))}

      {/* R_seed and R_margin reference lines */}
      <line x1={padL} y1={yAt(R_SEED)} x2={padL + cW} y2={yAt(R_SEED)} stroke="#fbbf24" strokeWidth={1} strokeDasharray="4 3" />
      <text x={padL + 4} y={yAt(R_SEED) - 5} fill="#fbbf24" fontSize={9}>
        R_seed = {R_SEED} (op-depth {DEPTH_SEED})
      </text>
      <line x1={padL} y1={yAt(R_MARGIN)} x2={padL + cW} y2={yAt(R_MARGIN)} stroke="#f87171" strokeWidth={1} strokeDasharray="4 3" />
      <text x={padL + 4} y={yAt(R_MARGIN) - 5} fill="#f87171" fontSize={9}>
        R_margin &asymp; {R_MARGIN.toFixed(3)} (op-depth {DEPTH_MARGIN})
      </text>

      {/* the 2^n staircase */}
      <path d={stepPath} fill="none" stroke="#34d399" strokeWidth={2} />
      {steps.map((s) => (
        <circle key={s.n} cx={xAt(s.n)} cy={yAt(s.value)} r={2.5} fill="#34d399" />
      ))}

      {/* crossing steps nStar(R_seed) and nStar(R_margin) */}
      <line x1={xAt(NSTAR_SEED)} y1={padT} x2={xAt(NSTAR_SEED)} y2={padT + cH} stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="2 2" />
      <circle cx={xAt(NSTAR_SEED)} cy={yAt(R_SEED)} r={4.5} fill="#fbbf24" stroke="#0f172a" strokeWidth={1} />
      <line x1={xAt(NSTAR_MARGIN)} y1={padT} x2={xAt(NSTAR_MARGIN)} y2={padT + cH} stroke="#f87171" strokeWidth={1.5} strokeDasharray="2 2" />
      <circle cx={xAt(NSTAR_MARGIN)} cy={yAt(R_MARGIN)} r={4.5} fill="#f87171" stroke="#0f172a" strokeWidth={1} />

      {/* doubling-gap bracket between the two crossing steps */}
      <line
        x1={xAt(NSTAR_SEED)}
        y1={padT + cH + 28}
        x2={xAt(NSTAR_MARGIN)}
        y2={padT + cH + 28}
        stroke="#38bdf8"
        strokeWidth={1.5}
      />
      <text x={(xAt(NSTAR_SEED) + xAt(NSTAR_MARGIN)) / 2} y={padT + cH + 28 - 6} textAnchor="middle" fill="#38bdf8" fontSize={9}>
        gap = {STEP_GAP} steps (log2 &asymp; {LOG2_GAP})
      </text>

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={10}>
        n (Newton-step index); y = 2^n forward-width doubling curve (log2 scale)
      </text>
    </svg>
  );
}

export default function Imp34961BreachStepDoublingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Unified Breach-Step Doubling Law (imp-34961 / imp-34930)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        The same 2^n forward-width doubling curve, read against two independently recomputed
        reference widths, reproduces both published breach points: R_seed = {R_SEED} crosses at
        step n = {NSTAR_SEED} (op-depth {DEPTH_SEED}, the imp-34884 seed-bracket breach), and
        R_margin &asymp; {R_MARGIN.toFixed(4)} crosses at step n = {NSTAR_MARGIN} (op-depth{' '}
        {DEPTH_MARGIN}, the imp-34889 (H2)-margin breach). The two crossings are separated by{' '}
        {STEP_GAP} doubling steps, exactly floor(log2(R_margin/R_seed)) = floor(
        {LOG2_GAP.toFixed(4)}).
      </p>
      <BreachStepDoublingChart />

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> Viz-only page rendering the
        imp-34930 independently-recomputed breach-step literals verbatim (R_seed, R_margin, the
        nStar(R) = floor(log2 R) + 1 law, and the 4-step doubling gap), no new computation.
        Verification/measurement only on the inherited imp-3220/imp-3406 surrogate crossover map;
        does NOT instantiate the imp-34687a directed-rounding layer; sub-gap imp-34714a REMAINS
        OPEN. C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 UNTOUCHED;
        imp-3066 K_a&ge;0 untouched; changes no bound; establishes no operator positivity; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
