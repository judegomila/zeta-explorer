import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader, GradeChip } from '../components/editorial/PostLayout.jsx';
import {
  KEY_RESULTS,
  KEY_RESULT_GROUPS,
  KEY_RESULT_SCALES,
  KEY_RESULT_STATUSES,
  KEY_RESULT_TIERS,
  REPO_BLOB_BASE,
  STRESS_TEST_DATE,
  STRESS_TEST_REPORT,
  hasRanking,
  rankedSections,
} from '../data/key-results.js';

/* /key-results — the project's listed findings with the outcome of the
   two-stage stress test of 2026-11-21, and links to the pages and repository
   files where each one lives. Static and import-light: all content is in
   src/data/key-results.js.

   Two views of the same items. Ranked view (the default, used whenever an item
   carries a numeric `rank`): items sorted by rank under the tier headings of
   KEY_RESULT_TIERS, every tier shown, an empty tier stated as empty. Grouped
   view (fallback when no item is ranked): the headings of KEY_RESULT_GROUPS. */

const H2 = { fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 22, margin: '30px 0 4px', color: 'var(--ink)' };
const SEP = <span style={{ color: 'var(--faint)' }}> · </span>;

function StatusChip({ status }) {
  const s = KEY_RESULT_STATUSES[status];
  if (!s) return null;
  return <GradeChip grade={s.grade}>{s.label}</GradeChip>;
}

function ReviewField({ label, children }) {
  return (
    <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
      <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</span>{' '}
      {children}
    </div>
  );
}

const isScore = (v) => typeof v === 'number' && Number.isFinite(v);

function ReviewFields({ r }) {
  const rows = [];
  if (r.verification) rows.push(<ReviewField key="v" label="Verification">{r.verification}</ReviewField>);
  if (r.novelty) rows.push(<ReviewField key="n" label="Novelty">{r.novelty}</ReviewField>);
  if (isScore(r.arbitrariness)) rows.push(<ReviewField key="a" label="Arbitrariness">{r.arbitrariness} of 5</ReviewField>);
  if (isScore(r.importance)) rows.push(<ReviewField key="i" label="Importance">{r.importance} of 5</ReviewField>);
  if (r.review && isScore(r.rank)) {
    rows.push(
      <ReviewField key="f" label="Review files">
        <a href={`${REPO_BLOB_BASE}${r.review.verdict}`} target="_blank" rel="noreferrer">first verdict ↗</a>
        {SEP}
        <a href={`${REPO_BLOB_BASE}${r.review.referee}`} target="_blank" rel="noreferrer">referee (final) ↗</a>
      </ReviewField>,
    );
  }
  if (rows.length === 0) return null;
  return (
    <div className="kr-review" style={{ marginTop: 9, paddingTop: 8, borderTop: '1px solid var(--hairline)', display: 'grid', gap: 3 }}>
      {rows}
    </div>
  );
}

