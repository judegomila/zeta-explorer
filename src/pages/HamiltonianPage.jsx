import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import HamiltonianViz from '../components/HamiltonianViz.jsx';
import ExplicitFormulaViz from '../components/ExplicitFormulaViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED, alpha } from '../styles/tokens.js';

// Hamiltonian & Energy Landscape — editorial (warm) re-theme.
// Full-width dashboard. The two real viz components (HamiltonianViz,
// ExplicitFormulaViz) are preserved exactly; only chrome is re-themed.

// ── Style helpers ──────────────────────────────────────────────────────────

// Warm editorial card: paper background, hairline border, colored left rule.
function cardLeft(color, extra = {}) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 18px',
    ...extra,
  };
}

const h3Style = (color) => ({ color, fontSize: 15, marginBottom: 8 });

const bodyText = {
  color: 'var(--ink-soft)',
  fontSize: 14,
  lineHeight: 1.8,
};

const sectionLead = {
  color: 'var(--ink-soft)',
  fontSize: 15,
  lineHeight: 1.6,
  maxWidth: 760,
};

const vizTitle = {
  fontFamily: 'var(--ed-mono, var(--font-mono))',
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--ink)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 6,
};

const vizSubtitle = {
  fontSize: 12,
  color: 'var(--faint)',
  lineHeight: 1.6,
  marginBottom: 12,
  maxWidth: 760,
};

const twoCol = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: 16,
};

// Palette map: legacy hex accents → warm editorial tokens.
const KINETIC = 'var(--blue)';      // was #3b82f6
const MISMATCH = 'var(--brass-dk)'; // was #f59e0b
const BRIDGE = 'var(--terra-dk)';   // was #8b5cf6 (coupling / purple)
const TOTAL = 'var(--green)';       // was #10b981

// ── The page ───────────────────────────────────────────────────────────────

