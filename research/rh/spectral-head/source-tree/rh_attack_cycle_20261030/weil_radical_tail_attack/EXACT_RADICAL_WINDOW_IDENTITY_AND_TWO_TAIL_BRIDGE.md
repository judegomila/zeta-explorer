# Exact full-E radical identity, sharp window restriction, and the two-tail bridge

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **Producer theorem, independent review pending.** This is separate from the inverse-evenization coordinate-Gram work. It proves an identity on an explicitly declared function class, not the existence of a global ordinary-L2 Weil operator. It supplies no sign for the cross-tail arithmetic bridge.

## 1. A concrete paired-form domain, not a global closure assumption

Use logarithmic coordinate x, the unitary angular Fourier transform, and the actual 5/4 normalization

    a(t)=Re psi(5/4+it/2)-log pi,
    R_(f,g)(r)=integral conjugate(f(x))g(x+r)dx.

For 0<s<1/2 and 1/2<a_w<3/2, define the Banach intersection

    X=H^s(R) intersect L^2(R,exp(2a_w|x|)dx).

On this space define the sesquilinear pairing directly by absolutely convergent terms:

    q(f,g)=integral a(t)conjugate(fhat(t))ghat(t)dt
      +integral_0^infinity exp(r/2)[R_(f,g)(r)+R_(f,g)(-r)]dr
      -sum_(n>=2) Lambda(n)/sqrt(n)
                    [R_(f,g)(log n)+R_(f,g)(-log n)].      (1)

The gamma term is continuous in H^s because a(t)=O(log(2+|t|)). The arithmetic terms are continuous in the weighted L2 norm: the triangle inequality |x|+|x+r|>=|r| and Cauchy--Schwarz give

    |R_(f,g)(r)|<=exp(-a_w|r|)||f||weighted||g||weighted.   (2)

Both integral_0^infinity exp[-(a_w-1/2)r]dr and sum Lambda(n)n^(-a_w-1/2) converge. Thus q is a continuous paired form on X. Smooth compactly supported functions are dense in X, by smooth truncation and mollification in both norms. None of this asserts lower boundedness or closability on unweighted global L2.

The 5/4 gamma already includes the pole correction. In the original 1/4 normalization the pole kernel is 2cosh((x-y)/2); adding convolution by exp(-|x-y|/2) to the gamma multiplier moves it to the exp(|x-y|/2) continuum term in (1). No extra pole term may be added to (1).

## 2. Source class covering the endpoint-repaired sharp prolate inputs

Fix lambda>1. Let v be an even, compactly supported function on[-lambda,lambda] such that:

1. v is absolutely continuous, its derivative has bounded variation after zero extension, and v is C2 near zero;
2. v(lambda)=v(-lambda)=0;
3. v(0)=0 and integral_R v=0.

Finite smooth prolate combinations with the stated source traces, and the usual smooth origin/endpoint repairs, meet these fixed-support regularity conditions. Constants in this section may depend on v and lambda; no uniform residual estimate is claimed.

Write H=Fv using exp(2pi iyt) on additive space. Since the distributional second derivative of v is a finite measure,

    H(t)=O((1+|t|)^(-2)).                                 (3)

Define the full logarithmic arithmetic image

    e_v(x)=exp(x/2)sum_(n>=1)v(n exp x).

The sum is finite at each x. It vanishes for x>=ell=log lambda. Absolute Poisson summation, using v(0)=integral v=0 and (3), gives

    e_v(log u)=u^(-1/2)sum_(n>=1)H(n/u)=O(u^(3/2)),
                                                        u->0+. (4)

For completeness, its weak logarithmic derivative is also controlled without differentiating a conditionally convergent Fourier series. Away from the sample breakpoints,

    d/dx e_v(x)=exp(x/2)sum_(n>=1)w(n exp x),
    w(t)=v(t)/2+t v'(t).

