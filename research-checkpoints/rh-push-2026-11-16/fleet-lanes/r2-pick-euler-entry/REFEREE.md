# REFEREE: r2-pick-euler-entry

Referee pass, 2026-11-16. Adversarial. Scripts and logs of this pass are in `/tmp/ref_r2/` (not in the repo; this
file is the only file written under the slug). python-flint from `.venv-arb`, single machine, runs under 2 minutes
each.

## Verdict

holds = true. Both PROVED items (Theorem R, Lemma Ri) survive re-derivation. Every CERTIFIED number I re-ran with
independent code and a different test case was reproduced. The verdict "precise obstruction" stands, with five
corrections (section 4). None of them changes a certified sign. Adjusted strength 0.8.

No RH assumption found. No verified-height statement is presented as new; the note says no bound moves.

## 1. PROVED steps, re-derived

**Theorem R.** Correct.
- Step 1: real nodes on I, kernel (f(x)+f(y))/(x+y) PSD on a set with an accumulation point gives a Caratheodory
  interpolant (normal family argument); L has no pole on (0, inf) because xi(1/2+x) > 0 for real x. L_eta is
  meromorphic on Re z > 0, so it equals the interpolant. OK.
- Steps 2-5: F(iy) real, so Re L(iy) = 0 off zeros; Re L_eta(iy) = -g(y); g almost periodic with zero mean and a
  nonzero Bohr coefficient, so g > 0 on an open set. OK.
- Statement gap in RESULT 1.2 (not in pick-induction 3.2): the restatement drops "eta supported on n >= 2". With
  eta(1) = -c < 0 the function is L + c, the mean of g is not 0, and the conclusion is false under RH. The original
  statement has the domain {2, 3, ...}; the restatement should too.
- Confluent form via Caratheodory-Toeplitz at one node: OK (the Caratheodory function with these Taylor coefficients
  agrees with the germ of L_eta at a).

**Lemma Ri.** Correct, with one hypothesis to carry through the induction.
- R_1 = z Lb/Ln = (r z - a R)/(z R - a r): re-derived from (z^2 - a^2) Lb = r Lv - a Lu, Ln = Lu - a Lb. It is
  Richards' transformation with k = a (R_1 = (k Z(s) - s Z(k))/(k Z(k) - s Z(s))). OK.
