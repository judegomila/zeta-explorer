# PREREG: c11-ff-row-energy-four-part

Model computation in F_q[T], q = 7. No statement about zeta or about zeros of any number-field L-function is tested.
In the model the Riemann hypothesis for the twist family is Weil's theorem. No requirement flag (R1 to R4) can rise.
Written before any run at N = 6 with lam = 10. The hash of this file and of the code is in `logs/prereg_hashes.txt`;
the server unit of the lam = 10 run is started after that stamp.

Model question (STRATEGY 3.1 item 23): is the squarefree-n non-principal part of the cube term of the completed row
bounded by a constant times the diagonal once the principal signal is removed?

## 0. Disclosure: what was known when this file was written

1. All of c10 (`c10-ff-completed-rows-692`, `c10-ff-slot-cross-decomposition`), including the exact rows at (6, 9, 2).
2. FIRST LEMMA (section 3), done: the decomposition of section 2 at the round-10 size (6, 9, 2), vectors one, a, b,
   mu, al: E_c, D_c, |Tq|^2, |Tf|^2 are the integers of `results6.json`, and the identity holds exactly
   (`lemma1.py`, `logs/lemma1.log`).
3. DECISIVE FIRST TEST, done (`firsttest.py`, `firsttest.txt`; local, stored exact rows of c9 only). The cube-term
   parts of the completed N = 6 row depend on the vector only through c(n) = u(n)^3, deg n <= 2, and on the marked
   primes only through the companion row S_0 (trivial cofactor). c9 stored S_0 at d = 2 for lam = 9, 10, 11, 12.
   Hence C = |Tq|^2 and D = |Pi Tf|^2 are **known exactly, not predicted**, at (6, lam, 2) for lam = 9..12, for
   every vector and seed class of section 4 (D_c needs only counts):

   | lam | companion energy / diagonal | D(a) | D(b) | D(one) | D, 24 cm seeds: min, median, max | D, 24 ru seeds | C(a) = C(b) |
   |---|---|---|---|---|---|---|---|
   | 9 | 37.53 | 0.5688 | 0.6030 | 3.578 | 0.394, 0.598, 0.977 | 0.468, 0.617, 1.023 | 0.6628 |
   | 10 | 0.00178 | 3.9e-5 | 3.0e-5 | 3.1e-5 | 2.0e-5, 2.9e-5, 3.8e-5 | 2.4e-5, 3.1e-5, 3.5e-5 | 3.2e-5 |
   | 11 | 0 (exactly) | 0 | 0 | 0 | 0 | 0 | 0 |
   | 12 | 191.3 | 2.798 | 2.980 | 22.15 | 2.05, 3.06, 5.21 | 2.32, 3.15, 5.67 | 3.375 |

   Consequences stated now. (i) At the registered second size (6, 10, 2) the threshold "D <= 1.5 for the targets"
   holds for a reason that has nothing to do with the question: the companion row is off resonance (its energy is
   0.0018 of its diagonal; at lam = 11 it vanishes identically), so the whole cube term j = 2 is 3e-5 of the
   diagonal. (ii) At (6, 12, 2) (dual lengths r = 15, 16; h = 2.5 to 2.67, inside the range 2 <= h <= 3 of the
   device) D = 2.80 and 2.98 for the two targets: above 1.5. (iii) At both resonant sizes the targets lie inside
   the range of the 24 multiplicative-sign seeds. **The registered consequence is therefore already fixed by exact
   stored data: "unbounded for targets" (not bounded by 1.5 diagonals over lam = 9..12 at N = 6) and "target not
   separated from multiplicative signs". Both close the model question against the device.** The run of section 5
   cannot change this. It is made because the assignment registers the full object at the second size, and because
   it tests the advance statements of section 5 about the parts that are not known (A, B, G, total), which test the
   reading "the excess of the completed row at this vertex is the companion's resonance at lam = 0 mod 3".
4. Exact from stored rows at (6, 10, 2) (`known10.py`): the j = 1 term E_j1/D_c = 0.0114 (one), 0.128 (a), 0.0751
   (b), 2.99 (mu); squarefree rows of length 3 at (3, 10, 2): energy/diagonal 0.652, 1.078, 0.691, 167.2.
