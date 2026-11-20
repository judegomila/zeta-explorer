# c11-ff-row-energy-four-part: exact decomposition of the completed-row energy at (6, 9, 2) and (6, 10, 2), q = 7, with seeded classes; cube parts at lam = 9..12

Internal working note, 2026-11-19. Slug `c11-ff-row-energy-four-part`. Kind: compute (heavy lane). Refereed by the
author only (`REFEREE.md`; no independent referee). Nothing committed, pushed or posted. Written: this directory,
`~/rh-push/c11-ff-row-energy-four-part/` on the compute server (computations through `rhrun` only), one line in
`campaign/lanes.jsonl`.

This note makes **no statement about zeta** and none about zeros of any number-field L-function. It is a
function-field model computation in which the Riemann hypothesis for the twist family is Weil's theorem.
7/8 (unrefereed) stands; RH open. NO QED.

Labels: PROVED / EXACT (equality of exact integers or rationals on the stated cases) / MEASURED (ratios of exact
integers; no identity claimed) / ARGUED / NOT-RUN / OPEN.

## 0. Verdict

**Precise obstruction, model level; the model question of STRATEGY 3.1 item 23 is closed against the device. The
squarefree-n non-principal part D of the cube term is not bounded by 1.5 diagonals: it is 0.57 / 0.60 of the
diagonal at (6, 9, 2) and 2.80 / 2.98 at (6, 12, 2) for the two targets (EXACT), it is the companion row's energy
times a count, and the targets are not separated from random multiplicative signs or from random unimodular
vectors in it. Compute lane; no requirement flag; no answer for R4.**

1. **First lemma (EXACT).** The registered decomposition E_c = A + B + C_perp + D + G + x_CD + x_CG + x_DG
   (section 2) holds as an identity of rationals for 53 of 53 vectors at (6, 9, 2) and 53 of 53 at (6, 10, 2). At
   the round-10 size E_c, D_c, |Tq|^2, |Tf|^2 of one, a, b, mu, al are the integers of c10's `results6.json`.
2. **Decisive first test (EXACT, local, before PREREG).** The cube-term parts need only the companion row S_0,
   which c9 stored for lam = 9..12. Units D_c:

   | (6, lam, 2) | companion energy / diagonal | D(a) | D(b) | D, 24 multiplicative-sign seeds: min, median, max | D, 24 unimodular seeds | whole cube term E_2 (a, b) |
   |---|---|---|---|---|---|---|
   | lam = 9 | 37.53 | 0.569 | 0.603 | 0.394, 0.598, 0.977 | 0.468, 0.617, 1.023 | 1.377, 1.278 |
   | lam = 10 | 0.00178 | 3.9e-5 | 3.0e-5 | 2.0e-5, 2.9e-5, 3.8e-5 | 2.4e-5, 3.1e-5, 3.5e-5 | 7e-5 |
   | lam = 11 | 0 | 0 | 0 | 0 | 0 | 0 |
   | lam = 12 | 191.27 | **2.798** | **2.980** | 2.05, 3.06, 5.21 | 2.32, 3.15, 5.67 | 6.92, 6.40 |

   The registered threshold (D <= 1.5 for the targets) fails at (6, 12, 2), dual lengths r = 15, 16, h = 2.5 to 2.67.
   At the registered second size (6, 10, 2) it holds for a reason unrelated to the question: the companion row is
   off resonance there (it is resonant at lam = 0 mod 3: 6.03, 37.5, 191.3 at lam = 6, 9, 12, and 0.0018, 0 at
   lam = 10, 11).
3. **Why D is not target-specific (Lemma M, PROVED; section 4).** D <= |Tf|^2 = q^2 sum_m |Vsf(m)|^2 |S_0(m)|^2 and
   the mean of |Tf|^2 over independent unimodular cube coefficients is q^2 sum_m nu(m) |S_0(m)|^2, nu(m) = number
   of squarefree n of degree 2 coprime to m (31, 36 or 41). Exact mean / D_c: 0.645 (lam = 9), 3.289 (lam = 12);
   targets: 0.717, 0.614 and 3.518, 3.034; sign seeds: mean 0.651, 3.296. The vector enters D only through the
   fluctuation of a 42-term character sum; the size is set by the companion, which does not contain the vector.
