# g-symmetry-schur: group-theoretic positivity on the loaded bridge

Date: 2026-11-16. Lane: symmetry / Schur-lemma analysis of the bridge block form
(PR 56 frontier A and B). Nothing here proves or refutes RH. All PR content was read
from local read-only refs. Labels: PROVED (in this note), CLASSICAL (cited), MEASURED
(floating point, not interval), OPEN.

## 0. Verdict

**Precise obstruction, with three proved structural results.**

1. The symmetry group of the loaded torus is exactly `(Z/2)^3` (Theorem 1). It contains
   two elements the PR notes do not use: the real-axis fold `C(u,v) = (-u, v)` and the
   half-period torus translation `tau(u,v) = (u+1/2, v+1/2)`. No other torus automorphism,
   translation, modular change of `r`, lens value, or heat-time reversal is a symmetry of
   the loaded field, for any `r`.
2. On every test space of the program the group acts through the Klein four-group
   `V4 = {1, j, c, jc}` of the spectral sphere, with only ONE unitary involution. The
   block structure is therefore completely determined (Theorem 2): the only blocks
   killed are the Mellin-even/Mellin-odd cross blocks. Every isotypic component has
   infinite multiplicity, so Schur's lemma gives no sign. The surviving coupling is
   `T = T_+ (+) T_-`, and the `T_-` part is exactly target (B). Target (B) is not
   reduced, and (PR 56 operator-duality) each of the two sectors is separately
   RH-equivalent.
3. The Davenport-Heilbronn function has the same `(Z/2)^3` symmetry, a positive even
   theta kernel, and (MEASURED) the same strict convexity of `-log kappa(sqrt t)` that
   PR 56 section 5 uses. So the entrywise theorem (G) and the cone theorem (H) of PR 56
   hold for DH as well, while both DH parity sectors are negative already on a
   one-node test at height `t = 85.7` (normalized diagonal `-0.92`). Symmetry plus
   Csordas convexity cannot sign `Delta_-` on oscillatory odd inputs.

## 1. Plan: what is new relative to the atlas and the walls

- The PR 27 atlas has no symmetry/isotypic route; PRs 43, 49, 56 contain the parity
  split `[H_c, J_c] = 0` and the single antiunitary control of PR 56 section 9, but no
  classification of all symmetries and no statement of which blocks every combination
  kills. This note supplies both.
- Walls respected. DH: section 7 shows every step of this lane holds for DH, so the
  lane is Euler-blind by construction; that is the obstruction. Flow-blindness: the
  symmetry group is the same at every heat time (section 6). eq48: on the one-sided
  test class of the refereed Weil identification the unitary part of the group is
  trivial (section 4c), so no block of the Weil form is killed.

## 2. Symmetry inventory

Conventions (zeta-view `docs/KLEIN-ANNULUS.md`): `E_r: eta^2 = (w^2+r^2)(w^2+r^-2)`,
`s0 = 1/(1-w)`, `s = 1/2 + L(s0 - 1/2)`, `z = 4Ku + 2iK'(v - 1/2)`,
`w = (i/r) sn(z|m)`, `eta = cn dn`, `m = r^-4`. `F` is completed xi, so
`F(1-s) = F(s)`, `F(conj s) = conj F(s)`, and `f = F o s` is the loaded field.

### Theorem 1 (exact symmetry group). PROVED.

Let `Gamma` be the group of holomorphic or antiholomorphic automorphisms `g` of `E_r`
(preserving the puncture set) with `f o g = f` or `f o g = conj f`. For every `r > 1`
and every lens `L > 0`,

    Gamma = { 1, D, R, A, C, DC, RC, tau }  ~  (Z/2)^3,

