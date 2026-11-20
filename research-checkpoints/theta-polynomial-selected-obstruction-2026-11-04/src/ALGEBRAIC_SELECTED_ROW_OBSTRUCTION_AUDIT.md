# Selected multiplication rows cannot decay as n^(-s) for s>5/4

2026-11-04. Independent analytic audit of the proposed polynomial refinement. This is not external peer review or formal verification. No selected-coherence or RH conclusion is asserted.

## 1. Theorem and exact inputs

Let F be the actual real even theta transform. Define

    Tp=Fp'+2F'p,    X(p,q)=integral_R (Tp)(Tq),
    w=F²,          V=2(F'²-FF'').

Let q_n=P_n/sqrt(A_n) be the actual X-orthonormal polynomial sequence, with q_n of degree n and real coefficients. Fix a nonzero real polynomial q and a nonconstant real polynomial h. Set

    a_n=X(hq_n,q).

Then, for every s>5/4, there is no finite constant C such that

    |a_n| <= C(n+2)^(-s)

for all sufficiently large n. The same conclusion holds along the matching parity subsequence if h is even and q has definite parity. This is an exclusion of uniform tail upper bounds, not a lower bound at every index.

Inputs:

1. The proved natural-reference lower comparison, from ../theta_polynomial_comparison_20261104/GENERAL_REFERENCE_AND_NATURAL_COROLLARIES.md:

       ||p||_(W_*)² <= C(n+2)[log(n+2)]^(3/4) X[p],
       W_*(t)=|Gamma(9/4+it/2)|², deg p<=n.

2. The exact Pollaczek generating function and reference norms stated below.

3. The same actual-theta inputs as the existing resonance theorem ../theta_selected_recurrence_20261104/NO_FAST_SELECTED_MULTIPLICATION_TAIL.md: F is real entire, its fixed derivatives have exponential decay times polynomial factors on R, and F has infinitely many simple real zeros. In fact, for any particular h,q, it is enough that one simple real zero r satisfies h'(r)q(r) != 0. The infinite-simple-zero input guarantees such r for every allowed h,q.

The concrete natural-reference proof in Sections 2-6 first establishes the weaker threshold s>3/2. Section 8 then uses the same audited general comparison with lambda decreasing toward 2 to prove the full threshold s>5/4 stated above.

## 2. Angular Cauchy estimate for reference polynomials

Write lambda=9/4 and Q_j(t)=P_j^(lambda)(t/2;pi/2). Their generating function is

    G_t(z) = sum_(j>=0) Q_j(t) z^j
           = (1-iz)^(-lambda+it/2)(1+iz)^(-lambda-it/2).

Branches are normalized at z=0. Fix R<infinity and 0<b<2(lambda-1), and restrict |Re t|<=R, |Im t|<=b. Put t=x+iy. For |z|<1, each of 1+iz and 1-iz has positive real part; its argument is between -pi/2 and pi/2. Hence

    |G_t(z)| <= C_R |1-iz|^(-lambda-y/2)
                         |1+iz|^(-lambda+y/2).          (1)

The two possible small factors occur at different points of the unit circle. Split the angular circle into fixed disjoint neighborhoods of z=i and z=-i, and their complement. In the neighborhood where one factor can be small, the other is bounded above and away from zero uniformly in r=|z|>=1/2. The complement is uniformly bounded. Both singular exponents lie in the compact interval

    [lambda-b/2,lambda+b/2] subset (1,infinity).

For any alpha in this interval, a uniform elementary integral estimate gives

    integral_(-pi)^pi |1-r exp(i theta)|^(-alpha)dtheta
        <= C_b(1-r)^(1-alpha),   1/2<=r<1.             (2)

To see (2), use |1-r exp(i theta)|²=(1-r)²+4r sin²(theta/2), comparable on this interval to (1-r)²+theta², then substitute theta=(1-r)v. The integral of (1+v²)^(-alpha/2) is uniformly finite because alpha is bounded away from one.

Equations (1)-(2), and 0<1-r<1, yield

    integral_0^(2pi) |G_t(r exp(i theta))|dtheta
        <= C_(R,b)(1-r)^(1-lambda-b/2).                (3)

Cauchy's coefficient formula with r=1-1/(j+2) has r^(-j)<=e, so

    sup_(|Re t|<=R,|Im t|<=b)|Q_j(t)|
       <= C_(R,b)(j+2)^(lambda-1+b/2).                 (4)

This uses the angular L1 integral, not the circle maximum. Using the maximum instead would lose the crucial factor j^(-1).

The exact reference norm is

    h_j=||Q_j||_(W_*)²
       =(4pi/2^(2lambda))Gamma(j+2lambda)/j!,

so h_j is comparable to (j+2)^(2lambda-1). For psi_j=Q_j/sqrt(h_j), (4) becomes

    sup_(|Re t|<=R,|Im t|<=b)|psi_j(t)|
       <= C_(R,b)(j+2)^(-1/2+b/2).                    (5)

Thus the complex evaluation kernel satisfies

    sum_(j=0)^n |psi_j(t)|² <= C_(R,b)(n+2)^b.          (6)

The constant in (6) may diverge as b decreases to zero, which is harmless since b will be fixed after s is specified.

## 3. Selected-polynomial evaluation and the summability threshold

Expand any degree-at-most-n polynomial in the reference orthonormal basis and apply Cauchy-Schwarz to (6):

    |p(t)| <= C_(R,b)(n+2)^(b/2)||p||_(W_*).

For q_n, X[q_n]=1, so input 1 gives

    sup_(|Re t|<=R,|Im t|<=b)|q_n(t)|
       <= C_(R,b)(n+2)^(1/2+b/2)[log(n+2)]^(3/8).      (7)

Suppose |a_n|<=C(n+2)^(-s) for some s>3/2. Choose once and for all

    0<b<min(2(lambda-1),2s-3).

Then -s+1/2+b/2<-1. Any sequence c_n with the same tail bound makes sum c_nq_n converge uniformly on every closed rectangle |Re z|<=R, |Im z|<=b, by (7). Its sum is holomorphic on |Im z|<b. Cauchy estimates on slightly larger rectangles within this strip give local uniform convergence of every fixed derivative. No entire extension is claimed or needed.

## 4. Exact multiplication defect and L2 source limit

Integration by parts gives, for every polynomial p,

    X(hp,q)-X(p,hq)=integral_R p f,
    f=(w h')'q+2w h'q'.                                (8)

Put

    c_n=integral_R q_n f=a_n-X(q_n,hq).

The second term is zero for n>deg(hq), by polynomial orthogonality. Thus c_n has the assumed O(n^(-s)) tail and belongs to l². Define

    R(z)=sum_(n>=0)c_nq_n(z).

By Section 3, R is holomorphic in a fixed horizontal strip containing the entire real axis and its derivatives converge locally uniformly there. Independently, source orthonormality makes sum c_nTq_n converge in L²(R). On every compact real interval its partial sums also converge uniformly to TR. The L² limit must therefore equal TR almost everywhere, so TR belongs to L²(R).

Every polynomial p has a finite selected-basis expansion. Passing to the L² limit gives

    integral_R p f = integral_R (Tp)(TR).              (9)

No completeness of the sources in the whole ambient L² space is assumed; their orthonormality and the finite polynomial expansion suffice.

## 5. Fourier-distribution uniqueness

Set u=FTR and v=2F'TR. Because TR is in L² and F,F' have exponential decay times polynomial factors, u and v are exponentially integrable: for some epsilon>0,

    integral exp(epsilon|t|)(|u(t)|+|v(t)|)dt < infinity.

For example, apply Cauchy-Schwarz using e^(epsilon|t|)F and e^(epsilon|t|)F' in L². The explicit f in (8) is exponentially integrable as well. Equation (9) is

    integral p f = integral p' u + integral p v

for every polynomial p. With Fourier convention e^(-i xi t), the holomorphic function

    H(xi)=Fourier(f)(xi)+i xi Fourier(u)(xi)-Fourier(v)(xi)

is defined on a common strip about the real frequency axis. All its derivatives at zero vanish by the polynomial identities. Analytic uniqueness gives H=0 throughout that connected strip, hence on the real frequency axis. Fourier uniqueness for distributions yields

    f=-u'+v=-(wR')'+VR=:LR                             (10)

as distributions. Since R is holomorphic near the real axis and F is entire, both sides are smooth there, so (10) is a pointwise identity. The argument uses no global growth bound for R and does not require R to be entire.

## 6. Local simple-zero resonance

Choose a simple real zero r of F with h'(r)q(r) != 0; this is possible under input 3. Set gamma=F'(r) != 0. Then

    w(r)=w'(r)=0,   w''(r)=2gamma²,   V(r)=2gamma².

Equation (8) gives f(r)=0. Evaluating (10) at r gives R(r)=0. Differentiating LR at r yields

    (LR)'(r)=(-w''(r)+V(r))R'(r)+V'(r)R(r)=0.

But differentiation of (8) gives

    f'(r)=w''(r)h'(r)q(r)=2gamma²h'(r)q(r) != 0,

contradicting (10). Therefore the assumed O(n^(-s)) tail for s>3/2 is impossible.

If h is even and q has definite parity, f has the same parity as q. Carry out the series construction only in that parity. Moment identities in the other parity vanish automatically, so the full Fourier-uniqueness step remains valid. Reindexing a parity subsequence changes only constants in the bounds.

## 7. Limits and dependence

The natural-reference calculation alone does not exclude s=3/2, but the general-reference refinement in Section 8 does. The endpoint s=5/4 remains unaddressed. A real-axis bound alone cannot replace the positive-width strip needed for derivative convergence. The result also does not exclude every algebraic decay rate, yield lower bounds at every n, or establish any selected derivative-coherence or defect claim.

The arithmetic log³ trial upper and the sharpened Gram condition bounds are not needed here. The only new quantitative source input is the natural-reference lower bound (input 1) for Sections 2-6, and its already-audited general-reference version for Section 8. Both came from theta strip decay and the prior subexponential comparison. The infinite-simple-real-zero fact is retained explicitly as a separate supplied input.

All writing for this extension is confined to this new folder; no frozen notes or live 4CT files are modified.


## 8. General-reference optimization: every exponent s>5/4 is excluded

The already-audited general comparison in ../theta_polynomial_comparison_20261104/GENERAL_REFERENCE_AND_NATURAL_COROLLARIES.md states that, for fixed parameters

    lambda>2,   1/2<a<2lambda-7/2,

all real degree-at-most-n polynomials satisfy

    ||p||_(W_lambda)² <= C_(lambda,a) N^(2lambda-7/2)(log N)^a X[p],
    W_lambda(t)=|Gamma(lambda+it/2)|²,   N=n+2.          (11)

The interval for a is nonempty precisely because lambda>2. In particular,

    ||q_n||_(W_lambda) <= C_(lambda,a) N^(lambda-7/4)(log N)^(a/2).

The angular Cauchy proof in Section 2 works without alteration for every fixed lambda>2: choose 0<b<2(lambda-1). The singular powers remain uniformly greater than one, and division by sqrt(h_j) again cancels the lambda-dependent power. Consequently

    |psi_j^(lambda)(t)| <= C_(R,b,lambda)(j+2)^(-1/2+b/2),
    sum_(j=0)^n |psi_j^(lambda)(t)|² <= C_(R,b,lambda)N^b

on |Re t|<=R, |Im t|<=b. Combine this with (11) to obtain

    sup_(|Re t|<=R,|Im t|<=b)|q_n(t)|
       <= C_(R,b,lambda,a) N^(lambda-7/4+b/2)(log N)^(a/2). (12)

Thus an assumed O(n^(-s)) row tail produces the same normally convergent strip-analytic representative whenever

    s > lambda-3/4+b/2.                                (13)

For any fixed s>5/4, let epsilon=s-5/4>0. Choose delta>0 with delta<epsilon/4, set lambda=2+delta, and choose a=1/2+delta. Then a is strictly between 1/2 and 2lambda-7/2=1/2+2delta. Choose any

    0<b<min(2(lambda-1),epsilon/2).

Now lambda-3/4+b/2=5/4+delta+b/2<5/4+epsilon=s, so (13) holds. The coefficient series converges normally with all derivatives on compact subsets of the resulting strip. Also s>5/4>1/2 ensures its coefficients belong to l². Sections 4-6 therefore apply unchanged and yield the same contradiction.

This proves the promoted theorem for every s>5/4, including the parity version. The parameters and constants can depend on the particular s, but remain fixed throughout its contradiction argument; no uniform estimate as lambda approaches 2 or a approaches 1/2 is claimed or needed. In particular, this limiting choice does not establish an endpoint statement at s=5/4.
