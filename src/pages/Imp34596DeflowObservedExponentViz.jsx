import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34448_DEFLOW_DECAY_EXPONENT } from '../data/imp-34448-deflow-decay-exponent.js';
import { IMP34571_DEFLOW_EXPONENT_VS_ANALYTIC_SLOPE } from '../data/imp-34571-deflow-exponent-vs-analytic-slope.js';
import { ED } from '../styles/tokens.js';

const OBSERVED_RUNGS = IMP34448_DEFLOW_DECAY_EXPONENT.localExponentSample;
const M = IMP34571_DEFLOW_EXPONENT_VS_ANALYTIC_SLOPE;

// Local exponent p(N) climbing toward the observed-only pInf, plotted against kMid = log10(N),
// with the analytic E_flow log-slope target 1 shown alongside to make the ~7.3e-4 residual visible.
function ObservedExponentChart() {
  const svgW = 680;
  const svgH = 240;
  const padL = 60;
  const padR = 24;
  const padT = 30;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = OBSERVED_RUNGS.map((q) => q.kMid);
  const ys = OBSERVED_RUNGS.map((q) => q.p);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys) - 0.004;
  const yMax = Math.max(M.analyticEflowSlopeMagnitude, M.observedPInf) + 0.003;
  const xAt = (x) => padL + ((x - xMin) / (xMax - xMin)) * cW;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;

  const path = OBSERVED_RUNGS.map((q, i) => `${i === 0 ? 'M' : 'L'}${xAt(q.kMid)},${yAt(q.p)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* analytic E_flow log-slope target = 1 */}
      <line
        x1={padL}
        y1={yAt(M.analyticEflowSlopeMagnitude)}
        x2={padL + cW}
        y2={yAt(M.analyticEflowSlopeMagnitude)}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="4,3"
      />
      <text x={padL + 4} y={yAt(M.analyticEflowSlopeMagnitude) - 6} textAnchor="start" fill={ED.series2} fontSize={9.5}>
        analytic E_flow slope magnitude = {M.analyticEflowSlopeMagnitude.toFixed(3)}
      </text>

      {/* observed-only refit asymptote pInf ~ 1.0007 */}
      <line
        x1={padL}
        y1={yAt(M.observedPInf)}
        x2={padL + cW}
        y2={yAt(M.observedPInf)}
        stroke={ED.series1}
        strokeWidth={1}
        strokeDasharray="4,3"
      />
      <text x={padL + cW - 4} y={yAt(M.observedPInf) + 12} textAnchor="end" fill={ED.series1} fontSize={9.5}>
        observed-only pInf &asymp; {M.observedPInf.toFixed(4)}
      </text>

      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={path} fill="none" stroke={ED.series3} strokeWidth={2} />
      {OBSERVED_RUNGS.map((q) => (
        <g key={q.kMid}>
          <circle cx={xAt(q.kMid)} cy={yAt(q.p)} r={4} fill={ED.series3} stroke={ED.paper} strokeWidth={1} />
          <text x={xAt(q.kMid)} y={yAt(q.p) - 10} textAnchor="middle" fill={ED.ink} fontSize={8.5}>
            {q.p.toFixed(4)}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        kMid = log10(N), directly-observed rungs only
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90, 16, ${padT + cH / 2})`}
      >
        p(N)
      </text>
    </svg>
  );
}

export default function Imp34596DeflowObservedExponentViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Observed-Only Deflow Decay Exponent vs the Analytic E_flow Slope (imp-34596 / imp-34571)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34571 refit the imp-34448 local decay exponent p(N) = pInf - c/log(N) using ONLY the
        directly-observed rungs (kMid {OBSERVED_RUNGS[0].kMid}..{OBSERVED_RUNGS[OBSERVED_RUNGS.length - 1].kMid},
        all strictly below the crossing kEnd*&nbsp;&asymp;&nbsp;{M.crossingKend} and the fp floor
        kEnd&nbsp;&asymp;&nbsp;{M.fpFloorKend}). The local exponent climbs toward an observed-only
        asymptote pInf&nbsp;&asymp;&nbsp;{M.observedPInf.toFixed(4)}, within
        {' '}{M.residualVsAnalytic.toExponential(1)} of the analytic E_flow log-slope magnitude
        {' '}{M.analyticEflowSlopeMagnitude}. No viz existed for this observed-only refit.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        local decay exponent p(N), directly-observed window only (kMid {OBSERVED_RUNGS[0].kMid}..
        {OBSERVED_RUNGS[OBSERVED_RUNGS.length - 1].kMid})
      </p>
      <ObservedExponentChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>quantity</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>value</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>observed-only pInf</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.observedPInf.toFixed(6)}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>observed-only c (1/log(N) coefficient)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.observedC}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>analytic E_flow slope magnitude</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.analyticEflowSlopeMagnitude}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>residual vs analytic target</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {M.residualVsAnalytic.toExponential(3)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>imp-34448 full-window pInf (cross-check)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.fullWindowPInf}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>residual vs full-window pInf</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {M.residualVsFullWindow.toExponential(3)}
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
        imp-34448 directly-observed local exponent samples and the imp-34571 observed-only OLS
        refit verbatim. The residual of {M.residualVsAnalytic.toExponential(1)} against the analytic
        E_flow log-slope magnitude is the same order as the 1/log(N) finite-rung correction
        ({M.finiteRungCorrectionScale}) at the deepest observed rung, so the approach to
        pInf&nbsp;&asymp;&nbsp;1 is CONSISTENT with, not identical to, the analytic target. Surrogate
        finite-difference fit within the inherited imp-3220/imp-3406 component model, NOT a rigorous
        asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; establishes no
        operator positivity; imp-3066 K_a &ge; 0 untouched; no RH verdict, NO QED.
      </div>
    </div>
  );
}
