import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97588_CURVE_SAMPLES,
  IMP97588_CROSSINGS,
  IMP97588_RESIDUAL_SAMPLES,
  IMP97588_VERDICT,
} from '../data/imp-97588-mcm-baseterm-K0-approach-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97588: charts the imp-97519 Route M MCM level-1 base-term scaled
// quantity c(x)*x/ln x = K0 + M0/ln x approaching K0 = 1/24 across
// x = 1e6..1e40, marking the 0.045 and 0.043 crossings, plus the residual
// (scaled - K0) tracking 1/ln x on a log-log panel.

const COLOR_CURVE = ED.series1;
const COLOR_LIMIT = ED.series4;
const COLOR_CROSS = ED.series3;
const COLOR_RESID = ED.series5;

function ApproachPanel() {
  const svgW = 680;
  const svgH = 260;
  const padL = 64;
  const padR = 20;
  const padT = 16;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const samples = IMP97588_CURVE_SAMPLES;
  const logXMin = samples[0].logX;
  const logXMax = samples[samples.length - 1].logX;
  const vMax = Math.max(...samples.map((p) => p.scaled)) * 1.05;
  const vMin = IMP97588_VERDICT.limitK0 * 0.95;

  const xOf = (logX) => padL + ((logX - logXMin) / (logXMax - logXMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - vMin) / (vMax - vMin)) * plotH;

  const curvePoints = samples.map((p) => `${xOf(p.logX)},${yOf(p.scaled)}`).join(' ');
  const limitY = yOf(IMP97588_VERDICT.limitK0);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={limitY} x2={padL + plotW} y2={limitY} stroke={COLOR_LIMIT} strokeWidth={1.25} strokeDasharray="4 3" />
      <polyline points={curvePoints} fill="none" stroke={COLOR_CURVE} strokeWidth={1.75} />

      {IMP97588_CROSSINGS.map((c) => (
        <g key={c.label}>
          <line x1={xOf(c.logX)} y1={padT} x2={xOf(c.logX)} y2={padT + plotH} stroke={COLOR_CROSS} strokeWidth={1} strokeDasharray="2 2" />
          <circle cx={xOf(c.logX)} cy={yOf(c.threshold)} r={3.5} fill={COLOR_CROSS} />
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[6, 10, 14, 20, 25, 31, 40].map((logX) => (
        <text key={`xt${logX}`} x={xOf(logX)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          1e{logX}
        </text>
      ))}

      <text x={padL - 6} y={limitY - 4} textAnchor="start" fill={COLOR_LIMIT} fontSize={9}>
        K0 = 1/24
      </text>

      <text x={padL + plotW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        x (log) &mdash; <tspan fill={COLOR_CURVE}>c(x)*x/ln x</tspan> approaching{' '}
        <tspan fill={COLOR_LIMIT}>K0=1/24</tspan>, crossing{' '}
        <tspan fill={COLOR_CROSS}>0.045 / 0.043</tspan>
      </text>
    </svg>
  );
}

function ResidualPanel() {
  const svgW = 680;
  const svgH = 240;
  const padL = 64;
  const padR = 20;
  const padT = 16;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const samples = IMP97588_RESIDUAL_SAMPLES;
  const logInvMin = Math.min(...samples.map((p) => Math.log10(p.invLnX)));
  const logInvMax = Math.max(...samples.map((p) => Math.log10(p.invLnX)));
  const logResMin = Math.min(...samples.map((p) => Math.log10(p.residual)));
  const logResMax = Math.max(...samples.map((p) => Math.log10(p.residual)));

  const xOf = (invLnX) => padL + ((Math.log10(invLnX) - logInvMin) / (logInvMax - logInvMin)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - logResMin) / (logResMax - logResMin)) * plotH;

  const sorted = [...samples].sort((a, b) => a.invLnX - b.invLnX);
  const points = sorted.map((p) => `${xOf(p.invLnX)},${yOf(p.residual)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={points} fill="none" stroke={COLOR_RESID} strokeWidth={1.75} />
      {sorted.map((p) => (
        <circle key={p.x} cx={xOf(p.invLnX)} cy={yOf(p.residual)} r={3} fill={COLOR_RESID} />
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <text x={padL + plotW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        1/ln x (log) &mdash; <tspan fill={COLOR_RESID}>residual = scaled(x) - K0</tspan> tracks M0/ln x exactly
      </text>
    </svg>
  );
}

export default function Imp97588McmBaseTermK0ApproachViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97519: Route M MCM Base-Term Approach to K0=1/24" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-1) 6%, transparent)',
          borderLeft: '3px solid var(--series-1)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-1)' }}>Honest status:</strong> presentation
        only, charting the already-measured imp-97499/imp-97519 closed-form
        law verbatim. No bound moves; MCM stays VERIFIED at omega&le;6 and
        FALSE from omega=11 (imp-97432); Platt-Trudgian Lambda&le;0.2 remains
        SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The Route M MCM level-1 base term c(x) = h(x) - h(2x), scaled as
        c(x)*x/ln x, follows the closed-form law K0 + M0/ln x with K0 = 1/24
        and M0 = {IMP97588_VERDICT.driftConstantM0.toFixed(6)}. imp-97519
        confirmed by direct exact-Euler-Maclaurin-kernel evaluation (mpmath,
        80 dps) that the quantity crosses 0.045 at x&nbsp;&asymp;&nbsp;2.77e12
        and 0.043 at the astronomically remote x&nbsp;&asymp;&nbsp;1.2737e31,
        fourteen-plus decades past the x=1e14 baked ladder, with the drift
        confirmed logarithmic (1/ln x) rather than power-law.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        c(x)*x/ln x approaching K0=1/24 across x=1e6..1e40
      </h3>
      <ApproachPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        residual = scaled(x) - K0 vs 1/ln x (log-log)
      </h3>
      <ResidualPanel />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem', maxWidth: 700 }}>
        The residual sits exactly on the M0/ln x line at every sampled point
        (baked ladder x=1e14..1e40 plus the 0.043 crossing at
        x&nbsp;&asymp;&nbsp;1.2737e31), confirming the approach to K0 is
        genuinely logarithmic: the residual ratio between x=1e14 and the
        crossing (2.22179) equals ln(1.2737e31)/ln(1e14) exactly, ruling out
        any power-law drift.
      </p>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page
        consuming the imp-97519 closed-form law and baked crossing values
        verbatim; no re-solve. Establishes no bound; MCM stays verified
        omega&le;6 / refuted from omega=11; RH open; NO QED.
      </div>
    </div>
  );
}
