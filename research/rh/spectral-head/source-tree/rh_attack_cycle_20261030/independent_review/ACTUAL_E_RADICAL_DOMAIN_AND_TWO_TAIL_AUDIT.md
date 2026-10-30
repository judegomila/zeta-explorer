# Actual E-image radical domain and the complete two-tail bridge — PASS

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

Independent analytic review, 30 October 2026. This accepts the frozen producer's declared finite-regularity class and exact identities. It is not a new global ordinary-L² closure, a sign estimate, or a claim that the classical E-radical observation is new.

## Paired-form domain and source regularity

For 0<s<1/2 and 1/2<a_w<3/2, X=H^s intersect L²(exp(2a_w|x|)dx) is sufficient. The correlation bound exp(-a_w|r|)||f||_w||h||_w follows from |x|+|x+r|>=|r|. It makes both the continuum integral and sum Lambda(n)n^(-a_w-1/2) absolutely convergent. The gamma pairing is continuous in H^s. Compact smooth truncation and mollification give density in both norms. These facts define a continuous sesquilinear pairing on X, not closability or semiboundedness in its weaker unweighted L² norm.

The repaired sharp source assumptions are sufficient: v vanishes at the support endpoints and origin, is even and C² near zero, has zero integral, and has a zero-extended BV first derivative. Thus v'' is a finite measure and its additive Fourier transform H is O(t^-2). The full Poisson formula is absolutely convergent; the origin and mean terms vanish exactly. It gives e_v(log u)=u^-1/2 sum H(n/u)=O(u^3/2). The weak derivative instead uses the compact BV function w=v/2+tv', whose positive-half integral is zero. Its mesh error is at most u Var(w), yielding e'_v(log u)=O(u^1/2). No differentiation of a conditionally convergent Fourier row is used. Endpoint continuity removes delta contributions in e'_v. Consequently the full evenized image is H¹, has an integrable derivative, and decays like exp(-3|x|/2).

## Independent Mellin and density argument

Directly substituting u=exp x in the shifted bilateral transform gives Z_E(z)=zeta(z)V(z) for Re z>1; there is no extra half power. Near zero v(u)=O(u²), so V is holomorphic for Re z>-2. The E-image decay extends its transform to Re z>-1, and V(1)=0 removes the zeta pole. Reflection then gives [zeta(z)V(z)+zeta(1-z)V(1-z)]/2 in -1<Re z<2. Both terms vanish at every nontrivial zero, with no RH premise.

For an independent justification of the noncompact explicit-formula passage, approximate this image in X by compact smooth f_j and fix a compact smooth logarithmic test h. Weighted L² convergence implies uniformly bounded and convergent transforms of f_j on the entire closed zero strip, by Cauchy–Schwarz with exp(-(a_w-1/2)|x|). The transform of h has arbitrarily rapid ordinate decay there. The standard zero count therefore dominates the zero-side paired sums. Their limit is zero because the image's Mellin transform vanishes at the reflected/conjugated zeros. Continuity of q then gives q(f,h)=0. Density extends this to every h in X, including f and its sharp window/exterior parts. This also supplies a direct alternative to relying on an unstated regularity extension of the classical radical terminology.

The historical smooth-source radical and explicit-formula normalization were checked in [Connes–Consani, Sections 2.1.1 and 3](https://arxiv.org/pdf/2106.01715). The finite-regularity domain justification above is checked separately. Pole evaluations at z=0,1 need not vanish: they are retained in the actual 5/4-normalized continuum/gamma form.

## Sharp restriction and both tails

Since f has integrable derivative, its sharp central restriction is compact BV; its Fourier transform is O(1/|t|), hence it lies in H^s for s<1/2. The exterior belongs to X as well. Sesquilinearity and radicality yield q(Pf)=q(Qf) exactly, without periodic boundary identification.

For t_+(ell+s)=t_-(-ell-s)=a(s), the nonzero cross correlation is C_a(s)=integral_0^s conjugate(a(u))a(s-u)du at shift 2ell+s. The actual off-diagonal gamma kernel is -exp(-5r/2)/(1-exp(-2r)). Therefore

    q(t_-,t_+) = lambda |L_a(-1/2)|²
      - sum_(n>lambda²) Lambda(n)/sqrt(n) C_a(log(n/lambda²))
      - sum_(m>=0) lambda^(-4m-5)|L_a(2m+5/2)|².

The continuum factor is lambda, not one; the atom at n=lambda² is zero. There is no factor two in this cross pairing. The full exterior quadratic form is 2q(t_+)+2 Re q(t_-,t_+). Laplace transforms of C_a are modulus squares, but C_a itself is NOT nonnegative. For the legal smooth half-line profile a(s)=exp(-2s)(1-s), C_a(2)=-(2/3)exp(-4)<0. It is real for these identical reflected profiles, including complex a, by convolution symmetry. Thus no sign may be assigned to the prime samples individually.

The exact common-domain sampler identity a=(1/(2sqrt(2)))sum_m R_m Uv checks, including its full-even factor. Repairs outside the prolate input domain must still be kept. This identity alone proves no new tail bound or global stability.
