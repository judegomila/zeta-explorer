import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP3084_OFFDIAGONAL_GAP_DEGREE_SWEEP } from '../data/imp-3084-offdiagonal-gap-degree-sweep.js';
import { IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP } from '../data/imp-3104-orthogonalized-opnorm-degree-sweep.js';

const rawSweep = IMP3084_OFFDIAGONAL_GAP_DEGREE_SWEEP.measured.sweep;
const orthSweep = IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP.measured.sweep;
const TANH_CEILING = IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP.measured.analyticCeilingTanhAU;

function ConditioningArtifactChart() {
  const svgW = 560;
  const padL = 50;
  const padR = 18;
  const cW = svgW - padL - padR;

  const DEG_LO = 2;
  const DEG_HI = 12;
  const xScale = (deg) => padL + ((deg - DEG_LO) / (DEG_HI - DEG_LO)) * cW;

  // Top panel: raw ||R|| (DIVERGES)
  const p1Top = 20;
  const p1H = 140;
  const yMaxRaw = 12;
  const rawY = (v) => p1Top + p1H * (1 - v / yMaxRaw);

  // Bottom panel: orthogonalized ||R_orth|| (CONVERGES)
  const panelGap = 34;
  const p2Top = p1Top + p1H + panelGap;
  const p2H = 120;
  const yMinOrth = 0.96;
  const yMaxOrth = 1.02;
  const orthY = (v) =>
    p2Top + p2H * (1 - (v - yMinOrth) / (yMaxOrth - yMinOrth));

  const svgH = p2Top + p2H + 30;

  const validOrth = orthSweep.filter((r) => r.orthogonalizerTrustworthy);
  const invalidOrth = orthSweep.filter((r) => !r.orthogonalizerTrustworthy);

  const rawPath = rawSweep
    .map((r, i) => `${i === 0 ? 'M' : 'L'}${xScale(r.degree).toFixed(1)},${rawY(r.operatorNorm).toFixed(1)}`)
    .join(' ');

  const orthPath = validOrth
    .map((r, i) => `${i === 0 ? 'M' : 'L'}${xScale(r.degree).toFixed(1)},${orthY(r.operatorNormGS).toFixed(1)}`)
    .join(' ');

  const ceilY = orthY(TANH_CEILING);
  const degs = Array.from({ length: DEG_HI - DEG_LO + 1 }, (_, i) => i + DEG_LO);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* panel backgrounds */}
      <rect x={padL} y={p1Top} width={cW} height={p1H} fill="rgba(239,68,68,0.04)" rx={2} />
      <rect x={padL} y={p2Top} width={cW} height={p2H} fill="rgba(16,185,129,0.04)" rx={2} />

      {/* panel labels */}
      <text x={padL + 7} y={p1Top + 15} fill="#ef4444" fontSize={11} fontWeight="700">
        RAW monomial basis: &nbsp;&parallel;R&parallel; DIVERGES
      </text>
      <text x={padL + 7} y={p2Top + 15} fill="#10b981" fontSize={11} fontWeight="700">
        Basis-invariant &parallel;R_orth&parallel; CONVERGES to tanh(aU)
      </text>

      {/* shared vertical gridlines */}
      {degs.map((deg) => (
        <line key={deg} x1={xScale(deg)} y1={p1Top} x2={xScale(deg)} y2={p2Top + p2H}
          stroke="#1e293b" strokeWidth={1} />
      ))}

      {/* raw y-axis gridlines and labels */}
      {[0, 2, 4, 6, 8, 10, 12].map((v) => {
        const y = rawY(v);
        if (y < p1Top - 1 || y > p1Top + p1H + 1) return null;
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={padL + cW} y2={y} stroke="#1e293b" strokeWidth={1} />
            <text x={padL - 5} y={y + 3.5} textAnchor="end" fill="#64748b" fontSize={10}>{v}</text>
          </g>
        );
      })}

      {/* orth y-axis gridlines and labels */}
      {[0.96, 0.97, 0.98, 0.99, 1.00].map((v) => {
        const y = orthY(v);
        if (y < p2Top - 1 || y > p2Top + p2H + 1) return null;
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={padL + cW} y2={y} stroke="#1e293b" strokeWidth={1} />
            <text x={padL - 5} y={y + 3.5} textAnchor="end" fill="#64748b" fontSize={10}>{v.toFixed(2)}</text>
          </g>
        );
      })}

      {/* analytic ceiling tanh(aU) */}
      <line x1={padL} y1={ceilY} x2={padL + cW} y2={ceilY}
        stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="5 3" />
      <text x={padL + cW - 4} y={ceilY - 4} textAnchor="end" fill="#06b6d4" fontSize={9.5}>
        tanh(aU)={TANH_CEILING.toFixed(5)}
      </text>

      {/* raw diverging path and dots */}
      <path d={rawPath} fill="none" stroke="#ef4444" strokeWidth={2.5} />
      {rawSweep.map((r) => (
        <circle key={r.degree} cx={xScale(r.degree)} cy={rawY(r.operatorNorm)} r={3.5} fill="#ef4444" />
      ))}
      {/* raw value labels at start and end */}
      <text x={xScale(2) + 5} y={rawY(rawSweep[0].operatorNorm) - 5} fill="#ef4444" fontSize={9.5}>
        {rawSweep[0].operatorNorm.toFixed(2)}
      </text>
      <text x={xScale(12) - 4} y={rawY(rawSweep[rawSweep.length - 1].operatorNorm) - 5} textAnchor="end" fill="#ef4444" fontSize={9.5}>
        {rawSweep[rawSweep.length - 1].operatorNorm.toFixed(2)}
      </text>

      {/* orthogonalized converging path and dots (valid) */}
      <path d={orthPath} fill="none" stroke="#10b981" strokeWidth={2.5} />
      {validOrth.map((r) => (
        <circle key={r.degree} cx={xScale(r.degree)} cy={orthY(r.operatorNormGS)} r={3.5} fill="#10b981" />
      ))}

      {/* ill-conditioned ghost dots */}
      {invalidOrth.map((r) => {
        const cy = Math.min(orthY(Math.max(r.operatorNormGS, yMinOrth)), p2Top + p2H);
        return (
          <g key={r.degree}>
            <circle cx={xScale(r.degree)} cy={cy} r={4} fill="none" stroke="#475569" strokeWidth={1.5} strokeDasharray="2 1.5" />
            <text x={xScale(r.degree)} y={p2Top + p2H - 4} textAnchor="middle" fill="#475569" fontSize={8.5}>
              ill-cond.
            </text>
          </g>
        );
      })}

      {/* orth value labels at start and end (valid range) */}
      {validOrth.length > 0 && (
        <>
          <text x={xScale(validOrth[0].degree) + 5} y={orthY(validOrth[0].operatorNormGS) - 5} fill="#10b981" fontSize={9.5}>
            {validOrth[0].operatorNormGS.toFixed(5)}
          </text>
          <text x={xScale(validOrth[validOrth.length - 1].degree) - 4}
            y={orthY(validOrth[validOrth.length - 1].operatorNormGS) - 5} textAnchor="end" fill="#10b981" fontSize={9.5}>
            {validOrth[validOrth.length - 1].operatorNormGS.toFixed(5)}
          </text>
        </>
      )}

      {/* x-axis tick labels */}
      {degs.map((deg) => (
        <text key={deg} x={xScale(deg)} y={p2Top + p2H + 14} textAnchor="middle" fill="#94a3b8" fontSize={10}>
          {deg}
        </text>
      ))}
      <text x={padL + cW / 2} y={p2Top + p2H + 27} textAnchor="middle" fill="#64748b" fontSize={10}>
        Truncation degree DEG
      </text>

      {/* panel borders */}
      <rect x={padL} y={p1Top} width={cW} height={p1H} fill="none" stroke="#334155" strokeWidth={1} />
      <rect x={padL} y={p2Top} width={cW} height={p2H} fill="none" stroke="#334155" strokeWidth={1} />
    </svg>
  );
}

