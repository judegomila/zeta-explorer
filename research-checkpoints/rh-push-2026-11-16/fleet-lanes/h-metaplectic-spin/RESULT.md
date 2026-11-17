# h-metaplectic-spin: metaplectic covers as spin structures in the bridge picture

Date 2026-11-16. Lane: make the dictionary between the user's spinor/twistor/torus objects and the
metaplectic covers used by the 7/8 half-plane exact; translate the 7/8 detector into bridge language; decide
whether the bridge/antibridge sectors have a Z/3 or Z/6 refinement.
Nothing here proves or refutes RH. No bound moves. The 7/8 manuscript is unrefereed and is used as stated.
Labels: PROVED (argument in this note) / CLASSICAL (standard literature, cited) / MEASURED (floating point,
`checks.py`, 30 digits, not interval) / ARGUED / OPEN.

## 0. Verdict

**Precise obstruction, with an exact dictionary and five statements.**

1. The dictionary is exact for n = 2 and only at the real place. The user's spinor sign (PR 43
   `geometry_and_twistors.md` section 2, "a compatible local square-root lift acts by +-i") is the metaplectic
   2-cocycle of SL2 restricted to the centre {+-1}; the factor `e^{b/4}` in `H(b) = e^{b/4} theta(e^b)` (PR 43
   section 5) is the square root of the modulus of the weight-1/2 automorphy factor; `theta^2 = 2K/pi` says theta
   is the square root of an elliptic period (a period of `omega = dw/eta` after the Landen step of PR 43 section 5).
2. **Theorem A (zero-shear blindness, PROVED).** Every bridge object (kappa, H_c, P, B, the parity sectors, the
   coupling T) is a functional of the theta section restricted to the one geodesic `tau = i e^b`. The stabiliser of
   that geodesic in the modular group is `{1, S}`, and on it the metaplectic cocycle is real and positive. No bridge
   object evaluates the spin character (Jacobi symbol) anywhere. The spin sign is read only at the other cusps
   `2c/d`, i.e. in the shear coordinate `x = Re tau` (MEASURED to 1.7e-6 on 36 cusps).
3. **Theorem D (archimedean triviality, CLASSICAL).** The cubic and sextic covers used by the 7/8 mechanism are
   covers over `Q(omega)`, whose only archimedean place is complex. `SL2(C)` is simply connected and the complex
   Hilbert symbol is 1, so the 3-fold and 6-fold cocycles are trivial at infinity. They are not roots of a canonical
   bundle on a torus, on a modular curve, or on the twistor sphere. They are flat `mu_3`, `mu_6` characters given by
   residue symbols at finite primes. The geometric objects in the user's notes are all archimedean. So for n = 3, 6
   there is nothing at infinity for them to match.
4. **Theorem B (multiplicativity inside the spin picture, PROVED).** A weighted theta ladder
   `sum a(n) n^nu e^{i pi n^2 tau}` is an eigen-section of the spin-weighted Hecke correspondence `T_{p^2}` (sum over
   the `p^2 + p` sheared tori) iff `a` has an Euler factor at p. Davenport-Heilbronn is an eigen-section exactly at
   the primes `p = +-1 mod 5` and fails at every `p = +-2 mod 5` (MEASURED defect 1.65 to 15.2 relative; exact
   defect `a(6) - a(2)a(3) = 1.0807`). This is a step that DH fails for a structural reason. It is also only the
   Euler product restated: it characterises the object and gives no inequality on zeros.
5. **Theorem C (grade reflection, CLASSICAL, assembled).** On the n-fold cover the Hecke relations of the theta
   section are the involution `j -> n-2-j` on the grade `j = v_p(index) mod n`, with a Gauss sum as multiplier.
   n = 2: grade 0 is fixed, so the Jacobi theta ladder carries no Gauss sum at all (coefficients 1 on squares).
   n = 3: `0 <-> 1`, grade 2 vanishes, so squarefree coefficients are cubic Gauss sums (Patterson). n = 6:
   `0 <-> 4`, `1 <-> 3`, grade 2 self-related, grade 5 vanishes, so grades 0 and 1 are undetermined. The 7/8 gain sits
   in the n = 3 row; its exceptional term sits in the undetermined grade-0 class of the n = 6 row.
