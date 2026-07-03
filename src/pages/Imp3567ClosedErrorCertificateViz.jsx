import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3567_RUNGS,
  IMP3567_A_LADDER,
  IMP3567_SUPPORT_CAP_TA,
  IMP3567_WORST_TAIL_OVER_SHARP,
} from '../data/imp-3567-closed-error-certificate-viz-data.js';

const A_MIN = 0.1;
const A_MAX = 0.6;

function RungPanel({ rung }) {
  const w = 168;
  const padL = 40;
  const padR = 8;
  const padT = 18;
  const padB = 26;
  const cW = w - padL - padR;
  const cH = 120;
  const h = padT + cH + padB;

  const values = rung.points.flatMap((p) => [p.tail, p.sharp, p.clean]);
  const logMin = Math.floor(Math.log10(Math.min(...values)));
  const logMax = Math.ceil(Math.log10(Math.max(...values)));
  const yMin = logMin - 0.15;
  const yMax = logMax + 0.15;

  const logAMin = Math.log10(A_MIN);
  const logAMax = Math.log10(A_MAX);
  const xS = (a) => padL + ((Math.log10(a) - logAMin) / (logAMax - logAMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const pathFor = (key) => rung.points.map((p, i) => (i === 0 ? 'M' : 'L') + xS(p.a).toFixed(1) + ',' + yS(p[key]).toFixed(2)).join(' ');

  const yTicks = [];
  for (let e = logMin; e <= logMax; e += 1) yTicks.push(Math.pow(10, e));

  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <line key={v} x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.6} />
      ))}
      {yTicks.length > 0 && (
        <>
          <text x={padL - 4} y={yS(yTicks[0]) + 3} textAnchor="end" fill="#475569" fontSize={7.5}>
            {yTicks[0].toExponential(0)}
          </text>
          <text x={padL - 4} y={yS(yTicks[yTicks.length - 1]) + 3} textAnchor="end" fill="#475569" fontSize={7.5}>
            {yTicks[yTicks.length - 1].toExponential(0)}
          </text>
        </>
      )}

      <path d={pathFor('clean')} fill="none" stroke="#93c5fd" strokeWidth={1.3} strokeDasharray="1 2" />
      <path d={pathFor('sharp')} fill="none" stroke="#7c3aed" strokeWidth={1.5} strokeDasharray="4 2.5" />
      <path d={pathFor('tail')} fill="none" stroke="#f59e0b" strokeWidth={2} />

      {rung.points.map((p) => (
        <circle key={'t' + p.a} cx={xS(p.a)} cy={yS(p.tail)} r={2.4} fill="#f59e0b" />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP3567_A_LADDER.map((a) => (
        <text key={'x' + a} x={xS(a)} y={padT + cH + 12} textAnchor="middle" fill="#64748b" fontSize={7.5}>
          {a}
        </text>
      ))}

      <text x={padL + cW / 2} y={h - 4} textAnchor="middle" fill="#94a3b8" fontSize={9} fontWeight={700}>
        n = {rung.n}
      </text>
    </svg>
  );
}

export default function Imp3567ClosedErrorCertificateViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 980, margin: '0 auto' }}>
      <PageHeader title="Closed Error Certificate vs. Exact Residual E_n(a) Across the a-Ladder (imp-3532 / imp-3567)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-3532 promoted the imp-3501 O(a<sup>n+2</sup>) moment-tail statement into an explicit
        closed error bound valid for every n: |E<sub>n</sub>(a)| &le; (a<sup>n+2</sup>/(n+2)!)
        M<sub>n+2</sub> cosh(a T<sub>A</sub>) &le; (a<sup>n+2</sup>/(n+2)!) M<sub>n+2</sub>
        e<sup>a T<sub>A</sub></sup>, with T<sub>A</sub> = {IMP3567_SUPPORT_CAP_TA} the compact
        support cap. Each panel below plots the exact residual tail |E<sub>n</sub>(a)| (solid,
        orange), the SHARP cosh bound (dashed, violet), and the clean e<sup>a T<sub>A</sub></sup>
        bound (dotted, blue) across a &isin; {'{'}0.125, 0.25, 0.5{'}'} for rungs n = 0..4 &mdash;
        the certificate bounds the residual on every rung, with the sharp cosh constant
        strictly tighter than the clean exp constant throughout.
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '1rem',
          background: 'rgba(148,163,184,0.03)',
          borderRadius: 6,
        }}
      >
        {IMP3567_RUNGS.map((rung) => (
          <RungPanel key={rung.n} rung={rung} />
        ))}
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span><span style={{ color: '#f59e0b' }}>&#9644;</span> exact residual |E<sub>n</sub>(a)|</span>
        <span><span style={{ color: '#7c3aed' }}>&#9644;</span> sharp bound: cosh(a T<sub>A</sub>) constant</span>
        <span><span style={{ color: '#93c5fd' }}>&#9644;</span> clean bound: e<sup>a T<sub>A</sub></sup> constant</span>
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> derivation/certification
        only &mdash; no proof, no reduction below RH. This certifies an explicit closed constant
        for the small-a moment-tail error of the A-weighted masses; it establishes no operator
        positivity. Mass-feasibility is necessary-but-not-sufficient, and the degree-2 face
        carries no feasibility comparison at all (imp-3469: D_2 = 0). The operator-level
        K_a &ge; 0 sign-positivity residual (imp-3066) remains untouched. Platt-Trudgian
        &Lambda; &le; 0.2 remains the rigorous SOTA. (Worst tail/sharp-bound ratio across all
        rungs and a: {IMP3567_WORST_TAIL_OVER_SHARP.toFixed(3)}, strictly below 1.)
      </div>
    </div>
  );
}
