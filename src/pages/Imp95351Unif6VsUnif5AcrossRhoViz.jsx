import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95351_UNIF_SERIES,
  IMP95351_SUMMARY,
} from '../data/imp-95351-unif6-vs-unif5-across-rho-viz-data.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xTicks, yTicks, xOf, yOf, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 15} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

// A_unif6(a) vs A_unif5(a) across a = ln(rho) in [ln 2, 6], log scale on the floor value
function FloorCurvesPanel() {
  const rows = IMP95351_UNIF_SERIES;
  const svgW = 640;
  const padL = 66;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const aMin = IMP95351_SUMMARY.aMin;
  const aMax = IMP95351_SUMMARY.aMax;
  // log10 scale on the floor axis (values range from ~2e-9 to ~6e-2)
  const logMin = -9;
  const logMax = -1;
  const xOf = (a) => padL + ((a - aMin) / (aMax - aMin)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - logMin) / (logMax - logMin)) * plotH;

  const line5 = rows.map((r) => `${xOf(r.a)},${yOf(r.aUnif5)}`).join(' ');
  const line6 = rows.map((r) => `${xOf(r.a)},${yOf(r.aUnif6)}`).join(' ');

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={[Math.LN2, Math.log(4), Math.log(10), 4, 6].map((v) => Number(v.toFixed(2)))}
      yTicks={[-9, -7, -5, -3, -1]}
      xOf={xOf}
      yOf={yOf}
      xLabel="a = ln(rho)"
      yLabel="log10(floor value)"
    >
      <polyline points={line5} fill="none" stroke="#fb923c" strokeWidth={2} strokeDasharray="6 3" opacity={0.9} />
      <polyline points={line6} fill="none" stroke="#38bdf8" strokeWidth={2} opacity={0.9} />
      <text x={padL + 8} y={padT + 14} fill="#38bdf8" fontSize={9}>
        A_unif6(rho) (imp-95332 COROLLARY PEN-UNIF6)
      </text>
      <text x={padL + 8} y={padT + 27} fill="#fb923c" fontSize={9}>
        A_unif5(rho) (imp-95331 COROLLARY PEN-UNIF5)
      </text>
    </AxisFrame>
  );
}

// gain factor A_unif6 / A_unif5 across a = ln(rho)
function GainPanel() {
  const rows = IMP95351_UNIF_SERIES;
  const svgW = 640;
  const padL = 66;
  const padR = 24;
  const svgH = 260;
  const padT = 20;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const aMin = IMP95351_SUMMARY.aMin;
  const aMax = IMP95351_SUMMARY.aMax;
  const maxY = 1.25;
  const xOf = (a) => padL + ((a - aMin) / (aMax - aMin)) * plotW;
  const yOf = (v) => padT + plotH - (v / maxY) * plotH;

  const gainLine = rows.map((r) => `${xOf(r.a)},${yOf(r.gain)}`).join(' ');

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={[Math.LN2, Math.log(4), Math.log(10), 4, 6].map((v) => Number(v.toFixed(2)))}
      yTicks={[1.0, 1.05, 1.1, 1.15, 1.2, 1.25]}
      xOf={xOf}
      yOf={yOf}
      xLabel="a = ln(rho)"
      yLabel="gain A_unif6 / A_unif5"
    >
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke="#475569" strokeWidth={1} strokeDasharray="4 3" />
      <polyline points={gainLine} fill="none" stroke="#a78bfa" strokeWidth={2} opacity={0.9} />
      <text x={padL + 8} y={padT + 14} fill="#a78bfa" fontSize={9}>
        gain factor (both floors bitwise equal below the exact-root activation crossover)
      </text>
    </AxisFrame>
  );
}

export default function Imp95351Unif6VsUnif5AcrossRhoViz() {
  const s = IMP95351_SUMMARY;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="A_unif6 vs A_unif5 r-and-m-Uniform Floors Across rho (imp-95332)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a floor-only measurement
        summary of an already-proven corollary, not a new theorem. It changes no Lambda bound and
        establishes no operator positivity. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of
        the art. RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95331 COROLLARY PEN-UNIF5 gives an r-and-m-uniform floor A_unif5(rho) for the block
        symbol-pencil, independent of the intra-pair ratio r and octave count m. The imp-95332
        COROLLARY PEN-UNIF6 replaces its theta-uniform tail charge with the per-chart tail cap,
        giving A_unif6(rho) &ge; A_unif5(rho) unconditionally. Both curves are recomputed here across
        rho = e^a for a in [ln 2, 6]: the two floors are bitwise identical below the exact-root
        activation crossover (rho &le; ~4) and diverge above it, reaching a {s.last.gain.toFixed(4)}x
        gain at rho = e^6.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Floor value across rho (log scale)
      </h3>
      <FloorCurvesPanel />

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Gain factor A_unif6 / A_unif5 across rho
      </h3>
      <GainPanel />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the two curves sit exactly
        on top of each other for rho below about 4 &mdash; the new RZ-PEN6 chart-tail branch is
        inactive there (W6 = W5 bitwise), so the SPLIT-PEN certificate onsets carried over from
        RZ-PEN5 are unaffected. Above the exact-root activation crossover (rho &gt; ~6.5) the gain
        grows monotonically, reaching {s.maxGain.toFixed(4)}x at the rho = e^6 grid endpoint.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the
        imp-95351 baked viz-data (both curves recomputed from the imp-95332 COROLLARY PEN-UNIF6 /
        imp-95331 COROLLARY PEN-UNIF5 closed forms, cross-checked at both grid endpoints against the
        imp-95332 record). Changes no bound, establishes no operator positivity, no RH claim;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
