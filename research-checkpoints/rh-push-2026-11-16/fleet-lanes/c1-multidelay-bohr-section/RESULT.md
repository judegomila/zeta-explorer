# c1-multidelay-bohr-section: jointly inner multi-delay sections of the prime chain

Date: 2026-11-17. Scratch research note, unreviewed. No RH claim. No statement about zeros of zeta is made.
Labels: PROVED (argument given here), CLASSICAL (published theorem, cited), MEASURED (numpy/mpmath float64 on a
grid, not interval-certified), HEURISTIC, OPEN.
Files in this directory: `test1.py/.log/.json` (decisive test), `test2.py`, `test2_phi*.log/.json` (first-moment
check), `test3.py/.log/.json` (pole term), `test4.py/.log/.json` (tapered section), `test5.py/.json` (DH bracket).
All runs local through `scripts/memcap.sh 8`; longest run 8 minutes. The compute server was not used.

## Verdict

**Precise obstruction. The lead is closed in the forms tested; three statements are proved; one restatement is recorded.**

1. **Rigidity (Lemma 1, PROVED).** A block of prime sections has no matrix or torus freedom. The sections
   `M(-alpha u_p)` lie in one abelian unipotent group, so the joint section of a prime set `P` is `M(-alpha U_P)`,
   `U_P = sum_{p in P} u_p`, with exact rank-one J-defect `-Re U_P * [[1,1],[1,1]]`. "The joint section of `P` on the
   gamma one-port is J-contractive at `s`" is the scalar inequality `Re U_P(s) <= Re G(s)`. Joint contractivity is the
   one-sided largest-value statement itself, not a tool for it.
2. **Decisive test (MEASURED).** At `sigma = 1/2` the sharp chain with true phases loses contractivity at the same
   prime as every sign and unimodular twist tested (first failing `Q` = 2, 2, 3 on `[10,1e2]`, `[1e2,1e3]`,
   `[1e3,1e4]`): exactly the Q11 count. In `sigma` the true phases do better than the torus sup and than all 15 random
   twists (`P = {p <= 300}`, `t in [1e3,1e4]`: loss of contractivity up to `sigma = 0.76` for zeta, 0.90 to 0.98 for
   random twists, 1.11 to 1.25 for the torus sup), but not down to `1/2`, and the gain is explained by item 5.
3. **No jointly lossless multi-delay section, additive form (Theorems A and B, PROVED, unconditional).** For a
   finite prime set `P` and `H` holomorphic on the polydisc `D^P` with `Re H >= 0`, put `h(z) = H((p^{-z})_p)`,
   `z = s - 1/2`. If `L - h` is positive-real on `Re z > 0` then `h` is an imaginary constant. This closes the case
   left OPEN in `sq-causal-cascade` Section 4 and in row Q12 (a PR function of several delays that is not a sum of
   single-delay PR functions). The proof is a weighted first moment of zeta over the poles of `h`:
   `sum r_j zeta(1/2 + i gamma_j) = (T/2 pi)(H(0) + conj h(1/2)) + o(T)`, with real part at least
   `(T/2 pi) Re H(0) > 0`. Checked numerically on a two-delay non-periodic example (Section 4).
4. **No jointly inner multi-delay factor, multiplicative form (Proposition C, PROVED).** If `S = B S_1` with `S_1`
   Schur and `B = b((p^{-z})_p)`, `b` holomorphic with `|b| <= 1` on `D^P`, then `b` is a unimodular constant.
5. **What the true phases have and twists lack is the zero side (Proposition D, PROVED equivalence; restatement).**
   With Fejer weights the finite joint section over all prime powers `n <= Q` satisfies the exact identity
   `G - U^F_Q + G'/lam + Q^{1-s}/((1-s)^2 lam) - triv = sum_rho k_lam(s - rho)`, `lam = log Q`,
   `k_lam(a) = int_0^lam (1 - u/lam) e^{-au} du`, and `Re k_lam(a) >= 0` for `Re a >= 0` (Polya). RH holds iff the
   left side is positive-real on `Re s > 1/2` for every `Q`. MEASURED: for zeta the tapered section is contractive on
   `sigma in {0.5, 0.6, 0.75}`, `t in [100, 1e4]` for `Q = 30, 100, 300, 1000` (margins 0.05 to 0.45); every sign and
   unimodular twist tested violates it for `Q >= 100` at `sigma = 0.5` and `0.6`; `L(s,chi_5)` passes with its own gamma factor and fails with
   zeta's; Davenport-Heilbronn and `E_a` fail. The identity uses the functional equation and the zero measure, holds
   for every control with a functional equation, and uses no multiplicativity: it is a member of wall part 2 (an
   identity in which RH is a sign), and of row Q13.
