# c11-frontier-nth-order-sieve: the n-th order large sieve (de Faveri 2610.04045) in the ledgers of rows Z12, Z6, Z5, Z14

Round 11, frontier slot (scoreboard part B only). Kind: deepen. Date: 2026-11-19. Not refereed by a second agent.
This lane makes no statement about zeros of zeta. It cannot change the headline. It has **no answer for R4** (passage
from finite stages or from Re s > 1 to the critical line); it is exponent bookkeeping inside the 7/8 architecture,
relative to unrefereed manuscripts. All four requirement flags are false.

Labels: PROVED (elementary argument given here) / EXACT (rational arithmetic or rational LP, script named) /
PROVED-rel X / CITED (read in the named text, proof not checked) / MODEL / OPEN.

## Verdict

**Precise obstruction: the new input changes no figure.** With Theorem 1.1 of de Faveri (n = 6) in place of the
(KD)^(2/3) sieve, every ledger tested returns the value it had:

- part-B abscissa: **0.8748866470** (Liu 2610.26835 v2 comparison system), unchanged, inside the pre-registered
  interval [5/6, 7/8], not below 0.874886647. No claimed part-B number.
- reduced-model floor 13/15: unchanged (exact LP).
- quartic line of Z14: Framework A with the new bound on the Poisson dual gives exponent exactly 2, abscissa 1
  (no figure), for every order n and every row length.
- the one place where the manuscripts use the sextic sieve (the preliminary 11/12 stage): margin unchanged. A
  sieve-only variant of the comparison system moves from 0.909566 to 0.908705 (float screen), above 7/8 and above
  the standing figure; it is not a part-B number.

The reason is the same in each ledger and is stated as three lemmas (section 3): the new off-diagonal term is
exactly the term the architecture already carries (Prop 15.2 exponent 1/6; polar branch b/12; amplifier factor
H^(1/n)). The sieve is an arbitrary-coefficient inequality that is sharp for the Gauss-sum vector, and the
structured counts of the manuscripts are already below anything it can give.

Slot rule (STRATEGY section 1): this is the first of two rounds without a changed figure.

## 1. Plan

1. Open the full text of 2610.04045 and decide coverage of the sextic rows and conditionality (task 1).
2. First lemma: exact exponent arithmetic of the replacement at n = 6 (task 2).
3. Decisive test: rerun the ledgers of Z12, Z6 (with Z5) and the quartic line of Z14 with exact rationals; report the
   abscissa with its dependency list (task 3). Pre-registration: figure in [5/6, 7/8]; below 0.874886647 would be a
   claimed part-B number; outside the interval is an error to trace.
4. If time remains: transcribe Propositions 2.1 to 2.3 of Ji 2611.16665 and decide the two format questions (task 4).

What is new relative to the record: `r2-zf-gm-inverse-witness` (N3) recorded the bound K^(5/6) D^(1/3) as OPEN and
predicted that it would change no count in its window; `c10-new-inputs-scan-2026` named the theorem as the missing
tool of rows Z12, Z6, Z14 without running the ledgers. This lane runs them.

## 2. Sources opened (task 1)

All three were fetched as public PDFs by arXiv identifier (no project detail in any request), converted to text and
read as text only (`dl/*.txt`; untrusted downloads). No proof was checked line by line.

**de Faveri, arXiv 2610.04045 v1 (2 Oct 2026), full text (20 pages).** CITED.
- Family: K a number field containing mu_n, S a finite set of finite places containing those dividing n with
  S-integers of class number 1, chi_a the n-th order Hecke characters of Fisher-Friedberg / Friedberg-Hoffstein-Lieman
  (section 2.3), a and b running over **n-th-power-free** ideals prime to S (kernel Theta_n) or squarefree ideals
  (kernel Xi_n <= Theta_n).
- Theorem 1.1: for n >= 3, A, B >= 1: Theta_n(A, B) << (AB)^eps (A + B + A^(1-1/n) B^(2/n) + A^(2/n) B^(1-1/n)).
  **No hypothesis** (no GRH, no conjecture) in the statement; the proof (sections 3 to 7) is Poisson summation in a,
  a coupling of root numbers, and the recursion (E_alpha) -> (E_{2 - (n-1)/(n alpha - 1)}) with fixed point
  alpha = 1 + 1/n, started from the trivial bound. Conditional statements in the paper are only quoted earlier
  results (Dunn-Radziwill lower bound under GRH) and side assumptions of Theorems 1.3 and 1.4 (not used here).
