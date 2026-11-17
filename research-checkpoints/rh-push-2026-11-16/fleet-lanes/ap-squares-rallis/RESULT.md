# ap-squares-rallis: can the Weil form Q_L(v) be the norm of an automorphic object?

Date: 2026-11-17. Lane: positivity from squares (Rallis, Waldspurger / Kohnen-Zagier, Siegel-Weil).
Nothing here proves or refutes RH. Labels: PROVED (derived in this file), CLASSICAL (standard theorem,
cited), RECALLED (literature or project notes, not re-derived here), MEASURED, ARGUED, OPEN.

## Verdict

**Precise obstruction.** No norm realisation of `Q_L` of Rallis / Waldspurger / theta-lift type exists,
and the reason is a statement about spectral type, independent of RH:

1. (Theorem 1, PROVED) Any realisation `Q_L(v) = ||Theta(v)||^2` in which translation of the test `v`
   acts through a unitary one-parameter group is unitarily equivalent to `l^2` on the zeros with
   `Theta(v) = (V(i gamma))_gamma`. Its generator has pure point spectrum equal to the set of zeros.
   A square formula for `Q_L` with this covariance is a Hilbert-Polya space; there is no other one.
2. (Corollary 2, PROVED) Every representation that the square formulas of this lane live in is mixing
   for that one-parameter group: `L^2` of the idele class group (Tate theta vector), `L^2(Gamma\G)` for
   semisimple `G` including the metaplectic group (Howe-Moore), wave packets of Eisenstein series of
   integral or half-integral weight (Riemann-Lebesgue). A mixing representation has no eigenvectors, so
   none of them can carry `Q_L`. This holds whether or not RH is true.
3. (Theorem 3, PROVED) In diagonal form: if `Q_L(v) = int |V(it)|^2 d mu(t)` on the exponential class,
   then `mu` (symmetrised) is the zero-counting measure. Rallis-type measures are
   `|L-value on the line|^2 x local factor x dt`, absolutely continuous, so they are excluded.
