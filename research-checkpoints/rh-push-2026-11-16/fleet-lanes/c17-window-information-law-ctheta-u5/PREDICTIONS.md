# Predictions registered before the runs (2026-11-19)

Notation: u = theta log T, Lg = log(T/2 pi), theta' = u/Lg, A = u b, u1 = u - Lg.
Complete device: all tests f >= 0 on R of exponential type u; inequality sum_rho f(z_rho) >= -(M/pi) int f.

A1. Scale-free, one pair against a tight background c u (c = (alpha + 2M)/u): threshold solves sinh(A)/A = 1 + c
    exactly (c = 2: A = 2.9788 expected from the formula; c = 1: A = 2.1773).
A2. Scale-free tapered rows (spacing 2 pi/(kappa u), offsets A cos^2): threshold A*(n) grows linearly in n,
    slope between 1/5.85 (Turan) and 1; expected 0.4 to 0.5 at kappa = 2.
A3. Flat rows (equal offsets) do not grow linearly: threshold stays within a bounded factor of the one-pair value.
B1. Zeta background, theta = 1/2 (theta' < 1): one-pair thresholds across ordinates lie between the laws
    sinh(A)/A = 1 + (alpha_loc + 2M)/u and the same with beta_loc; median near the tight value alpha = Lg.
B2. theta = 1 and 2 (theta' > 1), M = 1: one-pair thresholds are below the root of the proved exclusion inequality
    (sin^2(pi x/d) + sinh^2(pi b/d)) u1 (sinh(u1 b)/(u1 b) - 1) = 2M (lattice model); at theta = 2 they are
    of size sqrt(12 M) u1^(-3/2) (0.07, 0.03, 0.02 at 1e6, 1e9, 1e12), well inside the region c_theta/L of c15.
B3. Tapered Nyquist rows added to the zeta background: at theta = 1/2 the threshold reaches the cap for small n;
    at theta = 2, M = 1 the threshold is far below the Fejer-cone values of c16 and grows about linearly in n with
    slope of order 1/(2 u1) per pair.
B4. Pairs placed on consecutive zeta ordinates with equal offsets: no linear growth in n.
Outcome that would kill the lane's first lemma: a one-pair threshold in test A different from the closed form, or
a cluster passing at M = 0 with no background.
