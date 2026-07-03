import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3697_RUNGS,
  IMP3697_RATIO_FIRST,
  IMP3697_RATIO_LAST,
  IMP3697_UNDERFLOW_THRESHOLD_TAU,
} from '../data/imp-3697-a-weight-decay-crosscheck-viz-data.js';

const RATIO_COLOR = '#38bdf8';
const REF_COLOR = '#64748b';
const LOG_DOMAIN_COLOR = '#34d399';
const UNDERFLOW_COLOR = '#f87171';

function RatioConvergenceChart() {
  const svgW = 620;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const xMin = 0.3;
  const xMax = 2.2;
  const yMin = 0.99;
  const yMax = 1.04;

  const xS = (tau) => padL + ((tau - xMin) / (xMax - xMin)) * cW;
  const yS = (r) => padT + cH * (1 - (r - yMin) / (yMax - yMin));

  const path = IMP3697_RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.tau).toFixed(1) + ',' + yS(r.ratio).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0.99, 1.0, 1.01, 1.02, 1.03, 1.04].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(1)} x2={padL + cW} y2={yS(1)} stroke={REF_COLOR} strokeWidth={1.25} strokeDasharray="4,3" />
      <text x={padL + cW - 4} y={yS(1) - 5} textAnchor="end" fill={REF_COLOR} fontSize={9}>
        ratio = 1
      </text>

      <path d={path} fill="none" stroke={RATIO_COLOR} strokeWidth={1.75} />

      {IMP3697_RUNGS.map((r) => (
        <circle key={r.tau} cx={xS(r.tau)} cy={yS(r.ratio)} r={5} fill={RATIO_COLOR} stroke="#052e1f" strokeWidth={1.25} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {[0.5, 1.0, 1.5, 2.0].map((tau) => (
        <g key={'x' + tau}>
          <line x1={xS(tau)} y1={padT + cH} x2={xS(tau)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(tau)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            {tau}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        tau
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,14,${padT + cH / 2})`}>
        -ln A(tau) / (pi e^4tau)
      </text>
    </svg>
  );
}

function MagnitudeBarChart() {
  const svgW = 460;
  const padL = 50;
  const padR = 24;
  const padT = 20;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = 160;
  const svgH = padT + cH + padB;

  const barW = cW / IMP3697_RUNGS.length - 20;
  const maxDigits = 4200;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />
      {IMP3697_RUNGS.map((r, i) => {
        const digits = -r.aExponentLog10;
        const h = (Math.log10(digits) / Math.log10(maxDigits)) * cH;
        const x = padL + i * (cW / IMP3697_RUNGS.length) + 10;
        const y = padT + cH - h;
        const color = r.directDoubleUnderflowed ? LOG_DOMAIN_COLOR : RATIO_COLOR;
        return (
          <g key={r.tau}>
            <rect x={x} y={y} width={barW} height={h} fill={color} rx={2} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill="#94a3b8" fontSize={9}>
              1e{r.aExponentLog10}
            </text>
            <text x={x + barW / 2} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
              tau={r.tau}
            </text>
            {r.directDoubleUnderflowed && (
              <text x={x + barW / 2} y={padT + cH - h - 18} textAnchor="middle" fill={UNDERFLOW_COLOR} fontSize={9}>
                direct-double: 0
              </text>
            )}
          </g>
        );
      })}
      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={10}>
        A(tau) magnitude (log domain, exact at every rung)
      </text>
    </svg>
  );
}

function RungTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: '#94a3b8' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #334155' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>tau</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>-ln A(tau)</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>pi e^4tau</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>ratio</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>direct-double</th>
        </tr>
      </thead>
      <tbody>
        {IMP3697_RUNGS.map((r) => (
          <tr key={r.tau} style={{ borderBottom: '1px solid #1e293b' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{r.tau}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: RATIO_COLOR }}>{r.negLnA}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{r.lawNegLn}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{r.ratio}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: r.directDoubleUnderflowed ? UNDERFLOW_COLOR : '#94a3b8' }}>
              {r.directDoubleUnderflowed ? 'underflows to 0' : 'ok'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp3697AWeightDecayCrosscheckViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="A-Weight Super-Exponential Decay Cross-Check (imp-3665)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-3665 independently cross-checked the imp-3646 claim that the autocorrelation
        weight A(tau) = int Phi(s) Phi(s + tau) ds decays as exp(-pi e^4tau), by recomputing
        -ln A(tau) on a refined grid at tau in {'{'}0.5, 1, 1.5, 2{'}'}. The ratio -ln A(tau) /
        (pi e^4tau) converges to 1 from above ({IMP3697_RATIO_FIRST} at tau=0.5 down to{' '}
        {IMP3697_RATIO_LAST} at tau=2), confirming the leading-order law is asymptotic.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Ratio -ln A(tau) / (pi e^4tau), converging to 1 from above
      </p>
      <RatioConvergenceChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        A(tau) magnitude by log-domain evaluation vs direct-double underflow past tau &gt; {IMP3697_UNDERFLOW_THRESHOLD_TAU}
      </p>
      <MagnitudeBarChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the ratio (top chart)
        starts 2.7% above 1 at tau=0.5 and settles within 0.03% of 1 by tau=2, showing the
        exp(-pi e^4tau) law is the correct leading order with a shrinking subleading
        correction. The bar chart shows why a naive direct-double Simpson sum cannot reach
        A(1.5) ~ 1e-550 or A(2) ~ 1e-4067 (green bars) -- the integrand underflows to exactly
        0.0 past tau ~ {IMP3697_UNDERFLOW_THRESHOLD_TAU} (red labels) -- so the imp-3665
        cross-check evaluates ln Phi and the Simpson sum entirely in the log domain (log-sum-exp),
        never materializing the underflowing exponentials.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
        }}
      >
        <strong style={{ color: '#f87171' }}>Correction (imp-3739):</strong> the tau=1.5 and
        tau=2.0 rungs above read ratio &lt; 1 (0.99977 and 0.99976), off the imp-3665 N=12000
        Simpson grid. imp-3716 refined that grid and found this is a DISCRETIZATION ARTIFACT:
        the converged grid (N=160000) gives R(1.5) = 1.0003 &gt; 1, with the subleading
        correction c(1.5) = -ln A(1.5) - pi e^4(1.5) = +0.380, not the coarse-grid -0.171. On
        the converged grid the ratio approaches 1 strictly from above across the whole range --
        there is no sign change below 1.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/cross-check
        only -- this visualizes the imp-3665 numeric confirmation of a decay-rate premise used
        inside a mass-feasibility diagnostic. It establishes NO operator positivity. RH-equivalent,
        necessary-but-not-sufficient. The imp-3066 K_a &ge; 0 sign-positivity obstruction remains
        untouched; Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
