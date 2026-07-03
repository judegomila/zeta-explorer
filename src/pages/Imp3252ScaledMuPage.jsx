import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import IMP3252_SHEAR_GRAM_MINEIG_SYMMETRIC_SPECTRUM_N_SCALING from '../data/imp-3252-shear-gram-mineig-symmetric-spectrum-n-scaling.js';

const RUNGS = IMP3252_SHEAR_GRAM_MINEIG_SYMMETRIC_SPECTRUM_N_SCALING.measured.rungs;
const CONTINUUM_LIMIT = IMP3252_SHEAR_GRAM_MINEIG_SYMMETRIC_SPECTRUM_N_SCALING.measured.scaledContinuumLimit;

const N_MIN = 160;
const N_MAX = 800;

function ScaledMuChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const yMin = 1.78e-4;
  const yMax = 1.92e-4;

  const xS = (N) => padL + ((N - N_MIN) / (N_MAX - N_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const path = RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.scaledMu).toFixed(1)).join(' ');
  const limitY = yS(CONTINUUM_LIMIT);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[1.8e-4, 1.84e-4, 1.88e-4, 1.92e-4].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(2)}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={limitY}
        x2={padL + cW}
        y2={limitY}
        stroke="#7c3aed"
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={padL + cW - 4} y={limitY - 5} textAnchor="end" fill="#7c3aed" fontSize={9}>
        Richardson limit ~{CONTINUUM_LIMIT.toExponential(3)}
      </text>

      <path d={path} fill="none" stroke="#10b981" strokeWidth={2.4} />
      {RUNGS.map((r) => (
        <circle key={r.N} cx={xS(r.N)} cy={yS(r.scaledMu)} r={4} fill="#10b981" />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {RUNGS.map((r) => (
        <g key={r.N}>
          <line x1={xS(r.N)} y1={padT + cH} x2={xS(r.N)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(r.N)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9.5}>
            {r.N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        N (grid resolution)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        H&middot;mu(N) = (U/N)&middot;mu
      </text>
    </svg>
  );
}

function RatioDevChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 160;
  const svgH = padT + cH + padB;

  const logMin = Math.log10(1e-16);
  const logMax = Math.log10(3e-15);

  const xS = (N) => padL + ((N - N_MIN) / (N_MAX - N_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logMin) / (logMax - logMin));

  const path = RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.ratioMinEigDev).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[1e-16, 3e-16, 1e-15, 3e-15].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(2e-15)} x2={padL + cW} y2={yS(2e-15)} stroke="#ef4444" strokeWidth={1} strokeDasharray="4 3" />
      <text x={padL + 4} y={yS(2e-15) - 5} fill="#ef4444" fontSize={9}>
        ~2e-15 verdict-cited ceiling
      </text>

      <path d={path} fill="none" stroke="#60a5fa" strokeWidth={2.4} />
      {RUNGS.map((r) => (
        <circle key={r.N} cx={xS(r.N)} cy={yS(r.ratioMinEigDev)} r={4} fill="#60a5fa" />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {RUNGS.map((r) => (
        <g key={r.N}>
          <line x1={xS(r.N)} y1={padT + cH} x2={xS(r.N)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(r.N)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9.5}>
            {r.N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        N (grid resolution)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        |min eig / (-&Vert;Gshear&Vert;) - 1| (log scale)
      </text>
    </svg>
  );
}

export default function Imp3252ScaledMuPage() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Shear-Gram Continuum Magnitude &amp; Symmetric-Spectrum Identity (imp-3252)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3252 checks the section26-mupass verdict's shear-Gram Wronskian Gshear(u,v) =
        &Phi;(u)&Phi;(v)&middot;sinh(a(v-u)) across the imp-3215 resolution ladder N &isin;{' '}
        {'{160, 240, 320, 480, 640, 800}'} at the genuine de Bruijn-Newman &Phi; cell (a = 0.5, U = 6).
        The <strong style={{ color: '#10b981' }}>quadrature-scaled continuum magnitude</strong> H&middot;mu(N)
        converges monotonically from {RUNGS[0].scaledMu.toExponential(3)} at N=160 to{' '}
        {RUNGS[RUNGS.length - 1].scaledMu.toExponential(3)} at N=800, toward a finite Richardson limit
        of ~{CONTINUUM_LIMIT.toExponential(3)}. Independently, the{' '}
        <strong style={{ color: '#60a5fa' }}>symmetric-spectrum identity</strong> min eig(Gshear) =
        -&Vert;Gshear&Vert; holds to within {Math.max(...RUNGS.map((r) => r.ratioMinEigDev)).toExponential(1)}{' '}
        at every rung — an exact structural consequence of the hollow rank-2 antisymmetry, not a
        resolution-dependent convergence.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Convergence of the continuum-scaled magnitude H&middot;mu(N)
      </p>
      <ScaledMuChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Symmetric-spectrum deviation |min eig / (-&Vert;Gshear&Vert;) - 1|
      </p>
      <RatioDevChart />

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> assessment only — no proof, no
        reduction below RH. The two curves measure different things: the top panel is a genuine
        finite-N-resolution convergence (the continuum operator norm), while the bottom panel is a
        floating-point residual around an identity that holds exactly at every N by construction (the
        hollow rank-2 antisymmetry forces min eig = -mu = -&Vert;Gshear&Vert;). The binding
        RH-equivalent K_a &ge; 0 sign-positivity residual (imp-3066) is untouched. Platt-Trudgian
        &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/section26-conditioning-artifact" style={{ color: '#7c3aed' }}>
          Section-26 Conditioning Artifact
        </Link>
        {', '}
        <Link to="/viz-imp3256-vhs-crossval" style={{ color: '#7c3aed' }}>
          Volterra-HS Cross-Validation (imp-3256)
        </Link>
      </div>
    </div>
  );
}
