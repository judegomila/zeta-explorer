# h-klein-fricke: Klein surfaces, the Fricke involution, and the geometric trace formula

Date: 2026-11-16. Nothing here proves or refutes RH and no bound moves.
Labels: PROVED (in this note, elementary), CLASSICAL (cited), MEASURED (Arb-enclosed function values,
float post-processing, not an interval-certified count), OPEN.

## 0. Verdict

**Precise obstruction, with one exact identification and one finite-height trapping mechanism that
does use the Euler product and that Davenport-Heilbronn-type functions fail for a structural reason.**

1. Identification (section 2). The zeta-view Klein bottle `E_r/A` is a fibre, not a modular curve
   quotient: it is the real genus-one curve without real points over the torus `E_r`. The arithmetic
   Klein surface is the base. The parameter `r` is a coordinate on one arc of the real oval of
   `X_0(4)`: `r^-4 = lambda(2 tau_E)`, `tau_E = iK'/(2K)`. The Fricke involution `w_4` is
   `r^-4 -> 1 - r^-4` (exchange of `K` and `K'`), fixed point `r = 2^(1/4)`. Completed zeta is the
   Mellin transform along this arc of `sqrt(2K/pi)`, the square root of the real period of `E_r`
   (formula (2.3), checked to 15 digits). The functional equation used in all 14 earlier lanes is the
   fibre map `w -> 1/w`, which is a property of the chart; the arithmetic functional equation is the
   base map `w_4`. This is why `r`-averaging and the `(Z/2)^3` fibre symmetry carried no arithmetic.
2. Hecke equivariance inside the geometry (section 3). The Epstein zeta function of a torus satisfies
   the Hecke relation `sum over the p+1 index-p subtori = (p^s + p^(1-s)) x itself` for EVERY torus
   (PROVED, two lines). It holds verbatim at tori whose Epstein function has off-line zeros. An Euler
   product in `s` for one torus needs more: the Hecke/Galois orbit of the torus must be a single
   point (CM with class number one). On the zeta-view arc these are exactly the five tori
   `K'/(2K) = sqrt(n)`, `n = 1, 2, 3, 4, 7`.
3. Experiment (section 4, MEASURED). On `1 < t < 80`: `N_right = 0` at `n = 1, 2, 3, 4, 7`;
   `N_right = 11, 9, 10, 9, 10` at `n = 5, 6, 8, 9, 10`; an off-line pair already at `n = 1.003`.
   For `D = -20` and `D = -23` each single class has off-line pairs (8 to 11 of them) and the sum
   over the class group (the Heegner orbit) has none.
4. Class number relations (section 5). They count fixed points of Hecke correspondences in the
   moduli variable. Their real/conjugate-pair split is governed by genus theory and most
   intersections are NOT real (real fraction 0.035 at `n = 100003`). They are traces on a Hecke
   module; `N_right` depends on the vector inside the module, so no trace count constrains it
   (Proposition 4). The one zero statement a Lefschetz count does give is the central parity: the
   number of weight-2 level-p forms with odd order of vanishing at the centre equals
   `(g + 1 - #Fix(w_p)/2)/2` with `#Fix(w_p)` a class number (checked for 13 primes). This is the
   arithmetic form of the Klein seam sign of g-klein-bottle-seam; like it, it is blind to off-line
   pairs.
5. Single-torus trapping (section 6, PROVED modulo MEASURED numerics; classical in content:
   Deuring 1933, Stark 1967). At a class-number-one CM torus with `y = sqrt|D|/2`, the function
   `zeta(s) L(s, chi_D)` equals a single cosine plus a Bessel tail on the critical line, and the
   cosine dominates for `t < T_0 ~ 2 pi y + 2`. Sign alternation plus the argument-principle count
   forces every zero in the window onto the line. For `D = -163`: 46 zeros in `1.48 < t < 42.01`
   forced, equal to `N_K = 46`; this contains the first 7 zeros of zeta. The step that uses the
   Euler product is "the Hecke orbit is one torus". Class number one stops at `|D| = 163`
   (Heegner-Baker-Stark), so the ceiling is `t ~ 42.6`. On the zeta-view arc the best torus is
   `n = 7` (`r = 31.906` or `r = 1.0647`), window `2.91 < t < 15.80`, which holds the first zero of
   zeta only.

