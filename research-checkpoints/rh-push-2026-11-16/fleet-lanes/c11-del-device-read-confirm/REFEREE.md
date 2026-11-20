# REFEREE: c11-del-device-read-confirm (author's adversarial check; NOT an independent referee)

Date 2026-11-19. Written by the lane's own agent in a second pass over the finished text. It does not count as a referee under `campaign/METRIC.md`: referees = 0, refereeHolds is not set by this file. An independent referee should replace or append to it. The server was not used. No numerics.

## Verdict of the self-check

Holds as a record lane with the corrections S1 to S5 below already applied to RESULT.md and DEVICE_READ_V2.md, and the reservations R1 to R4 left open. Flags: R1 = R2 = R3 = R4 = false. aboutZeros = false.

## 1. Re-derivations

**Count.** Recounted from `counts_v2.json` and by hand from the table: PF rows 12, 20, 22, 24, 25, 32 (6); PP rows 1, 4, 7, 13, 14 (5); T rows 18, 19 (2); O row 6 (1); FAIL row 15 (1); NF the remaining 19. Sum 34. c10 first-code tally: rows 1, 4, 6, 7, 12, 13, 14, 19, 20, 22, 24, 25, 28, 32 = 14. Moving 6, 19, 28 out gives 11. Confirmed.

**Cell 6.** Source text re-read: `e1-cofinal-legendre-dual/RESULT.md` section 6, Beurling row ('source Lemma 1.1(d), second half: the discrepancy bound K(x) = O(log x) is Stirling for N(Y) = floor(Y)') and verdict item 4 ('the separating step is Lambda_a >= 0 with logarithmic discrepancy (fails for DH, sign twists, theta^3, Beurling). E_a passes every step'). The change is supported by the lane text. The map cell is shorter than the lane text; the map was not edited.

**Cell 28.** Source text re-read: `c7-laurent-shell-gamma-section/RESULT.md` line 386. Supported.

**Cell 19.** A consistency change, not a new fact: rows P46 and P51 share the class hypothesis. A reader who counts transferred proofs as passes gets 13 / 21; both figures are in the file.

**Lemma J.** For real s > 1 and abs(a) <= 1: abs(1 - a p^-s) >= 1 - abs(a) p^-s >= 1 - p^-s > 0, so each factor (1 - p^-s)/(1 - a(p) p^-s) has modulus <= 1 and the product over p != p_0 is bounded by 1 (absolutely convergent product for s > 1). (s - 1) zeta(s) -> 1. The factor at p_0 tends to (1 - 1/p_0)/(1 - a(p_0)/p_0), modulus < 1 unless a(p_0) = 1 (equality in abs(1 - a/p_0) >= 1 - 1/p_0 needs abs(a) = 1 and a/p_0 positive real). Confirmed. The lemma bounds a limsup; it does not assert that the residue exists.

**Line for P46 with abs(chi(p)) <= 1.** log F = sum_p sum_k chi(p)^k p^(-ks)/k; log F + log conj-coefficient F - 2 log zeta = sum (2 Re chi(p)^k - 2) p^(-ks)/k. Coefficients of A: (1 - Re chi(p)^k)/k >= 0 since abs(chi(p)^k) <= 1. Confirmed. Only this step of row P46 was checked, not the rest of the lane's Theorem 1.

**Twisted sums of DEL.** sum_{n<=x} a(n) e(cn/q) = sum_d g(d) sum_{m <= x/d} e(cdm/q); the inner sum is floor(x/d) if q divides d (for (c, q) = 1) and is O(q) otherwise. Main term x sum_{q | d} g(d)/d + O(sum_{d<=x} abs(g(d))) + O(q sum_{d<=x} abs(g(d))). With sum_{d<=x} abs(g(d)) = O(x^(b+eps)) and the tail sum_{d > x, q | d} abs(g(d))/d = O(x^(b-1+eps)). Confirmed.

**Lemma W1.** p^(-it) real iff t log p in pi Z. For p = 2, 3 and t != 0: log 2/log 3 = m/n, 2^n = 3^m. Impossible for non-zero integers (parity). Confirmed.

