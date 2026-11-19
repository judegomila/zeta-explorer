# c6-square-intertwiner-weyl: square realisations of Q_L with a point-spectrum intertwiner

Date: 2026-11-18. Lane kind: combine (squares no-go + spinor square root + metaplectic spectrum).
Nothing here proves or refutes RH and no bound moves. Labels: PROVED (derived in this file from the
cited inputs), CLASSICAL (standard theorem, cited), RECALLED (literature or project notes, not
re-read; no online search was run), MEASURED (float), OPEN.

## Verdict

**Precise obstruction (a narrower no-go). No class survives the first test with R1 intact. Score
does not rise.**

1. The lead is not new to the repository: `push/res-point-spectrum-square` (2026-11-17, refereed
   with corrections) ran the same selected step. STRATEGY.md line 80 ("never run") is stale on this
   point. This lane consolidates that work with its referee corrections into one row per class and
   adds four items (2 to 5).
2. NEW (Theorem H2, PROVED from CLASSICAL inputs). The class "U a function of Hecke operators" is
   closed for every fixed continuous rule in one direction and every fixed polynomial rule of
   degree at most 4 in the other:
   (a) no cusp form on GL_2 over Q has `lambda_p = psi(p^(-i gamma))` for all p outside a finite
   set, for any real gamma and any continuous `psi` on the circle (this extends Theorem H of the
   earlier lane from Laurent polynomials to all continuous rules);
   (b) no cusp form has `P(lambda_p) = p^(-i gamma)` for all p outside a finite set with
   `gamma != 0` and P a fixed polynomial of degree at most 4 (this is the literal reading
   "U(log p) = P(T_p)"; continuous non-injective rules are conditional on symmetric-power
   functoriality in degree 5 and above).
   Both carry over to weight 1/2 on Gamma_0(4) and to compact quaternionic quotients through the
   Waldspurger and Jacquet-Langlands correspondences (RECALLED).
3. NEW (MEASURED, independent of the recalled table). A Hejhal-type residual scan for SL_2(Z)
   finds in [13.5, 14.7] exactly the parameters 13.7797513 (even) and 14.3585095 (odd), and no
   parameter in [6.6, 7.6]. So `gamma_1 = 14.134725` is neither `r_j` nor `2 r_j`. This closes the
   Casimir class for the two natural normalisations, including sub-selections, on SL_2(Z) and (by
   the Shimura correspondence, RECALLED) on the Kohnen plus space of weight 1/2 on Gamma_0(4).
4. NEW (caveat to the earlier Weyl table). "Full spectrum excluded by density" for `H = r` is
   unconditional only up to the multiplicity bound for the Casimir: the test compares distinct
   eigenvalues, and the unconditional multiplicity bound `O(R/log R)` leaves a count of order
   `R log R`, the same order as N(T). The exact test at `gamma_1` (item 3) does not have this gap.
5. Pivot (MEASURED): the residual the earlier referee left open (rank-one family for a functional
   outside L^2, here point evaluation on GL(1), density `|zeta(1/2+it)|^2`). The couplings needed
   by the first 15 zeros range over F = -10.55 ... +18.44 (mean 4.56, near `pi^2/2`). One member
   does not carry the zeros. The family is Euler-blind in any case (it holds verbatim for DH).

What remains outside every no-go is exactly the class with a free Borel rule, which exists iff RH
(Theorem V of the earlier lane) and so gives no lever.

## 0. Plan and relation to closed rows

Selected step (STRATEGY.md 4.2 lead 7): decide whether `Q_L(f) = ||U f||^2` can hold with `U`
intertwining to a point spectrum in the classes the squares no-go does not cover; first test the
Weyl law of the candidate spectrum against `N(T) = (T/2 pi) log(T/2 pi e) + 7/8 + S(T) + O(1/T)`.

Read: `ap-squares-rallis` RESULT + REFEREE (row A3), `res-point-spectrum-square` RESULT + REFEREE,
`g-spinor-square-root` (row G6), `h-hecke-torus-symmetry` / `h-metaplectic-spin` (rows G14, G18),
`h-hecke-channels` (row G16), SYNTHESIS_AUTOMATIC_POSITIVITY.md, the controls section of
OBSTRUCTION_MAP.md.

