# Gaussian obstruction to uniform modular strong payment

Status: independent analytic audit PASS. This auxiliary model has every bridge pivot positive; it does not assert a counterexample for the actual theta profile or the full modular conservation law.

Take ψ(h)=exp(−c h²/2), c>0. The bridge spectral density is a positive Gaussian for every a>0, so all actual pivots are positive. The monic Gaussian recurrence gives

 s_(n+1)/s_n = c(n+1)/2.                                             (1)

Use the exact reflection completion of MODULAR_REFLECTION: κ_n=4an+||r_perp||²/(4a)≥4an, and μ_n^−=∫₀∞hY_n(−h)²dh, with Y_n normalized by the actual current pivot. The strong payment from PREFIX_DUAL_PAYMENT is s_(n+1)/s_n≥κ_n μ_n^−. We show it fails for arbitrarily high n at sufficiently small positive a.

Set F_n=T_n(D)ψ at a=0 and σ_n=lim_(a↓0)s_n/a. The Gaussian spectral normalization and Parseval yield

 σ_n=(1/c)∫_R F_n² dh.                                               (2)

Let E_n denote expectation under normalized F_n²dh. Even/odd parity gives, for every fixed n,

 lim_(a↓0) a μ_n^− = (c/2) E_n|h|.                                  (3)

These are the usual nth harmonic-oscillator probability densities, with

 E_n h²=(n+1/2)/c,
 E_n h⁴=3(2n²+2n+1)/(4c²) ≤ 3(E_n h²)².                           (4)

The elementary Paley–Zygmund inequality applied to h² at half its mean implies P_n(h²≥E_n h²/2)≥1/12, and hence

 E_n|h|≥(1/12)√((n+1/2)/(2c)).                                     (5)

Retaining rather than discarding the nonnegative r_perp cost,

 liminf_(a↓0) κ_n μ_n^− ≥ 2cn E_n|h|
                        ≥ (√c n/(6√2))√(n+1/2).                      (6)

The right side grows like n^(3/2), strictly faster than (1). Consequently, for every c>0 and all sufficiently large fixed n, there is an a_n>0 such that (1) is strictly less than κ_n μ_n^− for every 0<a<a_n. For example c=20 (>17) and n=400 already meet the sufficient exact comparison n²(n+1/2)>18c(n+1)²: 64,080,000>57,888,360.

This falsifies the strong payment as a generic all-degree consequence of positive pivots, exact modular reflection, and strong log-concavity with curvature above 17. It is not a negative Gaussian pivot; all are positive. It does not disprove the true theta strong payment or any exact correlated conservation-law estimate. It specifically shows that an all-degree proof of the stronger comparison, if valid for theta, must use source-specific structure beyond those generic features.
