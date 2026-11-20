# REFEREE: c17-u6f-isogenous-points-norm-jensen-gap (adversarial, lens: general)

Date: 2026-11-19. Referee 1 of the 3 required. Target: `RESULT.md`, claimed verdict precise-obstruction.

**Finding: holds.** Every step labelled PROVED was re-derived by hand and confirmed; the numerics were reproduced
with a different library, a different evaluation method and cases not in the result. Five minor errors of wording or
labelling are listed in section 4; none changes the verdict. The result makes no statement about zeros of zeta,
assumes no RH, restates no verified height. Flags set by the referee: R1 = R2 = R3 = R4 = false.

## 1. Re-derivation of the PROVED steps

**Dirichlet series of log theta.** `theta(tau) = eta(2 tau)^5 / (eta(tau)^2 eta(4 tau)^2)` and
`log eta(k tau) = (k/24) log q - sum_m sigma_{-1}(m) q^(km)` give
`log theta = sum_m sigma_{-1}(m) (2 q^m - 5 q^(2m) + 2 q^(4m))`, Dirichlet series
`zeta(u) zeta(u+1) (2 - 5*2^(-u) + 2*4^(-u)) = zeta(u) zeta(u+1) (2 - 2^(-u)) (1 - 2^(1-u))`. Confirmed without
lane n3 (the result cites n3 and lists this as a weak step; it is correct).

**Lemma N.** `sigma_{-1}(pm) = (1 + 1/p) sigma_{-1}(m) - (1/p) sigma_{-1}(m/p)` holds, and convolution with a
function supported on `{1, 2, 4}` commutes with it for odd `p`. Then
`sum_{b mod p} L((tau+b)/p) = p sum_m c(pm) e(m tau) = (p+1) L(tau) - L(p tau)`. Iterating:
`p^2 c(p^2 m) = (p^2+p+1) c(m) - (p+1) c(m/p)` (family 1) and
`sum_{b mod p} L(tau + b/p) = p sum_k c(pk) e(pk tau) = (p+1) L(p tau) - L(p^2 tau)` (family 2). The terms
`(p+1) L(p tau)` cancel; removing `b = 0` in each family gives
`log N_p = (p^2+p) L(x) - L(x/p^2) - L(p^2 x)`. Confirmed. Mellin multiplier `p^2+p-p^(2u)-p^(-2u)`: confirmed
(`M[g(lx)] = l^(-u) M[g]`). Zeros: `2 cosh(2u log p) = p^2+p`, real part `+-arccosh((p^2+p)/2)/(2 log p)`, and
`cosh(2 log p) = (p^2+p^-2)/2 < (p^2+p)/2` gives `|Re u| > 1`. Confirmed. `G` is analytic on `Re u > 0` (the pole of
`zeta(u)` at 1 is cancelled by `1 - 2^(1-u)`), and `M[log theta]` converges absolutely on `Re u > 0`; the phrase
"after the usual treatment of -(1/2) log x" is not needed.

**Sum identity.** `sum_{b mod p^2} theta((tau+b)/p^2) = p^2 theta(tau)`, `sum_{b mod p} theta(tau+b/p) = p theta(p^2 tau)`;
minus the two real points: `(p^2-1) theta(x) - theta(x/p^2) + p theta(p^2 x)`. Confirmed.

**Lemma J.** `log N/n = log theta - (log beta + log gamma)/n` and `A/theta = (p^2-1-beta+p gamma)/n`: formula
confirmed. `1 < beta < p` and `1/p < gamma < 1` from monotonicity and `theta(x) = x^(-1/2) theta(1/x)`: confirmed
(so `A > 0`). Monotone in `gamma`; `p^2+p-1 = n+1`; `psi'(beta) = (n+1)(1-beta)/(n beta (n+1-beta))`: confirmed.
Limit `log(p(p-1)/((p+2)(p-1))) = log(p/(p+2))`: confirmed. Corollary: with `1 < beta < p^2`, `0 < gamma < 1`,
`S > -1 + p gamma > -1`; case `S <= 0` gives `log|S/n| < -log n` and `(log beta + log gamma)/n < (2 log p)/n`,
sum negative for `p >= 3`. Confirmed; the hypothesis `f(x/p^2) < p^2 f(x)` is used in both cases.

