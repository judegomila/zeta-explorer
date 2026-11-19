# REFEREE: c10-ff-slot-cross-decomposition (lens: general)

2026-11-19. Adversarial referee. Only this file was written. Local runs through `scripts/memcap.sh 8`; the server
was not used. Referee scripts: `/tmp/c10ref/bf.py`, `/tmp/c10ref/chk.py` (outside the repo, not kept).

## Verdict

**The partial result holds as a model statement, with four corrections (section 3).** Every PROVED step was
re-derived and confirmed; the exact integers reproduce on three cases the lane did not check; the rule counts and
headline numbers reproduce from the raw `results/` files. No statement about zeta or zeros is made, RH is not
assumed (Weil's theorem for Dirichlet characters over F_q[T] is the only deep input and is cited as classical),
verified height is not restated, and no known theorem is presented as new. Flags: R1 false, R2 false, R3 false,
R4 false (agree with the lane).

## 1. PROVED steps, re-derived

| step | status | note |
|---|---|---|
| Lemma X1 (slot form) | CONFIRMED | Res(PA', (PA')') = Res(P,P') Res(A',A'') Res(P,A') Res(A',P), and Res(A',P) = (-1)^(N lam) Res(P,A'), so l(PA') = l(P) + l(A') + 2 log chi_0(Res(P,A')) + const(N, lam, q); with g = 5 l + 3 sg the cross phase is chi_0(Res(P,A'))^10 = chi_0^4. xi_P is a character of A' mod P of order 3 (norm to F_q is surjective, q = 1 mod 6). Relative to the phase formula `gphase` (not re-derived from the cubic Gauss sum; the lane labels this PROVED-rel). Numerically: kappa is a single value over all (P, A') in the three referee cases below. |
| Lemma X2 (identity) | CONFIRMED | Expansion of a square and linearity of an orthogonal projection. CR - B = E_perp - SD is correct. |
| Lemma X3 (SD = D up to Weil) | CONFIRMED | Diagonal A_1 = A_2 gives D because lam > d, lam > N make chi_P(m) and xi_P(A') unimodular. For A_1 != A_2 (both squarefree monic of degree N) some prime divides exactly one, its local component is chi_0^4 of the norm, non-trivial; the constant sign cancels because deg A_1 = deg A_2. L-function degree <= 2N - 1, prime-power correction <= 2 q^(lam/2), so abs(Pi_lam) <= (2N+1) q^(lam/2)/lam. The two numerical values quoted (0.27 at lam = 7, 2.1e-3 at lam = 12 for `one`, q = 7, N = 2, d = 2) recomputed by hand: 0.270 and 2.08e-3. Referee check of the formula itself: sum over A_1 != A_2 of u u-bar zeta^(g-g) T_d Pi_lam equals SD - D to the integer in 12 vector-cases; max abs(Pi_lam) = 34.0 against the bound 78.1 (q = 13, lam = 3) and 51.96 against 129.6 (q = 7, lam = 5). |
| Lemma X4 (slot signs) | CONFIRMED | Mean over independent signs of the square of a signed sum. |
| Remark X5 (d = 1, translation-invariant u) | CONFIRMED | Substitution T -> T + t permutes primes of degree lam and cofactors, leaves discriminants and resultants fixed; the 7 (13) linear rows are one orbit. In the data n = 0 exactly for `one`, `mu` at every d = 1 configuration. |

The O-statement "O(N q^(N - lam/2))" is for vectors of modulus 1 on their support; the bound is trivial (> 1) for
lam <= 2N + 2 or so, which the lane says (weakest step 2).

## 2. Numerical reruns

**Independent brute force on new cases.** Own code: resultants by Sylvester determinants (the lane uses the
Euclidean algorithm), primes by a sieve of products, Moebius by counting roots, chi_{PA'}(m) from the product
polynomial phase. Cases not among the lane's checks: q = 13 (2, 3, 1), q = 13 (2, 3, 2), q = 7 (2, 5, 2). Compared
with the ENS lines of `results/`:

| case | vectors | E, D, SD, norm(J_0), SB_0 |
|---|---|---|
| q = 13 (2, 3, 1), 728 primes | one, a, c4, mu | all equal (E = 0 in all four; SD 1484496, 1342128, 1345712, 1297296) |
| q = 13 (2, 3, 2), 728 primes | one, a, c4, mu | all equal (E = 0, 681408, 722176, 0) |
| q = 7 (2, 5, 2), 3360 primes | one, a, mu | all equal (E = 62921880, 3858840, 36250200) |

The kernel `ffs ens` rerun locally on q = 13 (2, 4, 2) (three weights) reproduces the stored lines.

**Counts from the raw files (own parser, not `analyze_slot.py`).** Rule A: 288 cases, max abs(s - 1) = 2.355e-3 at
q = 7 (3, 7, 1) `one`. Rule B: 593 of 596 with the same three violations (4.4526, 8.1258, 1.6564). Rule C: max
0.5105 of the bound. Target a, q = 7 (2, 12, 1): e = 20.63898, s - 1 = -1.27e-5, beta = 19.42606, n = 1.21292,
c_coh/c = 0.98188. Target b there: e = 7.46817, beta = 2.15845, n = 5.30972. q = 13 (2, 7, 2), a: e = 2.33539.
Slot signs at (2, 12, 1): a -> 1.014, 0.503; mu -> 0.560, 0.916. B(a) q^N = B(mu) exactly in 20 of 20 (N = 2,
B(mu)/D >= 3). c/(e - 1) for e >= 2, lam >= 10: 32 cases in [0.999979, 1.000048]. All as stated.

**Post hoc direction u(m), specificity test (new).** At d = 1, q = 7 there are 63 non-constant sign directions up
to a global sign. Squared signal added to span{v_0} by each direction, for the stored rows:

| (N, lam, d) | vector | n | own u(m) | other target's u(m) | median of the 63 | rank of own |
|---|---|---|---|---|---|---|
| (2, 10, 1) | a | 0.224 | 0.221 | 0.005 | 0.031 | 1 |
| (2, 10, 1) | b | 1.202 | 0.977 | 0.048 | 0.137 | 1 |
| (2, 12, 1) | a | 1.213 | 1.147 | 0.014 | 0.100 | 1 |
| (2, 12, 1) | b | 5.310 | 5.235 | 0.022 | 0.563 | 1 |
| (2, 8, 1), (2, 11, 1) | a, b | <= 0.32 | <= 0.071 | - | - | 16 to 63 (not active) |

So for the two targets at d = 1 the lane's post hoc statement reproduces and is specific to the vector's own
character (the other target's character takes almost nothing).

## 3. Errors and corrections

1. **"n <= 1.5 in 593 of 596" is wrong as worded** (task claim; section 10 and `MAP_ROW_PROPOSED.md`). 593 of 596
   is the count for the registered statistic c_perp = n - s + sb. For n = (E - B)/D itself: n > 1.5 in 13 of 596
   (mu 7, class U 5, b 1), as the lane's own section 4 table says. Correct wording: "c_perp in [-1.05, 1.5] in 593
   of 596; n <= 1.5 in 583 of 596". The body of RESULT.md (item 3, section 3.1) states the rule correctly.

2. **The post hoc "second squared signal" is not evidenced for mu, nor for `one` at d = 2: there it is a dimension
   count.** For a translation-invariant vector (one, mu) and d = 2, R(m) depends on disc(m) only (Remark X5) and is
   covariant under T -> cT, so R(c^2 D) = psi(c) R(D). In `results/q7_N2_lam11_d2_L.txt` the rows of `one` and `mu`
   take one value per discriminant, vanish at disc = 0, and the values at disc 1, 2, 4 (and at 3, 5, 6) differ by
   powers of zeta_6. The row vector therefore lies in a 2-dimensional space. v_1 and mu(m) v_1 are two independent
   vectors of that space, so "mu at (2, 11, 2): 2.616 of 2.616", "(3, 10, 2): 2.33", "q = 13 (2, 6, 2): 1.73" with
   remainder exactly 0, and the `one` rows where v^(2..5) "take the whole remainder", are forced: any second vector
   of the right symmetry type would give the same. Of the three rule-B violations, the mu one is explained by this
   symmetry, not by a direction u(m). The count "at most 1.47 in all 538" includes these cases.
   What survives: the u(m) signal for non-invariant vectors at d = 1 (7 rows; a, b at lam = 10, 12; U2 at lam = 10,
   12; a at (3, 11, 1)), confirmed specific in section 2. At d = 2 the lane's own file shows it does not take the
   remainder for class U (U2 at (2, 10, 2): 0.38 of 1.81; at (2, 11, 2): 0.35 of 1.53). So the statement is
   supported at d = 1 only, at one q, at the two active mark lengths.

3. **Short marks: "no target excess" holds for the six interior target values at N >= 4, not at the window edge
   or at N = 3.** `short_tables.md`, q = 7 (4, 1, 3): a cr = +0.116, b cr = +0.130 (ratio 1.122) against class U
   -0.064 .. +0.086 and class r -0.008 .. +0.073; (3, 1, 3): a ratio 1.165, cr +0.071 against class U up to +0.048.
   With 7 marks and 4 seeds per class these are small, but they are outside the control ranges and the summary
   omits the edge rows. The reconciliation "model and screen agree at the same geometry" rests on 6 values at
   N = 4, 6 with 7 to 21 marks.

4. **Section 5.3 is a float proxy and was not rerun here.** Arithmetic checked: 0.397 = 256^(-1/6); the four
   predicted values 3.2e-4, 3.1e-4, 1.5e-4, 1.5e-4 follow from the table entries; 7.6 and 152; 158^6 = 1.6e13,
   346^6 = 1.7e15; the Z^(-2/3) scaling. The inputs A(THETA)/A(ALIGNED) and the c9 screen values were taken as
   given. The 1e10-column figure extrapolates a K^(1/6) law over 13 to 15 orders of magnitude from data with
   measured slope 0.07 to 0.13 (the lane says so). It is an ARGUED estimate, correctly labelled; it should not be
   quoted without that label.

Smaller points.
- "Random signs on the marks return it to about 1": two seeds at (2, 12, 1) with 7 rows, values 1.01 and 0.50.
  The exact statement is Lemma X4 (mean = SD); the per-seed scatter at d = 1 is of order 0.4.
- B(a) = B(mu)/q^N is an exact observation in 20 configurations at N = 2, not a proved identity; the reading
  "squared ratio of the Moebius sums" is ARGUED.
- Process: the lane terminated a local process of another lane (`euler/queue3.sh`, PID 80786) through a
  name-based process list and used `pkill -f` locally. Disclosed in section 9. The owner of the euler lane should
  be told; name-based kills should not be used on either machine.

## 4. Controls, RH, novelty

- No zeta-only mechanism is claimed, so no control has to fail. The lane's own result is that the statistic does
  not separate the target from random multiplicative signs (class U: 50 of 51 inside the range) and that
  random slot signs remove the cross term for every vector (Lemma X4). Both confirmed in the stored data
  (U2 at (2, 12, 1): e = 74.27, larger than the target's 20.64).
- RH is not assumed. Weil's bound is used for a Dirichlet L-function over F_q[T], where it is a theorem.
- Nothing known is presented as new: X2, X4 are elementary; X3 is a standard application of Weil, labelled as
  such; the new content is the exact data and the bookkeeping.

## 5. Requirement flags (referee's own setting)

| flag | value | reason |
|---|---|---|
| R1 | false | Multiplicativity enters the formula of X1 only; random multiplicative signs give the same split and larger excess. |
| R2 | false | Fixed q, degrees <= 15; no height, no window statement. |
| R3 | false | No control fails where the target passes. |
| R4 | false | Function-field model; no abscissa, no passage to the critical line. |

## 6. Surviving claim

F_q[T], exact integers, q = 7 and 13, N = 2, 3, d <= 3, long marks (lam > N, lam > d), 58 configurations plus one
optional. (i) E = D + (SD - D) + CRperp + CRcoh, B = SB + CRcoh (identity; verified on three further cases).
(ii) abs(SD/D - 1) <= (2N+1) q^(lam/2) q^d nsupp^2 / (lam pi(lam) sum cop_d) by Weil; measured <= 2.4e-3 for
lam >= 7; hence the excess over the diagonal is the cross term over pairs of distinct marked primes (c/(e - 1)
within 5e-5 of 1 for lam >= 10). (iii) Target a at q = 7 (2, 12, 1): e = 20.639, Cross/D = 19.639, B/D = 19.426.
(iv) The registered rule c_perp in [-1.05, 1.5] holds in 593 of 596 and fails for b (4.45), one U seed (8.13) and
mu (1.66); n <= 1.5 in 583 of 596. (v) Post hoc, at d = 1 the remainder of a, b and one U seed at lam = 10, 12 is
a squared signal in the vector's own character at the row variable (specific: rank 1 of 63 sign directions); for
mu and `one` at d = 2 the apparent resolution is forced by a 2-dimensional symmetry space and is not evidence;
`one` at d = 3 is open. (vi) At short marks, interior configurations with N >= 4, targets are within the control
ranges (6 values); window-edge and N = 3 rows are not. (vii) The Z[omega] size estimate (1.5e-4 to 3.2e-4 of the
diagonal; visibility near 1e10 columns) is a float proxy and an extrapolation, ARGUED. No statement about zeta.
