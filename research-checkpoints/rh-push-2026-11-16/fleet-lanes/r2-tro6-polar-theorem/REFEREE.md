# REFEREE: r2-tro6-polar-theorem/RESULT.md

2026-11-16. Adversarial pass. Claimed verdict: partial-result (polar law proved for N(c) <= Q^(1/2-delta); no eta > 0).
Referee scripts: `/tmp/ref-polar/{f.py, lc2.py, fx2.py}` (not kept in the repo).

**Outcome: holds = false as labelled.** Theorem P (a)-(c) survives re-derivation and independent numerics. Section 3
survives. The label PROVED-rel on section 4.3-4.4 (the "equivalence" TRO6-natural(eta) <=> (RB_eta)) does not: it uses
two lower bounds and a row geometry that are not proved, and it is for a toy analogue of the manuscript form. The
headline "108 conductors x 12 classes at 1-3%" is also overstated. No false QED. No RH assumption. Nothing restates
verified height. The verdict "partial result, no eta > 0" stands.

## 1. Theorem P: CONFIRMED at the level of the written outline

Re-derived by hand, independently of the scripts:

| step | check | result |
|---|---|---|
| 0, (2.1) | Mellin inversion, residue at w = 2/3 is W1^(1/6) X^(2/3) (2/3) rho; error by Cauchy-Schwarz and (MV) | X^(-1/2+eps) Q^(1+eps). Agrees. |
| 1 | dual lattice of LO under Tr(x xi/lambda) is L^(-1)O; covolume (sqrt3/2)N(L); radial Fourier transform | Phi(4QN(n)/(3N(L))), prefactor 2Q/sqrt3. Agrees. |
| 1 | Mellin transform of Phi | pi^(1-2z) Gamma(z)/Gamma(1-z) W^(1-z), valid 0 < Re z < 3/4. Agrees. |
| 3 | resonance criterion; R(j^6, s) = 1; E0 = {+-4^i lambda^(3j)} from the classical supplementary laws (quadratic part of chi_s(2) is mod 8, cubic parts of chi_s(omega), chi_s(lambda) are independent characters mod 9) | Agrees; the "table-read" moduli are the classical ones. |
| 4 | density of a class mod 4 among primary s prime to 6cj | (1/12)(r_F/2) phi(cj)/N(cj) = (r_F/24) phi(cj)/N(cj). Agrees. |
| 4 | sum_j N(j)^(-6z) phi(j)/N(j), residue at z = 1/6 with factors at 2, lambda, p | c removed | (r_F/(10 zeta_F(2))) prod_{p|c}(1+1/Np)^(-1). Agrees (3/5 from 2 and lambda). |
| 4 | delta != 1 terms: powers of N(delta) | phi(delta) N(delta)^(-2) from (F2), residue and frequency, times N(delta)/phi(delta) from the j-sum (j may share primes with delta) = N(delta)^(-1). Agrees. |
| 4 | exponents | Q * Q^(-1/6) = Q^(5/6); N(c)^(-1/2+1/6) = N(c)^(-1/3). Agrees. |
| 4 | K0 at 25 digits | 0.0206958695927; zeta_F(2) = 1.2851909554841. A(tau,tau) = 7.0374868. Agrees. |
| 5 | effective conductor over length: N(n)N(c)N(delta)/X <= N(c)^2 Q^(eps-1), each prime of c counted once (ramified or removed Euler factor) | Agrees. Loss Q^(O(eps A)) from the weight derivatives is absorbed by delta. |
| (c) | s-character for chi_c^k is chi_s(n c^(k-1)/e0) R^k; valuations k-1 or k at p | c | Agrees; no resonant frequency for k = 2..5, c != 1. |
| (b) | Fourier weights 3/4, -1/4 (N = 4) and 2/3, -1/3 (N = 3); lambda-series sums to z 3^(-1/3) | Agrees (both signs evaluated). |

