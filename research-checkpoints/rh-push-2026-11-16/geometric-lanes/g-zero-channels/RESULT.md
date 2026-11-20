# g-zero-channels: zero channels, wall heights and Newton guidance (PR 57 lane)

Date: 2026-11-16. Nothing here proves or refutes RH. Labels: PROVED / CLASSICAL / MEASURED / CERTIFIED (Arb ball arithmetic plus the analytic tail bound of section 3.1) / OPEN.

## Verdict

**Partial result plus a precise obstruction.**

1. CERTIFIED: for each of the first 100 zeros of xi there is a moving disk channel in `(tau, s)` space that contains exactly one zero of `F_tau = exp((tau/4) d_s^2) xi` for every real `tau` in `[-0.1, 0.5]`. The 100 channels are pairwise disjoint and each is a chain of 12 overlapping cells. 1200 of 1200 cells pass, with 0 failures in the exact rational chain and disjointness checks. This extends PR 57 (one theta disk, `|tau| <= 0.05`) to 100 zeros and the full forward interval. It restates verified height and is not new zero information.
2. PROVED (elementary): the wall-height law `d/dtau log|W_k| = (1/4) sum_j (c_k - gamma_j)^(-2)` for the critical values `W_k` of `F_tau` on the line, and the normalised form `d/dtau log(|W_k|/g_k^2) = S_k + R_k >= 0`. Walls between adjacent channels rise monotonically in forward time. The normalised wall stays finite and nonzero through a collision.
3. OBSTRUCTION: the Newton-basin channel assignment is canonical and no-escape holds automatically, but it uses no arithmetic. The Davenport-Heilbronn function has the same structure. Its first off-line pair reaches the line at `tau* = 0.1765` (MEASURED), after which DH carries one-zero channels with radii comparable to zeta's. Channel existence on `[eps, 1/2]` does not separate zeta from DH; only the limit `tau -> 0` does, and that limit is the statement `Lambda <= 0`.

## 0. Plan: what is new against the atlas and the walls

Atlas (PR 27 section 5) already closes: phase paths in a fixed field, the determinant sign argument, the conditional adjacent-gap certificate `y' = 8 - 4Sy`, and the local collision index. None of these is re-run. This lane adds:

- the ODE for the walls (critical points and critical values), which the atlas does not have, and its coupling to the zero ODE;
- a decision on Newton basins as channels, with the DH control;
- a certificate method whose cost and margin are stated as functions of height, and the 100-zero table.

Walls respected: the forward barrier is flow-stable and so cannot give RH (flow-blindness); the certificate is a finite-height statement (verified-height wall); the equivalence in section 1.4 is the PR 38 vortex-trapping statement and is equivalent to the Weil form by eq48.

## 1. The exact ODE system

Coordinates: `s = 1/2 + iy`, `X_tau(y) := F_tau(1/2 + iy)`, real and even in `y`, with `d_tau F = (1/4) F_ss`, so `d_tau X = -(1/4) X_yy`. `F_0 = xi`. Polymath's `H_t(z)` has `z = 2y`, `t = tau`.

### 1.1 Zeros (CLASSICAL: de Bruijn; Csordas-Smith-Varga 1994 Lemma 2.4; Polymath Prop. 3.1)

At a simple zero `rho_k(tau)`: `rho_k' = -F_ss/(4 F_s)(rho_k) = -(1/2) sum'_{j != k} 1/(rho_k - rho_j)`, the sum taken symmetrically. On the line: `gamma_k' = (1/2) sum'_{j != k} 1/(gamma_k - gamma_j)`.

### 1.2 Walls (PROVED; follows because `F_s` solves the same heat equation)

Let `c_k(tau)` be a simple zero of `F_s` (a critical point; on the line, `y = c_k` between `gamma_k` and `gamma_(k+1)`). Then

    c_k' = -F_sss/(4 F_ss)(c_k) = -(1/2) sum'_{j != k} 1/(c_k - c_j)      (sum over critical points)

The zero and wall systems are coupled by two exact relations:

    gamma_k' = (1/4) sum_j 1/(gamma_k - c_j)        (all critical points, no exclusion; this is (log X_y)'(gamma_k)/4)
    0        = sum_j 1/(c_k - gamma_j)              (each wall sits at the electrostatic equilibrium of the zeros)

