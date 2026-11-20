# h-tnr-geometric: controls for the geometric-arithmetic program

Date 2026-11-16. Lane: build the three stronger controls, load them on the ladder/torus the same way
as xi, compute field, zeros, bridge sector forms and Hecke action for each, and state the minimal
geometric package that excludes all of them. Not refereed. Nothing here proves or refutes RH; no bound
moves. Labels: PROVED (argument given here) / CLASSICAL / MEASURED (mpmath, not interval-certified) / OPEN.

## Verdict

**Precise obstruction, stated as a specification.** Three PROVED structural facts and one table.

1. **The T-NR twin is a Hecke operator applied to the zeta ladder** (Prop 1). With the rung shift
   `V_q` (move the ladder `Z` to its index-`q` sub-ladder `qZ`) and `T_q = V_q + V_q^{-1}`,
   `xi*(s)(2cosh((s-1/2)log q) + c)` is the Mellin transform of `(T_q + c) psi`. Equivalently it is
   Tate's zeta integral with the self-dual local test function
   `q^{1/2} 1_{qZ_q} + c 1_{Z_q} + q^{-1/2} 1_{q^{-1}Z_q}` at `q` in place of `1_{Z_q}`.
2. **Hecke-positive-cone no-go** (Prop 2). For `c > 2` the operator `T_q + c` is self-adjoint,
   bounded below by `c - 2 > 0` and invertible on the critical-line Hilbert space, commutes with the
   Fricke inversion and with every rung shift, maps positive even kernels to positive even kernels,
   and keeps the Euler product, the gamma factor and the single pole. It moves zeros to
   `Re s = 1/2 +- arccosh(c/2)/log q`. So any set of hypotheses preserved by positive invertible
   elements of the Hecke algebra cannot imply RH, and Hecke equivariance (with Fricke symmetry and
   kernel positivity) is not sufficient. The new zeros are on the line iff `-c` lies in the spectrum
   `[-2,2]` of `T_q`; this is the sharp threshold (Kesten spectrum of the lattice graph; Hasse bound
   for the numerator polynomial `1 + c q^{1/2} x + q x^2`).
3. **Why Davenport-Heilbronn is not an eigen-object** (Prop 3). In the plane spanned by the `chi`
   and `chi-bar` ladders (mod 5) the Fricke involution swaps the two Hecke eigenlines, so every
   Fricke-invariant vector has both components nonzero and is not an eigenvector of `U_p` for
   `p = +-2 mod 5`. DH **is** an eigenvector of `U_p` for every `p = +-1 mod 5` and for `p = 5`.
4. **zeta(s+a)zeta(s-a) is the torus itself at real shear** (refereed g-torus-modular P2), has
   `Lambda >= 0`, an Euler product, the functional equation, and a positive, log-concave,
   Csordas-convex kernel (MEASURED), and has all zeros at `Re s = 1/2 +- a`.

Minimal package (section 6): Fricke symmetry; one simultaneous Hecke eigen-object; unitary local
parameter at every place (imaginary shear); the spherical (single-ladder) vector at every prime.
Each control fails exactly one item. The package is the description of a standard L-function of a
unitary automorphic representation. No control fails it, and no lane derives zeros on the line from it.

## 0. Plan; what is new relative to the atlas, walls and earlier lanes

- TABLE.md lists NR and EA as controls with most cells inferred (starred). r3-tnr-control ran NR
  against the 7/8 argument only. No lane loaded NR or EA on the ladder/torus or computed their bridge
  forms. This note does, and replaces inferred cells by computed ones (section 5).
- New: Prop 1-3; the additivity `P_NR = P_zeta + P_D` (section 3); first negative Pick orders for
  NR and EA (4 and 7, against 149 for DH); the statement that only `p = 2` Hecke neighbours of a
  Klein-foldable torus are Klein-foldable (section 4c).
- Not re-run: eq48, Krein index, Pick positivity for zeta, the 7/8 argument.
- Walls: this lane proposes no zero-location argument. Section 6 lists what any argument must fail on.

## 1. The four loadings

