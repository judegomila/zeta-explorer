import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34933_INFLECTION_OFFSET_RUNNING_VS_FIXED_LADDER } from '../data/imp-34933-inflection-offset-running-vs-fixed-ladder.js';
import { ED } from '../styles/tokens.js';

const D = IMP34933_INFLECTION_OFFSET_RUNNING_VS_FIXED_LADDER;
const LADDER = D.ladder;

// Line chart: offsetSigmoidPct and offsetRampPct fall monotonically as the reference
// scale N_half slides from 1e6 to 1e13 -- the RUNNING signature (a fixed constant
// would draw a flat horizontal line instead).
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
  const yMax = Math.max(...LADDER.map((r) => r.offsetRampPct)) * 1.08;
  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (pct) => padT + plotH - (pct / yMax) * plotH;

  const pathFor = (key) =>
    LADDER.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(Math.log10(r.targetScale))} ${yOf(r[key])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 10} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Inflection-vs-halving offset (%) across the seven-decade N_half ladder
      </text>
      {[0, 2, 4, 6, 8, 10, 12].filter((v) => v <= yMax).map((v) => (
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

      <circle cx={padL + plotW - 150} cy={padT + 6} r={4} fill={ED.series1} />
      <text x={padL + plotW - 140} y={padT + 10} fill={ED.series1} fontSize={10}>
        ramp knee ({LADDER[0].offsetRampPct}% &rarr; {LADDER[LADDER.length - 1].offsetRampPct}%)
      </text>
      <circle cx={padL + plotW - 150} cy={padT + 22} r={4} fill={ED.series3} />
      <text x={padL + plotW - 140} y={padT + 26} fill={ED.series3} fontSize={10}>
        sigmoid ({LADDER[0].offsetSigmoidPct}% &rarr; {LADDER[LADDER.length - 1].offsetSigmoidPct}%)
      </text>
    </svg>
  );
}

// offsetN*(t-1)^2 stays inside a narrow band as N_half slides -- the imp-33744
// closed-form offsetN ~ const/(t-1)^2 signature. A FIXED offset would make this
// product grow like (t-1)^2 across the ladder instead of staying flat.
function BandedDiagnosticChart({ dataKey, label, color }) {
  const svgW = 330;
  const padL = 46;
  const padR = 16;
  const padT = 26;
  const padB = 38;
  const plotW = svgW - padL - padR;
  const plotH = 140;
  const svgH = padT + plotH + padB;

  const vals = LADDER.map((r) => r[dataKey]);
  const vMin = Math.min(...vals);
  const vMax = Math.max(...vals);
  const pad = (vMax - vMin) * 0.4 || 1;
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
        {label}: banded, not (t-1)&sup2;-growing
      </text>
      <rect
        x={padL}
        y={yOf(vMax)}
        width={plotW}
        height={Math.max(yOf(vMin) - yOf(vMax), 1)}
        fill={color}
        opacity={0.12}
      />
      <line x1={padL} y1={yOf(vMax)} x2={padL + plotW} y2={yOf(vMax)} stroke={color} strokeWidth={1} strokeDasharray="3 2" />
      <line x1={padL} y1={yOf(vMin)} x2={padL + plotW} y2={yOf(vMin)} stroke={color} strokeWidth={1} strokeDasharray="3 2" />
      <text x={padL + plotW + 2 - plotW} y={yOf(vMax) - 4} fill={color} fontSize={9}>
        {vMax.toFixed(2)}
      </text>
      <text x={padL + plotW + 2 - plotW} y={yOf(vMin) + 11} fill={color} fontSize={9}>
        {vMin.toFixed(2)}
      </text>
      <path d={path} fill="none" stroke={color} strokeWidth={2} />
      {LADDER.map((r) => (
        <circle key={r.targetScale} cx={xOf(Math.log10(r.targetScale))} cy={yOf(r[dataKey])} r={2.5} fill={color} />
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      {LADDER.map((r, i) =>
        i % 2 === 0 ? (
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
        ) : null
      )}
    </svg>
  );
}

export default function Imp34958InflectionOffsetRunningVsFixedLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Inflection-vs-Halving Offset: Running, Not Fixed (imp-34958 / imp-34933)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34904 attributed the ~3% landmark gaps between the crossover/halving point and the curvature
        (inflection) landmark to the imp-33744 log-factor running term, but measured the offset at only
        ONE reference scale. imp-34933 discriminates the FIXED-constant reading from the RUNNING reading
        by sliding the reference scale N_half across a seven-decade ladder ({LADDER[0].targetScale.toExponential(0)}
        {' '}&hellip; {LADDER[LADDER.length - 1].targetScale.toExponential(0)}) and re-measuring both the
        sigmoid-inflection and exponent-ramp-knee offsets at each rung.
      </p>

      <OffsetDecayChart />

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
        <BandedDiagnosticChart dataKey="sigmoidOffsetTimesTm1Sq" label="sigmoid: offsetN&middot;(t-1)&sup2;" color={ED.series3} />
        <BandedDiagnosticChart dataKey="rampOffsetTimesTm1Sq" label="ramp: offsetN&middot;(t-1)&sup2;" color={ED.series1} />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem', maxWidth: 700 }}>
        Both offsets fall monotonically &mdash; sigmoid {LADDER[0].offsetSigmoidPct}%&nbsp;&rarr;&nbsp;
        {LADDER[LADDER.length - 1].offsetSigmoidPct}% ({D.shrinkFactorSigmoid}&times; contraction), ramp
        {' '}{LADDER[0].offsetRampPct}%&nbsp;&rarr;&nbsp;{LADDER[LADDER.length - 1].offsetRampPct}% (
        {D.shrinkFactorRamp}&times;) &mdash; while the offsetN&middot;(t-1)&sup2; product stays banded
        rather than growing, confirming the imp-33744 closed-form offsetN&nbsp;~&nbsp;const/(t-1)&sup2;.
        Local decay exponent d&nbsp;ln&nbsp;offsetN&nbsp;/&nbsp;d&nbsp;ln&nbsp;t &asymp; {D.decayExponentSigmoid}
        {' '}(sigmoid) / {D.decayExponentRamp} (ramp), close to the predicted -2.
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
        imp-34933 ladder/decayExponent/shrinkFactor literals verbatim (no new computation). Measurement
        on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; C_mb GUE-conditional per
        imp-486 untouched; establishes no operator positivity; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched;
        changes no bound; no RH verdict, NO QED.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp35030-far-tail-inflection-offset-ladder" style={{ color: 'var(--series-5)' }}>
          Far-Tail Inflection-Offset Ladder Extension, 1e14&ndash;1e18 (imp-35030 / imp-34948)
        </Link>
      </div>
    </div>
  );
}
