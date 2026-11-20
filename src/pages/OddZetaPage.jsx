import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import OddZetaViz from '../components/OddZetaViz.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { IRRATIONALITY_RESULTS, ZETA_EXACT, aperySequence } from '../math/odd-zeta.js';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ODD_ZETA_INCOMPRESSIBILITY_AUDIT as oddZetaAudit } from '../data/odd-zeta-incompressibility-audit-2026-08.js';

// Odd Zeta Values & Irrationality — Apéry, Ball–Rivoal, Zudilin, and the
// Twin-Ladder Bridge reading of the explicit formula.
// Editorial (warm) re-theme: full-width dashboard, identical structure/data.

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
    <div className="card" style={{ marginTop: 32, borderLeft: '3px solid var(--blue)' }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--blue)' }}>
        Live Irrationality-Measure Calculator
      </h2>
      <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 16, lineHeight: 1.6 }}>
        Plots finite-sample approximation slopes from Apery convergents{' '}
        <InlineMath tex={"a_n/b_n"} />. For each step, the local exponent{' '}
        <InlineMath tex={"\\mu_n = -\\log|\\text{error}_n| / \\log b_n"} /> measures how well that
        convergent approximates <InlineMath tex={"\\zeta(3)"} />. The regression is a numerical
        diagnostic, not an irrationality measure or proof: finitely many unusually good rational
        approximations are compatible with a rational target. Apéry's theorem instead controls an
        infinite sequence of nonzero integer linear forms together with their denominator growth.
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
            <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
              <th style={{ color: 'var(--faint)', textAlign: 'right', padding: '6px 10px', fontWeight: 600 }}>n</th>
              <th style={{ color: 'var(--faint)', textAlign: 'right', padding: '6px 10px', fontWeight: 600 }}>b_n</th>
              <th style={{ color: 'var(--faint)', textAlign: 'right', padding: '6px 10px', fontWeight: 600 }}>a_n / b_n</th>
              <th style={{ color: 'var(--faint)', textAlign: 'right', padding: '6px 10px', fontWeight: 600 }}>|error|</th>
              <th style={{ color: 'var(--faint)', textAlign: 'right', padding: '6px 10px', fontWeight: 600 }}>
                <InlineMath tex={"\\mu_n"} /> (local)
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.n} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td style={{ color: 'var(--ink-soft)', textAlign: 'right', padding: '5px 10px' }}>{row.n}</td>
                <td style={{ color: 'var(--blue)', textAlign: 'right', padding: '5px 10px' }}>
                  {row.bn < 1e15 ? row.bn.toFixed(0) : row.bn.toExponential(3)}
                </td>
                <td style={{ color: 'var(--ink)', textAlign: 'right', padding: '5px 10px' }}>
                  {row.value.toFixed(10)}
                </td>
                <td style={{ color: 'var(--brass-dk)', textAlign: 'right', padding: '5px 10px' }}>
                  {row.error.toExponential(3)}
                </td>
                <td style={{
                  color: row.muLocal !== null && row.muLocal > 2 ? 'var(--green)' : 'var(--terra-dk)',
                  textAlign: 'right', padding: '5px 10px', fontWeight: 600,
                }}>
                  {row.muLocal !== null ? row.muLocal.toFixed(3) : '—'}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ color: 'var(--faint)', textAlign: 'center', padding: '12px' }}>
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
            label: 'finite OLS slope',
            value: muOLS !== null ? muOLS.toFixed(3) : '—',
            color: muOLS !== null && muOLS > 2 ? 'var(--green)' : 'var(--faint)',
          },
          { label: 'Known bound (Rhin-Viola)', value: '≤ 5.514', color: 'var(--blue)' },
          { label: 'Lower bound (irrationals)', value: '≥ 2', color: 'var(--ink-soft)' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 10px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>
              {m.value}
            </div>
            <div style={{ color: 'var(--faint)', fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: 'var(--faint)', marginTop: 12, fontStyle: 'italic' }}>
        Green rows only flag local slopes above two. No finite row set certifies irrationality, and
        the OLS slope should not be read as the rigorous upper bound on <InlineMath tex={"\\mu(\\zeta(3))"} />.
      </p>
    </div>
  );
}

