import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34948_INFLECTION_OFFSET_FAR_TAIL_LADDER_EXTENSION } from '../data/imp-34948-inflection-offset-far-tail-ladder-extension.js';
import { ED } from '../styles/tokens.js';

const D = IMP34948_INFLECTION_OFFSET_FAR_TAIL_LADDER_EXTENSION;
const LADDER = D.ladder;

// imp-34933 near-tail (1e6..1e13) reference band tops, reused verbatim from the
// imp-34948 data module (internal-only constants there; inlined here for the chart).
const NEAR_TAIL_SIGMOID_BAND_TOP = 8.1;
const NEAR_TAIL_RAMP_BAND_TOP = 22.4;

// Line chart: offsetSigmoidPct and offsetRampPct keep falling as the reference scale
// N_half slides across the far-tail rungs 1e14..1e18, continuing the imp-34933 decay.
function OffsetDecayChart() {
  const svgW = 680;
  const padL = 56;
  const padR = 20;
  const padT = 30;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = padT + plotH + padB;

  const logs = LADDER.map((r) => Math.log10(r.targetScale));
  const xMin = Math.min(...logs);
  const xMax = Math.max(...logs);
  const yMax = Math.max(...LADDER.map((r) => r.offsetRampPct)) * 1.1;
  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (pct) => padT + plotH - (pct / yMax) * plotH;

  const pathFor = (key) =>
    LADDER.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(Math.log10(r.targetScale))} ${yOf(r[key])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 10} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Inflection-vs-halving offset (%) across the far-tail N_half ladder 1e14&hellip;1e18
      </text>
      {[0, 0.5, 1, 1.5, 2, 2.5].filter((v) => v <= yMax).map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
            {v}%
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

      <path d={pathFor('offsetRampPct')} fill="none" stroke={ED.series1} strokeWidth={2} />
      <path d={pathFor('offsetSigmoidPct')} fill="none" stroke={ED.series3} strokeWidth={2} />
      {LADDER.map((r) => (
        <g key={`pts-${r.targetScale}`}>
          <circle cx={xOf(Math.log10(r.targetScale))} cy={yOf(r.offsetRampPct)} r={3} fill={ED.series1} />
          <circle cx={xOf(Math.log10(r.targetScale))} cy={yOf(r.offsetSigmoidPct)} r={3} fill={ED.series3} />
        </g>
      ))}

      <circle cx={padL + plotW - 165} cy={padT + 6} r={4} fill={ED.series1} />
      <text x={padL + plotW - 155} y={padT + 10} fill={ED.series1} fontSize={10}>
        ramp knee ({LADDER[0].offsetRampPct}% &rarr; {LADDER[LADDER.length - 1].offsetRampPct}%)
      </text>
      <circle cx={padL + plotW - 165} cy={padT + 22} r={4} fill={ED.series3} />
      <text x={padL + plotW - 155} y={padT + 26} fill={ED.series3} fontSize={10}>
        sigmoid ({LADDER[0].offsetSigmoidPct}% &rarr; {LADDER[LADDER.length - 1].offsetSigmoidPct}%)
      </text>
    </svg>
  );
}