`s = 1/2 + z`. `F(z) = int kappa(u) e^{zu/2} du`, `L = F'/F`. `psi(x) = sum_{n>=1} e^{-pi n^2 x}`,
`M[f](s) = int_0^inf f(x) x^{s/2} dx/x`, `M[psi] = xi*(s) = pi^{-s/2} Gamma(s/2) zeta(s)`.

| label | field | kernel `kappa_X(u)` |
|---|---|---|
| zeta | `xi(1/2+z)` | `kappa(u) = Phi(|u|/4)` |
| DH | `(5/pi)^{s/2} Gamma((s+1)/2) f(s)`, `f = w L(chi) + conj(w) L(conj chi)`, `w = (1 - i kappa_0)/2`, chi mod 5 | `e^{3u/4} sum a(n) n e^{-pi n^2 e^u/5}`, `a = (1, k0, -k0, -1, 0)` |
| NR | `xi(1/2+z)(2cosh(z log 3) + 2.2)` | `kappa(u + 2 log q) + kappa(u - 2 log q) + c kappa(u)` |
| NRt | same with `c = 1` (tempered reference, `|c| <= 2`) | same |
| EA | `xi(1/2+z+a) xi(1/2+z-a)`, `a = 0.3` | `int kappa(v) kappa(u-v) e^{a(2v-u)/2} dv` |

MEASURED (`main.py`): `int kappa_X e^{zu/2} du / F(z)` at `z = 0.3 + 4i` equals 1 to 1e-28 for zeta,
NR, NRt, EA and the constant `(5/pi)^{1/2} = 1.26157` for DH.

Kernel properties on `u in [0,8]`, step 0.05 (MEASURED):

| | zeta | DH | NR c=2.2 | NRt c=1 | NR c=-2.2 | EA |
|---|---|---|---|---|---|---|
| `kappa > 0` | yes | yes | yes | yes | no (`kappa(0) = -0.983`) | yes |
| log-concave | yes | yes | no (second difference of log up to +38) | no | - | yes |
| `-log kappa(sqrt t)` convex (Csordas) | yes | yes | no | no | - | yes |
| modes on `u >= 0` | 1 | 1 | 2 (bumps at 0 and `2 log 3`) | 2 | - | 1 |

Reading: kernel shape does not track zero location. EA and DH pass every kernel test and have
off-line zeros; NRt fails log-concavity and Csordas convexity and has no off-line zero other than
any zeta may have.

## 2. Hecke action

### Prop 1 (ladder Hecke operator; T-NR is a Hecke image). PROVED.
Let `(V_q f)(x) = q^{1/2} f(q^2 x)` and `(J f)(x) = x^{-1/2} f(1/x)`. Then

- `M[V_q f](s) = q^{1/2-s} M[f](s)`, `M[J f](s) = M[f](1-s)`, `J V_q J = V_q^{-1}`.
- `V_q` is unitary on `H = L^2(R_+, x^{-1/2} dx)` (the Plancherel space of `Re s = 1/2`), so
  `T_q = V_q + V_q^{-1}` is self-adjoint with spectrum `[-2,2]` (multiplication by `2cos(t log q)`),
  and `[J, T_q] = 0`.
- `V_q psi = q^{1/2} sum_n e^{-pi (qn)^2 x}` is the loading of the sub-ladder `qZ`; `V_q^{-1} psi`
  is the loading of the super-ladder `q^{-1}Z`. These are the two neighbours of `Z` in the lattice
  graph of `Q_q` (a line, 2-regular).
- `M[(T_q + c) psi](s) = xi*(s)(2cosh((s-1/2)log q) + c)`.

Proof: substitution `x -> q^2 x` and `x -> 1/x`; `J V_q J f(x) = q^{-1/2} f(x/q^2)`. QED.
MEASURED (`hecke.py`): the last ratio at `s = 3.2 + 1.7i`, `q = 3`, `c = 2.2` is `1 - 1e-32 i`.

