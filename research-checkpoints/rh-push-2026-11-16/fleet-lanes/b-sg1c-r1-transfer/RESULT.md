# b-sg1c-r1-transfer: the R1 minimality-transfer residual of sg1c

Date 2026-11-16. Scope: finite-N attractive Calogero-Moser flow (backward heat flow on real roots).
Labels: PROVED / CLASSICAL / MEASURED / OPEN. No Lambda bound moves. No RH claim.

## 0. Verdict

R1 is settled in all three readings the repo gives it:

- **R1-level** ("an absolute level Theta_exc < 1 the minimal-pair process never crosses upward, evidence ~0.51"): **FALSE for every level in (Theta_b, 1)**, Theta_b = (sqrt(73)-5)/8 = 0.4430. Theta_b is the exact largest N-uniform trap level, and it IS a trap across transfers (Theorems 5, 6).
- **R1-transfer** ("what happens when the tracked pair loses global minimality"): the minimal-pair Theta process has only **downward** jumps (Theorem 1). The rho-isolation basin {rho <= c} is **not** closed under transfer (Section 6), but nothing downstream needs it.
- **R1-consumer** (the reason R1 exists: an N-uniform collision bound from the initial minimal pair): **PROVED unconditionally** (Theorem 4):

      m0^2/8  <=  t_c  <=  m0^2 (1+Theta0) / (8 (1-Theta0)),      hence  t_c <= (N-1) m0^2 / 8  for every N-point configuration,

  where m0 = minimal gap and Theta0 = Theta of the minimal pair at s = 0. No trap hypothesis, no isolation hypothesis, no basin. The mechanism is a new exact identity and a new monotone quantity: **W = (1-Theta_min)/(Theta_min * m) is nondecreasing along the flow**, through every minimality transfer.

Obstruction to anything stronger of the "absolute cap" type: the Hermite self-similar solution (Theorem 7) has Theta_min constant = 1 - m0^2/2 -> 1 and t_c/m0^2 = N/(2 pi^2)(1+o(1)) -> infinity. So an N-uniform bound t_c <= C m0^2 with no Theta input is false, and the linear-in-N universal bound above is of the right order (constant between 1/(2 pi^2) = 0.0507 and 1/8).

## 1. Setting and exact statement of R1

Source modules: `src/data/sg1-theta-contraction.js`, `src/data/sg1c-theta-trap-theorems.js`, `src/data/sg1c-cglo-closure-2026-08-28.js`.

Flow: x_1 < ... < x_N, dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j), on [0, t_c), t_c = first collision. For an adjacent pair (a, b), g = b - a, environment particles y_j:
T_j = 1/((a-y_j)(b-y_j)) > 0, mu_j = g^2 T_j, Theta = (1/2) sum mu_j, eta = 1 - Theta.
m(s) = minimal adjacent gap, Theta_min(s) = Theta of a pair realising it.

Repo facts used (re-derived here, see Section 8): Lemma E: d(g^2)/ds = -8 eta. Lemma 2: g^2 dTheta/ds = Phi := -4 Theta (2-Theta) + 6 sum mu^2 + 2 sum mu^3. Theorem B: for a globally minimal pair Phi <= r(2r^2+7r-3), r = 2 Theta - 1/2, so Phi <= 0 at levels <= Theta_b.

R1 as written in the module (`sg1c-r1-excursion-cap`): "Prove an absolute excursion cap Theta_exc < 1 (numerical evidence ~0.51) for the minimal-pair Theta process, via a dynamic minimality-transfer argument." The c_glob closure module restates the open part as: "if the tracked pair LOSES global minimality the spacing floor fails -- that seizing/transfer dynamics is the separate R1 thread." Its consumer is Corollary E1 of the parent module: Theta_min <= Theta* < 1 along the flow gives t_c <= m0^2/(8(1-Theta*)).

What is new relative to the repo, the route atlas (PR 27 section 5 treats collisions of the theta family, not finite-N transfer dynamics) and the fifty-routes synthesis: Theorems 1-7 below. The repo had the static per-N cap Theta <= 1 - 2/N (R1-FN), the tie value K/(K+1) (R1-T2), and a sampled belief that levels above ~0.51 are not crossed. It did not have the identity (2), the cubic deficit lemma, the monotone W, the unconditional collision bound, the proof that all levels above Theta_b are crossed, or the Hermite solution.

