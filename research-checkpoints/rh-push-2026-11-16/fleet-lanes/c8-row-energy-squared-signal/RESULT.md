# c8-row-energy-squared-signal: row energy = squared signal + remainder, over Z[omega] and over F_q[T]

Internal working note, 2026-11-18. Slug `c8-row-energy-squared-signal`. Refereed twice (`REFEREE.md`, lens
derivations and manuscript quotes; `REFEREE2.md`, lens exact computation and controls): both "holds with
corrections"; the corrections are applied in the text and listed in section 11. Kind: combine (referee-debt combine of
STRATEGY 4.0). Score 0 by assignment. Only this directory was written. Nothing committed, pushed or posted. The
compute server was not used (largest local run 2 min, under 1 GB, through `scripts/memcap.sh 8`).

Stated in advance, and unchanged at the end: both sides are obstruction statements. Neither supplies R1..R4.
This note makes **no statement about zeros of zeta** or of any L-function. Every abscissa below is the value of a
hypothetical estimate system inside the format of Proposition 2.1 of the 7/8 manuscript
(`~/lean-deps/qrh-verify/paper.txt`, "MS", unrefereed, read as text; its equation numbers are quoted). RH open. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel X (complete given the named statement X) / CLASSICAL /
EXACT (identity between exact integers or rationals, on the stated cases) / MEASURED / ARGUED / OPEN.

Files: `recheck.py` (independent exact recomputation, definitions only), `recheck.jsonl` (22 runs),
`compare.py`, `compare.log` (comparison with the stored block files of `c7-ff-order2-vertex-exact`).

## 0. Verdict

**Precise obstruction, in a corrected form. Lemma C of `c7-uncompensated-high-side-normaliser` is replaced by a
Bessel statement that is PROVED relative to the manuscript's own separation (6.2) and Lemma 6.2; its exponent
the exponent of (C1) is recovered, conditional on the high half (HC); its reading (b) ("with no high side") is
established by neither route and is removed from the list of results (it is not shown false).**

1. **Theorem (both columns, section 2).** For a row vector B and probe vectors A_j, with J_j = Sum_m A_j(m) B(m):
   energy(B) = (squared signal) + Rem, Rem >= 0, squared signal = Sum_j |J_j|^2 / ||A_j||^2 for pairwise orthogonal
   A_j. Over F_q[T] this is an identity between exact rationals with the squared signal in closed form
   (wt^2 q^(d-2k) |S_cop(k)|^2 / (1 - 1/q) at dual length 0). Over Z[omega] it is the Cauchy-Schwarz step of MS
   Proposition 6.3 / 15.3 solved for the row energy: max_sigma E_sigma >= c_0 (QY/(Q + Y^2)) |I_mark|^2.
2. **Recomputation (section 3; the assignment's decisive test): agrees.** E = S + Rem with Rem computed as a
   residual norm is linear algebra and tests the code; the parts that could fail are the signal law and equality
   with the stored integers. 22 independent exact recomputations at q = 7 (N <= 3, N' = N + lam <= 4,
   d = 3, 4; targets a, b, control mu; coherent marks and random sixth-root marks). Energy = squared signal +
   directly computed remainder holds as an identity of rationals in 22 of 22; the signal law
   |J|^2 = wt^2 q^(2d) |S_cop|^2 holds as an identity of integers in 22 of 22; the 13 coherent-mark cases that have
   a stored block reproduce the stored integers (||R||^2, |J|^2, ||c_k||^2, S_cop^2) digit for digit; the 14th
   (mu, d = 3) has no stored block and reproduces the first referee's float values 5.277 and 6.163 as 1583/300 and
   1849/300.
3. **What the test also shows (EXACT, not in the round-7 notes).** The inequality "energy >= diagonal + squared
   signal" fails in 12 of the 14 coherent-mark cases (and in all 9 further coherent cases of the second referee),
   down to -0.90 times the diagonal (mu, N = 3, lam = 0, d = 4). All computed cases have d <= N' + 1, where the rows
   do not make distinct chi_B orthogonal (that needs d >= 2N'); no case with d >= 2N' was run. The squared signal is a component of the energy; the
   diagonal is not a second component next to it. Identity (3.2) of the c7 note was not tested (its coherent block
   is defined by Poisson summation, which was not derived in the model); it stays not established (c7 referee E1).
   The model shows only that the Bessel squared signal cannot be added to the exact diagonal.
4. **Lemma C over Z[omega] (section 4).** PROVED-rel MS (6.2), (12.5), Lemma 6.2: the energy inequality of item 1.
   PROVED-rel additionally the high half of the format for the marked-only probe ((2.2) and (2.5) at the geometry
   lx = ly = M/2): k_true >= ksig(beta) = (2 + 2l - M)/6 - 2(1 - beta) for every beta < beta*, which is (C1) of the c7
   note, without the condition M >= 1 + l and without the diagonal correction. The high half at lx < l is not
   proved anywhere (c7 Lemma 2 is ARGUED; (2.2) fails for sigma_0 <= 2/3, map row Z24). So the necessity (C1) is
   conditional on the high half; the referee's objection E1 to the Poisson form (non-sixth-power frequencies are
   not sign-definite) stands and is avoided, not answered.
5. **Corollary (section 5).** In any probe of the Proposition 2.1 format of order r whose low estimate is
   Cauchy-Schwarz on the separation, the row-energy input at level Z^kappa K is the hypothesis (2.4) itself at
   abscissa 1 - h_E/r + kappa/2 (h_E = 1 + l - M/2 at the optimal split lx = ly). With coherent marks (16.13) the
   marks raise h_E by l and raise the forced energy by Z^(l/3): the input that the vertex needs is at least the
   squared signal, and for the aligned control of Lemma A it is false by Z^(h_E/3) at every h_E > 0 [ARGUED over
   Z[omega]: the aligned-probe size needs (2.5) for a Liouville-type target at general geometry; in the F_q[T] model
   the aligned squared signal exceeds the diagonal by a bounded factor, 2.56 to 6.16, which shows no power]. Given
   that size, no proof that reads the row coefficients through their moduli gives the input at any h_E > 0. Items
   1 and 2 of the corollary are Proposition 2.1 read forwards and as a contrapositive; item 3 is Lemma A of
   `c7-probe-format-h-cap` in energy units (kappa >= 2 h_E/r is B_low >= 1). The corollary is a restatement.
6. **Controls (section 6).** Random unimodular marks: every identity still holds (EXACT, 8 of 8); what fails is
   the size: the mean of |S_cop|^2 over independent unimodular marks is Sum_P |T_P|^2 against |Sum_P T_P|^2 for
   coherent marks (T_P the Moebius sum belonging to P); the exact ratio is 21 at lam = 2 and 6.25 to 7 at lam = 1 for
   a, c, mu, and 2.53 for (b, 2, 1, 4) (second referee). Observed single draws: 21 to 1218 at lam = 2, 3.0 to 120 at
   lam = 1. So the marks no longer raise h. At N = 1 this control is degenerate (first referee):
   n_2(PA') = 41 for every pair, so S_cop = -41 (Sum_P u_P)(Sum_A' mu nu) and the drop is 441/|Sum_P u_P|^2 with
   |Sum_P u_P|^2 = 9, 13, 21; it shows the size of a sum of 21 unit phases and nothing else about the row. Reflected rows, the (E-K) setting: the theorem is
   about the true energy, which does not depend on the representation, and gives a lower bound only; the forced
   lower bound is at or below the diagonal level where beta* <= 1 - h_E/6, so it says nothing about (E-K) there
   (section 7).

The marks branch (uncompensated coherent marks as a source of h > 1 with an independent low input) is **reduced to
(E-K); nothing is closed.** The low input contains the squared signal by an exact identity (F_q[T]) or by the
format's own Cauchy-Schwarz step (Z[omega]); a modulus-only proof of it is excluded by Lemma A (aligned size
ARGUED). The low input at h > 1 is an upper bound for S + Rem at the diagonal level for the specific vector, which
is the (E-K) question, open and not touched.