New here against those: Theorem H2 (continuous and "U = function of T_p" rules); the independent
spectral scan at `gamma_1`; the multiplicity caveat; the non-L^2 rank-one numerics; the statement
that the spinor square root is the same Hilbert space and the same Hecke rule; one map row per
class.

## 1. Lemma 1: what the existing no-go covers

Notation: `E^` the shift-closed exponential test class, `S_a` the shift, `Q = Q_L`. A covariant
square is a linear `Theta: E^ -> X` (Hilbert) with `||Theta v||^2 = Q(v)` and
`Theta S_a = U(a) Theta` for a unitary one-parameter group `U`.

**Lemma 1 (assembly of refereed statements).**

(a) (A3 Theorem 1, refereed, with the density repair.) If a covariant square exists then RH holds,
the cyclic span of `Theta(E^)` is `l^2` on the zeros, `Theta v = (sqrt(m_gamma) V(i gamma))_gamma`
and `U(a)` is diagonal with entries `e^(-i a gamma)`. A covariant square is a Hilbert-Polya space.

(b) Covered by A3 Corollary 2 (mixing): `U` = right translation by a one-parameter subgroup with
non-compact image on `L^2(Gamma\G)` minus the vectors fixed by a non-compact simple factor
(Howe-Moore), including the metaplectic group; `L^2` of the idele class group; Eisenstein wave
packets of integral and half-integral weight.

(c) Not covered by A3 (A3 referee, section 2 item 1): (C1) `U` a function of Hecke operators on the
cuspidal and residual parts; (C2) `U` a function of the Casimir there; (C3) `U` a compact
one-parameter subgroup or a target group compact at infinity. Also reducible lattices and groups
with compact factors.

(d) Covered since then by `res-point-spectrum-square` (statements its referee confirmed):
- Theorem V: with a free Borel function `g` of commuting self-adjoint operators having infinitely
  many joint eigenvectors with distinct joint eigenvalues, a covariant square exists iff RH.
- Theorem H for GL_2: no realisation with `U(log p) + U(log p)^* = T_p` (or any fixed
  Laurent-polynomial rule) in the discrete spectrum; weight 1/2 through Waldspurger, quaternionic
  through Jacquet-Langlands (RECALLED); GL_n, n >= 3, only after the two referee repairs.
- Proposition C: no realisation with spectrum in `omega (Z + c)`.
- Weyl table (re-computed by the referee).
- Not established there (referee): any step separating zeta from DH. The pseudo-Laplacian square
  (Proposition P) realises `Z_a`, not `xi`; its claimed DH failure was not observed (all DH
  twin-sum zeros found on the line), and its positivity explanation was false as written.

(e) Left open there: rules that are not a fixed Laurent polynomial; Casimir-only covariance with a
sub-selection; compact tori of rank at least 2 without a Hecke rule; rank-one families for
functionals outside L^2.

**Lemma N (nesting, PROVED from strong multiplicity one, CLASSICAL).** On the cuspidal spectrum of
a congruence quotient of GL_2 the system of Hecke eigenvalues outside any finite set determines the
newform, hence the Casimir eigenvalue. So the Casimir is a Borel function of the Hecke operators,
class C2 is contained in class C1 with a free rule, and the only content of either class is the
rule that fixes `g`. Three cases: a fixed arithmetic rule at the primes (section 2), a fixed
regular function of the Casimir (section 3), a free rule (Theorem V: equivalent to RH).

**Spinor square root.** `H_c = (Gamma_+ Q A)^* (Gamma_+ Q A)` under RH, and unconditionally
`H_c = alpha sum_gamma y_gamma conj(y_gammabar)` (row G6). The coordinate map
`v -> (<y_gamma, v>)_gamma` lands in `l^2` on the zeros: the same Hilbert-Polya space as (a), with
the window `c` in place of covariance. On it `V_p` acts as `diag(p^(-rho))` up to a window term
(`h-hecke-torus-symmetry` item 6; `V_p^* H_c V_p = p^(-1) H_(c + 2 log p)`). So the Hecke rule
carried by the spinor root is the monomial rule `p^(-i gamma)` on the zero module, which is the
case `psi(z) = z + conj z` of Theorem H2(a) once `T_p = V_p + V_p^*` is formed. The combination
adds no class beyond C1.

