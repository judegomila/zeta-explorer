# sq-causal-cascade: the causal scattering function as a chain of prime sections on the gamma one-port

Date: 2026-11-16. Scratch research note, unreviewed. No RH claim. Labels: PROVED (argument given here),
CLASSICAL (published theorem, cited), MEASURED (mpmath/numpy, not interval-certified), HEURISTIC, OPEN.
Files: `checks.py`, `checks.log`, `checks2.py`, `checks2.log`, `checks2_mpmath_partial.log` in this directory.

## Verdict

**Precise obstruction, with five proved statements. Nothing here moves RH.**

1. **Composition identity (Theorem 1, PROVED).** With `M(Z) = I + (Z/2) [[-1,-1],[1,1]]`, the map
   `Z -> M(Z)` is a homomorphism from `(C,+)` into a unipotent abelian matrix group, the scattering function
   is `S = T_{M(alpha L)}[1]`, and for `Re s > 1`
   `S = T_{ M(alpha G) * prod_p M(-alpha u_p) }[1]`, `u_p = log p/(p^s - 1)`.
   The J-defect of a section is rank one and exact: `J - M(Z)* J M(Z) = Re Z * [[1,1],[1,1]]`.
   So a section is J-contractive iff `Re Z >= 0`, and no change of reference impedance alters this.
2. **The half-unit shift, quantified (Proposition 2, PROVED).** Relative to its own line impedance the stub
   is the pure delay `p^{-s}`. On `Re s = sigma > 0` the J-defect of the prime section fills
   `[-log p/(p^sigma - 1), +log p/(p^sigma + 1)]` (sign convention: negative = active), has Bohr mean 0 and
   mean square `log^2 p / (2(p^{2 sigma} - 1))`. Three abscissae: sections are J-contractive with margin
   `(log p)/2` on `Re s <= 0`; the summed defect is bounded iff `Re s > 1`; it is square-summable on the
   Bohr torus iff `Re s > 1/2`, with variance `1/(8x^2) + O(1)` at `Re s = 1/2 + x`. The critical line is the
   exact `l^2` threshold of the chain, and `Re s = 1` the `l^1` threshold.
3. **Coverage theorem (Theorem 3, PROVED, explicit constants).** For `sigma >= 1/2`, `t >= 1`:
   `Re G(sigma+it) >= R(t) := (1/2) log(t/2 pi) - 1/(3t) - 1/(2t^2)`. If
   `D(Q) := sum_{p<=Q} log p/(sqrt p - 1) <= R(t_0)` then the truncated chain (gamma section with the primes
   `p <= Q`) is J-contractive on `{Re s >= 1/2, |Im s| >= t_0}`, i.e. `|S_Q| <= 1` there. `D(Q) = 2 sqrt Q (1+o(1))`,
   so the threshold is `Q*(t) = (log(t/2 pi))^2/16 (1 + o(1))`. The same theorem holds, with the same proof,
   for every sign twist. For a sign twist chosen against a given height the conclusion fails once
   `Q` exceeds a constant multiple of `Q*` (Section 6). So the theorem is sharp in the class of arguments
   that use only `|Lambda(n)|`, and it cannot be extended inside that class.
4. **No renormalization (Theorem 4, PROVED, unconditional).** There is no splitting
   `L = L_0 + sum_p h_p` with `L_0` positive-real on `Re z > 0` and each `h_p` a positive-real function of
   `p^{-z}`, except `h_p` = imaginary constants. Sectionwise passivity with "the gamma section absorbing the
   deficit" is therefore impossible for prime-periodic sections, by any reference change or any
   redistribution of resistance.
5. **No single-delay section at any node (Theorem 5, PROVED, self-contained).** `L = xi'/xi(1/2 + z)` is not
   constant (finite or infinite) on any vertical arithmetic progression `z_0 + 2 pi i k/tau`, `k >= 1`, with
   `Re z_0 >= 0`. Consequently `S` has no Blaschke-Potapov single-delay factor of the first kind (interior
   node) or second kind (boundary node), of any degree, and no multiplicative periodic inner factor. For the
   shifted ratio `R_a` of `g-passive-cascade` the same first-moment argument closes the case the referee left
   open (`0 < Re w_0 <= 1/2 - a`) and the boundary nodes for `a < 1/2`. The proof uses only a first moment of
   zeta on a progression (Lemma M) and removes the dependence of the earlier Theorem 3(i) on Ingham and
   Li-Radziwill.

What stays open is stated in Section 7 as one inequality (ME). It is RH; this note does not reduce it.

## 0. Plan: what is new against the atlas and the walls

| Item | Overlap | What this note adds |
|---|---|---|
| Atlas section 2 ("passive finite products ... do not supply this") | States the failure | Theorems 4 and 5 prove non-existence of a prime-periodic passive splitting or section, at every node. |
| `g-passive-cascade` Thm 1, Thm 3, Section 5 | Series topology; no periodic lossless factor of `R_a` for `Re w_0 > max(0, 1/2 - a)`; `Q*` measured | Scattering-domain composition with exact J-defect (Thm 1); `Q*` as a theorem with constants (Thm 3); all remaining nodes for `S`, and the open nodes for `R_a` (Thm 5); additive rigidity (Thm 4). |
| `g-spinor-square-root` | `S` causal iff RH | `S` written as a chain; where each section's J-defect lives. |
| eq48 (refereed), no margin | The passivity inequality is the Weil form | Not re-run. (ME) in Section 7 is the same statement in chain variables. |
| Walls | DH, backward heat, sign twist | Section 6. The only positive statement (Thm 3) is twist-invariant, so it cannot reach all primes; it fails for DH and for the heat family at the first step (no chain). |

