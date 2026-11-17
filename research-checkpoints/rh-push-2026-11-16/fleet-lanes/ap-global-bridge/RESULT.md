# ap-global-bridge: the bridge on a global object (adele class space, idele classes, solenoid / Bohr torus)

Date 2026-11-17. Labels: PROVED / CLASSICAL (recalled from the literature, not re-read here) / MEASURED / ARGUED / OPEN.
Nothing here proves or refutes RH.

## Verdict

**Precise obstruction, with one new control.**

1. The global object splits into two parts that carry different halves of the input.
   - The compact part on which all rung shifts commute and act diagonally is the Bohr torus
     `G = T^P = Hom(Q*_{>0}, T)`, the dual of the ideal group `A_f*/Zhat*`. It carries multiplicativity with
     unimodular local parameters at every prime. It is homogeneous: its translation group preserves every piece
     of its structure and is transitive, so it cannot distinguish the base point `chi = 1` (zeta) from any other
     point.
   - The functional equation is the invariance under the diagonal `Q*` (Poisson summation with the
     archimedean Gaussian). Characters invariant under `Q*` form the one-parameter subgroup
     `t -> (p^{-it})_p`, a dense line of Haar measure zero in `G`. On the `Zhat*`-invariant part of
     `L^2(A*/Q*)`, where xi lives, every prime idele acts as a real dilation, so the global object restricted
     to xi is `L^2(R_{>0})` with the dense subgroup `Q*_{>0}` of dilations: the twin ladder with all `V_n`
     (row G14), with continuous spectrum and no compactness.
2. Theorem C (PROVED, elementary): for every `s0 = beta + i gamma` with `1/2 < beta < 1` there is a completely
   multiplicative `chi` with `|chi(n)| = 1` (a point of `G`) such that
   `zeta_chi(s) = sum chi(n) n^{-s} = E(s) / zeta(s - s0 + 1)` with `E` analytic and zero-free in `Re s > 1/2`.
   So `zeta_chi` is meromorphic in `Re s > 1/2`, analytic on `Re s >= beta`, and has a simple zero at `s0`.
   This is an ordinary Dirichlet series with an Euler product and unimodular local parameters at every prime.
   It is a new control ("U") that has INT and GEOM and lacks only FE; it removes `{INT, GEOM}` from the list
   of minimal input sets in OBSTRUCTION_MAP section 2 (only `{FE, SIZE}` and `{FE, GEOM}` remain).
3. Theorem D (PROVED from C): no property of the Euler symbol that is invariant under the automorphisms
   of the Bohr-torus structure (Haar measure, Kronecker flow, Hardy space, rung isometries up to phase,
   Toeplitz algebra, Breuer index) implies a zero-free region inside `Re s > 1/2`.
4. The index available on the compact object (Coburn-Douglas-Schaeffer-Singer) is real-valued and equals a
   mean motion, i.e. a density of zeros per unit height. It is `0` for zeta at every `sigma > 1/2` without RH
   (Bohr-Landau), and nonzero for Davenport-Heilbronn in `1 < sigma < 1.12`. It separates DH from zeta and
   cannot see `o(T)` zeros: MV-CAP in index form.
5. The bridge form transported to the adele class space is the Hermitian form on Meyer's spectral space
   that pairs the eigencharacter `rho` with `1 - conj(rho)`; the scaling generator is skew for it; its
   negative index is the number of off-line pairs. This is Connes' Weil-positivity criterion in the user's
   notation; no height-uniform consequence was obtained.

## 0. Plan; what is new relative to the map

