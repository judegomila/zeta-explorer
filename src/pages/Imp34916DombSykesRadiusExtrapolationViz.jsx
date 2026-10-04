import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS } from '../data/imp-34882-sigma-knee-domb-sykes-radius.js';
import { ED } from '../styles/tokens.js';

const D = IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS;
const ROOT_SEQ = D.reusedLiterals.rootSequence_root1_to_root9;
const X_ROOT = ROOT_SEQ.map((_, i) => 1 / (i + 1));
const INV_R_CENTRAL = D.linearDombSykes.invR_central;
const R_EXTRAP = D.linearDombSykes.radiusExtrapolated;
const [R_LOW, R_HIGH] = D.linearDombSykes.radiusRange_low_high;
const R_PLAIN_MAX = D.reusedLiterals.imp34863PlainMaxRadius;
const EPS = D.reusedLiterals.physicalEvalPoint;

// root_k = |delta_k|^(1/k) plotted against x = 1/k, k=1..9, with the linear Domb-Sykes intercept
// (deepest pairs k=7,8 and k=8,9) drawn as a dashed line extrapolated to x = 0, where the intercept is 1/R.
function DombSykesChart() {
  const svgW = 720;
  const svgH = 320;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 0;
  const xMax = 1;
  const yMin = 0;
  const yMax = Math.max(...ROOT_SEQ, INV_R_CENTRAL) * 1.08;
  const xAt = (x) => padL + ((x - xMin) / (xMax - xMin)) * cW;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;

  const xTicks = [0, 0.25, 0.5, 0.75, 1];
  const yTicks = [0, 0.002, 0.004, 0.006, 0.008];

  // dashed extrapolation line through the two deepest points (k=8, k=9) extended to x = 0.
  const x8 = X_ROOT[7];
  const y8 = ROOT_SEQ[7];
  const x9 = X_ROOT[8];
  const y9 = ROOT_SEQ[8];
  const slope = (y9 - y8) / (x9 - x8);
  const yAtX0 = y9 - slope * x9; // should equal ~ROLLING_LINEAR pair (8,9) invR, close to invR_central

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(3)}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={t}>
          <line x1={xAt(t)} y1={padT + cH} x2={xAt(t)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(t)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      {/* dashed linear Domb-Sykes extrapolation from the deepest pair (k=8,9) to x = 0 */}
      <line
        x1={xAt(0)}
        y1={yAt(yAtX0)}
        x2={xAt(x8)}
        y2={yAt(y8)}
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="5,4"
      />
      <circle cx={xAt(0)} cy={yAt(INV_R_CENTRAL)} r={5} fill={ED.series2} />
      <text x={xAt(0) + 8} y={yAt(INV_R_CENTRAL) - 6} fill={ED.series2} fontSize={9.5} fontWeight={700}>
        1/R &asymp; {INV_R_CENTRAL.toExponential(3)}
      </text>

      {/* root_k data points, k=1..9, connected */}
      <polyline
        points={ROOT_SEQ.map((r, i) => `${xAt(X_ROOT[i])},${yAt(r)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
      />
      {ROOT_SEQ.map((r, i) => (
        <g key={i}>
          <circle cx={xAt(X_ROOT[i])} cy={yAt(r)} r={4} fill={i >= 6 ? ED.series3 : ED.series1} />
          <text
            x={xAt(X_ROOT[i])}
            y={yAt(r) - 8}
            textAnchor="middle"
            fill={ED.inkFaint}
            fontSize={8}
          >
            k={i + 1}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        x = 1/k (root_k = |delta_k|^(1/k), imp-34863 literals); green = deepest resolvable pairs (k=7,8,9)
      </text>
    </svg>
  );
}

// Radius comparison: plain-max limsup read vs the Domb-Sykes-extrapolated central estimate with its
// error-bar range, both far above the physical resummation point eps = 1. Log10 scale (spans ~2.5 decades).
function RadiusComparisonChart() {
  const svgW = 720;
  const svgH = 190;
  const padL = 110;
  const padR = 30;
  const padT = 20;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 0; // log10(1)
  const xMax = 2.3; // log10(~200)
  const xAt = (v) => padL + ((Math.log10(v) - xMin) / (xMax - xMin)) * cW;

  const rows = [
    { label: 'eps = 1 (physical point)', v: EPS, color: ED.series2 },
    { label: `Domb-Sykes low end R~${R_LOW}`, v: R_LOW, color: ED.brass },
    { label: `Domb-Sykes central R~${R_EXTRAP}`, v: R_EXTRAP, color: ED.series3 },
    { label: `plain-max (imp-34863) R~${R_PLAIN_MAX.toFixed(1)}`, v: R_PLAIN_MAX, color: ED.series1 },
  ];
  const rowH = cH / rows.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => (
        <g key={r.label}>
          <text
            x={padL - 6}
            y={padT + i * rowH + rowH / 2 + 3}
            textAnchor="end"
            fill={ED.inkSoft}
            fontSize={9}
            fontFamily="monospace"
          >
            {r.label}
          </text>
          <line
            x1={padL}
            y1={padT + i * rowH + rowH / 2}
            x2={xAt(r.v)}
            y2={padT + i * rowH + rowH / 2}
            stroke={r.color}
            strokeWidth={10}
            strokeLinecap="round"
          />
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10 scale -- even the Domb-Sykes low end clears eps = 1 by nearly two orders of magnitude
      </text>
    </svg>
  );
}

export default function Imp34916DombSykesRadiusExtrapolationViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Domb-Sykes Radius Extrapolation (imp-34916 / imp-34882)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        root_k = |delta_k|^(1/k) is still RISING at the resolvable tail (root_7&hellip;root_9), so the
        plain limsup-as-max read (the k=9 rung) understates 1/R. The linear Domb-Sykes extrapolant from
        the two deepest pairs (k=7,8) and (k=8,9) pins 1/R &asymp; {INV_R_CENTRAL.toExponential(3)},
        giving R &asymp; {R_EXTRAP} (range [{R_LOW}, {R_HIGH}]) -- about 1.5x BELOW the imp-34863
        plain-max read R &asymp; {R_PLAIN_MAX.toFixed(1)}.
      </p>
      <DombSykesChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Even the low end of the extrapolated range, R &asymp; {R_LOW}, sits three orders of magnitude
        above the physical resummation point eps = {EPS}, so the delta-expansion stays comfortably
        convergent in the working neighbourhood -- the sharper radius trims the margin, it does not
        threaten the convergent verdict.
      </p>
      <RadiusComparisonChart />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        Higher-order Neville/Richardson extrapolants of the same nine-term sequence are ILL-CONDITIONED
        (3-pt intercept negative, full 9-pt window R &asymp; {(1 / D.nevilleExtrapolation.full9pt_invR).toFixed(2)}),
        so R is pinnable only to linear order, R ~ O(1e2); a tighter estimate needs the analytic/exact-
        derivative evaluation imp-34863/imp-34836 left open.
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
        imp-34882 root-sequence, linear Domb-Sykes, and radius-range literals verbatim (no new
        computation). Measurement on the INHERITED imp-3220/imp-3406 surrogate crossover map, NOT a
        rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched;
        far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity;
        no RH verdict, NO QED.
      </div>
    </div>
  );
}
