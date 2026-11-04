# A selected determinant slope criterion for the finite theta model

2026-11-04. Exact finite-dimensional identities and a conditional analytic certificate. This note proves no new sign or decay for the fully selected theta sequence. All arithmetic cross terms remain in the matrices.

## 1. Work with the full selected column

For a fixed degree n and cutoff M, let G>0 and J>=0 be the exact finite-model matrices of X_M and H_M in one common increasing polynomial basis. Use either the full space or the complete parity space. Let e be its last coordinate vector. If the last basis vector has leading coefficient ell, the monic selected minimum is

    A(0) = 1 / (|ell|^2 e* G^(-1) e).

The ratio in this note does not depend on ell. Define K=G^(-1/2) J G^(-1/2), kappa=||K||, and

    v = G^(-1/2)e / sqrt(e*G^(-1)e).

Then v*v=1 and the fully selected derivative/source ratio is exactly

    h = H_M[P_n^M]/A(0) = v*K v.

No coefficient truncation, diagonal arithmetic approximation, or replacement by a trial polynomial occurs. In particular a bound on this one selected expectation need not imply the much stronger matrix inequality J<=epsilon G.

For block matrices G=[[G_0,g],[g*,a]] and J=[[J_0,j],[j*,b]], put

    sigma = a-g*G_0^(-1)g,
    tau = b-2 Re(j*G_0^(-1)g)
              +g*G_0^(-1)J_0 G_0^(-1)g.

Then h=tau/sigma. The desired decay is tau=o(sigma), not a statement about b/a alone. G_0 is positive definite. No inverse of the potentially singular derivative matrix J_0 is used.

## 2. A scalar Stieltjes representation that retains selection

For s>=0, let A(s) be the monic minimum for X_M+sH_M. Direct constrained minimization gives

    a(s):=A(s)/A(0) = 1 / [v*(I+sK)^(-1)v]
                       = 1 / integral_[0,kappa] (1+s lambda)^(-1) dmu(lambda),

where mu is the probability spectral measure of K at v. Consequently

    a(0)=1,          a'(0)=h,
    1<=a(s)<=1+s h,
    h-s kappa^2 <= (a(s)-1)/s <= h       (s>0).                 (1)

For the last lower bound, write the secant as

    [integral lambda/(1+s lambda) dmu]
      /[integral 1/(1+s lambda) dmu].

Its denominator is at most 1, so it is at least the numerator, which is at least h-s integral lambda^2 dmu. The upper bound follows from Jensen's inequality for the convex function lambda -> (1+s lambda)^(-1). Thus (1) does not assume any signed-form positivity.

There is also a stronger multiplicative estimate. Write q(s)=(a(s)−1)/s. Since lambda/(1+s lambda)>=lambda/(1+s kappa), while the denominator in the displayed secant is 1/(1+s q(s)),

    q(s) <= h <= (1+s kappa)q(s)/(1+s q(s))
                <= (1+s kappa)q(s).                         (1a)

In particular, s_n kappa_n=O(1) and q_n(s_n)->0 already suffice for h_n->0. This uses J>=0, not Q>=0. It can be sharper than the additive curvature estimate in (1); both estimates are valid.

Equivalently, A(s), as the infimum over monic polynomials of affine functions of s, is increasing and concave. In particular an upper bound for a positive-s secant by itself is not an upper bound for the derivative at zero. Equation (1) supplies the missing curvature-error control using the independently available kappa.

## 3. An exact determinant target

Let D_d(s)=det(G+sJ), and let D_(d-1)(s) be the determinant of the complete old-prefix block. Set D_0(s)=1 when d=1. Then

    a(s) = D_d(s)D_(d-1)(0) / [D_d(0)D_(d-1)(s)],

and

    h = D_d'(0)/D_d(0) - D_(d-1)'(0)/D_(d-1)(0).              (2)

