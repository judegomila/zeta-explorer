# Local collision index and conditional global continuation

24 October 2026. This note proves a local lemma under explicit analytic and heat-equation hypotheses, and states a conditional route to RH. It does not prove the required global estimate or assert novelty.

## 1. Precise local statement

Let h(t,x) be real analytic in a neighborhood of (t0,x0), real valued for real arguments, and satisfy h_t = -h_xx. Suppose x -> h(t0,x) has exact finite multiplicity m >= 2 at x0. Give the domain the coordinate order (t,x), its usual positive orientation, and the target the order (h,h_x). Then (t0,x0) is an isolated zero of F=(h,h_x), and

    ind(F;(t0,x0)) = -floor(m/2).

No genericity, transversality, simplicity of nearby actual collisions, or absence of odd multiplicities is assumed. Index means the ordinary two-dimensional Brouwer local degree, equivalently the winding of h+i h_x on a sufficiently small positively oriented enclosing loop. Reversing the domain coordinate order, or replacing i h_x by -i h_x, reverses the sign. Using forward heat h_t=+h_xx reverses the sign as well.

## 2. Weighted expansion, with perturbation control

Translate (t0,x0) to (0,0). Put a=h_{x^m}(0,0)/m!, so a != 0. Repeated use of the PDE gives

    partial_t^k partial_x^j h(0,0) = (-1)^k partial_x^(j+2k) h(0,0).

Consequently every Taylor monomial of weighted degree 2k+j < m vanishes. The weighted homogeneous part of degree m is a P_m, where

    P_m(t,x) = m! sum_{k=0}^{floor(m/2)} (-t)^k x^(m-2k)/(k!(m-2k)!).

For r>0, on the fixed square K=[-1,1]^2 in coordinates (T,X), define

    F_r(T,X) = ( h(r^2 T,rX)/(a r^m),
                 h_x(r^2 T,rX)/(a r^(m-1)) ).

Convergent analytic Taylor series, differentiated for the second coordinate, give uniform convergence

    F_r -> F_m := (P_m,partial_X P_m)

on K as r decreases to zero. In fact the remainder is O(r) there. One explicit justification is to use an absolutely convergent Taylor series on a fixed polydisc: after substituting (r^2 T,rX), every surviving remainder monomial has weighted degree at least m+1, and the derivative remainder has degree at least m. A smaller fixed polydisc supplies a summable majorant. There is no formal-series-only step.

### The model has exactly one real zero

For T>0,

    P_m(T,X) = T^(m/2) He_phys,m(X/(2 sqrt(T))),

where He_phys,m is the physicists' Hermite polynomial. It has m distinct real roots, so P_m and its derivative have no common zero at T>0. This root fact can be obtained without an asymptotic assumption: Rodrigues' formula and repeated integration by parts make He_phys,m orthogonal to every polynomial of degree <m for the strictly positive weight exp(-y^2) on the real line. If it had fewer than m distinct sign-changing real zeros, the product of its sign-changing linear factors would have degree <m and its product with He_phys,m would have fixed nonzero sign except at finitely many points, contradicting orthogonality. Hence all m roots are real and simple. Rolle's theorem also gives m-1 distinct derivative roots, one in each interval between successive roots.

For T<0 all coefficients in the displayed formula for P_m are positive. If m is even, P_m is a polynomial in X^2 with positive constant term, so P_m>0. If m is odd, P_m=X times a polynomial in X^2 with positive coefficients and positive constant term; its X derivative is strictly positive everywhere. Thus neither parity permits a simultaneous zero. For T=0 the pair is (X^m,m X^(m-1)), which vanishes only at X=0.

Therefore F_m has only the zero (0,0), and

    c_m = min_{boundary K} ||F_m|| > 0.

For all sufficiently small r, ||F_r-F_m|| < c_m/2 on boundary K. Their straight-line homotopy has no boundary zero, so their degrees on the interior of K agree.

### This gives actual isolation, not just a sequence of safe contours

For any sufficiently small nonzero point (t,x), take r=max(sqrt(|t|),|x|). Then (t/r^2,x/r) belongs to boundary K. The preceding uniform estimate applies for every sufficiently small r, so F(t,x) cannot be zero. This proves an entire punctured neighborhood is zero free.

