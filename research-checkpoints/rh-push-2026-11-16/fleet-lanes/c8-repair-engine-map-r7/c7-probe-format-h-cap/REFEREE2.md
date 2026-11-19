# REFEREE2 (second referee): Theorem K, Lemma HS and Lemma A of `c7-probe-format-h-cap`

2026-11-18, lane `c8-repair-engine-map-r7`. Written in this lane's directory; no file of `push/c7-probe-format-h-cap/`
was edited. Scope: the two statements that the round-8 lanes `c8-ek-*` and `c8-eh-*` rest on. Read: the lane's
RESULT.md and REFEREE.md, `cap_lp.py`; Liu II (`push/bypass-78/dl/2610.26835.txt`, lines 612-641, Lemma 2.4) and the
manuscript `~/lean-deps/qrh-verify/paper.txt` (lines 2960-3000 Prop. 6.3; 3060-3094 (7.3)-(7.5); 3100-3365 Lemma 7.1
with proof), as text. Script: `ref2_blocks.py` + `ref2_blocks.log` (stdlib + numpy, one local run through
`scripts/memcap.sh 8`, largest array 5.8 MB). No server use. No statement about zeros of zeta is made or checked;
every abscissa is the value of an estimate system relative to unrefereed sources.

Labels: PROVED (argument written here) / CONFIRMED (re-derived, agrees with the lane) / ARGUED / MODEL / OPEN.

## Outcome

| item | first referee | this pass |
|---|---|---|
| Theorem K (identity) | holds | **holds** (CONFIRMED by hand and exactly for r = 2..40, d = 2, 3, 4) |
| "K-loss = Hilbert-Schmidt lower bound" | holds for the l2-l2 bound of the full matrix | **holds**, checked against the text of Liu II Lemma 2.4; **extended** to every blockwise operator-norm estimate (Proposition B below, PROVED) |
| Lemma A, linear algebra | holds | **holds** |
| Lemma A, size of the aligned probe | ARGUED, three items not proved | **stays ARGUED**; two of the three items are now closed (high identity for the twisted target; non-vanishing of the normaliser at s = 1), one remains (bound for the non-principal rows of the twisted target) |

Lanes `c8-ek-*` and `c8-eh-*` may use Theorem K and Lemma HS as two-referee statements in the form of section 4.
They may use Lemma A only as ARGUED.

## 1. Theorem K

With h = 1 + l - lx, M = lx + ly, L' = 1 - h/r, L_K = L' + (M + l - 1)/2, H0 = 1/2 - ly/2 + h(1 - 1/r) - l/2,
H0' = H0 + l/2:

    ((r-2)/r) L' + (1/r) L_K + (1/r) H0
      = ((r-1)/r)(1 - h/r) + (lx + ly + l - 1)/(2r) + (1 - ly - l)/(2r) + h(r-1)/r^2  =  1 - 1/r + lx/(2r),
    (1 - 4/(3r)) L' + (2/(3r)) L_K + (2/(3r)) H0'
      = (1 - 2/(3r))(1 - h/r) + (lx + l)/(3r) + 2h(r-1)/(3r^2)  =  1 - 1/r - h/(3r) + (1 + lx + l)/(3r) = 1 - 1/r + 2lx/(3r).

