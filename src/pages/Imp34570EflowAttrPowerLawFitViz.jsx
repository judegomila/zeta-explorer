import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34406_EFLOW_ATTR_RUNGS } from '../data/imp-34406-eflow-attr-smooth-nonzero-across-pole.js';
import {
  IMP34570_POWER_LAW_EXPONENT,
  IMP34570_POWER_LAW_AMPLITUDE,
  IMP34570_FIT_R2,
  IMP34570_FIT_RMS_LOG_RESID,
  IMP34570_FIT_MAX_LOG_RESID,
  IMP34570_FIT_PER_K_SLOPE,
  IMP34570_EFLOW_ANALYTIC_SLOPE_PER_K,
  IMP34570_IMP34406_LOCAL_SLOPE,
  IMP34570_SLOPE_RESIDUAL,
  IMP34570_SLOPE_RESIDUAL_PCT,
} from '../data/imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js';
import { ED } from '../styles/tokens.js';

// N = 10^(k+1) is the decade-top the fit was taken at (verbatim imp-34570 machinery).
const POINTS = IMP34406_EFLOW_ATTR_RUNGS.map((r) => {
  const logN = r.k + 1;
  const lnN = logN * Math.LN10;
  const lnPredicted = Math.log(IMP34570_POWER_LAW_AMPLITUDE) + IMP34570_POWER_LAW_EXPONENT * lnN;
  const lnResid = Math.log(r.eflowAttr) - lnPredicted;
  return {
    k: r.k,
    logN,
    logEflowAttr: Math.log10(r.eflowAttr),
    logPredicted: lnPredicted / Math.LN10,
    lnResid,
  };
});

