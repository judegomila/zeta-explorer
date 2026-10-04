import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35239_MIN_GAP_PREFACTOR_REAL_SPACING_REASSESSMENT } from '../data/imp-35239-min-gap-prefactor-real-spacing-reassessment.js';
import { ED } from '../styles/tokens.js';

// Baked literals imported verbatim from the imp-35239 data module; no new
// computation is performed here (viz/UX only).
const { advantageRows: ADV_ROWS, realOrdinateGrowth: GROWTH } =
  IMP35239_MIN_GAP_PREFACTOR_REAL_SPACING_REASSESSMENT;

function AdvantageChart() {
  const svgW = 700;
  const padL = 66;
  const padR = 24;
  const padT = 44;
  const padB = 48;
  const plotW = svgW - padL - padR;
  const plotH = 280;
  const svgH = padT + plotH + padB;

  // log-log axes: N from 200 to 1e6 (the baked N_SWEEP), advantage from ~10 to ~2e6.
  const xMin = Math.log10(200);
  const xMax = Math.log10(1e6);
  const yMin = Math.log10(10);
  const yMax = Math.log10(2e6);

  const xOf = (N) => padL + ((Math.log10(N) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - yMin) / (yMax - yMin)) * plotH;

  const unitPath = ADV_ROWS.map(
    (r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.N)} ${yOf(r.strip_over_gap_unit)}`,
  ).join(' ');
  const realPath = ADV_ROWS.map(
    (r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.N)} ${yOf(r.strip_over_gap_real)}`,
  ).join(' ');

  const xTicks = [200, 1e3, 1e4, 1e6];
  const yTicks = [10, 100, 1e3, 1e4, 1e5, 1e6];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 26} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Min-gap-over-strip advantage L_strip / L_gap: unit spacing (2N) vs real spacing (~2N^0.36)
      </text>

      {unitPath && <path d={unitPath} fill="none" stroke={ED.series2} strokeWidth={2} strokeDasharray="4 3" />}
      {realPath && <path d={realPath} fill="none" stroke={ED.series5} strokeWidth={2.25} />}

      {ADV_ROWS.map((r) => (
        <circle key={`unit-${r.N}`} cx={xOf(r.N)} cy={yOf(r.strip_over_gap_unit)} r={3} fill={ED.series2} />
      ))}
      {ADV_ROWS.map((r) => (
        <circle key={`real-${r.N}`} cx={xOf(r.N)} cy={yOf(r.strip_over_gap_real)} r={3.5} fill={ED.brassDeco} />
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((N) => (
        <text key={N} x={xOf(N)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {N.toExponential(0)}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        N (log scale)
      </text>

      {yTicks.map((v) => (
        <text key={v} x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v.toExponential(0)}
        </text>
      ))}

      <g>
        <line x1={padL + 4} y1={padT - 12} x2={padL + 24} y2={padT - 12} stroke={ED.series2} strokeWidth={2} strokeDasharray="4 3" />
        <text x={padL + 30} y={padT - 8} fill={ED.series2} fontSize={8.5}>
          unit spacing: exact 2N (p_gap = 0)
        </text>
        <line x1={padL + 280} y1={padT - 12} x2={padL + 300} y2={padT - 12} stroke={ED.series5} strokeWidth={2.25} />
        <text x={padL + 306} y={padT - 8} fill={ED.series5} fontSize={8.5}>
          real spacing: ~2N^0.36 (frac 0.5, p_gap~0.645)
        </text>
      </g>
    </svg>
  );
}

export default function Imp35296MinGapStripAdvantageViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Min-Gap-vs-Strip Advantage Factor on Real Ordinates (imp-35296)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-35239 reassessment splits the imp-35214 Q2 claim into a STRUCTURAL advantage
        that survives real zero spacings and a NUMERIC advantage that does not. On unit spacing
        the min-gap route beats the imp-35196 strip route by an exact factor 2N (p_gap = 0). On
        REAL Riemann zero ordinates the background-field prefactor beta(N) grows sub-linearly
        instead (p_gap&nbsp;&sim;&nbsp;0.57&ndash;0.65 across the two matched fractions measured
        in imp-35218 R1), so the advantage factor 2N<sup>1&minus;p_gap</sup> still grows without
        bound but the slope on this log&ndash;log plot visibly degrades from 1 to&nbsp;
        &sim;0.36&ndash;0.43.
      </p>

      <AdvantageChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>unit spacing: 2N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>real spacing: ~2N^0.36</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>real / unit</th>
          </tr>
        </thead>
        <tbody>
          {ADV_ROWS.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.strip_over_gap_unit.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: 'var(--series-3)' }}>
                {r.strip_over_gap_real.toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {(r.strip_over_gap_real / r.strip_over_gap_unit).toExponential(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        Both curves grow without bound in N &mdash; the min-gap route never stops beating the strip
        route on real spacings (advantage exponent 1&minus;p_gap&nbsp;&sim;&nbsp;
        {GROWTH.advantage_exponent_frac05}&ndash;{GROWTH.advantage_exponent_frac005} &gt; 0, imp-35239).
        But the real-spacing curve sits strictly below the unit-spacing line at every N&nbsp;&gt;&nbsp;1
        and the gap between them widens with N, visualizing exactly how the imp-35214 Q2
        &quot;N-uniform prefactor&quot; rating was a fixed-unit-scale artifact (imp-35218 R1):
        the genuine structural edge survives, but degraded.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page reusing the
        imp-35239 baked advantageRows/realOrdinateGrowth literals verbatim (no new computation).
        Assessment only; the residual missing input is still an a-priori g_min(t)&nbsp;&gt;&nbsp;0
        whole-trajectory bound (imp-35167 M2/M5), which stays OPEN; C_mb GUE-conditional (imp-486)
        untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
