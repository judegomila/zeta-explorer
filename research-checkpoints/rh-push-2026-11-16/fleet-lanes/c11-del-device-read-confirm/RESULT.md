# c11-del-device-read-confirm: the deletion control against the device table and Statement O

Date 2026-11-19. Slug `c11-del-device-read-confirm`. Kind: combine. Paper lane; record work.
Scope: this directory and one line in `campaign/lanes.jsonl`. The compute server was not used. One local run through `scripts/memcap.sh 8` (a text/JSON table builder, no numerics).
No answer for R4 is offered. No statement about zeros of zeta is made. No requirement score is claimed (R1 = R2 = R3 = R4 = false).

Labels: PROVED (complete argument here) / PROVED-rel X / CLASSICAL / RECALLED (from memory, source not opened) / ARGUED / OPEN.

## Verdict

Record confirmed with corrections; nothing reopens.

1. **Count.** The tally 14 / 20 of c10 `DEVICE_READ.md` is right for its own table and wrong by three cells. Corrected: **11 pass (6 in full, 5 in part) / 23 do not** (2 transferred only, 1 not established, 19 not formulable, 1 fails). Cells changed: `dual-measure-compactness` (P to not established; row P36 and its lane), `twisted-discrepancy` (P to transferred only; row P51, same class hypothesis as row P46), `laurent-shell-gamma-section` (P / NF to NF; control table of its lane). Two state cells corrected to the file (`effective-order-two`, `function-field-order2-vertex`: closed). Full table: `DEVICE_READ_V2.md`.
2. **Decisive test (item 2).** Every closed device whose read set omits the functional equation and periodicity has a passing control on file. The devices with no control passing every step are three: `coherent-set-large-sieve` (the floored mechanism), `landau-siegel-mechanism` (closed for the height aspect by absence of a height-aspect form), `selberg-operator` (a proposed control, closed by an identity). The first two are the mechanisms of STRATEGY section 4.0 (d) and both read periodicity. **Section 4.0 (c) is confirmed with one narrowing (item 3 below); the round-12 allocation does not change.**
3. **Narrowing of 4.0 (c).** Neither DEL nor THIN is shown to pass a read set that contains the exact counting function of the integers (row P36: logarithmic discrepancy). E_a passes it. With the residue at 1 normalised to 1 that input is an identification (Lemma J, PROVED), so it is not a fourth read set.
4. **Item 3.** A control with an Euler product, unimodular local parameters and zeta's functional equation but without periodic twists does not exist among ordinary Dirichlet series: the function is zeta (Hamburger, CLASSICAL, at conductor 1; relative to Kaczorowski-Perelli for other conductors, not opened). In degree one the functional equation with integer frequencies implies periodicity. For RS-3 this leaves only controls that drop exactly one input; T-NR should be added to its screen.
5. **Item 4.** One closed device row for central-value squares is written (section 4), with two proved lemmas: a twist by n^(-it) is self-dual only for t = 0; the self-dual object containing zeta at height t has central value abs(zeta(1/2 + it))^2, a modulus squared, non-negative for every function.

## 0. Plan

Read: BRIEF; STRATEGY v3 sections 1, 2, 4.0; c10 `RESULT.md`, `REFEREE.md`, `DEVICE_READ.md`; `STATEMENT_O.md` (c9); `engine/curated/devices.json`, `controls.json`; `stack-combinator/TABLE.md`; map section 2 and the rows cited by the 34 devices (P1 to P3, P6 to P10, P14, P15, P18, P21, P22, P25, P29, P35, P36, P38 to P40, P46, P50, P51, L2, G13, G17, G20, G22, G24 to G26, G31, S11, S12, F1, F8, Q12, Q19 to Q22, Q25 to Q27, T3, Z15, Z15b, Z15c, Z16, Z22 to Z24, Z26, Z27, Z30, Z31, D1 to D7, O1). For six cells the control section of the lane behind the row was read: `e1-cofinal-legendre-dual`, `c5-device-table-extension`, `c7-laurent-shell-gamma-section`, `c7-landau-siegel-device-read`, and the engine nodes of `positive-kernel-transport`.

