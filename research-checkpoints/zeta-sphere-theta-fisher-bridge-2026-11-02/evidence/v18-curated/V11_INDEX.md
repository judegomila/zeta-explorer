# Sphere campaign v11 — certified core inertia and correlated arithmetic cancellation

All 335 v10 payload files remain byte-identical. Its manifests are retained under provenance/v10. Baseline Library file: libfile_16b3f7e7f088819184217b1cce99d91c.

## Index erratum

V10_INDEX.md accidentally reversed one ratio label. The correct limit is **full/reference**, C_hat_a(2t)/D_hat_a(2t) -> 2|c|², not reference/full. The source theorem and its audit were already correct. See v10_errata/RATIO_ORIENTATION.md. Frozen v10 is unchanged.

## New independently reviewed results

- **Three negative integrated-core directions:** core_inertia_v2/PROOF.md and its independently replayed complete-theta certificate prove negative index at least three in the odd degree-19 core matrix, normalized a=0, spatial interval [0,1/16]. Fixed rational witnesses, theta derivatives through 58, and an explicit complex Cauchy quadrature remainder are included. This is not a negative direction for the full integrated kernel.
- **A quantified necessary tail reserve:** TAIL_RESERVE_REQUIREMENT.md proves that rank-two binary covariance leaves a witness direction requiring actual tail Schur reserve at least 4e-6 in the specified fixed witness coordinates. The margin is verified from the actual Gram by diagonal dominance, not inferred from LDL pivots. The actual tail may pay it; no failure of full positivity is claimed. Continuum/multi-region covariance is not constrained to rank two.
- **Cutoff compatibility obstruction:** arithmetic_dressing_v1/CUTOFF_COMPATIBILITY_OBSTRUCTION.md shows that the proved absolute derivative sign bound and existing beyond-turning product-tail envelope occupy incompatible cutoff regimes. This rules out combining those two particular sufficient estimates, not a different correlated proof.
- **Exact phase-aware curvature cost:** PHASE_AWARE_CURVATURE_COST.md retains logarithmic derivative phases and provides a conditional sufficient criterion. It alone does not prove all-height cancellation.
- **Actual density-one cancellation on the right:** RIGHT_HALF_MEAN_SQUARE_REPAIR.md proves uniform-in-shift convexity for the finite Euler-box reference on sigma in [sigma0,1], fixed sigma0>1/2, outside relative height measure O(1/log T), even for prime support Y<=cT and arbitrary fixed finite prime-power cutoffs. Higher prime powers and finite-power corrections are bounded explicitly.
- **Shrinking right-hand gap:** the same proof allows sigma0(T)=1/2+(log T)^(-kappa), fixed 0<kappa<1/5, with exceptional fraction O((log T)^(5kappa-1)). It gives no sign on the critical line, in the shrinking excluded gap, or at exceptional heights.

Audits and independent replay evidence are in core_inertia_audit/ and arithmetic_dressing_audit/. No actual tail-payment certificate, ongoing exploratory inertia, all-height cross-line sign, compatible modular remainder, or RH proof is included. The Euler-box versus product-cutoff remainder remains unpaid.
