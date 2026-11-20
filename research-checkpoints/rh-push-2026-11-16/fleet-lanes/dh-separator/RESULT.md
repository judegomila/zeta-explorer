# dh-separator: lowest-complexity functional separating zeta from Davenport-Heilbronn in the one-sided Weil cone

Date: 2026-11-16. Scope: `tmp/research-2026-11-16/push/dh-separator/` only. Nothing committed, pushed or
posted. No RH claim, no new zero-free region. Labels: PROVED (argument given here), CLASSICAL, MEASURED
(numerics, not interval-certified), CONDITIONAL, OPEN.

## Verdict

**Partial result.** The separator exists at the lowest possible complexity and is explicit, and a positivity
statement for zeta that fails for DH is proved with an Euler-product input and no verified height. The
content of that statement is exactly a zero-free half-plane (or the classical zero-free region). It is a
restatement in the program's coordinates, not new information about zeros.

1. **Minimal separator (PROVED identity, MEASURED values).** One damped complex exponential
   `v(t) = e^{-zt}`, `z = x + it`, `x > 0`, has `Q(v) = Re L(z) / Re z`. For DH,
   `Q = -60.35` at `z = 0.25 + 85.699348485 i`; for zeta at the same `z`, `Q = +1.7287`. A real-valued test
   needs two exponentials (the conjugate pair, one damped cosine); it is negative for DH at every phase.
   One real exponential cannot separate. Real rates need order about 150 to 210 (sibling measurement).
2. **Exact pair formula and lens lemma (PROVED).** `Re L(z)/x` is a sum of explicit nonnegative terms
   except for off-line zeros `delta + i gamma` in the lens `delta^2 - x^2 > (gamma - t)^2`. So `Q(e^{-zt}) >= 0`
   whenever that lens is zero-free. The order-1 complex test at `z` sees only zeros within height
   `sqrt(1/4 - x^2)` of `t` and to the right of `x`.
3. **Euler-sensitive positivity (PROVED for zeta; fails for DH).**
   - `Q(e^{-zt}) > 0` for all `Re z >= 1/2`, and on the wider region `Re z >= 1/2 - eta(|t| + 1/2)` where
     `eta` is the de la Vallee-Poussin width. Input: Euler product (non-vanishing on `Re s > 1`; `3-4-1`
     with `Lambda(n) >= 0`). No verified height.
   - Real-rate version inside the cone `E` (Theorem B): `Q(r) >= 0` for every real exponential sum `r`
     with rates `> c` such that `e^{c|l|} C_r(l)` is positive definite, for `c = 1/2`. This sub-cone has
     members of every order.
   - DH fails both: it has zeros with `Re s > 1` (CLASSICAL, existence). No such zero was found below
     height 10^4 (MEASURED), so the failure at `c = 1/2` is by existence, not by an explicit witness.
4. **Explicit DH witness against a proved-type zeta statement (CONDITIONAL on the 7/8 half-plane).** DH has
   a zero at `0.8977501549770 + 2442.5302924685 i` (MEASURED, residual 2.5e-28). At
   `z = 0.375 + 2442.5302924685 i`: `Q_DH = -110.83`, `Q_zeta = +6.360`. Positivity of `Q(e^{-zt})` on
   `Re z >= 3/8` for zeta is equivalent to the zero-free half-plane `Re s > 7/8` (openai/math result,
   machine-checked locally per the brief, not refereed).
5. **Obstruction (PROVED equivalence).** For each `c`, positivity on `{Re z >= c}` (order 1) and positivity
   on the sub-cone `F_c` (all orders, real rates) are each equivalent to "no zeros with `Re s > 1/2 + c`".
   The DH witness at height 85.7 lies at `c < 0.3085`, where zeta positivity is the open zero-free
   statement. Proving it there by Euler input needs a new zero-free region; nothing in this construction
   supplies one.

## 0. Plan: what is new against the atlas and the walls

- Atlas (PR 27 `research/rh/modules/historical-routes.md`) closing line and the round 1-3 syntheses: floors
  are equivalent to half-planes (round-1 Lemma L); every route stopped at the first step needing Euler
  input. This note does not reopen any of them. It answers a narrower question set by the task: at what
  complexity does the one-sided Weil functional separate zeta from DH, and what can be proved for zeta on
  the separating family.
- eq48/RESULT.md: the residual target equals the Weil functional on one-sided exponential tests, with
  real rates `x_j > 1/2`. euler/RESULT.md: finite real-node Pick orders are DH-blind to order 100.