New relative to c10: its referee checked the arithmetic of the count and one cell. Here every cell is read against the cited rows, and the non-passing devices get their passing control by row.

The three questions of map section 2, for this lane: it is not an attack; R1, R2, R3 have no content here; R4 has no answer (allowed for a combine lane that is record work, STRATEGY section 1).

Decisive first test: item (2). Done first after the table (sections 1 and 2). It does not kill anything: the list of devices without a passing control contains no device outside the periodicity read set.

## 1. Task 1: the count

Method. For each device: the read set in devices.json, then the 'Defeated by' cell and text of each cited row, then (where the row is silent on TW+ or Beurling) the lane's control table. Codes PF, PP, T, O, NF, FAIL are defined in `DEVICE_READ_V2.md`. The c10 table counted a row as a pass when the first of its two codes was P.

Result. 6 PF: `stage-limit` (Q21 names TW+), `frequency-only` (D1, D6), `tensor-squeeze` (D4 names TW+-), `sum-product-vinogradov` (D2, with the slack reading), `quadratic-positivity-companions` (P50, P25), `positive-term-sum-rule` (Q27). 5 PP: `mean-value-convexity`, `positive-kernel-transport`, `recurrence-ergodicity`, `section-extraction`, `test-restriction-commutator`. 2 T: `helson-discrepancy`, `twisted-discrepancy`. 1 O: `dual-measure-compactness`. 19 NF, 1 FAIL (`finite-support-positivity`).

The three changed code cells.

