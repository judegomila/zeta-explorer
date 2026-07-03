import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3376_C_STAR,
  IMP3376_K2_QUINTIC_ROOT,
  IMP3376_ONSET_LADDER,
  IMP3376_LIMIT_ONSET,
  IMP3376_LEADING_COEF_A,
  IMP3376_DECAY_EXPONENT,
} from '../data/imp-3376-kshell-onset-ladder-viz-data.js';

function OnsetChart() {
  const svgW = 680;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const Ks = IMP3376_ONSET_LADDER.map((r) => r.shellCount);
  const logKMin = Math.log10(Ks[0]);
  const logKMax = Math.log10(Ks[Ks.length - 1]);
  const yMin = 0.9;
  const yMax = 1.002;

  const xS = (K) => padL + ((Math.log10(K) - logKMin) / (logKMax - logKMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const path = IMP3376_ONSET_LADDER.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.shellCount).toFixed(1) + ',' + yS(r.onset).toFixed(2)).join(' ');

  const yTicks = [0.9, 0.93, 0.96, 0.98, 1.0];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(IMP3376_LIMIT_ONSET)} x2={padL + cW} y2={yS(IMP3376_LIMIT_ONSET)} stroke="#475569" strokeWidth={1} strokeDasharray="5 3" />
      <text x={padL + 4} y={yS(IMP3376_LIMIT_ONSET) - 5} fill="#64748b" fontSize={9}>
        K &rarr; infinity recovery: onset = 1 (single-neighbour threshold)
      </text>

      <path d={path} fill="none" stroke="#38bdf8" strokeWidth={2} />
      {IMP3376_ONSET_LADDER.map((r) => {
        const isK1 = r.shellCount === 1;
        const isK2 = r.shellCount === 2;
        const color = isK1 ? '#f59e0b' : isK2 ? '#a78bfa' : '#38bdf8';
        return <circle key={r.shellCount} cx={xS(r.shellCount)} cy={yS(r.onset)} r={isK1 || isK2 ? 3.6 : 2.6} fill={color} />;
      })}

      <text x={xS(1) + 6} y={yS(IMP3376_C_STAR) + 14} fill="#f59e0b" fontSize={9}>
        c* = {IMP3376_C_STAR.toFixed(5)} (K=1, worst)
      </text>
      <text x={xS(2) + 6} y={yS(IMP3376_K2_QUINTIC_ROOT) - 8} fill="#a78bfa" fontSize={9}>
        imp-3046 quintic root {IMP3376_K2_QUINTIC_ROOT.toFixed(5)} (K=2)
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {Ks.map((K) => (
        <g key={'x' + K}>
          <line x1={xS(K)} y1={padT + cH} x2={xS(K)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(K)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            {K}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        K, shell count (log scale)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        onset(K)
      </text>
    </svg>
  );
}

function DecayChart() {
  const svgW = 680;
  const padL = 74;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const Ks = IMP3376_ONSET_LADDER.map((r) => r.shellCount);
  const logKMin = Math.log10(Ks[0]);
  const logKMax = Math.log10(Ks[Ks.length - 1]);
  const measuredVals = IMP3376_ONSET_LADDER.map((r) => r.deltaFrom1);
  const cubicVals = Ks.map((K) => IMP3376_LEADING_COEF_A / K ** IMP3376_DECAY_EXPONENT);
  const inverseKVals = Ks.map((K) => IMP3376_ONSET_LADDER[0].deltaFrom1 / K);
  const allVals = [...measuredVals, ...cubicVals, ...inverseKVals];
  const logYMin = Math.floor(Math.log10(Math.min(...allVals)));
  const logYMax = Math.ceil(Math.log10(Math.max(...allVals)));

  const xS = (K) => padL + ((Math.log10(K) - logKMin) / (logKMax - logKMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logYMin) / (logYMax - logYMin));

  const yTicks = [];
  for (let e = logYMin; e <= logYMax; e++) yTicks.push(Math.pow(10, e));

  const measuredPath = IMP3376_ONSET_LADDER.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.shellCount).toFixed(1) + ',' + yS(r.deltaFrom1).toFixed(2)).join(' ');
  const cubicPath = Ks.map((K, i) => (i === 0 ? 'M' : 'L') + xS(K).toFixed(1) + ',' + yS(IMP3376_LEADING_COEF_A / K ** IMP3376_DECAY_EXPONENT).toFixed(2)).join(' ');
  const inverseKPath = Ks.map((K, i) => (i === 0 ? 'M' : 'L') + xS(K).toFixed(1) + ',' + yS(IMP3376_ONSET_LADDER[0].deltaFrom1 / K).toFixed(2)).join(' ');

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

      <path d={inverseKPath} fill="none" stroke="#64748b" strokeWidth={1.5} strokeDasharray="2 2" />
      <path d={cubicPath} fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2.5" />
      <path d={measuredPath} fill="none" stroke="#38bdf8" strokeWidth={2} />
      {IMP3376_ONSET_LADDER.map((r) => (
        <circle key={r.shellCount} cx={xS(r.shellCount)} cy={yS(r.deltaFrom1)} r={2.6} fill="#38bdf8" />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {Ks.map((K) => (
        <g key={'x' + K}>
          <line x1={xS(K)} y1={padT + cH} x2={xS(K)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(K)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            {K}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        K, shell count (log scale)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        1 - onset(K) (log scale)
      </text>
    </svg>
  );
}

export default function Imp3376KShellOnsetLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Symmetric K-Shell Isolation Onset Ladder (imp-3290)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The symmetric single-shell isolation onset onset(K) -- the worsening threshold for the
        2K+2-body configuration with K unit-spaced neighbours flanking each side of the tracked
        central pair -- rises MONOTONICALLY from c* = sqrt(2+sqrt(3))-1 &asymp;{' '}
        {IMP3376_C_STAR.toFixed(5)} at K=1 (the worst symmetric case) toward the K &rarr; infinity
        limit onset = {IMP3376_LIMIT_ONSET}, which recovers the single-neighbour threshold exactly
        (the telescoping identity psi(2)+&gamma; = 1 pins the limit root at &rho;=1). K=2 reproduces
        the imp-3046 irreducible-quintic root &asymp; {IMP3376_K2_QUINTIC_ROOT.toFixed(5)}.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        onset(K) vs K, rising from c* toward the K &rarr; infinity recovery at 1
      </p>
      <OnsetChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        1 - onset(K) vs K: measured ladder vs the derived cubic law A/K&sup3; vs a bare 1/K guide
      </p>
      <DecayChart />

      <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span><span style={{ color: '#38bdf8' }}>&#9644;</span> measured 1-onset(K)</span>
        <span><span style={{ color: '#f59e0b' }}>&#9644;</span> cubic law A/K&sup3;, A = 6/(3+&pi;&sup2;) &asymp; {IMP3376_LEADING_COEF_A.toFixed(5)}</span>
        <span><span style={{ color: '#64748b' }}>&#9644;</span> bare 1/K guide (pinned at K=1, for scale only)</span>
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> the ladder was originally
        eyeballed as shrinking "~1/K"; the exact telescoping analysis (imp-3370) DERIVES that
        1-onset(K) instead decays CUBICALLY as A/K&sup3; with A = 6/(3+&pi;&sup2;) &asymp;{' '}
        {IMP3376_LEADING_COEF_A.toFixed(5)}, matching the tabulated K=1..40 onsets to ratio &rarr; 1.
        Symmetric sub-family only; the global asymmetric c_glob stays OPEN in ~(0.898, 0.943).
        No RH claim.
      </div>
    </div>
  );
}
