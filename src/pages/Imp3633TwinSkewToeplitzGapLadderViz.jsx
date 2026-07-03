import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3633_TWIN_GAP_LADDER,
  IMP3633_RATIO_LADDER,
  IMP3633_HEURISTIC_Q,
  IMP3633_A3_OVER_A2,
} from '../data/imp-3633-twin-skew-toeplitz-gap-ladder-viz-data.js';

const GAP_SERIES = [
  { key: 'logInvRho1', label: '-log rho = -log(lambda_3/lambda_1)', color: '#38bdf8', dash: 'none' },
  { key: 'logInvSigma2', label: '-log sigma_2 = -log(lambda_5/lambda_1)', color: '#f59e0b', dash: '4 2.5' },
];

function GapLadderChart() {
  const svgW = 680;
  const padL = 74;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 280;
  const svgH = padT + cH + padB;

  const Ns = IMP3633_TWIN_GAP_LADDER.map((r) => r.N);
  const allVals = IMP3633_TWIN_GAP_LADDER.flatMap((r) => GAP_SERIES.map((s) => r[s.key]));
  const logNMin = Math.log10(Ns[0]);
  const logNMax = Math.log10(Ns[Ns.length - 1]);
  const logYMin = Math.floor(Math.log10(Math.min(...allVals)));
  const logYMax = Math.ceil(Math.log10(Math.max(...allVals)));

  const xS = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logYMin) / (logYMax - logYMin));

  const yTicks = [];
  for (let e = logYMin; e <= logYMax; e++) yTicks.push(Math.pow(10, e));

  const pathFor = (key) =>
    IMP3633_TWIN_GAP_LADDER.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r[key]).toFixed(2)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      {GAP_SERIES.map((s) => (
        <path key={s.key} d={pathFor(s.key)} fill="none" stroke={s.color} strokeWidth={2} strokeDasharray={s.dash} />
      ))}
      {IMP3633_TWIN_GAP_LADDER.map((r) =>
        GAP_SERIES.map((s) => (
          <circle key={s.key + r.N} cx={xS(r.N)} cy={yS(r[s.key])} r={2.6} fill={s.color} />
        )),
      )}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {Ns.map((N) => (
        <g key={'x' + N}>
          <line x1={xS(N)} y1={padT + cH} x2={xS(N)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(N)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            {N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        N (log scale)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        -log(gap) (log scale)
      </text>
    </svg>
  );
}

function RatioChart() {
  const svgW = 680;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 180;
  const svgH = padT + cH + padB;

  const Ns = IMP3633_RATIO_LADDER.map((r) => r.N);
  const logNMin = Math.log10(Ns[0]);
  const logNMax = Math.log10(Ns[Ns.length - 1]);
  const yMin = 2.6;
  const yMax = 2.72;

  const xS = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const path = IMP3633_RATIO_LADDER.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.ratioSigma2ToRho).toFixed(2)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      <line x1={padL} y1={yS(IMP3633_A3_OVER_A2)} x2={padL + cW} y2={yS(IMP3633_A3_OVER_A2)} stroke="#475569" strokeWidth={1} strokeDasharray="5 3" />
      <text x={padL + cW - 4} y={yS(IMP3633_A3_OVER_A2) - 5} textAnchor="end" fill="#64748b" fontSize={9}>
        8/3
      </text>

      <path d={path} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 2.5" />
      {IMP3633_RATIO_LADDER.map((r) => (
        <circle key={r.N} cx={xS(r.N)} cy={yS(r.ratioSigma2ToRho)} r={2.6} fill="#f59e0b" />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {Ns.map((N) => (
        <g key={'x' + N}>
          <line x1={xS(N)} y1={padT + cH} x2={xS(N)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(N)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            {N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        N (log scale)
      </text>
    </svg>
  );
}

export default function Imp3633TwinSkewToeplitzGapLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Twin Skew-Toeplitz Gap Ladder and the 8/3 Amplitude Ratio (imp-3602)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The imp-3602 SECOND skew-Toeplitz gap sigma_2 = lambda_5/lambda_1 (third-pair over
        first-pair Gram Ritz-value ratio) converges to the SAME {IMP3633_HEURISTIC_Q}
        {' '}section-gap exponent as the imp-3575 first gap rho = lambda_3/lambda_1, across the
        identical N = 160..2000 ladder. Despite sharing an exponent, the two -log ladders sit at
        different amplitudes; their ratio is near-constant and tends to 8/3 -- the signature of a
        common N<sup>-2</sup> law with a pair-index amplitude a_j &prop; (j&sup2;-1).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        -log rho and -log sigma_2 vs N (both converging to the {IMP3633_HEURISTIC_Q} exponent)
      </p>
      <GapLadderChart />

      <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        {GAP_SERIES.map((s) => (
          <span key={s.key}>
            <span style={{ color: s.color }}>&#9644;</span> {s.label}
          </span>
        ))}
      </div>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Amplitude ratio -log sigma_2 / -log rho vs N (near-constant, tending to 8/3)
      </p>
      <RatioChart />

      <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span><span style={{ color: '#f59e0b' }}>&#9644;</span> -log sigma_2 / -log rho (imp-3602, &rarr; 8/3)</span>
      </div>

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement only -- two
        section-gap exponents and one amplitude ratio read off a converged Krylov reference
        spectrum, corroborating an EMPIRICAL a_j &prop; (j&sup2;-1) ordering, not deriving it. Does
        NOT construct the missing magnitude and does NOT attempt the imp-3066 K_a &ge; 0
        positivity. RH-equivalent; Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3656-triple-skew-toeplitz-gap-ladder" style={{ color: '#7c3aed' }}>
          Triple Skew-Toeplitz Gap Ladder and the j^2-1 Amplitude Signature (imp-3602 / imp-3619)
        </Link>
      </div>
    </div>
  );
}
