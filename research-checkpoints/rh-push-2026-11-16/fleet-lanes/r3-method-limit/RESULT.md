# r3-method-limit: the infimum abscissa of the 7/8 architecture under ideal inputs

Internal working note, 2026-11-16. Slug `r3-method-limit`. Nothing committed, pushed or posted. Not refereed.
Files: `tiers.py` + `tiers.log`, `tiers2.py` + `tiers2.log` (exact rational LP by vertex enumeration, python stdlib only).

Every abscissa below is the value of a hypothetical ESTIMATE SYSTEM. None is a zero-free region. Every number is
relative to the unrefereed inputs: the openai/math 7/8 manuscript (`~/lean-deps/qrh-verify/paper.txt`), Liu
arXiv:2610.12234, Xu-Sang arXiv:2610.15291v2, Liu arXiv:2610.26835v2 (texts in `../bypass-78/dl/`). A failed or
capped sufficient system is not a statement about zeros (atlas section 9). PT Lambda <= 0.2 stands. RH open. NO QED.

Labels: PROVED (complete argument here, scalar) / PROVED-rel X / EXACT (rational LP, value confirmed feasible at v
and infeasible at v - 1e-9) / CITED / MODEL (hypothetical input priced in the system) / HEURISTIC / RECALLED / OPEN.

**Verdict: precise obstruction.** The infimum is not 1/2. For the sextic architecture with every ingredient at its
optimistic value, the infimum is exactly **5/6**; for a hypothetical order-r version it is **1 - 1/r** (MODEL
transplant for r != 6). The structural step is one identity, sigma_0 = 1 - h/r: the principal signal is the count
Z^{h/r} of r-th powers among the Poisson frequencies of norm <= Z^h, measured against a Cauchy-Schwarz bound that
cannot be below the square-root level X^{1/2}, and the compensation device forces h <= 1. Between the current
0.874886647 and 5/6 there are three intermediate floors (13/15, 31/36, 23/27), each tied to one named range loss.
RH inside this architecture needs effective order r/h = 2, which no listed input supplies.

---

## 0. Plan: what differs from closed lanes

Read: BRIEF, CRITIC_R1 (all), and RESULT/REFEREE of bypass-78 (no REFEREE exists), zf-hecke-all-fields,
zf-audit-inputs, zf-higher-rows, zf-large-values, r2-zf-critical-density, r2-zf-paired-rows,
r2-zf-gm-inverse-witness, r2-tro6-polar-theorem, r2-tro6-nonpolar-scale, r2-tro6-type12-split, tro6-numerics,
tro6-period; manuscript sections 1, 2, 6, 10.2, 12, 15.3; Liu II sections 14.1, 15.1-15.3.

Not repeated: optimality of B_flat in the present system (Liu II Thm 14.13; bypass-78 sections 2-4;
zf-hecke-all-fields); price list of single-input changes (bypass-78 section 5); TRO6 (r2-tro6-*); count savings
(r2-zf-critical-density, zf-large-values, r2-zf-gm-inverse-witness); row orders and paired rows (zf-higher-rows,
r2-zf-paired-rows).

Different here:
1. The question is the limit with ALL inputs idealised at once, not one input at a time. bypass-78's log has one line
   (`price_list.log` row 8: 0.8333333) that its RESULT does not report or explain; its stated low floor is 13/15.
2. Theorem 1: 5/6 is a floor for every system of this type, with a three-line proof and the reason (sigma_0 = 1 - h/r).
3. Theorem 2: exact tier table. New facts: 13/15 does not need the J-loss (a new exact certificate through the
   floor-class row bound); the binding loss is the K-loss; removing it gives 31/36, then 23/27, then 5/6.
4. Theorem 3: what any route below 5/6 must supply, with exact amplification lengths; 1/2 needs r/h = 2.
5. Ranked input list (section 5) and features of a successor mechanism (section 6).

Walls: nothing here is an argument about zeros, so DH / flow / MV-CAP apply only to the base method (section 7).

---

## 1. The estimate system

Notation (manuscript Def. 10.1, (12.4), (12.5); Liu II section 15.1). X = Z^{lx}, Y = Z^{ly}, prime slots of total
length l (P = Z^l), M = lx + ly, b = ly - lx, h = 1 - lx + l. Row variable m of norm about Q = XY. The probe is
I = Q^{-1/2} Sum_m A_m B_m (manuscript (6.2)): A_m an additive polynomial of length Y in sextic Gauss sums, B_m a
completed cubic-theta row at scale Z (marked scale Z P). Poisson summation in m gives frequencies u a^6 of norm up
to Z^h (modulus Y Z^{1+l} against length XY).