**Lemma W2.** F(conj s) = conj F(s) gives F(1/2 - it) = conj F(1/2 + it). Trivial. The content of the row is Lemma W1 plus the remark that the hypothesis of each theorem is self-duality.

## 2. Corrections applied during the check

- S1. First draft counted `helson-discrepancy` as a pass by extension of the class. Changed to code T for both discrepancy devices, with the alternative count stated.
- S2. First draft coded `sum-product-vinogradov` as failing, from the lane's Q1 sentence on TW+. That sentence concerns arbitrary eps_n; for thin deletion the loss is x^(b-1+eps). Kept as PF, labelled ARGUED.
- S3. `dual-measure-compactness` is coded 'not established', not 'fails': no lower bound for the counting discrepancy of DEL is available (F is analytic at b; Landau gives nothing).
- S4. The claim 'FE with integer frequencies implies PER' is stated relative to Kaczorowski-Perelli. For the extended class the coefficients are finite combinations of sequences chi*(n/d) 1[d | n] n^(-i theta), which are periodic times n^(-i theta); this uses the recalled form of the theorem (Dirichlet-polynomial coefficients supported on divisors of the conductor) and is not checked against the paper.
- S5. The decisive list is stated literally: three devices have no passing control. The reading 'empty for the purpose of section 4.0 (c)' is given as a reading, with the reasons.

## 3. Reservations (not resolved)

- R1. Thirty-one of 34 cells agree with c10, and both tables are argued from the same record. Agreement of two argued readings is not a replay. The cells most exposed: 1, 4, 7 (statements 'right of b by transfer'), 32 (Q27 extended to DEL), 24.
- R2. 'No control passes every step' for `landau-siegel-mechanism` is taken from one lane whose DH and Beurling cells are argued and whose source is a Lean tree read as text.
- R3. Section 3 does not open Hamburger or Kaczorowski-Perelli. The recalled hypotheses of Hamburger's theorem (finitely many poles, finite order, both sides ordinary Dirichlet series) should be confirmed by the repair slot before the sentence enters STRATEGY.
- R4. Section 4 quotes Waldspurger, Gross-Zagier, Luo-Sarnak / Zhao and Hecke's period formula from memory. The row is safe in its proved part (W1, W2). The 'not covered' clause is a real gap in the closure: a self-dual object of higher degree having zeta at height t as a factor, with the cofactors of known sign, is not excluded.

## 4. Novelty and scope

Nothing here is new mathematics. Lemma J is a one-line bound; W1 and W2 are elementary; item 3 is a reading of two classical theorems. The lane's output is the corrected table, the control-by-row list, the narrowing of section 4.0 (c), the addition of T-NR to the RS-3 screen, and one device row.

## 5. Flags

| flag | value | reason |
|---|---|---|
| R1 | false | no argument about zeta |
| R2 | false | no window or height statement |
| R3 | false | record of controls, no device failing for them |
| R4 | false | none attempted |

---

# REFEREE (independent, lens: general), appended 2026-11-19

Independent pass by a separate agent. The author's self-check above is kept unchanged. Server not used. One local run through `scripts/memcap.sh 8` (script outside the repo, about 20 MB).

## Verdict

**Holds as a record lane, with the corrections E1 to E7 below.** Every step labelled PROVED was re-derived and is confirmed. No step assumes RH, none restates verified height, no known theorem is presented as new (the lane says its lemmas are elementary and that Hamburger and Kaczorowski-Perelli are recalled). No statement about zeros of zeta is made. Flags: R1 = R2 = R3 = R4 = false.

## 1. PROVED steps re-derived