Notation. `s = 1/2 + z`, `F(z) = xi(1/2+z)`, `L = F'/F`, `S = (1 - alpha L)/(1 + alpha L)`, `alpha > 0`.
`G(s) = 1/s + 1/(s-1) - (1/2) log pi + (1/2) psi(s/2)`. `u_p(s) = log p/(p^s - 1)`.
`Z_p(s) = (log p/2) coth(s log p/2)`, so `u_p = Z_p - (log p)/2`. `J = diag(1,-1)`.
`T_M[e] = (M_11 e + M_12)/(M_21 e + M_22)`. PR = holomorphic with nonnegative real part.

## 1. Composition identity (Theorem 1)

**Theorem 1 (PROVED).** Put `N = [[-1,-1],[1,1]]` and `M(Z) = I + (Z/2) N`.

(a) `N^2 = 0`, so `M(Z_1) M(Z_2) = M(Z_1 + Z_2)`: series connection of impedances is matrix multiplication,
the sections commute, and `M(Z) = exp(Z N/2)`.

(b) If `Z = Z_1 + Z_2` and `e_2 = (1 - Z_2)/(1 + Z_2)` then `(1 - Z)/(1 + Z) = T_{M(Z_1)}[e_2]`. The short circuit
`Z_2 = 0` is `e_2 = 1`. Hence `S = T_{M(alpha L)}[1]` and, for `Re s > 1`,

    S = T_{ M(alpha G(s)) * prod_p M(-alpha u_p(s)) }[1]
      = T_{ M(alpha G(s)) * prod_p [ M(-alpha Z_p(s)) M(alpha (log p)/2) ] }[1].            (1.1)

(c) `J - M(Z)* J M(Z) = (Re Z) E`, `E = [[1,1],[1,1]] >= 0`. So `M(Z)` is J-contractive iff `Re Z >= 0`,
J-unitary iff `Re Z = 0`, J-expansive iff `Re Z <= 0`; and `1 - |S|^2 = 4 alpha Re L / |1 + alpha L|^2`.

(d) Reference change. For a dynamic reference `W` with `Re W > 0`, the power-wave scattering function
`(W - L)/(conj W + L)` has modulus `<= 1` iff `Re L >= 0`. The passivity condition of the total, and of each
series section, does not depend on the reference.

Proof. (a) direct. (b) `(1 - Z_1 - Z_2)/(1 + Z_1 + Z_2)` with `Z_2 = (1-e_2)/(1+e_2)` equals
`((2 - Z_1) e_2 - Z_1)/(Z_1 e_2 + 2 + Z_1)`; (1.1) is then `xi'/xi = G - sum_p u_p` (g-passive-cascade Thm 1).
(c) `N* J = -E = J N` and `N* J N = 0`, so `M* J M = J - (Re Z) E`. (d) `|L - W|^2 - |L + conj W|^2 = -4 Re L Re W`. QED.

Reading. The Redheffer composition of a series chain is the abelian group `exp(C N)`; the chain has no
internal reflections to rearrange, because every section has the same null direction `(1,-1)`. All freedom is
in how the scalar `L` is split into summands. That is the content of "renormalization", treated in Section 4.

## 2. The half-unit shift (Proposition 2)

**Proposition 2 (PROVED).** Let `w = p^{-s}`, `sigma = Re s`, `theta = t log p`.

(a) `(Z_p - (log p)/2)/(Z_p + (log p)/2) = p^{-s}`: seen from its own line impedance the stub is the delay
`p^{-s}`, of modulus 1 on `Re s = 0` and `p^{-1/2}` on `Re s = 1/2`. `u_p = (log p) w/(1 - w)`.

(b) `Re u_p = log p (p^sigma cos theta - 1)/(p^{2 sigma} - 2 p^sigma cos theta + 1)`. On `sigma = 0` it is the
constant `-(log p)/2`; for `sigma < 0` it is `< -(log p)/2`. For `sigma > 0` it fills
`[-log p/(p^sigma + 1), log p/(p^sigma - 1)]`, with mean 0 and mean square `log^2 p/(2(p^{2 sigma} - 1))` over
`theta`.

(c) The section `M(-alpha u_p)` is J-contractive with margin `alpha (log p)/2` on `Re s <= 0`, and on every
line `Re s = sigma > 0` it is J-expansive on a set of `theta` of positive measure.

(d) For the chain: `sup` over the Bohr torus of the summed defect `sum_p Re u_p` is `sum_p log p/(p^sigma - 1)`,
finite iff `sigma > 1`. Its variance on the torus is `V(sigma) = sum_p log^2 p/(2(p^{2 sigma} - 1))`, finite iff
`sigma > 1/2`, and `V(1/2 + x) = 1/(8 x^2) + O(1)` as `x -> 0+`. For the primes `p <= Q` at `sigma = 1/2`,
`V_Q = (1/4) log^2 Q + O(log Q)`.

Proof. (a) `coth y = (1 + e^{-2y})/(1 - e^{-2y})`. (b) `Re u_p = log p * sum_{k>=1} r^k cos k theta`, `r = p^{-sigma}`;
Parseval. (c) from (b) and Theorem 1(c). (d) Kronecker (CLASSICAL) for the sup; independence of the `theta_p` on
the torus for the variance; `sum_p log^2 p p^{-1-2x} = 1/(4x^2) + O(1)` and Mertens (CLASSICAL). QED.

