// PaperAuditDashboardPage.jsx -- imp-1218
// Renders the running tracker of every named conjecture in the historic v52
// ledger plus the current twin-ladder correction overlay. The per-conjecture verdicts
// retain their original v52 provenance.
//
// Pure rendering. All structural facts + tripwires live in
// src/data/paper-audit-dashboard.js.
//
// Editorial (warm) re-theme: full-width dashboard, identical structure/data.

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { PAPER_AUDIT_DASHBOARD } from '../data/paper-audit-dashboard.js';
import { ED, alpha } from '../styles/tokens.js';

const D = PAPER_AUDIT_DASHBOARD;
const mono = 'var(--ed-mono, var(--font-mono))';

// Color theme per verdict status -- consistent across chips + row badges.
// Warm-palette mapping of the original dark-theme hues (kept 1:1 by role).
const STATUS_COLORS = {
  'SUBSUMED-BY-RH':         { fg: 'var(--terra-dk)', bg: alpha(ED.series2, 0.1), border: alpha(ED.accent, 0.45) },
  'SUBSUMED-BY-LITERATURE': { fg: 'var(--terra)',    bg: alpha(ED.accentDeco, 0.1), border: alpha(ED.accentDeco, 0.45) },
  'PARTIALLY-RELATED':      { fg: 'var(--brass-dk)', bg: alpha(ED.brassDeco, 0.12), border: alpha(ED.brassDeco, 0.45) },
  'INDEPENDENT-NOVEL':      { fg: 'var(--green)',    bg: alpha(ED.series3, 0.1), border: alpha(ED.series3, 0.45) },
  UNAUDITED:                { fg: 'var(--faint)',    bg: alpha(ED.inkFaint, 0.1), border: alpha(ED.rule, 0.45) },
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
        background: active ? c.bg : 'var(--paper2)',
        border: `1px solid ${active ? c.border : 'var(--hairline)'}`,
        color: active ? c.fg : 'var(--ink-soft)',
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
          background: 'color-mix(in srgb, var(--ink) 8%, transparent)',
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
        color: active ? 'var(--ink)' : 'var(--faint)',
        background: 'var(--paper2)',
        borderBottom: '1px solid var(--hairline)',
        cursor: 'pointer',
        letterSpacing: 0.4,
        userSelect: 'none',
        width,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
      {active && (
        <span style={{ marginLeft: 6, color: 'var(--faint)' }}>
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
          background: expanded ? 'var(--paper3)' : 'transparent',
          borderBottom: '1px solid var(--hair2)',
        }}
      >
        <td style={{ padding: '10px 12px', fontFamily: mono, color: 'var(--ink)', fontSize: 13 }}>
          <span style={{ color: 'var(--faint)', marginRight: 8 }}>
            {expanded ? '▼' : '▶'}
          </span>
          {entry.id}
        </td>
        <td style={{ padding: '10px 12px', color: 'var(--ink-soft)', fontSize: 13 }}>
          {entry.shortName}
        </td>
        <td style={{ padding: '10px 12px', fontFamily: mono, color: 'var(--faint)', fontSize: 12 }}>
          {entry.paperSection}
        </td>
        <td style={{ padding: '10px 12px' }}>
          <StatusBadge status={entry.auditStatus} />
        </td>
        <td style={{ padding: '10px 12px', fontFamily: mono, color: 'var(--faint)', fontSize: 12 }}>
          {entry.auditTicket || <span style={{ color: 'var(--hairline)' }}>—</span>}
        </td>
      </tr>
      {expanded && (
        <tr style={{ background: 'var(--paper2)' }}>
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
                <div style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
                  {entry.statement}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontFamily: mono, fontSize: 12 }}>
                <div>
                  <span style={{ color: 'var(--faint)' }}>Audit ticket: </span>
                  <span style={{ color: 'var(--ink-soft)' }}>
                    {entry.auditTicket || 'none (UNAUDITED)'}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--faint)' }}>Audit date: </span>
                  <span style={{ color: 'var(--ink-soft)' }}>
                    {entry.auditDate || '—'}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--faint)' }}>Paper section: </span>
                  <span style={{ color: 'var(--ink-soft)' }}>{entry.paperSection}</span>
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
                <div style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
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

  const maxAuditDate = useMemo(() => {
    const dates = D.conjectures.map((c) => c.auditDate).filter(Boolean);
    return dates.length ? [...dates].sort().at(-1) : null;
  }, []);

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
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <header style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 8 }}>
            Paper Audit Dashboard · {D.currentReviewVersion} Review
          </h1>
          <div style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            Current review source:{' '}
            <code style={{ color: 'var(--ink)', fontFamily: mono }}>
              {D.currentReviewPaper}
            </code>{' '}
            · correction audit <code style={{ color: 'var(--ink)', fontFamily: mono }}>
              {D.currentCorrectionAudit}
            </code>
          </div>
          <div style={{ color: 'var(--faint)', fontSize: 13, marginTop: 4 }}>
            Historic verdict ledger preserved from{' '}
            <code style={{ color: 'var(--faint)', fontFamily: mono }}>
              {D.historicalAuditPaper}
            </code>{' '}
            Sections {D.paperSectionsCovered.join(', ')}.
          </div>
          <div style={{ color: 'var(--faint)', fontSize: 13, marginTop: 6, fontFamily: mono }}>
            {D.auditedCount} of {D.totalCount} audited
            {' · '}
            <span style={{ color: STATUS_COLORS.UNAUDITED.fg }}>
              {D.statusCounts['UNAUDITED'] || 0} unaudited
            </span>
            {' · '}
            {D.completedAuditTickets.length} audit tickets shipped
            {maxAuditDate && (
              <>
                {' · '}
                <span title="Most recent auditDate across all conjecture entries">
                  data as of {maxAuditDate}
                </span>
              </>
            )}
          </div>
        </header>

        {/* ── twin-ladder correction overlay; historic rows below remain v52 records ── */}
        <section
          className="card"
          style={{
            marginBottom: 20,
            padding: '14px 18px',
            background: 'color-mix(in srgb, var(--series-1) 8%, transparent)',
            border: '1px solid color-mix(in srgb, var(--series-1) 35%, transparent)',
            borderRadius: 8,
          }}
        >
          <div style={{ color: 'var(--blue)', fontFamily: mono, fontSize: 12, fontWeight: 700 }}>
            twin-ladder correction overlay
          </div>
          <p style={{ margin: '8px 0 0', color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
            {D.currentReview.scope}
          </p>
          <ul
            style={{
              margin: '10px 0 0',
              paddingLeft: 20,
              color: 'var(--faint)',
              fontSize: 13,
              lineHeight: 1.65,
            }}
          >
            {D.currentReview.corrections.map((correction) => (
              <li key={correction.id} style={{ marginBottom: 7 }}>
                <strong style={{ color: 'var(--blue)' }}>{correction.affects}:</strong>{' '}
                {correction.correctedStatement}
              </li>
            ))}
          </ul>
        </section>

        {/* ── RH-EQUIVALENT re-characterization banner (imp-3213) ────────── */}
        <section
          className="card"
          style={{
            marginBottom: 20,
            padding: '14px 18px',
            background: 'color-mix(in srgb, var(--brass-deco) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--brass-deco) 40%, transparent)',
            borderRadius: 8,
            display: 'grid',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: mono,
                fontSize: 11,
                letterSpacing: 0.5,
                color: 'var(--brass-dk)',
                fontWeight: 700,
              }}
            >
              STATUS — §15-27 PROGRAM TARGET IS RH-EQUIVALENT
            </span>
            <span style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>
              (imp-3190 re-characterization)
            </span>
          </div>
          <div style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
            The entire §15-27 program collapses (imp-1258 two-way collapse) to a
            single claim: <strong>Conjecture 27.2 (Volterra-norm ‖V<sub>a,Φ</sub>‖ ≤ 1)</strong>.
            That conjecture is <strong>RH-EQUIVALENT</strong> — closing it would{' '}
            <em>be</em> proving RH, not a sub-step. The §15-27 collapse is a
            reformulation, NOT a reduction to an easier object.
          </div>
          <div style={{ color: 'var(--faint)', fontSize: 13, lineHeight: 1.6 }}>
            <span
              style={{
                color: 'var(--green)',
                fontFamily: mono,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              GENUINELY OPEN &amp; TRACTABLE (
              {D.openGapRecharacterization.genuinelyOpenAndAttackableCount}):
            </span>{' '}
            {D.openGapRecharacterization.genuinelyOpenAndAttackable.join('; ')}.
            This is the only deterministic-forward residual — RH-hard on the real-zero
            basin, and the same target the C_H frontier converged on.
          </div>
          <div style={{ color: 'var(--faint)', fontSize: 12, fontFamily: mono, lineHeight: 1.5 }}>
            RH-equivalent items: {D.openGapRecharacterization.rhEquivalent.items.join(' · ')}
            <span style={{ marginLeft: 12, color: 'var(--hairline)' }}>
              PT Λ ≤ 0.2 is the peer-reviewed benchmark; program candidates Λ ≤ 0.1787854 (computer-assisted, reviewed by Dan Romik, unrefereed) and Λ ≤ 0.1758354 (unrefereed) · no QED
            </span>
          </div>
        </section>

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
                  border: '1px solid var(--hairline)',
                  color: 'var(--faint)',
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
            className="card"
            style={{
              border: '1px solid var(--hairline)',
              borderRadius: 8,
              overflow: 'hidden',
              background: 'var(--paper2)',
              padding: 0,
            }}
          >
            <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 530 }}>
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
                        color: 'var(--faint)',
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
          </div>
          <div style={{ color: 'var(--faint)', fontSize: 12, marginTop: 8, fontFamily: mono }}>
            Click a row to expand statement + audit + recommendation. Click a column header to sort.
          </div>
        </section>

        {/* ── Completed audit tickets ────────────────────────────────── */}
        <section style={{ marginBottom: 32 }}>
          <h2 className="ed-h2" style={{ marginBottom: 12 }}>
            Completed audit tickets
          </h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {D.completedAuditTickets.map((t) => (
              <div
                key={t.ticket}
                className="card"
                style={{
                  padding: '12px 16px',
                  background: 'var(--paper2)',
                  border: '1px solid var(--hairline)',
                  borderRadius: 6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: mono, color: 'var(--brass-dk)', fontSize: 13 }}>
                    {t.ticket}
                  </span>
                  <span style={{ color: 'var(--ink-soft)', fontSize: 13 }}>{t.title}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--faint)', fontFamily: mono, fontSize: 11 }}>
                    {t.auditDate}
                  </span>
                </div>
                <div style={{ color: 'var(--faint)', fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--faint)', fontFamily: mono }}>Verdict: </span>
                  {t.verdict}
                </div>
                <div style={{ color: 'var(--faint)', fontSize: 12, marginTop: 4, fontFamily: mono }}>
                  Covers: {t.coversConjectures.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Scope ───────────────────────────────────────────── */}
        <section style={{ marginBottom: 32 }}>
          <h2 className="ed-h2" style={{ marginBottom: 12 }}>
            Scope
          </h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              color: 'var(--faint)',
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
            borderTop: '1px solid var(--hairline)',
            color: 'var(--faint)',
            fontSize: 12,
            fontFamily: mono,
          }}
        >
          <div style={{ marginBottom: 6 }}>Related pages</div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/shift-bridge-positivity" style={{ color: 'var(--brass-dk)' }}>
              Shift-Bridge (§15)
            </Link>
            <Link to="/closure-routes" style={{ color: 'var(--brass-dk)' }}>
              Four Closure Routes (§16)
            </Link>
            <Link to="/blaschke-ghosts" style={{ color: 'var(--brass-dk)' }}>
              Blaschke Ghosts (§17)
            </Link>
            <Link to="/three-attacks" style={{ color: 'var(--brass-dk)' }}>
              Three Approaches (§18)
            </Link>
            <Link to="/kyp-bounded-real" style={{ color: 'var(--brass-dk)' }}>
              KYP / Bounded-Real
            </Link>
            <Link to="/volterra-bound" style={{ color: 'var(--brass-dk)' }}>
              Volterra Norm Bound (§15-27 collapse)
            </Link>
            <Link to="/improvement-queue" style={{ color: 'var(--brass-dk)' }}>
              Improvement Queue
            </Link>
            <Link to="/" style={{ color: 'var(--brass)', marginLeft: 'auto' }}>
              ← the atlas
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
