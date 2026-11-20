# REFEREE: g-odd-sign-factor

Date 2026-11-16. Adversarial review of RESULT.md. Scripts used for the re-checks were run from a
scratch directory (/tmp/ref-oddsign: a.py, b.py, c.py); nothing in this directory was modified
except this file.

## Verdict

**holds = true** as a precise obstruction. Every PROVED step was re-derived by hand and the
numerics were re-run on different cases with independent code. No step assumes RH. No new zero
information is produced, and RESULT.md does not claim any. Five minor wording/accuracy errors
are listed below; none changes the verdict.

## Re-derivation of PROVED steps

- **T1 (not completely monotone).** (a) CM implies `K K'' >= K'^2`, i.e. `V'' <= 0`; contradicts
  strict convexity of `V`. (b) A mixture gives `f(t) = int sqrt(pi/s) e^{-t^2/(16 s)} dmu > 0`;
  contradicts Hardy. (c) `kappa(u) >= mu([0,S]) e^{-S u^2}`. All three confirmed. The Csordas
  citation was not checked against the source; the scaling `kappa(sqrt t) = Phi(sqrt(t/16))` is
  consistent with the classical Csordas-Varga statement. Grid re-check: `min V'' = 0.68038` at
  `u = 0.99` (RESULT quotes 0.680 at `u = 1`).
- **T2 (reversed sign for mixtures).** (a) `G` is a Laplace transform of a positive measure in
  `1/(16 s)`, strictly log-convex, so `phi' < 0` and `C_-(t,t) < 0` by PR #56 (11). Confirmed.
  (b) Full proof reconstructed: substituting `t^2 = q + m^2` in the same-sign integral and
  `t^2 = q + d^2` in the opposite-sign one gives a common centre `q + m^2 + d^2` and half-spreads
  `2|d| sqrt(q+m^2) < 2 m sqrt(q+d^2)`; strict concavity of `V` then gives `H_-(x,y) < 0`.
  The atom formula `A_opp - A_same = 4 q x y` is correct. (c) `H_- = 0` for one Gaussian and
  non-convexity of the PSD set follow.
  Independent numeric check (new case): for `k = e^{-u^2} + e^{-3u^2}` and the odd test
  `a(u) = u e^{-u^2}`, physical energy via (3.1) = `-0.0222144146907918`, spectral energy via
  PR #56 (5) on a 1000 x 1000 grid = `-0.0222144146907918`. This also confirms the sign
  convention linking `H_-` and `C_-`.
- **T3 (convexity-excess identity).** `d/dc H_c` rank two, (3.1), `v kappa = -kappa'/w_0 - v rho kappa`,
  and `int_0^inf A A' = 0` for odd `a` all confirmed. Re-run at different nodes:
  `(0.35, 2.1)`: lhs = rhs(3.3) = rhs(3.1) = `1.6563487563172211627e-10`;
  `(1.7, 1.7)`: `8.6865933830853486646e-11`; DH kernel `(0.35, 2.1)`: `1.7887512094623503715e-3`.
  Agreement to 20 digits in each case. The identity is an integration by parts of (3.1); it is a
  rewriting, not a cancellation, and RESULT.md says so.
- **T4 (signed factorization).** `phi = sum 1/(lambda - z)` (genus 0), conjugate pair gives
  `2(a (x) a - b (x) b)`. Confirmed. Remainder estimate re-computed: `M_2 = 10.2538044`,
  `sum_{gamma > 3e12} gamma^{-6} ~ 3.549e-63`, product `4.09e-61 alpha`. The `t > gamma/2` part
  is bounded because `f/|lambda - t^2|` is `f` divided by its own zero factors.

## Davenport-Heilbronn control (re-run independently)

Computed from the integral representation `Lambda(1/2+z) = 2 int_0^inf kappa_DH cosh(zu/2) du`
(Gauss-Legendre, 2688 nodes, 55 digits), not from Hurwitz zeta:

- `F(10 i) = 0.003135982590329855567164736` (matches RESULT to all 24 digits quoted).
- `|F|` at the claimed off-line zero = `2.0e-46`, against `1.5e-29` on the line at the same height.
- `kappa_DH > 0` at 5999 points of a different grid; `min V_DH'' = 0.1589206` at `u = 1.4944`.
- `D/(f^2+f'^2)`: `+0.028` at 85.40, `-0.116` at 85.45, `-18.474` at 85.75, `-0.328` at 85.95,
  `+0.133` at 86.00. Window and minimum confirmed. Positive at 5, 20, 40, 60.3, 120.2.

All inputs of the lane pass for DH; the target fails for DH. The lane uses no Euler-product step,
and says so.

## Errors found (all minor)

1. Verdict item 5 calls `P` "the Gram of critical-line zeros". By the Section 4 formula `P` also
   contains the `a_k (x) a_k` terms of the off-line pairs. The decomposition `-P + N` is therefore
   not canonical.
2. "Relative size `10^-57.6`" is `f^2` at 85.75. The negative diagonal is `|D| ~ 10^-56.3..-56.4`
   (ratio -18.5 to `f^2 + f'^2`). No ratio to the operator norm is computed.
3. `||H_-|| ~ 2e-2 alpha` is stated without a computation; not checked here.
4. Novelty is overstated in two places. That odd positivity fails for DH already follows from
   PR #56's Lowner theorem once `kappa_DH > 0`; the window is an explicit witness. T4 is PR #56
   (16) without the RH hypothesis plus the standard negative-square count, and PR #56's
   polynomial-Gaussian control already ties a negative determinant to an off-axis quartet.
5. Weakest-step 3 undersells T2(b): it is fully provable (argument above), not only checked on one
   example. Conversely "(G) holds for DH" rests on a grid check of `V_DH''`, as RESULT.md states;
   `kappa_DH > 0` for `u >= 0` is provable by first-term dominance and need not stay MEASURED.

## Surviving claim

`kappa(sqrt t)` is not a positive Gaussian mixture; Gaussian mixtures give `H_- <= 0` entrywise and
on the spectral diagonal; identity (3.3) holds on odd inputs for any positive even kernel with
`V'(0) > 0`; `Delta_- = -P + N` with `N >= 0` supported on off-line quartets and
`tr N <~ 4e-61 alpha` (estimate, restating verified height); DH passes every input used and fails
the target on `t in [85.45, 85.95]`. The sign of `Delta_-` for xi stays OPEN (RH-equivalent).
