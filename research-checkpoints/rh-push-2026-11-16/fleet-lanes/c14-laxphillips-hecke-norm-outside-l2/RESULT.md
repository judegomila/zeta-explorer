# c14-laxphillips-hecke-norm-outside-l2: Hecke-built norms outside the weighted-L2 family on Lax-Phillips resonance states

Date: 2026-11-19. Kind: explore. Nothing here proves or refutes RH. No zero-free region and no Lambda bound
changes. No statement about zeros of zeta is made.
Labels: PROVED (argument written here), CLASSICAL (literature, recalled, not opened in this lane), ARGUED,
MEASURED (mpmath 30 digits, not interval-certified), OPEN.
Runs: `checks.py` (4 s) and `ref_checks.py` (under 1 min), local, through `scripts/memcap.sh 8`. The server was not used.

## Verdict

**Precise obstruction. The decisive first test kills the idea: the growth bound is equivalent to the conclusion,
and the only step that consumes the Hecke multiplication rule is a tautology that holds for every control.**
This closes the pending item of row G26 ("norms outside the weighted-L2 family") for four families of norms.

1. **Solid norms (sup, mixed L^p(L^q), Orlicz, Lorentz, any weight): Theorem L (PROVED).** In every solid
   (lattice) norm on functions on the modular surface for which `T_p` acts and a resonance state has finite norm,
   `||T_p^k|| >= (p^(1/2) + p^(-1/2))^k`. The eigenvalue bound that such a norm can give is `abs(Re mu) <= 1/2`,
   i.e. `0 <= beta <= 1`. Reason: a solid space containing a resonance state contains the constants, and
   `T_p 1 = (p^(1/2) + p^(-1/2)) 1`. No positive joint eigenfunction exists below that edge.
2. **Hecke-sup norm with multiplicative normalisation, `N_theta(f) = sup_n N_0(T_n f)/lambda_theta(n)`:
   Lemmas H1-H3 (PROVED).** `N_theta(T_m f) <= lambda_theta(m) N_theta(f)` for every f, by the Hecke
   multiplication rule (this is the one step that consumes multiplicativity). On a joint eigenvector with parameter
   mu, `N_theta = N_0` if `abs(Re mu) <= theta` and `+infinity` otherwise. So finiteness of `N_theta` on a
   resonance vector does read beta (not only beta <= 1), and it is the statement `beta >= 1 - 2 theta` itself.
   Commutation of `T_n` with the wave group gives `N_theta(U(t) f) <= ||U(t)||_(N_0) N_theta(f)`: it transfers a
   growth bound from `N_0`, it does not produce one.
3. **The Hecke-sup norm is a wave-group norm (Lemma Q, PROVED-rel c4 Lemma 1).** On the Eisenstein channel
   `T_n = sum over dd' = n of U(log(d/d'))`, so `N_theta(f) <= 2 sup_t e^(-theta abs(t)) N_0(U(t) f)`. The norm, Lemma H1
   and Lemma H2 exist verbatim for every cofinite group and every abstract Lax-Phillips triple. The non-arithmetic
   control passes every step.
4. **L^q norms, q != 2 (Lemma E, PROVED from CLASSICAL properties of E).** A resonance state with
   `a = abs(Re mu)` lies in `L^q` iff `q < 1/(1/2 + a)`; for such q the off-resonance series `E(., w')` with
   `Re w' < 1/q` lie in the same space and are `T_p`-eigenfunctions, so the spectral radius of `T_p` on `L^q` is at
   least `p^(1/q - 1/2) + p^(1/2 - 1/q) > p^a + p^-a`. Admissibility implies the bound, as in the weighted-L2 case.
   Control EIS-w passes.
5. **Pivot (one, taken): a space that reads phi(w) = 0 and on which T_n and the wave group commute.** The space
   `Y_out` of automorphic functions whose zero mode is `O(y^(1/2 + delta))` as `y -> 0` is `T_n`-invariant, contains
   the resonance states and excludes every `E(., w')` with `phi(w') != 0` (Lemma O, PROVED). On it the device is
   the rate of the zero mode at small y, where `T_n` acts by dilations only; a rate `y^(3/4 - eps)` for a class of
   test functions is Zagier's criterion (CLASSICAL), equivalent to RH. Lands on rows G31 and G26.

