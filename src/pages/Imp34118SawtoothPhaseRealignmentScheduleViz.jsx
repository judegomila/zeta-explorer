import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE } from '../data/imp-34044-sawtooth-phase-realignment-schedule.js';

const { ladderRungs, continuumArgmax, continuumPhase, realignmentLevels, frozenLevels, finding } =
  IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE;

// Log-log chart: measured gap vs exponent, colored by realign (descent) vs freeze.
function GapScheduleChart() {
  const svgW = 640;
  const svgH = 320;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const log10 = (v) => Math.log(v) / Math.LN10;
  const xs = ladderRungs.map((r) => r.exponent);
  const ys = ladderRungs.map((r) => log10(r.gap));

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const linePoints = ladderRungs.map((r, i) => `${xAt(xs[i])},${yAt(ys[i])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={linePoints} fill="none" stroke="#38bdf8" strokeWidth={1.5} strokeDasharray="2,3" />
      {ladderRungs.map((r, i) => {
        const isDescent = realignmentLevels.includes(r.exponent);
        return (
          <circle
            key={`pt-${r.exponent}`}
            cx={xAt(xs[i])}
            cy={yAt(ys[i])}
            r={4.5}
            fill={isDescent ? '#4ade80' : '#f97316'}
            stroke="#0a0f1a"
            strokeWidth={0.75}
          />
        );
      })}
      {ladderRungs.map((r, i) => (
        <text key={`xt-${r.exponent}`} x={xAt(xs[i])} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          1/{Math.pow(2, r.exponent)}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        dyadic step (exponent e = 7..15, step = 1/2^e)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        log10(gap)
      </text>
      <text x={padL + 4} y={padT + 12} fill="#4ade80" fontSize={9.5}>
        &#9679; descent (realignment: gap resumes)
      </text>
      <text x={padL + 4} y={padT + 26} fill="#f97316" fontSize={9.5}>
        &#9679; freeze (gap unchanged)
      </text>
    </svg>
  );
}

// Doubling-map phase orbit chart: frac_e vs exponent, with the reflection band shaded.
function PhaseOrbitChart() {
  const svgW = 640;
  const svgH = 260;
  const padL = 40;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = ladderRungs.map((r) => r.exponent);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (frac) => padT + cH - frac * cH;

  const bandTop = yAt(0.75);
  const bandBottom = yAt(0.25);
  const linePoints = ladderRungs.map((r, i) => `${xAt(xs[i])},${yAt(r.frac)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={bandTop} width={cW} height={bandBottom - bandTop} fill="rgba(74,222,128,0.1)" />
      <text x={padL + 4} y={bandTop + 12} fill="#4ade80" fontSize={8.5}>
        reflection band (1/4, 3/4) -- next level descends
      </text>
      <polyline points={linePoints} fill="none" stroke="#a78bfa" strokeWidth={1.5} />
      {ladderRungs.map((r, i) => (
        <circle
          key={`pt-${r.exponent}`}
          cx={xAt(xs[i])}
          cy={yAt(r.frac)}
          r={3.5}
          fill={r.inReflectionBand ? '#4ade80' : '#f97316'}
          stroke="#0a0f1a"
          strokeWidth={0.75}
        />
      ))}
      {ladderRungs.map((r, i) => (
        <text key={`xt-${r.exponent}`} x={xAt(xs[i])} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          e={r.exponent}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        dyadic exponent e (doubling-map orbit of phase k*-6)
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 12 ${padT + cH / 2})`}
      >
        frac_e
      </text>
    </svg>
  );
}

export default function Imp34118SawtoothPhaseRealignmentScheduleViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sawtooth Phase-Realignment Schedule (imp-34044 / imp-34118)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34044 extended the imp-33983 sawtooth-residue check across the full dyadic ladder
        1/128 .. 1/32768 (k* = {continuumArgmax}) and found the frozen-gap resumption schedule is a
        closed-form Bernoulli doubling-map orbit of the fixed continuum phase (k*-6) &#8776; {continuumPhase}.
        The gap resumes its descent at a level exactly when the orbit phase lands in the reflection
        band (1/4, 3/4); otherwise it freezes. The first chart plots the measured argmax gap on a
        log scale across the ladder, colored by descent (green) vs freeze (orange); the second plots
        the underlying doubling-map phase orbit frac_e against the reflection band that predicts each
        transition.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        log10(gap) vs dyadic step -- descent/freeze schedule
      </p>
      <GapScheduleChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        doubling-map phase orbit frac_e vs reflection band
      </p>
      <PhaseOrbitChart />

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/schedule only, no
        fresh derivation. {finding.V2_phase_is_a_doubling_map_orbit}{' '}
        Realignments occur at exponents {realignmentLevels.join(', ')} (steps 1/1024, 1/4096,
        1/16384); freezes at {frozenLevels.join(', ')}. {finding.V4_first_descent_at_1024_corrects_imp33983}{' '}
        Component model is the inherited imp-3220/imp-3406
        extrapolation, not a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; C_C 1/8
        ansatz (imp-2642/imp-2643) UNTOUCHED; imp-3066 K_a&gt;=0 UNTOUCHED; NO QED; Platt-Trudgian
        Lambda&lt;=0.2 remains SOTA.
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
        <strong style={{ color: '#94a3b8' }}>See also:</strong>{' '}
        <Link to="/viz-imp34182-deep-ladder-precision-floor" style={{ color: '#38bdf8' }}>
          imp-34182 (the deep ladder extension 1/65536 .. 1/2^20 and its precision-floor departure)
        </Link>
        .
      </div>
    </div>
  );
}
