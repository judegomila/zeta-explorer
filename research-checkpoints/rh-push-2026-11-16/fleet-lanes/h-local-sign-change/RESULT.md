# h-local-sign-change: the T-NR threshold |c| = 2 and the functionals that change sign there

Date 2026-11-17. Unrefereed. Nothing here proves or refutes RH; no bound moves.
Labels: PROVED (argument given here) / CLASSICAL / MEASURED (mpmath floating point, not interval-certified) / OPEN.
All runs local, single process each, through `scripts/memcap.sh 8`; the compute server was not used.

## Verdict

**Precise obstruction. The lead is worth little as a route to zeta's zeros.**

1. The threshold is exactly `|c| = 2` for every prime `q` and every height (PROVED, three lines; MEASURED on 108
   members, 108/108 argument-principle counts equal the prediction).
2. Sanity answer: **yes, the off-line zeros are the zeros of the modified local factor at `q` and nothing else.**
   `X_{q,c} = xi* . sigma_{q,c}` is a product, so its zero divisor is `div(xi*) + div(sigma)`. No zeta zero moves.
   No member of the family, and no member of the larger family "change the Tate test vector at finitely many
   primes", has an off-line zero that is not a zero of the finite Laurent polynomial. The family does not model a
   global off-line zero.
3. Functionals with a sign change exactly at the threshold exist and are listed with closed forms (section 4).
   Every one of them is a function of the symbol `sigma_{q,c}` alone, plus a `c`-independent contribution of the
   base field. Replacing zeta by Davenport-Heilbronn as the base leaves the sign change at `|c| = 2` unchanged
   (MEASURED). So these functionals are blind to the base and carry no information about zeta's zeros.
4. Finite-resolution versions (fixed node set, fixed Hankel order, fixed line `Re z = x`) change sign at
   `c* > 2` strictly, with `c* -> 2` as the resolution grows. The exact threshold is reached only by the
   all-order / boundary statements, which are restatements of "the roots of `1 + c y + y^2` are on `|y| = 1`".
5. For zeta itself the corresponding condition at every prime is empty: the standard vector has symbol 1,
   a Laurent polynomial of degree 0 with no roots. Zeta is not the member `c = 2` of this family; it is not a
   member with a non-trivial symbol at all.

## 0. Plan; what is new relative to the atlas, the walls and the earlier lanes

- h-tnr-geometric (refereed) proved the factorisation, the threshold for the symbol and the additivity
  `P_NR = P_zeta + P_D`, and asked (its section 9) for a functional of the local test vector that changes sign
  exactly at `|c| = 2`. This note answers that request and decides what such a functional is worth.
- New here: the explicit statement and check of (2); the grid verification over four primes; the classification
  of nine candidate functionals into exact / finite-resolution / insensitive, with closed forms; the measured
  resolution laws `c*(nodes) - 2` and `K*(c)`; the three controls on the positive findings; the location of the
  gap in the chain / Stieltjes coordinates (section 5).
- Not re-run: Props 1-3 of h-tnr-geometric, the Krein index, the 7/8 argument.
- Walls: no zero-location argument for zeta is proposed. Section 6 runs the three controls on the sign-change
  functionals and records that DH passes them, which is the reason they say nothing about the base.

## 1. The family and the threshold

`s = 1/2 + z`, `l = log q`, `y = q^{-z}`, `xi*(s) = pi^{-s/2} Gamma(s/2) zeta(s)`.

    X_{q,c}(s) = xi*(s) sigma_{q,c}(z),   sigma_{q,c}(z) = q^z + c + q^{-z} = 2cosh(z l) + c = y^{-1}(1 + c y + y^2).

Dirichlet form: `X = q^{s-1/2} pi^{-s/2} Gamma(s/2) D(s)`,
`D(s) = zeta(s)(1 + c q^{1/2-s} + q^{1-2s})`. With `a + 1/a = -c` the Euler factor at `q` is

    (1 - a q^{1/2} q^{-s})(1 - a^{-1} q^{1/2} q^{-s}) / (1 - q^{-s}).

It is Tate's integral with the self-dual vector `q^{1/2} 1_{qZ_q} + c 1_{Z_q} + q^{-1/2} 1_{q^{-1}Z_q}`
(h-tnr-geometric Prop 1, refereed).

**Theorem 1 (PROVED).** For every prime `q` and real `c`:

(i) `div X_{q,c} = div xi* + div sigma_{q,c}`. The zeros of `X` are the zeros of `xi*` and the zeros of `sigma`, with
multiplicities added. The only cancellation is with the poles of `xi*` at `s = 0, 1`, and it happens iff
`c = -(q^{1/2} + q^{-1/2})` (then `X` has no pole).

