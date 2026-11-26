import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97528_DRIFT_LADDER,
  IMP97528_SPLIT_POINT_CONVERGENCE,
  IMP97528_TAIL_CONVERGED_OPTIMUM,
  IMP97528_CSHARP_UPPER_BRACKET,
} from '../data/imp-97528-krein-tail-converged-drift-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97528: visualizes the imp-97497 tail-convergence of the imp-97483
// well-capture scalar optimum -- the truncation drift tot(T) rising toward
// the tail-converged limit tot(inf)=7.53, and the exact/tail split-point
// self-consistency across T0=600/800/1000.

const COLOR_DRIFT = ED.series1;
const COLOR_LIMIT = ED.series3;
const COLOR_EXACT = ED.series5;
const COLOR_TAIL = ED.series4;

function DriftLadderPanel() {
  const svgW = 640;
  const svgH = 280;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const tMin = 0;
  const tMax = 900;
  const vMin = 6.4;
  const vMax = 7.65;

  const xOf = (T) => padL + ((T - tMin) / (tMax - tMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - vMin) / (vMax - vMin)) * plotH;

  const limit = IMP97528_TAIL_CONVERGED_OPTIMUM.totInf;
  const points = IMP97528_DRIFT_LADDER.map((p) => `${xOf(p.T)},${yOf(p.tot)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yOf(limit)} x2={padL + plotW} y2={yOf(limit)} stroke={COLOR_LIMIT} strokeWidth={1.5} strokeDasharray="5 4" />
      <text x={padL + plotW - 4} y={yOf(limit) - 6} textAnchor="end" fill={COLOR_LIMIT} fontSize={10}>
        tot(inf) = {limit}
      </text>

      <polyline points={points} fill="none" stroke={COLOR_DRIFT} strokeWidth={2} />
      {IMP97528_DRIFT_LADDER.map((p) => (
        <React.Fragment key={`pt${p.T}`}>
          <circle cx={xOf(p.T)} cy={yOf(p.tot)} r={4} fill={COLOR_DRIFT} stroke={ED.paper} strokeWidth={1} />
          <text x={xOf(p.T)} y={yOf(p.tot) - 10} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
            {p.tot}
          </text>
        </React.Fragment>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[0, 200, 400, 600, 800].map((t) => (
        <text key={`xt${t}`} x={xOf(t)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {t}
        </text>
      ))}
      {[6.5, 6.8, 7.0, 7.2, 7.4, 7.6].map((v) => (
        <text key={`yv${v}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        truncation window T &mdash; measured total int sigma_2 |psi|^2 vs the tail-converged limit
      </text>
    </svg>
  );
}

function SplitPointPanel() {
  const svgW = 480;
  const svgH = 260;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const barW = 70;

  const vMax = 7.6;
  const yOf = (v) => padT + plotH - (v / vMax) * plotH;
  const rows = IMP97528_SPLIT_POINT_CONVERGENCE;
  const slot = plotW / rows.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => {
        const cx = padL + slot * (i + 0.5);
        const x = cx - barW / 2;
        const yExactTop = yOf(r.exact);
        const yTotTop = yOf(r.exact + r.tail);
        return (
          <React.Fragment key={`bar${r.T0}`}>
            <rect x={x} y={yExactTop} width={barW} height={padT + plotH - yExactTop} fill={COLOR_EXACT} />
            <rect x={x} y={yTotTop} width={barW} height={yExactTop - yTotTop} fill={COLOR_TAIL} />
            <text x={cx} y={yTotTop - 6} textAnchor="middle" fill={ED.ink} fontSize={10}>
              {r.totInf}
            </text>
            <text x={cx} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              T0={r.T0}
            </text>
          </React.Fragment>
        );
      })}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[0, 2, 4, 6, 7.5].map((v) => (
        <text key={`yv${v}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        split point T0 &mdash;{' '}
        <tspan fill={COLOR_EXACT}>exact core</tspan> +{' '}
        <tspan fill={COLOR_TAIL}>analytic tail</tspan> = fixed total 7.5352
      </text>
    </svg>
  );
}

export default function Imp97528KreinTailConvergedDriftViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97497: Tail-Converging the Well-Capture Drift" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-1) 6%, transparent)',
          borderLeft: '3px solid var(--series-1)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-1)' }}>Honest status:</strong> every
        point below is reused verbatim from imp-97497. Measurement only
        &mdash; no operator positivity, no coercivity constant, no bound
        moves; interval-rigorous reach stays 2a&le;0.96; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-97483 well-capture scalar optimum was measured at a series of
        truncation windows T and drifted upward without an obvious plateau:
        6.56 &rarr; 6.83 &rarr; 6.97 &rarr; 7.22, informally read as
        &ldquo;converging ~7.3&rdquo;. imp-97497 resolves the slow ln(t)/t^2
        far tail analytically and tail-converges the drift to
        tot(inf) = {IMP97528_TAIL_CONVERGED_OPTIMUM.totInf} &plusmn;{' '}
        {IMP97528_TAIL_CONVERGED_OPTIMUM.errorBar}, correcting the informal
        estimate upward by ~0.2.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        truncation drift tot(T) vs the tail-converged limit
      </h3>
      <DriftLadderPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        exact/tail split-point self-consistency
      </h3>
      <SplitPointPanel />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem', maxWidth: 700 }}>
        Measured c_sharp upper bracket: {IMP97528_CSHARP_UPPER_BRACKET}
        &mdash; the tail-converged optimum ({IMP97528_TAIL_CONVERGED_OPTIMUM.totInf}
        , at R* &asymp; {IMP97528_TAIL_CONVERGED_OPTIMUM.RstarInf}) is still{' '}
        {IMP97528_TAIL_CONVERGED_OPTIMUM.ratioToCsharp}x above it, sharpening
        the imp-97505 informal ~12x gap. Splitting the integral at
        T0 = 600/800/1000 moves mass between the exact core and the analytic
        tail but leaves the sum fixed at 7.5352 to 2e-6.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation
        only, consuming the imp-97497 tail-converged drift ladder and
        split-point table verbatim. Establishes no operator positivity;
        changes no bound; RH open;
        NO QED.
      </div>
    </div>
  );
}
