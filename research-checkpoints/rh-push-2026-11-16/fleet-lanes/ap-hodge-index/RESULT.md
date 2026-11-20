# ap-hodge-index: the Weil form as an intersection form, its finite-stage signature, and the Lorentzian test

Date: 2026-11-17. Lane of the "positivity automatic from structure" line. Internal work, no referee.

**Verdict: precise obstruction.** RH is open. No new information on any zeta zero.

- The Weil form in intersection coordinates, `I = Prime - Arch = Pole - Z`, has exactly one positive eigenvalue on
  every finite-dimensional test space iff RH (Theorem 1; a variant of an earlier note's Corollary 2.3, with a
  two-dimensional failure witness and a one-ample-class form added). This is a restatement, not a mechanism.
- Signature tables (section 4): zeta has one positive eigenvalue at every stage computed (up to dimension 200, window
  up to `c = 6`). Every control acquires extra positive eigenvalues at a finite stage. Davenport-Heilbronn first fails
  at dimension 116 to 174 depending on the grid, always at window length `c = 3.46 to 3.57` when the grid resolves
  height 85.7, with pivots of size `1e-6` to `1e-10` (Pick: order 149, value `-7.9e-480`).
- Lorentzian test (section 5): for a quadratic form the Lorentzian property is the signature statement itself. In a
  basis where the zeta form has non-negative entries it is Lorentzian at all 61 stages; the forms of `E_a`, of the
  truncated prime sets and of the `eps_2 = 1/2` twist have non-negative entries with the same support and are not
  Lorentzian. The normalised Euler-product polynomial in the variables `z_p` is Lorentzian for zeta for a reason that
  holds equally for `E_a`, T-NR (`c > 2`), the positive twist and Beurling primes.
- Obstruction (section 6): each mechanism that produces signature `(1, n-1)` in combinatorial Hodge theory needs an
  input that the Weil form does not have, and each is named.

Labels: PROVED / CLASSICAL / MEASURED / ARGUED / OPEN.

---

## 1. Plan, and what is different from closed rows

Read: BRIEF.md (all notices), OBSTRUCTION_MAP.md (118 rows), `eq48/`, the two Route I memory notes (semilocal Sonine
identity; Sonine port obstructed at ln 2), `ff-transplant/RESULT.md`, and `formalization/rh-attempts/2026-11-01-arith-surface.md`.

| Closed item | What it has | What this lane does differently |
|---|---|---|
| Row T3 and arith-surface note (Cor 2.3, Prop 4.2, Thm 6.2, Prop 8.1, section 8.5) | graph-class pairing = Weil form; Hodge index on it iff RH; function-field fakes; no section count satisfies Riemann-Roch; Zariski lemma certifies only the prime-free window; deformation fails | Not repeated. Theorem 1 below is that Corollary 2.3 on the test space, with the index inequality, the 2-dimensional witness and the fixed-ample form added. New: the combinatorial Hodge-Riemann mechanisms (Lorentzian class, product closure, local-to-global, M-convexity), which that note does not treat, and signature tables against the push controls |
| Row T2 (Stepanov-Bombieri) | 2x2 shift minor | not touched |
| Rows P1, G6, Q6 (Weil = Krein square; negative index = number of off-line pairs) | identity valid for every control | used as input; the form here is `P - Z` so the count appears as extra positive eigenvalues |
| Rows P3, P5, P7 (finite Pick orders; DH first fails at order 149) | confluent real nodes, values near `1e-480` | same question in a localised Gaussian basis: different conditioning, different first-failure size (section 4.3) |
| Row P9 (Suzuki screw form; zero tolerance in `w_2`) | conditional negativity of the screw kernel | the nested Toeplitz family of section 4 is a discretisation of the same kernel; the drop-a-prime rows reproduce the zero tolerance and add DH, `E_a`, T-NR, which P9 did not formulate |
| Route I memory notes (Connes-Consani semilocal trace, Sonine excess) | trace identity with remainder; obstructed at ln 2 | no Sonine space, no prolate projection, no semilocal trace is used |

Not consulted: the PR sources 10, 13, 29, 39, 43, 49, 56, 57 and `zeta-view` (the lane object is the form of `eq48`; the
map rows G1-G21 were used instead).

---

## 2. The form

Tests: real functions `f` on R, Schwartz with decay faster than `e^{-(1/2+eps)|x|}` (the numerics use Gaussians).
`F(t) = int f(x) e^{itx} dx`. For two tests put `g(u) = int f1(x+u) f2(x) dx`, `h(t) = F1(t) F2(-t)`.

- `Z(f1,f2) = sum_gamma F1(gamma) F2(-gamma)` over zeros `rho = 1/2 + i gamma` with multiplicity.
- `P(f1,f2) = F1(i/2)F2(-i/2) + F1(-i/2)F2(i/2) = lV(f1) lH(f2) + lH(f1) lV(f2)`, with `lH(f) = int f e^{x/2}`,
  `lV(f) = int f e^{-x/2}`. Rank 2, inertia `(1,1)`.
