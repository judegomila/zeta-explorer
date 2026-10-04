import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97418_LADDER_BARS,
  IMP97418_IMPROVEMENT_OVER_NAIVE,
  IMP97418_PERCENT_OF_GAP_TO_ZERO,
  IMP97418_SIGNMAP_SERIES,
  IMP97418_NEGATIVE_INTERVALS,
  IMP97418_ARGMIN,
  IMP97418_GLOBAL_INF,
  IMP97418_BINDING_2A,
} from '../data/imp-97418-krein-csharp-floor-ladder-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

// imp-97418: visualization of the certified Krein c_sharp floor ladder at 2a=ln3.
// Panel 1 places the four rungs (naive well-depth floor -4336.198, reproducing-
// kernel confined-well floor -3200.029, bathtub/water-filling joint floor -3065.435,
// measured Rayleigh-Ritz upper bracket +0.582) on a signed-log number line so the
// huge naive/RK magnitudes and the near-zero measured value are all visible at
// once. Panel 2 shows the sigma_2(t) sign map the floors are computed from, with
// the two confined negative sub-intervals shaded.

const signedLog = (v) => Math.sign(v) * Math.log10(1 + Math.abs(v));

function FloorLadderPanel() {
  const svgW = 720;
  const svgH = 220;
  const padL = 24;
  const padR = 24;
  const padT = 56;
  const padB = 64;
  const plotW = svgW - padL - padR;

  const bars = IMP97418_LADDER_BARS;
  const vMin = Math.min(...bars.map((b) => b.value)) * 1.06;
  const vMax = Math.max(1, ...bars.map((b) => b.value)) + 40;

  const tMin = signedLog(vMin);
  const tMax = signedLog(vMax);
  const xOf = (v) => padL + ((signedLog(v) - tMin) / (tMax - tMin)) * plotW;
  const midY = padT + 40;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={midY} x2={padL + plotW} y2={midY} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={xOf(0)} y1={padT - 12} x2={xOf(0)} y2={midY + 12} stroke={ED.series3} strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={xOf(0)} y={padT - 18} textAnchor="middle" fill={ED.series3} fontSize={9}>
        c_sharp = 0 (target)
      </text>
      {bars.map((b, i) => {
        const cx = xOf(b.value);
        const above = i % 2 === 0;
        const labelY = above ? midY - 20 : midY + 34;
        return (
          <g key={b.key}>
            <line x1={cx} y1={midY - 8} x2={cx} y2={midY + 8} stroke={b.color} strokeWidth={2} />
            <circle cx={cx} cy={midY} r={5} fill={b.color} />
            <text x={cx} y={labelY} textAnchor="middle" fill={b.color} fontSize={10} fontWeight={600}>
              {b.value.toFixed(3)}
            </text>
            <foreignObject x={cx - 100} y={above ? labelY - 30 : labelY + 6} width={200} height={28}>
              <div style={{ color: 'var(--ink-soft)', fontSize: '8px', textAlign: 'center', lineHeight: 1.25 }}>
                {b.label}
              </div>
            </foreignObject>
          </g>
        );
      })}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        c_sharp value (signed-log scale, so -4336 and +0.582 both fit)
      </text>
    </svg>
  );
}

function SignMapPanel() {
  const svgW = 720;
  const svgH = 260;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const rows = IMP97418_SIGNMAP_SERIES;
  const minY = Math.min(...rows.map((r) => r.v)) - 60;
  const maxY = Math.max(...rows.map((r) => r.v)) + 60;
  const minX = rows[0].t;
  const maxX = rows[rows.length - 1].t;

  const xOf = (t) => padL + ((t - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP97418_NEGATIVE_INTERVALS.map(([lo, hi]) => (
        <rect
          key={`${lo}-${hi}`}
          x={xOf(lo)}
          y={padT}
          width={xOf(hi) - xOf(lo)}
          height={plotH}
          fill={alpha(ED.series2, 0.1)}
        />
      ))}
      <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke={ED.rule} strokeWidth={1} strokeDasharray="3 3" />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[minY, 0, maxY].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(0)}
          </text>
        </g>
      ))}
      {[0, 2, 4, 6, 8, 10].map((t) => (
        <text key={`x${t}`} x={xOf(t)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {t}
        </text>
      ))}
      <polyline
        points={rows.map((r) => `${xOf(r.t)},${yOf(r.v)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={1.6}
      />
      <circle cx={xOf(IMP97418_ARGMIN)} cy={yOf(IMP97418_GLOBAL_INF)} r={3.5} fill={ED.series2} />
      <text x={xOf(IMP97418_ARGMIN)} y={yOf(IMP97418_GLOBAL_INF) - 8} textAnchor="middle" fill={ED.series2} fontSize={8.5}>
        argmin t={IMP97418_ARGMIN} ({IMP97418_GLOBAL_INF.toFixed(3)})
      </text>
      <text x={padL + plotW / 2} y={padT + plotH + 30} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        t (confined negative well shaded; sigma_2(t) &gt; 0 for all t &gt; 10.532)
      </text>
    </svg>
  );
}

export default function Imp97418KreinCsharpFloorLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I Krein Floor Ladder at 2a=ln3, Over the Confined sigma_2 Sign Map" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> neither the naive
        nor the reproducing-kernel value is a positive floor on
        c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3 &asymp; {IMP97418_BINDING_2A.toFixed(4)}.
        The third marker is a measured Rayleigh-Ritz UPPER bracket, not a certified
        floor. No operator positivity established; interval-rigorous certificate
        reach stays 2a&le;0.96; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97399 attacked the shared band-limited concentration inequality with a
        reproducing-kernel pointwise budget, lifting the imp-97335 naive
        symbol-infimum floor -4336.198 to -3200.029 (+{IMP97418_IMPROVEMENT_OVER_NAIVE.toFixed(3)},
        {' '}{IMP97418_PERCENT_OF_GAP_TO_ZERO.toFixed(1)}% of the way to 0), by using the
        confinement of sigma_2&apos;s negativity set (imp-97399 Finding 1) shown below.
        imp-97416 then coupled that pointwise budget with the mass constraint via a
        bathtub/water-filling argument, lifting the floor further to -3065.435 (+134.594).
        The measured value imp-97206 reports (+0.582) is positive, but reaching it
        rigorously still requires a genuinely spectral estimate, not a scalar
        rearrangement bound.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        The floor ladder: naive &rarr; reproducing-kernel &rarr; bathtub &rarr; measured
      </h3>
      <FloorLadderPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        The confined sigma_2(t) sign map the floors are computed from
      </h3>
      <SignMapPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> the ladder
        (top) uses a signed-log axis so the huge naive/reproducing-kernel magnitudes
        and the near-zero measured bracket are all visible together; each marker sits
        strictly closer to the green target line than the one before it. The sign map
        (bottom) shows sigma_2(t) dipping negative on two confined sub-intervals
        (shaded) with its global infimum at t={IMP97418_ARGMIN}, then turning and
        staying positive for all t &gt; 10.532 &mdash; the confinement imp-97399 used to
        make the reproducing-kernel budget non-vacuous.
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming
        the imp-97335 / imp-97399 / imp-97206 committed values verbatim (sigma_2(t)
        itself is recomputed pointwise for the sign-map curve; no re-solve of any
        floor or bracket). Establishes no operator positivity; changes no bound;
        Platt-Trudgian Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
