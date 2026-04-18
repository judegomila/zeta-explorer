import React, { useState, useEffect } from 'react';

const categoryConfig = {
  bug:         { label: 'Bug Fix',     color: '#ef4444', cls: 'tag-red' },
  accuracy:    { label: 'Accuracy',    color: '#f59e0b', cls: 'tag-orange' },
  ux:          { label: 'UX',          color: '#3b82f6', cls: 'tag-blue' },
  visual:      { label: 'Visual',      color: '#8b5cf6', cls: 'tag-purple' },
  performance: { label: 'Performance', color: '#10b981', cls: 'tag-green' },
  content:     { label: 'Content',     color: '#06b6d4', cls: 'tag-cyan' },
  architecture:{ label: 'Architecture', color: '#ec4899', cls: 'tag-pink' },
  proof:       { label: 'Proof',       color: '#a855f7', cls: 'tag-purple' },
};

const PAGE_SIZE = 20;

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', color: '#64748b' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>Loading...</div>
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
    <div className="page">
      <div className="page-header">
        <h1>Auto-Improvements</h1>
        <p>
          Live log of automated improvements made by the Claude Code auto-improvement engine.
          The engine runs every minute, picking one atomic improvement to make each cycle.
        </p>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-box">
          <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>
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
          <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>No improvements yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>
            Start the auto-improvement engine to see changes appear here:
          </p>
          <code style={{
            display: 'block', marginTop: 12, padding: '10px 16px',
            background: 'var(--bg-primary)', borderRadius: 8,
            color: 'var(--accent-cyan)', fontSize: 13,
            fontFamily: 'var(--font-mono)',
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
              <div key={imp.id} className="card" style={{ borderLeftWidth: 3, borderLeftColor: cfg.color }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                    color: 'var(--text-muted)', minWidth: 32,
                  }}>
                    #{imp.id}
                  </span>
                  <span className={`tag ${cfg.cls}`}>{cfg.label}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11,
                    color: 'var(--text-muted)',
                  }}>
                    {new Date(imp.timestamp).toLocaleString()}
                  </span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                  {imp.summary}
                </h3>
                {imp.detail && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
                    {imp.detail}
                  </p>
                )}
                {imp.files && imp.files.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    {imp.files.map(f => (
                      <span key={f} style={{
                        fontFamily: 'var(--font-mono)', fontSize: 11,
                        padding: '2px 8px', borderRadius: 4,
                        background: 'var(--bg-primary)', color: 'var(--accent-cyan)',
                        border: '1px solid var(--border)',
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
              fontFamily: 'var(--font-mono)', fontSize: 13,
              color: 'var(--text-secondary)', padding: '0 8px',
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
      <div className="card" style={{ marginTop: 32 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--accent-purple)' }}>
          How It Works
        </h3>
        <div style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          <p>
            The auto-improvement engine (<code style={{ color: 'var(--accent-cyan)' }}>scripts/auto-improve.sh</code>)
            invokes the Claude Code CLI every minute with a prompt to:
          </p>
          <ol style={{ marginLeft: 20, marginTop: 8 }}>
            <li>Pick one improvement category (bug fix, accuracy, UX, visual, performance, content)</li>
            <li>Read the relevant source files</li>
            <li>Make exactly one atomic change</li>
            <li>Verify the build passes</li>
            <li>Log the improvement here and commit</li>
          </ol>
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <code style={{
              padding: '8px 14px', borderRadius: 8,
              background: 'var(--bg-primary)', color: 'var(--accent-green)',
              fontSize: 12, fontFamily: 'var(--font-mono)',
              border: '1px solid var(--border)',
            }}>
              ./scripts/auto-improve.sh start
            </code>
            <code style={{
              padding: '8px 14px', borderRadius: 8,
              background: 'var(--bg-primary)', color: 'var(--accent-red)',
              fontSize: 12, fontFamily: 'var(--font-mono)',
              border: '1px solid var(--border)',
            }}>
              ./scripts/auto-improve.sh stop
            </code>
            <code style={{
              padding: '8px 14px', borderRadius: 8,
              background: 'var(--bg-primary)', color: 'var(--accent-blue)',
              fontSize: 12, fontFamily: 'var(--font-mono)',
              border: '1px solid var(--border)',
            }}>
              ./scripts/auto-improve.sh status
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
