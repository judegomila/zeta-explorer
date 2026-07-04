import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33302_LADDER,
  IMP33302_HALF,
  IMP33302_P_EFF_RANGE,
} from '../data/imp-33302-sliding-start-exponent-ladder-viz-data.js';

const P_EFF_COLOR = '#38bdf8';
const HALF_COLOR = '#f472b6';
const R2_COLOR = '#facc15';
const ENDPOINT_COLOR = '#34d399';

function SlidingStartLadderChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 48;
  const padT = 28;
  const padB = 52;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const n = IMP33302_LADDER.length;
  const yLo = 0.46;
  const yHi = 0.505;
  const yS = (v) => padT + cH * (1 - (v - yLo) / (yHi - yLo));

  // R^2 shares the plot height but on its own [0.998, 1.0] sub-range for readability.
  const r2Lo = 0.998;
  const r2Hi = 1.0;
  const yR2 = (v) => padT + cH * (1 - (v - r2Lo) / (r2Hi - r2Lo));

  const slot = cW / (n - 1);
  const xAt = (i) => padL + i * slot;

  const pEffPoints = IMP33302_LADDER.map((r, i) => `${xAt(i)},${yS(r.p_eff)}`).join(' ');
  const r2Points = IMP33302_LADDER.map((r, i) => `${xAt(i)},${yR2(Math.max(r.R2, r2Lo))}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0.46, 0.47, 0.48, 0.49, 0.5].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      {[0.998, 0.9985, 0.999, 0.9995, 1.0].map((v) => (
        <text key={v} x={padL + cW + 6} y={yR2(v) + 3.5} textAnchor="start" fill="#a3813f" fontSize={9}>
          {v.toFixed(4)}
        </text>
      ))}

      {/* imp-3463 far-tail 1/2 asymptote */}
      <line
        x1={padL}
        y1={yS(IMP33302_HALF)}
        x2={padL + cW}
        y2={yS(IMP33302_HALF)}
        stroke={HALF_COLOR}
        strokeWidth={1.25}
        strokeDasharray="3,3"
      />
      <text x={padL + 4} y={yS(IMP33302_HALF) - 5} fill={HALF_COLOR} fontSize={9}>
        1/2 (imp-3463 far-tail asymptote)
      </text>

      <polyline points={r2Points} fill="none" stroke={R2_COLOR} strokeWidth={1.5} strokeDasharray="4,2" />
      <polyline points={pEffPoints} fill="none" stroke={P_EFF_COLOR} strokeWidth={2} />

      {IMP33302_LADDER.map((r, i) => {
        const isEndpoint = i === n - 1;
        return (
          <g key={r.startOffsetDecades}>
            <circle
              cx={xAt(i)}
              cy={yR2(Math.max(r.R2, r2Lo))}
              r={isEndpoint ? 4 : 2.5}
              fill={R2_COLOR}
              stroke={isEndpoint ? ENDPOINT_COLOR : 'none'}
              strokeWidth={isEndpoint ? 1.5 : 0}
            />
            <circle
              cx={xAt(i)}
              cy={yS(r.p_eff)}
              r={isEndpoint ? 4.5 : 3}
              fill={P_EFF_COLOR}
              stroke={isEndpoint ? ENDPOINT_COLOR : 'none'}
              strokeWidth={isEndpoint ? 1.75 : 0}
            />
            {isEndpoint && (
              <text x={xAt(i) - 6} y={yS(r.p_eff) - 10} textAnchor="end" fill={ENDPOINT_COLOR} fontSize={9} fontWeight={700}>
                {r.p_eff.toFixed(4)}
              </text>
            )}
            <text x={xAt(i)} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={8.5}>
              +{r.startOffsetDecades}d
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        p_eff
      </text>
      <text x={svgW - 12} y={padT + cH / 2} textAnchor="middle" fill="#a3813f" fontSize={10} transform={`rotate(-90,${svgW - 12},${padT + cH / 2})`}>
        R^2
      </text>
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        window-start offset s past the imp-3444 crossover (fixed 12-decade span)
      </text>
    </svg>
  );
}

export default function Imp33302SlidingStartExponentLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Sliding-Start Sigma Decay-Exponent Ladder: p_eff(s) -> 1/2 (imp-33274)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-33255 fit a single crossover-anchored window and found the OLS effective decay
        exponent p_eff of sigma(N) = E_coll/E(N) window-dependent, climbing ~0.39&ndash;0.49 as
        the window span grew. imp-33274 holds the span fixed (12 decades) and instead slides the
        window START later past the imp-3444 crossover, for offsets s = 0, 3, 6, 12, 24, 48
        decades. The blue line below is p_eff(s), climbing monotonely toward the dashed pink
        imp-3463 far-tail asymptote 1/2; the gold dashed line is the fit R^2 on its own
        [0.998, 1.0] right-hand axis, rising toward 1 as the crossover ramp is excluded. The
        endpoint (s = +48d, p_eff = 0.4965) is outlined in green.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        p_eff(s) and R^2(s), six sliding-start rungs
      </p>
      <SlidingStartLadderChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> at s = 0 (window
        anchored at the crossover, reproducing imp-33255) p_eff = {IMP33302_P_EFF_RANGE[0].toFixed(4)}
        {' '}and R^2 = 0.99894. Sliding the same-span window later monotonely lifts p_eff toward
        1/2 -- reaching {IMP33302_P_EFF_RANGE[1].toFixed(4)} at s = +48d, a gap of only 3.475e-3 --
        while R^2 rises to 1.0000000. No intermediate plateau appears below 1/2: the residual
        imp-3529 local-exponent drift that imp-33255 left open is localised to the crossover
        ramp, and sliding past it settles the exponent onto the exact sqrt(1/N) far-tail law.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> presentation of the
        imp-33274 sliding-start measurement only -- a finite six-rung OLS fit ladder, not a
        certified N-uniform statement. Adds no new Lambda bound, does not tighten imp-3910's
        certified C &le; 54.56, and does not touch imp-3066's K_a &ge; 0 positivity.
        RH-equivalent, NO QED. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
