import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3611_N1600_RHO_BY_M,
  IMP3611_N1200_ANCHOR_RHO_BY_M,
  IMP3611_N1600_M200_ARTIFACT_RHO,
  IMP3611_N1600_CONVERGED_RHO,
  IMP3611_N1600_LOCK_DEPTH,
  IMP3611_LADDER,
  IMP3611_N1600_ARTIFACT_LOG_INV_RHO,
  IMP3611_HEURISTIC_Q,
  IMP3611_Q_1200_TO_1600,
  IMP3611_Q_1600_TO_2000,
  IMP3611_Q_1200_TO_1600_ARTIFACT,
} from '../data/imp-3611-skew-toeplitz-krylov-gap-ladder-viz-data.js';

const N1600_COLOR = '#f472b6';
const N1200_COLOR = '#38bdf8';
const ARTIFACT_COLOR = '#f87171';
const CORRECTED_COLOR = '#10b981';

function KrylovDepthChart() {
  const svgW = 640;
  const padL = 70;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const mMin = 200;
  const mMax = 360;
  const yMin = 0.99930;
  const yMax = 0.99980;

  const xS = (m) => padL + ((m - mMin) / (mMax - mMin)) * cW;
  const yS = (rho) => padT + cH * (1 - (rho - yMin) / (yMax - yMin));

  const n1600Path = IMP3611_N1600_RHO_BY_M.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.m).toFixed(1) + ',' + yS(r.rho).toFixed(2)).join(' ');
  const n1200Path = IMP3611_N1200_ANCHOR_RHO_BY_M.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.m).toFixed(1) + ',' + yS(r.rho).toFixed(2)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0.99930, 0.99940, 0.99950, 0.99960, 0.99970, 0.99980].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(5)}
          </text>
        </g>
      ))}

      <path d={n1200Path} fill="none" stroke={N1200_COLOR} strokeWidth={1.6} strokeDasharray="4,3" />
      {IMP3611_N1200_ANCHOR_RHO_BY_M.map((r) => (
        <circle key={'a' + r.m} cx={xS(r.m)} cy={yS(r.rho)} r={2.4} fill={N1200_COLOR} />
      ))}

      <path d={n1600Path} fill="none" stroke={N1600_COLOR} strokeWidth={2} />
      {IMP3611_N1600_RHO_BY_M.map((r, i) => (
        <circle
          key={'b' + r.m}
          cx={xS(r.m)}
          cy={yS(r.rho)}
          r={i === 0 ? 3.6 : 2.6}
          fill={i === 0 ? ARTIFACT_COLOR : N1600_COLOR}
        />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {[200, 240, 280, 320, 360].map((m) => (
        <g key={'x' + m}>
          <line x1={xS(m)} y1={padT + cH} x2={xS(m)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(m)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            {m}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        Lanczos Krylov depth m
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        rho = lambda_3/lambda_1
      </text>

      <g fontSize={9}>
        <circle cx={padL + 8} cy={padT + 12} r={3.6} fill={ARTIFACT_COLOR} />
        <text x={padL + 16} y={padT + 15} fill="#fca5a5">N=1600, m=200 ARTIFACT rung (under-resolved)</text>
        <line x1={padL + 2} y1={padT + 26} x2={padL + 10} y2={padT + 26} stroke={N1600_COLOR} strokeWidth={2} />
        <text x={padL + 14} y={padT + 29} fill="#f9a8d4">N=1600, converged (m&ge;280)</text>
        <line x1={padL + 2} y1={padT + 40} x2={padL + 10} y2={padT + 40} stroke={N1200_COLOR} strokeWidth={1.6} strokeDasharray="4,2" />
        <text x={padL + 14} y={padT + 43} fill="#7dd3fc">N=1200 anchor (already converged at m=200)</text>
      </g>
    </svg>
  );
}

function LadderChart() {
  const svgW = 640;
  const padL = 70;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const logNMin = Math.log10(700);
  const logNMax = Math.log10(2200);
  const logYMin = Math.log10(0.00012);
  const logYMax = Math.log10(0.0011);

  const xS = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (y) => padT + cH * (1 - (Math.log10(y) - logYMin) / (logYMax - logYMin));

  const correctedPath = IMP3611_LADDER.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.logInvRho).toFixed(2)).join(' ');

  const n1200 = IMP3611_LADDER.find((r) => r.N === 1200);
  const artifactPath =
    'M' + xS(n1200.N).toFixed(1) + ',' + yS(n1200.logInvRho).toFixed(2) +
    ' L' + xS(1600).toFixed(1) + ',' + yS(IMP3611_N1600_ARTIFACT_LOG_INV_RHO).toFixed(2);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0.00012, 0.0002, 0.0004, 0.0007, 0.001].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(1)}
          </text>
        </g>
      ))}

      {/* imp-3555 artifact segment: N=1200 -> the non-monotone N=1600 bake */}
      <path d={artifactPath} fill="none" stroke={ARTIFACT_COLOR} strokeWidth={1.6} strokeDasharray="5,3" />
      <circle cx={xS(1600)} cy={yS(IMP3611_N1600_ARTIFACT_LOG_INV_RHO)} r={3.6} fill={ARTIFACT_COLOR} />

      {/* corrected, strictly-decreasing ladder */}
      <path d={correctedPath} fill="none" stroke={CORRECTED_COLOR} strokeWidth={2} />
      {IMP3611_LADDER.map((r) => (
        <circle key={r.N} cx={xS(r.N)} cy={yS(r.logInvRho)} r={2.8} fill={CORRECTED_COLOR} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP3611_LADDER.map((r) => (
        <g key={'x' + r.N}>
          <line x1={xS(r.N)} y1={padT + cH} x2={xS(r.N)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(r.N)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            {r.N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        N (log scale)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        -log rho(N) (log scale)
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={CORRECTED_COLOR} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill="#6ee7b7">Corrected ladder (strictly decreasing, restored)</text>
        <line x1={padL + 2} y1={padT + 26} x2={padL + 10} y2={padT + 26} stroke={ARTIFACT_COLOR} strokeWidth={1.6} strokeDasharray="4,2" />
        <text x={padL + 14} y={padT + 29} fill="#fca5a5">imp-3555 non-monotone N=1600 bake (m=200 artifact)</text>
      </g>
    </svg>
  );
}

export default function Imp3611SkewToeplitzKrylovGapLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Corrected-Krylov Skew-Toeplitz Gap Ladder (imp-3575 / imp-3611)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3555 flagged the N=1600 rung of the skew-Toeplitz section gap rho = lambda_3/lambda_1
        as a non-monotone data-quality outlier: its -log rho sat ABOVE the N=1200 value, reversing
        the local slope. imp-3575 traced this to a Lanczos Krylov-truncation deficit in lambda_3 --
        the imp-3545 m=200 reference rho = {IMP3611_N1600_M200_ARTIFACT_RHO} was still climbing;
        growing the Krylov depth to m={IMP3611_N1600_LOCK_DEPTH} shifts it to{' '}
        {IMP3611_N1600_CONVERGED_RHO.toFixed(8)}, where it then locks. With the corrected rung the
        -log rho(N) ladder is strictly decreasing through N=2000, and the local log-log slopes
        continue climbing toward the {IMP3611_HEURISTIC_Q} section-gap heuristic.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        N=1600 rho(m) Krylov-depth sweep: the m=200 artifact rung vs the converged lock
      </p>
      <KrylovDepthChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Restored -log rho(N) ladder across N in {'{'}800, 1000, 1200, 1600, 2000{'}'}
      </p>
      <LadderChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the charts:</strong> at N=1200 the m=200
        reference is already converged (flat dashed line, top chart), so the deficit is
        N-specific and grows with N -- the m=200 rung at N=1600 is still moving and locks only at
        m&ge;280. Using the un-converged m=200 rung would have given a local slope of{' '}
        {IMP3611_Q_1200_TO_1600_ARTIFACT.toFixed(2)} (1200&rarr;1600, i.e. an apparent gap
        REVERSAL); the corrected rung gives {IMP3611_Q_1200_TO_1600.toFixed(4)} (1200&rarr;1600)
        and {IMP3611_Q_1600_TO_2000.toFixed(4)} (1600&rarr;2000), both continuing the climb toward
        the {IMP3611_HEURISTIC_Q} heuristic rather than reversing it.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement only -- this
        re-measures and corrects a Krylov-truncation deficit in a previously baked gap; it does
        NOT construct the missing magnitude and does NOT attempt the imp-3066 K_a &ge; 0
        positivity. RH-equivalent, necessary-but-not-sufficient; the -2 exponent is a corroborated
        empirical heuristic, not a proven asymptotic. Platt-Trudgian &Lambda; &le; 0.2 remains the
        rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3540-power-iteration-budget" style={{ color: '#7c3aed' }}>
          Power-Iteration Budget Ladder (imp-3540)
        </Link>
        {' | '}
        <Link to="/viz-imp3656-triple-skew-toeplitz-gap-ladder" style={{ color: '#7c3aed' }}>
          Triple Skew-Toeplitz Gap Ladder (imp-3656)
        </Link>
      </div>
    </div>
  );
}