- **Lemma J.** For real s > 1 and abs(a(p)) <= 1: abs(1 - a(p) p^-s) >= 1 - p^-s > 0, so each factor of F/zeta has modulus <= 1; the product converges absolutely; keeping the factor at p_0 and using (s - 1) zeta(s) -> 1 gives the bound; strictness for a(p_0) != 1 since equality needs a(p_0)/p_0 = 1/p_0. Confirmed.
- **P46 line.** log(F F*/zeta^2) = sum_p sum_k (chi(p)^k + conj chi(p)^k - 2) p^(-ks)/k = -2 sum (1 - Re chi(p)^k) p^(-ks)/k, coefficients >= 0 for abs(chi(p)) <= 1. Confirmed (this one step only, as the author says).
- **P51 transferred form.** a = 1 * g with g = mu on squarefree S-integers (c10 Lemma 1 (v)); inner sum over m is floor(x/d) when q divides d and at most q/2 in modulus otherwise ((c, q) = 1). Confirmed.
- **Lemma W1.** t log 2 = pi m, t log 3 = pi n, t != 0 gives m, n of the same sign and 2^n = 3^m. Impossible. Confirmed for the GL(1) statement.
- **Lemma W2.** Reflection principle. Confirmed.
- **T-NR zero locus** (used in section 3 (ii)): 2 cosh((s - 1/2) log q) = -c with real abs(c) > 2 gives Re s = 1/2 +- arccosh(abs(c)/2)/log q. Confirmed; agrees with map row G21.

## 2. Numeric check with a different case

The lane has no numerics of its own; its section 6 checks three special cases of Lemma J by hand. Different case run here:
- Lemma J with random complex a(p), abs(a(p)) < 1 on 2 percent of the primes p <= 2e6, a(p) = 1 elsewhere (first modified prime p_0 = 587): abs(F/zeta) restricted to p <= 2e6 is 0.99967, 0.99149, 0.98081, 0.97914 at s = 1.5, 1.1, 1.01, 1.001; the single-factor bound at p_0 is 0.99991, 0.99884, 0.99795, 0.99783 (limit 0.99781). Maximum factor modulus 1.0. Consistent.
- P51 transferred form for a random deletion set S (density t^(b-1), b = 0.8, x = 1e6, 6303 primes): q in S: q = 2, 3, 5 give abs(sum - main term) = 2512, 1257, 736 against x^b = 63096; q = 11 not in S: abs(sum) = 39, main term 0. Count 138864 against G(1) x = 141376. Consistent with main term x sum_{q | d} g(d)/d and error O(q x^(b+eps)).
- Table recount from `DEVICE_READ_V2.md` text: 34 rows; PF 6, PP 5, T 2, O 1, NF 19, FAIL 1; c10 first-code P = 14. Confirmed.

## 3. Sources of the three changed cells, opened

- Cell 6: `e1-cofinal-legendre-dual/RESULT.md` section 4 (class C: abs(T_b(Y) - a Y log Y - c Y) <= kappa (1 + log Y)), section 6 Beurling row, verdict item 4. For a control sequence a(n) the sawtooth at the true point is sum_{m <= Y} a(m) log m = A(Y) log Y - int A(u)/u du, so membership in the class is a bound on the counting error E(Y) = A(Y) - G(1) Y, as the lane reads it. For DEL only O(Y^(b+eps)) is proved. 'Not established' is the right code. Supported.
- Cell 28: `c7-laurent-shell-gamma-section/RESULT.md` line 386. Supported.
- Cell 19: consistency with cell 18 (rows P46 and P51 share the unimodular class). Supported.
- `c7-landau-siegel-device-read` section 5 and STRATEGY section 4.0 (c), (d): quoted correctly.

## 4. Errors and overstatements