Answer to the lane question. Zeros on the critical line are real points of the spectral Klein
structure `s -> 1 - conj s`; Hecke intersections are counted in the moduli Klein structure
`z -> -conj z`. The two structures are in dual variables and no exact count on the second
constrains the split on the first, beyond the central parity. The geometric trace formula reaches
(i) parity at the centre, (ii) the size of each local Euler factor in characteristic p, where
`T_p = F + V`, and (iii) zeros below height `~ pi sqrt|D|` at class-number-one tori. It stops at
the absence of a factorisation of `T_p` over R or C and at the finiteness of class number one.

## 1. Plan: what is new relative to the atlas, the walls and the 14 lanes

- No atlas route, user PR (43, 49, 56, 57) or g-lane uses the modular curve, the Fricke involution
  or Hecke correspondences on the torus family (grep of the PR refs: no occurrence). g-torus-modular
  averaged over `r` and found no effect; section 2 explains why and where the arithmetic sits.
- g-klein-bottle-seam classified the invariants of one loaded torus (`N_K`, seam sign). Here the
  torus varies and the loading is the lattice itself (Epstein zeta), so Hecke operators act.
- Walls. DH: section 7. Verified height: section 6 is a finite-height statement and is labelled
  as such. MV-CAP and flow-blindness: the section 6 mechanism is pointwise in `t` and is not stable
  under perturbing the torus (section 4, `n = 1.003`), so neither wall applies to it; it is limited
  by its own ceiling instead.

## 2. Identification of the Klein surfaces

Conventions (zeta-view `docs/KLEIN-ANNULUS.md`): `E_r: eta^2 = (w^2+r^2)(w^2+r^-2)`, `m = r^-4`,
`K = K(m)`, `K' = K(1-m)`, uniformisation `z = 4Ku + 2iK'(v - 1/2)`, period lattice
`4K Z + 2iK' Z`, so `tau_E = iK'/(2K)`.

**Proposition 1 (PROVED from CLASSICAL facts; numerics in `e1.log`).**

(a) Fibre. `E_r` is a real elliptic curve with rectangular lattice. Its antiholomorphic involutions
in the zeta-view group are `R`, `C` (two fixed ovals each, quotient an annulus) and `A`, `DC` (free,
quotient a Klein bottle). In the Alling-Greenleaf classification `E_r/A` is the genus-one Klein
surface with no boundary: the real form of `E_r` with no real points (a torsor under the real
curve `E_r/R`-form). It is determined by `tau_E` alone. It is not a quotient of a modular curve.

(b) Base. `lambda(2 tau_E) = r^-4` (Jacobi: `lambda(iK'/K) = m`). `tau -> 2 tau` conjugates
`Gamma_0(4)` to `Gamma(2)`, so `r^-4` is a Hauptmodul on `X_0(4)` and `r in (1, inf)` parametrises
the arc `tau_E in i R_{>0}` of `X_0(4)(R)` from the cusp `0` (`r -> 1`) to the cusp `inf`
(`r -> inf`). `X_0(4)` has genus 0 and one real oval (three arcs between the cusps `0, 1/2, inf`);
`X_0(4)/conj` is a closed disc. The Fricke involution `w_4: tau -> -1/(4 tau)` acts on the arc by
`K <-> K'`, i.e. `r^-4 -> 1 - r^-4`, with fixed point `r = 2^(1/4)` (the lemniscatic torus,
`tau_E = i/2`). The level-one inversion `tau -> -1/tau` fixes `r = 1 + sqrt 2` (`tau_E = i`).
Measured: `lambda(2 tau_E) - m = 0` to 31 digits at five values of `r`; `t t' = 1.000000000000000`
for `t = K'/K` under `r -> r'`.

(c) Theta is the square root of the period. `theta_3(e^{-pi K'/K})^2 = 2K/pi` (Jacobi; checked to
31 digits). Hence, with `Lambda(s) = pi^(-s/2) Gamma(s/2) zeta(s)`, `t(m) = K'(m)/K(m)`,

    Lambda(s) = 1/(s(s-1)) + int_0^{1/2} (1/2)(sqrt(2K(m)/pi) - 1) (t^(s/2) + t^((1-s)/2)) (1/t) * pi/(4 m (1-m) K^2) dm.   (2.3)

The range `0 < m <= 1/2` is `r >= 2^(1/4)`: the half-arc from the Fricke fixed point to the cusp.
Measured: both sides agree to 15 digits at `s = 3`, `1/2 + 5i`, `0.3 + 21i`, and to `2e-27`
absolute at the first zeta zero.

