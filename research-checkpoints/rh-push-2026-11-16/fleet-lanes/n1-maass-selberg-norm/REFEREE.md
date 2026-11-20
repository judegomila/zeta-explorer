# REFEREE: n1-maass-selberg-norm

Adversarial referee (general), 2026-11-17. Read: BRIEF (all notices), OBSTRUCTION_MAP, RESULT.md, rownorm.py,
lp31.py, r3-method-limit/tiers.py, manuscript `~/lean-deps/qrh-verify/paper.txt` (5.30)-(5.36), 14.1, (14.1), (14.2),
Lemma 14.3 statement, 15.1. No ssh. All runs through `scripts/memcap.sh 8`, single process, longest 69 s.
Only this file was written in the lane directory (two scratch scripts under /tmp).

**Verdict: holds = false as labelled; holds after three corrections.** Two statements labelled PROVED are stronger
than what is proved (E1, E2). Lemma C, the LP, and the measurement are confirmed. No statement about zeros is made,
no RH/GRH is used in a PROVED line, verified height is not used. Nothing in the note moves an abscissa. RH open.

## Errors

**E1 (label, (L*) in 5.4 and in the claim). The equivalence "no K-loss for all bounded a <=> flat Gram spectrum" is
false in the direction =>.** Only <= holds. "All bounded a" is the l-infinity ball; lambda_max is the l2 operator norm.
Counterexample (PSD): G = g (I + J_k), J_k the all-ones block on k = sqrt(P) of the P marks. Then
sup_{|a_p| <= 1} a* G a = g (P + k^2) = 2 g P (no loss against the diagonal g P), while lambda_max = g (1 + sqrt(P)),
unbounded. The correct reformulation is sup_{|a_p| <= 1} a* G a << Z^eps tr G (the infinity-to-one norm of G).
Flat spectrum is sufficient, not necessary; the manuscript needs even less (product-form coefficients eta(p) W_i).
The identity sum_m |B_m|^2 = a* G a and the formula for x_p from twisted multiplicativity are confirmed
(the label chi_n(f)^4 with f = p matches chi3_p(c') chi3_c'(p) = chi_c'(p)^4 by cubic reciprocity for primary elements).

**E2 (label, O1). "No single Eisenstein series has the rows as Fourier coefficients" is not proved.** What is shown:
the rows are not the coefficient series of the cubic Kubota series nor of the sextic GL(2)-cover Eisenstein series
(R1, R2). A function on a higher-rank cover whose Whittaker coefficients are the twisted values L(s, theta x chi_m)
is not excluded; RESULT section 7 item 2 says so, but the verdict and the claim line state the stronger form.
Correct label: non-identification with the two Kubota-type series [PROVED-rel Lemma 4.2, (4.7)]; exclusion of all
Eisenstein series OPEN. (R1) is a tautology given gt3(m,c) = gamma_2(c) chi_c(m)^{-2}; confirmed. (R2) was not
checked numerically by the lane (no sextic Gauss sum is computed in rownorm.py); "identities checked numerically"
covers only gamma_2^3 = -alpha at primes and twisted multiplicativity. (R2) stands on (4.7) alone.

**E3 (attribution in O1 and 5.5; I inspected the rows).** Rerun Z = 3000, M = 1, l = 1/2, rows listed individually:
- Variant A (gamma_2 chi): the whole all-row excess (1.53 against 1.00 on squarefree rows) sits on the two rows of
  norm 2401 = 7^4, ratio 187 each: m = b^4 with q_b = 7. The 19 other rows of square norm have mean ratio 1.15.
  Reason: gamma_2(c) chi_c(b^4) = gamma_2(c) chi_c(b)^4 = gt3(b, c), a Kubota coefficient with a theta residue.
  For m = a^2 the row is gt3(a^2, c), whose theta residue vanishes when a is squarefree (Patterson: tau(mu) = 0 if
  p^2 exactly divides mu; RECALLED). So O1's sentence "the two coincide where the quadratic symbol is trivial: rows
  m = a^2" is a correct identification but those rows carry no pole; the pole rows of variant A are m = b^4.
  RESULT's attribution of these rows to "frozen powerful row parts of Lemma 5.8" was a guess.
- Variant B (chi^5): top rows have norms 961 = 31^2, 1849 = 43^2, 1369 = 37^2 (ratios 124 to 138): m = a^2, because
  chi_c(a^2)^5 = chi_c(a)^4. The outcome stated in RESULT is right; the reason given ("quadratic twist trivial") is
  the variant-A mechanism and does not apply to B.
None of this touches A' (the manuscript's row), which shows no large row in any run.

**E4 (presentation of the measurement).**
- "0.76 to 1.04 where Lemma 14.3 allows 10 to 178": the ratio cannot exceed the number of marks (Cauchy-Schwarz), and
  in 10 of the 11 configurations the mark count (5 to 31) is below Kfac. The available range is 5 to 31, not 10 to 178.
  At l = 1/3 the mark count is 5 for Z = 2000, 4000 and 8000: "does not grow with Z" has no asymptotic content there.
- "R_worst" is not the supremum of the ratio: it is lambda_max(G) divided by the Rayleigh quotient of D_p at the top
  eigenvector of the unnormalised G. The supremum is the top eigenvalue of the normalised Gram matrix (eig_max in
  the logs), which is larger (stored data: up to 1.77; 16 variant/configuration pairs have eig_max/diag above the
  independent-vector edge, including the random control, not "once"). The conclusion is unchanged: eig_max <= 1.9
  against 5 to 31 available, theta rows and random control alike.
- Section 4 text: "a residual loss th/6 is added directly" would give slope 1/6; the exact slope is 0.100 to 0.102
  (re-optimisation). The threshold is exactly th = 1/18 (below).

**E5 (novelty of Lemma C).** Lemma C is the trivial range of the n-th order large sieve: for rows longer than the
square of the modulus, orthogonality of characters gives rows + moduli^2. It is contained (up to Z^eps against
(log Z)^4, and up to the non-squarefree factor n) in Heath-Brown-type bounds (M + N + (MN)^{2/3})(MN)^eps of
Goldmakher-Louvel and Blomer-Goldmakher-Louvel for n-th order Hecke characters (RECALLED, not re-read), and RESULT
itself labels the general statement CLASSICAL. It should not be called a new estimate. It holds for arbitrary
bounded coefficients (Euler-blind), and it lies outside every range the 7/8 method uses (N <= M/2).

## Confirmed

- **2.1 marks on the column index** [PROVED-rel]: (14.1), (14.2) read; d depends on A = n b^3 only; the row k enters
  through Psi_k(n) = nu rho chi_n(k) chi_n(f)^4. Confirmed.
- **Lemma 5.8 exponent**: (5.36) with O = 0 gives max{M, 2M - N}; confirmed from the manuscript text.
- **Lemma C** re-derived. Majorant Phi = |psi|^2 with psi-hat of compact support (needed: Phi >= 0 everywhere, >= 1 on
  the ball; RESULT states only the second, the first is used). Character chi_c(m) chi_n(m)^3 conj(chi_c'(m) chi_n'(m)^3)
  is periodic mod f = c n c' n', q_f <= X^{2+eps}; Poisson over the lattice leaves only the zero frequency when
  Z^M >> rho^2 q_f, i.e. M >= 2N + eps. Principal iff [p|c] + 3 v_p(n) agrees mod 6: mod 3 gives c = c', mod 2 gives
  equal parities, n = s a^2, n' = s b^2. Weight 1/(q_c q_s q_a q_b), sum << (log Z)^4. Correct.
- **Lemma B**: contour shift needs T entire of polynomial growth (Proposition 5.1, taken from the manuscript), then
  Minkowski. Correct as a relative statement.
- **LP** (rerun, exact Fractions): the scaled system at th = 1 is identical, constraint by constraint, to
  tiers.system (source); threshold by bisection th* = 0.0555555545 = 1/18, removed fraction 17/18 = 94.4%;
  at th = 1/18 the infimum is 13/15 and (B - 31/36)/th = 0.1000 exactly at the threshold. 13/15, 31/36 confirmed.
  These are MODEL values of the r3-method-limit system.
- **Measurement rerun, new cases** (seeds 7, 11, 3; K added to the marked variants as a positive control):

| Z | M | l | rows | cols | marks | Kfac | A' R_ones | A' R_signs | A' eig_max | random eig_max | K eig_max | K R_ones | K unmarked N=1+l |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 3000 | 1 | 0.5 | 683 | 37864 | 14 | 54.8 | 0.93 | 0.96 | 1.19 | 1.23 | 6.40 | 5.40 | 35.2 |
| 1500 | 1 | 0.6 | 336 | 27661 | 15 | 80.5 | 0.98 | 0.83 | 1.33 | 1.26 | 4.58 | 4.21 | 34.0 |
| 6000 | 0.9 | 0.4 | 570 | 44601 | 6 | 13.6 | 0.89 | 0.91 | 1.02 | 1.11 | 5.92 | 5.40 | 41.3 |

  The lane's reading reproduces: theta rows (A, A', A+) have a marked Gram spectrum like the random control.
  New: the lane's marked experiment had no positive control (K was carried only for the unmarked sums). With K
  in the marked Gram, the top eigenvalue is 4.6 to 6.4 (6 to 15 marks) and R_ones 4.2 to 5.4: the marked experiment
  does detect coherent marks. This strengthens the MEASURED line. Self-checks reproduce (g^3 = -alpha to 7e-14,
  composite Gauss sum against brute force 6e-15). Stored range R_ones, R_signs in [0.760, 1.042] over the three theta
  variants: confirmed from the JSON files.

