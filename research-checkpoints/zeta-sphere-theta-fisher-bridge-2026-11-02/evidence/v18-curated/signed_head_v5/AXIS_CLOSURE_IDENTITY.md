# Exact simplification of the collective Ewald axis closure

2 November 2026. New post-v3-snapshot derivation; independent hierarchy-lane review PASS; see REVIEW_HIERARCHY.md.

Use the axis closure A_a and its half-line primitive H_a from modular_epstein_v3/GROUPED_EWALD_CANDIDATE.md. The claimed identity is

    A_a(v)/a = (1/2)integral_|v|^infinity psi(u)sinh(u/2)du,  (1)

for every real v and 0<a<1/2, with the continuous endpoint limits. In particular this exact collective block is linear in a.

Equivalently, for real frequency k (with the removable value at k=0),

    hat A_a(k)/a = (1/2)Re[(1−ik)Lambda(ik)]
                = −Im Xi(k+i/2)/k.                        (2)

This is a pointwise positive spatial kernel, but no positive-definiteness claim follows. Formula (2) retains an explicit boundary phase rather than taking an absolute value.

## Derivation through a convergent Mellin half-plane

Let p=1/2+a and tau=k/2. For Im k>2p, the bilateral Fourier transform of the half-line-evaluation formula

H_a(v)=2integral_1^infinity cosh(a log x)
 [x^(−1/2)−e^v x^(−1)][theta(e^(2v)x)−1]dx

converges absolutely. Indeed H_a grows at most like e^(−2pv) at v→−infinity and decays super-exponentially at +infinity. Changing y=e^(2v)x and using the convergent theta Mellin integral gives

hat H_a(k)=−Lambda(−ik)[1/(p+i tau)+1/(1−p+i tau)]
           −Lambda(ik)[1/(p−i tau)+1/(1−p−i tau)].          (3)

The second Lambda term uses Lambda(1−ik)=Lambda(ik). In this initial half-plane integrations by parts have no boundary terms, so hat A_a=(1/128)partial_a[P_a(k)hat H_a(k)]. Both sides then continue to the real k-axis, where A_a is Schwartz.

Put d=p(1−p)=1/4−a² and
R=1/(p−i tau)+1/(1−p−i tau).
Since P_a(k)=16(tau²+p²)(tau²+(1−p)²), exact algebra gives

    P_a(k)R=16[d+tau²+i tau(1−2d+2tau²)],
    partial_a(P_a R)=−32a(1−2i tau).

For real k the other term of (3) is the complex conjugate. Consequently
hat A_a/a=(1/2)Re[(1−ik)Lambda(ik)], proving the first equality in (2).

Since xi(ik)=Xi(k+i/2)=(1/2)ik(ik−1)Lambda(ik), the second equality follows. Finally

−Im Xi(k+i/2)/k
 =integral_0^infinity psi(u)sinh(u/2)sin(ku)/k du
 =integral_0^infinity [integral_v^infinity psi(u)sinh(u/2)du]cos(kv)dv.

The full even Fourier transform of the right side of (1) is precisely this expression, proving (1). The inner integrand is odd and analytic at zero, so (1) is smooth and even; this is consistent with the exact axis closure, not an arbitrary cusp-producing reflection.

## An explicit boundary-error envelope

Functional equation and the exact gamma half-line modulus give

|Lambda(ik)|=|zeta(1+ik)|/sqrt(cosh(pi k/2)), k real, k≠0.

Thus

|hat A_a(k)/a|
 <=sqrt(1+k²)|zeta(1+ik)|/[2sqrt(cosh(pi k/2))].            (4)

This uses only the outer boundary line, not division by an unknown interior Xi. A standard elementary Euler-summation estimate supplies |zeta(1+ik)|<=log(|k|+1)+4 for |k|>=1 if a completely scalar majorant is desired. The axis term is therefore O(|k|log|k|e^(−pi|k|/4)), lower in polynomial order than the completed finite-power arithmetic parents at fixed p>1/2. No sign is inferred from this envelope.

## Scope

This identifies the exact phase-bearing axis contribution. It does not bound the complete omitted arithmetic tail relative to the true shear and does not prove positivity of the full grouped head. The following finite-Mellin decomposition must retain the remaining direct/dual phase correlations.