5. New kernel `ffy.c` (section 3) validated: every stored row identical at (3, 6, 2), (3, 6, 1), (0, 6, 2),
   (2, 7, 2), (0, 9, 2), (3, 9, 2), (2, 9, 2), (0, 10, 2), (3, 10, 2), (6, 7, 1), and the multiplicative-sign class
   against fresh `ffw6 enw` runs (mode 6) at (3, 6, 2), (3, 7, 1), (2, 7, 2), (4, 5, 2) (server units
   `rh-c11ff-val-1119093600`, `rh-c11ff-val2-1119093724`).
6. The run of the new kernel at the round-10 size (6, 9, 2) (unit `rh-c11ff-p9-1119093724`, 227 s on 12 cores):
   finished and **seen in full** before this file was hashed (`summary_lam9.txt`). All 49 rows of one, a, b, mu, al
   identical to the stored rows of c10. Seen for the seed classes at (6, 9, 2), units D_c: cm e_c 1.77 to 2.69
   (median 2.20), A 0.39 to 0.95, B <= 0.13, G 0.55 to 1.06 (median 0.84); ru e_c 1.10 to 2.31 (median 1.70), G 0.55
   to 1.33; cofactor-slot energy SDA_6/D_6 = 0.851 (ru mean of e_s: 0.878). Position of the targets: D(a), D(b)
   inside both classes; e_c(b), G(b) inside; **e_c(a) = 1.688 is below all 24 cm seeds (minimum 1.765) and G(a) =
   0.491 is below all 24 cm and all 24 ru seeds (minima 0.548, 0.547)**. So at (6, 9, 2) the statement "target
   not separated from the multiplicative signs" is known to hold for D (the quantity of the question) and for
   target b, and to fail for target a in the bulk G (by 0.057) and in the total (by 0.077). These are not advance
   statements. The identity held exactly for 53 of 53 vectors.
7. Not seen: any row S_6 at lam = 10, for any vector.

## 1. Object (unchanged from c10; formula numbers refer to `c10-ff-completed-rows-692`)

