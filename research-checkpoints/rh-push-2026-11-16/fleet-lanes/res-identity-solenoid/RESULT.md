# res-identity-solenoid: properties tied to the identity of the Bohr torus and to the self-dual line

Date 2026-11-17. Continues `ap-global-bridge` (RESULT.md + REFEREE.md). Labels: PROVED / CLASSICAL (recalled, not
re-read) / PROVED-rel X / MEASURED (float64 or mpmath, not interval) / ARGUED / OPEN.
Nothing here proves or refutes RH. No bound moves.

## Verdict

**Precise obstruction (a narrower no-go), with a classification and two new control constructions.**

1. Classification of self-dual translates (Theorem 1). "Self-dual" has three different meanings and the answer
   differs for each. Under group inversion the fixed cosets of the Kronecker line are indexed by `{+-1}^P`
   (uncountably many). Under the functional equation with a degree-1 gamma factor the only coset of the full
   torus is the Kronecker line itself; real characters are not points of `T^P`, they are points of punctured
   tori `T^{P \ S}`. The expectation "identity and finitely many others" is false in both directions.
2. Each class of identity-tied property that does not use the functional equation has a control with a
   prescribed zero in the strip: the real twist `U_R` (Theorem 2, values `+-1`, inversion-self-dual) and the
   Beurling subgroup `B_1` (Theorem 3, a one-parameter subgroup through the identity).
3. On the self-dual line the symmetry gives exactly: the Maslov index (archimedean, equal to `theta(T)/pi`),
   endpoint signs, and the parity of the central zero (root number). No other deformation invariant exists
   (Theorem 4). The count of real zeros changes at exceptional points along paths that keep the symmetry
   (T-NR family, heat family).
4. Krein signatures (Theorem 5). The bridge form is the Hermitian trace form of the zero set. It is one member
   (`u = F'`) of the family `h_u` of all forms for which the scaling generator is symmetric. It is a function
   of the zeros, degenerates exactly at a multiple zero, and its determinant on a cluster is the discriminant.
   The forms that stay nondegenerate through a collision assign opposite signatures to adjacent real zeros
   unless the weight `u` has a zero between them. A definite sign is therefore the same thing as an
   interlacing partner `u` (Hermite-Biehler pair). The symmetry supplies no partner.
5. Partners (Theorems 6, 7). The shifted partner `B_a = Im Xi(. + ia)` gives an automatic square
   `int |V|^2 / |Xi(t + ia)|^2 dt`, valid exactly for `a` such that zeta is zero-free in `Re s >= 1/2 + a`:
   the protection range equals the zero-free half-plane (`f(theta) = theta`; `a > 3/8` unconditionally by the
   7/8 theorem). Any partner for `Xi` itself must have zero-counting function `N(T) + O(1)`, i.e. must carry
   `S(T)`; every partner with regular count `theta(T)/pi + O(1)` (Gram points, shifted pairs with `a > 1/2`)
   fails.

What remains outside: section 8.

## 0. Plan; what is new relative to the map

- Target: the case the referee of `ap-global-bridge` left open, "properties tied to the identity element".
  Theorem D there covers translation-invariant properties only.
- Rows touched: A5 (global object), Q6 / item 11-12 of section 4 (Krein square, inertia), row 7 (lens
  `Re F'/F < 0`), P27-type density rows. Not re-entered: Toeplitz index on the torus (A5), Gohberg-Krein
  index on the line (Q8), finite-stage Lee-Yang (A2).
- New here: Theorem 1 (three-level classification), Theorem 2 (`U_R`), Theorem 3 (`B_1` as a subgroup
  through the identity), Theorem 5 (bridge form = trace form; signature rule; protection iff interlacing
  partner), Theorem 7 (a partner must carry `S(T)`). Theorems 4 and 6 are short consequences of classical
  facts, stated for the table.
- Numerics: three scripts in this directory, each run through `scripts/memcap.sh` (caps 4 and 8 GB),
  interpreter `.venv-arb/bin/python`. No compute-server use.

## 1. Setting

`Gamma = Q*_{>0}`, `G = Hom(Gamma, T) = T^P`, identity `1`. Kronecker line `K = {k_t = (p^{-it})_p}`, a
one-parameter subgroup. For `chi0 in G`, `zeta_chi0(s) = sum chi0(n) n^{-s}`; along the coset `chi0 K` the
function is `t -> zeta_chi0(sigma + it)`. `Xi(t) = xi(1/2 + it)`, real and even on the real axis.

## 2. Task (1): which translates are self-dual

