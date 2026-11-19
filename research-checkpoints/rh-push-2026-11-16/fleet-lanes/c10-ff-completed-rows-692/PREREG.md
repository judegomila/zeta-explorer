# PREREG: c10-ff-completed-rows-692

Written 2026-11-19 06:30 UTC, before any run of the configuration (N, lam, d) = (6, 9, 2) and before any server run
of this lane. Hashes of kernel, assembly and prediction files at this time: `logs/prereg_hashes.txt`.
Model computation in F_q[T], q = 7. No statement about zeta or about zeros of any number-field L-function is
tested. In the model the Riemann hypothesis for the twist family is Weil's theorem.

## 0. What was already seen when this file was written (disclosure)

- c9 (`c9-mv6-ff-window-exact`): all its results, in particular the stored exact rows at (3, 9, 2) and (0, 9, 2),
  q = 7, which are two of the three pieces of the completed (6, 9, 2) row.
- This lane, local (through `scripts/memcap.sh 8`):
  - validation of the modified kernel `ffw6.c` (section 4): identical to stored files / `ffx en` at N = 0, 2, 3, 4;
  - one timing run at (5, 6, 2) (not in the plan; its ENW lines were printed, energy/diagonal for a = 0.73);
  - `predict6.py`: the exact parts of the completed (6, 9, 2) row that do not depend on the new run. **These are
    known, not predicted:** for target a, E_1/D_c = 0.0588, E_2/D_c = 1.377, cross_12/D_c = 0.0247 (sum K = 1.461);
    b: 0.119, 1.278, 0.0098 (K = 1.407); one: 0.047, 4.086, 0.869 (K = 5.00); mu: 23.2, 0.101, 1.88 (K = 25.2).
  - exact inputs of the law: S_cop(0) of the length-6 vectors (a: 372146768 = 83.0 pi(9); b: -883288112 =
    -197.0 pi(9); one: 0; mu: -452144872032), mean of V_2(m)^2 (a: 76.2; b: 70.6; one: 252; mu: 6).
- Not seen: any row S_6(m) at (6, 9, 2), for any vector. The squarefree row, its energy, its sum over m, the cross
  terms of S_6 with the cube terms, and the completed energy are unknown.

Consequence stated in advance: the number "about 0.8" of c9 section 10 for the cube term is already missed by
the exact cube term E_2/D_c = 1.377 for target a (ratio 1.72; band of 25%: [0.6, 1.0]). The law with exact
inputs gives Delta_2 = 1.390 (ratio 0.99). The heuristic used |V_2|^2 = q^2 = 49; the exact mean square is 76.2.
Likewise "about 0.02" for the squarefree part assumed |M_6|^2 = q^6; the exact Moebius sum of target a is 83.0
= 0.24 q^3, and the law gives B_0 = 0.00125 (b: 0.0070).

## 1. Object

Conventions of `ffx.c` (rounds 7 to 9): q = 7, chi_0 of order 6, chi_c(x) = chi_0(Res(c, x)), g_3(1, c) =
G_2^(deg c) zeta_6^(g(c)) for squarefree monic c, Jbar = q^2/G_2^3 (norm q).