4. (Theorem 4, CLASSICAL + PROVED consequence) Matrix coefficients of theta vectors contain no
   arithmetic: `<theta_phi, R(g) theta_psi> = c <phi, omega(g) psi>` by Schur's lemma, and the Hecke
   operators `T(p^2)` act on them by the scalars the lanes found. Zeta enters only through the torus
   period of theta (Hecke's integral), which is not an `L^2`-continuous functional.

What the square structures do prove, exactly: `|zeta(1/2+it)|^2 >= 0` (Tate norm, Waldspurger with
Eisenstein input), `L(1/2, pi) >= 0` at the real central point of a self-dual `pi` (Rallis,
Kohnen-Zagier), and zero-freeness on `Re s >= 1` (Maass-Selberg; row G12). None of the three reaches a
zero in the strip. `Q_L` is the trace form on the cokernel of the theta map; the Rallis norm lives on
its image.

Lead strength for the lane as posed: low. One residual direction is stated in section 8.

## 0. Plan, and relation to closed rows

Question: is `Q_L(v)` (eq48: `Q_L(v) = sum_rho V(rho) conj V(-conj rho)`), or the bridge energy `H_c`,
the norm of an automorphic vector built from `v`?

Rows touched, and what is different here.

- G12 (`g-torus-modular`): Maass-Selberg Gram kernel is the `h = 1/2` member of the shifted family;
  shift rigidity (intertwining quotients `xi(z)/xi(z+1)`); Zagier space not unitarisable. Not
  re-entered. Used as a cited input in section 5. New here: the question is posed for every unitary
  realisation with shift covariance, not for one unfolding, and answered by spectral type.
- P12 (`weil-onesided` B2): `Q_L` is not `L^2`-closable on a domain containing Nyman-Beurling
  functions, conditional on RH. Different: Theorem 1 and Corollary 2 are unconditional and concern
  arbitrary Hilbert spaces with a covariance condition, not closability in `L^2(0,inf)`.
- G6 / Q6 (Krein-space square, inertia): `Q_L` is a square for the indefinite involution. Used. New:
  identification of which unitary structures could carry it (Theorem 1) and that the automorphic ones
  cannot (Corollary 2).
- G14, G18 (rung shift = Hecke on weight-1/2 theta; metaplectic): used in Theorem 4.
- T3 (Hodge-index transplant): used in section 4, not re-run.
- Atlas (PR 27): no entry on Rallis, Waldspurger, Kohnen-Zagier, Howe-Moore or the cokernel reading
  (grep of `historical-routes.md`).

## 1. Setting

`F(w) = xi(1/2+w)`, `L = F'/F`, centred zeros `rho` (symmetric under `rho -> -rho`, `rho -> conj rho`),
`m_gamma` the multiplicity. `E` = finite sums `v(t) = sum b_j e^{-x_j t}` on `t >= 0`, `x_j > 1/2`,
`V(z) = sum b_j/(z + x_j)`. `S_a v(t) = v(t-a) 1_{t>=a}`, `a >= 0`. `E^` = span of all `S_a E`; for
`v in E^`, `V(z) = sum b_j e^{-a_j z}/(z + x_j)`.

Define on `E^`

    Q(v,w) = sum_rho V(rho) conj W(-conj rho).

The sum converges absolutely (`|V(rho)| <= C_v/|rho|` on `|Re rho| < 1/2`, `sum |rho|^-2 < inf`). On `E`
it equals `Q_L` (eq48 Theorem 1, refereed).

**Lemma 0 (PROVED).** `Q(S_a v, S_a w) = Q(v,w)` and `Q(S_a v, w) = sum_rho e^{-a rho} V(rho) conj W(-conj rho)`.
Proof: `S_a` multiplies `V(z)` by `e^{-az}`; `e^{-a rho} conj(e^{a conj rho}) = 1`. QED.

`Q >= 0` on `E^` iff RH: under RH `Q(v) = sum_gamma m_gamma |V(i gamma)|^2`; conversely positivity on
`E` gives RH (eq48 Theorem 3).

## 2. Theorem 1: an equivariant square is a Hilbert-Polya space

**Theorem 1 (PROVED).** Let `U` be a strongly continuous unitary representation of `R` on a Hilbert
space `H` and `Theta: E^ -> H` linear with

    ||Theta v||^2 = Q(v),      Theta S_a = U(a) Theta   (a >= 0).

Then RH holds, and for every `v in E^` the spectral measure of `Theta v` under `U` is
`sum_gamma m_gamma |V(i gamma)|^2 delta_{-gamma}`. The closed span of `Theta(E^)` is unitarily
equivalent to `l^2({gamma}, m_gamma)` with `Theta v -> (V(i gamma))_gamma` and `U(a)` = multiplication
by `e^{-i a gamma}`.

Proof. `Q >= 0` on `E`, so RH (eq48). Polarisation gives `<Theta v, Theta w> = Q(v,w)`. For `a >= 0`,
`<U(a) Theta v, Theta v> = Q(S_a v, v) = sum_gamma m_gamma e^{-i a gamma} |V(i gamma)|^2` by Lemma 0;
for `a < 0` take conjugates. A continuous positive-definite function on `R` determines its measure
(Bochner). The map to `l^2` is isometric by the formula for `Q`, with dense range because
`V = 1/(z+x)`, `x > 1/2`, separate finitely many points. QED.

**Corollary 2 (PROVED; no norm realisation in a mixing representation).** If
`<U(a) h, h> -> 0` as `a -> +inf` for every `h` in the closed span of `Theta(E^)`, no such `Theta`
exists. Proof: `a -> sum m_gamma e^{-i a gamma}|V(i gamma)|^2` is an absolutely convergent
trigonometric series, hence Bohr almost periodic; an almost periodic function tending to 0 at
`+inf` is 0; its Bohr coefficient at `gamma_1` is `m |V(i gamma_1)|^2 != 0` for `v = e^{-xt}`. QED.

The hypothesis holds in each of the following (CLASSICAL):

| Square structure | Space | Why mixing |
|---|---|---|
| Tate theta vector `Theta_f(x) = sum_q f(qx)` | `L^2` of the idele class group, `R_+` by scaling | regular representation, Riemann-Lebesgue |
| Theta lift with archimedean Schwartz datum `phi_v`, shift of `v` = dilation `omega(a_t)` | `L^2(Gamma\Mp_2(R))` and any `L^2(Gamma\G)`, `G` connected semisimple with finite centre | Howe-Moore: coefficients vanish at infinity off the `G`-invariant vectors; the constant function contributes only the frequency 0, and `xi(1/2) != 0` |
| Rallis inner product (norm of a theta lift to a larger group) | `L^2` of the target group quotient | Howe-Moore |
| Wave packet of Eisenstein series, integral or half-integral weight, density in `L^1` | continuous spectrum | Riemann-Lebesgue |
| Family sum `sum_D w_D |l_D(v)|^2` with `l_D(v) = int V(it) c_D(t) dt`, `sum_D w_D ||V c_D||_1^2 < inf` | weighted `l^2` over discriminants | Riemann-Lebesgue termwise, dominated convergence |

So the answer to "which theta-type vector has norm `Q_L(v)`" is: none, for a reason that does not
depend on the choice of group, cover, level, test vector or regularisation-free construction.

**Theorem 3 (PROVED; diagonal uniqueness).** Let `mu >= 0` be a measure on `R` with
`int (1+t^2)^-1 d mu < inf` and `Q_L(v) = int |V(it)|^2 d mu(t)` for all `v in E`. Then RH holds and
`(mu(dt) + mu(-dt))/2 = sum_gamma m_gamma delta_gamma`.

Proof. RH as before. With `v = e^{-xt}`: `L(x)/x = int d mu(t)/(x^2+t^2)`, and Hadamard gives
`L(x)/x = sum_gamma m_gamma/(x^2 + gamma^2)`. Both sides are Stieltjes transforms in `x^2` of the
push-forwards under `t -> t^2`; they agree on `x^2 > 1/4`, hence everywhere, and Stieltjes inversion
gives equality of the measures. QED.

A Rallis-shaped identity has `d mu = |A(1/2+it)|^2 w(t) dt` (L-value times local zeta integrals). That
is absolutely continuous. Theorem 3 excludes it without any computation of the constants.

MEASURED (`checks.py`, test `V = 3/(z+1) - 5/(z+2)`, so `V(1/2) = 0`):
- `Q_L` by the Pick formula 0.1834498; by 150 zeros plus an integral tail estimate 0.1834969.
- Tate norm (section 3): time side to `N = 50000` 0.7382430; spectral side to `T = 600` plus tail
  estimate 0.7382571.
- Shift correlation at `a = 0, 1, 2, 5, 10, 20, 40, 80`. Zero side (150 zeros):
  0.1638, 0.0088, -0.0275, 0.0033, -0.0623, 0.0444, 0.0416, -0.0035 (no decay). Theta-norm side:
  0.7240, 0.0680, 0.0291, 0.0018, 1.2e-5, -1e-6, -1e-6, 0 (decay). This is the content of Corollary 2
  on one test; it is an illustration, not part of the proof.

## 3. Item (1): the theta / Weil-representation form, and what prevents a norm

**(a) The norm that exists (CLASSICAL: Tate, Connes, Burnol).** For `v in E^` with `V(1/2) = 0` put
`(Ev)(t) = sum_{n <= e^t} n^{-1/2} v(t - log n)`. Its Laplace transform is `zeta(1/2+z) V(z)` and

    ||Ev||^2_{L^2(0,inf)} = (1/2 pi) int |zeta(1/2+it)|^2 |V(it)|^2 dt.

This is the inner product formula of the pair on `GL(1)`: norm of the theta vector = L-value on the
line times the archimedean local integral. It is automatic and it is Euler-blind: the same identity
holds with any Dirichlet series in `H^2`-position in place of `zeta`, including the DH function. Zeros
appear as zeros of the spectral density, not as spectrum.

**(b) Theta vectors have arithmetic-free matrix coefficients (Theorem 4).** Let `omega_+` be the even
Weil representation of `Mp_2(R)` on `L^2(R)_even` (irreducible, CLASSICAL) and
`theta_phi(g) = sum_n (omega(g) phi)(n)`, a square-integrable function on `Gamma_0(4)\Mp_2(R)`
(constant term of size `y^{1/4}`). The pulled-back inner product is an invariant Hermitian form on an
irreducible module, so

    <theta_phi, R(g) theta_psi> = c <phi, omega(g) psi>   for all g,   c > 0 a constant.

The Hecke operators `T(p^2)` act on the theta line by scalars (the lanes' `1 + 1/p`, G14). Hence every
quantity `<theta_v, A theta_v>` with `A` in the algebra generated by the group and the Hecke operators
equals `c <phi_v, omega(A) phi_v>` up to those scalars: it contains no value of `zeta`. PROVED from the
two classical inputs.

**(c) Where zeta enters.** Only through the torus period on the geodesic `tau = i e^b`
(Hecke): `P(z)[phi] = int (theta_phi(a_b) - cusp terms) e^{zb} db = F(z) x (local Mellin of phi)`. The
geodesic is a non-compact null set; `P(z)` is not continuous on `L^2`. The Waldspurger-type square of
this period is `|P(it)|^2 = |xi(1/2+it)|^2 |M phi|^2`, and integrating it over `t` is (a).

**(d) What `Q_L` is in this language (CLASSICAL, Connes 1999 / Meyer 2005, RECALLED).** `Q_L(v)` is
the trace of `theta(v) theta(v)^#` on the cokernel of the theta map `f -> Theta_f`, where the scaling
group acts on the line of the zero `rho` by the character `e^{rho u}` and `#` is the adjoint for the
canonical pairing of the `rho`-line with the `(-conj rho)`-line. Three exact facts follow.

- Degree: `Q_L` is homogeneous of degree 0 in `F` (`L = F'/F`). A norm of a vector that is linear in
  the theta function is homogeneous of degree 2. `Q_L` is built from `d log P(z)`, i.e. from `1/P`.
- Image versus cokernel: in the unitary space `L^2(C_Q)` the theta map has dense range, so the
  cokernel is 0 and the norm sees only (a). The cokernel is non-zero only in weighted spaces
  `L^2_delta`, `delta > 0`, where scaling is not unitary (operator norm of the shift by `u` grows like
  `(1+|u|)^{delta/2}`).
- Unitarisability: an invariant Hermitian form on `sum_rho C_rho` pairs `rho` with `-conj rho`; it is
  definite iff `rho = -conj rho` for all `rho`. This is the Krein-square statement of G6.

So the three candidate obstructions named in the task are ranked as follows. The pole terms and the
archimedean principal value are not the obstruction: they are removed by `V(1/2) = 0` and are part of
`E_gamma`. The obstruction is the third one, in the exact form: the Weil form is the trace form of
the scaling action on the cokernel of the theta map, the cokernel carries no unitary structure from
`L^2(C_Q)` because the Plancherel measure of `C_Q` (Lebesgue on `R`) has no atoms, and by Theorem 1
any unitary structure on it would have to be atomic at the zeros.

## 4. Item (2): the cases where a square exists

**Curves over F_q (CLASSICAL).** Tests are finitely supported `v` on `Z log q`,
`A_v = sum_n v(n) q^{-n/2} Frob^n` in `End(Jac) (x) C`. The Weil form is
`Q(v) = Tr(A_v A_v^dagger | H^1)` with `dagger` the Rosati involution, equal to minus the intersection
form on the primitive part of `NS(C x C) (x) C` evaluated on the correspondence of `A_v`. Positivity is
the Hodge index theorem (Castelnuovo-Severi). The Hilbert space is `H^1(C)` with its polarisation,
dimension `2g`; `q^{-1/2} Frob` is unitary with pure point spectrum. This is exactly the shape Theorem 1
requires (shift group `Z log q`, atomic spectral measure at the zeros). It is not a subspace of
`L^2(F^x \ A_F^x)`, whose spectrum on the dual circle is Lebesgue. The square comes from geometry
(a polarised object on which the shift acts), not from a theta vector. Missing over `Z`: the polarised
object (row T3: no section count is known).

**Small support (RECALLED: Yoshida 1992; Connes-Consani 2021; project notes on Route I).** For tests
whose autocorrelation is supported in `(-log 2, log 2)` no prime enters; positivity is a statement
about the archimedean distribution plus the pole. The square is a Hilbert-Schmidt norm
`Tr(theta(g)^* S theta(g))` with `S` the orthogonal projection onto the Sonine space (functions
vanishing on `[-lambda, lambda]` together with their Fourier transform), up to an error controlled by
the small prolate eigenvalues. The compression of scaling to the Sonine space has discrete spectrum,
again the shape of Theorem 1. Missing globally: the project's semilocal computation for `S = {inf, 2}`
found an exact trace identity whose remainder `D_S` is not sign-definite (96.7% to 99.7% of the trace
on the minimiser) and a Sonine refinement that fails past support `ln 2`; for `S` containing `{2, 3}`
the remainder has dense `log^2` spikes. As `S` grows the Sonine space tends to the cokernel of
section 3(d), and orthogonality of its projection is RH.

In both cases the square is the Hilbert-Schmidt norm of the test operator compressed to a space on
which the scaling action has pure point spectrum, and that space is supplied by something other than
`L^2` of an automorphic quotient.

## 5. Automatic positivity that the automorphic structures do give

| Structure | Identity | What it proves | Height-uniform | Reaches the strip |
|---|---|---|---|---|
| Tate theta norm (3a) | `||Ev||^2 = (1/2 pi) int |zeta V|^2` | `|zeta(1/2+it)|^2 >= 0` | yes | no (tautology) |
| Schur isometry (3b) | `||theta_phi||^2 = c ||phi||^2` | nothing arithmetic | - | no |
| Rallis / Lapid-Rallis (CLASSICAL) | `||theta(f)||^2 = L(s_0 + 1/2, pi) x local` | `L(1/2, pi) >= 0` for self-dual `pi` of the right type | no: the point `s_0` is real and fixed by the dimensions of the pair | no |
| Waldspurger / Kohnen-Zagier | `L(1/2, f x chi_D) = k |c(|D|)|^2` | sign of a central value | no (height 0 for each `f`) | no |
| Maass-Selberg (G12, cited) | truncated Eisenstein Gram kernel | `zeta != 0` on `Re s >= 1` | yes | no: shift `h = 1/2` |

Height enters a Rallis-type formula only by twisting `pi` by `|.|^{it}`. The twist is not self-dual,
the special value becomes `L(1/2 + it)`, which is not a norm, and the only square left is
`|L(1/2+it)|^2` (first row). This is the exact reason the square structures fail requirement Q2
(every height) for anything beyond the tautology.

The shift in the last row is Gindikin-Karpelevich: the intertwining integral over the unipotent
radical gives `xi(z)/xi(z+1)`, and the 1 is the modulus of additive Haar measure on the adeles. The
family `phi_c(s) = xi(2s-1-c)/xi(2s+c)` satisfies `phi_c(s) phi_c(1-s) = 1` and `|phi_c| = 1` on
`Re s = 1/2` for every real `c` (PROVED, two lines from `xi(z) = xi(1-z)`); it is inner in
`Re s > 1/2` up to one real pole iff `zeta` is zero-free in `Re > 1 + c`; `c = 0` is the Eisenstein
series, `c = -1/2` is the trivial multiplicative case `phi = 1`. No group or cover supplies
`-1/2 < c < 0` (integral, metaplectic and `n`-fold covers all give difference 1 in the L-argument;
CLASSICAL formulae, generality ARGUED). This restates G12(iv) and G20 and is recorded only to locate
the lane's structures on that scale: they sit at `c = 0`.

## 6. Item (3): the half-integral weight family

Facts (CLASSICAL, RECALLED: Goldfeld-Hoffstein 1985; Waldspurger; Kohnen-Zagier). The weight-1/2
Eisenstein series on `Gamma_0(4)` has `D`-th coefficient proportional to
`L(2s - 1/2, chi_D)/zeta(4s - 1)` times a finite Euler correction; `theta` is its residue at `s = 3/4`.
On the unitary axis `s = 1/2 + i tau/2` the coefficient at `D = 1` is `zeta(1/2 + i tau)/zeta(1 + 2 i tau)`.
For Eisenstein input the Waldspurger formula reads
`L(1/2, E_tau x chi_D) = |L(1/2 + i tau, chi_D)|^2`.

So the weight-1/2 side does put the critical line on the unitary axis, which integral weight does
not. But the critical values sit in the **numerator of a Fourier coefficient**, not in the
denominator of a constant term. A zero of `zeta` off the line gives a point `s_0` with `Re s_0 > 1/2`
where one Fourier coefficient of a non-`L^2` Eisenstein series vanishes. No positivity forbids that.
(A zero of a constant-term denominator in `Re s > 1/2` would give an `L^2` residue with non-real
Laplace eigenvalue, which is how `Re s >= 1` is obtained.)

A test function can enter a family version in two ways.

(i) Through weights on discriminants: `sum_D |u(D)|^2 |c(|D|)|^2`. This is a multiplication
(diagonal) form in the variable `log |D|`. `Q_L` is a convolution form in the same variable
(Lemma 0). A form that is both is a multiple of `||v||^2`; `Q_L` is not (its prime side has support at
`log p^k`). PROVED.

(ii) Through the spectral parameter: `g_v = int V(i tau) E_{1/2}(., tau) d tau`, with coefficients
`l_D(v) = int V(i tau) c_D(tau) d tau`, and the form `sum_D w_D |l_D(v)|^2`, `w_D >= 0`. Each term has
rank one with a real-analytic kernel `c_D(tau) conj c_D(tau')`. By Corollary 2 (last row of the
table) no such sum equals `Q_L`. PROVED under the stated summability.

Conclusion for item (3): a family version produces positive forms, and none of them can be compared
with `Q_L` as an identity. As inequalities they are mean values over `D` or over `tau` (MV-CAP).

## 7. Controls

The lane's output is an obstruction, so the control question is which hypothesis of each square
structure a control violates, and whether the structure separates it from zeta.

| Control | Tate norm (3a) | Schur isometry (3b) | Rallis / Waldspurger square | Maass-Selberg | Theorem 1 / Cor. 2 |
|---|---|---|---|---|---|
| DH | holds verbatim (sum of two theta vectors of conjugate nebentypus; no eigen hypothesis is needed for a norm) | holds | not formulable: needs an irreducible representation; DH is a non-eigen combination, and its value is not a norm of a lift | no Eisenstein series has `xi_DH(2s-1)/xi_DH(2s)` as intertwiner (the operator is a product of local intertwiners); consistent with DH zeros in `Re > 1` | `Q` indefinite; no realisation, same as zeta |
| HEAT (tau < 0) | holds for the modified archimedean datum when it is in `L^2` | not a Weil-representation vector at infinity | not formulable | not formulable | `Q` indefinite |
| TW+, TW- | fails: the vector is not `Q^x`-invariant (no functional equation); the Plancherel identity for the Dirichlet series still holds on `Re s > 1` | not formulable | not formulable | not formulable | no symmetric zero set; `Q` undefined |
| E_a | holds for the non-unitary Eisenstein datum | - | `E_a` is the L-function of a non-tempered (non-unitary principal series) Eisenstein representation; Rallis needs unitary data | inducing datum not unitary | `Q` indefinite |
| T-NR | holds (it is a Tate integral with another local vector) | holds | local zeta integral at `q` changes sign with the test vector: value-side squares are test-vector dependent | intertwiner poles are not affected by test vectors; the T-NR zeros are zeros of a zeta integral, not poles of an intertwiner | `Q` indefinite |
| Beurling | no adeles | - | - | - | no functional equation |

Reading: the two automatic norms (3a), (3b) hold for DH and T-NR, so they are Euler-blind. The
structures that do use the Euler product (Maass-Selberg through the product of local intertwiners;
Rallis through irreducibility) exclude DH and E_a, and prove statements at `Re s = 1` or at the real
central point only. Theorem 1 and Corollary 2 are no-go statements and are the same for every
function with the functional equation.

Three requirements of the brief. All primes together: met by Maass-Selberg and Rallis (adelic), not
by (3a), (3b). Every height in every window: met only by (3a) and Maass-Selberg, which stop at the
tautology and at `Re s = 1`. Failure on controls for a named reason: table above. No structure in
this lane meets the three at once inside the strip.

## 8. What a square would have to be (the one residual direction)

By Theorem 1 a square formula for `Q_L` that respects translation of the test is a Hilbert space
with a unitary flow of pure point spectrum at the zeros. If the shifts by `log p` are also realised
by operators `T_p` (all primes together), the eigenvectors are joint eigenvectors with eigenvalues
`p^{-i gamma}`, i.e. the characters `|.|^{i gamma}` of the idele class group, weighted by the
zero-counting measure in place of Plancherel measure. Pure point spectrum for a flow means a flow on
a compact abelian group (the dual of the discrete group generated by the frequencies). For a curve
this group structure is supplied by `H^1` with its polarisation. Over `Q` the norm group `R_+` is
connected and `L^2(C_Q)` has Lebesgue spectrum, so the compact object cannot be a quotient of the
idele class group with Haar measure. OPEN: a compact (solenoid-type) object, not of the form
`Gamma\G` with Haar measure, on which scaling acts almost periodically with frequency module
containing the zeros. This lane gives no construction and no evidence that one exists; it only shows
that nothing short of this can be a norm realisation, and that theta lifts, Rallis norms and
half-integral weight families are not of this type.

## 9. Three weakest steps

1. **Scope of the covariance hypothesis.** Theorem 1 and Corollary 2 need `Theta S_a = U(a) Theta`
   with `U` a unitary group, on the shift-closed class `E^`. A realisation in which `v` enters
   without this covariance (for example through data at finite primes only), or only on a cone of
   tests, is not excluded. Without covariance every positive form is a Gram form, so "there is a
   Hilbert space" is RH itself and carries no structure. Regularised (truncated) theta or Eisenstein
   norms break covariance and are not covered by Corollary 2; for those the file relies on the
   refereed G12 result (shift `h = 1/2`), not on a proof given here.
2. **Recalled inputs.** Section 3(d) (Connes / Meyer cokernel trace), section 4 (Rosati and
   Hodge-index form; Yoshida and Connes-Consani; the project's semilocal Route I notes) and section 6
   (Goldfeld-Hoffstein coefficient formula, Waldspurger for Eisenstein input) are stated from the
   literature or project notes and were not re-derived or re-read. The Euler correction factors and
   normalising constants in section 6 are not given. Theorems 1, 3 and Corollary 2 do not depend on
   them; the interpretive statements do.
3. **Theorem 4 and the adelic Howe-Moore step.** Square-integrability of all `K`-types of the theta
   module and irreducibility of `omega_+` are quoted, not proved; the Hecke scalar is taken from the
   lanes (G14). Howe-Moore is applied to `L^2(Gamma\G)` for a lattice in a connected semisimple group
   with finite centre; for adelic groups and for groups with compact factors or non-finite centre the
   statement needs the usual strong-approximation reduction, which is not written out. The numerical
   checks are float precision with estimated tails (agreement 5e-5 and 2e-5), not certificates.

## Files

- `checks.py`, `checks.json`: the three numerical checks of section 2 (run through
  `scripts/memcap.sh 8`, 104 s, single process).
