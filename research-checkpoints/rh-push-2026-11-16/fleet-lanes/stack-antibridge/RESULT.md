# stack-antibridge: the antibridge as a constraint (Stieltjes class), stacked with parity, causality and the prime chain

Date 2026-11-16. Nothing here proves or refutes RH. No bound moves.
Labels: PROVED / CLASSICAL / CERTIFIED (ball arithmetic) / MEASURED / ARGUED / OPEN.

Notation. `F(x) = xi(1/2+x)` (real entire, even, order 1), `L = F'/F` (odd), `s = x^2`,
`Xi(s) = F(sqrt s)` (order 1/2), `M(s) = Xi'/Xi = L(x)/(2x)`, zeros of `Xi` at `-lambda`,
`lambda = -rho^2` for each centered zero pair `+-rho` of `F` (`lambda = gamma^2 > 0` for an on-line zero).
`P_ij = (L_i+L_j)/(x_i+x_j)`, `B_ij = -(L_i-L_j)/(x_i-x_j)`, `K_e = P+B = 4 x_i x_j (-M)[s_i,s_j]`,
`K_o = P-B = 4 (sM)[s_i,s_j]` (g-antibridge-cancel Theorems A, B; refereed).

## Verdict

**Precise reduction plus one new exact identity and one certified explanation. No proof of RH.**

1. The user's hypothesis is correct in the following exact sense. The pair (bridge, antibridge) does not cancel
   anything, but the two-sided bound `-P <= B <= P` at all orders on any one interval is the statement
   "`M` is a **Stieltjes function**": `M(s) = c + int_[0,inf) d nu(lambda)/(s+lambda)`, `c >= 0`, `nu >= 0`
   (Theorem 1, PROVED from CLASSICAL Loewner/Krein). For `M = (log Xi)'` this forces `c = 0`,
   `nu = sum of unit masses at lambda`, all `lambda > 0`: support of the measure = squares of the zero ordinates.
   The masses are multiplicities and are positive automatically; the whole content is that the support lies on
   the half-line. This is RH (it is the Laguerre-Polya statement for `Xi`).
2. The class does not depend on the interval, so there is a propagation theorem and it is free: the pair of
   sector conditions at all orders on any open interval is the global statement (Theorem 2). It is an all-order
   statement. No finite order propagates (Theorem 3 and the three controls).
3. New exact identity (Theorem 4, PROVED): at the antibridge anchor `q+-` (`x = 0`) the bridge form decouples
   by itself. The jet matrix of `P` of order `N` at `x = 0` is, up to a signed permutation,
   `2 H0_ceil(N/2) (+) 2 H1_floor(N/2)`, where `H0 = [mu_{i+j}]`, `H1 = [mu_{i+j+1}]` are the two Hankel
   matrices of the Stieltjes moment problem for `mu_k = sum_lambda lambda^{-k-1}`. `H0` is the confluent odd
   sector `K_o`, `H1` the confluent even sector `K_e`. So the pair at order `K` is the bridge form at order `2K`
   on a node set closed under the antibridge reflection.
4. CERTIFIED consequence: the failure orders measured by earlier lanes on node families are the anchor Hankel
   orders, by the rule `N*_P = min(2 K0 - 1, 2 K1)`. Planted twins: 7 of 7 rows of the euler-lane table
   (7, 12, 15, 24, 34, 49, 81). Davenport-Heilbronn: `H0` has negative pivots at 75 and 110, `H1` at 75 and 109,
   which gives 149, 150, 218, 219, the four DH failure orders of g-coupling-norm. The pair itself fails for DH
   at order 75 on real nodes. For `xi`: `P`, `K_e`, `K_o` positive through 100 nodes, `H0`, `H1` through
   order 100.
5. Stack: parity split, Hankel causality and the Stieltjes class are one statement in three coordinates
   (Theorem 5). The passive prime chain does not enter the stack: in the `s = x^2` coordinate each prime stub
   puts its singularities on the parabola `Re s = 1/4 - (Im s)^2`, not on the half-line, and termwise it has an
   oscillating signed Stieltjes density (Theorem 6). What is left open is exactly the sign of the total density,
   which is the Weil explicit formula.

## 0. Plan: what is new relative to the atlas, the walls and the earlier lanes

- g-antibridge-cancel proved the algebra (`P +- B`, sectors as Loewner matrices) and concluded each sector is
  RH-equivalent. It did not identify the function class of the pair, did not treat the candidates for the user's
  form separately, and did not look at the anchor.
- PR 49 (analytic_continuation.md section 2) proved interval propagation for the theta-coordinate kernel with
  Neeb-Olafsson. Theorem 2 here is the same phenomenon in the spectral coordinate with an elementary proof and an
  explicit class.
- `pick/NEXT_STAGE.md` eq. (1) (also PR 50 eq. (29)) already has the split
  `P = Loew_j + X Loew_{-h} X` with `h = 2M`, `j = 2sM`, and uses the two Dobsch-Donoghue Hankel matrices at
  points `u > 0` as a sufficient condition. `H1`, `H0` below are those matrices at the anchor `u = 0`. What that
  lane does not have: at `u = 0` the sum is a direct sum (Theorem 4), which turns the sufficient condition into
  an equality of inertia and gives rule (4.1).
- New here: the definition table (section 1); the exact class with its integral representation (Theorem 1);
  the anchor identity (Theorem 4) and the resulting rule `N*_P = min(2 K0 - 1, 2 K1)` (section 5); the
  certified sector/anchor failure orders for twins and DH; the three controls run on the pair (section 6);
  the location of the prime chain in the `s` coordinate (Theorem 6).
- Walls. Every theorem below is an equivalence or an identity valid for any real entire even `F` of order <= 1.
  No step uses the Euler product, so none can separate zeta from DH. This is stated per control in section 6.

## 1. Definition table: every use of "antibridge" found