- New here: (i) with complex rates the separating order is 1, so order is not the obstruction; the region
  of the rate is; (ii) an exact pair formula that localises the order-1 test; (iii) a real-rate sub-cone
  `F_c` of `E` on which positivity is equivalent to a zero-free half-plane, proved for `c = 1/2`;
  (iv) an explicit DH zero with real part above 7/8.
- Walls. DH: section 5 names the step that fails for DH. Flow-blindness: the proved statements are
  closed half-plane statements with `c >= 1/2` (or 3/8 conditional); they are not stable hypotheses that
  imply RH, and no RH implication is claimed. MV-CAP: no mean values used. Verified height: not used in
  Theorems A, B, C; it is the only available input at the height-85.7 witness (section 4).

## 1. Setup

`F(z)` is `xi(1/2 + z)` or the DH completion `Lambda_DH(1/2 + z)`, with
`Lambda_DH(s) = (5/pi)^{s/2} Gamma((s+1)/2) f(s)`, `f = ((1 - i kappa)/2) L(s, chi) + ((1 + i kappa)/2) L(s, chi-bar)`,
`chi` mod 5, `chi(2) = i`, `kappa = (sqrt(10 - 2 sqrt 5) - 2)/(sqrt 5 - 1)`. `F` is even, real on R, entire
of order 1, zeros in a vertical strip, `F(0) != 0` (zeta: classical; DH: `f(1/2) = 0.8254`, MEASURED in
euler/RESULT.md). `L = F'/F = sum over zeros rho of 1/(z - rho)` (symmetric sum; CLASSICAL Hadamard).

For `v(t) = sum_j b_j e^{-z_j t}` on `t >= 0` with `Re z_j > 0`:

    Q(v) = sum_{i,j} b_i conj(b_j) (L(z_i) + conj L(z_j)) / (z_i + conj z_j)
         = sum_rho V(rho) conj V(-conj rho),   V(s) = sum_j b_j/(s + z_j).

This is PR 50 eq. (1.7) and eq48 Theorem 1; the algebra (1.6) does not use that the rates are real.
`Q(v)` is the Weil functional of the autocorrelation `C_v(l) = int v(t + l) conj v(t) dt`. For real rates
`> 1/2` it is the residual-energy form (21) of PR 48.

## 2. Theorem A: the order-1 test and the lens lemma (PROVED)

**Theorem A.** For `z = x + it`, `x > 0`, `Q(e^{-zt}) = Re L(z)/x`, and

    Re L(z)/x = sum_{on-line zeros i gamma} 1/|z - i gamma|^2
              + sum_{off-line pairs {delta + i gamma, -delta + i gamma}, delta > 0}
                    2 (x^2 - delta^2 + (t - gamma)^2) / ( ((x-delta)^2 + (t-gamma)^2) ((x+delta)^2 + (t-gamma)^2) ),

with multiplicities, absolutely convergent.

*Proof.* `N = 1` in the Pick form gives `2 Re L(z) / (2x)`. `Re 1/(z - rho) = (x - beta)/|z - rho|^2`, and
`sum |x - beta| / |z - rho|^2 < inf` because the zeros lie in a strip and `sum |rho|^{-2} < inf`. The
functional equation and reality pair `delta + i gamma` with `-delta + i gamma` (same height). With
`d = t - gamma`, `phi(u) = u/(u^2 + d^2)`:
`phi(x - delta) + phi(x + delta) = 2x (x^2 - delta^2 + d^2) / (((x-delta)^2 + d^2)((x+delta)^2 + d^2))`.
(Numerical check of this identity: `thmB.py`, differences below 1e-40.) QED.

**Lens lemma.** A pair contributes negatively iff `delta^2 - x^2 > (gamma - t)^2`. Write
`H(z) = { delta + i gamma : delta > 0, delta^2 - (gamma - t)^2 > x^2 }` (the region to the right of the
branch through `z` of the rectangular hyperbola centred at `it`). If `F` has no zero in `H(z)`, then
`Q(e^{-zt}) > 0`.

**Corollary A1 (half-planes).** `Q(e^{-zt}) >= 0` for all `Re z >= c` iff `F` has no zero with real part
`> c`. (If: `H(z)` lies in `Re > x >= c`. Only if: at a zero `w` of multiplicity `mu` with `Re w > c`,
`L(w - eps) = -mu/eps + O(1)`.)

**Corollary A2 (real-valued tests).** For `v = Re(b e^{-zt})`, `b = |b| e^{i phi}`:
`Q(v) = (|b|^2/2) [ Re L(z)/x + Re( e^{2 i phi} L(z)/z ) ]`. So `Q(v) < 0` for every phase iff
`Re L(z)/x + |L(z)/z| < 0`.

