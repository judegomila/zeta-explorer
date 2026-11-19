# c9-szego-sum-rule-prime-cascade: RESULT

Verdict: **precise obstruction**. The decisive first test is negative: the unimodular twist U passes every step of every sum rule tested, in the window-uniform sense, and the one phase-reading condition that does cross from summable to square-summable coefficients (the Simon-Zlatos difference condition) is satisfied by the control THIN, which has a zero to the right of the line. The lane stops there; no pivot was run. No statement about zeros of zeta is made.

Labels: PROVED (argument in this note), CLASSICAL (recalled, source not opened), MEASURED (float64 or mpmath, not interval arithmetic), ARGUED, NOT-RUN. Unrefereed (0 referee passes).

Requirement flags: R1 false, R2 false, R3 false, R4 false (section 6).

## 1. Plan and what is new against the map

Assignment: test whether a sum rule of Szego type (Szego-Verblunsky, Killip-Simon, Simon-Zlatos, Lukic, Krein-Denisov) gives a crossing device for the prime chain, whose coefficients p^(-s) are summable on Re s > 1 and square-summable on Re s > 1/2 (map rows Q10, S1). Closed in advance: the size-only rule. Tested here: phase-reading rules.

Objects. Stage F_P(s) = prod_{p<=P} (1 - u_p p^(-s))^(-1), |u_p| = 1. Stub coefficient alpha_p(t) = u_p p^(-sigma-it): modulus p^(-sigma), phase arg u_p - t log p. Delay order = p ascending (delay log p). Read set, fixed in advance: these moduli and phases.
Controls run: ZETA (u = 1), U (two independent random unimodular sequences U1, U2), LIOU (u = -1), THIN (b = 0.9, floor rule of `c4-thin-twist-control-78`; 280 of the 1229 primes below 10^4, 74363 of the 664579 below 10^7), WT (u_p = p^(-17.3 i)), DH (mpmath), HEAT (argued only).

New against the map: (i) the sum rule written in Killip-Simon form with all three terms nonnegative (Lemma 2) and its window form (Lemma 1), with the bound-state term identified; (ii) tail invariance of the bound-state term (Lemma 3), which says in which direction the free inequality of the device points; (iii) the depth-1/2 loss of the Szego convergence step in infinitely many delay variables (Lemma 6), a second derivation of the l^1/l^2 gap of row Q10; (iv) the Simon-Zlatos difference condition for the prime chain: finite for zeta on all of Re s > 0, finite for THIN on Re s > b/2, infinite for random U on Re s <= 1/2 (Lemma 5). Not new: Lemma 4 is row Q21; the mean form returns a density statement (MV-CAP), as the assignment stated in advance.

## 2. First lemma: the step-by-step sum rule with signs