Search: `anti-?bridge | ante bridge | opposite bridge | bridge shear` over the mathexplorer working tree and
`~/Documents/GitHub/zeta-view` (read-only, HEAD `dce7d5f`); the first three patterns over all
fetched PR refs (10 to 57; `.md .txt .js .py`). Outside PR 49 no PR ref contains the word. "ante bridge" does
not occur anywhere. Working-tree hits under `.claude/worktrees/` and `thinking/transcripts/` duplicate row 17.

| # | Source (file:line) | What it defines or uses | Kind |
|---|---|---|---|
| 1 | PR 49 `rigorous/torus-heat-antibridge-2026-11-09/torus_heat_flow.md`:46-55 | Fixed points of `I(w,eta) = (1/w, eta/w^2)`: `p+- = (1, +-(r+1/r))` over `s = inf`; `q+- = (-1, +-(r+1/r))`, "interpreted here as the opposite anti-bridge anchors", over `s = 1/2` (`z = 0`) | points |
| 2 | same:57-62 | `H_tau(0) > 0`, `H_tau'(0) = 0`, `d/dtau H_tau(0) > 0`: "symmetry sites, not zero-collision sites" | point values |
| 3 | same:63-65 | "If anti-bridge instead denotes a second cut between sheets, that cut has no additional scalar zero condition without an independently established coupling equation" | alternative reading, no form |
| 4 | same:86-89 | Flow coefficient on the critical oval: vanishes to 4th order at `theta = 0`, equals `-4` at the opposite anchor `theta = pi` | coordinate fact |
| 5 | same:182-184 | The two tails of the theta variable `u` "are not automatically the spectral punctures `p+-` or the anti-bridge `q+-`" | disclaimer |
| 6 | PR 49 `analytic_continuation.md`:18-21 | "the cross-tail kernel is not automatically the geometric anti-bridge. A separate exact dictionary is needed" | disclaimer |
| 7 | PR 49 `collective_certificate.md`:89, 98 | Opposite reflection `-z` of a top zero contributes `-2U/(x^2+U)` to `dU/dtau`; "Interpreting it as an anti-bridge contribution does not create a new interaction" (Polymath Prop. 3.3) | zero-dynamics term |
| 8 | PR 49 `README.md`:1, 12-16; `thinking/decisions/2026-11-09-torus-heat-antibridge.md`:17-18, 24, 56-57 | Title "the opposite bridge"; question "use the frozen infinity meeting points and the opposite anti-bridge"; verdict: anchors alone do not locate the threshold | framing |
| 9 | zeta-view `README.md`:58 | "Spectral infinity is w = 1; the anti-bridge is w = -1, at s = 1/2" | point |
| 10 | zeta-view `README.md`:67 | "The anti-bridge of xi is a nonzero phase saddle, not an additional zero" | point value |
| 11 | zeta-view `README.md`:14, 47, 91, 92, 102, 118; `docs/ROADMAP.md`:16; `docs/INFINITY-ENDS-DUAL.md`:223 | Markers, shortcut "Anti-bridge . 1/2", rim centred on the anti-bridge, Klein involution pairs the two anti-bridge lifts, dual-conormal anchor | display |
| 12 | zeta-view `docs/KLEIN-ANNULUS.md`:32-36, 76 | "regular anti-bridge points `q+- = (-1, +-(r+1/r))`"; on the Klein quotient `q+` and `q-` become one point | points |
| 13 | zeta-view `dist/elliptic.js`:10, 146; `dist/geometry.js`:97, 109; `dist/dual.js`:34, 146; `dist/quotient.js`:90-96; `dist/quotient-panel.js`:157, 161; `dist/critical-samples.js`:66 | Landmark lists `antiBridge` at `(sigma, t) = (1/2, 0)`; probe shortcut sets `sigma = .5, t = 0` | code |
| 14 | zeta-view `dist/renderer.js`:503-504; `dist/canvas-renderer.js`:187 | Style branch for a ladder rail of kind `'antibridge'`. No module emits a rail of that kind | unused hook |
| 15 | zeta-view `docs/BRIDGE-RESEARCH.md`:41-66 ("Bridge shear"); `README.md`:158; `scripts/experiments/shear-probe.mjs`:28-30; `docs/ZERO-CONFINEMENT-COMPARISON.md`:3 | Shear `W = Re(F' conj F)`, `W/|F|^2 = Re F'/F`; finite bridge `B_a = tanh(log|F(s+a)| - log|F(s-a)|)`, `B_a/(2a) -> Re F'/F` | scalar field |
| 16 | zeta-view `docs/BRIDGE-RESEARCH.md`:92-118 | Even/odd boundary energy: `e_+- = (D_- + D_+ +- 2C)/4`, `D_+- = P_a(t+-r, t+-r)`, `C = P_a(t-r, t+r)`, `E_+ - E_- = W_h(t)/h` | pair of forms with opposite coupling |
| 17 | mathexplorer `src/data/imp-1240-volterra-norm-pilot.js`:169; `src/data/imp-1266-volterra-mellin-symbol.js`:508 | "off-diagonal bridge shear operator `V_{a,Phi}`", Conjecture 27.2 `||V|| <= 1`, "equivalent to `K_a >= 0`" | coupling contraction |
| 18 | `tmp/research-2026-11-16/push/g-antibridge-cancel/RESULT.md` section 1 | `Q^a(b,c) = W(v_b - J v_c)`, `J g(t) = g(-t)`: the lane author's definition | quadratic form |

Summary of the table. The user's sources define the antibridge as **two points** (`q+-`, over `s_zeta = 1/2`,
the fixed points of the functional-equation involution other than infinity). Rows 3, 5, 6 say explicitly that no
quadratic form is attached. Rows 16 and 17 are the two places in the user's own material where a pair of forms
with the same diagonal and opposite coupling, or a coupling contraction, is written down.

### Candidates for the associated quadratic form

