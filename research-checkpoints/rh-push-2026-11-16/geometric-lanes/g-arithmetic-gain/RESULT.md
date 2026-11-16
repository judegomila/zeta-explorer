# g-arithmetic-gain: the PR 39 arithmetic gain, verified, pushed, and tested on Davenport-Heilbronn

Date: 2026-11-16. Scope: `tmp/research-2026-11-16/push/g-arithmetic-gain/` only. PR content read from
`refs/pr/39`, `refs/pr/56`, `refs/pr/27` (read-only). Nothing committed, pushed or posted. No RH claim.
Labels: PROVED (argument given here), CLASSICAL, MEASURED (float numerics, not interval-certified), OPEN.

## Verdict

**Precise obstruction, with four small proved statements.** The arithmetic gain of PR 39 is a local,
smoothed, pole-neutral Nyman-Beurling distance. It is correct as stated and its certified numbers reproduce.
It does not contain a prime sum with a sign: the gain is a squared correlation, nonnegative for every
Dirichlet series, and the Euler product is not used at any step. It cannot be made uniform in height in
cutoff or in coefficient size. It controls only the order-1 (diagonal) piece of targets A and B, and only
locally; the coupling block `B` and the odd-sector sign are all-order statements that finite sets of gain
certificates do not reach. On Davenport-Heilbronn (DH) the gain fails where it must (anchor at the off-line
zero) and behaves like an Euler-product L-function everywhere else at finite cutoff.

New facts established here:

1. **Two-jet formula (PROVED, checked to 11 digits).** The gain numerator is a point functional at the anchor.
2. **Coefficient-mass growth (PROVED from a CLASSICAL omega theorem).** Passing filters need unbounded
   coefficient mass along heights.
3. **Boundary-zero cost (PROVED).** A zero ON the critical line inside the kernel core forces a large residual
   unless `zeta*D` has slope at least about `3.6/d` there. The cost of the gain sits at on-line zeros.
4. **Finite-cutoff Euler-blindness (MEASURED).** On 161 anchors in `30 <= c <= 70`, pass counts for
   `L(s,chi_5)` (Euler product) and DH (none) differ by at most 4 anchors at every cutoff tested.
5. **Reach toward targets A/B (PROVED composition).** Gain certificates on the cells covering a lens give the
   order-1 complex Weil test at that point, nothing of higher order.

## 0. Plan: what is new against the atlas and the walls

- Atlas (PR 27) has no entry for the local arithmetic-gain / Nyman-Beurling filter of PR 39 (grep: no
  "Nyman", "Beurling", "gain"). Sections 9-11 treat Weil-type forms. No closed route is re-run.
- PR 39 already proves: the residual identity, the zero obstruction, the covering reduction "gain at every
  grid anchor <=> RH", the line-minimisation identity, the fixed-cutoff obstruction by discrete universality,
  and the remark that a zero forces a residual component. Those are verified here, not re-claimed.
- New here: items 1-5 above and a mean-value calibration (section 6).
- Walls. DH: section 5. Flow-blindness: nothing here is offered as a hypothesis implying RH. MV-CAP:
  section 6 quantifies it for this object. Verified height: every certified gain instance lies inside it.
- Siblings: `dh-separator` owns the lens lemma (order-1 Weil test); it is cited, not re-derived.
  `nyman-baez-duarte` works the global criterion; this note stays on the local PR 39 object.

## 1. The arithmetic gain, restated

Source: `cluster/ARITHMETIC_GAIN_BRIDGE.md`, `ARITHMETIC_GAIN_INEQUALITY.md`, `GROWING_ARITHMETIC_FILTER.md`
in `research-checkpoints/zeta-riblet-phase-budget-2026-11-02/` of PR 39.

