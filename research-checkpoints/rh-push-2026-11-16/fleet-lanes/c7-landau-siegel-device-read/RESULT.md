# c7-landau-siegel-device-read: what the 2026 Landau-Siegel proof reads, and whether its device crosses

Lane kind: explore (lead 28). Date 2026-11-18. No server job was started. One local run (toy check, 8 GB cap, < 1 min).

Labels: CLASSICAL / LEAN-RELEASE (statement read in the released Lean tree; comparator challenge exists; **not compiled by us**) / READ (my reading of Lean statements, no paper text available) / MEASURED (toy numerics here) / ARGUED / OPEN.

## 0. Sources and availability

- `formalization/external/` contains only two notes (survey, QRH verification). Neither contains the Landau-Siegel proof. The verification note states that `SiegelZeros` was not checked locally.
- A local copy of the released Lean tree exists outside the repo: `~/lean-deps/qrh-verify/lean/` (commit `adc7f1241` of the release). It contains
  `OAI/NumberTheory/SiegelZeros/` (306 files, 69,818 lines; namespaces `WeightedTorusJets`, `SiegelZerosAwei`), the comparator challenge `ComparatorChallenges/SiegelZeros.{lean,json}` and `docs/003.md`. Read as text only.
- The preprint "Uniform exclusion of Landau-Siegel zeros" (1 Oct 2026) is **not** available locally (only its path in `formalization.yaml`). The Lean files have no doc comments. Everything in section 2 is therefore a reading of Lean theorem statements, not of a paper. Proof bodies were read only for the top-level assembly and the Frobenius step.
- Source scan of the 306 files: no `sorry`, `admit`, `axiom`, `native_decide`, `unsafe`, `implemented_by`, `set_option`. The local build directory contains `DirichletL` only: the `SiegelZeros` oleans were never built here. Status of the theorem for this campaign: LEAN-RELEASE, not Lean-checked by us.
- The tree imports nothing from `OAI/NumberTheory/DirichletL` (the 7/8 tree). External imports: Mathlib and `PrimeNumberTheoremAnd.SiegelZeros.HadamardSupport` (Hadamard factorisation support).

Two facts about the statement (both PROVED here, elementary):

1. The comparator statement is: there is c > 0 with (1 - beta) log q >= c for every primitive nonprincipal real chi mod q >= 3 and every real zero 0 < beta < 1. The Dirichlet 7/8 theorem (compiled locally, see the verification note) gives beta <= 7/8 for every zero, hence (1 - beta) log q >= (log 3)/8. So the statement of lead 28 is a corollary of the locally checked 7/8 theorem, and carries no information beyond it. The 11/12 writeup (`paper2.txt` lines 100-108) says the same ("Theorem 1.1 rules out the existence of such a zero").
2. The `SiegelZeros` tree is an **independent** proof by a different device (section 2). `docs/003.md` confirms the scope: "does not rule out real zeros elsewhere in (0,1)". The interest of lead 28 is the device, not the statement.

## 1. Plan and launch condition

Condition of the explore slot: state what the device reads and the control of that class; show one step that THIN fails.

- What it reads: the splitting type (Frobenius class) of every prime H < p <= U = q^A in the biquadratic field Q(sqrt d, sqrt 2), where Q(sqrt d) is the field of the real character chi (|disc| = q). Family in the conductor aspect, real characters only, real zero only (height 0).
- Control of the class: a non-periodic completely multiplicative sign function (THIN; the Liouville function as the extreme member), plus DH, the unimodular twist U, sign twists.
- Step that THIN fails: S3/S5 below (there is no number field whose Frobenius at p is eps(p); the congruence theta^p = Frob_p(theta) mod p has no object). Section 4.

Condition met; the lane proceeded.

## 2. Chain of the proof (READ from Lean statements; step numbers S1..S9 are mine)

