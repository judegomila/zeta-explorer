# r2-pick-euler-entry: where the theta gates first separate xi from its twins

Working note, 2026-11-16. Scope: `tmp/research-2026-11-16/push/r2-pick-euler-entry/` and
`~/rh-push/r2-pick-euler-entry/` on the motherbox. Nothing committed, pushed or commented; PRs read from local
read-only refs `refs/pr/50..55`. No RH claim.

Labels: PROVED (argument given here), CLASSICAL, CERTIFIED (sign of an Arb ball, python-flint 0.9.0),
GRID-CERTIFIED (every sampled sign is CERTIFIED, the statement between sample points is not covered),
MEASURED, OPEN.

## Verdict (precise obstruction)

1. **Referee of pick-induction.** Theorem R is correct as stated (re-derived, section 1.2). The order-149 result is
   reproduced by two independent computations and is now two-sided at the confluent node: for DH at
   a = 1/10, 1, 3 the confluent real-Pick form is positive definite for every order <= 148 and indefinite at
   order 149 (CERTIFIED, section 1.3). The gate definitions match the PR text (section 1.1). Table 2.4 of
   pick-induction is reproduced with certified signs (section 1.4).
2. **Location of the first gate failure.** At confluent anchors a = 1/10, 1, 3, DH passes all seven full-class
   signs at levels 1..145 at every sampled t, and fails at level **k_DH(a) = 146** for all three anchors. The
   failing gate is d^2H/dB^2 > 0, at small t (GRID-CERTIFIED pass, CERTIFIED failure; section 3). So the claim
   "DH violates P(k) for some k <= 146" holds with k = 146, and the float64 claim "DH passes levels 1-5" extends
   to levels 1-145 at confluent anchors.
3. **What the failing level is.** The canonical reduction is Richards' transformation, and the confluent Pick
   order N is positive definite iff the first N Richards parameters r_0..r_{N-1} are positive (Lemma Ri, PROVED,
   section 1.3). In every tested family the first gate failure sits 2 or 3 levels before the first negative r_j:
   DH 146 / 148, zeta + quartet at 85.7: 98 / 100, zeta + quartet at 30: 17 / 20, T-NR: 0 / 3. Between the level-0
   shape gate and that point no gate fails. The gates therefore carry no information beyond the sign pattern
   of the r_j, which is a function of the zero set alone (Hadamard).
4. **Not height alone.** A quartet at the same point (gamma, delta) = (85.6993, 0.3085) gives first indefinite
   order 101 on zeta, 157 on L(s, chi_-4) and 149 for DH itself. The order scales with the number n of on-line
   zeros below the quartet, 3.5 to 4.4 orders per zero, with a secondary dependence on delta and on local
   spacing. The ff-transplant law 4n+3 fits the zeta "move" twins (7, 11, 15, 23, 35, 51 against certified
   7, 12, 15, 24, 34, 49) and overestimates DH by 26 orders (175 against 149).
5. **Euler-blindness of the failing level.** L(s, chi_-4) times a planted quartet (no Euler product, built on an
   Euler-product base with 41 zeros below) fails at order 157; DH (no Euler product, 43 zeros below) at 149; T-NR
   (Euler product, off-line zero at height 2.86 with no zero below) at order 4. The failing level follows the
   zero configuration, not the presence of an Euler product.
6. **Weakest separating property (section 5).** Among properties of Lambda that are consistent with Theorem R, the
   weakest one that separates zeta from all tested twins is the conjunction: exact functional equation,
   support on prime powers, and |Lambda_F(p^k)| <= d log p (unit local roots). Each twin drops exactly one
   clause. That conjunction is the degree-1 Selberg axiom set, so the separation is the statement of GRH for that
   class and gives no new lever. No property of Lambda weaker than "the zeros below the failing height are on
   the line" was found to be used by any gate.

