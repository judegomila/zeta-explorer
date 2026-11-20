# c1-missing-controls: the controls that were not run (map section 6, items 12 and 14)

Date 2026-11-17. Slug `c1-missing-controls`. Kind: repair. Scope: this directory only. Nothing committed or pushed.
Nothing here proves or refutes RH; no zero-free region, density bound or Lambda bound changes. Not refereed.
Labels: PROVED (argument given here) / PROVED-rel X / CLASSICAL (cited, not re-read in this run unless stated) /
MEASURED (multiprecision floats, not interval-certified, unless the entry says "Arb certificate") / OPEN.
All numerics local through `scripts/memcap.sh 8`, single process; the compute server was not used.

## FLAGS (cells where a control behaves differently from Davenport-Heilbronn)

**Mechanism level: none.** No lane has a zero-location mechanism that a sign twist or the backward heat family
passes in full. No closed family is reopened.

**Step level: the following cells differ from the DH column.** Each is expected from what the control keeps
(the twist keeps the Euler product and loses the functional equation; DH is the reverse), and none is a lead by
itself. They are listed because the assignment asks for every such cell.

1. `h-hecke-channels`, `h-hecke-torus-symmetry` (Thm 1(b), Thm 3), `h-tnr-geometric` (M2), `h-twistor-penrose`
   (Prop. 4), `h-metaplectic-spin` (Thm B): the DH-failing step "joint Hecke eigen-object at every prime" PASSES for
   TW+ and TW- (exact). The twist fails instead at the Fricke / functional-equation step, which DH passes.
2. `h-metaplectic-spin` (Thm E) and `h-seven-eighths-in-bridge` (Lemma 4.1, signal extraction): the DH-failing
   step "Dirichlet inverse = mu a" PASSES for TW+ and TW- (exact). The twist fails at the reflection step (R).
3. `h-hecke-torus-symmetry` Thm 7 (norm-convergent product, zero-free Re s > 1): DH FAILS, TW+ and TW- PASS, and
   the conclusion is true for them. HEAT fails it with zeros measured at Re s = 1.125 (height 60.7, tau = -2).
4. `h-tnr-geometric` package M1-M4: DH fails M2 only; TW- with eps_p = +-1 fails M1 only; TW+ with some
   0 < eps_p < 1 fails M1 and M3 (and M4 where eps_p = 0). The lane's sentence "sign twist fails only M1 among
   M1, M2" is correct; the M3 failure of TW+ was not recorded there.
5. `stack-feasibility` (iv): DH's known quartet (delta = 0.3085) lies inside the 7/8 half-plane; HEAT at tau = -2
   violates (iv) from height 60.7 on (delta = 0.6247). At tau = -0.1 and -0.5 all off-line zeros found
   (delta <= 0.343) satisfy (iv), like DH.
6. `sq-canonical-det`: same outcome type as DH (passes for small t, must fail at a finite T*), by the lane's
   Lemma A; one difference: the heat kernel has no finite-support property in n, so there is no threshold of the
   form 2t = log n.

One item in the opposite direction, recorded because it sharpens the filter: for a **finite** twist the zeros in
the open strip are those of zeta, so every "zeros on the line" conclusion has the same truth value as for zeta.
A finite twist is a control only for statements that use zeta's archimedean side. A sign twist whose conclusion is
false needs infinitely many primes (the only example in the push is `U_R` of `res-identity-solenoid`, float64,
unrefereed; no TW+ example with a zero in 7/8 < Re s < 1 is exhibited anywhere: OPEN).

## Verdict

**Partial result (filter repaired; four parts done, with the stated residuals).**

- **Part A.** Sign twists TW+ and TW- were run through the DH-failing steps of seven lanes. In six lanes the
  DH-failing step passes for the twist and the twist fails at the functional-equation step; in `h-klein-fricke`
  the DH-failing step is not formulable. `h-local-sign-change` has no DH-failing step and was not rerun.