**Epstein at inert primes.** `-n` a non-residue mod `p` forces `p | a, b` from `p | a^2 + n b^2`; both sum
relations follow; `log f = (1 + D_n) L` and `p` not dividing `n` keep the coefficient relation, so the norm identity
holds. Inert/split table rechecked by Legendre symbols: `n = 5`: 11, 13, 17 inert, 3, 7 split; `n = 6`: 13 inert,
5, 7, 11 split. Confirmed.

**Lemma D.** `-conj((tau+b)/p^2) = (tau-b)/p^2` on the arc, same in family 2, no fixed `b` for odd `p`: the `n`
values form `n/2` conjugate pairs; sign of the discriminant of a conjugation-closed set with `r` non-real pairs is
`(-1)^r`. Confirmed. This is the classical sign rule for discriminants; it should carry the label CLASSICAL.

**Mellin identity for J and Bochner.** Linear in the two previous identities; pole bookkeeping at `u = 0` (two
double poles cancel, residue `log(p/(p+2))` remains) confirmed. `-J > 0` and `x^sigma (-J) dx/x` finite for
`sigma > 0`: positive-definiteness in `t` follows. Confirmed.

## 2. Independent numerics (mpmath 1.4.1, direct q-series, no flint; local, under `scripts/memcap.sh 8`)

