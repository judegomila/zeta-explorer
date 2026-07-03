import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import IMP3256_VHS_CROSSVAL from '../data/imp-3256-vhs-crossval.js';

const ROWS = IMP3256_VHS_CROSSVAL.rows;

const LOG_N_MIN = Math.log10(400);
const LOG_N_MAX = Math.log10(9000);
const LOG_GAP_MIN = Math.log10(3e-6);
const LOG_GAP_MAX = Math.log10(3e-3);

function CrossvalChart() {
  const svgW = 620;
  const padL = 64;
  const padR = 24;
  const padT = 24;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = 300;
  const svgH = padT + cH + padB;

  const xS = (N) => padL + ((Math.log10(N) - LOG_N_MIN) / (LOG_N_MAX - LOG_N_MIN)) * cW;
  const yS = (g) => padT + cH * (1 - (Math.log10(g) - LOG_GAP_MIN) / (LOG_GAP_MAX - LOG_GAP_MIN));

  const gapPath = ROWS
    .map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.relGap_matchedN).toFixed(1))
    .join(' ');

  const xTicks = [500, 1000, 2000, 4000, 8000];
  const yGridVals = [3e-6, 1e-5, 3e-5, 1e-4, 3e-4, 1e-3, 3e-3];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yGridVals.map((v) => {
        const y = yS(v);
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={padL + cW} y2={y} stroke="#1e293b" strokeWidth={0.7} />
            <text x={padL - 4} y={y + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
              {v.toExponential(0)}
            </text>
          </g>
        );
      })}

      {xTicks.map((N) => (
        <line key={N} x1={xS(N)} y1={padT} x2={xS(N)} y2={padT + cH} stroke="#1e293b" strokeWidth={0.6} />
      ))}

      <path d={gapPath} fill="none" stroke="#ef4444" strokeWidth={2.4} />

      {ROWS.map((r) => (
        <circle key={r.N} cx={xS(r.N)} cy={yS(r.relGap_matchedN)} r={4} fill="#ef4444" />
      ))}

      <text x={xS(500) + 8} y={yS(ROWS[0].relGap_matchedN) - 6} fill="#ef4444" fontSize={9}>
        1.71e-3 (N=500)
      </text>
      <text x={xS(8000) - 8} y={yS(ROWS[ROWS.length - 1].relGap_matchedN) + 16} textAnchor="end" fill="#ef4444" fontSize={9}>
        6.65e-6 (N=8000)
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {xTicks.map((N) => (
        <g key={N}>
          <line x1={xS(N)} y1={padT + cH} x2={xS(N)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(N)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9.5}>
            {N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        N (node count; log scale)
      </text>

      <text
        x={11}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,11,' + (padT + cH / 2) + ')'}
      >
        matched-N relative gap |HS(U=6)-HS(U=5)| / HS(U=5)
      </text>

      <g transform={'translate(' + (padL + 8) + ',' + (padT + 8) + ')'}>
        <rect x={0} y={0} width={252} height={34} fill="rgba(10,15,26,0.93)" rx={4} stroke="#334155" strokeWidth={0.8} />
        <line x1={8} y1={16} x2={24} y2={16} stroke="#ef4444" strokeWidth={2.4} />
        <text x={30} y={20} fill="#ef4444" fontSize={9.5}>
          matched-N gap, O(h) &rarr; 0 monotonically
        </text>
      </g>
    </svg>
  );
}

export default function Imp3256CrossvalPage() {
  const finest = IMP3256_VHS_CROSSVAL.finest;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Volterra-HS Cross-Validation: HS(U=5) vs HS(U=6) (imp-3256)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The section26-mupass verdict cites &Vert;V&Vert;<sub>HS</sub> = 1.90&times;10<sup>-4</sup> (window
        U=6) as an "independent match" with imp-1267&apos;s 1.8985&times;10<sup>-4</sup> (window U=5), ~0.08%
        apart. imp-3256 tabulated the per-N cross-validation behind that claim: at{' '}
        <strong style={{ color: '#60a5fa' }}>matched step size h</strong>, HS(U=5) and HS(U=6) are{' '}
        <strong style={{ color: '#60a5fa' }}>bit-identical</strong> at every resolution (&Phi; underflows
        to floating-point zero past u&sim;2, so the extra [5,6] window contributes nothing). At{' '}
        <strong style={{ color: '#ef4444' }}>matched node count N</strong>, the two differ only by an{' '}
        <strong style={{ color: '#ef4444' }}>O(h) quadrature artifact</strong> that shrinks monotonically
        from 1.71&times;10<sup>-3</sup> at N=500 to 6.65&times;10<sup>-6</sup> at N=8000, i.e. the gap vanishes
        under refinement rather than plateauing at a fixed offset.
      </p>

      <CrossvalChart />

      <div style={{
        marginTop: '1.25rem',
        background: 'rgba(10,15,26,0.8)', border: '1px solid #334155',
        borderRadius: 6, padding: '0.9rem', overflowX: 'auto',
      }}>
        <p style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
          CROSSVAL_ROWS: matched-h bit-identity vs matched-N O(h) gap
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr>
              {['N', 'h', 'HS(U=5)', 'HS(U=6), matched-N', 'HS(U=6), matched-h', 'matched-N relGap'].map((h) => (
                <th key={h} style={{
                  color: '#64748b', textAlign: 'right', paddingBottom: 4,
                  paddingRight: 10, fontWeight: 600,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.N}>
                <td style={{ color: '#94a3b8', textAlign: 'right', paddingRight: 10 }}>{r.N}</td>
                <td style={{ color: '#94a3b8', textAlign: 'right', paddingRight: 10 }}>{r.h5.toExponential(2)}</td>
                <td style={{ color: '#60a5fa', textAlign: 'right', paddingRight: 10 }}>{r.hs_U5.toExponential(6)}</td>
                <td style={{ color: '#64748b', textAlign: 'right', paddingRight: 10 }}>{r.hs_U6_matchedN.toExponential(6)}</td>
                <td style={{ color: '#10b981', textAlign: 'right', paddingRight: 10 }}>{r.hs_U6_matchedH.toExponential(6)}</td>
                <td style={{ color: '#ef4444', textAlign: 'right' }}>{r.relGap_matchedN.toExponential(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: '1rem', padding: '0.75rem 1rem',
        background: 'rgba(148,163,184,0.04)', borderLeft: '3px solid #334155',
        borderRadius: '0 4px 4px 0', fontSize: '0.8rem', color: '#64748b',
      }}>
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> Both windows converge together to
        ~{finest.hs_U5.toExponential(3)} (finest row) as h&rarr;0. imp-1267&apos;s frozen value at N=1000 is
        reproduced exactly, and both values round to the same 1.90&times;10<sup>-4</sup> headline at 3
        significant figures — the "~0.08% apart" gap is significant-figure rounding of{' '}
        <strong>one</strong> number, not two independently converged values. This is a same-object
        precision-rounding identity, not independent corroborating evidence. Numerical
        cross-validation only, RH-EQUIVALENT; the operator-positivity residual (imp-3066) is untouched.
        Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/section26-conditioning-artifact" style={{ color: '#7c3aed' }}>
          Section-26 Conditioning Artifact
        </Link>
        {', '}
        <Link to="/viz-volterra-norm-curve" style={{ color: '#7c3aed' }}>
          Volterra Operator Norm vs HS Bound (imp-1292)
        </Link>
        {', '}
        <Link to="/viz-imp3252-scaled-mu" style={{ color: '#7c3aed' }}>
          Shear-Gram Continuum Magnitude &amp; Symmetric-Spectrum Identity (imp-3252)
        </Link>
      </div>
    </div>
  );
}
