import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34406_EFLOW_ATTR_RUNGS } from '../data/imp-34406-eflow-attr-smooth-nonzero-across-pole.js';
import {
  IMP34570_POWER_LAW_AMPLITUDE,
  IMP34570_POWER_LAW_EXPONENT,
} from '../data/imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js';
import { IMP34572_FAR_SIDE_RUNGS } from '../data/imp-34572-eflow-attr-far-side-pole-smoothness.js';
import {
  IMP34589_FAR_POWER_LAW_AMPLITUDE,
  IMP34589_FAR_POWER_LAW_EXPONENT,
  IMP34589_EFLOW_ATTR_FAR_SIDE_SLOPE_CONTINUITY as M,
} from '../data/imp-34589-eflow-attr-far-side-power-law-slope-continuity.js';
import { ED } from '../styles/tokens.js';

const KSTAR = M.kStar; // 21.28095
const KSTAR_RUNG = IMP34406_EFLOW_ATTR_RUNGS.find((r) => r.k === KSTAR);

// log10(eflowAttr) = log10(A) + p*(k+1), since N = 10^(k+1) and ln N = ln10*(k+1).
const nearLog10 = (k) => Math.log10(IMP34570_POWER_LAW_AMPLITUDE) + IMP34570_POWER_LAW_EXPONENT * (k + 1);
const farLog10 = (k) => Math.log10(IMP34589_FAR_POWER_LAW_AMPLITUDE) + IMP34589_FAR_POWER_LAW_EXPONENT * (k + 1);

const NEAR_FIT_LINE = [21.0, 21.5].map((k) => ({ k, y: nearLog10(k) }));
const FAR_FIT_LINE = [21.3, 21.6].map((k) => ({ k, y: farLog10(k) }));

// Short reference segment through the AT-pole rung with the analytic E_flow per-k slope,
// in log10(eflowAttr)/k units (perKSlope is d ln(eflowAttr)/dk, so divide by ln10).
const ANALYTIC_SLOPE_LOG10 = M.eflowAnalyticSlopePerK / Math.LN10;
const KSTAR_LOG10 = Math.log10(KSTAR_RUNG.eflowAttr);
const ANALYTIC_REF_LINE = [-0.08, 0.08].map((dk) => ({
  k: KSTAR + dk,
  y: KSTAR_LOG10 + ANALYTIC_SLOPE_LOG10 * dk,
}));

// Far-side rungs that are NEW past the imp-34406 overlap (21.35/21.45/21.55/21.6).
const FAR_ONLY_RUNGS = IMP34572_FAR_SIDE_RUNGS.filter(
  (r) => !IMP34406_EFLOW_ATTR_RUNGS.some((n) => n.k === r.k),
);

// Chart 1: log10(eflow_attr) vs k, near/far rungs + both power-law fits + the analytic
// reference slope through the pole -- shows the far-side fit continuing the near-side fit
// through k* with no kink.
function SlopeContinuityChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 66;
  const padR = 24;
  const padT = 26;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kMin = 20.98;
  const kMax = 21.62;
  const allY = [
    ...IMP34406_EFLOW_ATTR_RUNGS.map((r) => Math.log10(r.eflowAttr)),
    ...IMP34572_FAR_SIDE_RUNGS.map((r) => Math.log10(r.eflowAttr)),
  ];
  const yMin = Math.min(...allY) - 0.03;
  const yMax = Math.max(...allY) + 0.03;

  const xAt = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;

  const nearFitPath = NEAR_FIT_LINE.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(p.k)},${yAt(p.y)}`).join(' ');
  const farFitPath = FAR_FIT_LINE.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(p.k)},${yAt(p.y)}`).join(' ');
  const analyticPath = ANALYTIC_REF_LINE.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(p.k)},${yAt(p.y)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* pole k* */}
      <line x1={xAt(KSTAR)} y1={padT} x2={xAt(KSTAR)} y2={padT + cH} stroke={ED.series2} strokeWidth={1} strokeDasharray="3,3" />
      <text x={xAt(KSTAR) + 4} y={padT + 10} fill={ED.series2} fontSize={9}>
        k* {KSTAR}
      </text>

      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {/* analytic E_flow slope reference, through the pole rung */}
      <path d={analyticPath} fill="none" stroke={ED.series5} strokeWidth={2} />

      {/* near-side (imp-34570) and far-side (imp-34589) power-law fit lines */}
      <path d={nearFitPath} fill="none" stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="6,3" />
      <path d={farFitPath} fill="none" stroke={ED.series1} strokeWidth={1.5} strokeDasharray="6,3" />

      {/* near-side rungs (imp-34406) */}
      {IMP34406_EFLOW_ATTR_RUNGS.map((r) => (
        <circle key={`near-${r.k}`} cx={xAt(r.k)} cy={yAt(Math.log10(r.eflowAttr))} r={3.5} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
      ))}
      {/* far-only new rungs (imp-34572) */}
      {FAR_ONLY_RUNGS.map((r) => (
        <circle key={`far-${r.k}`} cx={xAt(r.k)} cy={yAt(Math.log10(r.eflowAttr))} r={3.5} fill={ED.series1} stroke={ED.paper} strokeWidth={1} />
      ))}

      <text x={padL} y={16} fill={ED.brass} fontSize={10}>
        near fit (p*ln10={M.nearPerKSlope})
      </text>
      <text x={padL + 195} y={16} fill={ED.series1} fontSize={10}>
        far fit ({M.farFit.perKSlope})
      </text>
      <text x={padL + 340} y={16} fill={ED.series5} fontSize={10}>
        analytic E_flow ({M.eflowAnalyticSlopePerK})
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        k (log10 N = k+1)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        fill={ED.inkFaint}
        fontSize={10}
        textAnchor="middle"
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        log10(eflow_attr)
      </text>
    </svg>
  );
}

