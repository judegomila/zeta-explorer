# Testing multiplicative cancellation without losing the centering

30 October 2026. This note continues PRIME_ARITHMETIC.md and cross-checks the arithmetic reduction in Jude Gomila's *Arithmetic and Spectral Routes Toward the Riemann Hypothesis*, version 7, sections 5.2–5.5 (PDF pages 13–15). The latest manuscript's title page, status summary, and those sections were read for this continuation; the rest of its spectral claims were not independently audited here.

**Outcome:** an exact centered Möbius-row representation is obtained, including its necessary tail. A specific row-by-row use of Möbius cancellation is quantified and found to be weaker than the direct consequence of its own input. No new power saving or zero-free region is established. No novelty is claimed for Vaughan's identity, Abel summation, or Dirichlet-series continuation.

## 1. Starting from the current reduction

Let h=log 2 and

\[
w_x(y)=y^{-1/2}(h-|\log(y/x)|)_+,
\quad c=8(\cosh(h/2)-1),
\quad c_1=8h\sinh(h/2)-32(\cosh(h/2)-1).
\]

The constants satisfy integral w_x(y)dy=c sqrt(x) and integral log(y)w_x(y)dy=sqrt(x)(c log(x)+c_1). For integer cutoffs U,V>=1 with UV<=x/2 and V<x/2, put

\[
\beta_V(d)=\sum_{r\mid d,\ r>V}\Lambda(r),\qquad
M(U)=\sum_{a\le U}\frac{\mu(a)}a,\quad
L(U)=\sum_{a\le U}\frac{\mu(a)\log a}a,\quad
A(V)=\sum_{r\le V}\frac{\Lambda(r)}r.
\]

The centered Vaughan term of the manuscript is

\[
J(x;U,V)=\sum_{a>U}\mu(a)\sum_{d>V}\beta_V(d)w_x(ad)
 +\sqrt{x}\{(c\log x+c_1-cA(V))M(U)-cL(U)-c\}.
\]

The corresponding triangular prime shell equals J+R, with

\[
R=O\big(x^{-3/2}U^2\log(2x)+x^{-3/2}U^2V^2\log(2V)\big).
\]

The paper gives explicit constants. Its familiar U=V=floor(x^(3/8)) choice makes R=O(log x). The remaining signed estimate is a bound on J, not separately on its two displayed components.

## 2. Center each row, retaining its infinite tail

Define

\[
H_{x,V}(a)=\sum_{d>V}\beta_V(d)w_x(ad),
\qquad
C_{x,V}(a)=\frac{\sqrt{x}}a\{c\log(x/a)+c_1-cA(V)\}.
\]

Then the exact representation is

\[
\boxed{J(x;U,V)=\lim_{\epsilon\downarrow0}
\sum_{a>U}\frac{\mu(a)}{a^\epsilon}
\big[H_{x,V}(a)-C_{x,V}(a)\big].}
\]

Proof. For epsilon>0 the continuum sum is absolutely convergent; H has finite support in a. The absolutely convergent Dirichlet series at 1+epsilon give

\[
\sum_{a\ge1}\mu(a)a^{-1-\epsilon}=1/\zeta(1+\epsilon)\longrightarrow0,
\]
\[
\sum_{a\ge1}\mu(a)\log(a)a^{-1-\epsilon}
=-\left(1/\zeta\right)'(1+\epsilon)\longrightarrow-1.
\]

These limits follow from the simple pole of zeta at 1. Subtract the finite a<=U sums and expand the continuum term. The limit is exactly sqrt(x){(c log x+c_1-cA(V))M(U)-cL(U)-c}, including the constant -c. This argument does not assume RH, a power bound for the Mertens function, or convergence of the unregularized tail.

The exact finite version is often more useful. For an integer K>=2x/V, define

\[
J_K=\sum_{U<a\le K}\mu(a)[H_{x,V}(a)-C_{x,V}(a)].
\]

Because H(a)=0 beyond K,

\[
\boxed{J=J_K+\sqrt{x}\{(c\log x+c_1-cA(V))M(K)-cL(K)-c\}.}
\]

This identity is purely finite algebra. Increasing K does not justify dropping its correction, and the individual centered terms need not be absolutely summable. The limiting representation exposes the cancellation but does not prove it.

## 3. Testing a natural Möbius input

To evaluate the strength of row-by-row estimation, assume hypothetically that, for some fixed 1/2<=theta<1 and m>=0,

\[
\mathcal M(y):=\sum_{a\le y}\mu(a)=O(y^\theta\log^m(2y)). \tag{H}
\]

This is an input for the test, not a theorem established here. In particular, a theta=7/8 example below is not a claim that the previously inspected zeta theorem supplies this exact Mertens bound.

For a fixed d, the a-support is contained in [x/(2d),2x/d]. On that interval the height and total variation of a -> w_x(ad) are O(x^(-1/2)). Summation by parts using (H), including a possible cutoff at U, gives

