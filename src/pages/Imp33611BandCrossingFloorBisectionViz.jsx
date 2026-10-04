import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33611_BAND_ULP,
  IMP33611_BRACKET_LO,
  IMP33611_BRACKET_HI,
  IMP33611_FIRST_RAW_OVER_BAND_N,
  IMP33611_FIRST_ENV_OVER_BAND_N,
  IMP33611_DIP_NS,
  IMP33611_SCAN,
} from '../data/imp-33611-band-crossing-floor-bisection-viz-data.js';
import { ED } from '../styles/tokens.js';

const FLOOR_COLOR = ED.series1;
const ENVELOPE_COLOR = ED.series3;
const BAND_COLOR = ED.series7;
const SPIKE_COLOR = ED.series4;
const DIP_COLOR = ED.series5;

function FloorScanChart() {
  const svgW = 720;
  const padL = 44;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const nLo = IMP33611_SCAN[0].n;
  const nHi = IMP33611_SCAN[IMP33611_SCAN.length - 1].n;
  const yMax = 85;

  const xS = (n) => padL + ((n - nLo) / (nHi - nLo)) * cW;
  const yS = (v) => padT + cH * (1 - v / yMax);

  const firstRaw = IMP33611_SCAN.find((r) => r.n === IMP33611_FIRST_RAW_OVER_BAND_N);
  const firstEnv = IMP33611_SCAN.find((r) => r.n === IMP33611_FIRST_ENV_OVER_BAND_N);

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
        y1={yS(IMP33611_BAND_ULP)}
        x2={padL + cW}
        y2={yS(IMP33611_BAND_ULP)}
        stroke={BAND_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yS(IMP33611_BAND_ULP) - 6} textAnchor="end" fill={BAND_COLOR} fontSize={9}>
        imp-33316 deep-tail band (&lt; 64 ULP)
      </text>

      {/* raw floorUlp(n) -- jittery non-monotone lattice */}
      <polyline
        points={IMP33611_SCAN.map((r) => `${xS(r.n)},${yS(Math.min(r.floorUlp, yMax))}`).join(' ')}
        fill="none"
        stroke={FLOOR_COLOR}
        strokeWidth={1}
        opacity={0.85}
      />

      {/* +/-5 rolling-max envelope */}
      <polyline
        points={IMP33611_SCAN.map((r) => `${xS(r.n)},${yS(Math.min(r.envelope, yMax))}`).join(' ')}
        fill="none"
        stroke={ENVELOPE_COLOR}
        strokeWidth={1.8}
      />

      {/* dip markers: floor returns to ~0 ULP */}
      {IMP33611_DIP_NS.map((n) => {
        const r = IMP33611_SCAN.find((row) => row.n === n);
        return <circle key={`dip-${n}`} cx={xS(n)} cy={yS(r.floorUlp)} r={3} fill={DIP_COLOR} />;
      })}

      {/* first raw over-band spike */}
      {firstRaw && (
        <>
          <circle cx={xS(firstRaw.n)} cy={yS(firstRaw.floorUlp)} r={4} fill={SPIKE_COLOR} />
          <text x={xS(firstRaw.n)} y={yS(firstRaw.floorUlp) - 8} textAnchor="middle" fill={SPIKE_COLOR} fontSize={9}>
            n={firstRaw.n} (first raw &gt;64 ULP, isolated spike)
          </text>
        </>
      )}

      {/* first envelope over-band rung */}
      {firstEnv && (
        <circle cx={xS(firstEnv.n)} cy={yS(Math.min(firstEnv.envelope, yMax))} r={4} fill={ENVELOPE_COLOR} stroke={ED.paper} strokeWidth={1} />
      )}

      {[510, 526, 531, 552, 596].map((n) => (
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

export default function Imp33611BandCrossingFloorBisectionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Band-Crossing Floor Bisection (imp-33579)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 780 }}>
        imp-33557 bracketed the imp-33316 &lt; 64 ULP deep-tail band crossing between n=
        {IMP33611_BRACKET_LO} (~61.4 ULP, edge) and n={IMP33611_BRACKET_HI} (~65.3 ULP, fails), but
        never located a crossing rung. imp-33579 bisected the depth axis with a dense every-integer
        scan of floorUlp(n) -- the graded-GL grade-4 plateau smallest residual vs the imp-33213
        A_log target -- and found the floor is a JITTERY, NON-MONOTONE lattice quantity, not a
        monotone step. The chart below plots the raw scan (blue), the robust +/-5 rolling-max
        envelope (green), and the imp-33316 band line (pink, dashed).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        floorUlp(n) over n in [{IMP33611_BRACKET_LO}, {IMP33611_BRACKET_HI}]: raw scan vs rolling-max envelope
      </p>
      <FloorScanChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        The first raw rung clearing 64 ULP is n=<strong style={{ color: SPIKE_COLOR }}>{IMP33611_FIRST_RAW_OVER_BAND_N}</strong>{' '}
        (amber marker), but it is an isolated spike -- the floor dips back to ~0 ULP at n=
        {IMP33611_DIP_NS.join(', ')} (violet markers), all ABOVE it. The robust +/-5 rolling-max
        envelope (green line) first reaches 64 ULP at n=<strong style={{ color: ENVELOPE_COLOR }}>{IMP33611_FIRST_ENV_OVER_BAND_N}</strong>,
        yet even that envelope does not climb monotonically inside this bracket -- its least-squares
        slope over [{IMP33611_BRACKET_LO}, {IMP33611_BRACKET_HI}] is slightly negative.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue line is the raw,
        per-rung arithmetic floor -- it bounces between near-0 and over-80 ULP from one integer rung
        to the next. The green line is the +/-5 rolling-max envelope, the jitter-tolerant reading
        imp-33579 uses. No single rung n* separates an all-in-band region from an all-out-of-band
        region in this bracket: the imp-33557 "crossing" is only defined to the envelope over the
        wide range n=495..596, never to one rung. Exact per-rung ULP values are jittery
        arithmetic-floor lattice hits (imp-33249/imp-33296/imp-33537/imp-33557/imp-33579
        latticeJitterCaveat) -- the robust reading is the qualitative non-monotone structure, not the
        precise ULP at any single n.
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
        measurement only, of an already-verified scan (imp-33579). It changes no bound and patches
        no literal (imp-33213/imp-33316/imp-33557/imp-33579 intact). Mass-feasibility is
        necessary-but-not-sufficient; the operator-level positivity (imp-3066 K_a &ge; 0) is
        UNTOUCHED. RH-equivalent, NO QED.
      </div>
    </div>
  );
}
