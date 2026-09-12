import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95371_BCAP_SERIES,
  IMP95371_SUMMARY,
} from '../data/imp-95371-bcap-two-branch-cap-vs-exact-ratio-viz-data.js';

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

// exact ratio vs the two BCAP branches and the flat cap, across c, for one w
function BranchPanel({ series }) {
  const rows = series.rows;
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const cMin = IMP95371_SUMMARY.cMin;
  const cMax = IMP95371_SUMMARY.cMax;
  const yMax = Math.max(series.cap * 1.15, 4);
  const xOf = (c) => padL + ((Math.log(c) - Math.log(cMin)) / (Math.log(cMax) - Math.log(cMin))) * plotW;
  const yOf = (v) => padT + plotH - (Math.min(v, yMax) / yMax) * plotH;

  const lineExact = rows.map((r) => `${xOf(r.c)},${yOf(r.exact)}`).join(' ');
  const lineI = rows.map((r) => `${xOf(r.c)},${yOf(r.branchI)}`).join(' ');
  const lineII = rows.map((r) => `${xOf(r.c)},${yOf(r.branchII)}`).join(' ');

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={[1, 2, 5, 10, 20, 30]}
      yTicks={[0, series.cap, yMax].map((v) => Number(v.toFixed(2)))}
      xOf={xOf}
      yOf={yOf}
      xLabel="c = cosh(b/2) (log scale)"
      yLabel="ratio / bound"
    >
      <line
        x1={padL}
        y1={yOf(series.cap)}
        x2={padL + plotW}
        y2={yOf(series.cap)}
        stroke="#f87171"
        strokeWidth={1.5}
        strokeDasharray="5 3"
      />
      <line
        x1={xOf(series.cStar)}
        y1={padT}
        x2={xOf(series.cStar)}
        y2={padT + plotH}
        stroke="#94a3b8"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <polyline points={lineI} fill="none" stroke="#fb923c" strokeWidth={1.5} strokeDasharray="6 3" opacity={0.85} />
      <polyline points={lineII} fill="none" stroke="#a78bfa" strokeWidth={1.5} strokeDasharray="6 3" opacity={0.85} />
      <polyline points={lineExact} fill="none" stroke="#38bdf8" strokeWidth={2} opacity={0.95} />
      <text x={padL + 8} y={padT + 14} fill="#38bdf8" fontSize={9}>
        exact ratio (1 - cos(w b/a)) / (1 - sech(b/2))
      </text>
      <text x={padL + 8} y={padT + 27} fill="#fb923c" fontSize={9}>
        branch (i): 4 w^2 c / a^2
      </text>
      <text x={padL + 8} y={padT + 40} fill="#a78bfa" fontSize={9}>
        branch (ii): 2 + 2/(c - 1)
      </text>
      <text x={padL + 8} y={padT + 53} fill="#f87171" fontSize={9}>
        flat cap 2 + 4 w^2/a^2 = {series.cap.toFixed(3)}
      </text>
    </AxisFrame>
  );
}

export default function Imp95371BcapTwoBranchCapVsExactRatioViz() {
  const s = IMP95371_SUMMARY;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="LEMMA BCAP Two-Branch Cap vs the Exact Ratio (imp-95329)" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a presentation of an
        already-proven lemma, not a new result. It changes no Lambda bound and establishes no
        operator positivity. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art. RH
        does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95329 LEMMA BCAP bounds (1 &minus; cos(w b/a)) / (1 &minus; sech(b/2)) by the flat
        constant 2 + 4w&sup2;/a&sup2;, uniformly in b &gt; 0. The proof takes the minimum of two
        monotone branches in c = cosh(b/2): branch (i) = 4w&sup2;c/a&sup2; (increasing, tight for
        small c) and branch (ii) = 2 + 2/(c &minus; 1) (decreasing, tight for large c). They cross
        at c* = 1 + a&sup2;/(2w&sup2;), where both equal the cap. At a = {s.a} (the rho = e&sup6;
        case where imp-95329 measured its largest floor gain, 6.073x), the exact ratio sits
        strictly below min(branch (i), branch (ii)) at every sampled c for both w = &pi; and
        w = 2&pi;.
      </p>

      {IMP95371_BCAP_SERIES.map((series, i) => (
        <div key={series.w}>
          <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
            w = {i === 0 ? 'π' : '2π'}, a = {s.a}: c* = {series.cStar.toFixed(4)}, cap =
            {' '}
            {series.cap.toFixed(4)}, max sampled ratio/cap ={' '}
            {s.perW[i].maxRatioOverCap.toFixed(4)}
          </h3>
          <BranchPanel series={series} />
        </div>
      ))}

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the dashed vertical line
        marks the crossover c*; left of it branch (i) is the active (smaller) branch, right of it
        branch (ii) takes over, and both meet the flat cap exactly at c*. The imp-95329 record
        separately reports the cap as near-sharp (measured supremum ratio/cap = 0.9998) on a much
        wider a/b/w grid; the a = {s.a} slice plotted here is not that near-sharp regime (which
        lives at small a and small b) &mdash; here the sampled ratio/cap peaks around{' '}
        {Math.max(...s.perW.map((p) => p.maxRatioOverCap)).toFixed(2)}, well inside the bound.
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
        imp-95371 baked viz-data (all four curves recomputed from the imp-95329 LEMMA BCAP closed
        forms). Changes no bound, establishes no operator positivity, no RH claim;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
