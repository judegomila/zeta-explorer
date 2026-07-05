import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from '../data/imp-33810-eflow-resid-ratio-N-ladder.js';

const { ladder, ratioTrend } = IMP33810_EFLOW_RESID_RATIO_N_LADDER;
const {
  imp33773_M2_head_resid_over_eflow: HEAD_ROE,
  imp33773_M2_tail_resid_over_eflow: TAIL_ROE,
  same_sign_positive: SAME_SIGN,
} = ratioTrend;

function EflowResidRatioChart() {
  const svgW = 720;
  const padL = 48;
  const padR = 32;
  const padT = 20;
  const padB = 40;
  const svgH = 300;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kMin = 6;
  const kMax = 11;
  const xS = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;

  // log10 scale on y: ratio ranges from ~5.2e-4 (tail) to ~0.47 (head), unity=1 sits above all points.
  const logMin = -3.4;
  const logMax = 0.15;
  const yS = (ratio) => padT + cH - ((Math.log10(ratio) - logMin) / (logMax - logMin)) * cH;

  const yTicks = [1, 0.1, 0.01, 0.001];
  const xTicks = [6, 7, 8, 9, 10, 11];

  const points = ladder.map((r) => `${xS(r.k)},${yS(r.eflow_over_resid)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {t}
          </text>
        </g>
      ))}

      {/* unity reference line -- ratio never reaches it */}
      <line
        x1={padL}
        y1={yS(1)}
        x2={padL + cW}
        y2={yS(1)}
        stroke="#f87171"
        strokeWidth={1.25}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yS(1) - 5} textAnchor="end" fill="#f87171" fontSize={9}>
        unity (eflow = resid)
      </text>

      {xTicks.map((k) => (
        <g key={'xt' + k}>
          <line x1={xS(k)} y1={padT + cH - 4} x2={xS(k)} y2={padT + cH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xS(k)} y={padT + cH + 18} textAnchor="middle" fill="#64748b" fontSize={9}>
            {'10^' + k}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        N (window upper endpoint, log scale)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        eflow_attr / resid_exp (log scale)
      </text>

      <polyline points={points} fill="none" stroke="#a78bfa" strokeWidth={1.75} />
      {ladder.map((r) => (
        <circle
          key={'pt' + r.k}
          cx={xS(r.k)}
          cy={yS(r.eflow_over_resid)}
          r={2.75}
          fill="#c4b5fd"
          stroke="#0a0f1a"
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}

export default function Imp33831EflowResidRatioLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow / Offset-Residual Ratio Ladder (imp-33810 / imp-33831)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33810 tracked the E_flow-term / offset-residual ratio across a quarter-decade sliding
        window ladder, k = 6.00 .. 11.00 (21 rungs), to lock the imp-33773 M2 refutation as a
        robust trend rather than a single tail number. This page is the first consumer of that
        module: eflow_attr/resid_exp plotted against the window upper endpoint N, with the unity
        reference line showing that the ratio never reaches 1 -- the separation only widens as N
        grows, from &sim;0.4687 at the head (k=6) down to &sim;5.19e-4 in the tail (k=11).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        eflow_attr / resid_exp vs N, 21 quarter-decade rungs, log-log axes
      </p>
      <EflowResidRatioChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>resid_exp</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>eflow_attr</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>eflow / resid</th>
          </tr>
        </thead>
        <tbody>
          {ladder.map((r) => (
            <tr key={r.k} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.k.toFixed(2)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.resid_exp}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.eflow_attr}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: '#a78bfa' }}>
                {r.eflow_over_resid}
              </td>
            </tr>
          ))}
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/attribution only
        -- imp-33810 changes no value and derives nothing new, and this page adds no new
        derivation either. It gives the 21-rung ratio ladder a visual surface: the ratio is
        strictly below unity at every rung ({ratioTrend.all_below_unity ? 'confirmed' : 'not confirmed'})
        and strictly monotone-decreasing in N. E_flow is a strictly-shrinking <strong>positive</strong>{' '}
        fraction of the offset residual throughout -- resid_exp and eflow_attr share the same sign
        at all 21 rungs ({SAME_SIGN ? 'confirmed, no sign flip' : 'not confirmed'}), so this is a
        magnitude separation, not a sign coincidence. That separation itself widens monotonically
        from only &sim;{HEAD_ROE.toFixed(1)}x at the head (k=6) to &sim;{TAIL_ROE.toFixed(1)}x in
        the tail (k=11) -- the imp-33773 M2 "~1900x" figure is the tail endpoint of this trend, not
        a uniform order-of-magnitude gap. No bound changes; establishes no operator
        positivity; imp-3066 K_a &ge; 0 remains untouched. No RH verdict, NO QED. Platt-Trudgian
        &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