(ii) `sigma = 0` iff `y` is a root of `y^2 + c y + 1`. The product of the roots is 1.
`|c| < 2`: roots `e^{+-i theta}`, `2cos theta = -c`, zeros `z = i(+-theta + 2 pi k)/l`, all simple, on `Re z = 0`.
`|c| = 2`: double zeros on `Re z = 0` at `z = i pi(2k+1)/l` (`c = 2`) or `2 pi i k/l` (`c = -2`).
`|c| > 2`: roots real, `a` and `1/a` with `|a| != 1`; zeros at `z = +-delta_0 + i t_k`,
`delta_0 = arccosh(|c|/2)/l`, `t_k = pi(2k+1)/l` (`c > 2`), `t_k = 2 pi k/l` (`c < -2`, including the real pair
`z = +-delta_0`).

(iii) The threshold does not depend on `q` or on height. For `|c| > 2` one full vertical arithmetic progression of
zeros leaves the line at once, at every height, with `delta_0 = sqrt(|c| - 2)/l (1 + O(|c| - 2))`. What depends on
`q` is the distance: zeros lie in `Re s > 1` iff `|c| > q^{1/2} + q^{-1/2}` (2.1213 for `q = 2`, 2.3094 for
`q = 3`), and at equality with `c < 0` the real zero cancels the pole at `s = 1`.

Proof. (i) is the product. (ii) is the quadratic formula in `y`; `|y| = q^{-Re z}`. (iii) follows. QED.

The referee's figure `Re s = 1.1399` for `q = 2`, `c = 2.2` is `1/2 + arccosh(1.1)/log 2 = 1.13993372`.

Remark on the word "tempered". The local parameters of the numerator are `a q^{1/2}`, `a^{-1} q^{1/2}`. For
`|c| <= 2` they have modulus `q^{1/2}`, not 1: the log-coefficients satisfy `b(q^k) ~ q^{k/2}/k`, the boundary case
`theta = 1/2` of the Selberg-class Euler-product axiom (`b(n) << n^theta`, `theta < 1/2`). For `|c| > 2` the
exponent is `1/2 + delta_0`. So no member with a non-trivial symbol is in the Selberg class, and the
automorphic object is the trivial character for every `c` (h-tnr-geometric REFEREE E2). The threshold is the
unit-circle condition for the roots of the test-vector polynomial in the centred variable `y = q^{1/2-s}`.

### Verification (MEASURED, `verify.py`, `verify_{2,3,5,11}.log`)

Winding number of the full field `xi(1/2+z) sigma(z)` (20 digits, adaptive phase tracking, left edge sampled at
half its distance to the line) around the box `x0 < Re z < 3.3`, `-0.37 < Im z < 40.3`, `x0 = 0.004`, for
`q in {2, 3, 5, 11}` and 27 values of `c` in `[-3, 3]` including `+-1.999, +-2, +-2.001, +-2.01`.

- 108 of 108 counts equal the predicted number of symbol zeros in the box (0 for all `|c| <= 2`; for `|c| > 2`:
  `q = 2`: 4 / 5 (`c > 2` / `c < -2`), `q = 3`: 7 / 8, `q = 5`: 10 / 11, `q = 11`: 15 / 16).
- The first off-line zero, located by a root-finder on the full field, agrees with `delta_0 + i t_0` to `4e-21`
  in all 56 members with `|c| > 2`. Examples (`Re s`): `q = 2`: 0.5456 (`c = 2.001`), 1.2140 (2.25), 1.8885 (3);
  `q = 3`: 0.5288, 0.9505, 1.3760; `q = 5`: 0.5196, 0.8075, 1.0980; `q = 11`: 0.5132, 0.7064, 0.9014.
- Independent of the factorisation (`controls.py`): the Mellin transform of `(V_q + V_q^{-1} + c) psi`, computed by
  quadrature of the theta kernel, vanishes at the predicted zero: `|M| = 1.3e-26` (`q = 2`, `c = 2.2`,
  `s = 1.13993 + 4.53236i`), `1.1e-24` (`q = 3`, `c = 2.2`), `3.9e-26` (`q = 3`, `c = -2.5`, real zero
  `s = 1.13093`), `5.2e-20` (`q = 5`, `c = 2.01`), while `|xi*|` there is 0.029, 0.096, 6.78, 0.224. At a generic
  point the ratio to the product formula is 1 to `3e-21`.

An earlier version of the count used sample spacing 0.25 on the left edge and returned wrong integers for
several `|c| <= 2` members (phase aliasing next to on-line zeros). The spacing was reduced to `x0/2`; the figures
above are from the corrected run.

## 2. Answer to the sanity question