Adelic form (CLASSICAL computation, Tate): with `Phi_q = q^{1/2} 1_{qZ_q} + c 1_{Z_q} + q^{-1/2} 1_{q^{-1}Z_q}`,
`int Phi_q(x)|x|^s d*x = (q^{1/2-s} + c + q^{s-1/2})/(1 - q^{-s})` and `Phi_q` is its own Fourier
transform (`FT 1_{q^k Z_q} = q^{-k} 1_{q^{-k}Z_q}`). Any self-dual factorizable Schwartz-Bruhat
function gives a field with Euler product and the zeta functional equation. The standard vector is
`1_{Z_q}`.

In the kernel coordinate `u`, `V_q` is translation by `2 log q`. In the twin-ladder model
(`src/math/twin-ladder.js`: rungs `m`, amplitude `p^{-m/2}`, phase `-m T log p`) `V_p` is the shift by
one rung on the `p`-ladder.

### Prop 2 (Hecke-positive-cone no-go; sharp threshold). PROVED.
For real `c` put `A_c = T_q + c`.
(i) `A_c` commutes with `J` and with every `V_p`. For `c > 2`: `A_c >= c - 2 > 0` on `H`, bounded,
invertible; `A_c` maps positive even kernels to positive even kernels (positive combination of
translates); `A_c psi` has multiplicative coefficients, zeta's gamma factor, and one pole at `s = 1`.
(ii) The zeros of the symbol `2cosh(z log q) + c` are `z = +-delta_0 + i pi(2k+1)/log q` (`c > 2`),
`+-delta_0 + 2 pi i k/log q` (`c < -2`), `delta_0 = arccosh(|c|/2)/log q`; they lie on `Re z = 0`
iff `|c| <= 2` iff `-c in spec(T_q)`.
(iii) Hence a hypothesis set that holds for zeta and is invariant under `X -> A_c X` for some `q` and
some `c > 2` cannot imply RH; if it is invariant for `|c| >= q^{sigma_0-1/2} + q^{1/2-sigma_0}` it
cannot imply a zero-free half-plane `Re s > sigma_0`. An argument for `Re s > sigma_0` must contain,
for every prime `q`, a step that fails when `a(q) = 1` is replaced by `a(q) = 1 + c q^{1/2}` with
`|c|` at that threshold. For RH the tolerance is zero at every prime: `c = 2 + eps` gives
`delta_0 ~ sqrt(eps)/log q`.
Proof: (i) and (ii) are direct from Prop 1; (iii) is the contrapositive. QED.

Equivalent readings of the threshold `|c| <= 2` (CLASSICAL): `-c` in the `L^2` spectrum of the
adjacency operator of the lattice graph (Kesten); the polynomial `1 + c q^{1/2} x + q x^2` has roots
of absolute value `q^{-1/2}` (Hasse-Weil bound `|a_q| <= 2 q^{1/2}`, which for an actual curve is a
consequence of positivity of the Rosati involution / Hodge index). For `|c| > 2` no curve has this
Frobenius polynomial. These are the available geometric incarnations of temperedness at one prime.
For zeta itself the local parameter is 1 and the condition is satisfied with nothing to prove; the
content is that a proof must use it at each prime.

MEASURED: zero at `z = 0.403753224828 + 2.85960086738i` (predicted `delta_0 = 0.403753224828`,
`pi/log 3 = 2.859600867`); argument-principle count in `0.03 < Re z < 3`, `0.3 < Im z < 60`:
NR 10 (predicted 10), NRt 0, zeta 0.

