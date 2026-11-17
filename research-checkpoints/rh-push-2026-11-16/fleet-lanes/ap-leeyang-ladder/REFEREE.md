# REFEREE: ap-leeyang-ladder

Date: 2026-11-17. Target: `RESULT.md` in this directory. Claimed verdict: precise-obstruction.

**Outcome: holds, with corrections.** Every step labelled PROVED was re-derived and is correct
at the stated level, except for three labelling or scope errors listed in section 3. The DH
control failure was reproduced with independent code. Nothing in the note proves or refutes RH,
and the note says so.

Referee scripts were scratch files outside the repository (`/tmp/ref_lyl/chk*.py`), run through
`scripts/memcap.sh 8`, numpy/scipy/mpmath, largest planned allocation 221 MB, each run under one
minute. Float64 and mpmath at 30 digits; not interval arithmetic.

## 1. Re-derivation of the PROVED steps

| Step | Result | Notes |
|---|---|---|
| Theorem A, factorisation | confirmed | `E(1-s) = w^-N U*(w)`, `w^-N = M^(s-1/2)`; needs real `a_n` so that `U*(w) = w^N U(1/w)`. Holds for zeta ladders and for DH (coefficients 1, kappa, -kappa, -1, 0). |
| Theorem A, conclusion | confirmed | A zero with `x > 0` needs `abs(Theta) = 1`; `abs(Theta) <= abs(gamma(1-s)/gamma(s)) M^x`. |
| Bound (G) | confirmed as an expansion, not as an explicit inequality | `Re psi(1/4 + it/2) - log pi = log(t/2pi) - 1/(24 t^2) + O(t^-4)` (re-derived). The minimum over `x` is at `x -> 0` because the symmetric sum of `Re psi` is locally convex in `x`. The constant 0.042 at `t = 7` rests on the author's grid value 0.04182. For `M = 1` the threshold `2 pi` lies below the range `t >= 7` of (G). |
| Strip version (remark 2) | confirmed | `U(1/w)/U(w)` is analytic on `0 < abs(w_p) < sqrt p`; log-sup over the tori `abs(w_p) = p^-x` is convex in `x`; `psi(0) = 0`. Phase-0 maximiser verified by hand for `N = 1` only (the squared ratio is increasing in `cos theta`). |
| Theorem B | confirmed | Jensen mean of `log abs(b)` on `abs(w) = r` is `sum log max(r, abs(a_j))`; zeros at modulus `p^(-1/2) < p^-x`. Non-constancy: a Blaschke product with constant modulus on a circle `r < 1` is a monomial. |
| Additive ladder zero-free | confirmed | `Re 1/(1-z) > 1/2` on the disc. |
| Proposition C | confirmed, both routes | `a_p a_q = (a_p + a_q)/2 - abs(a_p - a_q)/2` gives boundary weights `e^(-K_pq/2) <= 1` iff `c >= 0` and field shift `c log p log M`. The lattice-gas route covers depth 1 only; "every depth" follows from the second route alone (`e^(c D^2)` on a product of sine ratios, shift identity checked on exponentials). |
| Winding lemma, Theorem D | confirmed | `A = int_1^inf psi x^(s/2-1) dx - 1/(1-s)`; leading term `-i(1 - 2 psi(1))/t`, `psi(1) = 0.0432`. Bounded variation of `arg A` is not needed: `arg A -> -pi/2` already contradicts an increase of `pi` between consecutive zeros. |
| Proposition E(b) | confirmed as arithmetic | `lcm(1..floor Y) <= Y^2` iff `Y < 5`. See 3.2 for scope. |
| DH `P = 3, N = 1` stable | confirmed | `U = 1 + z_2 z_3 + kappa (z_2 - z_3)`; `0.5918 > 0.3649`. |
| `E_a` truncations stable for `a < 1/2` | confirmed | local roots at `abs(z) = p^(+-a)`, outside `abs(z) <= p^(-1/2)`. |

## 2. Numerical reproduction (independent code)