**Theorem 1.**

(a) (Inversion; PROVED.) Let `iota(chi) = chi^{-1}`. Then `iota(chi0 K) = chi0 K` iff `chi0 K = eps K` for a
unique `eps in G[2] = {+-1}^P`. Proof: `chi0^2 = k_a` gives `(chi0 k_{-a/2})^2 = 1`; uniqueness because
`K cap G[2] = {1}` (`t log 2` and `t log 3` both in `pi Z` forces `t = 0`). On `eps K` the involution acts as
`t -> -t`, and the symmetry of the function is `zeta_eps(conj s) = conj zeta_eps(s)`: reflection in the real
axis. It does not relate `sigma` to `1 - sigma`. There are `2^{aleph_0}` such cosets (all completely
multiplicative functions with values `+-1`).

(b) (Functional equation on the full torus; PROVED-rel Kaczorowski-Perelli 1999, structure of the Selberg
class in degree 1, recalled.) Suppose `chi0 in G` and `zeta_chi0` continues to C with at most a pole on
`Re s = 1`, has finite order, and satisfies a functional equation `Phi(s) = omega conj Phi(1 - conj s)` with
`Phi = Q^s Gamma-factor(s) zeta_chi0(s)` of degree 1. Then `chi0 in K`. Proof: after a vertical shift the
function is in the Selberg class of degree 1, so it is `zeta(s)` or `L(s, chi)` with `chi` primitive of
conductor `q > 1`; the second has coefficient 0 at `p | q`, and `|chi0(p)| = 1` for all `p`. For zeta's own
gamma factor and conductor this is Hamburger's theorem. So **the Kronecker line is the only FE-self-dual coset
of `T^P`**.

(c) (Punctured tori; same dependence.) For a finite set `S` of primes let `G_S = T^{P \ S}`, a point being a
completely multiplicative function that vanishes exactly at the primes of `S`. The points of `G_S` with a
degree-1 functional equation are `chi(n) n^{-i theta}` with `chi` a primitive Dirichlet character whose
conductor has prime support exactly `S` (imprimitive characters are excluded: the missing Euler factors have
zeros on `Re s = 0` and the dual factors on `Re s = 1`). For each such line the anti-linear form
`Lambda(s, chi) = eps_chi conj Lambda(1 - conj s, chi)` holds, so the completed function is real up to a
constant phase on the critical line for **every** primitive `chi`, complex ones included. The linear
functional equation `s -> 1 - s` maps the line to itself iff `chi` is real: one line per finite `S` of odd
primes, three per `S` containing 2 (fundamental discriminants). Countably many in total, none of them in
`T^P` except `chi = 1`.

(d) Consequence for the lane's premise. The functional equation is not an involution of `G`: it pairs the
abscissa `sigma` with `1 - sigma`, and the symbol at `1 - sigma` is not a function on `G` (`F_sigma in L^2(G)`
iff `sigma > 1/2`). The only involution of `G` in play is inversion, which is (a). Reality on the critical
line needs the anti-linear equation only and holds on every primitive-character line. The extra linear
symmetry of real characters adds the evenness `gamma -> -gamma` of the zero set.

Not covered by (b): completions of a point of `G` by a gamma factor of degree `>= 2`. Degrees in `(0,1)` and
`(1,2)` are empty (Conrey-Ghosh; Kaczorowski-Perelli 2011, recalled). Degree `>= 2` with a degree-1 Euler
product is excluded by the standard conjectures and is OPEN here.

## 3. Identity-tied properties without the functional equation: two controls

**Theorem 2 (control `U_R`; PROVED, elementary).** Let `s0 = beta + i gamma`, `1/2 < beta < 1`, `gamma != 0`.
Put `m_p = -2 p^{beta-1} cos(gamma log p)` for `p >= p0 = 2^{1/(1-beta)}` (so `|m_p| <= 1`), and any value
in `[-1,1]` for `p < p0`. Define `eps_p in {+-1}` recursively over the primes in increasing order:
`eps_p = -1` if `D >= 0`, else `+1`, where `D` is the running sum of `eps_q - m_q` over `q < p`. Then
`|D| <= 2` throughout, and for the completely multiplicative `eps`,

    zeta_eps(s) = E(s) / ( zeta(s - s0 + 1) zeta(s - conj(s0) + 1) ),

with `E` analytic and zero-free in `Re s > 1/2`. So `zeta_eps` is meromorphic in `Re s > 1/2`, has simple
zeros at `s0` and `conj s0` and no other zeros there; its poles there lie in `Re s < beta`.