4. **Registered run (6, 10, 2) (EXACT; section 5).** 28,245,840 marked primes, 117,649 cofactors, 53 vectors,
   1188 s on 16 cores with a new kernel (`ffy.c`; identical to every stored row, including all rows of (6, 9, 2)).
   Completed energy / diagonal: 0.593 (a), 0.581 (b); 24 sign seeds 0.51 to 0.98; 24 unimodular seeds 0.53 to 1.02;
   mu 5.51; `one` 211.7; aligned 5.7e10. For the targets every signal part is small: A = 0, 0.019; B = 0, 0.003;
   C = 3.2e-5; D = 3.9e-5, 3.0e-5; bulk G = 0.594, 0.559. The excess of the completed row seen at (6, 9, 2) (0.69,
   1.00) is absent at (6, 10, 2): advance statement P-E holds.
5. **Advance statements (section 6).** 11 of 12 hold. P-mu fails: e_c(mu) = 5.51 against ">= 20", and its
   principal part is 0, not the largest part.
6. **Rule outcome (PREREG section 6).** "Bounded for targets": false on exact data (lam = 12). Targets inside both
   seed classes in D at both resonant sizes. Registered consequence: **(3) unbounded for targets, with the
   non-separation of (1): item 23 final; the device `function-field-order2-vertex` stays closed.** (R-a) holds;
   (R-b) holds; (R-c) not triggered; (R-d): G(a) is inside the sign class at (6, 10, 2) (rank 4 of 24), so its
   position below all 24 seeds at (6, 9, 2) is recorded as one extreme draw and no deepen item is proposed.
7. **Not expected, reported as measured.** (i) At (6, 9, 2) all 24 multiplicative-sign seeds are above the
   diagonal band (e_c 1.77 to 2.69, median 2.20) and 19 of 24 unimodular seeds are above 1.429: the completed-row
   excess at the resonant size is a property of the marked primes, not of the target; target a (1.688) is below
   every sign seed. (ii) `one` at (6, 10, 2): 212 diagonals, all in the bulk (squarefree row at 248 times its
   diagonal), principal part exactly 0: OPEN, as the `one` rows of c9 and c10.

## 1. Plan; flags before the work; what is new

| flag | before | after | evidence |
|---|---|---|---|
| R1 multiplicativity essential | false | **false** | the statistic is a quadratic form in the vector; D depends on the vector through 42 cube coefficients; vectors without any multiplicativity (class ru) give the same D and the same completed energy as the targets |
| R2 height-uniform, every window | false | **false** | fixed q = 7, degrees up to 18; no statement about zeros |
| R3 controls fail structurally | false | **false** | no control fails where the targets pass: the seed classes sit with the targets in every part |
| R4 reaches the critical line | false | **false** | model question inside the 7/8 architecture; the lane was assigned as "no flag, no R4 answer" |

Read: BRIEF to the end; STRATEGY v3 section 1 (compute row) and 3.1 item 23; ROUND_LOG (round-10 learn step,
combinable 1); PREREG, RESULT and REFEREE of `c10-ff-completed-rows-692`; RESULT of
`c10-ff-slot-cross-decomposition` (sections 0, 4); kernels `ffw6.c`, `ffx.c`; `assemble6.py`; map rows Z30, Z31.

