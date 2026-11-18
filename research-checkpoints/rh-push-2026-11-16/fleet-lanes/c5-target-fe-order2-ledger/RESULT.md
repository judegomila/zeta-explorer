# c5-target-fe-order2-ledger: does a reflection in the target variable relax h <= 1 in the 7/8 estimate system

Internal working note, 2026-11-18. Slug `c5-target-fe-order2-ledger`. Kind: deepen. Not refereed. Nothing committed,
pushed or posted. Files: `tiers_fe.py` + `tiers_fe.log`, `tiers_fe2.py` + `tiers_fe2.log` (exact LP over the
integers by vertex enumeration, python stdlib, run locally through `scripts/memcap.sh 8`; about 4 min + 3 min).
The compute server was not used.

Every abscissa below is the value of a hypothetical ESTIMATE SYSTEM, relative to the unrefereed sources (openai/math
manuscript `~/lean-deps/qrh-verify/paper.txt`; Liu II arXiv:2610.26835v2, text in `../bypass-78/dl/`). None is a
zero-free region. No statement about any zero is made. 7/8 (unrefereed) stands; RH open. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel X / EXACT (rational LP; "CONFIRMED" = feasible at the value,
infeasible at value - 1e-9) / LP (bisection to 2^-36, not guess-confirmed) / MODEL / ARGUED / RECALLED / OPEN.

## Verdict

**Precise obstruction: the proved row "target reflection leaves h <= 1".** No vertex with h > 1 or abscissa below
5/6 exists in the reflection ledger built from supplied bounds. Three statements:

1. **Lemma U (PROVED).** In the format of Proposition 2.1 the signal constant c of C(s) = s + c is determined by the
   probe J: two high comparisons for the same J with constants c1 != c2 contradict the definition of beta*. A
   reflection (row functional equation, Voronoi, approximate functional equation, in any variable) re-expresses the
   same number J. So no reflection changes h; it can only change the exponent that is proved for the low side.
2. **Ledger (EXACT + three scalar proofs).** With the reflection choice (reflected row / unreflected row / empty
   dual range) and the height variable w = 4 tau, tau = log t / log Z, added to the system of `r3-method-limit`:
   source geometry gives infimum 13/15 at w = 0 for every choice, and B(w) >= 13/15 + w/15 on the reflected branch,
   B >= 1 on the unreflected branch, B >= 11/12 on the empty branch. Height loses; there is no tau-dependent gain,
   hence no region either. Theorem 1 of `r3-method-limit` (B >= 5/6 under lx >= l) is untouched by w and by the
   branch.
3. **Where h > 1 vertices do appear (LP, MODEL).** Only with lx < l and one of two inputs that no reflection
   supplies: an optimal K + D sextic large sieve for the unreflected rows in 1 + l <= M < 2 + 2l, or the K- and
   P-losses deleted. Both runs fall below 1/2 (0.25 at the search bound), so the reduced system is inconsistent
   there (zeros on the critical line exist): at least one of the inputs is false. No vertex meets the R4-partial
   criterion.

The step where M + l <= 1 arises is the reflected row itself: the constraint is produced by the functional equation
that the question proposed to add. The target's own s <-> 1-s cannot be applied to the signal, because the target
enters only as a reciprocal (section 3, Lemma V).

---

## 0. Plan; relation to closed rows

Read: BRIEF (to the end), OBSTRUCTION_MAP rows Z11, Z14, Z15, Z16, Z21, section 6 items 1 and 13, controls;
`r3-method-limit` RESULT + REFEREE + `tiers.py`; `ap-order-two`; `c4-thin-twist-control-78` (verdict);
ROUND_LOG lessons of round 4; manuscript sections 2, 5.1-5.3, 6.1-6.2, 11.1, 12, 14.3, 15.1-15.2; Liu II sections
2.4 and 15.1.