No bound moves. The lane's gates up to level N are, at confluent anchors, restatements of the sign of the first
N + 3 Richards parameters, and those are zero-configuration statements with a horizon that grows linearly in the
number of zeros covered.

## 0. Plan: what is new relative to the atlas, the walls and the sibling notes

| Item | Overlap | New here |
|---|---|---|
| pick-induction 2.2: DH first indefinite order 149 (certified upper bound, positivity below measured) | same number | two-sided certificate at three anchors; second independent input (theta-kernel moments, no zeta routines); Lemma Ri |
| pick-induction 2.3: DH passes gates at levels 1-5 (float64, random anchors) | same gates | ball-arithmetic evaluation at arbitrary depth; levels 1-145 pass, 146 fails |
| euler 2.2, ff-transplant 5: horizon N* about 4n+3 | same law | certified N* on 30 twins; law fails off the zeta family |
| ideation-panel 0.1: T-NR twin | unused control | run: fails at level 0 and order 4 |
| Atlas: all-scale signed estimate missing; DH wall; verified height | not circumvented | the gate ladder is placed on the verified-height side, with the scale (orders per zero) measured |

Not attempted: a proof of P(k) for any k >= 4 on t > 0, or of any Pick order beyond pick/NEXT_STAGE.

## 1. Part 1: referee of the pick-induction claims

### 1.1 Gate definitions against the PR text

Read: PR 50 `theta_second_kernel_structure_20261109.md` section 7 (eqs. (29)-(34)); PR 54
`theta_third_gate_synthesis_20261111.md` sections 1, 2, 4, 6; PR 55 decision note
`2026-11-11-theta-third-preservation.md`.

- Reduction. PR 54 eq. (1): n + a b = u, a n + 4 b'' = R(a) v, R(z) = z Lu(z)/Lv(z). This is the
  pick-induction form 4b'' - a^2 b = r v - a u, n = u - a b. CONFIRMED.
- Class. PR 54 eq. (2): H' < 0, B' > 0, J' > 0, d^2H/dB^2 > 0, d^2J/dB^2 > 0 with H = u/v, B = 4u''/v,
  J = 4v''/v. With u, v > 0 these are the "seven gates". CONFIRMED. The convexities are evaluated as
  H''B' - H'B'' > 0 and J''B' - J'B'' > 0 (equal to d^2/dB^2 times B'^3).
- Source gates G1, G2 (PR 54 eq. (3)) and origin gate G3 (eq. (4)) are sufficient conditions for the next
  level's convexities and J' > 0. Neither pick-induction nor this note evaluates W_3 directly; both evaluate the
  class signs of each level, which is what P(k) asserts.
- Chain. PR 50 eqs. (31), (34): basic at one level gives positive kernels at the next. PR 54 section 6 table:
  "R0 full -> ... -> R3 full -> R4 basic -> R5 positive, giving six nodes", i.e. full at k gives Pick order k+3.
  CONFIRMED. Status P(3): PR 55. CONFIRMED.
- One correction of wording: the uniform reduction is not new to the lane. With R_1 = z Lb/Ln one has
  R_1(z) = (r z - a R(z))/(z R(z) - a r), which is Richards' transformation (P. I. Richards, Duke Math. J. 14
  (1947)); r_k = R_k(a) are the Richards parameters. CLASSICAL.

### 1.2 Theorem R (re-derived)

Statement: eta real, nonzero, sum |eta(n)| n^{-1/2} finite, L_eta = L - sum eta(n) n^{-1/2-z}. Then on every
interval I in (0, inf) some finite Pick matrix of L_eta is not PSD.

Check of each step.
1. If all finite Pick matrices on I are PSD, the kernel (L_eta(x)+L_eta(y))/(x+y) is PSD on I, so there is a
   holomorphic G on Re z > 0 with Re G >= 0 and G = L_eta on I (Pick-Nevanlinna on a set with an accumulation
   point). L_eta is meromorphic on Re z > 0 (the Dirichlet series converges absolutely on Re z >= 0), so
   L_eta = G there. CLASSICAL, correct.
