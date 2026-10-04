import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { getAllExplorations, getExplorationCategories } from '../data/explorations.js';
import { getById } from '../data/literature.js';
import { MathText, BlockMath } from '../components/KaTeXMath.jsx';

// Editorial (warm) re-theme: same wrapper/heading pattern as LambdaBoundsPage.
// .card / .exploration-entry / .filter-bar / .filter-btn / .tag base classes
// are left as-is: they resolve through --bg-card/--border/--text-* tokens that
// .ed-root already remaps to the warm palette; only the tag-COLOR modifier
// classes (.tag-blue etc, driven by --accent-*) and inline literal hexes below
// are mapped to the editorial palette. All data-driven list/filter/expand
// interactivity is unchanged.

const categoryColors = {
  'foundation': 'tag-blue',
  'oscillator-model': 'tag-cyan',
  'duality': 'tag-purple',
  'hamiltonian': 'tag-green',
  'control-theory': 'tag-orange',
  'signal-processing': 'tag-pink',
  'statistical': 'tag-red',
  'physics': 'tag-blue',
  'geometry': 'tag-cyan',
  'circuit-theory': 'tag-orange',
  'trace-formula': 'tag-purple',
  'spectral': 'tag-red',
  'quantum-info': 'tag-pink',
  'analysis': 'tag-green',
  'number-theory': 'tag-blue',
  'thermodynamics': 'tag-orange',
};

const statusLabels = {
  'complete': { label: 'Complete', cls: 'status-complete' },
  'in-progress': { label: 'In Progress', cls: 'status-in-progress' },
  'queued': { label: 'Queued', cls: 'status-queued' },
};