6. **R4 (PROVED from the prime number theorem).** At fixed `1/2 <= sigma < 1` and fixed height window the sharp joint
   section over all primes `<= Q` is not contractive for all large `Q`: `U_Q(s) = Q^{1-s}/(1-s) + o(Q^{1-sigma})`.
   A joint section does not give a one-sided largest-value bound on a line where the chain is only `l^2`.

Nothing here moves RH. The one pivot allowed was used: from constructing a jointly inner section (killed by items
1, 2, 6) to proving that none exists (items 3, 4).

## 0. Plan: what is new against the map

| Item | Overlap | What this note adds |
|---|---|---|
| Q10, Q11 (`sq-causal-cascade` Thm 1-3) | Chain identity; coverage `Q*(t) = (log(t/2 pi))^2/16`, same for every twist; Table 4 line maxima at `sigma = 1/2` | Thresholds in `sigma` for true phases, 20 twists, `chi_5`, DH two-factor form, `E_a` (Section 2); the tapered section (Section 5). |
| Q12 (`sq-causal-cascade` Thm 4-5; `g-passive-cascade` Thm 3 + REFEREE item 3) | Single-delay no-go at every node; multi-delay OPEN | Theorems A, B and Proposition C: the multi-delay case in additive and multiplicative form. |
| Section 6 item 7 of the map | "A multi-delay construction must use phases on the Bohr torus at one point" | Lemma 1 makes this exact; Section 2 measures it; Proposition D names what the phases carry. |
| Q13 (ME) | Residual inequality equivalent to RH | Proposition D is a variant in which every finite stage is true under RH, with explicit compensators. Same wall. |

Notation as in `sq-causal-cascade`: `s = 1/2 + z`, `F(z) = xi(1/2+z)`, `L = F'/F = G + zeta'/zeta`,
`G(s) = 1/s + 1/(s-1) - (1/2) log pi + (1/2) psi(s/2)`, `u_p = log p/(p^s - 1)`, `S = (1 - alpha L)/(1 + alpha L)`,
`M(Z) = I + (Z/2)[[-1,-1],[1,1]]`, `J = diag(1,-1)`. PR = holomorphic with nonnegative real part.

## 1. First lemma: classification of joint sections of a finite prime set

**Lemma 1 (PROVED).** Let `P` be a finite set of primes, `r_p = p^{-sigma}`, and for `theta in T^P`

    Phi_sigma(theta) = sum_{p in P} log p * Re( r_p e^{-i theta_p} / (1 - r_p e^{-i theta_p}) )
                     = sum_{p in P} log p * (r_p cos theta_p - r_p^2)/(1 - 2 r_p cos theta_p + r_p^2).

(a) `prod_{p in P} M(-alpha u_p) = M(-alpha U_P)` in any order, and
`J - M(-alpha U_P)* J M(-alpha U_P) = -alpha Re U_P * [[1,1],[1,1]]`. Hence the chain "gamma section, then the block
`P`" is J-contractive at `s = sigma + it` iff `Phi_sigma((t log p)_p) <= Re G(s)`. Every regrouping of the block into
sub-blocks has the same total defect.

(b) `max Phi_sigma = D_sigma(P) = sum log p/(p^sigma - 1)` at `theta = 0`; `min Phi_sigma = -sum log p/(p^sigma + 1)`
at `theta = (pi,...,pi)`; the Haar mean is 0 and the variance is `sum log^2 p/(2(p^{2 sigma} - 1))`.

(c) A completely multiplicative twist `p^{-s} -> eps_p p^{-s}`, `|eps_p| = 1`, is the translation
`theta -> theta - arg eps` of the torus (a sign twist is a translation by a 2-torsion point). The closure of
`{(t log p)_p : t in R}` is `T^P` (CLASSICAL: Kronecker, by unique factorization). So for every `sigma` the supremum
of the joint defect over the whole line is `D_sigma(P)` for zeta and for every twist: the set of `sigma` at which the
block is contractive against a constant reserve `R` for all `t` is `{D_sigma(P) <= R}`, the same for all phases.

(d) The true line passes through the maximiser `theta = 0` at `t = 0`. The pole of zeta at `s = 1` is this alignment.

Proof. (a) is Theorem 1 of `sq-causal-cascade` (the map `Z -> M(Z)` is a homomorphism of `(C,+)`), applied to the
sum. (b) `Re(w/(1-w))` on `|w| = r` is monotone in `cos(arg w)` with range `[-r/(1+r), r/(1-r)]`; each term has mean
zero and mean square `r^2/(2(1-r^2))`. (c), (d) are immediate. QED.

