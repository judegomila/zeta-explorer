import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RHAttackViz from '../components/RHAttackViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import ConceptTerm from '../components/ConceptTerm.jsx';

// Editorial (warm) re-theme: same structure/data/logic as the original dark
// page, just re-skinned. RHAttackViz is left completely untouched.

// Color mapping — dark-theme hex accents to warm editorial vars.
const RED = 'var(--terra-dk)';   // was #ef4444
const BLUE = 'var(--blue)';      // was #3b82f6
const GREEN = 'var(--green)';    // was #10b981
const PURPLE = 'var(--terra)';   // was #8b5cf6
const AMBER = 'var(--brass-dk)'; // was #f59e0b
const CYAN = 'var(--blue)';      // was #06b6d4 (editorial palette has one blue)

// rgba() literals matching the vars above — CSS custom properties can't be fed
// into rgba() directly, so translucent backgrounds/glows use the resolved RGB.
const RED_A = (a) => `rgba(194,58,28,${a})`;
const BLUE_A = (a) => `rgba(63,107,134,${a})`;
const GREEN_A = (a) => `rgba(76,122,74,${a})`;
const PURPLE_A = (a) => `rgba(217,80,46,${a})`;
const AMBER_A = (a) => `rgba(181,138,46,${a})`;
const CYAN_A = BLUE_A;

