# REFEREE (independent, lens: general) for c15-u7-growing-section-twin-ladder-bridge

Date: 2026-11-19. Independent adversarial pass; own derivations and own code. The author's second pass, which previously occupied this file, is kept unchanged as the appendix at the end.

## Outcome

**The verdict "precise obstruction" holds. No statement about zeros of zeta is made or established. Every step labelled PROVED was re-derived and confirmed, with the corrections E1 to E5 below (none changes the verdict or a flag). Flags set by this referee: R1 false, R2 false, R3 false, R4 false.**

## Re-derivation of the PROVED steps

| Step | What was redone | Result |
|---|---|---|
| Lemma 1, Fejer | Perron integral with kernel e^(uw)/(u w^2); residues at w = 0 (double), 1 - s, rho - s, -2k - s; inserted sum 1/(s-rho) = xi'/xi and sum (s-rho)^(-2) = -(xi'/xi)'. Collected: sum_rho K_u(s-rho) = [K_u(s) - P^(-s)/(u s^2)] + K_u(s-1) + g + g'/u - F - T_P | equals the definition of L_F term by term. HOLDS |
| Lemma 1, sharp | truncated explicit formula for sum_{n<=P} Lambda(n) n^(-s) | equals the definition of L_S. HOLDS. `stage.py` drops the trivial-zero term (size P^(-5/2)/t), harmless |
| Lemma 2 | phi(v) = (1 - v/u) e^(-xv): phi >= 0, phi(u) = 0, -phi' = e^(-xv)(1/u + x(1 - v/u)) >= 0 and non-increasing; one integration by parts, boundary terms vanish; alternating half-period sum, last partial half-period dominated by the preceding one | HOLDS, including x = 0 (closed form (1 - cos uy)/(u y^2)) |
| Theorem 1 (a) | termwise sign; S_P Schur, hence in H-infinity of the half-plane, hence zero anticausal block | HOLDS; it is conditional on the zero-free hypothesis (eta_0 = 1/2 unconditional and trivial) |
| Theorem 1 (b) | L_F is holomorphic on Re s > 0; convergence to xi'/xi on Re s > 1 term by term; Harnack bound from the value at s = 2; Vitali | HOLDS. The hypothesis must hold on the whole half-plane (all heights), as stated |
| Lemma 3 | S_1 - S_2 = -2 alpha (L_1 - L_2)/((1 + alpha L_1)(1 + alpha L_2)); abs(1 + alpha L) >= 1 when Re L >= 0; L_F - L = -(1/u) sum (1 - P^(rho-s))/(s-rho)^2 | HOLDS; (3.1) is conditional on Re L >= 0 on the line (no zero to the right of it) |
| Proposition 4 | b = triangle of half-width delta; int w = 1 because v_0 > delta; only the term b(log n - v_0) survives because log 2 > delta; tail abs(y) > t/2 bounded with B <= 2/(pi delta y^2); the region near height 0 inside the tail (where K_u(s-1) is of size 4 sqrt(P)/u) contributes at most C sqrt(P)/(delta u t^2); gamma part against cos(v_0 y + phi) is O(log t/t) by one integration by parts (frequency gap at least log 2) | HOLDS as a statement with an unspecified absolute constant C for P <= t^2. No property of Lambda is used, as the result says |
| Unconditional range | Re gamma part = (1/2) log(t/2 pi) + O(1/t) for sqrt(P) <= u t; sum Lambda(n)(1 - log n/u) n^(-1/2) ~ 4 sqrt(P)/u | HOLDS; constant (1/4) log t log log t confirmed |
| Sharp section under RH | Re[(1 - e^(iu(gamma - t)))/(i(t - gamma))] = sin(u(t - gamma))/(t - gamma) | HOLDS |
| Gaussian threshold | variance of the real part = (1/2) int_0^u v (1 - v/u)^2 dv = u^2/24 | HOLDS |

Nothing in the PROVED chain assumes RH: Theorem 1 (a), Lemma 3 (3.1) and the sharp formula state their zero-free hypothesis; the measured positivity for zeta is at heights where RH is verified and the result says so (section 4.4, last bullet).

## Numerical checks rerun with different cases