Proof. `X(gamma_k(tau), tau) = 0` gives `gamma_k' = -d_tau X / X_y = X_yy/(4 X_y)` at `gamma_k`, and `X_yy/X_y` is the logarithmic derivative of `X_y` (entire, order 1, odd). The second line is `X_y/X = 0` at `c_k`.

### 1.3 Wall-height law (PROVED)

Define the wall height `W_k(tau) := F_tau(c_k(tau))`.

**Lemma 1.** If `c(tau)` is a simple zero of `F_s` with `F_tau(c) != 0`, then

    d/dtau log W = F_ss/(4F)(c) = -(1/4) sum_rho (c - rho)^(-2),

the sum over all zeros of `F_tau` with multiplicity, absolutely convergent. If all zeros are on the line this is `(1/4) sum_j (c - gamma_j)^(-2) > 0`.

Proof. `dW/dtau = d_tau F + F_s c' = (1/4) F_ss(c)` since `F_s(c) = 0`. `F_tau` is entire of order 1, since `|F_tau(s)| <= 8 int e^(tau u^2) Phi(u) cosh(2u|s - 1/2|) du` and `Phi` decays like `exp(-pi e^(4u))`. Hadamard gives `(F_s/F)' = -sum_rho (s - rho)^(-2)`. Also `F_ss/F = (F_s/F)' + (F_s/F)^2` and the square vanishes at `c`. On the line `c - rho = i(y_c - gamma)`. QED.

Numerical check (MEASURED, `wall_law.py`, 400 zeros plus a density tail): at four critical points of xi the two sides agree to 7 digits, for example `0.264608510` against `0.264608283` at `y_c = 22.0980`.

**Corollary 2 (forward barrier, quantitative).** While all zeros are real, with `a = c_k - gamma_k`, `b = gamma_(k+1) - c_k`, `g_k = a + b`:

    d/dtau log|W_k| >= (1/4)(1/a^2 + 1/b^2) >= 2/g_k^2 .

Each wall height is strictly increasing in forward time, so `gamma_k(tau)` stays in `(c_(k-1)(tau), c_k(tau))`. This is de Bruijn's forward preservation of real zeros with an explicit rate. It is stable under the flow and therefore cannot prove RH.

**Corollary 3 (which zeros lower a wall).** A zero at `1/2 + beta + i gamma` contributes `(1/4)((y_c - gamma)^2 - beta^2)/((y_c - gamma)^2 + beta^2)^2`. It lowers the wall exactly when `|y_c - gamma| < |beta|`, that is, when the wall lies inside the 45-degree cone of the off-line zero.

**Lemma 3 (normalised wall, PROVED).** Let `q_k = g_k^2`. PR 57 gives `q_k' = 2 - q_k S_k` with `S_k = sum_{j != k,k+1} 1/((gamma_k - gamma_j)(gamma_(k+1) - gamma_j))`. With Lemma 1,

    d/dtau log(|W_k|/q_k) = S_k + R_k,   R_k = (1/4)(1/a^2 + 1/b^2 - 8/g_k^2) + (1/4) sum_{j != k,k+1} (c_k - gamma_j)^(-2).

While all zeros are real, `S_k >= 0` and `R_k >= 0`, so `|W_k|/g_k^2` is nondecreasing. The singular terms `2/q` cancel, so `W_k/q_k` is analytic and nonzero through a collision of the pair `(k, k+1)`: there `W ~ C(tau - tau*)` and `q ~ 2(tau - tau*)`. Lattice check: `X = cos(kappa y)` gives `S + R = kappa^2/4`, which equals `d/dtau log W` exactly.

Consequence: the collision is carried entirely by the sign of `W_k`. `W_k/q_k` (essentially `X_yy(c_k)/8`) does not see it. So `W_k/q_k` is a Lyapunov function on the real phase but is not a barrier.

### 1.4 The uniform statement (CLASSICAL assembly; matches PR 38)

The following are equivalent:

- (i) RH;
- (ii) for every `eps` in `(0, 1/2)` there are pairwise disjoint tubes in `[eps, 1/2] x C`, symmetric under `s -> 1 - conj(s)`, each containing exactly one zero of `F_tau` for each `tau`, and together containing all zeros;
- (iii) `W_k(tau) != 0` for all `k` and all `tau` in `(0, 1/2]`;
- (iv) the wall action `A_k(eps) = int_eps^(1/2) (1/4) sum_j (c_k - gamma_j)^(-2) dtau` is finite for every `k` and `eps > 0`.