export default function RHAttackPage() {
  const [selectedPath, setSelectedPath] = useState(null);

  // Which broad open interfaces block each proof path. S4 is the
  // route-specific passage from finite evidence to a global criterion.
  const pathGaps = {
    A: ['S5'],
    B: ['S4', 'S7'],
    C: ['S4'],
    D: ['S4'],
    E: ['S4'],
  };
  const gapActive = (gapId) =>
    selectedPath !== null && (pathGaps[selectedPath] || []).includes(gapId);
  const togglePath = (pathId) =>
    setSelectedPath(prev => (prev === pathId ? null : pathId));

  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>proof-path map: what each RH route still requires</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1">RH Approach Strategies</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.6, maxWidth: 760, marginTop: 10 }}>
            Computational tools for testing specific conditions <ConceptTerm slug="rh-equivalent-statement">equivalent to</ConceptTerm> or implied by the
            {' '}<ConceptTerm slug="riemann-hypothesis">Riemann Hypothesis</ConceptTerm>, using the <ConceptTerm slug="twin-ladder">Twin-Ladder Bridge</ConceptTerm> framework. Each strategy identifies
            what is established, what is assumed, and where the proof gaps lie.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 24, borderLeft: `3px solid ${RED}` }}>
          <h3 style={{ color: RED, fontSize: 14, marginBottom: 8 }}>Status</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            The Twin-Ladder Bridge model is a physical framework for understanding the zeta function,
            but <strong>analogies are not proofs</strong>. The gap between "the model is consistent with RH"
            and "the model proves RH" is enormous. This page makes those gaps explicit and testable.
            Every green checkmark below comes with a caveat; every red flag identifies a genuine
            mathematical obstacle that would need to be overcome.
          </p>
        </div>

        <BlockMath tex={"\\text{RH}: \\quad \\zeta(\\rho) = 0 \\;\\Longrightarrow\\; \\text{Re}(\\rho) = \\tfrac{1}{2}"} />

        <div className="two-col" style={{ marginTop: 24 }}>
          <div className="card">
            <h3 style={{ color: BLUE, fontSize: 14 }}>Five Approach Strategies</h3>
            <ol style={{ marginLeft: 16, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 2 }}>
              <li>
                <strong style={{ color: GREEN }}><ConceptTerm slug="li-criterion">Li Coefficients</ConceptTerm></strong> — Compute{' '}
                <InlineMath tex={"\\lambda_n"} /> from known zeros. <InlineMath tex={"\\lambda_n > 0 \\;\\forall n \\iff \\text{RH}"} />.
              </li>
              <li>
                <strong style={{ color: BLUE }}>Finite Energy Diagnostics</strong> — Test{' '}
                <InlineMath tex={"\\partial^2 H / \\partial\\sigma^2 > 0"} /> at{' '}
                <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> for explicitly defined truncations.
                The formerly displayed infinite positive prime sum diverges and is not a Hamiltonian.
              </li>
              <li>
                <strong style={{ color: PURPLE }}><ConceptTerm slug="scattering-matrix">S-Matrix</ConceptTerm> Confinement</strong> — <ConceptTerm slug="darlington-synthesis">Darlington synthesis</ConceptTerm>:
                transmission-zero confinement is a useful comparison, but it does not confine the
                poles of the displayed cascade ratio.
              </li>
              <li>
                <strong style={{ color: AMBER }}><ConceptTerm slug="de-bruijn-newman-constant">de Bruijn–Newman</ConceptTerm></strong> — <ConceptTerm slug="heat-flow-ht">Heat flow</ConceptTerm> parameter{' '}
                <InlineMath tex={"\\Lambda \\geq 0"} /> (proved by <ConceptTerm slug="newman-conjecture">Rodgers–Tao</ConceptTerm>, 2020); RH <InlineMath tex={"\\Leftrightarrow \\Lambda \\leq 0"} />.
              </li>
              <li>
                <strong style={{ color: RED }}>Proof Map</strong> — Explicit gap analysis:
                what's proven, what's assumed, and what's known to fail.
              </li>
            </ol>
          </div>
          <div className="card">
            <h3 style={{ color: AMBER, fontSize: 14 }}>What Is Exact vs Model-Only</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>
              On <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, the exact analytic statements are:
            </p>
            <ul style={{ marginLeft: 16, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
              <li><InlineMath tex={"|\\chi(\\tfrac12+it)| = 1"} /> for every real <InlineMath tex="t" /></li>
              <li>The functional equation pairs <InlineMath tex="s" /> with <InlineMath tex="1-s" /></li>
              <li>Finite Euler factors at conjugate points are conjugate when used as truncations</li>
            </ul>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, marginTop: 10 }}>
              A physical impedance match, a full unitary scattering matrix, and a Hamiltonian minimum
              are model interpretations or finite diagnostics. None follows from the scalar modulus
              identity without a causal passive realization.
            </p>
            <p style={{ color: RED, fontSize: 13, marginTop: 12, fontWeight: 600 }}>
              The missing links are a rigorous realization and an exact divisor map. For the
              algebraic ratio used in the app, zeta zeros are generically poles—not transmission
              zeros—so even exact boundary losslessness would not by itself prove RH.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <RHAttackViz />
        </div>

        <div className="card" style={{ marginTop: 32, borderColor: PURPLE }}>
          <h3 style={{ color: PURPLE }}>The Darlington Comparison — Corrected</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
            Darlington synthesis is a useful comparison only after stability, minimality,
            normalization, and the relevant zero type have been specified. Boundary losslessness
            and reciprocity alone do not force every transmission zero onto the boundary. For example,
          </p>
          <BlockMath tex={"h_a(s)=\\frac{s-a}{s+a},\\qquad S_a(s)=\\begin{pmatrix}0&h_a(s)\\\\h_a(s)&0\\end{pmatrix},\\qquad S_a(i\\omega)^*S_a(i\\omega)=I"} />
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginTop: 12 }}>
            is reciprocal and boundary-unitary for <InlineMath tex="a>0" />, yet
            <InlineMath tex="\;h_a(a)=0" /> is an off-axis transmission zero. Any confinement theorem
            used here therefore needs additional hypotheses; it cannot be inferred from
            <InlineMath tex="\;S^\dagger S=I" /> alone.
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginTop: 12 }}>
            The exact cascade identity is
            <InlineMath tex={"S_{21}(s)=\\zeta(2s)/\\zeta(s)"} />. Thus a generic non-trivial zero
            of <InlineMath tex={"\\zeta(s)"} /> is a pole of <InlineMath tex={"S_{21}"} />, while a
            transmission zero comes from <InlineMath tex={"\\zeta(2s)=0"} />. Exact Darlington
            conditions alone would therefore not prove RH; a separate pole-confinement theorem is needed.
          </p>
          <div style={{ marginTop: 16, padding: '12px 16px', background: RED_A(0.08), borderRadius: 8, border: `1px solid ${RED_A(0.25)}` }}>
            <h4 style={{ color: RED, fontSize: 12, marginBottom: 8 }}>Four independent obstacles:</h4>
            <ol style={{ marginLeft: 16, color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8 }}>
              <li>
                <strong>Convergence:</strong> The Euler product (= cascade) only converges for{' '}
                <InlineMath tex={"\\sigma > 1"} />. In the critical strip where zeros live, the
                "cascade" is defined by analytic continuation, not direct circuit computation.
              </li>
              <li>
                <strong>Realization:</strong> The symmetric Euler matrices and the physical
                LC/ABCD proxies have different transfer functions. No theorem identifies the
                algebraic ratio with a causal passive network.
              </li>
              <li>
                <strong>Exactness and synthesis hypotheses:</strong> A finite diagnostic approaching
                zero is not exact scattering unitarity, and unitarity alone does not supply
                minimum-phase transmission-zero confinement.
              </li>
              <li>
                <strong>Wrong divisor:</strong> The zeta zeros to be confined occur as denominator
                poles of <InlineMath tex="S_{21}=\zeta(2s)/\zeta(s)" />. Darlington-style
                transmission-zero statements target uncancelled numerator zeros instead.
              </li>
            </ol>
          </div>
        </div>

        {/* The Five Proof Paths — interactive path selector */}
        <div className="card" style={{ marginTop: 32, borderLeft: `3px solid ${BLUE}` }}>
          <h3 style={{ color: BLUE }}>The Five Proof Paths</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, marginBottom: 8 }}>
            Five fundamentally different strategies for proving RH, each translating the hypothesis
            into a different mathematical framework.
          </p>
          <p style={{ color: 'var(--faint)', fontSize: 11, marginBottom: 16, fontStyle: 'italic' }}>
            Click a path to highlight which proof gaps block it in the matrix below.
          </p>

          {/* Path A */}
          <div
            onClick={() => togglePath('A')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && togglePath('A')}
            style={{
              marginBottom: 16,
              padding: '12px 16px',
              background: selectedPath === 'A' ? PURPLE_A(0.14) : PURPLE_A(0.06),
              borderRadius: 8,
              border: selectedPath === 'A' ? `2px solid ${PURPLE}` : `1px solid ${PURPLE_A(0.13)}`,
              cursor: 'pointer',
              transition: 'border 0.15s, background 0.15s',
            }}
          >
            <h4 style={{ color: PURPLE, fontSize: 13, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
              <span>Path A: Hilbert-P&oacute;lya</span>
              {selectedPath === 'A' && <span style={{ fontSize: 10, background: PURPLE_A(0.19), padding: '2px 8px', borderRadius: 4 }}>selected — blocks: S5</span>}
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8 }}>
              Construct a self-adjoint operator <InlineMath tex={"\\mathcal{H}"} /> whose spectrum
              coincides with the nontrivial zeros of <InlineMath tex={"\\zeta(s)"} />.
              Self-adjointness forces eigenvalues to be real, giving{' '}
              <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
            </p>
            <BlockMath tex={"\\mathcal{H}\\psi_n = E_n\\psi_n, \\quad E_n = \\gamma_n \\;\\Longrightarrow\\; \\text{Re}(\\rho_n) = \\tfrac{1}{2}"} />
            <p style={{ color: AMBER, fontSize: 11, marginTop: 8, fontWeight: 600 }}>
              Status: Operator not constructed, and no leading candidate: the naive
              Berry-Keating <InlineMath tex={"\\hat{H} = \\hat{x}\\hat{p}"} /> quantization reproduces only the
              mean zero density — no self-adjoint <InlineMath tex={"xp"} /> realization with the zeros as its
              spectrum is known (<Link to="/berry-keating-xp" style={{ color: AMBER }}>failure exhibit</Link>).
              The spectral family stays open; see <Link to="/state-of-field" style={{ color: AMBER }}>the state of the field</Link>.
            </p>
          </div>

          {/* Path B */}
          <div
            onClick={() => togglePath('B')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && togglePath('B')}
            style={{
              marginBottom: 16,
              padding: '12px 16px',
              background: selectedPath === 'B' ? GREEN_A(0.12) : GREEN_A(0.06),
              borderRadius: 8,
              border: selectedPath === 'B' ? `2px solid ${GREEN}` : `1px solid ${GREEN_A(0.13)}`,
              cursor: 'pointer',
              transition: 'border 0.15s, background 0.15s',
            }}
          >
            <h4 style={{ color: GREEN, fontSize: 13, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
              <span>Path B: Darlington</span>
              {selectedPath === 'B' && <span style={{ fontSize: 10, background: GREEN_A(0.19), padding: '2px 8px', borderRadius: 4 }}>selected — realization + divisor gaps</span>}
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8 }}>
              Study exact losslessness and infinite-network realizability. Even if transmission zeros
              lie on the <InlineMath tex={"j\\omega"} /> axis, the zeta zeros represented by this
              cascade are poles rather than transmission zeros.
            </p>
            <BlockMath tex={"S^\\dagger S=I\\quad\\not\\Longrightarrow\\quad\\text{all zeros or poles of }S_{21}\\text{ lie on }j\\omega"} />
            <p style={{ color: RED, fontSize: 11, marginTop: 8, fontWeight: 600 }}>
              Status: convergence, realizability, and the zero/pole identification gap remain.
            </p>
          </div>

          {/* Path C */}
          <div
            onClick={() => togglePath('C')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && togglePath('C')}
            style={{
              marginBottom: 16,
              padding: '12px 16px',
              background: selectedPath === 'C' ? CYAN_A(0.12) : CYAN_A(0.06),
              borderRadius: 8,
              border: selectedPath === 'C' ? `2px solid ${CYAN}` : `1px solid ${CYAN_A(0.13)}`,
              cursor: 'pointer',
              transition: 'border 0.15s, background 0.15s',
            }}
          >
            <h4 style={{ color: CYAN, fontSize: 13, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
              <span>Path C: Weil Positivity</span>
              {selectedPath === 'C' && <span style={{ fontSize: 10, background: CYAN_A(0.19), padding: '2px 8px', borderRadius: 4 }}>selected — blocks: S4</span>}
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8 }}>
              Prove <InlineMath tex={"W(g * \\tilde{g}) \\geq 0"} /> for the full admissible
              test-function class. The classical Weil criterion makes that global positivity
              statement equivalent to RH.
            </p>
            <BlockMath tex={"W(g * \\tilde{g}) \\geq 0 \\quad \\text{for every admissible }g \\;\\;\\Longleftrightarrow\\;\\; \\text{RH}"} />
            <p style={{ color: AMBER, fontSize: 11, marginTop: 8, fontWeight: 600 }}>
              Status: finite sampled families provide evidence only; the all-test-function theorem is open.
            </p>
          </div>

          {/* Path D */}
          <div
            onClick={() => togglePath('D')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && togglePath('D')}
            style={{
              marginBottom: 16,
              padding: '12px 16px',
              background: selectedPath === 'D' ? AMBER_A(0.12) : AMBER_A(0.06),
              borderRadius: 8,
              border: selectedPath === 'D' ? `2px solid ${AMBER}` : `1px solid ${AMBER_A(0.13)}`,
              cursor: 'pointer',
              transition: 'border 0.15s, background 0.15s',
            }}
          >
            <h4 style={{ color: AMBER, fontSize: 13, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
              <span>Path D: Nyman-Beurling</span>
              {selectedPath === 'D' && <span style={{ fontSize: 10, background: AMBER_A(0.19), padding: '2px 8px', borderRadius: 4 }}>selected — all-N L² limit open</span>}
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8 }}>
              Show that fractional parts <InlineMath tex={"\\{\\theta / x\\}"} /> are{' '}
              <InlineMath tex={"L^2"} />-dense. Density implies no zero at{' '}
              <InlineMath tex={"\\sigma > \\tfrac{1}{2}"} />.
            </p>
            <BlockMath tex={"d_N = \\inf\\left\\| 1 - \\sum_{k=1}^{N} a_k \\left\\{ \\frac{\\theta_k}{x} \\right\\} \\right\\|_{L^2(0,1)} \\;\\to\\; 0 \\;\\;\\Longleftrightarrow\\;\\; \\text{RH}"} />
            <p style={{ color: AMBER, fontSize: 11, marginTop: 8, fontWeight: 600 }}>
              Status: finite <InlineMath tex="d_N" /> computations are consistent with the criterion;
              no finite cutoff proves the required limit.
            </p>
          </div>

          {/* Path E */}
          <div
            onClick={() => togglePath('E')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && togglePath('E')}
            style={{
              padding: '12px 16px',
              background: selectedPath === 'E' ? BLUE_A(0.12) : BLUE_A(0.06),
              borderRadius: 8,
              border: selectedPath === 'E' ? `2px solid ${BLUE}` : `1px solid ${BLUE_A(0.13)}`,
              cursor: 'pointer',
              transition: 'border 0.15s, background 0.15s',
            }}
          >
            <h4 style={{ color: BLUE, fontSize: 13, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
              <span>Path E: Li Criterion</span>
              {selectedPath === 'E' && <span style={{ fontSize: 10, background: BLUE_A(0.19), padding: '2px 8px', borderRadius: 4 }}>selected — all-n positivity open</span>}
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8 }}>
              Prove <InlineMath tex={"\\lambda_n \\geq 0"} /> for all <InlineMath tex={"n \\geq 1"} />,
              where <InlineMath tex={"\\lambda_n"} /> are the Li coefficients derived from the zeros.
            </p>
            <BlockMath tex={"\\lambda_n = \\sum_{\\rho} \\left[ 1 - \\left(1 - \\frac{1}{\\rho}\\right)^n \\right] \\geq 0 \\;\\;\\forall n \\;\\;\\Longleftrightarrow\\;\\; \\text{RH}"} />
            <p style={{ color: AMBER, fontSize: 11, marginTop: 8, fontWeight: 600 }}>
              Status: finite positivity checks are evidence only; the statement for every
              <InlineMath tex="n" /> remains equivalent to RH.
            </p>
          </div>
        </div>

        {/* Proof Gap Status Matrix */}
        <div className="card" style={{ marginTop: 32, borderLeft: `3px solid ${RED}` }}>
          <h3 style={{ color: RED }}>Proof Gap Status Matrix</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
            Three broad interfaces organize the open work. Each route instantiates the global
            closure interface differently; these cards are not percentages of a proof.
            {selectedPath && (
              <span style={{ color: 'var(--faint)', fontSize: 12, marginLeft: 8 }}>
                (Gaps blocked by Path {selectedPath} are highlighted)
              </span>
            )}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 12 }}>
            {/* S4 */}
            <div style={{
              padding: '14px', minWidth: 0, overflowWrap: 'anywhere',
              borderRadius: 8,
              background: gapActive('S4') ? AMBER_A(0.16) : AMBER_A(0.08),
              border: gapActive('S4') ? `2px solid ${AMBER}` : `1px solid ${AMBER_A(0.25)}`,
              boxShadow: gapActive('S4') ? `0 0 14px ${AMBER_A(0.25)}` : 'none',
              transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ color: AMBER, fontWeight: 700, fontSize: 14 }}>S4</span>
                <span style={{ background: AMBER_A(0.19), color: AMBER, fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>AMBER</span>
              </div>
              <h4 style={{ color: 'var(--ink)', fontSize: 12, marginBottom: 6 }}>Global Closure</h4>
              <p style={{ color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.7 }}>
                Upgrade finite or truncated evidence to the route&apos;s complete all-input,
                all-height, or all-index statement. Zeta&apos;s meromorphic continuation is classical;
                it does not continue a physical circuit realization.
              </p>
              <BlockMath tex={"\\text{finite checks}\\quad\\not\\Longrightarrow\\quad\\text{the global RH-equivalent criterion}"} />
              <p style={{ color: AMBER, fontSize: 11, marginTop: 6, fontWeight: 600 }}>
                Route-specific uniform estimates remain open.
              </p>
              <div style={{ marginTop: 10, padding: '6px 8px', background: 'var(--paper3)', borderRadius: 4 }}>
                <span style={{ color: 'var(--faint)', fontSize: 10 }}>Blocks: </span>
                <span style={{ color: GREEN, fontSize: 10, fontWeight: 600 }}>B</span>
                <span style={{ color: 'var(--faint)', fontSize: 10 }}>, </span>
                <span style={{ color: CYAN, fontSize: 10, fontWeight: 600 }}>C, D, E</span>
              </div>
            </div>

            {/* S5 */}
            <div style={{
              padding: '14px', minWidth: 0, overflowWrap: 'anywhere',
              borderRadius: 8,
              background: gapActive('S5') ? RED_A(0.16) : RED_A(0.08),
              border: gapActive('S5') ? `2px solid ${RED}` : `1px solid ${RED_A(0.25)}`,
              boxShadow: gapActive('S5') ? `0 0 14px ${RED_A(0.25)}` : 'none',
              transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ color: RED, fontWeight: 700, fontSize: 14 }}>S5</span>
                <span style={{ background: RED_A(0.19), color: RED, fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>RED</span>
              </div>
              <h4 style={{ color: 'var(--ink)', fontSize: 12, marginBottom: 6 }}>Hilbert-P&oacute;lya</h4>
              <p style={{ color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.7 }}>
                Construct self-adjoint operator <InlineMath tex={"\\mathcal{H}"} /> with{' '}
                <InlineMath tex={"\\text{spec}(\\mathcal{H}) = \\{\\gamma_n\\}"} />.
              </p>
              <BlockMath tex={"\\mathcal{H} = \\mathcal{H}^\\dagger, \\quad \\text{spec}(\\mathcal{H}) = \\{\\gamma_n : \\zeta(\\tfrac{1}{2} + i\\gamma_n) = 0\\}"} />
              <p style={{ color: RED, fontSize: 11, marginTop: 6, fontWeight: 600 }}>
                No rigorous construction exists.
              </p>
              <div style={{ marginTop: 10, padding: '6px 8px', background: 'var(--paper3)', borderRadius: 4 }}>
                <span style={{ color: 'var(--faint)', fontSize: 10 }}>Blocks: </span>
                <span style={{ color: PURPLE, fontSize: 10, fontWeight: 600 }}>A</span>
              </div>
            </div>

            {/* S7 */}
            <div style={{
              padding: '14px', minWidth: 0, overflowWrap: 'anywhere',
              borderRadius: 8,
              background: gapActive('S7') ? RED_A(0.16) : RED_A(0.08),
              border: gapActive('S7') ? `2px solid ${RED}` : `1px solid ${RED_A(0.25)}`,
              boxShadow: gapActive('S7') ? `0 0 14px ${RED_A(0.25)}` : 'none',
              transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ color: RED, fontWeight: 700, fontSize: 14 }}>S7</span>
                <span style={{ background: RED_A(0.19), color: RED, fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>RED</span>
              </div>
              <h4 style={{ color: 'var(--ink)', fontSize: 12, marginBottom: 6 }}>Physical Realization &amp; Divisor Map</h4>
              <p style={{ color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.7 }}>
                Construct a causal passive infinite network for the relevant function and prove a
                theorem that constrains the denominator poles encoding zeta zeros.
              </p>
              <BlockMath tex={"S_{21}^{(A)}=\\frac{\\zeta(2s)}{\\zeta(s)},\\qquad \\zeta(\\rho)=0\\Rightarrow \\rho\\text{ is generically a pole}"} />
              <p style={{ color: RED, fontSize: 11, marginTop: 6, fontWeight: 600 }}>
                Convergence alone cannot repair the zero/pole mismatch.
              </p>
              <div style={{ marginTop: 10, padding: '6px 8px', background: 'var(--paper3)', borderRadius: 4 }}>
                <span style={{ color: 'var(--faint)', fontSize: 10 }}>Blocks: </span>
                <span style={{ color: GREEN, fontSize: 10, fontWeight: 600 }}>B</span>
              </div>
            </div>
          </div>

          {/* Summary row */}
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--paper2)', borderRadius: 6, border: '1px solid var(--hairline)' }}>
            <table style={{ width: '100%', fontSize: 11, color: 'var(--ink-soft)', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
                  <th style={{ textAlign: 'left', padding: '4px 8px', color: 'var(--faint)', fontWeight: 600 }}>Path</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', color: 'var(--faint)', fontWeight: 600 }}>Blocked By</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', color: 'var(--faint)', fontWeight: 600 }}>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['A: Hilbert-Polya', 'S5', RED, 'Blocked — no operator'],
                  ['B: Darlington', 'S4, S7', RED, 'Blocked — realization + wrong divisor'],
                  ['C: Weil Positivity', 'S4', AMBER, 'Open — full admissible test class'],
                  ['D: Nyman-Beurling', 'S4', AMBER, 'Open — all-N L² limit'],
                  ['E: Li Criterion', 'S4', AMBER, 'Open — all-n positivity'],
                ].map(([path, gaps, color, verdict], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--hairline)' }}>
                    <td style={{ padding: '5px 8px', fontWeight: 600, color }}>{path}</td>
                    <td style={{ padding: '5px 8px', color: RED }}>{gaps}</td>
                    <td style={{ padding: '5px 8px', color: 'var(--faint)', fontSize: 10 }}>{verdict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ color: CYAN, fontSize: 14 }}>Known Equivalences &amp; Related Criteria</h3>
          <table style={{ width: '100%', marginTop: 12, fontSize: 12, color: 'var(--ink-soft)', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
                <th style={{ textAlign: 'left', padding: '6px 10px', color: CYAN }}>Criterion</th>
                <th style={{ textAlign: 'left', padding: '6px 10px', color: GREEN }}>Tested Here?</th>
                <th style={{ textAlign: 'left', padding: '6px 10px', color: 'var(--faint)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Li: λ_n > 0 ∀n ≥ 1', 'Yes (Tab 1)', 'Consistent (finite computation)'],
                ['de Bruijn–Newman: Λ ≥ 0', 'Yes (Tab 4)', 'Proved: Λ ≥ 0 (Rodgers–Tao); RH ⟺ Λ ≤ 0'],
                ['Weil positivity', 'Partial', 'Tested for Gaussian test functions'],
                ['Nyman–Beurling–Báez-Duarte', 'No', 'Requires L² approximation bounds'],
                ['Robin inequality: σ(n) < eᵞ n ln ln n', 'No', 'Requires computing σ(n) for large n'],
                ['Lagarias: σ(n) ≤ Hₙ + eᴴⁿ ln Hₙ', 'No', 'Requires harmonic number bounds'],
                ['Riemann–von Mangoldt: N(T) = (T/2π)log(T/2πe) + O(log T)', 'No', 'The O(log T) remainder is classical and unconditional; RH gives sharper conditional control'],
                ['GUE hypothesis (pair correlation)', 'Yes (Statistics)', 'NOT an equivalence — related but independent conjecture (Montgomery 1973, Odlyzko 1987)'],
              ].map(([criterion, tested, status], i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--hairline)' }}>
                  <td style={{ padding: '6px 10px', color: CYAN }}>{criterion}</td>
                  <td style={{ padding: '6px 10px', color: tested.startsWith('Yes') ? GREEN : tested === 'No' ? RED : AMBER }}>
                    {tested}
                  </td>
                  <td style={{ padding: '6px 10px', color: 'var(--faint)', fontSize: 11 }}>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Four Closure Routes */}
        <div className="card" style={{ marginTop: 32, borderLeft: `3px solid ${CYAN}` }}>
          <h3 style={{ color: CYAN }}>The Separate Twin-Ladder Shift-Bridge Closure Routes</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>
            The dedicated closure-routes page studies four formulations of the corrected
            all-shifts bridge target: Schur contractivity, de Branges positivity, a hidden-square
            factorization, and the Weil/twin-ladder form. Their equivalence uses the hypotheses
            stated there and should not be conflated with the five broad strategies above.
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>
            The all-shifts positivity target is RH-equivalent and open. At one fixed shift,
            common shifted zeros and residual multiplicities require the endpoint, coprimality,
            and bounded-type caveats recorded in the twin-ladder audit.
          </p>
          <div style={{ marginTop: 16, padding: '14px', background: CYAN_A(0.08), borderRadius: 8, border: `1px solid ${CYAN_A(0.13)}` }}>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, margin: 0 }}>
              For a detailed analysis of how these routes interlock and their mathematical equivalence, see{' '}
              <Link to="/closure-routes" style={{ color: CYAN, fontWeight: 600, textDecoration: 'underline' }}>
                Four Closure Routes
              </Link>.
            </p>
          </div>
        </div>

        {/* Related Pages */}
        <div className="card" style={{ marginTop: 24, background: BLUE_A(0.04) }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Link to="/closure-routes" style={{ color: CYAN, fontSize: 13 }}>Closure Routes (equivalence)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/spectral-attack" style={{ color: CYAN, fontSize: 13 }}>Spectral Approach (6 vectors)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/gap-closing" style={{ color: PURPLE, fontSize: 13 }}>Gap Closing (S4/S5/S7)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/formal-proof" style={{ color: GREEN, fontSize: 13 }}>Formal Proof (10 sections)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/proof-checker" style={{ color: RED, fontSize: 13 }}>Proof Checker (skeptical)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/rigor" style={{ color: AMBER, fontSize: 13 }}>Rigor (criticisms)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/cross-attack" style={{ color: CYAN, fontSize: 13 }}>Cross-Attack Efficiency (dashboard)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/rigorous-numerics-stages" style={{ color: CYAN, fontSize: 13 }}>Rigorous Numerics Stages (&sect;20)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/" style={{ color: 'var(--ink-soft)', fontSize: 13, textDecoration: 'none' }}>← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
