import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96294_RESIDUAL_SERIES,
  IMP96294_EFLOW_FRAC_SERIES,
  IMP96294_PEAK_ANNOTATION,
  IMP96294_HONEST_BANNER,
} from '../data/imp-96294-eflow-residual-viz-data.js';

function ResidualChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 68;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 3;
  const xMax = 12;
  const yMin = -0.16;
  const yMax = 0.005;

  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const pathOf = (points, key) => points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N).toFixed(2)} ${yOf(p[key]).toFixed(4)}`)
    .join(' ');

  const xTicks = [3, 4, 5, 6, 7, 9, 12];
  const yTicks = [-0.15, -0.1, -0.05, 0];

  const peakX = xOf(IMP96294_PEAK_ANNOTATION.log10PeakN);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#334155" strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>{v.toFixed(2)}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {v}
        </text>
      ))}

      {/* zero reference line: residual is strictly negative below it */}
      <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke="#94a3b8" strokeWidth={0.75} strokeDasharray="2 3" opacity={0.6} />

      {/* peak-manufacturing region marker (N ~ 9.22e5) */}
      <line x1={peakX} y1={padT} x2={peakX} y2={padT + plotH} stroke="#f87171" strokeWidth={1} strokeDasharray="3 3" opacity={0.55} />
      <text x={peakX + 4} y={padT + 12} fill="#f87171" fontSize={8}>
        peak N&asymp;{IMP96294_PEAK_ANNOTATION.peakN.toExponential(2)}
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      <path d={pathOf(IMP96294_RESIDUAL_SERIES, 'residual')} fill="none" stroke="#38bdf8" strokeWidth={2} opacity={0.95} />
      {IMP96294_RESIDUAL_SERIES.map((p) => (
        <circle key={`r-${p.log10N}`} cx={xOf(p.log10N)} cy={yOf(p.residual)} r={2.6} fill="#38bdf8" />
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        log10 N (ladder from 1e3 to 1e12; axis compressed past 9)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke="#38bdf8" strokeWidth={2} />
        <text x={22} y={3} fill="#94a3b8" fontSize={8.5}>R(N) = sigma_full - sigma_CF (strictly &lt; 0)</text>
      </g>
    </svg>
  );
}

export default function Imp96294EflowResidualViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96266: Closed-Form E_flow Suppression Residual R(N)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96294_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96266 found the closed-form crossover share sigma_CF (which drops the E_flow term) is
        related to the full three-term share by the exact identity R(N) = sigma_full - sigma_CF ={' '}
        -sigma_full(N) &middot; E_flow(N) / (E_trunc + E_coll(N)), reproduced to ~1.5e-16 (an
        algebraic identity, not a fit). Because E_flow sits in the denominator, R is strictly
        negative across the whole ladder: E_flow suppresses the share differentially, strongly on
        the left arm and vanishing past the crossover, and it is exactly this differential
        suppression that manufactures the imp-3220 U-shape interior peak.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        R(N) = sigma_full - sigma_CF vs log10 N (strictly negative, deepest near the peak region)
      </h3>
      <ResidualChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the residual is most
        negative in the mid-decades and shrinks toward zero as N grows past the crossover, tracking
        the falling E_flow/E_N fraction (
        {IMP96294_EFLOW_FRAC_SERIES.map((p, i) => (
          <React.Fragment key={p.log10N}>
            {i > 0 ? ', ' : ''}
            {p.eFlowOverEN.toExponential(2)} at 1e{p.log10N}
          </React.Fragment>
        ))}
        ). At the marked peak (N &asymp; {IMP96294_PEAK_ANNOTATION.peakN.toExponential(3)}), the full
        share reaches sigma_max &asymp; {IMP96294_PEAK_ANNOTATION.peakSigmaFull.toFixed(4)}
        (matching the imp-3220 landmark 0.9494); re-applying the exact suppression to the
        peakless sigma_CF recovers that maximum to {IMP96294_PEAK_ANNOTATION.peakHeightAbsErr.toExponential(2)}{' '}
        in height and {IMP96294_PEAK_ANNOTATION.peakLocationRelErr.toExponential(2)} in location.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the imp-96266
        baked residual identity and peak/peak-recovery landmarks verbatim (only the chart-axis
        reshaping is computed here). The component model is the inherited
        imp-3220/imp-3406/imp-33723 extrapolation, not a rigorous asymptotic; the C_mb
        GUE-conditional per imp-486 stays untouched. Changes no bound, establishes no operator
        positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
