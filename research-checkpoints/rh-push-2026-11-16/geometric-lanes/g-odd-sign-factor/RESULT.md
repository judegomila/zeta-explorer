# g-odd-sign-factor: Gaussian-mixture / independent-reference route to `Delta_- <= 0`

Date 2026-11-16. Lane: Target B of PR #56 (sign of the odd half-line theta kernel) by a
positive-reference factorization instead of total positivity. Nothing here proves or refutes RH.
Labels: PROVED / CLASSICAL / MEASURED / OPEN.

## Verdict

**Precise obstruction; the Gaussian-mixture hypothesis is refuted, with the sign reversed.**

1. `kappa(sqrt t)` is **not** completely monotone (three independent proofs, Theorem 1). PROVED.
2. For every positive Gaussian mixture the odd kernel has the **wrong** sign: entries `H_-(x,y) < 0`
   and spectral diagonal `C_-(t,t) <= 0` (Theorem 2). A Gaussian mixture has no critical-line zeros
   at all. The mixture class is the opposite extreme from the target. PROVED.
3. The operator is quadratic in `kappa`, so no positive-mixture decomposition of `kappa` transfers a
   sign: Gaussian atoms have `H_- = 0` and all the content sits in cross terms (Theorem 2c). PROVED.
4. New exact identity (Theorem 3, "convexity excess"): on odd inputs
   `<a,H_0 a> = -2 alpha * int_0^inf (kappa*a)(s) ((v rho kappa)*a)(s) ds`, with
   `rho(v) = V'(v^2)/V'(0) - 1 >= 0` increasing. The Gaussian part of `kappa` drops out exactly.
   PROVED, checked to 16 digits. It does not determine the sign.
5. Unconditional signed factorization (Theorem 4): `Delta_- = -(P) + N`, `P >= 0` the Gram of
   critical-line zeros, `N >= 0` of rank at most the number of off-line quartets, `N = 0 <=> RH`,
   `||N|| <= 4e-61 * alpha` from verified height `3e12`. This is the requested form
   "`-(C*C)` + controlled remainder"; the control is the verified-height wall, restated.
6. DH control (Section 5): the Davenport-Heilbronn kernel is positive, even, has strictly convex
   `V_DH` (min `V'' = 0.1589` on a grid, MEASURED), so PR #56 theorem (G) holds for DH, while its
   odd form is negative on an explicit spectral window `t in [85.45, 85.95]` at relative size
   `10^-57.6`. Every input used so far in the odd sector is DH-blind.

## 0. Plan and what is new relative to the atlas / PR #56

PR #56 already has: `H_c = G_c - Delta_c`, `G_c P_- = 0`; entrywise `H_-(x,y) > 0` from Csordas
convexity; polynomial-Gaussian counterexample to "convexity suffices"; quartic positive class;
RH-conditional zero factorization (16); full odd positivity <=> RH. The lane question was whether
`kappa(sqrt t)` is a positive Gaussian mixture, and whether an independent positive odd reference
exists. New here: Theorems 1-3, the unconditional form of the factorization with a negative-rank
count, and a DH control that is a genuine theta series with a functional equation (PR #56's
controls "do not preserve the theta structure"). No atlas-closed route is re-run.