- **Part B.** Backward heat at tau = -0.1, -0.5, -2: off-line zeros located (lowest at heights 415.256, 111.694,
  49.715). In `stack-feasibility` the family passes (i), (iii), (vi) and fails (ii) only as a data mismatch, as DH
  does. In `sq-canonical-det` it has the properties Lemma A needs, so it passes for small t and fails at a finite
  T*; the Ritz computation of K[t] for the heat family was not run.
- **Part C.** Arb certificate: the DH theta kernel is positive and strictly log-concave on all of u >= 0, and
  `-log kappa(sqrt t)` is strictly convex on t > 0 (Csordas form). Certified range: [0, 2] by interval jets,
  [2, infinity) by an analytic tail bound; the whole real line by evenness.
- **Part D.** Yes. For every fixed 0 < a <= 1/2, `S(T) - (1/pi) arg zeta(1/2+a+iT)` is unbounded above and below
  (PROVED-rel two CLASSICAL theorems: Selberg's central limit theorem for S(t), Bohr-Jessen for sigma > 1/2).
  Consequence: no fixed shifted pair `A_a`, `B_a` is an interlacing partner of Xi, unconditionally. Shifted
  interlacing partners with fixed shift are closed.

## 0. Plan

Decisive first test: Part C (it could have shown that a "measured" property of the DH control is false near
u = 0, where the Csordas quantity vanishes to third order and a grid cannot decide). It passed. Then D (proof),
B (zeros of the heat family, then the two lanes), A (twists).

New relative to the map: (a) the DH kernel properties move from MEASURED on a grid of 161 points to a certificate
on the full half-line; (b) the heat family has measured off-line zeros at the three stated tau, with positions;
(c) the twist cells of seven lanes are computed instead of inferred; (d) item 12 of section 6 (shifted partner
lead of `res-identity-solenoid`) is decided.

## 1. The table (lane x control)

Entry: the step that fails, or PASSES. "DH step" = the step the lane names as failing for DH.

### Part A: sign twists in the h-lanes

Twists used (eps completely multiplicative, a(n) = prod eps_p^{k}): TW+ a: eps_2 = 1/2; TW+ b: eps_p = 1/2 for all
p; TW+ c: eps_p uniform in {0, 1/16, ..., 1} (seed 20261117); TW- a: eps_2 = -1; TW- b: Liouville; TW- c: random
signs (same seed). Script `partA_twist.py`, output `partA_twist.json`.

| Lane | DH step | TW+ at the DH step | TW- at the DH step | Step where the twist fails | Label |
|---|---|---|---|---|---|
| `h-hecke-channels` | R4: vertex is a joint eigen-object of all `U_p`; Fricke commutes with `U_p` on the module | PASSES (T1: defect 0 exactly, n <= 3000, p <= 31; DH 1.0807) | PASSES (same) | Fricke: no functional equation (T4) | PROVED (eigen step, one line); MEASURED T4; CLASSICAL (Hamburger; Kaczorowski-Perelli degree 1) for "no FE unless eps is a character" |
| `h-hecke-torus-symmetry` | Thm 3: eigen-object only for the index-2 subalgebra; Thm 7: norm-convergent product, zero-free Re s > 1 | PASSES both (`||eps_p V_p|| <= p^(-1/2-delta)`) | PASSES both | "Fricke-even kernel" | PROVED; MEASURED T4 |
| `h-klein-fricke` | Section 6: "the Hecke orbit is one torus" (single cosine) | not formulable: the twisted series is not an Epstein function of a lattice | not formulable | Identification step (sections 2-3): no functional equation, so no torus | PROVED for finite twists (T4 formula); not a quantitative handle |
| `h-local-sign-change` | none (F1, F2, F5 do not depend on the base; hold for DH-based members) | PASSES (lane section 6, not rerun) | PASSES | none | PROVED in the lane |
| `h-metaplectic-spin` | Thm B: eigen-section of `T_{p,eps}` at inert primes; Thm E: `sum mu a n^-s = 1/f` | PASSES both (T3 residual <= 3e-39 at p = 3, 5, 7; T2 defect 0 exactly, n <= 400; DH 6.27) | PASSES both | Fricke invariance on `gamma_0` | PROVED (Thm B(ii) holds for any complex eps); MEASURED |
| `h-seven-eighths-in-bridge` | Lemma 4.1: signal extraction needs a completely multiplicative target | PASSES (T2 exact) | PASSES | Reflection (R): the twisted theta rows are automorphic only for a Hecke character | PROVED (extraction); the (R) failure is MEASURED on the rank-one theta only (T4), not on the cubic rows |
| `h-tnr-geometric` | M2 (simultaneous `U_p` eigen-object) | PASSES M2; fails M1, and M3 at each p with 0 < eps_p < 1 | PASSES M2, M3, M4; fails M1 only | M1 (Fricke symmetry) | PROVED (definitions); MEASURED T4 |
| `h-twistor-penrose` | Prop. 4: joint eigenvector of the Hecke algebra (operator Euler product) | PASSES | PASSES | (P1): no involution normalising the Hecke algebra | PROVED; MEASURED T4 |

Per-lane answer to "does the DH-failing step also fail for the twist": **no** in six lanes, **not formulable**
in `h-klein-fricke`, **no DH-failing step** in `h-local-sign-change`.

Numbers (MEASURED, 40 digits; T1 and T2 in exact rational arithmetic):

- T1 `max |a(pn) - a(p)a(n)|`: 0 for the six twists; DH 1.0807009 (= 1 + k0^2, lane value).
- T2 `max_{n<=400} |a^{-1}(n) - mu(n)a(n)|`: 0 for the six twists; DH 6.269 (lane: 4.29 on n <= 100).
- T3 relative residual of `T_{p,eps} f - eps(1+1/p) f` at `tau_0 = 0.31 + 0.83i`, ladder period 2, nu = 0:
  between 1.6e-40 and 3.1e-39 for all twists and p = 3, 5, 7.
- T4 kernel level, `(1 + 2 psi(1/x))/(sqrt(x)(1 + 2 psi(x)))`, `psi = sum a(n) e^{-pi n^2 x}`, at x = 1.5, 2, 4, 8:
  zeta 1, 1, 1, 1; TW+ a 0.99982, 0.99868, 0.97839, 0.92551; TW+ b 0.99982, 0.99868, 0.97796, 0.91518;
  TW- a 0.99926, 0.99474, 0.91357, 0.70601; TW- b 0.99926, 0.99474, 0.91187, 0.66467. DH with its own theta
  (`theta(1/x)/(x^{3/2} theta(x))`): 1, 1, 1, 1.
- T4 line level, phase of `pi^{-s/2} Gamma(s/2) F(s)` mod pi at t = 5, 10, 17, 30 on Re s = 1/2: zeta 0, 0, 0, 0;
  TW+ a 3.0917, 0.4856, 2.6774, 0.1983; TW- a 2.4083, 1.0411, 2.0355, 1.2078; Liouville 2.4267, 2.5250, 3.1024,
  0.6266. A functional equation s <-> 1-s with real coefficients would make the phase constant mod pi.
- Finite twists at the first zeta zero: `|F| < 1e-39`. Their zeros in 0 < Re s < 1 are exactly zeta's (the ratio of
  local factors has its zeros on Re s = 0 and its poles in Re s <= 0). PROVED.

