import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34776_KRAWCZYK_DELTA_SWEEP } from '../data/imp-34776-krawczyk-delta-sweep.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP34776_KRAWCZYK_DELTA_SWEEP;
const M = DATA.measurement;
const DELTA = M.delta_sweep; // 2e-2 .. 2e-8, six decades
const K_STAR = M.k_star; // 4.4813e13 .. 4.5036e7, largest contraction-verified k at each delta
const PREDICTED_SLOPE = M.predicted_slope_one_over_two_eps; // 1/(2 eps) ~ 2.2518e15
const LOGLOG_SLOPE = M.loglog_slope_dlogk_dlogdelta; // ~1.000000

// -- log-log line plot: measured k*(delta) ladder (dots + line) against the imp-34752 predicted
// slope k* = delta/(2 eps) (dashed overlay), on a shared log10(delta) x-axis. --
function DeltaSweepChart() {
  const xs = DELTA.map((d) => Math.log10(d));
  const ysMeasured = K_STAR.map((k) => Math.log10(k));
  const ysPredicted = DELTA.map((d) => Math.log10(d * PREDICTED_SLOPE));

  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ysMeasured, ...ysPredicted) - 0.4;
  const yMax = Math.max(...ysMeasured, ...ysPredicted) + 0.4;

  const svgW = 680;
  const svgH = 340;
  const padL = 66;
  const padR = 24;
  const padT = 24;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const sx = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const measuredPath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${sx(x).toFixed(2)} ${sy(ysMeasured[i]).toFixed(2)}`).join(' ');
  const predictedPath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${sx(x).toFixed(2)} ${sy(ysPredicted[i]).toFixed(2)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL} y={padT - 8} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        log10 k*(delta) vs log10 delta &mdash; measured ladder vs predicted k* = delta/(2 eps)
      </text>

      {/* predicted slope overlay: dashed line k* = delta/(2 eps) */}
      <path d={predictedPath} fill="none" stroke={ED.brassDeco} strokeWidth={2} strokeDasharray="6 4" />
      {/* measured k*(delta) ladder */}
      <path d={measuredPath} fill="none" stroke={ED.series1} strokeWidth={1.8} />
      {xs.map((x, i) => (
        <circle key={`pt-${i}`} cx={sx(x)} cy={sy(ysMeasured[i])} r={3.6} fill={ED.series1} stroke={ED.paper} strokeWidth={0.5} />
      ))}

      {/* x-axis labels: delta values */}
      {xs.map((x, i) => (
        <text key={`xlbl-${i}`} x={sx(x)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {DELTA[i].toExponential(0)}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
        bracket half-width delta
      </text>

      {/* legend */}
      <rect x={padL + 12} y={padT + 10} width={12} height={2.5} fill={ED.series1} />
      <text x={padL + 30} y={padT + 15} fill={ED.series1} fontSize={10}>
        measured k*(delta)
      </text>
      <rect x={padL + 12} y={padT + 26} width={12} height={2.5} fill={ED.brassDeco} />
      <text x={padL + 30} y={padT + 31} fill={ED.brass} fontSize={10}>
        predicted delta/(2 eps)
      </text>
    </svg>
  );
}

export default function Imp34811KrawczykDeltaSweepKStarLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Krawczyk Delta-Sweep k*(delta) Ladder (imp-34811 / imp-34776)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34752 found the outward-ULP Krawczyk budget k* is N-independent at a single fixed bracket
        half-width delta&nbsp;=&nbsp;2e-4, and attributed the flatness to the break condition
        2&middot;k&middot;eps&nbsp;~&nbsp;delta, predicting k*&nbsp;~&nbsp;delta/(2&nbsp;eps). imp-34776
        swept delta over six decades (2e-2&nbsp;..&nbsp;2e-8) at fixed N&nbsp;=&nbsp;1e9 and tabulated the
        largest contraction-verified k at each rung. The chart below plots that measured ladder (blue)
        against the imp-34752 predicted slope line (yellow, dashed): the two tracks run parallel across
        all six decades, with the log-log fit slope &asymp;&nbsp;{LOGLOG_SLOPE.toFixed(6)}, confirming
        k*(delta) is linear in delta and that the slope converges to the predicted 1/(2&nbsp;eps).
      </p>

      <DeltaSweepChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>delta</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>k*(delta)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>k*/delta</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>ratio to prediction</th>
          </tr>
        </thead>
        <tbody>
          {DELTA.map((d, i) => (
            <tr key={d} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{d.toExponential(1)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{K_STAR[i].toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.slope_k_star_over_delta[i].toExponential(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.slope_ratio_to_prediction[i]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        Predicted slope 1/(2&nbsp;eps) &asymp; {PREDICTED_SLOPE.toExponential(6)}; measured log-log slope
        d&nbsp;log&nbsp;k*&nbsp;/&nbsp;d&nbsp;log&nbsp;delta &asymp; {LOGLOG_SLOPE.toFixed(6)} (predicted 1
        if k* is exactly linear in delta). Max relative spread of the slope k*/delta across
        N&nbsp;=&nbsp;1e9,&nbsp;1e10,&nbsp;3.28e9: {M.max_slope_N_spread.toExponential(4)}.
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-34776
        table (imported literals, no new computation); establishes no new numerical claim. Double-precision
        surrogate for the imp-34687a directed-rounding layer; does NOT close the imp-34714a machine
        certificate, which REMAINS OPEN. Inherited imp-3220/imp-3406 surrogate crossover map; C_C&nbsp;=
        &nbsp;(1/8)&radic;(3&pi;) (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 untouched;
        imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; establishes no operator positivity; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