### Why the degree is the ordinary degree

The domain change (T,X)->(r^2 T,rX) has determinant r^3>0. The constant target change (u,v)->(u/(a r^m),v/(a r^(m-1))) has determinant 1/(a^2 r^(2m-1))>0, even when a<0. Thus both preserve ordinary Brouwer degree. The parabolic rectangle |t|<r^2, |x|<r is an ordinary open neighborhood; no exotic weighted degree is being substituted. Isolation permits replacing that rectangle by any sufficiently small enclosing disk using excision.

## 3. Compute the model degree by a regular target

Take a sufficiently small positive number delta and the target (delta,0), joined to (0,0) by a segment lying strictly inside the distance of F_m(boundary K) from zero. At any preimage of (delta,0), the PDE and P_x=0 give

    det D(P_m,P_mx) = P_t P_xx - P_x P_xt = -(P_xx)^2.

We now enumerate all preimages and verify P_xx != 0 at each; this is an exact root argument, not a numerical test.

For T>0 write X=sqrt(T)y and p(y)=P_m(1,y). A preimage must satisfy p'(y)=0 and T^(m/2)p(y)=delta. Since p has m distinct real roots, p' has exactly m-1 distinct real roots, each strictly between consecutive roots of p. Hence p'' != 0 at each critical point, and its critical value is nonzero. Each positive critical value p(y)>0 gives exactly one preimage, with T=(delta/p(y))^(2/m), X=sqrt(T)y. Negative critical values give none. All these preimages tend to the origin as delta tends to zero.

If m=2k+1 is odd, p is odd. Its 2k critical points occur in opposite pairs and the associated values have opposite signs. Thus exactly k values are positive. For T<0 there are no critical points, since P_x>0. At T=0 the only possible stationary point is X=0, with value zero rather than delta. Total: k regular preimages, all contributing -1.

If m=2k is even, the 2k roots are simple, and p has k negative minima and k-1 positive maxima between them. The signs follow by alternating the sign of a positive-leading even-degree polynomial across its ordered simple roots. Thus T>0 supplies k-1 preimages. For T<0, P_x is X times a polynomial in X^2 with positive coefficients and positive constant term, so the only critical point is X=0. There

    P_m(T,0) = (m!/k!) (-T)^k.

This gives exactly one negative T with value delta. Also P_xx(T,0)>0, since the X^2 coefficient is strictly positive (including m=2). Again T=0 gives none. Total: k regular preimages, all contributing -1.

For sufficiently small delta all listed preimages lie inside K and there are no others anywhere in the real (T,X) plane. The regular-value formula for degree proves

    deg(F_m,interior K,0) = -floor(m/2).

Together with Section 2, this proves the lemma fully.

## 4. Finite-region corollary and hypotheses that must not be omitted

Suppose h is analytic on a neighborhood of the closure of a bounded Jordan region Q, satisfies the PDE, has no identically zero spatial slice there, and (h,h_x) is nonzero on boundary Q. All collision multiplicities are finite; the local lemma makes every collision isolated. Compactness plus boundary nonvanishing implies there are only finitely many collisions inside Q. Degree additivity yields

    wind((h+i h_x)|boundary Q,0)
      = -sum_{collisions in Q} floor(m_collision/2).

Thus zero boundary winding is equivalent to absence of collisions in Q, given these hypotheses. Boundary nonvanishing alone is NOT equivalent to zero winding.

A nonzero analytic heat solution cannot have an infinite-multiplicity spatial zero at an interior point without vanishing identically near that point: the PDE identities make every mixed derivative vanish. For the genuine theta heat family, h(t,0)>0 independently excludes an identically zero spatial slice.

A varying positive triangular normalization also preserves winding if it is defined continuously on the entire boundary and deformable through invertible positive triangular matrices to the identity. For example, A>0 and omega>0 give

    (h,h_x) -> (h/A, (h/A)_x/omega)

by a lower triangular matrix with positive diagonal entries. A straight interpolation of its diagonal entries to 1 and its off-diagonal entry to 0 stays invertible. General point-dependent orientation-preserving matrices need not preserve winding without an extension or null-homotopy condition: GL+(2,R) itself has nontrivial fundamental group. Do not silently generalize the triangular statement to every positive-determinant boundary matrix.

