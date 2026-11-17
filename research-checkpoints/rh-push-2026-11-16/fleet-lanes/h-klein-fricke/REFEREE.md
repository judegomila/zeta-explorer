# REFEREE: h-klein-fricke

Date: 2026-11-16. Independent re-derivation plus mpmath 1.4.1 re-computation (own Chowla-Selberg
code, 25-60 digits, not the lane's `epstein.py`; scratch scripts in /tmp/ref-hkf, not kept in the repo).
Float/mpmath checks, not interval-certified.

## Outcome

- Verdict "precise obstruction": stands.
- Every step labelled PROVED or CLASSICAL was confirmed (list below).
- The claimed Davenport-Heilbronn failure step is wrong as stated. The Section 6 mechanism does not
  use the Euler product. It gives the same conclusion, with the same count, for a non-Euler single
  class and for a non-CM torus (E1 below).
- One sentence in Section 3 is contradicted by Proposition 2 of the same note (E2).
- The actual DH function (characters mod 5) is not an Epstein function, so Sections 2, 3 and 6 are
  not formulable for it. The control row "DH / Epstein with h > 1" tests a surrogate (E3).
- The weight-1/2 point: the lane never applies a Hecke operator to theta. It changes object between
  Section 2 and Section 3. The link between them is an analogy, not an identity (E4).

## Confirmed

| item | check | result |
|---|---|---|
| Prop 1(b) | `lambda(2 tau_E) = m`, `tau -> 2 tau` conjugates `Gamma_0(4)` to `Gamma(2)`, `w_4: t -> 1/t`, `m -> 1-m`, fixed `r = 2^(1/4)`; level-one inversion fixed at `m = 17 - 12 sqrt 2`, `r = 1 + sqrt 2` | re-derived by hand, correct |
| curve convention | `w = iu/r` turns `(w^2+r^2)(w^2+r^-2)` into `(1-u^2)(1-r^-4 u^2)`, so `m = r^-4` | correct |
| (2.3) | `dt/dm = -pi/(4m(1-m)K^2)`, Riemann's `Lambda(s) = 1/(s(s-1)) + int_1^inf psi(t)(t^(s/2)+t^((1-s)/2)) dt/t` | agrees to 15 digits at `s = 3`, `1/2+5i`, `0.3+21i` |
| Prop 2 | counting argument re-derived: `1 - p^-2s + (p+1)p^-2s = 1 + p^(1-2s)`, times `p^s` | correct; direct lattice sums at `z = 0.3+1.7i`, `p = 3`, `s = 3`: 293.917970 vs 293.917970 (truncation 1e-7) |
| normalisation | eigenvalue `p^s + p^(1-s)` is the unnormalised `T_p` (sum over `p+1` sublattices, covolume factor `p^s`); with the `p^(-1/2)` normalisation it is `p^(s-1/2) + p^(1/2-s)` | standard, correct |
| local factors n = 1,2,3,4,7 | `E*(i sqrt n, s)` against `zeta L(chi_-4n') x factor` at `s = 2.3+1.1i` | agree to 18 digits; roots of all three polynomials have `|u|^2 = 1/2` |
| five tori on the arc | primitive forms `[a,0,c]` with `h(-4ac) = 1`: `ac = 1,2,3,4,7` | correct |
| off-line zeros | `[1,0,5]`: `0.932969697485 + 15.6682495313i`; `n = 1.003`: `0.52265387339 + 49.7481216301i` | reproduced |
| Prop 5 repro | `D = -28`: window (2.907, 15.800), 8 forced, `N_K = 8.000000`, first `rho >= 1` at 16.686 | reproduced |
| E4 formula | `Tr(w_p|S_2) = 1 - #Fix/2`, `dim S_2^+ = (g + 1 - #Fix/2)/2`; p = 37 gives 1, p = 67 gives 2 | correct |
| E3 identity | `sum H(4n-t^2) = 2 sum_{d|n, d > sqrt n} d` for non-square n | standard, totals 22 and 202 correct |
| Prop 4 | linear algebra | true and tautological: it excludes functions of traces only (the lane says so in 9.2) |
| DH mod 5 | zero of the classical DH function | `0.808517182457 + 85.6993484854i` reproduced |

Not checked: the `N_right` table beyond the two zeros above, the E3 real/pair split, the 13-prime
E4 table, the zeta-view convention that `A` and `DC` are the free involutions.

## Errors

### E1. The DH failure step is mislocated; Proposition 5 is Euler-blind (numerical refutation)

The claim: Section 6 is the one step DH-type functions fail, at "the Hecke/Galois orbit is a single
torus".

Proposition 5 has two inputs, (i) `rho < 1` at the marks and (ii) `N_K = k_1 - k_0`. Neither uses
`h(D) = 1`. Both are properties of `E*(z, 1/2+it)` for any `z` with large `y` (Stark 1967 and
Bateman-Grosswald are stated for arbitrary positive definite forms). `h(D) = 1` is used only to
rename the function as `zeta(s) L(s, chi_D)`. I ran the same procedure on three objects with no
Euler product:

| object | y | window | forced on line | N_K | first rho >= 1 |
|---|---|---|---|---|---|
| `[1,0,41]`, D = -164, h = 8, single class | 6.4031 | (1.479, 41.981) | 46 | 46.000000 | 42.558 |
| `[1,0,5]`, D = -20, h = 2, single class | 2.2361 | (3.507, 14.638) | 6 | 6.000000 | 15.579 |
| non-CM `z = 0.2137 + 2.6458i` | 2.6458 | (2.907, 21.473) | 13 | 13.000000 | none below 22 |
| lane's `D = -163` for comparison | 6.3836 | (1.482, 42.011) | 46 | 46 | 42.58 |

So the mechanism traps all zeros in the window for a DH-type function with the same count (46) as
for `D = -163`. The control passes. What fails at `h > 1` is the applicability of the mechanism to
a true Euler product (`zeta_K`, a sum of `h` Epstein functions), for which the conclusion is
expected to be true. That is the reverse of a DH discriminator: the argument works on non-Euler
single tori and stops working on Euler products with `h > 1`.

Corrected statement. Cosine dominance is a finite-height property of any high torus and uses no
multiplicativity. The arithmetic input is the classification `h(D) = 1`, which decides when a
single-torus function contains zeta as a factor. The lane's own sentence "A single class ... passes
the cosine step for t < T_0 (CLASSICAL, Stark 1967; not re-run here)" already concedes this; the
verdict item 5, Section 7 last line and the headline claim contradict it. The 46-zero statement for
`zeta L(chi_-163)` is true. It is inside verified height and is not an Euler-product mechanism.

### E2. "Hecke orbit is a single point" is false; the correct object is the class-group orbit

Section 3: "An Euler product ... requires the sum over the p+1 isogenous tori to return multiples
of Z(L, .) itself." By Proposition 2 that sum returns `(p^s + p^(1-s)) Z(L, s)` for every lattice,
so the condition as written always holds. Also the `T_p` orbit of a CM point with `h = 1` is not
a point: of the `p+1` sublattices at most two are stable under the order, the others have CM by
the order of conductor `p` (discriminant `D p^2`).

The correct statement is about a different Hecke action. The binary theta series `Theta_Q` is a
weight-1 form on `Gamma_0(|D|)` with character `chi_D`. `T_p Theta_Q = sum over ideals of norm p of
Theta_{Q.[p]}` (at most two terms). `Theta_Q` is an eigenform iff this stays in the line of
`Theta_Q`, which for all `p` means the class group is trivial. This is the Galois orbit of `j`
(Gal(H/K) = class group), not the `T_p` orbit in the lattice variable. "Hecke/Galois orbit" in the
claim is right for Galois and wrong for Hecke. Verdict item 2 ("Hecke closure of one torus is class
number one") needs the same replacement. Proposition 4's "Hecke module of Dirichlet series" is
this weight-1 action on coefficients; Proposition 2's is the weight-0 action on the lattice. The
note uses the two interchangeably. They are different operators.

### E3. The DH control is run on a surrogate

The classical DH function is a combination of `L(s, chi)`, `L(s, conj chi)` for the odd characters
mod 5, with gamma factor `Gamma((s+1)/2)`. It is not the Epstein zeta function of any lattice
(an Epstein function has gamma factor `Gamma(s)` and a pole at `s = 1`). Hence for the campaign's
DH control: Proposition 2, reality via `E*`, and Proposition 5 are "not formulable", the same entry
the table gives the other controls. Only Proposition 4 applies to it. The statement "all
identities and all Hecke trace/class-number counts hold for DH unchanged" is true for single-class
Epstein functions with `h > 1` (also treated by Davenport-Heilbronn 1936) and should be worded
that way.

### E4. Weight 1/2: handled by avoidance; the Section 2 to Section 3 link is an analogy

Section 2 is about `theta = sqrt(2K/pi)`, weight 1/2 on `Gamma_0(4)`, whose Mellin transform along
the arc is `zeta`. The Hecke algebra there consists of `T_{p^2}` only (theta is a `T_{p^2}`
eigenform, matching the Euler factor in `p^-2s` of `zeta(2s)`); `T_{p^2}` does not act on the arc
and no geometric trace formula for it is set up. The lane states no false Hecke identity for theta:
it states none. Section 3 switches to the Epstein function of one torus, where the torus is fixed
and `s` is the Eisenstein parameter; the function obtained is `zeta(s) L(s, chi_D)` (times a local
factor), never `zeta(s)`. So:

- "Completed zeta is the Mellin transform along the arc" (integration over the family, weight 1/2)
  and "Euler product at special tori on the arc" (evaluation at one member, weight 0 in `z`,
  weight 1 for `Theta_Q`) are different constructions on the same arc.
- "Fricke `w_4` is the functional equation" is an identity for (2.3). The functional equation of
  `E*(z, s)` in Sections 3-6 is the scattering relation `s -> 1-s` at fixed `z`, not `w_4`.
- The relation between them is `theta^2 = Theta_{[1,0,1]}` (n = 1 only), which the note does not
  use. No statement transfers Hecke information from Section 3 to the Mellin representation (2.3).

Verdict item 1 ("the arithmetic Klein surface is the base ... Fricke is the functional equation")
is therefore an identity for zeta only at the level of Jacobi/Riemann, and items 2-5 are about a
different family of functions. The lane's weakest-step 3 says part of this.

### Minor

- Prop 1(a): "determined by `tau_E` alone" needs "and the choice of free involution". On a
  rectangular lattice the two free antiholomorphic involutions (translation along the real or the
  imaginary half-period) give Klein bottles exchanged by `tau -> -1/tau`; they are isomorphic only
  for the square lattice.
- Section 5, no-factorisation over C: the argument that `F` would generate a CM field uses
  `a_p^2 < 4p` (Hasse-Deligne), which is the statement under discussion; say so.
- Section 6 "ceiling": the ceiling `t ~ 42.6` is for zeta as a factor. The window itself has no
  ceiling (any `y`), which is E1 again.
- `localfactor.log` n = 7 agrees to 16 digits in the lane's run, 18 in mine; the "15 digits" claim
  is fine.

## Surviving claim

PROVED/CLASSICAL, confirmed: `r^-4 = lambda(2 tau_E)` on an arc of `X_0(4)(R)`; `w_4` is
`K <-> K'`; (2.3) expresses completed zeta as the Mellin transform of `sqrt(2K/pi)` along the arc;
the Epstein function satisfies the lattice Hecke relation with eigenvalue `p^s + p^(1-s)` for every
torus, so that relation is Euler-blind; quantities that are functions of Hecke traces are constant
on a module and cannot determine `N_right`.

Corrected: a single Epstein function is one Euler product (up to a finite local factor) iff the
class group of its order is trivial (weight-1 theta series eigenform; Galois orbit of `j` a point),
not iff its `T_p` orbit is a point.

Corrected: cosine dominance traps every zero of `E*(z, s)` below `t ~ 2 pi y` for any high torus,
Euler product or not (46 zeros for the non-Euler class `[1,0,41]`, same as `D = -163`). It is
Euler-blind. Class number one enters only as the condition for zeta to be a factor; the resulting
statement (7 zeta zeros below 42) is inside verified height.

The obstruction verdict is unchanged and slightly stronger: this lane contains no step that
separates Euler products from DH-type functions by a mechanism; Section 6 separates them by a
finite classification.
