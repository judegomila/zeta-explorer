import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP124845_FLOWSHARE_COMPARISON,
  IMP124845_SUMMARY,
} from '../data/imp-124845-diag3-additivity-flowshare-viz-data.js';
import { ED } from '../styles/tokens.js';

const COLOR_LINEAR = ED.series2;
const COLOR_NONLINEAR = ED.series4;

// Log-y line chart: |NUM| vs flow share for the linear model (flat at round-off) vs the
// c^2-broken numerator (flat near sigma(1-sigma)) -- isolates the degree-1 hinge (B1).
function AdditivitySumChart() {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 50;
  const svgH = 300;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const EPS_FLOOR = 1e-16; // log(0) guard for the machine-zero linear row
  const linearAbs = IMP124845_FLOWSHARE_COMPARISON.map((r) => Math.max(Math.abs(r.linear_NUM), EPS_FLOOR));
  const nonlinearAbs = IMP124845_FLOWSHARE_COMPARISON.map((r) => Math.abs(r.nonlinear_NUM));
  const allValues = [...linearAbs, ...nonlinearAbs];
  const yMinLog = Math.floor(Math.log10(Math.min(...allValues))) - 0.5;
  const yMaxLog = Math.ceil(Math.log10(Math.max(...allValues))) + 0.5;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - yMinLog) / (yMaxLog - yMinLog)) * plotH;

  const xs = IMP124845_FLOWSHARE_COMPARISON.map((_, i) => padL + (plotW * (i + 0.5)) / IMP124845_FLOWSHARE_COMPARISON.length);

  const linearPath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${yOf(linearAbs[i])}`).join(' ');
  const nonlinearPath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${yOf(nonlinearAbs[i])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

      {[yMinLog, Math.round((yMinLog + yMaxLog) / 2), yMaxLog].map((p) => (
        <g key={p}>
          <line x1={padL} y1={yOf(Math.pow(10, p))} x2={padL + plotW} y2={yOf(Math.pow(10, p))} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(Math.pow(10, p)) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            1e{p}
          </text>
        </g>
      ))}

      <path d={linearPath} fill="none" stroke={COLOR_LINEAR} strokeWidth={2} />
      <path d={nonlinearPath} fill="none" stroke={COLOR_NONLINEAR} strokeWidth={2} />

      {IMP124845_FLOWSHARE_COMPARISON.map((r, i) => (
        <g key={r.cf}>
          <circle cx={xs[i]} cy={yOf(linearAbs[i])} r={3.5} fill={COLOR_LINEAR} />
          <circle cx={xs[i]} cy={yOf(nonlinearAbs[i])} r={3.5} fill={COLOR_NONLINEAR} />
          <text x={xs[i]} y={svgH - 30} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
            cf={r.cf}
          </text>
          <text x={xs[i]} y={svgH - 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            share={r.flow_share}
          </text>
        </g>
      ))}

      <rect x={padL + plotW - 150} y={padT} width={10} height={10} fill={COLOR_LINEAR} />
      <text x={padL + plotW - 136} y={padT + 9} fill={ED.ink} fontSize={10}>linear model (|NUM|~0)</text>
      <rect x={padL + plotW - 150} y={padT + 16} width={10} height={10} fill={COLOR_NONLINEAR} />
      <text x={padL + plotW - 136} y={padT + 25} fill={ED.ink} fontSize={10}>c^2 break (B1)</text>
    </svg>
  );
}

export default function Imp124845Diag3AdditivityFlowshareViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="DIAG3 Additivity: Flow-Share Sweep, Linear vs c^2-Broken Numerator (imp-124845 / imp-124812)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a presentation-only leaf
        reusing the frozen imp-124812 assessment (linear-model sweep verbatim; the c^2-break row is
        the identical imp-124812 formula re-evaluated across the flow-share sweep). Assessment/
        derivation diagnostic, NOT an RH bound; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA;
        RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP124845_SUMMARY.reading}
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        |amplitude-partial sum NUM| vs flow share, linear vs linearity-broken (log-y axis)
      </h3>
      <AdditivitySumChart />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>cf</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>E_flow/E_N</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>linear NUM</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>c^2-break NUM</th>
          </tr>
        </thead>
        <tbody>
          {IMP124845_FLOWSHARE_COMPARISON.map((row) => (
            <tr key={row.cf} style={{ color: 'var(--ink)', textAlign: 'right', borderTop: '1px solid var(--rule-soft)' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>{row.cf}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.flow_share}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.linear_NUM}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.nonlinear_NUM}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP124845_SUMMARY.verdict}
      </div>
    </div>
  );
}