## Controls

The note claims no zeta-only mechanism and makes no statement about zeros, so Davenport-Heilbronn, backward heat
and the sign twist have nothing to be run against; I agree with section 6 on this. The statements are mean-value
inputs: Lemma C and the measured flat spectrum hold equally for random unimodular coefficients (confirmed in the
reruns), so they are Euler-blind; (L*) is coefficient-specific only in that it fails for the untwisted Kubota
coefficients (confirmed: control K). By the campaign's MV-CAP wall, a proof of (L*) would enter only the low side of
the 7/8 estimate system, model value 31/36 > 5/6. No RH assumption, no verified-height restatement.

## Surviving statement

1. [PROVED-rel manuscript] Marks are column-side divisibility sums; the rows gamma_2(c) chi_c(m) are not the
   coefficient series of the cubic Kubota or the sextic GL(2)-cover Eisenstein series (row m = Kubota coefficient m
   times the quadratic symbol of modulus m). Maass-Selberg for those two series does not give the row norm.
   Exclusion of other automorphic realisations: OPEN.
2. [PROVED, classical range of the n-th order large sieve, not new] unmarked norm << Z^M (log Z)^4 for M >= 2N + eps.
3. [PROVED] sum_m |B_m|^2 = a* G a; flat spectrum of G implies no K-loss; the converse is false.
4. [MEASURED, Z <= 8000, 5 to 31 marks, one slot, no cube completion] normalised marked Gram spectrum of the theta rows
   within [0.6, 1.9], same as the random control; available range 5 to 31; pole control gives 4.6 to 6.4 in the marked
   Gram and 7 to 75 in the unmarked norm. Asymptotic status OPEN.
5. [EXACT, MODEL] 31/36 confirmed; the model infimum stays 13/15 unless th < 1/18 exactly.
No statement about zeros. 7/8 (unrefereed) unchanged.
