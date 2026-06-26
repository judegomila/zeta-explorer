import React from 'react';
import { Link } from 'react-router-dom';

/**
 * EquivalenceVsReductionCallout (imp-2966) — a prominent honest callout listing
 * the RH-equivalent statements that the collapse machinery touches, plus the
 * load-bearing warning that an EQUIVALENCE is not a REDUCTION.
 *
 * Pages that present the collapse chain (CollapseChainPage, RHEquivalentsPage)
 * can mount this to stop a reader from misreading the collapse as progress
 * toward RH: proving any RH-equivalent statement unconditionally just IS proving
 * RH, so reformulating one as another moves no difficulty. The wording reuses
 * the ConceptsPage "RH-Equivalent Statement" definition and stays in lockstep
 * with the StateOfProgramPage honest status.
 *
 * Props:
 *   compact  when true, render with tighter top/bottom margins for dense pages.
 */

// The catalog of statements each provably equivalent to RH (S iff RH). Listing
// them together makes the point visible: they are different faces of one crystal,
// not a ladder of decreasing difficulty.
const EQUIVALENTS = [
  { name: 'Volterra norm', statement: 'norm of V_{a,Phi} <= 1 for every a > 0' },
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
        background: 'rgba(167,139,250,0.08)',
        border: '1px solid rgba(167,139,250,0.45)',
        borderLeft: '4px solid #a78bfa',
        borderRadius: 8,
        padding: '14px 16px',
        margin: compact ? '12px 0' : '18px 0',
      }}
    >
      <p style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 'bold', color: '#a78bfa' }}>
        Equivalence is NOT a reduction
      </p>
      <p style={{ margin: '0 0 10px 0', fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary, #94a3b8)' }}>
        Each statement below is <strong>provably equivalent to RH</strong> (S iff RH). Proving
        ANY one of them unconditionally is proving the Riemann Hypothesis — so rewriting one as
        another, as the collapse chain does, is a <strong>reformulation, not a reduction</strong>:
        no difficulty is moved below RH. The historical ~5000× margin was a homogeneity artifact
        of the scale-miscalibrated bare operator, not evidence for the conjecture.
      </p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, lineHeight: 1.75, color: 'var(--text-secondary, #94a3b8)' }}>
        {EQUIVALENTS.map((e) => (
          <li key={e.name}>
            <strong style={{ color: '#c4b5fd' }}>{e.name}</strong>: {e.statement}
          </li>
        ))}
      </ul>
      <p style={{ margin: '10px 0 0 0', fontSize: 12 }}>
        <Link to="/state-of-program" style={{ color: '#a78bfa' }}>
          Canonical honest status →
        </Link>
      </p>
    </div>
  );
}
