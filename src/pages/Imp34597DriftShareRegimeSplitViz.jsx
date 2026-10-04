import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34573_DRIFT_SHARE_DEEPTAIL_VS_MIDRANGE } from '../data/imp-34573-drift-residual-share-deeptail-vs-midrange.js';
import { ED } from '../styles/tokens.js';

const M = IMP34573_DRIFT_SHARE_DEEPTAIL_VS_MIDRANGE;
const ROWS = [...M.mid_rows, ...M.deep_rows];

// q2 (~98%) vs q3 (~2%) attribution share per landmark, mid-range and deep-tail groups distinguished,
// making the imp-34573 F2/F3 deep-tail q3-share downward drift visible at the operating dp = 1e-3.
function ShareChart() {
  const svgW = 680;
  const svgH = 260;
  const padL = 60;
  const padR = 24;
  const padT = 26;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const n = ROWS.length;
  const xAt = (i) => padL + (i / (n - 1)) * cW;
  const q2Min = Math.min(...ROWS.map((r) => r.q2_share)) - 0.005;
  const q2Max = 1.0;
  const yAt = (v) => padT + cH - ((v - q2Min) / (q2Max - q2Min)) * cH;

  // q3 share scaled onto a secondary right-hand axis so its ~2% band is legible.
  const q3Min = 0;
  const q3Max = Math.max(...ROWS.map((r) => r.q3_share)) + 0.006;
  const yAtQ3 = (v) => padT + cH - ((v - q3Min) / (q3Max - q3Min)) * cH;

  const midCount = M.mid_rows.length;
  const q2Path = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xAt(i)},${yAt(r.q2_share)}`).join(' ');
  const q3Path = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xAt(i)},${yAtQ3(r.q3_share)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* mid/deep boundary */}
      <line
        x1={xAt(midCount - 0.5)}
        y1={padT}
        x2={xAt(midCount - 0.5)}
        y2={padT + cH}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      <text x={xAt(midCount - 0.5) + 4} y={padT + 10} fill={ED.series2} fontSize={9}>
        N* boundary (sigma&lt;0.01)
      </text>

      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL + cW} y1={padT} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={q2Path} fill="none" stroke={ED.series3} strokeWidth={2} />
      <path d={q3Path} fill="none" stroke={ED.series1} strokeWidth={2} />

      {ROWS.map((r, i) => (
        <g key={r.label}>
          <circle cx={xAt(i)} cy={yAt(r.q2_share)} r={3.5} fill={ED.series3} stroke={ED.paper} strokeWidth={1} />
          <circle cx={xAt(i)} cy={yAtQ3(r.q3_share)} r={3.5} fill={ED.series1} stroke={ED.paper} strokeWidth={1} />
          <text x={xAt(i)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {r.label}
          </text>
        </g>
      ))}

      <text x={padL} y={16} fill={ED.series3} fontSize={10}>
        q2 share (curvature, left axis, ~98%)
      </text>
      <text x={padL + 220} y={16} fill={ED.series1} fontSize={10}>
        q3 share (3rd-deriv, right axis, ~2%)
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        landmark (mid-range N &lt; N* left of dashed line, deep tail N &ge; N* right)
      </text>
    </svg>
  );
}

export default function Imp34597DriftShareRegimeSplitViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Regime-Split q2/q3 Drift-Residual Attribution Share (imp-34597 / imp-34573)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34573 measured the imp-34543 q2 (curvature, ~98%) / q3 (third-derivative, ~2%)
        drift-residual attribution split SEPARATELY in the mid-range (N &lt; N*) and the sigma&nbsp;-&gt;&nbsp;1
        deep tail (N&nbsp;&ge;&nbsp;N*&nbsp;&asymp;&nbsp;{M.deep_tail_boundary_N.toExponential(2)}, imp-33620
        sigma&nbsp;&lt;&nbsp;0.01). The split does not invert or collapse in either regime, but the q3 share
        drifts mildly downward into the tail. No viz existed for this regime-split comparison.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        q2/q3 attribution share per landmark, mid-range vs deep tail (operating step dp = {M.q_deriv_step_operating})
      </p>
      <ShareChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>quantity</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>operating (dp = {M.q_deriv_step_operating})</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>well-conditioned (dp = {M.q_deriv_step_wellconditioned})</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>mid-range mean q3 share</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.mid_q3_share_mean_operating}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.mid_q3_share_mean_wellconditioned}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>deep-tail mean q3 share</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.deep_q3_share_mean_operating}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.deep_q3_share_mean_wellconditioned}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>deep-vs-mid drift of the mean</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.drift_deep_vs_mid_operating}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.drift_deep_vs_mid_wellconditioned}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>deep-tail relative range</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.deep_q3_share_relrange_operating}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.deep_q3_share_relrange_wellconditioned}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>deep-range conditioning factor</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }} colSpan={2}>
              {M.deep_range_conditioning_factor}x (operating / well-conditioned)
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>max q4 (O(h^4)) relative contribution</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }} colSpan={2}>
              {M.max_q4_h4_relative} (negligible in both regimes)
            </td>
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
        imp-34573 regime-partitioned q2/q3 share table verbatim. The ~98%/~2% split does NOT break
        down as sigma&nbsp;-&gt;&nbsp;1 in either regime, and most of the raw operating-step deep-tail
        scatter is finite-difference conditioning (imp-34566 F3): at the better-conditioned step the
        drift shrinks from ~21% to the intrinsic ~8% mild downward decline. q1,q2,q3 are inherited
        central differences, NOT fresh analytic closed forms, so the sigma&nbsp;-&gt;&nbsp;1 deep-tail
        regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is. The -2
        asymptote and C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi) (imp-2714) ansatz are UNTOUCHED; C_mb
        GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no
        bound; no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
