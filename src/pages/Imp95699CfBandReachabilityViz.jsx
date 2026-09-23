import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95699_CF_BAND_REACHABILITY_VIZ as V } from '../data/imp-95699-cf-band-reachability-viz-data.js';

function CfBandReachabilityChart() {
  const svgW = 640;
  const padL = 40;
  const padR = 40;
  const padT = 30;
  const padB = 46;
  const cW = svgW - padL - padR;
  const rowH = 60;
  const svgH = padT + rowH + padB;

  const xS = (v) => padL + cW * ((v - V.axisMin) / (V.axisMax - V.axisMin));
  const ticks = [0.75, 0.9, 1.0, 1.1, 1.25, 1.4, 1.5];
  const axisY = padT + rowH / 2;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={rowH} fill="#0a0f1a" rx={2} />

      {/* honest provenance band */}
      <rect
        x={xS(V.band.lo_generous)}
        y={padT + 8}
        width={xS(V.band.hi) - xS(V.band.lo_generous)}
        height={rowH - 16}
        fill="#22c55e"
        opacity={0.14}
      />
      <text x={xS(V.band.lo_generous) + 4} y={padT + 20} fill="#4ade80" fontSize={9}>
        honest band [{V.band.lo_generous.toFixed(4)}, {V.band.hi.toFixed(2)}]
      </text>

      {/* axis line + ticks */}
      <line x1={padL} y1={axisY} x2={padL + cW} y2={axisY} stroke="#334155" strokeWidth={1} />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={xS(t)} y1={axisY - 4} x2={xS(t)} y2={axisY + 4} stroke="#475569" strokeWidth={1} />
          <text x={xS(t)} y={padT + rowH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      {/* rigorous floor marker (dashed) */}
      <line
        x1={xS(V.band.lo_rigorous)}
        y1={padT + 4}
        x2={xS(V.band.lo_rigorous)}
        y2={padT + rowH - 4}
        stroke="#4ade80"
        strokeWidth={1}
        strokeDasharray="2,2"
        opacity={0.7}
      />

      {/* nominal cf=1.0 marker */}
      <circle cx={xS(V.cfNominal)} cy={axisY} r={4.5} fill="#38bdf8" />
      <text x={xS(V.cfNominal)} y={padT - 6} textAnchor="middle" fill="#38bdf8" fontSize={9}>
        nominal {V.cfNominal.toFixed(2)}
      </text>

      {/* foreclosure gap arrow */}
      <line
        x1={xS(V.cfStar)}
        y1={axisY - 18}
        x2={xS(V.band.lo_generous)}
        y2={axisY - 18}
        stroke="#f87171"
        strokeWidth={1}
        opacity={0.7}
      />
      <text
        x={(xS(V.cfStar) + xS(V.band.lo_generous)) / 2}
        y={axisY - 22}
        textAnchor="middle"
        fill="#f87171"
        fontSize={8}
      >
        gap {V.foreclosureMargin.toFixed(3)} (~{V.overshootFactor}x)
      </text>

      {/* cf* wedge-closure marker, outside the band */}
      <circle cx={xS(V.cfStar)} cy={axisY} r={5.5} fill="#f87171" />
      <text x={xS(V.cfStar)} y={padT + rowH + 32} textAnchor="middle" fill="#f87171" fontSize={9}>
        cf* = {V.cfStar.toFixed(5)} (FORECLOSED)
      </text>

      <rect x={padL} y={padT} width={cW} height={rowH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        {V.axisLabel}
      </text>
    </svg>
  );
}

export default function Imp95699CfBandReachabilityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="C_F Provenance-Band Reachability (imp-95674 / imp-95660 / imp-95699)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95660 measured that the imp-95617 transition-knee E_flow inversion wedge closes
        at a C_F multiplier cf* &asymp; {V.cfStar.toFixed(3)}. imp-95674 then assembled the
        honest imp-398 C_F provenance band (its Polymath15/Gronwall lineage plus the imp-1134
        downward-tightening audit) and found cf* sits strictly below even the most generous
        honest floor. The chart below places the band, the nominal cf=1.0 point, and cf* on a
        single multiplier axis.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        C_F multiplier axis: honest provenance band vs. wedge-closure cf*
      </p>
      <CfBandReachabilityChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the green band is the
        honest provenance range [{V.band.lo_generous.toFixed(4)}, {V.band.hi.toFixed(2)}] — the
        dashed line inside it marks the rigorous downward floor ({V.band.lo_rigorous.toFixed(4)}),
        the solid left edge marks the most generous downward floor. The blue dot is the nominal
        C_F multiplier (1.0). The red dot (cf*) sits well to the left of the band, outside the
        honest downward reach by a gap of {V.foreclosureMargin.toFixed(3)} in multiplier space
        (&asymp; {V.overshootFactor}x the largest honest downward lane) — visually confirming the
        wedge is not physically reachable.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Status:</strong> presentation/measurement only —
        renders the frozen imp-95674 provenance-band decision and imp-95660 wedge-closure
        multiplier verbatim (no re-derivation, no fresh term). The component model is the
        inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; the C_mb
        GUE-conditional per imp-486 is untouched; changes no bound, establishes no operator
        positivity, no RH claim. Platt-Trudgian Lambda &le; 0.2 remains SOTA. NO QED.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp95681-eflow-inversion-contour-surface" style={{ color: '#7c3aed' }}>
          E_flow Attribution of the Inversion-Contour Wedge (imp-95658 / imp-95681)
        </Link>
      </div>
    </div>
  );
}
