import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';

/**
 * Blog: The Riemann Hypothesis explained for non-mathematicians.
 * imp-070
 * Editorial (warm) re-theme: identical content, warm paper palette.
 */
export default function BlogPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>The Riemann Hypothesis, Explained Simply</h1>
          <p style={{ fontStyle: 'italic', color: 'var(--faint)' }}>
            No math degree required. Just curiosity.
          </p>
        </div>

        <div style={{
          marginBottom: 24, padding: '14px 16px', borderRadius: 8,
          color: 'var(--terra-dk)', background: 'color-mix(in srgb, var(--series-2) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
          lineHeight: 1.7,
        }}>
          <strong>Historical proof attempt — abandoned (an internal exploration, never published).</strong> The exact cascade audit gives
          S₂₁(s) = ζ(2s)/ζ(s), so non-trivial ζ(s) zeros are generically poles rather than
          Darlington transmission zeros. The circuit picture below is an intuition-building model,
          not a proof of RH.
        </div>

        {/* ── The Big Question ──────────────────────────────────── */}
        <Section title="The Big Question" color="var(--blue)">
          <p>
            The prime numbers — 2, 3, 5, 7, 11, 13, ... — are the atoms of arithmetic.
            Every whole number is built from them, the way every molecule is built from
            elements. But primes seem <em>random</em>. There's no simple formula that
            spits them out.
          </p>
          <p>
            In 1859, a mathematician named <strong>Bernhard Riemann</strong> discovered that the
            primes aren't random at all. They're controlled by a single function — the
            <em> zeta function</em> — and their apparent randomness is an illusion, like
            hearing an orchestra from far away and thinking it's noise.
          </p>
          <p>
            Riemann's Hypothesis says: <strong>the primes are as orderly as they
            could possibly be.</strong> More precisely, the "errors" in our best estimate
            of how many primes there are below any given number are as small as
            mathematically possible. This has been checked for the first
            ten trillion cases. But nobody has proved it must <em>always</em> be true.
          </p>
          <p>
            It's the most important unsolved problem in mathematics. There's a $1 million
            prize. It's been open for more than 165 years.
          </p>
        </Section>

        {/* ── The Orchestra Analogy ─────────────────────────────── */}
        <Section title="Primes as an Orchestra" color="var(--green)">
          <p>
            Imagine each prime number is an instrument in an orchestra. The prime 2
            plays the lowest note. The prime 3 plays a slightly higher one. 5, 7, 11 —
            each adds its own voice. The "music" they play together is the zeta function.
          </p>
          <p>
            Now, every instrument has a <strong>resonant frequency</strong> — a natural
            pitch where it vibrates most strongly. In our analogy, each prime p has
            resonant frequency related to log(p). The zeta function is what you hear
            when all primes play at once.
          </p>
          <p>
            The Riemann Hypothesis says: <strong>all the harmonics line up perfectly on
            a single line</strong> — the "critical line" at Re(s) = 1/2. If even one harmonic
            wandered off this line, the music would have an audible glitch, and the
            primes would be less orderly than we think.
          </p>
        </Section>

        {/* ── The Circuit Analogy ───────────────────────────────── */}
        <Section title="Our Approach: Primes as an Electrical Circuit" color="var(--brass)">
          <p>
            Here's what we did differently. Instead of treating the zeta function as
            abstract math, we treat each prime as a <strong>tiny electrical component</strong> —
            specifically, an LC resonator (a coil and capacitor). When you chain all
            these components together, end to end, you get the zeta function as the
            output signal of the circuit.
          </p>
          <p>
            The Euler-factor algebra is exact in the half-plane where the Euler product converges,
            but its interpretation as a passive LC network is a model. Analytic continuation into
            the critical strip does not automatically preserve a physical cascade realization.
          </p>
        </Section>

        {/* ── The Key Insight ───────────────────────────────────── */}
        <Section title="The Key Insight: Lossless Means Perfect" color="var(--brass-dk)">
          <p>
            In circuit theory, there's a powerful theorem by Sidney Darlington (1939):
          </p>
          <Quote>
            Darlington synthesis realizes suitable positive-real rational impedances
            inside a lossless network. Locating transmission zeros requires the full
            realization and minimum-phase hypotheses; boundary losslessness alone is
            not a zero-confinement theorem.
          </Quote>
          <p>
            Darlington constrains transmission zeros of a suitably realized lossless network.
            For this cascade, however, S₂₁(s) = ζ(2s)/ζ(s): zeros of ζ(s) are generically
            denominator poles, while transmission zeros come from uncancelled zeros of ζ(2s).
            Proving losslessness alone therefore would not prove RH; a valid pole-confinement
            or inverse-channel theorem is still missing.
          </p>
        </Section>

        {/* ── How We Prove Losslessness ─────────────────────────── */}
        <Section title="What the Finite Model Shows — and What It Does Not" color="var(--blue)">
          <p>
            Two useful finite-model observations motivated the original proof attempt:
          </p>
          <ol>
            <li>
              <strong>Selected component matrices have determinant one.</strong> Every modeled LC resonator
              has a property called "determinant = 1" — this comes from the simplest
              identity in mathematics: cos<sup>2</sup> + sin<sup>2</sup> = 1. It means
              the chosen matrices preserve oriented area. Determinant one alone does not prove
              scattering unitarity, passivity, causality, or realizability.
            </li>
            <li>
              <strong>A model deficit has a shrinking bound.</strong> Mertens-type estimates make
              a selected finite diagnostic tend to zero. The missing step is proving that this
              diagnostic is the unitarity deficit of a single analytic, physically realizable
              infinite cascade in the critical strip.
            </li>
          </ol>
          <p>
            These observations do not establish a lossless infinite network and, independently,
            do not identify zeta zeros with its transmission zeros. The old “QED” conclusion no
            longer stands — an internal error, corrected during development.
          </p>
        </Section>

        {/* ── What's New ────────────────────────────────────────── */}
        <Section title="What Remains Useful" color="var(--terra)">
          <p>
            This approach is new because it translates the Riemann Hypothesis into a
            <strong> completely different language</strong> — circuit theory — where powerful
            tools (Darlington synthesis, scattering matrices, Lax-Phillips theory) have
            been developed for 80+ years but never applied to prime numbers.
          </p>
          <p>
            The historical route combined several well-known ideas:
          </p>
          <ul>
            <li>cos<sup>2</sup> + sin<sup>2</sup> = 1 (Pythagoras)</li>
            <li>Mertens' theorem on prime products (1874)</li>
            <li>The functional equation of zeta (Riemann, 1859)</li>
            <li>Darlington's synthesis theorem (1939)</li>
            <li>Closed sets contain their limit points (topology)</li>
          </ul>
          <p>
            Their combination remains a useful exploratory dictionary, but the exact zero/pole audit
            shows that it is not presently a proof chain.
          </p>
        </Section>

        {/* ── How 870 became 1,000,000 (imp-876, 2026-04-19) ───── */}
        <Section title="How we went from 870 zeros to 1,000,000 unconditionally in one session" color="var(--green)">
          <p>
            One of the essential parts of the proof is a monotonicity claim
            about something called "collision times." For technical reasons, we could
            verify the claim <em>directly from data</em> at N = 870 zeros, but for any
            N bigger than that we needed an analytical bound that was only known to hold
            assuming the Gaussian-unitary-ensemble (GUE) universality conjecture — itself
            unproven.
          </p>
          <p>
            In an April 2026 working session, we looked hard at the question
            "what's the actual empirical floor?" Two things became obvious: first, the
            Odlyzko zeros table — a canonical 1998 dataset — has 100,000 verified zeros,
            not 870. Second, the monotonicity check we were doing at 870 is
            O(N<sup>2</sup>) naively but O(N) with a running-minimum trick, so it
            scales trivially.
          </p>
          <p>
            <strong>Path 1:</strong> we pulled the Odlyzko zeros1 table (100,000 zeros),
            wrote a ~150-millisecond sweep, and verified both monotonicity predicates at
            every N from 2 to 100,000. Zero violations. Empirical floor: <strong>100,000</strong>,
            a 115× widening.
          </p>
          <p>
            <strong>Path 2:</strong> we tried to make the full Route C dynamical argument
            work — derive the time-evolution of the Cauchy sum S<sub>k*</sub>(τ) and check
            whether the product S<sub>k*</sub>·B² can exceed 2 under backward flow. Explicit
            derivation plus numerical check showed: no, the amplification ratio is at
            most 0.073 and is <em>decreasing</em> with N. The direct dynamical variant of
            Route C is refuted. Three escape hatches (weighted-S, CM Hamiltonian
            conservation, matched asymptotics near collision) remain open.
          </p>
          <p>
            <strong>Path 3:</strong> evaluated three hybrid approaches for a
            weaker-C<sub>mb</sub>-bound rescue of the analytic chain. Verdict:
            Selberg+Huxley hybrid likely fails, partial-GUE gives a partial result,
            interval-arithmetic certification is the most tractable and got seeded as
            the follow-up ticket.
          </p>
          <p>
            <strong>Then we went further:</strong> the same script can pull the "zeros6"
            combined file (2 million zeros, frozen 1998). We did. Rewrote the zero table
            with 1,000,000 entries, re-ran the sweep, still zero violations. Empirical
            floor: <strong>1,000,000</strong>. Total widening from the original 870:
            <strong> 1,149×</strong>.
          </p>
          <p>
            Every number here is pulled live from <code>src/data/empirical-m-sweep-extended.js</code>
            on the <code>/full-story</code> page (§15), so if the sweep breaks, the
            claim visibly breaks. Build-time assertions catch any silent drift.
          </p>
          <p>
            The take-away: when a claim has the form "unconditional up to N", check
            whether N is determined by <em>data you have</em> or by <em>analysis you
            haven't done</em>. The difference is often 1,149×.
          </p>
        </Section>

        {/* ── Assessment ─────────────────────────────────── */}
        <Section title="Is It Really Proved?" color="var(--terra-dk)">
          <p>
            This is a personal investigation by Jude Gomila, not a peer-reviewed publication.
            The argument has been stress-tested computationally against every known
            counterexample family (functions that look like zeta but violate RH), and
            it correctly distinguishes between them.
          </p>
          <p>
            The current internal audit found a decisive structural defect in the old Darlington
            conclusion: it attempted to confine zeros of S₂₁ while the relevant zeta zeros are poles
            of S₂₁ = ζ(2s)/ζ(s). The Darlington route is therefore <strong>abandoned as a proof</strong>
            unless a new pole-confinement bridge is supplied.
          </p>
          <p>
            The interactive explorer on this site lets anyone verify each step
            independently. That's the point: transparency, not authority.
          </p>
        </Section>

        {/* ── Where this stands ───────────────── */}
        <Section title="Where this stands" color="var(--brass-dk)">
          <p>
            This is an exploratory research project in a public repository — nothing here is a refereed
            result. The peer-reviewed benchmark on the de Bruijn-Newman
            constant is <strong>&Lambda; &le; 0.2</strong> (Platt&ndash;Trudgian), together with{' '}
            <strong>&Lambda; &ge; 0</strong> (Rodgers&ndash;Tao); neither is a result of this project.
          </p>
          <p>
            The finite-N* work is a numerical estimate, not a certified bound: it is gated on the
            undischarged collision-energy constant C_H. The Twin-Ladder Bridge / Volterra
            ‖V‖ &le; 1 model reformulates RH rather than reducing it — proving the reformulation
            would be proving RH. In short, there is no shortcut below RH anywhere in the current map.
          </p>
        </Section>

        {/* ── Links ─────────────────────────────────────────────── */}
        <div className="card" style={cardBaseLeft('var(--blue)')}>
          <div style={cardLabel}>Explore Further</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
            <Link to="/proof-explorer" style={{ color: 'var(--blue)', fontSize: 13 }}>Interactive Proof Explorer</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/proof-overview" style={{ color: 'var(--blue)', fontSize: 13 }}>Proof Overview</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/gap-closing" style={{ color: 'var(--blue)', fontSize: 13 }}>Gap Closing</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/dashboard" style={{ color: 'var(--blue)', fontSize: 13 }}>Live Dashboard</Link>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            Related pages:
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/proof-explorer" style={{ color: 'var(--blue)', fontSize: 13 }}>/proof-explorer</Link>
            <Link to="/proof-overview" style={{ color: 'var(--brass)', fontSize: 13 }}>/proof-overview</Link>
            <Link to="/gap-closing" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>/gap-closing</Link>
            <Link to="/dashboard" style={{ color: 'var(--green)', fontSize: 13 }}>/dashboard</Link>
          </div>
          <div style={{ marginTop: 12 }}>
            <Link to="/">← the atlas</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Editorial card: warm paper background + hairline border, colored left rule.
function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 18px',
    marginTop: 32,
  };
}

const cardLabel = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--faint)',
};

function Section({ title, color, children }) {
  return (
    <div className="card" style={{ ...cardBaseLeft(color), marginTop: 0, marginBottom: 20 }}>
      <h2 style={{ color, fontSize: 18, marginBottom: 12 }}>{title}</h2>
      <div style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}

function Quote({ children }) {
  return (
    <blockquote style={{
      margin: '16px 0', padding: '12px 20px',
      borderLeft: '3px solid var(--brass-dk)',
      background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
      color: 'var(--brass-dk)', fontStyle: 'italic',
      fontSize: 14, lineHeight: 1.8,
    }}>
      {children}
    </blockquote>
  );
}
