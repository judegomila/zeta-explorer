import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP_95624_CROSSOVER_CURVE,
  IMP_95624_MARKERS,
  IMP_95624_PER_ZERO_FACTOR,
} from '../data/imp-95624-mty-vs-vk-crossover-viz-data.js';

const log10 = Math.log10;

function CrossoverChart() {
  const points = IMP_95624_CROSSOVER_CURVE;
  const svgW = 720;
  const svgH = 380;
  const padL = 64;
  const padR = 24;
  const padT = 20;
  const padB = 56;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = points[0].log10LogT;
  const xMax = points[points.length - 1].log10LogT;
  const xOf = (u) => padL + ((u - xMin) / (xMax - xMin)) * plotW;

  // Log-y over the width values (which span ~2.5 decades across the sample range).
  const yMinExp = -5; // 1e-5
  const yMaxExp = -2; // 1e-2
  const yOf = (v) => {
    const e = log10(v);
    const clamped = Math.max(yMinExp, Math.min(yMaxExp, e));
    return padT + plotH - ((clamped - yMinExp) / (yMaxExp - yMinExp)) * plotH;
  };

  const pathOf = (key) =>
    points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10LogT)} ${yOf(p[key])}`).join(' ');

  const yTickExps = [-2, -3, -4, -5];
  const xTicks = [1.5, 2, 2.5, 3, 3.5, 4];

  const { windowLo, windowHi, crossover } = IMP_95624_MARKERS;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke="#64748b"
        strokeWidth={1.5}
      />
      {yTickExps.map((e) => (
        <g key={`y${e}`}>
          <line
            x1={padL}
            y1={yOf(Math.pow(10, e))}
            x2={padL + plotW}
            y2={yOf(Math.pow(10, e))}
            stroke="#1e293b"
            strokeWidth={1}
            strokeDasharray="2 4"
          />
          <text x={padL - 8} y={yOf(Math.pow(10, e)) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
            {`1e${e}`}
          </text>
        </g>
      ))}
      {xTicks.map((u) => (
        <g key={`x${u}`}>
          <line
            x1={xOf(u)}
            y1={padT + plotH}
            x2={xOf(u)}
            y2={padT + plotH + 4}
            stroke="#334155"
            strokeWidth={1}
          />
          <text x={xOf(u)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            {u.toFixed(1)}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        log10(log t)
      </text>
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={9.5}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        zero-free width 1 - beta
      </text>

      <path d={pathOf('classical')} fill="none" stroke="#34d399" strokeWidth={2} />
      <path d={pathOf('vk')} fill="none" stroke="#38bdf8" strokeWidth={2} />

      {[windowLo, windowHi].map((m) => (
        <g key={m.label}>
          <line
            x1={xOf(m.log10LogT)}
            y1={padT}
            x2={xOf(m.log10LogT)}
            y2={padT + plotH}
            stroke="#f472b6"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <text
            x={xOf(m.log10LogT)}
            y={padT - 6}
            textAnchor="middle"
            fill="#f472b6"
            fontSize={7.5}
          >
            {m.label}
          </text>
        </g>
      ))}
      <line
        x1={xOf(crossover.log10LogT)}
        y1={padT}
        x2={xOf(crossover.log10LogT)}
        y2={padT + plotH}
        stroke="#fb923c"
        strokeWidth={1.5}
        strokeDasharray="5 3"
      />
      <text x={xOf(crossover.log10LogT)} y={padT + 10} textAnchor="middle" fill="#fb923c" fontSize={7.5}>
        crossover
      </text>
    </svg>
  );
}

export default function Imp95624MtyVsVkCrossoverViz() {
  const { crossover } = IMP_95624_MARKERS;
  const factor = IMP_95624_PER_ZERO_FACTOR;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Classical MTY vs Ford VK Zero-Free Width, T in [3e12, 1.9e16]" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a descriptive recomputation
        of the imp-95605 / imp-95519 sec 3(b) figures, sampled onto a curve for charting. It
        changes no Lambda bound and establishes no operator positivity. Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains state of the art. RH does not follow from anything on this
        page. NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Green is the classical Mossinghoff&ndash;Trudgian&ndash;Yang unconditional zero-free
        width 1/(5.558691 log t); blue is the Ford Vinogradov&ndash;Korobov width
        1/(57.54 (log t)^(2/3) (loglog t)^(1/3)). The pink dashed lines mark the imp-95519
        window endpoints (T_LO ~ 3.0e12, T_HI ~ 1.9e16, log t in [28.73, 37.48]); the classical
        curve sits strictly above the VK curve throughout, 5.06x wider at the bottom and 4.75x
        wider at the top. The orange dashed line marks the crossover at
        log t &asymp; {crossover.logT.toFixed(0)} (t &asymp; e^10000), &asymp;
        {(crossover.logT / 37.4832).toFixed(0)}x above the window top, where VK finally
        overtakes classical.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Zero-free width vs log10(log t), both curves on a log-y axis
      </h3>
      <CrossoverChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the x-axis is
        log10(log t), which compresses the huge range from the window (log t &asymp; 29&ndash;37)
        out to the crossover (log t &asymp; 10242) onto one plot. Both curves decrease
        monotonically as log t grows; classical decreases like 1/log t while VK decreases only
        like 1/(log t)^(2/3), which is why VK is shallower and eventually overtakes classical far
        outside the window. Inside the entire verified window, the per-zero factor
        u^(-(1-beta)) &mdash; the discount a single zero&apos;s contribution gets from the
        zero-free region &mdash; stays pinned at the floor value {factor.floor.lo.toFixed(4)},
        the same at both ends: {factor.note}
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
        imp-95605 independent recomputation (itself verifying imp-95519 sec 3(b)). Changes no
        bound, establishes no operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda;
        &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
