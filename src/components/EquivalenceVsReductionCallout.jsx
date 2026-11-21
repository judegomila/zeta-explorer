import React from 'react';
import { Link } from 'react-router-dom';

/**
 * EquivalenceVsReductionCallout (imp-2966) — a prominent callout listing
 * the RH-equivalent statements that the collapse machinery touches, plus the
 * load-bearing warning that an EQUIVALENCE is not a REDUCTION.
 *
 * Pages that present the collapse chain (CollapseChainPage, RHEquivalentsPage)
 * can mount this to stop a reader from misreading the collapse as progress
 * toward RH: proving any RH-equivalent statement unconditionally just IS proving
 * RH, so reformulating one as another moves no difficulty. The wording reuses
 * the ConceptsPage "RH-Equivalent Statement" definition and stays in lockstep
 * with the StateOfProgramPage status.
 *
 * Props:
 *   compact  when true, render with tighter top/bottom margins for dense pages.
 */

// The catalog of statements each provably equivalent to RH (S iff RH). Listing
// them together makes the point visible: they are different faces of one crystal,
// not a ladder of decreasing difficulty.
const EQUIVALENTS = [
  { name: 'Beurling-Nyman', statement: 'the indicator of (0,1) lies in the L2 closure of dilated fractional parts' },
  { name: 'de Branges', statement: 'the structure function E_a is Hermite-Biehler' },
  { name: 'Connes-Weil', statement: 'Weil positivity of the explicit-formula quadratic form' },
  { name: "Li's criterion", statement: 'lambda_n >= 0 for all n >= 1' },
  { name: 'normalized-R / Conj-26.3', statement: 'the normalized kernel K_a is positive semidefinite' },
];

export default function EquivalenceVsReductionCallout({ compact = false } = {}) {
  return (
    <div
      style={{
        background: 'color-mix(in srgb, var(--series-5) 8%, transparent)',
        border: '1px solid color-mix(in srgb, var(--series-5) 45%, transparent)',
        borderLeft: '4px solid var(--series-5)',
        borderRadius: 8,
        padding: '14px 16px',
        margin: compact ? '12px 0' : '18px 0',
      }}
    >
      <p style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 'bold', color: 'var(--series-5)' }}>
        Equivalence is NOT a reduction
      </p>
      <p style={{ margin: '0 0 10px 0', fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary, #94a3b8)' }}>
        Each statement below is <strong>provably equivalent to RH</strong> (S iff RH). Proving
        ANY one of them unconditionally is proving the Riemann Hypothesis — so rewriting one as
        another, as the collapse chain does, is a <strong>reformulation, not a reduction</strong>:
        no difficulty is moved below RH. The historical ~5000× margin was a homogeneity artifact
        of the scale-miscalibrated bare operator, not evidence for the conjecture.
        Corrected 2026-11-21: the bare Volterra statement (norm of V_{'{'}a,Phi{'}'} ≤ 1 for every a &gt; 0) was
        listed here as an equivalent. It is not one: it is false for a ≥ 31.6214 and is not equivalent to
        K_a ≥ 0 in either direction. It has been removed from the list.
      </p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, lineHeight: 1.75, color: 'var(--text-secondary, #94a3b8)' }}>
        {EQUIVALENTS.map((e) => (
          <li key={e.name}>
            <strong style={{ color: 'var(--series-5)' }}>{e.name}</strong>: {e.statement}
          </li>
        ))}
      </ul>
      <p style={{ margin: '10px 0 0 0', fontSize: 12 }}>
        <Link to="/state-of-program" style={{ color: 'var(--series-5)' }}>
          Canonical status →
        </Link>
      </p>
    </div>
  );
}