Consequence for the lead. Because the defect is rank one and additive, there is no "matrix-valued or torus-valued
inner function" attached to a block other than the scalar function `Phi_sigma` on the torus. A statement that beats
Q11 must be about where the orbit `t -> (t log p)_p`, restricted to a height window, sits relative to the set
`{Phi_sigma > (1/2) log(t/2 pi)}`. A twist moves the orbit by a translation, under which Haar measure, the sup and
every moment are invariant (CLASSICAL: for a trigonometric polynomial of degree `k` in the phases of the primes
`<= Q`, the mean over `[T, 2T]` differs from the Haar mean by at most `4 ||F^||_1 Q^k/T`, for the true orbit and for
every translate).

## 2. Decisive first test (MEASURED; `test1.py`)

Grid: `t` from 10 to `1e4`, step 0.02; `sigma` from 0.50 to 1.60, step 0.02; `P = {p <= Q}`, `Q = 30, 100, 300`.
The window `[0, 10]` is excluded: by Lemma 1(d) the true orbit starts at the torus maximiser, and `Re G < 0` near
`t = 0`, so every chain fails there. Reported: `sigma*` = largest grid `sigma` at which
`max_t (Re U_Q - Re G) > 0` in the window. Entries are `Q = 30 / 100 / 300`. Grid maxima are lower bounds.

| Phases | `[10, 1e2]` | `[1e2, 1e3]` | `[1e3, 1e4]` |
|---|---|---|---|
| zeta (true phases) | 0.96 / 1.10 / 1.08 | 0.90 / 0.80 / 0.78 | 0.84 / 0.80 / 0.76 |
| 10 random sign twists (range) | 1.30 to >= 1.60 | 1.02-1.16 / 1.02-1.18 / 1.00-1.20 | 0.86-0.94 / 0.90-0.94 / 0.92-0.98 |
| 5 random unimodular twists (range) | >= 1.60 | 1.02-1.08 / 1.06-1.14 / 1.06-1.12 | 0.84-0.92 / 0.88-0.94 / 0.90-0.96 |
| sign twist `sgn cos(t_0 log p)`, `t_0 = 5000` | 1.34 / 1.34 / 1.34 | 1.06 / 1.10 / 1.10 | 0.88 / 0.92 / 0.96 |
| `chi_5` chain with zeta's `G` | >= 1.60 | 1.00 / 1.02 / 0.92 | 0.84 / 0.86 / 0.82 |
| `chi_5` chain with its own gamma term | 0.84 / 0.82 / 0.80 | 0.80 / 0.76 / 0.76 | 0.70 / 0.76 / 0.72 |
| DH two-factor form `c_1 P_Q(chi) + c_2 P_Q(chibar)` | 0.84 / 0.82 / 0.76 | 0.82 / 0.86 / 0.86 | 0.82 / 0.86 / 0.88 |
| `E_a`, `a = 0.2` | 1.00 / 1.16 / 1.14 | 0.94 / 0.86 / 0.86 | 0.88 / 0.86 / 0.82 |
| torus sup, reserve at window bottom | 2.53 / 2.54 / 2.54 | 1.40 / 1.47 / 1.50 | 1.08 / 1.19 / 1.25 |
| torus sup, reserve at `t = 1e4` | | | 0.91 / 1.04 / 1.11 |

At `sigma = 1/2`:

- First prime `Q` at which the chain `{p <= Q}` fails in the window: 2, 2, 3 for the three windows, for zeta and for
  19 of the 20 twisted chains; the exception is one TW+ sample, which deletes primes (2, 2, 11). This equals the coverage count of Q11 at the window bottom (reserve 0.23, 1.38,
  2.53 against `D(2) = 1.67`, `D(3) = 3.17`). At `sigma = 1/2` true phases do not beat Q11 by one prime.
- Maximum draw `max_t Re U_Q` on `[1e3, 1e4]`: zeta 6.67 / 8.26 / 9.24; random sign twists 7.29-8.35 / 8.84-11.64 /
  11.10-13.07; torus sup 11.06 / 20.26 / 35.65; reserve at most 3.69.

Reading.

1. The true phases are below the torus sup by a large factor and below every random twist by a moderate one, and
   their `sigma*` decreases as `Q` grows while that of the twists increases. The DH form has violations of size
   `10^2` to `10^3` for `sigma <= 0.82` (poles of `f_Q'/f_Q`), then none on the grid.
2. None of this is a contractivity range at `sigma = 1/2`: the sharp chain fails there at `Q = 2` or `3`.
3. The difference between zeta and the twists is one-sidedness of the draw: for zeta, `Re U_Q` is the reserve minus
   a smoothed zero count plus a pole term (Section 5), so its upper tail is cut; for a twist with zeta's `G` there
   is no such relation. `L(s, chi_5)` with its own gamma term behaves like zeta, with zeta's it behaves like a twist.
   So the step at which twists separate is the functional equation paired with the correct gamma section, not a
   property of the Kronecker structure of finitely many primes.

