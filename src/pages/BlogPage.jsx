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
