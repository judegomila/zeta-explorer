# c12-x04-oval-hecke-fricke-loading: Hecke operators, U_2 and w_4 on theta restricted to the real oval of X_0(4)

Date: 2026-11-19. Kind: combine. Nothing here proves or refutes RH, no bound moves, no statement about zeros of zeta is made.
Labels: PROVED (in this note, elementary), CLASSICAL (cited from memory unless stated), MEASURED (mpmath 30 digits or
python-flint midpoints; not interval-certified), OPEN.

## 0. Verdict

**Precise obstruction; the decisive first test closes the device.** The Mellin transform along the arc turns every
term of the candidate into "a Dirichlet polynomial in p^(-s) times Lambda(s)". The candidate is an identity, not an
inequality:

- real isogenous points (two per odd prime): multiplier `R_p(s) = p^(s-2) + p^(-1-s) = 2 p^(-3/2) cosh((s - 1/2) log p)`;
- complex isogenous points (`p^2 - 1` plus `p - 1` per odd prime), summed: multiplier `C_p(s) = 1 + 1/p - R_p(s)`;
- `R_p + C_p = 1 + 1/p`, the eigenvalue of `T_{p^2}` on theta. This is the statement `c(pm) = c(m)` for the
  coefficients of zeta, i.e. the Euler factor.

The one true inequality in the picture, `C_p(1/2 + it) >= 1 + 1/p - 2 p^(-3/2) > 0`, is a statement about the
multiplier and holds for every function in the module. The non-commutative carrier `<U_2, w_4>` acts on theta
through a commutative quotient (Lemma 3). The summed complex-point term of theta at the prime `q` is, up to the
factor `-q^(-3/2)`, the T-NR twin with `c = -(q^(3/2) + q^(1/2))` (Lemma 2(c)), so the object the candidate proposed
to bound is itself a named control. E_a with real `a` passes every input of the candidate. The Epstein controls
`n = 5, 6` pass positivity and the Fricke equation and fail only at the identity step "the summed complex points
return dilates of the same function".

Pivot (one): keep the complex points unsummed. A single complex point has a Mellin transform with zeros off the
line (MEASURED). The second moment over the complex points is the theta function of two index-`p` sublattices of
`Z^2`, which is the lattice Hecke relation of map row G16 (closed), with off-line zeros for the single class
`[2,2,5]` (MEASURED). The pivot closes too.

## 1. Plan

New relative to the sources: `h-klein-fricke` identified the arc and `w_4`; `c1-shear-hecke-fricke` section 5.2
recorded that `w_4` is evenness and `V_p` a translation of the geodesic, and stated without computation that the
half-integral weight `T(p^2)` "uses points off the arc". This lane computes that operator on the arc point by point
(real and complex isogenous points separately), computes the algebra generated with `U_2` and `w_4`, and runs the
decisive test and the controls. STRATEGY 3.1 listed this as not run.

Conventions. `theta(tau) = sum_n e(n^2 tau)`, `e(t) = exp(2 pi i t)`. Arc: `tau = i x/2`, `x > 0`, so
`theta(x) = sum_n exp(-pi n^2 x)`. `psi = (theta - 1)/2`. `Lambda(s) = pi^(-s/2) Gamma(s/2) zeta(s)`.
Mellin transform along the arc: `M[g](s) = int_0^inf (g(x) - g(inf)) x^(s/2) dx/x`; `M[theta] = 2 Lambda(s)` for
`Re s > 1`. Operators on functions on the arc: `(D_l g)(x) = g(l x)`, `(W g)(x) = x^(-1/2) g(1/x)`. `W theta = theta`
(Jacobi); `W` is `w_4` on the arc (h-klein-fricke Prop. 1(b), with `x = K'/K`).

## 2. First lemma: T_{p^2}, U_2, U_4, w_4 on the arc

