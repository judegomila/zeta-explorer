import React, { useState, useMemo } from 'react';
import { getAllReferences, getCategories, searchReferences } from '../data/literature.js';

const categoryLabels = {
  'hamiltonian': { label: 'Hamiltonian / Hilbert-Pólya', color: 'tag-green' },
  'random-matrix': { label: 'Random Matrix Theory', color: 'tag-purple' },
  'trace-formula': { label: 'Trace Formulas', color: 'tag-cyan' },
  'explicit-formula': { label: 'Explicit Formula', color: 'tag-blue' },
  'circuit-theory': { label: 'Circuit Theory', color: 'tag-orange' },
  'control-theory': { label: 'Control Theory', color: 'tag-red' },
  'physics': { label: 'Physics', color: 'tag-pink' },
  'spectral': { label: 'Spectral Theory', color: 'tag-cyan' },
  'foundations': { label: 'Foundations', color: 'tag-blue' },
  'dynamical-systems': { label: 'Dynamical Systems', color: 'tag-green' },
};

export default function LiteraturePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const allRefs = getAllReferences();
  const categories = getCategories();

  const filteredRefs = useMemo(() => {
    let refs = searchQuery ? searchReferences(searchQuery) : allRefs;
    if (selectedCategory !== 'all') {
      refs = refs.filter(r => r.category === selectedCategory);
    }
    return refs;
  }, [searchQuery, selectedCategory, allRefs]);

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

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, color: '#64748b', fontSize: 13 }}>
        <span>{allRefs.length} references</span>
        <span>|</span>
        <span>{categories.length} categories</span>
        <span>|</span>
        <span>Showing {filteredRefs.length}</span>
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
            >
              {info.label} ({count})
            </button>
          );
        })}
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
                    <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
                      DOI: <span style={{ fontFamily: 'var(--font-mono)', color: '#3b82f6' }}>{ref.doi}</span>
                    </div>
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
    </div>
  );
}
