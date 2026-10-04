import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34497_STACK_TERMS,
  IMP34497_E_N,
  IMP34497_E_N_OVER_E_TRUNC,
  IMP34497_L_PT,
  IMP34497_L_PT_OVER_E_N,
  IMP34497_N_CROSS,
  IMP34497_SIGMA,
} from '../data/imp-34497-crossover-en-assembly-viz-data.js';
import { ED } from '../styles/tokens.js';

// Stacked horizontal bar: E_trunc + E_flow + E_coll summing to the headline E(N).
function StackedAssemblyBar() {
  const svgW = 680;
  const svgH = 110;
  const padL = 24;
  const padR = 24;
  const barY = 36;
  const barH = 34;
  const cW = svgW - padL - padR;

  const total = IMP34497_STACK_TERMS.reduce((s, t) => s + t.value, 0);
  let x = padL;
  const segments = IMP34497_STACK_TERMS.map((t) => {
    const w = (t.value / total) * cW;
    const seg = { ...t, x, w };
    x += w;
    return seg;
  });

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {segments.map((s) => (
        <g key={s.key}>
          <rect x={s.x} y={barY} width={Math.max(s.w, 0.5)} height={barH} fill={s.color} stroke={ED.paper} strokeWidth={1} />
          {s.w > 60 && (
            <text x={s.x + s.w / 2} y={barY + barH / 2 + 4} textAnchor="middle" fill={ED.paper} fontSize={11} fontWeight={700}>
              {s.label}
            </text>
          )}
        </g>
      ))}
      <line x1={padL} y1={barY + barH + 8} x2={padL + cW} y2={barY + barH + 8} stroke={ED.rule} strokeWidth={1} />
      <text x={padL} y={barY + barH + 24} fill={ED.inkFaint} fontSize={9.5}>
        0
      </text>
      <text x={padL + cW} y={barY + barH + 24} textAnchor="end" fill={ED.inkFaint} fontSize={9.5}>
        E(N) = {IMP34497_E_N.toExponential(4)}
      </text>
      <text x={padL} y={18} fill={ED.inkSoft} fontSize={10.5} fontWeight={700}>
        headline assembly at N_cross &asymp; {IMP34497_N_CROSS.toExponential(3)} (sigma &asymp; {IMP34497_SIGMA.toFixed(3)})
      </text>
    </svg>
  );
}

// Log-scale comparison: the headline E(N) slack sits ~1975x below the unconditional L_pt beat.
function LogScaleComparisonBar() {
  const svgW = 680;
  const svgH = 160;
  const padL = 90;
  const padR = 40;
  const padT = 20;
  const padB = 30;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logMin = Math.log10(IMP34497_E_N) - 0.5;
  const logMax = Math.log10(IMP34497_L_PT) + 0.5;
  const xAt = (v) => padL + ((Math.log10(v) - logMin) / (logMax - logMin)) * cW;

  const rows = [
    { label: 'E(N) headline slack', value: IMP34497_E_N, color: ED.brass, y: padT + 20 },
    { label: 'L_pt finite-height beat', value: IMP34497_L_PT, color: ED.series1, y: padT + 70 },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r) => (
        <g key={r.label}>
          <text x={padL - 8} y={r.y + 5} textAnchor="end" fill={ED.inkSoft} fontSize={10}>
            {r.label}
          </text>
          <line x1={padL} y1={r.y} x2={xAt(r.value)} y2={r.y} stroke={r.color} strokeWidth={10} strokeLinecap="round" />
          <text x={xAt(r.value) + 8} y={r.y + 4} fill={r.color} fontSize={10} fontFamily="monospace">
            {r.value.toExponential(3)}
          </text>
        </g>
      ))}

      {/* bracket annotating the ~1975x factor between the two rows */}
      <line x1={xAt(IMP34497_E_N)} y1={padT + 20 + 14} x2={xAt(IMP34497_E_N)} y2={padT + 70 - 14} stroke={ED.rule} strokeWidth={1} strokeDasharray="3,3" />
      <text x={xAt(IMP34497_E_N) + 6} y={(padT + 20 + padT + 70) / 2 + 4} fill={ED.ink} fontSize={11} fontWeight={700}>
        &times;{IMP34497_L_PT_OVER_E_N.toFixed(1)}
      </text>

      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log&#8321;&#8320; scale
      </text>
    </svg>
  );
}

export default function Imp34497CrossoverEnAssemblyViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Headline E(N) Assembly at the E_coll = E_trunc Crossover (imp-34497 / imp-34453)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34453 assembled the full headline E(N) = E_trunc + E_flow + E_coll at the imp-3444
        E_coll&nbsp;=&nbsp;E_trunc crossover N&nbsp;&asymp;&nbsp;3.28e9 (the sigma-halving landmark),
        finding it is, to 0.19%, exactly TWICE the truncation floor
        (E(N)/E_trunc&nbsp;=&nbsp;{IMP34497_E_N_OVER_E_TRUNC.toFixed(4)}), and that this GUE-conditional
        slack sits a factor &asymp;{IMP34497_L_PT_OVER_E_N.toFixed(0)} BELOW the unconditional
        finite-height beat L_pt&nbsp;&asymp;&nbsp;0.121. No viz existed for this assembly.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        three stacked sub-terms summing to the headline E(N)
      </p>
      <StackedAssemblyBar />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.75rem', marginBottom: '0.5rem' }}>
        headline slack vs the unconditional finite-height beat L_pt
      </p>
      <LogScaleComparisonBar />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, the three-term
        assembly and the L_pt comparison are reused verbatim from imp-34453. Measurement only within
        the inherited imp-3220/imp-3406 component model, NOT a rigorous asymptotic; C_mb
        GUE-conditional per imp-486 UNTOUCHED; changes no bound; no RH verdict, NO QED.
      </div>
    </div>
  );
}
