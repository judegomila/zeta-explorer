# r3-tnr-control: the T-NR twin run against the 7/8 argument

Internal working note, 2026-11-16. Slug `r3-tnr-control`. Not refereed. Nothing committed or pushed.
Everything about the 7/8 argument is relative to the unrefereed openai/math manuscript
(`~/lean-deps/qrh-verify/paper.txt`; section, lemma and equation numbers below are the manuscript's).
No abscissa is claimed. RH is open. NO QED.

Labels: PROVED (complete argument here) / EXACT (algebra on formulas quoted from the manuscript, checked by sympy) /
CLASSICAL / MEASURED / ARGUED (reasoned from the manuscript's structure, not replayed line by line) / OPEN.

## Verdict

1. The twin exists and behaves as described: Euler product, functional equation, pole at 1, off-line zeros
   (MEASURED to 1e-30; 10 zeros with real part 0.90375 > 7/8 below height 60 for q = 3, c = 2.2).
2. The 7/8 argument fails for the twin at one identifiable place, and only there: **the size condition
   |eta(p)| = 1 on the local factor**. It is used in two sentences: Section 2, "each displayed factor is nonzero
   for Re s > 0" (deletion of Euler factors), and the proof of Lemma 7.1, "|R| < 1, |V| < 1, |D| < 1, uniformly
   away from one". Run with the twin's data the argument returns "no zeros in Re s > max(7/8, beta_twin)", which is
   true (Proposition T).
3. That step is local and is not where the argument is tight. The twin is zeta times one bad local factor, so it
   passes every global step exactly as zeta does. **T-NR is not a stronger control than Davenport-Heilbronn for
   this mechanism; it tests a different axiom.** DH fails at the scalar Euler identity (7.13); the sign twist fails
   at the theta reflection (Prop 5.1) and the Hecke reflection (Sections 17-18); T-NR fails at the local size
   condition.
4. At that step the manuscript does use a bound at each prime where an identity across primes exists:
   the product of the factors 1/(1 - R) over primes is a Hecke L-function. **The principal normalizer is
   H_eta(s) = L^S(6s - 3, (lambda eta)^6) E_eta(s)**, lambda(p) = p/|p| on primary generators, with E_eta
   absolutely convergent in Re s > 1/2 (EXACT + MEASURED). Consequences: hypothesis (2.2) can be proved by
   absolute values only for Re s > 2/3; the normalizer has zeros at s = 7/12 + i gamma'/6 (first:
   0.58333 + 1.08503i for eta = 1). This does not bind at 0.8749 or at the low floor 13/15. It is a requirement
   that appears once the architecture is pushed below 2/3. It moves no abscissa today.

Classification: precise obstruction (to the use of T-NR as a locator of the binding arithmetic) plus one exact
identity for the normalizer.

## 0. Plan; what differs from the closed lanes

* CRITIC_R1 lists "T-NR twin not applied as a control anywhere". bypass-78 Section 7 lists the steps of the base
  method that use the Euler product (multiplicativity). It does not list where local size is used. This note does.
* Not repeated: the price list (bypass-78), the count lever (zf-hecke-all-fields, r2-zf-critical-density), TRO6
  (r2-tro6-*), higher rows, large values. Nothing here is a count saving or a Gram saving.
* New: (a) the twin family and its numerics; (b) Proposition T (exact failure amounts in (2.4), (2.5));
  (c) a three-control map onto manuscript steps; (d) the closed form of the local factor at the principal residue
  and the Hecke L-function inside the normalizer; no lane or campaign note mentions it (grep over
  `push/*/RESULT.md` and `formalization/paper/*.md`).

## 1. Construction (PROVED elementary; MEASURED, `twin.py`, `twin.json`)

Fix a prime q and real c with 2 < |c| < q^{1/2} + q^{-1/2}. Put
D(s) = 1 + c q^{1/2-s} + q^{1-2s} = (1 - alpha q^{-s})(1 - beta q^{-s}), alpha beta = q, alpha + beta = -c q^{1/2},
|alpha| = q^{1/2+delta0}, delta0 = arccosh(|c|/2)/log q, and F(s) = zeta(s) D(s).

* Euler product: the factor at q is D(s)/(1 - q^{-s}); all others are zeta's. Coefficients:
  a_F(q) = 1 + c q^{1/2}, a_F(q^k) = 1 + c q^{1/2} + q for k >= 2. **The coefficients of F are bounded on powers
  of q; the coefficients of 1/F are not**: 1/D = sum d_k q^{-ks}, d_k = (alpha^{k+1} - beta^{k+1})/(alpha - beta),
  |d_k| ~ q^{k(1/2+delta0)}.
* Functional equation: q^{s-1/2} D(s) = 2 cosh((s - 1/2) log q) + c, so q^s pi^{-s/2} Gamma(s/2) F(s) is invariant
  under s -> 1 - s (conductor q^2). Pole at s = 1 only.
* Zeros of D: Re s = 1/2 +- delta0, heights pi(2k+1)/log q (c > 0) or 2 pi k/log q (c < 0).
* Lambda_F(q^k) = (1 - alpha^k - beta^k) log q: sign changes and growth q^{k(1/2+delta0)}.
* Twisted family (needed because the 7/8 argument works with a family closed under sextic twists):
  F_psi(s) = L(s, psi) (1 - alpha psi(q) q^{-s})(1 - beta psi(q) q^{-s}). Since
  D_psibar(1 - s) = psibar(q)^2 q^{2s-1} D_psi(s), each F_psi has a functional equation (root number multiplied by
  psi(q)^2), and off-line zeros with the same real part 1/2 + delta0 at shifted heights. For psi ramified at q the
  bad factor is absent. Over Q(sqrt(-3)) the same definition is used at one prime ideal.
* Laurent twin (b-euler-detector): zeta(s)(1 + e(p^{s-1/2} + p^{1/2-s})) has zeta's own functional equation
  (conductor 1) and loses integrality. Its inverse has the same structure (a geometric series in p^{-s} of ratio
  of modulus > p^{1/2}); everything in Sections 2-4 applies to it unchanged.

| q | c | Re zero | first zero | abs F there | FE relative defect | Lambda_F(q^k)/log q, k = 1..4 |
|---|---|---|---|---|---|---|
| 3 | 2.2 | 0.903753 | 0.903753 + 2.859601i | < 1e-30 | 2e-30 | 4.81, -7.52, 22.03, -53.59 |
| 2 | 2.1 | 0.954340 | 0.954340 + 4.532360i | 2e-31 | 2e-30 | 3.97, -3.82, 9.37, -14.23 |
| 5 | 2.5 | 0.930677 | 0.930677 + 1.951981i | 4e-32 | 5e-31 | 6.59, -20.25, 91.84, -400.56 |
| 3 | -2.2 | 0.903753 | 0.903753 + 5.719202i | 2e-31 | 8e-31 | -2.81, -7.52, -20.03, -53.59 |
| 7 | 3.0 | 0.994588 | 0.994588 + 1.614459i | 4e-32 | 8e-31 | 8.94, -48, 334.4, -2302 |

* Argument principle, q = 3, c = 2.2: zeros of F in Re s > 7/8, 0.5 < Im s < 60: 10.0000 (predicted 10).
* Twisted member, chi mod 7 of order 6, q = 3: zero at 0.903753 - 1.906401i, |F_chi| = 2e-32.
* Laurent twin p = 2, e = 0.2: FE defect 3e-31, zero at 2.760413 + 4.532360i.

Signal of the twin zeros (MEASURED). b(n) = coefficients of 1/F, M_F(x) = sum_{n <= x} b(n) = sum_k d_k M(x/q^k)
with M the Mertens function, x up to 2e7, against the residue sum over the 800 twin zeros nearest the axis:

| x | M(x)/x^{1/2} | M_F(x)/x^{0.90375} | residue prediction /x^{0.90375} |
|---|---|---|---|
| 1e4 | -0.230 | 1.1092 | 1.0979 |
| 1e5 | -0.152 | 1.8268 | 1.8136 |
| 1e6 | 0.212 | 1.7489 | 1.7526 |
| 5e6 | -0.317 | 1.6966 | 1.6968 |
| 1e7 | 0.328 | 0.1967 | 0.2050 |
| 2e7 | -0.213 | -1.4028 | -1.4052 |

At x = m 3^k with m small (jump points of M_F of size ~ x^{0.90375}) the truncated residue sum does not converge
to the measured value (three such samples in the json); elsewhere agreement is 0.1-1%. The local factor produces
the same Omega-signal x^{beta} in the inverse sums that a global zero at real part beta would.

## 2. The 7/8 argument against the twin, step by step

How the target enters the manuscript (read from Sections 2, 6, 7, 8, 10, 12, 16, 20):

| step | what it does | what it uses about the target eta | twin |
|---|---|---|---|
| S0. Section 2, deletion of S | pass from L to L^S | each factor 1 - eta(p)Np^{-s} nonzero in Re s > 0, i.e. abs(eta(p)) <= 1 | **fails if q is put in S**: the deleted factor D(s)/(1 - q^{-s}) vanishes at the twin zeros |
| S1. (6.1), (12.5) probe | linear in the weight A -> eta(A) on completed indices A = c n^3 | nothing | defined for any weight |
| S2. low side: (6.2), Prop 5.1, Prop 6.3, Prop 15.3 | reflection of the theta rows, Cauchy-Schwarz, large sieves | eta is a function on a finite ray class group (periodic), bounded by 1; multiplicativity not used | passes for a bounded weight; fails for the weight that produces 1/F (unbounded) |
| S3. Lemma 7.1, (7.10)-(7.13) | row series = zeta(6z) L(w, chi_u)/L(x, eta chi_u) times H_{eta,u} | eta(c n^3) = eta(p)^{e0+3l} prime by prime (complete multiplicativity); 1 - D from e0 in {0,1} and mu(c) (identity (4.7)); abs(R), abs(D) < 1 from abs(eta(p)) = 1 | **fails**: see below |
| S4. Sections 8-9, 17-19 detector, witnesses, counts | rows with a zero of a twist in a bin are few | zeros of the family <= beta*; inverse series has coefficients mu psi; Hecke functional equation of each twist; deleted-factor bounds (Lemma 4.10) need abs(psi(p)) = 1 | passes for the zeta part; the twin's own zeros never enter (they are not zeros of any L(s, eta chi_u)) |
| S5. Sections 10, 16, 20 contour moves, principal residue | isolate c_S f_eta, normalizer H_eta with sup abs(H - 1) <= 1/2 (10.2) | Lemma 7.1 regions | fails only through S3 |
| S6. Prop 2.1 last line | zero of L^S at rho contradicts continuation | "the deleted factors are nonzero there" | same as S0 |

There are exactly two ways to present the twin to the argument.

**Feeding (i): bounded weight.** Replace eta(A) by a_F(A) (bounded, multiplicative, equal to 1 off q). By
linearity and rescaling in the q-part of A the low side holds with the same exponent (ARGUED: a_F - 1 is supported
on multiples of q, split by v_q(A) = k, each piece is a probe at scale divided by a power of q^k with a bounded
weight; not replayed through Section 5). On the high side the local series (7.10) at q is a rational function with
the same denominators 1 - R, 1 - V, 1 - W, and the reciprocal that appears is prod_p (1 - a_F(p) Np^{-x}), not
1/F. The argument continues 1/zeta^{(q)} and says nothing about D. **In this feeding every step passes and the
conclusion is a true statement about zeta. The twin's zeros are invisible**: the probe reads the target through
squarefree c only (e0 in {0,1}), and the zeros of D live in the unbounded prime-power coefficients of 1/F.

**Feeding (ii): force 1/F into the signal.** For C(s) = s + c0 put
T[g](Z) = sum_{k >= 0} e_k q^{k c0} g(Z q^{-k}), where (1 - X)/((1 - alpha X)(1 - beta X)) = sum e_k X^k,
|e_k| ~ |alpha|^k = q^{k beta_F}, beta_F = 1/2 + delta0.

**Proposition T (PROVED).** Let (J, f) satisfy (2.3)-(2.5) for the target zeta with boundary sigma0, margins
omega, sigma, and f as in (2.3); extend J by J = f for Z below the threshold. Then:
(a) T[f] is the integral (2.3) with 1/L^S replaced by (1 - q^{-s})/(L^S(s) D(s)), i.e. the twin's signal f_F;
(b) |T[J](Z)| << Z^{C(max(sigma0 + omega, beta_F))} (times log Z at equality), and
    |T[J - f](Z)| << Z^{C(max(beta* - sigma, beta_F))};
(c) if zeta has no zeros in Re s >= beta_F - epsilon, then f_F(Z) = Z^{C(beta_F)} P(log Z) + O(Z^{C(beta_F) - epsilon'})
    with P a non-zero almost periodic function (period log q), so the exponents in (b) cannot be lowered.
Hence the hypotheses of Prop 2.1 for the twin hold exactly when sigma0 + omega >= beta_F, which contradicts
omega < Delta0 = beta* - sigma0 whenever beta* is taken as the supremum over the twin family (>= beta_F).
The argument returns "F has no zeros in Re s > max(sigma0, beta_F)": true.

Proof. (a) Z^{C(s)} q^{-ks} = q^{k c0} (Z q^{-k})^{C(s)}; the series converges absolutely on Re s = 2 because
|alpha| < q. (b) |T[J](Z)| <= sum_k |e_k| q^{k c0} (Z q^{-k})^{C(sigma0+omega)} = Z^{C(sigma0+omega)} sum_{q^k <= Z/Z0}
q^{k(beta_F - sigma0 - omega)} plus the range q^k > Z/Z0, where J = f has arbitrary power decay at 0 (Prop 2.1,
proof), giving O(Z^{C(beta_F)}). Same for J - f. (c) Move the contour in (a) to Re s = beta_F - epsilon; the poles
are the zeros of D, simple, at heights in an arithmetic progression; the residue sum is Z^{C(beta_F)} times a
Fourier series in log Z / log q with coefficients e^{(rho-5/6)^2} H(rho)/(zeta^S(rho) D'(rho)) != 0. QED

So the failure in feeding (ii) is in the **direct bound (2.4)**: a bounded-coefficient estimate is applied to a
weight whose q-part grows like q^{k beta_F}. The numerics of Section 1 are this statement for the model pair
(M, M_F): the input bound x^{1/2+eps} becomes x^{0.90375} after the transfer.

**The exact step.** Both feedings point to the same hypothesis: abs(eta(p)) = 1.
* Section 2: "Each displayed factor is nonzero for Re s > 0, so deleting finitely many factors neither creates nor
  removes a zero there."
* Lemma 7.1, proof: "In both stated regions |R| < 1, |V| < 1, and |D| < 1, uniformly away from one, so these are
  holomorphic local expressions", with R = a_p^2 Q^{4-6x-6z}, a_p = alpha(p)^3 eta(p)^3, D = eta(p) chi_p(u) Q^{-x}.
  With a local root of modulus q^{tau} in place of eta(q): |D| = q^{tau - x}, |R| = q^{4 - 6x - 6z + 6 tau}; the
  local factor acquires poles on Re x = tau and the Euler region shrinks to x > tau.
The cubic-row mean values, the Gram bound and the counts are not where the twin fails.

**Three controls, three steps (ARGUED from the table above).**

| control | Euler product | FE | local size | first step of the manuscript it violates |
|---|---|---|---|---|
| Davenport-Heilbronn | no | yes | n/a | Lemma 7.1 / (7.13): no prime-by-prime factorisation of (7.4), so no single reciprocal in the u = 1 row |
| sign twist eps(p) eta(p), Beurling | yes | no | yes | Prop 5.1 (weight not a ray class function: no theta reflection); Hecke reflection in Sections 17-18; Lemma 4.8 |
| T-NR, Laurent twin | yes | yes | no at q | Section 2 deletion sentence; Lemma 7.1 "abs(R), abs(D) < 1" |

The backward heat family is not formulable here (no Dirichlet series).

## 3. What property of zeta the step uses, and how much of it

(P1) The local reciprocal is a polynomial of degree 1 with a unit root: 1/zeta_p = 1 - p^{-s}. The probe produces
it from mu(c) on squarefree c through the Gauss sum identity (4.7), gamma_2(c) = mu(c) alpha(c) G(c)/gamma_1(c).
This is used as an identity. Nothing stronger is available at this point.

(P2) Complete multiplicativity with abs(eta(p)) = 1 on the cube part: eta(n^3) = eta(p)^{3l}. This gives the
geometric series in R in (7.11). The summation is exact. The control of 1/(1 - R) is by absolute value at each
prime.

**Proposition N (EXACT; sympy residual 0, `normalizer.py`).** For u = 1 and p outside S, from (7.11)-(7.12),
with V = Q^{-6z}, W = Q^{-w}, D = eta(p) Q^{-x}, R = a_p^2 Q^{4-6x-6z}:

  H_p (1 - R)(1 - D) = 1 - D + DW - VW + DV(1 - W)(1 + W - QW) - R[(1 - W)/Q + W^2 (1 - V)],

and at the principal residue point (w, z) = (1, 1/6), where R = a_p^2 Q^{3-6s}:

  **H_p(s, 1, 1/6) = (1 - Q^{-2}) (1 - Q^{-1}(R - D)/(1 - D)) / (1 - R).**

Since a_p^2 = (alpha(p) eta(p))^6 and alpha^6 is the frequency-6 angle character lambda^6 (defined on all ideals
prime to 3, conductor 1), the normalizer (10.1) is

  **H_eta(s) = L^S(6s - 3, (lambda eta)^6) E_eta(s),  E_eta(s) = prod_{p not in S} (1 - Q^{-2})(1 - Q^{-1}(R - D)/(1 - D)),**

and E_eta converges absolutely for Re s > 1/2 (largest term Q^{2 - 6 Re s}). For general (x, w, z) the same
extraction (u = 1 checked; other rows read off (7.11), ARGUED) replaces the good-prime condition x + z > 5/6 of region (7.14) by x + z > 2/3; the factor 1/(1 - R)
does not depend on the row u (rho^6 = 1), so every row series carries the same L^S(6x + 6z - 4, (lambda eta)^6).

Consequences.
* (PROVED given N) Absolute convergence of prod 1/(1 - R) at the residue point needs Re s > 2/3. So the manuscript's
  route to (2.2)/(10.2), absolute values at each prime, cannot be run below 2/3 for any choice of S. The
  manuscript states it for Re s > 7/8.
* (CLASSICAL) (lambda eta)^6 has infinite order, so L(., (lambda eta)^6) is entire, polynomially bounded in
  vertical strips, and has infinitely many zeros rho' with Re rho' >= 1/2. The normalizer vanishes at
  s = (3 + rho')/6, real part >= 7/12. For eta = 1 the L-function is that of the CM newform
  (1/6) sum z^6 q^{|z|^2} of weight 7, level 3 (coefficients 1, 0, -27, 64, 0, 0, -286, ...; root number +1,
  FE consistency 2e-31). MEASURED sign changes of its Hardy function up to height 22:
  gamma' = 6.5102, 10.6440, 12.4713, 15.6496, 16.9832, 19.1681, 21.1455, i.e. normalizer zeros at
  s = 7/12 + i(1.0850, 1.7740, 2.0785, 2.6083, 2.8305, 3.1947, 3.5243).
* (PROVED given N, variant of Prop 2.1) Without (2.2), the continuation gives H_eta/L^S holomorphic in
  Re s > beta* - epsilon. So below 2/3 the conclusion becomes: every zero rho of L(s, eta) in the region satisfies
  L(6 rho - 3, (lambda eta)^6) = 0 with at least the same multiplicity. A proof below 2/3 with this probe needs
  either a zero-free statement for the infinite-order characters (lambda eta)^6, which are not in the family
  (2.1), or an exclusion of common zeros.
* MEASURED (primes of norm 50..20000, eta = 1): at s = 0.62 + 2i the per-prime bound gives sum abs(R) = 6.19
  while log prod 1/(1 - R) = 0.100 - 0.049i; log prod E = -0.013 - 0.001i with sum abs(E_p - 1) = 0.026.
  The identity across primes carries a factor that the per-prime bound cannot see.

**Does it move a number?** No. At the critical scale d = h the z-exponent cancels (h = 1 - l_x + l is the scale
at which Z^{x+z-1} X^{1/2-z} Z^{l z} U^{-z}, with the slot factor Z^{l z} of (16.14), is independent of z), and the binding class of bypass-78 / Liu II sits there,
so a wider z-range for the correction does not change the endpoint inequality. All known binding inputs (Gram
bound at b > 0, reflected-energy range, numerator average K, counts R) are in steps S2 and S4, which the twin
passes. The first place the normalizer factor constrains the architecture is sigma0 = 2/3, below the low floor
13/15 of the present design.

**Strengthening proposal (OPEN, with the first computation above).**
1. Replace Lemma 7.1's absolute-value treatment of 1/(1 - R) by the exact factor L^S(6x + 6z - 4, (lambda eta)^6)
   and carry it as a third scalar L-function in (7.13). The Euler regions become x + z > 2/3 (good primes), and
   the normalizer condition becomes a lower bound for one entire L-function instead of an absolutely convergent
   product. This removes a constraint that will bind at 2/3; it gains nothing at 0.8749.
2. The twin analysis says where to look for unused zeta arithmetic: the steps where eta enters only as a bounded
   periodic weight (S2) or where the row character is treated as generic (S4). For the zeta target the numerator
   character chi_u and the denominator character eta chi_u coincide; no step uses this. This is the "hybrid
   target-row mean value" item of CRITIC_R1 Section 3. Not attempted here.

## 4. Controls required by the brief

* DH: fails at (7.13) (table above; same as bypass-78 Section 7).
* Backward heat: not formulable.
* Sign twist: fails at Prop 5.1 and the Hecke reflection (no functional equation for the rows).
* T-NR: fails at the local size condition; Proposition T gives the exact amount.
Nothing in this note is an argument for a zero-free region, so no new statement has to be tested against them.

## 5. Three weakest steps

1. Feeding (i), low side: "the low bound holds for the bounded twin weight with the same exponent" is ARGUED by
   linearity and rescaling. The manuscript's Prop 5.1 is stated for finite-ray characters with fixed excluded set S;
   the split by v_q(A) uses conductors q^{k+1} and was not replayed. If it failed, feeding (i) would fail at S2 too,
   which would not change the identification of the failing hypothesis (boundedness is satisfied; periodicity of
   fixed conductor is not).
2. The step table and the three-control map are read from the manuscript's structure (Sections 5, 8, 17-19 were
   skimmed, not checked line by line). "Passes for the zeta part" in S4 rests on the fact that feeding (i) leaves all
   L-functions in (7.13) genuine.
3. Proposition N uses (7.11)-(7.12) as printed (unrefereed, Lean-checked by its authors; the Lean statement of
   Lemma 7.1 was not opened here). The closed form was not checked against a direct summation of (7.10) with Gauss
   sums. The zero list of L(s, lambda^6) comes from sign changes on a grid of step 0.1 (zeros closer than that could
   be missed; none of the conclusions depend on the list). The claim "does not move a number" relies on bypass-78's
   description of the binding class at d = h.

## 6. Files

* `twin.py`, `twin.json`, `twin.log`: construction, FE, zeros, argument principle, twisted member, Laurent twin,
  inverse summatory function to 2e7 (mpmath + numpy, 2 min).
* `normalizer.py`, `normalizer.json`, `normalizer.log`: sympy check of Proposition N, CM L-function of weight 7
  level 3 (FE, root number, zeros), factorisation check over 2266 prime ideals (20 s).
