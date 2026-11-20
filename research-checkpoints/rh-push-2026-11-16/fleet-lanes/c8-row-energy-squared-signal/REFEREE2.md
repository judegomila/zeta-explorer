# REFEREE2: c8-row-energy-squared-signal (lens: exact computation and controls)

2026-11-18. Object: `RESULT.md` of this directory with `recheck.py`, `compare.py`, `recheck.jsonl`, `compare.log`.
Only this file was written. Scratch scripts: `/tmp/ref_c8b/ref.py`, `ref2.py`, `tp.py`, `tab.py` (not in the repository).
All runs local, single process, through `scripts/memcap.sh 8`; longest run 15 s.

**Verdict: holds with corrections.** The F_q[T] identities (energy = squared signal + remainder, signal law,
orthogonality and norms of c_k, diagonal formula, sign of E - D - S on the stated cases) are reproduced exactly by
independent code, on the note's cases and on 9 coherent cases the note did not run. Every number of the section 3
table agrees with `recheck.jsonl` and `compare.log`. Corrections E1 to E8 concern the description of the random-mark
control, one leading-order estimate, two readings that depend on the choice of targets, and wording. The Z[omega]
statements (section 4, 5) were not recomputed; they are outside this lens.

## 1. What was recomputed

Own code, definitions from section 2 of `c7-ff-order2-vertex-exact/RESULT.md` only. `recheck.py` and the c7 code were
read as text and not imported. Differences of method from `recheck.py`:

| ingredient | `recheck.py` | referee script |
|---|---|---|
| Res(c, x) | determinant of the multiplication map on F_q[T]/(c) | Euclidean algorithm with sign and leading-coefficient bookkeeping |
| ring | Z[x]/(x^42 - 1), reduced by division by Phi_42 | Z[C_6 x C_7], reduced to a 12-dimensional basis by zeta_6^3 = -1, zeta_6^2 = zeta_6 - 1, Sum_b zeta_7^b = 0 |
| e(mx/c) | coefficient of T^(k-1) of (mx mod c) | Laurent expansion of 1/c in 1/T applied to the unreduced product |
| factorisation | set of all products | smallest-prime-factor sieve |
| coprime count in S_cop | resultant != 0 | polynomial gcd |
| diagonal D | Sum |W|^2 |g_3|^2 phi(B) / q^N' | direct count of rows m with chi_B(m) != 0, compared with q^d Sum |W|^2 q^N' phi(B)/|B| (phi from the factorisation) |
| extra | | residual vector tested orthogonal to every conj(c_k) |

Irreducibility of the targets at q = 7 (no root in F_7; cubic): T^3 + 2, T^3 + T + 1, T^3 + 3 (new target "c";
-3 = 4 is not a cube mod 7).