### Prop 3 (DH in the Hecke plane). PROVED.
Let `U_p a(n) = a(pn)` on coefficient sequences and `E = span{chi, conj chi}`, chi the character
mod 5 with `chi(2) = i`. `U_p` acts on `E` as `diag(chi(p), conj chi(p))`. The functional equation
maps the `chi` line to the `conj chi` line with a unimodular factor (`W U_p W^{-1} = U_p^*`), so a
`W`-invariant vector has components of equal modulus, both nonzero. If `chi(p) != conj chi(p)`
(`p = +-2 mod 5`) such a vector is not an eigenvector. If `chi(p) = +-1` (`p = +-1 mod 5`) every
vector of `E` is an eigenvector; `U_5 = 0` on `E`. QED.
MEASURED (`hecke.py`): eigen residual `|U_p v - lambda v|/|U_p v|` = 1.0 at `p = 2, 3, 7, 13`, 0 at
`p = 11, 19`; `W U_2 W^{-1} = U_2^*` true, `[W, U_2] = 0` false. Coefficient level:
`max |a(pn) - a(p)a(n)| = 1.0807` at `p = 2, 3, 7, 13`, 0 at `p = 5, 11, 19`; 72.6% of the mass of
the log-derivative coefficients `c(n)`, `n <= 3000`, sits off prime powers (`c(6) = 1.936`).
Consequence: an argument that uses Hecke equivariance only at primes in `{5} u {p = +-1 mod 5}` is
passed by DH.

### 2d. Coefficient-level table (MEASURED, `n <= 3000`; exponents stated analytically)

| | zeta | DH | NR (q=3, c=2.2) | NRt (c=1) | EA (a=0.3) |
|---|---|---|---|---|---|
| multiplicative (`a(pn) = a(p)a(n)`, `p` not dividing `n`) | yes | no | yes | yes | yes |
| off-rung mass of `c(n)` | 0 | 0.726 | 0 | 0 | 0 |
| `Lambda >= 0` (`min c(n)/log n`) | yes | no (-3.87) | no (-64.6) | no (-8.83) | **yes** |
| rung moments `m_k(p) = c(p^k)/log p` | 1 | `m(2) = 1, .284, -2.081, ..` | `m(3) = 1, 4.81, -7.52, 22.03, -53.59`; 1 at `p != 3` | `m(3) = 1, 2.73, 4, -9.39, 10` | `p^{ka} + p^{-ka}`: `m(2) = 2, 2.043, 2.175, ..` |
| rung Toeplitz PSD (b-euler-detector `T_{p,K}`) | yes | fails `p=2, K=2` (-1.156) | fails `p=3, K=1` (-3.81) | fails `p=3, K=1` (-1.73) | fails every `p`, `K=1` (-0.043, -0.110, -0.238 at 2, 3, 5) |
| `|c(p^k)| << p^{k theta}`, `theta < 1/2` | 0 | - | no: `1/2 + delta_0 = 0.904` | no: `1/2` | yes: `theta = a = 0.3` |
| `a(n) << n^eps` | yes | yes | yes (bounded on powers of `q`) | yes | no: `n^a` |

Two points. (1) The rung Toeplitz test also rejects NRt, whose added zeros are all on the line; it is
sufficient to exclude NR but not sharp. The sharp statement in this family is Prop 2(ii).
(2) NR and EA separate the two size conditions: NR passes the coefficient bound and fails the
log-coefficient bound; EA does the reverse.

## 3. Zeros and bridge sector forms

`P_ij = (L_i + L_j)/(x_i + x_j)`, `B_ij = -(L_i - L_j)/(x_i - x_j)`, `K_e = P + B`, `K_o = P - B`
(synthesis notation). Lens `Q(z) = Re L(z)/Re z`.

**Additivity (PROVED, one line).** `L_NR = L_zeta + L_D`, `L_D(z) = 2 log q sinh(z log q)/(2cosh(z log q) + c)`,
so `P_NR = P_zeta + P_D`, `B_NR = B_zeta + B_D`, and the same for `K_e`, `K_o`: multiplying the field
by a Hecke symbol adds the bridge forms of the symbol. `P_D >= 0` on all real node sets iff `|c| <= 2`
(Pick/Loewner, as for eq48). For EA, `L_EA(z) = L_zeta(z+a) + L_zeta(z-a)` is a sum of two shifted
copies; the `-a` copy is the indefinite one.

Off-line zeros in `Re z > 0` (MEASURED; argument principle unless noted):

