import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY } from '../data/imp-34045-phase-zero-endpoint-degeneracy.js';

const { rows: ROWS } = IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY;

// Dense alpha grid so the endpoint-collapse of the outer real-negative branch (pi/2 -+ pi/p) is
// visibly smooth, alongside the fixed second real-positive branch (pi/2 -+ 2pi/p) that never
// approaches the endpoints below alpha = 1 (imp-34045 closed form).
const ALPHA_SAMPLES = 241;
const CURVE_ALPHAS = Array.from({ length: ALPHA_SAMPLES }, (_, i) => (i / (ALPHA_SAMPLES - 1)) * 0.999);

function branchAnglesDeg(alpha) {
  const p = 1 + alpha;
  return {
    negLowerDeg: ((Math.PI / 2 - Math.PI / p) * 180) / Math.PI,
    negUpperDeg: ((Math.PI / 2 + Math.PI / p) * 180) / Math.PI,
    posLowerDeg: ((Math.PI / 2 - (2 * Math.PI) / p) * 180) / Math.PI,
    posUpperDeg: ((Math.PI / 2 + (2 * Math.PI) / p) * 180) / Math.PI,
  };
}

const CURVE = CURVE_ALPHAS.map((alpha) => ({ alpha, ...branchAnglesDeg(alpha) }));

function Chart() {
  const svgW = 680;
  const svgH = 400;
  const padL = 48;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  // theta range shown: -100 .. 280 degrees so both outer branches (which sit outside 0..180 for
  // alpha < 1) are visible flanking the central 0..180 interval.
  const yMin = -110;
  const yMax = 290;
  const xAt = (alpha) => padL + (alpha / 1) * cW;
  const yAt = (deg) => padT + cH - ((deg - yMin) / (yMax - yMin)) * cH;

  const path = (key) => CURVE.map((c, i) => `${i === 0 ? 'M' : 'L'}${xAt(c.alpha).toFixed(2)},${yAt(c[key]).toFixed(2)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* interval endpoints 0 and pi (180deg) -- the target of the endpoint-collapsing branch */}
      <rect x={padL} y={yAt(180)} width={cW} height={yAt(0) - yAt(180)} fill="rgba(56,189,248,0.05)" />
      {[0, 180].map((deg) => (
        <line key={`bnd-${deg}`} x1={padL} y1={yAt(deg)} x2={padL + cW} y2={yAt(deg)} stroke="#0ea5e9" strokeWidth={1} strokeDasharray="4,3" />
      ))}
      <text x={padL + cW - 4} y={yAt(180) - 4} textAnchor="end" fill="#0ea5e9" fontSize={9}>
        interval boundary (0 / 180deg)
      </text>

      {/* central fixed zero theta = pi/2 = 90deg, unique for every alpha (imp-33970) */}
      <line x1={padL} y1={yAt(90)} x2={padL + cW} y2={yAt(90)} stroke="#334155" strokeWidth={1} strokeDasharray="2,3" />
      <text x={padL + 4} y={yAt(90) - 4} fill="#475569" fontSize={9}>
        theta = pi/2 (unique zero)
      </text>

      {/* family (i): outer real-negative crossing pi/2 -+ pi/p -- COLLAPSES onto 0 / 180 as alpha-&gt;1 */}
      <path d={path('negLowerDeg')} fill="none" stroke="#f472b6" strokeWidth={2} />
      <path d={path('negUpperDeg')} fill="none" stroke="#f472b6" strokeWidth={2} />

      {/* family (ii): second real-positive branch pi/2 -+ 2pi/p -- stays pi/2 outside even at alpha=1 */}
      <path d={path('posLowerDeg')} fill="none" stroke="#facc15" strokeWidth={2} strokeDasharray="6,3" />
      <path d={path('posUpperDeg')} fill="none" stroke="#facc15" strokeWidth={2} strokeDasharray="6,3" />

      {[0, 0.25, 0.5, 0.75, 0.999].map((a) => (
        <text key={`xt-${a}`} x={xAt(a)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {a === 0.999 ? '1' : a}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        alpha (cusp exponent, 0..1)
      </text>
      <text x={12} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90 12 ${padT + cH / 2})`}>
        branch angle theta (degrees)
      </text>

      <text x={padL + 6} y={padT + 12} fill="#f472b6" fontSize={9.5}>
        family (i): pi/2 -+ pi/p (endpoint-collapsing)
      </text>
      <text x={padL + 6} y={padT + 26} fill="#facc15" fontSize={9.5}>
        family (ii): pi/2 -+ 2pi/p (second real-positive, never collapses below alpha=1)
      </text>
    </svg>
  );
}

export default function Imp34119PhaseZeroBranchGeometryViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Joint Phase-Zero Branch Geometry vs Alpha (imp-34045 / imp-34119)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34045 characterised the alpha -&gt; 1 (p = 1+alpha -&gt; 2) boundary degeneracy of the
        imp-33970 joint phase-zero on the imp-33924 closed form -A(alpha,theta). Two flanking branch
        families surround the fixed central zero theta = pi/2: the outer real-NEGATIVE crossings
        theta = pi/2 &plusmn; pi/p, which COLLAPSE onto the interval endpoints 0 and pi as alpha
        rises toward 1, and the second real-POSITIVE crossings theta = pi/2 &plusmn; 2pi/p, a further
        pi/p out, which stay a full pi/2 outside the interval even at alpha = 1 and only reach the
        endpoints at the far-outside value p = 4 (alpha = 3). Both families are shown together below
        so the endpoint collapse of family (i) versus the persistent gap of family (ii) is visible in
        one picture.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        branch angle vs alpha -- both outer families, upper and lower crossings
      </p>
      <Chart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        imp-34045 per-alpha table
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.76rem', color: '#94a3b8', width: '100%' }}>
          <thead>
            <tr style={{ color: '#64748b', textAlign: 'right' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>alpha</th>
              <th style={{ padding: '4px 8px' }}>family (i) lower/upper (deg)</th>
              <th style={{ padding: '4px 8px' }}>dist from endpoint (i)</th>
              <th style={{ padding: '4px 8px' }}>family (ii) lower/upper (deg)</th>
              <th style={{ padding: '4px 8px' }}>dist from endpoint (ii)</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.alpha} style={{ borderTop: '1px solid #1e293b', textAlign: 'right' }}>
                <td style={{ textAlign: 'left', padding: '4px 8px' }}>{r.alpha}</td>
                <td style={{ padding: '4px 8px' }}>
                  {r.outerNegRealLowerDeg} / {r.outerNegRealUpperDeg}
                </td>
                <td style={{ padding: '4px 8px' }}>{r.distFromEndpointNegReal}</td>
                <td style={{ padding: '4px 8px' }}>
                  {r.secondPosLowerDeg} / {r.secondPosUpperDeg}
                </td>
                <td style={{ padding: '4px 8px' }}>{r.distFromEndpointSecondPos}</td>
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
        the model cusp rho(x) = |x|^-alpha. This re-expresses the imp-34045 closed form for display;
        it does not re-derive the m_prime -&gt; C_ren map off-axis/off-exponent. H4 (imp-33766) is NOT
        discharged; G6a_shock_lipschitz stays OPEN; imp-3066 off-diagonal endpoint-Hankel K_a&gt;=0
        UNTOUCHED; NO QED; Platt-Trudgian Lambda&lt;=0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
