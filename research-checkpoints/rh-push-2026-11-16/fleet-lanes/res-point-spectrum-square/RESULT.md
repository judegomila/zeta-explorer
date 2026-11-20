# res-point-spectrum-square: point-spectrum realisations of the Weil form

Date: 2026-11-17. Continues `ap-squares-rallis` (row A3). Nothing here proves or refutes RH and no bound
moves. Labels: PROVED (derived here), CLASSICAL (standard theorem, cited), RECALLED (literature or
project notes, not re-read), MEASURED (float), OPEN.

## Verdict

**Precise obstruction, narrower than A3, plus one realisation of the wrong function.**

The cases the A3 referee left open were: `U` a function of the Casimir or of Hecke operators, and
groups compact at infinity. Outcome:

1. (Theorem V, PROVED) Without a fixed rule linking `U` to the operators, the open case is not a
   narrower question: a covariant square with `U` a Borel function of Casimir and Hecke operators on
   any space with infinitely many joint eigenvectors exists **iff RH**. No unconditional no-go and no
   construction short of RH is possible in that generality.
2. (Theorem H, PROVED from strong multiplicity one) If the prime shifts are realised by Hecke
   operators through any fixed Laurent-polynomial rule (the natural one is
   `U(log p) + U(log p)* = T_p`), no realisation exists in the discrete spectrum of any `GL_n`
   automorphic quotient, including weight-1/2 forms on `Gamma_0(4)` and compact quaternionic
   quotients. The joint eigencharacter of the zero `gamma` is that of the Eisenstein series at
   `1/2 + i gamma`, which lies in the continuous spectrum. This step uses all primes together.
