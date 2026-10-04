import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import CrossoverMapClusterCaveatBanner from '../components/CrossoverMapClusterCaveatBanner.jsx';
import { IMP34731_CROSSOVER_MAP_SECOND_DERIVATIVE_BOUND } from '../data/imp-34731-crossover-map-second-derivative-bound.js';
import { ED } from '../styles/tokens.js';

const M = IMP34731_CROSSOVER_MAP_SECOND_DERIVATIVE_BOUND;

// -- |g_double_prime(N)| monotone-decreasing curve on I = [1e9, 1e10] with the sharp
// left-endpoint bound B and the five central-difference probe points overlaid. --
function GDoublePrimeCurveChart() {
  const bound = M.bound;
  const probes = M.probes;

  const N_LO = 1e9;
  const N_HI = 1e10;

  const xs = probes.map((p) => Math.log10(p.N));
  const ys = probes.map((p) => Math.abs(p.closed));

  const svgW = 680;
  const svgH = 320;
  const padL = 64;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = Math.log10(N_LO);
  const xMax = Math.log10(N_HI);
  const yMax = bound.sup_bound_B * 1.08;
  const sx = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y) => padT + plotH - (y / yMax) * plotH;

  const probePath = xs
    .map((x, i) => `${i === 0 ? 'M' : 'L'} ${sx(x).toFixed(2)} ${sy(ys[i]).toFixed(2)}`)
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={11}>
        log10(N)
      </text>
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={11}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        |g_double_prime(N)|
      </text>

      {/* sharp left-endpoint bound B */}
      <line
        x1={sx(xMin)}
        y1={sy(bound.sup_bound_B)}
        x2={sx(xMin)}
        y2={padT + plotH}
        stroke={ED.brassDeco}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <text x={sx(xMin) + 6} y={sy(bound.sup_bound_B) + 12} fill={ED.brass} fontSize={11}>
        B ~ {bound.sup_bound_B.toExponential(4)} (sharp sup, N=1e9)
      </text>

      <path d={probePath} fill="none" stroke={ED.series1} strokeWidth={1.5} />
      {probes.map((p) => (
        <g key={p.N}>
          <circle cx={sx(Math.log10(p.N))} cy={sy(Math.abs(p.closed))} r={3.4} fill={ED.series1} stroke={ED.paper} strokeWidth={0.5} />
          <circle cx={sx(Math.log10(p.N))} cy={sy(Math.abs(p.fd))} r={2} fill={ED.series2} stroke="none" />
        </g>
      ))}

      <text x={padL + 8} y={padT + 16} fill={ED.series1} fontSize={11}>
        closed form -4 pi^2 K (u+1)/(T^2 u^3) &mdash; monotone decreasing on I
      </text>
      <text x={padL + 8} y={padT + 32} fill={ED.series2} fontSize={11}>
        central-difference sample (5 probes, max rel err {M.maxProbeRelErr})
      </text>
    </svg>
  );
}

export default function Imp34759CrossoverGppCeilingViz() {
  const bound = M.bound;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Crossover-Map g'' Ceiling: Monotone-Decreasing Bound on [1e9,1e10] (imp-34759 / imp-34731)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34731 derived the closed-form second derivative of the inherited imp-33723 crossover map
        g(N)&nbsp;=&nbsp;K&nbsp;log&nbsp;T0(N): g''(N)&nbsp;=&nbsp;-4&pi;<sup>2</sup>K(u+1)/(T<sup>2</sup>u<sup>3</sup>),
        T&nbsp;=&nbsp;T0(N), u&nbsp;=&nbsp;log(T/2&pi;). Both T0 and u increase on
        I&nbsp;=&nbsp;[1e9,1e10], so |g''| is monotone decreasing and its supremum sits at the left
        endpoint N&nbsp;=&nbsp;1e9: B&nbsp;~&nbsp;{bound.sup_bound_B.toExponential(4)}, with
        B/max<sub>I</sub>|g''|&nbsp;=&nbsp;{bound.bound_tightness_B_over_max.toFixed(6)} (sharp, not
        loose). Five central-difference probes cross-check the closed form to
        {' '}&lt;&nbsp;{M.maxProbeRelErr} relative.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        |g_double_prime(N)| at the five probe points vs the sharp left-endpoint bound
      </p>
      <GDoublePrimeCurveChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>closed form</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>central difference</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rel err</th>
          </tr>
        </thead>
        <tbody>
          {M.probes.map((p) => (
            <tr key={p.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.N.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.closed.toExponential(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.fd.toExponential(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.rel_err.toExponential(3)}</td>
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
        Bound anatomy at N&nbsp;=&nbsp;1e9: K&nbsp;=&nbsp;{bound.K_amplitude.toExponential(4)},
        T0&nbsp;=&nbsp;{bound.T0_at_1e9.toExponential(4)}, u&nbsp;=&nbsp;{bound.u_at_1e9.toExponential(4)},
        giving the sharp supremum B&nbsp;~&nbsp;{bound.sup_bound_B.toExponential(4)}, matched by the
        101-point log-grid maximum ({bound.max_abs_on_grid.toExponential(4)} at
        N&nbsp;~&nbsp;{bound.argmax_N.toExponential(3)}) and covered with under 1% margin by the
        conservative hand-roundable ceiling {bound.conservative_ceiling}.
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
        imp-34731 closed-form g'' ceiling (imported literals, no new computation) for the INHERITED
        imp-3220/imp-3406 surrogate crossover map. <CrossoverMapClusterCaveatBanner />
      </div>
    </div>
  );
}
