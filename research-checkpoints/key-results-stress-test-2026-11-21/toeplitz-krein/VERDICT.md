# VERDICT: toeplitz-krein

## Statement that the material supports
For every a <= (ln 3)/2 and every h in L^2(-a,a) with int h(x) e^{x/2} dx = int h(x) e^{-x/2} dx = 0,

  W(h) = (1/2pi) int [Re psi(1/4 + it/2) - ln pi - sqrt2 ln2 cos(t ln2)] |hhat(t)|^2 dt >= 8.2045e-4 ||h||^2   (9.0435e-4 from the T=400 run).

This is Weil's quadratic form (archimedean term minus the p = 2 term) restricted to the codimension-2 subspace of test functions
whose transform vanishes at the two poles. It is a computer-assisted result: Arb ball arithmetic (python-flint, 256 bit),
trusting Arb's special functions, a cited Gauss-Legendre error theorem and the script. A Lean file replays only the finite
linear-algebra step. Corollary: lambda_1(T_a[sigma_2]) >= 0.0583 for 2a <= ln 3.

## Verification: confirmed
- Re-ran the Arb certificate (copy with redirected outputs): T=200, N=240 gives cLower = 8.2045368715952e-4, identical to the record;
  T=400, N=320 gives 9.04347177663e-4 (record 9.04347177660e-4). Perturbed quadrature (Q=20, ellipse 0.30, N=160) still certifies 8.14986e-4.
- Independent double-precision computation by a different discretisation (x-space Nystrom, no Legendre/Bessel) gives
  lam_min = -0.112808156713336 (T=200) and c = 8.2045369714e-4, 9.0434725357e-4 (T=400), inside or at the edge of the Arb enclosures.
  Extending T to 3200 gives 9.438e-4; the infimum is about 9.44e-4 to 9.5e-4.
- Re-derived the analytic steps (basis transform, floor, quadrature exponent, tail, constraint handling); no error found.
- Normalisation cross-check against the literature: with the pole term added, my code gives 1.329e-3 at 2a = ln 2, 9.32e-7 at
  2a = 1.0 and 5.52e-8 at 2a = ln 3; published values are ~1.33e-3 and < 6e-8 (Connes-Consani 2021) and 9.40e-7 (Zhu 2026).

## What the stress tests show
1. The certified statement is weaker than Weil positivity on the window as the literature uses the term. The full form (with
   pole term, all of L^2(-a,a)) has smallest eigenvalue about 5.5e-8 at 2a = ln 3; the certificate covers only the pole-free
   subspace, where the margin is 9.4e-4. Pole-free positivity on a fixed window does not imply the full statement.
2. The pole-free statement does not need the prime. With the p = 2 term deleted the margin is 0.082; the prime term lowers it to
   9.4e-4. Positivity survives a fictitious prime anywhere in about [1.2, 2.0012] and any weight factor in about (-0.7, 1.0064).
   It is a one-sided bound on the size of the p = 2 term. The full form, by contrast, is positive only for q and weight within
   about 1e-4 of the true values.
3. The project's own Davenport-Heilbronn record reports the same positivity for a function with off-line zeros (not re-run here).
4. No tuned constant affects the truth of the statement; T, N, Q, ellipse width only change the certified constant
   (8.15e-4 to 9.04e-4 against an infimum near 9.44e-4). The endpoint ln 3 is canonical (next prime).
5. Naming: the Arb certificate is a Galerkin-plus-tail certificate (ARB-LEGE). The Toeplitz/Krein LP certificate proper reached
   only 2a <= 0.96 with mpmath interval arithmetic.

## Literature
- Proved before: 2a <= ln 2 (Yoshida 1992; Connes-Consani, arXiv:2006.13771), where no prime enters.
- Numerically observed before: positivity of the full form on ln 2 <= 2a < ln 3 with the prime 2, and its sensitivity to p
  (Connes-Consani, arXiv:2106.01715, sec. 2.2-2.3).
- Certified claim that predates and exceeds this one: Zhu, arXiv:2608.24827 (25 Aug 2026, unrefereed): full form, support
  [-0.8,0.8] (2a = 1.6), lower bound 8.9e-18, by essentially the same method in 50-digit mpmath. Not verified by me.
- No refereed proof for ln 2 < 2a <= ln 3 found (limited search).
Classification: certificate of a statement that is expected, numerically known since 2021, and weaker than an existing
(unrefereed) certified claim. The remaining distinguishing feature is the use of ball arithmetic and the Lean replay of the matrix step.

## Scores
- Arbitrariness 2/5. Endpoint, form and subspace are natural (the pole-free restriction is the one used by Connes-Consani); the
  constant 8.2e-4 depends on T and is not the infimum; the title conflates two certificates.
- Importance 2/5. No consequence for RH, zero locations or the de Bruijn-Newman constant; a fixed-window statement at a width where
  only p = 2 enters, on a subspace where the prime is not needed for positivity. A specialist would treat it as a reproducibility
  check on small-window Weil positivity, of less scope than Zhu's claim.

## Corrections suggested for the public entry
- Replace "Comparison with the small-support literature has not been made" by the comparison above.
- State that the full form at this width has margin about 5.5e-8 and is not covered.
- State that the pole-free form is positive without the prime term (margin 0.082), so the result is a bound on the p = 2 term.
- "Also implied by the verified zeros" depends on an internal theorem (RES-T) that was not rechecked in this review.
- Rename or split: Arb certificate (ln 3) vs Toeplitz/Krein LP certificate (0.96).
