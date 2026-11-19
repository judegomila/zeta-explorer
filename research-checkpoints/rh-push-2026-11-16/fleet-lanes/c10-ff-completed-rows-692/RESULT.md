# c10-ff-completed-rows-692: completed marked rows at N = 6 (j = 2), triple (6, 9, 2), q = 7, in F_q[T], exact integers

Internal working note, 2026-11-19. Slug `c10-ff-completed-rows-692`. Kind: compute (heavy lane). Not refereed.
Nothing committed, pushed or posted. Written: this directory and `~/rh-push/c10-ff-completed-rows-692/` on the
compute server (computations through `rhrun` only).

This note makes **no statement about zeta** and no statement about zeros of any number-field L-function. It is a
function-field model computation in which the Riemann hypothesis for the twist family is Weil's theorem.
7/8 (unrefereed) stands; RH open. NO QED.

Labels: PROVED / EXACT (equality of exact integers on the stated cases) / MEASURED (ratios of exact integers; no
identity claimed) / ARGUED / NOT-RUN / OPEN.

## 0. Verdict

**The pre-registered run was made and the registered rule returns "cube term confirmed" for the primary vector.
Precise obstruction, model level: at (N, lam, d) = (6, 9, 2), q = 7, the completed row of each probe vector is above
the diagonal and above the random band, and its squarefree part is below the diagonal. Compute lane; no requirement
flag.**

1. **Run.** `ffw6 enw 7 2 6 9`: 117,649 cofactors, 4,483,696 marked primes, 49 rows, eight vectors; 3562 s on 12
   cores, 13.86 GB. Kernel validated first (section 3): identical to the stored exact results at N = 0, 2, 3
   (ten files, every row) and to `ffx en` at N = 4; at N = 6 against the independent kernel `ffx row` (section 3,
   item 6).
2. **Numbers (EXACT rationals; section 4).** Energy over diagonal, completed row / squarefree part:

   | vector | completed e_c | squarefree e_s | cube term E_2/D_c |
   |---|---|---|---|
   | a (primary target) | 1.688 | 0.567 | 1.377 |
   | b (second target) | 2.002 | 0.597 | 1.278 |
   | one (trivial target) | 5.905 | 0.862 | 4.086 |
   | random, three seeds | 0.932, 1.072, 0.801 | 0.990, 1.096, 0.763 | 0.022, 0.018, 0.024 |
   | mu (Liouville-twisted) | 1222 | 1368 | 0.101 |
   | aligned | 9.04e9 | 1.04e10 | - |

3. **Rule (PREREG sections 5, 6).**
   - Outcome 1, the assignment's rule read literally on the primary vector: completed excess x_c(a) = e_c - 1 =
     0.688, inside [0.6, 1.0] (0.8 +- 25%); coherent part of the squarefree row b_s(a) = 0.0195, inside
     [0.015, 0.025] (0.02 +- 25%); controls separated. **CONFIRMED-AS-STATED: true.** I had written in PREREG that
     I expected this to fail; that expectation was wrong.
   - Outcome 2, the law with exact inputs: **false.** x_c(a) = 0.688 against 1.32 predicted (band [0.99, 1.65]);
     x_c(b) = 1.002 (inside [0.95, 1.58]); b_s over the law value: 15.7 (a), 0.088 (b), and 0.094 against 0 for
     `one`; 0.739 for mu.
4. **What the agreement in Outcome 1 consists of (MEASURED).** x_c(a) = 0.486 (squarefree part) + 0.059 (j = 1)
   + 1.377 (j = 2) - 0.234 (cross terms) - 1. The c9 number 0.8 assumed a cube term of 0.8 on top of a squarefree
   part at its diagonal. The cube term is 1.72 times larger and the squarefree part is at 0.57 of its diagonal; the
   two deviations offset. For the second target x_c(b) = 1.002 (outside [0.6, 1.0] by 0.002) and b_s(b) = 0.0006.
   The 25% agreement holds for the registered primary vector and is not a property of the law.