Reading. The lossless axis of the stubs is `Re s = 0`. Moving the reference axis right by `sigma` multiplies
the echo of prime `p` by `p^{-sigma}`. Bounded total defect (the only thing sectionwise J-theory can use) needs
`sum_p p^{-sigma} log p < inf`, i.e. `sigma > 1`. Square-summable defect needs `sigma > 1/2`. RH asks for a
one-sided pointwise bound, along one line of the torus, in the range `1/2 < sigma <= 1` where the defect is in
`H^2` of the torus but not in `L^inf`. The half unit is the gap between the `l^1` and `l^2` thresholds of
`(p^{-sigma} log p)_p`.

Consequence for weighted Hardy spaces. A weight that makes the chain sectionwise contractive on `Re s > 1/2`
has to supply the attenuation `p^{-1/2}` per section in sup norm. On the Bohr torus that is the shift
`sigma -> sigma + 1/2`, which is not a multiplier on functions of `s` alone: it acts by a different factor
`p^{-1/2}` on each frequency `log p` and by `n^{-1/2}` on `log n`. It is the operator `f(s) -> f(s + 1/2)`.
So the weighted-space version of the question is: is the chain passive on `Re s > 1`, to which the answer is
yes (`Re L = sum_rho Re 1/(z - z_rho) > 0` for `Re z > 1/2`, since all zeros have `|Re z_rho| < 1/2`) and carries
no zero information. A weight depending on `Re s` only (a
weighted `H^2` on the strip `0 < Re s < 1/2`) rescales all sections by the same factor and leaves the sign of
`Re u_p` unchanged (Theorem 1(d)).

## 3. Coverage theorem (Theorem 3)

Let `P_Q = prod_{p<=Q} (1 - p^{-s})^{-1}`, `A_Q(s) = (1/2) s(s-1) pi^{-s/2} Gamma(s/2) P_Q(s)`,
`L_Q = A_Q'/A_Q = G - sum_{p<=Q} u_p`, `S_Q = (1 - alpha L_Q)/(1 + alpha L_Q) = T_{M(alpha G) prod_{p<=Q} M(-alpha u_p)}[1]`.

