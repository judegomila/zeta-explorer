import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import {
  PAPERS_RELEASE_MANIFEST,
} from '../data/papers-release-manifest.js';
import { ED, alpha } from '../styles/tokens.js';

/**
 * PapersDownloadPage — ordered index of releasable papers from this project.
 *
 * Listed in release order (releaseOrder field on each manifest entry).
 * Any entry with a served PDF exposes that artifact, including referee
 * drafts; status and blockers remain visible so a downloadable draft cannot
 * be mistaken for an accepted result.
 *
 * Route: /papers-download
 * Editorial (warm) re-theme: identical structure/data/logic, warm styling.
 */

const STATUS_PALETTE = {
  ready:                { fg: 'var(--green)',    bg: alpha(ED.series3, 0.1),  border: alpha(ED.series3, 0.4),  label: 'READY' },
  draft:                { fg: 'var(--brass-dk)', bg: alpha(ED.brassDeco, 0.12), border: alpha(ED.brassDeco, 0.45), label: 'DRAFT' },
  withdrawn:            { fg: 'var(--terra-dk)', bg: alpha(ED.series2, 0.1),  border: alpha(ED.accent, 0.4),  label: 'SUPERSEDED — NEVER PUBLISHED' },
  planned:              { fg: 'var(--blue)',     bg: alpha(ED.series1, 0.1), border: alpha(ED.series1, 0.4), label: 'PLANNED' },
  'research-grade-open':{ fg: 'var(--terra-dk)', bg: alpha(ED.series2, 0.1),  border: alpha(ED.accent, 0.4),  label: 'RESEARCH OPEN' },
};

function StatusChip({ status }) {
  const c = STATUS_PALETTE[status] || STATUS_PALETTE.draft;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 12px',
      fontSize: 11,
      fontWeight: 700,
      fontFamily: 'var(--ed-mono, var(--font-mono))',
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
  const hasPdf = Boolean(paper.pdfPath);
  return (
    <article className="card" style={{
      background: 'var(--paper2)',
      border: '1px solid var(--hairline)',
      borderLeft: `3px solid ${(STATUS_PALETTE[paper.status] || STATUS_PALETTE.draft).fg}`,
      borderRadius: 8,
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
          <div style={{ fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            Release order {paper.releaseOrder} · {paper.id}
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', margin: '6px 0 4px 0' }}>
            {paper.title}
          </h2>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
            {(paper.authors || []).join(', ')}
          </div>
        </div>
        <StatusChip status={paper.status} />
      </header>

      <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6, margin: '12px 0' }}>
        {paper.abstractSummary}
      </p>

      {hasPdf && (
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
              color: 'var(--brass-dk)',
              background: 'color-mix(in srgb, var(--brass-deco) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--brass-deco) 45%, transparent)',
              borderRadius: 8,
              textDecoration: 'none',
              fontFamily: 'var(--ed-mono, var(--font-mono))',
            }}
          >
            ↓ {isReady ? 'Download PDF' : 'Download referee PDF'} ({formatBytes(paper.fileSizeBytes)}, {paper.pageCount} pages)
          </a>
          <span style={{ fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            built {paper.builtAt}
          </span>
          {paper.provenancePath && (
            <a
              href={paper.provenancePath}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--blue)', fontSize: 12, textDecoration: 'none' }}
            >
              Provenance sidecar ↗
            </a>
          )}
        </div>
      )}

      {paper.releaseUrl && (
        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))', overflowWrap: 'anywhere' }}>
          <a
            href={paper.releaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--blue)', textDecoration: 'none' }}
          >
            immutable {paper.releaseTag} ↗
          </a>
          {' · '}commit {paper.releaseCommit?.slice(0, 12)}
          {' · '}PDF SHA-256 {paper.pdfSha256}
        </div>
      )}

      {!isReady && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 6, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            {paper.status === 'draft' ? 'Review required' : 'Blockers'} ({(paper.blockers || []).length}):
          </div>
          <ul style={{ margin: '4px 0 0 0', paddingLeft: 22, color: 'var(--ink-soft)', fontSize: 13 }}>
            {(paper.blockers || []).map((b, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{b}</li>
            ))}
          </ul>
          {paper.estimatedTime && (
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
              Estimated time: {paper.estimatedTime}
            </div>
          )}
        </div>
      )}

      {paper.sectionsIncluded && paper.sectionsIncluded.length > 0 && (
        <details style={{ marginTop: 14 }}>
          <summary style={{ cursor: 'pointer', fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            Sections ({paper.sectionsIncluded.length})
          </summary>
          <ul style={{ margin: '6px 0 0 0', paddingLeft: 22, color: 'var(--ink-soft)', fontSize: 12 }}>
            {paper.sectionsIncluded.map((s, i) => (
              <li key={i} style={{ marginBottom: 2 }}>{s}</li>
            ))}
          </ul>
        </details>
      )}

      {paper.bibtexSuggestion && (
        <details style={{ marginTop: 8 }}>
          <summary style={{ cursor: 'pointer', fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            BibTeX
          </summary>
          <pre style={{
            margin: '8px 0 0 0',
            padding: 10,
            background: 'var(--paper)',
            border: '1px solid var(--hairline)',
            borderRadius: 6,
            fontSize: 11,
            color: 'var(--ink-soft)',
            overflowX: 'auto',
            fontFamily: 'var(--ed-mono, var(--font-mono))',
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
  const draftCount = sorted.filter((p) => p.status === 'draft').length;
  const withdrawnCount = sorted.filter((p) => p.status === 'withdrawn').length;
  const plannedCount = sorted.filter((p) => p.status === 'planned' || p.status === 'research-grade-open').length;

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <header style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: 18, marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))', textTransform: 'uppercase', letterSpacing: 1 }}>
            /papers-download
          </div>
          <h1 className="ed-h1" style={{ margin: '8px 0 4px 0' }}>
            Papers — release-ordered downloads
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: '8px 0 0 0' }}>
            {readyCount} ready, {draftCount} referee draft, {withdrawnCount} superseded (never published),{' '}
            {plannedCount} planned / research-grade-open. Downloadability records
            artifact availability, not mathematical acceptance; draft and superseded
            status labels remain controlling.
          </p>
        </header>

        {sorted.map((paper) => (
          <PaperRow key={paper.id} paper={paper} />
        ))}

        <footer style={{
          marginTop: 32,
          padding: '16px 0',
          borderTop: '1px solid var(--hairline)',
          fontSize: 12,
          color: 'var(--faint)',
          fontFamily: 'var(--ed-mono, var(--font-mono))',
        }}>
          <div style={{ marginBottom: 12 }}>
            Source: <code>src/data/papers-release-manifest.js</code>. Each entry
            lists status, blockers, related tickets. Build-time tripwires guard
            the ready papers (PAPERS_RELEASE_MANIFEST_ASSERTIONS).
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/improvement-queue" style={{ color: 'var(--brass)', textDecoration: 'none' }}>
              → Live improvement queue
            </Link>
            <Link to="/lambda-bounds" style={{ color: 'var(--blue)', textDecoration: 'none' }}>
              → Λ Bounds &amp; RH Roadmap
            </Link>
            <Link to="/research-journal" style={{ color: 'var(--green)', textDecoration: 'none' }}>
              → Research Journal
            </Link>
            <Link to="/" style={{ color: 'var(--terra-dk)', textDecoration: 'none' }}>
              ← the atlas
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