Flags: R1 false, R2 false, R3 false, R4 false (section 8).

## 1. Plan, reading, relation to closed rows

Read: BRIEF to the end; STRATEGY 4.0; ROUND_LOG round 7 and the round-8 table; OBSTRUCTION_MAP rows Z15, Z15b,
Z15c, Z24, Z26 and the controls section; `c7-uncompensated-high-side-normaliser` (RESULT sections 0, 3, 9; REFEREE,
E1 to E6); `c7-ff-order2-vertex-exact` (RESULT, REFEREE E1 to E7; block files as data; code read as text, not
run); `c7-liou-high-row-bound` (RESULT sections 0 to 6; REFEREE); `c7-probe-format-h-cap` (Lemma A, Lemma HS);
MS Proposition 2.1 with (2.1) to (2.5), (5.30), (6.1), (6.2), Lemma 6.2, Proposition 6.3, (7.12), (7.13), (10.3),
(12.5), section 15.1 (definition of B^J), (15.2), (16.1), (16.13).

New against those: (i) one statement that contains the three round-7 "coherent terms"; (ii) a proof of the
energy inequality that does not use Poisson summation or a positive kernel (answers the mechanism of referee
objection E1 of the c7 note by replacing it); (iii) an independent exact recomputation with the remainder
computed directly; (iv) the sign of energy - diagonal - signal; (v) the random-mark control in exact arithmetic.
No closed route is re-run. Nothing here is a new theorem of analysis: the theorem is Bessel's inequality; the
content is the bookkeeping of which statement of each lane it replaces.

Decisive first test: section 3, run first. It did not kill the statement. No pivot was used.

## 2. Theorem (row energy = squared signal + remainder)

**Abstract form [PROVED; CLASSICAL: Bessel].** Let B = (B(m)) be a finite complex vector and A_1, .., A_n vectors on
the same index set, J_j = Sum_m A_j(m) B(m), G the Gram matrix G_ij = Sum_m conj(A_i(m)) A_j(m), assumed invertible.
Then

    Sum_m |B(m)|^2 = J^T G^(-1) conj(J) + Rem,    Rem = || B - (projection of B on span{conj(A_j)}) ||^2 >= 0,           (T)

and for pairwise orthogonal A_j: Sum_m |B(m)|^2 = Sum_j |J_j|^2 / ||A_j||^2 + Rem. (J_j is the Hermitian product of B
with conj(A_j); (T) is the Pythagoras identity for the orthogonal projection onto span{conj(A_j)}.) Consequences:
(a) every upper bound E for the energy gives |J_j| <= ||A_j|| E^(1/2) (the Cauchy-Schwarz low estimate); (b) every
lower bound for |J_j| gives a lower bound for the energy. (a) and (b) are one inequality.

**The two columns.**

