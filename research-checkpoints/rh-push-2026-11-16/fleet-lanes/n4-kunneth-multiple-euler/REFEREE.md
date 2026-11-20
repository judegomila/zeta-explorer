# REFEREE: n4-kunneth-multiple-euler

Referee verdict: **holds = false as written** (two PROVED statements are wrong in the stated form). The lane closure itself survives in a corrected, narrower form (last section). Nothing in the result assumes RH, restates verified height, or presents a known theorem as new.

Referee run: `scripts/memcap.sh 8 .venv-arb/bin/python /tmp/n4ref/ref_check.py` (prime powers <= 3e4, 3320 terms, 176 MB dense, a few seconds; script kept outside the lane directory because only this file may be written here). No ssh.

## Errors

### E1. "Regular at rho_1 + rho_2 for every sign pattern" is false on the diagonal rho_1 = rho_2 (the points k rho that Lemma K1 uses). Label PROVED must be withdrawn for that case.

The two-line proof in 2.3 uses that the path of s - w - rho_2 is the negative of the path of w - rho_1, so the two logarithm increments cancel. That needs the segment [c, s-c] to miss rho_1. At s = rho_1 + rho_2 the segment contains rho_1 exactly when (rho_1 - c) and (rho_2 - c) are positive multiples of each other; this always happens for rho_1 = rho_2 (the midpoint of the segment is s/2 = rho). There the two poles w = rho and w = s - rho of the integrand pinch the path.