## 2. Theorem 1 (transfer lemma). PROVED

On [0, t_c) the solution is real-analytic, so for two adjacent pairs A, B the function g_B - g_A is identically zero or has isolated zeros. Suppose A is minimal just before s0 and B just after. Then g_B - g_A >= 0 before and <= 0 after, so (g_B - g_A)'(s0) <= 0. By Lemma E, g' = -(4/g) eta and g_A(s0) = g_B(s0), hence eta_B(s0) >= eta_A(s0):

    Theta_B(s0) <= Theta_A(s0).

If g_A == g_B on an interval then Theta_A == Theta_B there. So Theta_min(s) is well defined, piecewise analytic with finitely many switches on compact subintervals, and **every jump is downward**. (The repo noted "competitor seizes = competitor has lower Theta" in R1-T2 but treated the tie value as the obstruction; the jump direction is the whole content.)

MEASURED cross-check: 180 index switches over 300 random flows, max jump -6.0e-5 (`exp2.py`); 1500 further flows, max jump -7.2e-3 (`exp3.py`).

## 3. Theorem 2 (exact identity, every adjacent pair). PROVED

For every adjacent pair, every N:

    d/ds [ (1 - Theta) / g ]  =  D / g^3,        D := 4 - 6 sum_j mu_j^2 - 2 sum_j mu_j^3.        (2)

Equivalently Phi = 4 eta^2 - D. Proof: both sides are sums of 0-body, 1-body and symmetric 2-body functions of the environment particles (velocities are sums of two-body terms; Theta is a sum of one-body terms), so the identity for all N follows from N = 2 (trivial: 4/g^3), N = 3 and N = 4. `symb.py` verifies N = 3 and N = 4 symbolically (sympy residual 0), together with Lemma E and Lemma 2. Independent numeric check at 40 digits on 20 random configurations, all adjacent pairs: max relative error 1.8e-21 (`exp6.py`).

## 4. Theorem 3 (cubic deficit lemma) and Theorem 4 (monotone W, collision bounds). PROVED

Let the pair be globally minimal, scale g = 1. On one side let the environment distances from the nearer pair member be l_1 < l_2 < ...; minimality gives l_1 >= 1, l_{r+1} >= l_r + 1, so l_r >= r and mu_r = 1/(l_r(l_r+1)) <= a_r := 1/(r(r+1)).

Exact constants: sum a_r = 1, and 6 a_r^2 + 2 a_r^3 = 2 (1/r^3 - 1/(r+1)^3) (sympy residual 0), so a full one-sided lattice carries sum (6 a^2 + 2 a^3) = 2 and K full shells leave the tail 2/(K+1)^3. In particular 6 sum mu^2 + 2 sum mu^3 <= 4, i.e. D >= 0, and Phi(C(K,K)) = 4K/(K+1)^3 exactly for the K-shell symmetric lattice (checked in rationals, K = 1..59).

Side deficits: x := 1 - sum_left mu, y := 1 - sum_right mu, so eta = (x+y)/2; d_L := 2 - sum_left (6 mu^2 + 2 mu^3), likewise d_R, so D = d_L + d_R.

**Theorem 3.** d_L >= 2 x^3 and d_R >= 2 y^3. Hence D >= 2(x^3 + y^3) >= 4 eta^3 and

    Phi  <=  4 eta^2 (1 - eta)  =  4 eta^2 Theta.

Proof. One side: the sorted vector (mu_r) satisfies mu_r <= a_r with sum 1 - x. The greedy vector (a_1, ..., a_K, p, 0, ...), 0 <= p <= a_{K+1}, with the same sum majorizes it (its partial sums are min(sum_{r<=k} a_r, 1 - x)). phi(mu) = 6 mu^2 + 2 mu^3 is convex, so sum phi(mu) <= sum phi(greedy). For the greedy vector, with c = 1/(K+1) and x = c - p:

    d - 2 x^3 = 2 c^3 - 6 p^2 - 2 p^3 - 2 (c - p)^3 = 6 p ( c^2 - (1 + c) p )  >=  0   iff   p <= c^2/(1+c) = a_{K+1},

