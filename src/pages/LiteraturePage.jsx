import React, { useState, useMemo } from 'react';
import { getAllReferences, getCategories, searchReferences } from '../data/literature.js';

const categoryLabels = {
  'hamiltonian': { label: 'Hamiltonian / Hilbert-Pólya', color: 'tag-green' },
  'random-matrix': { label: 'Random Matrix Theory', color: 'tag-purple' },
  'trace-formula': { label: 'Trace Formulas', color: 'tag-cyan' },
  'explicit-formula': { label: 'Explicit Formula', color: 'tag-blue' },
  'circuit-theory': { label: 'Circuit Theory', color: 'tag-orange' },
  'control-theory': { label: 'Control Theory', color: 'tag-red' },
  'physics': { label: 'Physics / Stat Mech', color: 'tag-pink' },
  'spectral': { label: 'Spectral Theory', color: 'tag-cyan' },
  'foundations': { label: 'Foundations', color: 'tag-blue' },
  'dynamical-systems': { label: 'Dynamical Systems', color: 'tag-green' },
  'analytic': { label: 'Analytic Number Theory', color: 'tag-orange' },
  'function-field': { label: 'Function Fields', color: 'tag-purple' },
  'computational': { label: 'Computational', color: 'tag-cyan' },
  'signal-processing': { label: 'Signal Processing', color: 'tag-green' },
};

