# Jensen-polynomial hyperbolicity for xi: what a zero-free half-plane and verified height give, and what blocks all d

Slug: jensen-hyperbolicity. Working note, 2026-11-16. Nothing committed or pushed. No RH claim, no new zero-free region,
no change to any Lambda bound. Labels: PROVED (argument given here), CLASSICAL, CONDITIONAL (on the unrefereed
half-plane Re s > 7/8), MEASURED (toy model, certified root isolation or 80-digit floating point), ARGUED (heuristic),
OPEN.

## 0. Plan

Target. Griffin-Ono-Rolen-Zagier (GORZ): with F(w) = sum_k gamma(k) w^k / k!, F(z^2) = C xi(1/2 + z), C > 0, the Jensen
polynomials J^{d,n}(X) = sum_{j=0}^d binom(d,j) gamma(n+j) X^j are hyperbolic for n >= N(d); RH holds iff all J^{d,n}
are hyperbolic (Polya-Jensen). Questions: (i) how large a range of d is covered for every n by {zero-free half-plane,
verified height}; (ii) is there an argument uniform in d through the heat-flow reading; (iii) which step would need the
Euler product.

New relative to the atlas and the walls. The atlas (PR 27) has no Jensen-polynomial route; its sections 5 and 12 cover
theta collisions and Newman Lambda. The 2026-11-01 syntheses do not use Jensen polynomials. What is added here: an
explicit all-n degree range with the half-plane constant, a dictionary d <-> heat time 1/(2d) in the coordinate
log(-w), and a description of the n-direction as a depth descent of 2/log(gamma/2pi) per derivative. Overlap: the
conclusion is the verified-height wall and the flow-blindness wall in Jensen coordinates.

## 1. Setup (CLASSICAL)

* gamma(k) > 0 (even moments of a positive kernel). F is real entire of order 1/2, genus 0, F(0) > 0.
* Zeros of F: w_rho = (rho - 1/2)^2. For rho = 1/2 + b + i g: w = b^2 - g^2 + 2 i b g. On-line zeros give w = -g^2 < 0.
* P_{d,n}(x) := x^d J^{d,n}(1/x) = F^{(n)}(D) x^d, D = d/dx. J^{d,n} is hyperbolic iff P_{d,n} is.
* P_{d-1,n} = P_{d,n}'/d and d/dX J^{d,n} = d J^{d-1,n+1}. So hyperbolicity at (d,n) gives it at (d-1,n) and at
  (d-1,n+1). For fixed n the hyperbolic degrees form an initial segment 1..d*(n).
* All d at fixed n: J^{d,n} hyperbolic for every d iff F^{(n)} is in the Laguerre-Polya class (all zeros real).

## 2. Theorem A: an all-n degree range (PROVED given its hypotheses)

**Theorem A.** Let G be a real entire function of genus 0 with G^{(n)}(0) != 0 for all n, real zeros all negative, and
every nonreal zero c satisfying Re c < 0 and |Im c| <= |c| / sqrt(d). Then G^{(n)}(D) x^m is hyperbolic for every
n >= 0 and every m <= d.

**Corollary A (xi).** Suppose every zero of zeta with |Im rho| < T has Re rho = 1/2 and every zero has
|Re rho - 1/2| <= a (0 < a <= 1/2). Then J^{d,n} is hyperbolic for all n >= 0 and all

    1 <= d <= D(T,a) := ( T/(2a) + a/(2T) )^2.

Numbers, T = 3,000,175,332,800 (Platt-Trudgian):

| input | a | D(T,a) | status |
|---|---|---|---|
| critical strip only | 1/2 | 9.00105e24 | unconditional given T. This is the T^2 range of Chasse's criterion (literature figure recalled, not re-read) |
| Re s > 7/8 zero-free | 3/8 | 1.60019e25 | CONDITIONAL |
| Re s > 0.874887 zero-free | 0.374887 | 1.60115e25 | CONDITIONAL (follow-up preprints) |

The half-plane enters only through the factor 1/(4a^2): 16/9 at a = 3/8. Without verified height (T = first zero
14.1347) the half-plane gives d <= 355.

Proof.

