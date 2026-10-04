import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPapers, deletePaper } from '../data/papers.js';
import { parseLatex } from '../math/latex-parser.js';
import PaperRenderer from '../components/PaperRenderer.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';

// Papers — editorial (warm) re-theme: full-width reader, identical
// data-driven list + standing disclaimer, no wireframes.

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
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Papers</h1>
          <p className="ed-lbl">Related: <Link to="/paper">The twin-ladder paper</Link></p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55 }}>
            Browse saved papers.{' '}
            <Link to="/paper-upload" style={{ color: 'var(--blue)', textDecoration: 'none' }}>
              Upload New →
            </Link>{' '}
            ·{' '}
            <Link to="/papers-download" style={{ color: 'var(--brass-dk)', textDecoration: 'none' }}>
              Referee PDFs and release status →
            </Link>
          </p>
        </div>

        {/* standing disclaimer — prevents withdrawn-claim re-leak when screenshotted out of context (imp-2807) */}
        <div
          className="card"
          style={{
            margin: '0 0 24px',
            padding: '14px 18px',
            border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)',
            background: 'color-mix(in srgb, var(--series-2) 7%, transparent)',
            borderRadius: 10,
          }}
        >
          <strong style={{ color: 'var(--terra-dk)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Scope — read first
          </strong>
          <p style={{ marginTop: 8, marginBottom: 0, fontSize: 13.5, lineHeight: 1.75, color: 'var(--ink-soft)' }}>
            Nothing in this collection proves the Riemann Hypothesis. Platt &amp; Trudgian (2021),
            &Lambda;&nbsp;&le;&nbsp;0.2, remains the peer-reviewed benchmark. The standalone repository
            presents &Lambda;&nbsp;&le;&nbsp;0.1787854 as a computer-assisted candidate for an
            unconditional proof. The bound is not established, has been reviewed by Dan Romik, and is not RH.
            The older finite-N Dyson &ldquo;beat&rdquo; remains an estimate:
            it rests on a many-body constant C_H that remains undischarged (no rigorous upper bound). The
            Volterra-operator collapse (&#8741;V&#8741;&nbsp;&le;&nbsp;1) is equivalent to RH, not a proof of it.
            Treat each saved paper according to its displayed evidence grade. The 0.1787854
            draft has an intended unconditional logical form but remains unrefereed (it has been
            reviewed by Dan Romik and is publicly posted (judegomila.com/posts/riemann-lambda-0.1787854)).
          </p>
        </div>

        {papers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--faint)',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>&#128220;</div>
            <p style={{ fontSize: 15, marginBottom: 16 }}>No papers yet</p>
            <Link
              to="/paper-upload"
              style={{
                display: 'inline-block',
                background: 'color-mix(in srgb, var(--series-1) 12%, transparent)',
                border: '1px solid color-mix(in srgb, var(--series-1) 35%, transparent)',
                color: 'var(--blue)',
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
                    <h3 style={{ color: 'var(--ink)', fontSize: 16, marginBottom: 6, lineHeight: 1.4 }}>
                      {paper.title || 'Untitled'}
                    </h3>
                    {paper.authors && paper.authors.length > 0 && (
                      <p style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 6 }}>
                        {paper.authors.join(', ')}
                      </p>
                    )}
                    {paper.date && (
                      <p style={{ color: 'var(--faint)', fontSize: 12, marginBottom: 8, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                        {paper.date}
                      </p>
                    )}
                    {paper.abstract && !isExpanded && (
                      <p style={{
                        color: 'var(--ink-soft)',
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
                    flexWrap: 'wrap',
                    gap: 10,
                    marginTop: 12,
                  }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className={`tag ${paper.source === 'builtin' ? 'tag-purple' : 'tag-blue'}`}>
                        {paper.source === 'builtin' ? 'Built-in' : 'User'}
                      </span>
                      {paper.status && <span className="tag tag-blue">{paper.status}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      {paper.pdfPath && (
                        <a
                          href={paper.pdfPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: 'var(--brass-dk)', fontSize: 12, textDecoration: 'none' }}
                        >
                          PDF ↗
                        </a>
                      )}
                      {paper.reviewRoute && (
                        <Link
                          to={paper.reviewRoute}
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: 'var(--blue)', fontSize: 12, textDecoration: 'none' }}
                        >
                          Review record →
                        </Link>
                      )}
                      {paper.source !== 'builtin' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(paper.id); }}
                          style={{
                            background: 'transparent',
                            border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
                            color: 'var(--terra-dk)',
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
                  </div>

                  {/* Expanded: full paper render */}
                  {isExpanded && (
                    <div style={{
                      marginTop: 20,
                      paddingTop: 20,
                      borderTop: '1px solid var(--hairline)',
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

        {/* ── Cross links ─────────────────────────────────────────────── */}
        <div className="card" style={{ marginTop: 24, background: 'var(--paper2)', border: '1px solid var(--hairline)', borderLeft: '3px solid var(--brass)', borderRadius: 8, padding: '16px 18px' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 6 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link to="/paper-upload" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>
              → Upload a paper
            </Link>
            <Link to="/papers-download" style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → Referee PDFs and release status
            </Link>
            <Link to="/improvement-queue" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → Live improvement queue
            </Link>
            <Link to="/" style={{ fontSize: 12, color: 'var(--terra-dk)', textDecoration: 'none' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