| Candidate | Form | Constraint it carries (computed below) |
|---|---|---|
| C1 anchor jets | Jets of the bridge form at the anchor `x = 0` | Theorem 4: `P` decouples into `H0 (+) H1`; the pair is the Stieltjes moment problem for `mu_k`. All orders: RH |
| C2 second cut (deck `D`) | Row 3 | None. `D` acts trivially on the pulled-back scalar; the `D`-odd sector is null (g-symmetry-schur Thm 2, PROVED there) |
| C3 opposite reflection `-z` | Row 7, zero dynamics | Not a quadratic form. In `s = x^2` the zeros `z` and `-z` are the same point `-lambda`; the term `-2U/(x^2+U)` is the Jacobian term of the squaring map in the flow of `lambda`. Size `Delta^4/(4X^2)` (PR 49), negligible at height. No sign information |
| C4 cross-tail theta kernel | Rows 5, 6; PR 56 parity `u -> 2c-u`, `H_+-` | Each parity sector RH-equivalent (PR 56). The operator identity `H_+- <-> K_e, K_o` is OPEN (not proved here either). Interval propagation proved in PR 49 |
| C5 reflected field | Row 18: `[[P, +-B],[+-B, P]]` | Theorem 1: the pair is "`M` Stieltjes". Equal to C1 at the anchor and to C7 |
| C6 even/odd boundary energy | Row 16, kernel `P_a` on the line `Re s = 1/2 + a`, nodes `t +- r` | `e_+- >= 0` is the 2x2 case `|C| <= (D_- + D_+)/2` of positivity of the de Branges kernel of `E_a`; the difference of the two forms is the shear `W_h/h` (row 15). All orders and all `a`: RH (atlas section 2). The reflection is about the height `t`, not about the anchor; for `t = 0` it is conjugation |
| C7 reflected nodes | `P` continued to the node set `{x_j} U {-x_j}` | Identity (1.1) below: this is C5. PROVED |
| C8 bridge shear operator | Row 17: `||V_{a,Phi}|| <= 1` | The contraction form of the same block positivity (`T = P^{-1/2} B P^{-1/2}`, `||T|| <= 1` iff both sectors `>= 0`; g-antibridge-cancel Cor. B1) |

(1.1) PROVED by substitution, `L` odd: `P(x_i, -x_j) = (L_i - L_j)/(x_i - x_j) = -B_ij`, `P(-x_i,-x_j) = P_ij`.
So `[[P,-B],[-B,P]]` is the matrix of the single kernel `(L(x)+L(y))/(x+y)` on the `2N` nodes `{+-x_j}`, and
`(1/sqrt2)[[1,1],[1,-1]]` conjugates it to `K_o (+) K_e`.

C1, C5, C7, C8 are one object. C6 is the same pairing on a shifted line. C4 is the same pairing in the Mellin-dual
variable, with the dictionary unproved. C2 and C3 carry no form. No candidate was picked: the theorems below are
stated for C5/C7 and specialised to C1; C6 and C4 are covered by the RH-equivalences already in the cited sources.

## 2. The exact function class of the pair

**Theorem 1 (pair class). PROVED given CLASSICAL Loewner's theorem.** Let `I` be an open real interval and
`f : I -> R` a `C^1` function. The following are equivalent.

(i) For every finite set of nodes in `I`, both Loewner matrices `[(-f)[s_i,s_j]]` and `[(s f)[s_i,s_j]]` are
positive semidefinite.

(ii) There are `c >= 0` and a positive Borel measure `nu` on `[0, inf)` with `int d nu(lambda)/(1+lambda) < inf`
and `nu({lambda : -lambda in I}) = 0` such that on `I`

    f(s) = c + int_[0,inf) d nu(lambda) / (s + lambda).

For `I` inside `(0, inf)` the support condition is empty and (ii) says: `f` is the restriction to `I` of a
function of the **Stieltjes class** `S` (Krein's class `S`; `f in S` iff `-f` and `s f` are both Pick functions
analytic on `C \ (-inf, 0]`).

*Proof.* (ii) => (i): `(-f)[s,s'] = int d nu/((s+lambda)(s'+lambda))` and
`(s f)[s,s'] = c + int lambda d nu/((s+lambda)(s'+lambda))` are Gram kernels of positive measures.

(i) => (ii). By Loewner's theorem `g = -f` and `h = s f` extend to Pick functions analytic across `I`;
`g(s) = alpha s + beta + int_{R\I} (1/(t-s) - t/(1+t^2)) d nu(t)`, `alpha >= 0`, `nu >= 0`,
`int d nu/(1+t^2) < inf`. `h = -s g` on `I`, hence on the upper half-plane. The representing measure of `h` is
the vague limit of `(1/pi) Im h(t+i eps) dt = (1/pi)[-t Im g(t+i eps) - eps Re g(t+i eps)] dt`. The second term
tends to 0 (`int_a^b |g(t+i eps)| dt = O(log 1/eps)` for a Pick function), the first to `-t d nu(t)`. It must be
positive, so `nu((0,inf)) = 0`. The linear coefficient of `h` is `lim_{y->inf} h(iy)/(iy) = -lim g(iy)`, which
must be real and `>= 0`. `Im g(iy) = alpha y + int y d nu/(t^2+y^2)` forces `alpha = 0`. For `t <= 0`,
`t/(t^2+y^2)` increases to 0 as `y` increases, so by monotone convergence
`Re g(iy) -> beta + int |t|/(1+t^2) d nu`. Hence `c := -beta - int |t|/(1+t^2) d nu` is finite and `>= 0`; with
`int d nu/(1+t^2) < inf` this gives `int d nu/(1+|t|) < inf`. Substituting, `f = -g = c + int d nu(t)/(s - t)`;
put `lambda = -t`. The measure of `g` has no mass in `I`, which is the support condition. ∎

What each sector contributes (PROVED by the same computation):

| Condition at all orders on `I` | Class | What is still allowed |
|---|---|---|
| `K_e >= 0` only (`-f` Pick) | `-f in P(I)` | poles anywhere on `R \ I`, including positive real poles; a term `-alpha s` |
| `K_o >= 0` only (`s f` Pick) | `s f in P(I)` | positive real poles of `s f` outside `I` |
| both (`-P <= B <= P`) | Stieltjes | nothing off `(-inf, 0]` |