Proof sketch. (ii) forces real zeros for `tau >= eps`, so `Lambda <= eps` for all `eps`, so `Lambda <= 0`, which is RH. Conversely `Lambda = 0` gives real simple zeros for `tau > 0` (CSV), and the Newton-basin tubes of section 2 serve. (iii) and (iv) restate this by Lemma 1: `log|W_k(eps)| = log|W_k(1/2)| - A_k(eps)`. Tubes may pinch at `tau = 0`; closing them at `tau = 0` adds simplicity of the zeros.

By eq48 this is the same target as the Weil form. No margin version exists: Lemma 3 shows relative wall height is unbounded below at close pairs.

## 2. Newton flow: canonical assignment, and why it carries no arithmetic

**Proposition 4 (PROVED, elementary).** Let `X_tau` have only real simple zeros. The Newton flow `dy/dl = -X/X_y` on the line has basin `(c_(k-1), c_k)` for `gamma_k`. The channel family `{(tau, y): c_(k-1)(tau) < y < c_k(tau)}` is canonical, covers the line minus the walls, and `gamma_k` leaves its channel at `tau*` if and only if `W_k(tau*) = 0` or `W_(k-1)(tau*) = 0`, that is, at a double zero.

Proof. On `(gamma_k, c_k)`, `X` and `X_y` have equal sign, so the flow moves toward `gamma_k`; the same holds on the other side. A zero meets a wall exactly when `X = X_y = 0`.

**Proposition 5 (CLASSICAL in content: Neuberger-Feiler-Maier-Schleich, New J. Phys. 2014 and Phys. Scr. 2015; proof sketch here).** The critical line is invariant under the Newton flow of `F_tau`, because `F` is real and `F_s` is imaginary on the line. Hence:

- a zero on the line receives Newton lines from the right half-plane over a phase window of length exactly `pi`, bounded by the two separatrices `Im F = 0` through `c_(k-1)` and `c_k`;
- an off-line zero with `Re s > 1/2` receives a window of length `2 pi` from the right, and its mirror receives none.

So RH with simple zeros is equivalent to: every curve `Im xi = 0` entering from `Re s = +infinity` ends at a critical point on the line and not at a zero.

**Decision on task (2).** The assignment exists and is canonical. No-escape under the heat flow is automatic (index conservation; atlas section 5). The assignment does not pin a zero to the line: an off-line pair has two well-defined, non-symmetric basins. The only input from `Re s > 1` is that the Dirichlet series tends to 1, which fixes the phase at infinity. DH has that property too. A no-escape property "from an arithmetic input" would have to exclude a `2 pi` window, and nothing in the Newton structure uses `Lambda(n) >= 0` or multiplicativity. **Dead as a proof mechanism; it remains valid as a coordinate system.**

## 3. Certified channels for the first 100 zeros

### 3.1 Method (replaces the PR 57 global perturbation bound)

For an exact rational centre `c = 1/2 + iy` and `a_j` the Taylor coefficients of xi at `c` (Arb `acb_series`, 1500 bits, `J = 240`):

    F_tau(c + h) = sum_{2m+n < J} a_(n+2m) (n+2m)!/(n! m! 4^m) tau^m h^n + tail =: sum_n b_n(tau) h^n + tail.

Tail (PROVED). `|F^(j)(c)| <= 8 int Phi(u)(2u)^j du` on the line, and `Phi(u) <= 2 pi^2 K0 e^(-pi) e^(-8 pi u^2)` with `K0 = sum n^4 e^(-pi(n^2-1))`, using `e^(4u) >= 1 + 4u + 8u^2` and `9 < 4 pi`. Splitting the `u`-integral at `U = 5`, for `|tau| <= 2`, `|h| <= 4`:

    |tail| <= 16 pi^2 K0 e^(-pi) [ e^(2U^2 + 8U) U^(-J) Gamma((J+1)/2) / (2 (8 pi)^((J+1)/2)) + e^(-21 U^2)/(42 U) ] = 8.4e-100   (J = 240).

