import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import IMP95616_KRONECKER_SUPRMS_CROSSCHECK from '../data/imp-95616-kronecker-suprms-crosscheck.js';
import { ED } from '../styles/tokens.js';

const ROWS = IMP95616_KRONECKER_SUPRMS_CROSSCHECK.rows;

// Line chart: sup/rms transfer constant (measured + theory) vs sqrt(N), with the
// y = sqrt(N) ceiling line the constant approaches from below (unequal amplitudes).
function TransferConstantChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 20;
  const padT = 24;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = padT + plotH + padB;

  const xMin = 0;
  const xMax = Math.max(...ROWS.map((r) => r.sqrtN)) * 1.05;
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  const yMin = 0;
  const yMax = xMax;
  const yOf = (v) => padT + ((yMax - v) / (yMax - yMin)) * plotH;

  const ceilingPath = `M ${xOf(xMin)} ${yOf(xMin)} L ${xOf(xMax)} ${yOf(xMax)}`;
  const theoryPath = ROWS.map(
    (r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.sqrtN)} ${yOf(r.transferConstantTheory)}`,
  ).join(' ');
  const measuredPath = ROWS.map(
    (r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.sqrtN)} ${yOf(r.supOverRmsMeasured)}`,
  ).join(' ');

  const ticks = [0, 1, 2, 3, 4, 5].filter((v) => v <= xMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {ticks.map((v) => (
        <line key={`gy${v}`} x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}
      <path d={ceilingPath} fill="none" stroke={ED.rule} strokeWidth={1} strokeDasharray="4 4" />
      <text x={xOf(xMax) - 4} y={yOf(xMax) - 6} textAnchor="end" fill={ED.inkSoft} fontSize={9}>
        ceiling sqrt(N)
      </text>
      <path d={theoryPath} fill="none" stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="2 3" />
      <path d={measuredPath} fill="none" stroke={ED.series1} strokeWidth={2} />
      {ROWS.map((r) => (
        <circle key={r.N} cx={xOf(r.sqrtN)} cy={yOf(r.supOverRmsMeasured)} r={3.5} fill={ED.series1} />
      ))}
      {ROWS.map((r) => (
        <text key={`lbl${r.N}`} x={xOf(r.sqrtN)} y={yOf(r.supOverRmsMeasured) - 10} textAnchor="middle" fill={ED.series1} fontSize={9}>
          N={r.N}
        </text>
      ))}
      {ticks.map((v) => (
        <text key={`tx${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
          {v}
        </text>
      ))}
      {ticks.map((v) => (
        <text key={`ty${v}`} x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v}
        </text>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        sqrt(N)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        sup_T / rms_T transfer constant
      </text>
    </svg>
  );
}

export default function Imp95645KroneckerTransferConstantViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Kronecker Sup/RMS Transfer Constant vs sqrt(N) (imp-95604/imp-95616)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a
        measurement/presentation-only page rendering the frozen imp-95616
        independent cross-check of the imp-95604 witness (no re-derivation). It
        changes no bound and proves no RH-relevant theorem. Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains state of the art. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        For the packet f(T)&nbsp;=&nbsp;&sum;<sub>p</sub> &Lambda;(p)&nbsp;p<sup>-&sigma;</sup>&nbsp;e(-T&nbsp;log&nbsp;p)
        at &sigma;<sub>B</sub>&nbsp;=&nbsp;{IMP95616_KRONECKER_SUPRMS_CROSSCHECK.sigmaB}, the Kronecker
        equidistribution of the phases {'{log p}'} drives sup<sub>T</sub>|f| to the
        triangle bound and rms<sub>T</sub>|f| to the L&sup2; baseline, so the
        sup/rms ratio attains the transfer constant (&sum;a<sub>p</sub>)/sqrt(&sum;a<sub>p</sub><sup>2</sup>).
        That constant lies in [1, sqrt(N)] and grows toward the sqrt(N) ceiling
        as the prime-set size N grows, but stays below it because the amplitudes
        &Lambda;(p)p<sup>-&sigma;</sup> are unequal. The chart below tracks the
        measured (solid blue) and theoretical (dashed gold) transfer constant
        against sqrt(N) (dashed gray ceiling) across the four prime-set sizes
        N&nbsp;=&nbsp;4,&nbsp;8,&nbsp;15,&nbsp;25.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        sup_T/rms_T transfer constant vs sqrt(N)
      </h3>
      <TransferConstantChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>N</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>sqrt(N)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>transfer constant (theory)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>sup/rms (measured)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>rms/L2</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>sup/triangle</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.N} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.N}</td>
              <td style={{ textAlign: 'right' }}>{r.sqrtN.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.transferConstantTheory.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.supOverRmsMeasured.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.rmsOverL2.toFixed(6)}</td>
              <td style={{ textAlign: 'right' }}>{r.supOverTriangle.toFixed(9)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Anchor-floor cancellation:</strong> the
        sqrt(H) transfer loss at the anchor floor width
        H&nbsp;&asymp;&nbsp;{IMP95616_KRONECKER_SUPRMS_CROSSCHECK.anchorFloor.H_FLOOR.toExponential(4)}{' '}
        exactly cancels the H<sup>-1/2</sup> mean-square saving
        (H<sup>-1/2</sup>&nbsp;&middot;&nbsp;sqrt(H)&nbsp;=&nbsp;{IMP95616_KRONECKER_SUPRMS_CROSSCHECK.anchorFloor.transferTimesSaving.toFixed(12)}),
        so the mean-square input transfers to trivial pointwise size at the anchor.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page
        rendering the frozen imp-95616 independent-grid reproduction of the
        imp-95604 witness (no re-derivation). Supplies no off-lattice floor
        theorem, changes no bound, establishes no operator positivity, no RH
        claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