Proof. `D >= 0` gives increment `-1 - m_p in [-2, 0]`, `D < 0` gives `1 - m_p in [0, 2]`; hence `|D| <= 2`.
`R(s) = sum_p (eps_p - m_p) p^{-s} = s int D(x) x^{-s-1} dx` converges and is analytic in `Re s > 0`.
`sum_{p >= p0} m_p p^{-s} = -sum_p (p^{-(s-s0+1)} + p^{-(s-conj s0+1)})`, and
`sum_p p^{-w} = log zeta(w) - h0(w)` with `h0` analytic in `Re w > 1/2`. Finally
`log zeta_eps(s) = sum_p eps_p p^{-s} + h(s)`, `h` analytic in `Re s > 1/2`. The finitely many `p < p0`
contribute an entire function. ∎

With `m_p = -p^{beta-1}` the same construction gives a real `+-1` completely multiplicative function whose
Dirichlet series has a simple real zero at `beta`.

`U_R` is a 2-torsion point of `G`: real coefficients, ordinary Dirichlet series, Euler product, local
parameters `+-1`, inversion-self-dual coset. It lacks the functional equation and `Lambda >= 0`. It removes
every argument built from "translation-invariant structure of `G`" plus "reality of the coefficients / the
anti-unitary symmetry `s -> conj s`". Novelty not checked (Seip 2020 treats unimodular `chi`; the `+-1`
case may be in the Helson-zeta literature).

Numerical check (MEASURED, float64, `real_twist_zero.py`, `s0 = 0.9 + 3i`, 41 primes clipped, max `|D|` =
1.9185). Smoothed sum `S_M(s) = sum eps(n) n^{-s} e^{-n/M}`:

| N | M | abs S_M(s0) | abs(S_M - closed form) at 0.95+3i | at 1.3+3i | at 1.3 |
|---|---|---|---|---|---|
| 4e6 | 6.25e3 | 0.3251 | 0.2000 | 8.9e-3 | 1.2e-3 |
| 4e6 | 2.5e4 | 0.1997 | 0.1160 | 3.5e-3 | 3.7e-4 |
| 4e6 | 1e5 | 0.1164 | 0.0637 | 1.3e-3 | 1.1e-4 |
| 4e7 | 6.25e4 | 0.1405 | 0.0785 | 1.8e-3 | 1.6e-4 |
| 4e7 | 2.5e5 | 0.0794 | 0.0418 | 6.6e-4 | 5.3e-5 |
| 4e7 | 1e6 | 0.0430 | 0.0213 | 2.3e-4 | 1.6e-5 |

Winding number on `|s - s0| = 0.08` and on `|s - conj s0| = 0.08`: 1.0000 for `S_M` (N = 4e7, M = 1e6,
minimum modulus on the circle 0.322) and 1.0000 for the closed form (minimum modulus 0.339). The decay at
`s0` is about `M^{-0.42}`, consistent with the first singularities of the closed form at `Re s = beta - 1/2`.
The agreement to the left of `s0` is poor at these `M` (0.366 against 5.85 at `0.75 + 3.4i`). The proof is
the bounded-partial-sum argument; the run is a consistency check.

**Theorem 3 (control `B_1`: a one-parameter subgroup through the identity; PROVED, elementary).**
One-parameter subgroups of `G` are `L_omega = {(e^{-it omega_p})_p}`, `omega in R^P`. With radii
`r_p = e^{-sigma omega_p}` the function along `L_omega` is the Beurling zeta function of the generalised
primes `q_p = e^{omega_p}`. `K` is `omega_p = log p`. Let `s0` be as in Theorem 2, `x0 = 2^{1/(1-beta)}`,
`Pi(x) = int_{x0}^x (1 - 2 u^{beta-1} cos(gamma log u)) du / log u` (non-decreasing), and let the generalised
primes be any sequence with counting function `pi_B = Pi + O(1)` (for instance `Pi(q_j) = j`). Then

    zeta_B(s) = (s - s0)(s - conj s0) / (s - 1) * exp(analytic in Re s > 1/2):

a simple pole at 1, zeros exactly at `s0`, `conj s0` in `Re s > 1/2`.

Proof. `sum_j q_j^{-s} = int x^{-s} dPi + s int (pi_B - Pi) x^{-s-1} dx`; the second term is analytic in
`Re s > 0`. With `x = e^u`, `int_{x0}^inf x^{-s} x^{w-1} dx / log x = E_1((s - w) log x0)
= -log(s - w) + entire`, used for `w = 1, s0, conj s0`. The terms `k >= 2` of `log zeta_B` converge in
`Re s > 1/2`. ∎ The `q_j` can be chosen with `log q_j` linearly independent over Q inside the `O(1)` freedom,
so `L_omega` is dense in `G`.

