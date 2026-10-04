import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34778_COLLAPSE_LADDER_Q4_POWER_ANALYSIS } from '../data/imp-34778-collapse-ladder-q4-power-analysis.js';
import { IMP34751_COLLAPSE_LADDER_MEAN_ZERO_STATISTICAL_TEST } from '../data/imp-34751-collapse-ladder-mean-zero-statistical-test.js';
import { ED } from '../styles/tokens.js';

const P = IMP34778_COLLAPSE_LADDER_Q4_POWER_ANALYSIS;
const T = IMP34751_COLLAPSE_LADDER_MEAN_ZERO_STATISTICAL_TEST;

// -- horizontal bar comparison: q3 vs q4 ensemble sigma, annotated with the ~2.61x ratio. --
function SigmaBars({ sigmaQ3, sigmaQ4, ratio }) {
  const svgW = 660;
  const padL = 90;
  const padR = 60;
  const barH = 34;
  const gap = 26;
  const plotW = svgW - padL - padR;
  const svgH = padL * 0 + barH * 2 + gap * 3;
  const vMax = sigmaQ4 * 1.2;
  const xOf = (v) => (v / vMax) * plotW;

  const rows = [
    { label: 'q3 sigma', value: sigmaQ3, color: ED.series1, y: gap },
    { label: 'q4 sigma', value: sigmaQ4, color: ED.series2, y: gap * 2 + barH },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((row) => (
        <g key={row.label}>
          <text x={padL - 10} y={row.y + barH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={12}>
            {row.label}
          </text>
          <rect x={padL} y={row.y} width={Math.max(xOf(row.value), 2)} height={barH} fill={row.color} opacity={0.85} rx={3} />
          <text
            x={padL + xOf(row.value) + 8}
            y={row.y + barH / 2 + 4}
            fill={row.color}
            fontSize={12}
            fontFamily="monospace"
          >
            {row.value.toFixed(4)}
          </text>
        </g>
      ))}
      <text x={padL} y={svgH - 4} fill={ED.inkFaint} fontSize={11}>
        q4 / q3 sigma ratio ~{ratio.toFixed(2)}x -- the larger q4 ULP amplitude, not a nonzero centre
      </text>
    </svg>
  );
}

// -- CI-width comparison: q3 vs q4 95% mean CI drawn as horizontal bands on a shared deviation axis. --
function CiBands({ q3Ci, q4Ci, q3Mean, q4Mean }) {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 28;
  const rowH = 46;
  const plotW = svgW - padL - padR;
  const svgH = rowH * 2 + padT + padB;

  const allVals = [...q3Ci, ...q4Ci, q3Mean, q4Mean, 0];
  const vMin = Math.min(...allVals) - 0.02;
  const vMax = Math.max(...allVals) + 0.02;
  const xOf = (v) => padL + ((v - vMin) / (vMax - vMin)) * plotW;
  const zeroX = xOf(0);

  const rows = [
    { label: 'q3', ci: q3Ci, meanV: q3Mean, color: ED.series1, y: padT },
    { label: 'q4', ci: q4Ci, meanV: q4Mean, color: ED.series2, y: padT + rowH },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={zeroX} x2={zeroX} y1={padT - 6} y2={svgH - padB + 6} stroke={ED.rule} strokeWidth={1} strokeDasharray="3,3" />
      {rows.map((row) => (
        <g key={row.label}>
          <text x={padL - 8} y={row.y + rowH / 2 - 10} textAnchor="end" fill={ED.inkSoft} fontSize={12}>
            {row.label}
          </text>
          <rect
            x={xOf(row.ci[0])}
            y={row.y + rowH / 2 - 9}
            width={Math.max(xOf(row.ci[1]) - xOf(row.ci[0]), 1)}
            height={18}
            fill={row.color}
            opacity={0.3}
            rx={3}
          />
          <circle cx={xOf(row.meanV)} cy={row.y + rowH / 2} r={4} fill={row.color} />
          <text
            x={xOf(row.ci[1]) + 8}
            y={row.y + rowH / 2 + 4}
            fill={row.color}
            fontSize={11}
            fontFamily="monospace"
          >
            [{row.ci[0].toFixed(3)}, {row.ci[1].toFixed(3)}] width {(row.ci[1] - row.ci[0]).toFixed(3)}
          </text>
        </g>
      ))}
      <text x={zeroX} y={svgH - padB + 20} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        deviation = 0
      </text>
    </svg>
  );
}

export default function Imp34807CollapseLadderChannelSigmaComparisonViz() {
  const q3Ci = T.q3_deviation_ci95;
  const q4Ci = P.q4_ci95_reproduced;
  const q3Width = q3Ci[1] - q3Ci[0];
  const q4Width = q4Ci[1] - q4Ci[0];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Collapse-Ladder Channel Sigma: q4 vs q3 (imp-34807 / imp-34778)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34778's power analysis on the same {P.n_footings}-footing deep-group ensemble measured the q4
        deviation channel's sample standard deviation at ~{P.sigma_ratio_q4_over_q3.toFixed(2)}x the q3
        channel's. It is this larger ULP amplitude (imp-34647) -- not a nonzero mean centre -- that widens
        the q4 95% mean CI relative to q3.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Per-footing sample sigma: q3 vs q4
      </p>
      <SigmaBars sigmaQ3={P.q3_ensemble_sigma} sigmaQ4={P.q4_ensemble_sigma} ratio={P.sigma_ratio_q4_over_q3} />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.75rem', marginBottom: '0.5rem' }}>
        95% mean CI: q3 ~[{q3Ci[0].toFixed(3)}, {q3Ci[1].toFixed(3)}] vs q4 ~[{q4Ci[0].toFixed(3)}, {q4Ci[1].toFixed(3)}]
      </p>
      <CiBands q3Ci={q3Ci} q4Ci={q4Ci} q3Mean={T.q3_deviation_mean} q4Mean={P.q4_mean_deviation} />

      <div
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        The q4 CI is ~{(q4Width / q3Width).toFixed(2)}x wider than the q3 CI ({q4Width.toFixed(3)} vs{' '}
        {q3Width.toFixed(3)}), tracking the ~{P.sigma_ratio_q4_over_q3.toFixed(2)}x sigma ratio almost exactly
        -- both channels have a mean centred near a small positive offset, but only q4's larger per-footing
        noise floor is why its CI is wide enough to contain 0 by a wider margin.
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page presenting the imp-34778
        and imp-34751 literals verbatim (no new computation). A CI containing 0 is failure to reject, NOT
        acceptance; this is a cross-check on the INHERITED imp-3220/imp-3406 surrogate, not a rehabilitation
        of it. The -2 asymptote and C_C&nbsp;=&nbsp;(1/8)&radic;(3&pi;) (imp-2714) ansatz are UNTOUCHED; the
        C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes
        no bound; no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