## 2. Class C1: U a function of Hecke operators

### 2.1 First test (counting)

| Generator | Spectrum | Against N(T) | Outcome |
|---|---|---|---|
| `g(T_p1, ..., T_pk)`, `g` continuous, finitely many primes | bounded: `abs(lambda_p) <= p^(7/64) + p^(-7/64)` (Kim-Sarnak, CLASSICAL) | zeros unbounded | closed: main term |
| rule `T_p = psi(U(log p))`, `psi` continuous | eigencharacter of gamma is `p -> psi(p^(-i gamma))` | not a counting question | closed by Theorem H2(a) |
| rule `U(log p) = P(T_p)`, deg P <= 4 | eigencharacter `P(lambda_p) = p^(-i gamma)` | not a counting question | closed by Theorem H2(b) |
| free Borel rule | any countable set | passes trivially | exists iff RH (Theorem V) |

The counting test decides only the first row. For the rule classes the decisive test is the exact
one below, which uses all primes.

### 2.2 Theorem H2

Setting. `X` = cuspidal spectrum of `L^2(Gamma_0(N)\G)`, `G = SL_2(R)`, any level, finite-order
nebentypus; `T_p` normalised so that Ramanujan reads `abs(lambda_p) <= 2`; `S` a finite set of
primes containing the divisors of `N`. By Lemma 1(a) a covariant square with range in `X` gives,
for each zero ordinate gamma, a unit vector `u_gamma in X` with
`U(log p) u_gamma = p^(-i gamma) u_gamma`.

**Theorem H2 (PROVED from CLASSICAL inputs).**

(a) Let `psi` be continuous on the unit circle. There are no cuspidal Hecke eigenform `f` and real
`t` with `lambda_p(f) = psi(p^(-i t))` for all `p` outside `S`. Hence there is no covariant square
in `X` with `T_p = psi(U(log p))` on the range for `p` outside `S`.

(b) Let `P` be a polynomial of degree at most 4 with coefficients independent of `p`. There are no
cuspidal Hecke eigenform `f` and real `t != 0` with `P(lambda_p(f)) = p^(-i t)` for all `p`
outside `S`. Hence there is no covariant square in `X` with `U(log p) = P(T_p)` for `p` outside
`S`. For `phi` continuous and injective on the Hecke spectrum the rule `U(log p) = phi(T_p)` is
case (a) with `psi = phi^(-1)`.

Proof of the reduction. The joint eigenspace of the commuting family (`T_p` in (a), `P(T_p)` in
(b), `p` outside `S`) containing `u_gamma` is a sum of joint eigenspaces of `{T_p}`, each
finite-dimensional and spanned by forms attached to one newform (strong multiplicity one,
Jacquet-Shalika). So some Hecke eigenform `f` satisfies the stated relation with `t = gamma`.

Proof of (a). Put `A(sigma) = sum_{p not in S} abs(lambda_p)^2 p^(-sigma)`. Rankin-Selberg:
`L(s, f x conj f)` has a simple pole at `s = 1`; the prime-power terms of its logarithm converge
absolutely near `Re s = 1` (Kim-Sarnak exponent 7/64 < 1/4). So
`A(sigma) = log(1/(sigma - 1)) + O(1)` as `sigma -> 1+`. Given `eps > 0` choose a trigonometric
polynomial `tau(z) = sum_{abs(k) <= K} c_k z^k` with `sup abs(psi - tau) <= eps` (Weierstrass). Then

    A(sigma) = sum_p conj(lambda_p) psi(p^(-it)) p^(-sigma)
             = sum_k c_k sum_p conj(lambda_p) p^(-sigma - i k t) + R,
    abs(R) <= eps sum_p abs(lambda_p) p^(-sigma) <= eps (A(sigma) sum_p p^(-sigma))^(1/2) <= eps (log(1/(sigma-1)) + O(1)).

Each inner sum equals `log L^S(sigma + i k t, conj f)` plus a function holomorphic near `Re s = 1`,
and `L(s, conj f)` is holomorphic and non-vanishing on `Re s = 1` (Jacquet-Shalika; for GL_2 the
classical argument). So the finite sum over `k` is bounded as `sigma -> 1+`, including `k = 0`.
This gives `log(1/(sigma-1)) (1 - eps) <= O_eps(1)`, false for `eps < 1`. QED.

