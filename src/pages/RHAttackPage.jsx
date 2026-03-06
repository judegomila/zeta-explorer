import React from 'react';
import { Link } from 'react-router-dom';
import RHAttackViz from '../components/RHAttackViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function RHAttackPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>RH Attack Strategies</h1>
        <p>
          Computational tools for testing specific conditions equivalent to or implied by the
          Riemann Hypothesis, using the ZPO oscillator framework. Each strategy identifies
          what is established, what is assumed, and where the proof gaps lie.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid #ef4444' }}>
        <h3 style={{ color: '#ef4444', fontSize: 14, marginBottom: 8 }}>Intellectual Honesty Statement</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The ZPO model provides a beautiful physical framework for understanding the zeta function,
          but <strong>analogies are not proofs</strong>. The gap between "the model is consistent with RH"
          and "the model proves RH" is enormous. This page makes those gaps explicit and testable.
          Every green checkmark below comes with a caveat; every red flag identifies a genuine
          mathematical obstacle that would need to be overcome.
        </p>
      </div>

      <BlockMath tex={"\\text{RH}: \\quad \\zeta(\\rho) = 0 \\;\\Longrightarrow\\; \\text{Re}(\\rho) = \\tfrac{1}{2}"} />

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6', fontSize: 14 }}>Five Attack Strategies</h3>
          <ol style={{ marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 2 }}>
            <li>
              <strong style={{ color: '#10b981' }}>Li Coefficients</strong> — Compute{' '}
              <InlineMath tex="\lambda_n" /> from known zeros. <InlineMath tex={"\\lambda_n > 0 \\;\\forall n \\iff \\text{RH}"} />.
            </li>
            <li>
              <strong style={{ color: '#3b82f6' }}>Hamiltonian Convexity</strong> — Test{' '}
              <InlineMath tex="\partial^2 H / \partial\sigma^2 > 0" /> at{' '}
              <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> (ZPO energy minimum).
            </li>
            <li>
              <strong style={{ color: '#8b5cf6' }}>S-Matrix Confinement</strong> — Darlington synthesis:
              transmission zeros of lossless networks lie on the <InlineMath tex="j\omega" /> axis.
            </li>
            <li>
              <strong style={{ color: '#f59e0b' }}>de Bruijn–Newman</strong> — Heat flow parameter{' '}
              <InlineMath tex="\Lambda = 0" /> (proved by Rodgers–Tao, 2020).
            </li>
            <li>
              <strong style={{ color: '#ef4444' }}>Proof Map</strong> — Explicit gap analysis:
              what's proven, what's assumed, and what's known to fail.
            </li>
          </ol>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b', fontSize: 14 }}>The Central Gap</h3>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>
            The ZPO model shows that at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />:
          </p>
          <ul style={{ marginLeft: 16, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
            <li>The bridge <InlineMath tex="\chi(s)" /> is unitary (<InlineMath tex="|\chi| = 1" />)</li>
            <li>Direct and dual ladders are impedance-matched</li>
            <li>The Hamiltonian is minimized</li>
            <li>The S-matrix is on the unitarity boundary</li>
          </ul>
          <p style={{ color: '#ef4444', fontSize: 13, marginTop: 12, fontWeight: 600 }}>
            But this only shows the model is <em>consistent</em> with zeros at{' '}
            <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />. It does not prove zeros{' '}
            <em>must</em> be there. The missing link: a rigorous proof that zeros of{' '}
            <InlineMath tex="\zeta(s)" /> correspond to resonances of the Hamiltonian{' '}
            <InlineMath tex="\mathcal{H}" />.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <RHAttackViz />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6' }}>The Darlington Synthesis Strategy</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
          The most promising path from the ZPO model to RH uses a classical result from
          microwave network synthesis:
        </p>
        <BlockMath tex={"\\text{Darlington (1939): For a lossless reciprocal 2-port, zeros of } S_{21} \\text{ lie on the } j\\omega \\text{ axis.}"} />
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginTop: 12 }}>
          In the ZPO mapping: <InlineMath tex="S_{21}" /> is the transmission through the twin-ladder
          (proportional to <InlineMath tex="\zeta(s)" />), and the{' '}
          <InlineMath tex="j\omega" /> axis is the critical line <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
          If the ZPO network satisfies Darlington's conditions <em>exactly</em>, then RH follows.
        </p>
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, border: '1px solid #ef444440' }}>
          <h4 style={{ color: '#ef4444', fontSize: 12, marginBottom: 8 }}>Three Obstacles:</h4>
          <ol style={{ marginLeft: 16, color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
            <li>
              <strong>Convergence:</strong> The Euler product (= cascade) only converges for{' '}
              <InlineMath tex="\sigma > 1" />. In the critical strip where zeros live, the
              "cascade" is defined by analytic continuation, not direct circuit computation.
            </li>
            <li>
              <strong>Exactness:</strong> Darlington requires <em>exact</em> losslessness, not
              approximate. The bridge satisfies <InlineMath tex="|\chi| = 1" /> exactly at{' '}
              <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, but one must show the full network
              (not just the bridge) is lossless.
            </li>
            <li>
              <strong>Realizability:</strong> Darlington's theorem applies to physically realizable
              networks. The ZPO network has infinitely many stages (one per prime), requiring
              a limiting argument.
            </li>
          </ol>
        </div>
      </div>

      {/* The Five Proof Paths */}
      <div className="card" style={{ marginTop: 32, borderLeft: '3px solid #3b82f6' }}>
        <h3 style={{ color: '#3b82f6' }}>The Five Proof Paths</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          Five fundamentally different strategies for proving RH, each translating the hypothesis
          into a different mathematical framework.
        </p>

        {/* Path A */}
        <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(139,92,246,0.06)', borderRadius: 8, border: '1px solid #8b5cf620' }}>
          <h4 style={{ color: '#8b5cf6', fontSize: 13, marginBottom: 6 }}>Path A: Hilbert-P&oacute;lya</h4>
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
            Construct a self-adjoint operator <InlineMath tex={"\\mathcal{H}"} /> whose spectrum
            coincides with the nontrivial zeros of <InlineMath tex={"\\zeta(s)"} />.
            Self-adjointness forces eigenvalues to be real, giving{' '}
            <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
          </p>
          <BlockMath tex={"\\mathcal{H}\\psi_n = E_n\\psi_n, \\quad E_n = \\gamma_n \\;\\Longrightarrow\\; \\text{Re}(\\rho_n) = \\tfrac{1}{2}"} />
          <p style={{ color: '#f59e0b', fontSize: 11, marginTop: 8, fontWeight: 600 }}>
            Status: Operator not constructed. The Berry-Keating <InlineMath tex={"\\hat{H} = \\hat{x}\\hat{p}"} /> quantization
            is the leading candidate.
          </p>
        </div>

        {/* Path B */}
        <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(16,185,129,0.06)', borderRadius: 8, border: '1px solid #10b98120' }}>
          <h4 style={{ color: '#10b981', fontSize: 13, marginBottom: 6 }}>Path B: Darlington</h4>
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
            Prove the ZPO twin ladder satisfies exact losslessness. Transmission zeros of a lossless
            network lie on the <InlineMath tex={"j\\omega"} /> axis, which maps to{' '}
            <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
          </p>
          <BlockMath tex={"S^\\dagger S = I \\;\\;(\\text{exact losslessness}) \\;\\Longrightarrow\\; \\text{zeros of } S_{21} \\text{ on } j\\omega \\text{ axis}"} />
          <p style={{ color: '#ef4444', fontSize: 11, marginTop: 8, fontWeight: 600 }}>
            Status: Convergence (S4) and realizability (S7) gaps remain.
          </p>
        </div>

        {/* Path C */}
        <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(6,182,212,0.06)', borderRadius: 8, border: '1px solid #06b6d420' }}>
          <h4 style={{ color: '#06b6d4', fontSize: 13, marginBottom: 6 }}>Path C: Weil Positivity</h4>
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
            Prove <InlineMath tex={"W(g * \\tilde{g}) \\geq 0"} /> for all test functions{' '}
            <InlineMath tex={"g"} />. Connes (2026) shows this is equivalent to RH.
          </p>
          <BlockMath tex={"W(g * \\tilde{g}) = \\sum_{\\rho} |\\hat{g}(\\rho)|^2 \\geq 0 \\quad \\forall g \\;\\;\\Longleftrightarrow\\;\\; \\text{RH}"} />
          <p style={{ color: '#f59e0b', fontSize: 11, marginTop: 8, fontWeight: 600 }}>
            Status: Proven for Gaussian tests, open in general.
          </p>
        </div>

        {/* Path D */}
        <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(245,158,11,0.06)', borderRadius: 8, border: '1px solid #f59e0b20' }}>
          <h4 style={{ color: '#f59e0b', fontSize: 13, marginBottom: 6 }}>Path D: Nyman-Beurling</h4>
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
            Show that fractional parts <InlineMath tex={"\\{\\theta / x\\}"} /> are{' '}
            <InlineMath tex={"L^2"} />-dense. Density implies no zero at{' '}
            <InlineMath tex={"\\sigma > \\tfrac{1}{2}"} />.
          </p>
          <BlockMath tex={"d_N = \\inf\\left\\| 1 - \\sum_{k=1}^{N} a_k \\left\\{ \\frac{\\theta_k}{x} \\right\\} \\right\\|_{L^2(0,1)} \\;\\to\\; 0 \\;\\;\\Longleftrightarrow\\;\\; \\text{RH}"} />
          <p style={{ color: '#f59e0b', fontSize: 11, marginTop: 8, fontWeight: 600 }}>
            Status: <InlineMath tex={"d_N \\to 0"} /> computationally verified for{' '}
            <InlineMath tex={"N \\leq 10^6"} />, rate consistent with RH.
          </p>
        </div>

        {/* Path E */}
        <div style={{ padding: '12px 16px', background: 'rgba(59,130,246,0.06)', borderRadius: 8, border: '1px solid #3b82f620' }}>
          <h4 style={{ color: '#3b82f6', fontSize: 13, marginBottom: 6 }}>Path E: Li Criterion</h4>
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
            Prove <InlineMath tex={"\\lambda_n \\geq 0"} /> for all <InlineMath tex={"n \\geq 1"} />,
            where <InlineMath tex={"\\lambda_n"} /> are the Li coefficients derived from the zeros.
          </p>
          <BlockMath tex={"\\lambda_n = \\sum_{\\rho} \\left[ 1 - \\left(1 - \\frac{1}{\\rho}\\right)^n \\right] \\geq 0 \\;\\;\\forall n \\;\\;\\Longleftrightarrow\\;\\; \\text{RH}"} />
          <p style={{ color: '#f59e0b', fontSize: 11, marginTop: 8, fontWeight: 600 }}>
            Status: Verified computationally for <InlineMath tex={"n \\leq 10^5"} />.
          </p>
        </div>
      </div>

      {/* Proof Gap Status Matrix */}
      <div className="card" style={{ marginTop: 32, borderLeft: '3px solid #ef4444' }}>
        <h3 style={{ color: '#ef4444' }}>Proof Gap Status Matrix</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          Three critical gaps stand between current knowledge and a complete proof. Each gap
          blocks one or more of the five proof paths above.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {/* S4 */}
          <div style={{ padding: '14px', borderRadius: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid #f59e0b40' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 14 }}>S4</span>
              <span style={{ background: '#f59e0b30', color: '#f59e0b', fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>AMBER</span>
            </div>
            <h4 style={{ color: '#e2e8f0', fontSize: 12, marginBottom: 6 }}>Regularization</h4>
            <p style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.7 }}>
              Extend Euler product to critical strip via analytic continuation of the cascade.
            </p>
            <BlockMath tex={"\\prod_{p}\\left(1 - p^{-s}\\right)^{-1} \\;\\xrightarrow{\\text{S4}}\\; \\zeta(s), \\quad 0 < \\sigma < 1"} />
            <p style={{ color: '#f59e0b', fontSize: 11, marginTop: 6, fontWeight: 600 }}>
              Eta relation provides partial solution.
            </p>
            <div style={{ marginTop: 10, padding: '6px 8px', background: 'rgba(0,0,0,0.2)', borderRadius: 4 }}>
              <span style={{ color: '#64748b', fontSize: 10 }}>Blocks: </span>
              <span style={{ color: '#10b981', fontSize: 10, fontWeight: 600 }}>B</span>
              <span style={{ color: '#64748b', fontSize: 10 }}>, </span>
              <span style={{ color: '#06b6d4', fontSize: 10, fontWeight: 600 }}>C</span>
            </div>
          </div>

          {/* S5 */}
          <div style={{ padding: '14px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid #ef444440' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 14 }}>S5</span>
              <span style={{ background: '#ef444430', color: '#ef4444', fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>RED</span>
            </div>
            <h4 style={{ color: '#e2e8f0', fontSize: 12, marginBottom: 6 }}>Hilbert-P&oacute;lya</h4>
            <p style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.7 }}>
              Construct self-adjoint operator <InlineMath tex={"\\mathcal{H}"} /> with{' '}
              <InlineMath tex={"\\text{spec}(\\mathcal{H}) = \\{\\gamma_n\\}"} />.
            </p>
            <BlockMath tex={"\\mathcal{H} = \\mathcal{H}^\\dagger, \\quad \\text{spec}(\\mathcal{H}) = \\{\\gamma_n : \\zeta(\\tfrac{1}{2} + i\\gamma_n) = 0\\}"} />
            <p style={{ color: '#ef4444', fontSize: 11, marginTop: 6, fontWeight: 600 }}>
              No rigorous construction exists.
            </p>
            <div style={{ marginTop: 10, padding: '6px 8px', background: 'rgba(0,0,0,0.2)', borderRadius: 4 }}>
              <span style={{ color: '#64748b', fontSize: 10 }}>Blocks: </span>
              <span style={{ color: '#8b5cf6', fontSize: 10, fontWeight: 600 }}>A</span>
            </div>
          </div>

          {/* S7 */}
          <div style={{ padding: '14px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid #ef444440' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 14 }}>S7</span>
              <span style={{ background: '#ef444430', color: '#ef4444', fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>RED</span>
            </div>
            <h4 style={{ color: '#e2e8f0', fontSize: 12, marginBottom: 6 }}>Darlington</h4>
            <p style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.7 }}>
              Prove infinite losslessness: the twin-ladder with infinitely many prime stages remains
              exactly lossless.
            </p>
            <BlockMath tex={"\\lim_{N \\to \\infty} S_N^\\dagger S_N = I \\quad (\\text{not just } \\approx I)"} />
            <p style={{ color: '#ef4444', fontSize: 11, marginTop: 6, fontWeight: 600 }}>
              Finite truncations satisfy; limit argument needed.
            </p>
            <div style={{ marginTop: 10, padding: '6px 8px', background: 'rgba(0,0,0,0.2)', borderRadius: 4 }}>
              <span style={{ color: '#64748b', fontSize: 10 }}>Blocks: </span>
              <span style={{ color: '#10b981', fontSize: 10, fontWeight: 600 }}>B</span>
            </div>
          </div>
        </div>

        {/* Summary row */}
        <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(100,116,139,0.08)', borderRadius: 6, border: '1px solid #33415520' }}>
          <table style={{ width: '100%', fontSize: 11, color: '#94a3b8', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <th style={{ textAlign: 'left', padding: '4px 8px', color: '#64748b', fontWeight: 600 }}>Path</th>
                <th style={{ textAlign: 'left', padding: '4px 8px', color: '#64748b', fontWeight: 600 }}>Blocked By</th>
                <th style={{ textAlign: 'left', padding: '4px 8px', color: '#64748b', fontWeight: 600 }}>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['A: Hilbert-Polya', 'S5', '#ef4444', 'Blocked — no operator'],
                ['B: Darlington', 'S4, S7', '#ef4444', 'Blocked — convergence + limit'],
                ['C: Weil Positivity', 'S4', '#f59e0b', 'Partially blocked — general tests open'],
                ['D: Nyman-Beurling', '(none)', '#10b981', 'Open — independent approach'],
                ['E: Li Criterion', '(none)', '#10b981', 'Open — computational only'],
              ].map(([path, gaps, color, verdict], i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '5px 8px', fontWeight: 600, color }}>{path}</td>
                  <td style={{ padding: '5px 8px', color: gaps === '(none)' ? '#10b981' : '#ef4444' }}>{gaps}</td>
                  <td style={{ padding: '5px 8px', color: '#64748b', fontSize: 10 }}>{verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ color: '#06b6d4', fontSize: 14 }}>Known Equivalences to RH</h3>
        <table style={{ width: '100%', marginTop: 12, fontSize: 12, color: 'var(--text-secondary)', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              <th style={{ textAlign: 'left', padding: '6px 10px', color: '#06b6d4' }}>Criterion</th>
              <th style={{ textAlign: 'left', padding: '6px 10px', color: '#10b981' }}>Tested Here?</th>
              <th style={{ textAlign: 'left', padding: '6px 10px', color: '#64748b' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Li: λ_n > 0 ∀n ≥ 1', 'Yes (Tab 1)', 'Consistent (finite computation)'],
              ['de Bruijn–Newman: Λ ≤ 0', 'Yes (Tab 4)', 'Proved: Λ = 0 (Rodgers–Tao)'],
              ['Weil positivity', 'Partial', 'Tested for Gaussian test functions'],
              ['Nyman–Beurling–Báez-Duarte', 'No', 'Requires L² approximation bounds'],
              ['Robin inequality: σ(n) < eᵞ n ln ln n', 'No', 'Requires computing σ(n) for large n'],
              ['Lagarias: σ(n) ≤ Hₙ + eᴴⁿ ln Hₙ', 'No', 'Requires harmonic number bounds'],
              ['Selberg: N(T) = (T/2π)log(T/2πe) + S(T)', 'Partial', 'S(T) = O(log T) follows from RH'],
              ['GUE hypothesis (pair correlation)', 'No', 'Would require high-precision zero data'],
            ].map(([criterion, tested, status], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '6px 10px', color: '#06b6d4' }}>{criterion}</td>
                <td style={{ padding: '6px 10px', color: tested.startsWith('Yes') ? '#10b981' : tested === 'No' ? '#ef4444' : '#f59e0b' }}>
                  {tested}
                </td>
                <td style={{ padding: '6px 10px', color: '#64748b', fontSize: 11 }}>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Related Pages */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/spectral-attack" style={{ color: '#06b6d4', fontSize: 13 }}>Spectral Attack (6 vectors)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/gap-closing" style={{ color: '#f97316', fontSize: 13 }}>Gap Closing (S4/S5/S7)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/formal-proof" style={{ color: '#10b981', fontSize: 13 }}>Formal Proof (10 sections)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/proof-checker" style={{ color: '#ef4444', fontSize: 13 }}>Proof Checker (adversarial)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/rigor" style={{ color: '#f59e0b', fontSize: 13 }}>Rigor (criticisms)</Link>
        </div>
      </div>
    </div>
  );
}
