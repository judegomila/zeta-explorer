import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33656_BAND_ULP,
  IMP33656_WINDOW_LO,
  IMP33656_WINDOW_HI,
  IMP33656_SPLIT_N,
  IMP33656_DENSE_SCAN,
  IMP33656_TAIL_DIGEST,
  IMP33656_CLUSTERS,
  IMP33656_DENSE_ENV_MAX,
  IMP33656_TAIL_ENV_MAX,
  IMP33656_OVERALL_ENV_MAX,
} from '../data/imp-33656-merged-band-clearing-overview-viz-data.js';
import { ED } from '../styles/tokens.js';

const FLOOR_COLOR = ED.series1;
const ENVELOPE_COLOR = ED.series3;
const TAIL_ENVELOPE_COLOR = ED.series3;
const BAND_COLOR = ED.series7;
const CLUSTER_COLOR = ED.series4;
const SPLIT_COLOR = ED.series8;

function MergedOverviewChart() {
  const svgW = 980;
  const padL = 46;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const nLo = IMP33656_WINDOW_LO;
  const nHi = IMP33656_WINDOW_HI;
  const yMax = Math.ceil((IMP33656_OVERALL_ENV_MAX + 10) / 10) * 10;

  const xS = (n) => padL + ((n - nLo) / (nHi - nLo)) * cW;
  const yS = (v) => padT + cH * (1 - v / yMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {/* shaded disjoint band-clearing clusters, dense + coarse */}
      {IMP33656_CLUSTERS.map((c) => (
        <rect
          key={`cluster-${c.lo}`}
          x={xS(c.lo)}
          y={padT}
          width={Math.max(1, xS(c.hi) - xS(c.lo))}
          height={cH}
          fill={CLUSTER_COLOR}
          opacity={0.12}
        />
      ))}

      {[0, 20, 40, 60, 80].filter((v) => v <= yMax).map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* imp-33316 deep-tail band line */}
      <line
        x1={padL}
        y1={yS(IMP33656_BAND_ULP)}
        x2={padL + cW}
        y2={yS(IMP33656_BAND_ULP)}
        stroke={BAND_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yS(IMP33656_BAND_ULP) - 6} textAnchor="end" fill={BAND_COLOR} fontSize={9}>
        imp-33316 deep-tail band (&lt; 64 ULP)
      </text>

      {/* resolution split marker at n=700 */}
      <line
        x1={xS(IMP33656_SPLIT_N)}
        y1={padT}
        x2={xS(IMP33656_SPLIT_N)}
        y2={padT + cH}
        stroke={SPLIT_COLOR}
        strokeWidth={1}
        strokeDasharray="2,3"
      />
      <text x={xS(IMP33656_SPLIT_N) + 4} y={padT + 10} fill={SPLIT_COLOR} fontSize={8.5}>
        dense | coarse (every 25 rungs)
      </text>

      {/* raw floorUlp(n) -- jittery per-integer scatter, dense [400,700] window only */}
      {IMP33656_DENSE_SCAN.map(([n, floorUlp]) => (
        <circle key={`raw-${n}`} cx={xS(n)} cy={yS(Math.min(floorUlp, yMax))} r={0.9} fill={FLOOR_COLOR} opacity={0.7} />
      ))}

      {/* dense +/-5 rolling-max envelope, [400,700] */}
      <polyline
        points={IMP33656_DENSE_SCAN.map(([n, , envelope]) => `${xS(n)},${yS(Math.min(envelope, yMax))}`).join(' ')}
        fill="none"
        stroke={ENVELOPE_COLOR}
        strokeWidth={1.6}
      />

      {/* coarse every-25th-rung envelope digest, [700,900] */}
      <polyline
        points={IMP33656_TAIL_DIGEST.map((r) => `${xS(r.n)},${yS(Math.min(r.envelope, yMax))}`).join(' ')}
        fill="none"
        stroke={TAIL_ENVELOPE_COLOR}
        strokeWidth={1.6}
        strokeDasharray="4,2"
      />
      {IMP33656_TAIL_DIGEST.map((r) => (
        <circle key={`digest-${r.n}`} cx={xS(r.n)} cy={yS(Math.min(r.envelope, yMax))} r={1.6} fill={TAIL_ENVELOPE_COLOR} />
      ))}

      {/* cluster peak markers -- all nine, dense and coarse */}
      {IMP33656_CLUSTERS.map((c) => (
        <g key={`peak-${c.peakN}`}>
          <circle cx={xS(c.peakN)} cy={yS(Math.min(c.peakEnv, yMax))} r={3.5} fill={CLUSTER_COLOR} />
          <text x={xS(c.peakN)} y={yS(Math.min(c.peakEnv, yMax)) - 7} textAnchor="middle" fill={CLUSTER_COLOR} fontSize={8}>
            n={c.peakN}
          </text>
        </g>
      ))}

      {[400, 500, 600, 700, 800, 900].map((n) => (
        <text key={n} x={xS(n)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {n}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        depth rung n (tau* = saddleTau(n))
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={12} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,12,${padT + cH / 2})`}>
        floorUlp(n)
      </text>
    </svg>
  );
}

export default function Imp33656MergedBandClearingOverviewViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 980, margin: '0 auto' }}>
      <PageHeader title="Merged Band-Clearing Overview [400,900] (imp-33599 / imp-33621)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 820 }}>
        The imp-33599 [400,700] envelope chart (imp-33629) and the imp-33621 [700,900] tail
        extension each cover only one half of the band-clearing window, so the tail
        re-intensification -- the [700,900] envelope maximum (~{IMP33656_TAIL_ENV_MAX.toFixed(1)}{' '}
        ULP) EXCEEDING the [400,700] maximum (~{IMP33656_DENSE_ENV_MAX.toFixed(1)} ULP) -- is not
        visible in one view. This chart merges both into a single [{IMP33656_WINDOW_LO},{IMP33656_WINDOW_HI}]
        overview: the raw per-integer scatter and dense rolling-max envelope (solid green) for
        n &lt; {IMP33656_SPLIT_N}, a coarser every-25th-rung envelope digest (dashed, light green)
        for n &ge; {IMP33656_SPLIT_N}, and all nine disjoint band-clearing clusters (amber) with
        their exact peaks marked.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        floorUlp(n) over n in [{IMP33656_WINDOW_LO}, {IMP33656_WINDOW_HI}]: dense scatter+envelope below n={IMP33656_SPLIT_N},
        coarse envelope digest above, nine band-clearing clusters shaded
      </p>
      <MergedOverviewChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        Across the full window there are nine disjoint band-clearing clusters, not a single
        monotone crossing: three in [400,700] with a local peak downtrend (~76.1 &rarr; ~65.3 &rarr;
        ~64.1 ULP), and six more in [700,900] whose tallest (~{IMP33656_TAIL_ENV_MAX.toFixed(1)} ULP
        at n&sim;709) exceeds the entire [400,700] maximum -- so the downtrend does not extrapolate
        and the envelope re-intensifies rather than subsiding.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue scatter and solid
        green envelope (n &lt; {IMP33656_SPLIT_N}) are the imp-33629 dense per-integer reading. The
        dashed light-green trace above n={IMP33656_SPLIT_N} is a coarser every-25th-rung digest of
        the imp-33621 tail scan -- no dense per-integer array was published for that window, so its
        trace is visibly coarser than the dense half; the amber peak markers there are still exact
        (imp-33621 located each cluster's precise peak rung and height). The resolution mismatch is
        deliberate and disclosed, not an artifact of the underlying scan.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation-only merge of two
        already-verified scans (imp-33599/imp-33629 and imp-33621); no new computation. It changes
        no bound and patches no literal. Mass-feasibility is necessary-but-not-sufficient; the
        operator-level positivity (imp-3066 K_a &ge; 0) is UNTOUCHED. RH-equivalent, NO QED.
      </div>
    </div>
  );
}