Completed marked row, total length N + lam = 15, marks = all 4,483,696 primes P of degree 9, row variable m monic
of degree 2 (49 rows), vector u, in units G_2^15:

    R_m = S_6(m) + Jbar V_1(m) S_3(m) + Jbar^2 V_2(m) S_0(m),
    S_{N'}(m) = sum_P sum_{A' monic squarefree, deg A' = N'} zeta_6^(g(P A')) u(A') chi_{P A'}(m),
    V_j(m)   = sum_{n monic, deg n = j} u(n)^3 chi_n(m)^3        (all 7 and 49 polynomials n; no P | n since lam > 2).

- S_6: kernel `enw` of `ffw6.c` = `ffw.c` of c9 (the streaming form of kernel `en` of `ffx.c`; `sc` and `row` of
  `ffx.c` unchanged) with the cofactor limit nA <= 4096 lifted to nA = 7^6 = 117,649. Changes listed in the header of
  `ffw6.c`: chunked counting, a table for x mod q, prefetch of the table TA, printed allocations, timing lines.
- S_3, S_0: stored exact rows of c9 (`ref/q7_N3_lam9_d2.txt`, `ref/q7_N0_lam9_d2.txt`), re-computed by `ffw6` on
  the server as part of the validation.
- Assembly: `assemble6.py` (exact, Z[zeta_6]).

Diagonal of the row Gram form, units q^15. Terms are grouped by the character m -> chi_{P A' n^3}(m):

    D_c = np [ D_6 + q sum_{A' in supp_3} sum_{n linear} #{m : (m, A' n) = 1}
               + q^2 sum_{n of degree 2, squarefree, u(n) != 0} #{m : (m, n) = 1}
               + q^2 sum_m | sum_{l linear, l !| m} u(l^2)^3 |^2 ],        D_6 = sum_{A' in supp_6} #{m : (m, A') = 1}.

Last term: for n = l^2, chi_n^3 = chi_l^6 is the principal character mod l, so the 7 terms n = l^2 carry the same
character chi_P and are added before squaring. The naive value (7 different characters) is reported beside it;
the two differ by 1.5% of D_c. For u = mu the terms n = l^2 are absent (mu(l^2) = 0).

Dual lengths: r = k + N + lam - 1 - d = 12 (k = 0), 13 (k = 1); rmax = 13. Argued threshold of c9 section 4 for
completed rows: r > 2N - 3 = 9 (met); threshold for squarefree rows: r > 3N - 3 = 15 (not met). h = r/N = 2 to 2.17.

## 2. Statistics (exact rationals)

For each vector: E_c = sum_m |R_m|^2, e_c = E_c/D_c, **completed excess x_c = e_c - 1**;
squarefree part: E_0 = sum_m |S_6(m)|^2, e_s = E_0/D_0 (D_0 = np D_6), x_s = e_s - 1, and its coherent part by
Bessel's inequality along c_0 = 1: b_s = |sum_m S_6(m)|^2 / (q^d D_0) (the only active class of the round-8 law at
(6, 9, 2) is k = 0, r = 12);
decomposition E_c = E_0 + E_1 + E_2 + cross_01 + cross_02 + cross_12, E_j = q^j sum_m |V_j|^2 |S_{6-3j}|^2;
split of E_c and E_0 between the 7 square rows m = l^2 and the 42 others.

## 3. Vectors and controls