## 5. Why this is not a global exclusion theorem

Take h(t,x)=x^2-2(t-t*) with 0<t*<1/2. It is analytic, satisfies h_t=-h_xx, has simple real roots at t=1/2, and has no zeros at large complex distance. Nevertheless it has a collision at (t*,0), local index -1, and nonreal roots for t<t*. The index calculation correctly detects this; it does not exclude it. If desired shift x to put the collision at any positive x. This countermodel is not the theta family, but demonstrates that the heat PDE, the common index sign, eventual real-rootedness, and a trivial tail do not by themselves force the needed zero degree.

In particular an assertion that every boundary approximation has zero winding because all collisions have negative index reverses the implication and is circular. The signed index becomes useful only after zero winding is obtained independently from a genuine-function estimate.

## 6. Precise conditional route to RH

Let H_t be the actual theta heat family, with H_0(z)=xi(1/2+iz/2)/8, real on the real axis, even in z, jointly analytic, and locally uniformly convergent to H_0 as t decreases to zero. Use the known all-real anchor at t=1/2. On each positive slab [epsilon,1/2], require independently established bounds confining every possible nonreal zero to a common compact set of the complex z-plane. The established positive-time large-real-part theorem together with a uniform strip bound can supply this confinement. Mere real-axis collision exclusion at large x is not a substitute for complex-zero confinement.

Choose epsilon_n decreasing to zero and X_n increasing to infinity so the rectangles

    Q_n=(epsilon_n,1/2) x (0,X_n)

cover every point with 0<t<1/2 and x>0. For each n construct a continuous boundary approximation P_n with

    |G-P_n| < |P_n| everywhere on boundary Q_n,
    wind(P_n,0)=0,
    G=(H(t,x),partial_x H(t,x)).

The strict inequality supplies a zero-free boundary homotopy, hence wind(G)=0. The finite-region corollary excludes interior collisions. The same inequality excludes collisions on all four sides. Evenness and H(t,0)>0 handle negative x and x=0; the upper-time boundary needs the certificate or a separately justified simplicity statement, not merely an all-real assertion. Cofinality, or a suitable independent real tail exclusion for each slab, supplies all finite positive x.

Fix epsilon>0. With no collisions on [epsilon,1/2], uniform compact confinement of nonreal zeros, and an all-real anchor with simple real zeros, all zeros remain real throughout this interval. One rigorous formulation uses an open-and-closed argument for the set of times whose zeros are all real. Closedness follows from local uniform convergence and Hurwitz: any off-axis zero in a limit slice would force nearby off-axis zeros. Openness follows from compact confinement, finitely many zeros in a slightly enlarged compact set at the reference time, disjoint small disks around those simple real zeros, and Rouche's theorem plus conjugation symmetry. Each such disk contains exactly one root at nearby times, which must be real. Uniform nonvanishing on the remaining compact part excludes other nonreal roots. This eliminates an unproved assertion about globally following infinitely many labelled zeros.

Repeat for arbitrarily small epsilon, then use local uniform convergence and Hurwitz again to show all zeros of H_0 are real. This establishes RH under the stated boundary certificate hypotheses. It does not require simplicity at t=0.

The unresolved theorem is the independent construction and verification of those zero-winding boundary certificates for EVERY n, with all approximation, derivative, integral-tail, series-tail, and rounding errors included. A finite collection, however large, cannot supply that quantifier. No single uniform positive margin is needed; certified margins may decrease with n. The difficult joint regime is small positive t and large x, where known positive-time cutoffs can deteriorate exponentially in 1/t.

## Sources and status

- Hermite/orthogonal-polynomial real-root fact: NIST DLMF, Section 18.2(vi), https://dlmf.nist.gov/18.2#vi . The note also gives the needed orthogonality proof directly.
- Positive-time theta-family estimates to check against their exact hypotheses: Polymath15, https://arxiv.org/html/1904.12438v2 . The local index proof above does not depend on this source.

Status: the finite-multiplicity local index formula is established here under the explicit analytic/PDE hypotheses, including degeneracies. The independent global boundary estimate needed to conclude RH remains unproved. No novelty claim is made.