// Chart 2: per-k slope bracket -- near / far / analytic on a horizontal number line, with
// +/- SE error bars on near and far, showing both fits bracket the analytic slope and the
// near-vs-far gap (~5.1 sigma) is a tiny window-centre drift, not a discontinuity.
function SlopeBracketChart() {
  const svgW = 680;
  const svgH = 150;
  const padL = 40;
  const padR = 40;
  const padT = 18;
  const padB = 34;
  const cW = svgW - padL - padR;

  const rows = [
    { label: 'near (imp-34570)', slope: M.nearPerKSlope, se: M.nearPerKSlopeSE, color: ED.brass, y: 40 },
    { label: 'far (imp-34589)', slope: M.farFit.perKSlope, se: M.farFit.perKSlopeSE, color: ED.series1, y: 78 },
    { label: 'analytic E_flow', slope: M.eflowAnalyticSlopePerK, se: 0, color: ED.series5, y: 116 },
  ];

  const xMin = -2.1665;
  const xMax = -2.1550;
  const xAt = (s) => padL + ((s - xMin) / (xMax - xMin)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + 130} x2={padL + cW} y2={padT + 130} stroke={ED.rule} strokeWidth={1} />
      {rows.map((r) => (
        <g key={r.label}>
          {r.se > 0 && (
            <line x1={xAt(r.slope - r.se)} y1={r.y} x2={xAt(r.slope + r.se)} y2={r.y} stroke={r.color} strokeWidth={2} />
          )}
          <circle cx={xAt(r.slope)} cy={r.y} r={4.5} fill={r.color} stroke={ED.paper} strokeWidth={1} />
          <text x={padL} y={r.y - 8} fill={r.color} fontSize={9.5}>
            {r.label}: {r.slope.toFixed(6)}
            {r.se > 0 ? ` (SE ${r.se.toExponential(2)})` : ' (exact reference)'}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + 148} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        per-k log-slope d ln(eflow_attr) / dk (more negative &rarr;)
      </text>
    </svg>
  );
}

export default function Imp34621EflowAttrSlopeContinuityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="eflow_attr Slope Continuity Through the Pole k* (imp-34621 / imp-34589)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34570 fit the near-side eflow_attr bracket (k = 21.00..21.50) to a power law with
        per-k slope {M.nearPerKSlope}. imp-34589 fit the imp-34572 far-side ladder
        (k = 21.30..21.60, all above the pole k* = {KSTAR}) to the same power law and found its
        per-k slope {M.farFit.perKSlope} matches the near side to {M.farMinusNearSlopePct}%
        (diff {M.farMinusNearSlope}, ~{M.farMinusNearSigma} sigma) -- both fits bracket the
        analytic E_flow slope {M.eflowAnalyticSlopePerK}, and the gap is a smooth window-centre
        drift, not a kink. No viz existed for this fit pair.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        log10(eflow_attr) vs k: near-side (imp-34406/34570) and far-side (imp-34572/34589) rungs
        and fits, plus the analytic E_flow slope through the pole
      </p>
      <SlopeContinuityChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        per-k slope bracket: near and far fits straddle the analytic E_flow asymptote
      </p>
      <SlopeBracketChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>near-side per-k slope (imp-34570, 8 rungs)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.nearPerKSlope}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>far-side per-k slope (imp-34589, 7 rungs)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.farFit.perKSlope}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>analytic E_flow per-k slope</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.eflowAnalyticSlopePerK}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>far - near difference (% / sigma)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {M.farMinusNearSlope} ({M.farMinusNearSlopePct}%, ~{M.farMinusNearSigma}&sigma;)
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>far-side fit quality</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              R&sup2; = {M.farFit.R2}, RMS log-resid {M.farFit.rmsLogResid}
            </td>
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
        imp-34570/imp-34572/imp-34589 fit literals verbatim (rungs, power-law amplitude/exponent,
        per-k slopes and SEs, analytic E_flow slope). The near/far difference is resolved at
        ~5.1 combined-sigma but is fully explained by the two overlapping OLS windows having
        different centres (near k~21.25, far k~21.45); it is a smooth monotone drift toward the
        analytic slope, not a jump or kink at k*. eflow_attr is an inherited surrogate numerator,
        NOT a rigorous asymptotic; the component model is the inherited imp-3220/imp-3406
        extrapolation; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0
        untouched; changes no bound; no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