(S) Signal [PROVED-rel manuscript (10.3), (10.5)]. The row u = 1 has the poles w = 1 and z = 1/6 of
zeta_F(6z), giving Z^{C(s)} / L(s, eta) with

  C(s) = s - 1 + lx/2 + h/6.

h/6 is the exponent of the number of sixth powers of norm <= Z^h. For order r: C(s) = s - 1 + lx/2 + h/r
[MODEL, zf-higher-rows Formula 3].

(L) Low side [CITED, Liu II section 15.1 "direct majorant"; manuscript Prop. 15.3 at its geometry]. The proved bound is
|I| << Z^{lx/2 + G + k/2}, so with Prop. 2.1 the abscissa satisfies

  B >= B_low = 1 - h/6 + G + k/2 = 5/6 + (lx - l)/6 + G + k/2,
  G = max(0, b/12, b - ly/2),   k = max(0, k_J, k_K, k_P),
  k_J = (1 + 3l - 2M)/4,  k_K = M + l - 1,  k_P = (3l - 1)/2.

lx/2 is the square-root level: Cauchy-Schwarz with ||A||^2 = Q/Y and ||B||^2 = Q, i.e. |A_m| ~ Y^{-1/2}, |B_m| ~ 1.
G is the Gram excess of A (b/12 is the P_a^{1/6} term). k is the range loss of the reflected energy of B.

(GEO) Geometry [PROVED-rel manuscript (12.5), Prop. 15.3]. The compensated probe subtracts the rescaled term
q_p^{-3/2} I(X/q_p, Y/q_p, Z). Its lengths are Z^{lx-l}, Z^{ly-l}; the source needs both >= 1: lx >= l, ly >= l
(Liu II Remark 14.1(1): "lx > l"). Weaker form (GEO-Q): the rescaled row range is nonempty, M >= 2l.

(H) Ideal high side [MODEL]. Row class (delta, x): rows u of norm Z^d with a zero of some twist at real part
a = (1 + delta)/2, prime amplitude g = delta x, 0 <= x <= 1/2. With the density-hypothesis count U^{1-delta},
Lindelof for the numerator on the class (K = R, w = 1/2, no shift), from Liu II (14.7) at the binding scale d = h:

  E(delta, x) = 1/2 + delta/2 - B - ly/2 + h(5/6 - delta) - l/2 + l delta x  <=  0,   0 <= delta <= 2B - 1.

At delta = 0 this is the floor-class bound H0 := 1/2 - ly/2 + 5h/6 - l/2 <= B. It uses the trivial count U and the
unconditional mean value of |L(1/2)|; on the balanced line it is Liu II's C_0 < 0 (checked: both equal
-1/4 + b/6 + 5l/4). With GRH for the row family only H0 remains.