\[
\left|\sum_{a>U}\mu(a)w_x(ad)\right|
\ll x^{-1/2}(x/d)^\theta\log^m(2x).
\]

Since 0<=beta_V(d)<=log d and only d<=2x/U occur, summing these row bounds yields

\[
|I_4|\ll x^{1/2}U^{\theta-1}\log^{m+1}(2x).
\]

The centering must also be bounded. Under (H), ordinary convergence and Abel summation give

\[
M(U)=O(U^{\theta-1}\log^m(2U)),\qquad
L(U)+1=O(U^{\theta-1}\log^{m+1}(2U)).
\]

The limits 0 and -1 agree with the Dirichlet-series limits above. Together with A(V)=O(log^2(2V)), this bounds the centering by the same power of x, allowing additional logarithms. Therefore this particular separate-estimation route gives

\[
|J|\ll x^{1/2}U^{\theta-1}\log^{m+2}(2x).
\]

At U=V=floor(x^(3/8)), its response exponent is

\[
\alpha_{\rm balanced}=\frac12-\frac38(1-\theta).
\]

To beat 3/8 through this estimate one would require theta<2/3. But (H) with theta<2/3 already excludes zeta zeros in Re(s)>theta directly, much farther left than 7/8.

## 4. Optimizing the cutoffs does not rescue this estimate

For U approximately x^u and V approximately x^v, the obtained exponent, ignoring logarithms, is bounded by the maximum of

\[
\tfrac12-u(1-\theta),\qquad 2u+2v-\tfrac32.
\]

The first quadrature term has exponent 2u-3/2 and does not improve this maximum. Sending v down to zero and balancing the two exponents gives

\[
u=\frac2{3-\theta},\qquad
\alpha_* = \frac{3\theta-1}{2(3-\theta)}.
\]

If one insists on fixed positive v this is an infimum. Taking V=1 is admissible for large x and gives the same exponent using the first quadrature remainder; the second vanishes because Lambda(1)=0. Thus this is also achieved by the bound scheme with a fixed V.

The direct consequence of (H) is zero-freeness for Re(s)>theta: the Dirichlet series for 1/zeta converges and is holomorphic in that half-plane, and its product with zeta continues the identity 1. In response coordinates that is the edge alpha_direct=theta-1/2. The optimized row estimate loses

\[
\boxed{\alpha_*-(\theta-\tfrac12)=\frac{(1-\theta)^2}{3-\theta}>0.}
\]

| Hypothetical theta | Balanced response exponent | Optimized response exponent | Direct response edge |
|---:|---:|---:|---:|
| 1/2 | 5/16 | 1/10 | 0 |
| 2/3 | 3/8 | 3/14 | 1/6 |
| 7/8 | 29/64 | 13/34 | 3/8 |

For theta=7/8, the optimized zero-free boundary obtained through these estimates is 1/2+13/34=15/17, about 0.882353, whereas the direct boundary is 7/8=0.875. The gap is 1/136. This is a calculation about the stated upper-bound method, not an impossibility theorem for Vaughan's identity or for more refined bilinear methods.

## 5. Finite diagnostics: the tail can change the sign

`mobius_centering_probe.py` builds mu and Lambda independently by a sieve and tests the finite identities at x=256, 1024, 4096, 16384, 65536. It computes the original prime shell separately and checks its difference from J against the manuscript's explicit quadrature bound. These are floating-point diagnostics, not interval certificates or evidence for an infinite estimate. The exponent comparisons use exact rational arithmetic.

At x=65536, U=V=64:

- I_4 approximately -6.809744783;
- centering approximately +6.759309221;
- J approximately -0.050435562.

With K=2048 the centered partial sum is approximately +0.007973206, while the required correction is approximately -0.058408768. Omitting it reverses the sign. With K=8192 the partial sum is approximately +0.480860873 and the correction approximately -0.531296435. More rows do not automatically make the omitted term negligible at these scales. The 15 finite centering identities agreed within 2.2e-14 in this run.

## 6. Consequence for the research plan

The new identity preserves the interaction that separate estimates destroy. It leaves a well-defined candidate for further study: a one-sided bound on the jointly centered sum, with either its Abel limit or its exact finite tail correction retained. No such saving is established here.

A generic global Möbius bound followed by separate row estimates is not a useful way to improve the zero-free conclusion. A stronger continuation would need cancellation specific to the interaction between mu(a), beta_V(d), the product ad, and the centering. The test above prevents assuming an input that already contains a stronger zero-free result than the desired conclusion.

Classical background: Montgomery and Vaughan, *Multiplicative Number Theory II: Primes and Sieves*, section 17.1 and notes 17.5, https://personal.science.psu.edu/rcv4/Vol2/Vol2.pdf . The starting centered identity and quadrature constants are taken from the user's version-7 manuscript as identified above. The present note records the derivation and scope of this follow-up, not an independent audit of that entire manuscript.