Notation: chi real primitive mod q, d squarefree with Q(sqrt d) the field of chi, a = sqrt d, b = sqrt 2, B = Q(a, b), Gal(B/Q) = {1, sigma, tau, sigma tau}, sigma(a) = -a, tau(b) = -b. delta = (1 - beta) log q. Points theta_n = n0 + n1 a + n2 b + n3 ab, n in [0, N)^4, M = N^4 points. Rows R_alpha(n) = theta_n^{alpha0} sigma(theta_n)^{alpha1} (sigma tau)(theta_n)^{alpha2}, alpha in N^3, weight w(alpha) = alpha0 + H (alpha1 + alpha2). S1 = sum of alpha0 over the chosen rows, S2 = sum of alpha1 + alpha2.

| step | content | Lean declaration (file under `SiegelZeros/`) | label |
|---|---|---|---|
| S1 | Contrary sequence: if no c exists, there are (q_k, chi_k, beta_k) with q_k -> inf, delta_k -> 0 | `W02.exists_contrary_sequence` (`Estimates/ContrarySequence`), `genuine_contrary_sequence_with_parameters` | CLASSICAL (bounded conductors have a positive gap) |
| S2 | Hadamard partial fraction for the completed L(s, chi) at real s in (1, 2]; all zero terms Re 1/(s - rho) >= 0 dropped except the real zero: Re(-zeta'/zeta - L'/L)(s) <= C log q + 1/(s-1) - 1/(s-beta) | `W63.exists_logDerivative_upper_of_hadamard`, `hadamardFormulaAt_of_actual_character` (`Characters/ConditionalPrimeBias`, `UnconditionalPrimeBias`) | CLASSICAL (Davenport ch. 12, 14); LEAN-RELEASE |
| S3 | **Prime bias.** With s = 1 + 1/log X and the Euler product, sum_{p <= X, chi(p) = 1} log p / p <= C log q + C (1 - beta) log^2 X; with Mertens: sum_{H < p <= X, p not dividing 2q, chi(p) = -1} log p / p >= log X - C log q - C delta log^2 X / log q - C_H | `W63.exists_prime_bias_for_actual_zeros`, `exists_good_mass_for_actual_zeros_normalized`; `W04.logarithmic_reciprocal_gap_le` | CLASSICAL (the "exceptional character imitates mu on primes up to q^{1/delta}" statement; same starting point as Deuring-Heilbronn and Linnik); LEAN-RELEASE |
| S4 | **Field of the character.** chi real primitive, q != 8, gives d squarefree, |d| <= q, d | q, Q(sqrt d) = fixed field of ker chi inside Q(zeta_{8q}), |disc| = q; B = Q(sqrt d, sqrt 2) of degree 4 with the four automorphisms | `source_character_global_greedy_determinant_master_bounds` (first clauses), `Determinants/SqrtPairFrobeniusDirections` (`primitive_quadratic_conductor_shape`, `real_character_isQuadratic`) | CLASSICAL (Kronecker-Weber for quadratic characters, conductor-discriminant); LEAN-RELEASE |
| S5 | **Frobenius congruence.** For p odd with (d/p) = -1: p divides theta^p - sigma(theta) for all theta in Z[a,b], or p divides theta^p - (sigma tau)(theta) for all theta (according to (2/p)). Reason: a^p = d^{(p-1)/2} a = (d/p) a mod p (Euler criterion), same for b, and x -> x^p is additive mod p | `Awei.W39.theta_frobenius_two_conjugates`, `root_pow_prime` (`Determinants/ThetaDivisibility`) | CLASSICAL (Euler criterion + quadratic reciprocity to tie (d/p) to chi(p)); proof body read; MEASURED in section 3 |
| S6 | **Determinant.** Delta = det(R_{alpha_i}(n_j)), M x M, rows = the first M linearly independent rows in weight order ("greedy pivots"). Delta is a nonzero element of O_B. For every p > H, p not dividing 2q, chi(p) = -1: Delta lies in (p)^{E_p}, E_p = sum_i floor(alpha_i0 / p). Mechanism: the row alpha with alpha0 = kp + r is replaced by (theta^p - Frob theta)^k theta^r (...), which differs from it by rows of smaller weight (p > H makes alpha0 -> alpha0 - p, alpha1 or alpha2 -> +1 a weight decrease); smaller-weight rows are in the span of earlier pivots, so the determinant is unchanged, and the new row is divisible by p^k | clause `hdiv` of `source_character_global_greedy_determinant_master_bounds`; `Determinants/ThetaDivisibility` (`exists_lower_unitriangular_of_row_sub_mem_span`, `det_lower_unitriangular_mul`), `Determinants/GeneratedGreedyDivisibility` | type: interpolation determinant (Laurent) with Frobenius congruences in place of derivatives (Stepanov-type); no node in the device table. LEAN-RELEASE; MEASURED in section 3 |
| S7 | **Archimedean bound** (Hadamard inequality in each of the four embeddings; |theta| <= 8 N sqrt q): (1/4) log |Norm Delta| <= (M/2) log M + (S1 + S2)(log N + (1/2) log q + log 8) | clause `harch` | CLASSICAL; LEAN-RELEASE |
| S8 | **Size of the pivots.** With U = N^{4/3}: S1 >= M H^{2/3} U / (4 * 97^2) (count of monomials of weight <= W is about W^3 / (2 H^2), and M = N^4 are needed) and S2 <= 192 M H^{-1/3} U. The second bound needs that rows up to a cutoff weight span all functions on the M points (`ActualCutoffSpanning`), which is a zero estimate; it is reduced to a local Bezout bound (length of an isolated component of h <= 4 polynomials of degree <= D in 4 variables is <= D^h) proved in the tree | `global_source_rectangle_pivot_bounds`, `W28.actualCutoffSpanning_of_localBezout`, `W22.localIsolatedBezout_of_actual_regular_selection` (`Intersection/`, `LocalAlgebra/`, `Hilbert/`: 101 files) | zero estimate of Masser-Philippon type: CLASSICAL in kind, this instance LEAN-RELEASE, not read beyond statements |
| S9 | **Product formula and comparison.** sum_p E_p log p <= (1/4) log |Norm Delta| (S6), E_p >= alpha0/p - 1, S3 with X = U, S7, log N = (3/4) log U: 1 <= (3/4)(1 + S2/S1) + (C + 1/2 (1 + S2/S1)) log q / log U + C delta log U / log q + O_H(1)/log U. H = 86713344 = 12 * 192 * 4 * 97^2 gives S2/S1 <= 1/12, so the leading constant is 13/16 < 1. With N = q^gamma, gamma large and fixed, and delta -> 0: contradiction | `FinalComparison.normalized_master_bound` (`Determinants/NormalizedMasterBound`), `source_real_zero_uniform_master_bound`, `exists_fixed_parameters_not_eventually_uniform_bound`, `W50.uniform_exclusion_of_actual_cutoff`, `exists_absolute_real_zero_gap` | algebra read in full (the 13/16 identity is a `field_simp; ring; linarith` proof); LEAN-RELEASE |

