/**
 * <ConceptDiagram d={{ id, caption, alt, title }} /> — one figure on a concept page: the registered
 * diagram (lazy), a visible caption, and the accessible title/description wired into the SVG.
 * Unknown ids render nothing; a failed chunk load shows a short notice instead of breaking the page.
 */
import React, { Suspense } from 'react';
import ErrorBoundary from '../ErrorBoundary.jsx';
import { CONCEPT_DIAGRAMS } from './index.js';

export default function ConceptDiagram({ d }) {
  const Comp = d && CONCEPT_DIAGRAMS[d.id];
  if (!Comp) return null;
  const idBase = `cd-${d.id}`;
  const cap = String(d.caption || '');
  const cut = cap.indexOf('. ');
  const title = d.title || (cap ? (cut > 0 ? cap.slice(0, cut + 1) : cap) : d.id);
  return (
    <figure className="cd-fig" id={idBase}>
      <ErrorBoundary title="Diagram unavailable" message="This diagram could not be loaded. The text around it covers the same content.">
        <Suspense fallback={<div className="cd-loading" role="status">Loading diagram…</div>}>
          <Comp idBase={idBase} title={title} alt={d.alt || ''} />
        </Suspense>
      </ErrorBoundary>
      {d.caption && <figcaption className="cd-cap">{d.caption}</figcaption>}
    </figure>
  );
}

/** Figures for one placement, in the order listed in the exposition. */
export function DiagramsAt({ diagrams, placement }) {
  const list = (diagrams || []).filter((d) => d && d.placement === placement);
  if (!list.length) return null;
  return list.map((d) => <ConceptDiagram key={d.id} d={d} />);
}
