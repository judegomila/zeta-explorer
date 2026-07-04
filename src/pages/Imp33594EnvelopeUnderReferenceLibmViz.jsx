import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33594_PER_HEIGHT,
  IMP33594_FP64_ENVELOPE_ULP,
  IMP33594_REFERENCE_ENVELOPE_ULP,
  IMP33594_BINDING_TAU,
} from '../data/imp-33594-envelope-under-reference-libm-viz-data.js';

const FP64_COLOR = '#38bdf8';
const DD_COLOR = '#4ade80';

function BandCeilingChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const yMax = 12;
  const yS = (v) => padT + cH * (1 - v / yMax);
  const n = IMP33594_PER_HEIGHT.length;
  const xS = (i) => padL + (i / (n - 1)) * cW;
  const yTicks = [0, 2, 4, 6, 8, 10, 12];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* fp64 envelope line: the imp-33538 named ~10.78 ULP constant */}
      <line
        x1={padL}
        y1={yS(IMP33594_FP64_ENVELOPE_ULP)}
        x2={padL + cW}
        y2={yS(IMP33594_FP64_ENVELOPE_ULP)}
        stroke={FP64_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + 4} y={yS(IMP33594_FP64_ENVELOPE_ULP) - 6} fill={FP64_COLOR} fontSize={9}>
        fp64 envelope: ~{IMP33594_FP64_ENVELOPE_ULP.toFixed(2)} ULP (imp-33538)
      </text>

      {/* reference-precision envelope line */}
      <line
        x1={padL}
        y1={yS(IMP33594_REFERENCE_ENVELOPE_ULP)}
        x2={padL + cW}
        y2={yS(IMP33594_REFERENCE_ENVELOPE_ULP)}
        stroke={DD_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + 4} y={yS(IMP33594_REFERENCE_ENVELOPE_ULP) + 12} fill={DD_COLOR} fontSize={9}>
        reference (~106-bit dd) envelope: ~{IMP33594_REFERENCE_ENVELOPE_ULP.toFixed(2)} ULP
      </text>

      {/* per-height bars */}
      {IMP33594_PER_HEIGHT.map((r, i) => {
        const barW = 22;
        return (
          <g key={r.tau}>
            <rect
              x={xS(i) - barW - 2}
              y={yS(r.fp64CeilingUlp)}
              width={barW}
              height={cH - (yS(r.fp64CeilingUlp) - padT)}
              fill={FP64_COLOR}
              opacity={0.85}
            />
            <rect
              x={xS(i) + 2}
              y={yS(r.ddCeilingUlp)}
              width={barW}
              height={cH - (yS(r.ddCeilingUlp) - padT)}
              fill={DD_COLOR}
              opacity={0.85}
            />
          </g>
        );
      })}

      {IMP33594_PER_HEIGHT.map((r, i) => (
        <text
          key={r.tau}
          x={xS(i)}
          y={padT + cH + 14}
          textAnchor="middle"
          fill={r.tau === IMP33594_BINDING_TAU ? '#f472b6' : '#64748b'}
          fontSize={9}
          fontWeight={r.tau === IMP33594_BINDING_TAU ? 700 : 400}
        >
          tau={r.tau}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={9}>
        height tau (binding height tau={IMP33594_BINDING_TAU} highlighted)
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        per-height band ceiling (ULP)
      </text>
    </svg>
  );
}

export default function Imp33594EnvelopeUnderReferenceLibmViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Reference-Libm Envelope Downward Shift (imp-33559)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-33559 recomputed the imp-33312 per-height band ceiling (tau in{' '}
        {'{7..10}'}) under a ~106-bit double-double reference-precision libm,
        to test whether the imp-33538 named ~10.78 ULP tau-uniform envelope
        constant survives replacing the double exp/log with a
        reference-precision surrogate. The chart pairs each height&apos;s fp64
        ceiling (blue) against its reference-libm ceiling (green): tau=7 shifts
        10.648 -&gt; 9.680 and the binding height tau=8 shifts 10.779 -&gt;
        10.212, while tau=9 and tau=10 are already sub-ULP resolved and
        unchanged.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        per-height band ceiling, fp64 vs reference-precision libm
      </p>
      <BandCeilingChart />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        The binding height stays at tau={IMP33594_BINDING_TAU} under both
        libms, so the imp-33538 &quot;binding at tau=8&quot; structural
        reading is robust. But the named ~10.78 ULP constant is not exact: the
        reference-precision envelope is ~
        {IMP33594_REFERENCE_ENVELOPE_ULP.toFixed(2)} ULP, about{' '}
        {(IMP33594_FP64_ENVELOPE_ULP - IMP33594_REFERENCE_ENVELOPE_ULP).toFixed(3)}{' '}
        ULP below the fp64-named ~{IMP33594_FP64_ENVELOPE_ULP.toFixed(2)} ULP --
        a double-libm round-off artifact. Since the reference envelope is
        below the fp64 one, the shipped envelope stays a valid (slightly
        conservative) upper bound, never breached.
      </p>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> both
        bars per height come from the same imp-33312 fixed neighbourhood
        [245,325] band; only the libm evaluating exp/log inside the kernel
        changes (fp64 vs ~106-bit double-double). The reference-libm bar is
        never taller than the fp64 bar at any height, confirming the shift is
        uniformly downward -- the reference libm makes the band MORE resolved,
        never less.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong>{' '}
        accuracy measurement only, of an already-verified table (imp-33559).
        The double-double libm is a reference-precision surrogate, not a
        platform survey; it changes no bound and patches no literal. Mass-
        feasibility is necessary-but-not-sufficient; the operator-level
        positivity (imp-3066 K_a &ge; 0) is UNTOUCHED. RH-equivalent, NO QED.
        Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