`B_1` has: a subgroup through the identity, Euler product, `Lambda_B >= 0`, pole at 1, the Hardy order
induced by `omega`, density of the flow line. Every property of the structure
`(G, group law, a dense one-parameter subgroup, the order it induces, the radii e^{-sigma omega})` that does
not use the specific frequency vector holds for it. What singles out `omega = log p` among all `omega`:
`omega` is monotone on the integers (Erdos 1946: a monotone additive function is `c log n`; CLASSICAL), i.e.
the additive structure of Z, which is the functional equation (Poisson summation). This is control B of the
map, in a form with exactly one prescribed pair of zeros. Constructions of this type are in the Beurling
literature (Diamond-Montgomery-Vorhauer, Zhang); novelty not claimed. Not run numerically.

**Summary of section 3.** Identity-tied properties fall into three classes: those that hold on every
inversion-self-dual coset (killed by `U_R`), those that hold on every one-parameter subgroup (killed by
`B_1`), and those that use the functional equation, for which `K` is the unique coset (Theorem 1(b)) and the
statement is rigidity (Hamburger), which carries no inequality (map section 2, "Input level").

## 4. Task (2): invariants on the self-dual line

Setting: a real entire function `F` on the line (`F = Xi`, or the completed function of a control), windows
`[a, b]` with `F(a) F(b) != 0`.

**Lemma M (Maslov index is archimedean; PROVED).** On any FE-self-dual line
`L(1/2 + it) = Z(t) e^{-i theta_L(t)}` with `Z` real and `theta_L` determined by the gamma factor, the
conductor and the root number. The path of real lines `R e^{-i theta_L(t)}` in `RP^1` has Maslov index
`theta_L(T)/pi + O(1)`. It is the same for every function with that functional equation (Davenport-Heilbronn
has the path of `L(s, chi_5)`). It contains no prime.

**Lemma R (rotation number; PROVED + CLASSICAL).** If `F` has only simple real zeros on the window, the
winding of `(F', F)` about the origin is `pi N_0`, `N_0` the number of real zeros. So the Prufer rotation is
`N_0(T)`, and `N(T) - N_0(T) = theta(T)/pi + 1 + S(T) - N_0(T)` is the number of off-line zeros to height `T`.
RH is the equality of two integer-valued functions for every `T`. The rotation number in the usual sense
(a limit of `N_0(T)/N(T)`) is a density: at least 5/12 unconditionally (CLASSICAL), and conditionally equal
to 1 for linear combinations of L-functions such as Davenport-Heilbronn (Bombieri-Hejhal 1995, under GRH and
a pair-correlation hypothesis for the constituents; recalled), which have infinitely many off-line zeros. A
rotation number does not separate zeta from DH and cannot see `o(T log T)` zeros (MV-CAP).

**Theorem 4 (deformation invariants; PROVED).** Let `V` be any real vector space of real entire functions
with the topology of locally uniform convergence, and let `I` be a locally constant function on
`{F in V : F(a) F(b) != 0}`. Then `I` depends only on `(sign F(a), sign F(b))`. Proof: the set with fixed
endpoint signs is convex. Consequences:
- the only invariant of the window is the parity of the number of real zeros in `(a, b)`, equivalently "the
  number of off-line zeros with height in a window is even", which is the symmetry itself;
- with the evenness symmetry and a symmetric window the parity is trivial; at the centre the invariant is the
  parity of the order of vanishing at `s = 1/2`, i.e. the root number. For zeta and real Dirichlet characters
  the root number is `+1` and the index vanishes;
- `N_0` on a window is locally constant only off the discriminant (double real zeros), and the discriminant
  is crossed by paths inside the symmetric class. Explicit paths: the T-NR family
  `F_c(t) = Xi(t)(2 cos(t log q) + c)` (same gamma factor and functional equation, multiplicative
  coefficients), where at `c = 2` every zero pair of the cosine factor becomes double simultaneously and for
  `c > 2` sits at `Im t = +- arccosh(c/2)/log q`; and the backward heat family.

In the T-NR family the local parameter at `q` is `alpha + 1/alpha = c`: on the unit circle for `|c| <= 2`,
a real reciprocal pair for `|c| > 2`. The anti-unitary symmetry acts on local parameters by
`alpha -> 1/conj(alpha)`; its fixed set is the unit circle. The exceptional point is the local parameter
leaving the fixed set through `alpha = +-1`. For zeta `alpha_p = 1` at every prime (row L4: temperedness is
satisfied vacuously).