**Corollary 1 (the representation for `M`). PROVED.** `M(s) = sum_lambda m_lambda/(s+lambda)` unconditionally
(Hadamard, genus 0 in `s`; `m_lambda` = multiplicity). By uniqueness of meromorphic continuation, the pair of
sector conditions on any interval `I` disjoint from the poles holds at all orders iff

    M(s) = int_(0,inf) d nu(lambda)/(s+lambda),   nu = sum_n m_n delta_{gamma_n^2},   c = 0,

i.e. iff every `lambda` is real and positive, i.e. iff RH. Reading of the representation:

- Support of `nu` = `{gamma_n^2}`, the squares of the zero ordinates. `lambda = 0` is excluded by `xi(1/2) > 0`.
- Positivity of the masses carries **no** information for a logarithmic derivative: residues are multiplicities.
  A violation of RH does not show up as a negative mass. It shows up as a pole of `M` off the half-line: an
  off-line quartet gives the conjugate pair `-lambda, -conj(lambda)` with `lambda = gamma^2 - d^2 - 2 i d gamma`
  (`d = beta - 1/2`), i.e. poles at distance `2 d gamma` from the negative `s`-axis.
- `c = 0` and `int d nu/(1+lambda) = sum 1/(1+gamma^2) < inf` are automatic (order 1/2).
- For `M` alone: `K_o >= 0` implies `K_e >= 0`; `K_e >= 0` implies `K_o >= 0` iff `F` has no real zeros other
  than possibly 0. For zeta that is CLASSICAL (`xi(sigma) != 0` for real `sigma`), so at all orders the pair, the
  even sector and the odd sector are the same set. The extra content of the pair over the even sector is exactly
  the exclusion of real off-centre zeros: a real zero `beta != 1/2` gives a pole at `s = (beta-1/2)^2 in (0,1/4)`,
  which `K_e` on `I` inside `(1/4, inf)` (one-sided tests, `x > 1/2`) cannot see and `K_o` can. For zeta this is
  empty; for a real Dirichlet character it is the exceptional-zero question.

So, as a function class: **the antibridge pair is the Stieltjes cone**. Equivalent classical forms of membership
(CLASSICAL): `Xi` is in the Laguerre-Polya class with negative zeros; `M` is the Laplace transform of a completely monotone function
(`S` = iterated Laplace transforms of positive measures); the Stieltjes continued
fraction of `M` at the anchor has positive coefficients (section 4); `L(x) = 2x M(x^2)` is a Foster reactance
function (section 3).

## 3. Propagation and finite order

**Theorem 2 (interval independence). PROVED.** For `f = M` and any two open intervals `I, I'` free of poles of
`M`: the pair holds at all orders on `I` iff it holds at all orders on `I'` iff RH. For a general `f` on
`I, I'` inside `(0, inf)`: the pair at all orders on `I` implies that `f` continues analytically to
`C \ (-inf, 0]` and satisfies the pair at all orders on `(0, inf)`.

*Proof.* Theorem 1: the class in (ii) does not depend on `I` when `I` is inside `(0,inf)`, and the representation
continues. For `M` the continuation is unique and Corollary 1 applies on every pole-free interval, including
intervals of the spectral side `(-gamma_1^2, 0)`, which in the variable `X = -s` is the interval `(0, gamma_1^2)`
of the TP lane (g-odd-sign-tp T-S: RH iff the Loewner kernel of `phi(X) = M(-X)` is strictly TP of all orders
there). ∎

This answers the propagation question: yes, sector conditions verified on `(0, gamma_1^2)` at all orders imply
the global statement, by Loewner's theorem and uniqueness of continuation. The all-order statement on any
interval is RH itself. PR 49 `analytic_continuation.md` section 2 is the same theorem in the theta coordinate.

**Theorem 3 (no finite-order propagation). PROVED from Theorem 4 and CLASSICAL facts.**
(a) The order-`K` pair on `I` is a local condition; the classes of `K`-monotone functions on an interval are
strictly decreasing in `K` and are not determined by a smaller interval (CLASSICAL: Loewner, Donoghue).
(b) Under RH all finite sector matrices are positive definite (infinitely many atoms), so every finite-order
pair is an open condition in `f`; it persists under small perturbations that move a zero off the line at any
fixed index (section 5: explicit twins) and under small backward heat flow (section 6).
(c) At the anchor the order-`K` pair is the truncated Stieltjes moment problem for `mu_0, ..., mu_{2K-1}`
(Theorem 4). It is solvable iff there is a positive measure with at most `K` atoms on `[0, inf)` matching these
`2K` moments (CLASSICAL). So the order-`K` pair says: the first `2K` Taylor coefficients of `M` at the anchor
agree with those of a function having `K` zeros on the line. It asserts nothing about the actual zeros.

Quantification (section 5): a moved zero of index `n` is first seen by the pair at order `2n + 1` to `2n + 3`, and by
`P` at order `min(2 K0 - 1, 2 K1)`, which is the euler-lane fit `N* ~ 4n + 3`. Height seen by order `K`:
zeros of index up to about `(K - 2)/2`, i.e. ordinates up to about `gamma_{K/2}`.

## 4. The anchor identity (candidate C1 made exact)

Define `mu_k = sum_lambda lambda^{-k-1}`, `k >= 0` (absolutely convergent; real; computable unconditionally from
the Taylor coefficients of `log xi` at `1/2`: `log Xi(s) = log Xi(0) + sum_{k>=0} (-1)^k mu_k s^{k+1}/(k+1)`).
Under RH `mu_k = sum_n gamma_n^{-2k-2}`. `H0_K = [mu_{i+j}]_{0<=i,j<K}`, `H1_K = [mu_{i+j+1}]_{0<=i,j<K}`.

**Theorem 4 (decoupling at the antibridge anchor). PROVED.** Let `J_N = [c_ij]_{0<=i,j<N}` be the jet matrix of
the bridge kernel at the anchor, `P(x,y) = (L(x)+L(y))/(x+y) = sum c_ij x^i y^j`. Then `c_ij = 0` when `i + j`
is odd,

    c_{2a,2b} = 2 (-1)^{a+b} mu_{a+b},        c_{2a+1,2b+1} = 2 (-1)^{a+b} mu_{a+b+1},

