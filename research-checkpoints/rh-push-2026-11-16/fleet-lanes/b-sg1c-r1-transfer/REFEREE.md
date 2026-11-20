# REFEREE: b-sg1c-r1-transfer

Date 2026-11-16. Adversarial review of RESULT.md. Claimed verdict: proved-new-result.
Referee verdict: **the PROVED steps hold**. Two framing overstatements and three wording gaps, listed in section 3. No Lambda or RH content, none claimed.

## 1. Re-derivation of each PROVED step (by hand, independent of the author's scripts)

| Step | Result | Notes |
|---|---|---|
| Lemma E, dg/ds = -(4/g)(1-Theta) | confirmed | 1/(b-y) - 1/(a-y) = -g T, direct. |
| Thm 1, jumps downward | confirmed | (g_B - g_A)'(s0) <= 0 with g_A = g_B gives eta_B >= eta_A. Analyticity on [0,t_c) gives isolated switches. Multi-way ties reduce to pairwise comparison of the before/after pair. |
| Thm 2, identity (2) | confirmed | The body-count reduction is valid: q is 0-body + 1-body, velocities are sums of 2-body terms, so dq/ds is 0-body + sum f1(y_j) + sum f2(y_j,y_k), and the right side has no 2-body part; N = 2, 3, 4 determine all three. Also D = 4 eta^2 - Phi checked algebraically. |
| Thm 3, cubic deficit | confirmed | l_r >= r under global minimality; partial-sum majorization by the greedy vector is correct (greedy is sorted since p <= a_{K+1} <= a_K); phi convex with phi(0) = 0; telescoping 6a^2+2a^3 = 2(r^-3 - (r+1)^-3) and d - 2x^3 = 6p(c^2 - (1+c)p), c^2/(1+c) = a_{K+1} re-derived by hand. End pair (empty side: x = 1, d = 2) is the equality case. |
| Thm 4, W nondecreasing | confirmed | d log(eta/Theta) = -Phi/(g^2 eta Theta) >= -4 eta/g^2 = d log g. Needs Theta > 0 (N >= 3) and eta > 0 (eta >= 2/N). Jump step uses Thm 1. |
| Cor 1-5 | confirmed | t_c <= m0/(4 kappa) + m0^2/8 = m0^2 (1+Theta0)/(8(1-Theta0)); eta0 >= 2/N from 1/u + 1/v >= 4/(u+v), u + v = N; (2-eta)/(8 eta) <= (N-1)/8. |
| Thm B / Thm 5 | confirmed | Two-sided greedy (1/2, r) gives Phi <= r(2r^2+7r-3); below 1/4, Phi <= 4 Theta (4 Theta - 1)(Theta + 2). Comparison with the constant supersolution theta* is valid (bound function is continuous piecewise polynomial, g bounded below on compacts). |
| Thm 6, M(theta) > 0 on (Theta_b,1) | confirmed | Phi_J convex in p, Phi_J'(0) = -4 eta_J, Phi_J(0) = (x+y)^2 - 2(x^3+y^3); both tangent margins re-derived: 4x^2(1-x-x^2)/(1+x) and (x+y)[(x+y) - 2(x^2+y^2)]. Greedy configurations are realisable with finitely many points. |
| Thm 7, Hermite | confirmed | Stieltjes relation, lambda^2 = 1 - 4s, eta = g0^2/2 from Lemma E. |
| Sec 6 static rho bounds | confirmed | Telescoping per side gives rho; nearest particle gives rho^2/(2(1+rho)). |

## 2. Independent reruns (different code, different cases; scratch in /tmp/ref_sg1c, not kept)

- Identity (2): own sympy code, N = 3, 4 residual 0. Exact rational evaluation with hand-coded gradients, N = 3..9, 270 adjacent pairs: 0 nonzero residuals (exact, no floats).
- Thm 3: 40,000 two-sided admissible configurations in exact rationals (four samplers including all-ones lattices, 1e-9 perturbations, heavy tails): 0 violations of d_side >= 2x^3, D >= 4 eta^3, Phi <= 4 eta^2 Theta; minimum slack exactly 0 (equality cases).
- Thm B sign: 154,372 exact-rational minimal-pair configurations with Theta < 0.443: 0 with Phi > 0.
- Dynamics: own DOP853 integrator (rtol 1e-12), 240 flows, N = 3..15, including exact all-way ties, engineered near-ties, Pareto gaps, perturbed Hermite. 220 switches, max Theta jump +8e-17 (symmetric tie, rounding), min relative step of W = +2.3e-3, never negative. Rigorous lower estimate of t_c (s_end + m_end^2/8) over bound: max 0.997.
- Thm 6 crossing, weakest step 1 of the author: 40-digit RK4, strictly minimal pair with margin eps, prescribed levels:
  - 0.6 (N = 6, eps = 1e-3): Theta 0.5998185 -> 0.6001828 before loss of minimality.
  - 0.8 (N = 11, eps = 2e-4): 0.79999119 -> 0.80000882.
  - 0.9 (N = 21, eps = 5e-5): 0.899999483 -> 0.900000517.
  All three levels crossed upward by a strictly minimal pair. This covers the K >= 8 range the author's integrator did not resolve.
