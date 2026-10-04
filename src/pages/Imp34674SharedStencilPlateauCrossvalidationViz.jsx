import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34649_PLATEAU_DRIFT_SHARED_STENCIL } from '../data/imp-34649-plateau-drift-shared-stencil-crossvalidation.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP34649_PLATEAU_DRIFT_SHARED_STENCIL;

const PLATEAU_ROWS = [
  { label: '2nd order', order: 2, plateau: DATA.plateau_drift_2nd_order, tailSpread: DATA.tail_drift_spread_2nd_order },
  { label: '4th order', order: 4, plateau: DATA.plateau_drift_4th_order, tailSpread: DATA.tail_drift_spread_4th_order },
  { label: '6th order', order: 6, plateau: DATA.plateau_drift_6th_order, tailSpread: DATA.tail_drift_spread_6th_order },
];

// Plateaus cluster within ~1.3e-5 around -0.0968; plot in units of 1e-6 relative to a
// -0.0968 baseline so the pairwise agreement is legible.
const BASE = -0.0968;
const toUnits = (v) => (v - BASE) * 1e6;

function PlateauChart() {
  const svgW = 640;
  const svgH = 260;
  const padL = 64;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 1;
  const maxX = 7;
  const vals = PLATEAU_ROWS.map((r) => toUnits(r.plateau));
  const minY = Math.min(...vals) - 3;
  const maxY = Math.max(...vals) + 3;

  const xAt = (order) => padL + ((order - minX) / (maxX - minX)) * cW;
  const yAt = (u) => padT + cH - ((u - minY) / (maxY - minY)) * cH;

  const linePoints = PLATEAU_ROWS.map((r) => `${xAt(r.order)},${yAt(toUnits(r.plateau))}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={linePoints} fill="none" stroke={ED.series1} strokeWidth={1.5} strokeDasharray="3,3" />
      {PLATEAU_ROWS.map((r) => (
        <g key={r.label}>
          <circle cx={xAt(r.order)} cy={yAt(toUnits(r.plateau))} r={5} fill={ED.series7} stroke={ED.paper} strokeWidth={0.75} />
          <text x={xAt(r.order)} y={yAt(toUnits(r.plateau)) - 12} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
            {r.plateau.toFixed(6)}
          </text>
          <text x={xAt(r.order)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10.5}>
            {r.label}
          </text>
        </g>
      ))}
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 16 ${padT + cH / 2})`}>
        plateau drift, (value &minus; ({BASE})) &times; 1e6
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        finite-difference stencil order (shared coefficient-table code path)
      </text>
    </svg>
  );
}

function TailSpreadChart() {
  const svgW = 640;
  const svgH = 220;
  const padL = 64;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 1;
  const maxX = 7;
  const maxY = Math.max(...PLATEAU_ROWS.map((r) => r.tailSpread)) * 1.15;

  const xAt = (order) => padL + ((order - minX) / (maxX - minX)) * cW;
  const yAt = (s) => padT + cH - (s / maxY) * cH;
  const barW = 70;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {PLATEAU_ROWS.map((r) => {
        const x = xAt(r.order);
        const y = yAt(r.tailSpread);
        return (
          <g key={r.label}>
            <rect x={x - barW / 2} y={y} width={barW} height={padT + cH - y} fill={ED.series5} opacity={0.8} />
            <text x={x} y={y - 8} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
              {r.tailSpread.toExponential(2)}
            </text>
            <text x={x} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10.5}>
              {r.label}
            </text>
          </g>
        );
      })}
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 16 ${padT + cH / 2})`}>
        large-dp tail spread
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        finite-difference stencil order
      </text>
    </svg>
  );
}

export default function Imp34674SharedStencilPlateauCrossvalidationViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Three-Stencil Plateau Crossvalidation, Shared Code Path (imp-34649)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The q3-share plateau drift ~ &minus;0.0968 was previously confirmed separately for the
        2nd/4th-order (imp-34611) and 6th-order (imp-34626) stencils, each with its own hand-written
        inline arithmetic. imp-34649 re-derives all three plateaus from ONE shared coefficient-table
        code path (a single evalDeriv/shareOf pair whose only per-order input is a pure
        {' '}{'{offset, weight}'} table), removing the risk that the reported order-independence was a
        per-module transcription artifact rather than a real property of the model.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Plateau drift by stencil order (pairwise agreement &le; {DATA.max_pairwise_agreement_abs})
      </p>
      <PlateauChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Large-dp tail spread by stencil order (wider stencil, noisier)
      </p>
      <TailSpreadChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Finding:</strong> driven through one shared code path the
        three plateaus are 2nd &asymp; {DATA.plateau_drift_2nd_order}, 4th &asymp;{' '}
        {DATA.plateau_drift_4th_order}, 6th &asymp; {DATA.plateau_drift_6th_order}, with every pairwise
        agreement &le; {DATA.max_pairwise_agreement_abs} &mdash; the ~2e-5 truncation-order-independence
        is real, not a per-module implementation artifact. The 6th-vs-4th agreement
        ({DATA.agree_6th_vs_4th_abs}) is still looser than 2nd-vs-4th ({DATA.agree_4th_vs_2nd_abs}), and
        the large-dp tail spread still grows with stencil width (2nd {DATA.tail_drift_spread_2nd_order},
        4th {DATA.tail_drift_spread_4th_order}, 6th {DATA.tail_drift_spread_6th_order}) &mdash; the same
        roundoff-conditioning-floor signature, reproduced from a single code path.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement only, isRigorous false.
        Re-aggregates an already-certified decomposition through a single coefficient-table code path; it
        changes no bound. The C_mb GUE-conditional per imp-486 is untouched; imp-3066 K_a&gt;=0 untouched;
        no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