- `Prime(f1,f2) = sum_n Lambda(n) n^{-1/2} [g(log n) + g(-log n)]`.
- `A(f1,f2) = (1/2pi) int h(t) [Re psi(1/4 + it/2) - log pi] dt
   = (psi(1/4) - log pi) g(0) + int_0^inf [2g(0) - g(x) - g(-x)] k(x) dx`, `k(x) = e^{-x/2}/(1 - e^{-2x}) > 0`.

Explicit formula (CLASSICAL): `Z = P - Prime + A`. Define

    I := Prime - A = P - Z.

Dictionary. `I(f,f)` is the self-intersection of the class of `f`; `P = 2 lH lV` is the hyperbolic plane spanned by
the horizontal and vertical fibres; `-Z` is the form on the primitive part. Castelnuovo-Severi reads
`I(f,f) <= 2 lH(f) lV(f)`, which is `Z(f,f) >= 0`.

Controls in the same coordinates (all validated against zero sums, section 4.1):

| Object | Pole part | Prime weights | Archimedean part |
|---|---|---|---|
| zeta | `tau = 1/2`, inertia (1,1) | `Lambda(n)` | `psi(1/4 + it/2)`, `-log pi` |
| S-truncation, drop `p` (TW+ with `eps = 0`) | same | `Lambda(n)` on prime powers of the kept primes | same |
| TW-: `eps_2 = -1`; TW+: `eps_2 = 1/2` (completely multiplicative on powers of 2) | same | `eps_2^k Lambda(2^k)` | same |
| `E_a`, `a = 0.2` | `tau = 1/2 +- a`, inertia (2,2) | `Lambda(n)(n^a + n^{-a})` | `psi(1/4 +- a/2 + it/2)`, `-2 log pi` |
| T-NR, `q = 2`, `c = +-2.2` | same as zeta | `Lambda(2^k) - log 2 (beta^k + beta^{-k}) 2^{k/2}`, `beta + 1/beta = -c` | zeta's plus `2 log 2 g(0)` |
| DH | none | `Lambda_DH(n)` from `a(n) log n = sum_{d|n} Lambda_DH(d) a(n/d)` | `psi(3/4 + it/2)`, `log(5/pi)` |

Baseline positive index (the number forced by the pole part): 1 for zeta, truncations, twists, T-NR; 2 for `E_a`; 0 for DH.

Not run: backward heat (no prime side with a fixed gamma factor; see 4.5) and Beurling (needs a non-integer prime system).

---

## 3. Theorem 1 (Hodge-index form of Weil positivity)

`i_+`, `i_-` denote positive and negative index on a finite-dimensional real test space `V`.

**(a) Index inequality (PROVED).** `i_-(Z|V) - 1 <= i_+(I|V) <= i_-(Z|V) + 1`.
Proof. `I = P + (-Z)` and `-Z = I + (-P)`; the positive index is subadditive and `i_+(P), i_+(-P) <= 1`. ∎
For DH (`P = 0`) `i_+(I) = i_-(Z)`; for `E_a` the constant 1 becomes 2.

**(b) Equivalence (PROVED from CLASSICAL inputs).** The following are equivalent.
1. RH.
2. `i_+(I|V) <= 1` for every finite-dimensional `V`.
3. For one (equivalently every) test `h` with `I(h,h) > 0`: `I(h,g)^2 >= I(h,h) I(g,g)` for all tests `g`
   (reverse Cauchy-Schwarz; the Alexandrov-Fenchel / Hodge-index inequality with a fixed ample class).

Proof. 1 => 2: under RH `Z >= 0`, so `i_+(I) <= i_+(P) <= 1`.
2 => 3: on `span{h,g}` the form has at most one positive eigenvalue and `I(h,h) > 0`, so the determinant is `<= 0`.
3 => 1: suppose RH fails. By the pole-free form of Weil's criterion (CLASSICAL: Bombieri 2000; the form used by
Connes-Consani) there is a test `f0` with `F0(+-i/2) = 0` and `Z(f0,f0) < 0`. Then `P(f0, .) = 0`, so
`I(f0,f0) = -Z(f0,f0) > 0` and `I(f0,w) = -Z(f0,w)` for every `w`. Let `w_s(x) = e^{-x^2/(2 s^2)}`. Then
`lH(w_s) = lV(w_s) = s sqrt(2 pi) e^{s^2/8}`, `Z(w_s,w_s) = sum 2 pi s^2 e^{-s^2 gamma^2}` and
`Z(f0,w_s) = sum F0(gamma) W_s(-gamma)` tend to 0 as `s -> inf` because `Re gamma^2 >= 199` on the zeros. So
`I(w_s,w_s) -> +inf`, `I(f0,w_s) -> 0`, and `I` is positive definite on `span{f0, w_s}` for large `s`: `i_+ = 2`.
For a given `h` with `I(h,h) > 0`, on `V = span{h, f0, w_s}` the `I`-orthogonal complement of `h` has a vector `g`
with `I(g,g) > 0` and `I(h,g) = 0`, which violates 3. ∎