The step that uses cuspidality is the boundedness of `sum_p lambda_p p^(-s)` on `Re s = 1`. For
`E(., 1/2 + it)`, `lambda_p = 2 cos(t log p)`, that sum has logarithmic singularities at
`s = 1 +- it` and the argument gives no contradiction, as it must.

Proof of (b). Write `P(x) = sum_{i=0}^{4} b_i U_i(x)` in Chebyshev polynomials of the second kind,
so `U_i(lambda_p) = a_p(sym^i f)`. For `1 <= i <= 4`, `sym^i f` is an isobaric automorphic
representation of `GL_(i+1)` (Gelbart-Jacquet, Kim-Shahidi, Kim; CLASSICAL), and
`sum_p a_p(sym^i f) p^(-s) = log L^S(s, sym^i f) + (holomorphic for Re s > 1/2 + 4 . 7/64 = 0.9375)`.
An isobaric L-function is holomorphic and non-vanishing on `Re s = 1` except for poles at
`s = 1 - i t_0` from constituents `abs(.)^(i t_0)` (Jacquet-Shalika). One-dimensional constituents
of `sym^i f`, `i <= 4`, occur only for dihedral, tetrahedral or octahedral `f`. In the last two
cases `f` is of Artin type and the constituents have finite order. In the dihedral case
`f = Ind chi`, a one-dimensional constituent `nu` of `Ind(chi^a chi^(sigma b))` restricts to the
quadratic field as `(chi chi^sigma)^b chi^(a-b)`; `chi chi^sigma` and the restriction of `chi` to
the ideles of Q have finite order because the central character has, so `nu = nu_0 abs(.)^(i t_0)`
forces `t_0 = 0`. Hence `D(s) = sum_{p not in S} P(lambda_p) p^(-s)` has, on `Re s = 1`, a
singularity at most at `s = 1`. But `D(s) = sum_p p^(-s - it) = log zeta(s + it) + (holomorphic)`,
unbounded as `s -> 1 - it`, and `t != 0`. Contradiction. QED.

Extension to continuous non-injective `phi`: the same proof with polynomial approximation needs
`L(s, sym^k f)` holomorphic and non-vanishing at `1 - it` for all `k`. Known for holomorphic
non-CM forms (Newton-Thorne, RECALLED) and for CM forms (direct); for Maass forms it is OPEN for
`k >= 5`. So for Maass forms the continuous case of (b) is conditional.

Transfers (RECALLED, as in the earlier lane): weight 1/2 on `Gamma_0(4)` with `T_(p^2)`
(Waldspurger; no cuspidal one-variable theta series at trivial character); compact quaternionic
quotients (Jacquet-Langlands). Residual lines: there `lambda_p = p^(1/2) + p^(-1/2)` is unbounded
in `p`, while a continuous `psi` on the circle is bounded, so (a) holds; and
`P(p^(1/2) + p^(-1/2))` is unimodular for all `p` only if `P` is a unimodular constant `c`, and
then `p^(-it) = c` for `p = 2, 3` and `p^2 = 4` forces `c = 1` and `log 3 / log 2` rational. Covers of degree `n >= 3`
(Kubota cubic, sextic): the correspondence of Flicker sends genuine cuspidal data with parameters
`(a, b)` to `GL_2` data with `(a^n, b^n)` (RECALLED, not re-read), which reduces the rule
`p^(-i gamma)` to the rule `p^(-i n gamma)` on `GL_2`; conditional on that citation.

Not covered by H2: rules whose coefficients depend on `p`; rules depending on the eigenvector;
free Borel rules (Theorem V).

## 3. Class C2: U a function of the Casimir

### 3.1 First test (Weyl laws)

`H = g(r)`, `r = sqrt(lambda - 1/4)`. Target: `(T/2 pi) log(T/2 pi e)`.