Known before: c10 (one size, (6, 9, 2); cube term half n = l^2, half squarefree n; "is the second half bounded once
the principal signal is removed" left open). New here: (i) the decomposition registered part by part with an
exact identity; (ii) the cube parts at lam = 10, 11, 12 from stored rows, which decide the question; (iii) Lemma M;
(iv) a kernel 15 times cheaper per prime that returns a weight-independent table, so that 24 + 24 seeded vectors
cost nothing extra; (v) the full row at the second size with seeded classes; (vi) the seed classes at the round-10
size. No closed route is re-run.

Order of work: first lemma (local), decisive first test (local), kernel validation (server), run at the round-10
size (server), PREREG hashed (09:42:43 UTC), run at (6, 10, 2) (unit started 09:42:45 UTC), analysis (local). The
first test decided the question; the pivot allowance was not used.

## 2. Object and the registered decomposition (PREREG sections 1, 2)

Conventions of `ffx.c`; N = 6, marks = all primes P of degree lam, m monic of degree 2 (49 rows), units G_2^(6+lam):

    R_m = S_6(m) + Jbar V_1(m) S_3(m) + Jbar^2 V_2(m) S_0(m)            (c10 PREREG section 1),
    R = X + Tq + Tf,  X = S_6 + Jbar V_1 S_3,  Tq = Jbar^2 Vsq S_0  (n = l^2),  Tf = Jbar^2 Vsf S_0  (n squarefree of degree 2).

v_0 = 1; w = u(m) made orthogonal to v_0 (absent for `one`, `al`); Pi = projection off span{v_0, w}. Parts, all
divided by the completed diagonal D_c of c10: A = |<R, v_0>|^2/49 (principal signal); B = |<R, w'>|^2/|w'|^2
(own-character signal); C = |Tq|^2 (n = l^2 normaliser term; C_perp = |Pi Tq|^2 is what is left of it outside A and
B); D = |Pi Tf|^2 (squarefree-n non-principal part); G = |Pi X|^2 (bulk); cross terms x_CD, x_CG, x_DG inside the
complement. Identity E_c = A + B + C_perp + D + G + x_CD + x_CG + x_DG: exact for every vector (`fourpart.py`
asserts it with Fractions). The four parts named in the assignment are A, B, C, D; the identity needs G and the
cross terms as well, and C enters through C_perp. This was registered.

## 3. Method and validation (all EXACT)

`ffy ytab` computes Y[m][A'] = sum_P zeta_6^(cP + tp_P[m] + 4 (x_P[A'] mod 3)); then R_w(m) = sum_A'
zeta_6^t(w, m, A') Y[m][A'] for every weight on the cofactors (the fast-path formula of `ffw6.c` summed over P first;
linear in the weight, so valid for sixth-root phases). x_P[A'] mod 3 comes from the prime factors of A'
(multiplicativity of A' -> Res(A', P)); counts are accumulated in bit-sliced counters. Same object as c10.

