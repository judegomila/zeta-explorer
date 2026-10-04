import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33988_F3_LANDMARK_LAW_RECOMPUTE_NEWTON_CROSSCHECK } from '../data/imp-33988-f3-landmark-law-recompute-newton-crosscheck.js';
import { ED } from '../styles/tokens.js';

const { marks: MARKS } = IMP33988_F3_LANDMARK_LAW_RECOMPUTE_NEWTON_CROSSCHECK;

const ESTIMATES = [
  { key: 'e1_f2_closedform_log10N', label: 'E1 F2 closed-form', color: ED.series2 },
  { key: 'e3_newton_actual_exponent_log10N', label: 'E3 Newton (actual)', color: ED.series3 },
  { key: 'e2_law_direct_full_inversion_log10N', label: 'E2 law-direct (full RvM)', color: ED.series1 },
];

// One row per landmark (1% / 0.1%), three dots on a shared log10 N axis marking E1/E3/E2 with a
// connecting line, so the coherent E1 < E3 < E2 ordering and the ~1% relative spread are visible.
function LandmarkSpreadRows() {
  const svgW = 640;
  const rowH = 110;
  const svgH = rowH * MARKS.length + 30;
  const padL = 64;
  const padR = 24;
  const plotW = svgW - padL - padR;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {MARKS.map((m, i) => {
        const values = ESTIMATES.map((e) => m[e.key]);
        const vMin = Math.min(...values);
        const vMax = Math.max(...values);
        const span = vMax - vMin || 1;
        const xOf = (v) => padL + ((v - vMin) / span) * plotW;
        const rowY = i * rowH + 20;
        const lineY = rowY + 44;

        return (
          <g key={m.landmark}>
            <text x={padL} y={rowY} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
              {m.landmark}
            </text>
            <line x1={padL} y1={lineY} x2={svgW - padR} y2={lineY} stroke={ED.rule} strokeWidth={1.5} />
            {ESTIMATES.map((e) => {
              const v = m[e.key];
              const x = xOf(v);
              return (
                <g key={e.key}>
                  <line x1={x} y1={lineY - 10} x2={x} y2={lineY + 10} stroke={e.color} strokeWidth={1} opacity={0.5} />
                  <circle cx={x} cy={lineY} r={5} fill={e.color} />
                  <text x={x} y={lineY - 16} textAnchor="middle" fill={e.color} fontSize={9.5} fontWeight={700}>
                    {v.toFixed(2)}
                  </text>
                  <text x={x} y={lineY + 24} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
                    {e.label}
                  </text>
                </g>
              );
            })}
            <text x={padL} y={rowY + rowH - 24} fill={ED.inkFaint} fontSize={9}>
              log10 N axis (span {span.toFixed(2)} decades, log T0 target = {m.logT0_target})
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp34052F3LandmarkThreeWaySpreadViz() {
  const m1 = MARKS[0];
  const m2 = MARKS[1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="F3 Three-Way Landmark Spread (imp-33988)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-33816 sigma(N) post-peak local exponent p(N) approaches the imp-3463 far-tail 1/2 from
        below. Its "within 1%" and "within 0.1%" near-asymptote landmarks (in log10 N) are located three
        independent ways: (E1) the F2 closed-form ln N ~ log T0 collapse; (E2) the same leading law with
        the full RvM inversion ln N = u + log(u - 1); and (E3) an independent Newton root-find on the
        actual exponent p(N) = target. All three order coherently E1 &lt; E3 &lt; E2 and agree to ~1% in
        log10 N, confirming the imp-33816 "1e44 / 1e434" quote.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        E1 / E3 / E2 landmark positions on a per-row log10 N axis
      </p>
      <LandmarkSpreadRows />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement / cross-check only, not a
        rigorous asymptotic. The E1-&gt;E2 spread ({m1.e2_vs_e1_decades.toFixed(2)} decades at 1%,{' '}
        {m2.e2_vs_e1_decades.toFixed(2)} at 0.1%) is the restored RvM sub-leading terms; the E2-&gt;E3
        offset ({m1.e3_vs_e2_decades.toFixed(2)} / {m2.e3_vs_e2_decades.toFixed(2)} decades) is the
        imp-33949 finite-log-T0 shortfall of the leading law -- no new mechanism. C_mb GUE-conditional per
        imp-486 untouched; changes no bound; NO QED.
      </div>
    </div>
  );
}
