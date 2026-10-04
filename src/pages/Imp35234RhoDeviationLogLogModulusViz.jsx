import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT } from '../data/imp-35193-rho-convergence-rate-modulus-measurement.js';
import { ED } from '../styles/tokens.js';

const D = IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT;
const K = D.kAtThreeHalvesTail; // ~0.4001, prefactor read at the tail rung

// Log-log chart: dev(eps) = |rho(eps) - 2/3| against eps, with the K eps^{3/2} prefactor line overlaid.
function DeviationLogLogChart() {
  const svgW = 680;
  const padL = 54;
  const padR = 20;
  const padT = 44;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const logEps = D.ladder.map((r) => Math.log10(r.y_N_sharp));
  const logDev = D.ladder.map((r) => Math.log10(r.deviation));
  const xMin = Math.min(...logEps);
  const xMax = Math.max(...logEps);
  const yMin = Math.min(...logDev) - 0.3;
  const yMax = Math.max(...logDev) + 0.3;
  const xOf = (lx) => padL + ((lx - xMin) / (xMax - xMin)) * plotW;
  const yOf = (ly) => padT + plotH - ((ly - yMin) / (yMax - yMin)) * plotH;

  const devPath = D.ladder
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(Math.log10(r.y_N_sharp))} ${yOf(Math.log10(r.deviation))}`)
    .join(' ');
  // Reference line: dev = K * eps^{3/2}  =>  log10(dev) = log10(K) + 1.5 * log10(eps).
  const refAt = (lx) => Math.log10(K) + 1.5 * lx;
  const refPath = `M ${xOf(xMin)} ${yOf(refAt(xMin))} L ${xOf(xMax)} ${yOf(refAt(xMax))}`;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 26} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        log10 dev(eps) = log10|rho(eps) - 2/3| vs log10 eps, N = 1e3..1e7
      </text>
      {[yMin, (yMin + yMax) / 2, yMax].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      <path d={refPath} stroke={ED.series2} strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={padL + plotW - 150} y={yOf(refAt(xMax)) - 8} fill={ED.series2} fontSize={9}>
        K eps^1.5, K&asymp;{K.toFixed(4)}
      </text>
      <path d={devPath} fill="none" stroke={ED.series5} strokeWidth={2.25} />
      {D.ladder.map((r) => (
        <circle
          key={r.N}
          cx={xOf(Math.log10(r.y_N_sharp))}
          cy={yOf(Math.log10(r.deviation))}
          r={3.5}
          fill={ED.brassDeco}
        />
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        log10(eps), eps = y_N^sharp descending left-to-right as N grows
      </text>
      <g>
        <circle cx={padL + 4} cy={padT - 12} r={3} fill={ED.brassDeco} />
        <text x={padL + 12} y={padT - 8} fill={ED.brass} fontSize={8.5}>
          measured dev(eps)
        </text>
        <circle cx={padL + 4} cy={padT - 24} r={3} fill={ED.series2} />
        <text x={padL + 12} y={padT - 20} fill={ED.series2} fontSize={8.5}>
          K eps^1.5 prefactor line
        </text>
      </g>
    </svg>
  );
}

// Local log-log slope theta_i between consecutive rungs, climbing monotonically toward 3/2.
function LocalSlopeChart() {
  const svgW = 680;
  const padL = 54;
  const padR = 20;
  const padT = 30;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 160;
  const svgH = padT + plotH + padB;

  const slopes = D.localLogLogSlopes;
  const yMin = 1.46;
  const yMax = 1.51;
  const xOf = (i) => padL + (i / (slopes.length - 1)) * plotW;
  const yOf = (theta) => padT + plotH - ((theta - yMin) / (yMax - yMin)) * plotH;

  const path = slopes.map((s, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i)} ${yOf(s.theta)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 12} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        local slope theta_i = d ln(dev) / d ln(eps) between consecutive rungs, climbing to 3/2
      </text>
      <line
        x1={padL}
        y1={yOf(1.5)}
        x2={padL + plotW}
        y2={yOf(1.5)}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 60} y={yOf(1.5) - 4} fill={ED.series2} fontSize={9}>
        theta = 3/2
      </text>
      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2} />
      {slopes.map((s, i) => (
        <circle key={`${s.fromN}-${s.toN}`} cx={xOf(i)} cy={yOf(s.theta)} r={3} fill={ED.series1} />
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {slopes.map((s, i) => (
        <text
          key={`${s.fromN}-${s.toN}-lbl`}
          x={xOf(i)}
          y={padT + plotH + 16}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={7.5}
          transform={`rotate(-40 ${xOf(i)} ${padT + plotH + 16})`}
        >
          {s.fromN.toExponential(0)}-{s.toN.toExponential(0)}
        </text>
      ))}
    </svg>
  );
}

export default function Imp35234RhoDeviationLogLogModulusViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="rho(eps) - 2/3 Deviation Modulus, Log-Log (imp-35234 / imp-35193)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35193 measured the empirical convergence-rate exponent theta and prefactor K in the deviation
        modulus dev(eps) = |rho(eps) &minus; 2/3| &sim; K eps^theta on the imp-35076 9-rung ladder. The local
        log-log slope theta_i climbs monotonically from &sim;1.4769 at the head (N&nbsp;=&nbsp;1e3&rarr;3e3) to
        &sim;1.49999 at the tail (N&nbsp;=&nbsp;3e6&rarr;1e7), pinning theta&nbsp;=&nbsp;3/2 &mdash; the
        half-integer fingerprint of the Hölder-1/2 cusp &mdash; with prefactor K&nbsp;&approx;&nbsp;{K.toFixed(4)}
        read at the tail. This page plots dev(eps) against eps on log-log axes with the K&nbsp;eps^1.5
        reference line, and the local slope climbing to 3/2, for the first time.
      </p>

      <DeviationLogLogChart />
      <div style={{ marginTop: '1.5rem' }}>
        <LocalSlopeChart />
      </div>

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
            <th style={{ padding: '0.4rem 0.6rem' }}>eps = y_N^sharp</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rho(eps)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dev(eps) = |rho-2/3|</th>
          </tr>
        </thead>
        <tbody>
          {D.ladder.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.y_N_sharp.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.rho.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.deviation.toExponential(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The tail local slope ({D.tailLocalSlope.toFixed(5)}) sits within 3e-5 of 3/2, and the OLS tail-5
        regression independently gives theta&nbsp;&approx;&nbsp;{D.olsTail5Theta.toFixed(4)}, confirming the
        eps^1.5 rate. Even at the worst (head) rung the deviation is only {D.headDeviation.toExponential(2)}{' '}
        with rho&nbsp;&approx;&nbsp;{D.headRho.toFixed(4)}&nbsp;&lt;&nbsp;1, consistent with the imp-35076
        a-fortiori margin holding across the whole ladder.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-35193
        measurement literals verbatim (no new computation). An OLS slope over 9 discrete rungs on the
        inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate is an empirical estimate, not a certified
        modulus of convergence; does NOT discharge O3 or G6a_shock_lipschitz (both stay OPEN); establishes no
        operator positivity; imp-3066 off-diagonal endpoint-Hankel K_a&nbsp;&ge;&nbsp;0 UNTOUCHED; C_mb
        GUE-conditional per imp-486; changes no bound; no RH verdict, NO QED.
      </div>
    </div>
  );
}
