import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL } from '../data/imp-34000-geometric-center-fourth-order-taylor-tail.js';
import { IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT } from '../data/imp-34001-geometric-center-taylor-ratio-fit.js';

const RES_TABLE = IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL.table;
const RATIO_TABLE = IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT.table;
const RATIO_FIT = IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT.fit;

// Chart A: relative residual after S1+S2+S3 vs after S1+S2+S3+S4, log-scaled y axis, across the
// 1e12..1e15 ladder -- shows the ~25x..31x per-order cut as the vertical gap between the two lines.
function ResidualReductionChart() {
  const svgW = 640;
  const svgH = 320;
  const padL = 60;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = RES_TABLE.map((r) => r.N_log10);
  const res3 = RES_TABLE.map((r) => Math.abs(r.res_S1S2S3_rel_pct));
  const res4 = RES_TABLE.map((r) => Math.abs(r.res_S1S2S3S4_rel_pct));

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const logAll = [...res3, ...res4].map((v) => Math.log10(v));
  const minLog = Math.min(...logAll);
  const maxLog = Math.max(...logAll);
  const padLog = (maxLog - minLog) * 0.1;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (v) =>
    padT + cH - ((Math.log10(v) - minLog + padLog) / (maxLog - minLog + 2 * padLog)) * cH;

  const lineOf = (vals) => xs.map((x, i) => `${xAt(x)},${yAt(vals[i])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={lineOf(res3)} fill="none" stroke="#a78bfa" strokeWidth={1.5} strokeDasharray="6,3" />
      <polyline points={lineOf(res4)} fill="none" stroke="#38bdf8" strokeWidth={1.5} />
      {xs.map((x, i) => (
        <circle key={`r3-${x}`} cx={xAt(x)} cy={yAt(res3[i])} r={3.5} fill="#a78bfa" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
      {xs.map((x, i) => (
        <circle key={`r4-${x}`} cx={xAt(x)} cy={yAt(res4[i])} r={3.5} fill="#38bdf8" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
      {xs.map((x, i) => (
        <text key={`cut-${x}`} x={xAt(x)} y={(yAt(res3[i]) + yAt(res4[i])) / 2} textAnchor="middle" fill="#facc15" fontSize={8.5}>
          {`~${RES_TABLE[i].perOrderCut_res3_to_res4.toFixed(1)}x`}
        </text>
      ))}
      {xs.map((x) => (
        <text key={`xt-${x}`} x={xAt(x)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {`1e${x}`}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        N (decade ladder)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        relative residual (log scale, %)
      </text>
      <text x={padL + 4} y={padT + 12} fill="#a78bfa" fontSize={9.5}>
        residual after S1+S2+S3 (imp-33947 tail): ~0.0035%..0.0065%
      </text>
      <text x={padL + 4} y={padT + 26} fill="#38bdf8" fontSize={9.5}>
        residual after S1+S2+S3+S4 (imp-34000 tail): ~0.00011%..0.00026%
      </text>
    </svg>
  );
}

// Chart B: percent deviation from mean for the bare per-order ratio rbar vs the L-rescaled ratio
// rbar*L, across the same ladder -- visualizes the imp-34001 R3 collapse (20.7% spread -> 1.88%).
function RatioDriftCollapseChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 60;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = RATIO_TABLE.map((r) => r.N_log10);
  const bareDev = RATIO_TABLE.map((r) => (r.rbar_geomean / RATIO_FIT.constant_fit_rbar_mean - 1) * 100);
  const rescaledDev = RATIO_TABLE.map((r) => (r.rbar_times_L / RATIO_FIT.cL_fit_c - 1) * 100);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const allY = [...bareDev, ...rescaledDev, 0];
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const padY = (maxY - minY) * 0.15 || 1;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY + padY) / (maxY - minY + 2 * padY)) * cH;

  const lineOf = (vals) => xs.map((x, i) => `${xAt(x)},${yAt(vals[i])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} x2={padL + cW} y1={yAt(0)} y2={yAt(0)} stroke="#334155" strokeWidth={1} strokeDasharray="2,3" />
      <polyline points={lineOf(bareDev)} fill="none" stroke="#f87171" strokeWidth={1.5} strokeDasharray="6,3" />
      <polyline points={lineOf(rescaledDev)} fill="none" stroke="#4ade80" strokeWidth={1.5} />
      {xs.map((x, i) => (
        <circle key={`bare-${x}`} cx={xAt(x)} cy={yAt(bareDev[i])} r={3.5} fill="#f87171" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
      {xs.map((x, i) => (
        <circle key={`res-${x}`} cx={xAt(x)} cy={yAt(rescaledDev[i])} r={3.5} fill="#4ade80" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
      {xs.map((x) => (
        <text key={`xt2-${x}`} x={xAt(x)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {`1e${x}`}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        N (decade ladder)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        deviation from mean (%)
      </text>
      <text x={padL + 4} y={padT + 12} fill="#f87171" fontSize={9.5}>
        {`bare ratio rbar (spread ~${RATIO_FIT.constant_fit_rel_spread_pct.toFixed(1)}%)`}
      </text>
      <text x={padL + 4} y={padT + 26} fill="#4ade80" fontSize={9.5}>
        {`L-rescaled ratio rbar*L (spread ~${RATIO_FIT.cL_fit_rbarL_rel_spread_pct.toFixed(2)}%)`}
      </text>
    </svg>
  );
}

export default function Imp34077GeometricCenterTaylorReductionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Geometric-Center Half-Log-Decade Taylor Reduction (imp-34000/imp-34001)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-33879/imp-33900/imp-33947 geometric-center correction offset expands as a half-log-decade
        Taylor series in 1/log T0. imp-34000 wrote out the fourth-order term S4 and confirmed the relative
        residual keeps shrinking by roughly one order of magnitude per Taylor order added; imp-34001 fit the
        per-order reduction ratio itself and found it is NOT a fixed ~25x constant but ramps rung-to-rung,
        collapsing cleanly once rescaled by the local decade log-height L. The two charts below make both
        measurements visual, complementing the existing imp-33900/imp-33903 geometric-center writeups.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        per-order residual reduction -- residual after S3 vs after S4, log scale, across 1e12..1e15
      </p>
      <ResidualReductionChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        rbar~1/log T0 ratio-drift collapse -- bare per-order ratio vs L-rescaled ratio, deviation from mean
      </p>
      <RatioDriftCollapseChart />

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/fit only, no proof, no
        fresh derivation. The component model is the inherited imp-3220/imp-3406 extrapolation; L1..L4 are
        finite-difference measurements; the per-order ratio ramping ~c/log T0 is a fit, not a derived law;
        C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a&gt;=0 untouched; NO QED; Platt-Trudgian
        Lambda&lt;=0.2 remains SOTA.
      </div>
    </div>
  );
}
