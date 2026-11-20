# REFEREE (lens: general) for c5-twisted-helson-arcs/RESULT.md

Date: 2026-11-18. Referee is a separate agent from the author. Verdict under review: precise-obstruction, family closed, nothing about zeta zeros.

## Outcome

**The verdict holds.** Every PROVED step was re-derived and confirmed; the numerics were reproduced with an independent program on different cases. Four wording corrections are listed in section 4; none changes the verdict. No step assumes RH, none restates verified height, no bound moves, and no statement about a zero of zeta is made.

Flags set by the referee: R1 = false, R2 = false, R3 = false, R4 = false.

## 1. PROVED steps, re-derived

**Lemma A (a).** sum_{a mod p} e(an/p) = p [p | n], so sum_{a mod p} T(x; a/p) = p sum_{m <= x/p} chi(pm) = p chi(p) S(x/p). Uses complete multiplicativity at chi(pm) = chi(p) chi(m) (also for p | m). The a = 0 term is S(x); the other p - 1 terms are bounded by C_p x^theta. (*) confirmed. Checked exactly on integers in the rerun (p = 3, 7, 101, three sets: both sides equal).

**Lemma A (b).** c x = chi(p) c x + O_p(x^theta), c != 0, gives chi(p) = 1. Confirmed.

**Lemma A (c).** Confirmed, including the step the author flagged.
- u(x) = chi(p) u(x/p) + O_p(x^(theta-1)); iterating over prime factors gives u(rx) = chi(r) u(x) + o_r(1) for each fixed positive rational r.
- Lipschitz: for x' >= x, u(x') - u(x) = (S(x') - S(x))/x' + S(x)(1/x' - 1/x), so |u(x') - u(x)| <= 2 (x'/x - 1) + 1/x'. Confirmed.
- |u(2^k y)| = |u(y)| + O(y^(theta-1)) uniformly in k >= 0 (geometric sum of the errors of (*) at p = 2). For z >= x write z = 2^k t x with t in [1, 2), pick r in a finite eps-net of rationals with |t/r - 1| < eps: |u(z)| = |u(2^k r x)| + O(eps) = |u(r x)| + O(eps) + o(1) = |u(x)| + O(eps) + o_eps(1). So sup_{z >= x} ||u(z)| - |u(x)|| -> 0; |u| is Cauchy, the limit l exists and equals limsup |u| > 0. The passage from limsup > 0 to l > 0 is correct.
- (chi(r) - chi(r')) u(x) = u(rx) - u(r'x) + o(1) and the Lipschitz bound give |chi(r) - chi(r')| <= (2/l) |r/r' - 1| (r >= r'). A uniformly continuous homomorphism from the positive rationals to the circle extends to a continuous character of the positive reals, which is r^(-i alpha). Confirmed.
- Remark: step (c) never uses M, and the constants C_p, x_p may depend on p without harm (only finitely many primes enter each estimate).

**Lemma A (d).** Partial sums of e(an/q) are bounded by 1/(2 ||a/q||) <= q/2; total variation of n^(-i alpha) on [1, x] is at most |alpha| log x. Abel summation gives O(q (1 + |alpha| log x)). Confirmed (CLASSICAL).

**Case S = o(x).** Gauss-sum expansion of a primitive psi mod q: q terms of size q^A x^theta divided by |tau| = q^(1/2) gives q^(A+1/2) x^theta. For Liouville, F_psi = L(2s, psi^2)/L(s, psi), so the hypothesis is the strip statement for every L(s, psi). Confirmed; the hypothesis equals the conclusion.

**Lemma B.** sum |chi(n) - c|^2 = x (1 + |c|^2) - 2 Re(conj(c) S) = x (1 - |c|^2) - 2 Re(conj(c) E). Confirmed. |c| = 1 gives chi(n) within eps of c on a set of density 1 - delta; for fixed m in the set, n and mn are both in the set for a positive proportion of n, so c = c^2, c = 1, and then chi(n) = chi(nm)/chi(m) = 1 for every n. Confirmed. Prime q in (x, 2x]: sum_{a mod q} |T|^2 = q floor(x) because n <= x < q are distinct residues; taking q near 2x gives q x - |S|^2 >= x^2, hence q^(2A+1) x^(2 theta) >> x^2, A + theta >= 1/2. Confirmed. For chi = 1, |T(x; 1/q)| = |sin(pi x/q)/sin(pi/q)| is of order x. Confirmed.

**Lemma C.** g(p^k) = chi(p^k) - chi(p^(k-1)) = 2 (-1)^k for p in S, 0 otherwise. Inner sum: x/d + O(1) when q | d, at most 1/(2 ||ad/q||) <= q/2 otherwise (for composite q and d sharing a factor with q the reduced denominator is still > 1). sum_{d <= y} |g(d)| << y^(b+eps) since prod_{p in S} (1 + 2 p^-s/(1 - p^-s)) converges for s > b; the tail sum_{d > x, q | d} g(d)/d contributes O(x^(b+eps)). Local factor at p in S: sum_{j >= k} 2 (-1)^j p^-j = 2 (-1)^k p^(1-k)/(p + 1); dividing by (p - 1)/(p + 1) gives 2 (-1)^k p^(1-k)/(p - 1). c_p = -2c/(p - 1). Confirmed. Arithmetic against the table: c/3 = 0.00861348 (q = 9), c/2 = 0.01292021 (q = 15), -c/2 (q = 5), -c/3 (q = 7), -c/11 (q = 23), -c/50 (q = 101). All match.

**Theorem 1'.** Euler-product logarithms: sum_p sum_k psi(p)^k (chi(p)^k + conj(chi(p))^k - 2) p^(-ks)/k = -2 A(s, psi); |a_n psi(n)| <= a_n gives absolute convergence on Re s > sigma_0. Confirmed. For real chi the Euler product gives F_{chi psi} = L(s, psi) exp(-A(s, psi)) directly. Confirmed. sigma_0 as defined in the parent lane (largest real zero of F in (theta, 1), or theta) was checked against c4-helson-discrepancy-zerofree/RESULT.md line 10. This is a one-line consequence of the parent Theorem 1 and should be labelled a corollary.

**Test 1 (no inconsistency).** Checked independently that the greedy set gives an exact double zero at b with theta < b possible: sum_{p in S} p^-s = int x^-s d Ei(b ln x) + (Stieltjes integral of an O(1) counting error, convergent for Re s > 0) = E_1((s - b) ln 2) + analytic = -log(s - b) + analytic, and the k >= 3 terms converge for Re s > b/3. So G(s) = (s - b)^2 times a non-vanishing analytic function on Re s > b/3, F = zeta G has a double zero at b, no real zero in (b, 1), and no singularity that forces E(x) to have exponent b. A discrepancy exponent below b is consistent with Theorem 1 of the parent lane. Confirmed.

## 2. Numeric rerun (different cases, independent code)

Program: referee scratch script /tmp/c5ref/chk.py, not kept in this directory because the referee writes only this file (numpy only, own sieve and own Ei/E_1 series; run locally through scripts/memcap.sh 8; planned memory 1.0 GB printed). N = 1e8. Cases not in the result: greedy b = 0.8; random b = 0.8 seed 7; random b = 0.9 seed 11 (numpy generator, not the author's xorshift). E_1(0.1 ln 1e8) = 0.0609733 matches the author's log.

| Case | size of S | c | fitted exponent of octave max of E (k >= 12, 16, 18) | main term check T(N; 1/q)/N against c_q | twisted error two-point exponent, x = 1e6 to 1e8 |
|---|---|---|---|---|---|
| greedy b = 0.8 | 184,051 | 0.12658675 | 0.39, 0.37, 0.38 | q = 5: -0.06331529 / -0.06329337; 7: -0.04221947 / -0.04219558; 23: -0.01150679 / -0.01150789; 3, 9, 19, 103 (not S-numbers): below 8e-5 | 0.45 to 0.67 |
| random b = 0.8, seed 7 | 91,870 | 0.40910064 | 0.52, 0.50, 0.49 (c uncertain, as the author notes) | q = 7: -0.13640281 / -0.13636688; 11: -0.08184861 / -0.08182013; others below 3e-5 | 0.38 to 0.53 (q = 3: 0.94 from a very small start value, error 2.4e3 at 1e8) |
| random b = 0.9, seed 11 | 510,386 | 0.07502520 | 0.47, 0.41, 0.41 | q = 7: -0.02506330 / -0.02500840; 19: -0.00826930 / -0.00833613; 103: -0.00143231 / -0.00147108 | 0.31 to 0.55; all errors at 1e8 at most 1.33e4 |

Findings: the main terms of Lemma C are reproduced (THIN fails the strict form); the greedy discrepancy exponent is well below b (0.38 at b = 0.8, between the author's 0.33 to 0.35 at b = 0.7 and 0.41 at b = 0.9); a random member with a zero at b = 0.9 has twisted errors of exponent about 0.4 to 0.5 for q <= 103. The greedy twisted errors are again larger than the random ones (q = 15: 1.0e5 against 3.1e3), consistent with the author's residue-class bias finding. Agreement with the result on every measured claim tested.

## 3. Controls

No zeta-only mechanism is claimed (the output of Lemma A is an identification, and Theorem 1' is relative to L(s, psi)), so there is no mechanism whose failure on controls needs to be demonstrated. What was checked:
- THIN: fails the strict form (main term reproduced numerically, three new sets), passes the general form (Lemma C re-derived; random exponents reproduced).
- WT, n^(-i alpha): passes both forms (Lemma A (d) re-derived). It is the residual class and is removed only by fixing M(x) = c x.
- DH: coefficients are periodic mod 5 and not completely multiplicative; S(x) = O(1), so it sits in the c = 0 branch, outside Lemma A, and T(x; a/5) has a linear main term (Gauss sum). The table entry is correct.
- Beurling row: the integer-supported case uses an indicator, which is not unimodular, so it is outside the class of Lemma A as stated; the row is a heuristic remark, not a proved control outcome. Not load-bearing.
- Backward heat, T-NR, zeta(s+a)zeta(s-a), phase-rotated transfer operator, theta^w: not formulable in the class; correctly marked not run.

## 4. Corrections (wording; none changes the verdict)

1. **The summary sentence drops a hypothesis.** "Any theta < 1 forces chi = n^(-i alpha)" and "the strict form defines the same class for every theta < 1" hold only under limsup |S(x)|/x > 0. In the branch S(x) = o(x) (Liouville and relatives) the strict form is not an identification: it is equivalent to the strip statement for all L(s, psi). The body of the result (section 2, "Case S(x) = o(x)") says this; item 2 of the verdict and the proposed map row P44 should carry the qualifier. In that branch the family is closed by circularity (map row P14), not by Lemma A.
2. **"Zeros of the twisted series right of sigma_0 are those of L(s, psi), no twisted hypothesis needed" is exact only for real chi.** For complex chi, Theorem 1' gives the product F_{chi psi} F_{conj(chi) psi} = L^2 exp(-2A); without H_g the factors are not known to continue separately, and with H_g one gets inclusion (zeros of each factor are zeros of L(s, psi), with ord sum = 2 ord L), not equality of zero sets. THIN is real, so the use made of it is unaffected.
3. **"sigma_0 = b = 0.9 exactly" depends on theta < b**, which is MEASURED (x <= 4e10), not proved. If theta >= b then sigma_0 = theta by definition. In both cases Theorem 1 of the parent lane is not contradicted, which is the claim that matters.
4. **Random twisted exponents are endpoint ratios at checkpoints** (values of max_a |T - c_q x| at x = 1e6 and 1e10), not fits to running maxima; local slopes in the author's own table range from negative to above 1. "About 0.45" is supported as an order of magnitude only. Also q = 19 and q = 101 are in S for seed 1 (c_q != 0), so the sentence "twisted sums at q not an S-number ... are not affected" does not cover them; the effect of the uncertainty in c there is about c_q x N^(b/2-1), a few hundred against 5e4 to 9e4, so negligible.

Further remarks.
- Novelty: Lemma A is consistent with, and close to, standard pretentious theory (Halasz: S(x) not o(x) forces chi to pretend to be n^(i alpha); Montgomery-Vaughan / Daboussi on exponential sums with multiplicative coefficients). It should be recorded as an elementary rigidity lemma, probably folklore, not as a new theorem. Theorem 1' is a corollary of the parent lane. The result already marks novelty as unchecked.
- The finite-Q remark needs at least two primes below Q_0 for step (c) (density of the {2, 3}-smooth rationals); with M = c x, step (b) needs nothing.
- The pivot estimate in section 7 is stated without proof and is correctly not claimed.

## 5. Requirement flags (referee's own setting)

- R1 = false. Complete multiplicativity is essential in Lemma A (a), but the lemma identifies chi and no statement about zeta zeros uses all primes together.
- R2 = false. No height-uniform or every-window conclusion exists.
- R3 = false. In the general form THIN passes; in the strict form WT passes unless the pole is fixed by hand, and the conclusion is an identification with no zero statement for controls to fail.
- R4 = false. Nothing is carried from finite stages or from Re s > 1 to the critical line.

## 6. What survives

For unimodular completely multiplicative chi with S(x) not o(x): power-saving twisted sums with no main term at prime moduli force chi = n^(-i alpha) (chi = 1 if the main term is c x), by the identity sum_{a mod p} T(x; a/p) = p chi(p) S(x/p); the hypothesis is then a classical fact. With S(x) = o(x) the strict hypothesis is the strip hypothesis itself. With main terms allowed, the THIN family passes (error O(q x^(b+eps)) proved; about x^0.4 to x^0.5 measured for random members with a zero at b, q <= 103, x <= 1e10 by the author and x <= 1e8 by the referee). Twisted hypotheses in this family give no zero-free statement for zeta or L(s, psi). Status: author-checked plus one referee (general lens).
