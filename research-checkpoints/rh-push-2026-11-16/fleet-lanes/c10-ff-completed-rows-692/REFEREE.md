# REFEREE: c10-ff-completed-rows-692 (adversarial, lens: general)

Referee pass of 2026-11-18 (local time). Target: `RESULT.md` in this directory. Claimed verdict: precise-obstruction
(F_q[T] model, q = 7, exact integers; no statement about zeta). Only this file was written. All referee runs were
local, through `scripts/memcap.sh 8`, with scratch scripts in `/tmp/ref692`; the compute server was not used. The
production rows S_6 at (6, 9, 2) (about 5e11 terms) were not recomputed; they were tested by symmetry (below).

## Outcome

**The claim holds in a narrowed form.** No arithmetic error was found. Every number of sections 0, 2, 4 that I
recomputed from the raw integer files agrees with RESULT.md; the kernel agrees with a brute force from the
definition on six cases the lane did not use; the completion formula passes polynomiality on four further cases,
two of them outside the lane's range (conductor of degree 2; mark of degree 2). The pre-registration hashes match.

Narrowing (details in E1 to E7):
- The words "cube term confirmed" are the name of the rule's branch, not a finding. The c9 size prediction for
  the cube term (0.8) is wrong by a factor 1.72, and this was known before the run. What the run adds is the
  squarefree row S_6: it is at 0.57 to 0.60 of its diagonal for the targets and anticorrelated with the cube terms
  for target a. RESULT.md says this itself; any record line should carry "literal rule met by offsetting
  deviations; completed-row law fails in three of its five steps", not "cube term confirmed".
- The obstruction is: at one configuration the completed row of three probe vectors is 1.69, 2.00, 5.9 times the
  diagonal. It is a constant at one size. It does not contradict (E-K) with a factor N^eps, and it measures no
  threshold and no exponent. "Device closed at 2 <= h <= 3" is a campaign decision on model evidence, not an
  established statement.
- The positive half of the comparison with MS table (7.16) (squarefree-n part = the odd-l rows j = 2, 3, 4) does
  not match the table on support (E4). The negative half (that part is absent from the principal signal) holds
  and is exact in the model.