export default function OddZetaPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1" style={{ marginBottom: 10 }}>Odd Zeta Values &amp; Irrationality</h1>
          <AnimationEmbed id="odd-zeta" />
        <p style={{ color: 'var(--ink-soft)', maxWidth: 720, marginBottom: 32, fontSize: 15, lineHeight: 1.55 }}>
          Exploring <InlineMath tex={"\\zeta(3)"} />, <InlineMath tex={"\\zeta(5)"} />, <InlineMath tex={"\\zeta(7)"} />, and
          higher odd zeta values through the Twin-Ladder Bridge twin-ladder model. While even zeta values{' '}
          <InlineMath tex={"\\zeta(2n) = (-1)^{n+1} B_{2n} (2\\pi)^{2n} / (2(2n)!)"} /> are rational multiples
          of <InlineMath tex={"\\pi^{2n}"} />, the odd values remain deeply mysterious.
        </p>

        {/* ─── Two-Column Layout: Known Results + Twin-Ladder Bridge Interpretation ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 32 }}>

          {/* Left: Known Results */}
          <div className="card" style={{ borderLeft: '3px solid var(--blue)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--blue)' }}>
              Known Results
            </h2>
            {IRRATIONALITY_RESULTS.map((result, i) => (
              <div key={i} style={{ marginBottom: i < IRRATIONALITY_RESULTS.length - 1 ? 16 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--brass-dk)',
                    background: 'color-mix(in srgb, var(--brass-deco) 12%, transparent)', padding: '2px 6px', borderRadius: 4,
                  }}>
                    {result.year}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                    {result.author}
                  </span>
                </div>
                <BlockMath tex={result.latex} />
                <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.5 }}>
                  {result.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Right: Twin-Ladder Bridge Interpretation */}
          <div className="card" style={{ borderLeft: '3px solid var(--brass)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--brass)' }}>
              Twin-Ladder Bridge Interpretation
            </h2>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 12, lineHeight: 1.6 }}>
              At real integer points <InlineMath tex={"s = n"} />, the twin-ladder model simplifies:
              both direct and dual ladders have <strong style={{ color: 'var(--ink)' }}>purely real</strong>{' '}
              transfer functions. The Euler product becomes a product of real factors:
            </p>
            <BlockMath tex={"\\zeta(2n+1) = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-(2n+1)}}"} />
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 12, lineHeight: 1.6 }}>
              Each prime <InlineMath tex={"p"} /> contributes a stage with transfer function{' '}
              <InlineMath tex={"H_p(n) = 1/(1 - p^{-n})"} />. The "impedance" at stage <InlineMath tex={"p"} /> is:
            </p>
            <BlockMath tex={"Z_p(n) = n\\log p + \\frac{\\log p}{n}"} />
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 12, lineHeight: 1.6 }}>
              For larger <InlineMath tex={"n"} />, the factor <InlineMath tex={"p^{-n}"} /> decays exponentially
              fast, so fewer primes matter. This is why <InlineMath tex={"\\zeta(n) \\to 1"} /> as{' '}
              <InlineMath tex={"n \\to \\infty"} />: the oscillator chain becomes nearly transparent.
            </p>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              This product representation is exact but does not determine rationality. Infinite
              products of rational factors can have rational or irrational limits; a proof for an
              odd zeta value must add quantitative arithmetic control of denominators and errors.
            </p>
          </div>
        </div>

        {/* ─── Key Equations ─── */}
        <div className="card" style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Key Equations</h2>

          <h3 style={{ color: 'var(--green)', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
            Apery's Theorem (1979)
          </h3>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 8 }}>
            The value <InlineMath tex={"\\zeta(3) = \\sum_{n=1}^{\\infty} 1/n^3"} /> is irrational.
            Apery's proof used the rapidly converging series:
          </p>
          <BlockMath tex={"\\zeta(3) = \\frac{5}{2} \\sum_{n=1}^{\\infty} \\frac{(-1)^{n-1}}{n^3 \\binom{2n}{n}}"} />
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 16 }}>
            and the recurrence <InlineMath tex={"(n+1)^3 a_{n+1} = (2n+1)(17n^2+17n+5)a_n - n^3 a_{n-1}"} />,
            whose solutions <InlineMath tex={"a_n/b_n \\to \\zeta(3)"} /> at rate{' '}
            <InlineMath tex={"\\sim (1+\\sqrt{2})^{-4n}"} />.
          </p>

          <h3 style={{ color: 'var(--blue)', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
            Euler Product at Odd Integers
          </h3>
          <BlockMath tex={"\\zeta(2n+1) = \\prod_{p} \\frac{1}{1 - p^{-(2n+1)}} = \\prod_{p} \\left(1 + p^{-(2n+1)} + p^{-2(2n+1)} + \\cdots \\right)"} />

          <h3 style={{ color: 'var(--brass)', fontSize: 15, fontWeight: 600, marginBottom: 8, marginTop: 16 }}>
            Even vs Odd: The Asymmetry
          </h3>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 8 }}>
            Even zeta values have closed forms via Bernoulli numbers:
          </p>
          <BlockMath tex={"\\zeta(2) = \\frac{\\pi^2}{6}, \\quad \\zeta(4) = \\frac{\\pi^4}{90}, \\quad \\zeta(6) = \\frac{\\pi^6}{945}"} />
          <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
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

        <div className="card" style={{ marginTop: 32, borderColor: 'var(--blue)' }}>
          <h3 style={{ color: 'var(--blue)' }}>What to Explore in Each Tab</h3>
          <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--blue)' }}>Values & Convergence</strong> shows how the Euler product partial
            products build up <InlineMath tex={"\\zeta(n)"} /> prime by prime. Watch how odd values (3, 5, 7, ...)
            converge more slowly than even values — each prime's contribution <InlineMath tex={"(1 - p^{-n})^{-1}"} /> is
            closer to 1 for larger <InlineMath tex={"n"} />, so small primes dominate. Try increasing the prime count
            and notice how the partial product locks in quickly for <InlineMath tex={"\\zeta(7)"} /> but takes longer
            for <InlineMath tex={"\\zeta(3)"} />.
            <strong style={{ color: 'var(--green)' }}> Apery Sequences</strong> plots the rational approximants{' '}
            <InlineMath tex={"a_n / b_n"} /> from Apery's recurrence, showing their exponential convergence
            to <InlineMath tex={"\\zeta(3)"} /> at rate <InlineMath tex={"(1 + \\sqrt{2})^{-4n}"} />. The log-error
            plot reveals the constant convergence rate — a straight line on the log scale confirms the
            geometric nature of the approximation.
            <strong style={{ color: 'var(--brass-dk)' }}> Transfer Function</strong> visualizes{' '}
            <InlineMath tex={"|H_p(s)| = |1 - p^{-s}|^{-1}"} /> for individual prime stages at real integer
            arguments. Compare how the transfer function magnitude changes between even and odd{' '}
            <InlineMath tex={"s"} /> — at even integers the dual ladder provides <InlineMath tex={"\\pi"} />-dependent
            information, while at odd integers the dual maps to a trivial zero.
            <strong style={{ color: 'var(--brass)' }}> Model Gram Geometry</strong> displays a positive
            Gram matrix built from prime-indexed feature vectors. Its determinant measures independence
            of those model vectors only; it cannot test <InlineMath tex={"\\mathbb Q"} />-linear relations
            among the numerical zeta values.
            <strong style={{ color: 'var(--terra-dk)' }}> Approximation Slopes</strong> finds finite
            continued-fraction approximations{' '}
            <InlineMath tex={"p/q"} /> and plotting <InlineMath tex={"\\log|\\zeta(n) - p/q|"} /> vs{' '}
            <InlineMath tex={"\\log q"} />. The fitted slope is exploratory and is not a certified
            irrationality exponent. The displayed <InlineMath tex={"\\mu(\\zeta(3)) \\leq 5.51"} /> value
            is a separate rigorous theorem.
          </p>
        </div>

        {/* ─── Ball-Rivoal Theorem Context ─── */}
        <div className="card" style={{ marginTop: 32, borderLeft: '3px solid var(--green)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--green)' }}>
            Ball-Rivoal Theorem: Infinitely Many Irrational Odd Zeta Values
          </h2>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 12 }}>
            In 2001, Tanguy Rivoal proved a landmark result: <em>infinitely many</em> of the odd zeta values
            {' '}<InlineMath tex={"\\zeta(3), \\zeta(5), \\zeta(7), \\ldots"} /> are irrational. More precisely,
            letting <InlineMath tex={"\\delta(s)"} /> denote the dimension of the{' '}
            <InlineMath tex={"\\mathbb{Q}"} />-vector space spanned by{' '}
            <InlineMath tex={"1, \\zeta(3), \\zeta(5), \\ldots, \\zeta(s)"} />, Rivoal showed:
          </p>
          <BlockMath tex={"\\delta(s) \\geq \\frac{1 + \\log 2}{3 + \\log 2} \\cdot \\frac{\\log s}{2} \\qquad \\text{for odd } s \\geq 3"} />
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 12 }}>
            In particular, <InlineMath tex={"\\delta(s) \\to \\infty"} /> as <InlineMath tex={"s \\to \\infty"} />, so
            infinitely many odd zeta values are irrational. Keith Ball and Rivoal later refined this via
            a "well-poised hypergeometric" construction: they produced linear forms
          </p>
          <BlockMath tex={"r_n = a_{n,0} + a_{n,1}\\zeta(3) + a_{n,2}\\zeta(5) + \\cdots + a_{n,k}\\zeta(2k+1)"} />
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 12 }}>
            with <InlineMath tex={"a_{n,j} \\in \\mathbb{Z}"} /> and <InlineMath tex={"r_n \\to 0"} /> but{' '}
            <InlineMath tex={"r_n \\neq 0"} />, built from the integral
          </p>
          <BlockMath tex={"r_n = \\int_0^1 \\cdots \\int_0^1 \\frac{\\prod_{j=1}^{n} x_j^a (1-x_j)^a}{Q(x_1 \\cdots x_s)^{n+1}} \\, dx_1 \\cdots dx_s"} />
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 12 }}>
            The key innovation is the "well-poised" symmetry of these integrals, which forces all <em>even</em>{' '}
            zeta coefficients to vanish, isolating the odd values. Zudilin (2001) strengthened this to show
            at least one of <InlineMath tex={"\\zeta(5), \\zeta(7), \\zeta(9), \\zeta(11)"} /> is irrational,
            using a refined saddle-point analysis and arithmetic properties of binomial sums.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <div style={{ padding: 16, background: 'var(--paper)', borderRadius: 8, border: '1px solid var(--hairline)' }}>
              <h3 style={{ color: 'var(--green)', fontSize: 14, marginBottom: 8 }}>What We Know</h3>
              <ul style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 2, paddingLeft: 16 }}>
                <li><InlineMath tex={"\\zeta(3)"} /> is irrational (Apery, 1979)</li>
                <li>Infinitely many <InlineMath tex={"\\zeta(2n+1)"} /> are irrational (Rivoal, 2000)</li>
                <li>At least one of <InlineMath tex={"\\zeta(5), \\zeta(7), \\zeta(9), \\zeta(11)"} /> is irrational (Zudilin, 2001)</li>
                <li><InlineMath tex={"\\delta(s) \\geq c \\log s"} /> for an explicit constant <InlineMath tex={"c > 0"} /></li>
              </ul>
            </div>
            <div style={{ padding: 16, background: 'var(--paper)', borderRadius: 8, border: '1px solid var(--hairline)' }}>
              <h3 style={{ color: 'var(--brass-dk)', fontSize: 14, marginBottom: 8 }}>What Remains Open</h3>
              <ul style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 2, paddingLeft: 16 }}>
                <li>Is <InlineMath tex={"\\zeta(5)"} /> individually irrational?</li>
                <li>Are <InlineMath tex={"\\zeta(3)"} /> and <InlineMath tex={"\\zeta(5)"} /> linearly independent over <InlineMath tex={"\\mathbb{Q}"} />?</li>
                <li>Is the true growth rate <InlineMath tex={"\\delta(s) \\sim s/2"} /> (full independence)?</li>
                <li>Does the method extend to prove transcendence of any <InlineMath tex={"\\zeta(2n+1)"} />?</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ─── Numerical Reference Table ─── */}
        <div className="card" style={{ marginTop: 32, borderLeft: '3px solid var(--green)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--green)' }}>
            Numerical Reference Values
          </h2>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 16 }}>
            High-precision values of odd zeta computed via the Euler product.
            As <InlineMath tex={"n"} /> grows, <InlineMath tex={"\\zeta(n) \\to 1"} /> rapidly:
            the oscillator chain becomes nearly transparent and the prime-2 factor dominates.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
                  <th style={{ color: 'var(--faint)', textAlign: 'left', padding: '6px 12px', fontWeight: 600 }}>n</th>
                  <th style={{ color: 'var(--faint)', textAlign: 'right', padding: '6px 12px', fontWeight: 600 }}>&zeta;(n)</th>
                  <th style={{ color: 'var(--faint)', textAlign: 'right', padding: '6px 12px', fontWeight: 600 }}>&zeta;(n) &minus; 1</th>
                  <th style={{ color: 'var(--faint)', textAlign: 'left', padding: '6px 12px', fontWeight: 600 }}>Known status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(ZETA_EXACT).map(([n, val]) => {
                  const isKnownIrrational = n === '3';
                  const isZudilinGroup = ['5', '7', '9', '11'].includes(n);
                  return (
                    <tr key={n} style={{ borderBottom: '1px solid var(--hairline)' }}>
                      <td style={{ color: 'var(--ink)', padding: '6px 12px' }}>
                        <InlineMath tex={`\\zeta(${n})`} />
                      </td>
                      <td style={{ color: 'var(--blue)', textAlign: 'right', padding: '6px 12px' }}>
                        {val.toFixed(10)}
                      </td>
                      <td style={{ color: 'var(--faint)', textAlign: 'right', padding: '6px 12px', fontSize: 11 }}>
                        {(val - 1).toExponential(3)}
                      </td>
                      <td style={{ padding: '6px 12px' }}>
                        {isKnownIrrational ? (
                          <span style={{ color: 'var(--green)', fontSize: 11 }}>{'irrational (Apéry 1979)'}</span>
                        ) : isZudilinGroup ? (
                          <span style={{ color: 'var(--brass-dk)', fontSize: 11 }}>{'≥1 of {5,7,9,11} irrational (Zudilin 2001)'}</span>
                        ) : (
                          <span style={{ color: 'var(--faint)', fontSize: 11 }}>{'unknown individually'}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 11, color: 'var(--faint)', marginTop: 12, fontStyle: 'italic' }}>
            {'Ball–Rivoal guarantees infinitely many are irrational. As of August 2026, only ζ(3) is individually confirmed irrational.'}
          </p>
        </div>

        {/* ─── Open Problems ─── */}
        <div className="card" style={{ marginTop: 32, borderLeft: '3px solid var(--terra-dk)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--terra-dk)' }}>
            Open Problems
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--brass-dk)', marginBottom: 6 }}>
                Irrationality of Individual Values
              </h3>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                Is <InlineMath tex={"\\zeta(5)"} /> irrational? This is one of the most famous open problems
                in number theory. Zudilin showed at least one of{' '}
                <InlineMath tex={"\\zeta(5), \\zeta(7), \\zeta(9), \\zeta(11)"} /> is irrational,
                but we cannot determine which.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--brass-dk)', marginBottom: 6 }}>
                Linear Independence
              </h3>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                Are <InlineMath tex={"\\zeta(3), \\zeta(5), \\zeta(7), \\ldots"} /> linearly independent
                over <InlineMath tex={"\\mathbb{Q}"} />? Ball-Rivoal proved the span has dimension{' '}
                <InlineMath tex={"\\geq c \\cdot \\log(s)"} />, but full independence is unknown.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--brass-dk)', marginBottom: 6 }}>
                Irrationality Measures
              </h3>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                For <InlineMath tex={"\\zeta(3)"} />, the best known bound is{' '}
                <InlineMath tex={"\\mu(\\zeta(3)) \\leq 5.513891"} /> (Rhin-Viola, 2001).
                Is the true measure 2 (as for "generic" irrationals)? What about{' '}
                <InlineMath tex={"\\mu(\\zeta(5))"} />?
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--brass-dk)', marginBottom: 6 }}>
                Transcendence
              </h3>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                Is <InlineMath tex={"\\zeta(3)"} /> transcendental? Almost certainly yes, but current
                methods cannot prove it. Even showing <InlineMath tex={"\\zeta(3)/\\pi^3"} /> is irrational
                would be a breakthrough.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Twin-Ladder Bridge Connection ─── */}
        <div className="card" style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Twin-Ladder Bridge Perspective: Why Odd Values are Harder</h2>
          <ul style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.8, paddingLeft: 20 }}>
            <li>
              <strong style={{ color: 'var(--ink)' }}>Even values</strong> correspond to the functional equation
              mapping <InlineMath tex={"\\zeta(2n)"} /> to <InlineMath tex={"\\zeta(1-2n)"} />,
              where the bridge factor <InlineMath tex={"\\chi(2n)"} /> introduces{' '}
              <InlineMath tex={"\\pi^{2n}"} /> through the Gamma function. The bridge "encodes" pi.
            </li>
            <li>
              <strong style={{ color: 'var(--ink)' }}>Odd values</strong> map to trivial zeros:{' '}
              <InlineMath tex={"\\zeta(2n+1) \\to \\zeta(-2n) = 0"} />. The bridge at odd integers
              is "singular" — it carries no useful information back from the dual ladder.
            </li>
            <li>
              In the <strong style={{ color: 'var(--ink)' }}>oscillator chain</strong> picture, even zeta values
              correspond to resonant modes where the direct and dual ladders constructively interfere
              (producing <InlineMath tex={"\\pi"} />-dependent closed forms), while odd values correspond to
              anti-resonant modes where the dual ladder contributes nothing.
            </li>
            <li>
              The absence of an even-style closed form is a useful visual analogy, but it does not imply
              irrationality. No general principle prevents an infinite rational product from converging
              to a rational number.
            </li>
          </ul>
        </div>

        {/* ─── Odd Zeta Irrationality via the Explicit Formula and the Twin-Ladder Bridge Model ─── */}
        <div className="card" style={{ marginTop: 32, borderLeft: '3px solid var(--terra-dk)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--terra-dk)' }}>
            Connecting Irrationality Proofs to Twin-Ladder Bridge via the Explicit Formula
          </h2>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 12 }}>
            The von Mangoldt explicit formula provides a spectral decomposition of the prime-counting
            function in terms of zeta zeros:
          </p>
          <BlockMath tex={"\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} - \\log(2\\pi) - \\frac{1}{2}\\log(1 - x^{-2})"} />
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 12 }}>
            Each nontrivial zero <InlineMath tex={"\\rho = \\beta + i\\gamma"} /> contributes an oscillatory
            correction <InlineMath tex={"x^{\\rho}/\\rho"} /> to the prime distribution. In the Twin-Ladder Bridge ladder model,
            these zeros are the resonant frequencies of the coupled oscillator chain. Evaluating
            {' '}<InlineMath tex={"\\zeta(s)"} /> at an odd integer <InlineMath tex={"s = 2n+1"} /> amounts to
            "reading off" the total response of the ladder at a specific real frequency.
          </p>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 12 }}>
            The logarithmic derivative connects the Euler product to the von Mangoldt function:
          </p>
          <BlockMath tex={"-\\frac{\\zeta'(s)}{\\zeta(s)} = \\sum_{n=1}^{\\infty} \\frac{\\Lambda(n)}{n^s} = \\sum_{p} \\frac{\\log p}{p^s - 1}"} />
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 12 }}>
            At <InlineMath tex={"s = 2n+1"} />, this becomes a sum over prime powers weighted by{' '}
            <InlineMath tex={"\\log p"} />, and the partial fraction expansion over the zeros gives:
          </p>
          <BlockMath tex={"\\frac{\\xi'(s)}{\\xi(s)}=\\sum_{\\rho}^{*}\\frac{1}{s-\\rho}"} />
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 16 }}>
            Here the star denotes the standard symmetric/regularized interpretation for the completed
            zeta function <InlineMath tex={"\\xi"} />. This identity links prime and zero spectra, but
            it supplies no known implication for the rationality of an individual value{' '}
            <InlineMath tex={"\\zeta(2n+1)"} />. The filter language is therefore an analogy, not a
            reinterpretation of the Ball–Rivoal nonvanishing theorem.
          </p>

          <div style={{ padding: 16, background: 'var(--paper)', borderRadius: 8, border: '1px solid var(--hairline)' }}>
            <h3 style={{ color: 'var(--terra-dk)', fontSize: 14, marginBottom: 8 }}>Twin-Ladder Bridge Ladder Interpretation</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginBottom: 8 }}>
              The explicit formula decomposes <InlineMath tex={"\\zeta(s)"} /> into a product over primes (the
              ladder stages) and a sum over zeros (the resonances). At even integers, the functional equation
              relates both sides via <InlineMath tex={"\\Gamma"} />-factors that introduce <InlineMath tex={"\\pi"} />.
              At odd integers, the functional equation degenerates into a zero-times-pole limiting identity:
            </p>
            <BlockMath tex={"\\zeta(2n+1)=\\prod_p(1-p^{-(2n+1)})^{-1},\\qquad \\zeta(-2n)=0"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 8 }}>
              Unlike the even case, this gives no direct Bernoulli-number formula. It is not known that
              <InlineMath tex={"\\zeta(2n+1)/\\pi^{2n+1}"} /> is irrational or even non-rational in
              general, so the “broken bridge” explains the failure of this evaluation method, not the
              arithmetic nature of the value.
            </p>
          </div>
        </div>

        {/* ─── Audited information-theory route ─── */}
        <div className="card" style={{ marginTop: 32, borderLeft: '3px solid var(--terra-dk)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--terra-dk)' }}>
            Algorithmic Incompressibility: No-Go Theorem
          </h2>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 12 }}>
            The ordinary Kolmogorov-complexity route is <strong style={{ color: 'var(--ink)' }}>refuted as
            stated</strong>, rather than merely incomplete. If <InlineMath tex={"d_b(x,N)"} /> is a certified
            <InlineMath tex={"N"} />-digit prefix of a fixed computable real, one fixed program reads{' '}
            <InlineMath tex={"N,b"} /> and prints it. Hence
          </p>
          <BlockMath tex={"K(d_b(x,N)\\mid N,b)=O_x(1),\\qquad K(d_b(x,N))\\le K(N)+O_x(1)=O_x(\\log N)."} />
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 12 }}>
            Every fixed <InlineMath tex={"\\zeta(k)"} /> with <InlineMath tex={"k>1"} /> is computable. For example,
          </p>
          <BlockMath tex={"0<\\zeta(k)-\\sum_{r=1}^{M}r^{-k}<\\frac{M^{1-k}}{k-1}"} />
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 12 }}>
            is an effective error bound. Therefore the conjectured lower bound{' '}
            <InlineMath tex={"K\\ge cN^\\alpha"} /> cannot hold for an odd zeta value: it would imply
            noncomputability. Chaitin's <InlineMath tex={"\\Omega"} /> is different because it encodes the
            undecidable halting set. The primes and the Euler product are computable, and the Euler product
            itself is a short description. Ordinary Kolmogorov complexity does not charge for runtime or
            for the number of prime factors evaluated.
          </p>
          <div style={{ padding: 12, background: 'color-mix(in srgb, var(--series-2) 8%, transparent)', borderRadius: 6, border: '1px solid color-mix(in srgb, var(--series-2) 30%, transparent)' }}>
            <strong style={{ color: 'var(--terra-dk)', fontSize: 12 }}>Audit status: {oddZetaAudit.status}</strong>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, margin: '6px 0 0' }}>
              The statement “rational iff prefix complexity is <InlineMath tex={"O(\\log N)"} />” is false:
              every computable irrational, including <InlineMath tex={"\\sqrt2"} />, <InlineMath tex={"\\pi"} />,
              and <InlineMath tex={"\\zeta(3)"} />, has the same upper bound. Maximum Shannon capacity also
              says nothing about the complexity of one fixed output, and odd special values lie at{' '}
              <InlineMath tex={"\\sigma=3,5,\\ldots"} />, not at <InlineMath tex={"\\sigma=1/2"} />.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 32, borderLeft: '3px solid var(--blue)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--blue)' }}>
            The Rigorous Information Budget
          </h2>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 12 }}>
            There is a useful information-theoretic reformulation, but its “bits” are arithmetic. For a
            rational linear form <InlineMath tex={"\\ell_n=a_n\\zeta(5)-b_n"} /> and a clearing factor{' '}
            <InlineMath tex={"D_n"} /> with <InlineMath tex={"D_na_n,D_nb_n\\in\\mathbb Z"} />, define
          </p>
          <BlockMath tex={"G_n=-\\log|\\ell_n|-\\log D_n."} />
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 12 }}>
            A proof must certify <InlineMath tex={"\\ell_n\\ne0"} /> and{' '}
            <InlineMath tex={"G_n\\to+\\infty"} />. Then the integer forms{' '}
            <InlineMath tex={"D_n\\ell_n=A_n\\zeta(5)-B_n"} /> are nonzero and tend to zero, contradicting
            any hypothetical <InlineMath tex={"\\zeta(5)=p/q"} />. This is the classical irrationality
            architecture expressed as analytic cancellation bits minus denominator bits.
          </p>
          <div className="two-col" style={{ gap: 16 }}>
            <div style={{ padding: 12, background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)', borderRadius: 8 }}>
              <h3 style={{ color: 'var(--brass-dk)', fontSize: 13, marginBottom: 6 }}>Why naive truncation loses</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                With <InlineMath tex={"d_M=\\operatorname{lcm}(1,\\ldots,M)"} />, clearing the denominators
                of <InlineMath tex={"\\sum_{r\\le M}r^{-5}"} /> costs{' '}
                <InlineMath tex={"d_M^5=\\exp(5M+o(M))"} />, while the tail is only{' '}
                <InlineMath tex={"\\sim1/(4M^4)"} />. The cleared error grows. Prime truncation encounters
                the same exponential-denominator versus polynomial-tail barrier.
              </p>
            </div>
            <div style={{ padding: 12, background: 'color-mix(in srgb, var(--series-1) 8%, transparent)', borderRadius: 8 }}>
              <h3 style={{ color: 'var(--blue)', fontSize: 13, marginBottom: 6 }}>Digit-complexity salvage</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                Proving that the base-<InlineMath tex={"b"} /> expansion is not eventually periodic—via
                factor complexity or finite-state dimension—would imply irrationality and is compatible
                with computability. But no such theorem is known for <InlineMath tex={"\\zeta(5)"} />;
                any finite digit sample is compatible with an eventually periodic continuation.
              </p>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, margin: '8px 0 0' }}>
                A time-bounded version is valid only for <em>exact canonical digits</em>: rationals have a
                constant-size, linear-time long-division program. Certified Cauchy approximations do not help;
                fixed zeta values can be approximated in <InlineMath tex={"p^{3/2+o(1)}"} /> bit operations.
                Exact digit extraction instead meets the Diophantine carry boundary{' '}
                <InlineMath tex={"\\lVert b^N\\zeta(5)\\rVert"} />.
              </p>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: 12, background: 'color-mix(in srgb, var(--series-1) 6%, transparent)', borderRadius: 8 }}>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: 'var(--blue)' }}>One unconditional ensemble theorem:</strong>{' '}
              Zudilin's result that at least one of{' '}
              <InlineMath tex={"\\zeta(5),\\zeta(7),\\zeta(9),\\zeta(11)"} /> is irrational implies that their
              simultaneous digit-vector word is aperiodic in every fixed base. Its factor complexity therefore
              satisfies <InlineMath tex={"p_v(\\ell)\\ge \\ell+1"} /> for every{' '}
              <InlineMath tex={"\\ell"} />. This is genuine odd-zeta information, but it does not identify which
              coordinate is irrational.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 32, borderLeft: '3px solid var(--green)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--green)' }}>
            Two Exact Research Frontiers
          </h2>
          <div className="two-col" style={{ gap: 16 }}>
            <div style={{ padding: 12, background: 'var(--paper)', borderRadius: 8, border: '1px solid var(--hairline)' }}>
              <h3 style={{ color: 'var(--green)', fontSize: 13, marginBottom: 6 }}>Internal: positive-cone / Farey</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                Exact kernels produce nested rational brackets <InlineMath tex={"I_n=(L_n,U_n)"} /> around{' '}
                <InlineMath tex={"\\zeta(5)"} /> in every audited case through <InlineMath tex={"n=50"} />.
                The proof target is to show that the least reduced denominator{' '}
                <InlineMath tex={"h(I_n)\\to\\infty"} />, equivalently to prove recurring Stern–Brocot
                exclusion signs or a uniform balanced-cylinder determinant inequality. Finite verification
                is evidence only; denominator escape is essentially the irrationality step.
              </p>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, margin: '8px 0 0' }}>
                The exact run certifies 187 continued-fraction entries and, conditionally on rationality, a
                96-digit lower bound for the denominator. Empirically{' '}
                <InlineMath tex={"-\\log_{10}(U_n-L_n)\\sim3.84583n"} /> and{' '}
                <InlineMath tex={"\\log_{10}h(I_n)\\sim1.91890n"} />, but the exclusion side is irregular and the
                elementary endpoint determinant bound deteriorates. No symbolic escape recurrence has emerged.
              </p>
            </div>
            <div style={{ padding: 12, background: 'var(--paper)', borderRadius: 8, border: '1px solid var(--hairline)' }}>
              <h3 style={{ color: 'var(--blue)', fontSize: 13, marginBottom: 6 }}>External: Brown 2026</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                Brown's multi-parameter Mellin/transfinite-diameter criterion suggests lifting the
                Brown–Zudilin <InlineMath tex={"M_{0,8}"} /> family from one parameter ray to growing
                projected moment modules. A viable application must prove infinitely many moment
                determinants are nonzero, clear the exact denominator lattices, and establish a strict
                transfinite-diameter/denominator product below one. The criterion is proved, but no{' '}
                <InlineMath tex={"\\zeta(5)"} /> application is currently complete.
              </p>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, margin: '8px 0 0' }}>
                The head-on source audit found that the five-LCM denominator input is explicitly called
                experimental, its exact normalization fails even at the strictly interior symmetric point,
                and the displayed projected residue contour has a factor-two error plus missing wall terms.
                The reproduced scalar budget is therefore conditional:{' '}
                <InlineMath tex={"C_0=-31.55297"} /> and <InlineMath tex={"C_2=49.60575"} />, leaving{' '}
                <InlineMath tex={"C_0+C_2=18.05278"} /> nats, or <InlineMath tex={"26.04465"} /> missing bits,
                per step.
              </p>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, margin: '8px 0 0' }}>
                The first five-ray box is <InlineMath tex={"Q"} />-degenerate but not moment-degenerate:{' '}
                <InlineMath tex={"Q(a(v))=0"} /> off the origin, while its first rational tail has determinant{' '}
                <InlineMath tex={"95/2^{20}"} />. Exact HPL reduction now certifies the complete degree-two and
                rectangular <InlineMath tex={"n=2"} /> moment tables, rather than recognizing them numerically.
                On the <InlineMath tex={"e_1"} /> ray it also gives
              </p>
              <BlockMath tex={"I'(ne_1)=-\\frac{(H_n^{(2)})^2-H_n^{(4)}}{4n}\\sim-\\frac{\\pi^4}{240n}."} />
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, margin: '8px 0 0' }}>
                Its nonrational generating function proves, by Kronecker's theorem, infinitely many nonzero
                principal Hankel determinants without relying on the printed scalar recurrence. Nonvanishing is
                therefore real progress, but it is no longer the leading obstruction.
              </p>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, margin: '8px 0 0' }}>
                The arithmetic and analytic shortcuts fail more sharply. The proposed five-LCM multiplier gives{' '}
                <InlineMath tex={"d_4^5 I'(2,2,2,2,2)=-6897/5"} />, so even the candidate correction factor{' '}
                <InlineMath tex={"12"} /> fails. More generally, exact partial fractions prove{' '}
                <InlineMath tex={"v_p(I')=-1"} /> and <InlineMath tex={"pI'\\equiv4\\pmod p"} /> for prime{' '}
                <InlineMath tex={"p=2n+1"} />, while <InlineMath tex={"p\\nmid d_{2n}^5"} />. Thus no fixed factor
                repairs this lattice on the cone. The wall corrections form an unbounded Leray-jet tower rather than a
                fixed face measure, so ordinary Andréief and the old real path-polytope capacity do not apply.
                The former <InlineMath tex={"e^{-13/4}"} /> benchmark is therefore withdrawn, not retained as a
                proof-ready target.
              </p>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, margin: '8px 0 0' }}>
                The remaining rank-one capacity target is now closed structurally. Writing{' '}
                <InlineMath tex={"\\det M_n=\\det R_n(\\zeta(5)-s_n)"} />, every multiplier that makes the{' '}
                <InlineMath tex={"\\zeta(5)"} /> coefficient a nonzero integer satisfies{' '}
                <InlineMath tex={"|d_n\\det R_n|\\ge1"} />. On the old origin-containing comparison region, the
                full and constant-deleted Vandermonde suprema differ by at most the factor{' '}
                <InlineMath tex={"N_n"} />, so both determinants have the same leading capacity exponent.
                Therefore the hoped-for strict normalization rate below <InlineMath tex={"3.09990"} /> is
                impossible for that common absolute-capacity argument. The exact <InlineMath tex={"n=2"} />
                primitive rate <InlineMath tex={"2.77593"} /> is a pre-asymptotic symmetry cancellation, not a
                route around the obstruction.
              </p>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, margin: '8px 0 0' }}>
                A larger exact four-ray certificate reaches tail size <InlineMath tex={"224"} /> at{' '}
                <InlineMath tex={"n=5"} />. Its primitive rates rise{' '}
                <InlineMath tex={"1.95857,\\,2.37462,\\,2.50584,\\,2.56840"} /> while the Schur denominator keeps a
                positive exponential rate—useful diagnostics, but consistent with the no-go. Separately, an
                explicit holonomic counterexample proves that one-ray Kronecker nonrationality and zero global
                annihilator do not imply nonsingular multivariate boxes.
              </p>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, margin: '8px 0 0' }}>
                Two Brown-style routes remain honest: a genuinely relative estimate for{' '}
                <InlineMath tex={"|\\zeta(5)-s_n|"} /> that beats the reduced denominator{' '}
                <InlineMath tex={"q_n"} />, or a higher-rank period module. An exact strict-positive
                five-direction candidate has a nonsingular 6-by-6 <InlineMath tex={"Q"} />-matrix and nonzero
                Mellin Jacobian, but its capacity is only numerical, its conditional denominator rate already
                loses, and the projected <InlineMath tex={"I'"} /> cycle remains unconstructed.
              </p>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: 12, background: 'color-mix(in srgb, var(--brass) 8%, transparent)', borderRadius: 8 }}>
            <h3 style={{ color: 'var(--brass-dk)', fontSize: 13, marginBottom: 6 }}>Next falsifiable computation</h3>
            <ol style={{ margin: '0 0 0 18px', color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8 }}>
              {oddZetaAudit.nextExperiment.map(step => <li key={step}>{step}</li>)}
            </ol>
          </div>
          <p style={{ color: 'var(--faint)', fontSize: 11, lineHeight: 1.7, marginTop: 12 }}>
            Research status, 29 August 2026. Neither frontier is presented as a proof of{' '}
            <InlineMath tex={"\\zeta(5)"} /> irrationality.
          </p>
        </div>


        {/* ─── Related Pages ─── */}
        <div className="card" style={{ marginTop: 32, borderColor: 'var(--hairline)' }}>
          <h3 style={{ color: 'var(--ink-soft)' }}>Related Pages</h3>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8 }}>
            Explore related topics:{' '}
            <Link to="/concepts" style={{ color: 'var(--brass)' }}>Core Concepts</Link>{' '}
            (Twin-Ladder Bridge model foundations and the twin-ladder framework),{' '}
            <Link to="/fourier" style={{ color: 'var(--blue)' }}>Fourier Domain</Link>{' '}
            (spectral decomposition of primes and the explicit formula),{' '}
            <Link to="/info-theory" style={{ color: 'var(--green)' }}>Information Theory</Link>{' '}
            (the computability audit and arithmetic information budget),{' '}
            <Link to="/spectral-attack" style={{ color: 'var(--brass-dk)' }}>Spectral Approach</Link>{' '}
            (unified potential and Fourier-information synthesis).
          </p>
          <p style={{ marginTop: 12 }}>
            <Link to="/" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>← the atlas</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