Cell test. On a cell `[t0 - w, t0 + w]`, `b_n(tau)` lies in `b_n(t0) + [-w, w] (n+2)(n+1)/4 |b_(n+2)(cell)|` (heat equation for the truncated coefficients, exact). If `|b_0| + sum_{n>=2} |b_n| r^n + tail < |b_1| r` with upper and lower ball bounds over the cell, then `D(c, r)` contains exactly one zero for every `tau` in the cell, and by reflection that zero is on the line. Centres come from a floating Newton step and are not trusted.

Chain and disjointness (exact rationals, `post.py`): the zero in cell `i` lies in `D(c_i, r_in,i)`, and `|c_i - c_(i+1)| + r_in,i < R_(i+1)` in both directions, so adjacent cells hold the same zero. Channel radii `R <= 0.49 x` (distance to the neighbouring centres) give disjoint tubes.

Scope. Each tube carries exactly one zero. The certificate does not count zeros between tubes; at `tau = 0` that count is classical, and for `tau != 0` it is not certified here.

### 3.2 Result

- Run `main`: zeros 1..100, `tau` in `[-1/10, 1/2]`, 12 cells of width 0.05, 1200/1200 cells certified, chain and disjointness failures 0. About 1 CPU-second per cell. Motherbox, 4 processes, 5 minutes.
- Run `back`: cells of width 0.05 from 0 down to -2, stopped at the first failed cell or chain break.

Files: `channels.py`, `post.py`, `post_back.py`, `main_*.json`, `back_*.json`, `table.json`, `table_full.txt` (all 100 rows), `post_back_out.txt`.

Columns: `g` = distance to nearest neighbour; `g/mean` with mean spacing `2 pi/log(gamma/2 pi)`; `|F_s|` = certified lower bound of `|b_1|` on the cell `[0, 0.05]`; `mu` = best relative Rouche margin `1 - (|b_0| + sum |b_n| r^n + tail)/(|b_1| r)`; `r_max` = largest certified radius; `abs` = best absolute margin; `delta_PR57` = `abs / 0.0057429`, the largest heat interval the PR 57 fixed-disk method can reach, since its perturbation bound is at least `delta x 8 int u^2 Phi = delta x xi''(1/2)/4`; `reach` = certified backward extent of the channel.