Checks in every run: (i) E = Sum_k |J_k|^2/||c_k||^2 + Rem with Rem the squared norm of the residual vector;
(ii) |J|^2 = wt^2 q^(2d) |S_cop|^2 at r = 0; (iii) Gram matrix of c_0..c_(d/2) diagonal, ||c_0||^2 = q^d,
||c_k||^2 = q^(d+2k)(1 - 1/q); (iv) D by direct count = D by formula; J(k') = 0 for the other k'. All passed in all
36 runs below (21 with every quantity a rational integer or Fraction; 15 with marks or weights outside Q(zeta_6),
where the identities were tested as equalities in the ring and sizes are printed as floats).

### 1a. Coherent marks, cases the note did not run (exact)

| target | N | lam | d | k | E | S | Rem | S/D | Rem/D | (E-D-S)/D | S_cop | check |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| c | 2 | 1 | 4 | 2 | 282357600 | 129233286 | 153124314 | 0.637311 (2873/4508) | 0.755130 | -0.2449 | -3978 | all pass |
| c | 1 | 2 | 4 | 2 | 209297571 | 302706075/2 | 115889067/2 | 1.488981 (42025/28224) | 0.570047 | -0.4300 | -4305 | all pass |
| c | 1 | 2 | 3 | 1 | 31333050 | 22689450 | 8643600 | 1.562500 (25/16) | 0.595238 | -0.4048 | 630 (abs) | all pass |
| c | 2 | 1 | 3 | 1 | 40260654 | 17799642 | 22461012 | 0.614450 | 0.775362 | -0.2246 | 558 (abs) | all pass |
| c | 3 | 0 | 4 | 2 | 226688014 | 246961225/6 | 1113166859/6 | 0.195121 | 0.879499 | -0.1205 | 2245 (abs) | all pass |
| c | 3 | 1 | 4 | 1 | 10168021311 | 1050197400 | 9117823911 | 0.104481 (450/4307) | 0.907106 | -0.0929 | -1620 | all pass; J(2) = 0 at r = 1 |
| b | 2 | 1 | 4 | 2 | 146643476 | 4786418/3 | 435144010/3 | 0.009892 | 0.899302 | -0.1007 | -442 | all pass |
| b | 1 | 2 | 4 | 2 | 113295987 | 108974187/2 | 117617787/2 | 0.536033 | 0.578550 | -0.4214 | 2583 (abs) | all pass |
| dh = nu_a + nu_b | 2 | 1 | 4 | 2 | 241934364 | 19145672/3 | 706657420/3 | 0.024224 | 0.894083 | -0.1059 | 884 (abs) | all pass |

Comparison with stored data (`blocks_q7_d4.jsonl`, read as data): (b, 2, 1, 4, k = 2): stored nr2 = 146643476,
J2 = 7883642077948, nc2 = 4941258, S_cop = -442, row_excess_over_diag = -0.090806, bessel_over_diag = 0.009891976:
equal to the referee values (E/D - 1 = -0.090806). (b, 1, 2, 4): stored 113295987, 269234786653623, 2583: equal.
(dh, 2, 1, 4): stored 241934364, 31534568311792, 884: equal.

### 1b. Rows of the note reproduced (exact)

(a, 1, 2, 4): 65295195, 12108243/2, 118482147/2, |J|^2 = 29914976294847, S_cop = -861. (a, 2, 1, 4): 137692548,
14359254, 123333294. (mu, 1, 2, 4): 353299947, 593303907/2, 113295987/2, S_cop = -6027. (mu, 2, 1, 4): 790601280,
703603446, 86997834, S_cop = -9282. (mu, 3, 0, 3): 189885486, 186456858, 3428628, S/D = 1849/300, E/D - 1 = 1583/300.
(mu, 3, 0, 4): 1318609992, 1296540000, 22069992, S/D = 300/49, S_cop = 12600. All equal to the note.
(mu, 3, 1, 4) and (a, 3, 1, 4) were checked through S_cop and D only: S_cop = -9534, S/D = 360703/128160 = 2.814474;
S_cop = 420, S/D = 0.009785; both equal to the note under the signal law.

### 1c. Random marks and arbitrary weights

Sixth-root marks with the note's seeds (the draw order coincides): (a, 1, 2, 4) seeds 1, 2, 3, (a, 2, 1, 4) seeds
1, 2, (mu, 1, 2, 4) seed 1 reproduce the note's E, S, Rem digit for digit (6 of its 8 control runs).
New runs, identity (i), law (ii) and D formula tested in the ring, all pass:

| case | marks / weight | S/D | coherent S/D | factor |
|---|---|---|---|---|
| c, 1, 2, 4 | random 42nd roots, 3 seeds | 0.029611, 0.048715, 0.001222 | 1.488981 | 50, 31, 1218 |
| a, 2, 1, 4 | random 42nd roots, 3 seeds | 0.007739, 0.006318, 0.034035 | 0.102168 | 13, 16, 3.0 |
| c, 2, 1, 4 | 42nd roots; sixth roots, 2 seeds | 0.037945; 0.010894, 0.149507 | 0.637311 | 17; 58, 4.3 |
| mu, 2, 1, 4 | 42nd roots; sixth roots | 0.491880; 0.295598 | 2.654979 | 5.4; 9.0 |
| random weight w(A') in Z[zeta_42], non-unimodular, (2,1,4), (3,0,4); with random marks (1,2,4) | | 0.002073, 0.000979, 0.018875 | | law (ii) holds |

Exact mean over independent unimodular marks: E|S_cop|^2 = Sum_P |T_P|^2 with T_P the Moebius sum belonging to the
prime P, against |Sum_P T_P|^2 for coherent marks. Computed ratio |Sum T_P|^2 / Sum |T_P|^2: mu: 7 at lam = 1
(T_P = -1326 for all P; -1362 at N = 3), 21 at lam = 2 (T_P = -287); a, 1, 2, 4: 21 (T_P = -41); c, 1, 2, 4: 21;
a, 2, 1, 4: 6.82 (T_P = 154 three times, 216 four times); c, 2, 1, 4: 6.75; a, 3, 1, 4: 6.25; b, 2, 1, 4: 2.53
(T_P = -196, -196, -10 five times). So "drops by about pi_lam" is correct for the mean of |S_cop|^2 when the T_P
are of equal size, and is 2.5 for (b, 2, 1, 4).

### 1d. Section 3 table and stated numbers

`tab.py` parsed the 14 table rows of RESULT.md and compared with `recheck.jsonl`: k, E, S, Rem as exact rationals,
S/D and Rem/D to 6 decimals, (E - D - S)/D to 4 decimals, the last column against the block files: 0 mismatches in
14 rows. The 22 lines of `compare.log` are the 22 records of `recheck.jsonl` (14 coherent, 8 random).
* "22 of 22" (identity, signal law, diagonal Gram): confirmed from the records. "13 of 13" stored blocks: confirmed
  (J2, nr2, nc2, S_cop^2). "12 of 14" with E - D - S < 0: confirmed; the two positive rows are (a, 2, 1, 3) and (a, 3, 1, 4).
* "84 to 98 percent": S/E for the five mu rows = 0.9819, 0.9833, 0.8900, 0.8397, 0.9100. Confirmed.
* 1583/300 = 5.27667 and 1849/300 = 6.16333; the c7 referee file prints 5.277 and 6.163 for (3, 0, 1), mu. Confirmed.
* 300/49, 12600 (of 294 * 49 = 14406), 9282, 6027, 9534: confirmed by `tp.py` and by the full runs.
* 7 * 7^8 * 861^2 = 29914976294847 and 7^8 * 6/7 = 4941258: confirmed.
* 7 * 21 / ((6/7) * 343 * 7) = 0.0714 against 1681/28224 = 0.0596: arithmetic confirmed; the ratio 0.834 is the
  coprimality density (41/49)^2 / ((48/49)(6/7)).
* Weil targets a, b (9 rows): S/D from 0.009785 to 0.5625, Rem/D from 0.582802 to 1.012095. Confirmed as printed.

## 2. Errors and corrections

**E1 (section 6, random-mark cell; section 0 item 6; flag R3): (16.13) is not the step that fails.** (16.13) is
the per-prime estimate B_p = -1 + O(Q^(-7/8)), stated "uniformly in the imaginary parts and the target unit
phase"; it does not involve the mark weight and is unaffected by replacing the marks. What is removed by random
marks is the hypothesis of (12.5) that the mark equals eta(p), so that the slot sum of the terms (mark) times
conj(phase) times B_p has constant phase. Correction: "the slot sum that uses (16.13) loses its constant phase;
(16.13) itself still holds". In F_q[T] no identity fails at all; only the size changes.

**E2 (section 6 and section 0 item 6): the eight random-mark runs contain five independent mark draws, and the
N = 1 factors are an identity.** At N = 1, lam = 2 no marked prime divides A' and n_k(PA') = 41 is constant, so
S_cop = -41 (Sum_P u_P)(Sum_{A'} nu(A')). The runs (a, 1, 2, 4) and (mu, 1, 2, 4) with the same seed have squared
signals in the exact ratio 49 (247107/2 against 12108243/2; 1070797/6 against 52469053/6; 576583/2 against
28252567/2), and the "factors 21 to 49" are 441/|Sum u_P|^2 with |Sum u_P|^2 = 9, 13, 21 in both. The three mu runs
add no information on the size. The coincidence S(mu, seed 1) = S(a, coherent) = 12108243/2 is this factorisation.

**E3 (section 0 item 6): the summary omits the pi_1 = 7 runs.** Section 6 lists (a, 2, 1, 4): 0.1022 against 0.0008
and 0.0337, factors 120 and 3.0; "about the number of marked primes" describes the mean (6.82 exactly for
|S_cop|^2, section 1c), not these two values. The statement should give the exact mean and the observed range
(target a at lam = 1: 3.0 to 120 over five draws, two of the note and three of the referee; targets a and c at lam = 2: 21 to 1218 over six draws).

**E4 (section 4, "To leading order S/D = wt^2 pi_lam q^(-lam) (density factors), about wt^2/lam").** At lam = 1 this
gives 7; the exact values are 48841/18396 = 2.655 and 360703/128160 = 2.814. The factor 0.38 to 0.40 is not a
density near 1: at lam = 1, omega_1(B) takes the values 1 and 3 and the Cauchy-Schwarz ratio
(Sum omega n)^2 / (Sum omega^2 ...) enters. The formula is within 3 percent at lam = 2 (3 against 2.918) and within
13 percent at lam = 0 (7 against 6.12, 6.16). "about wt^2/lam" should be restricted to those rows or dropped.

**E5 (section 3, first reading; section 6, aligned row): the separation between Weil targets and the aligned
control depends on the two targets chosen.** For the Weil target F = T^3 + 3, S/D = 1.489 at (1, 2, 4), 1.5625 at
(1, 2, 3), 0.637 at (2, 1, 4), and S/E = 0.72 at (1, 2, 4) and (1, 2, 3). The squared signal of a Weil target can
exceed the diagonal in the model (here |Sum_t nu(T - t)| = 5, against 1 for a and 3 for b). The ranges "0.0098 to
0.56" and "0.58 to 1.01" are correct for a and b only; with c the Rem/D range is 0.570 to 1.012. Conversely the
aligned control with random marks has S/D = 0.06 to 0.49. The note's third reading (bounded factor at dual
length 0) already says that no separation is established; the first reading and the cell "maximal: 84 to 98
percent" should carry the same qualification.

