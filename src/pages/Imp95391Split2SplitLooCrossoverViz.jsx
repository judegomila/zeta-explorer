import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95391_SCATTER_POINTS,
  IMP95391_ANCHOR,
  IMP95391_SPLIT2_WIN,
  IMP95391_SUMMARY,
} from '../data/imp-95391-split2-splitloo-crossover-viz-data.js';

function CrossoverScatter() {
  const svgW = 640;
  const svgH = 520;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 48;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xOf = (sigma) => padL + sigma * cW;
  const yOf = (g) => padT + cH - g * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" stroke="#1e293b" />

      {/* SPLIT-LOO region shading (below diagonal, g < sigma) */}
      <polygon
        points={`${xOf(0)},${yOf(0)} ${xOf(1)},${yOf(1)} ${xOf(1)},${yOf(0)}`}
        fill="rgba(56,189,248,0.06)"
      />
      {/* SPLIT-2 region shading (above diagonal, g > sigma) */}
      <polygon
        points={`${xOf(0)},${yOf(0)} ${xOf(1)},${yOf(1)} ${xOf(0)},${yOf(1)}`}
        fill="rgba(248,113,113,0.06)"
      />

      {/* diagonal crossover locus g = sigma */}
      <line
        x1={xOf(0)}
        y1={yOf(0)}
        x2={xOf(1)}
        y2={yOf(1)}
        stroke="#facc15"
        strokeWidth={2}
      />

      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => (
        <g key={`grid-${v}`}>
          <line x1={xOf(v)} y1={padT} x2={xOf(v)} y2={padT + cH} stroke="#1e293b" strokeWidth={0.5} />
          <line x1={padL} y1={yOf(v)} x2={padL + cW} y2={yOf(v)} stroke="#1e293b" strokeWidth={0.5} />
          <text x={xOf(v)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9.5}>
            {v}
          </text>
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={9.5}>
            {v}
          </text>
        </g>
      ))}

      {IMP95391_SCATTER_POINTS.map((p, i) => (
        <circle
          key={`pt-${i}`}
          cx={xOf(p.sigma)}
          cy={yOf(p.g)}
          r={4}
          fill={p.winner === 'LOO' ? '#38bdf8' : '#f87171'}
          opacity={0.75}
        />
      ))}

      <circle cx={xOf(IMP95391_ANCHOR.sigma)} cy={yOf(IMP95391_ANCHOR.g)} r={7} fill="none" stroke="#facc15" strokeWidth={2} />
      <circle cx={xOf(IMP95391_SPLIT2_WIN.sigma)} cy={yOf(IMP95391_SPLIT2_WIN.g)} r={7} fill="none" stroke="#facc15" strokeWidth={2} />

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill="#94a3b8" fontSize={11}>
        sigma (principal-angle cosine)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={11}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        g (Lambda-balance ratio)
      </text>

      <text x={padL + 8} y={padT + 16} fill="#38bdf8" fontSize={10}>
        SPLIT-LOO region (g &lt; sigma)
      </text>
      <text x={padL + cW - 8} y={padT + cH - 8} textAnchor="end" fill="#f87171" fontSize={10}>
        SPLIT-2 region (g &gt; sigma)
      </text>
    </svg>
  );
}

export default function Imp95391Split2SplitLooCrossoverViz() {
  const s = IMP95391_SUMMARY;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="SPLIT-2 vs SPLIT-LOO Crossover: g-vs-sigma Locus (imp-95256 / imp-95391)" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> measurement only, a
        self-consistency re-render of an algebraic identity between two already-proven bounds. It
        changes no Lambda bound. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art.
        RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        For a two-block split with per-block quotients &Lambda;<sub>1</sub>, &Lambda;<sub>2</sub>{' '}
        and principal-angle cosine &sigma;, define the balance ratio{' '}
        g = 2&radic;(&Lambda;<sub>1</sub>&Lambda;<sub>2</sub>) / (&Lambda;<sub>1</sub>+&Lambda;<sub>2</sub>)
        &isin; (0,1]. The imp-95256 identity shows SPLIT-LOO is tighter exactly when g &lt; &sigma;
        (below the diagonal) and SPLIT-2 is tighter exactly when g &gt; &sigma; (above it). Each
        point below is a realized two-block configuration from the nearby-scale twin-lattice family
        (blue-region-only in practice) and the small-depth wide-separation family (which populates
        both sides); the two yellow-ringed points are the imp-95250 anchor and the concrete
        SPLIT-2-win witness.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        g vs sigma scatter, {s.pointCount} configurations ({s.looCount} SPLIT-LOO, {s.s2Count} SPLIT-2)
      </p>
      <CrossoverScatter />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>witness</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>sigma</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>g</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>winner</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>{IMP95391_ANCHOR.label}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{IMP95391_ANCHOR.sigma.toFixed(6)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{IMP95391_ANCHOR.g.toFixed(6)}</td>
            <td style={{ padding: '0.4rem 0.6rem' }}>SPLIT-LOO</td>
          </tr>
          <tr style={{ color: '#cbd5e1' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>{IMP95391_SPLIT2_WIN.label}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{IMP95391_SPLIT2_WIN.sigma.toFixed(6)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{IMP95391_SPLIT2_WIN.g.toFixed(6)}</td>
            <td style={{ padding: '0.4rem 0.6rem' }}>SPLIT-2</td>
          </tr>
        </tbody>
      </table>

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> {s.crossoverLocus}. The
        nearby-scale twin-lattice family (strongly non-orthogonal blocks, &sigma; near 1) lands
        entirely in the SPLIT-LOO region regardless of depth, while the wide-separation family
        crosses the diagonal as depth grows &mdash; concretely showing why fixing only one point
        (as the original imp-95250 anchor did) cannot settle which split dominates in general.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {s.verdict}
      </div>
    </div>
  );
}