**Lemma 1 (PROVED; operator formula CLASSICAL, Shimura 1973, recalled).** For `f = sum a(n) e(n tau)` of weight
1/2 on `Gamma_0(4)` and `p` odd, `T_{p^2} f` has coefficients `a(p^2 n) + p^(-1) (n/p) a(n) + p^(-1) a(n/p^2)`.
In points:

    T_{p^2} f(tau) = p^(-2) sum_{b mod p^2} f((tau + b)/p^2)  +  p^(-1) G_p^(-1) sum_{b mod p} (b/p) f(tau + b/p)  +  p^(-1) f(p^2 tau),

`G_p = sum_b (b/p) e(b/p)`. For `tau` on the arc:

(a) The points `(tau + b)/p^2` with `b != 0 mod p^2` and `tau + b/p` with `b != 0 mod p` are not on the real locus
of `X_0(4)` for all `x` outside a countable set: the vertical real arcs are the lines `Re tau in (1/2) Z` (translates
of the two arcs ending at the cusp `inf`), the other real arcs are countably many semicircles, and a line
`Re tau = beta` with `2 beta` not an integer meets each of them in at most one point. Exactly two points are on the
arc: `tau/p^2` and `p^2 tau`. Count: 2 real, `p^2 + p - 2` complex.

(b) On theta: `U_{p^2} theta = theta` (a square `m^2` has `p^2 n = m^2` iff `n` is a square), the twisted term is
`theta - D_{p^2} theta` (`(m^2/p) = 1` iff `p` does not divide `m`), and `T_{p^2} theta = (1 + 1/p) theta`.
Hence on the arc

    real part     Re_p theta  = p^(-2) D_{p^(-2)} theta + p^(-1) D_{p^2} theta,
    complex part  Cx_p theta  = theta - p^(-2) D_{p^(-2)} theta + p^(-1) (theta - D_{p^2} theta).

The summed complex points are a combination of dilates of theta along the arc. Each single complex point is not
real-valued (largest imaginary part 0.72 to 11.8 in the table below).

(c) `p = 2`. `U_2 theta(tau) = (1/2)(theta(tau/2) + theta((tau+1)/2)) = theta(2 tau) = D_2 theta`. Both points are
real: `(tau + 1)/2` lies on the arc `Re tau = 1/2` of the same oval, and `theta((tau+1)/2) = 2 theta(2x) - theta(x/2)`
(the function `theta_4`). `U_4 theta = theta`. `U_2 theta` has level 8 and character `chi_8`.

(d) Non-commutation. `W D_l W = l^(-1/2) D_{1/l}`. On theta: `(W U_2 - U_2 W) theta = 2^(-1/2) D_{1/2} theta - D_2 theta`,
which is not zero.

MEASURED (`checks.py` part A, B; `checks.json`): for `p = 3, 5, 7` and `x = 0.05, 0.37, 1.3` the residuals of
`U_{p^2} theta - theta`, twisted term, eigen-equation and "complex part = dilates" are all below `3.2e-30`. Part B:
`theta_4` identity `2e-31`, `U_2 theta - D_2 theta = 0`, `U_4 theta - theta < 5e-32`, commutator on theta
`0.4481968` at `x = 0.37` and `-0.1095448` at `x = 1.3`, equal to the prediction.

## 3. Decisive first test: what the Mellin transform does

**Lemma 2 (PROVED).** `M[D_l g](s) = l^(-s/2) M[g](s)` and `M[W g](s) = M[g](1 - s)` (constant terms handled as for
theta). Hence for `Re s > 1`, and for all `s` by continuation:

(a) `M[Re_p theta] = R_p(s) 2 Lambda(s)`, `R_p(s) = p^(s-2) + p^(-1-s) = 2 p^(-3/2) cosh((s - 1/2) log p)`.

(b) `M[Cx_p theta] = C_p(s) 2 Lambda(s)`, `C_p = 1 + 1/p - R_p = (1 - p^(s-2)) + p^(-1)(1 - p^(-s))`. The second
bracket, from the Legendre-twisted term, is the Euler factor of zeta at `p`.