which is exactly the admissible range (sympy residual 0; equality at both ends). Then 2(x^3+y^3) >= (x+y)^3/2 = 4 eta^3 by the power mean inequality. MEASURED cross-check: 2e5 random admissible two-sided configurations, min(D - 4 eta^3) = -1.8e-16 (rounding at the N = 2 equality case) (`exp8.py`).

**Theorem 4.** Along the global minimal-pair process on [0, t_c), N >= 3,

    W(s) := (1 - Theta_min(s)) / ( Theta_min(s) * m(s) )   is nondecreasing.

Proof. On a smooth segment, d/ds log(eta/(1-eta)) = -Phi/(g^2 eta (1-eta)) >= -4 eta/g^2 = d/ds log g by Theorem 3 and Lemma E. At a switch m is continuous and eta jumps up (Theorem 1). (The weaker statement that eta_min/m is nondecreasing follows from D >= 0 alone via (2).)

Corollaries (all PROVED, all N-uniform, no hypothesis beyond distinct real points):

1. Excursion inequality: Theta_min(s)/(1 - Theta_min(s)) <= [Theta0/(1 - Theta0)] * m0/m(s).
2. Gap trajectory: with kappa = W(0), m + kappa m^2/2 <= m0 + kappa m0^2/2 - 4 kappa s. (From d(m^2)/ds = -8 eta_min <= -8 kappa m/(1 + kappa m).)
3. Collision time: **m0^2/8 <= t_c <= m0^2 (1 + Theta0)/(8 (1 - Theta0))**. Lower bound is the repo's Lemma D (Theta >= 0). Equality on both sides at N = 2.
4. Universal: eta0 >= 2/N (R1-FN, or directly x >= 1/(K_L+1), y >= 1/(K_R+1)), so **t_c <= (N-1) m0^2/8** for every N-point configuration.
5. Downstream: Corollary E1 needed a trap level Theta* and R3 asked SG1d to produce a pair with Theta <= 1/4 or <= 0.443. Neither is needed: any quantitative bound Theta_min(0) <= 1 - delta gives t_c <= m0^2/(4 delta).

MEASURED cross-check: 1200 flows (random, near-lattice, perturbed Hermite, log-normal gaps, N <= 21): minimum relative step increment of W = +5.7e-4 (never negative), max t_c/bound = 0.997 (`exp8.py`).

## 5. The level form of R1

**Theorem 5 (Theta_b trap survives transfer). PROVED.** If Theta_min(0) <= theta* <= Theta_b then Theta_min(s) <= theta* on [0, t_c), and t_c <= m0^2/(8(1 - theta*)). Proof: on smooth segments Theta' <= F(Theta)/g^2 with F(Theta) = r(2r^2+7r-3), F Lipschitz, F <= 0 on [1/4, Theta_b] (Theorem B; Theorem A below 1/4); ODE comparison with the constant solution. Jumps are downward (Theorem 1). This closes "pipeline B" unconditionally in N and in the number of transfers.

**Theorem 6 (every level above Theta_b is crossed). PROVED.** Let M(theta) = sup of Phi over configurations whose pair is globally minimal at level theta. Order the caps c = (1/2, 1/2, 1/6, 1/6, 1/12, 1/12, ...). The sorted mu-vector of any admissible configuration is majorized by the greedy fill (c_1, ..., c_J, p), p in [0, c_{J+1}], which is realised (in the closure) by the lattice C(K,K) or C(K,K+1) plus one partial shell. So M(theta) = Phi_J(p). Phi_J is convex in p with Phi_J'(0) = -4 eta_J, hence Phi_J(p) >= Phi_J(0) - 4 eta_J c_{J+1}. With x = 1/(K_L+1), y = 1/(K_R+1): Phi_J(0) = (x+y)^2 - 2(x^3+y^3) and eta_J = (x+y)/2.
- J = 2K (x = y, next cap a_{K+1} = x^2/(1+x)): Phi_J(0) - 4 eta_J c_{J+1} = 4 x^2 (1 - x - x^2)/(1 + x) > 0 for x <= 1/2.
- J = 2K+1 (x = 1/(K+1), y = 1/(K+2), partial on the K side, next cap a_{K+1} = xy): Phi_J(0) - 4 eta_J c_{J+1} = (x+y) [ (x+y) - 2 (x^2 + y^2) ] > 0 since x <= 1/2, y <= 1/3,