// offsetN*(t-1)^2 sits ABOVE the imp-34933 near-tail band top (dashed reference line)
// and drifts up only slightly (bandDrift < 1.03x) across the far-tail rungs -- the
// residual O(1/t) correction slowly asymptoting on top of the leading 1/(t-1)^2 law.
function StillRisingBandChart({ dataKey, nearTailBandTop, label, color }) {
  const svgW = 330;
  const padL = 46;
  const padR = 16;
  const padT = 26;
  const padB = 38;
  const plotW = svgW - padL - padR;
  const plotH = 140;
  const svgH = padT + plotH + padB;

  const vals = LADDER.map((r) => r[dataKey]);
  const vMin = Math.min(nearTailBandTop, ...vals);
  const vMax = Math.max(...vals);
  const pad = (vMax - vMin) * 0.25 || 1;
  const lo = vMin - pad;
  const hi = vMax + pad;

  const logs = LADDER.map((r) => Math.log10(r.targetScale));
  const xMin = Math.min(...logs);
  const xMax = Math.max(...logs);
  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - lo) / (hi - lo)) * plotH;

  const path = LADDER.map(
    (r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(Math.log10(r.targetScale))} ${yOf(r[dataKey])}`
  ).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 8} fill={ED.inkSoft} fontSize={10} fontWeight={700}>
        {label}: still above the near-tail band top
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
        imp-34933 near-tail top ({nearTailBandTop})
      </text>
      <path d={path} fill="none" stroke={color} strokeWidth={2} />
      {LADDER.map((r) => (
        <circle key={r.targetScale} cx={xOf(Math.log10(r.targetScale))} cy={yOf(r[dataKey])} r={2.5} fill={color} />
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      {LADDER.map((r) => (
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

export default function Imp35030FarTailInflectionOffsetLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Far-Tail Inflection-Offset Ladder, 1e14&ndash;1e18 (imp-35030 / imp-34948)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34933 found the sigmoid-inflection and exponent-ramp-knee offsets from the halving landmark
        decay as offsetN &sim; const/(t-1)&sup2; across the seven-decade ladder 1e6&hellip;1e13, with a
        measured local decay exponent &asymp; {D.imp34933NearTailDecayExponent} &mdash; shallower than the
        imp-33744-predicted -2, attributed to the running of g&nbsp;=&nbsp;-d&nbsp;ln&nbsp;r/d&nbsp;ln&nbsp;N.
        imp-34948 extends the same ladder (locators reused verbatim) to the far-tail rungs 1e14&hellip;1e18
        to test whether the exponent drifts toward -2 as t grows.
      </p>

      <OffsetDecayChart />

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
        <StillRisingBandChart
          dataKey="sigmoidOffsetTimesTm1Sq"
          nearTailBandTop={NEAR_TAIL_SIGMOID_BAND_TOP}
          label="sigmoid: offsetN&middot;(t-1)&sup2;"
          color={ED.series3}
        />
        <StillRisingBandChart
          dataKey="rampOffsetTimesTm1Sq"
          nearTailBandTop={NEAR_TAIL_RAMP_BAND_TOP}
          label="ramp: offsetN&middot;(t-1)&sup2;"
          color={ED.series1}
        />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem', maxWidth: 700 }}>
        Local decay exponent d&nbsp;ln&nbsp;offsetN&nbsp;/&nbsp;d&nbsp;ln&nbsp;t measured on the far-tail
        span is {D.decayExponentSigmoid} (sigmoid) and {D.decayExponentRamp} (ramp) &mdash; both markedly
        closer to the imp-33744-predicted -2 than the imp-34933 near-tail {D.imp34933NearTailDecayExponent},
        confirming the exponent converges toward -2 as t grows (running-g fading out). The
        offsetN&middot;(t-1)&sup2; product, however, keeps drifting slowly upward &mdash; sitting above the
        imp-34933 near-tail band tops throughout &mdash; with per-decade drift under
        {' '}{Math.max(D.bandDriftSigmoid, D.bandDriftRamp)}&times; across the five far-tail decades: a
        residual O(1/t) running-g correction still asymptoting slowly on top of the leading 1/(t-1)&sup2; law.
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
          {LADDER.map((r) => (
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-34948 ladder/decayExponent/bandDrift literals verbatim (no new computation). Measurement on
        the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; C_mb GUE-conditional per
        imp-486 untouched; establishes no operator positivity; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched;
        changes no bound; no RH verdict, NO QED.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp34958-inflection-offset-running-vs-fixed-ladder" style={{ color: 'var(--series-5)' }}>
          Inflection-vs-Halving Offset: Running, Not Fixed, Near-Tail Ladder (imp-34958 / imp-34933)
        </Link>
      </div>
    </div>
  );
}