The first control passing every step is EIS-w (families 1, 2, 4) and the non-arithmetic / abstract Lax-Phillips
triple (family 2 and the truncated setting). Device row in section 7.

## 0. Plan and what is new

Sources read: BRIEF; map rows G12, G26, G31 and the controls section; `c4-laxphillips-hecke-compression`
(RESULT + REFEREE); `h-hecke-channels`; `g-torus-modular`; `c8-hecke-entropy-resonance-rigidity`;
`res-point-spectrum-square` (Lax-Phillips paragraph); `c13-tnr-invariance-prefilter-noncone-census` (pending row,
step type X2, pre-filter silent). Row G26 closed the compression and the weighted-L2 family and left "norms outside
the weighted-L2 family" open. This lane treats: all solid norms; the Hecke-sup norm over any base norm; L^q; norms on
the Hecke module; and one space that reads the outgoing condition without truncation.

Notation (as in c4). `Gamma = PSL(2,Z)`. `T_n f(z) = n^(-1/2) sum over ad = n, b mod d of f((az+b)/d)`.
`lambda_nu(n) = sum over dd' = n of (d/d')^nu` (so `lambda_nu(p) = p^nu + p^-nu`; `T_n E(., w) = lambda_(w-1/2)(n) E(., w)`).
Resonance: `mu = rho/2 - 1/2`, `a = abs(Re mu) = (1 - beta)/2`. Resonance state, untruncated: `f_rho = E(., w)`,
`w = 1 - rho/2`, `phi(w) = 0`, `Re w = 1/2 + a`, zero mode exactly `y^w`. `ht(z)` = imaginary part of the
representative of z in the standard fundamental domain F. `U(t)` = wave group, `Z(t)` = Lax-Phillips semigroup on K.
Target of the route: `abs(Re mu) <= 1/4` for one member of each pair (rho, 1 - rho) is `beta >= 1/2`; the scattering
functional equation supplies the symmetry of the resonance set and nothing else.

## 1. Stage A: the candidate norm and the candidate inequality

Candidate (not a weighted L2 norm): for a base norm `N_0` on a `T`-invariant space of automorphic functions and
`theta` in [0, 1/2),

    N_theta(f) = sup over n >= 1 of N_0(T_n f) / lambda_theta(n).

Candidate inequality: `N_theta(Z(t) f) <= C e^((-1/4 + eps) t) N_theta(f)` on a space containing the resonance
vectors, or its two-sided form `f_rho in X_(1/4) = {N_(1/4) < infinity}` for every rho.

Three settings in which both the Hecke operators and the time evolution can act:

- Setting I (truncated): K, `Z(t)`. `T_p` does not preserve K; its compression is `Z(log p) + Z(log p)^*` and does
  not commute with `Z(t)` (c4 Lemma 2, refereed).
- Setting II (untruncated): automorphic functions of moderate growth, `U(t)` acting on data, `T_n` the
  correspondences. They commute. Joint eigenvectors include `E(., w')` for every w'.
- Setting III (untruncated with an outgoing condition): section 6.

## 2. First lemma: what the norm reads on a resonance vector

**Lemma H1 (PROVED).** For every f and m: `N_theta(T_m f) <= lambda_theta(m) N_theta(f)`.
Proof. `T_m T_n = sum over d | (m,n) of T_(mn/d^2)` (CLASSICAL, with the `n^(-1/2)` normalisation). So
`N_0(T_n T_m f) <= sum_d N_0(T_(mn/d^2) f) <= N_theta(f) sum_d lambda_theta(mn/d^2) = N_theta(f) lambda_theta(m) lambda_theta(n)`;
the last equality is the same multiplication rule for the character `lambda_theta`, all of whose values are
positive. Divide by `lambda_theta(n)` and take the supremum. QED.
(MEASURED check of the rule for the weight: deviation 5e-29 on six pairs (m, n), `checks.json` D.)

