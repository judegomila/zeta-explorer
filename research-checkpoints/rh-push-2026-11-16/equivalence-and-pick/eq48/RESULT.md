# Residual energy target of the theta-bridge program vs. Weil and Suzuki positivity

Date: 2026-11-16. Scope: equivalence analysis only. Nothing here proves or
refutes RH. All PR content was read from local read-only refs
(`refs/pr/N`); no PR or branch was modified.

## Verdict

**Proof of equivalence, both directions.** The residual statement
("compensated prime forcing is dominated by the gamma square energy on
every recursively orthogonal Schur residual, at every order") is
equivalent to:

- positivity of all real-node xi Pick matrices,
- Weil positivity (Bombieri zero-sum form, all `g` in `C_c^infty(0,infty)`),
- Suzuki's screw-kernel positivity for `g = -Psi`,
- RH.

More precisely: on each finite exponential test, the residual target is
**identically** Weil's quadratic functional evaluated on a one-sided
exponential test function. This is an identity of numbers, not only a
logical equivalence. The equivalence (a) <=> (b) below, which says that
restricting to Schur residuals loses no strength, is proved without
using RH. The direct implications Weil => target and Suzuki => target are
also proved without RH. The reverse implications use a constructive
argument (PR #50, Prop. 5, re-verified here): an off-axis zero produces a
negative finite test.

A **margin** version (prime term at most `theta * E_gamma` with
`theta < 1`) is **false** unconditionally on the finite exponential class.
So the only consistent target is the constant-1 statement, and that
statement is RH.

Consequence for the program: the residual-energy lane, the Pick
kernel-preservation lane (PRs #51–#55 aim at all-order Pick positivity),
Weil positivity and Suzuki positivity are one target. The residual
restriction does not make it weaker than RH.

## 0. Statement used (source)

Primary: PR #48 (`refs/pr/48` = `499528b4`),
`rigorous/theta-schur-kernels-2026-11-09/theta_schur_residual_energy_20261109.md`.

- Line 312–320, eq. (21): for each orthogonal residual `v`,
  `2 c_0 ||v||_2^2 + 2 Re ∫_0^∞ M(l) C_v'(l) dl <= E_gamma(v)`.
- Eq. (16) (line 233): `Q_L(v) = E_gamma(v) - 2c_0||v||^2 - 2Re∫ M C_v'`.
- Eq. (3) (line 44): `Delta_N(x) = Q_L(v)` for the Schur residual with
  coefficients `(-P_N^{-1} p(x), 1)`.

Notation: `F(w)=xi(1/2+w)`, `L=F'/F`, rates `x_j > 1/2`, and
`v = sum b_j e^{-x_j t}`. `Q_L(v) = sum b_i conj(b_j) (L(x_i)+L(x_j))/(x_i+x_j)`.
`E_gamma` is the gamma sum of squares (7). `M(l) = 2(e^{l/2}-1) - sum_{n<=e^l} Lambda(n)/sqrt n`
is the compensated count. `C_v` is the one-sided autocorrelation.

Later restatements checked: PR #50 (`146ce77a`),
`rigorous/theta-fourth-stage-2026-11-09/theta_rational_residual_20261109.md`
§6, eq. (6.1) (line 425), restates the same identity. It adds the
head-null and coupling block condition (4.3) (line 270), which is a
consequence of the same target. PRs #51–#55 (to `c617017e`) do not restate
the arithmetic residual. They pursue kernel and ratio preservation. A grep
of all their `.md` files for residual energy, `E_gamma`, domination,
compensated, Weil, Suzuki and screw finds no new formulation. **The
statement used is PR #48 eq. (21), quantified over all orders and node sets
as in PR #48 §6 and PR #47 §4.**

Other inputs used:

- PR #47 (`7e6d01d9`) `theta_exact_pick_bridge_20261108.md`, eq. (1),
  `∫_0^∞ Psi(t) e^{-pt} dt = L(p)/p^2`. This is Suzuki's Theorem 1.1, as
  normalized there.
- PR #47 eq. (4) and (7): `Q_L(v) = b(r,r)`, where `r = -v'` and `K(t,u) = Psi(t)+Psi(u)-Psi(|t-u|)`.
- PR #50 eq. (1.7) (line 75): `Q_L(v) = sum_rho V(rho) conj V(-conj rho)`,
  where `V(z) = sum b_j/(z+x_j)`.
- PR #50 Prop. 5 (line 306).

I re-derived (1.7) and (16) by hand. The algebra is recorded in §6. I also
checked them numerically, see §7.

Route atlas (PR #27, `research/rh/modules/historical-routes.md`) was read
first. Section 11 ("gamma bulk ... Suzuki scalar reserve") is the
whole-line, supported-test version of the same gamma-vs-arithmetic
comparison. It already records that "a uniform strictly positive scalar
margin is not the right RH target". Theorem 4 below is the precise
one-sided exponential analogue of that remark. No route the atlas closes
is re-run here.

## 1. Statements

Let `E` be the finite exponential sums `v(t) = sum_{j<=N} b_j e^{-x_j t}`
with distinct real `x_j > 1/2` and complex `b_j`. Write `V(z) = ∫_0^∞ v e^{-zt} dt = sum b_j/(z+x_j)`.
For `I ⊂ (1/2, ∞)`, `E_I` restricts the rates to `I`.

Consider the following conditions.

- **(a) Residual target.** For every finite node set `T` with `P_T`
  positive definite and every new node `x`, eq. (21) holds for the Schur
  residual. Equivalently, `Delta_T(x) >= 0`.
- **(a′) Single nested sequence.** As in (a), but only along one fixed
  sequence `(x_k)` whose closure contains an interval `I`, and only for
  prefix node sets.
- **(b) Full class.** (21) holds for every `v ∈ E`, i.e. `Q_L(v) >= 0` on
  `E`. Equivalently, every real-node Pick matrix `P_S` is positive
  semidefinite.
- **(b_I)** The same as (b), on `E_I`, for a fixed interval
  `I = [a, a+delta]`, `a > 1/2`, `delta > 0`.
- **(W) Weil positivity.** For all `g ∈ C_c^∞(R)`, with
  `G(z) = ∫ g(u) e^{-zu} du`, the sum `sum_rho G(rho) conj G(-conj rho)`
  is at least 0. The sum runs over centered zeros of `F` with
  multiplicity. Under `u = -log y`, `g(u) = f(e^{-u}) e^{-u/2}`, this is
  Bombieri's form `sum_rho f~(rho) conj f~(1 - conj rho) >= 0` over
  `f ∈ C_c^∞(0,∞)`.
- **(S) Suzuki positivity.** The kernel `K(t,u) = Psi(t)+Psi(u)-Psi(t-u)`
  (with `Psi` even) is positive semidefinite on `R × R`. That is, `-Psi`
  is a screw function.
- **(RH)** Every zero of `F` lies on `Re w = 0`.

**Theorem 1 (identity).** For every `v ∈ E`, E_gamma minus the left side
of (21) equals `Q_L(v)`, and

    Q_L(v) = sum_rho V(rho) conj V(-conj rho) = W(g_v),   g_v := v·1_{[0,∞)}.

Thus the residual target is Weil's functional on one-sided exponential
test functions. It is also Suzuki's form `b(r,r)` with `r = -v'`.

**Theorem 2 (no loss from the residual restriction; unconditional).**
(a) <=> (b), and (a′) => (b_I).

**Theorem 3 (equivalence).** (a) <=> (a′) <=> (b) <=> (b_I) <=> (W) <=> (S) <=> (RH).

The following implications are proved below without assuming RH:
(b) => (a), (a) => (b), (a′) => (b_I), (W) => (b), (S) => (b). The
remaining implications go through RH: (b_I) => RH and RH => (W), (S),
(a′). Under RH, all Schur defects are strictly positive.

**Theorem 4 (margin version is false; unconditional).** For every
`eta > 0` there is a `v ∈ E` with `|Q_L(v)| < eta · E_gamma(v)`. The `v`
can be taken with rates in any `[a, a+delta]`. Hence for every
`theta < 1`, the bound "prime term ≤ `theta · E_gamma` on all of `E`"
fails. This holds whether or not RH is true.

## 2. Proof of Theorem 1

Use (16), re-derived in §6. Rearranged, it says that E_gamma minus the
left side of (21) equals `Q_L(v)`.

For (1.7), re-derived in §6, use the Hadamard pairing
`L(z) = sum_{Im rho>0} 2z/(z^2-rho^2)` and the identity
`(f(x)+f(y))/(x+y) = 1/((x+rho)(y-rho)) + 1/((x-rho)(y+rho))` for
`f(z) = 2z/(z^2-rho^2)`. Summing against `b_i conj b_j` gives
`V(rho) conj V(-conj rho) + V(-rho) conj V(conj rho)`. The second term is
the term for the zero `-rho`. Absolute convergence follows from
`|V(beta+i gamma)| <= B/|gamma|` (since `|x_j + beta + i gamma| >= |gamma|`)
and `sum |rho|^{-2} < ∞`.

Weil identification. `g_v` has Laplace transform `V`, which is analytic
for `Re z > -min x_j`, so on the closed strip. The transform of
`g * g~`, with `g~(u) = conj g(-u)`, is `G(z) conj G(-conj z)`. So the
sum in (1.7) is the zero side of Weil's explicit formula at
`h = g_v * g_v~`. One checks that (13) is the prime and archimedean side
of the same formula: `h(±l) = C_v(l)`, `conj C_v(l)` for `l ≥ 0`, giving
prime terms `-2 sum Lambda(n) n^{-1/2} Re C_v(log n)`. The `1/s` pole of
`xi` is absorbed into `A(p)` through `1/s + psi(s/2)/2 = psi(s/2+1)/2`;
this is the anchored split (4) of PR #48.

The Suzuki form is PR #47 eq. (4) and (7): `Q_L(v) = b(r,r)`. ∎

## 3. Proof of Theorem 2

(b) => (a) is immediate, because Schur residuals belong to `E`.

The Schur step is PR #48 (3) and PR #47 (6)–(7). If `P_T` is positive
definite, then `P_{T∪{x}}` is positive semidefinite iff
`Delta_T(x) = Q_L(v_res) >= 0`.

**Lemma A.** For `x > 1/2`, `L(x) > 0`, and `L(x) = O(log x)`.

*Proof.* `L(x) = sum_{Im rho>0} [1/(x-rho) + 1/(x+rho)]`, and every term
has positive real part because `x > 1/2 > |Re rho|`. The sum is real.
Growth: `L = 1/s + 1/(s-1) - (log pi)/2 + psi(s/2)/2 + zeta'/zeta(s)` with
`s = 1/2 + x`, and `zeta'/zeta` is bounded for `s ≥ 2`. ∎

**Lemma B.** For each `n`, the function `(x_1 < ... < x_n) ↦ det P` is
real-analytic on the connected open cone `{1/2 < x_1 < ... < x_n}`, and it
is not identically zero.

*Proof.* `L` is real-analytic on `(1/2, ∞)`, since `F` has no zeros with
`Re ≥ 1/2` (by `zeta(s) ≠ 0` for `Re s ≥ 1`). Take `x_k = x_1 R^{k-1}`
with `x_1 = 1` and let `R → ∞`. Normalize by `D = diag(L_i/x_i)`. For
`i < j`, the normalized off-diagonal entry is at most
`2 sqrt(L_j x_i / (L_i x_j)) <= 2 sqrt((C log x_j / c) · R^{-1}) → 0`,
where `c = inf_{x≥1} L > 0` by Lemma A and continuity with `L → ∞`. The
normalized diagonal is 1 (`P_ii = L_i/x_i`). By Gershgorin the matrix is
positive definite for large `R`. A nonzero analytic function on a
connected domain has a closed zero set with empty interior. ∎

**(a) => (b).** Induction on `n = |S|`. For `n = 1`, `P = L(x)/x > 0` by
Lemma A.

Assume every `(n-1)`-node matrix is positive semidefinite, and suppose
some `P_S` with `|S| = n` has a negative eigenvalue. That condition is
open in the node coordinates. By Lemma B (applied to the first `n-1`
coordinates) we may move `S` slightly so that `T = S \ {max S}` has
`det P_T ≠ 0` while `P_S` keeps a negative eigenvalue. By the induction
hypothesis `P_T` is positive semidefinite, and it is nonsingular, so it is
positive definite. Then (a) gives `Delta_T(x) >= 0`, so `P_S` is positive
semidefinite. This is a contradiction.

Finally, positive semidefiniteness of every `P_S` is equivalent to
`Q_L >= 0` on `E`. Complex `b` is allowed because `P_S` is real symmetric. ∎

**(a′) => (b_I).** All prefix matrices positive definite implies every
finite principal submatrix on `{x_k}` is positive semidefinite, since
each is a principal submatrix of a prefix. By continuity of
`P_S` in the nodes, every finite set of distinct nodes in
`I ⊂ closure{x_k}` gives a positive semidefinite matrix. Any finite
distinct set in `I` is approximated by distinct sequence points. ∎

(If a prefix matrix were only singular semidefinite, (a′) is read with
the generalized Schur complement, as in PR #47 §4; the same continuity
argument applies.)

## 4. Proof of Theorem 3

**(b_I) => RH** is PR #50 Prop. 5. I re-checked every step:

- Interpolation data on the quartet: `+1, +1, -1, -1`, giving
  `-4 mu` exactly.
- Real coefficients by conjugation symmetry.
- Tail bound: Lagrange basis growth `|gamma|^{d-1}`, together with
  `|a+rho| >= |gamma|`, gives a tail at most
  `C^2 H^{2d} (r_*/H)^{2M} sum |gamma|^{-2} → 0`.
- Splitting the repeated pole into distinct rates
  `a, a+eps, ..., a+(M-1)eps`, with a uniform-in-`eps` majorant and
  dominated convergence in (1.7).

The contrapositive gives (b_I) => RH for every interval. Since
(b) => (b_I) trivially, (b) => RH as well.

**RH => (b), (a), (a′), strictly.** Under RH, `-conj rho = rho`, so by
(1.7), `Q_L(v) = sum_rho m_rho |V(rho)|^2 >= 0`. Equality forces the
numerator polynomial of `V = P/D` (degree `< N`) to vanish at infinitely
many points. So `v = 0`, and every Pick matrix and every Schur defect is
strictly positive.

**RH => (W).** Each term is `|G(rho)|^2`. For `g ∈ C_c^∞`, `G` decays
faster than any power on the strip, so the sum converges absolutely.

**(W) => (b), direct (no RH).** Fix `v ∈ E` and `g = v·1_{[0,∞)}`. Let
`chi` be a smooth cutoff equal to 1 on `[-1,1]` and supported in
`[-2,2]`. Let `phi_eps ≥ 0` be a mollifier on `[-eps, eps]`, and set
`g_n = (g · chi(·/n)) * phi_{1/n} ∈ C_c^∞(R)`. Then
`G_n(z) = Phi(z/n) · (g chi_n)^(z)`.

- `|Phi(z/n)| <= e^{1/(2n)}` on the strip, and `Phi(z/n) → 1`.
- `(g chi_n)^(z) → V(z)` on the strip, by dominated convergence, because
  `|v(u)| e^{u/2} <= B e^{-(x_min - 1/2) u}`.
- Integration by parts on `[0,∞)` gives
  `|(g chi_n)^(z)| <= (|v(0)| + ∫_0^∞ (|v'| + |v| ||chi'||_∞) e^{u/2} du) / |z|`,
  uniformly in `n`.

Hence `|G_n(rho)| <= C/(1+|gamma|)` uniformly in `n`, and the pair
products are dominated by the summable `C^2/(1+gamma^2)`. Dominated
convergence and (1.7) give `Q_L(v) = lim W(g_n) >= 0`. ∎

**(S) => (b), direct (no RH).**

- Define `Psi_0(t) = sum_{Im rho>0} 2(cosh(rho t) - 1)/rho^2`. Since
  `|cosh(rho t)| <= e^{t/2}`, the series converges locally uniformly and
  `|Psi_0(t)| <= 4 e^{t/2} sum |rho|^{-2}`.
- Its Laplace transform for `Re p > 1/2` is
  `sum 2/(p(p^2-rho^2)) = L(p)/p^2`, again by dominated convergence.
- By Laplace uniqueness `Psi_0 = Psi`, Suzuki's function as normalized in
  PR #47 (1). So `Psi` is continuous, with `|Psi| <= C e^{t/2}`.
- With `w(t) = e^{t/2}` and `t, u ≥ 0`, `|K(t,u)| <= 3C w(t) w(u)`. So
  `b(f,f)` is continuous on `L^1(w)`.
- A positive semidefinite continuous kernel gives `b(f,f) >= 0` for `f`
  in `C_c` (Riemann sums), and hence on the `L^1(w)` closure. That
  closure contains `r = -v'`, since `x_min > 1/2`.
- So `Q_L(v) = b(r,r) >= 0`. ∎

**RH => (S).** With `rho = i gamma`,
`Psi(t) = sum_{gamma>0} 2 m (1 - cos(gamma t))/gamma^2`, and

    K(t,u) = sum 2m/gamma^2 · Re[(1 - e^{i gamma t})(1 - e^{-i gamma u})],

which is a convergent sum of positive semidefinite kernels on `R × R`. ∎

(Suzuki's own theorem gives (S) => RH. Here we instead have
(S) => (b) => RH.)

Chain: (a) <=> (b) (Thm 2). (b) => (b_I) => RH => (b). RH => (a′) =>
(b_I). RH => (W) => (b). RH => (S) => (b). ∎

## 5. Proof of Theorem 4

From (7), `E_gamma(v) >= |J_{5/2}(0)|^2 = |V(5/2)|^2`.

Fix `a > 1/2` and `H > max(a + 5/2, 1)`. Let
`W(z) = prod_{|Im rho| <= H, Im rho > 0} (z^2 - rho^2)^{(distinct)}`. This
is a real polynomial of degree `d`. It vanishes at every zero up to height
`H`, including any off-line ones, since the zero set is symmetric. It does
not vanish at `5/2`, because `xi` has no real zeros.

Put `V_M(z) = W(z) ((a + 5/2)/(z + a))^M` with `M > d`. Then
`V_M(5/2) = W(5/2) ≠ 0`. All zero terms with `|gamma| <= H` vanish, and
for `|gamma| > H`,

    |V_M(rho)| <= C |gamma|^d ((a+5/2)/|gamma|)^M.

So `|Q_L(V_M)| <= C^2 H^{2d} ((a+5/2)/H)^{2M} sum |gamma|^{-2} → 0`.

Split the pole into distinct rates `a + j eps` as in Prop. 5. `Q_L`
converges by dominated convergence, and `V_{M,eps}(5/2) → W(5/2)`. So
`|Q_L|/E_gamma` can be made smaller than any `eta`. This uses no
hypothesis on the zeros. ∎

(This is the precise sense in which a uniform gamma-energy margin is
unavailable. It complements atlas §11.)

## 6. Re-derivations used

**(16) from (13).** The pole term (11) is
`2 Re ∫_0^∞ e^{l/2} C_v(l) dl`, because
`∫_0^∞ e^{l/2} e^{-x_i l} dl = 1/(x_i - 1/2)`; symmetrize. The prime
terms are `-2 sum c_n Re C_v(log n)`. Together they give
`2 Re ∫_{(0,∞)} C_v dM`, with `M(0) = 0`. The product `M C_v` vanishes at
infinity, since `M = O((1+l) e^{l/2})` and
`C_v = O(e^{-x_min l})`. Integrating by parts gives
`-2 Re ∫ M C_v'`.

**(1.6) and the Pick pair formula.**
`2(xy - rho^2)/((x^2 - rho^2)(y^2 - rho^2))` equals
`(f(x) + f(y))/(x + y)` for `f = 2z/(z^2 - rho^2)`. The numerator is
`2[x(y^2 - rho^2) + y(x^2 - rho^2)] = 2(x+y)(xy - rho^2)`.

**Schur residual sign.** Write `P_S = [[P_T, p], [p*, d]]`. With
`b = (-P_T^{-1} p, 1)`, `b* P_S b = d - p* P_T^{-1} p`.

## 7. Numerical audit (mpmath, small scale)

Script: `tmp/research-2026-11-16/eq48/check_identities.py`, run in a
throwaway venv with mpmath at 30 digits. Test: rates `(2, 2.7, 3.5)`,
coefficients `(1, -2.5, 1.5)`.

| Check | Value | Difference from Pick |
|---|---|---|
| Pick form `Q_L` | 1.70098912e-5 | — |
| PR #48 (13), primes to 2·10^5 | 1.70097543e-5 | 1.4e-10 (within the tail bound ~3e-10) |
| PR #50 (1.7), first 300 zeros | 1.70090982e-5 | 7.9e-10 (truncation, since `sum b = 0`) |

Theorem 4 construction (`a = 1`, `W` killing the first 3 zero pairs,
zeros 4..119 summed): `Q_L/|V(5/2)|^2` is 2.6e-13 at `M = 8`, 9e-30 at
`M = 16`, and 4e-120 at `M = 64`. This illustrates the proof; it is not
part of it.

## 8. What remains unproved

- (21) itself. By Theorem 3 it is RH. Nothing here makes progress on it.
- Whether a margin version restricted to **Schur residuals** (not all
  of `E`) fails. Theorem 4 is proved on `E`. Transferring it to residuals
  would need a lower bound on `E_gamma` of the minimizing residual, which
  I did not prove. Under RH the residual defects tend to 0 along dense
  node sequences, but no quantitative statement is claimed.
- **Davenport–Heilbronn remark (sketch, not a theorem here).** The proofs
  of Theorems 2 and 4 and of Prop. 5 use only these properties:
  - `F` even, real, and entire of order 1, with a paired Hadamard product;
  - `sum |rho|^{-2} < ∞`;
  - zeros in a vertical strip `|Re| < beta_max`, with nodes to the right.

  For a DH-type function, the same chain shows that its analogue of (21),
  built with its own Dirichlet coefficients and with nodes
  `> beta_max`, fails at some finite order, because DH has off-line zeros.
  Hence any proof of (21) must use the Euler product (the `Lambda(n)`
  support and sign structure), not only the functional equation, the
  gamma factor and the Dirichlet-series shape. I did not check DH's node
  domain or real-zero-freeness in detail, so this remains a remark.

## 9. Self-adversarial check (three weakest steps)

1. **Genericity step in (a) => (b) (Lemma B plus the perturbation).** The
   risk is that `det P_T` vanishes on an open set, which would block the
   perturbation. This holds: `det P_T` is real-analytic on a convex,
   hence connected, cone. Gershgorin at geometrically separated nodes
   needs only `L > 0` and `L = O(log x)`, which Lemma A proves
   unconditionally. A second risk is that the perturbation destroys the
   negative eigenvalue. It does not, because having a negative eigenvalue
   is an open condition and the zero set has empty interior. **Holds.**
2. **(b_I) => RH via PR #50 Prop. 5.** This is the only step carrying the
   "RH-strength" content. The risks are:
   - the Lagrange tail constant depending on `M`: it does not, since the
     basis polynomials are fixed by the finite zero set and only the data
     scale as `r_*^M`;
   - nonuniformity in `eps` when splitting the pole: there is none, since
     `|rho + a + j eps| >= |gamma|`;
   - the case where `xi` has a multiple zero: the multiplicity only scales
     the `-4 mu` term.

   One subtlety: `r_* < H` is needed, and `H` is chosen after the target
   zero, so this is fine. **Holds.**
3. **Identification of "the residual statement" with (a).** PR #48 (21)
   is phrased per residual and is open about "uniformly". If "uniform"
   meant a single fixed nested sequence, (a′) covers it. If it meant a
   positive margin against `E_gamma`, Theorem 4 shows it is false on `E`,
   but it is not proved false on residuals only (open item in §8). So
   the verdict "equivalent to Weil, Suzuki and RH" is established for the
   constant-1 reading. For the margin reading it is established only on
   the full class. **Holds with this stated qualification.**

Additional dependency: the Suzuki leg identifies Suzuki's explicit `Psi`
with the zero series `Psi_0` through the PR #47 (1) normalization of
Suzuki's Theorem 1.1. I did not re-read Suzuki's paper. If his
normalization differs by an additive linear or constant term, (S) would
need the same adjustment. The (W) and (b) legs are unaffected.

## Referee corrections (2026-11-16, see REFEREE.md)
Independent referee: no item WRONG; Thm 1, Thm 2 (a)⇒(b), PR #50 Prop. 5, Suzuki leg, Thm 4 HOLD.
- Thm 2 (a′)⇒(b_I): (a′) is meaningful only while every prefix Pick matrix is positive definite; if a defect is exactly 0 the next Schur residual is undefined. Thm 3 must either assume all prefixes are PD or use the generalized Schur complement. (a)⇔(b)⇔RH unaffected.
- Lemma B: the inequality used monotonicity of L, which is false; the corrected bound still tends to 0.
- Suzuki normalization: confirmed against arXiv:2206.03682 Thm 1.1(1)/1.2 (Laplace(Ψ)=L(p)/p², matches Suzuki (1.1) to ~1e-30). The §9 caveat is removed.
- Thm 4: tail bound is H^{2d+2} with M > d+1 (not H^{2d}); harmless.
- Verdict qualification: the margin version (θ<1) is refuted over all finite exponential tests, NOT over Schur residuals only; whether a margin can hold on Schur residuals alone remains open.