- Uncovered direction 15 ("operator-theoretic constructions with an adelic space beyond the GL(1) test
  vector") and direction 7 ("Kronecker structure of several primes together") are the targets.
- Rows touched: G14 (Hecke on the twin ladder) and Q10 (chain square-summable on the Bohr torus iff
  `Re s > 1/2`). Difference: those lanes worked on one torus / one half-line and found `Re s > 1` from operator
  norms. Here the question is whether the compact global object supplies an invariant (index, ergodicity,
  rotation number) that norms do not. Answer: the invariant exists, is real-valued, and is a density; and the
  compact object is homogeneous (Theorem D).
- Row Q8 (Gohberg-Krein index of `T_S` on the line) is not re-entered: here the Toeplitz operator is on the
  Bohr group with the Euler symbol, not on `H^2` of the half-plane with the scattering symbol `S`.
- Sources. The definitions of the bridge objects are taken from the refereed restatements in
  `g-spinor-square-root/RESULT.md` (section 1), `h-hecke-torus-symmetry/RESULT.md` (Theorems 1, 4) and
  `eq48/RESULT.md`. PRs 10, 13, 29, 39, 43, 49, 56, 57 and the zeta-view repository were not re-read in this
  lane.

## 1. Adelic dictionary (CLASSICAL unless marked)

Notation: `A` adeles of Q, `C = A*/Q*` idele classes, `C = R_{>0} x Zhat*` (class number one),
`|x|` the idele norm, `u = 2 log |x|` the lane variable. `f0 = exp(-pi x^2) (x) prod_p 1_{Z_p}`.
`E(f)(x) = |x|^{1/2} sum_{q in Q*} f(qx)` (Tate / Connes / Meyer summation map `S(A) -> functions on C`).

| User object (lane notation) | Adelic object | Status |
|---|---|---|
| Seed `g0`, theta kernel `kappa = sum_n V_n g0` | `E(f0)` restricted to `R_{>0}` (it is `Zhat*`-invariant): `E(f0)(lambda) = 2 lambda^{1/2} sum_{n>=1} exp(-pi n^2 lambda^2)`; `kappa` is this with the zero mode removed (the `(d/du)`-polynomial that kills `f(0)` and `fhat(0)`) | CLASSICAL |
| Twin ladder (sum over rungs `n`) | sum over the orbit of the diagonal `Q*`; a rung is a point of `Q*/{+-1} = Q*_{>0}` meeting the support `Zhat` of the finite part, i.e. `n in N` | CLASSICAL |
| Rung shift `V_p = p^{-1/2} T_{-2 log p}` | action of the prime idele `pi_p = (1; 1, ..., p, ..., 1)`. Lemma 1: `pi_p = p . (1/p; u_p)` with `u_p in Zhat*`, so on `Zhat*`-invariant functions `pi_p` acts as the real dilation by `p`. On the `omega`-isotypic part (`omega` a Dirichlet character) it acts as `omega(p)` times that dilation | PROVED (one line) |
| Hecke algebra of all rungs, `V_m V_n = V_mn` | `(x)_p H(Q_p*, Z_p*) = C[A_f*/Zhat*] = C[Q*_{>0}]`, group algebra of the ideal group `(+)_p Z` | CLASSICAL |
| "Eigen-section iff `a(p^k m) = a(p^k) a(m)`" (T4) | `f` is a pure tensor `(x)_v f_v` with `f_p` spherical | CLASSICAL |
| Antibridge / reflection `J` (`u -> -u`) | adelic Fourier transform: `E(F f)(x) = E(f)(1/x)` up to the terms `f(0)`, `F f(0)` (Poisson summation over the self-dual lattice `Q` in `A`). `J V_n J = V_n*` is `F pi_p F^{-1} = pi_p^{-1}` | CLASSICAL |
| Dilation generator `D`, variable `z` | generator of the action of `R_{>0} = C/Zhat*`; quasi-characters `|x|^{s}` | CLASSICAL |
| Bridge shear / heat flow (multiplication by `exp(tau u^2/16)`; coefficients times `exp(t log^2 n/4)`) | multiplication by `exp(t (log|x|)^2)` on functions on `C`. It commutes with the diagonal `Q*` because `|qx| = |x|` (product formula). Lemma 2: on ideles `log|x| = sum_v log|x_v|_v`, so `exp(t (log|x|)^2) = prod_v exp(t l_v^2) . prod_{v<w} exp(2 t l_v l_w)`. The second product does not factor over places. The Gaussian 2-cocycle `2 t log m log n` of row F2 is this cross term | PROVED (one line) |
| Group acting | `C` (dilations), `Z/2` (Fourier, acting by inversion): `C x| Z/2`. With multiplications by `exp(i pi a x^2)` these generate the Weil representation of `Mp_2(A)` on `S(A)`; `Theta(f) = sum_{q in Q} f(q)` is `SL_2(Q)`-invariant; `E(f)` is the restriction of the theta function to the diagonal torus, and xi is its Mellin transform (Hecke's integral as a toric period) | CLASSICAL |
| Bridge form `H_c`; `Q_L(v) = sum_rho V(rho) conj V(-conj rho)` | Weil's sesquilinear form `W(g * g~)` on `C`, restricted to `Zhat*`-invariant `g` supported in `|x| >= e^{c/2}` (compression by the cutoff `1_{|x| > Lambda}`, the complement of Connes' `P_Lambda`) | CLASSICAL identification (eq48 item 5 + Weil explicit formula) |
| Krein square, involution `J: gamma <-> conj gamma` | on Meyer's spectral space `H = S(C)/closure(E(S(A)))` (rapid-decay model; spectrum of the dilation action = all zeros with multiplicity) the Fourier transform composed with complex conjugation gives a Hermitian form pairing the generalised eigenspace at `rho` with that at `1 - conj(rho)`. `D` is skew for the form. Negative index = number of off-line pairs (row Q6) | ARGUED: assembled from Meyer 2005 and row Q6; not written out as a proof here |
| Solenoid `A/Q` | its character group is `Q`; the theta field `Theta_f(x, a) = sum_{q in Q} f(qx) psi(qa)` is a function of `a in A/Q` whose Fourier coefficients are the rungs `f(qx)`; the ladder is its value at `a = 0` minus the zero mode. A finite ladder on `R/nZ` is the push-forward to that quotient | CLASSICAL |

Consequences.

(1a) **Collapse on the spherical vector (PROVED from Lemma 1).** On `L^2(C)^{Zhat*} = L^2(R_{>0})` the commuting
family `{pi_p}` is the dilation action of the dense subgroup `Q*_{>0}` of `R_{>0}`. The von Neumann algebra it
generates equals the one generated by all dilations (strong continuity), which is maximal abelian. The joint
spectral measure of the rung shifts, as a measure on `G = T^P`, is the image of Lebesgue measure under
`t -> (p^{-it})_p`. It is continuous and singular to Haar measure. So on the part of the global object where
xi lives, the rung shifts for all primes have no discrete joint spectrum, and the object is the same
half-line that every geometric lane used. The compact direction of `C` is `Zhat*`; its discrete spectrum is
the set of Dirichlet characters (the conductor grading), not the zeros.

(1b) **Heat control (PROVED from Lemma 2).** `H_t` is the Mellin transform over `C` of `E(f0) exp(t log^2|x|)`,
which is the `Q*`-sum of a function on the ideles that is not a pure tensor for `t != 0`. The control HEAT
fails the dictionary at "pure tensor", which is where the Euler product comes from. It keeps `Q*`-invariance
and the symmetry `x -> 1/x`, hence the functional equation and every form identity.

(1c) **Where each control sits.**

| Control | On the global object | Missing structure |
|---|---|---|
| DH | `E(f)` for `f = f_inf (x) f_5 (x) prod_{p != 5} 1_{Z_p}`, `f_5 = (c chi_5 + conj(c) conj(chi_5)) 1_{Z_5*}`, `f_inf` odd; DH is the Mellin transform of `E(f)` along the slice `R_{>0} x {1}` of `R_{>0} x Zhat*` | `E(f)` is not an eigenvector of the compact group `Zhat*`; the slice is not a quotient of `C`. `pi_p` acts by `chi_5(p)` and `conj(chi_5(p))` on the two components; these agree iff `p = +-1 mod 5` (matches G14). The zero set of DH is not the dilation spectrum of any `C`-invariant subquotient of Meyer's space: such a spectrum consists of pairs (Hecke character `omega`, `s`) with `L(omega, s) = 0`, and at DH's off-line zero neither `L(s, chi_5)` nor `L(s, conj chi_5)` vanishes (PROVED-rel Meyer's theorem and the verified GRH range for conductor 5; not re-certified here) |
| HEAT | (1b) | pure tensor over places |
| TW (unimodular, completely multiplicative) | a character of `A_f*/Zhat*` that is not trivial on `Q*`: a point of `G` off the automorphic line | `Q*`-invariance; the map `E` is not defined, so no Poisson summation |
| U (new, Theorem C) | same as TW, a specific point of `G` | same; has a zero at `s0` |
| EA | the `C`-module twisted by the non-unitary characters `|x|^{+-a}` (Eisenstein data on `GL_1 x GL_1`) | unitarity of the central character on `R_{>0}`; the Hermitian form pairs `rho + a` with `1 - conj(rho) - a` |
| NR | Tate integral with a non-spherical self-dual `f_q` | sphericity at `q`. Meyer's spectrum is defined from all test vectors and does not contain NR's added zeros |
| B | no global field; no diagonal lattice | the adele ring itself |

DH and NR are "not objects" in the spectral realisation. By the rule of the map (Q1), "not formulable" is
not a quantitative handle: the realisation excludes them by definition of its spectrum, and for zeta its
spectrum contains every zero wherever it lies (Meyer), so the exclusion gives no information on location.

## 2. The compact object: Bohr torus, Toeplitz operators, index

Setting. `Gamma = Q*_{>0}` (discrete), ordered by `log: Gamma -> R`. `G = dual of Gamma = T^P`, Haar measure
`m`. Kronecker flow `k_t(chi)(p) = chi(p) p^{-it}`. Hardy space `H^2(G)` = closed span of the characters
`e_n(chi) = chi(n)`, `n in N` (Bohr lift: `sum a_n n^{-s} <-> sum a_n e_n`). Rung isometries `M_p` =
multiplication by `e_p`; they commute, and `p^{-sigma} M_p` is the lift of `V_p` on the line `Re s = sigma`.
Euler symbol `F_sigma(chi) = prod_p (1 - chi(p) p^{-sigma})^{-1}`. The automorphic line is
`{k_t(1)}`; `F_sigma(k_t(1)) = zeta(sigma + it)` for `sigma > 1`.

**Proposition A (CLASSICAL; statements recalled).**
(a) `sigma > 1`: `F_sigma` and `1/F_sigma = sum mu(n) n^{-sigma} e_n` are in the Wiener algebra of `H^infty(G)`.
The Toeplitz operator `T_{F_sigma}` is invertible with inverse `T_{1/F_sigma}`. Mean motion of `F_sigma`
along every flow line is `0`. This is "zeta has no zeros in `Re s > 1`", for every point of `G`.
(b) `1/2 < sigma <= 1`: `F_sigma` and `1/F_sigma` are in `H^2(G)` (norms `zeta(2 sigma)^{1/2}` and
`(zeta(2 sigma)/zeta(4 sigma))^{1/2}`), so `F_sigma` is outer. Helson 1969: for `m`-almost every `chi`,
`zeta_chi` continues to `Re s > 1/2` and has no zeros there. This is a theorem of the structure. It uses all
primes together and multiplicativity (`1/F` is in `H^2` because `F` is an Euler product with unimodular
parameters). It fails for DH (its Bohr lift is a sum of two translated Euler symbols and is not outer),
for EA (`F` is in `H^2` only for `sigma > 1/2 + a`), for HEAT (no ordinary Dirichlet series), for NR
(inverse not in `H^2` at the level `Re s <= 1/2 + arccosh(|c|/2)/log q`).
(c) Index. For a dense ordered subgroup of `R` there is no integer Fredholm index: a Toeplitz operator with
continuous invertible symbol on `G` is Fredholm only if invertible (Coburn-Douglas; Gohberg-Feldman). The
Breuer index in the type II_infty algebra (Coburn-Douglas-Schaeffer-Singer) equals minus the mean motion of
the symbol along the flow. By Jessen-Tornehave the mean motion at abscissa `sigma` is `2 pi` times the
density of zeros to the right of `sigma`. For zeta the Jessen function is `0` on `sigma > 1/2`
(Bohr-Landau `N(sigma, T) = o(T)`; Borchsenius-Jessen), without RH. For DH the density is positive for
`sigma` in `(1, 1.1203...)` (Davenport-Heilbronn: `>> T` zeros in `Re s > 1`).
(d) Unique ergodicity of the Kronecker flow gives time average = space average at every point for
continuous observables. For `sigma <= 1` the observable `log|F_sigma|` is unbounded and discontinuous. At the
automorphic point the equality still holds in mean square (Hardy-Littlewood:
`(1/T) int |zeta(sigma+it)|^2 -> zeta(2 sigma) = ||F_sigma||^2`), and the proof uses the approximate functional
equation. This is the one transport from "almost every point" to the automorphic point, and it is an `L^2`
statement.

Reading of (c): the index on the compact object is a density. It is a theorem of the structure that the
density of zeros of zeta in `Re s > sigma` is zero, and it separates DH. It is silent about any `o(T)` set of
zeros. An integer-valued index needs the closure of the image of `log` to be discrete; that is the function
field case (`log N(ideal) in Z log q`, the Kronecker line closes up to a circle, the Toeplitz index is a
winding number and counts the finitely many zeros). Over Q the `log p` are linearly independent over Q, the
line is dense, and the factor is of type II.

**Theorem C (PROVED).** Let `s0 = beta + i gamma`, `1/2 < beta < 1`. Enumerate the primes `p_1 < p_2 < ...`,
put `eps_k = (-1)^k`, `phi_p = arccos(-p^{beta-1})`, and define the completely multiplicative `chi` by
`chi(p_k) = p_k^{i gamma} exp(i eps_k phi_{p_k})`. Then `|chi(n)| = 1` and, first for `Re s > 1` and then by
continuation,

    zeta_chi(s) = exp( h0(s - s0 + 1) + R(s) + h(s) ) / zeta(s - s0 + 1),

with `h0(w) = sum_p sum_{k>=2} p^{-kw}/k` (analytic in `Re w > 1/2`),
`h(s) = sum_p sum_{k>=2} chi(p)^k p^{-ks}/k` (analytic in `Re s > 1/2`), and
`R(s) = i sum_k eps_k sin(phi_{p_k}) p_k^{-(s - i gamma)}` (analytic in `Re s > 0`).
Hence `zeta_chi` is meromorphic in `Re s > 1/2`; its only zero there is a simple zero at `s0`; its poles
there are the points `s0 - 1 + rho` with `zeta(rho) = 0`, `Re rho > 3/2 - beta` (none if RH holds; none with
real part `>= beta` unconditionally; none with real part `> beta - 1/8` given the 7/8 theorem).

Proof. `chi(p) = p^{i gamma}(-p^{beta-1} + i eps sin phi_p)`, so
`sum_p chi(p) p^{-s} = -sum_p p^{-(s - s0 + 1)} + R(s)`. With `sum_p p^{-w} = log zeta(w) - h0(w)` and
`log zeta_chi(s) = sum_p chi(p) p^{-s} + h(s)` the formula follows for `Re s > 1`. Convergence of `R`: with
`g(x) = (1 - x^{2 beta - 2})^{1/2} x^{-(s - i gamma)}`, the paired terms satisfy
`|g(p_{2j-1}) - g(p_{2j})| <= int_{p_{2j-1}}^{p_{2j}} |g'|`; the intervals are disjoint and
`g'(x) = O((1 + |s|) x^{-1 - Re s})`, so the paired series converges absolutely and locally uniformly in
`Re s > 0`, and single terms tend to 0. No information on prime gaps is used. ∎

Remarks. (i) Changing `chi` at finitely many primes multiplies by a zero-free finite Euler quotient, and the
same construction with `-sum_j p^{s_j - 1}` in place of `-p^{s0 - 1}` (for primes beyond a bound) places any
finite set of zeros. (ii) The set `E_delta = {chi : zeta_chi has a zero in Re s > 1/2 + delta}` is
flow-invariant, nonempty by Theorem C, hence dense (every orbit is dense), and `m`-null by Helson. RH for
`Re s > 1/2 + delta` is the statement `1 not in E_delta`. (iii) Novelty not checked; the construction is of
the type used for Beurling systems (Diamond-Montgomery-Vorhauer), here inside the rational primes.

Numerical check (MEASURED, float64, `twist_zero.py`, run through `scripts/memcap.sh 8`, peak planned
allocation 0.96 GB, 39 s). `s0 = 0.9 + 3i`. Smoothed Dirichlet sum `S_M(s) = sum chi(n) n^{-s} e^{-n/M}`
against the closed form:

| M | abs S_M(s0) | abs(S_M - closed form) at 0.95+3i | at 0.75+3.4i | at 1.3+3i |
|---|---|---|---|---|
| 1.25e4 | 8.07e-3 | 5.2e-3 | 2.1e-2 | 3.8e-4 |
| 5e4 | 3.63e-3 | 2.2e-3 | 1.1e-2 | 1.1e-4 |
| 2.5e5 | 1.37e-3 | 7.8e-4 | 5.6e-3 | 2.7e-5 |
| 1e6 | 5.65e-4 | 3.1e-4 | 2.9e-3 | 7.7e-6 |

Closed-form values: 0.0735 at `0.95+3i`, 0.650 at `0.75+3.4i`, 0.396 at `1.3+3i`. Winding number of `S_M`
(M = 1e6) on the circle `|s - s0| = 0.08`: 1.0000 (minimum modulus on the circle 0.113). Files
`twist_zero_2000000.json`, `twist_zero_40000000.json`.

**Theorem D (homogeneity; PROVED from C).** For `chi0 in G` let `tau(chi) = chi chi0` and `U f = f o tau`.
Then `U` is unitary on `L^2(G, m)`, commutes with the Kronecker flow, satisfies `U e_n = chi0(n) e_n`, hence
preserves `H^2(G)`, `H^infty(G)`, the order on `Gamma`, the Toeplitz algebra and its trace, and conjugates
each rung isometry `M_p` to `chi0(p) M_p`. It maps the Euler symbol of zeta to the Euler symbol of
`zeta_chi0`. Therefore any property of the symbol defined from the structure
`(G, m, k_t, Gamma_+, H^2, {M_p} up to unimodular scalars)` holds for zeta iff it holds for `zeta_chi0`. With
`chi0` from Theorem C: no such property implies that the continuation along the flow line through the base
point is zero-free in `Re s > 1/2 + delta`, for any `delta < 1/2`.

Corollary. The following candidate invariants from the task are of this kind and are excluded as stated:
ergodicity and unique ergodicity of the flow or of the idele action on the solenoid; the rotation number /
mean motion; the Breuer-Fredholm index of a Toeplitz operator on `G` whose symbol is built from the Euler
product; invertibility or outerness of the symbol; any joint spectral property of the commuting rung shifts.
For `sigma <= 1` there is a second, independent reason: `F_sigma` is an element of `L^2(G)` (a class modulo
null sets) and the automorphic line is null, so the class does not determine `zeta(sigma + it)`; the value is
obtained only by analytic continuation in `sigma` along the line, which depends on the base point.

## 3. What distinguishes the base point, and why it does not combine with section 2

The base point `chi = 1` is distinguished in `G` by `Q*`-invariance: the characters of `A*/Zhat*` trivial on
`Q*` are exactly the automorphic line. `Q*`-invariance is what makes `E` and Poisson summation available,
i.e. the functional equation. It is not a property of the compact group `G`; it involves the archimedean
place (the line is the dual of `R_{>0} = C/Zhat*`). Adding it means leaving `G` for the adele class space, and
there (1a) applies: on the spherical vector the object is `L^2(R_{>0})` with `Q*_{>0}` acting by dilations.

So the global object does not put the two halves in one compact structure:

- compact, all primes commuting and diagonal, multiplicative, unimodular: `G`. No functional equation; control
  U lives here with a zero at any prescribed point of the strip.
- functional equation and the bridge form: `L^2(R_{>0})` (or Meyer's space). Non-compact, continuous
  spectrum; every identity holds for DH and HEAT (rows G6, Q6, P1).

The link between them is the diagonal embedding of `Q*`, used in the single step "sum over `Q*`". This is
row S1 ("no member relates the two regions") in adelic form.

Comparison with the literature (CLASSICAL; recalled).
- Connes 1999: zeros on the critical line as an absorption spectrum of the dilation action on a weighted
  `L^2` of the adele class space; the global trace formula with cutoff is equivalent to RH for all
  L-functions with Groessencharakter; Weil positivity is the criterion. The semilocal trace formula (finite
  set of places) is proved.
- Meyer 2005: on a space of rapidly decaying functions the dilation spectrum of the cokernel of the summation
  map is the full zero set with multiplicities, with no positivity statement.
- Connes-Consani 2021-2023: Weil positivity at the archimedean place for small support via Sonine spaces and
  the prolate operator.
- What this lane adds to these: the identification of the bridge form with the compressed Weil form and of
  the Krein involution with Fourier-plus-conjugation on Meyer's space (dictionary; ARGUED), Lemma 2 (the heat
  flow is a non-decomposable test vector), the DH row of (1c), and Theorems C, D. None of these is a statement
  about the location of a zero of zeta.
- Height-uniform statement obtained: only the density statement of Proposition A(c), which is classical.

Finite windows (ARGUED, known in substance). On tests supported in a fixed window of length `L` in `u`, the
archimedean part of the Weil form has symbol growing like `log|t|` and the prime part is a bounded operator
(norm at most `sum_{n <= e^L} Lambda(n) n^{-1/2}`), so the form is bounded below with finite negative index
`kappa(L)`. This is the compactness available on the class space. It holds for DH with its own coefficients
and is not uniform in `L`: `kappa(L) = 0` for all `L` is RH (rows G11, Q6).

## 4. Controls against the three requirements

- All primes together: Proposition A(b) and Theorem D use all primes jointly. Requirement met by the compact
  object.
- Every height, every window: not met. The structural theorem on `G` is "almost every point" (Helson) and
  "density zero at the automorphic point" (Bohr-Landau). Theorem C shows the pointwise statement is false at
  a dense set of points of the same object.
- Controls: DH fails outerness and has nonzero Breuer index (section 2); in the spectral realisation it is
  not an eigen-object of `Zhat*` and its zeros are not a spectrum (section 1c). HEAT is not a pure tensor
  (Lemma 2). EA fails `H^2` at `sigma <= 1/2 + a`. NR fails outerness at one prime and is not in Meyer's
  spectrum. B has no adele ring. TW- with unimodular completely multiplicative signs **passes** every
  Bohr-torus statement (Theorem D) and has a zero where prescribed (Theorem C). This is the control that
  defeats the lane.

## 5. Verdict

Precise obstruction. The compact global object carries multiplicativity and no functional equation, is
homogeneous under its own translations, and contains a point (control U) whose L-function has a zero at any
prescribed point of `1/2 < Re s < 1`. Its index theory returns zero densities, which are already known to
vanish. The functional equation enters only through the diagonal `Q*`, and on the part of the adele class
space where xi lives the prime ideles act as real dilations, which returns the single half-line of the earlier
lanes. No theorem or conjecture about zeta zeros is claimed.

## 6. Three weakest steps

1. Classical statements are recalled, not re-read: Helson 1969 (almost-sure continuation and zero-freeness),
   Coburn-Douglas-Schaeffer-Singer (real-valued index = mean motion), Borchsenius-Jessen (Jessen function of
   zeta is 0 on `sigma > 1/2`), Meyer 2005 (spectrum = all zeros), Davenport-Heilbronn zero density in
   `Re s > 1`. Proposition A depends on them; Theorems C and D do not.
2. Theorem D covers invariants of the structure listed in its statement. A structure on `G` that includes
   the base point together with archimedean data is outside it; section 3 argues that this is the adele
   class space and that nothing new appears there, but that part is an argument, not a theorem. The Krein-form
   row of the dictionary is assembled from Meyer and row Q6 and was not written out as a proof.
3. The numerical check of Theorem C is float64 at one `s0`, with smoothing errors `5.7e-4` at `M = 1e6`; it is
   a consistency check, the proof is the paired-series argument. The DH row of (1c) uses non-vanishing of
   `L(s, chi_5)` at DH's off-line zero from verified GRH ranges and was not certified here. Novelty of
   Theorem C was not checked against the literature.

## 7. Next step

Add control U to OBSTRUCTION_MAP section 2 and remove `{INT, GEOM}` from the minimal input sets. If the
global line is continued, the only position left is the diagonal step itself: Connes' semilocal form for a
finite set of places `S`, with the bridge Krein index `kappa_S(L)` as the tracked quantity, and the question
whether `kappa_S(L)` can be bounded uniformly in `S` at fixed `L` (the memory notes on Route I record the
`S = {inf, 2}` remainder; that route is closed past `ln 2`).