**Lemma H2 (PROVED).** If `T_n f = lambda_mu(n) f` for all n and `0 < N_0(f) < infinity`, then
`N_theta(f) = N_0(f)` when `abs(Re mu) <= theta`, and `N_theta(f) = infinity` when `abs(Re mu) > theta`.
Proof. `N_theta(f) = N_0(f) sup_n abs(lambda_mu(n))/lambda_theta(n)`. With `a = abs(Re mu)`:
`abs(lambda_mu(n)) <= lambda_a(n)` (triangle inequality) and `lambda_a(n) <= lambda_theta(n)` for `a <= theta`
(each `lambda_a(n)` is a sum of terms `cosh(a log(d/d'))`, increasing in a); n = 1 gives 1. If `a > theta`:
`abs(lambda_mu(p^k)) = abs(p^((k+1)mu) - p^(-(k+1)mu))/abs(p^mu - p^-mu) >= (p^((k+1)a) - p^(-(k+1)a))/(p^a + p^-a)`
and `lambda_theta(p^k) <= (k+1) p^(k theta)`; the ratio is unbounded in k. QED.
MEASURED (`checks.json` C, product of local suprema over p <= 13, k <= 60): zeta's first two resonances (a = 1/4):
1.000 at theta = 0.25 and 0.30, 4.1e10 and 7.3e10 at theta = 0.20; a = 0.26: 13.4 at theta = 0.25; a = 0.40:
1.2e38 at theta = 0.25; a = 0.10: 1.000 at all three.

**Answer to the first lemma as posed.** Finiteness of the Hecke-sup norm on a resonance vector reads beta exactly:
`f_rho in X_theta` iff `beta >= 1 - 2 theta`. It is not limited to `beta <= 1`. But the reading is the definition
of the space: `X_theta` intersected with the joint eigenvectors is the set of eigenvectors with `abs(Re mu) <= theta`,
for every base norm `N_0`, every group that has operators obeying the multiplication rule, and every location of
the resonances. Contractivity reads nothing further: on an eigenvector `N_theta(U(t) f)/N_theta(f) = e^(t Re mu)`.

**Lemma H3 (PROVED).** If `U(t)` commutes with every `T_n`, then `N_theta(U(t) f) <= ||U(t)||_(N_0) N_theta(f)`.
Proof. `N_0(T_n U(t) f) = N_0(U(t) T_n f) <= ||U(t)||_(N_0) N_0(T_n f)`. QED.
So the growth rate in `N_theta` is at most the growth rate in `N_0`, with no gain from the supremum over n.

## 3. Decisive first test

Question: does the growth bound follow from a step that uses commutation of `T_n` with `Z(t)` for all n together
with the scattering functional equation, or is it equivalent to the conclusion?

**Answer: equivalent to the conclusion.** The argument has four parts, each PROVED or PROVED-rel as marked.

(i) Commutation only transfers (Lemma H3). The functional equation `phi(s) phi(1-s) = 1` enters only as the
symmetry `rho <-> 1 - rho` of the resonance set.

(ii) **Lemma Q (PROVED-rel c4 Lemma 1, refereed).** On the Eisenstein channel `T_p = U(log p) + U(-log p)`; with the
multiplication rule this gives `T_n = sum over dd' = n of U(log(d/d'))`. Hence, with
`G_theta(f) = sup_t e^(-theta abs(t)) N_0(U(t) f)`,

    N_theta(f) <= sum over dd' = n of e^(theta abs(log(d/d'))) G_theta(f) / lambda_theta(n) <= 2 G_theta(f),

because `e^(theta abs(x)) <= e^(theta x) + e^(-theta x)` (MEASURED: ratio at most 0.989 on 24 cases, `ref_checks.json` R1).
The Hecke-sup norm is a two-sided exponential-growth norm of the wave group sampled at the times `log(d/d')`; the
positive rationals are dense in the positive reals, so the sample is dense. The operators
`T_n^w := sum over dd' = n of U(log(d/d'))` exist for every one-parameter group, obey the Hecke multiplication rule
identically (it is an identity between the functions `lambda_nu(n)` of nu), and satisfy H1, H2, H3. For a
non-arithmetic Hecke triangle group, for an abstract Lax-Phillips triple with any inner scattering function, the
norm, the inequality H1 and the finiteness lemma H2 are the same statements. Multiplicativity of the genuine
`T_n` is consumed in H1 only through an identity that the wave group supplies by itself.

(iii) In Setting I every gauge built from `Z(t)`, `Z(t)^*`, the energy form and the compressed Hecke operators
(`= Z(log p) + Z(log p)^*`) is defined for every inner function S. In that class the candidate inequality is false
in general (a Blaschke product with a zero at `Im z = eps` has `||Z(t)||` of every such gauge at least `e^(-eps t)`
on that eigenvector). A proof of the inequality must therefore use a property of zeta's S that other inner
functions lack; the only such property is the location of its zeros. (ARGUED from c4 section 2; the statement that
*no* functorial gauge separates is a statement about a class, not a theorem about all constructions.)