2. F(iy) = xi(1/2+iy) is real, so F'(iy) is imaginary and Re L(iy) = 0 off the zeros of F. Correct.
3. L_eta is continuous up to iy_0 when F(iy_0) != 0, with Re L_eta(iy_0) = -g(y_0),
   g(y) = sum eta(n) n^{-1/2} cos(y log n). Correct.
4. g is uniformly almost periodic, mean 0, not identically 0 (distinct frequencies log n; uniqueness of
   Bohr-Fourier coefficients). A continuous almost periodic g <= 0 with mean 0 vanishes identically, so g > 0
   on an open set; the zeros of F(iy) are discrete. Correct.
5. Re L_eta < 0 near iy_0 inside Re z > 0. Contradiction. Correct.

Verdict: PROVED. Two scope remarks. (a) The confluent form ("Lemma A(a, N) fails at some N for every a > 0")
uses Caratheodory-Toeplitz at one node instead of Pick on an interval; the rest is unchanged. (b) Theorem R
concerns perturbations that break the functional equation. None of the twins of this note is in its scope: DH,
T-NR and the planted-quartet twins keep an exact functional equation, and their Lambda differs from von
Mangoldt by a sequence that is not absolutely summable against n^{-1/2} (or is not a Dirichlet series at all).
Theorem R and the DH wall are independent obstructions.

### 1.3 Order 149 with independent code

**Lemma Ri (PROVED).** Let R be real-analytic near a > 0, r = R(a) != 0, R(a) + a R'(a) != 0, and
R_1(z) = (r z - a R)/(z R - a r). Then, with K_f(x,y) = (f(x)+f(y))/(x+y),

    K_R(x,y) = r a g(x) g(y) + r h(x) h(y) K_{R_1}(x,y),
    g = (1+R_1)/(a + z R_1),  h = (z-a)/(a + z R_1).

Proof: R = r (z + a R_1)/(a + z R_1); expand and use xy + a^2 = (x-a)(y-a) + a(x+y). Checked symbolically
(`richards_identity.py`, residual 0). Consequence: g(a) = 1/a != 0 and h vanishes to first order at a, so the
N-jet matrix P_N(R) of K_R at (a,a) equals r (a v v^T + T (0 + P_{N-1}(R_1)) T^T) with v_0 != 0 and T lower
triangular invertible. Hence P_N(R) is positive definite iff r > 0 and P_{N-1}(R_1) is positive definite, and by
induction

    P_N(R) positive definite  <=>  r_0, ..., r_{N-1} > 0.

If r_0..r_{j-1} > 0 and r_j < 0, P_{j+1}(R) has a negative direction (last pivot is a positive multiple of
r_0...r_j). K_{1/R} = K_R/(R(x)R(y)), so the Type I / Type II alternation of PR 50 does not change signs.

**Computation** (`rchain.py`). r_k is read off the Taylor series at z = a of
N_u = D^k Lu_k, N_v = D^k Lv_k (D = z^2 - a^2): r_k = a [x^k]N_u/[x^k]N_v, with the recursion
N_b = r N_v - a N_u, N_n = D N_u - a N_b. All arithmetic is Arb; the coefficients below order k+1, which vanish
identically, are set to exact zero. This is a different algorithm from pick-induction (`toep.py`: Levinson on
the Toeplitz form in zeta = (z-a)/(z+a)).

| input for the jets of F_DH at a | a | precision | result |
|---|---|---|---|
| Hurwitz zeta series (python-flint `arb_series.zeta`) | 1/10 | 12000 bits | r_0..r_147 > 0, r_148 = -8.9179e-8 < 0 |
| same | 1 | 12000 | r_0..r_147 > 0, r_148 = -8.20685e-6 < 0 |
| same | 3 | 12000 | r_0..r_147 > 0, r_148 = -2.78052e-5 < 0 |
| theta-kernel moments only (section 2; no zeta or Hurwitz routine) | 1 | 9000 | r_0..r_147 > 0, r_148 = -8.20685e-6 < 0 |

