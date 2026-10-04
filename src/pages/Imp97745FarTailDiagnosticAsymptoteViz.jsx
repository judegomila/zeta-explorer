import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97745_DIAGNOSTIC_ROWS,
  IMP97745_CROSSINGS,
  IMP97745_SUMMARY,
} from '../data/imp-97745-fartail-diagnostic-asymptote-viz-data.js';
import { ED } from '../styles/tokens.js';

const DIAG_COLOR = ED.series1;
const OVERLAY_COLOR = ED.series4;
const CROSSING_COLOR = ED.series2;

// Line chart of the measured diagnostic against the exact RvM-slope overlay across the
// log10(N) = 18..300 baked ladder, with the 0.99/0.995 crossing heights marked.
function DiagnosticAsymptoteChart() {
  const svgW = 660;
  const padL = 55;
  const padR = 20;
  const padT = 20;
  const padB = 45;
  const svgH = 320;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logNMin = IMP97745_DIAGNOSTIC_ROWS[0].logN;
  const logNMax = IMP97745_DIAGNOSTIC_ROWS[IMP97745_DIAGNOSTIC_ROWS.length - 1].logN;
  const yMin = Math.min(...IMP97745_DIAGNOSTIC_ROWS.map((r) => Math.min(r.diag, r.slopeRvM))) - 0.005;
  const yMax = 1.001;

  const xOf = (logN) => padL + ((logN - logNMin) / (logNMax - logNMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const diagPath = IMP97745_DIAGNOSTIC_ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xOf(r.logN)},${yOf(r.diag)}`).join(' ');
  const overlayPath = IMP97745_DIAGNOSTIC_ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xOf(r.logN)},${yOf(r.slopeRvM)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

      {/* asymptote = 1 reference line */}
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke={ED.rule} strokeWidth={1} strokeDasharray="2 3" />
      <text x={padL + 4} y={yOf(1) - 4} fill={ED.inkFaint} fontSize={9}>
        limit = 1
      </text>

      {/* 0.99 / 0.995 crossing markers */}
      {[
        { log10N: IMP97745_CROSSINGS.log10N_99, label: `crosses 0.99 @ 1e${IMP97745_CROSSINGS.log10N_99}` },
        { log10N: IMP97745_CROSSINGS.log10N_995, label: `crosses 0.995 @ 1e${IMP97745_CROSSINGS.log10N_995}` },
      ].map((c) => (
        <g key={c.label}>
          <line
            x1={xOf(c.log10N)}
            y1={padT}
            x2={xOf(c.log10N)}
            y2={padT + plotH}
            stroke={CROSSING_COLOR}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <text
            x={xOf(c.log10N)}
            y={padT + 10}
            textAnchor="middle"
            fill={CROSSING_COLOR}
            fontSize={8}
          >
            {c.label}
          </text>
        </g>
      ))}

      <path d={overlayPath} fill="none" stroke={OVERLAY_COLOR} strokeWidth={1.5} strokeDasharray="5 3" />
      <path d={diagPath} fill="none" stroke={DIAG_COLOR} strokeWidth={2} />

      {IMP97745_DIAGNOSTIC_ROWS.map((r) => (
        <g key={r.key}>
          <circle cx={xOf(r.logN)} cy={yOf(r.diag)} r={3} fill={DIAG_COLOR} />
          <text x={xOf(r.logN)} y={svgH - 24} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
            1e{r.logN}
          </text>
        </g>
      ))}

      <text x={padL + plotW - 10} y={yOf(IMP97745_DIAGNOSTIC_ROWS[0].diag) + 14} textAnchor="end" fill={DIAG_COLOR} fontSize={10}>
        measured diag
      </text>
      <text x={padL + plotW - 10} y={padT + 22} textAnchor="end" fill={OVERLAY_COLOR} fontSize={10}>
        1 - 1/log(T0/2pi)
      </text>
    </svg>
  );
}

export default function Imp97745FarTailDiagnosticAsymptoteViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Far-Tail Diagnostic Asymptote-to-One (imp-97745 / imp-97723)" />

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
        page reshaping the frozen imp-97723 diagnostic ladder verbatim (no re-derivation, no new
        computation). Conditional-share diagnostic, NOT an RH bound; Platt&ndash;Trudgian &Lambda;
        &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97745_SUMMARY.reading}
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        (1/2 - p) * 2 log T0 vs the exact RvM slope 1 - 1/log(T0/2pi), N = 1e18..1e300
      </h3>
      <DiagnosticAsymptoteChart />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>diag (measured)</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>1 - 1/log(T0/2pi)</th>
          </tr>
        </thead>
        <tbody>
          {IMP97745_DIAGNOSTIC_ROWS.map((row) => (
            <tr key={row.key} style={{ color: 'var(--ink)', textAlign: 'right', borderTop: '1px solid var(--rule-soft)' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>1e{row.logN}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.diag.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.slopeRvM.toFixed(4)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP97745_SUMMARY.verdict}
      </div>
    </div>
  );
}
