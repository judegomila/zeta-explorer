import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33809_SATURATION_CURVATURE_HUMP_VS_K } from '../data/imp-33809-saturation-curvature-hump-vs-k.js';

const { humpLadder, humpArgmaxK, humpPeak, crossoverDecadeK } = IMP33809_SATURATION_CURVATURE_HUMP_VS_K;

function HumpVsKChart() {
  const svgW = 720;
  const padL = 48;
  const padR = 32;
  const padT = 20;
  const padB = 40;
  const svgH = 300;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kMin = 6;
  const kMax = 13;
  const xS = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;

  const yMax = 0.07;
  const yS = (h) => padT + cH - (h / yMax) * cH;

  const yTicks = [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
  const xTicks = humpLadder.map((r) => r.k);

  const points = humpLadder.map((r) => `${xS(r.k)},${yS(r.hump)}`).join(' ');
  const peakRow = humpLadder.find((r) => r.k === humpArgmaxK);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      {/* crossover decade reference line -- global argmax lands here */}
      <line
        x1={xS(humpArgmaxK)}
        y1={padT}
        x2={xS(humpArgmaxK)}
        y2={padT + cH}
        stroke="#f87171"
        strokeWidth={1.25}
        strokeDasharray="5,3"
      />
      <text x={xS(humpArgmaxK) + 4} y={padT + 10} fill="#f87171" fontSize={9}>
        k={humpArgmaxK} crossover (E_coll = E_trunc)
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
        decade index k ([10^k, 10^(k+1)])
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        hump(k) amplitude
      </text>

      <polyline points={points} fill="none" stroke="#a78bfa" strokeWidth={1.75} />
      {humpLadder.map((r) => (
        <circle
          key={'pt' + r.k}
          cx={xS(r.k)}
          cy={yS(r.hump)}
          r={r.k === humpArgmaxK ? 4.5 : 2.75}
          fill={r.k === humpArgmaxK ? '#f87171' : '#c4b5fd'}
          stroke="#0a0f1a"
          strokeWidth={0.75}
        />
      ))}
      {peakRow && (
        <text x={xS(peakRow.k)} y={yS(peakRow.hump) - 10} textAnchor="middle" fill="#f87171" fontSize={9}>
          peak {humpPeak.toExponential(4)}
        </text>
      )}
    </svg>
  );
}

export default function Imp33832SaturationCurvatureHumpVsKViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Intra-Decade Saturation-Curvature Hump vs k (imp-33809 / imp-33832)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33809 tabulated the imp-33773 M3 intra-decade curvature-hump amplitude
        hump(k) = p_ecoll*(1&nbsp;-&nbsp;sigma_hi)&nbsp;-&nbsp;p_sigma across an extended decade
        ladder k = 6..13, confirming the global maximum lands at k = {humpArgmaxK}, the E_coll = E_trunc
        crossover decade (k = {crossoverDecadeK}). This page is the first consumer of that module:
        the hump amplitude plotted against decade index, with the crossover/peak decade marked so the
        peak-sits-at-crossover verdict is legible at a glance.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        hump(k) vs decade index k, k = 6..13, linear axes
      </p>
      <HumpVsKChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>decade</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>hump(k)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>sigma_hi</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>hump/sigma_hi</th>
          </tr>
        </thead>
        <tbody>
          {humpLadder.map((r) => (
            <tr
              key={r.k}
              style={{
                borderBottom: '1px solid #1e293b',
                color: r.k === humpArgmaxK ? '#f87171' : '#cbd5e1',
              }}
            >
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.k}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.decade}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.hump}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.sigmaHi}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.humpOverSigmaHi}</td>
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
        -- imp-33809 changes no value and derives nothing new, and this page adds no new
        derivation either. It gives the k = 6..13 hump ladder a visual surface confirming the
        global argmax sits at the k = {humpArgmaxK} crossover decade, an interior maximum rather
        than a window-edge artifact. No bound changes; establishes no operator positivity;
        imp-3066 K_a &ge; 0 remains untouched. No RH verdict, NO QED. Platt-Trudgian &Lambda; &le; 0.2
        remains the rigorous SOTA.
      </div>
    </div>
  );
}