Conventions of `ffx.c`. Completed, reflected marked row (c10 PREREG section 1 / RESULT section 2), N = 6, marks = all
primes P of degree lam, row variable m monic of degree d = 2 (49 rows), units G_2^(6+lam):

    R_m = S_6(m) + Jbar V_1(m) S_3(m) + Jbar^2 V_2(m) S_0(m),
    S_N'(m) = sum_P sum_{A' monic squarefree, deg A' = N'} zeta_6^(g(P A')) u(A') chi_{P A'}(m),
    V_j(m) = sum_{n monic, deg n = j} c(n) chi_n(m)^3,   c(n) = u(n)^3.

Diagonal D_c: c10 RESULT section 2 (terms grouped by the character they carry; the q terms n = l^2 add before
squaring). Statistic: energy / diagonal, e_c = sum_m |R_m|^2 / D_c, and each part of section 2 divided by D_c.

Sizes: (6, 9, 2) (round-10 size; first lemma; seed classes added) and **(6, 10, 2)** (the registered second size:
28,245,840 marked primes, 117,649 cofactors). Dual lengths at (6, 10, 2): r = 13 (k = 0), 14 (k = 1); h = 2.17 to 2.33.
Cost: section 7. No size is substituted; if the lam = 10 run does not finish within 3 hours it is NOT-RUN.

## 2. The registered decomposition (exact)

R = X + Tq + Tf with X = S_6 + Jbar V_1 S_3, Tq = Jbar^2 Vsq S_0 (the n = l^2 terms of V_2: Vsq(m) = sum_{l !| m}
c(l^2)), Tf = Jbar^2 Vsf S_0 (the squarefree n of degree 2). Directions in C^49: v_0 = 1 (read by the principal probe
J_0 = sum_m R_m) and w = the vector's own function at the row variable, m -> u(m), made orthogonal to v_0 (absent for
`one` and `al`). Pi = orthogonal projection on the complement of span{v_0, w}.

| part | definition |
|---|---|
| A, principal signal | \|<R, v_0>\|^2 / 49, with its contributions from X, Tq, Tf listed |
| B, own-character signal u(m) | \|<R, w'>\|^2 / \|w'\|^2 |
| C, n = l^2 normaliser term | \|Tq\|^2; its share along v_0 is inside A, along w' inside B; the rest is C_perp = \|Pi Tq\|^2 |
| D, squarefree-n non-principal part | \|Pi Tf\|^2 (the cube term on squarefree n with the principal and own-character directions removed); \|Tf\|^2 listed beside it |
| G, bulk | \|Pi X\|^2 |
| cross terms | x_CD = 2 Re<Pi Tq, Pi Tf>, x_CG = 2 Re<Pi Tq, Pi X>, x_DG = 2 Re<Pi Tf, Pi X> |

**Identity, checked exactly (rationals) for every vector: E_c = A + B + C_perp + D + G + x_CD + x_CG + x_DG.**
The four named parts of the assignment are A, B, C, D. They do not exhaust the energy: the bulk G and three cross
terms are needed for an identity, and C enters the identity through C_perp (the rest of C is inside A and B). This
is stated here so that the total cannot be met by offsetting parts without the table showing it.

## 3. Method and validation

Kernel `ffy ytab` (new; header of `ffy.c`): the weight-independent table Y[m][A'] = sum_P zeta_6^(cP + tp_P[m] +
4 (x_P[A'] mod 3)), from which R_w(m) = sum_A' zeta_6^t(w, m, A') Y[m][A'] for every weight on the cofactors (the
fast-path formula of `ffw6.c`, summed over P first). Same object; the method differs (multiplicativity of A' ->
Res(A', P) instead of the q^N x q^N table; bit-sliced counters). A kernel that does not reproduce the stored rows
is not used: validation item 5 of section 0, and at N = 6 the stored rows of (6, 7, 1) and of **(6, 9, 2) (all five
real vectors, 49 rows)** before the lam = 10 result is accepted. Assembly `ylib.py`, `rows.py` (server, int64 /
python integers), decomposition `fourpart.py`, `analyze.py` (pure python, exact).

## 4. Vectors and seeded classes (`vecs.py`)

Targets: `a` (quadratic character of conductor T^3 + 2; primary), `b` (conductor index 8, degree 3). Trivial target
`one`. Classes:
- **cm**, 24 seeds (1..24): random completely multiplicative signs (`thin_sign` of ffx.c, mode 6; class U of round 10);
- **ru**, 24 seeds (1..24): independent random sixth roots of unity on the monic polynomials (cofactors of degree 6
  and 3, and n of degree 1, 2), `random.Random(20261119000 + seed)`; same marked primes and Gauss sums (a unimodular
  twist of the vector, not of the pair (P, A')). The per-(P, A') random phases of c10 (three seeds, e_c 0.80 to 1.07 at
  (6, 9, 2)) are not rerun;
- **mu** (Liouville-twisted vector) and **al** (aligned vector, mode 5): single deterministic vectors (no seed exists).

## 5. Advance statements for (6, 10, 2) (units D_c)

Known exactly, not predictions: C <= 3.2e-5, D <= 3.9e-5 for every vector and seed; E_j1 as in section 0 item 4.

| # | statement | band |
|---|---|---|
| P-A | principal signal of the targets: A(a), A(b) | [0, 0.10] (no active coherent class at r = 13, 14; at lam = 9 the part of A from X was 0.016, 0.004) |
| P-B | own-character signal: B(a), B(b) | [0, 0.15] |
| P-C | n = l^2 normaliser term: C(a), C(b) | [2.5e-5, 4e-5] (known: 3.15e-5) |
| P-D | squarefree-n non-principal part: D(a), D(b) | [2e-5, 5e-5] (known: 3.9e-5, 3.0e-5); **threshold D <= 1.5: holds, vacuous at this size** |
| P-G | bulk: G(a), G(b) | [0.35, 1.25] (lam = 9: 0.49, 0.70; rows of length 3 at lam = 10: 0.65 to 1.08 of their diagonal) |
| P-x | cross terms: \|x_CD\| + \|x_CG\| + \|x_DG\| for a, b | <= 0.03 (Cauchy-Schwarz with C, D <= 4e-5 and G <= 1.25 gives 0.02) |
| P-E | total: e_c(a), e_c(b) | [0.40, 1.40]; in particular **not above 1.429**, the upper edge of the random band of c10: the excess 0.69 / 1.00 of (6, 9, 2) is absent |
| P-cm | class cm, 24 seeds: D <= 5e-5 for all; median of e_c | median in [0.6, 1.6]; no band for single seeds (their Moebius sums are unconstrained) |
| P-ru | class ru, 24 seeds: D <= 5e-5 for all; e_c | at least 20 of 24 seeds in [0.5, 1.5] **if** the cofactor-slot energy SDA_6/D_6 (printed by `rows.py`; the exact mean of the squarefree-row energy over this class) is in [0.7, 1.3]; otherwise the class mean of e_s must equal SDA_6/D_6 within 25% |
| P-mu | mu: e_c >= 20; A is the largest part | (no cancellation in its Moebius sum; rows of length 3: 167) |
| P-al | al: e_c >= 1e6 | operator-norm size |
| P-sep | at (6, 10, 2): the targets are not separated from the class cm: e_c(a), e_c(b) and G(a), G(b) each lie between the minimum and the maximum of the 24 cm seeds | advance statement for lam = 10 only. My expectation: holds for b; for a it is open (at lam = 9 a was below the class in G; if the same seeds-to-target order is a property of the vector, G(a) is again below all 24) |

At (6, 9, 2) (round-10 size) the same table was produced for the seed classes before this file was hashed (section 0
item 6); nothing about (6, 9, 2) is an advance statement.

## 6. Outcome rule (fixed now)

Registered consequences of the assignment: (1) bounded and target not separated from multiplicative signs: closes
the model question (item 23 final); (2) bounded for targets and unbounded for seeds: a deepen lane in round 12;
(3) unbounded for targets: closes it against the device.

- "Bounded for targets" is read over the sizes at which D is exact: (6, lam, 2), lam = 9, 10, 11, 12. By section 0
  item 3 it is false (2.80, 2.98 at lam = 12), and the seeds are unbounded in the same way and not separated from
  the targets. **Outcome (3) with the non-separation of (1): item 23 final, the device stays closed.** This is fixed
  before the run.
- The run decides only the following, and each outcome is recorded as stated:
  (R-a) identity exact for all 53 vectors at both sizes and the stored rows reproduced: the decomposition is
        accepted. If the (6, 9, 2) rows differ from the stored ones the lam = 10 result is void.
  (R-b) P-E holds for a and b: the completed-row excess at this vertex is confined to the resonant lengths of the
        companion (lam = 0 mod 3); recorded as the off-resonance check of the reading in section 0.
  (R-c) P-E fails upward (e_c(a) or e_c(b) > 1.429 at lam = 10) with C, D < 1e-4: there is an excess that is not
        the cube term; the part of the table that carries it (A, B or G) is named, and this, not item 23, is
        proposed as the round-12 deepen item.
  (R-d) separation in the bulk. If G(a) is below all 24 cm seeds at (6, 10, 2) as well (it was at (6, 9, 2)): recorded
        as "bulk of target a below the multiplicative-sign class at two sizes" (probability 1/25 per size for an
        exchangeable draw); it concerns G, not the cube term, it is in the direction of smaller energy, and it is
        proposed as the round-12 deepen item in place of item 23. If G(a) is inside the cm range at (6, 10, 2): the
        lam = 9 position is recorded as one extreme draw of 48 and no item is proposed. In neither case is the
        device reopened by this lane: D of the targets is inside both classes at both resonant sizes.
  (R-e) the run does not finish in 3 hours or exceeds its memory limit: NOT-RUN; the decision of the first bullet
        stands on stored data and is labelled as such.

Scope: one q, N = 6, d = 2, 49 rows; lam = 9 and 10 in full, lam = 11, 12 for the cube parts only (no S_6). No
exponent is fitted. "Unbounded" means: exceeds the registered constant 1.5 at an exact size inside 2 <= h <= 3 and
grows by the companion's factor 5.10 from lam = 9 to 12; a growth law in lam is not measured beyond these two
resonant sizes.

## 7. Planned memory and cost

`ffy ytab 7 2 6 10`, 16 threads: tables of the 23,632 cofactor primes 2.36 GB; per thread 0.23 GB (bit-sliced
counters, 26 planes) + 0.008 GB; output 0.09 GB; total about 6.3 GB (printed by the kernel before allocation). Unit
limit requested: 12 GB, 16 cores. Time: the (6, 9, 2) run of this kernel took 227 s on 12 cores for 4,483,696 primes (0.61 ms per prime and core;
c10: 9.1 ms); at lam = 10 this gives about 1.7e4 core-seconds, 18 to 25 minutes on 16 cores. The full row at
(6, 12, 2) would cost about 7e5 core-seconds (12 hours on 16 cores): outside the 3-hour rule, not run.
Assembly `rows.py`: 51 weights x 117,649 cofactors x 49 rows, below 2 GB.
