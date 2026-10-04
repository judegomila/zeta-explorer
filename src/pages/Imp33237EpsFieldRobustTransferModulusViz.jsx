import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33237_PLATEAUS,
  IMP33237_TRANSFER,
  IMP33237_LADDER_TIGHTENING_RATIO,
} from '../data/imp-33237-eps-field-robust-transfer-modulus-viz-data.js';
import { ED } from '../styles/tokens.js';

const BAR_COLOR = ED.series1;
const ANALYTIC_COLOR = ED.series7;

function logScale(v, min, max, cH) {
  const lv = Math.log10(v);
  const lmin = Math.log10(min);
  const lmax = Math.log10(max);
  return cH * (1 - (lv - lmin) / (lmax - lmin));
}

function CFieldLadderChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const values = IMP33237_PLATEAUS.map((p) => p.cFieldSlope);
  const min = Math.min(...values) / 2;
  const max = Math.max(...values) * 2;
  const barW = cW / IMP33237_PLATEAUS.length - 10;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[-11, -10, -9, -8, -7].map((exp) => {
        const y = padT + logScale(Math.pow(10, exp), min, max, cH);
        return (
          <g key={exp}>
            <line x1={padL} y1={y} x2={padL + cW} y2={y} stroke={ED.ruleSoft} strokeWidth={0.7} />
            <text x={padL - 6} y={y + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
              1e{exp}
            </text>
          </g>
        );
      })}

      {IMP33237_PLATEAUS.map((p, i) => {
        const x = padL + i * (cW / IMP33237_PLATEAUS.length) + 5;
        const yBar = padT + logScale(p.cFieldSlope, min, max, cH);
        const hBar = padT + cH - yBar;
        const yAnalytic = padT + logScale(p.analytic3H4Over64, min, max, cH);
        return (
          <g key={p.plateauIndex}>
            <rect x={x} y={yBar} width={barW} height={hBar} fill={BAR_COLOR} rx={2} />
            <line x1={x} y1={yAnalytic} x2={x + barW} y2={yAnalytic} stroke={ANALYTIC_COLOR} strokeWidth={2} />
            <text x={x + barW / 2} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              p{p.plateauIndex}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        C_field = W(1) - W(0)
      </text>
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        H_raw plateau (p0 = [1e4,1.89e4] ... p9 = [4.21e5,1e6])
      </text>
    </svg>
  );
}

function PlateauTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>plateau</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>H</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>C_field = W(1)-W(0)</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>3H^4/64</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>W(1)</th>
        </tr>
      </thead>
      <tbody>
        {IMP33237_PLATEAUS.map((p) => (
          <tr key={p.plateauIndex} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>p{p.plateauIndex}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{p.H.toPrecision(4)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: BAR_COLOR }}>{p.cFieldSlope.toExponential(3)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: ANALYTIC_COLOR }}>{p.analytic3H4Over64.toExponential(3)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{p.w1.toExponential(3)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp33237EpsFieldRobustTransferModulusViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="eps'-Field-Robust Transfer Modulus Ladder (imp-3933)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-3933 certifies a deterministic, N-uniform transfer modulus in the
        VECTOR-FIELD-ERROR channel across all 10 H_raw plateaus of
        N in {'{'}1e4 .. 1e6{'}'}. The per-plateau field-channel slope
        C_field = W(1) - W(0) falls monotonically from 9.50e-8 (plateau 0) to
        4.96e-11 (plateau 9) -- a ~{IMP33237_LADDER_TIGHTENING_RATIO.toFixed(0)}x
        tightening -- and tracks the analytic slope 3H^4/64 (dashed line) to
        within ~0.6% on every plateau. This bypasses the C_Lip wall only in
        this field channel; the W_1-channel impossibility proofs are untouched.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        C_field (bars, log scale) vs analytic 3H^4/64 (dashed line) per plateau
      </p>
      <CFieldLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Per-plateau values
      </p>
      <PlateauTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> each bar
        is the certified field-channel slope C_field = W(1) - W(0) at that
        plateau's minimum gap H (log scale, since the ladder spans ~4 orders of
        magnitude); the dashed line is the analytic prediction 3H^4/64 from the
        comparison-ODE bracket. The full transfer width at unit field-Lipschitz
        error tops out at W(1) &le; {IMP33237_TRANSFER.maxWidthAtEps1.toExponential(2)}{' '}
        (plateau 1) -- about {IMP33237_TRANSFER.transferAdvantageFactor.toExponential(2)}x
        tighter than the C_H-route E_coll placeholder{' '}
        {IMP33237_TRANSFER.eCollCHRouteN1e4} at N* = 1e4.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation
        only, of an already-certified table (imp-3933). Two named sub-gaps stay
        open -- the eps'_true certificate for the true xi backward-heat-flow
        field error, and the E(N)-chain bracket rearchitecture that routes the
        C_H * W_1^{'{1/2}'} leg through this channel. RH-equivalent, NO QED.
      </div>
    </div>
  );
}
