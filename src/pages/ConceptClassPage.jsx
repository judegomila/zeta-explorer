/**
 * /concepts/class/:slug — a class of concepts (CONCEPT_CLASSES in src/data/concepts-registry.js).
 *
 * Shows the class exposition when one exists (intro, how the members relate, physics analogy,
 * reading order; loaded lazily from src/data/concept-expositions/), then a card for every member
 * linking to /concept/<slug>, and the related classes.
 */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostLayout from '../components/editorial/PostLayout.jsx';
import ConceptTerm from '../components/ConceptTerm.jsx';
import { makeConceptRich } from '../components/conceptRich.jsx';
import { useConceptIndex } from '../components/conceptRegistryClient.js';
import { CONCEPT_CLASSES, findConcept } from '../data/concepts-registry.js';
import { loadClassExposition, hasExposition, getLoadedClassExposition } from '../data/concept-expositions/index.js';
import { ConceptChips, PhysicsAnalogy } from './ConceptDetailPage.jsx';
import '../styles/concepts.css';

const CLASS_BY = new Map(CONCEPT_CLASSES.map((k) => [k.slug, k]));

export function ConceptCard({ concept }) {
  const exp = concept.needsExposition || hasExposition(concept.slug);
  return (
    <Link className="cx-card" to={`/concept/${concept.slug}`}>
      <h3>
        <span>{concept.term}</span>
        {exp && <span className="cx-badge" title="Has a full explanation at three levels">exposition</span>}
      </h3>
      <p>{concept.short}</p>
    </Link>
  );
}

export default function ConceptClassPage() {
  const { slug = '' } = useParams();
  const klass = CLASS_BY.get(slug) || null;
  const idx = useConceptIndex();
  const [state, setState] = useState(() => {
    const pre = klass ? getLoadedClassExposition(klass.slug) : undefined;
    return pre !== undefined ? { slug: klass.slug, status: pre ? 'ready' : 'none', data: pre } : { slug: null, status: 'idle', data: null };
  });

  useEffect(() => {
    if (!klass) return undefined;
    document.title = `${klass.name} (concept class) | exploreriemann`;
    const pre = getLoadedClassExposition(klass.slug);
    if (pre !== undefined) { setState({ slug: klass.slug, status: pre ? 'ready' : 'none', data: pre }); return undefined; }
    let alive = true;
    setState({ slug: klass.slug, status: 'loading', data: null });
    loadClassExposition(klass.slug)
      .then((data) => { if (alive) setState({ slug: klass.slug, status: data ? 'ready' : 'none', data }); })
      .catch(() => { if (alive) setState({ slug: klass.slug, status: 'error', data: null }); });
    return () => { alive = false; };
  }, [klass]);

  if (!klass) {
    return (
      <PostLayout meta={['Concept class']} title="Class not found" dek={`There is no concept class with the slug “${slug}”.`}>
        <p><Link to="/concepts">Browse all concept classes →</Link></p>
      </PostLayout>
    );
  }

  const ex = state.slug === klass.slug && state.status === 'ready' ? state.data : null;
  const loading = state.slug !== klass.slug || state.status === 'loading' || state.status === 'idle';
  const rich = makeConceptRich(idx);
  const members = klass.members.map((m) => findConcept(m)).filter(Boolean);
  const related = klass.relatedClasses.map((r) => CLASS_BY.get(r)).filter(Boolean);
  const reading = ex ? ex.readingOrder.map((s) => findConcept(s)).filter(Boolean) : [];

  return (
    <PostLayout meta={['Concept class', `${members.length} concepts`]} title={klass.name} dek={klass.short}>
      {loading && <div className="cx-loading" role="status">Loading the class overview…</div>}

      {ex && (
        <>
          {ex.intro && <p className="lead">{rich(ex.intro)}</p>}

          {ex.membersOverview.length > 0 && (
            <section aria-labelledby="how-related">
              <h2 id="how-related" className="cx-h2">How the members relate</h2>
              {ex.membersOverview.map((g, i) => (
                <div key={i} className="cx-group">
                  {g.group && <h3>{g.group}</h3>}
                  {g.relation && <p>{rich(g.relation)}</p>}
                  {g.members.length > 0 && <ConceptChips slugs={g.members} />}
                </div>
              ))}
            </section>
          )}

          <PhysicsAnalogy pa={ex.physicsAnalogy} rich={rich} />

          {reading.length > 0 && (
            <section aria-labelledby="reading-order">
              <h2 id="reading-order" className="cx-h2">Reading order</h2>
              <ol className="cx-reading">
                {reading.map((c) => (
                  <li key={c.slug}>
                    <ConceptTerm slug={c.slug}>{c.term}</ConceptTerm>
                    <span className="cx-short"> — {c.short}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </>
      )}

      <section aria-labelledby="members">
        <h2 id="members" className="cx-h2">All concepts in this class</h2>
        <div className="cx-cards">
          {members.map((c) => <ConceptCard key={c.slug} concept={c} />)}
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-classes">
          <h2 id="related-classes" className="cx-h2">Related classes</h2>
          <ul className="cx-links">
            {related.map((k) => (
              <li key={k.slug}><Link to={`/concepts/class/${k.slug}`}>{k.name}</Link> <span style={{ color: 'var(--ink-soft)' }}>— {k.short}</span></li>
            ))}
          </ul>
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