Lemma 1 (pair factor). Let c be nonreal with sin^2(arg c) <= 1/d and Q(D) = (1 - D/c)(1 - D/conj c). Then Q(D) maps
hyperbolic polynomials of degree m <= d to hyperbolic polynomials of degree m.
G_m(u) := Q(D) u^m = u^{m-2} [ u^2 - 2 m Re(1/c) u + m(m-1)/|c|^2 ]. With phi = arg c, the bracket has discriminant
(4m/|c|^2)(1 - m sin^2 phi) >= 0 for m <= d, so G_m is hyperbolic. For p(x) = prod (x - r_i) with r_i real and a fixed
x0 with Im x0 > 0, the value (Q(D)p)(x0) is a symmetric multi-affine function of (r_1..r_m), because
p^{(k)}(x0) = k! e_{m-k}(x0 - r_1, .., x0 - r_m). The r_i lie in the open convex half-plane {Im < Im x0}.
Grace-Walsh-Szego (CLASSICAL) gives zeta0 in that half-plane with (Q(D)p)(x0) = G_m(x0 - zeta0), and
Im(x0 - zeta0) > 0, so the value is nonzero. Q(D)p has real coefficients and degree m, so all its zeros are real.

Lemma 2 (real factor, Hermite-Poulain, CLASSICAL). For real r != 0, (1 - D/r) p = -(1/r) e^{rx} (e^{-rx} p)' is
hyperbolic when p is.

Lemma 3 (product). For G of genus 0 with G(0) != 0, G(D) x^m is the coefficientwise limit of
G(0) prod_{k<=N} (1 - D/c_k) x^m (conjugate zeros grouped). The limit has degree m, so by Hurwitz it is hyperbolic if
every partial product is.

Lemma 4 (Gauss-Lucas, genus 0, CLASSICAL). G'/G = sum 1/(w - c_k) converges, so zeros of G' lie in the closed convex
hull of the zeros of G. G' is again real of genus 0.

The set S_d = {Re w <= 0, |Im w| <= |w|/sqrt(d)} is a closed convex cone for d >= 2. All zeros of G lie in S_d, so by
Lemma 4 all zeros of every G^{(n)} lie in S_d \ {0}. Lemmas 1-3 applied to G^{(n)} give the theorem (d = 1 is trivial).
For the corollary: sin(arg w_rho) = 2|b|g/(b^2+g^2) <= 2aT/(a^2+T^2) for |b| <= a, g >= T, since t -> 2t/(1+t^2)
increases on [0,1]. QED (Theorem A; Corollary A is conditional on its stated zero hypotheses.)

Exactness of Lemma 1: for a single pair acting on x^d the condition sin^2(arg c) <= 1/d is necessary and sufficient.
With real zeros present the true threshold is larger by a bounded factor (section 5: 1.6 to 4.5 in the toy).

## 3. Euler-product audit and DH control

* Theorem A uses no arithmetic. It applies to the Davenport-Heilbronn completion with its own zero set: J^{d,n}_DH is
  hyperbolic for all n and all d <= inf over off-line zeros of ((b^2+g^2)/(2bg))^2. For the lowest known off-line DH
  zero 0.808517 + 85.699348 i the pair bound is about 19,290 (illustrative; the infimum over all DH zeros was not computed).
