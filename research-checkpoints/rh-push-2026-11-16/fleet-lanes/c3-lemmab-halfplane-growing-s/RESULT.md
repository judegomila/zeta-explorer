# c3-lemmab-halfplane-growing-s: Lemma B with poles on Re s = sigma_0, against the zero-free half-plane Re s > 7/8

Date: 2026-11-18. Kind: combine (Lemma B of `c2-euler-at-zeros` section 5 x zero-free half-plane Re s > 7/8).
Nothing here proves or refutes RH or moves any bound. No statement about zeros of zeta is made.
Labels: PROVED (argument given here, unrefereed), CLASSICAL, MEASURED (float64 + mpmath, not interval), ARGUED, OPEN.
All runs local under `scripts/memcap.sh 8`, single process. The compute server was not used (no units to stop).

## 0. Verdict

**Precise obstruction.** The combination gives positivity of the Krein sum on the class `{zeta_S W}` only for support
length `T_w <= 2 log log T - O(log log log T)`. `T_w >= c log T` is not reachable by any choice of `sigma_0` or `S`.

1. The decisive question has a closed answer. With the residues bounded in absolute value, the admissible support is
   `T_w <= f(sigma_0) log log T`, `f(sigma_0) = (sigma_0 - Theta)/((1 - Theta)(sigma_0 - 1/2))`, where `Theta` is the
   zero-free abscissa used. `f` is increasing in `sigma_0` for every `Theta > 1/2`, with `f(1) = 2` for every `Theta`,
   and `f = 2` identically for `Theta = 1/2`. With `Theta = 7/8`: `f(0.9) = 0.5`, `f(0.95) = 1.33`, `f(1) = 2`.
   Moving the poles into the strip loses: the factor `N_S^(sigma_0 - 1/2)` gained against `sqrt(N_S)` is smaller than
   the factor `(log T)^(8(1 - sigma_0))` lost in the bound for `zeta'/zeta`. The cap `2 log log T` is the Littlewood
   scale `X = (log T)^2`; it is the same with RH as input (PROVED as a statement about this method, section 4).
2. The 7/8 theorem adds nothing in this slot. Putting the poles on `Re s = 1 + 1/T_w` (absolute convergence, only
   `|Lambda(n)| <= log n` used) gives the same range `2 log log T - 2 log log log T - C` with explicit constants and no
   zero-free input. The classical Weil formula with no multiplier gives `2 log log T - C` (section 4, Proposition T).
   The multiplier `zeta_S` is not better than no multiplier.
3. For `sigma_0 > 1` the residue sum is the Weil prime sum of the test `Z_S w`, term for term after Poisson
   summation on the pole lattice (PROVED by comparison of two convergent identities; MEASURED: agreement 1.7e-10 at
   `sigma_0 = 2`). What survives of Lemma B is a convergent regularisation of the explicit formula for a
   non-compactly-supported test; it carries no inequality of its own.
4. Growing `S` makes the bound worse: each prime adds a small-divisor factor `(1 + T_w/log p)` and no support. The
   best `S` for a given `T_w` is the empty set.
5. Pontryagin count: the class has codimension density `d(T) = (log(T/2 pi) - T_w)/(2 pi)` per unit height; the
   multiplier contributes 0. At `T_w = 2 log log T` the count bound is the zero-counting function itself (vacuous).

Controls: the best version (`sigma_0 >= 1`) is passed by E_a (measured), by RZ_b, by the Liouville twist, by the
unimodular twist and by window translates. R1, R3, R4 not met.

## 1. Plan; what is new against the map and against c2

Read: BRIEF; OBSTRUCTION_MAP sections 1-2 and rows P10, P13, P14; `c2-euler-at-zeros` RESULT section 5 and REFEREE
(Lemma B and Corollary B1 re-derived there). The sibling lane `c3-lemmab-referee-dh-poisson` had no RESULT.md when
this was written (scripts only); item 3 above was derived here independently.

New here: (i) Lemma B at a general shift, with the support condition and the constants; (ii) the `|S| >= 2` bound in
contour form, which needs no divided differences; (iii) the exponent function `f` and the answer to the decisive
question; (iv) the identification of the residue sum with the Weil prime sum for `sigma_0 > 1`; (v) the E_a run of the
shifted identity.

Sign of the shift. The assignment writes the multiplier as `zeta_S(s + 1 - sigma_0)`. That choice puts the poles of
the mirror factor on `Re s = 2 - sigma_0 >= 1`. The multiplier with poles on `Re s = sigma_0` and `1 - sigma_0` is
`zeta_S(s - 1 + sigma_0)`. Both are the same one-parameter family (`delta = sigma_0 - 1/2` below, any `delta > 0`);
the assignment's literal choice is the case `sigma_0 -> 2 - sigma_0 >= 1` and is covered.