- Corollary 1.5: sum over n-th-power-free a, N(a) <= N, of N(sigma, T, a) << N^(1 - delta_n(sigma) + eps)
  T^(1 + d(1 - sigma)/(3 - 2 sigma) + eps); three ranges of sigma; no hypothesis. The formula used in `ledger.py`
  was transcribed from p. 4 and compared with the proof on p. 20 (the middle-range quotient
  ((2n-3)q(n+1-nq) - 2(n-1))/D agrees at n = 6).
- Examples 2.2, 2.3 identify the family with the classical symbols (a/b)_3 over Z[omega] and (a/b)_4 over Z[i].
  There is **no n = 6 example** in the paper.

**Coverage of the sextic rows: yes, relative to two unrefereed texts and one unchecked matching.** n = 6,
K = Q(omega) (contains mu_6), S = primes above 6 satisfies the hypotheses of section 2.3. The manuscript's Lemma 9.1
family (sextic symbols over Z[omega], squarefree rows and columns, primary generators) is a subfamily of Theta_6
up to finitely many ray classes (sextic reciprocity with a sign bicharacter of fixed classes). This identification
is not written in de Faveri's paper; it is asserted, with the reciprocity convention, by Xu-Sang 2610.17675 v2,
(1.2) and section 2.1 ("De Faveri's fixed-order theorem gives Xi_6(A, B) << (AB)^eps (A + B + A^(5/6) B^(1/3) +
A^(1/3) B^(5/6))"). Not covered by the theorem as stated: rows with a sixth-power factor (the amplifier rows
u = p^6 and complete-row matrices; for these the repeated rows give a term (number of sixth powers) x B, see
Lemma 3 below), and families varying in the height aspect.

**Xu-Sang, arXiv 2610.17675 v2 (14 Oct 2026), introduction and section 2 read; item E2 of the c10 referee.** CITED.
Theorem 1.1: matching lower bound Xi_6(A, B) >> (AB)^(-eps) (A + B + A^(5/6) B^(1/3) + A^(1/3) B^(5/6)) in the full
range, relative to the 30 Sep 2026 version of the 7/8 manuscript (its Lemma 18.1). Theorem 1.2: low-height family
count Q^(R(sigma)), R = (31 - 32 sigma)/(21 - 12 sigma), and a prime second moment Q^((37 - 10 sqrt 6)/6).

**Ji, arXiv 2611.16665 v2**, full text (section 5).

Consequence for "relative to": every statement below is relative to 2610.04045 (unrefereed) and, where the 7/8
ledgers are used, to the manuscripts named in map section 3.5.

## 3. Work

Scripts (all local, through `scripts/memcap.sh 8`; the compute server was not used and no unit was started):
`ledger.py` -> `ledger.log`, `ledger.json` (exact rationals; 56 checks, all pass), `ledger_dir6.py` ->
`ledger_dir6.log` (exact rational LP by vertex enumeration; `tiers_fe_copy.py` copied unchanged from
`c6-unreflected-marks-kd23`), `scalar_rerun.py` -> `scalar_rerun.log` and `part1_envelope.py` -> `part1_envelope.log` (float LP of
`bypass-78/scalar_system.py`, screens), `recheck.py` -> `recheck.log` (second pass by a different method).
One run of `part1_envelope.py` exceeded the 10-minute tool limit (an uncached inner grid); its process was stopped
by pid and the cached version ran in 73 s.

### 3.1 First lemma (task 2). PROVED (two-line arithmetic), EXACT check on 14641 rational points

For n = 6 write K = U^a, D = U^b. Old exponent max(a, b, 2(a+b)/3); new exponent
max(a, b, 5a/6 + b/3, a/3 + 5b/6).

