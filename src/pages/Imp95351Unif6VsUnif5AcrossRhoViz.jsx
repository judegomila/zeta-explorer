import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95351_UNIF_SERIES,
  IMP95351_SUMMARY,
} from '../data/imp-95351-unif6-vs-unif5-across-rho-viz-data.js';
import { ED } from '../styles/tokens.js';

// yTickOf maps a tick label to a pixel y; defaults to yOf. The log-scale floor panel passes
// exponent ticks (-9..-1), which must not go through yOf's own log10 (that produced NaN).
function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xTicks, yTicks, xOf, yOf, yTickOf, xLabel, yLabel }) {
  const tickY = yTickOf || yOf;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 15} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={tickY(v)} x2={padL} y2={tickY(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={tickY(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
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
      yTickOf={(k) => yOf(Math.pow(10, k))}
      xLabel="a = ln(rho)"
      yLabel="log10(floor value)"
    >
      <polyline points={line5} fill="none" stroke={ED.series4} strokeWidth={2} strokeDasharray="6 3" opacity={0.9} />
      <polyline points={line6} fill="none" stroke={ED.series1} strokeWidth={2} opacity={0.9} />
      <text x={padL + 8} y={padT + 14} fill={ED.series1} fontSize={9}>
        A_unif6(rho) (imp-95332 COROLLARY PEN-UNIF6)
      </text>
      <text x={padL + 8} y={padT + 27} fill={ED.series4} fontSize={9}>
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
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke={ED.rule} strokeWidth={1} strokeDasharray="4 3" />
      <polyline points={gainLine} fill="none" stroke={ED.series5} strokeWidth={2} opacity={0.9} />
      <text x={padL + 8} y={padT + 14} fill={ED.series5} fontSize={9}>
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
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a floor-only measurement
        summary of an already-proven corollary, not a new theorem. It changes no Lambda bound and
        establishes no operator positivity. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of
        the art. RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95331 COROLLARY PEN-UNIF5 gives an r-and-m-uniform floor A_unif5(rho) for the block
        symbol-pencil, independent of the intra-pair ratio r and octave count m. The imp-95332
        COROLLARY PEN-UNIF6 replaces its theta-uniform tail charge with the per-chart tail cap,
        giving A_unif6(rho) &ge; A_unif5(rho) unconditionally. Both curves are recomputed here across
        rho = e^a for a in [ln 2, 6]: the two floors are bitwise identical below the exact-root
        activation crossover (rho &le; ~4) and diverge above it, reaching a {s.last.gain.toFixed(4)}x
        gain at rho = e^6.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Floor value across rho (log scale)
      </h3>
      <FloorCurvesPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Gain factor A_unif6 / A_unif5 across rho
      </h3>
      <GainPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the two curves sit exactly
        on top of each other for rho below about 4 &mdash; the new RZ-PEN6 chart-tail branch is
        inactive there (W6 = W5 bitwise), so the SPLIT-PEN certificate onsets carried over from
        RZ-PEN5 are unaffected. Above the exact-root activation crossover (rho &gt; ~6.5) the gain
        grows monotonically, reaching {s.maxGain.toFixed(4)}x at the rho = e^6 grid endpoint.
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
        imp-95351 baked viz-data (both curves recomputed from the imp-95332 COROLLARY PEN-UNIF6 /
        imp-95331 COROLLARY PEN-UNIF5 closed forms, cross-checked at both grid endpoints against the
        imp-95332 record). Changes no bound, establishes no operator positivity, no RH claim;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