**Lemma 1 (window form; stage identity PROVED, general identity CLASSICAL (Littlewood's lemma)).** Let G be meromorphic in Re s > sigma - eps, G -> 1 as Re s -> +inf uniformly in t, with no zero or pole on the three sides of the half-strip {Re s >= sigma, T <= t <= T+H}. Put Phi_G(T) = int_sigma^inf arg G(x+iT) dx (arg continuous, 0 at +inf). Then

    B_W(G) := (1/2 pi) [ int_T^{T+H} log|G(sigma+it)| dt - Phi_G(T) + Phi_G(T+H) ]
            = sum_{zeros rho in the half-strip} (beta - sigma) - sum_{poles} (beta - sigma).

For the stage, Phi_P(T) = sum_{p<=P} Im Li_2(u_p p^(-sigma-iT)) / log p and B_W(F_P) = 0 for every P, T, H, sigma > 0 and every u. Proof of the stage case: d/dT Im Li_2(z)/log p with z = u p^(-sigma-iT) equals Re log(1 - z) = -log|F_p|.

Signs, step by step (adjoining the prime p):
- left side gains int_W -log|1 - alpha_p(t)| dt: sign indefinite, mean zero over one period 2 pi/log p, absolute value at most (2 pi/log p) * max|log|1 - alpha_p|| per incomplete period;
- right side gains phi_p(T) - phi_p(T+H), phi_p = Im Li_2(alpha_p)/log p, |phi_p| <= Li_2(p^(-sigma))/log p: sign indefinite;
- bound-state term gains 0.
The bound-state (Lieb-Thirring) term of the limit is sum (beta - sigma) over zeros to the right of sigma in the window, exponent 1 in the distance, sign +; a pole enters with sign -.

**Lemma 2 (mean form; stage PROVED, limit CLASSICAL where stated).** On the Bohr torus (equivalently, mean over t), with M_2 the mean of |F|^2 and M_log the mean of log|F|^2:

    E(F_P) := log M_2(F_P) - M_log(F_P) = sum_{p<=P} -log(1 - p^(-2 sigma)),      each term > 0, E >= 0 by Jensen.

(M_2 = prod (1 - p^(-2 sigma))^(-1), M_log = 0.) This is Szego's theorem for a product of Bernstein-Szego weights, one Verblunsky coefficient of modulus p^(-sigma) per circle. For a limit function G = sum u(n) n^(-s) (u completely multiplicative, unimodular) with mean square zeta(2 sigma) on the line and Littlewood density delta_G(sigma) = lim (1/T) sum_{beta > sigma, 0 < gamma < T} (beta - sigma), Lemma 1 divided by T gives

    E(G) + 4 pi delta_G(sigma) = log zeta(2 sigma) = sum_p -log(1 - p^(-2 sigma)).        (KS)

Entropy term >= 0, bound-state term >= 0, coefficient side > 0: the shape of the Killip-Simon rule. The coefficient side converges exactly for sigma > 1/2. For zeta the mean square is CLASSICAL for sigma > 1/2 and delta = 0 is CLASSICAL (N(sigma,T) = o(T)); the pole contributes O(1/T). Output of (KS): 4 pi delta <= log zeta(2 sigma), a density bound weaker than the classical one. This is the size-only rule, closed in advance (MV-CAP); it is recorded because it is the positive-term identity the assignment asks about, and its limit step does hold on Re s > 1/2. It holds verbatim for U (almost every u, Helson, CLASSICAL) and for THIN (ARGUED: same moduli, one zero).

**Lemma 3 (tail invariance; PROVED).** B_W is additive under products and vanishes on every stub. Hence B_W(G) = B_W(G * prod_{p<=P} (1 - u_p p^(-s))) for every P: in the step-by-step rule with coefficient stripping the coefficient side is identically 0 and the remainder is the whole left side. Dropping the remainder (the Killip-Simon move) gives B_W(G) >= 0 for pole-free G, which is the definition. The other direction, B_W(limit) <= liminf B_W(stage) = 0, is the statement to be proved; the semicontinuity that exists (upper semicontinuity of int_W log w under weak convergence of w dt, CLASSICAL) gives int_W log|G|^2 >= limsup int_W log|F_n|^2, the same direction as B_W >= 0. Zeros can appear in the limit and the device bounds the bound-state term from below only. Control FM (finite modification) and every tail-preserving change pass.

Window form of (KS), an identity: E_W(G) + (4 pi/H) B_W(G) = log m_{2,W}(G) - (2/H)(Phi_G(T) - Phi_G(T+H)), with m_{2,W} the window mean of |G|^2. Its right side for one window is bounded by log sup_W |G|^2 plus the phase terms, so the every-window output is the Jensen bound on the number of zeros in a window (CLASSICAL), not a statement that there are none.

## 3. Decisive first test (sigma = 0.75, P <= 10^4)

All runs through `scripts/memcap.sh 8`, single process, python of `.venv-arb` (read only). Files: `stage.py`, `stage.log`, `stage.json` (72 s); `tail.py`, `tail.log`, `tail.json`; `limit.py`, `limit.log`, `limit.json` (227 s, mpmath 20 digits). The server was not used.

**N1. Both sides of Lemma 1 at stage level (MEASURED, float64, 960-node Gauss-Legendre per window, H = 10, 12 windows per case including T = 0 and T = 3).** max |LHS - RHS| over windows:

| P | ZETA | LIOU | U1 | THIN | WT |
|---|---|---|---|---|---|
| 10^2 | 1.1e-13 | 2.9e-13 | 1.6e-13 | 1.5e-13 | 2.8e-13 |
| 10^3 | 3.9e-13 | 3.0e-13 | 3.2e-14 | 3.8e-13 | 3.3e-13 |
| 10^4 | 4.6e-13 | 1.1e-13 | 8.8e-14 | 3.8e-13 | 1.9e-13 |

The identity holds with bound-state term 0 for every object at every stage. No step separates anything.

**N2. Size-only entropy rule in windows (MEASURED).** E_W = log(window mean of |F_P|^2) - window mean of log|F_P|^2, windows of length 10 at T uniform in [10^7, 10^9] (2000, 600, 300 windows for P = 10^2, 10^3, 10^4).

| P | coefficient side | sum p^(-sigma) | E_W mean (sd): ZETA | LIOU | U1 | U2 | THIN |
|---|---|---|---|---|---|---|---|
| 10^2 | 0.9284 | 3.01 | 0.868 (0.317) | 0.867 (0.323) | 0.873 (0.327) | 0.869 (0.329) | 0.866 (0.329) |
| 10^3 | 0.9529 | 4.66 | 0.895 (0.329) | 0.896 (0.330) | 0.882 (0.321) | 0.886 (0.331) | 0.875 (0.318) |
| 10^4 | 0.9584 | 6.80 | 0.906 (0.340) | 0.907 (0.360) | 0.908 (0.329) | 0.901 (0.313) | 0.886 (0.305) |

Kolmogorov-Smirnov, E_W of each object against U1: p-values 0.29 to 1.00 (U2 against U1: 0.53 to 0.94). The window value has standard deviation about 0.33 around the coefficient side for every object; the largest sampled values (2.0 to 2.8) are far from the uniform bound, which is of the size of sum p^(-sigma) (the l^1 quantity). Mean over windows: l^2. Every window: l^1. This is row Q10 seen in the sum rule.

**N3. Phase-reading coefficient functionals in delay order.** SZ(t; P) = sum_n |alpha_{n+1}(t) - alpha_n(t)|^2 (coefficient side of the Simon-Zlatos rule), C1 = Re sum alpha_{n+1} conj(alpha_n) (first Verblunsky/Case coefficient); SZ = sum(|alpha_n|^2 + |alpha_{n+1}|^2) - 2 C1.

(a) Tail ratio R(T; Q) = sum over Q < p_n <= 10^7 of |alpha_{n+1} - alpha_n|^2, divided by 2 sum_{Q < p <= 10^7} p^(-2 sigma), sigma = 0.75 (MEASURED, `tail.log`; mean of 8 heights in [T, 1.1 T]):

| T | Q = 10^2 | 10^3 | 10^4 | 10^5 | 10^6 |
|---|---|---|---|---|---|
| ZETA 10 | 0.048 | 0.0011 | 2e-5 | <1e-5 | <1e-5 |
| ZETA 10^2 | 0.805 | 0.089 | 0.0019 | 3e-5 | <1e-5 |
| ZETA 10^3 | 0.915 | 0.823 | 0.147 | 0.0030 | 6e-5 |
| ZETA 10^4 | 0.976 | 0.952 | 0.845 | 0.211 | 0.0057 |
| ZETA 10^5 | 0.968 | 0.995 | 0.978 | 0.899 | 0.336 |
| U1, all T | 0.99 to 1.10 | 0.96 to 1.00 | 0.99 to 1.00 | 1.00 | 1.00 |
| THIN 10 | 1.03 | 0.85 | 0.69 | 0.55 | 0.46 |
| THIN 10^5 | 1.02 | 0.99 | 0.98 | 0.93 | 0.57 |

For zeta the ratio is small exactly when Q is larger than about 10 T and close to 1 when Q < T: the functional separates zeta from U only through the primes p > t, where p^(-it) is a slowly varying function of p. LIOU gives the same numbers as ZETA to all printed digits (the difference functional does not see a global sign).

(b) Convergence in P at T = 10 (MEASURED): 

| sigma | object | P = 10^2 | 10^3 | 10^4 | 10^5 | 10^6 | 10^7 |
|---|---|---|---|---|---|---|---|
| 0.5 | sum p^(-2 sigma) | 1.803 | 2.198 | 2.483 | 2.705 | 2.887 | 3.041 |
| 0.5 | SZ ZETA | 3.5988 | 3.6352 | 3.6357 | 3.6358 | 3.6358 | 3.6358 |
| 0.5 | SZ U1 | 3.207 | 4.069 | 4.648 | 5.085 | 5.451 | 5.759 |
| 0.5 | SZ THIN | 3.535 | 4.432 | 4.940 | 5.258 | 5.465 | 5.603 |
| 0.75 | SZ ZETA / U1 / THIN at 10^7 | 1.6462 / 1.4506 / 1.6250 (all converged to 4 digits by P = 10^5) |

On the critical line SZ converges for zeta, grows like 2 log log P for U1 (increments 0.86, 0.58, 0.44, 0.37, 0.31 against 2 log(1 + 1/k) = 0.81, 0.58, 0.45, 0.36, 0.31), and for THIN the increments 0.90, 0.51, 0.32, 0.21, 0.14 decrease by a factor of about 0.65 per decade, consistent with the convergence proved in Lemma 5 (c). At sigma = 0.4 (`stage.log`): ZETA 0.0414 to 0.0415 at T = 0 for all P; U1 4.6 to 18.1; THIN 6.8 to 17.3 (sigma < b/2: divergent, as Lemma 5 (c) predicts).

**N4. The part of the chain with p much smaller than T (MEASURED).** Stage P = 100 at 3000 heights uniform in [10^5, 10^7] and stage P = 1000 at 3000 heights in [10^7, 10^9]; functionals SZ, C1, log|F_P|, arg F_P at the height. Two-sample Kolmogorov-Smirnov statistics D: ZETA against U1 0.014 to 0.031 (p = 0.11 to 0.93); U2 against U1 0.017 to 0.035 (p = 0.054 to 0.76); THIN, LIOU against U1 0.012 to 0.042. Of the 40 p-values 3 are below 0.05 (THIN log|F| 0.010 and 0.035, LIOU arg F 0.018); none is below the Bonferroni level 0.00125, and the U2-against-U1 baseline reaches 0.054. Means, standard deviations and extremes agree to sampling error (for example SZ at P = 100: 1.295 (0.423), 1.281 (0.423), 1.275 (0.437), 1.294 (0.435), 1.292 (0.432) for ZETA, U1, U2, THIN, LIOU). No functional separates zeta from U in distribution on the primes below the height.

**N5. Torus rotation made explicit (MEASURED).** Stage P = 7, U1 phases. At t* = 315965.675746 the four numbers p^(-i t*) agree with u_p to 0.033 rad. On the window of length 10: sup |log|F^U(sigma + i tau)| - log|F^zeta(sigma + i(t* + tau))|| = 0.024; E_W = 0.8784 (U1 at 0) against 0.8779 (zeta at t*); SZ = 0.6726 against 0.6473.

**Lemma 4 (PROVED from Kronecker-Weyl, CLASSICAL; this is row Q21).** Let Psi be a functional of the stage on a window that is a continuous function of the phases (arg u_p - T log p)_{p<=P} in T^{pi(P)}. Then the closure of {Psi(zeta stage, window at T) : T real} equals the closure of the same set for any unimodular U, and the distributions over T agree. So sup, inf and every quantile over window positions coincide: at a fixed stage no functional of the read set separates zeta from U uniformly in the window position, or on average.

**Answer to the decisive question.** No. At fixed P every functional of moduli and phases has the same range and distribution over windows for zeta and for U (Lemma 4, N4, N5). With P -> infinity at fixed height the difference functional SZ does separate zeta from random U (N3), but (i) only through p > t, (ii) not uniformly in t (the bound of Lemma 5 (a) carries |s|^2, and the crossover moves with t), and (iii) not from THIN, LIOU, WT or FM.

## 4. The Simon-Zlatos condition for the prime chain

**Lemma 5 (PROVED, elementary).** Let g_n = p_{n+1} - p_n.
(a) ZETA: |p_{n+1}^(-s) - p_n^(-s)| <= |s| g_n p_n^(-sigma-1), so SZ <= |s|^2 sum g_n^2 p_n^(-2 sigma-2) <= |s|^2 sum g_n p_n^(-2 sigma-1) < infinity for every sigma > 0 (g_n <= p_n). The same holds for LIOU (identical value) and for WT with s + i alpha.
(b) Random U: the expectation of SZ is sum (p_n^(-2 sigma) + p_{n+1}^(-2 sigma)), finite exactly for sigma > 1/2.
(c) THIN: |eps_{n+1} a_{n+1} - eps_n a_n|^2 <= 2|a_{n+1} - a_n|^2 + 2|a_n|^2 |eps_{n+1} - eps_n|^2, and eps changes only next to a prime of S; hence SZ_THIN <= 2 SZ_ZETA + 8 (1 + 2^(2 sigma)) sum_{p in S} p^(-2 sigma), finite for sigma > b/2 by partial summation from pi_S(x) = (1/2) int_2^x t^(b-1) dt/log t + O(x^(b-eta)).

Consequences.
1. The pair "alpha in l^4, differences in l^2" (the coefficient side of the Simon-Zlatos theorem, CLASSICAL for one delay) holds for the zeta chain on 1/4 < sigma <= 1/2, where the coefficients are not square-summable. On the coefficient side this is a crossing of the kind the assignment looks for.
2. THIN satisfies the same pair for every sigma > b/2 = 0.45, in particular at sigma = 0.75 and on the critical line, and its limit has a zero at s = b = 0.9 to the right of both. The condition does not imply the absence of zeros to the right of the line. Named control: THIN.
3. Dictionary (ARGUED; the theorems are for one delay variable): in Simon-Zlatos and Lukic theory a coefficient sequence that is slowly varying after removal of a frequency phi allows a singularity of log w at the point phi only, of either sign. For the prime chain the non-oscillating frequency is t = 0, the point s = 1: a pole for u = 1, a zero for u = -1. N6a below shows the pole as a bound-state term -0.25 at sigma = 0.75. Frequencies gamma in the delay-ordered coefficient measure with amplitude p^(beta - sigma) are the terms x^rho of the explicit formula, so the Lukic decomposition of the prime chain is the explicit formula (residue device, row S1).
4. The spectral side of every theorem of this family is log-integrability of the boundary modulus plus a Lieb-Thirring bound. For a function of bounded type in a half-plane the first holds on every vertical line whether or not there are zeros to the right, and the second is a Blaschke condition. The device returns density statements ((KS): delta <= log zeta(2 sigma)/(4 pi); window form: Jensen count).

**Lemma 6 (depth loss; PROVED given the reproducing kernel of H^2 of the infinite torus, CLASSICAL, Cole-Gamelin).** The Szego convergence step is: square-summable coefficients give convergence of the stages in H^2 on the boundary, and point evaluation in the interior is bounded on H^2, so the limit is analytic and zero-free inside (Hurwitz). For one delay the kernel at depth delta is 1/(1 - e^(-2 delta)), finite for every delta > 0. For the prime chain read on the line sigma_0 > 1/2 the stages converge in H^2(T^inf) (norm squared zeta(2 sigma_0)), and the kernel at depth delta is prod_p (1 - p^(-2 delta))^(-1) = zeta(2 delta), finite exactly for delta > 1/2. The step therefore gives locally uniform convergence, and zero-freeness, on Re s > sigma_0 + 1/2 > 1. The l^1/l^2 gap of row Q10 equals this depth 1/2. Almost every torus point has depth 0 (Helson); the orbit of zeta is one point up to translation (`c3-helson-tail-fe-selector`).

## 5. Limit step and controls

**N6a. Lemma 1 for zeta at sigma = 0.75 (MEASURED, mpmath).**

| window | int log abs zeta | Phi(T) - Phi(T+H) | B_W |
|---|---|---|---|
| [20, 30] | 0.0876381291 | 0.0876381291 | -6.6e-15 |
| [100, 110] | 1.1935334386 | 1.1935334386 | 1.2e-13 |
| [1000, 1006] | -1.0185448143 | -1.0185448143 | -2.2e-13 |
| [-3, 3] | -0.6513147549 | 0.9194815719 | -0.2500 (the pole: -(1 - 0.75)) |

**N6b. Stage convergence of the phase side at sigma = 0.75 (MEASURED).** Phi_P(T) - Phi(T) for P = 10^2 ... 10^6: at T = 20: -2.0e-2, +9.0e-3, -3.1e-3, -3.8e-3, +8.2e-3; at T = 1000: -3.8e-2, -8.7e-3, -3.6e-5, -8.0e-4, +4.3e-4. The differences do not tend to 0: the term Im P^(1-s)/((s-1) log^2 P) of the pole has modulus about P^(1/4)/(T log^2 P). After adding that leading term the residual at T = 20 is -1.6e-2, +3.1e-3, -6.2e-4, +1.7e-4, +2.3e-5 (decreasing); at T = 100 and 1000 the residual stays near 3e-4 for P >= 10^4, which is the size of the next terms of the pole expansion and of the zero sum; this was not resolved further. The limit step of the window rule is conditional convergence of sum_p p^(-s) at the line after removal of the pole, which is equivalent to a zero-free half-plane (CLASSICAL; row T2 for the one-sided form). It is the target, not a lemma.

**N7. DH (MEASURED, mpmath).** f = 5^(-s) [zeta(s,1/5) + kappa zeta(s,2/5) - kappa zeta(s,3/5) - zeta(s,4/5)], kappa = 0.2840790438.

| window | int log abs f | Phi(T) - Phi(T+H) | B_W |
|---|---|---|---|
| [80, 90] | 0.4639400020 | 0.0962657010 | 0.0585171825 |
| [60, 70] | -0.0709628256 | -0.0709628256 | 0 (below 1e-10) |
| [110, 118] | -0.0874028419 | -0.0874028419 | 0 (below 1e-10) |

The value 0.0585171825 is beta - sigma for the zero 0.8085171825 + 85.6993484854i. The zero 0.6508 + 114.16i is left of the line and does not enter. So the limit identity of Lemma 1 holds for DH and reads its off-line zero. The chain does not exist for DH: the first step (adjoin a stub) is not defined because log f is not a sum over primes, a(6) - a(2)a(3) = 1 + kappa^2 = 1.0807; f is a sum of two chains (u_p = chi(p) and its conjugate) and the junction is the non-multiplicative step (row G10, Proposition 4 of `g-passive-cascade`).

| Control | First step that fails, or "passes" | Status |
|---|---|---|
| U (random unimodular) | passes every stage step; same range and distribution of every functional over windows (Lemma 4); (KS) holds | PROVED / MEASURED |
| THIN | passes Lemma 1, (KS), the Simon-Zlatos condition for sigma > b/2, with a zero at b | PROVED (Lemma 5 c) / MEASURED |
| LIOU (sign-twisted primes, u = -1) | identical SZ and C1 to zeta at every t; zero at s = 1 where zeta has its pole | PROVED |
| WT (zeta translate) | passes everything; it is zeta at another height | PROVED |
| FM, T-NR as finite modification | B_W is a tail invariant (Lemma 3); the coefficient conditions are tail conditions | PROVED |
| DH | no chain: fails at the first step (junction of two chains). The limit identity holds and shows the zero | MEASURED |
| HEAT (backward heat) | no chain: with phi_n(u) = phi_1(u + (1/2) log n)-type terms, multiplication by e^(tau u^2) gives each delay term its own real shift of the archimedean factor, so H_tau is not (common factor) x (Dirichlet series) and there is no stub to adjoin; Lemma 1 has no normalisation at +inf | ARGUED, not computed |
| EA = zeta(s+a) zeta(s-a) | chain with two stubs per prime, moduli p^(-sigma -+ a); coefficient side of (KS) converges for sigma > 1/2 + a, which is the line of its zeros. For THIN the same threshold is 1/2 and the zero is at b: the l^2 threshold is not the zero-free boundary in general | ARGUED |
| Beurling, phase-rotated transfer operator, theta^w, T-NR (as a function) | NOT-RUN | |

## 6. Verdict and requirement flags

Precise obstruction. Device type "sum rule with positive terms (Szego, Killip-Simon, Simon-Zlatos, Lukic, Krein-Denisov)" applied to the prime chain:
- reads moduli: returns (KS), a density bound (closed in advance, confirmed);
- reads phases at a fixed stage: returns the same value set for zeta and U (Lemma 4);
- reads phases in delay order as P -> infinity: returns the smoothness of p^(-it) in p for p > t (membership of the principal orbit up to tail-thin changes), which THIN has;
- its convergence step loses depth exactly 1/2 in infinitely many delay variables (Lemma 6);
- its free inequality bounds the bound-state term from below, and its Lieb-Thirring output from above by a strictly positive coefficient side; neither gives "no bound states" (Lemma 3, section 4 item 4).

| Flag | Value | Evidence |
|---|---|---|
| R1 multiplicativity essential | false | additivity over stubs is used, but every multiplicative control (U, THIN, LIOU, WT) satisfies the same identities; nothing separates them |
| R2 height-uniform, every window | false | window values fluctuate with sd 0.33 at every stage; uniform bounds are l^1 (N2); SZ bound carries abs(s)^2 and the separating range p > t moves with t (N3) |
| R3 fails for every control at a named step | false | U, THIN, LIOU, WT, FM pass every step; only DH and HEAT fail, at chain formation |
| R4 reaches the critical line | false | the Simon-Zlatos coefficient condition does hold for zeta down to sigma > 1/4, but it has no implication for zeros (THIN); the convergence step reaches only Re s > 1 (Lemma 6) |

Pivot: not taken. The adjacent idea found is to apply the difference condition to the delay positions themselves (the measure d(psi(x) - x)) instead of the coefficients; in L^2 form this is int (psi(x) - x)^2 x^(-2 sigma - 1) dx < infinity, a known equivalent of a zero-free half-plane (CLASSICAL), so it restates the target.

## 7. Three weakest steps

1. Lemma 2 for the limit functions. The identity (KS) for zeta rests on the classical mean square and on N(sigma,T) = o(T), recalled and not opened; for THIN the mean square on 0.75 is argued, not proved here. Nothing in the verdict depends on (KS) beyond its shape.
2. Section 4 items 3 and 4 (the dictionary with Simon-Zlatos and Lukic theory, and "the spectral side of every theorem of this family is log-integrability plus Lieb-Thirring"). The one-delay theorems were recalled from memory, no source was opened, and no theorem of this family exists for a chain with incommensurable delays; the statement about the family is an inspection of four theorem statements, not a proof about all sum rules. A sum rule whose coefficient side vanishes identically and whose limit step has semicontinuity in the needed direction is not excluded by an argument here; Lemma 3 only shows that the Littlewood functional is not one.
3. Numerics. N2 and N4 sample at most 3000 windows at heights 10^5 to 10^9 in float64; the statement "same distribution" at finite sample is supported by Lemma 4 (asymptotic in T), not by the sample alone. N6b did not resolve the residual after the leading pole term. HEAT, EA, Beurling, the phase-rotated transfer operator and theta^w were not computed.

## 8. Device row proposed for the map (not applied)

| Device | Reads | Returns | Class control | Status |
|---|---|---|---|---|
| Positive-term sum rule across l^1 -> l^2 (Szego-Verblunsky, Killip-Simon, Simon-Zlatos, Lukic, Krein-Denisov) on the prime stub chain | moduli p^(-sigma) and phases arg u_p - t log p in delay order | mean form: E + 4 pi delta = log zeta(2 sigma), a density bound; window form: Littlewood's lemma with coefficient side 0 and Jensen's zero count; difference form: finite for zeta on Re s > 0 through p > t only; convergence step valid on Re s > sigma_0 + 1/2 | U (stage: torus rotation, Q21); THIN (difference condition for sigma > b/2 with a zero at b); LIOU (identical differences); FM (tail invariance) | PROVED (Lemmas 1, 3, 4, 5) / MEASURED; one lane, unrefereed |

`DEVICE_NODE.json` holds the proposed closed device node. `lanes_line.json` holds the lane record.