Status. This is Corollary 2.3 of the 2026-11-01 arith-surface note, stated on the test space without adjoining `H`
and `V`. Added here: (a); the 2-dimensional witness; the fixed-`h` form 3. It holds verbatim for every even
order-one function with the same pole part (DH with `P = 0`, T-NR, `E_a` with rank-4 `P`). It is the Weil criterion
and locates no zero.

**Sign structure (PROVED).** If `f1, f2 >= 0` have disjoint supports then `g(0) = 0` and
`I(f1,f2) = Prime(f1,f2) + int int f1(x) f2(y) k(|x-y|) dx dy >= 0`.
The prime part is `>= 0` because `Lambda >= 0`; the archimedean part because `k > 0`. So in a basis of separated
non-negative bumps the matrix of `I` has non-negative off-diagonal entries (distinct effective classes meet
non-negatively), and the diagonal entry of a bump of width `s` is `-(log(1/s) + O(1)) ||f||^2` for small `s`
(negative self-intersection) and positive for wide bumps. MEASURED for Gaussians: `I(f,f)/||f||^2 = -(log(1/s) - 2.84)`
at `s = 0.01` and `0.02` (values -1.78, -1.07), so the diagonal is negative for `s` below about 0.058 and positive
above (section 4.4; `K(0)` column of the run files).

---

## 4. Signature tables (MEASURED)

Method. Gaussians `f_j(x) = exp(-(x - x_j)^2/(2 s^2))`. Every entry is computed from the prime side: prime sum
to the point where the Gaussian tail is below `10^-(dps+10)`; archimedean integral by the trapezoidal rule on the
Fourier side in Arb arithmetic (exponentially convergent; step chosen from the distance `2z` to the poles of
`psi(z + it/2)`), cross-checked against direct tanh-sinh quadrature to 30 digits. Inertia: signs of the leading
pivots in Arb ball arithmetic at 320 digits with an assumed relative entry error `1e-295`; a stage counts only if the
ball excludes 0 ("determined"). Stage `m` = span of the first `m` basis functions, so pivot signs give `i_+` at every
stage. Entry enclosures are not certified (the quadrature error is estimated, not enclosed), hence MEASURED.
All runs through `scripts/memcap.sh 8`, single process, each under 10 minutes, matrices at most 200 x 200.

### 4.1 Validation of the explicit formula (prime side against zero side, 25 digits)

| Object | test | zero side | `P - Prime + A` | difference |
|---|---|---|---|---|
| zeta (29 zeros) | `s = 0.25`, `d = 0` | 2.9654919073208655647e-6 | same | 3e-26 |
| zeta | `s = 0.2`, `d = 0.7` | -1.5164532871716613775e-4 | same | 2e-26 |
| `E_0.2` (zeros `gamma +- 0.2 i`) | `d = 0` / `0.7` | 5.5784515265822621913e-6 / -2.940931254734633369e-4 | same | 2e-26 / 6e-26 |
| DH (122 on-line, 4 quartets, height 200) | `d = 0` / `0.7` | 0.16053250890759210515 / -0.14261096902071493308 | same | 5e-26 / 4e-26 |

T-NR and the twists differ from zeta by finitely many explicit prime-power terms and a constant; not separately validated.

### 4.2 Nested Toeplitz family `x_j = j h`, `s = 0.75 h`, window `[0, c]`, `c = (n-1) h`

The cutoff is soft: a Gaussian of width `s` reaches about `3 sqrt 2 s` beyond its centre.

**h = 0.1, n = 61, c = 6.0 (Nyquist height 31).** In this basis every entry of the zeta matrix is `>= 0`.

| Object | baseline | `i_+` at n = 61 | first stage with `i_+` > baseline (cutoff) | negative entries `K(jh)` |
|---|---|---|---|---|
| zeta | 1 | 1 | none | 0 of 61 |
| no primes (S empty) | 1 | 13 | 6 (0.5) | 0 |
| S = {2} | 1 | 15 | 10 (0.9) | 0 |
| S = primes <= 3 | 1 | 19 | 13 (1.2) | 0 |
| S <= 5 | 1 | 21 | 16 (1.5) | 0 |
| S <= 7 | 1 | 20 | 21 (2.0) | 0 |
| S <= 11 | 1 | 25 | 22 (2.1) | 0 |
| S <= 13 | 1 | 23 | 25 (2.4) | 0 |
| S <= 17 | 1 | 24 | 26 (2.5) | 0 |
| S <= 19 | 1 | 26 | 28 (2.7) | 0 |
| S <= 23 | 1 | 27 | 30 (2.9) | 0 |
| drop 2 / 3 / 5 / 7 / 11 / 13 | 1 | 35 / 31 / 25 / 32 / 30 / 28 | 6 / 10 / 13 / 16 / 21 / 22 | 0 |
| TW-, `eps_2 = -1` | 1 | 25 | 6 (0.5) | 3 |
| TW+, `eps_2 = 1/2` | 1 | 37 | 7 (0.6) | 0 |
| `E_0.2` | 2 | 29 | 11 (1.0) | 0 |
| T-NR `c = 2.2` | 1 | 15 | 10 (0.9) | 16 |
| T-NR `c = -2.2` | 1 | 15 | 12 (1.1) | 30 |
| DH | 0 | 0 | none (grid does not resolve height 85.7) | 26 |

