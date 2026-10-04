import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCriticisms, getCriticismsByCategory, getCriticismsBySeverity, SEVERITY_META, CATEGORY_META } from '../data/criticisms.js';
import { MathText, BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import RHRigorViz from '../components/RHRigorViz.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';

// Editorial (warm) re-theme: full-width shell, identical structure/data/rigor
// ledger. Color mapping from the dark-theme accents (kept consistent with
// other editorial ports, e.g. ThetaBasinClosurePage.jsx / TwinLadderPage.jsx):
//   #ef4444 red     -> var(--terra-dk)
//   #10b981 green   -> var(--green)
//   #f59e0b amber   -> var(--brass-dk)
//   #3b82f6 blue    -> var(--blue)
//   #06b6d4 cyan    -> var(--blue)
//   #8b5cf6 / #a78bfa purple -> var(--terra)
//   #94a3b8 / #cbd5e1 muted body text -> var(--ink-soft)
//   #e2e8f0 strong text on dark box -> var(--ink)
//   #64748b / #334155 slate meta -> var(--faint) / var(--hairline)
//   #1a1f36 dark nested-box bg -> var(--paper3)
// .card / .exploration-entry / .filter-btn / .tag classes are left as-is:
// they resolve through --bg-card/--border/--text-* tokens that .ed-root
// already remaps to the warm palette.

const STATUS_LABELS = {
  open: { label: 'Open', color: 'var(--terra-dk)' },
  patched: { label: 'Patched', color: 'var(--green)' },
  disputed: { label: 'Disputed', color: 'var(--brass-dk)' },
};

function truncateMathSafe(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  let truncated = text.slice(0, maxLen);
  // Check for unclosed $$ (display math)
  const ddMatches = truncated.match(/\$\$/g) || [];
  if (ddMatches.length % 2 !== 0) {
    const lastDD = truncated.lastIndexOf('$$');
    truncated = truncated.slice(0, lastDD);
  }
  // Check for unclosed $ (inline math) after removing $$
  const withoutDD = truncated.replace(/\$\$/g, '');
  const singleCount = (withoutDD.match(/\$/g) || []).length;
  if (singleCount % 2 !== 0) {
    const lastDollar = truncated.lastIndexOf('$');
    truncated = truncated.slice(0, lastDollar);
  }
  return truncated + '...';
}

export default function RHRigorPage() {
  const [expandedId, setExpandedId] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const allCriticisms = getAllCriticisms();
  const bySeverity = getCriticismsBySeverity();
  const byCategory = getCriticismsByCategory();

  const filtered = allCriticisms.filter(c => {
    if (filterSeverity !== 'all' && c.severity !== filterSeverity) return false;
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    return true;
  });

  const openCount = allCriticisms.filter(c => c.status === 'open').length;
  const patchedCount = allCriticisms.filter(c => c.status === 'patched').length;
  const disputedCount = allCriticisms.filter(c => c.status === 'disputed').length;

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>RH Rigor Check</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.6, maxWidth: 760 }}>
            A systematic self-criticism of the Twin-Ladder Bridge model's claims about the Riemann Hypothesis.
            Each entry identifies a specific mathematical issue, explains why it matters, and proposes
            a corrected formulation. The goal is intellectual clarity: the Twin-Ladder Bridge model is a beautiful
            analogy, but analogies are not proofs.
          </p>
        </div>

        {/* Summary dashboard */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12, marginBottom: 24,
        }}>
          <div className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--terra-dk)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
              {openCount}
            </div>
            <div style={{ fontSize: 12, color: 'var(--faint)', marginTop: 4 }}>Open Issues</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
              {patchedCount}
            </div>
            <div style={{ fontSize: 12, color: 'var(--faint)', marginTop: 4 }}>Patched</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--brass-dk)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
              {disputedCount}
            </div>
            <div style={{ fontSize: 12, color: 'var(--faint)', marginTop: 4 }}>Disputed</div>
          </div>
          {Object.entries(bySeverity).map(([sev, items]) => (
            <div key={sev} className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
              <div style={{
                fontSize: 32, fontWeight: 700,
                color: SEVERITY_META[sev]?.color || 'var(--faint)',
                fontFamily: 'var(--ed-mono, var(--font-mono))',
              }}>
                {items.length}
              </div>
              <div style={{ fontSize: 12, color: 'var(--faint)', marginTop: 4 }}>
                {SEVERITY_META[sev]?.label || sev}
              </div>
            </div>
          ))}
        </div>

        {/* Core thesis card */}
        <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid var(--terra-dk)' }}>
          <h3 style={{ color: 'var(--terra-dk)', margin: '0 0 12px', fontSize: 16 }}>
            The Central Problem
          </h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            The Twin-Ladder Bridge model constructs a Hamiltonian <InlineMath tex={"H(\\sigma,t)"} /> that is minimized
            at <InlineMath tex={"\\sigma = 1/2"} /> and interprets this as evidence for RH. However, the
            Hamiltonian is <strong style={{ color: 'var(--ink)' }}>designed</strong> to have this minimum —
            it is not derived from the zeros of <InlineMath tex={"\\zeta"} />. The argument is:
          </p>
          <BlockMath tex={"\\text{Build symmetric } H \\;\\Rightarrow\\; \\min_{\\sigma} H = H(\\tfrac{1}{2}, t) \\;\\Rightarrow\\; \\text{``therefore RH''}"} />
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
            But the correct logical chain would require:
          </p>
          <BlockMath tex={"\\text{Derive } H \\text{ from } \\zeta \\;\\Rightarrow\\; \\text{Prove } \\min H \\iff \\zeta = 0 \\;\\Rightarrow\\; \\text{Prove } \\min H \\text{ at } \\sigma = \\tfrac{1}{2}"} />
          <p style={{ color: 'var(--brass-dk)', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
            The first two steps are missing. Without them, the Twin-Ladder Bridge model is a vivid illustration of what
            RH "looks like" in circuit language, but not a path to proving it. Below we enumerate every
            gap we've identified and show how to patch each one.
          </p>
        </div>

        {/* Numerical stress tests */}
        <div style={{ marginBottom: 32 }}>
          <h2 className="ed-h2" style={{ fontSize: 18, marginBottom: 12 }}>Numerical Stress Tests</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginBottom: 16 }}>
            Interactive diagnostics that probe specific Twin-Ladder Bridge claims. Each test comes with an interpretation
            explaining what the results actually show versus what the model claims.
          </p>
          <RHRigorViz />
        </div>

        {/* What to Explore guide card */}
        <div className="card" style={{ marginBottom: 32, borderColor: 'var(--brass-dk)' }}>
          <h3 style={{ color: 'var(--brass-dk)' }}>What to Explore in Each Stress Test</h3>
          <ul style={{ marginLeft: 16, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 2 }}>
            <li>
              <strong style={{ color: 'var(--blue)' }}>H Minimization:</strong> drag <InlineMath tex="t" /> through several zeta zeros
              (<InlineMath tex={"\\gamma \\approx 14.1, 21.0, 25.0"} />) and watch whether the blue trajectory stays on the
              green <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> line. Increase primes to see deviation shrink — then ask: is this convergence
              a genuine prediction, or is <InlineMath tex="H" /> engineered to minimize there?
            </li>
            <li>
              <strong style={{ color: 'var(--terra)' }}>Bridge |χ|:</strong> the heatmap shows where the bridge deviates from unitarity.
              The bright green band at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> confirms <InlineMath tex={"|\\chi| = 1"} /> on the critical line —
              but this is just the functional equation rephrased. Look for how quickly deviation grows off-line: a sharp ridge means
              the model is sensitive to <InlineMath tex={"\\sigma"} />, while a broad plateau means it is not.
            </li>
            <li>
              <strong style={{ color: 'var(--blue)' }}>Mismatch vs Zeros:</strong> compare the orange mismatch curve to the blue <InlineMath tex={"|\\zeta|"} /> curve.
              If they dip together at the same <InlineMath tex="t" /> values, the mismatch "predicts" zeros. Check the Pearson <InlineMath tex="r" /> in the
              top-right: a high correlation is suggestive but not proof, since both quantities are built from the same Euler product truncation.
              The red curve (off-line) should be systematically higher than orange (on-line) if the model distinguishes the critical line.
            </li>
          </ul>
        </div>

        {/* Filters */}
        <h2 className="ed-h2" style={{ fontSize: 18, marginBottom: 12 }}>Issue Registry</h2>
        <div className="filter-bar" style={{ marginBottom: 16 }}>
          <button
            className={`filter-btn ${filterSeverity === 'all' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('all')}
            aria-pressed={filterSeverity === 'all'}
          >
            All Severities ({allCriticisms.length})
          </button>
          {Object.entries(SEVERITY_META).map(([key, meta]) => (
            <button
              key={key}
              className={`filter-btn ${filterSeverity === key ? 'active' : ''}`}
              onClick={() => setFilterSeverity(key)}
              style={{ borderColor: filterSeverity === key ? meta.color : undefined }}
              aria-pressed={filterSeverity === key}
            >
              {meta.label} ({bySeverity[key]?.length || 0})
            </button>
          ))}
        </div>
        <div className="filter-bar" style={{ marginBottom: 16 }}>
          <button
            className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
            aria-pressed={filterCategory === 'all'}
          >
            All Categories
          </button>
          {byCategory.map(cat => (
            <button
              key={cat.name}
              className={`filter-btn ${filterCategory === cat.name ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat.name)}
              aria-pressed={filterCategory === cat.name}
            >
              {CATEGORY_META[cat.name]?.label || cat.name} ({cat.count})
            </button>
          ))}
        </div>
        <div className="filter-bar" style={{ marginBottom: 16 }}>
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
            aria-pressed={filterStatus === 'all'}
          >
            All Statuses
          </button>
          {Object.entries(STATUS_LABELS).map(([key, meta]) => {
            const count = allCriticisms.filter(c => c.status === key).length;
            return (
              <button
                key={key}
                className={`filter-btn ${filterStatus === key ? 'active' : ''}`}
                onClick={() => setFilterStatus(key)}
                style={{ borderColor: filterStatus === key ? meta.color : undefined }}
                aria-pressed={filterStatus === key}
              >
                {meta.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Criticism entries */}
        {filtered.map(crit => {
          const isExpanded = expandedId === crit.id;
          const sevMeta = SEVERITY_META[crit.severity] || {};
          const catMeta = CATEGORY_META[crit.category] || {};
          const statusMeta = STATUS_LABELS[crit.status] || STATUS_LABELS.open;

          return (
            <div
              key={crit.id}
              className="exploration-entry"
              onClick={() => setExpandedId(isExpanded ? null : crit.id)}
              style={{ cursor: 'pointer', borderLeft: `3px solid ${sevMeta.color}` }}
            >
              <div className="exploration-meta">
                <span className="tag" style={{
                  backgroundColor: `${sevMeta.color}20`,
                  color: sevMeta.color,
                  border: `1px solid ${sevMeta.color}40`,
                }}>
                  {sevMeta.icon} {sevMeta.label}
                </span>
                <span className="tag" style={{
                  backgroundColor: `${catMeta.color || 'var(--faint)'}20`,
                  color: catMeta.color || 'var(--faint)',
                  border: `1px solid ${catMeta.color || 'var(--faint)'}40`,
                }}>
                  {catMeta.label || crit.category}
                </span>
                <span className="tag" style={{
                  backgroundColor: `${statusMeta.color}20`,
                  color: statusMeta.color,
                  border: `1px solid ${statusMeta.color}40`,
                }}>
                  {statusMeta.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                  {crit.zpoComponent}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  display: 'inline-block', fontSize: 14, color: 'var(--faint)',
                  transition: 'transform 0.2s ease',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                }}>&#9654;</span>
                <h2 style={{ margin: 0, fontSize: 16 }}>{crit.title}</h2>
              </div>

              {!isExpanded && (
                <p style={{ marginTop: 8, fontSize: 13, color: 'var(--faint)' }}>
                  <MathText>{truncateMathSafe(crit.issue, 250)}</MathText>
                </p>
              )}

              {isExpanded && (
                <div style={{ marginTop: 16 }} onClick={e => e.stopPropagation()}>
                  {/* Original Claim */}
                  <div style={{
                    background: 'var(--paper3)', borderRadius: 8, padding: 16, marginBottom: 16,
                    borderLeft: '3px solid var(--blue)',
                  }}>
                    <h4 style={{ color: 'var(--blue)', fontSize: 12, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Twin-Ladder Bridge Model Claims
                    </h4>
                    <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                      <MathText>{crit.originalClaim}</MathText>
                    </p>
                  </div>

                  {/* The Issue */}
                  <div style={{
                    background: 'var(--paper3)', borderRadius: 8, padding: 16, marginBottom: 16,
                    borderLeft: '3px solid var(--terra-dk)',
                  }}>
                    <h4 style={{ color: 'var(--terra-dk)', fontSize: 12, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      What's Wrong
                    </h4>
                    <div style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
                      <MathText>{crit.issue}</MathText>
                    </div>
                  </div>

                  {/* Mathematical Fix */}
                  <div style={{
                    background: 'var(--paper3)', borderRadius: 8, padding: 16, marginBottom: 16,
                    borderLeft: '3px solid var(--green)',
                  }}>
                    <h4 style={{ color: 'var(--green)', fontSize: 12, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Corrected Formulation
                    </h4>
                    <div style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
                      <MathText>{crit.mathematicalFix}</MathText>
                    </div>
                  </div>

                  {/* Key Equations */}
                  {crit.latex && crit.latex.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <h4 style={{ fontSize: 12, color: 'var(--terra)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Key Equations
                      </h4>
                      {crit.latex.map((tex, i) => (
                        <BlockMath key={i} tex={tex} />
                      ))}
                    </div>
                  )}

                  {/* Patch note if patched */}
                  {crit.patch && (
                    <div style={{
                      background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', borderRadius: 8, padding: 12,
                      border: '1px solid color-mix(in srgb, var(--series-3) 20%, transparent)', marginBottom: 16,
                    }}>
                      <span style={{ color: 'var(--green)', fontWeight: 600, fontSize: 12 }}>PATCH: </span>
                      <span style={{ color: 'var(--ink-soft)', fontSize: 13 }}>{crit.patch}</span>
                    </div>
                  )}

                  {/* Related */}
                  {crit.relatedCriticisms && crit.relatedCriticisms.length > 0 && (
                    <div style={{ fontSize: 12, color: 'var(--faint)', marginTop: 12 }}>
                      Related issues: {crit.relatedCriticisms.map(id => {
                        const related = allCriticisms.find(c => c.id === id);
                        return related ? (
                          <span
                            key={id}
                            style={{ color: 'var(--blue)', cursor: 'pointer', marginRight: 8 }}
                            onClick={() => setExpandedId(id)}
                          >
                            {related.title}
                          </span>
                        ) : <span key={id} style={{ marginRight: 8 }}>{id}</span>;
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Summary card */}
        <div className="card" style={{ marginTop: 32, borderLeft: '3px solid var(--terra)' }}>
          <h3 style={{ color: 'var(--terra)', margin: '0 0 12px' }}>What Would a Rigorous Approach Look Like?</h3>
          <div style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            <p>
              The Twin-Ladder Bridge model is a creative repackaging of known identities (Euler product, functional equation,
              explicit formula) in engineering language. To turn it into mathematics that could address RH, one would need:
            </p>
            <ol style={{ paddingLeft: 20, marginTop: 12 }}>
              <li style={{ marginBottom: 8 }}>
                <strong style={{ color: 'var(--ink)' }}>A symmetric operator</strong> (not a classical energy function) whose
                eigenvalues are <InlineMath tex={"\\gamma_n"} /> where <InlineMath tex={"\\rho_n = 1/2 + i\\gamma_n"} /> are the zeros.
                This is the Hilbert-Pólya program (Berry-Keating, Connes, Sierra).
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong style={{ color: 'var(--ink)' }}>A proof that the operator is self-adjoint</strong> (not merely symmetric), which
                would show all eigenvalues are real, hence all zeros have <InlineMath tex={"\\sigma = 1/2"} />.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong style={{ color: 'var(--ink)' }}>A distinguishing test</strong>: the method must fail when applied to
                functions like the Davenport-Heilbronn zeta function, which has off-line zeros despite having a
                functional equation.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong style={{ color: 'var(--ink)' }}>Convergence in the critical strip</strong>: any Euler-product-based
                argument must handle the divergence of the product for <InlineMath tex={"\\sigma \\leq 1"} />, using analytic
                continuation or the explicit formula instead.
              </li>
            </ol>
            <p style={{ marginTop: 12 }}>
              The Twin-Ladder Bridge is a tool for building intuition, not a proof. Treat it as a playground for
              understanding <em>why</em> mathematicians believe RH is true, not as evidence that it is.
            </p>
          </div>
        </div>
        {/* Connes 2026 section */}
        <div style={{ marginTop: 32 }}>
          <h2 className="ed-h2" style={{ fontSize: 18, marginBottom: 12 }}>What Connes' 2026 Result Changes</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
            In early 2026, Alain Connes showed that extremizing the Weil quadratic form using only
            the primes 2, 3, 5, 7, 11 (all primes less than 13) approximates the first 50 nontrivial
            zeta zeros with accuracy ranging from <InlineMath tex="10^{-55}" /> to <InlineMath tex="10^{-3}" />.
            This is a remarkable result, but it does not close any of the gaps identified above. Here is what it changes:
          </p>

          <div className="card" style={{ marginBottom: 16, borderLeft: '3px solid var(--green)' }}>
            <h4 style={{ color: 'var(--green)', margin: '0 0 12px', fontSize: 14 }}>What the result validates</h4>
            <ul style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 2, marginLeft: 16 }}>
              <li>
                <strong style={{ color: 'var(--ink)' }}>The spectral approach works (Gap S5 path):</strong> The
                Weil form extremization is fundamentally a spectral method -- it recovers eigenvalue-like
                data from a quadratic form. The fact that it succeeds so well with so little prime data
                validates the Hilbert-Polya intuition that the zeros behave as eigenvalues of an operator.
              </li>
              <li>
                <strong style={{ color: 'var(--ink)' }}>Finite prime data is surprisingly powerful:</strong> Only
                5 primes encode enough information to approximate 50 zeros to extraordinary precision.
                This supports the Twin-Ladder Bridge rate-distortion picture: the oscillator chain's information content
                is dominated by its first few stages.
              </li>
              <li>
                <strong style={{ color: 'var(--ink)' }}>The approximations lie on the critical line by construction:</strong> The
                Weil form extremization produces values that are real (as imaginary parts of
                points <InlineMath tex={"\\tfrac{1}{2} + i\\gamma"} />). But this is built into the method --
                it does not prove that the actual zeros lie on the critical line.
              </li>
            </ul>
          </div>

          <div className="card" style={{ marginBottom: 16, borderLeft: '3px solid var(--brass-dk)' }}>
            <h4 style={{ color: 'var(--brass-dk)', margin: '0 0 12px', fontSize: 14 }}>What the result does NOT do</h4>
            <ul style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 2, marginLeft: 16 }}>
              <li>
                It does not prove <InlineMath tex={"W \\geq 0"} /> (the Weil positivity condition equivalent to RH).
              </li>
              <li>
                It does not construct a self-adjoint operator (Gap S5 remains open).
              </li>
              <li>
                The approximation accuracy, however impressive, is numerical evidence, not proof.
                The same method applied to a function with off-line zeros might also produce good
                approximations on the critical line.
              </li>
              <li>
                It does not address the Euler product convergence problem (Gap S4) or the Darlington
                synthesis gap (Gap S7).
              </li>
            </ul>
          </div>

          <div className="card" style={{
            borderLeft: '3px solid var(--terra)',
            background: 'color-mix(in srgb, var(--accent-deco) 6%, transparent)',
          }}>
            <h4 style={{ color: 'var(--terra)', margin: '0 0 8px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Key Insight
            </h4>
            <p style={{ color: 'var(--ink)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
              Connes' result is the strongest evidence yet that the spectral approach (S5) can work --
              the operator's spectrum IS encoded in a finite number of primes. But encoding is not the
              same as proving. The gap between "5 primes approximate 50 zeros" and "all zeros lie
              on <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />" remains the central challenge.
            </p>
          </div>
        </div>

        {/* Related Pages */}
        <div className="card" style={{ marginTop: 24, background: 'color-mix(in srgb, var(--series-1) 4%, transparent)' }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <Link to="/proof-checker" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>Proof Checker</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/formal-proof" style={{ color: 'var(--green)', fontSize: 13 }}>Formal Proof</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/rh-attack" style={{ color: 'var(--blue)', fontSize: 13 }}>RH Approach</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/gap-closing" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>Gap Closing</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/concepts" style={{ color: 'var(--terra)', fontSize: 13 }}>Concepts</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/connes-adelic" style={{ color: 'var(--blue)', fontSize: 13 }}>Connes Adelic Trace</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/berry-keating-xp" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>Berry-Keating H = xp</Link>
          </div>
          <p style={{ marginTop: 14, fontSize: 13 }}>
            <Link to="/">← the atlas</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
