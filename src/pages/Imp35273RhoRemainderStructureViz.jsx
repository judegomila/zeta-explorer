import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35244_RHO_EPS52_COEFFICIENT_MEASUREMENT } from '../data/imp-35244-rho-eps52-coefficient-measurement.js';

const D = IMP35244_RHO_EPS52_COEFFICIENT_MEASUREMENT;
const K72 = D.kSevenHalves; // -1.20042

// Plots r1/eps^{5/2} (decaying to 0, the empty slot) alongside r1/eps^{7/2} (converging to K_{7/2}).
function RemainderStructureChart() {
  const svgW = 680;
  const padL = 54;
  const padR = 20;
  const padT = 44;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const logN = D.grid.map((r) => Math.log10(r.N));
  const xMin = Math.min(...logN);
  const xMax = Math.max(...logN);
  const yMin = -1.4;
  const yMax = 0.1;
  const xOf = (lx) => padL + ((lx - xMin) / (xMax - xMin)) * plotW;
  const yOf = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const eps52Path = D.grid
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(Math.log10(r.N))} ${yOf(r.r1OverEps52)}`)
    .join(' ');
  const eps72Path = D.grid
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(Math.log10(r.N))} ${yOf(r.r1OverEps72)}`)
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 26} fill="#94a3b8" fontSize={11} fontWeight={700}>
        r1(eps) / eps^p vs N, p = 5/2 (empty slot) and p = 7/2 (true next order)
      </text>
      {[yMin, 0, yMax].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      <line
        x1={padL}
        y1={yOf(K72)}
        x2={padL + plotW}
        y2={yOf(K72)}
        stroke="#f87171"
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 190} y={yOf(K72) - 6} fill="#f87171" fontSize={9}>
        K_(7/2) = -8 sqrt(2)/(3 pi) = {K72.toFixed(5)}
      </text>
      <path d={eps52Path} fill="none" stroke="#facc15" strokeWidth={2.25} />
      <path d={eps72Path} fill="none" stroke="#38bdf8" strokeWidth={2.25} />
      {D.grid.map((r) => (
        <circle key={`52-${r.N}`} cx={xOf(Math.log10(r.N))} cy={yOf(r.r1OverEps52)} r={3.5} fill="#facc15" />
      ))}
      {D.grid.map((r) => (
        <circle key={`72-${r.N}`} cx={xOf(Math.log10(r.N))} cy={yOf(r.r1OverEps72)} r={3.5} fill="#38bdf8" />
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      {D.grid.map((r) => (
        <text
          key={`lbl-${r.N}`}
          x={xOf(Math.log10(r.N))}
          y={padT + plotH + 16}
          textAnchor="middle"
          fill="#64748b"
          fontSize={9}
        >
          {r.N.toExponential(0)}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9}>
        N (clean window)
      </text>
      <g>
        <circle cx={padL + 4} cy={padT - 12} r={3} fill="#facc15" />
        <text x={padL + 12} y={padT - 8} fill="#facc15" fontSize={8.5}>
          r1 / eps^(5/2) &rarr; 0 (slot empty)
        </text>
        <circle cx={padL + 4} cy={padT - 24} r={3} fill="#38bdf8" />
        <text x={padL + 12} y={padT - 20} fill="#38bdf8" fontSize={8.5}>
          r1 / eps^(7/2) &rarr; K_(7/2)
        </text>
      </g>
    </svg>
  );
}

export default function Imp35273RhoRemainderStructureViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="rho(eps) Corrected Remainder Structure (imp-35273 / imp-35244)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35244 formed the residual r1(eps) = rho(eps) &minus; 2/3 &minus; K&nbsp;eps^(3/2) after subtracting
        the imp-35216 leading two terms, and measured what power of eps it scales with. The naive
        eps^(5/2) coefficient the imp-35216 derivation implied (&minus;0.32011) is FALSIFIED: r1&nbsp;/&nbsp;eps^(5/2)
        decays toward 0 across the imp-35193 clean window N&nbsp;=&nbsp;1e3..1e6 (the slot is empty), while
        r1&nbsp;/&nbsp;eps^(7/2) converges cleanly to the closed form K_(7/2)&nbsp;=&nbsp;{K72.toFixed(5)}. The
        true next-order term is eps^(7/2), not eps^(5/2).
      </p>

      <RemainderStructureChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>eps</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>r1 = rho-2/3-K eps^1.5</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>r1 / eps^(5/2)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>r1 / eps^(7/2)</th>
          </tr>
        </thead>
        <tbody>
          {D.grid.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.y_N_sharp.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.residualAfterTwoTerms.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.r1OverEps52.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.r1OverEps72.toFixed(6)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '1rem' }}>
        At the tightest clean rung (N&nbsp;=&nbsp;1e6) r1&nbsp;/&nbsp;eps^(5/2) has fallen to{' '}
        {D.tailEps52Read.toExponential(2)} (from {D.headEps52Read.toExponential(2)} at the head, N&nbsp;=&nbsp;1e3)
        while r1&nbsp;/&nbsp;eps^(7/2) has settled at {D.tailEps72Read.toFixed(6)}, matching K_(7/2) to within the
        grid's Simpson noise floor. The corrected expansion is rho(eps)&nbsp;=&nbsp;2/3&nbsp;+&nbsp;[8
        sqrt(2)/(9 pi)]&nbsp;eps^(3/2)&nbsp;+&nbsp;0&middot;eps^(5/2)&nbsp;&minus;&nbsp;[8
        sqrt(2)/(3 pi)]&nbsp;eps^(7/2)&nbsp;+&nbsp;&hellip;
      </p>

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> Viz-only page rendering the imp-35244
        measurement literals verbatim (no new computation) on the imp-35193 clean window N&nbsp;=&nbsp;1e3..1e6.
        Pinning the eps^(5/2) slot empty and the eps^(7/2) coefficient sharpens the remainder SHAPE but is not a
        certified uniform modulus of convergence on the TRUE RvM cusp jet; does NOT discharge O3 or
        G6a_shock_lipschitz (both stay OPEN); establishes no operator positivity; imp-3066 off-diagonal
        endpoint-Hankel K_a&nbsp;&ge;&nbsp;0 UNTOUCHED; C_mb GUE-conditional per imp-486; changes no bound; no RH
        verdict, NO QED. Platt-Trudgian Lambda&nbsp;&le;&nbsp;0.2 remains SOTA.
      </div>
    </div>
  );
}
