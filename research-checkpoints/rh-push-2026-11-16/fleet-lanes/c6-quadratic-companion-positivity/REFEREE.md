# REFEREE (lens: general) for c6-quadratic-companion-positivity/RESULT.md (2026-11-18)

**Outcome: the claimed verdict (precise obstruction; lane closed at the first test; no statement about zeros)
holds, with five corrections of wording or scope listed in section 3. None changes the verdict.**
Requirement flags set by the referee: R1 = false, R2 = false, R3 = false, R4 = false.

Nothing in the result assumes RH or uses verified height. No statement about zeros is claimed. The compute server
was not used by the result or by this referee.

## 1. PROVED steps re-derived

| Step | Re-derivation | Status |
|---|---|---|
| Q1 is linear in -L'/L (row P25) | -(L'/L)(s, Pi x Pi~) has prime-power coefficient Lambda(n) abs(tr A_p^k)^2 and expands as sum_{j,l} m_j m_l (-L'/L)(s + z_j + conj z_l, pi_j x pi_l~). Zeta part = abs(sum m_j p^{-ik t_j})^2. | confirmed; see correction C1 on "exactly the classical cone" |
| 3 + 4cos + cos2 = (1/2) abs(1 + e^{i theta})^4 | abs(1+e^{i theta})^2 = 2 + 2cos; square = 6 + 8cos + 2cos2. | confirmed |
| Lemma Q | From B(x,y) = c(x)c'(y) + c'(x)c(y) >= 0 on X x X (incl. diagonal): all cases redone, including the sub-case c'(x_0) = 0, c'(z) < 0, c(z) = 0 (not written in the proof; it follows from B(z,y) = c'(z)c(y) >= 0). Conclusion (both >= 0, both <= 0, or one identically 0) is correct. | confirmed; see correction C2 on the density hypothesis |
| Lemma U | abs(u b)^2 = abs(b)^2. | confirmed (trivial) |
| Lemma H | S_p and R_p both equal 1 + abs(h_1)^2 x + O_d(x^2); S_p >= 1; R_p = exp(sum_k abs(tr A^k)^2 x^k / k) in [(1+x)^{-d^2}, (1-x)^{-d^2}]; convergence of S_p for x <= 1/2 from abs(h_k) <= binom(d+k-1,k). d = 2: H = 1/zeta(2s) (Ramanujan; Rankin at level 1). | confirmed at unramified primes; see C4 |
| Edge Lemma | Factor (j,l) absolutely convergent for Re s > 1 - Re z_j - Re z_l; diagonal factor at the minimum has a pole at s_0 = 1 - 2m; all other factors are evaluated at real part >= 1 at s = s_0 (no zeros there, classical); H_p(s_0) = S_p/R_p > 0 with both positive and finite; H absolutely convergent for Re s > s_0 - 1/2. Non-negative coefficients + pole at s_0 + convergence right of s_0 gives abscissa s_0. | confirmed |
| DH identity a(n)^2 = ((1+kappa^2)/2) chi_0 + ((1-kappa^2)/2)(n/5) | residue classes 1,2,3,4: 1, kappa^2, kappa^2, 1. Residue at 1: (4/5)(1+kappa^2)/2 = (2/5)(1+kappa^2). | confirmed |
| Prime coefficient of f^2 f(s+ig) f(s-ig) = 2a(p)(1 + cos(g log p)) | direct. | confirmed |
| Defects at (2,3) | abs(a)^2: a(6)^2 = 1 vs kappa^4 = 0.0065126; abs(a*a)^2: (2 - 2kappa^2)^2 = 3.3804 vs 16 kappa^4 = 0.1042. | confirmed |
| THIN row: coefficients eps(n)(abs(sigma)^2 * 1_sq)(n) | zeta^2 zeta(s+ig) zeta(s-ig) = zeta(2s) sum abs(sigma_{ig}(n))^2 n^{-s}; eps completely multiplicative factors out. | confirmed |
| zeta(s+a)zeta(s-a) row | z = +-a real: factors zeta(s+2a) zeta(s)^2 zeta(s-2a)/zeta(2s), abscissa 1 + 2a. | confirmed |

## 2. Numerics rerun by the referee (independent script, different cases)

Run as `scripts/memcap.sh 8 .venv-arb/bin/python -I /tmp/c6ref/chk.py` (float64 + mpmath 40 digits; about 1 minute;
script not kept in the lane directory because the referee writes only this file). Range extended to n <= 2*10^4 and
three shifts NOT used in the result: gamma = 21.0220396 (second zeta ordinate), 30.4248761 (fourth), 50.0 (not an
ordinate).

| Check | Referee value | Result's value / claim |
|---|---|---|
| kappa, minimal polynomial x^4+2x^3-6x^2-2x+1 | 0.28407904384..., residual 4.6e-41 | same |
| f^2 for DH, n <= 10^4 | 4000 negative, 2000 zero, first n = 3 | same |
| f^2 for DH, n <= 2*10^4 | 8000 negative, 4000 zero | (new range) |
| f^4 for DH, n <= 10^4 | 4000 negative, coefficient at 3 = -1.136316 = -4 kappa | same |
| zeta^2 zeta(s+ig)zeta(s-ig), 3 new gamma, n <= 2*10^4 | 0 negative (minimum coefficient > 0 in float64; smallest 9.7e-10, so float sign only, not certified) | consistent with identity |
| Ramanujan identity at 3 new gamma | max difference 1.2e-12 to 3.9e-12 (float64) | consistent |
| DH product f^2 f(s+ig) f(s-ig), 3 new gamma, n <= 2*10^4 | 8032, 7990, 7977 negative; first n = 3; coefficient at 3 equals 2a(3)(1+cos(g log 3)) to 1e-16 | same pattern |
| DH coefficient squares, 3 new gamma | minimum 0 (a square); defect at (2,3): 4.285 vs 0.0083; 1.468 vs 0.0057; 2.246 vs 0.00012 | same pattern |
| f(2), abs(f(2 + 38.40 i)) for DH, 2*10^4 terms | 1.0000683, 1.1196423 | 1.00007, 1.11964 |
| tau(n) from prod(1-q^n)^24; primes p <= 100 with cos(4 theta_p) < 0 | 11, 17, 19, 29, 47, 59, 61, 67, 79, 83, 97 (11 primes); closed form of the p^2 log coefficient is cos(4 theta_p), cross-checked against lambda(p^2)^2 - lambda(p)^4/2 at p = 2, 11 | same list |
| Delta^2 coefficients | 0, 0, 1, -48, 1080, -15040, 143820 | c(6) = 143820: same |
| Lemma H, d = 3, sigma = 1, first 25 primes, new gamma = 21.022 and 3.3 | max p^2 abs(log H_p) = 6.22 and 7.05; sum = -0.676 and -0.676 | result: 5.54, 4.50 at its two gamma. Bounded as Lemma H states; the constant depends on gamma within the O_d bound |

Controls: the result claims no zeta-only mechanism, so there is no control that should fail and does not. The
referee reran DH (rows above) and checked by hand U / TW- / THIN (Lemma U), EA (zeta(s+a)zeta(s-a)), and the
Bochner failure of DH itself. All agree with section 3 of the result. The statement "THIN has a real zero in
(1/2,1)" is imported from another lane and was not checked here.

## 3. Corrections (none changes the verdict)

- **C1 (wrong as stated). "By Fejer-Riesz ... Q1 restricted to zeta is exactly the classical cone."** The setting
  fixes multiplicities m_j > 0. Then abs(sum m_j e^{-i t_j theta})^2 has all Fourier coefficients >= 0, which is a
  strict sub-cone: 1 - cos(theta) = (1/2) abs(1 - e^{i theta})^2 is a non-negative cosine polynomial and needs
  coefficients (1, -1). Fejer-Riesz gives real coefficients of either sign. Correct statement: Q1 with m_j > 0 is
  CONTAINED in the classical cone (that inclusion is all the reduction to P25 uses); equality holds only if signed
  (virtual) multiplicities are admitted.
- **C2 (hypothesis of Lemma Q mis-stated).** "{x_p} dense in X = torus of phases times Sato-Tate interval" is false
  whenever the shifts are rationally dependent, which includes the standard case of shifts k*gamma: (gamma log p,
  2 gamma log p) is not dense in the 2-torus. The lemma and proof are correct with X := closure of {x_p} and the
  extra hypothesis that every x_p is a limit of x_q, q != p. For zeta shifts both hold (X is the closed subgroup
  generated by the direction vector; log p_{n+1} - log p_n -> 0). With companions the result's own caveat stands
  (cited, not derived). Also: the lemma tests coefficients at n = pq only and concerns non-negativity of
  coefficients; it does not address products that are non-negative as functions without non-negative coefficients.
- **C3 (classical remark wrong in detail).** For Pi = 1 + sym^2 f, L(s, Pi x Pi~) = zeta(s)^2 L(s, sym^2 f)^3
  L(s, sym^4 f): the exceptional zero has order 3 against a pole of order 2, not "multiplicity 2 against a simple
  pole". Not used in any step.
- **C4 (scope of Lemma H / Edge Lemma).** Written for unramified local factors with Ramanujan (all examples are
  level 1). At ramified primes L_p(s, Pi x Pi~) is not prod (1 - alpha_j conj(alpha_l) x)^{-1}; finitely many primes,
  so the O_d(1) and the abscissa are unaffected, but the lemma should say so. Non-tempered constituents are not
  covered (the result says this in weakest step 2).
- **C5 (reading 1 imprecise for the companion row).** For the row "L(s, Pi x Pi~), Pi = 1 + Delta|.|^{i gamma}, DH in
  both zeta slots" the coefficient at 3 is 2a(3) + 2 lambda(3) cos(gamma log 3) + lambda(3)^2 - 1 = -2.388 at
  gamma_1. It is negative for every a(3) < 0.91, so the failure there is "a(3) != 1", not "sign of a(3)". Still
  a single-coefficient, non-multiplicative reason; conclusion unchanged.

Labelling: Lemma U and the Edge Lemma are elementary consequences of classical facts (Landau; non-vanishing on
Re s = 1). The result labels them "PROVED rel CLASSICAL" and does not present them as new theorems; acceptable.
The map row should read "elementary" for Lemma U.

## 4. What the result does and does not establish

Established: (a) Q1 with positive multiplicities lies inside the P25 cone; (b) coefficient non-negativity of a
product of two log-level forms forces both factors to have non-negative prime coefficients up to a common sign
(zeta shifts; with companions relative to a cited density); (c) coefficient squares are non-negative for every
sequence, DH included, and unimodular-twist invariant; (d) for b = lambda_Pi with positive integer multiplicities
and tempered unramified data, the Landau abscissa of sum abs(b(n))^2 n^{-s} is 1 - 2 min Re z_j for every zero
configuration.

Not established (and not claimed): any exclusion of quadratic objects outside the four named constructions; the
"adds nothing usable" statement for Q3(b) (ARGUED only); the density type Q4 (not run). The referee notes that (d)
extends to signed multiplicities (diagonal exponents m_j^2 > 0 keep the pole; off-diagonal factors are still
evaluated on Re >= 1) but this is not written in the result.

## 5. Requirement flags (strict)

- R1 = false. Positivity in Q3 uses no multiplicativity (Lemma U; DH passes). The one multiplicative step
  (factorisation of D_b) supports only non-vanishing on Re s = 1.
- R2 = false. No new height-uniform statement.
- R3 = false. DH, U, TW-, THIN, EA, Beurling, T-NR pass or are indistinguishable in class Q3.
- R4 = false. Edge Lemma: the device stops at Re s = 1.

holds = true (verdict "precise obstruction" confirmed for the four named constructions, subject to C1 to C5).
