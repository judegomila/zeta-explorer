// PaperAuditDashboardPage.jsx -- imp-1218
// Renders the running tracker of every named conjecture in
// research-inputs/twin_ladder_consolidated_v52.pdf Sections 15-22 with its
// audit verdict (SUBSUMED-BY-RH / SUBSUMED-BY-LITERATURE / PARTIALLY-RELATED
// / INDEPENDENT-NOVEL / UNAUDITED).
//
// Pure rendering. All structural facts + tripwires live in
// src/data/paper-audit-dashboard.js.

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PAPER_AUDIT_DASHBOARD } from '../data/paper-audit-dashboard.js';

const D = PAPER_AUDIT_DASHBOARD;
const mono = 'var(--font-mono)';

// Color theme per verdict status -- consistent across chips + row badges.
const STATUS_COLORS = {
  'SUBSUMED-BY-RH':         { fg: '#fca5a5', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.45)' },
  'SUBSUMED-BY-LITERATURE': { fg: '#fdba74', bg: 'rgba(249,115,22,0.10)', border: 'rgba(249,115,22,0.45)' },
  'PARTIALLY-RELATED':      { fg: '#fcd34d', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.45)' },
  'INDEPENDENT-NOVEL':      { fg: '#86efac', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.45)' },
  UNAUDITED:                { fg: '#94a3b8', bg: 'rgba(100,116,139,0.10)',border: 'rgba(100,116,139,0.45)' },
};

const STATUS_LABELS = {
  'SUBSUMED-BY-RH': 'Subsumed by RH',
  'SUBSUMED-BY-LITERATURE': 'Subsumed by literature',
  'PARTIALLY-RELATED': 'Partially related',
  'INDEPENDENT-NOVEL': 'Independent / novel',
  UNAUDITED: 'Unaudited',
};

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.UNAUDITED;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 8px',
        borderRadius: 4,
        fontFamily: mono,
        fontSize: 11,
        fontWeight: 600,
        color: c.fg,
        background: c.bg,
        border: `1px solid ${c.border}`,
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}

function StatusChip({ status, count, active, onClick }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.UNAUDITED;
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px',
        borderRadius: 6,
        background: active ? c.bg : 'rgba(15,23,42,0.55)',
        border: `1px solid ${active ? c.border : 'rgba(100,116,139,0.25)'}`,
        color: active ? c.fg : '#cbd5e1',
        fontFamily: mono,
        fontSize: 12,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        opacity: count === 0 ? 0.5 : 1,
      }}
      title={`${count} of ${D.totalCount} conjectures: ${STATUS_LABELS[status]}`}
    >
      <span style={{ letterSpacing: 0.3 }}>{STATUS_LABELS[status]}</span>
      <span
        style={{
          padding: '1px 7px',
          borderRadius: 10,
          background: 'rgba(0,0,0,0.30)',
          color: c.fg,
          fontWeight: 700,
        }}
      >
        {count}
      </span>
    </button>
  );
}

