import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33629_BAND_ULP,
  IMP33629_WINDOW_LO,
  IMP33629_WINDOW_HI,
  IMP33629_CLUSTERS,
  IMP33629_SCAN,
} from '../data/imp-33629-wide-range-band-crossing-envelope-viz-data.js';
import { ED } from '../styles/tokens.js';

const FLOOR_COLOR = ED.series1;
const ENVELOPE_COLOR = ED.series3;
const BAND_COLOR = ED.series7;
const CLUSTER_COLOR = ED.series4;

function WideScanChart() {
  const svgW = 900;
  const padL = 46;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const nLo = IMP33629_SCAN[0][0];
  const nHi = IMP33629_SCAN[IMP33629_SCAN.length - 1][0];
  const yMax = 85;

  const xS = (n) => padL + ((n - nLo) / (nHi - nLo)) * cW;
  const yS = (v) => padT + cH * (1 - v / yMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {/* shaded disjoint band-clearing clusters */}
      {IMP33629_CLUSTERS.map((c) => (
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

      {[0, 20, 40, 60, 80].map((v) => (
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
        y1={yS(IMP33629_BAND_ULP)}
        x2={padL + cW}
        y2={yS(IMP33629_BAND_ULP)}
        stroke={BAND_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yS(IMP33629_BAND_ULP) - 6} textAnchor="end" fill={BAND_COLOR} fontSize={9}>
        imp-33316 deep-tail band (&lt; 64 ULP)
      </text>

      {/* raw floorUlp(n) -- jittery per-integer scatter */}
      {IMP33629_SCAN.map(([n, floorUlp]) => (
        <circle key={`raw-${n}`} cx={xS(n)} cy={yS(Math.min(floorUlp, yMax))} r={0.9} fill={FLOOR_COLOR} opacity={0.7} />
      ))}

      {/* +/-5 rolling-max envelope */}
      <polyline
        points={IMP33629_SCAN.map(([n, , envelope]) => `${xS(n)},${yS(Math.min(envelope, yMax))}`).join(' ')}
        fill="none"
        stroke={ENVELOPE_COLOR}
        strokeWidth={1.6}
      />

      {/* cluster peak markers */}
      {IMP33629_CLUSTERS.map((c) => (
        <g key={`peak-${c.peakN}`}>
          <circle cx={xS(c.peakN)} cy={yS(Math.min(c.peakEnv, yMax))} r={3.5} fill={CLUSTER_COLOR} />
          <text x={xS(c.peakN)} y={yS(Math.min(c.peakEnv, yMax)) - 7} textAnchor="middle" fill={CLUSTER_COLOR} fontSize={8.5}>
            n={c.peakN}
          </text>
        </g>
      ))}

      {[400, 450, 500, 550, 600, 650, 700].map((n) => (
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

export default function Imp33629WideRangeBandCrossingEnvelopeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 980, margin: '0 auto' }}>
      <PageHeader title="Wide-Range Band-Crossing Envelope (imp-33599)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 820 }}>
        imp-33579 densely scanned the narrow bracket n in [510,596] and found the imp-33316 &lt; 64
        ULP band crossing is a jittery, non-monotone envelope phenomenon, not a locatable rung.
        imp-33599 extends that scan to the WIDE window n in [{IMP33629_WINDOW_LO}, {IMP33629_WINDOW_HI}]
        to ask whether a wider range reveals a monotone crossing. The chart below plots the raw
        per-integer floorUlp(n) scatter (blue dots), the +/-5 rolling-max envelope (green line), and
        the imp-33316 band line (pink, dashed), shading the three disjoint clusters where the
        envelope clears the band (amber).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        floorUlp(n) over n in [{IMP33629_WINDOW_LO}, {IMP33629_WINDOW_HI}]: raw scatter vs rolling-max envelope,
        band-clearing clusters shaded
      </p>
      <WideScanChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        Even over the wide window there is NO smallest n at which the envelope monotonely and
        stably clears 64 ULP. Instead the band-clearing region is three disjoint isolated clusters:{' '}
        {IMP33629_CLUSTERS.map((c, i) => (
          <span key={c.lo}>
            {i > 0 ? ', ' : ''}
            <strong style={{ color: CLUSTER_COLOR }}>
              [{c.lo},{c.hi}]
            </strong>{' '}
            (peak ~{c.peakEnv.toFixed(1)} ULP at n={c.peakN})
          </span>
        ))}
        , each subsiding back below 64 ULP above its peak -- the envelope dips as low as ~11 ULP
        elsewhere in the window.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue scatter is the raw,
        per-rung arithmetic floor -- it bounces between near-0 and over-70 ULP from one integer rung
        to the next across the entire window. The green line is the +/-5 rolling-max envelope, the
        jitter-tolerant reading imp-33599 uses; its wide-range least-squares slope is weakly positive
        (~+0.10 ULP/rung, r^2 ~0.30) but jitter-dominated -- rising into the first cluster
        (~+0.36 ULP/rung over [400,510]), turning slightly negative across the narrow [510,596]
        bracket (reproducing imp-33579), then flattening over the decaying tail [596,700]. No single
        rung n* separates an all-in-band region from an all-out-of-band region anywhere in this wide
        window: the n~531 spike inside [510,596] is simply the tallest of three clusters, not a
        threshold onset. Exact per-rung ULP values are jittery arithmetic-floor lattice hits
        (imp-33249/imp-33296/imp-33537/imp-33557/imp-33579/imp-33599 latticeJitterCaveat) -- the robust
        reading is the qualitative clustered-spike structure, not the precise ULP at any single n.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> accuracy/rule-design
        measurement only, of an already-verified scan (imp-33599). It changes no bound and patches
        no literal (imp-33213/imp-33316/imp-33557/imp-33579/imp-33599 intact). Mass-feasibility is
        necessary-but-not-sufficient; the operator-level positivity (imp-3066 K_a &ge; 0) is
        UNTOUCHED. RH-equivalent, NO QED.
      </div>
    </div>
  );
}