## 2. Lemma 1: bounds for (zeta'/zeta)^(j) on Re s = sigma_0 from a zero-free half-plane

**Lemma 1. CLASSICAL technique (Titchmarsh 14.2, 14.5 with 1/2 replaced by Theta); constants not made numerical.**
Assume `zeta(s) != 0` for `Re s > Theta`, `1/2 <= Theta < 1` (Theta = 7/8 is Lean-checked, map section 1 item 2).
Put `L = log t`, `LL = log log t`, `theta(sigma) = (1 - sigma)/(1 - Theta)`. There are absolute constants `C_0, C_1`
such that for `t >= t_0` and all `j >= 0`:

    (a) Theta < sigma_0 <= 2:        |(zeta'/zeta)^(j)(sigma_0+it)| <= (j+1)! C_0 L (4/(sigma_0 - Theta))^(j+2)
    (b) Theta + 4/LL <= sigma_0 <= 1: |(zeta'/zeta)^(j)(sigma_0+it)| <= (j+1)! C_1 LL^(j+2) L^(theta(sigma_0))
    (c) sigma_0 > 1:                 |(zeta'/zeta)^(j)(sigma_0+it)| <= sum Lambda(n) (log n)^j n^(-sigma_0) <= (j+1)!/(sigma_0-1)^(j+1) + O_j(1)

Proof. (a) `log zeta` is analytic in `Re s > Theta`, `|Im s| >= 1`, and `Re log zeta = log|zeta| <= A L` for
`Re s >= 1/2` (convexity). Borel-Caratheodory on the circles centred `2 + it` of radii `R = 2 - Theta - eta`,
`r = 2 - Theta - 2 eta` gives `|log zeta(s)| <= (2r/(R - r)) A L + ((R + r)/(R - r)) |log zeta(2+it)| <= (4/eta)(A L + 1)`
for `Re s >= Theta + 2 eta`. Take `eta = (sigma_0 - Theta)/4`; Cauchy's inequality on the disc of radius
`(sigma_0 - Theta)/2` about `sigma_0 + it` gives the `(j+1)`-st derivative of `log zeta`.
(b) Hadamard three circles for `log zeta`, centre `LL + it`, radii `r_1 = LL - 1 - eta`, `r_2 = LL - sigma`,
`r_3 = LL - Theta - eta`, `eta = 1/LL`: `M_1 <= C/eta`, `M_3 <= C L/eta` by (a), and
`log(r_2/r_1)/log(r_3/r_1) = (1 + eta - sigma)/(1 - Theta) + O(1/LL)`, so `|log zeta(sigma+it)| <= C LL L^(theta(sigma))`
(the `O(1/LL)` in the exponent costs a bounded factor). Cauchy on the disc of radius `1/LL` (on which `theta` changes
by `O(1/LL)`) gives (b). (c) is the Dirichlet series. QED.

With Theta = 7/8: `theta(sigma_0) = 8(1 - sigma_0)`; at `sigma_0 = 1` the bound is a power of `LL`.

MEASURED (`t3.py`, `t3b.py`; bands of length 60 or 30 at step 0.05; `ratio = max / (j! LL^(j+1) L^(8(1 - sigma_0)))`):

| sigma_0 | band | log t | max j=0 | max j=1 | max j=2 | ratio j=0 | ratio j=1 | ratio j=2 |
|---|---|---|---|---|---|---|---|---|
| 0.90 | [100, 160] | 4.87 | 2.073 | 5.682 | 31.11 | 0.369 | 0.640 | 1.106 |
| 0.90 | [1000, 1060] | 6.94 | 2.650 | 8.690 | 38.19 | 0.290 | 0.492 | 0.558 |
| 0.90 | [10000, 10060] | 9.21 | 2.485 | 7.306 | 31.21 | 0.189 | 0.251 | 0.241 |
| 0.90 | [19970, 20000] | 9.90 | 2.848 | 8.430 | 38.10 | 0.198 | 0.256 | 0.252 |
| 0.95 | [1000, 1030] | 6.92 | 1.877 | 4.939 | 20.99 | 0.447 | 0.609 | 0.668 |
| 0.95 | [19970, 20000] | 9.90 | 2.481 | 6.799 | 28.40 | 0.432 | 0.517 | 0.471 |
| 1.00 | [1000, 1030] | 6.92 | 1.662 | 4.128 | 15.03 | 0.859 | 1.103 | 1.037 |
| 1.00 | [19970, 20000] | 9.90 | 2.185 | 5.576 | 21.57 | 0.953 | 1.061 | 0.895 |

(`t3.py` was stopped after three bands for running time, log kept as `logs/t3_first.log`; the other rows are from the
shorter `t3b.py`, `t3b.json`.)

The ratios lie between 0.19 and 1.11 (the shape carries no constant, so only boundedness of the ratio is tested). At
`sigma_0 = 0.9` the ratio falls with height (0.37 to 0.20 for j = 0), i.e. the measured maxima grow more slowly than
`L^0.8 LL`; at `sigma_0 = 1` it is flat. The range `L <= 9.9` is too short to test the exponent `8(1 - sigma_0)`.

## 3. Lemma 2: Lemma B at shift delta, and Corollary B1'

Notation as in c2: `z = s - 1/2`, `W(z) = int w(u) e^(-zu) du`, `W#(-z) = conj W(-conj z)`, `G = xi'/xi - zeta'/zeta` at
`1/2 + z`, `Omega(tau) = 2 Re G(i tau)`. For `delta > 0` put

    Phi_delta(z) = zeta_S(delta + z) zeta_S(delta - z) W(z) W#(-z),      sigma_0 = 1/2 + delta.

On `z = i tau`: `Phi_delta = |zeta_S(delta + i tau) W(i tau)|^2`: the test is `Z w`, `Z` = multiplication by
`zeta_S(s - 1 + sigma_0)`. c2 is `delta = 1/2`.

**Lemma 2. PROVED (same proof as c2 Lemma B, re-derived by its referee); MEASURED check.** Let `w` be smooth with
support of length `T_w`, `C_w = w * w~`, and suppose `zeta(sigma_0 + 2 pi i k/log p) != 0` for `p in S`, `k != 0`
(true for `sigma_0 > 7/8`). Without RH,

    sum_rho Phi_delta(rho) = (1/2pi) int Omega |zeta_S(delta+i tau) W(i tau)|^2 d tau
       + 2 Re sum_{p in S} sum_{k != 0} (1/log p) zeta_S(2 delta + it) zeta_{S-p}(-it) (zeta'/zeta)(sigma_0 + it) W(delta+it) conj W(-delta+it),
                                                                                         t = 2 pi k/log p,
       + 2 (-1)^(|S|+1) Re sum_{n >= 2; m, m' in N_S; N_S m m' n <= e^T_w} Lambda(n) (N_S m/m')^delta n^(-1/2) C_w(-log(N_S m m' n))
       + P_0,

where `P_0` collects the pole of `Phi_delta` of order `|S|` at `z = +-delta` and, for `delta != 1/2`, the pole of
`G` at `z = +-1/2`; `|P_0| <= C(S, delta) (1 + T_w)^(|S|) max over x in {delta, 1/2} of |W(x) W(-x)|`, which is `O_b(T^-A)` for
`w = e^(iTu) b(u)`.

Proof. On `Re z = kappa > 1/2 + delta` the local functional equation `zeta_S(-s) = (-1)^|S| N_S^(-s) zeta_S(s)` gives
`zeta_S(delta - z) = (-1)^|S| N_S^(delta - z) zeta_S(z - delta)`, so
`Phi_delta zeta'/zeta(1/2+z) = (-1)^(|S|+1) sum Lambda(n) (N_S m m' n)^(-z) (N_S m/m')^delta n^(-1/2) W(z) W#(-z)`,
absolutely convergent, and `(1/2 pi i) int_(kappa) x^(-z) W W# dz = C_w(-log x) = 0` for `log x > T_w`. The rest is as in
c2: the `G` part goes back to `Re z = 0`; the residues of `Phi_delta G` cancel against those subtracted from the
zero sum, leaving the residues of `Phi_delta zeta'/zeta` at `z_0 = delta + it`, where
`(1 - p^(z - z_0))^(-1) ~ -1/((z - z_0) log p)`. QED.

Answers to the two bookkeeping questions of the assignment.
- **Support condition: unchanged.** Every term of the prime line has `x = N_S m m' n >= 2 N_S` for every `delta`. The
  line is empty for `T_w < log(2 N_S)`. No power of `N_S` other than the first appears; `delta` enters only the
  coefficient `(N_S m/m')^delta`.
- **The factor sqrt(p) of Corollary B1 becomes p^delta = p^(sigma_0 - 1/2)** in the worst case over profiles, and is
  profile-dependent: see `K_w` below.

**Corollary B1' (|S| = 1). PROVED from Lemma 2.** `S = {p}`, `w = e^(iTu) b(u)`, `supp b` in `[0, T_w]`, `T_w <= log p`.
Parseval for the `log p`-periodisation, `(1/log p) sum_k |W(a + 2 pi i k/log p)|^2 = int |w|^2 e^(-2au) du`, and
Cauchy-Schwarz give, with `Den = (1/2pi) int |zeta_p(delta+i tau) W|^2 >= (1 + p^-delta)^-2 ||w||^2` and
`|zeta_p(2 delta + it_k)| = (1 - p^(-2 delta))^-1`,

    |R_S - Obar| <= 2 (1 - p^(-2 delta))^-1 (1 + p^-delta)^2 K_w(delta) M + O_b(T^-A),
    K_w(delta) = (int |w|^2 e^(2 delta u) int |w|^2 e^(-2 delta u))^(1/2) / ||w||^2,   1 <= K_w <= e^(delta T_w),
    M = max_{|t - T| <= T/2} |zeta'/zeta(sigma_0 + it)|.

`K_w = e^(delta T_w)(1 - o(1))/2` for a profile with half its mass at each end of the support; for a single bump it is
much smaller (MEASURED, `t4.py`: `sin^6` at `T_w = 5.35`, `delta = 0.5`: 1.12 against `e^(delta T_w) = 14.5`; two end
bumps: 5.6; at `T_w = 40`: 242, 3.5e7, 4.9e8). A statement on the class of all `w` with support length `T_w` must use
`e^(delta T_w)`.

MEASURED check of Lemma 2 (`t1.py`, `t1.json`; `w = e^(iTu) sin^6(pi u/T_w)`; zeros below 1.8e4 from the Arb list;
`zeta'/zeta(sigma_0 + it)` from mpmath at the lattice points). `rel diff = (zero side - arch - residues)/arch`.

| S | T_w | sigma_0 | T | zero side | arch | residues | rel diff | R | Obar | sum abs res / Den |
|---|---|---|---|---|---|---|---|---|---|---|
| {2} | 0.65 | 0.88 | 3000 | 1.241189792 | 2.208748071 | -0.967558279 | -2.4e-11 | 3.466 | 6.169 | 2.870 |
| {2} | 0.65 | 0.90 | 3000 | 1.232730110 | 2.124958750 | -0.892228640 | -2.4e-11 | 3.579 | 6.169 | 2.744 |
| {2} | 0.65 | 0.95 | 3000 | 1.211849368 | 1.948857102 | -0.737007734 | -2.4e-11 | 3.836 | 6.169 | 2.457 |
| {2} | 0.65 | 1.00 | 3000 | 1.191464182 | 1.808980880 | -0.617516697 | -2.4e-11 | 4.063 | 6.169 | 2.206 |
| {2} | 0.65 | 1.25 | 3000 | 1.100898176 | 1.399172687 | -0.298274512 | -2.4e-11 | 4.854 | 6.169 | 1.362 |
| {2} | 0.65 | 2.00 | 3000 | 0.953997671 | 1.033703360 | -0.079705689 | -2.4e-11 | 5.693 | 6.169 | 0.508 |
| {3} | 1.05 | 0.90 | 9000 | 2.224755697 | 2.943660128 | -0.718904431 | 2.0e-10 | 5.492 | 7.267 | 2.807 |
| {3} | 1.05 | 1.25 | 9000 | 1.879675375 | 2.131538795 | -0.251863420 | 2.0e-10 | 6.408 | 7.267 | 1.309 |
| {2,3} | 1.7 | 0.90 | 3000 | 3.062669750 | 5.248835818 | -2.186166069 | -2.4e-11 | 3.599 | 6.168 | 3.841 |
| {2,3} | 1.7 | 1.25 | 3000 | 2.870433900 | 3.560346740 | -0.689912840 | -2.4e-11 | 4.973 | 6.169 | 1.817 |
| {2,3,5} | 3.3 | 0.90 | 6000 | 30.78689878 | 51.56821852 | -20.78131975 | 2.1e-10 | 4.097 | 6.862 | 3.861 |
| {7} | 2.5 | 0.90 | 5000 | 4.637021898 | 4.773206614 | -0.136184717 | 2.0e-10 | 6.489 | 6.679 | 1.150 |
| {2} | 1.2 | 0.90 | 3000 | 2.326104807 | 3.933183369 | -1.607078562 | -2.4e-11 | 3.648 | 6.169 | 2.646 |

(24 cases in `t1.json`. Rows `{7}, 2.5` and `{2}, 1.2` have `log N_S < T_w < log(2 N_S)`: they test that the threshold
stays `log(2 N_S)` at `sigma_0 = 0.9`. The residual `-2.4e-11 / 2.0e-10` is the same as in c2 and depends on T only:
quadrature and zero-list precision.)

Scan `S = {p}`, `T_w = log p`, `T = 6000` (`t2.py`, 27 rows in `t2.json`): `sum abs res / Den` stays between 0.88 and
2.80 for `p <= 211` at `sigma_0 = 0.9, 1, 1.25`, against `Obar = 6.86`; the bound of B1' with `K_w -> p^delta` is 9.5 to
101. For this single-bump profile the factor `p^delta` is not visible at `T_w <= 5.35` (consistent with `K_w <= 1.3`
there).

## 4. The decisive question

**Lemma 3 (any finite S; contour form). PROVED.** Let `0 < eta < min(delta, sigma_0 - Theta)`, `w = e^(iTu) b(u)`,
`supp b` in `[0, T_w]`. The sum of all residue terms of Lemma 2 (second line plus `P_0`) equals
`2 Re (1/2 pi i)(int_{Re z = delta+eta} - int_{Re z = delta-eta}) Phi_delta(z) (zeta'/zeta)(1/2+z) dz` up to sign, and

    |residue sum| <= 4 e^((delta+eta) T_w) zeta_S(2 delta - eta) prod_{p in S} (1 + 1/(eta log p)) M_eta ||w||^2 + O_b(T^-A),
    M_eta = max over Re s = sigma_0 +- eta, |t - T| <= T/2, of |zeta'/zeta(s)|.

Proof. `Phi_delta zeta'/zeta` is meromorphic in the strip `|Re z - delta| <= eta` with poles only at the lattice points
on `Re z = delta` (and at `z = 1/2` if `|delta - 1/2| <= eta`; its residue is in `P_0`). On `Re z = delta +- eta`:
`|zeta_S(delta - z)| = |zeta_S(-+eta - it)| <= prod p^eta/(p^eta - 1) <= prod (1 + 1/(eta log p))`,
`|zeta_S(delta + z)| <= zeta_S(2 delta - eta)`, and by Cauchy-Schwarz and Plancherel
`int |W(x + it) W(-x + it)| dt <= 2 pi ||w e^(-xu)|| ||w e^(xu)|| <= 2 pi e^(x T_w) ||w||^2`. QED.

With `eta = 1/T_w` the bound is `4e e^(delta T_w) zeta_S(2 delta - 1/T_w) prod_p (1 + T_w/log p) M_eta ||w||^2`. Near-coincident
poles of two lattices (the small divisors `|1 - q^(it)|` at `t = 2 pi k/log p`) need no separate treatment: the two
lines stay at distance `eta` from every pole. In pointwise form the same cancellation is a divided difference of
order `|S| - 1` of `zeta_S(2 delta + it) (zeta'/zeta)(sigma_0 + it) W W#`, bounded by Lemma 1 with `j <= |S| - 1` and by
`|d^j/dt^j (W W#)| <= (2 T_w)^j e^(delta T_w) ||w||_1^2`; this gives `T_w^(|S|-1)/prod log p` in place of
`prod (1 + T_w/log p)`. The derivative bounds of Lemma 1 are therefore not needed for the result.

**Proposition 4 (answer). PROVED as a statement about the bounds of Lemma 3 and Corollary B1'.** `Den >= prod (1 + p^-delta)^-2 ||w||^2`
and `Obar = log(T/2 pi) + O_b(1/T)`. On the class of all `w = e^(iTu) b`, `supp b` of length `T_w` (so `K_w` up to
`e^(delta T_w)`), the bound for `|R_S - Obar|` is below `Obar` only if

    e^(delta T_w) * A_S(T_w) * M(sigma_0, T) <= c log T,      A_S >= 1, A_S increasing in S,

with `M(sigma_0, T)` the available bound for `zeta'/zeta` on `Re s = sigma_0`:
- `Theta < sigma_0 <= 1`, input ZF(Theta): `M = C LL^2 L^(theta(sigma_0))` (Lemma 1b), so
  `T_w <= (1 - theta(sigma_0))/delta * LL = f(sigma_0) LL`, `f(sigma_0) = (sigma_0 - Theta)/((1 - Theta)(sigma_0 - 1/2))`.
  `f'(sigma_0) = (Theta - 1/2)/((1 - Theta)(sigma_0 - 1/2)^2) >= 0`: the maximum is at `sigma_0 = 1`, `f(1) = 2` for every
  Theta. For Theta = 7/8: 0.21 at 0.885, 0.50 at 0.9, 1.33 at 0.95, 2 at 1 (`t4.py`). For Theta = 1/2: `f = 2` for all
  `sigma_0`.
- `sigma_0 = 1 + 1/T_w`, no zero-free input: `M <= T_w + O(1)` (Lemma 1c), `e^(delta T_w) = e^(1/2) e^(T_w/2)`:
  `T_w <= 2 LL - 2 log LL - C`, constants explicit and independent of T.
- `sigma_0 > 1` fixed: `M = O(1)`, `T_w <= LL/(sigma_0 - 1/2) < 2 LL`.

So `T_w <= (2 + o(1)) log log T` in every case; the factor `N_S^(sigma_0 - 1/2)` (that is, `e^(delta T_w)` with
`T_w` near `log N_S`) is what caps it, and lowering `sigma_0` to reduce that factor costs more in `M` than it saves.
`S`: `A_S = zeta_S(2 delta) prod (1 + p^-delta)^2 prod (1 + T_w/log p)`; the constraint `T_w < log(2 N_S)` is only
needed to keep the prime line empty, and when it is not empty that line obeys the same `e^(T_w/2)` bound. The largest
admissible `T_w` is attained at `S` empty; any `S` with `A_S <= (log T)^(o(1))`, in particular `|S| = o(LL/log LL)`, gives
the same `T_w` to leading order. `S(T)` cannot be traded for support.

**Proposition T (no multiplier). CLASSICAL.** For `w = e^(iTu) b`, `supp b` of length `T_w`, the Weil formula gives
`sum_rho W(rho) W#(-rho) = (1/2pi) int Omega |W|^2 + 2 Re W(1/2) conj W(-1/2) - 2 Re sum Lambda(n) n^(-1/2) C_w(log n)`
with `|C_w| <= ||b||^2`, `C_w(v) = 0` for `|v| >= T_w`, and `sum_{n <= x} Lambda(n) n^(-1/2) <= 2.08 sqrt(x)` (from
`psi(x) <= 1.04 x`). The Krein sum is positive once `4.16 e^(T_w/2) < log(T/2 pi) - eps_b(T)`: `T_w <= 2 LL - 2.9` at
large T. Values (`t4.py`): `T_w <= 3.0` at `log T = 23`, 6.3 at 100, 10.9 at 1e3, 52.4 at 1e12, against the
resolution scale `log(T/2 pi)` = 21, 98, 998, 1e12.

**Why 2 log log T, and why not c log T (ARGUED).**
- The cap is the scale at which absolute values of the prime side reach the density term: `sum_{n <= X} Lambda(n) n^(-1/2) ~ 2 sqrt(X) = log T`
  at `X = (log T)^2`. Lemma 3 at any `sigma_0` is this estimate after a contour shift: the factor
  `e^(delta T_w)` is the factor by which the pair `W(delta + it) conj W(-delta + it)` exceeds `|W(it)|^2`, which is also
  the weight an off-line pair at distance `delta` would carry. A bound in absolute value cannot tell the residue sum
  from such a pair.
- Under RH the same computation gives `f = 2`: a zero-free input of any strength, used through sup bounds of
  `zeta'/zeta` on vertical lines, stops at `(log T)^2`. Beyond it the sign of the residue sum is needed, and the
  residue sum is zero side minus density term.
- The two-sided inequality `|R_S - Obar| < Obar` is false for `T_w > (1 + eps) log(T/2 pi)` and suitable `w`: an
  entire `W` of exponential type `T_w/2` can vanish at every zero in a window of density `log(T/2 pi)/(2 pi) < T_w/(2 pi)`
  (Beurling-Landau density), making the zero side `o(Obar Den)`. So "residue sum smaller than main term" cannot hold
  on the resolving range for any proof method; positivity there needs the sign, which is the target (row P10).

## 5. The residue sum is the Weil prime sum (sigma_0 > 1)

**Proposition 5. PROVED.** For `delta > 1/2` the test `Z w(u) = sum_{m in N_S} m^(-delta) w(u - log m)` decays like
`e^(-delta u)`, so the Weil explicit formula applies to it with an absolutely convergent prime sum
(`sum Lambda(n) n^(-1/2-delta) < inf`):

    sum_rho Phi_delta(rho) = (1/2pi) int Omega |zeta_S W|^2 + 2 Re Phi_delta(1/2) - 2 Re sum_n Lambda(n) n^(-1/2) I(n),
    I(n) = (1/2pi) int n^(-i tau) |zeta_S(delta+i tau) W(i tau)|^2 d tau.

Subtracting Lemma 2 (prime line empty): `residue sum + P_0 = 2 Re Phi_delta(1/2) - 2 Re sum_n Lambda(n) n^(-1/2) I(n)`.
Directly: `zeta'/zeta(sigma_0 + it) = -sum Lambda(n) n^(-sigma_0 - it)`, and summing `n^(-it_k) W(delta+it_k) conj W(-delta+it_k)`
over the lattice `t_k = 2 pi k/log p` is Poisson summation, which periodises `C_w` in `log n` with period `log p`: the
ratios `m/m' = p^j` of the two S-series. For `Theta < sigma_0 <= 1` the right side diverges and Lemma 2 is its
continuation in `delta`.

MEASURED (`t2.py`): `S = {2}`, `T_w = 0.65`, `T = 3000`, `sigma_0 = 2`: residue sum -0.0797056885; minus twice the real
part of the prime sum over prime powers `n <= 1e6`: -0.0797056887 (partial sums at 1e2, 1e3, 1e4, 1e5:
-0.07969464, -0.07970597, -0.07970568, -0.07970569); difference 1.7e-10.

What survives. Lemma 2 is an identity, correct at every height, and for `T_w < log(2 N_S)` it replaces the prime sum
of a non-compactly-supported test by finitely many effective samples of `zeta'/zeta` on `Re s = sigma_0`. It contains
no information beyond the explicit formula and has no sign. The positivity it yields is that of Proposition T.

## 6. Pontryagin count

Statement used: if a Hermitian form with `kappa` negative squares is nonnegative on a subspace of codimension `d`,
then `kappa <= d` (CLASSICAL, finite-dimensional or Pontryagin space).
Class `{zeta_S W}`, `supp w` of length `T_w`, restricted to the zeros with heights in `[T, T + H]`: the vectors
`(zeta_S(delta + z) W(z))` at those zeros. `|zeta_S(delta + i tau)|` lies between `prod (1 + p^-delta)^-1` and
`prod (1 - p^-delta)^-1`, so the multiplier is an invertible bounded diagonal map and changes no dimension. The
functions `W` are of exponential type `T_w/2` after centring; the number of independent ones concentrated on
`[T, T + H]` is `H T_w/(2 pi) + O(log)` (Landau-Pollak-Slepian), against `H log(T/2 pi)/(2 pi)` zeros. So

    d(T) = (log(T/2 pi) - T_w)/(2 pi)   per unit height   (ARGUED; infinite in total),

and the count bound reads: off-line pairs per unit height near T `<= d(T)`. At `T_w = 2 log log T` this is the
zero density minus `log log T/pi`: weaker than the trivial bound "pairs <= half the zeros" by a factor of nearly 2.
It becomes a density statement of strength `N(sigma, T) = o(N(T))` only for `T_w = (1 - o(1)) log T`. The multiplier
`zeta_S` contributes nothing to `d`.

## 7. Controls

| Control | Lemma 2 (identity) | Half-plane input, Theta < sigma_0 < 1 | Best version, sigma_0 >= 1 | Conclusion false for it? |
|---|---|---|---|---|
| DH | holds with its own L'/L if no zero of DH is on the pole lattice | fails: zeros with Re up to 1.1203625, no zero-free half-plane | fails for sigma_0 <= 1.1204; for sigma_0 above its zeros L'/L is still not `-sum Lambda n^-s` with `abs(Lambda) <= log n` on prime powers; a bound `M = O(1)` holds only on `Re s >= sigma_1` where DH is bounded below (not computed) | positivity on the trivial range would then hold for DH at such sigma_0: not excluded here. Not run |
| E_a, a < 3/8 | holds (MEASURED, 6 cases, rel 2.4e-11) | passes: zeros at Re = 1/2 +- a < 7/8; poles of L'/L at 1 +- a are at height 0 | passes | no: positivity on the trivial range is true for E_a although its zeros are off the line. MEASURED: R = 7.70, 7.16, 9.48 > 0 with Obar = 12.34 at a = 0.2, 0.3 |
| RZ_b (taken as E_a with a = b - 1/2, b in (7/8, 1)) | holds (MEASURED a = 0.45: rel 2.4e-11, R = 5.89 at sigma_0 = 1, 8.48 at 1.25) | fails for sigma_0 <= b, as required: zeros on or right of the pole line (Lemma 1 has no bound) | passes for sigma_0 >= 1 | no |
| U (unimodular twist n^(-i alpha)) | holds; it is the height shift T -> T + alpha | passes | passes | no |
| Liouville / sign twist (TW-) | no functional equation: Lemma 2 not available with zeta's arch side; the bound of Lemma 3 at sigma_0 > 1 uses only `abs(Lambda(n)) <= log n` and holds | n/a | passes the inequality step | the inequality step does not use the sign or multiplicativity of Lambda |
| Window translate | holds at every T | passes | passes, constants independent of T | n/a |

E_a rows of `t1.json` (multiplier `zeta_S(s - 1 + sigma_0)` of zeta, E_a's own log-derivative
`zeta'/zeta(sigma_0 + a + it) + zeta'/zeta(sigma_0 - a + it)` and arch factor `2 Re(G(a + i tau) + G(-a + i tau))`; zero side
`2 Re sum Phi_delta(a + i gamma)`):

| S | a | sigma_0 | zero side | arch | residues | rel diff | R | Obar |
|---|---|---|---|---|---|---|---|---|
| {2} | 0.2 | 1.00 | 2.258817431 | 3.617961760 | -1.359144329 | -2.4e-11 | 7.702 | 12.337 |
| {2} | 0.2 | 1.25 | 2.151281937 | 2.798345376 | -0.647063438 | -2.4e-11 | 9.484 | 12.337 |
| {2} | 0.3 | 1.00 | 2.100635208 | 3.617961762 | -1.517326554 | -2.4e-11 | 7.163 | 12.337 |
| {2} | 0.45 | 1.00 | 1.728715456 | 3.617961766 | -1.889246310 | -2.4e-11 | 5.895 | 12.337 |
| {2} | 0.45 | 1.25 | 1.924533046 | 2.798345380 | -0.873812334 | -2.4e-11 | 8.485 | 12.337 |
| {2,3} | 0.2 | 1.00 | 5.751055546 | 8.959474229 | -3.208418683 | -2.4e-11 | 7.919 | 12.337 |

The half-plane input fails for RZ_b exactly when `sigma_0 <= b`, as the assignment requires, but that is the weaker
range: at `sigma_0 >= 1` the same conclusion is obtained with no half-plane input and RZ_b passes. The 7/8 theorem is
therefore not the step at which any control fails in the final statement.

## 8. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | The only inequality (Proposition 4 at `sigma_0 >= 1`, Proposition T) uses `abs(Lambda(n)) <= log n`. The local functional equation of `zeta_S` is used on the test side only, and the best range is at `S` empty. |
| R2 (height-uniform, every window) | false | The constants are independent of T and the inequality holds in every window at height T, but only on the class `T_w <= 2 log log T - C`, whose resolution `2 pi/T_w` exceeds the zero spacing by a factor `log T/(2 log log T)`. No statement on a class of fixed resolving power. |
| R3 (every control fails at a named step) | false | E_a (measured), RZ_b, U and the sign twist pass the best version. The half-plane step excludes RZ_b and DH only in the range `sigma_0 < 1`, which gives less. |
| R4 (reaches the critical line) | false | `T_w >= c log T` is not reached; `f(sigma_0) <= 2` for every zero-free input including RH. The poles on `Re s = sigma_0 < 1` sample `zeta'/zeta` inside the strip, but with a loss `(log T)^(8(1 - sigma_0))` larger than the gain. |

## 9. Three weakest steps

1. Lemma 1 has no numerical constants: `C_0`, `C_1`, `t_0` are not computed, and the measured maxima (heights up to
   2e4, `log t <= 9.9`) cannot test the exponent `8(1 - sigma_0)`. Proposition 4 is a statement about what these
   bounds give; it does not show that no sharper pointwise bound for `zeta'/zeta(sigma_0 + it)` under ZF(7/8) exists.
   A bound `o(L^(theta(sigma_0)))` would change `f` only by lower-order terms unless the exponent itself improves, and
   an exponent below `theta` at `Theta = 7/8` would be a new result of the strength of a wider zero-free region.
2. The last bullet of section 4 (failure of the two-sided inequality for `T_w > (1 + eps) log(T/2 pi)`) and the
   codimension density of section 6 are argued from the Beurling-Landau and Landau-Pollak-Slepian density theorems
   without a written construction or error terms. The Pontryagin statement is used per window, where the form is
   only approximately a finite-dimensional one (tails of `W` outside the window are ignored).
3. Controls: the DH form of Lemma 2 was not run and the DH column is partly inference (no value of `sigma_1`); the
   Liouville row is a statement about the inequality step, not a run; RZ_b is represented by E_a with `a = b - 1/2`,
   which also moves the poles to `1 +- a`; Beurling, T-NR, backward heat, the phase-rotated transfer operator and
   `theta^w` were not run. All numerical checks use one profile family (`sin^6`), float64, and the zeros below 1.8e4.

## 10. Files

`t1.py` -> `t1.json`, `logs/t1.log` (Lemma 2 at shift, E_a control); `t2.py` -> `t2.json`, `logs/t2.log` (Weil prime
sum at `sigma_0 = 2`; scan in p); `t3.py` (stopped; `logs/t3_first.log`) and `t3b.py` -> `t3b.json`, `logs/t3b.log` (sizes of `(zeta'/zeta)^(j)`); `t4.py` ->
`t4.json`, `logs/t4.log` (`K_w`, `f`, trivial range). Interpreter: `.venv-arb/bin/python` (repo root; read only).
Zeros: `tmp/research-2026-11-16/pick/zeros_20000.json` through `c2-euler-at-zeros/lib.py` (read only).
