import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED } from '../styles/tokens.js';

// Auto-improvements log — editorial (warm) re-theme.
// Identical data source / filter / pagination logic as the legacy dark page;
// only presentation changed. Read interface: ../data/improvements.js.
//
// Category accent colors (dark -> warm standard set):
//   #ef4444 red    -> var(--terra-dk) #c23a1c
//   #f59e0b amber  -> var(--brass-dk) #b58a2e
//   #3b82f6 blue   -> var(--blue)     #3f6b86
//   #8b5cf6 purple -> var(--terra)    #d9502e
//   #10b981 green  -> var(--green)    #4c7a4a
//   #06b6d4 cyan   -> var(--blue)     #3f6b86 (shares hue w/ blue, per convention)
//   #ec4899 pink   -> var(--terra-dk) #c23a1c (shares hue w/ red, adjacent family)
//   #a855f7 violet -> var(--brass)    #8c6a1d

const categoryConfig = {
  bug:          { label: 'Bug Fix',      color: ED.accent },
  accuracy:     { label: 'Accuracy',     color: ED.brass },
  ux:           { label: 'UX',           color: ED.series1 },
  visual:       { label: 'Visual',       color: ED.accentDeco },
  performance:  { label: 'Performance',  color: ED.series3 },
  content:      { label: 'Content',      color: ED.series1 },
  architecture: { label: 'Architecture', color: ED.accent },
  proof:        { label: 'Proof',        color: ED.brass },
};

const PAGE_SIZE = 20;

function chipStyle(color) {
  return {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 10,
    fontSize: 10,
    fontFamily: 'var(--ed-mono, var(--font-mono))',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    background: `${color}22`,
    color,
    border: `1px solid ${color}66`,
  };
}