The test kills the lead as stated: the joint section with true phases has no proved contractivity range beyond Q11,
and its measured advantage is the zero side seen through the explicit formula.

## 3. `|P| -> infinity` at fixed `sigma < 1` (R4)

**Proposition 3 (PROVED from CLASSICAL PNT).** Let `1/2 <= sigma < 1` and `0 < t_0 < t_1`. There is `Q_0` such that
for every `Q >= Q_0` there is `t in [t_0, t_1]` with `Re U_Q(sigma + it) > Re G(sigma + it)`.

Proof. `sum_{p <= Q} log p * p^{-s} = int_2^Q x^{-s} d theta(x) = Q^{1-s}/(1-s) + O_s(Q^{1-sigma} exp(-c sqrt(log Q)))`,
uniformly for `t in [t_0, t_1]`, by partial summation and the prime number theorem with remainder; the prime powers
`k >= 2` add `O(log Q)`, which is `o(Q^{1-sigma})`. On any `t`-interval of length `2 pi/log Q` the
argument of `Q^{-it}/(1 - s)` covers a full turn, so `Re U_Q >= (1 - o(1)) Q^{1-sigma}/|1 - s|` at some `t` in the
window, which exceeds `sup Re G` on the window for large `Q`. QED.

MEASURED (`test3.py`, `t in [14, 40]`): at `sigma = 0.75` the excess `max (Re U_Q - Re G)` is 0.37, 0.53, 0.98, 1.87
for `Q = 1e3, 1e4, 1e5, 1e6`, against pole sizes `Q^{1/4}/|1-s|` = 0.36, 0.60, 1.11, 2.03; `|U_Q + zeta'/zeta -
Q^{1-s}/(1-s)|` falls from 0.64 to 0.10. At `sigma = 1/2` the excess is 4.0, 7.6, 20.0, 66.4.

Reading. The limit of joint sections at fixed `sigma < 1` fails for zeta because of the pole. A random sign twist has
no pole term (its prime sum converges almost surely for `sigma > 1/2`), so in this limit zeta is worse than a random
twist. Removing the pole with a compensator turns the statement into (ME) of Q13 or into Proposition D below.

## 4. Pivot: no jointly lossless multi-delay section

**Theorem A (weighted first moment over the poles of a lossless multi-delay one-port; PROVED, unconditional).**
Let `P` be a finite set of primes, `H` holomorphic on `D^P` with `Re H >= 0`, `h(z) = H((p^{-z})_{p in P})` for
`Re z > 0`. Suppose `h` extends meromorphically to a neighbourhood of `Re z >= 0` with `Re h = 0` on `Re z = 0` off
the poles (equivalently: the boundary measure of `Re h` is a locally finite sum of atoms `pi r_j delta_{gamma_j}`,
`r_j > 0`). Then for `T -> infinity` along a suitable sequence in every interval `[T, T+1]`,

    sum_{1 < gamma_j <= T} r_j zeta(1/2 + i gamma_j) = (T/2 pi) ( H(0) + conj(h(1/2)) ) + o(T),

and `Re(H(0) + conj h(1/2)) >= Re H(0) > 0` unless `h` is an imaginary constant. In particular the poles of `h`
are not all zeros of `zeta(1/2 + z)`.

