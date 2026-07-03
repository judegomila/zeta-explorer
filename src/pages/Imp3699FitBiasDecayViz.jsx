import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3699_RUNGS,
  IMP3699_FIT_BIAS_FIRST,
  IMP3699_FIT_BIAS_LAST,
  IMP3699_RATIO_LN_FIRST,
  IMP3699_RATIO_LN_LAST,
  IMP3699_SADDLE_RATIO_FIRST,
  IMP3699_SADDLE_RATIO_LAST,
} from '../data/imp-3699-fit-bias-decay-viz-data.js';

const BIAS_COLOR = '#38bdf8';
const RATIO_COLOR = '#f59e0b';
const SADDLE_COLOR = '#34d399';
const REF_COLOR = '#64748b';

function FitBiasDecayChart() {
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
  const yMin = Math.log10(IMP3699_FIT_BIAS_LAST) - 0.2;
  const yMax = Math.log10(IMP3699_FIT_BIAS_FIRST) + 0.2;

  const xS = (n) => padL + ((n - nMin) / (nMax - nMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const path = IMP3699_RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.fitBias).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[3, 6, 9, 12, 15, 18].map((n) => (
        <g key={n}>
          <line x1={xS(n)} y1={padT} x2={xS(n)} y2={padT + cH} stroke="#1e293b" strokeWidth={0.7} />
          <text x={xS(n)} y={padT + cH + 15} textAnchor="middle" fill="#64748b" fontSize={9}>
            {n}
          </text>
        </g>
      ))}

      <path d={path} fill="none" stroke={BIAS_COLOR} strokeWidth={1.75} />

      {IMP3699_RUNGS.map((r) => (
        <circle key={r.n} cx={xS(r.n)} cy={yS(r.fitBias)} r={3.5} fill={BIAS_COLOR} stroke="#052e1f" strokeWidth={1} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={10}>
        n
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,14,${padT + cH / 2})`}>
        |p_fit - 2| (log scale)
      </text>
    </svg>
  );
}

function RatioDriftChart() {
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
  const yMinRatio = 0;
  const yMaxRatio = 0.0008;
  const yMinSaddle = 1;
  const yMaxSaddle = 3.7;

  const xS = (n) => padL + ((n - nMin) / (nMax - nMin)) * cW;
  const yRatio = (v) => padT + cH * (1 - (v - yMinRatio) / (yMaxRatio - yMinRatio));
  const ySaddle = (v) => padT + cH * (1 - (v - yMinSaddle) / (yMaxSaddle - yMinSaddle));

  const ratioPath = IMP3699_RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yRatio(r.ratioToLnRate).toFixed(1)).join(' ');
  const saddlePath = IMP3699_RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + ySaddle(r.saddleDnRatio).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[3, 6, 9, 12, 15, 18].map((n) => (
        <g key={n}>
          <line x1={xS(n)} y1={padT} x2={xS(n)} y2={padT + cH} stroke="#1e293b" strokeWidth={0.7} />
          <text x={xS(n)} y={padT + cH + 15} textAnchor="middle" fill="#64748b" fontSize={9}>
            {n}
          </text>
        </g>
      ))}

      <line x1={padL} y1={ySaddle(1)} x2={padL + cW} y2={ySaddle(1)} stroke={REF_COLOR} strokeWidth={1.25} strokeDasharray="4,3" />
      <text x={padL + 4} y={ySaddle(1) - 5} fill={REF_COLOR} fontSize={9}>
        saddle ratio = 1
      </text>

      <path d={saddlePath} fill="none" stroke={SADDLE_COLOR} strokeWidth={1.75} />
      {IMP3699_RUNGS.map((r) => (
        <circle key={'s' + r.n} cx={xS(r.n)} cy={ySaddle(r.saddleDnRatio)} r={3.5} fill={SADDLE_COLOR} stroke="#052e1f" strokeWidth={1} />
      ))}

      <path d={ratioPath} fill="none" stroke={RATIO_COLOR} strokeWidth={1.75} />
      {IMP3699_RUNGS.map((r) => (
        <circle
          key={'r' + r.n}
          cx={xS(r.n)}
          cy={padT + cH * (1 - r.ratioToLnRate / yMaxRatio)}
          r={3.5}
          fill={RATIO_COLOR}
          stroke="#3b1d05"
          strokeWidth={1}
        />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={10}>
        n
      </text>
      <text x={padL + 8} y={padT + 14} fill={SADDLE_COLOR} fontSize={9}>
        |D_n|/|D_n^saddle| (right axis, 1..3.7) -&gt; 1
      </text>
      <text x={padL + 8} y={padT + 26} fill={RATIO_COLOR} fontSize={9}>
        |p_fit-2| / ((ln n)^2/n^3) (left axis, 0..8e-4) -- still climbing
      </text>
    </svg>
  );
}

function RungTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: '#94a3b8' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #334155' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>n</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>|p_fit-2|</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>ratio to (ln n)^2/n^3</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>|D_n|/|D_n^saddle|</th>
        </tr>
      </thead>
      <tbody>
        {IMP3699_RUNGS.map((r) => (
          <tr key={r.n} style={{ borderBottom: '1px solid #1e293b' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{r.n}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: BIAS_COLOR }}>{r.fitBias.toExponential(4)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: RATIO_COLOR }}>{r.ratioToLnRate.toExponential(4)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: SADDLE_COLOR }}>{r.saddleDnRatio.toFixed(5)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp3699FitBiasDecayViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Observable Fit-Bias Decay Rate (imp-3670)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-3670 measured the observable fit-bias |p_fit - 2| across the rung ladder n=3..18 and
        compared it against the imp-3646-derived slowly-varying rate (ln n)^2/n^3. The observable
        law |p_fit-2| = |D_n| cov(a^2,ln a)/var(ln a) holds to &le; 2e-9 at every rung, and
        |p_fit-2| decays monotonically from {IMP3699_FIT_BIAS_FIRST.toExponential(4)} (n=3) to{' '}
        {IMP3699_FIT_BIAS_LAST.toExponential(4)} (n=18).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Observable fit-bias |p_fit - 2| decaying monotonically over n=3..18
      </p>
      <FitBiasDecayChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Naive (ln n)^2/n^3 ratio drifting up (orange) vs the exact-saddle ratio converging to 1 (green)
      </p>
      <RatioDriftChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Measured rungs
      </p>
      <RungTable />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the top chart shows the
        observable |p_fit-2| falling monotonically (log scale) across the ladder. The bottom chart
        shows why the naive (ln n)^2/n^3 rate is misleading at these finite rungs: the ratio
        |p_fit-2| / ((ln n)^2/n^3) (orange) is still strictly climbing at n=18
        ({IMP3699_RATIO_LN_FIRST.toExponential(3)} &rarr; {IMP3699_RATIO_LN_LAST.toExponential(3)},
        ~2.9&times;), while the ratio built from the exact Laplace saddle |D_n|/|D_n^saddle|
        (green) falls monotonically toward 1 ({IMP3699_SADDLE_RATIO_FIRST.toFixed(3)} &rarr;{' '}
        {IMP3699_SADDLE_RATIO_LAST.toFixed(3)}). The drift is the crude tau*(n) ~ (ln n)/4
        substitution used to simplify the saddle, not a missing term in the underlying law.
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
        visualizes the imp-3670 observable decay-rate readout used inside a mass-feasibility
        diagnostic. It establishes NO operator positivity. RH-equivalent, necessary-but-not-sufficient.
        The imp-3066 K_a &ge; 0 sign-positivity obstruction remains untouched; Platt-Trudgian
        &Lambda; &le; 0.2 remains the rigorous SOTA. Named residual sg-3670-lnn-saddle-not-asymptotic-at-n18.
      </div>
    </div>
  );
}