(c) `C_q(s) Lambda(s) = -q^(-3/2) Lambda(s) (2 cosh((s - 1/2) log q) + c)` with `c = -(q^(3/2) + q^(1/2))`, `|c| > 2`.
This is `-q^(-3/2)` times the T-NR twin (map section 2, row NR). Its extra zeros are at
`Re s = 1/2 +- arccosh(|c|/2)/log q`: `2.497, -1.497` (`q = 2` formally), `2.242, -1.242` (`q = 3`), `2.110, -1.110`
(`q = 5`). The zeros of `R_p` are on the line, at `t = (k + 1/2) pi/log p`.

(d) On the line, `R_p(1/2 + it) = 2 p^(-3/2) cos(t log p)` is real and
`C_p(1/2 + it) >= 1 + 1/p - 2 p^(-3/2) > 0` (0.948 at `p = 3`, 1.021 at `p = 5`).

Proof: substitution in the integral; (c), (d) are algebra. MEASURED: `M[D_9 psi]` against `9^(-s/2) Lambda(s)` at
`s = 2.3 + 1.1i`, relative error `7e-17` (20-digit quadrature).

**Lemma 3 (the carrier; PROVED).** Let `A` be the algebra generated by all `D_l` (`l` positive rational) and `W`.
`W^2 = 1`, `W D_l W = l^(-1/2) D_{1/l}`: `A` is a twisted group algebra of the generalised dihedral group
`Q_+^* x| Z/2`. On the Mellin side `D_l` is multiplication by `l^(-s/2)` and `W` is `s -> 1 - s`. Every `X` in `A`
is `X = a + b W` with `a, b` in the dilation algebra, and for every `g` with `W g = g`:

    X g = (a + b) g,     M[X g](s) = (m_a(s) + m_b(s)) M[g](s),   m_a(s) = sum a_l l^(-s/2).

So the cyclic module `A theta` equals the module generated by dilations alone, and on it `A` acts through the
commutative algebra of Dirichlet polynomials in the `p^(-s/2)`. The commutator of Lemma 1(d) becomes the multiplier
`2^(3/4) sinh((s - 1/2) (log 2)/2)`, odd under `s -> 1 - s`.

Remark (CLASSICAL, Serre-Stark 1977). `M_{1/2}(Gamma_0(4))` is spanned by theta. Any operator of the level-4 Hecke
algebra, commutative or not (`T_{p^2}`, `U_4`, `w_4`, the Kohnen operator `U_4 W_4`), acts on it by a scalar. With
all levels allowed, the weight-1/2 forms are spanned by the `theta_psi(l tau)`, `psi` an even primitive character;
those with `psi` trivial form the module of Lemma 3. There is no second vector for the non-commuting pair to act on.

**Answer to the decisive test.** The candidate "positivity of the real period on the arc plus a bound on the
complex isogeny terms, summed over primes" becomes, term by term, `multiplier(s) x Lambda(s)`:

1. If the complex terms are summed first, they are `C_p(s) Lambda(s)` exactly. The relation is the identity
   `R_p + C_p = 1 + 1/p`, equivalent to `c(pm) = c(m)`; this is Lemma 2(a) of `c1-shear-hecke-fricke` again. The
   inequality of Lemma 2(d) concerns `C_p` only.
2. If the complex terms are bounded one by one, the cancellation is lost at once. At `x = 1e-5`:
   `sum_{b != 0} |theta(tau + b/p)|` = 365, 566, 717, 953, 1052 for `p = 3, 5, 7, 11, 13` (the value
   `(p - 1) p^(-1/2) x^(-1/2)`), against `|sum_{b != 0} theta(tau + b/p)| < 3e-27` (exactly `p theta(p^2 x) - theta(x)`).
   The loss is the sum of the non-principal Gauss sums and grows like `sqrt(p)` per prime.
3. Summed over all primes: `prod_{p <= P} (1 - D_{p^2}) theta = sum over n coprime to P# of exp(-pi n^2 x)`, a
   positive function with Mellin transform `2 prod_{p <= P} (1 - p^(-s)) Lambda(s)`. For `Re s > 1` this tends to
   `2 pi^(-s/2) Gamma(s/2)`. The same computation holds for every completely multiplicative sign twist (THIN has a
   zero at `b` in `(1/2, 1)`). Exchange of the limit in `P` with the Mellin transform at `Re s <= 1` is the
   zero-free statement: the R4 wall in its usual form.