Reading. The stage at which a truncated prime set fails is the stage at which the window reaches the logarithm of the
first missing prime power, minus the Gaussian reach (log 2 = 0.69, log 3 = 1.10, log 5 = 1.61, log 7 = 1.95,
log 11 = 2.40, log 13 = 2.56, log 17 = 2.83, log 19 = 2.94, log 23 = 3.14, log 29 = 3.37). The signature on a window
of length `c` is correct only if every prime power below about `e^c` is present with its weight: the statement uses
all primes up to the cutoff jointly. This is the zero tolerance of rows P6 and P9 seen as a signature.

**h = 0.03, n = 134, c = 3.99 (Nyquist height 105).**

| Object | baseline | `i_+` at n = 134 | first stage with `i_+` > baseline (cutoff) | smallest pivot in absolute value |
|---|---|---|---|---|
| zeta | 1 | 1 | none | -8.3e-7 |
| drop 2 | 1 | 39 | 24 (0.69 = log 2) | |
| TW-, `eps_2 = -1` | 1 | 30 | 23 (0.66) | |
| `E_0.2` | 2 | 44 | 39 (1.14) | |
| T-NR `c = 2.2` | 1 | 23 | 35 (1.02) | |
| DH | 0 | 2 | 120 (3.57); second at 123 | -3.7e-6 |

Zeta also has `i_+ = 1` at every stage of: `h = 0.036, n = 120` (two widths); `h = 0.025, n = 170`; `h = 0.02, n = 200`;
`h = 0.045, n = 100`; `h = 0.06, n = 80`. These are consequences of the zeros below height about 200 being on the line.

### 4.3 Davenport-Heilbronn: stage of the first positive eigenvalue

For DH the form is `I = -Z` (no pole part), so the Lorentzian statement is `i_+ = 0`.

| `h` | `s/h` | Nyquist `pi/h` | first positive pivot: stage (cutoff) | next | `i_+` at last stage | smallest pivot |
|---|---|---|---|---|---|---|
| 0.06 | 0.75 | 52 | 79 (4.68) | | 1 at n = 80 | 1.6e-7 |
| 0.045 | 0.75 | 70 | none to n = 100 (c = 4.46) | | 0 | 3.4e-6 |
| 0.036 | 0.75 | 87 | none to n = 120 (c = 4.28) | | 0 | 3.3e-6 |
| 0.036 | 1 | 87 | 119 (4.25) | | 1 | 9.8e-11 |
| 0.03 | 0.75 | 105 | 120 (3.57) | 123 | 2 | 3.7e-6 |
| 0.03 | 1 (200 digits, `run_dh_zero.py` prime side) | 105 | 116 (3.45) | 117 | 2 | 2.2e-10 |
| 0.025 | 0.75 | 126 | 142 (3.53) | 144 | 2 | 2.8e-6 |
| 0.02 | 1 | 157 | 174 (3.46) | 176; 198, 199 | 4 | 3.6e-9 |

Attribution (zero side, `h = 0.03`; zeros to height 200 at 25 digits, midpoint elimination, tail not propagated).
With all zeros the positive pivots are at stages 115, 116 (`s/h = 1`) and 119, 122 (`s/h = 0.75`), one stage from the
prime-side values. Removing the quartet of `0.8085171825 + 85.6993484854 i` removes every positive pivot; removing any
of the other three quartets (heights 114.16, 166.48, 176.70) changes nothing at these stages.

Reading.
- Once the grid resolves the off-line zero, the first failure is governed by the window length, `c* = 3.45 to 3.57`,
  not by the dimension. Compare `log(5 gamma/(2 pi e)) = 3.22` at `gamma = 85.7`: a window of length `c` and band
  `[-T, T]` carries about `cT/pi` degrees of freedom, and DH has 43 on-line ordinates below 85.7 (86 real points).
  Failure needs about as many dimensions as there are zeros in front of the off-line one (ARGUED from the count;
  MEASURED values above). This is the bandwidth threshold of row S5 in this basis.
- Smallest dimension found: 116. Pick: order 149 at anchors `a <= 3` (row P5). The orders of magnitude differ:
  pivots here are `1e-6` to `1e-10` (for `h = 0.03`, `s/h = 0.75` the 200-digit and 320-digit runs give the same
  stages 120, 123); the Pick quadratic form at order 149 is `-7.9e-480`.
