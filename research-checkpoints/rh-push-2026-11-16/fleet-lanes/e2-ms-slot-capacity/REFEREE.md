# REFEREE: e2-ms-slot-capacity

Adversarial referee, 2026-11-18. Read: BRIEF, RESULT.md, `slot.py`, `slot_bins.py` log, `lp_relaxed.py` + log,
`analysis.txt` (cubic and window rows), manuscript `~/lean-deps/qrh-verify/paper.txt` l.5855-6105 (Lemma 14.3),
l.6925-7030 (Lemmas 17.1, 17.2), l.7355-7480 (terminal step), l.8650-8700 and l.9135-9140 (initialization).
Runs: local, through `scripts/memcap.sh 8`, in a scratch directory; no ssh. Only this file was written; the algebra check below was a scratch script (grid over (r, z), not kept).

**Outcome: the verdict "precise obstruction" stands. The PROVED and PROVED-rel steps are confirmed, with one
regime restriction that the RESULT does not state (E1) and one incomplete statement (E2). Three smaller errors
(E3-E5). No RH assumption, no restatement of verified height, no zero statement.**

## 1. Re-derivation of the PROVED / PROVED-rel steps

**S3 substitution (confirmed).** Manuscript l.8678: z_0 = z - G, D' = r + z - 2G; (17.69): M = 2D' - m - 2P_1;
F = D'. Then F - M - z_0 = m - r - 2z + 3G and 4F - 3M - 6z_0 = 3m - 2r - 8z + 10G. With G = 0 these are the two
conditions of Lemma 17.1; overlaps only help. The manuscript states the same at l.9138-9140. Confirmed.

**Location of 2z (confirmed in a stated regime only).** Principal configuration, from (14.11), (14.13), (14.14)
as printed: T_d = 2M + 2z_a - F, E_ref = max(H, v) + z_a - u - (T_d - v)/2 on retained dyads v <= T_d, H = M.
* Row branch v <= M: the three cases of u give E_ref = F/2 - v/2, F/2 + v/6 - z_a/3, M - (T_d - v)/2. All are
  <= F when M <= F. Confirmed: the row branch does not need z_0 here. (The term (H + F)/3 in the RESULT's maximum
  is not needed; harmless.)
* Column branch, u = z_a: E_ref = (3v - T_d)/2, maximal at v = T_d, value T_d. T_d <= F iff M + z_a <= F iff
  r + 2z <= m. Confirmed.
* Triangle-inequality reading of r3-critical-count 5.1: the manuscript text (l.5896-5903) applies that step to
  inactive slots with mass sum q_p^{-1} << Z^eps. The correction is confirmed.
* The 2 z_a in T_d comes from c = c_F F_act R P and Y in (14.15) (product of Z^{2 z_i} over active slots).
  Confirmed as read.

**E1 (regime restriction, not stated).** The dyad v = T_d lies in the column branch with u = z_a only if
T_d >= max(M, 2 z_a), i.e. r + 3z >= m and r + z >= 2m/3. Outside that:
* r + 3z < m: no column dyad is retained; the binding requirement is M <= F (r + z <= m). The first condition
  is then automatic, so nothing is lost.
* m/2 <= r + z < 2m/3: T_d < 2 z_a, the u = z_a branch is empty, and the maximum of E_ref is
  (2/3)(T_d + z_a) > T_d at v = T_d in the branch u = (v + z_a)/3. The requirement there is 4M + 6z_a <= 5F,
  i.e. 3r + 9z <= 4m, which is STRICTER than r + 2z <= m in part of that region. Example m = 1, r = 0.1,
  z = 0.45: r + 2z = 1 (first condition holds with equality), T_d = F = 0.55, E_ref = 0.667 > F.
  Grid check (scratch script, 101 x 101 points, m = 1, v on 4001 points in [0, T_d]): "E_ref <= F" and "r + 2z <= m" disagree at 81
  points, all with r + z <= 0.66, all with 3r + 9z > 4, none satisfying the manuscript's second condition
  2r + 8z <= 3m. So the manuscript is consistent (its second condition covers this region), but the RESULT's
  sentence "the first one is the single requirement T_d <= F" is true only for r + z >= 2m/3. The application
  range (r >= 1/2 with z in the window) and the four tabulated window pairs are inside the valid regime; the
  r = 0 cases of section 2 with 1/2 < z < 2/3 are not.

**E2 ("exact missing inequality" is incomplete).** The RESULT says the dyads violating E_ref <= F are those of
the column branch with F < v <= T_d. In the window 1 - 2z < r < 1 - z this fails at 160 of the grid points, all
with r + z < 2/3 (e.g. r = 0, z = 0.51: a dyad with v <= F exceeds F by 0.15, branch u != z_a). For
r + z >= 2m/3 the statement is correct (checked on the grid, and by 4r + 5z >= 3m there). The displayed target
N << Z^{v + F + eps} therefore is the full missing inequality only for r + z >= 2m/3; for smaller r + z a
second inequality on the mixed cubic-sieve branch of Lemma 14.2 is also needed. This does not touch the
application range.

