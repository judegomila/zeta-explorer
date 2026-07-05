import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33970_JOINT_PHASE_ZERO_UNIQUENESS } from '../data/imp-33970-joint-phase-zero-uniqueness.js';

const { rows: ROWS } = IMP33970_JOINT_PHASE_ZERO_UNIQUENESS;

// Curve alphas span the grid from mid-range up to the near-endpoint 0.99, where the
// imp-33970 closed form predicts the second (excluded) phase-zero branch approaches the
// interval edges (theta -> 0+ / pi-) without ever landing inside (0, pi).
const CURVE_ALPHAS = [0.1, 0.5, 0.75, 0.9, 0.99];
const CURVE_COLORS = ['#64748b', '#38bdf8', '#a78bfa', '#facc15', '#f472b6'];
const THETA_SAMPLES = 361; // half-degree resolution over (0, pi)

// realness residual |Im(-A)|/|-A| = |sin(p(pi/2 - theta))|, p = 1+alpha (imp-33970 closed form:
// -A(alpha,theta) = 2 B(alpha) |cos(p pi/2)| e^{i p(pi/2-theta)}, a never-vanishing modulus times
// a pure phase, so the normalised imaginary part IS the sine of that phase, exactly).
function realnessResidual(alpha, theta) {
  const p = 1 + alpha;
  return Math.abs(Math.sin(p * (Math.PI / 2 - theta)));
}

const CURVES = CURVE_ALPHAS.map((alpha) => {
  const points = [];
  for (let i = 0; i < THETA_SAMPLES; i++) {
    const theta = (i / (THETA_SAMPLES - 1)) * Math.PI;
    points.push({ thetaDeg: (theta * 180) / Math.PI, residual: realnessResidual(alpha, theta) });
  }
  return { alpha, points };
});

function ResidualVsThetaChart() {
  const svgW = 640;
  const svgH = 340;
  const padL = 44;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xAt = (thetaDeg) => padL + (thetaDeg / 180) * cW;
  const yAt = (residual) => padT + cH - residual * cH; // residual in [0, 1]

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* theta = pi/2 marker: the unique phase-zero for every alpha */}
      <line x1={xAt(90)} y1={padT} x2={xAt(90)} y2={padT + cH} stroke="#334155" strokeWidth={1} strokeDasharray="3,3" />
      <text x={xAt(90)} y={padT - 4} textAnchor="middle" fill="#475569" fontSize={9}>
        theta = pi/2
      </text>

      {CURVES.map((c, idx) => {
        const path = c.points.map((pt, i) => `${i === 0 ? 'M' : 'L'}${xAt(pt.thetaDeg).toFixed(1)},${yAt(pt.residual).toFixed(2)}`).join(' ');
        return <path key={c.alpha} d={path} fill="none" stroke={CURVE_COLORS[idx]} strokeWidth={1.8} opacity={0.92} />;
      })}

      {[0, 45, 90, 135, 180].map((deg) => (
        <text key={`xt-${deg}`} x={xAt(deg)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {deg}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        theta (degrees, 0..180)
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 12 ${padT + cH / 2})`}
      >
        realness residual |sin(p(pi/2-theta))|
      </text>

      {CURVE_ALPHAS.map((alpha, idx) => (
        <text key={`leg-${alpha}`} x={padL + 4} y={padT + 12 + idx * 13} fill={CURVE_COLORS[idx]} fontSize={9.5}>
          alpha = {alpha}
        </text>
      ))}
    </svg>
  );
}

export default function Imp34037RealnessResidualVsThetaViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Realness Residual vs Theta Across Alpha (imp-33970 / imp-34037)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33970 showed that the imp-33924 joint leading amplitude -A(alpha,theta) has a
        never-vanishing modulus, so its realness residual |Im(-A)|/|-A| reduces to the pure phase
        quantity |sin(p(pi/2-theta))| with p = 1+alpha. The chart below sweeps theta over the open
        interval (0, pi) for a handful of cusp exponents from alpha = 0.1 up to the near-endpoint
        0.99. Every curve has a single clean dip to zero at theta = pi/2 (the unique phase-zero).
        As alpha approaches the excluded endpoint 1, a SECOND, shallower dip forms and pushes toward
        the interval edges (theta -&gt; 0+ / pi-) -- the excluded k = &plusmn;1 branch of the imp-33970
        closed form, which only reaches theta = 0 or pi in the alpha -&gt; 1- limit and never actually
        enters (0, pi).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        realness residual vs theta -- alpha = {CURVE_ALPHAS.join(', ')}
      </p>
      <ResidualVsThetaChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        per-alpha dense-scan summary (imp-33970 rows)
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.78rem', color: '#94a3b8', width: '100%' }}>
          <thead>
            <tr style={{ color: '#64748b', textAlign: 'right' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>alpha</th>
              <th style={{ padding: '4px 8px' }}>best theta (deg)</th>
              <th style={{ padding: '4px 8px' }}>min residual</th>
              <th style={{ padding: '4px 8px' }}>max residual outside window</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.alpha} style={{ borderTop: '1px solid #1e293b', textAlign: 'right' }}>
                <td style={{ textAlign: 'left', padding: '4px 8px' }}>{r.alpha}</td>
                <td style={{ padding: '4px 8px' }}>{r.scanBestThetaDeg}</td>
                <td style={{ padding: '4px 8px' }}>{r.minRealnessResidual}</td>
                <td style={{ padding: '4px 8px' }}>{r.maxRealnessResidualOutsideWindow}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> derivation/measurement only, on
        the model cusp rho(x) = |x|^-alpha. This re-expresses the imp-33970 closed form for display;
        it does not re-derive the m_prime -&gt; C_ren map off-axis/off-exponent. H4 (imp-33766) is NOT
        discharged; G6a_shock_lipschitz stays OPEN; imp-3066 off-diagonal endpoint-Hankel K_a&gt;=0
        UNTOUCHED; NO QED; Platt-Trudgian Lambda&lt;=0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