- DH satisfies the Lorentzian statement at every stage below these. Finite stages are Euler-blind, as for Pick.
- At `h = 0.06` (Nyquist 52) a positive pivot appears at stage 79, cutoff 4.68. Not attributed (aliasing of the
  quartet at 85.7 onto the band is the likely cause; not checked).

### 4.4 Divisor-class basis: `H`, `V`, `e_1`, and one class `e_q` per prime power `q <= N`

`H`, `V`: Gaussians of width 1 centred at 0 and at `log N`. `e_q`: Gaussian of width `s` at `log q`. Entries with a
wide class are computed as `P - Z` with the first three zeta zeros (the rest is below `1e-90`), plus the explicit
difference for the control. 80 digits.

| N | s | classes | object | inertia (+,-) | first class giving `i_+ = 2` | point classes: negative diagonal | negative off-diagonal |
|---|---|---|---|---|---|---|---|
| 30 | 0.02 | 19 | zeta | (1,18) | none | 17/17 | 0/136 |
| 30 | 0.02 | 19 | drop 2 / drop 3 / drop 7 | (2,17) each | `e_13` / `e_13` / `e_17` | 17/17 | 0/136 |
| 30 | 0.02 | 19 | `eps_2 = -1` / `eps_2 = 1/2` / T-NR 2.2 | (2,17) each | `e_7` / `e_16` / `e_8` | 17/17 | 12 / 0 / 8 |
| 100 | 0.02 | 38 | zeta | (1,37) | none | 36/36 | 5/630 (overlapping neighbours) |
| 100 | 0.02 | 38 | drop 2 / drop 3 / drop 7 | (5,33) / (5,33) / (4,34) | `e_13` / `e_16` / `e_17` | 36/36 | 5/630 |
| 100 | 0.02 | 38 | `eps_2 = -1` / `eps_2 = 1/2` / T-NR 2.2 | (6,32) / (4,34) / (6,32) | `e_7` / `e_16` / `e_8` | 36/36 | 51 / 5 / 52 |
| 100 | 0.1 | 38 | zeta | (1,37) | none | 0/36 | 0/630 |
| 100 | 0.1 | 38 | drop 2 / drop 3 / drop 7 | (16,22) / (15,23) / (13,23)* | `e_1` / `e_2` / `e_2` | 0/36 | 0/630 |
| 100 | 0.1 | 38 | `eps_2 = -1` / `eps_2 = 1/2` / T-NR 2.2 | (12,26) / (17,21) / (11,27) | `e_1` / `e_2` / `e_2` | 0 / 0 / 36 | 55 / 0 / 150 |
| 300 | 0.02 | 82 | zeta | (1,81) | none | 80/80 | 54/3160 (overlapping neighbours) |
| 300 | 0.02 | 82 | drop 2 / drop 3 / drop 7 | (16,66) / (15,64)** / (14,68) | `e_13` / `e_16` / `e_19` | 80/80 | 54/3160 |
| 300 | 0.02 | 82 | `eps_2 = -1` / `eps_2 = 1/2` / T-NR 2.2 | (13,67)** / (15,67) / (15,67) | `e_7` / `e_16` / `e_8` | 80/80 | 271 / 54 / 300 |
| 40, all integers | 0.01 | 42 | zeta | (1,41) | none | 40/40 | 0/780 |
| 40, all integers | 0.01 | 42 | drop 2 / 3 / 7 ; `eps_2 = -1` ; `1/2` ; T-NR 2.2 | (3,39) / (3,39) / (2,40) ; (4,38) ; (2,40) ; (4,38) | `e_23` / `e_23` / `e_20` ; `e_10` ; `e_29` ; `e_9` | 40/40 | 0 / 0 / 0 ; 40 ; 0 ; 23 |

`*` 36 of 38 stages determined at 80 digits. `**` 79 and 80 of 82 stages determined; the inertia shown is over the
determined stages.

Reading. With narrow classes (`s = 0.01, 0.02`) the zeta matrix has the sign pattern of an intersection matrix of
curves on a surface: every self-intersection negative, distinct classes meeting non-negatively, signature `(1, n-1)`.
Removing one prime or halving one local weight keeps exactly that sign pattern and loses the signature. With wide
classes (`s = 0.1`) all entries are non-negative for zeta and for the same controls.

### 4.5 The margin (pencil of `I` against the `L^2` Gram matrix, zeta)

`mu_1 > 0 >= mu_2 >= ...` eigenvalues of `(I, G)` on the first `n` Gaussians. `-mu_2` is the margin of the Hodge-index
inequality relative to the `L^2` norm.