**Complexity floor.** One real exponential gives `Q = L(x)/x`; by Theorem A this is positive unless a zero
has `delta^2 - x^2 > gamma^2`, which neither zeta nor DH has (DH: no off-line zero below height 85,
MEASURED census in `euler/dhcensus.py`). So the minimal separating test is one complex exponential;
the minimal real-valued one is one damped cosine (two conjugate rates, three real parameters).

## 3. Theorem B: a real-rate sub-cone of E with a half-plane criterion (PROVED)

For `c >= 0` let `F_c` be the set of real exponential sums `r = sum b'_i e^{-y_i t}` with distinct rates
`y_i > c` such that `e^{c|l|} C_r(l)` is a positive-definite function. Membership is a finite test:
nonnegativity on `u >= 0` of one real polynomial of degree `<= N - 1` in `u = tau^2`.

**Theorem B.**
1. For real `v = sum b_i e^{-x_i t}`, `x_i > 0` distinct, the function `e^{-c|l|} C_v(l)` equals `C_r(l)` for a
   real `r` with rates `x_i + c`; `r` is in `F_c`, and every element of `F_c` arises this way.
2. `Q(r) = sum_{i,j} b_i b_j (L(x_i + c) + L(x_j + c)) / (x_i + x_j)` (the Pick form of the shifted function).
3. `Q >= 0` on `F_c` iff `F` has no zero with real part `> c`.

*Proof.* (1) For `l >= 0`, `C_v(l) = sum_i beta_i e^{-x_i l}`, `beta_i = b_i sum_j b_j/(x_i + x_j)`. So
`h(l) = e^{-c|l|} C_v(l) = sum beta_i e^{-y_i |l|}`, `y_i = x_i + c`, with Fourier transform
`h^(tau) = sum beta_i 2 y_i/(y_i^2 + tau^2) = (|V(i tau)|^2 * Poisson_c)(tau) > 0`. It is `N(tau^2)/prod(y_i^2 + tau^2)`
with `N` a real polynomial positive on `[0, inf)`. Fejer-Riesz: `N(tau^2) = |P(i tau)|^2`, `P` real of degree
`<= N - 1`. `R(s) = P(s)/prod(s + y_i)` is proper with simple real poles, so
`r(t) = sum b'_i e^{-y_i t}` with real `b'_i`, and `|R(i tau)|^2 = h^`, hence `C_r = h`. Conversely, for `r` in
`F_c` apply the same factorisation to `e^{c|l|} C_r`.
(2) `Q(r) = sum_rho R(rho) R(-rho)`, and `R(s)R(-s) = sum_i beta_i [1/(y_i + s) + 1/(y_i - s)]` (both sides
rational and equal on `iR`). `sum_rho 2y/(y^2 - rho^2) = 2 L(y)` absolutely. So
`Q(r) = 2 sum_i beta_i L(y_i)`, which is the stated form.
(3) If no zero has real part `> c`:
`(L(x+c) + L(y+c))/(x+y) = sum_rho a_rho(x) conj a_rho(y) [1 + 2(c - beta)/(x + y)]`,
`a_rho(x) = 1/(x + c - rho)` (pair `rho` in the first term with `conj rho` in the second; terms are
`O(|rho|^{-2})`). Each summand is a rank-one PSD kernel plus `2(c - beta) >= 0` times its Schur product
with the Cauchy kernel. Conversely, if a zero has real part `> c`, `L(c + u)` has a pole in `Re u > 0`, so it
is not positive-real, and by Pick-Nevanlinna some finite real-node matrix (nodes in any interval) has a
negative direction; the matrix is real symmetric, so the direction can be taken real. QED.

Numerical check (`thmB.py`, 40 digits): `x = (0.3, 0.7, 1.1)`, `b = (1, -2.5, 1.5)`.
`c = 1/2`: `r` has rates `(0.8, 1.2, 1.6)`, coefficients `(0.847337747, -0.548313737, 0.061350975)`;
`Q_zeta(r) = 0.0060071071218637` by both sides (difference 6e-42); `Q_DH(r) = 0.0257245522509882` (3e-41).
`c = 3/8`: `0.00450687524963257` (4e-42).

## 4. Theorem C: positivity for zeta from the Euler product (PROVED), and the DH control

