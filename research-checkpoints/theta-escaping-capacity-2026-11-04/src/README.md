# Escaping-cell capacity and selected source escape

2026-11-04. The actual all-degree theta coherence/RH blocker remains open. No RH assumption, Q positivity, selected inverse-gap estimate, or numerical scan is used. Live 4CT and existing frozen payloads are unchanged.

## Results

1. **Independent Green-kernel audit passes.** The selected reproducing kernel is the within-cell weighted Dirichlet Green kernel divided by w(s)w(t), and it vanishes across distinct cells. Fixed-cell selected value and positive-excess traces are finite; the negative trace is infinite and must not be interchanged as a signed series.

2. **A nontrace escaping-cell target.** Let dν=(v')_+dt/w and B_I=sup ν([x,y])/[L(x)^(-1)+R(y)^(-1)]. The squared positive-block norm Λ_I obeys B_I≤Λ_I≤4B_I. The factor-four proof is elementary and independently checked. Global boundedness is equivalent to sup B_I<∞; block compactness is equivalent to B_I→0 on escaping cells. This is weaker than summability of all positive traces. It is not established for actual theta F.

3. **Conditional degree-uniform positive and negative bounds.** For any cell collection E, with b_E=sup_(I∈E)B_I finite, all polynomials satisfy e_E^+≤4b_E X_E, e_E^-≤(1+4b_E)X_E, and e_E^++e_E^-≤(1+8b_E)X_E. Negative control follows from H_E≥0 and needs no additional shape hypothesis. Compactness would give H/X≤1+o(1), not H/X→0.

4. **A new necessary condition for selected coherence.** For every fixed bounded cell, H_I≥(d_I−ε)X_I−C_(I,ε)∫_I wp², where d_I is determined by the endpoint multiplicities and is at least 1/9. The exact selected local trace makes the remainder vanish along the selected basis. Therefore H[p_n]→0 would force X_I[p_n]→0 for every fixed finite collection of cells. The entire selected source mass must escape, not merely its positive excess. Locally, negative excess asymptotically cancels at most 8/9 of the source mass unless the mass vanishes.

5. **A precise global analytic countermodel.** A sparse even order-zero entire multiplier adds near-real conjugate zero pairs inside remote zero cells without changing any real zero or multiplicity of the baseline actual F. The product still has order one and exponential derivative decay, but its positive capacity constants can grow without bound along escaping cells. Thus real-zero geometry, order, exponential decay, and the generic Green identities do not suffice. Exact theta arithmetic, sharp endpoint envelope, and the fixed-reference lower comparison are not preserved. A scaled-baseline variant retains the upper gamma majorant but still not those stronger inputs.

## Files

- `FIXED_CELL_COERCIVITY_AND_NEGATIVE_EXCESS.md`: full local inequality, selected source-escape necessity, and conditional degree-uniform bounds; independently audited.
- `SPARSE_ENTIRE_VALLEY_COUNTERMODEL.md`: single globally entire countermodel and exact preservation boundary.
- `CELL_POSITIVE_EXCESS_CAPACITY_CRITERION.md`: full independent capacity proof, optional median test, spectral formulation, and boundedness/compactness equivalences.

## Remaining analytic work

A successful proof must use actual theta-specific information to bound the escaping capacities or exploit selected-only cancellation that does not require operator compactness. Even positive compactness does not establish negative cancellation toward one. Complete degree-dependent source escape and the relative Schur-excess scale remain unproved.

These are AI-assisted analytic derivations with independent AI-assisted audits, not external peer review or machine formalization. No literature-novelty claim is made.