- (i) New <= old everywhere: K^(5/6) D^(1/3) <= (KD)^(2/3) iff K <= D^2, and for K > D^2 it is < K.
- (ii) Balanced point K = D: 7/6 in place of 4/3 (per unit).
- (iii) **Correction to c10 item 1** (already item E1 of its referee): the term K^(5/6) D^(1/3) exceeds K + D exactly
  for D^(4/5) < K < D^2, and the two terms together exactly for **D^(1/2) < K < D^2**. The window in which the bound
  is not mean-value-optimal is the same as for (KD)^(2/3); only the size inside it changes. In particular, at
  K = U, D = U^n the norm is mean-value-optimal for n <= 1/2 with either bound (threshold of `zf-large-values` P4
  unchanged).
- (iv) n = 3: the new bound is (KD)^(2/3) again. Cubic rows see no change. n = 4: balanced exponent 5/4, that is
  (MN)^c with c = 5/8.

### 3.2 Row Z12 (critical class). PROVED (Lemma 1) + EXACT

Ledger of `r2-zf-critical-density` 2.3: a product polynomial of total length U^Y built from detected factors has
squared lower bound at most U^(delta Y); the count from an arbitrary-coefficient sieve is the sieve exponent at
(K, D) = (U, U^Y) minus delta Y.

**Lemma 1.** inf over Y of [max(1, Y, 5/6 + Y/3, 1/3 + 5Y/6) - delta Y] equals 1 - delta/2 for delta <= 1/3 (at
Y = 1/2) and **7/6 - delta** for 1/3 <= delta <= 5/6 (at Y = 1). For every class (delta, x) with 0 < delta < 5/6,
0 <= x <= 1/2 and every kappa in [13/18, 1] this is strictly larger than the count R_kappa(delta, x) of Liu
(14.3). *Proof.* The function of Y is convex piecewise linear with slopes -delta, 1/3 - delta, 5/6 - delta,
1 - delta on [0, 1/2], [1/2, 1], [1, 2], [2, inf). For the comparison: R - (1 - delta) =
(5/6 - delta) delta P / (2J), J = (5/6 - delta) D + delta P, and D - P = 1 + x - 2c x^2 >= 1 (c = 1/(3 kappa) <= 6/13),
so J >= (5/6) P and R - (1 - delta) <= (3/5) delta (5/6 - delta) <= 5/48 < 1/6. For delta <= 1/3 the file's bound
R <= 1 - 2 delta/3 < 1 - delta/2 applies. QED.

Numbers (EXACT, `ledger.log` section 2):

| quantity at delta_c = 0.469345 | (KD)^(2/3) | n = 6 bound | needed |
|---|---|---|---|
| best product-polynomial count | 0.765328 (Y = 1/2) | **0.697322** (Y = 1) | below R_c = 0.590332 |
| Ingham/Montgomery two-class scheme (exact LP in 3 variables) | 0.795580 (file: 0.795641 on a grid) | 0.726202 | same |
| Cor 1.5 at n = 6, sigma = 0.734672 | n/a | 0.750051 | same |
| Halasz count (2.1) of `r2-zf-gm-inverse-witness` (E5), r = 0.7605 / 5/6 / 1 | 0.8167 / 0.8311 / 0.8640 | 0.7299 / 0.7200 / 0.6973 | below 1 - delta r = 0.6431 / 0.6089 / 0.5307 |
| S2 excess over the Guth-Maynard budget, r = 0.7605 to 0.87 | U^0.338 to U^0.578 | U^0.251 to U^0.455 | U^0 |

Least margin of the new option over R on the class grid (4 values of kappa x 171 x 51 rational classes): 0.0252.
Cor 1.5 (n = 6) over R: least margin 0.0493. Cross-check from print: Xu-Sang's own table gives 5/6, 8/11, 4/7 for
Cor 1.5 against 29/39, 7/12, 13/33 for their structured count at sigma = 2/3, 3/4, 5/6; `ledger.py` section 7
reproduces it and verifies the identity (31 - 32 sigma)/(21 - 12 sigma) = R(delta, x = 0) (kappa drops out), so
their Theorem 1.2 count is the x = 0 column of the system already in use, not a new count.