| Space | Counting law of `r` (label) | `H = c r`: count below T | Against N(T) | Outcome |
|---|---|---|---|---|
| Maass cusp forms, SL_2(Z) | `R^2/12 - (2R/pi) log R + O(R)` (CLASSICAL, Selberg) | `T^2/(12 c^2)` | main term: power 2 against `T log T` | full spectrum closed subject to 3.2; sub-selection: exact test 3.3 |
| weight 1/2, Gamma_0(4), all forms | `R^2/2 + O(R log R)` (area `2 pi`; RECALLED for weight 1/2) | `T^2/(2 c^2)` | main term | same |
| weight 1/2, Kohnen plus space, `H = 2r` | equals the SL_2(Z) list (Shimura correspondence `r_(1/2) = r_0/2`; Katok-Sarnak, Baruch-Mao; RECALLED) | `T^2/12` | main term | same; sub-selection reduces to SL_2(Z) |
| compact quaternionic quotient | `(area/4 pi) R^2 + O(R/log R)` (CLASSICAL) | `(area/4 pi c^2) T^2` | main term; no `R log R` term | same |
| dihedral Maass forms of one real quadratic field | arithmetic progression `r = pi k / log eps_K` (CLASSICAL, Maass) | `(log eps_K / pi c) T` | log factor missing | closed, also by Proposition C |
| any of these, `H = c Delta` | - | `(area/4 pi c) T` | log factor missing | closed including sub-selections |
| any of these, `H = c r^a` | - | `kappa (T/c)^(2/a)` | never `T log T` | full spectrum closed for `a < 1` and `a >= 2`; `1 <= a < 2` subject to 3.2 |
| cubic or sextic cover over Q(omega) (hyperbolic 3-space) | `c_3 R^3` (CLASSICAL Weyl law in dimension 3) | `c_3 (T/c)^3` | main term: power 3 | same |

No row has both the main term and the log factor. A `T log T` law would need
`H ~ (area/2) lambda / log lambda`, which is not a rule fixed by the geometry.

### 3.2 Caveat on the density test (PROVED observation)

By Lemma 1(a) the eigenvalues of the generator on the cyclic span are the distinct ordinates, each
once. A full-spectrum realisation therefore needs "number of distinct `g(r_j)` below T" to equal
"number of distinct ordinates below T", not the count with multiplicity. The unconditional bound
for the multiplicity of a Laplace eigenvalue on a finite-area surface is `O(R/log R)` (RECALLED),
so the distinct count `D(R)` is only known to satisfy `c' R log R <= D(R) <= (area/4 pi) R^2`.
The number of distinct ordinates below T is `>> T log T` unconditionally (a positive proportion of
zeros is simple) and at most N(T). For `H = c r^a` put `R = (T/c)^(1/a)`:
`a < 1`: `D >= c' R log R` exceeds N(T), closed unconditionally; `a >= 2`: `D <= (area/4 pi) R^2 = O(T)`,
short by the log factor, closed unconditionally; `1 <= a < 2`: the two bounds straddle N(T), so the
density test closes the full spectrum only if multiplicities are `o(R^(2-a)/log R)` (expected:
bounded; not proved). The earlier table's "full spectrum excluded" for `H = r` is conditional in
this sense. The exact test below does not depend on multiplicities.

### 3.3 Exact test at the first zeros (MEASURED)

A realisation needs every ordinate to be a value `g(r_j)`. One failure closes the pair
(space, g), sub-selections included.

`hejhal_scan.py` (this directory; `scripts/memcap.sh 8`, single process, 666 s, largest array
24 x 12 floats): expansion `sum_{n <= M} a_n sqrt(y) K_(ir)(2 pi n y) cs(2 pi n x)`, automorphy
imposed on two horocycles `Y = 0.30, 0.25` at `Q` points each, least-squares residual with
`a_1 = 1`. Off the spectrum the relative residual is of order 0.5 to 0.9; at a parameter it drops
below `1e-7`.

| Window | step | (M, Q) | parameters found (residual) | recalled value |
|---|---|---|---|---|
| [6.6, 7.6] | 0.02 | (8, 24) | none (grid minimum 0.53) | none below 9.5337 |
| [13.5, 14.7] | 0.01 | (8, 24) | 13.7797513 even (4e-9); 14.3585095 odd (2e-8) | 13.7797513519, 14.3585095182 |
| [20.0, 21.6] | 0.01 | (10, 28) | 20.1066947 odd (3e-10); 21.3157959 even (1e-8); 21.4790576 odd (3e-8) | 20.1066946840, 21.3157959402, 21.4790575447 |
| [24.8, 25.2] | 0.005 | (11, 30) | 25.0508548 odd (2e-8) | 25.0508548 |