All 149 signs are CERTIFIED in each row (no undecided ball). The two inputs give jets of F_DH with constant
ratio 1.2615662610100800241 (a normalisation). Further negative parameters: r_150, r_217, r_219.

So: N*(DH, a) = 149 for a = 1/10, 1, 3, now as an equality at the confluent node (pick-induction had the upper
bound certified and the lower bound measured). The minimum over all node configurations is still not
determined. Controls: zeta and chi_-4 have r_0..r_229 > 0 at the three anchors (CERTIFIED).

### 1.4 Other claims

- "Real primitive characters with Euler products also fail level-0 or level-1 gates": chi_-4 fails J_0' > 0 at
  t = 0.02, 0.3 at all three anchors (CERTIFIED) and passes levels 1..152 at a = 1 and 1..40 at a = 1/10, 3
  (GRID-CERTIFIED). Other characters not re-run.
- "DH passes all seven gates at levels 1-5 (float64)": at confluent anchors the signs are positive at every
  sampled t for levels 1..145 (section 3). Non-confluent anchor tuples are not covered by my code.
- Table 2.4 (zeta with Lambda(n_0) -> Lambda(n_0) + eps, a = 1): all twelve entries reproduced with certified
  signs by `perturb_r.py` (first indefinite orders 2, 3, 9, 13 / 2, 3, 6, 9 / 3, 4, 4, 4 for n_0 = 2, 3, 101 and
  eps = 1e-3, 1e-6, -1e-2, -1e-4).
- "DH violates P(k) for some k <= 146": CONFIRMED with k = 146 (section 3).

## 2. Method for the gates (Part 2)