The positive-half integral of w is zero by integration by parts and the vanishing endpoint trace. The function w is compactly supported and BV. On a mesh of size u,

    |u sum_(n>=1)w(nu)-integral_0^infinity w(t)dt|
                       <=u Var(w).

Thus e_v'(log u)=O(u^(1/2)). The sampled function itself is continuous across the breakpoints because v(lambda)=0. These bounds imply e_v in H1(R), e_v' in L1(R), and e_v(x)=O(exp(3x/2)) at the left end.

Now reflect evenly in logarithmic space:

    f(x)=[e_v(x)+e_v(-x)]/2.                              (5)

Then f is even, belongs to H1, has integrable derivative, and decays as exp(-3|x|/2). Therefore f belongs to X for every pair of parameters stated in section1.

## 3. Mellin zero factor and radicality, including the test-domain extension

Use the shifted bilateral Mellin transform

    Z_f(z)=integral_R f(x)exp[(z-1/2)x]dx,
    V(z)=integral_0^infinity v(u)u^(z-1)du.

Evenness, C2 regularity near zero, and v(0)=0 imply v(u)=O(u^2), so V is holomorphic for Re z>-2. For Re z>1 absolute summation gives

    Z_(e_v)(z)=zeta(z)V(z).                               (6)

The left side is holomorphic for Re z>-1 by (4). The pole at z=1 on the right is removable because V(1)=0. Analytic continuation gives (6) throughout Re z>-1. Consequently

    Z_f(z)=[zeta(z)V(z)+zeta(1-z)V(1-z)]/2,               (7)

holomorphic in -1<Re z<2. At every nontrivial zeta zero rho, both factors zeta(rho) and zeta(1-rho) vanish. Hence Z_f(rho)=0. No assertion that these zeros lie on the critical line is used.

The standard Weil explicit formula, applied to the correlation of f with a smooth compact logarithmic test h, now gives

    q(f,h)=sum_rho conjugate(Z_f(1-conjugate(rho)))Z_h(rho)=0. (8)

This is a legitimate noncompact use of the formula: the correlation is smooth because derivatives can be moved to h, and it and all derivatives have exponential decay strictly faster than exp(-|x|/2). Its multiplicative version satisfies the usual explicit-formula test class; the compact smooth factor supplies arbitrary vertical-transform decay, so the zero sum converges absolutely. The vanishing in (8) uses the conjugate/reflected zero symmetry, not positivity.

The full-E radical statement for even Schwartz sources is recorded in Connes--Consani, *Spectral triples and zeta-cycles*, section3, equation(3.1); their section2.1.1 states the explicit-formula test class and normalization. The argument above extends the identity to the declared finite-regularity source class rather than assuming that extension from the word “radical.” Primary source: <https://arxiv.org/pdf/2106.01715>.

By density of compact smooth h and continuity of (1) on X, equation(8) extends to EVERY h in X. The pole evaluations Z_f(0),Z_f(1) need not vanish: their finite contributions remain in the actual continuum/gamma normalization and are balanced by the complete explicit formula.

## 4. Sharp window and exact exterior energy identity

Let P_ell be multiplication by 1_[-ell,ell] and Q_ell=I-P_ell. Since f has integrable derivative, P_ell f has bounded variation and compact support. Its Fourier transform is O((1+|t|)^(-1)), so P_ell f belongs to H^s for s<1/2 and hence to X. The same is true of Q_ell f=f-P_ell f. Sharp endpoints are therefore legal here; they have not been replaced by periodic identification or a smooth cutoff.

Using q(f,h)=0 for h=f,Q_ell f gives exactly

    q(P_ell f,P_ell f)=q(Q_ell f,Q_ell f).                (9)

Equation(9) is a paired-form identity on X. It does not introduce or require a global selfadjoint Weil operator. On the left it is precisely the fixed-support actual Weil form of the evenized arithmetic image.

## 5. Both log tails and their full cross term

Write Q_ell f=t_-+t_+, with

    t_+(ell+s)=a(s), t_-(-ell-s)=a(s), s>=0,
    a(s)=f(ell+s).