so after sorting indices by parity and the sign congruence `diag((-1)^a)`,

    J_N  ~  2 H0_{ceil(N/2)}  (+)  2 H1_{floor(N/2)}.

The even-index block is the jet matrix of `K_o/2` and the odd-index block that of `K_e/2`. In the variable
`s`: the confluent Loewner matrices at `s = 0` of `sM` and of `-M` of order `K` are `H0_K` and `H1_K` up to the
same sign congruence.

*Proof.* `P = (K_e + K_o)/2` with `K_e(x,y) = sum_lambda 4xy/((x^2+lambda)(y^2+lambda))` and
`K_o(x,y) = sum_lambda 4 lambda/((x^2+lambda)(y^2+lambda))` (g-antibridge-cancel Theorem B). Expand
`1/(x^2+lambda) = sum_a (-1)^a x^{2a} lambda^{-a-1}` for `|x|^2 < min |lambda|`. ∎

Consequences.

- At the anchor the coupling `B` needs no second (reflected) field: parity of the jet index already is the
  antibridge reflection. The bridge form of order `N` at the anchor **is** the pair of order `N/2`.
  PROVED.
- `J_N > 0` iff `H0_{ceil(N/2)} > 0` and `H1_{floor(N/2)} > 0`. All orders: the Stieltjes moment problem for
  `(mu_k)` on `[0, inf)`, which (determinate, compact support in `tau = 1/lambda`) is RH. CLASSICAL once
  Theorem 4 is given.
- Stieltjes continued fraction (CLASSICAL): `M(s) = mu_0 / (1 + c_1 s/(1 + c_2 s/(1 + ...)))` with
  each `c_k` a ratio of products of leading determinants of `H0` and `H1`; `c_1, ..., c_m > 0` iff those
  determinants are positive up to the corresponding orders. RH iff all `c_k > 0`. The two sectors alternate as
  the rungs of one ladder. In circuit terms
  this is the Cauer RC ladder of `M`, equivalently the LC ladder of `L` (section 7).
- For nodes near the anchor the inertia of the node matrix `P_N` equals that of `J_N` whenever `J_N` is
  nonsingular (divided-difference congruence). So the first indefinite order of the Pick ladder on a nested
  family near the anchor is

      N*_P = min(2 K0 - 1, 2 K1),   K0, K1 = first orders at which H0, H1 are not positive definite.   (4.1)

  PROVED for sufficiently clustered nodes; for the two bounded families actually used (nodes in `[0.01, 0.5]` and
  in `[0.6, 4]`) it holds exactly in every case computed (section 5, CERTIFIED case by case). Node independence beyond the confluent regime
  is OPEN.

## 5. Computation

Scripts in this directory. Ball arithmetic (python-flint 0.9.0 / Arb) where marked CERTIFIED: a pivot sign is
reported only when its ball excludes 0. mpmath 1.3.0 elsewhere. Single-thread processes; mpmath runs and `anchor_xi.json` local, the other Arb
runs on the motherbox (outputs copied to `motherbox/`).

### 5.1 Planted twins: node sectors against anchor Hankel orders

`xi` with the on-line pair at `gamma_n` moved to `1/2 +- 0.3 +- i gamma_n` (the "move" family of
`euler/RESULT.md` section 2.2). First order at which the matrix is not positive definite.

| zero index n | gamma | `P` nodes | `K_e` nodes | `K_o` nodes | anchor `H1` (K1) | anchor `H0` (K0) | `min(2K0-1, 2K1)` | euler lane `N*` |
|---|---|---|---|---|---|---|---|---|
| 1 | 14.1347 | 7 | 4 | 4 | 4 | 4 | 7 | 7 |
| 2 | 21.0220 | 12 | 6 | 7 | 6 | 7 | 12 | 12 |
| 3 | 25.0109 | 15 | 8 | 8 | 8 | 8 | 15 | 15 |
| 5 | 32.9351 | 24 | 12 | 13 | 12 | 13 | 24 | 24 |
| 8 | 43.3271 | 34 | 17 | 18 | 17 | 18 | 34 | 34 |
| 12 | 56.4462 | 49 | 25 | 25 | 25 | 25 | 49 | 49 |
| 20 | 77.1448 | 81 | 41 | 41 | 41 | 41 | 81 | 81 |

- Node columns: CERTIFIED (Arb, 20000 bits, `dh_sectors.py`, motherbox) on two nested families, van der Corput
  in `log x` on `[0.01, 0.5]` and on `[0.6, 4]`, 100 nodes. Both families give the same seven rows. Independent
  mpmath run (`sectors.py`, 1016 digits, `[0.01, 0.5]`, 52 nodes) agrees (`sectors_main.json`).
- Anchor columns: CERTIFIED (Arb, 24000 bits, `anchor_hankel.py`, `anchor_xi.json`); `mu_k` from the Taylor series
  of `log xi` at `1/2` (odd coefficients vanish to 1e-7000; `mu_0 = 0.0231049931154189707889338`,
  `mu_1 = 3.717259928526968616486626e-5`, the known values of `sum gamma^-2`, `sum gamma^-4`).
- For `xi` itself: `P`, `K_e`, `K_o` positive definite through 100 nodes on both families (CERTIFIED);
  `H0`, `H1` positive definite through order 100 (CERTIFIED).

Readings.

1. `K_e` on nodes fails exactly at the `H1` order and `K_o` exactly at the `H0` order, on both node families
   (14 of 14 rows, each CERTIFIED). Mechanism: Theorem 4 plus near-confluence (ARGUED); a proof for general
   node sets is OPEN.
2. Rule (4.1) reproduces the euler-lane table 7 of 7. The fit `N* ~ 4n + 3` of ff-transplant is
   `min(2K0-1, 2K1)` with `K0, K1` in `{2n+1, 2n+2, 2n+3}`.
