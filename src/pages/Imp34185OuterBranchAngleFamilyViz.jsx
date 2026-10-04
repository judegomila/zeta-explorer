import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34185_FAMILY_META,
  IMP34185_CURVE,
  IMP34185_TABLE_ROWS,
} from '../data/imp-34185-outer-branch-angle-family-viz-data.js';
import { ED, alpha as TK_ALPHA } from '../styles/tokens.js';

// theta_k(alpha) for k = 0, 1, 2 plotted together: the fixed central zero (k=0), the
// endpoint-collapsing family (k=1), and the persistently-outside family (k=2).
function BranchFamilyChart() {
  const svgW = 680;
  const svgH = 400;
  const padL = 48;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMin = -110;
  const yMax = 290;
  const xAt = (alpha) => padL + (alpha / 1) * cW;
  const yAt = (deg) => padT + cH - ((deg - yMin) / (yMax - yMin)) * cH;

  const path = (key) =>
    IMP34185_CURVE.map((c, i) => `${i === 0 ? 'M' : 'L'}${xAt(c.alpha).toFixed(2)},${yAt(c[key]).toFixed(2)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={yAt(180)} width={cW} height={yAt(0) - yAt(180)} fill={TK_ALPHA(ED.series1, 0.05)} />
      {[0, 180].map((deg) => (
        <line key={`bnd-${deg}`} x1={padL} y1={yAt(deg)} x2={padL + cW} y2={yAt(deg)} stroke={ED.series1} strokeWidth={1} strokeDasharray="4,3" />
      ))}
      <text x={padL + cW - 4} y={yAt(180) - 4} textAnchor="end" fill={ED.series1} fontSize={9}>
        interval boundary (0 / 180deg)
      </text>

      {/* k=0: fixed central zero, theta = pi/2 for every alpha */}
      <line x1={padL} y1={yAt(90)} x2={padL + cW} y2={yAt(90)} stroke={ED.series1} strokeWidth={2} />

      {/* k=1: endpoint-collapsing family (i), pi/2 -+ pi/p */}
      <path d={path('k1LowerDeg')} fill="none" stroke={ED.series7} strokeWidth={2} />
      <path d={path('k1UpperDeg')} fill="none" stroke={ED.series7} strokeWidth={2} />

      {/* k=2: persistent-gap family (ii), pi/2 -+ 2pi/p */}
      <path d={path('k2LowerDeg')} fill="none" stroke={ED.brassDeco} strokeWidth={2} strokeDasharray="6,3" />
      <path d={path('k2UpperDeg')} fill="none" stroke={ED.brassDeco} strokeWidth={2} strokeDasharray="6,3" />

      {[0, 0.25, 0.5, 0.75, 0.999].map((a) => (
        <text key={`xt-${a}`} x={xAt(a)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {a === 0.999 ? '1' : a}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        alpha (cusp exponent, 0..1)
      </text>
      <text x={12} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90 12 ${padT + cH / 2})`}>
        branch angle theta_k (degrees)
      </text>

      <text x={padL + 6} y={padT + 12} fill={ED.series1} fontSize={9.5}>
        k=0: theta = pi/2 (imp-33970 unique central zero, every alpha)
      </text>
      <text x={padL + 6} y={padT + 26} fill={ED.series7} fontSize={9.5}>
        k=1: pi/2 -+ pi/p (imp-34045, collapses onto endpoints at alpha=1)
      </text>
      <text x={padL + 6} y={padT + 40} fill={ED.brass} fontSize={9.5}>
        k=2: pi/2 -+ 2pi/p (imp-34104, collapses onto endpoints at alpha=3)
      </text>
    </svg>
  );
}

export default function Imp34185OuterBranchAngleFamilyViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Unified Outer-Branch Angle Family theta_k = pi/2 -+ k pi/p (imp-34104 / imp-34105 / imp-34185)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34045 and imp-34104 characterised two flanking phase-zero branch families of the
        imp-33924 closed form -A(alpha, theta) as separate measurements. Both are special cases of
        one law theta_k(alpha) = pi/2 &plusmn; k pi/p (p = 1 + alpha): k=0 is the imp-33970 unique
        central zero (fixed at pi/2 for every alpha); k=1 is the real-negative family that collapses
        onto the interval endpoints as alpha &rarr; 1; k=2 is the real-positive family that stays
        pi/2 outside the interval even at alpha = 1 and only reaches the endpoints at alpha = 3. The
        shared endpoint-distance law dk(alpha) = k pi/p &minus; pi/2 touches 0 exactly at alpha =
        2k &minus; 1, reproducing both onsets as k=1,2 of a single ladder. imp-34105 independently
        cross-validated the k=1,2 angles by bisection (worst discrepancy &sim;9e-16), so the chart
        and table below carry that cross-validation.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        branch angle theta_k vs alpha -- all three families together
      </p>
      <BranchFamilyChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        per-family endpoint-onset ladder
      </p>
      <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.76rem', color: 'var(--ink-soft)', width: '100%' }}>
          <thead>
            <tr style={{ color: 'var(--ink-faint)', textAlign: 'right' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>family</th>
              <th style={{ padding: '4px 8px' }}>arg(-A) mod 2pi</th>
              <th style={{ padding: '4px 8px' }}>collapse alpha = 2k-1</th>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>inside (0,pi)?</th>
            </tr>
          </thead>
          <tbody>
            {IMP34185_FAMILY_META.map((f) => (
              <tr key={f.k} style={{ borderTop: '1px solid var(--rule-soft)', textAlign: 'right' }}>
                <td style={{ textAlign: 'left', padding: '4px 8px' }}>{f.label}</td>
                <td style={{ padding: '4px 8px' }}>{(f.argMinusAMod2Pi / Math.PI).toFixed(0)}pi</td>
                <td style={{ padding: '4px 8px' }}>{f.collapseAlpha === null ? 'n/a' : f.collapseAlpha}</td>
                <td style={{ textAlign: 'left', padding: '4px 8px' }}>{f.everInsideOpenInterval}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        per-alpha table (rising toward alpha = 1)
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.76rem', color: 'var(--ink-soft)', width: '100%' }}>
          <thead>
            <tr style={{ color: 'var(--ink-faint)', textAlign: 'right' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>alpha</th>
              <th style={{ padding: '4px 8px' }}>k=1 lower/upper (deg)</th>
              <th style={{ padding: '4px 8px' }}>k=1 dist (deg)</th>
              <th style={{ padding: '4px 8px' }}>k=2 lower/upper (deg)</th>
              <th style={{ padding: '4px 8px' }}>k=2 dist (deg)</th>
            </tr>
          </thead>
          <tbody>
            {IMP34185_TABLE_ROWS.map((r) => (
              <tr key={r.alpha} style={{ borderTop: '1px solid var(--rule-soft)', textAlign: 'right' }}>
                <td style={{ textAlign: 'left', padding: '4px 8px' }}>{r.alpha}</td>
                <td style={{ padding: '4px 8px' }}>
                  {r.k1LowerDeg.toFixed(3)} / {r.k1UpperDeg.toFixed(3)}
                </td>
                <td style={{ padding: '4px 8px' }}>{r.k1DistDeg.toFixed(4)}</td>
                <td style={{ padding: '4px 8px' }}>
                  {r.k2LowerDeg.toFixed(3)} / {r.k2UpperDeg.toFixed(3)}
                </td>
                <td style={{ padding: '4px 8px' }}>{r.k2DistDeg.toFixed(4)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>See also:</strong>{' '}
        <Link to="/viz-imp34119-phase-zero-branch-geometry" style={{ color: 'var(--series-1)' }}>
          imp-34119 (the k=1,2 pair plotted from the imp-34045 source module directly)
        </Link>
        .
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation/re-expression only,
        on the model cusp rho(x) = |x|^-alpha. Unifies the imp-34045/imp-34104 closed forms into one
        law; does not re-derive the m_prime &rarr; C_ren map off-axis/off-exponent. H4 (imp-33766) is
        NOT discharged; G6a_shock_lipschitz stays OPEN; C_mb GUE-conditional per imp-486 UNTOUCHED;
        imp-3066 off-diagonal endpoint-Hankel K_a&gt;=0 UNTOUCHED; NO QED.
      </div>
    </div>
  );
}