- **E1 (count, PF cell 24).** Map row D2 says in its text 'Fails ... for sign twists and THIN at the interval-sum step' and in its control cell 'none passes'. The code PF is defined as 'every statement of the cited rows holds for DEL'. The cell rests on the author's slack argument (relative loss x^(b-1+eps) below the Vinogradov saving), which is ARGUED and plausible (splitting d <= N^(1-delta) and using the trivial bound on the rest gives a power loss), but it contradicts the literal row. The figure '6 in full' is therefore 5 established from rows plus 1 argued against the row's own control cell. Honest statement: 10 or 11 pass (5 or 6 full, 5 partial) / 23 or 24. Cell 32 (Q27 names THIN and FM, not DEL) is likewise an extension, as the author states.
- **E2 ('only three devices have none').** The lane's own table says of `effective-order-two`: 'No single control passes a complete argument because none exists' (parts coefficient-blind, remainder circular), and `vector-specific-row-mean-square` is closed by a hypothesis of zero-free type, with controls only at the diagonal statement. So the list of devices without a control passing every step is three plus the devices closed by circularity. The conclusion drawn for section 4.0 (c) is not affected: all of these read PER, none omits both FE and PER.
- **E3 ('by map row').** The claim line says each non-passing device gets a passing control by map row. For rows 28, 29 and 34 the source is lane text (map rows owed or absent), and rows 3, 8, 23 rest on 'inferred' or 'argued' cells of the map. The author states this in the table; the summary sentence overstates it.
- **E4 (Lemma J, consequence).** Lemma J is proved for completely multiplicative a. The consequence is stated for the classes TW+, TW-, U; TW+ is defined by Lambda(n) -> eps_n Lambda(n), which need not be completely multiplicative. The statement extends in one line (not in the text): abs(F/zeta)(s) = exp(-sum Re(1 - eps_n) Lambda(n) n^-s/log n) <= exp(-Re(1 - eps_{n_0}) Lambda(n_0) n_0^-s/log n_0) < 1 uniformly near s = 1 when eps_{n_0} != 1. For DEL, THIN, FM the lemma applies as written.
- **E5 (wording in the Lemma J paragraph).** 'zeta(s)(1 - q^-s) has ... zeros on Re s = 0 only ... no zero in the strip' is false as written: it has every zero of zeta. Intended: it adds no zero in 0 < Re s < 1. 'Equivalently sum a(n) = Y + o(Y)': only the Abelian direction (mean value 1 implies residue 1) is elementary and only that direction is used; the converse is a Tauberian statement (Wirsing / Halasz type) not cited.
- **E6 (verdict item 4, 'In degree one the functional equation with integer frequencies implies periodicity').** As stated without qualifier it is false: zeta(s + i theta) has a degree-one functional equation and coefficients n^(-i theta), not periodic. The body (section 3, consequence 2) has the correct form 'periodic up to a height translate', relative to Kaczorowski-Perelli (recalled; for the extended class the statement rests on the recalled shape of the Dirichlet-polynomial coefficients). The summary and the lesson line of `lanes_line.json` should carry the qualifier. Hamburger's theorem as recalled (absolute convergence in a half-plane, (s - 1) F entire of finite order, both sides ordinary Dirichlet series) is the classical statement; I checked it against the theta-group argument (weight 1/2, period 2 on both sides forces theta_3) and found no discrepancy, but the source was not opened by me either.
- **E7 (Lemma W1, 'or of any self-dual pi').** The proof given covers GL(1) (real values at the primes 2 and 3). For a self-dual unitary cuspidal pi on GL(n) the claim pi x abs^(it) not self-dual for t != 0 is true by comparing central characters (omega abs^(2int) = omega forces t = 0), but that argument is not in the text. Label for that clause: not proved here.

Not errors, noted: the 'not covered' clause of the central-value row (higher-degree self-dual object with zeta at height t as a factor) is an open gap in the closure, stated by the author; the Landau-Siegel 'no control passes' rests on one lane with argued DH and Beurling cells, stated by the author.

## 5. Controls

No zeta-only mechanism is claimed, so there is no control to run against an attack. The one place where a separation is asserted (Lemma J: residue 1 singles out zeta in the class abs(a(p)) <= 1) is an identification and is confirmed with E4. Lemma W2 was checked against the statement that every control with real coefficients passes: immediate.

## 6. Flags (set by this referee)

| flag | value | reason |
|---|---|---|
| R1 | false | no argument about zeta; multiplicativity appears only in lemmas about controls |
| R2 | false | no window or height-uniform conclusion |
| R3 | false | no device that fails for the controls; the central-value row is passed by every control |
| R4 | false | none attempted |

holds = true (record lane; PROVED steps confirmed; E1 to E7 are corrections of count, wording and scope, none reverses the conclusion that section 4.0 (c) stands with the Lemma J narrowing and that the round-12 allocation is unchanged).