3. The pair at order `K` sees what `P` sees at order `2K - 1` or `2K`. The matrix dimension of the block form
   is `2K`. The antibridge constraint at finite order is a doubling of the node set by reflection through the
   anchor: same information per dimension, in two decoupled blocks of half the size.

### 5.2 Davenport-Heilbronn

`xi_DH(s) = (pi/5)^{-s/2} Gamma((s+1)/2) f(s)`, `f` the Davenport-Heilbronn function (Hurwitz form of
g-coupling-norm `lib.py`). All signs CERTIFIED (Arb; motherbox).

| Matrix | Family | First order not positive definite | Certified pivot |
|---|---|---|---|
| `P` nodes | `[0.01, 0.5]` | none through 84 here; 149 in g-coupling-norm (CERTIFIED there), then 150, 218, 219 | |
| `K_e` nodes | `[0.01, 0.5]` | 75 | `-1.5684389e-768 +/- 1.5e-776` |
| `K_o` nodes | `[0.01, 0.5]` | 75 | `-4.4970414e-764 +/- 2.8e-772` |
| `P` nodes | `[0.6, 4]` | none through 84 here | |
| `K_e` nodes | `[0.6, 4]` | 75 | `-2.2591706e-476 +/- 1.7e-484` |
| `K_o` nodes | `[0.6, 4]` | 75 | `-3.8110499e-474 +/- 3.3e-482` |
| anchor `H1` | none (jets at `x = 0`) | negative pivots at 75 and 109; all other signs positive through 114 | |
| anchor `H0` | none (jets at `x = 0`) | negative pivots at 75 and 110; all other signs positive through 114 | |

(`mu_0 = 0.09806957695333636694`, `mu_1 = 0.001748504939203854391` for DH; odd Taylor coefficients of
`log xi_DH` at `1/2` vanish to 1e-4800, confirming evenness.)

Readings.

1. `2 K0 - 1 = 149` and `2 K1 = 150`: rule (4.1) gives the first two negative pivots of the DH Pick ladder
   found by g-coupling-norm on its two bounded node families (the same two families as here). This is the
   node-independent rule asked for in SYNTHESIS_GEOMETRIC next move 4, at least for all four failures found there: the failure orders of the Pick ladder are the
   failure orders of the two anchor Hankel determinant sequences, i.e. of the Stieltjes moment problem for the
   power sums `mu_k`. They are properties of the Taylor coefficients of `log xi_DH` at the anchor, not of the
   nodes. The second pair is reproduced as well: `H1` at 109 gives `2*109 = 218`,
   `H0` at 110 gives `2*110 - 1 = 219`. All four DH failure orders 149, 150, 218, 219 are the anchor orders
   (`anchor_dh114.json`, Arb 34000 bits, signs certified through order 114; the orders 109 and 110 were
   predicted from (4.1) before the run).
2. For DH the pair fails at order 75 on real nodes (both sectors, both families, including `x in [0.6, 4]`).
   This supplies the explicit real-node witness that g-antibridge-cancel lacked (its referee item 4: failure had
   been shown only at complex nodes inside the strip). The zero-side form is used; DH has zeros with
   `Re s > 1`, so the one-sided Laplace reading of these nodes for DH needs the caveat stated in that lane.
3. One negative pivot in each of `H0`, `H1` per off-line quartet reached is consistent with the generalized
   Nevanlinna bound (each sector has at most as many negative squares as there are off-line quartets).

## 6. The three controls

Status of the lane against the controls: Theorems 1 to 6 are equivalences and identities. None of them is an
argument for the sign, so none of them can "fail" for a control; what can be checked is (i) that every identity
holds for the control, (ii) that the pair itself is false for the control, and (iii) at which order that
becomes visible. All three were run.

### 6.1 Davenport-Heilbronn

- Identities: Theorems 1 to 5 use only "real entire, even, order <= 1, `F(0) != 0`". They hold verbatim for
  `xi_DH`. No step uses `Lambda(n) >= 0`, multiplicativity, or Hecke structure. Theorem 6(a),(c) use the
  Dirichlet series only as a convergent expansion.
- The pair is false for DH at all orders (off-line zeros; Corollary 1): `M_DH` is not a Stieltjes function.
- Order at which it is visible: section 5.2.

### 6.2 Backward heat family `kappa_tau = e^{tau u^2/16} kappa`, `tau < 0`

- `F_tau` is real entire, even, of order 1 for every real `tau`, so Corollary 1 applies at each `tau`:
  the pair holds at all orders on one interval iff all zeros of `F_tau` are on the line iff `tau >= Lambda_dBN`.
  By Rodgers-Tao (`Lambda_dBN >= 0`, CLASSICAL) the pair is false for every `tau < 0`. This is PR 49 finding 4
  in the spectral coordinate.
- Finite orders are flow-blind (PROVED given RH at `tau = 0`): each finite sector matrix depends continuously on
  `tau` and is positive definite at `tau = 0`, so the order-`K` pair holds on an interval `(-eps_K, 0]` where
  the all-order statement is false. No finite-order version of the pair can decide the sign at `tau = 0`.
- MEASURED (`heat_control.py`, mpmath 170 digits, `F_tau`, `F_tau'`, `F_tau''` by quadrature of the theta
  kernel, first 8 nodes of the family `[0.01, 0.5]`; at `tau = 0` the quadrature agrees with the closed form of
  `L`, `L'` to 1e-169):

| tau | first indefinite order `P` | `K_e` | `K_o` | `min(2K_o - 1, 2K_e)` |
|---|---|---|---|---|
| 0 | none to 8 | none to 8 | none to 8 | |
| -8 | none to 8 | 8 | 8 | 15 |
| -16 | none to 8 | 5 | 5 | 9 |
| -32 | 8 | 4 | 5 | 8 |
| -64 | 7 | 4 | 4 | 7 |

  The pair detects the backward flow at half the order `P` needs, and rule (4.1) holds on the two rows where
  `P` fails inside the range. The detection order grows as `tau -> 0^-`.

### 6.3 Sign twist `Lambda(n) -> eps_n Lambda(n)`

