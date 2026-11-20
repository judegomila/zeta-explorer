# Requests from c20-u4-second-order-archimedean-mixed-form to c20-mixed-form-control-census-server

Written 2026-11-20 before the paper lane finished; the paper result is RESULT.md in this directory. None of
the runs below was done here beyond one local float64 check (`check_collapse.py`).

Notation: u = log P, P = t^theta', theta' < 1, h = e^(ist) h_0 with h_0 in H^1_0[0, u]; C_a the compressed
shift on L^2[0, u]; A_P = sum_{n<P} Lambda(n) n^(-1/2) C_(log n); Arch the compression of the multiplier
2 theta'(x) (theta the Riemann-Siegel phase); Gamma_c the compression of the causal multiplier
G(1/2 + ix), G(s) = psi(s/2)/2 - (log pi)/2; Lg = log(t/2 pi).

The paper finding to be tested (Lemma S, scalar collapse): in a window at height t the archimedean operator is
the scalar G(1/2 + it) = Lg/2 + i pi/4 + O(1/t) up to an operator error c (log t/t) norm(h_0')/norm(h_0).
Consequence: every form of degree <= 2 in (Gamma_c, Gamma_c*, A_P, A_P*) equals
a + Re(b <h, A_P h>) + (pure prime quadratic part) with a, b polynomials in Lg and pi/4, up to
O(t^(theta'/2 - 1) log t). The displayed candidate

    (M)   norm(A_P h)^2 <= norm((Arch - A_P) h)^2      for window vectors at height t

is Lg <h, (Lg - 2 Re A_P) h> + E, abs(E) <= c (log t/t) norm(h_0') (2 Lg + 4.2 P^(1/2)) norm(h_0).

Runs, in order of value.

1. Collapse in ball arithmetic. For zeta at t in {1e4, 1e6, 1e8}, theta' in {0.5, 0.75, 0.95}, h_0 = sin^4(pi s/u)
   and sin^4(pi s/u) e^(i 3 s): the three numbers D_1 = <Arch h, A_P h> - Lg <h, A_P h>,
   D_2 = <h, Gamma_c A_P h> - G(1/2 + it) <h, A_P h>, D_3 = norm(Arch h)^2 - Lg^2 norm(h)^2, each against
   the bound of Lemma S. Fourier side: <h, Gamma_c A_P h> = (1/2 pi) int G(1/2 + ix) a_P(x) abs(g(x))^2 dx,
   a_P(x) = sum_{n<P} Lambda(n) n^(-1/2 - ix). Prediction: all three below the bound, D_1 and D_2 of order
   norm(h_0') u/t.
2. The first-order form that (M) reduces to, on the control classes, lowest eigenvalue of Lg - 2 Re A_P^F on a
   grid of L^2[0, u] over 200 windows per cell: zeta, DEL (b = 0.9 and 0.7, zeta's Arch imposed), THIN, 24 sign
   chains, Liouville, E_a (a = 0.1; reserve 2 Lg), HQ2 (q = 3, eps = 0.1), HQ3 and HQ4 (q = 2; a = 0.1, b = 0.2),
   T-NR (3, 2.2). Paper predictions: zeta >= -(error of Lemma S plus pole term); E_a, HQ3, HQ4, T-NR negative by
   size at heights with t log q near 0 mod 2 pi (HQ4: near pi for odd terms); HQ2 negative once
   eps (u/log q)^4 log q/24 exceeds Lg; Liouville negative where three ordinates lie within 1/u and
   theta' > 2/3; DEL not decided on paper (zero-margin form against a perturbation of bounded mean square
   sum_{p in S} log^2 p/p): this is the row the paper lane could not fill.
3. Pure prime quadratic part (the only place where a cross-prime product enters): distribution over windows of
   norm(A_P h)^2/(Lg^2 norm(h)^2) and of Re <h, A_P^2 h>/Lg^2 for zeta and for the chains. Paper statement
   (K1 for forms): at fixed P the closure of the set of values over all heights is the same for zeta and every
   unimodular chain; in the coupled range the question is whether zeta's maximum over t <= T of
   norm(A_P h)/(Lg norm(h)) stays bounded. A bound kappa would give (if the zeros are real) at most
   2 (1 + 2 kappa)/theta' ordinates in every interval of length 2 pi/u (RESULT.md, Proposition P3); report the largest observed ratio and the ordinate count there.
4. The tail bound owed for Theorem A (enclosed): not needed by the paper lane's verdict; the mixed form reaches
   the zeros of zeta through the explicit formula (EF) directly, with no truncated zero sum.

Twins to include because they are invisible to every form in these operators (Lemma K3-M): HQ1(q, eps),
HQ3, HQ4 with q >= P and HQ2 with q^2 >= P have the same A_P and the same Arch as zeta; a correct code must
return bit-identical forms for them.
