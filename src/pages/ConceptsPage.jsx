/**
 * /concepts — index of the concept registry (src/data/concepts-registry.js), grouped by class.
 *
 * Each class heading links to /concepts/class/<slug>; each card links to /concept/<slug> and
 * carries an "exposition" badge when the concept has the three-level explanation. Search matches
 * name, aliases and short definition; ?q= pre-fills the search (used by the concept not-found page).
 * The earlier glossary list on this page was merged into the registry (see its header).
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { CONCEPTS_REGISTRY, CONCEPT_CLASSES } from '../data/concepts-registry.js';
import { ConceptCard } from './ConceptClassPage.jsx';
import '../styles/concepts.css';

const BY_SLUG = new Map(CONCEPTS_REGISTRY.map((c) => [c.slug, c]));
const norm = (s) => String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
const HAYSTACK = new Map(CONCEPTS_REGISTRY.map((c) => [c.slug, norm([c.term, ...c.aliases, c.short].join(' \u0001 '))]));
const EXPOSITION_COUNT = CONCEPTS_REGISTRY.filter((c) => c.needsExposition).length;

export default function ConceptsPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(() => params.get('q') || '');
  const [klass, setKlass] = useState(() => params.get('class') || 'all');

  // Keep the URL in step so a filtered view can be linked.
  const current = params.toString();
  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set('q', query.trim());
    if (klass !== 'all') next.set('class', klass);
    if (next.toString() !== current) setParams(next, { replace: true });
  }, [query, klass]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = norm(query.trim());
  const matches = (c) => !q || q.split(/\s+/).every((w) => HAYSTACK.get(c.slug).includes(w));

  const groups = useMemo(() => CONCEPT_CLASSES
    .filter((k) => klass === 'all' || k.slug === klass)
    .map((k) => ({ klass: k, members: k.members.map((m) => BY_SLUG.get(m)).filter((c) => c && matches(c)) }))
    .filter((g) => g.members.length > 0), [q, klass]); // eslint-disable-line react-hooks/exhaustive-deps

  const shown = new Set(groups.flatMap((g) => g.members.map((c) => c.slug))).size;

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px clamp(16px, 3.2vw, 34px) 70px' }}>
        <div className="ed-lbl">reference</div>
        <h1 className="ed-h1" style={{ margin: '6px 0 10px' }}>Concepts</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 16, lineHeight: 1.55, maxWidth: 760 }}>
          The mathematical and project concepts used across this site, {CONCEPTS_REGISTRY.length} in all, grouped
          into {CONCEPT_CLASSES.length} classes. Each concept has its own page that can be read without
          prior knowledge; {EXPOSITION_COUNT} of them (marked “exposition”) are explained at three levels, from
          “Start here” to “Precise version”, with a physics analogy and worked examples. On pages that link
          concepts, a term with a dotted underline shows its short definition on hover, focus or tap.
        </p>

        <div className="cx-idx-controls" role="search">
          <label htmlFor="cx-search" className="ed-lbl">Search</label>
          <input
            id="cx-search"
            type="search"
            placeholder="Name, alias or definition"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label htmlFor="cx-class" className="ed-lbl">Class</label>
          <select id="cx-class" value={klass} onChange={(e) => setKlass(e.target.value)}>
            <option value="all">All classes ({CONCEPT_CLASSES.length})</option>
            {CONCEPT_CLASSES.map((k) => (
              <option key={k.slug} value={k.slug}>{k.name} ({k.members.length})</option>
            ))}
          </select>
          <span className="cx-idx-count" role="status" aria-live="polite">
            {shown} of {CONCEPTS_REGISTRY.length} concepts
          </span>
        </div>

        {groups.length === 0 && (
          <p style={{ color: 'var(--ink-soft)', marginTop: 24 }}>
            No concept matches “{query}”.{' '}
            <button type="button" className="cx-jump" onClick={() => { setQuery(''); setKlass('all'); }}>Clear the search</button>
            {' '}or try the <Link to="/wiki">full glossary</Link>.
          </p>
        )}

        {groups.map(({ klass: k, members }) => (
          <section key={k.slug} className="cx-class" aria-labelledby={`cls-${k.slug}`}>
            <div className="cx-class-head">
              <div>
                <h2 id={`cls-${k.slug}`}><Link to={`/concepts/class/${k.slug}`}>{k.name}</Link></h2>
                <p>{k.short}</p>
              </div>
              <Link className="cx-more" to={`/concepts/class/${k.slug}`}>
                Class overview ({k.members.length}) →
              </Link>
            </div>
            <div className="cx-cards">
              {members.map((c) => <ConceptCard key={c.slug} concept={c} />)}
            </div>
          </section>
        ))}

        <section className="cx-class" aria-labelledby="cx-films">
          <h2 id="cx-films" style={{ fontSize: 22, margin: '0 0 6px' }}>Films</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, maxWidth: 760 }}>
            The foundations are also available as flash-card films; the full series is on the{' '}
            <Link to="/animations">animations page</Link>.
          </p>
          <AnimationEmbed id="concepts-foundations" />
        </section>

        <p style={{ marginTop: 30, fontSize: 13.5, color: 'var(--ink-faint)' }}>
          Status: project values below 0.2
          are computer-assisted and not refereed, or conditional. The Riemann Hypothesis is open.
          Engine notes (imp-NNNN entries) are in the <Link to="/wiki">glossary</Link>, not here.
        </p>
        <p style={{ marginTop: 14 }}>
          <Link to="/" className="ed-mono" style={{ fontSize: 12 }}>← home</Link>
        </p>
      </div>
    </div>
  );
}
