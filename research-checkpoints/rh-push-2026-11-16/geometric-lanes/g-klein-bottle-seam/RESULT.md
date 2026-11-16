# g-klein-bottle-seam: index theorem and mod-2 class of the loaded field on the Klein quotient

Date: 2026-11-16. Scope: PR 56 `klein_phase_transport.md` sections 3-7 (zero circulation, seam flux,
trapping, core/tail certificate). Nothing here proves or refutes RH.
Labels: PROVED (in this note), CLASSICAL, MEASURED (60-digit mpmath, not interval), OPEN.

## Verdict

**Precise obstruction, with a complete classification.**

1. The exact index theorem on the Klein quotient exists and is an integer identity (Theorem 1):
   `N_K = N_on + 2 N_right = (1/pi) * (arg change of F along the outer arc)`, and the seam flux is
   `pi * N_on`. So `N_right = (1/2pi) * (outer winding - seam flux)`.
2. Non-orientability does give a mod-2 invariant (Theorem 2). It is the torsion class in
   `H^1(K; Z^w) = Z + Z/2`. It equals the sign of `F` on the critical line (the Hardy Z sign) at the
   point where a one-sided loop crosses the seam. Its variation between two heights is
   `N_on mod 2 = N_K mod 2`. An off-line pair contributes 2, hence 0.
3. The pair `(N_K, seam sign)` is the complete set of topological invariants of a symmetric field on
   a window (Theorem 3). A configuration with `n` on-line zeros and a configuration with `n-2`
   on-line zeros plus one off-line pair are in the same path component. No index, twisted index,
   mod-2 class or characteristic class of the loaded field can separate them.
4. The quantity that does separate them is a signature, not a topological class: the windowed Weil
   form has `ind_- = N_right` (Theorem 4). This is the same form as the refereed eq48 target, so the
   Klein index theorem computes the negative index of that form; it does not bound it.
5. Under the heat flow the topological pair is constant, and it takes the same value before and
   after a pair lands on the line. The signature is monotone only in the forward direction
   (Theorem 5), so going down to `tau = 0` it permits pair creation.
6. Davenport-Heilbronn: the integer index detects its off-line pair (`N_K = 5`, `N_on = 3` on
   `81 < t < 89`); the mod-2 class does not (class 1 with the pair, class 1 after the pair lands at
   `tau* = 0.176505`). No step uses the Euler product, so by the DH wall no step can give RH.

The task hypothesis "off-line pairs contribute even, on-line zeros odd" is true and is exactly why
the mod-2 invariant fails: an even contribution is invisible mod 2.

## 0. Plan: what is new relative to the atlas and walls

- Atlas section 5 (PR 16, PR 19) already has the heat collision local index `-floor(m/2)` for
  `(h, h_x)` and the statement that the common index sign does not supply zero winding. Not re-run;
  used as an input in Theorem 5.
- PR 56 section 3 states that `j` is orientation-valued, that zero multiplicity stays nonnegative on
  `K`, and that the seam Green terms cancel. It does not state the count identity, the seam flux
  value, the torsion class, or a completeness statement. Those are Theorems 1-3.
- New here: the identification of the Klein torsion class with the Hardy sign, the completeness
  theorem `pi_0 = Z_{>=0} x Z/2`, the signature (Witt class) reading that ties the index defect to
  the eq48 Weil form, and a DH heat-flow run through an actual landing event.

## 1. Setup

`F` entire with `F(1-s) = F(s)`, `F(conj s) = conj F(s)`. Write `s = 1/2 + x + it`, `z = t - ix`,
`h(z) = F(1/2 + iz)`, real for real `z`. `iota(s) = 1 - conj(s)` fixes the critical line.

Geometry (zeta-view `docs/KLEIN-ANNULUS.md`): `E_r` with `D(u,v) = (1/2-u, 1-v)`,
`R(u,v) = (u, 1/2-v)`, `A = DR`, free. `K = E_r / A`, punctured at the image `p` of `p_+-`.
`f = F o s` satisfies `f o D = f`, `f o A = conj f`.

Facts used (CLASSICAL, read off the chart):

- `D` descends to `K`. Its fixed set on `K` is the seam `Sigma` (image of the two critical ovals,
  one circle through `p`) and the two interior branch points. `pi : K -> K/D = {Re s >= 1/2}` is
  2-to-1 on the interior, branched at two points, and a homeomorphism from `Sigma` to the line.
- An on-line zero is one point of `K` (on `Sigma`). An off-line pair `{rho, 1 - conj rho}` is two
  points of `K` (a `D`-pair in the open annulus).
- `f = U + iV` is a section of `E = R + o_K`. Then `o_E = o_K`, so `o_E (x) o_K` is trivial: the
  local zero index is a well-defined integer `m >= 1` (PR 56 section 3).

