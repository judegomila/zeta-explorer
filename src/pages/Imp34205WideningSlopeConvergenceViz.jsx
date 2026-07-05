import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34205_SWEEP_POINTS,
  IMP34205_EXP_APPROACH_CURVE,
  IMP34205_POW_APPROACH_CURVE,
  IMP34205_LIMIT_MARKERS,
  IMP34205_SLOPE_STEPS,
  IMP34205_CAVEAT_BANNER,
} from '../data/imp-34205-widening-slope-convergence-viz-data.js';

function SlopeConvergenceChart() {
  const svgW = 720;
  const padL = 64;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const svgH = 280;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kMin = 11;
  const kMax = 18;
  const xS = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;

  const bMin = -1.5;
  const bMax = -1.0;
  const yS = (b) => padT + cH - ((b - bMin) / (bMax - bMin)) * cH;

  const expPoints = IMP34205_EXP_APPROACH_CURVE.map((r) => `${xS(r.kEnd)},${yS(r.b)}`).join(' ');
  const powPoints = IMP34205_POW_APPROACH_CURVE.map((r) => `${xS(r.kEnd)},${yS(r.b)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {[-1.0, -1.1, -1.2, -1.3, -1.4, -1.5].map((b) => (
        <g key={'yt' + b}>
          <line x1={padL - 4} y1={yS(b)} x2={padL + cW} y2={yS(b)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yS(b) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {b.toFixed(2)}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(IMP34205_LIMIT_MARKERS.expBInf)}
        x2={padL + cW}
        y2={yS(IMP34205_LIMIT_MARKERS.expBInf)}
        stroke="#4ade80"
        strokeWidth={1}
        strokeDasharray="4,3"
      />
      <text x={padL + 6} y={yS(IMP34205_LIMIT_MARKERS.expBInf) - 6} fill="#4ade80" fontSize={9}>
        b_inf (exp-approach) {IMP34205_LIMIT_MARKERS.expBInf.toFixed(3)}
      </text>

      {[11, 12, 13, 14, 15, 16, 17, 18].map((k) => (
        <g key={'xt' + k}>
          <line x1={xS(k)} y1={padT + cH - 4} x2={xS(k)} y2={padT + cH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xS(k)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {k}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        kEnd (ladder window right edge)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        b (OLS widening slope)
      </text>

      <polyline points={powPoints} fill="none" stroke="#f87171" strokeWidth={1.25} strokeDasharray="6,3" />
      <polyline points={expPoints} fill="none" stroke="#38bdf8" strokeWidth={1.75} />
      {IMP34205_SWEEP_POINTS.map((r) => (
        <circle key={'pt' + r.kEnd} cx={xS(r.kEnd)} cy={yS(r.b)} r={2.75} fill="#c4b5fd" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
    </svg>
  );
}

function SlopeStepChart() {
  const svgW = 720;
  const padL = 64;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const svgH = 200;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const n = IMP34205_SLOPE_STEPS.length;
  const barW = (cW / n) * 0.7;
  const stepMax = Math.max(...IMP34205_SLOPE_STEPS);
  const yS = (v) => padT + cH - (v / stepMax) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {[0, stepMax / 2, stepMax].map((v) => (
        <g key={'yt' + v}>
          <line x1={padL - 4} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yS(v) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}

      {IMP34205_SLOPE_STEPS.map((v, i) => {
        const x = padL + (i + 0.15) * (cW / n);
        const y = yS(v);
        return (
          <rect
            key={'bar' + i}
            x={x}
            y={y}
            width={barW}
            height={padT + cH - y}
            fill="#a78bfa"
            opacity={0.4 + 0.5 * (i / (n - 1))}
          />
        );
      })}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        sweep step index (kEnd increasing by 0.5)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        step increment of b
      </text>
    </svg>
  );
}

export default function Imp34205WideningSlopeConvergenceViz() {
  const { expBInf, expLam, expSsr, powBInf, powP, powSsr, ssrRatioPowOverExp, localSlopeMean } = IMP34205_LIMIT_MARKERS;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Widening-Slope Drift Convergence (imp-34205 / imp-34129)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34022 found the imp-33843 log-linear widening slope b tilts across three windows
        (kEnd 11, 11.5, 12), leaving open whether it drifts open-endedly or saturates. imp-34129
        extended the imp-33810/imp-33877 ladder to kEnd=18 and fit the drift b(kEnd) to two
        saturating surrogates. The exponential-approach form (blue) fits ~{ssrRatioPowOverExp}&times;
        tighter than the power-approach form (red, dashed) and converges to a finite limit b_inf
        &asymp; {expBInf.toFixed(3)}, corroborated by the local tail slope of y(k) plateauing near{' '}
        {localSlopeMean.toFixed(3)}.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        measured b(kEnd) (purple points) vs exponential-approach fit (blue) vs power-approach fit (red, dashed)
      </p>
      <SlopeConvergenceChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        per-step increment of b across the sweep (shrinking bars = decelerating drift = convergent)
      </p>
      <SlopeStepChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>fit</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>b_inf</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rate</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>SSR</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>exponential-approach (winner)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{expBInf.toFixed(6)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>lam={expLam}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{expSsr.toExponential(3)}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>power-approach</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{powBInf.toFixed(6)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>p={powP}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{powSsr.toExponential(3)}</td>
          </tr>
        </tbody>
      </table>

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> {IMP34205_CAVEAT_BANNER}
      </div>
    </div>
  );
}