| k | gamma | g | g/mean | abs F_s | mu at 0 | min mu on [-0.1,0.5] | r_max | r_max/g | abs margin | delta_PR57 | reach | d gamma/d tau |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 14.1275 | 6.885 | 0.89 | 1.38e-03 | 0.868 | 0.868 | 1.187 | 0.17 | 4.93e-04 | 8.6e-02 | <= -2.0 | -0.289 |
| 2 | 21.0126 | 3.991 | 0.77 | 1.77e-05 | 0.827 | 0.826 | 0.981 | 0.25 | 4.81e-06 | 8.4e-04 | <= -2.0 | -0.376 |
| 3 | 25.0035 | 3.991 | 0.88 | 1.27e-06 | 0.867 | 0.866 | 1.305 | 0.33 | 4.64e-07 | 8.1e-05 | <= -2.0 | -0.294 |
| 5 | 32.9292 | 2.516 | 0.66 | 4.11e-09 | 0.894 | 0.889 | 1.305 | 0.52 | 1.79e-09 | 3.1e-07 | <= -2.0 | -0.239 |
| 10 | 49.7685 | 1.778 | 0.59 | 1.57e-14 | 0.898 | 0.887 | 1.079 | 0.61 | 5.84e-15 | 1.0e-12 | -1.85 | -0.229 |
| 20 | 77.1391 | 1.451 | 0.58 | 1.60e-23 | 0.886 | 0.870 | 0.892 | 0.61 | 4.98e-24 | 8.7e-22 | -1.25 | -0.253 |
| 30 | 101.3071 | 2.405 | 1.06 | 3.20e-31 | 0.804 | 0.804 | 0.892 | 0.37 | 8.00e-32 | 1.4e-29 | <= -2.0 | -0.427 |
| 34 | 111.0051 | 0.870 | 0.40 | 9.24e-35 | 0.535 | 0.484 | 0.378 | 0.43 | 7.88e-36 | 1.4e-33 | -0.30 | -0.850 |
| 40 | 122.9359 | 1.321 | 0.63 | 9.34e-39 | 0.793 | 0.789 | 0.670 | 0.51 | 2.02e-39 | 3.5e-37 | -1.10 | -0.419 |
| 50 | 143.1062 | 1.987 | 0.99 | 3.83e-45 | 0.892 | 0.882 | 0.981 | 0.49 | 1.31e-45 | 2.3e-43 | <= -2.0 | -0.236 |
| 60 | 163.0234 | 1.844 | 0.96 | 8.50e-52 | 0.861 | 0.852 | 0.892 | 0.48 | 2.52e-52 | 4.4e-50 | <= -2.0 | -0.304 |
| 70 | 182.1975 | 2.286 | 1.23 | 3.64e-58 | 0.823 | 0.821 | 0.892 | 0.39 | 9.82e-59 | 1.7e-56 | <= -2.0 | -0.386 |
| 71 | 184.8474 | 0.752 | 0.40 | 1.40e-59 | 0.486 | 0.404 | 0.344 | 0.46 | 1.02e-60 | 1.8e-58 | -0.20 | -0.895 |
| 80 | 201.2450 | 1.240 | 0.68 | 9.23e-65 | 0.630 | 0.615 | 0.458 | 0.37 | 1.09e-65 | 1.9e-63 | -0.90 | -0.733 |
| 90 | 219.0504 | 1.642 | 0.93 | 1.11e-70 | 0.679 | 0.673 | 0.554 | 0.34 | 1.56e-71 | 2.7e-69 | <= -2.0 | -0.658 |
| 91 | 220.6929 | 0.744 | 0.42 | 1.15e-71 | 0.595 | 0.521 | 0.458 | 0.62 | 1.25e-72 | 2.2e-70 | -0.25 | -0.714 |
| 97 | 231.2272 | 0.763 | 0.44 | 3.17e-75 | 0.572 | 0.502 | 0.416 | 0.54 | 3.15e-76 | 5.5e-74 | -0.25 | -0.753 |
| 99 | 233.6906 | 1.700 | 0.98 | 1.31e-75 | 0.941 | 0.918 | 0.981 | 0.58 | 4.95e-76 | 8.6e-74 | <= -2.0 | -0.136 |
| 100 | 236.5060 | (2.815) | - | 1.37e-76 | 0.659 | 0.646 | 0.503 | - | 1.80e-77 | 3.1e-75 | -0.95 | -0.679 |

Zero 100 has no upper neighbour in the run, so its `g` is one-sided.

Block summary:

| zeros | mean mu at 0 | min mu | mean r_max | mean r_max/g | mean d gamma/d tau | channels reaching tau = -2 | shortest reach |
|---|---|---|---|---|---|---|---|
| 1-25 | 0.831 | 0.674 | 0.947 | 0.43 | -0.364 | 17 | -1.10 |
| 26-50 | 0.819 | 0.484 | 0.802 | 0.52 | -0.384 | 13 | -0.30 |
| 51-75 | 0.796 | 0.404 | 0.716 | 0.53 | -0.399 | 10 | -0.20 |
| 76-100 | 0.801 | 0.502 | 0.695 | 0.56 | -0.384 | 9 | -0.25 |

### 3.3 Scaling with height (MEASURED from certified numbers)

- **Absolute margin** decays as `exp(-0.768 gamma)` (fit over 100 zeros; `pi/4 = 0.785` is the gamma-factor rate). Any bound that is uniform in height, such as the PR 57 perturbation integral `P`, is lost at once: `delta_PR57` is `8.6e-2` at zero 1 (PR 57 used 0.05), `8.4e-4` at zero 2, `3e-75` at zero 100. The PR 57 method certifies zero 1 only.
- **Relative margin** does not decay with height. Block means of `mu` are 0.83, 0.82, 0.80, 0.80. Regression of `min mu` on `log gamma` has slope -0.035. The minimum is set by close pairs: the five lowest values (0.40 to 0.56) are all at `g/mean <= 0.45`.
- **Certified radius** follows the mean spacing: `r_max/g` has block means 0.43 to 0.56, and `r_max` falls from 0.95 to 0.70 as the spacing falls.
- **Cost**: one jet per cell. The number of cells for `[0, 1/2]` is about `0.2/r`, since the mean drift is `d gamma/d tau = -0.38` (`-pi/8 = -0.393` asymptotically). Cells grow like `log gamma`, precision like `(pi/4) gamma log2(e)` bits, jet length like the bit count. This is polynomial in height and is a restatement of verified height.
- **Backward reach** scales as the squared gap. Of the 100 channels, 49 are certified down to `tau = -2`; the other 51 stop, mostly in neighbouring pairs, at `reach = c g^2` with `c` between 0.35 and 0.78 (median 0.58). The two-body value from `q' = 2 - qS`, `S >= 0`, is `c >= 1/2` for the collision time; the certificate stops one or two cells earlier. The shortest reach is -0.20 (pair 71/72, `g/mean = 0.40`). A uniform backward channel family over all heights cannot exist, in line with `Lambda >= 0` (Rodgers-Tao): reach is bounded by about `g^2`, and small normalised gaps (Lehmer pairs) occur at larger heights. The unconditional statement is `Lambda >= 0`; that normalised gaps have liminf 0 is conjectural.

