# c4-laxphillips-hecke-compression: Hecke operators compressed to the Lax-Phillips space K

Date: 2026-11-18. Nothing here proves or refutes RH. No zero-free region and no Lambda bound changes.
Labels: PROVED (argument given here), CLASSICAL (literature, not rederived), MEASURED (mpmath 80 digits,
not interval-certified), OPEN. All runs local, single process, `scripts/memcap.sh 8`, under 2 minutes.
The server was not used.

## Verdict

**Precise obstruction; the idea is killed at the first lemma, and the decisive test agrees.**

1. On the Eisenstein (absolutely continuous) part of the data space, the Hecke operator is a function
   of the wave generator: `T_p = U(log p) + U(-log p) = 2 cos(log p * sqrt(-L))`, `L = Delta + 1/4`
   (Lemma 1). The operator on the right exists for every cofinite group and for every abstract
   Lax-Phillips triple. In this channel the Hecke operators carry no information that the wave group
   does not already carry.
2. The compression to K is `P_K T_p P_K = Z(log p) + Z(log p)^*` (Lemma 2). It does not commute with
   `Z(t)`, resonance states are not its eigenvectors, and its energy-norm is at most 2 for every
   inner scattering function, wherever the resonances are. A norm bound on the compression therefore
   says nothing about resonance location.
3. Decisive test (section 3): on the span of the first 4 to 68 resonance states the numerical range of
   the compressed `T_2, T_3, T_5` lies inside (-2, 2) for zeta's resonances and equally for three
   moved-resonance configurations, including one (all zeros placed at beta = 0.1) whose true Hecke
   eigenvalues reach 2.53 > 2.
4. For the uncompressed `T_p` acting on the true (non-truncated) resonance states: in the weighted
   family `L^2(y^(-2w) dmu)` the state is admissible iff `w > 1/2 - Re(rho)/2`, and
   `||T_p||_w >= p^w + p^(-w)`; the norm bound is implied by admissibility for every location of rho
   (Lemma 3). On finite spans, a norm with `||T_p|| <= p^theta + p^(-theta)` for all p exists iff the
   resonances lie in the corresponding strip (Lemma 4): the bound is equivalent to resonance location.
5. No positive-definite form on a `{T_2, T_3}`-invariant space containing a resonance state makes
   `T_2` and `T_3` both symmetric (Lemma 5). This extends map row G12 from the Laplacian to two Hecke
   operators; it holds for any 0 < beta < 1 and does not distinguish beta = 1/2.

The atlas (PR 27 `historical-routes.md`) has no Lax-Phillips, Pavlov-Faddeev or scattering route
(text search: no hits). Lanes that touch it: `g-torus-modular` (row G12), `n1-mayer-dirac`,
`res-point-spectrum-square`, `n4-simpson-jump-locus` (one-line assessment). None computes the Hecke
compression; this lane does, and closes it.

## 0. Plan

Assigned idea: resonance states at `s = rho/2` are Hecke eigenvectors with eigenvalue
`p^(s-1/2) + p^(1/2-s)`; a bound `||P_K T_p P_K|| <= p^theta + p^(-theta)` in a norm admitting them
would give a strip. Order of work: (i) action of `T_p` on `D_-`, `D_+`, K; (ii) commutation with
`Z(t)` and the eigenvector question; (iii) numerical range in the functional model, zeta against
moved resonances; (iv) the admissible-norm question; (v) controls.

Notation. `Gamma = PSL(2,Z)`, `L = Delta + 1/4`, data `f = (f_1, f_2)`, `U(t) = exp(tA)`,
`A = [[0,1],[L,0]]`, energy form `E(f) = -<L f_1, f_1> + ||f_2||^2`.
`T_p f(z) = p^(-1/2) [ f(pz) + sum_{b mod p} f((z+b)/p) ]` on both components.
`mu = s - 1/2`; a resonance has `mu = rho/2 - 1/2`, `Re mu = (beta - 1)/2` in (-1/2, 0).

## 1. First lemma: the action of T_p

**Lemma 1 (PROVED; two lines from classical facts).** On the Eisenstein part `H_c` of the data space,
`T_p = U(log p) + U(-log p)`.
Proof. `T_p E(z, 1/2 + ir) = (p^(ir) + p^(-ir)) E(z, 1/2 + ir)` (CLASSICAL). The Eisenstein transform
diagonalises `L` as `-r^2` with multiplicity one, so `A` has eigenvalues `+-ir` with eigenvectors
`(1, +-ir)`, and `U(t) + U(-t)` acts on both as `2 cos(rt)`. `T_p` acts on both components as
`2 cos(r log p)`. QED.