- No theorem here uses the size, sign or support of `Lambda`. The lane has no step for the twist to break; the
  twist test applies to any future argument for `nu >= 0`.
- The property itself is destroyed by every twist tested, at very low order (MEASURED, mpmath;
  `twist_control.py`, `twist2.py`; nodes van der Corput in `log x` on `[0.6, 4]`, i.e. inside the region of
  absolute convergence; sector matrices by the same formulas, `L_eps(x) = G(x) - sum eps_n Lambda(n) n^{-1/2-x}`):

| twist | first indefinite order `P` | `K_e` | `K_o` |
|---|---|---|---|
| `eps = +1` (zeta) | none to 14 (to 100 CERTIFIED) | none | none |
| `eps = -1` | 2 | 2 | 1 |
| `eps = 0` (gamma and pole part only) | 2 | 2 | 1 |
| `eps_n = cos(t0 log n)`, `t0 = 0.5, 5, 14.1347` | 2 | 2 | 1 |
| `eps = -1` on powers of `p = 2` only | 2 | 2 | 1 |
| `eps = 0.99` on powers of 2 only | 5 | 3 | 3 |
| `eps = -1` on powers of `p = 101` | 3 | 2 | 2 |
| `p = 10007` | 4 | 3 | 2 |
| `p = 1000003` | 5 | 4 | 3 |
| `p = 10^9 + 7` | 6 | 4 | 3 |
| `p = 10^12 + 39` | 7 | 4 | 4 |

  Flipping the sign at one prime near `10^12` is seen by the pair at order 4. The first rows fail at order 1
  because the pole of `G` at `s_zeta = 1` is no longer cancelled; it sits at `s = 1/4 > 0`, a positive real
  pole, which is the case `K_o` detects (table after Theorem 1). The single-prime rows keep that cancellation
  and still fail by order 4.
- Consequence. The Stieltjes property is far more sensitive to the arithmetic of the coefficients than to the
  location of high zeros: a twin at zero 20 needs pair order 41, a sign flip at `p ~ 10^12` needs order 4.
  Low orders of the ladder test the exact consistency of the prime side with the functional equation (the same
  observation as the precision trap of `euler/RESULT.md` section 2.1). So any proof of `nu >= 0` must be sensitive to the
  sign of the coefficient at each individual prime. A twisted function has no functional equation, so `L_eps` is not odd and `M_eps` is not a function of
  `s`; the test is therefore of "functional equation plus zeros", not of zeros alone.

## 7. The stacked statement

**Theorem 5 (one statement, three coordinates). PROVED given the cited refereed results and CLASSICAL
network theory.** For `F` real entire, even, of order <= 1, `F(0) != 0`, the following are equivalent, and for
`F = xi(1/2 + .)` each is RH:

1. (antibridge pair) `-P <= B <= P` at all orders on one interval; i.e. `M in S` with discrete measure
   (Theorem 1, Corollary 1).
2. (anchor) `H0 > 0` and `H1 > 0` at all orders; i.e. all Stieltjes continued-fraction coefficients `c_k > 0`
   (Theorem 4).
3. (bridge alone) `P >= 0` at all orders on one interval of `x > 0`; i.e. `L` is positive-real on `Re x > 0`.
4. (lossless) `L(x) = 2x M(x^2)` is a Foster reactance function: odd, positive-real, poles simple on the
   imaginary axis with positive residues. This is the Cauer transformation `Z_LC(x) = x Z_RC(x^2)` between
   LC impedances and Stieltjes (RC) impedances.
5. (causality, g-spinor-square-root) `S_alpha = (1 - alpha L)/(1 + alpha L)` is inner in `Re x > 0`; the
   anticausal Hankel block `Gamma_-` vanishes; `H_c >= 0`.
6. (parity sectors) both sectors of the bridge form under the functional-equation involution are nonnegative.

*Proof sketch.* 1 <=> 2 <=> Stieltjes with the stated measure: Theorems 1, 4. 1 => 3: `P = (K_e+K_o)/2`.
3 => 4: Loewner/Pick on a real interval gives `L` positive-real; `L` is odd and real, so `Re L = 0` on the
imaginary axis away from poles, which is the reactance class. 4 => 1: `M(s) = L(sqrt s)/(2 sqrt s)` and the
partial fractions `2x/(x^2+gamma^2)` give `sum 1/(s+gamma^2)`. 4 <=> 5: Cayley transform; unitarity on the axis
is the oddness of `L`. 6 is 1 by g-antibridge-cancel Theorem B. ∎

How the structures stack, precisely:

(a) **Torus `(Z/2)^3`** (g-symmetry-schur Thm 1). The functional-equation involution (`x -> -x`) is what turns
the single condition 3 into the two conditions of 1: because `L` is odd, "positive-real" splits into
"`-M` Pick" and "`sM` Pick". Conjugation (`C`) makes `M` real on the real `s`-axis, i.e. `nu` a real measure.
The deck involution `D` acts trivially on the scalar and contributes nothing (candidate C2). The anchors `q+-`
are the fixed points of the first involution, and Theorem 4 says that at these points the split costs nothing:
it is the parity of the jet index. This is the exact sense in which the antibridge "holds a more constrained
version of the problem": at the anchor the indefinite coupling block is absent and the problem is two Hankel
moment problems that interlace into one positive ladder.

(b) **Square root / Hankel causality.** Item 5 is item 4 in scattering form. The Stieltjes class adds to the
square-root lane a canonical first-order structure that exists unconditionally as a formal object: the continued
fraction `c_1, c_2, ...` computed from the anchor jets. `H_c = D*D` (RH) corresponds to all `c_k > 0`; the Krein
involution `gamma <-> conj gamma` of the square-root lane corresponds to the first negative `c_k`. The number of
negative eigenvalues of each of `H0_K`, `H1_K` is at most the number of off-line quartets (CLASSICAL,
generalized Nevanlinna class `N_kappa`); equality for large `K` is the Krein-Langer statement not established in
the earlier lanes and not established here.

(c) **Passive prime chain** (g-passive-cascade Thm 1), section 8: it does not stack.

