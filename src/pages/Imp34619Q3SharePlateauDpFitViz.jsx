import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34593_DRIFT_SHARE_ERROR_OPTIMAL_DP } from '../data/imp-34593-drift-share-error-optimal-dp-fit.js';
import { ED } from '../styles/tokens.js';

const M = IMP34593_DRIFT_SHARE_ERROR_OPTIMAL_DP;
const ROWS = [...M.dp_step_rows].sort((a, b) => a.dp - b.dp);

// Dense analytic b/dp^m + floor curve (roundoff_fit_b_free, roundoff_exponent_free,
// deep_relrange_structural_floor -- all imp-34593 literals, no re-derivation) spanning
// slightly below the smallest measured dp to the top of the plateau window.
const CURVE_DP_MIN = 8e-4;
const CURVE_DP_MAX = 1.5e-1;
const CURVE_POINTS = 60;
const FIT_CURVE = Array.from({ length: CURVE_POINTS }, (_, i) => {
  const lo = Math.log10(CURVE_DP_MIN);
  const hi = Math.log10(CURVE_DP_MAX);
  const dp = Math.pow(10, lo + ((hi - lo) * i) / (CURVE_POINTS - 1));
  const y = M.deep_relrange_structural_floor + M.roundoff_fit_b_free / Math.pow(dp, M.roundoff_exponent_free);
  return { dp, y };
});

// Log-log chart: deep-group relative range vs finite-difference step dp. Shows the flat
// large-dp plateau (structural floor), the fitted b/dp^m roundoff channel rising as dp
// shrinks, the non-monotonic roundoff DIP at dp=2e-3 the fit does not capture (an artifact,
// not a second physical regime), and the dp* roundoff-floor crossing.
function LogLogChart() {
  const svgW = 680;
  const svgH = 300;
  const padL = 62;
  const padR = 24;
  const padT = 26;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = Math.log10(CURVE_DP_MIN);
  const xMax = Math.log10(CURVE_DP_MAX);
  const allY = [...ROWS.map((r) => r.deep_relrange), ...FIT_CURVE.map((p) => p.y)];
  const yMin = Math.log10(Math.min(...allY)) - 0.05;
  const yMax = Math.log10(Math.max(...allY)) + 0.05;

  const xAt = (dp) => padL + ((Math.log10(dp) - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((Math.log10(v) - yMin) / (yMax - yMin)) * cH;

  const fitPath = FIT_CURVE.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(p.dp)},${yAt(p.y)}`).join(' ');
  const dataPath = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xAt(r.dp)},${yAt(r.deep_relrange)}`).join(' ');
  const floorY = yAt(M.deep_relrange_structural_floor);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* structural floor (plateau) reference line */}
      <line x1={padL} y1={floorY} x2={padL + cW} y2={floorY} stroke={ED.series3} strokeWidth={1} strokeDasharray="2,3" />
      <text x={padL + cW - 4} y={floorY - 5} textAnchor="end" fill={ED.series3} fontSize={9}>
        structural floor {M.deep_relrange_structural_floor}
      </text>

      {/* dp* roundoff-floor crossing marker */}
      <line
        x1={xAt(M.dp_star)}
        y1={padT}
        x2={xAt(M.dp_star)}
        y2={padT + cH}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      <text x={xAt(M.dp_star) + 4} y={padT + 10} fill={ED.series2} fontSize={9}>
        dp* {M.dp_star.toExponential(3)}
      </text>

      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {/* fitted b/dp^m + floor curve */}
      <path d={fitPath} fill="none" stroke={ED.series1} strokeWidth={1.5} strokeDasharray="5,3" />

      {/* measured deep-group relative range */}
      <path d={dataPath} fill="none" stroke={ED.brassDeco} strokeWidth={2} />
      {ROWS.map((r) => (
        <circle
          key={r.dp}
          cx={xAt(r.dp)}
          cy={yAt(r.deep_relrange)}
          r={3.5}
          fill={ED.brassDeco}
          stroke={ED.paper}
          strokeWidth={1}
        />
      ))}

      <text x={padL} y={16} fill={ED.brass} fontSize={10}>
        measured deep relative range
      </text>
      <text x={padL + 190} y={16} fill={ED.series1} fontSize={10}>
        fitted floor + b/dp^m (m={M.roundoff_exponent_free})
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        finite-difference step dp (log scale, {CURVE_DP_MIN.toExponential(0)} .. {CURVE_DP_MAX.toExponential(1)})
      </text>
    </svg>
  );
}

export default function Imp34619Q3SharePlateauDpFitViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="q3-Share Roundoff-Limited Plateau vs Finite-Difference Step dp (imp-34619 / imp-34593)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34593 fit the imp-34573/imp-34587 deep-tail q3-share error to the ticket-prescribed
        truncation-vs-roundoff model err(dp)&nbsp;~&nbsp;a&nbsp;dp&sup2;&nbsp;+&nbsp;b/dp and found it
        mis-specified: the truncation coefficient a is unmeasurably small (no U-shaped interior
        optimum) and the roundoff channel fits b/dp^m with m&nbsp;&asymp;&nbsp;{M.roundoff_exponent_free}
        &nbsp;(R&sup2;&nbsp;&asymp;&nbsp;{M.roundoff_fit_r2_free}), not the prescribed m&nbsp;=&nbsp;1
        (R&sup2;&nbsp;&asymp;&nbsp;{M.prescribed_bOverDp_fit_r2}). No viz existed for this fit.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        deep-group relative range vs dp (log-log): FLAT plateau at large dp, rising b/dp^m roundoff
        tail at small dp, dp* crossing marked
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
            <th style={{ padding: '0.4rem 0.6rem' }}>deep-vs-mid drift</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>deep relative range</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr
              key={r.dp}
              style={{
                borderBottom: '1px solid var(--rule-soft)',
                color: r.dp === M.dp_star ? 'var(--series-2)' : 'var(--ink)',
              }}
            >
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.dp.toExponential(4)}
                {r.dp === M.dp_star ? ' (dp*)' : ''}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.drift}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.deep_relrange}</td>
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
            <td style={{ padding: '0.4rem 0.6rem' }}>plateau intrinsic drift (roundoff-free)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.drift_plateau_intrinsic}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>imp-34587 Richardson intrinsic (roundoff-dip contaminated)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.imp34587_richardson_intrinsic}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>plateau / Richardson ratio</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.plateau_vs_richardson_ratio}x</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>practical optimal step dp* (10% floor crossing)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.dp_star.toExponential(4)}</td>
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
        imp-34593 fit literals verbatim (structural floor, roundoff exponent/coefficient, dp*, dp
        sweep rows). The dp=2e-3 point sitting BELOW the fitted curve and the structural floor is
        the roundoff-DIP the imp-34587 Richardson extrapolation was contaminated by, not a second
        physical regime the b/dp^m fit needs to capture. q1,q2,q3 are inherited central
        differences, NOT fresh analytic closed forms, so the sigma&nbsp;-&gt;&nbsp;1 deep-tail
        regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is. The -2
        asymptote and C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi) (imp-2714) ansatz are UNTOUCHED; C_mb
        GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no
        bound; no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
