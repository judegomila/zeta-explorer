import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34954_SURPLUS_CLOSED_FORM_VS_LANDMARK_GAP_CROSSCHECK } from '../data/imp-34954-surplus-closed-form-vs-landmark-gap-crosscheck.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP34954_SURPLUS_CLOSED_FORM_VS_LANDMARK_GAP_CROSSCHECK;
const LC = DATA.leadingConversion;
const RC = DATA.refinedConversion;

// Four bars: the three equivalent leading conversion forms (all ~4.6-4.9%) collapse to
// a single "leading" cluster, then the measured-slope refinement drops the residual an order of magnitude.
const BARS = [
  { label: '8 × surplus', value: LC.resid_8S, color: ED.series1 },
  { label: '2r', value: LC.resid_2r, color: ED.series1 },
  { label: '1-(1+r)^{-2}', value: LC.resid_powerlaw, color: ED.series1 },
  { label: 'measured-slope G=1-(1+r)^{1/slope}', value: RC.resid_refined_slope, color: ED.series3 },
];

function ResidualWaterfallChart() {
  const svgW = 680;
  const panelH = 220;
  const padL = 60;
  const padR = 24;
  const padT = 36;
  const padB = 56;
  const plotW = svgW - padL - padR;
  const svgH = padT + panelH + padB;

  const maxVal = Math.max(...BARS.map((b) => b.value)) * 1.15;
  const sy = (v) => padT + panelH - (v / maxVal) * panelH;
  const zeroY = padT + panelH;

  const gap = plotW / BARS.length;
  const barW = gap * 0.55;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={panelH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL} y={padT - 12} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        L1-L3 gap residual (relative) &mdash; three equivalent leading forms vs the measured-slope refinement
      </text>
      <line x1={padL} y1={zeroY} x2={padL + plotW} y2={zeroY} stroke={ED.rule} strokeWidth={1.5} />

      {BARS.map((b, i) => {
        const cx = padL + gap * (i + 0.5);
        const yTop = sy(b.value);
        return (
          <g key={b.label}>
            <rect
              x={cx - barW / 2}
              y={yTop}
              width={barW}
              height={zeroY - yTop}
              fill={b.color}
              opacity={0.85}
            />
            <text x={cx} y={yTop - 8} textAnchor="middle" fill={b.color} fontSize={11} fontWeight={700}>
              {(b.value * 100).toFixed(2)}%
            </text>
            <text x={cx} y={zeroY + 18} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
              {b.label}
            </text>
          </g>
        );
      })}

      <text x={padL + plotW / 2} y={padT + 14} textAnchor="middle" fill={ED.brass} fontSize={10} fontWeight={700}>
        the three leading forms cluster near ~4.6-4.9%; the measured slope alone drops the residual ~14x
      </text>
    </svg>
  );
}

export default function Imp35081SurplusConversionResidualWaterfallViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Surplus-to-Gap Conversion Residual Decomposition (imp-35081 / imp-34954)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34954 resolved the ~4.6% residual of converting the sigma-space surplus
        r/(2(2+r)) into the measured relative-N L1-L3 landmark gap ({(LC.rel_N_gap_L1_L3 * 100).toFixed(3)}%).
        The three equivalent leading conversion forms &mdash; 8&times;surplus, 2r, and
        1-(1+r)^-2 &mdash; all reproduce the gap only to a ~4.6-4.9% relative residual, since
        each assumes the ideal E_coll &sim; N^-1/2 power law. Replacing the ideal -1/2
        slope with the MEASURED local log-slope of E_coll at N_cross
        ({RC.measured_E_coll_log_slope_at_N_cross}) in G = 1-(1+r)^(1/slope) drops the
        residual to {(RC.resid_refined_slope * 100).toFixed(2)}% &mdash; roughly an order of
        magnitude tighter. (Adding the E_flow drift across the gap closes the residual
        further, to ~4e-6, per imp-34954 Q4 &mdash; not plotted here since it is off-scale
        against the other three bars.)
      </p>

      <ResidualWaterfallChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>value</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['measured relative-N L1-L3 gap', LC.rel_N_gap_L1_L3],
            ['8 × surplus (leading conversion)', LC.eight_times_surplus],
            ['2r (leading conversion)', LC.two_r],
            ['1-(1+r)^-2 (leading conversion, exact E_flow)', LC.gap_powerlaw_1_minus_1_over_1_plus_r_sq],
            ['residual, 8×surplus', LC.resid_8S],
            ['residual, 2r', LC.resid_2r],
            ['residual, 1-(1+r)^-2', LC.resid_powerlaw],
            ['measured E_coll log-slope at N_cross', RC.measured_E_coll_log_slope_at_N_cross],
            ['gap, measured-slope refinement', RC.gap_refined_measured_slope],
            ['residual, measured-slope refinement', RC.resid_refined_slope],
            ['gap, slope + E_flow-drift refinement', RC.gap_refined_slope_plus_eflow_drift],
            ['residual, slope + E_flow-drift refinement', RC.resid_refined_full],
          ].map(([label, value]) => (
            <tr key={label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{value}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering
        the imp-34954 baked residual literals (imported verbatim, no new computation);
        establishes no new numerical claim. Conditional-share diagnostic on the inherited
        imp-3220/imp-3406 extrapolation, NOT an RH bound. Far-tail exponent stays 1/2
        (imp-3463); C_mb GUE-conditional per imp-486 untouched; changes no bound;
        establishes no operator positivity; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
