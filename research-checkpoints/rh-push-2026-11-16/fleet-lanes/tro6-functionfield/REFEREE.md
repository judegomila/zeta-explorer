# REFEREE: tro6-functionfield/RESULT.md

2026-11-16. Adversarial referee. Only this file was written in the repo; scratch scripts are in /tmp/ref-tro6.

## Verdict

The three PROVED items (Lemma G, Theorem 1, Theorem 2) survive re-derivation and an independent numeric rerun at
q = 13. The headline "the function-field analogue of TRO6-natural is TRUE" is NOT established: it rests on the
Corollary, which is a sketch, and one bullet of that sketch is false as written for the object Theorem 2 covers.
The obstruction verdict (the saving comes only from a bound on [u^N] 1/L, i.e. the target's zero-free region) is
real and is the function-field form of Theorem D already in `sextic-theta-proof.md`; it is not new information
about the number-field problem.

## PROVED steps: re-derivation

* **Lemma G.** g_s(1,A) = chi_0^3(disc A) G(chi_0^s)^N chi_0^s(D) gives g_6 g_3 = (G_1 G_2)^N chi_0^3(D);
  chi_0^3(D) = chi_0^3(+-1) (-1)^N mu(A) by Pellet-Stickelberger; |G_1 G_2| = q. Confirmed.
* **Theorem 1.** Periodicity mod lcm(c,A) with deg lcm <= k+N <= d gives equidistribution; the r-sum over the
  fibre of lcm -> A forces the additive frequency x/c to have denominator dividing A; primitivity of chi_A forces
  it to equal A; (x,c) = 1 forces c = A, so non-squarefree c drop out; the diagonal is phi(A) g_6(1,A). Confirmed.
  Requires N >= 1 (stated).
* **Theorem 2.** chi = chi_A conj(chi_c) is primitive mod cA, restriction to F_q^* is chi_0^(N-k), odd iff
  6 does not divide N-k. L(u,chi) has degree k+N-1 and a_d = W q^((k+N-1)/2 - r) conj(a_r). CRT gives
  tau(chi) = chi_A(c) conj(chi_c)(A) tau(chi_A) tau(conj chi_c); the cross term is chi_0((-1)^(kN)) by
  reciprocity, so eps depends only on (k,N,d). Exponent d-(k+N)+1/2 with |g g| = q^((k+N)/2) matches. Confirmed.
* **"Consequence [PROVED from F1]"** (finite formula for rho(m)): the algebra is right
  (bracket 1 - (q-1) sum_{j<=J} q^-j = q^-J), but it is conditional on F1, which is MEASURED for d <= 3.
  Label should be PROVED-rel F1, not PROVED.

## Numeric rerun with a different test case (own code, q = 13, brute-force Gauss sums)

| check | cases | result |
|---|---|---|
| Lemma G, N = 1, 2, 3 | 13 + 156 + 120 A | kappa constant to 1.5e-15, modulus 1 |
| Theorem 1 pairwise, (k,N,d) = (1,1,2), (1,2,3), (2,1,3), (2,2,4), (1,1,3), non-squarefree c included | up to 31 x 25 pairs | max abs error 2e-10 on values up to ~4e5 |
| Theorem 2 pairwise, 7 triples with 6 not dividing N-k | up to 16953 pairs | ratio modulus 1 to 10 digits, phase spread <= 3e-14 |
| Theorem 2 in the excluded even case (1,1,1), (2,2,2), (2,2,1) | up to 22464 pairs | identity FAILS (ratio modulus 0.28, or spread over [0, 3.6]) |

The exclusion "6 does not divide N-k" is therefore necessary, and it removes every block with k = N mod 6,
including the diagonal k = N where the Theorem 1 main term sits. No proved statement covers those blocks in the
incomplete range.

## Errors and gaps

1. **Corollary, bullet 1, is false for squarefree c.** "The c-sum is complete, hence zero, unless m' is a sixth
   power." Theorem 2 is proved only for squarefree c, and the squarefree-restricted sum is
   [u^k] L(u,chi_m')/L(u^2,chi_m'^2), which does not vanish. Measured at q = 13, k = 3, m' of degree 2:
   the sum over all monic c is 0, the sum over squarefree c has modulus 13 = q for m' = T^2+1, T^2+T+2, T^2+3T+5
   (and 0 for m' = T^2, (T+1)^2). Restoring completeness needs the non-squarefree moduli, which is exactly the
   part of the theta coefficient for which no identity is proved; otherwise it needs Weil for L(u, chi_m'^2) as a
   second RH-type input that the step table S1-S5 does not list. S4 is not a pure orthogonality step.
2. **Unstated range condition.** "Length k > r" is equivalent to d >= N. For N > d the c-sum is incomplete even
   over all moduli and all q^r dual frequencies survive. The sentence "this always holds for d >= 3" bounds only
   the sixth-power term. A crude bound on the remaining frequencies (Weil in both variables, absolute values in
   m') stays below Cauchy-Schwarz only for about 3N + 2k < 5d + 3. So eta >= 1 is unsupported for N beyond
   roughly 4d/3, and the measured support is five blocks at d = 4.
3. **Binomial factor.** binom(N+f-2, f-2) is polynomial in N for a fixed target, so "2^O(d)" is too pessimistic
   there; but for conductor degree f comparable to N it exceeds q^(N/2) at q = 7 (4^N against 2.65^N). Uniformity
   in the target is not shown. The known fix is the function-field bound for Moebius sums under RH with a
   subexponential loss; it is not cited.
4. **Headline overclaim.** "TRUE; no counterexample" is supported by: exact identities for the squarefree coprime
   odd part, a sketch with the gaps above, and numerics at q = 7, d <= 4, which section 8.3 itself calls
   pre-asymptotic. The supportable statement is "no counterexample found at d <= 4; main-term identity proved on
   the squarefree coprime odd part; the bound is conditional on a sketch".
5. **Model, not the probe.** The pairing uses c_k(m), not rho(m); the link is F1/F2 (MEASURED d <= 4). The sign
   convention is decisive: section 6 shows the conjugated row correlates at 0.70-0.86. The match of the bilinear
   pairing with the manuscript's (4.7) is asserted, not checked against the manuscript text. Acknowledged in 8.1.
6. **Trivial-target reading.** For nu trivial, 1/L = 1 - qu, so M_N = 0 for N >= 2, yet the (2,3) block is 5.4x
   null. The whole measured value there comes from the (c,A) = 1 coupling, the term the Corollary leaves
   unwritten. The quoted "predicted 0.05-0.13" is not derived in the text.

## Controls

* **Davenport-Heilbronn.** Passes: for c_1 nu_1 + c_2 nu_2 the A-sum is c_1/L_1 + c_2/L_2 and carries nothing
  about the zeros of the combination. The step using the Euler product is named correctly (mu from Lemma G times
  complete multiplicativity of nu).
* **RH / verified height.** Weil's theorem is used openly as the function-field input and marked as the
  non-transportable step. Nothing restates verified height. No claim is made for zeta or for theta < 7/8.

## Is the obstruction an artifact of a weak attempt?

No for a single target: Theorems 1-2 are exact, so on the squarefree coprime odd part the block equals a
1/L-coefficient sum and no rearrangement removes that. Two ways around that the report does not examine:
(a) average over targets nu (large sieve over conductors): this needs no RH and would give a density-type
statement, but it then meets the MV-CAP wall; (b) the non-squarefree moduli and the even blocks k = N mod 6 are
outside every proved identity; if an unconditional saving exists it must come from there (Hecke relations of rho
at sixth powers), and the report's data (d <= 4) cannot exclude or confirm it.

## Adjusted claim

PROVED over F_q[T] (q = 1 mod 6; checked at q = 7 and q = 13): Lemma G; Theorem 1; Theorem 2 for squarefree
coprime pairs with 6 not dividing N-k. PROVED-rel F1: the finite formula for rho(m). SKETCH with a known defect:
the Corollary (sixth-power localisation fails for squarefree moduli; valid range at most N <= d; even blocks and
non-squarefree moduli open). NOT established: "function-field TRO6 is true with eta >= 1". Obstruction verdict
stands as a restatement of Theorem D in an exact model.