"Ideal" inputs priced: density hypothesis or GRH for counts; Lindelof on the class; kappa irrelevant (x up to 1/2
kept, the unfavourable direction); k = 0 (optimal mean square for the reflected rows, no range loss); G = 0
(TRO6 with eta = 1 and no P_a^2/Y' term) or G = max(0, b/12) (polar term kept).

---

## 2. Theorem 1: the floor 1 - 1/r

**Theorem 1 [PROVED, scalar; relative to (S), (L), (GEO)].** In any comparison system in which
(i) the signal exponent is C(s) = s - 1 + lx/2 + h/r,
(ii) the low estimate is at or above the square-root level, |I| bound >= Z^{lx/2}, and
(iii) lx >= l,
the abscissa satisfies B >= 1 - 1/r. With (iii) replaced by M >= 2l and (ii) by "square-root level plus the polar
term", bound >= Z^{lx/2 + max(0,b)/(2r)}, the same holds. For r = 6: B >= 5/6. No property of the high side, the
detector, the counts, kappa, the numerator estimate or the field is used.

Proof. Prop. 2.1 gives B = (low exponent) - (C(s) - s) >= lx/2 + 1 - lx/2 - h/r = 1 - h/r, and
h = 1 - (lx - l) <= 1 by (iii). In the second form B >= 1 - 1/r + (lx - l)/r + max(0,b)/(2r)
>= 1 - 1/r + (M - 2l)/(2r) >= 1 - 1/r, since lx + max(0,b)/2 >= M/2. QED

Reading. A zero at real part beta is visible only if Z^{beta - 1} Z^{h/r} > 1: the deficit Z^{1-beta} of the
reciprocal must be covered by the number Z^{h/r} of r-th-power frequencies, because the noise floor X^{1/2} and the
signal both carry X^{1/2}. So sigma_0 = 1 - h/r and the effective order is r_eff = r/h. Part I has h = 1/2
(11/12 = 1 - 1/12), the manuscript h = 13/16 with G = b/12 = 1/96 (7/8), Liu II h = 0.794.

**Attainment [EXACT].** In the ideal system (k = 0; G = 0, polar, or source; (H)), lx = ly = l = t with
1/2 < t < 1 has B_low = 5/6, E(0,.) = 4/3 - 5/6 - t < 0 and E(2/3, 1/2) = E(0) - (1 - t)/3 < 0. So the infimum of
the ideal sextic system is exactly 5/6 (`tiers.log` T3, T3', T4, Q1: CONFIRMED at 5/6). With the 6 -> r transplant
the same point gives 1 - 1/r for r = 3, 4, 5, 6, 8, 12 (`tiers.log`, all CONFIRMED) [MODEL for r != 6].

Status of hypothesis (ii). [CLASSICAL] for b < 0 the planar large sieve is two-sided when Q >= C Y^2, so
||A||^2 is of exact order Q/Y. [MODEL] ||B||^2 >= Q^{1-eps} (diagonal) and the polar term: the three TRO6 lanes
measure the coherent term, and r2-tro6-polar-theorem proves the twisted first-moment law relative to the manuscript;
a lower bound for ||A||^2 of order (Q/Y) P_a^{1/6} is not proved here. Theorem 1 does not need (ii) to be true of the
norms; it says what any estimate of that type yields. An estimate below X^{1/2} is not a norm estimate: it is
cancellation in Sum_m A_m B_m beyond square root in the s- and A-variables (section 4(a)).

---

## 3. Theorem 2: the tier table

**Theorem 2 [EXACT rational LP; MODEL inputs].** Sextic system, ideal high side (H), source geometry lx, ly >= l.

| low side kept | infimum | point (lx, ly, l) | log |
|---|---|---|---|
| source G, source k | 13/15 = 0.86667 | (2/5, 2/5, 1/5) | T1; same with GRH counts (T1') |
| J-loss removed, K and P kept | 13/15 | same | T2c, tiers2 |
| P-loss removed | 13/15 | same | T2d |
| K-loss removed, J and P kept | 31/36 = 0.86111 | (1/2, 1/2, 1/3) | T2b |
| K and J removed, P kept | 23/27 = 0.85185 | (4/9, 4/9, 1/3) | T2g |
| K and P removed, J kept | 5/6 | (1, 1, 1) | T2e |
| k = 0, any G (source, polar, 0) | 5/6 | (1/2, 1/2, 1/2) | T3, T3', T4 |
| G = 0 for every b, source k | 5/6 | (0, 1, 0), h = 1, b = 1 | T2a |

(i) New certificate for 13/15 [EXACT identity, checked on random rational geometries in `tiers2.log`]. With
L0 = 5/6 + M/12 - l/6 (G >= b/12), L0' = 5/6 + lx/6 - l/6 (G >= 0), L_K = L0 + (M + l - 1)/2 and the floor-class
bound H0:

  (4/15) L0 + (2/5) L0' + (2/15) L_K + (1/5) H0 = 13/15   identically in (lx, ly, l).

Liu II section 15.3 obtains 13/15 from L0, L_K, L_J. The identity above does not use L_J. So 13/15 is forced by
the K-loss together with the trivial row bound, with any counts, including GRH for the row family, and with the
J-loss deleted. The K-loss is the range condition M + l <= 1 of the reflected energy (manuscript Lemma 5.8: the
row mean square is Z^{max(M, 2M - N)}, loss when the row range exceeds the completed scale; Lemma 15.1; Liu II
Lemma 2.4).
(ii) 13/15 -> 31/36 needs the K-loss removed; -> 5/6 needs K and P removed. The J-loss does not bind at 13/15; it
     binds only between 23/27 and 31/36 (K removed, P kept).
(iii) TRO6 does not move the 5/6 floor. With G = 0 for every b the system reaches 5/6 with the source k, at
l = 0, lx = 0: no primes, X = 1, Q = Y = Z. That input is stronger than TRO6-natural: at b = 1 it asserts
|A_m| ~ Y^{-1/2} for q_m ~ Y, against the measured polar law. TRO6 with eta = 1 and the P_a^2/Y' term kept gives
0.8586 with the present high side (bypass-78 `price_list.log` 1c).
(iv) Cross-check with the present (non-ideal) high side, bypass-78 `price_list.log`: row 8 (G = 0, k = 0, Lindelof)
0.8333333; row 1d (G = 0) 0.8333333; row 2a (k = 0) 0.8392 with that script's cap l <= 1/2 active.
(v) Other orders with the source k [MODEL]: 1 - 4/(5r) (r = 3, 4, 5, 6, 8: 0.7333, 0.8, 0.84, 0.8667, 0.9), in
agreement with zf-higher-rows Formula 3.

---

## 4. Theorem 3: below 5/6, and what 1/2 costs

**Theorem 3 [PROVED scalar; EXACT LP for the lengths].** A system of this type with abscissa sigma < 1 - 1/r needs at
least one of:

(a) a low estimate below the square-root level, exponent <= lx/2 - ((1 - sigma) - h/r);
(b) h >= r(1 - sigma) > 1, i.e. prime marks longer than the X-range: l - lx >= r(1 - sigma) - 1; with the polar term
    kept, 2l - M >= 2r(1 - 1/r - sigma) (r = 6: 12(5/6 - sigma));
(c) a smaller order r with all other inputs intact.
For sigma = 1/2: r_eff = r/h = 2. With r = 6 that is h = 3 (G = 0) or 2l - M = 4 (polar term kept).

Exact minimal mark lengths in the ideal system with k = 0 and free geometry (lx, ly, l >= 0), `tiers2.log`:

| target B | polar kept | G = 0 | polar kept, no compensation |
|---|---|---|---|
| 5/6 | 1/2 | 0 | 1 |
| 3/4 | 5/4 | 1/2 | 5/2 |
| 2/3 | 2 | 1 | 4 |
| 1/2 | 7/2 | 2 | 7 |

Closed forms: l_min = 8 - 9B (polar, from B_low and H0 at b = 0) and 6(5/6 - B) (G = 0). With free geometry and
k = 0 the scalar system has no floor at all (`tiers.log` F1, F2 fall to the search bound), so the whole content of
the limit is in what caps l. In the sources the caps are the K-loss and the P-loss: with K alone and free geometry
the infimum is 13/15 (F5), with P alone 23/27 (F4), with J alone there is no floor (F6).

Why (b) is not an available input [HEURISTIC]. At l > lx the row at B = 1/2 needs |B_m| ~ 1 for a marked row
whose prime variable has length P = Z^{7/2} or Z^2 against Q <= Z^3 rows. For general coefficients the dual large
sieve gives max(Q, #marks) and no more. For the prime marks the missing statement is square-root cancellation of
Sum_p chi_p(m) c_p over p ~ P for characters of conductor about q_m: prime sums at GRH strength for the row
family, on the low side, where the method has no detector. That is the conclusion being sought, used as an input.
Without compensation the rows are amplified with the signal and the lengths double (table, last column).

Why (c) is closed: zf-higher-rows Thm 1 (PROVED at primes and squarefree moduli, referee-confirmed): Moebius
absorption mu(pi) g(chi) = -J(chi, rho) g(chi rho)/g(rho) needs chi rho nontrivial, so r >= 3; the absorbed dual
is on the 3-fold cover (evaluable theta, a = 2) only for r = 6. r = 3, 4, 5 have a = 4, 3, 6 (PROVED-rel, MODEL
table). r = 2 would give 1 - 1/2 = 1/2, and there the absorbed object is the principal character: the reflected
side is the Moebius sum itself and the low estimate is the Riemann hypothesis for the target.

---

## 5. Ranked inputs (distance from current knowledge, nearest first)

Each line: input, what it moves in the ideal bookkeeping, status. All values MODEL and relative to the unrefereed
sources.

1. **Counts or numerator at the critical class to the level where the low floor binds.** 0.874887 -> 13/15.
   Either Lindelof on the class or the density-hypothesis count suffices alone (bypass-78 rows 3, 7a). A partial
   count saving U^{-tau} is worth -0.138 tau (refereed). Nearest: these are mean-value statements, which the method
   consumes; no saving is in hand (r2-zf-critical-density, zf-large-values, r2-zf-gm-inverse-witness).
2. **K-loss: mean square of the marked completed cubic-theta rows for row range beyond Z^{1-l}** (M + l > 1).
   13/15 -> 31/36. One lemma (manuscript Lemma 5.8 / 14.4 / 15.1 in the range 2M - N > M). Whether the loss is the
   true size of the norm or an artifact of the reflected large sieve is OPEN and decidable by the kind of
   numerics the tro6 lanes ran. RECALLED, not re-read: Dunn-Radziwill show Heath-Brown's cubic large sieve is sharp
   as an operator bound, so removal must use the specific theta coefficients.
3. **P-loss (3l - 1)/2: marks of total length above 1/3.** With 2: 31/36 -> 5/6. With J removed instead: 23/27.
4. **TRO6-natural.** Lowers the constant G only. Worth 7.8e-4 at eta = 0.1 and reaches 0.8586 at eta = 1 in the
   present system (bypass-78). It does not move 13/15 (attained at b = 0) or 5/6.
5. **Below 5/6: square-root barrier or amplification barrier** (Theorem 3 (a), (b)). (a) is a power saving below
   X^{1/2} for Sum_m A_m B_m, not a norm statement; no lane has a candidate. (b) needs GRH-strength prime sums on the
   low side.
6. **1/2:** r_eff = 2. Not reachable by any combination of 1-4. Needs (a) with saving Z^{-(1/2 - h/6)} (at h = 1:
   Z^{-1/3} below square root) or (b) with l - lx = 2.

Minimal set for 5/6: {1, 2, 3}. Minimal set for 1/2 inside the architecture: {1, 2, 3} plus 5(a) or 5(b) at full
strength; 5(b) is circular as described.

---

## 6. Features a successor mechanism must have

From sigma_0 = 1 - h/r and Theorem 3:
1. Coherent set of exponent 1/2: the principal (target-carrying) term must be supported on a set of dual
   frequencies of size (dual length)^{1/2}. Squares, not sixth powers. Any r >= 3 residue-symbol row with h <= 1
   stops at 1 - 1/r >= 2/3.
2. A low side that reaches the square-root level by evaluation, not by cancellation of Moebius: for r = 6 this is
   Patterson's cubic theta after absorption. At order 2 absorption returns the principal character, so the
   quadratic analogue needs a different identity that converts mu times a quadratic symbol into an evaluable
   automorphic coefficient.
3. No range loss between row range and completed scale (the K-loss), or a geometry in which M + l <= 1 and
   h = r/2 hold together; in the sextic system they are incompatible (M + l <= 1 and lx >= l give h <= 1).
4. The inherited requirements: uniform in height and in every window; multiplicativity used in an essential step
   (it is, at the absorption identity and the row Euler identity); failure for DH.

---

## 7. Controls

DH: no statement about zeros is made, so nothing must fail for Davenport-Heilbronn. The base method's Euler-product
steps are those listed in bypass-78 section 7 and zf-higher-rows section 7 (scalar Euler identity for row u = 1,
Moebius coefficients of the inverse witness, absorption mu(pi) = -1). Theorem 1 uses none of them: the floor
1 - h/r is a property of the signal normalisation and the square-root level, and it holds equally for a function
without Euler product. That is consistent: the floor is on the side of the argument (low side) that is Euler-blind.
Backward heat family, sign twist: not applicable (no positivity or zero statement).
No step assumes RH or GRH as a hypothesis of a PROVED claim; GRH and the density hypothesis appear only as priced
MODEL inputs. No verified-height input.

## 8. Three weakest steps

1. **The system is transcribed, not re-derived.** (L) is Liu II's direct majorant (unrefereed; stated by the source
   on a relaxed length range that "goes beyond" Liu I Prop. 22.2), and (H) is Liu II (14.7) with K = R, theta = 0
   and the density-hypothesis count substituted. The small-delta, capacity and small-row gates of Liu II Remark
   14.1(2),(4) are not imposed. This is the safe direction for floors (Theorem 1 uses only (S), (L), (GEO)) and the
   unsafe direction for attainment: "infimum exactly 5/6" means attained in the reduced ideal system, not that a
   proof exists given the ideal inputs.
2. **Hypothesis (ii) of Theorem 1 is a definition of the method family, not a proved lower bound for the norms.**
   Only ||A||^2 for b < 0 is two-sided by a classical argument. If the true ||A|| ||B|| were below Q^{1/2} X^{1/2}
   in some geometry, a norm estimate could beat the floor. The status of the K-, J- and P-losses (true size or
   artifact) is not determined.
3. **Order r != 6 and the non-availability of (b).** The 1 - 1/r statement is the 6 -> r transplant of three
   formulas (MODEL, as in zf-higher-rows). The argument that amplification beyond lx requires GRH-strength prime
   sums is HEURISTIC; it does not exclude a different amplifier (non-prime marks, or marks on the A-side).

## 9. Verdict

Precise obstruction, as a theorem about the estimate system. sigma_inf = 5/6 for the sextic architecture
(1 - 1/r for order r, MODEL), relative to the unrefereed sources; structural step: signal = number of r-th powers
among frequencies of norm <= Z^h, against the square-root level, with h <= 1. Intermediate floors 13/15 (K-loss
plus trivial row bound), 31/36, 23/27. RH is not reachable by improving inputs of the listed kinds. No pivot taken.
No abscissa below 0.874886647 is proved. 7/8 (unrefereed) stands; RH open.
