# g-odd-adversary: adversarial numerics for the odd-sector sign (PR 56 target B)

Date 2026-11-16. Scope: the odd half-line theta cutoff kernel of PR 56
(`annulus_theta_coupling.md` (C),(D); `odd-sector-followup/operator-duality.md` (5),(7),(9)).
On odd inputs `H_c = -Delta_c`, so target B ("`Delta_- <= 0` on odd tests") is "`H_- >= 0`".
Nothing here proves or refutes RH. Labels: PROVED / CLASSICAL / MEASURED / CERTIFIED (Arb ball
arithmetic, sign strictly enclosed) / ARGUED / OPEN.

## Verdict

**Precise obstruction, with a negative search result.**

1. No odd test with the wrong sign exists for the actual theta kernel at any depth reached:
   all Gram matrices tried are CERTIFIED positive definite (up to 220 nodes on spectral
   heights `[0,170]`, pivots down to `1e-310`), and the one-node sign is CERTIFIED positive at
   150000 points up to height 3000.
2. The same pipeline CERTIFIES wrong-sign odd tests for Davenport-Heilbronn (DH) and MEASURES them
   for the backward-heat theta family. So the search is not blind in principle. It is blind in
   practice in the physical (Mellin) coordinate: the wrong-sign eigenvalue produced by an off-line
   zero at height `gamma` has size about `e^{-pi gamma/2}` relative to an `O(1)` operator.
   DH: `-5.0e-57` against a top eigenvalue `2.6e-2`.
3. Float or GPU eigensolves of the physical kernel see 7 to 10 eigenvalues and nothing else. In
   that visible range xi and DH are indistinguishable in structure. The motherbox GPU was not used
   for this reason; everything decisive is multiprecision on CPU.
4. There is no spectral gap to report. The operator is compact with simple eigenvalues decaying by
   a factor 0.005 to 0.14 per index (table below). A proof by relative margin is impossible; the
   sign has to be exact at every depth.

## Plan: what is new versus the atlas, PR 56 and the sibling lanes

Read: BRIEF; eq48 `RESULT.md` (target == Weil form, no margin `theta<1`); euler `RESULT.md`
(real-axis Pick orders, DH passes to order 100); PR 56 `annulus_theta_coupling.md`,
`odd-sector-followup/README.md`, `operator-duality.md`; atlas section headers and section 5 on
Laguerre differences (skimmed, not read line by line; the round syntheses and zf-campaign notes were
not re-read for this numerics lane). Sibling results used and not repeated:
`g-odd-sign-tp` (sign-regularity order of `H_-` is 4; a negative non-principal 5x5 minor exists) and
`g-odd-sign-factor` (signed factorization `Delta_- = -P + N`, `rank N` = number of off-line quartets).

New here: (a) the converged top spectrum of the odd sector with an Arb certificate of the node
Grams; (b) certified and explicit wrong-sign tests for DH with their size and shape; (c) the measured
negative spectrum of DH, one eigenvalue per off-line quartet, matching `e^{-pi gamma/2}`;
(d) the backward-heat control; (e) the statement that every input PR 56 has proved for theta also
holds for DH.

Walls: verified height and flow-blindness are confirmed in sections 4 and 5, not avoided.

## 1. Parameters (PROVED, elementary)

`H_c(u,v)` depends on `c-(u+v)/2` and `u-v`, so `H_c` is the translate of `H_0`; the odd sector about
`c` is unitarily the odd sector about 0. The kernel is linear in `alpha`. Hence the odd spectrum is
`alpha` times one fixed sequence, for every cutoff `c`. The "full range of `c` and the cutoff" is one
operator. The only remaining parameter in PR 56 is the heat time `tau`
(`kappa_tau = e^{tau u^2/16} kappa`, `tau` = de Bruijn time), treated in section 5. All numbers
below are for `alpha = 1`.

## 2. Method

Spectral side, exact kernel, no quadrature of theta series:
`C_-(t,s) = (1/pi)[W(t,s) - W(t,-s)]`, `W(t,s) = (f(t)f'(s)-f'(t)f(s))/(t-s)`, `f(t) = xi(1/2+it)`,
`C_-(t,t) = (1/pi)(f'^2 - f f'' + f f'/t)`. `f, f', f''` come from Arb power-series arithmetic
(`acb_series` gamma and Hurwitz zeta), so each kernel entry is a rigorous ball
(`lib.py`). DH: `f = Lambda_DH(1/2+it)`, `Lambda_DH(s) = (5/pi)^{s/2} Gamma((s+1)/2) sum a_n n^{-s}`,
`a = (1, k, -k, -1, 0)` periodic, `k = 0.28408`.

