import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34924_EFLOW_PINNED_PRODUCT_DERIVATION as D } from '../data/imp-34924-eflow-pinned-product-derivation.js';
import { ED } from '../styles/tokens.js';

// Renders the imp-34924 ladder + deviation literals verbatim (no new computation): the measured
// s*(m) ~ g*/m collapse and the ramp-invariant product P(m) = s*(E_flow/E_trunc) ~ g* r0 across the
// ramp-depth ladder m in {1,3,10,30,100,300}.
const LADDER = D.ladder;
const DEVIATION = D.productDeviationByRung;
const G_STAR_MEAN = D.summary.gStarMean;

// log-log s*(m) collapse: measured points vs the g*/m curve.
function CollapseChart() {
  const svgW = 720;
  const svgH = 280;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logM = LADDER.map((r) => Math.log10(r.rampMultiplier));
  const logS = LADDER.map((r) => Math.log10(r.sStar));
  const xMin = Math.min(...logM) - 0.15;
  const xMax = Math.max(...logM) + 0.15;
  const yMin = Math.min(...logS) - 0.15;
  const yMax = Math.max(...logS) + 0.15;
  const xAt = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  // g*/m curve sampled continuously over the ladder span.
  const CURVE_POINTS = 80;
  const curve = [];
  for (let i = 0; i <= CURVE_POINTS; i++) {
    const lm = xMin + ((xMax - xMin) * i) / CURVE_POINTS;
    const m = Math.pow(10, lm);
    curve.push({ lm, ls: Math.log10(G_STAR_MEAN / m) });
  }
  const curvePath = curve.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(p.lm)},${yAt(p.ls)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {LADDER.map((r) => (
        <text key={r.rampMultiplier} x={xAt(Math.log10(r.rampMultiplier))} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {r.rampMultiplier}
        </text>
      ))}
      {[yMin, (yMin + yMax) / 2, yMax].map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL} y2={yAt(t)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {Math.pow(10, t).toExponential(2)}
          </text>
        </g>
      ))}
      <path d={curvePath} fill="none" stroke={ED.series3} strokeWidth={2} />
      {LADDER.map((r) => (
        <circle
          key={r.rampMultiplier}
          cx={xAt(Math.log10(r.rampMultiplier))}
          cy={yAt(Math.log10(r.sStar))}
          r={3}
          fill={ED.series1}
          stroke={ED.paper}
          strokeWidth={0.5}
        />
      ))}
      <text x={padL + 6} y={padT + 12} fill={ED.series3} fontSize={9.5} fontWeight={700}>
        g*/m EXACT collapse (g* &asymp; {G_STAR_MEAN.toFixed(5)})
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        ramp multiplier m (x-axis, log) vs crossing strength s* (y-axis, log)
      </text>
    </svg>
  );
}

// Pinned product P(m) across the ladder: near-constant line at g* r0, with per-rung relative deviation.
function ProductChart() {
  const svgW = 720;
  const svgH = 240;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logM = LADDER.map((r) => Math.log10(r.rampMultiplier));
  const xMin = Math.min(...logM) - 0.15;
  const xMax = Math.max(...logM) + 0.15;
  const devMax = Math.max(...DEVIATION.map((d) => d.relDeviation)) * 1.3 || 1e-6;
  const xAt = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - (v / devMax) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {LADDER.map((r) => (
        <text key={r.rampMultiplier} x={xAt(Math.log10(r.rampMultiplier))} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {r.rampMultiplier}
        </text>
      ))}
      {[0, devMax / 2, devMax].map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL} y2={yAt(t)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toExponential(1)}
          </text>
        </g>
      ))}
      {DEVIATION.map((d) => (
        <line
          key={d.rampMultiplier}
          x1={xAt(Math.log10(d.rampMultiplier))}
          y1={yAt(0)}
          x2={xAt(Math.log10(d.rampMultiplier))}
          y2={yAt(d.relDeviation)}
          stroke={ED.series7}
          strokeWidth={4}
        />
      ))}
      <text x={padL + 6} y={padT + 12} fill={ED.series7} fontSize={9.5} fontWeight={700}>
        relative deviation of P(m) = s*(E_flow/E_trunc) from its ladder mean ({D.summary.productMean.toExponential(4)})
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        ramp multiplier m (x-axis, log) vs per-rung relative deviation (y-axis) -- max {D.summary.productMaxRelDeviation.toExponential(1)}
      </text>
    </svg>
  );
}

export default function Imp34964EflowPinnedProductInvarianceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Pinned-Product Invariance (imp-34964 / imp-34924)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        The crossing strength s*(m) collapses exactly as g*/m across the ramp-depth ladder
        m&nbsp;&isin;&nbsp;{'{1,3,10,30,100,300}'} (blue points on the derived g*/m curve, log-log axes).
      </p>
      <CollapseChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        The pinned product P(m) = s*&middot;(E_flow/E_trunc) = g*&middot;r0 stays constant at
        &asymp;{D.summary.productMean.toExponential(4)} across every rung; per-rung relative deviation
        from the ladder mean is pure bisection/finite-difference noise (max {D.summary.productMaxRelDeviation.toExponential(1)}), not
        residual m-dependence.
      </p>
      <ProductChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-34924 ladder and deviation literals verbatim (no new computation). Measurement/derivation
        only on the inherited imp-3220/imp-3406 surrogate; the C_mb GUE-conditional per imp-486 is
        UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a&nbsp;&ge;&nbsp;0
        untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED.
      </div>
    </div>
  );
}
