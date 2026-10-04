import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35750_HANDOFF_GRID,
  IMP35750_SIGMA_LADDER,
  IMP35750_MATHEMATICAL_CROSSOVER_SIGMA,
} from '../data/imp-35750-beat-parity-handoff-sigma-viz-data.js';
import { ED } from '../styles/tokens.js';

const BEAT_COLOR = ED.series7;
const BARRIER_COLOR = ED.series1;

function HandoffChart({ rows }) {
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

  const beatPath = rows.map((r, i) => `${i === 0 ? 'M' : 'L'}${xPix(r.sigma)},${yPix(r.beatCarrierShare)}`).join(' ');
  const barrierPath = rows.map((r, i) => `${i === 0 ? 'M' : 'L'}${xPix(r.sigma)},${yPix(r.ctBarrierShare)}`).join(' ');

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

      <path d={barrierPath} fill="none" stroke={BARRIER_COLOR} strokeWidth={2} />
      <path d={beatPath} fill="none" stroke={BEAT_COLOR} strokeWidth={2} />
      {rows.map((r) => (
        <g key={r.sigma}>
          <circle cx={xPix(r.sigma)} cy={yPix(r.ctBarrierShare)} r={3.5} fill={BARRIER_COLOR} />
          <circle cx={xPix(r.sigma)} cy={yPix(r.beatCarrierShare)} r={3.5} fill={BEAT_COLOR} />
          <text x={xPix(r.sigma)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
            {r.sigma.toExponential(0)}
          </text>
        </g>
      ))}

      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={14} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,14,${padT + plotH / 2})`}>
        share of E
      </text>
      <text x={padL + plotW / 2} y={h - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        sigma (log scale, falling far-tail depth &rarr;)
      </text>
    </svg>
  );
}

function HandoffTable({ rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '0.4rem 0.6rem' }}>sigma</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>beat-carrier share (E_coll)</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>C_T-barrier share (E_trunc)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.sigma} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.sigma.toExponential(0)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: BEAT_COLOR }}>
              {r.beatCarrierShare.toExponential(3)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: BARRIER_COLOR }}>
              {r.ctBarrierShare.toFixed(9)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35750BeatParityHandoffSigmaViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Beat &rarr; Parity Handoff Along the Sigma-Axis (imp-35750 / imp-35678)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35678 identified the beat-carrier-to-parity handoff: the GUE-conditional
        beat carrier (E_coll) has far-tail share exactly sigma (imp-486), while the
        surviving C_T-barrier term (E_trunc) has share 1 &minus; sigma &minus;
        E_flow_share (imp-35677 three-class partition). The two curves cross
        mathematically at sigma = {IMP35750_MATHEMATICAL_CROSSOVER_SIGMA}, far above
        the measured far-tail ladder ({IMP35750_SIGMA_LADDER[0].toExponential(0)} down to{' '}
        {IMP35750_SIGMA_LADDER[IMP35750_SIGMA_LADDER.length - 1].toExponential(0)}): by
        the time the ladder starts, the handoff has already completed and the
        C_T-barrier share is already dominant (&gt;99.9%).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        Beat-carrier share (falling) vs C_T-barrier share (rising) across the sigma ladder
      </h3>
      <HandoffChart rows={IMP35750_HANDOFF_GRID} />

      <div style={{ marginTop: '1.5rem' }}>
        <HandoffTable rows={IMP35750_HANDOFF_GRID} />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The ladder illustrates the CONTINUATION of the handoff deep into asymptotic
        parity, not the crossing point itself: the beat-carrier share falls
        monotonically toward zero while the C_T-barrier share rises monotonically
        toward one, with the fixed E_flow_share (&asymp;5.655&times;10&#8315;&#8313;) held
        negligible throughout.
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
        the already-derived imp-35677/imp-35678 sigma-share model (no new derivation, no
        heavy data-module import); C_mb GUE-conditional (imp-486) UNTOUCHED; changes no
        bound, establishes no operator positivity, no RH verdict. NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/rh-proof-state', label: 'RH Proof State Dashboard' },
          { to: '/improvements', label: 'Improvements Log' },
        ]}
      />
    </div>
  );
}