Where the gain comes from (READ + ARGUED): M = N^4 points come from a rank-4 lattice, but only three of the four conjugates of theta are used as variables. The degree needed to interpolate M points with 3 variables is N^{4/3}, so primes up to U = N^{4/3} divide the determinant, while each unit of alpha0 costs log N = (3/4) log U at the archimedean places. The p-adic gain per unit of alpha0 is the inert log-mass sum log p / p, which the zero forces to be (1 - o(1)) log U. Ratio 3/4 < 1. Three conjugates suffice only because an inert prime has Frobenius in {sigma, sigma tau}; a split prime has Frobenius in {1, tau}, and covering it needs the fourth variable, which returns the exponent to N^{4/4} and the ratio to 1 (no contradiction, as the product formula requires).

### Statement F: the determinant half is a statement about the field with no L-function in it

From clauses `harch` and the third inequality of `hraw` of `source_character_global_greedy_determinant_master_bounds`, and the pivot bounds (my derivation; the Lean theorem contains the hypotheses, the displayed line is not a Lean declaration):

for every real primitive chi mod q (q != 8), H >= 86713344, N >= max(H, 18818), U = N^{4/3}, D = H^{2/3}/(4 * 97^2):

    sum_{H < p <= U, p not | 2q, chi(p) = -1} (log p)/p  <=  (13/16) log U + (13/24) log q + (13/12) log 8 + (log 4)/D + 3 log U/(2 D U).