## 4. Davenport-Heilbronn control (MEASURED; `dh_control.py`, `dh_margin.py`)

`xi_DH(s) = (pi/5)^(-s/2) Gamma((s+1)/2) f(s)`, same reflection symmetry (checked: ratio 1 to 20 digits), no Euler product. Jets by a 512-point Cauchy sum at 700 bits; no tail proof, hence MEASURED.

- The first off-line pair `0.8085 + 85.6993i` and its mirror move toward the line under the forward flow and collide at `tau* = 0.1765`. Near the collision `d(x^2)/dtau = -0.502` for the offset `x = Re s - 1/2`; the two-body value is `-1/2`.
- After the collision the wall between the two new real zeros is `W = C (tau - tau*)` with `C` from `0.99e-28` to `1.20e-28` over `tau - tau*` in `[0.002, 0.2]`. This is Lemma 1 with the `1/(tau - tau*)` singularity, and Lemma 3: `W/q` is regular.
- One-zero Rouche disks at the two new zeros have `r_max = 0.13/0.16` at `tau = 0.19`, `0.31/0.47` at `tau = 0.3`, `0.43/0.69` at `tau = 0.5`. These are the same size as zeta's at comparable spacing.

Which step fails for DH: none of Lemma 1, Corollary 2, Lemma 3, Propositions 4 and 5 or the certificate method uses the Euler product, and all of them hold for DH on the real phase `tau > tau*`. The only statement DH violates is the terminal one, `W_k != 0` down to `tau = 0`. The wall action of the pair diverges at `tau* = 0.1765 > 0`. For zeta the same quantity is finite at every height that has been verified, and nothing in this lane bounds it at unverified height. A proof would need an arithmetic lower bound for `|xi|` at critical points on the line relative to the cone condition of Corollary 3, and that is RH in the form "xi has no positive local minimum and no negative local maximum on the line".

## 5. Three weakest steps

1. **Completeness of the 100 channels.** The certificate shows one zero per tube. It does not show that no other zero of `F_tau` lies between the tubes for `tau != 0`. A boundary winding count on the complement is needed to close this and was not run.
2. **Trust base and novelty of the lemmas.** The certificate rests on python-flint 0.9.0 / Arb and the tail bound of section 3.1, which was derived here and not independently refereed. Lemma 1 and Lemma 3 are two-line consequences of the heat equation and Hadamard; they are absent from the atlas, but no literature search was run, so "new" is not claimed.
3. **Backward reach is a certificate limit, not a collision time.** The `c g^2` law is read from where the Rouche test or the chain check first fails at 0.05 resolution. The DH part has no rigorous tail and uses midpoint arithmetic.

## 6. Next step

The useful residue is Lemma 3 with Corollary 3: the sign of `W_k` is the whole obstruction and `W_k/g_k^2` is regular. A quantity that could carry arithmetic is the sum `sum_k log|W_k(0)/W_k(1/2)| = -sum_k A_k`, a regularised logarithmic discriminant of xi. For polynomials `sum_k d/dtau log|W_k| = sum_i (gamma_i')^2` (gradient flow of the log discriminant). The test is whether the height-truncated, envelope-subtracted version has an explicit-formula expression in primes, and whether DH's divergence at `tau*` is visible there at finite truncation. If it is Euler-blind like the finite Pick orders (euler/RESULT.md), the lane is closed.
