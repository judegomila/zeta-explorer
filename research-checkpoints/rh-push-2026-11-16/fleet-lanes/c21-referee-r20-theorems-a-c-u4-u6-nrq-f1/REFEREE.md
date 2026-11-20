# REFEREE (independent pass, lens: general): c21-referee-r20-theorems-a-c-u4-u6-nrq-f1

Date 2026-11-20. Written by an adversarial referee that did not write `RESULT.md`. Read: `BRIEF.md` to the end,
`RESULT.md`, the six `REFEREE2.md` files, `u4_confirm.py` and its log, the `log_R-*.txt` tails, `lanes_records.jsonl`,
the statements of Theorem A / A2 / C in `c20-euler-shape-rigidity-infinite-modified-primes/RESULT.md` and the
stage-A table of the U4 lane. Own numerics: local, `scripts/memcap.sh 8`, python3.14 (numpy float64 screen, mpmath
30 digits; not ball arithmetic), scripts kept outside the repo (`/tmp/ref_c21/u4chk.py`, `misc.py`); the server
was not used. No statement about zeros of zeta is made by the lane or here.

## Verdict

**The result holds as a referee lane (partial-result): no PROVED step failed on re-derivation, and the one new
numerical decision (U4 rows DEL / THIN) is reproduced with independent code at different heights.**
One error of bookkeeping (referee counts in `lanes_records.jsonl`, item E1) must be corrected before the learn
step merges the records. Flags: R1 = R2 = R3 = R4 = false (agrees with the lane).

## 1. Steps re-derived here

