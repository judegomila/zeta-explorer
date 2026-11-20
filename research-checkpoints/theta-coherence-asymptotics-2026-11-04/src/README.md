# Theta derivative-coherence asymptotic continuation

Date: 2026-11-04. The requested limit U_n/Δ_n→0 remains unproved. No rate or counterexample to that limit is established.

Two results are preserved:

1. **Actual-selected primitive-domain obstruction.** SELECTED_PRIMITIVE_DOMAIN_COLLAPSE.md proves that the imported primitive I[R]=F⁻²∫_(−∞)^t VR fails to belong to L²(F²) for every nonzero polynomial R. In particular it fails for every actual X-selected P_n, even though P_n has zero total V moment. The proof uses real Xi zero intervals, Dirichlet Poincaré, and an explicit published simple-critical-zero counting dependency. It does not assume RH or any signed-prefix positivity. This excludes one attempted literature transfer, not derivative coherence itself.

2. **A zero-safe, uniformly bounded resolvent reformulation.** PARAMETER_STABILITY_AND_TRACE.md keeps the actual polynomial forms, all Xi zeros, and only the finite old-prefix positivity assumption. For fixed δ∈(0,1), let m_n(1−δ) be the monic Schur value in Q+(1−δ)H and let E_n(δ)=m_n(1−δ)−(1−δ)B_n. Then

δU_n ≤ Δ_n−E_n(δ) ≤ δU_n/[1−δ(1−ρ_n)] ≤ δU_n/(1−δ).

The middle expression uses the original ρ=min Q/G_X on a nonempty old prefix; the invariant version uses λ_max(K). For Δ_n>0, proving E_n(δ)/Δ_n→1 is exactly equivalent to the desired coherence limit. Its resolvent norm is bounded by 1/(1−δ); the Moore–Penrose inverse used in the exact projection identity is not claimed to have a uniform norm bound. No division by Xi occurs.

The required new theorem is still an actual-theta relative asymptotic with error o(Δ_n), after subtracting the exact Y innovation. Neither finite scans, ordinary nth-root determinant asymptotics, nor a trace average supplies it. The alternate stronger diagonal-decay and trace-plus-regularity routes are explicitly conditional.

No new numerical scan was run in this continuation. No enlarged target positivity, new signed rung, RH result, or literature-novelty claim is made.
