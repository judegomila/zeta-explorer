import React from 'react';
import {
  PAPERS_RELEASE_MANIFEST,
} from '../data/papers-release-manifest.js';

/**
 * PapersDownloadPage — ordered index of releasable papers from this project.
 *
 * Listed in release order (releaseOrder field on each manifest entry).
 * Each row exposes either a download link (if status: 'ready') or a
 * placeholder card showing blockers + ETA (if status: planned / research-grade-open).
 *
 * Route: /papers
 */

const STATUS_PALETTE = {
  ready:                { fg: '#10b981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.35)', label: 'READY' },
  draft:                { fg: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.35)', label: 'DRAFT' },
  planned:              { fg: '#3b82f6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.35)', label: 'PLANNED' },
  'research-grade-open':{ fg: '#ef4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.35)',  label: 'RESEARCH OPEN' },
};

function StatusChip({ status }) {
  const c = STATUS_PALETTE[status] || STATUS_PALETTE.draft;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 12px',
      fontSize: 11,
      fontWeight: 700,
      fontFamily: 'var(--font-mono, monospace)',
      color: c.fg,
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 99,
      letterSpacing: 0.5,
    }}>{c.label}</span>
  );
}

function formatBytes(n) {
  if (!n) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function PaperRow({ paper }) {
  const isReady = paper.status === 'ready';
  return (
    <article style={{
      background: 'rgba(15,23,42,0.7)',
      border: '1px solid #1e293b',
      borderRadius: 10,
      padding: '20px 24px',
      margin: '16px 0',
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
      }}>
        <div>
          <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>
            Release v{paper.releaseOrder} · {paper.id}
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: '6px 0 4px 0' }}>
            {paper.title}
          </h2>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>
            {(paper.authors || []).join(', ')}
          </div>
        </div>
        <StatusChip status={paper.status} />
      </header>

      <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6, margin: '12px 0' }}>
        {paper.abstractSummary}
      </p>

      {isReady ? (
        <div style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          marginTop: 14,
          flexWrap: 'wrap',
        }}>
          <a
            href={paper.pdfPath}
            download
            style={{
              display: 'inline-block',
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: 700,
              color: '#fbbf24',
              background: 'rgba(251,191,36,0.12)',
              border: '1px solid rgba(251,191,36,0.45)',
              borderRadius: 8,
              textDecoration: 'none',
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            ↓ Download PDF ({formatBytes(paper.fileSizeBytes)}, {paper.pageCount} pages)
          </a>
          <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>
            built {paper.builtAt}
          </span>
        </div>
      ) : (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, fontFamily: 'var(--font-mono, monospace)' }}>
            Blockers ({(paper.blockers || []).length}):
          </div>
          <ul style={{ margin: '4px 0 0 0', paddingLeft: 22, color: '#cbd5e1', fontSize: 13 }}>
            {(paper.blockers || []).map((b, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{b}</li>
            ))}
          </ul>
          {paper.estimatedTime && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>
              Estimated time: {paper.estimatedTime}
            </div>
          )}
        </div>
      )}

      {paper.sectionsIncluded && paper.sectionsIncluded.length > 0 && (
        <details style={{ marginTop: 14 }}>
          <summary style={{ cursor: 'pointer', fontSize: 12, color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>
            Sections ({paper.sectionsIncluded.length})
          </summary>
          <ul style={{ margin: '6px 0 0 0', paddingLeft: 22, color: '#94a3b8', fontSize: 12 }}>
            {paper.sectionsIncluded.map((s, i) => (
              <li key={i} style={{ marginBottom: 2 }}>{s}</li>
            ))}
          </ul>
        </details>
      )}

      {paper.bibtexSuggestion && (
        <details style={{ marginTop: 8 }}>
          <summary style={{ cursor: 'pointer', fontSize: 12, color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>
            BibTeX
          </summary>
          <pre style={{
            margin: '8px 0 0 0',
            padding: 10,
            background: 'rgba(15,23,42,0.95)',
            border: '1px solid #1e293b',
            borderRadius: 6,
            fontSize: 11,
            color: '#cbd5e1',
            overflowX: 'auto',
            fontFamily: 'var(--font-mono, monospace)',
          }}>{paper.bibtexSuggestion}</pre>
        </details>
      )}
    </article>
  );
}

export default function PapersDownloadPage() {
  const sorted = [...PAPERS_RELEASE_MANIFEST].sort(
    (a, b) => a.releaseOrder - b.releaseOrder,
  );
  const readyCount = sorted.filter((p) => p.status === 'ready').length;
  const plannedCount = sorted.filter((p) => p.status === 'planned' || p.status === 'research-grade-open').length;

  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '32px 24px' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase', letterSpacing: 1 }}>
          /papers
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#e2e8f0', margin: '8px 0 4px 0' }}>
          Papers — release-ordered downloads
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 14, margin: '8px 0 0 0' }}>
          {readyCount} ready, {plannedCount} planned / research-grade-open. Each
          paper composes the rigorous results from this project at a particular
          stage of completeness. Release them in order: v1 is the foundational
          unconditional finite-N beat; later versions add asymptotic
          improvements as their dependencies close.
        </p>
      </header>

      {sorted.map((paper) => (
        <PaperRow key={paper.id} paper={paper} />
      ))}

      <footer style={{
        marginTop: 32,
        padding: '16px 0',
        borderTop: '1px solid #1e293b',
        fontSize: 12,
        color: '#64748b',
        fontFamily: 'var(--font-mono, monospace)',
      }}>
        Source: <code>src/data/papers-release-manifest.js</code>. Each entry
        lists status, blockers, related tickets. Build-time tripwires guard
        the ready papers (PAPERS_RELEASE_MANIFEST_ASSERTIONS).
      </footer>
    </main>
  );
}
