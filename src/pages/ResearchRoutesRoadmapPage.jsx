// ResearchRoutesRoadmapPage.jsx — /routes-roadmap
// Reading page for src/data/research-routes-roadmap.js (RESEARCH_ROUTES): the fifty experimental
// routes of 2026-10-06, grouped A–J, with tag and status filters. Presentation only; every fact
// (status, batch, result) lives in the data module.

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RESEARCH_ROUTES,
  RESEARCH_ROUTE_GROUPS,
  RESEARCH_ROUTE_TAGS,
  RESEARCH_ROUTE_STATUSES,
  RESEARCH_ROUTE_FIRST_PICKS,
  RESEARCH_ROUTES_META as META,
} from '../data/research-routes-roadmap.js';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import ConceptText from '../components/ConceptText.jsx';

const mono = 'var(--ed-mono, var(--font-mono))';

const STATUS_CLASS = { planned: 'g-map', 'in progress': 'g-run', partial: 'g-cond', done: 'g-ver', blocked: 'g-ref' };
const TAG_CLASS = { 'Λ': 'g-cand', RH: 'g-rheq', map: 'g-meas', tool: 'g-thm' };

function Chip({ cls, children, title }) {
  return (
    <span className={`ed-grade ${cls}`} title={title} style={{ fontSize: 10, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

function FilterButton({ active, onClick, children, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        fontFamily: mono,
        fontSize: 11,
        padding: '3px 10px',
        borderRadius: 999,
        border: `1px solid ${active ? 'var(--ink)' : 'var(--hairline)'}`,
        background: active ? 'var(--ink)' : 'transparent',
        color: active ? 'var(--paper)' : 'var(--ink-soft)',
        cursor: 'pointer',
      }}
    >
      {children}
      {count != null && <span style={{ opacity: 0.65 }}> {count}</span>}
    </button>
  );
}

function RouteRow({ route }) {
  return (
    <div
      id={`route-${route.id}`}
      style={{ borderTop: '1px solid var(--hairline)', padding: '12px 0', display: 'grid', gridTemplateColumns: '3.2rem 1fr', gap: 12 }}
    >
      <div style={{ fontFamily: mono, fontSize: 13, color: 'var(--faint)' }}>{String(route.id).padStart(2, '0')}</div>
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          <strong style={{ color: 'var(--ink)', fontSize: 16 }}>{route.title}</strong>
          <Chip cls={TAG_CLASS[route.tag]} title={RESEARCH_ROUTE_TAGS[route.tag]}>{route.tag}</Chip>
          <Chip cls={STATUS_CLASS[route.status]}>{route.status}</Chip>
          {route.batch != null && <Chip cls="g-cond">batch {route.batch}</Chip>}
          {route.firstPick && <Chip cls="g-cand">first pick</Chip>}
        </div>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.65, margin: '6px 0 0' }}>
          <ConceptText text={route.summary} max={3} />
        </p>
        <p style={{ color: 'var(--faint)', fontSize: 13, lineHeight: 1.6, margin: '6px 0 0' }}>
          <span style={{ fontFamily: mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6 }}>Why not closed · </span>
          <ConceptText text={route.whyNotClosed} max={2} />
        </p>
        {route.result && (
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, margin: '6px 0 0', borderLeft: '2px solid var(--brass-dk)', paddingLeft: 10 }}>
            <span style={{ fontFamily: mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6 }}>Result · </span>
            {route.result}
          </p>
        )}
        {(route.resultPage || route.resultModule || route.seeAlso.length > 0) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6, fontFamily: mono, fontSize: 11 }}>
            {route.resultPage && <Link to={route.resultPage}>result page →</Link>}
            {route.resultModule && <span style={{ color: 'var(--faint)' }}>data: {route.resultModule}</span>}
            {route.seeAlso.map((p) => (
              <Link key={p} to={p} style={{ color: 'var(--faint)' }}>{p}</Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResearchRoutesRoadmapPage() {
  const [tag, setTag] = useState('all');
  const [status, setStatus] = useState('all');

  const visible = useMemo(
    () => RESEARCH_ROUTES.filter((r) => (tag === 'all' || r.tag === tag) && (status === 'all' || r.status === status)),
    [tag, status],
  );
  const byGroup = useMemo(() => {
    const m = new Map(Object.keys(RESEARCH_ROUTE_GROUPS).map((g) => [g, []]));
    visible.forEach((r) => m.get(r.group).push(r));
    return m;
  }, [visible]);

  const countTag = (t) => RESEARCH_ROUTES.filter((r) => r.tag === t).length;
  const countStatus = (s) => RESEARCH_ROUTES.filter((r) => r.status === s).length;
  const byId = Object.fromEntries(RESEARCH_ROUTES.map((r) => [r.id, r]));

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Roadmap · {META.date}
          </div>
          <h1 className="ed-h1" style={{ margin: '6px 0 10px' }}>Fifty research routes</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 16, lineHeight: 1.65 }}>{META.frame}</p>
          <p style={{ color: 'var(--faint)', fontSize: 13, lineHeight: 1.6, marginTop: 8 }}>
            Closed classes: {META.closedClasses.join(' · ')}.
          </p>
          <p style={{ color: 'var(--faint)', fontSize: 13, lineHeight: 1.6, marginTop: 6 }}>{META.statusNote}</p>
          <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', marginTop: 6 }}>
            source: {META.source} · data: src/data/research-routes-roadmap.js
          </p>
        </div>

        <div className="card" style={{ marginBottom: 22, background: 'var(--paper2)' }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 8 }}>Batch 1 — first picks, in order</h3>
          <ol style={{ margin: 0, paddingLeft: 20, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7 }}>
            {RESEARCH_ROUTE_FIRST_PICKS.map((p) => (
              <li key={p.id}>
                <a href={`#route-${p.id}`}>Route {p.id}: {byId[p.id].title}</a>{' '}
                <Chip cls={STATUS_CLASS[byId[p.id].status]}>{byId[p.id].status}</Chip>{' '}
                <span style={{ color: 'var(--faint)' }}>{p.reason}</span>
              </li>
            ))}
          </ol>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', width: '4rem' }}>tag</span>
            <FilterButton active={tag === 'all'} onClick={() => setTag('all')} count={RESEARCH_ROUTES.length}>all</FilterButton>
            {Object.keys(RESEARCH_ROUTE_TAGS).map((t) => (
              <FilterButton key={t} active={tag === t} onClick={() => setTag(t)} count={countTag(t)}>{t}</FilterButton>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', width: '4rem' }}>status</span>
            <FilterButton active={status === 'all'} onClick={() => setStatus('all')} count={RESEARCH_ROUTES.length}>all</FilterButton>
            {RESEARCH_ROUTE_STATUSES.map((s) => (
              <FilterButton key={s} active={status === s} onClick={() => setStatus(s)} count={countStatus(s)}>{s}</FilterButton>
            ))}
          </div>
          <div style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>
            {Object.entries(RESEARCH_ROUTE_TAGS).map(([t, d]) => `${t}: ${d}`).join(' · ')}
          </div>
        </div>

        {visible.length === 0 && (
          <p style={{ color: 'var(--faint)', fontSize: 14 }}>No routes match these filters.</p>
        )}

        {[...byGroup.entries()].filter(([, rs]) => rs.length > 0).map(([g, rs]) => (
          <section key={g} style={{ marginTop: 26 }}>
            <h2 style={{ fontSize: 22, margin: '0 0 4px', color: 'var(--ink)' }}>
              <span style={{ fontFamily: mono, color: 'var(--accent)', marginRight: 10 }}>{g}</span>
              {RESEARCH_ROUTE_GROUPS[g]}
            </h2>
            {rs.map((r) => <RouteRow key={r.id} route={r} />)}
          </section>
        ))}

        <div className="card" style={{ marginTop: 30, background: 'var(--paper2)' }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 10 }}>Related pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13 }}>
            <Link to="/rh-novel-routes-roadmap">Routes A–G roadmap (2026-09-23)</Link>
            <Link to="/route-map">Route map</Link>
            <Link to="/project-dag">Project attempts DAG</Link>
            <Link to="/no-gos">No-go results</Link>
            <Link to="/lambda-bounds">Λ bounds</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
