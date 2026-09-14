import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { RESULTS, GRADE_META, GRADE_ORDER } from '../data/graded-results.js';

/* /results — the graded results browser. One row per principal result,
   grade badges verbatim (nothing promotes a bound), verification artifacts
   listed per row, filterable by grade facet. Import-light. */

const META_BY_GRADE = Object.fromEntries(GRADE_META.map((g) => [g.grade, g]));

function GradeBadge({ grade }) {
  const color = META_BY_GRADE[grade]?.color || 'var(--ink-soft)';
  return (
    <span className="ed-mono" style={{
      fontSize: 10, fontWeight: 700, color, border: `1px solid ${color}`,
      borderRadius: 4, padding: '1px 7px', whiteSpace: 'nowrap',
    }}>{grade}</span>
  );
}

function ResultRow({ r }) {
  return (
    <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper2)', padding: '13px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 5 }}>
        <GradeBadge grade={r.grade} />
        <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)' }}>{r.thread}</span>
        <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)', marginLeft: 'auto' }}>{r.date}</span>
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.55 }}>{r.statement}</div>
      <div style={{ marginTop: 7, display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        {r.verification.map((v) => (
          <span key={v} className="ed-mono" style={{
            fontSize: 10.5, color: 'var(--ink-soft)', background: 'var(--paper)',
            border: '1px solid var(--hairline)', borderRadius: 4, padding: '1px 6px',
          }}>{v}</span>
        ))}
        {r.route && <Link to={r.route} style={{ fontSize: 12.5 }}>open →</Link>}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const [activeGrade, setActiveGrade] = useState(null); // null = all

  const counts = useMemo(() => {
    const c = {};
    for (const r of RESULTS) c[r.grade] = (c[r.grade] || 0) + 1;
    return c;
  }, []);

  const groups = useMemo(() => {
    const shown = GRADE_ORDER.filter((g) => counts[g] && (!activeGrade || g === activeGrade));
    return shown.map((grade) => ({
      grade,
      meta: META_BY_GRADE[grade],
      items: RESULTS.filter((r) => r.grade === grade),
    }));
  }, [activeGrade, counts]);

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">the ledger, graded</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 38, lineHeight: 1.1, margin: '6px 0 10px', color: 'var(--ink)' }}>
          Results
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '54rem' }}>
          The principal results of this program, one row per result, each with its verbatim grade and the
          verification artifacts behind it. Grades never promote: a kernel-verified lemma is a lemma, a candidate
          is not a bound, a contract is not a bound. Λ ≤ 0.2 (Platt–Trudgian 2021) is the peer-reviewed benchmark;
          RH remains open.
        </p>

        {/* grade facet filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '18px 0 6px' }}>
          <button
            type="button"
            onClick={() => setActiveGrade(null)}
            className="ed-mono"
            style={{
              fontSize: 11, fontWeight: 700, cursor: 'pointer', borderRadius: 5, padding: '3px 10px',
              color: activeGrade === null ? 'var(--paper)' : 'var(--ink-soft)',
              background: activeGrade === null ? 'var(--ink)' : 'var(--paper2)',
              border: '1px solid var(--hairline)',
            }}
          >all · {RESULTS.length}</button>
          {GRADE_ORDER.filter((g) => counts[g]).map((g) => {
            const on = activeGrade === g;
            const color = META_BY_GRADE[g].color;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setActiveGrade(on ? null : g)}
                className="ed-mono"
                style={{
                  fontSize: 11, fontWeight: 700, cursor: 'pointer', borderRadius: 5, padding: '3px 10px',
                  color: on ? 'var(--paper)' : color,
                  background: on ? color : 'var(--paper2)',
                  border: `1px solid ${color}`,
                }}
              >{g} · {counts[g]}</button>
            );
          })}
        </div>

        {groups.map(({ grade, meta, items }) => (
          <section key={grade} style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
              <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 21, margin: 0, color: meta.color }}>
                {grade} — {items.length}
              </h2>
              <span style={{ fontSize: 12.5, color: 'var(--faint)' }}>{meta.desc}</span>
            </div>
            <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
              {items.map((r) => <ResultRow key={r.statement} r={r} />)}
            </div>
          </section>
        ))}

        <div style={{ marginTop: 26, fontSize: 13.5 }}>
          <Link to="/what-we-know">What We Know →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/no-gos">No-Go Theorems →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/atlas">Atlas →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/">← home</Link>
        </div>
      </div>
    </div>
  );
}