(d) Two functional equations. In the zeta-view construction `s -> 1 - s` is the fibre automorphism
`w -> 1/w` (`RC`, or the half-period translation `tau = D.RC`, a 2-isogeny of the fibre). It holds
for any `F` with `F(1-s) = F(s)` and carries no arithmetic; this is the statement of
g-symmetry-schur Theorem 1. The functional equation of zeta as an arithmetic fact is `w_4` on the
base, through (2.3). The loaded field `f = F o s` is constant along the base, which is why
g-torus-modular found that averaging over `r` changes nothing.

Remark (spin). `sqrt(2K/pi)` is a section of the square root of the Hodge bundle over the arc; it
exists on `X_0(4)` and not on `X(1)` because a square root of the period needs a theta
characteristic. This is the weight-1/2 (metaplectic double cover) analogue of the cubic theta
functions behind the 7/8 half-plane. It is a restatement of Jacobi, not a new input.

## 3. Hecke equivariance on the family of tori

For a lattice `L` in C with covolume `|L|` put `Z(L, s) = |L|^s sum'_{omega in L} |omega|^(-2s)`
and `E*(z, s) = pi^-s Gamma(s) (1/2) Z(Z + zZ, s)`. `E*(z,s) = E*(z,1-s)`, `E*` is
`SL_2(Z)`-invariant in `z`, and `E*(z, 1/2 + it)` is real for every `z` (not only real `z`).

**Proposition 2 (PROVED).** For every lattice `L` and every prime `p`,

    sum over the p+1 sublattices L' of index p of Z(L', s) = (p^s + p^(1-s)) Z(L, s).

Proof. A vector of `L` outside `pL` lies in exactly one `L'`; a vector of `pL` lies in all `p+1`.
So `sum_{L'} sum'_{L'} |omega|^(-2s) = (1 + p * p^(-2s)) sum'_L |omega|^(-2s)`, and `|L'| = p|L|`. QED.

Consequences.
- As a function on the space of tori the Epstein zeta function is a Hecke eigenfunction with
  eigenvalue `p^s + p^(1-s)` at every `s`. This holds at tori whose `Z(L, .)` has off-line zeros.
  Hecke equivariance in the lattice variable is automatic and does not separate anything.
- An Euler product for the single function `s -> Z(L, s)` requires the sum over the `p+1` isogenous
  tori to return multiples of `Z(L, .)` itself. CLASSICAL: for `L` with CM by an order of
  discriminant `D`, `Z_Q = (w/h) sum_psi conj(psi)(Q) L(psi, s)` over class group characters, so
  `Z_Q` is one Euler product iff `h(D) = 1`. For `h(D) > 1` it is a sum of distinct Euler products
  (Davenport-Heilbronn 1936 treated exactly this class). For non-CM `L` there is no Euler product.
- On the zeta-view arc (`x = 0`, form `x^2 + n y^2`, `K'/(2K) = sqrt n` or `1/sqrt n`) the
  class-number-one tori are `n = 1, 2, 3, 4, 7`. Checked at `s = 2.3 + 1.1i` to 15 digits
  (`localfactor.log`): `(1/2) sum' (a^2 + n b^2)^(-s) = zeta(s) L(s, chi) x local factor`, with
  local factor `2` (`n = 1`), `1` (`n = 2`), `1 + 2u^2` (`n = 3`), `1 - u + 2u^2` (`n = 4`),
  `1 - 2u + 2u^2` (`n = 7`), `u = 2^(-s)`; all local zeros have `Re s = 1/2`.
  `r` values (`rvalues.log`): `n = 1: 2.41421`; `n = 2: 4.61158 / 1.55377`; `n = 3: 7.59575 /
  1.30323`; `n = 4: 11.57043 / 1.18921`; `n = 7: 31.90585 / 1.06471`.

## 4. Experiment: on-line zeros and off-line pairs along the oval (MEASURED)

`scan_oval.py`, window `1 < t < 80`. `N_on`: sign changes of the real function on the line (grid
0.02). `N_K = N_on + 2 N_right = (1/pi) x` argument change along `1/2 + i -> 5 + i -> 5 + 80i ->
1/2 + 80i` (g-klein-bottle-seam Theorem 1). Off-line zeros located by Newton. Function values are
Arb enclosures with relative radius below `1e-12`, precision raised adaptively.