4. Positivity of theta on the arc gives, by Bochner, that `t -> Lambda(sigma + it)` (after the pole terms) is a
   positive-definite function for `sigma > 1`. The Epstein theta functions `theta(x) theta(n x)` are positive on
   the arc for every `n`. This family is closed (STRATEGY 3.1 item 4).

Quadratic forms on `A theta` that are covariant under dilation are `int |m(1/2 + it)|^2 |Lambda(1/2 + it)|^2 dt`
with a Dirichlet-polynomial weight: mean values (MV-CAP; STRATEGY 3.1 item 3).

Bridge symbol. `S = N/D` is built from `F = xi` alone. `A` maps `F` to `m(s) F`; `S` changes by a factor that
depends on `m, m'` and not on the zeros of `F` beyond the identity. No one-sided statement for `S` results.

## 4. Controls

| control | positivity on the arc | Fricke equation | step "summed complex points = dilates of the same function" | outcome |
|---|---|---|---|---|
| Epstein `n = 5` (`[1,0,5]`, `h = 2`), off-line zero `0.9329697 + 15.6682495i` | passes | passes (`w_20`, residual `6e-31`) | **fails** at `p = 3` (and every `p` represented by `[2,2,3]`): `T_3 Theta_[1,0,5] = 2 Theta_[2,2,3]` (residual `1.2e-30`; distance to `2 Theta_[1,0,5]` is 0.49). Holds at `p = 29` (principal). | fails at an identity step |
| Epstein `n = 6` (`[1,0,6]`, `h = 2`), off-line zero `0.8037491 + 15.1175785i` | passes | passes | **fails** at `p = 5`: `T_5 Theta_[1,0,6] = 2 Theta_[2,0,3]` (residual `4e-31`; 0.50 from `2 Theta_[1,0,6]`) | fails at an identity step |
| `n = 1`, `n = 7` (`h = 1`; reference) | pass | pass | holds (`p = 5`: `1.6e-30`; `p = 11`: `1.2e-30`) | - |
| T-NR | passes (stated in the map; `Cx_p theta > 0` at the 9 points of part A) | passes | **passes**: the twin lies in `A theta`, and `Cx_q theta` is a twin (Lemma 2(c)) | not separated by any statement about the module; separated only by the size of the coefficient at the one prime `q` |
| E_a, `a` real in `(0, 1/2)` | passes for the non-constant part `4 sqrt(y) sum n^a sigma_{-2a}(n) K_a(2 pi n y)` (every term positive) | passes (`y -> 1/y`, `4e-16`) | **passes**: one-point orbit, `T_p E*(., 1/2 + a) = (p^a + p^(-a)) E*` (`7e-17` at `p = 3`, `y = 1.3`, `a = 0.2`) | passes every input; Mellin transform along the arc is `Lambda(s' + a) Lambda(s' - a)` (`int F y^s dy/y`, `s' = s + 1/2`; termwise from the Bessel integral), whose zeros are zeros of zeta shifted by `+-a` |
| DH | not used | passes (level 5) | fails at `p = 2, 3, 7` (`c(pn)/c(n)` takes the two values `0.284, -3.520`); holds at `p = 11` (`+1`) and `p = 19` (`-1`) | fails at an identity step, as in `c1-shear-hecke-fricke` |
| backward heat | passes | passes | not formulable: the kernel `exp(tau u^2/16) kappa` is a function on the arc only; it has no extension periodic in `Re tau`, so the complex points do not exist. With `D_{p^2}` used instead, `[D, G_tau] != 0` (map row G22) | fails at "the function extends off the arc" |
| completely multiplicative sign twist; unimodular twist `n^(i alpha)` | not all positive / complex | **fail** (no `W`) | pass (`c(pm) = eps(p) c(m)`) | fail only at the Fricke step |
| Beurling, phase-rotated transfer operator, `theta^w` | not run | | | |

