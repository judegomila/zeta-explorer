# e1-sparse-recurrence-amplifier: RESULT

Combination: Bagchi recurrence (`bagchi-strong-recurrence`) x Kronecker flow on the prime torus (`tinfty-flow-generator-spectrum`, `euler-product-torus-parametrisation`) x zero-density estimates (`large-sieve-density-selector`).

Verdict: **precise obstruction.** The first lemma is true. The second step (the Euler product forces the returns) is closed: on the torus, the set of return points of a zeta zero has Haar measure zero, so Kronecker equidistribution predicts no returns, and the lemma itself bounds the number of returns by the number of zeros. For Davenport-Heilbronn the same set has positive Haar measure and the measured return count up to height 1e5 matches the Haar prediction. Nothing about the location of any zeta zero is obtained.

Labels: PROVED (derived here), CLASSICAL (cited theorem, not re-derived), MEASURED (float64 numerics, no interval arithmetic), ARGUED.

## 1. Plan and what is new against the map

- New relative to the map: the Rouche return count as an object; its exact relation to N(sigma, T); the measured return law for the DH zero against the Haar prediction; the split zeta = zeta_P R_P as the reason the Bohr set of finitely many primes returns to the wrong pattern.
- Not new: the stop. It is MV-CAP (Q2, Z17: N(sigma,T) = o(T) is a proportion) and the l^1/l^2 threshold of the prime chain (Q10).
- Order of work: decisive test first (section 3), then the lemma and the structural statements (sections 2, 4).

## 2. First lemma (PROVED)

Notation: for a zero rho_0 = beta_0 + i gamma_0 of F and 0 < r < 1/2 with no zero of F on |s - rho_0| = r, call tau >= 1 a *Rouche return* if

    max_{|s-rho_0|=r} |F(s + i tau) - F(s)| < min_{|s-rho_0|=r} |F(s)|.

R(T) = largest number of one-separated Rouche returns in [1, T].

**Lemma 1.** R(T) <= N_F(beta_0 - r, T + |gamma_0| + 1), where N_F(sigma, T) counts zeros with real part > sigma and 0 < Im <= T.

Proof. By Rouche, F(s + i tau) has as many zeros in |s - rho_0| < r as F(s), hence at least one zero in the disc D(rho_0 + i tau, r). For one-separated tau and r < 1/2 these discs are disjoint, and every point in them has real part > beta_0 - r and imaginary part in (0, T + |gamma_0| + 1). The proof uses nothing about F beyond analyticity.

