import React from 'react';
import { Link } from 'react-router-dom';
import SupercriticalViz from '../components/SupercriticalViz.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';

// Supercritical Phase Explorer — Bost-Connes / primon-gas thermodynamic lens
// on zeta beyond the critical strip. Editorial (warm) re-theme: identical
// content, math, and clarity flags; SupercriticalViz kept exactly as-is.

export default function SupercriticalPage() {
  const [numSigma, setNumSigma] = React.useState(1.5);

  function computeThermo(sigma) {
    const PRIMES = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,
      101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199];
    function logZ(s) {
      return PRIMES.reduce((acc, p) => acc - Math.log(1 - Math.pow(p, -s)), 0);
    }
    const h = 1e-3;
    const lz = logZ(sigma);
    const lz1 = logZ(sigma + h);
    const lz2 = logZ(sigma - h);
    const dlz = (lz1 - lz2) / (2 * h);
    const d2lz = (lz1 - 2 * lz + lz2) / (h * h);
    return {
      F: (-lz / sigma).toFixed(4),
      S: (lz - sigma * dlz).toFixed(4),
      Cv: (sigma * sigma * d2lz).toFixed(4),
      P: (lz / PRIMES.length).toFixed(4),
    };
  }

  const thermo = computeThermo(numSigma);

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <HonestCeilingBanner
          variant="ESTIMATE"
          title="Scope: this page shows a finite-prime ESTIMATE and quotes cited Λ bounds — it produces neither"
          body={
            'Two clarity flags for this page. (a) The numeric thermodynamic panel uses a partial Euler product ' +
            'truncated at primes ≤ 199; that finite-N sum is an ESTIMATE of the primon-gas quantities (and only ' +
            'genuinely convergent for σ > 1), never a rigorous bound on ζ. (b) The de Bruijn-Newman bound ' +
            'Λ ≤ 0.2 (Platt-Trudgian/Polymath15) and Λ ≥ 0 (Rodgers-Tao) shown below are cited peer-reviewed ' +
            'results — see /lambda-bounds and the /route-map — not outputs of this thermodynamic picture, which is ' +
            'an interpretive lens.'
          }
        />

        <div className="card" style={{ marginTop: 16, borderColor: 'var(--terra-dk)', background: 'color-mix(in srgb, var(--series-2) 6%, transparent)' }}>
          <span style={{
            display: 'inline-block', padding: '2px 8px', borderRadius: 4,
            background: 'color-mix(in srgb, var(--series-2) 14%, transparent)', color: 'var(--terra-dk)', fontSize: 10, fontWeight: 700,
            letterSpacing: 1, marginBottom: 8,
          }}>ROUTE STATUS: EMPIRICALLY DEAD</span>
          <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.7, marginTop: 4 }}>
            The <strong style={{ color: 'var(--terra-dk)' }}>bulk order-parameter route</strong> — seeking a
            spontaneous symmetry-breaking transition inside{' '}
            <InlineMath tex={"(\\tfrac{1}{2}, 1)"} /> as a route to RH — is{' '}
            <strong style={{ color: 'var(--terra-dk)' }}>empirically ruled out</strong>: systematic numerics found
            no such transition anywhere in the strip. The thermodynamic framework on this page remains
            a valid interpretive lens (primon gas, Bost-Connes), but it does not supply a proof route.
            The topological-winding thread that once succeeded this route is also closed: the winding /
            Cauchy-index argument re-derives Λ ≥ 0 and is capped by the same architecture as the
            Λ ≤ 0.2 bound. The program's recorded values are the conditional Λ ≤ 0.116091488672439
            (depends on three inputs that are not established), the two unrefereed candidates for an unconditional bound
            (Λ ≤ 0.1787854 and Λ ≤ 0.1758354) and the Λ ≤ 0.14 completion contract with its one
            open enclosure family — see <Link to="/state-of-program" style={{ color: 'var(--blue)' }}>the state of the program</Link>,{' '}
            <Link to="/permutation-architecture" style={{ color: 'var(--blue)' }}>the permutation architecture</Link> and{' '}
            <Link to="/lambda-01758354-candidate" style={{ color: 'var(--blue)' }}>the Λ ≤ 0.1758354 candidate</Link>.
          </p>
        </div>

        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Supercritical Phase Explorer</h1>
          <AnimationEmbed id="supercritical" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            Push the zeta function beyond the critical strip into the supercritical regime (<InlineMath tex={"\\sigma > 1"} />)
            and below zero (<InlineMath tex={"\\sigma < 0"} />). Using Tao's thermodynamic framework, <InlineMath tex={"\\sigma"} /> acts as inverse
            temperature: the Bost-Connes phase transition at <InlineMath tex={"\\sigma = 1"} /> separates the ordered "condensed phase"
            (<InlineMath tex={"\\sigma > 1"} />, cold) from the disordered "gas phase" of the critical strip. The critical line <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />
            is the equilibrium point.
          </p>
        </div>

        <BlockMath tex={"\\zeta(\\beta) = \\sum_{n=1}^{\\infty} e^{-\\beta \\log n} = \\prod_p \\frac{1}{1 - e^{-\\beta\\log p}} \\qquad \\beta = \\sigma \\;\\text{(inverse temperature)}"} />

        <div style={{ marginTop: 8 }}>
          <BlockMath tex={"F = -T\\log\\zeta(\\beta), \\quad S = -\\frac{\\partial F}{\\partial T}, \\quad P = \\frac{1}{N}\\sum_p \\log\\frac{1}{|1-p^{-s}|}"} />
        </div>

        <div style={{ marginTop: 32 }}>
          <SupercriticalViz />
        </div>

        <div className="card" style={{ marginTop: 32, borderColor: 'var(--brass)' }}>
          <h3 style={{ color: 'var(--brass)' }}>What to Explore in Each Tab</h3>
          <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--blue)' }}>Extended Landscape</strong> plots <InlineMath tex={"|\\zeta(\\sigma+it)|"} /> over the
            full <InlineMath tex={"\\sigma"} /> range, including the supercritical region. Look for the pole at <InlineMath tex={"\\sigma = 1"} /> and the
            functional equation symmetry reflecting the plot about <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
            <strong style={{ color: 'var(--green)' }}> Thermodynamics</strong> shows the free energy, entropy, specific heat,
            and pressure as functions of <InlineMath tex={"\\sigma"} />. Watch for the divergence at the Bost-Connes transition
            <InlineMath tex={"\\sigma = 1"} /> and the sign change in entropy near the critical line.
            <strong style={{ color: 'var(--brass-dk)' }}> Heat Flow</strong> evolves the Xi function under the heat equation,
            animating how zeros migrate as <InlineMath tex={"\\tau"} /> varies. At <InlineMath tex={"\\tau = 0"} /> zeros sit on the real axis
            (assuming RH); negative <InlineMath tex={"\\tau"} /> (backward heat) scatters them into the complex plane, while
            positive <InlineMath tex={"\\tau"} /> smooths the function and preserves real zeros.
            <strong style={{ color: 'var(--terra-dk)' }}> Euler Product Phase</strong> decomposes the phase of <InlineMath tex={"\\zeta"} /> into
            individual prime contributions. Look for how phase cancellation between primes sharpens near zeros,
            and how the distribution changes across the <InlineMath tex={"\\sigma = 1"} /> boundary.
          </p>
        </div>

        <div className="two-col" style={{ marginTop: 32 }}>
          <div className="card">
            <h3 style={{ color: 'var(--blue)' }}>Free Energy & Entropy</h3>
            <BlockMath tex={"F(\\beta) = -T\\log|\\zeta(\\beta + it)|, \\quad S = -\\frac{\\partial F}{\\partial T} = \\log|\\zeta| - \\beta\\frac{\\partial}{\\partial \\beta}\\log|\\zeta|"} />
            <p style={{ marginTop: 8 }}>
              <strong style={{ color: 'var(--blue)' }}>Free energy</strong> <InlineMath tex="F" /> is the thermodynamic
              potential — it diverges at the pole <InlineMath tex={"\\sigma = 1"} /> (the phase transition) and is smooth
              elsewhere. <strong style={{ color: 'var(--brass)' }}>Entropy</strong> <InlineMath tex="S" /> measures
              the disorder of prime occupancy states. It changes sign near
              the critical line: positive for <InlineMath tex={"\\sigma < 1"} /> (hot, disordered)
              and negative for <InlineMath tex={"\\sigma > 1"} /> (cold, ordered). The sign change marks the crossover
              from collective to independent prime behavior.
            </p>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--green)' }}>Specific Heat & Pressure</h3>
            <BlockMath tex={"C_v = \\beta^2\\frac{\\partial^2 \\log|\\zeta|}{\\partial \\beta^2}, \\quad P = \\frac{1}{N}\\sum_p \\log\\frac{1}{|1-p^{-s}|}"} />
            <p style={{ marginTop: 8 }}>
              <strong style={{ color: 'var(--green)' }}>Specific heat</strong> <InlineMath tex="C_v" /> measures the
              system's response to temperature changes — it spikes sharply at the phase
              transition <InlineMath tex={"\\sigma = 1"} />, signaling critical fluctuations. A second, subtler
              feature near <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> reflects the oscillator chain's resonance structure.{' '}
              <strong style={{ color: 'var(--brass-dk)' }}>Pressure</strong> <InlineMath tex="P" /> is the average
              per-prime contribution to <InlineMath tex={"\\log|\\zeta|"} />, finite in the gas
              phase (<InlineMath tex={"\\sigma > 1"} />) and divergent at the transition.
            </p>
          </div>
        </div>

        <div className="two-col" style={{ marginTop: 32 }}>
          <div className="card">
            <h3 style={{ color: 'var(--brass-dk)' }}>Bost-Connes Phase Transition (<InlineMath tex={"\\sigma = 1"} />)</h3>
            <BlockMath tex={"\\beta_c = 1: \\quad \\text{symmetry breaking, multiple KMS states} \\;(\\beta > 1) \\;\\leftrightarrow\\; \\text{unique KMS state} \\;(\\beta \\leq 1)"} />
            <p style={{ marginTop: 8 }}>
              Above <InlineMath tex={"\\sigma = 1"} /> (cold/supercritical), the Euler product converges absolutely but symmetry
              is spontaneously broken — the system selects a preferred KMS state among many, labelled by
              embeddings of <InlineMath tex={"\\mathbb{Q}^{\\text{ab}}"} /> into <InlineMath tex={"\\mathbb{C}"} />. Below <InlineMath tex={"\\sigma = 1"} /> (hot), symmetry is
              restored and the KMS state is unique — primes interact collectively in a "disordered phase."
              The critical strip <InlineMath tex={"0 < \\sigma < 1"} /> is where all the interesting physics happens.
            </p>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--blue)' }}>De Bruijn–Newman Heat Flow</h3>
            <BlockMath tex={"\\frac{\\partial H_{\\tau}}{\\partial \\tau} = \\frac{\\partial^2 H_{\\tau}}{\\partial t^2}, \\qquad \\Lambda \\geq 0 \\;\\text{(Rodgers–Tao 2020)}"} />
            <p style={{ marginTop: 8 }}>
              The xi function evolves under the heat equation. At <InlineMath tex={"\\tau = 0"} /> (no heating), RH says
              all zeros are on the real line. Forward heat flow (<InlineMath tex={"\\tau > 0"} />) smooths the function and
              preserves real zeros; backward flow (<InlineMath tex={"\\tau < 0"} />) scatters zeros off the real axis.
              Rodgers–Tao proved <InlineMath tex={"\\Lambda \\geq 0"} />: the system is already at the critical
              threshold — any backward perturbation destroys real zeros.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 24, borderColor: 'var(--green)' }}>
          <h3 style={{ color: 'var(--green)' }}>The Primon Gas: Pressure Interpretation</h3>
          <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8 }}>
            In the primon gas model (Julia 1990), each prime <InlineMath tex="p" /> is a quantum particle with energy
            <InlineMath tex={"\\log(p)"} />. The Euler product decomposes <InlineMath tex={"\\zeta(\\beta)"} /> into independent "prime partition functions."
            <strong style={{ color: 'var(--brass-dk)' }}> Pressure </strong> measures the average contribution per prime
            oscillator to the total log-partition function. In the supercritical phase, pressure is
            finite and decreases as <InlineMath tex={"\\sigma"} /> increases (colder = less pressure). At the phase transition
            <InlineMath tex={"\\sigma = 1"} />, pressure diverges. In the critical strip, the effective pressure is determined by
            the interplay between direct and dual ladders, achieving its equilibrium value at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
          </p>
        </div>

        {/* ── Bost-Connes meets Primon Gas: The Critical Strip as Hot Phase ── */}
        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--terra)' }}>
          <h3 style={{ color: 'var(--terra)', fontSize: 14, marginBottom: 12 }}>
            Bost-Connes + Primon Gas: Why Zeros Live in the Hot Phase
          </h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
            The Bost-Connes system and the primon gas are two faces of the same thermodynamic coin.
            Together they reveal <em>why</em> nontrivial zeros must inhabit the critical strip{' '}
            <InlineMath tex={"0 < \\sigma < 1"} /> and <em>why</em> the critical line{' '}
            <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> is special within it.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            {/* Cold phase */}
            <div style={{
              padding: '12px 14px', borderRadius: 8, background: 'var(--paper)',
              border: '1px solid color-mix(in srgb, var(--series-1) 30%, transparent)',
            }}>
              <h4 style={{ color: 'var(--blue)', fontSize: 12, marginBottom: 6 }}>
                Cold Phase (<InlineMath tex={"\\sigma > 1"} />)
              </h4>
              <p style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                Euler product converges absolutely. Each prime oscillator is independently frozen in
                its ground state. The primon gas is a{' '}
                <strong style={{ color: 'var(--blue)' }}>Bose-Einstein condensate</strong> — symmetry is
                broken, KMS states are labelled by Galois automorphisms of{' '}
                <InlineMath tex={"\\mathbb{Q}^{\\mathrm{ab}}"} />.
                No zeros can exist here because <InlineMath tex={"\\zeta(s) \\neq 0"} /> for{' '}
                <InlineMath tex={"\\sigma > 1"} />.
              </p>
            </div>

            {/* Hot phase */}
            <div style={{
              padding: '12px 14px', borderRadius: 8, background: 'var(--paper)',
              border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
            }}>
              <h4 style={{ color: 'var(--terra-dk)', fontSize: 12, marginBottom: 6 }}>
                Hot Phase (<InlineMath tex={"0 < \\sigma < 1"} />)
              </h4>
              <p style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                Euler product diverges; primes interact collectively. The primon gas is{' '}
                <strong style={{ color: 'var(--terra-dk)' }}>disordered</strong> — the unique KMS state
                means all Galois symmetry is restored. Phase cancellations between prime oscillators
                become possible, and it is precisely these cancellations that create{' '}
                <InlineMath tex={"\\zeta(\\rho) = 0"} />.
                <strong style={{ color: 'var(--terra)' }}> This is where zeros live.</strong>
              </p>
            </div>

            {/* Critical line */}
            <div style={{
              padding: '12px 14px', borderRadius: 8, background: 'var(--paper)',
              border: '1px solid color-mix(in srgb, var(--accent-deco) 30%, transparent)',
            }}>
              <h4 style={{ color: 'var(--terra)', fontSize: 12, marginBottom: 6 }}>
                Critical Line (<InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />)
              </h4>
              <p style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                The thermal equilibrium between direct and dual ladders. In primon gas terms,
                <InlineMath tex={"\\beta = \\tfrac{1}{2}"} /> is the{' '}
                <strong style={{ color: 'var(--terra)' }}>maximum entropy point</strong> of the hot phase —
                the temperature at which the partition function's phase cancellations are most
                perfectly balanced. RH asserts all zeros sit at this equilibrium.
              </p>
            </div>
          </div>

          <BlockMath tex={
            "\\underbrace{\\zeta(\\beta) = \\prod_p \\frac{1}{1 - p^{-\\beta}}}_{\\text{primon gas partition function}}" +
            "\\qquad \\xrightarrow{\\;\\beta \\to 1^-\\;} \\qquad" +
            "\\underbrace{+\\infty}_{\\text{Bost-Connes phase transition}}"
          } />

          <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 12 }}>
            The deep connection: the Bost-Connes phase transition at{' '}
            <InlineMath tex={"\\sigma = 1"} /> is the <em>boundary</em> of the primon gas's
            disordered regime. As <InlineMath tex={"\\sigma"} /> decreases below 1, collective
            prime interactions switch on. The nontrivial zeros of{' '}
            <InlineMath tex={"\\zeta(s)"} /> are the <strong style={{ color: 'var(--terra)' }}>resonant
            frequencies of the disordered phase</strong> — the specific imaginary parts{' '}
            <InlineMath tex={"t = \\gamma_n"} /> at which prime oscillator phases cancel perfectly.
            The functional equation's symmetry under{' '}
            <InlineMath tex={"s \\leftrightarrow 1 - s"} /> then forces these resonances onto{' '}
            <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, the midpoint of the hot phase.
            In Twin-Ladder Bridge language: the bridge unitarity{' '}
            <InlineMath tex={"|\\chi(\\tfrac{1}{2} + it)| = 1"} /> is the scattering condition
            that pins the resonance exactly at the thermal equilibrium temperature.
          </p>

          <div style={{
            marginTop: 14, padding: '10px 14px', borderRadius: 6,
            background: 'color-mix(in srgb, var(--accent-deco) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-deco) 30%, transparent)',
            fontSize: 12, color: 'var(--terra)', lineHeight: 1.7,
          }}>
            <strong>Physical picture:</strong> Think of the critical strip as a hot gas of primes
            where collective oscillations produce standing waves (zeros). The Bost-Connes transition
            at <InlineMath tex={"\\sigma = 1"} /> is the condensation point — below it, primes
            interact strongly enough for cancellations to occur. The critical line is the
            temperature of maximum resonance. RH says: all standing waves form at exactly this
            temperature.
          </div>
        </div>

        {/* ── de Bruijn-Newman Constant and Heat Flow ── */}
        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--brass-dk)' }}>
          <h3 style={{ color: 'var(--brass-dk)', fontSize: 14, marginBottom: 12 }}>
            de Bruijn-Newman Constant and Heat Flow
          </h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
            Start with the Riemann xi function <InlineMath tex={"\\Xi(z) = \\xi(\\tfrac{1}{2} + iz)"} /> and
            apply the <strong style={{ color: 'var(--brass-dk)' }}>heat equation</strong> to obtain a one-parameter
            family of deformed zeta functions <InlineMath tex={"\\Xi_t(z)"} />:
          </p>

          <BlockMath tex={"\\frac{\\partial \\Xi_t}{\\partial t} = \\frac{\\partial^2 \\Xi_t}{\\partial z^2}"} />

          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginTop: 12, marginBottom: 12 }}>
            The explicit integral representation involves the Jacobi theta function factor{' '}
            <InlineMath tex={"\\Phi"} />:
          </p>

          <BlockMath tex={"\\Xi_t(z) = \\int_0^{\\infty} e^{tu^2}\\,\\Phi(u)\\,\\cos(zu)\\,du"} />

          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginTop: 12, marginBottom: 16 }}>
            The <strong style={{ color: 'var(--brass-dk)' }}>de Bruijn-Newman constant</strong>{' '}
            <InlineMath tex={"\\Lambda"} /> is defined as the infimum of all{' '}
            <InlineMath tex={"t"} /> for which <InlineMath tex={"\\Xi_t"} /> still has only real zeros:
          </p>

          <BlockMath tex={"\\Lambda = \\inf\\{\\, t \\in \\mathbb{R} : \\Xi_t \\text{ has only real zeros}\\,\\}"} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16, marginBottom: 16 }}>
            {/* Newman's conjecture */}
            <div style={{
              padding: '12px 14px', borderRadius: 8, background: 'var(--paper)',
              border: '1px solid color-mix(in srgb, var(--brass-deco) 30%, transparent)',
            }}>
              <h4 style={{ color: 'var(--brass-dk)', fontSize: 12, marginBottom: 6 }}>
                Newman's Conjecture (1976)
              </h4>
              <p style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                Newman conjectured that <InlineMath tex={"\\Lambda \\geq 0"} />, meaning that the
                heat flow is already at or past the critical threshold: no backward perturbation
                can be applied without destroying the all-real-zeros property.
              </p>
            </div>

            {/* Rodgers-Tao */}
            <div style={{
              padding: '12px 14px', borderRadius: 8, background: 'var(--paper)',
              border: '1px solid color-mix(in srgb, var(--series-3) 30%, transparent)',
            }}>
              <h4 style={{ color: 'var(--green)', fontSize: 12, marginBottom: 6 }}>
                Rodgers-Tao Theorem (2020)
              </h4>
              <p style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                Rodgers and Tao proved <InlineMath tex={"\\Lambda \\geq 0"} />, confirming Newman's
                conjecture. Since RH is equivalent to <InlineMath tex={"\\Lambda \\leq 0"} />, the
                two statements together imply:
              </p>
              <BlockMath tex={"\\text{RH} \\iff \\Lambda = 0"} />
            </div>
          </div>

          <div style={{
            marginTop: 4, padding: '10px 14px', borderRadius: 6,
            background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--brass-deco) 30%, transparent)',
            fontSize: 12, color: 'var(--brass-dk)', lineHeight: 1.7,
          }}>
            <strong>Twin-Ladder Bridge interpretation:</strong> Heat flow "blurs" the oscillator frequencies. At{' '}
            <InlineMath tex={"t < 0"} /> (backward flow), resonances sharpen destructively and zeros
            drift off the real axis. At <InlineMath tex={"t = 0"} />, zeros are maximally sharp and
            sit exactly on the critical line (assuming RH). Forward flow (<InlineMath tex={"t > 0"} />)
            smooths the function but preserves real zeros. The Rodgers-Tao result says we are precisely at{' '}
            <InlineMath tex={"t = 0"} />: any heating preserves real zeros, any cooling destroys
            them. The system is at the <strong style={{ color: 'var(--brass-dk)' }}>critical threshold
            of resonance sharpness</strong>.
          </div>
          <p style={{ marginTop: 10, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            Rigorous bound: <strong style={{ color: 'var(--green)' }}>Λ ≤ 0.2</strong> (Polymath15, 2019),
            so <InlineMath tex={"0 \\leq \\Lambda \\leq 0.2"} />. RH requires Λ = 0.{' '}
            <Link to="/lambda-bounds" style={{ color: 'var(--brass-dk)' }}>Λ Bounds &amp; RH Roadmap →</Link>
          </p>
        </div>

        {/* ── Numeric Thermodynamic Panel ── */}
        <div className="card" style={{ marginTop: 24, borderColor: 'var(--green)' }}>
          <h3 style={{ color: 'var(--green)' }}>Numeric Values at σ = {numSigma.toFixed(2)}</h3>
          <p style={{ fontSize: 12, color: 'var(--faint)', marginTop: 4, marginBottom: 12 }}>
            Partial Euler product over primes ≤ 199 (valid for σ &gt; 1)
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>σ = 1.01</span>
            <input
              type="range" min={1.01} max={3.0} step={0.01}
              value={numSigma}
              onChange={e => setNumSigma(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>σ = 3.00</span>
          </div>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ color: 'var(--faint)', textAlign: 'left', paddingBottom: 6 }}>Quantity</th>
                <th style={{ color: 'var(--faint)', textAlign: 'left', paddingBottom: 6, fontSize: 11 }}>Formula</th>
                <th style={{ color: 'var(--green)', textAlign: 'right', paddingBottom: 6 }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Free energy F', formula: '−(1/σ) log ζ(σ)', val: thermo.F, color: 'var(--blue)' },
                { label: 'Entropy S', formula: 'log ζ − σ · d/dσ log ζ', val: thermo.S, color: 'var(--brass)' },
                { label: 'Specific heat Cv', formula: 'σ² · d²/dσ² log ζ', val: thermo.Cv, color: 'var(--green)' },
                { label: 'Pressure P (per prime)', formula: '(1/N) Σ_p log(1/(1−p^{−σ}))', val: thermo.P, color: 'var(--brass-dk)' },
              ].map(row => (
                <tr key={row.label} style={{ borderTop: '1px solid var(--hairline)' }}>
                  <td style={{ color: row.color, padding: '5px 0' }}>{row.label}</td>
                  <td style={{ color: 'var(--faint)', fontSize: 11, padding: '5px 8px' }}>{row.formula}</td>
                  <td style={{ color: 'var(--ink)', fontFamily: 'var(--ed-mono, var(--font-mono))', textAlign: 'right', padding: '5px 0' }}>{row.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: 10, fontSize: 12, color: 'var(--faint)', lineHeight: 1.6 }}>
            Divergence as σ → 1⁺ reflects the Bost-Connes phase transition (pole of ζ).
            The specific heat spike near σ = 1 signals critical fluctuations.
          </p>
        </div>

        {/* Related Pages */}
        <div className="card" style={{ marginTop: 24, background: 'color-mix(in srgb, var(--series-1) 5%, transparent)' }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Link to="/hamiltonian" style={{ color: 'var(--green)', fontSize: 13 }}>Hamiltonian (energy landscape)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/waves" style={{ color: 'var(--blue)', fontSize: 13 }}>Wave Simulator (phase behavior)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/spectral-attack" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>Spectral Approach (phase barriers)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/statistics" style={{ color: 'var(--brass)', fontSize: 13 }}>Statistics (de Bruijn-Newman)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/concepts" style={{ color: 'var(--blue)', fontSize: 13 }}>Concepts (Bost-Connes, partition function)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
