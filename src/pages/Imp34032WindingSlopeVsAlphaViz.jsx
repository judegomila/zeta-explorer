import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33968_WINDING_RATE_VS_ALPHA_CURVE } from '../data/imp-33968-winding-rate-vs-alpha-curve.js';
import { ED } from '../styles/tokens.js';

const { curve: CURVE, maxWindingDeviation: MAX_DEVIATION, maxFitResidual: MAX_FIT_RESIDUAL } =
  IMP33968_WINDING_RATE_VS_ALPHA_CURVE;

// Measured winding slope vs the closed-form -(1+alpha) line on the primary axis, with the
// per-alpha linear-fit residual (1-R^2) traced on a secondary log-scaled axis below.
function WindingSlopeChart() {
  const svgW = 640;
  const svgH = 420;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padMid = 24;
  const padB = 36;
  const topH = 240;
  const botH = 100;
  const cW = svgW - padL - padR;

  const xs = CURVE.map((r) => r.alpha);
  const measuredYs = CURVE.map((r) => r.windingSlopeQuad);
  const analyticYs = CURVE.map((r) => r.windingSlopeAnalytic);
  const residualYs = CURVE.map((r) => r.fitResidual);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const allSlopeYs = [...measuredYs, ...analyticYs];
  const minY = Math.min(...allSlopeYs);
  const maxY = Math.max(...allSlopeYs);
  const padY = (maxY - minY) * 0.12;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) =>
    padT + topH - ((y - minY - padY) / (maxY - minY + 2 * padY)) * topH;

  const measuredPoints = xs.map((x, i) => `${xAt(x)},${yAt(measuredYs[i])}`).join(' ');
  const analyticPoints = xs.map((x, i) => `${xAt(x)},${yAt(analyticYs[i])}`).join(' ');

  // Secondary trace: log10(1-R^2), all values negative and tiny, plotted on its own strip.
  // Several rungs have an exact 1-R^2 = 0 (a perfect fit, below double precision); log10(0) = -Inf
  // would poison the axis scale with NaN, so floor the residual at the ~2.2e-16 machine-epsilon level
  // (i.e. "at or below measurable precision") before taking the log.
  const RESID_FLOOR = 2.22e-16;
  const logResiduals = residualYs.map((r) => Math.log10(Math.max(r, RESID_FLOOR)));
  const minLog = Math.min(...logResiduals);
  const maxLog = Math.max(...logResiduals);
  const padLog = (maxLog - minLog) * 0.15 || 1;
  const botTop = padT + topH + padMid;
  const yAtRes = (v) =>
    botTop + botH - ((v - minLog - padLog) / (maxLog - minLog + 2 * padLog)) * botH;
  const residualPoints = xs.map((x, i) => `${xAt(x)},${yAtRes(logResiduals[i])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* top panel: measured vs closed-form winding slope */}
      <polyline points={analyticPoints} fill="none" stroke={ED.brassDeco} strokeWidth={2} strokeDasharray="6,3" />
      <polyline points={measuredPoints} fill="none" stroke={ED.series1} strokeWidth={1.5} />
      {xs.map((x, i) => (
        <circle key={`m-${x}`} cx={xAt(x)} cy={yAt(measuredYs[i])} r={3} fill={ED.series1} stroke={ED.paper} strokeWidth={0.75} />
      ))}
      {xs.map((x) => (
        <text key={`xt-top-${x}`} x={xAt(x)} y={padT + topH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {x}
        </text>
      ))}
      <text x={padL + 4} y={padT + 12} fill={ED.series1} fontSize={9.5}>
        measured winding slope d arg(-A)/d theta
      </text>
      <text x={padL + 4} y={padT + 26} fill={ED.brass} fontSize={9.5}>
        closed form -(1+alpha)
      </text>
      <text
        x={16}
        y={padT + topH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + topH / 2})`}
      >
        winding slope
      </text>

      {/* bottom panel: per-alpha fit residual 1-R^2, log10 scale */}
      <polyline points={residualPoints} fill="none" stroke={ED.series5} strokeWidth={1.5} />
      {xs.map((x, i) => (
        <circle key={`r-${x}`} cx={xAt(x)} cy={yAtRes(logResiduals[i])} r={2.5} fill={ED.series5} stroke={ED.paper} strokeWidth={0.75} />
      ))}
      {xs.map((x) => (
        <text key={`xt-bot-${x}`} x={xAt(x)} y={botTop + botH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {x}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        alpha (cusp exponent)
      </text>
      <text
        x={16}
        y={botTop + botH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${botTop + botH / 2})`}
      >
        log10(1-R^2)
      </text>
      <text x={padL + 4} y={botTop + 12} fill={ED.series5} fontSize={9.5}>
        per-alpha linear-fit residual (1-R^2)
      </text>
    </svg>
  );
}

export default function Imp34032WindingSlopeVsAlphaViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Winding-slope-vs-alpha Curve (imp-33968)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33924 derived the joint (alpha, theta) leading amplitude A(alpha, theta) and showed its
        theta-winding rate d arg(-A)/d theta equals the closed form -(1+alpha). imp-33968 upgraded
        the imp-33924 cross-check from a single-tolerance pass/fail into an explicit rate-vs-alpha
        curve, extracted by least-squares fitting the unwrapped phase of -A(alpha,theta) over a
        theta sweep at each alpha in 0.1..0.9. The chart below overlays the measured slope on the
        closed-form line (top) and the per-alpha fit residual 1-R^2 (bottom, log scale) confirming
        the phase is essentially perfectly linear in theta at every alpha.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        winding slope vs alpha -- measured vs closed form -(1+alpha), with fit-residual trace
      </p>
      <WindingSlopeChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement only, on the model
        cusp rho(x) = |x|^-alpha. Max deviation from the closed form is {MAX_DEVIATION} and the max
        per-alpha fit residual is {MAX_FIT_RESIDUAL}. This re-measures a phase slope already derived
        in closed form by imp-33924; it does not re-derive the m_prime -&gt; C_ren map. H4 is NOT
        discharged; G6a_shock_lipschitz stays OPEN; imp-3066 K_a&gt;=0 untouched; NO QED.
      </div>
    </div>
  );
}
