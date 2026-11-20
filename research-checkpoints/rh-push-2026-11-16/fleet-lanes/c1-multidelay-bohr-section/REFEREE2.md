# REFEREE2: c1-multidelay-bohr-section, Theorem A step (iii)

Date: 2026-11-17. Second pass, owed from round 1 (lane `c2-repair-owed-passes`). Scope: step (iii) of Theorem A only
(the contour estimate), plus the two inputs it uses from steps (i), (ii). Labels: CONFIRMED, CLASSICAL, MEASURED
(float, non-interval). Nothing here is a statement about zeros of zeta.

## Outcome

**Step (iii) holds.** Every term was re-derived line by line below. Two wording corrections (section 3). The
restriction "along a suitable sequence" can be dropped. One new numeric case agrees with the formula at the
predicted rate. Theorem A, and with it Theorem B, stand as stated for finite P.

## 1. Re-derivation

Inputs used. (i) `h(z) = sum_m h^(m) m^{-z}` over P-smooth m, `|h^(m)| <= 2 Re H(0)` for m > 1 and
`A_c := sum_m |h^(m)| m^{-c} < infinity` for every c > 0. Checked: for a multi-index alpha != 0 the conjugate of H
has no frequency alpha, so `c_alpha rho^alpha` is the alpha-th Fourier coefficient of `2 Re H(rho e^{i theta})`,
which is non-negative with mean `2 Re H(0)`; m <-> alpha is a bijection by unique factorisation;
`sum_{m in <P>} m^{-c} = prod_{p in P} (1 - p^{-c})^{-1}`. (ii) `h(-conj z) = -conj h(z)`: this is the Schwarz
reflection across `Re z = 0` given `Re h = 0` there off the poles; it also continues h to the whole plane with
poles only on the axis. Boundary poles of a function with non-negative real part in the half-plane are simple with
residue `r_j > 0`.

Contour: boundary of `[-c, c] x [1, T]`, `0 < c < 1/2`, integrand `zeta(1/2 + z) h(z)/(2 pi i)`. `zeta(1/2 + z)` is
holomorphic in the box (its pole is at `z = 1/2`, height 0), so the residues are `sum r_j zeta(1/2 + i gamma_j)`.

Approximate formula (CLASSICAL, Titchmarsh Theorem 4.11): `zeta(s) = sum_{n <= X} n^{-s} - X^{1-s}/(1-s) + O(X^{-sigma})`
uniformly for `sigma >= sigma_0 > 0`, `|t| <= 2 pi X/C`, `C > 1`. With `X = C T` and `sigma >= 1/2 - c > 0` the
hypotheses hold on both vertical sides.

Right side, `Re z = c`, upward, value `(1/2 pi) int_1^T zeta(1/2 + c + it) h(c + it) dt`.
- Double sum `sum_{n <= X} sum_m h^(m) n^{-1/2-c} m^{-c} (nm)^{-it}`, absolutely convergent, integrated termwise.
  `n = m = 1` gives `h^(1)(T - 1) = H(0)(T - 1)`. Every other pair has `nm >= 2` and gives at most `2/log(nm) <= 2/log 2`
  in modulus times its coefficient: total at most `(2/log 2) A_c sum_{n <= X} n^{-1/2-c} = O(T^{1/2-c})`.
- `X^{1-s}/(1-s)`: modulus `X^{1/2-c}/|1/2 - c - it| <= X^{1/2-c}/t`; `|h(c + it)| <= A_c`; integral `O(T^{1/2-c} log T)`.
- `O(X^{-sigma})`: `O(T * T^{-1/2-c})`.
Right side `= (1/2 pi)(H(0) T + O(T^{1/2-c} log T))`. CONFIRMED.

Left side, `Re z = -c`, downward, value `-(1/2 pi) int_1^T zeta(1/2 - c + it) h(-c + it) dt`. By (ii),
`h(-c + it) = -conj h(c + it) = -sum_m conj(h^(m)) m^{-c} m^{it}`, so the value is
`+(1/2 pi) int_1^T [sum_{n <= X} n^{-1/2+c} n^{-it} + ...] sum_m conj(h^(m)) m^{-c} m^{it} dt`.
- Diagonal `n = m <= X`: `(T - 1) sum_{m <= X} conj(h^(m)) m^{-1/2}`. Since `A_{1/2} < infinity` the partial sums converge to
  `conj h(1/2)`; the tail is o(1). Sign `+`. CONFIRMED.
- Off-diagonal, each pair at most `2 |h^(m)| m^{-c} n^{-1/2+c}/|log(m/n)|`; m runs over all P-smooth integers, n over
  `n <= X`. Case `m >= 2n` or `m <= n/2`: `|log(m/n)| >= log 2`, total at most
  `(2/log 2) A_c sum_{n <= X} n^{-1/2+c} = O(X^{1/2+c})`. Case `n/2 < m < 2n`, `m != n` (then `m < 2X`):
  `|log(m/n)| >= |m - n|/max(m, n)`, and `n^{-1/2+c} <= (m/2)^{-1/2+c}` because `c < 1/2`; for fixed m the sum over n is
  at most `4m (m/2)^{-1/2+c} sum_{1 <= k <= 2m} 2/k = O(m^{1/2+c} log 2m)`. Total
  `O(X^{1/2+c} log X) * sum_{m < 2X} |h^(m)| m^{-c} = O(T^{1/2+c} log T)`. The range `T < m < 2X` is covered by the same
  bound. (Only `O(log^{|P|} X)` smooth m occur, which gives the sharper `O(X^{1/2} log^{|P|+1} X)`; not needed.)
