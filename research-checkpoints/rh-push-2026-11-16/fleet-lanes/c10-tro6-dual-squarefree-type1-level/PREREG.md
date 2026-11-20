# Pre-registration (written 2026-11-18 before any run of this lane)

Finite objects (table of squarefree primary nodes prime to 6, N <= X; conductors/indices small, estimator moduli
k in (X/4, X], halves split at 0.625 X; rho-hat_sigma(u; r) = sum_{k = sigma mod 4, (k, r) = 1} gamma_1(k) conj chi_k(u r)).

Form (a), dual sum on squarefree n = c s:
  t_c = mu(c) alpha(c)^2 G(c) N(c)^(-1/2) sum_{s squarefree, (s, c) = 1, N(s) <= S_j N(c)/C_j} rho-hat_sigma(u; c s),
  c in the octave (C_j/2, C_j], C_j = M_j^(1 - theta), S_j = M_j^theta, M_j = M / 2^j.
  Cells: (sigma, c mod 4, c mod 9). r2_a = sqrt(sum_cells |sum_c t_c|^2 / sum_cells sum_c |t_c|^2).
  theta = 2/9 (toy geometry) and theta = 1/3 are decision geometries; theta = 1/2 is exploratory.
  Index shift u = lambda (the shift found by e2); u = y0 = 2 lambda^5 and u = 1 reported, not decision.
Form (b), Type I by level:
  t_a = sum_{c = 0 mod a, c in conductor octave j, class cell} mu(c) beta_c T_sigma(c), T(c) = sum_{N(m) <= Q_j} rho-hat(y0; m) chi_c(m),
  beta_c = alpha(c) gamma_2(c); levels a squarefree, 1 < N(a) <= Q_j^0.4 (decision) and <= Q_j^0.5 (reported).
  r2_b = sqrt(sum_cells |sum_a mu(a) t_a|^2 / sum_cells sum_a |t_a|^2).
Level statistics (the inner sums): L_F = sum_cells sum_x |t_x|^2 for the theta rows divided by the mean of the same over
  seeded random-phase rows.

Controls of the same form: (i) random signs in place of mu on the outer variable (c in (a), a in (b)), 20 seeded draws;
(ii) seeded control row classes: random-phase rows (3 seeds), completely multiplicative random signs on primes (sign-twisted
primes, 3 seeds), Liouville twist, THIN twist (b = 0.9 floor rule), cubic theta rows (stand-in for theta^w).
Seed 20261118 + fixed offsets.

Decision rule. Exponent = least-squares slope of log(statistic) on log(size) along the path (size = M_j for (a), Q_j for (b)),
points with at least 100 outer terms. "Saving" for a form iff, at BOTH table sizes X = 1e6 and X = 1e7,
  E(theta rows) - mean E(seeded random-phase and random-multiplicative rows) < -0.02
  and E(theta rows) < min over the six seeded control rows,
for r2 or for L. An excess (difference > +0.02 and above the max of the seeds at both sizes) is reported as a coherent
term. Anything else: no saving measured. No statement about zeros is made in any branch.

Amendment (2026-11-18, before any run): in form (b) the number of levels is small (N(a) <= Q^0.4 gives 2 to 19 levels
along the path), so the minimum number of outer terms for a path point is 100 for form (a) and 4 levels for form (b);
a third level range N(a) <= Q_j^0.6 (up to about 150 levels) is added and is a decision range together with Q_j^0.4.
Cells for form (b) are (sigma, c mod 4) (144 cells) for memory reasons. Path points for (b): Q_j >= 600.