| | zeta | DH | NR | NRt | EA |
|---|---|---|---|---|---|
| count, `0.3 < Im z < 60` | 0 | 0 | 10 | 0 | 13 |
| located | - | `0.308517 + 85.699348i`, `0.150830 + 114.163343i` (2 in `0.1 < Re z`, `Im z < 120.3`) | `0.403753 + 2.859601(2k+1) i` | - | `0.3 + i gamma_n` |
| lens `Q` near the first off-line zero | +25.07 at `0.2 + 14.13i` | -27.13, -115.81 | -16.11 | +25.55, +2.37 | -29.49 |

Sector forms on 7 real nodes `x_k = 0.6 * 1.3^k` (60 digits, `B` diagonal by numerical derivative;
minimum eigenvalue of the unit-diagonal normalisation, number of negative eigenvalues):

| | P | K_e | K_o |
|---|---|---|---|
| zeta | 2.3e-21, 0 | 1.6e-37, 0 | 9.2e-37, 0 |
| DH | 1.2e-16, 0 | 1.4e-29, 0 | 1.9e-28, 0 |
| NR | -8.0e-6, 2 | -9.7e-3, 2 | -3.0e-4, 2 |
| NRt | 8.4e-13, 0 | 8.5e-25, 0 | 1.1e-22, 0 |
| EA | -2.0e-22, 1 | -3.7e-15, 1 | -6.4e-17, 1 |

Nested Pick pivots of `P`, 36 nodes, 500 digits, three node families (geometric, linear step 0.35,
Chebyshev on `[0.55, 6.55]`), `pivots.py`:

| | first negative order | negative pivots among 36 |
|---|---|---|
| zeta | none | 0 |
| NRt | none | 0 |
| DH | none (geometric family; 149 in the euler lane) | 0 |
| NR | 4 in all three families | 4 / 8 / 8, in pairs (4,5), (10,12), (17,18), (27,28) |
| EA | 7 in all three families | 4 / 8 / 9, in pairs (7,8), (15,16), (22,23), (30,31) |

Parameter sweep, linear nodes, 48 nodes, 700 digits (`sweep.log`): first negative order for
`c = 2.0`: none; `2.001`: 6; `2.02`: 5; `2.2`: 4; `3.0`: 3; `-2.2`: 2; `-1.0`: none; `q = 2, c = 2.2`: 4;
`q = 11, c = 2.2`: 4; `q = 11, c = 2.02`: 6. EA `a = 0.02`: 10; `0.2`: 8; `0.3`: 7. (`a = 0.1, 0.45`
not run: a node hit `s = 1` in the formula used.)

Reading (MEASURED): real-node Pick positivity detects NR and EA at orders 2 to 10, including zeros
0.02 from the line, and detects DH only at order 149. The detection order follows the height of the
lowest off-line zero (2.86, 14.13, 85.70), not its distance from the line and not the presence of an
Euler product. Negative pivots enter in pairs, consistent with the Krein index (one negative square
per zero in `Re z > 0`, conjugate pairs).

## 4. Torus level

(a) EA is the torus loading. CLASSICAL / refereed (g-torus-modular P2):
`int int (theta(t/y)-1)(theta(ty)-1) t^s y^w dt/t dy/y = 2 xi*(s+w) xi*(s-w)`. The shear exponent
`w` is the character `y^w` of the modular geodesic. Imaginary `w` (unitary character): zeros of the
product in `s` are on the line iff those of zeta are. Real `w = a`: zeros at `Re s = 1/2 +- a`.
So "bridge shear real versus imaginary" is non-tempered versus tempered, at every prime and at the
archimedean place together (gamma factor `Gamma((s+a)/2) Gamma((s-a)/2)`).

(b) Hecke eigen-relation on tori. CLASSICAL; MEASURED (`hecke.py`, lattice sum, `tau = 1.3i`, `s = 3`):
`sum over the p+1 tori p-isogenous to tau of E(tau', s) = (p^s + p^{1-s}) E(tau, s)`, ratio
`1 + 3e-13`, `1 + 4e-13`, `1 + 5e-13` for `p = 2, 3, 5`. Normalised eigenvalue `p^{s-1/2} + p^{1/2-s}`:
inside `[-2,2]` iff `Re s = 1/2`. The T-NR symbol is this eigenvalue plus `c`.

