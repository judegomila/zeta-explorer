import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import SurrogateDiagnosticCohortNote from '../components/SurrogateDiagnosticCohortNote.jsx';
import { IMP34087_F4_SURROGATE_CANCELLATION_DIGIT_LOSS } from '../data/imp-34087-f4-surrogate-cancellation-digit-loss.js';
import { ED } from '../styles/tokens.js';

const {
  profile: PROFILE,
  digitsLostThresholds: LOST,
  retainedThresholds: RETAINED,
  residZeroCrossing: CROSSING,
  machineDigits: MACHINE_DIGITS,
  finding: FINDING,
} = IMP34087_F4_SURROGATE_CANCELLATION_DIGIT_LOSS;

// Primary chart: digits lost climbs linearly across kEnd=13..21, well short of the crossing.
function DigitsLostChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minK = 13;
  const maxK = 21;
  const minY = 0;
  const maxY = 8;

  const xAt = (k) => padL + ((k - minK) / (maxK - minK)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline
        points={PROFILE.map((r) => `${xAt(r.kEnd)},${yAt(r.digitsLost)}`).join(' ')}
        fill="none"
        stroke={ED.series7}
        strokeWidth={1.75}
      />
      {PROFILE.filter((r, i) => i % 2 === 0).map((r) => (
        <circle key={r.kEnd} cx={xAt(r.kEnd)} cy={yAt(r.digitsLost)} r={3} fill={ED.series7} stroke={ED.paper} strokeWidth={1} />
      ))}
      <line
        x1={xAt(LOST.sixLost)}
        y1={padT}
        x2={xAt(LOST.sixLost)}
        y2={padT + cH}
        stroke={ED.series1}
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      <text x={xAt(LOST.sixLost) + 4} y={padT + 12} fill={ED.series1} fontSize={9.5}>
        6 lost @ {LOST.sixLost.toFixed(2)}
      </text>
      {[0, 2, 4, 6, 8].map((y) => (
        <text key={`ytick-${y}`} x={padL - 8} y={yAt(y) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {y}
        </text>
      ))}
      {[13, 15, 17, 19, 21].map((k) => (
        <text key={`xtick-${k}`} x={xAt(k)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
          {k}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        kEnd (fit boundary, sign-stable band 13..21)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        decimal digits lost log10(C)
      </text>
    </svg>
  );
}

// Secondary chart: retained accurate digits stays well above 6 across the whole band, then falls off a
// near-vertical cliff in the last ~0.0004 kEnd before the imp-34023 21.281 zero crossing.
function RetainedCliffChart() {
  const svgW = 640;
  const svgH = 280;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minK = 21.26;
  const maxK = CROSSING;
  const minY = -2;
  const maxY = 10;

  const zoomed = PROFILE.filter((r) => r.kEnd >= minK);
  const xAt = (k) => padL + ((k - minK) / (maxK - minK)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;
  const ySix = yAt(6);
  const yZero = yAt(0);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={ySix} x2={padL + cW} y2={ySix} stroke={ED.rule} strokeWidth={1} strokeDasharray="3,3" />
      <line x1={padL} y1={yZero} x2={padL + cW} y2={yZero} stroke={ED.rule} strokeWidth={1} strokeDasharray="3,3" />
      <polyline
        points={zoomed.map((r) => `${xAt(r.kEnd)},${yAt(r.retainedDigits)}`).join(' ')}
        fill="none"
        stroke={ED.brassDeco}
        strokeWidth={1.75}
      />
      {zoomed.map((r) => (
        <circle key={r.kEnd} cx={xAt(r.kEnd)} cy={yAt(r.retainedDigits)} r={3.5} fill={ED.brassDeco} />
      ))}
      <line
        x1={xAt(RETAINED.below6)}
        y1={padT}
        x2={xAt(RETAINED.below6)}
        y2={padT + cH}
        stroke={ED.series1}
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      <text x={xAt(RETAINED.below6) - 4} y={padT + 12} textAnchor="end" fill={ED.series1} fontSize={9}>
        &lt;6 digits @ {RETAINED.below6.toFixed(5)}
      </text>
      <line
        x1={xAt(CROSSING)}
        y1={padT}
        x2={xAt(CROSSING)}
        y2={padT + cH}
        stroke={ED.series2}
        strokeWidth={1.25}
      />
      <text x={xAt(CROSSING) - 4} y={padT + 26} textAnchor="end" fill={ED.series2} fontSize={9}>
        resid=0 @ {CROSSING.toFixed(3)}
      </text>
      {[0, 6].map((y) => (
        <text key={`ytick-${y}`} x={padL - 8} y={yAt(y) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {y}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        kEnd (zoomed on the last 0.02 before the crossing)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        retained accurate digits
      </text>
    </svg>
  );
}

export default function Imp34158DigitLossCliffViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="F4-Surrogate Digit-Loss Cliff / Retained-Digit Floor (imp-34087 / imp-34158)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34023 found the imp-33773 M2 residual surrogate crosses zero at kEnd* ~ {CROSSING.toFixed(3)},
        a catastrophic-cancellation ceiling on the F2/F3/F4 divergence, but never quantified the
        significance loss on approach. imp-34087 measured it: the relative-cancellation numerator
        |A|+|B| ~ {IMP34087_F4_SURROGATE_CANCELLATION_DIGIT_LOSS.numeratorIsOrderUnity} stays O(1), so
        digits-lost climbs only LINEARLY across the sign-stable band (~0.44/unit kEnd), and — with ~
        {MACHINE_DIGITS.toFixed(2)} digits available in double precision — the surrogate RETAINS at least 6
        accurate digits everywhere except an infinitesimal neighbourhood of the crossing itself.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        decimal digits lost to cancellation across the band, kEnd = 13..21
      </p>
      <DigitsLostChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.25rem' }}>
        the retained-digit floor: a near-vertical cliff in the last ~0.0004 kEnd before the crossing
      </p>
      <RetainedCliffChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {FINDING.A_cancellation_is_reciprocal_residual}{' '}
        {FINDING.C_retained_accuracy_floor_holds_to_the_crossing} This is a floating-point significance-loss
        diagnostic. <SurrogateDiagnosticCohortNote />
      </div>
    </div>
  );
}
