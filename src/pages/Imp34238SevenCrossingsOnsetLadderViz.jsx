import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34238_FAMILY_META,
  IMP34238_CURVE,
  IMP34238_TABLE_ROWS,
  IMP34238_ONSET_LADDER,
} from '../data/imp-34238-seven-crossings-onset-ladder-viz-data.js';

// theta_n(alpha) for n = 0, 1, 2, 3 plotted together: the fixed central zero (n=0), and the three
// endpoint-onset families (i)/(ii)/(iii) whose branches touch 0/pi at alpha = 1, 3, 5 respectively.
function SevenCrossingsChart() {
  const svgW = 680;
  const svgH = 420;
  const padL = 48;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMin = -190;
  const yMax = 370;
  const xAt = (alpha) => padL + (alpha / 1) * cW;
  const yAt = (deg) => padT + cH - ((deg - yMin) / (yMax - yMin)) * cH;

  const path = (key) =>
    IMP34238_CURVE.map((c, i) => `${i === 0 ? 'M' : 'L'}${xAt(c.alpha).toFixed(2)},${yAt(c[key]).toFixed(2)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={yAt(180)} width={cW} height={yAt(0) - yAt(180)} fill="rgba(56,189,248,0.05)" />
      {[0, 180].map((deg) => (
        <line key={`bnd-${deg}`} x1={padL} y1={yAt(deg)} x2={padL + cW} y2={yAt(deg)} stroke="#0ea5e9" strokeWidth={1} strokeDasharray="4,3" />
      ))}
      <text x={padL + cW - 4} y={yAt(180) - 4} textAnchor="end" fill="#0ea5e9" fontSize={9}>
        interval boundary (0 / 180deg)
      </text>

      {/* n=0: fixed central zero, theta = pi/2 for every alpha */}
      <line x1={padL} y1={yAt(90)} x2={padL + cW} y2={yAt(90)} stroke="#38bdf8" strokeWidth={2} />

      {/* n=1: family (i), pi/2 -+ pi/p, onset alpha=1 */}
      <path d={path('n1LowerDeg')} fill="none" stroke="#f472b6" strokeWidth={2} />
      <path d={path('n1UpperDeg')} fill="none" stroke="#f472b6" strokeWidth={2} />

      {/* n=2: family (ii), pi/2 -+ 2pi/p, onset alpha=3 */}
      <path d={path('n2LowerDeg')} fill="none" stroke="#facc15" strokeWidth={2} strokeDasharray="6,3" />
      <path d={path('n2UpperDeg')} fill="none" stroke="#facc15" strokeWidth={2} strokeDasharray="6,3" />

      {/* n=3: family (iii), pi/2 -+ 3pi/p, onset alpha=5 (never reached inside (0,1)) */}
      <path d={path('n3LowerDeg')} fill="none" stroke="#a78bfa" strokeWidth={2} strokeDasharray="2,3" />
      <path d={path('n3UpperDeg')} fill="none" stroke="#a78bfa" strokeWidth={2} strokeDasharray="2,3" />

      {[0, 0.25, 0.5, 0.75, 0.999].map((a) => (
        <text key={`xt-${a}`} x={xAt(a)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {a === 0.999 ? '1' : a}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        alpha (cusp exponent, 0..1)
      </text>
      <text x={12} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90 12 ${padT + cH / 2})`}>
        branch angle theta_n (degrees)
      </text>

      <text x={padL + 6} y={padT + 12} fill="#38bdf8" fontSize={9.5}>
        n=0: theta = pi/2 (imp-33970 unique central zero, every alpha)
      </text>
      <text x={padL + 6} y={padT + 26} fill="#f472b6" fontSize={9.5}>
        n=1: pi/2 -+ pi/p, family (i), onset alpha=1 (imp-34045/imp-34103)
      </text>
      <text x={padL + 6} y={padT + 40} fill="#facc15" fontSize={9.5}>
        n=2: pi/2 -+ 2pi/p, family (ii), onset alpha=3 (imp-34104/imp-34166)
      </text>
      <text x={padL + 6} y={padT + 54} fill="#a78bfa" fontSize={9.5}>
        n=3: pi/2 -+ 3pi/p, family (iii), onset alpha=5 (imp-34167, off-chart at alpha&lt;1)
      </text>
    </svg>
  );
}

export default function Imp34238SevenCrossingsOnsetLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Seven Phase-Zero Crossings k in {-3..3} and the Onset Ladder alpha=1,3,5 (imp-34167 / imp-34173 / imp-34238)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-33924 joint amplitude -A(alpha, theta) has SEVEN phase-zero crossings k in
        {' '}
        {'{-3, -2, -1, 0, 1, 2, 3}'} on its widened scan window. k=0 is the imp-33970 unique
        central zero (fixed at theta = pi/2). The remaining six form three symmetric outer
        families theta_n(alpha) = pi/2 &plusmn; n pi/p (p = 1 + alpha, n = |k|): family (i) n=1
        (imp-34045/imp-34103, real-negative), family (ii) n=2 (imp-34104/imp-34166,
        real-positive), and family (iii) n=3 (imp-34167, real-negative, located by widening the
        imp-34105 root-find window). Each family's endpoint distance d_n(alpha) = n pi/p &minus;
        pi/2 vanishes exactly at the onset alpha = 2n &minus; 1, giving the ladder 1, 3, 5 for
        n = 1, 2, 3 (imp-34173 unified law). Only family (i) actually reaches the endpoints inside
        the valid cusp range alpha in (0, 1); families (ii) and (iii) onset at alpha = 3 and 5,
        both outside (0, 1), so their branches stay entirely outside [0, pi] on the whole range.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        branch angle theta_n vs alpha -- all four families (n=0,1,2,3) together
      </p>
      <SevenCrossingsChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        endpoint-onset ladder alpha_n = 2n - 1
      </p>
      <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.76rem', color: '#94a3b8', width: '100%' }}>
          <thead>
            <tr style={{ color: '#64748b', textAlign: 'right' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>family</th>
              <th style={{ padding: '4px 8px' }}>arg(-A) mod 2pi</th>
              <th style={{ padding: '4px 8px' }}>onset alpha = 2n-1</th>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>inside (0,pi)?</th>
            </tr>
          </thead>
          <tbody>
            {IMP34238_FAMILY_META.map((f) => (
              <tr key={f.n} style={{ borderTop: '1px solid #1e293b', textAlign: 'right' }}>
                <td style={{ textAlign: 'left', padding: '4px 8px' }}>{f.label}</td>
                <td style={{ padding: '4px 8px' }}>{(f.argMinusAMod2Pi / Math.PI).toFixed(0)}pi</td>
                <td style={{ padding: '4px 8px' }}>{f.onsetAlpha === null ? 'n/a' : f.onsetAlpha}</td>
                <td style={{ textAlign: 'left', padding: '4px 8px' }}>{f.everInsideOpenInterval}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        endpoint-distance ladder d_n(alpha) = n pi/p - pi/2 (degrees), rising toward alpha = 1
      </p>
      <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.76rem', color: '#94a3b8', width: '100%' }}>
          <thead>
            <tr style={{ color: '#64748b', textAlign: 'right' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>alpha</th>
              <th style={{ padding: '4px 8px' }}>d_1 (family i)</th>
              <th style={{ padding: '4px 8px' }}>d_2 (family ii)</th>
              <th style={{ padding: '4px 8px' }}>d_3 (family iii)</th>
            </tr>
          </thead>
          <tbody>
            {IMP34238_TABLE_ROWS.map((r) => (
              <tr key={r.alpha} style={{ borderTop: '1px solid #1e293b', textAlign: 'right' }}>
                <td style={{ textAlign: 'left', padding: '4px 8px' }}>{r.alpha}</td>
                <td style={{ padding: '4px 8px' }}>{r.n1DistDeg.toFixed(4)}</td>
                <td style={{ padding: '4px 8px' }}>{r.n2DistDeg.toFixed(4)}</td>
                <td style={{ padding: '4px 8px' }}>{r.n3DistDeg.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        onset slope d d_n/d alpha at alpha_n = 2n - 1
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.76rem', color: '#94a3b8', width: '100%' }}>
          <thead>
            <tr style={{ color: '#64748b', textAlign: 'right' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>n</th>
              <th style={{ padding: '4px 8px' }}>onset alpha</th>
              <th style={{ padding: '4px 8px' }}>slope -n pi/(2n)^2</th>
            </tr>
          </thead>
          <tbody>
            {IMP34238_ONSET_LADDER.map((r) => (
              <tr key={r.n} style={{ borderTop: '1px solid #1e293b', textAlign: 'right' }}>
                <td style={{ textAlign: 'left', padding: '4px 8px' }}>{r.n}</td>
                <td style={{ padding: '4px 8px' }}>{r.onsetAlpha}</td>
                <td style={{ padding: '4px 8px' }}>{r.endpointSlope.toFixed(6)}</td>
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
        <strong style={{ color: '#94a3b8' }}>See also:</strong>{' '}
        <Link to="/viz-imp34185-outer-branch-angle-family" style={{ color: '#38bdf8' }}>
          imp-34185 (the sibling viz covering only the k=0,1,2 families)
        </Link>
        .
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> presentation/re-expression
        only, on the model cusp rho(x) = |x|^-alpha. Adds the imp-34167 family (iii) branch to the
        imp-34185 chart and shows the full onset ladder alpha = 1, 3, 5; does not re-derive the
        m_prime &rarr; C_ren map off-axis/off-exponent. H4 (imp-33766) is NOT discharged;
        G6a_shock_lipschitz stays OPEN; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
        off-diagonal endpoint-Hankel K_a&gt;=0 UNTOUCHED; NO QED; Platt-Trudgian Lambda&lt;=0.2
        remains the rigorous SOTA.
      </div>
    </div>
  );
}