Finite-order version of the stack (PROVED + CERTIFIED numbers of section 5): order-`K` pair = order-`2K` bridge
form on reflection-closed nodes = `K` rungs of each rail of the ladder = information about zeros of index up to
about `K/2`. Stacking the structures does not raise the height seen per unit of matrix dimension.

## 8. Where the prime chain sits in the `s` coordinate

**Theorem 6. PROVED (elementary) + CLASSICAL explicit formula.**
(a) For `x > 1/2`, `L(x) = G(x) - sum_n Lambda(n) n^{-1/2-x}` with `G` the gamma and pole part. The reflection
`x -> -x` maps the half-plane of convergence to a disjoint one. No termwise decomposition of the Euler chain into
functions of `s = x^2` exists: each term `n^{-1/2} e^{-x log n}` is not even in `x`.
(b) The odd part of the prime-`p` stub, `-(log p/4)[coth((1/2+x) log p/2) - coth((1/2-x) log p/2)]`
`= -(log p/2) sinh(x log p)/(cosh(x log p) - cosh(log p/2))`, has its poles at `x = +-1/2 + 2 pi i k/log p`.
In `s = x^2` these lie on the parabola `Re s = 1/4 - (Im s)^2` (the image of the lines `Re s_zeta = 0, 1`),
and for `k != 0` off the real axis. A single symmetrized prime stub is therefore neither in the Stieltjes cone
nor in its negative. "Lossless on the wrong line" (g-passive-cascade) reads here: spectral support on the
parabola instead of the half-line.
(c) On the real ray `s > 1/4` with `x = sqrt s`, each term has a signed Stieltjes representation
(checked numerically to 1e-30, `twist_control.json`):

    e^{-c sqrt s}/sqrt s = int_0^inf [cos(c sqrt r)/(pi sqrt r)] dr/(s + r),

so formally `d nu(r) = [gamma density] dr - sum_n Lambda(n) n^{-1/2} cos(sqrt r log n)/(2 pi sqrt r) dr`.
With `r = y^2` this is the Riemann-Weil explicit formula for the zero-counting measure in the ordinate `y`.
Each prime term has an oscillating density of both signs; `Lambda(n) >= 0` fixes the sign of the amplitude, not
of the density.

So the Stieltjes condition restricted to the Euler region is: a positive-amplitude combination of oscillating
densities, plus the gamma density, is a positive measure. That is the open statement. Nothing in the geometry
supplies it.

## 9. What is left open

1. The sign statement itself: `nu >= 0` (support on the half-line). Every form above is an equivalent of it.
   By Theorem 6 the only place the Euler product can enter is the cancellation between the gamma density and
   `sum Lambda(n) n^{-1/2} cos(y log n)`; a proof must use multiplicativity there, since the conclusion is
   false for DH, for backward heat, and (section 6) the property is destroyed by any sign twist tested.
2. Node independence of (4.1) outside the confluent regime (it held exactly on every family tested).
3. `H_+-` (PR 56, theta coordinate) versus `K_e, K_o`: operator identity still unproved (candidate C4).
4. Negative index of `H0 (+) H1` at large order = number of off-line pairs (Krein-Langer): not proved.
5. Whether the user's intended antibridge is C1/C5 (the reflection through the anchor) or C6 (the even/odd
   boundary energy of zeta-view, reflection about a height `t` on a shifted line). Both are treated; they give
   the same class at all orders. The sources contain no statement choosing between them.

## 10. Three weakest steps

1. **Which form the user means.** The sources define the antibridge as the two anchor points and say that no
   coupling equation is attached (table rows 3, 5, 6). The treatment here covers every candidate found, and the
   main theorems are for the reflection through the anchor (C1/C5/C7). If the intended object is C4 (the
   cross-tail theta kernel), the link to `K_e, K_o` is still the unproved `H_+-` dictionary; if it is C6, only the
   all-order equivalence is covered, not a finite-order analysis on the shifted line.
2. **Rule (4.1) away from the anchor.** Theorem 4 is exact for jets. That the node matrices on `[0.01, 0.5]`,
   `[0.6, 4]` fail at exactly the anchor orders is CERTIFIED case by
   case (7 twins and DH, 2 families) but not proved in general. The near-confluence argument covers only
   clustered nodes. The backward-heat and twist tables are mpmath without enclosures.
3. **Imported steps.** Theorem 5 item 3 => 4 (real-interval positivity of the sum kernel gives positive-real)
   is taken from the refereed eq48/pick lanes, not re-proved. Theorem 1 uses Loewner's theorem and the Pick
   integral representation with a short measure argument (vague limit of `Im h`), written in outline. The
   statement about negative squares (section 7(b), section 5.2 reading 3) is the classical `N_kappa` bound and
   only an inequality; equality with the number of off-line quartets is not established.

## Files

All under `tmp/research-2026-11-16/push/stack-antibridge/`.

- `RESULT.md` (this file)
- `src/pr49_*.md`: the PR 49 notes as read (copies of `refs/pr/49`, for line references)
- `anchor_hankel.py`: Arb; anchor moments `mu_k` from the Taylor series of `log xi` / `log xi_DH`; Hankel pair
  `H0`, `H1`; twins. Outputs `anchor_xi.json`, `anchor_xi.log`, `motherbox/anchor_dh*.json|log`,
  `motherbox/anchor_xi100.*`
- `dh_sectors.py` (named `dh_sectors2.py` on the motherbox): Arb; `P`, `K_e`, `K_o` on nested nodes for xi, twins, DH. Outputs `motherbox/xi_A.*`,
  `motherbox/xi_B.*`, `motherbox/dh_A.*`, `motherbox/dh_B.*`
- `sectors.py`, `sectors_main.json|log`: mpmath cross-check of the twin table
- `heat_control.py`, `heat_control.json|log`: backward-heat control
- `twist_control.py`, `twist2.py`, `twist_control.json`, `twist2.json`: sign-twist control and the density identity
- `remote_launch.sh`: motherbox launcher (work dir `~/rh-push/stack-antibridge/`, 4 to 5 single-thread jobs)
