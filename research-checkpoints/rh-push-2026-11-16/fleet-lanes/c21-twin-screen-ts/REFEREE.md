# REFEREE (second pass, same session): c21-twin-screen-ts

Date 2026-11-20. **This pass is not independent.** It was written in the session that wrote `TWIN_SCREEN.md`
and `RESULT.md`; the lane had no means of starting a separate referee agent. It counts as referees = 0
(STRATEGY section 1). An independent referee is owed. What this pass did: drew a sample of 10 rows by a fixed
rule before looking at them again, opened for each a source that had not been used when the row was written
(map rows in full width, node statements), re-derived the row, and re-derived Lemma TS-1. No numerics.

**Verdict of this pass: holds as a filter, with corrections C1 to C8 (all entered in `TWIN_SCREEN.md`).** No
verdict column changed; 7 of the 10 sampled rows changed in closing row, scope or wording. No statement about
zeros of zeta. Flags: R1 false, R2 false, R3 false, R4 false.

## 1. Sample

Rule: Python `random.Random(2026112021)`; 6 of the 56 device rows, 1 of 6 pending items, 2 of the statistic
classes (drawn from 1..13 before class s14 was added), 1 of 10 geometric objects. Draw: devices 11, 15, 21,
29, 32, 37; pending p2; classes s10, s13; geometric object 4 (antibridge).

| row | source opened for the pass | re-derivation | result |
|---|---|---|---|
| 11 geometric-positivity | map rows T3, P38 in full; nodes `spec-z-squared-hodge-index`, `heegner-height-upper-bound-h4prime`, `heegner-nb-ratio` | No coefficient stage (the Heegner ratio is an infimum over a family of amplitudes); no window pairing; T3 says no object counted by Q_L is known (ARGUED, unrefereed); P38 and the node say the brackets are of DH type with off-line zeros and the needed infimum is not known under RH | verdict none confirmed; closing kind changed from T to "no object / measured" (C1) |
| 15 finite-support-positivity | map rows P9, P10, P18, P21, P22 in full; seven node statements | P9: tests on [0, T), stage e^T, reason 2. P3, P21, Schwarzian stage: finite orders, reason 3. P18: node set {4^k} is unbounded, so R3-C does not apply; P18 has its own control. P2 is a refuted margin (kind X), P10 the target (kind T), P22 passed by kappa_sharp (kind F) | verdict 2 and 3 confirmed for the named parts; row rewritten as a composite with the range caveat (C2) |
| 21 padic-special-values | node `padic-interpolation-reads-nonpositive-integers` | Reads zeta(1 - k), k >= 1, equivalently zeta(2k) right of 1; the interpolation twin passes unchanged. No stage in the sense of R2-S | confirmed, no change |
| 29 function-field-order2-vertex | device evidence in full; node `ff-order2-vertex-probe` | Model in F_q[T]; closed because the low input and the completed-row law fail in exact arithmetic. Rows Z30, Z31 are cited by device 27, not by this device | verdict none confirmed; closing row corrected, DH column reworded (C3) |
| 32 positive-term-sum-rule | map row Q27 in wider cut | Forms (i), (ii) are Jensen's count and the density identity; form (iii): a stage functional continuous in the phases has the same distribution for every unimodular chain. That is K1 (rotation invariance), with R2-S applying in addition | verdict confirmed; note on the reason for the stage functionals added (C4) |
| 37 de-branges-positivity-family | device evidence in full; node | Restatement of T3, G6 or false for zeta at a named step; the falsity is MEASURED, not interval-certified; a lattice passes | confirmed; label MEASURED added (C5) |
| p2 rank-2 Gram | map row D10 in wider cut | Lemma R gives no condition on zeros right of 1/2; passing is MEASURED; no finite coefficient stage (the parameter T is a truncation height of the Eisenstein series) | confirmed, no change |
| s10 kernel shape | lines 13, 15, 16, 97, 99, 101 to 104 of screened.jsonl | All nine carry "kernel-blind", "flow-stable" or "not a class property". Lines 101 and 103 carry in addition an onset clause of class s5 or s6 | confirmed; lines 101, 103 belong to two classes (noted here, C6) |
| s13 sign or pole statistic | lines 49, 52, 90, 126, 153, 156, 159 | Lines 49, 52, 90, 126, 153, 156 read the pole at 1, the sign of a(n) or a gamma-factor mismatch. Line 159 ("restates the full-form onset; empty for objects without a pole") is class s5 and was listed in both | line 159 removed from s13 (C6) |
| antibridge (geometric 4) | map rows G1, P58 in full | G1: symmetrisation is a block congruence, -P <= B <= P is RH on each interval, DH satisfies every identity. P58 names the antibridge Hankel block as a carrier of the band form; Corollary S' bounds that block against a window. Device 45 is a twist reciprocity, not a Hecke relation | verdict confirmed; the join label for device 45 corrected (C7) |