For `|c| > 2` the off-line zeros are exactly the zeros of the local factor at `q`: one arithmetic progression
`1/2 + delta_0 + i t_k` and its mirror `1/2 - delta_0 + i t_k`. Every zeta zero stays where it is, with its
multiplicity (Theorem 1(i)). PROVED.

Consequences, stated plainly.

- The family does not contain a "global" off-line zero. A functional that changes sign at `|c| = 2` along this
  family is, by construction, detecting whether the two roots of `1 + c y + y^2` are on the unit circle.
- The same holds for any self-dual test vector at finitely many primes: the field is `xi*` times a Laurent
  polynomial in the `q_i^{-z}`, and its extra zeros are the zeros of that polynomial.
- An off-line zero in this family is periodic in height with period `2 pi/log q`. sq-causal-cascade Theorem 5
  (PROVED there) says `xi'/xi(1/2+z)` is not constant on any vertical arithmetic progression, so zeta's zeros
  cannot be of this type. The family switches on exactly the mechanism that is proved absent from zeta.
- The members that would be informative are those in which a zero that is not a symbol zero moves. In the
  control set only Davenport-Heilbronn has such zeros, and it is not a test-vector modification of zeta.

## 3. Candidate functionals along the family

Additivity (PROVED, h-tnr-geometric section 3): `L_c = L_0 + L_D`, `L_0 = xi'/xi(1/2+z)`,

    L_D(z) = 2 l sinh(z l)/(2cosh(z l) + c) = l (1 - y^2)/(1 + c y + y^2)
           = (l/2) [ (1 + a y)/(1 - a y) + (1 + y/a)/(1 - y/a) ],
    L_D'(z) = 2 l^2 (2 + c cosh(z l))/(2cosh(z l) + c)^2.

Every object that is linear in `L` splits as (base) + (symbol): `P`, `B`, `K_e = P+B`, `K_o = P-B`, the Stieltjes
measure `nu` and its moments `mu_k`, the normalised Laguerre expression `(f'^2 - f f'')/f^2 = L'(it)`, and the
real part of the section impedance in the chain. MEASURED: moment additivity to `1e-257` (`hankel.py`).

Classification: (a) positive for `|c| < 2`, zero at `|c| = 2`, negative beyond; (a*) as (a) but through an
indicator or a pole instead of a simple zero; (b) insensitive; (c) sign change elsewhere.
`q = 3` unless stated; `q = 2` gives the same pattern (`functionals_q2.json`, `sector_hp_q2.json`).

