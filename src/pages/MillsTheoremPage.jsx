import React from 'react';
import { Link } from 'react-router-dom';
import MillsExplorerViz from '../components/MillsExplorerViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import PageHeader from '../components/PageHeader.jsx';

// A_n = p_n^(1/3^n) and |A_n - A| for the live Mills primes p_1..p_6, computed
// in float64 from the in-browser recurrence (BigInt + deterministic Miller-Rabin),
// against the RH-conditional reference A = 1.3063778838630807 (OEIS A051021).
// The error column makes the doubly-exponential convergence numerically tangible.
const AN_ERROR_ROWS = [
  { n: 1, A: '1.259921049895', err: '4.6e-2' },
  { n: 2, A: '1.305299880795', err: '1.1e-3' },
  { n: 3, A: '1.306377883825', err: '3.8e-11' },
  { n: 4, A: '1.306377883863', err: '< 1e-15 (float64 floor)' },
  { n: 5, A: '1.306377883863', err: '< 1e-15 (float64 floor)' },
  { n: 6, A: '1.306377883863', err: '< 1e-15 (float64 floor)' },
];

export default function MillsTheoremPage() {
  return (
    <div className="page">
      <PageHeader title="Mills' Theorem Explorer">
        <p>
          In 1947 W. H. Mills proved there exists a real constant{' '}
          <InlineMath tex="A > 1" /> — now called <strong>Mills' constant</strong> — such that{' '}
          <InlineMath tex={"\\lfloor A^{3^{n}} \\rfloor"} /> is prime for every{' '}
          <InlineMath tex={"n \\ge 1"} />. The proof is non-constructive: it builds{' '}
          <InlineMath tex="A" /> from a rapidly growing sequence of primes, each sitting just
          above the cube of the previous one. This explorer reconstructs that sequence{' '}
          <strong>live in your browser</strong> and watches the constant emerge.
        </p>
      </PageHeader>

      <BlockMath tex={"\\lfloor A^{3^{n}} \\rfloor \\text{ is prime for all } n \\ge 1, \\qquad A = \\lim_{n\\to\\infty} p_n^{\\,1/3^{n}} \\approx 1.30637788\\ldots"} />

      <div style={{ marginTop: 32 }}>
        <MillsExplorerViz />
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#06b6d4' }}>The Generating Recurrence</h3>
          <BlockMath tex={"p_1 = 2, \\qquad p_{n+1} = \\operatorname{nextprime}(p_n^{3})"} />
          <p style={{ marginTop: 8 }}>
            Mills' argument rests on a theorem of Ingham (1937): for large{' '}
            <InlineMath tex="x" /> there is always a prime between consecutive cubes{' '}
            <InlineMath tex="x^3" /> and <InlineMath tex={"(x+1)^3"} />. That guarantees the
            recurrence never stalls, so the sequence{' '}
            <InlineMath tex={"2, 11, 1361, 2521008887, \\ldots"} /> continues forever. The
            <strong style={{ color: '#10b981' }}> Mills primes</strong> grow doubly
            exponentially — each has roughly three times as many digits as the last.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#10b981' }}>Recovering the Constant</h3>
          <BlockMath tex={"A_n = p_n^{\\,1/3^{n}}, \\qquad A = \\lim_{n\\to\\infty} A_n"} />
          <p style={{ marginTop: 8 }}>
            Because each prime sits just above the previous cube, the nested radicals{' '}
            <InlineMath tex="A_n" /> form a convergent sequence whose limit is Mills'
            constant. The convergence is extremely fast — doubly exponentially — so just a
            handful of primes already pin down many decimal digits. The green curve in the
            chart above shows <InlineMath tex="A_n" /> settling onto the dashed reference line.
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--font-mono, monospace)', marginTop: 12 }}>
            <thead>
              <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                <th style={{ padding: '5px 8px' }}>n</th>
                <th style={{ padding: '5px 8px' }}>Aₙ = pₙ^(1/3ⁿ)</th>
                <th style={{ padding: '5px 8px' }}>|Aₙ − A|</th>
              </tr>
            </thead>
            <tbody>
              {AN_ERROR_ROWS.map(r => (
                <tr key={r.n} style={{ borderBottom: '1px solid #0f172a', color: '#cbd5e1' }}>
                  <td style={{ padding: '5px 8px', color: '#64748b' }}>{r.n}</td>
                  <td style={{ padding: '5px 8px', color: '#10b981' }}>{r.A}</td>
                  <td style={{ padding: '5px 8px', color: '#f59e0b' }}>{r.err}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: 8, color: '#64748b', fontSize: 11, lineHeight: 1.6 }}>
            Each <InlineMath tex="A_n" /> is the in-browser recurrence value (BigInt + Miller–Rabin)
            evaluated in float64; the error against{' '}
            <InlineMath tex={"A \\approx 1.3063778838"} /> drops doubly exponentially —
            <InlineMath tex={"4.6\\times10^{-2} \\to 1.1\\times10^{-3} \\to 3.8\\times10^{-11}"} /> —
            reaching the float64 floor by <InlineMath tex="n = 4" />. Reference value: OEIS A051021
            (Mills' constant), the RH-conditional least-prime digits flagged in the amber caveat below.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #f59e0b' }}>
        <h3 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 12 }}>
          A Caveat About the Digits
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Mills' theorem itself is <strong style={{ color: '#22c55e' }}>unconditional</strong>:
          the constant <InlineMath tex="A" /> provably exists. But the <em>specific</em> value
          <InlineMath tex={"A \\approx 1.3063778838\\ldots"} /> shown here is the smallest such
          constant <em>only if the Riemann Hypothesis holds</em>. RH gives the conditional prime-gap
          bound <InlineMath tex={"g(x) = O(\\sqrt{x}\\,\\log x)"} /> (Cramér, 1920) — far weaker than
          Cramér's <em>conjectured</em> <InlineMath tex={"O((\\log x)^2)"} />, but already tiny next to the
          gap <InlineMath tex={"(x+1)^3 - x^3 \\approx 3x^2"} /> between consecutive cubes. That margin
          is what lets one prove the "least prime above each cube" recurrence yields the minimal
          constant. Without RH we still know <em>a</em> Mills constant exists; we just cannot prove
          these are its leading digits.
          The constant is also believed to be irrational and transcendental, though neither is
          proven.
        </p>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#3b82f6' }}>
        <h3 style={{ color: '#3b82f6' }}>How the In-Browser Verification Works</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          Every prime in the table is computed with JavaScript <code>BigInt</code> arithmetic
          and certified by a <strong>deterministic Miller–Rabin</strong> test over the fixed
          witness set <InlineMath tex={"\\{2,3,5,\\ldots,37\\}"} />, which is provably correct for
          numbers far larger than any shown here. Finding{' '}
          <InlineMath tex={"p_{n+1}"} /> means scanning candidates above{' '}
          <InlineMath tex={"p_n^3"} /> until one passes the test. By{' '}
          <InlineMath tex="p_6" /> the prime already has about 87 decimal digits, so the live
          recurrence is capped at <InlineMath tex="n = 6" /> to keep the page responsive.
        </p>
      </div>

      {/* Related Pages */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/twin-ladder" style={{ color: '#8b5cf6', fontSize: 13 }}>Twin Ladder</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/gilbreath" style={{ color: '#06b6d4', fontSize: 13 }}>Gilbreath Observation</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/zeta" style={{ color: '#3b82f6', fontSize: 13 }}>Zeta Function</Link>
        </div>
      </div>
    </div>
  );
}