**Lemma 3.1 (PROVED; Binet's formula CLASSICAL).** For `sigma >= 1/2` and `t >= 1`,

    Re G(sigma + it) >= R(t) := (1/2) log(t/2 pi) - 1/(3t) - 1/(2 t^2).

Proof. Binet: `psi(w) = log w - 1/(2w) - 2 int_0^inf u du/((u^2 + w^2)(e^{2 pi u} - 1))` for `Re w > 0`. With `w = s/2`:
`G(s) = 1/(2s) + 1/(s-1) + (1/2) log(s/2 pi) - I(s/2)`, `I(w) = int_0^inf u du/((u^2+w^2)(e^{2 pi u}-1))`.
For `w = a + ib`, `a >= 1/4`, `b = t/2 > 0`, `u >= 0`: `|u^2 + w^2| = |w - iu| |w + iu| >= a b`. So
`|I| <= (1/(ab)) * (1/24) <= 1/(3t)`. Also `Re 1/(2s) > 0`, `Re 1/(s-1) = (sigma-1)/|s-1|^2 >= -1/(2t^2)`,
`log|s| >= log t`. QED. (MEASURED: on a grid `sigma in [0.5, 50]`, `t in [1, 1e9]` the minimum of
`Re G - R(t)` is positive; `checks.log` section 3.)

**Lemma 3.2 (PROVED from CLASSICAL inputs).** `D(Q) := sum_{p<=Q} log p/(sqrt p - 1)` satisfies, for `Q >= 2`,

    D(Q) <= 1.01624 [ 2/(sqrt 2 - 1) + 2 sqrt Q - 2 sqrt 2 + 2 log((sqrt Q - 1)/(sqrt 2 - 1)) ],

and `D(Q) = 2 sqrt Q + O(sqrt Q exp(-c sqrt(log Q)))`.

Proof. Partial summation against `theta(x)` with the decreasing `f(x) = 1/(sqrt x - 1)`:
`D(Q) = theta(Q) f(Q) + int_2^Q theta(x) (-f'(x)) dx`; insert `theta(x) < 1.01624 x` (Rosser-Schoenfeld 1962,
Thm 9), integrate by parts back, and use `int dx/(sqrt x - 1) = 2 sqrt x + 2 log(sqrt x - 1)`. The asymptotic
is the prime number theorem with the de la Vallee-Poussin error. QED.

**Theorem 3 (coverage; PROVED).** Let `t_0 >= 1` and `Q` satisfy `D(Q) <= R(t_0)`. Then for all
`sigma >= 1/2`, `|t| >= t_0`:

(a) `Re L_Q(sigma + it) >= R(|t|) - sum_{p<=Q} log p/(p^sigma - 1) >= R(t_0) - D(Q) >= 0`;

(b) the truncated chain `M(alpha G) prod_{p<=Q} M(-alpha u_p)` is J-contractive and `|S_Q| <= 1`;

(c) `sigma -> |A_Q(sigma + it)|` is nondecreasing on `sigma >= 1/2`.

The largest admissible `Q` is `Q*(t_0) = (log(t_0/2 pi))^2/16 * (1 + o(1))`. The condition `D(Q) <= R` is
necessary and sufficient for (a) to hold on the whole Bohr torus (g-passive-cascade, local budget), and
(a)-(c) hold verbatim if `Lambda` is replaced by `eps_n Lambda(n)`, `|eps_n| <= 1`, on the primes `p <= Q`.

Proof. (a) Lemma 3.1, monotonicity of `R` on `t >= 1`, and `Re u_p <= log p/(p^sigma - 1) <= log p/(sqrt p - 1)`
(Prop 2(b)). (b) Theorem 1(c). (c) `d/d sigma log|A_Q| = Re L_Q`. For the twist, `|sum_k eps_{p^k} p^{-ks} log p|
<= log p/(p^sigma - 1)`. The asymptotic for `Q*` is Lemma 3.2. QED.

MEASURED `Q*` from the rigorous `R(t)` (checks.log section 3): see Section 8. The values agree with the earlier
measured table (3 at `1e4`, 37 at `1e12`, 107 at `1e20`).

Two corrections to the earlier note's reading of this threshold.

- *It is a torus statement.* `D(Q)` is the sup over the Bohr torus. On the line itself the draw at heights
  `[T, 2T]` is far below `D(Q)` for large `Q` (10.2 against 64.6 for `Q = 1000`, `T = 1e4`; Section 8, table 4),
  because full alignment `p^{it} ~ 1` for all `p <= Q` occurs only at much greater heights. At the heights
  tested this does not buy many primes: on the line `Re s = 1/2` the draw first exceeds the reserve between
  `Q = 3` and `Q = 7` at `T = 1e4` (`Q* = 3`) and between `Q = 7` and `Q = 17` at `T = 1e6` (`Q* = 7`). So the
  theorem is close to sharp on the line as well, at these heights (MEASURED).
  HEURISTIC (Gaussian large deviations with variance `V_Q ~ (1/4) log^2 Q` and about `T` independent samples):
  the first failure on the line is near `log Q ~ sqrt((1/2) log T)`, i.e. `Q ~ 8` at `1e4` and `Q ~ 14` at `1e6`,
  consistent with the measurement. This scale overtakes `Q*(t)` only beyond about `t = 1e30`. Not proved.
- *The mean-square scale.* The torus rms of the draw of the primes `p <= Q` at `sigma = 1/2` is
  `(1/2) log Q + O(1)`, and the reserve is `(1/2) log(t/2 pi)`. They are equal at `Q = c t`. So there are three
  scales at height `t`: worst case `(log t)^2/16` (proved), large deviations `exp(sqrt((1/2) log t))`
  (heuristic), root mean square `~ t` (PROVED as a statement about variances, Prop 2(d)). The last is the
  length of the Dirichlet polynomial that represents zeta at height `t`. Passivity is a no-margin one-sided
  statement at the scale where the typical draw already equals the reserve; this is the lossless/no-margin
  fact of eq48 in chain variables.

## 4. No prime-periodic renormalization (Theorem 4)

A renormalization that "makes each prime section passive with the gamma section absorbing the deficit" is a
choice of `r_p` with `-u_p + r_p` PR on `Re s > 1/2` for each `p` and `G - sum_p r_p` PR there. If `r_p` is
allowed to be any function, existence is equivalent to RH and says nothing. The section stays a prime section
only if `r_p` is a function of `p^{-s}`. Put `h_p = r_p - u_p`.

**Theorem 4 (PROVED, unconditional; uses Lemma M of Section 5).** Suppose `h_p`, `p` prime, are PR on
`Re z > 0`, each `h_p` periodic with period `2 pi i/log p`, `sum_p h_p` converges locally uniformly, and
`L - sum_p h_p` is PR on `Re z > 0`. Then every `h_p` is an imaginary constant. The same holds with the periods
`2 pi i/log p` replaced by arbitrary periods `2 pi i/tau_j`.

Proof. `L = (L - sum h_p) + sum h_p` is PR, so RH holds and `L(z) = sum_{gamma} 1/(z - i gamma)` (paired sum) is
a Foster reactance: in the Herglotz representation `a z + i b + (1/pi) int dmu(y) (1/(z - iy) - ...)` it has
`a = 0` (since `L(x) ~ (1/2) log x`) and `mu_L = pi sum_gamma m_gamma delta_gamma`. Both `h_p` and `L - h_p` are PR
(the latter is `L - sum_q h_q` plus the PR functions `h_q`, `q != p`), so `0 <= mu_{h_p} <= mu_L` and
`0 <= a_{h_p} <= 0`. Hence `mu_{h_p}` is a periodic measure carried by zero ordinates. If it is not zero there
is `y_0` with `xi(1/2 + i(y_0 + 2 pi k/log p)) = 0` for all `k in Z`, contradicting Lemma M. So `mu_{h_p} = 0`
and `h_p = i b_p`. QED.

Reading. The only prime-periodic passive splitting of `L` is the trivial one: everything in one section.
Equivalently: `r_p = u_p + i b_p`, the "renormalized prime section" is empty, and the "gamma section" is
`G - sum u_p = L` itself. In Potapov language this is the statement that the Schur function `S` (if it is one)
has no second-kind (boundary) factor that is periodic; in circuit language, no lossless stub
`c (log p/2) coth((z - i y_0) log p/2)` referred to the axis `Re s = 1/2` can be extracted from `L`, for any
`c > 0`. This covers the referee's "boundary nodes" in the impedance variable, and multi-delay sections that
are series combinations of single-delay PR sections.

OPEN: a PR function that is almost periodic but not a sum of periodic PR functions (a jointly inner function
of several delays `p_1^{-z}, ..., p_m^{-z}`). The support argument is void there, because zero ordinates
become dense at scale `1/log t`; a statement about masses on Bohr sets would be needed.

## 5. No single-delay section at any node (Lemma M, Theorem 5)

**Lemma M (first moment on a vertical progression; PROVED from the CLASSICAL approximate formula).**
Let `tau > 0`, `s_0 = sigma_0 + i b` with `sigma_0 > 0`, `s_k = s_0 + 2 pi i k/tau`. Let `m_0` be the least
integer `> 1` with `log m_0 in tau Z` if one exists, and put `c(s_0) = 1/(1 - m_0^{-s_0})`, or `c = 1` if none
exists. Then `c != 0` and

    sum_{k=1}^N zeta(s_k) = c(s_0) N + o(N),      sum_{k=1}^N zeta'(s_k) = c'(s_0) N + o(N).

For `tau = log m`, `m >= 2` an integer, the error is `O(N^{max(1/2, 1 - sigma_0)} log^2 N)` (`log^3` for `zeta'`).

Proof. CLASSICAL (Titchmarsh Thm 4.11): `zeta(s) = sum_{n<=x} n^{-s} - x^{1-s}/(1-s) + O(x^{-sigma})` uniformly for
`sigma >= sigma_1 > 0`, `|t| < 2 pi x/C`. Take `x = C' N`. The last two terms contribute
`O(x^{1-sigma_0} log N + N x^{-sigma_0})`. For each `n`, `sum_{k<=N} n^{-2 pi i k/tau}` is `N` if `log n in tau Z`
and is at most `1/(2 ||log n/tau||)` otherwise. The resonant `n` are the powers of `m_0`; they give
`N sum_j m_0^{-j s_0} = c N + O(N x^{-sigma_0})`. Non-resonant `n`, case `tau = log m`: for `m^j < n < m^{j+1}`,
`||log n/log m|| >= min(n - m^j, m^{j+1} - n)/(m^{j+1} log m)`, so the block contributes
`O(m^{(j+1)(1 - sigma_0)} j log^2 m)` and the total is `O(x^{1-sigma_0} log^2 x)` for `sigma_0 < 1`, `O(log^3 x)` at
`sigma_0 >= 1`. General `tau`: fix `M`. The `n <= M` contribute `O_{M,tau}(1)`. In a dyadic block `[X, 2X]`,
`X > M`, the points `log n/tau` have gaps between `1/(2 tau X)` and `1/(tau X)`, so near each integer at most two
`n` are closer than a gap (bounded trivially by `N`) and the rest contribute `O(tau X log X)`; the block total is
`O(X^{-sigma_0} (1 + 1/tau)(N + tau X log X))`. Summing, the non-resonant part is
`O(N M^{-sigma_0}) + O_M(1) + O(x^{1-sigma_0} log^2 x) = o(N)`. For `zeta'`, the remainder of the approximate formula
is holomorphic and `O(x^{-sigma})` on a disc of radius `1/log x`, so Cauchy's estimate gives the differentiated
formula with an extra `log x`. QED.

MEASURED (checks.log section 2): see Section 8.

**Theorem 5 (PROVED, unconditional).** Let `Re z_0 >= 0`, `tau > 0`, `z_k = z_0 + 2 pi i k/tau`.

(i) `L` is not equal to one constant `lambda in C` at all `z_k`, `k >= 1`, and `F` does not vanish at all
`z_k`, `k >= 1`.

(ii) `S` admits no representation `S = T_Theta[S_1]` with `S_1` Schur on `Re z > 0` and `Theta` a rational
J-inner function of `e^{-tau z}` having a pole (node) `zeta_0 = e^{-tau z_0}` with `0 < |zeta_0| <= 1`, of any
degree; no delay-line Schur step `S = (rho + e^{-tau z} S_1)/(1 + conj(rho) e^{-tau z} S_1)`, `|rho| < 1`; and no
factorization `S = B S_1` with `B` a nonconstant inner function of `e^{-tau z}`.

Proof. (i) If `F(z_k) = 0` for all `k >= 1` then `zeta(s_k) = 0`, contradicting Lemma M (`c != 0`). Suppose
`L(z_k) = lambda`. Then `zeta'(s_k) = (lambda - G(s_k)) zeta(s_k)`. By Stirling,
`G(s_k) = (1/2) log(t_k/2 pi) + i pi/4 + O(1/k)`, a smooth slowly varying function `g(k)` with `g'(k) = O(1/k)`, plus
`O(1/k)`. Partial summation with Lemma M gives `sum_{k<=N} g(k) zeta(s_k) = (c/2) N log N + o(N log N)`, and the `O(1/k)`
part contributes `O(N^{1/4+eps})` by the convexity bound for zeta. So the right side has modulus
`(|c|/2) N log N (1 + o(1))`, while the left side is `c' N + o(N)` by Lemma M. Contradiction.

(ii) A J-inner factor in `zeta = e^{-tau z}` with an interior node `zeta_0` forces `T_Theta[e](zeta_0)` to be one
value `c`, `|c| < 1`, independent of the load `e` (CLASSICAL: the range of `T_Theta` is the solution set of a
Nevanlinna-Pick problem containing the condition at `zeta_0`). So `S = c` on `z_0 + 2 pi i k/tau`, `k in Z`, i.e.
`alpha L = (1-c)/(1+c)` there: excluded by (i). A boundary node gives `S -> c`, `|c| = 1`, at `z_k`, `Re z_0 = 0`
(plus an angular-derivative bound that is not needed). `S` is meromorphic across the axis, so `S(z_k) = c`:
either `c = -1`, i.e. `F(z_k) = 0` for all `k`, or `alpha L(z_k) = (1-c)/(1+c)` finite; both excluded by (i).
Delay-line step: it forces `S(x) -> rho` as `x -> +inf`, but `L(x) ~ (1/2) log x` gives `S(x) -> -1`.
Multiplicative factor: `B = c zeta^m * Blaschke * singular`. `m >= 1` contradicts `S(x) -> -1`. A singular
factor has a zero radial limit at some boundary point, but `|S| = 1` on the axis (`L` is purely imaginary or
infinite there). A Blaschke zero `zeta_0` gives `S = 0`, i.e. `alpha L = 1`, on a progression: excluded by (i). QED.

**Corollary 5.1 (closes the open case of g-passive-cascade Thm 3(iii); PROVED).** Let `0 < a`,
`R_a(w) = X(w-a)/X(w+a)`, `Re w_0 >= 0`, `c != 0`, and suppose `R_a(w_0 + 2 pi i k/tau) = c` for all `k >= 1`. Put
`sigma_1 = 1/2 + Re w_0 - a`, `sigma_2 = sigma_1 + 2a`. If `sigma_1 > 0` this is impossible. In particular every
interior node `Re w_0 > 0` is excluded for every `a > 0` (for `a >= 1/2` and `sigma_1 <= 0` the earlier proof
applies since then `Re w_0 > 0 = max(0, 1/2 - a)`), and every boundary node `Re w_0 = 0` is excluded for `a < 1/2`.

Proof. The condition is `zeta(s_{1,k}) = c rho_k zeta(s_{2,k})` with `rho_k` the ratio of the gamma factors,
`rho_k = (t_k/2 pi)^a e^{i pi a/2} (1 + O(1/k))` by Stirling. Since `sigma_2 > 1/2`, Lemma M and partial summation
give `|sum_{k<=N} rho_k zeta(s_{2,k})| = |c(s_2)| tau^{-a} N^{1+a}/(1+a) (1 + o(1))`. Since `sigma_1 > 0`,
Lemma M gives `sum_{k<=N} zeta(s_{1,k}) = O(N + N^{1 - sigma_1} log^2 N) = o(N^{1+a})` (if `sigma_1 < 1/2` use
`1 - sigma_1 < 1/2 + a`). Contradiction. QED.

OPEN: boundary nodes of `R_a` for `a >= 1/2` (`sigma_1 <= 0`; needs a first moment of
`chi(s_1) zeta(1 - s_1)` on a progression, a discrete stationary-phase estimate I did not carry out); jointly
inner multi-delay sections (Section 4).

Reading. Sections 4 and 5 together: neither additively (impedance) nor multiplicatively (scattering), neither
at interior nor at boundary nodes, does `S` contain a section that is a function of one delay. The mechanism
in every case is the same first moment: on a progression with step `2 pi/log p` zeta has mean
`1/(1 - p^{-s_0})`, the Euler factor at `p`, which is never zero. The gamma factor then contributes `log t`
growth that a periodic section cannot follow.

## 6. Controls

**Davenport-Heilbronn.** `f = c_1 L(s,chi) + c_2 L(s,chibar)`. Theorem 1(b) fails at the first step: `f'/f` is
not a series chain; it is the parallel junction `lambda L_1'/L_1 + (1 - lambda) L_2'/L_2` with nonconstant
`lambda` (g-passive-cascade Prop 4, refereed). Each branch has its own chain with stubs
`(log p/2) coth((s log p - i arg chi(p))/2)`, and Theorem 3 holds for each branch (it is a unimodular twist).
Theorem 3 does not hold for `f`: there is no `A_Q` for which `|A_Q|` is monotone. Theorems 4 and 5 are
obstructions. Theorem 4's hypothesis implies the function's RH, so for DH it is void. Lemma M applies to any
Dirichlet series with the same kind of approximate formula, with main term `sum` over resonant `n` of
`a(n) n^{-s_0}`; for DH and `tau = log 5` this is `a(1) = 1`, so the conclusion of Theorem 5(i) (no zero
progression) is expected for DH too. I did not verify the approximate formula for `f` and label the DH version
of Theorem 5 OPEN. No statement here separates zeta from DH except Theorem 3 (chain exists; branch-wise only).

**Backward heat.** `H_tau(z) = int e^{tau u^2} Phi(u) e^{izu} du`, `Phi = sum_n phi_n`,
`phi_n(u) = n^{-1/2} phi_1(u + (log n)/2)`. PROVED (change of variable; checked numerically, Section 8):

    H_tau(z) = sum_n n^{-(1+iz)/2} e^{tau (log n)^2/4} g_tau(z + i tau log n),   g_tau(z) = int e^{tau v^2} phi_1(v) e^{izv} dv.

For `tau != 0` the weights `e^{tau (log n)^2/4}` are not multiplicative (`w(6)/(w(2)w(3)) = e^{tau log 2 log 3/2}`) and
the "gamma factor" is evaluated at an `n`-dependent shifted argument. There is no factorization into a gamma
one-port and a product over primes, so Theorem 1(b) and Theorem 3 have no analogue: the argument fails at the
first step, as required. Theorems 4-5 concern zeta only.

**Sign twist.** Theorem 3 holds verbatim for `eps_n Lambda(n)` on `p <= Q`. That is the control result: the
coverage theorem uses only `|Lambda|`, so by the campaign's three-lane lemma it cannot reach all primes. It
is also sharp within its class. For a height `t_0` take `eps_{p^k} = sgn cos(k t_0 log p)`. Then the twisted
draw at `1/2 + i t_0` is `sum_{p<=Q} log p sum_k p^{-k/2} |cos(k t_0 log p)|`, which is `(2/pi) D(Q) (1 + o(1))` for
generic `t_0` and exceeds the reserve once `Q > (pi/2)^2 Q*(t_0) (1 + o(1))` (MEASURED, Section 8). For the
twisted chain the real part of the truncated impedance is then negative at `1/2 + i t_0`. So for sequences
with the size and support of `Lambda` the true coverage is `Theta((log t)^2)`, and anything beyond that must
use where the line `t -> (p^{-it})_p` sits on the torus.

## 7. The exact missing estimate

Write `L = L_Q + T_Q`, `T_Q = (zeta/P_Q)'/(zeta/P_Q)`, which for `Re s > 1` is the tail section
`-sum_{p>Q} u_p`. `T_Q` is meromorphic on `C` with a pole of residue `-1` at `s = 1` and poles of residue
`+m_rho` at the zeros.

**(ME).** For some `Q >= 1` and `t_0`: for all `sigma > 1/2`, `|t| >= t_0`,

    Re T_Q(sigma + it) >= - Re L_Q(sigma + it)      [ where Re L_Q >= R(|t|) - D(Q) by Theorem 3 ].

PROVED (trivial): (ME) for one `Q` is equivalent to "no zeros with `Re s > 1/2`, `|Im s| >= t_0`" (if
`Re L >= 0` near a zero `rho` with `Re rho > 1/2`, the pole `m/(s - rho)` contradicts it; conversely RH gives
`Re L >= 0`). So (ME) is RH above `t_0`, and Theorem 3 only moves a finite, twist-invariant amount of the
budget from one side to the other.

What (ME) asks of the primes, in the terms of Section 2:

1. *It is not a sectionwise statement.* By Theorem 4 no prime-periodic splitting is passive, and by
   Prop 2(d) the torus sup of the tail is `+inf` for every `sigma <= 1`.
2. *It is not a torus-measure statement.* At `sigma = 1/2 + x` the tail defect has torus variance about
   `1/(8x^2)` and the reserve is `(1/2) log(t/2 pi)`. HEURISTIC: with Gaussian tails the torus measure of
   `{Re U > reserve}` is about `exp(-x^2 log^2 t)`, which exceeds `1/t` for `x < (log t)^{-1/2}`. A line
   equidistributed on the torus would then violate (ME) in `(log t)^{-1} << x << (log t)^{-1/2}`. RH says the
   actual line does not. This is the mean-value wall (MV-CAP) in chain variables.
3. *What is needed.* (a) For the long primes `p > C t`: the tail `sum_{n > X} Lambda(n) n^{-s}` must equal its
   density term `X^{1-s}/(s-1)` up to an error small against `log t` on `sigma > 1/2`. For coefficients `1` in
   place of `Lambda(n)` this is the approximate formula (Poisson summation over integers). For `Lambda` it is
   a power-saving prime number theorem with the twist `n^{-it}` at length `X ~ t^A`, which is a zero-free strip
   statement; the known route to such sums is the bilinear structure `Lambda = mu * log` (Vaughan type I/II
   sums), i.e. multiplicativity. A sign-twisted sequence has no density term and no continuation, so the
   tail section does not exist for it. (b) For the head `p <= C t`: a one-sided bound, with no margin, for a
   sum whose root mean square already equals the bound.

Neither (a) nor (b) is supplied here. (a) at `sigma > 7/8` is the content of the 2026 zero-free half-plane;
this note has no new input for it.

## 8. Numerics (MEASURED; `checks.py`, `checks2.py` and their logs)

Table 1 (Theorem 1, `s = 2 + 3i`, `alpha = 1`, dps 25). Group law for an ordered product of 30 prime sections:
error `5e-26`. `S` from the chain with primes to `2e5` against `S` from `xi'/xi`: `2.7e-6` (prime tail about
`5e-6`). `J - M*JM - (Re Z) E`: `1e-26`. `1 - |S|^2 - 4 alpha Re L/|1 + alpha L|^2`: `6e-27`.

Table 2 (Lemma M; `s_k = sigma_0 + ib + 2 pi i k/log m`).

`checks2.py` computes zeta and zeta' by Euler-Maclaurin in double precision (cross-checked against mpmath to
`2e-7` or better at three points; the `N = 500` row was also computed with mpmath alone, same digits,
`checks2_mpmath_partial.log`).

