# c5-twisted-helson-arcs: additive twists of a unimodular completely multiplicative chi, uniform in the modulus

Date: 2026-11-18. Kind: combine (`c4-helson-discrepancy-zerofree` Theorem 1 with round-4 lesson 3). Status: unrefereed.
Labels: PROVED (argument in this note, same-agent check only), CLASSICAL, MEASURED (integer sieve, float64 post-processing, finite range), OPEN.

Nothing here proves or refutes RH. No statement about a zero of zeta is established. No bound moves.

## 0. Verdict

**Precise obstruction; the family is closed.** Notation: chi completely multiplicative, |chi(n)| = 1, T(x; a/q) = sum_{n<=x} chi(n) e(an/q), S(x) = T(x; 0), F_psi(s) = sum chi(n) psi(n) n^-s.

1. The hypothesis has two readings and the planner's pre-check mixes them.
   - **Strict form H_d(theta, Q)**: T(x; a/q) = [q = 1] M(x) + O(q^A x^theta) for (a, q) = 1, q <= Q(x), with no main term at q > 1.
   - **General form H_g(theta, Q)**: T(x; a/q) = c(a, q) x + O(q^A x^theta), main terms allowed at every q.
2. **Lemma A (PROVED).** If H_d holds at all prime moduli with some theta < 1, and S(x) is not o(x), then chi(n) = n^(-i alpha) for a real alpha; if M(x) = c x then alpha = 0 and chi = 1. Conversely n^(-i alpha) satisfies H_d with error O(q (1 + |alpha| log x)). So for every theta < 1 and every unbounded Q the strict form defines the same class, {n^(-i alpha)} (control WT together with zeta), and on that class the hypothesis is a classical theorem with theta = 0+. It is an identification with no inequality and it yields no zero-free statement: every consequence of H_d is a consequence of facts already known for zeta(s + i alpha).
3. **Planner pre-check, corrected.** (i) The Parseval statement is true only for approximation by c D_x(alpha) uniformly on the whole circle (Lemma B, PROVED); at rationals with a factor q^A it gives only A + theta >= 1/2 for every chi, including chi = 1, and forces nothing. Lemma A makes it unnecessary: the threshold for identification is theta < 1, not theta < 1/2. (ii) "THIN passes for theta >= b" is true for H_g (PROVED, error O(q x^(b+eps))) and **false for H_d**: THIN has the main term c(a, p) = -2c/(p - 1) at every prime p in S (PROVED; MEASURED: T/x = -0.02584080 against -0.02584043 at q = 3, b = 0.9, x = 1e10).
4. **Decisive test 1 (MEASURED, x <= 4e10; no inconsistency).** For the greedy regular set at b = 0.9 the discrepancy sum chi(n) - c x has block maxima 438, 1440, 5131, 15742, 27400 on the octaves starting at 2^20, 2^24, 2^28, 2^32, 2^34; fitted exponents 0.39 to 0.43 (rms 0.41), no upward drift (max/x^0.45 falls from 0.63 to 0.50). x^0.9 at 4e10 is 3.5e9. So theta is about 0.42 on this range and sigma_0 = b = 0.9 exactly: sigma_0 in Theorem 1 of the Helson lane is by definition the top real zero of F, which is the double zero at b, and the theorem speaks only of Re s > sigma_0. The recorded "inconsistency" is a reading of sigma_0 as theta. Theorem 1 is not contradicted; the zero at b sits in (theta, sigma_0], where the theorem says nothing.
5. **Decisive test 2 (PROVED): H_g at q > 1 adds nothing on zeros beyond the relative Landau statement, and that statement needs no twisted hypothesis.** Theorem 1' : under the q = 1 hypothesis alone, for every Dirichlet character psi, F_{chi psi}(s) F_{conj(chi) psi}(s) = L(s, psi)^2 exp(-2 A(s, psi)) with A(s, psi) = sum a_n psi(n) n^-s absolutely convergent on Re s > sigma_0, the same sigma_0 as at q = 1. Zeros of the twisted series right of sigma_0 are zeros of L(s, psi), uniformly in the conductor. Left of sigma_0 the THIN family passes H_g and has zeros (item 6).
6. **THIN against H_g for theta < b (MEASURED).** Greedy THIN is biased in residue classes (class 2 mod 3 exceeds class 1 by 1024, 5060, 26000 elements at 1e6, 1e7, 1e8); its twisted errors grow with local exponent 0.78 to 0.83 at b = 0.9 (2.5e6 at q = 3, x = 1e10), against 0.42 untwisted. Random THIN (P(p in S) = p^(b-1)/2, two seeds, simple zero at b = 0.9) has twisted errors 5e4 to 1.2e5 at x = 1e10 for q <= 103 with overall exponent 0.39 to 0.47. So a THIN member with a zero at 0.9 passes H_g(theta, Q) for theta about 0.5 on q <= 103, x <= 1e10. No (theta, Q) with theta in [1/2, b) is failed by the THIN family on the measured evidence.
7. **Score line: not met.** No (theta, Q) is failed by THIN and WT and yields a zero-free statement not assumed for zeta or L(s, psi). In the strict form THIN and Beurling fail and WT is exactly the residual class, but the conclusion is an identification. In the general form THIN passes.