(a) `dual-measure-compactness` (c10: P). The map cell of row P36 reads 'B (Lambda_a >= 0 holds)'. The lane behind the row (`e1-cofinal-legendre-dual/RESULT.md` section 6 and verdict item 4) says more: the separating step is 'Lambda_a >= 0 with logarithmic discrepancy', its Beurling row fails at the second half (the discrepancy bound O(log x) is Stirling for N(Y) = floor(Y)), and 'E_a passes every step'. DEL has Lambda_F >= 0 and integer frequencies. Its counting function is G(1) Y + O(Y^(b+eps)) (c10 Lemma 1 (v)); a bound O(log Y) is not proved. So DEL is not shown to pass; the control on file is E_a. A lower bound for the discrepancy of DEL is not proved either (F is analytic at b, so Landau's theorem gives none): the cell is 'not established', not 'fails'.

(b) `twisted-discrepancy` (c10: P, general form). Row P51 is stated for unimodular completely multiplicative chi, as row P46 is. c10 coded device 18 'NF as stated / P in transferred form' and device 19 'P'. Same hypothesis, same code: T. The transferred statements are true for DEL. For P46 the check is one line (PROVED): for abs(chi(p)) <= 1, log(F F*/zeta^2) = -2 sum_p sum_k (1 - Re chi(p)^k) p^(-ks)/k with coefficients >= 0, so the Landau step of the row is unchanged. For P51: a = 1 * g gives sum_{n<=x} a(n) e(cn/q) = x sum_{q | d} g(d)/d + O(q sum_{d<=x} abs(g(d))) = main term + O(q x^(b+eps)) (PROVED, elementary).

(c) `laurent-shell-gamma-section` (c10: P / NF). The lane's control table (section 6) has for 'THIN, sign twists TW+-': first moment at sigma = 1/2 not formulable; Lemma 2, closure, limit step not formulable or void. No statement of the device holds for DEL in a non-void way. The lane's passing controls are DH and WT.

Cells kept that needed a second source. `sum-product-vinogradov`: the lane's Q1 lists TW+ as failing the additive step; that is for arbitrary eps_n. For a thin deletion the loss is x^(b-1+eps) relative, below the Vinogradov saving at N = t^eps, which is the reading the row gives for THIN. `positive-kernel-transport`: the P part is carried by two engine nodes (transport for zero-free completions of the finite Euler product; corrected Euler products), all four cited map rows read the completed function. `section-extraction`: row Q22 calls the first-moment step void for TW+; only chain formation holds.

## 2. Task 2: read sets of the devices DEL does not pass, and the control that passes each

Tables by group in `DEVICE_READ_V2.md`. Summary:

| group | read set | devices | controls on file that pass (rows) |
|---|---|---|---|
| A | completed function at all heights | exact-uniqueness, residue-explicit-formula, maximum-principle, euler-fe-phase-at-height, monotone-flow-functional, strip-dtn-identity, single-row-bridge, laurent-shell-gamma-section, and the FE parts of the five PP devices | DH (P1, P3, P6, P7, P8, P40, D7, G20, Q12, Q26, S11), HEAT (F1, Q20, P3, G25, Q26), E_a (P1, F8, Q22), T-NR (Q22), WT and U (S12), theta^w (Q26) |
| B | finite-order positivity with zeta's archimedean side | finite-support-positivity | DH, HEAT, kappa_sharp (P3, P7, P18, P21, P22) |
| C | periodic twists in the conductor aspect | coherent-set-large-sieve, effective-order-two, vector-specific-row-mean-square, nonprincipal-row-cancellation, landau-siegel-mechanism | closure rows are coefficient-blind (Z22, Z27, Z31: THIN, TW+-, U, DH, random weights) or circular (Z30); **none** for the floored mechanism and for the Landau-Siegel device |
| D | an attached object | selberg-operator, geometric-positivity, hecke-compression-lax-phillips, hecke-correspondence-recurrence, function-field-order2-vertex, padic-special-values | fakes with off-line zeros (T3, c10-ff lanes), block-permuted family (P38), inner scattering functions (G26), EIS-w (G31), interpolation twin (D5); **none** for selberg-operator (G24) |
| E | class stated for unimodular chi | helson-discrepancy, twisted-discrepancy | B, THIN (P46); THIN, WT (P51) |
| F | exact integer counting | dual-measure-compactness | E_a (P36) |

Devices with no control on file that passes every step:

1. `coherent-set-large-sieve`. State 'floored', not closed. Controls fail it (TABLE row 50; THIN at PER). This is its R3 property and is known.
2. `landau-siegel-mechanism`. THIN, Liouville, sign twists and U fail at S4/S5 (lane section 5; proved, elementary); DH and Beurling are argued. Closed for the height aspect because n^(-it) is U and has no Frobenius class. It has no map row: the closure rests on one lane with one referee and a Lean tree read as text.
3. `selberg-operator`. Row G24: the control 'does not exist in the needed form'. Not an attack device.

Reading for the planner. Items 1 and 2 are exactly the two separating mechanisms of section 4.0 (d); both use periodicity in the conductor aspect; neither has a height-aspect form. Nothing outside read set RS-1 appears. **The list gives no new input for round-12 explore lanes.** Two bookkeeping items follow: a map row for the Landau-Siegel device (owed), and the P36 cell of the map should read 'B: Lambda_a >= 0 holds, fails the logarithmic discrepancy; E_a passes every step'.

**Lemma J (density-one normalisation is an identification) [PROVED].** Let a be completely multiplicative with abs(a(p)) <= 1 for every prime, F(s) = sum a(n) n^-s. If a(p_0) != 1 for one prime p_0 then limsup_{s -> 1+} abs((s - 1) F(s)) <= (1 - 1/p_0)/abs(1 - a(p_0)/p_0) < 1. Proof: for real s > 1, F/zeta = prod_p (1 - p^-s)/(1 - a(p) p^-s) and each factor has modulus at most 1, because abs(1 - a(p) p^-s) >= 1 - p^-s. Keep the factor at p_0, bound the others by 1, and let s -> 1+ with (s - 1) zeta(s) -> 1. The last inequality: abs(1 - a/p_0) >= 1 - abs(a)/p_0 >= 1 - 1/p_0 with equality only for a = 1. QED
Consequence: in the classes TW+, TW-, U (hence for DEL, THIN, FM), 'residue 1 at s = 1', equivalently 'sum_{n<=Y} a(n) = Y + o(Y)', holds for zeta only. DEL has residue G(1) < 1 and THIN has prod_{p in S} (p - 1)/(p + 1) < 1. A device that reads the exact main term of the integer count reads an identification (mode (I) of Statement O line 11), as with Lemma I of c10. Without the normalisation, the finite modification zeta(s)(1 - q^-s) has count (1 - 1/q) Y + O(1), Lambda >= 0, and zeros on Re s = 0 only: it passes a read set {POS, bounded discrepancy} with no zero in the strip, so that read set has no control with a zero on file. This is recorded as an open control question (does a deletion set with a zero at b and counting discrepancy O(Y^eps) exist), not as a read set: row P36 closes the device by its own reason (limit points have density 0; Landau gives Omega results only) and E_a passes every step of it.

Wording proposed for STRATEGY section 4.0 (c): 'Every degree-one read set that omits the functional equation and periodicity is passed by DEL or THIN, except a read set containing the exact integer count, which E_a passes (row P36) and which is an identification once the residue is normalised (Lemma J).'

## 3. Task 3: a control with Euler product, unimodular parameters and zeta's functional equation, without periodic twists

**Answer: none exists among ordinary Dirichlet series; the question is open only outside integer frequencies.**

Classification used.

- (H) Hamburger's theorem [CLASSICAL; RECALLED in this form; already used in map section 2, 'input level', and row L2]. If F(s) = sum a_n n^-s and G(s) = sum b_n n^-s converge absolutely in some half-plane, (s - 1) F(s) is entire of finite order, and pi^(-s/2) Gamma(s/2) F(s) = pi^(-(1-s)/2) Gamma((1-s)/2) G(1 - s), then F = G = a_1 zeta.
- (KP) Kaczorowski-Perelli, 'On the structure of the Selberg class, I: 0 <= d <= 1', Acta Math. 182 (1999) [**relative to**; not opened; RECALLED]: the functions of degree one in the Selberg class are zeta and the shifted Dirichlet L-functions L(s + i theta, chi), chi primitive; in the extended class (no Euler product required) the degree-one functions of conductor q and shift theta are the combinations sum_chi P_chi(s + i theta) L(s + i theta, chi*) with Dirichlet polynomials P_chi. Row L2 of the map already rests on it.

Consequences.

1. Zeta's functional equation (gamma factor, conductor 1) with integer frequencies gives F = zeta by (H). Neither the Euler product nor unimodularity is needed, and every twist of zeta by a Dirichlet character is periodic. So the requested control does not exist in this class. [CLASSICAL]
2. With another degree-one functional equation, (KP) gives coefficients chi(n) n^(-i theta): periodic up to a height translate. In degree one, FE with integer frequencies implies PER. Periodicity is not an input that a control can drop while keeping the other two. [PROVED-rel KP]
3. Hence every control for a device that reads {Euler product with unimodular parameters, zeta's gamma side, integer frequencies} drops exactly one of these, and the set of functions with all three is {zeta}. The controls on file by the input dropped: Euler product: DH and, by (KP), every other degree-one FE function (row L2); degree and SIZE: E_a with real a; integer frequencies and temperedness at one prime: T-NR; FE at all heights: U, WT, THIN, DEL; the Dirichlet series: HEAT.

What this leaves for read set RS-3.

- (i) RS-1, RS-2 and RS-3 do not differ in the class of functions that satisfy their inputs (zeta alone in degree one); they differ in the inequality. A stage-A table for an RS-3 lane cannot contain a control that has the gamma side and the Euler product and lacks only periodicity. R3 evidence for such a device can only be a failure at a named step for each one-input-dropped control.
- (ii) The screen named in section 4.0 for RS-3 (DH, E_a with real a, backward heat) drops the Euler product, SIZE, and the Dirichlet series. It has no member that keeps zeta's gamma factor, the field-level functional equation and an Euler-type product at once. T-NR does (it lacks Lambda >= 0 and temperedness at the one prime q). **Add T-NR to the RS-3 screen.** A positivity step that uses the gamma side and the Euler product together must fail for T-NR at the prime q, by a statement about that local factor, or it holds for a function with zeros at Re s = 1/2 +- arccosh(abs(c)/2)/log q.
- (iii) A device whose read set is exactly the three inputs is in mode (I) (identification) unless its step is an inequality; uniqueness theorems give none (rows L2, P6; Statement O line 11).
- (iv) Open control question, outside integer frequencies [OPEN; nothing on file]: is there a generalised Dirichlet series (Beurling-type frequencies) with an Euler product, unimodular parameters and zeta's functional equation, other than finite modifications of T-NR type? Uniqueness theorems of Bochner-Chandrasekharan type restrict the frequency sets (RECALLED, not opened). If one exists with off-line zeros it would be a control for RS-3 that no one-input-drop gives; if none exists, 'integer frequencies' is not an independent input either. This is a literature item for the repair slot, not a lane.

## 4. Task 4: closed device row for central-value squares

**Device.** `central-value-squares`: positivity of a central value obtained as a square or a height (Waldspurger: abs(toric period)^2 = c L(1/2, pi_K x Omega); Gross-Zagier: L'(1/2, f_K) = c times a Neron-Tate height; quantum variance: the variance form is diagonal on Hecke forms with eigenvalue c L(1/2, phi)). Read set: an automorphic object attached to the target (RS-2), a twist that is self-dual (or conjugate self-dual with trivial restriction), the centre of its functional equation. The three theorems are RECALLED, not opened.

**Lemma W1 [PROVED].** The character n -> n^(-it) is real-valued at every prime only for t = 0. Hence for t != 0 the twist of zeta (or of any self-dual pi) by abs(.)^(it) is not self-dual: its contragredient is the twist by abs(.)^(-it). Proof: p^(-it) real for p = 2, 3 gives t log 2 = pi m and t log 3 = pi n with integers m, n; if t != 0 then m, n != 0 and 2^n = 3^m, impossible. QED

**Lemma W2 [PROVED].** The self-dual object that contains zeta at height t is abs(.)^(it) + abs(.)^(-it) (the Eisenstein parameter), with L-function zeta(s + it) zeta(s - it) and central value zeta(1/2 + it) zeta(1/2 - it) = abs(zeta(1/2 + it))^2. For every Dirichlet series or kernel transform F with F(conj s) = conj F(s), the same form is F(1/2 + it) F(1/2 - it) = abs(F(1/2 + it))^2 >= 0. It vanishes exactly at zeros on the line and gives no condition on a zero at beta + it, beta != 1/2. QED

**Where it stops.** (a) At the centre the theorems give a sign at height 0 for each self-dual twist: one real point per twist, no window, no height (R2 fails). Non-negativity does not exclude a zero at the centre, and for zeta the centre is not in question. (b) At height t the hypothesis of each theorem (self-duality) fails by Lemma W1; the form that remains is the modulus squared of Lemma W2 (for the toric period of the Eisenstein series: abs(zeta(1/2 + it) L(1/2 + it, chi_d))^2 by Hecke's formula, RECALLED). (c) In mixed forms (Rankin-Selberg unfolding of abs(E_t)^2 against a cusp form) the output is L(1/2, phi) L(1/2 + 2it, phi) up to a positive factor (RECALLED): a central value times a value at height 2t that carries no sign. (d) Averages of central values over a family are mean values (device `mean-value-convexity`; MV-CAP).

**Controls.** The form at height t is non-negative for every control with real coefficients or real kernel: DH, HEAT, E_a, T-NR, THIN and DEL (where continued), the Liouville twist; for U with complex chi the hermitian form abs(F)^2 is. The window translate WT names the structural step: the device at height alpha of zeta is the device at the centre of zeta(s + i alpha), whose twist is not self-dual (Lemma W1), so the theorem does not apply to it. EIS-w: the Eisenstein series off resonance carries the same square identity. No control fails any step; no step uses multiplicativity beyond the factorisation of the period.

**Row text proposed for the map (section 3.2; next id G32; not applied).**
| G32 | Central-value squares as a positivity device (Waldspurger, Gross-Zagier, quantum variance) | Positivity holds at the centre of a self-dual twist. A twist by n^(-it) is self-dual only for t = 0 (two primes suffice). The self-dual object containing zeta at height t has central value abs(zeta(1/2 + it))^2: a modulus squared, non-negative for every function with real coefficients, zero only at zeros on the line. Mixed forms give L(1/2, phi) L(1/2 + 2it, phi), no sign at height. Families give mean values (MV-CAP). | PROVED (two lemmas, elementary); the three theorems RECALLED, not opened; ARGUED for the mixed forms | DH, HEAT, E_a, T-NR, U, WT, THIN, DEL, EIS-w pass the form at height t; WT names the failing hypothesis (self-duality) | `c11-del-device-read-confirm` section 4 |

**Entry proposed for devices.json (through `mk_devices.py`; not applied).** id `central-value-squares`, state `closed`, name 'Central-value squares (Waldspurger, Gross-Zagier, quantum variance): positivity at the centre of a self-dual twist', evidence 'c11-del-device-read-confirm section 4 (Lemmas W1, W2 proved; theorems recalled): no condition at height t; the form at height is a modulus squared; every control passes', nodes [].

Not covered by the row: a positivity at the centre of a self-dual object of higher degree in which zeta at height t appears as one factor and the other factors have a known sign and no zeros at the centre (the Rankin-Selberg example in (c) is of this shape and has no sign); p-adic or derivative variants of higher order.

## 5. Statement O

Checked against the corrected table; no line of Statement O changes its control. Line 5 (Euler product + Lambda >= 0 + pole, without FE): DEL stands as the control (c10), with one precision from Lemma J and cell (a): the line's read set must not include the residue normalisation or the logarithmic counting discrepancy; with either, the control is E_a (line 3) or the read set is an identification (line 11). Section C row 2a cites P36 for B: it should cite P46 and P51 for 'B, THIN, U (no FE)' and move P36 to row 3 (E_a). Not applied here; the repair lane of this round owns that file.

## 6. Controls on this lane's own statements

This lane proposes no mechanism for zeta, so there is no control run against an attack. Checks made:

| statement | check |
|---|---|
| Lemma J | for the finite modification a(q) = 0 the residue is 1 - 1/q, equal to the bound; for THIN (a(p) = -1 on S) the residue prod (p - 1)/(p + 1) is below (1 - 1/p_0)/(1 + 1/p_0); for U = n^(-i alpha) the limit of (s - 1) zeta(s + i alpha) is 0. All consistent |
| Lemma W1 | 2^n = 3^m has no solution in non-zero integers |
| Lemma W2 | DH has real coefficients (1, xi, -xi, -1, 0 mod 5): the form is abs(F)^2 and vanishes at its on-line zeros only, while DH has off-line zeros (map section 2): the form does not see them |
| table | `mk_device_read_v2.py` asserts ids and order against devices.json; counts in `counts_v2.json`: PF 6, PP 5, T 2, O 1, NF 19, FAIL 1; c10 first-code tally 14 / 20 reproduced |

## 7. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 | false | no argument about zeta; Lemma J and Lemmas W1, W2 are about controls and a device row |
| R2 | false | no conclusion in windows or uniform in height |
| R3 | false | no device that fails for the controls; the lane assigns controls to closed devices |
| R4 | false | no passage to the critical line; none attempted |

aboutZeros = false.

## 8. Three weakest steps

1. **The table is argued from rows, and six cells from lane text.** No device lane was replayed against DEL. The cell 'not established' for `dual-measure-compactness` rests on the absence of a proof that DEL's counting discrepancy is O(log Y); neither that bound nor a lower bound is proved, so the cell could become P or FAIL. The PF cell for `sum-product-vinogradov` is an argument about slack, and the PF cell for `positive-term-sum-rule` extends row Q27 from THIN and FM to DEL without a run.
2. **Item 3 is relative to two sources not opened here.** Hamburger's theorem is quoted in a recalled form (hypotheses on poles and order as stated above); Kaczorowski-Perelli is recalled, with the statement for the extended class from memory. The open question (iv) on generalised frequencies is stated without a literature check.
3. **The central-value row quotes three theorems from memory.** Lemmas W1 and W2 are proved and elementary; the description of what Waldspurger, Gross-Zagier and the quantum-variance results read, Hecke's period formula and the Rankin-Selberg unfolding are RECALLED. The 'not covered' clause (a higher-degree self-dual object with zeta at height t as one factor) is not excluded by any lemma here.

Also weak: 'no control passes every step' for the Landau-Siegel device rests on one lane (Lean tree read as text, not compiled; DH and Beurling cells argued).

## Files

`RESULT.md`, `DEVICE_READ_V2.md`, `REFEREE.md`, `mk_device_read_v2.py`, `table_v2.md`, `counts_v2.json`, `lanes_line.json`.
