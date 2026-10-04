import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3678_RUNGS,
  IMP3678_Q_FIRST,
  IMP3678_Q_LAST,
  IMP3678_N2C_FIRST,
  IMP3678_N2C_LAST,
  IMP3678_SADDLE_RATIO_FIRST,
  IMP3678_SADDLE_RATIO_LAST,
} from '../data/imp-3678-moment-ratio-asymptotics-viz-data.js';
import { ED } from '../styles/tokens.js';

const Q_COLOR = ED.series1;
const N2C_COLOR = ED.series4;
const SADDLE_COLOR = ED.series3;
const REF_COLOR = ED.series8;

function GrowthChart() {
  const svgW = 620;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const nMin = 3;
  const nMax = 18;
  const yMin = 0;
  const yMax = 0.14;

  const xS = (n) => padL + ((n - nMin) / (nMax - nMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const qPath = IMP3678_RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.momentRatio).toFixed(1)).join(' ');
  const n2cPath = IMP3678_RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.n2LeadingCoeff).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[3, 6, 9, 12, 15, 18].map((n) => (
        <g key={n}>
          <line x1={xS(n)} y1={padT} x2={xS(n)} y2={padT + cH} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={xS(n)} y={padT + cH + 15} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {n}
          </text>
        </g>
      ))}

      <path d={n2cPath} fill="none" stroke={N2C_COLOR} strokeWidth={1.75} />
      {IMP3678_RUNGS.map((r) => (
        <circle key={'c' + r.n} cx={xS(r.n)} cy={yS(r.n2LeadingCoeff)} r={3.5} fill={N2C_COLOR} stroke="#3b1d05" strokeWidth={1} />
      ))}

      <path d={qPath} fill="none" stroke={Q_COLOR} strokeWidth={1.75} />
      {IMP3678_RUNGS.map((r) => (
        <circle key={'q' + r.n} cx={xS(r.n)} cy={yS(r.momentRatio)} r={3.5} fill={Q_COLOR} stroke="#052e1f" strokeWidth={1} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        n
      </text>
      <text x={padL + 8} y={padT + 14} fill={Q_COLOR} fontSize={9}>
        Q_n = M_(n+2)/M_n (no ceiling)
      </text>
      <text x={padL + 8} y={padT + 26} fill={N2C_COLOR} fontSize={9}>
        n^2 C_n (strictly increasing, not const)
      </text>
    </svg>
  );
}

function SaddleRatioChart() {
  const svgW = 620;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const nMin = 3;
  const nMax = 18;
  const yMin = 1;
  const yMax = 1.6;

  const xS = (n) => padL + ((n - nMin) / (nMax - nMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const path = IMP3678_RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.qOverSaddleQ).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[3, 6, 9, 12, 15, 18].map((n) => (
        <g key={n}>
          <line x1={xS(n)} y1={padT} x2={xS(n)} y2={padT + cH} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={xS(n)} y={padT + cH + 15} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {n}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(1)} x2={padL + cW} y2={yS(1)} stroke={REF_COLOR} strokeWidth={1.25} strokeDasharray="4,3" />
      <text x={padL + 4} y={yS(1) - 5} fill={REF_COLOR} fontSize={9}>
        Q_n / tau*(n)^2 = 1
      </text>

      <path d={path} fill="none" stroke={SADDLE_COLOR} strokeWidth={1.75} />
      {IMP3678_RUNGS.map((r) => (
        <circle key={r.n} cx={xS(r.n)} cy={yS(r.qOverSaddleQ)} r={3.5} fill={SADDLE_COLOR} stroke="#052e1f" strokeWidth={1} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        n
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,14,${padT + cH / 2})`}>
        Q_n / tau*(n)^2
      </text>
    </svg>
  );
}

function RungTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>n</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>Q_n</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>n^2 C_n</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>Q_n/tau*^2</th>
        </tr>
      </thead>
      <tbody>
        {IMP3678_RUNGS.map((r) => (
          <tr key={r.n} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{r.n}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: Q_COLOR }}>{r.momentRatio.toFixed(5)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: N2C_COLOR }}>{r.n2LeadingCoeff.toFixed(5)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: SADDLE_COLOR }}>{r.qOverSaddleQ.toFixed(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp3678MomentRatioAsymptoticsViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Remainder-Tail Moment-Ratio Asymptotics (imp-3646)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-3646 measured the driving moment ratio Q_n = M_(n+2)/M_n across the rung ladder
        n=3..18. A natural guess was that Q_n saturates to a fixed A-scale ceiling b^2, giving
        C_n ~ b^2/n^2 with a constant prefactor. The guess is REFUTED: the A-weight decays
        super-exponentially with no hard support endpoint, so Q_n grows strictly from{' '}
        {IMP3678_Q_FIRST.toFixed(5)} (n=3) to {IMP3678_Q_LAST.toFixed(5)} (n=18), and n^2 C_n grows
        alongside it from {IMP3678_N2C_FIRST.toFixed(5)} to {IMP3678_N2C_LAST.toFixed(5)}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Q_n and n^2 C_n both climbing without a ceiling over n=3..18
      </p>
      <GrowthChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Laplace saddle ratio Q_n / tau*(n)^2 falling monotonically toward 1 from above
      </p>
      <SaddleRatioChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Measured rungs
      </p>
      <RungTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the top chart shows
        neither Q_n (blue) nor n^2 C_n (amber) leveling off across the ladder -- both keep
        climbing, refuting a fixed-constant b^2/n^2 law for C_n. The bottom chart shows why:
        the growth is governed by the Laplace saddle tau*(n) of the moment integrand
        tau^n A(tau), and the measured ratio Q_n/tau*(n)^2 falls monotonically toward 1
        ({IMP3678_SADDLE_RATIO_FIRST.toFixed(3)} at n=3 &rarr; {IMP3678_SADDLE_RATIO_LAST.toFixed(3)}{' '}
        at n=18), confirming Q_n ~ tau*(n)^2 with tau*(n) ~ (ln n)/4 and hence the closed
        slowly-varying law C_n ~ (ln n)^2/(16 n^2): a genuine decay law with a log-divergent,
        not fixed, prefactor.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/derivation
        only -- this visualizes the imp-3646 large-n asymptotics of a fixed-weight Taylor
        remainder coefficient family. It establishes NO operator positivity. RH-equivalent,
        necessary-but-not-sufficient. The imp-3066 K_a &ge; 0 sign-positivity obstruction
        remains untouched. No QED.
      </div>
    </div>
  );
}
