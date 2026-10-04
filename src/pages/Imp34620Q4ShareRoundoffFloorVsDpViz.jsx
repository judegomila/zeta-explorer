import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34592_Q4_SHARE_ROUNDOFF_FLOOR_VS_DP } from '../data/imp-34592-q4-share-roundoff-floor-vs-dp.js';
import { ED } from '../styles/tokens.js';

const M = IMP34592_Q4_SHARE_ROUNDOFF_FLOOR_VS_DP;
const ROWS = [...M.dp_sweep_rows].sort((a, b) => a.dp - b.dp);

// Log-log chart: apparent deep-group |q4_h4_rel| share vs q-derivative step dp. Shows the flat
// physical plateau at large dp (~5e-7), the ~1/dp^4 roundoff-amplification tail at small dp, and
// the two thresholds imp-34592 located: dp_estimate_untrustworthy (~7e-4, apparent share inflated
// >10x above the physical baseline) and dp_false_breakdown (~1.5e-4, apparent share crosses the
// ~0.4% residual floor and would spuriously look non-negligible).
function LogLogChart() {
  const svgW = 680;
  const svgH = 300;
  const padL = 62;
  const padR = 24;
  const padT = 26;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const dpMin = Math.min(...ROWS.map((r) => r.dp));
  const dpMax = Math.max(...ROWS.map((r) => r.dp));
  const xMin = Math.log10(dpMin) - 0.1;
  const xMax = Math.log10(dpMax) + 0.1;

  const allY = [...ROWS.map((r) => r.deep_max_q4_h4_rel), M.residual_floor, M.physical_q4_h4_share];
  const yMin = Math.log10(Math.min(...allY)) - 0.3;
  const yMax = Math.log10(Math.max(...allY)) + 0.3;

  const xAt = (dp) => padL + ((Math.log10(dp) - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((Math.log10(v) - yMin) / (yMax - yMin)) * cH;

  const dataPath = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xAt(r.dp)},${yAt(r.deep_max_q4_h4_rel)}`).join(' ');
  const floorY = yAt(M.physical_q4_h4_share);
  const residualY = yAt(M.residual_floor);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* physical plateau reference line */}
      <line x1={padL} y1={floorY} x2={padL + cW} y2={floorY} stroke={ED.series3} strokeWidth={1} strokeDasharray="2,3" />
      <text x={padL + 4} y={floorY - 5} fill={ED.series3} fontSize={9}>
        physical plateau {M.physical_q4_h4_share.toExponential(2)}
      </text>

      {/* 0.4% residual floor reference line */}
      <line x1={padL} y1={residualY} x2={padL + cW} y2={residualY} stroke={ED.series5} strokeWidth={1} strokeDasharray="2,3" />
      <text x={padL + 4} y={residualY - 5} fill={ED.series5} fontSize={9}>
        ~0.4% residual floor {M.residual_floor.toExponential(2)}
      </text>

      {/* dp_estimate_untrustworthy marker */}
      <line
        x1={xAt(M.dp_estimate_untrustworthy)}
        y1={padT}
        x2={xAt(M.dp_estimate_untrustworthy)}
        y2={padT + cH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      <text x={xAt(M.dp_estimate_untrustworthy) + 4} y={padT + 10} fill={ED.brass} fontSize={9}>
        untrustworthy {M.dp_estimate_untrustworthy.toExponential(2)}
      </text>

      {/* dp_false_breakdown marker */}
      <line
        x1={xAt(M.dp_false_breakdown)}
        y1={padT}
        x2={xAt(M.dp_false_breakdown)}
        y2={padT + cH}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      <text x={xAt(M.dp_false_breakdown) + 4} y={padT + 22} fill={ED.series2} fontSize={9}>
        false-breakdown {M.dp_false_breakdown.toExponential(2)}
      </text>

      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {/* measured deep-group max apparent q4_h4_rel share */}
      <path d={dataPath} fill="none" stroke={ED.series1} strokeWidth={2} />
      {ROWS.map((r) => (
        <circle
          key={r.dp}
          cx={xAt(r.dp)}
          cy={yAt(r.deep_max_q4_h4_rel)}
          r={3.5}
          fill={ED.series1}
          stroke={ED.paper}
          strokeWidth={1}
        />
      ))}

      <text x={padL} y={16} fill={ED.series1} fontSize={10}>
        apparent deep-group max |q4_h4_rel| share
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        q-derivative step dp (log scale, {dpMin.toExponential(0)} .. {dpMax.toExponential(0)})
      </text>
    </svg>
  );
}

export default function Imp34620Q4ShareRoundoffFloorVsDpViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="q4-Share Roundoff Amplification vs Finite-Difference Step dp (imp-34620 / imp-34592)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34592 stress-tested the imp-34573/imp-34566 claim that the q4-bearing O(h&sup4;)
        drift-residual term stays negligible (&sim;1e-6 of the O(h&sup2;) term) in the sigma&nbsp;
        -&gt;&nbsp;1 deep tail, which was measured at a single fixed q-derivative step dp&nbsp;=&nbsp;1e-3.
        Sweeping dp shows the apparent |q4_h4_rel| share is a genuine physical&nbsp;
        {M.physical_q4_h4_share.toExponential(1)} at well-conditioned steps, but roundoff on the
        5-point 4th difference inflates it &sim;1/dp&sup4; as dp shrinks. No viz existed for this
        sweep.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        apparent q4-share vs dp (log-log): flat physical plateau at large dp, rising 1/dp&sup4;
        roundoff tail at small dp, the two located thresholds marked
      </p>
      <LogLogChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>dp</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>apparent |q4_h4_rel| share</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>inflation vs physical</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>exceeds residual floor?</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr
              key={r.dp}
              style={{
                borderBottom: '1px solid var(--rule-soft)',
                color:
                  r.dp === M.dp_estimate_untrustworthy
                    ? 'var(--brass)'
                    : r.dp === M.dp_false_breakdown
                    ? 'var(--series-2)'
                    : 'var(--ink)',
              }}
            >
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.dp.toExponential(2)}
                {r.dp === M.dp_estimate_untrustworthy ? ' (untrustworthy)' : ''}
                {r.dp === M.dp_false_breakdown ? ' (false-breakdown)' : ''}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.deep_max_q4_h4_rel}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.inflation_vs_physical}x</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.exceeds_residual_floor ? 'yes' : 'no'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1rem',
        }}
      >
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>physical q4-share (well-conditioned dp = {M.dp_physical_reference})</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.physical_q4_h4_share}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>q4-share at parents operating dp = {M.dp_operating}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.q4_h4_share_at_operating}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>dp estimate-untrustworthy threshold (&gt;10x inflation)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.dp_estimate_untrustworthy.toExponential(2)}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>dp false-breakdown threshold (crosses ~0.4% residual)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.dp_false_breakdown.toExponential(2)}</td>
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
        imp-34592 sweep literals verbatim (dp sweep rows, physical share, both thresholds). q1..q4
        are inherited central differences, NOT fresh analytic closed forms, so the sigma&nbsp;
        -&gt;&nbsp;1 deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is
        inherited as-is -- this diagnoses finite-difference conditioning, it does not rehabilitate
        the model. The -2 asymptote and C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi) (imp-2714) ansatz are
        UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0
        untouched; changes no bound; no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