Scripts kept outside the repo (`/tmp/ref_c17u6f/ref.py`, `mel.py`); method: `theta(tau) = 1 + 2 sum q^(n^2)` summed
directly at the complex points; Mellin transform by trapezoid in `log x` on `K(y) = J(e^y) - J(e^(y+1))`
(a difference at shift 1, not the lane's first difference), divided by `1 - e^(-u)`.

Cases not in the result:

| check | case | outcome |
|---|---|---|
| sum identity, theta | p = 17 (x = 0.37, 2.9), p = 19 (0.05), p = 23 (0.011), 140 digits | rel. error <= 1.4e-137 |
| norm identity, theta | same | rel. error 2e-110 .. 6e-135 (loss from small point values; error scales with precision: 6e-31 at 60 digits) |
| `J_p`, theta | same | -0.0698, -0.0224, -0.0868, -0.0790; all above `log(p/(p+2))` and below 0 |
| `J_5(1e-3)` | | -0.336472236621 = `log(5/7)` to 12 digits |
| sign of D, theta | p = 3, 5, 7 at x = 0.7, 2.3 | -, +, - : equals `(-1)^((p+2)(p-1)/2)` |
| sign of D, random real-coefficient q-polynomial (40 terms) | same | -, +, - : same parity (control for "every real function") |
| Epstein n = 5, p = 17 (inert, new prime) | x = 0.3, 0.02 | both identities hold (norm 5e-97 at 140 digits); J = -1.52, -7.14 |
| Epstein n = 5, p = 11; n = 6, p = 13 | x = 1.7; 0.2 | both hold; J = -0.242, -1.91 |
| Epstein split: n = 5, p = 3, 7; n = 6, p = 5 | x = 0.2 | sum identity fails (rel. 6.6 .. 10.7), norm holds, J = +0.240, +0.215, +0.240 |
| Epstein ramified n = 5, p = 5 | x = 0.2 | both fail, J = -2.85 |
| twin G33, p = 3, q = 5, x = 3.87 | | sum holds (5e-61), norm fails, J = +0.008014 (result: 0.00802) |
| twin c = -2.2, p = 3, q = 5, x = 25.2 | | J = +0.08558 (result: 0.0859) |
| twin G33, p = 11, q = 3, x = 50.5 | | J = +0.002537 (result: 0.00253) |
| twin G33, p = 3, **q = 7** (not run by the lane), x = 3.87, 6, 10 | | sum holds, norm fails, J = +0.00318, +0.00123, +0.0000989 |

Mellin transform of `J_p`, theta (`log10|M[J]|`, `log10|zeta term / M[J]|`):

| p, Re u, t | referee | result |
|---|---|---|
| 5, 0.5, 14 | -9.000, -0.833 | -9.00, -0.83 |
| 5, 0.5, 50 | -31.085, -2.603 | -31.09, -2.60 |
| 3, 0.5, 100 | -60.689, -7.092 | -60.69, -7.09 |
| 3, 0.5, 200 | -120.450, -14.930 | -120.45, -14.93 |
| 13, 0.5, 200 | -124.781, -10.538 | -124.78, -10.54 |
| 7, 0.3, 50 (new) | -31.326, -2.463 | not tabulated |
| 11, 0.7, 150 (new) | -93.544, -8.174 | not tabulated |

Step halving at `t = 200` (the range the result did not test): steps 0.01 and 0.005 agree to relative 2e-51
(p = 3) and 9e-47 (p = 13), the floor of the 170-digit working precision against values near 1e-120. Step 0.02 is
aliased at `t = 200` (relative difference above 1), as expected from the factor `exp(-(2 pi/h - t) d)`, `d` about 1.4:
at `h = 0.01` this factor is about 1e-255. The result's trapezoid values at `t > 100` are trustworthy; the errors
remain not enclosed.

## 3. Controls where a zeta-only mechanism would be claimed

None is claimed: the result sets R3 false and states that Epstein passes each read at each inert prime. The
referee confirms this at a prime the lane did not run (`n = 5`, `p = 17`), confirms the failure at split primes,
and confirms that the twin fails `J < 0` with a second auxiliary prime (`q = 7` at `p = 3`), so that failure is not
specific to `q = 5`. Not checked by the referee: that `theta(x) theta(5x)`, `theta(x) theta(6x)` have off-line zeros
(taken from row G33 by the result; classical for class number 2); the float winding count for the zeros of `A_p`;
the unconverged twin transforms.

## 4. Errors and corrections (none changes the verdict)

1. **Lemma D is the classical discriminant sign rule** (sign `(-1)^r`, `r` = number of non-real conjugate pairs).
   Label it CLASSICAL, not PROVED-as-new.
2. **Section 4, row E_a:** if all point values are real, the paired values `v_b`, `v_{-b}` coincide, so `D = 0`
   identically, not merely `D >= 0`. By the exception clause of Lemma D this does not "differ from the parity
   value"; the row should read "D = 0 (degenerate)".
3. **Section 4, reading of the table:** "it identifies `f` up to the finite list of such eta quotients" is stated
   without proof or citation. It is not used anywhere; label it ARGUED or remove it.
4. **Section 0 and the map wording:** "modular forms of level 4 p^2 outside the dilation module, no candidate
   inequality" for symmetric functions of degree at least 3 is an assertion, not shown. The map wording "Not
   excluded" is the correct status; the level and "outside the module" should be labelled ARGUED.
5. **Section 0, (J):** `phi_p = 1.375 .. 1.425` is the measured decay rate of `|M[J_p]|` on `t in [150, 200]`; its
   attribution to `M[log A_p]` and to the argument of the first zero of `A_p` is ARGUED (the result says so in
   section 2 and section 7; section 0 labels it MEASURED only).

Scope limits stated by the result and confirmed as limits: twin not run at `q = p`; NR-q, ZQ, backward heat argued
not formulable without a run; DH, sign twist, unimodular twist, Beurling, phase-rotated transfer operator, theta^w,
E_a not run. These are why R3 is false; they do not affect the obstruction, which needs one passing control
(Epstein at inert primes, proved) and the reductions of (N), (J), (D) to identities, monotonicity and a parity count.

## 5. Requirement flags (referee)

- R1 false: one prime at a time; multiplicativity of `sigma_{-1}` at `p` only.
- R2 false: pointwise statements on the arc; no statement at height `t`.
- R3 false: Epstein passes at inert primes (proved, reconfirmed at p = 17); several controls not run.
- R4 false: zeta appears as a factor of a module identity or as an additive, exponentially subdominant term.

## 6. Surviving claim

For odd `p`, the three reads of the `p^2+p-2` complex isogenous points of theta under `T_{p^2}` on the arc reduce
as follows: the norm equals `theta(x)^(p^2+p)/(theta(x/p^2) theta(p^2 x))` (Mellin multiplier
`p^2+p-p^(2u)-p^(-2u)` on `M[log theta]`); the Jensen gap is negative on the whole arc with limit `log(p/(p+2))`
at the cusp, as a consequence of the sum identity, the norm identity and monotonicity; the discriminant sign is
the parity `(-1)^((p+2)(p-1)/2)` for every function with real coefficients (classical). `theta(x) theta(nx)`,
`n = 5, 6`, passes all three at inert primes. Cell U6 (f) is closed for these three reads. Nothing about zeros of
zeta.