Different from closed rows: Z15 states the floor for a system "that never reflects the target" (planner's reading).
Here (a) the reflection that exists is located and shown to be already inside the system (it is the source of
M + l <= 1); (b) a general lemma shows no re-expression can move the signal constant; (c) the system is extended by
the height variable and by the choice of side, and solved exactly. `ap-order-two` found that at order 2 Poisson
maps the probe to itself. Lemma U is the general form of that: two representations always share c; at order 2 they
also share the low estimate.

## 1. First lemma: where M + l <= 1 arises

Objects (manuscript section 6.1, (6.2)): I = Q^{-1/2} Sum_m A_m B_m, Q = XY = Z^M. The row B_m(Z) is the completed
sum over A = c n^3 of length Z (marked: Z P = Z^{1+l}) of gamma_2(c) alpha(A) psi(A) q_A^{-1/2}, psi = nu_sigma theta
chi_.(m), and nu_sigma contains the target character eta. So **the target variable is A**, and the target enters the
low side only through psi.

Reflection of the A-variable = Proposition 5.1 (completed cubic reflection; paper.txt lines 1390-1500): Voronoi
summation for cubic theta coefficients twisted by psi. Displayed data: gamma ratio
R(t) = Prod_{+-} Gamma(1 + t +- 1/6) / Gamma(1 - t +- 1/6), dual argument q_mu X / q_c^2 with c = c_F r, r the
product of active primes (row primes and marks). So the dual length is conductor^2 / length: in exponents

  T_d = 2H + 2A_0 + 2 z_a - N_* - N_0 - 3B_0   (Lemma 14.3, (14.11); lines 5862-5890),

which at full row H = M, full marks z_a = l, N_* = 1 + l is **T = 2M + l - 1**. The dual row carries
chi_R(nb)^3, a quadratic symbol (Lemma 5.7, (5.32)): the reflected rows are order-2 twists of the theta coefficients
(local rule j -> -j - 2 mod 6, so 1 <-> 3). This is the "order 2" of the slug; it is a property of the dual
representation of the same row.

The mean square uses the quadratic large sieve on the dual: exponent max(H, v + l_b) with v + 3 l_b <= T_d
((14.14); Lemma 5.8, (5.36): Z^{O/2 + max{M - O, 2M - O - N}}). The loss relative to Z^M is

  k = max(0, l - T/4, T - M, (3l - 1)/2) = max(0, (1 + 3l - 2M)/4, M + l - 1, (3l - 1)/2)

(Liu II Lemma 2.4, lines 629-633; the J-branch l - T/4 is the manuscript's line "shyb + l_b + ... >= T_d/4" in the
proof of Lemma 15.1; the K-branch is T - M: the dual is longer than the row set). In the manuscript's geometry
M' + l' - 1 = -3d (proof of Lemma 15.1), i.e. M + l = 1 at d = 0, and T_d <= H - 3d: the K-branch is exactly zero.
**M + l <= 1 is the condition "reflected length <= number of rows".** [PROVED-rel manuscript, by reading the displayed
formulas; proofs of Lemma 14.3 / Liu II Lemma 2.4 not replayed.]

Height. The manuscript fixes the target and its zero before Z -> infinity (Proposition 2.1; Lemma 11.1 takes
T_1 = Z^tau with tau -> 0+ after the target). So tau = 0 throughout the source, the analytic conductor of the target
is O_eta(1), and the dual of the untwisted target of length conductor * t / N is empty. A hybrid version (target
eta N^{it}, t = Z^tau) changes the reflection through R(sigma + it) ~ |t|^{4 sigma}: the dual argument extends to
t^4 q_c^2 / X. [ARGUED from the displayed R(t).] So

  T(w) = 2M + l - 1 + w,   w = 4 tau.

## 2. Lemma U: the signal constant is an invariant of the probe

**Lemma U [PROVED; same analytic conditions as Proposition 2.1].** Let sigma_0 < beta*. For i = 1, 2 let c_i be real,
sigma_i > 0 (both independent of the target), and for every primitive target eta let H_{i,eta} be holomorphic on
Re s > sigma_0 with |H_i - 1| <= 1/2 and f_{i,eta}(Z) = (1/2 pi i) Int_{(2)} Z^{s + c_i} e^{(s - 5/6)^2}
H_i(s) / L^{S_i}(s, eta) ds. Suppose one function J_eta satisfies |J_eta - f_{i,eta}| << Z^{c_i + beta* - sigma_i}
for both i. Then c_1 = c_2.

Proof. Suppose c_1 = c_2 + d, d > 0. g = f_1 - f_2 satisfies g << Z^E, E = max_i (c_i + beta* - sigma_i), and decays
faster than every power as Z -> 0 (proof of Proposition 2.1). With A_i(s) = e^{(s-5/6)^2} H_i(s) / L^{S_i}(s, eta)
the Mellin transform Int g Z^{-s-c_1} dZ/Z equals A_1(s) - A_2(s + d) for Re s large (Fourier inversion, as in
Proposition 2.1) and is holomorphic on Re s > E - c_1 = beta* - min(sigma_1, sigma_2 + d). A_2(s + d) is holomorphic
on Re s > max(sigma_0, beta_eta) - d, where beta_eta is the supremum of real parts of zeros of L(s, eta). So A_1 is
holomorphic on Re s > max(beta* - min(sigma_1, sigma_2 + d), max(sigma_0, beta_eta) - d). Since H_1 != 0 on
Re s > sigma_0, every zero of L(s, eta) there is a pole of A_1. Hence beta_eta <= max(sigma_0, beta* - min(sigma_1,
sigma_2 + d)) =: b_0 < beta* for every eta, contradicting beta* = sup_eta beta_eta. QED

Consequences.
(a) For a fixed probe, B = (true exponent of J) - c with both terms determined by J. A reflection changes neither;
    it changes only which upper bound for the exponent of J is proved.
(b) The frequency length of a Poisson step applied to the reflected row, hhat = (y + T + l) - (x + y)
    = lx + 2 ly + l - 1 + w, is not a signal exponent. It exceeds 1 for large w, and the bookkeeping that would use it
    returns no floor (`tiers_fe.log` N1: 0.25 = search bound at every w): excluded by Lemma U. The step that fails
    in the derivation: the reflected row carries the root number rho(R) (Lemma 5.7), a normalised cubic Gauss sum in
    the row variable, so the reflected summand is not periodic in m and the Poisson step of section 7.1 does not
    apply; whatever replaces it must return the same c.
(c) Scope: the lemma covers signals of the form Z^{s+c} with bounded H. Not covered: section 8, weakest step 2.

**Lemma V [PROVED as an identity; the continuation it needs is not available].** The target's own functional
equation can enter the signal only through 1/L(s, eta) on Re s = 2. Writing 1/L(s, eta) =
(epsilon X(s))^{-1} Sum mu(a) conj(eta)(a) q_a^{s-1} requires Re s < 0; moving the contour there needs H_eta
continued to the left of 1/2 (the manuscript supplies holomorphy on Re s > 7/8 only, Lemma 7.1) and passes every
zero: f = Sum_rho Res_rho + reflected integral. The "dual sum of the target row" is the sum over zeros of
Z^{C(rho)} e^{(rho-5/6)^2} H(rho) / L'(rho), i.e. the unknown. As a numerator the target occurs only in rows u with
a trivial power of chi_u (squares, cubes); there its approximate functional equation is a bound that the ideal
system's Lindelof input already dominates (Liu II section 14.2 uses the approximate functional equation of the
row numerators).