## 2. Lemma TS-1

- (i) Re-derived twice (direct induction; Moebius inversion). Correct. It is one line and does not use the
  functional equation. It contains K3-M (a) as the case of one modified prime.
- (ii) The dichotomy is a rewording of Theorem A: "(Lc_p) for all p and sum delta_p finite implies G = zeta".
  Checked that the functional-equation hypothesis used here (meromorphic identity near the line) gives the
  boundary form (FE) of Theorem A under (H) (Theorem A (ii)). Correct. The sentence "a T2 twin is modified at
  infinitely many primes" is immediate.
- (iii) Checked from the roots: HQ1 has F/zeta = ((1 - y)^2 + eps y)/(1 - y)^2 with roots of y^2 + (eps - 2) y + 1
  on abs(y) = 1 for 0 < eps <= 4 and real negative, one inside the unit disc, for eps > 4; so n_q = zeta/F local
  has a pole in the closed disc. Agrees with referee R-4 of the euler-shape lane.
- **C8 (T-NR).** The first draft said "T-NR is in T1 with conductor q". T-NR has a different functional
  equation (conductor q), so it is outside the class of the lemma. Reworded in the screen: invisible at stage
  P up to the shift of Gamma_c by log q, local factor of the same kind.
- (iv) is a citation with the wording of referee E1 of the euler-shape lane ("no off-line zero of its own"),
  not "no off-line zero". Correct as cited.

## 3. Attacks on the classification as a whole

- Is "10 of 56" stable under the reading of reason 2? If reason 2 is read as "reads only finitely many
  coefficients at each use", rows 3 (compact-support explicit formula) and 32 (stage functionals) would move
  from "in part" to covered, giving 12. If reason 3 is read as "passed by DH itself", rows 23, 45, 46, 48 and
  others would move. The screen uses the strict statements R2-S, R3-E, R3-C; the count depends on that choice
  and the screen says so.
- Rows 6 (dual-measure-compactness) and 13 (section-extraction) carry verdict 2 from the row text only
  (finite scale x; finite prime set). Neither lane was opened. If the stage in row 6 is not a coefficient
  stage, the row falls back to its closing row P36. Marked TYPED in the screen.
- Row 4: "finite ladder steps = finite Pick orders" is taken from rows P3, P7. The Harnack transport part of
  the device is not a Pick order; it is closed by the direct attempts of 2026-11-01, which this pass did not
  open.
- Reason 1 remark: the estimate of Proposition M uses only P^(1/2) log t = o(t). This is a reading of the
  proof, not in either referee file of the U4 lane; verdicts use theta' < 1 as in the source.
- The statement in RESULT.md that the launch rule is insufficient is a count over closed device types, not a
  statement about future candidates.

## 4. Flags and surviving claim

R1 false, R2 false, R3 false, R4 false. aboutZeros false.

Surviving claim: a screen of 92 rows in which the three round-20 reasons, read strictly, cover 10 of the 56
device types and 4 of 14 statistic classes, every other device type has a closing row of another kind on
file, and no displayed object escapes both. Lemma TS-1: stage invisibility is the condition a(n) = 1 for
n < P; Euler-product twins with zeta's functional equation are local twins (one local factor fails the local
clause) or lie in the boundary regime with divergent sum delta_p, where no member is known. Not independently
refereed; 37 device rows typed from summaries.

---

# Independent referee pass (lens: general), 2026-11-20

Written by a different agent from the lane author. The text above this line is the lane's own second pass and
is left unchanged. Scope: `RESULT.md`, `TWIN_SCREEN.md`, the four round-20 source lanes (RESULT and REFEREE
files), `engine/curated/devices.json`, `campaign/screened.jsonl`, map rows P9, P36, P39, P40, P58, Q12, Q19,
Q21, Q22, S11, Z34 (all read as text). One local run under `scripts/memcap.sh 8` (exact rationals and mpmath
at 30 digits, under 5 s; scratch script `/tmp/c21ts-ref/chk.py`, not part of the lane). Server not used.