Consequence: the count vector of the scalar comparison system is unchanged at every class, so the system and its
abscissa are unchanged. Screen: `scalar_rerun.py` reruns runs S0, S1, S3 of `bypass-78/scalar_system.py` with the
count replaced by min(R, new option, Cor 1.5): B* identical to 12 digits, new option selected at 0 LP rows.

### 3.3 Rows Z6 and Z5. EXACT

- Z6 (toy geometry D = Q^(7/5)): (Q + D + (QD)^(2/3))^(1/2) = Q^(4/5) becomes
  (Q + D + Q^(5/6) D^(1/3) + Q^(1/3) D^(5/6))^(1/2) = **Q^(3/4)**, binding term Q^(1/3) D^(5/6) = Q^(3/2). Needed:
  Q^(1/2 - eta). Shortfall Q^(1/4 + eta) in place of Q^(3/10 + eta). The diagonal term D alone gives Q^(7/10), so no
  operator-norm bound in the (m | c) grouping reaches Q^(1/2). No sub-range of the window is covered.
- Z5 (Gram exponent e in sum_m |A_m(X)|^2 << (Q/X)(1 + P^e), P = X^2/Q): with coefficients of size 1/X on
  N(s) ~ X, the new bound gives e = **1/6** for Q^(1/2) <= X <= Q (old: 1/3). This is the exponent of manuscript
  Prop 15.2 and equals the lower bound on file (`tro6-sieve` Prop L), so the bound is sharp there. Loss in T_X:
  P^(1/12), the cap for any inequality valid for all c; needed P^0. TRO6 eta stays 0.
- The (a | b) grouping of Z6 has a cubic kernel; by 3.1 (iv) nothing changes.

### 3.4 Reduced ledger of Z15b with an unreflected row branch. EXACT (LP) + PROVED (Lemma 2)

Added branch dir6 (rows Z^M, columns Z^(1+l)): k = max(0, 1 + l - M, (1 + l)/3 - M/6, 5(1 + l)/6 - 2M/3).

**Lemma 2.** With the polar branch G = b/12 kept, the dir6 low constraint gives B >= 1 in every geometry.
*Proof.* B >= 1 - h/6 + b/12 + k/2 with k >= (1 + l)/3 - M/6, h = 1 - lx + l, b = ly - lx, M = lx + ly:
1 - (1 - lx + l)/6 + (ly - lx)/12 + (1 + l)/6 - (lx + ly)/12 = 1. QED. (With G = 0 the same line gives
B >= 1 + (lx - ly)/12.)

LP (`ledger_dir6.log`): regression A1 = 13/15 confirmed; dir6 only: B = 1 at boxes 4, 8, 16 (as dir); refl | dir6 |
empty: 13/15 exactly, vertex (lx, ly, l) = (2/5, 2/5, 1/5), row refl; with w = 0, 1/10, 2/5, 1, 2, 4 the values equal
those with dir; relaxed geometries Q and free: 13/15; anti geometry without compensation: 1. The new sieve changes
no vertex.

### 3.5 Row Z14, quartic line. PROVED (Lemma 3) + EXACT

Framework A (`zf-campaign-quartic-gl2.md` 3.1 and 4.6, script (B2)): rows H = D^lam, dual rows H* = D^(2 - lam),
columns X = D, amplifier J = H^(1/k).

**Lemma 3.** For every order n >= 3 and every lam, the dual term of the n-th order bound satisfies
H x H*^(1 - 1/n) X^(2/n) / H^(1/n) = D^2. So Framework A with Theorem 1.1 on the Poisson dual returns the trivial
exponent 2 for |A_1|^2 (abscissa 1), for n = 3, 4, 5, 6 and all lam in [0, 2].
*Proof.* lam + (1 - 1/n)(2 - lam) + 2/n - lam/n = 2. QED.