### Part B: backward heat, kernel `e^{tau u^2/16} kappa(u)`

`F_tau(z) = int e^{tau u^2/16} kappa(u) e^{zu/2} du`, `z = s - 1/2`. Quadrature: composite Gauss-Legendre in
python-flint (`heatlib.py`), validated at tau = 0: `F_0/xi(1/2+z) = 1` to 40 digits at five points up to height
560; `F_0'/F_0` equals `xi'/xi` to 2e-301 at 24 real nodes; sign changes of `F_0(it)` equal the zeta zero count on
[1, 230] (96), [405, 425] (13) and [532, 572] (28).

Zeros (MEASURED; `partB_heat_zeros*.py`). Sign changes of `F_tau(it)` on a grid of step 0.01, off-line zeros by
Newton from seeds at close pairs of zeta zeros, residual below 1e-20. "Count" = sign changes + 2 x off-line.

| tau | window | sign changes | off-line zeros `delta + i gamma` (Re z > 0) | count / zeta count |
|---|---|---|---|---|
| -0.1 | [1, 230] | 96 | none | 96 / 96 |
| -0.1 | [230, 405] | 109 | none | 109 / 109 |
| -0.1 | [405, 425] | 11 | 0.0215579 + 415.2562790i | 13 / 13 |
| -0.1 | [532, 572] | 24 | 0.0609152 + 540.4697362i; 0.1402531 + 564.3693091i | 28 / 28 |
| -0.5 | [1, 230] | 86 | 0.2429565 + 111.6942277i; 0.1981079 + 150.6922461i; 0.2609939 + 169.6118874i; 0.3377140 + 185.5070099i; 0.3432579 + 221.2268408i | 96 / 96 |
| -2 | [1, 230] | 47 | 24 found; lowest 0.2485774 + 49.7154476i; then 0.6247240 + 60.7078706i; largest delta 1.3130662 at 221.66; 21 of 24 have delta > 1/2 (Re s > 1) | 95 / 96 |