Extend each tail by zero outside its indicated half-line. Reflection invariance yields

    q(Q_ell f)=2q(t_+)+2Re q(t_-,t_+).                    (10)

The cross correlation is supported on r>=2ell, and exactly

    R_(t_-,t_+)(2ell+s)=C_a(s),
    C_a(s)=integral_0^s conjugate(a(u))a(s-u)du.          (11)

The opposite-sign correlation is zero for positive r. Let

    L_a(b)=integral_0^infinity exp(-bs)a(s)ds.

All expressions below converge absolutely because a(s)=O(exp(-3s/2)). The off-diagonal gamma kernel in the actual 5/4 normalization is

    -K(r), K(r)=exp(-5r/2)/(1-exp(-2r))
                   =sum_(m>=0)exp[-(2m+5/2)r], r>0.

There is no local diagonal gamma contribution between the disjoint tails. Inserting (11) in (1) gives the exact bridge

    q(t_-,t_+)
      =lambda |L_a(-1/2)|^2
       -sum_(n>lambda^2) Lambda(n)/sqrt(n)
                           C_a(log(n/lambda^2))
       -sum_(m>=0) lambda^(-4m-5)|L_a(2m+5/2)|^2.       (12)

The atom n=lambda^2, if present, is zero because C_a(0)=0. The Laplace square identities follow by Fubini on the convolution C_a; they hold for complex a. There is NO extra factor 2 in (12); the full quadratic cross contribution is the 2Re in (10).

The gamma cross is explicitly nonpositive and decays with separation. The first two terms are the actual prime-continuum discrepancy at labels near and above lambda^2, with an explicit scale-lambda continuum charge. Bounds on only one exterior tail do not control this signed bridge. In particular replacing the prime sum by its absolute value recreates a potentially growing loss.

## 6. Exact link with the newly controlled exterior sampler row

For s>=0, source compact support kills e_v(ell+s), while Poisson evaluates its reflection. Thus

    a(s)=(sqrt(lambda)/2)exp(s/2)
                          sum_(n>=1)H(n lambda exp s).   (13)

With the established full-even exterior normalization

    Uv(s)=sqrt(2lambda)exp(s/2)H(lambda exp s),
    R_n Uv(s)=n^(-1/2)Uv(s+log n),

equation(13) is

    a=(1/(2sqrt2))sum_(n>=1)R_n Uv.                     (14)

This is a common-domain exterior sampler row, not the moving visible inverse-Mobius tail used in the coordinate-Gram argument. The new additive value/translation estimates may control norms and same-tail energy in (10). They do not delete the cross-tail term (12), nor do they automatically transfer to repaired source rows that lie outside their declared prolate domain.

For trace-null mean-zero g already in the actual prolate head, v=g and no source repair is needed. For general repaired input, all added origin/endpoint rows must be retained. Even in the former case, (12) is an additional signed arithmetic target, not a consequence of a positive value-frame estimate.

## 7. Exact gain and stopping line

The full-E radical and sharp restriction identities are valid on the explicit source/paired-form classes above, with no RH assumption. They convert the supported Weil energy into two same-tail terms plus the explicit separated-tail bridge. This is an equivalent reformulation and a domain clarification; no support-uniform residual, lower floor, or positivity extension is proved.

The next useful inequality would preserve cancellation in the first two terms of (12), jointly with the same-tail terms, and relate that whole energy to the actual output norm. A one-sided exterior estimate alone is insufficient. This distinction prevents the coordinate-Gram progress from being silently promoted into a Weil-energy theorem.

Local normalization dependencies: `../actual_translation_graph/ACTUAL_JUMP_GRAPH_AND_COUNTERTERM.md`, `../holographic_boundary_bulk/EXACT_GAMMA_BULK_AND_ARITHMETIC_DEFECT_TEST.md`, and the accepted uniform exterior value/translation notes in `../gamma_complement_attack/`.