5. **What is stable across the three probe vectors (EXACT, one size).** e_c > 1.429 (upper edge of the random
   band) and e_s < 1 for a, b, one; E_2/D_c >= 1.28; for the two Weil targets E_2 is 0.99 of the law value computed
   with the exact mean square of V_2 (1.390, 1.289). Dual lengths r = 12, 13: above the argued threshold
   2N - 3 = 9 for completed rows and below 3N - 3 = 15 for squarefree rows. This is one configuration; no growth
   in N is measured.
6. **Section 7.2 of the manuscript (text only; section 6).** The cube term splits exactly into the part with
   n = l^2 (0.663 D_c for a and b; 97.6% of it along the constant direction c_0 read by the principal probe) and
   the part with squarefree n (0.717 and 0.614 D_c; 0.00% along c_0). The first is the first term of the factor
   1/(1 - R) of MS (7.11), rows "(0, 2r + 2), k = 0" of table (7.16): it is in the signal of Prop. 2.1 through the
   normaliser (map row Z24), so for that half the excess is the Cauchy-Schwarz step read backwards. The second
   half corresponds to the odd-l rows of (7.16), which occur only for non-principal rows u (v_p(u) = 2, 3, 4): it is
   not in the principal signal. ARGUED from the text; not a derivation.
7. **Proposal (not applied).** Device node `ff-order2-vertex-probe`: state closed for the route "ORDER-2 through
   (E-K)" at vertices with 2 <= h <= 3, evidence level: model, one size, one referee pass owed. No requirement
   flag rises. Nothing here is a confirmed h > 1 with a true low input.

## 1. Plan; flags before the run; relation to closed rows

| flag | expectation before work | 
|---|---|
| R1 | false: the statistic is a quadratic form in the coefficient vector |
| R2 | false: fixed q, bounded degree, no statement about zeros |
| R3 | false: random-phase vectors sit at the diagonal whatever the targets do |
| R4 | false: model computation inside the 7/8 architecture |

Read: BRIEF to the end (rules of 2026-11-18); OBSTRUCTION_MAP rows Z15, Z24, Z26, Z27, Z30 (the row of (E-K);
it lists this lane as the outstanding bounded check) and section 2 (controls); `c9-mv6-ff-window-exact/RESULT.md`
(all), its `PREREG.md`, `PIVOT_PREREG.md`, kernels `ffx.c` (`en`, `sc`, `row`), `ffw.c`, `analyze.py`,
`fe_marked.py`; the c9 outcome record (referee corrections E1 to E9); MS sections 6.1 and 7.2 as text
(`~/lean-deps/qrh-verify/paper.txt`).

Known before: c9 section 4 (N = 3: the cube term carries the completed energy; scaling ARGUED: completed rows fail
for r > 2N - 3) and section 10 (this run, prediction 0.8 against 0.02). Referee note on c9: completion formula
untested for twisted vectors.

New here: (i) the kernel with the cofactor limit lifted to 7^6; (ii) the completed row at N = 6 with j = 2 and
the diagonal for n = l^2 written out; (iii) the completion formula checked by polynomiality with the j = 2 term
and for a twisted vector; (iv) the pre-registered run and the exact decomposition; (v) the split of the cube
term by the type of n and its comparison with MS (7.11), (7.16). No closed route is re-run.

Decisive first test: validation of the modified kernel (section 3), then the run. One pivot was allowed; none
was used.

## 2. Object (PREREG section 1)

