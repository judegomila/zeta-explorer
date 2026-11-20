# Conditional asymptotic obstruction to the verified-band absolute tail test

Status: independent analytic audit PASS. This concerns the specific sufficient majorant in THETA_VERIFIED_BAND_WINDOW_PAYMENT, not the signed theta tail or actual pivot.

For even n, suppose the actual old two-parity prefix is positive and let R_n be the largest absolute root of its monic selected polynomial q_n; let q₀=|q_n(0)|. Since all roots are real, |q₀|≤R_n^n. The absolute tail used in the criterion has the exact form

 T_n=2Kθ∫_H∞(t+R_n)^(2n)e^(−bt)dt,    b=π/8,

with H=2.9×10¹² and fixed Kθ>0. Let M=∫_R|Λ(t)|dt<∞. The most optimistic positive-window lower bound of the employed form is bounded by

 [q₀²/4] H₀(s) ≤ [M/4] R_n^(2n),                                  (1)

uniformly in the window s≥0.

Assume, along an unbounded sequence of even n with positive old prefixes,

 limsup R_n/n < 2/b=16/π.                                          (2)

Choose L<2/b with R_n≤Ln eventually on that sequence. Then

 T_n/R_n^(2n) ≥2Kθ∫_H∞(1+t/(Ln))^(2n)e^(−bt)dt →∞.                (3)

The divergence follows by Fatou's lemma: the pointwise limit is exp[(2/L−b)t], whose integral over [H,∞) is infinite. Comparing (1) and (3), the particular sufficient inequality in THETA_VERIFIED_BAND_WINDOW_PAYMENT must fail for all sufficiently large n in the sequence, even if its crude source lower bound is replaced by the exact H₀(s). This is failure of an upper-bound method, not negativity of the true tail or selected pivot.

The same conclusion holds if one keeps the window-removal factor 1−e^(−st²) in the absolute tail. The cone-entry constraint has s≥n²/[2d_n² log(3/2)] and d_n≤R_n≤Ln, so s≥[2L²log(3/2)]⁻¹. Thus on t≥H the factor is bounded below by one fixed positive constant.

No bound of the form (2) is proved here for the actual theta Jacobi roots, and positive old prefixes alone do not provide it. In particular this result does not establish an actual-theta all-degree obstruction. It identifies a precise asymptotic failure regime for this specific exponential-envelope/absolute-polynomial tail strategy; signed arithmetic cancellation or a different source-specific estimate remains open.
