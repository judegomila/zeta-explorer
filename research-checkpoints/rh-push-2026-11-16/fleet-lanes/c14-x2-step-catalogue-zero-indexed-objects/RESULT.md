# c14-x2-step-catalogue-zero-indexed-objects: RESULT

Round 14, kind combine (census and device table of `c13-tnr-invariance-prefilter-noncone-census` with the open cell of
`c13-lrs-twist-amplification-zero-representation`). Date 2026-11-19. Paper lane. Two local runs through
`scripts/memcap.sh 8` (`.venv-arb/bin/python -I`; each under 5 s, under 200 MB). The server was not used.
Nothing here is a statement about zeros of zeta beyond classical facts that are named as such. No requirement flag
is claimed.

Labels: PROVED (argument written here) / CLASSICAL (recalled, standard) / OPENED (read in a source opened in this
lane) / RELATIVE (relative to a named source that was not opened) / ARGUED / MEASURED / OPEN.

## Verdict

**Precise obstruction. The list asked for is empty inside the strip.** Twelve proved inequalities were catalogued
(the eight of the assignment and four added). For each, the three zero-indexed objects on file were substituted.

1. No entry has all its hypotheses met by a zero-indexed object at a zero with `0 < Re rho < 1`.
2. One entry (E10, non-vanishing by the Eisenstein-series method) is met in full by a zero-indexed object, with one
   hypothesis that holds only at zeros, exactly when `Re rho = 1`. It is then the classical proof of
   `zeta(1 + it) != 0`. For a zero in the strip the same entry fails at one hypothesis, and that hypothesis is
   "`xi(2 - rho) = 0`", which is false because `2 - rho` lies in the region of absolute convergence (Proposition E).
3. Every entry that reads the object through L-functions (E1 to E6, E9) is decided by one lemma (Lemma T): for an
   object whose parameter lies in the diagonal torus, every `L(s, Pi, r x chi)` is a product of shifted Dirichlet
   L-functions, and the rightmost pole of the untwisted function and the rightmost local or gamma pole of the twists
   are at distance exactly 1 for every parameter and every `r`. The hypothesis "pole at 1" is then equivalent to
   "all parameters purely imaginary", which is the strongest possible conclusion of the entry.
4. For `E*(z, rho/2)` (O1) the failing hypothesis is the same for the generic parameter in every entry. One met
   hypothesis is specific to zeros (single pole pair, `c13` Lemma 1); it is consumed by E1, E2, E5 and changes
   nothing downstream.
5. For the weight-1/2 series at `1/4 + rho/2` (O2) the failing hypothesis in every entry is unitarity or membership
   of the `L^2` spectral resolution, which holds iff `Re rho = 1/2`: it is the target, not a property of zeros, and
   it holds at every point of the critical line, zero or not. The property that is specific to zeros
   (theta-orthogonality, equivalently vanishing central value of the shadow) is not a hypothesis of any catalogued
   inequality.
6. For the Lax-Phillips resonance vector (O3) the failing hypothesis in every entry is the Hecke eigen-relation
   (row G26); the generic-parameter control does not exist there, and the passing control is BLS.

Round 15 receives no explore device from this catalogue. It receives the closure of the cell "catalogued X2
inequality on an eigen-object with torus parameter" (Lemma T), and a specification of what a device outside the
catalogue would have to supply (section 6).

## 0. Plan; what is new against the record

Read: BRIEF.md to the end; map section 2 (controls) and rows P25, P50, P52, G12, G26, G31, G32, L1, L4, D4;
`c13-tnr-invariance-prefilter-noncone-census` (Lemma P, step types X1 to X5, device table, pending-proposal table);
`c13-lrs-twist-amplification-zero-representation` (Lemmas 1 to 4); `sym-power-positivity`;
`c8-hecke-entropy-resonance-rigidity`; `n4-kunneth-multiple-euler`; `res-point-spectrum-square` Theorem Z;
round-14 allocation in ROUND_LOG.md; `controls_BLS_proposed.json` of `c13-kacmoody-eisenstein-affine-weyl-shift`.

Source opened: P. Sarnak, "Notes on the generalized Ramanujan conjectures" (Clay Math. Proc. 4 (2005)), text of the
copy on the author's page, section 1, displays (11) to (25) and the footnote on Deligne. It covers E2 to E6.
Not opened: the primary papers of every entry. Entries E7, E8, E10, E11, E12 are RELATIVE.

On file already: LRS on O1 (`c13`, Lemmas 1 to 4); tensor squeeze as a device (row D4); companions in 3-4-1 (P25);
central-value squares (G32); Hecke recurrence on resonance states (G31); compressed Hecke operators (G26).
New here: the catalogue with step attribution; Lemma T (all `r`, not only `std x std~`); the dictionary of
section 3.2; Proposition E (the one entry met in full, at the edge); the columns for O2 and O3; the statement that
no catalogued inequality has theta-orthogonality or central vanishing as a hypothesis.