## 3. The reflected system

Variables (lx, ly, l, w) >= 0; M = lx + ly, b = ly - lx, h = 1 - lx + l (Lemma U: unchanged), T = 2M + l - 1 + w.

Low side, B >= 1 - h/6 + G + k/2 with G = max(0, b/12, b - ly/2) and one of three row bounds (the estimate may
choose; the LP takes the union):

| branch | row energy loss k | status |
|---|---|---|
| refl | max(0, l - T/4, T - M, (3l - 1)/2) | Liu II Lemma 2.4 with T_d -> T_d + w in the two branches that contain T_d. MODEL for w > 0; equals the source at w = 0 |
| dir | max(0, 1 + l - M, (2 + 2l - M)/3) | unreflected rows: manuscript Lemma 9.1 (sextic large sieve K + D + (KD)^{2/3}), rows Z^M, columns Z^{1+l}; independent of w. MODEL (Lemma 9.1 is stated for squarefree columns) |
| dir0 | max(0, 1 + l - M) | hypothetical optimal sieve K + D |
| empty | none (no low constraint), requires T <= 0 | dual range empty: the row is negligible apart from polar rows. MODEL, optimistic |

High side: the ideal one of `r3-method-limit` (density-hypothesis counts, Lindelof numerators), taken independent
of w (optimistic; the manuscript pays (1 + T_1)^{A_eta}). Geometry: source (lx, ly >= l), Q (M >= 2l), free, and
"anti" (lx <= l, i.e. h >= 1, with the uncompensated high side of `tiers.py`, comp = False).