All coefficients of each D_d(s) are nonnegative, since
D_d(s)=det(G) det(I+sK) and K>=0. This nonnegativity does NOT bound the difference in (2) by 1, much less make it tend to zero. For example G=I_2, J=diag(0,2) has nonnegative determinant coefficients but selected h=2. This example is only an algebraic diagnostic, not a theta counterexample.

Equations (1)-(2) give a precise conditional sign certificate. If, for some s>0 and gamma>0,

    D_d(s)D_(d-1)(0) / [D_d(0)D_(d-1)(s)]
          <= 1+s(1-gamma),
    s kappa^2 <= gamma,

then h<=1 and Q_M[P_n^M]>=0. With strict inequality in either bound the selected sign is strictly positive. To prove h_n->0, it suffices to establish degree-dependent s_n>0 and eta_n->0 with

    a_n(s_n)<=1+s_n eta_n,          s_n kappa_n^2->0.          (3)

This is a genuine selected-column criterion, not an all-vector Laguerre positivity assumption. It is nevertheless a remaining arithmetic estimate, not a consequence of determinant coefficient positivity or source conditioning.

## 4. The scales allowed by the actual-theta reduction

The prior audited actual-source comparison gives kappa_n=O(N^2 L^(7/4)), N=n+2, L=log N, for H relative to X. Relative X/H errors delta_n=exp(-A N log N) imply for the finite model

    kappa_(n,M) <= (kappa_n+delta_n)/(1-delta_n),

so the same polynomial bound holds. Thus, for example,

    s_n = N^(-5) L^(-7/2)

makes s_n kappa_(n,M)^2=O(N^(-1)). A degree-uniform arithmetic bound a_n(s_n)=1+o(s_n) would therefore prove h_n->0. That bound has not been established here.

Using (1a), the larger scale

    s_n = N^(-2) L^(-7/4)

also suffices for this conditional conclusion: s_n kappa_(n,M)=O(1), so a_n(s_n)=1+o(s_n) would imply h_n->0. This remains an unproved arithmetic bound, not an estimate supplied by the source comparison.

For a fixed sufficiently large cutoff constant in M=ceil(K sqrt(N log N)), the previous approximation theorem controls A_M(s)/A(s) by 1+O(delta_n(1+s)) for s>=0 bounded, using only X+sH>=X and the separate relative errors for X and H. Explicitly, if |X_M−X|<=delta_n X and |H_M−H|<=delta_n X, then

    |(X_M+sH_M)−(X+sH)|<=delta_n(1+s)(X+sH).

Minimization on the same monic affine space preserves this relative bound whenever delta_n(1+s)<1. Dividing by the corresponding bound at s=0 controls a_M(s)/a(s) by 1+O(delta_n(1+s)). The absolute secant error is therefore

    O(delta_n(1+s)a(s)/s).

On either displayed polynomial scale, a(s_n)<=1+s_n kappa_n=O(1), so this is O(delta_n/s_n), which tends to zero superexponentially up to a polynomial factor. For arbitrary bounded s one must retain the a(s) factor unless a separate uniform bound is available. Reselecting at s does not create a gap because these are minima of relatively close positive forms.

This observation removes numerical-model accuracy as an obstacle to a determinant-slope argument. It does not prove the needed determinant-ratio bound, certify numerical evaluations, or give a relative estimate at an unknown Schur-defect scale.

## 5. What remains open

A viable new arithmetic proof could bound the selected determinant ratio in (3), or equivalently the complete-prefix inverse-column quantity tau/sigma. It must use the actual matrices, with every m,l cross term and the finite-model boundary corrections retained. Bounds on individual arithmetic pieces, determinant coefficient nonnegativity, or the already proved source floor do not supply (3).

No selected sign theorem, selected coherence limit, global Laguerre inequality, or RH conclusion is proved in this note.

## Independent audit

The leading-coefficient normalization, selected spectral measure, additive secant estimate, both degree scales above, and the approximation/reselection transfer have been checked independently. The absolute-value square in the leading coefficient covers a complex triangular basis as well as the usual real one. The audit also supplied (1a) and made the absolute secant transfer factor explicit. No determinant-ratio arithmetic estimate is established by this audit.
