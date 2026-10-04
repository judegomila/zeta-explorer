import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96256_WORST_MAG_SERIES,
  IMP96256_EQUAL_SPLIT_SERIES,
  IMP96256_COUPLING_LINE,
  IMP96256_ANCHORS,
  IMP96256_HONEST_BANNER,
} from '../data/imp-96256-joint-anchor-sweep-viz-data.js';
import { ED } from '../styles/tokens.js';

function ThresholdSweepChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 70;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const SCALE = 1e3; // plot in units of 1e-3 for readable ticks
  const { lamSecondSigned, lamTop } = IMP96256_ANCHORS;
  const xMin = lamSecondSigned;
  const xMax = lamTop;
  const yMax = IMP96256_ANCHORS.worstMagLowEdge * SCALE * 1.1;

  const xOf = (alpha) => padL + ((alpha - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - (v * SCALE / yMax) * plotH;

  const xTicks = [0.65, 0.75, 0.85, 0.95];
  const yTicks = [0, 0.5, 1.0, 1.5];

  const worstPath = IMP96256_WORST_MAG_SERIES
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.alpha).toFixed(2)} ${yOf(p.worstMag).toFixed(2)}`)
    .join(' ');
  const equalPath = IMP96256_EQUAL_SPLIT_SERIES
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.alpha).toFixed(2)} ${yOf(p.equalSplit).toFixed(2)}`)
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v / SCALE)} x2={padL + plotW} y2={yOf(v / SCALE)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v / SCALE) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{`${v}e-3`}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT} x2={xOf(v)} y2={padT + plotH} stroke={ED.rule} strokeWidth={0.5} opacity={0.3} />
          <text x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>{v}</text>
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={worstPath} fill="none" stroke={ED.series3} strokeWidth={1.75} opacity={0.95} />
      <path d={equalPath} fill="none" stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.9} />

      {IMP96256_WORST_MAG_SERIES.map((p) => (
        <circle key={`wm-${p.alpha}`} cx={xOf(p.alpha)} cy={yOf(p.worstMag)} r={2.6} fill={ED.series3} />
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        Kato-Temple gap anchor alpha (lam_2 = {lamSecondSigned.toFixed(4)} to lam_top = {lamTop.toFixed(4)})
      </text>
      <text x={20} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 20 ${padT + plotH / 2})`}>
        certify threshold (units of 1e-3)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={ED.series3} strokeWidth={1.75} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>pure-bottom worst-case (= joint total-magnitude threshold)</text>
        <line x1={0} y1={14} x2={18} y2={14} stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={22} y={17} fill={ED.inkSoft} fontSize={8.5}>equal-split per-channel boundary</text>
      </g>
    </svg>
  );
}

function CouplingLineChart() {
  const svgW = 680;
  const svgH = 130;
  const padL = 70;
  const padR = 16;
  const padT = 16;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const { lamSecondSigned, lamTop, couplingTightenRatio } = IMP96256_ANCHORS;
  const xMin = lamSecondSigned;
  const xMax = lamTop;
  const yMin = 0.82;
  const yMax = 0.91;

  const xOf = (alpha) => padL + ((alpha - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const linePath = IMP96256_COUPLING_LINE
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.alpha).toFixed(2)} ${yOf(p.tighten).toFixed(2)}`)
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL - 8} y={yOf(couplingTightenRatio) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
        {couplingTightenRatio.toFixed(4)}
      </text>
      <path d={linePath} fill="none" stroke={ED.series1} strokeWidth={2} opacity={0.95} />
      {IMP96256_COUPLING_LINE.map((p) => (
        <circle key={`c-${p.alpha}`} cx={xOf(p.alpha)} cy={yOf(p.tighten)} r={2.6} fill={ED.series1} />
      ))}
      <text x={padL + plotW - 6} y={padT + 12} textAnchor="end" fill={ED.series1} fontSize={8.5}>
        sqrt(3)/2 ~ 0.8660254 (flat at every anchor)
      </text>
    </svg>
  );
}

export default function Imp96256JointAnchorSweepViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96227: Joint Kato-Temple Certify Region, Swept Across the Anchor" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96256_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96238 charted the imp-96206 joint (eps_a, eps_b) certify region at only the
        gap-midpoint anchor. imp-96227 swept the same geometry across every admissible anchor
        alpha in (lam_2, lam_top): the pure-bottom worst-case threshold and the equal-split
        boundary both shrink monotonically toward lam_top, but the per-channel coupling strength
        stays exactly flat at sqrt(3)/2 &mdash; anchor-invariant even as the absolute thresholds move.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Worst-case and equal-split thresholds vs. anchor (monotone decreasing, never off O(1e-3))
      </h3>
      <ThresholdSweepChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Per-channel coupling strength vs. anchor (anchor-invariant, flat at sqrt(3)/2)
      </h3>
      <CouplingLineChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> the top chart shows the
        joint worst-case direction stays pure-bottom (theta = 90&deg;) at every anchor, so the
        green curve equals the separate bottom-twin threshold at every alpha (sup ~1.7828e-3 at
        the low edge, ~1.192e-3 at the imp-96206 midpoint, ~5.893e-4 near lam_top); the equal-split
        boundary (yellow, dashed) tracks just below it throughout. The bottom chart shows the
        per-channel tightening ratio &mdash; the fraction of pure-bottom tolerance retained once a
        simultaneous adjacent leak equal to half that anchor&apos;s own threshold is spent &mdash; is
        exactly sqrt(3)/2 &asymp; 0.8660254 at every interior anchor: the imp-96206 midpoint reading
        of 0.866 was not a special coincidence.
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
        imp-96227 baked anchor-sweep table and literals verbatim (only the chart-axis reshaping is
        computed here). Changes no bound, establishes no operator positivity, no RH claim;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
