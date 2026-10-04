import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { KARATSUBA_CROSSOVER_LADDER } from '../data/imp-95380-karatsuba-crossover.js';
import { ED } from '../styles/tokens.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xTicks, yTicks, xOf, yOf, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {xTicks.map((v) => (
        <line key={`x${v}`} x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

// bar chart of CPU-days per limb band: schoolbook L^2/4 vs Karatsuba-aware f_karat
function CrossoverLadderPanel() {
  const rows = KARATSUBA_CROSSOVER_LADDER.rungs;
  const svgW = 680;
  const padL = 66;
  const padR = 24;
  const svgH = 340;
  const padT = 20;
  const padB = 60;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const maxY = 2200;
  const groupW = plotW / rows.length;
  const barW = groupW / 3;
  const xOf = (i) => padL + groupW * (i + 0.5);
  const yOf = (v) => padT + plotH - (v / maxY) * plotH;

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={rows.map((_, i) => i)}
      yTicks={[0, 500, 1000, 1500, 2000]}
      xOf={xOf}
      yOf={yOf}
      xLabel="mantissa-limb band"
      yLabel="tier-2 full-window CPU-days"
    >
      {rows.map((r, i) => (
        <g key={r.limbs}>
          <rect
            x={xOf(i) - barW}
            y={yOf(r.cpuDaysSchoolbook)}
            width={barW}
            height={yOf(0) - yOf(r.cpuDaysSchoolbook)}
            fill={ED.series4}
            opacity={0.85}
          />
          <rect
            x={xOf(i)}
            y={yOf(r.cpuDaysKaratsuba)}
            width={barW}
            height={yOf(0) - yOf(r.cpuDaysKaratsuba)}
            fill={ED.series1}
            opacity={0.85}
          />
          <text x={xOf(i) - barW / 2} y={yOf(r.cpuDaysSchoolbook) - 6} textAnchor="middle" fill={ED.ink} fontSize={8}>
            {r.cpuDaysSchoolbook.toFixed(0)}
          </text>
          <text x={xOf(i) + barW / 2} y={yOf(r.cpuDaysKaratsuba) - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={8}>
            {r.cpuDaysKaratsuba.toFixed(0)}
          </text>
          <text x={xOf(i)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {r.limbs}L{r.aboveCrossover ? '*' : ''}
          </text>
          <text x={xOf(i)} y={padT + plotH + 28} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
            {r.bitsLow}-{r.bitsHigh}b
          </text>
        </g>
      ))}
      <text x={padL + 8} y={padT + 14} fill={ED.series4} fontSize={9}>
        schoolbook (f_school = L^2/4, imp-95277 extrapolation)
      </text>
      <text x={padL + 8} y={padT + 27} fill={ED.series1} fontSize={9}>
        Karatsuba-aware (f_karat, breaks below schoolbook past 10L / 640b)
      </text>
    </AxisFrame>
  );
}

export default function Imp95477KaratsubaCrossoverLadderViz() {
  const rows = KARATSUBA_CROSSOVER_LADDER.rungs;
  const last = rows[rows.length - 1];
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Karatsuba-Aware Precision-Replay Ladder, Schoolbook vs f_karat CPU-Days (imp-95380)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a model extension over the frozen
        imp-95214/imp-95277 ledgers using the standard GMP schoolbook-to-Karatsuba multiply cost law,
        not a wall-clock measurement -- no native replay is launched and no per-platform
        MUL_TOOM22_THRESHOLD is probed. It changes no Lambda bound. Platt&ndash;Trudgian &Lambda; &le;
        0.2 remains state of the art. RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Below the {KARATSUBA_CROSSOVER_LADDER.crossoverLimbs}-limb ({KARATSUBA_CROSSOVER_LADDER.crossoverBits}
        -bit) crossover the Karatsuba-aware factor f_karat reproduces the imp-95277 schoolbook ladder
        exactly. Past it, GMP's Toom-2 multiply scales as L^log2(3) &asymp; L^1.585 rather than L^2, so
        f_school overstates the tier-2 CPU-day budget: at the top rung ({last.limbs} limbs,{' '}
        {last.bitsLow}-{last.bitsHigh} bits) f_karat gives {last.cpuDaysKaratsuba.toFixed(1)} CPU-days
        against the schoolbook extrapolation's {last.cpuDaysSchoolbook.toFixed(1)} -- an overstatement
        of {last.schoolbookOverstatePct.toFixed(1)}%.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        CPU-days by mantissa-limb band, schoolbook vs Karatsuba-aware
      </h3>
      <CrossoverLadderPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the two brackets coincide at
        and below the {KARATSUBA_CROSSOVER_LADDER.crossoverLimbs}-limb crossover (starred rungs sit
        above it); past that point the Karatsuba bar is strictly shorter, and the gap widens with
        limb count -- exactly 3/4 of the schoolbook figure at 20 limbs (twice the crossover), since
        Karatsuba triples cost per operand-size doubling while schoolbook quadruples it. The
        crossover rescales the level-1 and tier-2 routes by the same multiply-cost law, so the 17.9x
        tier-2 dominance margin and the do-not-run-level-1 recommendation are unchanged across it --
        only the absolute far-precision budget drops below the schoolbook extrapolation.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-95380
        KARATSUBA_CROSSOVER_LADDER module (values copied verbatim, no re-derivation). Changes no
        bound, establishes no operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2
        remains SOTA. NO QED.
      </div>
    </div>
  );
}