Tori on the arc, `z = i sqrt(n)`:

| n | h(-4n) | N_on | N_K | N_right | lowest off-line zero |
|---|---|---|---|---|---|
| 1 | 1 | 58 | 58 | 0 | - |
| 1.001 | - | 58 | 58 | 0 | - |
| 1.003 | - | 56 | 58 | 1 | 0.52265 + 49.74812i |
| 1.01 | - | 52 | 58 | 3 | 0.61186 + 49.74441i |
| 1.03 | - | 40 | 58 | 9 | 0.65986 + 32.73453i |
| 1.1 | - | 47 | 59 | 6 (5 located) | 0.77432 + 21.59844i |
| 1.3 | - | 41 | 61 | 10 | 1.86035 + 11.74984i |
| 1.6 | - | 40 | 64 | 12 | 1.15897 + 17.07243i |
| 2 | 1 | 67 | 67 | 0 | - |
| 2.03 | - | 53 | 67 | 7 | 0.73719 + 30.57466i |
| 3 | 1 | 73 | 73 | 0 | - |
| 4 | 1 | 76 | 76 | 0 | - |
| 5 | 2 | 57 | 79 | 11 | 0.93297 + 15.66825i |
| 6 | 2 | 63 | 81 | 9 | 0.80375 + 15.11758i |
| 7 | 1 | 83 (grid 0.004) | 83 | 0 | - |
| 8 | 2 | 64 | 84 | 10 | 0.78747 + 18.92501i |
| 9 | 2 | 67 | 85 | 9 | 0.86509 + 20.64734i |
| 10 | 2 | 67 | 87 | 10 | 0.76063 + 20.25925i |

At `n = 7` the 0.02 grid gives `N_on = 81`; the 0.004 grid resolves two pairs of on-line zeros with
gap about 0.008 near `t = 53.246` and `t = 62.318` and gives 83 (`fine7.log`).

Heegner orbits:

| object | N_on | N_K | N_right |
|---|---|---|---|
| D=-20, class [1,0,5] (`n = 5` above) | 57 | 79 | 11 |
| D=-20, class [2,2,3] | 45 | 61 | 8 (zeros up to Re s = 2.079) |
| D=-20, sum of the two classes | 79 | 79 | 0 |
| D=-23, class [1,1,6] | 63 | 81 | 9 |
| D=-23, class [2,1,3] (= [2,-1,3]) | 55 | 63 | 4 |
| D=-23, sum over the three classes | 81 | 81 | 0 |
| D=-163, class [1,1,41] (h = 1) | 104 | 104 | 0 |

Reading. The locus `N_right = 0` on the arc is not open: at `n = 1.003` a pair has already left the
line at `t = 49.7`. As the window grows the set of tori with no off-line pair shrinks onto the
class-number-one points. In the picture of chambers and walls (a pair leaves the line when the
torus crosses a wall), the Euler-product tori are the points not enclosed by any wall. `N_K` varies
slowly with the torus; the split between `N_on` and `2 N_right` is what the arithmetic of the torus
controls. The zeros at the `h = 1` points being on the line in this window is the known numerical
status of zeta and of the five Dirichlet L-functions, not a new verification.

## 5. What class number relations count

Three real structures occur, in different variables:

| space | involution | fixed (real) points | exact count |
|---|---|---|---|
| spectral plane | `s -> 1 - conj s` | on-line zeros | `N_K = N_on + 2 N_right` (argument principle) |
| moduli `X(1)` | `z -> -conj z` | CM points with real `j` = ambiguous classes | `T_n . Delta = real + 2 pairs` (Hurwitz-Kronecker) |
| `X_0(p)` mod p | Frobenius | supersingular `j` in `F_p` | `(h(-4p) + [p = 3 mod 4] h(-p))/2` (Deuring) |

**E3 (MEASURED, `e3.log`).** For non-square `n`, `sum_{t^2 < 4n} H(4n - t^2) = 2 sum_{d | n, d >
sqrt n} d` reproduced for `n = 2, ..., 100003`. Split of the intersection points of `T_n` with the
diagonal into real points of `X(1)` and conjugate pairs:

| n | total | real | in pairs | real fraction |
|---|---|---|---|---|
| 11 | 22 | 20 | 2 | 0.909 |
| 101 | 202 | 102 | 100 | 0.505 |
| 1009 | 2018 | 884 | 1134 | 0.438 |
| 10007 | 20014 | 1114 | 18900 | 0.056 |
| 100003 | 200006 | 7056 | 192950 | 0.035 |

The real count is the number of ambiguous classes (genus theory, `2^(mu-1)` per discriminant). So
in the variable where class number relations apply, the statement "all intersections are real" is
false, and the split is known exactly. It is a statement about 2-torsion of class groups.

**E4 (MEASURED, `e4.log`; formula CLASSICAL).** Lefschetz for `w_p` on `X_0(p)`:
`Tr(w_p | S_2(p)) = 1 - #Fix(w_p)/2`, `#Fix(w_p) = h(-4p) + [p = 3 mod 4] h(-p)`. Independent
count: `w_p = -Frobenius` on the supersingular module, so `Tr = 1 - #{supersingular j in F_p}`.
`2 x #{supersingular j in F_p} = #Fix(w_p)` holds for all 13 primes tested (brute-force point
counts). The number of weight-2 forms of level `p` with root number `-1`, each of which has a zero
of odd order at the Fricke-fixed point `s = 1/2`, is `(g + 1 - #Fix/2)/2`: 37 -> 1, 67 -> 2,
163 -> 6, 389 -> 11, 997 -> 38. This is a class-number count that constrains zeros, and it is
exactly the mod-2 seam invariant: parity of the on-line count at the centre.

**Proposition 4 (traces do not see vectors; PROVED, linear algebra).** Let `V` be a finite
dimensional Hecke module of Dirichlet series with a common functional equation and let `c` be any
quantity computed from the numbers `Tr(T_n g | V)`, `g` in the group generated by the real
structure and the Fricke involution. Then `c` is the same for every `F` in `V`. `N_right(F; window)`
is not constant on `V`. Example (section 4): `V = span{Z_[1,0,5], Z_[2,2,3]}` for `D = -20`, with
`N_right = 11, 8, 0` at the two classes and their sum. Hence no intersection number of Hecke
correspondences with the diagonal, the real locus or the Fricke graph determines or bounds the
on-line/off-line split of an individual element. The DH function lies in the two-dimensional
module spanned by `L(s, chi)` and `L(s, conj chi)`, `chi` mod 5, with traces `2 Re chi(n)`; it has
the same trace data as that module's eigenvectors.

Where the trace formula does give a location statement (CLASSICAL).
- Characteristic p. On `X_0(N)` mod `p`, `T_p = F + V` with `F V = p` and `V` the Rosati adjoint of
  `F` (Eichler-Shimura). Positivity of the Rosati form (Hodge index on the surface
  `X_0(N) x X_0(N)`) applied to `F` gives `|alpha| = sqrt p`: the zeros of each local factor
  `1 - a_p p^-s + p^(1-2s)` lie on its critical line. The fixed-point counts of `F^n` are class
  numbers. This is the complete geometric trace-formula proof of a Riemann hypothesis and it is
  local in `p`.
- Over C or R. `T_p` is Rosati self-adjoint; positivity gives that the `a_p` are totally real and
  nothing on their size. A factorisation `T_p = F + F'`, `F F' = p`, cannot exist in the
  endomorphism algebra of the Jacobian when that algebra is the (totally real) Hecke algebra,
  because `F` would generate a CM field. The real structure `z -> -conj z` commutes with `T_p` and
  supplies no factor.
- Zeta itself is the Eisenstein (boundary) part: `T_p` eigenvalue `1 + p`, Frobenius eigenvalues
  `1` and `p`, not pure of weight one. The characteristic-p mechanism gives nothing for it.
- In the Selberg trace formula for `SL_2(Z)` the class numbers are on the geometric side and the
  zeros of zeta enter through the scattering term `phi'/phi`, `phi(s) = Lambda(2s-1)/Lambda(2s)`,
  as resonances at `Re s = beta/2`. The line `Re s = 1/4` (RH) is not the fixed line of the
  trace formula's own real structure (`Re s = 1/2`, where `phi` is unitary whatever the zeros do).
  So on the modular surface the zeros of zeta are not on any real locus, with or without RH.

## 6. Single-torus trapping at class-number-one points

