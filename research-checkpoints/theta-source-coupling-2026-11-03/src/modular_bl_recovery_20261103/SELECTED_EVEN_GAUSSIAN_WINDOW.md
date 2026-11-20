# Explicit Gaussian window for each selected even residual

Status: independent analytic audit PASS. This is a degree-dependent *windowed* theorem under positive old prefixes, not an unwindowed next-pivot theorem.

Let λ be the complete theta paired density and let q_(2m) be its actual monic selected even residual of degree 2m≥2, constructed from the positive signed old prefixes through degree 2m−1. These assumptions give a real symmetric finite Jacobi matrix with strictly positive off-diagonals, and q_(2m) is its characteristic polynomial. Hence all roots are simple, real, and occur in nonzero pairs ±r_j. Define

 a=min_j r_j>0,    g(x)=(-1)^m q_(2m)(ix)=∏_(j=1)^m(x²+r_j²)>0.

Both q and a use only the actual old recurrence/pivot data, with all their conditioning; no next pivot is assumed.

For s>0 consider the inverse Fourier transform of (-1)^m q_(2m)(t)e^(−st²/2). Up to a positive constant it is

 f_s(u)=e^(−u²/(2s)) P_s(u),
 P_s(sx)=exp[−∂_x²/(2s)] g(x),                                     (1)

where the exponential terminates on the polynomial. Factoring g as ∏(x−ir_j)(x+ir_j) gives, for real x,

 |g^(2k)(x)|/g(x) ≤ (2m)!/[(2m−2k)! a^(2k)].                       (2)

It follows that

 |P_s(sx)−g(x)|/g(x)
 ≤ exp[(2m)²/(2s a²)]−1.                                           (3)

Consequently the explicit old-prefix window

 s > (2m)²/[2a² log 2]                                              (4)

ensures P_s(u)>0 everywhere. The resulting selected q belongs, up to a harmless sign, to the positive Gaussian–Hermite cone. Since the complete theta kernel satisfies λ=8 R̂ with R>0,

 ∫_R λ(t) q_(2m)(t)² e^(−st²)dt >0                                (5)

for every s satisfying (4). This is a genuine result for the actual selected even residual at each degree and does not assume its next pivot.

The sign of λ is not assumed. The window is degree- and actual-prefix-dependent; a may be small, and (4) can force large s. In particular this does not justify taking s↓0, does not pay the unwindowed next pivot, and does not extend to odd residuals (which necessarily vanish at zero and have an odd inverse transform). No all-degree unwindowed positivity or RH claim follows.

## A concrete first even extension

The independently certified actual-theta endpoint ratio β=σ₁/σ₀ exceeds 11.38, and q₂(t)=t²−β. The inverse Gaussian polynomial for −q₂ is β−1/s+u²/s², so the exact cone-entry condition is s≥1/β. In particular s=9/100 works because 11.38>100/9. This certifies the selected quadratic *windowed* form at s=0.09 without assuming σ₂>0. For a Gaussian source β=c/2, the same condition is s≥2/c. This specialization passed independent audit. The bound s≥2/c is the nonnegative-inverse-cone threshold, not a Gaussian form-positivity threshold: Gaussian forms are positive for all s≥0.
