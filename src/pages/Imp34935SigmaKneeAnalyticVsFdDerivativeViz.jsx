import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34900_SIGMA_KNEE_ANALYTIC_DERIVATIVE_DOMB_SYKES } from '../data/imp-34900-sigma-knee-analytic-derivative-domb-sykes.js';
import { IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS } from '../data/imp-34863-sigma-knee-cauchy-hadamard-radius.js';
import { ED } from '../styles/tokens.js';

const D900 = IMP34900_SIGMA_KNEE_ANALYTIC_DERIVATIVE_DOMB_SYKES;
const D863 = IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS;
const ROOT_AN = D900.cleanRootSequence;
const ROOT_FD = D863.radiusOfConvergence.rootSequence_absDelta_pow_1overk;
const K_VALUES = ROOT_AN.map((_, i) => i + 1);
const DIP_INDEX = 5; // k=6, the root_6 dip imp-34882 named

// analytic vs FD root_k = |delta_k|^(1/k) sequence for k=1..9, with the root_6 dip circled: the ~1.08%
// third-derivative FD noise (v_secondDeriv) propagates through delta_1 into the ladder, moving root_6 most.
function RootSequenceChart() {
  const svgW = 720;
  const svgH = 320;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMin = 0;
  const yMax = Math.max(...ROOT_AN, ...ROOT_FD) * 1.15;
  const xAt = (k) => padL + ((k - 1) / (K_VALUES.length - 1)) * cW;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const y = yMin + f * (yMax - yMin);
        return (
          <g key={f}>
            <line x1={padL - 4} y1={yAt(y)} x2={padL + cW} y2={yAt(y)} stroke={ED.ruleSoft} strokeWidth={1} />
            <text x={padL - 8} y={yAt(y) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
              {y.toExponential(2)}
            </text>
          </g>
        );
      })}
      {K_VALUES.map((k) => (
        <g key={k}>
          <line x1={xAt(k)} y1={padT + cH} x2={xAt(k)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            k={k}
          </text>
        </g>
      ))}

      {/* FD sequence, amber dashed */}
      <polyline
        points={ROOT_FD.map((y, i) => `${xAt(K_VALUES[i])},${yAt(y)}`).join(' ')}
        fill="none"
        stroke={ED.brassDeco}
        strokeWidth={1.5}
        strokeDasharray="5,4"
      />
      {/* analytic sequence, blue solid */}
      <polyline
        points={ROOT_AN.map((y, i) => `${xAt(K_VALUES[i])},${yAt(y)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
      />
      {ROOT_AN.map((y, i) => (
        <circle key={`an-${i}`} cx={xAt(K_VALUES[i])} cy={yAt(y)} r={3.5} fill={ED.series1} />
      ))}
      {ROOT_FD.map((y, i) => (
        <circle key={`fd-${i}`} cx={xAt(K_VALUES[i])} cy={yAt(y)} r={3.5} fill={ED.brassDeco} />
      ))}

      {/* the root_6 dip, circled red */}
      <circle cx={xAt(K_VALUES[DIP_INDEX])} cy={yAt(ROOT_FD[DIP_INDEX])} r={9} fill="none" stroke={ED.series2} strokeWidth={1.5} />
      <text x={xAt(K_VALUES[DIP_INDEX]) + 12} y={yAt(ROOT_FD[DIP_INDEX]) - 10} fill={ED.series2} fontSize={9.5} fontWeight={700}>
        root_6 dip
      </text>

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        root_k = |delta_k|^(1/k), k=1..9 (blue solid = analytic w-kernel, amber dashed = imp-34863 hd=1e-3 FD)
      </text>
    </svg>
  );
}

// relative deviation of the FD kernel from the exact analytic kernel across v, v_prime, v_secondDeriv,
// showing the ~1.08% error is isolated to the third derivative while v and v_prime match to <= 2e-8.
function DerivativeErrorChart() {
  const svgW = 720;
  const svgH = 200;
  const padL = 90;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kernel = D900.analyticDerivativeKernel;
  const rows = [
    { label: 'v', rel: kernel.relErr_v },
    { label: "v'", rel: kernel.relErr_vPrime },
    { label: "v''", rel: kernel.relErr_vSecondDeriv },
  ];
  const logs = rows.map((r) => Math.log10(r.rel));
  const yMin = Math.min(...logs) - 0.5;
  const yMax = Math.max(...logs) + 0.5;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;
  const barW = cW / rows.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {rows.map((r, i) => {
        const x = padL + i * barW + barW * 0.25;
        const w = barW * 0.5;
        const isThird = i === 2;
        return (
          <g key={r.label}>
            <rect
              x={x}
              y={yAt(logs[i])}
              width={w}
              height={padT + cH - yAt(logs[i])}
              fill={isThird ? ED.series2 : ED.series1}
              opacity={0.85}
            />
            <text x={x + w / 2} y={padT + cH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={11}>
              {r.label}
            </text>
            <text x={x + w / 2} y={yAt(logs[i]) - 6} textAnchor="middle" fill={isThird ? ED.series2 : ED.series1} fontSize={9.5} fontWeight={700}>
              {r.rel.toExponential(2)}
            </text>
          </g>
        );
      })}
      <text x={padL - 8} y={yAt(yMax) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        {yMax.toFixed(1)}
      </text>
      <text x={padL - 8} y={yAt(yMin) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        {yMin.toFixed(1)}
      </text>
      <text x={padL - 60} y={padT + cH / 2} fill={ED.inkFaint} fontSize={9} transform={`rotate(-90 ${padL - 60} ${padT + cH / 2})`}>
        log10(rel err)
      </text>

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        FD vs analytic relative error per derivative order (red = the third derivative, where the FD noise lives)
      </text>
    </svg>
  );
}

export default function Imp34935SigmaKneeAnalyticVsFdDerivativeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-Knee Analytic vs Finite-Difference Derivative Kernel (imp-34935 / imp-34900)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D900.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        The analytic root sequence tracks the imp-34863 hd=1e-3 finite-difference sequence closely across all
        nine orders, but the root_6 point is where they visibly separate -- the FD value (
        {ROOT_FD[DIP_INDEX].toExponential(2)}) dips lower than the analytic value (
        {ROOT_AN[DIP_INDEX].toExponential(2)}).
      </p>
      <RootSequenceChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        The FD noise is isolated to the THIRD derivative: v and v_prime match the analytic kernel to
        &le;{Math.max(D900.analyticDerivativeKernel.relErr_v, D900.analyticDerivativeKernel.relErr_vPrime).toExponential(1)}
        {' '}relative, while v_secondDeriv is off by {(D900.analyticDerivativeKernel.relErr_vSecondDeriv * 100).toFixed(2)}%
        -- that single error propagates through delta_1 into the whole ladder, moving root_6 most.
      </p>
      <DerivativeErrorChart />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        Despite localizing the FD noise, the linear Domb-Sykes radius does not move (analytic R &asymp;{' '}
        {D900.radiusExtrapolated}, range {D900.radiusRange[0]}-{D900.radiusRange[1]}, vs the imp-34882 FD read
        R &asymp; {D900.linearDombSykesAnalytic.imp34882_FD_radius}): the linear extrapolant was already robust
        to the FD floor. The high-order Neville tableau stays ill-conditioned even with exact derivatives, so a
        tighter-than-linear radius pin remains an open sub-gap (more orders, not more precision).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-34900 and
        imp-34863 literals verbatim (no new computation). Measurement on the INHERITED imp-3220/imp-3406
        surrogate crossover map, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
        K_a&ge;0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator
        positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
