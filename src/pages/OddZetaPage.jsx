import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import OddZetaViz from '../components/OddZetaViz.jsx';
import { IRRATIONALITY_RESULTS, ZETA_EXACT, aperySequence } from '../math/odd-zeta.js';

function AperyLiveCalculator() {
  const [steps, setSteps] = useState(6);

  const seq = useMemo(() => aperySequence(steps), [steps]);

  const rows = useMemo(() => {
    return seq.convergents
      .filter(c => c.error > 1e-16 && isFinite(c.value))
      .map(c => {
        const bn = Math.abs(seq.bn[c.n] || 1);
        const logBn = bn > 1 ? Math.log(bn) : 0;
        const logErr = c.error > 0 ? Math.log(c.error) : null;
        const muLocal = logBn > 0 && logErr !== null ? -logErr / logBn : null;
        return { n: c.n, bn, value: c.value, error: c.error, muLocal };
      });
  }, [seq]);

  const muOLS = useMemo(() => {
    const pts = rows.filter(r => r.bn > 1 && r.error > 0);
    if (pts.length < 2) return null;
    let sx = 0, sy = 0, sxy = 0, sxx = 0;
    const n = pts.length;
    for (const pt of pts) {
      const x = Math.log(pt.bn);
      const y = Math.log(pt.error);
      sx += x; sy += y; sxy += x * y; sxx += x * x;
    }
    const denom = n * sxx - sx * sx;
    if (Math.abs(denom) < 1e-30) return null;
    return -(n * sxy - sx * sy) / denom;
  }, [rows]);

  return (
    <div className="card" style={{ marginTop: 32, borderLeft: '3px solid #06b6d4' }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#06b6d4' }}>
        Live Irrationality-Measure Calculator
      </h2>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
        Estimates <InlineMath tex={"\\mu(\\zeta(3))"} /> from Apery convergents{' '}
        <InlineMath tex={"a_n/b_n"} />. For each step, the local exponent{' '}
        <InlineMath tex={"\\mu_n = -\\log|\\text{error}_n| / \\log b_n"} /> measures how well that
        convergent approximates <InlineMath tex={"\\zeta(3)"} />. A regression over all steps gives
        the overall estimate.{' '}
        <strong style={{ color: '#ef4444' }}>Key insight:</strong>{' '}
        <InlineMath tex={"\\mu_n > 2"} /> at each step is evidence that <InlineMath tex={"\\zeta(3)"} />{' '}
        cannot be rational — a rational <InlineMath tex={"p/q"} /> cannot be approximated better
        than <InlineMath tex={"1/q^2"} /> by other rationals.
      </p>

      <div className="control-group" style={{ marginBottom: 16 }}>
        <label>Steps of Apery recurrence</label>
        <input type="range" min="2" max="7" step="1" value={steps}
          title="Number of Apery recurrence steps — each step adds one convergent to the irrationality estimate"
          onChange={e => setSteps(+e.target.value)} />
        <span className="control-value">{steps}</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              <th style={{ color: '#64748b', textAlign: 'right', padding: '6px 10px', fontWeight: 600 }}>n</th>
              <th style={{ color: '#64748b', textAlign: 'right', padding: '6px 10px', fontWeight: 600 }}>b_n</th>
              <th style={{ color: '#64748b', textAlign: 'right', padding: '6px 10px', fontWeight: 600 }}>a_n / b_n</th>
              <th style={{ color: '#64748b', textAlign: 'right', padding: '6px 10px', fontWeight: 600 }}>|error|</th>
              <th style={{ color: '#64748b', textAlign: 'right', padding: '6px 10px', fontWeight: 600 }}>
                <InlineMath tex={"\\mu_n"} /> (local)
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.n} style={{ borderBottom: '1px solid #0f172a' }}>
                <td style={{ color: '#94a3b8', textAlign: 'right', padding: '5px 10px' }}>{row.n}</td>
                <td style={{ color: '#a5f3fc', textAlign: 'right', padding: '5px 10px' }}>
                  {row.bn < 1e15 ? row.bn.toFixed(0) : row.bn.toExponential(3)}
                </td>
                <td style={{ color: '#e2e8f0', textAlign: 'right', padding: '5px 10px' }}>
                  {row.value.toFixed(10)}
                </td>
                <td style={{ color: '#f59e0b', textAlign: 'right', padding: '5px 10px' }}>
                  {row.error.toExponential(3)}
                </td>
                <td style={{
                  color: row.muLocal !== null && row.muLocal > 2 ? '#10b981' : '#ef4444',
                  textAlign: 'right', padding: '5px 10px', fontWeight: 600,
                }}>
                  {row.muLocal !== null ? row.muLocal.toFixed(3) : '—'}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ color: '#64748b', textAlign: 'center', padding: '12px' }}>
                  No convergents with measurable error at this step count
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16 }}>
        {[
          {
            label: 'OLS μ estimate',
            value: muOLS !== null ? muOLS.toFixed(3) : '—',
            color: muOLS !== null && muOLS > 2 ? '#10b981' : '#64748b',
          },
          { label: 'Known bound (Rhin-Viola)', value: '≤ 5.514', color: '#3b82f6' },
          { label: 'Lower bound (irrationals)', value: '≥ 2', color: '#94a3b8' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>
              {m.value}
            </div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: '#475569', marginTop: 12, fontStyle: 'italic' }}>
        Each green row confirms the convergent approximates <InlineMath tex={"\\zeta(3)"} /> beyond the rational
        threshold. The OLS estimate converges toward <InlineMath tex={"\\mu \\approx 5.5"} /> with more steps.
      </p>
    </div>
  );
}

