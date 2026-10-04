import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96413_LADDER,
  IMP96413_SCALING,
  IMP96413_FINDING,
  IMP96413_HONEST_BANNER,
} from '../data/imp-96413-count-model-sensitivity-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

function SensitivityLadderChart() {
  const svgW = 680;
  const svgH = 300;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 60;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logMags = IMP96413_LADDER.map((r) => Math.log10(r.absRateRelShift));
  const logMax = Math.max(...logMags);
  const logMin = Math.min(...logMags);
  const span = logMax - logMin || 1;
  const yMax = Math.ceil(logMax + 0.5);
  const yMin = Math.floor(logMin - 0.5 * (span / span || 1) - 0.5);

  const yOf = (log10v) => padT + plotH - ((log10v - yMin) / (yMax - yMin)) * plotH;
  const barW = plotW / IMP96413_LADDER.length * 0.5;

  const colors = [ED.series7, ED.series6];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i).map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.2} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
            {`1e${v}`}
          </text>
        </g>
      ))}

      {IMP96413_LADDER.map((r, i) => {
        const cx = padL + (plotW / IMP96413_LADDER.length) * (i + 0.5);
        const top = yOf(Math.log10(r.absRateRelShift));
        const base = padT + plotH;
        return (
          <g key={r.label}>
            <rect
              x={cx - barW / 2}
              y={top}
              width={barW}
              height={base - top}
              fill={colors[i]}
              opacity={0.75}
              rx={3}
            />
            <text x={cx} y={top - 8} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
              {r.absRateRelShift.toExponential(2)}
            </text>
            <text x={cx} y={base + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
              {`N = ${r.N.toExponential(0)}`}
            </text>
            <text x={cx} y={base + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
              {i === 0 ? '(imp-96290, baked)' : '(imp-96363, reconstructed)'}
            </text>
          </g>
        );
      })}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <text x={padL - 55} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9} transform={`rotate(-90, ${padL - 55}, ${padT + plotH / 2})`}>
        {'|relative E_coll shift| (log scale)'}
      </text>
    </svg>
  );
}

export default function Imp96413CountModelSensitivityLadderViz() {
  const rung0 = IMP96413_LADDER[0];
  const rung1 = IMP96413_LADDER[1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96387 / imp-96363: +7/8 Count-Model Relative Sensitivity Ladder" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96413_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        Switching from the Riemann-von Mangoldt main-term zero count to the +7/8-corrected count
        shifts the E_coll anchor by relative {rung0.absRateRelShift.toExponential(2)} at the
        independently baked N = {rung0.N.toExponential(0)} anchor (imp-96290), versus only{' '}
        {rung1.absRateRelShift.toExponential(2)} at the reconstructed N = {rung1.N.toExponential(0)}{' '}
        anchor (imp-96363) — about {IMP96413_SCALING.rateSensitivityRatio.toFixed(0)}x larger.
        The sensitivity scales with height, roughly tracking the {IMP96413_SCALING.heightRatio.toFixed(0)}x
        ratio of the two anchor heights.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Relative E_coll shift under the +7/8 count-model swap, by anchor height
      </h3>
      <SensitivityLadderChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> each bar is the absolute
        value of the relative E_coll shift induced by the +7/8 count-model correction, at that
        anchor height, on a log scale. The pink bar (N = 1e4) is the ONE independently baked
        anchor pair; the cyan bar (N = 1e6) is reconstructed from the imp-96311 rate formula. The
        gap between them is the measured ~1/N scaling of the count-model sensitivity.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP96413_FINDING}
      </div>
    </div>
  );
}