Proposed map row (section 3.1, after P43), to be applied by the map-repair lane:

| P44 | Power-saving additive twists sum chi(n) e(an/q), uniform in q, for unimodular completely multiplicative chi | Strict form (no main term at q > 1), any theta < 1: chi(n) = n^(-i alpha) (sum over a mod p of the twists equals p chi(p) S(x/p)); the hypothesis is then classical with theta = 0+. General form: THIN passes (error O(q x^(b+eps)); random THIN measured exponent about 0.45 at b = 0.9 with a zero at 0.9); zeros of sum chi psi(n) n^-s right of the q = 1 abscissa sigma_0 are those of L(s, psi) with no twisted hypothesis needed. Greedy THIN at b = 0.9: discrepancy exponent 0.42 on x <= 4e10, sigma_0 = 0.9. | PROVED (Lemma A, Theorem 1'); exponents MEASURED | THIN, B (strict form fails at q = p; identification only); WT passes | `c5-twisted-helson-arcs` |

## 1. Plan; what is new relative to c4, the atlas and the map

Nearest map entries: controls B, WT, U, TW- (section 2); P14 (rate equals zero-free region, loop map f(theta) = theta); S12 and `c2-euler-cone-fe-rigidity` (Hamburger: rigidity without inequality); the c4 Helson lane (Landau argument is relative to zeta and additive-blind). New here: the exact content of twisted, modulus-uniform hypotheses (Lemma A), the per-character Landau statement with a conductor-independent abscissa (Theorem 1'), the extension of the THIN discrepancy measurement from 1e8 to 4e10, twisted-sum measurements, and the residue-class bias of the greedy set. Lemma A is a few lines and may be folklore (equidistribution in residue classes characterising archimedean characters); novelty not checked.

## 2. Lemmas and proofs

### Lemma A (strict form is an identification). PROVED.
Hypothesis: for every prime p there are C_p and x_p with |T(x; a/p)| <= C_p x^theta for p not dividing a and x >= x_p, theta < 1; S(x) = M(x) + O(x^theta); limsup |S(x)|/x > 0.

(a) Orthogonality: sum_{a mod p} T(x; a/p) = p sum_{n<=x, p|n} chi(n) = p chi(p) S(x/p). The last equality is complete multiplicativity. Hence
  S(x) = p chi(p) S(x/p) + O(p C_p x^theta).   (*)
(b) If M(x) = c x with c != 0: c x = chi(p) c x + O(x^theta), so chi(p) = 1 for every p; chi = 1.
(c) General M. Put u(x) = S(x)/x. From (*), u(x) = chi(p) u(x/p) + O(x^(theta-1)), so for fixed positive rational r, u(r x) = chi(r) u(x) + o(1) (chi extended to positive rationals). |S(x') - S(x)| <= |x' - x| + 1 gives |u(x') - u(x)| <= 2 |x'/x - 1| + o(1). Along powers of 2 the errors in (*) sum geometrically, so |u(2^k x)| = |u(x)| + O(x^(theta-1)) uniformly in k; with the Lipschitz bound and a finite net of rationals in [1, 2] this gives |u(x)| -> l, and l > 0 by hypothesis. Then |chi(r) - chi(r')| l <= 2 |r/r' - 1| for positive rationals r, r': chi is a uniformly continuous homomorphism from the positive rationals to the circle, hence chi(r) = r^(-i alpha).
(d) Converse (CLASSICAL): sum_{n<=x} e(an/q) = O(q) for q > 1 and partial summation give T(x; a/q) = O(q (1 + |alpha| log x)) for chi = n^(-i alpha).

Consequences. The exponent theta plays no role below 1; Q needs only to be unbounded; only prime moduli are used. If Q is bounded by Q_0 the conclusion is chi(p) = p^(-i alpha) for p <= Q_0 only (finite stage). Without complete multiplicativity step (a) has no right-hand side and the class is large (any sequence with equal means in all residue classes).

Case S(x) = o(x) (c = 0): outside Lemma A. H_d then implies sum chi psi(n) << q^(A+1/2) x^theta for primitive psi, i.e. F_psi analytic in Re s > theta. For chi = Liouville this is L(s, psi) zero-free in Re s > theta for all psi (the hypothesis is the conclusion; loop map of P14). For other chi it concerns F_psi, not zeta.

### Lemma B (the Parseval statement, corrected). PROVED.
int_0^1 |T(x; alpha) - c D_x(alpha)|^2 d alpha = sum_{n<=x} |chi(n) - c|^2 = x (1 - |c|^2) - 2 Re(conj(c) E(x)), with D_x(alpha) = sum_{n<=x} e(n alpha), E = S - c x. So sup_alpha |T - c D_x| >= (x (1 - |c|^2))^(1/2) (1 + o(1)); a uniform bound O(x^theta), theta < 1/2, forces |c| = 1, then c = 1 and chi = 1 (density-one argument with chi(mn) = chi(m) chi(n)). At rationals a/q with the allowed factor q^A the same identity for a prime q in (x, 2x] reads q x = |S(x)|^2 + sum_{a != 0} |T(x; a/q)|^2 and gives A + theta >= 1/2 for every chi; chi = 1 itself has |T(x; 1/q)| of order x there. The planner's statement holds in the first form only, and Lemma A supersedes it.

### Lemma C (THIN in both forms). PROVED.
chi = 1 * g, g multiplicative supported on S-numbers, g(p^k) = 2 (-1)^k for p in S. T(x; a/q) = sum_{d<=x} g(d) sum_{m<=x/d} e(adm/q); the inner sum is x/d + O(1) if q | d and O(q) otherwise. With sum_{d<=y} |g(d)| << y^(b+eps): T(x; a/q) = c_q x + O(q x^(b+eps)), c_q = sum_{q|d} g(d)/d. For q = p prime: c_p = -2c/(p - 1) if p in S and 0 otherwise; in general c_q = c prod_{p^k || q} 2 (-1)^k p^(1-k)/(p - 1) for S-numbers q and 0 otherwise. So THIN passes H_g(b + eps, any Q) with A = 1 and fails H_d at every q that is an S-number, at any theta < 1.

### Theorem 1' (per-character Landau with conductor-independent abscissa). PROVED.
Assume the q = 1 hypothesis of the Helson lane (S(x) = c x + O(x^theta), c != 0) and let sigma_0, A(s) = sum a_n n^-s (a_n >= 0 on prime powers, a_{p^k} = (1 - Re chi(p)^k)/k) be as there; A converges absolutely on Re s > sigma_0 (Theorem 1). For a Dirichlet character psi and Re s > 1, from the Euler products,
  log F_{chi psi} + log F_{conj(chi) psi} - 2 log L(s, psi) = -2 sum_p sum_k a_{p^k} psi(p)^k p^(-ks) = -2 A(s, psi),
and |a_n psi(n)| <= a_n, so A(s, psi) converges absolutely on Re s > sigma_0. Hence F_{chi psi} F_{conj(chi) psi} = L(s, psi)^2 exp(-2 A(s, psi)) continues to Re s > sigma_0 with the exponential factor analytic and non-vanishing. For real chi: F_{chi psi} = L(s, psi) exp(-A(s, psi)), so the twisted series continues to Re s > sigma_0 with exactly the zeros of L(s, psi), for every psi, with no hypothesis on twisted sums. For complex chi the order identity ord F_{chi psi} + ord F_{conj(chi) psi} = 2 ord L(., psi) holds wherever the two factors are separately meromorphic (which H_g supplies on Re s > theta).

So H_g at q > 1 supplies, beyond q = 1: separate continuation of F_{chi psi} to Re s > theta and a bound polynomial in q there. Neither constrains zeros of L(s, psi), and on (theta, sigma_0] the THIN family shows zeros of F occur.

## 3. Numerics (MEASURED)

Program `thin.c` (C, OpenMP): segmented prime sieve to N, greedy set S tracking T(x) = Ei(b ln x) - Ei(b ln 2) (same rule as the Helson lane) or random set P(p in S) = p^(b-1)/2 (xorshift, seeded); chi as a bit array by flipping multiples of p^k, p in S; one pass for S(x), E(x) = S(x) - c x (max, rms, mean on eighth-octave bins) and residue-class sums of chi mod q for q in {2,3,4,5,7,9,15,19,23,101,103}; depth-first enumeration of S-numbers for M_g(y) = sum_{d<=y} g(d), N_S(y), sum g^2. c = prod_{p in S, p<=N} (p-1)/(p+1) times exp(-2 E_1((1-b) ln N)) (greedy) or exp(-E_1) (random). Runs on the server through rhrun (units rh-c5tha-test, rh-c5tha-main, rh-c5tha-rand; 4 cores, 8 GB cap; planned memory printed: 1.25 GB at 1e10, 6.65 GB at 4e10; longest run 505 s; all units ended, none left running). Validation at N = 1e8, b = 0.9: |S| = 1,022,324, c = 0.0258404255191, S(N) = 2,584,198, block maxima identical to the Helson lane's numpy run.

### 3.1 Greedy set, untwisted discrepancy

| b | N | pi_S(1e10) | c | max abs E on octaves 2^20, 2^24, 2^28, 2^32, last | fitted exponent of max (k >= 16, 20, 24, 28) | rms |
|---|---|---|---|---|---|---|
| 0.9 | 4e10 | 50,849,233 | 0.025840425429 | 438, 1440, 5131, 15742, 27400 (2^34) | 0.425, 0.415, 0.414, 0.391 | 0.41 |
| 0.7 | 1e10 | 664,917 | 0.214750866325 | 196, 670, 1612, 5272 | 0.362, 0.379, 0.366, 0.407 | 0.33 to 0.35 |
| 0.5 | 1e10 | 9,629 | 0.410747038741 | 160, 229, 625, 1363 | 0.299, 0.285, 0.329, 0.312 | 0.29 |

b = 0.9: max abs E / x^0.45 per octave is 0.61, 0.71, 0.76, 0.58, 0.63, 0.74, 0.71, 0.67, 0.59, 0.66, 0.64, 0.54, 0.61, 0.59, 0.64, 0.49, 0.53, 0.49, 0.50 for octaves 16 to 34. The exponent is at or slightly below b/2 = 0.45 over 2^16 to 2^35 and far from b. For b = 0.7 and 0.5 the fitted values (0.36, 0.30) are above b/2 (0.35, 0.25); "b/2" is not an exact law on this evidence, "well below b" is.
M_g(y) for b = 0.9: 225, 69, -209, 171, -575, 3279, -239, 2813, -15937, -5637 at y = 2^16 - 1, 2^18 - 1, ..., 2^34 - 1; fitted exponent of octave maxima 0.40 to 0.43. N_S(y)/y^0.9 = 0.7229 (stable to four digits); sum_{d<=y} g(d)^2 is 3.3e11 at y = 1.7e10. The series for G converges (on this evidence) on Re s > about 0.43, left of the double zero at 0.9.
c agrees between N = 1e8, 1e10, 4e10 to 9e-11 (0.0258404255191, ...4317, ...4294), an error below 4 in E at 4e10.

### 3.2 Twisted sums, greedy set (b = 0.9, N = 1e10)
Main terms (Lemma C): T(x; 1/q)/x measured against c_q: q = 3: -0.02584080 / -0.02584043; 5: -0.01293908 / -0.01292021; 7: -0.00862314 / -0.00861348; 9: +0.00861211 / +0.00861348; 15: +0.01291528 / +0.01292021; 23: -0.00235481 / -0.00234913; 101: -0.00056563 / -0.00051681; 19 (not in S): +0.00002949 / 0; 103 (not in S): -0.00005018 / 0. For b = 0.7: q = 5: -0.10737511 / -0.10737543; q = 7: -0.07158240 / -0.07158362.
Errors max_a |T - c_q x| at x = 1e6, 1e7, 1e8, 1e9, 1e10: q = 3: 2.8e3, 1.3e4, 6.9e4, 4.1e5, 2.5e6 (slopes 0.67, 0.72, 0.78, 0.78); q = 5: slopes 0.99, 0.65, 0.78, 0.83; q = 15: 1.2e4 to 1.6e7 (0.78, 0.77, 0.78, 0.80); q = 19: 0.79, 0.75, 0.78, 0.83. q = 2, 4: below 1e4 throughout (2 is not in S and chi(2m) = chi(m), so these reduce to untwisted sums). For b = 0.7 the slopes are 0.4 to 0.58.
Cause (MEASURED, `class_bias.py`, N = 1e8): the greedy set is not balanced in residue classes. Deviation from an equal split, classes (1, 2) mod 3: -/+512, 2530, 13000 at 1e6, 1e7, 1e8 (sqrt of the set size: 149, 386, 1011); mod 5 classes (1,2,3,4): +4965, +11706, -13101, -3571 at 1e8; mod 4: +/-10 at 1e8. The bias grows like x^0.70 against a set size growing like x^0.84. This is a property of the rule "first prime at or after the threshold", not of THIN.

### 3.3 Random THIN (b = 0.9, seeds 1 and 2; b = 0.7, seed 1; N = 1e10)
Twisted errors at x = 1e6 and 1e10 and the overall exponent: seed 1: q = 19: 1.35e3, 5.06e4 (0.39); q = 23: 9.3e2, 7.1e4 (0.47); q = 101: 1.34e3, 9.45e4 (0.46); q = 103: 1.83e3, 9.25e4 (0.43). Seed 2: q = 19: 0.46; 23: 0.45; 101: 0.47; 103: 0.46. All errors at x = 1e10 for q <= 103 are at most 1.2e5 (greedy: up to 1.6e7). Untwisted: fitted exponents 0.30 to 0.52 across seeds, but for random sets c is known only up to the unknown tail of S beyond N (relative fluctuation about N^(b/2-1)), which contributes an error of order N^(b/2) to E at the top of the range; the untwisted random exponents are therefore not resolved. Twisted sums at q not an S-number have predicted main term 0 and are not affected.
One sample (b = 0.7, seed 1, q = 23) has a larger error, 7.4e4 at 1e10 with steady slope 0.35 to 0.47; its residue-class pattern is the Legendre symbol mod 23 (+14,000 on residues, -14,000 on non-residues). In that sample the small elements 5, 7, 11, 19 of S are all non-residues mod 23 and the mean of the partial sums of the symbol is its class number 3, which gives a term of polylogarithmic size from the order-four pole of G_psi at s = 0; read as such, not as a power (not separated numerically from a small power).

## 4. Controls

| Control | Strict form H_d | General form H_g | Named step |
|---|---|---|---|
| THIN (thin sign twist, TW- type) | fails at every q in S: main term -2c x/(p - 1) (PROVED, MEASURED) | passes: O(q x^(b+eps)) PROVED; random member about x^0.45 MEASURED | Lemma A step (b): chi(p) != 1 |
| WT, n^(-i alpha) | passes with M(x) = x^(1 - i alpha)/(1 - i alpha), error O(q (1 + abs(alpha) log x)); fails only if M(x) = c x is imposed (position of the pole) | passes | none: WT is exactly the class Lemma A leaves |
| Beurling | Integer-supported systems (a(n) = indicator of the semigroup generated by a set of rational primes): step (a) gives a(p) = 1 for all p, so only the integers pass. Non-integer generalized integers: sum_{a mod q} e(a nu/q) does not detect divisibility by a generalized prime; step (a) is unformulable | same as THIN when integer-supported and thin (a = 1 * h) | Lemma A step (a): orthogonality mod p equals divisibility by p only on the rational integers |
| Hamburger rigidity (`c2-euler-cone-fe-rigidity`) | Same type of statement: uniqueness with no inequality. Hamburger uses the functional equation and no multiplicativity; Lemma A uses complete multiplicativity and no functional equation. Neither has a stable finite version: with q <= Q_0 Lemma A fixes chi(p) for p <= Q_0 only | - | finite Q: primes above Q_0 are free |
| DH | not completely multiplicative; coefficients periodic mod 5 give main terms at q = 5 | outside the class | step (a), first at n = 6 |
| Liouville, random Steinhaus | S(x) = o(x): outside Lemma A; H_d for Liouville is the strip hypothesis for all L(s, psi) | - | c = 0 |
| Backward heat, EA, T-NR, phase-rotated transfer operator, theta^w | not unimodular completely multiplicative ordinary Dirichlet series; not formulable in this class. Not run | - | - |

Every control except WT fails the strict form for a structural reason, and WT is removed by fixing the pole at s = 1. That is the R3 pattern for the hypothesis, but the conclusion is "chi = 1", so nothing about zeros follows.

## 5. Requirement flags

- R1 (all primes, multiplicativity essential): **false as an attack.** Lemma A uses complete multiplicativity in step (a) and fails without it, but its output is an identification, and Theorem 1' is relative to L(s, psi). No zero statement for zeta uses it.
- R2 (height-uniform, every window): **false.** No zero-free conclusion.
- R3 (every control fails at a named step): **false under the assignment's score rule.** The strict hypothesis is failed by THIN, Beurling and DH at the named step, with WT as the exact residual class, but no zero-free statement results; in the general form THIN passes.
- R4 (reaches the critical line): **false.** Nothing is carried to the strip.

## 6. Three weakest steps

1. "THIN passes H_g for theta in [1/2, b)" is MEASURED on x <= 1e10, q <= 103, two random seeds at b = 0.9; the q-dependence q^A and Q = x^delta with growing q were not tested, and the exponent of the random set is not proved (it needs square-root cancellation in sum_{p in S} psi(p) p^(-it), which for a random set is a probabilistic statement not written out). For the greedy set the twisted exponent (0.78 to 0.83, rising) is not separated from b.
2. Lemma A step (c) (general M) was checked by the author only: the convergence of |u| uses the uniform geometric error along powers of 2 together with the Lipschitz bound; a referee should check the passage from limsup > 0 to l > 0. Case (b) (M = c x) is two lines and does not depend on it. Novelty of Lemma A and Theorem 1' not checked.
3. The discrepancy exponent of the greedy set is a fit on 19 octaves; 0.39 to 0.43 is established on x <= 4e10 only. The residue-class bias of the greedy set is measured (N = 1e8) and not explained; if it produces a singularity of sum_{p in S} psi(p) p^-s at s = b, the greedy twisted exponent is b up to logarithms, which changes nothing in the verdict (the random member carries item 6).

## 7. Pivot (one, as allowed)

Strongest adjacent idea: a stable, finite-Q form of Lemma A. With q <= Q_0 and x <= X the identity (*) gives |chi(p) - p^(-i alpha)| << p^(A+1) X^(theta-1)/l for p <= Q_0 and no constraint on larger primes. This is a finite-stage statement (R4 untouched) and repeats the multi-window finding of the Hamburger lane; not pursued further.

## 8. Files

- `thin.c` (program), `server_runs.log` (rhrun logs).
- Greedy: `b09_1e10.json`, `b09_4e10.json`, `b07_1e10.json`, `b05_1e10.json` and `*_twist.txt` (residue-class sums at checkpoints); validation `t1e8.*`, `chk_g09_1e8.*`.
- Random: `r09s1_1e10.*`, `r09s2_1e10.*`, `r07s1_1e10.*`.
- `analyse.py`, `twist_growth.py`, `class_bias.py`; outputs `analyse_*.txt`, `twist_growth_*.txt`.

## 9. Most valuable next step

None inside this family. The one open measurement with a consequence elsewhere: whether the greedy set's residue-class bias matters for `c5-thin-propd-dichotomy`, which uses a regular THIN set against lattice-periodic weights; a class-balanced construction (greedy per residue class, or the random set) removes a twisted error of order x^0.8 that is an artefact of the selection rule.
