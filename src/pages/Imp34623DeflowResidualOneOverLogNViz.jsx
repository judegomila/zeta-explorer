import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34590_DEFLOW_RESIDUAL_ONEOVERLOGN_SCALING } from '../data/imp-34590-deflow-residual-oneoverlogn-scaling.js';
import { ED, alpha } from '../styles/tokens.js';

const M = IMP34590_DEFLOW_RESIDUAL_ONEOVERLOGN_SCALING;
const ROWS = M.residualTable;

// Both per-rung residuals (devAnalytic, devFullWindow) vs u = 1/log(N), each with its OLS
// line dev = a + c*u extended to u=0, and a shaded +/-SE band around 0 showing both fit
// intercepts landing inside it (finite-rung correction, not a floor).
function ResidualChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 62;
  const padR = 24;
  const padT = 26;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const us = ROWS.map((r) => r.invLogN);
  const xMin = 0;
  const xMax = Math.max(...us) * 1.08;
  const allY = [...ROWS.map((r) => r.devAnalytic), ...ROWS.map((r) => r.devFullWindow), 0];
  const yMin = Math.min(...allY) - 0.006;
  const yMax = Math.max(...allY) + 0.006;

  const xAt = (u) => padL + ((u - xMin) / (xMax - xMin)) * cW;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;

  const fitLine = (intercept, slope) =>
    `M${xAt(xMin)},${yAt(intercept + slope * xMin)} L${xAt(xMax)},${yAt(intercept + slope * xMax)}`;

  const analyticFit = fitLine(M.fitAnalyticIntercept, M.fitAnalyticSlopeC);
  const fullWindowFit = fitLine(M.fitFullWindowIntercept, M.fitFullWindowSlopeC);

  const seBandTop = yAt(M.fitAnalyticInterceptSE);
  const seBandBottom = yAt(-M.fitAnalyticInterceptSE);

  const analyticPath = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xAt(r.invLogN)},${yAt(r.devAnalytic)}`).join(' ');
  const fullWindowPath = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xAt(r.invLogN)},${yAt(r.devFullWindow)}`).join(
    ' '
  );

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* +/-1 intercept-SE band around zero (both fits share the same SE) */}
      <rect
        x={padL}
        y={seBandTop}
        width={cW}
        height={seBandBottom - seBandTop}
        fill={alpha(ED.inkSoft, 0.1)}
      />
      <text x={padL + cW - 4} y={seBandTop - 4} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        +/-1 SE band ({M.fitAnalyticInterceptSE.toExponential(2)})
      </text>

      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke={ED.rule} strokeWidth={1} strokeDasharray="2,3" />

      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {/* OLS fit lines, extended to u=0 to show the extrapolated intercept */}
      <path d={analyticFit} fill="none" stroke={ED.series2} strokeWidth={1.5} strokeDasharray="5,3" />
      <path d={fullWindowFit} fill="none" stroke={ED.series1} strokeWidth={1.5} strokeDasharray="5,3" />

      {/* measured per-rung residuals */}
      <path d={analyticPath} fill="none" stroke={ED.brassDeco} strokeWidth={2} />
      <path d={fullWindowPath} fill="none" stroke={ED.series5} strokeWidth={2} />
      {ROWS.map((r) => (
        <circle key={`a-${r.kMid}`} cx={xAt(r.invLogN)} cy={yAt(r.devAnalytic)} r={3.5} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
      ))}
      {ROWS.map((r) => (
        <circle key={`f-${r.kMid}`} cx={xAt(r.invLogN)} cy={yAt(r.devFullWindow)} r={3.5} fill={ED.series5} stroke={ED.paper} strokeWidth={1} />
      ))}

      {/* extrapolated intercepts at u=0 */}
      <circle cx={xAt(0)} cy={yAt(M.fitAnalyticIntercept)} r={4} fill="none" stroke={ED.series2} strokeWidth={1.5} />
      <circle cx={xAt(0)} cy={yAt(M.fitFullWindowIntercept)} r={4} fill="none" stroke={ED.series1} strokeWidth={1.5} />

      <text x={padL} y={16} fill={ED.brass} fontSize={10}>
        devAnalytic (1 - p(N))
      </text>
      <text x={padL + 175} y={16} fill={ED.series5} fontSize={10}>
        devFullWindow (pInf_fw - p(N))
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        u = 1/log(N) (0 = N -&gt; infinity, extrapolated at left edge)
      </text>
    </svg>
  );
}

export default function Imp34623DeflowResidualOneOverLogNViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Deflow Finite-Rung Residuals vs 1/log(N) (imp-34623 / imp-34590)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34590 fit the two imp-34571 residuals of the observed-only deflow local exponent
        p(N) &mdash; devAnalytic = 1 - p(N) and devFullWindow = pInf_fw - p(N) &mdash; against
        u = 1/log(N) across the six imp-34448 directly-observed rungs (kMid 16.125..19.875). Both
        fit cleanly (R&sup2; &asymp; {M.fitAnalyticR2}) with slope c &asymp; {M.fitAnalyticSlopeC},
        and their N-&gt;infinity intercepts ({M.fitAnalyticIntercept.toExponential(2)} and{' '}
        {M.fitFullWindowIntercept.toExponential(2)}) sit within one OLS intercept standard error (
        {M.fitAnalyticInterceptSE.toExponential(2)}) of zero &mdash; the observed gap is a
        finite-rung correction, not a floor. No viz existed for this fit.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        per-rung residuals vs 1/log(N): both OLS lines extend to a u=0 intercept inside the +/-SE
        band of zero
      </p>
      <ResidualChart />

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '1.5rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>kMid</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>1/log(N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>devAnalytic</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>devFullWindow</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.kMid} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.kMid}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.invLogN}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.devAnalytic}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.devFullWindow}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '1rem' }}>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>fitted slope c (both fits)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.fitAnalyticSlopeC}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>extrapolated |a| vs analytic slope 1 (= imp-34571 residualVsAnalytic)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {M.extrapResidualVsAnalytic.toExponential(3)} ({M.analyticInterceptSEUnits} SE)
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>extrapolated |a| vs full-window pInf (= imp-34571 residualVsFullWindow)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {M.extrapResidualVsFullWindow.toExponential(3)} ({M.fullWindowInterceptSEUnits} SE)
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>OLS intercept standard error</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.fitAnalyticInterceptSE.toExponential(3)}</td>
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
        imp-34590 OLS fit literals verbatim (slope, intercept, intercept SE, R&sup2;, per-rung
        residual table). Both intercepts landing within one SE of zero is the imp-34590 finding
        that the observed pInf gap to the analytic E_flow slope is a finite-rung 1/log(N)
        correction, NOT a floor &mdash; consistent with imp-34584 that the residual is not
        resolvable to next order from these six rungs. The inherited imp-3220/imp-3406 component
        model is NOT a rigorous asymptotic; changes no bound; establishes no operator positivity;
        C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