**Proposition 5 (PROVED given the two numerical inputs (i), (ii); classical in content).** Let
`h(D) = 1`, `z_D` the CM point, `y = sqrt|D|/2`. On the critical line

    E*(z_D, 1/2 + it) = 2 |A(t)| cos phi(t) + delta(t),   A(t) = Lambda(1 + 2it) y^(1/2 + it),  phi = arg A,

where `delta` is the Bessel series of the Chowla-Selberg formula, real, and
`E*(z_D, s) = pi^-s Gamma(s) (sqrt|D|/2)^s (w/2) zeta(s) L(s, chi_D)`. `|A| != 0` because
`zeta(1 + 2it) != 0`. Let `t_k` be the points with `phi(t_k) = k pi`. If
(i) `rho(t_k) = |delta(t_k)|/(2|A(t_k)|) < 1` for `k_0 <= k <= k_1`, then `E*` has sign `(-1)^k`
at `t_k`, so `zeta(s) L(s, chi_D)` has at least `k_1 - k_0` zeros on the line in
`(t_{k_0}, t_{k_1})`. If (ii) the argument-principle count `N_K` on that window equals
`k_1 - k_0`, every zero of `zeta(s) L(s, chi_D)` with `t_{k_0} < Im s < t_{k_1}` is on the line
and simple. QED.

MEASURED (`e5.log`, `e5b.log`):

| D | y | 2 pi y | first t with rho >= 1 | window | forced on line | N_K |
|---|---|---|---|---|---|---|
| -163 | 6.3836 | 40.11 | 42.58 | (1.482, 42.011) | 46 | 46 |
| -67 | 4.0927 | 25.72 | 28.04 | (1.988, 26.848) | 22 | 22 |
| -43 | 3.2787 | 20.60 | 21.81 | (2.375, 20.971) | 14 | 14 |
| -28 (n = 7 on the arc) | 2.6458 | 16.62 | 16.69 | (2.907, 15.800) | 8 | 8 |
| -19 | 2.1794 | 13.69 | 14.84 | (3.619, 12.723) | 5 | 5 |
| -16 (n = 4) | 2 | 12.57 | 12.20 | (4.047, 10.541) | 3 | 3 |
| -12 (n = 3) | 1.7321 | 10.88 | 11.15 | (5.001, 9.981) | 2 | 2 |
| -11, -8 | 1.66, 1.41 | 10.4, 8.9 | 10.2, 10.7 | short | 1 | 1 |
| -7, -4, -3 | <= 1.33 | <= 8.3 | - | none | 0 | - |

`rho` at the marks for `D = -163`: `1.4e-13` at `t = 8.3`, `9.1e-11` at `13.4`, `3.1e-8` at `18.2`,
`1.8e-4` at `26.4`, `5.8e-3` at `30.2`, `0.49` at `37.8`, `0.95` at `41.4`. The window for `-163`
contains the zeta zeros `14.13, 21.02, 25.01, 30.42, 32.94, 37.59, 40.92` and 39 zeros of
`L(s, chi_-163)`.

Where the Euler product enters. Only in the hypothesis `h(D) = 1`: the Euler product
`zeta(s) L(s, chi_D)` is then the Epstein function of ONE torus, whose constant term is ONE cosine.
For `h(D) > 1` the Euler product is the sum over `h` tori with different heights `y_Q =
sqrt|D|/(2a)`; the main term becomes `2 Re [Lambda(1+2it) (sqrt|D|/2)^(1/2+it) sum_Q a_Q^(-1/2-it)]`,
a Dirichlet polynomial over the reduced forms, and the Bessel tail is small only for
`t < 2 pi min_Q y_Q = O(1)`. A single class of a class group with `h > 1` (the DH-type object)
keeps one cosine and passes the cosine step for `t < T_0` (CLASSICAL, Stark 1967; not re-run here), but it is not the
Euler product, and above `T_0` its pairs leave at once (section 4: first pair of `[1,0,5]` at
`t = 15.67`, `2 pi y = 14.05`).

Ceiling. `T_0 = 2 pi y + O(1) = pi sqrt|D| + O(1)`. Class number one occurs for 13 discriminants,
largest `|D| = 163` (Heegner, Baker, Stark). So the mechanism certifies zeros of zeta to
`t = 42.0` and cannot be extended. In the opposite direction this is Deuring's theorem: an off-line
zero of zeta at height `t` forces `h(D) > 1` for `pi sqrt|D| > t + O(1)`.

## 7. Controls