| element | (u,v) action | (w, eta) action | covers on s-sphere | on f | fixed set | quotient |
|---|---|---|---|---|---|---|
| D | (1/2-u, 1-v) | (w, -eta) | identity | f | 4 branch points | w-sphere |
| RC | (-u, 1/2-v) | (1/w, eta/w^2) | s -> 1-s (j) | f | p+, p-, q+, q- | sphere |
| tau = D.RC | (u+1/2, v+1/2) | (1/w, -eta/w^2) | s -> 1-s (j) | f | none (translation) | torus (2-isogeny) |
| R | (u, 1/2-v) | (1/conj w, conj eta/conj w^2) | s -> 1-conj s (jc) | conj f | circles v=1/4, 3/4 | annulus |
| A = DR | (1/2-u, 1/2+v) | (1/conj w, -conj eta/conj w^2) | jc | conj f | none | Klein bottle |
| C | (-u, v) | (conj w, conj eta) | s -> conj s (c) | conj f | circles u=0, 1/2 | annulus |
| DC | (u+1/2, 1-v) | (conj w, -conj eta) | c | conj f | none | Klein bottle |

The holomorphic subgroup is `Gamma_0 = {1, D, RC, tau} ~ (Z/2)^2`, and
`Gamma / <D> = V4 = {1, j, c, jc}` acting on the spectral sphere.

Proof. (i) The seven formulas. `sn` is odd, `cn dn` is even, `conj sn(z) = sn(conj z)`
for real `m`, `sn(z+2K) = -sn z`, `sn(z+iK') = 1/(k sn z)` with `k = r^-2`
(CLASSICAL, DLMF 22.4). `C` is `z -> -conj z`, which gives `w -> conj w`,
`eta -> conj eta`. `tau` is `z -> z + 2K + iK'`, which gives
`w -> (i/r)(-1/(k sn z)) = 1/w`. `D`, `R`, `A` are in the zeta-view note. The rest are
products. All seven were checked numerically at 30 digits for `r = 1.3, 2, 3.7`
(`torus_group.py`, max error `5e-30` at `r = 2`). Fixed sets are read off the affine
`(u,v)` formulas.

(ii) Nothing else, holomorphic case. Let `g` be a holomorphic automorphism with
`f o g = f` away from the punctures. `F` is transcendental entire, so `F o h` has an
essential singularity exactly at the poles of a meromorphic `h`. Hence `h = s o g` has
the same polar divisor `p+ + p-` as `s`. By Riemann-Roch `l(p+ + p-) = 2`, so
`s o g = alpha s + beta`, and `F(alpha s + beta) = F(s)` on the sphere. The zero set
`Z` of `F` is infinite, lies in `0 < Re s < 1`, and has
`N(T) ~ (T/2pi) log T` (CLASSICAL). If `Im alpha != 0` the image of `Z` is unbounded
in real part. If `alpha` is real with `|alpha| != 1` the counting asymptotic is
violated. If `alpha = 1`, then `Re beta = 0` (strip), and `beta != 0` makes `Z`
periodic, which gives `N(T) = O(T)`. If `alpha = -1`, composing with `s -> 1-s` gives
the previous case, so `beta = 1`. Hence `s o g` is `s` or `1-s`, and `g` is one of
`1, D` or `RC, tau` (the two lifts of each).
(iii) Antiholomorphic case: apply (ii) to `g o C`. QED.

Consequences.

- **Torus translations.** Exactly one nontrivial translation is a symmetry: the
  half-period `tau`. It swaps `p+ <-> p-` and `q+ <-> q-`.
- **Modular action on r, lens L, CM values of r.** Extra automorphisms of special tori
  (order 4 or 6) are never symmetries of `f`; the group is the same for all `r`. A
  change of `r` or `L` is a change of chart at fixed spectral data and acts trivially
  on every spectral form (PR 56 section 10 "research invariance").
- **Antibridge points.** `q+-` (the lifts of `s = 1/2`) and the punctures `p+-` are
  exactly the fixed points of `RC`, the lift of the functional-equation involution.
- **Two Klein bottles, two annuli.** `E_r/A` (critical-line fold, the PR 56 Klein
  surface) and `E_r/DC` (real-axis fold) are both Klein bottles. `E_r/R` and `E_r/C`
  are both annuli.
