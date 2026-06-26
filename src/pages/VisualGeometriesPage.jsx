import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath } from '../components/KaTeXMath.jsx';
import VizCeilingNote from '../components/VizCeilingNote.jsx';

/*
 * Visual Geometries of zeta(s) — the master gallery.
 *
 * One field, many views: the log-phase theta = t log n of zeta. Primes generate
 * it; folding mod 2pi makes caustics, crystals and spirals; zeros are the phase
 * vortices of V_t = H_t'/H_t. This page ties the project's visualization panels
 * into the single poster they came from. HONEST framing: these are exact,
 * exploratory visualizations of real structure -- per the route map the
 * twin-ladder geometry is a DEAD END as a rigorous Lambda route, so this is
 * pedagogy + exploration, not a proof path. No false QED.
 */

const PANELS = [
  { n: 1, title: 'Log-Phase Interference Spiral', tex: 'r=\\log n,\\ \\theta=t\\log n', to: '/viz-log-phase-spiral',
    blurb: 'Integers in polar log-phase coords; primes form spiral rays and interference filaments.', color: '#a855f7' },
  { n: 2, title: 'Prime Caustic Geometry', tex: '\\theta=t\\log p\\ (\\mathrm{mod}\\ 2\\pi)', to: '/viz-prime-caustic',
    blurb: 'Bright caustic bands where many primes align: log(p_i/p_j) ≈ 2πk/t — multiplicative resonances.', color: '#f59e0b' },
  { n: 13, title: 'Prime Density on Caustics', tex: 'k/N\\ \\text{vs}\\ t', to: '/viz-prime-density-caustic',
    blurb: 'Which primes (by index) contribute to the caustic at each height t — density overlay vs PNT baseline.', color: '#fb923c' },
  { n: 3, title: 'Prime Phase Crystal', tex: 'C_t(n)=e^{-it\\log n}', to: '/viz-prime-phase-crystal',
    blurb: 'Contours of constant complex phase; a multiplicative diffraction lattice with Δn ≈ (2π/t)n.', color: '#22c55e' },
  { n: 4, title: 'Hyperbolic Prime Spiral', tex: '\\text{Poincaré disk}', to: '/viz-hyperbolic-prime-spiral',
    blurb: 'Multiplication becomes geodesic translation; primes lie on special geodesic networks.', color: '#3b82f6' },
  { n: 6, title: 'Vortex / Defect Map', tex: 'V_t=H_t^{\\prime}/H_t', to: '/vortex-field',
    blurb: 'Zeros as phase vortices (winding ±1); vortex exclusion from off-axis ⟺ RH.', color: '#ec4899',
    ceiling: 'Vortex exclusion re-derives Λ ≥ 0 (Rodgers–Tao) and makes RH visible — NOT a new rigorous bound; does not beat Platt–Trudgian Λ ≤ 0.2.' },
  { n: 7, title: 'Near a Zeta Zero', tex: '\\rho=\\tfrac12+i\\gamma', to: '/viz-near-zero',
    blurb: 'Rings, nodal lines and vortex creation as the interference reorganizes near a zero.', color: '#06b6d4',
    ceiling: 'Exact, exploratory view of the vortex thread — re-derives Λ ≥ 0 only; not a rigorous bound and does not beat Platt–Trudgian Λ ≤ 0.2.' },
  { n: 8, title: 'Angular-Spacing Statistics', tex: '\\Delta_k=\\theta_{k+1}-\\theta_k', to: '/gue-comparison',
    blurb: 'GUE spacing of the zeros; the log-phase spacings show hidden rigidity vs random.', color: '#8b5cf6' },
  { n: 9, title: 'Twin-Ladder Tomography', tex: '\\prod_p(1-p^{-s})^{-1}', to: '/viz-twin-ladder-tomography',
    blurb: 'Slices through the dual ladders that enforce the functional equation ζ(s)=χ(s)ζ(1−s).', color: '#14b8a6' },
  { n: 11, title: 'True vs Perturbed (Rigidity)', tex: '\\theta_p\\to\\theta_p+\\varepsilon_p', to: '/prime-rigidity',
    blurb: 'Perturbing primes destroys the caustics — the structure is ARITHMETIC, not random.', color: '#ef4444' },
  { n: 5, title: 'Euler Transport Flow', tex: 'u_t+u\\,u_z=0', to: '/viz-euler-transport-flow',
    blurb: 'The Dyson–Burgers transport the Stieltjes field obeys under the Newman heat flow.', color: '#eab308' },
  { n: 14, title: 'True vs Perturbed Euler Product', tex: '\\log|\\Pi_p(1-p^{-s})^{-1}|', to: '/viz-euler-product',
    blurb: 'Partial Euler product on the critical line: true primes dip at zero heights; perturbed log p smears them.', color: '#60a5fa' },
  { n: 12, title: 'Supercritical Landscape', tex: '|\\zeta(\\sigma+it)|', to: '/supercritical',
    blurb: 'Zeta as a partition function; zeros as vapor bubbles in the |ζ| thermodynamic landscape.', color: '#f97316' },
];

export default function VisualGeometriesPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Visual Geometries of ζ(s)</h1>
        <p className="page-subtitle">
          One field, many views. Every panel below is a window onto the same
          object — the <strong>log-phase field</strong>{' '}
          <InlineMath tex={'\\theta = t\\,\\log n'} /> of ζ. Primes generate it;
          folding <InlineMath tex={'\\bmod\\ 2\\pi'} /> produces caustics, crystals
          and spirals; the zeros are the <strong>phase vortices</strong> of{' '}
          <InlineMath tex={'V_t = H_t^{\\prime}/H_t'} />. From the discrete (numbers) to
          the continuous (geometry), the twin ladder makes the invisible visible.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {PANELS.map((p) => (
          <Link key={`${p.n}-${p.to}`} to={p.to} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ height: '100%', borderLeft: `3px solid ${p.color}`, transition: 'transform 0.12s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <h3 style={{ margin: 0, color: p.color, fontSize: 15 }}>{p.title}</h3>
                <span style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono)' }}>#{p.n}</span>
              </div>
              <div style={{ margin: '8px 0', fontSize: 13 }}><InlineMath tex={p.tex} /></div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>{p.blurb}</p>
              {p.ceiling ? (
                <p style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.5, margin: '8px 0 0', paddingTop: 6, borderTop: '1px solid rgba(148,163,184,0.15)' }}>
                  <strong style={{ fontStyle: 'normal' }}>Honest ceiling:</strong> {p.ceiling}
                </p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>

      <div className="card" style={{ marginTop: 22, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ marginTop: 0 }}>What the geometries actually show — honestly</h3>
        <ul style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <li><strong>Caustics = multiplicative resonances.</strong> Bright bands form where <InlineMath tex={'\\log(p_i/p_j)\\approx 2\\pi k/t'} /> — the same oscillatory structure as the explicit formula's <InlineMath tex={'x^{\\rho}'} /> kernel.</li>
          <li><strong>Vortices = zeros.</strong> <InlineMath tex={'\\tfrac1{2\\pi}\\oint V_t\\cdot dz = \\pm 1'} /> is the argument principle; off-axis vortices would be off-axis zeros (RH false).</li>
          <li><strong>Rigidity is the real content.</strong> Real primes give coherent caustics; randomized primes wash them out — the structure is arithmetic, not random.</li>
          <VizCeilingNote claim="Λ ≥ 0 (vortex/winding thread)" ceiling="the twin-ladder geometry is a dead end as a rigorous Λ route" />
        </ul>
      </div>
    </div>
  );
}
