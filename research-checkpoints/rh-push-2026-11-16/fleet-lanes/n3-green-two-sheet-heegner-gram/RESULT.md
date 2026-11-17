# n3-green-two-sheet-heegner-gram: second-sheet resolvent Gram matrix on Heegner divisors

Internal working note, 2026-11-17. Not refereed. Nothing committed, pushed or posted. No ssh.
Every run went through `scripts/memcap.sh 8`, single process, longest run 18 min, peak memory below 0.1 GB.
RH open. No statement about zeros of zeta is made.

Labels: PROVED (complete argument here, from the cited classical inputs) / CLASSICAL / MEASURED / OPEN.

**Verdict: precise obstruction; lane closed.** The Gram-matrix coincidence at a zero is true, and it has no sign
content of its own:

1. PROVED (Theorem 1). For every finite family of divisors `D_1..D_n` and every `s` with `Re s > 1/2`, `Im s != 0`,
   `Im G_{1-s}(D_i,D_j) = Im G_s(D_i,D_j) + Im[ phi(1-s) v_i v_j / (1-2s) ]`, `v_i = E(D_i,s)`. The first term is
   `Im(lambda)` times a Gram matrix (definite). The second is a real symmetric matrix of rank at most 2 and signature
   `(1,1)`, `(1,0)`, `(0,1)` or `0`. The second-sheet matrix has no sign rule of its own; it is the physical matrix plus
   an explicit term in `E(D_i,s)`.
2. PROVED (Lemma 2, the assigned first lemma). If `E(D_i, rho) = 0` for all `i`, the two sheets agree on the family, to
   second order in `s - rho` when the zero comes from `zeta`. This holds for `D = -3,-4,-7,-8` and all Hecke translates.
   The hypothesis and conclusion are symmetric in `rho` and `1 - rho`, and hold at on-line zeros as well (both matrices
   are then zero).
3. MEASURED (control). The single Epstein class `[2,1,3]` of `D = -23` has off-line zeros
   `0.820013199 + 39.065174624 i` and `1.007111967 + 22.569405327 i`. At both, the second-sheet matrix on the eight
   divisors `T_1 z_A .. T_8 z_A` equals the physical one (relative difference `<= 9e-12`) and is negative definite.
   The configuration "off-line zero, second-sheet Gram matrix with the Herglotz sign on a divisor and all its Hecke
   translates" exists. A contradiction would need a second identity that holds for class sums and fails for a single
   class; none was found (section 6).
4. Content relative to n2: less. n2's rank-2 kernel tests the functional-equation symmetry of the zero set. This
   construction tests only `E(D, s) = 0`; the definite part of the matrix is the resolvent of the full spectrum (cusp
   forms included) and is not expressed through zeta.

Inertia in the three assigned cases is not identical ((0,0,8), (0,8,0), (1,7,0) occur), so the first kill criterion is
not met literally. The second one is met (item 2), and the control (item 3) closes the lane independently.

---

## 1. Plan

Read: BRIEF (all notices), OBSTRUCTION_MAP rows G12, G16, G17, Q6, L2, `n2-rank2-eisenstein-kernel/RESULT.md`.
New relative to those rows: G12 and n2 work with truncated Eisenstein series (Maass-Selberg kernels); G16 has Hecke
relations in the lattice variable; none uses the resolvent kernel `G_s(z,z')` at CM points or its continuation across the
continuous spectrum. This lane: (a) compute `G_s` on both sheets at Heegner points near the first zeros, (b) decide
whether the Herglotz sign at `1 - rho` carries information, (c) control with a single Epstein class.
Order followed: numerical first test (sections 3-5) first; the two proofs (section 2) were written after it.

## 2. Statements

### 2.1 Setting [CLASSICAL; normalisations fixed here and checked numerically]

`Gamma = PSL2(Z)`, `Delta = -y^2(d_x^2 + d_y^2) >= 0`, `lambda = s(1-s)`, `G_s(z,z')` the kernel of
`(Delta - lambda)^{-1}` for `Re s > 1/2`, `lambda` off the spectrum, continued meromorphically in `s`.
`G_s(z,z') = sum_{gamma in Gamma} g_s(u(z, gamma z'))` for `Re s > 1`, `g_s(u) = Q_{s-1}(1+2u)/(2 pi)`,
`g_s(u) = -(1/4pi) log u - (gamma_E + psi(s))/(2pi) + o(1)`. For a divisor `D = sum m_k [w_k]`,
`G_s(D, D') = sum m_k m'_l G_s(w_k, w'_l)`; on coincident points the term `-(1/4pi) log u` is dropped. It is real and
independent of `s`, so imaginary parts and differences between sheets are unaffected.