| tau | sigma_0, b | N | mean of zeta(s_k) | predicted c | mean of zeta'(s_k) | predicted c' |
|---|---|---|---|---|---|---|
| log 2 | 0.5, 0.3 | 500 | 2.7309 - 1.1443i | 2.6505 - 1.2557i | -2.632 + 3.093i | -1.939 + 3.744i |
| log 2 | 0.5, 0.3 | 2000 | 2.7093 - 1.2197i | same | -2.463 + 3.534i | same |
| log 2 | 0.5, 0.3 | 6000 | 2.6741 - 1.2512i | same | -2.197 + 3.759i | same |
| log 3 | 0.5, 1.1 | 4000 | 0.8707 - 0.5854i | 0.8607 - 0.5842i | 0.426 + 0.487i | 0.507 + 0.463i |
| log 2 | 0.75, 0 | 4000 | 2.4597 | 2.4667 | -2.454 | -2.508 |
| log 2 | 0.2, 0.3 | 4000 | 3.470 - 3.478i | 2.731 - 3.312i | -2.30 + 13.82i | 4.33 + 10.24i |
| 1 (no resonance) | 0.5, 0.3 | 4000 | 0.9826 - 0.0036i | 1 | 0.129 + 0.034i | 0 |
| (log 6)/2 (m_0 = 6) | 0.5, 0 | 4000 | 1.6415 + 0.0053i | 1.6899 | -1.687 | -2.089 |

