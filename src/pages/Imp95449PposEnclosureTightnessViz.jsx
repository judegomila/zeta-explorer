import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95449_PPOS_ENCLOSURE_TIGHTNESS } from '../data/imp-95449-ppos-enclosure-tightness.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP95449_PPOS_ENCLOSURE_TIGHTNESS;
const EPS = 2.220446049250313e-16;
const FLOOR_LOG10 = -18;

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xTicks, yTicks, xOf, yOf, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v.label ?? v}`}>
          <line x1={padL - 4} y1={yOf(v.val ?? v)} x2={padL} y2={yOf(v.val ?? v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v.val ?? v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.label ?? v}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

const widthTheta = (t) => 3 * Math.exp(-2 * Math.PI * Math.PI * t);
const widthDual = (t) => 3 * Math.exp(-2 / t);
const clampedLog10 = (w) => Math.max(Math.log10(w), FLOOR_LOG10);

function samplePoints(fn, tMin, tMax, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = tMin + ((tMax - tMin) * i) / n;
    pts.push([t, clampedLog10(fn(t))]);
  }
  return pts;
}

// enclosure relative width (up - lo)/up vs t, log-scale y, for both the
// theta (t >= 1/pi^2) and dual (0 < t <= 1) regimes; both anchor at
// 3 e^-2 = 0.406006 at their own regime boundary and decay away from it
function WidthDecayPanel() {
  const svgW = 640;
  const svgH = 300;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const tMin = 0;
  const tMax = 2.4;
  const yMinLog = -18;
  const yMaxLog = 0.3;
  const xOf = (t) => padL + ((t - tMin) / (tMax - tMin)) * plotW;
  const yOf = (logW) => padT + plotH - ((logW - yMinLog) / (yMaxLog - yMinLog)) * plotH;

  const thetaFrom = DATA.regimes.thetaFrom;
  const dualUpTo = DATA.regimes.dualUpTo;
  const thetaPts = samplePoints(widthTheta, thetaFrom, tMax, 120);
  const dualPts = samplePoints(widthDual, 0.02, dualUpTo, 120);
  const epsLog = Math.log10(EPS);

  const yTicks = [0, -4, -8, -12, -16].map((e) => ({ val: e, label: `1e${e}` }));

  return (
    <AxisFrame
      svgW={svgW} svgH={svgH} padL={padL} padR={padR} padT={padT} padB={padB}
      xTicks={[0, 0.5, 1, 1.5, 2]} yTicks={yTicks}
      xOf={xOf} yOf={yOf}
      xLabel="t" yLabel="relative width (up - lo) / up"
    >
      <line x1={padL} y1={yOf(epsLog)} x2={padL + plotW} y2={yOf(epsLog)} stroke={ED.rule} strokeWidth={1} strokeDasharray="3 3" />
      <text x={padL + plotW - 4} y={yOf(epsLog) - 4} textAnchor="end" fill={ED.inkSoft} fontSize={8.5}>
        double-precision eps = 2.22e-16
      </text>
      <line x1={xOf(DATA.baked.thetaWidthBelowEpsFrom)} y1={padT} x2={xOf(DATA.baked.thetaWidthBelowEpsFrom)} y2={padT + plotH} stroke={ED.series4} strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
      <line x1={xOf(DATA.baked.dualWidthBelowEpsFrom)} y1={padT} x2={xOf(DATA.baked.dualWidthBelowEpsFrom)} y2={padT + plotH} stroke={ED.series1} strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
      <polyline points={thetaPts.map(([t, l]) => `${xOf(t)},${yOf(l)}`).join(' ')} fill="none" stroke={ED.series4} strokeWidth={2} />
      <polyline points={dualPts.map(([t, l]) => `${xOf(t)},${yOf(l)}`).join(' ')} fill="none" stroke={ED.series1} strokeWidth={2} />
      <circle cx={xOf(thetaFrom)} cy={yOf(Math.log10(widthTheta(thetaFrom)))} r={4} fill="#e2e8f0" stroke={ED.series4} strokeWidth={1.5} />
      <circle cx={xOf(dualUpTo)} cy={yOf(Math.log10(widthDual(dualUpTo)))} r={4} fill="#e2e8f0" stroke={ED.series1} strokeWidth={1.5} />
      <text x={padL + 8} y={padT + 14} fill={ED.series4} fontSize={9}>
        theta regime (t &gt;= 1/pi^2), width = 3 e^(-2 pi^2 t)
      </text>
      <text x={padL + 8} y={padT + 27} fill={ED.series1} fontSize={9}>
        dual regime (t &lt;= 1), width = 3 e^(-2/t)
      </text>
    </AxisFrame>
  );
}

// strict-positivity margin min p/up and the boundary asymmetry (up/p, lo/p)
// -- three fixed O(1) values attained at the two regime boundaries
function MarginAsymmetryPanel() {
  const svgW = 640;
  const svgH = 220;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const bars = [
    { label: 'min p/up (margin)', value: DATA.baked.minMarginPoverUp, color: ED.series2 },
    { label: 'lo/p at worst point', value: DATA.baked.loOverP_atBoundary, color: ED.series1 },
    { label: 'up/p at worst point', value: DATA.baked.upOverP_atBoundary, color: ED.series4 },
  ];
  const maxY = 1.8;
  const barW = plotW / bars.length / 2;
  const xOf = (i) => padL + (plotW / bars.length) * (i + 0.5);
  const yOf = (v) => padT + plotH - (v / maxY) * plotH;

  return (
    <AxisFrame
      svgW={svgW} svgH={svgH} padL={padL} padR={padR} padT={padT} padB={padB}
      xTicks={[]} yTicks={[0, 0.5, 1, 1.5]}
      xOf={xOf} yOf={yOf}
      xLabel="" yLabel="ratio to p(t)"
    >
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke={ED.rule} strokeWidth={1} strokeDasharray="3 3" />
      <text x={padL + plotW - 4} y={yOf(1) - 4} textAnchor="end" fill={ED.inkSoft} fontSize={8.5}>
        p exactly
      </text>
      {bars.map((b, i) => (
        <g key={b.label}>
          <rect x={xOf(i) - barW / 2} y={yOf(Math.min(b.value, maxY))} width={barW} height={yOf(0) - yOf(Math.min(b.value, maxY))} fill={b.color} opacity={0.85} />
          <text x={xOf(i)} y={yOf(b.value) - 8} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
            {b.value.toFixed(6)}
          </text>
          <text x={xOf(i)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {b.label}
          </text>
        </g>
      ))}
    </AxisFrame>
  );
}

export default function Imp95449PposEnclosureTightnessViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-95449 P-POS Enclosure Tightness" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement-only chart of
        how tight the imp-95420 THEOREM P-POS two-sided enclosures of p(t) are; it re-derives no
        proof and changes no bound. RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95420 proves p(t) &gt; 0 via two overlapping alternating-series enclosures up(t) &gt;
        p(t) &gt; lo(t). imp-95449 measures the relative width (up - lo)/up, which equals exactly
        the first-neglected-over-first-term ratio of each series &mdash; 3 e^(-2 pi^2 t) in the
        theta regime, 3 e^(-2/t) in the dual regime &mdash; and finds it is{' '}
        {DATA.baked.widthAtBoundary.toFixed(6)} at both regime boundaries, dropping below the
        double-precision unit roundoff past t ~ {DATA.baked.thetaWidthBelowEpsFrom} (theta) and
        t ~ {DATA.baked.dualWidthBelowEpsFrom} (dual).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Enclosure relative width (up - lo) / up vs t, log scale
      </h3>
      <WidthDecayPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Strict-positivity margin and boundary asymmetry (worst point over the cover)
      </h3>
      <MarginAsymmetryPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the width curves meet at
        3 e^(-2) = 0.406006 exactly at their own regime boundary (t = 1/pi^2 theta, t = 1 dual)
        and fall off double-exponentially away from it, so the enclosure is numerically exact
        (bit-identical) almost everywhere except a narrow band near each boundary. At that worst
        band the strict-positivity margin min p(t)/up(t) ={' '}
        {DATA.baked.minMarginPoverUp.toFixed(6)} is still a fixed, positive O(1) fraction &mdash;
        it never approaches 0 &mdash; and p sits closer to the lower bound (underestimate 2.0%)
        than the upper bound (overestimate 65%).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-95449 baked record directly (values copied verbatim, curves plotted from the exact
        closed-form width formulas documented in that record). Changes no bound, establishes no
        operator positivity, no RH claim.
        NO QED.
      </div>
    </div>
  );
}
