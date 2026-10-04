import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35028_RUNNING_G_RAMP_VS_SIGMOID_SPLIT } from '../data/imp-35028-running-g-ramp-vs-sigmoid-split.js';
import { ED } from '../styles/tokens.js';

const D = IMP35028_RUNNING_G_RAMP_VS_SIGMOID_SPLIT;
const LADDER = D.ladder;

// The running-g at the ramp knee and at the sigmoid inflection track each other so
// closely (agree to five significant figures) that a linear axis would render them
// as a single indistinguishable line -- the whole point of finding F1.
function RunningGChart() {
  const svgW = 680;
  const padL = 56;
  const padR = 20;
  const padT = 34;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = padT + plotH + padB;

  const logs = LADDER.map((r) => Math.log10(r.targetScale));
  const xMin = Math.min(...logs);
  const xMax = Math.max(...logs);
  const allG = LADDER.flatMap((r) => [r.gSigmoid, r.gRamp, r.gAnalytic]);
  const yMin = Math.min(...allG) - 0.0006;
  const yMax = Math.max(...allG) + 0.0006;
  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const pathFor = (key) =>
    LADDER.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(Math.log10(r.targetScale))} ${yOf(r[key])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 14} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Running-g g = -d ln r/d ln N at both landmarks, far-tail ladder 1e14&hellip;1e18
      </text>
      {[yMin, (yMin + yMax) / 2, yMax].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
            {v.toFixed(4)}
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {LADDER.map((r) => (
        <text
          key={r.targetScale}
          x={xOf(Math.log10(r.targetScale))}
          y={padT + plotH + 16}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={9}
        >
          1e{Math.log10(r.targetScale).toFixed(0)}
        </text>
      ))}

      <path d={pathFor('gAnalytic')} fill="none" stroke={ED.rule} strokeWidth={1.25} strokeDasharray="4 3" />
      <path d={pathFor('gSigmoid')} fill="none" stroke={ED.series3} strokeWidth={2} />
      <path d={pathFor('gRamp')} fill="none" stroke={ED.series1} strokeWidth={1.5} strokeDasharray="2 2" />
      {LADDER.map((r) => (
        <g key={`pts-${r.targetScale}`}>
          <circle cx={xOf(Math.log10(r.targetScale))} cy={yOf(r.gSigmoid)} r={3} fill={ED.series3} />
          <circle cx={xOf(Math.log10(r.targetScale))} cy={yOf(r.gRamp)} r={2} fill={ED.series1} />
        </g>
      ))}

      <circle cx={padL + 8} cy={padT + 4} r={4} fill={ED.series3} />
      <text x={padL + 18} y={padT + 8} fill={ED.series3} fontSize={10}>
        g at sigmoid inflection
      </text>
      <circle cx={padL + 8} cy={padT + 20} r={3} fill={ED.series1} />
      <text x={padL + 18} y={padT + 24} fill={ED.series1} fontSize={10}>
        g at ramp knee (indistinguishable overlay)
      </text>
      <line x1={padL + 4} y1={padT + 36} x2={padL + 14} y2={padT + 36} stroke={ED.rule} strokeWidth={1.25} strokeDasharray="4 3" />
      <text x={padL + 18} y={padT + 40} fill={ED.inkFaint} fontSize={10}>
        analytic (1/2)(1-1/t) reference
      </text>
    </svg>
  );
}