| r | residual even | residual odd | reading |
|---|---|---|---|
| gamma_1 = 14.134725 | 0.718 | 0.774 | not a parameter |
| gamma_1 / 2 = 7.067363 | 0.896 | 0.560 | not a parameter |
| gamma_2 = 21.022040 | 0.560 | 0.619 | not a parameter |
| gamma_3 = 25.010858 | 0.556 | 0.207 | not a parameter; nearest is 25.0508548 at distance 0.0400 |

Consequences. On SL_2(Z): `g(r) = r` and `g(r) = 2r` are closed (`gamma_1` is not a value; for
`2r` it lies below the bottom of the spectrum). On the Kohnen plus space of weight 1/2 with the
Shimura normalisation these are the generators `2 r_(1/2)` and `4 r_(1/2)`, closed by the same two
facts. The scan is a float computation with a grid; it is evidence at the level of the residual
gap (seven orders of magnitude), not a certificate. Certified lists exist (Booker, Strombergsson,
Venkatesh; RECALLED).

Not closed by this test: a one-parameter family `g(r) = c r` with `c` outside {1, 2} (needs
`gamma_1/c` and `gamma_2/c` both in the list: a countable coincidence set, no theorem); levels
above 1 (lists not computed here); free `g` (Theorem V).

## 4. Class C3: groups compact at infinity

| Case | Spectrum of the generator | Against N(T) | Outcome |
|---|---|---|---|
| fixed level and weight | finite-dimensional | zeros infinite | closed |
| rank one at infinity (definite quaternion algebra, all weights; any closed one-parameter subgroup) | contained in `omega (Z + c)`: at most `T/omega + 1` values below T | distinct ordinates below T are `>> T log T` (a positive proportion of zeros is simple, CLASSICAL): log factor | closed (also Proposition C, by the jump set at `log 2, log 3, log 4`) |
| rank `r >= 2`, generic direction, all weights | dense pure point, contained in a subgroup of R of rank `r`; no counting function | no Weyl law to compare | not decided by counting; reduces to "all ordinates lie in a finitely generated subgroup of R" (OPEN; soft statistics of zeros cannot decide it since such a subgroup is dense) |
| rank `r >= 2` with a Hecke rule as in section 2 | - | - | closed by Theorem H / H2 after transfer to GL_n (Jacquet-Langlands type transfers; RECALLED, conditional on the transfer for groups other than inner forms of GL_n) |

The open rank `>= 2` case has no Hecke input, so it carries no R1 and is outside the scoring
condition of this lane.

## 5. Second test

No class reaches the second test with R1: every version in which `U` is tied to Hecke operators by
a fixed rule is closed in section 2, and the versions that pass counting (free rule; rank `>= 2`
torus) contain no multiplicative step.

For completeness, the objects that do pass the counting test (earlier lane, with its referee's
corrections) and where each stands:

| Object | Counting | R1 step | DH | Status |
|---|---|---|---|---|
| exotic spectrum of the pseudo-Laplacian | `(T/2 pi) log(aT/2 pi e) + O(log log T)` | primes enter through the scattering function | failure at a named step NOT observed (referee: all DH twin-sum zeros on the line for `abs(Im s) < 50`) | realises `Z_a`, not `xi`; no R3 |
| zeros of `K_(it/2)(2 pi)` (Liouville operator with a wall) | same main term, remainder `O(1)` | none | - | no primes |
| de Branges space of `Xi - i alpha Xi'` | exact | none beyond the definition | defined for DH as a Krein space | exists iff RH |
| rank-one family, L^2 functional | each on-line zero for its own coupling, `alpha(gamma) ~ gamma/m_0` | none | holds verbatim | Euler-blind |

## 6. Pivot (one, as allowed): rank-one family for a functional outside L^2

Source: residual 2 of the earlier lane and its referee's remark that Theorem R(c) uses exponential
decay and does not transfer to point evaluations. The GL(1) model of a point evaluation is the
density `rho(t) = abs(zeta(1/2+it))^2` (not integrable; mean `log(t/2 pi) + 2 gamma_E`). By
Aronszajn-Donoghue with one subtraction, an on-line zero gamma is an eigenvalue of exactly the
member with coupling `alpha = -1/F(gamma)`,
`F(E) = 2E PV int_0^inf rho(t) dt / (t^2 - E^2)`. One member carries all zeros iff `F` is constant
on the zeros.