**Altland-Zirnbauer reading (ARGUED; dictionary only).** The zero set has the symmetries
`gamma -> conj gamma` (anti-linear functional equation) and, for real coefficients, `gamma -> -gamma`.
For an operator with spectrum `{gamma}` the first is pseudo-Hermiticity with respect to the bridge form
(spectrum symmetric about the real axis, real iff the form is definite), not Hermiticity; so the tenfold
table, which classifies gapped Hermitian systems, applies only after assuming what is to be proved. The second
is a particle-hole symmetry, and its zero-dimensional index is the parity of the central zero mode: the root
number (the `SO(odd)` case of Katz-Sarnak for families with root number `-1`). Hecke operators do not refine
the class: on the `Zhat*`-invariant part the rung shifts are functions of the scaling generator
(`ap-global-bridge` (1a), refereed), so their joint eigenspaces are the eigenspaces of the generator; the
symmetry maps the block at `gamma` to the block at `conj gamma`, and a block is invariant iff the Hecke
eigenvalue `p^{-i gamma}` is unimodular. "Every Hecke block is symmetry-invariant" is RH restated.

**Lemma C (the line is not a line in a compact group at `sigma = 1/2`; PROVED + CLASSICAL).** `Z(t)` is not
the restriction to `K` of a function determined by `G`: the symbol `F_{1/2}` is not in `L^2(G)`, and
`Z(t) = 2 Re( e^{i theta(t)} sum_{n <= (t/2 pi)^{1/2}} n^{-1/2 - it} ) + O(t^{-1/4})` (Riemann-Siegel) is a
path in `G x T` whose trigonometric polynomial grows with `t`. The archimedean phase `theta(t)` is not almost
periodic. The finite-stage statement on `G x T` is row A2 (zeros on the line above height `2 pi M`), which
holds for `E_a` and the sign twists.

## 5. Task (3): Krein signatures and symmetry-protected positivity

Local setting. Let `Gamma` be a contour symmetric under conjugation with `F != 0` on it, `F_Gamma` the monic
real polynomial of the zeros inside, `n` its degree, `A = R[z]/(F_Gamma)`. Multiplication by `z` on `A` has
spectrum the zeros inside, with multiplicity. `V^#(z) = conj V(conj z)`.

**Theorem 5 (PROVED; (i)-(iv) are the Hermite-Sylvester-Jacobi theory in this notation).**

(i) Symmetric bilinear forms on `A` for which multiplication by `z` is symmetric are exactly
`h_u(V, W) = sum_gamma Res_gamma( u V W / F_Gamma )`, `u in A`. (`A` is cyclic, so `h(V,W) = l(VW)`; the
residue pairing is perfect, so `l = Res(u . / F_Gamma)`.) The Hermitian extensions are
`h_u(V, W^#)` and have the same signatures.

(ii) `h_u` is nondegenerate iff `gcd(u, F_Gamma) = 1`. Then its signature is

    sig h_u = sum over real zeros gamma of odd multiplicity m of sign( u(gamma) / F_Gamma^{(m)}(gamma) ).

A real zero of even multiplicity and a non-real pair contribute 0.

(iii) The trace form `sum_gamma V(gamma) W(gamma)` is `h_u` with `u = F_Gamma'`. It is nondegenerate iff the
zeros are simple, positive semidefinite iff all zeros are real, of signature
(distinct real zeros + distinct non-real pairs, distinct non-real pairs), and its determinant in the monomial
basis is the discriminant of `F_Gamma`. By eq48 (refereed) the bridge form is
`Q(V) = sum_gamma V(gamma) conj V(conj gamma) = Tr(V V^#)`: **the bridge form is the Hermitian trace form of
the zero algebra.**

(iv) Along a continuous path `(F_tau, u_tau)` with `F_tau != 0` on `Gamma` and `gcd(u_tau, F_tau) = 1`, the
signature of `h_{u_tau}` is constant. (The Gram matrix entries are contour integrals of `u z^k / F`.)

(v) Collision rule. Two adjacent simple real zeros have the same `h_u`-signature iff `u` has an odd number of
zeros between them. If they merge and leave the real axis along a path, then either their signatures were
opposite or `u_tau` acquires a common zero with `F_tau` at the merger. For `u = 1` (residue form) adjacent
signatures are always opposite: the collision is always allowed. For `u = F'` (bridge form) adjacent
signatures are always equal and the form always degenerates at the merger.