| `h` | n | cutoff | `mu_1` | `mu_2` | `mu_min` |
|---|---|---|---|---|---|
| 0.1 | 10 | 0.9 | 2.316 | -2.30e-5 | -1.62 |
| 0.1 | 20 | 1.9 | 4.732 | -2.05e-8 | -2.71 |
| 0.1 | 30 | 2.9 | 7.769 | -1.25e-10 | -3.57 |
| 0.1 | 40 | 3.9 | 11.98 | -5.24e-18 | -4.66 |
| 0.1 | 50 | 4.9 | 18.21 | -2.79e-20 | -8.01 |
| 0.1 | 60 | 5.9 | 27.77 | -5.68e-31 | -15.5 |
| 0.03 | 67 | 1.98 | 4.458 | -2.85e-9 | -3.94 |
| 0.03 | 134 | 3.99 | 11.55 | -4.49e-10 | -5.63 |

The margin has no lower bound in the cutoff (row P2 proves the infimum over all tests is 0). Since each stage is
non-degenerate, the signature at a fixed stage is an open condition: backward heat with small `|tau|` passes every
fixed stage (inference from rows P3, F1; not run).

---

## 5. Lorentzian test

Definitions (CLASSICAL, Brändén-Huh 2020). A homogeneous polynomial of degree `d` with non-negative coefficients is
Lorentzian if its support is M-convex and every `(d-2)`-fold partial derivative is a quadratic form with at most one
positive eigenvalue. For `d = 2`: non-negative coefficients and at most one positive eigenvalue. Products of
Lorentzian polynomials are Lorentzian. For `d >= 3` and M-convex support, `f` is Lorentzian iff every `d_i f` is.
`N(sum c_alpha z^alpha) = sum c_alpha z^alpha/alpha!`.

**L1 (PROVED; tautology).** Let `f_1..f_n` be tests with `I(f_i,f_j) >= 0` for all `i, j`. The polynomial
`q(x) = sum I(f_i,f_j) x_i x_j` is Lorentzian iff `i_+(I) <= 1` on their span. So for the generating polynomial of the
finite Weil form the Lorentzian property is statement 2 of Theorem 1 and carries no further information.
MEASURED: in the basis of 4.2 with `h = 0.1` the zeta form has all entries `>= 0` and is Lorentzian at each of the 61
stages. The forms of the truncated prime sets, of the dropped primes, of `eps_2 = 1/2` and of `E_0.2` have all entries
`>= 0` in the same basis, with full support, and are not Lorentzian from stages 6 to 30 on. Support and signs do not
decide the property: no M-convexity or sign condition separates zeta from these controls.

**L2 (PROVED).** In a basis of separated narrow bumps at the points `log m` the off-diagonal support of the prime part
is the divisor graph `{m, m'}: m/m'` a prime power. It is not M-convex (the monomials `x_1 x_2` and `x_3 x_9` are in
the support; neither `x_2 x_3` nor `x_2 x_9` is). The support becomes complete only through the archimedean kernel
`k > 0`, and the diagonal is negative, so `q` is outside the Lorentzian class in that basis; a change to a nef basis
returns to L1.

**L3 (PROVED for the first two lines; MEASURED for the rest).** Truncated Euler product in the variables `z_p`,
degree-`d` part `P_d = sum_{|alpha| = d} prod_p (a(p^{alpha_p}) w_p^{alpha_p} z_p^{alpha_p})`, `w_p = p^{-sigma}`.
- zeta: `P_d` is the complete homogeneous polynomial in `w_p z_p`. It is not Lorentzian for `d >= 2` (for `d = 2` the
  Hessian is `D (1 + J) D` with `D = diag(w_p)`, `J` the all-ones matrix: positive definite). MEASURED positive index 4
  with 4 primes for `d = 2, 3, 4`.
- zeta, normalised: `N(P_d) = (sum_p w_p z_p)^d / d!` by the multinomial theorem. Lorentzian; every quadratic
  derivative has rank one. The same identity holds with `w_p` replaced by `eps_p w_p`, `eps_p >= 0`, and for any
  system of Beurling primes: the property is "completely multiplicative with non-negative values" and nothing else.
- Controls, 4 primes, `d = 3, 4`, exact rational coefficients (`lorentz.py`): `N(P_d)` is Lorentzian for `E_a`-type local
  factors (coefficients `U_k(cosh(a log p))`, where `U_k^2 - U_{k-1} U_{k+1} = 1`), for the T-NR factor at 2 with
  `c = 2.2`, for `eps_2 = 1/2`, and for the squarefree part (elementary symmetric polynomials). It fails by a negative
  coefficient for `eps_2 = -1`, for T-NR with `c = -2.2`, for tempered GL(2) local factors (and there also by signature
  at `d = 4`: positive index 3), and for DH, which has no product form (`a(6) - a(2)a(3) = 1.0807`, `a(3) < 0`).
- The Euler factors are not elementary Lorentzian factors: the bivariate form `sum_k y^{K-k} z^k` of one factor is
  Lorentzian iff `C(K,k)^2 <= C(K,k-1) C(K,k+1)`, which is false. After normalisation each factor is `(y + z)^K/K!`.