| | Z[omega] (MS notation) | F_q[T] (notation of `c7-ff-order2-vertex-exact`) | label |
|---|---|---|---|
| rows | m in O, 0 < q_m <= C_Omega Q, Q = q_b* X Y = Z^M | monic m of degree d | definition |
| row vector | B^mark_{m,sigma}(Z) := B^J_{m,sigma}(Z) of MS section 15.1 with J empty: Sum over slot primes of eta(p_i) W_i(q_p/P_i) times the completed row with 1_{p | cn^3} at scale Z q_p | R_{N,lam}(m; nu) = Sum_{P prime, deg lam} Sum_{A' sf, deg N, P not | A'} g_3(1, PA') nu(A') chi_{PA'}(m) | definition |
| probe vectors | Omega(q_m/Q) xi(m) (q_m/Q)^(-iv) A_{m,sigma,v}(Y) of (6.2), one for each class sigma and real v | c_k(m) = Sum_{deg c = k} g_6(m, c), k <= d/2 | definition |
| separation | I_mark(Z) = (Q^(-1/2)/2 pi) Sum_sigma Int W0hat(iv) Sum_m [probe vector] B^mark_{m,sigma}(Z) dv | J(k) = Sum_m c_k(m) R(m) | Z[omega]: PROVED-rel MS (6.2), (12.5) (Lemma Z1). F_q[T]: definition |
| norms of the probe vectors | Sum_{q_m <= CQ} |A_{m,sigma,v}(Y)|^2 << (Q + Y^2)/Y, uniformly in v | pairwise orthogonal; ||c_k||^2 = q^(d+2k) (1 - 1/q) for 1 <= k <= d/2, ||c_0||^2 = q^d | Z[omega]: MS Lemma 6.2 (planar additive large sieve; CLASSICAL in type, quoted). F_q[T]: PROVED (complete orthogonality of reduced fractions; re-derived by the c7 referee), EXACT here in 22 runs |
| energy statement | max_sigma E_sigma(Z) >= c_0 (QY/(Q + Y^2)) |I_mark(Z)|^2, E_sigma = Sum_{0 < q_m <= C Q} |B^mark_{m,sigma}(Z)|^2 | ||R||^2 = Sum_{k <= d/2} |J(k)|^2/||c_k||^2 + Rem, Rem >= 0 | Z[omega]: PROVED-rel MS (6.2), Lemma 6.2 (Theorem Z). F_q[T]: PROVED; EXACT in 22 of 22 |
| squared signal, closed form | not available as an identity: I_mark is given by the high representation (10.5) with rows (7.13); its principal row is the residue term f of (2.3) | r = 0, k != N': |J(k)|^2 = wt^2 q^(2d) |S_cop(k)|^2, wt^2 = 1 if 6 | k - N', q otherwise; J(k) = 0 for r < 0 (k != N') | Z[omega]: OPEN in general (hypothesis (2.5)); PROVED-rel MS at the geometry (12.4) for the compensated probe only. F_q[T]: PROVED-rel Theorem A, Lemma R, Lemma G of the predecessor lanes; EXACT in 22 of 22 here and 416 of 416 by the c7 referee |
| size of the squared signal against K | Omega(Z^(ksig(beta))) K for beta < beta*, ksig(beta) = (2 + 2l - M)/6 - 2(1 - beta), at lx = ly = M/2 | wt^2 q^(d-2k) |S_cop(k)|^2 / (1 - 1/q); for general r, wt = q^(r/6 + O(1)) | Z[omega]: PROVED-rel (2.2), (2.5) and MS Prop. 2.1 (Corollary Z). F_q[T]: r = 0 EXACT; r >= 1 ARGUED/CITED (staircase not computed beyond r <= 5) |
| coherent marks | eta(p) in (12.5) cancels the phase of the local factor of 1/L(x, eta): two-term principal multiplier B_p = -1 + O(Q^(-7/8)) (16.13); the marked-only multiplier is B_p + Q^(-w) with Re w >= 19/20 there, hence also -1 + O(Q^(-7/8)) (a consequence, not the printed statement); so the slot factor has modulus Sum_p W q_p^(-5/6) ~ P^(1/6)/log P; this is the l/6 in C(s) of (10.3) | the weight is nu(A') = nu(PA') conj(nu(P)), and mu(PA') = -mu(A'): S_cop(k) = - Sum_P Sum_{A'} mu(A') nu(A') n_k(PA'), every mark with the same sign | Z[omega]: PROVED-rel MS (16.13) (c7 Lemma 3, referee-confirmed at the principal point). F_q[T]: PROVED (one line from the definition and Lemma G) |
| Poisson form of the same term (`c7-liou-high-row-bound`) | E = D + P_w + Rem_P, P_w a Hermitian form in (mu w)(c) over the sixth-power frequencies, P_w = kappa abs(m_w)^2 (1 + o(1)), kappa ~ M^(5/6) X^(1/3); Rem_P not sign-definite | not derived (the dual form of the row Gram matrix is not an identity in the c7 lane) | identity for P_w PROVED (c7-liou Lemmas 2, 3, Theorem C, refereed); "= kappa abs(m_w)^2" MEASURED (1 to 4 percent); Rem_P bound ARGUED |
| relation of the two forms | at M = X = Z, l = 0: Q Z^(h_E/3) = Z^(1 + 1/6) = M^(5/6) X^(1/3): the Bessel squared signal at the optimal split and kappa have the same exponent | energy - diagonal - squared signal is negative in 12 of 14 coherent cases (section 3) | exponent arithmetic PROVED; no identity between the Bessel term and P_w is claimed |

Hypotheses of the theorem, listed. Abstract form: none. F_q[T] column: q = 1 mod 6; squarefree moduli, sharp degree
classes (the block model; not the manuscript's smooth weights, cube part or excluded set); k <= d/2 for
orthogonality; r = 0 and k != N' for the closed form. Z[omega] column: the data of MS section 6 and (12.5) (fixed
S, xi, W_0, W_1, slots with disjoint windows); the energy inequality needs nothing else; the size statement needs
(2.2) and (2.5) for the marked-only probe at the geometry used.

## 3. Decisive test: one function-field family recomputed (EXACT)

`recheck.py`: Python integers only. Z[zeta_42] as integer vectors of length 42 reduced modulo Phi_42 at the end;
resultants as determinants of the multiplication map on F_q[T]/(c); g_6(m, c), g_3(1, B) as sums over all x mod c
from the definition; factorisation by trial division; S_cop(k) by counting coprime c; the remainder computed as the
squared norm of the residual vector R - Sum_k (J_k/||c_k||^2) conj(c_k), not as a difference. No code, closed form
or cache of the c7 lane is used; conventions were taken from the definitions in its RESULT section 2 (chi_0 at
the least primitive root, e = psi of the coefficient of T^-1, target a: F = T^3 + 2, b: F = T^3 + T + 1). Ratios are
`fractions.Fraction`. q = 7 throughout.

Coherent marks (weight 1 on every prime of degree lam). E = ||R||^2, S = squared signal = |J(k)|^2/||c_k||^2 at the
one k with dual length 0 (J(k') = 0 exactly for the other k' <= d/2, checked), Rem computed directly,
D = exact diagonal q^d Sum_B |W(B)|^2 q^(N') phi(B)/|B|:

| weight | N | lam | d | k | E | S | Rem | S/D | Rem/D | (E - D - S)/D | stored block equal |
|---|---|---|---|---|---|---|---|---|---|---|---|
| a | 3 | 0 | 3 | 1 | 30321886 | 2140663/6 | 179790653/6 | 0.011839 | 0.994353 | -0.0056 | yes |
| a | 2 | 1 | 3 | 1 | 22298430 | 1977738 | 20320692 | 0.098503 | 1.012095 | +0.0121 | yes |
| a | 1 | 2 | 3 | 1 | 9724050 | 907578 | 8816472 | 0.062500 | 0.607143 | -0.3929 | yes |
| b | 1 | 2 | 3 | 1 | 16927050 | 8168202 | 8758848 | 0.562500 | 0.603175 | -0.3968 | yes |
| mu | 3 | 0 | 3 | 1 | 189885486 | 186456858 | 3428628 | 6.163333 | 0.113333 | -0.8867 | no stored block |
| a | 3 | 0 | 4 | 2 | 211302406 | 15311569/6 | 1252502867/6 | 0.012097 | 0.989587 | -0.0104 | yes |
| a | 2 | 1 | 4 | 2 | 137692548 | 14359254 | 123333294 | 0.102168 | 0.877536 | -0.1225 | yes |
| a | 1 | 2 | 4 | 2 | 65295195 | 12108243/2 | 118482147/2 | 0.059559 | 0.582802 | -0.4172 | yes |
| b | 3 | 0 | 4 | 2 | 211033494 | 7310163/2 | 414756825/2 | 0.017327 | 0.983083 | -0.0169 | yes |
| mu | 3 | 0 | 4 | 2 | 1318609992 | 1296540000 | 22069992 | 6.122449 | 0.104218 | -0.8958 | yes |
| mu | 2 | 1 | 4 | 2 | 790601280 | 703603446 | 86997834 | 2.654979 | 0.328278 | -0.6717 | yes |
| mu | 1 | 2 | 4 | 2 | 353299947 | 593303907/2 | 113295987/2 | 2.918403 | 0.557292 | -0.4427 | yes |
| a | 3 | 1 | 4 | 1 | 7348090029 | 70589400 | 7277500629 | 0.009785 | 1.008846 | +0.0088 | yes |
| mu | 3 | 1 | 4 | 1 | 39971953644 | 36374011926 | 3597941718 | 2.814474 | 0.278394 | -0.7216 | yes |

In all 14: E = S + Rem as rationals; |J|^2 = wt^2 q^(2d) |S_cop|^2 as integers (wt^2 = q in every case, since
6 does not divide k - N'); Gram matrix of {c_0, .., c_(d/2)} diagonal with the stated norms. "Stored block equal":
||R||^2, |J|^2, ||c_k||^2 and S_cop^2 equal the strings `nr2`, `J2`, `nc2`, `S_cop` of `blocks_q7_d{3,4}.jsonl`
(13 of 13; this is what `compare.py` tests). The stored floats `row_excess_over_diag`, `bessel_over_diag` agree
with E/D - 1 and S/D within 1e-12 in 13 of 13 (a float comparison, run by the second referee, not an identity).
In the two N' = 4 rows the block k = 2 has r = 1 and J(2) = 0 there is a computed fact, not covered by the rule
"J = 0 for r < 0". Example of the last-digit comparison: (a, 1, 2, 4): E = 65295195, |J|^2 = 29914976294847,
||c_2||^2 = 4941258 = 7^8 (6/7), S_cop = -861, 7 * 7^8 * 861^2 = 29914976294847.

Readings (MEASURED on these 14 cases; no asymptotic claim).
* For the two Weil targets a, b S/D is between 0.0098 and 0.56, and Rem/D between 0.58 and 1.01. These ranges
  depend on the targets: for the Weil target F = T^3 + 3 (second referee; abs(Sum_t nu(T - t)) = 5 against 1 and 3)
  S/D = 1.489 at (1, 2, 4), 1.5625 at (1, 2, 3), 0.637 at (2, 1, 4), and Rem/D down to 0.570. The squared signal of a
  Weil target can exceed the diagonal at these sizes; no separation between Weil targets and mu is shown. For the aligned
  control mu, S/D is between 2.65 and 6.16 and Rem/D between 0.10 and 0.56: 84 to 98 percent of the row energy is
  the squared signal.
* E - D - S < 0 in 12 of 14. The remainder is not "diagonal plus small": with coherent marks at N = 1 it is 0.58 to
  0.61 of the diagonal for both targets. So a statement of the form E >= D + (coherent term) fails in these cases
  (all with d <= N' + 1); E >= (coherent term) is the form that holds, and E - D can be negative while the coherent term is positive
  (rows (a, 1, 2, 3), (a, 1, 2, 4), (a, 2, 1, 4)).
* Sizes are those of the c7 referee's E4: at dual length 0 the weight wt^2 is at most q, so target and control
  differ by a bounded factor here. Nothing in this test reaches the range where wt grows with N.

## 4. First lemma: Lemma C over Z[omega], written from the manuscript's definitions

Notation of MS. X = Z^lx, Y = Z^ly, Q = q_b* X Y, M = lx + ly, slots of total length l, h = 1 - lx + l,
C(s) = s + lx/2 - 1 + h/6 = s - 5/6 + lx/3 + l/6 (10.3). The marked-only probe is the J = empty summand of (12.5):

    I_mark(Z) := Sum_{(p_i) in Prod P_i(Z)} Prod_i W_i(q_{p_i}/P_i) eta(p_i) I_{eta; p_1..p_K}(X, Y, Z q_{p_1..p_K}).

**Lemma Z1 (separation of the marked-only probe) [PROVED-rel MS (6.1), (6.2), (12.5), section 15.1].**

    I_mark(Z) = (Q^(-1/2)/2 pi) Sum_{sigma in T} Int_R W0hat(iv) Sum_{m != 0} Omega(q_m/Q) xi(m) (q_m/Q)^(-iv)
                A_{m,sigma,v}(Y) B^mark_{m,sigma}(Z) dv,

with A_{m,sigma,v}(Y) the additive factor defined above (6.2) and B^mark = B^J of section 15.1 at J = empty.
Proof. By the definition below (12.5), I_{eta;D} is (6.1) "with the indicator 1_{D | cn^3} inserted in its completed
row". The derivation of (6.2) from (6.1) (Mellin inversion in W_0, Fourier expansion of G over the ray characters
theta, class representatives s_sigma) treats the completed row as a coefficient sequence in A = cn^3 and uses of it
only that the m-dependence is chi_A(m); the indicator and the change Z -> Z q_p (which replaces Z^t by (Z q_p)^t under
the t-integral) do not touch X, Y, Q, Omega, xi or A_{m,sigma,v}. On 1_T one has theta(p) = 1 (MS, below (12.5)), so
marking commutes with the theta-expansion. Summing over the slot primes with the weights eta(p_i) W_i gives the
row displayed in section 15.1 for J empty. MS states this in the sentence after that display ("B^J is exactly the
completed-row factor for the J summand of Equation (12.5) after the marked slots have been summed"). QED

**Theorem Z (the row energy bounds the probe from above; equivalently the probe bounds the energy from below)
[PROVED-rel Lemma Z1 and MS Lemma 6.2].** With E_sigma(Z) = Sum_{0 < q_m <= C_Omega Q} |B^mark_{m,sigma}(Z)|^2 there is
c_0 > 0, depending on the fixed data only (|T|, sup |Omega|, Int |W0hat(iv)| dv, the constant of Lemma 6.2), with

    max_sigma E_sigma(Z) >= c_0 (Q Y/(Q + Y^2)) |I_mark(Z)|^2      for all Z.                                  (Z)

Proof. In Lemma Z1 apply Cauchy-Schwarz to the sum over m for fixed sigma and v; |xi(m)| <= 1, |(q_m/Q)^(-iv)| = 1,
Omega bounded with support in q_m <= C_Omega Q; Lemma 6.2 gives Sum_{q_m <= CQ} |A_{m,sigma,v}(Y)|^2 << (Q + Y^2)/Y
uniformly in v; B is independent of v; Int |W0hat(iv)| dv < infinity. Hence
|I_mark| << Q^(-1/2) ((Q + Y^2)/Y)^(1/2) max_sigma E_sigma^(1/2). QED
This is the proof of MS Proposition 6.3 with the inequality solved for the energy (Proposition 15.3 has the same
shape but uses the Gram bound of Proposition 15.2 in place of Lemma 6.2; with that bound, in its range
Y'^2/Q >= 1, the forced exponent at a split ly >= lx equals the value at lx = ly, so lx = ly is optimal but not
uniquely; first referee, E8); for each fixed
(sigma, v) the exact form is (T) with one probe vector.

**Corollary Z (Lemma C, Bessel form) [PROVED-rel Theorem Z, MS Proposition 2.1, and hypothesis (HC)].**
(HC): for the marked-only probe at the geometry (lx, ly, l), every primitive target eta has a holomorphic H_eta
on Re s > sigma_0 with (2.2), and J_eta = I_mark satisfies (2.5) with f_eta of (2.3), constants omega-independent as in
Proposition 2.1 (the saving sigma > 0 of (2.5) fixed independently of the target; J_eta is I_mark divided by the
normalisation c_S Prod_i(-A_i) Z^(-l/6) of size Z^(o(1)), absorbed by the open range of omega). Then for every
sigma_0 in (1/2, beta*) at which (HC) holds and every 0 < omega < beta* - sigma_0 there is a target eta with

    max_sigma E_sigma(Z) != O( (Q Y/(Q + Y^2)) Z^(2 C(sigma_0) + 2 omega) ).

At lx = ly = M/2 (where QY/(Q + Y^2) is of order Y = Z^(M/2)) the exponent is
M/2 + 2 sigma_0 - 5/3 + M/3 + l/3 = M + ksig(sigma_0), ksig(beta) = (2 + 2l - M)/6 - 2(1 - beta). So if (HC) holds at
one sigma_0 in (1/2, beta*) and E_sigma << Z^(k + eps) K for all targets (K = Z^M), then (letting omega tend to
beta* - sigma_0)

    k >= ksig(beta*) = (2 + 2l - M)/6 - 2(1 - beta*),      and      1 - h_E/6 + k/2 >= beta*,   h_E = 1 + l - M/2.     (C1)

Proof. If the displayed bound held for every eta, (Z) read from right to left would give (2.4) for every eta at
C(sigma_0) + omega; with (2.2) and (2.5), Proposition 2.1 gives a contradiction with beta* > sigma_0. For other
splits (lx, ly) of the same M the same argument gives the exponent min(lx, ly) + 2 beta - 2 + lx + (1 + l - lx)/3,
which on lx <= M/2 is increasing in lx and on lx >= M/2 decreasing: the split lx = ly is the best one. (In F_q[T]
this is Proposition 1 of the c7 lane: probes with k > (d+1)/2 are re-expressions of probes with k <= (d+1)/2.) QED

Comparison with Lemma C as printed in the c7 note.
* (C1) there: max(k_true, 1 + l - M) >= ksig(beta*), from identity (3.2) with weights w_k > 0 at every frequency and
  a diagonal term c D N. Here: k_true >= ksig(beta*) with no maximum and no restriction M >= 1 + l; no Poisson
  summation, no positivity of a kernel, no reciprocity sign, no coprimality bookkeeping, no treatment of the cube
  part (all of that is inside MS (6.2) and Lemma 6.2). Referee objection E1 concerned exactly the positivity of
  the non-sixth-power frequencies; it is not answered (the negative remainder measured in `c7-liou-high-row-bound`
  supports it; section 3 of this note does not test it), it is bypassed.
* The price: (HC). The c7 reading (b), "an input k <= kappa implies beta_eta <= 1 - h_E/6 + kappa/2 directly, by
  positivity, with no high side", is **not** obtained. What is obtained is: input k <= kappa plus (HC) implies
  beta* <= 1 - h_E/6 + kappa/2, which is Proposition 2.1 applied to the probe at the split lx = ly. Reading (b) is
  not established by the Bessel route or by the Poisson route; it is removed from the list of results, not refuted.
  The (C1) here is also a different statement from the c7 one: same exponent, no maximum with 1 + l - M, but
  conditional on (HC), and for beta* (some target) where the c7 statement was per target. Readings (a) and (c) become: (a) under (HC), a Cauchy-Schwarz low estimate with a true energy bound
  has B_low >= beta* [PROVED-rel (HC); this is a tautology of the format]; (c) relative to (HC) at
  some sigma_0 in (1/2, beta*), the diagonal-level input (k = 0) is false when h_E > 6 (1 - beta*) [PROVED-rel (HC)];
  the threshold "h_E > 3", independent of beta*, is NOT obtained (the case beta* = 1/2 is outside Proposition 2.1;
  first referee, E3; the same gap is in Lemma C (consistency) of `c7-probe-format-h-cap`).
* (HC) at lx < l is not available: (2.5) for the marked-only probe is Lemma 2 of the c7 note (ARGUED-rel MS row
  estimates, used outside (12.4)), and (2.2) fails for every sigma_0 <= 2/3 for sextic rows (map row Z24), so the
  statement is available only if beta* > 2/3 (then one admissible sigma_0 in (2/3, beta*) gives the full value
  ksig(beta*)); if beta* <= 2/3 nothing is obtained, and if beta* = 1/2 the corollary is empty (first referee, E2).
  The normaliser of the marked-only probe is H_eta Prod_i Bmark_i(s) (c7 Lemma 3); (2.2) also needs a lower bound
  for Prod_i Bmark_i, which (16.13) gives only in the region where the four error exponents are <= -7/8.

**Lemma A's aligned-probe size, made explicit.** Lemma A of `c7-probe-format-h-cap`: a low estimate that depends on
the row coefficients only through their moduli also holds for the aligned target eta' = eta eps,
eps(p) = -conj(eta(p)), whose reciprocal series is zeta_F(s)/zeta_F(2s) with a pole at s = 1.
* Z[omega], size [ARGUED: needs (2.5) for the aligned target, c6-marks Liouville control. The related statement
  for the energy (not for the probe), c7-liou Theorem A, has its principal term P proved non-negative in class rows
  and its remainder ARGUED]: |I_aligned(Z)| of order Z^(C(1)) = X^(1/2) Z^(h/6), so by (Z)
  E_aligned >= c Q Z^(h/3) (lx >= ly), at the optimal split E_aligned >= c K Z^(h_E/3), h_E = 1 + l - M/2.
  At M = 1, l = 0: K Z^(1/6) = Z^(7/6), the exponent of `c7-liou-high-row-bound` Theorem A (kappa ~ M^(5/6) X^(1/3),
  abs(m_w) of order 1). Each unit of mark length adds Z^(1/3) to the forced energy.
* F_q[T], exact [PROVED-rel Proposition 3; EXACT in the 5 mu rows of section 3]: for w = mu and coherent marks,
  mu(B) W(B) = -omega_lam(B) for lam >= 1 (omega_lam(B) the number of prime factors of B of degree lam) and
  mu(B) W(B) = 1 for lam = 0 (put omega_0 = 1). So abs(S_cop(k)) = Sum_B omega_lam(B) n_k(B) with
  n_k(B) = #{c monic, deg c = k, (c, B) = 1}: a sum of positive integers, and

      S = wt^2 q^(d-2k) (Sum_B omega_lam(B) n_k(B))^2 / (1 - 1/q),      D = q^d Sum_B omega_lam(B)^2 q^(N') phi(B)/|B|.

  Values: Sum_B n_2(B) = 12600 at (N, lam) = (3, 0) (of 294 * 49 = 14406), S/D = 300/49; with marks 9282, 6027,
  9534 at (2, 1), (1, 2), (3, 1). The estimate S/D = wt^2 pi_lam q^(-lam) (density factors) is within 3 percent at
  lam = 2 (3 against 2.918) and 13 percent at lam = 0 (7 against 6.12), and off by a factor 0.38 to 0.40 at lam = 1
  (7 against 2.655, 2.814; omega_1(B) takes the values 1 and 3 there). In all rows the aligned marked row exceeds
  the diagonal by the weight wt^2 times a constant between 0.38 and 1.
  For a target nu the same formula holds with Sum_B replaced by the Moebius sum of nu with the coprimality
  weights: S/D is of order wt^2 pi_lam |M_N(nu)|^2 / ((1 - 1/q) q^lam q^(2N)) at N = 1 (for example
  7 * 21 * 1 / ((6/7) * 49 * 49) = 0.071 against the exact 0.0596 at (a, 1, 2, 4)).

## 5. Corollary: probes of the Proposition 2.1 format with coherent marks

**Corollary (restatement of Proposition 2.1 and Lemma A in energy units) [PROVED for the Cauchy-Schwarz/Bessel
step; for r other than 6 the format is a model definition, not manuscript text; the sizes are relative to the
high half of the format, as labelled].** Let a probe of the Proposition 2.1 format be given: rows B_m of order r (dual
frequencies at r-th powers), a separation I = Q^(-1/2) Sum_m A_m B_m with ||A||^2 of order Q/Y (lx >= ly), signal
exponent C(s) = s - 1 + lx/2 + h/r, and marks that are coherent at the r-th power frequencies (the mark weight
cancels the phase of the local factor of the reciprocal, so the principal slot multiplier is -1 + o(1), as in
(16.13)), so that h = 1 - lx + l.
1. (Low input) The statement "energy of the marked rows <= Z^(kappa + eps) K" implies (2.4) at abscissa
   sigma_0 = 1 - h/r + kappa/2 (from abs(I) <= Q^(-1/2) ||A|| E^(1/2) = Z^(lx/2 + kappa/2 + eps)); at the split lx = ly
   this is sigma_0 = 1 - h_E/r + kappa/2, h_E = 1 + l - M/2.
   [PROVED: (T)(a).] With the high half (2.2), (2.5) it implies beta* <= 1 - h_E/r + kappa/2. [PROVED-rel Prop. 2.1.]
2. (Necessity) Under the high half, every true energy bound has kappa >= 2 (beta* + h_E/r - 1); the diagonal level
   kappa = 0 is false if h_E > r (1 - beta*). [PROVED-rel Prop. 2.1 with (HC) at one sigma_0 in (1/2, beta*); (T)(b).
   The beta*-free threshold h_E > r/2 is not obtained.]
3. (Modulus-only proofs) For the aligned control the squared signal is K Z^(2 h_E/r) [ARGUED over Z[omega];
   EXACT in F_q[T] at dual length 0, where it is the bounded factor wt^2 c]. So an energy bound at level
   kappa < 2 h_E/r cannot follow from the moduli of the row coefficients. With r = 6 and unmarked rows at M = 1
   this is the Z^(1/6) of the Liouville rows; the manuscript's bound (5.36) is not modulus-only (it uses the
   reflection, Prop. 5.1, available for M + l <= 1).
4. (What the marks do) Coherent marks of length l raise h_E by l (signal by Z^(l/r), forced energy by Z^(2l/r)).
   They do not change which statement the low input is: at every l it is item 1.

The corollary is the format read in both directions. It does not say that the input is unprovable; it says that
(i) the input is at least as strong as the conclusion drawn from it in that block (true of any Cauchy-Schwarz
format), and (ii) the class of proofs that would give it for free (large sieve, duality, positivity: anything
through moduli) is excluded at every h_E > 0 by the aligned control. Item (ii) is the obstruction.

## 6. Controls

No zeta-only mechanism is claimed, so no control has to fail; the table records where each ingredient stands.

| control | abstract (T), Theorem Z | closed form of the squared signal | size of the squared signal |
|---|---|---|---|
| random unimodular marks (u_P or u_p in place of the coherent weight) | holds (linear algebra) | F_q[T]: holds with W(B) = Sum_P u_P nu(B/P): EXACT, 8 of 8 runs (random sixth roots of unity, 3 + 2 + 3 seeds) | **fails**: S_cop = -Sum_P u_P (Moebius sum for P) has no common sign; S drops by about pi_lam. EXACT: (a, 1, 2, 4): S/D = 0.0596 coherent against 0.0012, 0.0018, 0.0028; (a, 2, 1, 4): 0.1022 against 0.0008, 0.0337 (pi_1 = 7); (mu, 1, 2, 4): 2.918 against 0.060, 0.086, 0.139. Z[omega]: the slot factor Sum_p W u_p conj(eta-phase) q_p^(-5/6) (-1 + ..) has typical size P^(-1/3) instead of P^(1/6): h drops from 1 - lx + l to 1 - lx - 2l [ARGUED: random-sum size]. (16.13) itself still holds (it does not involve the mark weight); what is lost is the hypothesis of (12.5) that the mark equals eta(p), so the slot sum that uses (16.13) loses its constant phase. In F_q[T] no identity fails; only the size changes |
| reflected rows ((E-K) setting) | holds: the energy is that of the row vector, the same number in every representation (MS Prop. 5.1 is an identity for B_m) | no closed form in either column for the reflected representation | the bound is a lower bound; see section 7 |
| aligned target (Liouville-type; mu in F_q[T]) | holds | F_q[T]: EXACT, sum of positive integers | 84 to 98 percent of the energy (5 rows, coherent marks); with random marks S/D = 0.06 to 0.49; a Weil target reaches 72 percent (second referee) |
| unimodular completely multiplicative twist of the target, marks twisted with it | holds | holds (the F_q[T] law is exact for any weight) | that of the twisted reciprocal: not separated from the target |
| Davenport-Heilbronn-type combination | holds for the combined vector (linear algebra; no cross-term problem in the Bessel form, unlike the c7 Poisson form) | F_q[T]: Proposition 3 exact for the weight nu_a + nu_b (c7 lane) | the signal is the sum of the signals; Prop. 2.1 continues each reciprocal separately. Fails at the Euler product in the reciprocal (MS Lemma 7.1), as in c5 |
| sign-twisted primes, THIN | holds | holds | abscissa of the twisted reciprocal; Euler-blind |
| backward heat, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | not applicable to a statement about row vectors of an estimate system; not run | | |

## 7. What is not covered (so that lanes c8-ek-* are not pre-empted)

1. **Upper bounds for the remainder.** The theorem bounds the energy from below by the squared signal. (E-K)
   (vector-specific mean square of reflected, completed marked theta rows for QP > Z at the diagonal level) is an
   upper bound for S + Rem. The theorem gives: (E-K) at (M, l) implies, with the high half, beta* <= 1 - h_E/6; and
   (E-K) is false where h_E(M, l) > 6 (1 - beta*), relative to (HC) at the split used (unproved for lx < l).
   Wherever h_E <= 6 (1 - beta*) the forced lower bound is at or below the diagonal level and the theorem is silent
   (no upper bound for the squared signal is proved). In the
   computed F_q[T] rows of the two Weil targets Rem/D lies between 0.58 and 1.01: the remainder is where (E-K)
   lives, and nothing here bounds it.
2. **The reflected representation.** No dual form of the row Gram matrix is derived in either column; the K-loss
   of Lemma HS (operator norm) is not addressed. That E - D - S is negative in the model shows only that the
   off-diagonal non-coherent part can lower the energy; its size and sign for QP > Z are not studied.
3. **The compensated probe (12.5) with its rescaled terms.** The rows B^J for J non-empty live on different row
   sets (Q' = Q/q_{p_J}^2); the theorem applies to each J separately and says nothing about the combination. Its
   F_q[T] transcription is assigned to `c8-ek-ff-reflected-rows-exact`.
4. **Low estimates that are not norm bounds** (cancellation in the sum over m beyond the two norms).
5. **The range where the sixth-power count grows** (dual length r >= 7 in F_q[T], d >= 17): not computed by anyone.
6. **Smooth weights, cube part, excluded set, ray classes** in F_q[T]: the block model has none of them.
7. **The Liouville row-bound theorem** (remainder of c7-liou Theorem A): assigned to `c8-liou-row-bound-theorem`.
   Remark for that lane: (Z) gives a second route to the lower bound E_liou >> Z^(7/6) that does not use the
   Poisson remainder; it needs instead the lower bound |I_liou| >> X^(1/2) Z^(h/6) for the probe (6.1) with the
   Liouville weight (residue at the pole x = 1 of row u = 1; other rows L(x, chi_u)/L(2x, chi_u^2), holomorphic in
   Re x > 1/2). Not carried out here.

## 8. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | (T) is linear algebra; the F_q[T] signal law is exact for non-multiplicative and random-mark weights (8 control runs here; c7 controls n1, n2, dh); Theorem Z holds for any coefficient sequence |
| R2 height-uniform, every window | false | no statement about a function or its zeros |
| R3 controls fail structurally | false | nothing fails for the target-type controls; the one change recorded (random marks) is a change of size, at the hypothesis "mark = eta(p)" of (12.5); it is a control on the marks, not on the target |
| R4 reaches the critical line | false | the statement is that the low input of the h > 1 vertices contains the squared signal; no probe with h > 1 is established |

## 9. Three weakest steps

1. **The Z[omega] size statement rests on the high half (HC), which is not proved at the geometries of interest.**
   Theorem Z is unconditional relative to MS (6.2) and Lemma 6.2, but (C1) needs (2.2) and (2.5) for the
   marked-only probe at lx = ly = M/2 with lx < l; (2.5) there is ARGUED (c7 Lemma 2), (2.2) fails for
   sigma_0 <= 2/3, and the slot normaliser Prod_i Bmark_i has a lower bound only where (16.13) applies. The c7
   reading "(b): with no high side" is lost. MS (6.2), Lemma 6.2 and section 15.1 are quoted from an unrefereed
   manuscript read as text; Lemma Z1 depends on the reading that marking changes the completed row only.
2. **The F_q[T] closed form is exact only at dual length 0, where the sixth-power weight is at most q.** The
   exponent-level meaning (wt = q^(r/6)) is cited, not computed; the recheck covers q = 7, N' <= 4, d <= 4, 22
   runs. The dictionary between the columns (c_k for A_{m,sigma,v}, sharp degrees for smooth weights, squarefree A)
   is an analogy; "the same law" is established at the level of exponents and of the Cauchy-Schwarz step, not as
   a transfer theorem.
3. **The three round-7 coherent terms are identified in exponent, not as one quantity.** The Bessel term (this
   note), the Poisson term P_w = kappa abs(m_w)^2 (c7-liou) and the term of (3.2) (c7 note) agree at the optimal
   split in exponent; no identity between the Bessel term and P_w is proved, and in the model E - D - S < 0, so
   they cannot both be "the excess over the diagonal". The modulus-only obstruction (Corollary item 3) over
   Z[omega] rests on the aligned-probe size, ARGUED; in F_q[T] it is exact but a bounded factor.

## 10. Proposed map and strategy changes (not applied)

* Map row (proposed, Z-series): "Row energy of coherent marked rows: E = squared signal + Rem, Rem >= 0 (Bessel;
  EXACT in F_q[T] at q = 7, N' <= 4; PROVED-rel MS (6.2), Lemma 6.2 over Z[omega]). The low input of every h > 1
  vertex is hypothesis (2.4) at 1 - h_E/r + kappa/2; excluded for modulus-only proofs at every h_E > 0 by the
  aligned control; E >= D + signal is false in the model. Lemma C of the c7 note holds in the Bessel form
  relative to the high half (HC), available only for beta* > 2/3 with the manuscript's normaliser; its reading (b) is not established (not refuted)."
* Section 7 (statements not established, to be recorded as such): c7-uncompensated Lemma C reading (b); identity
  (3.2) with positive weights and a diagonal term (neither is refuted here).
* STRATEGY 4.0: the marks item is not closed; it is merged into (E-K) (one open hypothesis under ORDER-2, unchanged
  by this note). Lemma C stays a referee debt in the form "(C1) relative to (HC)"; lanes that used reading (b) or
  the threshold h_E > 3 must cite the conditional form.

## 11. Referee record and corrections applied

Two referees were run as separate headless sessions with no access to this session's reasoning, restricted to
reading, local runs through `scripts/memcap.sh 8`, and writing one file each. Both: **holds with corrections.**
Both set R1 = R2 = R3 = R4 = false.

First referee (`REFEREE.md`), corrections E1 to E8, all applied above:
* E1: formula (T) for a non-real Gram matrix corrected to J^T G^(-1) conj(J) (no later step used the wrong form).
* E2: Corollary Z needs sigma_0 in (1/2, beta*) with (HC) at that sigma_0; with the manuscript's normaliser this
  requires beta* > 2/3, and then gives the full ksig(beta*); empty if beta* = 1/2.
* E3: the beta*-free threshold "h_E > 3 (or r/2) makes the diagonal input false" is not obtained; only
  h_E > 6 (1 - beta*) relative to (HC). The same gap is in Lemma C (consistency) of `c7-probe-format-h-cap`.
* E4: reading (b) of the c7 Lemma C is not established by either route; it is not refuted.
* E5: identity (3.2) of the c7 note was not tested by the model computation; it stays not established.
* E6: "decisive test" is a recomputation (the Bessel identity cannot fail); the modulus-only exclusion is ARGUED
  over Z[omega] and a bounded factor in the model.
* E7: section 5 is a restatement of Proposition 2.1 and Lemma A; the marks branch is reduced to (E-K), not closed.
* E8: (16.13) is printed for the two-term multiplier; Prop. 15.3 uses Prop. 15.2, with which the split lx = ly is
  optimal but not uniquely; one worked example had an unstated factor 1/(1 - 1/q).

Second referee (`REFEREE2.md`), independent code (resultants by the Euclidean algorithm, own reduction of
Z[zeta_42], gcd-based coprime counts, direct count for the diagonal): 36 runs, all identities pass; every number of
section 3 confirmed; 9 new coherent cases including a third Weil target T^3 + 3 and nu_a + nu_b; stored blocks
(b, 2, 1, 4), (b, 1, 2, 4), (dh, 2, 1, 4) equal. Corrections E1 to E8, all applied above:
* E1: (16.13) is not the step that fails under random marks; the hypothesis "mark = eta(p)" of (12.5) is.
* E2, E3: the eight random-mark runs contain five independent draws; the N = 1 factors are an identity in
  |Sum_P u_P|^2; the drop is "about pi_lam" in the mean only when the T_P are of equal size.
* E4: the leading-order estimate wt^2 pi_lam q^(-lam) is off by a factor 0.4 at lam = 1.
* E5: the Weil-target ranges depend on the two targets chosen; a third Weil target has S/D up to 1.56.
* E6: "E >= D + S is false in the model" restricted to the computed cases, all with d <= N' + 1.
* E7: (E-K) sentences reworded: forced lower bound, not an upper bound for the squared signal.
* E8: one float comparison sat under the label EXACT; J(2) = 0 at r = 1 is a computed fact; "unimodular" marks
  were sixth roots in this note's runs (42nd roots in the referee's, 9 of 9 pass).

Not re-checked by either referee: the Gauss-sum code of this note was re-implemented only by the second referee;
the Z[omega] statements were re-derived only by the first; map row Z24 ((2.2) fails for sigma_0 <= 2/3) was taken
as recorded.

**State after both referees.** Holds: Theorem Z (Cauchy-Schwarz, relative to MS (6.2), (12.5), section 15.1,
Lemma 6.2); the F_q[T] identity with closed form at dual length 0; the exponent of (C1) relative to (HC). Does not
hold as first written: "closes the marks branch"; the threshold h_E > 3; "(3.2) has no counterpart"; the named
step of the random-mark control. Lemma C of the c7 note therefore remains a debt in its original form (reading
(b), identity (3.2)); lanes of rounds 6 to 8 that rest on it can cite only "(C1) relative to (HC), for
beta* > 2/3", or the F_q[T] identity.
