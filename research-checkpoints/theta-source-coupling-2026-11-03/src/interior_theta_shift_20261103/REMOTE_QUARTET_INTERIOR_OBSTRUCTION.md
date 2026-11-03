# Remote zero quartets defeat finite-data inward shift continuation

Date: 2026-11-03. Status: independent analytic audit PASS. This is AI-assisted review, not peer review or a machine-formalized proof. This is a countermodel to a specified generic mechanism, not a counterexample for the original theta form, not an RH result, and not a literature-novelty claim.

## Result first

Fix any target shift 0<a<1/2. One can modify the actual complete Xi transform by a remote degree-four factor so that all of the following hold simultaneously:

1. The modified transform is real, even, entire of order one, with every zero still in |Im z|<1/2.
2. Its complete Fourier profile remains strictly positive, even, smooth, and doubly exponentially decreasing, with all exponential moments.
3. Every actual Xi zero whose absolute real coordinate is at most an arbitrarily prescribed finite height T is retained exactly, with its multiplicity. The only new zeros are one quartet above that height.
4. The fully paired form is strictly positive on every nonzero polynomial for every shift b>=1/2.
5. Any fixed collection of strictly positive finite original moment blocks can be kept strictly positive. This includes a fixed finite block uniformly over a compact shift interval whenever the original block is strictly positive throughout that interval.
6. Nevertheless the complete, undivided paired density is strictly negative on a nonempty interval at the prescribed interior shift a. Its polynomial forms therefore have negative directions in both parity ladders at some finite degrees beyond the preserved blocks.

Thus positive complete-profile data, order-one growth, the zero strip, an arbitrarily large finite verified zero set, finite moment positivity, and outer-shift all-degree positivity do not by themselves imply all-degree positivity at a fixed interior shift. An inward-continuation theorem must use additional structure that excludes this explicit modification. In particular, this construction does NOT preserve the original theta orbit f or the exact original Xi gamma/zeta factorization. Generic integer-orbit divisor and prime-recurrence identities do survive, as explained in the strengthening below. It does not claim that such a modification is allowed inside an argument that uses the exact original f or completed zeta function.

## 1. Original normalization and the modification

