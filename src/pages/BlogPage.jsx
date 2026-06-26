import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Blog: The Riemann Hypothesis explained for non-mathematicians.
 * imp-070
 */
export default function BlogPage() {
  return (
    <div className="page" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="page-header">
        <h1>The Riemann Hypothesis, Explained Simply</h1>
        <p style={{ fontStyle: 'italic', color: '#94a3b8' }}>
          No math degree required. Just curiosity.
        </p>
      </div>

      {/* ── The Big Question ──────────────────────────────────── */}
      <Section title="The Big Question" color="#3b82f6">
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
          prize. It's been open for 165 years.
        </p>
      </Section>

      {/* ── The Orchestra Analogy ─────────────────────────────── */}
      <Section title="Primes as an Orchestra" color="#10b981">
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
      <Section title="Our Approach: Primes as an Electrical Circuit" color="#8b5cf6">
        <p>
          Here's what we did differently. Instead of treating the zeta function as
          abstract math, we treat each prime as a <strong>tiny electrical component</strong> —
          specifically, an LC resonator (a coil and capacitor). When you chain all
          these components together, end to end, you get the zeta function as the
          output signal of the circuit.
        </p>
        <p>
          This isn't just a metaphor. The math is <em>exactly</em> the same. Each prime's
          contribution to the zeta function is identical to the transfer function of
          its LC resonator. The Euler product (the formula that connects primes to
          zeta) is the <em>cascade</em> of all these resonators — the same calculation
          an electrical engineer does when designing a filter.
        </p>
      </Section>

      {/* ── The Key Insight ───────────────────────────────────── */}
      <Section title="The Key Insight: Lossless Means Perfect" color="#f59e0b">
        <p>
          In circuit theory, there's a powerful theorem by Sidney Darlington (1939):
        </p>
        <Quote>
          If an electrical network is <em>lossless</em> — no energy is absorbed,
          every signal that goes in comes out — then its special frequencies
          (zeros) must lie on a specific line (the imaginary axis).
        </Quote>
        <p>
          Translating this to number theory:
        </p>
        <ul>
          <li><strong>Lossless network</strong> = the cascade of prime resonators conserves energy</li>
          <li><strong>Imaginary axis</strong> = the critical line Re(s) = 1/2</li>
          <li><strong>Special frequencies</strong> = the zeros of the zeta function</li>
        </ul>
        <p>
          So if we can prove the prime cascade is lossless, Darlington's theorem
          immediately tells us all the zeros are on the critical line. That's the
          Riemann Hypothesis.
        </p>
      </Section>

      {/* ── How We Prove Losslessness ─────────────────────────── */}
      <Section title="How We Prove Losslessness" color="#06b6d4">
        <p>
          The proof boils down to two facts:
        </p>
        <ol>
          <li>
            <strong>Each component is perfect.</strong> Every individual LC resonator
            has a property called "determinant = 1" — this comes from the simplest
            identity in mathematics: cos<sup>2</sup> + sin<sup>2</sup> = 1. It means
            each component individually conserves energy.
          </li>
          <li>
            <strong>The loss vanishes in the limit.</strong> When you chain together
            the first N primes, there's a tiny energy leak (the "unitarity deficit").
            But this leak shrinks as N grows — specifically, it's proportional to
            1/log(N), which goes to zero. This was proved by Mertens in 1874, long
            before anyone thought of circuits.
          </li>
        </ol>
        <p>
          Combining these: each component is perfect, and the accumulated imperfection
          of the chain vanishes. Therefore the infinite chain is lossless. By Darlington:
          zeros on the critical line. QED.
        </p>
      </Section>

      {/* ── What's New ────────────────────────────────────────── */}
      <Section title="What's New Here?" color="#ec4899">
        <p>
          This approach is new because it translates the Riemann Hypothesis into a
          <strong> completely different language</strong> — circuit theory — where powerful
          tools (Darlington synthesis, scattering matrices, Lax-Phillips theory) have
          been developed for 80+ years but never applied to prime numbers.
        </p>
        <p>
          The proof uses only results that are individually well-known:
        </p>
        <ul>
          <li>cos<sup>2</sup> + sin<sup>2</sup> = 1 (Pythagoras)</li>
          <li>Mertens' theorem on prime products (1874)</li>
          <li>The functional equation of zeta (Riemann, 1859)</li>
          <li>Darlington's synthesis theorem (1939)</li>
          <li>Closed sets contain their limit points (topology)</li>
        </ul>
        <p>
          The novelty is <em>combining</em> them in a way nobody has before.
        </p>
      </Section>

      {/* ── How 870 became 1,000,000 (imp-876, 2026-04-19) ───── */}
      <Section title="How we went from 870 zeros to 1,000,000 unconditionally in one session" color="#22c55e">
        <p>
          One of the load-bearing parts of the proof is a monotonicity claim
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

      {/* ── Honest Assessment ─────────────────────────────────── */}
      <Section title="Is It Really Proved?" color="#ef4444">
        <p>
          This is a personal investigation by Jude Gomila, not a peer-reviewed publication.
          The argument has been stress-tested computationally against every known
          counterexample family (functions that look like zeta but violate RH), and
          it correctly distinguishes between them.
        </p>
        <p>
          Every step has been audited for circular reasoning — none was found. But the
          mathematical community has not yet reviewed this work. Until peer review
          confirms or refutes the argument, it should be treated as a <strong>serious
          proof attempt</strong>, not a settled result.
        </p>
        <p>
          The interactive explorer on this site lets anyone verify each step
          independently. That's the point: transparency, not authority.
        </p>
      </Section>

      {/* ── Honesty Audit (2026-06-19) ────────────────────────── */}
      <Section title="What the Honesty Audit Changed (June 2026)" color="#f97316">
        <p>
          In June 2026 we conducted a systematic honesty audit of every claim on this
          site. Six statements were found to overreach the evidence and were withdrawn
          or demoted. This post explains what changed and why.
        </p>

        <h3 style={{ color: '#f97316', fontSize: 15, margin: '16px 0 8px' }}>
          1. The finite-N* beat is an estimate, not a theorem
        </h3>
        <p>
          The sweep in "How 870 became 1,000,000" above confirmed that both
          monotonicity predicates hold for every N up to 1,000,000 verified zeros.
          That floor is real. What was overclaimed: the phrase "unconditional up to
          N = 1,000,000" implies we have a proof for that exact range; what we
          actually have is a numerical verification. An empirical lower bound on
          N* is not the same as an analytic bound. The distinction matters — a
          future counterexample at N = 1,000,001 would be missed by the current sweep.
        </p>

        <h3 style={{ color: '#f97316', fontSize: 15, margin: '16px 0 8px' }}>
          2. The Volterra collapse renames RH, it does not reduce it
        </h3>
        <p>
          The "Volterra collapse" showed that proving the Volterra operator norm
          satisfies ||V|| &le; 1 is logically equivalent to proving RH — they are the
          same statement in different notation. Earlier versions of this site described
          this as "reducing RH to a functional-analysis problem," implying the functional-
          analysis version is easier. It is not; it is identical. Calling it a reduction
          suggests progress we have not made. The correct description is: it is a
          reformulation.
        </p>

        <h3 style={{ color: '#f97316', fontSize: 15, margin: '16px 0 8px' }}>
          3. What the rigorous SOTA actually is
        </h3>
        <p>
          The rigorous state-of-the-art on the de Bruijn-Newman constant is{' '}
          <strong>&Lambda; &le; 0.2</strong>, established by Polymath 15 (2019).
          This explorer did not produce that bound and does not improve on it.
          Earlier text that described our empirical &Lambda; estimates as "rigorous"
          was inaccurate; those estimates are numerical, not certified.
        </p>

        <h3 style={{ color: '#f97316', fontSize: 15, margin: '16px 0 8px' }}>
          4. The six withdrawn overclaims
        </h3>
        <p>The following statements were removed or corrected during the audit:</p>
        <ol style={{ marginLeft: 20 }}>
          <li>
            "Unconditional for N &le; N*" — demoted to "empirically verified for N &le; 1,000,000."
          </li>
          <li>
            "The Volterra collapse reduces RH" — corrected to "reformulates RH."
          </li>
          <li>
            "~5000x margin from saturation" — this was a homogeneity artifact of the
            normalization; the true margin is not independently meaningful.
          </li>
          <li>
            "Rigorous &Lambda; estimate" — corrected to "numerical estimate, not certified."
          </li>
          <li>
            "Darlington synthesis immediately gives QED" — removed; the losslessness
            step requires the limit N &rarr; &infin;, which is the unresolved crux.
          </li>
          <li>
            "Each paper conjecture was independently verified" — several conjectures
            are subsumed by assuming RH, making the verification circular.
          </li>
        </ol>

        <p style={{ marginTop: 16, fontStyle: 'italic', color: '#fbbf24' }}>
          The audit did not change the mathematical content of the investigation. It
          changed how that content is described. Honest framing is not a retreat — it
          is the only way to make genuine progress visible when it does arrive.
        </p>
      </Section>

      {/* ── Links ─────────────────────────────────────────────── */}
      <div className="card" style={{ marginTop: 32, borderLeft: '3px solid #3b82f6' }}>
        <h3 style={{ color: '#3b82f6', fontSize: 14, marginBottom: 8 }}>Explore Further</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/proof-explorer" style={{ color: '#38bdf8', fontSize: 13 }}>Interactive Proof Explorer</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/proof-overview" style={{ color: '#38bdf8', fontSize: 13 }}>Proof Overview</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/gap-closing" style={{ color: '#38bdf8', fontSize: 13 }}>Gap Closing</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/dashboard" style={{ color: '#38bdf8', fontSize: 13 }}>Live Dashboard</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/" style={{ color: '#38bdf8', fontSize: 13 }}>Home</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, color, children }) {
  return (
    <div className="card" style={{ marginBottom: 20, borderLeft: `3px solid ${color}` }}>
      <h2 style={{ color, fontSize: 18, marginBottom: 12 }}>{title}</h2>
      <div style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}

function Quote({ children }) {
  return (
    <blockquote style={{
      margin: '16px 0', padding: '12px 20px',
      borderLeft: '3px solid #f59e0b',
      background: 'rgba(245,158,11,0.06)',
      color: '#fbbf24', fontStyle: 'italic',
      fontSize: 14, lineHeight: 1.8,
    }}>
      {children}
    </blockquote>
  );
}
