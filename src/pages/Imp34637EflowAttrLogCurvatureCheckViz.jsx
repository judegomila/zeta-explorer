import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34612_EFLOW_ATTR_CONVEXITY_VS_ANALYTIC } from '../data/imp-34612-eflow-attr-convexity-vs-analytic-log3-curvature.js';
import { ED, alpha } from '../styles/tokens.js';

const M = IMP34612_EFLOW_ATTR_CONVEXITY_VS_ANALYTIC;
const ROWS = M.logCurvatureNodes;

// Observed vs analytic d2(ln eflow_attr)/dk2 across the 5 far-side nodes, with the residual
// band between the two curves shaded to make the ~7% observed-more-concave gap visible.
function CurvatureChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 68;
  const padR = 24;
  const padT = 26;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const ks = ROWS.map((r) => r.k);
  const xMin = Math.min(...ks);
  const xMax = Math.max(...ks);
  const allY = [...ROWS.map((r) => r.observed), ...ROWS.map((r) => r.analyticTotal)];
  const yMin = Math.min(...allY) - 3e-4;
  const yMax = Math.max(...allY) + 3e-4;

  const xAt = (k) => padL + ((k - xMin) / (xMax - xMin)) * cW;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;

  const observedPath = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xAt(r.k)},${yAt(r.observed)}`).join(' ');
  const analyticPath = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xAt(r.k)},${yAt(r.analyticTotal)}`).join(' ');

  // Residual band: polygon between observed (top edge, forward) and analytic (bottom edge, back).
  const bandForward = ROWS.map((r) => `${xAt(r.k)},${yAt(r.observed)}`).join(' L');
  const bandBack = [...ROWS]
    .reverse()
    .map((r) => `${xAt(r.k)},${yAt(r.analyticTotal)}`)
    .join(' L');
  const bandPath = `M${bandForward} L${bandBack} Z`;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* residual band between observed (more concave) and analytic surrogate curves */}
      <path d={bandPath} fill={alpha(ED.series2, 0.14)} stroke="none" />
      <text x={padL + cW - 4} y={padT + 12} textAnchor="end" fill={ED.series2} fontSize={9}>
        residual band (~{M.meanResidualPct}% more concave)
      </text>

      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={analyticPath} fill="none" stroke={ED.series1} strokeWidth={1.5} strokeDasharray="5,3" />
      <path d={observedPath} fill="none" stroke={ED.brassDeco} strokeWidth={2} />

      {ROWS.map((r) => (
        <circle key={`o-${r.k}`} cx={xAt(r.k)} cy={yAt(r.observed)} r={3.5} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
      ))}
      {ROWS.map((r) => (
        <circle key={`a-${r.k}`} cx={xAt(r.k)} cy={yAt(r.analyticTotal)} r={3.5} fill={ED.series1} stroke={ED.paper} strokeWidth={1} />
      ))}

      <text x={padL} y={16} fill={ED.brass} fontSize={10}>
        observed d2(ln eflow_attr)/dk2
      </text>
      <text x={padL + 205} y={16} fill={ED.series1} fontSize={10}>
        analytic log^3(N)/N surrogate
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        k (decade index, far side of the pole k* = {M.kStar})
      </text>
    </svg>
  );
}

// E_flow -3/u^2 term (~90%) vs |g| = 1-3/u correction (~4%) share of the analytic curvature,
// stacked per node so the dominance split is visible directly.
function ShareChart() {
  const svgW = 680;
  const svgH = 200;
  const padL = 68;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const ks = ROWS.map((r) => r.k);
  const xMin = Math.min(...ks);
  const xMax = Math.max(...ks);
  const mags = ROWS.map((r) => Math.abs(r.analyticTotal));
  const yMax = Math.max(...mags) * 1.15;

  const xAt = (k) => padL + ((k - xMin) / (xMax - xMin)) * cW;
  const yAt = (mag) => padT + cH - (mag / yMax) * cH;

  const barW = (cW / ROWS.length) * 0.5;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {ROWS.map((r) => {
        const eflowMag = Math.abs(r.analyticEflowOnly);
        const gMag = Math.abs(r.analyticGCorrection);
        const x = xAt(r.k) - barW / 2;
        return (
          <g key={`bar-${r.k}`}>
            <rect x={x} y={yAt(eflowMag)} width={barW} height={padT + cH - yAt(eflowMag)} fill={ED.series5} opacity={0.85} />
            <rect
              x={x}
              y={yAt(eflowMag + gMag)}
              width={barW}
              height={yAt(eflowMag) - yAt(eflowMag + gMag)}
              fill={ED.series7}
              opacity={0.85}
            />
          </g>
        );
      })}

      <text x={padL} y={16} fill={ED.series5} fontSize={10}>
        E_flow -3/u^2 term (~{Math.round(M.eflowShareOfAnalytic * 100)}%)
      </text>
      <text x={padL + 230} y={16} fill={ED.series7} fontSize={10}>
        |g|=1-3/u correction (~{Math.round((1 - M.eflowShareOfAnalytic) * 100)}%)
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        k (stacked |analytic curvature| by term)
      </text>
    </svg>
  );
}

export default function Imp34637EflowAttrLogCurvatureCheckViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="eflow_attr Log-Curvature Check: Observed vs Analytic log^3(N)/N (imp-34637 / imp-34612)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34612 compared the observed structure-sensitive log-curvature d&sup2;(ln eflow_attr)/dk&sup2;
        (a central second difference of the reused imp-34586 far-side rungs) to the closed-form
        curvature predicted by the analytic E_flow &sim; log&sup3;(N)/N surrogate, over the five
        nodes k = 21.75 .. 21.95. Both are strictly negative (concave) at every node &mdash; the
        sign is a faithful property of the surrogate &mdash; but the observed curvature is a
        stable ~{M.meanResidualPct}% MORE concave than the analytic prediction, a real residual
        ~{M.residualFloorMargin}x above the rung-precision floor. No viz existed for this
        comparison.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        observed vs analytic d&sup2;(ln eflow_attr)/dk&sup2;, with the residual band shaded
      </p>
      <CurvatureChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        analytic curvature split: E_flow -3/u&sup2; term (&asymp;{M.eflowShareOfAnalytic}) vs |g|
        term correction
      </p>
      <ShareChart />

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '1.5rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>observed</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>analytic</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>residual</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>residual %</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.k} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.k}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.observed}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.analyticTotal}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.residual}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.residualPct}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '1rem' }}>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>mean residual (observed more concave)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.meanResidualPct}%</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>E_flow -3/u&sup2; share of analytic curvature</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.eflowShareOfAnalytic}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>rung-precision curvature floor</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.obsCurvaturePrecisionFloor}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>min |residual| vs floor margin</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.residualFloorMargin}x</td>
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
        imp-34612 closed-form/observed literals verbatim (log-curvature nodes, residual, share,
        floor margin). Both curves being strictly negative at every node confirms the log&sup3;(N)/N
        structure faithfully predicts concavity of ln eflow_attr, E_flow-driven; the stable ~
        {M.meanResidualPct}% residual (well above the rung-precision floor) is the same
        C_F(T0)/Gronwall correction that shifts the eflow_attr log-slope by ~0.3%. Descriptive
        surrogate, NOT a rigorous asymptotic; the component model is the inherited
        imp-3220/imp-3406 extrapolation; C_mb GUE-conditional per imp-486 untouched; changes no
        bound; establishes no operator positivity; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