- (J) Jump [CLASSICAL]: `G_{1-s}(z,z') - G_s(z,z') = E(z,s) E(z',1-s)/(1-2s)`, `E(z,s) = sum_{Gamma_inf\Gamma} Im(gamma z)^s`.
  Derivation of the sign: the zero Fourier mode of `G_s(., z')` above `Im z'` is `y^{1-s} E(z',s)/(2s-1)`.
  MEASURED: the two sides agree to relative `1e-15 .. 9e-12` in all 17 runs below, with the two sheets computed
  independently (section 3).
- (H) Herglotz [CLASSICAL]: for `Re s > 1/2`, `Im s != 0`: `Im G_s(D_i, D_j) = Im(lambda) <G_s(., D_j), G_s(., D_i)>`
  (resolvent identity, `G_{conj s} = conj G_s`, `G_s(., D) in L^2`). `Im lambda = -2xt` for `s = 1/2 + x + it`.
- (C) CM values [CLASSICAL]: `E(z_D, s) = (w_D/2)(|D|/4)^{s/2} zeta(s) L(s, chi_D)/zeta(2s)` for `h(D) = 1`;
  `E(T_p z, s) = (p^s + p^{1-s}) E(z, s)` for the unnormalised `T_p` (sum over `p+1` points).
  MEASURED at `s = 0.63 + 9.1i` for `D = -3,-4,-7,-8`, `T_2`, `T_3`: ratios `1 +- 4e-16` (`t2_main.log`).

### 2.2 Theorem 1 (second sheet = physical sheet + explicit rank-2 form) [PROVED from (J), (H)]

Let `Re s > 1/2`, `Im s != 0`, `M1 = Im G_s(D_i,D_j)`, `M2 = Im G_{1-s}(D_i,D_j)`, `v_i = E(D_i,s)`,
`c = phi(1-s)/(1-2s)`. Then `M2 = M1 + R`, `R = Im(c v v^T)`, and

- `M1 = Im(lambda) * Gram`, definite when the functions `G_s(., D_i)` are linearly independent (distinct supports);
- `R` is real symmetric of rank `<= 2`. For real `u`, `u^T R u = Im(c (u.v)^2)`. If `Re v`, `Im v` are independent,
  `u.v` covers `C` and `R` has signature `(1,1)`. Otherwise `v = e^{i theta} r`, `r` real, and
  `R = Im(c e^{2 i theta}) r r^T` has rank `<= 1`;
- hence for `Im lambda < 0`: `n_-(M2) >= n - 1` and `n_+(M2) <= 1` (Weyl), and `M2 = M1` iff `c v v^T` is real.

Proof: (J) with `E(z',1-s) = phi(1-s) E(z',s)`; both `G` matrices are symmetric, so the Hermitian imaginary part is the
entrywise one. On the line `Re s = 1/2`: `Im G_s(D_i,D_j) = -v_i conj(v_j)/(4t)`, rank one.

Consequence: `M2` is determined by `M1` and the numbers `E(D_i,s)`. There is no independent inequality for the
continued kernel: `G_{1-s}(., D)` grows like `y^{Re s}`, it is not in `L^2`, and the Green identity on `y <= T` returns
`M2 = Im(lambda) ||Lambda^T G_{1-s}(., D)||^2 - (boundary term at height T)`, which is the Maass-Selberg form of n2.

### 2.3 Lemma 2 (coincidence at a zero; the assigned first lemma) [PROVED from (J), (C)]

Let `E(D_i, rho) = 0` for `i = 1..n`. Then `G_{1-rho}(D_i, z') = G_rho(D_i, z')` for every `z'`, in particular the
full complex matrices on the family agree. For `D_i` among the Hecke translates `T_m z_D`, `D in {-3,-4,-7,-8}`, this
holds at every zero `rho` of `zeta(s) L(s, chi_D)`; at a zero of `zeta` it holds for all four discriminants and all `m`
at once, and since `v(s) = zeta(s) a(s)` with `a` holomorphic, the jump matrix is
`phi(1-s) zeta(s)^2 a a^T/(1-2s) = O((s - rho)^2)` at a simple zero.

Equivalent form: `E(D, rho) = 0` with `Re rho > 1/2` iff `u = G_rho(., D)` has zero constant term, i.e. `u` is a
cuspidal `L^2` solution of `(Delta - lambda_rho) u = delta_D`. This is the setting of the Colin de Verdiere
pseudo-Laplacian with a Heegner-point distribution (cited from memory, not re-checked: Colin de Verdiere 1982-83;
Bombieri-Garrett). The known obstruction there is the same: `delta_D` is not in `H^{-1}` in dimension 2 (`u` has a
logarithmic singularity, `grad u` is not square integrable), so `u` is not an eigenfunction of a self-adjoint operator
and nothing forces `lambda_rho` to be real. The Herglotz identity `Im u(D)_reg = Im(lambda) ||u||^2` is consistent with
a non-real `lambda_rho`; it fixes `Im u(D)_reg`, which no other relation constrains.

