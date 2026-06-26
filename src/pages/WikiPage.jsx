import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { glossary, glossaryStats } from '../data/glossary.js';

/**
 * Wiki / Glossary page for all project terms (imp-141).
 */
export default function WikiPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const stats = useMemo(() => glossaryStats(), []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return glossary.filter(e => {
      if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        e.term.toLowerCase().includes(q) ||
        e.definition.toLowerCase().includes(q) ||
        (e.relatedTerms || []).some(t => t.toLowerCase().includes(q))
      );
    });
  }, [query, selectedCategory]);

  const categories = Object.keys(stats.byCategory).sort();

  const categoryColors = {
    framework: '#3b82f6',
    scattering: '#8b5cf6',
    zeta: '#10b981',
    'number theory': '#06b6d4',
    theorem: '#f59e0b',
    proof: '#ef4444',
    physics: '#ec4899',
    method: '#94a3b8',
  };

  return (
    <div className="page" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="page-header">
        <h1>Wiki / Glossary</h1>
        <p>
          Definitions of every term and concept used in the ZPO Math Explorer project.
          {' '}{stats.totalEntries} entries across {categories.length} categories.
        </p>
      </div>

      {/* Search + category filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search terms, definitions, related..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            flex: 1, minWidth: 250, padding: '8px 12px',
            background: 'rgba(15,23,42,0.5)', color: '#e2e8f0',
            border: '1px solid #334155', borderRadius: 6,
            fontSize: 13, fontFamily: 'var(--font-mono)',
          }}
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={{
            padding: '8px 12px', background: 'rgba(15,23,42,0.5)',
            color: '#e2e8f0', border: '1px solid #334155', borderRadius: 6,
            fontSize: 13, fontFamily: 'var(--font-mono)',
          }}
        >
          <option value="all">All categories ({stats.totalEntries})</option>
          {categories.map(c => (
            <option key={c} value={c}>{c} ({stats.byCategory[c]})</option>
          ))}
        </select>
      </div>

      {/* Category legend */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {categories.map(cat => (
          <span key={cat} style={{
            padding: '3px 10px', borderRadius: 4, fontSize: 10, fontWeight: 600,
            background: `${categoryColors[cat] || '#64748b'}20`,
            color: categoryColors[cat] || '#94a3b8',
            border: `1px solid ${categoryColors[cat] || '#64748b'}40`,
          }}>{cat.toUpperCase()} ({stats.byCategory[cat]})</span>
        ))}
      </div>

      {/* Filtered count — lets users see at a glance how many entries their query/category matches. */}
      <div style={{
        fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)',
        marginBottom: 10, letterSpacing: 0.5,
      }}>
        Showing <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{filtered.length}</span>
        {' '}of {stats.totalEntries} entries
        {selectedCategory !== 'all' && <> in <span style={{ color: categoryColors[selectedCategory] || '#94a3b8' }}>{selectedCategory}</span></>}
        {query && <> matching "<span style={{ color: '#e2e8f0' }}>{query}</span>"</>}
      </div>

      {/* Entries */}
      <div>
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: '#64748b', fontSize: 13 }}>
            No entries match your search.
          </div>
        ) : filtered.map(entry => (
          <div key={entry.term} className="card" style={{
            marginBottom: 12,
            borderLeft: `3px solid ${categoryColors[entry.category] || '#64748b'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <h3 style={{
                color: '#e2e8f0', fontSize: 15, fontWeight: 700,
                fontFamily: 'var(--font-mono)', flex: 1,
              }}>{entry.term}</h3>
              <span style={{
                padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 600,
                background: `${categoryColors[entry.category] || '#64748b'}20`,
                color: categoryColors[entry.category] || '#94a3b8',
              }}>{entry.category.toUpperCase()}</span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7, marginBottom: 8 }}>
              {entry.definition}
            </p>
            <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#64748b', flexWrap: 'wrap', alignItems: 'center' }}>
              <span>First used: <span style={{ color: '#94a3b8' }}>{entry.firstUsed}</span></span>
              {entry.relatedTerms && entry.relatedTerms.length > 0 && (
                <span>Related:{' '}
                  {entry.relatedTerms.map((t, i) => (
                    <span key={t}>
                      <span style={{ color: '#38bdf8' }}>{t}</span>
                      {i < entry.relatedTerms.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </span>
              )}
              {entry.link && (
                <Link to={entry.link} style={{ color: '#34d399', fontWeight: 600 }}>
                  See page →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Honest State of the Program */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #f59e0b' }}>
        <h3 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 8 }}>Honest State of the Program</h3>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
          The project maintains a precise distinction between honest-ceiling estimates and
          unconditional results. Key concepts:{' '}
          <Link to="/concepts#pcc-free" style={{ color: '#38bdf8' }}>PCC-free</Link>,{' '}
          <Link to="/concepts#rh-equivalence" style={{ color: '#38bdf8' }}>RH-equivalent</Link>, and{' '}
          <Link to="/concepts#honest-ceiling" style={{ color: '#38bdf8' }}>Honest Ceiling</Link>.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/state-of-program" style={{ color: '#f59e0b', fontSize: 12 }}>State of the Program</Link>
          <Link to="/route-map" style={{ color: '#f59e0b', fontSize: 12 }}>Route Map</Link>
          <Link to="/concepts#ch-wall" style={{ color: '#f59e0b', fontSize: 12 }}>C_H Wall</Link>
          <Link to="/concepts#overclaim-ledger" style={{ color: '#f59e0b', fontSize: 12 }}>Overclaim Ledger</Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #3b82f6' }}>
        <h3 style={{ color: '#3b82f6', fontSize: 14, marginBottom: 8 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/proof-explorer" style={{ color: '#38bdf8', fontSize: 12 }}>Proof Explorer</Link>
          <Link to="/proof-overview" style={{ color: '#38bdf8', fontSize: 12 }}>Proof Overview</Link>
          <Link to="/dashboard" style={{ color: '#38bdf8', fontSize: 12 }}>Dashboard</Link>
          <Link to="/blog" style={{ color: '#38bdf8', fontSize: 12 }}>Blog</Link>
          <Link to="/literature" style={{ color: '#38bdf8', fontSize: 12 }}>Literature</Link>
        </div>
      </div>
    </div>
  );
}