Expected size: the mean density contributes `2E PV int_0^inf log t dt/(t^2 - E^2) = pi^2/2`
(the constant part of the mean contributes 0), so unlike the L^2 case the couplings do not grow.

MEASURED (`pivot_point_eval.py`; `scripts/memcap.sh 8`, single process, 350 s, one array of 1e5
floats; midpoint rule, step 0.02, cut at T = 2000 with the tail from the mean density; the cut at
T = 1000 changes the values by at most 1.7e-3):

| n | gamma_n | F(gamma_n) | alpha = -1/F |
|---|---|---|---|
| 1 | 14.134725 | +5.72696 | -0.1746 |
| 2 | 21.022040 | +1.84726 | -0.5413 |
| 3 | 25.010858 | +9.12060 | -0.1096 |
| 4 | 30.424876 | -0.47798 | +2.0922 |
| 5 | 32.935062 | +9.67788 | -0.1033 |
| 8 | 43.327073 | +15.23464 | -0.0656 |
| 9 | 48.005151 | -5.90822 | +0.1693 |
| 14 | 60.831779 | +18.43970 | -0.0542 |
| 15 | 65.112544 | -10.55394 | +0.0948 |

All 15 values are in `pivot_point_eval.log`. Mean 4.558 (`pi^2/2` = 4.935), spread 28.99. `F` is
not constant on the zeros and changes sign, so no single member of the family has the zeros as
eigenvalues, and the Friedrichs member (`F = 0`) has none of the first 15. Outcome: the pivot is
closed at this level; the structure is Euler-blind as before. Stop.

## 7. Controls

The new statements are no-go theorems about the target space. They do not depend on which function
supplies the ordinates.

| Control | Theorem H2 | Exact test 3.3 | Pivot section 6 |
|---|---|---|---|
| DH | holds verbatim for the on-line ordinates of DH (the statement is about cusp forms and any real t); no separation | same test applies; not run for DH ordinates | the family is defined for `abs(f_DH)^2`; earlier lane: holds verbatim |
| backward heat | same; the deformed ordinates are real numbers and the theorem excludes each | same | defined; no separation |
| sign twist, unimodular twist U | H2(a) holds for every real t, so no separation | same | density without symmetry; no separation |
| E_a, T-NR, Beurling, THIN, theta^w | same | same | not formulated |

So nothing in this lane distinguishes zeta from a control. The multiplicative step of H2
(Rankin-Selberg against the non-vanishing of cuspidal L-functions on `Re s = 1`) is a property of
the automorphic target, not of zeta. The only object with the eigencharacter of a zero is
`E(., 1/2 + i gamma)`, in the continuous spectrum, for zeta and for no control with an Euler
product over Q other than zeta itself; that is the content of the earlier Theorem H and is
unchanged.

## 8. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 multiplicativity essential | false (for an attack) | The no-go H2 uses all primes together (Rankin-Selberg, strong multiplicity one), but no realisation exists, so there is no attack in which it is used. |
| R2 height-uniform, every window | false | A covariant square would give it by construction (Lemma 1(a)); none was constructed short of RH. |
| R3 fails on every control for a structural reason | false | Section 7: the new statements hold for the controls alike; the earlier claimed DH failure of the pseudo-Laplacian square was not observed. |
| R4 reaches the critical line | false | The only existing squares are for `Z_a` (edge `Re s = 1`) and the RH-equivalent de Branges / Krein spaces. |

Not a statement about zeros of zeta.

## 9. Map rows (one per class, for OBSTRUCTION_MAP.md section 3.1 or 3.2; not edited by this lane)