- Hermite: N = 5, 12, 30: force residual <= 9e-15, Theta_min = 1 - m^2/2 to 1e-16, t_c/m0^2 over N/(2 pi^2) = 1.074, 1.041, 1.017.
- Sec 6 example (exp5): reproduced, rho 0.586 -> 0.948 at the transfer.

Interval rigor: every sign decision in a PROVED step is algebraic (closed forms valid for all K) or exact rational. Floats in cert_levels.py appear only in printed diagnostics. Theta_b is algebraic. No float comparison decides a proved sign.

DH control: not applicable in the usual sense. No step uses an Euler product; the statements hold for any finite set of distinct reals, DH zeros included. The result says so. No RH assumption, no verified-height restatement.

## 3. Errors and overstatements

1. **"R1 is settled in all three readings" is too strong.** The source module had already refined R1 after R1-T2/R1-FN: the static cap was known to be absent (Theta_K = K/(K+1), cap 1 - 2/N), and the stated residual became dynamical reachability ("the flow from generic real-zero-like data never reaches a long near-uniform minimal-gap lattice", R1-T4, imp-3268). Theorem 6 starts delta below each level on a near-lattice; it does not address reachability from isolated or low-Theta data. RESULT section 7 concedes this (e(theta0) < 1 undecided), which contradicts the section 0 wording. Correct statement: the literal level form is refuted on all of (Theta_b, 1) (the repo had it on (0.443, 0.5073)); the consumer is bypassed by Theorem 4; the reachability form of R1 remains OPEN. Corollary 1 is the only proved control on it and degenerates as m -> 0.
2. **"R1's absolute cap ~0.51 is false" is partly a restatement.** That no absolute static cap exists was already recorded (R1-FN). New content is the upward dynamic crossing at every level, with a strictly minimal pair.
3. **Novelty is relative to the repo only.** No literature check is reported for identity (2), the monotone W, or t_c <= (N-1) m0^2/8. "New" should read "not in the repo or atlas".
4. Theorem 6, last step, is prose (continuity plus tenure). It is correct and now numerically confirmed at 0.6, 0.8, 0.9, but has no explicit constants.
5. Tie wording: Theta_min is ambiguous at tie instants. Theorems 4 and 5 are valid for any tied choice at s = 0 (a larger Theta0 only weakens the bound; the process follows the lowest-Theta tied pair), but this is not stated.
6. Corollary 5 claims the consumer E1 is replaced. The proved bound carries the factor (1 + Theta0) <= 2 relative to E1's form; the E1-form bound t_c <= m0^2/(8(1 - Theta0)) is the OPEN conjecture R <= 1. Stated correctly in section 7, loosely in section 0.

None of these affects a PROVED step.

## 4. Surviving claim

For N distinct real points under the attractive CM flow: (1) Theta_min jumps only downward; (2) identity d/ds[(1-Theta)/g] = (4 - 6 sum mu^2 - 2 sum mu^3)/g^3 for every adjacent pair; (3) Phi <= 4 (1-Theta)^2 Theta for a globally minimal pair; (4) W nondecreasing, m0^2/8 <= t_c <= m0^2 (1+Theta0)/(8(1-Theta0)) <= (N-1) m0^2/8; (5) Theta_b trap survives transfers, and every level in (Theta_b, 1) is crossed upward by a strictly minimal pair starting just below it; (6) Hermite solution with Theta_min = 1 - m0^2/2 and t_c/m0^2 ~ N/(2 pi^2). MEASURED: rho-basin not closed under transfer. OPEN: R <= 1; excursion function e(theta0) and with it the reachability form of R1; exact C_N. Euler-blind; no RH or Lambda content.

holds = true, adjusted strength 0.8 (deduction for the section 0 overstatement and the unchecked literature novelty).
