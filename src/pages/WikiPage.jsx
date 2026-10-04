import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { glossary, glossaryStats } from '../data/glossary.js';
import { ED, alpha } from '../styles/tokens.js';

/**
 * Wiki / Glossary page for all project terms (imp-141).
 * Editorial (warm) re-theme: full-width paper layout, identical
 * search/filter/nav behavior and data.
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

  // Warm palette: fg = editorial CSS var (theme-consistent), tint/border
  // are precomputed rgba matching that var's hex, for chip backgrounds.
  const categoryColors = {
    framework: { fg: 'var(--blue)', tint: alpha(ED.series1, 0.14), border: alpha(ED.series1, 0.45) },
    scattering: { fg: 'var(--brass)', tint: alpha(ED.brass, 0.14), border: alpha(ED.brass, 0.45) },
    zeta: { fg: 'var(--green)', tint: alpha(ED.series3, 0.14), border: alpha(ED.series3, 0.45) },
    'number theory': { fg: 'var(--terra)', tint: alpha(ED.accentDeco, 0.14), border: alpha(ED.accentDeco, 0.45) },
    theorem: { fg: 'var(--brass-dk)', tint: alpha(ED.brassDeco, 0.16), border: alpha(ED.brassDeco, 0.45) },
    proof: { fg: 'var(--terra-dk)', tint: alpha(ED.series2, 0.14), border: alpha(ED.accent, 0.45) },
    physics: { fg: 'var(--terra-dk)', tint: alpha(ED.series2, 0.14), border: alpha(ED.accent, 0.45) },
    method: { fg: 'var(--faint)', tint: alpha(ED.inkFaint, 0.14), border: alpha(ED.rule, 0.4) },
  };
  const catColor = c => categoryColors[c] || { fg: 'var(--faint)', tint: alpha(ED.inkFaint, 0.14), border: alpha(ED.rule, 0.4) };

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Wiki / Glossary</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            Definitions of every term and concept used in the Twin Ladder Explorer project.
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
              background: 'var(--paper)', color: 'var(--ink)',
              border: '1px solid var(--hairline)', borderRadius: 6,
              fontSize: 13, fontFamily: 'var(--ed-mono, var(--font-mono))',
            }}
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 12px', background: 'var(--paper)',
              color: 'var(--ink)', border: '1px solid var(--hairline)', borderRadius: 6,
              fontSize: 13, fontFamily: 'var(--ed-mono, var(--font-mono))',
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
              background: catColor(cat).tint,
              color: catColor(cat).fg,
              border: `1px solid ${catColor(cat).border}`,
            }}>{cat.toUpperCase()} ({stats.byCategory[cat]})</span>
          ))}
        </div>

        {/* Filtered count — lets users see at a glance how many entries their query/category matches. */}
        <div style={{
          fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))',
          marginBottom: 10, letterSpacing: 0.5,
        }}>
          Showing <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{filtered.length}</span>
          {' '}of {stats.totalEntries} entries
          {selectedCategory !== 'all' && <> in <span style={{ color: catColor(selectedCategory).fg }}>{selectedCategory}</span></>}
          {query && <> matching "<span style={{ color: 'var(--ink)' }}>{query}</span>"</>}
        </div>

        {/* Entries */}
        <div>
          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--faint)', fontSize: 13 }}>
              No entries match your search.
            </div>
          ) : filtered.map(entry => (
            <div key={entry.term} className="card" style={{
              marginBottom: 12,
              borderLeft: `3px solid ${catColor(entry.category).fg}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                <h3 style={{
                  color: 'var(--ink)', fontSize: 15, fontWeight: 700,
                  fontFamily: 'var(--ed-mono, var(--font-mono))', flex: 1,
                }}>{entry.term}</h3>
                <span style={{
                  padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 600,
                  background: catColor(entry.category).tint,
                  color: catColor(entry.category).fg,
                }}>{entry.category.toUpperCase()}</span>
              </div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, marginBottom: 8 }}>
                {entry.definition}
              </p>
              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--faint)', flexWrap: 'wrap', alignItems: 'center' }}>
                <span>First used: <span style={{ color: 'var(--ink-soft)' }}>{entry.firstUsed}</span></span>
                {entry.relatedTerms && entry.relatedTerms.length > 0 && (
                  <span>Related:{' '}
                    {entry.relatedTerms.map((t, i) => (
                      <span key={t}>
                        <span style={{ color: 'var(--blue)' }}>{t}</span>
                        {i < entry.relatedTerms.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                )}
                {entry.link && (
                  <Link to={entry.link} style={{ color: 'var(--green)', fontWeight: 600 }}>
                    See page →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* State of the Program */}
        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--brass-dk)' }}>
          <h3 style={{ color: 'var(--brass-dk)', fontSize: 14, marginBottom: 8 }}>State of the Program</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
            The project maintains a precise distinction between ceiling estimates and
            unconditional results. Key concepts:{' '}
            <Link to="/concepts#pcc-free" style={{ color: 'var(--blue)' }}>PCC-free</Link>,{' '}
            <Link to="/concepts#rh-equivalence" style={{ color: 'var(--blue)' }}>RH-equivalent</Link>, and{' '}
            <Link to="/concepts#honest-ceiling" style={{ color: 'var(--blue)' }}>Ceiling</Link>.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link to="/state-of-program" style={{ color: 'var(--brass-dk)', fontSize: 12 }}>State of the Program</Link>
            <Link to="/route-map" style={{ color: 'var(--brass-dk)', fontSize: 12 }}>Route Map</Link>
            <Link to="/concepts#ch-wall" style={{ color: 'var(--brass-dk)', fontSize: 12 }}>C_H Wall</Link>
            <Link to="/concepts#overclaim-ledger" style={{ color: 'var(--brass-dk)', fontSize: 12 }}>Correction Log</Link>
          </div>
        </div>

        {/* Related Pages / footer */}
        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--blue)' }}>
          <h3 style={{ color: 'var(--blue)', fontSize: 14, marginBottom: 8 }}>Related Pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link to="/proof-explorer" style={{ color: 'var(--blue)', fontSize: 12 }}>Proof Explorer</Link>
            <Link to="/proof-overview" style={{ color: 'var(--blue)', fontSize: 12 }}>Proof Overview</Link>
            <Link to="/dashboard" style={{ color: 'var(--blue)', fontSize: 12 }}>Dashboard</Link>
            <Link to="/blog" style={{ color: 'var(--blue)', fontSize: 12 }}>Blog</Link>
            <Link to="/literature" style={{ color: 'var(--blue)', fontSize: 12 }}>Literature</Link>
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
            <Link to="/" style={{ color: 'var(--faint)', fontSize: 12 }}>&larr; the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