Notation: Lf(z) = int f(t) e^{zt/2} dt, p = z/2, D = d/dt. Then L(f') = -p Lf and z^2 corresponds to 4D^2.

**Basis.** Phi_i = (4D^2 - a^2)^{-i} kappa and Psi_i = (4D^2 - a^2)^{-i} C (decaying solutions), so
L Phi_i = F/(z^2-a^2)^i and L Psi_i = (F'/z)/(z^2-a^2)^i. At a confluent anchor every level pair is a finite
combination

    u_k = sum_i x_{k,i} Psi_i + y_{k,i} Phi_i,      v_k likewise,

with the two-term recursion b = shift(r v - a u), n = u - a b on the coefficient vectors. For i <= 0 the basis
functions are differential polynomials in kappa and C. Planted-quartet twins are the same basis with the
initial vectors of Q(4D^2) C + 2Q'(4D^2) kappa and Q(4D^2) kappa; T-NR is the kernel
c kappa(t) + kappa(t + 2 log q) + kappa(t - 2 log q).

**One-sided representation (PROVED).** For i >= 1 the decaying solution equals the one-sided convolution with
the forward fundamental solution: both solve (4D^2-a^2)^i y = kappa and decay faster than any exponential at
+inf, and a homogeneous solution with that decay is zero. Hence for a symbol with poles at p = +-a/2 and 0,

    ((p - beta)^{-m} f)(t) = I^beta_{m-1}[f](t) = int_0^inf tau^{m-1}/(m-1)! e^{beta tau} f(t+tau) dtau.

Two evaluation paths are implemented.
- `pf`: partial fractions at +-a/2 (exact rational coefficients), weighted moments I^{+-a/2}_m, m <= k.
- `ser`: expansion (p^2 - a^2/4)^{-i} = sum_m C(m+i-1, m) (a/2)^{2m} p^{-2i-2m}, unweighted moments I^0_j only,
  tail bounded by |I^0_j| <= rho^{-j} int e^{rho tau} kappa_abs(t+tau) dtau with rho = 128.
Higher jets come from 4 Phi_i'' = a^2 Phi_i + Phi_{i-1}.

**Moments (exact formula).** For a theta term e^{al0 s} y^j e^{-y}, y = lam e^s, with X = e^t, z = lam X,
c0 = beta + al0 + j:

    I^beta_m = lam^j e^{-beta t} [eps^m] ( e^{-eps(t + log lam)} lam^{-c0} Gamma(c0+eps)
                                           - X^{c0} e^{-z} sum_n z^n / prod_{i<=n} (c0+i+eps) ).

The Gamma series is `arb_series.gamma`. The Kummer sum is truncated with a majorant bound
(coefficientwise |1/(c+eps)| <= 1/(|c| - eps), Cauchy estimate on a circle of radius rho_0, geometric ratio
<= 1/2 after n > 2z). The theta sum over n is truncated with the bound u^m/m! <= e^u. Each bound is added to
the ball radius.

**Checks.**
- Moments and kernel jets against mpmath quadrature at 25 digits (zeta and DH, t = 0.3, 1.5, -1.0;
  `val1.py`): agreement to all printed digits.
- Level 1 for zeta at a = 1 against direct quadrature of the reduction integral (`val2.py`): r_0 = L(1) =
  0.0461359280604625754; u_1(0.1) = 3.56630988e-5, v_1(0.1) = 0.02094116486, u_1(1) = 1.378986473e-6,
  v_1(1) = 0.001163924518; all digits agree.
- `pf` against `ser`: all basis jets overlap as balls (`xcheck.py`; DH a = 1, zeta a = 1/10, chi_-4 a = 3,
  zeta + quartet a = 1). The DH table at a = 1/10 is computed by `ser`, at a = 1, 3 by `pf`, with the same
  result.
- Known facts reproduced: xi passes levels 0-3 (PR 51-53, 55); DH fails only J_0' > 0 at level 0
  (pick-induction 2.3).

## 3. Certified tables (Part 2)

Confluent anchors (a, a, ..., a). "pass" means all seven signs are certified positive at every sampled t;
a failing entry is a certified negative sign. No sign in any table below is undecided. Grids:
G8 = {0.02, 0.1, 0.3, 0.6, 1, 1.5, 2, 3}, G4 = {0.02, 0.3, 1, 2}, G2 = {0.02, 1}. j* is the first index with
r_j < 0 (N* = j* + 1 is the first indefinite confluent Pick order).

| function | a | path, bits | grid | levels run | level 0 | first failing level >= 1 | first failing gate (t) | j* |
|---|---|---|---|---|---|---|---|---|
| DH | 1/10 | ser, 9500 | G4 | 0..152 | J' fails | **146** | d^2H/dB^2 (0.02, 0.3, 1) | 148 |
| DH | 1 | pf, 9000 | G8 | 0..160 | J' fails | **146** | d^2H/dB^2 (0.02..1) | 148 |
| DH | 3 | pf, 7000 | G4 | 0..152 | J' fails | **146** | d^2H/dB^2 (0.02, 0.3) | 148 |
| zeta + quartet (85.6993, 0.30852) | 1/10 | ser, 6000 | G2 | 0..104 | pass | **98** | d^2H/dB^2 (0.02, 1) | 100 |
| same | 1 | pf, 3400 | G4 | 0..104 | pass | **98** | d^2H/dB^2 (0.02, 0.3, 1) | 100 |
| same | 3 | pf, 3400 | G4 | 0..104 | pass | **98** | d^2H/dB^2 (0.02, 0.3, 1) | 100 |
| zeta + quartet (30, 0.3) | 1/10, 1, 3 | pf, 1500-3600 | G8 | 0..26 | pass | **17** | d^2H/dB^2 (0.02, 0.1, 0.3) | 20 |
| T-NR, q = 3, c = 2.2 | 1/10, 1 | pf, 700 | G8 | 0..8 | H' fails | 1 (some sign fails at every level 0..8) | H', B', d^2H/dB^2 | 3 |
| same | 3 | pf, 700 | G8 | 0..8 | H' fails | 1 | H', B', d^2H/dB^2 | 4 |
| L(s, chi_-4) | 1 | pf, 7200 | G4 | 0..152 | J' fails | none | - | none to 229 |
| L(s, chi_-4) | 1/10, 3 | ser / pf | G4 | 0..40 | J' fails | none | - | none to 229 |
| zeta (control) | 1 | pf, 7600 | G4 | 0..152 | pass | none | - | none to 229 |
| zeta (control) | 1/10, 3 | ser / pf | G4 | 0..40 | pass | none | - | none to 229 |

Counts for DH: 8120 (a = 1), 4060 (a = 3), 4060 (a = 1/10) signs at levels 1..145, all certified positive.

Failure sequence, identical in shape for DH and the two zeta twins (a = 1):

| level relative to j* | DH (j* = 148) | zeta + quartet at 85.7 (j* = 100) | zeta + quartet at 30 (j* = 20) |
|---|---|---|---|
| j* - 3 | pass | pass | d^2H/dB^2 fails at t <= 0.3 |
| j* - 2 | d^2H/dB^2 fails at t <= 1 | d^2H/dB^2 fails at t <= 1 | both convexities fail |
| j* - 1 | H' < 0 and both convexities fail | same | same |
| j* | u < 0 at t <= 1.5 | u < 0 on the grid | u < 0 on the grid |
| j* + 1 | u < 0, v < 0 | same | same |

This is the PR chain read backwards (positive at j* needs basic at j* - 1, which needs full at j* - 2). After the
window the signs return: DH passes all seven gates again at levels 151..160 on G8 (r_151..r_216 > 0), the twin
at 30 at levels 23..26.

T-NR: zero of the cosh factor at 0.90375 +- i pi/log 3 (height 2.86), no zeta zero below it. It fails
(u/v)' < 0 at level 0 (its kernel has side lobes at t = +-2 log 3) and positivity at level 2.

Observations on xi (GRID-CERTIFIED, a = 1): all seven signs are positive at levels 0..152 at t in G4. Levels
4..152 are beyond what the PRs prove; this is pointwise evidence for P(k) at one confluent anchor, not a proof.

## 4. Part 3: the failing level against the horizon law

First indefinite confluent order N* = j* + 1 at a = 1 (CERTIFIED signs; `sweep_results.txt`, `rchain_all.log`).
n = number of on-line zero pairs below the quartet.

zeta + added quartet at height gamma:

| gamma | 20 | 30 | 40 | 50 | 60 | 85.6993 |
|---|---|---|---|---|---|---|
| n | 1 | 3 | 6 | 10 | 13 | 23 |
| N*, delta = 0.03 | 18 | 30 | 42 | 57 | 70 | 107 |
| N*, delta = 0.3 (0.3085 at 85.7) | 13 | 21 | 34 | 44 | 65 | 101 |
| N*, delta = 0.45 | 11 | 19 | 32 | 43 | 63 | 99 |
| 4n+3 | 7 | 15 | 27 | 43 | 55 | 95 |

zeta with zero pair number m moved off the line (n = m - 1 below):

| m | 1 | 2 | 3 | 5 | 8 | 12 |
|---|---|---|---|---|---|---|
| N*, delta = 0.3 | 7 | 12 | 15 | 24 | 34 | 49 |
| N*, delta = 0.03 | 10 | 15 | 19 | 27 | 39 | 56 |
| 4m+3 | 7 | 11 | 15 | 23 | 35 | 51 |

In these runs the moved ordinate is a ball of radius 1e-300, so signs beyond index 64 are undecided; every first
negative index is below 56. The delta = 0.3 row equals the nested-node table of euler/RESULT.md 2.2 entry by entry (7, 12, 15, 24, 34, 49), so
on these twins the confluent order and the nested-node order coincide.

Same point (85.6993, 0.3085), different base:

| function | on-line zeros below | N* | N*/n | 4n+3 |
|---|---|---|---|---|
| zeta + quartet | 23 | 101 | 4.39 | 95 |
| chi_-4 + quartet | 41 | 157 (167 at delta = 0.03) | 3.83 | 167 |
| DH (its own first off-line zero) | 43 | 149 | 3.47 | 175 |
| DH + a second quartet at the same point | 43 | 148 | | |
| T-NR (height 2.86) | 0 | 4 (5 at a = 3) | | 3 |

N* is the same at a = 1/10, 1, 3 for DH, both zeta twins and the controls; only T-NR changes by one.

Decision.
- The failing gate level is j* - 2 or j* - 3 (section 3), so it is a function of the Richards sign pattern, hence
  of the Taylor jet of L at a, hence of the zero set (L = sum over zero pairs 2z/(z^2 - w^2), CLASSICAL).
- It is **not** determined by the height of the first off-line zero alone: 101, 157, 149 at one height and one
  delta. It is not determined by n alone either (41 zeros give 157, 43 give 149). The governing quantity is
  the configuration of zeros up to about the off-line height: to first order 3.5-4.4 orders per on-line zero
  below, with delta in [0.03, 0.45] moving N* from 18 to 11 at height 20 and from 107 to 99 at height 85.7
  (MEASURED law, CERTIFIED entries).
- The 4n+3 law of ff-transplant holds within two orders on the zeta "move" family at delta = 0.3,
  underestimates the "add" family by 1 to 10 orders, and overestimates DH by 26 orders. It is a zeta-spacing calibration, not a universal law.
- Reading for the lane: a level-k gate at a confluent anchor does not change sign when an off-line quartet is
  planted above roughly the (k/3.5)-th zero. In that sense the gates up to level k are statements about the
  first k/3.5 to k/4.4 zeros, i.e. verified-zero-count statements. The implication "zeros on the line up to
  height T imply the gates up to level c N(T)" is OPEN; pick/NEXT_STAGE proves the Pick analogue only for
  order <= 12.

## 5. Part 4: the weakest separating property

Theorem R removes every property that survives a change of one weight by an l^1(n^{-1/2}) amount. What remains
has to pin every weight; the exact functional equation does (Hamburger). The tested functions:

| function | exact FE | Lambda_F on prime powers | unit local roots, abs(Lambda_F(p^k)) <= log p | passes at the level where the twins fail |
|---|---|---|---|---|
| zeta | yes | yes | yes | yes (r_j > 0 to 229) |
| L(s, chi_-4) | yes | yes | yes | yes (r_j > 0 to 229) |
| zeta with Lambda(n_0) + eps | no | yes | yes for small eps | no, orders 2-13 |
| DH | yes | no | not applicable | no, order 149 |
| T-NR | yes | yes | no (root of modulus > q^{1/2}; Lambda_F(q^2) < 0) | no, order 4 |
| zeta or chi_-4 times a quartet polynomial | symmetry yes | not a Dirichlet series | not applicable | no, orders 11-167 |

The weakest tested property that holds for zeta and fails for every twin is the conjunction of the three
columns. No two of them suffice: DH has the first only; T-NR has the first two; the perturbations have the last
two. A Beurling-type twin (ideation-panel T-B: last two without the first) was not run. The conjunction is the
axiom set of the degree-1 Selberg class, for which the all-order statement is GRH. So Part 4 returns the
hypothesis class of the conjecture, and the failing level adds nothing to it: at that level the gate reads the
location of the first ~k/3.5 zeros and no finer property of Lambda. In Lemma A coordinates (a > 1/2) the level-k
data are the k prime moments sum_n Lambda(n) n^{-1/2-a} l_j(2a log n), j < k; for DH at a = 1 the first 148 of
them satisfy every inequality that zeta's satisfy, and DH's coefficients are signed and supported off the prime
powers.

## 6. What the level-k gate uses

At a confluent anchor a, level k (PROVED from section 2, apart from the last item):
1. The Richards parameters r_0..r_{k-1}, i.e. the first k Taylor coefficients of L at a in
   zeta = (z-a)/(z+a). For a > 1/2 these are k Laguerre-weighted prime sums plus archimedean terms.
2. The theta kernel through the functionals Phi_i(t), Psi_i(t), i <= k: iterated one-sided integrals of kappa
   against polynomial-times-exponential weights. These contain no arithmetic beyond kappa itself.
3. Nothing else. In particular the level-k pair is a linear combination of 2(k+1) fixed functions of t with
   coefficients polynomial in a and r_0..r_{k-1}.
4. (GRID-CERTIFIED, five families) Away from level 0-1 shape defects, the seven signs at level k are all positive
   exactly when no r_j with j <= k+2 (or k+3) is negative.

Item 4 says the time-domain class adds a lead of two or three levels to the Richards test and no arithmetic.
The Euler product enters the gate ladder at the same place where it enters real-Pick positivity: at the order
at which the zero configuration is resolved.

## 7. DH control

| Step | zeta | DH | Uses Euler product? |
|---|---|---|---|
| Theorem R | applies | applies | no |
| Lemma Ri, section 2 formulas | apply | apply | no |
| gates at levels 1..145, a in {1/10, 1, 3} | pass (to 152 at a = 1) | pass | no: DH passes |
| gate d^2H/dB^2 at level 146 | pass | fails (certified) | only through the off-line zero of DH |
| r_148 | positive | negative (certified) | same |
| chi_-4 + quartet | | fails at order 157 | no Euler product needed to build a function failing at DH's level |

Nothing in this note is an argument for RH, so there is no step that must fail for DH. The result is the
location of the first DH failure and its cause.

## 8. Three weakest steps

1. **Passes are sampled.** A "pass" is a finite set of certified signs at 2-8 values of t and one confluent
   anchor per run. A gate could fail between sample points, for t > 3, or at non-confluent anchor tuples at an
   earlier level. Certified: k_DH(a) <= 146 and the sign tables. Not certified: k_DH(a) = 146 as a statement on
   all t > 0, and anything about distinct anchors.
2. **Truncation bounds are mine.** The enclosures rest on hand-derived tail bounds (theta sum, Kummer series
   majorant, series-in-a tail) and on python-flint's `arb_series` gamma, zeta and Hurwitz zeta. Mitigation: two
   evaluation paths with overlapping balls, mpmath quadrature checks, an input for DH that uses no zeta routine.
   No second person has checked the bounds. The T-NR runs at a = 1/10 before a fix of one tail constant were
   discarded and re-run.
3. **Sections 4-6 generalise from few functions.** "Orders per zero between 3.5 and 4.4", "lead of 2 or 3
   levels" and item 4 of section 6 are observed on five families at three anchors. Only one direction is a
   theorem (r_j < 0 forces a full-class failure at some level <= j - 2, by the PR chain). Part 4 separates the
   tested twins and is not a classification; the Beurling twin is missing.

## Files

- `gates_arb.py`: reduction, moments, both evaluation paths, gate signs. `summ.py`: table summary.
- `rchain.py`: Richards parameters; `run_r.sh`, `rchain_all.log`: runs for section 1.3 and 4.
- `sweep.sh`, `sweep_results.txt`: twin sweep. `perturb_r.py`, `perturb_r.txt`: table 2.4.
- `richards_identity.py`: Lemma Ri. `val1.py`, `val2.py`, `xcheck.py`: checks.
- `g_*.json`: raw sign tables (per level, per t: seven signs, log10 magnitudes, u, v, all r_k).
- Motherbox copies and logs: `~/rh-push/r2-pick-euler-entry/`. Longest run 29 minutes (DH, a = 1/10, 4 points,
  4 processes); at most 8 processes at a time; CPU only.
