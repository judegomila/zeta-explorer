import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95266_THETA_VS_K,
  IMP95266_PHASECERT_THRESHOLD_THETA,
  IMP95266_PHASECERT_THRESHOLD_LOG10,
} from '../data/imp-95266-theta-vs-k-viz-data.js';

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
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
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

// theta(phi_K) on a log10 scale vs K, with the imp-95233 PHASE-CERT vacuity
// threshold theta_0 = e^(-y_min) marked -- every sampled point sits below it.
function ThetaPanel() {
  const points = IMP95266_THETA_VS_K;
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const svgH = 260;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minK = 1;
  const maxK = 8;
  const minY = -14;
  const maxY = 0;
  const xOf = (v) => padL + ((v - minK) / (maxK - minK)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const line = points.map((p) => `${xOf(p.k)},${yOf(p.log10Theta)}`).join(' ');

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={points.map((p) => p.k)}
      yTicks={[0, -2, -4, -6, -8, -10, -12, -14]}
      xOf={xOf}
      yOf={yOf}
      xLabel="packet count K"
      yLabel="log10 theta_K"
    >
      <line
        x1={padL}
        y1={yOf(IMP95266_PHASECERT_THRESHOLD_LOG10)}
        x2={padL + plotW}
        y2={yOf(IMP95266_PHASECERT_THRESHOLD_LOG10)}
        stroke="#f59e0b"
        strokeWidth={1.25}
        strokeDasharray="5 4"
      />
      <text x={padL + plotW - 4} y={yOf(IMP95266_PHASECERT_THRESHOLD_LOG10) - 6} textAnchor="end" fill="#f59e0b" fontSize={8.5}>
        PHASE-CERT threshold theta_0 = e^(-y_min) = {IMP95266_PHASECERT_THRESHOLD_THETA.toFixed(4)} (vacuous below)
      </text>
      <polyline points={line} fill="none" stroke="#38bdf8" strokeWidth={2.25} opacity={0.9} />
      {points.map((p) => (
        <circle key={p.k} cx={xOf(p.k)} cy={yOf(p.log10Theta)} r={3.5} fill="#38bdf8" stroke="#0a0f1a" strokeWidth={1.25} />
      ))}
    </AxisFrame>
  );
}

// L1 = sum|c_j| = 2^K and L2 mass = sum c_j^2 = C(2K,K) on a log10 scale vs K.
function ModulusPanel() {
  const points = IMP95266_THETA_VS_K;
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const svgH = 260;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minK = 1;
  const maxK = 8;
  const minY = 0;
  const maxY = 4.5;
  const xOf = (v) => padL + ((v - minK) / (maxK - minK)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const l1Line = points.map((p) => `${xOf(p.k)},${yOf(p.log10L1)}`).join(' ');
  const l2Line = points.map((p) => `${xOf(p.k)},${yOf(p.log10L2)}`).join(' ');

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={points.map((p) => p.k)}
      yTicks={[0, 1, 2, 3, 4]}
      xOf={xOf}
      yOf={yOf}
      xLabel="packet count K"
      yLabel="log10 modulus"
    >
      <polyline points={l2Line} fill="none" stroke="#a78bfa" strokeWidth={2.25} opacity={0.9} />
      <polyline points={l1Line} fill="none" stroke="#34d399" strokeWidth={2.25} opacity={0.9} />
      {points.map((p) => (
        <circle key={`l1-${p.k}`} cx={xOf(p.k)} cy={yOf(p.log10L1)} r={3.5} fill="#34d399" stroke="#0a0f1a" strokeWidth={1.25} />
      ))}
      {points.map((p) => (
        <circle key={`l2-${p.k}`} cx={xOf(p.k)} cy={yOf(p.log10L2)} r={3.5} fill="#a78bfa" stroke="#0a0f1a" strokeWidth={1.25} />
      ))}
      <circle cx={padL + 12} cy={padT + 10} r={4} fill="#34d399" stroke="#0a0f1a" strokeWidth={1} />
      <text x={padL + 22} y={padT + 14} fill="#94a3b8" fontSize={8.5}>
        L1 = sum|c_j| = 2^K
      </text>
      <circle cx={padL + 12} cy={padT + 26} r={4} fill="#a78bfa" stroke="#0a0f1a" strokeWidth={1} />
      <text x={padL + 22} y={padT + 30} fill="#94a3b8" fontSize={8.5}>
        L2 mass = sum c_j^2 = C(2K,K)
      </text>
    </AxisFrame>
  );
}

export default function Imp95266ThetaVsKPhaseCollapseViz() {
  const points = IMP95266_THETA_VS_K;
  const at3 = points.find((p) => p.k === 3);
  const at8 = points.find((p) => p.k === 8);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Phase Collapse vs Modulus Blow-Up, K = 1..8 (imp-95233 / imp-95224 / imp-95266)" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a model-family numeric
        illustration, not a new theorem. It changes no Lambda bound and establishes no operator
        positivity. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art. RH does not
        follow from anything on this page. NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95224 THEOREM SGN-SAT shows the signed witness family
        phi_K(t) = e^(-t)(1 - e^(-t/K))^K, co-centered at delta = 1 (fixed depth
        y_min = 2), drives R_K &rarr; 1/2 as K &rarr; infinity. imp-95233 shows this
        saturation is bought entirely with phase currency and modulus: the phase-alignment
        ratio theta(phi_K) &rarr; 0 while the amplitude modulus L1 = 2^K and L2 mass =
        C(2K,K) diverge. The panels below plot theta_K against the PHASE-CERT vacuity
        threshold theta_0 = e^(-y_min), and the modulus blow-up, both vs K.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Phase-alignment ratio theta(phi_K)
      </h3>
      <ThetaPanel />

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Amplitude modulus blow-up
      </h3>
      <ModulusPanel />

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
        <strong style={{ color: '#94a3b8' }}>Reading the charts:</strong> at K = {at3.k},
        theta has already collapsed to {at3.theta.toExponential(3)}, far below the amber
        PHASE-CERT threshold {IMP95266_PHASECERT_THRESHOLD_THETA.toFixed(4)}, while the
        modulus is still L1 = {at3.l1}, L2 = {at3.l2}. By K = {at8.k}, theta sits at
        {' '}{at8.theta.toExponential(3)} while L1 = {at8.l1}, L2 = {at8.l2}: every sampled
        point on this witness family already lives in the vacuous-bound regime
        (theta &lt; e^(-y_min)) that imp-95233's HONEST LIMITS flags -- the PHASE-CERT
        bound e^(-y_min)/(2 theta) is large and useless here, not because the certificate
        is wrong, but because this exact witness sequence was built to defeat depth-only
        currency by spending phase and modulus without limit.
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
        imp-95266 baked viz-data (theta_K and the L1/L2 modulus recomputed independently via
        the imp-95233 exact BigInt rational integration and binomial identities; the
        depth-saturation gap 1/2 &minus; R_K, not plotted here but recorded in the data
        module, cross-checks the imp-95224 baked literal to 3e-10 relative). Changes no
        bound, establishes no operator positivity, no RH claim; Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