* `nys.py`: Gauss-Legendre Nystrom matrix `sqrt(w_i) C_-(t_i,t_j) sqrt(w_j)` on `[T0,T]`;
  eigenvalues by mpmath `eigsy` at 400 to 1500 digits (MEASURED); then an Arb `LDL^T` of the
  unit-diagonal node Gram (CERTIFIED: all pivots strictly positive, or a strictly negative pivot).
* `scan1.py`: one-node sign `R(t) = pi C_-(t,t)/(f^2+f'^2)` on a grid (CERTIFIED per point).
* `packet.py`: Gaussian spectral packets, Rayleigh quotient `<g,C_- g>/<g,g>`.
* `xspace.py`: independent float Nystrom of the physical kernel `H_-(x,y)` from formula (C).
* `tp.py`: DH kernel inputs and minors on a 10-node grid. `heat.py`, `heat2.py`: heat family.

Cross-check of the PR 56 Fourier normalization (MEASURED): physical-coordinate float eigenvalues
`6.60764629e-4, 3.21046005e-6, 1.91650598e-8, 1.799319e-10, 3.0655e-12` agree with the spectral
side `6.6076462918e-4, 3.2104600479e-6, 1.9165060062e-8, 1.7993203615e-10, 3.0656062500e-12` to
float accuracy. Below the fifth the float values are noise (float `lambda_min = -1.3e-16`).

## 3. Result for the actual theta kernel

### 3.1 No wrong sign

| test | size | outcome |
|---|---|---|
| one-node sign `R(t) > 0` | 150000 points, `0 < t <= 3000`, step 0.02, 400 bits | CERTIFIED at every point, 0 ambiguous, min `R = 5.9e-8` at `t = 0.02` (the `t -> 0` limit, not a near-failure) |
| node Gram, GL-60 on `[0,50]` | 400 digits | CERTIFIED PD, last pivot `1e-116` |
| node Gram, GL-90 on `[0,70]` | 700 digits | CERTIFIED PD, last pivot `1e-165` |
| node Gram, GL-220 on `[0,170]` | 1500 digits | CERTIFIED PD, last pivot `1e-310`; Nystrom `lambda_min = 2.1e-695 > 0` (MEASURED) |
| minors of `H_-(x_i,x_j)`, `x = 0.25..2.5`, orders 1-5, all row/column sets | 62383 minors, 50 digits | all positive (MEASURED). Not a total-positivity claim: `g-odd-sign-tp` has a negative non-principal 5x5 minor on a wider grid |

These are finite certificates. By the verified-height wall they restate that zeros below the
verified height are on the line; they add no information about RH.

### 3.2 Top of the spectrum (MEASURED; converged between GL-90/[0,70] and GL-220/[0,170])

`lambda_n` of `H_-` on odd tests, `alpha = 1`:

| n | lambda_n | n | lambda_n |
|---|---|---|---|
| 1 | 6.6076462918e-04 | 11 | 1.5890944283e-22 |
| 2 | 3.2104600479e-06 | 12 | 6.8984324496e-24 |
| 3 | 1.9165060062e-08 | 13 | 1.2733832048e-25 |
| 4 | 1.7993203615e-10 | 14 | 3.6031813316e-27 |
| 5 | 3.0656062500e-12 | 15 | 1.7378199171e-28 |
| 6 | 3.3067468778e-14 | 16 | 7.2359250840e-30 |
| 7 | 5.1945342859e-16 | 17 | 2.3495852342e-31 |
| 8 | 1.5901913907e-17 | 18 | 6.7052000764e-33 |
| 9 | 3.1694149813e-19 | 19 | 1.9727026883e-34 |
| 10 | 6.6198356091e-21 | 20 | 1.4780246551e-35 |

Agreement of the two discretizations: exact to the printed digits for `n <= 14`, `1e-8` at `n = 20`.
Values to `n = 60` (`lambda_60 = 2.2e-84`) are in `nys_xi_220_0_170.json`; those beyond `n = 22`
rest on the larger run only. Ratios `lambda_n/lambda_{n-1}` range from 0.005 (n=2) to 0.14 (n=54)
and drift upward. Empirically `log10 lambda_n + pi gamma_n/(2 ln 10)` grows slowly from 6.5 (n=1)
to 23.4 (n=40): the n-th eigenvalue follows the n-th zero, `lambda_n ~ e^{-pi gamma_n/2}` times a
slowly growing factor. No closed law is claimed.

### 3.3 Extremal odd tests (MEASURED)

Physical coordinate, distance `x` from the cutoff: the n-th eigenfunction has exactly `n-1` sign
changes for `n = 1..7` (float resolution limit), is concentrated in `x < 2`, and its maximum moves
out slowly: `x = 0.41, 0.78, 1.01, 1.17, 1.34, 1.43, 1.52`. The top eigenfunction is positive, in
line with PR 56 theorem (G). The PR 56 one-sign cone therefore captures the top eigendirection only;
its share of the trace is `lambda_1 / sum = 0.9951`.

