import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33587_BAND_ULP, IMP33587_RUNGS } from '../data/imp-33587-band-crossing-floor-climb-viz-data.js';
import { ED } from '../styles/tokens.js';

const VERDICT_COLOR = { HOLDS: ED.series3, EDGE: ED.brassDeco, FAILS: ED.series2 };
const BAND_COLOR = ED.series7;

function FloorClimbChart() {
  const svgW = 640;
  const padL = 44;
  const padR = 20;
  const padT = 28;
  const padB = 56;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const yMax = 80;
  const yS = (v) => padT + cH * (1 - v / yMax);
  const barW = 90;
  const slot = cW / IMP33587_RUNGS.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

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
        y1={yS(IMP33587_BAND_ULP)}
        x2={padL + cW}
        y2={yS(IMP33587_BAND_ULP)}
        stroke={BAND_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yS(IMP33587_BAND_ULP) - 6} textAnchor="end" fill={BAND_COLOR} fontSize={9}>
        imp-33316 deep-tail band (&lt; {IMP33587_BAND_ULP} ULP)
      </text>

      {IMP33587_RUNGS.map((r, i) => {
        const cx = padL + slot * i + slot / 2;
        const barH = cH * (Math.min(r.floorUlp, yMax) / yMax);
        const color = VERDICT_COLOR[r.verdict];
        return (
          <g key={r.n}>
            <rect
              x={cx - barW / 2}
              y={padT + cH - barH}
              width={barW}
              height={barH}
              fill={color}
              opacity={0.85}
            />
            <text x={cx} y={padT + cH - barH - 8} textAnchor="middle" fill={color} fontSize={11} fontWeight={700}>
              {r.floorUlp.toFixed(1)} ULP
            </text>
            <text x={cx} y={padT + cH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
              n={r.n}
            </text>
            <text x={cx} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              {Number.isFinite(r.minInBandNodes) ? `${r.minInBandNodes}n min` : '∞ (never)'}
            </text>
            <text x={cx} y={padT + cH + 44} textAnchor="middle" fill={color} fontSize={9} fontWeight={700}>
              {r.verdict}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={12} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,12,${padT + cH / 2})`}>
        floorUlp(n)
      </text>
    </svg>
  );
}

export default function Imp33587BandCrossingFloorClimbViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Band-Crossing Floor Climb (imp-33557)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 780 }}>
        imp-33557 swept the imp-33539 graded-GL grade-4 plateau node budget at the three imp-33537
        band-crossing rungs n in {'{495,510,596}'}. At each rung, the peak-resolution wall stays flat
        at ~200 nodes -- the graded panels still resolve the sharpening saddle -- but the smallest
        residual that budget reaches (the arithmetic floor) climbs with depth and crosses the
        imp-33316 &lt; {IMP33587_BAND_ULP} ULP band between n=510 and n=596.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        floorUlp(n) at the band-crossing rungs vs the imp-33316 band
      </p>
      <FloorClimbChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        The floor climbs from ~24.2 ULP at n=495 (comfortably inside the band, minimum budget a clean
        200 nodes) to ~61.4 ULP at n=510 (still inside, but the minimum in-band budget destabilises to
        ~500 nodes as the floor hovers at the edge) to ~65.3 ULP at n=596, where the floor sits
        outside the band and NO budget in the imp-33539 ladder (up to 4000 nodes) reaches it.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> each bar is the graded-GL
        plateau arithmetic floor at one band-crossing rung, colored by its imp-33557 verdict --
        green (HOLDS), amber (EDGE), red (FAILS). The pink dashed line is the imp-33316 &lt; 64 ULP
        band. Adding nodes past ~200 does not lower a floor already set by the imp-33537/imp-33555
        depth-growing arithmetic jitter envelope, so the minimum budget reaching the band is
        BAND-CONDITIONAL, not universal. Exact per-rung ULP values are jittery arithmetic-floor
        lattice hits (imp-33249/imp-33296/imp-33537/imp-33557 latticeJitterCaveat) -- the robust
        reading is the qualitative HOLDS/EDGE/FAILS progression, not the precise ULP at any single n.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation of an
        already-established band-conditional measurement (imp-33557). It changes no bound and
        patches no literal. Mass-feasibility is necessary-but-not-sufficient; the operator-level
        positivity (imp-3066 K_a &ge; 0) is UNTOUCHED. RH-equivalent, NO QED.
      </div>
    </div>
  );
}
