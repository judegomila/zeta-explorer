# h-hecke-channels: Hecke relations between zero channels on isogenous tori

Date: 2026-11-16. Nothing here proves or refutes RH. No bound moves.
Labels: PROVED (argument given here), CLASSICAL, MEASURED (mpmath 25-30 digits, not interval), OPEN.

## Verdict

**Precise obstruction, with the exact relation and four structural statements.**

1. The Hecke relation between the loaded field on a torus and on its `p+1` isogenous tori is one
   linear equation per vertex of the isogeny tree (R1 below). It holds for every lattice and
   identically in `s`. It is never overdetermined, for one prime or for all primes together (N1).
2. At the square torus (the vertex whose field is `zeta(s) L(s,chi_-4)`), a zero `rho` forces: all
   three 2-neighbours vanish at `rho`; the 3- and 5-neighbours come in two classes with exactly
   opposite nonzero values (R2). The neighbours are themselves Davenport-Heilbronn-type objects and
   have off-line zeros: 14% to 40% of their zeros below height 200, first at
   `0.8651 + 20.6473 i` on the torus `3i` (MEASURED, section 4, counts balance exactly).
3. Davenport-Heilbronn is not relation-free. It is one vertex of a two-vertex Hecke graph on which
   the Hecke operators act by quarter-turns and the functional equation by a reflection (dihedral
   group of order 8). It is an exact Hecke eigen-object at every prime `p = +-1 mod 5` (R4).
4. Under the de Bruijn heat flow the Hecke relation does not stay a multiplier relation. It becomes
   the twin shift (bridge-shear) form with shear `h_p = (tau/2) log p` (R3). The conjugated Hecke
   operators still commute and are completely multiplicative for every real `tau`, including
   `tau < 0` where zeros are off the line. So "commutative Hecke algebra + functional equation, in a
   form that persists under the flow" passes the backward-heat control.
5. Two controls built inside the tree have off-line zeros while keeping the functional equation and
   Hecke eigen-relations at all primes but one (C1) or at half of the primes (C2).

No rigidity results. The step Davenport-Heilbronn fails is "the Fricke-fixed vector is a joint Hecke
eigenvector" at `p = +-2 mod 5`, which is the statement that it has no Euler product. No mechanism
found here converts that failure into zero information.

## 0. Plan; what is new against the atlas and walls

- Atlas (PR 27) and the 14 geometric lanes have no Hecke-correspondence route. g-torus-modular
  integrated over the modular curve (Maass-Selberg); it did not use Hecke operators.
  flow-euler-defect has the scalar cocycle `exp(2t log m log n)`; R3 here is its operator form on the
  tree and the identification of the shear.
- Walls. DH: section 5. Backward heat: R3/C3. Flow-blindness: R3 shows the relation is flow-covariant,
  hence blind. T-NR (stack-combinator control NR): C1 realises it as a combination of fields on two
  2-isogenous tori. MV-CAP and verified height are not engaged (all statements are identities).

## 1. Which loading is Hecke-equivariant

**P0 (PR 43/49/56 loading carries no Hecke structure). PROVED from refereed inputs.**
The loaded field is `f = F o s` on `E_r`, with `s` a fixed degree-2 function and `r` a reference
parameter only (g-torus-modular P1, referee-confirmed). For an isogeny `phi: E' -> E_r` of degree
`p`, the field on `E'` is `phi^* f`; its zero set is `phi^{-1}(Z)`, `p` translates of each zero, for
any `F` (zeta or DH alike). The only translation symmetry of `f` is the half period
(g-symmetry-schur Theorem 1), so `f` descends along exactly one isogeny, the 2-isogeny that realises
`s -> 1-s`. In this loading the functional equation is an isogeny; no prime `p` enters.

So multiplicativity has to be put in through a loading that depends on the lattice. The twin-ladder
heat trace does:

    Theta_L(t) = sum_{v in L} exp(-pi t |v|^2 / covol L),
    Lambda_L(s) = (1/2) int_0^inf (Theta_L(t) - 1) t^s dt/t = E*(tau_L, s)
                = xi*(2s) y^s + xi*(2s-1) y^(1-s) + 4 sqrt(y) sum_n n^(s-1/2) sigma_{1-2s}(n) K_{s-1/2}(2 pi n y) cos(2 pi n x).