Conventions of `ffx.c`: q = 7, chi_0 of order 6, chi_c(x) = chi_0(Res(c, x)), g_3(1, c) = G_2^(deg c)
zeta_6^(g(c)), Jbar = q^2/G_2^3 (norm q). Units G_2^15.

    R_m = S_6(m) + Jbar V_1(m) S_3(m) + Jbar^2 V_2(m) S_0(m),          m monic of degree 2 (49 rows),
    S_{N'}(m) = sum_{P prime, deg P = 9} sum_{A' monic squarefree, deg A' = N'} zeta_6^(g(P A')) u(A') chi_{P A'}(m),
    V_j(m)   = sum_{n monic, deg n = j} u(n)^3 chi_n(m)^3.

S_6: new run (kernel `enw` of `ffw6.c`: the streaming form of kernel `en`, cofactor limit lifted; `sc` and `row`
of `ffx.c` unchanged and used for the law inputs and for the independent check). S_3, S_0: stored exact rows of c9,
reproduced line by line by `ffw6` on the server. Assembly `assemble6.py`, exact in Z[zeta_6].

Diagonal of the row Gram form (units q^15), terms grouped by the character m -> chi_{P A' n^3}(m):

    D_c = np [ D_6 + q sum_{A' in supp_3} sum_{n linear} #{m : (m, A' n) = 1}
               + q^2 sum_{n squarefree of degree 2} #{m : (m, n) = 1} + q^2 sum_m | sum_{l linear, l !| m} u(l^2)^3 |^2 ].

The last term is the diagonal for n = l^2: chi_{l^2}^3 = chi_l^6 is the principal character mod l, so the seven
terms n = l^2 carry the same character chi_P and are added before squaring. Target a:
D_c = 22474889379376 = 19287465762544 + 2403090675552 + 784332941280 (j = 0, 1, 2); the naive value that treats
the seven terms as different characters is 22142701310128 (1.5% smaller; e_c = 1.714 instead of 1.688).

Statistics: e_c = E_c/D_c, x_c = e_c - 1; e_s = E_0/D_0 for the squarefree part S_6; b_s = |sum_m S_6(m)|^2 /
(q^d D_0), the part of e_s along c_0 = 1 (Bessel; k = 0, r = 12 is the only active class of the round-8 law here);
decomposition E_c = E_0 + E_1 + E_2 + cross terms, E_j = q^j sum_m |V_j|^2 |S_{6-3j}|^2.

Dual lengths r = k + N + lam - 1 - d = 12 (k = 0), 13 (k = 1); h = r/N = 2 to 2.17.

`PREREG.md` was hashed at 06:26:05 UTC (`logs/prereg_hashes.txt`), before the first server unit of this lane
(06:27:42) and before the production unit (06:29:49). Its header gives 06:30 as the time of writing; the hash
record is the reference. Disclosed there as already known: the stored rows at (3, 9, 2) and (0, 9, 2), hence
E_1, E_2 and cross_12 exactly (E_2/D_c = 1.377 for a was known and stated as missing "0.8" by a factor 1.72), and
the exact law inputs. Not known: every quantity that involves S_6.

## 3. Validation (first step; all EXACT)

| # | check | cases | outcome |
|---|---|---|---|
| 1 | `ffw6 enw` against the stored exact files of c9, local single-thread build: (2, 7, 2), (3, 6, 2), (3, 6, 1), (0, 6, 2) | every ENW and ROW line, six vectors (three at N = 0) | identical (`logs/validate_local.log`) |
| 2 | `ffw6 enw` against `ffx en` at N = 4: (4, 5, 2), (4, 5, 1) | np, sumnorm, diag, sW2, five vectors | identical |
| 3 | the same six with the OpenMP build on the server, plus the stored files at lam = 9: (0, 9, 2), (2, 9, 2), (3, 9, 2) | every line; 4,483,696 primes each | identical, 9 of 9 (`logs/server_validate.log`); run before the production unit was started |
| 4 | general assembly `assemble6.completed` at N = 3 against the stored completed energies and diagonals of c9, (3, 9, 2) | six vectors | identical (`logs/check_n3.log`) |
| 5 | completion with the j = 2 term by polynomiality, trivial vector: q = 7, d = 2, lam = 1, N = 6, P = T and P = T + 3 (`check_poly_j2.py`) | 42 rows each | S_6 + Jbar V_1 S_3 + Jbar^2 V_2 S_0 = 0 on every row; without the n = l^2 terms: sum of norms 56154; with J for Jbar: 1010394; squarefree row alone: 100842 |
| 6 | at N = 6 with the limit lifted, (6, 7, 1), 117,648 primes: `ffw6` bit-mask path against its byte path, six vectors; and against the independent closed-form kernel `ffx row` (direct resultants, no tables), vector a, 7 rows | all lines; 7 rows | both paths identical on every line; `ffx row` and `ffw6` give the same 7 rows for vector a (sum of norms 37489103532; `logs/n6check.log`). The `ffx row` result arrived 20 minutes after the production run ended; the production result was analysed before it and is accepted after it |
| 7 | completion formula for a twisted vector by polynomiality (`check_twist.py`): u = quadratic character of conductor F = T, P = T + 1; d = 1, N <= 7 and d = 2, N <= 7 | rows coprime to F P | d = 1: the completed row vanishes at N = 5, 6, 7 on the 5 rows coprime to F (non-zero at N <= 4; the row m = F is non-zero at N = 5, 7); d = 2: vanishes at N = 7 on all 42 rows (non-zero at N <= 6). The squarefree rows do not vanish. Consistent with a polynomial of degree 2(d + lam + deg F) - 2 |
| 8 | inside the production run | 72 primes: discriminant, irreducibility, chi_P(m), Res(P, A') on every fifth cofactor against direct resultants; prime count against the necklace count | passed; 4,483,696 = necklace count |

Item 7 answers part of a referee note on c9 (completion untested for twisted vectors): on two small cases with a
conductor of degree 1 the formula with V_j = sum u(n)^3 chi_n(m)^3, the terms n = l^2 included, gives a polynomial.
It is not checked for the conductors of degree 3 used in the run (the required N is out of reach). A first version
of item 5 at d = 1 was vacuous (every piece is 0 at d = 1 for the trivial vector) and is not counted.

## 4. Result (EXACT rationals, shown to four digits; `summary6.txt`, `results6.json`)

np = 4,483,696. Units of the completed diagonal D_c unless stated.

| vector | e_c | x_c | e_s = E_0/D_0 | b_s | E_0/D_c | E_1/D_c | E_2/D_c | cross_01 | cross_02 | cross_12 | share of E_c on the 7 square rows |
|---|---|---|---|---|---|---|---|---|---|---|---|
| one | 5.905 | 4.905 | 0.8620 | 0.0937 | 0.7397 | 0.0469 | 4.086 | 0.0190 | 0.1448 | 0.8687 | 0.874 |
| a | 1.688 | 0.6885 | 0.5668 | 0.01955 | 0.4864 | 0.0588 | 1.377 | -0.0361 | -0.2224 | 0.0247 | 0.152 |
| b | 2.002 | 1.002 | 0.5974 | 0.000615 | 0.5127 | 0.1192 | 1.278 | 0.0763 | 0.0061 | 0.0098 | 0.087 |
| mu | 1222 | 1221 | 1368 | 1355 | 1195 | 23.19 | 0.1008 | 2.509 | -0.502 | 1.882 | 0.107 |
| al | 9.036e9 | 9.036e9 | 1.035e10 | 2.11e8 | 8.885e9 | 2.57e7 | 1.03e5 | 1.81e8 | -5.6e7 | 6.1e5 | 0 |
| r11 | 0.9318 | -0.068 | 0.9902 | 0.0024 | 0.8644 | 0.0844 | 0.0218 | -0.0734 | 0.0241 | 0.0105 | 0.124 |
| r12 | 1.072 | 0.072 | 1.096 | 0.0013 | 0.9550 | 0.0877 | 0.0185 | 0.0403 | -0.0306 | 0.0007 | 0.071 |
| r13 | 0.8014 | -0.199 | 0.7634 | 0.0068 | 0.6628 | 0.0934 | 0.0237 | -0.0066 | 0.0356 | -0.0075 | 0.113 |

Exact integers for target a: E_c = 37948159053850, D_c = 22474889379376, e_c = 998635764575/591444457352;
E_0 = 10931265641872, D_0 = 19287465762544. With the naive diagonal: e_c = 5.993 (one), 1.714 (a), 2.032 (b).

Cube term j = 2 split by the type of n (exact; `summary6.txt` TABLE 3, `posthoc6.txt`; the split and the shares
along c_0 are post hoc):

| vector | n = l^2 part / D_c | squarefree-n part / D_c | mixed | share of the n = l^2 part along c_0 | share of the squarefree-n part along c_0 | completed row: share along c_0 |
|---|---|---|---|---|---|---|
| one | 0.661 | 3.579 | -0.154 | 0.976 | 0.0004 | 0.205 |
| a | 0.663 | 0.717 | -0.003 | 0.976 | 0.0000 | 0.317 |
| b | 0.663 | 0.614 | 0.001 | 0.976 | 0.0000 | 0.355 |
| mu | 0 | 0.101 | 0 | - | 0.0004 | 0.972 |

The companion row S_0 (marked row with trivial cofactor, energy 37.5 times its diagonal) is 99.96% along c_0.
V_2 for the n = l^2 part is #{l : l !| m} = 5, 6 or 7 (mean square 36.9); for the squarefree-n part the mean
square is 39.3 (a), 33.8 (b), 217 (one: the full V_2 is 42 on the seven square rows and 0 elsewhere).

## 5. Rule outcome and the steps of the completed-row law

Registered statements (PREREG section 5) and outcomes:

| statement | outcome |
|---|---|
| (L) literal c9 numbers on the primary vector: x_c(a) in [0.6, 1.0]; b_s(a) in [0.015, 0.025] | 0.688: holds; 0.0195: holds |
| (X) law with exact inputs: x_c(a) in [0.99, 1.65]; x_c(b) in [0.95, 1.58] | 0.688: fails; 1.002: holds. (X) fails |
| (B) b_s / B_0 law in [0.55, 1.25] for a and b; b_s(one) = 0 | 15.7; 0.088; 0.094 instead of 0. (B) fails |
| (S) e_s <= 1.2 for a, b, one | 0.567, 0.597, 0.862: holds |
| (C) random vectors in [0.571, 1.429] with E_2/D_c <= 0.2; al >= 100; mu >= 500 | holds (six random values 0.763 to 1.096; 0.018 to 0.024; 9.0e9; 1222 and 1368) |
| controls separated: (C) and e_c(a), e_c(b) > 1.429 | 1.688, 2.002: holds |

**Outcome 1 (CONFIRMED-AS-STATED): true. Outcome 2 (CONFIRMED-EXACT-INPUTS): false.**

By the assignment's rule the cube term is confirmed. The steps of the completed-row law, one by one:

1. *Cube term j = 2 = q^2 mean|V_2|^2 times the companion energy:* holds. E_2/D_c = 1.377 (a), 1.278 (b) against
   1.390, 1.289 from the law with exact V_2 and the companion law (ratio 0.99 in both). Known before the run from
   stored rows; not an advance test of this lane.
2. *Size of the cube term in the c9 scaling, |V_2|^2 = q^2:* fails at 25%. Mean of V_2^2 is 76.2 (a), 70.6 (b),
   252 (one) against 49; the cube term is 1.72 times the stated 0.8 for a. Reason: V_2 has two parts of comparable
   mean square, n = l^2 (36.9, no cancellation: a count) and n squarefree (39.3).
3. *Squarefree part at its diagonal (non-coherent part = 1):* fails. e_s = 0.567 (a), 0.597 (b), 0.862 (one),
   against 0.76 to 1.10 for the random vectors. In units of D_c the squarefree part contributes 0.49 instead of
   0.86 for a. This is in the direction c8 recorded (non-coherent part can be far below 1) and inside statement (S).
4. *Coherent part of the squarefree row from the Moebius sum, class k = 0, r = 12:* fails for the three probe
   vectors (15.7, 0.088 times the law; non-zero where the law gives 0) and holds for mu (0.739 = (1 - 1/q)^2 to
   three digits). The quantity is small for the probe vectors (b_s <= 0.094) and does not affect item 5 of
   section 0. The law's sixth-power count at r = 12 is not a predictor for vectors with cancellation.
5. *Independence of the squarefree part and the cube terms:* cross_01 + cross_02 = -0.259 (a), +0.082 (b),
   +0.164 (one). Not negligible at this size for a.

The coincidence in (L): for a, items 2, 3 and 5 move x_c by +0.58, -0.37 and -0.23 (all cross terms) from the c9
picture (0.86 + 0.8 + 0.06 - 1 = 0.72); the result 0.69 is inside the band. For b the same sum gives 1.002.

Reading for the (E-K) route (model statement only). At r = 12, 13 (h = 2 to 2.17) the completed row of each probe
vector is above the diagonal: by 0.69, 1.00 and 4.9 times the diagonal, while the squarefree part is below it and
random vectors are at it. This is what the argued threshold r > 2N - 3 says for one configuration. It is not a
growth statement: (E-K) with a factor N^eps is not contradicted by one ratio of 1.7 to 2.0 at one size. Together
with c9 (N = 3: 2.4 to 5.5 at rmax <= 3N; scaling exponent r/3 + 1 - 2N/3) the cube term is the leading
excess for completed rows in every case computed.

## 6. Comparison with the manuscript signal of section 7.2 (text only)

MS section 7.2 evaluates the local factor P_p of the high series, with completed index A = c n^3, t = v_p(A) =
e_0 + 3l (e_0 = v_p(c), l = v_p(n)), row valuation j = v_p(u). Lemma 7.1: P_p^* = (1 - R)^-1 [ (R(1 - Q^-1) -
eta(p)(Q - 1) Q^(-x-w) V 1_{j<=1})/(1 - V) + J_j ], R = a_p^2 Q^(4-6x-6z), and table (7.16) lists the non-zero
summands: the family (e_0, l) = (0, 2r + 2) (n divisible by p^2, t = 6r + 6) with k = 0 gives the principal Gauss
lift R(1 - Q^-1) V^(m-r-1) for every row; the odd families (0, 2r + 1), (1, 2r + 1) give terms only for
j = 2, 3, 4.

Model side (EXACT, section 4): the cube term Jbar^2 V_2 S_0 splits by n.
- n = l^2: chi_n^3 is principal, V_2 is a count, and the term is 97.6% along c_0, the direction of the
  principal probe J_0 = sum_m R_m. It is the first term (r = 0) of the family (0, 2r + 2), i.e. of the factor
  1/(1 - R) of (7.11). That factor is in the signal of Prop. 2.1: at the principal residue point it is the
  L(6s - 3, psi_eta) of the normaliser H_eta (map row Z24). So this half of the cube term (0.663 D_c for a and b;
  c_0-component 0.647 D_c) is the signal read backwards through Cauchy-Schwarz, as c9 section 10 asked: a row
  bound at the diagonal would bound the principal signal including its normaliser term.
- n squarefree of degree 2: 0.717 D_c (a), 0.614 D_c (b), exactly orthogonal to c_0 to four digits. In the
  manuscript's table these are the odd-l families, which contribute only to non-principal rows (j = 2, 3, 4). They
  are not in the principal signal. In the model they are not seen by J_0; whether they lie along the second probe
  direction c_1 was not computed.

Consequence, ARGUED: the excess of the completed row over the diagonal at this vertex is not one squared signal.
About half is the principal signal's own normaliser term; the other half sits on non-principal frequencies of the
row variable (the side of (E-H), map row Z31). A statement "(E-K) holds after removing the principal signal"
would still meet the second half in the model. This is a text comparison with exact model numbers on one
configuration; no identity between the model and the manuscript's weighted sums is claimed.

## 7. Controls

| control | what was run | outcome | named step |
|---|---|---|---|
| Liouville-twisted vector (u = mu) | (6, 9, 2), completed and squarefree | 1222 and 1368 times the diagonal; b_s = 1355, 0.739 of the law | its Moebius sum has no cancellation (S_cop(0) = -452144872032); the terms n = l^2 are absent (mu(l^2) = 0), E_2/D_c = 0.10 |
| aligned vector | same | 9.04e9 and 1.04e10 | operator-norm size (Lemma AL of round 8) |
| seeded random vectors, seeds 11, 12, 13 | same; cube parts from the stored random rows of c9 times seeded phases on n | e_c 0.932, 1.072, 0.801; e_s 0.990, 1.096, 0.763; E_2/D_c 0.018 to 0.024; all inside 1 +- 3/7 | Lemma R of round 8: mean over phases = diagonal; the companion of a random vector has energy at its diagonal, so its cube term is 1/37.5 of the targets' |
| trivial target (`one`) | same | 5.905; 87% of the energy on the 7 square rows | V_2 = 42 on m = l^2: chi_n(m)^3 = 1 for every n prime to m |
| DH-type, sign-twisted primes other than Liouville, THIN, unimodular twist as a family, backward heat, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | not run | - | no zero statement or positivity statement is made here. Round 8 ran DH-type, thin and two-character weights on the same statistic: they behave as the targets, through the size of their Moebius sum |

The statistic separates targets from random vectors in the direction opposite to the one a proof would need:
the row bound at the diagonal holds for the random vectors and fails by a constant for the targets.

## 8. Requirement flags (result of this lane)

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | E_c is a quadratic form in the coefficient vector. Multiplicativity enters through the size of V_2 (a count for n = l^2) and of the companion's Moebius sum; random vectors satisfy the row bound |
| R2 height-uniform, every window | false | fixed q = 7, one configuration, degrees up to 15; no statement about zeros |
| R3 controls fail structurally | false | the random-phase control passes the row bound where the targets exceed it; no control fails for a reason absent from the targets |
| R4 reaches the critical line | false | model computation; the result supports closing a route at 2 <= h <= 3; no abscissa changes. No h > 1 with a true low input was found |

## 9. Three weakest steps

1. **One configuration, and the 25% agreement is not structural.** The registered rule is met on the primary
   vector because a cube term 1.72 times the stated size, a squarefree part at 0.57 of its diagonal and cross terms
   of -0.26 add up to 0.69. The second target gives 1.002 and 0.0006 where the rule's numbers are 0.8 and 0.02.
   49 rows; q = 7 only; no second size, so no exponent and no test of r > 2N - 3 as a threshold (one point above
   it). "(E-K) stays closed at 2 <= h <= 3" rests on a ratio of 1.7 to 2.0 at one size plus the N = 3 data of c9;
   a bound with N^eps is not contradicted by it.
2. **The completion formula for the twisted vectors of the run is not verified at their conductor.** Polynomiality
   with the j = 2 term is EXACT for the trivial vector (two primes, d = 2) and for a twist of conductor degree 1
   (two cases). For conductors of degree 3 (vectors a, b) the test needs N > 2(d + lam + 3) - 2 and was not run.
   The object is a transcription (alpha = 1, sharp degree classes, no smooth weights, no excluded set, no ray
   classes); the reflected dual sums are not built; "dual length" is nominal, as in c8 and c9. The diagonal for
   n = l^2 follows the grouping rule of section 2; with the naive grouping every e_c rises by 1.5%.
3. **The comparison with MS section 7.2 is a reading of a table, not a derivation.** The identification of the
   n = l^2 half with the factor 1/(1 - R) and of the squarefree-n half with the odd-l rows (j = 2, 3, 4) is made
   from the local shapes; the model has no parameter z, no normaliser and no non-principal row family, and the
   component along c_1 was not computed. Of the validation, item 6 compares one vector at d = 1 (7 rows), where
   the vectors `one` and mu vanish identically; the production configuration itself has no independent
   recomputation (its internal self-checks are on 72 primes).

## 10. Compute record

Server ([compute-server]), every computation through `~/rh-push/bin/rhrun`; `rhstatus` read before each launch
(rh.slice at 13 to 15 GB of 150, machine 84 to 86 GB available; four units of other lanes running, not touched).
GPU not used. Planned memory printed by the kernel before allocation.

| unit | cores, memory limit | what | outcome |
|---|---|---|---|
| rh-c10ff-val-1119062738 | 4, 2 GB | build (gcc -O3 -fopenmp), validation items 3 | 9 of 9 identical; 36 s |
| rh-c10ff-prod-1119062842 | 12, 15 GB | production, first launch | exit 127 at once: the job script called `/usr/bin/time`, absent on the server. Nothing ran |
| rh-c10ff-prod-1119062949 | 12, 15 GB | production `ffw6 enw 7 2 6 9`, eight vectors | completed, rc 0. Table build 167 s, prime loop 3395 s, total 3562 s wall (about 4.2e4 core-seconds). Planned and used: TA 13.84 GB, total 13.86 GB |
| rh-c10ff-n6chk-1119062842 | 4, 15 GB | (6, 7, 1): `ffw6` both code paths, then `ffx row` | both `ffw6` runs done and identical (706 s and 642 s). The `ffx row` step was at 39 minutes on 4 cores when the production unit ended; I stopped this unit with `systemctl --user stop` and restarted the step on 16 cores. The planned `ffx row` for mu was dropped (its rows vanish at d = 1) |
| rh-c10ff-row6-1119073008 | 16, 2 GB | `ffx row 7 1 6 7`, vector a | completed, rc 0, 1161 s wall; rows identical to `ffw6` |

Core quotas of my simultaneously active units: 12 + 4 = 16, then 16. Memory limits 15 + 15 = 30 GB. No job ran
longer than 3 hours. No unit of this lane is active now (checked). Only my own units were touched. Not through
`rhrun`: file copies with rsync and status/log reads over ssh.

Local (Mac), through `scripts/memcap.sh 8`: validation items 1, 2, 4, 5, 7, `predict6.py`, `analyze6.py`,
`posthoc6.py`, one timing run at (5, 6, 2) (50 s). Not through the wrapper, each below 0.1 GB: compilation, one
`ffx row` timing call at (3, 7, 1), the `ffx en` / `ffx sc` calls for the law inputs.

Files: `PREREG.md`, `RESULT.md`; `ffw6.c` (kernel; header lists the changes against `ffw.c`), `ffx.c`, `ffw.c`,
`ffpy.py`, `plan.py` (copies from c9, unchanged); `assemble6.py`, `predict6.py`, `predictions6.txt/.json`,
`analyze6.py`, `summary6.txt`, `results6.json`, `posthoc6.py`, `posthoc6.txt`; `validate6.sh`, `check_n3.py`,
`check_poly_j2.py`, `check_twist.py`, `cmp_row.py`; `job_*.sh`, `rsh.sh`; `ref/` (stored exact rows of c9);
`results/` (ENW and ROW lines of the new runs: exact integers); `logs/`.

## 11. For the next allocation; proposed map text (not applied)

- Device `ff-order2-vertex-probe`: proposed state closed for ORDER-2 through (E-K) at vertices with 2 <= h <= 3,
  on model evidence (N = 3, four configurations, c9; N = 6, one configuration, here). Owed before the state is
  recorded as refereed: one referee pass on this note; a second size (for example (6, 10, 2) or q = 13 at
  (6, 7, 2)) would turn the single ratio into a comparison.
- The split of section 6 gives a sharper question than "does (E-K) hold": after the principal signal with its
  normaliser term is removed, is the remaining half (squarefree n, non-principal frequencies) bounded by the
  diagonal? In the model at this vertex it is 0.6 to 0.7 of the diagonal for the targets and 3.6 for `one`.
- OPEN in the model: the coherent part of the squarefree row at k = 0, r = 12 for vectors with cancellation
  (15.7 and 0.088 times the law); the squarefree part of the targets at 0.57 to 0.60 of its diagonal.

Proposed addition to row Z30 (F_q[T] part): "Completed rows at (6, 9, 2), q = 7 (`c10-ff-completed-rows-692`;
exact integers; rule fixed before the run; kernel identical to stored results at N <= 4): energy / diagonal
1.688 and 2.002 for two quadratic targets of prime conductor, 5.905 for the trivial target, against 0.567, 0.597,
0.862 for their squarefree parts and 0.80 to 1.07 for three random vectors; mu 1222; aligned 9.0e9. Cube term
(j = 2, cofactor 1): 1.377 and 1.278 of the diagonal, half from n = l^2 (along the principal direction; the
1/(1 - R) factor of MS (7.11)) and half from squarefree n (orthogonal to it). The registered literal rule (0.8 and
0.02 within 25% on the primary vector) holds; the law with exact inputs does not (squarefree part at 0.57 of its
diagonal; coherent count at r = 12 off by factors 15.7 and 0.088). One configuration; no exponent; completion for
twisted vectors checked by polynomiality only at conductor degree 1; no referee."

No statement about zeta. No abscissa below 0.874886647 is proved.