Lemma 4 (PROVED; needed for the two Epstein rows). `Theta_[2,2,3]` is not in the dilation module of `Theta_[1,0,5]`.
Proof. With `psi` the non-trivial class character, the Epstein series are `Z_0 = E_1 + E_2`, `Z_1 = E_1 - E_2`,
`E_1 = zeta L(chi_-20)`, `E_2 = L(psi)` (CLASSICAL). If `B Z_1 = A Z_0` for Dirichlet polynomials `A, B` supported
on a finite set `S` of primes, `B != 0`, then `(B - A) E_1 = (A + B) E_2` as formal Dirichlet series. Take a prime
`q` outside `S`, `q = 3 or 7 mod 20`; its local factors are `(1 - X_q)^(-2)` in `E_1` and `(1 + X_q)^(-2)` in `E_2`.
Setting `X_p = 0` for `p` outside `S` and `q` gives `(B - A) E_1,S (1 + X_q)^2 = (A + B) E_2,S (1 - X_q)^2` with
`A, B, E_i,S` free of `X_q`. Comparing the coefficients of `X_q` gives `(B - A) E_1,S = -(A + B) E_2,S`, and of
`X_q^0` gives `(B - A) E_1,S = (A + B) E_2,S`; so `A + B = 0 = B - A`, `B = 0`. Contradiction. The same proof serves `n = 6`.

Reading of the table. R3 is not met: T-NR and E_a pass the whole candidate. Where a control fails, it fails at the
multiplicativity identity (Epstein, DH), at the Fricke equation (twists), or because the complex points are not
defined (heat). No control fails at an inequality, because the candidate contains no function-dependent inequality.

## 5. Pivot (one): the complex points kept apart

(a) One complex point (PROVED identity; zeros MEASURED). For `p = 5`:

    sum_{n >= 1} e(b n^2/5) n^(-s) = cos(2 pi b/5) (1 + (b/5) sqrt(5) 5^(-s)) zeta(s) + i sin(2 pi b/5) L(s, chi_5)

(residual `3e-31`, `1e-31` for `b = 1, 2` at `s = 2.3 + 1.1i`). For general `p` the point `tau + b/p` gives zeta times
a local factor plus a combination of `L(s, chi)`, `chi` even mod `p`, with coefficients of size `p^(-1/2)` (Gauss
sums). For `p = 1 mod 4` the zeta component has the local factor `(G - 1)(1 + G p^(-s))/(p - 1)`, `G = (b/p) sqrt(p)`,
with zeros on `Re s = 1/2`. At `p = 5` the real part of the point is this Euler product alone and the point is a
complex combination of two Euler products; for larger `p` the real part already contains other even characters
(`ref_check.py` item 5, `p = 13`). Zeros of the `b = 1` function in the strip (30 digits, residual `< 1e-30`):
`0.2799106 + 6.5787853i`, `0.8301784 + 12.0548411i`, `0.8607696 + 19.6692060i`, `0.8989426 + 28.7036131i` and four
more. It is not positive on the arc: `Re theta(tau + b/5) = +44.72, -44.72` at `x = 1e-4` for `b = 1, 2`
(prediction `(b/5) 5^(-1/2) x^(-1/2)`). A statement about a single complex point is a statement about a
Davenport-Heilbronn-type combination.

(b) Second moment over the complex points (PROVED; residuals `1.4e-30`, `4e-31` at `p = 3, 5`):

    (1/p) sum_{b mod p} |theta(tau + b/p)|^2 = Theta_{L+}(x) + Theta_{L-}(x) - theta(p^2 x)^2,