## I-1. Verdict

**Holds as a filter (partial-result, score 0), with corrections J1 to J7.** The one PROVED step (Lemma TS-1
(i)) was re-derived and confirmed, and the PROVED-rel parts match the cited statements. No statement about
zeros of zeta is made and none follows. RH is not assumed anywhere; nothing restates verified height. The
count "10 of 56" does not survive as a fixed number (J1, J2, J3): by the screen's own strict statements it is
7 device types covered in full and 5 in part, out of 56 typed rows, and the device file now has 58 entries.
The qualitative conclusion (the three reasons cover a minority of the closed device types, so they are not a
sufficient launch filter) is unaffected and is strengthened. Flags set by this referee: R1 = false,
R2 = false, R3 = false, R4 = false. Independent referees after this pass: 1.

## I-2. PROVED and PROVED-rel steps re-derived

| step | result |
|---|---|
| TS-1 (i), a_G(n) = 1 for n < P iff c(n) = 0 for 2 <= n < P | From 1 = sum_{d \| n} a_G(d) c(n/d): both directions by induction on n (the n-th equation contains a_G(n) c(1) + a_G(1) c(n) plus terms with indices in [2, n/2]). Confirmed. No functional equation, no Euler product |
| TS-1 (i), prime-power form | c multiplicative; forward direction is the case n = p^k; backward: every n in [2, P) has a prime-power component p^k < P with k >= 1, so c(n) = 0. Confirmed. Convention needed: j_p = infinity when n_p = 1 (the text says "the first non-constant term of n_p is y^(j_p)" for every prime, which has no meaning at an unmodified prime) |
| TS-1 (i), Lambda_G(n) = Lambda(n) for n < P | triangular recursion; confirmed |
| TS-1 (ii) against Theorem A | (Lc_p) for all p plus sum delta_p finite is hypothesis (H); the meromorphic functional equation near the line gives (FE) by Theorem A (ii) (zeta/G symmetric, bounded on one side, so no pole on the line). The partition into T1 and T2 is then a tautology. delta_p = 0 iff n_p = 1, so divergence forces infinitely many modified primes. Confirmed |
| TS-1 (iii), HQ1 | m = 1 + eps Y/(1 - Y)^2 is invariant under Y -> 1/Y; zeros solve Y^2 + (eps - 2) Y + 1 = 0 (product 1): on abs Y = 1 for 0 < eps <= 4, real negative with one root inside for eps > 4. In the lemma's variable y = Y q^(-1/2) the closed unit disc is abs y <= q^(-1/2). Local series 1 + eps sum k q^(k/2) q^(-ks) has no term below q. Confirmed |
| TS-1 (iii), HQ2 | Y^2 - (2 +- i sqrt(eps)) Y + 1 = 0; Y + 1/Y is not real for eps > 0, so no root on the circle. First term at q^2. Confirmed |
| TS-1 (iii), T-NR | Y + 1/Y + c is symmetric; roots of product 1, real negative off the circle for c > 2; outside the class of the lemma (conductor q). Confirmed |
| TS-1 (iv) against Theorem C | statement (a) and (b) of the source read in full; the screen's wording ("no off-line zero of its own"; "G = zeta unless G/zeta vanishes on the line" under finite order) matches. Theorem C assumes G meromorphic on C; the lemma's setting says "near the line" only (J6) |
| R2-S consequence (zero within pi/u of any height) | HQ1(q, eps > 4), q >= P: off-line zeros at heights (2k + 1) pi/log q, spacing 2 pi/log q <= 2 pi/u. Confirmed |
| R3-E | sum_{n >= 2} n^-2 = 0.6449 < 1; log F converges absolutely on Re s >= 2; b(6) = 1 + kappa^2. Confirmed, with the scope remark J2 |
| R1-S, R3-C | statements compared with Lemma S, Propositions M and C (U4 lane) and line-2 Theorems A, C; constants (t >= 43, 8 log t/t, 2.1 P^(1/2), conductor 5 prod q, the zero 0.8085171825 + 85.6993484854 i) agree. Each source has an appended independent referee section that holds; the "independent referee holds" labels of the screen are correct |

## I-3. Numeric check, cases not in the lane (the lane ran none)

