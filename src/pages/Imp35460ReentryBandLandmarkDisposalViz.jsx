import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35460_LANDMARKS, IMP35460_SUMMARY } from '../data/imp-35460-reentry-band-landmark-disposal-viz-data.js';
import { ED } from '../styles/tokens.js';

// Number line placing the two demoted absolute-coordinate edges on a log10 N axis, with the
// surviving band-width bracket drawn between them; the two structural (non-numeric) survivors
// are listed below rather than plotted, since they are not points on this axis.
function DisposalNumberLine() {
  const svgW = 640;
  const padL = 40;
  const padR = 40;
  const plotW = svgW - padL - padR;
  const svgH = 130;
  const axisY = 66;

  const reentry = IMP35460_LANDMARKS.find((l) => l.id === 'reentry-edge');
  const exit = IMP35460_LANDMARKS.find((l) => l.id === 'exit-edge');

  const domainMin = 20;
  const domainMax = 44;
  const xOf = (v) => padL + ((v - domainMin) / (domainMax - domainMin)) * plotW;

  const xReentry = xOf(reentry.value);
  const xExit = xOf(exit.value);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={axisY} x2={padL + plotW} y2={axisY} stroke={ED.rule} strokeWidth={1.5} />

      {[20, 25, 30, 35, 40, 44].map((v) => (
        <g key={v}>
          <line x1={xOf(v)} y1={axisY - 4} x2={xOf(v)} y2={axisY + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={axisY + 18} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={axisY + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 N
      </text>

      <line x1={xReentry} y1={axisY} x2={xExit} y2={axisY} stroke={ED.series1} strokeWidth={4} opacity={0.55} />
      <text x={(xReentry + xExit) / 2} y={axisY - 12} textAnchor="middle" fill={ED.series1} fontSize={9.5} fontFamily="monospace">
        width ~10.08 (surviving)
      </text>

      {[
        { x: xReentry, node: reentry, dir: -1 },
        { x: xExit, node: exit, dir: 1 },
      ].map(({ x, node, dir }) => (
        <g key={node.id}>
          <circle cx={x} cy={axisY} r={5} fill={ED.series2} stroke={ED.paper} strokeWidth={1} />
          <text
            x={x}
            y={axisY + dir * -22 + (dir === -1 ? 0 : 0)}
            textAnchor="middle"
            fill={ED.series2}
            fontSize={9.5}
            fontFamily="monospace"
          >
            {node.label} 10^{node.value.toFixed(2)}
          </text>
          <text x={x} y={axisY + 42} textAnchor="middle" fill={ED.series2} fontSize={8.5}>
            DEMOTED
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp35460ReentryBandLandmarkDisposalViz() {
  const demoted = IMP35460_LANDMARKS.filter((l) => l.demoted);
  const surviving = IMP35460_LANDMARKS.filter((l) => !l.demoted);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Reentry-Band Landmark Disposal Split: 2 Demoted vs 3 Surviving (imp-35460 / imp-35415)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35356 found that the only self-contained route to meeting R1 (route ii, the
        pure-artifact proof) resolves it in the DISPOSAL direction: the imp-34997/imp-35111
        reentry band is a machine-precision artifact of the discrete ceil, not a feature of the
        true dynamic. imp-35415 scoped which of the five inherited reentry-band landmarks that
        disposal demotes to a surrogate coordinate versus which survive as legitimate
        surrogate-map diagnostics. This page visualizes that 2-vs-3 split.
      </p>

      <DisposalNumberLine />

      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 260px', border: '1px solid #7f1d1d', borderRadius: 6, padding: '0.75rem 1rem' }}>
          <div style={{ color: 'var(--series-2)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            ARTIFACT-LABELED / demoted ({demoted.length})
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--ink)', fontSize: '0.82rem' }}>
            {demoted.map((l) => (
              <li key={l.id} style={{ marginBottom: '0.3rem' }}>
                {l.label} (10^{l.value.toFixed(2)} {l.unit}) &mdash; floor-determined absolute coordinate
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: '1 1 260px', border: '1px solid var(--series-6)', borderRadius: 6, padding: '0.75rem 1rem' }}>
          <div style={{ color: 'var(--series-1)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            SURVIVING surrogate-map diagnostic ({surviving.length})
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--ink)', fontSize: '0.82rem' }}>
            {surviving.map((l) => (
              <li key={l.id} style={{ marginBottom: '0.3rem' }}>
                {l.label}
                {l.value != null ? ` (~${l.value.toFixed(2)} ${l.unit})` : ''} &mdash; floor-structural, not an
                absolute coordinate
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem' }}>
        Of the five inherited landmarks, {IMP35460_SUMMARY.demotedCount} (the absolute edge
        positions) demote to machine-precision surrogate coordinates because their whole
        magnitude is floor-determined (D1: ~11.99 decades per factor-2 change in EPS_FP). The
        other {IMP35460_SUMMARY.survivingCount} encode floor-structural information about the
        surrogate map itself and survive independent of the dynamic-reality claim.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-35415 scoping verbatim; no new derivation, no bound changed.
        Discharges nothing: R1 stays the OPEN binding obstruction; imp-35111a / imp-35174a /
        imp-34997a / imp-35243a stay OPEN; route (ii) itself remains to be formalized (imp-35357).
        C_C&nbsp;=&nbsp;(1/8)&nbsp;sqrt(3&nbsp;pi) ansatz (imp-2642/2643) and C_mb GUE-conditional
        per imp-486 UNTOUCHED; far-tail exponent stays 1/2 (imp-3463); changes no bound;
        establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