Let

    F(z)=2 xi(1/2+iz)=integral_R psi(u) exp(-izu) du,
    w_b[F](t)=-Im(F'(t+ib) conjugate(F(t+ib)))/b   (b!=0),
    w_0[F](t)=F'(t)^2-F(t)F''(t).

Use the full paired density throughout, with no separation of pole/source/prime jets. For R>1 and a<d<1/2 put

    P_(R,d)(z)=[((z-R)^2+d^2)((z+R)^2+d^2)]/(R^2+d^2)^2
              =1+2(d^2-R^2)z^2/(R^2+d^2)^2+z^4/(R^2+d^2)^2,
    G_(R,d)(z)=F(z)P_(R,d)(z).

The four new zeros are exactly +/-R +/- id. Choose R beyond the verified window and avoiding the locally finite set of absolute real coordinates of original zeros. Then multiplication preserves every original zero and its exact multiplicity, while adding only the four new zeros. It preserves real evenness, order one, and G(0)=F(0). The zero strip remains strict. The exponential spectral decay rates supplied by the theta contour argument are unchanged: multiplication costs a polynomial factor, and for every v<pi/4 one still has bounds by constants times exp(-v|t|), after taking a slightly larger contour height if needed. The numerical constants in a pre-existing gamma envelope are NOT asserted unchanged.

## 2. The complete physical profile stays positive

Fourier differentiation gives the exact new profile

    psi_(R,d)(u)
      =[psi''''(u)+2(R^2-d^2)psi''(u)+(R^2+d^2)^2 psi(u)]
         /(R^2+d^2)^2.                                      (1)

For completeness, the positive theta expansion for u>=0 is

    psi(u)=4 sum_(n>=1) exp(u/2) (2U_n^2-3U_n) exp(-U_n),
    U_n=pi n^2 exp(2u),

and the complete profile is even. It is strictly positive because U_n>=pi>3/2. The leading n=1 term and termwise differentiated, exponentially smaller n>=2 terms give

    psi^(j)(u)/psi(u)=(-2pi exp(2u))^j [1+o(1)]

for each fixed nonnegative integer j as u tends to +infinity. In particular the ratios for j=2 and j=4 tend to +infinity at both ends of the real axis. They are continuous because psi>0. Consequently there exist finite nonnegative constants C_2,C_4 such that

    psi''>=-C_2 psi,          psi''''>=-C_4 psi

on the whole real line. Since R>d, (1) implies

    (R^2+d^2)^2 psi_(R,d)/psi
      >=(R^2+d^2)^2-2(R^2-d^2)C_2-C_4
      >=R^4-2R^2 C_2-C_4.                                  (2)

The last expression is strictly positive for sufficiently large R, uniformly for 0<=d<=1/2. This proves global profile positivity without a numerical tail extrapolation. All its derivatives retain double-exponential decay, and its contour analyticity in any closed substrip |Im u|<pi/4 is inherited from the theta derivatives.

The construction therefore is not merely the old polynomial counterexample with an inadmissible Fourier profile. It has a strictly positive complete profile in the same analytic decay class as theta.

### Explicit orbitwise strengthening: R>=11 suffices

A parallel recurrence investigation independently obtained an explicit certificate, reproduced here by exact symbolic arithmetic. Let T^2=R^2-d^2, epsilon=2Rd, and write

    f(u)=4 exp(u/2-x) (2x^2-3x),       x=pi exp(2u),
    psi(u)=sum_(n>=1) n^(-1/2) f(u+log n).

The numerator operator in (1) is

    L=D^4+2T^2 D^2+T^4+epsilon^2.

For a polynomial p(x), differentiating 4 exp(u/2-x)p(x) replaces p by (1/2-2x)p+2xp'. Put y=x-3 and V=T^2-100. The polynomial associated with (D^4+2T^2D^2+T^4)f is exactly

    32y^6+48y^5+(16V+588)y^4+(80V+4560)y^3
      +(2V^2+421V+174409/8)y^2
      +(9V^2+2913V/2+1032633/16)y
      +9V^2+2889V/2+979785/16.

Every coefficient is strictly positive for V>=0. On u>=0, x>=pi>3, and f(u)>0. Therefore Lf(u)>0 for T>=10, including the extra nonnegative epsilon^2 f term. The sufficient choice R>=11 and 0<=d<=1/2 gives T^2>=120.75>100. Every orbit center u+log n remains nonnegative when u>=0; summing shows psi_(R,d)>0 there, and its already-established evenness gives positivity on the whole line.

Moreover constant-coefficient differential operators commute with translations, so

    psi_(R,d)(u)=sum_(n>=1) n^(-1/2) f_(R,d)(u+log n),
    f_(R,d)=Lf/(R^2+d^2)^2.

The unreflected orbit f_(R,d) may be signed on the negative half-line; it must not be replaced by a positive reflected orbit in a divisor identity. The finite differential modification retains bounds sufficient for fixed-polynomial regrouping, with increased polynomial prefactors. Coefficients of q remain frozen when differentiating in the shift, and the normalized finite-Euler logarithm interpretation stays within |a|<1/2. Thus the generic divisor convolution, tilted prime-power recurrence and integrated divisor derivative identities continue to hold with this changed orbit. Merely knowing those structural identities, in addition to the package above, still does not force interior positivity. A closing inequality must distinguish the original orbit from these explicitly positive complete modified sources.

## 3. Exact full-pair product identity and preservation of finite blocks

For any real entire f,p,

    w_b[fp]=|p(t+ib)|^2 w_b[f]+|f(t+ib)|^2 w_b[p].           (3)

This is an identity of the undivided entire expressions; at b=0 it follows by differentiation or a removable limit. In particular no pole is separated from its canceling amplitude.

As R tends to infinity, P_(R,d) tends to 1 locally uniformly together with every derivative, uniformly for d in [0,1/2]. Its nonconstant coefficients are O(R^-2) and O(R^-4). The polynomial density w_b[P] has a removable b=0 limit, and all its coefficients tend to zero. For a compact shift interval 0<=b<=A, the following uniform bounds therefore hold with a constant depending on A:

    ||P(t+ib)|^2-1| <= C_A R^-2 (1+|t|^8),
    |w_b[P](t)|      <= C_A R^-2 (1+|t|^6).                 (4)

The actual F and its first two derivatives have uniform exponential decay on that fixed shift interval. Equations (3)-(4) and dominated integration show, for each fixed integer k>=0,

    sup_(0<=b<=A, 0<=d<=1/2)
      |integral_R t^k (w_b[G_(R,d)]-w_b[F])dt| -> 0.         (5)

Indeed the convergence is O(R^-2), with a finite constant depending on k and A. Hence every fixed finite moment matrix converges uniformly. If the original finite matrix is positive at a fixed shift it remains so for all sufficiently large R. If it is positive for every b in a compact interval, continuity and compactness give a positive minimum eigenvalue, and uniform positivity is preserved. The same argument preserves any finite list of such blocks or any strict compact-frequency certificate.

This is an existence statement, not a claim that a usable R has been computed for an enormous block. Applied to the finite theorem recorded in PR #40, it says that even its fixed finite degree limit can coexist with a later failure in this modified-source class. The PR's finite certificate and massive external zero verification have not been rerun here.

## 4. Force negativity at the chosen interior shift

Choose R large enough for Sections 2-3, beyond the desired verified height, and avoiding the locally finite set of real coordinates of all original F zeros. In particular F(R+ia)!=0. Put

    L_F(R)=-Im(F'(R+ia)/F(R+ia))/a,

which is a finite real number. The exact conjugate-pair logarithmic contribution gives

    w_a[G](R)/|G(R+ia)|^2
      =L_F(R)+2/(a^2-d^2)
       +2(4R^2+a^2-d^2)/
         { [4R^2+(a-d)^2][4R^2+(a+d)^2] }.                 (6)

For R>=1 and 0<a<d<1/2 the last term is positive and at most 17/32. The middle term tends to minus infinity as d decreases to a. For an explicit existential choice set

    eta=min{(1/4-a^2)/2, 1/(|L_F(R)|+2)},
    d=sqrt(a^2+eta).

Then a<d<1/2, and (6) is strictly negative. There is no zero or singular evaluation at the selected point: both F(R+ia) and P(R+ia) are nonzero. Multiplying (6) by the strictly positive |G(R+ia)|^2 proves negativity of the full undivided density itself. Its magnitude may be extremely small; only its sign matters here.

Continuity gives a negative open interval, and evenness gives its reflected partner. Since the density has an exponential moment, real polynomials are dense in L^2(|w_a[G]|dt), with parity-preserving approximations. Approximating normalized indicators of those intervals produces a negative polynomial direction in each parity. The degree is necessarily beyond whichever positive prefixes were preserved. No bound on that first bad degree is asserted.

## 5. Outer shifts remain positive at every degree

All original zeros and inserted zeros have |Im z|<1/2. The paired order-one canonical-product formula therefore has only positive real/conjugate-zero contributions at every b>=1/2. Retaining any original real zero pair +/-gamma_0 gives exactly the established bound

    w_b[G](t) >= 2|G(t+ib)|^2/(t^2+gamma_0^2+b^2),
    integral_R q(t)^2 w_b[G](t)dt > 0

for every nonzero real polynomial q and b>=1/2. The shifted G has no zeros on those lines, and polynomial-weighted integrability is preserved. Thus the countermodel genuinely retains the all-degree exterior theorem rather than merely a single positive boundary value.

## 6. Precise obstruction and remaining task

The obstruction concerns an inward mechanism based only on this listed package:

    positive complete profile + real even order-one transform
    + critical zero strip + finite exact verified zero region
    + finite positive moment prefixes + exterior full-pair positivity.

All of that package survives, but the conclusion fails at any prescribed interior shift. It also explains the sharp local difficulty of comparing unknown off-line pairs with the known real-zero reserve: at their horizontal coordinate, a pair just outside the target shift contributes 2/(a^2-d^2), which has no lower bound from strip support or finite zero verification alone.

The actual theta source is NOT modified in any claimed theorem. The exact original theta arithmetic could rule out the inserted factor, and any genuine new estimate exploiting that arithmetic remains open. No conclusion about the sign of the original interior density, any actual next selected pivot, or RH follows from this note.

A concrete distinguishing condition is available. The Fourier/Mellin integral of the original unreflected orbit converges for Re s>-2, with s=1/2+iz, and then has the meromorphic continuation

    A(s)=s(s-1) pi^(-s/2) Gamma(s/2),
    2pi(s-1)A(s+2)=(s+2)(s+1)A(s).

The displayed undivided shift equation is a meromorphic identity; quotient versions are used only away from zeros and poles. The inserted nonconstant quartic changes this rational shift equation. The parallel recurrence note derives this boundary explicitly and gives a separate zero-shift negative witness: ../suzuki_prime_recurrence_20261103/RECURRENCE_PRESERVING_QUARTET.md. Thus a proposed closure can be checked against a concrete falsification family: if it uses only properties preserved above, it cannot suffice; an estimate that uses the exact original archimedean shift equation remains unrefuted by this construction.

This result strengthens the existing generic polynomial shift-continuation obstruction by retaining a positive theta-derived profile, order-one growth, the whole zero strip, arbitrarily remote onset, and finite polynomial certificates simultaneously. It is complementary to the existing positive-profile Gaussian-mixture counterexample, whose entire function has order two and does not retain the global critical zero strip.

## Sources and verification

- Fresh GitHub connector read on 2026-11-03 verified draft PR #40 at head 6c6c81697fdc527d017dc592b55bea3efa5bb31b: https://github.com/judegomila/mathexplorer/pull/40 .
- Frozen prior shift evolution and obstruction: https://github.com/judegomila/mathexplorer/blob/6c6c81697fdc527d017dc592b55bea3efa5bb31b/research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02/evidence/v18-curated/hierarchy/shift_v3/shift_continuation.md .
- Frozen density-localization and Gaussian analogue: https://github.com/judegomila/mathexplorer/blob/6c6c81697fdc527d017dc592b55bea3efa5bb31b/research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02/evidence/v33-continuation/theta_correlated_local_v1/FIXED_SHIFT_SIGNED_TAIL_OBSTRUCTION.md .
- Original outer-shift bound and localization proof: the local paired_theta_form_20261103 notes supplied to this task.
- Standard xi functional equation, zero strip and existence of real zeros: https://dlmf.nist.gov/25.4 and https://dlmf.nist.gov/25.10, freshly inspected.
- Symbolic checks with SymPy independently verified the quartet expansion, formula (6), and removable b=0 polynomial-density identity.

No live 4CT scripts were read, run, or edited. No external state was changed.
