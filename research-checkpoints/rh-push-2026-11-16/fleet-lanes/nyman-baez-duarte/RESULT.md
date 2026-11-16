# Nyman-Beurling / Baez-Duarte in the half-plane Re s > sigma0 (slug: nyman-baez-duarte, 2026-11-16)

**Verdict: precise obstruction, with one proved theorem. The decay exponent of the weighted distance is exactly
sigma0 - Theta (Theta = sup Re rho). The loop "ZF(theta) -> rate -> ZF(theta')" is the identity map theta -> theta.
RH open; no zero-free region changes. NO QED.**

Labels: PROVED (argument written here, same-agent check only), CLASSICAL, MEASURED (scripts in this directory),
ESTIMATE (Stirling-level size, constants not bounded), OPEN. Literature was not searched; novelty of Theorem A/C is
unverified (Burnol 2002, Baez-Duarte-Balazard-Landreau-Saias 2000, de Roton, Delaunay-Fricain-Mosaki-Robert are the
places to check).

## 0. Plan; relation to atlas and walls

The atlas (PR #27) has no Nyman-Beurling section; the three rh-attempt syntheses and the `bootstrap` sibling do not
treat it. `bootstrap` proves neutrality f(theta)=theta for mollified moments, pointwise detectors and explicit-formula
tests; this note does the same for the Nyman-Beurling distance, and additionally proves the matching lower bound, so
the neutrality here is an equality of exponents, not a failure of one method.

Setup. Fix 1/2 < sigma0 < 1. For a = (a_1..a_N) in C^N put A_N(s) = sum_{n<=N} a_n n^{-s} and

    d_N(sigma0)^2 = inf_a (1/2pi) int_{Re s = sigma0} |1 - zeta(s) A_N(s)|^2 |ds| / |s|^2 .

CLASSICAL (Mellin-Plancherel, Titchmarsh (2.1.5)): this is the squared distance in L^2((0,inf), x^{2 sigma0 - 1} dx)
from chi_(0,1) to span{ {1/(n x)} : n <= N }, since int_0^inf {1/(nx)} x^{s-1} dx = -n^{-s} zeta(s)/s for 0<Re s<1.
sigma0 = 1/2 is the Baez-Duarte form of Nyman-Beurling.

## 1. Results

Write F_n(s) = zeta(s) n^{-s}/s, and for K in L^2(Re s = sigma0) let L_K(F) = (1/2pi) int F(sigma0+it) K(sigma0+it) dt.
If L_K(F_n) = 0 for n <= N then L_K((1 - zeta A_N)/s) = L_K(1/s) for every a, and Cauchy-Schwarz gives

    d_N(sigma0) >= sqrt(2 pi) |L_K(1/s)| / ||K||_2 .                                        (D)

**Theorem A (zeros to the left of sigma0; PROVED).** Let rho = beta + i gamma be a nontrivial zero with beta < sigma0.
Put r(s) = s^2 / ((s - rho)(s - 2)^3), k(s) = Gamma(s) cos(pi s/2) r(s), M = N/(2 pi), K(s) = M^s k(s). Then
(i) L_K(F_n) = 0 for every integer 1 <= n <= N;
(ii) L_K(1/s) = M^rho Gamma(rho) cos(pi rho/2) rho/(rho-2)^3 + E, |E| <= M^{-2}/15 for M >= 1;
(iii) hence for all N >= 7

    d_N(sigma0) >= sqrt(2 pi) ( |Gamma(rho) cos(pi rho/2) rho/(rho-2)^3| (N/2pi)^{beta} - (N/2pi)^{-2}/15 )
                   / ( (N/2pi)^{sigma0} ||k||_{L^2(Re s = sigma0)} )  =  c(rho,sigma0) N^{-(sigma0-beta)} (1 + O(N^{-2-beta})).

*Proof.* (i) The functional equation zeta(1-s) = 2 (2pi)^{-s} cos(pi s/2) Gamma(s) zeta(s) (CLASSICAL) gives
zeta(s) Gamma(s) cos(pi s/2) = (2pi)^s zeta(1-s)/2, so

    F_n(s) K(s) = (N/n)^s zeta(1-s) s / (2 (s-rho)(s-2)^3) =: H_n(s).

H_n is analytic in Re s <= sigma0: at s = rho the zero of zeta(1-s) (zeros are symmetric under s -> 1-s) cancels the
pole; at s = 0 the factor s cancels the pole of zeta(1-s); 2 > sigma0. In a strip sigma1 <= Re s <= sigma0,
zeta(1-s) << |t|^{1/2}, so H_n << |t|^{-5/2} and horizontal segments vanish. On Re s = sigma <= -1: |zeta(1-s)| <=
zeta(2), |(N/n)^s| <= 1 because n <= N, so int |H_n| << sigma^{-2} -> 0. Hence L_K(F_n) = (1/2 pi i) int_{(sigma0)} H_n = 0.
(ii) K(s)/s = M^s Gamma(s) cos(pi s/2) s/((s-rho)(s-2)^3) has poles in Re s < sigma0 only at rho and at s = -2k,
k >= 1 (s = 0 is cancelled by the factor s; at odd negative integers cos vanishes). On Re s = -(2k+1):
|Gamma(s) cos(pi s/2)| = pi / (2 |Gamma(1-s)| cosh(pi t/2)) <= pi/(sqrt2 (2k+1)!) using |Gamma(x+iy)|^2 >=
Gamma(x)^2 / cosh(pi y) (x >= 1/2), so the shifted integrals tend to 0. Residue at -2k:
M^{-2k} (-1)^k r(-2k) / ((2k)! (-2k)), and |r(-2k)| <= 1/(4k^2); the sum is <= M^{-2}/15 for M >= 1.
(iii) is (D) with ||K||_2 = M^{sigma0} ||k||_2; k in L^2 because |Gamma(s) cos(pi s/2)| ~ sqrt(pi/2)|t|^{sigma0-1/2}
and r << |t|^{-2}. ∎

Remarks. (a) The cutoff is sharp at n = N with M = N/(2pi) (MEASURED: `annih.out`, |L_K(F_n)| <= 2e-13 for n <= N,
1.4e-6 at n = N+1; formula (ii) matches quadrature to 7e-15). (b) The proof uses only the functional equation and
absolute convergence of zeta(1-s) for Re s < 0. No Euler product.

**Theorem A' (several zeros; PROVED).** With k_j built from zeros rho_j (beta_j < sigma0), G_jk = int k_j conj(k_k) dt,
v_j = L_{K_j}(1/s) as in (ii): d_N(sigma0) >= sqrt(2pi) (N/2pi)^{-sigma0} (v* G^{-1} v)^{1/2}. (Optimise (D) over
K = M^s sum c_j k_j.)

**Corollary A0 (unconditional; PROVED).** Zeros on the critical line exist, so for every 1/2 < sigma0 < 1:
d_N(sigma0) >= c(sigma0) N^{-(sigma0 - 1/2)} for N >= 7. This is the half-plane counterpart of the
Baez-Duarte-Balazard-Landreau-Saias / Burnol lower bound d_N^2 >> 1/log N at sigma0 = 1/2.

**Proposition R (zeros to the right; CLASSICAL direction, proof in this setup PROVED).** If zeta(rho) = 0 with
beta > sigma0, then d_N(sigma0) >= c(rho, sigma0) > 0 for all N. *Proof.* K(s) = (s-1)/((s-rho)(s+1)^2). F_n K is
analytic in Re s >= sigma0 (zeta(s)(s-1) entire, zero at rho), decays like |s|^{-3} n^{-Re s}, so shifting right gives
L_K(F_n) = 0 for all n >= 1; L_K(1/s) = -(rho-1)/(rho (rho+1)^2) != 0. Apply (D). ∎

**Theorem B (upper bound from a zero-free half-plane; PROVED from CLASSICAL inputs).** Assume zeta(s) != 0 for
Re s > theta, and theta < sigma0 < 1. Then d_N(sigma0) <<_{eps} N^{-(sigma0 - theta) + eps}.
*Proof.* Under the hypothesis, 1/zeta(s) <<_{delta,eps} (|t|+2)^eps for Re s >= theta + delta (CLASSICAL: Titchmarsh
14.2 with 1/2 replaced by theta; not re-derived). Take W smooth, W = 1 on [0,1/2], W = 0 on [1,inf), and
a_n = mu(n) W(n/N). Then A_N(s) = (1/2 pi i) int_{(c)} What(w) N^w / zeta(s+w) dw with What(w) = 1/w + entire, rapidly
decaying on vertical lines. Shifting to Re w = -(sigma0 - theta - delta): A_N(s) = 1/zeta(s) +
O(N^{-(sigma0-theta-delta)} (|t|+2)^eps) on Re s = sigma0. So |1 - zeta A_N| << |zeta(s)| N^{-(sigma0-theta-delta)}
(|t|+2)^eps and int |zeta(sigma0+it)|^2 (|t|+2)^{2 eps} dt/|s|^2 < inf by convexity. ∎

**Theorem C (exact exponent; PROVED).** Let Theta = sup Re rho. For 1/2 < sigma0 < 1, sigma0 != Theta:

    lim_{N->inf} log d_N(sigma0) / log N = - max(0, sigma0 - Theta).

*Proof.* sigma0 > Theta: Theorem B with theta = Theta, and Theorem A for zeros with beta > Theta - eps.
sigma0 < Theta: Proposition R and d_N <= ||1/s||. ∎ (sigma0 = Theta not treated; at Theta = 1/2 it is the classical
1/log N regime.)

**Corollary D (quantitative converse and the loop; PROVED).**
(1) If d_N(sigma0) << N^{-eta} along any sequence N -> inf, then zeta has no zeros in Re s > sigma0 - eta.
(2) If zeta has no zeros in Re s > theta, then d_N(sigma0) << N^{-(sigma0-theta)+eps} for every sigma0 in (theta,1).
(3) Composition: ZF(theta) -> rate sigma0 - theta - eps -> ZF(theta + eps). The map is f(theta) = theta for every
choice of sigma0. A rate better than sigma0 - theta at one sigma0 is equivalent to Theta < theta. There is no slack
in either direction, so no self-improving loop exists inside the criterion.
(4) With the 7/8 half-plane (openai/math, Lean-checked locally; not externally refereed): for 7/8 < sigma0 < 1,

    c N^{-(sigma0 - 1/2)} <= d_N(sigma0) <<_eps N^{-(sigma0 - 7/8) + eps}.

The upper bound is not explicit in its constant: it needs an explicit bound for 1/zeta on Re s >= 7/8 + delta, which
the 7/8 proof (a contradiction argument on the extremal abscissa) does not supply. Before the 7/8 theorem no decay of
d_N(sigma0) was known for any sigma0 < 1, because decay is equivalent to ZF(sigma0) (Prop. R + Thm B).

**Proposition E (finite-N reading; ESTIMATE).** Using r(s) = s^2/((s-rho)(s-rho-2)^3) in Theorem A and Stirling, a
zero at beta + i gamma with beta < sigma0 forces roughly

    d_N(sigma0) >~ sqrt(2 (sigma0 - beta)) gamma^{-1} (N gamma / 2pi)^{-(sigma0 - beta)} .

The critical-line zeros already force d_N ~ C0 N^{-(sigma0-1/2)} (MEASURED C0 ~ 0.105 at sigma0 = 0.75, 0.9). An
off-line zero at height gamma0 becomes visible in d_N only when N^{beta0-1/2} exceeds about gamma0^{1+sigma0-beta0},
i.e. N >~ gamma0^{(1+sigma0-beta0)/(beta0-1/2)}. For beta0 = 0.6, sigma0 = 0.75, gamma0 = 3e12 this is N ~ 1e143.
Finite computations of d_N restate verified height (wall 4).

## 2. Numerics (MEASURED; float64 + python-flint zeta, not interval-certified)

`annih.py` -> `annih.out`: Theorem A (i),(ii) at (sigma0,N) = (0.9,25), (0.75,10), rho = rho_1.
`dn.py` -> `dn_075.out`, `dn_090.out`, `dn_075_fine.out`, `dn_090_J300.out`: least-squares d_N on |t| <= T (Simpson),
tail |t| > T replaced by the mean value (1 - 2a_1 + zeta(2 sigma0) sum a_m a_n lcm(m,n)^{-2 sigma0})/(pi T);
T = 2500 and 5000 agree to 5 digits. LB_J = Theorem A' with the first J zero pairs.

| sigma0 | N | d_N | d_N N^{sigma0-1/2} | LB (1 pair) | LB (J pairs) | d_N / LB_J |
|---|---|---|---|---|---|---|
| 0.75 | 16 | 0.062276 | 0.1246 | 0.027678 | 0.048506 (J=100) | 1.284 |
| 0.75 | 64 | 0.039507 | 0.1117 | 0.019545 | 0.034526 | 1.144 |
| 0.75 | 256 | 0.025966 | 0.1039 | 0.014229 | 0.024021 | 1.081 |
| 0.75 | 512 | 0.022164 | 0.1054 | 0.012113 | 0.020730 | 1.069 |
| 0.90 | 128 | 0.015781 | 0.1099 | 0.008971 | 0.015181 (J=300) | 1.039 |
| 0.90 | 256 | 0.011427 | 0.1050 | 0.006944 | 0.011105 | 1.029 |
| 0.90 | 512 | 0.009055 | 0.1098 | 0.005337 | 0.008847 | 1.023 |

d_N stays above the bound in every row, and the ratio approaches 1 as N and J grow. (A first run with G transposed
in A' gave ratio 0.991 at one point; that was a coding error in the bound, corrected, not a property of d_N.)
OPEN (suggested by the table): d_N(sigma0) N^{sigma0 - Theta} equals, asymptotically, the supremum in A' over all
zeros on Re s = Theta, an almost periodic function of log N. This would be a half-plane form of Burnol's bound with
equality. It is a statement about the zeros that exist and gives no information on where they are.

## 3. DH control and where the Euler product enters

* Theorem A, A', Prop. R use: the functional equation, absolute convergence in Re s > 1, zeta(s)(s-1) entire. All hold
  for Davenport-Heilbronn (functional equation with conductor 5; the cutoff M changes by a constant). DH has zeros
  with Re > sigma0 for every sigma0 <= 1, so Prop. R gives d_N^{DH}(sigma0) >= c > 0. (Argument only; not run.)
* Theorem B uses ZF(theta) and polynomial growth. It never uses Lambda(n) >= 0 or multiplicativity; mu(n) appears
  only as the coefficient sequence of 1/zeta.
* So the criterion is Euler-blind in both directions. The Euler product enters only through the hypothesis ZF(theta),
  i.e. through whatever proves the zero-free half-plane (here: the 7/8 theorem and its cubic/sextic input, TRO6).
  The arguments do not fail for DH; they return the correct, different answer for DH (exponent 0).
* Flow-blindness, MV-CAP: not touched; nothing here is a route to RH. Verified height: Prop. E.

## 4. What this closes

"Prove a rate for the half-plane Nyman-Beurling distance and convert it into a better theta" is closed: by Theorem C
the rate exponent is the function sigma0 - Theta, so proving any rate beyond the one the current theta gives is the
same statement as lowering theta. Do not re-attempt variants that only change the weight (|s|^{-2} -> other
polynomial weights), the dilation set, or the mollifier shape: (D) with the same K, and Theorem B, go through
unchanged.

Not pivoted: the angle did not die without output, and the adjacent idea (the equality in section 2) is zero-blind.

## 5. Three weakest steps

1. Theorem B rests on the classical bound 1/zeta(s) << t^eps in Re s >= theta + delta under ZF(theta), cited and not
   re-derived; and (4) of Corollary D inherits the status of the 7/8 theorem (Lean-checked locally, unrefereed).
2. Novelty not checked against the literature. The lower-bound mechanism (annihilating functional from the
   functional equation with sharp cutoff N/2pi) may be known in Burnol's or de Roton's work in another form.
3. Numerics are float64 with a mean-value tail model, not interval arithmetic; Prop. E's constant is Stirling-level;
   Theorem C omits sigma0 = Theta; all proofs have same-agent checking only.