No statement about zeta is made. RH is not assumed (in the model the family RH is Weil's theorem, stated as such).
Verified height is not restated. No known theorem is presented as new.

Flags set by the referee: **R1 = false, R2 = false, R3 = false, R4 = false** (same as claimed; none of the four
properties is established or claimed).

## What was re-derived or rerun

| item | what the referee did | result |
|---|---|---|
| Diagonal for n = l^2 (section 2) | Re-derived. Res(l^2, m) = Res(l, m)^2, chi_0^3 is the quadratic character, so chi_{l^2}(m)^3 = 1 for l not dividing m and 0 otherwise: the seven terms n = l^2 carry the character chi_P and add before squaring. V_2 restricted to n = l^2 is #{l : l !| m} = 7 (21 irreducible m), 5 (21 split m), 6 (7 squares): sum of squares 1806, mean 36.857. Squarefree n of degree 2: 21 irreducible with 48 coprime m, 21 split with 36: 1764. j = 2 diagonal = 49 np (1764 + 1806) = 784,332,941,280. | Equal to the stated value. D_c(a) = 19287465762544 + 2403090675552 + 784332941280 = 22474889379376: correct. |
| Share 0.976 along c_0 of the n = l^2 part | By hand: (21*7 + 21*5 + 7*6)^2 / (49 * 1806) = 86436/88494 = 0.9767 for a constant companion; with the stored S_0, 0.97599. | Correct. |
| Squarefree-n part orthogonal to c_0 | Proved: for squarefree n of degree 2, m -> chi_n(m)^3 is a non-trivial quadratic character mod n, and the 49 monic m of degree 2 are a complete residue system mod n (m = n + r, deg r < 2). So sum_m of the squarefree-n part of V_2 is 0 exactly, for every vector. The measured share 1.2e-6 (a), 1.6e-7 (b), 4.4e-4 (one, mu) is the non-constant part of S_0 (0.04% of its energy). | "0.0000" is an exact zero of V_2, not a numerical coincidence. RESULT.md did not state the reason. |
| Whole of Table 1, Table 3, the c_0 shares (section 4) | Separate script (`/tmp/ref692/indep.py`): own Z[zeta_6] arithmetic, resultant as a Sylvester determinant mod 7 (the lane uses the Euclidean algorithm), mu by factorisation type, Jacobi sum from its definition, diagonal by direct counting; inputs: `results/q7_N6_lam9_d2.txt`, `ref/q7_N3_lam9_d2.txt`, `ref/q7_N0_lam9_d2.txt`. Vectors one, a, b, mu. | Exact integers equal: a: E_c = 37948159053850, D_c = 22474889379376; one: 133101617670504 / 22540391694240; b: 44998235596411; mu: D_c = 22143611500416. e_c 5.90503, 1.68847, 2.00216, 1221.85; e_s 0.86197, 0.56675, 0.59743, 1367.59; b_s 0.093691, 0.019547, 0.00061496, 1354.80; E_2/D_c 4.0859, 1.3771, 1.2780, 0.10077; n = l^2 part 0.6608, 0.6628, 0.6628, 0; squarefree-n part 3.5793, 0.7173, 0.6143; S_0 at 37.527 times its diagonal, 0.99960 along c_0. All agree with RESULT.md. al and the random vectors were not reassembled. |
| Decomposition sums | x_c(a) = 0.4864 + 0.0588 + 1.3771 - 0.0361 - 0.2224 + 0.0247 - 1 = 0.6885; b: 1.0021; one: 5.905 - 1. | Consistent. |
| Kernel `ffw6 enw`, different cases | Rows from the definition (own resultant, own irreducibility test, Gauss phase formula re-typed) for the twisted vectors a and b at (d, N, lam) = (2, 2, 3), (1, 3, 4), (2, 3, 4). None is a validation or production case of the lane. | 6 of 6 identical on every row (sums of norms 7056, 9408; 1080978, 973062; 5959005, 13627764). |
| Polynomiality with the j = 2 term, different cases | `check_poly_j2.py` with P = T + 1 and P = T + 5 (lane: T, T + 3). | Completed row 0 on 42 rows; 56154 without n = l^2; 1010394 with J; 100842 squarefree alone. Same as the lane's values. |
| Completion for twisted vectors, different cases | `check_twist.py`: (i) d = 2, lam = 1, F = T + 3, P = T + 5, N <= 7; (ii) d = 1, lam = 1, **conductor of degree 2**, F = T^2 + 1, P = T + 3, N <= 8; (iii) d = 1, **lam = 2**, P = T^2 + T + 4, F = T + 2, N <= 8. | (i) vanishes at N = 7 on 42 rows. (ii) non-zero for N <= 6 (sum of norms 100842 at N = 6), zero at N = 7, 8 on all 6 rows: degree 2(d + lam + deg F) - 2 = 6 as predicted. (iii) zero at N = 7 on the 6 rows coprime to F and at N = 8 on all rows; the row m = F is non-zero at N = 7. Extends the lane's item 7 from conductor degree 1 to 2. Conductor degree 3 (the run's vectors) remains unchecked. |
| Production rows S_6 at (6, 9, 2) | Not recomputed. Symmetry tests on the stored rows (`/tmp/ref692/sym.py`): (a) vectors one and mu must be invariant under T -> T + c: the 49 rows take exactly 3 values, by factorisation type of m (7 squares, 21 split, 21 irreducible). (b) Vector a (F = T^3 + 2) must be invariant under T -> wT, w^3 = 1 (I checked the exponents: resultant factors w^-12 and w^-18, discriminant factor w^-210, all 1; u changes by a cube root of unity, a square): rows equal in 98 of 98 comparisons. (c) Vector b (F = T^3 + T + 1, no such symmetry): 96 of 98 differ. | Pass. These identities are not imposed by the assembly; I did not read the whole kernel to exclude that its loop order makes them automatic. They test the output file, not each term. |
| Pre-registration | SHA-256 of `PREREG.md`, `ffw6.c`, `ffx.c`, `assemble6.py`, `predict6.py`, `predictions6.txt` recomputed. File times compared with the server logs. | Equal to `logs/prereg_hashes.txt` (stamp 06:26:05 UTC). First server unit 06:27:42, production start 06:29:49. Result hashes equal `logs/result_hashes.txt`. The evidence is local file times and the lane's own logs. |
| Rule outcome | Re-evaluated (L), (X), (B), (S), (C) from my recomputed numbers and the bands in PREREG section 5. | (L) true (0.68847 in [0.6, 1.0]; 0.019547 in [0.015, 0.025]); (X) false; (B) false (15.69, 0.0876, 0.0937 against 0); (S) true; controls separated on the numbers of `summary6.txt`. Outcome 1 true, outcome 2 false, as stated. |
| MS section 7.2 as text | Read Lemma 7.1, (7.10), (7.11), table (7.16) and its proof in `~/lean-deps/qrh-verify/paper.txt`. | Family (e_0, l) = (0, 2r + 2), k = 0, m >= r + 1 gives R(1 - Q^-1)V^(m-r-1) for every j, summed to 1/(1 - R): as quoted. Families (0, 2r + 1), (1, 2r + 1) have entries only for j = 2, 3 and j = 3, 4: as quoted. See E4 for the use made of it. |
| Compute rules | Read section 10 against BRIEF (heavy lane: 16 cores, 32 GB, 3 hours). | 12 + 4 then 16 cores; 15 + 15 GB limits; longest job 3562 s. Inside the heavy-lane allowance. |

