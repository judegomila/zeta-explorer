import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95888_ENVELOPE_CURVE,
  IMP95888_MEASURED_POINTS,
  IMP95888_LANDMARKS,
  IMP95888_GAP_DECADES,
  IMP95888_CAVEAT_BANNER,
} from '../data/imp-95888-rcap-window-bottom-viz-data.js';

const LANDMARK_COLOR = {
  measured_ceiling: '#38bdf8',
  window_bottom: '#a78bfa',
};

// r_cap(T) vs log10 T: the six imp-95710 measured points (dots) plus the
// fine-grid closed-form bridge (line) all the way out to the imp-95519
// window bottom -- the only in-repo lever that reaches T=3e12 at all.
function RCapWindowBottomChart() {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 30;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xMin = IMP95888_MEASURED_POINTS[0].log10T;
  const xMax = IMP95888_ENVELOPE_CURVE[IMP95888_ENVELOPE_CURVE.length - 1].log10T;
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  const yMin = 0;
  const yMax = 1.05;
  const yOf = (v) => padT + ((yMax - v) / (yMax - yMin)) * plotH;

  const curvePath = IMP95888_ENVELOPE_CURVE.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10T)} ${yOf(p.rCap)}`,
  ).join(' ');
  const measuredCapPath = IMP95888_MEASURED_POINTS.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10T)} ${yOf(p.rCap)}`,
  ).join(' ');

  const gueY = yOf(1);
  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
  const measuredCeilingLog10T = IMP95888_LANDMARKS[0].log10T;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={xOf(xMin)} y={padT} width={xOf(measuredCeilingLog10T) - xOf(xMin)} height={plotH} fill="rgba(52,211,153,0.05)" />
      <rect x={xOf(measuredCeilingLog10T)} y={padT} width={xOf(xMax) - xOf(measuredCeilingLog10T)} height={plotH} fill="rgba(248,113,113,0.04)" />
      <text x={xOf(xMin) + 4} y={padT - 6} textAnchor="start" fill="#34d399" fontSize={9}>
        imp-95710 measured range
      </text>
      <text x={xOf(xMax) - 4} y={padT - 6} textAnchor="end" fill="#f87171" fontSize={9}>
        {'>'} 6.7-decade gap: no in-repo data, only the derived envelope
      </text>

      {yTicks.map((t) => (
        <line key={`gy${t}`} x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke="#1e293b" strokeWidth={1} />
      ))}

      <line x1={padL} y1={gueY} x2={padL + plotW} y2={gueY} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" />
      <text x={padL + plotW - 4} y={gueY - 5} textAnchor="end" fill="#94a3b8" fontSize={9}>
        conservatism ceiling r_cap=1
      </text>

      <path d={curvePath} fill="none" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 4" />
      <path d={measuredCapPath} fill="none" stroke="#34d399" strokeWidth={2} />
      {IMP95888_MEASURED_POINTS.map((p) => (
        <circle key={`m-${p.T}`} cx={xOf(p.log10T)} cy={yOf(p.rCap)} r={3} fill="#34d399" />
      ))}

      {IMP95888_LANDMARKS.map((m) => {
        const x = xOf(m.log10T);
        const color = LANDMARK_COLOR[m.name];
        return (
          <g key={m.name}>
            <line x1={x} y1={padT} x2={x} y2={padT + plotH} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={x} cy={yOf(m.rCap)} r={4} fill={color} />
          </g>
        );
      })}

      {IMP95888_LANDMARKS.map((m, i) => {
        const x = xOf(m.log10T);
        const color = LANDMARK_COLOR[m.name];
        const anchor = i === 0 ? 'start' : 'end';
        return (
          <text key={`lbl-${m.name}`} x={x} y={padT + 12} textAnchor={anchor} fill={color} fontSize={9}>
            {`${m.label}: r_cap=${m.rCap.toFixed(4)}`}
          </text>
        );
      })}

      <text x={xOf(xMin) + 4} y={yOf(IMP95888_MEASURED_POINTS[0].rCap) - 8} fill="#34d399" fontSize={9}>
        measured six points (solid)
      </text>
      <text x={xOf(xMax) - 4} y={yOf(0.05)} textAnchor="end" fill="#60a5fa" fontSize={9}>
        closed-form bridge (dashed)
      </text>

      {[xMin, measuredCeilingLog10T, xMax].map((lt) => (
        <text key={`tx${lt}`} x={xOf(lt)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {lt.toFixed(1)}
        </text>
      ))}
      {yTicks.map((t) => (
        <text key={`ty${t}`} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
          {t.toFixed(1)}
        </text>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        log10 T
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        r_cap(T)
      </text>
    </svg>
  );
}

export default function Imp95888RcapWindowBottomViz() {
  const ceiling = IMP95888_LANDMARKS[0];
  const windowBottom = IMP95888_LANDMARKS[1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Number-Variance Ratio Cap r_cap(T): Window-Bottom Envelope (imp-95722 / imp-95888)" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP95888_CAVEAT_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95710 measured the pointwise-variance / GUE number-variance ratio r(T) across six
        heights spanning only T&nbsp;=&nbsp;1e4..{ceiling.T.toExponential(0)} (~1.7 decades) --
        a{' '}
        {IMP95888_GAP_DECADES.toFixed(2)}-decade gap short of the imp-95519 window bottom
        T&nbsp;=&nbsp;3.0e12. imp-95722 closed that reach gap analytically: the numerator
        (pointwise counting-fluctuation variance) grows at most like Selberg&apos;s unconditional
        log log T law while the GUE denominator grows like log T, giving a derived envelope
        r_cap(T) that provably falls from {ceiling.rCap.toFixed(4)} at the measured ceiling to{' '}
        {windowBottom.rCap.toFixed(4)} at the window bottom -- the only in-repo lever that reaches
        that far at all.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        r_cap(T) vs height (log scale): measured range vs the closed-form bridge
      </h3>
      <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        Green shading (solid line, dots): the six imp-95710 measured heights, where the envelope
        is anchored against real sd(C&minus;E) data. Red shading (dashed line): the
        {' '}{IMP95888_GAP_DECADES.toFixed(1)}-decade span above the measured ceiling, where the
        curve is the imp-95722 closed form evaluated on a fine grid for chart resolution only --
        no measurement exists there.
      </p>
      <RCapWindowBottomChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>T</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>log10 T</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>r(T) measured</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>r_cap(T)</th>
          </tr>
        </thead>
        <tbody>
          {IMP95888_MEASURED_POINTS.map((p) => (
            <tr key={p.T} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{p.T.toExponential(1)}</td>
              <td style={{ textAlign: 'right' }}>{p.log10T.toFixed(2)}</td>
              <td style={{ textAlign: 'right', color: '#34d399' }}>{p.rMeasured.toFixed(4)}</td>
              <td style={{ textAlign: 'right', color: '#60a5fa' }}>{p.rCap.toFixed(4)}</td>
            </tr>
          ))}
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.35)' }}>
            <td style={{ padding: '3px 0' }}>{windowBottom.T.toExponential(1)}</td>
            <td style={{ textAlign: 'right' }}>{windowBottom.log10T.toFixed(2)}</td>
            <td style={{ textAlign: 'right', color: '#64748b' }}>&mdash; (no measurement)</td>
            <td style={{ textAlign: 'right', color: '#a78bfa' }}>{windowBottom.rCap.toFixed(4)}</td>
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page rendering the frozen
        imp-95722 derived envelope verbatim (no re-derivation). Supplies no new bound, establishes
        no operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA.
        NO QED.
      </div>
    </div>
  );
}
