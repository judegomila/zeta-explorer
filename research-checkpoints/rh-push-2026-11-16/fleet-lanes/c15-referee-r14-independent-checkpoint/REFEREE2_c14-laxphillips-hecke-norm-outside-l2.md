# REFEREE2: c14-laxphillips-hecke-norm-outside-l2

Independent referee, 2026-11-19; verdicts formed before the lane's REFEREE.md was opened. Not a statement about
zeros of zeta.

## Verdict: HOLDS WITH SCOPE LINE

Scope line (exact): "Theorem L and Corollary L1 are statements about the operator norm of T_p on the whole solid
space X. On the mean-zero subspace X_0 (which contains the resonance state and is T_p-invariant) the constants are
absent and the correct statement is: the spectral radius of T_p on X_0 is at least p^a + p^(-a), a = abs(Re mu),
attained through off-resonance Eisenstein series, so the eigenvalue bound is implied by membership. The closure
covers four named families; a norm on a smaller invariant subspace, or a non-solid norm outside the four families,
is not excluded."

## The four families

1. Solid norms, Theorem L (PROVED): holds. Re-derived: abs(f_rho) >= y^(Re w)/2 >= 1/2 for y > A, so
   1 <= 2 abs(f_rho) + 1_(y <= A) and 1 is in X; T_p has a positive kernel and T_p 1 = (p^(1/2) + p^(-1/2)) 1;
   monotonicity of the norm gives the lower bound for T_p^k. General form with u = ht^(s'): ht is the maximum of
   Im over the orbit, so T_p u >= lambda_(s'-1/2)(p) u on the fundamental domain.
   Check (`ref2_checks.json` item4): minimum of T_p ht^(s') / (lambda ht^(s')) over 300 and over 1,500 random
   points (y from e^-3 to e^2, p in {2, 3, 5, 7}, s' in [0.05, 1.3]): 1 - 6e-16 in both runs (equality is
   attained high in the cusp).
2. Hecke-sup norm, Lemmas H1 to H3 (PROVED): hold. H1 uses T_m T_n = sum_{d | (m,n)} T_(mn/d^2) and the same rule
   for lambda_theta (defect 1.3e-29 on six pairs). H2: abs(lambda_mu(n)) <= lambda_a(n) <= lambda_theta(n) for
   a <= theta; for a > theta the ratio at p^k is at least (p^((k+1)a) - p^(-(k+1)a)) / ((p^a + p^-a)(k+1) p^(k theta)).
   Two-truncation note: at p = 2, a = 1/4, theta = 0.20 the supremum over k <= 30 is exactly 1.000 and over
   k <= 60 it is 1.154: on one prime the divergence is not visible before k of about 45. The lane's figure
   (4.1e10, product over p <= 13, k <= 60) is a product of such local suprema. The statement is the proof, not
   the number.
   Lemma Q (PROVED-rel c4 Lemma 1): the inequality sum_{dd' = n} e^(theta abs(log(d/d'))) <= 2 lambda_theta(n)
   holds (ratio at most 0.978 for n <= 120, three theta). The identification T_n = sum U(log(d/d')) on
   eigenfunctions of moderate growth outside L^2 is relative to the c4 lemma and to finite propagation speed (the
   lane's weakest step 2).
3. L^q, q < 2, Lemma E (PROVED from classical properties): holds. f_rho in L^q iff q(1/2 + a) < 1; the series
   E(., w') with 1/2 < Re w' < 1/q are in the space with eigenvalue lambda_(w'-1/2)(p).
4. Zero-mode space Y_out, Lemma O (PROVED): holds. a_0(T_p f)(y) = p^(-1/2) a_0(py) + p^(1/2) a_0(y/p); the zero
   mode of E(., w') is y^(w') + phi(w') y^(1-w') for all y > 0. The identification of the rate statement with
   Zagier's criterion is CLASSICAL, recalled, not opened.

## The mean-zero addition (derived independently in this pass, then compared)

E(., w) with 0 < Re w < 1 is integrable with integral 0 (flux of the zero mode at height Y: w Y^(w-1) +
phi(w)(1-w) Y^(-w) -> 0). So f_rho lies in X_0 = {f in X: integral 0} when X is inside L^1; T_p preserves X_0;
Theorem L says nothing there. Repair: a solid X containing f_rho contains every E(., w') with 1/2 <= Re w' <=
1/2 + a, because abs(E(z, w')) <= C y^(Re w') <= 2C abs(f_rho) high in the cusp and both are bounded below it.
These series have integral 0 and are T_p-eigenfunctions with eigenvalue lambda_(w'-1/2)(p); at w' = 1/2 + a the
eigenvalue is p^a + p^(-a) >= abs(lambda_mu(p)) (item4: the maximum of abs(lambda_nu(2)) over 0 <= Re nu <= 1/4 is
2.0301 = 2^(1/4) + 2^(-1/4)). So on X_0 the bound is implied by membership and EIS-w passes. The addition holds.
What it does not cover: invariant subspaces smaller than X_0 (on the line spanned by f_rho the norm of T_p is
abs(lambda_mu(p)) trivially).

## Label restrictions

1. Corollary L1 "a solid norm reads 0 <= beta <= 1 and nothing else": add "as an operator norm on X; on the
   mean-zero subspace the bound is implied by admissibility".
2. Decisive test part (iii) and the device row "Not covered" sentence: ARGUED, a statement about classes of
   constructions.
3. Lemma Q: PROVED-rel c4 Lemma 1 and the wave evolution of non-L^2 data (not written out).
4. "BLS" in the control table is the lane's reading (inner factors in the scattering coefficient).
5. Zagier's criterion, Sarnak's exponent 1/2, Kim-Sarnak interpolation: recalled, not opened.
6. Incident: the first run overwrote the untracked repo-root `checks.json`; no repair is possible from this lane.

## Comparison with the lane's REFEREE.md (read afterwards)

Its repair of the mean-zero subspace is the same argument. No disagreement.