Regression (w = 0, refl): 13/15, 31/36, 23/27, 5/6, and free-geometry F5 = 13/15, all CONFIRMED against
`../r3-method-limit/tiers.log` (`tiers_fe.log` A1-A5).

## 4. Decisive test: results

Source geometry (`tiers_fe.log` B, C, E):

| run | infimum | point (lx, ly, l, w) | h |
|---|---|---|---|
| refl, w free | 13/15 CONFIRMED | (2/5, 2/5, 1/5, 0) | 4/5 |
| refl or dir or empty, w free | 13/15 CONFIRMED | same | 4/5 |
| dir only | 1 (LP; box 4 and 8) | corner, h = 0 | 0 |
| dir0 only | 5/6 (LP) | (1, 1, 1, 0) | 1 |
| empty only | 11/12 (LP; CONFIRMED in free geometry) | (1/2, 0, 0, 0) | 1/2 |
| k = 0 or empty, G = 0 | 5/6 CONFIRMED | (1/2, 1/2, 1/2, 0) | 1 |
| refl, K removed, w free | 23/27 (LP) | (4/9, 4/9, 1/3, 2/9) | 8/9 |
| r = 3, 4 (transplant): ledger; k = 0 | 11/15, 4/5 (LP); 2/3, 3/4 CONFIRMED | (2/5, 2/5, 1/5, 0); (1/2, 1/2, 1/2, 0) | 4/5; 1 |

tau-dependence of the full ledger (refl or dir or empty): B = 0.86667, 0.87, 0.87333, 0.88, 0.9, 1, 1, 1 at
w = 0, 1/20, 1/10, 1/5, 2/5, 1, 2, 4. Increasing; equal to 13/15 + w/15 for w <= 1/5.

Three scalar statements behind these numbers [PROVED, relative to the formulas of section 3]:

* **(R)** Reflected branch: B >= 13/15 + w/15 for every geometry. The identity of `r3-method-limit` Theorem 2(i),
  (4/15) L0 + (2/5) L0' + (2/15) L_K + (1/5) H0 = 13/15, has L_K(w) = L_K + w/2 and no other w-dependence.
  It does not use the J- or P-branch, so it does not depend on how those are modelled in w.
* **(D)** Unreflected branch with Lemma 9.1 and the polar term G >= b/12: B >= 1 for every geometry.
  B_low >= 5/6 + M/12 - l/6 + k/2. If M >= 2 + 2l: >= 5/6 + (2 + 2l)/12 - l/6 = 1. If (1 + l)/2 <= M < 2 + 2l:
  k = (2 + 2l - M)/3 and B_low >= 7/6 + l/6 - M/12 > 1. If M < (1 + l)/2: k = 1 + l - M and
  B_low >= 4/3 + l/3 - 5M/12 > 1. (`tiers_fe2.log` X1, X2: exact 1 CONFIRMED; X3 with G = 0: 1 by LP.)
* **(E)** Empty branch: T <= 0 gives M <= (1 - l - w)/2, and the floor-class bound
  H0 = 4/3 - ly/2 - 5lx/6 + l/3 >= 4/3 - 5M/6 >= 11/12. The Part I value: with no dual there is no reflected energy
  to compare.

