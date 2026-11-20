# REFEREE 2: c19-rs-real-zero-completion-band-server (Lemma P, repaired, with its domain)

Date: 2026-11-20. Lane: `c20-referee-theorem-d-headline-and-r19`. Derived from the definitions of the lane's
section 2; numbers recomputed with mpmath (`r19_checks.py` / `.log`, local). The server runs were not repeated.
Nothing here is a statement about a zero of zeta.

**Verdict: holds with corrections.** Lemma P is correct under its hypothesis sigma >= 0. The measure sigma the lane
constructs does not satisfy that hypothesis, so "T_sigma >= 0 on every band" and "sigma >= 0 for every point set G,
by construction" are false as printed (the first referee's E1, found again independently). The repaired
statement and its domain are below. RESULT.md still carries the unrepaired sentences (verdict item 1 and
section 2; read 2026-11-20).

## 1. Lemma P as stated

For a positive measure sigma with sigma([x, x+1]) = O(log(2 + abs x)) and h in H^1_0(I), g(x) = int_I h(s) e^(-isx) ds
satisfies abs(g(x)) = O(1/abs x) (one integration by parts, boundary terms vanish), so int abs(g)^2 d sigma converges
and is >= 0. (ii) and (iii) are linearity. PROVED. Domain of the positivity: sigma >= 0 on all of R.

## 2. The constructed sigma is signed

sigma = sum over G of delta_g + (rho - rho_J 1_J) dx with rho = vartheta'/pi = (Re psi(1/4 + ix/2) - log pi)/(2 pi).
Recomputed: rho(0) = -0.85501 (psi(1/4) = -gamma - pi/2 - 3 log 2); rho changes sign at x_0 = 6.289836; the negative
part is supported on abs x <= x_0 with mass 2.247887 (= 2 (vartheta(0) - vartheta(x_0))/pi). On J = [t_w - 720, t_w + 720] the
density rho - rho_J is >= 0 because rho is concave there: rho'' < 0 at every grid point of (0.3, 40) and
rho''(1e3) = -1.59e-7, rho''(1e6) = -1.59e-13 (the asymptotic value -1/(2 pi x^2)); rho'' >= 0 only for abs x <= 0.2 on
the grid. So sigma = sigma_+ - sigma_-, with sigma_- = rho_- dx on [-x_0, x_0] of total mass 2.247887.

Counterexample to "T_sigma >= 0 on every band" (the first referee's, recomputed): U = 10, h = sin(pi s/10):
int over [-60, 60] of abs(g)^2 rho dx = -22.759 with norm(h)^2 = 5.

## 3. Lemma P', the repaired statement

**Lemma P' (PROVED).** Let sigma = sigma_+ - sigma_- with sigma_+- >= 0, sigma_- finite with support in [-x_0, x_0], and sigma_+
of logarithmic growth. For h in H^1_0(I):

    <h, T_sigma h> = int abs(g)^2 d sigma_+ - int abs(g)^2 d sigma_-  >=  - sigma_-(R) sup over abs x <= x_0 of abs(g(x))^2.

For the lane's sigma (J not meeting [-x_0, x_0], rho concave on J): sigma_-(R) = 2.247887, x_0 = 6.289836.

Domain on which this gives a usable lower bound: the mode space V_m of m orthogonal Fourier modes
h = sum c_k e^(i omega_k s) on [0, u], omega_k in [t_w - span, t_w + span], spacing 2 pi/u. There
abs(g(x)) <= sum abs(c_k) 2/abs(omega_k - x), so for abs x <= x_0: abs(g)^2 <= 4 m norm(c)^2/(t_w - span - x_0)^2, and
norm(h)^2 = u norm(c)^2. Hence on V_m

    T_sigma  >=  - eps,   eps = 2.247887 * 4 m/(u (t_w - span - x_0)^2)   (times norm(h)^2).

Values at m = 384, theta = 0.75, span = 720 + 2 pi m/u: eps = 3.3e-10 (t_w = 1e6), 2.2e-16 (1e9), 1.7e-22 (1e12).
(The first referee writes (t_w - span)^2 in the denominator; the term x_0 belongs there too and does not change
the digits shown.)

What Lemma P' does not give: T_sigma >= 0. Since g is entire, sup over abs x <= x_0 of abs(g)^2 > 0 for every h != 0, and
the lemma leaves a negative allowance on every subspace. Positivity of T_sigma on V_m is a computed fact in each
cell (first referee, from the records: smallest eigenvalue enclosed at or above 2.4e-6 Lg, which exceeds eps), not
a consequence of the construction. On all of H^1_0[0, U] it is false (section 2).

Consequences for the lane's text:
- Verdict item 1: replace "Lemma P (PROVED): T_sigma >= 0 on every band" by "Lemma P': T_sigma >= -eps(m, u, t_w) on the
  mode space V_m; eps <= 3.3e-10 in every cell run".
- "N(theta) holds on the test space with tolerance 2M = max(0, -lambda_min(E(u)))": the tolerance is
  max(0, -lambda_min(E(u))) + eps. No measured number changes (the smallest reported defects are 5e-4 Lg).
- Lemma P (iii): lambda_min(Q_C) >= lambda_min(E_u) - eps on the mode space of the full band.
- "k_sigma is positive definite on R" (Lemma P (i)) does not hold for the constructed sigma.

## 4. Scope

Only Lemma P and its application were refereed. Lemma Z, the engine, the certification of signs, the ZQ
comparison (first referee E3) and the aggregated ranges (E2) were not re-examined.

## 5. Flags

R1 false (positivity of a measure and linearity). R2 false (finite windows). R3 false (ZQ passes the one-sided
statistic at small eta). R4 false.
