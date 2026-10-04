import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { ED } from '../styles/tokens.js';

// Import-light: literals baked verbatim from the imp-35243 iters-to-floor
// single-rate log-law cohort (imp-34997/imp-35109/imp-35111/imp-35174/imp-35243).
// No data-module import, no recomputation of T0(N) or the fixed point.
const N_CROSS_FP = 3.2803e9; // Banach-map fixed point g(N)=K*log(T0(N))
const R_CONTRACT = 0.0454235; // |g'(N_cross)|, single-rate contraction
const LN_INV_R = 3.09173; // ln(1/R_CONTRACT), nats per iterate
const DIGITS_PER_ITERATE = LN_INV_R / Math.LN10; // ~1.34272 digits/step
const EPS_FP = 2.3e-16; // IEEE-754 double machine-epsilon floor
const FLOOR_DIGITS = -Math.log10(EPS_FP); // ~15.64 digits to bit-identical floor
const ITERS_TO_FLOOR = Math.ceil(FLOOR_DIGITS / DIGITS_PER_ITERATE); // ~12
const DRIFT_PER_DECADE = 0.0187; // ceil-phase drift, phase units per decade in N
const DECADES_PER_CYCLE = 1 / DRIFT_PER_DECADE; // ~53.5 decades to drift a full phase unit

function ContractionChart() {
  const svgW = 680;
  const svgH = 300;
  const padL = 56;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const kMax = ITERS_TO_FLOOR + 1;

  const points = [];
  for (let k = 0; k <= kMax; k++) {
    const digits = Math.min(k * DIGITS_PER_ITERATE, FLOOR_DIGITS);
    points.push({ k, digits });
  }
  const xAt = (k) => padL + (k / kMax) * plotW;
  const yAt = (d) => padT + plotH - (d / FLOOR_DIGITS) * plotH;

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(p.k)} ${yAt(p.digits)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 8} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Digits converged to N_CROSS_FP vs Picard iterate k (rate r={R_CONTRACT}, ln(1/r)={LN_INV_R} nats)
      </text>
      {/* floor line */}
      <line
        x1={padL}
        y1={yAt(FLOOR_DIGITS)}
        x2={svgW - padR}
        y2={yAt(FLOOR_DIGITS)}
        stroke={ED.rule}
        strokeDasharray="4 4"
        strokeWidth={1}
      />
      <text x={svgW - padR} y={yAt(FLOOR_DIGITS) - 6} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
        machine-epsilon floor ({FLOOR_DIGITS.toFixed(2)} digits)
      </text>
      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT + plotH} x2={svgW - padR} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <path d={pathD} fill="none" stroke={ED.series5} strokeWidth={2.5} />
      {points.map((p) => (
        <circle
          key={p.k}
          cx={xAt(p.k)}
          cy={yAt(p.digits)}
          r={3.5}
          fill={p.digits >= FLOOR_DIGITS ? ED.series7 : ED.series5}
        />
      ))}
      {points.map((p) => (
        <text key={`lbl-${p.k}`} x={xAt(p.k)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
          {p.k}
        </text>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={11}>
        Picard iterate k
      </text>
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={11}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        digits matched
      </text>
    </svg>
  );
}

export default function Imp35347FixedPointContractionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Iters-to-Floor Single-Rate Contraction to N_CROSS_FP (imp-35347 / imp-35243)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-35243 cohort models the Picard iteration g(N) = K&middot;log(T0(N)) as a single-rate
        contraction to the fixed point N_CROSS_FP&nbsp;&asymp;&nbsp;{N_CROSS_FP.toExponential(4)}, with
        local rate |g&prime;(N_cross)|&nbsp;=&nbsp;R_CONTRACT&nbsp;&asymp;&nbsp;{R_CONTRACT} (equivalently
        ln(1/r)&nbsp;=&nbsp;LN_INV_R&nbsp;&asymp;&nbsp;{LN_INV_R} nats, {DIGITS_PER_ITERATE.toFixed(5)} digits
        per iterate). The chart below plots the resulting log-law approach: iterate count vs digits matched
        to the fixed point, reaching the IEEE-754 double machine-epsilon floor
        (&asymp;{FLOOR_DIGITS.toFixed(2)} digits) after {ITERS_TO_FLOOR} iterates &mdash; the flat 12&ndash;14
        plateau the imp-34755/imp-34798 measurements report.
      </p>

      <ContractionChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--series-5)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.82rem',
          color: 'var(--ink)',
        }}
      >
        <strong style={{ color: 'var(--ink)' }}>Ceil-phase drift overlay:</strong> because the ceil argument's
        fractional phase drifts monotonically at DRIFT_PER_DECADE&nbsp;&asymp;&nbsp;{DRIFT_PER_DECADE} phase
        units per decade of seed N (imp-34997), it takes &asymp;{DECADES_PER_CYCLE.toFixed(1)} decades to
        accumulate a full phase unit &mdash; the slow drift that carries the off-by-one ceil ambiguity out of,
        and eventually back into, its window, producing the finite reentry band imp-35243/imp-35111 locate at
        N&nbsp;&asymp;&nbsp;10<sup>27.08</sup>&ndash;10<sup>37.17</sup>.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page baking the imp-35243
        single-rate log-law literals verbatim (no new computation, no data-module import). The reentry band
        this contraction feeds remains a feature of the analytic surrogate 15&ndash;25 decades above the
        Platt&ndash;Trudgian verified-zero height (&asymp;3e12); the imp-35243 surrogate-fidelity assessment
        (R1&ndash;R4) stays OPEN, imp-35111a/imp-35174a are untouched by this page, establishes no operator
        positivity, no RH claim, NO QED.
      </div>
    </div>
  );
}
