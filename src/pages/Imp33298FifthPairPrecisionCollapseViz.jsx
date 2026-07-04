import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33298_BARS,
  IMP33298_WILKINSON_FLOOR_ULPS,
  IMP33298_COLLAPSE_ORDERS,
} from '../data/imp-33298-fifth-pair-precision-collapse-viz-data.js';

const FP64_COLOR = '#38bdf8';
const DD_COLOR = '#34d399';
const FLOOR_COLOR = '#f472b6';

function PrecisionCollapseChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const yMax = IMP33298_WILKINSON_FLOOR_ULPS + 3;
  const yS = (v) => padT + cH * (1 - v / yMax);
  const barW = cW / IMP33298_BARS.length - 40;
  const barColors = { fp64: FP64_COLOR, dd: DD_COLOR };

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 2, 4, 6, 8, 10, 12].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(IMP33298_WILKINSON_FLOOR_ULPS)}
        x2={padL + cW}
        y2={yS(IMP33298_WILKINSON_FLOOR_ULPS)}
        stroke={FLOOR_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yS(IMP33298_WILKINSON_FLOOR_ULPS) - 6} textAnchor="end" fill={FLOOR_COLOR} fontSize={9}>
        Wilkinson n&middot;&kappa;_pair floor ({IMP33298_WILKINSON_FLOOR_ULPS.toFixed(2)} ULP)
      </text>

      {IMP33298_BARS.map((r, i) => {
        const x = padL + i * (cW / IMP33298_BARS.length) + 20;
        const barUlps = Math.max(r.ulps, 0.02); // floor bar to a hairline so the dd collapse is visible
        const y = yS(barUlps);
        const h = padT + cH - y;
        return (
          <g key={r.key}>
            <rect x={x} y={y} width={barW} height={h} fill={barColors[r.key]} rx={2} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill="#94a3b8" fontSize={9}>
              {r.rel.toExponential(2)} rel
            </text>
            <text x={x + barW / 2} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={9}>
              {r.label}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,14,${padT + cH / 2})`}>
        fifth-pair spread (ULP)
      </text>
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        identical N=2000 fifth-pair matrix, two working precisions
      </text>
    </svg>
  );
}

export default function Imp33298FifthPairPrecisionCollapseViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Fifth-Pair Spread Precision Collapse: fp64 vs Double-Double (imp-33272)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-33272 solved the identical exactly-degenerate 10x10 fifth-pair matrix (the baked
        imp-3668 N=2000 dense top-10 Gram spectrum, lambda_9 = lambda_10 set exactly equal) with
        the same cyclic-Jacobi eigensolver at two working precisions. The plain fp64 solve lands
        at a few ULP -- inside the imp-33253 derived Wilkinson n&middot;&kappa;_pair floor line --
        while the double-double solve on the same matrix collapses the measured spread by
        roughly {IMP33298_COLLAPSE_ORDERS} orders of magnitude, down to the double-double backward-error
        floor itself. A genuine pair gap would not move with the working precision; only backward
        error does.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        fifth-pair relative spread by working precision, against the Wilkinson floor line
      </p>
      <PrecisionCollapseChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the fp64 bar sits at a
        few ULP, well inside the dashed Wilkinson n&middot;&kappa;_pair floor line derived by
        imp-33253 -- an independent cyclic-Jacobi solve reproducing the same floor order as the
        original tred1+tql1 route (imp-3668). The double-double bar is barely visible on this
        scale: it collapses to a relative spread of order 1e-32, roughly {IMP33298_COLLAPSE_ORDERS}{' '}
        orders of magnitude below the fp64 bar. Since the two solves use the SAME matrix, the only
        thing that changed is the working precision -- confirming the fp64 floor is backward error,
        not a genuine residual gap.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> presentation of the imp-33272
        cross-check only -- the rotation used to build the test matrix is a fixed deterministic
        surrogate, not the actual Gram eigenvectors, so this confirms the mechanism and order of
        magnitude, not the exact per-rung realized constant. Adds no new Lambda bound, does not
        re-certify the pairing (imp-3668), and does not attempt the imp-3066 K_a &ge; 0 positivity.
        RH-equivalent, NO QED. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