(c) Hecke neighbours and the Klein/annulus folds. PROVED (elementary): complex conjugation
`tau -> -conj tau` sends the neighbour `(iy + j)/p` to `(iy - j)/p`. For odd `p` and generic `y`
exactly two of the `p+1` neighbours (`p tau`, `tau/p`) are rectangular; for `p = 2` all three are
real (`2 tau`, `tau/2` rectangular, `(tau+1)/2` rhombic). MEASURED: `Im j/|j|` of the neighbours at
`tau = 1.3i`: `p = 2`: 0, 0, 0; `p = 3`: 0, 0, +-0.621; `p = 5`: 0, 0, +-0.775, +-0.823.
So the family of real-`r` tori with their annulus/Klein quotients is not stable under `T_p` for odd
`p`. The `(Z/2)^3` symmetry of one loaded torus (g-symmetry-schur, including its 2-isogeny `tau`)
sees the prime 2 only. Together with g-torus-modular P1 (`r` is a reference change), Hecke
equivariance has to be imposed on the loading (rung shifts `V_p`, Prop 1), not on the modulus `r`.

## 5. Property table (computed here unless marked)

P = has the property, F = fails, - = not formulable.

| property | zeta | DH | NR (c>2) | NRt (|c|<=2) | EA |
|---|---|---|---|---|---|
| Fricke symmetry, `(Z/2)^3` | P | P | P | P | P |
| kernel positive | P | P | P | P | P |
| kernel log-concave, Csordas-convex | P | P | F | F | P |
| Euler product (simultaneous `U_p` eigen-object) | P | F (`p = +-2 mod 5`) | P | P | P |
| `Lambda >= 0` | P | F | F | F | P |
| unitary local parameter / imaginary shear | P | - | P (trivial character) | P | F at every place |
| spherical vector (single ladder) at every prime | P | - | F at `q` | F at `q` | P |
| Hecke symbol in the tempered spectrum | P | - | F | P | F |
| off-line zeros | none to verified height | yes | yes | only if zeta has | yes |
| lens `Q > 0`; `P`, `K_e`, `K_o >= 0` | P | F (lens; Pick order 149) | F (order 4) | P | F (order 7) |
| zeros counted in `Re z > 0`, `Im z > 0` (each adds one negative square; conjugates double it) | 0 below 60 | 2 below 120.3 (`Re z > 0.1`) | 10 below 60 | 0 below 60 | 13 below 60 |

The other controls of TABLE.md: sign twist and Beurling fail Fricke symmetry; backward heat has no
ordinary Dirichlet series (flow-euler-defect), so it fails the eigen-object row.

## 6. Specification: the minimal package and what a geometric proof must do

Package M:
- **M1** Fricke symmetry of the loading (functional equation).
- **M2** The loading is one simultaneous eigen-object of all rung shifts `U_p` (Euler product).
- **M3** Unitary parameter at every place: imaginary shear; local Hecke eigenvalue in the `L^2`
  spectrum of the lattice graph.
- **M4** Spherical vector at every prime: the loading is the single ladder (local factor is the
  L-factor with no Hecke polynomial), or, in the sharp form, any Hecke polynomial has all roots on
  the unit circle after the weight shift.

Irredundancy (PROVED relative to the control set): DH satisfies M1 and fails only M2; EA satisfies
M1, M2, M4 and fails only M3; NR satisfies M1, M2, M3 and fails only M4; sign twist and Beurling
fail only M1 among M1, M2. Nothing weaker than all four excludes the controls.
M1-M4 is the definition of the standard L-function of a unitary automorphic representation
(in degree 1 with zeta's gamma factor it leaves zeta: CLASSICAL, Hamburger; Kaczorowski-Perelli for
degree 1 of the Selberg class). OPEN: whether M implies zeros on the line; that is GRH for this
class. No control in hand satisfies M.

Requirements on any geometric argument (each is a consequence of sections 2-4):
- **R1** It has a step that fails for a Fricke-invariant sum of two eigen-objects, and that step uses
  equivariance at primes outside `{5} u {p = +-1 mod 5}` (Prop 3).