The means of zeta converge to `c` at the rate the lemma gives (slowest at `sigma_0 = 0.2`, error exponent
`N^{-0.2}`); the means of zeta' converge more slowly (extra logarithm). Theorem 5(i): for `tau = log 2`,
`s_0 = 1/2 + 0.3i`, `|sum G(s_k) zeta(s_k)|/N` is 8.62, 10.62, 12.13 at `N = 500, 2000, 6000`, tracking
`(|c|/2) log N` = 9.11, 11.15, 12.76, while `|sum zeta'(s_k)|/N` stays near 4.1 to 4.4. Corollary 5.1 with `a = 0.2`,
`w_0 = 0.1 + 0.3i`, `tau = log 2`: `|sum (t_k/2 pi)^a zeta(s_{2,k})|/N^{1+a}` = 1.980, 1.978 at `N = 1000, 4000` (predicted
`|c(s_2)| tau^{-a}/(1+a) = 1.975`), and `|sum zeta(s_{1,k})|/N` = 3.40, 3.39 (predicted limit `|c(s_1)| = 3.31` at
`s_1 = 0.4 + 0.3i`; the lemma's error term at `sigma_0 = 0.4` is `N^{-0.4} log^2 N`). The first sum grows like `N`, the second
like `N^{1+a}`.

Table 3 (Theorem 3). Minimum of `Re G - R(t)` over the grid `sigma in {0.5,...,50}`, `t in {1,...,1e9}`:
`3.3e-10 > 0` (attained at `t = 1e9`, where the slack is the `1/(3t)` term). `D(Q)` against `2 sqrt Q` and the
Lemma 3.2 bound: `Q = 37`: 12.518, 12.166, 19.49; `Q = 1000`: 64.597, 63.246, 75.05; `Q = 2e6`: 2833.27, 2828.43,
2892.93.

| t | R(t) | Q* (largest Q with D(Q) <= R(t)) | (log(t/2 pi))^2/16 |
|---|---|---|---|
| 1e2 | 1.3803 | none | 0.5 |
| 1e4 | 3.6862 | 3 | 3.4 |
| 1e6 | 5.9888 | 7 | 9.0 |
| 1e9 | 9.4427 | 17 | 22.3 |
| 1e12 | 12.8966 | 37 | 41.6 |
| 1e15 | 16.3504 | 59 | 66.8 |
| 1e20 | 22.1069 | 107 | 122.2 |
| 1e30 | 33.6198 | 263 | 282.6 |
| 1e100 | 114.2103 | 3167 | 3261.0 |
| 1e300 | 344.4688 | 29153 | 29664.7 |

Table 4 (torus sup against the line, `sigma = 1/2`; grid of 4e5 points on `[T, 2T]` (1e5 for `Q = 1e4`), so the
line maximum is a lower bound, undersampled at `T = 1e6`).

| T | Q | torus sup D(Q) | line max on [T,2T] | reserve | line rms | torus rms |
|---|---|---|---|---|---|---|
| 1e4 | 3 | 3.174 | 3.174 | 3.686 | 0.736 | 0.736 |
| 1e4 | 7 | 5.659 | 5.163 | 3.686 | 1.087 | 1.087 |
| 1e4 | 37 | 12.518 | 7.459 | 3.686 | 1.743 | 1.743 |
| 1e4 | 1000 | 64.597 | 10.210 | 3.686 | 3.362 | 3.361 |
| 1e4 | 10000 | 202.566 | 11.712 | 3.686 | 4.518 | 4.527 |
| 1e6 | 7 | 5.659 | 5.454 | 5.989 | 1.087 | 1.087 |
| 1e6 | 17 | 8.585 | 7.519 | 5.989 | 1.412 | 1.412 |
| 1e6 | 1000 | 64.597 | 13.709 | 5.989 | 3.361 | 3.361 |
| 1e6 | 10000 | 202.566 | 14.275 | 5.989 | 4.525 | 4.527 |

Root-mean-square scale: the first `Q` with torus rms of the draw `>=` reserve is 1901 at `t = 1e4` (`t/2 pi = 1592`)
and 180847 at `t = 1e6` (`t/2 pi = 159155`), a ratio of about 1.15 to `t/2 pi`.

Table 5 (sign twist `eps_{p^k} = sgn cos(k t_0 log p)`): the twisted draw at `1/2 + i t_0` first exceeds the reserve at
`Q = 5, 19, 43, 73` for `t_0 = 1e4, 1e6, 1e9, 1e12`, against `Q* = 3, 7, 17, 37`. Ratios 1.7 to 2.7; predicted
`(pi/2)^2 = 2.47` asymptotically.

Table 6 (backward heat, `tau = -0.05`, `n = 3`, `z = 1.3 + 0.4i`): the two sides of the term formula differ by `2.6e-12`
(value `0.116`). `w(6)/(w(2)w(3)) = 0.98114`, not 1.

## 9. Three weakest steps

1. Lemma M for general `tau` (no integer resonance) is proved with a qualitative `o(N)` by a dyadic counting
   argument written in a few lines; the integer case `tau = log m`, which is the one the prime sections need,
   has an explicit error and is checked numerically. The differentiated approximate formula for `zeta'` is
   obtained by Cauchy's estimate from Titchmarsh 4.11, quoted from memory.
2. Theorem 5(ii) uses the classical fact that a rational J-inner factor with a node imposes one
   load-independent interpolation value at that node. For degenerate factors (node of `Theta` cancelled by a
   zero, or the load-independent value on the unit circle at an interior node) I did not write the case
   analysis; the delay-line step and the multiplicative factor are treated separately and directly.
3. The large-deviation scale `exp(sqrt((1/2) log t))`, the Gaussian statement in Section 7 item 2 and the
   decomposition 3(a)/(b) are heuristic readings, not theorems. Theorem 4 covers only splittings into
   single-period PR pieces; the jointly inner multi-delay case and the `R_a` boundary nodes for `a >= 1/2`
   remain open.
