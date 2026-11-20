# Referee report: vertical-statistics/RESULT.md (2026-11-16)

Verdict under review: precise obstruction. Referee finding: every step labelled PROVED was re-derived and survives.
The headline is worded more broadly than what is proved (see E2). No RH assumption, no verified-height restatement.

## Re-derivations

- D1 (Ingham-type, line alpha, m-th moment). Hoelder: R * Y^(sigma-alpha) << (sum|zeta|^m)^(1/m) (sum|M_X|^2)^(1/2) R^(1/2-1/m),
  so R^(1/2+1/m) << Y^(alpha-sigma) T^(1/m) (T+X)^(1/2). X = T gives R2 << T^(1-f*eta*(sigma-alpha)), f = 2m/(m+2);
  balance with Y^(2-2sigma) gives A = 2/[(2-2sigma)+f(sigma-alpha)]. alpha=1/2, m=4 gives 3/(2-sigma). CONFIRMED.
- ZF branch monotonicity. D = 2K(sigma-alpha)/(K+2theta-2alpha); numerator of dD/dalpha is 2sigma-2theta-K < 0. CONFIRMED.
  Also checked: Gabriel from the other table base points (1/2,4) and (5/8,8) does not beat the table below 35/54,
  and on the table branch 4/(3-4alpha) the same sign computation gives 4sigma-5 < 0. So the left end is alpha=1/2.
- D2 floor A >= 2. Conclusion CONFIRMED by my own case analysis (X<=T: class I term T X^(1-2sigma) >= T^(2-2sigma);
  X>T with Y>=X: Y^(2-2sigma) >= T^(xi(2-2sigma)); Y<X: class II alone gives (T+X) X^(-2(sigma-alpha)) >= T^(2-2sigma)
  for alpha >= 1/2, and the X^(1-2alpha) mollifier factor restores the same bound for alpha < 1/2). The written
  proof has defects, see E1.
- S1. g real on the axis, sign-change count, Jensen with radii r, 2r, max|g| <= T^(mu(c-R)+eps),
  mu(1/2-u) = u + mu(1/2+u). CONFIRMED. Minimum at x=2: proved analytically here (for x>=2, (x-1)/ln x increases;
  on (1,2) the derivative numerator N(x) is increasing when a>kappa and N(2) = a(ln2-1/2) - kappa ln2 < 0 iff
  a < 3.59 kappa = 0.556; when a<=kappa N<0 termwise). So "for every a <= 3/8" is correct; it fails for a > 0.556
  (numerically the minimiser moves to x=1.9937 at a=0.56).
- S2. Gap > 4 pi a/ln2 and multiplicity <= 2a/ln2 log gamma follow from S1. CONFIRMED (weak, as stated).
- M1. Gabriel two-line convexity with sup-norm line theta+delta gives m(sigma) >= m0 (theta-sigma0)/(theta-sigma).
  CONFIRMED given (I1). Base point m(35/54) >= 9: both adjacent table branches give 9 exactly; consistent with
  alpha_9 <= 35/54.
- M2. alpha_k <= sigma when m(sigma) >= k (Perron; Ivic Thm 13.2). 7/8 - 49/(24k) >= 35/54 iff k >= 9. CONFIRMED.

## Numeric reruns (different test cases from checks.py)

- K maximisation on a different grid: max 2.04166 at 0.64815 = 35/54. ZF moment exceeds the table at all 9972
  test points of (35/54, 7/8).
- D1 optimum at 8 random off-grid sigma in (0.55, 0.874), 4001 alpha values: optimum alpha = 1/2, value 3/(2-sigma)
  in all 8.
- S1 minimum for a = 0.01, 0.0719, 0.2, 0.3, 0.375, 0.5: x = 2, value a/ln2.
- M2: crossover against 1 - 1.889 k^(-2/3) is k = 32 (fails at 31). ZF value at k=60 is 0.84097 against 0.91797.

## Errors and gaps

E1 (D2 proof text, minor, conclusion unaffected). The stated class II condition eta(sigma-alpha) >= xi(1-alpha) - E/2
   is the alpha <= 1/2 form (mollifier mean value X^(2-2alpha)). For alpha > 1/2 the condition is xi/2 - E/2, which
   gives E >= xi(1-sigma)/(1-alpha) >= xi(2-2sigma). The case Y < X is not treated. "m = infinity means
   zeta << T^eps on the line alpha" is not available for alpha < 1/2 (mu(alpha) >= 1/2 - alpha).
E2 (scope of the headline). "No density exponent on (1/2,7/8) improves" is proved only for (i) the single-moment
   Ingham-type scheme and (ii) the pointwise Halasz-Montgomery-Huxley step, the latter in the sibling and not
   re-derived here. Jutila, Heath-Brown and Guth-Maynard type mixed methods are covered by inspection only
   (the note says so in weakest step 2). The table rows D3/D4 and the verdict sentence should say "for the
   methods examined".
E3 (second control, loose). "D1-D3 hold for E_b with theta replaced by Theta+b" is not accurate as written: E_b
   has no T^(1+eps) fourth moment on Re s = 1/2, so D1's base point does not transfer. What transfers is (I1)-(I3).
   The conclusion drawn (no zero-free statement below theta from (I1)-(I3) alone) stands.
E4 (M2 wording). The Bellotti-Yang comparison "for all k >= 58" is the range of validity of their formula, not a
   crossover; the ZF bound is below that expression wherever it is stated.
E5 (inputs not re-read). Ivic Theorem 8.4, the 0.1038/0.10076 constants and the Bellotti-Yang ranges are recalled.
   M1/M2 depend on the single entry m(35/54) >= 9. The t-localisation in Gabriel's convexity is not written.
E6 (S2). The remark on Littlewood's gap theorem is a sketch and is not a proved step.

## DH control

ZF(theta) is false for Davenport-Heilbronn (zeros with Re s > 1), so every conditional statement is vacuous for it.
That is an acceptable pass: the Euler product enters only through the hypothesis and (I1). Nothing unconditional
and new is claimed, so there is no statement that would need to fail for DH.

## Is the obstruction real?

For the two methods treated, yes: the loss Y^(alpha-sigma) outweighs the moment gain (sign computation), and the
unconditional literature is already below the Ingham-type floor A=2 near 7/8 (1.86 at 0.87), so that scheme
could not give a record in any case. Routes not closed by this note:

1. Mixed large-value methods (Heath-Brown, Guth-Maynard) fed with the ZF chord mu(alpha) <= kappa(theta-alpha)/a
   or the M1 moments on lines 1/2 < alpha < 2 sigma - 1. The chord is slightly below recalled unconditional
   values (0.066 against 1/14 at alpha = 5/7). The monotonicity argument covers only the plain Halasz-Montgomery
   threshold.
2. Arithmetic information on the detector coefficients: ZF(theta) gives M(x) << x^(theta+eps), i.e. cancellation in
   partial sums of a_n, which mean-value steps using |a_n|^2 discard.
3. A newer unconditional moment base point raises K in M1/M2 (changes constants only).

I see no reason to expect a gain from 1 or 2, but they are not excluded by what is written.

## Outcome

holds = true for the PROVED items (D1, D1 monotonicity, D2 conclusion, S1, S2, M1, M2). Verdict "precise
obstruction" stands with the scope restriction in E2. RH open; nothing here moves theta.