(iv) In Setting II the spaces `X_theta` contain `E(., w')` with `Re w' - 1/2 <= theta` whenever `N_0` admits them;
sections 4 and 5 show that every base norm examined admits them (EIS-w), and that no base norm examined gives
`||T_p||` below the value implied by admissibility.

So in each setting one of the following holds: the bound is the definition of the space (H2); or it holds equally
for a control with the conclusion false (Q, iii); or the space does not single out resonances (EIS-w). The test
kills the idea as posed.

## 4. Solid norms: the lattice cap

A norm N on a space X of measurable functions on `Gamma\H` is *solid* if `abs(g) <= abs(h)`, h in X implies g in X
and `N(g) <= N(h)`. Weighted sup norms, mixed norms `L^p_y(L^q_x)` on F, Orlicz and Lorentz norms, and every
weighted `L^q` are solid.

**Theorem L (PROVED).** Let X be solid, contain the bounded functions of compact support, be invariant under `T_p`,
and contain a resonance state `f_rho`. Then the constants lie in X and `||T_p^k||_X >= (p^(1/2) + p^(-1/2))^k` for
all k. More generally, for every `s' >= 0` with `ht^(s')` in X, `||T_p^k||_X >= lambda_(s'-1/2)(p)^k`.
Proof. The non-zero Fourier modes of `E(., w)` decay exponentially in y and its zero mode is `y^w`, so
`abs(f_rho) >= y^(Re w)/2 >= 1/2` for `y > A`. Then `1 <= 2 abs(f_rho) + 1_(y <= A)`, and both terms are in X, so
1 is in X. `T_p` has a positive kernel and `T_p 1 = p^(-1/2)(1 + p) 1`. If `u >= 0` in X and `T u >= c u` with T
positive, then `T^k u >= c^k u` and, N being monotone, `N(T^k u) >= c^k N(u)`. For the general statement take
`u = ht^(s')`: for z in F, `u(pz) >= (p y)^(s')` and `u((z+b)/p) >= (y/p)^(s')` because ht is the maximum of Im
over the orbit; so `T_p u >= p^(-1/2)(p^(s') + p^(1-s')) u = lambda_(s'-1/2)(p) u` on F, hence everywhere. QED.
MEASURED: `T_p ht^(s') >= lambda_(s'-1/2)(p) ht^(s')` at 1200 random points (p = 2, 3, 5, 7; s' = 0.1 to 1.3),
minimum ratio 1.000 (`checks.json` A). In the weighted sup norm `sup abs(f) ht^(-3/4)` the sampled value of
`T_p ht^(3/4)/ht^(3/4)` reaches 3.48 (p = 2), 4.39 (p = 3), 6.33 (p = 5), above `p^(1/2) + p^(-1/2)` (`ref_checks.json` R3).

**Corollary L1 (PROVED).** In a solid norm the inequality `abs(lambda_mu(p)) <= ||T_p||_X` is implied by
`abs(lambda_mu(p)) <= p^(1/2) + p^(-1/2)`, which holds for every mu with `abs(Re mu) <= 1/2`. A solid norm reads
`0 <= beta <= 1` and nothing else. This is the Hecke-side dual of "the energy norm gives beta <= 1".

**Corollary L2 (PROVED).** The same holds for the Hecke-sup norm over a solid base: `N_theta(1) = N_0(1) sup_n lambda_(1/2)(n)/lambda_theta(n) = infinity`
for `theta < 1/2`, while 1 is in the solid span of `f_rho`. So `X_theta` over a solid `N_0` is not solid, and the
only content of `f_rho in X_theta` is H2.

**Remark (why Perron-Frobenius stops at the edge).** A weighted sup norm `sup abs(f)/h` with `h > 0` a joint
eigenfunction gives `||T_p|| = ` eigenvalue of h exactly. `E(., sigma)` is positive for `sigma > 1` and gives
`theta = sigma - 1/2 > 1/2`. For `1/2 < sigma < 1`, `E(., sigma)` is integrable with integral zero, so it changes
sign (MEASURED: `phi(3/4) = -2.9315`, `E(i, 3/4) = -1.9288`, `E(10i, 3/4) = +0.4103`, automorphy check 4e-31;
`checks.json` E). CLASSICAL in general: positive eigenfunctions of the Laplacian exist only at or below the bottom
of the L2 spectrum, which is 0 on a finite-volume surface.

## 5. L^q and the Hecke-module norms

**Lemma E (PROVED from CLASSICAL properties of E).** (i) `f_rho` is in `L^q(Gamma\H)` iff `q (1/2 + a) < 1`; this
forces `q < 2`. (ii) For such q, `E(., w')` is in `L^q` for every w' with `1/2 < Re w' < 1/q`, whatever `phi(w')`
is, and `T_p E(., w') = lambda_(w'-1/2)(p) E(., w')`. (iii) Hence the point spectrum of `T_p` on `L^q` contains
`{lambda_nu(p): 0 < Re nu < 1/q - 1/2}` and its spectral radius is at least `p^(1/q - 1/2) + p^(1/2 - 1/q) > p^a + p^-a`.
Proof. `abs(E(z, w'))^q` is `y^(q Re w')(1 + o(1))` in the cusp against `dx dy/y^2`. QED.
The bound an `L^q` norm gives for the eigenvalue of `f_rho` is implied by `f_rho` being in `L^q`
(MEASURED bookkeeping, `checks.json` F). The matching upper bound `r(T_p | L^q_0) <= lambda_(theta_q)(p)` by
interpolation between `L^1` and `L^2_0` (Kim-Sarnak on cusp forms) was not derived and is not needed: this is the
one place where a genuinely arithmetic bound enters a non-L2 norm, and it lands on the admissibility threshold
from above. The same computation holds for every cofinite group with its own Eisenstein series and any operator
commuting with the Laplacian. Lemma E is also a case of Theorem L (`L^q` is solid); it is stated separately because
it shows the threshold is attained from inside the space by EIS-w.
MEASURED: `T_p E = lambda E` to 5e-31 at a generic point for the resonance `w = 1 - rho_1/2` (`abs(phi(w)) = 8e-31`)
and for the off-resonance point `w' = 0.80 + i(0.37 - gamma_1/2)` (`abs(phi) = 0.546`), p = 2, 3 (`checks.json` E).

**Norms on the Hecke module generated by f.** For a joint eigenvector the module is one-dimensional. A norm on the
Hecke algebra H (commutative, generated by the `T_p`) gives a Banach completion A with Gelfand spectrum `Sigma_A`;
"the character of `f_rho` is A-bounded" is `mu in Sigma_A`. Cases (PROVED from the lemmas above unless marked):

| completion of H | Sigma_A in the mu-plane | contains resonances | excludes EIS-w |
|---|---|---|---|
| weighted l^1: `sum abs(c_n) lambda_theta(n)` | `abs(Re mu) <= theta` (H2) | iff `a <= theta` (the conclusion) | no: the strip is full |
| operator norm on `L^2_0` | Eisenstein line `Re mu = 0` and cusp-form parameters (CLASSICAL) | never, for any beta in (0,1) | yes, and the resonances with it |
| operator norm on `L^q`, q < 2 | contains `0 < abs(Re mu) < 1/q - 1/2` (Lemma E) | iff admissible | no |
| operator norm on a solid X | contains `mu = 1/2` (Theorem L) | bound is `abs(Re mu) <= 1/2` | no |
| energy norm on K, compressed (c4) | not a representation of H (compression not multiplicative) | — | — |

No completion in the list has a spectrum that contains the resonances and is thinner than a full strip.

## 6. Pivot: reading phi(w) = 0 without truncation (Setting III)

The off-resonance series differ from a resonance state only in the subdominant zero-mode term `phi(w') y^(1-w')`.
That term dominates as `y -> 0` (the zero mode is defined for all y > 0 as the x-average over a closed horocycle).

**Lemma O (PROVED).** Let `Y_out` be the space of automorphic functions of moderate growth whose zero mode satisfies
`a_0(y) = O(y^(1/2 + delta))` as `y -> 0` for some `delta > 0`. Then `Y_out` is invariant under every `T_n`; it
contains `E(., w)` with `Re w > 1/2` iff `phi(w) = 0`; it contains no `E(., w')` with `Re w' <= 1/2`.
Proof. `a_0(T_p f)(y) = p^(-1/2) a_0(py) + p^(1/2) a_0(y/p)` (c4, refereed). The zero mode of `E(., w')` is
`y^(w') + phi(w') y^(1-w')` for all y > 0, and `Re(1 - w') < 1/2` when `Re w' > 1/2`. QED.
MEASURED (`ref_checks.json` R4): x-average of E at y = 0.3 minus `y^w` is 7e-31 at the resonance and 0.7846 off
resonance, equal to `abs(phi(w') y^(1-w'))`.

On `Y_out` the control EIS-w fails at a named step (membership). The price: the zero mode is the only place where
the space reads `phi(w) = 0`, and there `T_n` acts as `sum over dd' = n of (dilation by d/d')` (Lemma Q in the
variable `log y`). The device becomes: bound the rate `a_0(f)(y) - mean = O(y^c)` as `y -> 0` on a `T`-invariant
class of functions. For smooth compactly supported f the expansion of `a_0(f)` over the poles of
`<f, E(., s)>` gives exponents `1 - Re(rho)/2`; `c = 3/4 - eps` for all such f is Zagier's criterion (CLASSICAL,
equivalent to RH), and `c = 1/2` is unconditional (Sarnak, CLASSICAL). The Hecke operators map the class to itself
and act on the rate function by dilations, which preserve every rate. No step uses multiplicativity beyond the
density of `log(d/d')`. This is row G31 (horocycle-period form) joined to row G26. No further pivot.

## 7. Controls, pre-filter and device row

| control | setting | structural step examined | outcome |
|---|---|---|---|
| non-arithmetic Hecke triangle group | I, and II/III on the Eisenstein channel | no Hecke correspondences. `T_n^w = sum U(log(d/d'))` exists and satisfies H1, H2, H3, Q. Theorem L and Lemma E need a positive operator with `T 1 = c 1`; the heat or wave-averaging operators supply one | **passes** every step of family 2 and of the truncated setting. It fails only where the genuine correspondence is named, and no conclusion is drawn at that step |
| EIS-w: `E(., w')`, `phi(w') != 0` | II | invariance, joint eigen-relation, membership in solid X, in `L^q`, in `X_theta` | **passes** every step of families 1, 2, 4 (Theorem L, H2, Lemma E; MEASURED eigen-relation to 5e-31). Fails in Setting III at membership in `Y_out` (Lemma O), where the device is Zagier's criterion |
| BLS, read here as Blaschke / singular inner factors moved inside the scattering coefficient (the code is not defined in the map; this reading is the lane's) | I | every gauge built from `Z`, `Z^*`, the energy form | **passes**: the model space of any inner S carries the same gauges; growth rate of `Z(t)` equals `sup Re mu` for each S |
| T-NR | I (model) / II | at model level `X(2s-1)/X(2s)` with `X = xi m` is unitary on the line with resonances at `Re mu = -1/4 +- delta/2`, a moved-resonance inner function: passes. On the surface there is no T-NR object (level 1 has only the spherical vector at q): the exact eigen-relation at q (step X2) is not formulable | passes at model level; not formulable at group level (no quantitative handle) |
| E_a | I (model) | scattering quotient with resonances at `(rho +- a)/2`, inner for 0 < a < 1/2 (c4, referee rerun) | passes at model level; no surface realisation sought |
| DH, HEAT, TW+-, B, WT, theta^w, phase-rotated transfer operator | — | no step of the device reads the Euler product except H1, which is an identity for `lambda_nu(n)`; nothing for these controls to break | not run |

Pre-filter (c13 Lemma P) reading: the device has one step of type X2 (exact Hecke relation, in H1). Lemma Q shows
that on the channel that carries the resonances this step is of type S1 (a linear identity satisfied by a function
of the wave generator), so the X2 label does not protect it. Three questions: Q1, EIS-w and the non-arithmetic
control pass (above). Q2, the identities are uniform in height; no inequality about zeros is obtained. Q3,
multiplicativity enters in H1 only, as an identity available without Hecke operators.

**Device row (proposed G37, for the map maintainer; this lane does not edit the map).**
Hecke-built norms outside weighted L2 on Lax-Phillips resonance states | (a) every solid norm admitting a resonance
state contains the constants, so `||T_p^k|| >= (p^(1/2) + p^(-1/2))^k`: reads `0 <= beta <= 1` only; (b) the
Hecke-sup norm `sup_n N_0(T_n f)/lambda_theta(n)` satisfies `N(T_m f) <= lambda_theta(m) N(f)` by the Hecke
multiplication rule, is finite on an eigenvector iff `abs(Re mu) <= theta` (the conclusion), and is dominated by
the two-sided wave-growth norm `sup_t e^(-theta abs(t)) N_0(U(t) f)`, defined for every Lax-Phillips triple;
commutation transfers growth bounds and produces none; (c) `L^q`: admissibility `q < 1/(1/2 + a)` implies the
bound, off-resonance Eisenstein series fill the spectrum; (d) the space with zero mode `O(y^(1/2+delta))` at
`y -> 0` reads `phi(w) = 0` and is Hecke-invariant, and the device on it is Zagier's criterion with `T_n` acting by
dilations. Not covered: non-solid norms that are not of Hecke-sup, translation-covariant or model-functorial type. |
PROVED (H1-H3, L, E, O); PROVED-rel c4 Lemma 1 (Q); consistency checks MEASURED | EIS-w passes (a)-(c);
non-arithmetic / abstract triple passes (b) and the truncated setting; T-NR and E_a pass at model level |
`c14-laxphillips-hecke-norm-outside-l2`.

## 8. Requirement flags

- **R1 (multiplicativity essential): not met.** The Hecke multiplication rule is consumed in Lemma H1, but as an
  identity for the functions `lambda_nu(n)` that the wave group satisfies by itself (Lemma Q); Theorem L uses only
  positivity of the correspondence and `T_p 1 = c 1`.
- **R2 (height-uniform, every window): not met.** All identities are uniform in gamma, but no conclusion about
  zeros is obtained in any window.
- **R3 (fails for every control for a structural reason): not met.** EIS-w and the non-arithmetic control pass
  every step of the settings in which a norm inequality is proved.
- **R4 (reaches the critical line): not met.** Proved inequalities read `0 <= beta <= 1`; the statement that reads
  beta = 1/2 (membership in `X_(1/4)`, or the rate 3/4 in Setting III) is the conclusion.

## 9. Three weakest steps

1. Part (iii) of the decisive test and the last sentence of the device row concern classes of constructions. A
   norm on K or on automorphic functions that is neither solid, nor Hecke-sup over a base, nor translation-covariant
   on the zero mode, nor functorial in the inner function is not excluded by a theorem here. c4 Lemma 4 shows any
   such norm bound for all p implies the location; that no independent derivation exists is not proved.
2. Lemma Q rests on c4 Lemma 1 (`T_p = U(log p) + U(-log p)` on the Eisenstein channel), proved there for the L2
   Eisenstein part and used here on non-L2 eigenfunctions `E(., w')`, where it is the scalar identity
   `lambda_nu(p) = p^nu + p^-nu` on the two wave data `(E, +-nu E)`; the wave evolution of data of moderate growth
   is taken from finite propagation speed and was not written out.
3. The upper bound for `T_p` on `L^q_0` by interpolation with Kim-Sarnak was not derived; Zagier's criterion and
   Sarnak's exponent 1/2 in section 6 are recalled, not opened; "BLS" is read as inner factors in the scattering
   coefficient because the map does not define the code; resonance data of non-arithmetic groups are not computed.
   Numerics are consistency checks of proved statements (30 digits, not interval), not evidence.

## Run note

The first run of `checks.py` wrote its output with a relative path while the working directory was the repository
root, and overwrote the untracked file `checks.json` there (5261 bytes written; previous content not recoverable
by this lane; scripts with the same relative write exist in `c5-angular-family-absorption` and `g-coupling-norm`,
whose directories hold no `checks.json`, so the lost file was probably a stray output of one of them). The script
now writes next to itself. The root file was left as overwritten; it is a copy of this lane's `checks.json`.

## Files

- `checks.py`, `checks.json`, `checks.log`: sections 2, 4, 5.
- `ref_checks.py`, `ref_checks.json`, `ref_checks.log`: second pass on different cases (R1 to R4).
- `REFEREE.md`: same-agent audit (not an independent referee).
- `lanes.jsonl`: record line.
