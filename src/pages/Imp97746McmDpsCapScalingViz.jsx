import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97746_ROWS,
  IMP97746_FIT_LINE,
  IMP97746_THEORY_LINE,
  IMP97746_SUMMARY,
} from '../data/imp-97746-mcm-dps-cap-scaling-viz-data.js';
import { ED } from '../styles/tokens.js';

const SNR1_COLOR = ED.series1;
const SNR10_COLOR = ED.series5;
const FIT_COLOR = ED.series4;
const THEORY_COLOR = ED.series2;

// Log-log chart of the trustworthy cap d*(dps) vs dps (= log10(1/eps)), with SNR=1 and SNR>=10
// point series plus the OLS-fitted and theoretical eps^{-1/4} lines overlaid.
function DpsCapScalingChart() {
  const svgW = 660;
  const padL = 55;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const svgH = 320;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const dpsMin = IMP97746_ROWS[0].dps;
  const dpsMax = IMP97746_ROWS[IMP97746_ROWS.length - 1].dps;
  const allLog10Caps = IMP97746_ROWS.flatMap((r) => [r.log10CapSnr1, r.log10CapSnr10]);
  const yMin = Math.min(...allLog10Caps) - 0.3;
  const yMax = Math.max(...allLog10Caps) + 0.3;

  const xOf = (dps) => padL + ((dps - dpsMin) / (dpsMax - dpsMin)) * plotW;
  const yOf = (log10Cap) => padT + plotH - ((log10Cap - yMin) / (yMax - yMin)) * plotH;

  const fitPath = `M${xOf(dpsMin)},${yOf(IMP97746_FIT_LINE.at(dpsMin))} L${xOf(dpsMax)},${yOf(
    IMP97746_FIT_LINE.at(dpsMax)
  )}`;
  const theoryPath = `M${xOf(dpsMin)},${yOf(IMP97746_THEORY_LINE.at(dpsMin))} L${xOf(dpsMax)},${yOf(
    IMP97746_THEORY_LINE.at(dpsMax)
  )}`;
  const snr1Path = IMP97746_ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xOf(r.dps)},${yOf(r.log10CapSnr1)}`).join(' ');
  const snr10Path = IMP97746_ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xOf(r.dps)},${yOf(r.log10CapSnr10)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

      <path d={theoryPath} fill="none" stroke={THEORY_COLOR} strokeWidth={1.5} strokeDasharray="2 3" />
      <path d={fitPath} fill="none" stroke={FIT_COLOR} strokeWidth={1.5} strokeDasharray="5 3" />
      <path d={snr10Path} fill="none" stroke={SNR10_COLOR} strokeWidth={1.5} />
      <path d={snr1Path} fill="none" stroke={SNR1_COLOR} strokeWidth={2} />

      {IMP97746_ROWS.map((r) => (
        <g key={r.dps}>
          <circle cx={xOf(r.dps)} cy={yOf(r.log10CapSnr1)} r={3.5} fill={SNR1_COLOR} />
          <circle cx={xOf(r.dps)} cy={yOf(r.log10CapSnr10)} r={3} fill={SNR10_COLOR} />
          <text x={xOf(r.dps)} y={svgH - 20} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
            dps={r.dps}
          </text>
        </g>
      ))}

      <text x={padL + plotW - 10} y={padT + 14} textAnchor="end" fill={THEORY_COLOR} fontSize={10}>
        theoretical slope 1/4
      </text>
      <text x={padL + plotW - 10} y={padT + 28} textAnchor="end" fill={FIT_COLOR} fontSize={10}>
        OLS fit slope {IMP97746_FIT_LINE.slope.toFixed(4)}
      </text>
      <text x={padL + 8} y={yOf(IMP97746_ROWS[0].log10CapSnr1) - 10} fill={SNR1_COLOR} fontSize={10}>
        SNR=1 cap
      </text>
      <text x={padL + 8} y={yOf(IMP97746_ROWS[0].log10CapSnr10) + 16} fill={SNR10_COLOR} fontSize={10}>
        SNR&ge;10 cap
      </text>
      <text
        transform={`translate(14, ${padT + plotH / 2}) rotate(-90)`}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9}
      >
        log10(d*)
      </text>
    </svg>
  );
}

export default function Imp97746McmDpsCapScalingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="MCM Kernel Cap-Scaling Ladder d*(dps) vs 1/eps (imp-97746 / imp-97724)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement/presentation-only
        page reshaping the frozen imp-97724 dps-cap fit verbatim (no re-derivation, no new
        computation). Changes no bound; MCM stays refuted from omega=11; Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97746_SUMMARY.reading}
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        d*(dps) vs dps = log10(1/eps), with the eps^{'{-1/4}'} fit and theory lines
      </h3>
      <DpsCapScalingChart />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>dps</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>d* (SNR=1)</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>d* (SNR&ge;10)</th>
          </tr>
        </thead>
        <tbody>
          {IMP97746_ROWS.map((row) => (
            <tr key={row.dps} style={{ color: 'var(--ink)', textAlign: 'right', borderTop: '1px solid var(--rule-soft)' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>{row.dps}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.capSnr1.toLocaleString()}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.capSnr10.toLocaleString()}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP97746_SUMMARY.verdict}
      </div>
    </div>
  );
}
