// TwinLadderPaperRoadmapPage.jsx -- imp-1217
// Master index of every section of research-inputs/twin_ladder_consolidated_v52.pdf
// (29 main sections + 42 appendix entries = 71 entries total).
//
// Structure:
//   1. Header (paper title + subtitle + metadata).
//   2. Summary card: total, has-page / planned / not-covered counts;
//      audit-status breakdown.
//   3. Sortable / filterable table of all 71 entries with color-coded
//      status badges and route links.
//   4. Related-pages footer.
//
// All structural facts come from src/data/twin-ladder-paper-roadmap.js (imp-1217).
// Tripwires live in that data module; this file is presentation-only.

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PAPER_ROADMAP,
  getAllEntries,
  getCoverageCounts,
  getAuditCounts,
} from '../data/twin-ladder-paper-roadmap.js';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import FreshnessStamp from '../components/FreshnessStamp.jsx';

const R = PAPER_ROADMAP;
const mono = 'var(--font-mono, monospace)';

// ── Coverage status -> color theme ──────────────────────────────────────
const COVERAGE_THEME = {
  'has-page':    { fg: '#10b981', bg: 'rgba(16,185,129,0.10)', border: '#10b981', label: 'live'     },
  'planned':     { fg: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: '#fbbf24', label: 'planned'  },
  'not-covered': { fg: '#64748b', bg: 'rgba(100,116,139,0.10)', border: '#64748b', label: 'not yet' },
};

