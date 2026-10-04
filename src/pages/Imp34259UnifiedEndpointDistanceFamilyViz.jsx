import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34259_CURVE,
  IMP34259_TABLE_ROWS,
  IMP34259_ONSET_LADDER,
} from '../data/imp-34259-unified-endpoint-distance-family-viz-data.js';
import { ED } from '../styles/tokens.js';

const K_COLORS = { 1: ED.series7, 2: ED.series4, 3: ED.series5, 4: ED.series1 };

// d_k(alpha) for k = 1..4 plotted together: each branch's endpoint distance rises from a large
// negative value (well outside [0, pi]) toward zero at its own onset alpha_k = 2k - 1.
function DistanceFamilyChart() {
  const svgW = 680;
  const svgH = 380;
  const padL = 48;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMin = -260;
  const yMax = 20;
  const xAt = (alpha) => padL + (alpha / 1) * cW;
  const yAt = (deg) => padT + cH - ((deg - yMin) / (yMax - yMin)) * cH;

  const path = (key) =>
    IMP34259_CURVE.map((c, i) => `${i === 0 ? 'M' : 'L'}${xAt(c.alpha).toFixed(2)},${yAt(c[key]).toFixed(2)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke={ED.series1} strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + cW - 4} y={yAt(0) - 4} textAnchor="end" fill={ED.series1} fontSize={9}>
        d_k = 0 (endpoint onset)
      </text>

      {[1, 2, 3, 4].map((k) => (
        <path key={k} d={path(`d${k}Deg`)} fill="none" stroke={K_COLORS[k]} strokeWidth={2} />
      ))}

      {[0, 0.25, 0.5, 0.75, 0.999].map((a) => (
        <text key={`xt-${a}`} x={xAt(a)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {a === 0.999 ? '1' : a}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        alpha (cusp exponent, 0..1)
      </text>
      <text x={12} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90 12 ${padT + cH / 2})`}>
        endpoint distance d_k (degrees)
      </text>

      {[1, 2, 3, 4].map((k, idx) => (
        <text key={`lbl-${k}`} x={padL + 6} y={padT + 12 + idx * 14} fill={K_COLORS[k]} fontSize={9.5}>
          k={k}: d_k(alpha) = {k}pi/(1+alpha) - pi/2, onset alpha={2 * k - 1}
        </text>
      ))}
    </svg>
  );
}

export default function Imp34259UnifiedEndpointDistanceFamilyViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Unified Endpoint-Distance Family d_k(alpha), k=1..4 (imp-34173 / imp-34259)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34173 derived a single k-indexed closed form for the outer phase-zero branch endpoint
        distance of the imp-33924 joint amplitude -A(alpha, theta):
        {' '}
        d_k(alpha) = |k| pi/(1 + alpha) &minus; pi/2, subsuming the separately measured
        imp-34103 (k=1), imp-34104 (k=2) and imp-34167 (k=3) families under one law. This viz plots
        the family for k = 1, 2, 3, 4 directly (k=4 is a new instance of the closed form, not
        separately measured elsewhere) and tabulates the onset ladder alpha_k = 2k &minus; 1
        (1, 3, 5, 7) together with the closed-form onset slope &minus;pi/(4k) and onset curvature
        pi/(4k&sup2;). The sibling <Link to="/viz-imp34238-seven-crossings-onset-ladder" style={{ color: 'var(--series-1)' }}>imp-34238</Link> viz
        plots the raw branch angles theta_n for n = 0..3; this page plots the endpoint distance
        d_k itself and extends the ladder one rung further to k=4.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        endpoint distance d_k(alpha) vs alpha -- k = 1, 2, 3, 4
      </p>
      <DistanceFamilyChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        d_k(alpha) table (degrees), rising toward each family's own onset
      </p>
      <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.76rem', color: 'var(--ink-soft)', width: '100%' }}>
          <thead>
            <tr style={{ color: 'var(--ink-faint)', textAlign: 'right' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>alpha</th>
              <th style={{ padding: '4px 8px' }}>d_1</th>
              <th style={{ padding: '4px 8px' }}>d_2</th>
              <th style={{ padding: '4px 8px' }}>d_3</th>
              <th style={{ padding: '4px 8px' }}>d_4</th>
            </tr>
          </thead>
          <tbody>
            {IMP34259_TABLE_ROWS.map((r) => (
              <tr key={r.alpha} style={{ borderTop: '1px solid var(--rule-soft)', textAlign: 'right' }}>
                <td style={{ textAlign: 'left', padding: '4px 8px' }}>{r.alpha}</td>
                <td style={{ padding: '4px 8px' }}>{r.d1Deg.toFixed(4)}</td>
                <td style={{ padding: '4px 8px' }}>{r.d2Deg.toFixed(4)}</td>
                <td style={{ padding: '4px 8px' }}>{r.d3Deg.toFixed(4)}</td>
                <td style={{ padding: '4px 8px' }}>{r.d4Deg.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        onset ladder alpha_k = 2k - 1, onset slope -pi/(4k), onset curvature pi/(4k^2)
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.76rem', color: 'var(--ink-soft)', width: '100%' }}>
          <thead>
            <tr style={{ color: 'var(--ink-faint)', textAlign: 'right' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>k</th>
              <th style={{ padding: '4px 8px' }}>onset alpha_k</th>
              <th style={{ padding: '4px 8px' }}>onset slope</th>
              <th style={{ padding: '4px 8px' }}>onset curvature</th>
            </tr>
          </thead>
          <tbody>
            {IMP34259_ONSET_LADDER.map((r) => (
              <tr key={r.k} style={{ borderTop: '1px solid var(--rule-soft)', textAlign: 'right' }}>
                <td style={{ textAlign: 'left', padding: '4px 8px' }}>{r.k}</td>
                <td style={{ padding: '4px 8px' }}>{r.onsetAlpha}</td>
                <td style={{ padding: '4px 8px' }}>{r.onsetSlope.toFixed(6)}</td>
                <td style={{ padding: '4px 8px' }}>{r.onsetCurvature.toFixed(6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation/re-expression
        only, on the model cusp rho(x) = |x|^-alpha. k=1..3 recover the imp-34103/imp-34104/imp-34167
        per-family measurements; k=4 is a new instance of the imp-34173 closed form, not separately
        measured elsewhere. Does not re-derive the m_prime &rarr; C_ren map off-axis/off-exponent.
        H4 (imp-33766) is NOT discharged; G6a_shock_lipschitz stays OPEN; C_mb GUE-conditional per
        imp-486 UNTOUCHED; imp-3066 off-diagonal endpoint-Hankel K_a&gt;=0 UNTOUCHED; NO QED.
      </div>
    </div>
  );
}
