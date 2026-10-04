import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34735_DP_STAR_PROBE_BAND_CROSSOVER_N } from '../data/imp-34735-dp-star-probe-band-crossover-N.js';
import { IMP34754_DP_STAR_PROBE_BAND_RATIO_DEEP_TAIL } from '../data/imp-34754-dp-star-probe-band-ratio-deep-tail.js';
import { ED } from '../styles/tokens.js';

const NEAR = IMP34735_DP_STAR_PROBE_BAND_CROSSOVER_N;
const FAR = IMP34754_DP_STAR_PROBE_BAND_RATIO_DEEP_TAIL;

// -- full-tail ladder: imp-34735's 1e13..1e100 rows followed by imp-34754's 1e100..1e300 rows
//    (the shared 1e100 rung is de-duplicated), so the combined curve spans the whole validated range. --
const FULL_LADDER = [...NEAR.ratio_ladder, ...FAR.ratio_ladder.slice(1)];
const LOG10N_CROSSOVER_FINER = FAR.log10N_crossover_finer_closed_form_upper_estimate; // ~374.63

// -- edge-ratio ladder: x = log10(N), y = dp*(N)/band, N = 1e13..1e300. Both curves rise monotonically
// and remain below the y = 1 no-crossing boundary across the whole combined ladder, with the finer edge
// reaching ~81% of the way to corruption at the N = 1e300 ceiling. --
function FullTailEdgeRatioChart() {
  const rows = FULL_LADDER;
  const xs = rows.map((r) => Math.log10(Number(r.N)));
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
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${sx(Math.log10(Number(r.N))).toFixed(2)} ${sy(r.ratio_to_finer_0p05).toFixed(2)}`)
    .join(' ');
  const coarserPath = rows
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${sx(Math.log10(Number(r.N))).toFixed(2)} ${sy(r.ratio_to_coarser_0p1).toFixed(2)}`)
    .join(' ');

  const lastRow = rows[rows.length - 1];

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
          <circle cx={sx(Math.log10(Number(r.N)))} cy={sy(r.ratio_to_finer_0p05)} r={3.2} fill={ED.series2} stroke={ED.paper} strokeWidth={0.5} />
          <circle cx={sx(Math.log10(Number(r.N)))} cy={sy(r.ratio_to_coarser_0p1)} r={3.2} fill={ED.series1} stroke={ED.paper} strokeWidth={0.5} />
        </g>
      ))}

      {/* the ~81%-of-corruption landmark: the finer edge at the N = 1e300 ceiling */}
      <circle cx={sx(Math.log10(Number(lastRow.N)))} cy={sy(lastRow.ratio_to_finer_0p05)} r={5.5} fill="none" stroke={ED.brassDeco} strokeWidth={1.5} />
      <text x={sx(Math.log10(Number(lastRow.N))) - 6} y={sy(lastRow.ratio_to_finer_0p05) - 10} textAnchor="end" fill={ED.brass} fontSize={11}>
        ~{Math.round(lastRow.ratio_to_finer_0p05 * 100)}% of the way to corruption (N=1e300)
      </text>

      <text x={padL + 8} y={padT + 16} fill={ED.series2} fontSize={11}>
        dp*(N)/0.05 (finer edge, crossed first) &rarr; ~{lastRow.ratio_to_finer_0p05} at 1e300
      </text>
      <text x={padL + 8} y={padT + 32} fill={ED.series1} fontSize={11}>
        dp*(N)/0.1 (coarser edge, crossed last) &rarr; ~{lastRow.ratio_to_coarser_0p1} at 1e300
      </text>
    </svg>
  );
}

export default function Imp34782DpStarFullTailEdgeRatioViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="dp* / Probe-Band Edge-Ratio Ladder, Full Tail N = 1e13..1e300 (imp-34782 / imp-34754)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34735 tracked the imp-34691 edge ratios dp*(N)/0.05 (finer, crossed first) and
        dp*(N)/0.1 (coarser, crossed last) from N&nbsp;=&nbsp;1e13 to their 1e100 ceiling; imp-34754
        carried the identical exact-model ladder another 200 decades deeper, to N&nbsp;=&nbsp;1e300. Stitched
        together, the combined ladder below shows both ratios rising monotonically and WITHOUT saturation
        across the whole validated range: the finer edge climbs from ~{NEAR.ratio_ladder[0].ratio_to_finer_0p05}
        at 1e13 to ~{FAR.finer_ratio_1e300} at 1e300 -- still short of the ratio&nbsp;=&nbsp;1 no-crossing
        boundary, but now ~{Math.round(FAR.finer_fraction_to_corruption_1e300 * 100)}% of the way there,
        versus only ~17% at the earlier 1e100 ceiling. The finer-edge crossing itself remains an
        extrapolation, closed-form-estimated at N&nbsp;~&nbsp;1e{LOG10N_CROSSOVER_FINER} (and, per imp-34754,
        somewhat EARLIER than that since the exact ladder runs above the closed form in the deep tail).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Combined edge-ratio ladder vs the y = 1 no-crossing boundary
      </p>
      <FullTailEdgeRatioChart />

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
          {FULL_LADDER.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{Number(r.N).toExponential(0)}</td>
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
        No crossing anywhere below N&nbsp;=&nbsp;1e300: the finer edge reaches
        ~{FAR.finer_ratio_1e300} (~{Math.round(FAR.finer_fraction_to_corruption_1e300 * 100)}% of the way to
        the ratio&nbsp;=&nbsp;1 boundary) and the coarser edge ~{FAR.coarser_ratio_1e300}. But the margin
        the imp-34735 no-crossing verdict rested on at 1e100 (~17%) has largely closed by 1e300, and the
        exact ladder runs up to ~{((FAR.exact_over_asymptote_1e300 - 1) * 100).toFixed(1)}% ABOVE the
        imp-34711 closed-form asymptote in the deep tail, so the true finer-edge crossover sits SOMEWHAT
        EARLIER than the closed-form landmark N&nbsp;~&nbsp;1e{LOG10N_CROSSOVER_FINER} -- still hundreds of
        decades beyond N&nbsp;=&nbsp;1e300, the numerically reliable ceiling of the exact ladder.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page stitching the imp-34735
        (1e13..1e100) and imp-34754 (1e100..1e300) exact-model edge-ratio ladders together (imported
        literals, no new computation); establishes no new numerical claim. q1..q3 are inherited central
        differences on the imp-3220/imp-3406 component model, not fresh closed forms, so the ratio ladder is
        a property of that inherited model, not an independent physical claim. C_C&nbsp;=&nbsp;(1/8)&radic;(3&pi;)
        (imp-2714) and C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched;
        changes no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