| Claim | Referee value | Agreement |
|---|---|---|
| DH `P = 7, N = 1`: sup sigma of polydisc zeros 0.653 | grid 240^3 phases plus local refinement: `min abs(U)` is 2e-10 at sigma 0.652, 1.7e-3 at 0.654, 1.2e-2 at 0.66 | yes |
| DH `P = 7, N = 1`: 190 off-line zeros in the strip, `2 < t < 5002` | argument principle on `0.51 < sigma < 1`: 95 (190 with mirror images); same count with the left edge at 0.502 | yes |
| DH: 24 off-line zeros in `[1e5, 1e5 + 500]` | argument principle `sigma > 0.502`: 12; mpmath roots located: 12, residual 1e-26 | yes |
| zeta, same primes: 0 off-line | 0 in both ranges | yes |
| Sharpness of `2 pi M` | right-half off-line zeros in the last window below `2 pi M`: `M = 4`: 1 in `[22.6, 25.1]`; `M = 6`: 1 in `[33.9, 37.7]`; `M = 30`: 2 in `[169.6, 188.5]`; none above up to `3 * 2 pi M` | yes |

Additional facts found:

- In `2 < t < 5002` the DH truncation also has 6 zeros with `sigma > 1` (all below `t = 32`), so the
  whole-plane off-line count is 202, not 190. The note's 190 is the strip count, as labelled.
- At height 1e5 the off-line zeros of the DH truncation reach `sigma = 0.6904`, above the sup
  abscissa 0.653 of the Bohr piece. This is not a contradiction: zeros of `Phi` are solutions of
  `Theta = -1`, not zeros of `A`, and at `x = 0.19` the factor `(5t/2pi)^-x` is 0.12, not small.
  The Bohr piece has 19 zeros with `sigma > 0.5001` in that window against 12 right-half zeros of
  `Phi`. The sentence "zeros in the polydisc up to sigma 0.653" should not be read as a bound on
  the off-line zeros of the truncation.

## 3. Errors and overstatements

1. **Label mismatch (section 5 table, row 2).** "Off-line zeros near `Re s = 1` at every height
   (PROVED)" for full Euler factors. Section 3.1 remark 3 labels the same statement ARGUED, with
   the Rouche step not written out. The table entry should read ARGUED. The statement itself is
   plausible: `1/Theta` has a simple zero at each pole `1 + 2 pi i k/log p` with derivative of
   order `t^(1/2)`, so it takes the value -1 at distance of order `t^(-1/2)`.
2. **Proposition E(b) scope.** "Compatible only for `t < 157`" is the whole-plane regime
   `M <= t/2pi`. For zeros in the strip the note's own threshold is formula (1), which is much
   smaller than `2 pi M`. With (1), AFE-complete support and `t >= t_strip` are compatible for
   `t < 307.9` and again for `353.4 <= t < 402.1` (`M = 60`: `t_strip = 115.4`; `M = 420`:
   `t_strip = 353.4`; `M = 840`: 547 against 402). The qualitative conclusion is unchanged
   (`t_strip` grows at least like `4^(pi(Y) - pi(sqrt Y))`), but the number 157 does not describe
   the strip, and (1) is MEASURED, not proved, beyond `N = 1`.
3. **Verdict item 4 overreach.** "No argument that passes from finite-stage stability plus the
   functional equation to the limit can be valid; the limit step must use the size
   normalisation." By Proposition E(a) the truncations have no limit for zeta or for `E_a`, so
   `E_a` does not isolate what a limit step would need. What is established: Theorem A holds for
   `E_a` truncations, so the finite-stage statement carries no information about the zeros of
   the limit function. The second half of the sentence is an inference (ARGUED).
4. **Proposition E(a) is a sketch.** The amplitude statement is correct (PNT with error
   `O(x/log^2 x)` is needed, not the bare PNT). The step from "phase at fixed `t` has unbounded
   oscillation with steps tending to 0" to "zeros do not converge" needs a lower bound on the
   `t`-derivative of the phase, which is not given. Label should be PROVED for the phase,
   ARGUED for the zeros.