const AUDIT_THEME = {
  'audited-subsumed':    { fg: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  'audited-partial':     { fg: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  'audited-independent': { fg: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  'literature-audited':  { fg: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  'numerical-pilot':     { fg: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  'reference-only':      { fg: '#94a3b8', bg: 'rgba(148,163,184,0.10)' },
  'unaudited':           { fg: '#64748b', bg: 'rgba(100,116,139,0.06)' },
};

function classifyCoverage(status) {
  if (status === 'has-page') return 'has-page';
  if (status === 'not-covered') return 'not-covered';
  if (typeof status === 'string' && status.startsWith('planned-')) return 'planned';
  return 'not-covered';
}

function extractPlannedTicket(status) {
  const m = /^planned-(imp-\d+)$/.exec(status);
  return m ? m[1] : null;
}

// Section number parsing for sorting. Returns a tuple [bucket, ord]
// such that sort order is: §1..§29, App A..V, App W..Y, App2 A..Q.
function sortKey(sn) {
  if (sn.startsWith('§')) return [0, parseInt(sn.slice(1), 10) || 999];
  if (sn.startsWith('App2 ')) return [3, sn.charCodeAt(5)];
  if (sn.startsWith('App ')) {
    const letter = sn.charCodeAt(4);
    // W/X/Y standalones get bucket 2; A..V get bucket 1.
    if (letter >= 87 /* W */ && letter <= 89 /* Y */) return [2, letter];
    return [1, letter];
  }
  return [9, 0];
}

// ── Summary stat tile ───────────────────────────────────────────────────
function StatTile({ label, value, fg, bg, border }) {
  return (
    <div
      style={{
        flex: '1 1 140px',
        padding: '14px 18px',
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 8,
      }}
    >
      <div style={{ color: fg, fontFamily: mono, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ color: fg, fontFamily: mono, fontSize: 28, marginTop: 6, fontWeight: 700 }}>
        {value}
      </div>
    </div>
  );
}

// ── Coverage status badge ──────────────────────────────────────────────
function CoverageBadge({ status }) {
  const cls = classifyCoverage(status);
  const t = COVERAGE_THEME[cls];
  const ticket = extractPlannedTicket(status);
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: 4,
        color: t.fg,
        fontFamily: mono,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
      }}
      title={ticket ? `planned via ${ticket}` : t.label}
    >
      {ticket ? ticket : t.label}
    </span>
  );
}

// ── Audit status badge ─────────────────────────────────────────────────
function AuditBadge({ status }) {
  const t = AUDIT_THEME[status] || AUDIT_THEME.unaudited;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        background: t.bg,
        borderRadius: 4,
        color: t.fg,
        fontFamily: mono,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}

// ── Sortable / filterable table ───────────────────────────────────────
function RoadmapTable({ entries }) {
  const [sortBy, setSortBy] = useState('section');
  const [sortDir, setSortDir] = useState('asc');
  const [coverFilter, setCoverFilter] = useState('all'); // all|has-page|planned|not-covered
  const [auditFilter, setAuditFilter] = useState('all'); // all|<auditStatus>

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (coverFilter !== 'all' && classifyCoverage(e.appPageStatus) !== coverFilter) return false;
      if (auditFilter !== 'all' && e.auditStatus !== auditFilter) return false;
      return true;
    });
  }, [entries, coverFilter, auditFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp;
      if (sortBy === 'section') {
        const [bucketA, ordA] = sortKey(a.sectionNumber);
        const [bucketB, ordB] = sortKey(b.sectionNumber);
        cmp = bucketA - bucketB || ordA - ordB;
      } else if (sortBy === 'pages') {
        const pa = parseInt(a.paperPageRange.split('-')[0], 10);
        const pb = parseInt(b.paperPageRange.split('-')[0], 10);
        cmp = pa - pb;
      } else if (sortBy === 'title') {
        cmp = a.title.localeCompare(b.title);
      } else if (sortBy === 'coverage') {
        cmp = classifyCoverage(a.appPageStatus).localeCompare(classifyCoverage(b.appPageStatus));
      } else if (sortBy === 'audit') {
        cmp = a.auditStatus.localeCompare(b.auditStatus);
      } else {
        cmp = 0;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const headerCell = (key, label) => {
    const active = sortBy === key;
    const arrow = active ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';
    return (
      <th
        scope="col"
        style={{
          padding: '10px 8px',
          textAlign: 'left',
          fontFamily: mono,
          fontSize: 12,
          color: active ? '#06b6d4' : '#94a3b8',
          cursor: 'pointer',
          userSelect: 'none',
          borderBottom: '1px solid #334155',
          background: 'rgba(15,23,42,0.6)',
        }}
        onClick={() => {
          if (active) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
          else { setSortBy(key); setSortDir('asc'); }
        }}
        title="click to sort"
      >
        {label}{arrow}
      </th>
    );
  };

  return (
    <div style={{ marginTop: 16 }}>
      {/* ── Filter chips ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <span style={{ fontFamily: mono, fontSize: 12, color: '#94a3b8' }}>coverage:</span>
        {['all', 'has-page', 'planned', 'not-covered'].map((opt) => {
          const active = coverFilter === opt;
          return (
            <button
              key={opt}
              onClick={() => setCoverFilter(opt)}
              style={{
                fontFamily: mono, fontSize: 11, padding: '3px 9px',
                background: active ? '#06b6d4' : 'rgba(15,23,42,0.6)',
                color:      active ? '#0f172a' : '#cbd5e1',
                border: `1px solid ${active ? '#06b6d4' : '#334155'}`,
                borderRadius: 4, cursor: 'pointer',
              }}
            >
              {opt}
            </button>
          );
        })}
        <span style={{ fontFamily: mono, fontSize: 12, color: '#94a3b8', marginLeft: 12 }}>audit:</span>
        <select
          value={auditFilter}
          onChange={(e) => setAuditFilter(e.target.value)}
          style={{
            fontFamily: mono, fontSize: 11, padding: '3px 8px',
            background: 'rgba(15,23,42,0.6)', color: '#cbd5e1',
            border: '1px solid #334155', borderRadius: 4,
          }}
        >
          <option value="all">all</option>
          {Object.keys(AUDIT_THEME).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span style={{ fontFamily: mono, fontSize: 12, color: '#64748b', marginLeft: 'auto' }}>
          showing {sorted.length} of {entries.length}
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {headerCell('section',  '§')}
              {headerCell('title',    'Title')}
              {headerCell('pages',    'PDF pages')}
              {headerCell('coverage', 'App coverage')}
              {headerCell('audit',    'Audit')}
            </tr>
          </thead>
          <tbody>
            {sorted.map((e) => {
              const route = e.appRoute;
              return (
                <tr key={e.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '10px 8px', fontFamily: mono, color: '#cbd5e1', whiteSpace: 'nowrap' }}>
                    {e.sectionNumber}
                  </td>
                  <td style={{ padding: '10px 8px', color: '#e2e8f0', lineHeight: 1.45 }}>
                    <div style={{ fontWeight: 600 }}>{e.title}</div>
                    <div style={{ color: '#64748b', fontSize: 12, marginTop: 4, fontFamily: mono }}>
                      {e.summary}
                    </div>
                  </td>
                  <td style={{ padding: '10px 8px', fontFamily: mono, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {e.paperPageRange}
                  </td>
                  <td style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <CoverageBadge status={e.appPageStatus} />
                      {route && classifyCoverage(e.appPageStatus) === 'has-page' && (
                        <Link
                          to={route}
                          style={{
                            color: '#06b6d4',
                            fontFamily: mono,
                            fontSize: 12,
                            textDecoration: 'none',
                          }}
                        >
                          {route} →
                        </Link>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>
                    <AuditBadge status={e.auditStatus} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────
export default function TwinLadderPaperRoadmapPage() {
  const entries = useMemo(() => getAllEntries(), []);
  const coverage = useMemo(() => getCoverageCounts(), []);
  const audit = useMemo(() => getAuditCounts(), []);
  const total = entries.length;

  return (
    <div className="page">
      <HonestCeilingBanner variant="ESTIMATE" />
      <div className="page-header">
        <h1>Twin-Ladder Paper Roadmap (v52) <FreshnessStamp date={R.generatedAt.slice(0, 10)} note="roadmap index" /></h1>
        <p className="page-subtitle" style={{ fontFamily: mono, color: 'var(--text-secondary)' }}>
          {R.paperTitle} — {R.paperSubtitle}
        </p>
        <p style={{ fontFamily: mono, fontSize: 12, color: '#64748b', marginTop: 4 }}>
          {R.paperVersion} · {R.paperDate} · {R.paperTotalPages} pages · {R.paperMainSectionCount} main sections + 42 appendix entries
        </p>
      </div>

      {/* ─── Summary tiles ─── */}
      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ color: '#06b6d4', marginBottom: 12 }}>Coverage summary</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <StatTile
            label="total entries"
            value={total}
            fg="#cbd5e1" bg="rgba(15,23,42,0.5)" border="#334155"
          />
          <StatTile
            label="live app pages"
            value={coverage['has-page']}
            fg={COVERAGE_THEME['has-page'].fg}
            bg={COVERAGE_THEME['has-page'].bg}
            border={COVERAGE_THEME['has-page'].border}
          />
          <StatTile
            label="planned"
            value={coverage['planned']}
            fg={COVERAGE_THEME['planned'].fg}
            bg={COVERAGE_THEME['planned'].bg}
            border={COVERAGE_THEME['planned'].border}
          />
          <StatTile
            label="not covered"
            value={coverage['not-covered']}
            fg={COVERAGE_THEME['not-covered'].fg}
            bg={COVERAGE_THEME['not-covered'].bg}
            border={COVERAGE_THEME['not-covered'].border}
          />
        </div>

        {/* ─── Audit breakdown ─── */}
        <h3 style={{ color: '#a855f7', marginTop: 24, marginBottom: 12, fontSize: 16 }}>
          Audit-status breakdown
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.entries(audit)
            .sort((a, b) => b[1] - a[1])
            .map(([k, v]) => {
              const t = AUDIT_THEME[k] || AUDIT_THEME.unaudited;
              return (
                <div
                  key={k}
                  style={{
                    padding: '6px 12px',
                    background: t.bg,
                    border: `1px solid ${t.fg}`,
                    borderRadius: 6,
                    color: t.fg,
                    fontFamily: mono,
                    fontSize: 12,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{v}</span>
                  <span style={{ marginLeft: 6, opacity: 0.85 }}>{k}</span>
                </div>
              );
            })}
        </div>
        <p style={{ marginTop: 14, color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
          Audit lineage cites tickets <code style={{ color: '#06b6d4' }}>imp-1163</code> (§4.5),{' '}
          <code style={{ color: '#06b6d4' }}>imp-1202</code> (§15.4),{' '}
          <code style={{ color: '#06b6d4' }}>imp-1209</code> (§17), and{' '}
          <code style={{ color: '#06b6d4' }}>imp-1210</code> (§22). All other entries are{' '}
          <em>unaudited</em> or <em>reference-only</em>.
        </p>
      </div>

      {/* ─── Intro text ─── */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ color: '#06b6d4', marginBottom: 8 }}>How to read this page</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75 }}>
          The user paper (<code style={{ color: '#a78bfa' }}>{R.paperSourcePath}</code>) runs to{' '}
          {R.paperTotalPages} pages across {R.paperMainSectionCount} numbered sections and three
          appendix runs. The table below indexes every entry and links to the app page that covers
          it, when one exists.
        </p>
        <ul style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.85, marginTop: 10 }}>
          <li>
            <strong style={{ color: COVERAGE_THEME['has-page'].fg }}>live</strong> — a dedicated
            app page renders this section today.
          </li>
          <li>
            <strong style={{ color: COVERAGE_THEME['planned'].fg }}>imp-NNNN</strong> — coverage is
            scheduled in a pending engine ticket; the badge names the ticket id.
          </li>
          <li>
            <strong style={{ color: COVERAGE_THEME['not-covered'].fg }}>not yet</strong> — no app
            page and no open ticket; entry is on the navigation backbone only.
          </li>
        </ul>
        <p style={{ marginTop: 10, color: '#94a3b8', fontSize: 12, lineHeight: 1.7 }}>
          <em>
            Many appendix entries carry a "see PDF page X-Y" summary; the appendix detail is too
            dense for a faithful one-liner from the TOC alone, and we deliberately do not
            paraphrase.
          </em>
        </p>
      </div>

      {/* ─── Master table ─── */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ color: '#06b6d4', marginBottom: 4 }}>All entries</h3>
        <p style={{ color: '#64748b', fontSize: 12, fontFamily: mono }}>
          click a column header to sort; filter chips above the table.
        </p>
        <RoadmapTable entries={entries} />
      </div>

      {/* ─── Related pages ─── */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/shift-bridge-positivity" style={{ color: '#06b6d4', fontSize: 13 }}>
            Shift-Bridge (§15)
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/closure-routes" style={{ color: '#06b6d4', fontSize: 13 }}>
            Four Closure Routes (§16)
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/blaschke-ghosts" style={{ color: '#a78bfa', fontSize: 13 }}>
            Blaschke Ghosts (§17)
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/three-attacks" style={{ color: '#fbbf24', fontSize: 13 }}>
            Three Attacks (§18)
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/kyp-bounded-real" style={{ color: '#10b981', fontSize: 13 }}>
            KYP / Bounded-Real (M-O)
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/twin-ladder" style={{ color: '#a855f7', fontSize: 13 }}>
            Twin Ladder
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/paper" style={{ color: '#f59e0b', fontSize: 13 }}>
            Paper
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/papers" style={{ color: '#3b82f6', fontSize: 13 }}>
            Papers
          </Link>
        </div>
      </div>
    </div>
  );
}