Anchor `(d,c)`, `d>0`, `s_0 = 1/2 + d + ic`. Kernel `K_d(u) = 16 d^5 / (pi (d^2+u^2)^3)`, total mass 6.
Filter `D(s) = sum_{n<=N} a_n n^{-s}` with `D(1) = 0` (pole-neutral). Residual energy

    E_D(d,c) = int_R K_d(t-c) |1 - zeta(1/2+it) D(1/2+it)|^2 dt,      e_N(d,c) = inf_D E_D.

In disk coordinates `w = (s - s_0)/(s - 1/2 + d - ic)` (Cayley map of `Re s > 1/2` centred at `s_0`),
`kappa(w) = (1-w)^2`, `E_D = || kappa (zeta D - 1) ||_{H^2}^2`, `||kappa||^2 = 6`.

- **Gain (PR 39 eq. (3)-(6) of the inequality note).** For a correction `A`, `A(1)=0`:
  `E_{D + alpha A} = E - |C|^2/V + V |alpha - C/V|^2`, with
  `V = int K_d |zeta A|^2 > 0`, `C = int K_d conj(zeta A) (1 - zeta D)`.
  The gain is `|C|^2/V >= 0`. Sign: it is a square. There is no signed prime sum.
- **Where arithmetic enters.** Through the frequencies `log n` of the integer dilations `n^{-s}` and through
  `zeta` on the line. Primes are not distinguished from composites: each `n` adds one independent direction.
  The Euler product is not used.
- **Zero obstruction (eq. (1) of the growing-filter note).** A zero `1/2 + b + i gamma`, `b>0`, forces
  `E_D >= 64 d^5 b / ((b+d)^2 + (gamma-c)^2)^3` for every `D`.
- **Covering.** On cells `d/2 <= b <= d`, `|gamma-c| <= d/4` the right side is at least
  `64/(65/16)^3 = 262144/274625 > 15/16`. So "`e_N(d,c) < 15/16` for some `N` at every grid anchor
  `d = 2^{-j}`, `c = c_* + k d/2`" implies RH; conversely RH gives `e_N -> 0` at each anchor
  (Baez-Duarte, CLASSICAL). The target is `sum_n |g_n|^2/delta_n > 81/16` (eq. (5)).

## 2. Independent verification (PROVED algebra, MEASURED numbers)

Script `checks.py` (mpmath 20 digits for `zeta`, trapezoid step 1/64 on `|t-c| <= 60`, numpy least squares).
It shares no code with PR 39.

| PR 39 statement | PR 39 value | This check |
|---|---|---|
| Obstruction identity `(1-|a|^2)|1-a|^4 = 64 d^5 b/((b+d)^2+(gamma-c)^2)^3` | exact | 5 random cases agree to 1e-16 |
| Corner constant | 262144/274625 = 0.95455 > 15/16 | same |
| `E` at `(1/2, 62957/32)` for the stated dyadic `D` | [4.071953, 4.078670] | 4.075248 |
| `V` for the stated `A` | [22.751837, 22.923047] | 22.835436 |
| `C` | Re [-2.288154,-2.246144], Im [-8.410873,-8.366057] | -2.267114 - 8.388342 i |
| gain `|C|^2/V` | >= 3.273390 | 3.306444 |
| needed `E - 15/16` | <= 3.141170 | 3.137748 |
| energy after the best step | <= 0.805280 | 0.768804 |
| cutoff-2 optimum at `d=1/2` | > 3.9399 | 4.075248 |
| cutoff-3 optimum at `d=1/2` | <= 0.8593 (their filter) | 0.768804 (optimum) |

All PR 39 enclosures contain the independently computed values. The line-minimisation identity is elementary
and was re-derived. Both pole constraints hold exactly (`a_1 + a_2/2 = 0`, `b_1 + b_2/2 + 1 = 0`).

## 3. Proved statements

### 3.1 Two-jet formula (PROVED)

For `v` analytic in `Re s > 1/2` with `kappa v` in `H^2`:

    int_R K_d(t-c) v(1/2+it) dt = <kappa, kappa v> = 6 v(s_0) - 6 d v'(s_0) + 2 d^2 v''(s_0) =: ell(v).