### 2.4 No asymmetry [PROVED]

`lambda(rho) = lambda(1-rho)`. The statement of Lemma 2 is "continuation to `1-rho` = physical value at `rho`"; the
Herglotz sign of the second-sheet matrix at `1-rho` is the sign of the physical matrix at `rho`, inherited through the
equality. For an on-line zero both sheets give the zero matrix on the family (Theorem 1, rank-one formula). Nothing in
(J), (H), (C) distinguishes `Re rho > 1/2` from `Re rho = 1/2` beyond "definite" versus "zero", and the definite case is
realised by the control.

## 3. Method and validation

`glib.py`. `G_s(., z') = sum over the cosets of Gamma_inf\Gamma with Im(gamma z') >= 0.35 of P_s(., gamma z') + H`,
`P_s(z,w) = sum_n g_s(u(z, w+n))` (direct sum over `|n| <= 200`, tail by Euler-Maclaurin in closed form, which gives the
continuation in `s`), `H = B_0 y^{1-s} + sum_{0<|m|<=22} b_m sqrt(y) K_{s-1/2}(2 pi |m| y) e(mx)`. The coefficients come
from automorphy at 160 points of the horocycle `y = 0.6` and their pullbacks (least squares, 45 unknowns). The zero mode
`y^{1-s}` alone selects the resolvent for `Re s > 1/2`, its boundary value on `Re s = 1/2`, and the continuation for
`Re s < 1/2` (run with `s` replaced by `1-s`). Both sheets are computed independently; (J) is then a test.

| check | result | file |
|---|---|---|
| `g_s` near `u = 0`: constant `-(gamma_E + psi(s))/(2pi)` | agrees to 3e-7 at `u = 1e-9` | `t1_validate.log` |
| `P_s` vs direct sum, `s = 1.8+3i`, `4e5` terms | 3e-14 | same |
| `P_s` vs Fourier form (`I K` Bessel series), `s = 0.55+14.1i, 0.5+14.1i, 0.3-14.1i` | 1e-15 | same |
| `G_s` vs Poincare series over `c^2+d^2 <= 400^2`, `s = 2.2+2i` | 3e-8 (series truncation) | same |
| collocation matrix singular values, least-squares residual | 0.94 .. 1.07; residual 2e-15 .. 4e-12 | all logs |
| jump (J), both sheets independent | 1e-15 .. 9e-12 relative | `t2_main.jsonl`, `t4_control.jsonl` |
| symmetry `G(D_i,D_j) = G(D_j,D_i)` | 3e-16 .. 5e-13 relative | same |
| Hecke symmetry `G(T_2 a, b) = G(a, T_2 b)`, `a = z_{-7}`, `b = z_{-8}`, both sheets | 2e-15, 1e-14 | `t5_gz.log` |
| arithmetic expansion (section 6) at `Re s > 1` | ratios 6, 1, 3, 2, 3 to 1e-5 .. 2e-4 (truncation at `n = 6e4`) | `t5_gz.log` |

## 4. First test: zeta-type divisors [MEASURED]

Eight divisors: `z_D` and `T_2 z_D` for `D = -3,-4,-7,-8` (9 distinct points). `s = 1/2 + x + i gamma_n`. Inertia
`(+,-,0)` of `M1` (physical) and `M2` (second sheet); eigenvalues below `50 x` the measured jump error count as 0.