| check | case | outcome |
|---|---|---|
| TS-1 (i), exact rationals, N = 400 | random n_p with first term at p^(j_p): {7: 1}; {3: 4, 11: 2}; {2: 7, 5: 3, 13: 2, 19: 1}; {2: 8, 3: 5, 17: 2} | first n with a_G(n) != 1 = first n with c(n) != 0 = min p^(j_p): 7, 81, 19, 243 |
| HQ1 | q = 11, eps = 6.5 | roots Y = -4.26556, -0.23444; at s = 1/2 - log Y/log q on the branch k = 1: Re s = -0.10494 and 1.10494, height 3 pi/log 11 = 3.93044; abs F = 4e-31, 6e-31 with abs zeta = 0.52, 0.69; defect of m(s) - m(1 - s) at s = 0.83 + 7.31 i: 4e-31; a(11) = 1 + 6.5 sqrt 11 = 22.558 |
| HQ2 | q = 5, eps = 0.3 | abs Y = 0.58598, 1.70654; Re s = 0.83209, 0.16791; abs F <= 4e-30 |
| T-NR | c = 2.7; c = -0.4 | root moduli 2.2569, 0.4431; 1, 1 |
| DH | kappa = 0.2840790438404 | b(6) = 1.0807009031 |

All agree with the screen.

## I-4. Controls

No zeta-only mechanism is claimed, so no step exists for a control to fail. The objects that carry the three
reasons (HQ1, HQ2, T-NR, DH exponential stages) were checked above to have the stated properties. The lemma
holds with any base in place of zeta (it is Dirichlet convolution and the cited identification theorem), so
R3 is false, as the lane says.

## I-5. Findings