| # | functional | type | where it changes sign | closed form / measured law |
|---|---|---|---|---|
| F1 | discriminant of the test-vector polynomial; equals `-(min sigma)(max sigma)` on the unitary dual `|y| = 1`; equals `det [[2, c],[c, 2]]`, the order-1 Toeplitz determinant of the centred rung moments `m_k = -(a^k + a^{-k})` | (a) | `|c| = 2` exactly, both signs | `4 - c^2` |
| F2 | Laguerre expression of the symbol on the line, `g(t) = 2cos(t l) + c`, `min_t (g'^2 - g g'')` | (a) | `|c| = 2` exactly | `2 l^2 (2 - |c|)`; `g'^2 - g g'' = 2 l^2 (2 + c cos(t l))` |
| F3 | Laguerre expression of the full field at the collision height (`t_0 = pi/l` for `c > 0`, `t = 0` for `c < 0`), divided by `xi(i t_0)^2` | (a) near the threshold; second sign change far away | `c = 2` and `c = 2 + 2 l^2/L_0'(i t_0)` = 52.15 (`q = 3`), 20.66 (`q = 2`); `c = -2` and -54.24, -22.79 | `(2 - c)[ 2 l^2 + (2 - c) L_0'(i t_0) ]`, `L_0'(i t_0) = 0.0481356` (`q = 3`) |
| F4 | `min_t L_c'(it)` over `t in (0, 30]`, step 0.05 (normalised Laguerre, full field) | (a*) | `|c| = 2` exactly | +0.650 at `c = 2`, -2343 at 2.001; +0.652 at -2, -2278 at -2.001; beyond: `L_0'(i t_0) - 2 l^2/(|c| - 2)` |
| F5 | section passivity: `inf Re L_D` over `Re z > 0` | (a*) indicator | `|c| = 2` exactly | `>= 0` iff `|c| <= 2`; `-inf` beyond |
| F5x | same on a fixed line `Re z = x` | (c) | `|c| = 2cosh(x l)` | measured crossings 2.00048280, 2.00301813, 2.01208163, 2.07590970, 2.30940108 at `x` = 0.02, 0.05, 0.1, 0.25, 0.5; `2cosh(x l)` agrees to 13 digits |
| F6 | minimum eigenvalue of `P`, `K_e`, `K_o` (unit-diagonal normalisation) on a fixed real node set | (c) | `c*(nodes) > 2`, `c* -> 2` with more nodes | table below |
| F7 | first failing order of the Hankel pair `H0 = [mu_{i+j}]`, `H1 = [mu_{i+j+1}]` at the anchor | (c) at fixed order, (a*) over all orders | order `K` fails for `c > 2 + eps_K`, `eps_K -> 0` | table below |
| F7' | `mu_0 = sum 1/lambda = l^2/(2 + c) + 0.0231050` (first Hankel entry) | (a*) at `c = -2` only (through a pole); second sign change at -54.24 | insensitive at `c = +2` | `l^2/(2 + c) + mu_0(zeta)` |
| F8 | anticausal Hankel block `Gamma_-` of `S = (1 - alpha L)/(1 + alpha L)`: rank, singular values | (a*) indicator, discontinuous | `|c| = 2` exactly | rank 0 for `|c| <= 2` in the window, one per off-line zero beyond; singular value `alpha/sqrt(alpha^2 + delta_0^2)(1 + o(1))`, tends to 1 as `|c| -> 2+` |
| F9 | central value `X(1/2)/xi*(1/2) = 2 + c` | (a) at `c = -2`; (b) at `c = +2` | `c = -2` | `2 + c` |
| F10 | ladder primitivity defect of `(1 - V_q) kappa_c` (rung weights `q^{-1/2}`, `q^{-1/2} + c`, `q^{-1/2} + c + q^{1/2}` at `q`-adic valuation -1, 0, >= 1; defects `c`, `q^{1/2}`) | (c) | `c = 0` | `c` |
| F11 | coefficient `U_q` defect `a(q^2)/a(q) - a(q^3)/a(q^2)` | (c) | pole at `c = -q^{-1/2}` | `q/(1 + c q^{1/2})` |
| F12 | b-euler-detector rung Toeplitz `T_{q,1}` in its uncentred normalisation | (c) | `c = 0` and `c = -2 q^{-1/2}` | `1 - (1 + c q^{1/2})^2` |
| F13 | multiplicativity defect `a(q^j m) - a(q^j) a(m)` | (b) | never | 0 for every `c` |

Derivations of the closed forms.

- F1: `|c| <= 2` iff the roots of `y^2 + c y + 1` are unimodular. `sigma` on `|y| = 1` is `c + 2cos(theta)`, with
  extremes `c -+ 2`. The Hecke-algebra element `delta_1 + c delta_0 + delta_{-1}` of `C[Z]` is a positive-definite
  function on `Z` iff `c >= 2` and negative-definite iff `c <= -2`. So the zeros are on the line iff the element
  is **indefinite** (its symbol takes both signs, or vanishes, on the unitary dual). Positivity of the Hecke
  operator is the off-line case, in agreement with h-tnr-geometric Prop 2.
- F2, F3, F4: `(log f)'' = -L'(it)` for `f(t) = X(1/2 + it)`; at `t_0`, `g = c - 2`, `g' = 0`, `g'' = 2 l^2`.
- F5, F5x: in the partial-fraction form, `Re (1 + w)/(1 - w) = (1 - |w|^2)/|1 - w|^2`. For `|a| = 1` both terms
  are positive in `|y| < 1`. For real `|a| > 1`, on `|y| = r` with `r|a| > 1`, at the phase where `a y > 0` the sum
  is `f(r/|a|) - f(1/(r|a|))` with `f(w) = (1+w)/(1-w)` increasing, hence negative because `r < 1`. So the
  minimum over the line `Re z = x` is negative iff `x < delta_0` iff `|c| > 2cosh(x l)`. PROVED.
- F8: near a pair `+-delta_0 + i t_k`, `L ~ 2w/(w^2 - delta_0^2)` (`w = z - i t_k`), and `L = -1/alpha` has the
  root `w_+ = sqrt(alpha^2 + delta_0^2) - alpha` in `Re w > 0` (sq-hankel-traces Thm 1, single-pair model).

### F6 data: sector matrices (MEASURED, `functionals.py` 50 digits, `sector_hp.py` 220 digits)

Minimum eigenvalue of the unit-diagonal normalisation, 12 linear nodes `0.55 + 0.35k`, base zeta, `q = 3`:

| c | P | K_e | K_o |
|---|---|---|---|
| -3 | -4.31 | -2.4e-5 | -6.22 |
| -2.125 | -0.0840 | -3.1e-7 | -3.09 |
| -2.001 | -3.7e-5 | -2.0e-11 | -0.0567 |
| -2 | 4.0e-28 | 1.1e-48 | 5.1e-51 |
| -1 | 1.5e-23 | 2.9e-42 | 9.8e-40 |
| 0 | 1.8e-23 | 3.3e-42 | 7.3e-40 |
| 1 | 1.9e-23 | 3.2e-42 | 4.6e-40 |
| 1.999 | 5.1e-25 | 1.1e-43 | 9.1e-42 |
| 2 | 5.1e-29 | 2.5e-51 | 5.9e-49 |
| 2.001 | -2.2e-10 | -2.4e-6 | -5.7e-7 |
| 2.125 | -6.3e-6 | -4.5e-3 | -9.4e-4 |
| 3 | -1.1e-3 | -0.399 | -0.0166 |

(Values at `c = +-2` from the 220-digit run. The 50-digit run returns `-1.7e-52` for `K_o` at `c = -2`, which is
below its resolution; crossings reported by the 50-digit run inside `|c| < 2` are roundoff and are discarded.)

Sign-change position `|c*| - 2` (220 digits, bisection in `log10(|c| - 2)`):

| base / nodes | P, c>0 | K_e, c>0 | K_o, c>0 | P, c<0 | K_e, c<0 | K_o, c<0 |
|---|---|---|---|---|---|---|
| zeta, 7 geometric | 6.56e-6 | 1.86e-19 | 1.30e-17 | 3.91e-11 | 5.89e-10 | 2.47e-29 |
| zeta, 12 linear | 3.71e-14 | 7.22e-38 | 2.63e-35 | 4.17e-19 | 3.63e-25 | 1.40e-49 |
| symbol alone, 7 geometric | 3.97e-6 | 1.48e-20 | 3.98e-18 | 2.88e-11 | 1.31e-11 | 2.72e-31 |
| symbol alone, 12 linear | 2.02e-14 | 1.79e-43 | 1.53e-40 | 2.87e-20 | 8.88e-31 | 1.51e-55 |
| DH, 7 geometric | 1.01e-3 | 1.50e-13 | 4.49e-12 | 1.29e-9 | 3.80e-4 | 1.09e-24 |
| DH, 12 linear | 1.66e-9 | 6.83e-29 | 8.52e-27 | 5.89e-15 | 4.84e-15 | 5.58e-41 |

Reading. On a fixed node set the sector forms change sign at `c* > 2` strictly: type (c). The offset is set by the
smallest eigenvalue of the base on that node set (zeta: `1e-23 .. 1e-42` on 12 nodes) and shrinks with the
number of nodes. The symbol alone has the same behaviour, so the offset is a resolution effect of real-node
Pick matrices, not a property of zeta. With DH as the base the crossing is in the same place to within the
resolution: the sector forms do not see that DH has off-line zeros at height 85.7 while reporting the symbol's
at height 2.86.

### F7 data: Hankel pair at the anchor (MEASURED, `hankel.py` 260 digits order 12, `hankel_near.py` 700 digits order 30)

`mu_k` from the Taylor coefficients of `xi(1/2 + x)` (trapezoid rule on `|x| = 3`) times the exact series of the
symbol. `mu_0(zeta) = 0.02310499311541897`. Zeta alone: `H0`, `H1` positive through order 30.

Grid `c in [-3, 3]` step 1/8 plus `+-1.99, +-1.999, +-2.001, +-2.01, 2.0001, 2.02, 2.05`: the pair is positive
through order 12 for every `|c| <= 2` on the grid except `c = -2` (zero at the anchor, moments undefined), and
fails for every `|c| > 2`. First failing orders `(K0, K1)`:

| c | 3 | 2.5 | 2.25 | 2.05 | 2.01 | 2.001 | 2.0001 | 2+1e-6 | 2+1e-8 | 2+1e-10 | 2+1e-12 | 2+1e-16 | 2+1e-20 | 2+1e-30 | 2 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| H0 | 2 | 2 | 3 | 3 | 3 | 4 | 4 | 5 | 5 | 6 | 6 | 7 | 8 | 10 | none to 30 |
| H1 | 2 | 2 | 2 | 2 | 3 | 3 | 3 | 4 | 5 | 5 | 6 | 6 | 7 | 10 | none to 30 |

For `c < -2`: `H0` fails at order 1 (`mu_0 < 0`, the real zero pair gives `lambda = -delta_0^2 < 0`), `H1` at
order 3 to 8. The symbol alone has the same first failing orders in 22 of 23 failing grid rows; in the
near-threshold run it fails at the same order or one order earlier (6 of 12 rows differ by one).

