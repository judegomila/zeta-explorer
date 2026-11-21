# toeplitz-krein: referee pass on the first reviewer's verdict (2026-11-20)

## What I ran (all under scripts/memcap.sh 8, IEEE double, about 1 minute total)

`referee/xspace.py` -> `referee/xspace.json`. A computation that shares no code path and no analytic reduction with the
certificate or with the first reviewer's Nystrom check:

- x-space form, from Gauss's integral for psi:
  (1/2pi) int Re psi(1/4+it/2)|hhat|^2 dt = -gamma g(0) + int_0^inf 2[e^{-2u} g(0) - e^{-u/2} g(u)]/(1-e^{-2u}) du,
  g = autocorrelation of h; prime term = sum 2 Lambda(n)/sqrt(n) g(ln n).
  No digamma evaluation, no truncation height T, no floor m_T, no Bessel functions.
- Orthonormal Legendre Ritz basis, N = 12..80. Ritz values are UPPER bounds on the infimum, so this is the attacking direction:
  a Ritz value below 8.2045e-4 (or 9.0435e-4) would refute the certificate.

Results (smallest eigenvalue):

| 2a | N | pole-free | full form (pole term added) | certificate / published |
|---|---|---|---|---|
| ln 2 | 80 | 0.547036 | 1.32931e-3 | reviewer 0.5467, 1.3288e-3; Connes-Consani ~0.00133 |
| 1.0 | 80 | 0.011873 | 9.346e-7 | reviewer 0.0118, 9.317e-7; Zhu 9.40e-7 (16 modes, upper) |
| ln 3 | 20/30/40/60/80 | 9.769 / 9.520 / 9.486 / 9.467 / 9.458 e-4 | 5.544e-8 (N=80) | Arb lower bounds 8.2045e-4, 9.0435e-4; reviewer limit ~9.44e-4; CC "< 6e-8" |
| ln 3, no prime | 40 | 0.08251 | -0.430 | reviewer 0.0824, -0.43 |
| ln 3, kappa = 0.99 / 1.005 / 1.0064 / 1.01 | 40 | 2.43e-3 / 2.05e-4 / -3.4e-6 / -5.4e-4 | negative | reviewer: sign change at 1.0064 |

The Ritz sequence at ln 3 decreases slowly (increments 1.9e-6, 8.7e-7 for N 40->60->80), consistent with a limit near
9.44e-4 to 9.45e-4, above both certified constants. No Ritz value falls below the certified bounds. The unconstrained symbol
form has exactly one negative eigenvalue (-2.17) and second eigenvalue 9.4607e-4, i.e. essentially the pole-free minimum.

## Assessment of the first verdict

1. "confirmed" is deserved for the statement as they restated it (pole-free subspace, 2a <= ln 3, constants 8.2045e-4 and
   9.0435e-4). Evidence now has three layers: (i) replay of the Arb script (same code path: this checks reproducibility, not
   correctness); (ii) the reviewer's t-space Nystrom check (different discretisation, but the same T-truncation and floor
   reduction and the same digamma symbol); (iii) my x-space Ritz check, independent of the reduction as well. (ii) and (iii)
   are non-rigorous doubles. The rigorous status therefore still rests on one Arb script, audited by reading. I read it and
   checked the legs most likely to hide an error: floor step (Re psi(1/4+it/2) increasing in |t|), ellipse semi-axis 0.35 < 1/2,
   Trefethen exponent rho^{-2(Q-1)} for Q nodes (conservative), |j_n(zeta)| <= sinh|Im zeta|/|Im zeta|, Weyl shift by the
   row-sum of radii, sign pattern of the Legendre transforms. I found no error. Nobody has written a second rigorous
   implementation, and the Lean replay (matrix step only) was not rebuilt by either of us.
2. The first reviewer's framing corrections stand and I verified the numbers behind them: the full form at ln 3 has smallest
   eigenvalue 5.5e-8 and is not certified; the pole-free form is positive with the prime deleted (0.0825); the listing merges
   the LP "Toeplitz/Krein" certificate (reach 0.96) with the Arb Galerkin certificate (reach ln 3).
3. Literature. I confirmed by search/fetch that arXiv:2608.24827 exists (X. Zhu; v1 25 Aug 2026 9-page announcement, v2 2 Sep 2026
   34 pages), claiming certified positivity of Weil's form for window [-0.8, 0.8]. Full-form positivity on a window implies
   pole-free positivity on that window (the pole term vanishes on the subspace), so if that preprint is correct it subsumes the
   qualitative statement here on a wider window; it does not give the constant 8.2e-4. I did not check its proof. Additions to
   the reviewer's list: Bombieri, "Remarks on Weil's quadratic functional in the theory of prime numbers, I" (Rend. Lincei 2000),
   re-proves Yoshida's small-support positivity and relates negative eigenvalues of the truncated form to off-line zeros;
   Burnol, C. R. Acad. Sci. 2000 (math/0101068), small-support positivity. Small corrections: the Connes-Consani value 0.00133
   (Fig. 5 of arXiv:2106.01715) is for the archimedean even matrix at L = log 2 (identical to the full form there since no
   prime enters); that paper's test functions are not restricted to vanish at the poles; its positivity statements for
   log 2 <= L < log 3 are numerical observations. I found no refereed proof for ln 2 < 2a <= ln 3. Effort: 3 searches, 2 fetches.
4. Scores. Arbitrariness 2: unchanged. Importance 2: unchanged, at the low end of 2. An expert would regard it as a sound
   computer-assisted lemma for a statement already observed numerically (2021) and claimed in stronger form in an earlier
   preprint; it constrains no zero and nothing about Lambda.
5. One-line: the reviewer's sentence is accurate. I add "with the Arb enclosures trusted" is implicit in the status label.

## Public wording that should change
- Title: "Toeplitz/Krein certificate" -> name the Arb Galerkin certificate, or state that the LP certificate reaches 0.96 only.
- statusNote "Comparison with the small-support literature has not been made" is out of date (Connes-Consani 2021 numerics;
  Zhu 2026 preprint claiming the full form to 2a = 1.6).
- "The same range is also implied by the verified zeros" relies on an internal theorem neither reviewer rechecked.
