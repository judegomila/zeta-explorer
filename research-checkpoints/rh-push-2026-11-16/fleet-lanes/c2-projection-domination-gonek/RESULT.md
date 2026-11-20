# c2-projection-domination-gonek: RESULT

Verdict: **precise obstruction**. No statement about zeros of zeta is claimed. Status labels: PROVED / CLASSICAL / MEASURED / OPEN.

## 1. Plan

Nodes used: `telescoping-kernel-projection-domination`, `straddle-exclusion-window-completeness` (source text: header of `src/data/imp-34427-spectator-realness-channel-closure.js`), `m23-unconditional-window-positivity` (source: `morethan2-3rd/docs/02-adversary-and-ceiling.md` sec. 4). They supply every-window statements about zero configurations and use no arithmetic. Partner tested: Landau-Gonek sums `sum over zeros in a window of n^rho`.

Steps planned: (1) a window-local identity giving `S_I(u)` and `int h |S_I|^2` through primes with explicit error in H and N; (2) insert the comparison "off-line pair versus its on-line projection" to get a shift g(delta, H, N) of the prime side; (3) compare g with the proved error for H = log^A T and H = T^theta; (4) controls.

No R4 mechanism is proposed. The route uses the explicit formula (exact, no inequality) plus bounds on Lambda (information from Re s >= 1). It was expected to stop at the mean-value cap (P27, P29, Q9).

New relative to the atlas and map: the absorbability measurement of section 4 (thresholds theta = 1/2 and theta = 1), and the statement that the smoothed Landau-Gonek identity has no error term at all, so the comparison "g against the error" is replaced by "g against the on-line mass and the proved prime bound".

## 2. Work

Notation: zeros rho = 1/2 + i gamma (gamma complex if off-line), window w(x) = (sin(x/8)/(x/8))^8 (entire, real on R, Fourier transform w^ supported in [-1,1], w^(0) = 12.33), S_w(u) = sum over gamma of w((gamma - T)/H) e^{i u gamma}. The effective window length is w^(0) H.

**Lemma 1 (CLASSICAL: Weil explicit formula with test g(t) = w((t-T)/H) e^{iut}; this is the smoothed Landau-Gonek formula).** For u > 0,

    S_w(u) = -(H/2pi) sum_n Lambda(n) n^{-1/2} e^{-i(log n - u)T} w^(H(log n - u)) + R,

where R consists of the pole terms g(+-i/2), the archimedean term and the mirrored zeros, all of size O(sup |w| on the lines Im = const at distance T/H from the window centre); R is negligible when T/H is large and u > 1/H. There is **no other error term**: the right side is a finite sum over |log n - u| <= 1/H.

Consequences (same status):
- (a) single-term regime: for integer n0 with n0 + 1 < H, `S_w(log n0) = -(H w^(0)/2pi) Lambda(n0)/sqrt(n0)`. In particular S_w(log n0) = 0 for every n0 < H - 1 that is not a prime power. This holds in every window, at every height, for any H >= 3 (H may be bounded; polylogarithmic H is not needed).
- (b) quadratic form: for a positive measure mu on [log 2, log N], N < H - 1, `int |S_w|^2 dmu` is a sum over prime powers only. With mu = du: `(H/4pi^2) ||w^||_2^2 sum_{n<=N} Lambda(n)^2/n`. With h = |D|^2 for a Dirichlet polynomial D, the value depends on D only through its values near log p^k; the coefficients of D at composite n and any multiplicativity of D do not enter.
- (c) for N > H the identity stays exact; the prime side becomes a short twisted sum over |n - e^u| <= e^u/H.

MEASURED (Test A, `testA.py`, zeros 1..40000 from Arb in float64): identity (multi-term form and single-term form) holds with max abs error 7e-7 to 3e-5 for T in {1e3, 1e4}, H in {8, 30, 100}, n <= 6H, against values of size 7 to 140. S_w(log 6), S_w(log 10), S_w(log 12) vanish to 1e-6. Exception: T = 1e3, H = 100 has error 2.4 to 3.4 because the window (scale 100, tails to 60H) reaches t = 0 and R is not negligible; this is the stated condition T/H large.