Exact statement for the model term 1/((w-rho)(s-w-rho)): the segment integral is 2 Log[(s-c-rho)/(c-rho)] / (s - 2 rho) (principal Log on the straight-segment sheet). At s = 2 rho the ratio is -1, on the cut. So s = 2 rho lies on the branch cut that leaves the branch point c + rho along the ray s = c + rho - lambda (c - rho), lambda > 1, and on the two sides of the cut the function has a simple pole at 2 rho with residues +2 pi i and -2 pi i (in the result's C-normalisation: -1 and +1).

Measured (referee run, model zeros 0.5 +- 14.1i, 0.62 + 25.3i, 0.38 - 25.3i, c = 1), (s - s0) C(s) at distance r on the two sides of the ray:

| s0 | r = 1e-2 | r = 1e-3 |
|---|---|---|
| 2 rho_0 | -0.99890, +0.99886 | -0.99989, +0.99989 |
| 2 rho_1 | -0.99884, +0.99890 | -0.99988, +0.99989 |
| rho_0 + rho_1 | 1.2e-3, -1.2e-3 (linear in r) | 1.2e-4, -1.2e-4 |
| rho_0 + conj(rho_0) | 2e-8 | 2e-9 |

The author's own `residue_check.log` already shows this: the three diagonal lines (i = j) give 3e-5 .. 2e-4, the off-diagonal lines give 1e-30 .. 1e-36. The diagonal values are not quadrature error around zero; they are the average over a circle of a function with residue -1 on one half and +1 on the other. RESULT.md reads them as "0 within quadrature error".

Consequences:
- The corrected statement: on the straight-segment sheet the pair series is regular at rho_1 + rho_2 when rho_1 != rho_2 (and rho_1 - c, rho_2 - c not positively proportional); at 2 rho it has a pole of residue -1 or +1 depending on the side from which the cut out of c + rho is passed. On other sheets the numerator is the increment difference plus 2 pi i n, so poles appear at off-diagonal points too. The author's first (withdrawn) claim "residues 1, -1, 0" was partly right.
- "The pair series does not carry the zeros" and "convergence of the prime-pair series alone, at any abscissa, would not give a zero-free half-plane for Z_2" are not established. What is true: the points 2 rho (Re <= 2 Theta) lie behind the branch points 1 + rho (Re <= 1 + Theta) and outside the region Re s > 1 + Theta where the pure series converges, so the series cannot be used there; that is the obstruction, not regularity.
- The map row entry "regular at rho_1 + rho_2 on its principal sheet" must be changed accordingly.

### E2. The anchor-1 symmetrised series of 2.2 has no half-plane of absolute convergence; "abscissa of absolute convergence is 2" and "= -int_1^{s-1} L(w) L(s-w) dw" are wrong for that form.

The finite-cutoff identity is correct (E-free, see confirmations). The limit is not: L(w) L(s-w) has a non-integrable 1/(w-1) singularity at w = 1 and at w = s-1, so int_1^{s-1} L(w) L(s-w) dw diverges for every s. On the series side: for fixed N and M -> infinity the term is ~ Lambda(N) N^{-(s-1)} Lambda(M) / (M log M), and sum_{M<=X} Lambda(M)/(M log M) ~ log log X. For real s > 2 all terms have one sign, so there is no cancellation: the series diverges for every s, like 2 L(s-1) log log X.

Measured (absolute sum incl. diagonal, cutoffs 1e2, 1e3, 1e4, 3e4):

| s | sums | increment per unit log log X | 2 L(s-1) |
|---|---|---|---|
| 2.5 | 2.460, 4.043, 5.240, 5.704 | 3.85, 4.16, 4.10 | 3.01 |
| 3.0 | 1.863, 2.531, 2.952, 3.108 | 1.62, 1.46, 1.38 | 1.14 |
| 4.0 | 0.819, 0.990, 1.100, 1.142 | 0.42, 0.38, 0.37 | 0.33 |
| 3.0, anchor c = 1.2 | 1.051, 1.334, 1.456, 1.488 | (converging) | |

The author's `double_euler.log` line for s = 2.5 shows the same growth (2.30, 3.16, 3.88, 4.52, 5.08, 5.56, 5.99; signed = absolute); that row is not in the table of 2.4 and the 2.2-control row there is only for the Akatsuka form.

Corrected statements:
- Akatsuka's first sum (weights Lambda(N) kappa(M), one extra 1/log M): abscissa 2. CLASSICAL, confirmed against the survey (Remark 2.2 reads as quoted, including "impossible to improve" and the (log(s-2))^2 asymptotics).
- Symmetrised Lambda x Lambda form anchored at c = 1: divergent for all s (abscissa +infinity). Anchored at c > 1: absolutely convergent exactly for Re s > 1 + c. The lower bound "not absolutely convergent for Re s < 2" (proof via M = 2, N large) is correct for all of these.
- Pure part: P(s) = -int_1^{s-1} L_0 L_0 dw is a finite integral (L_0 is regular at 1), and the conditional box convergence in Re s > 1 + Theta is correctly proved. But its total variation (|dE| = d psi + dx) diverges for every s by the same log log argument, so "the abscissa of absolute convergence of the pure part is also 2" should read ">= 2; +infinity at anchor 1".

### E3. Section 2.5 item 1 (positivity + Landau gives abscissa k) is attached to the wrong series.

One-signed terms hold for the symmetrised form (sign of -(s-2) times a positive kernel), which by E2 diverges everywhere at anchor 1, so Landau returns nothing there. Akatsuka's first sum, which does have abscissa 2, is not one-signed (sign of log N - log M). The statement is correct only for the anchored form c > 1: positive measure, abscissa 1 + c, singularity on the real axis at s = 1 + c (the pole of L at the endpoint). The conclusion "Landau returns only the pole, Theta <= 1" survives; the sentence "abscissa = first real singularity = k" does not. Also: at s = 2c the symmetrised series vanishes identically (a = 0), so sign statements must be made for the kernel after dividing by -(s - 2c).

### E4. Smaller points

- "Conditional abscissa is 1 + Theta (3/2 iff RH)": only the inclusion (convergence for Re s > 1 + Theta) is proved. Sharpness is not written. It can be argued: P has a logarithmic singularity at 1 + rho with coefficient L_0(1) = -gamma != 0, which excludes locally uniform convergence in a larger half-plane; pointwise box convergence below 1 + Theta is not excluded by anything in the file. Label ARGUED, not PROVED. The numerical row at s = 1.3 (three values) is weak evidence.
- "General k (Hermite-Genocchi) ... convolution of k copies of L over the simplex": by E2 this diverges for every s at anchor 1 (vertex singularities); it needs an anchor c > 1 or the kappa weights. The lower bound sigma_k >= k is unaffected. The result already labels convergence for k > 2 as ARGUED.
- DH row: "sigma_k >= 1.1204 k" is not derived or sourced in the file and I did not confirm the constant. Not load-bearing.
- Exponents in 2.4 (0.35 at 1.6, 0.19 at 1.8 against 0.4, 0.2): consistent with X^{2-sigma}/log X at X = 1e5; fine as MEASURED.

## Confirmed

- Identity 2.2 at finite cutoff: re-derived (int_0^1 e^{-a(th u + (1-th) v)} dth = (e^{-au} - e^{-av})/(-a(u-v)); substitution w = 1 + a th). New numeric cases: s = 1.7+3i, 2.9-11i (c = 1) and s = 3.1+2i (c = 1.2), relative errors 6e-14, 3e-13, 2e-14. K2 unused: confirmed.
- Sign-twist control run by me: eps = chi_4-type completely multiplicative sign on prime powers (0 at 2): identity holds to 4e-14, 2e-14, 2e-15. The identity uses nothing about Lambda; it is not a zeta-only mechanism and the result does not claim one. DH: the identity is a statement about any finite generalised Dirichlet polynomial, so it holds verbatim. Backward heat: no Dirichlet series, not formulable; agreed.
- Lower bound for Re s < 2 (pairs M = 2, N large; |D| >= e^{(2-sigma)u}/(2u)): re-derived, correct, also for |dE|.
- K1: correct given Illusie's theorem; content-free as stated.
- 2.6: |alpha| = (5 +- sqrt 5)/2 for 1 - 5T + 5T^2, log_5 3.618 = 0.799; sqrt 5 for 1 - 2T + 5T^2. Correct.
- Akatsuka survey: Theorem 2 = [A3, Thm 1.3] for Re s > 2 and Remark 2.2 are quoted accurately (PDF fetched and read). The result presents abscissa 2 as classical. No novelty claim that needs a literature search beyond this.
- No RH assumption; no verified-height input.

## Surviving claim

Precise obstruction, weaker than stated: (i) the finite-cutoff symmetrised prime-pair sum equals -int_c^{s-c} Psi_X(w) Psi_X(s-w) dw for any weights (divided-difference identity; integer spacing unused; passes DH and sign twists); (ii) no form of the pair series converges absolutely for Re s < 2 (Akatsuka form: abscissa exactly 2, classical; symmetrised Lambda x Lambda form: 1 + c for anchor c > 1 and divergent everywhere at c = 1), and the same lower bound holds for the pole-removed measure and for k factors (>= k); (iii) the pole-removed pair series converges conditionally for Re s > 1 + Theta, which is the input Theta itself; (iv) in rational models the continuation has logarithmic branch points at c + rho, is regular at rho_1 + rho_2 for rho_1 != rho_2 on the straight-segment sheet, and has poles of residue -1/+1 at 2 rho on the two sides of the cut from c + rho. The points 2 rho are therefore present but lie behind the branch points and outside every region of convergence. The lane stays closed; the reason is (ii)+(iii), not regularity at the zero sums.