- **Terminal quotient.** `E_r / Gamma` is the closed upper half-plane of
  `x = -(s-1/2)^2`, with `f` descending to the function `G(x)` of PR 56
  operator-duality. After all folding no symmetry remains, and the residual statement
  on the terminal quotient is the Pick/Loewner condition on `-G'/G`.
- **Spinor / double-cover sign.** The sign of `eta` is `D`. The scalar `-1` on a spin
  bundle acts trivially on every Hermitian form. See Lemma D0.

## 3. Schur-type lemmas (all PROVED, elementary)

Let `G` be a finite group acting on a Hilbert space `V` by unitary operators, and `Q` a
bounded Hermitian form with `Q(gx, gy) = Q(x,y)`. Write
`V = (+)_pi  V_pi (x) M_pi` (isotypic decomposition, `M_pi` the multiplicity space).

**Lemma A (invariant forms).** `Q = (+)_pi 1 (x) Q_pi` with `Q_pi` an arbitrary
Hermitian form on `M_pi`. `Q >= 0` iff every `Q_pi >= 0`. If `dim M_pi = 1` then `Q_pi`
is one real number and one vector decides the sign of that component.
Proof: Schur's lemma applied to the operator of `Q`; `Hom_G(V_pi (x) M_pi, V_s (x) M_s)`
is `0` for `pi != s` and `1 (x) Hom(M_pi, M_pi)` otherwise. QED.

**Lemma B (coupling blocks).** Let `V = V1 (+) V2` with both summands `G`-invariant,
`Q = [[E, B*],[B, D]]`. Then `B` is an intertwiner: `B = (+)_pi 1 (x) B_pi` with
`B_pi : M1_pi -> M2_pi`, and `T = D^-1/2 B E^-1/2 = (+) 1 (x) T_pi`,
`||T|| = sup_pi ||T_pi||`. `B` is forced to vanish iff `V1` and `V2` have no common
irreducible constituent. Conversely, for any choice of the `B_pi` there is an
invariant `Q` with those blocks, so within a common constituent symmetry puts no
constraint on `||T_pi||`.
Proof: `B = P2 Q P1` with `P_i` commuting with `G`; apply Lemma A. For the converse
take `E = 1`, `D = 1` and the given `B`. QED.

**Lemma C (anti-invariant block).** If some `g` acts as the scalar `e1` on `V1` and
`e2` on `V2` with `e1 != e2`, then `B = 0`. Proof: `B = g^-1 B g`-invariance gives
`e2^-1 e1 B = B`. QED.

**Lemma C' (non-invariant splitting).** If `V1` is not `G`-invariant, Lemmas B, C hold
only for the stabilizer `G_1 = {g : g V1 = V1}`.

**Lemma D (antiunitary elements).** If `K` is an antiunitary involution commuting with
`Q` (and with the unitary part), then `V = V_R (+) i V_R` with `V_R = Fix(K)`, `Q` is
the complexification of a real symmetric form on `V_R`, and `Q >= 0` on `V` iff on
`V_R`. No block is killed; the entries of `B` become real in a `K`-real basis. This is
the content of PR 56 section 9.

**Lemma D0 (trivially acting elements).** If the kernel of a form on functions on a
space `X` is pulled back through a map `pi: X -> Y`, `k(p,q) = k0(pi p, pi q)`, and
`g` satisfies `pi o g = pi`, then the form vanishes identically on the `g`-odd tests:
all of `E, B, D` restricted to that sector are `0`. Proof:
`Q(mu, nu) = Q0(pi_* mu, pi_* nu)` and `pi_* mu = 0` for `g`-odd `mu`. QED.
So the `D`-odd (sheet-odd, "spinor sign") sector of torus tests is a null sector, not
a positive one, for every form built from spectral values of `F`.

**Lemma E (swap symmetry).** If a unitary involution `sigma` exchanges `V1` and `V2`
and commutes with `Q`, then `D = sigma E sigma`, `Bt := sigma B` is Hermitian on `V1`,
and `Q ~ (E + Bt) (+) (E - Bt)`. So `Q >= 0` iff `-E <= Bt <= E` iff `||T|| <= 1`. The
swap turns the coupling condition into two sector conditions and kills nothing
(annulus DtN: `1 +- rho_n`; PR 56 section 9: `1 +- b`). Proof: conjugate by
`(x, sigma x)/sqrt 2`, `(x, -sigma x)/sqrt 2`. QED.