On the cuspidal part `T_p` acts by the Hecke eigenvalues `lambda_j(p)`, which are not functions of
`r_j`; cusp forms are orthogonal to `H_c`, lie in K, and are eigenvectors of B with purely imaginary
eigenvalue. They do not couple to the resonance states under `T_p`, `U(t)` or `P_K`.

**Action on D_+-, on incomplete Eisenstein series (PROVED).** For `psi` on (0, inf) with Mellin
inversion, `T_p E(.|psi) = E(.|psi_p)`, `psi_p(y) = p^(-1/2) psi(py) + p^(1/2) psi(y/p)`
(multiply the Mellin transform by `p^(s-1/2) + p^(1/2-s)`). In the translation variable `r = log y`
with the L^2(dr) normalisation this is `tau_(log p) + tau_(-log p)`: `T_p` moves the support
threshold `a` of `D_+^a` to `a/p` and to `ap`. So `T_p D_+^a` is not contained in `D_+^a`; it is
contained in `D_+^(a/p)` when `a/p > 1`. The same holds for `D_-`. `T_p` does not preserve K.

**Lemma 2 (PROVED-rel the Lax-Phillips identification `Z(t) = P_K U(t)|K`, t >= 0, CLASSICAL).**
On `K_c = K cap H_c`: `P_K T_p P_K = Z(log p) + Z(log p)^*` (adjoint in the energy form). Consequences:

- (a) `[P_K T_p P_K, Z(t)] = [Z(log p)^*, Z(t)]`, which is nonzero because `Z` is not normal (it has
  eigenvalues `e^(mu t)` with non-orthogonal eigenvectors and is completely non-unitary).
- (b) A resonance state `f` (`Z(t) f = e^(mu t) f`) satisfies
  `P_K T_p P_K f = p^mu f + Z(log p)^* f`, and `Z(log p)^* f != p^(-mu) f`: `|p^(-mu)| > 1` while
  `Z^*` is a contraction on the part of K where E >= 0. Explicitly, with `f = Lambda^a E^*(., rho/2)`
  (constant term `c y^(1-s)` removed for `y > a`),
  `P_K T_p f = lambda_p f - c p^(1/2-s) P_K E(.| y^(1-s) 1_(a/p < y < a))`.
  The defect is supported in the window `(a/p, a)`: the prime enters only through the length `log p`.
  This is the automorphic form of map row G25 (window defect of the cutoff against Hecke dilations).
- (c) `||P_K T_p P_K|| <= 2` in the energy norm on `K_c` (after removal of the s = 1 mode), for every
  p, for every group, for every location of the resonances. The value 2 is `p^theta + p^(-theta)` at
  theta = 0. It implies nothing: by (b) the resonance states are not eigenvectors, and the true
  eigenvalue `p^mu + p^(-mu)` can exceed 2 in modulus (it does for zeta: 2.0061 at p = 2 within the
  first 20 zeros, 2.1436 at p = 5 within the first 30; MEASURED).

Answer to the first lemma as posed: the compression does not commute with `Z(t)`; resonance states
are not eigenvectors of the compression; the only operator inequality available on K is
`||Z(t)|| <= 1`, which is `Re mu <= 0`, i.e. `Re rho <= 1`.

## 2. Functional model used for the test

CLASSICAL (Lax-Phillips 1976; Pavlov-Faddeev 1972), not rederived: in the spectral variable `z`
(`s = 1/2 - iz`, `U(t)` = multiplication by `e^(izt)` on `L^2(R)`), `K_c` is the model space
`H^2 - S H^2` with `S(z) = phi(1/2 - iz) (z - i/2)/(z + i/2)` (the factor removes the pole of phi at
s = 1), and `Z(t)` is the compression of multiplication by `e^(izt)`. Zeros of `S` in the upper
half-plane: `z = +-gamma/2 + i(1 - beta)/2` for `rho = beta + i gamma`.
MEASURED: `|S| = 1.000000000000` at three real points and `|S| < 1` at seven points with Im z > 0
(`model_range.py`, first block).

`e_j(sigma) = 1/(sigma - conj z_j)` lies in the model space, `Z(t)^* e_j = exp(-i conj(z_j) t) e_j`,
Gram matrix `G_jk = 2 pi i/(z_j - conj z_k)`. The eigenvectors of `Z(t)` are the images `C e_j` under
the antiunitary conjugation of the model space, `C Z C = Z^*`, and `Z + Z^*` commutes with `C`, so
the numerical range on span{resonance states} equals that on span{e_j}. On `V = span e_j` the form of
`Z_p + Z_p^*` is `G D + D^H G`, `D = diag(p^(-i conj z_j))`.

Everything in this model depends on the zero set of `S` only. Arithmetic does not enter.

## 3. Decisive test (MEASURED)