Zeta-only mechanism: none is claimed, so there is no control to run under R3. The R3 list (Davenport-Heilbronn and
the others) was not run and RESULT.md says so.

## Errors and overstatements

**E1. "Cube term confirmed" is not what the numbers show.** The assignment rule reads "within 25% of the prediction
with controls separated: the cube term is confirmed". The prediction of c9 section 10 was built as: squarefree
part at its diagonal (0.86 D_c) + cube term 0.8 + j = 1 term 0.06 - 1 = 0.72. The cube term is 1.377 (a), exact
and known before the run (PREREG section 0). Given the known K = 1.461, the band x_c(a) in [0.6, 1.0] is the
statement E_0/D_c + cross_01 + cross_02 in [0.139, 0.539], against 0.858 if S_6 sits at its diagonal and is
uncorrelated. So (L) could only be met if the squarefree row deviated from the law by -0.32 to -0.72 D_c; it did
(0.486 - 0.259 = 0.228). The pass of (L) is therefore itself a measurement that the "squarefree part at its
diagonal, independent of the cube terms" steps fail. RESULT.md says the agreement is not structural; the header
line "cube term confirmed" and the proposed Z30 text "the registered literal rule ... holds" should not be copied
without that qualification. Under the assignment's own two branches, the content is nearer the second ("the
completed-row law is wrong") than the first.

**E2. What was an advance test.** E_1, E_2, cross_12, D_c and the law inputs were known when PREREG was written
(disclosed). Item 5 of section 0 lists "E_2/D_c >= 1.28" and "E_2 is 0.99 of the law value" among the stable
findings; they are not results of this run. New and unknown in advance: e_s, b_s, cross_01, cross_02, hence e_c.
With K >= 1.41 known, e_c > 1 for the targets needed only E_0/D_c + cross_01 + cross_02 > -0.41; the direction
"completed row above the diagonal" was close to forced. The informative new numbers are e_s = 0.567, 0.597, 0.862
and cross_01 + cross_02 = -0.259, +0.082, +0.164.