| # | check | outcome |
|---|---|---|
| 1 | `ffy` + `ylib.py` against the stored exact rows of c9 / c10: (3, 6, 2), (3, 6, 1), (0, 6, 2), (2, 7, 2), (0, 9, 2), (3, 9, 2), (2, 9, 2), (0, 10, 2), (3, 10, 2), (6, 7, 1); vectors one, a, b, mu, al | every row, diagonal and prime count identical (41 vector-files; twice: before and after the vector definitions were moved to `vecs.py`) |
| 2 | **(6, 9, 2)**, all 49 rows of one, a, b, mu, al against c10's production file | identical (`rh-c11ff-p9`); c10 cost 40,700 core-seconds, this kernel 2,700 |
| 3 | multiplicative-sign class against fresh `ffw6 enw` runs (mode 6, seeds 1, 2, 17) at (3, 6, 2), (3, 7, 1), (2, 7, 2), (4, 5, 2) | identical, 12 of 12 |
| 4 | rows from the definition (pure python double sum over primes and cofactors) for ru1, ru2, cm3, a, mu at (2, 3, 2), (3, 4, 1) | identical, 10 of 10 (at (2, 3, 1) every row is 0: not counted) |
| 5 | (6, 10, 2): rows of length 3 and 0 against the stored files of c9 | identical (7 of 7); S_6 at lam = 10 has no stored counterpart |
| 6 | inside each run: discriminant, irreducibility, chi_P(m), cubic symbol at every fifth cofactor against direct resultants on 73 (lam = 9) and 440 (lam = 10) primes; prime count = necklace count; class counts sum to the prime count | passed |
| 7 | cube parts by a second code path (c10's `assemble6.completed`, own coefficient and diagonal code) at lam = 9, 12, vectors one, a, b, mu | D_c and E_2 equal, 8 of 8 (`check_indep12.py`) |
| 8 | first lemma at (6, 9, 2) | section 0 item 1 |
| 9 | symmetry of the production rows S_6 at lam = 9 and 10 (`check_sym.py`): translation invariance for one, mu; scaling T -> wT for a, one, mu; must fail for b, cm1, ru1 | 294 of 294; 98 of 98; fails for the three vectors without symmetry (0 of 294; 2 of 98) |

## 4. First test and Lemma M

**Lemma M (PROVED).** Let c(n), n squarefree of degree 2, be independent with E c(n) conj(c(n')) = delta_{n n'}.
Then E |Tf|^2 = q^2 sum_m nu(m) |S_0(m)|^2 with nu(m) = #{n squarefree of degree 2, (n, m) = 1}. Proof: |Tf(m)|^2 =
q^2 |Vsf(m)|^2 |S_0(m)|^2 (|Jbar|^2 = q), Vsf(m) = sum_n c(n) chi_n(m)^3 with chi_n(m)^3 in {0, 1, -1}, and S_0 does
not contain the vector. For every vector D <= |Tf|^2 (projection). So D / D_c is the companion's energy times a
count over D_c, up to the fluctuation of one 42-term sum per row.

Numbers (EXACT; `firsttest.txt`, `lemmaM.py`): nu = 31, 36, 41 (mean 36). Exact mean of |Tf|^2/D_c: 0.6452 at
lam = 9 and 3.2886 at lam = 12. Targets: 0.7173 (a), 0.6143 (b); 3.518, 3.034. 24 sign seeds: mean 0.651 (sd 0.10);
3.296 (sd 0.57). 24 unimodular seeds: 0.665 (0.13); 3.391 (0.78). `one`: 3.579, 22.19 (its Vsf is 42 on the seven
square rows); mu: 0.101, 0.625 (mean of Vsf^2 is 6).

Growth: D(lam = 12)/D(lam = 9) = 4.92 (a), 4.94 (b); the companion's energy over its diagonal grows by 6.23 from
lam = 6 to 9 and by 5.10 from 9 to 12 (q times lam/(lam + 3) is 4.67 and 5.25). Three resonant lengths; no
exponent is fitted. ARGUED: in units of the diagonal the cube term at j = N/3 scales as q^((lam - N)/3) / lam at
lam = 0 mod 3, so it exceeds any constant for lam - N large at fixed N.

## 5. The two full sizes (EXACT rationals, four digits; `summary_lam9.txt`, `summary_lam10.txt`, `parts_lam*.json`)

Units D_c. e_s = squarefree row S_6 over its own diagonal.

| size | vector | e_c | A | B | C (C_perp) | D (\|Tf\|^2) | G | x_CD | x_CG | x_DG | e_s |
|---|---|---|---|---|---|---|---|---|---|---|---|
| (6, 9, 2) | a | 1.688 | 0.5348 | 0.1377 | 0.6628 (0.0158) | 0.5688 (0.7173) | 0.4914 | 0.0071 | -0.0197 | -0.0475 | 0.567 |
| | b | 2.002 | 0.7107 | 0.0112 | 0.6628 (0.0158) | 0.6030 (0.6143) | 0.7029 | 0.0029 | 0.0076 | -0.0519 | 0.597 |
| | one | 5.905 | 1.209 | - | 0.6608 (0.0159) | 3.578 (3.579) | 0.6786 | -0.0914 | 0.0769 | 0.4382 | 0.862 |
| | mu | 1222 | 1188 | 10.75 | 0 | 0.1007 | 21.69 | 0 | 0 | 1.520 | 1368 |
| | al | 9.04e9 | 1.84e8 | - | 2184 | 7.3e4 | 8.91e9 | | | | 1.04e10 |
| (6, 10, 2) | a | 0.5928 | 0 | 0 | 3.15e-5 | 3.89e-5 | 0.5944 | -1.5e-6 | 0.0006 | -0.0022 | 0.532 |
| | b | 0.5807 | 0.0189 | 0.0027 | 3.15e-5 | 2.95e-5 | 0.5587 | 1.7e-6 | 0.0012 | -0.0009 | 0.669 |
| | one | 211.7 | 0 | - | 3.15e-5 | 3.15e-5 | 211.7 | -6e-5 | 0.0338 | -0.0338 | 247.8 |
| | mu | 5.510 | 0 | 0 | 0 | 8.7e-7 | 5.511 | 0 | 0 | -0.0015 | 0.913 |
| | al | 5.69e10 | 1.16e9 | - | 1.4e4 | 4.6e5 | 5.61e10 | | | | 6.52e10 |

At (6, 9, 2) the principal signal A of the targets is the normaliser term: of A = 0.535 (a), 0.711 (b) the n = l^2
term alone gives 0.647 along v_0, X gives 0.016, 0.004 (the rest is interference). The own-character signal of
target a (0.138) is carried by Tf (0.149 along w'), not by the squarefree row (0.002): this is why D(a) = 0.569
is below |Tf|^2 = 0.717. At (6, 10, 2) the principal part is exactly 0 for a, one, mu and 0.019 for b. ARGUED: these three vectors are
invariant under T -> wT (w^3 = 1), under which the row at m changes by chi_0(w) to a power fixed by the degrees; at
total degree 16 that phase is a non-trivial cube root of unity (at degree 15 it is 1), so the sum over each orbit
vanishes and the row at m = T^2 is 0. `check_sym.py` on the production rows: m = T^2 gives (0, 0) for a, one, mu at
lam = 10 and not at lam = 9; norms equal on scaling orbits 98 of 98 (a, one, mu) against 2 of 98 (b, cm1, ru1); rows of
one and mu equal under translation 294 of 294 at both sizes.

Seed classes, 24 seeds each: minimum | median | maximum.

| size | class | e_c | A | B | C | D | G | e_s |
|---|---|---|---|---|---|---|---|---|
| (6, 9, 2) | cm (multiplicative signs) | 1.765, 2.197, 2.694 | 0.387, 0.648, 0.954 | 0.0003, 0.031, 0.127 | 0.6608 | 0.394, 0.598, 0.977 | 0.548, 0.838, 1.058 | 0.557, 0.849, 1.102 |
| | ru (unimodular) | 1.095, 1.695, 2.314 | 0.008, 0.049, 0.398 | 0.004, 0.040, 0.092 | 0.029 to 0.348 | 0.468, 0.617, 1.023 | 0.547, 0.911, 1.328 | 0.625, 0.902, 1.126 |
| (6, 10, 2) | cm | 0.507, 0.739, 0.983 | 0.002, 0.010, 0.054 | 0.001, 0.011, 0.068 | 3.1e-5 | 2.0e-5, 2.9e-5, 3.8e-5 | 0.497, 0.711, 0.964 | 0.530, 0.723, 1.098 |
| | ru | 0.525, 0.816, 1.019 | 0.001, 0.009, 0.046 | 0.001, 0.012, 0.063 | <= 1.7e-5 | 2.4e-5, 3.1e-5, 3.5e-5 | 0.518, 0.803, 0.992 | 0.537, 0.733, 0.924 |

Cofactor-slot energy over the diagonal (exact mean of the squarefree-row energy over the class ru): 0.851 at
(6, 9, 2) (class mean of e_s 0.878), 0.737 at (6, 10, 2) (0.753); for rows of length 3: 1.425, 1.178.

Rank of the targets among the 24 sign seeds (0 = below all, 24 = above all): (6, 9, 2): e_c a 0, b 6; D a 5, b 13;
G a 0, b 3; A a 4, b 16; B a 24, b 2. (6, 10, 2): e_c a 4, b 2; G a 4, b 3; D a 24 (3.9e-5 against a maximum of
3.8e-5), b 13.

Reading (model statements). (a) The completed row is above the diagonal band at the resonant size for every
class that shares the marked primes: 24 of 24 sign seeds and 19 of 24 unimodular seeds exceed 1.429 at (6, 9, 2);
none of 48 does at (6, 10, 2). (b) The targets are at the low end of the classes (ranks 0 to 6 in e_c): a row
bound at the diagonal is not what distinguishes them; where it fails it fails for all, through C and D, which do
not see the vector. (c) The bulk G of the targets is 0.49 to 0.70, below the class medians 0.71 to 0.91 at both
sizes; a is below all 48 seeds at (6, 9, 2) and inside at (6, 10, 2).

## 6. Advance statements for (6, 10, 2) (PREREG section 5) and outcomes

| # | statement | outcome |
|---|---|---|
| P-A | A(a), A(b) in [0, 0.10] | 0; 0.0189: holds |
| P-B | B(a), B(b) in [0, 0.15] | 0; 0.0027: holds |
| P-C | C in [2.5e-5, 4e-5] (known) | 3.15e-5: holds |
| P-D | D in [2e-5, 5e-5] (known); threshold D <= 1.5 | 3.9e-5, 3.0e-5: holds; vacuous at this size, as registered |
| P-G | G(a), G(b) in [0.35, 1.25] | 0.594, 0.559: holds |
| P-x | sum of \|cross terms\| <= 0.03 | 0.0028, 0.0021: holds |
| P-E | e_c(a), e_c(b) in [0.40, 1.40], not above 1.429 | 0.593, 0.581: holds |
| P-cm | D <= 5e-5 for 24 seeds; median e_c in [0.6, 1.6] | max 3.8e-5; 0.739: holds |
| P-ru | D <= 5e-5; SDA_6/D_6 = 0.737 in [0.7, 1.3], so at least 20 of 24 seeds in [0.5, 1.5] | max 3.5e-5; 24 of 24: holds |
| P-mu | e_c(mu) >= 20 and A the largest part | **fails**: 5.51, A = 0 (bulk 5.51; its squarefree row is at 0.913 of its diagonal; the j = 1 term is 2.99) |
| P-al | e_c(al) >= 1e6 | 5.7e10: holds |
| P-sep | e_c and G of a and b inside the range of the 24 sign seeds | ranks 4, 2 and 4, 3: holds |

The failure of P-mu and the size of `one` (not registered) show that which of mu / `one` has the uncancelled
squarefree row changes with (N, lam): (6, 9, 2): mu 1368, one 0.86; (6, 10, 2): mu 0.91, one 248; rows of length 3
at lam = 10: mu 167, one 0.65. My prediction rule for mu ("no cancellation in its Moebius sum at every size") was
wrong. Not explained here.

## 7. Controls

| control | what was run | outcome | named step |
|---|---|---|---|
| random completely multiplicative signs, 24 seeds | both sizes, full decomposition; cube parts at lam = 9..12 | same D as the targets (Lemma M); completed row above the band at the resonant size, inside it off resonance | D and C do not contain the vector beyond 42 + 7 cube coefficients |
| random unimodular vector on cofactors, 24 seeds | same | same D; C smaller (0.03 to 0.35: its n = l^2 coefficients are random signs); e_c 1.10 to 2.31 at resonance | same; class mean of the squarefree row = cofactor-slot energy (exact) |
| Liouville-twisted vector (mu) | same | (6, 9, 2): 1222, principal; (6, 10, 2): 5.51, bulk; C = 0 (mu(l^2) = 0), D = 0.10, 8.7e-7 | section 6 |
| aligned vector | same | 9.0e9, 5.7e10 | operator-norm size |
| trivial target (`one`) | same | 5.9 at (6, 9, 2) (D = 3.58); 211.7 at (6, 10, 2), bulk | OPEN |
| per-(P, A') random phases of c10 | not rerun | c10: 0.80 to 1.07 at (6, 9, 2) | - |
| Davenport-Heilbronn, backward heat, sign-twisted primes, unimodular twist as a family, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | not run | - | no zero statement and no positivity statement is made; the lane tests no mechanism claimed to be specific to zeta |

The statistic does not separate the targets from the seed classes in the direction a proof would need: where the
row bound fails, it fails for all classes that share the marked primes.

## 8. Requirement flags (result)

R1 = false, R2 = false, R3 = false, R4 = false (table in section 1). No flag was claimed and none is established.

## 9. Three weakest steps

1. **"Unbounded" rests on two resonant lengths at one N, one d, one q, and at lam = 12 only the cube parts are
   exact.** The full row at (6, 12, 2) was not computed (about 7e5 core-seconds with the new kernel; outside the
   3-hour rule), so the total e_c there and the cross term x_DG between the squarefree-n part and the bulk are
   unknown; D is a part, not the energy. The registered second size (6, 10, 2) turned out to be off resonance, so
   its threshold test is vacuous and the decision was already fixed by stored data before the run (stated in
   PREREG). The constant 1.5 is the assignment's; the scaling q^((lam - N)/3)/lam is argued from three companion
   values, not fitted or proved.
2. **The decomposition is one choice among several, and it inherits the open points of c10.** The order of the
   projections, the own direction w = u(m), and the grouping of the n = l^2 terms in the diagonal are conventions;
   C lies almost entirely inside A (97.6% along v_0), so "four parts" is exact only with G and the cross terms.
   The completion formula is still verified by polynomiality only up to conductor degree 2 (c10 referee); for the
   class ru (not multiplicative) the "completed row" is the same formula applied formally. Non-separation is a
   rank among 24 seeds: target a lies below all 48 seeds in G and below all 24 sign seeds in e_c at (6, 9, 2).
3. **S_6 at (6, 10, 2) has no independent recomputation.** The kernel is new (bit-sliced counters, multiplicative
   cubic symbols); it reproduces every stored row (including all of (6, 9, 2) and (6, 7, 1)) and the definition at
   two small sizes, and its internal self-checks cover 440 primes at lam = 10, but the production table itself was
   computed once. One advance statement (P-mu) failed and the row of `one` at (6, 10, 2) (248 diagonals, principal
   part exactly 0) is unexplained; both concern vectors outside the question, and both show that the lane does not
   control the squarefree row of the trivial and Liouville-twisted vectors.

## 10. Compute record

Server ([compute-server]), every computation through `~/rh-push/bin/rhrun`; `rhstatus` read before each launch
(rh.slice at 8 to 14 GB; three units of another workflow and `rh-balancer` running, not touched). GPU not used.
Planned memory printed by the kernel before allocation.

| unit | cores, memory limit | what | outcome |
|---|---|---|---|
| rh-c11ff-val-1119093322, rh-c11ff-val-1119093540 | 8, 8 GB | validation job | failed at once: the directory was empty (a zsh expansion `$R:rh` mangled the rsync destination and the files went to a local subdirectory, removed). Nothing ran |
| rh-c11ff-val-1119093600 | 8, 8 GB | build; validation items 1, 3 (and (6, 7, 1)) | all identical; 61 s |
| rh-c11ff-val2-1119093724 | 4, 8 GB | the same after `ylib.py` was switched to `vecs.py` | all identical |
| rh-c11ff-p9-1119093724 | 12, 12 GB | Y tables at (0, 9, 2), (3, 9, 2), (6, 9, 2); stored-row comparison; rows of 53 vectors | rc 0; N = 6: tables 17 s, prime loop 227 s; planned 5.05 GB, about 4 GB used |
| rh-c11ff-p10-1119094245 | 16, 12 GB | **registered run**: Y tables at (0, 10, 2), (3, 10, 2), (6, 10, 2); rows of 53 vectors | rc 0; N = 6: tables 12 s, prime loop 1176 s (1.88e4 core-seconds; 0.67 ms per prime and core); planned 6.19 GB |
| rh-c11ff-brute-1119100413 | 4, 4 GB | validation item 4 | pass |

Largest simultaneous request: 12 + 4 cores, 20 GB; the registered run alone: 16 cores, 12 GB, 20 minutes. No job
longer than 3 hours. No unit of this lane is active (checked with `systemctl --user list-units "rh-c11ff*"`); no
unit was stopped by hand; no process was killed. Not through `rhrun`: rsync and status / log reads over ssh.
Local (Mac), through `scripts/memcap.sh 8`: `lemma1.py`, `firsttest.py`, `known10.py`, `lemmaM.py`,
`check_indep12.py`, `analyze.py`, one small `ffy` build test. Local python has no numpy; every step that reads a Y
table ran on the server.

Files: `PREREG.md` (hash in `logs/prereg_hashes.txt`, 09:42:43 UTC; unit of the registered run 09:42:45 UTC),
`RESULT.md`, `REFEREE.md`; kernel `ffy.c` (new), `ffx.c`, `ffw6.c`, `ffw.c`, `ffpy.py`, `plan.py`, `assemble6.py`,
`results6.json` (copies from c10, unchanged); `vecs.py`, `ylib.py`, `rows.py`, `fourpart.py`, `analyze.py`,
`lemma1.py`, `firsttest.py`, `known10.py`, `lemmaM.py`, `check_brute.py`, `check_indep12.py`, `check_sym.py`; `job_*.sh`, `sync.sh`;
`ref/` (stored exact rows of c9, c10); `results_srv/` (rows of every vector as exact integers:
`rows_lam9.json`, `rows_lam10.json`; table headers); `summary_lam*.txt`, `parts_lam*.json`, `firsttest.txt/.json`,
`lemma1_692.json`; `logs/`. The Y tables (92 MB each) stay on the server under `results/`.

## 11. For the next allocation; proposed map text (not applied)

- Item 23 of STRATEGY 3.1: final. Device `function-field-order2-vertex`: closed, now with a second referee-free
  size and the cube parts at four lengths. No deepen lane is proposed from this lane.
- Tool: `ffy ytab` makes any vector on the cofactors free once the table exists; the tables for (6, 9, 2) and
  (6, 10, 2) are on the server. A full row at (6, 12, 2) costs four 3-hour jobs on 16 cores; it would give the total
  at the second resonant size and is not needed for the decision.
- OPEN in the model, outside the question: the squarefree row of `one` at (6, 10, 2) (248 diagonals, no principal
  component) and the swap between `one` and mu from lam = 9 to 10.

Proposed addition to row Z30 (F_q[T] part): "Row energy split exactly into principal signal, own-character signal,
n = l^2 normaliser term, squarefree-n non-principal part D, bulk and cross terms (`c11-ff-row-energy-four-part`;
q = 7, N = 6, d = 2; identity exact for 53 vectors at (6, 9, 2) and (6, 10, 2); kernel identical to all stored rows).
D = 0.57, 0.60 of the diagonal at lam = 9 and 2.80, 2.98 at lam = 12 for two quadratic targets (exact from stored
companion rows; cube term 6.9, 6.4 at lam = 12); 3e-5 at lam = 10 and 0 at lam = 11 (companion off resonance).
Mean of the squarefree-n term over unimodular cube coefficients = q^2 sum_m nu(m)|S_0(m)|^2 (proved): 0.645, 3.289;
24 random multiplicative-sign seeds 0.39 to 0.98 and 2.05 to 5.21: targets not separated. Completed row at
(6, 10, 2): 0.59, 0.58 (targets), 0.51 to 1.02 (48 seeds); at (6, 9, 2) all 24 sign seeds are above the band (1.77 to
2.69). Full row at lam = 12 not computed. One author referee pass."

No statement about zeta. No abscissa below 0.874886647 is proved.
