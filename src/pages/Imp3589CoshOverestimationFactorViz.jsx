import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3589_T_A,
  IMP3589_A_LADDER,
  IMP3589_PROFILE,
  IMP3589_TOP_OF_LADDER,
  IMP3589_A_LIMIT,
  IMP3589_MAX_ENVELOPE_GAP_PCT,
} from '../data/imp-3589-cosh-overestimation-factor-viz-data.js';
import { ED } from '../styles/tokens.js';

const RUNG_COLORS = [ED.series7, ED.series1, ED.series3, ED.series4, ED.series5];
const ENVELOPE_COLOR = ED.series4;

const LOG_A_MIN = Math.log10(0.0625);
const LOG_A_MAX = Math.log10(0.5);
const LOG_F_MIN = 0; // log10(1)
const LOG_F_MAX = Math.log10(11);

// Continuous cosh(a T_A) envelope, sampled across the ladder span.
const ENVELOPE_POINTS = Array.from({ length: 41 }, (_, i) => {
  const logA = LOG_A_MIN + ((LOG_A_MAX - LOG_A_MIN) * i) / 40;
  const a = 10 ** logA;
  return { a, cosh: Math.cosh(a * IMP3589_T_A) };
});

function OverEstimationChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 300;
  const svgH = padT + cH + padB;

  const xS = (a) => padL + ((Math.log10(a) - LOG_A_MIN) / (LOG_A_MAX - LOG_A_MIN)) * cW;
  const yS = (f) => padT + cH * (1 - (Math.log10(f) - LOG_F_MIN) / (LOG_F_MAX - LOG_F_MIN));

  const envelopePath = ENVELOPE_POINTS.map((p, i) => (i === 0 ? 'M' : 'L') + xS(p.a).toFixed(1) + ',' + yS(p.cosh).toFixed(2)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[1, 2, 5, 10].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* cosh(a T_A) ceiling envelope */}
      <path d={envelopePath} fill="none" stroke={ENVELOPE_COLOR} strokeWidth={1.6} strokeDasharray="5,3" />

      {/* per-rung F_n(a) polylines across the a-ladder, n=0..4 */}
      {IMP3589_PROFILE.map((p, idx) => {
        const path = p.rows
          .map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.a).toFixed(1) + ',' + yS(r.factor).toFixed(2))
          .join(' ');
        return (
          <g key={p.n}>
            <path d={path} fill="none" stroke={RUNG_COLORS[idx]} strokeWidth={1.8} opacity={0.9} />
            {p.rows.map((r) => (
              <circle key={r.a} cx={xS(r.a)} cy={yS(r.factor)} r={2.6} fill={RUNG_COLORS[idx]} />
            ))}
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {IMP3589_A_LADDER.map((a) => (
        <g key={'x' + a}>
          <line x1={xS(a)} y1={padT + cH} x2={xS(a)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(a)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {a}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        a
      </text>

      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        F_n(a) (log scale)
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={ENVELOPE_COLOR} strokeWidth={1.6} strokeDasharray="4,2" />
        <text x={padL + 14} y={padT + 15} fill={ED.brass}>cosh(a T_A) ceiling envelope</text>
        {IMP3589_PROFILE.map((p, idx) => (
          <g key={p.n}>
            <line x1={padL + 2} y1={padT + 26 + idx * 13} x2={padL + 10} y2={padT + 26 + idx * 13} stroke={RUNG_COLORS[idx]} strokeWidth={2} />
            <text x={padL + 14} y={padT + 29 + idx * 13} fill={ED.inkSoft}>F_{p.n}(a)</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function Imp3589CoshOverestimationFactorViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Cosh-Certificate Over-Estimation Factor F_n(a) (imp-3552 / imp-3589)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-3532 sharp cosh(a T_A) moment-tail certificate over-estimates the exact residual
        by the factor F_n(a) = bound_sharp(a,n)/|E_n(a)|, measured here across the a-ladder a in
        {' '}{IMP3589_A_LADDER.join(', ')} for rungs n = 0..4. F_n(a) collapses from{' '}
        {IMP3589_TOP_OF_LADDER.worstFactor.toFixed(2)} at a = {IMP3589_TOP_OF_LADDER.a} (roughly
        cosh 3) down to {IMP3589_A_LIMIT.worstFactor.toFixed(4)} at a = {IMP3589_A_LIMIT.a},
        hugging the cosh(a T_A) ceiling envelope to within {IMP3589_MAX_ENVELOPE_GAP_PCT}% on
        every rung/a.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Over-estimation factor F_n(a) vs a (rungs n=0..4) against the cosh(a T_A) ceiling
      </p>
      <OverEstimationChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/certification
        only -- no proof, no reduction below RH. F_n(a) = cosh(a T_A)/S_n(a) with the
        residual-shape factor S_n(a) &ge; 1 staying within 0.045% of 1 across the ladder, so the
        over-estimation is dominated by the cosh(a T_A) inflation constant, not the residual
        shape. Mass-feasibility is necessary-but-not-sufficient; the operator-level K_a &ge; 0
        sign-positivity (imp-3066) remains untouched.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3567-closed-error-certificate" style={{ color: 'var(--series-5)' }}>
          Closed Error Certificate (imp-3567)
        </Link>
      </div>
    </div>
  );
}