For tau = -2 the count is one short; the zeros drift upward (first zero at 14.715 against 14.135) and one leaves
the window at 230. This was not checked by an argument-principle count. The lowest off-line zero for tau = -0.1
is at height 415.26 (no deficit below).

| Lane | Step | HEAT tau = -0.1 | tau = -0.5 | tau = -2 | DH (lane) | Label |
|---|---|---|---|---|---|---|
| `stack-feasibility` | (i) functional equation | PASSES (kernel even) | PASSES | PASSES | passes | PROVED |
| | (ii) explicit formula with the control's own data | not formulable as a prime sum (no Dirichlet series); satisfied identically if `b_j` is defined from its zeros | same | same | passes with `c_DH(n)` | PROVED-rel `flow-euler-defect` |
| | (ii) with zeta's `Lambda(n)` (lane Prop. A: `L = xi'/xi` on Re z > 1/2) | FAILS: `L_tau - L_0` = -5.7e-5 (x = 0.6) to -4.8e-4 (x = 6.1) | FAILS: -2.8e-4 to -2.4e-3 | FAILS: -1.1e-3 to -9.4e-3 | fails (different function) | MEASURED |
| | (iii) sectors `P + B`, `P - B`, 12 nodes 0.6..6.1 | PASSES: min eig 1.38e-59, 2.94e-56 | PASSES: 1.09e-59, 2.36e-56 | PASSES: 4.56e-60, 1.04e-56 | not excluded above ordinate 30 | MEASURED, 300 digits |
| | (vi) Pick `P`, same nodes | PASSES: 1.157e-33 | PASSES: 1.008e-33 | PASSES: 6.04e-34 | passes (finite Pick orders Euler-blind) | MEASURED |
| | (iv) half-plane, delta <= 3/8 | PASSES on [1, 572] windows scanned (max delta 0.140) | PASSES on [1, 230] (max 0.343) | FAILS at height 60.7 (delta 0.625) | known quartet passes (0.3085); fails globally (zeros with Re s > 1) | MEASURED |
| `sq-canonical-det` | `abs(Theta) = 1` on the line | PASSES (exact: `F_tau` even and real) | PASSES | PASSES | passes | PROVED |
| | causal kernel (decay of `Theta` to the right) | PASSES: same values as zeta to 3 digits at 10 points, Re z up to 80 | PASSES | PASSES | passes | MEASURED |
| | `norm K[T] < 1` for all T (Lemma A(b): iff `Theta` inner) | FAILS for omega = 0.1 (pole from 0.1403 + 564.369i, v = 0.040); no pole found for omega = 0.25 on the windows scanned | FAILS for omega = 0.1 (5 poles, first v = 0.143 at 111.69) and omega = 0.25 (3 poles, first v = 0.011 at 169.61) | FAILS for both (omega = 0.1: 24 poles from 49.7; omega = 0.25: from 60.7, v = 0.375) | fails from t = 1.718 (omega = 0.1) | PROVED-rel lane Lemma A + MEASURED zeros |
| | `norm K[t] < 1` for small t | PASSES for t < T*(tau, omega), T* not computed | same | same | passes for t <= 1.716 | PROVED-rel Lemma A(a) (norm continuous, starts at 0); T* OPEN |

Same nodes 0.04..0.48: all three matrices positive at all three tau (min eig 6.2e-58, 5.6e-111, 2.7e-105 at
tau = -2). At tau = 0 the script reproduces the lane's minima 1.2e-33, 1.5e-59, 3.1e-56.

Reading for `stack-feasibility`: at tau = -2 the family has 24 off-line quartets below height 230, twenty-one of them
outside the critical strip, and it still satisfies (i), (iii), (vi) at the lane's orders. The stack member that
excludes it is (ii), and (ii) excludes it as "this is not the function with zeta's prime data", which is the
lane's Proposition A. This is the DH outcome.

Reading for `sq-canonical-det`: the lane's section 6.3 (ARGUED) is confirmed in the part that can be checked
without a Ritz run. The heat quotient is unimodular on the line and has a causal kernel of the same decay class,
so Lemma A applies; the determinant criterion holds on an initial interval of t and fails once a pole exists.
The first failure time T* was not computed. A Ritz run needs degree p > gamma t (p > 100 t at tau = -2,
p > 223 t at tau = -0.5, p > 1128 t at tau = -0.1) with the kernel obtained by Fourier inversion of a quotient of
quadratures; not done. The lane's residue estimate `|c| e^{2vt}/(2v)` does not give T*, because the regular part
already has norm within 1e-29 of 1 for DH; pole data (v, `|c|`) are in `partB_sq.json`.

## 2. Part C: interval certificate for the DH theta kernel

Object (as in `h-tnr-geometric/main.py`): `kappa(u) = e^{3u/4} theta(e^u)`,
`theta(x) = sum_{5 does not divide n} a(n) n e^{-pi n^2 x/5}`, `a = (1, k0, -k0, -1)` mod 5,
`k0 = (sqrt(10 - 2 sqrt 5) - 2)/(sqrt 5 - 1) = 0.28407904384...`. `kappa` is even (CLASSICAL: theta inversion
`theta(1/x) = x^{3/2} theta(x)`, equivalent to DH's functional equation). `L = log kappa`.

**Certified (Arb certificate, `partC_dh_cert.py`, 200 bits, 1.1 s):**

- (P) `kappa(u) > 0` for all u >= 0;
- (LC) `L''(u) < 0` for all u >= 0 (strict log-concavity);
- (CS) `h(u) = u L''(u) - L'(u) < 0` for all u > 0, i.e. `L'(u)/u` is strictly decreasing, i.e.
  `-log kappa(sqrt t)` is strictly convex on t > 0.

By evenness the three statements hold on the whole real line (with (CS) in the variable t = u^2).

Structure of the certificate.

1. `[0, 2]`: 7094 closed intervals (adaptive, minimum width 3.05e-5). On each, interval Taylor jets
   (`arb_series` with interval base point) enclose `theta` and `L', L'', L''', L''''`; the terms n <= 40 are
   kept and the remainder n > 40 is added as an explicit radius (`trunc_tail`, bound
   `Bell(j)(C X)^j e^{-C 41^2/2}/(1 - e^{-40C})`, `C = pi/5`). Certified on every interval: `theta > 0`,
   `L'' < 0`, `L'''' < 0`. Largest upper bounds: `L'' <= -0.5968`, `L'''' <= -1.96e-4`; smallest lower bound
   of `theta`: 0.00963.
2. From `L'''' < 0` on [0, 2] and `L'(0) = L'''(0) = 0` (evenness): `L''' < 0` on (0, 2], and
   `h(u) = int_0^u s L'''(s) ds < 0` on (0, 2]. This step is needed because `h(u) = L''''(0) u^3/3 + O(u^5)`
   vanishes to third order at 0; `L''''(0) = -1.97620088837...`. PROVED from the certificate plus evenness.