`L+- = {(m, n) in Z^2 : n = +-m mod p}`, two of the `p + 1` index-`p` sublattices of `Z^2`; `L+` has the form
`[2, 2, (p^2 + 1)/2]` of discriminant `-4 p^2`. The square of the weight-1/2 datum is the weight-1 theta function
of the Gaussian torus (`theta^2 = 2K/pi`, the period itself), and the positive form over the complex points is the
lattice Hecke correspondence of Proposition 2 of `h-klein-fricke`, restricted to two of its `p + 1` terms. That
relation holds for every lattice (map row G16, closed). For `p = 3` the class `[2,2,5]` (`h(-36) = 2`) has off-line
zeros at `0.62902 + 18.31995i`, `0.95286 + 23.95224i`, `1.16677 + 30.99393i` (MEASURED, 15-digit Muller iteration
on flint midpoints, residual `< 1e-8` after scaling by `exp(pi t/2)`; not enclosed).

Relation to the Krein square of `g-spinor-square-root`: the square available on the arc is `theta^2`, whose Mellin
transform is `zeta(s) L(s, chi_-4)` with its gamma factor; it is not `H_c`, and its positivity is Bochner
positive-definiteness in `t` right of 1, not causality of `S`.

The pivot closes at G16. No further pivot.

## 6. Device row proposed for the map

| G-new | Hecke operators `T_{p^2}`, `U_2`, `U_4` and Fricke `w_4` on theta restricted to the arc of `X_0(4)(R)`; real against complex isogenous points | Two of the `p^2 + p` points are real. Summed complex points = dilates of theta; Mellin multipliers `R_p = 2 p^(-3/2) cosh((s - 1/2) log p)` (real points) and `C_p = 1 + 1/p - R_p` (complex points); `C_p Lambda` is `-p^(-3/2)` times a T-NR twin. The algebra `<D_l, W>` is non-commutative but acts on any `W`-fixed vector through Dirichlet polynomials (`a + bW -> a + b`); `M_{1/2}(Gamma_0(4))` is one-dimensional. Termwise bounds on complex points lose `sqrt(p)` per prime. One complex point is a DH-type combination with off-line zeros; the second moment over complex points is the lattice Hecke relation G16. | PROVED (identities); MEASURED (zeros) | T-NR and E_a pass everything; Epstein `h > 1` and DH fail at the identity `c(pm) = lambda c(m)`; twists fail at `W` | `c12-x04-oval-hecke-fricke-loading` |

## 7. Requirement flags

- R1 (multiplicativity essential): **not established**. Multiplicativity enters as the identity `U_{p^2} theta = theta`
  (`c(pm) = c(m)`). No inequality fails at non-CM tori, because there is no inequality: the Epstein controls fail an
  identity (section 4), and E_a, which is multiplicative, passes.
- R2 (height-uniform, every window): **not established**. The only inequality (Lemma 2(d)) is uniform in `t` but is
  about `C_p`, not about zeros.
- R3 (every control fails at a structural step): **not met**. T-NR and E_a pass every step.
- R4 (reaches the critical line): **not met**. The all-prime form (section 3, item 3) converges for `Re s > 1` only.
  No bound beyond the window `T_0 ~ 2 pi y` was sought or obtained.

## 8. Three weakest steps

1. Scope of the closure. The assignment's candidate is not a formula; sections 3 and 5 cover (i) expressions linear
   in the Hecke images of theta on the arc, (ii) dilation-covariant quadratic forms on them, (iii) single complex
   points, (iv) their second moment. A functional of the unsummed complex points that is neither linear nor a second
   moment is not excluded by a theorem here.
2. Off-line zeros in section 5 and the control rows are float computations (mpmath findroot; flint midpoints),
   not interval enclosures, and `N_right` was not counted for `[2,2,5]` or for the single-point function.
3. The operator formula for `T_{p^2}` in weight 1/2 and the Serre-Stark basis theorem are recalled, not opened; the
   numerics confirm the eigen-equation for the formula as written, not its normalisation in the literature.
   REFEREE.md is the author's own second pass; there is no independent referee.

## 9. Files

`checks.py` (all numerics; run with `scripts/memcap.sh 8 .venv-arb/bin/python`, 45 s, under 200 MB), `checks.json`,
`checks.log`, `ref_check.py`, `ref_check.log` (second pass, other cases), `REFEREE.md`, `lanes.jsonl`. Server not used.
