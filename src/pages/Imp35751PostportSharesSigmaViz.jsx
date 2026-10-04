import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35751_POSTPORT_SHARES_GRID,
  IMP35751_SIGMA_LADDER,
} from '../data/imp-35751-postport-shares-sigma-viz-data.js';
import { ED } from '../styles/tokens.js';

const RESIDUAL_COLOR = ED.series7;
const UNCONDITIONAL_COLOR = ED.series1;

function SharesChart({ rows }) {
  const w = 720;
  const h = 260;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const logX = (sigma) => Math.log10(sigma);
  const xMin = logX(rows[rows.length - 1].sigma);
  const xMax = logX(rows[0].sigma);
  const xPix = (sigma) => padL + ((logX(sigma) - xMin) / (xMax - xMin)) * plotW;
  const yPix = (share) => padT + plotH - share * plotH;

  const residualPath = rows
    .map((r, i) => `${i === 0 ? 'M' : 'L'}${xPix(r.sigma)},${yPix(r.residualGueShare)}`)
    .join(' ');
  const unconditionalPath = rows
    .map((r, i) => `${i === 0 ? 'M' : 'L'}${xPix(r.sigma)},${yPix(r.unconditionalShare)}`)
    .join(' ');

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill={ED.paper} rx={2} />

      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <g key={v}>
          <line x1={padL} x2={padL + plotW} y1={yPix(v)} y2={yPix(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 8} y={yPix(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
            {v}
          </text>
        </g>
      ))}

      <path d={unconditionalPath} fill="none" stroke={UNCONDITIONAL_COLOR} strokeWidth={2} />
      <path d={residualPath} fill="none" stroke={RESIDUAL_COLOR} strokeWidth={2} />
      {rows.map((r) => (
        <g key={r.sigma}>
          <circle cx={xPix(r.sigma)} cy={yPix(r.unconditionalShare)} r={3.5} fill={UNCONDITIONAL_COLOR} />
          <circle cx={xPix(r.sigma)} cy={yPix(r.residualGueShare)} r={3.5} fill={RESIDUAL_COLOR} />
          <text x={xPix(r.sigma)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
            {r.sigma.toExponential(0)}
          </text>
        </g>
      ))}

      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90,14,${padT + plotH / 2})`}
      >
        share of E (post-port)
      </text>
      <text x={padL + plotW / 2} y={h - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        sigma (log scale, falling far-tail depth &rarr;)
      </text>
    </svg>
  );
}

function SharesTable({ rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '0.4rem 0.6rem' }}>sigma</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>residual GUE-conditional share</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>unconditional share (1 &minus; sigma)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.sigma} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.sigma.toExponential(0)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: RESIDUAL_COLOR }}>
              {r.residualGueShare.toExponential(3)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: UNCONDITIONAL_COLOR }}>
              {r.unconditionalShare.toFixed(9)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35751PostportSharesSigmaViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Post-Port Provenance Shares Across the Sigma-Ladder (imp-35751 / imp-35677)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35677 partitioned the post-port error budget into a residual
        GUE-conditional share (= sigma, imp-486) and a surviving unconditional
        share (= 1 &minus; sigma, covering E_trunc + E_flow). Across the four-rung
        far-tail ladder ({IMP35751_SIGMA_LADDER[0].toExponential(0)} down to{' '}
        {IMP35751_SIGMA_LADDER[IMP35751_SIGMA_LADDER.length - 1].toExponential(0)}),
        the residual share vanishes by exactly a factor of 10 per rung while the
        unconditional share rises from 0.999 toward 0.999999.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        Residual GUE-conditional share (falling) vs unconditional share (rising) across the sigma ladder
      </h3>
      <SharesChart rows={IMP35751_POSTPORT_SHARES_GRID} />

      <div style={{ marginTop: '1.5rem' }}>
        <SharesTable rows={IMP35751_POSTPORT_SHARES_GRID} />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The two shares sum to exactly 1 at every rung by construction (imp-35677):
        the ladder illustrates how thoroughly the post-port budget is dominated by
        the unconditional term once the far-tail depth deepens even modestly.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only of
        the already-derived imp-35677 sigma-share model (no new derivation, no
        heavy data-module import); C_mb GUE-conditional (imp-486) UNTOUCHED; changes no
        bound, establishes no operator positivity, no RH verdict. NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/viz-imp35750-beat-parity-handoff-sigma', label: 'Beat -> Parity Handoff Along the Sigma-Axis' },
          { to: '/rh-proof-state', label: 'RH Proof State Dashboard' },
          { to: '/improvements', label: 'Improvements Log' },
        ]}
      />
    </div>
  );
}
