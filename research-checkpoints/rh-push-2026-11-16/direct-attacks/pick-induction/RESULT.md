# pick-induction: the general-k theta preservation law, its DH control, and the arithmetic gate

Working note, 2026-11-16. Scope: `tmp/research-2026-11-16/push/pick-induction/` only. Nothing committed, pushed or
commented. PRs read from local read-only refs (`refs/pr/48, 50..55`). No RH claim.
Labels: PROVED (argument given here), CLASSICAL, CERTIFIED (Arb ball arithmetic), MEASURED (floating point, not
interval-certified), OPEN.

## Verdict

1. **P(k)** (section 1) is the statement the PR #51-#55 lane inducts on. P(0..3) are proved in the PRs; P(k) for
   all k implies RH.
2. **DH fails real-Pick positivity at order 149.** CERTIFIED at the confluent node a = 1 (explicit test vector,
   Arb sign), MEASURED first failure 149 at a = 0.01, 0.1, 1, 3; 150 at a = 10; 164 at a = 40; 210 at a = 86. So DH
   violates P(k) for some k <= 146. PR #50 Prop. 5's own bound for this zero is of size 10^3 or more; its hard
   minimum is 91.
3. **DH is not a clean control for the gates.** DH fails one level-0 gate (J_0' > 0 near t = 0, J_0''(0) = -4.644),
   and passes all seven gates at levels 1-5 for anchors in [0.05, 4] (MEASURED, float64). Real primitive
   characters with Euler products (chi_-4, chi_-8, chi_-11, chi_-7, chi_8, chi_-3) also fail level-0 or level-1
   gates. The gates are therefore properties of the Jacobi theta kernel, not of Euler products.
4. **Arithmetic lemma.** In confluent coordinates the order-N gate is Lemma A(a, N) (section 3): a one-sided
   inequality between a signed prime sum and the archimedean form on N Laguerre modes. All N is equivalent to RH.
   **Theorem R (PROVED, unconditional):** Lemma A for all N fails for every sequence Lambda + eta with eta real,
   nonzero, sum |eta(n)| n^{-1/2} finite. So no proof can use only Lambda(n) >= 0, Lambda(n) <= log n, prime-power
   support, or any property stable under changing one prime weight. The attempt to prove the gate from
   Lambda(n) >= 0 is refuted, with proof.
5. **The induction scheme is not refuted and not supported.** The soft per-level method does not transfer to all k
   for DH (DH must fail by level 146), so step (4) of the task does not apply. What is established: levels <= 5
   carry no Euler content (DH passes them), the gates are strictly stronger than Pick positivity, and no inductive
   step exists yet. Where the Euler product enters between level 6 and level 146 is OPEN.

## 0. Plan: what is new relative to the atlas and the walls

| Item | Overlap | New here |
|---|---|---|
| euler/RESULT.md: DH positive to order 100 on nested nodes in [0.01, 0.5] | Same question (first DH failure order) | The failure order itself: 149, with an Arb-certified negative direction. Nodes chosen as in Prop. 5 (cluster at one point a), not nested small nodes |
| eq48/RESULT.md: all-order target == Weil == RH; no margin theta < 1 | Same target | Per-order arithmetic form (Lemma A) and a rigidity theorem in the prime weights (Theorem R) |
| pick/NEXT_STAGE.md: K <= 12 from verified height | Finite orders follow from verified height | Tests the theta-side gates (not the Pick matrices) on DH and on Euler-product L-functions |
| Atlas closing line: an all-scale signed arithmetic estimate is missing | Same wall | Lemma A states which estimate, per order; Theorem R shows it has zero tolerance in each prime weight |
| DH wall | Used as the control | Result: DH passes gates at levels 1-5, fails Pick at 149 |
| Flow-blindness, MV-CAP, verified height | Not circumvented | Each finite order is an open condition (section 2.4); Theorem R is the all-order counterpart |

Not attempted: a proof of RH or of any P(k) with k >= 4.

## 1. The general-k preservation law P(k)

Source: PR #50 `theta_second_kernel_structure` section 7; PR #54 `theta_third_gate_synthesis` section 1; PR #55
decision note.

**Setup.** kappa(t) = e^{t/4} sum_n {2(pi n^2 e^t)^2 - 3 pi n^2 e^t} e^{-pi n^2 e^t} for t >= 0, extended evenly.
F(z) = xi(1/2+z) = int kappa(t) e^{zt/2} dt, L = F'/F, C(t) = (1/4) int_{|t|}^inf s kappa(s) ds, and
(Lf)(z) = int f(t) e^{zt/2} dt. Then L(z) = z LC(z)/Lkappa(z).

**Canonical reduction at anchor a > 0.** For a pair (u, v) of even, rapidly decaying kernels with response
R(z) = z Lu(z)/Lv(z) and r = R(a), let b be the even decaying solution of

    4 b'' - a^2 b = r v - a u,        n = u - a b.

The next pair is (u, v) <- (b, n), with response 1/(reduced R) again of the form z Lb/Ln. (This is the uniform form
of the Type I / Type II alternation in PR #50 eqs. (29)-(34); reciprocals of positive-real functions are
positive-real.) Start: (u_0, v_0) = (C, kappa). After anchors a_1, ..., a_k: (u_k, v_k).

**Class.** For a pair put H = u/v, B = 4u''/v, J = 4v''/v, P = 16u''''/v. The pair is
- *positive* if u, v > 0;
- *basic* if also H' < 0 and B' > 0 on t > 0;
- *full* if also J' > 0, d^2H/dB^2 > 0, d^2J/dB^2 > 0 on t > 0.

> **Conjecture P(k).** For every choice of anchors a_1, ..., a_k > 0 (coincidences included), the k-th canonical
> reduced pair (u_k, v_k) of (C, kappa) is full.

**Gates from P(k) to P(k+1)** (PR #54 eqs. (3), (4), (14)):
- G1(k), H-source sign: W_3(B_k', J_k', -H_k') > 0 on t > 0;
- G2(k), P-source sign: W_3(B_k', J_k', P_k') > 0 on t > 0;
- G3(k+1), origin curvature: J_{k+1}''(0) > 0.
G1, G2 give the two convexities of the next pair; G3 starts J_{k+1}' > 0, which convexity propagates. Each gate is an
inequality in k (or k+1) anchors and one spatial variable.

**Chain (PROVED in the PRs as abstract implications).** full at level k => basic at level k+1 => positive at
level k+2 => every (k+3)-node real Pick matrix of L is positive definite. Hence P(k) for all k => all-order Pick
positivity => RH (Pick-Nevanlinna; PR #54 section 6).

**Status.** P(0): PR #51. P(1): PR #52. P(2): PR #53. P(3): PR #55 (six nodes). P(k), k >= 4: OPEN. Each proved
level is a separate interval-arithmetic certificate on theta moments plus an analytic tail; there is no inductive
step. PR #52 shows the class is not invariant for general kernels (explicit counterexample), and PR #54 section 5
shows stronger source hierarchies fail at large anchors.

P(k) is stronger than (k+3)-node Pick positivity: it asserts pointwise signs of time-domain kernels, while the Pick
pivots only need R_k(x) > 0 at real x. Section 2.3 shows the gap is real.

## 2. Davenport-Heilbronn

DH: f = ((1 - i kap)/2) L(s, chi) + c.c., chi mod 5, chi(2) = i, kap = (sqrt(10 - 2 sqrt 5) - 2)/(sqrt 5 - 1).
Lambda_DH(s) = (5/pi)^{s/2} Gamma((s+1)/2) f(s) = Lambda_DH(1-s). Coefficients c_n = (1, kap, -kap, -1, 0) mod 5.
Theta kernel: Lambda_DH(1/2+z) = int kappa_DH(t) e^{zt/2} dt with
kappa_DH(t) = sqrt(pi/5) e^{3t/4} sum_n c_n n e^{-pi n^2 e^t / 5}; it is positive and even.

### 2.1 The Prop. 5 order for the first off-line zero

Zero: rho_0 = 0.80851718245663738555 + 85.699348485377592172 i (centered: delta = 0.30852, gamma_0 = 85.6993).
MEASURED: 43 sign changes of Lambda_DH(1/2+it) on 0 < t < 85.7 (main term 43.9); next on-line zeros at 87.647,
89.439.

Prop. 5 (PR #50 `theta_rational_residual` section 5) builds V_M = P_M(z)/(z+a)^M with P_M interpolating
+1, +1, -1, -1 on the quartet and 0 on all other zeros with |Im| <= H, where H > r_* = max |a + rho| over the quartet.
Its requirements, for a = 1:
- M > d(H) = number of distinct centered zeros with |Im| <= H. For 85.72 < H < 87.6: d = 2*43 + 4 = 90. So M >= 91.
- Tail: C^2 H^{2d} (r_*/H)^{2M} sum_{|gamma|>H} gamma^{-2} < 4. With H < 87.6 the ratio r_*/H > 0.978 and
  H^{2d} = e^{802}, giving M of order 2*10^4. With H = 2 r_*: d is about 216, H^{2d} = e^{2224}, M of order
  1.6*10^3 (constant C not evaluated). ARGUED, from the bound as written.

So Prop. 5 is constructive but its order is 10^3-10^4 for this zero. The sharp order for the same test class
(all rational V with a single pole of order M at -a, i.e. M nodes merged at a) is computed next.

### 2.2 Sharp confluent order: N*(DH) = 149

The test class of Prop. 5 in the limit eps -> 0 is the confluent (Taylor) Pick form at node a. Under
zeta = (z - a)/(z + a), with G_a(zeta) = L(a(1+zeta)/(1-zeta)) = c_0 + 2 sum_{k>=1} c_k zeta^k, the order-N confluent
Pick matrix at a is congruent to the Toeplitz matrix T_N = [c_{|i-j|}]_{i,j<N} (CLASSICAL: Caratheodory-Toeplitz;
the congruence is 1 - zeta omega = 2a(x+y)/((x+a)(y+a))). T_N is PSD for all N iff L is positive-real on Re z > 0.
An indefinite T_N gives indefinite N-node Pick matrices with distinct nodes near a (the confluent form is the limit
of the distinct-node forms under a triangular congruence; a strictly negative direction persists).

Method (`toep.py`, `toep2.py`, `cert.py`): Arb power series of log Lambda in zeta (Hurwitz zeta series for DH),
Levinson recursion, first k with 1 - alpha_k^2 <= 0 gives N* = k + 1. The recursion is run on midpoints at two
precisions (6000 and 12000 bits) and compared.

| function | node a | orders tested | first indefinite order |
|---|---|---|---|
| DH | 0.01 | 2..171 | **149** |
| DH | 0.1 | 2..221 | **149** |
| DH | 1 | 2..221 | **149** |
| DH | 3 | 2..171 | **149** |
| DH | 10 | 2..221 | 150 |
| DH | 40 | 2..221 | 164 |
| DH | 86 | 2..221 | 210 |
| zeta (control) | 1, 10 | 2..221 | none |
| chi_-4, chi_-8, chi_-11 (control, `toep_chi.py`) | 1 | 2..151 | none |

All runs: the two precisions agree to relative 1e-6 at every k. At a = 1: 1 - alpha_147^2 = +8.44e-5,
1 - alpha_148^2 = -3.28e-5.

**Certificate (CERTIFIED, `cert.py`).** At a = 1, with w the dyadic rounding of the order-148 Levinson predictor and
c_k as Arb balls (relative radius below 1e-3500):

    w^T T_149 w = [-7.93581794526e-480 +/- 3.30e-492] < 0.

So the 149-jet Pick form of DH at a = 1 has a negative direction, and some 149-node real Pick matrix with nodes
near 1 is indefinite. The same vector construction one order lower gives +2.42e-475 (not a PSD proof; the PSD claim
for orders <= 148 at these nodes is MEASURED).

Consequences:
- N*(DH) <= 149, certified. The minimum over *all* node configurations is not determined; nested nodes in [0.01, 0.5] pass to 100 (euler/RESULT.md), and four
  confluent nodes in [0.01, 3] give exactly 149.
- N* is about 3.3 x (number of zeros below the off-line pair, 44 or 45). The planted-twin data in euler/RESULT.md
  (zeta, gamma = 77.14, 20 zeros below, N* = 81) gives 4.0. So N*(gamma, delta) scales like a small multiple of
  N(gamma), i.e. gamma log gamma, with weak delta dependence (MEASURED, two families).
- Since Pick order k+3 follows from P(k): **P(k) is false for DH for some k <= 146.**

### 2.3 Which theta gates DH passes

`gates.py` implements the canonical reduction in the time domain (grid uniform in e^t, cumulative Simpson, exact
jets through the ODE) and evaluates the seven signs of the full class at each level. Validation: for xi all seven
signs hold at levels 0-3 for 80 random anchor tuples in [0.05, 4], as the PRs prove. float64 only; anchors above
about 10 and the far spatial tail are not reliable (for xi the code reports failures there that contradict PR #52),
so results are restricted to anchors in [0.05, 4] and t <= 1.5 (xi), t <= 3.0 (DH).

| function | level 0 | level 1 | levels 2-3 | levels 4-5 |
|---|---|---|---|---|
| xi | pass | pass | pass | pass (80/80) |
| DH | **J' > 0 fails** near t = 0 | pass | pass | pass (80/80; isolated failures only at the edge t ~ 2.9-3.0) |
| chi_5 | pass | pass | pass | pass (edge only) |
| chi_-3 | d^2J/dB^2 fails | pass | pass | pass |
| chi_-4 | J' fails | pass | pass | pass |
| chi_8 | both convexities fail | d^2J/dB^2 fails | pass | pass |
| chi_-7 | J', both convexities fail | d^2J/dB^2 fails | pass | pass |
| chi_-8, chi_-11 | B', J' fail | J' fails | pass | pass |

(40 anchor tuples each for the characters; `gates_chi.py`.) Direct mpmath check at 40 digits, with J = 4 kappa''/kappa:
J''(0) = -4.6443 (DH), -4.0795 (chi_-4), -20.84 (chi_-8), -106.95 (chi_-11), -7.74 (chi_-15); +19.84 (chi_-3),
+6.49 (chi_5), +3.49 (chi_8), +15.32 (chi_-7).

Readings (MEASURED):
- DH fails P(0) through a single gate, J_0' > 0. This is a shape property of its theta kernel at the symmetric
  point. It is not the off-line zero: chi_-4, with an Euler product, fails the same gate with a similar value.
- From level 1 on, DH satisfies the full class at every tested moderate anchor through level 5. An induction started
  at level 1 sees no difference between xi and DH through level 5. The first level at which DH fails for
  moderate anchors lies in 6..146.
- The gates are not necessary for Pick positivity: chi_-8 and chi_-11 fail the basic gate B_0' > 0 (kappa has a
  local minimum at 0) and still pass the confluent Toeplitz test (table in 2.2).
- So "full class" is not implied by Euler product + functional equation, and its failure does not detect off-line
  zeros. It is a sufficient condition special to certain theta kernels (xi, chi_5).

### 2.4 Each finite order is open

Unit changes in one prime weight are detected at very low order, because they break the functional equation
(`perturb.py`, node a = 1, zeta with Lambda(n_0) -> Lambda(n_0) + eps; MEASURED, precision-stable):

| n_0 | eps = +1e-3 | +1e-6 | -1e-2 | -1e-4 |
|---|---|---|---|---|
| 2 | order 2 | 3 | 9 | 13 |
| 3 | 2 | 3 | 6 | 9 |
| 101 | 3 | 4 | 4 | 4 |

DH keeps the functional equation and survives to 148. The low orders test the functional equation to high
accuracy; they do not test zero location. This agrees with euler/RESULT.md section 2.1.

## 3. The arithmetic gate

### 3.1 Lemma A (exact form of the order-N gate at a node a > 1/2)

For real b_i and rates x_i > 1/2 put v(t) = sum b_i e^{-x_i t} on t >= 0 and C_v(l) = int_0^inf v(t) v(t+l) dt.
Using 1/(x_i + x_j) int-representations term by term in
L(x) = 1/(x - 1/2) + 1/(x + 1/2) + (1/2)(psi(x/2 + 1/4) - log pi) - sum_n Lambda(n) n^{-1/2-x}:

    Q_L(v) = sum b_i b_j (L(x_i) + L(x_j))/(x_i + x_j)
           = W_inf(v) - 2 int_1^inf y^{-1/2} C_v(log y) d(psi(y) - y),                              (A1)

where psi(y) = sum_{n<=y} Lambda(n) and W_inf(v) = 2 int_0^inf e^{-l/2} C_v(l) dl + (gamma-factor form), both
explicit and independent of primes. (PROVED: int_0^inf e^{-x_j t} e^{-x_i (t+l)} dt = e^{-x_i l}/(x_i + x_j); the
pole term is the same computation with n^{-1/2} d n replaced by y^{-1/2} dy. It matches PR #50 eq. (6.1).)

Merging the nodes at a gives v(t) = p(t) e^{-at}, deg p < N, and C_v(l) = e^{-al} q_p(l) with deg q_p < N.

> **Lemma A(a, N).** For every real polynomial p of degree < N,
>
>     2 int_1^inf y^{-1/2-a} q_p(log y) d(psi(y) - y)  <=  W_inf(p e^{-a t}).
>
> In Laguerre form: with l_k = L_k^{(-1)}, n^{-z} = n^{-a} sum_k l_k(2a log n) zeta^k, the Toeplitz entries are
> c_k(a) = g_k(a) - (1/2)^{[k>0]} sum_n Lambda(n) n^{-1/2-a} l_k(2a log n), g_k archimedean + pole.

Facts:
- (CLASSICAL) For any fixed a > 1/2: Lemma A(a, N) for all N <=> RH. (Caratheodory-Toeplitz + section 2.2.)
- (PROVED in pick/NEXT_STAGE.md by verified height) Lemma A(a, N) holds for N <= 12, all a.
- The weight l_k(2a log n) n^{-a} oscillates for log n up to about 2k/a and then decays. Order N therefore tests
  psi(y) - y against N oscillating modes on y up to about e^{2N/a} (ARGUED). All orders means all scales.
- The prime measure Lambda(n) n^{-1/2} delta_{log n} is nonnegative, and it enters (A1) with a minus sign against
  the positive-definite, sign-changing function C_v. Lambda >= 0 gives a sign only on the cone v >= 0, where it is
  the wrong sign. An upper bound for the prime integral on oscillating C_v is a cancellation statement.

### 3.2 Theorem R: the gate has zero tolerance in every prime weight (PROVED)

**Theorem R.** Let eta: {2, 3, ...} -> R be nonzero with sum |eta(n)| n^{-1/2} < inf, and let
L_eta(z) = L(z) - sum_n eta(n) n^{-1/2-z} (the function obtained by replacing Lambda with Lambda + eta, archimedean
side unchanged). Then for every open interval I in (0, inf) there are finitely many distinct nodes in I whose Pick
matrix for L_eta is not positive semidefinite. Equivalently Lemma A(a, N) fails for Lambda + eta at some finite N,
for every a.

*Proof.* Suppose every finite Pick matrix of L_eta with nodes in I is PSD. By Pick-Nevanlinna (the same step as
PR #54 section 6), L_eta restricted to I extends to a holomorphic function with nonnegative real part on Re z > 0.
L_eta is meromorphic there and agrees with the extension on I, so L_eta is holomorphic with Re L_eta >= 0 on
Re z > 0. F(iy) = xi(1/2 + iy) is real, so F'(iy) is purely imaginary and Re L(iy) = 0 wherever F(iy) != 0. The
Dirichlet series of eta converges absolutely on Re z >= 0, so L_eta is continuous up to those boundary points and

    Re L_eta(iy) = - g(y),   g(y) = sum_n eta(n) n^{-1/2} cos(y log n).

g is a uniformly almost periodic function with absolutely convergent Bohr-Fourier series, no zero frequency
(log n > 0), and at least one nonzero coefficient. So g has mean value 0 and is not identically 0; hence g > 0 on a
nonempty open set, which contains a point y_0 with F(i y_0) != 0. Then Re L_eta(i y_0) < 0, and by continuity
Re L_eta < 0 at some z with Re z > 0. Contradiction. QED

No hypothesis on zeros is used. If RH fails the conclusion also holds for eta = 0.

**Corollary (refutation of the soft route).** Let S be any set of properties of an arithmetic function that holds
for Lambda and for Lambda + eta for at least one admissible eta != 0. Then S does not imply Lemma A for all N.
Examples of such S: Lambda(n) >= 0; 0 <= Lambda(n) <= log n; support on prime powers; psi(y) = y + O(y^theta) for
any fixed theta > 0; all of these together (take eta = -eps at n = 2). So the gate at general k cannot be proved
from Lambda(n) >= 0 and the Dirichlet series of the theta-side object by any argument that does not use the exact
value of every prime weight.

What the proof of Theorem R shows about the needed input: all-order positivity forces Re L = 0 almost everywhere
on the imaginary axis, i.e. the exact functional equation. That identity is where every prime weight is fixed
(Hamburger: zeta is the only ordinary Dirichlet series with this functional equation). The Euler product is not
used in Theorem R and is not detected by it: DH satisfies the hypothesis of exact functional equation and passes
orders up to 148.

### 3.3 What would distinguish xi from DH

For a >= 1 both -zeta'/zeta and -f_DH'/f_DH have absolutely convergent Dirichlet series at s = 1/2 + a
(sum_{n>=2} |c_n| n^{-3/2} < 1 for DH, MEASURED: the sum is 0.738). Lemma A(a, N) is then the same
inequality for two coefficient sequences with the same kind of archimedean side:

| | zeta | DH |
|---|---|---|
| Lambda_F(n) | >= 0, <= log n, on prime powers | real, signed, on all n prime to 5, unbounded |
| exact functional equation | yes | yes |
| Lemma A(1, N), N <= 148 | true (N <= 12 PROVED; to 221 MEASURED) | true (MEASURED) |
| Lemma A(1, 149) | true (MEASURED) | false (CERTIFIED) |

The sharpest lemma that separates them, in the form the lane needs:

> **Lemma E (OPEN; equivalent to RH).** Let Lambda be the von Mangoldt function. For every N and every real
> polynomial p of degree < N, inequality A(1, N) holds.

The only structural inputs available for it are (i) the exact functional equation (shared with DH) and
(ii) Lambda = sum over prime powers of log p, i.e. complete multiplicativity. Positivity of Lambda alone is ruled
out by Theorem R. I found no way to use (ii) in (A1): the polynomial weights q_p(log y) do not factor over primes,
and the Laguerre modes at order N couple all prime powers up to e^{2N/a}. No proof of Lemma E, and no proof of
A(1, N) for any N beyond the verified-height range, is given here.

## 4. Does the induction scheme survive?

- The task's step (4) asks whether the gates are provable for all k by one soft method for both xi and DH. They are
  not: DH fails Pick positivity at order 149, so it fails P(k) by level 146, and any correct proof of a level
  k >= 146 must fail for DH. The scheme is not refuted by DH.
- The scheme is also not supported by DH. Through level 5 (moderate anchors) DH passes every gate from level 1 on.
  The methods that prove P(1), P(2), P(3) for xi are interval certificates on theta moments with analytic tails.
  They use no arithmetic input, and the same kind of certificate would be expected to prove levels 1-5 for DH
  (not run here; the float64 scan found no failing point).
- P(k) is strictly stronger than Pick positivity and is not an Euler-product property (section 2.3). A proof of
  P(k) for all k would need a property of the Jacobi theta kernel that fails for kappa_DH at some level in 6..146
  and is unrelated to the level-0 shape gate that DH (and chi_-4) fail. No such property is identified in the PRs
  or here.
- Whether P(k) is true for xi at k >= 4 is OPEN. MEASURED: true at levels 4 and 5 for 80 anchor tuples in
  [0.05, 4]. Nothing excludes that P(k) fails for xi at some larger k or larger anchors while Pick positivity
  still holds; chi_-8 and chi_-11 are examples of that pattern at level 0.
- Cost: P(k) is an inequality in k anchors and one spatial variable. Without a dimension reduction (PR #54 found
  one for the origin gate only) the per-level certificate grows with k, and by section 2.2 at least 146 levels
  would be needed before the statement excludes anything DH does not also satisfy at confluent nodes.

## 5. DH control summary

| Step | xi | DH | Uses Euler product? |
|---|---|---|---|
| P(0) | proved | fails (J_0' > 0) | no; chi_-4 fails it too |
| P(1)..P(5), anchors in [0.05, 4] | proved to 3, measured 4-5 | measured true | no |
| Pick order <= 148 at confluent nodes 0.01-1 | measured true (proved <= 12) | measured true | no |
| Pick order 149 at a = 1 | measured true | certified false | yes, by elimination; mechanism not located |
| Theorem R | applies | applies (same proof with DH's FE) | no |

## 6. Three weakest steps

1. **Gate numerics are float64.** Section 2.3 is a grid computation without error bounds, restricted to anchors in
   [0.05, 4] and a truncated spatial range. Large anchors are untested for DH. The level-0 values J''(0) are
   confirmed at 40 digits; the level 1-5 "pass" entries are not certified, and the edge failures at t ~ 3 for DH and
   the characters are attributed to tail cancellation without proof.
2. **N*(DH) = 149 is certified only as an upper bound.** Positivity at orders <= 148 is measured (two precisions) at
   seven confluent nodes, and to 100 on one nested family. A different node configuration could fail earlier.
   The certificate relies on python-flint's Hurwitz-zeta power series enclosures.
3. **Section 3.3 is a negative finding, not a theorem.** "No way to use multiplicativity in (A1)" is the absence of
   an argument. Theorem R removes positivity-only proofs; it does not show that Lemma E needs more than the
   functional equation plus multiplicativity, and it gives no route to Lemma E. The scale estimate e^{2N/a} and the
   Prop. 5 orders (10^3-10^4) are order-of-magnitude arguments.

## Files

`toep.py`, `toep2.py` (Toeplitz/Levinson), `cert.py` (Arb certificate), `gates.py`, `gatescan.py`, `gates_chi.py`
(theta gates), `perturb.py` (prime-weight perturbation), `toep_chi.py` (character control), `scan_dh_220.txt`,
`scan_dh_extra.txt`, `perturb_a1.txt` (outputs). Interpreter: `.venv-arb/bin/python -I` (python-flint 0.9.0,
mpmath 1.3.0, numpy 2.5.3, scipy 1.18.1). Each run under 4 minutes, single process.