Both sides are affine in (lx, ly, l), so equality at four affinely independent points proves each identity for a given
r; `ref2_blocks.log` line 1: exact (Fractions) for r = 2..40, both high sides, and the degree-d form with weights
(1 - 1/r - 1/(r(d-1)), 1/(r(d-1)), 1/r) for d = 2, 3, 4. Weights are non-negative for r >= 2 and sum to 1.
At the source point (2/5, 2/5, 1/5), r = 6: L' = L_K = H0 = 13/15 = 5/6 + lx/12. CONFIRMED.
The theorem is an implication between three inequalities and a fourth. Whether B >= H0 (or H0') is the right
high-side condition outside lx >= l is MODEL (the lane's weakest step 1; unchanged).

## 2. Lemma HS and its identification with the K-branch

**Source check (not done by the first referee).** Liu II Lemma 2.4 as printed: the rescaled theta sums "with outer
element-range exponent m and remaining prime-length exponent l have squared norm << Z^(m + k(m,l) + eps)",
k(m, l) = max{0, (1 + 3l - 2m)/4, m + l - 1, (3l - 1)/2}. The transcription k_J, k_K, k_P of `r3-method-limit`
agrees with the text. On the K-branch the squared norm is Z^(2m + l - 1), which is the dual length
D = (QP)^2/(ZP) = Z^(2M + l - 1) with m = M. So the K-branch says: (sum of abs(B_m)^2) <= D norm(beta')^2 when D > Q.

**Lemma HS. CONFIRMED.** norm(T')^2 >= norm(T')_HS^2 / rank >= c Q D / min(Q, D) = c max(Q, D). In exponents,
Q^(-1/2) (Q/Y)^(1/2) max(Q, D)^(1/2) = X^(1/2) max(1, D/Q)^(1/2), loss max(0, d' - M)/2; reflected: d' - M = M + l - 1.
The K-branch of Lemma 2.4 is therefore the least value an l2-l2 bound of the reflected matrix can have, and equals the
ideal large-sieve value Q + D up to the constant. The lemma is a statement about a proof format. It does not bound
sum abs(B_m)^2 for the probe vector from below; that is (E-K).

**Proposition B (blockwise form; PROVED here; closes item (ii) of the first referee's E4).** Let the rows be
partitioned into blocks I_i and the columns into blocks J_j, T_ij the corresponding blocks of T'. Assume each block
used has at least a proportion c of unimodular entries and abs(beta'_n) <= b1 norm(beta') D^(-1/2) for all n (no large
entry). Then

    sum_{i,j} norm(A_i) norm(T_ij) norm(beta'_j)  >=  (c^(1/2)/b1) norm(A) norm(beta') D^(1/2).

Proof. norm(T_ij)^2 >= c max(abs(I_i), abs(J_j)) >= c abs(J_j) (Lemma HS on the block). From the bound on the entries,
norm(beta'_j)^2 <= b1^2 norm(beta')^2 abs(J_j)/D, so abs(J_j)^(1/2) >= norm(beta'_j) D^(1/2)/(b1 norm(beta')). Hence
sum_j norm(beta'_j) abs(J_j)^(1/2) >= sum_j norm(beta'_j)^2 D^(1/2)/(b1 norm(beta')) = norm(beta') D^(1/2)/b1, and
sum_i norm(A_i) >= norm(A). QED
The same with rows and columns exchanged gives (c^(1/2)/a1) norm(A) norm(beta') Q^(1/2) when A has no large entry.
So splitting the row sum or the dual sum before Cauchy-Schwarz and applying an operator norm on each piece does not
pass the K-branch. Numerical check (`ref2_blocks.log`): Jacobi-symbol matrices of sizes 60 x 1200, 150 x 2400,
300 x 300, 300 x 900, 40 random interval partitions and 40 arithmetic-progression partitions each: least ratio of the
blockwise bound to the right-hand side 2.66 (always above 1; partitions containing an all-zero block have c = 0 and
are vacuous). The hypothesis "proportion c in each block" is needed: a block of rows and columns sharing a prime is
zero.

**Not covered, unchanged from the first referee:** (i) an estimate that uses the specific vector A (norm(T'^* A) in
place of norm(A) norm(T')); A is a structured vector, and this escape is of the same kind as (E-K); it should be listed
with it. (iii) A representation with d' <= M: for the single reflection of the source, d' = 2M + l - 1 <= M iff
M + l <= 1, which is the region without K-loss; no other representation is known (d = 1 rows closed by the angular
lane). (iv) Mixed or weighted norms. Also: norm(beta') ~ 1 and the flatness of the reflected coefficients are read
from the transcription, not replayed.

## 3. Lemma A

**Linear algebra. CONFIRMED.** An inequality that depends on beta only through (abs(beta_n)) holds for every beta'
with the same moduli. Equivalent target-free form: a phase-blind low estimate Z^E satisfies

    Z^E  >=  sup over phases of abs(J)  =  Q^(-1/2) sum_n abs(beta_n) abs(c_n),     c_n = sum_m A_m chi_n(m).

Lemma A is a lower bound for this weighted l1 norm of T^* A obtained from one test vector (the Liouville-twisted
target). The quantity depends on A and T only.

**Size of the aligned probe.** The claim abs(J(beta')) ~ Z^(C(1)) for eta' = eta eps, eta'(p) = -1, needs:

(a) *The high identity for eta'.* CLOSED. MS (7.5) is an identity on lines of absolute convergence ("identities for
the same probe, not estimates"); the target enters (7.3)-(7.4) only through the factor eta(A), A = c n^3, and the
Poisson summation is in the row variable m. Nothing in (7.1)-(7.5) uses periodicity of eta. So (7.5) holds for any
bounded eta, in particular eta'. (Text read; lines 3060-3094.)

(b) *The principal row.* CLOSED. Lemma 7.1 at j = 0 is an identity of formal local series that uses eta only through
eta(p)^(e0) and a_p = (alpha(p) eta(p))^3, i.e. complete multiplicativity (re-derived from (7.10), (7.8) and the lift
formula in `../c6-marks-bc-manuscript-check/REFEREE3.md`). For eta'(p) = -1: 1/L^S(x, eta') = zeta_F^S(x)/zeta_F^S(2x),
simple pole at x = 1 with non-zero residue, and the local factor of the normaliser at s = 1 is
(1 - q)(1 + q - q^2 - R q)/(1 - R) = 1 + O(Q^-2) with abs(R) = Q^-3, non-zero at every prime (least modulus 0.8798 over
Q in {4, .., 37} and all phases, `../c6-marks-bc-manuscript-check/ref3_lemmaH.log`), so the product converges
absolutely to H_lambda(1) != 0. PROVED. This is the item "non-vanishing of the normaliser of the twisted target at
s = 1" that the first referee listed as not checked.

(c) *The non-principal rows for eta'.* OPEN (stays ARGUED). For u != 1 the reciprocal is
L^S(x, chi_u)/L^S(2x, chi_u^2), holomorphic on Re x > 1/2 with no hypothesis and bounded there by convexity, uniformly
in u up to a power q_u^((1 - Re x)/2 + eps). The manuscript bounds the non-principal rows in its sections 8-10 from
zero-free rectangles for the twists eta chi_u; for eta' the corresponding input is unconditional. That those
sections use holomorphy and polynomial bounds only, and that the resulting exponent is below C(1), was not replayed.
The first referee's remark stands: holomorphy alone gives no bound summed over rows; the convexity bound is the
missing uniform input, and its cost in q_u has to be carried through the row sum.

(d) *Geometry.* The signal exponent C(1) = lx/2 + h/r at lx < l is MODEL (no numbered source), as in Theorem K.

**Consistency checks made.** (1) Base geometry of MS Prop. 6.3 (lx = ly = 1/2, l = 0, h = 1/2, r = 6): C(1) = 1/3,
while Prop. 6.3 gives exponent 1/4 "independent of the target character". No contradiction with Lemma A: the proof of
Prop. 6.3 uses Lemma 5.8 (reflected rows; periodicity), so it is not phase-blind and does not transfer to eta'. The
unreflected estimate at the same point has exponent lx/2 + k_dir/2 >= 1/4 + 1/6 = 5/12 >= 1/3. (2) In general,
polar + k_dir/2 >= h/r for r >= 3 in both regimes: for M <= 2 + 2l, h/r - b/(2r) = (2 + 2l - M)/(2r) <= (2 + 2l - M)/6;
for M >= 2 + 2l (k_dir = 0), b/(2r) >= h/r iff M >= 2 + 2l. So the source ledger with the polar term kept never
contradicts Lemma A; with G = 0 it does, as the lane says. For r = 2 the first inequality reverses; the k_dir formula
is the cubic one and the case r = 2 is a transplant.

**Reading for `c8-eh-*`.** Item (c) is a bound for non-principal rows of a target whose reciprocal has no zeros to
avoid. It is the same row sum that (E-H) concerns, in the direction where no zero-free input is needed. A lane that
writes the row bound for (E-H) can close (c) in the same pass by running it for eta'.

## 4. Statements that hold after two referees

Relative to the transcription of the unrefereed sources (now checked against the text of Liu II Lemma 2.4 for the
k-branches), and assuming (S) and H0 or H0' at all lx, ly, l >= 0 (MODEL outside lx >= l):

1. PROVED (identity): B >= L', B >= L_K, B >= H0 imply B >= 1 - 1/r + lx/(2r); with H0', 2lx/(3r).
2. PROVED: an l2-l2 operator bound of the reflected row matrix (unimodular entries on a positive proportion), applied
   to the whole matrix or blockwise on any partition of rows and columns whose blocks keep a positive proportion of
   unimodular entries, with reflected coefficients having no large entry, is at or above the K-branch. Estimates
   specific to the vector beta' ((E-K)) or to the vector A are outside this statement.
3. ARGUED: a phase-blind low estimate has B >= 1. Closed sub-steps: high identity and principal residue for the
   Liouville-twisted target, with H_lambda(1) != 0. Open sub-step: the non-principal rows of the twisted target.
4. The first referee's corrections E1 to E6 stand; none is changed by this pass.

## 5. Requirement flags

R1 false (no step uses multiplicativity except to build the control eta'); R2 false (no conclusion about zeros); R3
false (target-independent by construction: holds for U, DH, THIN); R4 false (a cap at 1 - 1/r on a model abscissa).

## 6. Weakest points of this pass

1. Proposition B is written here and not refereed. Its hypotheses (positive proportion of unimodular entries in each
   block; no large entry of beta') are assumptions about the reflected coefficients that were not checked in the
   sources.
2. Item (c) of Lemma A was not replayed in MS sections 8-10; the statement that convexity suffices is a reading.
3. The check of the K-branch is against the statement of Liu II Lemma 2.4, not its proof.