Three questions of map section 2. Q1: section 5. Q2 and Q3: no attack is made; every conclusion obtained is either
an identity or a classical fact.

## 1. The objects

`xi(u) = pi^(-u/2) Gamma(u/2) zeta(u)`. `rho = beta + i gamma` a zero with `0 < beta < 1` unless said otherwise.

| Code | Object | Parameter (shadow on GL_2) | Constant term | Specific to zeros |
|---|---|---|---|---|
| O1 | `E*(z, rho/2)`, weight 0, `SL_2(Z)` | torus parameter `(nu, -nu)`, `nu = (rho - 1)/2`, `abs(Re nu) = (1 - beta)/2`; L-function `zeta(s + nu) zeta(s - nu)` | `xi(rho - 1) y^(1 - rho/2)` only; `xi(rho - 1) = xi(2 - rho) != 0` | Z1: one exponent instead of two (`c13` Lemma 1: one simple pole pair of the Rankin-Selberg function) |
| O2 | weight-1/2 Eisenstein series on `Gamma_0(4)` at `s_rho = 1/4 + rho/2` (RELATIVE to the coefficient formulas recalled in Theorem Z(b)) | `T_(p^2)`-eigenvalue `p^(rho - 1/2) + p^(1/2 - rho)`: shadow `E(z, rho)`, torus parameter `(nu', -nu')`, `nu' = rho - 1/2`, `abs(Re nu') = abs(beta - 1/2)` | two exponents, coefficients `xi(2 rho)`, `xi(2 rho - 1)` up to elementary factors; both non-zero when `beta = 1/2` (PROVED: `zeta(1 + it) != 0`) | Z2: coefficients at square indices vanish; equivalently the central value of the shadow, `zeta(rho) zeta(1 - rho)`, vanishes |
| O3 | eigenvector of the Lax-Phillips generator `B` on the space `K`, eigenvalue `rho/2 - 1/2` (Theorem Z(a), G26) | none: `K` is not stable under the Hecke operators; `P_K T_p P_K = Z(log p) + Z(log p)^*` | not applicable (finite energy norm) | Z4: the vector exists only at resonances |

Checks (`checks2.json`, MEASURED, 30 digits): at the first three zeros `abs(xi(rho))` is below 1.1e-35 while
`abs(xi(rho - 1)) = abs(xi(2 - rho))` = 1.42e-5, 8.58e-8, 4.38e-9; `abs(xi(2 rho)) = abs(xi(2 rho - 1))` = 6.28e-10,
5.36e-15, 6.55e-18 (non-zero); central value of the shadow below 3e-60. Imaginary part of the Casimir value
`s(1 - s)`: O1 3.53 at `beta = 1/2`; O2 0 at `beta = 1/2` and -1.41 at a test point `beta = 0.7`.

Controls as objects of this lane:

- **E_a**: `E(z, 1/2 + a)`, `0 < a < 1/2` real; torus parameter `(a, -a)`. Local components are complementary
  series: unitary and generic at every place. Not square-integrable.
- **EIS-w**: the same series as O1 or O2 at a parameter where the relevant zeta value does not vanish.
- **T-NR**: the same automorphic representation as the target with a non-spherical vector at one prime `q`. At
  level 1 it is not constructed (`c13` section 5, OPEN). Its typed step is X2 at `q`.
- **BLS**: defined at the level of the scattering coefficient only; it has every p-adic local factor of zeta and
  lacks a vector at the archimedean place.
- **DH**: a combination of two eigen-objects with different eigenvalues at `p = 2, 3 mod 5`; the weight-0 model is
  identically zero (G31, withdrawn Lemma G2 (i)).

## 2. The catalogue

Hypothesis codes: EIG (Hecke eigen-relation, exact local factor at every prime), AUT (automorphy), CUSP (constant
term zero), L2, UNIT (unitary local components), GEN (generic), POLE1 (the Rankin-Selberg-type function has its
rightmost pole at 1, simple), ENT (twists by primitive characters entire), SPEC (member of the spectral resolution
of a self-adjoint Hecke algebra on `L^2`), POS (non-negative coefficients).

