import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97508_CURVE,
  IMP97508_ASYMPTOTE,
  IMP97508_WINDOW_TOP,
  IMP97508_BLIP,
} from '../data/imp-97508-mcm-baseterm-extprec-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97508: visualizes the imp-97478 extended-precision (40 dps) level-1
// MCM base term c(x)=h(x)-h(2x) against its closed-form two-term law, and
// the scaled c*x/ln x drifting down toward K0=1/24, with the corrected
// window-top point and the refuted x=5e5 "blip" annotated.

const COLOR_CURVE = ED.series1;
const COLOR_ASYMPTOTE = ED.series2;
const COLOR_WINDOWTOP = ED.series3;
const COLOR_BLIP = ED.series4;

function LogLogPanel() {
  const svgW = 720;
  const svgH = 340;
  const padL = 66;
  const padR = 20;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logX = (x) => Math.log10(x);
  const logC = (c) => Math.log10(c);

  const xVals = IMP97508_CURVE.map((pt) => logX(pt.x));
  const cVals = IMP97508_CURVE.map((pt) => logC(pt.c));
  const xMin = Math.min(...xVals);
  const xMax = Math.max(...xVals);
  const yMin = Math.min(...cVals) - 0.2;
  const yMax = Math.max(...cVals) + 0.2;

  const xOf = (x) => padL + ((logX(x) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (c) => padT + plotH - ((logC(c) - yMin) / (yMax - yMin)) * plotH;

  const windowTopPt = IMP97508_CURVE.find((pt) => pt.x === IMP97508_WINDOW_TOP.x);
  const blipPt = IMP97508_CURVE.find((pt) => pt.x === IMP97508_BLIP.x);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* closed-form two-term prediction (dashed, near-identical to c(x)) */}
      <polyline
        points={IMP97508_CURVE.map((pt) => `${xOf(pt.x)},${yOf(pt.pred)}`).join(' ')}
        fill="none"
        stroke={COLOR_ASYMPTOTE}
        strokeWidth={1}
        strokeDasharray="5,4"
      />

      {/* exact extended-precision c(x) */}
      <polyline
        points={IMP97508_CURVE.map((pt) => `${xOf(pt.x)},${yOf(pt.c)}`).join(' ')}
        fill="none"
        stroke={COLOR_CURVE}
        strokeWidth={1.8}
      />

      {/* window-top point (corrected) */}
      {windowTopPt && (
        <>
          <circle cx={xOf(windowTopPt.x)} cy={yOf(windowTopPt.c)} r={5} fill={COLOR_WINDOWTOP} stroke={ED.paper} strokeWidth={1} />
          <text x={xOf(windowTopPt.x) + 8} y={yOf(windowTopPt.c) - 6} fill={COLOR_WINDOWTOP} fontSize={9}>
            window top x=457015: c=1.397144e-6 (corrected, was 1.431333e-6)
          </text>
        </>
      )}

      {/* refuted blip region */}
      {blipPt && (
        <>
          <circle cx={xOf(blipPt.x)} cy={yOf(blipPt.c)} r={5} fill={COLOR_BLIP} stroke={ED.paper} strokeWidth={1} />
          <text x={xOf(blipPt.x) - 8} y={yOf(blipPt.c) + 16} textAnchor="end" fill={COLOR_BLIP} fontSize={9}>
            x=5e5: c=1.284522e-6 (no rise -- double-precision blip to 1.449e-6 refuted)
          </text>
        </>
      )}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[5000, 50000, 500000, 2000000].map((x) => (
        <text key={`xt${x}`} x={xOf(x)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {x.toExponential(0)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        x (log scale) &mdash; c(x) = h(x) - h(2x), solid; two-term law (1/24)(ln x)/x + M0/x, dashed
      </text>
    </svg>
  );
}

function ScaledPanel() {
  const svgW = 720;
  const svgH = 260;
  const padL = 66;
  const padR = 20;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logX = (x) => Math.log10(x);
  const xVals = IMP97508_CURVE.map((pt) => logX(pt.x));
  const xMin = Math.min(...xVals);
  const xMax = Math.max(...xVals);
  const scaledVals = IMP97508_CURVE.map((pt) => pt.scaled);
  const yMax = Math.max(...scaledVals) + 0.002;
  const yMin = IMP97508_ASYMPTOTE.K0 - 0.002;

  const xOf = (x) => padL + ((logX(x) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* K0 = 1/24 asymptote */}
      <line
        x1={padL}
        y1={yOf(IMP97508_ASYMPTOTE.K0)}
        x2={padL + plotW}
        y2={yOf(IMP97508_ASYMPTOTE.K0)}
        stroke={COLOR_ASYMPTOTE}
        strokeWidth={1.4}
        strokeDasharray="5,4"
      />
      <text x={padL + plotW - 4} y={yOf(IMP97508_ASYMPTOTE.K0) - 5} textAnchor="end" fill={COLOR_ASYMPTOTE} fontSize={9}>
        K0 = 1/24 = 0.041667
      </text>

      <polyline
        points={IMP97508_CURVE.map((pt) => `${xOf(pt.x)},${yOf(pt.scaled)}`).join(' ')}
        fill="none"
        stroke={COLOR_CURVE}
        strokeWidth={1.8}
      />

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[5000, 50000, 500000, 2000000].map((x) => (
        <text key={`sxt${x}`} x={xOf(x)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {x.toExponential(0)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        x (log scale) &mdash; scaled c(x)*x/ln x = K0 + M0/ln x, drifting down toward K0
      </text>
    </svg>
  );
}

export default function Imp97508McmBasetermExtprecViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97478: MCM Level-1 Base Term c(x)=h(x)-h(2x), Extended Precision" />

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
        point below is the imp-97478 baked extended-precision (40 dps)
        ladder evaluated verbatim. Measurement only &mdash; no operator
        positivity, no bound moves; MCM stays VERIFIED not proved (and
        FALSE from omega=11 per imp-97432); kappa_arith unchanged;
        Platt-Trudgian Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97463 fit the level-1 MCM base term c(x) = h(x) - h(2x) to the
        two-term law (1/24)(ln x)/x + M0/x in double precision, but flagged
        catastrophic-cancellation degradation past x ~ 2e5 and an unverified
        non-monotone "blip" at x = 5e5. imp-97478 re-evaluates the same
        kernel with an extended-precision (mpmath, 40 digit) remainder,
        confirming the blip is a floating-point artifact and c(x) stays
        strictly positive and monotone decreasing to 0 from above through
        x = 2e6, matching the closed form to a max relative deviation of
        1.08e-10.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        c(x) vs the closed-form two-term law (log-log), with the corrected window-top point and refuted blip
      </h3>
      <LogLogPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        scaled c(x)*x/ln x approaching K0 = 1/24
      </h3>
      <ScaledPanel />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem', maxWidth: 700 }}>
        The scaled quantity c(x)*x/ln x = K0 + M0/ln x drifts monotonically
        down toward K0 = 1/24 = 0.041667 from above (0.04825 at x = 2e6),
        consistent with the sub-leading M0/ln x term vanishing slowly. The
        base term stays roughly four orders of magnitude below the
        induction top term T(b) in [1.34e-2, 2.02e-2] throughout.
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
        only, consuming the imp-97478 baked extended-precision ladder
        verbatim. Establishes no operator positivity; changes no bound;
        kappa_arith unchanged; Platt-Trudgian Lambda&le;0.2 remains SOTA;
        RH open; NO QED.
      </div>
    </div>
  );
}
