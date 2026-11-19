# REFEREE2 of this lane (third reading of the statement; referee of the second referee's proof): Proposition B (blockwise Hilbert-Schmidt bound) of the second referee of `c7-probe-format-h-cap`

2026-11-18, lane `c9-repair-referee-debts-r8`. Target: `push/c8-repair-engine-map-r7/c7-probe-format-h-cap/REFEREE2.md`,
section 2 (Proposition B, written by that referee and not refereed). No file of either earlier lane was edited.
Script `ref3_blocks.py`, log `ref3_blocks.log` (numpy, one local run through `scripts/memcap.sh 8`, largest array
5.8 MB, printed before allocation). No server use. No statement about zeros is made or checked.

## Outcome

| item | this pass |
|---|---|
| Proposition B as stated (product partitions of rows and columns) | **holds** (PROVED; re-derived; new numerical cases) |
| extension: column partition depending on the row block | **holds** (PROVED here, same two lines) |
| extension: arbitrary tilings of the index rectangle by rectangles | **holds narrowed**: PROVED here under an added hypothesis (lower flatness of A), not in general |
| hypotheses on the reflected coefficients (positive proportion of unimodular entries per block; no large entry of beta') | **not checked in the sources** (unchanged; they are assumptions of the statement) |

No requirement flag changes (target-independent statement: holds for every control; R1 = R2 = R3 = R4 = false).

## 1. Proposition B

Statement: rows partitioned into I_i, columns into J_j, each block T_ij with at least a proportion c of entries of
modulus 1, abs(beta_n) <= b1 norm(beta) D^(-1/2). Then sum_{i,j} norm(A_i) norm(T_ij) norm(beta_j) >= (c^(1/2)/b1) norm(A) norm(beta) D^(1/2).

Re-derivation. (1) norm(T_ij)^2 >= norm(T_ij)_HS^2/rank >= c abs(I_i) abs(J_j)/min(abs(I_i), abs(J_j)) >= c abs(J_j).
(2) norm(beta_j)^2 <= b1^2 norm(beta)^2 abs(J_j)/D, so abs(J_j)^(1/2) >= norm(beta_j) D^(1/2)/(b1 norm(beta)).
(3) sum_j norm(beta_j) abs(J_j)^(1/2) >= norm(beta) D^(1/2)/b1 (sum of norm(beta_j)^2 = norm(beta)^2).
(4) sum_i norm(A_i) >= norm(A). Multiply (3), (4) and c^(1/2). **Holds.** The step uses only that the column blocks
met by one row block partition the columns.

**B' (row-dependent column partitions; PROVED).** If for each row block I_i the columns are partitioned into
J_{i,j} (depending on i), steps (1) to (3) apply for each i and (4) is unchanged. Same bound.

**B'' (rectangle tilings; PROVED under lower flatness of A).** Let the index rectangle be tiled by rectangles
I_k x J_k, each with a proportion c of unimodular entries, abs(beta_n) <= b1 norm(beta) D^(-1/2) and
abs(A_m) >= a0 norm(A) Q^(-1/2). Then sum_k norm(A_{I_k}) norm(T_k) norm(beta_{J_k}) >= (c^(1/2) a0/b1) norm(A) norm(beta) D^(1/2).
Proof. norm(A_{I_k}) >= a0 norm(A) (abs(I_k)/Q)^(1/2); with (1), (2):
sum_k >= c^(1/2) (a0 norm(A)/Q^(1/2)) (D^(1/2)/(b1 norm(beta))) sum_k abs(I_k)^(1/2) norm(beta_{J_k})^2. For each row m the tiles
containing m have column sets that partition the columns, so sum_k abs(I_k)^(1/2) norm(beta_{J_k})^2
= sum_m sum_{k: m in I_k} abs(I_k)^(-1/2) norm(beta_{J_k})^2 >= Q^(-1/2) sum_m norm(beta)^2 = Q^(1/2) norm(beta)^2. QED
Without lower flatness of A the argument does not give B'': a tiling can put the mass of A in rows whose tiles are
narrow in the column direction. Not decided whether B'' holds without it. The probe vector A has a smooth cut-off
(not bounded below at the edge of its support), so B'' applies to it only after restricting to the bulk.

## 2. Numerical check (different matrices and partitions from `ref2_blocks.py`)

Matrices: cubic residue characters of m = 1..Q modulo the first D primes p = 1 mod 3 (complex entries of modulus 1,
proportion 0.998 to 0.9998; not zero: norm(T)^2 = 7953, 11874, 1643 against max(Q, D) = 1500, 1500, 200;
abs(<A, T beta>) = 1.05, 1.43, 0.99). Vectors with random phases and moduli in (0.5, 1.5) (b1 = 1.43, a0 = 0.47 to 0.49).
25 random partitions of each kind per size:

| Q x D | (a) product partitions, least ratio | (b) row-dependent column partitions | (c) rectangle tilings, against the bound with a0 |
|---|---|---|---|
| 80 x 1500 | 3.35 | 3.27 | 6.97 |
| 240 x 1500 | 4.09 | 4.02 | 8.07 |
| 200 x 200 | 4.85 | 5.05 | 9.77 |

All ratios are above 1, as the statements require. The bounds are not sharp on these matrices (norm(T)^2 is 5 to 8
times max(Q, D): the Hilbert-Schmidt bound itself is not attained).

## 3. What may be used

Statement 2 of section 4 of the second referee's file, in the form: an l2-l2 operator bound of the reflected row
matrix applied blockwise on a product partition, or on a partition whose column blocks depend on the row block,
is at or above the K-branch, when every block keeps a positive proportion of unimodular entries and the reflected
coefficients have no large entry. This is now a statement with a proof by one referee and a check by another.
General tilings: only with lower flatness of A. Vector-specific estimates ((E-K), norm(T^* A)): outside, unchanged.

## 4. Weakest points

1. The two hypotheses on the reflected coefficients are still read from a transcription of unrefereed sources.
2. B'' is new here and unrefereed.
3. "Blockwise" does not cover weighted or mixed norms, or decompositions of T that are not restrictions to index
   blocks (for example a splitting of the entries by the size of a gcd).