**Corollary 1 (zeta).** With N(sigma, T) << T^{A(sigma)(1-sigma)+eps}: if a zero rho_0 with beta_0 > 1/2 had R(T) >= T^{E+eps'} along a sequence T -> infinity, E = A(beta_0 - r)(1 - beta_0 + r), that contradicts the density estimate. So RH follows from "every hypothetical off-line zero has at least T^{E+eps} one-separated Rouche returns".

**Corollary 2 (same lemma read forwards, PROVED given the density estimate).** For zeta, every off-line zero has R(T) << T^{E+eps} = o(T). The recurrence hypothesis of Corollary 1 is therefore false whenever the zero exists: it is equivalent to the absence of the zero, and carries no information that the zero count does not carry. Return count <= zero count is an inequality in one direction only, and it is the direction that makes the hypothesis as strong as the conclusion.

Needed exponent E(beta_0, r), using A(sigma) = min(3/(2-sigma) [Ingham], 15/(3+5 sigma) [Guth-Maynard], 3/(3 sigma - 1) for sigma >= 3/4 [Huxley]) (CLASSICAL, recalled, not re-derived):

| beta_0 | r -> 0 | r = 0.02 | r = 0.05 | r = 0.1 |
|---|---|---|---|---|
| 0.55 | 0.9310 | 0.9592 | n/a | n/a |
| 0.60 | 0.8571 | 0.8873 | 0.9310 | n/a |
| 0.65 | 0.7778 | 0.8102 | 0.8571 | 0.9310 |
| 0.70 | 0.6923 | 0.7273 | 0.7778 | 0.8571 |
| 0.75 | 0.5556 | 0.6090 | 0.6923 | 0.7778 |
| 0.80 | 0.4286 | 0.4783 | 0.5556 | 0.6923 |
| 0.85 | 0.2903 | 0.3423 | 0.4286 | 0.5556 |
| 0.875 | 0.2308 | 0.2780 | 0.3559 | 0.4909 |

The exponent is < 1 for every beta_0 > 1/2 (Ingham's 3(1-sigma)/(2-sigma) < 1 iff sigma > 1/2), so the lemma is non-vacuous everywhere, and tends to 1 as beta_0 -> 1/2. Given the zero-free half-plane Re s > 7/8, beta_0 <= 7/8 and the needed exponent is at least 0.2308 (r -> 0) at every hypothetical zero; the half-plane does not lower any density exponent (map row Z17). Sharper density bounds near sigma = 1 exist and would lower the last rows slightly; they were not used.

## 3. Decisive test (MEASURED)

Method. F(sigma + it) on uniform t-grids by one type-1 non-uniform FFT for the head of the Dirichlet series plus an Euler-Maclaurin tail per residue class (`lib.py`); checked against mpmath at 12 points, absolute error <= 1.3e-9 up to height 1e5 (`selftest.py`). All runs under `scripts/memcap.sh 8`, single process, longest 8.5 min.

### 3a. DH zero census (`census.py`, `census_dh_100000.json`)

Winding numbers on cells 0.01 x 0.05 over 0.52 <= Re s <= 1.20, 1 <= Im s <= 1e5, Newton refinement: 8116 zeros, all of winding +1 (58 kept at cell centres, not refined). Same code on zeta: 0 zeros (`census_zeta_100000.json`).

| sigma | N_DH(sigma, 1e3) | 1e4 | 1e5 | log10 slope 1e4 -> 1e5 |
|---|---|---|---|---|
| 0.55 | 27 | 531 | 7539 | 1.15 |
| 0.65 | 21 | 352 | 4246 | 1.08 |
| 0.7085 | 17 | 225 | 2385 | 1.03 |
| 0.7585 | 14 | 125 | 1209 | 0.99 |
| 0.80 | 7 | 62 | 559 | 0.96 |
| 0.90 | 0 | 0 | 9 | |

N_DH(sigma, T) grows linearly in T at every 1/2 < sigma < 1 sampled.

### 3b. Rouche returns of the DH zero rho_0 = 0.8085171825 + 85.6993484854i (`returns.py`, `returns_dh_100000.json`)

Circle sampled at 48 points, tau on a grid of step 0.05 up to 1e5; min on the circle from 2000 points. eta = 0.9 is the same test with the right side multiplied by 0.9 (margin against the 48-point sampling of the maximum).

| r | min on circle | one-separated returns <= 1e3, 1e4, 1e5 | slope 1e4 -> 1e5 | needed exponent 2.4(1 - beta_0 + r) | zeros within r of rho_0 + i tau, tau <= 1e5 |
|---|---|---|---|---|---|
| 0.10 | 0.1215 | 8, 38, 452 | 1.08 | 0.700 | 2376 |
| 0.05 | 0.0618 | 2, 10, 187 | 1.27 | 0.580 | 1112 |
| 0.02 | 0.0250 | 1, 2, 38 | 1.28 | 0.508 | 432 |

Every grid return has a census zero inside its disc (748 of 748, 214 of 214, 38 of 38): Lemma 1 checked on data. About one zero in 5 (r = 0.1) to one in 11 (r = 0.02) within r of the translate line is a Rouche return.

### 3c. Haar (Bohr-torus) prediction (`mc.py`, `mc.json`)

Random model f(s, w) = c L(s, chi w) + conj(c) L(s, conj(chi) w), c = (1 - i xi)/2, chi mod 5 with chi(2) = i, w_p independent uniform on the circle; primes <= 500 exact, primes in (500, 2e6] replaced by four independent circular Gaussian analytic functions (one per residue class) with the exact covariance; 1.5e6 samples.

| quantity | measured on the orbit, tau <= 1e5 | Haar model |
|---|---|---|
| fraction of tau that are Rouche returns, r = 0.1 | 3.74e-4 | 4.32e-4 (648 hits) |
| same, eta = 0.9 | 2.55e-4 | 2.87e-4 |
| fraction of tau with a zero in D(rho_0 + i tau, 0.1) | 3.68e-3 | 3.57e-3 |
| Rouche returns, r = 0.05 | 1.07e-4 | 1.29e-4 (194 hits) |
| zero in disc, r = 0.05 | 8.69e-4 | 7.96e-4 |

Agreement within 3 to 17 percent; the measured return fraction is below the model in all four return rows and still rising with height (slopes above 1 in 3b). For DH the return set is a set of positive Haar measure and the orbit visits it at the Haar rate.

Dependence on small primes. Mean of |p^{-i tau} - 1| over the returns (r = 0.1; value for uniform phases is 4/pi = 1.273): p = 2: 0.316, p = 3: 0.339, p = 7: 0.538, p = 13: 0.772, p = 11: 1.264, p = 101: 1.333. Primes congruent to +-1 mod 5 contribute the same factor to L(s, chi) and L(s, conj chi), so they do not move the zero of f; the data show this. Conditional return frequency inside the Bohr set {|p^{-i tau} - 1| < 0.25 for p in {2, 3, 7}}: 4.5e-2 against 3.7e-4 unconditionally (factor 120). The DH zero is carried by finitely many primes to a fixed tolerance.

### 3d. zeta on Re s = 0.6, t <= 1e6 (`nearzero.py`, `nearzero_1000000.json`), grid 0.02

| delta | fraction of t with abs(zeta(0.6+it)) < delta | random Euler product (4e6 samples) | DH, same line |
|---|---|---|---|
| 0.5 | 0.2292 | 0.2282 | 0.1242 |
| 0.3 | 0.08486 | 0.08478 | 0.03939 |
| 0.2 | 0.02786 | 0.02806 | 0.01700 |
| 0.1 | 1.85e-3 | 1.75e-3 | 4.22e-3 |
| 0.05 | 2.79e-5 | 2.9e-5 | 1.05e-3 |
| 0.02 | 0 | not resolved | 1.70e-4 |

Minimum of abs(zeta(0.6+it)) on the grid: 0.0201 at t = 863808.38. Minimum for DH: 9.1e-5. DH small values follow a delta^2 law (factor 4 per halving: zeros at positive density). zeta small values follow the zero-free random Euler product to within 6 percent and fall by a factor 66 from delta = 0.1 to 0.05. Return count of zeta zeros in 0.52 <= Re s <= 1.2 up to 1e5: 0 = zero count.

Outcome of the test: the combination is closed at step 2. Reasons in section 4.

## 4. Why the Euler product does not force returns (step 2)

Write zeta = zeta_P R_P, zeta_P(s) = prod_{p <= P} (1 - p^{-s})^{-1}, R_P = zeta / zeta_P (meromorphic in Re s > 0).

**P1 (PROVED).** zeta_P is a continuous function of the torus point (p^{-i tau})_{p <= P}, uniformly on compacts of Re s > 0, and has no zero there. For tau in the Bohr set B(P, delta) = {tau : |p^{-i tau} - 1| < delta, p <= P}, zeta_P(s + i tau) -> zeta_P(s) uniformly on the disc as delta -> 0, in every window. This is the only part of zeta to which unique ergodicity of the Kronecker flow applies as stated (continuous functions of finitely many coordinates).

**P2 (PROVED).** The zero at rho_0 belongs to R_P for every P: R_P(rho_0) = 0. A Rouche return of zeta at tau in B(P, delta) is, up to the factor zeta_P and an error O(delta), a Rouche return of R_P. So the Bohr set of the first P primes transfers the problem unchanged to the tail, which is the zeta function of the primes > P. No finite P carries any part of the zero.

**P3 (PROVED from Corollary 2).** For every P and delta, B(P, delta) has positive density (Kronecker-Weyl), and the Rouche returns have density zero (Corollary 2). So the proportion of B(P, delta) intersect [0, T] consisting of returns tends to 0. In the Bohr set, zeta(s + i tau) returns to the zero-free pattern zeta_P(s) times a typical tail, not to zeta(s). Contrast 3c: for DH the proportion inside the Bohr set of {2, 3, 7} rises by a factor 120.

**P4 (CLASSICAL: Bagchi's limit theorem, support of the limit measure).** On a disc in 1/2 < Re s < 1 the translates zeta(. + i tau) are distributed, for tau in [0, T], T -> infinity, as the random Euler product zeta(s, w), w Haar on the infinite torus; zeta(., w) is almost surely zero-free. The closed set {g : max |g - zeta| <= (1 - eta) min |zeta| on the circle} consists of functions with a zero in the disc, has Haar probability 0, and so has orbit frequency 0. The orbit point at tau = 0 is the identity of the torus, an exceptional point of a Haar-null set; the map w -> zeta(., w) is defined almost everywhere and is square-summable in the prime coordinates but not continuous in the product topology for Re s <= 1 (row Q10: l^1 threshold at Re s = 1, l^2 threshold at 1/2). Unique ergodicity gives orbit frequencies only for sets whose boundary is Haar-null and whose indicator is controlled by continuous functions; it gives no lower bound on visits to a Haar-null set. The number of visits to that set is the zero count, which is what the density estimate bounds.

**P5 (ARGUED, order of magnitude).** Count of tau <= T in B(P, delta) is about T (delta/pi)^{pi(P)}. For this to be at least T^E one needs pi(P) <= (1 - E) log T / log(pi/delta), i.e. P of order log T. An approximation of zeta(s + i tau) on the disc valid for all tau <= T by a function of the phases of the primes <= P is available with P a power of T (approximate functional equation: Dirichlet polynomial of length about T), not P of order log T. With P of order log T the tail has mean square about (log T)^{1 - 2 sigma} over tau, small on average, and of size 1 exactly at the points that matter (R_P vanishes at the zero). That is the mean-value against every-window gap in this formulation.

**Summary of the stop.** Step 2 would need "one off-line zero implies at least T^E zeros with real part > beta_0 - r". Lemma 1 shows this is the content of the recurrence hypothesis and nothing less. The torus gives the opposite prediction (frequency zero) for zeta and the correct positive frequency for DH. Uniform almost periodicity, which turns one zero into a positive proportion (Bohr), holds in Re s > 1 and stops there.

## 5. Controls

| Control | Lemma 1 (Rouche count) | Returns | Density estimate | Step that separates it from zeta |
|---|---|---|---|---|
| DH | holds (checked: 748/748) | positive density: 4.5e-3 one-separated per unit height at r = 0.1, Haar-predicted | false: N_DH(0.7085, T) = 0.024 T measured, linear at every sigma sampled | the density estimate. Its proof uses a mollifier, i.e. a Dirichlet polynomial approximating 1/F, which exists because 1/zeta = sum mu(n) n^{-s} (multiplicativity). The recurrence side does not separate DH from zeta by any proved statement; it separates them only through the Haar measure of the zero set (positive for DH, zero for zeta), which is the conclusion |
| TW- (sign twist, Euler product, no functional equation) | holds where the twisted function continues | Haar-typical twists are zero-free in Re s > 1/2 (CLASSICAL, random Euler product); for a twist with an off-line zero nothing in P1-P5 uses the functional equation | available only with a growth bound in the strip, which the twist need not have | none inside this combination (ARGUED): the recurrence step never uses the functional equation, so a forcing argument built from P1-P5 alone would apply to twists with zeros. The combination fails the "fails for the control for a structural reason" requirement on TW- |
| EA = zeta(s+a) zeta(s-a) | holds | zeros on Re s = 1/2 + a number about (T/2 pi) log T; returns not measured | false for sigma < 1/2 + a; true to the right | size: mean square of sum sigma_{2a}(n) n^{-a-s} diverges for Re s <= 1/2 + a, so the density proof stops at 1/2 + a. The combination then says only that zeros right of 1/2 + a would need sparse recurrence: consistent, no information |
| HEAT (backward heat) | not applicable | not applicable | not applicable | first step: H_t for t < 0 is not a fixed ordinary Dirichlet series, vertical translation does not act through a torus, and its zeros leave every strip (`b-escape-law`) |
| One-pair lifts (row P29: F = zeta (p+q)/p; continuous Beurling system zeta(s)(s - rho_0)(s - conj rho_0)/(s - b)^2 with beta_0 <= b < 1, whose prime measure is the zeta one plus the non-negative density 2(x^{b-1} - x^{beta_0 - 1} cos(gamma_0 log x))/log x) | holds | exactly one off-line pair: R(T) = 0 | holds trivially | these show "one zero implies T^E zeros" is false for functions that keep analyticity, a positive prime measure and (for P29) sup-norm closeness to zeta at Re s = 2. The Beurling example was derived here by the Frullani integral and not checked further (ARGUED). A forcing step must use the discrete prime torus |

Three requirements: all primes together: not met by step 2 (P2: any finite Bohr set leaves the zero in the tail). Uniform in height and every window: Lemma 1 is; the forcing step is not available. Fails for controls for a structural reason: met for DH and EA through the density estimate, not met for TW-.

## 6. Verdict

- Lemma 1 and Corollaries 1, 2: PROVED (Corollaries relative to the classical density estimates).
- RH is implied by power-sparse Rouche recurrence at every hypothetical zero with the exponents of section 2 (at least 0.2308 given the 7/8 half-plane). PROVED, and by Corollary 2 the hypothesis is equivalent to the absence of the zero.
- The Euler product does not force such returns through the Kronecker flow: P1-P4. Precise obstruction: the return set is Haar-null for zeta; equidistribution gives its frequency as 0, and any lower bound on visits is a lower bound on off-line zeros.
- Decisive test: executed to height 1e5 (DH) and 1e6 (zeta on Re s = 0.6). DH returns occur at the Haar rate; zeta small values match the zero-free random Euler product.
- No pivot taken. The adjacent combinations found are existing rows: replacing Rouche returns by a one-sided bound on the prime head is S4 (missing lemma L3); the tail in mean square is Q10; density under the half-plane is Z17.
- No statement about the location of zeta zeros is obtained.

## 7. Three weakest steps

1. P4 and the Monte Carlo are stated for the limit T -> infinity; at height 1e5 the measured DH return fractions are 13 to 17 percent below the model and the slopes in 3b exceed 1 for small r. The claim "returns at the Haar rate" is supported, not certified; counts are 38 to 452 events, and the model replaces primes above 500 by a Gaussian field.
2. The TW- and Beurling rows are ARGUED. No explicit sign twist with an off-line zero and a growth bound was constructed, and the continuous Beurling example was not checked beyond positivity of its prime density.
3. Numerics are float64 without interval arithmetic. The census relies on cell winding numbers at spacing 0.01 x 0.05 (58 of 8116 zeros not refined; two zeros in one cell would be missed), and the Rouche maximum is taken over 48 circle points (the eta = 0.9 rows give the margin). The density exponents in section 2 are recalled from the literature, not re-derived.

## Files

`lib.py` (evaluation), `selftest.py`, `census.py`, `returns.py`, `mc.py`, `nearzero.py`; outputs `census_dh_100000.json`, `census_zeta_100000.json`, `returns_dh_100000.json`, `mc.json`, `nearzero_1000000.json`. Environment: `venv/` (numpy, scipy, mpmath, finufft). The compute server was not used.