| `s` | `max |E(D_i,s)|` | jump/|G| | `M1` | `M2` | eigenvalue range of `M2` |
|---|---|---|---|---|---|
| `1/2 + i gamma_1` (zero) | 1e-14 | 5e-31 | (0,0,8) | (0,0,8) | `|ev| <= 9e-15` |
| `0.55 + i gamma_1` | 0.42 | 6.9e-4 | (0,8,0) | (0,8,0) | -2.125 .. -1.06e-3 |
| `0.70 + i gamma_1` | 1.6 | 1.2e-2 | (0,8,0) | (0,8,0) | -6.60 .. -4.3e-3 |
| `1/2 + i gamma_2` (zero) | 1e-14 | 1e-30 | (0,0,8) | (0,0,8) | `|ev| <= 7e-14` |
| `0.55 + i gamma_2` | 0.30 | 7.1e-4 | (0,8,0) | (0,8,0) | -1.37 .. -4e-3 |
| `0.70 + i gamma_2` | 1.0 | 1.2e-2 | (0,8,0) | (0,8,0) | -3.89 .. -1.5e-2 |
| `1/2 + i gamma_3` (zero) | 2e-14 | 1e-30 | (0,0,8) | (0,0,8) | `|ev| <= 2e-13` |
| `0.55 + i gamma_3` | 0.54 | 1.1e-3 | (0,8,0) | (0,8,0) | -0.29 .. -3e-3 |
| `0.70 + i gamma_3` | 1.4 | 2.3e-2 | (0,8,0) | (0,8,0) | -1.13 .. -1.1e-2 |
| `0.7 + 17.8i` (between zeros) | 12 | 0.74 | (0,8,0) | (1,7,0) | -3.32 .. +6.89 |
| `0.9 + 17.8i` | 11 | 0.85 | (0,8,0) | (1,7,0) | -3.54 .. +8.05 |
| `0.7 + 10i` | 11 | 1.72 | (0,8,0) | (1,7,0) | -1.94 .. +10.9 |
| `0.9 + 10i` | 9.3 | 1.74 | (0,8,0) | (1,7,0) | -4.69 .. +10.6 |

Reading. (i) At an on-line zero both matrices vanish: the boundary value of the resolvent is real on the family.
(ii) At `x = 0.05, 0.2` above a zero height (not zeros) the second sheet is negative definite, because the rank-2 term
is of size `|zeta(s)|^2` and small there. (iii) Between zeros the second sheet has one positive eigenvalue. All of this
is Theorem 1 with the measured sizes of `v`; the second-sheet matrix moves continuously between "definite" and "one
positive eigenvalue" as `|E(D_i,s)|` grows, with no threshold tied to `Re s`.

## 5. Control: single Epstein class, `D = -23` [MEASURED]

`z_A = (-1 + i sqrt 23)/4` (form `[2,1,3]`). Zeros of `E(z_A, s)` with `Re s > 1/2`, `1 <= Im s <= 60`
(`t3_scan.log`, residual `1e-20`): `1.007111967 + 22.569405327 i`, `0.820013199 + 39.065174624 i`,
`0.745761085 + 55.309952235 i`. The principal class does not vanish there (`|E| = 1.5, 2.7, 1.9`).

| family | `s` | `max |E(D_i,s)|` | `max |G_{1-s} - G_s|/|G|` | `M1` | `M2` |
|---|---|---|---|---|---|
| `T_1 z_A .. T_8 z_A` (38 points) | zero `0.8200 + 39.0652 i` | 3e-13 | `<= 9e-12` | (0,8,0), ev -4.05 .. -0.053 | (0,8,0), same eigenvalues |
| `T_1 z_A .. T_8 z_A` | zero `1.0071 + 22.5694 i` | 6e-14 | `<= 6e-14` | (0,8,0), ev -4.83 .. -0.068 | (0,8,0), same eigenvalues |
| `T_1..T_4 z_A` + `z_{-3}, z_{-4}, z_{-7}, z_{-8}` | zero `0.8200 + 39.0652 i` | 4.5 | 0.11 | (0,8,0) | (1,7,0), ev -1.59 .. +0.216 |
| `T_1 z_A .. T_8 z_A` | `1.0071 + 23.4694 i` (not a zero) | 2.9 | 0.028 | (0,8,0) | (1,7,0), ev -11.2 .. +0.353 |

The first two rows are the configuration the idea wanted to exclude: an actual off-line zero, the second-sheet kernel
equal to the physical one on a divisor and on its Hecke translates `T_1..T_8`, Herglotz sign on the second sheet. It
exists, for a function with the same functional equation and Hecke relations in `z` and no Euler product in `s`.

Controls required by the brief:

| control | outcome |
|---|---|
| Davenport-Heilbronn | not a CM value of `E(z,s)` on `PSL2(Z)`; its analogue here is the single class above: jump formula, Herglotz identity, Hecke translates and coincidence all hold, off-line zeros exist. The mechanism does not fail for it. |
| backward heat | not formulable: `H_tau` is not a value of an Eisenstein series, there is no resolvent and no jump formula. |
| sign twist | not formulable: no functional equation, hence no second sheet and no jump formula. |
| on-line zero of zeta | coincidence holds (both matrices zero). |

No step uses the Euler product. (C) uses only that the class-summed Epstein zeta factors as `zeta L`.

## 6. Search for a second identity at `1 - rho`; the one pivot

Candidates examined.

