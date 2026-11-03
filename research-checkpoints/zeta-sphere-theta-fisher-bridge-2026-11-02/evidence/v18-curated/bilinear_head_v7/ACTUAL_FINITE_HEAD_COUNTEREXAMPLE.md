# An actual modular-paired finite head with positive mean and negative heights

2 November 2026. Independent hierarchy-lane review PASS; see FINITE_HEAD_REVIEW_HIERARCHY.md. This is a counterexample for a finite product cutoff, NOT for the full theta kernel.

Fix 0<a<1/2, p=1/2+a, and take the exact product cutoff M=2. It retains the entire collective axis and precisely the positive pairs(1,1),(1,2),(2,1). Using the fixed-j asymptotic already proved in SIGNED_BILINEAR_AND_LOCALIZATION.md,

 Q_2(a,t)=axis+w_1+2w_2 cos(t log2),
 Q_2(a,t)/(c(t)L(t))
       =1+2^(1-p)cos(t log2)+o_a(1),                 (1)

where c=P_a(2t)g_p/(128a)>0 and L~log(t/(2pi))>0. The error in(1) tends uniformly to zero as t tends to infinity; it involves only the finitely many fixed products1,2 and the explicitly smaller axis/dual/low corrections.

Because p<1, 2^(1-p)>1. Therefore along the exact sequence

                    t_l=(2l+1)pi/log2,

the corrected, smooth, fully axis-closed finite head is strictly negative for every sufficiently large l. Along t_l=2l pi/log2 it is strictly positive for sufficiently large l. In particular

 liminf Q_2/(cL)=1-2^(1-p)<0,
 limsup Q_2/(cL)=1+2^(1-p)>0.

Yet the average of the normalized head over any complete phase period[ T,T+2pi/log2 ] tends to1 as T tends to infinity, by(1). This is an actual arithmetic-head example of positive averaged diagonal reserve coexisting with negative pointwise heights, not merely an unrelated trigonometric model.

The effect is not the algebraic endpoint cusp of an ordinary theta truncation. The exact modular pairing and entire axis closure are retained; the sign-changing head has the natural exponentially decaying spectral scale. Its omitted products are essential. In particular the missing(2,2) diagonal prevents the first reciprocal cross pair from forming a complete positive square.

## Exact scope

M=2 is fixed, so it does NOT satisfy the adaptive contour cutoff M+1>=t/(sqrt(2)pi) as t tends to infinity. The contour theorem is not contradicted. No sign of the full shear is inferred. The example forbids using positivity of averaged head statistics, or smooth modular completion by itself, as a pointwise finite-head sign theorem. An adaptive signed estimate must exploit the actual full retained arithmetic pattern and its remainder, rather than extrapolating from the positive N=1 head or from mean-square diagonals.