function truncateMathSafe(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  let truncated = text.slice(0, maxLen);
  // Check for unclosed $$ (display math) - count $$ pairs
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

export default function ExplorationsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const categories = getExplorationCategories();
  const allExplorations = getAllExplorations();
  const explorations = selectedCategory === 'all'
    ? allExplorations
    : allExplorations.filter(e => e.category === selectedCategory);

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>AI Exploration Journal</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            Continuous deep investigation into the zeta function through the prime oscillator lens.
            Each entry explores a mathematical connection, with full LaTeX rendering, insights, and literature references.
            The AI explores the space systematically, building a graph of interconnected discoveries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 8, color: 'var(--faint)', fontSize: 13 }}>
          <span>{allExplorations.length} explorations</span>
          <span>|</span>
          <span>{allExplorations.filter(e => e.status === 'complete').length} complete</span>
          <span>{allExplorations.filter(e => e.status === 'in-progress').length} in progress</span>
          <span>{allExplorations.filter(e => e.status === 'queued').length} queued</span>
        </div>

        <div className="filter-bar">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
            aria-pressed={selectedCategory === 'all'}
          >
            All ({allExplorations.length})
          </button>
          {categories.map(c => (
            <button
              key={c.name}
              className={`filter-btn ${selectedCategory === c.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(c.name)}
              aria-pressed={selectedCategory === c.name}
            >
              {c.name} ({c.count})
            </button>
          ))}
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginTop: 0, color: 'var(--ink)', fontSize: 16 }}>How to Navigate the Explorations</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 13, color: 'var(--ink-soft)' }}>
            <div>
              <h4 style={{ margin: '0 0 6px', color: 'var(--terra)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Categories</h4>
              <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
                <li><strong style={{ color: 'var(--blue)' }}>foundation</strong> — core identities (Euler product, functional equation)</li>
                <li><strong style={{ color: 'var(--blue)' }}>oscillator-model</strong> — prime ladder construction and LC resonators</li>
                <li><strong style={{ color: 'var(--terra)' }}>duality</strong> — direct/dual ladder symmetry and the functional equation</li>
                <li><strong style={{ color: 'var(--green)' }}>hamiltonian</strong> — energy landscape and σ-minimization</li>
                <li><strong style={{ color: 'var(--brass-dk)' }}>control-theory</strong> — Nyquist stability and feedback loop analysis</li>
                <li><strong style={{ color: 'var(--terra-dk)' }}>signal-processing</strong> — scattering, impedance, wave propagation</li>
                <li><strong style={{ color: 'var(--terra-dk)' }}>statistical</strong> — GUE statistics, pair correlation, random matrix theory</li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 6px', color: 'var(--blue)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Depth Scale</h4>
              <p style={{ margin: '0 0 8px' }}>
                Each entry has a <strong style={{ color: 'var(--ink)' }}>Depth 1–6</strong> rating indicating how deep into the Twin-Ladder Bridge model it reaches:
              </p>
              <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
                <li><strong style={{ color: 'var(--ink)' }}>1–2</strong> — Setup: Euler product reinterpretation, single-prime resonators</li>
                <li><strong style={{ color: 'var(--ink)' }}>3–4</strong> — Core theory: bridge coupling, Hamiltonian, scattering matrix</li>
                <li><strong style={{ color: 'var(--ink)' }}>5–6</strong> — Advanced: GUE universality, primon gas, zero-free regions</li>
              </ul>
              <p style={{ margin: '8px 0 0' }}>
                Click any entry to expand its full analysis with key equations, insights, and literature references. Follow the <strong style={{ color: 'var(--blue)' }}>Leads to</strong> links to trace the chain of reasoning.
              </p>
            </div>
          </div>
        </div>

        {explorations.map(exp => {
          const isExpanded = expandedId === exp.id;
          const statusInfo = statusLabels[exp.status] || statusLabels['queued'];

          return (
            <div
              key={exp.id}
              className="exploration-entry"
              onClick={() => setExpandedId(isExpanded ? null : exp.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="exploration-meta">
                <span className={`tag ${categoryColors[exp.category] || 'tag-blue'}`}>{exp.category}</span>
                <span className="tag tag-blue">Depth {exp.depth}</span>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: 'var(--faint)' }}>
                  <span className={`status-dot ${statusInfo.cls}`} />
                  {statusInfo.label}
                </span>
                <span style={{ fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--font-mono)' }}>
                  {exp.date || (exp.timestamp ? new Date(exp.timestamp).toLocaleDateString() : '')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  display: 'inline-block', fontSize: 14, color: 'var(--faint)',
                  transition: 'transform 0.2s ease',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                }}>&#9654;</span>
                <h2 style={{ margin: 0 }}>{exp.title}</h2>
              </div>

              {isExpanded && (
                <div style={{ marginTop: 16 }}>
                  <div className="exploration-content">
                    <MathText>{exp.content}</MathText>
                  </div>

                  {exp.latex && exp.latex.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--terra)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Key Equations
                      </h4>
                      {exp.latex.map((tex, i) => (
                        <BlockMath key={i} tex={tex} />
                      ))}
                    </div>
                  )}

                  {exp.mathContent && exp.mathContent.length > 0 && (
                    <div style={{ marginTop: 16, padding: '12px 16px', background: 'color-mix(in srgb, var(--series-1) 6%, transparent)', borderRadius: 8, border: '1px solid color-mix(in srgb, var(--series-1) 15%, transparent)' }}>
                      <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Twin-Ladder Bridge Correspondence
                      </h4>
                      {exp.mathContent.map((tex, i) => (
                        <div key={i} style={{ marginBottom: 4 }}>
                          <BlockMath tex={tex} />
                        </div>
                      ))}
                    </div>
                  )}

                  {exp.insights && exp.insights.length > 0 && (
                    <div className="exploration-insights">
                      <h4>Key Insights</h4>
                      <ul>
                        {exp.insights.map((ins, i) => (
                          <li key={i}><MathText>{ins}</MathText></li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.references && exp.references.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        References
                      </h4>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {exp.references.map(refId => {
                          const ref = getById(refId);
                          return ref ? (
                            <span key={refId} className="tag tag-cyan" title={ref.title}>
                              {ref.authors[0].split(' ').pop()} {ref.year}
                            </span>
                          ) : (
                            <span key={refId} className="tag tag-blue">{refId}</span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {exp.nextSteps && exp.nextSteps.length > 0 && (
                    <div style={{ marginTop: 12, fontSize: 12, color: 'var(--faint)' }}>
                      Leads to: {exp.nextSteps.map(ns => {
                        const next = allExplorations.find(e => e.id === ns);
                        return next ? (
                          <span
                            key={ns}
                            style={{ color: 'var(--blue)', cursor: 'pointer', marginRight: 8 }}
                            onClick={e => { e.stopPropagation(); setExpandedId(ns); }}
                          >
                            {next.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              )}

              {!isExpanded && (
                <p style={{ marginTop: 8, fontSize: 13, color: 'var(--faint)' }}>
                  <MathText>{exp.summary || truncateMathSafe(exp.content, 250)}</MathText>
                </p>
              )}
            </div>
          );
        })}

        {/* ── Cross links ─────────────────────────────────────────────── */}
        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--brass)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 6 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link to="/twin-ladder" style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → Twin-Ladder Bridge model
            </Link>
            <Link to="/literature" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>
              → Literature references
            </Link>
            <Link to="/rigor-dashboard" style={{ fontSize: 12, color: 'var(--terra-dk)', textDecoration: 'none' }}>
              → Rigor dashboard
            </Link>
            <Link to="/research-journal" style={{ fontSize: 12, color: 'var(--green)', textDecoration: 'none' }}>
              → Research Journal
            </Link>
          </div>
          <div style={{ marginTop: 14 }}>
            <Link to="/" style={{ fontSize: 12, color: 'var(--faint)', textDecoration: 'none' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