So the Euler product is Lorentzian in the `z_p` only in the normalised sense, for a local reason that `E_a`, T-NR
(`c > 2`), TW+ and Beurling share, and the resulting polynomial does not involve the archimedean place or the
functional equation.

**L4 (PROVED).** The single-prime form `Prime_p(f) = (1/2pi) int |F(t)|^2 m_p(t) dt`,
`m_p(t) = 2 Re[log p/(p^{1/2+it} - 1)]`, has infinite positive and infinite negative index on the test space:
`m_p` is periodic and takes both signs on intervals (`p = 2`: max 3.347, min -0.574, positive on 25.0% of a period;
`p = 3`: 3.002, -0.804, 30.5%; `p = 5`: 2.604, -0.995, 35.3%). The Weil form is the sum `sum_p Prime_p - A`. The
Lorentzian cone is closed under products, not under sums (`xy + zw` has two positive eigenvalues). The only product in
the form is the pole term `P = 2 lH lV`, a product of two linear forms that are non-negative on non-negative tests.
Multiplicativity of the Euler product enters `I` additively, through the logarithmic derivative.

**L5 (PROVED).** For any quadratic `q` with non-negative coefficients and the cubic `y q(x)`: `d_y (y q) = q`, and `d_{x_i}(y q) = y l_i` with `l_i = d_i q` a linear form with non-negative coefficients
(Lorentzian). So `y q` is Lorentzian iff `q` is (if: product of Lorentzian polynomials; only if: derivatives of
Lorentzian polynomials are Lorentzian). More generally, if `I = d^alpha F` for a polynomial `F` of degree
`d >= 3`, the local-to-global theorem reduces "F Lorentzian" to a list of quadratic derivatives that contains `I`.
Local-to-global can deliver `I` only if the Lorentzian property of `F` comes from another source.

---

## 6. The obstruction, mechanism by mechanism

Sources of signature `(1, n-1)` in the combinatorial and geometric theory, and what each requires of the Weil form.

| Mechanism | Where it gives the signature | Requirement | Status for `I` |
|---|---|---|---|
| Degree-2 definition | none: it is the statement | | Theorem 1; L1 |
| Product closure / Künneth | products of Lorentzian polynomials; `C^n` from `C x C` | the form is a product over independent variable sets | `I` is a sum over primes of forms of index `(inf, inf)` minus `A`; the one product is the pole term (L4) |
| Local-to-global for `d >= 3` (Brändén-Huh; Adiprasito-Huh-Katz induction over the lattice of flats) | signature of a global form from the signatures of all links | a polynomial `F` of degree `>= 3` with `I = d^alpha F` whose other derivatives are known Lorentzian | circular in the cone construction (L5); no candidate `F` is known. The arithmetic surface has dimension 2, the base case |
| Volume polynomial / sections | Hodge index on a surface from Riemann-Roch | a section count with a canonical class of finite degree | none exists (arith-surface Thm 6.2; row T3) |
| Positive kernel with a positive null vector (Zariski) | negative semidefinite fibre components | Schur test with a positive weight | certifies only the prime-free window (arith-surface Prop 8.1) |
| Unimodular step (blow-up, flip): new class orthogonal to the old ones with square `-1` | signature `(1, n-1) -> (1, n)` at each step | a lattice on which the form is integral, so each new primitive class has square `<= -1` | no lattice: weights `log p/sqrt p`; measured margin `2.3e-5 -> 5.7e-31` as the cutoff goes 0.9 -> 5.9 (4.5); infimum 0 (row P2) |
| M-convex support / matroid structure | necessary condition, and the induction parameter | exchange property of the support | fails in the arithmetic basis (L2); holds trivially in a nef basis, where controls have the same support (L1) |

**Exact statement of the obstruction.** For a quadratic form the Lorentzian property has no structural certificate
other than (i) a product decomposition, (ii) being a derivative of a higher-degree Lorentzian polynomial whose
Lorentzian property is known independently, (iii) a section count, or (iv) integrality with unimodular steps.
For the finite-`S` Weil form: (i) fails because the primes enter additively and each prime's form has infinite
positive index; (ii) is circular for every construction tried here and no independent source is known; (iii) is
excluded by the earlier Riemann-Roch theorem; (iv) fails because the margin tends to 0. The sign and support structure
that the form does have (non-negative intersections of distinct classes, negative self-intersections, one product
term) is shared by the truncated prime sets, the positive twist and `E_a`, whose forms are not Lorentzian.

---

## 7. The three requirements and the controls

**All primes together.** Met by the object, not by an argument: on a window of length `c` the signature is correct
only with every prime power below about `e^c` at its exact weight (4.2: each truncated set fails at the first missing
prime power). No step proves anything from this.

