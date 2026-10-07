/**
 * Concept diagram registry: diagram id -> lazily loaded component.
 *
 * An exposition entry (src/data/concept-expositions/area-*.js) may carry
 *   diagrams: [{ id, placement: 'intro' | 'beginner' | 'intermediate' | 'advanced' | 'physics', caption, alt, title? }]
 * and ConceptDetailPage renders <ConceptDiagram> for each id at its placement. Components receive
 * { idBase, title, alt } and return a responsive inline SVG (plus optional text/data details).
 * Keep this file import-light: each diagram is its own chunk.
 */
import { lazy } from 'react';

export const CONCEPT_DIAGRAMS = Object.freeze({
  'weil-balance': lazy(() => import('./weil-balance.jsx')),
  'weil-probe-squares': lazy(() => import('./weil-probe-squares.jsx')),
  'weil-support-ladder': lazy(() => import('./weil-support-ladder.jsx')),
  'weil-physics': lazy(() => import('./weil-physics.jsx')),
});

export const DIAGRAM_PLACEMENTS = Object.freeze(['intro', 'beginner', 'intermediate', 'advanced', 'physics']);

export function hasConceptDiagram(id) {
  return Object.prototype.hasOwnProperty.call(CONCEPT_DIAGRAMS, id);
}
