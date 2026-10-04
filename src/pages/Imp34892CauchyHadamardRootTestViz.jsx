import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS } from '../data/imp-34863-sigma-knee-cauchy-hadamard-radius.js';
import { ED } from '../styles/tokens.js';

const D = IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS;
const ROOT_K = D.radiusOfConvergence.rootSequence_absDelta_pow_1overk; // k = 1..9
const RATIO_K = D.radiusOfConvergence.ratioSequence_r2over1_to_r9over8; // k = 2..9 (r_k/r_{k-1})
const STEPS = D.stepSensitivity.steps; // {hd, delta8, delta9, ratio9over8} for {2e-3,1e-3,5e-4}

// log10-scaled y-axis: the ratio sequence spans a wider range (one blip up to ~1.6e-1) than the
// tightly-banded root sequence, so a log axis is needed to show both without the root band flattening.
function RootVsRatioChart() {
  const svgW = 720;
  const svgH = 320;
  const padL = 46;
  const padR = 20;
  const padT = 24;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMin = -3.4; // log10(~4.5e-4), below the smallest ratio value
  const yMax = -0.7; // log10(~0.2), above the r7/6 blip
  const xAt = (k) => padL + ((k - 1) / 8) * cW;
  const yAt = (v) => padT + cH - ((Math.log10(v) - yMin) / (yMax - yMin)) * cH;

  const rootPts = ROOT_K.map((v, i) => ({ k: i + 1, v }));
  const ratioPts = RATIO_K.map((v, i) => ({ k: i + 2, v }));
  const blip = ratioPts.find((p) => p.k === 7);

  const yTicks = [-3, -2, -1];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(10 ** t)} x2={padL + cW} y2={yAt(10 ** t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(10 ** t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {`10^${t}`}
          </text>
        </g>
      ))}
      {Array.from({ length: 9 }, (_, i) => i + 1).map((k) => (
        <text key={k} x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {k}
        </text>
      ))}

      <polyline
        points={rootPts.map((p) => `${xAt(p.k)},${yAt(p.v)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
      />
      {rootPts.map((p) => (
        <circle key={'r' + p.k} cx={xAt(p.k)} cy={yAt(p.v)} r={3} fill={ED.series1} />
      ))}

      <polyline
        points={ratioPts.map((p) => `${xAt(p.k)},${yAt(p.v)}`).join(' ')}
        fill="none"
        stroke={ED.brassDeco}
        strokeWidth={2}
      />
      {ratioPts.map((p) => (
        <circle key={'q' + p.k} cx={xAt(p.k)} cy={yAt(p.v)} r={3} fill={ED.brassDeco} />
      ))}

      {blip && (
        <text x={xAt(blip.k)} y={yAt(blip.v) - 10} textAnchor="middle" fill={ED.series2} fontSize={9}>
          r7/6 blip
        </text>
      )}

      <line x1={padL} y1={yAt(1)} x2={padL + cW} y2={yAt(1)} stroke={ED.rule} strokeWidth={1} strokeDasharray="4 3" />
      <text x={padL + cW - 2} y={yAt(1) - 4} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        value = 1 (convergence boundary)
      </text>

      <g>
        <line x1={padL + 10} y1={padT - 12} x2={padL + 28} y2={padT - 12} stroke={ED.series1} strokeWidth={2.5} />
        <text x={padL + 32} y={padT - 8} fill={ED.inkSoft} fontSize={10} fontFamily="monospace">
          |delta_k|^(1/k) (root test)
        </text>
        <line x1={padL + 210} y1={padT - 12} x2={padL + 228} y2={padT - 12} stroke={ED.brassDeco} strokeWidth={2.5} />
        <text x={padL + 232} y={padT - 8} fill={ED.inkSoft} fontSize={10} fontFamily="monospace">
          |delta_k/delta_(k-1)| (ratio test)
        </text>
      </g>

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        order k
      </text>
    </svg>
  );
}

function StepProbeBars() {
  const svgW = 720;
  const svgH = 220;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = STEPS.flatMap((s, si) => [
    { label: `hd=${s.hd}: |delta_8|`, v: Math.abs(s.delta8), color: ED.series1, row: si * 2 },
    { label: `hd=${s.hd}: |delta_9|`, v: Math.abs(s.delta9), color: ED.series3, row: si * 2 + 1 },
  ]);
  const maxLog = Math.max(...rows.map((r) => Math.log10(r.v)));
  const minLog = Math.min(...rows.map((r) => Math.log10(r.v)));
  const rowH = cH / rows.length;
  const xAt = (v) => padL + ((Math.log10(v) - minLog) / (maxLog - minLog)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => (
        <g key={r.label}>
          <text x={padL - 6} y={padT + i * rowH + rowH / 2 + 3} textAnchor="end" fill={ED.inkSoft} fontSize={9} fontFamily="monospace">
            {r.label}
          </text>
          <line
            x1={padL}
            y1={padT + i * rowH + rowH / 2}
            x2={xAt(r.v)}
            y2={padT + i * rowH + rowH / 2}
            stroke={r.color}
            strokeWidth={8}
            strokeLinecap="round"
          />
          <text x={xAt(r.v) + 6} y={padT + i * rowH + rowH / 2 + 3} fill={ED.inkFaint} fontSize={9}>
            {r.v.toExponential(2)}
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
    </svg>
  );
}

export default function Imp34892CauchyHadamardRootTestViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Cauchy-Hadamard Root-Test Radius Read (imp-34892 / imp-34863)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        The root sequence |delta_k|^(1/k) (blue) stays in a narrow band well below the value-1
        convergence boundary across all nine orders, while the ratio sequence |delta_k/delta_(k-1)|
        (amber) amplifies the single-term r7/6 blip. Log-scale y-axis; both sequences settle back
        below 1, but the root test is visibly the smoother, more decisive read.
      </p>
      <RootVsRatioChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Step-sensitivity probe of the new delta_8/delta_9 orders at central-difference steps{' '}
        {STEPS.map((s) => s.hd).join(', ')}: magnitudes stay within a {D.stepSensitivity.delta8StepSpread}x
        (delta_8) / {D.stepSensitivity.delta9StepSpread}x (delta_9) spread, far tighter than delta_6's
        ~11x sign-flipping swing.
      </p>
      <StepProbeBars />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        Radius of convergence: root test R&nbsp;&asymp;&nbsp;{D.radiusOfConvergence.radiusRoot} (limsup
        |delta_k|^(1/k) &asymp; {D.radiusOfConvergence.limsupRoot}), ratio test (resolvable rungs) R&nbsp;&asymp;&nbsp;
        {D.radiusOfConvergence.radiusRatioResolvable}. The physical resummation point eps=1 sits deep inside
        both disks.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-34863 root/ratio/step-probe literals verbatim (no new computation). Measurement on the
        INHERITED imp-3220/imp-3406 surrogate; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
        changes no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