Reading. At fixed order `K` the sign change is at `c = 2 + eps_K` with `eps_K` falling from `1e-2` (`K = 3`) to
`1e-30` (`K = 10`): type (c) converging to the threshold, about one order per four decades of `c - 2`. Only the
all-order statement has the exact threshold, and that statement is "the measure `nu` is supported on the
half-line", i.e. the zero-location statement itself (stack-antibridge Theorem 1).
One row is discarded: at `c = -2 + 1e-12` the 700-digit run reports negative pivots at orders 25 to 30 for the
symbol alone, where positivity is proved; the moments there span more than 700 decimal orders.

### F8 data: anticausal block (MEASURED, `functionals.py`, `controls.py`)

Zeros of `D = X + alpha X'` in `0.02 < Re z < 3`, `-0.37 < Im z < 40.3` (= poles of `S` there): 0 for
`c = -2, -1.999, -1, 0, 1, 1.999, 2`; 7 for `c = 2.2`; 8 for `c = -2.5` (both `alpha = 1` and `alpha = 0.3`).
At `c = 2.001` the count in this box is 0 because the poles sit at `Re z ~ delta_0^2/(2 alpha) = 4e-4`, left of
the box edge.

| c | delta_0 | first pole of S (alpha = 1) | singular value `|r|/(2 Re z)` | model `1/sqrt(1 + delta_0^2)` | alpha = 0.3: value / model |
|---|---|---|---|---|---|
| 2.01 | 0.09099 | 0.004135 + 2.860152i | 0.99587 | 0.99589 | 0.95682 / 0.95696 |
| 2.1 | 0.28666 | 0.040707 + 2.864832i | 0.96005 | 0.96128 | 0.71803 / 0.72300 |
| 2.2 | 0.40375 | 0.080014 + 2.869481i | 0.92294 | 0.92727 | 0.58655 / 0.59641 |
| 2.5 | 0.63093 | 0.190155 + 2.880611i | 0.82663 | 0.84574 | 0.41174 / 0.42942 |
| 3 | 0.87604 | 0.351378 + 2.892711i | 0.70534 | 0.75219 | 0.30137 / 0.32398 |
| -2.001 | 0.02878 | 0.000414 | 0.99959 | 0.99959 | 0.99543 / 0.99543 |
| -2.2 | 0.40375 | 0.079855 | 0.92335 | 0.92727 | 0.58703 / 0.59641 |
| -3 | 0.87604 | 0.349485 | 0.70906 | 0.75219 | 0.30194 / 0.32398 |

Reading. `Gamma_-` is zero for `|c| <= 2` in the window and has one singular value near
`alpha/sqrt(alpha^2 + delta_0^2)` per off-line zero for `|c| > 2`. As `|c| -> 2+` the singular values tend to 1,
not to 0, and there are infinitely many of them (one per period), so the Hilbert-Schmidt norm jumps from 0 to
infinity. This is an indicator, not a functional with a simple zero. The pole near height 14.27 at `c = 2.2`
(singular value 0.086) is the third symbol zero interacting with the zeta zero at 14.1347.

### F3 data: Laguerre expression at the collision height (MEASURED and closed form)

`(f'^2 - f f'')(t_0)/xi(i t_0)^2` for `c > 0`, at `t = 0` for `c < 0`; `q = 3`, `t_0 = 2.859600867`.

| c | -2.125 | -2.01 | -2.001 | -2 | -1.999 | -1 | 0 (at t_0) | 1 | 1.999 | 2 | 2.001 | 2.01 | 2.125 | 3 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| zeta base | -0.3010 | -0.02413 | -0.0024139 | 0 | 0.0024139 | 2.4601 | 5.0203 | 2.4620 | 0.0024139 | 0 | -0.0024138 | -0.02413 | -0.3010 | -2.3658 |
| DH base | -0.2987 | -0.02412 | -0.0024137 | 0 | 0.0024141 | 2.6100 | 6.2277 | 2.7639 | 0.0024142 | 0 | -0.0024135 | -0.02410 | -0.2963 | -2.0639 |

Slope at the threshold `-2 l^2 = -2.41390` for both bases.

## 4. Closed forms for the type-(a) functionals, and what they say for zeta

In terms of the local parameter `a` (`a + 1/a = -c`, `|a| = 1` iff `|c| <= 2`):

    F1 = 4 - c^2 = -(a - 1/a)^2                        (>= 0 iff a is unimodular)
    F2 = 2 l^2 (2 - |a + 1/a|)
    F3 = (2 - c)[2 l^2 + (2 - c) L_0'(i pi/l)]         (c > 0; base enters only through the constant L_0'(i pi/l))
    F5 = inf_{Re z > 0} Re L_D = 0 if |a| = 1, -inf otherwise
    F5x: sign(2cosh(x l) - |c|) = sign(x - |log|a||/l)

