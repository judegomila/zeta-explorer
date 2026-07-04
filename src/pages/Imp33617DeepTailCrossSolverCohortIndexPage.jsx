import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';

const COHORT = [
  {
    id: 'imp-33577',
    path: '/viz-imp33613-band-crossing-cross-solver-node-budget',
    title: 'Band-Crossing Cross-Solver Node Budget',
    summary:
      'Independent Clenshaw-Curtis single grid clears the imp-33316 <64 ULP A_log band at n=596 where the graded-GL grade-4 ladder floors at ~65 ULP with no budget in range.',
  },
  {
    id: 'imp-33579',
    path: '/viz-imp33611-band-crossing-floor-bisection',
    title: 'Band-Crossing Floor Bisection',
    summary:
      'Dense every-integer bisection of n in [510,596] shows no single rung n* separates an all-in-band region from an all-out-of-band region -- the crossing is a jittery lattice property.',
  },
  {
    id: 'imp-33580',
    path: '/viz-imp33609-graded-mapped-cc-abscissa-artifact',
    title: 'Graded-Mapped Clenshaw-Curtis Flat-Budget Artifact',
    summary:
      'Composing the graded origin-concentrating map onto Chebyshev-Lobatto nodes flattens the CC min-node budget, confirming the climbing CC budget is a uniform-abscissa artifact, not intrinsic to the solver.',
  },
  {
    id: 'imp-33582',
    path: '/viz-imp33607-sigma-postpeak-decay',
    title: 'Sigma(N) Post-Peak Decay Past the PATH-1 Ceiling',
    summary:
      'Conditional share sigma(N) = E_coll/E decays past its interior maximum (N ~ 9.22e5, sigma_max ~ 0.9494) as the constant truncation floor outlives the vanishing GUE-conditional component.',
  },
];

export default function Imp33617DeepTailCrossSolverCohortIndexPage() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Deep-Tail Cross-Solver & Sigma-Decay Cohort (imp-33617)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 780 }}>
        The imp-33577/imp-33579/imp-33580/imp-33582 measurements were shipped as four separate viz
        pages with no shared landing page. This index groups them so the deep-tail cross-solver,
        bisection, mapped-CC, and sigma-decay cohort is navigable from one place, paralleling the
        imp-33595 index over the imp-33557/imp-33558/imp-33559/imp-33560 cohort.
      </p>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {COHORT.map((entry) => (
          <Link
            key={entry.id}
            to={entry.path}
            style={{
              display: 'block',
              padding: '0.85rem 1rem',
              background: 'rgba(148,163,184,0.04)',
              borderLeft: '3px solid #334155',
              borderRadius: '0 4px 4px 0',
              textDecoration: 'none',
            }}
          >
            <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.9rem' }}>
              {entry.title} <span style={{ color: '#64748b', fontWeight: 400 }}>({entry.id})</span>
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '0.25rem' }}>
              {entry.summary}
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> this is a navigation aid over
        already-published measurements. It changes no bound and patches no literal. RH-equivalent,
        NO QED. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
