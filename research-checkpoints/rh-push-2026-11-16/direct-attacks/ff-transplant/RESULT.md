# ff-transplant: the function-field proof of RH in one-sided / Pick coordinates, and where its transplant to zeta stops

Date: 2026-11-16. Scratch note under `tmp/research-2026-11-16/push/ff-transplant/`. Not reviewed. No RH claim, no new
zero-free region, no Λ bound changes.

Labels: PROVED (argument written here), CLASSICAL (cited, not re-derived), MEASURED (mpmath, not interval-certified),
ARGUED (mechanism stated, constants not derived), OPEN.

## Verdict

**No new unconditional inequality for zeta. Precise obstruction, with size.**

1. The exact function-field analogue of `Q_L(v)` and of the real-node Pick matrix is written down and verified on four
   curves (genus 1 and 2). In these coordinates the form is a Toeplitz form of rank exactly `2g`, the Schur/Verblunsky
   recursion terminates at step `2g` with a unimodular parameter, and every Pick matrix of order `> 2g` is singular.
2. Both classical proofs produce the positivity through one object: the `2g`-dimensional space `V = R[S]/(P~)` (image of
   the Frobenius-graph span in the primitive Néron–Severi space of `C x C`) with the Toeplitz form `c_{|m-n|}`.
   Hodge index gives all minors at once. Stepanov–Bombieri gives only the 2x2 shift minors, with additive slack 1, and
   `dim V = 2g < infinity` (Riemann–Roch) upgrades bounded 2x2 minors to full positivity.
3. Over Spec Z the second ingredient (finite dimension) transplants **without loss**: Proposition S below replaces it by
   Landau's lemma, and over Z it is stronger than over F_q (a one-sided bound suffices, because xi has no real zeros;
   over F_q a one-sided bound is satisfied by a fake). The first ingredient (the 2x2 shift minor for one fixed test) is
   then exactly the classical statement `psi`-error `= O(x^{1/2} polylog)`. The Stepanov substitute over Z (sieve)
   certifies the minor with defect `e^{l/2}` (= `x^{1/2}`, the trivial size); zero-free inputs give
   `e^{l/2 - c l^{3/5-}}` (classical) or `e^{3l/8}` (conditional on the unrefereed 7/8 input). Required: polynomial in `l`.
   Function field: additive constant 1.
4. Adjacent finding (pivot, MEASURED + one PROVED bound): the function-field model reproduces the Pick-order horizon
   measured in `euler/RESULT.md`. A planted off-circle quartet behind `n` on-circle zero pairs is first seen at Pick
   order about `2n+3` to `4n+3`, and never later than `p+1` where `p` is the positive index (PROVED). The zeta table in
   `euler/RESULT.md` §2.2 is fitted by `N* = 4n+3` (n = index of the moved zero) to within 4%.

## 0. What is new relative to the atlas and earlier notes

