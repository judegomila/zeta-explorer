import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34086_AGGREGATE_SHARE_ASYMMETRIC_TRIM } from '../data/imp-34086-aggregate-share-asymmetric-trim.js';

const { headWindows: HEAD, tailWindows: TAIL, attribution: ATTR, finding: FINDING } =
  IMP34086_AGGREGATE_SHARE_ASYMMETRIC_TRIM;

// Primary chart: the head-only vs tail-only aggregate F2 share vs m=0..9 rungs trimmed from the
// moving end, contrasted against the imp-34009 symmetric sweep endpoints (m=0 full, m=9 inner).
function ShareChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minM = 0;
  const maxM = 9;
  const minShare = 0.4;
  const maxShare = 0.96;

  const xAt = (m) => padL + ((m - minM) / (maxM - minM)) * cW;
  const yAt = (s) => padT + cH - ((s - minShare) / (maxShare - minShare)) * cH;

  const series = [
    { data: HEAD, color: '#f472b6', label: `head-only [6+0.25m,11] (drop ~${ATTR.head_only_drop})` },
    { data: TAIL, color: '#38bdf8', label: `tail-only [6,11-0.25m] (drop ~${ATTR.tail_only_drop})` },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {series.map((s) => (
        <polyline
          key={s.label}
          points={s.data.map((w) => `${xAt(w.m)},${yAt(w.agg_F2_share)}`).join(' ')}
          fill="none"
          stroke={s.color}
          strokeWidth={1.75}
        />
      ))}
      {series.map((s) =>
        s.data.map((w) => (
          <circle
            key={`${s.label}-${w.m}`}
            cx={xAt(w.m)}
            cy={yAt(w.agg_F2_share)}
            r={w.m === 0 || w.m === 1 || w.m === 9 ? 5 : 3}
            fill={s.color}
            stroke="#0a0f1a"
            strokeWidth={1}
          />
        ))
      )}
      <text x={xAt(0)} y={yAt(HEAD[0].agg_F2_share) - 12} textAnchor="middle" fill="#94a3b8" fontSize={9.5}>
        0.9225 (shared full window, m=0)
      </text>
      <text x={xAt(1)} y={yAt(TAIL[1].agg_F2_share) - 12} textAnchor="middle" fill="#38bdf8" fontSize={9.5}>
        {ATTR.tail_delta_at_m1 > 0 ? '+' : ''}
        {ATTR.tail_delta_at_m1} tail bump at m=1
      </text>
      <text x={xAt(1)} y={yAt(HEAD[1].agg_F2_share) + 16} textAnchor="middle" fill="#f472b6" fontSize={9.5}>
        {ATTR.head_delta_at_m1} head decline at m=1
      </text>
      <text x={xAt(9)} y={yAt(HEAD[9].agg_F2_share) + 16} textAnchor="middle" fill="#f472b6" fontSize={9.5}>
        {ATTR.head_share_inner} head inner
      </text>
      <text x={xAt(9)} y={yAt(TAIL[9].agg_F2_share) - 12} textAnchor="middle" fill="#38bdf8" fontSize={9.5}>
        {ATTR.tail_share_inner} tail inner
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        m (rungs trimmed off the ONE moving endpoint)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        aggregate |ln F2| share
      </text>
    </svg>
  );
}

// Secondary readout: the F4 residual-ratio factor for both one-sided families, showing the
// tail-only crossing of unity at m=1 versus the head-only factor that never crosses it.
function F4Chart() {
  const svgW = 640;
  const svgH = 260;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minM = 0;
  const maxM = 9;
  const minY = 0;
  const maxY = 2.9;

  const xAt = (m) => padL + ((m - minM) / (maxM - minM)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;
  const yUnity = yAt(1);

  const series = [
    { data: HEAD, color: '#f472b6', label: 'head-only F4 (falls, 0.874→0.349; never crosses unity)' },
    { data: TAIL, color: '#38bdf8', label: 'tail-only F4 (rises, 0.874→2.732; crosses unity at m=1)' },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yUnity} x2={padL + cW} y2={yUnity} stroke="#334155" strokeWidth={1} strokeDasharray="3,3" />
      <text x={padL + cW} y={yUnity - 4} textAnchor="end" fill="#64748b" fontSize={9}>
        unity
      </text>
      {series.map((s) => (
        <polyline
          key={s.label}
          points={s.data.map((w) => `${xAt(w.m)},${yAt(w.agg_F4)}`).join(' ')}
          fill="none"
          stroke={s.color}
          strokeWidth={1.75}
        />
      ))}
      {series.map((s) =>
        s.data.map((w) => {
          const isCrossing = s.data === TAIL && w.m === 1;
          return (
            <circle
              key={`${s.label}-${w.m}`}
              cx={xAt(w.m)}
              cy={yAt(w.agg_F4)}
              r={isCrossing ? 5.5 : 2.75}
              fill={s.color}
              stroke={isCrossing ? '#0a0f1a' : 'none'}
              strokeWidth={isCrossing ? 1.25 : 0}
            />
          );
        })
      )}
      <text x={xAt(1)} y={yAt(TAIL[1].agg_F4) - 10} textAnchor="middle" fill="#38bdf8" fontSize={9}>
        F4={TAIL[1].agg_F4.toFixed(3)} (crosses unity here -- drives the R2 tail bump)
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        m (rungs trimmed off the ONE moving endpoint)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        aggregate F4 (residual ratio)
      </text>
      {series.map((s, i) => (
        <text key={`legend-${s.label}`} x={padL + 4} y={padT + 12 + i * 14} fill={s.color} fontSize={9.5}>
          {s.label}
        </text>
      ))}
    </svg>
  );
}

export default function Imp34156AsymmetricTrimAttributionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Head-vs-Tail Asymmetric-Trim F2-Share Attribution (imp-34086 / imp-34156)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34009 shrank the imp-33962 5-decade window SYMMETRICALLY from both ends and found the 0.9225
        aggregate F2 share is endpoint-contingent, but could not tell which end drove that behaviour.
        imp-34086 splits the sweep into a head-only family (trimming only the low-N endpoint,
        [6+0.25m,11]) and a tail-only family (trimming only the high-N endpoint, [6,11-0.25m]), m=0..9,
        both matching the shared 0.9225 headline at m=0. The two effects decompose cleanly by side: the
        share LEVEL is head-dominated (head-only drop {ATTR.head_only_drop} vs tail-only{' '}
        {ATTR.tail_only_drop}, both exceeding the imp-34009 symmetric drop{' '}
        {ATTR.symmetric_drop_ref_imp34009}), while the non-monotone m=1 bump is entirely tail-driven
        (tail {ATTR.tail_delta_at_m1 > 0 ? '+' : ''}
        {ATTR.tail_delta_at_m1} vs head {ATTR.head_delta_at_m1}).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        aggregate |ln F2| share: head-only vs tail-only trim
      </p>
      <ShareChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.25rem' }}>
        the F4 residual-ratio factor underlying the bump: tail-only crosses unity at m=1, head-only never does
      </p>
      <F4Chart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> {FINDING.R1_share_drop_is_head_dominated}{' '}
        {FINDING.R3_F4_unity_crossing_is_tail_only} Directional attribution only, reusing the inherited
        imp-3220/imp-3406 component model verbatim; no fresh derivation, no bound changed, no operator
        positivity established; imp-3066 K_a&gt;=0 untouched; C_mb GUE-conditional per imp-486 untouched;
        NO QED; Platt-Trudgian Lambda&lt;=0.2 remains SOTA.
      </div>
    </div>
  );
}