Proof. `<kappa, phi> = phi_0 - 2 phi_1 + phi_2` (Taylor coefficients at `w=0`). With `phi = kappa v`:
`phi_0 = v_0`, `phi_1 = v_1 - 2 v_0`, `phi_2 = v_2 - 2 v_1 + v_0`, so the sum is `6 v_0 - 4 v_1 + v_2`.
Since `s = s_0 + 2d w/(1-w)`, `v_1 = 2d v'(s_0)`, `v_2 = 2d v'(s_0) + 2 d^2 v''(s_0)`. Equivalently: the
residue of the third-order pole of `K_d` at `t = c - i d`. Check: `v = zeta(s)(2^{-s} - 1/2)` at
`(1/2, 62957/32)`: quadrature `2.38821897089 - 8.65102758544 i`, closed form `2.38821897085 - 8.65102758544 i`.

Consequences (PROVED):

- `E_D = 6 - 2 Re ell(zeta D) + int K_d |zeta D|^2`.
- `e_N(d,c) = 6 - sup_D |ell(zeta D)|^2 / int K_d |zeta D|^2`.
- The anchor passes iff some pole-neutral `D` has `|ell(zeta D)|^2 > (81/16) int K_d |zeta D|^2`.

So the gain is the squared norm of one two-jet evaluation at `s_0` (interior point, `Re s_0 = 1/2 + d`),
measured against a local second moment of `zeta D` on the critical line with window width about `d`.
The numerator needs no integral. The denominator is a short-window twisted second moment: window width
`d <= 1/2` at height `c`. No mean-value theorem covers such a window (MV-CAP).

### 3.2 Several zeros (PROVED lower bound; equality CLASSICAL for real dilations)

Let `a_1..a_m` be disk coordinates of distinct simple zeros with `Re s > 1/2`. Every `kappa zeta D` vanishes
at each `a_j`, so with `Gamma_{jk} = 1/(1 - conj(a_k) a_j)` and `v_j = kappa(a_j)`:

    e_N(d,c) >= v^* Gamma^{-1} v      for every N.

This is the norm of the projection of `kappa` on the span of the reproducing kernels at the `a_j`; `m=1`
is PR 39's obstruction. If all real dilations `r^{-s}` are allowed, Beurling-Lax gives equality in the limit
with the full Blaschke product (CLASSICAL, not re-proved). For integer dilations equality without RH is not
claimed. Consequence: an off-line zero at height `gamma` is felt at every anchor with weight of order
`d^5 b / |gamma - c|^6`. The gain deficit is polynomially, not compactly, localised in height.

### 3.3 Coefficient-mass growth (PROVED, given a CLASSICAL omega theorem)

Let `E_D(d,c) = eps^2 < 15/16`. Hardy evaluation gives `|H_D(w)| <= eps (1-|w|^2)^{-1/2}`. At
`s = s_0 + i d u` one has `w = iu/(2+iu)`, `1 - |w|^2 = |1-w|^2 = 4/(4+u^2)`, hence

    |zeta(s) D(s) - 1| <= eps (4+u^2)^{3/2} / 8.

For `|u| <= 1/4` the right side is at most `sqrt(15/16) (65/16)^{3/2}/8 = 0.99103`. With `sigma = 1/2 + d`:

    sum_n |a_n| n^{-sigma} >= |D(s)| >= delta_0 / |zeta(sigma + it)|,   delta_0 = 0.00897,  |t - c| <= d/4.

The grid spacing is `d/2`, so every `t` is within `d/4` of an anchor. Montgomery (1977, Thm 1, unconditional,
CLASSICAL, constant not rechecked): for `1/2 < sigma < 1` there are `t <= T` with
`log |zeta(sigma+it)| <= -c_sigma (log T)^{1-sigma} (log log T)^{-sigma}`. Therefore:

