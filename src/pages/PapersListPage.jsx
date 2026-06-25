import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPapers, deletePaper } from '../data/papers.js';
import { parseLatex } from '../math/latex-parser.js';
import PaperRenderer from '../components/PaperRenderer.jsx';

export default function PapersListPage() {
  const [papers, setPapers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setPapers(getAllPapers());
  }, []);

  const handleDelete = (id) => {
    deletePaper(id);
    setPapers(getAllPapers());
    if (expandedId === id) setExpandedId(null);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Re-parse on expand if nodes aren't stored
  const getNodesForPaper = (paper) => {
    if (paper.nodes && paper.nodes.length > 0) return { metadata: paper, nodes: paper.nodes };
    if (paper.rawLatex) return parseLatex(paper.rawLatex);
    return { metadata: paper, nodes: [] };
  };

  return (
    <div className="page" style={{ maxWidth: 1200 }}>
      <div className="page-header">
        <h1>Papers</h1>
        <p>
          Browse saved papers.{' '}
          <Link to="/paper-upload" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>
            Upload New →
          </Link>
        </p>
      </div>

      {/* Honest standing disclaimer — prevents withdrawn-claim re-leak when screenshotted out of context (imp-2807) */}
      <div style={{ margin: '0 0 24px', padding: '14px 18px', border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.07)', borderRadius: 10 }}>
        <strong style={{ color: '#fbbf24', fontSize: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>Honest scope — read first</strong>
        <p style={{ marginTop: 8, marginBottom: 0, fontSize: 13.5, lineHeight: 1.75, color: '#fcd34d' }}>
          Nothing in this collection proves the Riemann Hypothesis. The rigorous unconditional state of the
          art remains the zero-free certificate of Platt &amp; Trudgian (2021), &Lambda;&nbsp;&le;&nbsp;0.2 — a
          bound this project did not produce. Any finite-N &ldquo;beat&rdquo; of that bound is an estimate, not a
          theorem: it rests on a many-body constant C_H that remains undischarged (no rigorous upper bound). The
          Volterra-operator collapse (&#8741;V&#8741;&nbsp;&le;&nbsp;1) is equivalent to RH, not a proof of it.
          Treat saved papers as expository or conditional unless explicitly marked rigorous.
        </p>
      </div>

      {papers.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-muted)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>&#128220;</div>
          <p style={{ fontSize: 15, marginBottom: 16 }}>No papers yet</p>
          <Link
            to="/paper-upload"
            style={{
              display: 'inline-block',
              background: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.3)',
              color: '#3b82f6',
              padding: '8px 20px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Upload Your First Paper
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {papers.map(paper => {
            const isExpanded = expandedId === paper.id;
            return (
              <div
                key={paper.id}
                className="card"
                style={isExpanded ? { gridColumn: '1 / -1' } : {}}
              >
                {/* Card header */}
                <div
                  onClick={() => toggleExpand(paper.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3 style={{ color: '#e2e8f0', fontSize: 16, marginBottom: 6, lineHeight: 1.4 }}>
                    {paper.title || 'Untitled'}
                  </h3>
                  {paper.authors && paper.authors.length > 0 && (
                    <p style={{ color: '#64748b', fontSize: 13, marginBottom: 6 }}>
                      {paper.authors.join(', ')}
                    </p>
                  )}
                  {paper.date && (
                    <p style={{ color: '#475569', fontSize: 12, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                      {paper.date}
                    </p>
                  )}
                  {paper.abstract && !isExpanded && (
                    <p style={{
                      color: '#94a3b8',
                      fontSize: 13,
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {paper.abstract}
                    </p>
                  )}
                </div>

                {/* Footer: source tag + delete */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 12,
                }}>
                  <span className={`tag ${paper.source === 'builtin' ? 'tag-purple' : 'tag-blue'}`}>
                    {paper.source === 'builtin' ? 'Built-in' : 'User'}
                  </span>
                  {paper.source !== 'builtin' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(paper.id); }}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#ef4444',
                        padding: '4px 12px',
                        borderRadius: 6,
                        fontSize: 11,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Expanded: full paper render */}
                {isExpanded && (
                  <div style={{
                    marginTop: 20,
                    paddingTop: 20,
                    borderTop: '1px solid var(--border)',
                  }}>
                    {(() => {
                      const { metadata, nodes } = getNodesForPaper(paper);
                      return <PaperRenderer metadata={metadata} nodes={nodes} />;
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