6. **Theorem E (the detector on DH, PROVED).** The detector's signal is a pole of `sum mu(a) eta(a) N a^{-s} =
   1/L(s, eta)`. For DH coefficients the same series equals `alpha/L(s,chi) + conj(alpha)/L(s,chi-bar)`, which is
   finite at the DH off-line zero (MEASURED value `0.7585 - 0.1743 i` at `0.808517 + 85.699348 i`). The detector
   applied to DH sees the zeros of the two Hecke eigen-components, not the zeros of DH. DH fails at manuscript
   section 7.2 (scalar Euler identity) and section 8 (truncated inverse).

Answer to the lane question "one picture": there is one picture, the theta section over the modular family with
coordinates (b, x) = (log height, shear), plus the point z on the torus. The bridge program is the restriction to
x = 0, z = 0. The 7/8 mechanism is Fourier analysis in x at rational points on the 3-fold cover over Q(omega). The
two do not overlap: the bridge never leaves x = 0, and at n = 2 the x-direction carries no Gauss sums in the
coefficients (Theorem C). The torsion points z = c/q give Dirichlet-character sectors (section 8 item 3); each is
the same RH-equivalent form for its own L-function.

## 1. Plan: what is new relative to the atlas, the walls and the earlier lanes

- Atlas (PR 27) and the 14 geometric lanes record that the torus, Klein, annulus, spinor, twistor, bridge and
  antibridge structures hold verbatim for DH. g-symmetry-schur proved the symmetry group of one loaded torus is
  (Z/2)^3. g-torus-modular averaged over the modular parameter and listed "residual spectra of metaplectic covers
  were not examined" as its weakest step. None of them identified the spin cocycle or asked where the residue
  symbol is evaluated.
- New here: Theorem A (why the geometry is Euler-blind, stated as a property of the geodesic); Theorem B with the
  DH split/inert dichotomy; the Z/n grade table (Theorem C) as the place where n = 2 and n = 3, 6 differ; Theorem E;
  the translation table of section 7.
- Walls: Theorems A, C, D are structural statements, not inequalities. Theorem B and E are steps DH fails; both
  are the Euler product itself, so no wall is crossed.
- Not re-run: sextic theta numerics (`tmp/sextic/`), TRO6 (formalization/paper/sextic-theta-*.md), the shift
  family K_h (g-torus-modular), the Krein square (g-spinor-square-root).
- Sources read: BRIEF, SYNTHESIS_GEOMETRIC, the lane files named in the task, PR 43 `geometry_and_twistors.md` in
  full, zeta-view `docs/SPINORS-TWISTORS.md` (sections 1-5), the 7/8 manuscript text (`~/lean-deps/qrh-verify/paper.txt`:
  introduction, proof overview, sections 6.1, 7.1, 7.2 opening), `sextic-theta-synthesis.md`,
  `sextic-theta-literature.md` (Hecke relations), `zf-campaign-synthesis.md`. PR 10, PR 49, PR 56, PR 57 were read at
  README level only; their content is used through the refereed synthesis.

## 2. The dictionary for n = 2 (CLASSICAL unless marked)

Notation: `theta(t) = sum_{n in Z} e^{-pi n^2 t}`, `theta(tau) = sum e^{i pi n^2 tau}` for `tau = x + i t`,
`t = e^b`. `Mp2 = {(gamma, phi) : phi(tau)^2 = c tau + d}`. `S = [[0,-1],[1,0]]`.

| User object | Source | Metaplectic object | Status |
|---|---|---|---|
| `I^* omega = -omega`; square-root lift acts by `+-i` | PR 43 sec. 2 | The two lifts `(-1, +-i)` of the centre `-1` of SL2 to Mp2. Their square is `(1, -1)`, the nontrivial element of the kernel. This is the 2-cocycle restricted to `{+-1}`, the nontrivial class in `H^2(Z/2, Z/2)`; at the real place it is the Hilbert symbol `(-1,-1)_R = -1` | CLASSICAL. `I` is `z -> -z + const` on `E_r`, i.e. the action of `-1 in SL2(Z)` on the fibre |
| Four spin structures on the torus | PR 43 sec. 2 | The four theta characteristics. `theta = theta_3` is the theta-null of the even characteristic fixed by the theta group `<S, T^2>`; `S` fixes it, `T` exchanges `theta_3 <-> theta_4` | CLASSICAL |
| `H(b) = e^{b/4} theta(e^b)`, even | PR 43 sec. 5 | `theta(i/t) = t^{1/2} theta(it)`: the weight-1/2 automorphy factor of `S` has modulus `e^{b/2}` on the b-line; `e^{b/4}` is its square root, which splits it evenly between `b` and `-b`. The phase `e^{-i pi/4}` of `S~ = (S, sqrt tau)` cancels against `arg sqrt(it)`. `<S~>` is cyclic of order 8 and acts on theta by a faithful character | CLASSICAL |
| `H = sqrt(2/pi) (K K')^{1/4}` | PR 43 sec. 5 | `theta(e^{-b})^2 = 2K/pi`, `theta(e^b)^2 = 2K'/pi`: theta is the square root of a period of `omega`. `H^4 = (4/pi^2) K K'` is the product of the two periods; `H` is the geometric mean of the theta-null on the torus and on its dual. As a section theta lies in (Hodge bundle)^{1/2} = K^{1/4} of the modular curve | CLASSICAL; MEASURED 7e-30 (N1) |
| `kappa = (d_b^2 - 1/16) H` | PR 43 sec. 5 | `1/16 = (k/2)^2` with weight `k = 1/2`; the operator removes the polar terms `e^{+-b/4}` of the constant coefficient | PROVED (one line) |
| Functional equation `z -> -z` of `xi(1/2+z)` | all PRs | Mellin image of `S` acting on the base (`b -> -b`). On the fibre `E_r` the same symmetry is `I = -1 = S^2` | PROVED (Mellin transform of an even function) |
| Bloch spinor `psi in S^3`, `R(2 pi) = -1` | zeta-view SPINORS-TWISTORS sec. 1 | The double cover `SU(2) -> SO(3)`. This is NOT the metaplectic cocycle. SU(2) is the compact real form and is simply connected. The form the bridge preserves is `abs(U)^2 - abs(V)^2`, whose group is `SU(1,1) = SL2(R)` with fundamental group Z; Mp2 is its 2-fold cover | CLASSICAL. zeta-view sec. 1 already notes SU(2) mixing does not preserve the bridge balance |
| Minitwistor curve `nu^2 + (K^2/4)(zeta^4 + ...) = 0` in `Tot O(2)` | PR 43 sec. 4 | `eta` is a section of O(2) on the sphere; the spin bundle of the sphere is O(-1), unique. No cocycle enters: the sphere has one spin structure | CLASSICAL |
| Euclidean twistor fibration `CP^3 -> S^4` | zeta-view sec. 2-4 | Quaternionic structure `J^2 = -1` on `C^4`; group `Sp(2) = Spin(5)`, compact, simply connected. No metaplectic content | CLASSICAL |

Summary. Exactly two user objects are the metaplectic cover: the `+-i` of PR 43 section 2 (the cocycle) and the
`e^{b/4}` of PR 43 section 5 (its absolute value on the b-line). The SU(2) spinor and the twistor fibration are
compact-form constructions and carry no metaplectic data.

## 3. Theorem A: the bridge sees the cocycle only through its absolute value

**Theorem A (PROVED).** Let `gamma_0 = {i e^b : b real}`.
(i) The stabiliser of `gamma_0` in `PSL2(Z)` is `{1, S}`.
(ii) For `tau in gamma_0`, `theta(S tau) = (-i tau)^{1/2} theta(tau)` with `(-i tau)^{1/2} = e^{b/2} > 0`.
(iii) `kappa`, `xi(1/2+z) = int kappa(b) e^{zb/2} db`, `H_c = A^* Q_c A - A Q_c A^*`, `P`, `B`, `P +- B`, the
parity sectors `H_+-` and the coupling `T` are functionals of `theta` restricted to `gamma_0`.
(iv) Hence no bridge object depends on the value of the theta multiplier `v_theta(gamma) = eps_d^{-1} (c/d)` at any
`gamma` outside `{+-1, +-S}`, and the same holds with theta replaced by any function `f` on `gamma_0` with
`f(i/t) = t^k f(it)`.

*Proof.* (i) An element fixing both ends 0, infinity is diagonal with integer entries, so `+-1`; an element
exchanging them is `+-S`. (ii) is the Jacobi inversion formula. (iii) is the definition of each object: all are
built from `kappa` by convolution, cutoff and Mellin transform (PR 43 `theta_boundary_energy.md` (2.1)-(2.4), PR 56
`operator-duality.md` (1)-(5), g-antibridge-cancel Theorems A, B). (iv) follows. QED.

Consequences.
- This is the structural reason the 14 lanes found only the functional equation: the stabiliser `{1, S}` is the
  Z/2 of the functional equation, and it is the whole arithmetic group seen from `gamma_0`. The (Z/2)^3 of
  g-symmetry-schur is this Z/2 times complex conjugation times the deck involution.
- The DH theta kernel satisfies the hypothesis of (iv) (it is a Fricke eigenfunction on `gamma_0`). So no
  functional of the restriction to `gamma_0` separates it by a symmetry argument.
- Where the spin sign is. For odd d and (c,d) = 1,
  `theta(2c/d + i y) = (c/d) eps_d d^{-1/2} y^{-1/2} (1 + O(e^{-pi/(d^2 y)}))`, `eps_d = 1` or `i`.
  MEASURED (N2): 36 cusps with d in {3,5,7,9,11,15}, y = 1e-3, maximum relative error 1.7e-6. The Jacobi symbol
  is the leading coefficient of the theta section at the cusp `2c/d`. In ladder terms it is the additive twist
  `e^{-pi n^2 t} -> e(c n^2/d) e^{-pi n^2 t}` of the rungs.
- Coordinates. Write `tau = x + i e^b`. `b` is the bridge coordinate (dual to the spectral variable z). `x` is the
  shear of the lattice torus `<1, tau>` (a fractional Dehn twist). Arithmetic input is in `x`. This `x` is not the
  quantity called "bridge shear" in the repo (`W_h`, the shift along Re s, stack-antibridge table rows 15-17).

## 4. The n-fold analogues: two different generalisations

**(T) Topological.** `pi_1(SL2(R)) = Z`, so `SL2(R)` has a connected n-fold cover for every n. Its geometric
meaning is an n-th root of the canonical bundle of the upper half-plane; on a Fuchsian quotient it is an r-spin
structure, and its sections are forms of weight `2/n` with a multiplier system. For n = 2 this is the spin
structure and Mp2.

**(A) Arithmetic (Kubota).** For a number field `F` containing `mu_n` there is a central extension of `SL2(A_F)` by
`mu_n` with cocycle built from the n-th order Hilbert symbols `(a,b)_v`. It splits over `SL2(F)` by the reciprocity
law `prod_v (a,b)_v = 1`. On a congruence subgroup the splitting is Kubota's character
`kappa(gamma) = (c/d)_n`.

**Theorem D (CLASSICAL).** (i) Over Q only n = 2 occurs in (A) (`mu_n` in Q forces n <= 2), and there (A) = (T):
the real Hilbert symbol is the sign of the topological double cover. (ii) For `F = Q(omega)`, n = 3 or 6, the only
archimedean place is complex; `(a,b)_C = 1` and `SL2(C)` is simply connected, so the cover splits at infinity.
The cubic theta of Patterson is a scalar function on `H^3 = SL2(C)/SU(2)` with `theta(gamma w) = kappa(gamma)
theta(w)`; it is a section of the flat `mu_3` line bundle with monodromy `(c/d)_3`. No automorphy factor and no
root of a canonical bundle is involved (`H^3` is not a complex manifold). (iii) The covers (T) with n >= 3 are not
the Kubota covers: they exist over R, have no reciprocity law behind them and are not the objects of the 7/8
manuscript.

What this means for the lane. "Metaplectic cover = spin structure" is exact for n = 2 over Q. For the covers that
drive the 7/8 mechanism the correct geometric statement is "flat `mu_n` character of the Bianchi group, defined by
the n-th power residue symbol". The maximal compact at the complex place is `SU(2)`, the same group as the
zeta-view Bloch spinor, and the cubic theta is `SU(2)`-invariant. The user's spinor group appears, with trivial
action.

## 5. Theorem B: Hecke correspondences on the spin ladder, and where DH fails

Fix a prime p, `nu in {0,1}`, a sequence `a` with `a(1) = 1` and polynomial growth, period `L` (2 for zeta, 10 for
conductor 5), and `f(tau) = sum_{n>=1} a(n) n^nu e^{2 pi i n^2 tau / L}`. Define on functions of tau

    U f(tau) = p^{-2} sum_{j mod p^2} f((tau + L j)/p^2)            (the p^2 tori sheared by L j/p^2, rescaled)
    N f(tau) = g_p^{-1} sum_{j mod p, j != 0} (j/p) f(tau + L j/p)    (the p-1 tori sheared by L j/p, weight = Legendre symbol)
    V f(tau) = f(p^2 tau)
    T_{p,eps} = U + eps p^{nu-1} N + eps^2 p^{2 nu - 1} V,           g_p = sum_j (j/p) e(j/p).

On coefficients `c(n) = a(n) n^nu`: `U: c(n) -> c(pn)`, `N: c(n) -> [p does not divide n] c(n)`,
`V: c(n) -> c(n/p)`. This is Shimura's `T(p^2)` in half-integral weight `nu + 1/2` written on the ladder
(CLASSICAL); the weight `(j/p)` on the middle tori is the value of the metaplectic cocycle on the corresponding
coset representatives.

**Theorem B (PROVED, elementary).**
(i) `T_{p,eps} f = lambda f` iff `a(pm) = a(p) a(m)` for all m prime to p, `a(p) = lambda' - eps/p`, and
`a(p^{k+1}) = lambda' a(p^k) - (eps^2/p) a(p^{k-1})` for `k >= 1`, where `lambda = p^nu lambda'`. Equivalently the
local series is `sum_k a(p^k) x^k = (1 - (eps/p) x)/(1 - lambda' x + (eps^2/p) x^2)`.
(ii) If `a` is completely multiplicative, then f is an eigen-section with `eps = a(p)`, `lambda = a(p) p^nu (1 +
1/p)`. For theta itself: `T_{p,1} theta = (1 + 1/p) theta`.
(iii) f is an eigen-section for every p iff `sum a(n) n^{-s}` has an Euler product with the local factors of (i).
(iv) On ladders supported on squares the Legendre weight degenerates: `N f = f - p^{-1} sum_{j mod p} f(tau + L j/p)`.
The spin sign `(j/p)` is evaluated only through `(n^2/p) = [p does not divide n]`.

*Proof.* Compare coefficients of `e^{2 pi i n^2 tau/L}`. For n prime to p: `c(pn) + eps p^{nu-1} c(n) = lambda c(n)`.
For `n = p m`: `c(p^2 m) + eps^2 p^{2nu-1} c(m) = lambda c(pm)`. With `n = 1` the first gives `a(p)`; the first
for general n gives multiplicativity across p; the second gives the recursion. (iv): `sum_j (j/p) e(j n^2/p) =
(n^2/p) g_p`. QED.

MEASURED (N3, at `tau_0 = 0.31 + 0.83 i`, 30 digits):
- theta, p = 3, 5, 7: `abs(T theta - (1+1/p) theta) < 6e-31`, with either form of N.
- chi mod 5 (`chi(2) = i`), nu = 1, p = 2, 3, 7, 11: relative residual below 2e-28 with `eps = chi(p)`.
- For p = 2 the Legendre form of N is not defined; the form (iv) is used.
- DH (`a = (1 - i k) chi/2 + (1 + i k) chi-bar/2`, coefficients 1, 0.28408, -0.28408, -1, 0 mod 5):

| p | class mod 5 | eps tried | relative residual of `T f - lambda f` |
|---|---|---|---|
| 11 | +1 | 1 | 2.1e-28 |
| 19 | -1 | -1 | 1.4e-28 |
| 29 | -1 | -1 | 1.8e-16 (ladder truncation) |
| 2 | 2 | i, -i | 2.65, 1.65; best fitted (eps, lambda) on two points leaves 0.40 on two others |
| 3 | 3 | -i, i | 3.46, 2.55; best fit leaves 2.2 |
| 7 | 2 | i, -i | 8.17, 5.87 |
| 13 | 3 | -i, i | 15.2, 10.9 |

Exact defect: `a(6) - a(2) a(3) = 1 + k^2 = 1.0807` (so (i) fails at p = 2 and p = 3 for every eps, lambda).

**Corollary B1 (PROVED).** The DH ladder is an eigen-section of `T_{p,eps}` exactly for `p = +-1 mod 5` (where
`chi(p) = chi-bar(p) = +-1`) and for no eps when `p = +-2 mod 5`. These are the primes split, resp. inert, in
`Q(sqrt 5)`. The failing step is: equivariance under the spin-weighted p^2-isogeny correspondence at inert primes.

Limits of Theorem B.
- It is the Euler product in geometric form and nothing more. Under the Mellin transform along `gamma_0` the
  eigen-equation becomes the identity of local Euler factors.
- (iv) says that for the n = 2 theta the cocycle is not used in the Hecke action either. Together with Theorem A:
  in the whole n = 2 picture the residue symbol appears only as the cusp coefficient of section 3.
- Fricke invariance plus eigen-section at all p pins the function down (Hamburger, Hecke): every control fails
  one of the two. As a row of the stack-combinator table this is type INPUT. It constrains no zero.

## 6. Theorem C: the Z/n grade and its reflection

CLASSICAL (Kazhdan-Patterson 1984, Thm I.3.5 and periodicity; as recorded in
`formalization/paper/sextic-theta-literature.md` lines 32-36, 236-249, 539-541). Let `tau_n(m)` be the Fourier
coefficients of the theta section on the n-fold cover of GL2, p a prime, m prime to p. Then

    tau_n(m p^n) = N(p)^{1/2} tau_n(m),      tau_n(m p^{n-1}) = 0,
    tau_n(m p^j) = G_{j+1}(m, p) tau_n(m p^{n-2-j})      (0 <= j <= n-2),

`G_r` a normalised Gauss sum of the character `(./p)_n^r`. The grade of an index at p is `j = v_p mod n`; the Hecke
relation is the reflection `j -> n-2-j`, i.e. `j -> -2-j` on Z/n. ARGUED: the relations come from the functional
equation of the metaplectic Eisenstein series, whose residue at `s = 1/2 + 1/(2n)` is the theta section, so the
reflection is the finite-prime counterpart of the involution `s -> 1-s`.

| n | orbits of `j -> n-2-j` on Z/n | consequence |
|---|---|---|
| 2 | {0} fixed; {1} vanishes | `tau(m) = (m/p) tau(m)` for all p: support on squares, value 1. No Gauss sum in the coefficients. The ladder `sum e^{i pi n^2 tau}` |
| 3 | {0,1}; {2} vanishes | `tau(mp) = G_1 tau(m)`: squarefree coefficients are products of cubic Gauss sums (Patterson). Determined |
| 6 | {0,4}; {1,3}; {2} self-related; {5} vanishes | Nothing links grade 1 to grade 0. Squarefree coefficients undetermined (local Whittaker space of dimension > 1) |

**Theorem C (assembled).** n = 2 is the only n for which grade 0 is a fixed point of the reflection. So the user's
theta section is the unique member of the family whose coefficients contain no residue-symbol information. For
n = 3 the reflection moves grade 0 to grade 1 and writes a unit-modulus Gauss sum into every squarefree
coefficient; this is the input of the 7/8 mechanism. For n = 6 the orbit structure leaves grades 0, 1 free; this
is the domain of the exceptional term.

Relation to the antibridge. The antibridge anchors `q+-` are the fixed points of `s -> 1-s` on the spectral torus
(stack-antibridge section 1). `j -> n-2-j` is the same involution at a finite prime acting on the n grades. For
n = 2 it has only fixed grades; this matches the fact that the bridge parity sectors are both present and neither
is determined by the other (g-symmetry-schur Thm 2).

## 7. The 7/8 mechanism in this language

From the manuscript (introduction, sections 6.1, 7.1, 7.2; unrefereed, taken as stated).

| Manuscript object | In section language | Bridge-side analogue | Match |
|---|---|---|---|
| Completed cubic theta row `T_{m,s,eta}(t) = sum gamma_2(c) alpha(cn^3) Psi(cn^3) G(cn^3) q_c^{-1/2-t} q_n^{-1-3t}` | Mellin transform along the cusp geodesic (height variable of `H^3`) of the cubic theta section, twisted by `eta` and by the residue character `chi_.(m)` | `xi(1/2+z) = int kappa(b) e^{zb/2} db` | Same operation (Mellin along the cusp geodesic) on a different section |
| Reflection, Prop 5.1 | The involution exchanging the two ends of the geodesic, on the 3-fold cover, with characters kept | `S`: `b -> -b`, the functional equation | Same involution. For n = 3 it changes the coefficients (Gauss sums); for n = 2 it fixes them |
| Additive polynomial: `sum_s ... g_{chi_s}(s, -m)`, reduced fractions `d/s in C/O` | Evaluation at the rational cusps `d/s`; the cusp cross-section is the flat hexagonal torus `C/Z[omega]` and `d/s` are its torsion points | none on `gamma_0`. The n = 2 analogue is section 3: `x = 2c/d` | No bridge counterpart (Theorem A) |
| Poisson summation in m; frequencies `H = u a^6` | Fourier transform on the cusp torus `C/O`; `u` sixth-power-free = the Z/6 grade vector of the frequency | none | No bridge counterpart |
| `gamma_2(c) = mu(c) alpha(c) G(c)/gamma_1(c)`; "R(A,s) cancels the cross-prime reciprocity phases" | Hasse-Davenport duplication `g(chi) g(chi^4) = chi-bar(4) g(chi^2) g(chi^3)` on Z/6-graded Gauss sums, and triviality of the cocycle on global points (cubic reciprocity) | none | MEASURED (N5): duplication and triplication hold to 1e-27 at p = 7..61; `G_0 = -1`, `abs(G_r)^2 = p` |
| Principal row `u = 1`: scalar Euler product containing `1/L(s, eta)` | The grade-0 Gauss sum is the Ramanujan value `G_0 = -1`; its product over primes is `mu`. A zero of `L` is a pole of the row | `L = xi'/xi`: a zero is a pole with residue the multiplicity (positive) | Different. The bridge is a Hermitian form in the test with a positive zero measure; the detector is a linear functional with complex residues `1/L'(rho)` |
| Low bound: Cauchy-Schwarz `abs(I) <= (reflected energy)^{1/2} (additive Gram)^{1/2}` | Coupling block between the row space and the cusp space, both honest `L^2` spaces | `abs(B) <= (E D)^{1/2}`, i.e. `norm(T) <= 1` (PR 56 frontier A) | Same block shape, opposite roles: in the detector it is an automatic input; in the bridge it is the RH-equivalent target |
| Exceptional term `P_a^{1/6}` of Prop 15.2, coset `e_0 t^6 a^6` | By `sextic-theta-synthesis.md` Thm D(i): probe = `sum_m rho^nat_sigma(-e_0 m) B_{m,sigma}(Z)` + smaller. A pairing of the grade-0 coefficients of the sextic theta section (6-fold cover) with the cubic rows (3-fold cover), bounded by Cauchy-Schwarz | `norm(T)` with no margin | TRO6 = "coupling contraction with a power margin `Z^{-eta b/12}`". Same shape as target A, where the margin is known to be impossible (sup = 1) |

Two exact parallels and their limits.
- Both programs end in a coupling-contraction statement equivalent to their zero statement: `norm(T) <= 1` iff RH
  (g-coupling-norm); TRO6^nat(eta) iff zero-free half-plane `7/8 - eta/96` (`sextic-theta-synthesis.md` Thm D,
  part (a) PROVED-rel, part (b) SKETCH). In the bridge the diagonal blocks are indefinite candidates and the
  contraction constant is 1 with no margin. In the detector the diagonal blocks are norms and a power margin is
  asked for.
- The gain. It is not a sign in a sector of a Hermitian form. It has three sources, all on the n = 3 row of the
  table in section 6: (a) grade 0 has Gauss value `-1` (a sign), which produces `mu` and hence `1/L`; (b) grades
  `r != 0` have modulus `sqrt(N p)` exactly, which is the square-root saving in the reflected energy (ARGUED from
  the overview; section 5 of the manuscript was not read); (c)
  duplication collapses sextic times cubic Gauss sums to a scalar Euler factor. None of (a)-(c) has an n = 2
  version: by Theorem C the n = 2 coefficients are 1 and the reflection fixes them.

**Theorem E (PROVED).** Let `a = alpha chi + conj(alpha) chi-bar` be the DH coefficient sequence, `alpha = (1 - i
k)/2`. For Re s > 1, `sum mu(n) a(n) n^{-s} = alpha/L(s,chi) + conj(alpha)/L(s,chi-bar) =: M(s)`, which continues
meromorphically with poles only at zeros of `L(s,chi) L(s,chi-bar)`. `M(s) f_DH(s)` is not 1. In particular `M` is
holomorphic at every zero of `f_DH` that is not a zero of `L(s,chi) L(s,chi-bar)`.
*Proof.* `mu(n) chi(n)` is the Dirichlet inverse of `chi` because `chi` is completely multiplicative; the map is
linear in `a`. QED.
MEASURED (N4): `rho_0 = 0.8085171824566 + 85.6993484853776 i`, `abs(f_DH(rho_0)) = 2e-30`,
`L(rho_0, chi) = 0.3383 - 0.6153 i`, `L(rho_0, chi-bar) = 0.0357 + 0.7013 i`, `M(rho_0) = 0.7585 - 0.1743 i`. At
`s = 3`: `sum_{n<20000} mu a n^{-s} = 0.97807558078`, `M(3) = 0.97807558078`, `1/f_DH(3) = 0.98667534577`.

So the detector run with DH as target returns the zero-free half-plane of `L(s,chi)` and `L(s,chi-bar)`. It
says nothing about the zeros of DH. The step that fails is the scalar Euler identity (section 7.2) and with it
the truncated inverse of section 8 (the inverse polynomial times the plain polynomial is no longer close to 1).

## 8. Is there a Z/3 or Z/6 refinement of the bridge sectors?

1. On one loaded torus: no. g-symmetry-schur Thm 1 gives the symmetry group (Z/2)^3 exactly. An order-3
   symmetry would have to cover a Moebius symmetry of xi of order 3; there is none. PROVED there.
2. On the hexagonal torus `C/Z[omega]`: the rotation group `mu_6` acts, and its heat trace has Mellin transform
   the completed `zeta_{Q(omega)}(s) = zeta(s) L(s, chi_{-3})`. The `mu_6` isotypic components of lattice sums are
   the angular characters `(lambda/abs(lambda))^{6k}` (Groessencharacters of infinite order). They are not the
   cubic or sextic residue characters. CLASSICAL. So the rotational Z/6 of the hexagonal torus is not the Z/6 of
   the cover.
3. On the torsion points of the loaded torus: yes. Use the Jacobi theta section `theta(z | it) = sum_n e(nz)
   e^{-pi n^2 t}` on the torus `<1, it>` and evaluate it at the q-torsion points `z = c/q`. For a primitive even
   character `psi` mod q, `sum_c psi-bar(c) theta(c/q | it) = g(psi-bar) sum_n psi(n) e^{-pi n^2 t}` (odd `psi`: the
   same with `d/dz`). So the finite Fourier transform over the torsion points grades the family of bridge forms by
   the characters of `(Z/q)^x`; the sector of `psi` is the bridge form of `L(s, psi)`. The user's Z/2 parity is
   `psi(-1)` (the two Gamma factors). A Z/3 grading by cubic characters exists when 3 divides `phi(q)`. PROVED
   (orthogonality of characters and the Gauss-sum identity for primitive `psi`). The shear cusps `x = 2c/q` give
   the same construction for the squares `psi^2` only.
   What it gives: the grading kills the cross blocks between different `psi` and nothing else. Each sector is
   infinite-dimensional and separately RH-equivalent for its L-function. This is the same outcome as
   g-symmetry-schur Thm 2 for parity.
4. At a finite prime: the local intertwining operator of the n-fold cover acts on the n grades by the reflection
   of section 6 with Gauss-sum entries. In the passive-cascade picture (g-passive-cascade Thm 1) the scalar prime
   stub becomes an n x n graded stub. For n = 2 the off-diagonal Gauss entry is the sign `(m/p)`. ARGUED (the
   cascade for covers was not written out).
5. Does the 7/8 gain appear as a sign or cancellation in a graded sector? Partly. The signal `1/L` is the product
   of the grade-0 Gauss signs `G_0 = -1`. The exceptional term is the grade-0 class of the dual Z/6 grading (the
   coset of `e_0` modulo sixth powers), where the sextic characters are constant and give no cancellation; the
   filter multiplies it by one constant `A(e_0) = 6/(5d) - 1/5` (zf-campaign-synthesis section 1.3). In both
   programs the invariant sector is the one left unreduced by the grading.

## 9. What matches and what does not

| Item | Matches | Does not match |
|---|---|---|
| Cocycle | PR 43 `+-i` = metaplectic 2-cocycle on the centre (n = 2, real place) | zeta-view SU(2) spinor and the twistor `J`: compact forms, no metaplectic content |
| Section | theta = square root of a period; `H` = its modulus-normalised restriction to `gamma_0` | Cubic theta is not a lattice sum, not a heat trace of a torus, and not a root of a canonical bundle |
| Place | n = 2: the sign lives at the real place and is tied to the finite places by quadratic reciprocity | n = 3, 6: trivial at the complex place; lives only at finite primes |
| Involution | `S` on the base = functional equation = reflection of Prop 5.1 | On coefficients: fixes them for n = 2, writes Gauss sums for n = 3 |
| Torus | Cusp cross-section `C/Z[omega]` with torsion points `d/s` (additive large sieve) is a flat torus | It is the shear torus, not the spectral torus `E_r` and not a member of the modular family |
| Block form | Both end in a coupling contraction `norm(D^{-1/2} B E^{-1/2})` | Bridge: Hermitian in one test, sign open, no margin. Detector: bilinear between two spaces, positivity automatic, power margin open |
| Zero mechanism | none | Bridge: positive measure on zeros through `xi'/xi`. Detector: pole of `1/L` through `mu`, a linear residue |
| Grading | Z/2 parity = `psi(-1)` = the n = 2 grade | Z/3, Z/6 grades exist only on torsion points of the torus (characters of `(Z/q)^x`), or at finite primes on the covers; not on the single loaded torus |

## 10. Controls

| Statement | DH | HEAT (tau < 0) | TW (eps_n completely multiplicative) | EA `zeta(s+a) zeta(s-a)` | NR | B (Beurling) |
|---|---|---|---|---|---|---|
| Theorem A (objects on `gamma_0`, cocycle positive) | passes | passes | not formulable (no S) | passes (weight changes) | passes | not formulable |
| Theorem B eigen-section at all p | FAILS at `p = +-2 mod 5` (PROVED, MEASURED) | not formulable: the heated kernel is not the restriction of a section with a q-expansion | passes | FAILS the local form (i) (denominator of degree 2, numerator 1) | not formulable (non-integer frequencies) | not formulable |
| Fricke invariance on `gamma_0` | passes | passes | FAILS | passes | passes | FAILS |
| Theorem C, n = 2 row | n/a (statement about theta sections of covers) | | | | | |
| Theorem E: `sum mu a n^{-s} = 1/f` | FAILS (PROVED, MEASURED) | not formulable | passes | FAILS (the inverse is `mu * mu`-type, not `mu a`) | not formulable | passes with Beurling `mu` |

Cells other than the DH column are inferences from the definitions; they were not computed.

Reading: the only steps DH fails are Hecke equivariance at inert primes (Theorem B) and the Moebius inverse
(Theorem E). Both are the Euler product. No inequality on zeros is obtained from either in this note.

## 11. Verdict by task item

1. Dictionary. Exact for n = 2 (section 2). The metaplectic 2-cocycle is the `+-i` of PR 43 section 2; its modulus
   is the `e^{b/4}` of PR 43 section 5. The n-fold analogues that matter are not n-th roots of a canonical bundle;
   they are flat `mu_n` characters defined by residue symbols, trivial at infinity (Theorem D).
2. Translation of 7/8. Section 7. Detector = Mellin pairing of the cubic section along the cusp geodesic against
   evaluations at rational cusps, compared through reflection and through Fourier transform on the cusp torus. The
   exceptional term = Cauchy-Schwarz norm of the coupling between sextic grade-0 coefficients and the cubic rows.
   In bridge coordinates it has the block shape of target A. It cannot be written with P, B and the parity sectors
   alone, because those live on `gamma_0` (Theorem A).
3. Graded refinement. Exists only on the torsion points of the torus (Dirichlet-character sectors, each separately
   RH-equivalent for its L-function) or at finite primes on the covers (section 8). The gain is a grade-0
   Gauss sign plus exact square-root modulus of the other grades, on the n = 3 cover; at n = 2 the corresponding
   grade is fixed by the reflection and the gain is absent (Theorem C).

Single picture: one section over the modular family, coordinates (b, x) and torus point z. User geometry = slice
x = 0, z = 0, n = 2, real place. 7/8 mechanism = x-direction at rational points, n = 3 (and 6), finite places. They are the same kind of
object and they use disjoint parts of it.

Pivot: none taken. The adjacent idea found is in "next step" below; it was not started.

## 12. Next step (not done here)

Write the probe (6.1) of the manuscript as a period on the 6-fold cover: the cubic theta section times a sextic
metaplectic Eisenstein section, twisted by `eta`, integrated over the Bianchi quotient. If that identity holds, the
reflection and Poisson representations are its two unfoldings and the exceptional term is the contribution of the
residue of the Eisenstein section, i.e. the sextic theta (consistent with `sextic-theta-synthesis.md` Thm D(i) and
`sextic-theta-literature.md` line 683). The grade bookkeeping is in `Z/6 = Z/2 x Z/3`; the `Z/2` factor is the
classical spin sign of section 2. The question to settle is whether that `Z/2` component separates the exceptional
coset from the principal row. Status: OPEN; no computation was made.

## 13. Three weakest steps

1. Section 7 is a translation table, not a derivation. The manuscript was read in its introduction, overview and
   sections 6.1, 7.1 and the opening of 7.2; sections 5, 8-20 were not read. The statements "the additive polynomial
   is an evaluation at cusps", "Poisson in m is the Fourier transform on the cusp torus" and the three sources
   (a)-(c) of the gain are read off the displayed formulas and the manuscript's own overview. The identification
   of the exceptional term with a sextic-theta pairing is imported from the internal sextic-theta notes
   (PROVED-rel there, relative to an unrefereed manuscript).
2. Theorem C and Theorem D are assembled from the literature as recorded in the repo notes (Kazhdan-Patterson
   Hecke relations; Kubota; triviality of the complex Hilbert symbol). The primary sources were not re-read in
   this session. The phrase "local counterpart of `s -> 1-s`" for the grade reflection and item 4 of section 8
   (graded prime stubs) are ARGUED.
3. Theorem B is elementary and checked numerically, but its normalisation of `T_{p^2}` was fixed by coefficient
   action, not matched line by line to Shimura's operator for level 4 or 100; the statement "the weight `(j/p)` is
   the cocycle value on the coset representatives" is CLASSICAL in content and was not re-derived. All numerics
   are 30-digit floating point, not interval arithmetic. PR 10, PR 49, PR 56, PR 57 were read at README level.

## Files

- `tmp/research-2026-11-16/push/h-metaplectic-spin/RESULT.md`
- `tmp/research-2026-11-16/push/h-metaplectic-spin/checks.py`
  (N1 periods, N2 cusp signs, N3 spin-Hecke on theta / chi / DH, N4 detector on DH, N5 Gauss-sum grading; 50 s,
  run with `.venv-arb/bin/python`)
- `tmp/research-2026-11-16/push/h-metaplectic-spin/checks.log`,
  `checks.json`