**Lemma 2 (PROVED, elementary; this is where the projection comparison enters).** Let the window contain an off-line pair gamma = t0 -+ i delta. Its contribution to S_w(u) is e^{iut0}[W e^{delta u} + conj(W) e^{-delta u}], W = w((t0 - i delta - T)/H), of modulus >= 2|W| sinh(delta u). All other zeros contribute at most M_on := sum |w| over on-line zeros, which is <= (w^(0) H / 2pi) log(T/2pi) (1 + o(1)) by the unconditional Riemann-von Mangoldt count (off-line zeros of other quadruples are treated the same way by projection domination: |e^{iu gamma}| >= the projected value only helps the lower bound when a single deepest pair is isolated; otherwise they enter M_on with e^{delta' u}). Hence, if the deepest pair in the window has depth delta,

    |prime side at u| >= g(delta, u) - M_on,      g := 2|W| sinh(delta u).

An off-line pair is excluded by this inequality iff a proved upper bound B(u) for the prime side satisfies B(u) + M_on < g(delta, u).

**Decisive test (g against the proved bounds).**
- Single-term regime N < H: g <= 2 sinh(delta log H) < H^delta, while M_on ~ 1.96 H log(T/2pi). g/M_on < 1 for every H >= 3, every T and every delta < 1/2 (it is H^{delta-1}/log T up to constants). Table (`testC.json`): g/M_on at N = H is 3.7e-4 to 7e-3 (T = 1e4, H = log^2 T), 1.8e-5 to 6.8e-4 (T = 1e12), and smaller for H = T^{1/2}, H = T.
- Multi-term regime N > H: g reaches M_on at N* = (M_on)^{1/delta}. There the only proved bound on the prime side is Brun-Titchmarsh applied to |Lambda| <= log: B = (2/pi) sup|w^| sqrt(N) log N / log(2N/H). B/g = N^{1/2 - delta} up to logs; log10(B/g) at N* ranges from 1.1 (delta = 0.49) to 925 (delta = 0.05, T = 1e100, H = T).
- Result: **there is no window, of any length H, and no N, for which g exceeds the proved bound**, for any delta < 1/2. The deficit is the factor N^{1/2 - delta}. Closing it means bounding `sum_{|n-x|<=x/H} Lambda(n) n^{-1/2-iT}` by x^{delta}, which is the zero-free statement itself (by Lemma 1 read backwards). The comparison does not improve with H; H = T^theta does not help for any theta.
- L^2 form: the pair contributes at most N^{2 delta}/(2 delta) to `int |S_w|^2 du`; the prime value in the single-term regime is (H/4pi^2) ||w^||_2^2 sum Lambda(n)^2/n, of order H log^2 N; N^{2 delta} < H for N < H. Averaging the multi-term prime side over T gives Montgomery's F(alpha), alpha < 1: a mean value (MV-CAP rows P27, Q9, Z17).

**Absorbability measurement (Test B, `testB.py`; MEASURED, first order, float64 least squares).** Question: on u in [0, theta log(T/2pi)], can the change d(u) of S_w produced by turning a double on-line zero at t0 into the pair t0 -+ i delta be reproduced by real displacements of the other zeros (zeros stay on the line)? r = dist(d, real span of displacement fields)/||d||, basis = all zeros within 14H of T.

| theta | T=1e3, H=6 | T=1e4, H=6 | T=3e4, H=6 | T=1e4, complex displacements |
|---|---|---|---|---|
| 0.30 | 2.8e-11 | 1.9e-11 | 2.6e-12 | 1.3e-11 |
| 0.50 | 4.9e-2 | 1.2e-2 | 1.1e-2 | 7.7e-12 |
| 0.70 | 0.56 | 0.19 | 0.19 | 8.9e-12 |
| 0.95 | 0.76 | 0.60 | 0.24 | 1.1e-7 |
| 1.05 | 0.73 | 0.65 | 0.48 | 0.17 |
| 1.30 | 0.65 | 0.70 | 0.87 | 0.41 |

H = 2 gives the same values to two digits; delta = 0.3 gives the same values as delta = 0.05. The displacements used are O(delta^2) (max shift / delta^2 between 0.7 and 17), so the linearisation is consistent for small delta.

Reading: K = (band) log(T/2pi)/2pi real unknowns against 2 (band)(theta log(T/2pi))/2pi real constraints; the count balances at theta = 1/2, i.e. N = (T/2pi)^{1/2}, the Riemann-Siegel length. If the other zeros may also leave the line (complex displacements) the count balances at theta = 1, the Beurling-Landau density of the zeros. Consequence for this route: **all prime data with n <= T^{1/2 - eps}, in any window, are matched to first order (1e-11) by on-line configurations with and without the off-line pair.** In the single-term regime N < H this covers every H < T^{1/2}. So for H < T^{1/2} the exact identities of Lemma 1(a),(b) carry no first-order information about delta, independently of any inequality.

**Recorded stop.** Two separate thresholds:
1. information threshold (MEASURED): theta = 1/2 for the single-term regime (H >= N >= T^{1/2}) before an off-line pair is distinguishable from on-line rearrangement to first order;
2. inequality threshold (PROVED comparison above): none; g < proved bound for every H and N, deficit N^{1/2 - delta}.
Rows: the L^2/averaged form is MV-CAP (P27, Q9, Z17); the single-window pointwise form stops at map section 4 item 3 ("prime-side statements hold only to the right of 1/2 or 1": the proved bound on the short twisted prime sum is the Re s = 1 bound) and matches P29 (one-window forcing: the data that separate zeta from a control are Re s > 1 data).

## 3. Controls

The route reaches no conclusion for zeta, so no control is "killed by a conclusion". What is recorded is which step each control passes.

| Control | Lemma 1 (exact identity) | Lemma 2 (pair lower bound) | Bound step (size and support of coefficients) |
|---|---|---|---|
| DH | holds with b(n), -L'/L = sum b(n) n^{-s} (finite sums, contour argument unchanged) | holds | **fails**: b(6) = 1.936 (a(6) - a(2)a(3) = 1.0807); 78.6% of sum |b(n)|, n <= 2e4, sits off prime powers; max |b(n)|/log n = 1.34, 2.68, 8.14, 15.96 for n <= 1e2, 1e3, 1e4, 2e4 (MEASURED, `testC.json`). Lemma 1(a) "S_w(log 6) = 0" is false for DH in every window. |
| backward heat | **not formulable**: no ordinary Dirichlet series, so no atoms at log n on the prime side. Projection domination and window positivity hold (they use only the zero configuration). The step that fails is the first arithmetic one. | holds | n/a |
| Liouville twist (zeta(2s)/zeta(s)) | holds with coefficients (-1)^k log p at p^k, multiplicities -1 on Re = 1/2 and +1 on Re = 1/4 | no growing term for u > 0 | passes (same size and support). No contradiction: its zeros lie left of the line and the route only sees growth for u > 0. |
| sign twist TW- (general eps_p) | **fails**: no functional equation, no conjugation-closed zero set, so S_w is not defined as a symmetric zero sum | n/a | passes (size and prime-power support kept) |
| E_a = zeta(s+a) zeta(s-a) | holds, coefficients Lambda(n)(n^a + n^{-a}) | holds, every pair has delta = a | **fails**: size (n^a) |
| T-NR | holds | holds | **fails**: size at powers of the single prime q |
| Beurling | fails: no integers, no functional equation | n/a | n/a |

Every control that has a symmetric zero side fails only at "|Lambda(n)| <= log n and prime-power support". These are the inputs TW+ and TW- keep, and they are Re s >= 1 information. Multiplicativity beyond prime-power support is not used anywhere.

## 4. Requirement flags

- **R1 (multiplicativity essential): not established.** The prime side uses prime-power support and the size of Lambda only. Products n = m m' enter only as "S_w(log n) = 0 at non-prime-powers below H"; a multiplicative D gives no gain (Lemma 1(b)). Evidence: section 2(b), control table (TW- keeps every prime-side input).
- **R2 (height-uniform, every window): holds for the identity, not for a conclusion.** Lemma 1 is exact in every window for any H >= 3, with no error term. The exclusion inequality of Lemma 2 fails in every window. Flag set false because no conclusion about zeros is reached.
- **R3 (controls fail at a named step): not established.** Steps are named per control above, but the route has no conclusion, and the Liouville twist passes every step.
- **R4 (reaches the critical line): no.** No mechanism was proposed; the stop is exactly the missing transport of the Re s = 1 bound on short twisted prime sums.

## 5. Verdict

Precise obstruction. The window-local Landau-Gonek identity is exact (no H- or N-dependent error), holds in every window, and separates zeta from DH window by window through prime-power support. Combined with projection domination it yields the inequality `|short twisted prime sum| >= 2|W| sinh(delta u) - M_on`, whose left side has only the trivial bound; g is below the proved bound by N^{1/2 - delta} for every H and N. Independently, prime data below the Riemann-Siegel length T^{1/2} do not distinguish an off-line pair from an on-line rearrangement to first order (measured residual 1e-11), and with free complex displacements the same holds up to T^{1}. No pivot taken: the adjacent idea (using N between T^{1/2} and T, where the measured residual is O(1)) needs a bound on the same short twisted prime sums and is the same wall.

## 6. Three weakest steps

1. Test B is a first-order, float64, band-truncated (zeros within 14H) least-squares computation at T <= 3e4. It establishes absorbability below theta = 1/2 numerically (residual 1e-11); it does not prove that an exact on-line configuration with the same data exists, and the residuals above the threshold (0.2 to 0.9) are not lower bounds for an untruncated basis. The threshold is soft at these heights (r about 1e-2 at theta = 0.5).
2. M_on in Lemma 2 uses the trivial bound on the on-line part. The true on-line sum is the prime side minus the pair, so any sharper bound on it is again a bound on the short twisted prime sum; this circularity is asserted from Lemma 1, not proved as a formal equivalence with explicit constants.
3. Lemma 1 is quoted as classical with the remainder R described by size only (pole, archimedean, mirrored zeros); no explicit constant for R was derived, and the numerical check covers T in {1e3, 1e4} with one window shape.

## Files

`zeros.py`, `lib.py`, `testA.py` / `testA.json`, `testB.py` / `testB.json`, `testC.py` / `testC.json`, `zeros40000.npy`. All runs local under `scripts/memcap.sh 8`; the server was not used.