5. **Attribution.** Gonek's 2012 model is `P_X(s) + chi(s) conj P_X(conj s)`, whose quotient has
   modulus `abs(chi)` and is on the line trivially; it is not the reflection `A(1-s)` used here.
   Spira's functions are the right antecedent. No novelty is claimed for Theorem A, so nothing
   depends on this.
6. **Proposition C novelty.** The statement that a Gaussian pair factor with non-negative
   couplings preserves the Lee-Yang property is the Lieb-Sokal theorem (and Newman 1974 for
   one-component models); the note labels the content CLASSICAL, which is right. Item (iv) of
   the "new" list is a restatement of that theorem for the rank-one form
   `c (sum a_p log p)^2`. It concerns the Dirichlet polynomial, not the completed function
   (the note says this).
7. **Structural remark in 4.2.** The "130.5 of 148.3 degrees" count treats the target ratio as
   unimodular, which holds on the unit torus only. It is a heuristic for why `P = 7` is the first
   unstable stage in depth 1; the proved part is `P = 3`, the measured part is `P = 7`. `P = 5`
   is absent because `chi(5) = 0`.

## 4. Controls

- DH: fails at stability of the Bohr piece (sum of two products). Reproduced. The same
  structure is absent for zeta with the same primes (0 off-line zeros, and the zeta piece has
  no zeros in the half-plane `sigma > 0`). DH is stable at `P = 2` and `P = 3` in depth 1, so the
  separation starts at a finite stage and is not present at every stage; the note states this.
- Backward heat: failure shown for the Bohr piece (antiferromagnetic coupling). The completed
  backward-heat truncation was not run by the author or by this referee.
- `E_a` (`a < 1/2`), sign twists, Beurling: pass Theorem A. The note reports this as the
  reason the route stops. Consistent with row EA of the map (size normalisation).
- T-NR row: not run by the author; not checked here.

## 5. Cited theorems against hypotheses

- Rudin's lemma: used for a polynomial with no zeros on the closed polydisc and real
  coefficients; hypotheses met.
- Lee-Yang (lattice-gas form): pair weights `abs(beta_pq) <= 1`, conclusion non-vanishing when
  all activities are inside or all outside the unit circle. Applied with
  `beta_pq = e^(-c log p log q)` and activities `z_p p^(c log M)`; hypotheses met for `c >= 0`,
  depth 1.
- Polya-de Bruijn: applied to a finite product of sine ratios (Laguerre-Polya class, order 1);
  hypotheses met.
- Hadamard three-circles in several variables: domain is a logarithmically convex Reinhardt
  domain; hypotheses met.
- Borcea-Branden, Newman, Rallis, Kohnen-Zagier, Hodge-Riemann, Branden-Huh: not invoked by any
  step of the note. "Stability in the Borcea-Branden sense" is used only for products of
  one-variable polynomials, where it is elementary.

## 6. Surviving claim

For ladder truncations with support the divisors of `M` and a Bohr piece with no zeros on the
closed polydisc, `Theta = chi M^(s-1/2) I_M` with `I_M` inner, and all zeros with
`abs(t) >= 2 pi M (1 + O(t^-2))` are on the line (mechanism of Spira; Stirling constant checked
numerically). Rung insertion multiplies `Theta` by a factor of mean log-modulus 0 on each torus
`0 < x < 1/2` that exceeds 1 somewhere. Heat deformation of the Bohr piece is a Lee-Yang system
for `c >= 0` with zeros on `Re s = c log M`. Sharp theta cuts fail dominance. The DH truncation
with primes {2, 3, 7}, depth 1, has an unstable Bohr piece (sup sigma 0.653) and 190 strip
off-line zeros in `2 < t < 5002`, 24 in `[1e5, 1e5 + 500]`, against 0 for zeta; it is stable at
`P = 3`. The finite-stage theorem holds equally for `E_a` and sign twists, the truncations have
no limit at fixed height, and the whole-plane Lee-Yang regime is compatible with AFE-complete
support only for `t < 157` (strip regime under the measured formula (1): `t < 402`). The route
gives a restatement of wall 5.4 and no bound.
