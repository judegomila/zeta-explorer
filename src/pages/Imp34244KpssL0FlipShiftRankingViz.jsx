import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34244_RANKED_RUNGS,
  IMP34244_HEAD_CLUSTER_KS,
  IMP34244_FAR_TAIL_K,
  IMP34244_CRIT10,
  IMP34244_RESID_RMS,
  IMP34244_DEEP_INTERIOR_TO_HEAD_RATIO,
} from '../data/imp-34244-kpss-l0-flip-shift-ranking-viz-data.js';
import { IMP34231_KPSS_L0_MULTI_RUNG_JOINT_SHIFT as MULTI } from '../data/imp-34231-kpss-l0-multi-rung-joint-shift.js';
import { ED } from '../styles/tokens.js';

function isHighlighted(k) {
  return IMP34244_HEAD_CLUSTER_KS.includes(k) || k === IMP34244_FAR_TAIL_K;
}

// Horizontal bar chart of |flip shift| by rank (cheapest first), highlighting the head cluster
// (k=6.00, 6.25) and the far-tail endpoint (k=11.00) against the deep-interior bulk.
function FlipShiftBarChart() {
  const rows = IMP34244_RANKED_RUNGS;
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.flipShift)));
  const rowH = 16;
  const svgW = 680;
  const padL = 56;
  const padR = 70;
  const cW = svgW - padL - padR;
  const svgH = rows.length * rowH + 20;
  const xAt = (v) => (Math.abs(v) / maxAbs) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => {
        const y = 10 + i * rowH;
        const w = xAt(r.flipShift);
        const highlighted = isHighlighted(r.k);
        const color = highlighted ? (r.k === IMP34244_FAR_TAIL_K ? ED.brass : ED.series7) : ED.inkSoft;
        return (
          <g key={r.k}>
            <text x={padL - 6} y={y + rowH * 0.7} textAnchor="end" fill={highlighted ? ED.ink : ED.inkFaint} fontSize={9.5}>
              k={r.k.toFixed(2)}
            </text>
            <rect x={padL} y={y} width={Math.max(w, 1)} height={rowH - 4} fill={color} opacity={highlighted ? 0.95 : 0.6} />
            <text x={padL + w + 4} y={y + rowH * 0.7} fill={highlighted ? ED.ink : ED.inkFaint} fontSize={9}>
              {Math.abs(r.flipShift).toFixed(6)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp34244KpssL0FlipShiftRankingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-34155 Per-Rung KPSS l=0 Flip-Shift Ranking (imp-34244)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34155 measured how fragile the un-HAC l=0 level KPSS borderline (eta_mu &#126;0.3483 vs
        the 10% critical value {IMP34244_CRIT10}) is on the 21 signed imp-33858 residuals, by
        computing the smallest single-rung residual shift that drops eta_mu below{' '}
        {IMP34244_CRIT10} for each of the 21 rungs. Ranked by |flip shift| (cheapest first, chart
        below), the head endpoint k=6.00 is the most-leveraged rung (&#126;0.00201, &#126;1.7% of
        the residual RMS &#126;{IMP34244_RESID_RMS}), its neighbour k=6.25 is second (&#126;0.00353),
        and the far-tail endpoint k=11.00 is third (&#126;0.00509). The deep interior needs{' '}
        {IMP34244_DEEP_INTERIOR_TO_HEAD_RATIO}x or more the head shift, so the borderline is
        endpoint-driven, mirroring the imp-33858 head/far-tail residual localization.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        |flip shift| by rung, ascending (cheapest to flip first) &mdash; pink = head cluster (k=6.00,
        6.25), yellow = far-tail endpoint (k=11.00), grey = deep interior
      </p>
      <FlipShiftBarChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        full 21-rung table (sorted by |flip shift| ascending)
      </p>
      <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.76rem', color: 'var(--ink-soft)', width: '100%' }}>
          <thead>
            <tr style={{ color: 'var(--ink-faint)', textAlign: 'right' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>rank</th>
              <th style={{ padding: '4px 8px' }}>k</th>
              <th style={{ padding: '4px 8px' }}>residual e_k</th>
              <th style={{ padding: '4px 8px' }}>d(eta_mu)/d(delta)</th>
              <th style={{ padding: '4px 8px' }}>flip shift</th>
            </tr>
          </thead>
          <tbody>
            {IMP34244_RANKED_RUNGS.map((r) => (
              <tr
                key={r.k}
                style={{
                  borderTop: '1px solid var(--rule-soft)',
                  textAlign: 'right',
                  background: isHighlighted(r.k) ? 'color-mix(in srgb, var(--series-7) 6%, transparent)' : 'transparent',
                }}
              >
                <td style={{ textAlign: 'left', padding: '4px 8px' }}>{r.rank}</td>
                <td style={{ padding: '4px 8px' }}>{r.k.toFixed(2)}</td>
                <td style={{ padding: '4px 8px' }}>{r.residual.toFixed(5)}</td>
                <td style={{ padding: '4px 8px' }}>{r.deriv.toFixed(4)}</td>
                <td style={{ padding: '4px 8px' }}>{r.flipShift.toFixed(6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        imp-34231: does a MULTI-rung joint shift erase the borderline more cheaply?
      </p>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '0.75rem', maxWidth: 700 }}>
        The single-rung ranking above asks each rung alone; imp-34231 asks the joint question &mdash;
        the minimal L2-norm shift spread across the head cluster (k=6.00, 6.25) AND the far-tail
        endpoint (k={IMP34244_FAR_TAIL_K.toFixed(2)}) together. That joint least-norm
        shift is &#126;{MULTI.clusterTailJointNorm.toFixed(6)}, only{' '}
        {(MULTI.clusterTailNormOverRms * 100).toFixed(2)}% of the residual RMS &#126;
        {IMP34244_RESID_RMS} &mdash; about {(MULTI.clusterTailRatioToSingle * 100).toFixed(1)}% of the
        single-rung head cost ({(100 - MULTI.clusterTailRatioToSingle * 100).toFixed(1)}% cheaper), and
        the absolute all-21-rung floor is &#126;{MULTI.allRungFloorNorm.toFixed(6)} (
        {(MULTI.allRungFloorRatioToSingle * 100).toFixed(1)}% of single). The head endpoint still
        carries &#126;{(MULTI.headEndpointNormShare * 100).toFixed(0)}% of the joint norm, so joining
        rungs only modestly cheapens the flip and the borderline stays head-dominated. Crucially, this
        is still a dissection of the FRAGILE un-HAC l=0 cell only: the HAC-corrected (l&ge;1) statistic
        eta_mu &#126;0.149 is unchanged and remains the primary, non-rejecting reading.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation of the imp-34155
        sensitivity measurement only; no new computation. The l=0 un-HAC borderline being dissected
        is FRAGILE and endpoint-driven; the HAC-corrected (l&ge;1) non-rejection eta_mu &#126;0.149 is
        UNCHANGED and remains the primary reading. C_mb GUE-conditional per imp-486 UNTOUCHED;
        imp-3066 K_a&gt;=0 UNTOUCHED; no RH verdict; NO QED.
      </div>
    </div>
  );
}