**Sixth-power rows (confirmed).** r = 0, a(p) = conj nu(p), u = v^6 coprime to the slot: chi_p(u) = 1,
|Q_u|^2 = Z^{-z} (#P)^2 >> Z^{z - eps}; >> Z^{m/6} such u; total >> Z^{z + m/6 - eps} > Z^{m + eps} iff
z > 5m/6. Correct and elementary (also for rows w_0 v^6 with one fixed w_0). It is a remark, not a new theorem:
the manuscript already restricts to sixth-power-free rows where it lengthens columns (Lemma 17.6). It says
nothing for 1/2 < z <= 5m/6 and nothing for r > 0, as the RESULT states.

## 2. Numeric rerun with a different case

`slot.py` copied to a scratch directory; U = 48000 and 6000 (not in the original set), z = 0.8 and window pairs
(0.35, 0.5), (0.45, 0.42) (not in the original set), seed 7, squarefree rows.

| case | U = 6000 | U = 48000 | RESULT's reading |
|---|---|---|---|
| cubic, r = 0, z = 0.8, Gauss vector I/tr | 1.750 | 1.958; sup 1.975 <= 1.993; overlap with g2 0.991 | growth, maximiser = Gauss vector: reproduced |
| sextic, r = 0, z = 0.8, best Gauss I/tr | 1.163 | 1.141; sup 1.399 vs (1+sqrt(n/R))^2 = 1.424 | 7-19%, flat, sup at independent-vector level: reproduced |
| quadratic, z = 0.8 | - | 1.008 | flat: reproduced |
| cubic, z = 0.4 (below 1/2) | - | 1.006 | no excess below z = 1/2: consistent with the law |
| window (0.35, 0.5): sup/tr mu / random / one | - | 1.091 / 1.092 / 1.049 | arithmetic = random control: reproduced |
| window (0.45, 0.42): sup/tr mu / random; I(1)/tr mu / random | - | 1.386 / 1.375; 1.370 / 0.975 | same; the constant a = 1 correlation with mu is reproduced |

Scaling law checked against the stored bins (U = 128000): the ratio of N(u)^{1/3}-normalised excess between
z = 0.9 and z = 0.75 is about 68/25.5 = 2.67; X^{2/3}/log X predicts 2.70. The N(u)^{-1/3} law holds across the
bins with >= 21 rows. Confirmed.

## 3. Smaller errors

**E3.** "the first number is 0.8 X^{2/3}/log X": with X = 128000^0.9 = 39490, X^{2/3}/log X = 109.6, so
66-79 is 0.60-0.72 of it (z = 0.75: 24-31 against 40.6, 0.59-0.76). The constant is about 0.65, not 0.8.

**E4.** "Reaching 100 primes in a slot of length 0.2 needs U about 10^17": the slot count is
2 (pi_{1 mod 3}(X) - pi_{1 mod 3}(X/4)), about pi(X) - pi(X/4); 100 is reached near X = 850, U = X^5 about
5e14. The conclusion (out of reach) is unchanged.

**E5 (overreach in section 5).** "Section 2.2 shows that a statement with that invariance cannot have capacity
above m/2 at r = 0 for cubic rows. A relaxed slot therefore has to give up the invariance." The cubic statement
is MEASURED plus a recalled classical mechanism, not shown. Lemma 17.1 has sextic rows; for sextic squarefree
rows the RESULT's own finding is "undecided", and for r >= 1/2 section 2.3 finds no extremal configuration.
So "therefore has to give up the invariance" is not established for the lemma in question. It should be labelled
ARGUED/OPEN. The following sentences on where an (M1+) would use the Euler product and fail for the
sign-twisted control are conjectural design remarks, not results.

## 4. Controls, RH, novelty

* No zero-statement and no zeta-only mechanism is claimed, so the nine campaign controls are not engaged. The
  internal controls (random columns, random phases, no inverse factor, quadratic rows, cubic positive control)
  were rerun at a new size and behave as reported.
* Nothing assumes RH; the GRH remark in section 5 is labelled as such. No verified-height input.
* Not new and correctly labelled: failure of the mean-value level for cubic Gauss-sum vectors (Heath-Brown /
  Patterson / Dunn-Radziwill mechanism; recalled, not re-read; the prime-restricted asymptotic is Patterson's
  conjecture shape, so "predicted law" is a heuristic prediction matched by data, not a theorem). The
  sixth-power remark is elementary.
* Section 4 numbers match `lp_relaxed.log` (0.8732877 / 0.8727926-0.8729913 / 0.8703360). They are MODEL values
  that inherit the r3 float model; not re-solved here. The row "first relaxed, second kept" is conservative in
  the principal configuration (by E1 the second condition is needed there only for r + z < 2m/3).

## 5. What survives

1. PROVED-rel: both conditions of Lemma 17.1 are the hypotheses (17.2) of Lemma 17.2 under
   (M, F_0, z_0) = (2(r+z) - m, r + z, z).
2. PROVED-rel, principal configuration, **for r + z >= 2m/3 and r + 3z >= m**: the first condition is exactly
   T_d <= F at the dyad v = T_d of the column branch with all marks active, T_d = 2M + 2z_a - F; the 2 z_a is the
   mark primes in the reflection conductor; it is not the inactive-slot triangle inequality. For
   m/2 <= r + z < 2m/3 the binding principal-configuration requirement is 3r + 9z <= 4m (mixed branch), not
   T_d <= F. Non-principal configurations and the two-Poisson recursion are untraced (as the RESULT says).
3. PROVED (elementary): with all rows, r + z < m fails at r = 0 for z > 5m/6.
4. MEASURED and reproduced: cubic rows, r = 0, z > 1/2: Gauss vector on primes exceeds the mean-value level with
   law about 0.65 X^{2/3} N(u)^{-1/3}/log X; sextic rows 7-19%, flat, undecided; window flat for arithmetic and
   random coefficients alike, low power (2-84 primes).
5. MODEL: 0.87329 / 0.87279-0.87299, above 13/15, conditional on unproved (M1+) and unrefereed manuscripts.

Weakest remaining points: (a) the location statement is one configuration of one terminal step; (b) the window
test cannot discriminate at the critical pair; (c) section 5's claim that a relaxed slot must use the
coefficients nu-bar(p) is not established for sextic rows.
