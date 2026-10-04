import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';

const COHORT = [
  {
    id: 'imp-33557',
    path: '/viz-imp33587-band-crossing-floor-climb',
    title: 'Band-Crossing Floor Climb',
    summary:
      'Peak-resolution wall stays flat (~200 nodes) at n in {495,510,596} while the arithmetic floor climbs and crosses the imp-33316 band between n=510 and n=596.',
  },
  {
    id: 'imp-33558',
    path: '/viz-imp33589-height-collapsing-envelope-ceiling',
    title: 'Height-Collapsing Envelope Ceiling',
    summary: 'Deep-tail arithmetic-jitter envelope ceiling collapses below the tau=7 reference height.',
  },
  {
    id: 'imp-33559',
    path: '/viz-imp33594-envelope-under-reference-libm',
    title: 'Reference-Libm Envelope Downward Shift',
    summary: 'Per-height reference-libm comparison shows a downward shift of the jitter envelope.',
  },
  {
    id: 'imp-33560',
    path: '/viz-imp33591-deep-tail-cross-solver-node-budget',
    title: 'Deep-Tail Cross-Solver Node Budget',
    summary: 'Cross-solver (graded-GL vs Clenshaw-Curtis) minimum node budget at deep-tail rungs.',
  },
];

export default function Imp33595DeepTailCohortIndexPage() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Deep-Tail Node-Budget & Envelope Cohort (imp-33595)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 780 }}>
        The imp-33557/imp-33558/imp-33559/imp-33560 measurements were shipped as four separate viz
        pages with no shared landing page. This index groups them so the deep-tail node-budget and
        envelope cohort is navigable from one place.
      </p>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {COHORT.map((entry) => (
          <Link
            key={entry.id}
            to={entry.path}
            style={{
              display: 'block',
              padding: '0.85rem 1rem',
              background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
              borderLeft: '3px solid var(--rule)',
              borderRadius: '0 4px 4px 0',
              textDecoration: 'none',
            }}
          >
            <div style={{ color: 'var(--ink)', fontWeight: 700, fontSize: '0.9rem' }}>
              {entry.title} <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>({entry.id})</span>
            </div>
            <div style={{ color: 'var(--ink-soft)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
              {entry.summary}
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> this is a navigation aid over
        already-published measurements. It changes no bound and patches no literal. RH-equivalent,
        NO QED.
      </div>
    </div>
  );
}
