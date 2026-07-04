import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT } from '../data/imp-33660-cluster-peak-envelope-height-growth-fit.js';
import { IMP33679_CLUSTER_PEAK_ENVELOPE_HEIGHT_1200_1600 } from '../data/imp-33679-cluster-peak-envelope-height-1200-1600.js';

const BASE_COLOR = '#38bdf8';
const EXT_COLOR = '#f472b6';
const BASE_FIT_COLOR = '#f59e0b';
const PLATEAU_COLOR = '#4ade80';

const base = IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT.measured;
const ext = IMP33679_CLUSTER_PEAK_ENVELOPE_HEIGHT_1200_1600.measured;

function EnvelopeChart() {
  const svgW = 900;
  const padL = 46;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 280;
  const svgH = padT + cH + padB;

  const nLo = 400;
  const nHi = 1600;
  const yMax = 160;

  const xS = (n) => padL + ((n - nLo) / (nHi - nLo)) * cW;
  const yS = (v) => padT + cH * (1 - Math.min(v, yMax) / yMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 40, 80, 120, 160].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* n=1200 sample-edge divider between the base fit and the fresh extension */}
      <line x1={xS(1200)} y1={padT} x2={xS(1200)} y2={padT + cH} stroke="#334155" strokeWidth={1} strokeDasharray="3,3" />
      <text x={xS(1200) + 4} y={padT + 10} fill="#64748b" fontSize={8}>
        n=1200 sample edge
      </text>

      {/* imp-33660 base linear fit, extended dashed across the fresh window as the counterfactual */}
      <line
        x1={xS(nLo)}
        y1={yS(base.linIntercept + base.linSlope * nLo)}
        x2={xS(1200)}
        y2={yS(base.linIntercept + base.linSlope * 1200)}
        stroke={BASE_FIT_COLOR}
        strokeWidth={1.3}
      />
      <line
        x1={xS(1200)}
        y1={yS(base.linIntercept + base.linSlope * 1200)}
        x2={xS(nHi)}
        y2={yS(base.linIntercept + base.linSlope * nHi)}
        stroke={BASE_FIT_COLOR}
        strokeWidth={1}
        strokeDasharray="5,4"
        opacity={0.6}
      />

      {/* the imp-33679 plateau mean, drawn across the fresh window */}
      <line
        x1={xS(1200)}
        y1={yS(ext.heightMean)}
        x2={xS(nHi)}
        y2={yS(ext.heightMean)}
        stroke={PLATEAU_COLOR}
        strokeWidth={1.3}
        strokeDasharray="4,3"
      />
      <text x={xS(1200) + 4} y={yS(ext.heightMean) - 6} fill={PLATEAU_COLOR} fontSize={9}>
        [1200,1600] plateau mean ~{ext.heightMean.toFixed(1)} ULP
      </text>

      {/* the sixteen imp-33660 [400,1200] base peaks */}
      {base.peakNs.map((n, i) => (
        <g key={`base-${n}`}>
          <circle cx={xS(n)} cy={yS(base.peakHeights[i])} r={3.5} fill={BASE_COLOR} />
        </g>
      ))}

      {/* the four fresh imp-33679 [1200,1600] extension peaks */}
      {ext.peakNs.map((n, i) => (
        <g key={`ext-${n}`}>
          <circle cx={xS(n)} cy={yS(ext.peakHeights[i])} r={4.5} fill={EXT_COLOR} />
          <text x={xS(n)} y={yS(ext.peakHeights[i]) - 8} textAnchor="middle" fill={EXT_COLOR} fontSize={8}>
            {ext.peakHeights[i].toFixed(0)}
          </text>
        </g>
      ))}

      {[400, 600, 800, 1000, 1200, 1400, 1600].map((n) => (
        <text key={n} x={xS(n)} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={9}>
          {n}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={9}>
        cluster-peak rung n
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={12} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,12,${padT + cH / 2})`}>
        peak-envelope height (ULP)
      </text>
    </svg>
  );
}

export default function Imp33717EnvelopeHeightExtensionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 980, margin: '0 auto' }}>
      <PageHeader title="Cluster-Peak Envelope-Height Extension, n in [1200,1600] (imp-33679)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 820 }}>
        imp-33660 fit the sixteen [400,1200] band-clearing cluster-peak heights (blue dots) to four growth
        laws and returned GROWTH-CLASS-UNRESOLVED: a weak positive linear slope (amber line) carried almost
        entirely by the two tallest tail clusters near n~1126 and n~1198. imp-33679 extended the scan into a
        fresh [1200,1600] window past that sample edge and found four new peaks (pink dots) all sitting at
        ~140&ndash;147 ULP &mdash; well above where the base linear fit, extrapolated (dashed amber), would
        place them, and essentially flat at the plateau mean (green, dashed). The chart below overlays both
        series on one axis.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        peak-envelope height vs cluster-peak rung, base [400,1200] + extension [1200,1600]
      </p>
      <EnvelopeChart />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        The imp-33660 base fit spans {base.peakNs.length} peaks ({base.heightMin.toFixed(1)}&ndash;
        {base.heightMax.toFixed(1)} ULP) with linear slope {base.linSlope >= 0 ? '+' : ''}
        {base.linSlope.toFixed(3)} ULP/rung (R&sup2; ~{base.linR2.toFixed(2)}). The imp-33679 extension adds{' '}
        {ext.peakNs.length} fresh peaks at n ~ {ext.peakNs.join(', ')} ({ext.heightMin.toFixed(1)}&ndash;
        {ext.heightMax.toFixed(1)} ULP, mean {ext.heightMean.toFixed(1)}, sd {ext.heightSd.toFixed(1)}). The
        within-extension linear slope collapses to {ext.linSlope >= 0 ? '+' : ''}
        {ext.linSlope.toFixed(3)} ULP/rung &mdash; about {ext.slopeVsImp33660Ratio.toFixed(2)}&times; the base
        rate &mdash; while band-clearing coverage over [1200,1600] reaches{' '}
        {(ext.fracClearing * 100).toFixed(1)}%.
      </p>

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the extension peaks sit well above the
        dashed extrapolation of the base [400,1200] linear fit and well above the flat ~64&ndash;86 ULP early
        band the first fourteen base peaks occupy, yet are essentially flat among themselves (small sd, tiny
        within-window slope). That is a SATURATION signature, not persistent growth and not reversion: the two
        tallest imp-33638 tail clusters at the far end of the base sample were the ONSET of this elevated
        plateau, not two-point outliers. Exact per-rung ULP values are jittery arithmetic-floor lattice hits
        (imp-33660/imp-33679 latticeJitterCaveat) &mdash; the robust reading is the qualitative saturation, not
        the precise plateau level.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> accuracy/rule-design measurement only. It
        overlays two previously-measured series and changes no bound, patches no literal. Mass-feasibility is
        necessary-but-not-sufficient; the operator-level positivity (imp-3066 K_a &ge; 0) is UNTOUCHED.
        RH-equivalent, NO QED. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