**Proposition.** Fix `d` in `{1/4, 1/8, ...}`. If filters `D_c` pass at every anchor of scale `d` up to height
`T`, then `max_c sum_n |a_n(c)| n^{-1/2-d} >= delta_0 exp(c_sigma (log T)^{1/2-d} (log log T)^{-1/2-d})`.
If also `|a_n| <= A`, then `N >= ((1/2-d) delta_0 / A)^{1/(1/2-d)} exp(c_sigma (log T)^{1/2-d} / ((1/2-d)(log log T)^{1/2+d}))`.
For `d = 1/2` the same argument with `1/|zeta(1+it)| = Omega(log log t)` gives unbounded mass.

This is a quantitative form of PR 39's universality obstruction, by a different argument. No height-uniform
bound on cutoff or on coefficient mass exists.

### 3.4 Boundary-zero cost (PROVED)

Let `zeta(1/2 + i gamma) = 0` (a zero ON the line), `g(t) = zeta D(1/2+it)`, and
`Lam = sup_{|t-gamma| <= r} |g'(t)|`. With `r' = min(r, 1/Lam)`:

    E_D(d,c) >= int_{|t-gamma| <= r'} K_d(t-c) (1 - Lam |t-gamma|)^2 dt
             >= (2/(3 Lam)) min_{|t-gamma| <= 1/Lam} K_d(t-c)        when r >= 1/Lam.

Proof: `g(gamma) = 0`, so `|g(t)| <= Lam |t-gamma|` and `|1-g| >= 1 - Lam|t-gamma|` there. For `gamma = c`
and `1/Lam << d` this reads `E_D >~ 32/(3 pi d Lam)`, so passing needs `Lam >~ 3.62/d`: `zeta D` must rise from
0 to order 1 within distance about `d/3.6` of each on-line zero in the kernel core. As `E_D -> 0`, `Lam -> infinity`.

Meaning: off-line zeros block convergence, but on-line zeros set the price of each anchor. The kernel core
`|t-c| <~ 0.3 d` contains about `0.3 d log(c)/pi` on-line zeros, which grows with height. The framework has no
term that rewards a zero for being on the line.

Measurement consistent with this (`ctl_run.log`, `scan_run.log`): `zeta` at `(1/2, 500.125)` (zero at 500.309)
has `e_16 = 2.62`; at `(1/2, 48.0)` (zero at 48.005) `e_48 = 3.64`. Both cells are zero-free by verified
height; the anchors fail at these cutoffs only because of the on-line zero.

## 4. Does the gain bound target A (coupling block) or target B (odd sector)?

Target A (PR 56): `||D^{-1/2} B E^{-1/2}|| <= 1`, i.e. the Schur complement of the full bridge form.
Target B: `Delta_- <= 0` on all odd tests. By `eq48/RESULT.md` the residual form equals the Weil functional
on one-sided tests, and positivity on any fixed interval of real nodes is already RH (condition `b_I`).
PR 56 itself records that positivity of either complete Mellin parity sector is RH-equivalent.

- **What the gain gives (PROVED composition).** A passing certificate at `(d,c)` excludes zeros in the cell
  `d/2 <= b <= d`, `|gamma - c| <= d/4`. By the sibling lens lemma (`dh-separator`, item 2), the order-1
  complex test `Q(e^{-zt}) = Re L(z)/Re z`, `z = x + it`, is `>= 0` once the lens
  `{b > x, (gamma - t)^2 < b^2 - x^2}` is zero-free. The lens lies in `x < b <= 1/2`, `|gamma - t| < 1/2`,
  which is covered by finitely many cells per dyadic scale `d >= x`. So: gain certificates on those finitely
  many anchors imply the order-1 test at `z`. In the notation of `ARITHMETIC_GAIN_BRIDGE.md` (11) this is the
  sign of the diagonal `K_eta(q,q)` (integrate `Re xi'/xi` along the horizontal segment), locally.
- **What it does not give.** Orders `>= 2` with real nodes. An off-line zero at any height makes some
  finite real-node test negative on any node interval (eq48, PR 50 Prop. 5). Gain certificates on a bounded
  set of anchors say nothing about zeros elsewhere, so they bound neither `||T||` nor the odd-sector form.
  Gain at all anchors is RH, which is both targets. There is no intermediate inequality: the gain is a
  Hardy-space distance (linear in the zero set through a Blaschke product), the targets are quadratic forms
  with rank-one positive pieces per on-line zero and indefinite infinite-rank pieces per off-line pair.
- **DH illustration (MEASURED).** DH passes the gain at 83 of 161 anchors in `30 <= c <= 70` (`d=1/2`,
  `N=48`) and 114 of 161 at `d=1/4`, the same as `L(s,chi_5)`, while its all-order form is negative by the
  zero at height 85.7 (eq48 argument applied to DH; not re-verified here).

Answer: the arithmetic gain bounds the order-1 diagonal locally. It does not bound the coupling block `B`
or the odd-sector form.

## 5. Davenport-Heilbronn control

`f(s) = 5^{-s}[zeta(s,1/5) + tau zeta(s,2/5) - tau zeta(s,3/5) - zeta(s,4/5)]`,
`tau = (sqrt(10-2 sqrt5) - 2)/(sqrt5 - 1)`. Zero re-located at `0.808517182456637 + 85.699348485377592 i`
(residual 3.8e-21). No pole, so no pole-neutral constraint; basis `n^{-s}`, `n <= N`. Scripts `dh_run.py`,
`ctl_run.py`, `scan_run.py`.

| Anchor | Function | `e_N`: N=4 | N=16 | N=64 | Lower bound for all N |
|---|---|---|---|---|---|
| `(1/2, 85.6993)` | DH | 3.116 | 2.997 | 2.952 | 2.209 (PROVED from the zero) |
| `(1/2, 85.6993)` | zeta | 0.139 | 0.092 | 0.073 | none known |
| `(1/4, 85.6993)` | DH | 0.924 | 0.881 | 0.861 | 0.635 |
| `(1/4, 85.6993)` | zeta | 0.0079 | 0.0056 | 0.0041 | none known |
| `(1/2, 85.6993)` | L(s,chi_5) | 3.799 | 3.570 | 3.298 | none known (on-line zero nearby) |

- **The gain fails for DH where it must.** At the anchor whose cell contains the off-line zero, `e_N >= 2.209`
  for every cutoff, above `15/16`. The measured values decrease to 2.95 and stay above the bound.
- **No step of the framework uses the Euler product.** The residual identity, the obstruction, the covering
  and the line minimisation hold for any Dirichlet series of finite order. The framework is a criterion, and
  it reports DH correctly. A proof would need a lower bound on `sum |g_n|^2/delta_n` at every anchor; that
  bound must fail for DH at the height-85.7 anchor, so it must use `Lambda(n) >= 0`, multiplicativity or Hecke
  structure. None is in PR 39 and none is supplied here.
- **Finite cutoff does not see the Euler product (MEASURED).** Scan of 161 anchors `c = 30, 30.25, ..., 70`:

| Function | d | pass at N=4 | N=16 | N=48 | median `e_48` |
|---|---|---|---|---|---|
| zeta | 1/2 | 103 | 108 | 110 | 0.259 |
| L(s,chi_5), Euler product | 1/2 | 67 | 76 | 82 | 0.933 |
| DH, no Euler product | 1/2 | 71 | 79 | 83 | 0.877 |
| zeta | 1/4 | 132 | 132 | 133 | 0.020 |
| L(s,chi_5) | 1/4 | 111 | 113 | 114 | 0.148 |
| DH | 1/4 | 112 | 113 | 114 | 0.137 |

  `L(s,chi_5)` and DH have the same conductor, gamma factor and line-zero density; their pass counts differ
  by at most 4 and their medians by under 10 percent. The zeta/conductor-5 difference is zero density, not
  Euler structure. Failing anchors are those with an on-line zero in the kernel core (section 3.4).
  An earlier reading of the `c=40` DH row as an Euler effect was wrong and is withdrawn: `L(s,chi_5)` shows
  the same behaviour at other anchors.

## 6. Can the gain be made uniform in height?

- Threshold: yes, `15/16` is height-free (PR 39).
- Cutoff: no. PR 39 (discrete universality) and section 3.3 (coefficient mass, quantitative).
- Per-anchor cost: grows with the number of on-line zeros in the core, about `0.3 d log(c)/pi` (section 3.4).
- Mean-value calibration (CLASSICAL inputs, family-specific, not a lower bound for all filters). For one
  height-independent `D = lambda M`, `M` the Selberg mollifier of length `T^theta` (`P(x)=x`), averaging over
  `c in [T,2T]` gives `mean_c E_D = 6 mean_t |1 - lambda zeta M|^2 -> 6 (1 - 2 lambda + lambda^2 (1 + 1/theta))`,
  minimised at `lambda = theta/(1+theta)` with value `6/(1+theta)`. This is 4 at `theta = 1/2` and 3.82 at
  `theta = 4/7`. Reaching `15/16` on average would need `theta > 27/5`. Mean-value theorems (`theta < 1`)
  cannot bring even the average residual of this family under the threshold, and an average is not an
  every-anchor statement.
- A height-uniform proof for scales `d <= 1/2` is RH (PR 39). For larger `d`, where the excluded cell is
  already zero-free classically, a pass is still not implied: by 3.2 every off-line zero in the strip
  contributes, so passing at large `d` is a quantitative statement about all strip zeros near height `c`. OPEN.

## 7. What the gain would need to close a target

A non-circular lower bound, at every anchor, of the form

    sup_{D(1)=0} |ell_{s_0}(zeta D)|^2 / int K_d |zeta D|^2  >  81/16,

with these properties forced by the results above:

1. It must use the Euler product in the denominator (the short-window twisted second moment); the numerator
   is a point value and is available from the Dirichlet series only for `d > 1/2`.
2. It must allow cutoff and coefficient mass to grow at least as in 3.3.
3. It must pay the on-line-zero cost of 3.4 at about `0.3 d log(c)/pi` zeros per anchor.
4. It must fail for DH at `(1/2, 85.6993)`.
5. Even then it yields RH directly by covering, not through block `B` or the odd sector.

No known input meets item 1 on windows of width `d <= 1/2`. The 2026 zero-free half-plane `Re s > 7/8`
only removes the cells with `b > 3/8`; it gives no gain bound.

## 8. Three weakest steps

1. Section 5 scan and tables are float numerics (mpmath values, trapezoid, least squares with `rcond 1e-13`;
   coefficients reach 1e10 at `N >= 48`, so those `e_N` are upper estimates of the optimum with uncontrolled
   conditioning error). The window is `[-10, 110]` for anchors up to 70; tails are not bounded rigorously.
   "Euler-blind at finite cutoff" is MEASURED on one height range and two conductor-5 functions.
2. Section 3.3 uses Montgomery's omega theorem with its constant not rechecked, and the `d = 1/2` case uses
   the classical `Omega(log log t)` for `1/zeta(1+it)`; the grid-to-point step costs the small constant
   `delta_0 = 0.00897`.
3. Section 3.2 equality and the section 6 mollifier asymptotics are quoted (Beurling-Lax; Levinson-Conrey
   `1 + 1/theta`), not re-proved, and the `6/(1+theta)` value is for one filter family. The on-line-zero count
   per core in 3.4 is a density heuristic; only the displayed inequality is proved.

## Files

- `checks.py` (section 2), `gain.py` (shared routines), `dh_run.py`, `ctl_run.py`, `ctl_run_fn.py`,
  `scan_run.py`; logs `dh_run.log`, `ctl_run.log`, `scan_run.log`; data `dh_out.json`, `scan_out.json`,
  `scan_vals.npy`.
- `src/` holds read-only copies of the PR 39 notes that were read.
