import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34933_INFLECTION_OFFSET_RUNNING_VS_FIXED_LADDER } from '../data/imp-34933-inflection-offset-running-vs-fixed-ladder.js';
import { IMP34948_INFLECTION_OFFSET_FAR_TAIL_LADDER_EXTENSION } from '../data/imp-34948-inflection-offset-far-tail-ladder-extension.js';
import { ED } from '../styles/tokens.js';

// Combined near-tail (1e6..1e13) + far-tail (1e14..1e18) rungs, baked locators
// reused verbatim from the imp-34933 / imp-34948 data modules (no new computation).
const COMBINED = [
  ...IMP34933_INFLECTION_OFFSET_RUNNING_VS_FIXED_LADDER.ladder,
  ...IMP34948_INFLECTION_OFFSET_FAR_TAIL_LADDER_EXTENSION.ladder,
].sort((a, b) => a.t - b.t);

// imp-34933 near-tail band tops for the offsetN*(t-1)^2 diagnostic, reused verbatim.
const NEAR_TAIL_SIGMOID_BAND_TOP = 8.1;
const NEAR_TAIL_RAMP_BAND_TOP = 22.4;

// Line chart: offsetSigmoidPct / offsetRampPct decay continuously across the full
// thirteen-rung span 1e6..1e18, with a dashed divider marking the imp-34933/imp-34948 seam.
function OffsetDecayChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 20;
  const padT = 30;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = 240;
  const svgH = padT + plotH + padB;

  const logs = COMBINED.map((r) => Math.log10(r.targetScale));
  const xMin = Math.min(...logs);
  const xMax = Math.max(...logs);
  const yMax = Math.max(...COMBINED.map((r) => r.offsetRampPct)) * 1.1;
  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (pct) => padT + plotH - (pct / yMax) * plotH;

  const pathFor = (key) =>
    COMBINED.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(Math.log10(r.targetScale))} ${yOf(r[key])}`).join(' ');

  const seamLog10 = 13.5; // midpoint between the 1e13 near-tail top rung and the 1e14 far-tail bottom rung

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 10} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Inflection-vs-halving offset (%) across the combined N_half ladder 1e6&hellip;1e18
      </text>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter((v) => v <= yMax).map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
            {v}%
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <line
        x1={xOf(seamLog10)}
        y1={padT}
        x2={xOf(seamLog10)}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={xOf(seamLog10) + 4} y={padT + 10} fill={ED.inkFaint} fontSize={8}>
        near-tail (imp-34933) &rarr; far-tail (imp-34948)
      </text>

      {COMBINED.map((r) => (
        <text
          key={r.targetScale}
          x={xOf(Math.log10(r.targetScale))}
          y={padT + plotH + 16}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={8}
        >
          1e{Math.log10(r.targetScale).toFixed(0)}
        </text>
      ))}

      <path d={pathFor('offsetRampPct')} fill="none" stroke={ED.series1} strokeWidth={2} />
      <path d={pathFor('offsetSigmoidPct')} fill="none" stroke={ED.series3} strokeWidth={2} />
      {COMBINED.map((r) => (
        <g key={`pts-${r.targetScale}`}>
          <circle cx={xOf(Math.log10(r.targetScale))} cy={yOf(r.offsetRampPct)} r={3} fill={ED.series1} />
          <circle cx={xOf(Math.log10(r.targetScale))} cy={yOf(r.offsetSigmoidPct)} r={3} fill={ED.series3} />
        </g>
      ))}

      <circle cx={padL + plotW - 175} cy={padT + 6} r={4} fill={ED.series1} />
      <text x={padL + plotW - 165} y={padT + 10} fill={ED.series1} fontSize={10}>
        ramp knee ({COMBINED[0].offsetRampPct}% &rarr; {COMBINED[COMBINED.length - 1].offsetRampPct}%)
      </text>
      <circle cx={padL + plotW - 175} cy={padT + 22} r={4} fill={ED.series3} />
      <text x={padL + plotW - 165} y={padT + 26} fill={ED.series3} fontSize={10}>
        sigmoid ({COMBINED[0].offsetSigmoidPct}% &rarr; {COMBINED[COMBINED.length - 1].offsetSigmoidPct}%)
      </text>
    </svg>
  );
}

// offsetN*(t-1)^2 diagnostic: the imp-33744-predicted 1/(t-1)^2 law keeps this product
// banded rather than growing like (t-1)^2; the near-tail band top (dashed) marks where
// imp-34933 stopped, and the far-tail rungs sit slightly above it (imp-34948 F2).
function BandChart({ dataKey, nearTailBandTop, label, color }) {
  const svgW = 340;
  const padL = 46;
  const padR = 16;
  const padT = 26;
  const padB = 38;
  const plotW = svgW - padL - padR;
  const plotH = 150;
  const svgH = padT + plotH + padB;

  const vals = COMBINED.map((r) => r[dataKey]);
  const vMin = Math.min(nearTailBandTop, ...vals);
  const vMax = Math.max(nearTailBandTop, ...vals);
  const pad = (vMax - vMin) * 0.25 || 1;
  const lo = vMin - pad;
  const hi = vMax + pad;

  const logs = COMBINED.map((r) => Math.log10(r.targetScale));
  const xMin = Math.min(...logs);
  const xMax = Math.max(...logs);
  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - lo) / (hi - lo)) * plotH;

  const path = COMBINED.map(
    (r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(Math.log10(r.targetScale))} ${yOf(r[dataKey])}`
  ).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 8} fill={ED.inkSoft} fontSize={10} fontWeight={700}>
        {label}: 1e6&hellip;1e18, imp-33744 1/(t-1)&sup2; law band
      </text>
      <line
        x1={padL}
        y1={yOf(nearTailBandTop)}
        x2={padL + plotW}
        y2={yOf(nearTailBandTop)}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={padL + 2} y={yOf(nearTailBandTop) - 4} fill={ED.series2} fontSize={8}>
        near-tail band top ({nearTailBandTop})
      </text>
      <path d={path} fill="none" stroke={color} strokeWidth={2} />
      {COMBINED.map((r) => (
        <circle key={r.targetScale} cx={xOf(Math.log10(r.targetScale))} cy={yOf(r[dataKey])} r={2.5} fill={color} />
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      {COMBINED.map((r) => (
        <text
          key={`lab-${r.targetScale}`}
          x={xOf(Math.log10(r.targetScale))}
          y={padT + plotH + 14}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={8}
        >
          1e{Math.log10(r.targetScale).toFixed(0)}
        </text>
      ))}
    </svg>
  );
}

export default function Imp35079CombinedInflectionOffsetLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Combined Inflection-Offset Ladder, 1e6&ndash;1e18 (imp-35079 / imp-34933 / imp-34948)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34933 measured the sigmoid-inflection and exponent-ramp-knee offsets from the
        sigma&nbsp;=&nbsp;1/2 halving landmark across the near-tail ladder 1e6&hellip;1e13, finding a decay
        toward the imp-33744-predicted offsetN&nbsp;&sim;&nbsp;const/(t-1)&sup2; law (t&nbsp;=&nbsp;ln&nbsp;N).
        imp-34948 extended the same ladder (locators reused verbatim) to the far-tail rungs 1e14&hellip;1e18.
        This page stitches both ladders into one thirteen-rung view spanning 1e6&hellip;1e18.
      </p>

      <OffsetDecayChart />

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
        <BandChart
          dataKey="sigmoidOffsetTimesTm1Sq"
          nearTailBandTop={NEAR_TAIL_SIGMOID_BAND_TOP}
          label="sigmoid: offsetN&middot;(t-1)&sup2;"
          color={ED.series3}
        />
        <BandChart
          dataKey="rampOffsetTimesTm1Sq"
          nearTailBandTop={NEAR_TAIL_RAMP_BAND_TOP}
          label="ramp: offsetN&middot;(t-1)&sup2;"
          color={ED.series1}
        />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem', maxWidth: 700 }}>
        Across the full 1e6&hellip;1e18 span the offset falls monotonically for both notions (sigmoid
        {' '}{COMBINED[0].offsetSigmoidPct}% &rarr; {COMBINED[COMBINED.length - 1].offsetSigmoidPct}%; ramp
        {' '}{COMBINED[0].offsetRampPct}% &rarr; {COMBINED[COMBINED.length - 1].offsetRampPct}%), while
        offsetN&middot;(t-1)&sup2; stays inside a narrow band near the near-tail tops
        ({NEAR_TAIL_SIGMOID_BAND_TOP} sigmoid, {NEAR_TAIL_RAMP_BAND_TOP} ramp) rather than growing like
        (t-1)&sup2; &mdash; the qualitative signature of the imp-33744 1/(t-1)&sup2; law holding across
        thirteen decades of N, not just the seven the near-tail ladder alone covered.
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
            <th style={{ padding: '0.4rem 0.5rem' }}>sigmoid offset</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>ramp offset</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>sigmoid&middot;(t-1)&sup2;</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>ramp&middot;(t-1)&sup2;</th>
          </tr>
        </thead>
        <tbody>
          {COMBINED.map((r) => (
            <tr key={r.targetScale} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.targetScale.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.t}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.offsetSigmoidPct}%</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.offsetRampPct}%</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.sigmoidOffsetTimesTm1Sq}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.rampOffsetTimesTm1Sq}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page stitching the
        imp-34933 and imp-34948 ladder literals verbatim (no new computation). Measurement on the
        inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; C_mb GUE-conditional per
        imp-486 untouched; establishes no operator positivity; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched;
        changes no bound; no RH verdict, NO QED.
      </div>
    </div>
  );
}
