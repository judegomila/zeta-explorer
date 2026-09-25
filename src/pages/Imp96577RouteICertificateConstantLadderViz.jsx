import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96577_LADDER,
  IMP96577_EXTRAPOLATION,
  IMP96577_BRACKET,
  IMP96577_HONEST_BANNER,
} from '../data/imp-96577-route-i-certificate-constant-ladder-viz-data.js';

// dot-plus-line chart: the five rigorous from-below ladder points on a 1/T
// x-axis (so the 1/T -> 0 limit sits at the left edge), the from-above Ritz
// value as a horizontal dashed line, and the bracket as a shaded band.
function LadderPanel() {
  const rows = IMP96577_LADDER;
  const svgW = 700;
  const padL = 64;
  const padR = 20;
  const svgH = 320;
  const padT = 20;
  const padB = 48;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xs = rows.map((r) => 1 / r.T);
  const maxX = Math.max(...xs) * 1.08;
  const minX = 0;
  const allY = [...rows.map((r) => r.value), IMP96577_EXTRAPOLATION.ritzFromAbove, IMP96577_BRACKET.lo, IMP96577_BRACKET.hi];
  const minY = Math.min(...allY) * 0.96;
  const maxY = Math.max(...allY) * 1.04;

  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const ritzY = yOf(IMP96577_EXTRAPOLATION.ritzFromAbove);
  const bandTop = yOf(IMP96577_BRACKET.hi);
  const bandBot = yOf(IMP96577_BRACKET.lo);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={bandTop} width={plotW} height={Math.max(bandBot - bandTop, 1)} fill="#38bdf8" opacity={0.1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      {[minY, (minY + maxY) / 2, maxY].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
            {(v * 1e4).toFixed(3)}e-4
          </text>
        </g>
      ))}
      <line x1={padL} y1={ritzY} x2={padL + plotW} y2={ritzY} stroke="#facc15" strokeWidth={1.4} strokeDasharray="5 3" />
      <text x={padL + plotW - 4} y={ritzY - 6} textAnchor="end" fill="#facc15" fontSize={9}>
        Ritz (from above) {IMP96577_EXTRAPOLATION.ritzFromAbove.toExponential(3)}
      </text>
      <polyline
        points={rows.map((r) => `${xOf(1 / r.T)},${yOf(r.value)}`).join(' ')}
        fill="none"
        stroke="#38bdf8"
        strokeWidth={1.6}
      />
      {rows.map((r) => (
        <g key={r.T}>
          <circle cx={xOf(1 / r.T)} cy={yOf(r.value)} r={4} fill="#38bdf8" />
          <text x={xOf(1 / r.T)} y={yOf(r.value) - 10} textAnchor="middle" fill="#e2e8f0" fontSize={8.5}>
            T={r.T}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 38} textAnchor="middle" fill="#94a3b8" fontSize={9}>
        1/T (decreasing right to left; T -&gt; infinity at the left edge)
      </text>
    </svg>
  );
}

export default function Imp96577RouteICertificateConstantLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I: Certificate Constant vs. Truncation T" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96577_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The Route I certificate proves a rigorous lower bound c(T) = m_T + &lambda;<sub>min</sub>(K<sub>N</sub>|V<sub>N</sub>)
        on the true D<sub>S</sub> &le; L<sub>S</sub> constant C* for every finite truncation T, rising with T because the
        certified minimizer&apos;s Fourier tail decays like 1/t<sup>2</sup>. Two independent estimates bracket C*: the
        from-below finite-T ladder (two-term 1/T &minus; 1/T<sup>2</sup> extrapolated to {IMP96577_EXTRAPOLATION.twoTermFit.Cstar.toExponential(4)})
        and the from-above Rayleigh&ndash;Ritz pencil-map value {IMP96577_EXTRAPOLATION.ritzFromAbove.toExponential(3)}, agreeing to
        &lt; 0.05%.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Finite-T certificate ladder c(T) vs. 1/T, bracketed by the from-above Ritz value
      </h3>
      <LadderPanel />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the blue dots are the five rigorous
        (double-precision, non-interval) finite-T certificate values c(200)&hellip;c(800), each a proved lower bound on
        C* at that T. A naive two-point 1/T extrapolation from later T-pairs actually DECREASES toward the Ritz line
        ({IMP96577_EXTRAPOLATION.pure1overT.map((p) => `${p.pair}: ${(p.value * 1e4).toFixed(3)}e-4`).join(', ')}) &mdash;
        a positive-curvature artifact of dropping the 1/T<sup>2</sup> term. The shaded band is the rigorous bracket
        [{IMP96577_BRACKET.lo.toExponential(4)}, {IMP96577_BRACKET.hi.toExponential(3)}] (&asymp; {IMP96577_BRACKET.widthPct}% wide).
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the imp-96577 baked viz-data
        (ladder, extrapolants, and bracket copied verbatim from the certificate module&apos;s own constantReconciliation
        literal). {IMP96577_HONEST_BANNER}
      </div>
    </div>
  );
}