export default function ImprovementsPage() {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [improvements, setImprovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../data/improvements.js').then(mod => {
      setImprovements(mod.improvements);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="ed-root">
        <EditorialHeader />
        <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', color: 'var(--faint)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>Loading...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filtered = filter === 'all'
    ? improvements
    : improvements.filter(i => i.category === filter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const reversed = [...filtered].reverse();
  const paged = reversed.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const counts = {};
  improvements.forEach(i => {
    counts[i.category] = (counts[i.category] || 0) + 1;
  });

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Auto-Improvements</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 720 }}>
            Live log of automated improvements made by the Claude Code auto-improvement engine.
            The engine runs every minute, picking one atomic improvement to make each cycle.
          </p>
        </div>

        {/* Stats */}
        <div className="stat-grid" style={{ marginBottom: 24 }}>
          <div className="stat-box">
            <div className="stat-value" style={{ color: 'var(--blue)' }}>
              {improvements.length}
            </div>
            <div className="stat-label">Total Improvements</div>
          </div>
          {Object.entries(categoryConfig).map(([key, cfg]) => (
            <div key={key} className="stat-box">
              <div className="stat-value" style={{ color: cfg.color }}>
                {counts[key] || 0}
              </div>
              <div className="stat-label">{cfg.label}</div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => { setFilter('all'); setPage(1); }}
            aria-pressed={filter === 'all'}
          >
            All ({improvements.length})
          </button>
          {Object.entries(categoryConfig).map(([key, cfg]) => (
            counts[key] ? (
              <button
                key={key}
                className={`filter-btn ${filter === key ? 'active' : ''}`}
                onClick={() => { setFilter(key); setPage(1); }}
                aria-pressed={filter === key}
              >
                {cfg.label} ({counts[key]})
              </button>
            ) : null
          ))}
        </div>

        {/* Improvements list */}
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>...</div>
            <h3 style={{ color: 'var(--ink-soft)', fontWeight: 500 }}>No improvements yet</h3>
            <p style={{ color: 'var(--faint)', fontSize: 13, marginTop: 8 }}>
              Start the auto-improvement engine to see changes appear here:
            </p>
            <code style={{
              display: 'block', marginTop: 12, padding: '10px 16px',
              background: 'var(--paper)', borderRadius: 8,
              color: 'var(--blue)', fontSize: 13,
              fontFamily: 'var(--ed-mono, var(--font-mono))',
            }}>
              ./scripts/auto-improve.sh start
            </code>
          </div>
        ) : (
          <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {paged.map(imp => {
              const cfg = categoryConfig[imp.category] || categoryConfig.content;
              return (
                <div key={imp.id} className="card" style={{ borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: cfg.color }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 13, fontWeight: 700,
                      color: 'var(--faint)', minWidth: 32,
                    }}>
                      #{imp.id}
                    </span>
                    <span style={chipStyle(cfg.color)}>{cfg.label}</span>
                    <span style={{
                      fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 11,
                      color: 'var(--faint)',
                    }}>
                      {new Date(imp.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: 'var(--ink)' }}>
                    {imp.summary}
                  </h3>
                  {imp.detail && (
                    <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7 }}>
                      {imp.detail}
                    </p>
                  )}
                  {imp.files && imp.files.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                      {imp.files.map(f => (
                        <span key={f} style={{
                          fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 11,
                          padding: '2px 8px', borderRadius: 4,
                          background: 'var(--paper)', color: 'var(--blue)',
                          border: '1px solid var(--hairline)',
                        }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              gap: 8, marginTop: 20,
            }}>
              <button
                className="filter-btn"
                disabled={safePage <= 1}
                onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
                style={{ opacity: safePage <= 1 ? 0.4 : 1 }}
              >
                Previous
              </button>
              <span style={{
                fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 13,
                color: 'var(--ink-soft)', padding: '0 8px',
              }}>
                Page {safePage} of {totalPages}
              </span>
              <button
                className="filter-btn"
                disabled={safePage >= totalPages}
                onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0, 0); }}
                style={{ opacity: safePage >= totalPages ? 0.4 : 1 }}
              >
                Next
              </button>
            </div>
          )}
          </>
        )}

        {/* How it works */}
        <div className="card" style={{ marginTop: 32, borderLeft: '3px solid var(--brass)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--brass)' }}>
            How It Works
          </h3>
          <div style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            <p>
              The auto-improvement engine (<code style={{ color: 'var(--blue)' }}>scripts/auto-improve.sh</code>)
              invokes the Claude Code CLI every minute with a prompt to:
            </p>
            <ol style={{ marginLeft: 20, marginTop: 8 }}>
              <li>Pick one improvement category (bug fix, accuracy, UX, visual, performance, content)</li>
              <li>Read the relevant source files</li>
              <li>Make exactly one atomic change</li>
              <li>Verify the build passes</li>
              <li>Log the improvement here and commit</li>
            </ol>
            <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <code style={{
                padding: '8px 14px', borderRadius: 8,
                background: 'var(--paper)', color: 'var(--green)',
                fontSize: 12, fontFamily: 'var(--ed-mono, var(--font-mono))',
                border: '1px solid var(--hairline)',
              }}>
                ./scripts/auto-improve.sh start
              </code>
              <code style={{
                padding: '8px 14px', borderRadius: 8,
                background: 'var(--paper)', color: 'var(--terra-dk)',
                fontSize: 12, fontFamily: 'var(--ed-mono, var(--font-mono))',
                border: '1px solid var(--hairline)',
              }}>
                ./scripts/auto-improve.sh stop
              </code>
              <code style={{
                padding: '8px 14px', borderRadius: 8,
                background: 'var(--paper)', color: 'var(--blue)',
                fontSize: 12, fontFamily: 'var(--ed-mono, var(--font-mono))',
                border: '1px solid var(--hairline)',
              }}>
                ./scripts/auto-improve.sh status
              </code>
            </div>
          </div>
        </div>

        {/* Related pages + footer nav */}
        <div style={{ marginTop: '30px', fontSize: '13px', color: 'var(--ink-soft)', borderTop: '1px solid var(--hairline)', paddingTop: '20px' }}>
          <p>
            <strong>Related:</strong>{' '}
            <Link to="/improvement-queue" style={{ color: 'var(--brass)' }}>Live improvement queue</Link>
            {' · '}
            <Link to="/lambda-bounds" style={{ color: 'var(--blue)' }}>&Lambda; Bounds &amp; RH Roadmap</Link>
            {' · '}
            <Link to="/meta-acceleration" style={{ color: 'var(--green)' }}>Meta Acceleration</Link>
          </p>
          <p style={{ margin: '12px 0 0 0' }}>
            <Link to="/">← the atlas</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