**Theorem C (zeta).**
1. `Q(e^{-zt}) > 0` for all `Re z >= 1/2`. `Q(r) >= 0` for all `r` in `F_{1/2}`.
2. Let `eta` be nonincreasing with `zeta(beta + i gamma) != 0` for `beta >= 1 - eta(|gamma|)` (de la
   Vallee-Poussin: `eta(u) = c_0/log(u + 2)` for an absolute `c_0 > 0`). Then `Q(e^{-zt}) > 0` for
   `Re z >= 1/2 - eta(|t| + 1/2)`.
3. CONDITIONAL on `zeta(s) != 0` for `Re s > 7/8`: `Q(e^{-zt}) > 0` for `Re z >= 3/8`, and `Q >= 0` on `F_{3/8}`.

*Proof.* (1) and (3): Corollary A1 and Theorem B(3). (2): a zero in `H(z)` has `delta < 1/2`, so
`|gamma - t| < 1/2`, so `delta < 1/2 - eta(|gamma|) <= 1/2 - eta(|t| + 1/2) <= x`, contradicting `delta > x`.
Strictness: the on-line and non-lens terms are positive and zeros exist. QED.

**Where the Euler product is used.** Only in the zero-free input: `zeta(s) != 0` on `Re s > 1` from the
absolutely convergent product (equivalently `log zeta = sum Lambda(n) n^{-s}/log n` converges absolutely);
on the de la Vallee-Poussin region from `3 + 4 cos + cos 2 >= 0` together with `Lambda(n) >= 0`; and the
7/8 result. Everything else (Theorems A, B) holds for any even real entire `F` of order 1 with zeros in a
strip. No zero ordinates and no verified height enter (1) or (2) with an unspecified `c_0`. (Published
explicit values of the constant in `eta` do use verified height at low `t`; they are not needed.)

**Why DH fails.** `f` has no Euler product. Its logarithm has no absolutely convergent Dirichlet series
up to `Re s = 1`, and `f` has zeros with `Re s > 1` (CLASSICAL: Davenport-Heilbronn 1936; Titchmarsh
section 10.25 for this `f`). By Corollary A1 and Theorem B(3), `Q_DH < 0` somewhere on `{Re z >= 1/2}` and on
`F_{1/2}`. The proofs of Theorems A and B go through verbatim for DH; only the zero-free input fails.

**DH measurements.** `sep1.py` (mpmath, 30 digits), `sep2.py` (python-flint, 260 bits), `scan.py` (double
precision winding numbers on height-10 boxes, adaptive step), `locate.py`.

Zero `w_0 = 0.80851718245663738555 + 85.699348485377592172 i` (centred `delta_0 = 0.3085`). At `z = x + i Im w_0`:

| x | Q_DH = Re L/x | worst-phase damped cosine, DH | Q_zeta | worst-phase, zeta |
|---|---|---|---|---|
| 0.02 | -20.2481 | -10.130 | 1.80473 | 0.901114 |
| 0.10 | -22.6272 | -11.328 | 1.79237 | 0.894530 |
| 0.25 | -60.3480 | -30.262 | 1.72870 | 0.861392 |
| 0.30 | -385.045 | -193.20 | 1.69775 | 0.845466 |
| 0.31 | +2181.52 | +1086.8 | 1.69109 | 0.842048 |
| 0.50 | +13.7459 | +6.8325 | 1.54397 | 0.766939 |

(Worst phase is `(Re L/x - |L/z|)/2`; the best phase differs from `Q/2` by the same `|L/z|/2 < 0.1`, so DH is
negative at all phases for `x <= 0.30`.) Height profile at `x = 0.25`: negative for `|t - Im w_0| <= 0.15`,
positive at `0.2`; lens half-width `sqrt(delta_0^2 - x^2) = 0.1808`.

DH zeros with `Re s > 0.87`, heights 10 to 10^4: see the table in section 4.1 (filled from the scan). The
first with real part above 7/8 is `w_1 = 0.8977501549770109638 + 2442.530292468486031 i`. At `z = x + i Im w_1`:

| x | Q_DH | Q_zeta |
|---|---|---|
| 0.375 | -110.833 | 6.36023 |
| 0.39 | -324.674 | 6.23774 |
| 0.3975 | -10050.6 | 6.17706 |
| 0.40 | +1117.23 | 6.15692 |
| 0.50 | +24.5843 | 5.39676 |

Negative for `|t - Im w_1| <= 0.05` at `x = 0.375` (lens half-width 0.1326).

### 4.1 Scan table

Scan range: heights 10 to 10^4, lines `sigma_0 = 0.87` and `sigma_0 = 1.0`, right edge `sigma = 3`
(`scan_0_7000.log`, `scan_7000_10000.log`; 894 s and 817 s). MEASURED.

