# Actual-theta selected oscillator-defect correction at degree one

Status: independent MPFI replay, algebra and tail audit PASS. This concerns the isolated oscillator-defect correction, not the sign of the complete selected Schur form.

Use the exact endpoint decomposition X=X₀+E from SELECTED_DEFECT_TRIANGLE_NO_GO. For selected p₁(x)=x (no old same-parity regressors), define the signed correction

 R₁=2⟨X₀p₁,Ep₁⟩+||Ep₁||² = ||Xp₁||²−||X₀p₁||².                  (1)

The positive next-pivot expression is ||Xp₁||²−||Yp₁||². Therefore the exact sign-sensitive comparison is

 2S₁ = [||X₀p₁||²−||Yp₁||²] + R₁.                                (2)

For a general selected p_n the same identity holds with the actual old-inverse coefficients kept in all three features. A separate sufficient estimate would need a reference gap lower bound and a correlated lower bound for R_n that costs less than that gap. Taking the sum in (2) as a hypothesis is merely the next-pivot sign; no all-degree inequality is claimed here.

The owned `cert_n1_signed_defect_mpfi.py` evaluates the exact integrand in (1) using 50,000 outward MPFI cells on [0,2], first three theta orbits and ±10⁻¹¹ enclosures for omitted orbits and their first two derivatives. It gives

 −0.065706 < R₁|_[0,2] < −0.040121.                                (3)

The midpoint c enclosure and polynomial-derivative recurrence are the same as in the separately audited SELECTED_DEFECT_TRIANGLE_NO_GO. For n≥4 and h≤2 the omitted terms obey 44e·81Σ_(n≥4)n⁸e^(−3n²)<10⁻¹¹. For h≥2 complete theta decay bounds the absolute tail of X²−X₀² below 10⁻²⁰; here X=ψ+2hψ' and X₀=−ψ−2ψ''/c. The strict negative sign rules out the universal candidate R_n≥0 already at n=1 as a certified complete-theta result. It does not rule out positive total S₁ or the degree-dependent paired gap.

An independently replicated floating diagnostic at n=2 gives R₂/||X₀p₂||²≈+0.12555 with the actual old signed inverse, suggesting that the correction may take both signs. This n=2 sign is unvalidated numerical evidence, not a certified theorem.
