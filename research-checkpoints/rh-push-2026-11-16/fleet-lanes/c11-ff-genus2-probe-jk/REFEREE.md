# REFEREE.md for c11-ff-genus2-probe-jk/RESULT.md

2026-11-19. **This is the author's own adversarial check, not an independent referee.** It counts as zero
referees. Code: `ref.py` (second implementation; nothing imported from `sq_q.py`: resultant by Sylvester
determinant mod q, squarefree A' by trial multiplication, cop_k by brute-force gcd counts, own Gram
G_jk = q^min(j,k) t_|j-k|, polynomial coefficients stored high to low). Log: `ref.log`. Local, `scripts/memcap.sh 8`.

## What was re-derived

1. Lemma 1: the argument is c10 Lemma 1 with one change: for squarefree composite F the even prime power sums
   lose the prime factors of F. For N <= 3 only sum_{deg P = 1} nu(P)^2 = q - r(F) occurs. Holds as stated. For
   N >= 4 the stratum would need the number of quadratic prime factors as well; RESULT.md says so (weakest step 3).
2. Proposition A: from -x.y = sum over roots of x(alpha) y(q/alpha). Symmetric: x(alpha) x(q/alpha) =
   alpha^N f(alpha) (q/alpha)^N f(q/alpha) = q^N f(alpha)^2, the 2g roots give each s_m twice. Antisymmetric:
   -q^N a(alpha)^2, and (alpha - q/alpha)^2 = s^2 - 4q. Mixed: the two roots of a pair cancel. Holds. Float check
   with random real and complex s_m, random symmetric and antisymmetric vectors, q in {3, 5, 7, 11}, g in {2, 3},
   N <= 3: 2000 cases, largest relative deviation 1.7e-13.
3. The N = 1 inequality: -D.D = 2 q sum_m s_m^2 = 2q (e_1^2 - 2 e_2) confirmed with the own Gram on every distinct
   L-polynomial of the rerun families.

## Reruns on other cases (`ref.py`)

| family (not in the lane) | cases | outcome |
|---|---|---|
| q = 3, all 162 squarefree F of degree 5; lam in {1, 4, 5}; k = 0..3 | 35 points (r, L) | S a function of (r, L); N = 1: S = c L_1 in 24 of 24 vector-strata; N = 2: not affine in (L_1, L_2) in 24 of 24; inequality 32 of 32 L-polynomials |
| q = 3, all 1458 squarefree F of degree 7; lam in {1, 4} | 236 points | S a function of (r, L); N = 1: 24 of 24; N = 2: not affine in 16 of 24; inequality 218 of 218 |
| q = 5, seeded 300 squarefree F of degree 5; lam in {1, 4} | 80 points | N = 1: 24 of 24; N = 2: not affine in 24 of 24; inequality 68 of 68 |

The 8 vector-strata at q = 3, degree 7 where an affine fit exists are the stratum r = 2: there L_1 is the
Legendre symbol at the single remaining point, L_1^2 = 1 on all 22 points, so the L_1^2 term is a constant. This
is the same small-stratum effect that RESULT.md records for the top strata.

## Errors and weaknesses found

1. **Counts.** The first draft would have reported 15.7 million "curve-cases" for the inequality. At N = 1 the
   inequality does not depend on the vector or the stratum; the number of independent tests is the number of
   distinct L-polynomials (5394). RESULT.md section 3 states this. The same applies to the fake table: "all N = 1
   vectors agree" is forced by S = c_1 t_1.
2. **The decisive test was close to decided before the run.** c10 4(c) with its referee's correction 5 already
   gives: upper bound, needs real phi_m only. What this lane adds is the exclusion of every curve-independent
   quadratic form (span test), the block statement, the control with three classes, composite conductors, marks,
   and genus 3. The verdict "precise obstruction" is a confirmation with a sharper statement, not a new finding
   of a different kind.