which covers every stage J >= 2 (levels >= 1/2). Stage J = 1 is Theorem B's cubic, positive exactly for theta in (Theta_b, 1/2]. So **M(theta) > 0 on (Theta_b, 1)**. Rational-arithmetic confirmation of both closed forms for K = 1..199 in `cert_levels.py`.
Crossing with a strictly minimal pair: multiply all environment distances of the greedy configuration by 1 + eps. The pair is then strictly minimal with margin eps, Phi stays positive for small eps, and the level moves continuously, so the family at fixed eps covers a neighbourhood of theta; choosing the member at level theta - delta with delta small against (positive rate) x (tenure, bounded below in terms of eps) gives a trajectory on which the minimal pair's Theta crosses theta upward. MEASURED: stretched C(K,K), K = 2, 3, 5 rise while minimal (2.6e-4, 1.2e-4, 9.0e-6) before an outer pair seizes with Theta ~ 0.40-0.45 (`exp7.py`); Phi > 0 confirmed at K = 8, 12, 40, 200.

Consequence: the "~0.51" evidence in the module was a sampling artifact. There is no level in (Theta_b, 1) that the minimal-pair process never crosses; Theta_b is sharp for the level form of R1; level 1 is never reached (static cap 1 - 2/N).

**Theorem 7 (Hermite solution). CLASSICAL identity, consequences PROVED.** The zeros z_k of H_N satisfy sum_{j != k} 1/(z_k - z_j) = z_k (Stieltjes). Hence x_k(s) = z_k sqrt(1 - 4s) solves the flow, all gaps shrink by the same factor, t_c = 1/4 (total collapse), and by Lemma E every adjacent pair has **Theta_i == 1 - g_i(0)^2/2, constant in s**. For the central pair g ~ pi/sqrt(2N), so Theta_min == 1 - pi^2/(4N)(1+o(1)) for the whole lifetime and t_c/m0^2 = N/(2 pi^2)(1+o(1)). Numerics N = 4..64 in `exp1.py` (residuals <= 2e-14). Consequences:
- a persistent orbit (not a transient tie) sits at Theta_min arbitrarily close to 1, so no absolute cap exists even in a time-averaged sense;
- no bound t_c <= C m0^2 holds uniformly in N; the universal constant in t_c <= C_N m0^2 satisfies N/(2 pi^2)(1+o(1)) <= C_N <= (N-1)/8;
- the isolation ratio rho is constant along it, so self-improvement of rho fails persistently above c_half. Check: Hermite-4 has rho = 0.9318516525781367 = sqrt(2+sqrt(3)) - 1 = c*, the repo's symmetric 4-body onset (it is that stationary shape).
- Hermite configurations have R := 8 (1-Theta0) t_c/m0^2 = 1 exactly; Theorem 4 gives R <= 1 + Theta0.

## 6. The rho form of R1-transfer. Static part PROVED, example MEASURED

For a globally minimal pair with nearest environment distance d_1 and rho = g/d_1:

    rho^2 / (2 (1 + rho))  <=  Theta  <=  rho.

(Upper: the r-th particle on a side is at distance >= d_1 + (r-1) g, the bound telescopes to rho per side. Lower: the nearest particle alone.) So at a transfer A -> B: Theta_B <= Theta_A <= rho_A and rho_B <= Theta_B + sqrt(Theta_B^2 + 2 Theta_B). This does not keep rho below a fixed c: `exp5.py` has A with symmetric shells (rho_A = 0.586, Theta_A = 0.319) losing minimality to a far pair B with a single near neighbour (Theta_B = 0.232, rho_B = 0.948 > c_half). The c_glob theorem therefore does not propagate through transfers, as the closure module warned. It does not matter: Theta is the quantity that is monotone at transfers, and Theorem 4 needs no isolation.