## 4. Block structure on each test space of the program

### 4a. Torus tests. PROVED.
`Gamma` acts through `V4` on spectral data. By Lemma D0 the `D`-odd sector is null.
On `D`-even tests the form is the spectral form of 4b-4d. Folding to any of the seven
quotients of Theorem 1 is a restriction to an isotypic component of a subgroup, and by
PR 56 section 8 it does not change `||T||`.

### 4b. Mellin cutoff operator `H_c` on `L^2(R)`. PROVED.
`V4` acts by `j -> J_c` (unitary, `a(u) -> a(2c-u)`) and `c -> K` (antiunitary,
pointwise conjugation; `H_c` has a real kernel). `jc -> J_c K`. Translations `T_h`
satisfy `T_h^-1 H_c T_h = H_{c+h}` (covariance of the family, not a symmetry of one
member). By Lemmas A and D:

    L^2(R) = H_+ (+) H_- ,   H_c = H_+ (+) H_- ,   H_+- real,
    H_+-(x,y) = H_0(x,y) +- H_0(x,-y)  on  L^2(0,inf).

Killed: the even-odd cross block, and nothing else. Each sector is
`sign^{+-} (x) L^2((0,inf); R)`: both isotypic components have infinite multiplicity,
so Lemma A gives no one-vector sign test. The only multiplicity-one statement
available is the Perron vector: `H_-(x,y) > 0` entrywise (PR 56 (G)) and compactness
give, by Jentzsch (CLASSICAL), a simple top eigenvalue with positive eigenfunction, on
which every further symmetry would act by a scalar; its sign is positive. That is one
direction.