**J1 (the device file has 58 entries, not 56).** `engine/curated/devices.json` (modified 02:29, after the
screen at 02:28) lists 58 device types: entries 57 `br2-sparse-pole-lattice-regime-k` and 58
`br3-euler-shape-rigidity-regime3`, both state "open", entered by `c21-record-engine-states-statement-o-v5-br-nodes`.
The screen has no row for them, so "no device type is left without a row" is false against the file as it
stands. Both are the T2 question of Lemma TS-1 (lead BR), which the screen names in section 6 item 1; two rows
"none; open; T2" should be added. Also stale: cell U6 (c) is "closed" in the file (the screen says "cell,
engine state owed"); node count is 1,294, not 1,291.

**J2 (row 12, reason 3 entered beyond R3-E).** R3-E is proved on Re s >= sigma_0 = 2, where F is zero-free by
absolute convergence; there it says only that log F has partial sums. The device of row 12 (Q19, Q21) is a
limit of zero-free stages inside the strip. On a domain that contains a zero of DH no sequence of zero-free
analytic functions converges locally uniformly to DH (Hurwitz; the second-referee file of Theorem D says the
same: "no zero-free normaliser on a domain containing a zero"). So in the region where the device acts, the
property "limit of zero-free stages" fails for DH and is equivalent to the zero-free statement: kind T, which
is what Q19 records ("Hurwitz + von Koch; no novelty"), with kind F for the unimodular twist U. The sentence
"Applies to an object when its defining property is (a) existence, or a limit, of zero-free finite stages" is
too wide; it should read "existence of zero-free stages, or their limit right of the abscissa of absolute
convergence". Row 12 should be "none: T (Q19), F (U; Q21); 2 at each finite stage".

**J3 (limit devices are counted unevenly).** Rows 3 and 32 are entered as "none (2 for a stated sub-form)"
and not counted. Rows 6 and 12 are entered as "2 at each finite scale / stage" with the limit step closed by
another row (P36: E_a passes every step and the cofinal limit is controlled in mean square; Q19), and are
counted. R2-S does not apply to a statement about the limit over all stages. Row 13 is entered as "2" on
"finite prime set", but its closing rows Q12 and Q22 cover infinite prime sets as well ("the non-unipotent
normalisation and infinite P give no section"; "D^inf intersected with c_0") and close the device by a proved
first-moment no-go that holds for DH: R2-S covers the finite-P form only. By the convention used for rows 3
and 32, the strict count is: covered in full 7 (rows 4, 8, 14, 15, 28, 53, 55), covered in part 5 (rows 3, 6,
12, 13, 32). The kind counts then become T 6, F 18 or M/F for row 6. The figure "10 of 56" in RESULT.md,
`lanes.jsonl` and the screen should be replaced by "7 in full and 5 in part of 56 typed rows (58 on file)".
Row 4 stays with the caveat already made by the author's pass (the Harnack part is not a Pick order).

**J4 (TS-1 (iii), one false sentence).** "Membership in T1 is a property of a single local factor; it is read
by any stage that contains enough powers of that prime". The first half is correct. The second is not:
failure of (Lc_p) is a statement about a pole or loss of continuity of n_p on the closed disc, that is about
the whole power series; no finite set of coefficients of L_p decides it (every finite stage of a T1 factor is
also the stage of a polynomial n_p, which satisfies (Lc_p)). What a stage with p^(j_p) < P reads is that the
factor is modified, not that the twin is in T1. This agrees with R2-S and with the next bullet of the screen
("a class that excludes T1 must carry a clause on every local factor"); the sentence should be cut.

**J5 (RESULT.md item 3, last sentence).** "The twins that a stage cannot see and a per-prime clause cannot
exclude are exactly the T2 class." Proved: twins that satisfy (Lc_p) at every prime are the T2 class; those
among them invisible at stage P are the T2 twins unmodified below P, a subset. And "per-prime clause" means
the clause (Lc_p) specifically; another per-prime clause (degree one with unimodular parameter, as in row 52)
cuts T2 further. Replace "exactly" by "inside".

**J6 (hypotheses of (iv)).** Theorem C assumes G meromorphic on C with zeta's functional equation; the
setting of the lemma states the functional equation "near the line". Add "G meromorphic on C" to (iv). The
split of T2 into regime (K) and regime 3 also uses a relative abscissa defined through
sup over abs y <= p^-sigma of abs(n_p - 1); for general (non-geometric) L_p that sum being finite for large
sigma is an extra assumption, not a consequence of "absolutely convergent in some half-plane".

**J7 (novelty and the record line).** Lemma TS-1 (i) is uniqueness of Dirichlet coefficients under
convolution; (ii) is a partition by the hypothesis of Theorem A (itself reflection plus Liouville, not new
against the literature: referee E4 of the euler-shape lane); (iii), (iv) are citations. The lemma is a
consolidation, as RESULT.md section 0 says; "new against the record" in section 1 and `lemmasDecided: 1` in
`lanes.jsonl` should not be read as a new mathematical statement. The HQ1 row of the twin table says "off the
line for eps > 4"; for eps < 0 the roots are real positive off the circle as well (eps = -1.5: 0.3139, 3.1861),
so the row should say "eps > 4 or eps < 0".

Not errors, recorded: the 14 statistic classes are the author's grouping; 114 of the 160 lines are listed as
examples (lines 103 and 146 in two classes), 46 lines are not assigned, so "4 of 14" is a statement about the
grouping and not a count of lines. The examples read in this pass (lines 9, 14, 22, 32, 44, 60, 70, 106, 109,
117, 120, 146, 157, 159) fit their classes; line 159 fits s5, as corrected in C6. Rows 16 to 56 remain TYPED;
this pass opened the device evidence for rows 4, 6, 12, 13, 20, 38, 44 and the map rows listed in the scope,
which is how J2 and J3 were found. At that rate the remaining typed rows may carry further changes of kind.

## I-6. Requirement flags (set by this referee)

- R1 false: no step uses multiplicativity for a statement about zeta; TS-1 (i) uses it only to pass to prime
  powers, and the lemma holds with any base.
- R2 false: no height-uniform or every-window conclusion.
- R3 false: no mechanism; nothing for a control to fail.
- R4 false: filter; no passage to the critical line.

## I-7. Surviving claim

A screen of 92 typed rows (56 device types of the earlier file state, 6 pending items, 6 cell lines, 14
author-formed statistic classes, 10 geometric objects). Read by their strict statements, the three round-20
reasons cover 7 device types in full (rows 4, 8, 14, 15, 28, 53, 55) and 5 in part (rows 3, 6, 12, 13, 32);
every other typed row has a closing row of another kind on file; two device entries added to the file since
(BR-2, BR-3, open) have no row and are the T2 question. Lemma TS-1 (i) (stage invisibility is a(n) = 1 for
n < P, equivalently no local modification at a prime power below P) is proved and elementary; Euler-product
twins with zeta's functional equation either fail the local clause at some prime (non-empty at every stage:
HQ1 to HQ4) or lie in the boundary regime with divergent sum delta_p, where existence is open, relative to
Theorems A and C of the euler-shape lane. No displayed object escapes both the reasons and the closing
kinds. Nothing about zeros of zeta; score 0.