function LogLogFitChart() {
  const svgW = 720;
  const padL = 60;
  const padR = 32;
  const padT = 20;
  const padB = 40;
  const svgH = 260;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = POINTS.map((p) => p.logN);
  const ys = POINTS.map((p) => p.logEflowAttr);
  const xMin = Math.min(...xs) - 0.02;
  const xMax = Math.max(...xs) + 0.02;
  const yMin = Math.min(...ys) - 0.05;
  const yMax = Math.max(...ys) + 0.05;

  const xS = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const fitLine = [xMin, xMax]
    .map((lxv) => {
      const lyv = (Math.log(IMP34570_POWER_LAW_AMPLITUDE) + IMP34570_POWER_LAW_EXPONENT * lxv * Math.LN10) / Math.LN10;
      return `${xS(lxv)},${yS(lyv)}`;
    })
    .join(' ');

  const xTicks = [xMin, (xMin + xMax) / 2, xMax];
  const yTicks = [yMin, (yMin + yMax) / 2, yMax];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((t, ti) => (
        <g key={'yt' + ti}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((t, ti) => (
        <text key={'xt' + ti} x={xS(t)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {t.toFixed(2)}
        </text>
      ))}

      <polyline points={fitLine} fill="none" stroke={ED.brassDeco} strokeWidth={2} strokeDasharray="5 3" />

      {POINTS.map((p, i) => (
        <circle key={'pt' + i} cx={xS(p.logN)} cy={yS(p.logEflowAttr)} r={4} fill={ED.series1} />
      ))}

      <text x={padL + cW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10(N) -- decade-top N = 10^(k+1)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        log10(eflow_attr)
      </text>

      <rect x={padL + cW - 200} y={padT} width={10} height={10} fill={ED.series1} />
      <text x={padL + cW - 186} y={padT + 9} fill={ED.inkSoft} fontSize={9}>
        8 recovered rungs (imp-34406)
      </text>
      <rect x={padL + cW - 200} y={padT + 14} width={16} height={2} fill={ED.brassDeco} />
      <text x={padL + cW - 180} y={padT + 18} fill={ED.inkSoft} fontSize={9}>
        fit p = {IMP34570_POWER_LAW_EXPONENT.toFixed(6)}, R^2 = {IMP34570_FIT_R2.toFixed(8)}
      </text>
    </svg>
  );
}

function LogResidualChart() {
  const svgW = 720;
  const padL = 60;
  const padR = 32;
  const padT = 20;
  const padB = 40;
  const svgH = 160;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = POINTS.map((p) => p.k);
  const ys = POINTS.map((p) => p.lnResid);
  const xMin = Math.min(...xs) - 0.02;
  const xMax = Math.max(...xs) + 0.02;
  const yAbs = Math.max(...ys.map((y) => Math.abs(y))) * 1.3 || 1e-4;

  const xS = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH - ((v + yAbs) / (2 * yAbs)) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yS(0)} x2={padL + cW} y2={yS(0)} stroke={ED.rule} strokeWidth={1} strokeDasharray="3 3" />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <text x={padL - 6} y={yS(0) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        0
      </text>
      <text x={padL - 6} y={yS(yAbs) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        {yAbs.toExponential(1)}
      </text>
      <text x={padL - 6} y={yS(-yAbs) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        {(-yAbs).toExponential(1)}
      </text>

      {POINTS.map((p, i) => (
        <g key={'res' + i}>
          <line x1={xS(p.k)} y1={yS(0)} x2={xS(p.k)} y2={yS(p.lnResid)} stroke={ED.series5} strokeWidth={1.5} />
          <circle cx={xS(p.k)} cy={yS(p.lnResid)} r={3.5} fill={ED.series5} />
        </g>
      ))}

      {xs.map((k, i) => (
        <text key={'xk' + i} x={xS(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {k.toFixed(2)}
        </text>
      ))}

      <text x={padL + cW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        k -- log-residual ln(eflow_attr) - ln(fit), max |resid| = {IMP34570_FIT_MAX_LOG_RESID.toExponential(2)}
      </text>
    </svg>
  );
}

export default function Imp34570EflowAttrPowerLawFitViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="eflow_attr(k) Power-Law Fit in N = 10^(k+1) (imp-34570)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34570 fit the imp-34406 eflow_attr(k) bracket (8 rungs, k = 21.0 .. 21.5) to a power
        law eflow_attr = A &middot; N^p in the decade-top N = 10^(k+1). The fit is essentially
        exact -- p = {IMP34570_POWER_LAW_EXPONENT.toFixed(6)} per ln N,
        R^2 = {IMP34570_FIT_R2.toFixed(8)} (1 - R^2 = {(1 - IMP34570_FIT_R2).toExponential(2)}),
        RMS log-residual {IMP34570_FIT_RMS_LOG_RESID.toExponential(2)} -- and its implied per-k
        log-slope reproduces the imp-34406 finite local slope at the pole k*, which in turn is the
        analytic E_flow log-slope up to a sub-0.15% curvature term.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        log-log fit: eflow_attr vs decade-top N = 10^(k+1)
      </p>
      <LogLogFitChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        log-residuals across the 8 rungs (no curvature term needed)
      </p>
      <LogResidualChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>slope (per k = per log10 N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>value</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>power-law fit, p &middot; ln 10</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {IMP34570_FIT_PER_K_SLOPE.toFixed(6)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>imp-34406 finite local slope at k*</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {IMP34570_IMP34406_LOCAL_SLOPE.toFixed(3)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>analytic E_flow log-slope</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {IMP34570_EFLOW_ANALYTIC_SLOPE_PER_K.toFixed(6)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>residual (local - analytic)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: 'var(--series-2)' }}>
              +{IMP34570_SLOPE_RESIDUAL.toFixed(6)} ({IMP34570_SLOPE_RESIDUAL_PCT.toFixed(3)}%)
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement only -- an OLS
        power-law fit and analytic-slope cross-check of the inherited surrogate numerator
        eflow_attr, reusing the imp-34406 baked rungs and the verbatim imp-34169 parts()
        machinery. Descriptive surrogate, NOT a rigorous asymptotic; the component model is the
        inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is
        UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a &ge; 0
        untouched. No RH verdict, NO QED.
      </div>
    </div>
  );
}
