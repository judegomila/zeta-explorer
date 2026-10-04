import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34728_Q3_FAR_TAIL_STENCIL_CROSSVALIDATION } from '../data/imp-34728-q3-far-tail-stencil-crossvalidation.js';
import { ED } from '../styles/tokens.js';

const M = IMP34728_Q3_FAR_TAIL_STENCIL_CROSSVALIDATION;

// -- log-log ladder: log10(dp*) vs log10(p), p = log N, for BOTH independent stencils on the identical
// q(p) = log E_coll footing. A stencil-invariant (4/3) growth law is two near-parallel lines; the only
// visible gap is the constant vertical offset from the analytic prefactor ratio W_max/(2*denom). --
function TwoStencilLadderChart() {
  const sample = (row) => [
    { N: 1e15, dp_star: row.dp_star_at_1e15 },
    { N: 1e29, dp_star: row.dp_star_at_1e29 },
    { N: 1e100, dp_star: row.dp_star_at_1e100 },
  ];
  const pts9 = sample(M.stencil_9pt);
  const pts7 = sample(M.stencil_7pt);

  const pOf = (N) => Math.log(N); // p = log N
  const xOf = (N) => Math.log10(pOf(N));
  const yOf = (dp) => Math.log10(dp);

  const allXs = [...pts9, ...pts7].map((pt) => xOf(pt.N));
  const allYs = [...pts9, ...pts7].map((pt) => yOf(pt.dp_star));
  const xMin = Math.min(...allXs);
  const xMax = Math.max(...allXs);
  const yMin = Math.min(...allYs);
  const yMax = Math.max(...allYs);

  const svgW = 680;
  const svgH = 320;
  const padL = 64;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const sx = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const pathOf = (pts) =>
    pts
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${sx(xOf(pt.N)).toFixed(2)} ${sy(yOf(pt.dp_star)).toFixed(2)}`)
      .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={11}>
        log10(p), p = log N
      </text>
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={11}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        log10(dp*)
      </text>

      <path d={pathOf(pts9)} fill="none" stroke={ED.series1} strokeWidth={1.5} />
      {pts9.map((pt) => (
        <circle key={`9-${pt.N}`} cx={sx(xOf(pt.N))} cy={sy(yOf(pt.dp_star))} r={3.5} fill={ED.series1} stroke={ED.paper} strokeWidth={0.5} />
      ))}

      <path d={pathOf(pts7)} fill="none" stroke={ED.series2} strokeWidth={1.5} strokeDasharray="6 4" />
      {pts7.map((pt) => (
        <circle key={`7-${pt.N}`} cx={sx(xOf(pt.N))} cy={sy(yOf(pt.dp_star))} r={3.5} fill={ED.series2} stroke={ED.paper} strokeWidth={0.5} />
      ))}

      <text x={padL + 8} y={padT + 16} fill={ED.series1} fontSize={11}>
        {M.stencil_9pt.stencil} : beta ~ {M.stencil_9pt.fitted_exponent_beta}
      </text>
      <text x={padL + 8} y={padT + 32} fill={ED.series2} fontSize={11}>
        {M.stencil_7pt.stencil} : beta ~ {M.stencil_7pt.fitted_exponent_beta}
      </text>
    </svg>
  );
}

// -- exponent bars: both stencils' fitted beta against the exact 4/3 target, showing the ~1e-4 delta
// between stencils is dwarfed by the shared ~6e-3 finite-p gap to 4/3. --
function ExponentBars() {
  const svgW = 660;
  const svgH = 130;
  const padL = 200;
  const padR = 40;
  const barH = 24;
  const gap = 16;
  const scaleMin = 1.3;
  const scaleMax = 4 / 3 + 0.01;

  const rows = [
    { label: `${M.stencil_9pt.stencil}`, beta: M.stencil_9pt.fitted_exponent_beta, color: ED.series1 },
    { label: `${M.stencil_7pt.stencil}`, beta: M.stencil_7pt.fitted_exponent_beta, color: ED.series2 },
    { label: 'exact target 4/3', beta: M.target_exponent_4over3, color: ED.inkSoft },
  ];

  const cW = svgW - padL - padR;
  const xOf = (beta) => ((beta - scaleMin) / (scaleMax - scaleMin)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => {
        const y = 8 + i * (barH + gap);
        return (
          <g key={r.label}>
            <text x={padL - 10} y={y + barH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={11}>
              {r.label}
            </text>
            <rect x={padL} y={y} width={cW} height={barH} fill="none" stroke={ED.rule} strokeWidth={1} />
            <rect x={padL} y={y} width={Math.max(xOf(r.beta), 2)} height={barH} fill={r.color} />
            <text x={padL + xOf(r.beta) + 8} y={y + barH / 2 + 4} fill={r.color} fontSize={11} fontWeight={700}>
              {r.beta}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp34767FarTailTwoStencilCrossvalidationViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Far-Tail Two-Stencil Cross-Validation of dp*(N) (imp-34767 / imp-34728)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34728 re-ran the imp-34711 smallest-usable-step ladder dp*(N) on an INDEPENDENT 4th-order
        7-point antisymmetric q3 stencil, cross-validating it against the inherited 6th-order 9-point
        stencil on the identical q(p) = log&nbsp;E_coll footing. The fitted (log&nbsp;N)^(4/3) growth
        exponent reproduces to |&Delta;&beta;|&nbsp;=&nbsp;{M.fitted_exponent_delta} between stencils
        &mdash; about 70&times; smaller than the ~6e-3 shared shortfall from the exact 4/3 &mdash; so the
        exponent is a property of q(p) and q3(p), not the difference scheme. Only the roundoff prefactor
        shifts, by the exact analytic ratio W_max/(2&middot;denom):{' '}
        {M.prefactor_ratio_7_over_9}, rescaling the 7-point floor a uniform{' '}
        {M.floor_scale_7_over_9_cbrt}&times; (7.2% lower) copy of the 9-point ladder.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        dp*(N) ladder, both stencils, identical q(p) footing
      </p>
      <TwoStencilLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        Fitted growth exponent beta vs the exact 4/3 target
      </p>
      <ExponentBars />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>stencil</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>W_max/denom</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>beta</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>q3&middot;p&sup3; @1e60</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dp* @1e15</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dp* @1e29</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dp* @1e100</th>
          </tr>
        </thead>
        <tbody>
          {[M.stencil_9pt, M.stencil_7pt].map((row) => (
            <tr key={row.stencil} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.stencil}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.wMax}/{row.denom}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.fitted_exponent_beta}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.q3_times_p3_deep_1e60}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.dp_star_at_1e15}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.dp_star_at_1e29}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.dp_star_at_1e100}</td>
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
        Exponent delta between stencils: {M.fitted_exponent_delta} (stencil-invariant:{' '}
        {String(M.exponent_stencil_invariant)}). q3&middot;p&sup3; delta at N=1e60:{' '}
        {M.q3_times_p3_delta_1e60} (stencil-invariant: {String(M.q3_times_p3_stencil_invariant)}). The
        empirical dp* ratio at N=1e100 ({M.empirical_floor_scale_at_1e100}) matches the analytic cube-root
        prefactor ratio ({M.floor_scale_7_over_9_cbrt}): {String(M.floor_scale_matches_prefactor)}.
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
        imp-34728 two-stencil cross-validation (imported literals, no new computation). q1..q3 remain
        inherited central differences, not fresh analytic closed forms, so the far-tail ladder is a
        property of the inherited imp-3220/imp-3406 component model, not an independent physical claim.
        C_C&nbsp;=&nbsp;(1/8)&radic;(3&pi;) (imp-2714) and the C_mb GUE-conditional share per imp-486 are
        UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; establishes no operator
        positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