Each is the statement "the two roots of the test-vector polynomial lie on `|y| = 1`" in a different coordinate.

**The condition for the unmodified zeta at every prime.** The standard vector `1_{Z_q}` has symbol 1. It has no
roots, so the condition "all roots of the symbol on `|y| = 1`" holds vacuously at every prime, and F1-F5 are not
defined (degree 0) or identically non-negative (`L_D = 0`). Zeta is not the member `c = 2`: at `c = 2` the field is
`xi* . 4cosh^2(z l/2)` and has double zeros at `i pi(2k+1)/l` that zeta does not have. If one insists on a
non-vacuous local statement for zeta, it is about the denominator `1 - q^{-s} = 1 - q^{-1/2} y`: its root is at
`|y| = q^{1/2}`, i.e. the local factor has poles on `Re s = 0` and neither zeros nor poles in `Re s > 0`. That is
the Satake parameter 1 being unimodular. It is true with nothing to prove, and it places no singularity of any
section anywhere in `Re s > 0`.

**What such a functional does and does not say about zeta's zeros.**

Does say: an argument for RH must not be invariant under replacing the test vector at one prime by one whose
polynomial has a root off the unit circle (h-tnr-geometric R2). That is a filter on arguments.

Does not say: anything about `div xi*`. By Theorem 1(i) and additivity, every functional above has the form
`Phi(X_{q,c}) = Phi_base + phi_q(c)` (or `phi_q(c)` alone), and the sign change is produced by `phi_q` having an
actual pole or zero in `Re z > 0`. The base term is whatever it is. With DH as the base the functionals change
sign at the same place (section 6), although DH has off-line zeros for every `c`.

**Can local temperedness at all primes plus the functional equation constrain global zeros?** Status: it is
conjectured to (GRH for the Selberg class); nothing is proved inside the critical strip from these two inputs.
What is proved from the Euler product alone is non-vanishing in `Re s > 1`; what is proved from the Euler product
plus the functional equation in low degree is identification (the function is a Dirichlet L-function:
Kaczorowski-Perelli, CLASSICAL; b-euler-detector: constraints identify, they do not locate).

Where the gap sits in the user's coordinates:

1. Chain coordinate (sq-causal-cascade): `L = G - sum_p u_p`, valid for `Re s > 1`. A T-NR off-line zero is a
   pole of **one** section `L_D` in `Re z > 0`; it is visible on one circle factor `theta_q = t log q` of the Bohr
   torus and is detected by any passivity test of that section (F5). For zeta every prime section
   `u_p = log p/(p^s - 1)` is holomorphic in `Re s > 0`. An off-line zero of zeta would be a pole of the **sum**
   that is not a pole of any term, located where the sum does not converge (`l^1` threshold `Re s = 1`,
   `l^2` threshold `Re s = 1/2`, variance `1/(8x^2)` at `Re s = 1/2 + x`: sq-causal-cascade Prop 2). No local
   condition at a prime, and no finite set of them, is a statement about that sum.
2. Stieltjes coordinate (stack-antibridge): the T-NR symbol contributes atoms of `nu` at `lambda = -(delta_0 + i t_k)^2`,
   on the half-line iff `|c| <= 2`. Zeta's prime stubs contribute no atoms; each has its singularities on the
   parabola `Re s = 1/4 - (Im s)^2` (the image of `Re z = -1/2`) and a signed oscillating density
   (stack-antibridge Theorem 6). The sign of the total density is the explicit formula, i.e. RH.
3. Periodicity: a symbol zero is `2 pi/log q`-periodic in height; zeta has no such structure
   (sq-causal-cascade Theorem 5). The family tests single-delay sections, which zeta provably does not have.

So the T-NR threshold is a sharp, correct, one-parameter switch, and it is a switch on the finite-dimensional
object `1 + c y + y^2`. The step from "each local factor is tempered" to "the product has its zeros on the line"
is the whole of GRH and none of it is touched here. OPEN, unchanged.

## 5. Stated result

**Proposition (PROVED).** Let `F_0` be any function with `F_0'/F_0 = L_0` meromorphic, and
`X_c = F_0 . (2cosh(z log q) + c)`. For each functional `Phi` in {F1, F2, F5} the value `Phi(X_c)` does not depend
on `F_0` and is non-negative iff `|c| <= 2`. For F3, `Phi(X_c) = (2 - c)[2 l^2 + (2 - c) L_0'(i pi/l)]` whenever
`F_0(i pi/l) != 0`, with a simple zero at `c = 2` of slope `-2 l^2` independent of `F_0`. In particular no
functional of this list distinguishes `F_0 = xi` from `F_0` = completed Davenport-Heilbronn.