- Kernel identity: verified by hand and by the author's sympy script. R_1(a) = (r - a R'(a))/(r + a R'(a)), so
  1 + R_1(a) = 2r/(r + a R'(a)) != 0, g(a) = 1/a, h has a simple zero at a. Inertia of P_N(R) = sign(r) times
  ((+1) + inertia of P_{N-1}(R_1)) by a Schur complement. OK.
- Gap: the induction needs R_k(a) + a R_k'(a) != 0 at every stage, otherwise r_{k+1} is not defined. I checked the
  degenerate case directly: r + a R'(a) = 0 gives det P_2(R) = 0, so positive definiteness of P_N implies the
  hypothesis at all stages below N. The direction "r_0..r_{N-1} > 0 implies positive definite" presupposes that the
  r_j exist. In the computations a ball for the denominator containing 0 would give an undecided sign, and none
  occurred. State the lemma as: "P_N(R) is positive definite iff the chain is non-degenerate through stage N-1 and
  r_0..r_{N-1} > 0".
- One-sided representation (section 2): sign conventions checked (y' = -f - beta y). The individual Phi_i are not
  decaying at -inf; only the level combinations are even. This does not affect evaluation at t > 0, and is confirmed
  numerically below.

## 2. Numeric checks rerun with different test cases

All with my own code (no import of `rchain.py`; `gates_arb.py` imported only where a comparison is the point).

| Check | Method | Test case (not in RESULT) | Outcome |
|---|---|---|---|
| Lemma Ri | LDL pivots of the jet matrix of (L(x)+L(y))/(x+y) built from Taylor coefficients, against a Richards chain by power-series division | degree-14 even polynomial with a quartet, a = 1 and 2/3 | pivot signs equal sign(r_0...r_k) at every index; chain terminates at 14 (finite rank) |
| DH order | same two methods, 12000-16000 bits | a = 1/100, 3/10, 2 | first negative r_148 (order 149), LDL agrees; negatives 148, 150 |
| DH order | same | a = 5, 7 | first negative **r_149** (order 150) |
| DH order | same | a = 20 | first negative **r_152** (order 153) |
| zeta control | same | a = 2, N = 153 | all pivots and r_j positive |
| Level pairs | Fourier inversion of N_u/D^k, N_v/D^k on the imaginary axis (midpoint rule, Arb) against `gates_arb` theta moments | DH, a = 2, t = 0.37, levels 0..5, derivatives 0..2 | ratio 1.26156626101008 in all 36 entries (the normalisation constant quoted in 1.3) |
| First failing gate | Fourier inversion only (no theta moments, no `gates_arb`), h = 1/4 and h = 1/3, agreement to 12 digits | DH, a = 2, t = 0.5, levels 140..152 | pass at 140..145; level 146 `+++++-+` (d^2H/dB^2); 147 `++-++--`; 148 `-+--+--`; 149 `---++--`; 150 `+---++-`; pass again at 151, 152 |
| Table 2.4 | direct LDL with L_eta | reproduced (2, -1e-2) -> 9, (3, -1e-4) -> 9, (101, 1e-6) -> 4; new: (5, 1e-4) -> 3, (7, -1e-3) -> 5, a = 2 (2, -1e-2) -> 6, a = 0.3 (6, 1e-5) -> 3; eps = 0 passes to 40 |

The Fourier-inversion run is not interval-rigorous for the truncation in y and h; it is a second method, at a new
anchor and a new t, giving the same sign pattern as the certified tables, including the recovery at level 151.

I re-read all 18 `g_*.json` with `summ.py`: the tables of section 3 and the sweep tables of section 4 match the raw
files entry by entry; no undecided sign.

## 3. Controls

- DH: the note contains no argument for RH, so nothing has to fail for DH. The DH numbers are confirmed (section 2).
- Verified height / RH: not assumed. "xi passes levels 0..152" is labelled pointwise evidence.
- Euler product: the claim "failing level follows the zero configuration" is supported by chi_-4 + quartet (157),
  DH (149) and T-NR (4). It is MEASURED across families, PROVED only in the form of Lemma Ri (the r_j are functions
  of the jet of L at a).

## 4. Errors and overstatements

1. **Verdict item 3 and the closing paragraph overstate.** "The gates therefore carry no information beyond the sign
   pattern of the r_j" and "the gates up to level N are restatements of the sign of the first N + 3 Richards
   parameters" do not follow. Only one direction is a theorem (r_j < 0 forces a class failure at level <= j - 2, via
   the PR chain, which I did not re-derive). The converse is false in the note's own tables: chi_-4 has r_0..r_229 > 0
   and fails J_0' > 0; DH fails level 0 with r_0..r_147 > 0; T-NR at a = 3 fails level 0 with j* = 4. Outside level 0
   the converse is grid evidence at confluent anchors on five families. The note's own section 8 item 3 says this;
   the verdict should carry the label MEASURED.
2. **N*(DH) is anchor-dependent.** 149 holds at a in {1/100, 1/10, 3/10, 1, 2, 3}; it is 150 at a = 5 and 7 and 153
   at a = 20. "N* is the same at a = 1/10, 1, 3" is true and should not be read as an invariant; "DH fails at order
   149" needs "for a <= 3 (tested)". The gate level 146 is likewise tested only for a <= 3.
3. **4n+3 convention.** ff-transplant defines n as the index of the moved zero. RESULT uses that for the "move"
   family (4m+3) and "number of zeros below" for the "add" family and DH. With one convention (index = zeros below
   + 1) the add row reads 11, 19, 31, 47, 59, 99 against 13, 21, 34, 44, 65, 101, and DH reads 179 against 149. The
   conclusion (law fails for DH) is unchanged; "overestimates by 26" becomes 30 and "underestimates by 1 to 10"
   becomes "within -3..+6".
4. **Section 5 table.** (a) "zeta with Lambda(n_0) + eps: unit local roots yes for small eps" is wrong for eps > 0
   at a prime n_0 (Lambda(p) + eps > log p); it holds only for the eps < 0 columns. (b) "No two of them suffice" is
   shown for {FE, prime-power support} (T-NR) and {support, bound} (perturbation, eps < 0). The pair {FE, bound}
   without prime-power support is not tested: DH is entered as "first only". (c) The "move" twins replace a zero pair
   by a quartet (two zeros become four); "moved" should say so.
5. **Diagnostics.** The `lg` and `rel` fields of the JSON overflow in float64 below 1e-308 (values 301032242 from
   level ~88 on in the DH tables), so `summ.py`'s "worst rel radius" line is meaningless for deep levels. The signs
   come from Arb comparisons and are unaffected; the printed u, v balls show relative radius about 1e-8.

## 5. Is the obstruction real?

Yes, in the following form. Lemma Ri holds anchor by anchor, so for any choice of real anchors the inertia of the
real-Pick form is a function of the jet of L, hence of the zero set. Moving anchors shifts the horizon (149 to 153
between a = 3 and a = 20) and cannot make it see anything else.

The sharper obstruction for the induction lane is not DH. DH and chi_-4 fail the class at level 0, so an induction
"full at levels <= k implies full at k + 1" started from P(0) is vacuous for DH and the DH control gives no
constraint on the inductive step. The constraint comes from the planted-quartet twins on zeta: they pass level 0 and
all levels to j* - 3 and fail there, with j* growing with the height of the quartet. An inductive step valid for xi
must fail for Q(4D^2) kappa at a level that depends on the quartet. RESULT has the data for this (sections 3 and 4)
and states it only for DH in section 7.

One way around that the note does not close: the statement is for confluent anchors and a grid in t. A proof of
P(k) need not be level-local. A property of kappa that is uniform in k (a single generating object over all levels,
for example a total-positivity statement for the two-variable kernel of the whole chain) is not excluded by a
table of per-level signs; the quartet twins show such a property has to be destroyed by Q(4D^2) for every quartet,
which makes it equivalent in strength to the zero statement. I see no route that stays inside finite levels.

## 6. Surviving claim

Theorem R and Lemma Ri (with the non-degeneracy clause) are correct. For DH at confluent anchors a <= 3 the
real-Pick form is positive definite to order 148 and indefinite at 149; at a = 5, 7 the order is 150, at a = 20
it is 153. At the tested anchors and sample points DH passes the seven signs at levels 1..145 and fails
d^2H/dB^2 at level 146 (independently reproduced at a = 2, t = 0.5). The identification "gates = Richards sign
pattern plus a lead of 2-3 levels" is MEASURED, false at level 0, and not a theorem. No bound moves.