Notation (PR #56): `F(z) = xi(1/2+z) = int kappa(u) e^{zu/2} du`, `kappa(u) = Phi(u/4)`,
`f(t) = F(it) = G(t^2)`, `K(t) = kappa(sqrt t) = e^{-V(t)}`, `phi = -G'/G`,
`C_-(t,s) = (4 alpha/pi) t s f(t) f(s) L_phi(t^2,s^2)`.

## 1. Theorem 1: `kappa(sqrt t)` is not completely monotone. PROVED

Suppose `K(t) = int_0^inf e^{-s t} dmu(s)`, `mu >= 0` (Bernstein), i.e. `kappa(u) = int e^{-s u^2} dmu(s)`.

- (a) *Log-convexity.* Completely monotone functions are log-convex (Cauchy-Schwarz:
  `K K'' >= K'^2`), i.e. `V'' <= 0`. Csordas Thm 4.2(b) gives `V'' > 0`. Contradiction.
  (MEASURED illustration: `V''(1) = 0.680`.) The input PR #56 uses for (G) is itself the refutation.
- (b) *Hardy.* Then `f(t) = int sqrt(pi/s) e^{-t^2/(16 s)} dmu(s) > 0` for all real `t`. But `xi`
  has zeros on the critical line (Hardy 1914, CLASSICAL). Contradiction.
- (c) *Decay.* `kappa(u) >= mu([0,S]) e^{-S u^2}` for any `S` with `mu([0,S]) > 0`, so decay is at
  most Gaussian; `Phi` decays like `exp(-pi e^{|u|})`. Contradiction.

Each proof is two lines and independent.

## 2. Theorem 2: Gaussian mixtures give the reversed sign. PROVED

Let `k(u) = int e^{-s u^2} dmu(s)`, `mu >= 0`, not a point mass, with finite moments as needed.

- (a) *Spectral diagonal.* `G(z) = int w(s) e^{-z/(16 s)} dmu(s)`, `w > 0`, is a Laplace
  transform of a positive measure in `tau = 1/(16 s)`, hence strictly log-convex on the real axis:
  `phi'(x) = -(log G)''(x) < 0`. So `C_-(t,t) = (4 alpha/pi) t^2 f(t)^2 phi'(t^2) < 0` for all
  `t > 0`, and `tr H_- < 0`. Every narrow spectral bump has negative energy.
- (b) *Physical entries.* `V` is concave, so the PR #56 separation argument runs backwards:
  `H_-(x,y) < 0` for all `x,y > 0`. Direct check: for atoms `s != s'`, with `sigma = s+s'`,
  `delta = s-s'`, `q = t^2 - m^2`, the symmetrized product is
  `2 e^{-sigma (q + (x^2+y^2)/2)} cosh(delta sqrt(A_pm))`,
  `A_pm = q (x -+ y)^2 + (x^2-y^2)^2/4`, and `A_opp - A_same = 4 q x y > 0`.
  MEASURED on `k = e^{-u^2} + e^{-3u^2}`: all nine sampled entries negative (checks2.json).
- (c) *Why mixtures cannot work.* `H = 2(KQO - OQK)` is bilinear in the kernel. For a single
  Gaussian `phi` is constant and `H_- = 0`. A mixture's odd form consists only of cross terms, each
  entrywise negative. The set `{kappa : H_-[kappa] >= 0}` is not convex, so a positive decomposition
  of `kappa` into atoms with known sign gives nothing without controlling all cross terms.
- (d) `f > 0` on the real axis: a Gaussian mixture has **no** zeros on the critical line.

The same remark applies to the native theta atoms `P_n(e^{|u|}) exp(-pi n^2 e^{|u|})` (positive for
`u >= 0` since `2 pi n^2 e^u > 3`): a single atom has a kink at `u = 0` and `e^{sqrt t}` is concave
in `t` for `t < 1`; smoothness and convexity at 0 are collective (modular) properties of the sum.

## 3. Theorem 3: convexity-excess identity. PROVED

Derivative in the cutoff (the "c-derivative" idea): from (C) of PR #56,
`d/dc H_c(u,v) = -alpha [(c-u)+(c-v)] kappa(c-u) kappa(c-v)`, rank two, hence for real `a`

    <a, H_0 a> = 2 alpha int_0^inf A(s) B(s) ds,   A = kappa * a,   B = (v kappa) * a.      (3.1)

Split `B = s A - kappa*(u a)`:

    <a, H_0 a> = 2 alpha int_0^inf s |kappa*a|^2 ds  -  2 alpha int_0^inf (kappa*a)(kappa*(ua)) ds.   (3.2)

The first term is an explicit positive form on odd inputs (`C a = sqrt(s) (kappa*a)|_{s>0}`); it is
an independent positive odd reference. The second term is not sign-definite and is not dominated.

Sharper: write `L = -log kappa`, `L'(v) = v w(v^2)`, `w = 2V'`, `w_0 = w(0) > 0`,
`rho(v) = w(v^2)/w_0 - 1`. Convexity of `V` is exactly `rho >= 0`, increasing in `|v|`. Then
`v kappa = -kappa'/w_0 - v rho kappa`, so `B = -A'/w_0 - (v rho kappa)*a`. For odd `a`, `A` is odd,
`int_0^inf A A' = -A(0)^2/2 = 0`, hence

    <a, H_0 a> = -2 alpha int_0^inf (kappa*a)(s) ((v rho kappa)*a)(s) ds     (a odd).      (3.3)

MEASURED check on the actual theta kernel, nodes `x=0.6, y=1.3`: both sides
`4.184508110989204e-5` (16 significant digits agree). Samples: `rho(0.5)=0.0774, rho(1)=0.298, rho(2)=1.23, rho(3)=3.33`.

Content: the odd form is linear in the excess `rho` at fixed `kappa`; it vanishes iff `V` is
affine (Gaussian). The identity explains (G) but (3.3) has the same structure as (3.1) with a new
odd multiplier, so it does not fix the sign. It holds verbatim for DH (Section 5), where the sign fails.

## 4. Theorem 4: unconditional signed factorization. PROVED (CLASSICAL ingredients)

`G` is entire of order 1/2, genus 0, `G(x) > 0` for `x <= 0` (positivity of `kappa`). Its zeros are
`lambda_n > 0` (critical-line zeros) and conjugate pairs `lambda_k, conj lambda_k`, `Im lambda_k > 0`
(one pair per off-line quartet). Without assuming RH,

    C_-(t,s) = (4 alpha/pi) [ sum_n mu_n psi_n(t) psi_n(s)
               + 2 sum_k mu_k ( a_k(t) a_k(s) - b_k(t) b_k(s) ) ],
    psi_n = t f(t)/(lambda_n - t^2),   a_k + i b_k = t f(t)/(lambda_k - t^2).

So `Delta_- = -P + N` on the odd sector, `P >= 0`, `N = (8 alpha/pi) sum_k mu_k b_k (x) b_k >= 0`.
`N = 0 <=> RH`. The number of negative squares of `H_-` is at most the number of off-line quartets
(a Krein-Langer generalized Nevanlinna statement for `phi`).

Size of the remainder: `b_k(t) = -t f(t) Im(lambda_k)/|lambda_k - t^2|^2`, `Im lambda_k = 2 gamma beta`,
`|beta| < 1/2`. For `t <= gamma/2`: `|b_k| <= 2.1 t |f(t)| gamma^{-3}`. With
`M_2 = int_0^inf t^2 f^2 = 10.2538` (MEASURED, mpmath) and all zeros to `T_0 = 3e12` on the line,
`||N|| <= tr N <= (8 alpha/pi) * 4.4 M_2 * sum_{gamma > T_0} gamma^{-6} + (exponentially small)
~ 4e-61 alpha`, against `||H_-|| ~ 2e-2 alpha`. (The constant is an estimate, not an interval
bound; the part `t > gamma/2` is `O(e^{-pi gamma/4})`.)

This is the factorization the lane asked for. Its remainder bound is exactly the verified-height
wall; it gives no new zero information, and `N` is the unique obstruction, so any other positive
reference `R` with `H_- - R >= 0` is at RH strength (PR #56 operator-duality theorem).

## 5. Davenport-Heilbronn control

`f_DH(s) = sum c(n) n^{-s}`, `c` 5-periodic `(1, xi, -xi, -1, 0)`,
`xi = (sqrt(10-2 sqrt5)-2)/(sqrt5-1)`; `Lambda(s) = (5/pi)^{s/2} Gamma((s+1)/2) f_DH(s) = Lambda(1-s)`.
Then `Lambda(1/2+z) = int kappa_DH(u) e^{zu/2} du`,

    kappa_DH(u) = sqrt(pi/5) e^{3u/4} sum_n c(n) n exp(-pi n^2 e^u / 5),

a weight-3/2 theta series, even in `u` (MEASURED: relative error `2e-40`; integral reproduces
`Lambda(1/2+10i)` to 24 digits).

- `kappa_DH > 0` on the grid `u in (0,15]` (3599 points; 0 nonpositive). MEASURED.
  (The file dh_control.json lists "nonpositive points" at `u >= 5.6`; that is an underflow cutoff in
  the first script, corrected in checks2.py.)
- `V_DH(t) = -log kappa_DH(sqrt t)` is strictly convex on the grid: `min V'' = 0.15892` at
  `u = 1.494`, `V''(0.001^2) = 0.16468`. MEASURED (grid, not interval). For large `u` one term
  dominates and `u L'' - L' = (pi/5) e^u (u-1) + 3/4 > 0`.
- Hence PR #56 theorem (G) (`H_- > 0` entrywise), the constant-phase cone, identities (3.1)-(3.3),
  positivity/evenness/double-exponential decay/order one all hold for DH.
- Off-line zero recomputed: `0.808517182456637 + 85.699348485377 i`. Odd spectral diagonal
  `D(t) = f'^2 - f f'' + f f'/t` (`C_-(t,t) = (alpha/pi) D`) is **negative** for
  `t in [85.45, 85.95]`, minimum `D/(f^2+f'^2) = -18.47` at `t = 85.75`, where `|f| = 10^-28.8`.
  A narrow odd spectral bump there is a real odd Schwartz input with negative energy. MEASURED.
  For xi the same normalized quantity is positive at all sampled `t` (5, 14.2, 21.5, 30, 50.3).

Which step would use the Euler product: none of Theorems 1-4 or (G) does. The DH negative
direction has relative size `f^2 ~ 10^-57.6`; an odd-sector proof must separate xi from DH at that
scale in a window of oscillation frequency `t/2 ~ 43` in `u`. Convexity of `V`, positivity and
theta-series form do not.

## 6. Walls

- DH: Section 5. All inputs in this lane pass for DH; the target fails for DH.
- eq48 / Weil: full odd positivity is RH (PR #56) and equals the Weil form class; Theorem 4 is the
  zero-side expression of it. No margin is claimed.
- Verified height: the bound on `N` restates it.
- Flow-blindness: `kappa_tau = e^{tau u^2/16} kappa` shifts `V` by an affine term, so `rho` changes
  only through `w_0`; (3.3) is flow-covariant and cannot give RH.

## 7. Three weakest steps

1. `kappa_DH > 0` and `V_DH'' > 0` are grid checks (step 1e-3 on (0,3], 0.02 on (3,15]) plus a
   one-term asymptotic, not an interval certificate.
2. The numerical constant in `||N|| <= 4e-61 alpha` uses a crude split at `t = gamma/2` and an
   unbounded-rigour estimate of the `t > gamma/2` part; only the order of magnitude is claimed.
3. Theorem 2(b) is stated for mixtures with enough moments for the kernel integrals; the general
   entrywise claim rests on the reversed PR #56 argument (concave `V`), checked numerically on one
   two-atom example only.

## 8. Next step

Make Section 5 a certificate (interval-check `V_DH'' > 0`), then add it to PR #56's
odd-sector-followup as the arithmetic control replacing the polynomial-Gaussian one. For the
target itself, the only remaining lever in this formulation is an estimate on (3.3) that uses
`Lambda(n) >= 0`; none was found.

## Files

- `dh_control.py`, `dh_control.json`: DH kernel, off-line zero, diagonal scan.
- `checks2.py`, `checks2.json`: fine-grid DH convexity, xi convexity, mixture entries, identity (3.3).
- `m2.py`: `M_2` and xi diagonal samples.
