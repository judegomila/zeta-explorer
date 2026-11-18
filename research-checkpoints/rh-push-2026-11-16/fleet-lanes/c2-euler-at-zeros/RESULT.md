# c2-euler-at-zeros: partial Euler products sampled at the zeros (Krein square x Euler product)

Date: 2026-11-17. Kind: combine (`g-spinor-square-root` x partial Euler products; continues `c1-spinor-hecke-primitive`).
Nothing here proves or refutes RH or moves any bound. No statement about zeros of zeta is made.
Labels: PROVED (argument given here, unrefereed), CLASSICAL, MEASURED (float64, not interval), HEURISTIC, OPEN.
All runs local under `scripts/memcap.sh 8`; the compute server was not used (nothing to stop there).

## 0. Verdict

**Precise obstruction.** There is no one-sided inequality on R_S of the requested kind in this construction.

- The lower inequality `R_S(W) >= 0` for all tests is the Weil/Krein positivity on the class `Z_S(tests)`, which is
  the target (map row P10; `c1-spinor-hecke-primitive` Lemma 3 with the referee's repair). Controls fail it only at the
  identity level (location of their zeros).
- The upper inequality (depletion: `R_S <= Obar - c(P)`, "the zeros avoid the large values of zeta_S") is real for
  zeta in mean, and its mean is the Landau-Gonek cross term `-2 sum_{p<=P} log p/(p-1)`: a mean-value statement
  (map section 5, wall 1, MV-CAP). In every window it splits as `E = E_S + E_out`; `E_S` is height-uniform (uniform
  almost periodicity, finite S), `E_out` is a sup over height of an exponential sum over prime powers outside S near
  ratios of S-smooth numbers: a largest-value statement (wall 4 and corollary (c)), with measured maxima that grow
  with height. Two controls with off-line zeros (E_a, backward heat tau = -0.5) satisfy the depletion inequality on
  the measured range, so it does not separate.
- A partial Euler product does not amplify an off-line pair. The Krein weight
  `zeta_S(beta+i gamma) conj zeta_S(1-beta+i gamma)` of a pair of the function whose Euler product is used is damped
  (left partner by about `exp(-li(P^(2 beta-1)))`, HEURISTIC; MEASURED for E_a and for the heat family), the opposite
  of the `P^(2 beta-1)` gain of a generic Dirichlet polynomial.
- `P -> inf`: `R_S -> 0` in every measured window (R = 0.38 against Obar = 7.64 at P = 1000, heights 9e3-1.8e4).
  The inequality `0 <= R_S` survives the limit only as `0 <= 0`; this is `c1` Lemma 4 (the all-prime sum lies in the
  radical) seen from finite P, and answers its OPEN item numerically.

Pivot (one, section 5): an exact identity, the **S-periodised explicit formula**: for `w` of support length
`T_w < log(2 N_S)`, `N_S = prod_{p in S} p`, the zero sum of `|zeta_S|^2 |W|^2` equals the archimedean integral plus a
sum of residues at `s = 1 + 2 pi i k/log p` involving only `zeta'/zeta` on the line `Re s = 1`; beyond that range a
finite prime sum is added. Verified to relative 3.5e-11 in 13 cases. It gives positivity of the Krein sum on that
class from the classical zero-free region for |S| = 1 at large height. It holds for every control with the
functional equation, and its only non-identity step is the size of `zeta'/zeta` on `Re s = 1` (map wall 3). It
carries no information about zeros in the strip.

## 1. Plan; what is new against the map

Read: BRIEF, OBSTRUCTION_MAP sections 2, 3 (P10, P12, P13, P27, P29, Q10), 5; `g-spinor-square-root`;
`c1-spinor-hecke-primitive` RESULT + REFEREE (Lemmas 1-4, the Gram-symbol erratum, the Lemma 3 repair).
Not re-run: the congruence `Q o M_S ~ Q`, the Gram symbol norms, the window identity T4.
New here: (i) the law of `R_S` in P and height with six controls and non-multiplicative multipliers; (ii) the split
`E = E_S + E_out` and the statement of what an every-window version needs; (iii) the damping of off-line pairs by the
function's own Euler product; (iv) the S-periodised explicit formula with the local functional equation
`zeta_S(-s) = (-1)^|S| N_S^(-s) zeta_S(s)` as the mechanism, and its numerical verification.

## 2. Notation and the first lemma

`z = s - 1/2`, `J rho = -conj(rho)`, `W(z) = int w(t) e^(-zt) dt`, `W#(-z) = conj W(-conj z)`,
`zeta_S(s) = prod_{p in S}(1 - p^-s)^-1`, `Phi(z) = A(z) conj A(-conj z) = zeta_S(1/2+z) zeta_S(1/2-z) W(z) W#(-z)` with `A(z) = zeta_S(1/2+z) W(z)`. On `z = i tau`, `Phi = |zeta_S(1/2+i tau) W(i tau)|^2`.

    Num_S(w) = sum_rho Phi(rho)          (Krein sum; each off-line pair enters as 2 Re[A(rho) conj A(J rho)])
    Den_S(w) = ||Z_S w||^2 = (1/2pi) int |zeta_S(1/2+i tau)|^2 |W(i tau)|^2 d tau
    R_S = Num_S/Den_S,   Omega(tau) = -log pi + Re psi(1/4 + i tau/2),   Obar = (1/2pi) int Omega |zeta_S W|^2 / Den_S,
    E = R_S - Obar.

**Lemma A (split of the numerator). CLASSICAL for the truncation; PROVED remarks.**
For a finite Dirichlet polynomial `A_N(s) = sum_{n in N_S, n <= N} n^-s` and compactly supported smooth `w`, the Weil
explicit formula applied to `(A_N w) * (A_N w)~` gives, without RH,

    sum_rho A_N(1/2+rho) conj A_N(1/2+J rho) W(rho) conj W(J rho)
      = (1/2pi) int Omega |A_N W|^2 d tau                                   [archimedean / diagonal density]
      + 2 Re[ A_N(1) conj A_N(0) W(1/2) conj W(-1/2) ]                      [pole]
      - 2 Re sum_n Lambda(n) n^-1/2 (1/2pi) int n^(-i tau) |A_N(1/2+i tau) W(i tau)|^2 d tau.   [primes]

As `N -> inf`: the zero side, the archimedean term and the part of the prime sum with `n in N_S` converge, the last to
`(1/2pi) int 2 Re(zeta_S'/zeta_S)(1/2+i tau) |zeta_S W|^2 d tau = (1/2pi) int d/d sigma |zeta_S(sigma+i tau)|^2 at 1/2 |W|^2`.
Call it `E_S Den`. The pole term (`A_N(0) -> zeta_S(0) = inf`) and the prime sum over `n` outside `N_S`
(`Z_S w(t)` decays only like `t^(|S|-1) e^(-t/2)`) diverge separately and converge together; call the joint limit
`E_out Den`. So `R_S = Obar + E_S + E_out`. The closed convergent form of `E_S + E_out` is Lemma B (section 5).
Mean values (CLASSICAL, Landau-Gonek form): mean of `E_S` over height is `-2 L1(P)`, `L1(P) = sum_{p<=P} log p/(p-1)`;
for a general multiplier `sum a_m m^-s` the mean of E is `-2 Re sum_{m,k} a_m conj(a_mk) Lambda(k)/(mk) / sum |a_m|^2/m`.

**Off-line pair.** A pair `(beta + i gamma, 1 - beta + i gamma)` replaces `|A(i gamma)|^2` by
`2 Re[zeta_S(beta+i gamma) conj zeta_S(1-beta+i gamma) W(delta+i gamma) conj W(-delta+i gamma)]`, `delta = beta - 1/2`.
For a generic Dirichlet polynomial of length N the multiplier pair has size up to `N^(2 beta-1)` times the on-line
size. For the partial Euler product of the same function it does not: from `log zeta_P(s) ~ sum_{p<=P} p^-s` and the
explicit formula for `psi`, the zero at `rho` contributes `-li(P^(rho - s))`: `-log log P` at `s = rho` (the known
`1/log P` decay of a partial Euler product at a zero) and `-li(P^(2 beta-1))` at `s = 1 - conj(rho)`. HEURISTIC (no
error terms). MEASURED (`test3.json`, weights): for E_a (a = 0.2) the mean of `log|zeta_S|` at the left points
`1/2 - a + i gamma` is -0.085, -0.31, -0.92, -1.93 at P = 2, 7, 100, 1000, against -0.057, -0.17, -0.32, -0.42 at the
right points and -0.069, -0.23, -0.53, -0.85 on the line at the zeros; heat (tau = -0.5, 5 pairs): median pair
weight/median on-line weight = 0.17, 0.05, 0.21, 0.44 at P = 7, 30, 100, 1000. For DH (28 pairs, multiplier not its own
Euler product) there is no damping: median pair weight/median on-line weight between 0.5 and 1.4, largest pair
weight 11.6 x the mean of `|zeta_S|^2` at P = 1000.

## 3. Decisive test (run first)

Files: `lib.py`, `test1.py` -> `test1.json`, `logs/test1.log`; `dh_zeros.py` -> `dh_zeros_1000.json`;
`heat_zeros.py` -> `heat_zeros_tau-0.5.json`; `test3.py` -> `test3.json`, `logs/test3.log`.
Zeros: 20000 zeta zeros (Arb enclosures of `pick/zeros_20000.json`, height <= 18046.4; mpmath was not needed);
DH: 848 on-line zeros and 28 off-line pairs below height 1000 (python-flint, argument principle per box, all boxes
consistent, total 904 against the Riemann-von Mangoldt main term 903.9); heat tau = -0.5: 86 real zeros and 5 pairs in
[1, 230] (total 96 = zeta count; pairs from `c1-missing-controls`). Windows: `|W(i tau)|^2 = exp(-(tau-T)^2/Delta^2)`,
Delta in {2, 10, 50}, centres every 2 Delta from 60 to 18046 (4494 / 897 / 175 windows); P in {2, 3, 7, 30, 100, 300, 1000}.
Gaussian windows are limits of the lemma's class, not members of it.

### 3.1 Zeta: law in P and height (MEASURED)

Mean of E over all windows, Delta = 50, against `-2 L1(P)`:

| P | 2 | 3 | 7 | 30 | 100 | 300 | 1000 |
|---|---|---|---|---|---|---|---|
| -2 L1(P) | -1.386 | -2.485 | -3.938 | -6.052 | -8.230 | -10.393 | -12.728 |
| mean E | -1.385 | -2.465 | -3.787 | -5.270 | -6.107 | -6.504 | -6.704 |
| R, heights 9e3-1.8e4 (Obar 7.64): min / mean / max | 5.72 / 6.26 / 6.72 | 4.45 / 5.17 / 5.90 | 2.78 / 3.81 / 6.42 | 0.92 / 2.15 / 3.05 | 0.67 / 1.14 / 1.68 | 0.48 / 0.64 / 0.81 | 0.28 / 0.38 / 0.49 |
| R, heights 300-1000 (Obar 4.50): mean | 3.16 | 2.12 | 1.11 | 0.46 | 0.22 | 0.13 | 0.089 |

- For `2 L1(P)` small against `Obar ~ log(T/2 pi)`: `R = Obar - 2 L1(P)` to 0.02 (P = 2, 3). The S-part alone has mean
  `-2 L1(P)` at every P; `E_out` has mean below 0.1 above height 3000 for P <= 7 and grows to +2.3 at P = 1000 (it must: `R >= 0`).
- For larger P, R tends to 0: local exponent `d log R/d log log P` between P = 300 and 1000 is -2.7 (top band) and
  -2.0 (heights 300-1000). HEURISTIC limit: `|zeta_P(rho)|^2 ~ c/log^2 P` against mean `e^gamma log P`, i.e. `(log P)^-3`.
- `R > 0` in every window (immediate: all 20000 zeros are on the line).
- `E < 0` in all 5566 windows for P >= 300; for Delta = 2 it fails in 26%, 10%, 3.7%, 1.3%, 0.16% of windows at P = 2, 3, 7, 30, 100 (max E +2.4, +2.4, +3.1, +1.3, +1.5).
- Height dependence of the every-window constant: `max E_out` over windows, Delta = 2, P = 7, by height band
  (60-300, 300-1e3, 1e3-3e3, 3e3-9e3, 9e3-1.8e4): 2.73, 2.66, 6.59, 7.18, 11.17; Delta = 50: 1.10 (300-1e3), 0.69, 1.10, 3.71.
  `E_S` stays in a height-independent range (Delta = 2, P = 2: [-1.79, 0.22] in all five bands).

### 3.2 Controls (MEASURED)

"Lower" = `R >= 0` (Krein sum); "depletion" = `E <= 0` resp. mean E near `-2 L1`.

| Function | Lower `R >= 0` | Depletion | Step where it differs from zeta |
|---|---|---|---|
| zeta | holds (all windows) | mean law above; every window for P >= 300 | - |
| DH, height <= 1000 | negative in 1, 6, 5 of 479 windows (Delta = 2; P = 30, 100, 1000), min -153 | **fails at every P**: mean R = 6.06-6.41 against Obar 5.77-5.79 for P <= 30 (5.2-5.9 at P = 100, 1000), E > 0 in 48-70% of windows | Euler product: the cross term is `sum_{k in N_S} c_DH(k)/k = O(1)`, not `L1(P)`; lower: off-line pairs (identity) |
| Liouville twist zeta(2s)/zeta(s) | Krein sum not defined (no J-symmetry of the zero set) | **fails**: Hermitian sum over zeros `rho/2`: mean E = +5.1, +21, +156, +1328 at P = 2, 7, 100, 1000 (Delta = 50); same with its own product `prod(1+p^-s)^-1` | functional equation: zeros on Re s = 1/4, where the product is large; no pairing |
| unimodular twist `p^(-i alpha)` (height shift, alpha = 1) | holds (zeros on a line) | **fails**: mean E between -0.8 and +3.0, E > 0 up to +20 | multiplier is not the function's own product; cross term `2 Re sum log p p^(-i alpha k)/p^k` is O(1) |
| E_a, a = 0.2 | negative in 14 / 84 of 4494 windows (P = 100 / 1000, Delta = 2); none for Delta >= 10 | **holds**: E < 0 in all windows for P >= 100, Delta >= 10 (max -4.5 against Obar 15.3) | identity only (pairs); depletion does not see the shift a |
| T-NR (q = 2, c = 2.05) | negative in 193 / 601 windows (P = 100 / 1000, Delta = 2), 4 / 71 at Delta = 50; none at P = 2 (lattice terms positive when q in S) | holds in mean (-6.1 at P = 100) | identity only (lattice pairs) |
| backward heat, tau = -0.5, height <= 230 | negative in 1 of 94 windows (P = 1000, value -0.001) | **holds**: R = 0.084-0.153 against zeta 0.033-0.096 at P >= 100; E > 0 in no window for P >= 7 | none found: pairs are damped by the multiplier |
| non-multiplicative multiplier on zeta zeros (P = 7 support, n <= 1e4): DH coefficients / random signs | holds | **fails**: mean E = +0.546 / -0.416 (Landau-Gonek prediction +0.545 / -0.414) against -3.77 (prediction -3.88) for the truncated product | correlation `sum a_m a_mk Lambda(k)/(mk)` of the multiplier with Lambda |

Reading.
1. The depletion is a correlation between the multiplier and the log-derivative of the function, of mean-value type.
   It is lost when the multiplier is not the function's product (DH, shift, non-multiplicative coefficients) or when
   there is no functional equation (Liouville). It is kept by E_a, T-NR and the heat family, whose zeros are near
   zeta's in height. So "every control fails" is false for the upper inequality.
2. The lower inequality separates only through off-line pairs entering with indefinite sign, and for the heat
   family and E_a the pair weights are damped so strongly that fixed-shape windows of width >= 5 do not detect them.
   Positivity for all tests is the target itself.
3. No inequality was found that zeta satisfies in every window with a height-independent constant and that each
   control violates. The conjunction "lower and upper" is "target and a largest-value bound".

## 4. Why the every-window form reduces to a largest value

`E = E_S + E_out` (Lemma A).
- `E_S` is the window average of `2 Re(zeta_S'/zeta_S)` against `|zeta_S W|^2`. For finite S the integrand is a
  uniformly almost periodic function of tau, so its averages over windows of width Delta converge to the mean
  uniformly in the centre (CLASSICAL): `E_S <= -L1(P)` for all T once `Delta >= Delta_0(P)`. Pointwise it lies in
  `[-2 sum log p/(sqrt p - 1), 2 sum log p/(sqrt p + 1)]`, which is the l^1 wall of `c1` Lemma 2(c).
- `E_out Den = lim [pole - 2 Re sum_{q^k, q not in S} sum_{m,m' in N_S} log q (q^k m m')^-1/2 (q^k m/m')^(-iT) C(log(q^k m/m'))]`
  with C the window autocorrelation: prime powers outside S within the window resolution of a ratio of S-smooth
  numbers, with phases `n^(-iT)`. A bound `E_out <= L1(P)/2` for all T is a one-sided bound for the supremum over
  height of this sum on the critical line, where it does not converge absolutely. This is the largest-value
  statement of wall 4 and of corollary (c); the mean of `E_out` is the MV-CAP side (wall 1; rows P27, P29).
  MEASURED: the maxima grow with height (section 3.1). OPEN: whether `sup_T E_out` is finite for fixed (P, Delta).
- Even if proved, the upper inequality bounds weighted zero counts from above; E_a and the heat family satisfy it.

Stop rule of the assignment applied: mean part = MV-CAP (wall 1), every-window part = largest value (wall 4 /
corollary (c)); lower inequality = P10.

## 5. Pivot: the S-periodised explicit formula

**Lemma B. PROVED (sketch; unrefereed); MEASURED check.** Let S be a finite set of primes, `N_S = prod p`, and `w`
smooth with support in an interval of length `T_w`, `C_w = w * w~`. The local factor has the functional equation
`zeta_S(-s) = (-1)^|S| N_S^(-s) zeta_S(s)`. Then, without RH,

    sum_rho Phi(rho) = (1/2pi) int Omega |zeta_S W|^2 d tau
       + 2 Re sum_{p in S} sum_{k != 0} (1/log p) zeta_S(1+it) zeta_{S-p}(-it) (zeta'/zeta)(1+it) W(1/2+it) conj W(-1/2+it),
                                                                                         t = 2 pi k/log p,
       + 2 (-1)^(|S|+1) Re sum_{n >= 2; m, m' in N_S; N_S m m' n <= e^T_w} Lambda(n) (N_S m/(m' n))^1/2 C_w(-log(N_S m m' n))
       + (the k = 0 term: residue of order |S|+1 at z = 1/2, bounded by a polynomial in T_w times |W(1/2) W(-1/2)|).

For `T_w < log(2 N_S)` the third line is empty.
Proof sketch. `sum_rho Phi(rho)` is the integral of `Phi L`, `L = xi'/xi(1/2+z)`, over the boundary of
`|Re z| <= c`, c > 1/2, minus the residues of `Phi L` at the poles of `Phi` on `Re z = +-1/2` (the poles of
`zeta_S(1/2 -+ z)`: `z = +-(1/2 + 2 pi i k/log p)`, simple for k != 0 when the `log p` are pairwise incommensurable).
By `Phi(-conj z) = conj Phi(z)`, `L(-conj z) = -conj L(z)` the two sides are conjugate. On `Re z = c` write
`L = G + zeta'/zeta(1/2+z)`. By the local functional equation,
`Phi zeta'/zeta = (-1)^(|S|+1) sum Lambda(n) (N_S m)^(1/2-z) (m' n)^(-1/2-z) W(z) W#(-z)`, absolutely convergent, and
`(1/2 pi i) int_(c) x^(-z) W(z) W#(-z) dz = C_w(-log x)`, which is 0 for `log x > T_w`: every term has
`x = N_S m m' n >= 2 N_S`. The `G` part is moved back to `Re z = 0`, picking up the residues of `Phi G` at the same
poles; the difference of residues is that of `Phi zeta'/zeta`, with `Res (1 - p^(z-1/2))^-1 = -1/log p`. Horizontal
segments: `W` decays faster than any power, the small divisors `|1 - q^(it)|` at `t = 2 pi k/log p` are bounded
below by a power of k (Baker). QED sketch.

Check (`test2.py`, `test2b.py`; `w = e^(iTt) sin^6(pi t/T_w)`, zeros from the Arb list, `zeta'/zeta(1+it)` from mpmath at
15-67 lattice points per case): zero side minus right side, relative to the zero side:

| S | T_w | log(2 N_S) | T | zero side | arch | residues | prime sum | rel. diff |
|---|---|---|---|---|---|---|---|---|
| {2} | 0.65 | 1.386 | 3000 | 1.191464 | 1.808981 | -0.617517 | 0 | -3.6e-11 |
| {2} | 0.65 | 1.386 | 9000 | 1.831860 | 2.131163 | -0.299303 | 0 | 2.4e-10 |
| {3} | 1.05 | 1.792 | 3000 | 1.710639 | 2.191651 | -0.481012 | 0 | -3.0e-11 |
| {2,3} | 1.7 | 2.485 | 3000 | 3.002896 | 4.479737 | -1.476841 | 0 | -3.5e-11 |
| {2,3,5} | 3.3 | 4.094 | 3000 | 7.427329 | 10.856057 | -3.428728 | 0 | -3.5e-11 |
| {2,3,5,7} | 5.2 | 6.040 | 3000 | 10.030154 | 14.930985 | -4.900831 | 0 | -3.6e-11 |
| {2,3,5,7} | 5.2 | 6.040 | 12000 | 14.739748 | 20.604965 | -5.865217 | 0 | 2.8e-10 |
| {2} | 2.5 | 1.386 | 3000 | 6.317774 | 9.591119 | -3.275415 | +0.00206946 (8 terms) | -3.6e-11 (3.3e-4 without it) |
| {2,3} | 4.0 | 2.485 | 3000 | 8.940951 | 12.996888 | -4.056994 | +0.00105831 (20 terms) | -3.5e-11 (1.2e-4 without it) |
| {3} | 3.2 | 1.792 | 5000 | 7.093421 | 7.247071 | -0.155343 | +0.00169379 (8 terms) | 2.1e-10 (2.4e-4 without it) |

(13 cases in `test2.json`, `test2b.json`; the k = 0 term is below 1e-31 in all.)

**Corollary B1 (|S| = 1). PROVED from Lemma B + CLASSICAL (Vinogradov-Korobov).** For `S = {p}`, a fixed smooth profile
`b` supported in `[0, T_w]`, `T_w <= log p`, and `w = e^(iTt) b`: by Cauchy-Schwarz and Parseval for the periodisation
(`(1/log p) sum_k |W(a + 2 pi i k/log p)|^2 = int |w|^2 e^(-2at) dt`),
`|E| <= 2 (p/(p-1)) (1 + p^-1/2)^2 sqrt p * M + O_b(T^-A)`, `M = max_{|t-T| <= T/2} |zeta'/zeta(1+it)|`. Since
`M << (log T)^(2/3) (log log T)^(1/3)`, `R_S = Obar + O(sqrt p (log T)^(2/3+eps)) > 0` for `T >= T_0(p, b)`.
So the Krein sum is positive on this class at large height, unconditionally.

What it is worth.
- The identity uses the functional equation, and the Euler product only on the test side (the local functional
  equation of `zeta_S`). It holds for DH, E_a, T-NR and the heat family with their own `L'/L` (for DH with the contour
  to the right of its zeros in Re s > 1; not run). R3 fails at the identity.
- The one inequality step is the bound for `zeta'/zeta` on `Re s = 1`, i.e. the classical zero-free region
  (`Lambda >= 0` and the pole; row P13, wall 3). It fails for DH (zeros to the right of 1) and for E_a (poles of the
  log-derivative at `1 +- a`); it holds for a completely multiplicative sign twist.
- The class cannot locate a zero: `T_w <= log p` gives window resolution `>= 2 pi/log p` in height while positivity
  starts at `T_0 >= exp(c p^(3/2))`, where the zero spacing is far below the resolution. For |S| >= 2 near-coincident
  poles bring derivatives of `zeta'/zeta` up to order |S| - 1 on `Re s = 1`, which the classical region does not bound
  by `o(log T)`; OPEN, and of the same type.
- It moves the "trivial range" of Weil positivity from support `< log 2` to support `< log(2 N_S)` at the price of
  sampling `zeta'/zeta` on `Re s = 1`: information from the edge of absolute convergence only (R4 not met).

## 6. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | No inequality was established. The depletion law depends on the correlation of the multiplier with Lambda (measured: -3.77 for the product, +0.55 / -0.42 for non-multiplicative coefficients), which is a mean-value identity; the Euler product enters Lemma B only on the test side. |
| R2 (height-uniform, every window) | false | `E_S` is height-uniform (classical almost periodicity); `E_out` is not bounded by any proved constant and its measured maxima grow with height (2.7 to 11.2 over five bands). Corollary B1 has a threshold `T_0(p, b)`, not a uniform constant. |
| R3 (every control fails at a named step) | false | Upper inequality: E_a, T-NR (mean) and backward heat satisfy it. Lower inequality: controls fail only at the identity. Lemma B holds for every control with the functional equation. |
| R4 (reaches the critical line) | false | `R_S -> 0` as P grows (the limit is the radical of `c1` Lemma 4); Lemma B and B1 use `zeta'/zeta` on `Re s = 1` only. |

## 7. Three weakest steps

1. Lemma B is a proof sketch: the contour shift across the poles on `Re z = 1/2` (small divisors, horizontal
   segments), the k = 0 residue of order |S|+1 (only bounded, not written out), and simplicity of the poles are argued
   in one line each. The support is the numerical agreement to 3.5e-11 in 13 cases (float64; a systematic -3.5e-11
   remains, of quadrature size). Corollary B1 inherits this and uses an `O_b(T^-A)` tail that is not made explicit.
2. The statement that the every-window depletion bound "needs a largest value" rests on the decomposition and on
   measured growth of `max E_out` over five height bands below 1.8e4; neither `sup_T E_out = inf` nor its finiteness is
   proved. The damping law `exp(-li(P^(2 beta-1)))` and the `(log P)^-3` decay of `R_S` are heuristic; the measured
   exponents (-2.0 to -2.7) have not converged.
3. Coverage of the controls: Gaussian windows of three widths only (not the compactly supported class of the lemma,
   and not an optimisation over tests, so "the heat family and E_a pass" is a statement about these windows); DH below
   height 1000 (28 pairs), heat at one tau below height 230 (5 pairs, one window at -0.001); the unimodular twist is
   represented by a height shift and the sign twist by the Liouville function only; Beurling and the phase-rotated
   transfer operator were not run; the DH form of Lemma B was not run.