Directions of small energy are the high-index eigenfunctions: more oscillations, same support.
There is no low-oscillation near-null direction. A wrong-sign test, if one existed, would not look
like these; see 4.2.

## 4. DH control

### 4.1 Every proved input of PR 56 holds for DH (MEASURED)

`kappa_DH(u) = sqrt(pi/5) e^{3u/4} sum a_n n e^{-pi n^2 e^u/5}` is even (defect `7e-51`), positive
on `[0,8]`, and `V_DH(t) = -log kappa_DH(sqrt t)` is strictly convex on the sampled range
(`0 < u <= 6`, step 0.02; minimum normalized indicator `2.1e-4`, at the `u -> 0` end, same as
theta's `1.3e-4`). Odd entries `H_-^{DH}(x,y)` are positive; all 62383 minors of orders 1-5 on the
same grid are positive; eigenfunction `n` has `n-1` sign changes for `n = 1..8`. Top eigenvalues
`2.597e-2, 6.796e-4, 2.065e-5, 6.014e-7`.

So positivity of `kappa`, Csordas convexity (F), entry positivity (G), the one-sign cone (H), and
the low-order minor structure do not use the Euler product. PR 56 already showed convexity alone
is insufficient through an artificial kernel; DH shows the same with the full functional equation
and theta-series structure in place.

### 4.2 Certified wrong-sign tests for DH

One-node sign, 20000 points on `(0,200]`, step 0.01, CERTIFIED: `R(t) < 0` exactly on

| window in t | min R | DH off-line zero |
|---|---|---|
| [85.42, 85.98] | -18.7 | 0.8085 + 85.699 i |
| [114.02, 114.31] | -86.3 | 0.6508 + 114.163 i |
| [166.41, 166.55] | -235 | 0.5744 + 166.479 i |
| [176.50, 176.91] | -36.7 | 0.7243 + 176.702 i |

A single spectral node suffices: order 1 on the critical line, against order >100 for real-axis
Pick nodes in the euler lane. The order at which DH fails depends on where the nodes sit, and is 1
when they sit next to the off-line zero.

Explicit `L^2` tests (MEASURED, Arb arithmetic on an 80-point GL rule): spectral profile
`g(t) = exp(-(t-t0)^2/(2 s^2))`, physical preimage `a(x) = sin(t0 x/2) exp(-s^2 x^2/8)` odd about
the cutoff:

| t0 | s | `<a,H a>/<a,a>` (DH) |
|---|---|---|
| 85.72 | 0.4 | -1.1963e-57 |
| 114.17 | 0.2 | -1.2603e-77 |
| 166.48 | 0.2 | -7.1592e-114 |
| 176.72 | 0.2 | -8.4336e-120 |

The same packet on xi at `t0 = 85.72` gives `+6.2e-52`. Shape of the DH wrong-sign test at
`s = 0.4`: about 270 sign changes inside `|x| < 10` (amplitude above `e^{-2}`), support about five
times wider than the top eigenfunctions.

Window below the first off-line zero: GL-60 on `[0,50]` is CERTIFIED PD; GL-90 on `[0,70]` has a
CERTIFIED negative pivot at the 69th node (`t_69 = 60.49`), `-2.9955e-44 +/- 1e-54` in the
unit-diagonal Gram; GL-110 on `[0,100]` fails at pivot 68, `-5.82e-27`. So a window that ends 25
below the off-line zero already detects it, at depth `1e-44` and order 69.

### 4.3 Negative spectrum of DH (MEASURED)

| discretization | negative eigenvalues |
|---|---|
| GL-40 on [80,92] | -2.47e-57 |
| GL-90 on [0,70] | -7.9e-84 |
| GL-110 on [0,100] | -5.0138e-57, -8.1e-104 |
| GL-150 on [0,120] | -5.0139e-57, -4.6460e-77 |
| GL-260 on [0,200] | -5.0139e-57, -4.6460e-77, -3.76e-113, -3.81e-119, -2.6e-262 |

The first four are stable and match the four off-line quartets below 200, one negative eigenvalue
each, as the factorization of `g-odd-sign-factor` predicts. `log10|lambda^-| = -56.3, -76.3,
-112.4, -118.4` against `-pi gamma/(2 ln 10) = -58.5, -77.9, -113.6, -120.5`. The fifth value
(`-2.6e-262`) is unresolved: a window-truncated image of an off-line zero above 200 or a
discretization effect.

Relative depth of the first DH failure: `5.0e-57 / 2.6e-2 = 1.9e-55`. An adversarial eigensolve of
the DH operator in fewer than 56 digits reports it positive.

## 5. Heat control (MEASURED, mpmath 60 digits, non-interval)

One-node sign for `kappa_tau`, `0 < t <= 60`:

| tau | wrong-sign windows in t | min R |
|---|---|---|
| 0 | none | 3.7e-7 (at t -> 0) |
| -0.5 ... -1.8 (window [47,51]) | none | 0.22 ... 0.27 |
| -2 | [49.5, 49.95] | -28.6 |
| -5 | [32.8,34.15], [43.05,44.35], [49.9,51.95] | -3.2 |
| -10 | three windows from 33.75 | -0.26 |
| -20 | [28.0,31.75], [37.15,40.65] | -0.27 |
| -40 | [34.05,41.2] | -0.036 |
| -80 | [49.4,56.95] | -0.0047 |

The zero pair `48.005, 49.774` collides between `tau = -1.8` and `-2` and leaves the line; a
single-frequency odd test then has negative energy. PR 56 section 5 proves (F), (G), (H) for every
real `tau`. So those inputs hold on a family in which target B is false for `tau <= -2` (measured)
and, by Rodgers-Tao `Lambda >= 0` plus the PR 56 equivalence, for every `tau < 0` (CLASSICAL plus
PROVED equivalence). Target B at `tau = 0` is a boundary statement with no margin in `tau`: this is
the flow-blindness wall in this coordinate. A proof must use an input that fails for every
`tau < 0`.

## 6. What this says to a proof attempt

1. Depth. A wrong-sign direction caused by an off-line zero at height `gamma` has Rayleigh quotient
   about `-e^{-pi gamma/2}` in the physical coordinate (MEASURED on four DH zeros). For zeta with
   `gamma > 3e12` that is below `10^{-2e12}` (ARGUED by extrapolation). No physical-coordinate
   numerics or relative estimate can see it. Consistent with eq48: no margin `theta < 1`.
2. Coordinate. In the spectral coordinate with the diagonal weight `f(t)f(s)` removed the same
   failure is `O(1)` (`R = -18.7`) and local in height. The odd-sector target, read there, is the
   classical statement that `xi(1/2 + i sqrt z)` is in the Laguerre-Polya class; its one-node case
   is a Laguerre-type inequality `f'^2 - f f'' + f f'/t >= 0`. The Mellin parity reduction does not
   lower the difficulty; it changes where the failure is visible.
3. Shape. Wrong-sign tests are high-frequency packets `sin(gamma x/2)` times a wide envelope
   (hundreds of sign changes, support `>> 2`). The measured positive structure (positive entries,
   `n-1` oscillation, positive low-order minors) lives at `x < 2` and at the first 7 to 10
   eigenvalues, and it is identical for DH. Low-oscillation structure cannot decide the sign.
4. Requirement. Any argument for `Delta_- <= 0` must (i) fail for `kappa_DH`, which is positive,
   even, convex in the Csordas sense and has positive odd entries, and (ii) fail for
   `e^{tau u^2/16} kappa` at every `tau < 0`. None of the inputs currently proved in PR 56 does
   either. The Euler product has not yet entered this lane.

## 7. Verdict and weakest steps

Verdict: precise obstruction. No counterexample to target B for theta; certified counterexamples
for DH; measured counterexamples for backward heat; the spectrum and extremal tests are reported.
No pivot was taken: the lane was a search and it completed.

Three weakest steps:

1. The eigenvalue tables are not interval-certified. Matrix entries are Arb balls, but `eigsy` runs
   on midpoints and the Nystrom truncation to `[0,T]` is controlled only by comparing two
   discretizations. The Arb `LDL^T` certifies node Grams, not the operator.
2. The DH packet energies and the minor counts carry no quadrature remainder bound. The certified
   DH statements are the one-node signs and the negative pivots; they rely on python-flint 0.9.0
   `acb_series` Hurwitz zeta. Convexity of `V_DH` is sampled, not proved.
3. The `e^{-pi gamma/2}` depth law is fitted to four DH zeros and extrapolated to zeta heights;
   the polynomial prefactor is not determined. The heat table is non-interval and the collision
   time is only bracketed in `(-2, -1.8)`.

## Files

All under `tmp/research-2026-11-16/push/g-odd-adversary/` (motherbox copy `~/rh-push/g-odd-adversary/`):
`lib.py nys.py scan1.py packet.py xspace.py tp.py heat.py heat2.py post.py`; outputs
`nys_*.json|log`, `scan1_xi.json|log`, `scan1_dh.json`, `tp.json|log`, `heat.json|log`,
`heat_bisect.json`. `packet.py` prints to stdout (reruns in under 100 s).
