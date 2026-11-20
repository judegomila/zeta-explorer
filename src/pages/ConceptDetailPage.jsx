/**
 * /concept/:slug — one concept, readable on its own.
 *
 * Data: src/data/concepts-registry.js (term, short definition, related, classes, sources) and, when
 * the concept has one, its layered exposition from src/data/concept-expositions/ (loaded lazily by
 * slug through concept-expositions/index.js). Layout: editorial post (PostLayout).
 *
 * Order: prerequisites ("Helpful first"), level switcher, intro, the three levels ("Start here",
 * "Going deeper", "Precise version"), physics analogy, worked examples, why it matters, example,
 * pitfalls, classes, related concepts, concepts mentioned, sources and further reading.
 * Diagrams: an exposition's `diagrams` list ({ id, placement, caption, alt }) renders the registered
 * component (src/components/concept-diagrams/index.js) after the intro, after a level's paragraphs,
 * or in the physics analogy, according to placement.
 * Concepts without an exposition show the short definition, classes, related concepts and sources.
 */
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import PostLayout, { BlockMath } from '../components/editorial/PostLayout.jsx';
import ConceptTerm from '../components/ConceptTerm.jsx';
import { makeConceptRich } from '../components/conceptRich.jsx';
import { DiagramsAt } from '../components/concept-diagrams/ConceptDiagram.jsx';
import { useConceptIndex } from '../components/conceptRegistryClient.js';
import { CONCEPT_CLASSES, findConcept } from '../data/concepts-registry.js';
import { loadExposition, hasExposition, getLoadedExposition } from '../data/concept-expositions/index.js';
import '../styles/concepts.css';

export const LEVELS = [
  { level: 'beginner', id: 'start-here', label: 'Start here', audience: 'no background assumed' },
  { level: 'intermediate', id: 'going-deeper', label: 'Going deeper', audience: 'calculus and complex numbers' },
  { level: 'advanced', id: 'precise-version', label: 'Precise version', audience: 'research level' },
];
const LEVEL_BY = Object.fromEntries(LEVELS.map((l) => [l.level, l]));
const CLASS_BY = new Map(CONCEPT_CLASSES.map((k) => [k.slug, k]));

export function ConceptChips({ slugs, exclude }) {
  const list = [...new Set(slugs || [])].filter((s) => s && s !== exclude);
  if (!list.length) return null;
  return (
    <ul className="ct-chips">
      {list.map((s) => {
        const c = findConcept(s);
        return (
          <li key={s} className="ct-chip">
            {c ? <ConceptTerm slug={c.slug}>{c.term}</ConceptTerm> : <span>{s}</span>}
          </li>
        );
      })}
    </ul>
  );
}