3. Independent of step 2, `h < 0` is certified directly on [1/4, 2] (516 intervals, largest upper bound -2.8e-4).
4. `[2, infinity)`: with `theta = e^{-Cx}(1 + r)`, `x = e^u >= X0 = e^2`,
   `|D^j r| <= rho_j = sum_{n>=2} n Q_j(C(n^2-1)X0) e^{-C(n^2-1)X0}` (`Q_j` the Touchard polynomial;
   `Q_j(y)e^{-y}` decreases for y >= j and `C * 3 * X0 = 13.9`). Arb values: `rho_0 = 1.787e-6`,
   `rho_1 = 2.489e-5`, `rho_2 = 3.716e-4`. Then `kappa > 0`; `L'' <= -C X0 + E2 = -4.6423 < 0`;
   `h <= -(u - 1)(C X0 - E2) - 3/4 + E2 + E1 <= -5.3919 < 0`, `E1 = 2.489e-5`, `E2 = 3.716e-4`. PROVED
   (hand-derived bound, constants enclosed by Arb).
5. Consistency (MEASURED to working precision): enclosures of `L'(0)`, `L'''(0)` are `[+/- 5.4e-59]`,
   `[+/- 3.3e-58]`; `theta(1/x) - x^{3/2} theta(x)` contains 0 with radius below 1.4e-58 at x = 0.5, 0.25, 0.8.

