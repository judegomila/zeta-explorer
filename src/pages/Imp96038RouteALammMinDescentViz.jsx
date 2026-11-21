import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  ROUTE_A_LAMMIN_DESCENT,
  ROUTE_A_SCALING_REFERENCE,
  routeAReferenceCurveValue,
  ROUTE_A_CAVEAT_BANNER,
} from '../data/imp-96038-route-a-reflection-gram-lammin-descent-viz-data.js';
import { ED } from '../styles/tokens.js';

const DOT_COLOR = ED.series2;
const CURVE_COLOR = ED.series1;

// log-x (p_N) vs |lambda_min| (log-y) descent chart, plus the anchored p_N^0.45 reference curve
function LamMinDescentChart() {
  const svgW = 620;
  const padL = 70;
  const padR = 30;
  const padT = 20;
  const padB = 40;
  const svgH = 300;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const pNs = ROUTE_A_LAMMIN_DESCENT.map((r) => r.pNDisplay);
  const minPN = Math.min(...pNs);
  const maxPN = Math.max(...pNs) * 1.15;
  const mags = ROUTE_A_LAMMIN_DESCENT.map((r) => Math.abs(r.lamMin));
  const minMag = Math.min(...mags) * 0.85;
  const maxMag = Math.max(...mags) * 1.15;

  const xOf = (pN) => padL + ((Math.log(pN) - Math.log(minPN)) / (Math.log(maxPN) - Math.log(minPN))) * plotW;
  const yOf = (mag) => padT + plotH - ((Math.log(mag) - Math.log(minMag)) / (Math.log(maxMag) - Math.log(minMag))) * plotH;

  const linePoints = ROUTE_A_LAMMIN_DESCENT.map((r) => `${xOf(r.pNDisplay)},${yOf(Math.abs(r.lamMin))}`).join(' ');

  const curveSamples = [];
  for (let i = 0; i <= 40; i++) {
    const lp = Math.log(2) + (i / 40) * (Math.log(maxPN) - Math.log(2));
    const pN = Math.exp(lp);
    curveSamples.push(`${xOf(pN)},${yOf(Math.abs(routeAReferenceCurveValue(pN)))}`);
  }

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={curveSamples.join(' ')} fill="none" stroke={CURVE_COLOR} strokeWidth={1.5} strokeDasharray="5,4" />
      <text x={svgW - padR} y={padT + 12} textAnchor="end" fill={CURVE_COLOR} fontSize={11}>
        {`reference: p_N^${ROUTE_A_SCALING_REFERENCE.exponent} (anchored at N=1229)`}
      </text>

      <polyline points={linePoints} fill="none" stroke={DOT_COLOR} strokeWidth={2} />
      {ROUTE_A_LAMMIN_DESCENT.map((r) => (
        <g key={r.N}>
          <circle cx={xOf(r.pNDisplay)} cy={yOf(Math.abs(r.lamMin))} r={4} fill={DOT_COLOR} />
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={svgH - padB} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={svgH - padB} x2={svgW - padR} y2={svgH - padB} stroke={ED.rule} strokeWidth={1.5} />
      <text x={12} y={padT + 4} fill={ED.inkFaint} fontSize={10}>
        |lambda_min| (log)
      </text>
      <text x={svgW - padR} y={svgH - padB + 32} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
        p_N (log)
      </text>
    </svg>
  );
}

export default function Imp96038RouteALammMinDescentViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route A: Finite-N Reflection-Gram lambda_min(N) Descent (imp-96038)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {ROUTE_A_CAVEAT_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The Route A reflection-positivity test builds the Pick reflection Gram of the
        completed N-prime primon gas on a fixed node set and finds it is never PSD:
        lambda_min descends monotonically from -142.669 at N=0 (archimedean factor only)
        to -4213.156 at N=1229 (p_N=9973), tracking the -p_N^(1/2-nu_min) truncation law.
        This panel plots that descent on a log-log axis against a reference curve using
        the predicted exponent 0.45, anchored at the final rung.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        |lambda_min| vs p_N (log-log)
      </h3>
      <LamMinDescentChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>N</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>p_N</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>lambda_min</th>
          </tr>
        </thead>
        <tbody>
          {ROUTE_A_LAMMIN_DESCENT.map((r) => (
            <tr key={r.N} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.N}</td>
              <td style={{ textAlign: 'right' }}>{r.pN ?? '—'}</td>
              <td style={{ textAlign: 'right', color: DOT_COLOR }}>{r.lamMin.toFixed(3)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page rendering the frozen
        Route A lambda_min ladder verbatim (no re-derivation). The measured exponent
        ({ROUTE_A_SCALING_REFERENCE.measuredGlobalExponent}) sits below the predicted
        ({ROUTE_A_SCALING_REFERENCE.exponent}) and approaches it from below as p_N grows
        (tail fit {ROUTE_A_SCALING_REFERENCE.measuredTailExponent}). Supplies no new bound,
        establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
