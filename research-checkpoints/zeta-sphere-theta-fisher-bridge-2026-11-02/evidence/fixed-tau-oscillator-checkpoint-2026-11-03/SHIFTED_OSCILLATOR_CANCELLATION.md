# Centered oscillator forcing identity for the complete theta source

Status: independent analytic review PASS. Valid for every fixed finite a≥0, τ>0, and parity degree n≥2 with the known old signed Gram positive. At n=0 or 1 the lower forcing and mismatch are absent. No uniform estimate or target positivity is claimed.

Use F_b(t)=F(t+ib), λ_a=avg_{0≤b≤a}(|F'_b|²−Re(F''_b conjugate F_b)), and the positive Sobolev parent w_{τ,a}=avg_{0≤b≤a}(|F_b|²+τ|F'_b|²), with continuous a=0 limits. Let q_B be the monic parent-orthogonal degree-n residual, v its old same-parity basis, B=∫vvᵀw and e=∫v q_B λ_a. Denote H_{τ,b}=F''_b+τ⁻¹F_b.

The parent orthogonality ∫v q_B w=0 gives the exact identity

e=−∫v q_B avg_{0≤b≤a} Re(H_{τ,b} conjugate F_b) dt.        (1)

Indeed λ_a−w/τ=−avg Re[(F''_b+F_b/τ) conjugate F_b]; the complete |F'_b|² contribution cancels before any inequality or prime truncation. The joint Cauchy inequality gives

[λ_a−w/τ]²/w ≤ avg |H_{τ,b}|².                           (2)

At w=0 use zero for the ratio. Bessel projection of ((λ_a−w/τ)/w)q_B onto the old space yields

eᵀB⁻¹e ≤ ∫q_B²[λ_a−w/τ]²/w dt
             ≤ ∫q_B² avg |F''_b+τ⁻¹F_b|²dt.               (3)

The first inequality preserves more correlation and is at least as strong as the displayed second upper bound. Both use the complete theta source and its shifted derivatives, are finite for every fixed finite a, and require no new signed pivot or negative-support hypothesis. They control only the parent-dual size of the forcing; E=eᵀA⁻¹BA⁻¹e still requires a directional inverse estimate.

At a=0 the centered numerator is −F(F''+F/τ), which vanishes at every real zero of F. This cancellation is compatible with the infinite-band obstruction: it does not say the full multiplier is constant or that old forcing vanishes. For general a it retains the full average over b; replacing the average by its endpoint is unjustified.

For each fixed τ the right side is a complete-theta oscillator-defect energy, including the signed cross term 2τ⁻¹ Re(F''_b conjugate F_b). One may vary τ, but q_B and B depend on τ as well, so optimizing the displayed integrand while freezing q_B is not a valid global optimization. No uniform-in-degree estimate comparing this energy to ∫q_B²w, and no hard-edge projection decay, is proved. The centered finite-prime covariance in SHIFTED_FORCING_HARD_EDGE remains a separate paid term and is not discarded by (1)–(3).
