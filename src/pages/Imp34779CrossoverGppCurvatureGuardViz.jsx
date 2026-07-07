import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34757_CROSSOVER_GPP_DENSE_CROSS_CHECK } from '../data/imp-34757-crossover-gpp-dense-cross-check.js';

const M = IMP34757_CROSSOVER_GPP_DENSE_CROSS_CHECK;

// -- per-band bars: left-endpoint closed-form bound B(band) vs the measured max |g''| on that band,
// on a log10 scale. The two bars are visually identical per band (tightness ~1.000) -- the left
// endpoint IS the supremum, confirmed by the D2 monotonicity check on a dense 41-point grid. --
function BandBoundVsMaxChart() {
  const svgW = 660;
  const svgH = 210;
  const padL = 150;
  const padR = 40;
  const barH = 16;
  const rowGap = 14;
  const groupGap = 26;

  const logs = M.bands.flatMap((b) => [Math.log10(b.left_endpoint_bound_B), Math.log10(b.max_abs_on_band)]);
  const scaleMin = Math.min(...logs) - 0.3;
  const scaleMax = Math.max(...logs) + 0.3;
  const cW = svgW - padL - padR;
  const xOf = (log10v) => ((log10v - scaleMin) / (scaleMax - scaleMin)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {M.bands.map((b, i) => {
        const yGroup = 10 + i * (2 * barH + rowGap + groupGap);
        const label = `[${b.band[0].toExponential(0)}, ${b.band[1].toExponential(0)}]`;
        return (
          <g key={label}>
            <text x={padL - 10} y={yGroup + barH + 2} textAnchor="end" fill="#94a3b8" fontSize={11}>
              {label}
            </text>
            <rect x={padL} y={yGroup} width={cW} height={barH} fill="none" stroke="#334155" strokeWidth={1} />
            <rect
              x={padL}
              y={yGroup}
              width={Math.max(xOf(Math.log10(b.left_endpoint_bound_B)), 2)}
              height={barH}
              fill="#38bdf8"
            />
            <text x={padL + xOf(Math.log10(b.left_endpoint_bound_B)) + 8} y={yGroup + barH - 3} fill="#38bdf8" fontSize={10}>
              B = {b.left_endpoint_bound_B}
            </text>
            <rect
              x={padL}
              y={yGroup + barH + rowGap}
              width={cW}
              height={barH}
              fill="none"
              stroke="#334155"
              strokeWidth={1}
            />
            <rect
              x={padL}
              y={yGroup + barH + rowGap}
              width={Math.max(xOf(Math.log10(b.max_abs_on_band)), 2)}
              height={barH}
              fill="#f87171"
            />
            <text
              x={padL + xOf(Math.log10(b.max_abs_on_band)) + 8}
              y={yGroup + 2 * barH + rowGap - 3}
              fill="#f87171"
              fontSize={10}
            >
              max = {b.max_abs_on_band}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// -- relative disagreement per band, log-scaled: the dense 63-probe closed-form-vs-central-difference
// check stays under 1e-5 relative everywhere, well below the y=1e-5 reference line. --
function RelErrChart() {
  const svgW = 660;
  const svgH = 220;
  const padL = 64;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const errs = M.bands.map((b) => Math.log10(b.max_closed_vs_fd_rel_err));
  const threshold = Math.log10(1e-5);
  const yMin = Math.min(...errs, threshold) - 0.4;
  const yMax = Math.max(...errs, threshold) + 0.4;

  const barW = plotW / (M.bands.length * 2);
  const sy = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;
  const thresholdY = sy(threshold);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke="#334155" strokeWidth={1} />
      <line x1={padL} x2={padL + plotW} y1={thresholdY} y2={thresholdY} stroke="#fbbf24" strokeWidth={1} strokeDasharray="5 4" />
      <text x={padL + plotW - 4} y={thresholdY - 6} textAnchor="end" fill="#fbbf24" fontSize={10}>
        1e-5 threshold
      </text>
      {M.bands.map((b, i) => {
        const x = padL + i * barW * 2 + barW * 0.5;
        const yTop = sy(Math.log10(b.max_closed_vs_fd_rel_err));
        const label = `[${b.band[0].toExponential(0)}, ${b.band[1].toExponential(0)}]`;
        return (
          <g key={label}>
            <rect x={x} y={yTop} width={barW} height={padT + plotH - yTop} fill="#38bdf8" />
            <text x={x + barW / 2} y={padT + plotH + 16} textAnchor="middle" fill="#94a3b8" fontSize={10}>
              {label}
            </text>
            <text x={x + barW / 2} y={yTop - 6} textAnchor="middle" fill="#e2e8f0" fontSize={10}>
              {b.max_closed_vs_fd_rel_err}
            </text>
          </g>
        );
      })}
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={11}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        log10(max relative disagreement)
      </text>
    </svg>
  );
}

export default function Imp34779CrossoverGppCurvatureGuardViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Crossover-Map Curvature Guard: Closed Form vs Central Difference (imp-34779 / imp-34757)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34757 extended the imp-34731 closed-form-vs-central-difference cross-check of the inherited
        crossover-map second derivative g&Prime;(N) = -4&pi;&sup2;K(u+1)/(T&sup2;u&sup3) from 5 probes on a
        single band to {M.totalProbes} probes across three post-peak bands. Over all {M.totalProbes} probes
        the closed form agrees with a second-order central difference to &lt;&nbsp;1e-5 relative everywhere
        (overall max {M.overallMaxRelErr}), and on every band |g&Prime;| stays monotone decreasing so the
        left-endpoint bound B(band) is the sharp supremum (tightness deviation {M.maxTightnessDeviation}).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Left-endpoint bound B(band) vs measured band maximum |g&Prime;| (log10 scale, per band)
      </p>
      <BandBoundVsMaxChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        Max closed-form-vs-central-difference relative disagreement per band
      </p>
      <RelErrChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>band</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>B(band)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>max |g&Prime;|</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>B/max</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>monotone</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>max rel err</th>
          </tr>
        </thead>
        <tbody>
          {M.bands.map((b) => (
            <tr key={b.band.join('-')} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>
                [{b.band[0].toExponential(0)}, {b.band[1].toExponential(0)}]
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{b.left_endpoint_bound_B}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{b.max_abs_on_band}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{b.tightness_B_over_max}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{String(b.monotone_decreasing)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{b.max_closed_vs_fd_rel_err}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
        }}
      >
        Overall max relative disagreement across all {M.totalProbes} probes: {M.overallMaxRelErr}. All
        bands monotone decreasing: {String(M.allBandsMonotone)}. Max sharp-supremum tightness deviation:
        {' '}{M.maxTightnessDeviation}.
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> Viz-only page presenting the imp-34757
        dense cross-check (imported literals, no new computation). This guards the curvature bound of the
        INHERITED imp-3220/imp-3406 surrogate crossover map; it changes no bound. The C_mb GUE-conditional
        share per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; establishes no operator
        positivity; no RH verdict, NO QED. Platt-Trudgian Lambda&nbsp;&le;&nbsp;0.2 remains SOTA.
      </div>
    </div>
  );
}
