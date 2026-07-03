import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3374_DEGREE_POINTS,
  IMP3374_GEOMETRIC_REFERENCE,
  IMP3374_DEG2_OVERFLOW,
  IMP3374_DEG0_SPECTRAL_OVERFLOW,
  IMP3374_BARE_CROSSOVER_FRACTION,
} from '../data/imp-3374-overflow-degree-viz-data.js';

const MEASURED_COLOR = '#38bdf8';
const REF_COLOR = '#f59e0b';

function OverflowVsDegreeChart() {
  const svgW = 620;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const degMin = 0;
  const degMax = 2;
  const fracMin = 0;
  const fracMax = 0.8;

  const xS = (deg) => padL + ((degMax - deg) / (degMax - degMin)) * cW;
  const yS = (frac) => padT + cH * (1 - (frac - fracMin) / (fracMax - fracMin));

  const sorted = [...IMP3374_DEGREE_POINTS].sort((p1, p2) => p2.degree - p1.degree);
  const path = sorted.map((p, i) => (i === 0 ? 'M' : 'L') + xS(p.degree).toFixed(1) + ',' + yS(p.fraction).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 0.5, 1, 1.5, 2].map((d) => (
        <g key={d}>
          <line x1={xS(d)} y1={padT} x2={xS(d)} y2={padT + cH} stroke="#1e293b" strokeWidth={0.7} />
          <text x={xS(d)} y={padT + cH + 15} textAnchor="middle" fill="#64748b" fontSize={9}>
            {d}
          </text>
        </g>
      ))}

      {[0, 0.2, 0.4, 0.6, 0.8].map((f) => (
        <g key={f}>
          <line x1={padL} y1={yS(f)} x2={padL + cW} y2={yS(f)} stroke="#1e293b" strokeWidth={0.5} />
          <text x={padL - 8} y={yS(f) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {f.toFixed(1)}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(IMP3374_GEOMETRIC_REFERENCE.fraction)}
        x2={padL + cW}
        y2={yS(IMP3374_GEOMETRIC_REFERENCE.fraction)}
        stroke={REF_COLOR}
        strokeWidth={1.25}
        strokeDasharray="4,3"
      />
      <text x={padL + 4} y={yS(IMP3374_GEOMETRIC_REFERENCE.fraction) - 5} fill={REF_COLOR} fontSize={9}>
        geometric bare-crossover proxy ~{IMP3374_BARE_CROSSOVER_FRACTION.toFixed(4)}
      </text>

      <path d={path} fill="none" stroke={MEASURED_COLOR} strokeWidth={1.75} strokeDasharray="5,3" />

      {sorted.map((p) => (
        <circle key={p.degree} cx={xS(p.degree)} cy={yS(p.fraction)} r={4.5} fill={MEASURED_COLOR} stroke="#052e1f" strokeWidth={1} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill="#64748b" fontSize={10}>
        completion degree (2 = absolute occupation, 0 = scale-invariant spectral)
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,14,${padT + cH / 2})`}>
        overflow-support fraction of tau
      </text>
    </svg>
  );
}

function DegreeTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: '#94a3b8' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #334155' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>completion degree</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>overflow fraction of tau</th>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>what it is</th>
        </tr>
      </thead>
      <tbody>
        {[...IMP3374_DEGREE_POINTS].sort((a, b) => b.degree - a.degree).map((p) => (
          <tr key={p.degree} style={{ borderBottom: '1px solid #1e293b' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{p.degree}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: MEASURED_COLOR }}>{p.fraction.toFixed(4)}</td>
            <td style={{ padding: '0.35rem 0.5rem' }}>{p.label}</td>
          </tr>
        ))}
        <tr>
          <td style={{ padding: '0.35rem 0.5rem' }}>0 (geometric proxy)</td>
          <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: REF_COLOR }}>
            {IMP3374_GEOMETRIC_REFERENCE.fraction.toFixed(4)}
          </td>
          <td style={{ padding: '0.35rem 0.5rem' }}>{IMP3374_GEOMETRIC_REFERENCE.label}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default function Imp3374OverflowDegreeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Section-26 Overflow-Support Fraction vs Completion Degree (imp-3253)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-3253 reconciled the two section-26 overflow numbers a reader meets side by side: the
        degree-2 (absolute occupation measure) overflow-support fraction ~{IMP3374_DEG2_OVERFLOW.toFixed(3)} of
        tau, and the degree-0 (scale-invariant normalized-spectral, RH-equivalent) overflow
        fraction ~{IMP3374_DEG0_SPECTRAL_OVERFLOW.toFixed(2)} of tau. They are the SAME nu &gt; mu
        overflow phenomenon measured under two different completion degrees, not distinct objects.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Overflow-support fraction rising as completion degree falls from 2 to 0
      </p>
      <OverflowVsDegreeChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        The two reconciled anchor points, plus the geometric reference
      </p>
      <DegreeTable />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the dashed blue segment
        connects the two ACTUAL reconciled anchors -- degree-2 absolute occupation
        (~{IMP3374_DEG2_OVERFLOW.toFixed(3)}) and degree-0 scale-invariant spectral
        (~{IMP3374_DEG0_SPECTRAL_OVERFLOW.toFixed(2)}) -- to show the monotone RISE imp-3253
        establishes; no intermediate completion degree was computed, so the segment is a
        schematic connector, not a measured curve. The dashed orange line marks the geometric
        bare-crossover proxy (U - tau_star)/U ~{IMP3374_BARE_CROSSOVER_FRACTION.toFixed(4)}, the
        upper bound the full degree-0 spectral construction (~0.64) refines down from.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> presentation only -- this
        visualizes the imp-3253 reconciliation of two already-established overflow fractions. It
        establishes NO operator positivity and does not itself re-derive the degree-0 ~64% (that
        gap is a named imp-3253 sub-gap). RH-equivalent, necessary-but-not-sufficient. The
        imp-3066 off-diagonal endpoint-Hankel obstruction remains untouched; Platt-Trudgian
        &Lambda; &le; 0.2 remains the rigorous SOTA. No QED.
      </div>
    </div>
  );
}