export default function LiteraturePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [sortOrder, setSortOrder] = useState('year-desc');

  const allRefs = getAllReferences();
  const categories = getCategories();

  const filteredRefs = useMemo(() => {
    let refs = searchQuery ? searchReferences(searchQuery) : allRefs;
    if (selectedCategory !== 'all') {
      refs = refs.filter(r => r.category === selectedCategory);
    }
    const sorted = [...refs];
    if (sortOrder === 'year-asc') {
      sorted.sort((a, b) => a.year - b.year);
    } else if (sortOrder === 'author-asc') {
      sorted.sort((a, b) => (a.authors[0] || '').localeCompare(b.authors[0] || ''));
    } else {
      sorted.sort((a, b) => b.year - a.year);
    }
    return sorted;
  }, [searchQuery, selectedCategory, sortOrder, allRefs]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Literature Database</h1>
        <p>
          Comprehensive annotated bibliography connecting circuit theory, control theory,
          spectral methods, and the Riemann zeta function. Each reference includes its key insight
          and relevance to the prime oscillator model.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, color: '#64748b', fontSize: 13, alignItems: 'center', flexWrap: 'wrap' }}>
        <span>{allRefs.length} references</span>
        <span>|</span>
        <span>{categories.length} categories</span>
        <span>|</span>
        <span>Showing {filteredRefs.length}</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#475569' }}>Sort:</span>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            style={{
              background: 'rgba(30,41,59,0.8)',
              border: '1px solid rgba(100,116,139,0.4)',
              borderRadius: 6,
              color: '#94a3b8',
              fontSize: 12,
              padding: '3px 8px',
              cursor: 'pointer',
            }}
          >
            <option value="year-desc">Year (newest first)</option>
            <option value="year-asc">Year (oldest first)</option>
            <option value="author-asc">Author (A–Z)</option>
          </select>
        </span>
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="Search references by title, author, topic, or keyword..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      <div className="filter-bar">
        <button
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
          aria-pressed={selectedCategory === 'all'}
        >
          All ({allRefs.length})
        </button>
        {categories.map(cat => {
          const info = categoryLabels[cat] || { label: cat, color: 'tag-blue' };
          const count = allRefs.filter(r => r.category === cat).length;
          return (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
            >
              {info.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="two-col" style={{ marginTop: 24, marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ color: '#10b981' }}>The Spectral Thread</h3>
          <p style={{ marginTop: 8 }}>
            One major line of research connects the Riemann zeros to eigenvalues of a
            self-adjoint operator — the Hilbert-Pólya conjecture. Berry and Keating proposed
            the <em>xp</em> Hamiltonian; Connes used noncommutative geometry; random matrix
            theory (GUE/CUE) provides the statistical fingerprint. Trace formulas bridge the
            gap between spectral data (zeros) and geometric data (primes), much as the
            Selberg trace formula does for hyperbolic surfaces.
          </p>
          <p style={{ marginTop: 8, fontSize: 13, color: '#94a3b8' }}>
            Categories: Hamiltonian, Random Matrix Theory, Trace Formulas, Spectral Theory
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>The Engineering Thread</h3>
          <p style={{ marginTop: 8 }}>
            A complementary approach interprets the Euler product as a cascade of
            impedance-matched stages — an LC ladder network. The functional equation becomes
            a lossless bridge condition, RH becomes a passivity criterion, and zero
            statistics correspond to stability margins. Control theory contributes Nyquist
            and Bode analyses; signal processing provides the Fourier-dual perspective
            linking prime gaps to spectral energy.
          </p>
          <p style={{ marginTop: 8, fontSize: 13, color: '#94a3b8' }}>
            Categories: Circuit Theory, Control Theory, Signal Processing, Physics
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ color: '#818cf8' }}>Where to Start</h3>
        <p style={{ marginTop: 8 }}>
          With {allRefs.length} references spanning many fields, here is a suggested reading progression:
        </p>
        <ol style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.8, color: '#cbd5e1' }}>
          <li>
            <strong style={{ color: '#60a5fa' }}>Foundations</strong> — Start with Riemann's 1859 memoir and Edwards' or Titchmarsh's
            textbooks to understand the zeta function, functional equation, and explicit formula.
          </li>
          <li>
            <strong style={{ color: '#a78bfa' }}>Random Matrix Theory</strong> — Montgomery's pair correlation conjecture and the
            Odlyzko computations reveal the GUE connection that motivates the spectral approach.
          </li>
          <li>
            <strong style={{ color: '#34d399' }}>Hamiltonian / Hilbert-Pólya</strong> — Berry-Keating's <em>xp</em> quantization
            and Connes' trace formula show how zeros might arise as eigenvalues of a self-adjoint operator.
          </li>
          <li>
            <strong style={{ color: '#fb923c' }}>Circuit &amp; Control Theory</strong> — The engineering thread: Euler product as
            an impedance cascade, Nyquist stability, and Bode sensitivity integrals applied to L-functions.
          </li>
          <li>
            <strong style={{ color: '#f472b6' }}>Physics / Statistical Mechanics</strong> — The partition function viewpoint,
            Bost-Connes phase transitions, and connections to quantum chaos round out the picture.
          </li>
        </ol>
        <p style={{ marginTop: 12, fontSize: 13, color: '#94a3b8' }}>
          Click any reference card to expand its full summary, key insight, and relevance to the oscillator model.
        </p>
      </div>

      <div className="card-grid">
        {filteredRefs.map(ref => {
          const catInfo = categoryLabels[ref.category] || { label: ref.category, color: 'tag-blue' };
          const isExpanded = expandedId === ref.id;

          return (
            <div
              key={ref.id}
              className="ref-card"
              onClick={() => setExpandedId(isExpanded ? null : ref.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="ref-title">{ref.title}</div>
              <div className="ref-authors">{ref.authors.join(', ')} ({ref.year})</div>
              <div className="ref-journal">
                {ref.journal}{ref.volume ? `, ${ref.volume}` : ''}{ref.pages ? `: ${ref.pages}` : ''}
              </div>

              {isExpanded ? (
                <>
                  <div className="ref-summary">{ref.summary}</div>
                  {ref.keyInsight && (
                    <div className="ref-insight">
                      <p><strong>Key Insight:</strong> {ref.keyInsight}</p>
                    </div>
                  )}
                  {ref.relevanceToModel && (
                    <div className="ref-relevance" style={{ marginTop: 8 }}>
                      <p><strong>Relevance to Our Model:</strong> {ref.relevanceToModel}</p>
                    </div>
                  )}
                  {ref.doi && (
                    <div style={{ marginTop: 8, fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                      DOI: <span style={{ fontFamily: 'var(--font-mono)', color: '#3b82f6' }}>{ref.doi}</span>
                      <a
                        href={ref.doi.startsWith('10.48550/arXiv.') ? `https://arxiv.org/abs/${ref.doi.replace('10.48550/arXiv.', '')}` : `https://doi.org/${ref.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 11 }}
                      >
                        ↗
                      </a>
                    </div>
                  )}
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        marginTop: 10,
                        padding: '5px 12px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: 6,
                        color: '#3b82f6',
                        fontSize: 12,
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'background 0.2s, border-color 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'; e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'; e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'; }}
                    >
                      Open Paper ↗
                    </a>
                  )}
                </>
              ) : (
                <div className="ref-summary" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {ref.summary}
                </div>
              )}

              <div className="tags-row">
                <span className={`tag ${catInfo.color}`}>{catInfo.label}</span>
                {ref.tags.slice(0, isExpanded ? undefined : 3).map(tag => (
                  <span key={tag} className="tag tag-blue">{tag}</span>
                ))}
                {!isExpanded && ref.tags.length > 3 && (
                  <span className="tag tag-blue">+{ref.tags.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Related Pages */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <a href="#/paper" style={{ color: '#3b82f6', fontSize: 13 }}>Paper</a>
          <span style={{ color: '#334155' }}>|</span>
          <a href="#/history" style={{ color: '#f59e0b', fontSize: 13 }}>History</a>
          <span style={{ color: '#334155' }}>|</span>
          <a href="#/concepts" style={{ color: '#06b6d4', fontSize: 13 }}>Concepts</a>
          <span style={{ color: '#334155' }}>|</span>
          <a href="#/explorations" style={{ color: '#8b5cf6', fontSize: 13 }}>Explorations</a>
          <span style={{ color: '#334155' }}>|</span>
          <a href="#/selberg-trace" style={{ color: '#10b981', fontSize: 13 }}>Selberg Trace</a>
          <span style={{ color: '#334155' }}>|</span>
          <a href="#/rh-equivalents" style={{ color: '#ec4899', fontSize: 13 }}>RH Equivalents</a>
          <span style={{ color: '#334155' }}>|</span>
          <a href="#/closure-routes" style={{ color: '#a855f7', fontSize: 13 }}>Closure Routes (§16)</a>
          <a href="#/shift-bridge-positivity" style={{ color: '#10b981', fontSize: 13 }}>Shift-Bridge Positivity (§15)</a>
        </div>
      </div>
    </div>
  );
}