- `X^{1-s}/(1-s)`: modulus at most `X^{1/2+c}/t`, `|h(-c + it)| = |h(c + it)| <= A_c`; integral `O(T^{1/2+c} log T)`.
  No main term arises from it.
- `O(X^{-sigma})`: `O(T * T^{-1/2+c})`.
Left side `= (1/2 pi)(conj h(1/2) T + O(T^{1/2+c} log T))`, and `1/2 + c < 1`. CONFIRMED.

Horizontal sides. Herglotz form with no linear term (h is bounded as `Re z -> +infinity`):
`Re h(1 + it) = sum_j r_j/(1 + (t - gamma_j)^2) >= (1/2) sum_{|gamma_j - t| <= 1} r_j`, and `Re h(1 + it) <= A_1`, so the
mass in every unit interval is at most `2 A_1`. For `|x| <= c`:
`h(x + iy) - h(1 + iy) = sum_j r_j (1 - x)/((x + i(y - gamma_j))(1 + i(y - gamma_j)))`. Poles with `|y - gamma_j| >= 1`
contribute `O(sum r_j/(y - gamma_j)^2) = O(A_1)`. Poles with `|y - gamma_j| < 1` contribute at most
`2 r_j/|x + i(y - gamma_j)|`, which is integrable over the rectangle `[-c, c] x [T, T+1]` (singularity `1/r` in two
dimensions). Hence `int_T^{T+1} int_{-c}^{c} |h| dx dy = O(A_1)` and some height `T'` in `[T, T+1]` has
`int_{-c}^{c} |h(x + iT')| dx = O(A_1)`. For `x < 0` the same bound holds by (ii). With the convexity bound
`zeta(1/2 + x + iT') = O(T^{1/4 + c/2 + eps})` for `x >= -c` the top side is `O(T^{1/4 + c/2 + eps}) = o(T)`. The bottom
side is a constant (move the base height slightly if a pole sits at height 1). CONFIRMED.

All T. Between T and T' the left side changes by at most `(mass in a unit interval) * max |zeta(1/2 + it)|
= O(T^{1/6 + eps})`. So the asymptotic holds for every T, not only along a sequence.

Result: `sum_{1 < gamma_j <= T} r_j zeta(1/2 + i gamma_j) = (T/2 pi)(H(0) + conj h(1/2)) + O(T^{1/2+c} log T)` for every
fixed `0 < c < 1/2`, hence `O_eps(T^{1/2 + eps})`. The error term stated in the lane (o(T)) is correct and can be
sharpened to this.

## 2. Numeric case not in the result or the first referee report (MEASURED)

`b(w_1, w_2) = w_1 (w_2 - a)/(1 - a w_2)`, `a = 0.4`, `h = (1 + b)/(1 - b)`, `w_1 = 2^{-z}`, `w_2 = 3^{-z}`. `H(0) = 1`,
`b` at `z = 1/2` is 0.16309, prediction `H(0) + conj h(1/2) = 2.3897`. Poles: `arg b(i gamma) = 0 mod 2 pi` (monotone
phase, bisection), `r_j = 2/|phase'(gamma_j)|`. `checks.py thmA` in `push/c2-repair-owed-passes/`, mpmath 20 digits.

| T | poles | sum r_j (predicted T/pi) | 2 pi sum r_j zeta(1/2 + i gamma_j)/T | difference from 2.3897 | difference * sqrt(T) |
|---|---|---|---|---|---|
| 1000 | 285 | 318.24 (318.31) | 2.2742 - 0.0202i | -0.116 | 3.7 |
| 3000 | 855 | 954.69 (954.93) | 2.2863 - 0.0036i | -0.103 | 5.7 |
| 6000 | 1711 | 1909.97 (1909.86) | 2.3346 - 0.0114i | -0.055 | 4.3 |
| 24000 | 6844 | 7639.91 (7639.44) | 2.3575 + 0.0022i | -0.032 | 5.0 |

The difference decays like `T^{-1/2}` (last column roughly constant), as the error term above allows.

## 3. Corrections (none changes the theorem)

1. Statement: replace "extends meromorphically to a neighbourhood of `Re z >= 0`" by "extends meromorphically across
   `Re z = 0`; by reflection it is then meromorphic in the plane with poles only on `Re z = 0`". Drop "along a suitable
   sequence" (first referee, item 5; confirmed here with the bound for the stretch between T and T').
2. Weakest step 1 of the result ("a referee should redo the estimate for m near n and for T < m <= 2X") is discharged:
   both ranges are inside the case `n/2 < m < 2n` above.

## 4. What this pass does not cover

Steps outside (iii) were read only as inputs. The open items of the lane are unchanged: infinite P (needs
`sum_{m in <P>} m^{-c} < infinity` for some `c < 1/2`), the general J-inner linear-fractional section in several delays,
and the DH analogue (for DH the diagonal term is `c_1 conj H(chibar(p) p^{-1/2}) + c_2 conj H(chi(p) p^{-1/2})`, not a
point evaluation, so the sign step (iv) is not available).

Requirement flags: unchanged from the first referee (R1 false as an attack: multiplicativity is used in a no-go;
R2, R3, R4 false).
