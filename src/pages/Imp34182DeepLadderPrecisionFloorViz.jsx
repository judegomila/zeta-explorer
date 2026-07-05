import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34182_DEEP_LADDER_RUNGS,
  IMP34182_PRECISION_FLOOR,
} from '../data/imp-34182-deep-ladder-precision-floor-viz-data.js';

// Log-log chart: measured gap vs exponent, colored by realign (descent) vs freeze vs departure.
function GapScheduleChart() {
  const svgW = 640;
  const svgH = 320;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = IMP34182_DEEP_LADDER_RUNGS;
  const log10 = (v) => Math.log(v) / Math.LN10;
  const xs = rows.map((r) => r.exponent);
  const ys = rows.map((r) => log10(r.gap));

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const linePoints = rows.map((r, i) => `${xAt(xs[i])},${yAt(ys[i])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={linePoints} fill="none" stroke="#38bdf8" strokeWidth={1.5} strokeDasharray="2,3" />
      {rows.map((r, i) => {
        const color = !r.matches ? '#f43f5e' : r.exponent === 16 || r.exponent === 20 ? '#4ade80' : '#f97316';
        return (
          <circle
            key={`pt-${r.exponent}`}
            cx={xAt(xs[i])}
            cy={yAt(ys[i])}
            r={5}
            fill={color}
            stroke="#0a0f1a"
            strokeWidth={0.75}
          />
        );
      })}
      {rows.map((r, i) => (
        <text key={`xt-${r.exponent}`} x={xAt(xs[i])} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          1/{Math.pow(2, r.exponent)}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        dyadic step (exponent e = 15..20, step = 1/2^e)
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
      <text x={padL + 4} y={padT + 40} fill="#f43f5e" fontSize={9.5}>
        &#9679; DEPARTURE (e=19: predicted descent, observed freeze)
      </text>
    </svg>
  );
}

// Doubling-map phase orbit chart: frac_e vs exponent, with the reflection band shaded and the
// departure rung flagged.
function PhaseOrbitChart() {
  const svgW = 640;
  const svgH = 260;
  const padL = 40;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = IMP34182_DEEP_LADDER_RUNGS;
  const xs = rows.map((r) => r.exponent);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (frac) => padT + cH - frac * cH;

  const bandTop = yAt(0.75);
  const bandBottom = yAt(0.25);
  const linePoints = rows.map((r, i) => `${xAt(xs[i])},${yAt(r.frac)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={bandTop} width={cW} height={bandBottom - bandTop} fill="rgba(74,222,128,0.1)" />
      <text x={padL + 4} y={bandTop + 12} fill="#4ade80" fontSize={8.5}>
        reflection band (1/4, 3/4) -- next level descends (predicted)
      </text>
      <polyline points={linePoints} fill="none" stroke="#a78bfa" strokeWidth={1.5} />
      {rows.map((r, i) => (
        <circle
          key={`pt-${r.exponent}`}
          cx={xAt(xs[i])}
          cy={yAt(r.frac)}
          r={4}
          fill={r.exponent === 19 ? '#f43f5e' : r.inReflectionBand ? '#4ade80' : '#f97316'}
          stroke="#0a0f1a"
          strokeWidth={0.75}
        />
      ))}
      {rows.map((r, i) => (
        <text key={`xt-${r.exponent}`} x={xAt(xs[i])} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          e={r.exponent}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        dyadic exponent e (doubling-map orbit of phase k*-6, deep ladder)
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

export default function Imp34182DeepLadderPrecisionFloorViz() {
  const pf = IMP34182_PRECISION_FLOOR;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Doubling-Map Deep Ladder: Precision-Floor Departure (imp-34106 / imp-34182)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34044 characterized the sawtooth phase-realignment schedule across 1/128 .. 1/32768 as a
        closed-form Bernoulli doubling-map orbit of the continuum phase (k*-6). imp-34106 extended that
        ladder five rungs deeper, to 1/65536 .. 1/2^20, and found the closed form keeps predicting the
        schedule through 1/262144 -- then DEPARTS at 1/524288 (e=19), where the predicted descent fails
        to materialize (the discrete argmax gap stays frozen instead of resuming, for a max relative
        deviation of {(pf.maxRelDeviation * 100).toFixed(1)}%). The first chart plots the measured gap
        on a log scale, flagging the departure rung in red; the second plots the underlying doubling-map
        phase orbit against the reflection band that predicts each transition.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        log10(gap) vs dyadic step -- descent/freeze/departure schedule
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
        <strong style={{ color: '#94a3b8' }}>Why it departs:</strong> the closed form phases the
        schedule on the stored 6-significant-figure continuum argmax k* = {pf.storedKStar}, while the
        discrete argmax tracks the true resid_exp peak k_true &#8776; {pf.trueContinuumPeak} (rounding
        offset &#8776; {pf.roundingOffset.toExponential ? pf.roundingOffset.toExponential(2) : pf.roundingOffset}).
        Through {pf.validThroughStep} both round to the same nearest grid point; at {pf.departsAtStep}{' '}
        (e={pf.firstGridSplitExponent}) the grid first resolves them to DIFFERENT nearest grid points,
        and the two prescriptions split. So the doubling-map schedule's predictive floor is set by the
        precision of the stored continuum argmax, not by the underlying continuum problem -- at e=20 the
        sawtooth and the re-run argmax re-agree by phase coincidence, the delayed descent landing one
        rung late.
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
        <Link to="/viz-imp34118-sawtooth-phase-realignment-schedule" style={{ color: '#38bdf8' }}>
          imp-34118 (the shallow 1/128 .. 1/32768 schedule this ladder extends)
        </Link>
        .
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement only, isRigorous false.
        Component model is the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; the
        surrogate resid_exp(k) is descriptive, not derived; C_mb GUE-conditional per imp-486 UNTOUCHED;
        C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; imp-3066 K_a&gt;=0 UNTOUCHED; NO QED;
        Platt-Trudgian Lambda&lt;=0.2 remains SOTA.
      </div>
    </div>
  );
}