| # | Inequality | Object class; hypotheses | Parameter bounded | Step that uses the eigen-relation or exact local factor | Step that uses the functional equation | Source state |
|---|---|---|---|---|---|---|
| E1 | Rankin 1939, Selberg 1940: `sum_(n<=x) abs(a(n))^2 = c x + O(x^(3/5))`, hence `a(n) << n^(3/10)` in the unitary normalisation | cusp form on `SL_2(Z)`; CUSP, L2 | size of single coefficients | none: the unfolding of `abs(f)^2` against `E(z, s)` holds for every cusp form. Type S2 of the pre-filter (coefficient squares) | functional equation of `E(z, s)`, transported to `zeta(2s) sum abs(a(n))^2 n^(-s)`; Landau's theorem on series with non-negative coefficients and a functional equation | CLASSICAL; primary not opened |
| E2 | Rankin-Selberg-Serre with Landau's theorem: `abs(log_p abs(alpha_j(pi_p))) <= 1/2 - 1/(n^2 + 1)`, finite places | cuspidal on `GL_n`; EIG, CUSP, L2, POLE1 | Satake parameters at finite `p` | `L(s, pi x pi~)` has an Euler product whose local factor at `p` carries `alpha_i conj(alpha_j)`; deformation in the family `s` | functional equation of `L(s, pi x pi~)` (degree `n^2`), which sets the remainder exponent in Landau's theorem | OPENED for the description (Sarnak p. 664 to 665); the exponent is recalled (Serre's letter, not opened) |
| E3 | Langlands' observation and Deligne's use of it: if `L(s, pi, sym^k)` is analytic in `Re s > 1` for all `k`, then `abs(alpha_p) = 1` | cuspidal on `GL_2` with all symmetric powers analytic right of 1 (function fields: a local system with known monodromy); EIG, POS, POLE1 for every `k` | Satake parameters | exact local factor of `sym^k` (or of the `2k`-th tensor power) at every prime; non-negativity of the coefficients of the logarithm; Landau's lemma: no local factor has a pole right of the abscissa | none in the squeeze itself. In Deligne's setting duality turns the one-sided bound into an equality; in the number-field setting analyticity in `Re s > 1` comes from E4 applied to the lifts | OPENED (Sarnak p. 666 and footnote); Weil I not opened; row D4 |
| E4 | Jacquet-Shalika: for `pi_v` generic and unitary, `L(s, pi_v x pi~_v)` is analytic in `Re s > 1`; hence exponents `< 1/2` at every place | local component of a cuspidal representation of `GL_n`; UNIT, GEN (both follow from CUSP globally) | Satake and archimedean parameters | exact local factor (11) of the notes; the statement is local at each place | none (local). Globally UNIT comes from L2 and GEN from the Fourier expansion | OPENED (Sarnak (11) to (13)); the notes state that the bound is sharp among generic unitary representations |
| E5 | Luo-Rudnick-Sarnak: exponents `<= 1/2 - 1/(n^2 + 1)` at every place | cuspidal on `GL_n`; EIG, CUSP, L2, POLE1, ENT, POS | Satake and archimedean parameters | factorisation (16): the local factor at `v_0` splits off; a pole of that factor at `sigma_0` in `(0, 1)` forces `L^(S_0)(sigma_0, pi x pi~ x chi) = 0` for all `chi` trivial at `v_0` | analyticity of the completed twisted function in `0 < Re s < 1` and its functional equation in the conductor aspect (average over `chi` of conductor `q`); positivity of the coefficients of `L(s, pi x pi~)` | OPENED (Sarnak (14) to (17)); exponent count reconstructed in `c13` section 3 |
| E6 | Kim-Shahidi `1/9`; Kim-Sarnak `7/64` | cuspidal on `GL_2` over `Q` with `sym^k`, `k <= 4`, cuspidal on `GL_(k+1)`; EIG, CUSP, L2 for the lifts; ENT for the twisted symmetric square of `sym^4` | Satake and archimedean parameters | exact local factors of `sym^k`; Rankin-Selberg products of pairs of lifts (`k <= 9`); for `7/64` the symmetric square L-function of `sym^4 psi` on `GL_5` in place of the Rankin-Selberg function in (16) | as E5, with smaller analytic conductor; Duke-Iwaniec technique at finite places | OPENED (Sarnak (19) to (24)); primaries not opened |
| E7 | Amplification (Duke-Friedlander-Iwaniec subconvexity; Iwaniec-Sarnak sup-norm bound) | one member of an orthonormal Hecke basis, or one L-function of a family; EIG, SPEC, L2 | central value or sup norm, in the spectral or conductor parameter | the amplifier `sum x_p lambda(p)`; its lower bound uses `lambda(p)^2 - lambda(p^2) = 1` at every prime in its support | automorphy as the geometric side of the pre-trace or Kuznetsov formula; for central values the approximate functional equation. Positivity: every other spectral term is a square and is dropped | RELATIVE (not opened) |
| E8 | Entropy and recurrence for Hecke eigenfunctions (Rudnick-Sarnak; Bourgain-Lindenstrauss; Lindenstrauss; Soundararajan for escape of mass) | `L^2`-normalised joint eigenfunction on an arithmetic surface; EIG, AUT, L2 | mass of small tubes; entropy of limits; mass in the cusp | the eigen-relation over the `p + 1` Hecke points, for many `p`, with bounded overlap of the images of a small set | invariance under the group (the Hecke images are folded into the quotient); total mass 1 | RELATIVE (not opened); G31 and `c8` on file |
| E9 | Landau's lemma on positive Euler products: 3-4-1, non-vanishing on `Re s = 1`, absolute convergence of `L(s, pi x pi~)` in `Re s > 1` | a product of L-functions whose logarithm has non-negative coefficients; EIG, POS | order of zeros on the line of the pole against order of the pole | exact local factors at every prime, at log level (type X1): `c(p^k) >= 0` | none; continuation to a neighbourhood of the abscissa only | CLASSICAL; rows P25, D4; `sym-power-positivity` Theorem B (the shape is sharp for a Beurling system) |
| E10 | Eisenstein-series method (Selberg, Langlands; Jacquet-Shalika 1976; Sarnak 2004): `E(z, s)` is holomorphic on `Re s = 1/2`, hence `zeta(1 + it) != 0` | an Eisenstein series on the unitary axis; AUT, EIG, and CUSP supplied by the hypothetical zero | zeros of the denominator `xi(2s)` on `Re 2s = 1` | the n-th Fourier coefficient `tau_s(n) K_(s-1/2)(2 pi n y)` is non-zero (so the function is not zero); orthogonality of cusp forms to Eisenstein series | `E*(z, s) = E*(z, 1 - s)` together with `conj(s_0) = 1 - s_0` on the unitary axis, so that the conjugate of the object is a member of the same family | RELATIVE (argument rewritten and checked in section 4; primaries not opened) |
| E11 | Waldspurger, Kohnen-Zagier, Katok-Sarnak: `L(1/2, f x chi_D) = kappa abs(c(D))^2 / <g, g> >= 0` | self-dual unitary cuspidal `f` and its half-integral weight correspondent `g`; EIG, UNIT, L2 | sign of central values | Shimura correspondence: `T_(p^2)` on `g` against `T_p` on `f` at every prime | centre of the functional equation of the self-dual twist | RELATIVE (not opened); row G32 |
| E12 | Iwaniec 1987, Duke 1988: bound for Fourier coefficients of half-integral weight cusp forms at squarefree indices; in weight 3/2 the form must be orthogonal to one-variable theta series | cusp form of half-integral weight; SPEC, L2, CUSP; theta-orthogonality (weight 3/2) | size of `c(D)`, `D` squarefree | none at squarefree indices; the passage to general indices uses `T_(p^2)` and a bound for the shadow | automorphy as the geometric side of the Petersson or Kuznetsov formula (Salie sums); positivity: the other members of the basis are dropped | RELATIVE (recalled, not opened) |

Reading of the catalogue against the census of `c13` lane 4.

- E2 to E8 and E11 consume a step of type X2; E9 consumes X1; E1, E10 and E12 (squarefree part) consume neither
  (E1 and E12 are coefficient squares, type S2; E10 is a linear identity with a non-vanishing statement).
- In every entry whose conclusion is a bound with exponent below `1/2`, the eigen-relation is used together with
  one of POLE1, L2 or SPEC. None uses the eigen-relation with the functional equation alone.
- The parameter bounded is in every case a local parameter, a size, a sign at the centre, or a zero of a
  denominator on the edge. None bounds the position of a zero of the object's own L-function inside its strip.

## 3. Lemma T and the dictionary

### 3.1 Lemma T (torus parameters; PROVED)

Let `lambda = (lambda_1, ..., lambda_n)` be complex and `Pi_lambda` the object with `L(s, Pi_lambda) =
prod_i zeta(s + lambda_i)` (Satake parameters `p^(-lambda_i)` at every `p`). Let `r` be a finite-dimensional
representation of the dual group built from the standard representation, its dual and their complex conjugates,
with weights `mu` (with multiplicity), and put `l_mu = <mu, lambda>` (for `std x conj(std)~` these are
`lambda_i + conj(lambda_j)`). Put `m = min_mu Re l_mu`.

(i) For every Dirichlet character `chi`, `L(s, Pi_lambda, r x chi) = prod_mu L(s + l_mu, chi)`.
(ii) The untwisted function has a pole on the line `Re s = 1 - m`, and none to the right of it; its Dirichlet
series converges absolutely exactly for `Re s > 1 - m`.
(iii) For primitive even `chi != 1` the completed twisted function is entire. Its gamma factor has its rightmost
poles on `Re s = -m`, at `s = -l_mu0` for the minimising weights, and the finite part vanishes there because its
factor `L(s + l_mu0, chi)` equals `L(0, chi) = 0`. At a finite `p` with `chi(p) = 1` the local factor has its
rightmost poles on the same line, and the partial L-function vanishes there because it equals the full one times
the inverse local factor.
(iv) Hence `P - beta_0 = 1` for every `lambda` and every `r`, where `P` is the abscissa of (ii) and `beta_0` that of
(iii). If the set of real parts `Re l_mu` is symmetric under change of sign (true for `lambda = (nu, -nu)` and every `r`
above, by Weyl invariance of the weights), then `P = 1` iff `Re l_mu = 0` for all `mu`.

Proof. (i) Both sides are Euler products with local factor `prod_mu (1 - chi(p) p^(-s - l_mu))^(-1)`: the
eigenvalues of `r` on the torus element `diag(p^(-lambda_i))` are `p^(-l_mu)`. (ii) The factor of a minimising
weight `mu_0` has a pole at `s = 1 - l_mu0`; every other factor is `zeta(1 + l_mu - l_mu0)` with argument of real
part at least 1, so it is non-zero or has a pole there. Absolute convergence: each factor converges absolutely
iff `Re(s + l_mu) > 1`. (iii) `Gamma_R(s + l_mu)` has its rightmost pole at `s = -l_mu`; `L(0, chi) = 0` for even
primitive `chi != 1` (CLASSICAL). (iv) Subtract; under the symmetry assumption `m = -max_mu abs(Re l_mu)`. QED

For `r = std x conj(std)~` this is `c13` Lemma 4 (i), (ii). Check (`checks.json` key C, arithmetic): `sym^m x
conj(sym^m)~` on `(nu, -nu)` with `beta` in {0.5, 0.7}, `m` in {1, 2, 4, 8}: `P = 1 + m(1 - beta)`, `beta_0 = m(1 - beta)`,
difference 1 in all eight cases.

Consequences.

- T1. For a torus object, any correct theorem of the form "the twists do not all vanish at real `w > w*`" has
  `w* >= P - 1`, since at `w = P - 1` they do all vanish by (iii). An inequality `beta_0 <= w*` is then satisfied
  identically in `lambda`. This is `c13` Lemma 3 without the exponent count, and for every `r`.
- T2. For E3: the tensor squeeze reads "no local pole right of the abscissa", that is `beta_0 <= P`, which is
  `0 <= 1`.
- T3. The hypothesis POLE1 is equivalent, for these objects, to the conclusion with exponent 0. An entry that
  needs POLE1 cannot be applied to a torus object without assuming its strongest conclusion.
- T4 (ARGUED, relative to the Jacquet-Shalika description of isobaric sums; not opened). For an isobaric sum of
  unitary cuspidal `sigma_i` twisted by `abs(.)^(s_i)`, the Rankin-Selberg function is the product of
  `L(w + s_i + conj(s_j), sigma_i x sigma~_j)`; its rightmost pole is at `1 + 2 max abs(Re s_i)` (from `i = j`),
  and the rightmost local pole is at `2 max abs(Re s_i) + 2 theta(sigma)`, where `theta(sigma)` is the exponent of
  the cuspidal data. The inequality of E5 is then satisfied for every value of the `s_i` when `theta(sigma) = 0` (T1), so it bounds
  `theta(sigma)` only. So the "non-Borel"
  cell left open by `c13` is closed for `GL_n` at the level of E1 to E6: a zero that enters as an Eisenstein
  parameter `s_i` is not bounded.

### 3.2 Dictionary (PROVED, one line each; `checks.json` key E)

A bound `abs(Re parameter) <= theta` reads `beta >= 1 - 2 theta` on O1 and `abs(beta - 1/2) <= theta` on O2.

| Entry | theta | on O1 | on O2 |
|---|---|---|---|
| E4 (strict) | 1/2 | `beta > 0` | `0 < beta < 1` (classical) |
| E2, E5 (`n = 2`) | 3/10 | `beta >= 2/5` | `1/5 <= beta <= 4/5` (not known) |
| E6 Kim-Shahidi | 1/9 | `beta >= 7/9`: false | `7/18 <= beta <= 11/18` |
| E6 Kim-Sarnak | 7/64 | `beta >= 25/32`: false | `25/64 <= beta <= 39/64` |
| E3 | 0 | `beta = 1`: false | `beta = 1/2` (the target) |

So O1 cannot satisfy the hypotheses of E3 or E6 at any zero on the critical line, whatever replaces cuspidality,
and O2 is the only object on file for which each entry would have a conclusion that is not known to be false.

## 4. Proposition E: the one entry that is met in full

**Proposition E (PROVED from the CLASSICAL Fourier expansion, the orthogonality of cusp forms to Eisenstein series,
and absolute convergence in `Re s > 1`).** Let `u_0` be a zero of `xi` and `f = E*(z, u_0/2)`, with constant term
`xi(u_0) y^(u_0/2) + xi(u_0 - 1) y^(1 - u_0/2)`.

(a) If `Re u_0 = 1`: both coefficients vanish, since `xi(u_0 - 1) = xi(2 - u_0) = xi(conj(u_0))` and
`abs(xi(conj u)) = abs(xi(u))`. Then `f` is a cusp form, and it is real-valued: `conj(f) = E*(z, conj(u_0)/2) = E*(z, 1 - u_0/2) = f` by the
functional equation. The integral of `f(z) E*(z, s)` over the modular surface is 0 for `Re s > 1` by unfolding
(the constant term of `f` is zero), and it is analytic in `s` because `f` decays rapidly; at `s = u_0/2` it is the
integral of `f^2`. So `f = 0`. But the first Fourier coefficient `2 sqrt(y) K_(u_0/2 - 1/2)(2 pi y)` is not identically zero.
Contradiction: `zeta(1 + it) != 0`. Every hypothesis of E10 is met; CUSP holds only at a zero; the control
`E(z, 1/2 + it)` at a non-zero fails CUSP.

(b) If `0 < Re u_0 < 1` (the object O1): the second coefficient is `xi(2 - u_0)` with `1 < Re(2 - u_0) < 2`, which
is non-zero by the Euler product. So `f` has exactly one exponent, of real part `1 - beta/2 > 1/2`; it is not a
cusp form and not square-integrable; `<f, f>` diverges like `int y^(-beta) dy`. The one hypothesis that fails is
"`xi(2 - rho) = 0`". It is false for every `rho` in the strip, zero or not.

(c) The same count for O2: its two constant-term coefficients are `xi(2 rho)` and `xi(2 rho - 1)`; for
`beta = 1/2` both are non-zero. Theta-orthogonality removes Fourier coefficients at square indices and leaves the
constant term unchanged.

Check (`checks2.json`): `abs(xi(1 + 2it)) = abs(xi(2it))` = 6.7608e-6 at `t = 7.3` (they vanish together); values
at zeros as in section 1.

Reading. The template "a zero gives the object a hypothesis that a proved theorem then contradicts" exists and is
the classical proof on the edge. Its reach is set by the rule that the two constant-term coefficients of an
Eisenstein series are values of `xi` at arguments that differ by 1 (G12 (iv); Gindikin-Karpelevich). A zero in the
strip removes the coefficient whose argument is in the strip and never the one whose argument is right of 1.

## 5. Substitution table (the decisive test)

"Same" in the last column means that the generic-parameter object fails the same hypothesis at the same step, so
the control EIS-w passes whatever O1 or O2 passes.

| # | O1 = `E*(z, rho/2)` | O2 = weight 1/2 at `1/4 + rho/2` (read through the shadow `E(z, rho)` unless said) | O3 = resonance vector in `K` | Generic parameter | Controls: named step |
|---|---|---|---|---|---|
| E1 | First failure: L2, as POLE1 (`P = 2 - beta`). Met and specific: one simple pole pair (Z1). Output: `sum_(n<=x) abs(lambda(n))^2 ~ c x^(2 - beta)`; no bound on `beta` (Lemma T) | First failure: L2, as POLE1: `P = 1 + abs(2 beta - 1)`; at `beta = 1/2` a double pole at 1. Z2 not read. MEASURED: ratios to the predicted main term 0.99997 to 1.00002 (`beta = 1/2`, first zero) and 0.9993 to 0.9998 (`beta = 0.7`) for `x` up to 4e5 (`checks.json` A, B) | First failure: no Fourier expansion with eigen-coefficients in `K` | O1: same (six further poles left of `2 - beta`). O2: same | E_a: fails L2 (`P = 1 + 2a`), passes with the same output. EIS-w: same. T-NR: the coefficient square is type S2, passes. BLS: not formulable (no Fourier coefficients). DH: not cuspidal, fails L2 |
| E2 | L2 / POLE1. Any remainder exponent `e` in Landau's theorem has `e >= P - 1` (T1); the output is an identity in `beta` | POLE1 iff `beta = 1/2` (T3) | EIG | same | E_a, EIS-w: pass, same output. T-NR: X2 at `q`; conclusions at `p != q` unchanged. BLS: not formulable. DH: EIG at `p = 2, 3 mod 5` |
| E3 | `sym^k` exists (isobaric). First failure: analyticity right of 1: the function of `sym^k x conj(sym^k)~` has its pole at `1 + k(1 - beta)` (T2). Not specific | analyticity right of 1 iff `beta = 1/2` | EIG | same | E_a, EIS-w: fail at the holomorphy step and pass the squeeze as `0 <= 1` (row D4 says E_a is "killed" there: the same step). T-NR: X1/X2 at `q`. BLS: not formulable. DH: EIG, and POS fails |
| E4 | First failure: UNIT. The local component at `p` is Hermitian iff `p^(i gamma/2)` is real, which holds for at most one prime (PROVED: two primes would give `log p / log q` rational); the archimedean component is not Hermitian (`Im s(1 - s) = gamma(1 - beta)/2`). The conclusion `abs(Re nu) < 1/2` is nevertheless true and equals `beta > 0`. MEASURED: nearest prime below 200 at the first zero, `p = 131`, distance 0.033 | UNIT iff `beta = 1/2` (Theorem Z(c)). Conclusion `0 < beta < 1` classical | no local representation attached | same for both (UNIT fails at a complex parameter off the axis whether or not it is a zero) | E_a: meets UNIT and GEN; the bound holds and is sharp: passes with a true conclusion. EIS-w: fails UNIT, same as target. T-NR: same representation, not seen. BLS: not formulable. DH: EIG |
| E5 | `c13`: S2 met and specific (Z1); S2' (POLE1) fails; forced vanishing is `L(0, chi) = 0`; output `beta <= 7/4` | twisted function `L(w + 2 beta - 1, chi) L(w + 1 - 2 beta, chi) L(w + 2i gamma, chi) L(w - 2i gamma, chi)`; `P = 1 + abs(2 beta - 1)`, `beta_0 = abs(2 beta - 1)`; residues carry `xi` at `4 beta - 1` and `2 beta +- 2i gamma`, not at `rho`: Z2 not read. POLE1 iff `beta = 1/2` | EIG | same | as `c13` section 5: E_a, EIS-w, WT pass every step with the same output; T-NR not constructed; DH: S1 loses the factorisation |
| E6 | `sym^4` is an isobaric sum of five characters; twisted symmetric square entire (ENT met); first failure: cuspidality of the lift as POLE1; `P - beta_0 = 1` (Lemma T with `r = sym^2 o sym^4`). The dictionary shows the conclusion would be false | POLE1 iff `beta = 1/2` | EIG | same | E_a, EIS-w: pass, same output. T-NR: X2 at `q`. BLS: not formulable. DH: EIG |
| E7 | First failure: SPEC. `Re s = beta/2 < 1/2`: the object is not a term of the spectral side, so no term can be dropped in its favour. EIG and the amplifier identity are met | SPEC iff `beta = 1/2`; then it holds at every height, zero or not, as a point of the continuous spectrum of measure zero (Theorem Z(d)); the conclusion (size in the height or in `D`) does not involve `beta` | EIG: the compressed operators are `Z(log p) + Z(log p)^*`, norm at most 2, and the vector is not their eigenvector (G26) | O1, O2: same. O3: no generic object exists | E_a, EIS-w: fail SPEC, same step. T-NR: X2 at `q` (amplifier supported away from `q` passes). BLS: for O3 passes everything O3 passes (G26: every inner scattering function). DH: EIG in the amplifier |
| E8 | `c8` (G31): first failure L2 (total mass 1); truncated mass `Y^(2 sigma - 1)/(2 sigma - 1)`, recurrence exponent -1 for every `sigma` | L2; at `beta = 1/2` the object is on the unitary axis and the statement is the same for every height | EIG | same (`c8` Proposition 4) | EIS-w passes every step (G31). E_a: same. U, THIN: fail at automorphy (`c8` Lemma G1). T-NR: X2 at `q`. BLS: not formulable. DH: not run (no model) |
| E9 | POS holds for `L(s, Pi x conj(Pi)~)` at every parameter; the lemma locates the abscissa `2 - beta` and gives nothing left of it. The zero enters as a double zero of the product at `w = beta`, left of the abscissa | same with abscissa `1 + abs(2 beta - 1)` | no Euler product | same | E_a, EIS-w, DEL, B: pass (P25; `sym-power-positivity` Theorem B). T-NR: POS fails at `q` (X1). DH: POS fails |
| E10 | Proposition E: all hypotheses but one are met; CUSP is half met (Z1); the missing half is "`xi(2 - rho) = 0`", false. At `Re rho = 1` all are met and the entry is the classical theorem | both constant-term coefficients non-zero: CUSP fails entirely; Z2 does not act on the constant term | the contraction property gives `Re rho <= 1` (G26) | O1: fails more (two exponents): here the failure of the zero-indexed object is smaller than that of the generic one, and still not zero. O2: same | EIS-w: fails CUSP at both coefficients. E_a: same. BLS: passes the scattering-level version (Maass-Selberg positivity is closed under Blaschke factors, `c13-kacmoody` Theorem C); it has zeros of the numerator anywhere in the right half-plane, so the entry does not see numerator zeros. T-NR (`c > 2`): a member of BLS. DH: no eigen-object |
| E11 | not self-conjugate: the pairing is bilinear, no square; UNIT fails | central value of the twist: `L(rho, chi_D) L(1 - rho, chi_D)`; equal to a positive multiple of `abs(L(rho, chi_D))^2` iff `beta = 1/2`; UNIT iff `beta = 1/2`. At `D = 1` the value is 0 at a zero for every `beta`: Z2 is this vanishing, and the entry puts no condition on an off-line zero (G32) | EIG | same | G32: DH, HEAT, E_a, T-NR, U, WT, THIN, DEL, EIS-w pass the form at height `t` |
| E12 | not applicable (weight 0) | SPEC iff `beta = 1/2`. Theta-orthogonality is a hypothesis of the entry only in weight 3/2, where it makes the shadow cuspidal; in weight 1/2 it is not a hypothesis. The conclusion bounds `c(D)`, that is `L(rho, chi_D)` in `D`, not `beta` | EIG | same | E_a, EIS-w: fail SPEC. T-NR: type S2 away from the level; passes. BLS: not formulable. DH: not cuspidal |

### The lists

- **L-a. All hypotheses met by a zero-indexed object, one of them holding only at zeros.** Inside the strip: empty.
  On the edge `Re rho = 1`: E10 with O1, which is the classical theorem (Proposition E (a)).
- **L-b. All hypotheses but one met, one of the met hypotheses holding only at zeros.** E1, E2, E5 with O1 (Z1
  replaces "single simple pole"; the failing hypothesis is POLE1, which fails identically in the parameter by
  Lemma T) and E10 with O1 (Z1 is half of CUSP; the failing hypothesis is `xi(2 - rho) = 0`). In all four the
  failing hypothesis is false for a reason that does not depend on the zero. None is a device.
- **L-c. All hypotheses but one met, the failing one equivalent to `beta = 1/2`.** E4, E7, E11, E12 with O2
  (UNIT or SPEC), and E2, E3, E5, E6 with O2 (POLE1, by T3). Circular: the hypothesis is the target and is not
  specific to zeros.
- **O3.** In every entry the first failure is EIG, with BLS passing whatever O3 passes.

## 6. What a device outside the catalogue would need

From the table, a proved inequality usable on these objects would have to satisfy all of:

1. it does not have L2, POLE1, SPEC or UNIT among its hypotheses (each is either false for O1 at every parameter
   or equivalent to the target for O2);
2. it has Z1, Z2 or Z4 among its hypotheses (otherwise EIS-w or BLS passes);
3. its conclusion constrains the parameter of the object and is not a function of the pole position alone
   (Lemma T, T1).

The catalogued inequalities with exponent below `1/2` all fail item 1. The proved statements on file that satisfy
item 1 are Maass-Selberg positivity of truncated norms (G31; fails item 2 after Lemma 2 of `c8`: the truncated mass
is free of the zero), the Lax-Phillips contraction (G26; satisfies items 1 and 2 with Z4 and yields `Re rho <= 1`),
and E10 (Proposition E; yields `Re rho < 1`). No fourth was found. This is a statement about the twelve entries and
the record, not a theorem that none exists.

Not examined here: a direct treatment of O2 on the metaplectic group without the shadow (the Rankin-Selberg series
`sum abs(c(n))^2 n^(-w)` is a double Dirichlet series without an Euler product in the squarefree direction, so
EIG fails there for E1 to E6; ARGUED); the round-14 lanes `c14-theta-orthogonal-metaplectic-eigenobject` and
`c14-laxphillips-hecke-norm-outside-l2` own those objects and had not delivered when this was written.

## 7. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | The eigen-relation is consumed by E2 to E8 and E11, but on the substituted objects each consuming step is an identity in the parameter (Lemma T (i)) or is not reached |
| R2 (height-uniform, every window) | false | No inequality on `beta` is obtained. The statements made (Lemma T, Proposition E (b)) are uniform in `gamma` and are not about zeros |
| R3 (every control fails at a named step) | false | EIS-w or E_a passes every entry that O1 or O2 passes; BLS passes what O3 passes |
| R4 (reaches the line) | false | The only entry met in full is met at `Re rho = 1` |

Score 0. Not a statement about zeros of zeta (the edge case of Proposition E is the classical non-vanishing on
`Re s = 1`).

## 8. Three weakest steps

1. **Catalogue sources and completeness.** Only Sarnak's notes were opened; they give statements and a
   description of E2 to E6, not the proofs. The step attributions for E1, E7, E8, E11, E12 and for Deligne's
   argument are recalled. E12's hypotheses (weight ranges, the role of theta-orthogonality in weight 3/2) are from
   memory. The claim "no catalogued inequality has theta-orthogonality or central vanishing as a hypothesis" is a
   claim about these twelve entries; the catalogue is not shown to be complete.
2. **O2 is read through its shadow.** The coefficient and constant-term formulas of the weight-1/2 series are
   relative to Theorem Z(b), itself recalled from Goldfeld-Hoffstein. The table treats E1 to E6 on the shadow
   `E(z, rho)`, where the zero is not visible in any residue. A treatment on the metaplectic group itself is
   ARGUED in one sentence. T4 (isobaric sums with cuspidal data) is ARGUED and was not checked against a source.
3. **Control rows.** T-NR is typed (X2 at `q`) and not constructed as an object; BLS is "not formulable" in every
   entry that reads Fourier coefficients; DH has no model on these surfaces. The O3 column rests on row G26
   (refereed once) and on the statement that `K` is not Hecke-stable, taken from that row. E4's proof (convergence
   of the local integral from the unitary structure) was not opened; the table uses only the statement.

## 9. Files

`RESULT.md`, `REFEREE.md` (second pass by the author; no independent referee), `MAP_ROW.md`, `lanes_line.json`
(appended to `campaign/lanes.jsonl`), `checks.py`, `checks.log`, `checks.json`, `checks2.py`, `checks2.log`,
`checks2.json`. Both runs (each under 5 s): `scripts/memcap.sh 8 .venv-arb/bin/python -I <file> <absolute output path>`.
