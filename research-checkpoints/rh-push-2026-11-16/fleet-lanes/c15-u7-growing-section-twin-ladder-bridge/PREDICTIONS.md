# Predictions registered before the run (2026-11-19, written before stage.py was executed)

Objects (s = 1/2 + it, u = log P, P = t^theta, alpha = 1):
- Fejer section L_F(s) = K_u(s) + K_u(s-1) + g(s) + g'(s)/u - sum_{n<=P} eps(n) Lambda(n) (1 - log n/u) n^-s - P^-s/(u s^2),
  K_u(w) = 1/w - (1 - e^{-uw})/(u w^2), g(s) = psi(s/2)/2 - (log pi)/2. For eps = 1 this equals sum over zeros of K_u(s - rho).
- Sharp section L_S(s) = 1/s + 1/(s-1) + g(s) - sum_{n<=P} Lambda(n) n^-s + P^(1-s)/(1-s).
- Symbol S = (1 - L)/(1 + L) on Re s = 1/2; windowed anticausal Hankel norm N_- (Gaussian window, width 15, offset r0 = 0.4).
- Classes: zeta (eps = 1); 24 random completely multiplicative signs eps(p) = +-1 on the same gamma one-port; Liouville (eps = -1);
  Davenport-Heilbronn with its own log-derivative coefficients and conductor-5 odd gamma term, same length P (P <= 1e6).
- Window: 200 units of height centred at t, step 0.02.

P1. zeta, Fejer: min Re L_F >= -1e-3 in every cell; N_- within a factor 10 of the gamma-only floor.
P2. zeta, sharp: min Re L_S < 0 for theta >= 1/2 in every cell; not for theta = 1/4.
P3. random signs, Fejer: Gaussian model, threshold z = 2.449 log(t/2pi)/(theta log t).
    theta = 2: fraction of the window with Re L_F < 0 about 15-18 percent, all 24 seeds violate.
    theta = 1: about 2-4 percent, all or nearly all seeds violate.
    theta = 1/2: per-sample 2e-5 to 2e-4; 0 to 2 of 24 seeds violate.
    theta = 1/4: no seed violates (at t = 1e3 the absolute sum is below the gamma reserve, so exactly none).
P4. Liouville: Re L = log(t/2pi) - (Fejer-smoothed zero count) + O(1/t); violates on more than 5 percent of the window for
    theta >= 1.5, on a small positive fraction for theta = 1, nowhere for theta <= 1/2.
P5. DH: min Re L_F < 0 for theta >= 1 at each t; not for theta = 1/4. theta = 1/2 not predicted.
P6. N_- exceeds 100 times the floor in the cells and classes with min Re L < -1, and stays near the floor where min Re L >= 0.

Reading fixed in advance: P1 with P3-P5 is separation at stage level, but the separation is the identity
L_F = sum_rho K_u(s - rho) with Re K_u >= 0 for on-line zeros (map row P45). It uses no multiplicativity and is not a limit
step. So no outcome of this run sets R1 or R4. If zeta violates P1 the lemma or the code is wrong and is rechecked first.
Cell (t = 1e5, theta = 2) needs P = 1e10 and is not run; cells (1e5, 1.6) and, for DH, (1e4, 1.5), (1e5, 1.2) are added.

## Added before the long scan (scan_half.py; written before its output was read)
P7. Long scan, P = t^(1/2), heights [1e4, 1.1e5] and [1e5, 2e5], 5e6 samples each: zeta has no sample with Re L_F < 0.
    If the Gaussian tail holds at 3.9 to 4.2 standard deviations, each random-sign seed has about 100 to 200 negative samples
    (per-sample 2e-5 to 4.4e-5), so all 24 seeds violate. A count far below this means the tail is thinner than Gaussian
    (few primes, bounded sum), not that the class passes. theta = 0.7 on [1e4, 1.1e5]: per-sample about 2.6e-3, all seeds violate.
