import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34611_PLATEAU_DRIFT_INDEPENDENT_STENCIL } from '../data/imp-34611-plateau-drift-independent-stencil-crosscheck.js';
import { ED } from '../styles/tokens.js';

const M = IMP34611_PLATEAU_DRIFT_INDEPENDENT_STENCIL;
const ROWS = [...M.dp_step_rows].sort((a, b) => a.dp - b.dp);

// Log-log chart of the 2nd-order vs 4th-order deep-vs-mid drift across the full dp sweep, with
// the imp-34587 Richardson node dp=2e-3 (the roundoff dip) and the plateau level both marked.
function DriftChart() {
  const svgW = 680;
  const svgH = 300;
  const padL = 62;
  const padR = 24;
  const padT = 26;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const dps = ROWS.map((r) => r.dp);
  const xMin = Math.log10(Math.min(...dps)) - 0.1;
  const xMax = Math.log10(Math.max(...dps)) + 0.1;
  const allY = [...ROWS.map((r) => r.drift_2nd), ...ROWS.map((r) => r.drift_4th), M.plateau_drift_4th_order];
  const yMin = Math.min(...allY) - 0.003;
  const yMax = Math.max(...allY) + 0.003;

  const xAt = (dp) => padL + ((Math.log10(dp) - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const path2nd = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xAt(r.dp)},${yAt(r.drift_2nd)}`).join(' ');
  const path4th = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xAt(r.dp)},${yAt(r.drift_4th)}`).join(' ');
  const plateauY = yAt(M.plateau_drift_4th_order);
  const richardsonX = xAt(M.richardson_node_dp);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* plateau reference line */}
      <line x1={padL} y1={plateauY} x2={padL + cW} y2={plateauY} stroke={ED.series3} strokeWidth={1} strokeDasharray="2,3" />
      <text x={padL + cW - 4} y={plateauY - 5} textAnchor="end" fill={ED.series3} fontSize={9}>
        plateau {M.plateau_drift_4th_order}
      </text>

      {/* Richardson node dp=2e-3 (roundoff dip) marker */}
      <line x1={richardsonX} y1={padT} x2={richardsonX} y2={padT + cH} stroke={ED.series2} strokeWidth={1} strokeDasharray="3,3" />
      <text x={richardsonX + 4} y={padT + 10} fill={ED.series2} fontSize={9}>
        Richardson node dp={M.richardson_node_dp.toExponential(0)}
      </text>

      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={path2nd} fill="none" stroke={ED.series1} strokeWidth={1.5} strokeDasharray="5,3" />
      <path d={path4th} fill="none" stroke={ED.brassDeco} strokeWidth={2} />

      {ROWS.map((r) => (
        <circle key={`d2-${r.dp}`} cx={xAt(r.dp)} cy={yAt(r.drift_2nd)} r={3} fill={ED.series1} stroke={ED.paper} strokeWidth={1} />
      ))}
      {ROWS.map((r) => (
        <circle key={`d4-${r.dp}`} cx={xAt(r.dp)} cy={yAt(r.drift_4th)} r={3.5} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
      ))}

      <text x={padL} y={16} fill={ED.brass} fontSize={10}>
        4th-order (7-point) stencil
      </text>
      <text x={padL + 200} y={16} fill={ED.series1} fontSize={10}>
        2nd-order (5-point) stencil
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        finite-difference step dp (log scale)
      </text>
    </svg>
  );
}

