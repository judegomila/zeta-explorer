# Actual-Xi capacity continuation and stronger structural obstructions

2026-11-04. The actual-theta escaping-capacity bound and selected negative cancellation remain open. This continuation supplies an exact theta-specific localization, a quantitative conditional test, and stronger audited countermodels. It does not prove RH or selected coherence. No new numerical scan or live 4CT edit was made.

## Established for the actual Xi transform

The canonical zero product gives

    v'(t)=−2Σ_real m_r/(t−r)²
          +4Σ_nonreal pairs m [δ²−(t−c)²]/[(t−c)²+δ²]².

Therefore positive curvature can occur only within |t−c|<δ around a hypothetical off-line pair c±iδ, with δ<1/2. Finitely many off-line zeros would make all sufficiently remote capacities exactly zero. This conditional observation shows why compact positive excess must not be identified with RH.

A quantitative local test is also proved. If an actual pair c±iδ has residual factor F(c+x)=(x²+δ²)g(x) on a zero-free window |x|≤h, with m≤|g|≤M, |(log|g|)''|≤D, δ≤h/4, and Dδ²≤1/4, then

    B_I ≥ (31/500)(m/M)²(h/δ)^5.

No such pair or sequence of windows is asserted to exist. The test identifies precisely what a positive-tail estimate would need to control.

## New countermodel results

1. The earlier sparse positive entire multiplier preserves the all-degree exp[±C log²n] source/reference norm comparison, uniformly in arbitrarily small valley parameters, while positive capacities diverge. It still preserves every actual real zero and multiplicity. Thus that norm-comparison scale is insufficient to control capacities.

2. A sharper zero-surgery model replaces only sparse copies of nearby actual real-zero pairs by near-real conjugate quartets. It preserves the sharp gamma upper majorant, the original all-degree lower exp[−C log²n] and upper C(n+1) estimates, the uniform Pollaczek competitor, exponential-scale monic asymptotics, quasi-polynomial conditioning, critical-strip containment, and coarse Riemann–von Mangoldt counting. Its escaping capacities can nevertheless diverge. It does not preserve every real zero; it moves exactly the listed sparse copies.

Both models are different functions from the actual theta transform. Exact theta arithmetic and positivity of the inverse Fourier kernel are not preserved or asserted. Neither construction is a counterexample to selected diagonal decay, selected H/X→0, or RH. Unbounded operator norms and behavior on the particular selected basis remain distinct issues.

## Files

- `ACTUAL_XI_LAGUERRE_SOURCE_AUDIT.md`: primary-source check, exact product localization, conditional finite-exception compactness, and explicit first-order-versus-full-Laguerre distinction. Published finite-range verification is identified as finite range only.
- `ACTUAL_THETA_PAIR_CAPACITY_TEST.md`: complete proof of the quantitative actual-pair conditional lower bound.
- `VALLEY_MODEL_RETAINS_SUBEXPONENTIAL_COMPARISON.md`: full preservation proof for the prior multiplier model.
- `SPARSE_MULTIPLIER_REFERENCE_COMPARISON_AUDIT.md`: independent detailed audit of that preservation result.
- `ZERO_SURGERY_PRESERVES_SHARP_REFERENCE_BOUNDS.md`: full stronger construction and exact preservation boundary.
- `ZERO_PAIR_REPLACEMENT_INDEPENDENT_AUDIT.md`: independent audit of the surgery construction and pair test.

Preservation-boundary correction: the earlier frozen multiplier note said that the fixed-reference lower comparison was not preserved. That wording was too strong; the present proof establishes that it is preserved. The sharp upper envelope was not established for that multiplier model. This continuation supersedes those earlier scope statements without altering their frozen payload.

The prior frozen capacity package remains unchanged at `../theta_escaping_capacity_20261104`. In particular its capacity equivalence and local 1/9 coercivity result still apply. The present package is a separate continuation, not a revision of those hashes.

## Remaining task

No unconditional bound on actual escaping B_I has been proved or located. No lower estimate forcing the selected negative contribution to approach 1+e_n^+ has been established. The known source/reference comparison and generic Green structure do not settle either issue. A successful argument must use additional actual-theta information or selected-only cancellation that bypasses uniform cell-operator control.

These are AI-assisted analytic derivations with independent AI-assisted audits, not external peer review or machine formalization. No literature-novelty claim is made.
