import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34899_EFLOW_CROSSING_STRENGTH_RAMP_POSITION_SWEEP } from '../data/imp-34899-eflow-crossing-strength-ramp-position-sweep.js';
import { ED } from '../styles/tokens.js';

const D = IMP34899_EFLOW_CROSSING_STRENGTH_RAMP_POSITION_SWEEP;
const ROWS = D.rampSweep;
const S = D.summary;

// log-log collapse of s* (and the constant-slope linear estimate) against the effective E_flow/E_trunc
// ratio across the ramp-depth ladder m in {1,3,10,30,100,300}, with a dashed slope -1 reference line
// anchored at the m=1 rung showing the ~1/ratio collapse.
function CollapseChart() {
  const svgW = 720;
  const svgH = 320;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logRatios = ROWS.map((r) => Math.log10(r.effRatio));
  const logSStar = ROWS.map((r) => Math.log10(r.sStar));
  const logSStarLinear = ROWS.map((r) => Math.log10(r.sStarLinear));

  const xMin = Math.min(...logRatios) - 0.15;
  const xMax = Math.max(...logRatios) + 0.15;
  const yMin = Math.min(...logSStar, ...logSStarLinear) - 0.15;
  const yMax = Math.max(...logSStar, ...logSStarLinear) + 0.15;
  const xAt = (x) => padL + ((x - xMin) / (xMax - xMin)) * cW;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;

  // slope -1 reference line anchored through the m=1 rung (log s* = log(product) - log(ratio)).
  const refY = (x) => Math.log10(S.productSStarRatioMean) - x;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {[yMin, yMin + (yMax - yMin) / 4, yMin + (yMax - yMin) / 2, yMin + (3 * (yMax - yMin)) / 4, yMax].map(
        (t) => (
          <g key={t}>
            <line x1={padL - 4} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke={ED.ruleSoft} strokeWidth={1} />
            <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
              {t.toFixed(1)}
            </text>
          </g>
        )
      )}
      {logRatios.map((x, i) => (
        <g key={i}>
          <line x1={xAt(x)} y1={padT + cH} x2={xAt(x)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(x)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            m={ROWS[i].rampMultiplier}
          </text>
        </g>
      ))}

      {/* dashed slope -1 reference: log s* = log(product invariant) - log(ratio) */}
      <line
        x1={xAt(xMin)}
        y1={yAt(refY(xMin))}
        x2={xAt(xMax)}
        y2={yAt(refY(xMax))}
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="5,4"
      />
      <text x={xAt(xMin) + 6} y={yAt(refY(xMin)) - 6} fill={ED.series2} fontSize={9}>
        slope -1 (s* &prop; 1/ratio)
      </text>

      {/* constant-slope linear estimate, dotted */}
      <polyline
        points={logSStarLinear.map((y, i) => `${xAt(logRatios[i])},${yAt(y)}`).join(' ')}
        fill="none"
        stroke={ED.brassDeco}
        strokeWidth={1.5}
        strokeDasharray="2,3"
      />

      {/* bisected s* data points, connected */}
      <polyline
        points={logSStar.map((y, i) => `${xAt(logRatios[i])},${yAt(y)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
      />
      {logSStar.map((y, i) => (
        <circle key={i} cx={xAt(logRatios[i])} cy={yAt(y)} r={4} fill={ED.series1} />
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10(s*) vs ramp position (blue = bisected s*, amber dotted = constant-slope linear estimate,
        red dashed = slope -1 reference)
      </text>
    </svg>
  );
}

// bar chart of the product s* * (E_flow/E_trunc) across the ladder, showing it holding flat at the
// ramp-invariant value ~1.4366e-3 while s* itself collapses ~300x.
function InvariantProductChart() {
  const svgW = 720;
  const svgH = 220;
  const padL = 90;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const values = ROWS.map((r) => r.productSStarRatio);
  const yMin = Math.min(...values) * 0.9;
  const yMax = Math.max(...values) * 1.1;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;
  const barW = cW / ROWS.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      <line
        x1={padL}
        y1={yAt(S.productSStarRatioMean)}
        x2={padL + cW}
        y2={yAt(S.productSStarRatioMean)}
        stroke={ED.series3}
        strokeWidth={1.5}
        strokeDasharray="5,4"
      />
      <text x={padL + 6} y={yAt(S.productSStarRatioMean) - 6} fill={ED.series3} fontSize={9.5} fontWeight={700}>
        mean &asymp; {S.productSStarRatioMean.toExponential(4)}
      </text>

      {ROWS.map((r, i) => {
        const x = padL + i * barW + barW * 0.2;
        const w = barW * 0.6;
        return (
          <g key={i}>
            <rect x={x} y={yAt(r.productSStarRatio)} width={w} height={padT + cH - yAt(r.productSStarRatio)} fill={ED.series1} opacity={0.85} />
            <text x={x + w / 2} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              m={r.rampMultiplier}
            </text>
          </g>
        );
      })}
      <text x={padL - 8} y={yAt(yMax) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        {yMax.toExponential(2)}
      </text>
      <text x={padL - 8} y={yAt(yMin) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        {yMin.toExponential(2)}
      </text>

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        s* &times; (E_flow/E_trunc) across the ramp ladder -- max relative spread {S.productMaxRelSpread.toExponential(2)}
      </text>
    </svg>
  );
}

export default function Imp34934EflowRampPositionSweepViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Crossing-Strength Ramp-Position Sweep (imp-34934 / imp-34899)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        s* DRIFTS as ~1/(E_flow/E_trunc) -- it collapses from {S.sStarNearPeak} at the physical near-peak
        rung (m=1) to {S.sStarDeepRamp} at the deep-ramp rung (m=300), a {S.driftFactorM1toM300}x drift --
        rather than staying flat at the imp-34886 headline ~0.78.
      </p>
      <CollapseChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        The product s* &times; (E_flow/E_trunc) is RAMP-INVARIANT at {S.productSStarRatioMean.toExponential(4)}
        (max relative spread {S.productMaxRelSpread.toExponential(2)}) -- the crossing condition pins the
        E_flow log-odds shift, so the curvature argument s*&middot;ratio never grows no matter how far down
        the ramp the sweep goes.
      </p>
      <InvariantProductChart />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        Because that argument is pinned, the constant-slope linear estimate tracks s* to
        &le;{(S.maxRelDeparturePhysToModerate * 100).toFixed(2)}% over the physical-to-moderate regime
        (m&le;30): the curvature-induced departure is bounded (&le;{S.maxAbsCurvatureDeparture.toExponential(2)}
        {' '}in s) and largest at the physical near-peak point ({S.departureLargestAtNearPeak ? 'confirmed' : 'not confirmed'}),
        shrinking lower on the ramp -- the imp-34886 linear ~0.77 corroboration is robust, not fragile, to the
        first-order-capture curvature.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-34899 ramp-sweep literals verbatim (no new computation). Measurement on the INHERITED
        imp-3220/imp-3406 surrogate crossover map, NOT a rigorous asymptotic; C_mb GUE-conditional per
        imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched; far-tail exponent stays 1/2 (imp-3463); changes
        no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