export default function Section26ConditioningArtifactPage() {
  const rawFirst = rawSweep[0].operatorNorm.toFixed(2);
  const rawLast = rawSweep[rawSweep.length - 1].operatorNorm.toFixed(2);
  const orthFirstValid = IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP.measured.firstValidOperatorNorm.toFixed(5);
  const orthLastValid = IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP.measured.lastValidOperatorNorm.toFixed(5);
  const validRange = IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP.measured.validDegreeRange;

  return (
    <div className="page">
      <PageHeader title="Section-26 Conditioning Artifact">
        <p>
          The <strong style={{ color: '#ef4444' }}>raw monomial-basis &#x2016;R&#x2016;</strong> DIVERGES
          from ~{rawFirst} at DEG=2 to ~{rawLast} at DEG=12 (imp-3084). The{' '}
          <strong style={{ color: '#10b981' }}>basis-invariant &#x2016;R_orth&#x2016;</strong> CONVERGES
          monotonically toward the analytic ceiling tanh(aU) = tanh(3) from below (imp-3104).
          The raw divergence is entirely a basis-conditioning artifact.
        </p>
      </PageHeader>

      <div className="card" style={{ marginTop: 20, borderLeft: '3px solid #8b5cf6' }}>
        <ConditioningArtifactChart />
        <p style={{ fontSize: 11, color: '#64748b', marginTop: 12 }}>
          a=0.5, U=6 (the section-26 headline cell). Top panel: raw de-homogenized
          &#x2016;R&#x2016; = Perron eigenvalue of R = G_pass^{'{-1/2}'} G_shear G_pass^{'{-1/2}'}
          (monomial diagonal only &mdash; ill-conditioned at high degree). Bottom panel:
          basis-invariant &#x2016;R_orth&#x2016; using the full passive Gram (two independent
          orthogonalizers agree to &lt;2e-5 on the trustworthy range DEG={validRange[0]}..{validRange[1]});
          hollow circles at DEG&#x2265;11 are ill-conditioned (orthogonalizers disagree).
        </p>
      </div>

      <div className="card" style={{ marginTop: 16, borderLeft: '3px solid #ef4444' }}>
        <h3 style={{ color: '#ef4444', fontSize: 15, marginBottom: 8 }}>Raw basis: unbounded growth (imp-3084)</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.75 }}>
          Rescaled monomials phi_j(tau) = (tau/U)^j become nearly collinear at high degree
          in the cosh inner product. The diagonal de-homogenization
          R_jk = H_jk / sqrt(D_jj D_kk) uses only the diagonal of the passive Gram,
          leaving off-diagonal Hankel cross-terms unsuppressed.
          Result: &#x2016;R&#x2016; grows monotonically from ~{rawFirst} at DEG=2 to ~{rawLast} at DEG=12
          with every consecutive increment positive &mdash; GROWS, not saturates.
        </p>
      </div>

      <div className="card" style={{ marginTop: 14, borderLeft: '3px solid #10b981' }}>
        <h3 style={{ color: '#10b981', fontSize: 15, marginBottom: 8 }}>Basis-invariant norm: bounded convergence (imp-3104)</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.75 }}>
          Orthogonalizing the FULL passive Gram P_jk = int cosh(a*tau) phi_j phi_k recovers
          the intrinsic operator norm: the largest Rayleigh quotient
          &#x2016;R_orth&#x2016; = max_f (int sinh(a*tau) f^2) / (int cosh(a*tau) f^2)
          is a cosh-weighted average of tanh(a*tau), so it is strictly bounded by tanh(aU) = tanh(3) at every degree.
          On the numerically trustworthy range DEG={validRange[0]}..{validRange[1]} it rises
          from {orthFirstValid} to {orthLastValid}, converging to the ceiling from below
          with all increments positive and ceiling-distance shrinking ~16x.
          DEG&#x2265;11 rows break down due to near-singular P &mdash; measuring finite-precision
          failure, not the operator.
        </p>
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 6, padding: '8px 12px', marginTop: 10 }}>
          <span style={{ color: '#6ee7b7', fontWeight: 700, fontSize: 11 }}>KEY RESULT:</span>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>
            {' '}The scalar-cosh-core ceiling is tanh(aU) = tanh(3) &#x2248; {TANH_CEILING.toFixed(5)} &lt; 1.
            The divergence of the raw norm is entirely a monomial-conditioning artifact.
            This is a scalar-core statement and does NOT close K_a&#x2265;G_shear (the
            indefinite shear-Gram operator step). PT Lambda&#x2264;0.2 remains SOTA.
          </span>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14, borderLeft: '3px solid #f59e0b' }}>
        <h3 style={{ color: '#f59e0b', fontSize: 15, marginBottom: 8 }}>Honest status: bounded, cell-localized deficit (imp-3303)</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.75 }}>
          The basis-invariant scalar-core gap is <strong style={{ color: '#fbbf24' }}>tanh(s)&minus;tanh(s/2)</strong>, s=aU.
          This gap <strong>vanishes in both limits</strong>: as s&#x2192;0 both tanh(s)&#x2192;0 and tanh(s/2)&#x2192;0,
          so the gap&#x2192;0; as s&#x2192;&#x221e; both approach 1, so the gap&#x2192;0 again.
          The gap peaks only near the golden-ratio cell (imp-3146 maximum &#x3c6;&#x207b;&#x2075;&#x2044;&#x00b2;).
          For the headline cell (s=3): tanh(3)&#x2212;tanh(1.5)&#x2248;{(Math.tanh(3) - Math.tanh(1.5)).toFixed(4)}.
        </p>
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 6, padding: '8px 12px', marginTop: 10 }}>
          <span style={{ color: '#fcd34d', fontWeight: 700, fontSize: 11 }}>CORRECTION:</span>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>
            {' '}The raw-basis divergence (&#x2016;R&#x2016; growing 1.79&#x2192;10.8) creates a false impression
            of a large, universal failure. The actual scalar-cosh-core deficit is a <em>bounded, cell-localized</em> quantity
            that vanishes at both the weakly-coupled and strongly-coupled limits and is worst
            only near the golden-ratio cell. It does NOT imply a diverging or universally large closure obstruction.
          </span>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12 }}>
          <Link to="/closure-routes" style={{ color: '#94a3b8' }}>Section-26 Closure Routes</Link>
          <Link to="/hidden-square-program" style={{ color: '#94a3b8' }}>Hidden-Square Program</Link>
          <Link to="/spectral-attack" style={{ color: '#94a3b8' }}>Spectral Attack</Link>
        </div>
      </div>
    </div>
  );
}