Read first: route atlas (PR #27), the three 2026-11-01 syntheses, `2026-11-01-r2-stepanov.md`,
`2026-11-01-arith-surface.md`, `eq48/RESULT.md` + referee, `pick/NEXT_STAGE.md`, `euler/RESULT.md`.

| Earlier item | What it already has | What this note adds |
|---|---|---|
| arith-surface §4.3 Prop 4.2 | function-field fakes: Euler product with nonnegative counts + FE + rationality do not imply Hodge index | not repeated; the fakes are reused as controls in Pick coordinates (first failing Pick order, Verblunsky parameter leaving the disc) |
| arith-surface §5–6, §8.2, §8.6 | Hodge-index argument on S_Q fails at the Riemann–Roch inequality (R2); Rosati = Hilbert–Pólya; Stepanov needs a ring endomorphism | not repeated; the same wall is located here as "2x2 shift minor of one row" |
| r2-stepanov | Stepanov transplant for `S(X) <= 2 sqrt X + ...`; fails by the parity factor (Thm P) or by Mertens-type cancellation | not repeated; Step 4 cites Thm P for the size of the sieve defect |
| atlas §2 | every-shift positivity is an RH-equivalent reformulation | Prop S is the one-node, one-row form in Pick coordinates, with the one-sided (Landau) version and its function-field failure |
| eq48 Thm 1–4 | `Q_L` = Weil on one-sided exponentials; margin version false | function-field analogue: exact fibre decomposition into rank-`2g` Toeplitz forms |
| pick/NEXT_STAGE, euler/RESULT | K <= 12 from verified height; DH passes to order 100; horizon fit `0.150 gamma^1.441` | function-field calibration: ladder terminates at order `2g`; horizon is linear in the number of on-line zeros in front; `4n+3` re-reading |

Walls: the argument attempted in §4 fails for DH at the correct step (the sieve step uses `Lambda(n) >= 0`), is not a
mean-value argument, and makes no finite-certificate claim. It does not get past the parity wall.

## 1. Step 1: exact analogue of `Q_L(v)` and the Pick matrix for a curve

`C/F_q` of genus `g`, `P(T) = prod_{j<=2g} (1 - alpha_j T)`, `N_n = #C(F_{q^n}) = q^n + 1 - sum alpha_j^n`.
Put `z_j = alpha_j / sqrt q` (the multiset is closed under `z -> conj z` and `z -> 1/z`), `s = 1/2 + w`, `u = q^{-w}`.

    F(w) := prod_{pairs} (u + 1/u - z_j - 1/z_j)        (entire, even; the analogue of xi(1/2+w))
    L(w) := F'/F = log q * H(q^{-w}),   H(u) = (1/2) sum_j (1 + u z_j)/(1 - u z_j) = g + sum_{n>=1} c_n u^n,
    c_n  := sum_j z_j^n = q^{n/2} + q^{-n/2} - N_n q^{-n/2},   c_0 = 2g.

**Proposition 1 (PROVED; algebra, checked numerically).** For `v = sum b_i e^{-x_i t}` with real `x_i > 1/2`
(under RH for `C`: `x_i > 0`), `u_i = q^{-x_i}`, `C_v(l) = int_0^inf v(t+l) conj v(t) dt`:

    Q_L(v) = sum b_i conj b_k (L(x_i)+L(x_k))/(x_i+x_k)
           = 2 g log q ||v||^2  +  2 log q sum_{n>=1} (q^{n/2}+q^{-n/2}) Re C_v(n log q)  -  2 log q sum_{n>=1} N_n q^{-n/2} Re C_v(n log q)
           = sum_rho V(rho) conj V(-conj rho),      rho = (log z_j + 2 pi i k)/log q.

So the gamma energy `E_gamma(v)` of eq. (16) becomes the genus term `2 g log q ||v||^2`, the pole term is
`q^{n/2}+q^{-n/2}`, and the prime term is the point count. *Proof.* `1/(x_i+x_k) = int_0^inf e^{-(x_i+x_k)t} dt` and
`q^{-n x_i}/(x_i+x_k) = int_0^inf e^{-x_i(t+n log q)} e^{-x_k t} dt`; insert the series for `H`. The zero side is
eq48 Thm 1 with the same pairing identity. ∎

**Fibre decomposition (PROVED).** With `v_tau(m) = v((m+tau) log q)`, `tau in [0,1)`:

    Q_L(v) = (log q)^2 int_0^1 Q^disc(v_tau) d tau,
    Q^disc(a) := sum_{m,n>=0} a_m conj a_n c_{|m-n|}  = sum_j A(z_j) conj A(1/conj z_j),   A(z) = sum a_m z^m.

`Q^disc` is a Toeplitz form on one-sided sequences. On geometric sequences `a_m = u^m` it is the disc Pick matrix

    P^disc_ik = (H(u_i)+H(u_k))/(1 - u_i u_k) = sum_j 1/((1-u_i z_j)(1-u_k/z_j)),

and `P^cont = (log q)^2 P^disc o M` (Schur product) with `M_ik = int_0^1 (u_i u_k)^tau d tau`, a PSD Gram matrix.
Hence `P^disc >= 0` implies `P^cont >= 0`.

**Rank (PROVED).** `Q^disc` factors through the `2g` evaluations `A -> A(z_j)`, so every Toeplitz section and every
disc Pick matrix has rank `<= 2g`; the continuous Pick matrix has infinite rank only through the periodic copies
`k in Z` of the same `2g` zeros. Under RH for `C`, `Q^disc(a) = sum_j |A(z_j)|^2`.

**Schur recursion (CLASSICAL, Szegő/Verblunsky).** The measure `sum_j delta_{theta_j}` on the circle has Verblunsky
parameters `|gamma_k| < 1` for `k < 2g` and `|gamma_{2g}| = 1`; Schur defects `D_k = c_0 prod_{i<=k}(1-gamma_i^2)`,
`D_{2g} = 0`. RH for `C` <=> the recursion run on `(c_n)`, i.e. on the point counts, stays in the disc and
terminates on the circle at step `2g`. `|gamma_1| <= 1` is the Weil bound for `N_1`; `|gamma_2| <= 1` is the
3x3 Toeplitz determinant, i.e. the Cauchy–Schwarz inequality behind Ihara's bound.

**Numerics (MEASURED, `ff.py` -> `ff.out`, 60 digits; point counts by brute force over `F_{q^n}`, L-polynomial from
`N_1..N_g`, extra `N_n` as an independent check).**

| curve | q, g | P(T) | N_1.. (brute force = from P) | Toeplitz min eig (size 2g) / rank at size 2g+4 | abs Verblunsky | Pick min eig, K = 2g nodes x > 1/2 (disc / cont) | Q_L three ways |
|---|---|---|---|---|---|---|---|
| y²=x³+x+1 | 5, 1 | 1+3T+5T² | 9, 27, 108, 675 | 0.658 / 2 | 0.671, 1 | 5.7e-3 / 2.2e-2 | agree to 14, 14, 10 digits |
| y²=x³+3x+2 | 7, 1 | 1+T+7T² | 9, 63, 324 | 1.622 / 2 | 0.189, 1 | 2.0e-2 / 6.0e-2 | agree |
| y²=x⁵+x²+1 | 3, 2 | 1+2T+6T²+6T³+9T⁴ | 6, 18, 18, 78, 246 | 0.265 / 4 | 0.289, 0.818, 0.346, 1 | 1.7e-6 / 1.1e-5 | agree |
| y²=x⁵+2x+1 | 5, 2 | 1+25T⁴ | 6, 26, 126, 726 | 4.0 / 4 | 0, 0, 0, 1 | 6.4e-6 / 1.7e-4 | agree |

For all four: `|alpha_j| = sqrt q` to 60 digits; Toeplitz sections of size `2g+1` and `2g+4` have smallest
eigenvalue `|.| < 1e-59` (rank `2g`); disc Pick matrices with `2g+2` nodes are singular to 1e-60, continuous ones are
positive definite; intersection form on `<H1, H2, Gamma_0..Gamma_{2g+2}>` has inertia `(1, 2g+1, 3)`.

Controls (fakes of arith-surface Prop 4.2; Euler product with `a_d >= 0`, FE, rational, RH false):

| fake | Toeplitz min eig (size 2g) | Verblunsky | first Schur defect < 0 | Pick, nodes x > 1/2 | intersection inertia |
|---|---|---|---|---|---|
| 1−5T+5T², q=5 | −0.236 | −1.118, 1 | D_1 | indefinite at K = 2 | (2, 2, 3) |
| 1−T−3T²−3T³+9T⁴, q=3 | −0.452 | −0.144, −0.574, −1.212, 1 | D_3 | indefinite at K = 3 | (2, 4, 3) |
| 1−T+7T²−3T³+9T⁴, q=3 | −0.760 | −0.144, 1.128, … | D_2 | disc indefinite at K = 3, cont at K = 4 | (3, 3, 3) |

## 2. Step 2: the two derivations and the common finite-dimensional mechanism

**Hodge index (CLASSICAL; identity checked numerically).** On `C x C` let `H1 = {pt} x C`, `H2 = C x {pt}`,
`Gamma_m` = graph of `Frob^m`. Then `Gamma_m.H1 = 1`, `Gamma_m.H2 = q^m`, `Gamma_m.Gamma_n = q^{min} N_{|m-n|}`,
`Gamma_m^2 = q^m (2-2g)`. The primitive part is

    (Gamma_m)'.(Gamma_n)' = Gamma_m.Gamma_n - q^m - q^n = - q^{(m+n)/2} c_{|m-n|}      (max error 3e-56 in ff.out)

so for `D_a = sum a_m q^{-m/2} Gamma_m`: `Q^disc(a) = -(D_a')^2 = 2 d_1 d_2 - D_a^2`. Castelnuovo–Severi is
`Q^disc >= 0`. For `g = 1`: `Q^disc(a) = 2 deg(sum a_m q^{-m/2} Frob^m)` (checked: 42.0997 both sides for
`a = (3,-2)`, and −0.8328 both sides on the fake, where no isogeny exists whose kernel it could count). In general
`Q^disc(a) = Tr(phi phi^dagger)` (Rosati) with `phi = A(q^{-1/2} Frob) in End^0(J) (x) R`. The positivity is that of a
count: an intersection number of an effective class with an ample class, supplied by Riemann–Roch on the surface
(`D^2 > 0` => `nD` or `-nD` effective).

**Stepanov–Bombieri (CLASSICAL).** Riemann–Roch on the curve gives `dim L(aP) (x) L(bP) = (a+1-g)(b+1-g)`, larger
than the dimension `a p^mu + b + 1 - g` of the target of `s (x) t -> s^{p^mu} t`; a kernel element composed with
Frobenius in the second factor is a nonzero function of degree `a p^mu + b q` vanishing to order `p^mu` at every
rational point. Result: `N_n <= q^n + 1 + (2g+1) q^{n/2}` for `q^n` a square `> (g+1)^4`, i.e.

    c_n >= -(c_0 + 1):   the 2x2 Toeplitz minor on (e_0, e_n), one-sided, with additive slack 1.

The matching lower bound comes from the same bound on a Galois cover. In the Hodge picture this is the 3-dimensional
span `<H1, H2, Gamma_n>` only.

**Closure lemma (PROVED).** Let `c_n = sum_j z_j^n` for a finite multiset closed under `z -> 1/conj z`. If
`|c_n| <= B` for all `n` in an arithmetic progression then all `|z_j| = 1` and every Toeplitz section is PSD.
*Proof.* `sum_n c_{dn} T^n = sum_j 1/(1 - z_j^d T)` has positive residues, so no cancellation, and radius `>= 1`;
symmetry gives `|z_j| = 1`. ∎ A one-sided bound `c_n >= -B` is **not** enough: the fake `1-5T+5T²` has
`c_n = 2, 2.24, 3, 4.47, 7, ... > 0`. This is why Bombieri needs the cover.

**The single mechanism.** Space: `V = R[S]/(P~(S))`, `P~` the normalized reciprocal L-polynomial, `dim V = 2g`;
equivalently the image of `span{Gamma_m}` in primitive `NS(C x C)_R`. Form: the Toeplitz form `c_{|m-n|}`
(= minus the intersection form = Rosati trace form). Dimension count: Riemann–Roch on the curve, `l(D) = deg D + 1 - g`
for `deg D >= 2g-1`, makes `(1-T)(1-qT)Z(T)` a polynomial of degree `2g`, so `(c_n)` satisfies a linear recurrence of
order `2g`. Positivity: (Hodge) all minors, from Riemann–Roch on the surface; or (Stepanov–Bombieri) 2x2 shift minors
with slack, from Riemann–Roch on the curve plus `f(x)^q = f(Frob x)`, then the closure lemma. A fake shares `V`, the
recurrence, the Euler product and the FE; it fails every one of the minors that the geometry supplies.

## 3. Step 3: the same objects over Spec Z, and what is missing

| Function field | Spec Z (one-sided / Pick coordinates) | Status |
|---|---|---|
| uniformizer `u = q^{-w}`, fibre lattice `log q * Z` | none; `log p` are incommensurable | no fibre decomposition; the form does not split into finite-rank pieces |
| shift `S` on one-sided sequences (= Frobenius graph `Gamma_1`) | translation semigroup `S_l`, `l >= 0`, on one-sided tests; primes are atoms `Lambda(n) n^{-1/2}` at `l = log n` | exists; this is the honest shift structure |
| genus term `2 g log q ||v||^2`, bounded | `E_gamma(v)`, unbounded: weight `~ (1/2pi) log|t|` in frequency | a delta test has infinite energy; the entry `c_n` has no pointwise analogue |
| `dim V = 2g`; Pick ladder terminates at order `2g` | infinitely many zeros per unit; ladder never terminates; each finite order is a verified-height statement (pick/NEXT_STAGE) and Euler-blind (euler/RESULT) | Riemann–Roch replaced by Riemann–von Mangoldt, which counts but does not truncate |
| closure lemma (finite dimension) | Prop S (Landau/Laplace) | transplants without loss, §4 |
| 2x2 shift minor from Stepanov (slack 1) | sieve bound, defect `e^{l/2}` | fails, §4 |
| all minors from Hodge index | Riemann–Roch inequality (R2) on S_Q | no section count exists (arith-surface Thm 6.2); not repeated |
| `Q^disc(a)` = intersection number / `2 deg` | no known object counted by `Q_L(v)` | the Rosati / Hilbert–Pólya gap (arith-surface §8.2) |

## 4. Step 4: transplant of the Stepanov–Bombieri scheme at its smallest failure

The scheme is: (i) one row of 2x2 shift minors with slack, (ii) closure. Over Z, step (ii) holds.

**Proposition S (PROVED; a reformulation of the classical `psi` criterion in Pick coordinates).** Fix `x > 1/2`,
`v_x(t) = e^{-xt}`, and let

    R_x(l) := sum_rho e^{rho l} / (x^2 - rho^2) = sum_{pairs} 2 cosh(rho l)/(x^2 - rho^2),   l >= 0,

the Weil pairing of `v_x` with its translate by `l` (zero side; `V(z)V(-z) = 1/(x^2-z^2)`). Then `R_x(0) = L(x)/x`
is the 1-node Pick entry, and the following are equivalent:

- (a) RH;
- (b) `|R_x(l)| <= R_x(0)` for all `l >= 0` (the 2x2 minor on `v_x` and its `l`-shift);
- (c) `R_x(l) >= -C(1+l)^m` for all `l`, for some `C, m`;
- (c') `R_x(l) <= C(1+l)^m` for all `l`, for some `C, m`.

*Proof.* (a) => (b): `R_x(l) = sum 2 cos(gamma l)/(x^2+gamma^2)`. (b) => (c),(c') trivially. (c) or (c') => (a):
`|cosh(rho l)| <= e^{l/2}` and `sum |x^2-rho^2|^{-1} < inf`, so for `Re z > 1/2`

    int_0^inf R_x(l) e^{-zl} dl = G(z) := sum_{pairs} 2z / ((z^2 - rho^2)(x^2 - rho^2)),

meromorphic on C with a pole at every zero `rho` (residue `m_rho/(x^2-rho^2) != 0`). Apply Landau's lemma to
`+-R_x(l) + C(1+l)^m >= 0`: the abscissa of convergence is a real singularity of `+-G(z) + C * poly(1/z)`. `G` has no
real poles because `xi` has no real zeros, so the abscissa is `<= 0`, `G` is analytic in `Re z > 0`, and no zero has
`Re rho > 0`. ∎

Numerical check of the normalization (`zcheck.py`): `R_1(0)` from 20000 zeros plus tail estimate `= 0.04613593`,
`L(1)/1 = 0.04613593`.

Remarks.
- Over F_q the analogue of (c) => (a) is **false** (fake `1-5T+5T²`, real zero). Over Z it holds because xi has no
  real zeros. So the closure half of Stepanov–Bombieri is stronger over Z than over F_q: no Galois cover is needed.
- Unwinding with the truncated explicit formula, (c)/(c') are one-sided bounds for
  `sum_{n<=X} Lambda(n) n^{-1/2+x}` against `X^{1/2+x}/(1/2+x)` with error `X^x polylog`. This is the classical
  equivalence; nothing is gained except the coordinates. It is the same target as (★) in r2-stepanov and as the
  box-class statement of arith-surface Prop 9.2.
- DH control: (a) <=> (b) uses only evenness, order 1 and `sum |rho|^{-2} < inf`, so it holds for DH, and DH fails
  (b). A proof of (b) must use the Euler product.

**The failing step: the minor itself.** What each available tool certifies for the row `R_x(l)`, `X = e^l`:

| Input | Certified bound | Label |
|---|---|---|
| required for RH | `C (1+l)^m`, either sign | Prop S |
| function field, Stepanov–Bombieri | `c_n >= -(c_0+1)`: additive constant | CLASSICAL |
| absolute values of zeros | `e^{l/2} sum 2/|x^2-rho^2|` | PROVED (trivial) |
| `Lambda(n) >= 0` alone | upper bound by the pole term, size `e^{l/2}` | ARGUED |
| upper-bound sieve (Brun–Titchmarsh / Selberg) | lower bound `-(1+o(1)) *` pole term, size `e^{l/2}`; parity factor 2 (r2-stepanov Thm P) | ARGUED from Thm P |
| classical zero-free region | `e^{l/2} exp(-c l^{3/5} (log l)^{-1/5})` | CLASSICAL |
| 7/8 half-plane (openai/math; Lean-checked locally, unrefereed) | `e^{3l/8}` | CONDITIONAL |

Size of the failure: the Stepanov substitute over Z leaves the full `e^{l/2} = X^{1/2}`; the best conditional input
leaves `X^{3/8}`; the function-field argument leaves `O(1)`. The reason in these coordinates: Stepanov's count
`N * p^mu <= deg f` evaluates the Toeplitz entry `c_n` on a delta test, which has finite energy `c_0 = 2g`. Over Z the
delta test has infinite `E_gamma`; at resolution `eps` the energy is `~ log(1/eps)/eps`, the minor is trivial for
`eps <~ X^{-1/2} log X`, and for coarser `eps` it is the short-interval prime count to within `sqrt X`, where the
sieve loses the factor 2. No intermediate regime was found in which the minor is both non-trivial and certified.

Stepanov on the Bohr torus (the suggested variant) was examined and not pursued: the truncated product
`prod_{p<=X}(1-p^{-s})^{-1}` has no zeros and its torus flow has no closed orbits; tests of log-support `<= log X` see
exactly the primes `<= X`, so the truncated form is the Weil form at bounded support (atlas §7, §9), and the
multiplicity step needs `f(s)^k = f(ks)`, which fails in characteristic 0 (r2-stepanov (S2)).

## 5. Pivot: the Pick-order horizon in the function-field model

Model (`horizon.py`): `g` unit-circle zero pairs at angles `theta_1 < ... < theta_g`, plus one planted quartet
`r^{+-1} e^{+-i theta_0}` with `n` on-circle pairs at smaller angle. Nested real nodes (van der Corput in `log x`,
`u = e^{-x}`, three intervals), LDL^T at `60 + 12 K` digits; controls without the quartet stay positive definite to
order `2g`.

**Proposition H (PROVED).** If the zero multiset has `2g'` elements, `m` off-circle pairs `{z, 1/conj z}` and
`p = 2g' - m`, then every real-node disc Pick matrix of order `K >= p+1` with distinct nodes has a nonpositive
eigenvalue (strictly negative whenever the matrix is nonsingular, which requires `K <= 2g'`). *Proof.* The form on `C^{2g'}` (values at the zeros) has signature
`(p, m)`: a unit root gives `|A|^2`, a pair gives a hyperbolic plane. The Cauchy vectors `(1/(1-u_i z_j))_j` for
distinct `u_i` are linearly independent for `K <= 2g'`, and a subspace of dimension `> p` contains a vector on which
the form is `<= 0`; if the `K x K` matrix is nonsingular the value is `< 0`. ∎ (Measured: the cap `p+1` is attained.) So in a function field the ladder is decided by
order `2g`. For zeta `p = infinity` and no order is decisive.

**MEASURED (`hor_*.out`).** First indefinite order `K*` (minimum over the three node families):

| g, r, spacing | n = 0, 1, 2, 3, 4, 5, 6, 7, 8 | cap `p+1 = 2g+3` |
|---|---|---|
| 12, r = 1.2, equal | 3, 4, 7, 10, 13, 13, 15, 17, 19 | 27 |
| 12, r = 1.2, increasing density | 2, 6, 9, 10, 11, 14, 16, 17, 17 | 27 |
| 12, r = 1.02, equal | 3, 7, 11, 15, 19, 22, 24, 26, 27 | 27 |
| 8, r = 1.2, equal | 2, 5, 8, 11, 13, 14, 15, 15, 16 | 19 |

Reading: `K*` is linear in the number `n` of on-line zeros between the real axis and the offender, slope about 2
(`r = 1.2`, close to `2n+3`) to about 4 (`r = 1.02`, `4n+3` until the cap). The `euler/RESULT.md` §2.2 "move"
table for zeta (delta = 0.3) reads `N* = 7, 12, 15, 24, 34, 49, 81` at zero index `n = 1, 2, 3, 5, 8, 12, 20`;
`4n+3 = 7, 11, 15, 23, 35, 51, 83`. So the measured exponent `gamma^1.44` there is consistent with "linear in the
zero count below the offender, slope about 4". Consequence for the Pick lane: order `K` sees about `K/4` zeros, i.e.
height `T` with `N(T) ~ K/4`; no lower bound of this form is proved (OPEN).

## 6. DH / fake control summary

- Function field: fakes satisfy Euler positivity, FE, rationality and the recurrence on `V`. They fail the 2x2 shift
  minors (`c_n` unbounded), the Verblunsky disc condition at step `<= 2g-1`, and Pick positivity at order `<= p+1`.
  The step that separates curves from fakes is the existence of sections (Riemann–Roch on `C` for Stepanov, on
  `C x C` for Hodge), not the Euler product.
- Spec Z: Prop S holds for DH and DH fails (b). In §4 the only step that uses the Euler product is the sieve bound
  (`Lambda >= 0` on prime powers); it is unavailable for DH, as required, and for zeta it is too weak by the parity
  factor.

## 7. Three weakest steps

1. **Sieve row of the §4 table (ARGUED).** The statement "Brun–Titchmarsh gives a lower bound of the size of the pole
   term" was not derived for the kernel `e^{-x|l - log n|}` with the archimedean term tracked; it is inferred from
   r2-stepanov Thm P (`(4-o(1)) sqrt X`). The qualitative conclusion (defect exponent 1/2) does not depend on the
   constant.
2. **Horizon law (MEASURED).** `K*` is a minimum over three nested node families, not over all node sets; true `K*`
   may be smaller. The `4n+3` fit to the zeta table uses seven points from another note and one value of delta. Only
   Prop H is proved.
3. **Prop S, identification of `R_x(l)` with a Gram entry of `Q_L`.** `R_x` is defined on the zero side; the shifted
   exponential is not in the class `E` of eq48, so the statement "2x2 minor of the Weil form" relies on the Weil
   identification for two-sided tests in the `L^1(e^{t/2})` closure (eq48 §4, (S) => (b) argument), not re-proved
   here. The equivalence (a)–(c') itself does not depend on this.

## Files

- `ff.py`, `ff.out`: curves, fakes, Toeplitz / Pick / Verblunsky / Hodge checks.
- `horizon.py`, `hor_g*.out`: Pick-order horizon model.
- `zcheck.py`, `zcheck.out`: normalization of `R_x(0)`; `4n+3` comparison.