export default function HamiltonianPage() {
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>Hamiltonian · energy minimized at σ = 1/2</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>

        {/* ── Intro ──────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Hamiltonian &amp; Energy Landscape</h1>
          <AnimationEmbed id="hamiltonian" />
          <p style={sectionLead}>
            The total system Hamiltonian — combining kinetic energy of oscillators, impedance mismatch
            potential, and bridge coupling energy — achieves its minimum at the critical line <InlineMath tex={"\\sigma = 1/2"} />.
          </p>
        </div>

        <BlockMath tex={"\\mathcal{H}(s) = \\underbrace{T(s)}_{\\text{kinetic}} + \\underbrace{V_{\\text{mismatch}}(s)}_{\\text{impedance}} + \\underbrace{V_{\\text{bridge}}(s)}_{\\text{coupling}}"} />

        <p style={{ ...sectionLead, marginTop: 16 }}>
          The three terms carry the whole story. Each nontrivial zeta zero sits at a height <InlineMath tex={"t = \\gamma_n"} />;
          fix that height and sweep the real part <InlineMath tex={"\\sigma"} /> and the energy dips to a well whose floor
          lands on <InlineMath tex={"\\sigma = 1/2"} />. Reading the components apart shows why: the kinetic part balances,
          the mismatch bottoms out, and the bridge coupling vanishes — all at the same <InlineMath tex={"\\sigma"} />.
        </p>

        {/* ── Reading guide ──────────────────────────────────────────────── */}
        <div className="card" style={{ ...cardLeft(TOTAL), marginTop: 24 }}>
          <h3 style={h3Style(TOTAL)}>What to Explore in Each Visualization</h3>
          <p style={{ ...bodyText, marginTop: 12 }}>
            <strong style={{ color: KINETIC }}>Hamiltonian Energy vs σ</strong> — drag the t slider to a zeta
            zero (<InlineMath tex={"t \\approx 14.13, 21.02, 25.01"} />) and watch the green total-energy curve develop
            a sharp minimum at <InlineMath tex={"\\sigma = 0.5"} />. Compare the three components: the blue kinetic energy
            is symmetric about <InlineMath tex={"\\sigma = 0.5"} />, the orange mismatch is minimized there (conjugate-matched, not zero), and the purple
            bridge penalty is zero exactly on the critical line:
          </p>
          <BlockMath tex={"|Z_{\\text{dir}} - Z_{\\text{dual}}| = 2|\\text{Im}\\,Z| \\quad \\text{(residual mismatch)}"} />
          <p style={{ ...bodyText, marginTop: 8 }}>
            Increase primes to see the valley deepen and narrow.
          </p>
          <p style={{ ...bodyText, marginTop: 8 }}>
            <strong style={{ color: MISMATCH }}>Explicit Formula ψ(x)</strong> — start with few zeros and watch
            the gold spectral reconstruction deviate from the blue staircase. Add more zeros to see it converge,
            filling in the steps one oscillation at a time. The shaded area between the PNT line and the
            spectral approximation shows the error the zeros collectively correct. Near prime powers, the
            staircase jumps by <InlineMath tex={"\\log p"} /> — look for how each zero's sinusoid lines up with those jumps.
          </p>
        </div>

        {/* ── Viz 1: Hamiltonian energy ──────────────────────────────────── */}
        <div style={{ marginTop: 32 }}>
          <div style={vizTitle}>Hamiltonian Energy vs <InlineMath tex={"\\sigma"} /> at Fixed t</div>
          <div style={vizSubtitle}>
            Drag t to see how the energy profile changes. The minimum consistently sits near <InlineMath tex={"\\sigma = 0.5"} />.
            Green = total, Blue = kinetic, Orange = mismatch, Purple = bridge coupling.
          </div>
          <HamiltonianViz />
        </div>

        {/* ── Two components ─────────────────────────────────────────────── */}
        <div style={{ ...twoCol, marginTop: 32 }}>
          <div className="card" style={cardLeft(KINETIC)}>
            <h3 style={h3Style(KINETIC)}>Kinetic Energy <InlineMath tex="T(s)" /></h3>
            <BlockMath tex={"T(s) = \\sum_p \\frac{1}{2}\\log p \\cdot \\left(|H_p(s)|^2 + |H_p(1-s)|^2\\right)"} />
            <p style={{ ...bodyText, marginTop: 8 }}>
              The total energy stored in oscillator motions across both ladders. Each prime
              contributes proportionally to its inductance <InlineMath tex={"\\log(p)"} /> times the squared magnitude
              of its transfer function.
            </p>
          </div>
          <div className="card" style={cardLeft(MISMATCH)}>
            <h3 style={h3Style(MISMATCH)}>Mismatch Potential <InlineMath tex="V(s)" /></h3>
            <BlockMath tex={"V_{\\text{mismatch}} = \\frac{1}{2}|Z_{\\text{direct}} - Z_{\\text{dual}}|^2"} />
            <p style={{ ...bodyText, marginTop: 8 }}>
              Penalty for impedance mismatch between direct and dual ladders. Minimized (but not zero)
              at <InlineMath tex={"\\sigma = 1/2"} /> where Schwarz reflection gives <InlineMath tex={"Z_{\\text{dual}} = \\overline{Z_{\\text{dir}}}"} /> (conjugate match),
              leaving residual <InlineMath tex={"|Z_{\\text{dir}} - Z_{\\text{dual}}| = 2|\\text{Im}\\,Z|"} />.
            </p>
          </div>
        </div>

        {/* ── Why sigma = 1/2 minimizes (summary + caveat) ───────────────── */}
        <div className="card" style={{ ...cardLeft(TOTAL), marginTop: 24 }}>
          <h3 style={h3Style(TOTAL)}>Why <InlineMath tex={"\\sigma = 1/2"} /> Minimizes the Hamiltonian</h3>
          <BlockMath tex={"\\frac{\\partial \\mathcal{H}}{\\partial \\sigma}\\bigg|_{\\sigma=1/2} = 0 \\quad \\text{and} \\quad \\frac{\\partial^2 \\mathcal{H}}{\\partial \\sigma^2}\\bigg|_{\\sigma=1/2} > 0"} />
          <p style={{ ...bodyText, marginTop: 12 }}>
            At <InlineMath tex={"\\sigma = 1/2"} />, three conditions simultaneously hold:
          </p>
          <ol style={{ ...bodyText, margin: '12px 0 0 20px' }}>
            <li><strong style={{ color: KINETIC }}>Balance:</strong> Direct and dual ladders are symmetric, so kinetic energy is balanced</li>
            <li><strong style={{ color: MISMATCH }}>Conjugate match:</strong> <InlineMath tex={"Z_{\\text{dual}} = \\overline{Z_{\\text{dir}}}"} /> by Schwarz reflection (since <InlineMath tex={"1 - s = \\bar{s}"} /> at <InlineMath tex={"\\sigma = 1/2"} />), so <InlineMath tex={"V_{\\text{mismatch}}"} /> is minimized</li>
            <li><strong style={{ color: BRIDGE }}>Lossless:</strong> <InlineMath tex={"|\\chi(1/2+it)| = 1"} />, so <InlineMath tex={"V_{\\text{bridge}} = 0"} /></li>
          </ol>
          <p style={{ ...bodyText, marginTop: 12 }}>
            This is an exploratory analogy inspired by the Hilbert-Pólya conjecture. The conjugate matching
            and bridge unitarity at <InlineMath tex={"\\sigma = 1/2"} /> follow from the functional equation, which is a theorem.
            However, this model does not constitute a proof of RH — the Hamiltonian is constructed to exhibit
            this minimum, and deriving the zero locations from it would require establishing that the
            oscillator chain's eigenvalues are precisely the zeta zeros, which remains an open problem.
          </p>
        </div>

        {/* ── Explicit formula section ───────────────────────────────────── */}
        <div style={{ marginTop: 48 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Explicit Formula: The Impulse Response</h1>
          <p style={sectionLead}>
            Von Mangoldt's explicit formula expresses the prime counting function <InlineMath tex={"\\psi(x)"} /> as a sum
            over zeta zeros — each zero contributing a damped sinusoid. In our model, this corresponds
            to the step response of the prime oscillator chain.
          </p>
          <BlockMath tex={"\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} - \\log 2\\pi - \\frac{1}{2}\\log(1 - x^{-2})"} />
          <p style={{ ...sectionLead, marginTop: 16 }}>
            Read left to right: the prime staircase <InlineMath tex={"\\psi(x)"} /> equals its smooth trend <InlineMath tex={"x"} /> minus
            a correction assembled from the zeros. Each zero <InlineMath tex={"\\rho"} /> supplies one oscillation; summing
            them turns the smooth line back into the exact staircase. The visualization below plays that assembly
            out as you add zeros.
          </p>

          <div style={{ marginTop: 20 }}>
            <div style={vizTitle}>Chebyshev <InlineMath tex={"\\psi(x)"} /> and Spectral Reconstruction</div>
            <div style={vizSubtitle}>
              Blue staircase: actual <InlineMath tex={"\\psi(x)"} />. Gold curve: reconstruction from zeta zeros via the
              explicit formula. Dashed: the asymptote x (PNT). Add more zeros for better fit.
            </div>
            <div
              className="card"
              style={cardLeft(MISMATCH, {
                marginTop: 12,
                marginBottom: 12,
                background: alpha(ED.brassDeco, 0.06),
                padding: '10px 14px',
              })}
            >
              <span style={{ color: MISMATCH, fontWeight: 700, fontSize: 12 }}>Note: </span>
              <span style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.6 }}>
                The explicit formula is a proven identity — it holds unconditionally. The zeros used here
                are tabulated values with <InlineMath tex={"\\sigma = 1/2"} /> as an <strong style={{ color: 'var(--ink)' }}>input assumption</strong>, not
                a consequence of the Hamiltonian construction. Placing zeros on the critical line is
                assumed from numerical tables (Odlyzko et al.), not derived from the Twin-Ladder Bridge model.
                Adding more zeros shows convergence of the known explicit formula, not evidence for RH.
              </span>
            </div>
            <ExplicitFormulaViz />
          </div>
        </div>

        {/* ── Decomposition + convergence ────────────────────────────────── */}
        <div style={{ ...twoCol, marginTop: 32 }}>
          <div className="card" style={cardLeft(KINETIC)}>
            <h3 style={h3Style(KINETIC)}>Spectral Decomposition</h3>
            <BlockMath tex={"\\frac{x^{\\rho}}{\\rho} + \\frac{x^{\\bar{\\rho}}}{\\bar{\\rho}} = \\frac{2x^{1/2}}{\\sqrt{\\gamma^2 + 1/4}}\\,\\cos\\!\\bigl(\\gamma\\log x - \\arg\\rho\\bigr)"} />
            <p style={{ ...bodyText, marginTop: 8 }}>
              Each conjugate pair of nontrivial zeros <InlineMath tex={"\\rho, \\bar{\\rho} = \\tfrac{1}{2}\\pm i\\gamma"} /> contributes
              a damped sinusoid to <InlineMath tex={"\\psi(x)"} />.
              The frequency is <InlineMath tex={"\\gamma"} /> (the imaginary part), the envelope decays
              as <InlineMath tex="x^{1/2}" /> (from <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />), and the amplitude falls
              off as <InlineMath tex={"2/|\\rho|"} />. Higher zeros contribute smaller, faster oscillations —
              fine detail in the prime staircase.
            </p>
          </div>
          <div className="card" style={cardLeft(MISMATCH)}>
            <h3 style={h3Style(MISMATCH)}>Convergence &amp; Error</h3>
            <BlockMath tex={"\\psi(x) - x = -\\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} + O(1)"} />
            <p style={{ ...bodyText, marginTop: 8 }}>
              The error between <InlineMath tex={"\\psi(x)"} /> and its leading term <InlineMath tex="x" /> is entirely
              controlled by zeta zeros. If all zeros satisfy <InlineMath tex={"\\text{Re}(\\rho) = \\tfrac{1}{2}"} /> (RH),
              the error is <InlineMath tex={"O(\\sqrt{x}\\,\\log^2 x)"} /> — the best possible bound. Each zero
              off the critical line would contribute a term decaying more slowly
              than <InlineMath tex={"\\sqrt{x}"} />, degrading the approximation.
            </p>
          </div>
        </div>

        {/* ── Circuit interpretation ─────────────────────────────────────── */}
        <div className="card" style={{ ...cardLeft(TOTAL), marginTop: 24 }}>
          <h3 style={h3Style(TOTAL)}>Circuit Interpretation: Impulse Response</h3>
          <p style={{ ...bodyText, marginTop: 12 }}>
            In the oscillator chain model, the explicit formula is the system's <strong>impulse response</strong>.
            Hitting the ladder network with a delta function excites all its resonant modes — one per
            zeta zero. The output is the superposition of all these ringing modes, each decaying at a rate
            set by <InlineMath tex={"\\sigma"} />. If the system is <em>lossless</em> (<InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> for
            all modes), every mode decays at exactly the same rate, and the step response reconstructs the
            prime staircase with optimal fidelity.
          </p>
        </div>

        {/* ── Weil connection ────────────────────────────────────────────── */}
        <div className="card" style={{ ...cardLeft(BRIDGE), marginTop: 24 }}>
          <h3 style={{ ...h3Style(BRIDGE), fontSize: 14 }}>Connection: Weil Quadratic Form (Weil&apos;s criterion)</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            The Hamiltonian minimization at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> has a deep
            connection to the <strong>Weil quadratic form</strong>. Weil&apos;s classical criterion states
            that the positivity condition <InlineMath tex={"W(g \\star \\tilde{g}) \\geq 0"} /> is
            equivalent to RH; Connes (2026) engaged this criterion by extremizing the form using only
            primes {"<"} 13, approximating 50 zeros with accuracy up
            to <InlineMath tex={"10^{-55}"} />. Because the criterion is an equivalence, establishing
            the positivity is not a route around RH — it is RH restated. In Twin-Ladder Bridge terms: the Hamiltonian <InlineMath tex={"\\mathcal{H}"} /> being
            bounded below is the physical manifestation of Weil positivity. The explicit formula
            that drives the spectral decomposition above is the <em>same</em> formula that defines
            the Weil kernel. See the{' '}
            <Link to="/connes-adelic" style={{ color: BRIDGE }}>Connes adelic</Link> page for more.
          </p>
        </div>

        {/* ── Berry-Keating ──────────────────────────────────────────────── */}
        <div className="card" style={{ ...cardLeft(BRIDGE), marginTop: 24 }}>
          <h3 style={h3Style(BRIDGE)}>Berry-Keating Semiclassical Quantization</h3>
          <p style={{ ...bodyText, marginTop: 12 }}>
            Berry and Keating (1999) proposed the simplest Hamiltonian whose spectrum is related to the
            zeta zeros (see the{' '}
            <Link to="/berry-keating-xp" style={{ color: BRIDGE }}>Berry–Keating xp</Link> page):
          </p>
          <BlockMath tex={"H = xp"} />
          <p style={{ ...bodyText, marginTop: 12 }}>
            Under semiclassical quantization the trace formula becomes a sum over prime periodic orbits:
          </p>
          <BlockMath tex={"\\sum_{\\rho} h(\\gamma_\\rho) = \\sum_p \\sum_{k=1}^{\\infty} \\frac{\\log p}{p^{k/2}}\\, g(k \\log p)"} />
          <p style={{ ...bodyText, marginTop: 12 }}>
            Each prime <InlineMath tex={"p"} /> defines a periodic orbit of
            period <InlineMath tex={"T_p = \\log p"} /> and
            action <InlineMath tex={"S_p = \\tfrac{1}{2}\\log p"} />.
            In the semiclassical heuristic, the Maslov index correction would reshape the
            eigenvalue condition into the <InlineMath tex={"\\tfrac{1}{4} + t^2"} /> form, so that
            the quantized energies <InlineMath tex={"E_n"} /> would correspond to the nontrivial
            zeros. This is a model-level analogy, not an established quantization: no self-adjoint
            realization of <InlineMath tex={"xp"} /> with the zeta zeros as spectrum is known (see{' '}
            <Link to="/berry-keating-xp" style={{ color: BRIDGE }}>Berry–Keating xp</Link> and{' '}
            <Link to="/what-we-know" style={{ color: BRIDGE }}>what we know</Link>).
          </p>
          <BlockMath tex={"E_n \\;\\longleftrightarrow\\; \\rho_n = \\tfrac{1}{2} + i\\gamma_n"} />
          <p style={{ ...bodyText, marginTop: 12 }}>
            <strong>Connection to the Twin-Ladder Bridge model:</strong> the <InlineMath tex={"xp"} /> Hamiltonian is the
            continuum limit of the discrete ladder Hamiltonian used in the prime oscillator chain. In
            the Twin-Ladder Bridge picture every prime contributes a separate oscillator; taking the product over all
            primes and passing to the continuum formally recovers the Berry-Keating operator (a
            heuristic correspondence, subject to the same no-go).
          </p>
        </div>

        {/* ── Why sigma = 1/2 minimizes (detailed) ───────────────────────── */}
        <div className="card" style={{ ...cardLeft(KINETIC), marginTop: 24 }}>
          <h3 style={h3Style(KINETIC)}>Why <InlineMath tex={"\\sigma = 1/2"} /> Minimizes the Hamiltonian</h3>
          <p style={{ ...bodyText, marginTop: 12 }}>
            The Twin-Ladder Bridge Hamiltonian decomposes into kinetic and potential parts:
          </p>
          <BlockMath tex={"\\mathcal{H}(\\sigma, t) = T(\\sigma, t) + V(\\sigma, t)"} />

          <ol style={{ ...bodyText, margin: '12px 0 0 20px' }}>
            <li>
              <strong style={{ color: KINETIC }}>Zero potential at <InlineMath tex={"\\sigma = 1/2"} />:</strong>{" "}
              The bridge factor <InlineMath tex={"\\chi(s)"} /> satisfies <InlineMath tex={"|\\chi(\\tfrac{1}{2}+it)| = 1"} /> (unitarity),
              so <InlineMath tex={"V = 0"} /> on the critical line.
            </li>
            <li style={{ marginTop: 8 }}>
              <strong style={{ color: KINETIC }}>Minimum kinetic curvature:</strong>{" "}
              The kinetic term
              <BlockMath tex={"T = \\sum_p \\frac{(\\log p)^2\\, p^{-2\\sigma}}{(1 - p^{-2\\sigma})^2}"} />
              has its minimum curvature at <InlineMath tex={"\\sigma = 1/2"} />, where the oscillator amplitudes
              are balanced between the direct and dual ladders.
            </li>
            <li style={{ marginTop: 8 }}>
              <strong style={{ color: KINETIC }}>Convexity:</strong>{" "}
              The second variation is strictly positive at the critical line:
              <BlockMath tex={"\\frac{\\partial^2 \\mathcal{H}}{\\partial \\sigma^2}\\bigg|_{\\sigma = 1/2} > 0"} />
              confirming that <InlineMath tex={"\\sigma = 1/2"} /> is a true minimum, not merely a saddle point.
            </li>
            <li style={{ marginTop: 8 }}>
              <strong style={{ color: KINETIC }}>Restoring force off the critical line:</strong>{" "}
              When <InlineMath tex={"\\sigma \\neq 1/2"} />, the bridge factor
              satisfies <InlineMath tex={"|\\chi(s)| \\neq 1"} />, so <InlineMath tex={"V > 0"} />.
              This creates a restoring potential that pushes the system back
              toward <InlineMath tex={"\\sigma = 1/2"} />.
            </li>
            <li style={{ marginTop: 8 }}>
              <strong style={{ color: KINETIC }}>Mexican-hat profile:</strong>{" "}
              Along the <InlineMath tex={"\\sigma"} />-axis the total Hamiltonian has a "Mexican hat" potential
              profile — a ring of minima at <InlineMath tex={"\\sigma = 1/2"} /> for
              every <InlineMath tex={"t = \\gamma_n"} />, with the potential rising symmetrically on both sides.
            </li>
          </ol>
        </div>

        {/* ── Related pages ──────────────────────────────────────────────── */}
        <div className="card" style={{ ...cardLeft('var(--brass)'), marginTop: 24 }}>
          <div style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: 'var(--faint)',
            marginBottom: 10,
          }}>
            Related Pages
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link to="/oscillators" style={{ color: 'var(--blue)', fontSize: 13, textDecoration: 'none' }}>→ Prime Oscillators</Link>
            <Link to="/gap-closing" style={{ color: 'var(--terra-dk)', fontSize: 13, textDecoration: 'none' }}>→ Gap Closing (S5 operator)</Link>
            <Link to="/spectral-attack" style={{ color: 'var(--blue)', fontSize: 13, textDecoration: 'none' }}>→ Spectral Approach (unified potential)</Link>
            <Link to="/formal-proof" style={{ color: 'var(--green)', fontSize: 13, textDecoration: 'none' }}>→ Formal Proof (S6 status)</Link>
            <Link to="/simulator" style={{ color: 'var(--brass-dk)', fontSize: 13, textDecoration: 'none' }}>→ Simulator (gradient descent)</Link>
            <Link to="/" style={{ color: 'var(--ink-soft)', fontSize: 13, textDecoration: 'none' }}>← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
