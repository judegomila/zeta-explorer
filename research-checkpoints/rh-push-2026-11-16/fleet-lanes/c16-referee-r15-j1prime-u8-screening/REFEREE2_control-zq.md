# REFEREE2: control ZQ (item 2) and lane c15-control-with-zeta-fe-classes-u1-u2

Lane `c16-referee-r15-j1prime-u8-screening`, 2026-11-19. Second independent referee of the construction (the
first is the "Independent referee pass" inside the lane's REFEREE.md). The first report was read together with the lane (this pass is not blind to it). Own derivation by hand; own code
(`code/loc_zq.py`, `loc_zq.json`, mpmath 30 digits, local under `scripts/memcap.sh 8`) on two pairs that
neither the lane (zeros 1, 2; 6709, 6710) nor the first referee (298, 299) used: zeros 922, 923
(1329.04351799652, 1329.20501878548; d = 0.0807504) with eta = 0.12, and zeros 34, 35 (d = 0.4225618) with
eta = 0.31. This file also serves as REFEREE2 for the lane. Nothing here is a statement about zeros of zeta:
the object is a function other than zeta, built on zeros that are on the line by computation.

## Ruling: holds with corrections. No PROVED statement is broken.

| item | independent derivation | check on the new pairs | ruling |
|---|---|---|---|
| zeta's functional equation for ZQ = zeta m | m is a function of `(s - 1/2)^2`, so `m(s) = m(1 - s)`; Lemma A is the quotient of two solutions | defect of `ZQ gam` under `s -> 1 - s` at four points: 7.2e-29, 5.4e-29; closed form of m against the product over the eight points: 5.1e-30, 2.4e-29 | holds |
| zeros: two on-line pairs removed, quartet added | numerator `((t - gbar)^2 + eta^2)((t + gbar)^2 + eta^2)`, `t^2 = -(s - 1/2)^2`; poles of m at `1/2 +- i g1, 1/2 +- i g2`, cancelled by simple zeros of zeta | argument principle: rectangle right of the line around gbar: ZQ 1, zeta 0; rectangle across the line: 2 and 2 (both pairs). non-vanishing: `abs zeta` at the quartet point 0.0595 (922, 923) and 0.323 (34, 35); `abs ZQ` at the removed zero `1/2 + i g1` 0.0812 and 0.517; `m(1), m(-2), m(-4)` real, finite, non-zero; `ZQ(2)` = 1.64493410581 and 1.64500677 against `zeta(2)` = 1.64493406685 | holds |
| atoms of log zeta | `-m'/m = sum over removed rho of 1/(s - rho) - sum over added rho' of 1/(s - rho')` and `1/(s - rho) = int_1^inf x^(-s) x^(rho-1) dx` for `Re s > Re rho`; so `Lambda_ZQ = Lambda + D(x) dx` with `D(x) = -4 x^(-1/2) cos(gbar L)(cosh(eta L) - cos(d L))`, `L = log x`: no point mass is added or changed | `-m'/m` against the eight partial fractions: 1.3e-33; Laplace integral of D against `-m'/m(1.4 + 3.1 i)` (pair 34, 35): difference 1.8e-20 on a value of size 6.9e-8 | holds, with the reading "on the atoms" (correction 3) |
| defect bound | `cosh a - 1 <= a^2 cosh(a)/2` (termwise: `(2k)! >= 2 (2k-2)!`), `1 - cos b <= b^2/2`, so `abs D <= 2 (eta^2 + d^2) L^2 e^(-(1/2 - eta) L)`, and `max L^2 e^(-aL) = 4 e^(-2)/a^2` | sup of abs D on a grid resolving `cos(gbar L)`: 0.0915740 against bound 0.1568587 (922, 923); 1.08547 against 8.2373 (34, 35; here the bound `abs D <= 8` is the smaller one). D takes both signs: -0.0915740, +0.0915740 | holds: `sup abs D <= 8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2` |
| Lemma L with the pole clause | re-derived in full (below) | G_+ (pole clause dropped), `b = eta + 0.1`: `min D_+ = 0` at x = 1 and positive elsewhere on the grid, functional-equation defect 7.2e-29, real poles at `1/2 +- b` (abs G_+ = 4.9e33 at distance 1e-10); antisymmetry `f(sigma) = -f(1 - sigma)` of `f = -m'/m`: `f(2) = 1.2067e-13`, `f(-1) = -1.2067e-13` (922, 923) | holds as stated in section 3 of the lane |
| Lemma D, forced exponent, `abs D <= 8 x^(beta-1)`, density E of 1/ZQ, SG has `D <= 0`, `r(z) = m(2z-1)/m(2z)` unimodular on `Re z = 1/2`, "m entire rational bounded is constant" | each re-derived by hand (triangle inequality and monotonicity of `l^u + l^-u`; pole of the transform at rho'; `n^(-s)/(s - rho') = int_n^inf x^(-s) n^(-1) (x/n)^(rho'-1) dx`; `cosh >= 1 >= cos`; `m(1 + 2iy) = m(-2iy) = conj m(2iy)`) | not rerun (first referee's rerun stands) | hold |

### Lemma L, derivation

Hypotheses: `G = zeta m` meromorphic, `m(s) = m(1-s)`, G has at most a simple pole at 1 and no other pole,
`-m'/m(s) = int over [1, inf) of x^(-s) dD(x)` in some half-plane with `D >= 0`.
(1) m has no real pole: a real pole of m is a real zero of zeta not cancelled by G, or a pole of G with zeta
regular. Real zeros of zeta are the trivial ones (zeta < 0 on (0, 1), zeta(0) = -1/2). If `G(-2n) != 0`,
`G gam` has a pole at -2n, so by the functional equation at `1 + 2n`, where gam is finite and non-zero: G has
a pole at `1 + 2n`, excluded. A pole of m at 1 is a double pole of G, excluded.
(2) Let `sigma_c` be the abscissa of convergence. The transform is analytic for `Re s > sigma_c`, so all zeros
and poles of m lie in `Re s <= sigma_c`. If `sigma_c` is finite, Landau's theorem (positive measure) makes
`sigma_c` a singular point of the transform, hence a pole of `m'/m`, hence by (1) a real zero of m, of some
order k; then `-m'/m(sigma) = -k/(sigma - sigma_c) + O(1) -> -inf` from the right, while the transform is
`>= 0` there. So `sigma_c = -inf`.
(3) Then `m'/m` is entire and `f(sigma) = -m'/m(sigma) >= 0` on the whole real axis. `m(s) = m(1-s)` gives
`f(sigma) = -f(1 - sigma)`, so `f = 0` on the axis; a positive measure with vanishing transform is 0; m is
constant. The case "G regular at 1" (`m(1) = 0`) is a real zero and is covered by (2). A point mass of D at
x = 1 adds a non-negative constant and changes nothing. QED (relative to Landau's theorem, CLASSICAL).
The pole clause is used in (1) and is necessary: G_+ above has `D_+ >= 0`, the functional equation, exact
atoms, an off-line quartet, and poles at `1/2 +- b`.

## Corrections (state of the files at 13:40 PST, 2026-11-19)

1. Pole clause. The three places where the lane's RESULT.md dropped it (row F2; section 3 (a); section 6, U2
   POS branch) now carry a bracketed correction by `c16-repair-owed-record-r15`. As corrected they hold. The
   uncorrected sentence "No member of the family with exact atoms keeps POS" is false (G_+).
2. "Infimum 0" (section 4): the input written is "consecutive ordinates below T have mean gap
   `(2 pi + o(1))/log T`". That is a statement about all zeros; ZQ needs two simple zeros on the line. Corrected
   sentence: "a positive proportion of the zeros are simple and on the line (CLASSICAL: Selberg; Levinson's
   method for simplicity), so by the pigeonhole principle there are pairs of simple on-line zeros with
   `g2 - g1 <= C/log T`, and d -> 0 along a sequence of pairs." (The first referee's E3 names the same input.)
3. Campaign sentence (STRATEGY section 0b): "defect an absolutely continuous density of sup size
   O(eta^2 + d^2)" holds for eta bounded away from 1/2 only. Corrected: "of sup size at most
   `8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2`, and at most 8 for all parameters". The words "every prime-power atom
   of log zeta" hold; "exact Euler factors at every prime" (lane verdict) holds only in the reading "on the
   atoms": ZQ is not an Euler product (its coefficient measure has an absolutely continuous part). This reading
   condition is the lane's weakest step 1 and stays a reading, not a theorem.
4. Scope already in the lane, confirmed: the twists `L(s, chi) m(s)` have poles at `1/2 +- i g1, 1/2 +- i g2`;
   ZQ is a control for single-object devices only.

No numeric claim of the lane failed on the new pairs. Referees for ZQ (functional equation, atoms, defect
bound, Lemma L with the pole clause): 2 independent (first referee; this file).

## Weakest points of this pass

1. Landau's theorem and the proportion of simple on-line zeros are recalled, not opened.
2. 30-digit floating point and argument-principle counts on a 4000-point contour per side, not interval
   arithmetic.
3. Sections 5 and 6 of the lane (paper runs against rows Z34, Z36, P53) were not re-run by me.
