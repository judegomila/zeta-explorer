import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95374_RZPEN_OFFLATTICE_DEGRADATION } from '../data/imp-95374-rzpen-offlattice-degradation.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP95374_RZPEN_OFFLATTICE_DEGRADATION;
const WORST = DATA.offLatticeWorst;
const MEAN = DATA.offLatticeMean;
const A_UNIF4 = DATA.latticeBaseline.aUnif4Rho2;

const DELTA_PCT = WORST.map((r) => r.delta * 100);

// Log-scale line chart: x = log10(delta), left axis = log10(floor), showing
// the worst-of-400 floor collapsing toward (and past) the proven A_unif4
// line while the mean-of-400 floor degrades far more gracefully.
function FloorDegradationChart() {
  const svgW = 720;
  const padL = 64;
  const padR = 20;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xVals = WORST.map((r) => Math.log10(r.delta));
  const xMin = Math.min(...xVals) - 0.15;
  const xMax = Math.max(...xVals) + 0.15;
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  const worstLog = WORST.map((r) => Math.log10(r.minFloor));
  const meanLog = MEAN.map((r) => Math.log10(r.meanFloor));
  const aUnifLog = Math.log10(A_UNIF4);
  const top = Math.max(...worstLog, ...meanLog, aUnifLog) + 1;
  const bot = Math.min(...worstLog, ...meanLog, aUnifLog) - 1;
  const yOf = (v) => padT + ((top - v) / (top - bot)) * plotH;

  const worstPath = WORST.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(xVals[i])} ${yOf(worstLog[i])}`).join(' ');
  const meanPath = MEAN.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(xVals[i])} ${yOf(meanLog[i])}`).join(' ');

  const yTicks = [-16, -13, -10, -7, -4];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <line key={`g${v}`} x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}
      <line
        x1={padL}
        y1={yOf(aUnifLog)}
        x2={padL + plotW}
        y2={yOf(aUnifLog)}
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 4} y={yOf(aUnifLog) - 5} textAnchor="end" fill={ED.series2} fontSize={9}>
        proven A_unif4 = {A_UNIF4.toExponential(3)}
      </text>
      <path d={meanPath} fill="none" stroke={ED.series3} strokeWidth={2} strokeDasharray="6 3" />
      <path d={worstPath} fill="none" stroke={ED.series1} strokeWidth={2} />
      {WORST.map((r, i) => (
        <g key={r.delta}>
          <circle cx={xOf(xVals[i])} cy={yOf(worstLog[i])} r={4} fill={ED.series1} />
          <circle cx={xOf(xVals[i])} cy={yOf(meanLog[i])} r={4} fill={ED.series3} />
          <text x={xOf(xVals[i])} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
            &plusmn;{DELTA_PCT[i].toFixed(2)}%
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <text key={`t${v}`} x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v}
        </text>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log-rate jitter magnitude delta (percent)
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        log10(pencil floor)
      </text>
    </svg>
  );
}

// Onset shift bar chart: worst-of-400 onset shift vs the m=8 baseline,
// with the delta=2^-3 breach threshold marked (imp-95330's proven
// m-uniform floor stops covering the worst-case draw beyond this point).
function OnsetShiftChart() {
  const svgW = 720;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 200;
  const svgH = padT + plotH + padB;

  const maxShift = Math.max(...WORST.map((r) => r.onsetShift));
  const yOf = (v) => padT + plotH - (v / maxShift) * plotH;
  const barW = (plotW / WORST.length) * 0.5;
  const slot = plotW / WORST.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {WORST.map((r, i) => {
        const cx = padL + slot * (i + 0.5);
        const h = plotH - (yOf(r.onsetShift) - padT);
        return (
          <g key={r.delta}>
            <rect
              x={cx - barW / 2}
              y={yOf(r.onsetShift)}
              width={barW}
              height={h}
              fill={r.breach ? ED.series2 : ED.series1}
            />
            <text x={cx} y={yOf(r.onsetShift) - 6} textAnchor="middle" fill={ED.ink} fontSize={9}>
              +{r.onsetShift.toFixed(2)}
            </text>
            <text x={cx} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
              &plusmn;{DELTA_PCT[i].toFixed(2)}%
            </text>
          </g>
        );
      })}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log-rate jitter magnitude delta (percent)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        onset shift (depth units)
      </text>
    </svg>
  );
}

export default function Imp95435RzpenOfflatticeDegradationLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="RZ-PEN Off-Lattice Degradation Ladder (imp-95374)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement-only
        page tabulating the imp-95374 record. It quantifies the imp-95330/imp-95331
        off-lattice residual and changes no bound. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95330 THEOREM RZ-PEN4 floor is a Toeplitz-symbol construct pinned to the
        exact dyadic rate lattice nu_k = 2^k; off the lattice the symbol does not exist, so
        imp-95374 instead measures the finite generalized pencil floor lam_min(Gtilde,
        blockdiag G0) directly under log-rate jitter delta in {'{2^-6..2^-2}'}, m = 8
        octave-twin blocks, 400 trials per magnitude.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Pencil floor vs jitter magnitude &mdash; worst-of-400 (blue) vs mean-of-400 (green),
        proven A_unif4 floor (red dashed)
      </h3>
      <FloorDegradationChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Worst-of-400 onset shift vs the m = 8 measured baseline (red bars breach the
        proven floor)
      </h3>
      <OnsetShiftChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>delta</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>worst floor</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>degrade</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>mean floor</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>onset(worst)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>shift</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>breach A_unif4</th>
          </tr>
        </thead>
        <tbody>
          {WORST.map((r, i) => (
            <tr key={r.delta} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>&plusmn;{DELTA_PCT[i].toFixed(2)}%</td>
              <td style={{ textAlign: 'right' }}>{r.minFloor.toExponential(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.degrade.toExponential(3)}x</td>
              <td style={{ textAlign: 'right' }}>{MEAN[i].meanFloor.toExponential(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.onset.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>+{r.onsetShift.toFixed(4)}</td>
              <td style={{ textAlign: 'right', color: r.breach ? 'var(--series-2)' : 'var(--series-3)' }}>{r.breach ? 'yes' : 'no'}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the worst-of-400
        floor degrades gracefully to about &plusmn;6.25% jitter (onset shift under 1 depth
        unit, still above the proven A_unif4 line), then a near-collision draw at
        &plusmn;12.5% collapses it below A_unif4 and the onset shift jumps past 2 depth
        units; by &plusmn;25% the worst floor is nearly float noise and the onset shift
        exceeds 9 depth units. The mean-of-400 curve stays far closer to the baseline
        throughout, showing the blow-up is a rare near-collision event, not typical
        off-lattice placement.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        frozen imp-95374 record (finite-m Jacobi-eigenvalue pencil measurement, no
        re-derivation). Supplies no off-lattice floor theorem (that is the separate,
        looser imp-95335 Ingham route); onset shift isolates the floor degradation only,
        holding the numerator fixed (the numerator's own drift is the separate imp-95253
        leg, composed in imp-95445). Changes no bound, establishes no operator
        positivity, no RH claim.
        NO QED.
      </div>
    </div>
  );
}