**E6 (section 0 item 3, section 3 second reading, section 10): "E >= D + S is false in the model" is stronger than
the data.** Exact content: Rem < D in 12 of 14 coherent cases (17 of the note's 22; all 9 new coherent cases of
section 1a), and Rem > D in (a, 2, 1, 3), (a, 3, 1, 4) and in the three random-mark runs (a, 1, 2, 4). All cases have
d = N' or N' + 1 at q = 7, where the q^d rows do not make distinct chi_B orthogonal (that needs d >= 2N'). The
sentence "(3.2) of the c7 note has no counterpart in the model" was not tested in the range of (3.2); it should read
"the inequality E >= D + S fails in 12 of 14 computed cases, all with d <= N' + 1".

**E7 (sections 0 item 6 and 7.1): wording of the (E-K) statement.** "It is below the diagonal exactly where
beta* <= 1 - h_E/6" and "the squared signal is at or below the diagonal" assert an upper bound for the squared
signal, which the note does not prove. What is proved (relative to (HC)) is that the forced lower bound is at or
below the diagonal level there. "(unconditionally false only where h_E > 3, relative to (HC))" is self-contradictory:
it is conditional on (HC). Neither sentence claims more than a lower bound for the energy; the correction is of
wording only.

**E8 (labels).** (a) Section 3: "the stored floats row_excess_over_diag, bessel_over_diag equal E/D - 1 and S/D to
all printed digits" sits in a section labelled EXACT, is a float comparison, and is not performed by `compare.py`
(which compares J2, nr2, nc2, S_cop^2 only). The referee ran it: agreement within 1e-12 in 13 of 13. (b) Section 2
states J(k) = 0 for r < 0; in the two N' = 4 rows the block k = 2 has r = 1 and J(2) = 0 there is a computed fact
(also in the referee's (c, 3, 1, 4) run), not covered by the stated rule. (c) Section 6, "EXACT, 8 of 8 runs
(random sixth roots of unity)": correct for sixth roots; the heading "random unimodular marks" is wider than what
was run (the referee's 42nd-root runs extend it, 9 of 9 pass).

No error was found in any number of the note.

## 3. Controls (section 6), cell by cell

| control | cells | finding |
|---|---|---|
| random unimodular marks | identity holds; closed form holds; size drops | first two confirmed (6 of the note's runs reproduced, 11 new random-mark runs). Size: confirmed in the mean, see E2, E3. Named step: E1. The Z[omega] exponent statement (h drops to 1 - lx - 2l) is ARGUED and was not checked |
| reflected rows, (E-K) | holds; no closed form; lower bound only | not run by the note or the referee. The first cell is a statement about a vector norm and is correct as linear algebra; nothing is claimed beyond a lower bound (E7 for wording) |
| aligned target mu | holds; exact; 84 to 98 percent | confirmed on the five rows; see E5 for "maximal" |
| unimodular completely multiplicative twist | holds; holds | not run by the note. The cell "the F_q[T] law is exact for any weight" was run by the referee with random non-unimodular weights (3 runs, law holds), which covers it in the block model |
| Davenport-Heilbronn-type | holds; Proposition 3 exact for nu_a + nu_b (cited from c7) | not run by the note; run by the referee at (2, 1, 4): identity and law hold, equal to the stored dh block. The Bessel identity holds for any vector, so "holds for the combined vector" is correct. "Fails at the Euler product in the reciprocal (MS Lemma 7.1)" is a statement about the manuscript and was not checked |
| sign-twisted primes, THIN | holds; holds | not run by anyone in this note; the cells follow from "any weight" in the block model only |
| backward heat and the remaining five | not applicable, not run | stated as not run; correct |

Claims for controls that were not run in this note: the cells "holds" for the twist, DH and THIN rows rest on the
c7 lane or on the general statement, and the table does not mark them as cited. They are true in the block model
(referee runs above). No control is claimed to fail structurally.

## 4. Requirement flags (set by the referee)

| flag | value | reason |
|---|---|---|
| R1 multiplicativity essential | false | identity (i) and signal law (ii) hold for random non-multiplicative, non-unimodular weights and for nu_a + nu_b (referee runs) |
| R2 height-uniform, every window | false | no statement about a function or its zeros; all exact data at q = 7, N' <= 4, d <= 4 |
| R3 controls fail structurally | false | no target-type control fails; the random-mark control changes a size, not an identity, and the step named for it is misattributed (E1) |
| R4 reaches the critical line | false | the content is Bessel's inequality and a closed form at dual length 0 with weight at most q; no probe with h > 1 is established |

The note's flags are confirmed. The note makes no statement about zeros of zeta; none was found in the text.

## 5. Surviving claim

Over F_7[T], for the block model of c7 (squarefree moduli, sharp degrees), N' <= 4, d = 3, 4, targets T^3 + 2,
T^3 + T + 1, T^3 + 3, their sum, mu, arbitrary weights, coherent or arbitrary marks: ||R||^2 = Sum_{k <= d/2}
|J(k)|^2/||c_k||^2 + Rem exactly, with Rem the residual norm; c_k pairwise orthogonal with ||c_k||^2 = q^(d+2k)(1 - 1/q);
at dual length 0, |J|^2 = wt^2 q^(2d) |S_cop|^2. Rem < D in most coherent cases, so the energy is not bounded below
by diagonal plus squared signal there. Independent marks reduce the mean of |S_cop|^2 by Sum|T_P|^2 / |Sum T_P|^2
(2.5 to 21 here). The squared signal exceeds the diagonal for mu and for one Weil target; no separation between
them is shown. Over Z[omega] the energy inequality is Cauchy-Schwarz relative to the manuscript and was not
recomputed. Nothing concerns zeros.
