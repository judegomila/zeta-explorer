import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95668_DEFICIT_SERIES,
  IMP95668_LIMIT,
  IMP95668_CLOSED_FORM_EXCESS,
  IMP95668_CAVEAT_BANNER,
} from '../data/imp-95668-deficit-fartail-viz-data.js';
import { ED } from '../styles/tokens.js';

function DeficitExcessPanel() {
  const svgW = 640;
  const svgH = 260;
  const padL = 48;
  const padR = 24;
  const padT = 24;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xLo = IMP95668_DEFICIT_SERIES[0].log10N - 20;
  const xHi = IMP95668_DEFICIT_SERIES[IMP95668_DEFICIT_SERIES.length - 1].log10N + 20;
  const yLo = 0.495;
  const yHi = 0.515;
  const xOf = (log10N) => padL + ((log10N - xLo) / (xHi - xLo)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yLo) / (yHi - yLo)) * plotH;

  const excessPoints = IMP95668_DEFICIT_SERIES.map((p) => `${xOf(p.log10N)},${yOf(p.excess)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* 1/2 asymptote */}
      <line x1={padL} y1={yOf(IMP95668_LIMIT)} x2={padL + plotW} y2={yOf(IMP95668_LIMIT)} stroke={ED.rule} strokeDasharray="4 3" strokeWidth={1} />
      <text x={padL + 4} y={yOf(IMP95668_LIMIT) - 6} fill={ED.inkFaint} fontSize={9.5}>
        exact limit D(N) -&gt; 1/2
      </text>

      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {/* closed-form excess curve */}
      <polyline points={excessPoints} fill="none" stroke={ED.brassDeco} strokeWidth={2} />
      {IMP95668_DEFICIT_SERIES.map((p) => (
        <circle key={`excess-${p.log10N}`} cx={xOf(p.log10N)} cy={yOf(p.excess)} r={4} fill={ED.brassDeco} />
      ))}

      {/* measured plateau */}
      {IMP95668_DEFICIT_SERIES.map((p) => (
        <circle key={`measured-${p.log10N}`} cx={xOf(p.log10N)} cy={yOf(p.measured)} r={4} fill="none" stroke={ED.series1} strokeWidth={2} />
      ))}

      {IMP95668_DEFICIT_SERIES.map((p) => (
        <text key={`lbl-${p.log10N}`} x={xOf(p.log10N)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
          {p.log10N}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 N
      </text>
      <text x={12} y={padT + plotH / 2} transform={`rotate(-90 12 ${padT + plotH / 2})`} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        D(N)
      </text>

      {/* legend */}
      <circle cx={padL + plotW - 150} cy={padT + 8} r={4} fill={ED.brassDeco} />
      <text x={padL + plotW - 140} y={padT + 12} fill={ED.brass} fontSize={9.5}>closed-form excess</text>
      <circle cx={padL + plotW - 150} cy={padT + 24} r={4} fill="none" stroke={ED.series1} strokeWidth={2} />
      <text x={padL + plotW - 140} y={padT + 28} fill={ED.series1} fontSize={9.5}>measured (imp-95614 X4)</text>
    </svg>
  );
}

export default function Imp95668DeficitFartailLimitViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Far-Tail Deficit Invariant: Excess Toward the 1/2 Limit (imp-95638 / imp-95668)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95614 X4 measurement found the deficit invariant D(N) = (1/2 - p(N)) ln N settling
        slowly near ~0.508 across N = 1e24..1e300 without an exact target. imp-95638 derived the
        closed form D(N) = {IMP95668_CLOSED_FORM_EXCESS}, showing the plateau is not a distinct
        constant but the finite-N excess above the exact limit 1/2. The curve below overlays the
        closed-form excess (solid, filled circles) against the measured plateau values (open
        circles) and the 1/2 asymptote (dashed).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
        D(N) vs log10 N -- closed-form excess tracking the measured plateau, decaying toward 1/2
      </h3>
      <DeficitExcessPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95668_CAVEAT_BANNER}
      </div>
    </div>
  );
}