| control | sections 2-3 (identities) | section 5 (trace counts) | section 6 (single-torus trapping) |
|---|---|---|---|
| DH / Epstein with h > 1 | hold: FE, Hecke relation of Prop. 2, reality on the line | same trace data as the eigenvectors of its module (Prop. 4) | FAILS at "Hecke orbit is one torus": the Euler product is a sum over h tori, the single cosine is lost. Structural. A single class passes the cosine step up to `T_0` and has off-line pairs above it |
| backward heat | not formulable on lattices (no torus has the heat-deformed kernel as theta function) | not formulable | not formulable |
| sign twist `eps_n Lambda(n)` | no functional equation, so no torus | not formulable | not formulable |
| `zeta(s+a) zeta(s-a)` | not an Epstein function of a lattice | - | not formulable |

The section 6 mechanism is the only step in this lane that DH fails for a structural reason. It is
also the only step with a hard ceiling.

## 8. Verdict

Precise obstruction. Stated as a chain:

1. The user's Klein bottle is a fibre; its invariants are those of g-klein-bottle-seam and are
   Euler-blind. The arithmetic Klein surface is the base `X_0(4)/conj`, on which `r` is the
   coordinate, Fricke `w_4` is the functional equation and `sqrt(period)` is theta (Prop. 1).
2. Putting multiplicativity inside the geometry means evaluating at Hecke-closed tori. Hecke
   equivariance over all tori is automatic (Prop. 2); Hecke closure of one torus is class number one.
3. Real-locus intersection counts of Hecke correspondences are class numbers. They split into real
   points and conjugate pairs by genus theory, mostly pairs (E3). They are traces and cannot see
   the on-line/off-line split of a vector (Prop. 4). The single zero statement they give is the
   central parity (E4).
4. The geometric trace formula proves a Riemann hypothesis exactly where `T_p` factors as
   `F + F'` with `F F' = p`: characteristic p, cuspidal part. No factorisation exists over R or C,
   and zeta is in the non-pure Eisenstein part.
5. Class-number-one tori trap the zeros of `zeta(s) L(s, chi_D)` on the line below
   `t ~ pi sqrt|D|` by a cosine-dominance argument that DH-type sums fail structurally (Prop. 5).
   The list of such tori is finite; the ceiling is `t = 42.0` (seven zeta zeros).

No pivot was needed; item 5 is the strongest adjacent idea and is itself closed by Heegner-Baker-Stark.

## 9. Three weakest steps

1. Proposition 5 is applied with MEASURED inputs. The marks `t_k` come from linear interpolation of
   a float phase (the argument needs only `|cos phi(t_k)| > rho(t_k)`, which holds with margin
   except at the last one or two marks of each row, where `rho` is 0.77 to 0.998), and `N_K` is a
   float argument-change sum, not an interval enclosure. Interval certification is routine and was
   not done. The same applies to every `N_right` in section 4; one off-line zero at `n = 1.1` was
   counted and not located.
2. Proposition 4 excludes trace-type counts only. It does not exclude invariants of an eigenvector
   that are not traces (section 6 is one). The statement "no exact count on the moduli side
   constrains the spectral split beyond central parity" is proved for counts of the stated form and
   is otherwise a finding of this lane, not a theorem.
3. The identification in section 2 chooses the base `X_0(4)` because `r^-4` is its Hauptmodul and
   theta lives there. The zeta-view documents define the Klein surface as the fibre quotient
   `E_r/A`. Saying "the arithmetic lives in the base" is an interpretation of formula (2.3), which
   is Jacobi's; no new identity relating the PR 56 bridge form to the base is derived. The
   characteristic-zero no-factorisation remark uses End(J_0(N)) (x) Q = Hecke algebra, which is
   CLASSICAL for squarefree level (Ribet) and was not re-derived.

## 10. Files

`epstein.py` (Chowla-Selberg evaluation, three sanity checks), `scan_oval.py`, `scan_int.json`,
`scan_near.json`, `scan_cm.json`, `fine7.py`, `fine7.log`, `e1_period_mellin.py`, `e1.log`,
`e3_hurwitz_split.py`, `e3.log`, `e4_fricke_lefschetz.py`, `e4.log`, `e5_stark_range.py`, `e5.log`,
`e5b.log`, `e5_stark.json`, `localfactor.log`, `rvalues.log`. All runs local, python-flint 0.9.0
and mpmath, each under 10 minutes. The motherbox was not used.