## 7. OPEN

- **Conjecture R <= 1**: t_c <= m0^2/(8(1 - Theta_min(0))) for every configuration, with equality exactly on Hermite configurations (N = 2, symmetric triplet, Hermite-N). MEASURED: max R over 1500 random flows 0.99967; Nelder-Mead maximisation N = 3..7 returns R = 1.0000 at the triplet and R -> 1 at the Hermite-4 shape (gaps 1.0731 : 1 : 1.0731), R < 1 elsewhere (`exp3.py`, `exp4.out`, `exp9.py`). Proved: R <= 1 + Theta0. Equivalent form: the lifetime average of 1 - Theta_min is at least its initial value.
- Excursion function e(theta0) = sup of sup_s Theta_min(s) over configurations with Theta_min(0) <= theta0, for theta0 in (Theta_b, 1). Proved: e(theta0) = theta0 for theta0 <= Theta_b; e(theta0) > theta0 above; and the bound in Corollary 1. Largest measured rise: 0.4511 -> 0.5000 (N = 4). Whether e(theta0) < 1 uniformly in N is not decided. The collision bound does not depend on it.
- Exact universal constant C_N in t_c <= C_N m0^2 (between N/(2 pi^2) and (N-1)/8).

## 8. Walls and DH control

No step uses an Euler product, Lambda(n) >= 0, multiplicativity or Hecke structure. Every statement holds for any finite set of distinct real points, including any finite window of Davenport-Heilbronn zeros on the line. The result therefore carries no information about RH and cannot separate zeta from DH; it is not claimed to. For the infinite zero set of H_t the minimal gap is not attained (gaps tend to 0 with height), so Theorem 4 has no direct statement there; this is consistent with Lambda >= 0 (Rodgers-Tao). Identity (2) is local and holds for any adjacent pair with convergent environment sums; for such a pair D >= 0 whenever Theta <= (sqrt(3)-1)/2 = 0.366 (from sum mu^2 <= (2 Theta)^2, sum mu^3 <= (2 Theta)^3), a regime Theorem A already controls below 1/4. Verified-height, MV-CAP and flow-blindness walls are not touched: this is a deterministic finite-N statement. Platt-Trudgian Lambda <= 0.2 is unchanged.

## 9. Three weakest steps

1. Theorem 6, last step (upward crossing by a strictly minimal pair at an exact prescribed level): the positivity of M(theta) is exact, but the passage from the tied greedy configuration to a strictly minimal one is a continuity/compactness argument written in prose, not with explicit constants. The measured rises at K = 5 are 9e-6; for K >= 8 the integrator did not resolve the rise and only the sign of Phi was checked.
2. Theorem 2 rests on the "0-, 1-, 2-body" reduction to N <= 4 plus a computer-algebra verification. The reduction is elementary, and the 40-digit numeric check for N up to 9 agrees, but there is no hand derivation in this file (the repo's Lemma 1 derivation is the independent one).
3. Theorem 1 and Theorem 4 assume the process is tracked on [0, t_c) with analytic dependence, and handle multi-way ties by pairwise comparison. Simultaneous ties of three or more pairs with equal first derivatives are covered by "identically equal or isolated", but this was argued, not stress-tested numerically at engineered triple ties. Section 6's example and the R <= 1 conjecture are numerical only.

## 10. Files (all under this directory)

- `symb.py`: symbolic proof of (2), Lemma E, Lemma 2 for N = 3, 4.
- `exp6.py`: 40-digit check of (2); lattice constants; Phi(C(K,K)) = 4K/(K+1)^3.
- `exp8.py`: telescoping identity, greedy factorisation 6p(c^2-(1+c)p), random admissible sweep, W monotonicity, collision bound.
- `cert_levels.py`: rational certificate that M(theta) > 0 on stages J = 2..399.
- `exp1.py` Hermite; `exp2.py`, `exp3.py` jumps and eta/m; `exp5.py` rho transfer example; `exp7.py`, `exp9.py`, `exp4.py`/`exp4.out` extremal searches.
- `cm.py`, `cm2.py`: integrators (RK4, step proportional to m^2).
