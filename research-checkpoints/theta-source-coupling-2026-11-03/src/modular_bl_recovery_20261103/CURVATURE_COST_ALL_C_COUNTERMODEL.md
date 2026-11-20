# Curvature-remainder sufficient test may fail for every C

Status: independent MPFI replay and analytic audit PASS. This is a positive even auxiliary source, not the complete theta profile.

For a fixed selected q and D=∫λ(q')²>0, Q=∫λq², the proposed condition

 ∫(λ''−Cλ)_+ q² ≤ D,   C>0,

is exactly equivalent to

 ∫|λ''−Cλ|q² ≤ C Q.                                                  (1)

This follows from the selected orthogonality identity ∫λ''q²=2D. In particular, if λ has a negative region with N=∫λ_-q²>0, the positive-part cost divided by C tends to N as C→∞; arbitrarily increasing C cannot be justified as a general solution.

A strict positive-Q example where no C works is

 F(t)=e^(−t²)+e^(−10t²),       λ=2(F'²−FF''),       q₁(t)=t.       (2)

Its physical inverse Fourier profile is positive, even, analytic and rapidly decaying. At n=1 the old opposite-parity block is just the scalar D=∫λ, and the same-parity old space is empty. Exact Gaussian integration gives

 D=√π[2√2+160√11/121+4√5] <29,
 Q=√π[−2440√11+1331√5+6655√2]/13310 >0.                          (3)

Thus the actual n=1 selected paired form is positive. On [0.35,0.5], however, an owned 150-cell outward MPFI enclosure `cert_curvature_cost_counter_mpfi.py` verifies λ<0 and λ''>0 cellwise, and

 2∫_(0.35)^(0.5) t²λ''(t)dt >41.76.                                (4)

Both densities are even. Therefore, for every C>0, on the symmetric pair of these intervals (λ''−Cλ)_+≥λ'', and

 ∫_R (λ''−Cλ)_+ t² dt >41.76>29>D.                                 (5)

The condition fails for every C despite positive old prefix and positive next selected form. No numerical minimization over C is needed; (5) holds simultaneously for all C. The exact Gaussian integrals, interval implementation and (4) passed independent audit and MPFI replay.

This is not a counterexample to the selected theta lemma. It demonstrates that its source-specific positive-part estimate is strictly stronger than the target even with freedom to select C, and may discard essential signed cancellation. The physical mixture need not satisfy actual theta's strong curvature or Jacobi modular identity.