So in source geometry the infimum over (lx, ly, l, w, branch) is 13/15 at w = 0 on the reflected branch, and with
every loss idealised away it is 5/6 at h = 1: Theorem 1 of `r3-method-limit` uses only (S), the square-root level
and lx >= l, none of which contains w or the branch. **Target reflection leaves h <= 1.**

Geometry without lx >= l (`tiers_fe.log` D, `tiers_fe2.log` X, Y):

| run | infimum | h at the point |
|---|---|---|
| Q or free, refl or dir or empty, G src or polar, w free | 13/15 (CONFIRMED for polar, free) | 4/5 |
| free, refl, G = 0, w free | 13/15 (LP) | 4/5 |
| free, empty only | 11/12 CONFIRMED | 1/2 |
| lx <= l, no compensation, refl or dir or empty | 1 (LP) | 1 |
| lx <= l, no compensation, refl with K removed | 0.91026 (LP) | 1 |
| free, refl or dir0 or empty, G polar, box 8 | 0.25 = search bound | 4.5 |
| lx <= l, no compensation, dir0, G polar | 0.4653 (box 8), 0.25 (box 16) | 3.2, 4.5 |
| lx <= l, no compensation, refl with K and P removed | 0.4653 (box 8), w = 1.83 | 3.2 |

The last three rows are the only vertices with h > 1 or abscissa below 5/6. Their inputs: an optimal sextic large
sieve for unreflected rows in 1 + l <= M < 2 + 2l (for M >= 2 + 2l the row sum is complete and the bound is
orthogonality; the open range is the one where the (KD)^{2/3} term lives), or the K- and P-losses deleted, the
J-loss then removed by w. They return values below 1/2, which no valid system can (referee item E3 of
`r3-method-limit`): at least one of {the input, the ideal high side at h > 1, the signal formula at lx < l} is false.
RECALLED, not re-read: Dunn-Radziwill show the cubic large sieve with its (KD)^{2/3} term is sharp as an operator
bound, which would make dir0 the false input for general coefficients. Neither input is produced by a reflection,
and neither is "a stated lemma not equivalent to the conclusion" with a consistent vertex. Score criterion not met.

## 5. Checks against rows

* **Z15.** Unchanged and sharpened in one respect: the hypothesis "the system never reflects the target" is not
  needed. The row may add: "h is an invariant of the probe (Lemma U); the reflection in the target variable is
  Proposition 5.1 and is the source of M + l <= 1; height adds +w/15."
* **Z11.** A hybrid second moment at level never beats the row-only one; here the height variable enters the row
  energy only through the dual length and only raises the K-branch. Same direction.
* **Z16.** Bootstrap f(theta) = theta; nothing here feeds a half-plane back in. No interaction.
* **ap-order-two.** There Poisson maps the order-2 probe to itself and both representations coincide. Here the
  reflected rows are order-2 twists (j = 3) of the theta coefficients; a probe built from j = 3 rows without the
  root number is a different number, of the mixed type closed by Z14 / Z21 (not re-run).
* Round-4 lesson 3 holds as stated, with one precision: the target's periodicity is used in the conductor aspect
  inside Proposition 5.1 (the function phi is L-periodic), and that use is the reflection of the target variable.
  What is never used, and cannot be (Lemma V), is s <-> 1-s for 1/L(s, eta).

## 6. Controls

No statement about zeros is made, so no control has to fail for a conclusion. The assignment asks how each control
sits in the ledger.

* **THIN, sign twists (no functional equation).** Proposition 5.1 is unavailable (`c4-thin-twist-control-78`:
  the weight is not periodic). Only the dir branch remains: abscissa 1 in every geometry (statement (D); B3, X1-X3).
  They lose not a hypothetical gain but the whole low estimate; consistent with a zero at any b < 1. Lemma U holds
  for them (it uses Proposition 2.1 only, which holds with beta* replaced by b). The dir0 value 5/6 would be false
  for THIN with b > 5/6, so for THIN either the optimal sieve or the ideal high side fails; the ideal high side
  does (its twists have no continuation). [MODEL]