Probe vectors: `a` (primary; quadratic character of conductor T^3 + 2), `b` (conductor of index 8, degree 3),
`one` (trivial target). Controls:
- `mu`, the Liouville-twisted vector (u = mu; u(n)^3 = mu(n) in V_j);
- `al`, aligned vector: coefficient conj(chi_{P A' n^3}(m_0)), m_0 the first irreducible quadratic;
- seeded random vectors, three seeds (kernel seeds 11, 12, 13 for the pairs (P, A') of S_6): independent sixth
  roots of unity. Their cube parts use the stored random rows of c9 (seed 11 at N = 3, seed 12 at N = 0) times
  seeded random sixth roots on n (`random.Random(20261119 + i)`, i = 0, 1, 2). The three vectors are therefore
  independent in the S_6 part (86% of the diagonal) and in the phases on n, and share the companion rows.

## 4. Validation before the run (first step)

Done locally (`validate6.sh`, `check_n3.py`, `check_poly_j2.py`; logs in `logs/`):
1. `ffw6 enw` against the stored exact files of c9: (2, 7, 2), (3, 6, 2), (3, 6, 1), (0, 6, 2): every ENW and ROW
   line identical (six vectors; three at N = 0).
2. `ffw6 enw` against `ffx en` at N = 4: (4, 5, 2), (4, 5, 1): np, sumnorm, diag, sW2 identical, five vectors.
3. `assemble6.completed` at N = 3 against the stored completed energies and diagonals of c9 at (3, 9, 2): six of
   six identical.
4. The j = 2 term by polynomiality: q = 7, d = 2, lam = 1, N = 6, P = T and P = T + 3: S_6 + Jbar V_1 S_3 +
   Jbar^2 V_2 S_0 = 0 on all 42 rows coprime to P; not zero without the n = l^2 terms (56154), with J for Jbar
   (1010394), or for the squarefree row alone (100842).
To be done on the server before the production run is accepted:
5. the same comparisons with the OpenMP build, plus the stored files at lam = 9: (2, 9, 2), (3, 9, 2), (0, 9, 2);
6. at N = 6 (limit lifted): `ffw6 enw` at (6, 7, 1), vector a, against the independent closed-form kernel
   `ffx row` (direct resultants, no tables), all 7 rows; and the two code paths of `ffw6` (bit masks / bytes)
   against each other at the same size.
If 5 fails the production run is not started. If 6 fails the production result is void.

## 5. Predictions

Stated by c9 section 10 (the prediction named in the assignment): completed excess about 0.8, squarefree part
about 0.02. Law with exact inputs (`predictions6.txt`, written before the run):

| vector | B_0 law (coherent part of the squarefree row) | K (exact, known) | x_c if S_6 is at its diagonal and uncorrelated with the cube terms: D_0/D_c + K - 1 |
|---|---|---|---|
| a | 0.00125 | 1.461 | 1.32 |
| b | 0.00702 | 1.407 | 1.27 |
| one | 0 | 5.00 | 4.86 |
| mu | 1833 | 25.2 | about 0.73 to 1 times 1833 x 0.874, plus 25 |

Advance statements about the unknown quantities:
- (L) literal reading of the c9 numbers: x_c(a) in [0.6, 1.0]; b_s(a) in [0.015, 0.025].
  My expectation before the run: (L) fails for b_s (law value 0.00125) and probably for x_c (1.32 expected).
- (X) law with exact inputs: x_c(a) in [0.99, 1.65] and x_c(b) in [0.95, 1.58] (25% around 1.32 and 1.27).
- (B) b_s / B_0 law in [0.55, 1.25] for a and for b (the factor (1 - 1/q)^2 = 0.73 of c8/c9 at r >= 6, widened by
  25%), and b_s(one) = 0 exactly.
- (S) the squarefree row is not above the diagonal: e_s <= 1.2 for a, b, one (c8: 95% of the non-coherent parts
  are <= 1.1); no lower bound is predicted (c8: n can be far below 1).
- (C) controls: each random vector has e_s and e_c in 1 +- 3/sqrt(49) = [0.571, 1.429] and E_2/D_c <= 0.2;
  `al` has e_c >= 100; `mu` has e_s and e_c >= 500.
  "Controls separated": (C) holds and e_c(a), e_c(b) > 1.429.

## 6. Outcome rule (fixed now)

1. **Assignment rule, literal:** CONFIRMED-AS-STATED iff (L) and "controls separated". (Expected: not met, for
   the two reasons disclosed in section 0.)
2. **Cube term at the size of the law with exact inputs:** CONFIRMED-EXACT-INPUTS iff (X), (B) for a and b, (S),
   and "controls separated". Then: the completed row of a Weil target is above the diagonal at h = 2 to 2.17 by the
   cube term, the squarefree row is not, and the step of the c9 scaling that fails at 25% accuracy is named as
   the constant, not the mechanism: |V_2|^2 = q^2 (exact mean 76.2 for a) and |M_6|^2 = q^6 (exact 83.0^2).
3. If (X) fails: the additive step "completed energy = diagonal part + cube terms" fails; report which of
   e_s (S_6 not at its diagonal) or cross_01 + cross_02 (S_6 correlated with the cube terms) is responsible, from
   the exact decomposition.
4. If "controls separated" fails: the result is void for the conclusion about targets.
5. If the run does not fit (time limit 3 hours, memory limit of the unit): NOT-RUN with the measured cost; no
   neighbouring triple is substituted.

Scope stated in advance: one configuration, one q, 49 rows. No slope is measured; "above the diagonal at one
size" is a consistency statement with the argued threshold r > 2N - 3, not a growth law. No requirement flag can
rise. Proposed device state (ff-order2-vertex-probe: closed at vertices with 2 <= h <= 3) is a proposal for the
engine, made only under outcome 1 or 2.

## 7. Planned memory and cost

`ffw6 enw 7 2 6 9`, 8 vectors: TA (Res(A', r) table) 117649^2 bytes = 13.84 GB; T 0.006 GB; bit masks 0.035 GB;
planes 0.007 GB; A' list 0.019 GB; per thread about 0.003 GB. Requested unit limit 15 GB. Estimated time from the
local timing at (5, 6, 2) (1.2 ms per prime at nA = 16807, single core): about 9 ms per prime, 4.0e4 core-seconds
plus the table build; 12 cores: about 1 to 1.6 hours. The independent check at (6, 7, 1) needs the same table
(15 GB, 4 cores). Lane total 16 cores, 30 GB.
