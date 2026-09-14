import React from 'react';
import { Link } from 'react-router-dom';
import CrossAttackViz from '../components/CrossAttackViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';

// Cross-Attack Efficiency Dashboard — editorial (warm) re-theme.
// Structure, data, claims, and the interactive viz are unchanged; only the
// visual chrome is ported from the dark PageHeader/dashboard look to the
// warm editorial system (ed-root / ed-full / ed-h1 / var(--...) tokens).

function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
  };
}

export default function CrossAttackPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Cross-Attack Efficiency Dashboard</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            A unified dashboard that runs <strong>all nine approach vectors</strong> side-by-side,
            measures their cross-correlations, and combines them into a single confinement potential
            that is more constraining than any individual approach alone.
          </p>
        </div>

        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), marginBottom: 24 }}>
          <h3 style={{ color: 'var(--brass)', fontSize: 14, marginBottom: 8 }}>The Multi-Pronged Approach</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            Each approach vector probes a different mathematical structure — information-theoretic,
            geometric, algebraic, or spectral — that independently constrains the real part of
            zeta zeros to <InlineMath tex={'\\sigma = \\tfrac{1}{2}'} />. By evaluating them jointly,
            we can identify which approaches are <em>redundant</em> (measuring the same underlying
            phenomenon) and which are <em>independent</em> (providing genuinely distinct evidence).
          </p>
        </div>

        <BlockMath tex={
          '\\Phi_{\\text{combined}}(\\sigma, t) = \\sum_{k=1}^{9} w_k \\cdot A_k(\\sigma, t), ' +
          '\\quad \\text{where each } A_k \\text{ is an independent approach score}'
        } />

        <div className="two-col" style={{ marginTop: 24 }}>
          <div className="card" style={cardBaseLeft('var(--blue)')}>
            <h3 style={{ color: 'var(--blue)', fontSize: 14 }}>Nine Approach Vectors</h3>
            <ul style={{ marginLeft: 16, color: 'var(--ink-soft)', fontSize: 12, lineHeight: 2 }}>
              <li><strong style={{ color: 'var(--blue)' }}>Fisher Information:</strong> Diverges at zeros, peaked at the critical line</li>
              <li><strong style={{ color: 'var(--green)' }}>KL Divergence:</strong> Information-theoretic distance from equilibrium at <InlineMath tex={'\\sigma=\\tfrac{1}{2}'} /></li>
              <li><strong style={{ color: 'var(--blue)' }}>Lyapunov Stability:</strong> KL acts as a Lyapunov function with minimum at <InlineMath tex={'\\sigma=\\tfrac{1}{2}'} /></li>
              <li><strong style={{ color: 'var(--brass-dk)' }}>Phase Barriers:</strong> Thermodynamic free-energy barriers confine zeros</li>
              <li><strong style={{ color: 'var(--brass)' }}>CY Spectral:</strong> Calabi-Yau Laplacian eigenvalues mirror GUE statistics</li>
              <li><strong style={{ color: 'var(--terra-dk)' }}>CY Modularity:</strong> Ramanujan bound satisfaction (finite-field RH analog)</li>
              <li><strong style={{ color: 'var(--terra)' }}>Li Coefficients:</strong> <InlineMath tex={'\\lambda_n > 0'} /> for all <InlineMath tex={'n \\geq 1'} /> iff RH holds</li>
              <li><strong style={{ color: 'var(--brass-dk)' }}>Hamiltonian Convexity:</strong> Twin-Ladder Bridge Hamiltonian strictly convex at <InlineMath tex={'\\sigma=\\tfrac{1}{2}'} /></li>
              <li><strong style={{ color: 'var(--green)' }}>S-Matrix Confinement:</strong> Darlington unitarity — abandoned as a proof path (wrong divisor: the zeta zeros sit generically as <em>poles</em> of <InlineMath tex={'S_{21} = \\zeta(2s)/\\zeta(s)'} />, and unitarity alone does not confine transmission zeros); kept here only as a measured signal</li>
            </ul>
          </div>
          <div className="card" style={cardBaseLeft('var(--brass-dk)')}>
            <h3 style={{ color: 'var(--brass-dk)', fontSize: 14 }}>Why Cross-Correlation Matters</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
              If two approaches are strongly correlated (Pearson |r| &gt; 0.7), they are likely measuring
              the same underlying structure and are <em>redundant</em>. Independent approaches (|r| &lt; 0.3)
              provide genuinely distinct evidence. The effective number of independent constraints is
              what determines how much distinct information the battery carries.
            </p>
            <BlockMath tex={
              'N_{\\text{eff}} = \\left( \\sum_{k=1}^{9} \\lambda_k^2 \\right)^{-1} \\cdot \\left( \\sum_{k=1}^{9} \\lambda_k \\right)^2'
            } />
            <p style={{ color: 'var(--faint)', fontSize: 11, marginTop: 8 }}>
              where <InlineMath tex={'\\lambda_k'} /> are eigenvalues of the correlation matrix.
            </p>
          </div>
        </div>

        {/* ─── Visualization ─── */}
        <CrossAttackViz />

        {/* ─── Approach Independence ─── */}
        <div className="card" style={{ ...cardBaseLeft('var(--green)'), marginTop: 24 }}>
          <h3 style={{ color: 'var(--green)', fontSize: 14, marginBottom: 8 }}>Approach Independence</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            The efficiency matrix (Tab 1) reveals the correlation structure across all nine approaches.
            Green cells indicate <strong>independent</strong> approach pairs: these provide distinct,
            non-redundant evidence for <InlineMath tex={'\\sigma = \\tfrac{1}{2}'} />.
            Red cells indicate <strong>redundant</strong> pairs that measure essentially the same phenomenon.
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginTop: 12 }}>
            Independence tells you how many genuinely distinct diagnostics you have — it does not
            compound into proof strength. RH-class statements sit at a "barely true" boundary
            (Rodgers–Tao <InlineMath tex={'\\Lambda \\ge 0'} />), where soft numerical evidence cannot
            decide <InlineMath tex={'\\Lambda = 0'} />, and no accumulation of soft measures proves RH
            (<Link to="/flow-blindness-no-go" style={{ color: 'var(--green)' }}>the flow-blindness no-go</Link>).
            These nine channels are evidence and structure maps, not partial proofs.
          </p>
        </div>

        {/* ─── Unified Confinement ─── */}
        <div className="card" style={{ ...cardBaseLeft('var(--blue)'), marginTop: 24 }}>
          <h3 style={{ color: 'var(--blue)', fontSize: 14, marginBottom: 8 }}>Unified Confinement</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            The combined score (Tab 3) weights all approaches into a single confinement
            potential <InlineMath tex={'\\Phi_{\\text{combined}}(\\sigma, t)'} />. By construction,
            this potential has a deeper, sharper well at <InlineMath tex={'\\sigma = \\tfrac{1}{2}'} /> than
            any individual approach — the combined constraint is strictly stronger.
          </p>
          <BlockMath tex={
            '\\Phi_{\\text{combined}}(\\sigma, t) \\geq \\max_k \\, w_k \\cdot A_k(\\sigma, t) ' +
            '\\quad \\Longrightarrow \\quad \\text{deeper well, stronger confinement}'
          } />
          <p style={{ color: 'var(--terra-dk)', fontSize: 12, marginTop: 12, fontWeight: 600 }}>
            Caveat: Numerical convergence of multiple independent measures is powerful evidence
            but not a formal proof. A rigorous proof requires showing analytically that
            the combined confinement potential has a unique global minimum at the critical line.
          </p>
        </div>

        {/* ─── Related Pages ─── */}
        <div className="card" style={{ ...cardBaseLeft('var(--hairline)'), marginTop: 24 }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 14, marginBottom: 12 }}>Related Pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {[
              { to: '/spectral-attack', label: 'Spectral Approach', color: 'var(--brass)' },
              { to: '/rh-attack', label: 'RH Approach', color: 'var(--terra-dk)' },
              { to: '/calabi-yau', label: 'Calabi-Yau', color: 'var(--brass)' },
              { to: '/gap-closing', label: 'Gap Closing', color: 'var(--brass-dk)' },
              { to: '/proof-checker', label: 'Proof Checker', color: 'var(--blue)' },
              { to: '/rigor', label: 'Rigor Analysis', color: 'var(--green)' },
              { to: '/gue-comparison', label: 'GUE Comparison', color: 'var(--brass)' },
              { to: '/pair-correlation', label: 'Pair Correlation', color: 'var(--blue)' },
              { to: '/berry-keating-xp', label: 'Berry-Keating xp', color: 'var(--brass-dk)' },
              { to: '/connes-adelic', label: 'Connes Adelic', color: 'var(--green)' },
              { to: '/voronin-universality', label: 'Voronin Universality', color: 'var(--terra-dk)' },
              { to: '/riemann-siegel-z', label: 'Riemann-Siegel Z', color: 'var(--blue)' },
              { to: '/edge-rigidity', label: 'Edge Rigidity', color: 'var(--brass-dk)' },
              { to: '/esy-rigidity-empirical', label: 'ESY Rigidity', color: 'var(--brass-dk)' },
              { to: '/lmfdb-cross-reference', label: 'LMFDB Cross-Reference', color: 'var(--brass)' },
            ].map(({ to, label, color }) => (
              <Link
                key={to}
                to={to}
                style={{
                  padding: '6px 14px',
                  background: 'var(--paper)',
                  color,
                  borderRadius: 6,
                  fontSize: 12,
                  textDecoration: 'none',
                  border: `1px solid ${color}`,
                }}
              >
                {label}
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 14, fontSize: 13 }}>
            <Link to="/">← the atlas</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