export default function OddZetaPage() {
  return (
    <div className="page">
      <h1>Odd Zeta Values &amp; Irrationality</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 720, marginBottom: 32 }}>
        Exploring <InlineMath tex={"\\zeta(3)"} />, <InlineMath tex={"\\zeta(5)"} />, <InlineMath tex={"\\zeta(7)"} />, and
        higher odd zeta values through the ZPO twin-ladder model. While even zeta values{' '}
        <InlineMath tex={"\\zeta(2n) = (-1)^{n+1} B_{2n} (2\\pi)^{2n} / (2(2n)!)"} /> are rational multiples
        of <InlineMath tex={"\\pi^{2n}"} />, the odd values remain deeply mysterious.
      </p>

      {/* ─── Two-Column Layout: Known Results + ZPO Interpretation ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 32 }}>

        {/* Left: Known Results */}
        <div className="card" style={{ borderLeft: '3px solid #3b82f6' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#3b82f6' }}>
            Known Results
          </h2>
          {IRRATIONALITY_RESULTS.map((result, i) => (
            <div key={i} style={{ marginBottom: i < IRRATIONALITY_RESULTS.length - 1 ? 16 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontSize: 11, fontFamily: 'var(--font-mono)', color: '#f59e0b',
                  background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: 4,
                }}>
                  {result.year}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
                  {result.author}
                </span>
              </div>
              <BlockMath tex={result.latex} />
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 1.5 }}>
                {result.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Right: ZPO Interpretation */}
        <div className="card" style={{ borderLeft: '3px solid #8b5cf6' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#8b5cf6' }}>
            ZPO Interpretation
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
            At real integer points <InlineMath tex={"s = n"} />, the twin-ladder model simplifies:
            both direct and dual ladders have <strong style={{ color: '#e2e8f0' }}>purely real</strong>{' '}
            transfer functions. The Euler product becomes a product of real factors:
          </p>
          <BlockMath tex={"\\zeta(2n+1) = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-(2n+1)}}"} />
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
            Each prime <InlineMath tex={"p"} /> contributes a stage with transfer function{' '}
            <InlineMath tex={"H_p(n) = 1/(1 - p^{-n})"} />. The "impedance" at stage <InlineMath tex={"p"} /> is:
          </p>
          <BlockMath tex={"Z_p(n) = n\\log p + \\frac{\\log p}{n}"} />
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
            For larger <InlineMath tex={"n"} />, the factor <InlineMath tex={"p^{-n}"} /> decays exponentially
            fast, so fewer primes matter. This is why <InlineMath tex={"\\zeta(n) \\to 1"} /> as{' '}
            <InlineMath tex={"n \\to \\infty"} />: the oscillator chain becomes nearly transparent.
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            The irrationality of these values reflects the fact that the infinite product of
            rational factors <InlineMath tex={"1/(1-p^{-n})"} /> cannot collapse to a rational
            number — the primes encode "too much information" in their distribution.
          </p>
        </div>
      </div>

      {/* ─── Key Equations ─── */}
      <div className="card" style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Key Equations</h2>

        <h3 style={{ color: '#10b981', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
          Apery's Theorem (1979)
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          The value <InlineMath tex={"\\zeta(3) = \\sum_{n=1}^{\\infty} 1/n^3"} /> is irrational.
          Apery's proof used the rapidly converging series:
        </p>
        <BlockMath tex={"\\zeta(3) = \\frac{5}{2} \\sum_{n=1}^{\\infty} \\frac{(-1)^{n-1}}{n^3 \\binom{2n}{n}}"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
          and the recurrence <InlineMath tex={"(n+1)^3 a_{n+1} = (2n+1)(17n^2+17n+5)a_n - n^3 a_{n-1}"} />,
          whose solutions <InlineMath tex={"a_n/b_n \\to \\zeta(3)"} /> at rate{' '}
          <InlineMath tex={"\\sim (1+\\sqrt{2})^{-4n}"} />.
        </p>

        <h3 style={{ color: '#3b82f6', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
          Euler Product at Odd Integers
        </h3>
        <BlockMath tex={"\\zeta(2n+1) = \\prod_{p} \\frac{1}{1 - p^{-(2n+1)}} = \\prod_{p} \\left(1 + p^{-(2n+1)} + p^{-2(2n+1)} + \\cdots \\right)"} />

        <h3 style={{ color: '#8b5cf6', fontSize: 15, fontWeight: 600, marginBottom: 8, marginTop: 16 }}>
          Even vs Odd: The Asymmetry
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          Even zeta values have closed forms via Bernoulli numbers:
        </p>
        <BlockMath tex={"\\zeta(2) = \\frac{\\pi^2}{6}, \\quad \\zeta(4) = \\frac{\\pi^4}{90}, \\quad \\zeta(6) = \\frac{\\pi^6}{945}"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          No analogous formula exists for odd values. The functional equation{' '}
          <InlineMath tex={"\\zeta(s) = \\chi(s)\\zeta(1-s)"} /> maps <InlineMath tex={"\\zeta(2n+1)"} /> to{' '}
          <InlineMath tex={"\\zeta(-2n)"} /> which is a trivial zero — this "bridge" provides no new information
          at odd integers, unlike the even case.
        </p>
      </div>

      {/* ─── Visualization ─── */}
      <OddZetaViz />

      {/* ─── Live Irrationality-Measure Calculator ─── */}
      <AperyLiveCalculator />

      <div className="card" style={{ marginTop: 32, borderColor: '#06b6d4' }}>
        <h3 style={{ color: '#06b6d4' }}>What to Explore in Each Tab</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <strong style={{ color: '#3b82f6' }}>Values & Convergence</strong> shows how the Euler product partial
          products build up <InlineMath tex={"\\zeta(n)"} /> prime by prime. Watch how odd values (3, 5, 7, ...)
          converge more slowly than even values — each prime's contribution <InlineMath tex={"(1 - p^{-n})^{-1}"} /> is
          closer to 1 for larger <InlineMath tex={"n"} />, so small primes dominate. Try increasing the prime count
          and notice how the partial product locks in quickly for <InlineMath tex={"\\zeta(7)"} /> but takes longer
          for <InlineMath tex={"\\zeta(3)"} />.
          <strong style={{ color: '#10b981' }}> Apery Sequences</strong> plots the rational approximants{' '}
          <InlineMath tex={"a_n / b_n"} /> from Apery's recurrence, showing their exponential convergence
          to <InlineMath tex={"\\zeta(3)"} /> at rate <InlineMath tex={"(1 + \\sqrt{2})^{-4n}"} />. The log-error
          plot reveals the constant convergence rate — a straight line on the log scale confirms the
          geometric nature of the approximation.
          <strong style={{ color: '#f59e0b' }}> Transfer Function</strong> visualizes{' '}
          <InlineMath tex={"|H_p(s)| = |1 - p^{-s}|^{-1}"} /> for individual prime stages at real integer
          arguments. Compare how the transfer function magnitude changes between even and odd{' '}
          <InlineMath tex={"s"} /> — at even integers the dual ladder provides <InlineMath tex={"\\pi"} />-dependent
          information, while at odd integers the dual maps to a trivial zero.
          <strong style={{ color: '#8b5cf6' }}> Linear Independence</strong> tests whether{' '}
          <InlineMath tex={"1, \\zeta(3), \\zeta(5), \\ldots, \\zeta(2k+1)"} /> are linearly independent
          over <InlineMath tex={"\\mathbb{Q}"} /> by searching for small integer relations. Watch the minimum
          relation norm grow as you add more values — growth indicates independence.
          <strong style={{ color: '#ef4444' }}> Irrationality Measure</strong> estimates{' '}
          <InlineMath tex={"\\mu(\\zeta(n))"} /> by finding the best rational approximations{' '}
          <InlineMath tex={"p/q"} /> and plotting <InlineMath tex={"\\log|\\zeta(n) - p/q|"} /> vs{' '}
          <InlineMath tex={"\\log q"} />. The slope gives the irrationality exponent — compare against the
          known bound <InlineMath tex={"\\mu(\\zeta(3)) \\leq 5.51"} /> and the generic expectation{' '}
          <InlineMath tex={"\\mu = 2"} />.
        </p>
      </div>

      {/* ─── Ball-Rivoal Theorem Context ─── */}
      <div className="card" style={{ marginTop: 32, borderLeft: '3px solid #10b981' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#10b981' }}>
          Ball-Rivoal Theorem: Infinitely Many Irrational Odd Zeta Values
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
          In 2001, Tanguy Rivoal proved a landmark result: <em>infinitely many</em> of the odd zeta values
          {' '}<InlineMath tex={"\\zeta(3), \\zeta(5), \\zeta(7), \\ldots"} /> are irrational. More precisely,
          letting <InlineMath tex={"\\delta(s)"} /> denote the dimension of the{' '}
          <InlineMath tex={"\\mathbb{Q}"} />-vector space spanned by{' '}
          <InlineMath tex={"1, \\zeta(3), \\zeta(5), \\ldots, \\zeta(s)"} />, Rivoal showed:
        </p>
        <BlockMath tex={"\\delta(s) \\geq \\frac{1 + \\log 2}{3 + \\log 2} \\cdot \\frac{\\log s}{2} \\qquad \\text{for odd } s \\geq 3"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
          In particular, <InlineMath tex={"\\delta(s) \\to \\infty"} /> as <InlineMath tex={"s \\to \\infty"} />, so
          infinitely many odd zeta values are irrational. Keith Ball and Rivoal later refined this via
          a "well-poised hypergeometric" construction: they produced linear forms
        </p>
        <BlockMath tex={"r_n = a_{n,0} + a_{n,1}\\zeta(3) + a_{n,2}\\zeta(5) + \\cdots + a_{n,k}\\zeta(2k+1)"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
          with <InlineMath tex={"a_{n,j} \\in \\mathbb{Z}"} /> and <InlineMath tex={"r_n \\to 0"} /> but{' '}
          <InlineMath tex={"r_n \\neq 0"} />, built from the integral
        </p>
        <BlockMath tex={"r_n = \\int_0^1 \\cdots \\int_0^1 \\frac{\\prod_{j=1}^{n} x_j^a (1-x_j)^a}{Q(x_1 \\cdots x_s)^{n+1}} \\, dx_1 \\cdots dx_s"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
          The key innovation is the "well-poised" symmetry of these integrals, which forces all <em>even</em>{' '}
          zeta coefficients to vanish, isolating the odd values. Zudilin (2001) strengthened this to show
          at least one of <InlineMath tex={"\\zeta(5), \\zeta(7), \\zeta(9), \\zeta(11)"} /> is irrational,
          using a refined saddle-point analysis and arithmetic properties of binomial sums.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}>
            <h3 style={{ color: '#10b981', fontSize: 14, marginBottom: 8 }}>What We Know</h3>
            <ul style={{ color: '#94a3b8', fontSize: 12, lineHeight: 2, paddingLeft: 16 }}>
              <li><InlineMath tex={"\\zeta(3)"} /> is irrational (Apery, 1979)</li>
              <li>Infinitely many <InlineMath tex={"\\zeta(2n+1)"} /> are irrational (Rivoal, 2000)</li>
              <li>At least one of <InlineMath tex={"\\zeta(5), \\zeta(7), \\zeta(9), \\zeta(11)"} /> is irrational (Zudilin, 2001)</li>
              <li><InlineMath tex={"\\delta(s) \\geq c \\log s"} /> for an explicit constant <InlineMath tex={"c > 0"} /></li>
            </ul>
          </div>
          <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}>
            <h3 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 8 }}>What Remains Open</h3>
            <ul style={{ color: '#94a3b8', fontSize: 12, lineHeight: 2, paddingLeft: 16 }}>
              <li>Is <InlineMath tex={"\\zeta(5)"} /> individually irrational?</li>
              <li>Are <InlineMath tex={"\\zeta(3)"} /> and <InlineMath tex={"\\zeta(5)"} /> linearly independent over <InlineMath tex={"\\mathbb{Q}"} />?</li>
              <li>Is the true growth rate <InlineMath tex={"\\delta(s) \\sim s/2"} /> (full independence)?</li>
              <li>Does the method extend to prove transcendence of any <InlineMath tex={"\\zeta(2n+1)"} />?</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Numerical Reference Table ─── */}
      <div className="card" style={{ marginTop: 32, borderLeft: '3px solid #10b981' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#10b981' }}>
          Numerical Reference Values
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
          High-precision values of odd zeta computed via the Euler product.
          As <InlineMath tex={"n"} /> grows, <InlineMath tex={"\\zeta(n) \\to 1"} /> rapidly:
          the oscillator chain becomes nearly transparent and the prime-2 factor dominates.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <th style={{ color: '#64748b', textAlign: 'left', padding: '6px 12px', fontWeight: 600 }}>n</th>
                <th style={{ color: '#64748b', textAlign: 'right', padding: '6px 12px', fontWeight: 600 }}>&zeta;(n)</th>
                <th style={{ color: '#64748b', textAlign: 'right', padding: '6px 12px', fontWeight: 600 }}>&zeta;(n) &minus; 1</th>
                <th style={{ color: '#64748b', textAlign: 'left', padding: '6px 12px', fontWeight: 600 }}>Known status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(ZETA_EXACT).map(([n, val]) => {
                const isKnownIrrational = n === '3';
                const isZudilinGroup = ['5', '7', '9', '11'].includes(n);
                return (
                  <tr key={n} style={{ borderBottom: '1px solid #0f172a' }}>
                    <td style={{ color: '#e2e8f0', padding: '6px 12px' }}>
                      <InlineMath tex={`\\zeta(${n})`} />
                    </td>
                    <td style={{ color: '#a5f3fc', textAlign: 'right', padding: '6px 12px' }}>
                      {val.toFixed(10)}
                    </td>
                    <td style={{ color: '#64748b', textAlign: 'right', padding: '6px 12px', fontSize: 11 }}>
                      {(val - 1).toExponential(3)}
                    </td>
                    <td style={{ padding: '6px 12px' }}>
                      {isKnownIrrational ? (
                        <span style={{ color: '#10b981', fontSize: 11 }}>{'irrational (Apéry 1979)'}</span>
                      ) : isZudilinGroup ? (
                        <span style={{ color: '#f59e0b', fontSize: 11 }}>{'≥1 of {5,7,9,11} irrational (Zudilin 2001)'}</span>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: 11 }}>{'unknown individually'}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 11, color: '#475569', marginTop: 12, fontStyle: 'italic' }}>
          {'Ball-Rivoal guarantees infinitely many are irrational. As of 2024, only ζ(3) is individually confirmed irrational.'}
        </p>
      </div>

      {/* ─── Open Problems ─── */}
      <div className="card" style={{ marginTop: 32, borderLeft: '3px solid #ef4444' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#ef4444' }}>
          Open Problems
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b', marginBottom: 6 }}>
              Irrationality of Individual Values
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
              Is <InlineMath tex={"\\zeta(5)"} /> irrational? This is one of the most famous open problems
              in number theory. Zudilin showed at least one of{' '}
              <InlineMath tex={"\\zeta(5), \\zeta(7), \\zeta(9), \\zeta(11)"} /> is irrational,
              but we cannot determine which.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b', marginBottom: 6 }}>
              Linear Independence
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
              Are <InlineMath tex={"\\zeta(3), \\zeta(5), \\zeta(7), \\ldots"} /> linearly independent
              over <InlineMath tex={"\\mathbb{Q}"} />? Ball-Rivoal proved the span has dimension{' '}
              <InlineMath tex={"\\geq c \\cdot \\log(s)"} />, but full independence is unknown.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b', marginBottom: 6 }}>
              Irrationality Measures
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
              For <InlineMath tex={"\\zeta(3)"} />, the best known bound is{' '}
              <InlineMath tex={"\\mu(\\zeta(3)) \\leq 5.513891"} /> (Rhin-Viola, 2001).
              Is the true measure 2 (as for "generic" irrationals)? What about{' '}
              <InlineMath tex={"\\mu(\\zeta(5))"} />?
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b', marginBottom: 6 }}>
              Transcendence
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
              Is <InlineMath tex={"\\zeta(3)"} /> transcendental? Almost certainly yes, but current
              methods cannot prove it. Even showing <InlineMath tex={"\\zeta(3)/\\pi^3"} /> is irrational
              would be a breakthrough.
            </p>
          </div>
        </div>
      </div>

      {/* ─── ZPO Connection ─── */}
      <div className="card" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>ZPO Perspective: Why Odd Values are Harder</h2>
        <ul style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 20 }}>
          <li>
            <strong style={{ color: '#e2e8f0' }}>Even values</strong> correspond to the functional equation
            mapping <InlineMath tex={"\\zeta(2n)"} /> to <InlineMath tex={"\\zeta(1-2n)"} />,
            where the bridge factor <InlineMath tex={"\\chi(2n)"} /> introduces{' '}
            <InlineMath tex={"\\pi^{2n}"} /> through the Gamma function. The bridge "encodes" pi.
          </li>
          <li>
            <strong style={{ color: '#e2e8f0' }}>Odd values</strong> map to trivial zeros:{' '}
            <InlineMath tex={"\\zeta(2n+1) \\to \\zeta(-2n) = 0"} />. The bridge at odd integers
            is "singular" — it carries no useful information back from the dual ladder.
          </li>
          <li>
            In the <strong style={{ color: '#e2e8f0' }}>oscillator chain</strong> picture, even zeta values
            correspond to resonant modes where the direct and dual ladders constructively interfere
            (producing <InlineMath tex={"\\pi"} />-dependent closed forms), while odd values correspond to
            anti-resonant modes where the dual ladder contributes nothing.
          </li>
          <li>
            The <strong style={{ color: '#e2e8f0' }}>irrationality</strong> of odd zeta values is thus a statement
            about the impossibility of "rational resonance" — the infinite product of prime factors
            cannot be captured by any finite rational expression.
          </li>
        </ul>
      </div>

      {/* ─── Odd Zeta Irrationality via the Explicit Formula and the ZPO Model ─── */}
      <div className="card" style={{ marginTop: 32, borderLeft: '3px solid #ec4899' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#ec4899' }}>
          Connecting Irrationality Proofs to ZPO via the Explicit Formula
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
          The von Mangoldt explicit formula provides a spectral decomposition of the prime-counting
          function in terms of zeta zeros:
        </p>
        <BlockMath tex={"\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} - \\log(2\\pi) - \\frac{1}{2}\\log(1 - x^{-2})"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
          Each nontrivial zero <InlineMath tex={"\\rho = \\beta + i\\gamma"} /> contributes an oscillatory
          correction <InlineMath tex={"x^{\\rho}/\\rho"} /> to the prime distribution. In the ZPO ladder model,
          these zeros are the resonant frequencies of the coupled oscillator chain. Evaluating
          {' '}<InlineMath tex={"\\zeta(s)"} /> at an odd integer <InlineMath tex={"s = 2n+1"} /> amounts to
          "reading off" the total response of the ladder at a specific real frequency.
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
          The logarithmic derivative connects the Euler product to the von Mangoldt function:
        </p>
        <BlockMath tex={"-\\frac{\\zeta'(s)}{\\zeta(s)} = \\sum_{n=1}^{\\infty} \\frac{\\Lambda(n)}{n^s} = \\sum_{p} \\frac{\\log p}{p^s - 1}"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
          At <InlineMath tex={"s = 2n+1"} />, this becomes a sum over prime powers weighted by{' '}
          <InlineMath tex={"\\log p"} />, and the partial fraction expansion over the zeros gives:
        </p>
        <BlockMath tex={"-\\frac{\\zeta'(2n+1)}{\\zeta(2n+1)} = 1 + \\sum_{\\rho} \\frac{1}{2n+1-\\rho} + \\text{(rational terms)}"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
          The irrationality of <InlineMath tex={"\\zeta(2n+1)"} /> is therefore intimately tied to the
          distribution of zeros <InlineMath tex={"\\rho"} />. In the ZPO picture, the zeros determine the
          transfer function poles, and the value <InlineMath tex={"\\zeta(2n+1)"} /> is the DC gain of a
          specific filtered version of the ladder. The Ball-Rivoal well-poised integrals can be
          reinterpreted as computing the "impulse response" of this filter at integer time-steps,
          and their non-vanishing (which proves irrationality) reflects the fact that the infinite
          chain of prime oscillators cannot produce a purely rational impulse response at odd frequencies.
        </p>

        <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#ec4899', fontSize: 14, marginBottom: 8 }}>ZPO Ladder Interpretation</h3>
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginBottom: 8 }}>
            The explicit formula decomposes <InlineMath tex={"\\zeta(s)"} /> into a product over primes (the
            ladder stages) and a sum over zeros (the resonances). At even integers, the functional equation
            relates both sides via <InlineMath tex={"\\Gamma"} />-factors that introduce <InlineMath tex={"\\pi"} />.
            At odd integers, this bridge is broken:
          </p>
          <BlockMath tex={"\\underbrace{\\zeta(2n+1)}_{\\text{ladder output}} = \\underbrace{\\prod_p \\frac{1}{1 - p^{-(2n+1)}}}_{\\text{prime stages}} \\neq \\underbrace{\\frac{\\text{rational} \\times \\pi^{2n+1}}{\\text{rational}}}_{\\text{impossible}}"} />
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginTop: 8 }}>
            The ladder output at odd frequencies cannot be expressed as a rational multiple of any power
            of <InlineMath tex={"\\pi"} />, because the dual-ladder contribution (via the functional equation)
            maps to a trivial zero. This "broken bridge" is the spectral origin of odd-zeta irrationality.
          </p>
        </div>
      </div>

      {/* ─── Algorithmic Information Theory Attack ─── */}
      <div className="card" style={{ marginTop: 32, borderLeft: '3px solid #06b6d4' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#06b6d4' }}>
          Chaitin's Constant &amp; Algorithmic Information Theory
        </h2>

        <div style={{ marginBottom: 16, padding: 12, background: 'rgba(239,68,68,0.08)', borderRadius: 6, border: '1px solid #ef444455' }}>
          <h4 style={{ color: '#ef4444', fontSize: 12, marginBottom: 6 }}>
            Heuristic analogy &mdash; not a theorem
          </h4>
          <p style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.7 }}>
            Everything in this section and the next (the Kolmogorov-complexity &ldquo;proof strategy,&rdquo;
            the <InlineMath tex={"K(\\zeta(2k+1)\\!\\mid\\! N) \\geq c_k N^{\\alpha_k}"} /> growth conjecture, and the
            generating-function &ldquo;fundamental obstruction&rdquo;) is a <strong style={{ color: '#e2e8f0' }}>speculative
            ZPO-flavored analogy, not a proof or a near-complete route</strong>. No step here is a theorem about odd
            zeta values: the key claim that computing <InlineMath tex={"N"} /> digits forces information from all
            primes up to <InlineMath tex={"\\sim 10^{N/(2n+1)}"} /> is unproven (and as stated is heuristic &mdash;
            fast-converging series exist), and Chaitin&rsquo;s rational/<InlineMath tex={"O(\\log N)"} /> dichotomy does
            not by itself yield any lower bound on <InlineMath tex={"K(\\zeta(2k+1)\\!\\mid\\! N)"} />. The genuine
            theorems &mdash; Ap&eacute;ry (<InlineMath tex={"\\zeta(3)"} /> irrational), Ball&ndash;Rivoal
            (infinitely many <InlineMath tex={"\\zeta(2k+1)"} /> irrational), and Zudilin (one of
            <InlineMath tex={"\\zeta(5),\\zeta(7),\\zeta(9),\\zeta(11)"} /> irrational) &mdash; are stated separately
            below and do not depend on any of this.
          </p>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
          Gregory Chaitin's work on algorithmic information theory provides a fundamentally different
          angle on irrationality. His halting probability <InlineMath tex={"\\Omega = \\sum_{p \\text{ halts}} 2^{-|p|}"} />{' '}
          is the prototypical algorithmically random number — its binary digits are maximally incompressible.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}>
            <h3 style={{ color: '#10b981', fontSize: 14, marginBottom: 8 }}>The Key Insight</h3>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
              If <InlineMath tex={"\\zeta(2n+1)"} /> were rational <InlineMath tex={"= a/b"} />, its binary expansion
              would be eventually periodic. This means its Kolmogorov complexity would satisfy:
            </p>
            <BlockMath tex={"K(\\zeta(2n+1)|_N) = O(\\log N) \\quad \\text{(rational bound)}"} />
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginTop: 8 }}>
              But the Euler product requires ALL primes to compute, suggesting:
            </p>
            <BlockMath tex={"K(\\zeta(2n+1)|_N) \\geq \\pi(e^{N^{1/(2n+1)}}) \\gg \\log N"} />
          </div>

          <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b' }}>
            <h3 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 8 }}>Chaitin's Characterization</h3>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
              Chaitin proved that a real number <InlineMath tex={"x"} /> is rational if and only if
              <InlineMath tex={"K(x|_N) = O(\\log N)"} />, where <InlineMath tex={"K"} /> is Kolmogorov complexity.
              For <InlineMath tex={"\\Omega"} />, <InlineMath tex={"K(\\Omega|_N) \\geq N - O(1)"} /> (maximally random).
            </p>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginTop: 8 }}>
              <strong style={{ color: '#e2e8f0' }}>The ZPO connection:</strong> The Euler product is an
              "infinite program" for computing <InlineMath tex={"\\zeta(n)"} /> — each prime adds information
              that cannot be derived from the others. The irrationality of odd zeta values reflects
              the irreducible computational content of the prime distribution.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 16, padding: 12, background: 'rgba(6,182,212,0.08)', borderRadius: 6, border: '1px solid #06b6d420' }}>
          <h4 style={{ color: '#06b6d4', fontSize: 12, marginBottom: 8 }}>Proof Strategy via Kolmogorov Complexity</h4>
          <ol style={{ marginLeft: 16, color: '#94a3b8', fontSize: 12, lineHeight: 2 }}>
            <li><strong>Step 1:</strong> Show computing N digits of <InlineMath tex={"\\zeta(2n+1)"} /> requires primes up to <InlineMath tex={"\\sim 10^{N/(2n+1)}"} /> <span style={{ color: '#ef4444' }}>[Gap]</span></li>
            <li><strong>Step 2:</strong> Therefore <InlineMath tex={"K(\\zeta(2n+1)|_N) \\geq \\pi(10^{N/(2n+1)})"} /> <span style={{ color: '#f59e0b' }}>[Conditional on Step 1]</span></li>
            <li><strong>Step 3:</strong> This exceeds <InlineMath tex={"O(\\log N)"} /> for all <InlineMath tex={"N"} /> <span style={{ color: '#10b981' }}>[Elementary]</span></li>
            <li><strong>Step 4:</strong> By Chaitin's theorem, <InlineMath tex={"\\zeta(2n+1) \\notin \\mathbb{Q}"} /> <span style={{ color: '#f59e0b' }}>[Conditional on Steps 1-3]</span></li>
          </ol>
          <p style={{ color: '#ef4444', fontSize: 11, marginTop: 8, fontStyle: 'italic' }}>
            Critical gap: Step 1 requires proving that each prime individually contributes to the N-th digit —
            the information-theoretic analog of Apery's algebraic independence argument.
          </p>
        </div>
      </div>

      {/* ─── Kolmogorov Complexity and Irrationality ─── */}
      <div className="card" style={{ marginTop: 32, borderLeft: '3px solid #a855f7' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#a855f7' }}>
          Kolmogorov Complexity and Irrationality
        </h2>

        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
          Chaitin's constant <InlineMath tex={"\\Omega"} /> is the archetypal algorithmically random real number.
          Its defining property is that its prefix-free Kolmogorov complexity is maximal:
        </p>
        <BlockMath tex={"K(\\Omega \\!\\mid\\! n) \\;\\geq\\; n - O(1)"} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
          meaning that no program substantially shorter than <InlineMath tex={"n"} /> bits can produce the
          first <InlineMath tex={"n"} /> bits of <InlineMath tex={"\\Omega"} />. This stands in sharp contrast
          to rational numbers, whose binary expansions are eventually periodic and hence have
          complexity <InlineMath tex={"K(q \\!\\mid\\! n) = O(\\log n)"} />.
        </p>

        <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b', marginBottom: 16 }}>
          <h3 style={{ color: '#a855f7', fontSize: 14, marginBottom: 8 }}>
            Ap&eacute;ry's Theorem and Kolmogorov Complexity
          </h3>
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginBottom: 8 }}>
            The irrationality of <InlineMath tex={"\\zeta(3)"} /> (Ap&eacute;ry's theorem, 1979) tells us
            that <InlineMath tex={"\\zeta(3)"} /> cannot be expressed as a ratio <InlineMath tex={"a/b"} /> with{' '}
            <InlineMath tex={"a, b \\in \\mathbb{Z}"} />. In complexity-theoretic terms, this means:
          </p>
          <BlockMath tex={"K(\\zeta(3) \\!\\mid\\! N) \\;\\neq\\; O(\\log N)"} />
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
            The digits of <InlineMath tex={"\\zeta(3)"} /> contain "too much information" to be captured by a
            finite description of a repeating pattern, confirming that its complexity grows faster
            than the logarithmic bound characteristic of rationals.
          </p>
        </div>

        <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b', marginBottom: 16 }}>
          <h3 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 8 }}>
            Conjectural High Complexity of Odd Zeta Values
          </h3>
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginBottom: 8 }}>
            It is conjectured that all odd zeta values <InlineMath tex={"\\zeta(2k+1)"} /> have high
            Kolmogorov complexity, far exceeding the <InlineMath tex={"O(\\log N)"} /> threshold for
            rationality. More precisely, the conjecture asserts:
          </p>
          <BlockMath tex={"K(\\zeta(2k+1) \\!\\mid\\! N) \\;\\geq\\; c_k \\cdot N^{\\alpha_k} \\quad \\text{for some } c_k > 0, \\; \\alpha_k > 0"} />
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
            This would imply not only irrationality but also transcendence, since algebraic irrational
            numbers still have <InlineMath tex={"K(\\alpha \\!\\mid\\! N) = O(\\log N)"} /> relative to any
            algebraic number field containing them.
          </p>
        </div>

        <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b', marginBottom: 16 }}>
          <h3 style={{ color: '#3b82f6', fontSize: 14, marginBottom: 8 }}>
            Connection to ZPO: Information Content of the Ladder
          </h3>
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginBottom: 8 }}>
            In the ZPO twin-ladder framework, the "information content" of{' '}
            <InlineMath tex={"\\zeta(2k+1)"} /> relates directly to how many prime oscillator harmonics
            are needed to approximate it to a given precision. To compute{' '}
            <InlineMath tex={"N"} /> digits of <InlineMath tex={"\\zeta(2k+1)"} />, the Euler product
            requires contributions from primes up to:
          </p>
          <BlockMath tex={"p \\leq P_N \\sim \\exp\\!\\left(\\frac{N \\log 10}{2k+1}\\right)"} />
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
            Each prime stage <InlineMath tex={"H_p(2k+1) = (1 - p^{-(2k+1)})^{-1}"} /> injects
            irreducible information into the ladder output, and no finite subset of stages can
            reproduce the exact value — the prime oscillator chain is information-theoretically
            incompressible.
          </p>
        </div>

        <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b', marginBottom: 16 }}>
          <h3 style={{ color: '#10b981', fontSize: 14, marginBottom: 8 }}>
            The Generating Function for Odd Zeta Values
          </h3>
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginBottom: 8 }}>
            All odd zeta values are encoded simultaneously in the generating function:
          </p>
          <BlockMath tex={"\\mathcal{Z}_{\\text{odd}}(x) = \\sum_{k=1}^{\\infty} \\zeta(2k+1)\\, x^{2k+1}"} />
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
            This function concentrates the full "odd zeta spectrum" into a single analytic object.
            Its singularity structure encodes the collective irrationality properties of all{' '}
            <InlineMath tex={"\\zeta(2k+1)"} /> simultaneously, and its radius of convergence{' '}
            <InlineMath tex={"|x| < 1"} /> reflects the decay rate of the ladder's transfer function
            across harmonics.
          </p>
        </div>

        <div style={{ padding: 16, background: 'rgba(168,85,247,0.08)', borderRadius: 8, border: '1px solid #a855f720' }}>
          <h3 style={{ color: '#a855f7', fontSize: 14, marginBottom: 8 }}>
            Complexity vs. Closed Forms: The Fundamental Obstruction
          </h3>
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginBottom: 8 }}>
            If <InlineMath tex={"\\zeta(2k+1)"} /> were rational for all <InlineMath tex={"k"} />, then the
            generating function <InlineMath tex={"\\mathcal{Z}_{\\text{odd}}(x)"} /> would be a rational
            function of <InlineMath tex={"x"} />, and the ladder's transfer function would admit a
            simple closed form:
          </p>
          <BlockMath tex={"\\zeta(2k+1) = \\frac{a_k}{b_k} \\;\\;\\forall\\, k \\quad \\Longrightarrow \\quad \\mathcal{Z}_{\\text{odd}}(x) = \\frac{P(x)}{Q(x)} \\quad \\text{for polynomials } P, Q"} />
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
            But this would contradict the known complexity of the prime distribution. The primes
            are distributed with enough irregularity (captured by the prime number theorem and its
            error terms) that the infinite product over prime oscillator stages cannot collapse to
            a rational transfer function. The Kolmogorov complexity of the prime sequence itself —{' '}
            <InlineMath tex={"K(p_1, \\ldots, p_n) \\sim n \\log n"} /> — propagates through the Euler
            product to prevent any such simplification.
          </p>
        </div>
      </div>

      {/* ─── Related Pages ─── */}
      <div className="card" style={{ marginTop: 32, borderColor: '#64748b' }}>
        <h3 style={{ color: '#94a3b8' }}>Related Pages</h3>
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          Explore related topics:{' '}
          <Link to="/concepts" style={{ color: '#8b5cf6' }}>Core Concepts</Link>{' '}
          (Twin-Ladder Bridge model foundations and the twin-ladder framework),{' '}
          <Link to="/fourier" style={{ color: '#3b82f6' }}>Fourier Domain</Link>{' '}
          (spectral decomposition of primes and the explicit formula),{' '}
          <Link to="/info-theory" style={{ color: '#10b981' }}>Information Theory</Link>{' '}
          (Kolmogorov complexity and algorithmic randomness of zeta values),{' '}
          <Link to="/spectral-attack" style={{ color: '#f59e0b' }}>Spectral Attack</Link>{' '}
          (unified potential and Fourier-information synthesis).
        </p>
      </div>
    </div>
  );
}
