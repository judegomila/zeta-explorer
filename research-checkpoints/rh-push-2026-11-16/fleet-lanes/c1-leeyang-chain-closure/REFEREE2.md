# REFEREE2: c1-leeyang-chain-closure, step 2.1(c) and the GHS input with hidden spins

Date: 2026-11-17. Second pass, owed from round 1 (lane `c2-repair-owed-passes`). Scope: (A) step 2.1(c) of the
repaired Thm 6(d'): closure of the Laguerre-Polya class under `e^{-lambda D^2}` at Gaussian decay; (B) the
Griffiths-Hurst-Sherman inequality in the form used in Theorem C(a): fields `h lambda_i >= 0`, some `lambda_i = 0`.
Labels: CONFIRMED (re-derived), SOURCE (statement read in the source in this pass), CLASSICAL (cited, source not
opened), MEASURED. Nothing here is a statement about zeros of zeta.

## Outcome

**(A) holds, by two independent routes; the cited input was read in the source and matches the hypothesis used.**
**(B) holds as a use of the classical theorem; the source was not opened; a brute-force check of the exact form used
found no violation.** Thm 6(d') (all t <= 0) and Theorem C stand. The result's weakest step 1 is discharged for (A)
and reduced to a citation check for (B).

## A. Step 2.1(c)

Claim: if `H_{t0}`, `t0 < 0`, has only real zeros, then `H_t` has only real zeros for `t0 < t < 0`.

A1. Input from Lemma M: `H_{t0}` is in the Laguerre-Polya class with Gaussian exponent `0 <= a <= 1/(4|t0|)`.

A2. Route 1 (the result's). `H_{t0+lambda} = e^{-lambda D^2} H_{t0}`:
- Operator identification. On `e^{izu}`, `D^2` acts as `-u^2`, so `sum_k (-lambda)^k D^{2k}/k!` acts as `e^{lambda u^2}`.
  Under the integral, `sum_k int (lambda u^2)^k/k! e^{t0 u^2} |K| e^{|y||u|} du = int e^{(t0+lambda) u^2} |K| e^{|y||u|} du`
  is finite for `lambda < |t0|`, so the series converges to `H_{t0+lambda}` locally uniformly. The Gaussian-average form
  `E[H_{t0}(z + i sqrt(2 lambda) X)]` is the same function (`E e^{-u sqrt(2 lambda) X} = e^{lambda u^2}`; Fubini as stated).
  CONFIRMED.
- Classical input. SOURCE: Craven and Csordas, "Differential operators of infinite order and the distribution of
  zeros of entire functions", Lemma 3.2: if `phi(x) = e^{-alpha_1 x^2} phi_1(x)` is in L-P, `f(x) = e^{-alpha_2 x^2} f_1(x)`
  is in L-P* (L-P times a real polynomial), `alpha_1, alpha_2 >= 0`, `0 <= alpha_1 alpha_2 < 1/4`, `phi_1, f_1` of genus 0
  or 1, then `phi(D) f` is in L-P* and has no more non-real zeros than f. Their Remark after Lemma 3.1 (Polya's
  example `phi = e^{-alpha_1 x^2}`, `f = e^{-alpha_2 x^2}`) shows `alpha_1 alpha_2 < 1/4` is necessary for the series to
  converge. With `phi = e^{-lambda x^2}` (`alpha_1 = lambda`, `phi_1 = 1`) and `f = H_{t0}` (`alpha_2 = a`, no non-real
  zeros): the hypothesis is `4 a lambda < 1`, which is the condition written in the result, and
  `4 a lambda <= lambda/|t0| < 1`. The input applies at Gaussian decay (order 2); no hypothesis stronger than the one
  stated is needed. CONFIRMED.
- Check of the threshold (MEASURED and exact): for `f = (z^2 - x_1^2) e^{-a z^2}` the Gaussian average is
  `q^{-1/2} e^{-a z^2/q} (z^2/q^2 - 2 lambda/q - x_1^2)`, `q = 1 - 4 a lambda`; it exists iff `q > 0` and its zeros
  `+- q sqrt(x_1^2 + 2 lambda/q)` are real. 96 cases (`a` in 0.1..3, `4 a lambda` in 0.1..0.99) against mpmath quadrature:
  maximum relative difference 1.1e-15 (`checks.py cc`).

A3. Route 2 (first referee's), re-derived; it does not use `4 a lambda < 1`. `(1 - (lambda/n) D^2)^n H_{t0}` has kernel
`(1 + lambda u^2/n)^n e^{t0 u^2} K(u)`. Each factor `1 -+ c D`, `c = sqrt(lambda/n)`, maps L-P to L-P or 0:
`f - c f' = -c e^{z/c} (e^{-z/c} f)'`, L-P is closed under multiplication by `e^{bz}` (b real) and under
differentiation. `(1 + lambda u^2/n)^n <= e^{lambda u^2}` gives dominated convergence to `H_{t0+lambda}` locally uniformly
for `lambda < |t0|`; the limit is not identically 0 (transform of a non-zero kernel); Hurwitz. CONFIRMED.
Route 2 still needs Lemma M (membership of `H_{t0}` in L-P, not only real zeros): closure under differentiation fails
for real-rooted functions outside L-P (Craven-Csordas give `(x+1) e^{x^2/2}`).

Consequence: Thm 6(d') holds for all `t <= 0` as stated, for the stages with a certified off-line zero in the strip.

## B. GHS with hidden spins

Form used (Theorem C(a)): finite set of spins `sigma_i = +-1`, pair couplings `J_ij >= 0`, zero field, weights
`lambda_i >= 0` (hidden spin: `lambda_i = 0`), `S = sum lambda_i sigma_i`. Then `d^3/dh^3 log E e^{hS} <= 0` for `h >= 0`.

B1. Reduction (CONFIRMED). `E e^{hS}` is the partition-function ratio for site-dependent fields `h_i = h lambda_i >= 0`.
By the chain rule `d^3/dh^3 log E e^{hS} = sum_{i,j,k} lambda_i lambda_j lambda_k u_3(i, j, k)` evaluated at fields
`(h lambda_i)`, `u_3` the third Ursell function. So the form used follows from: `u_3(i, j, k) <= 0` for all triples
(repeated indices included) whenever all `h_l >= 0`, with `h_l = 0` allowed at any site.

B2. Classical statement (CLASSICAL; not opened). Griffiths-Hurst-Sherman 1970 (J. Math. Phys. 11, 790): for a
spin-1/2 Ising ferromagnet with pair interactions and non-negative external fields, the third Ursell function is
non-positive (concavity of each magnetisation `<sigma_i>` in each pair of fields). Lebowitz 1974 ("GHS and other
inequalities", Comm. Math. Phys. 35) rederives it "for Ising ferromagnets with pair interactions" (this phrase was
seen in a search summary; the paper was not opened: two fetch attempts failed). The standard statement has
site-dependent fields `h_l >= 0`; zero field at a site is the boundary case and is included by continuity of `u_3`
in the fields. A hidden spin is therefore inside the hypothesis: it is a spin with field 0. No extension of the
theorem is needed.

B3. Brute force (MEASURED, `checks.py ghs`): 1500 random ferromagnets, 4 to 7 spins, couplings 0 or uniform in
(0, 1.5), fields 0 (probability 2/3) or uniform in (0, 2); all `u_3(i, j, k)` by exact enumeration: maximum
`4.4e-16` (rounding; the all-zero-field systems give exactly 0). Sanity: with fields <= 0 the maximum is +0.77, and
with antiferromagnetic couplings +0.77, so the test detects violations.

B4. The certificate of Theorem C(c) (exact rationals, `checks.py q44`): `(w^2 - (44/23) w + 1)(w+1)^44` has minimum
coefficient 0 and third cumulant `+0.03791` at `w = 108/55`; `m = 43`, `cos = 43/45`: `-0.02249`; new member `m = 48`,
`cos = 24/25`, `w = 19/10`: `+0.28502`, minimum coefficient 0. Agrees with the result and the first referee.

B5. Limit step (b): weak convergence with uniformly bounded exponential moments gives convergence of `E e^{h S_N}`
on the real axis and local boundedness on C; Vitali; the limit is positive on the real axis. CONFIRMED.

## Corrections

1. Step 2.1(c): replace "(CLASSICAL: Polya; de Bruijn 1950; recalled, not opened)" by the reference to
   Craven-Csordas Lemma 3.2 (hypothesis `alpha_1 alpha_2 < 1/4`), or by route 2.
2. Weakest step 1: the sentence "if the last input needs a stronger hypothesis than stated, 6(d') holds only on
   (t_1, 0]" can be removed.
3. Theorem C(a): say "GHS with site-dependent fields `h_i = h lambda_i >= 0` (zero allowed)", and keep the label
   "PROVED-rel GHS" until the 1970 paper or Lebowitz 1974 is opened.

## What this pass does not cover

Everything outside (A), (B). The first referee's wording correction stands: "Phi in cl(L) is strictly stronger than
RH" is not established for the single law Phi; GHS holds for Phi and (measured) for the DH kernel, so the
separating condition carries no zero information. Requirement flags unchanged (all false).
