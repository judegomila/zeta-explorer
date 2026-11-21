import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import WireframeAnim from '../components/editorial/WireframeAnim.jsx';
import { THREADS, THREADS_META } from '../data/research-threads.js';
import { ED, STATUS } from '../styles/tokens.js';

/* /threads — the research-thread narrative layer: a curated index of the
   program's major lines of work, each with a dated timeline, its open
   objects, and its key numbers. Single page with per-thread anchors.
   Grades verbatim; nothing here promotes a bound. */

const STATUS_COLOR = (status) =>
  /in progress/i.test(status) ? ED.brassDeco
  : /killed|refuted/i.test(status) ? STATUS.refuted.fg
  : ED.series3;

function StatusChip({ status }) {
  const c = STATUS_COLOR(status);
  return (
    <span className="ed-mono" style={{ fontSize: 10, fontWeight: 700, color: c, border: `1px solid ${c}`, borderRadius: 4, padding: '1px 6px', whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

function GradeTag({ grade }) {
  return (
    <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--ink-soft)', border: '1px solid var(--hairline)', borderRadius: 4, padding: '1px 6px', background: 'var(--paper)' }}>
      {grade}
    </span>
  );
}

function ThreadCard({ t }) {
  const kn = t.keyNumbers && t.keyNumbers[0];
  return (
    <a href={`#${t.slug}`} style={{ textDecoration: 'none', display: 'block', border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper2)', padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 5 }}>
        <StatusChip status={t.status} />
        <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)' }}>{t.slug}</span>
      </div>
      <div style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 17, color: 'var(--ink)', lineHeight: 1.25, marginBottom: 5 }}>{t.title}</div>
      <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{t.oneLine}</div>
      {kn && (
        <div className="ed-mono" style={{ marginTop: 8, fontSize: 11.5, color: 'var(--ink)' }}>
          {kn.value} <span style={{ color: 'var(--faint)' }}>— {kn.meaning}</span>
        </div>
      )}
    </a>
  );
}

function TimelineRow({ e }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '86px 1fr', gap: 12, padding: '10px 0', borderTop: '1px solid var(--hairline)' }}>
      <div className="ed-mono" style={{ fontSize: 11, color: 'var(--faint)', paddingTop: 2 }}>{e.date}</div>
      <div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{e.event}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
          <span className="ed-mono" style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--ink)' }}>{e.verdict}</span>
          {e.module && <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)' }}>{e.module}</span>}
          {e.commit && <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)' }}>{e.commit}</span>}
          {e.route && <Link to={e.route} className="ed-mono" style={{ fontSize: 10.5 }}>{e.route} →</Link>}
        </div>
      </div>
    </div>
  );
}

function ThreadSection({ t }) {
  return (
    <section id={t.slug} style={{ marginTop: 30, scrollMarginTop: 70 }}>
      <details open={false} style={{ border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper2)' }}>
        <summary style={{ cursor: 'pointer', listStyle: 'none', padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <StatusChip status={t.status} />
            <span style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 20, color: 'var(--ink)' }}>{t.title}</span>
            <GradeTag grade={t.grade} />
            <span className="ed-mono" style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--faint)' }}>
              {t.timeline.length} events · expand ▾
            </span>
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, marginTop: 6 }}>{t.oneLine}</div>
        </summary>
        <div style={{ padding: '0 18px 16px' }}>
          <div className="ed-lbl" style={{ marginTop: 6 }}>timeline</div>
          <div>
            {t.timeline.map((e, i) => <TimelineRow key={i} e={e} />)}
          </div>
          {t.openObjects && t.openObjects.length > 0 && (
            <>
              <div className="ed-lbl" style={{ marginTop: 14 }}>open objects</div>
              <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                {t.openObjects.map((o, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{o}</li>
                ))}
              </ul>
            </>
          )}
          {t.keyNumbers && t.keyNumbers.length > 0 && (
            <>
              <div className="ed-lbl" style={{ marginTop: 14 }}>key numbers</div>
              <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
                {t.keyNumbers.map((k, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                    <span className="ed-mono" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>{k.value}</span>
                    <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{k.meaning}</span>
                    {k.provenanceRoute && <Link to={k.provenanceRoute} className="ed-mono" style={{ fontSize: 10.5 }}>{k.provenanceRoute} →</Link>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </details>
    </section>
  );
}

export default function ThreadsPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">the narrative layer</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 38, lineHeight: 1.1, margin: '6px 0 10px', color: 'var(--ink)' }}>
          Research Threads
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '48rem' }}>
          The program's {THREADS.length} major lines of work as dated timelines: what happened, in what order,
          with each step's verdict and grade stated verbatim. Curated from the repo record
          (compiled {THREADS_META.compiled}; master ledger formalization/ARISTOTLE_TARGETS.md).
          Nothing on this page establishes a bound.
        </p>

        <div style={{ maxWidth: 460, border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden', margin: '16px 0 4px', background: 'var(--paper)' }}>
          <WireframeAnim kind="de-bruijn-track" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12, marginTop: 18 }}>
          {THREADS.map((t) => <ThreadCard key={t.slug} t={t} />)}
        </div>

        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 22, margin: '34px 0 0', color: 'var(--ink)' }}>
          The threads in full
        </h2>
        {THREADS.map((t) => <ThreadSection key={t.slug} t={t} />)}

        <div style={{ marginTop: 26, fontSize: 13.5 }}>
          <Link to="/program-dag">The Program DAG — the complete history →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/what-we-know">What We Know →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/no-gos">No-Go Theorems →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/formalization-status">Formalization Status →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/">← home</Link>
        </div>
      </div>
    </div>
  );
}
