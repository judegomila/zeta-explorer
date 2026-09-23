import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95886_CURVE_POINTS,
  IMP95886_LANDMARKS,
  IMP95886_CAVEAT_BANNER,
} from '../data/imp-95886-decade-reach-ledger-viz-data.js';
import { IMP95863_INTERMEDIATE_ORDINATE_TABLE_REACH_LEDGER } from '../data/imp-95863-intermediate-ordinate-table-reach-ledger.js';

const LANDMARK_COLOR = {
  in_repo_ceiling: '#38bdf8',
  window_bottom: '#a78bfa',
};

// decades bought (solid) and decades still remaining (dashed) vs log10 N,
// with the in-repo ceiling and window-bottom landmarks marked.
function DecadeReachChart() {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 30;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xMin = IMP95886_CURVE_POINTS[0].log10N;
  const xMax = IMP95886_CURVE_POINTS[IMP95886_CURVE_POINTS.length - 1].log10N;
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  const yMin = 0;
  const yMax = 7;
  const yOf = (v) => padT + ((yMax - v) / (yMax - yMin)) * plotH;

  const boughtPath = IMP95886_CURVE_POINTS.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N)} ${yOf(p.decadesBought)}`,
  ).join(' ');
  const remainingPath = IMP95886_CURVE_POINTS.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N)} ${yOf(p.decadesToWindow)}`,
  ).join(' ');

  const yTicks = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <line key={`gy${t}`} x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke="#1e293b" strokeWidth={1} />
      ))}

      <path d={remainingPath} fill="none" stroke="#f87171" strokeWidth={2} strokeDasharray="4 3" />
      {IMP95886_CURVE_POINTS.map((p) => (
        <circle key={`rem-${p.N}`} cx={xOf(p.log10N)} cy={yOf(p.decadesToWindow)} r={2.5} fill="#f87171" />
      ))}

      <path d={boughtPath} fill="none" stroke="#60a5fa" strokeWidth={2} />
      {IMP95886_CURVE_POINTS.map((p) => (
        <circle key={`buy-${p.N}`} cx={xOf(p.log10N)} cy={yOf(p.decadesBought)} r={2.5} fill="#60a5fa" />
      ))}

      {IMP95886_LANDMARKS.map((m) => {
        const x = xOf(m.log10N);
        const color = LANDMARK_COLOR[m.name];
        return (
          <g key={m.name}>
            <line x1={x} y1={padT} x2={x} y2={padT + plotH} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={x} cy={yOf(m.decadesBought)} r={4} fill={color} />
          </g>
        );
      })}

      {IMP95886_LANDMARKS.map((m, i) => {
        const x = xOf(m.log10N);
        const color = LANDMARK_COLOR[m.name];
        const anchor = i === 0 ? 'start' : 'end';
        return (
          <text key={`lbl-${m.name}`} x={x} y={padT + 12} textAnchor={anchor} fill={color} fontSize={9}>
            {`${m.label}: N=${m.N.toExponential(2)}`}
          </text>
        );
      })}

      <text x={padL + 4} y={yOf(IMP95886_CURVE_POINTS[0].decadesBought) - 8} fill="#60a5fa" fontSize={9}>
        decades bought
      </text>
      <text x={padL + 4} y={yOf(IMP95886_CURVE_POINTS[0].decadesToWindow) + 14} fill="#f87171" fontSize={9}>
        decades remaining to T=3e12
      </text>

      {IMP95886_CURVE_POINTS.map((p) => (
        <text key={`tx${p.N}`} x={xOf(p.log10N)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {p.log10N.toFixed(0)}
        </text>
      ))}
      {yTicks.map((t) => (
        <text key={`ty${t}`} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
          {t}
        </text>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        log10 N (candidate consecutive-ordinate table size)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        decades
      </text>
    </svg>
  );
}

export default function Imp95886DecadeReachLedgerViz() {
  const ceiling = IMP95886_LANDMARKS[0];
  const windowBottom = IMP95886_LANDMARKS[1];
  const row1e7 = IMP95886_CURVE_POINTS.find((p) => p.N === 1e7);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Intermediate-Ordinate-Table Decade Reach Ledger (imp-95863 / imp-95886)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP95886_CAVEAT_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95863 asked whether any intermediate verified-ordinate table ("zeros-to-1e7 or higher")
        would narrow the ~{IMP95863_INTERMEDIATE_ORDINATE_TABLE_REACH_LEDGER.baselineGapDecades.toFixed(2)}-decade
        gap between the in-repo ordinate ceiling and the imp-95519 window bottom T&nbsp;=&nbsp;3.0e12,
        and priced the answer with an RvM-asymptotic decade ledger. The chart plots decades bought
        (solid, rising) and decades still remaining (dashed, falling) against log10 of the
        candidate table size N: the two curves sum to the baseline gap at every N by construction.
        A {row1e7 ? `1e7 table buys only ${row1e7.decadesBought.toFixed(4)} decades` : 'larger table buys few decades'}{' '}
        (still {row1e7 ? row1e7.decadesToWindow.toFixed(2) : ''} short); only the far-right point,
        N&nbsp;&asymp;&nbsp;{windowBottom.N.toExponential(3)}, reaches the window bottom.
      </p>

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(56,189,248,0.06)',
          borderLeft: '3px solid #38bdf8',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#38bdf8' }}>In-repo ceiling (imp-95801 audit):</strong> the sole
        cataloged consecutive-ordinate table is N&nbsp;=&nbsp;{ceiling.N.toExponential(0)}
        &nbsp;(gamma_1e6&nbsp;=&nbsp;{IMP95863_INTERMEDIATE_ORDINATE_TABLE_REACH_LEDGER.inRepoCeiling.value.toExponential(6)}).
        No table above this size exists in-repo, so decades bought by any cataloged source is
        exactly 0.0 and the full{' '}
        {IMP95863_INTERMEDIATE_ORDINATE_TABLE_REACH_LEDGER.baselineGapDecades.toFixed(2)}-decade
        gap to T&nbsp;=&nbsp;3.0e12 stands unchanged. Assessment only; changes no bound; NO QED.
      </div>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Decades bought vs decades remaining (log scale in N)
      </h3>
      <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        Blue: decades bought over the in-repo N&nbsp;=&nbsp;1e6 ceiling. Red (dashed): decades
        still remaining to the T&nbsp;=&nbsp;3.0e12 window bottom. Every 10x growth in N buys
        &asymp;0.95 decades (RvM zero density grows only logarithmically).
      </p>
      <DecadeReachChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>N</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>gamma_N (RvM)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>dec. remaining</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>dec. bought</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>in-repo?</th>
          </tr>
        </thead>
        <tbody>
          {IMP95886_CURVE_POINTS.map((p) => (
            <tr key={p.N} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{p.N.toExponential(0)}</td>
              <td style={{ textAlign: 'right' }}>{p.gammaN.toExponential(4)}</td>
              <td style={{ textAlign: 'right', color: '#f87171' }}>{p.decadesToWindow.toFixed(4)}</td>
              <td style={{ textAlign: 'right', color: '#60a5fa' }}>{p.decadesBought.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{p.inRepo ? 'yes' : 'no'}</td>
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page rendering the frozen
        imp-95863 decade ledger verbatim (no re-derivation). Supplies no new bound, establishes no
        operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