Label: PROVED-rel LEAN-RELEASE (arithmetic from two released clauses; not compiled by us). It is non-trivial only for U > q^{26/9}. It is the whole arithmetic content: the zero enters only through S3, which says the left side is >= log U - C log q - C delta log^2 U / log q - C_H.

## 3. Toy check of S5/S6 and of the control (MEASURED)

`toy_frobenius_det.py` (python-flint, exact integers; logs `toy_frobenius_det.log`, `toy_control.log`): builds the greedy-pivot determinant for N = 2, 3 (M = 16, 81), H in {2, 3, 4}, d in {5, -7, 13, 7, -11, 3, -19}, computes Norm_{B/Q}(Delta) as the determinant of the 4M x 4M integer block matrix, and compares v_p(Norm) with 4 E_p.

- Inert primes (prediction v_p >= 4 E_p): 0 violations in 11 runs; equality occurs (d = 5, N = 3, H = 4: p = 7, 4E = 96, v = 96; d = -11, H = 4: p = 7, 96 = 96; d = 5, N = 3, H = 2: p = 7, 20 = 20; d = 3, H = 2: p = 7, 20 = 20), so the exponent is sharp at these sizes.
- Split primes (no prediction): the inequality fails where E_p is not small: d = 5, H = 4, p = 11: 4E = 28, v = 4; d = -11, H = 4, p = 5: 4E = 180, v = 44; d = -19, H = 4, p = 5: 180 vs 52, p = 11: 28 vs 4. (At H = 2, p = 3 the generic Vandermonde-type divisibility of the box exceeds 4E for split and inert alike: 200 against 164 split, 252 against 164 inert; small primes are not a test.)

This confirms the reading of S5/S6 at toy size and shows that the divisibility is a property of the sign chi(p) as a Frobenius class. It says nothing about S8 or the constants.

## 4. First decisive test: periodicity as in manuscript Lemma 5.8, or another input?

Lemma 5.8 of the 7/8 manuscript (unmarked completed-row moment) uses periodicity additively: the rows are finite-ray characters extended by zero, and the moment bound comes from a Poisson/large-sieve dual in the row modulus that is uniform in the modulus (lattice-translation invariance of the coefficients; map note on THIN, line 61). The Landau-Siegel chain uses periodicity in two other forms and never in that one. (i) S2: the Hadamard formula for the completed L-function with the term (1/2) log(q/pi), i.e. the functional equation of L(s, chi), classical. (ii) S4-S5: chi is a character of Gal(Q(zeta_{8q})/Q), so chi(p) is the Frobenius class of p in Q(sqrt d) with |d| <= q, and Frobenius acts on integers of B by x -> x^p mod p. This is the reciprocity (Galois) side of periodicity: it supplies an algebraic integer sqrt d of size sqrt q (entering S7 as (1/2) log q) with a congruence at every prime (S5), and the primes are combined by the product formula (S6, S9), not by a mean square over a family. There is no large sieve, no Poisson summation over a row variable, no family average and no coherent set in S1-S9; the only average is over the box of points theta, which is a choice of interpolation nodes. So the arithmetic input is different from Lemma 5.8: "the character is the Frobenius of a field of small height" against "the coefficients are invariant under a lattice".

Device classification against `engine/curated/devices.json`:
- not `coherent-set-large-sieve` (no family, no sieve);
- not 3-4-1 positivity as the crossing device (S2-S3 use the linear positivity 1 + chi(p) >= 0 of zeta(s)L(s, chi) to convert the zero into a prime bias, but the contradiction is not obtained from positivity);
- not Deuring-Heilbronn repulsion (same input S3, but repulsion converts the bias into a statement about other zeros; here the bias is refuted by Statement F);
- not `frequency-only` (row D1): Baker-type devices read log n and are coefficient-blind; this one reads chi(p) at every prime through S5 and is not coefficient-blind (section 5);
- closest classical relatives: Stepanov's method and Thue-Siegel/Laurent interpolation determinants. **Type with no node.** Proposed node: `frobenius-congruence-determinant` ("interpolation determinant over a number-field box, divisibility from Frobenius congruences at biased primes, product formula; reads Frobenius classes in the conductor aspect"). State by the table's definitions: it does not return its input and does not hold for the controls, but its crossing is from s = 1 + 1/log X to real zeros within c/log q of 1 only; I record it as `floored` at Re s = 1 - c/log q, real zeros, real characters.

