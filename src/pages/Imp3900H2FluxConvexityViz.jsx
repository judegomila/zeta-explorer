import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3900_ROWS,
  IMP3900_SCALE_SWEEP,
  IMP3900_TOTAL_SAMPLES,
  IMP3900_IDENTITY_MAX_RESID,
  IMP3900_VISC_SHRINK_FACTOR,
} from '../data/imp-3900-h2-flux-convexity-viz-data.js';

const KAPPA_COLOR = '#38bdf8';
const VISC_COLOR = '#facc15';

function KappaLadderChart() {
  const svgW = 680;
  const padL = 66;
  const padR = 24;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const xMin = 9;
  const xMax = 21;
  const yMin = 1.9;
  const yMax = 2.1;
  const xS = (g) => padL + ((g - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      <line x1={padL} y1={yS(2)} x2={padL + cW} y2={yS(2)} stroke="#334155" strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + cW - 4} y={yS(2) - 6} textAnchor="end" fill="#7dd3fc" fontSize={8.5}>
        kappa = 2 (uniformly convex, F&Prime;(m) = -2)
      </text>

      {[1.9, 1.95, 2.0, 2.05, 2.1].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.6} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      {IMP3900_ROWS.map((r) => (
        <circle key={r.logGamma} cx={xS(r.logGamma)} cy={yS(r.kappaMean)} r={4} fill={KAPPA_COLOR} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP3900_ROWS.map((r) => (
        <g key={'x' + r.logGamma}>
          <line x1={xS(r.logGamma)} y1={padT + cH} x2={xS(r.logGamma)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(r.logGamma)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            {r.logGamma.toFixed(1)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        log gamma (anchor 9.20 &rarr; crossover 20.86)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        kappa = (m_s - m_zz)/(m m_z)
      </text>
    </svg>
  );
}

function ViscosityShrinkChart() {
  const svgW = 680;
  const padL = 78;
  const padR = 24;
  const padT = 16;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const xVals = [2, 4, 8];
  const xMin = 1;
  const xMax = 9;
  const yMin = 3e-4;
  const yMax = 3e-1;
  const logYMin = Math.log10(yMin);
  const logYMax = Math.log10(yMax);
  const xS = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logYMin) / (logYMax - logYMin));

  const yTicks = [1e-3, 1e-2, 1e-1];

  const points = IMP3900_SCALE_SWEEP.map((r) => `${xS(r.yOverD)},${yS(r.viscFracMean)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      <polyline points={points} fill="none" stroke={VISC_COLOR} strokeWidth={1.6} />
      {IMP3900_SCALE_SWEEP.map((r) => (
        <circle key={r.yOverD} cx={xS(r.yOverD)} cy={yS(r.viscFracMean)} r={4} fill={VISC_COLOR} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {xVals.map((v) => (
        <g key={'x' + v}>
          <line x1={xS(v)} y1={padT + cH} x2={xS(v)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(v)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            {v}d
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill="#64748b" fontSize={10}>
        y_star / d (coarse-graining scale)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        viscosity fraction |m_zz| / |2 m m_z| (log scale)
      </text>
    </svg>
  );
}

export default function Imp3900H2FluxConvexityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="H2 Discrete-Flux Convexity Probe: kappa = 2 Everywhere, Viscosity Shrinks ~518x (imp-3872)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3872 probes the imp-3846 dependency-chain root H2 (uniformly convex flux of the free-Burgers
        hydrodynamic limit) along the imp-3642 attractive Calogero-Moser RK4 collision flow. The finite-N
        resolvent m(z, s) = &Sigma;_k 1/(z - x_k(s)) obeys the exact identity m_s = 2 m m_z + m_zz (max
        relative residual {IMP3900_IDENTITY_MAX_RESID.toExponential(2)} across {IMP3900_TOTAL_SAMPLES} sampled
        points), and the effective flux-gradient coefficient kappa = (m_s - m_zz)/(m m_z) is the
        single-signed constant 2 at every point sampled -- the discrete analog of a uniformly convex flux
        F(m) = -m<sup>2</sup>. The only correction, the m_zz viscosity term, shrinks {IMP3900_VISC_SHRINK_FACTOR.toFixed(0)}x
        as the coarse-graining scale widens from y_star/d = 2 to 8.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        kappa = (m_s - m_zz)/(m m_z), mean over 65 samples per height -- flat at 2 across the full anchor-to-crossover ladder
      </p>
      <KappaLadderChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        viscosity fraction |m_zz| / |2 m m_z| vs coarse-graining scale y_star/d -- the ~518x drop over the clean window [2d, 8d]
      </p>
      <ViscosityShrinkChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the top chart plots the mean kappa
        at each of the five imp-3642 anchor-to-crossover heights (log gamma = 9.20 .. 20.86); every marker
        sits exactly on the kappa = 2 line, with zero spread across all 325 sampled (height, time, z)
        points -- no sign changes anywhere along the RK4 flow. The bottom chart shows the finite-N
        viscosity fraction falling from 0.2266 (y_star/d = 2) to 4.37e-4 (y_star/d = 8) on a log axis, the
        m_zz curvature term becoming negligible relative to the inviscid 2 m m_z transport term as the
        coarse-graining scale widens.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> this is an empirical PROBE of H2, NOT
        its certificate -- it does not prove the mean-field/hydrodynamic limit of this attractive flow
        exists, and it reads m on the mesoscopic strip y_star = 4d rather than the microscopic y &rarr; 0
        continuum. H2 stays UNWRITTEN as a certificate, the G6a K4 caustic-regularity route stays WHOLLY
        NEW, and G6a_shock_lipschitz stays OPEN. Scoping/measurement only; no positivity, no bridge closure,
        no RH claim; imp-3066 K_a &ge; 0 positivity untouched; Platt-Trudgian &Lambda; &le; 0.2 remains the
        rigorous SOTA. NO QED.
      </div>
    </div>
  );
}