(vi) `h_u` is positive definite on `A` iff all zeros inside are real and simple and the zeros of `u`
(reduced mod `F_Gamma`) strictly interlace them, i.e. `F_Gamma + i u` is a Hermite-Biehler polynomial. Then
`h_u(V, V) = sum_gamma |V(gamma)|^2 u(gamma)/F'(gamma)` is a de Branges norm.

Answer to task (3). The Krein-square factorisation restricted to the self-dual line does not acquire a
definite sign from the symmetry. The symmetry gives the family `{h_u}` and the parity constraint
`sig h_u = n mod 2`. The bridge form is the member `u = F'`: it is canonically attached to the zeros, so it
is not a structure that exists independently of them, and Krein's stability theorem (a fixed nondegenerate
form, a varying self-adjoint operator) does not apply to it; (iii) shows it changes signature through a
degenerate point exactly at a collision. A symmetry-protected positivity is, by (vi), the same as an
interlacing partner `u` that never shares a zero with `F` along the deformation. The square-root lane's pair
`D = F + alpha F'`, `N = F - alpha F'` is the partner `u = F'`.

Check (MEASURED, float64, `krein_poly.py`, Chebyshev basis): 308 random real polynomials of degree up to 12:
residue-form signature equals the formula of (ii) in 308/308; `u = z - c` in 308/308; trace-form signature
equals (iii) in 305/308 (the 3 failures were not examined; eigenvalue threshold `1e-13` relative). Path
`F_tau = (z^2 - tau)(z^2 - 4)`, `tau` from 1 to -1: residue signature `(2,2)` throughout; trace signature
`(4,0)` for `tau > 0`, `(3,1)` for `tau < 0`; `det(trace form)/disc` constant to 13 digits.

**Theorem 6 (shifted partner; protection range = zero-free half-plane; PROVED, with CLASSICAL de Branges
theory).** Let `E_a(z) = Xi(z + ia)`, `A_a = Re`, `B_a = Im` of `E_a` on the real axis (the pair
`(xi(s+a) + xi(s-a))/2`, `(xi(s+a) - xi(s-a))/2i` on the critical line). Then
`|E_a(z)| > |E_a^#(z)|` for all `Im z > 0` and `E_a` has no real zero iff zeta has no zero with
`Re s >= 1/2 + a`.
Proof of "if": `Xi` is even of genus at most 1, so it is a constant times the product of `(z - gamma)` over
its zeros grouped in fours; for a zero `gamma` with `c = Im gamma`, `|c| < a`, and `z = x + iy`, `y > 0`:
`(y + a - c)^2 > (y - a + c)^2` and `(y + a + c)^2 > (y - a - c)^2`, so the factor pair
`|w - gamma| |w - conj gamma|` is larger at `w = z + ia` than at `w = z - ia`. "Only if": a zero with
`c >= a` is a zero of `E_a` in the closed upper half-plane. ∎
In that range `A_a` and `B_a` have only real, simple, interlacing zeros, and `h_{B_a}` on the zeros of `A_a`
is `||V||^2 = int |V(t)|^2 / |Xi(t + ia)|^2 dt` on the de Branges space `H(E_a)`: an honest square. For
`a > 1/2` the weight is `|gamma-factor|^{-2} |sum mu(n) n^{-1/2-a-it}|^2`, where the Euler product enters by
absolute convergence. The range is `a >= 1/2` classically (no zeros on `Re s = 1`), `a > 3/8` by the 7/8
theorem (PROVED-rel the Lean theorem), and all `a > 0` iff RH. When `a` decreases to `beta - 1/2` for a zero
`beta + i gamma`, `A_a` and `B_a` acquire the common real zero `gamma` and the weight acquires a pole on the
real line: the gap closes exactly at the zero. The mechanism returns its input (`f(theta) = theta`, rows Z16,
P14). Phase form: interlacing on a window follows from a constant sign of
`d/dt arg E_a = Re (xi'/xi)(1/2 - a + it)`, which is row 7 of map section 4 (lens / half-plane form).
Relation to the literature: Lagarias 2005/2006 (`a >= 1/2`; RH iff all `a > 0`), de Bruijn 1950 (real zeros of
`A_a` under a strip hypothesis). Nothing new except the `a > 3/8` instance and the reading as a protection
range.

Check (MEASURED, mpmath 25 digits, `hb_phase.py`), `g(t) = Re (Lambda'/Lambda)(1/2 - a + it)`:

| function | a | window, step | sign of g |
|---|---|---|---|
| zeta | 0.40 | [0, 120], 0.25 | negative at 481/481 points (max -0.0185) |
| zeta | 0.05 | [0, 120], 0.05 | negative at 2401/2401 points (max -0.0023) |
| DH | 0.35 | [80, 92], 0.02 | negative at 601/601 points |
| DH | 0.25 | [80, 92], 0.02 | positive on 85.54 <= t <= 85.86 (17 points, max +15.08) |
| DH | 0.3085 | [85, 86.4], 0.005 | positive at t = 85.700 only (max +38.6) |

DH zero used: `0.80851718245664 + 85.699348485378i` (`|f| = 5e-13` at the 14-digit value). For DH the global
range is `a > 0.6204` (zeros up to `Re s = 1.1203625`), which is above `1/2`: "the shifted pair at `a = 1/2`
is Hermite-Biehler" is true for zeta and false for DH. This is the classical region `Re s >= 1` (wall 5.3),
not a new separation.

**Theorem 7 (a partner must carry `S(T)`; PROVED-rel the classical unboundedness of `S(T)`).** If the real
zeros of `u` interlace the zeros of `Xi`, then `|N_u(T) - N(T)| <= 1`, so
`N_u(T) = theta(T)/pi + S(T) + O(1)`. Since `S(T)` is unbounded (Selberg; unconditional omega-results of
Tsang), no `u` with `N_u(T) = theta(T)/pi + O(1)` is a partner. This excludes:
- the archimedean partner `sin theta(t)` (Gram points): its failure is the failure of Gram's law;
- every shifted partner `A_a`, `B_a` with `a > 1/2`: by the functional equation
  `arg E_a(T) = -(theta(T) + arg zeta(1/2 + a + iT)) + O(1)` and `|arg zeta(1/2 + a + iT)| <= log zeta(1/2 + a)`.
For `0 < a <= 1/2` the difference is `S(T) - (1/pi) arg zeta(1/2 + a + iT) + O(1)`; unboundedness for fixed
`a` is expected and not proved here (ARGUED). A partner for `Xi` must reproduce `arg zeta(1/2 + iT)` to
within a bounded error at every height: a largest-value statement on the critical line (wall 5.4).

## 6. Task (4): Davenport-Heilbronn

- Position (PROVED, uses `ap-global-bridge` REFEREE section 5). DH is `c F(chi_5 .) + conj(c) F(conj chi_5 .)`
  on the punctured torus `T^{P \ {5}}`: a sum of the Euler symbol over the two-point orbit
  `{chi_5, conj chi_5}` of inversion. Each of the two lines is self-dual in the anti-linear sense of Theorem
  1(c) and neither is self-dual in the linear sense. DH is the symmetrisation that restores the linear
  functional equation. Symmetrisation over an orbit is a linear operation; the result is not the Euler symbol
  at any point, of any punctured torus (`a(6) - a(2)a(3) = 1.0807`).
- What fails, by theorem. Theorem 1: DH is not a point, so it is not in the classification; it does not
  contradict uniqueness of `K`. Theorems 2, 3: not applicable (no Euler product). Lemma M: same Maslov path
  as `L(s, chi_5)`. Lemma R: rotation number conditionally 1. Theorem 4: DH lies in the same real vector space
  of functions real on the line as the completed `L(s, chi_5)` and its reflection `t -> -t`. Theorem 5: holds
  verbatim; the bridge form of DH has negative index equal to its number of off-line pairs. Theorem 6: holds
  with range `a > 0.6204`. No step on the self-dual line fails for DH; what differs is the size of the
  zero-free half-plane that Theorem 6 takes as input.

## 7. Controls and the three requirements

| Control | Theorem 1 (point of a torus with FE) | Sections 4-5 (line invariants, Krein forms) | Theorem 6 range |
|---|---|---|---|
| DH | not a point; orbit sum of two anti-linearly self-dual points | all identities hold; Maslov path of `L(chi_5)` | `a > 0.6204` |
| HEAT | not a point (no ordinary Dirichlet series; `ap-global-bridge` Lemma 2) | all hold; it is a path that crosses the discriminant | half-width of its zero strip |
| TW+-, U, `U_R` | points of `G`, off `K`; no functional equation by Theorem 1(b). `U_R` is inversion-self-dual and has a prescribed zero | no critical line; nothing to state | not defined |
| EA | degree-2 Euler factors with parameters `p^{+-a}`: a point of a rank-2 object with non-unimodular coordinates | all hold | `a' > a` |
| NR | functional equation yes; local parameter at `q` off the unit circle | all hold; the family in `c` is the explicit exceptional-point path | `a > arccosh(abs(c)/2)/log q` |
| B, `B_1` | a different one-parameter subgroup through the identity; no functional equation | not defined | not defined |