`Lambda_L(s) = Lambda_L(1-s)` for every lattice (Poisson; this is the Fricke/inversion step).
For the square torus `Lambda_{Z[i]}(s) = 2 pi^-s Gamma(s) zeta(s) L(s,chi_-4)` (checked to 1e-24):
the zeros of zeta are zeros of the twin-ladder field of the square torus, at argument `s` itself.

## 2. The exact relation

**R1 (tree relation). CLASSICAL (Hecke); proof is one line.** For every lattice `L` and prime `p`,

    sum_{L' subset L, [L:L']=p} Theta_{L'}(p t) = Theta_L(t) + p Theta_L(p^2 t)      (heat-trace form, all t > 0)
    sum_{L'} Lambda_{L'}(s) = (p^s + p^(1-s)) Lambda_L(s)                              (field form, all s)

Proof: a vector of `L` outside `pL` lies in exactly one index-`p` sublattice, a vector of `pL` lies in
all `p+1`. The second line is the Mellin transform of the first. QED.
MEASURED (`hecke_checks.py`): relative error <= 6e-31 for `p = 2,3,5`, three lattices, three `s`.

The first line is the relation "in the heat picture": `t` is the heat time of the flat torus, the
sum is over the `p+1` tori `p`-isogenous to `C/L`, and it holds at every `t`. It uses no property of
`L`. Equivariance is a property of the family `L -> Theta_L`, not of a vertex.

**N1 (no overdetermination). PROVED.**
(a) One prime. On the `(p+1)`-regular tree the solutions of `sum_{w ~ v} phi(w) = lambda phi(v)` form
an infinite-dimensional space for every complex `lambda`, and contain functions with `phi(v_0) = 0`
at a chosen vertex: prescribe `phi` arbitrarily on `p` of the `p+1` neighbours at each step outward
and solve for the last one. The ball of radius `n` has `(p+1)p^(n-1)` boundary values and
`1 + (p+1)(p^(n-1)-1)/(p-1)` equations, fewer equations than unknowns at every radius.
(b) All primes. The function `L -> Lambda_L(s_0)` solves the relations for all `p` at once, for every
`s_0` in `C`. So the full system is consistent at every point of the plane; it cannot exclude any
`s_0` as a zero of any vertex.

**R2 (what a zero on one torus forces on the neighbours). PROVED from R1 + CLASSICAL class field
theory; MEASURED.** Let `L = Z[i]`, `Lambda_L(rho) = 0`.

- `p = 2` (ramified). Neighbours: `i` once (the ideal `(1+i)`), `2i` twice.
  `Lambda_{2i}(s) = (1/2)(2^s + 2^(1-s) - 1) Lambda_i(s)`. All neighbours vanish at `rho`. The extra
  factor has its zeros on `Re s = 1/2` (`|2^-s|^2 = 1/2`).
- `p = 3` (inert). Neighbours: `3i` twice (form `x^2+9y^2`), `(-1+3i)/2` twice (form `2x^2+2xy+5y^2`);
  class group of discriminant -36 has order 2. With
  `A = (1 + 3^(1-2s)) zeta(s) L(s,chi_-4)`, `B = L(s,chi_-3) L(s,chi_12)`:

      Lambda_{3i} = (1/2) pi^-s Gamma(s) 3^s (A + B),    Lambda_{(-1+3i)/2} = (1/2) pi^-s Gamma(s) 3^s (A - B).

  At a zero of the root: `Lambda_{3i}(rho) = -Lambda_{(-1+3i)/2}(rho) = (1/2) pi^-rho Gamma(rho) 3^rho B(rho)`.
- `p = 5` (split). Neighbours: `i` twice (the two prime ideals above 5: loops), `5i` twice,
  `(-1+5i)/2` twice. Same shape with `A = (1 - 2*5^-s + 5^(1-2s)) zeta L(chi_-4)`,
  `B = L(s,chi_5) L(s,chi_-20)`.
- General statement: on the vertices at conductor `p^k` the values are the finite Fourier transform
  over the ring class group of the ring class L-functions; the trivial component is
  (local polynomial in `p^-s`) x `zeta L(chi_-4)`. A zero of the root is the vanishing of the class
  average. The other components are different Euler products and are not constrained.

MEASURED (`zero_relation.py`, zeros `14.1347, 21.0220, 32.9351` of zeta and `6.0209, 10.2438` of
`L(chi_-4)`): `p=2` all neighbours `< 1e-35`; `p=3` two classes of equal modulus (e.g. `2.005e-9` at
`rho_1`), sum over the four neighbours `< 1e-29` of that; `p=5` likewise (`8.6e-10`).
Identities for `Lambda_{3i}`, `Lambda_{5i}` and partners checked against the Bessel expansion
(`neighbour_zeros.py`, see section 4).

So the answer to the lane question: a zero of the root, on or off the line, produces on the isogenous
tori the configuration "class average zero". For `h = 1` neighbours this is a common zero, for
`h = 2` neighbours it is an antisymmetric pair of values `+-B(rho)/2`. `B` is an independent
L-function; any value is admissible. Nothing is impossible about the configuration.

## 3. Heat flow

Two flows are present and they behave differently.

- Torus heat time `t` (Laplacian of the flat torus): R1 holds at every `t`. This is the sense in which
  Hecke operators commute with the Laplacian. `t` is Mellin-dual to `s`; moving in `t` does not move
  zeros.
- de Bruijn flow in the spectral variable (the flow of the zero-channel lane),
  `X_tau = exp((tau/4) d_z^2) X`, `z = s - 1/2`. This is the flow under which zeros move.

**R3 (flowed Hecke relation = sheared twin). PROVED.** For entire `X` of the relevant growth, `l = log p`,

    exp((tau/4) d_z^2) [ p^(+-z) X(z) ] = e^(tau l^2/4) p^(+-z) X_tau(z +- tau l/2).

Hence on the tree, with `Lambda_{L,tau}` the flowed field and `h_p = (tau/2) log p`,

    sum_{L'} Lambda_{L',tau}(z) = sqrt(p) e^(tau log^2 p / 4) [ p^z Lambda_{L,tau}(z + h_p) + p^-z Lambda_{L,tau}(z - h_p) ].

Proof: `e^(a D^2) e^(bz) = e^(ab^2) e^(bz) e^(2ab D) e^(a D^2)` with `a = tau/4`, `b = +-l`. On the kernel
side it is `e^(tau (u +- l/2)^2) = e^(tau u^2) e^(+-tau l u) e^(tau l^2/4)`. QED.
MEASURED (`flow_hecke.py`): relative error <= 6e-31 for `tau = 0.3, 0.05, -0.1`, `p = 2,3,5`, with
`X = xi(1/2 + z)` computed from the `Phi` kernel.

Consequences.
- The right side is the twin sum `X(z+h) c^z + X(z-h) c^-z` of the bridge-shear family (atlas
  section 2; g-torus-modular `K_h`), now with a prime-indexed shear `h_p(tau) = (tau/2) log p`.
  The Hecke operator at `p` is the zero-shear member of that family. Forward time gives positive
  shear, backward time negative shear.
- The conjugated operators `T_n^(tau) = e^(tau log^2 n/4) n^(-s) Shift(s -> s - (tau/2) log n)` satisfy
  `T_m^(tau) T_n^(tau) = T_mn^(tau)` for all `m, n` and all real `tau` (PROVED, exponent identity
  `(log m + log n)^2 = log^2 m + log^2 n + 2 log m log n`; MEASURED to 1e-31 at `tau = -0.1`). The
  scalar cocycle of flow-euler-defect Prop. 2 is a coboundary once shifts are allowed. The flowed xi is
  `sum_n T_n^(tau) gamma_tau`, a joint object of a commutative, completely multiplicative Hecke monoid
  for every `tau`.
- **C3 (backward-heat control). PROVED given Rodgers-Tao (`Lambda >= 0`, CLASSICAL).** For `tau < 0`
  the flowed field has non-real zeros and still satisfies the flowed tree relation and the functional
  equation. Any rigidity argument that uses the Hecke relations only in a flow-covariant form fails.
  What is special at `tau = 0` is that every shear `h_p` vanishes, i.e. the Hecke operators act as
  multiplication operators (locality in `s`). An argument has to use that.

## 4. Numerics on the neighbour tori (the fields that receive a zero's "correlated configuration")

`neighbour_zeros.py`: grid search for zeros of `A + B` and `A - B` with `Re s > 1/2`, then Newton
polish (python-flint, 100 bits). Search region `0.5 < sigma < 1.7`.

Each row also has a count check: winding number of `A +- B` round the box `[-1, 2.5] x [1, 200.5]`
(step 0.01, largest phase step 0.19 rad) against sign changes of the real field on the line (step
0.002) plus twice the off-line zeros found. Window `1 < t < 200.5`.

| neighbour torus | field | zeros in box (winding) | on the line | off-line pairs found | balance | off-line share | first off-line zero | largest Re |
|---|---|---|---|---|---|---|---|---|
| `3i` (x^2+9y^2) | A+B, p=3 | 272 | 200 | 36 | 0 | 26.5% | 0.865091 + 20.647342 i | 0.8651 |
| `(-1+3i)/2` (2x^2+2xy+5y^2) | A-B, p=3 | 228 | 162 | 33 | 0 | 28.9% | 1.361834 + 10.405933 i | 1.3618 |
| `5i` (x^2+25y^2) | A+B, p=5 | 304 | 262 | 21 | 0 | 13.8% | 0.590479 + 32.977598 i | 0.7258 |
| `(-1+5i)/2` (2x^2+2xy+13y^2) | A-B, p=5 | 261 | 157 | 52 | 0 | 39.8% | 0.791802 + 16.030130 i | 0.9706 |

All four counts balance exactly, so the off-line lists are complete in the box at the resolution of
the count (MEASURED, floating evaluation; not interval-certified). Full lists: `nz3.log`, `nz5.log`.

Reading.
- The square torus field is `zeta L(chi_-4)`; all its zeros in this window are on the line (verified
  height, CLASSICAL). One 3-isogeny or 5-isogeny away, between 14% and 40% of the zeros below height
  200 are off the line, and the `(-1+3i)/2` torus has a zero with `Re s = 1.36 > 1`.
- At every off-line zero `|A| = |B|` (it is a zero of `A +- B`), with `|A|` between 0.15 and 2.5: the
  off-line zeros of a neighbour are where the Euler product `A` of the root and the independent Euler
  product `B` balance. They are not at or near zeros of the root.
- So along one edge of the isogeny tree the channel structure is not preserved at all. A relation
  that tied the channels of a vertex to those of its neighbours would have to fail here, at height 20.
  The relation that does hold (R1, R2) allows it.
- This also shows the eigen-vertex is not stable in the tree: the neighbours of an Euler-product
  vertex are DH-type vertices. The root is distinguished by complex multiplication with class number
  one (its split and ramified neighbours include itself: loops in the graph), not by the tree relation.

## 5. Controls

**R4 (Davenport-Heilbronn on a two-vertex graph). PROVED (finite check on residues mod 5); MEASURED.**
Let `f = sum a_n n^-s`, `a = (1, xi, -xi, -1, 0)` mod 5, and `g = sum b_n n^-s`, `b_n = a_{2n}`,
`b = (xi, -1, 1, -xi, 0)`. Then with `f = c L(chi) + conj(c) L(conj chi)`, `c = (1 - i xi)/2`:

    a_{pn} = chi-rotation of (a_n, b_n):   p = 1: (a,b);   p = 4: (-a,-b);   p = 2: (b,-a);   p = 3: (-b,a)     (p mod 5)
    Lambda_f(1-s) = +Lambda_f(s),     Lambda_g(1-s) = -Lambda_g(s),     g(1/2) = 0.

So on the real plane spanned by `f, g`: `U_p` is rotation by `arg chi(p)` (a quarter-turn for
`p = +-2`, `U_2^2 = -1`), and the functional-equation involution `W` is the reflection fixing `f`.
`W U_p W = U_p^{-1}`. The group generated is dihedral of order 8 and acts irreducibly over `R`. The
joint eigenvectors are the complex vectors `L(chi)`, `L(conj chi)`, which `W` exchanges.
For zeta the same data is a single vertex: every `U_p` is the identity and commutes with `W`.
MEASURED (`dh_graph.py`): both functional equations to 1e-30, `g(1/2) = 4e-32`, the table for
`p = 2,...,31`; at the DH zero `0.808517182 + 85.699348485 i` the partner is `|g| = 0.730`.

Reading: the statement in the lane brief "for DH no such relation exists" is not accurate. DH obeys
the Hecke relation at every prime in a rank-2 module. At `p = +-1 mod 5` (half of the primes) it is an
exact eigen-relation with the Euler factor `(1 -+ p^-s)^-1`. At `p = +-2 mod 5` its "isogenous" object
is the partner `g`, which lives in the opposite functional-equation sector. The square-torus
neighbours of section 2 have the same shape: `(A +- B)/2` are the two vertices, `A` and `B` the
eigen-objects. The 3-isogeny from the square torus leads directly to DH-type functions.

**C1 (T-NR inside the tree). PROVED; MEASURED.** `G_c(s) = 2 Lambda_{2i}(s) + c Lambda_i(s)
= (2^s + 2^(1-s) + c - 1) Lambda_i(s)`, a real combination of the fields on two 2-isogenous tori.
It has the functional equation, an Euler product (non-tempered factor at 2 only), satisfies the tree
relation with zeta's eigenvalues at every `p != 2`, and for `|c-1| > 2 sqrt 2` has zeros at
`Re s = 1/2 +- arccosh(|c-1|/(2 sqrt 2))/log 2`. For `c = 5`: zero at `1.771553303 + 4.532360142 i`,
`|G_5| = 4e-28` there (`nr_control.py`). Hecke relations at all primes but one, plus the functional
equation, do not confine zeros.

**C2.** DH itself: eigen-relations at a set of primes of density 1/2, functional equation, off-line
zeros.

| step | zeta (square torus root) | DH | T-NR `G_c` | backward heat | sign twist |
|---|---|---|---|---|---|
| tree relation R1 (family level) | holds | holds in rank 2 (R4) | holds, `p != 2` | holds in sheared form (R3) | holds on the Euler side (inferred), no Fricke |
| vertex is a joint eigen-object for all `p` | yes | **fails at `p = +-2 mod 5`** | yes (non-tempered at 2) | yes for the conjugated monoid | yes |
| Fricke commutes with all `U_p` on the module | yes | **fails** (`W U_p W = U_p^-1`) | yes | yes | no Fricke |
| Hecke operators are multipliers (zero shear) | yes | yes | yes | **fails** | yes |
| local factors tempered | yes | n/a | **fails at 2** | n/a | yes |
| zeros on the line | open | no | no | no | no (in general) |

Each control fails a different structural row, and zeta is the only column passing all rows. That is
the list of inputs a Hecke-geometric argument must use at once: joint eigen-vertex, Fricke
compatibility, zero shear, temperedness at every prime. This is the Selberg-class axiom list in tree
language. No step found here combines them into a statement about zeros.

## 6. Why no rigidity appears

- R1 at a prime `p` is equivalent to the `p`-Euler factor. Changing or deleting finitely many Euler
  factors does not move the zeros in the open strip beyond adding or removing the zeros of the local
  polynomials (R2 at `p = 2`, C1). So any finite part of the isogeny graph is zero-blind. PROVED.
- All primes together give the Euler product, which is a relation between functions only for
  `Re s > 1`. Inside the strip the relations at different primes do not compose into a convergent
  constraint; this is the known convergence wall, unchanged by the tree picture.
- The vertex values over a conductor-`p^k` rim are Fourier-dual to independent L-functions (R2). The
  rim does not see whether `rho` is on the line.
- The one place the tree does single out zeta zeros is `Lambda_L(rho/2)`: there `xi*(2s) = 0`, and
  the field vanishes at the cusp-leading order on every lattice at once. This is Zagier's
  observation; g-torus-modular P5 shows that space carries no invariant positive form.

## 7. Verdict by question

1. Exact relation: R1, R2, R3, R4.
2. Numerics on zeta: sections 2, 3, 4. On the control: section 5.
3. Does a zero leaving its channel force an impossible configuration on the isogenous tori? No. It
   forces one linear relation per vertex, which every point of the plane satisfies (N1).
4. Rigidity: none.

## 8. Three weakest steps

1. P0 treats only pullback along isogenies of the PR loading. A trace (pushforward) of the loaded
   field along a `p`-isogeny was not analysed beyond noting that it is not of the form `F o s'`.
2. N1(b) and section 6 show the relations are consistent everywhere; they do not prove that no
   argument combining all four rows of the table exists. That would be a statement about the Selberg
   class, which is open.
3. Section 4 is floating point. The winding/sign-change balance is exact in all four rows, but it is
   not an interval certificate, and the Newton polish reaches only `|A +- B| ~ 1e-14`.

## Files

- `hecke_checks.py`: `E*` by Bessel expansion; R1 for `p = 2,3,5`; neighbour classes of `tau = i`.
- `zero_relation.py`: neighbour values at zeros of the root (R2).
- `neighbour_zeros.py`, `nz3.log`, `nz5.log`, `neighbour_zeros_p3.json`, `neighbour_zeros_p5.json`: section 4.
- `flow_hecke.py`: R3 and the monoid law.
- `dh_graph.py`: R4. `nr_control.py`: C1.