// Bar comparison of the large-dp tail (dp = 1.5e-2 .. 3e-1) drift spread under each stencil,
// making the ~2x flatness gain of the more-accurate 4th-order stencil visible directly.
function TailSpreadBars() {
  const svgW = 420;
  const svgH = 180;
  const padL = 140;
  const padR = 40;
  const padT = 20;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const bars = [
    { label: '2nd-order tail spread', value: M.tail_drift_spread_2nd_order, color: ED.series1 },
    { label: '4th-order tail spread', value: M.tail_drift_spread_4th_order, color: ED.brass },
  ];
  const xMax = Math.max(...bars.map((b) => b.value)) * 1.2;
  const xAt = (v) => (v / xMax) * cW;
  const barH = (cH / bars.length) * 0.5;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {bars.map((b, i) => {
        const y = padT + (cH / bars.length) * i + (cH / bars.length - barH) / 2;
        return (
          <g key={b.label}>
            <text x={padL - 8} y={y + barH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={10}>
              {b.label}
            </text>
            <rect x={padL} y={y} width={xAt(b.value)} height={barH} fill={b.color} opacity={0.85} />
            <text x={padL + xAt(b.value) + 6} y={y + barH / 2 + 4} fill={ED.ink} fontSize={10} fontFamily="monospace">
              {b.value.toExponential(2)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp34639StencilTailSpreadCrosscheckViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Independent-Stencil q3-Share Drift: Tail Spread &amp; Plateau (imp-34639 / imp-34611)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34611 independently confirmed the imp-34593 q3-share PLATEAU drift &sim; {M.plateau_drift_4th_order}
        &nbsp;(&sim;9.7%) using an independent 4th-order 7-point central-difference stencil across a
        wider dp = {M.plateau_steps[0].toExponential(0)} .. {M.plateau_steps[M.plateau_steps.length - 1].toExponential(0)}
        &nbsp;window. On the large-dp tail (dp = {M.tail_steps_large_dp[0].toExponential(1)} ..{' '}
        {M.tail_steps_large_dp[M.tail_steps_large_dp.length - 1].toExponential(0)}) the more-accurate
        4th-order stencil is about 2x flatter ({M.tail_drift_spread_4th_order.toExponential(1)} vs{' '}
        {M.tail_drift_spread_2nd_order.toExponential(1)}), and the imp-34587 Richardson node
        dp = {M.richardson_node_dp.toExponential(0)} sits well above the plateau &mdash; confirming it as
        the roundoff dip. No viz existed for this cross-check.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        deep-vs-mid q3-share drift vs dp: 2nd-order vs independent 4th-order stencil, plateau and
        Richardson node marked
      </p>
      <DriftChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        large-dp tail (dp = 1.5e-2 .. 3e-1) drift spread by stencil order
      </p>
      <TailSpreadBars />

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '1.5rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>dp</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>drift (2nd-order)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>drift (4th-order)</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr
              key={r.dp}
              style={{
                borderBottom: '1px solid var(--rule-soft)',
                color: r.dp === M.richardson_node_dp ? 'var(--series-2)' : 'var(--ink)',
              }}
            >
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.dp.toExponential(4)}
                {r.dp === M.richardson_node_dp ? ' (Richardson node)' : ''}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.drift_2nd}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.drift_4th}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '1rem' }}>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>plateau drift (4th-order, independent stencil)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.plateau_drift_4th_order}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>cross-stencil agreement (2nd vs 4th order)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.cross_stencil_abs_agreement}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>tail spread, 2nd-order</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.tail_drift_spread_2nd_order}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>tail spread, 4th-order</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.tail_drift_spread_4th_order}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>plateau / Richardson ratio</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.plateau_vs_richardson_ratio}x</td>
          </tr>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, reusing the
        imp-34611 measurement literals verbatim (dp sweep rows, plateau, tail spreads, Richardson
        node). The 4th-order stencil being ~2x flatter than the 2nd-order one on the large-dp tail
        is exactly what lower truncation error predicts, confirming the plateau is a genuine
        roundoff-free intrinsic rather than a residual-truncation slope. q1,q2,q3 are inherited
        central differences, NOT fresh analytic closed forms, so the sigma&nbsp;-&gt;&nbsp;1
        deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is.
        The -2 asymptote and C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi) (imp-2714) ansatz are UNTOUCHED;
        C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes
        no bound; no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