Proof. (i) Coefficients. Write `H(w) = sum_m h^(m) w^{(m)}` over `P`-smooth integers `m` (`w^{(m)} = prod w_p^{v_p(m)}`),
so `h(z) = sum_m h^(m) m^{-z}`. For `m > 1` the conjugate of `H` has no frequency `m`, so
`h^(m) rho^{(m)} = int 2 Re H(rho e^{i theta}) e^{-i m.theta} d theta` and `|h^(m)| <= 2 Re H(0)` (Caratheodory).
Hence `sum_m |h^(m)| m^{-c} <= 2 Re H(0) prod_{p in P} (1 - p^{-c})^{-1} < infinity` for every `c > 0`.
(ii) Reflection. `h(-conj z) = -conj h(z)`, so on `Re z = -c`: `h(-c + it) = -sum_m conj(h^(m)) m^{-c} m^{it}`.
(iii) Contour. Fix `0 < c < 1/2`. Integrate `zeta(1/2 + z) h(z)/(2 pi i)` over the boundary of
`[-c, c] x [1, T]`; the residues give the left side. Use `zeta(s) = sum_{n <= X} n^{-s} - X^{1-s}/(1-s) + O(X^{-sigma})`,
`X = C T`, uniformly for `sigma >= 1/2 - c > 0`, `1 <= t <= T` (CLASSICAL: Titchmarsh Thm 4.11).
Right side `Re z = c`: the only pair `(n, m)` with zero frequency is `n = m = 1`, giving `h^(1) T = H(0) T`; all other
pairs give at most `2/log(nm)`, total `O(T^{1/2 - c} sum_m |h^(m)| m^{-c})`.
Left side `Re z = -c` (downward, with the sign in (ii)): the pairs `n = m` give
`T sum_{m <= X} conj(h^(m)) m^{-c} m^{-1/2 + c} -> T conj(sum_m h^(m) m^{-1/2}) = T conj h(1/2)`; pairs `n != m` give
`O(n^{-1/2+c} m^{-c}/|log(m/n)|)`, total `O(T^{1/2 + c} log T sum_m |h^(m)| m^{-c}) = o(T)`. The terms
`X^{1-s}/(1-s)` and `O(X^{-sigma})` contribute `O(T^{1/2 + c} log T)`.
Horizontal sides: the masses `r_j` in a unit interval are bounded by `C sup_t Re h(1 + it)`, so
`int_T^{T+1} int_{-c}^{c} |h(x + iy)| dx dy = O(1)` and some height in `[T, T+1]` has `int |h| dx = O(1)`; with the
convexity bound `zeta(1/2 + x + iT) = O(T^{1/4 + c/2 + eps})` the horizontal sides are `o(T)`.
(iv) Sign. `Re H(0) >= 0` and `Re h(1/2) >= 0`; if `Re H(0) = 0` the minimum principle gives `Re H = 0` identically.
QED.

Special cases. `h = (log p/2) coth(z log p/2)`: `H(0) = log p/2`, `r_j = 1`, and the formula is Lemma M of
`sq-causal-cascade` at `s_0 = 1/2` (mean `1/(1 - p^{-1/2})`). `h = D'/D + (log N)/2` for a Dirichlet polynomial
`D = sum_{n | N} a_n n^{-z}` with all zeros on `Re z = 0` (a Lee-Yang polynomial in the delays): the mean of zeta over
the zeros of `D` is `1/2 + conj(h(1/2))/log N`, real part above `1/2`. So no Dirichlet polynomial with all its
zeros on the critical line has all of them at zeros of zeta.

MEASURED (`test2.py`): `H = (1 + e^{i phi} b)/(1 - e^{i phi} b)` with the rational inner function
`b(w_1, w_2) = (2 w_1 w_2 - w_1 - w_2)/(2 - w_1 - w_2)` on the bidisc, `w_1 = 2^{-z}`, `w_2 = 3^{-z}` (poles not on a
progression; pole density `log 6/(2 pi)`).

| `phi` | `T` | poles | `sum r_j` (predicted `T Re H(0)/pi`) | `2 pi sum r_j zeta(1/2 + i gamma_j)/T` | predicted `H(0) + conj h(1/2)` |
|---|---|---|---|---|---|
| 1.0 | 1000 | 279 | 318.21 (317.99) | 1.2796 + 0.4538i | 1.2681 + 0.5157i |
| 1.0 | 3000 | 837 | 955.00 (954.61) | 1.2890 + 0.5271i | same |
| 1.0 | 6000 | 1672 | 1909.71 (1909.54) | 1.2557 + 0.5107i | same |
| 2.5 | 1000 | 282 | 317.16 (317.99) | 2.5735 + 2.2501i | 2.5067 + 2.0609i |
| 2.5 | 3000 | 847 | 954.73 (954.61) | 2.5028 + 2.1405i | same |
| 2.5 | 6000 | 1693 | 1909.02 (1909.54) | 2.4622 + 2.1204i | same |

**Theorem B (no jointly PR multi-delay splitting; PROVED, unconditional).** Let `P` be finite, `H` holomorphic on
`D^P` with `Re H >= 0`, `h(z) = H((p^{-z})_p)`. If `L - h` is PR on `Re z > 0`, then `h` is an imaginary constant.

Proof. As in Theorem 4 of `sq-causal-cascade`: `L = (L - h) + h` is PR, so its Herglotz measure is
`mu_L = pi sum_gamma m_gamma delta_gamma` with no linear term, and `0 <= mu_h <= mu_L`, `a_h = 0`. So `h` satisfies the
hypothesis of Theorem A with every pole at a zero of `zeta(1/2 + z)`. The left side of Theorem A is then 0, so
`Re H(0) + Re h(1/2) = 0`, and `h` is an imaginary constant. QED.

The hypothesis implies RH, as in Theorem 4 there; the theorem says that even granting RH the only PR function of
finitely many prime delays that can be split off `L` is trivial. It includes sums of single-delay PR functions
(Theorem 4) and the non-separable case (rational inner functions of several delays, Lee-Yang polynomials) that was
OPEN.