* **DH.** The weight is a finite linear combination of ray characters, which is the form the manuscript itself
  uses (G(A) = Sum a_theta theta(A)); Proposition 5.1 and the whole low side hold by linearity. DH fails at the
  scalar Euler identity for row u = 1 (Lemma 7.1; the Moebius coefficients of the reciprocal): the signal is
  Sum a_theta f_{eta theta}, and Proposition 2.1 continues each 1/L(s, eta theta), which says nothing about zeros of
  the combination. Reflection is present and gives DH nothing either: the step with the Euler product is on the
  high side, the reflection on the low side. [ARGUED from the manuscript's displayed structure]
* **E_a = zeta(s+a) zeta(s-a).** Has the reflection and an Euler product; the local parameters p^{+-a} are not
  unimodular. The hypothesis abs(eta(p)) = 1 fails (as in row Z18), every exponent of the ledger shifts by a, and
  the floor reads 5/6 + a against true zeros at real part 1/2 + a on RH. Reflection changes nothing relative to
  zeta. [ARGUED]
* Backward heat, unimodular twist, T-NR, Beurling, phase-rotated transfer operator, theta^w: not applicable (no
  positivity or zero statement; Lemma U is a statement about any Dirichlet series admitted by Proposition 2.1).

## 7. Requirement flags (for this lane's result, not for the 7/8 mechanism)

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | Lemma U and the ledger use no Euler product; they hold for any target admitted by Proposition 2.1 |
| R2 height-uniform, every window | false | no conclusion about zeros; the height variable only raises the abscissa (B(w) >= 13/15 + w/15) |
| R3 controls fail structurally | false | nothing to fail; section 6 records where each control sits |
| R4 reaches the critical line | false | h <= 1 stands under lx >= l; vertices with h > 1 exist only in an inconsistent reduced system |

## 8. Three weakest steps

1. **The w-extension is a model.** T_d -> T_d + 4 tau is read from the displayed gamma ratio R(t), not derived
   through Lemma 14.3 with a height twist; the P-branch and the high side are taken independent of w; that the
   hybrid probe keeps C(s) (poles at w = 1 and z = 1/6 under the twist) is ARGUED. Statement (R) is robust to the
   J/P modelling and needs only that the K-branch does not decrease with w; the 5/6 floor needs nothing about w.
2. **Scope of Lemma U.** It covers two comparisons of the Proposition 2.1 form (signal Z^{s+c}, bounded H). It does
   not cover a signal of another shape: slope different from 1 in log Z (a reflected probe in the variable t^4/Z
   at fixed height would have slope -1 and detect 1 - conj(rho), the same real parts by symmetry), unbounded H, or a
   comparison in two scale variables. It also says nothing about a different probe.
3. **Free-geometry rows depend on which reduced inputs are true.** The h > 1 vertices come from an inconsistent
   system and the false input is not identified (dir0, ideal high side at h > 1, or the signal formula at lx < l;
   the Dunn-Radziwill sharpness is recalled, not opened, and concerns general coefficients). The whole system is
   transcribed from unrefereed sources (as in `r3-method-limit`, weakest step 1); r = 3, 4 are the transplant.

## 9. Proposed map row (not applied)

| Z15b | Target reflection in the 7/8 system | The reflection of the target variable is Prop. 5.1 (already used; it produces M + l <= 1 as "dual length <= rows"). The signal constant c is an invariant of the probe (Lemma U), so no re-expression changes h. Ledger with height w = 4 tau and side choice: 13/15 at w = 0; reflected >= 13/15 + w/15; unreflected (Lemma 9.1, polar term) >= 1; empty dual >= 11/12. s <-> 1-s cannot act on 1/L (Lemma V). h > 1 only at lx < l with an optimal unreflected sieve or K, P deleted; those runs fall below 1/2 (inconsistent). | PROVED (Lemma U, scalar steps); EXACT LP on MODEL inputs | THIN, sign twists: dir branch only, abscissa 1; DH: low side holds, fails at Lemma 7.1; E_a: shift by a | `c5-target-fe-order2-ledger` |

No pivot taken. No abscissa below 0.874886647 is proved.
