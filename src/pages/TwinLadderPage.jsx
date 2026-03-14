import React from 'react';
import { Link } from 'react-router-dom';
import TwinLadderViz from '../components/TwinLadderViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function TwinLadderPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Twin Ladder Explorer</h1>
        <p>
          Each prime <InlineMath tex="p" /> generates a <strong>ladder</strong> of rungs{' '}
          <InlineMath tex="m = 0, 1, 2, \\ldots" /> with amplitude <InlineMath tex="p^{-m/2}" /> and
          oscillating phase <InlineMath tex="m \\cdot T \\cdot \\log p" />. By introducing thermodynamic
          weights controlled by inverse temperature <InlineMath tex="\\beta" /> and pressure{' '}
          <InlineMath tex="P" />, we can deform the ladder, freeze individual rungs via Gaussian proxies,
          and watch ground-state collapse as <InlineMath tex="\\beta \\to \\infty" />.
        </p>
      </div>

      <BlockMath tex="Z_{TL}\\bigl(\\tfrac{1}{2}+iT;\\,\\beta,P\\bigr) = \\sum_p \\sum_{m=0}^{M} p^{-m/2}\\, e^{imT\\log p}\\, e^{-\\beta\\, m\\log p \\;-\\; P\\,\\psi(m\\log p)}" />

      <div style={{ marginTop: 8 }}>
        <BlockMath tex="\\psi(x) = x^2 \\quad\\text{(convex penalty)}, \\qquad \\Pi_{\\text{slack}} = (\\alpha - t - \\varepsilon)\\,U^2" />
      </div>

      <div style={{ marginTop: 32 }}>
        <TwinLadderViz />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6' }}>What to Explore in Each Tab</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <strong style={{ color: '#06b6d4' }}>Ladder Anatomy</strong> shows the raw phasor structure
          for a single prime: each rung is a vector in the complex plane, and the total is their sum.
          Watch how increasing <InlineMath tex="T" /> spins the phasors faster (higher rungs rotate more).
          <strong style={{ color: '#10b981' }}> Pressure & Temperature</strong> compares unweighted vs
          thermodynamically weighted rungs side-by-side, and plots{' '}
          <InlineMath tex="|Z_{TL}|" /> along the critical line as you change <InlineMath tex="\\beta" /> and{' '}
          <InlineMath tex="P" />.
          <strong style={{ color: '#f59e0b' }}> Ladder Freezing</strong> compares the exact rung sum
          to a smooth Gaussian proxy <InlineMath tex="\\Phi_{\\text{fr}}" /> and shows the slack index
          that measures approximation quality.
          <strong style={{ color: '#ef4444' }}> Ground-State Collapse</strong> animates how cranking{' '}
          <InlineMath tex="\\beta" /> kills every rung except <InlineMath tex="m = 0" />.
          <strong style={{ color: '#8b5cf6' }}> Phase Diagram</strong> renders a 2D heatmap of{' '}
          <InlineMath tex="|Z_{TL}|" /> over the <InlineMath tex="(\\beta, P)" /> plane.
        </p>
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#06b6d4' }}>Ladder Rungs & Phasors</h3>
          <BlockMath tex="\\text{Rung } m: \\quad a_m = p^{-m/2},\\quad \\phi_m = m\\,T\\,\\log p" />
          <p style={{ marginTop: 8 }}>
            Each rung of the ladder for prime <InlineMath tex="p" /> contributes a phasor{' '}
            <InlineMath tex="a_m e^{i\\phi_m}" /> to the complex plane. The amplitudes decay
            geometrically as <InlineMath tex="p^{-m/2}" />, while phases increase linearly with
            the rung index <InlineMath tex="m" />. The total ladder sum determines the prime's
            contribution to the deformed zeta function.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#10b981' }}>Thermodynamic Weights</h3>
          <BlockMath tex="w(p,m) = \\exp\\bigl(-\\beta\\,m\\log p \\;-\\; P\\cdot(m\\log p)^2\\bigr)" />
          <p style={{ marginTop: 8 }}>
            The weight combines two suppression mechanisms.{' '}
            <strong style={{ color: '#3b82f6' }}>Temperature</strong> (<InlineMath tex="\\beta" />)
            gives exponential decay in rung energy <InlineMath tex="m\\log p" />.{' '}
            <strong style={{ color: '#f59e0b' }}>Pressure</strong> (<InlineMath tex="P" />) adds a
            quadratic penalty that further suppresses high-energy rungs. Together they control
            which rungs contribute to the deformed <InlineMath tex="Z_{TL}" />.
          </p>
        </div>
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Gaussian Freezing & Slack</h3>
          <BlockMath tex="\\Phi_{\\text{fr}}(u) = e^{-\\alpha u^2}\\sum_{k} c_{2k}\\,u^{2k}" />
          <p style={{ marginTop: 8 }}>
            Freezing replaces the discrete rung sum with a smooth Gaussian envelope.
            The <strong style={{ color: '#10b981' }}>slack index</strong>{' '}
            <InlineMath tex="\\Pi_{\\text{slack}} = (\\alpha - t - \\varepsilon)U^2" /> quantifies
            how much margin remains. When slack is positive and large, the proxy is reliable;
            as it approaches zero, the approximation tightens and may fail.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#ef4444' }}>Ground-State Collapse</h3>
          <BlockMath tex={"\\lim_{\\beta\\to\\infty} w(p,m) = \\begin{cases} 1 & m = 0 \\\\ 0 & m \\geq 1 \\end{cases}"} />
          <p style={{ marginTop: 8 }}>
            In the zero-temperature limit, only the <InlineMath tex="m = 0" /> rung survives.
            The entire prime ladder collapses to its ground state: the identity contribution{' '}
            <InlineMath tex="p^0 = 1" />. The product over primes becomes trivial, and{' '}
            <InlineMath tex="Z_{TL}" /> loses all spectral information. This collapse is the
            thermodynamic dual of the Bost-Connes condensation.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #a855f7' }}>
        <h3 style={{ color: '#a855f7', fontSize: 14, marginBottom: 12 }}>
          Phase Diagram Interpretation
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The <InlineMath tex="(\\beta, P)" /> phase diagram reveals the structure of the deformed
          zeta function. At <InlineMath tex="\\beta = 0, P = 0" /> (origin), we recover the undeformed
          ladder sum. Moving right (increasing <InlineMath tex="\\beta" />) suppresses higher rungs
          via Boltzmann-type weighting. Moving up (increasing <InlineMath tex="P" />) adds quadratic
          penalty. The zero loci of <InlineMath tex="|Z_{TL}|" /> trace curves in this plane,
          showing how the zeros of the deformed function depend on the thermodynamic parameters.
          At large <InlineMath tex="\\beta" />, ground-state collapse makes{' '}
          <InlineMath tex="|Z_{TL}|" /> uniformly non-zero.
        </p>
      </div>

      {/* Related Pages */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/oscillators" style={{ color: '#06b6d4', fontSize: 13 }}>Oscillators (LC ladder model)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/supercritical" style={{ color: '#8b5cf6', fontSize: 13 }}>Supercritical (thermodynamics)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/hamiltonian" style={{ color: '#10b981', fontSize: 13 }}>Hamiltonian (energy landscape)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/spectral-attack" style={{ color: '#f97316', fontSize: 13 }}>Spectral Attack</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/zeta" style={{ color: '#3b82f6', fontSize: 13 }}>Zeta Function</Link>
        </div>
      </div>
    </div>
  );
}