// The relative gap g_ramp/g_sigmoid - 1 sits ~1e-5, orders of magnitude below the
// ~0.032 (half the 0.064 exponent split) a running-g difference would need to reach
// to actually explain the ramp/sigmoid decay-exponent split (imp-34948 finding).
function GapVsRequiredChart() {
  const svgW = 680;
  const padL = 64;
  const padR = 20;
  const padT = 34;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 200;
  const svgH = padT + plotH + padB;

  const requiredGap = D.exponentSplit / 2;
  const logGaps = LADDER.map((r) => Math.log10(Math.abs(r.gRampOverSigmoidMinus1)));
  const logRequired = Math.log10(requiredGap);
  const yMin = Math.min(...logGaps) - 0.5;
  const yMax = logRequired + 0.5;
  const yOf = (log10v) => padT + plotH - ((log10v - yMin) / (yMax - yMin)) * plotH;
  const barW = 44;
  const gap = (plotW - barW * LADDER.length) / (LADDER.length + 1);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 14} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Measured running-g gap vs the gap a 0.064 exponent split would require
      </text>
      <line
        x1={padL}
        y1={yOf(logRequired)}
        x2={padL + plotW}
        y2={yOf(logRequired)}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={padL + 4} y={yOf(logRequired) - 6} fill={ED.series2} fontSize={9}>
        required gap &asymp; {requiredGap.toFixed(3)} ({'≈'}{D.gGapVsSplitRatio}x the measured max)
      </text>
      {LADDER.map((r, i) => {
        const x = padL + gap + i * (barW + gap);
        const y0 = yOf(yMin);
        const y1 = yOf(Math.log10(Math.abs(r.gRampOverSigmoidMinus1)));
        return (
          <g key={r.targetScale}>
            <rect x={x} y={y1} width={barW} height={y0 - y1} fill={ED.series1} opacity={0.85} />
            <text x={x + barW / 2} y={y1 - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
              {r.gRampOverSigmoidMinus1.toExponential(2)}
            </text>
            <text x={x + barW / 2} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              1e{Math.log10(r.targetScale).toFixed(0)}
            </text>
          </g>
        );
      })}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
    </svg>
  );
}

export default function Imp35140RunningGRampVsSigmoidSplitViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Running-g vs Sigmoid: Why the Ramp/Sigmoid Split Is NOT a Running-g Effect (imp-35140 / imp-35028)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34948 measured two far-tail local decay exponents for the inflection-offset
        landmarks: the sigmoid inflection at {D.decayExponentSigmoid} (essentially the
        imp-33744-predicted -2) and the imp-33721 ramp knee at {D.decayExponentRamp}, staying
        &sim;{D.exponentSplit} shallower. imp-35028 tests whether that split reflects a larger
        running-g g&nbsp;=&nbsp;-d&nbsp;ln&nbsp;r/d&nbsp;ln&nbsp;N at the ramp knee than at the
        sigmoid inflection, measuring g at both landmarks across the same far-tail ladder
        1e14&hellip;1e18.
      </p>

      <RunningGChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem', maxWidth: 700 }}>
        The two curves are visually indistinguishable: g runs {LADDER[0].gSigmoid} &rarr;{' '}
        {LADDER[LADDER.length - 1].gSigmoid} at the sigmoid inflection and{' '}
        {LADDER[0].gRamp} &rarr; {LADDER[LADDER.length - 1].gRamp} at the ramp knee, both
        tracking the analytic (1/2)(1-1/t) reference to under 5e-4. The ramp knee is
        marginally larger on every rung ({D.rampRunningGNeverSmaller ? 'never smaller' : 'not always larger'}
        , correct in sign since it lands at larger N and g is monotone increasing), but the
        max relative excess is only {D.maxRelRunningGGap}.
      </p>

      <GapVsRequiredChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem', maxWidth: 700 }}>
        A running-g explanation for the {D.exponentSplit} exponent split would need a relative
        g gap on the order of {(D.exponentSplit / 2).toFixed(3)} (half the split, a rough
        fractional-exponent-shift estimate). The measured gap tops out at{' '}
        {D.maxRelRunningGGap} &mdash; about {D.gGapVsSplitRatio}&times; too small. The
        ramp/sigmoid split is therefore NOT a running-g difference; it comes from the
        different curvature structure of the two diagnostics (a d&sup2;&sigma;/dt&sup2;=0
        sigmoid inflection vs a d&sup2;p/dt&sup2;=0 ramp knee), not from where in the
        g-running the two landmarks fall.
      </p>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.5rem' }}>N_half target</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>t = ln N</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>g sigmoid</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>g ramp</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>g analytic</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>g_ramp/g_sigmoid - 1</th>
          </tr>
        </thead>
        <tbody>
          {LADDER.map((r) => (
            <tr key={r.targetScale} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.targetScale.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.t}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.gSigmoid}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.gRamp}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.gAnalytic}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.gRampOverSigmoidMinus1.toExponential(2)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-35028 ladder/decayExponent/maxRelRunningGGap literals verbatim (no new computation).
        Measurement on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; C_mb
        GUE-conditional per imp-486 untouched; establishes no operator positivity; imp-3066
        K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; no RH verdict, NO QED.
      </div>
    </div>
  );
}