What it replaces: the grid check on u in [0, 8], step 0.05 (161 points). What it does not cover: the zeta
kernel (Csordas-Varga, CLASSICAL), the EA and NR kernels of the same table, and any statement about higher
Laguerre or Turan-type inequalities.

## 3. Part D: `D_a(T) = S(T) - (1/pi) arg zeta(1/2 + a + iT)` is unbounded for fixed 0 < a <= 1/2

Notation: `sigma_0 = 1/2 + a` in (1/2, 1]. `S_{sigma_0}(t) = (1/pi) arg zeta(sigma_0 + it)`, the argument taken by
continuous variation along the horizontal segment from `2 + it` (t not the ordinate of a zero); `S = S_{1/2}`.

**Inputs (CLASSICAL, both unconditional; statements cited from memory, not re-read in this run).**

- (Sel) Selberg's central limit theorem for S(t): for every real lambda,
  `(1/T) meas{ t in [T, 2T] : pi S(t) <= lambda sqrt((1/2) log log T) } -> Phi(lambda)`
  (Selberg 1946, moments `int_T^{2T} S^{2k} = ((2k)!/(k! (2 pi)^{2k})) T (log log T)^k (1 + o(1))`; Tsang 1984).
- (BJ) Bohr-Jessen: for fixed `sigma_0 > 1/2`, `log zeta(sigma_0 + it)` (same horizontal convention) has a limit
  distribution: a probability measure `mu` on C with `(1/T) meas{ t <= T : log zeta(sigma_0 + it) in B } -> mu(B)`
  for rectangles B with `mu`-null boundary (Bohr-Jessen 1930/32; Borchsenius-Jessen 1948).

**Theorem D1 (PROVED-rel (Sel), (BJ)).** For every fixed `0 < a <= 1/2` and every M > 0,

    (1/T) meas{ t in [T, 2T] : D_a(t) > M } -> 1/2,      (1/T) meas{ t in [T, 2T] : D_a(t) < -M } -> 1/2.

In particular `D_a` is unbounded above and below.

Proof. Fix eps > 0. By (BJ) there is R with `meas{ t in [T, 2T] : |S_{sigma_0}(t)| > R } <= eps T` for
T >= T_0 (the family is tight; the set in [T, 2T] is contained in the set in [0, 2T]). By (Sel) with
`lambda_T = pi(M + R)/sqrt((1/2) log log T) -> 0`, `meas{ t in [T, 2T] : S(t) > M + R } = (1/2 + o(1)) T`.
On the set where `S > M + R` and `|S_{sigma_0}| <= R` one has `D_a > M`; its measure is at least
`(1/2 - eps - o(1)) T`. The same with signs reversed. The two sets are disjoint, so both proportions tend to 1/2.