At the balanced point this is the file's formula theta_quartic(c) = 3/8 + c at c = 5/8, the value at which it
reaches 1. The lower bound (1.7) of de Faveri-Dunn-Hoffstein (stated as unconditional for n = 4 in 2610.04045)
makes c = 5/8 the true exponent of the quartic sieve norm, so input (i) of the quartic note 4.6 ("a quartic large
sieve with c <= 1/2 at M ~ N") is **false**, relative to that lower bound. What remains of Z14's open quartic
input is (ii) only: the mean square with the actual coefficients (Lindelof on average for the index-h^3 series).
The abscissae 7/8 + l2/8 and 7/8 + 3 l2/8 of the paired rows are relative to (ii) and are untouched.

The same identity is the content of Lemma D of the quartic note (a family-blind bound cannot feed an amplifier):
applied to rows with n-th-power parts, Theorem 1.1 must be summed over u = m^n u_0 and returns at least
H^(1/n) x D.

### 3.6 Where the sextic sieve sits in the manuscripts, and the figure (task 3)

**Uses of the sextic sieve in the sources (CITED: text search of the three manuscript texts on file).**
- 7/8 manuscript (`paper.txt`, 30 Sep 2026 text): Lemma 9.1 is applied in one place, Proposition 9.2 (the "sextic-sieve
  row envelope" R(delta) = min(1, max(1 - delta/2, 4/3 - delta)), (9.16)), which is used in the Part I central
  estimate only (section 10.5; "Part I uses only the inverse polynomial in its row count"). The other 2/3-exponent,
  (14.6), is Heath-Brown's **cubic** sieve, to which 3.1 (iv) applies (no change).
- Liu 2610.12234: "sextic sieve in Section 6 to obtain the preliminary 11/12 bound" (its Lemma 6.1 = manuscript
  Lemma 9.1). Liu 2610.26835 v2 (the source of the figure): sieve inputs are the quadratic sieve (6.1) and the cubic
  sieve (6.2) only; its counts M1, M2 are stated there not to follow from a large sieve for arbitrary coefficients.

So the sextic sieve enters the chain behind 0.8748866470 only through the preliminary stage with abscissa 11/12.

**Part I with the new bound (EXACT, `ledger.py` section 8).** The envelope becomes
min(1, max(1 - delta/2, 7/6 - delta)) when Theta_6 is applied to the sixth-power-free rows directly, and a slightly
larger function when the manuscript's split u = s w k is kept (values at delta = 1/4, 1/3, 5/12: 15/16, 7/8, 13/16
against 11/12, 5/6, 19/24; old: 1, 1, 11/12). For delta >= 2/3 all three equal 1 - delta/2. The Part I central
exponent E_I(h) = -3/4 + (delta + R(delta))/2 has maximum -1/24 at the bin ceiling delta = 5/6 with either
envelope, so the Part I margin is unchanged, and 11/12 is set by its low side (5/6 + lx/6 at lx = 1/2), which
contains no sextic sieve.

**Secondary figure (float LP screen, `part1_envelope.log`; MODEL outside the geometry in which the sources prove
their lemmas).** The pointwise comparison system of `bypass-78/scalar_system.py` with the count replaced by the
sieve-only envelope (no structured moment M1 or M2 used):

| count used | no marks (l = 0) | marks allowed |
|---|---|---|
| old envelope (9.16) | 0.912142 | 0.909566 |
| new envelope (split kept or direct: same value) | 0.911612 | **0.908705** |
| structured count R_kappa (file value) | 0.894737 | 0.874957 |

The sieve-only figure moves by 8.6e-4 and stays above 7/8 and above the structured-count figures. It is not a
part-B number: it is a weaker system than the one on the scoreboard.

**Abscissa obtained: B_flat = 0.8748866470**, the root in [5/6, 7/8] of
133488 B^4 - 376596 B^3 + 384534 B^2 - 167541 B + 26231 (rational bisection; one root in the interval). It is the
figure already on the scoreboard. Dependency list: openai/math 7/8 manuscript (30 Sep 2026); Liu 2610.12234 and
2610.26835 v2; Xu-Sang 2610.15291 (same system, 0.8748866496 at kappa = 29991/40000); none refereed. The new input
2610.04045 enters the dependency list of **no** figure on the scoreboard. Reduced-model floor (ideal high side,
MODEL): 13/15, unchanged.

Pre-registration outcome: inside [5/6, 7/8]; not below 0.874886647; no error to trace. The quartic line returns
"no figure" (abscissa 1), which is the predicted value of the file's formula at c = 5/8 and is not a figure of the
sextic system.

### 3.7 Ji 2611.16665 (task 4): transcription and format. CITED + EXACT replay

Objects: I(X, H, Y) = sum over d and u of |d|^6 alpha(d)^4 J(u) V(|u|^2 |d|^8 / H) B_d(u), with B_d a double sum
over c, b of a function F_{c,b}(u) whose finite Fourier transform is a product of quartic Gauss sums
g_+(r^3, c) g_-(r, b); u = u_0 f^4 splits I = I_np + I_pr. H = X^(65/144), Y = X^(1/288).

- Prop 2.1 (upper bound, all 1 <= H <= X, Y >= 1): |I| << (XHY)^eps X^2 Y^5 H^(-2).
- Prop 2.2: I_np << X^(599/600 + eps) Y H^(1/4).
- Prop 2.3: I_pr = K_0 Y H^(1/4) S_W(X) + O(X^(1+eps) Y^(13/25) H^(1/4) + X^(1+eps) Y H^(1/8)), with S_W the inverse
  Mellin transform of W^(s) D(s), D(z) = L_lambda(4z - 2, alpha^4) Q(z) / zeta_lambda(z), Q holomorphic and
  non-vanishing in Re z > 1 - 2^(-6).

Replay (EXACT): Prop 2.1 divided by the signal normalisation Y H^(1/4) is X^(575/576); the term X Y^(13/25) gives
exactly X^(599/600) and sets the figure; X H^(-1/8) gives X^(1087/1152); E(599/600) = 3/302 and
3/302 + 6/25 - 1/4 = -1/15100; Lemma 4.3 holds on 4001 rational points (the value 2285/2304 at sigma = 5/8, E = 1
confirmed). The exponent E(sigma) is Cor 1.5 at n = 4 (three branches compared: equal).

Decisions:
1. **Format.** It is the same kind of comparison as the Proposition 2.1 format of the 7/8 manuscript: one probe
   bounded two ways, with signal (normaliser)/(L-function of the target) times H^(1/r) from the rows that are r-th
   powers. The normaliser is L_lambda(4z - 2, alpha^4) Q(z); the paper uses it only in Re z > 63/64, which is a floor
   of its own text (the analogue of map row Z24 for order 4 would be 3/4; not derived here). The differences: the
   low side is a single crude bound (Prop 2.1) and the non-principal rows are handled by a family zero count
   (Cor 1.5) instead of a detector and a moment.
2. **Exceptional term.** No term of the type P_a^(1/6) appears. After the reflection the angular factor alpha(r)^3
   removes the zero frequency of the second Poisson summation, and the remaining frequencies are bounded termwise;
   the cost is the size X^2 Y^5 H^(-2) of Prop 2.1.
3. **r = 6.** The paper contains no sextic statement. A transplant needs a sextic analogue of Prop 2.1 (a Kubota
   series whose completed form is entire and whose reflection removes the zero frequency); none is on file: OPEN.
   What can be computed without it (MODEL, `ledger.py` 6b): the top-group step without loss needs
   E_r(theta) <= 1/r, that is theta >= 19/20 for r = 4 and theta >= 1 - (9 - sqrt 39)/84 = **0.967202** for r = 6.
   For r = 4 the lossy alternative is excluded by Prop 2.1 itself (it would need y > h/2, then 2 - h/4 <= theta,
   impossible for h <= 1). So the density format at r = 6 with Cor 1.5 stays above 0.967 unless the top group is
   treated differently: above 7/8. The kill condition of c10 Lane B applies; no abscissa is reported for r = 6.

## 4. Controls

The new input is an inequality for arbitrary coefficient vectors. Therefore:

- THIN, U, every sign twist and thin prime deletion **pass** it: it holds with the b-sequence replaced by any
  sequence, and it does not see the target. DH: the inequality involves no L-function of the target; passes.
  Beurling, backward heat, zeta(s+a) zeta(s-a), T-NR, phase-rotated transfer operator, theta^w: the inequality is
  not about any of these objects; not applicable, and no step of this lane fails for them.
- Consequently the lane cannot raise R3. R3 of the 7/8 architecture stays where the record has it (periodicity in
  the conductor aspect; manuscript Prop 5.1 and Lemma 5.8 for THIN).
- Lemmas 1 to 3 are identities and inequalities between exponents; they hold for every control by construction.
- The sharpness statements (Xu-Sang lower bound; de Faveri-Dunn-Hoffstein for n = 3, 4) use Gauss-sum vectors,
  not the target.

## 5. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | Exponent bookkeeping; the input is coefficient-blind. |
| R2 (height-uniform, every window) | false | No conclusion about zeros is drawn. |
| R3 (every control fails at a named step) | false | Every control passes the new input (section 4). |
| R4 (reaches the critical line) | false | No answer; the figure 0.8748866470 is unchanged and the model floors (13/15, 5/6) are untouched. |

## 6. Three weakest steps

1. **Completeness of the ledger set.** "The sextic sieve enters only the preliminary stage" rests on a text search
   of the three manuscript files for the lemma name and for the phrases "large sieve" / "sextic sieve", and on
   reading the passages found (manuscript Prop 9.2 and section 10.5; Liu I line 1068; Liu II section 6 summary).
   A use under another name, or inside a cited lemma of the September manuscript that Liu II imports as a fixed
   formula (the long-polynomial loss e(r) = (1 + 5r)/6, the prime capacity 6 kappa), would not have been seen.
   The scalar reruns are float LPs on class grids (screens); the exact statements are Lemmas 1 to 3 and the
   reduced-model LP.
2. **Coverage and status of the input.** The identification of the manuscript's sextic rows with a subfamily of
   Theta_6 rests on the hypotheses of de Faveri's section 2.3 read against the row definition as quoted in the
   record, and on Xu-Sang's sentence (1.2); neither paper is refereed and no proof was checked. Sixth-power-free
   versus complete rows, ray-class conditions and twists by a fixed character were handled by a remark, not a proof.
3. **Section 3.7 for r = 6 is a model.** The threshold 0.967202 uses only the top-group step of Ji's Prop 2.2 with
   E_6 from Cor 1.5; the exclusion of the lossy alternative was shown for r = 4 with Ji's Prop 2.1 exponents and
   has no sextic counterpart. The statement "the format gives nothing below 7/8 at r = 6" is therefore relative to
   keeping that step, not a limit of density-input architectures in general. The Z24-type cap 3/4 for the quartic
   normaliser was read off by analogy and not derived.

## 7. Record updates proposed (for the repair lane; not applied here)

- Z12: "General (KD)^(2/3) sextic large sieve: 0.7653" -> "n = 6 bound of 2610.04045: 7/6 - delta = 0.6973 > 0.5903;
  never selected at any class (Lemma 1)". Z6: Q^0.8 -> Q^0.75 against Q^(1/2 - eta). Z5: the cited sieve now gives
  the cap P^(1/12).
- Z14: option (i) of the open quartic input is false relative to de Faveri-Dunn-Hoffstein (1.7); Framework A with
  the optimal sieve is trivial at every order (Lemma 3).
- `r2-zf-gm-inverse-witness` (N3): the upper bound K^(5/6) D^(1/3) is now a claimed theorem (2610.04045) with a
  claimed matching lower bound (2610.17675 v2); its prediction "no count changes" is confirmed.
- c10 item 1: window sentence corrected (3.1 (iii)).
- Xu-Sang 2610.17675 v2 Theorem 1.2: its count equals R(delta, x = 0) of the system in use; its prime second
  moment exponent (37 - 10 sqrt 6)/6 = 2.08418 was not placed in any ledger here (possible item for round 12 only
  if a ledger with a named slot for it is identified; none was found in the rows read).

## Files

`RESULT.md`, `REFEREE.md`, `ledger.py`, `ledger.log`, `ledger.json`, `ledger_dir6.py`, `ledger_dir6.log`,
`tiers_fe_copy.py` (copy), `scalar_rerun.py`, `scalar_rerun.log`, `part1_envelope.py`, `part1_envelope.log`, `recheck.py`, `recheck.log`,
`dl/2610.04045.txt`, `dl/2611.16665.txt`, `dl/2610.17675.txt` (texts of public PDFs; untrusted; read as text only).