**Every height, every window.** Not met. Each stage is a finite-dimensional statement. For zeta the stages computed
follow from zeros below height about 200. The margin tends to 0 with the cutoff. Detection of an off-line pair at
height `gamma` needs window length about `log(q gamma/2 pi e)` and dimension about twice the number of zeros below
`gamma` (4.3).

**Controls.**

| Control | Finite-stage signature | Sign structure of `I` (off-diagonal `>= 0`) | Normalised Euler polynomial Lorentzian | Named reason |
|---|---|---|---|---|
| DH | Lorentzian (`i_+ = 0`) through stage 115; fails at 116-174, window 3.45-3.57 | fails (26 to 67 negative `K(jh)`) | fails: no product, `a(3) < 0` | the failure is the quartet at height 85.7 (zero-side removal test); at smaller stages nothing distinguishes DH |
| HEAT | not run; each stage is an open condition, so small backward time passes any fixed stage | not formulable on the prime side with a fixed gamma factor | not formulable | flow-stable at finite stages |
| TW+ (`eps_2 = 1/2`, dropped primes) | fails at the first altered prime power | holds | holds (rank one) | the signature needs the exact weights; the structural properties do not |
| TW- (`eps_2 = -1`) | fails at cutoff log 2 | fails | fails (negative coefficient) | `Lambda >= 0` |
| `E_a` | fails from cutoff about 1.0-1.1 (`i_+` 29 and 44 against baseline 2) | holds | holds | all zeros off the line; pole part of rank 4; every structural property holds |
| T-NR `c = 2.2` / `-2.2` | fails from cutoff about 1.0 | fails (8 to 150 negative entries) | holds / fails | non-tempered local factor at 2 |
| Beurling | not run | holds whenever `Lambda >= 0` (prime part; no archimedean term defined) | holds (rank one) | no functional equation; not formulable as `P - Z` |

No structural property examined here holds for zeta and fails for all controls. The signature statement itself does,
because it is RH.

---

## 8. Verdict

Precise obstruction. Established:

1. PROVED (from the classical explicit formula and the pole-free Weil criterion): Theorem 1, including the index
   inequality, the 2-dimensional witness and the fixed-ample-class form. Restatement of RH; overlaps arith-surface
   Corollary 2.3.
2. MEASURED: signature tables for zeta and six controls; DH first failure at dimension 116 to 174, window length
   3.45 to 3.57, pivots `1e-6` to `1e-10`, attributed to the quartet at height 85.7.
3. PROVED: L1-L5 (for a quadratic form Lorentzian = signature; the divisor-graph support is not M-convex; the
   normalised Euler-product polynomial of a completely multiplicative non-negative sequence is a power of a linear
   form; single-prime forms have infinite positive and negative index; the cone construction is circular). MEASURED:
   the Lorentzian status of the control polynomials for 4 primes and degree at most 4.
4. The mechanism table of section 6.

Not established: any inequality at every height; any property that separates zeta from all controls other than the
signature statement; a degree `>= 3` polynomial with `I` as a derivative.

## 9. Three weakest steps

1. **Enclosures.** Matrix entries come from an exponentially convergent trapezoid sum and truncated prime sums with
   estimated, not enclosed, errors; the Arb pivots are rigorous only relative to an assumed entry error of `1e-295`.
   The tables are MEASURED. The DH zero-side attribution uses 25-digit zeros to height 200 with the tail not
   propagated, and differs from the prime side by one stage.
2. **Theorem 1, direction 3 => 1,** rests on the pole-free form of Weil's criterion quoted from the literature
   (Bombieri 2000) and not re-derived here, and on the explicit formula for Gaussian tests (validated numerically to
   25 digits, section 4.1, not proved here).
3. **Section 6 is a list, not a classification.** "No structural certificate other than (i)-(iv)" covers the
   mechanisms of Brändén-Huh and Adiprasito-Huh-Katz as recalled from memory (no source was re-read), and the claim
   that no independent higher-degree `F` exists is ARGUED from the constructions tried (cone; products), not proved.
   The reading of the DH threshold as `c* ~ log(q gamma/2 pi e)` is a fit to six grid configurations at one zero.

## 10. Files

All under `tmp/research-2026-11-16/push/ap-hodge-index/`.

- `hlib.py` (objects, prime sums, Arb pivots), `harch.py` (archimedean term, trapezoid rule in Arb).
- `validate.py` (4.1). `run_sig.py` -> `T1_h01_n61.out`, `T2_h003_n134.out`, `T3_dh_variants.out` (4.2, 4.3).
- `run_dh_zero.py` -> `DHZ_h003_r1.out`, `DHZ_h003_r0.75.out` (4.3 attribution).
- `run_div.py` -> `B_divisor_classes.out` (4.4). `run_gap.py` -> `GAP_h01.out`, `GAP_h003.out` (4.5).
- `lorentz.py` -> `lorentz.out` (section 5). `queue.sh` (run order). `timeq.py` (timing only).