**Proposition C (no jointly inner multiplicative factor; PROVED).** Let `P` be finite and `b` holomorphic on `D^P`
with `|b| <= 1`. If `S = B S_1` on `Re z > 0` with `B(z) = b((p^{-z})_p)` and `|S_1| <= 1`, then `b` is a unimodular
constant.

Proof. `L(x) ~ (1/2) log x` as `x -> +infinity`, so `S(x) -> -1`. Then `|b((p^{-x})_p)| >= |S(x)| -> 1` and
`b((p^{-x})_p) -> b(0)`, so `|b(0)| = 1` and `b` is constant by the maximum principle. QED.

Where multiplicativity enters. In step (iii) of Theorem A the left-side main term is
`sum_m conj(h^(m)) a_m m^{-1/2}` with `a_m = 1` the coefficients of zeta. It equals `conj H` at the point
`(conj(a_p) p^{-1/2})_p` of the polydisc exactly when `a` is completely multiplicative with `|a_p| <= 1`; the sign
`Re >= 0` is then the positivity of `Re H` at an interior point. For the DH coefficients the term is
`c_1 conj H(chibar(p) p^{-1/2}) + c_2 conj H(chi(p) p^{-1/2})` with complex `c_1, c_2`, which is not a point evaluation
and has no forced sign (`test5.py`: in the three-parameter family of rotated `b` above its real part stays above
1.15, so no counterexample was found; the DH analogue of Theorems A and B is OPEN). This is a use of multiplicativity
in a no-go, not in an attack.

OPEN: (i) a general linear-fractional section `S = T_Theta[S_1]` with `Theta` a J-inner function of several delays
that is neither `M(alpha h)` nor diagonal. Partial reduction: `S(x) -> -1` forces the image disc of `T_{Theta(0)}`
to be a horodisc at `-1`, so `Theta(0) = M(c_0) U_0` with `c_0 >= 0` and `U_0` J-unitary, and `c_0 = 0` forces
`Theta` constant; the case `c_0 > 0` with non-additive `Theta` is not treated. (ii) infinite `P` (step (i) of
Theorem A needs `sum_{m in <P>} m^{-c} < infinity` for some `c < 1/2`). (iii) the DH analogue.

## 5. What the phases carry: the tapered joint section (Proposition D)

Let `lam = log Q`, `U^F_Q(s) = sum_{n <= Q} Lambda(n) (1 - log n/lam) n^{-s}`,
`k_lam(a) = int_0^lam (1 - u/lam) e^{-au} du = 1/a - (1 - e^{-a lam})/(a^2 lam)`, and

    Phi_Q(s) = G(s) - U^F_Q(s) + G'(s)/lam + Q^{1-s}/((1-s)^2 lam) - sum_{k>=1} Q^{-2k-s}/((2k+s)^2 lam).

**Proposition D.** (a) (CLASSICAL explicit formula, rearranged) `Phi_Q(s) = sum_rho k_lam(s - rho)` for all `s`, the
sum over nontrivial zeros in symmetric order. (b) (PROVED) `Re k_lam(a) >= 0` for `Re a >= 0`. (c) (PROVED) RH holds
iff `Re Phi_Q(s) >= 0` on `Re s > 1/2` for every `Q >= 2`.