export function LinkList({ items }) {
  const seen = new Set();
  const list = (items || []).filter((x) => {
    const k = `${x.label}|${x.route || x.url || x.path || ''}`;
    if (!x.label || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  if (!list.length) return null;
  return (
    <ul className="cx-links">
      {list.map((x, i) => (
        <li key={i}>
          {x.route ? <Link to={x.route}>{x.label}</Link>
            : x.url ? <a href={x.url} target="_blank" rel="noreferrer">{x.label} ↗</a>
              : <>{x.label} <span className="cx-path">{x.path}</span></>}
        </li>
      ))}
    </ul>
  );
}

/** Mapping rows: "math ↔ physics" splits into two cells, anything else spans the row. */
export function AnalogyTable({ mapping, rich }) {
  if (!mapping?.length) return null;
  const rows = mapping.map((m) => {
    const parts = String(m).split(' ↔ ');
    return parts.length === 2 ? { a: parts[0], b: parts[1] } : { full: m };
  });
  const anySplit = rows.some((r) => !r.full);
  return (
    <table className="cx-map">
      {anySplit && (
        <thead><tr><th scope="col">In the mathematics</th><th scope="col">In the physical system</th></tr></thead>
      )}
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.full ? <td colSpan={anySplit ? 2 : 1}>{rich(r.full)}</td> : <><td>{rich(r.a)}</td><td>{rich(r.b)}</td></>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function PhysicsAnalogy({ pa, rich, headingId = 'physics-analogy', figures = null }) {
  if (!pa) return null;
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="cx-h2">Physics analogy</h2>
      {pa.system && <p><strong>System: </strong>{rich(pa.system)}</p>}
      {figures}
      <AnalogyTable mapping={pa.mapping} rich={rich} />
      {pa.whereItBreaks && (
        <div className="cx-box cx-breaks">
          <span className="cx-k">Where the analogy breaks</span>
          <p>{rich(pa.whereItBreaks)}</p>
        </div>
      )}
    </section>
  );
}

function ExampleBody({ ex, rich }) {
  return (
    <>
      {ex.text && <p>{rich(ex.text)}</p>}
      {ex.steps?.length > 0 && <ol>{ex.steps.map((s, i) => <li key={i}>{rich(s)}</li>)}</ol>}
      {ex.result && <p className="cx-res">{rich(ex.result)}</p>}
      {ex.source && <p className="cx-path">Source: {ex.source}</p>}
    </>
  );
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const h = el.querySelector('h2');
  if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
}

function NotFound({ slug }) {
  return (
    <PostLayout meta={['Concept']} title="Concept not found" dek={`There is no concept with the name or slug “${slug}”.`}>
      <p>
        <Link to={`/concepts?q=${encodeURIComponent(String(slug).replace(/-/g, ' '))}`}>Search the concept index for “{slug}” →</Link>
      </p>
      <p><Link to="/concepts">Browse all concepts by class →</Link></p>
    </PostLayout>
  );
}

export default function ConceptDetailPage() {
  const { slug = '' } = useParams();
  const concept = findConcept(decodeURIComponent(slug));
  const idx = useConceptIndex();
  const [state, setState] = useState(() => {
    const pre = concept ? getLoadedExposition(concept.slug) : undefined;
    return pre ? { slug: concept.slug, status: 'ready', data: pre } : { slug: null, status: 'idle', data: null };
  });
  const [levelFilter, setLevelFilter] = useState('all');

  const wantsExposition = !!concept && (concept.needsExposition || hasExposition(concept.slug));

  useEffect(() => {
    if (!concept) return undefined;
    document.title = `${concept.term} (concept) | exploreriemann`;
    setLevelFilter('all');
    if (!wantsExposition) { setState({ slug: concept.slug, status: 'none', data: null }); return undefined; }
    const pre = getLoadedExposition(concept.slug);
    if (pre) { setState({ slug: concept.slug, status: 'ready', data: pre }); return undefined; }
    let alive = true;
    setState({ slug: concept.slug, status: 'loading', data: null });
    loadExposition(concept.slug)
      .then((data) => { if (alive) setState({ slug: concept.slug, status: data ? 'ready' : 'none', data }); })
      .catch(() => { if (alive) setState({ slug: concept.slug, status: 'error', data: null }); });
    return () => { alive = false; };
  }, [concept, wantsExposition]);

  if (!concept) return <NotFound slug={slug} />;
  if (concept.slug !== slug) return <Navigate to={`/concept/${concept.slug}`} replace />;

  const ex = state.slug === concept.slug && state.status === 'ready' ? state.data : null;
  const loading = wantsExposition && (state.slug !== concept.slug || state.status === 'loading' || state.status === 'idle');
  // One rich() per render: each concept is linked once per page, in reading order.
  const rich = makeConceptRich(idx, { exclude: [concept.slug] });
  const richDek = makeConceptRich(idx, { exclude: [concept.slug] }); // separate scope: the dek does not use up body links

  const classes = concept.classes.map((k) => CLASS_BY.get(k)).filter(Boolean);
  const levels = ex ? ex.levels.filter((l) => LEVEL_BY[l.level]) : [];
  const shownLevels = levelFilter === 'all' ? levels : levels.filter((l) => l.level === levelFilter);
  const sources = [
    ...(concept.legacyRoute ? [{ label: 'Interactive page for this topic', route: concept.legacyRoute }] : []),
    ...(ex ? ex.furtherReading : []),
    ...(ex ? ex.sources : []),
    ...concept.sources,
  ];
  const meta = ['Concept', ...classes.slice(0, 2).map((k) => k.name)];

  return (
    <PostLayout meta={meta} title={concept.term} dek={richDek(concept.short)}>
      {ex?.prerequisites?.length > 0 && (
        <div className="cx-prereq">
          <span className="cx-k">Helpful first:</span>
          <ConceptChips slugs={ex.prerequisites} exclude={concept.slug} />
        </div>
      )}

      {loading && <div className="cx-loading" role="status">Loading the explanation…</div>}
      {state.status === 'error' && (
        <div className="cx-box" role="status"><p>The full explanation could not be loaded. The short definition, related concepts and sources are below.</p></div>
      )}

      {ex && (
        <>
          {levels.length > 0 && (
            <nav className="cx-levelnav" aria-label="Explanation levels">
              <span className="cx-k">Levels</span>
              {levels.map((l) => (
                <button key={l.level} type="button" className="cx-jump" onClick={() => { setLevelFilter('all'); setTimeout(() => scrollToId(LEVEL_BY[l.level].id), 0); }}>
                  {LEVEL_BY[l.level].label}
                </button>
              ))}
              <span className="cx-k" style={{ marginLeft: 'auto' }}>Show</span>
              <span className="cx-seg" role="group" aria-label="Show levels">
                <button type="button" aria-pressed={levelFilter === 'all'} onClick={() => setLevelFilter('all')}>All</button>
                {levels.map((l) => (
                  <button key={l.level} type="button" aria-pressed={levelFilter === l.level} onClick={() => setLevelFilter(l.level)}>
                    {LEVEL_BY[l.level].label}
                  </button>
                ))}
              </span>
            </nav>
          )}

          {ex.intro && <p className="lead">{rich(ex.intro)}</p>}
          <DiagramsAt diagrams={ex.diagrams} placement="intro" />

          {shownLevels.map((l) => {
            const meta2 = LEVEL_BY[l.level];
            return (
              <section key={l.level} id={meta2.id} className="cx-level" aria-labelledby={`${meta2.id}-h`}>
                <div className="cx-level-tag">{meta2.label}<span className="cx-aud">· {meta2.audience}</span></div>
                <h2 id={`${meta2.id}-h`}>{l.heading || meta2.label}</h2>
                {l.paragraphs.map((p, i) => <p key={i}>{rich(p)}</p>)}
                <DiagramsAt diagrams={ex.diagrams} placement={l.level} />
                {l.math.map((m, i) => (
                  <div key={`m${i}`} className="cx-math">
                    <BlockMath tex={m.tex} />
                    {m.note && <p className="cx-note">{rich(m.note)}</p>}
                  </div>
                ))}
                {l.analogy && (
                  <div className="cx-box cx-analogy">
                    <span className="cx-k">Analogy</span>
                    <p>{rich(l.analogy)}</p>
                  </div>
                )}
                {l.example && (
                  <div className="cx-box">
                    <span className="cx-k">Example{l.example.title ? `: ${l.example.title}` : ''}</span>
                    <ExampleBody ex={l.example} rich={rich} />
                  </div>
                )}
                {l.details.length > 0 && (
                  <>
                    <h3 className="cx-h3">Details</h3>
                    <ul className="cx-details">{l.details.map((d, i) => <li key={i}>{rich(d)}</li>)}</ul>
                  </>
                )}
              </section>
            );
          })}

          <PhysicsAnalogy pa={ex.physicsAnalogy} rich={rich} figures={<DiagramsAt diagrams={ex.diagrams} placement="physics" />} />

          {ex.examples.length > 0 && (
            <section aria-labelledby="worked-examples">
              <h2 id="worked-examples" className="cx-h2">Worked examples</h2>
              <div className="cx-examples">
                {ex.examples.map((e, i) => (
                  <div key={i} className="cx-ex">
                    <h3>{e.title || `Example ${i + 1}`}{LEVEL_BY[e.level] && <span className="cx-lvlchip">{LEVEL_BY[e.level].label}</span>}</h3>
                    <ExampleBody ex={e} rich={rich} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {ex.whyItMatters && (
            <section aria-labelledby="why-it-matters">
              <h2 id="why-it-matters" className="cx-h2">Why it matters</h2>
              <p>{rich(ex.whyItMatters)}</p>
            </section>
          )}

          {ex.example && (
            <section aria-labelledby="example-one">
              <h2 id="example-one" className="cx-h2">Example{ex.example.title ? `: ${ex.example.title}` : ''}</h2>
              <ExampleBody ex={ex.example} rich={rich} />
            </section>
          )}

          {ex.pitfalls.length > 0 && (
            <section aria-labelledby="pitfalls">
              <h2 id="pitfalls" className="cx-h2">Common pitfalls</h2>
              <ul className="cx-pitfalls">{ex.pitfalls.map((p, i) => <li key={i}>{rich(p)}</li>)}</ul>
            </section>
          )}
        </>
      )}

      {!ex && !loading && (
        <section aria-labelledby="definition">
          <h2 id="definition" className="cx-h2">Definition</h2>
          <p>{rich(concept.short)}</p>
          <p style={{ color: 'var(--ink-faint)', fontSize: 15 }}>
            This concept has a short definition only. The related concepts and sources below give more context.
          </p>
        </section>
      )}

      {classes.length > 0 && (
        <section aria-labelledby="classes">
          <h2 id="classes" className="cx-h2">Part of</h2>
          <ul className="cx-links">
            {classes.map((k) => (
              <li key={k.slug}><Link to={`/concepts/class/${k.slug}`}>{k.name}</Link> <span style={{ color: 'var(--ink-soft)' }}>— {k.short}</span></li>
            ))}
          </ul>
        </section>
      )}

      {concept.related.length > 0 && (
        <section aria-labelledby="related">
          <h2 id="related" className="cx-h2">Related concepts</h2>
          <ConceptChips slugs={concept.related} exclude={concept.slug} />
        </section>
      )}

      {ex?.mentions?.length > 0 && (
        <section aria-labelledby="mentions">
          <h2 id="mentions" className="cx-h2">Concepts used on this page</h2>
          <ConceptChips slugs={ex.mentions} exclude={concept.slug} />
        </section>
      )}

      {sources.length > 0 && (
        <section aria-labelledby="sources">
          <h2 id="sources" className="cx-h2">Sources and further reading</h2>
          <LinkList items={sources} />
        </section>
      )}

      <p className="cx-status">
        Status: Λ ≤ 0.2 (Platt–Trudgian 2021) is the accepted peer-reviewed bound. Project values below 0.2
        are computer-assisted, unreviewed and unpublished, or conditional. The Riemann Hypothesis is open.{' '}
        <Link to="/concepts">All concepts →</Link>
      </p>
    </PostLayout>
  );
}