Structural reason in one line per class: without the functional equation, the identity element, the
subgroup property and reality of coefficients are shared by controls with zeros (`U_R`, `B_1`); with the
functional equation and without multiplicativity, everything stated on the line is an identity valid for
every real entire function (DH, HEAT, NR, EA); with both, the object is a single isolated point (Theorem 1),
and a deformation invariant needs a family.

Requirements. All primes together: used in Theorems 1-3; not used in sections 4-5, which is why those
statements hold for the controls. Uniform in height, every window: Theorems 4-6 are window statements; none
yields an inequality for zeta beyond the input half-plane. Multiplicativity enters only through Theorem 1
(as rigidity) and through the input of Theorem 6.

## 8. What remains outside this no-go

1. Properties of the isolated point that are not deformation invariants (arithmetic, rigid). Theorem 4 says
   nothing about them. No candidate is known.
2. An interlacing partner `u` for `Xi` with an independent source. By Theorem 7 it must have
   `N_u = N + O(1)`; by Theorem 5(vi) its existence with real zeros is equivalent to RH plus simplicity. The
   candidates checked (`F'`, `sin theta`, shifted pairs) are circular, false, or limited to the zero-free
   range.
3. Points of `G` with a functional equation of gamma-degree `>= 2` (Theorem 1(b) assumes degree 1).
4. The infinite-dimensional form of Theorem 5 (all zeros at once instead of clusters), and the semilocal
   Krein index uniform in the place set `S` (left open by `ap-global-bridge`; not touched here).

## 9. Three weakest steps

1. Theorem 1(b),(c) rest on the Kaczorowski-Perelli degree-1 theorem, recalled and not re-read; the
   hypotheses (finite order, pole only on `Re s = 1`, gamma factor of degree 1) are assumed in the statement.
   Degree `>= 2` is open. Bombieri-Hejhal (Lemma R) is conditional and recalled; the omega-result for `S(T)`
   in Theorem 7 is recalled.
2. Theorem 5 is proved for finite clusters (polynomial algebra). The identification "bridge form = trace
   form" for the full zero set uses the refereed eq48 formula but the continuity statement (iv) and the
   collision rule were not written for the infinite-dimensional space of exponential tests. The
   Altland-Zirnbauer paragraph is a dictionary, not a theorem. Three of 308 trace-form checks failed in
   float64 and were not examined.
3. `U_R` is checked in float64 at one `s0`; the smoothed sums converge like `M^{-0.42}` and agree poorly to
   the left of `s0`. `B_1` was not run numerically. Novelty of Theorems 2, 3, 5, 7 was not checked against
   the literature; Theorem 6 is Lagarias/de Bruijn apart from the `a > 3/8` instance. Unboundedness of
   `S(T) - (1/pi) arg zeta(1/2 + a + iT)` for `0 < a <= 1/2` is not proved.

## 10. Rows for the obstruction map (not edited here)

- Control table: `U_R` (completely multiplicative `+-1`, zeros at prescribed `s0`, `conj s0`; lacks FE and
  `Lambda >= 0`; kills translation-invariant structure plus reality of coefficients). `B_1` (Beurling system
  with pole at 1 and exactly one prescribed zero pair in `Re s > 1/2`; kills properties of one-parameter
  subgroups through the identity).
- Row A5 addendum: identity-tied properties. Without FE: `U_R`, `B_1`. With FE: `K` is the unique coset
  (degree 1), rigidity only. On the line: Maslov index `theta(T)/pi`; deformation invariants = endpoint signs
  and root-number parity; bridge form = trace form (degenerate at collisions, det = discriminant); definite
  sign iff interlacing partner; shifted partner valid iff zero-free `Re s >= 1/2 + a`; partner must carry
  `S(T)`. Controls DH, HEAT, NR, EA pass every line statement.

## Files

- `real_twist_zero.py`, `real_twist_zero_4000000_0.9_3.0.json`, `real_twist_zero_40000000_0.9_3.0.json`,
  `run_4e7.log` (Theorem 2 check; planned allocation printed: 2.5 GB at N = 4e7)
- `hb_phase.py`, `hb_phase.json` (Theorem 6 check)
- `krein_poly.py`, `krein_poly.json` (Theorem 5 check)
