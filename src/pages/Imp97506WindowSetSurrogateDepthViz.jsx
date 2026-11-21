import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97506_CURVE,
  IMP97506_CEILING_LINE,
} from '../data/imp-97506-window-set-surrogate-depth-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97506: visualizes the imp-97481 RESULT 3 window-set surrogate limit
// -c e^{-gamma}/Prod_{p<P0}(1-1/p) vs min-prime P0 -- the primorial (P0=2)
// is the SHALLOWEST window, not the extremizer imp-97432/97461 assumed,
// and the limit sinks unboundedly below -1/4-R(1) as P0 grows.

const COLOR_CURVE = ED.series1;
const COLOR_CEILING = ED.series2;
const COLOR_PRIMORIAL = ED.series3;

function DepthPanel() {
  const svgW = 720;
  const svgH = 340;
  const padL = 66;
  const padR = 20;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const p0Min = 0;
  const p0Max = 400;
  const yMax = 0.02;
  const yMin = Math.min(...IMP97506_CURVE.map((pt) => pt.limit)) - 0.03;

  const xOf = (p0) => padL + ((p0 - p0Min) / (p0Max - p0Min)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const primorial = IMP97506_CURVE.find((pt) => pt.P0 === 2);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* -1/4 lower-edge ceiling line */}
      <line
        x1={padL}
        y1={yOf(IMP97506_CEILING_LINE.lowerEdge)}
        x2={padL + plotW}
        y2={yOf(IMP97506_CEILING_LINE.lowerEdge)}
        stroke={COLOR_CEILING}
        strokeWidth={1.4}
        strokeDasharray="5,4"
      />
      <text x={padL + plotW - 4} y={yOf(IMP97506_CEILING_LINE.lowerEdge) - 5} textAnchor="end" fill={COLOR_CEILING} fontSize={9}>
        b/4-ceiling lower edge T(b) &ge; -1/4
      </text>

      {/* surrogate-limit curve */}
      <polyline
        points={IMP97506_CURVE.map((pt) => `${xOf(pt.P0)},${yOf(pt.limit)}`).join(' ')}
        fill="none"
        stroke={COLOR_CURVE}
        strokeWidth={1.8}
      />

      {/* primorial (P0=2), the shallowest point -- NOT the extremizer */}
      <circle cx={xOf(primorial.P0)} cy={yOf(primorial.limit)} r={5} fill={COLOR_PRIMORIAL} stroke={ED.paper} strokeWidth={1} />
      <text x={xOf(primorial.P0) + 8} y={yOf(primorial.limit) - 6} fill={COLOR_PRIMORIAL} fontSize={9}>
        primorial P0=2: -0.046788 (shallowest, not extremal)
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[0, 101, 200, 300, 379].map((p0) => (
        <text key={`xp${p0}`} x={xOf(p0)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {p0}
        </text>
      ))}
      {[0, -0.25, -0.388874, -0.4975].map((v) => (
        <text key={`yv${v}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
          {v.toFixed(3)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        min-prime P0 &mdash; window-set surrogate limit -c e<tspan baselineShift="super" fontSize={7}>-&gamma;</tspan>/Prod<tspan baselineShift="sub" fontSize={7}>p&lt;P0</tspan>(1-1/p)
      </text>
    </svg>
  );
}

export default function Imp97506WindowSetSurrogateDepthViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97481: Window-Set Surrogate Depth vs Min-Prime P0" />

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
        point below is the imp-97481 exact Mertens window limit evaluated
        verbatim. Measurement only &mdash; no operator positivity, no bound
        moves; the b/4-ceiling was exploratory Route-M, load-bearing for
        nothing; kappa_arith unchanged; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97461 assumed the primorial family (P0=2) is the two-sided
        extremizer of the T(b) surrogate, with lower-edge infimum
        -e<sup>-&gamma;</sup>/12 = -0.046788, safely above -1/4. imp-97481
        derives the EXACT window-set limit lim<sub>Y</sub> surrogate([P0,Y])
        = -c e<sup>-&gamma;</sup>/Prod<sub>p&lt;P0</sub>(1-1/p) and shows it
        sinks unboundedly as P0 grows: -0.388874 at P0=101 and -0.497500 at
        P0=379, both already past the -1/4-R(1) = -0.251246 threshold. The
        primorial is the SHALLOWEST window, not the extremal one.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        window-set surrogate limit vs min-prime P0: unbounded descent past the b/4-ceiling lower edge
      </h3>
      <DepthPanel />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem', maxWidth: 700 }}>
        Because the limit is a genuine limit (Mertens 2nd + 3rd), crossing
        below -1/4-R(1) at some P0 forces a FINITE Y where the window
        b = Prod<sub>P0&le;p&le;Y</sub> p already satisfies T(b) &lt; -1/4,
        i.e. |E1(b)| &gt; b/4 &mdash; refuting the b/4-ceiling lower edge for
        general squarefree b. The crossing b is astronomically large, but it
        exists.
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
        only, consuming the imp-97481 exact closed form verbatim.
        Establishes no operator positivity; changes no bound; kappa_arith
        unchanged; RH open; NO
        QED.
      </div>
    </div>
  );
}