Quantitative form (CLASSICAL inputs: Selberg's mean square of S, and `int_T^{2T} |arg zeta(sigma_0 + it)|^2 dt
<< T` for fixed `sigma_0 > 1/2`): `int_T^{2T} D_a^2 dt = (T/(2 pi^2)) log log T + O_a(T sqrt(log log T))` by the
triangle inequality in L^2. Size `sqrt(log log T)`, the size of S itself: subtracting the shifted argument removes
a bounded amount of variance, `(1/(2 pi^2)) sum_p (2 p^{-1/2-sigma_0} - p^{-2 sigma_0}) + ...`, and leaves the
divergent `sum 1/p`.

**Theorem D2 (closure of fixed shifted partners; PROVED-rel D1 and Theorem 6 of `res-identity-solenoid`).**
Let `0 < a <= 1/2`, `E_a(z) = Xi(z + ia)`, `A_a = Re E_a`, `B_a = Im E_a` on the real axis, and
`u = cos(phi) A_a + sin(phi) B_a` for a fixed real phi. Then u is not an interlacing partner of Xi: it is not the
case that all zeros of Xi are real and are interlaced by the real zeros of u.

Proof. If Xi has a non-real zero there is nothing to prove. Otherwise RH holds, zeta has no zero with
`Re s >= 1/2 + a`, and by Theorem 6 of the lane `E_a` is of Hermite-Biehler class without real zeros. Its phase
`phi_a(t) = -arg E_a(t)` is then increasing and the zeros of u are the points with `phi_a = const mod pi`, so
`N_u(T) = phi_a(T)/pi + O(1)`. By the functional equation `E_a(t) = conj xi(sigma_0 + it)`, and
`arg xi(sigma_0 + it) = arg(s(s-1)) + Im log Gamma(s/2) - (t/2) log pi + arg zeta(sigma_0 + it)
= theta(t) + a pi/4 + pi + pi S_{sigma_0}(t) + O(1/t)` (Stirling; with no zeros to the right the vertical and
horizontal conventions for the argument agree). Hence `N_u(T) = theta(T)/pi + S_{sigma_0}(T) + O(1)`, while
`N(T) = theta(T)/pi + 1 + S(T)`. So `N(T) - N_u(T) = D_a(T) + O(1)`, unbounded by D1. Interlacing requires
`|N_u(T) - N(T)| <= 1` (lane Theorem 7).

This is the "yes" of item 12 / lead 12. With the lane's own exclusion of `a > 1/2`, every fixed shift `a > 0` is
closed, with no hypothesis.

Illustration (MEASURED, `partD_numeric.py`, t in [1000, 1300], step 0.1, 3000 points; this is not evidence for
unboundedness, the growth being `sqrt(log log T)`): variance of S 0.1558; variance of `D_a` 0.0164, 0.0304,
0.0603, 0.0890 and range of `D_a` [-0.53, 0.49], [-0.59, 0.54], [-0.72, 0.67], [-0.86, 0.79] for a = 0.05, 0.1,
0.25, 0.5; means below 0.004 in absolute value.

**What is not closed (OPEN).**

- A shift that depends on height, `a(T)` of order `1/log T`. There the prime-side variance
  `sum_p (1 - p^{-a})^2/p` is bounded for p <= e^{1/a}, and the argument above gives nothing. Such a family is not
  one entire function `E_a`, so it is outside the lane's Theorem 6 as stated.
- Partners that are not shifts. Theorem 7 of the lane stands: a partner must have count
  `theta(T)/pi + S(T) + O(1)`.

## 4. Controls for this lane's own statements

No zero-location argument is made, so there is no step that has to fail for the controls. For the record:
Theorem D1 uses (Sel), whose proof uses the Euler product (prime sums approximating `log zeta`) and holds for
L-functions with an Euler product and a zero-density estimate near the line; it is not claimed for DH. Theorem D2
needs only D1 and the Hermite-Biehler dichotomy. The Part C certificate is a statement about DH alone.

## 5. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 multiplicativity used essentially | not established (false) | repair lane; no attack. Part A shows the opposite kind of fact: steps that use multiplicativity alone pass for every twist |
| R2 height-uniform, every window | not established (false) | D1 is a statement about proportions of t; C is about a kernel |
| R3 every control fails at a named step | not established (false) | no mechanism proposed; section 1 lists, per lane, the step each control fails |
| R4 reaches the critical line | not established (false) | D1 and D2 are statements on the line but give no zero location |

Metric: the lane contributes to reliability (part D of the metric) only.

## 6. Three weakest steps

1. **Part D rests on two classical theorems cited from memory.** Selberg's central limit theorem for S(t) and
   the Bohr-Jessen limit distribution for `sigma_0 > 1/2` were not re-read; the match of the argument convention at
   the (density-zero) set of ordinates of zeros to the right of `sigma_0` was not checked against the sources.
   The quantitative mean-square form uses a third cited input. No referee has read D1 or D2.
2. **Part B is not a full run of `sq-canonical-det`.** The heat outcome there is deduced from the lane's Lemma A
   plus measured zeros; the operator K[t] of the heat family was not built, T* is unknown, and the applicability
   of Lemma A (causal kernel in the lane's class, nu omega > 1) rests on ten measured values of the quotient.
   The zeros are from float quadrature and Newton iteration with completeness checked only by sign-change counts
   (one unit short at tau = -2, attributed to drift across the window edge and not verified).
3. **Part A tests are at the coefficient and rank-one theta level.** The reflection step (R) of the 7/8
   mechanism was not evaluated on the cubic theta rows; in `h-klein-fricke` the twist is "not formulable", which
   the map does not accept as a quantitative handle; and no twist with a false zero conclusion was constructed
   (finite twists have zeta's zeros). In Part C the evenness of the kernel is a classical input, the tail bound
   is hand-derived, and the certificate depends on the correctness of python-flint 0.9.0; the minimum interval
   width 3e-5 shows large overestimation in the fourth-order jets near u = 2.

## 7. Rows for the obstruction map (not edited here)

- Section 2, DH row: "positive even theta kernel, Csordas convexity (measured)" can read "(Arb certificate on
  u >= 0, `c1-missing-controls`)", with strict log-concavity added.
- Section 2, HEAT row: off-line zeros located: tau = -0.1 lowest at 0.0216 + 415.256i; tau = -0.5 at
  0.2430 + 111.694i; tau = -2 at 0.2486 + 49.715i and zeros with Re s > 1 from height 60.7 (MEASURED).
- Section 6, item 12 (shifted partner part) and the "Not covered" line of `res-identity-solenoid`: decided, yes
  (PROVED-rel classical; unrefereed).
- Section 6, item 14: sign twist run in seven h-lanes, backward heat run in `stack-feasibility` and (without the
  Ritz computation) in `sq-canonical-det`; outcomes as inferred. Remaining: Ritz run of K[t] for the heat family.

## Files (all under `tmp/research-2026-11-16/push/c1-missing-controls/`)

- `partC_dh_cert.py`, `.log`, `.json`: Arb certificate. `c_explore.py`: exploratory grid values.
- `partA_twist.py`, `.log`, `.json`: twist tests T1-T4.
- `heatlib.py`: quadrature for `F_tau`. `heat_validate.py`. `partB_heat_zeros.py`, `partB_heat_zeros2.py`,
  `partB_heat_zeros3.py` with logs and JSON: zeros. `partB_stack.py`, `.log`, `.json`: Pick and sector matrices,
  log-derivative mismatch. `partB_sq.py`, `partB_sq_decay.py` with logs and JSON: scattering quotient.
- `partD_numeric.py`, `.log`, `.json`: illustration. `zz.py`, `zeta_zeros_900.json`: zeta zeros to height 1302.
- Run times: all under 20 minutes; `partB_heat_zeros.py` was stopped by PID at 19.5 minutes and its last two
  validation scans were rerun as `partB_heat_zeros3.py`. Planned allocations printed by each script; peak below
  100 MB.