**E3. Scope of the obstruction.** One configuration, 49 rows, q = 7. The excess is a factor 1.69 to 2.0 for the
two Weil targets. The random band is the heuristic 1 +- 3/7, with three random vectors that share their companion
rows (so their cube terms are small by construction: 0.018 to 0.024). Target a's squarefree part (0.567) is 0.004
below the lower edge of that band and the lowest random value is 0.763; "squarefree part of the targets is below
the random vectors" is three samples against two. "(E-K) stays closed at 2 <= h <= 3" is not contradicted and not
established by this; RESULT.md section 9 item 1 says the same. No threshold r > 2N - 3 is tested (one point).

**E4. The identification of the squarefree-n half with the odd-l rows of (7.16) fails on support.** In (7.16)
the families (0, 2r + 1) and (1, 2r + 1) are non-zero only when the row index u has v_p(u) = j in {2, 3, 4} at
the prime p dividing n. In the model the squarefree-n part of V_2 is chi_n(m)^3, supported on rows m coprime to
n, that is j = 0 at every prime of n, where the table gives zero. The model term therefore has no entry of (7.16)
as counterpart; the model row is not averaged over the variables (k, w) whose summation produces the table. What
agrees is the vanishing: the table gives no odd-l contribution at j = 0, and in the model the squarefree-n part
sums to zero over m exactly (proved above). Surviving statement: about half of the cube term (0.61 to 0.72 D_c
for a, b) is absent from the principal signal read by J_0. Not supported: "it sits on the non-principal rows
j = 2, 3, 4" and the link to (E-H), row Z31. RESULT.md labels this ARGUED and lists it as weakest step 3; the
proposed Z30 sentence "half from squarefree n (orthogonal to it)" is correct, the reading via the odd-l rows
should be dropped.

**E5. "0.739 = (1 - 1/q)^2 to three digits" (section 5 item 4).** (6/7)^2 = 0.73469; the measured ratio is
0.7390. Agreement is to two digits (0.6% apart).

**E6. Cross terms quoted two ways.** Section 0 item 4 uses the sum of the three cross terms (-0.234); section 9
item 1 says "cross terms of -0.26" (cross_01 + cross_02 = -0.2585). Both numbers are right; the labels differ.

**E7. Production configuration without an independent recomputation.** As RESULT.md states, the N = 6 check
against `ffx row` is one vector at d = 1 (7 rows) and arrived after the analysis. My symmetry tests and the six
brute-force cases at N <= 3 reduce this gap but do not close it: an error specific to nA = 7^6 with d = 2 that
respects the symmetries would not be seen. The completion formula at conductor degree 3 is still unverified
(checked now at degree 1 and 2).

## Requirement flags (referee)

| flag | value | reason |
|---|---|---|
| R1 | false | The statistic is a quadratic form in the coefficient vector; no step where multiplicativity is essential is established. |
| R2 | false | Fixed q, one triple of degrees; no statement about zeros or heights. |
| R3 | false | No mechanism is claimed; random vectors satisfy the bound that the targets exceed; the R3 control list was not run. |
| R4 | false | Model computation; no abscissa and no passage to the critical line. |

## Statement that survives

F_q[T] model, q = 7, (N, lam, d) = (6, 9, 2), exact integers, rule fixed before the run (hashes verified): the
completed marked row R_m = S_6 + Jbar V_1 S_3 + Jbar^2 V_2 S_0 has energy/diagonal 1.688 (a), 2.002 (b), 5.905
(one), against 0.567, 0.597, 0.862 for the squarefree part S_6 and 0.80 to 1.07 for three random vectors; mu
1222. The j = 2 term is 1.377 and 1.278 of the diagonal (known before the run; the c9 figure 0.8 is wrong by
1.72). It splits into the n = l^2 part (0.663 D_c, 97.6% along the constant direction) and the squarefree-n part
(0.717, 0.614 D_c, exactly zero sum over m). The registered literal band is met for the primary vector through
offsetting deviations; the completed-row law with exact inputs fails (squarefree part not at its diagonal;
cross terms not negligible; coherent count off by 15.7 and 0.088). One configuration: no exponent, no threshold,
no contradiction with an N^eps bound. Completion formula verified by polynomiality for the trivial vector and
for twists of conductor degree 1 and 2, not degree 3. No statement about zeta.
