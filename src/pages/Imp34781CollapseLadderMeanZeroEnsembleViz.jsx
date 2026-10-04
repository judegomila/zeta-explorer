import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34751_COLLAPSE_LADDER_MEAN_ZERO_STATISTICAL_TEST } from '../data/imp-34751-collapse-ladder-mean-zero-statistical-test.js';
import { ED } from '../styles/tokens.js';

const D = IMP34751_COLLAPSE_LADDER_MEAN_ZERO_STATISTICAL_TEST;

// -- per-footing deviation scatter: 24 points straddling 0, with the Student-t 95% mean CI band and the
// footing-count sign/runs-test summary underneath. --
function FootingScatter({ devs, ci, mean, color, label }) {
  const svgW = 660;
  const padL = 50;
  const padR = 20;
  const padT = 16;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = 140;
  const svgH = plotH + padT + padB;

  const allVals = [...devs, ci.lo, ci.hi, 0];
  const vMin = Math.min(...allVals) - 0.02;
  const vMax = Math.max(...allVals) + 0.02;
  const yOf = (v) => padT + plotH - ((v - vMin) / (vMax - vMin)) * plotH;
  const xOf = (j) => padL + (j / (devs.length - 1)) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* 95% mean CI band */}
      <rect
        x={padL}
        y={yOf(ci.hi)}
        width={plotW}
        height={Math.max(yOf(ci.lo) - yOf(ci.hi), 1)}
        fill={color}
        opacity={0.12}
      />
      <line x1={padL} x2={padL + plotW} y1={yOf(0)} y2={yOf(0)} stroke={ED.rule} strokeWidth={1} strokeDasharray="3,3" />
      <line x1={padL} x2={padL + plotW} y1={yOf(mean)} y2={yOf(mean)} stroke={color} strokeWidth={1} strokeDasharray="5,2" />
      {devs.map((d, j) => (
        <circle key={j} cx={xOf(j)} cy={yOf(d)} r={3.5} fill={color} opacity={d > 0 ? 1 : 0.55} />
      ))}
      <text x={padL} y={padT - 4} fill={ED.inkSoft} fontSize={10}>
        {label} (dashed = mean, band = 95% CI, dotted = 0)
      </text>
      <text x={padL} y={svgH - 8} fill={ED.inkFaint} fontSize={10}>
        footing j = 0
      </text>
      <text x={padL + plotW} y={svgH - 8} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
        footing j = 23
      </text>
    </svg>
  );
}

function TestSummaryRow({ label, nPos, nNeg, signP, runsR, runsExp, runsZ, ciLo, ciHi, meanV }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
      <td style={{ padding: '0.4rem 0.6rem' }}>{label}</td>
      <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{nPos} / {nNeg}</td>
      <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{signP}</td>
      <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{runsR} vs {runsExp}</td>
      <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{runsZ}</td>
      <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
        [{ciLo}, {ciHi}] (mean {meanV})
      </td>
    </tr>
  );
}

export default function Imp34781CollapseLadderMeanZeroEnsembleViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Collapse-Ladder Mean-Zero Ensemble: Per-Footing q3/q4 Deviations (imp-34781 / imp-34751)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34751 upgraded the eyeballed three-footing "sign flips so it must be mean-zero" reading to a
        formal test over an ensemble of {D.n_footings} independent deep-group footings (each past the
        imp-33620 sigma&lt;0.01 anchor N*&nbsp;~&nbsp;{D.deep_tail_boundary_N.toExponential(3)}). Below are
        the actual per-footing q3 and q4 deviations d_k&nbsp;=&nbsp;(r_k&minus;2^k)/2^k that feed the three
        formal tests, straddling 0 with no footing-ordered drift.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        q3 deviation from 2^3=8 across the 24 footings
      </p>
      <FootingScatter
        devs={D.q3_deviations_by_footing}
        ci={{ lo: D.q3_deviation_ci95[0], hi: D.q3_deviation_ci95[1] }}
        mean={D.q3_deviation_mean}
        color={ED.series1}
        label="q3"
      />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        q4 deviation from 2^4=16 across the 24 footings
      </p>
      <FootingScatter
        devs={D.q4_deviations_by_footing}
        ci={{ lo: D.q4_deviation_ci95[0], hi: D.q4_deviation_ci95[1] }}
        mean={D.q4_deviation_mean}
        color={ED.series2}
        label="q4"
      />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        Sign-test / runs-test / mean-CI summary (mean-zero null NOT rejected on either channel)
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>channel</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>+/&minus; split</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>sign-test p</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>runs R vs E[R]</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>runs z</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>95% mean CI</th>
          </tr>
        </thead>
        <tbody>
          <TestSummaryRow
            label="q3"
            nPos={D.q3_n_positive}
            nNeg={D.q3_n_negative}
            signP={D.q3_sign_test_p}
            runsR={D.q3_runs_R}
            runsExp={D.q3_runs_expected}
            runsZ={D.q3_runs_z}
            ciLo={D.q3_deviation_ci95[0]}
            ciHi={D.q3_deviation_ci95[1]}
            meanV={D.q3_deviation_mean}
          />
          <TestSummaryRow
            label="q4"
            nPos={D.q4_n_positive}
            nNeg={D.q4_n_negative}
            signP={D.q4_sign_test_p}
            runsR={D.q4_runs_R}
            runsExp={D.q4_runs_expected}
            runsZ={D.q4_runs_z}
            ciLo={D.q4_deviation_ci95[0]}
            ciHi={D.q4_deviation_ci95[1]}
            meanV={D.q4_deviation_mean}
          />
        </tbody>
      </table>

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
        Both channels fail to reject the mean-zero null on all three tests (sign-test p&nbsp;&gt;&nbsp;0.05,
        |runs z|&nbsp;&lt;&nbsp;1.96, 95% mean CI contains 0), while the ensemble-mean slopes m3&nbsp;~
        &nbsp;{D.ensemble_mean_slope_m3} and m4&nbsp;~&nbsp;{D.ensemble_mean_slope_m4} round to exactly
        {' '}{'{3, 4}'}. The three hand-picked sign flips of imp-34689/imp-34712/imp-34730 were not a
        small-sample fluke.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page presenting the imp-34751
        per-footing literals verbatim (no new computation). A CI containing 0 is failure to reject, NOT
        acceptance; this is a cross-check on the INHERITED imp-3220/imp-3406 surrogate, not a rehabilitation
        of it. The -2 asymptote and C_C&nbsp;=&nbsp;(1/8)&radic;(3&pi;) (imp-2714) ansatz are UNTOUCHED; the
        C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes
        no bound; no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