3. (Weyl table, section 3) Density excludes: the Casimir itself as generator on any fixed finite-area
   quotient (too few eigenvalues by a factor `log`), finite quantum graphs (same), groups compact at
   infinity at fixed level (finite-dimensional), and identification with a full Maass spectrum (too
   many by `T/log T`). Density admits exactly the objects with one scattering channel: the exotic
   spectrum of a pseudo-Laplacian, a Liouville Sturm-Liouville operator with a wall (Polya's function),
   de Branges spaces.
4. (Proposition P, CLASSICAL + PROVED assembly, MEASURED) The pseudo-Laplacian `Delta_a` on
   `SL_2(Z)\H` is a covariant square realisation with point spectrum, generator a function of a
   self-adjoint operator, the Weyl law `(T/2 pi) log(aT/2 pi e)` and all primes in the scattering
   function. It realises the Weil form of `Z_a(s) = a^s xi*(2s) + a^(1-s) xi*(2s-1)`, not of `xi`.
   Its positivity is equivalent to `zeta != 0` on `Re s >= 1`.
5. (Theorem R, PROVED from Aronszajn-Donoghue, MEASURED) Period-constrained (rank-one) modifications
   of the Tate/Eisenstein continuous spectrum: every zero on the critical line is an eigenvalue of
   exactly one member `alpha(gamma)` of the one-parameter family; off-line zeros are eigenvalues of
   none. For every Tate vector with exponentially decaying archimedean transform each member carries
   at most finitely many zeros. One member carries all zeros iff the archimedean weight is
   `1/|xi + alpha xi'|^2` up to a Herglotz term, which is the bridge-lane space and exists iff RH.
6. (Theorem Z, PROVED from recalled coefficient formulas) Zagier/Hejhal: poles of intertwiners
   (resonances) have real Casimir eigenvalue iff `Re rho = 1`, in every weight and cover. Zeros of
   periods (weight-1/2 Fourier coefficients, CM-point values) have real Casimir eigenvalue iff
   `Re rho = 1/2`. So the metaplectic version does change the line, and its Zagier space is
   unitarisable iff RH; but its vectors are Eisenstein series on the unitary axis (absorption type),
   and making them eigenvectors is item 5.
7. (Proposition C, PROVED) Compact one-parameter groups with closed image (circle): excluded
   unconditionally by the jump set of the explicit formula at `log 2, log 3, log 4`. Torus closure of
   rank `>= 2`: reduces to "the zero ordinates lie in a finitely generated subgroup of R", OPEN.

No structure was found that is automatic, reaches the strip and fails for the controls. Lead
strength: low.

## 0. Plan and relation to closed rows

- A3 (`ap-squares-rallis`, refereed): a covariant square is `l^2` on the zeros; none exists for mixing
  `U`. Used as input (Theorem 1 with the referee's density repair, Theorem 3). New here: the cases the
  referee listed as not covered.
- G12 (`g-torus-modular`): the pseudo-Laplacian zeros and "Zagier space not unitarisable" (P5) are
  recorded there. New here: the realisation statement with its norm identity and Weyl law
  (Proposition P), the weight-1/2 line shift (Theorem Z), and the rank-one family (Theorem R).
- G14, G18 (rung shift = Hecke on theta): motivates the Hecke-covariance hypothesis of Theorem H.
- Square-root lane (`g-spinor-square-root`): `D = F + alpha F'` reappears in Theorem R(d).
- Atlas PR 27: no entry on pseudo-Laplacians, rank-one perturbations or multiplicity one (grep of the
  A3 lane's statement; the atlas was not re-fetched in this lane).

Notation as in A3: `F(w) = xi(1/2+w)`, `L = F'/F`, `Q(v) = sum_rho V(rho) conj V(-conj rho)` on the
shift-closed exponential class `E^`, `S_a` the shift. `Xi(t) = xi(1/2+it)`,
`xi*(s) = pi^(-s/2) Gamma(s/2) zeta(s)`.

## 1. Theorem V: the unrestricted class is RH

**Theorem V (PROVED).** Let `A_1, ..., A_k` be commuting self-adjoint operators on a separable
Hilbert space with infinitely many joint eigenvectors `e_j` having pairwise distinct joint eigenvalues
`lambda_j in R^k`. The following are equivalent: (i) RH; (ii) there are a Borel function `g` and a
linear `Theta: E^ -> closed span(e_j)` with `||Theta v||^2 = Q(v)` and
`Theta S_a = exp(-i a g(A_1..A_k)) Theta`.

Proof. (ii) => (i) is A3 Theorem 1. (i) => (ii): enumerate the distinct ordinates `gamma_n` (both
signs), choose an injection `n -> j(n)`, put `g(lambda_j(n)) = gamma_n`, `g = 0` elsewhere (a function
on a countable set is Borel) and `Theta v = sum_n sqrt(m_n) V(i gamma_n) e_j(n)`. Then
`||Theta v||^2 = sum m_gamma |V(i gamma)|^2 = Q(v)` under RH and covariance holds by A3 Lemma 0. QED.

Consequence. "U a function of the Casimir and Hecke operators on cusp forms" carries no information
beyond RH unless `g` is fixed in advance. The remaining sections fix `g` in the ways that occur in
practice: a regular function of the Casimir (section 3), a Hecke rule at the primes (section 2), a
boundary condition (sections 4, 5).

## 2. Theorem H: Hecke-covariant point spectrum does not exist

In the `l^2` model of A3, `S_(log p)` acts on the eigenvector of `gamma` by `p^(-i gamma)`. On an
automorphic space the operator attached to `p` is `T_p` (normalised so that `T_p` has eigenvalue
`p^(it) + p^(-it)` on `E(., 1/2+it)`), and `T_p` is the sum of the two shifts by `+- log p` on the
constant term. So the natural all-primes hypothesis is

    (HC)   U(log p) + U(log p)^* = T_p on the closed span of Theta(E^), for all primes p outside a finite set.

**Theorem H (PROVED from CLASSICAL inputs).** Let `X` be the discrete spectrum of `L^2` of a
congruence quotient for `GL_2` over `Q` (weight 0, any level), or of a compact quotient attached to a
quaternion algebra, or the weight-1/2 cuspidal spectrum of `Gamma_0(4)` with `T_p` replaced by
`T_(p^2)`. There is no covariant realisation `Theta: E^ -> X` satisfying (HC). The same holds on
`GL_n`, `n >= 2`, with (HC) replaced by any fixed rule
`lambda_p = sum_k c_k p^(i e_k gamma)` (`c_k` non-negative integers, `sum c_k = n`, real `e_k`).

Proof. By A3 Theorem 1 the span is `l^2` on the zeros and `U(a)` is diagonal, so the eigenvector
`u_gamma in X` satisfies `T_p u_gamma = 2 cos(gamma log p) u_gamma` for `p` outside the finite set.
The joint eigenspace is stable under the Laplacian and the remaining Hecke operators, so it contains
a Hecke-Maass form `f`, cuspidal or constant. Constants have `lambda_p = p^(1/2) + p^(-1/2) > 2`.
For cuspidal `f` generating `pi`, the partial L-function is
`L^S(s, pi) = zeta^S(s + i gamma) zeta^S(s - i gamma)`, which has a pole at `s = 1 - i gamma`; the
L-function of a cuspidal representation of `GL_2` is entire and the finitely many missing Euler
factors have no zeros (Jacquet-Langlands; equivalently strong multiplicity one of Jacquet-Shalika:
`pi` would be nearly equivalent to the isobaric sum of `|.|^(i gamma)` and `|.|^(-i gamma)`).
Contradiction. For compact quaternionic quotients transfer to `GL_2` by Jacquet-Langlands
(one-dimensional representations have `|lambda_p| > 2`). For weight 1/2 apply the Shimura
correspondence, which preserves the `T_(p^2)` / `T_p` eigenvalues and sends cusp forms orthogonal to
one-variable theta series to cusp forms (RECALLED: Shimura, Niwa, Katok-Sarnak; the theta line has
eigenvalue `p^(1/2) + p^(-1/2)`, lanes G14). For `GL_n` the product of shifted zeta functions has a
pole and cuspidal L-functions on `GL_n`, `n >= 2`, are entire. QED.

Remarks.
- The proof uses the eigenvalues at all primes outside a finite set. For a single prime (HC) is not
  contradictory. With Ramakrishnan's refinement a set of primes of density above 7/8 suffices
  (RECALLED).
- The only automorphic object with these eigenvalues is `E(., 1/2 + i gamma)`, which is not in `L^2`.
  Any point-spectrum realisation built from it must impose a condition that is not Hecke-invariant
  (a truncation height, a CM point, one Fourier coefficient). Sections 4 and 5 treat those.
- Not covered: covariance at the Casimir only, with no rule at the primes (then section 3 applies),
  and rules that are not a fixed Laurent polynomial in `p^(i gamma)`.

## 3. Weyl-law table (task 1)

Target: `N(T) = (T/2 pi) log(T/2 pi e) + 7/8 + S(T) + O(1/T)`, `S(T) = O(log T)` (CLASSICAL). By A3
Theorem 3 a realisation with weights `w_j` at generator eigenvalues `h_j` needs
`sum_{h_j <= T} w_j = N(T)` for every `T` that is not an ordinate, i.e. exact equality of the
weighted counting measure with the zero-counting measure, not only of leading terms.

| Candidate, generator | Counting law (label) | Against N(T) | Outcome |
|---|---|---|---|
| Maass cusp forms on `SL_2(Z)`, `H = r = sqrt(lambda - 1/4)` (wave group) | `T^2/12 - (2T/pi) log T + cT + O(T/log T)` (CLASSICAL, Selberg) | too many by `pi T/(6 log T)` | full spectrum excluded; a sub-selection needs every `gamma` to be some `r_j`; `gamma_1 = 14.1347` lies between the consecutive parameters 13.7798 and 14.3585 (RECALLED list), so excluded for `SL_2(Z)` |
| Weight-1/2 Maass forms on `Gamma_0(4)`, `H = r` | `T^2/2 + O(T log T)` (area `2 pi`; RECALLED for weight 1/2) | too many | full spectrum excluded; sub-selection not excluded by density |
| Compact quaternionic quotient, `H = r` | `(area/4 pi) T^2 + O(T/log T)`; e.g. `T^2/84` for (2,3,7) (CLASSICAL) | too many, no `T log T` term at all | as above |
| Any fixed finite-area quotient, `H = c Delta` (Schrodinger group) | `(area/4 pi c) T` | too few by `log T` | excluded, including every sub-selection |
| Any of the above, `H = c r^alpha` | `~ kappa (T/c)^(2/alpha)` | never `T log T` | full spectrum excluded for every `alpha`; the only regularly varying choice is `H ~ (area/2) lambda/log lambda` |
| Hecke operator `T_p` as generator | bounded spectrum (in `[-2,2]` under Ramanujan; bounded unconditionally) | zeros unbounded | excluded |
| Group compact at infinity (definite quaternion algebra, definite orthogonal group), fixed level and weight | finite-dimensional | - | excluded; one-parameter subgroups: Proposition C |
| Compact quantum graph, total length `L` | `LT/pi + O(1)` (CLASSICAL) | too few by `log T` | excluded |
| Liouville operator `-d^2/du^2 + 4 pi^2 e^(2u)` on `u >= 0`, Dirichlet wall, `H = 2 sqrt(.)`: zeros of `K_(it/2)(2 pi)` (Polya) | `(T/2 pi) log(T/2 pi e) + O(1)` (CLASSICAL) | same main term including the constant; remainder `O(1)` against `S(T)` unbounded | density passes; not the zeros (one Fourier mode `n = 1`, no primes) |
| Exotic spectrum of the pseudo-Laplacian `Delta_a` on `SL_2(Z)\H`, `H = 2r` | `(T/2 pi) log(aT/2 pi e) + O(log log T)` (PROVED from the phase, section 4) | same main term at `a = 1` | density passes; realises `Z_a` (Proposition P) |
| Resonances of `SL_2(Z)\H`, `s = rho/2` | exactly `N(T)` | equal | not self-adjoint (Theorem Z) |
| de Branges space of `Xi - i alpha Xi'` | exactly `N(T)` | equal | exists iff RH (Theorem R(d)) |

MEASURED (`checks.py` part A; counts of sign changes on the line):

| T | N_zeta(T) | smooth law | zeros of `K_(it/2)(2 pi)` | `Delta_1` exotic, `2r <= T` | `Delta_2` exotic | `SL_2(Z)` Weyl main | `Gamma_0(4)` main |
|---|---|---|---|---|---|---|---|
| 25 | 2 | 2.39 | 2 | 3 | 5 | 0.9 | 312.5 |
| 50 | 10 | 9.42 | 8 | 10 | 15 | 83.8 | 1250 |
| 100 | 29 | 29.00 | 28 | 29 | 40 | 540.2 | 5000 |

Reading. A `T log T` law is the winding of a scattering phase in one channel. Two-dimensional
spectra have it only as the second term of the Weyl law, where it is the scattering term. Every
candidate that passes the density test is a one-channel object with a boundary condition.

Beyond density (RECALLED, not load-bearing). For `SL_2(Z)` the remainder of the cuspidal Weyl law is
`Omega_+-(sqrt T/log T)` (Selberg, in Hejhal vol. 2), against `S(T) = O(log T)`; this excludes
generators `g(r)` with `g` in a Hardy field for the full spectrum. The exotic spectrum has remainder
`O(log log T)`, the zeros have `S(T) = Omega_+-((log T)^(1/3 - eps))` (Tsang), so `{2 r_j(a)}` is
more rigid than the zeros for every `a`.

## 4. Proposition P: the realisation that exists (task 2)

`E(z,s)` on `SL_2(Z)\H` has constant term `y^s + phi(s) y^(1-s)`, `phi(s) = xi*(2s-1)/xi*(2s)`. For
`a >= 1` let `Delta_a` be the Friedrichs extension of the Laplacian on functions whose constant term
vanishes for `y > a` (Colin de Verdiere; Lax-Phillips). CLASSICAL: `Delta_a` is self-adjoint with
compact resolvent; its eigenfunctions are the cusp forms and the truncated Eisenstein series
`psi_j = Lambda^a E(., 1/2 + i t_j)` at the solutions of `a^(it) + phi(1/2+it) a^(-it) = 0`, i.e. at
the zeros of

    Z_a(s) = a^s xi*(2s) + a^(1-s) xi*(2s-1),     Z_a(s) = Z_a(1-s).

On the line `Z_a(1/2+it) = 2 |xi*(1+2it)| a^(1/2) cos theta_a(t)`,
`theta_a(t) = t log a + arg xi*(1+2it)`.

**Proposition P (PROVED from the classical inputs).** Let `F_a(w) = s(s-1) Z_a(s)` at `s = 1/2 + w`
(entire, even) and `Q_a` the form `Q` built from `F_a`. For `1 <= a <= 7` (range of Lagarias-Suzuki
without real exceptional zeros, RECALLED):

(a) all zeros of `F_a` are `w = +- i t_j`, simple, and
`Q_a(v) = sum_j (|V(i t_j)|^2 + |V(-i t_j)|^2) = ||Theta_+ v||^2 + ||Theta_- v||^2`, with
`Theta_+- v = sum_j V(+- i t_j) psi_j/||psi_j||` in the exotic eigenspace of `Delta_a`, and
`Theta_+- S_b = exp(-+ i b sqrt(Delta_a - 1/4)) Theta_+-`.

(b) Maass-Selberg at an exotic eigenvalue: `||psi_j||^2 = 2 log a - (phi'/phi)(1/2 + i t_j) = 2 theta_a'(t_j) > 0`.
(The third Maass-Selberg term vanishes because `phi(1/2 + i t_j) = -a^(2 i t_j)`.) Positivity of the
norm is the monotonicity of the phase, and `-phi'/phi` on the line is a sum of Poisson kernels of
the poles `rho/2` of `phi`, positive because they lie in `Re s < 1/2`, i.e. because `Re rho < 1`.

(c) Counting: `#{t_j <= T/2} = theta_a(T/2)/pi + O(1) = (T/2 pi) log(aT/2 pi e) + O(log log T)`.

(d) The truncation height cannot move the spectrum to the zeros: a zero of `Z_a` near `s = rho/2`
would need `|a^s xi*(2s)| = |a^(1-s) xi*(2s-1)|` there, but the left side tends to 0 and the right
side is `a^(1 - Re s) |xi*(rho - 1)| != 0`.

So the square exists, is covariant under a function of a self-adjoint (pseudo-)Casimir, has point
spectrum with a `T log T` law, contains all primes through `phi`, and holds at every height. It is
the Weil form of the twin sum at shift 1/2 (row G12), and what it encodes is `zeta != 0` on
`Re s >= 1`.

MEASURED (`checks.py` part B, test `V = 3/(z+1) - 5/(z+2)`):

| a | zeros on the line, `0 < t < 80` | all zeros in `-1.5 < Re s < 2.5`, `abs(Im s) < 80` (argument principle) | `Q_a` by the Pick formula | zero sum to 80 + tail estimate |
|---|---|---|---|---|
| 1 | 58 | 116.0 | 0.726156 | 0.591383 + 0.134877 = 0.726260 |
| 2 | 76 | 152.0 | 2.029702 | 1.873265 + 0.156941 = 2.030206 |

First zeros `t_j`: 6.97468, 10.40229, 12.42264 (`a = 1`), agreeing with G12; 1.74490, 6.01576, 7.33617
(`a = 2`). The agreement of the two sides (1e-4, 2.5e-4) is at the accuracy of the tail estimate.

## 5. Theorem R: period-constrained point spectrum (rank-one family)

The other way to obtain eigenvectors from Eisenstein series on the unitary axis is to restrict the
operator to the kernel of a functional `theta` (a period) and take the self-adjoint extension
(Colin de Verdiere; Bombieri-Garrett for `theta` = evaluation at the CM point of discriminant -3,
RECALLED). The exact mechanism is visible on `GL(1)`.

Setting. `rho(t) >= 0` even, `int rho < inf`, `A` = multiplication by `t` on `L^2(R, rho dt)`,
cyclic vector 1. For the Tate theta vector with archimedean datum `g`,
`rho(t) = |zeta(1/2+it)|^2 |W_g(t)|^2` (A3 section 3(a)); for the Gaussian with the pole factor,
`rho = Xi^2`. `A_alpha = A + alpha <1, .> 1`, and `A_inf` is the compression of `A` to `{1}^perp`
(the kernel of the period). `Phi(z) = int rho(t) dt/(t - z)`, `F(E) = PV int rho(t) dt/(t - E)`,
`G(E) = int rho(t) dt/(t-E)^2`.

**Theorem R.**

(a) (CLASSICAL, Aronszajn-Donoghue; Simon 1995 Thm II.2) `E` is an eigenvalue of `A_alpha` iff
`G(E) < inf` and `F(E) = -1/alpha` (`F(E) = 0` for `alpha = inf`); the eigenvector is `1/(t - E)`.

(b) (PROVED) Let `rho = |zeta(1/2+it)|^2 |W|^2` with `W` real-analytic and non-vanishing on `R`.
`G(E) < inf` iff `zeta(1/2 + iE) = 0`. So the eigenvalues that can occur anywhere in the family are
exactly the ordinates of zeros on the critical line, each for exactly one coupling
`alpha(gamma) = -1/F(gamma)`. A zero off the line is an eigenvalue of no member. The point spectrum
of the whole family counts `N_0(T)`; comparing it with `N(T)` is RH.

(c) (PROVED) If `rho` and `rho'` are `O(e^(-c|t|))` (every `K`-finite Schwartz datum:
`W` = polynomial times a Gamma factor), then `F(E) = -m_0/E + O(E^-3)` as `E -> inf`,
`m_0 = int rho`. Hence `alpha(gamma) = gamma/m_0 + O(1/gamma)` is unbounded and each `A_alpha`,
`alpha` finite or infinite, has at most finitely many zeros as eigenvalues.
Proof: split at `|t - E| = E/2`; the far part is `-(1/E) int rho (1 - t/E)^(-1)` with odd moments 0;
the near part is at most `E sup |rho'|` over the window. QED.

(d) (PROVED) `A_inf` has every ordinate `gamma` as an eigenvalue (RH assumed, as it must be) iff
`-1/Phi(z) = sum_gamma c_gamma/(gamma - z) + B(z)` with `c_gamma > 0` and `B` Herglotz with
absolutely continuous part of density `b`; then `rho = b/(pi |M_c + B|^2)`. With `c_gamma = m_gamma`,
`B = i/alpha`: `M = -Xi'/Xi` and

    rho_alpha(t) = (alpha/pi) Xi(t)^2/(Xi(t)^2 + alpha^2 Xi'(t)^2) = (alpha/pi) |F/D|^2 (it),   D = F + alpha F'.

Proof: `-1/Phi` is Herglotz; it has a pole at `gamma` iff `Phi(gamma + i0) = 0`, with residue
`1/G(gamma)`; conversely for the displayed `Phi = -1/(M + i/alpha)`,
`Im Phi(t + i0) = pi rho_alpha(t)`, `Re Phi(t + i0) = alpha Xi Xi'/(Xi^2 + alpha^2 Xi'^2)`, which
vanishes at the zeros of `Xi`; evenness of `rho_alpha` removes the constant and linear terms of the
Herglotz representation. `M` is Herglotz iff all zeros of `Xi` are real. QED.

Reading of (d). The archimedean weight that turns the Tate continuous spectrum into point spectrum
at the zeros is `|W|^2 = alpha/(pi |zeta|^2 |1 + alpha L|^2)`-type: it is `1/|D|^2`, the bridge
denominator of the square-root lane, equivalently the de Branges space of `Xi - i alpha Xi'`. It is
not the transform of a local datum at infinity: it depends on all primes, and it is a Herglotz
weight iff RH. This is the Hilbert-Polya space of A3 Theorem 1 written inside the Tate picture.

MEASURED (`checks.py` parts C, C2, D).

Gaussian weight `rho = Xi^2`, `m_0 = 2.00906`:

| n | gamma_n | F(gamma_n) | -m_0/gamma_n | alpha(gamma_n) |
|---|---|---|---|---|
| 1 | 14.1347 | -0.150851 | -0.142136 | 6.629 |
| 2 | 21.0220 | -0.097942 | -0.095569 | 10.210 |
| 3 | 25.0109 | -0.081705 | -0.080328 | 12.239 |
| 4 | 30.4249 | -0.066786 | -0.066033 | 14.973 |
| 8 | 43.3271 | -0.046626 | -0.046370 | 21.447 |

Each zero needs its own coupling, as (c) states.

Weight `rho_1` of (d): PV integral over `|t| < 400` (midpoint rule, step 0.004) at the first five
zeros: -0.0060814, -0.0090495, -0.0107711, -0.0131116, -0.0141984. Divided by `gamma_n`:
-4.3024e-4, -4.3048e-4, -4.3066e-4, -4.3095e-4, -4.3110e-4, i.e. the pure tail form
`-rho_mean log((T+gamma)/(T-gamma))` (the drift 0.2% is the predicted `gamma^2/3T^2`). The tail
estimated from the mean density on `[300, 400]` is +4.97e-4 `gamma`; the residual is 13% of the tail
and 0.06% to 0.13% of the absolute integral (1.68). Consistent with `F(gamma_n) = 0`; the tail mean is
the limiting accuracy.

## 6. Theorem Z: the Zagier/Hejhal phenomenon and the weight-1/2 version (task 3)

**Theorem Z (PROVED from the classical/recalled formulas for constant terms and coefficients).**

(a) Poles of intertwiners. Weight 0, `SL_2(Z)`: `phi` has poles at `s = rho/2`; the functions
`E*(z, rho/2)` (Zagier's vectors, constant term `xi*(rho-1) y^(1-rho/2)`) have Casimir eigenvalue
`(rho/2)(1-rho/2)`, with imaginary part `(gamma/2)(1-beta)`. Weight 1/2, `Gamma_0(4)`: the constant
term is a quotient `xi(4s-2)/xi(4s-1)` up to elementary factors (RECALLED, Goldfeld-Hoffstein); poles
at `s = (1+rho)/4`, eigenvalue imaginary part `(gamma/8)(1-beta)`. In both, and for every group and
cover (difference 1 in the L-argument, G12(iv)), the eigenvalue is real iff `beta = 1`. A positive
form with symmetric Casimir on a space containing these vectors does not exist, with or without RH.
The metaplectic cover does not change this.

Exact reason there is no self-adjointness: these are eigenvectors of the Lax-Phillips generator
`B` (the compression of the wave group to the orthocomplement of incoming and outgoing data), with
eigenvalue `rho/2 - 1/2`. `B` is dissipative, not normal. RH is the statement that its spectrum lies
on the line `Re = -1/4`; the symmetric line of the Casimir is `Re = 0`, which corresponds to
`beta = 1`. The quantity RH makes real, `(rho - 1/2)^2`, is not a function of the weight-0 Casimir
(G12 P5).

(b) Zeros of periods. Weight 1/2: the coefficient of `E_(1/2)(z,s)` at `m = D n^2` is
`L(2s - 1/2, chi_D)/zeta(4s-1)` times a finite Dirichlet polynomial (RECALLED). For `D = 1` all
square-index coefficients vanish at `s_rho = 1/4 + rho/2`, and

    s_rho (1 - s_rho) = (1 - (rho - 1/2)^2)/4,

real iff `beta = 1/2` (or `gamma = 0`). Weight 0: `E(z_0, s)` at the CM point of discriminant `-3`
is `zeta(s) L(s, chi_-3)/zeta(2s)` up to elementary factors (Hejhal's explanation of Haas's
values), so `E(z_0, rho) = 0` with eigenvalue `rho(1-rho) = 1/4 - (rho-1/2)^2`, real iff
`beta = 1/2`.

(c) Consequence. Let `V_theta` be the span of `E_(1/2)(., 1/4 + rho/2)` over the zeros (Eisenstein
series orthogonal to theta in the sense of vanishing square coefficients). The `(g,K)`-module of each
vector is a principal series of the metaplectic group with parameter `s_rho`; it is unitarisable iff
`Re s_rho = 1/2` iff `beta = 1/2`. So the metaplectic Zagier space admits an invariant positive form
with symmetric Casimir **iff RH**. The weight-1/2 version (and the CM-point version in weight 0)
moves the symmetric line from `Re rho = 1` to `Re rho = 1/2`.

(d) What it does not give. Under RH these vectors are Eisenstein series on the unitary axis. The
canonical form on them is the Plancherel form, for which each is a point of the continuous spectrum
of measure 0 (absorption: the spectral density of the period is `|L(1/2 + it, chi_D)|^2 x` local
factor, with a double zero at `gamma`). Any other positive form is a choice of weights and is
Theorem V. Making them eigenvectors of a self-adjoint operator by restricting to the kernel of the
period is Theorem R: a second real condition `F(gamma) = 0` appears at each zero, and it is not
satisfied in general. In the automorphic case `F` contains in addition the cusp-form periods
`sum_j |theta f_j|^2/(lambda_j - lambda)`; Bombieri-Garrett obtain from the resulting interlacing
and Montgomery's pair correlation that at most 94% of the zeros can occur (RECALLED, not re-read).

Summary: poles give point spectrum on the wrong line with a non-normal operator; periods give the
right line with absorption type. No recorded construction has both.

## 7. Proposition C: groups compact at infinity

**Proposition C (PROVED).** There is no covariant realisation in which `U` has spectrum in a set
`omega (Z + c)`. In particular none where `U(a) = pi(exp(aX))` for a closed one-parameter subgroup of
a compact Lie group (definite orthogonal or quaternionic target at infinity, `K`-rotation).

Proof. For `v = e^(-xt)`, `f(a) = Q(S_a v, v) = sum_rho e^(-a rho)/(x^2 - rho^2)` satisfies, for
`a > 0`, `(x^2 - d^2/da^2) f = sum_rho e^(a rho) = e^(a/2) - sum_n Lambda(n) n^(-1/2) delta(a - log n) - (smooth)`
(explicit formula). So `f` is smooth on `a > 0` except that `f'` jumps by `Lambda(n)/sqrt n` at
`a = log n`. If the spectrum lies in `omega(Z + c)` then `f(a + P) = e^(-2 pi i c) f(a)` with
`P = 2 pi/omega`, so the jump set `J = {log p^k}` satisfies `J + P subset J`. Then `2 e^P` and
`4 e^P` are prime powers, so `e^P = 2^(j-1)` with `j >= 2`, and `3 e^P = 3 . 2^(j-1)` is not a prime
power. QED.

The density argument alone does not give this, because multiplicities up to `O(log gamma)` are not
excluded unconditionally. If the closure of the one-parameter group is a torus of rank `r >= 2` the
spectrum lies in a subgroup of `R` of rank `r`. Whether the zero ordinates lie in a finitely
generated subgroup is OPEN to my knowledge (no search run); counting does not decide it. With Hecke
covariance the case is closed by Theorem H regardless of rank.

## 8. Controls (task 4)

| Control | Theorem V / H / C (no-go statements) | Proposition P (pseudo-Laplacian square) | Theorem R (rank-one family) |
|---|---|---|---|
| DH | same statements; `Q_DH` indefinite so no realisation at all | fails at a named step: no Eisenstein series has `xi_DH(2s-1)/xi_DH(2s)` as scattering function (product of local intertwiners; ARGUED as in A3), and the quotient is not inner in `Re s > 1/2` because DH has zeros in `Re s > 1` (CLASSICAL), so phase monotonicity (b) fails | holds verbatim: on-line zeros 5.0942, 8.9399, 12.1335, 14.4040, 17.1302, 19.3088 are eigenvalues at couplings 0.920, 1.742, 2.399, 2.862, 3.415, 3.856 (MEASURED); at the height 85.699348 of the off-line zero the density is 0.075 of its value 0.4 below, not 0, so no member has an eigenvalue there. (d) fails: `Xi_DH'/Xi_DH` is not Herglotz |
| HEAT (tau < 0) | same | not formulable as an intertwiner | (a)-(c) hold for the heat-deformed density; (d) fails as for DH |
| TW+, TW-, U | no symmetric zero set | no functional equation: `abs(phi) = 1` on the line fails, `Z_a` has no symmetry | `Xi` not real on the line; the family is defined but its eigenvalues are on-line zeros of a function without symmetry |
| E_a | H: the eigencharacter is `p^(+-a) p^(i gamma)`, not unitary | **passes**: zeros of `xi_E(2s)` have real part at most `1/2 + a < 1`, so the quotient is inner and all zeros of the twin sum are on the line | (a)-(c) hold with the on-line zero set empty; (d) fails |
| T-NR | same as E_a when `arccosh(abs(c)/2)/log q < 1/2` | passes for the same reason | as E_a |
| Beurling | no functional equation | not formulable | not formulable |

Reading. The only positive structure of the lane (Proposition P) is separated from DH at a named
step, and that step is "zero-free on `Re s >= 1`", which E_a and T-NR pass. The rank-one family is
Euler-blind. No step separates zeta from all controls inside the strip.

Three requirements of the brief. All primes together: Theorem H (multiplicity one), Proposition P
(through `phi`). Uniform in height, every window: Proposition P (every zero of `Z_a`); Theorem R(b)
is pointwise in `gamma` but gives one operator per zero. Failure on controls for a named reason:
table. None holds for `xi` itself.

## 9. What remains outside this no-go

1. Covariance at the Casimir only, with a sub-selection of eigenvectors and no rule at the primes:
   needs `{gamma} subset {g(r_j)}` exactly; excluded for `g = id` on `SL_2(Z)` by one value, otherwise
   Theorem V (equivalent to RH for free `g`).
2. Rank-one families in the automorphic setting with a period whose `F` vanishes at the zeros: by
   Theorem R(d) the weight is then global (`1/|D|^2`-type); whether a Hecke-natural period has this
   property is not decided here (Bombieri-Garrett: at most 94% for the CM point of discriminant -3).
3. Compact tori of rank at least 2 without Hecke covariance: reduces to the OPEN statement in
   section 7.
4. Non-covariant, truncated or cone-restricted realisations (unchanged from A3).

## 10. Three weakest steps

1. **The hypothesis (HC) of Theorem H.** It fixes how primes act. The theorem covers every fixed
   Laurent-polynomial rule, but a realisation covariant only for the Casimir, or with a rule that
   varies with the eigenvector, falls under Theorem V and is as hard as RH. The weight-1/2 and
   quaternionic cases rest on the Shimura and Jacquet-Langlands correspondences as recalled, not
   re-derived; cuspidality of the Shimura lift off the theta line is quoted.
2. **Recalled inputs.** The weight-1/2 Eisenstein coefficient formula and constant term
   (Goldfeld-Hoffstein), Hejhal's CM-point formula, Lagarias-Suzuki (range of `a` without real
   zeros), Bombieri-Garrett (94%), Selberg's Omega result, Tsang, the list of `SL_2(Z)` spectral
   parameters, and the Weyl law in weight 1/2 were not re-read. Theorem Z(b),(c) depend on the
   coefficient formula up to elementary factors only (location of the zeta factor); the table rows
   marked RECALLED depend on the others. No online search was run; novelty is not claimed:
   Theorem V is elementary, Theorem H is a direct use of strong multiplicity one, Theorem R(a) is
   Aronszajn-Donoghue, R(d) is the de Branges/Lagarias structure function, Proposition P assembles
   Colin de Verdiere and Maass-Selberg.
3. **Theorem R is proved on GL(1); numerics are float.** The automorphic rank-one case (cusp-form
   periods in `F`, the Sobolev order of a point evaluation) is described, not computed. The check of
   (d) reaches `T = 400` and is limited by the tail mean (residual 13% of the tail). The Pick/zero-sum
   comparison in section 4 is at 1e-4, the accuracy of the tail estimate. The DH column of
   Proposition P is argued; no off-line zero of the DH twin sum was computed (it needs a DH zero with
   real part above 1, not located here).

## Files

- `checks.py`, `checks.log`, `checks.json`: parts A (counts), B (pseudo-Laplacian zeros, argument
  principle, Pick form), C/C2 (rank-one family, Gaussian and de Branges weights), D (DH). Run from the
  repo root with `scripts/memcap.sh 8 .venv-arb/bin/python -u <path>/checks.py`; single process,
  720 s, largest allocation one list of 1e5 floats.
