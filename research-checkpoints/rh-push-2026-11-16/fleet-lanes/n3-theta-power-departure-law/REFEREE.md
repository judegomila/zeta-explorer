# REFEREE: n3-theta-power-departure-law

Date 2026-11-17. Adversarial referee (general). All referee runs local, single process, through `scripts/memcap.sh 8`, longest 3 min 56 s. No ssh. Referee scripts were kept outside the repo (/tmp/ref_n3: `alg.py`, `ev.py`, `t1.py`, `t2.py`); only this file was written here.

## Verdict

holds = TRUE for the claimed verdict (precise-obstruction: the family is a control with off-line zeros arbitrarily close to w = 1 as height grows; no lever). Every PROVED step was re-derived and confirmed; the measured window edges were reproduced by an independent code, including the two edges at height 2000 that the author had only in double precision.

Main defect: attribution. The family, the Euler-product set, the pairwise-departure mechanism and the w = 4, 8 observation are in Lagarias-Rains, "On a two-variable zeta function for number fields", Ann. Inst. Fourier 53 (2003), arXiv math/0104176. RESULT.md cites van der Geer-Schoof for Riemann-Roch only and labels A1 and B1 PROVED without saying they are known. Details in section 3.

## 1. PROVED steps, re-derived

| step | check | outcome |
|---|---|---|
| F1 (poles, FE, Dirichlet series) | by hand from theta(1/t) = sqrt(t) theta(t); Cauchy bound uses abs(theta(q)) <= theta(abs(q)) | confirmed |
| F3 (rotated contour) | re-derived: rotate the full ray for Re s > w, split at u = 1, apply the theta relation at z = e^{2 i delta} u^2. Gives Z = e^{i delta s}(J(s) - 1/s) + e^{i delta (s-w)}(Jb(w-s) - 1/(w-s)) | confirmed, matches F3 |
| recurrence n c(n) = sum 2(w j - (n-j)) c(n-j) | from theta f' = w theta' f | confirmed |
| A1: c(1)c(6) - c(2)c(3) = (8/45) w^3 (w-1)(w-2)(w-4)(w-8) | independent code: coefficients built from log of the Jacobi triple product and exp(w L) in sympy QQ[w], not from the author's recurrence or flint | confirmed exactly; gcd over the 8 coprime pairs = w^3 (w-1)(w-2)(w-4)(w-8) confirmed; derivative at w = 1 is -56/15 confirmed |
| A2: gcd of class-constant relations = w^3 (w-1)...(w-8) | same independent coefficients; p = 3 and p = 5, both Legendre classes; also with a different base element (second n in the class instead of the first) | confirmed in all 8 cases; extra factor (w-1) in the non-residue class confirmed. A single relation has a further degree-26 factor, so the gcd (not one relation) is needed; RESULT.md says gcd. p = 7 not re-run (needs coefficients to n = 1127) |
| A2 converse, w = 1..8 | by theory: w = 3, 5, 7 Eisenstein with eigenvalue 1 + p^(w-2) (4, 28, 244 at p = 3 agree); w = 6: (1 + chi p^2)^2 - chi p^2 = (chi + p^2)^2 - chi p^2 = p^4 + chi p^2 + 1 (73, 651, 2353 agree); w = 8: three oldform copies of E_4 | confirmed. The justification sentence "theta^w spans its space for w < 8" is true for Hecke's group G(2) but false on Gamma_0(4) (M_{5/2}, M_{7/2}, M_2, M_3 there have dimension 2); the conclusion survives because the cusp spaces vanish and the Eisenstein parts share T_{p^2} eigenvalues |
| F2, w = 4 | r_4(n) = 8 sum of d | n, 4 not | d gives 8(1 - 4^(1-s'))zeta(s')zeta(s'-1); zeros of 1 - 4^(1-s/2) at s = 2 + 2 pi i k/ln 2, 44 below 400; 2 N(200) = 158; 44 + 158 = 202 | confirmed |
| B1 | Hurwitz plus the symmetry s -> w - conj(s) | confirmed, with one unstated input: zeros must not enter through the vertical sides. Supplied by dominance of the m = 1 term at Re s = w/2 + 4 near w = 1 (at w = 1 the remaining sum is 2(zeta(4.5) - 1) = 0.109 against 2), or by Lagarias-Rains Lemma 6.1. Uses RH and simplicity below T, as stated |
| B2 | first-order expansion F + (w-1) F_w = 0, double zero at the stationary point of F/F_w | confirmed as a first-order statement |
| 3.3 uniqueness (CLASSICAL) | Hecke: dim M(2, k, 1) = 1 + [k/4], theta^(2k) in it, lambda = 2 matches pi^(-s') Gamma(s') | consistent with the classical statement; k = w/2 < 4 gives dimension 1. Not checked against a printed source by the referee either |
| arithmetic of the window table | width x log(T/2 pi) = 0.697, 0.398, 0.225, 0.080; exponent log(0.2153/0.0139)/log(1517/58) = 0.84 | confirmed |

## 2. Numeric re-runs (different cases, independent code)

Referee evaluator: mpmath, theta by direct summation of exp(-pi n^2 z) (not the product), log theta by continuous unwrapping from u = infinity (not principal logs of the product factors), 40-point Gauss-Legendre, eps = 0.1, different panel rule. This also tests the author's branch claim in F3.

- w = 1 against pi^(-s/2) Gamma(s/2) zeta(s): relative error 1.5e-39 (tau = 30.5), 6.8e-37 (tau = 100.25) at 40 digits; 2.5e-59 (tau = 1282.6) and 8.6e-29 (tau = 1977.0) at 115 digits.
- Pair 75.70/77.14 (not a window edge; claimed critical w = 0.86511): sign changes of F on [74.2, 78.4]: 2 at w = 1, 0.87, 0.8653; 0 at w = 0.8649, 0.86. Confirmed.
- Pair 111.03/111.87 (claimed 0.91685): 2 sign changes at w = 0.92, 0.9170; 0 at 0.9167, 0.91. Confirmed.
- Off-line zero w = 0.90, s = w/2 + 0.15032652 + 111.33750195 i: abs(Z) = 2.2e-14 there against 4.9e-8 at 0.01 away (ratio 4.5e-7; the author states 1e-8, the difference is the 8-digit rounding of the zero). Confirmed.
- Height-2000 window edges. The author's 60-digit run stops at height 400; the windows at 1000 and 2000 rest on double precision alone. Referee run at 115 digits:
  - pair 1283.00/1283.34, tau in [1282.6, 1283.8], step 0.02: 2 sign changes at w = 1, 1.0080, 1.0087; 0 at w = 1.0089, 1.0095 (min abs(F)/max abs(F) rises 0.0020 -> 0.0087). Claimed edge 1.00876: confirmed.
  - pair 1977.17/1977.27, tau in [1977.0, 1977.45], step 0.01: 2 sign changes at w = 1, 0.9955, 0.9949; 0 at w = 0.9947, 0.9940. Claimed edge 0.99482: confirmed.
  Absence of sign changes on a grid is not a certificate of an off-line zero; together with B1 (pairs leave only through a double zero) and the growing minimum it is the same kind of evidence the author has. No interval bounds, as the author states.

Direction of error for the shrink claim: I_T is nested by definition, and the true full-count window is contained in the stated one (the interior at T = 2000 was sampled only at w = 0.9949, 0.995, 1, 1.005, 1.0087; any missed interior departure would make the true window smaller). So "kill criterion not met" needs only the edge losses, which are confirmed.

## 3. Errors and overstatements

1. Known results presented without attribution (the main finding).
   - The family Z(w, s) is the van der Geer-Schoof two-variable zeta function of Q studied by Lagarias-Rains (2003). "The theta-power family is not in the map" is true of the map, not of the literature.
   - A1 is Lagarias-Rains Lemma 3.5: the Dirichlet series has an Euler product iff w in {0, 1, 2, 4, 8}, proved from the same condition c_2 c_3 = c_6, a degree-five polynomial with those roots. Label should be CLASSICAL (re-verified), not PROVED as new.
   - B1 (zeros leave the line only by coalescing in pairs, with a square-root branch) is in Lagarias-Rains section 8, Lemma 8.1, where a pair of zeta zeros is followed off the line for u between 1 and 3/2.
   - "w = 4 is multiplicative with 44 of 202 on-line": Lagarias-Rains section 1 and 3.4 state that the zeros appear to be on the line only for u = 1, 2 and that only an infinitesimal fraction is on the line for u = 4, 8.
   - Their Lemma 6.1 and Theorem 6.2 (strip confinement; N_u(T) with S_u(T) = O((u+1) log T)) are the inputs B1 and the argument-principle counts need; not cited.
   What remains the author's own: A2 for real w (Lagarias-Rains say only "in general not Hecke eigenforms"), the quantitative windows, the per-gap exponents, and the placement against the map. A2 for integer w is the classical statement that theta^w is Eisenstein for w <= 8 and that S_{9/2}(4) is non-zero; the Q[w] gcd extends it to real w and is elementary.
2. "|w-1| log T = const holds for the median gap" is stated too strongly. It is a statement about first-order delta_k, on the 65 percent of gaps that are first-order mergeable, where first order misses the exact critical value by up to 37 percent. The seven medians fall monotonically from 1.03 to 0.82 while log(gamma/2 pi) rises from about 2 to 5.6; a power of the log other than 1 fits equally. "Compatible with", not "holds".
3. The summary line "double precision plus an independent 60-digit Arb run" does not apply to the T = 1000 and T = 2000 windows (double only in the author's files). Repaired here for the T = 2000 edges; the T = 1000 edges (pairs 677 and 630) remain double-only.
4. Exponent 0.84: four heights, one realisation of an extreme-value statistic, edges set by 6 pairs. No error bar is possible. The author says so in weakest step 3; the verdict line should carry the caveat.
5. Section 3.3 wording (see table): "spans its space" must name Hecke's group G(2).
6. "New information for the map" is smaller than stated. The shrinking punctured neighbourhood is already supplied by HEAT (off-line zeros for every tau < 0, pairs leaving through double zeros). The multiplicative members w = 4, 8 are zeta(s')zeta(s'-1) and zeta(s')zeta(s'-3) with a factor at 2, i.e. EA with a = 1/2, 3/2 and a bad local factor; the EA row already covers them. The item that is not in DH/HEAT/EA is the uniqueness one: Hecke's dimension-1 statement holds along the whole family while the on-line property fails at sampled w. That item rests on a theorem cited from memory by both author and referee.
7. Section 6 row placements (wall-item-2 rows "hold verbatim", G12/G16/G17 "pass") are by inspection, not run. Labelled ARGUED by the author; they should not be copied into the map as PROVED.

## 4. Controls, RH-dependence, verified height

- The result claims no zeta-only mechanism and no lever, so there is no positive claim to run DH, backward heat or the sign twist against. By argument: B1/B2 use only real-analyticity in a parameter and the reflection symmetry, so they hold verbatim for the backward heat family (same pairwise departure) and for any real-analytic deformation through DH; nothing in them is specific to zeta. The sign twist has no functional equation and no central line, so the construction is not formulable there.
- RH: B1 and the window definition use "zeros of zeta below T on the line and simple", which is verified height, and RESULT.md says the non-empty two-sided window is a restatement of exactly that. No step assumes RH above the computed range. No statement about zeros of zeta is made.
- Nothing certified: all zero locations and exponents are MEASURED. Correctly labelled.

## 5. Surviving claim

For the Lagarias-Rains family Z(w, s) = Mellin of theta(t^2)^w: (i) exact, re-verified: Euler product iff w in {1, 2, 4, 8} (known, Lagarias-Rains Lemma 3.5); the class-constant T_{p^2} relation at p = 3 or 5 holds iff w in {1, ..., 8} (elementary extension of the classical integer case). (ii) Measured by two independent codes, not interval-certified: the connected full on-line window around w = 1 is contained in (0.91685, 1.13217), (0.93124, 1.02712), (0.97259, 1.01692), (0.99482, 1.00876) at heights 160, 400, 1000, 2000, so the family is a control with off-line zeros at |w-1| of order 0.005 by height 2000; first departure is an extreme-value statistic and is not governed by |w-1| log T = const. (iii) No w-monotone lever; the window's non-emptiness restates RH plus simplicity to height T. It gives no route to RH and no new constraint beyond HEAT and EA except the uniqueness remark (conditional on Hecke's dimension formula as recalled).

Adjusted strength: 0.35 (correct and reproducible; mostly a quantitative supplement to a 2003 paper; one modest new control property; no lever).