## 2. Theorem 1 (integer index theorem and seam flux). PROVED (argument principle; CLASSICAL content)

Let `Omega` be a compact region in `{x >= 0}` whose boundary is a segment `I = [t1, t2]` of the line
and an arc `C` in `x > 0` from `1/2 + i t1` to `1/2 + i t2`, with `F != 0` on `C` and its endpoints.
Let `Omega_K = pi^{-1}(Omega)`. Count zeros with multiplicity. Then

    N_K(Omega_K) = N_on(I) + 2 N_right(Omega) = (1/pi) * Delta_C arg F,            (1.1)
    seam flux:   lim_{a -> 0+} int_I Re (F'/F)(1/2 + a + it) dt = pi * N_on(I),     (1.2)
    N_right(Omega) = (1/2pi) * ( Delta_C arg F - pi * N_on(I) ).                    (1.3)

Proof. `Omega u iota(Omega)` is a region with boundary `C` followed by `iota(C)` reversed. Since
`F o iota = conj F` and `iota` reverses orientation, both halves contribute the same argument change,
so `2 Delta_C arg F = 2 pi (N_on + 2 N_right)`. On `K`, `pi^{-1}(C)` is a closed two-sided curve
(the arc and its `D`-image) and `oint j = 2 Delta_C arg F`, while `Omega_K` contains each on-line
zero once and each right zero twice; this gives (1.1). For (1.2): `Re F'/F` vanishes on the line away
from zeros (F is real there; equivalently the terms of `rho` and `1 - conj rho` cancel), and an
on-line zero of order `m` contributes `m a / (a^2 + (t - gamma)^2) -> pi m delta_gamma`. (1.3) is
(1.1) minus (1.2). QED.

Remarks.
- The seam carries the entire on-line count as a flux; cutting `K` along `Sigma` gives the annulus
  whose two boundary copies each carry `pi N_on`. This is the nonzero companion of the PR 56 sewing
  identity (the Green terms `u d_n u` cancel across the seam; the flux of `j` does not).
- (1.3) is Backlund's count minus Hardy's count. `N_right >= 0` always; RH is `N_right = 0` for all
  windows. The identity gives no sign information beyond that.

## 3. Theorem 2 (the mod-2 class). PROVED

For a one-sided loop `gamma` in `K` minus zeros minus `p`, lift it to a path in `E_r` from `y` to
`A y`, let `theta` be a continuous argument of `f` along it, and set

    k(gamma) = (theta(Ay) + theta(y)) / (2 pi)  mod 2.

(a) `k` is well defined in `Z/2`: `f(Ay) = conj f(y)` gives `theta(Ay) + theta(y) in 2 pi Z`; another
    lift of `theta` shifts the sum by `4 pi n`; moving the base point along the loop by a segment
    `sigma` adds `Delta_sigma theta` at the start and `Delta_{A sigma} theta = -Delta_sigma theta` at
    the end; reversing direction keeps the sum.
(b) `k` is constant under homotopy of `gamma` avoiding zeros, and changes by `m mod 2` when `gamma`
    crosses a zero of order `m` (the end value of `theta` moves by `+-2 pi m`, the start is fixed).
(c) If `gamma` crosses `Sigma` once, at height `t`, then `pi o gamma` is a closed loop in
    `{x >= 0}` based at `1/2 + it`, and
    `k(gamma) = [F(1/2 + it) < 0] + n(gamma)  mod 2`,
    where `n(gamma)` is the number of zeros enclosed by `pi o gamma`, counted with multiplicity and
    winding number. Proof: base the lift on the seam; `theta(y) = theta_0 in pi Z` with
    `theta_0 / pi = [F < 0] mod 2`; `f = F o s` gives `theta(Ay) = theta_0 + 2 pi n`.
(d) For two such loops at heights `t1 < t2` enclosing no zeros,
    `k(gamma_2) - k(gamma_1) = N_on(t1, t2) = N_K(region between) mod 2`.

Identification. `H^1(K; Z^w) = H_1(K; Z) = Z + Z/2` (twisted Poincare duality, CLASSICAL). For
zero-free equivariant phase fields `phi : E_r -> S^1`, `phi o A = conj phi`, the `v`-winding is forced
to 0, the `u`-winding is the `Z`, and the `Z/2` is `k`: it separates the constants `+1` and `-1`.
So the invariant that non-orientability adds is the sign of the real field on the seam. For `xi` it
is the sign of Hardy's `Z(t)` up to the fixed gamma sign.

What it can certify: a class change between `t1` and `t2` forces at least one on-line zero of odd
order between them. This is Hardy's sign-change argument. What it cannot certify: absence of
off-line pairs; by (b) each pair changes `k` by `2 = 0`.

## 4. Theorem 3 (completeness: there is no further topological invariant). PROVED

Let `U` be an open convex set in the `z`-plane, symmetric under `z -> conj z` (i.e. under `iota`),
and let `Fcal(U)` be the symmetric holomorphic functions on a neighbourhood of `closure(U)` with no
zero on the boundary, with the topology of uniform convergence. Then

    pi_0( Fcal(U) ) = Z_{>=0} x Z/2,   via   F -> ( N(U), sign F at a fixed boundary point on the line ).

In particular, for every `n >= 2` and every `k <= n/2`, a field with `n` on-line zeros and a field
with `n - 2k` on-line zeros and `k` off-line pairs lie in one path component.

Proof. Zeros in `U` form a divisor of degree `n = N(U)` invariant under conjugation. Its monic
polynomial `q` has real coefficients. Then `F / q` is symmetric and zero-free on the simply connected
`closure(U)` neighbourhood, real on the line, so `F = +- q e^g` with `g` symmetric. Homotope `g` to 0
linearly. Fix a real point `c in U` and move the roots by `z_j -> c + lambda (z_j - c)`, `lambda`
from 1 to 0: roots stay in `U` (convexity), the divisor stays conjugation-invariant, and no root
reaches the boundary. Every field is thus joined to the normal form `+- (z - c)^n`; the sign is the
boundary sign up to the fixed factor `sign (b - c)^n` at the reference boundary point `b`. `N(U)` and
the boundary sign are locally constant (Hurwitz), so the map is a bijection on components. QED.

Consequence (PROVED). Any quantity that is locally constant on `Fcal(U)` is a function of
`(N_K, seam sign)`. This covers the integer index of Theorem 1, the twisted winding and torsion class
of Theorem 2, Stiefel-Whitney or Euler classes of `R + o_K` relative to the boundary field, and any
holonomy of `j`. None distinguishes on-line zeros from off-line pairs once `N_K` is fixed. The
on-line locus is the set of hyperbolic real polynomials: a closed semialgebraic chamber bounded by
the discriminant, not a union of components.

This sharpens PR 56 section 4 ("circulation conservation does not exclude the collision mechanism")
from one polynomial control to a classification.

## 5. Theorem 4 (the separating quantity is a signature; link to eq48). PROVED for finite windows

Let `Z` be the zeros in `U`, assumed simple, and on `C^Z` put the Hermitian form
`Q_Z(c) = sum_{rho in Z} c_rho conj(c_{iota rho})`. An on-line zero gives `|c_rho|^2`; a pair gives
`2 Re(c_rho conj c_rho')`, a hyperbolic plane. Hence

    rank Q_Z = N_K,   signature Q_Z = N_on,   ind_-(Q_Z) = N_right = (1/2pi)(Delta_C arg F - seam flux).

With `c_rho = V(rho)` this is the windowed part of the refereed form
`Q_L(v) = sum_rho V(rho) conj V(-conj rho)` (eq48 Theorem 1; centered variable). So:

- In Witt-group terms the class of `Q_Z` in `W(R) = Z` is `N_on`; pairs are Witt-trivial. The task's
  "even/odd" statement is `signature = rank mod 2`. The mod-2 class of Theorem 2 is this congruence.
- RH is `signature = rank` for all windows, i.e. definiteness. Definiteness is not locally constant
  on `Fcal(U)` (Theorem 3), so it cannot be read from the Klein topology.
- The Klein index theorem is therefore consistent with eq48 and adds no margin: it evaluates the
  negative index of the same form. For the full form, `ind_-(Q_L) <= N_right(total)` is immediate
  from the decomposition; equality on the exponential test class is not needed here and is left OPEN
  (PR 50 Prop. 5 gives `>= 1` when `N_right >= 1`).

## 6. Theorem 5 (heat flow)

`d/dtau F = F''/4`, i.e. `d/dtau h = -h_zz / 4`. Fix a window `U`.

(a) PROVED. `(N_K, seam sign)` is constant on any `tau`-interval on which no zero meets the boundary
    of `U`.
(b) PROVED (local normal form; atlas section 5 has the general index `-floor(m/2)`). At a double
    on-line zero `(t*, tau*)` with `h_tt != 0`: `h = (h_tt/2)[(t - t*)^2 - (tau - tau*)/2] + ...`, so
    the two zeros satisfy `(z - t*)^2 = (tau - tau*)/2`: off the line for `tau < tau*`, on it for
    `tau > tau*`. The Jacobian of `(t, tau) -> (h, h_t)` is `h_tt^2 / 4 > 0` in this order. Every
    interior event lowers `ind_-` by 1 in forward time and raises it by 1 in backward time.
(c) Consequence. The invariant that is constant down to `tau = 0` is `(N_K, sign)`; its value is
    produced equally by on-line zeros and by pairs (Theorem 3). The signature is not constant; it is
    nondecreasing in forward `tau` at interior events, so the all-real state at large `tau` gives no
    upper bound for `ind_-` at `tau = 0`. Excluding events on `0 < tau` in every box is the zero-winding
    boundary certificate of atlas section 5, which is where arithmetic input would have to enter and
    which the common index sign does not supply.

## 7. Davenport-Heilbronn control and zeta. MEASURED

`klein_index.py`, `collision.py` (mpmath, 60 digits; logs `run.log`, `collision.log`,
`klein_index_out.json`). DH: `Lambda(s) = (5/pi)^{s/2} Gamma((s+1)/2) f(s)`, period-5 coefficients
`(1, kappa, -kappa, -1, 0)`. Heat family
`h_tau(z) = 2 int_0^inf e^{tau u^2/4} Phi(u) cos(zu) du`,
`Phi(u) = 2 sqrt(pi/5) e^{3u/2} sum a_n n e^{-pi n^2 e^{2u}/5}`. The integral agrees with the direct
Hurwitz-zeta evaluation to relative `1e-27` or better at four points, including the off-line zero.
Window: `81 < t < 89`, `|x| < 1.5`. `N_K` from the sampled boundary argument (max phase step 0.10 rad).

| field | tau | N_K (winding) | N_on (sign changes) | N_right = ind_- | seam signs (t=81, 89) | Z/2 class |
|---|---:|---:|---:|---:|---|---:|
| xi (zeta) | 0 | 4.000 | 4 | 0 | -, - | 0 |
| DH | 0 | 5.000 | 3 | 1 | -, + | 1 |
| DH | 0.0869 | 5.000 | 3 | 1 | -, + | 1 |
| DH | 0.1652 | 5.000 | 3 | 1 | -, + | 1 |
| DH | 0.1826 | 5.000 | 5 | 0 | -, + | 1 |
| DH | 0.3478 | 5.000 | 5 | 0 | -, + | 1 |

- DH off-line zero at `tau = 0`: `s = 0.8085171825 + 85.6993484854 i`. The integer index (1.3)
  detects it: `(5 - 3)/2 = 1`.
- The pair lands on the line at `t* = 85.6175143940`, `tau* = 0.1765053782` (`h = h_t = 0` to
  `3e-29` relative to `h_tt`). Local law of Theorem 5(b): `x^2 / ((tau* - tau)/2) = 1.00043` at
  `tau* - 0.001`; `(t - t*)^2 / ((tau - tau*)/2) = 0.959` at `tau* + 0.001` (first-order drift of the
  centre accounts for the difference).
- `N_K` and the `Z/2` class are identical on both sides of the event. The class is 1 for DH with a
  pair present and 0 for zeta with none, which reflects only the parity of `N_K` in this window. The
  mod-2 class does not detect the pair; the signature does.

Where the Euler product would be needed: nowhere in Theorems 1-5. All hypotheses are the two
symmetries, which DH has. Hence, as required by the DH wall, none of these statements can imply RH,
and Theorem 3 shows this directly without appeal to DH.

## 8. Pivot (used once)

After the mod-2 route closed, the adjacent idea tried was the signature reading (Theorem 4): treat
the index defect `Delta_C arg F - seam flux = 2 pi ind_-` as the object and ask whether the Klein
structure gives it a sign-definite local density that could be forced to vanish. It is
`int_{Omega interior} Laplacian(log|F|) dA`, a positive measure supported on the right zeros. A
positive measure has no cancellation to exploit; proving it is zero is proving `log|F|` harmonic on
`x > 0`, which is RH. No further pivot.

## 9. Relation to the PR 56 frontier (A), (B)

- (A) Folding to `K` leaves `||T||` unchanged (PR 56 section 8). Theorem 3 gives the topological
  counterpart: folding adds exactly one bit, the seam sign, and that bit is blind to pairs.
- (B) The odd-sector sign `Delta_- <= 0` is a definiteness statement of the same form as Theorem 4.
  It is not implied by any class on `K`; it must come from the kernel (convexity of `V`) and,
  by the DH wall, from an arithmetic input beyond the symmetries.

## 10. Three weakest steps

1. Theorem 3 is stated for convex symmetric windows with fields holomorphic past the boundary. The
   global object on `K` has an essential puncture at `p`; a "global" invariant defined by a limiting
   or regularised procedure at `p` (not locally constant on windows) is outside the theorem. The
   theorem excludes window-local topological invariants, not regularised global functionals such as
   the Weil form itself.
2. Theorem 4 assumes simple zeros in the window and handles only the finite windowed form. The
   statement `ind_-(Q_L) = N_right(total)` on the eq48 exponential test class is not proved here.
3. Section 7 is 60-digit floating point with a sampled winding (step 0.02), not interval arithmetic.
   The integer values are stable (phase steps <= 0.10 rad), but they are measurements. The event
   location is a Newton solution, not an enclosure.