* The GORZ large-n theorem needs only the asymptotic expansion of gamma(n); the same expansion holds for kernels whose
  leading theta term is nonzero, which includes DH (ARGUED, following Farmer's objection; not re-derived here). So
  "hyperbolic for n >= N(d)" at fixed d is true for DH as well and carries no Euler-product content.
* The only place the Euler product enters Corollary A is the hypothesis a < 1/2 (the 7/8 half-plane). Its effect is
  the constant 1/(4a^2). To cover all d from Theorem A one needs a(g) -> 0 pointwise at every height, which is RH.
* DH fails nothing in sections 1-2; it fails only the hypothesis "all d", as it must.

## 4. Heat-flow reading and why no argument uniform in d exists at this level

Degree = inverse heat time (ARGUED, exact at the pair level). J^{d,0}(w/d) = sum_k gamma(k) [prod_{j<k}(1 - j/d)]
w^k/k!. The multiplier is exp(-k(k-1)/(2d) + O(k^3/d^2)). With theta = w d/dw = d/dv, v = log(-w), this is
exp(-(theta^2 - theta)/(2d)) F: a de Bruijn-direction heat flow of time t = 1/(2d) in the coordinate v, composed with
a translation. An off-line zero has Im v = 2 arctan(b/g). De Bruijn's strip bound (real once 2t >= (Im v)^2) reads
d <= 1/(Im v)^2, about g^2/(4b^2), which is Lemma 1 to leading order. So:

* "J^{d,n} hyperbolic for d <= D" is the Jensen-coordinate form of "Lambda <= t" with t = 1/(2D): a positive-time
  statement obtained from verified height. D = 1.6e25 is the counterpart of Lambda <= 0.2.
* "All d" is the limit t -> 0+. Every finite-d statement is an open condition on finitely many gamma(k) (when the
  roots are simple) and is stable under small backward flow. This is the flow-blindness wall: no hypothesis of this
  type yields the limit.

The n-direction (ARGUED + MEASURED in a toy). F^{(n)}(z^2) = ((1/2z) d/dz)^n xi(1/2+z). At a zero w of G' off the
real axis, sum_k 1/(w - c_k) = 0. If an isolated off-line pair at depth b sits in a sea of on-line zeros of z-spacing
delta, with b >> delta, the on-line zeros contribute -i pi/delta_w and the nearest zero contributes 1/(w - c), so the
zero of G' sits delta/pi closer to the line than c. Each w-derivative lowers the depth by about delta/pi; once the
depth is below about 0.45 delta the pair becomes real. With delta = 2 pi / log(g/2pi):

    depth after n derivatives  ~  b - 2n / log(g/2pi).

Consequences under this law:
* F^{(n)} has only real zeros below height T_n ~ 2 pi exp(2n/a). At a = 3/8 and T = 3.0e12 nothing is gained before
  n ~ (a/2) log(T/2pi) = 5.04.
* An adversarial zero set consistent with {half-plane a, verified height T} gives N_adv(d) ~ (a/4) log d for
  d > D(T,a). The worst case for the Jensen ladder is logarithmic in d, not exponential.
* "J^{d,n} hyperbolic for all d" at one fixed n >= 1 is the statement that every zero satisfies
  |Re rho - 1/2| <~ 2n / log(g/2pi). That is stronger than any known zero-free region and than the quasi-Riemann
  hypothesis for every theta > 1/2. It is weaker than RH: in the toy, G' is in Laguerre-Polya while G is not.
* A proof of the descent law for xi needs, around every candidate off-line zero, control of the local zero
  configuration in windows of length O(1) (number of on-line zeros and absence of rows of off-line zeros). Density
  theorems give this on average only. This is the MV-CAP wall. The Euler product could enter here through zero-density
  estimates (which fail for DH), and it still would not give every window.

## 5. Toy measurements (MEASURED)

Model: G(w) = cosh(sqrt w) (1 - w/W)(1 - w/conj W), W = (beta + i Gamma)^2. The zeros of cosh(sqrt w) are
-((k+1/2) pi)^2 (z-spacing pi, all on the line); one off-line quartet is planted at depth beta, height Gamma.
Scripts: toy_zero_track.py (80-digit mpmath continuation of the off-line zero of G^{(n)}), toy_jensen.py (exact
rational gamma(k), Arb-certified root isolation, bisection on d). Log: toy_jensen.log.

Depth of the continued zero of G^{(n)}, Gamma = 31.4 (predicted loss per derivative: spacing/pi = 1):

| beta | depth at n = 1, 2, 3, ... | first n with real zero |
|---|---|---|
| 1 | - | 1 |
| 2 | 1.12, 0.67 | 3 |
| 4 | 3.12, 2.27, 1.19, 0.71 | 5 |
| 6 | 5.09, 4.17, 3.24, 2.35, 1.27, 0.68 | 7 |
| 8 | 7.07, 6.13, 5.18, 4.24, 3.28, 2.36, 1.45, 0.32 | 9 |

Mean loss 0.92 to 0.95 per derivative while depth > 1.5. The first real n is the same at Gamma = 100.5 (3, 5, 9 for
beta = 2, 4, 8): the descent depends on depth/spacing, not on height.

Jensen thresholds d*(n) (largest hyperbolic degree) against the Theorem A bound D0 = (|W|/Im W)^2:

| Gamma | beta | D0 | d*(0) | d*(1) | d*(2) | d*(3) | d*(4) | d*(5) | d*(6) | first n with real zero (tracking) |
|---|---|---|---|---|---|---|---|---|---|---|
| 15.7 | 1 | 62.1 | 100 | >=200 | >=200 | >=200 | >=200 | >=200 | >=200 | 1 |
| 15.7 | 2 | 15.9 | 40 | 114 | 164 | >=200 | >=200 | >=200 | >=200 | 3 |
| 15.7 | 4 | 4.4 | 18 | 31 | 30 | 139 | 144 | >=200 | >=200 | 5 |
| 15.7 | 6 | 2.3 | 13 | 16 | 16 | 26 | 27 | 60 | >=200 | 7 (at Gamma = 31.4) |
| 31.4 | 4 | 15.9 | 71 | 121 | 123 | >=200 | >=200 | >=200 | - | 5 |

">=200" means hyperbolic at the degree cap 200; it is not a statement about all d. Readings:
* d*(n) >= D0 in every cell, as Theorem A requires; d*(0)/D0 runs from 1.6 to 5.8, so the cone bound loses a bounded
  factor.
* d*(n) stays finite while the planted pair is still off the line and rises as the pair descends. For beta = 6 it
  reaches the cap at n = 6, one step before the tracked zero is real at Gamma = 31.4 (tracking was not run at
  Gamma = 15.7); at the cap the test cannot separate "real" from "close to real".
* d*(n) scales like Gamma^2 at fixed beta and n (71 against 18 at n = 0; 121 against 31 at n = 1), the dictionary
  d ~ (height/depth)^2.
* d*(n+1) >= d*(n) - 1 holds in every row (30 after 31), as section 1 requires.

## 6. Verdict

Precise obstruction, with one proved explicit statement.

* PROVED (Theorem A): explicit all-n hyperbolicity range from a cone condition on zeros. CONDITIONAL corollary:
  d <= 1.60e25 for all n >= 0 with the 7/8 half-plane (9.00e24 without it). The half-plane contributes the constant
  16/9 and nothing else.
* For d above D(T,a) the inputs {half-plane, verified height} cannot give hyperbolicity for all n >= 1, or for any
  fixed n: the planted-pair toy shows d*(n) finite until the pair has descended (MEASURED), and the descent law puts
  the needed n at ~ (a/4) log d (ARGUED).
* All d is blocked by: (1) each finite (d,n) is a positive-heat-time statement, t = 1/(2d) (flow-blindness);
  (2) Theorem A and the GORZ limit hold for DH (Euler-blind); (3) improving N(d) past D(T,a) needs every-window local
  zero statistics (MV-CAP). The Jensen ladder restates verified height with the dictionary d ~ (T/2a)^2.
* No pivot was taken: the adjacent idea (prove the descent law for xi' using zero density) is recorded as OPEN in
  section 4; it would improve N(d) only and cannot reach all d.

## 7. Three weakest steps

1. The descent law (section 4) is a local electrostatic heuristic checked only in a uniform-spacing toy with one
   planted quartet. Clusters or rows of off-line zeros behave differently (two parallel rows collapse in one
   derivative). N_adv(d) ~ (a/4) log d is not proved in either direction.
2. The statements that GORZ / Griffin-Ono-Rolen-Thorner-Tripp-Wagner asymptotics apply to DH, and the literature
   figures (9e24, Chasse's T^2), were recalled and not re-derived or re-read. The DH Jensen polynomials were not
   computed (degree ~2e4 at ~1e5-bit precision was judged out of budget).
3. The heat-flow dictionary d = 1/(2t) replaces the falling-factorial multiplier by a Gaussian and ignores the
   2 pi i periodicity in v. It is exact only at the single-pair level (Lemma 1). Corollary A at a < 1/2 depends on the
   unrefereed 7/8 half-plane.
