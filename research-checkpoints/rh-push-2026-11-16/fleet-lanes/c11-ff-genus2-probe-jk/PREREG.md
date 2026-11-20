# PREREG: c11-ff-genus2-probe-jk (written 2026-11-19 before any run of this lane)

Bounded model item. No requirement flag is claimed; no R4 answer is attempted. Function-field model only; no
statement about zeta.

## Objects
q in {5, 7}. F monic squarefree of degree 5 (genus 2) or 7 (genus 3). nu_F(A) = Legendre symbol of Res(F, A)
(convention of `sq.py`, `ffx.c cmd_sc`). L(u, nu_F) = sum_{n <= 2g} L_n u^n, L_n = sum over monic A of degree n;
L_{2g-n} = q^(g-n) L_n is checked, not assumed, on a subsample (direct sum up to degree 2g for g = 2, q = 5 and 7).
t_j = power sums of the reciprocal roots (Newton). S_cop(k) = S_cop(k; F, N, lam) as in `sq.py: scop`.
Grid: N in {1, 2, 3}, lam in {0, 1, 2, 3, 7}, k in {0, 1, 2, 3}: 60 vectors.
Curve sets: q = 5: all squarefree F of degree 5 (2500) and of degree 7 (62500). q = 7: all squarefree F of
degree 5 (14406); degree 7: seeded sample of 6000 (seed 20261119) from the 705894. If the q = 5 degree-7 run
exceeds 20 minutes locally it is cut to a seeded sample of 12000 and that is stated.
Strata: r(F) = number of roots of F in F_q (the only even prime power sum that enters for N <= 3).

## First lemma (to be tested exactly)
L1-poly: within a stratum (q, deg F, r), S_cop(k) = Pol(L_1, .., L_N) with a polynomial of weighted degree <= N
whose coefficients do not depend on F. Test: exact rank test (Fractions) of S against the monomials of weighted
degree <= N in L_1..L_min(N, 2g), over all curves of the stratum.
L1-lin: S_cop(k) = sum_{j <= N} c_j t_j with c independent of F in the stratum. Same rank test against
(t_0..t_N). Prediction (from c10 item 5): holds for N = 1; fails for N >= 2 at g >= 2 in every stratum with
enough distinct curves.

## Decisive test
Where L1-lin holds: D_k = sum_j c_j (P_(N+j) + q^j P_(N-j)), intersection numbers from `sq.py: gram`.
Per curve: S^2, H := (g/2)(-D_k.D_k)/q^N and E := -D_k.D_k/(2 q^N) (the genus-1 normalisation), signs and the
ratio rho = S^2/H.
Registered outcomes per (q, deg F, N):
 (a) equality S^2 = const * (-D.D) with one constant on all curves (algebraic, as genus 1);
 (a') S^2 equal on the stratum to some curve-independent quadratic form in P_0..P_2N: tested as "S^2 lies in the
      span of t_0..t_2N over the stratum" (the values of such forms are linear in t_0..t_2N);
 (b) one-sided: 0 <= S^2 <= H on every curve, rho not constant;
 (b2) two-sided: additionally a lower bound S^2 >= c H with c > 0 on every curve (tested as min rho > 0);
 (c) no relation (some curve with S^2 > H or -D.D < 0).
Prediction: (b), with rho = cos^2 of the angle between (phi_1..phi_g) and (1..1), phi_m = f(alpha_m); rho = 1
exactly on curves whose s_m = alpha_m + q/alpha_m make all phi_m equal (in particular L a g-th power of a
quadratic); min rho = 0 attained or approached; not (a), not (a'), not (b2).
Where L1-lin fails (expected N >= 2): recorded as "no class D_k with curve-independent coefficients"; (a') is still
tested for S^2 against t_0..t_2N, and S against t_0..t_2N (longer span).

## Control (required)
Fake L-polynomials prod_m (1 - s_m u + q u^2) with integer coefficients (functional equation holds), q = 7 and 5,
g = 2 and 3, three classes, at least 24 seeds each per (q, g), seed 20261119:
 W: all s_m real, |s_m| <= 2 sqrt q (on the line; not required to be a curve);
 R: all s_m real, some |s_m| > 2 sqrt q (off-line real reciprocal roots);
 C: some s_m non-real (off-line complex quadruple).
S for a fake := Pol(L_1..L_N) of stratum r = 0 (and r = 1), i.e. the same curve-independent law.
Recorded per fake: sign of -D.D, whether S^2 <= H, rho.
Non-degeneracy checks (numeric + exact witness): (i) the fake's Gram form on P_0..P_2g is indefinite for R and C
(float eigenvalue screen, then an exact rational vector with negative value); (ii) S != 0, D.D != 0,
sum_{m<n} (phi_m - phi_n)^2 != 0 for the fake (counts reported); (iii) class W fakes satisfy the inequality.
Reading rule fixed now: if (b) holds for all fakes of class R or C, the inequality carries no positivity input
(closes item 26's remainder). If (b) fails for every off-line fake (R and C both), it is the RS-2 lead for
round 12 (model R3 only). If it fails for C and holds for R, it reads reality of the s_m only, which is weaker
than the Riemann hypothesis of the curve; that is recorded as "no positivity input of Hodge-index strength" and
closes the remainder.

## Compute
Local, `scripts/memcap.sh 8`, pure Python exact arithmetic, copy of `sq.py` with q read from the environment.
Largest table: monic polynomials of degree <= 4 (2801 at q = 7). Server not planned.
