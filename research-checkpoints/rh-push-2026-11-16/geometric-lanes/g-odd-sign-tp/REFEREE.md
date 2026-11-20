# REFEREE: g-odd-sign-tp (2026-11-16)

Verdict under review: precise-obstruction (total-positivity route to the odd sign Delta_- <= 0).
Outcome: **holds, with one logical correction and the stated MEASURED caveats.** Nothing assumes RH.

## Re-derived

- Kernel formulas. `H_0(u,v) = int_0^inf (2w-u-v) kappa(w-u) kappa(w-v) dw` equals PR 56 (C) at c=0
  (shift `w = t + (u+v)/2`, oddness of the integrand in `t`). The `tp_order.py` form
  `2 int_0^inf kappa(r+x)[(m+r)kappa(r+y) - (d+r)kappa(r-y)] dr` follows by `t = m + r` and `t = d + r`. Confirmed.
- L3. `H_0(-u,-v) = H_0(u,v)` (whole-line integral vanishes), so `H_-` is odd in each variable and
  `H_- = xy G(x^2,y^2)`. Order-j minors near 0 are `prod x_i y_i V(X) V(Y) (det J_j + o(1))`; the needed
  `det J_j > 0`, j<=4, are the leading principal minors of the PR 56 interval-certified PD block. Confirmed
  (PR 56 certificate itself not replayed; no explicit radius for non-principal minors).
- T-S (=>). Under RH `L_phi = sum mu_n/((lambda_n-x)(lambda_n-y))`; Cauchy-Binet plus the Cauchy
  determinant, each factor of sign `(-1)^{k(k-1)/2}`; strictness needs k distinct zeros. Confirmed.
  (<=) principal minors >= 0 => Loewner matrices PSD on I => Pick extension => no nonreal pole of
  `-G'/G`; nonpositive real zeros excluded by `F(r) > 0`. Confirmed against PR 56 `operator-duality.md`.
  The statement is the classical fact that Stieltjes/Cauchy-type Loewner kernels are STP; it is correct
  and not a lever, as the result says.
- T-PF. Criterion re-derived: `d_x^i d_y^j kappa(x-y) = (-1)^j kappa^{(i+j)}`, so TP_5 forces
  `det[kappa^{(i+j)}(u)]_{5x5} >= 0`. At u=0 the matrix splits by parity into
  `det[m_{a+b}]_{3x3} * det[m_{a+b+1}]_{2x2}`. Independent mpmath computation (numerical Taylor
  coefficients at 120 digits, not arb_series): `-19653.7750359 * 184.790657746 = -3631834.01608`. Confirmed.
- DH kernel. Coefficients `(1, tau, -tau, -1)` mod 5 and `kappa_DH(u) = e^{3|u|/4} theta(e^{|u|})`
  match `F(z) = int kappa e^{zu/2} du = xi_DH(1/2+z)`. The Loewner direction uses analyticity only, and
  DH has zeros with `Re s != 1/2`, so the DH odd sign is false. Confirmed.

## Reruns (independent code: mpmath, 290 digits, own Gauss-Legendre panels of width 0.2 on [0,8])

| case | result |
|---|---|
| zeta, rows 0.1..0.5, cols 3.1..3.5 (the claimed minor) | `-3.10578223195232e-211`; leading minors `1.0704e-29, 3.1090e-65, 4.4565e-107, 1.9879e-155`. Matches all 15 digits. |
| zeta, rows 0.1..0.5, cols 3.4..3.8 (different grid block) | `-2.89485815761667e-276`, orders 1-4 positive |
| zeta, off-grid rows 0.07,0.19,0.31,0.43,0.55, cols 3.25,3.33,3.41,3.49,3.57 | `-1.50621198361509e-232`, orders 1-4 positive |
| DH, rows 0.1..0.4, cols 1.8..2.1 | 4x4 minor `-1.21221173497788e-29`, orders 1-3 positive |
| DH, `kappa_DH` local PF test at 0 | order 2: `+0.2121`; order 3: `-0.1419` (fails at 3, as in `feature_sr.log`) |

The negative order-5 minor is therefore not a grid or quadrature artefact; it persists off the grid.

## Errors and corrections

1. **"STP_4 of H_- is weaker than RH" is wrong as a logical classification.** RH gives PSD, i.e.
   nonnegative *principal* minors only. Non-principal minors of order <= 4 are not implied by RH (the
   order-5 non-principal failure coexists with the conjectured PSD). STP_4 neither follows from RH nor
   implies it on present knowledge; it is logically independent, not weaker. What is weaker than RH is
   PSD of every <= 4-node Gram.
2. "Sign-regularity order exactly 4" is a grid statement (h = 0.1, 0.05 on (0,4]^2) plus L3 near 0. The
   upper bound (not TP_5) is solid at MEASURED level; the lower bound (STP_4 everywhere) is unproved.
   The result says this in its weakest steps; the headline should carry the same qualifier.
3. T-PF is labelled "PROVED by ball arithmetic", but the 11-term theta truncation is asserted, not
   included in the ball. The margin (tail < 1e-190 against a determinant of size 3.6e6) makes this a
   formality; the sign is correct.
4. "Orders track conductor / low-zero geometry" is an unsupported interpretation. The comparison mixes
   gamma factors (zeta: even type; DH, chi_-4, chi_-3: odd type), and chi_-3 scores above DH. The
   supported statement is only: the orders do not separate DH from Euler-product L-functions.
5. T-S is classical in content (Loewner + STP of Cauchy-type kernels). Correct; no novelty.
6. Quadrature is not interval-enclosed (acknowledged). Three independent implementations now agree to
   15 digits on the key minor.

## Checks requested by the brief

- RH assumed anywhere? No. T-S (=>) assumes RH only as the hypothesis of that direction.
- Coordinate-change test: no cancellation is claimed. The result itself notes TP order is invariant only
  under diagonal congruence and monotone reparametrization; it is not invariant under general
  congruence, so it is a property of the Mellin coordinate, not of the operator.
- DH control: run independently above; DH passes positive entries and TP_3 and fails TP_4, while its
  odd sign is false. No zeta-only mechanism is claimed.

## Surviving claim

The odd sign is not proved. `H_-` is not TP_5 (MEASURED, three independent evaluations, on and off
grid); it is STP_4 on the tested grids and near 0. `kappa = Phi(./4)` is not PF_5 (confirmed).
RH <=> `L_phi` STP of all orders on `(0, gamma_1^2)^2` (confirmed, classical). Finite sign-regularity
orders and finite Grams in the Mellin coordinate do not distinguish DH. STP_4 is logically independent
of RH, not weaker.
