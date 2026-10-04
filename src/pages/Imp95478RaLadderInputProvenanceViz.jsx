import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95448_RA_LADDER_INPUT_DATA_AUDIT } from '../data/imp-95448-ra-ladder-input-data-audit.js';
import { ED, alpha } from '../styles/tokens.js';

const DATA = IMP95448_RA_LADDER_INPUT_DATA_AUDIT;
const TABLE_END_INDEX = 869; // ZETA_ZEROS has 870 entries, indices 0..869

// Rung -> top ordinate index it reads (N-th zero at index N-1).
const RUNGS = DATA.pathCRungs.map((N) => ({
  N,
  topIndex: N - 1,
  crossesCorruptBlock: N > DATA.cleanRungMax,
}));

function RungExposurePanel() {
  const svgW = 640;
  const svgH = 260;
  const padL = 70;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const xMax = TABLE_END_INDEX;
  const xOf = (idx) => padL + (idx / xMax) * plotW;
  const rowH = plotH / RUNGS.length;
  const onsetX = xOf(DATA.corruptionBoundary.corruptionOnsetIndex);
  const lastGoodX = xOf(DATA.corruptionBoundary.lastGoodIndex);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* corrupt-block band (now repaired) */}
      <rect
        x={onsetX}
        y={padT}
        width={xOf(TABLE_END_INDEX) - onsetX}
        height={plotH}
        fill={alpha(ED.series4, 0.1)}
      />
      <line x1={onsetX} y1={padT} x2={onsetX} y2={padT + plotH} stroke={ED.series4} strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={onsetX + 4} y={padT + 12} fill={ED.series4} fontSize={9}>
        index 650 (formerly corrupt, repaired)
      </text>
      <line x1={lastGoodX} y1={padT} x2={lastGoodX} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} strokeDasharray="2 2" />

      {RUNGS.map((r, i) => {
        const y = padT + i * rowH + rowH / 2;
        const barColor = r.crossesCorruptBlock ? ED.series4 : ED.series1;
        return (
          <g key={r.N}>
            <line x1={padL} y1={y} x2={xOf(r.topIndex)} y2={y} stroke={barColor} strokeWidth={7} strokeLinecap="round" opacity={0.85} />
            <circle cx={xOf(r.topIndex)} cy={y} r={4.5} fill="#e2e8f0" stroke={barColor} strokeWidth={2} />
            <text x={padL - 8} y={y + 3} textAnchor="end" fill={ED.inkSoft} fontSize={10}>
              N={r.N}
            </text>
            <text x={xOf(r.topIndex) + 8} y={y + 3} fill={ED.inkFaint} fontSize={8.5}>
              index &lt; {r.topIndex + 1}
            </text>
          </g>
        );
      })}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[0, 200, 400, 650, 869].map((v) => (
        <g key={v}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        ZETA_ZEROS index read by each Path C rung (N-th zero at index N-1)
      </text>
    </svg>
  );
}

function StabilityWitnessPanel() {
  const svgW = 640;
  const svgH = 160;
  const padL = 70;
  const padR = 24;
  const padT = 24;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const [lo, hi] = DATA.neighbourFactorRange;
  const xMin = 1;
  const xMax = 1.3;
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;
  const midY = padT + plotH / 2;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={midY} x2={padL + plotW} y2={midY} stroke={ED.rule} strokeWidth={1} />
      <rect x={xOf(lo)} y={midY - 14} width={xOf(hi) - xOf(lo)} height={28} fill={alpha(ED.series1, 0.18)} stroke={ED.series1} strokeWidth={1.5} />
      <text x={(xOf(lo) + xOf(hi)) / 2} y={midY - 20} textAnchor="middle" fill={ED.series1} fontSize={10}>
        neighbour factor [{lo}, {hi}] (validated across all 5 exact low-N rungs)
      </text>
      <circle cx={xOf(1.0)} cy={midY} r={4} fill={ED.series2} />
      <text x={xOf(1.0)} y={midY + 26} textAnchor="middle" fill={ED.series2} fontSize={9}>
        N = 8 witness
        <tspan x={xOf(1.0)} dy={11}>
          (heat = RK4)
        </tspan>
      </text>
      {[1.0, 1.06, 1.19, 1.3].map((v) => (
        <g key={v}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp95478RaLadderInputProvenanceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-95448 R_A Ladder Input Provenance" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a provenance-only chart of
        which ZETA_ZEROS indices the imp-95372 R_A Path C ladder rungs read, and where the exact
        heat-vs-RK4 t_c cross-check has been witnessed. It re-derives no proof and changes no
        bound. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art. RH does not follow
        from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The Path C fit rungs {DATA.pathCRungs.join(', ')} each read the recorded Odlyzko ordinates
        up to their own N-th zero. The four low-N rungs (N &le; {DATA.cleanRungMax}) sit strictly
        below the ZETA_ZEROS corruption onset at index {DATA.corruptionBoundary.corruptionOnsetIndex}
        {' '}and were never contaminated; only the single high-N rung N = {DATA.highNRung} crosses
        the formerly-corrupt block (indices {DATA.corruptionBoundary.corruptionOnsetIndex}..
        {TABLE_END_INDEX}), which was repaired 2026-06-11 and is pinned by a build-time tripwire.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Rung data-block exposure (clean prefix vs formerly-corrupt block)
      </h3>
      <RungExposurePanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Exact-heat vs RK4 t_c witness and the neighbour-perturbation factor band
      </h3>
      <StabilityWitnessPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the top panel shows every
        rung as a horizontal bar from index 0 to its highest-read index; blue bars stay inside the
        corruption-clean prefix, the orange bar (N = {DATA.highNRung}) is the only one crossing
        into the now-repaired block. The bottom panel shows the single N = 8 point where the exact
        heat-semigroup t_c and the dynamical RK4 t_c have been directly cross-checked, sitting
        inside the wider [{DATA.neighbourFactorRange[0]}, {DATA.neighbourFactorRange[1]}] neighbour
        factor band validated across all five exact low-N rungs.
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
        imp-95448 baked record directly (rung set, corruption boundary, and neighbour-factor range
        copied verbatim). Closing this provenance leg produces no Lambda bound; R_A stays open via
        parts (b)/(c) and the imp-2563-sub-pathc-ladder-replace-highN residual while imp-2621 and
        imp-35164 stand. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