function ResultCard({ r, showRank }) {
  const links = [
    ...r.links.map((l) => <Link key={`i:${l.to}`} to={l.to}>{l.label} →</Link>),
    ...r.external.map((l) => <a key={`e:${l.href}`} href={l.href}>{l.label} →</a>),
  ];
  return (
    <div id={r.id} className="kr-item" style={{ border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper2)', padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 5 }}>
        {showRank && isScore(r.rank) && (
          <span className="ed-mono kr-rank" style={{ fontSize: 12, color: 'var(--faint)' }}>{r.rank}</span>
        )}
        <strong style={{ color: 'var(--ink)', fontSize: 15.5 }}>{r.title}</strong>
        <StatusChip status={r.status} />
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>{r.statement}</div>
      {r.statusNote && (
        <div style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
          <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Status</span>{' '}
          {r.statusNote}
        </div>
      )}
      <ReviewFields r={r} />
      {links.length > 0 && (
        <div className="kr-links" style={{ marginTop: 9, fontSize: 13, lineHeight: 1.7 }}>
          <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '.08em' }}>In the app</span>{' '}
          {links.map((el, i) => <React.Fragment key={el.key}>{i > 0 && SEP}{el}</React.Fragment>)}
        </div>
      )}
      {r.repo.length > 0 && (
        <div className="kr-repo" style={{ marginTop: 4, fontSize: 13, lineHeight: 1.7 }}>
          <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '.08em' }}>In the repository</span>{' '}
          {r.repo.map((f, i) => (
            <React.Fragment key={f.path}>
              {i > 0 && SEP}
              <a href={`${REPO_BLOB_BASE}${f.path}`} target="_blank" rel="noreferrer">{f.label} ↗</a>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

function GroupedView() {
  return KEY_RESULT_GROUPS.map((g) => {
    const items = KEY_RESULTS.filter((r) => r.group === g.id);
    if (items.length === 0) return null;
    return (
      <section key={g.id} id={`group-${g.id}`}>
        <h2 style={H2}>{g.heading}</h2>
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', margin: '0 0 10px' }}>{g.blurb}</p>
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map((r) => <ResultCard key={r.id} r={r} />)}
        </div>
      </section>
    );
  });
}

const TIER_MEANING = Object.fromEntries(KEY_RESULT_TIERS.map((t) => [t.tier, t.meaning]));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function RankedView() {
  return rankedSections(KEY_RESULTS, { withEmptyTiers: true }).map((sec, i) => (
    <section key={`${sec.tier || 'ranked'}-${i}`} className="kr-tier" data-tier={sec.tier || ''}>
      {sec.tier ? <h2 style={H2}>{cap(sec.tier)}</h2> : <div style={{ height: 22 }} />}
      {sec.tier && TIER_MEANING[sec.tier] && (
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', margin: '0 0 10px' }}>
          {TIER_MEANING[sec.tier]}
          {sec.items.length > 0 && <> {sec.items.length} {sec.items.length === 1 ? 'item' : 'items'}.</>}
        </p>
      )}
      {sec.items.length === 0 ? (
        <p className="kr-tier-empty" style={{ fontSize: 14, color: 'var(--ink)', margin: '0 0 4px' }}>
          No item is in this tier.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: 12, marginTop: 10 }}>
          {sec.items.map((r) => <ResultCard key={r.id} r={r} showRank />)}
        </div>
      )}
    </section>
  ));
}

function HowToRead() {
  const notHeld = KEY_RESULTS.filter((r) => r.tier === 'not established').length;
  const maxImportance = Math.max(...KEY_RESULTS.map((r) => (isScore(r.importance) ? r.importance : 0)));
  return (
    <div className="kr-howto" style={{ margin: '16px 0 0', maxWidth: '54rem', border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper2)', padding: '14px 16px' }}>
      <div className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 5 }}>How to read this</div>
      <p style={{ fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
        Every item on this page was re-run and attacked by two independent reviewers on {STRESS_TEST_DATE}: a
        first reviewer, then a referee who checked the first review. Both were AI agents; this is not an
        external or peer review. Where the two differ, the referee’s verdict is the one shown. Items are in
        rank order: what was verified first, then what depends least on the project’s own choices, then
        consequence. Each item has two scores. Arbitrariness: {KEY_RESULT_SCALES.arbitrariness}.
        Importance: {KEY_RESULT_SCALES.importance}. No item scored above {maxImportance} for importance. No
        item gives new information on the zeros of zeta, and none changes a refereed bound.{' '}
        {notHeld === 2 ? 'Two items' : `${notHeld} items`} did not hold; they are listed last with what was
        wrong. Where the test weakened a claim, the item states the weaker statement and, at the end of its
        status note, what was corrected.
      </p>
      <p style={{ fontSize: 13.5, margin: '8px 0 0' }}>
        <a href={`${REPO_BLOB_BASE}${STRESS_TEST_REPORT}`} target="_blank" rel="noreferrer">Full ranking report ↗</a>
        <span style={{ color: 'var(--ink-soft)' }}> (ranked table, what was weakened, where the reviewers differed, what was not independently verified)</span>
      </p>
    </div>
  );
}

export default function KeyResultsPage() {
  const ranked = hasRanking(KEY_RESULTS);
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">summary · {KEY_RESULTS.length} items</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 38, lineHeight: 1.1, margin: '6px 0 10px', color: 'var(--ink)' }}>
          Key results
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '54rem' }}>
          The findings the project listed as its main results. Each item states what holds, carries one
          status label, and links to the pages of this site and the files of the repository where the work is.
        </p>
        {ranked && <HowToRead />}
        <div className="ed-verdict" style={{ margin: '14px 0 0', maxWidth: '54rem' }}>
          None of the results is externally refereed. A Lean note covers only the part it names. Nothing
          here proves the Riemann Hypothesis.
        </div>

        <h2 style={H2}>Status labels</h2>
        <div style={{ display: 'grid', gap: 7, marginTop: 8, maxWidth: '54rem' }}>
          {Object.entries(KEY_RESULT_STATUSES).map(([key, s]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              <GradeChip grade={s.grade}>{s.label}</GradeChip>
              <span style={{ flex: '1 1 22rem' }}>{s.meaning}</span>
            </div>
          ))}
        </div>

        {ranked ? <RankedView /> : <GroupedView />}

        <div style={{ marginTop: 30, fontSize: 13.5 }}>
          <Link to="/results">Graded results →</Link>
          {SEP}
          <Link to="/what-we-know">What we know →</Link>
          {SEP}
          <Link to="/routes-roadmap">Fifty research routes →</Link>
          {SEP}
          <Link to="/rh-research-modules">RH research modules →</Link>
          {SEP}
          <Link to="/">← home</Link>
        </div>
      </div>
    </div>
  );
}