function HeaderRow({ label, sortKey, sortBy, sortDir, onSort, width }) {
  const active = sortBy === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      style={{
        padding: '10px 12px',
        textAlign: 'left',
        fontFamily: mono,
        fontSize: 11,
        color: active ? '#e2e8f0' : '#94a3b8',
        background: 'rgba(15,23,42,0.85)',
        borderBottom: '1px solid rgba(100,116,139,0.30)',
        cursor: 'pointer',
        letterSpacing: 0.4,
        userSelect: 'none',
        width,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
      {active && (
        <span style={{ marginLeft: 6, color: '#64748b' }}>
          {sortDir === 'asc' ? '▲' : '▼'}
        </span>
      )}
    </th>
  );
}

function ConjectureRow({ entry, expanded, onToggle }) {
  const c = STATUS_COLORS[entry.auditStatus] || STATUS_COLORS.UNAUDITED;
  return (
    <>
      <tr
        onClick={onToggle}
        style={{
          cursor: 'pointer',
          background: expanded ? 'rgba(30,41,59,0.55)' : 'transparent',
          borderBottom: '1px solid rgba(51,65,85,0.35)',
        }}
      >
        <td style={{ padding: '10px 12px', fontFamily: mono, color: '#e2e8f0', fontSize: 13 }}>
          <span style={{ color: '#64748b', marginRight: 8 }}>
            {expanded ? '▼' : '▶'}
          </span>
          {entry.id}
        </td>
        <td style={{ padding: '10px 12px', color: '#cbd5e1', fontSize: 13 }}>
          {entry.shortName}
        </td>
        <td style={{ padding: '10px 12px', fontFamily: mono, color: '#94a3b8', fontSize: 12 }}>
          {entry.paperSection}
        </td>
        <td style={{ padding: '10px 12px' }}>
          <StatusBadge status={entry.auditStatus} />
        </td>
        <td style={{ padding: '10px 12px', fontFamily: mono, color: '#94a3b8', fontSize: 12 }}>
          {entry.auditTicket || <span style={{ color: '#475569' }}>—</span>}
        </td>
      </tr>
      {expanded && (
        <tr style={{ background: 'rgba(15,23,42,0.55)' }}>
          <td colSpan={5} style={{ padding: '14px 18px 18px 36px', borderBottom: `1px solid ${c.border}` }}>
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <div
                  style={{
                    color: c.fg,
                    fontFamily: mono,
                    fontSize: 11,
                    letterSpacing: 0.4,
                    marginBottom: 4,
                  }}
                >
                  STATEMENT (paraphrased, paper page {entry.paperPage})
                </div>
                <div style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>
                  {entry.statement}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontFamily: mono, fontSize: 12 }}>
                <div>
                  <span style={{ color: '#64748b' }}>Audit ticket: </span>
                  <span style={{ color: '#cbd5e1' }}>
                    {entry.auditTicket || 'none (UNAUDITED)'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Audit date: </span>
                  <span style={{ color: '#cbd5e1' }}>
                    {entry.auditDate || '—'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Paper section: </span>
                  <span style={{ color: '#cbd5e1' }}>{entry.paperSection}</span>
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: c.fg,
                    fontFamily: mono,
                    fontSize: 11,
                    letterSpacing: 0.4,
                    marginBottom: 4,
                  }}
                >
                  RECOMMENDATION FOR PAPER
                </div>
                <div style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>
                  {entry.recommendationForPaper}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

const SORT_RANK = {
  'SUBSUMED-BY-RH': 0,
  'SUBSUMED-BY-LITERATURE': 1,
  'PARTIALLY-RELATED': 2,
  'INDEPENDENT-NOVEL': 3,
  UNAUDITED: 4,
};

function compareIds(a, b) {
  // 15.4 -> [15, 4] for numeric comparison.
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x !== y) return x - y;
  }
  return 0;
}

function compareSections(a, b) {
  // '§15.9' -> 15.9 numeric for sort.
  const num = (s) => parseFloat(String(s).replace(/[^\d.]/g, '')) || 0;
  return num(a) - num(b);
}

export default function PaperAuditDashboardPage() {
  const [filter, setFilter] = useState(null);          // active status filter, null = all
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [expandedId, setExpandedId] = useState(null);

  const onSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const rows = useMemo(() => {
    const filtered = filter
      ? D.conjectures.filter((c) => c.auditStatus === filter)
      : D.conjectures.slice();
    const sorted = filtered.slice().sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'id') cmp = compareIds(a.id, b.id);
      else if (sortBy === 'shortName') cmp = a.shortName.localeCompare(b.shortName);
      else if (sortBy === 'paperSection') cmp = compareSections(a.paperSection, b.paperSection);
      else if (sortBy === 'auditStatus') cmp = SORT_RANK[a.auditStatus] - SORT_RANK[b.auditStatus];
      else if (sortBy === 'auditTicket') {
        const at = a.auditTicket || '￿';
        const bt = b.auditTicket || '￿';
        cmp = at.localeCompare(bt);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [filter, sortBy, sortDir]);

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '32px 24px 48px',
        color: '#e2e8f0',
        background: 'transparent',
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: mono,
            fontSize: 28,
            color: '#f8fafc',
            letterSpacing: 0.5,
            margin: '0 0 8px 0',
          }}
        >
          Paper Audit Dashboard
        </h1>
        <div style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>
          Running tracker of every named conjecture in{' '}
          <code style={{ color: '#cbd5e1', fontFamily: mono }}>
            research-inputs/twin_ladder_consolidated_v52.pdf
          </code>{' '}
          Sections {D.paperSectionsCovered.join(', ')} with its audit verdict.
        </div>
        <div style={{ color: '#64748b', fontSize: 13, marginTop: 6, fontFamily: mono }}>
          {D.auditedCount} of {D.totalCount} audited · {D.completedAuditTickets.length} audit tickets shipped · ticket {D.ticket}
        </div>
      </header>

      {/* ── Status summary chips ───────────────────────────────────── */}
      <section style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {D.verdictVocabulary.map((status) => (
            <StatusChip
              key={status}
              status={status}
              count={D.statusCounts[status]}
              active={filter === status}
              onClick={() => setFilter((f) => (f === status ? null : status))}
            />
          ))}
          {filter && (
            <button
              onClick={() => setFilter(null)}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                background: 'transparent',
                border: '1px solid rgba(100,116,139,0.30)',
                color: '#94a3b8',
                fontFamily: mono,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Clear filter
            </button>
          )}
        </div>
      </section>

      {/* ── Conjecture table ───────────────────────────────────────── */}
      <section style={{ marginBottom: 32 }}>
        <div
          style={{
            border: '1px solid rgba(100,116,139,0.25)',
            borderRadius: 8,
            overflow: 'hidden',
            background: 'rgba(15,23,42,0.55)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <HeaderRow label="ID" sortKey="id" sortBy={sortBy} sortDir={sortDir} onSort={onSort} width={90} />
                <HeaderRow label="Conjecture" sortKey="shortName" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
                <HeaderRow label="Section" sortKey="paperSection" sortBy={sortBy} sortDir={sortDir} onSort={onSort} width={100} />
                <HeaderRow label="Verdict" sortKey="auditStatus" sortBy={sortBy} sortDir={sortDir} onSort={onSort} width={220} />
                <HeaderRow label="Audit" sortKey="auditTicket" sortBy={sortBy} sortDir={sortDir} onSort={onSort} width={120} />
              </tr>
            </thead>
            <tbody>
              {rows.map((entry) => (
                <ConjectureRow
                  key={entry.id}
                  entry={entry}
                  expanded={expandedId === entry.id}
                  onToggle={() =>
                    setExpandedId((x) => (x === entry.id ? null : entry.id))
                  }
                />
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: '#64748b',
                      fontFamily: mono,
                      fontSize: 13,
                    }}
                  >
                    No conjectures match the active filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ color: '#64748b', fontSize: 12, marginTop: 8, fontFamily: mono }}>
          Click a row to expand statement + audit + recommendation. Click a column header to sort.
        </div>
      </section>

      {/* ── Completed audit tickets ────────────────────────────────── */}
      <section style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: mono,
            fontSize: 16,
            color: '#e2e8f0',
            letterSpacing: 0.4,
            margin: '0 0 12px 0',
          }}
        >
          Completed audit tickets
        </h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {D.completedAuditTickets.map((t) => (
            <div
              key={t.ticket}
              style={{
                padding: '12px 16px',
                background: 'rgba(15,23,42,0.55)',
                border: '1px solid rgba(100,116,139,0.25)',
                borderRadius: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: mono, color: '#fbbf24', fontSize: 13 }}>
                  {t.ticket}
                </span>
                <span style={{ color: '#cbd5e1', fontSize: 13 }}>{t.title}</span>
                <span style={{ marginLeft: 'auto', color: '#64748b', fontFamily: mono, fontSize: 11 }}>
                  {t.auditDate}
                </span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
                <span style={{ color: '#64748b', fontFamily: mono }}>Verdict: </span>
                {t.verdict}
              </div>
              <div style={{ color: '#64748b', fontSize: 12, marginTop: 4, fontFamily: mono }}>
                Covers: {t.coversConjectures.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Honest scope ───────────────────────────────────────────── */}
      <section style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: mono,
            fontSize: 16,
            color: '#e2e8f0',
            letterSpacing: 0.4,
            margin: '0 0 12px 0',
          }}
        >
          Honest scope
        </h2>
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            color: '#94a3b8',
            fontSize: 13,
            lineHeight: 1.7,
            display: 'grid',
            gap: 6,
          }}
        >
          {D.honestScope.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      {/* ── Related pages ──────────────────────────────────────────── */}
      <section
        style={{
          marginTop: 32,
          paddingTop: 20,
          borderTop: '1px solid rgba(100,116,139,0.25)',
          color: '#64748b',
          fontSize: 12,
          fontFamily: mono,
        }}
      >
        <div style={{ marginBottom: 6 }}>Related pages</div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/shift-bridge-positivity" style={{ color: '#7dd3fc' }}>
            Shift-Bridge (§15)
          </Link>
          <Link to="/closure-routes" style={{ color: '#7dd3fc' }}>
            Four Closure Routes (§16)
          </Link>
          <Link to="/blaschke-ghosts" style={{ color: '#7dd3fc' }}>
            Blaschke Ghosts (§17)
          </Link>
          <Link to="/three-attacks" style={{ color: '#7dd3fc' }}>
            Three Attacks (§18)
          </Link>
          <Link to="/kyp-bounded-real" style={{ color: '#7dd3fc' }}>
            KYP / Bounded-Real
          </Link>
          <Link to="/improvement-queue" style={{ color: '#7dd3fc' }}>
            Improvement Queue
          </Link>
        </div>
      </section>
    </div>
  );
}