- **R2** For every prime `q` it has a step that fails after applying the positive invertible Hecke
  operator `T_q + c`, `c > 2`; quantitatively, for `Re s > sigma_0`, at
  `|c| >= q^{sigma_0-1/2} + q^{1/2-sigma_0}` (Prop 2). An argument whose inputs are preserved by a
  positive cone of Fricke-commuting, Hecke-commuting, positivity-preserving operators is excluded.
- **R3** It has a step that fails at real shear and holds at imaginary shear (4a). Since EA has
  `Lambda >= 0`, a pole structure, an Euler product and a positive log-concave Csordas-convex
  kernel, that step uses none of those alone.
- **R4** Kernel shape (positivity, log-concavity, Csordas convexity) and `Lambda >= 0` are neither
  necessary nor sufficient in this control set: NRt lacks them and has no new off-line zero; EA and
  DH have the kernel properties and off-line zeros.
- **R5** Hecke equivariance must be built on the loading (rung shifts, Hecke neighbours of the
  ladder), not on the torus modulus: `r` is a reference change, and for odd `p` the neighbours of a
  Klein-foldable torus are not Klein-foldable (4c).

Consistency with the one mechanism that gives height-uniform information: r3-tnr-control found that
the 7/8 argument fails for NR at the local size condition `|eta(p)| = 1`. That is requirement R2.

## 7. Controls from the brief

No zero-location argument is proposed here, so nothing has to be shown to fail for DH, backward heat
or the sign twist. Each proved statement is about a control. Props 1-2 use no property of zeta beyond
the Mellin transform of `psi`; they hold verbatim with any Fricke-symmetric loading in place of `psi`
(for DH: `A_c` applied to the DH ladder adds the same off-line zeros).

## 8. Three weakest steps

1. All numerics are mpmath floating point (30 to 700 digits), not interval arithmetic. The `K_e`,
   `K_o` entries for zeta (1e-37) use a numerical derivative on the diagonal and are near the
   resolution of the 60-digit run; only their consistency with the refereed lanes is claimed. The DH
   zero count used the box `Re z > 0.1`, so DH zeros with `0 < Re z < 0.1` below height 120 are not
   counted.
2. "Detection order follows the height of the lowest off-line zero" is a reading of twelve runs on
   three node families, not a theorem. The node-family independence of the orders 4 and 7 is
   unexplained.
3. The specification M is a list of necessary conditions calibrated on five functions. Irredundancy
   is relative to this control set. "Geometric incarnation of temperedness" (Kesten spectrum, Hasse
   bound, unitary shear) is given for the local parameter of the controls; for zeta the local
   condition is trivially true, and no global mechanism that uses it is supplied. The metaplectic /
   spinor side of the brief (cubic theta, 3-fold cover) was not computed in this lane.

## 9. Next step

Find a functional of the local test vector `Phi_q` (self-dual Schwartz-Bruhat functions, Prop 1),
expressed in the bridge forms through the additivity `P = P_zeta + P_D`, that is extremal at the
standard vector `1_{Z_q}` and changes sign exactly at `|c| = 2`; then check whether it can be stated
for all `q` simultaneously without summing absolute values over primes. NR, NRt, EA and DH are the
test set: it must reject NR and EA, accept NRt, and be unformulable or false for DH at `p = +-2 mod 5`.

## Files (all under `tmp/research-2026-11-16/push/h-tnr-geometric/`)

- `common.py`: fields and log-derivatives of the controls.
- `main.py`, `main.json`, `main.log`: kernels, zeros, argument-principle counts, lens, sector forms.
- `count_dh.py`, `count_dh.log`: DH zero count in eight height chunks.
- `hecke.py`, `hecke.json`, `hecke.log`: coefficient-level Hecke tests, rung Toeplitz, DH Hecke plane,
  ladder Hecke identity, torus Hecke relation and `j`-invariants.
- `pivots.py`, `piv.log`, `sweep.log`: nested Pick pivots and the parameter sweep.
- Runs were on the motherbox in `~/rh-push/h-tnr-geometric/`, each under 2 minutes, at most 8 processes.
