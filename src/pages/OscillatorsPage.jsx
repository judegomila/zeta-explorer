import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import OscillatorChainViz from '../components/OscillatorChainViz.jsx';
import EulerProductViz from '../components/EulerProductViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';

// Prime Oscillator Chain — editorial (warm) re-theme.
// Chrome only: the two interactive viz components (OscillatorChainViz,
// EulerProductViz) render unchanged; only the surrounding text/cards are re-themed.

// ── Style helpers ──────────────────────────────────────────────────────────

// Editorial card: warm paper background + hairline border, colored left rule.
function cardLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '18px 20px',
  };
}

const sectionLabel = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--faint)',
  marginBottom: 6,
};

const body = {
  color: 'var(--ink-soft)',
  fontSize: 13,
  lineHeight: 1.8,
  marginBottom: 12,
};

const stepHeading = (color) => ({
  color,
  fontSize: 14,
  fontWeight: 700,
  margin: '18px 0 8px',
});

export default function OscillatorsPage() {
  const [sliderSigma, setSliderSigma] = useState(0.5);
  const sliderQ = 1 / (2 * sliderSigma);
  const sliderRegime =
    sliderQ > 1.05 ? 'underdamped' : sliderQ < 0.95 ? 'overdamped' : 'critical';
  const sliderColor =
    sliderRegime === 'underdamped' ? 'var(--blue)'
    : sliderRegime === 'overdamped' ? 'var(--brass-dk)'
    : 'var(--green)';

  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>Prime oscillator chain · Euler product as an LC ladder</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Prime Oscillator Chain</h1>
          <AnimationEmbed id="oscillators" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            The Euler product decomposes the zeta function into a cascade of oscillator stages,
            one per prime. Two ladders — direct and dual — are connected via a lossless bridge
            that encodes the functional equation.
          </p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <BlockMath tex={"\\zeta(s) = \\prod_{p} \\underbrace{\\frac{1}{1 - p^{-s}}}_{H_p(s)} \\quad \\text{where each } H_p \\text{ is an LC oscillator } (L_p = \\log p,\\; C_p = 1/\\log p,\\; \\omega_0 = 1)"} />
        </div>

        {/* ── Building the Model ─────────────────────────────────────────── */}
        <div style={{ ...cardLeft('var(--blue)'), marginBottom: 32 }}>
          <div style={sectionLabel}>Building the model</div>
          <h2 style={{ color: 'var(--blue)', fontSize: 18, marginBottom: 12, marginTop: 0 }}>
            From Euler factor to LC oscillator
          </h2>
          <p style={body}>
            The Twin-Ladder Bridge framework constructs a physical model step by step, mapping each
            Euler factor to a linear system and then identifying it with an LC resonator. The three
            steps below run from transfer function to component values to quality factor.
          </p>

          <h3 style={stepHeading('var(--blue)')}>Step 1 — From Euler factor to transfer function</h3>
          <p style={body}>
            Read each Euler factor <InlineMath tex={"H_p(s) = 1/(1-p^{-s})"} /> as the transfer function
            of a linear time-invariant system. In the Laplace domain the input-output relation is:
          </p>
          <BlockMath tex={"Y(s) = H_p(s) \\cdot X(s) = \\frac{1}{1 - p^{-s}} \\cdot X(s)"} />
          <p style={body}>
            Expanding the geometric series gives the impulse response (the inverse Laplace transform of <InlineMath tex={"H_p"} />) —
            a train of delays spaced by <InlineMath tex={"\\log p"} />:
          </p>
          <BlockMath tex={"h_p(t) = \\sum_{k=0}^{\\infty} \\delta(t - k\\log p)"} />
          <p style={body}>
            The poles of <InlineMath tex={"H_p(s)"} /> sit where <InlineMath tex={"p^{-s} = 1"} />, i.e. where <InlineMath tex={"e^{-s \\log p} = 1"} />:
          </p>
          <BlockMath tex={"\\text{Poles at } s = \\frac{2\\pi i k}{\\log p}, \\quad k \\in \\mathbb{Z}"} />
          <p style={body}>
            These poles are equally spaced along the imaginary axis with spacing <InlineMath tex={"2\\pi / \\log p"} />,
            exactly like the resonances of a periodic system with fundamental period <InlineMath tex={"\\log p"} />.
          </p>

          <h3 style={stepHeading('var(--green)')}>Step 2 — LC resonator mapping</h3>
          <p style={body}>
            Writing the Euler factor with an explicit exponential makes the oscillator structure visible:
          </p>
          <BlockMath tex={"H_p(s) = \\frac{1}{1 - e^{-s \\cdot \\log p}}"} />
          <p style={body}>
            Compare with the impedance of a series LC circuit driven at frequency <InlineMath tex={"\\omega"} />:
          </p>
          <BlockMath tex={"Z_{LC}(\\omega) = \\frac{j\\omega L}{1 - \\omega^2 LC}"} />
          <p style={body}>
            Matching the denominator structure and the pole spacing fixes the component values:
          </p>
          <BlockMath tex={"L_p = \\log p, \\quad C_p = \\frac{1}{\\log p}, \\quad Z_0 = \\log p"} />
          <p style={body}>
            The resonant frequency is <InlineMath tex={"\\omega_0 = 1/\\sqrt{L_p C_p} = 1"} /> for every prime — all oscillators
            resonate at unity frequency, but with different characteristic impedances <InlineMath tex={"Z_0 = \\log p"} />.
          </p>

          <h3 style={stepHeading('var(--brass-dk)')}>Step 3 — Quality factor and critical coupling</h3>
          <p style={body}>
            The quality factor measures how sharply an oscillator resonates. For the Euler factor
            at <InlineMath tex={"s = \\sigma + it"} />, the damping is set by <InlineMath tex={"\\sigma"} />:
          </p>
          <BlockMath tex={"Q_p(\\sigma) = \\frac{1}{2\\sigma}"} />
          <p style={{ ...body, marginBottom: 0 }}>
            This is <em>prime-independent</em>: every oscillator in the chain has the same Q at a
            given <InlineMath tex={"\\sigma"} />. As <InlineMath tex={"\\sigma \\to 0"} />, we have <InlineMath tex={"Q \\to \\infty"} /> (lossless oscillator).
            On the critical line <InlineMath tex={"\\sigma = 1/2"} />, <InlineMath tex={"Q_p = 1"} /> for all primes — this is
            the <em>critical coupling</em> condition, where each oscillator sits at the boundary between
            underdamped and overdamped behavior. That this coupling is simultaneous across all primes
            is the circuit-theoretic signature of the critical line.
          </p>
        </div>

        {/* ── Interactive: chain network (viz preserved) ─────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 8, marginBottom: 8 }}>
          Direct &amp; dual ladder network with lossless bridge
        </h2>
        <p style={{ ...body, maxWidth: 760 }}>
          Click any oscillator node to see its properties. The direct ladder computes <InlineMath tex={"\\zeta(s)"} />,
          the dual ladder computes <InlineMath tex={"\\zeta(1-s)"} />. They connect through the bridge.
          At <InlineMath tex={"\\sigma = 0.5"} />, the bridge is lossless (<InlineMath tex={"|\\chi| = 1"} />).
        </p>
        <OscillatorChainViz />

        <div style={{ margin: '40px 0 32px' }}>
          <BlockMath tex={"Q_p(\\sigma) = \\frac{1}{2\\sigma} \\quad \\Rightarrow \\quad Q_p(1/2) = 1 \\text{ for ALL primes (critical coupling)}"} />
          <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--faint)', fontStyle: 'italic', lineHeight: 1.7 }}>
            Note: this Q-factor arises from the LC circuit analogy where <InlineMath tex={"L_p = \\log p"} />, <InlineMath tex={"C_p = 1/\\log p"} />.
            It is a property of the model, not a theorem about the Euler product itself. The
            prime-independence of Q at <InlineMath tex={"\\sigma = 1/2"} /> is suggestive but not a proof of anything about RH.
          </p>
        </div>

        {/* ── Interactive: Euler product convergence (viz preserved) ─────── */}
        <h2 className="ed-h2" style={{ marginTop: 8, marginBottom: 8 }}>Euler product convergence</h2>
        <p style={{ ...body, maxWidth: 760 }}>
          Watch the partial Euler product build up prime by prime. The rising line is the cumulative <InlineMath tex={"|\\zeta(s)|"} />;
          bars show individual factor magnitudes; the second trace is the cumulative phase. See also the{' '}
          <Link to="/viz-euler-product" style={{ color: 'var(--brass-dk)' }}>Euler product visualizer</Link>.
        </p>
        <EulerProductViz />

        {/* ── What to observe ────────────────────────────────────────────── */}
        <div style={{ ...cardLeft('var(--green)'), marginTop: 32 }}>
          <div style={sectionLabel}>Reading the two views</div>
          <h2 style={{ color: 'var(--green)', fontSize: 18, marginBottom: 12, marginTop: 0 }}>What to observe</h2>
          <ul style={{ marginLeft: 16, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 2, marginBottom: 0 }}>
            <li>
              <strong style={{ color: 'var(--blue)' }}>Chain diagram:</strong> click any oscillator node
              to inspect its <InlineMath tex={"L_p, C_p, Q_p"} /> values. At <InlineMath tex={"\\sigma = 0.5"} /> every
              node shows <InlineMath tex={"Q = 1"} /> (critical coupling) and the bridge reads LOSSLESS —
              slide <InlineMath tex={"\\sigma"} /> away to watch Q diverge and the bridge turn LOSSY.
            </li>
            <li>
              <strong style={{ color: 'var(--brass-dk)' }}>Euler product:</strong> factors above the
              unity line amplify; factors below it attenuate. The cumulative <InlineMath tex={"|\\zeta|"} /> curve
              shows how the product converges prime by prime. Near a zeta zero
              (<InlineMath tex={"t \\approx 14.13"} />), the curve plunges toward zero — slide t away to see it
              recover.
            </li>
            <li>
              <strong style={{ color: 'var(--terra-dk)' }}>Bridge symmetry:</strong> the direct and dual
              columns are mirror images at <InlineMath tex={"\\sigma = 0.5"} />. Move <InlineMath tex={"\\sigma"} /> off the
              critical line to see the asymmetry grow — node radii differ between the two ladders,
              and the bridge magnitude <InlineMath tex={"|\\chi|"} /> departs from 1.
            </li>
          </ul>
        </div>

        {/* ── Two ladders ────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>
          <div style={cardLeft('var(--blue)')}>
            <h3 style={{ color: 'var(--blue)', marginTop: 0, marginBottom: 10 }}>Direct ladder</h3>
            <p style={body}>
              Computes <InlineMath tex={"\\zeta(s)"} /> via the Euler product as a cascade of oscillators, each with
              LC resonant frequency <InlineMath tex={"\\omega_0 = 1"} /> but distinct Euler factor phase rotation
              rate <InlineMath tex={"\\log p"} />. The cascade builds up the full zeta function stage by stage.
            </p>
            <BlockMath tex={"H_{\\text{direct}}(s) = \\prod_{p \\leq P} \\frac{1}{1-p^{-s}}"} />
            <ul style={{ marginTop: 12, marginLeft: 16, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 0 }}>
              <li>Series elements: <InlineMath tex={"L_p = \\log(p)"} /></li>
              <li>Shunt elements: <InlineMath tex={"C_p = 1/\\log(p)"} /></li>
              <li>Coupling: via prime gaps</li>
              <li>Each stage adds one Euler factor</li>
            </ul>
          </div>
          <div style={cardLeft('var(--brass-dk)')}>
            <h3 style={{ color: 'var(--brass-dk)', marginTop: 0, marginBottom: 10 }}>Dual ladder</h3>
            <p style={body}>
              Computes <InlineMath tex={"\\zeta(1-s)"} /> at the reflected point. The functional equation connects
              direct and dual via the bridge factor <InlineMath tex={"\\chi(s)"} />.
            </p>
            <BlockMath tex={"H_{\\text{dual}}(s) = \\prod_{p \\leq P} \\frac{1}{1-p^{-(1-s)}}"} />
            <ul style={{ marginTop: 12, marginLeft: 16, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 0 }}>
              <li>Mirror of the direct ladder at <InlineMath tex={"s \\to 1-s"} /></li>
              <li>Same primes, different operating point</li>
              <li>Symmetric with direct at <InlineMath tex={"\\sigma = 1/2"} /></li>
              <li>Conjugate-matches direct on critical line (<InlineMath tex={"Z_{\\text{dual}} = \\bar{Z}_{\\text{dir}}"} /> by Schwarz reflection)</li>
            </ul>
          </div>
        </div>

        {/* ── The lossless bridge ────────────────────────────────────────── */}
        <div style={{ ...cardLeft('var(--terra-dk)'), marginTop: 24 }}>
          <h3 style={{ color: 'var(--terra-dk)', marginTop: 0, marginBottom: 10 }}>The lossless bridge</h3>
          <p style={body}>
            The prefactor in the functional equation <InlineMath tex={"\\chi(s) = 2^s \\pi^{s-1} \\sin(\\pi s/2)\\,\\Gamma(1-s)"} /> acts as a
            lossless two-port network connecting the ladders. It has <InlineMath tex={"|\\chi(\\tfrac{1}{2}+it)| = 1"} /> for all t.
          </p>
          <BlockMath tex={"\\zeta(s) = \\chi(s) \\cdot \\zeta(1-s), \\quad |\\chi(1/2+it)| = 1"} />
          <BlockMath tex={"S_{\\text{bridge}} = \\begin{pmatrix} \\Gamma & \\tau \\\\ \\tau & -\\Gamma \\end{pmatrix}, \\quad \\Gamma = \\frac{1-|\\chi|}{1+|\\chi|},\\; \\tau = \\sqrt{1-\\Gamma^2}, \\quad S^\\dagger S = I \\;(\\text{lossless}),\\; \\Gamma = 0 \\text{ at } \\sigma = \\tfrac{1}{2}"} />
        </div>

        {/* ── Resonance & Q-factor + interactive slider ──────────────────── */}
        <div style={{ ...cardLeft('var(--green)'), marginTop: 24 }}>
          <h3 style={{ color: 'var(--green)', fontSize: 15, marginTop: 0, marginBottom: 10 }}>
            Resonance conditions and quality factor
          </h3>
          <p style={body}>
            Each prime oscillator has a <strong>quality factor</strong> measuring how sharply tuned its resonance is.
            Since <InlineMath tex={"\\omega_0 = 1/\\sqrt{LC} = 1"} /> for all primes and the bandwidth is <InlineMath tex={"2\\sigma"} />:
          </p>
          <BlockMath tex={"Q(\\sigma) = \\frac{\\omega_0}{\\Delta\\omega} = \\frac{1}{2\\sigma}"} />
          <p style={body}>
            This is <em>prime-independent</em>: every oscillator in the chain has the same Q at a given <InlineMath tex={"\\sigma"} />.
            At <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, <InlineMath tex={"Q = 1"} /> for all primes — the critical coupling condition.
            The simultaneous Q = 1 across all primes is the circuit-theoretic signature of the critical line.
          </p>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { sigma: '1/4', Q: '2', label: 'underdamped', color: 'var(--blue)' },
              { sigma: '1/2', Q: '1', label: 'critical', color: 'var(--green)' },
              { sigma: '1', Q: '0.5', label: 'overdamped', color: 'var(--brass-dk)' },
            ].map(({ sigma, Q, label, color }) => (
              <div key={sigma} style={{ padding: '8px 12px', background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 6, textAlign: 'center' }}>
                <div style={{ color, fontSize: 16, fontWeight: 700 }}>σ = {sigma}</div>
                <div style={{ color: 'var(--faint)', fontSize: 11 }}>Q = {Q} ({label})</div>
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--faint)', fontSize: 12, marginTop: 12, lineHeight: 1.7 }}>
            The cascade of equal-Q oscillators produces a "filter bank" whose composite
            response is the zeta function. Although Q is prime-independent, each oscillator
            contributes a different characteristic impedance <InlineMath tex={"Z_0 = \\log p"} />,
            adding distinct spectral detail per prime.
          </p>

          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--paper)', borderRadius: 8, border: `1px solid ${sliderColor}` }}>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 8 }}>
              Interactive: drag <strong style={{ color: 'var(--ink)' }}>σ</strong> to explore the Q-factor regime
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--faint)', minWidth: 60 }}>σ = {sliderSigma.toFixed(2)}</span>
              <input
                type="range"
                min="0.05"
                max="1.5"
                step="0.01"
                value={sliderSigma}
                onChange={e => setSliderSigma(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: sliderColor }}
              />
              <span style={{ fontSize: 12, color: 'var(--faint)', minWidth: 60, textAlign: 'right' }}>σ = 1.50</span>
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: sliderColor, minWidth: 90 }}>
                Q = {sliderQ.toFixed(3)}
              </div>
              <div style={{ padding: '4px 10px', borderRadius: 4, background: 'var(--paper2)', border: `1px solid ${sliderColor}`, color: sliderColor, fontSize: 12, fontWeight: 600 }}>
                {sliderRegime}
              </div>
              {Math.abs(sliderSigma - 0.5) < 0.01 && (
                <div style={{ fontSize: 12, color: 'var(--green)', fontStyle: 'italic' }}>
                  ← critical line: Q = 1 exactly
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer / related pages ─────────────────────────────────────── */}
        <div style={{ ...cardLeft('var(--brass)'), marginTop: 24 }}>
          <div style={sectionLabel}>Related pages</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8, alignItems: 'center' }}>
            <Link to="/hamiltonian" style={{ color: 'var(--blue)', fontSize: 13, textDecoration: 'none' }}>Hamiltonian (spectral decomposition)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/zeta" style={{ color: 'var(--brass-dk)', fontSize: 13, textDecoration: 'none' }}>Zeta Function</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/waves" style={{ color: 'var(--terra-dk)', fontSize: 13, textDecoration: 'none' }}>Wave Simulation</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/fourier" style={{ color: 'var(--brass)', fontSize: 13, textDecoration: 'none' }}>Fourier (frequency analysis)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/modes" style={{ color: 'var(--blue)', fontSize: 13, textDecoration: 'none' }}>Oscillator Modes</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/statistics" style={{ color: 'var(--green)', fontSize: 13, textDecoration: 'none' }}>Statistics (GUE connection)</Link>
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
            <Link to="/" style={{ color: 'var(--brass)', fontSize: 13, textDecoration: 'none' }}>← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