Independent numerics (different cases from the author's):

* Lemma F, own driver on `zomega`: new primes 31, 37, 43, conjugate primes, the inert prime 5 (norm 25), cubes of a
  prime in s, frequencies up to |n| = 200, seed 2026. (F1) 64 comparisons, max diff 5.1e-11. (F2) 40 comparisons,
  6.6e-12. New: the k = 2..5 formula (coprime case) 45 comparisons, 1.1e-12, and vanishing for (n, c) != 1, 5.3e-13.
* Residue calculus (`limit_check.py` with weight j = 2 and lengths 3e8, 3e11, 3e14, neither used by the author):
  relative deviation 0.028, 0.0028, 0.0008 (all rows); 0.084, 0.0085, 0.0017 (rows prime to 6).
* Finite-cutoff form, c = 1, new weight j = 4 and new Q = 1200, 2400: sum|data - form|/sum|form| = 0.025, 0.025
  (all rows), 0.024, 0.020 (rows prime to 6).
* sigma'(c) = [-c]: the referee pairing 0-1, 2-8, 3-11, 4-10, 5-9, 6-7 is multiplication by -1 on MOD4_REPS
  (checked by hand on all six pairs). Confirmed.

Remaining caveats on Theorem P (none is an error found):

* Steps 4-6 are an outline. The split into resonant and non-resonant frequencies, and the uniformity of the Mellin
  bounds in n, were checked for consistency of exponents only.
* It is relative to Theorem A (pole of D_sigma at u = 2/3 only, (MV) over all rows m in O), to Lemma 4.4, and to
  S = S0. The manuscript's S' and xi are not covered (stated).
* The O(Q^-A) remainder has no numerical support (stated). The test weights (1-x)^j are not in C_c^infinity(0, inf),
  so for them the theorem itself gives no O(Q^-A).
* `limit_check.py` shares the density r_F/24 and the class tables with the closed form. It tests the two residues
  and the geometric series, not the Poisson step.

## 2. Errors and gaps

### E1. Section 4.3-4.4 is labelled PROVED-rel; it is conditional on three unproved inputs

The comparison is against the right side of TRO6-natural, M_sigma(cQ)^(1/2) ||B^J||_Q, which is made of actual
quantities, not upper bounds. Section 4.3 sets it equal to Q^(11/12).

* **Lower bound for ||B^J||.** Lemma 15.1 is an upper bound, ||B^J||^2 << Z^(M'+eps). Section 4.1 itself labels
  ||B||^2 ~ Q HEURISTIC. The slack is Z^(-(2-eta)/96) = Q^(-(2-eta)/80). If ||B^J||^2 is below Q by more than that,
  the polar part is not below the TRO6 right side and both directions of "<=>" fail.
* **Lower bound for M-natural.** Theorem A gives M << Q^(5/6+eps). Theorem P at c = 1 with Cauchy-Schwarz gives only
  M >> Q^(2/3). The order Q^(5/6) is "subtract-note Prop 2.3 [S]" (sketch) plus a measured slope 0.868.
* **Row length.** D = Z^(7/6) is the toy ratio (1+l)/M = 1.4 of the conjecture note, not read from the manuscript.
  `tro6-spectral` D1 writes the same row with Mellin weight Z^t, i.e. length Z. The two give different exponents:
  Z^((7/6)(beta0 - 25/28)) against Z^(beta0 - 65/72). At beta0 = 7/8: -1/48 against -1/36. Both are below -eta/96 for
  eta <= 1, so the conclusion is the same for either choice. But the manuscript signal Z^(C(x)), C(x) = x - 11/16,
  has slope 1 in x, and section 4.3 has slope 7/6. One of the two bookkeepings is wrong and the note does not say
  which. Section 4.2 is labelled "PROVED bookkeeping" on this unverified input.
* **Scope.** The equivalence is for psi = 1, S' empty, no xi, the n = 1 part, one tuple. TRO6-natural is uniform in
  J and has xi(m) (rows prime to 6, where A_6 and 4 characters apply, not A and 12). The headline sentence
  "TRO6-natural(eta) is equivalent to the same bound on the remainder sum alone" should read "the toy n = 1 analogue".
* **Content.** R := T - P is a definition at N(c) ~ Q^(7/5). Given a bound on B_P the equivalence is the triangle
  inequality. It says the polar law is irrelevant at the manuscript scale. It does not locate a new object.
* The 1/L bound on Re s = beta0 + eps for the twelve Groessencharacter twists (alpha has infinite order) is standard
  given a zero-free half-plane, with constants polynomial in conductor and (1+|v|). Acceptable relative to the
  manuscript, which claims 7/8 for all Hecke L-functions of F. Not circular.

Correct label: HEURISTIC-rel (7/8 manuscript; M >> Q^(5/6-eps); ||B^J||^2 >> Q^(1-eps); D in [Z, Z^(7/6)]).

### E2. "108 conductors x 12 classes at 1-3%" is not what the table shows

* 1-3% is the c = 1 statistic (12 runs; reproduced here on two new runs).
* For c != 1 the table gives rms(data - form)/rms(form) = 0.065, 0.066, 0.13, 0.19, 0.33 by band (all rows) and
  0.077, 0.077, 0.16, 0.36 (rows prime to 6). What holds: correlation 0.94-0.998 and amplitude ratio 0.955-1.006.
* The residual 0.25 at N(c) <= 56 is called estimator noise; no noise estimate for the twisted sums is given.

### E3. The data are the stripped estimator, not the coefficient of Theorem P

* The matched quantity is rho_str (squarefree moduli, cutoff 1e7). The table says so; the summary does not.
* The stored complete-coefficient estimator rho_nat is printed in `finiteX_c1.log` and is not compared. It differs
  from the finite-cutoff form by 16-18% in the resonant class (18.48 against 15.70 at Q = 3199, j = 2; 12.04 against
  10.41 at Q = 2400, j = 4). No finite-cutoff form for rho_nat is derived. `predict_inf_str` is a stub returning None.
* So K0, the delta != 1 terms, the j^6 frequencies and the factor phi(c)/N(c) of Theorem P have no data support.
  Their only checks are the hand derivation and `limit_check.py`. The form tested on data carries N(c)/(N(c)+1).
* "Differ from the limit by up to 3.6x" compares a stripped estimator at finite cutoff with the complete
  coefficient at cutoff infinity. Two effects are mixed: cutoff, and stripped against complete.

### E4. Minor

* Section 3 header says PROVED-rel Theorem P. B_P is defined with P(c) for every c; Theorem P gives T = P + O(Q^-A)
  only for N(c) <= Q^(1/2-delta). The 1/L formula is an identity for the defined B_P. It is "the polar part of the
  theta-row form" in the sense of an asymptotic only for rows supported on N(c) <= Q^(1/2-delta).
* "Prop S is the Cauchy-Schwarz size of the polar term" depends on the same HEURISTIC ||B||^2 ~ Q ||beta||^2.
* E is bounded in Re s >= 1/2 only after the stated restriction to p not dividing 6 (norms >= 7). Fine as written.

## 3. Required controls

* **DH.** Theorem P has no target and makes no statement about zeros. Nothing has to fail for Davenport-Heilbronn.
  The account in section 6 is correct: complete multiplicativity enters only in sum mu chi N^(-s) phi/N = E/L.
* **RH / zero-free input.** None in Theorem P. Section 4.3 uses the unrefereed 7/8 half-plane for Hecke L-functions
  of F and says so.
* **Verified height, flow, MV-CAP.** Not engaged.
* **Obstruction (range N(c) <= Q^(1/2-delta)).** Real for the method used: Step 5 bounds each non-resonant frequency
  alone, and the dual length is N(c)^2/Q. One way around, not tried: keep the n-sum. The double sum over (s, n) of
  chi_s(n c^0/e0) is a sextic double Dirichlet series with its own functional equations, and its polar lines give
  further explicit terms of T_sigma(c) beyond Q^(1/2). A second route is to sum over c with mu(c) before bounding
  (Type I / Type II in c), as proposed in `tro6-period/REFEREE.md` section 4. Neither can be target-blind in the end
  (Theorem D), which is consistent with the DH wall.

## 4. Surviving claim

PROVED-rel (Theorem A, Lemma 4.4, classical supplementary laws; Steps 4-6 in outline, constants re-derived
independently): for squarefree primary c prime to 6 with N(c) <= Q^(1/2-delta) and W in C_c^infinity(0, inf),
T_sigma(c; 1, 1) = K0 A(sigma, [c]) gamma_1(c) conj chi_c(-e0) N(c)^(-1/3) (phi(c)/N(c)) W^(5/6) Q^(5/6) + O(Q^-A),
K0 = 0.0206959; the analogue with A_6 on rows prime to 6; no Q^(5/6) term for chi_c^k, k = 2..5, c != 1. Lemma F is
exact (confirmed on new cases including an inert prime). The defined polar sum B_P equals a combination of at most
12 terms E/L(5/6+t, alpha^2 nu omega0 theta) (4 on rows prime to 6).

MEASURED: the squarefree finite-cutoff form of Steps 1-3 matches the stored stripped estimator at 2-3% for c = 1 and
with correlation 0.94-0.998, amplitude 0.955-1.006 for 108 conductors; sigma'(c) = [-c].

HEURISTIC: at the manuscript scale the polar sum is below the TRO6 right side by Z^(-1/48) to Z^(-1/36), given the
7/8 half-plane and the orders M ~ Q^(5/6), ||B||^2 ~ Q.

OPEN: any eta > 0; T_sigma(c) for N(c) > Q^(1/2); the complete-coefficient constant against data; the manuscript
normalisation; the slope mismatch with C(x). No change to theta or to any Lambda value.