| DH zero (30-digit refinement, residual < 2e-27) | Re s | relation to 7/8 |
|---|---|---|
| 0.8695305796406431 + 240.4046723514407 i | 0.86953 | below 0.87 (flagged by a near-line phase step) |
| 0.8977501549770110 + 2442.530292468486 i | 0.89775 | above 7/8 |
| 0.8740915008924425 + 5833.282319224610 i | 0.87409 | below 0.874887 |
| 0.8753363163315127 + 8235.592508571536 i | 0.87534 | above 7/8 |
| 0.8836407585839248 + 8561.594223356584 i | 0.88364 | above 7/8 |

Winding number on the `sigma_0 = 1.0` boxes: 0 in every box. No DH zero with `Re s > 1` and height in
`[10, 10^4]` was detected. Zeros with `0.5 < Re s < 0.87` were not enumerated (the known ones at heights
85.70, 114.16, 166.48, 176.70 were recovered in a test run).

## 5. What this does and does not give

- The order of the test is not where the Euler product enters. With complex rates the separating order
  is 1 (Lagarias' criterion `Re xi'/xi > 0` is the order-1 complex Pick condition). Real-rate orders 150 to
  210 for DH (`push/pick-induction/scan_dh_220.txt`, sibling, not re-verified here) measure the cost of
  approximating one damped cosine by real exponentials, not arithmetic content.
- On the order-1 family the positivity region for zeta is exactly the zero-free region, with a local
  version (lens lemma). On the real-rate sub-cones `F_c` the same holds at all orders. So a proved
  extension of Theorem C to any `c < 3/8`, or to any `z` left of the classical region at unverified
  height, is a new zero-free statement and nothing less.
- The height-85.7 DH witness needs `x < 0.3085`. For zeta at those `z`, positivity follows from the lens
  lemma once the box `Re s > 1/2 + x`, `|Im s - 85.7| < 0.5` is zero-free. That is a verified-height fact. An
  Euler-product proof there would be a zero-free half-plane `Re s > 0.8085`, beyond 0.874887.
- Statement that is proved, Euler-sensitive, and free of verified height: Theorem C(1),(2). Its content is
  CLASSICAL (non-vanishing on `Re s >= 1 - eta`); the formulation inside the one-sided cone (Theorem B) and
  the lens lemma are new to this program's notes as far as I found, and elementary. I did not search the
  literature for Theorem A's pair formula; it is likely known (Lagarias 1999, Hinkkanen 1997 context).

## 6. Three weakest steps

1. **Novelty.** Theorem C is the classical zero-free region rewritten as Weil positivity on a sub-cone.
   Calling it "the first Euler-sensitive positivity statement proved in this program" is accurate only
   in that sense. It moves no bound.
2. **DH zero data are MEASURED.** The scan uses double-precision winding numbers on boxes
   `[sigma_0, 3] x [t, t+10]` with step 0.04 refined to below 0.001 when a phase step exceeds 1 radian. A
   zero within about 1e-3 of a scan line or a pair of zeros in one box cancelling is not excluded. Zeros
   were refined to 30 digits but not ball-certified. "No DH zero with `Re s > 1` below 10^4" is measured
   only. The existence of DH zeros with `Re s > 1` is quoted from the literature, not re-proved.
3. **Domain and conditionality.** The explicit DH witness `z = 0.375 + 2442.53 i` has `Re z < 1/2`. It lies in
   the one-sided cone (rates `> 0`, zero-side form), but outside the range `x_j > 1/2` where the prime
   side of PR 48 eq. (21) converges absolutely. The matching zeta statement (Theorem C(3)) depends on
   the unrefereed 7/8 theorem. Without it, the only unconditional pairing of "proved for zeta" with
   "fails for DH" is at `c = 1/2`, where the DH failure is by existence.

Also unproved: positivity for zeta of all-phase damped cosines `Re(b e^{-zt})` with `Re z >= 1/2`
(i.e. `Re L(z)/x >= |L(z)/z|` on `Re z >= 1/2`). Measured positive in the tables; a proof needs a bound on
`arg L(z)` and was not attempted. Theorem B covers only the phases inside `F_{1/2}`.

## 7. Files

- `sep1.py`, `sep2.py`: order-1 values for DH and zeta at the two witnesses.
- `thmB.py`: Theorem B identity and pair identity checks.
- `scan.py`, `locate.py`, `dhf.py`, `scan_*.log`: DH zero scan and refinement.
