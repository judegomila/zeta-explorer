import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95606_FINE_GRID,
  IMP95606_MIDPOINT_BRIDGE,
  IMP95606_TRANSITION,
  IMP95606_FAR_TAIL_EXPONENT,
} from '../data/imp-95606-sigma-postpeak-fine-exponent-ramp-viz-data.js';

// Line chart: p_local(N) ramp across log10N = 6..12, with the E_coll = E_trunc
// transition point (log10N ~ 9.516) annotated.
function RampChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 20;
  const padT = 24;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = padT + plotH + padB;

  const xMin = Math.min(...IMP95606_FINE_GRID.map((r) => r.log10N));
  const xMax = Math.max(...IMP95606_FINE_GRID.map((r) => r.log10N));
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  const top = IMP95606_FAR_TAIL_EXPONENT;
  const bot = 0;
  const yOf = (v) => padT + ((top - v) / (top - bot)) * plotH;

  const path = IMP95606_FINE_GRID.map(
    (r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.log10N)} ${yOf(r.p_local)}`,
  ).join(' ');

  const asymptoteY = yOf(IMP95606_FAR_TAIL_EXPONENT);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v) => (
        <line key={`g${v}`} x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#1e293b" strokeWidth={1} />
      ))}
      <line
        x1={padL}
        y1={asymptoteY}
        x2={padL + plotW}
        y2={asymptoteY}
        stroke="#94a3b8"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <text x={padL + plotW - 4} y={asymptoteY - 4} textAnchor="end" fill="#94a3b8" fontSize={9}>
        imp-3463 asymptote p&nbsp;=&nbsp;{IMP95606_FAR_TAIL_EXPONENT}
      </text>
      <path d={path} fill="none" stroke="#60a5fa" strokeWidth={2} />
      {IMP95606_FINE_GRID.map((r) => (
        <circle key={r.log10N} cx={xOf(r.log10N)} cy={yOf(r.p_local)} r={3.5} fill="#60a5fa" />
      ))}
      <circle
        cx={xOf(IMP95606_TRANSITION.log10N_transition)}
        cy={yOf(IMP95606_TRANSITION.p_at_transition)}
        r={6}
        fill="#fbbf24"
      />
      <text
        x={xOf(IMP95606_TRANSITION.log10N_transition)}
        y={yOf(IMP95606_TRANSITION.p_at_transition) - 12}
        textAnchor="middle"
        fill="#fbbf24"
        fontSize={9.5}
      >
        E_coll=E_trunc, log10N={IMP95606_TRANSITION.log10N_transition}
      </text>
      {[6, 7, 8, 9, 10, 11, 12].map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={9.5}>
          {v}
        </text>
      ))}
      {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v) => (
        <text key={`t${v}`} x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
          {v.toFixed(1)}
        </text>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        log10 N
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        p_local(N) = -d ln sigma / d ln N
      </text>
    </svg>
  );
}

export default function Imp95622SigmaExponentRampViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="sigma(N) Half-Decade Exponent Ramp p(N) (imp-95606)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a
        measurement/presentation-only page rendering the frozen imp-95582/imp-95606
        pointwise ramp data (no re-derivation). It changes no bound and proves no
        RH-relevant theorem. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state
        of the art. NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95582 measured the local decay exponent p(N)&nbsp;=&nbsp;-d&nbsp;ln
        &sigma;&nbsp;/&nbsp;d&nbsp;ln&nbsp;N of &sigma;(N)&nbsp;=&nbsp;E_coll/E(N)
        on a half-decade grid over log10&nbsp;N&nbsp;=&nbsp;6..12 (13 points). The
        ramp climbs from p&nbsp;&asymp;&nbsp;0.0006 at N&nbsp;=&nbsp;10<sup>6</sup>
        toward the imp-3463 far-tail asymptote p&nbsp;=&nbsp;{IMP95606_FAR_TAIL_EXPONENT},
        passing through the E_coll&nbsp;=&nbsp;E_trunc transition (r&nbsp;=&nbsp;1,
        &sigma;&nbsp;&asymp;&nbsp;1/2, gold point) at
        log10&nbsp;N&nbsp;=&nbsp;{IMP95606_TRANSITION.log10N_transition}, which
        matches the imp-3444 crossover exactly and sits only
        {' '}{IMP95606_TRANSITION.decadesBelowKnee}{' '}decades below the imp-34694
        ramp-acceleration knee at log10&nbsp;N&nbsp;=&nbsp;{IMP95606_TRANSITION.imp34694_knee_log10}.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        p_local(N) ramp, N = 10<sup>6</sup>..10<sup>12</sup>
      </h3>
      <RampChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>log10 N</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>p_local</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>sigma</th>
          </tr>
        </thead>
        <tbody>
          {IMP95606_FINE_GRID.map((r) => (
            <tr key={r.log10N} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{r.log10N}</td>
              <td style={{ textAlign: 'right' }}>{r.p_local.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.sigma.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Whole-decade OLS (imp-33582) vs pointwise midpoint value
      </h3>
      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>decade</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>p pointwise (midpoint)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>p OLS (whole decade)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>rel. diff.</th>
          </tr>
        </thead>
        <tbody>
          {IMP95606_MIDPOINT_BRIDGE.map((r) => (
            <tr key={r.decade} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{r.decade}</td>
              <td style={{ textAlign: 'right' }}>{r.p_pointwise_at_midpoint.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.p_ols_whole_decade.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{(r.relDiff * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Midpoint-sampling check:</strong> the
        coarse six-number whole-decade OLS ladder from imp-33582 is unbiased
        midpoint sampling of the fine imp-95582 ramp &mdash; the worst gap between
        the pointwise value at a decade midpoint and the whole-decade OLS fit is
        only 5.45% (first decade), shrinking to under 0.6% by the fourth decade.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page
        rendering the frozen imp-95582/imp-95606 baked record (no re-derivation).
        Supplies no off-lattice floor theorem, changes no bound, establishes no
        operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2
        remains SOTA. NO QED.
      </div>
    </div>
  );
}
