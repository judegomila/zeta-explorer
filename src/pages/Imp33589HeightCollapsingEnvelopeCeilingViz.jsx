import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import IMP33558_ENVELOPE_BELOW_TAU7 from '../data/imp-33558-envelope-below-tau7.js';

const CEILING_COLOR = '#38bdf8';
const PEAK_COLOR = '#f59e0b';
const ENVELOPE_COLOR = '#4ade80';

const { fullCeilings, envelopeCeilingUlp, originalBindingHeight } = IMP33558_ENVELOPE_BELOW_TAU7.measured;

function HeightCeilingChart() {
  const svgW = 720;
  const padL = 46;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const yMax = 12;
  const tauLo = fullCeilings[0].tau;
  const tauHi = fullCeilings[fullCeilings.length - 1].tau;

  const xS = (tau) => padL + ((tau - tauLo) / (tauHi - tauLo)) * cW;
  const yS = (v) => padT + cH * (1 - v / yMax);

  const barW = (cW / fullCeilings.length) * 0.5;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 2, 4, 6, 8, 10, 12].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* the imp-33538 tau-uniform envelope constant */}
      <line
        x1={padL}
        y1={yS(envelopeCeilingUlp)}
        x2={padL + cW}
        y2={yS(envelopeCeilingUlp)}
        stroke={ENVELOPE_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yS(envelopeCeilingUlp) - 6} textAnchor="end" fill={ENVELOPE_COLOR} fontSize={9}>
        imp-33538 envelope (~{envelopeCeilingUlp.toFixed(2)} ULP)
      </text>

      {/* per-height ceiling bars */}
      {fullCeilings.map((c) => (
        <g key={`bar-${c.tau}`}>
          <rect
            x={xS(c.tau) - barW / 2}
            y={yS(Math.min(c.ceilingUlp, yMax))}
            width={barW}
            height={cH - (yS(Math.min(c.ceilingUlp, yMax)) - padT)}
            fill={c.tau === originalBindingHeight ? PEAK_COLOR : CEILING_COLOR}
            opacity={c.tau === originalBindingHeight ? 0.85 : 0.7}
          />
          <text
            x={xS(c.tau)}
            y={yS(Math.min(c.ceilingUlp, yMax)) - 6}
            textAnchor="middle"
            fill={c.tau === originalBindingHeight ? PEAK_COLOR : '#94a3b8'}
            fontSize={9}
          >
            {c.ceilingUlp.toFixed(2)}
          </text>
        </g>
      ))}

      {fullCeilings.map((c) => (
        <text key={`x-${c.tau}`} x={xS(c.tau)} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={9}>
          {c.tau}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={9}>
        height tau
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={12} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,12,${padT + cH / 2})`}>
        per-height ceiling (ULP)
      </text>
    </svg>
  );
}

export default function Imp33589HeightCollapsingEnvelopeCeilingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 980, margin: '0 auto' }}>
      <PageHeader title="Height-Collapsing Envelope Ceiling (imp-33558)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 820 }}>
        imp-33538 named a tau-uniform envelope constant (~{envelopeCeilingUlp.toFixed(2)} ULP) over the
        imp-33312 heights tau in {'{7..10}'}, binding at tau={originalBindingHeight}. imp-33558 extends
        the same fixed-neighbourhood jitter scan down to tau in {'{5,6}'} and re-reads the full band. The
        chart below plots the per-height ceiling bars across tau in {'{5..10}'} against the envelope line:
        the ceiling climbs to a peak at the binding height, then collapses.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        per-height ceiling maxUlp(tau) over tau in {'{5..10}'}, envelope line overlaid
      </p>
      <HeightCeilingChart />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        The ceiling rises monotonically from tau=5 (~{fullCeilings[0].ceilingUlp.toFixed(2)} ULP) through
        tau=6 and tau=7 to the peak at tau={originalBindingHeight} (~
        {fullCeilings.find((c) => c.tau === originalBindingHeight).ceilingUlp.toFixed(2)} ULP, amber bar),
        which sets the envelope, then collapses through tau=9 and tau=10 (~
        {fullCeilings[fullCeilings.length - 1].ceilingUlp.toFixed(2)} ULP). Every bar sits at or below the
        green envelope line -- the low heights tau in {'{5,6}'} are on the slack side of the margin, not a
        hidden worse regime.
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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> each bar is the per-height
        worst-in-window ULP ceiling from the SAME fixed neighbourhood (panels 245..325) run at that
        height. The amber bar is the binding height (tau={originalBindingHeight}), which sets the
        tau-uniform envelope constant (dashed green line). Because the fixed neighbourhood is even more
        resolved relative to the low heights than to the mid heights, their arithmetic-floor jitter is
        smaller, not larger -- the envelope stays conservative across the widened band.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> accuracy/rule-design measurement
        only. It changes no bound and patches no literal (imp-33312/imp-33538 intact). Mass-feasibility
        is necessary-but-not-sufficient; the operator-level positivity (imp-3066 K_a &ge; 0) is
        UNTOUCHED. RH-equivalent, NO QED. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