| item | step | outcome |
|---|---|---|
| Thm A | abs(n_p(p^-s) - 1) <= delta_p on Re s >= 1/2; Schwarz: <= delta_p 2^(1/2 - sigma); abs(N - 1) <= exp(2^(1/2 - sigma) sum delta_p) - 1 | confirmed |
| Thm A | (FE) from a meromorphic equation: a pole on the line is excluded by the bound on Re s > 1/2 near that point alone (a pole is unbounded from each side); the remark about 1/2 - it is not needed but is not wrong | confirmed |
| Thm A | reflection E, agreement on the line N(1 - (1/2 + it)) = N(1/2 - it) = N(1/2 + it), Morera, Liouville, limit 1 | confirmed |
| Thm A | Cauchy abs c_(p,k) <= delta_p p^(k/2); at sigma = 2 the factor p^(-3/2)/(1 - p^(-3/2)) <= 0.54692 (p = 2); uniqueness of coefficients | confirmed |
| Thm A | degree one: n_p - 1 = (1 - alpha) y/(1 - y), delta_p = abs(1 - alpha) r/(1 - r), 1/(1 - 2^(-1/2)) = 3.41421 | confirmed |
| A2 | f(t) = N(1/2 + it) uniformly almost periodic with spectrum {-log n}; M{f(-t) n^(it)} = 0 for n >= 2; mean bounded by sup | confirmed |
| Thm C | (a) ord m = -ord N <= 0 in Re s > 1/2 and symmetry; (b) strip width 2 sigma_1 - 1 < 2d so k < pi/(2d) < pi/w is admissible; finite-order clause (N entire of finite order is below exp(exp(k abs t)) in strips); (c) m_p - 1 = (alpha - 1) y/(1 - alpha y), bound with 1 - 2^(1/2 - sigma) | confirmed |
| Lemma P | equal degrees from f(0) = f(infinity) = 1; inversion-symmetric roots; a root in the closed disc for A and for B | confirmed |
| corr. 1 | E_a: c(p) = 1 - p^a - p^-a, abscissa 1 + a | confirmed |
| U4 Lemma S | near zone abs G' <= 4/t^2 + pi/(2t) < 2/t for t >= 43; far zone inequality at r = 1/2 iff log t >= 3.75; limit log 2 of the near-zone ratio at x = t/2 | confirmed |
| U4 Prop. M | norm(A_P) <= psi(P) P^(-1/2) + (1/2) int psi(x) x^(-3/2) dx <= 2.08 P^(1/2); the same bound holds for the DEL / THIN operators (weights of modulus <= Lambda), so the error term used in the row decision applies to the controls | confirmed |
| U4 K3-M | -F'/F + zeta'/zeta = sum k l_k log q q^(k/2) q^(-ks); equality of A_P when q^j0 >= P | confirmed |
| U6 Lemma K | quotient action, independence of distinct eigencharacters, step 4 (two primes with the same sign; (2 pi i/log p) Z meets (2 pi i/log p') Z in 0) | confirmed |
| Line 2 | abs(Y)^2 - 1 = (1 - c^2)(1 - abs(X)^2)/abs(X + c)^2; d(91) - d(7) d(13) = 1 + k0^2 = 1.0807; block-of-five positivity of f_DH on s > 0; degree argument for M_E > 0 | confirmed |
| NR-q | zeros at 1/2 +- arccosh(c/2)/log q + (2k+1) pi i/log q for c > 2; real lowest zero for c < -2; strip bound 2 cosh(log q/2) = 2.197368 | confirmed |
| F1 repair | R(w) = int (g'(omega) - g'(z)) d omega; int along a segment of length L of 1/(1 + abs omega) <= 2 log(1 + L/2) <= 2 log(2 + L) (worst case through the origin); abs g'' <= C_1/(1 + abs omega) on Re s >= 3/2 (the 1/(s - 1)^2 term is bounded there); delta = kappa_0 - eta = -2 tau Im g' = O(log abs z) with kappa_0 = 2 sigma - 1; Gaussian absorbs C_3 abs v log(2 + abs v) on abs v > abs(z)/2 | confirmed; the repaired far-zone bound is uniform in kappa_0 |

Not re-derived by this pass (accepted on the lane's two derivations): Lemma D (a) to (e) and the Rouche step of
F1; Proposition C and P3 of U4; the five U6 corrections beyond a reading; the tail lemmas of the line-4 certificate.
None of them is new in this lane.

## 2. Numerical reruns with different cases (own code)

**U4 rows.** S rebuilt with L(x) = Ei(b log x) - Ei(b log 2) (exact, not the lane's midpoint rule): first members
equal the lane's (DEL 0.55: 5, 7, 13, 29, 41; DEL 0.75: 5, 7, 11, 13, 19; DEL 0.9: 3, 5, 7, 11, 13; THIN: 7, 13,
29, 41). Overlap closed form against mpmath quadrature: 2.5e-16. Scan of 2e4 heights t in [3.0e5, 3.02e5]
(a range without any of the lane's printed windows), P = 12818 frozen, 6 modes, then 30-digit re-evaluation of
the least window with P = floor(t^(3/4)):

| family | least form value (30 digits) at t | zeta on the same vector | fraction below -0.05 | mean |
|---|---|---|---|---|
| zeta | +0.34681 at 301338.5 | - | 0 | 3.97 |
| DEL b = 0.55 | -0.68744 at 301557.1 | +2.77674 | 0.12 % | 4.77 |
| DEL b = 0.75 | -0.51860 at 300223.4 | +2.26709 | 0.25 % | 5.50 |
| DEL b = 0.9 | +2.85094 at 300024.5 | +3.43067 | 0 | 7.02 |
| THIN b = 0.75 | -3.75717 at 301402.2 | +2.78767 | 2.7 % | 4.05 |

The error bound of the lane's formula at these heights is about 0.04, so the three failing rows fail here too,
at windows the lane did not print; DEL at b = 0.9 has no failing window here either. The rows of section 2.2 of
`RESULT.md` are reproduced. (The DEL b = 0.75 fraction is 0.25 % on this short range against 0.031 % on the
lane's full range: the percentages depend on the range, as the lane's weakest step 1 already says.)

**NR-q at c = 2.15** (lane: 2.1, 2.05, 2.2): zero 0.936724771914753 + 3.564427956382738 i, abs G = 4.8e-32,
abs zeta = 0.645 there, winding 1.000000000000 on radius 0.05, functional equation defect 5.8e-31 at 0.37 + 9.3i.

**A2 on a third sparse set** (next prime after 3^j, j = 2..21; sum p^(-1/2) = 0.7475): sup on a grid of
abs(N(1/2 + it) - N(1/2 - it)) = 1.790 (DEL) and 4.834 (THIN) against the bounds 0.3015 and 0.6030.
**Lemma P** on three symmetric quadratics: a root of numerator and denominator of modulus <= 1 in each.

Pick recomputation: not rerun here; the logs show `undecided: []` in all four runs and the negative pivots as
printed (149, 150, 218, 219; 149, 150; none; none). One inconsistency of no consequence: `run_all.sh` launches
R-DH-half at order 160, the table reports order 200 from the separate unit `rh-c21half` (`run_half.sh`); the log
on file is the order-200 run.

## 3. Controls

No zeta-only mechanism is claimed, so there is no device to run against the nine controls. The control
statements the lane makes were checked where cheap: DEL / THIN (U4 rows and A2), NR-q, Lemma P for the HQ
family. DH and Beurling as base: Theorem A is base-blind by Lemma A0 (re-derived: the reflection argument uses
no property of zeta). Backward heat enters only as the object of F1. Not run by the lane or here: theta^w,
phase-rotated transfer operator, unimodular twist (not objects of the refereed statements).

## 4. Errors and corrections

- **E1 (bookkeeping; must be fixed before the merge).** `lanes_records.jsonl` records `referees: 2` for
  `c20-euler-shape-...`, `c20-u4-...`, `c20-statement-o-line2-...` and `referees: 3` for `c15-control-...`.
  The `REFEREE.md` files of those lanes state that they are author or same-session passes and count as 0
  (euler-shape: "author's adversarial pass ... referees = 0 stands"; U4: "second pass, same session ... referees = 0";
  line 2: "not an independent referee ... counted as 0"; c15: "same-lane pass ... not an independent referee").
  After this lane the independent count for those four is 1, not 2 or 3. The label PROVED-2 ("two derivations
  exist") is accurate; "two referees" (for example section 4 of the F1 file, "supported by two referees") is
  accurate only where the first file was independent (U6; line 4 Part I if it is). None of these statements is
  about zeros of zeta, so the three-referee rule is not triggered, but the counts should not be merged as written.
- **E2 (wording, table of 2.2).** "zeta passes every scanned window" is a consequence of the zeros being real
  at these heights (the form is <h, T_Z h> up to the error; T_Z >= 0 for real ordinates), that is, of verified
  height. It is used only as a control of the computation and the lane does not present it as a result; the
  learn step should not enter it as evidence about zeta.
- **E3 (wording).** The fractions 2.26 %, 0.126 %, 0.031 % are properties of the range [1e5, 2.1e6] and of the
  threshold; on [3.0e5, 3.02e5] the DEL b = 0.75 fraction is eight times larger. The lesson line of `lanes.jsonl`
  quotes them without the range.
- **E4 (minor).** A-iii of the Theorem A file: the remark that boundedness to the left of 1/2 + it "comes from
  the right of 1/2 - it" is superfluous (one-sided boundedness already excludes a pole). No effect.

No error was found in a PROVED step. Nothing in the lane assumes RH. No known theorem is presented as new: the
lane lists as new only Lemma P, the Schwarz rate, the wording corrections, the decided rows, the recomputations
and the far-zone bound; Theorem A is described at source as Liouville after reflection.

## 5. Requirement flags, set here

- R1 false: nothing uses multiplicativity in an essential step (Theorem A holds for any Dirichlet series; the U4
  forms are linear in Lambda; Theorem C exhibits a non-Euler function passing a fixed Pick order).
- R2 false: no height-uniform conclusion about zeta; failing windows are existence statements, non-failure is a
  finite scan.
- R3 false: no mechanism that rejects the controls for a structural reason; the statements are about controls.
- R4 false: not addressed.

## 6. Three weakest points after this pass

1. The DEL / THIN decision is mpmath at 30 digits with an error bound built from Proposition M constants; no ball
   arithmetic. Two independent codes now agree, with margins 15 to 500 times the bound.
2. The F1 repair is uniform but not effective (C_1, C_2, C_3, r_0 untracked); Lemma D and the Rouche step were not
   re-derived by this pass.
3. Independence of the second-referee files from the first passes is by procedure only, and the referee counts
   written to `lanes_records.jsonl` overstate it (E1).