## 5. Controls

| control | outcome | first failing step and reason | label |
|---|---|---|---|
| THIN (non-periodic completely multiplicative sign eps, zero at b in (1/2, 1)) | fails | S4: there is no d with eps(p) = (d/p) for all p not dividing 2d (such a function is periodic mod 4|d| and equals -1 on half of the primes; THIN is +1 on a set of primes of relative density one). Hence S5 has no object. Independently S3 gives nothing: 1/(s-1) - 1/(s-b) is not small for b at fixed distance from 1 | PROVED (elementary) |
| Liouville twist (eps(p) = -1 for all p; extreme member of the sign-twist class) | fails | the conclusion of S3 holds for it with full mass, and the conclusion of Statement F is false for it (left side = log U - log H + O(1) > (13/16) log U + ...). So S4-S9 must use a property it lacks; it is S4/S5 (no field, no congruence). This is the sharp control: Statement F separates Kronecker symbols from multiplicative sign functions | PROVED |
| sign-twisted primes Lambda -> eps_n Lambda, general | fails | S5 (same reason); if eps = chi * (another sign) the congruence still reads chi, not the twisted sign. Toy: split primes do not carry the divisibility (section 3) | PROVED / MEASURED |
| unimodular twist U (chi(n) n^{-it}, zero at beta + it) | fails | S3 becomes a bias Re(chi(p) p^{-it}) close to -1; S5 needs the biased value to be a Frobenius class; p^{-it} is not one. This is also the height aspect: n^{-it} is itself a non-periodic unimodular completely multiplicative function | PROVED (structure) |
| DH | not formulable, fails at S2/S3 | DH is a combination of two complex characters mod 5: no real character, no Euler product, -L'/L is not supported on prime powers with coefficients 1 + chi(p) >= 0; fixed conductor, so outside the conductor aspect | ARGUED |
| Beurling primes | fails at S5 | no integers, no ring Z[a,b], no congruence | ARGUED |
| backward heat, zeta(s+a)zeta(s-a), T-NR, phase-rotated transfer operator, theta^w | not run | none of them is a real Dirichlet character in the conductor aspect; the device has no formulation for them. Recorded as "outside the class", not as verified failures | NOT RUN |

## 6. Can the device be posed for a zero of zeta with Re s < 1?

No, as posed. Three separate reasons, in order of appearance:

1. **First step that needs Re s near 1: S3** (`W04.logarithmic_reciprocal_gap_le`, `W63.exists_prime_bias_for_actual_zeros`). The zero enters only through 1/(s-1) - 1/(s-beta) <= (1 - beta) log^2 X at s = 1 + 1/log X, to be compared with the total mass log X. The bias is non-trivial only if (1 - beta) log X is small, and S9 needs log X >= (16/3)(C + 13/24) log q. So the device sees a zero only if 1 - beta < c/log q. For a zero at fixed distance from 1 (in particular in 1/2 < Re s < 7/8) S3 is empty: the contribution of the zero to prime sums is x^{beta - 1} smaller than the main term and produces no bias in logarithmic mass.
2. **The height aspect is the control class.** For zeta at 1 + it the bias would be p^{-it} close to -1. S5 has no analogue (control U, section 5). What excludes this classically is 3-4-1 or Vinogradov, already in the table (`sum-product-vinogradov`, closed).
3. **Repulsion from a hypothetical off-line zero acting on a family.** Deuring-Heilbronn needs the repelling zero within O(1/log) of 1; a zero of zeta with Re s = beta < 1 fixed biases no family of fields in logarithmic mass (reason 1), so there is nothing for Statement F to contradict.

