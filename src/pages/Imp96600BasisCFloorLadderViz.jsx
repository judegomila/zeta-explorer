import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96600_LADDER,
  IMP96600_FIT_LINE,
  IMP96600_REGIME_SPLIT,
  IMP96600_HONEST_BANNER,
} from '../data/imp-96600-basis-c-floor-ladder-viz-data.js';

// log-log scatter of the imp-96568 floor(L) ladder: point color marks the
// ppp-collapsed (cancellation-set) vs ppp-pinned (truncation-set) regime,
// point labels show the optimum ppp, and a dashed line traces the
// above-anchor super-linear fit (exponent ~1.81) through the two pinned rungs.
function FloorLadderPanel() {
  const rows = IMP96600_LADDER;
  const svgW = 700;
  const padL = 60;
  const padR = 24;
  const svgH = 340;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xs = rows.map((r) => r.logL);
  const ys = rows.map((r) => r.logFloor);
  const minX = Math.min(...xs) - 0.3;
  const maxX = Math.max(...xs) + 0.3;
  const minY = Math.min(...ys) - 0.6;
  const maxY = Math.max(...ys) + 0.6;

  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const colorOf = (row) => (row.pppPinned ? '#f87171' : '#38bdf8');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      {[Math.ceil(minY), Math.floor((minY + maxY) / 2), Math.floor(maxY)].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
            1e{v}
          </text>
        </g>
      ))}
      {rows.map((r) => (
        <g key={`x${r.L}`}>
          <line x1={xOf(r.logL)} y1={padT + plotH} x2={xOf(r.logL)} y2={padT + plotH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xOf(r.logL)} y={padT + plotH + 15} textAnchor="middle" fill="#64748b" fontSize={8}>
            1e{r.logL.toFixed(0)}
          </text>
        </g>
      ))}
      {/* above-anchor super-linear fit line through the two ppp-pinned rungs */}
      <line
        x1={xOf(IMP96600_FIT_LINE.from.logL)}
        y1={yOf(IMP96600_FIT_LINE.from.logFloor)}
        x2={xOf(IMP96600_FIT_LINE.to.logL)}
        y2={yOf(IMP96600_FIT_LINE.to.logFloor)}
        stroke="#facc15"
        strokeWidth={1.4}
        strokeDasharray="4 3"
      />
      <text
        x={(xOf(IMP96600_FIT_LINE.from.logL) + xOf(IMP96600_FIT_LINE.to.logL)) / 2 + 6}
        y={(yOf(IMP96600_FIT_LINE.from.logFloor) + yOf(IMP96600_FIT_LINE.to.logFloor)) / 2 - 6}
        fill="#facc15"
        fontSize={8.5}
      >
        p&asymp;{IMP96600_FIT_LINE.exponent.toFixed(2)}
      </text>
      <polyline
        points={rows.map((r) => `${xOf(r.logL)},${yOf(r.logFloor)}`).join(' ')}
        fill="none"
        stroke="#475569"
        strokeWidth={1}
        strokeDasharray="2 2"
      />
      {rows.map((r) => (
        <g key={`pt${r.L}`}>
          <circle cx={xOf(r.logL)} cy={yOf(r.logFloor)} r={4} fill={colorOf(r)} />
          <text x={xOf(r.logL) + 6} y={yOf(r.logFloor) - 6} fill={colorOf(r)} fontSize={8.5}>
            ppp={r.optPpp}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 34} textAnchor="middle" fill="#94a3b8" fontSize={9}>
        L (log scale)
      </text>
      <text x={16} y={padT + plotH / 2} fill="#94a3b8" fontSize={9} transform={`rotate(-90 16 ${padT + plotH / 2})`}>
        floor (log scale)
      </text>
    </svg>
  );
}

export default function Imp96600BasisCFloorLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Basis-C floor(L) Ladder: Optimum-ppp Collapse and Super-linear Growth" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96600_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96568 measured the basis-C direct-integral floor at five L rungs, sweeping panels-per-period
        (ppp) to find the best-achievable floor at each. The optimum ppp collapses monotonically
        (blue points, {IMP96600_REGIME_SPLIT.cancellationSetOptPpp} &rarr; 48 &rarr; 6 &rarr; red points,
        pinned at {IMP96600_REGIME_SPLIT.truncationSetOptPpp}) as the dominant error source switches
        from cancellation (needs fine resolution to vanish) to Simpson truncation (pinned at the
        resolution floor). {IMP96600_REGIME_SPLIT.note}
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        floor(L) on log-log axes, colored by regime
      </h3>
      <FloorLadderPanel />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> blue points are
        cancellation-set/crossover rungs (optimum ppp still falling); red points are Simpson
        truncation-set rungs (optimum ppp pinned at 3, the PT anchor L={IMP96600_REGIME_SPLIT.ptAnchorL.toExponential(1)}
        &nbsp;and L=1e7). The yellow dashed line is the above-anchor power-law fit through the two
        pinned rungs, exponent p&asymp;{IMP96600_FIT_LINE.exponent.toFixed(2)} &mdash; well above the
        exponent 1 an L-linear floor model would give, i.e. the floor grows super-linearly once the
        mechanism has switched to truncation-set.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the imp-96600
        viz-data (ladder reshaped verbatim from imp-96568). {IMP96600_HONEST_BANNER}
      </div>
    </div>
  );
}