Proof. (a) `U^F_Q(s) = (1/2 pi i) int_{(c)} -zeta'/zeta(s + w) Q^w/(w^2 lam) dw`; the residues at `w = 0` (double),
`w = 1 - s`, `w = rho - s`, `w = -2k - s` give
`U^F_Q = -zeta'/zeta - (zeta'/zeta)'/lam + Q^{1-s}/((1-s)^2 lam) - sum_rho Q^{rho-s}/((rho-s)^2 lam) - triv`; insert
`zeta'/zeta = -G + sum_rho 1/(s - rho)`. (b) `Re k_lam(x + iy) = int_0^lam (1 - u/lam) e^{-xu} cos(yu) du`, and
`(1 - u/lam) e^{-xu}` is nonnegative, decreasing and convex on `[0, lam]` for `x >= 0` (Polya's criterion).
(c) If RH holds, every `s - rho` has `Re >= 0` on `Re s >= 1/2`; use (b). Conversely, the `Phi_Q` are PR on
`Re s > 1/2`, hence a normal family; on `Re s > 1` they converge to `G + zeta'/zeta = L` as `Q -> infinity`
(absolute convergence; the compensators tend to 0). By Vitali they converge on `Re s > 1/2` to a holomorphic
function, so `L` has no pole there. QED.

MEASURED (`test4.py`; `t in [100, 1e4]`, step 0.02; maximum of `Re U^F_Q - Re G_ref` over the window, negative =
contractive; columns `Q = 30, 100, 300, 1000`):

| Coefficients, reserve | `sigma = 0.5` | `sigma = 0.6` | `sigma = 0.75` |
|---|---|---|---|
| zeta, `G` | -0.124, -0.064, -0.057, -0.052 | -0.260, -0.288, -0.269, -0.187 | -0.438, -0.448, -0.403, -0.351 |
| 5 random sign twists, `G` (range) | -0.03 to 0.63, 1.22 to 1.71, 2.02 to 2.46, 3.01 to 3.34 | -0.24 to 0.32, 0.73 to 1.14, 1.17 to 1.60, 1.81 to 2.03 | -0.44 to -0.06, -0.06 to 0.51, 0.33 to 0.82, 0.60 to 1.05 |
| 3 random unimodular twists, `G` (range) | 0.22 to 0.49, 1.26 to 1.61, 1.94 to 2.31, 2.54 to 3.84 | -0.03 to 0.13, 0.76 to 0.99, 1.23 to 1.53, 1.61 to 2.25 | -0.34 to -0.23, 0.19 to 0.30, 0.46 to 0.66, 0.76 to 1.02 |
| sign twist `sgn cos(5000 log p)`, `G` | 0.265, 1.320, 2.109, 4.771 | -0.031, 0.776, 1.352, 2.119 | -0.381, 0.161, 0.532, 0.826 |
| `chi_5`, zeta's `G` | -0.024, 0.580, 0.701, 0.722 | -0.200, 0.268, 0.334, 0.299 | -0.414, -0.089, -0.001, -0.002 |
| `chi_5`, own gamma term | -0.828, -0.225, -0.104, -0.083 | -1.005, -0.537, -0.471, -0.506 | -1.218, -0.894, -0.806, -0.806 |
| DH (`Lambda_f`, all `n <= Q`), own gamma term | -0.754, -0.151, 1.050, 2.100 | -1.027, -0.562, 0.016, 0.499 | -1.342, -1.017, -0.940, -0.827 |
| `E_a`, `a = 0.2` | -0.179, 0.176, 0.365, 1.453 | -0.461, -0.441, -0.381, -0.285 | -0.826, -0.871, -0.789, -0.656 |

With the compensators `G'/lam` and the pole term included, the zeta row is -0.123, -0.063, -0.057, -0.052 at
`sigma = 0.5`: `sum_rho Re k_lam >= 0.05` on the window. The DH maxima sit at `t = 241.1` to `241.3` and
`t = 115.4` to `115.7` (its off-line zero is at `0.6508 + 114.163i`); DH passes at `sigma = 0.75` on this window for
`Q <= 1000` because the growth `Q^{beta - sigma}` needs `beta > sigma`.

Reading. This is the "best joint section" in the sense of the assignment: a finite section of all prime powers
`<= Q` that is contractive on `Re s >= 1/2` far beyond Q11 (at `t = 100` Q11 covers no prime; the tapered section
with 168 primes is contractive there), and that fails for every sign and unimodular twist tested when paired with zeta's gamma
section (at `sigma = 0.5` and `0.6`, `Q >= 100`). Its three properties decide its status:

- it is true because the zero measure on the line is positive, and it is proved only from that (part (c): it is
  RH);
- the identity (a) holds for every function with a functional equation and a Hadamard product (DH, `E_a`, T-NR,
  Dirichlet L-functions), with RH of that function as the sign;
- it does not use multiplicativity: `Lambda` enters as the coefficient sequence of `-zeta'/zeta` only.

So it is a restatement of the type of wall part 2 and row Q13, with the one difference that each finite stage is
true under RH with explicit compensators (the sharp stages of Q11 are false from `Q = 3` on).

## 6. Controls

| Control | Lemma 1 / Section 2 (joint contractivity of a block) | Theorems A, B, Prop C (no-go) | Proposition D (tapered section) |
|---|---|---|---|
| DH | No chain: `f'/f` is the parallel junction with nonconstant weight (`g-passive-cascade` Prop 4). Two-factor form MEASURED: violations up to `sigma = 0.88`. | Step (iii): main term is not a point evaluation of `H`; sign not forced. OPEN. | Identity holds with `Lambda_f`; sign fails (MEASURED at `Q >= 300`). Fails at the conclusion, not at a structural step. |
| Backward heat | No chain (weights `e^{tau log^2 n/4}` not multiplicative; `sq-causal-cascade` Section 6). First step. | Not formulable (no ordinary Dirichlet series). | Not formulable. Not run. |
| Sign twist TW-, TW+ | Torus translation by a 2-torsion point (TW+ removes columns). Sup, mean and moments unchanged: Lemma 1 and Q11 hold verbatim. MEASURED: same first failing `Q` at `sigma = 1/2`. | Hold formally for every completely multiplicative `|a_p| <= 1` with an approximate formula; a twist has none (no continuation), so void. | Fails at the phase step: there is no identity between the twisted prime sum and `G`. MEASURED: all violate for `Q >= 100`. |
| Unimodular twist | Torus translation. A Dirichlet character with its own gamma term passes like zeta (MEASURED); with zeta's `G` it fails. | Hold for Dirichlet L-functions (point evaluation at `conj(chi(p)) p^{-1/2}`). | Passes with its own gamma term (under GRH); fails with zeta's. The step is the pairing of gamma section and phases, i.e. the functional equation. |
| `E_a` | Chain at radii `p^{-sigma -+ a}`; threshold shifts to `1/2 + a` (MEASURED: `sigma*` 0.82 to 0.88 for `a = 0.2`). | Coefficients `sum_{d|m} d^a (m/d)^{-a}` are not completely multiplicative with `|a_p| <= 1`: the main term of step (iii) is not a point evaluation in the closed polydisc. Hypothesis of B is false. | Identity holds; sign fails for `sigma < 1/2 + a` (MEASURED at `sigma = 0.5`, passes at 0.6 and 0.75 for `Q <= 1000`). |
| T-NR | One local factor at `q` with a parameter of modulus `> 1`: the section at `q` leaves the polydisc. Inference, not run. | Evaluation point outside the closed polydisc at `q`: sign of `Re H` not controlled. Inference. | Identity holds; sign fails. Inference. |
| Beurling | Chain exists, no gamma section to pair with. Not run. | No ordinary integers, no approximate formula: step (iii) unavailable. | Not formulable (no functional equation). |
| Phase-rotated transfer operator, `theta^w` | Not formulable in chain variables. Not run. | Not formulable. | Not formulable. |

Summary of the control picture. The only positive statement that separates zeta from the sign twists (the tapered
section) separates them at the functional-equation step, holds as an identity for DH, `E_a` and T-NR, and is
equivalent to RH. The statements proved from the torus structure (Lemma 1, Q11) hold for every twist. No statement
here fails for all controls at a structural step.

## 7. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 (all primes, multiplicativity essential) | false | Lemma 1 and Section 2 use `|Lambda|` and torus translations only. Proposition D uses no multiplicativity. Multiplicativity is essential only in step (iii) of Theorem A (point evaluation of `H`), which is a no-go. |
| R2 (height-uniform, every window) | false | Proposition D(c) is height-uniform and every-window but is an equivalence with RH, not an established inequality. The measured ranges are finite windows (`t <= 1e4`). Theorems A, B are asymptotic means. |
| R3 (fails for every control at a structural step) | false | Section 6: Lemma 1 holds for every twist; Proposition D's identity holds for DH, `E_a`, T-NR; three controls are not formulable. |
| R4 (reaches the critical line from finite stages) | false | Proposition 3: the sharp joint section fails at fixed `sigma < 1` for all large `Q`. Proposition D reaches the line only under RH. Theorem B and Proposition C exclude a lossless multi-delay section as the transport mechanism. |

Score-raising condition of the assignment ("a proved joint-section contractivity range that beats Q11 for zeta
phases and provably fails for every sign twist"): not met. Beating Q11 is measured, not proved, and the proof
route is RH itself.

## 8. Three weakest steps

1. **Theorem A, step (iii) error terms.** The off-diagonal bound on the left side uses
   `|log(m/n)| >= 1/(2 max(m, n))` for `m` up to `2X` and the finiteness of `sum_m |h^(m)| m^{-c}`; the horizontal
   sides use an averaged height. These are written in outline, not line by line, and were checked only by the
   numerical example of Section 4 (agreement 1 to 3 percent at `T = 6000`, consistent with the `T^{-1/2 + c}` error).
   A referee should redo the estimate for `m` near `n` and for the range `T < m <= 2X`.
2. **Scope of the no-go.** Theorems A, B need finite `P` (or `sum_{m in <P>} m^{-c} < infinity` for some `c < 1/2`)
   and the additive form; Proposition C covers the multiplicative form; the general J-inner linear-fractional
   section in several delays is OPEN (partial reduction only). "No jointly inner multi-delay section" is proved in
   these two forms, not in full Potapov generality. The DH analogue is OPEN.
3. **Measured statements.** All thresholds in Sections 2 and 5 are float64 grid maxima (step 0.02 in `t` and in
   `sigma`), hence lower bounds for the true maxima; the "contractive" entries for zeta in the tapered table are not
   certified, and the twist samples are small (10 sign, 5 unimodular in Section 2; 5 and 3 in Section 5). The
   trivial-zero term of `Phi_Q` was neglected in the numerics (size below `1e-6` on the window).