`model_range.py` -> `model_range.json`. Generalised eigenvalues of `(G D + D^H G, G)`, mpmath 80
digits, ordinates of the first N zeta zeros, both signs of gamma (dim = 2N, or 2N + 8 with split
pairs). Columns: numerical range of the compressed `T_p`; largest modulus of the true Hecke
eigenvalue `p^mu + p^(-mu)` on the same states; `p^(1/2) + p^(-1/2)`.

| configuration | N | p | range of compression | max abs(lambda_p(rho)) | p^(1/2)+p^(-1/2) |
|---|---|---|---|---|---|
| zeta, beta = 1/2 | 30 | 2 | [-1.8389, +1.8401] | 2.0061 | 2.1213 |
| zeta, beta = 1/2 | 30 | 3 | [-1.6340, +1.6984] | 1.9229 | 2.3094 |
| zeta, beta = 1/2 | 30 | 5 | [-1.5482, +1.5325] | 2.1436 | 2.6833 |
| first 4 zeros split to beta = 0.2 / 0.8 | 30 | 2 | [-1.8391, +1.8410] | 2.0061 | 2.1213 |
| first 4 zeros split to beta = 0.2 / 0.8 | 30 | 5 | [-1.5487, +1.6578] | 2.1436 | 2.6833 |
| all at beta = 0.9 | 30 | 2 | [-1.8661, +1.9218] | 1.9769 | 2.1213 |
| all at beta = 0.1 | 30 | 2 | [-1.8313, +1.8241] | 2.0749 | 2.1213 |
| all at beta = 0.1 | 30 | 5 | [-1.5282, +1.5310] | 2.5305 | 2.6833 |

All 60 rows (N = 2, 5, 10, 20, 30; p = 2, 3, 5; four configurations) are in `model_range.json`.
In every row the range lies inside (-2, 2). Self-check: `||Z_p^*|V||^2 = 1.000000000000` (at most 1)
for p = 2, 3 at N = 10.

Reading. The numerical range of the compressed operator does not see the resonance location: the
configuration with zeros at beta = 0.1 has true Hecke eigenvalues up to 2.53 and the same range as
zeta to within 0.05 at N = 30. The comparison value `p^(1/2) + p^(-1/2)` is never approached; the
operative bound is 2, from `||Z|| <= 1`, for every inner function.

Run note: the first run used the complex conjugate of the Gram matrix and produced ranges exceeding
2 (up to 5.3). The self-check `||Z_p^*|V|| <= 1` was added, the convention corrected
(`<e_j, e_k> = integral of conj(e_j) e_k`), and the table above is from the corrected run.

## 4. Is there any admissible norm

**Lemma 3 (PROVED, elementary).** Let `X_w` be a space of automorphic functions whose norm on the
zero Fourier mode in the cusp `y > A` is `integral |psi(y)|^2 y^(-2w) dy/y^2`, `w >= 0`. Then:
(i) the non-truncated resonance state, with constant term `c y^(1-s)`, `Re s = beta/2`, has finite
norm iff `w > 1/2 - beta/2 = |Re mu|`; (ii) with `g(r) = e^(-(w+1/2) r) psi(e^r)`, `T_p` acts on
zero modes supported high in the cusp as `p^w tau_(-log p) + p^(-w) tau_(log p)` on `L^2(dr)`, so
`||T_p||_(X_w) >= p^w + p^(-w)` and the approximate point spectrum contains the ellipse
`{p^(w+i xi) + p^(-w-i xi)}`. Hence the inequality `|p^mu + p^(-mu)| <= ||T_p||_w` reads
`|Re mu| <= w`, and admissibility already requires `|Re mu| < w`. The bound is implied by
admissibility at every w and for every location of rho. Lowering w below `|Re mu|` removes the
state from the space; raising it gives a weaker bound.

**Lemma 4 (PROVED, finite-dimensional).** Let `f_1..f_n` be resonance states (true joint
eigenvectors of all `T_p`). (i) For any norm on any `T_p`-invariant space containing them,
`||T_p|| >= max_j |lambda_p(rho_j)|`. (ii) In the Hilbert norm making the `f_j` orthonormal,
`||T_p|| = max_j |lambda_p(rho_j)|` for all p simultaneously. So a norm with
`||T_p|| <= p^theta + p^(-theta)` for all p exists on the span iff `|Re mu_j| <= theta` for all j.
Existence of the norm is equivalent to resonance location; the inner property of `S` is satisfied
for every location and therefore cannot supply it.

**Lemma 5 (PROVED).** Let X be a space invariant under `T_2`, `T_3` with a positive-definite
Hermitian form for which both are symmetric, and let `f` in X be an eigenvector with eigenvalues
`p^mu + p^(-mu)`, p = 2, 3, `Im mu = gamma/2 != 0`. Then `Re mu = 0`.
Proof. `Im(p^mu + p^(-mu)) = 2 sinh(Re mu log p) sin(Im mu log p)`. If `Re mu != 0`, reality at
p = 2 and p = 3 gives `gamma log 2 /(2 pi)` and `gamma log 3/(2 pi)` both integers, so
`log 2/log 3` is rational. QED.
Since `Re mu = (beta - 1)/2 < 0`, no such form exists on a space containing a resonance state.
The statement is the same for every beta in (0, 1).