Own script (`chk.py`, run on the server through rhrun, unit rh-c15u7ref-1119195128, 2 cores, 6 GB, finished on its own; float64, MEASURED).

- A. Lemma 1 at three new points, two of them off the line: (sigma, t, P) = (0.8, 52.3, 900), (0.5, 71.9, 900), (0.3, 40.2, 120), prime side against 300 zeros plus the smooth tail correction: differences 4.9e-4, 8.6e-4, 6.6e-4 (the author's cases: 4.2e-4 to 6.8e-4). Consistent with the identity on Re s > 0, not only on the line.
- B. Lemma 2 on a different grid (x in [0, 5], abs(y) <= 200, u in {0.3, 1.9, 6.0, 13.8, 23.0}): minimum of Re K_u = 1.9e-17 >= 0.
- C. New cell t = 3000 (window 100, step 0.01), own DH coefficient code (Dirichlet inverse then convolution, not the author's recursion), new seeds:

| theta | P | zeta Fejer: min, frac | zeta sharp: min, frac | Liouville: min, frac | DH: min, frac | 8 new sign seeds: violating, min range, median frac | 4 random unimodular completely multiplicative twists: violating, min |
|---|---|---|---|---|---|---|---|
| 1 | 3000 | 0.120, 0 | -5.61, 0.284 | -1.97, 0.022 | -0.78, 0.005 | 8/8, [-3.11, -1.05], 0.027 | 4/4, -1.75 to -1.99 |
| 1.5 | 1.64e5 | 0.101, 0 | -7.04, 0.363 | -5.24, 0.099 | -4.59, 0.024 | 8/8, [-5.52, -3.54], 0.103 | 4/4, -4.11 to -5.57 |

  These interpolate the author's tables at t = 1e3 and 1e4 (fractions 0.024/0.018 Liouville, 0.030/0.022 random at theta = 1; 0.091 random at (1e4, 1.5)). Confirmed.
- D. DH at its first off-line zero 0.808517 + 85.699348 i: min Re L_F in t = 85.7 +- 3 is -1.375, -4.278, -10.862 at P = 1e3, 1e4, 1e5; the two terms K_u(s - rho_0) + K_u(s - (1 - conj rho_0)) alone give -1.438, -4.355, -10.916 at the same point; the formula -P^b u/(4 pi^2) of Proposition 5 gives -1.47, -4.00, -10.17. This confirms the mechanism of the DH failure (the off-line pair, through Lemma 1 for DH with its own gamma term) and the DH coefficients, which the author's pass had left unchecked.
- E. l^1 sums sum Lambda(n)(1 - log n/u) n^(-1/2) at P = 5.6, 10, 17.8, 31.6, 100, 316: 0.64, 1.18, 1.87, 2.74, 5.18, 9.02 against reserves 2.535, 3.686, 4.838 at t = 1e3, 1e4, 1e5. The stated ends of the unconditional range (5.6 to 31.6, 10 to 100, 17.8 to 316) are confirmed.
- Tables against logs: the rows of section 4.2 quoted for P = 1e6 and 1e8 and the three long-scan lines agree with `logs/` (spot check of 12 rows).

## Errors and corrections (none changes the verdict)

- **E1. T-NR is misdescribed, and "PROVED" is too strong there (section 2 Q-P, section 5 table, section 6 R1 and R3).** (i) The map defines T-NR as xi(s)(2 cosh((s - 1/2) log q) + c) with abs(c) > 2 and records it as having multiplicative coefficients (a change of the local factor at one prime). The result says "T-NR has no Euler product" and uses the range 0 < c <= 2, which is not the control. So the sentence "the stage statement holds for a function without multiplicativity: the statement does not contain R1" does not follow from this example. (ii) For 0 < c <= 2 the factor m does have all zeros on the line (cosh(z log q) = -c/2 in [-1, 0) forces z imaginary), and its zeros add non-negative terms; but "passes at every P and t (PROVED)" for xi times m is conditional on RH for the xi factor. What is proved: the extra factor adds a non-negative amount. (iii) For the actual control (c > 2) the statement fails through the off-line zeros of m, i.e. at the conclusion, like DH. R1 = false stands for a simpler reason: no step of any proved statement uses multiplicativity (Proposition 4 holds for arbitrary coefficients; Lemma 1 and 2 hold for any completed function).
- **E2. The unimodular-twist row conflates two controls (section 5, section 6 R3).** "Theorem 1 holds for L(s, chi) under GRH" is about Dirichlet characters. The campaign's unimodular control (completely multiplicative unimodular twist on zeta's gamma one-port, no functional equation) was "not run". Run here (check C): 4 of 4 random unimodular twists violate at theta = 1 and 1.5, at the same level as the sign chains. So "unimodular twists pass" in R3 is wrong for that control; it fails the statement for the same reason as the sign chains (Lemma 1 is not available). R3 remains false: no control fails at a named step of an argument, because there is no argument beyond the identity.
- **E3. Section 4.3, "a zero off the line above that height would change Re L_F in these cells by less than sqrt(P)/(u (3e12)^2), below 1e-21".** This is a per-zero bound. Summed over all zeros above 3e12 (sum of gamma^(-2) about 1.5e-12) the worst case is about sqrt(P)/u times 1.5e-12, i.e. below 1e-9 at P = 1e8. Still negligible against min Re L_F >= 0.06, so the measured positivity is implied by the verified height; the number 1e-21 should read "per zero".
- **E4. Proposition 5 (ARGUED), "against a positive sum from the other zeros of typical size (1/2) log t".** Check D shows that at the minimum the other zeros of DH contribute only +0.05 to +0.08 (not about (1/2) log(5t/2 pi) = 2.1): the mean value is not a lower bound at the point where the pair is most negative. The threshold gamma_0^(theta b) > 2 pi^2/theta and the constant c_theta are therefore order-of-magnitude only, and can be too large as well as too small. The label ARGUED is right; the constant should not be copied to the map.
- **E5. Novelty.** Theorem 1 is the Fejer-smoothed form of the known criterion "RH iff Re xi'/xi > 0 on Re s > 1/2" (Hinkkanen 1997; Lagarias 1999; recalled, not opened), with the smoothing kernel of the Weil explicit formula; the stage inequality is row P45, as the result says. It should be recorded as CLASSICAL in content with a proof written here, not as a new theorem. The result does not claim more than "not recorded in the sources read", which is accurate.
- Minor. The verdict sentence "proved unconditionally only for P up to about ((1/4) log t log log t)^2" is a statement about what this lane proved, not a theorem that nothing more is provable. Proposition 4's constant C is not explicit. N_- for zeta at P = 1e8 is not at the floor (3.7e-7, 3.6e-8 against 4e-11); the result states this. Under verified height alone the anticausal block is not exactly zero; "exactly 0" is conditional on RH, as corrected by the author.

## Checks requested by the assignment

- Assumes RH anywhere? No. Conditional statements carry their hypothesis.
- Restates verified height? The measured zeta positivity does, and the result says so (4.4). It is not presented as evidence for R4.
- Known theorem presented as new? Not claimed as new beyond the lane's sources; see E5.
- Zeta-only mechanism claimed? No. The result states the separation is "zeros on the line read through a positive kernel". Controls run here: sign chains, Liouville, DH, unimodular twists all fail the statement at theta >= 1 (check C); DH fails through its off-line pair (check D). Backward heat, zeta(s+a)zeta(s-a), Beurling, phase-rotated transfer operator, theta^w were not run by the author or here; by Lemma 1 each fails or passes according to its zero set only.

## Requirement flags (strict)

- R1 false. No proved step uses multiplicativity.
- R2 false. The every-window, all-heights statement is proved only for P <= about ((1/4) log t log log t)^2, where it holds for every sign twist too; beyond that it is conditional on a zero-free hypothesis.
- R3 false. Controls fail the statement only through their zero location or the absence of the identity; Dirichlet L-functions and on-line-zero modifications pass.
- R4 false. Theorem 1 (b) makes the limit step sound in this class, and its hypothesis is equivalent to the conclusion.

---

# Appendix: the author's second pass (unchanged; not independent)

# REFEREE pass for c15-u7-growing-section-twin-ladder-bridge

Date: 2026-11-19. This is a second pass by the author of the lane with separately written check code (`ref_checks.py`, `ref_checks2.py`, `validate.py`, the step-halving runs). No independent referee was available in this lane. It does not count as an independent referee pass; the record lane should treat every PROVED label as "author only".

## Items checked

| # | Claim | Check | Outcome |
|---|---|---|---|
| 1 | Lemma 1 (L_F = sum_rho K_u(s - rho)) | prime side against 400 zeros (mpmath) at three (t, P) | differences 4.2e-4 to 6.8e-4, inside the tail bounds; first comparison omitted the imaginary part of the far pairs (0.08 to 0.16), added | HOLDS |
| 2 | Lemma 2 (Re K_u >= 0 on Re w >= 0) | grid x in [0, 3], y in [-60, 60], u in {0.7, 3, 9.2, 18.4}; closed form against quadrature at 80 random points | minimum 1.4e-12 > 0; max difference 3.8e-9; at x = -0.2 the minimum is -2.08 | HOLDS |
| 3 | Theorem 1 (a) | reread: uses Re(s - rho) >= 0 for both rho and 1 - conj rho | HOLDS |
| 4 | Theorem 1 (b) | reread: convergence at Re s > 1 term by term; Harnack needs the value at one point bounded, supplied by s = 2 | HOLDS |
| 5 | Lemma 3, Fejer difference | L_F - L = sum_rho [K_u(s - rho) - 1/(s - rho)]; abs(P^(rho-s)) <= 1 on the right of the zeros | HOLDS; the bound C/(theta (eta - eta')) is not small, said so |
| 6 | Proposition 4, identity | quadrature of the integral at t = 1e4, two P, two phases | agrees after the tail mass; HOLDS |
| 7 | Proposition 4, content | trivial bound against the bound at the test heights | CORRECTED: in the first form (x = P) the trivial bound was below the bound for every P <= 1e6, so the statement was empty in the tested range. Restated for general x <= P; then non-trivial from about x = 1e5. |
| 8 | Proposition 4, reading "contains square-root cancellation" | sup of the band sum over 10001 heights for zeta and six random sign chains | NEW FINDING: the sign chains satisfy the conclusion as well (0.21 to 0.83 against bounds 5 to 10). The proposition is a necessary condition that does not separate. Recorded in section 4.5 and the verdict. |
| 9 | Unconditional range constant | sqrt P = (u/8) log t with u = 2 log log t | CORRECTED: (1/4) log t log log t, not (1/8); measured ends of the range added |
| 10 | Sharp formula | Lemma 1 for L_S on the line | CORRECTED: no separate pole term |
| 11 | Liouville reading | lambda(p^k) = (-1)^k: even powers keep zeta's sign | CORRECTED: "up to even prime-power terms, O(1)" |
| 12 | P1, N_- of zeta | step 0.02 gave 1e-7 to 6e-4 at P >= 1e5 | CORRECTED: aliasing; step 0.01 gives the floor in the four cells rerun at P <= 1e6, step 0.005 in one. Cells at P = 1e8: 3.7e-7 and 3.6e-8 at step 0.01 (from 6.1e-4, 1.7e-4), not at the floor; P1 second part is NOT CONFIRMED for these two cells. |
| 13 | "exact value 0 by RH below the heights used" | Theorem 1 (a) needs all zeros | CORRECTED: conditional on RH, with the size of the possible contribution from above the verified height |
| 14 | Random class against Gaussian | ratios recomputed from `tables.txt` | 0.84 to 0.97 for theta >= 1; 0.15 to 0.35 at theta = 1/2 (long scan); 0.55 at theta = 0.7. HOLDS as stated |

## Not checked
- Proposition 5 (ARGUED) was not turned into a proof; no Turan-type estimate was attempted.
- The constants of Proposition 4 (C, the range P <= t^2) were not made explicit.
- The DH coefficients were not compared with an independent computation in this lane (the recursion is the one of `c3-fixedt-growingp-onesided/dh_near.py`); the DH zero nearest each violating height was not located.
- The sources `c2-jinner-multidelay-lft/RESULT.md` and `c2-projection-domination-gonek/RESULT.md` were read through their map rows only.

## Outcome
Verdict "precise obstruction" stands. Six corrections were applied to RESULT.md (items 7, 9, 10, 11, 12, 13) and one finding added (item 8). No requirement flag changes: R1 to R4 all false.