| Row | Structure | Result | Status | Controls | Source |
|---|---|---|---|---|---|
| A3-C1 | Covariant square of Q_L with U tied to Hecke operators on a cuspidal (or metaplectic cuspidal) spectrum | No realisation for any fixed continuous rule `T_p = psi(U(log p))`, nor for `U(log p) = P(T_p)` with deg P <= 4 (all continuous `phi` conditional on sym^k functoriality, k >= 5, for Maass forms). Finitely many primes with continuous g: bounded spectrum. Free Borel rule: exists iff RH. | PROVED from CLASSICAL (GL_2); weight 1/2, quaternionic, n-fold covers from RECALLED correspondences | none separated (statement about the target, any real t) | `c6-square-intertwiner-weyl` sec. 2; `res-point-spectrum-square` Thm H, V |
| A3-C2 | Same with U a function of the Casimir | Weyl laws: `R^2` (surfaces), `R^3` (cubic/sextic covers over Q(omega)), linear (dihedral families, `c Delta`); none is `T log T`. Full-spectrum exclusion for `H = c r^a`, `1 <= a < 2`, depends on Casimir multiplicities. Exact test: `gamma_1` is neither `r_j` nor `2 r_j` on SL_2(Z) and the weight-1/2 plus space. Free g: iff RH. | Weyl laws CLASSICAL; exact test MEASURED | none separated | `c6-square-intertwiner-weyl` sec. 3 |
| A3-C3 | Same with a group compact at infinity | Fixed level and weight: finite-dimensional. Rank one: lattice spectrum, short by a log factor (and Proposition C). Rank >= 2 without Hecke rule: reduces to "ordinates in a finitely generated subgroup of R", OPEN, no R1. With a Hecke rule: row A3-C1 after transfer. | PROVED / OPEN as stated | none separated | `c6-square-intertwiner-weyl` sec. 4; `res-point-spectrum-square` Prop. C |
| A3-R | Rank-one family with a functional outside L^2 (GL(1) point evaluation, density `abs(zeta)^2`) | `F(gamma_n)` for n <= 15 ranges over [-10.55, 18.44]; no single member carries the zeros | MEASURED | Euler-blind (DH verbatim, earlier lane) | `c6-square-intertwiner-weyl` sec. 6 |

Correction for STRATEGY.md line 80: lead 7 was run on 2026-11-17 as `res-point-spectrum-square`.

## 10. Three weakest steps

1. **Theorem H2(b), the constituent analysis.** The claim that one-dimensional constituents of
   `sym^i f`, `i <= 4`, have finite order rests on the Kim-Shahidi classification (dihedral,
   tetrahedral, octahedral) as recalled, and on a short argument for the dihedral case written
   here and not checked against the literature. If a constituent `abs(.)^(i t_0)` with `t_0 != 0`
   could occur, (b) would fail for that form at `t = -t_0` only. H2(a) does not depend on this. The
   absolute convergence of prime-power terms uses the Kim-Sarnak exponent for `i <= 4`
   (`4 . 7/64 < 1/2`). Neither part has been refereed.
2. **Recalled correspondences and laws.** Waldspurger and Jacquet-Langlands transfers, the
   Flicker correspondence for covers of degree `n >= 3`, the Shimura normalisation
   `r_(1/2) = r_0/2` on the plus space, the weight-1/2 Weyl law, the three-dimensional Weyl law
   for the cubic and sextic quotients, the multiplicity bound `O(R/log R)`, Newton-Thorne. None
   was re-read; rows depending on them are marked.
3. **The exact test is a float scan.** Residual minimisation on a grid (steps 0.005 to 0.02) with
   two horocycles and truncation `M <= 11`; a parameter between grid points with a very narrow
   residual dip could in principle be missed, although every recalled parameter in the windows was
   found and the dips are wide compared with the grid in three of four windows (in [9.3, 9.8] the
   grid minimum 0.21 near 9.5337 did not pass the 0.05 threshold, which shows the limit of a 0.02
   grid). Only level 1 was scanned; levels 2 and 4 (needed for all weight-1/2 forms on Gamma_0(4))
   were not. The pivot numerics rest on a tail estimate from the mean density; the spread (29) is
   four orders above the truncation change (1.7e-3).

## Files

- `hejhal_scan.py`, `hejhal_scan.log`, `hejhal_scan.json`: section 3.3.
- `pivot_point_eval.py`, `pivot_point_eval.log`, `pivot_point_eval.json`: section 6.
- Both run from the repo root as `scripts/memcap.sh 8 .venv-arb/bin/python -u <script> <out.json>`.
  The compute server was not used.
