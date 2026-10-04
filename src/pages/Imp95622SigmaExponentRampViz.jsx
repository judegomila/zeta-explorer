import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95606_FINE_GRID,
  IMP95606_MIDPOINT_BRIDGE,
  IMP95606_TRANSITION,
  IMP95606_FAR_TAIL_EXPONENT,
} from '../data/imp-95606-sigma-postpeak-fine-exponent-ramp-viz-data.js';
import { SIGMA_EXPONENT_CROSSINGS } from '../data/imp-95625-sigma-exponent-crossing-ladder-table.js';
import { ED } from '../styles/tokens.js';

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
        <line key={`g${v}`} x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}
      <line
        x1={padL}
        y1={asymptoteY}
        x2={padL + plotW}
        y2={asymptoteY}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <text x={padL + plotW - 4} y={asymptoteY - 4} textAnchor="end" fill={ED.inkSoft} fontSize={9}>
        imp-3463 asymptote p&nbsp;=&nbsp;{IMP95606_FAR_TAIL_EXPONENT}
      </text>
      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2} />
      {IMP95606_FINE_GRID.map((r) => (
        <circle key={r.log10N} cx={xOf(r.log10N)} cy={yOf(r.p_local)} r={3.5} fill={ED.series1} />
      ))}
      <circle
        cx={xOf(IMP95606_TRANSITION.log10N_transition)}
        cy={yOf(IMP95606_TRANSITION.p_at_transition)}
        r={6}
        fill={ED.brassDeco}
      />
      <text
        x={xOf(IMP95606_TRANSITION.log10N_transition)}
        y={yOf(IMP95606_TRANSITION.p_at_transition) - 12}
        textAnchor="middle"
        fill={ED.brass}
        fontSize={9.5}
      >
        E_coll=E_trunc, log10N={IMP95606_TRANSITION.log10N_transition}
      </text>
      {[6, 7, 8, 9, 10, 11, 12].map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
          {v}
        </text>
      ))}
      {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v) => (
        <text key={`t${v}`} x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v.toFixed(1)}
        </text>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 N
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
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
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a
        measurement/presentation-only page rendering the frozen imp-95582/imp-95606
        pointwise ramp data (no re-derivation). It changes no bound and proves no
        RH-relevant theorem. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state
        of the art. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
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

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        p_local(N) ramp, N = 10<sup>6</sup>..10<sup>12</sup>
      </h3>
      <RampChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>log10 N</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>p_local</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>sigma</th>
          </tr>
        </thead>
        <tbody>
          {IMP95606_FINE_GRID.map((r) => (
            <tr key={r.log10N} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.log10N}</td>
              <td style={{ textAlign: 'right' }}>{r.p_local.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.sigma.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Whole-decade OLS (imp-33582) vs pointwise midpoint value
      </h3>
      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>decade</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>p pointwise (midpoint)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>p OLS (whole decade)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>rel. diff.</th>
          </tr>
        </thead>
        <tbody>
          {IMP95606_MIDPOINT_BRIDGE.map((r) => (
            <tr key={r.decade} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
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
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Midpoint-sampling check:</strong> the
        coarse six-number whole-decade OLS ladder from imp-33582 is unbiased
        midpoint sampling of the fine imp-95582 ramp &mdash; the worst gap between
        the pointwise value at a decade midpoint and the whole-decade OLS fit is
        only 5.45% (first decade), shrinking to under 0.6% by the fourth decade.
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Far-tail tolerance crossings (imp-95625)
      </h3>
      <div
        style={{
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-1) 5%, transparent)',
          borderLeft: '3px solid var(--series-1)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink)',
        }}
      >
        The chart above only covers log10&nbsp;N&nbsp;=&nbsp;6..12, where p_local
        never gets within 1% of the asymptote. Continuing the same ramp (imp-95602)
        to far larger heights locates two tolerance crossings:
        <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ color: 'var(--ink-faint)' }}>
              <th style={{ textAlign: 'left', paddingBottom: 4 }}>tolerance</th>
              <th style={{ textAlign: 'right', paddingBottom: 4 }}>log10 N</th>
              <th style={{ textAlign: 'right', paddingBottom: 4 }}>N</th>
              <th style={{ textAlign: 'right', paddingBottom: 4 }}>p_local</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>within 1%</td>
              <td style={{ textAlign: 'right' }}>{SIGMA_EXPONENT_CROSSINGS.within1pct.log10N}</td>
              <td style={{ textAlign: 'right' }}>{SIGMA_EXPONENT_CROSSINGS.within1pct.N}</td>
              <td style={{ textAlign: 'right' }}>{SIGMA_EXPONENT_CROSSINGS.within1pct.p}</td>
            </tr>
            <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>within 0.1%</td>
              <td style={{ textAlign: 'right' }}>{SIGMA_EXPONENT_CROSSINGS.within0p1pct.log10N}</td>
              <td style={{ textAlign: 'right' }}>{SIGMA_EXPONENT_CROSSINGS.within0p1pct.N}</td>
              <td style={{ textAlign: 'right' }}>{SIGMA_EXPONENT_CROSSINGS.within0p1pct.p}</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
          Tightening the tolerance ten-fold (1%&nbsp;&rarr;&nbsp;0.1%) costs roughly
          ten-fold more log10&nbsp;N ({SIGMA_EXPONENT_CROSSINGS.within1pct.log10N}&nbsp;&rarr;&nbsp;
          {SIGMA_EXPONENT_CROSSINGS.within0p1pct.log10N}), the signature of a
          1/log&nbsp;N deficit decay. Measurement/fit only; no Lambda bound moves.
        </p>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page
        rendering the frozen imp-95582/imp-95606 baked record (no re-derivation).
        Supplies no off-lattice floor theorem, changes no bound, establishes no
        operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2
        remains SOTA. NO QED.
      </div>
    </div>
  );
}