3. **Outcome (a') in the stratum q = 7, genus 2, r = 3, N = 3.** S (not S^2) lies in the span of t_0..t_6 there
   for all 20 vectors: 10 points, 7 columns, 3 free points. S^2 does not. Reported in section 2; read as a
   small-stratum effect, not established as one (L_1 takes five values there).
4. **Class assignment of fakes uses floats** (threshold 2 sqrt q with margin 1e-7); real-rootedness is exact
   (discriminant sign). The block tests are exact and agree with the classes in all 288 cases, which is an
   independent confirmation of the assignment.
5. **Genus-3 class C passes in 31 of 48.** The sentence "fails for C" of the PREREG reading rule is true only in
   genus 2. RESULT.md reports the counts and reads the genus-3 case as "less than reality". Correct.
6. **4(iv) is ARGUED.** No computation supports the tensor-power statement for N >= 2. The N >= 2 part of the
   verdict rests on the exact span tests only: no class D_k, S and S^2 not in the span of t_0..t_2N.
7. **J_k was not computed** (weakest step 1). The answer to the assignment's question is for S_cop inside the
   round-8 law. An independent referee should decide whether item 26's remainder ("the probe J_k itself for
   r >= 6 on conductor degree >= 5") is closed by this or only its target-dependent factor.
8. **One deviation from PREREG**: the full q = 7, degree 7 family was run in addition to the registered sample
   of 6000; the sample outcomes (`sample.log`) agree. The requirement e_1 != 0 for fakes was added at sampling.
   The h_2 lower bound is post hoc and labelled so.

## Verdict of this check

Holds as a model statement with the scope limits above. No requirement flag; no statement about zeta. Not
refereed independently.

---

# Independent referee, lens: general (2026-11-19)

Appended below the author's self-check, which is left unchanged. This section is an independent check and counts
as one referee. Code written for it: `ref_general_ind.py`, `ref_general_fakes.py` (nothing imported from the
lane; local, `scripts/memcap.sh 8`; the compute server was not used).

## Verdict

**Holds as a model statement (F_q[T]; no statement about zeta), with one correction of wording that matters for
the map row (item 1 below) and one limit on what is closed (item 2).** Both PROVED steps (Lemma 1, Proposition A)
were re-derived and are correct. The registered outcome (b) and its control are confirmed on other cases.
Requirement flags set by this referee: R1 false, R2 false, R3 false, R4 false.

## Re-derivations

1. **Gram.** `gram()` gives q^j + q^k - q^min(j,k) (q^d + 1 - t_d) = q^min(j,k) t_|j-k| off the diagonal and
   2g q^j on it; with the roots closed under alpha -> q/alpha this is sum over roots of alpha^k (q/alpha)^j.
   P_j = Gamma_j minus its horizontal and vertical components, so -P_j.P_k = q^j + q^k - Gamma_j.Gamma_k.
   CLASSICAL inputs: Gamma_j.Gamma_k = q^min N_|j-k|, Gamma_j^2 = q^j (2 - 2g). Not re-opened in a source.
2. **Proposition A.** x(alpha) x(q/alpha) = q^N f(alpha)^2 for x = z^N f, f(z) = f(q/z); = -q^N a(alpha)^2 for
   antisymmetric a; every antisymmetric a is (z - q/z) G(z + q/z) since z^j - (q/z)^j is divisible by z - q/z
   with symmetric quotient; a^2 = (s^2 - 4q) G(s)^2. Mixed term: f(alpha) [a(q/alpha) + a(alpha)] = 0 per pair.
   Correct. The two "iff" statements need the block at N >= g - 1 resp. enough degree to interpolate at the
   distinct s_m (the lane tests N = g): for a non-real pair take real f with f(s) = i; for real |s_m| > 2 sqrt q
   take G supported at s_m. Correct for g = 2, 3 as tested. At N = 1 the symmetric block is 2 x 2 with Gram
   [[g, sum s], [sum s, sum s^2]] (times 2q); its semidefiniteness is exactly the N = 1 inequality, which is why
   genus-3 class C can pass.
3. **N = 1 inequality.** D = c_1 (P_2 + q P_0), f = s, -D.D = 2 q c_1^2 sum s_m^2, H = g c_1^2 sum s_m^2,
   H - S^2 = c_1^2 sum_{m<n} (s_m - s_n)^2. Genus 2, pair u +- iv: gap = -4 v^2 < 0 always (48 of 48 fail is
   forced). Genus 3: gap = 2 (s_1 - u)^2 - 6 v^2. Correct.
4. **Lemma 1.** nu_F is completely multiplicative in A (resultant). S_cop is a sum over squarefree A' of
   nu(A') times a weight depending on the multiset of prime degrees only; the type sums are polynomials in
   p_(e,m) = sum_{deg P = e} nu(P)^m, e m <= N; log L gives p_(e,1) recursively; p_(1,2) = q - r is the only
   even sum for N <= 3. Correct. Hand derivation of the displayed example: for (N, lam, k) = (2, 2, 1),
   S = -(pi(2)(q-2)/2)(L_1^2 - (q - r)) + (pi(2) - 1) q (L_2 - (L_1^2 + q - r)/2); at q = 7 this is
   -(245/2) L_1^2 + 140 L_2 - (35/2)(7 - r), which is the lane's formula at r = 0. The closed form at lam = 7,
   k = 0 is -pi(7) times the u^N coefficient of 1/L. Both confirmed numerically below.
5. Counts: 2500 + 14406 + 62500 + 705894 are q^d - q^(d-1); 81 + 138 + 1283 + 3892 = 5394; the vector-stratum
   counts 380, 340, 640, 460, 1240, 140 follow from the strata lists in `analyze.log`. The vanishing of L_1 in the
   stratum q = 7, degree 5, r = 5 is forced (Wilson: chi(F(b)) chi(F(c)) = chi(-1) = -1 for the two non-roots).

## Rerun on different cases (`ref_general_ind.py`)

Second implementation with no resultant: nu(P) = eps^e chi_(q^e)(F(theta)) for a root theta of P in F_(q^e)
(own field arithmetic), L_n from the point sums over F_q, F_(q^2), F_(q^3) through log L, S_cop by brute
enumeration over factorisation types. Grid N <= 3, lam in {0, 1, 2, 3, 5, 7} (lam = 5 is not in the lane),
k = 0..3.

| family (not in the lane) | points (r, L) | S a function of (r, L) | closed forms (lam = 7; hand formula (2,2,1) with r; N = 1: S = w L_1) | N >= 2: polynomial law / linear in t_0..t_N / S in span t_0..t_2N / S^2 in span | N = 1 inequality, blocks |
|---|---|---|---|---|---|
| q = 11, 400 seeded squarefree F of degree 5 | 203 | yes; L_3 = q L_1 in all (functional equation, independent of the lane) | 5684 checks, 0 off | 192 of 192 / 0 of 192 / 0 of 192 / 0 of 192 | 180 of 180 L-polynomials; symmetric and antisymmetric blocks semidefinite 180, cross block zero 180; rho from 0 to 1 |
| q = 11, 150 seeded F of degree 7 | 150 | yes | 4200, 0 off | 192 of 192 / 0 / 0 / 0 | 150 of 150; blocks 150, 150, 150; rho from 0 to 0.508 |
| q = 13, 150 seeded F of degree 5 | 119 | yes | 3332, 0 off | 168 of 168 / 0 of 144 / 0 of 144 / 0 of 144 | 111 of 111; blocks 111, 111, 111; rho from 0 to 0.889 |

Limit of this rerun: at q = 11, degree 7 the functional equation was used to complete L (L_4..L_6), not checked.

## Control, run by this referee (`ref_general_fakes.py`)

The lane's 288 fakes re-tested with independent code: every recorded verdict (inequality, symmetric block,
antisymmetric block) reproduced, 288 of 288. New fakes at q = 11 and 13, class fixed exactly by construction
(integer quadratic factor in s, plus an integer root in genus 3), 40 per class per (q, g):

| class | N = 1 inequality holds | symmetric block semidefinite | antisymmetric block semidefinite |
|---|---|---|---|
| W (160) | 160 | 160 | 160 |
| R (160) | **160** | 160 | 0 |
| C (160) | 0 of 80 in genus 2; 29 of 80 in genus 3 | 0 | 0 |

The control outcome of the lane is confirmed: the registered inequality holds for every fake with real off-line
pairs. No zeta-only mechanism is claimed, so the brief's other controls do not apply; none was needed.

## Errors and corrections

1. **Verdict item 5 and section 4(ii) overstate the block statement.** "Any Cauchy-Schwarz or sign statement
   about the signal reads only the reality of the s_m" and "the Weil bound sits in the antisymmetric part, which
   the signal does not meet" are true only for pairings of D_k with classes that are themselves symmetric. The
   N = 1 signal is also S = c_1 t_1 = -c_1 P_0.P_1, and P_0 is not symmetric: in the span P_0..P_2 its symmetric
   part is s/(2q) and its antisymmetric part -(z - q/z)/(2q), and -P_0.P_0 = 2g is the sum of both blocks.
   Cauchy-Schwarz on span(P_0, P_1) gives t_1^2 <= 4 g^2 q. This is the classical Castelnuovo-Severi argument
   for the Weil bound (Mattuck-Tate, Grothendieck); it is a Cauchy-Schwarz statement about the same signal and
   it does read the antisymmetric block. Checked: on the lane's own class-R fakes it fails in 26 of 96
   (holds 10, 15, 21, 24 of 24); on the referee's class-R fakes it fails in 26 of 160; |t_2| <= 2 g q fails in
   75 of 96 and 126 of 160. Corrected statement: every inequality between D_k and a symmetric class reads
   reality only; the bound of the signal by the full norms of P_0 and P_1 is Weil's classical inequality.
   Consequence for the verdict: none for the registered test (S^2 against -D.D), and no lead either, since the
   corrected inequality is a known theorem and is still passed by 70 of 96 class-R fakes. The proposed map row
   should carry the corrected sentence.
2. **"Item 26's remainder closes" is closed for the factor S_cop only.** The probe J_k was not computed; the
   round-8 law |J_k| = wt_k q^d |S_cop(k)| was not tested on conductor degree >= 5 (the lane's weakest step 1
   says this). STRATEGY 3.1 item 26 names "the probe J_k itself for r >= 6 on conductor degree >= 5" as not
   covered. The record should read: closed for the target-dependent factor within the round-8 law; wt_k and
   the non-coherent part of the row energy are not addressed.
3. **Novelty.** Proposition A is an elementary reformulation of the classical equivalence between the Hodge
   index theorem on the span of Frobenius graphs and the Riemann hypothesis for the curve. The splitting into
   the two signatures is a convenient bookkeeping statement, not a new theorem; the N = 1 inequality on the 5394
   curve L-polynomials is implied by Weil's theorem (real s_m) and the count is a consistency check of the code.
   The RESULT says the second point; "New here" should not list the splitting without "elementary, classical
   content".
4. **N >= 2.** "Not a class on C x C at all" is established in the sense tested: S is not in the span of
   t_0..t_N (and not of t_0..t_2N except the one small stratum reported), in 640 of 640 vector-strata, and in
   528 of 528 on the referee's cases. The reading that no positivity statement arises for N >= 2 (4(iv)) is
   ARGUED only, as labelled; the post hoc bound h_2 >= -g q is correct (h_2 = (t_1^2 + t_2)/2 and
   t_2 = sum s_m^2 - 2 g q) and again reads reality only.
5. **Scope of "iff" in Proposition A (i).** Stated for a block large enough to interpolate at the s_m (N = g in
   the checks). The signal at N = 1 lives in the 2 x 2 symmetric block, where semidefiniteness is weaker than
   reality for g >= 3. The RESULT's control table is consistent with this; the summary sentence should say
   "at N >= g - 1".
6. Checked and found in order: no step assumes the Riemann hypothesis of the target beyond citing Weil's theorem
   as a theorem; no verified-height statement; no statement about zeta; the deviation from PREREG (full
   q = 7, degree 7 family in addition to the sample; e_1 != 0 for fakes) is declared; class assignment by floats
   agrees with the exact block tests in 288 of 288.

## Requirement flags (strict)

| flag | value | reason |
|---|---|---|
| R1 | false | multiplicativity enters only the model identity of Lemma 1; the inequality holds for class-R fakes |
| R2 | false | q in {5, 7} (referee: 11, 13), N <= 3; no height aspect |
| R3 | false | class-R fakes pass every step; genus-3 class-C fakes pass in part |
| R4 | false | not attempted |

Surviving claim: in the F_q[T] model, for squarefree conductors of degree 5 and 7 and N <= 3, S_cop(k) is a
polynomial in L_1..L_N with coefficients depending on (q, N, lam, k, r(F)); it is linear in the Frobenius traces
only for N = 1; there 0 <= S^2 <= (g/2)(-D.D)/q is Cauchy-Schwarz in the symmetric block of the graph-class
form, has no lower bound and no equality, and holds for every fake with real off-line pairs. Registered outcome
(b); no RS-2 lead. Closure of item 26's remainder applies to the factor S_cop within the round-8 law.
