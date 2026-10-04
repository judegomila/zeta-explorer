import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34735_DP_STAR_PROBE_BAND_CROSSOVER_N } from '../data/imp-34735-dp-star-probe-band-crossover-N.js';
import { ED } from '../styles/tokens.js';

const M = IMP34735_DP_STAR_PROBE_BAND_CROSSOVER_N;

// -- edge-ratio ladder: x = log10(N), y = dp*(N)/band. Both curves rise monotonically but stay
// below the y = 1 no-crossing boundary across the whole 1e13..1e100 imp-34735 table. --
function EdgeRatioLadderChart() {
  const rows = M.ratio_ladder;
  const xs = rows.map((r) => Math.log10(r.N));
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);

  const svgW = 680;
  const svgH = 320;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const yMax = 1.08; // headroom above the y = 1 no-crossing boundary
  const sx = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y) => padT + plotH - (y / yMax) * plotH;

  const finerPath = rows
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${sx(Math.log10(r.N)).toFixed(2)} ${sy(r.ratio_to_finer_0p05).toFixed(2)}`)
    .join(' ');
  const coarserPath = rows
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${sx(Math.log10(r.N)).toFixed(2)} ${sy(r.ratio_to_coarser_0p1).toFixed(2)}`)
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={11}>
        log10(N)
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={11}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        dp*(N) / probe step
      </text>

      {/* y = 1 no-crossing boundary */}
      <line x1={padL} y1={sy(1)} x2={padL + plotW} y2={sy(1)} stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="6 4" />
      <text x={padL + plotW - 4} y={sy(1) - 6} textAnchor="end" fill={ED.brass} fontSize={11}>
        ratio = 1 (trust-boundary crossing)
      </text>

      <path d={coarserPath} fill="none" stroke={ED.series1} strokeWidth={1.5} />
      <path d={finerPath} fill="none" stroke={ED.series2} strokeWidth={1.5} />
      {rows.map((r) => (
        <g key={r.N}>
          <circle cx={sx(Math.log10(r.N))} cy={sy(r.ratio_to_finer_0p05)} r={3.2} fill={ED.series2} stroke={ED.paper} strokeWidth={0.5} />
          <circle cx={sx(Math.log10(r.N))} cy={sy(r.ratio_to_coarser_0p1)} r={3.2} fill={ED.series1} stroke={ED.paper} strokeWidth={0.5} />
        </g>
      ))}

      <text x={padL + 8} y={padT + 16} fill={ED.series2} fontSize={11}>
        dp*(N)/0.05 (finer edge, crossed first) &rarr; ~{M.max_ratio_to_finer_0p05} at 1e100
      </text>
      <text x={padL + 8} y={padT + 32} fill={ED.series1} fontSize={11}>
        dp*(N)/0.1 (coarser edge, crossed last) &rarr; ~{M.max_ratio_to_coarser_0p1} at 1e100
      </text>
    </svg>
  );
}

export default function Imp34758DpStarProbeBandRatioViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="dp* / Probe-Band Edge-Ratio Ladder, N = 1e13..1e100 (imp-34758 / imp-34735)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34735 asked whether the imp-34711 rising smallest-usable step dp*(N) ever climbs up to the
        FIXED imp-34691 physical-q3 probe band (dp&nbsp;=&nbsp;0.1/0.05) below N&nbsp;=&nbsp;1e100 -- an
        internal trust-boundary crossing that would make the measured q3 pure roundoff. Both exact-model
        edge ratios dp*(N)/0.05 (finer, crossed first) and dp*(N)/0.1 (coarser, crossed last) rise
        monotonically across the whole 1e13..1e100 ladder but stay far below the ratio&nbsp;=&nbsp;1
        boundary, reaching only ~{M.max_ratio_to_finer_0p05} and ~{M.max_ratio_to_coarser_0p1} respectively
        at N&nbsp;=&nbsp;1e100: NO crossing occurs anywhere in the validated range.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Edge-ratio ladder vs the y = 1 no-crossing boundary
      </p>
      <EdgeRatioLadderChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dp*(N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>ratio to 0.05 (finer)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>ratio to 0.1 (coarser)</th>
          </tr>
        </thead>
        <tbody>
          {M.ratio_ladder.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.dp_star}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.ratio_to_finer_0p05}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.ratio_to_coarser_0p1}</td>
            </tr>
          ))}
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
        No crossing below N&nbsp;=&nbsp;1e100: at that ceiling dp*(N) is still ~6x below the finer 0.05
        probe step and ~12x below the coarser 0.1 step. Solving the imp-34711 closed form for the
        crossover puts the finer edge at N&nbsp;~&nbsp;1e{M.log10N_crossover_finer_0p05} and the coarser
        edge at N&nbsp;~&nbsp;1e{M.log10N_crossover_coarser_0p1} -- both hundreds of decades beyond the
        validated window, so those crossovers are asymptotic extrapolations, not measured landmarks.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page presenting the
        imp-34735 exact-model edge-ratio ladder (imported literals, no new computation); establishes no
        new numerical claim. q1..q3 are inherited central differences on the imp-3220/imp-3406 component
        model, not fresh closed forms, so the ratio ladder is a property of that inherited model, not an
        independent physical claim. C_C&nbsp;=&nbsp;(1/8)&radic;(3&pi;) (imp-2714) and C_mb GUE-conditional
        per imp-486 untouched; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; establishes no
        operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