1. Hecke relations among entries: `G_s(T_m D, D') = G_s(D, T_m D')` [CLASSICAL; MEASURED on both sheets, 2e-15].
   Linear, hold on both sheets and for single classes (G16 in a different variable). They give no sign.
2. CM evaluation of `G_s` (pivot, `t5_gz.py`). For coprime fundamental discriminants (Gross-Zagier, "On singular
   moduli", cited from memory; normalisation fixed by the measurement):

       2 pi G_s(z_{D1}, z_{D2}) = (w_1 w_2/4) sum_{n > sqrt(D1 D2), n = D1 D2 mod 2} rho(n) Q_{s-1}(n/sqrt(D1 D2)),
       rho(n) = sum_{d | (n^2 - D1 D2)/4} eps(d),     eps = genus character,     Re s > 1.

   MEASURED at `s = 2.2+2i` and `1.9+5i` for the pairs (-3,-4), (-7,-8), (-3,-7), (-4,-7), (-3,-8): ratios
   6, 1, 3, 2, 3 to `1e-5 .. 2e-4`. This is the one place where a multiplicative function enters a class-summed
   entry and where a single class has no analogue (it needs the individual class characters). It is a rearrangement of
   the Poincare series by distance and converges only for `Re s > 1`. The continuation of
   `sum rho(n) Q_{s-1}(n/sqrt(D1 D2))` to `Re s <= 1` is known only through the spectral expansion of `G_s`, so at
   `1 - rho` it returns (J). `rho(n)` is a divisor-type sum along the quadratic sequence `n^2 - D1 D2`: there is no
   Euler product in `s`. The diagonal case `D1 = D2`, which carries the Herglotz sign, was not checked.
3. Arithmetic values of `G_s` at CM points are known at integers `s = k >= 2` (algebraicity of higher Green functions)
   and at `s = 1` (singular moduli). Nothing is known at non-integer complex `s`. [OPEN, not pursued]

Result of the search: no identity found that evaluates `Im G_rho(D,D)_reg` or any entry at `1 - rho` independently of
(J). OPEN as a question; the control shows any such identity must fail for a single class with `h > 1`.

## 7. Does the content exceed n2?

No. n2: rank-1 Maass-Selberg positivity = innerness + one sign; rank-2 corner kernel = symmetry of the zero set under
`rho -> 1 - conj(rho)`. Here: the truncated-domain Green identity for `G_{1-s}(., D)` is a Maass-Selberg form; the
`zeta`-dependent part of the second-sheet matrix is the rank-2 term `Im(phi(1-s) v v^T/(1-2s))`; the rest is the
resolvent of the whole spectrum. Zeros enter only through `v = 0`. The construction does not test functional-equation
symmetry of the zero set (it holds zero by zero), so it has less content than the n2 corner kernel.

## 8. Three weakest steps

1. The numerical method is double-precision collocation, not interval-certified. Its error estimate is the
   jump identity (1e-15 .. 9e-12), the Poincare series at `Re s > 1` (3e-8) and the arithmetic expansion (1e-5). The
   "0" entries of the inertia at on-line zeros rest on a tolerance of `50 x` the jump error. Heights near cusp-form
   spectral parameters were not tested.
2. "No second identity" is the outcome of a search over three candidates, not a theorem. The diagonal Gross-Zagier
   expansion (`D1 = D2`) and any regularised continuation of the `rho(n)` series below `Re s = 1` were not examined.
3. Literature statements are from memory: the pseudo-Laplacian reformulation and its `H^{-1}` obstruction
   (Colin de Verdiere, Bombieri-Garrett), the Gross-Zagier formula (confirmed numerically for five pairs only), and
   the CM formula (C) (confirmed numerically for four discriminants, `T_2`, `T_3`; for `D = -23` only the existence of
   single-class zeros was used). The linear independence of `G_s(., D_i)` in Theorem 1 was assumed from distinct
   supports and observed (eight nonzero eigenvalues), not written out.

## 9. Files

`glib.py` (kernel, solver, Eisenstein series, Hecke points), `runlib.py` (two-sheet matrices, inertia),
`t1_validate.py/.log`, `t2_main.py/.log/.jsonl` (section 4, zero heights), `t3_scan.py/.log`, `t3_zeros.json`,
`t4_control.py`, `t4_A.log`, `t4_B.log`, `t4_C.log`, `t4_control.jsonl` (section 5 and generic heights),
`t5_gz.py/.log` (section 6). Run A of `t4_control.py` was stopped by hand after its second case to stay under
20 minutes; its third case was replaced by run C.
Interpreter: `.venv-arb/bin/python` (numpy 2.5.3, mpmath 1.3.0, sympy 1.14.0).