### 4c. One-sided bridge / Pick / Weil tests (nodes in `Re u > 0`, or real nodes `x_j > 1/2`). PROVED.
`j` and `jc` map the right half-plane to the left, so they do not act on the test
space (Lemma C'). The stabilizer is `{1, c}` with `c` antiunitary. By Lemma D nothing
is killed. For real-node tests (logPick kernel, the head/null residual
`P_L = H + E` of PR 56 section 11, the eq48 one-sided exponential tests) `c` fixes
every node and the group acts trivially: the Schur complement
`S_K = E_KK - E_KR A^-1 E_RK` has no symmetry-forced zero entries.

### 4d. Boundary Poisson forms `P_a`, `E_+-` (height-offset parity about `T`). PROVED.
`P_a(-t1, -t2) = P_a(t1, t2)` (from `U_a(-t) = conj U_a(t)`), and `P_{-a} = P_a`
(PR 56 section 5). The first is a unitary reflection symmetry of the form on the line
`Re s = 1/2 + a`, but only about height `0`. For `T != 0` the pair parity
`(t-r, t+r)` is not a symmetry, and the cross entry between the even and odd pair
combinations is `(D_+ - D_-)/4 != 0`. The second relation identifies the forms on two
different lines and is an isomorphism, not an automorphism (Lemma E applies only to a
two-line form).

### 4e. Frozen/live and head/null splittings. PROVED.
By Lemma C' the relevant group is the stabilizer of the frozen set. If the frozen and
live node sets are both `J_c`-symmetric, `B = B_+ (+) B_-` and the two cross blocks
`B_{+-}, B_{-+}` vanish. If either set is one-sided, nothing vanishes.

### 4f. Zero channels (PR 57). PROVED (finite configurations).
For `rho_i' = -(1/2) sum 1/(rho_i - rho_j)` linearized at a simple on-line
configuration, the Jacobian is `-(1/2) L (x) 1_C` with `L` the weighted graph
Laplacian, `w_ij = (gamma_i - gamma_j)^-2`. The reflection `rho -> 1 - conj rho` acts
as `+1` on longitudinal and `-1` on transverse perturbations, so by Lemma C the
transverse-longitudinal block vanishes; both blocks equal `-(1/2) L`. The admissible
(reflection-symmetric) perturbations of simple on-line zeros are the longitudinal
ones only. A transverse sector becomes admissible only at a double zero, where the
pair carries the permutation representation `trivial (+) sign`. Symmetry allows both
real forms of the pair (on-line `gamma +- delta`, off-line `1/2 +- delta`); it does
not select one.

## 5. Theorem 2: what survives, and whether it is target (B)

**Theorem 2.** PROVED given PR 56 operator-duality (read, not re-refereed here).
(i) For every combination of the symmetries of section 2, the blocks of the loaded
bridge form that are forced to vanish are exactly: the `D`-odd null sector (4a) and
the Mellin even-odd cross blocks (4b, 4e). (ii) The surviving relative coupling is
`T = T_+ (+) T_-`, with `T_+-` arbitrary real operators as far as symmetry is concerned
(Lemma B converse). (iii) `sup ||T_-|| <= 1` over all splittings inside the odd sector
is equivalent to `H_- >= 0`, i.e. to `Delta_- <= 0` on all odd tests, which is target
(B); likewise `T_+` and `H_+ >= 0`. Each is equivalent to RH (PR 56). So the surviving
part contains target (B) unreduced, plus an even twin of the same strength. The Gram
majorant `G_c >= 0` does not settle the even twin: `Delta_+ <= G_+` is also open.

Two exact facts about the two sectors (PROVED):

- Inter-sector identity. With `f(t) = xi(1/2+it)` and the Fourier kernels
  `C_+-(t,s) = C(t,s) +- C(t,-s)`,

      C_+(t,s) = ((t^2+s^2)/(2ts)) C_-(t,s) - (alpha/pi) [ f(t) f'(s)/s + f'(t) f(s)/t ].

  (Direct algebra from `C = (alpha/pi)(f(t)f'(s) - f'(t)f(s))/(t-s)`; equivalently
  `L_psi = ((x+y)/2) L_phi + (phi(x)+phi(y))/2`.) The Schur multiplier
  `(t/s + s/t)/2` and the rank-two term both have signature `(1,1)`. This is not a
  congruence, so neither sector's sign transfers to the other by symmetry.
- Trace split. `tr H_- - tr H_+ = (alpha/pi) int_0^inf (f(0)^2 - f(t)^2)/t^2 dt > 0`
  for every positive kernel (`|f(t)| <= f(0)`). MEASURED for xi
  (`trace_split.py`, 25 digits, non-interval): `tr H_- = 0.096680 alpha/pi`,
  `tr H_+ = 0.002086 alpha/pi`. The odd sector carries 97.9% of the trace. The sector
  on which the Gram majorant vanishes is the dominant one.

## 6. Candidates that are not symmetries

- **Heat-time reversal.** PROVED/CLASSICAL. `(Wf)(w) = f(iw)` satisfies
  `e^{tau d^2/4} W = W e^{-tau d^2/4}`: Wick rotation about `s = 1/2` reverses heat
  time. It is a symmetry of the heat equation and of the quadratic control up to sign
  (`F_{-tau}(iw) = -F_tau(w)`), not of the loaded data: it exchanges the critical line
  with the real axis, where `F > 0`. At form level no congruence relates `H^tau` and
  `H^{-tau}`: for large positive time `H^tau >= 0` (de Bruijn) and for every negative
  time it is indefinite (Rodgers-Tao, `Lambda >= 0`); both statements pass through the
  PR 56 equivalence "sector positivity iff real zeros" applied to the heat family. The unitary group of 4b is the
  same `{1, J_c}` at every heat time, so the whole lane is flow-blind.
- **Other torus translations, modular action, lens.** Theorem 1.
- **Euler product.** On the Mellin side convolution by `kappa` factors as
  `K = K_inf . prod_p (1 - p^-1/2 T_{2 log p})^-1`. The `T_h` do not commute with the
  cutoff projection, so this is a factorization of the multiplier and not a symmetry
  of `H_c`. Each local factor is periodic in `t` (period `2pi/log p`); the periods are
  incommensurable, so the common translation group is trivial. In the function-field
  case there is one period, translation is a symmetry, and isotypic components are
  finite-dimensional. For zeta that mechanism is absent. (Remark, not used.)

## 7. Davenport-Heilbronn control

`dh_control.py` (30-40 digits, non-interval). DH coefficients `a(n) = 1, k, -k, -1, 0`
mod 5, `Lambda(s) = (5/pi)^{s/2} Gamma((s+1)/2) f_DH(s)`,
`theta(x) = sum n a(n) e^{-pi n^2 x/5}`, `Phi_DH(y) = e^{3y/2} theta(e^{2y})`.

| property used by this lane or by PR 56 section 5 | DH |
|---|---|
| `Lambda(1-s) = Lambda(s)`, `Lambda(conj s) = conj Lambda(s)`, hence full `(Z/2)^3` of Theorem 1 | holds (rel. err `1e-30`); Theorem 1 proof applies verbatim |
| `Phi_DH` even | holds (`4e-31`) |
| `Phi_DH > 0`, decreasing on `[0,3]` | holds (MEASURED on a 601-point grid) |
| strict convexity of `-log Phi_DH(sqrt t)` | holds: `V'' >= 2.54` on `t in [0.01, 9]` (MEASURED, 900-point grid) |
| hence PR 56 (G) `H_-(x,y) > 0` and cone theorem (H) | hold for DH (same proof) |
| parity split, Lemmas A-E, Theorem 2(i),(ii) | hold |
| `H_- >= 0`, `H_+ >= 0` | **fail**: `C_-(t,t)/scale = -0.9218`, `C_+(t,t)/scale = -0.9208` at `t = 85.7` (off-line zero `0.808517 + 85.699348 i`), negative on `85.5 <= t <= 85.9` |

So a single odd test concentrated at frequency `|t| ~ 85.7` (an oscillatory odd
Mellin input) has negative energy for DH, while every constant-phase odd input has
positive energy. No step of sections 2-5 uses the Euler product; all of them hold for
DH. This lane therefore cannot contain a proof, and the same is true of any argument
for `Delta_- <= 0` whose inputs are limited to: `(Z/2)^3` symmetry, kernel positivity,
Csordas-type convexity, entrywise positivity of `H_-`. The step that would have to
use `Lambda(n) >= 0` or multiplicativity is the sign of `T_-` on oscillatory inputs;
by eq48 that sign is the Weil form.

## 8. Three weakest steps

1. DH convexity and positivity of `Phi_DH` are grid measurements, not interval
   certificates (large `y` is dominated by the `n = 1` term, small `y` by evenness; no
   enclosure was produced).
2. Theorem 2(iii) relies on PR 56 `operator-duality.md` (Loewner reduction), which was
   read but not independently refereed in this lane. Theorem 2(i),(ii) do not depend
   on it.
3. Theorem 1 classifies symmetries induced by torus automorphisms. It does not
   classify abstract unitaries commuting with `H_c` (functions of `H_c` itself
   always commute). The claim "no hidden symmetry" is proved only in the geometric
   sense; spectral simplicity of `H_+-` beyond the Perron eigenvalue is OPEN.

## 9. Files

- `RESULT.md` (this file)
- `torus_group.py`, `torus_group.json`: 30-digit check of the seven group elements.
- `dh_control.py`, `dh_control.json`: DH kernel positivity, convexity, symmetry, diagonals.
- `trace_split.py`, `trace_split.json`: parity trace split for xi.

## 10. Next step

Find a kernel-level property that `Phi` has and `Phi_DH` lacks. DH passes positivity,
evenness, monotonicity and Csordas convexity, so the discriminating property must be
of higher order (for example a Polya-frequency / total-positivity order of the odd
half-line kernel, or the first failing Turan/Jensen inequality of the moments). The
DH failure appears only at oscillation frequency `~ 85.7`, so near-cutoff Taylor jets
(PR 56 radius certificates) cannot detect it; tests should be run at that frequency.