The lesson for R4 is negative and specific: the device crosses Re s = 1 by exactly the classical width (it trades the pole of zeta against the zero inside the Hadamard formula), and then replaces "ineffective" by "uniform" through arithmetic of the field. It has no mechanism below Re s = 1 - c/log q.

One adjacent observation (not pursued; one pivot allowed, none taken because it does not address R4): Statement F is a zero-free arithmetic input in the conductor aspect ("inert primes carry at most 13/16 of the logarithmic mass up to q^A", from a product formula). The 7/8 architecture has no use for it as it stands: its rows need power-saving cancellation, and F is a constant-factor bound on a logarithmic mass.

## 7. Requirement flags

- **R1 (all primes together, multiplicativity essential): true for the device in its own class.** Evidence: S3 uses the Euler product of zeta(s)L(s, chi) (prime-supported coefficients 1 + chi(p) >= 0); S5 is one congruence per prime; S6/S9 combine all inert primes H < p <= U through the product formula. Non-multiplicative control (DH) fails at S2/S3. More precisely the essential input is stronger than multiplicativity: reciprocity (multiplicative sign functions that are not Kronecker symbols fail at S4/S5, and Statement F is false for the Liouville function). Basis: reading of released Lean statements plus the toy check; not a result of this campaign about zeta.
- **R2 (height-uniform, every window): false.** The conclusion concerns real zeros (height 0) and is uniform in the conductor, not in height. The twist by n^{-it} is a failing control.
- **R3 (every control fails structurally, verified): false as a flag.** THIN, Liouville twist, sign twists and U fail at S4/S5 (proved, elementary); DH and Beurling are argued; five controls are outside the class and not run.
- **R4 (reaches the critical line): false.** Floor: real zeros within c/log q of 1 (section 6, reason 1).

Score suggestion for the planner: a device type with no node, with R1 and a structural THIN failure: candidate for score 1 (R1 only; R3 is not complete and the device belongs to an external result, not to this campaign). It does not change the headline.

## 8. Verdict

Precise obstruction, with one new device node. The Landau-Siegel statement of lead 28 is implied by the locally compiled Dirichlet 7/8 theorem. The released independent proof uses a device that is not in the table: an interpolation determinant over a box in Z[sqrt d, sqrt 2] whose divisibility comes from Frobenius congruences at inert primes, against the prime bias that a real zero near 1 forces. It uses periodicity as reciprocity (character = Frobenius of a field of height sqrt q), not as lattice-translation invariance (Lemma 5.8). THIN, the Liouville twist and the unimodular twist fail at S4/S5. The device cannot be posed for a zero with Re s < 1 - c/log q: step S3 is empty there, and the height aspect is exactly the failing control U. No statement about zeros of zeta is made.

## 9. Three weakest steps

1. **Everything in section 2 is read from Lean statements of a tree that was not compiled here, without the preprint.** The comparator challenge exists and the source scan is clean, but `SiegelZeros` has no local build and no `#print axioms`. Proof bodies were read only for S5, S9 and the top-level assembly; S8 (zero estimate through the local Bezout bound, 101 files) was read at the level of statements only. The description of the mechanism of S6 (row replacement) is my reconstruction from declaration names and the unitriangular lemmas, confirmed only at toy size.
2. **Statement F is my arithmetic from two clauses** (`harch`, third inequality of `hraw`) and the pivot bounds; it is not a Lean declaration and was not checked by a second pass. The toy check covers S5/S6 for N <= 3 only; it does not test S7-S9 or the constant 13/16 (the theorem needs N >= 18818, H >= 86713344).
3. **Control table.** DH and Beurling are argued, not run; five controls are declared outside the class. The claim "type with no node" rests on the 26 device ids of `engine/curated/devices.json`; relatives (Stepanov, Laurent determinants, Bombieri-style product-formula arguments for Siegel zeros) were named from general knowledge without opening literature.

## Files

- `RESULT.md` (this file)
- `toy_frobenius_det.py`, `toy_frobenius_det.log`, `toy_control.log` (run through `scripts/memcap.sh 8`; python-flint from a throwaway venv at `/tmp/c7ls-venv`)
