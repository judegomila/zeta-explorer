import React from 'react';
import { Link } from 'react-router-dom';
import CrossAttackViz from '../components/CrossAttackViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function CrossAttackPage() {
  return (
    <div className="page">
      <PageHeader title="Cross-Attack Efficiency Dashboard">
        <p>
          A unified dashboard that runs <strong>all nine attack vectors</strong> side-by-side,
          measures their cross-correlations, and combines them into a single confinement potential
          that is more constraining than any individual attack alone.
        </p>
      </PageHeader>

      <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid #8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6', fontSize: 14, marginBottom: 8 }}>The Multi-Pronged Approach</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Each attack vector probes a different mathematical structure — information-theoretic,
          geometric, algebraic, or spectral — that independently constrains the real part of
          zeta zeros to <InlineMath tex={'\\sigma = \\tfrac{1}{2}'} />. By evaluating them jointly,
          we can identify which attacks are <em>redundant</em> (measuring the same underlying
          phenomenon) and which are <em>independent</em> (providing genuinely distinct evidence).
        </p>
      </div>

      <BlockMath tex={
        '\\Phi_{\\text{combined}}(\\sigma, t) = \\sum_{k=1}^{9} w_k \\cdot A_k(\\sigma, t), ' +
        '\\quad \\text{where each } A_k \\text{ is an independent attack score}'
      } />

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6', fontSize: 14 }}>Nine Attack Vectors</h3>
          <ul style={{ marginLeft: 16, color: '#94a3b8', fontSize: 12, lineHeight: 2 }}>
            <li><strong style={{ color: '#3b82f6' }}>Fisher Information:</strong> Diverges at zeros, peaked at the critical line</li>
            <li><strong style={{ color: '#10b981' }}>KL Divergence:</strong> Information-theoretic distance from equilibrium at <InlineMath tex={'\\sigma=\\tfrac{1}{2}'} /></li>
            <li><strong style={{ color: '#06b6d4' }}>Lyapunov Stability:</strong> KL acts as a Lyapunov function with minimum at <InlineMath tex={'\\sigma=\\tfrac{1}{2}'} /></li>
            <li><strong style={{ color: '#f59e0b' }}>Phase Barriers:</strong> Thermodynamic free-energy barriers confine zeros</li>
            <li><strong style={{ color: '#a855f7' }}>CY Spectral:</strong> Calabi-Yau Laplacian eigenvalues mirror GUE statistics</li>
            <li><strong style={{ color: '#ec4899' }}>CY Modularity:</strong> Ramanujan bound satisfaction (finite-field RH analog)</li>
            <li><strong style={{ color: '#ef4444' }}>Li Coefficients:</strong> <InlineMath tex={'\\lambda_n > 0'} /> for all <InlineMath tex={'n \\geq 1'} /> iff RH holds</li>
            <li><strong style={{ color: '#f97316' }}>Hamiltonian Convexity:</strong> ZPO Hamiltonian strictly convex at <InlineMath tex={'\\sigma=\\tfrac{1}{2}'} /></li>
            <li><strong style={{ color: '#84cc16' }}>S-Matrix Confinement:</strong> Darlington unitarity constrains transmission zeros</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b', fontSize: 14 }}>Why Cross-Correlation Matters</h3>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
            If two attacks are strongly correlated (Pearson |r| &gt; 0.7), they are likely measuring
            the same underlying structure and are <em>redundant</em>. Independent attacks (|r| &lt; 0.3)
            provide genuinely distinct evidence. The effective number of independent constraints is
            what determines overall proof strength.
          </p>
          <BlockMath tex={
            'N_{\\text{eff}} = \\left( \\sum_{k=1}^{9} \\lambda_k^2 \\right)^{-1} \\cdot \\left( \\sum_{k=1}^{9} \\lambda_k \\right)^2'
          } />
          <p style={{ color: '#64748b', fontSize: 11, marginTop: 8 }}>
            where <InlineMath tex={'\\lambda_k'} /> are eigenvalues of the correlation matrix.
          </p>
        </div>
      </div>

      {/* ─── Visualization ─── */}
      <CrossAttackViz />

      {/* ─── Attack Independence ─── */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #10b981' }}>
        <h3 style={{ color: '#10b981', fontSize: 14, marginBottom: 8 }}>Attack Independence</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The efficiency matrix (Tab 1) reveals the correlation structure across all nine attacks.
          Green cells indicate <strong>independent</strong> attack pairs: these provide distinct,
          non-redundant evidence for <InlineMath tex={'\\sigma = \\tfrac{1}{2}'} />.
          Red cells indicate <strong>redundant</strong> pairs that measure essentially the same phenomenon.
        </p>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginTop: 12 }}>
          The key principle: if <InlineMath tex={'k'} /> independent attacks each individually support RH
          with confidence <InlineMath tex={'1 - \\epsilon'} />, the combined confidence
          is <InlineMath tex={'1 - \\epsilon^k'} />, growing exponentially with the number of
          independent lines of evidence. This is why attack independence matters more than the
          strength of any single attack.
        </p>
      </div>

      {/* ─── Unified Confinement ─── */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #3b82f6' }}>
        <h3 style={{ color: '#3b82f6', fontSize: 14, marginBottom: 8 }}>Unified Confinement</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The combined score (Tab 3) weights all attacks into a single confinement
          potential <InlineMath tex={'\\Phi_{\\text{combined}}(\\sigma, t)'} />. By construction,
          this potential has a deeper, sharper well at <InlineMath tex={'\\sigma = \\tfrac{1}{2}'} /> than
          any individual attack — the combined constraint is strictly stronger.
        </p>
        <BlockMath tex={
          '\\Phi_{\\text{combined}}(\\sigma, t) \\geq \\max_k \\, w_k \\cdot A_k(\\sigma, t) ' +
          '\\quad \\Longrightarrow \\quad \\text{deeper well, stronger confinement}'
        } />
        <p style={{ color: '#ef4444', fontSize: 12, marginTop: 12, fontWeight: 600 }}>
          Caveat: Numerical convergence of multiple independent measures is powerful evidence
          but not a formal proof. A rigorous proof requires showing analytically that
          the combined confinement potential has a unique global minimum at the critical line.
        </p>
      </div>

      {/* ─── Related Pages ─── */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ color: '#64748b', fontSize: 14, marginBottom: 12 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[
            { to: '/spectral-attack', label: 'Spectral Attack', color: '#8b5cf6' },
            { to: '/rh-attack', label: 'RH Attack', color: '#ef4444' },
            { to: '/calabi-yau', label: 'Calabi-Yau', color: '#a855f7' },
            { to: '/gap-closing', label: 'Gap Closing', color: '#f59e0b' },
            { to: '/proof-checker', label: 'Proof Checker', color: '#3b82f6' },
            { to: '/rigor', label: 'Rigor Analysis', color: '#10b981' },
            { to: '/gue-comparison', label: 'GUE Comparison', color: '#a855f7' },
            { to: '/pair-correlation', label: 'Pair Correlation', color: '#06b6d4' },
            { to: '/berry-keating-xp', label: 'Berry-Keating xp', color: '#f97316' },
            { to: '/connes-adelic', label: 'Connes Adelic', color: '#84cc16' },
            { to: '/voronin-universality', label: 'Voronin Universality', color: '#ec4899' },
            { to: '/riemann-siegel-z', label: 'Riemann-Siegel Z', color: '#22d3ee' },
            { to: '/edge-rigidity', label: 'Edge Rigidity', color: '#eab308' },
            { to: '/esy-rigidity-empirical', label: 'ESY Rigidity', color: '#f59e0b' },
            { to: '/lmfdb-cross-reference', label: 'LMFDB Cross-Reference', color: '#8b5cf6' },
          ].map(({ to, label, color }) => (
            <Link
              key={to}
              to={to}
              style={{
                padding: '6px 14px',
                background: '#1e293b',
                color,
                borderRadius: 6,
                fontSize: 12,
                textDecoration: 'none',
                border: `1px solid ${color}33`,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