## 6. Controls on the positive findings

**Davenport-Heilbronn.** DH is not a test-vector modification of zeta, so the control is: take DH as the base
and apply the same symbol. F1, F2, F5 are identical by the Proposition. F3 (MEASURED): sign change at `c = 2`
exactly, slope `-2.41390`, with `L_0'(i t_0) = 0.34997` (`q = 3`), second root 8.897 (`q = 3`), 2.287 (`q = 2`).
F6 (MEASURED): crossings within `2e-9` of 2 on 12 nodes (`q = 3`). The functionals hold for DH-based members with
`|c| <= 2`, all of which have off-line zeros. They therefore do not fail for DH, and by the wall they cannot be
steps of a zero-location argument for the base. Which step uses the Euler product: none; the symbol's unit-circle
condition is a statement about one quadratic polynomial.

**Backward heat** (kernel `e^{tau u^2/16} kappa_c(u)`, MEASURED by quadrature of the kernel, `controls.py`;
`tau = 0` reproduces the product to `2e-19`). The flowed member is no longer a product: the multiplier
`q^{+-z}` becomes a shift of the base by `+-tau l/2` (h-hecke-channels R3). For the symbol alone the threshold
moves to `|c| = 2 e^{tau l^2/4}` (PROVED: `cosh(z l)` is an eigenfunction). For the full field, `q = 3`:

| c | tau | symbol-only threshold | zeros near `t_0` |
|---|---|---|---|
| 1.9 | 0 | 2 | on the line (2 sign changes of `X(it)`) |
| 1.9 | -0.25 | 1.8547 | off the line: `z = 0.20011 + 2.87636i` |
| 1.9 | -1 | 1.4791 | off the line: `z = 0.67700 + 2.92676i` |
| 1.5 | -1 | 1.4791 | off the line: `z = 0.10999 + 2.92688i` |
| 1.0 | -1 | 1.4791 | on the line |
| 2.2 | +0.25 | 2.1567 | off the line: `z = 0.17889 + 2.84288i` |
| 2.2 | +1 | 2.7044 | on the line |

The condition `|c| <= 2` is not stable under backward heat (a member with `c = 1.9` has off-line zeros at
`tau = -0.25`), so the sign-change functionals are not flow-blind. They avoid that wall only because they are
the exact zero-location statement for the symbol.

**Sign twist.** Replace the base by `prod_{p != q} (1 - eps_p p^{-s})^{-1}` with any unimodular or bounded
`eps_p` (no functional equation). F1, F2, F5 are unchanged because they do not involve the base. They are
therefore true for objects with no functional equation and arbitrary zero sets: they use no global input.
F3, F4 need a function real on the line and are not formulable.

## 7. Three weakest steps

1. All numerics are mpmath floating point, not ball arithmetic. The sector crossings `|c*| - 2` down to `1e-55`
   are differences of eigenvalues of nearly singular 12 x 12 matrices at 220 digits; the 50-digit run was
   visibly unreliable below `1e-9` and one 700-digit Hankel row had to be discarded. The orders of magnitude are
   claimed, not the digits.
2. The classification "(c), converging to 2" for F6 and F7 rests on two node sets and orders up to 30. That
   `c*(nodes) -> 2` and `eps_K -> 0` in the limit follows from the all-order equivalences (Loewner / Stieltjes,
   CLASSICAL), but no rate is proved.
3. Section 4 ("where the gap sits") is a location statement assembled from sq-causal-cascade and
   stack-antibridge, which are not all refereed. It identifies what the local condition cannot reach; it is not
   a theorem that no argument can bridge it. The `Gamma_-` table uses the isolated-pair model for comparison
   and finds 1 to 7 percent deviations at larger `delta_0`; poles with `Re z < 1e-3` were not located for
   `c = 2.001`.

## Files (all under `tmp/research-2026-11-16/push/h-local-sign-change/`)

- `verify.py`, `verify_{2,3,5,11}.log/.json`: winding-number counts and located zeros, 108 members.
- `functionals.py`, `functionals_q{2,3}.json/.log`: sector matrices, Laguerre, section passivity, coefficient
  quantities, poles of `S`. Value-against-`c` data for plots is in the `rows_*` arrays (57 values of `c`).
- `sector_hp.py`, `sector_hp_q{2,3}.json/.log`: 220-digit sector crossings.
- `hankel.py`, `hankel_q3.json`; `hankel_near.py`, `hankel_near_q3.json`: moment pair and first failing orders.
- `controls.py`, `controls.json/.log`: Mellin check, pole cancellation, backward heat, zeros of `D`.
- No figures were rendered; the JSON files are the plot data.