Sources of an independent norm bound that were examined, with the step where each stops:

| candidate | what it gives | where it stops |
|---|---|---|
| energy form on K, compression | `||Z_p + Z_p^*|| <= 2` | resonance states are not eigenvectors (Lemma 2b) |
| energy form on K, semigroup | `|p^mu| <= 1` | this is `Re rho <= 1` |
| weighted `L^2` | `||T_p|| >= p^w + p^(-w)` | admissibility threshold equals the bound (Lemma 3) |
| Petersson `L^2`, cusp forms (Kim-Sarnak 7/64) | bound on `lambda_j(p)` | Eisenstein residues at rho/2 are not in `L^2`; cusp forms are orthogonal to `H_c` |
| any positive form with `T_p` symmetric | real eigenvalues | none exists (Lemma 5) |

## 5. Controls

| control | structural step examined | outcome |
|---|---|---|
| non-arithmetic Hecke triangle group (one cusp) | Lemma 1 defines `T_p := U(log p) + U(-log p)` on `H_c` with no Hecke correspondence; Lemma 2 and the bound 2 hold verbatim | **passes** every statement of sections 1 to 4. Resonances off the line there are cited (Phillips-Sarnak; numerics of Winkler and Hejhal), not computed here. The mechanism does not fail for this control |
| moved-resonance inner function | model space of section 2 with any Blaschke zero set | **passes** (section 3: three configurations, ranges inside (-2, 2)) |
| DH | no group and no surface. `Lambda_DH(2s-1)/Lambda_DH(2s)` has poles in `Re s > 1/2` from the zeros of DH right of Re = 1, so it is not bounded there; after a Blaschke correction it is a moved-resonance inner function | not formulable at group level; at model level it is the previous row |
| zeta(s+a) zeta(s-a) | scattering quotient with resonances at `(rho +- a)/2`, `Re mu = -1/4 +- a/2`; an inner function for 0 < a < 1/2 | **passes** at model level (same as the split rows of section 3); no surface realisation was sought |
| backward heat, sign twists, unimodular twist, T-NR, Beurling, theta^w | not run: the argument has no step that uses the Euler product, so there is nothing for them to break | — |

No control fails. The arithmetic is entirely inside `phi`; the operator framework is the same for
every inner function.

## 6. Pivot

The strongest adjacent object is the commutator of the truncation with `T_p`, i.e. the window defect
of Lemma 2(b) on `(a/p, a)`. It is the automorphic form of map row G25 (`c2-cutoff-hecke-defect`,
closed: the form is the Weil form on a window; DH passes on every node set tried). No separate pivot
run was made because the adjacent idea coincides with a closed row.

## 7. Requirement flags

- **R1 (multiplicativity essential): not met.** Lemma 1: on the Eisenstein channel `T_p` is
  `2 cos(log p sqrt(-L))`; the same operator exists without any Hecke structure. Multiplicativity is
  not used in any step.
- **R2 (height-uniform, every window): not met.** The identities are uniform in height, but there is
  no conclusion about zeros; the only inequality obtained is `Re rho <= 1`.
- **R3 (fails for every control for a structural reason): not met.** Non-arithmetic groups and
  moved-resonance inner functions pass every statement (section 5).
- **R4 (reaches the critical line): not met.** Output is the edge `Re rho <= 1`.

## 8. Three weakest steps

1. The identification of `K_c` with the model space of `S(z) = phi(1/2 - iz)(z - i/2)/(z + i/2)`,
   including the treatment of the indefinite direction of the energy form at s = 1, is quoted from
   the literature and checked only by ten numerical evaluations of `|S|`. Lemma 2(c) is stated on
   the part of K where the energy form is non-negative.
2. Lemma 3 covers one family of norms and Lemma 4 is finite-dimensional. Norms of other geometric
   origin (Sobolev-type forms on K, forms on spaces that mix the cusp forms with the Eisenstein
   channel by a decomposition that is not Hecke-invariant) are not classified. Lemma 4(i) shows any
   such norm bound would imply the location; whether one can be derived independently is not
   excluded in general.
3. The non-arithmetic control rests on cited, not computed, resonance data, and its operator is the
   wave-group expression, not a correspondence. The numerics use the first 30 zeros in non-interval
   arithmetic; the conclusion drawn from them (range inside (-2, 2) for every inner function) is the
   proved Lemma 2(c), so the numerics are a consistency check, not the evidence.

## Files

- `model_range.py`, `model_range.json`: section 3.
