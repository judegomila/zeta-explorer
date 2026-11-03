# Gaussian baseline for the paired innovation gap

Status: independent analytic audit PASS. Gaussian all-degree calculation, not a complete-theta estimate.

Use the endpoint paid-Schur identity of PAID_SCHUR_NEXT: Xp=2h p(D)ψ+p'(D)ψ and Yp=p'(D)ψ on L²(0,∞), with the old space P of same-parity polynomials through degree n−2. The exact next signed Schur complement is 2S=A_X−B_Y−C_XY; C_XY is the actual old-inverse mismatch and is nonnegative.

For ψ=exp(−ch²/2), let p=T_n be the Gaussian monic Hermite polynomial and F_n=T_n(D)ψ. Its derivative and three-term recurrence give

 T_n'=nT_(n−1),      hF_n=−F_(n+1)/c−(n/2)F_(n−1),
 ||F_n||²=(c/2)^n n! ||ψ||².

The norms and inner products may be taken on either half-line or the whole line, consistently. Consequently

 XT_n=−(2/c)F_(n+1),       YT_n=n F_(n−1).                           (1)

The X and Y images of the old same-parity degrees are orthogonal to the respective new features. Hence both regressions can be chosen zero, and their Y mismatch is zero. For n≥1,

 A_X=(4/c²)||F_(n+1)||²,  B_Y=n²||F_(n−1)||²,  C_XY=0,
 B_Y/A_X=n/(n+1),          2S=A_X/(n+1)>0.                           (2)

The n=1 old space is empty; no inverse is needed. Every Gaussian signed pivot is positive. In particular no fixed δ>0 can make the uniform estimate B_Y+C_XY≤(1−δ)A_X hold at all degrees. The signal-to-innovation ratio is exactly 1/(n+1), even though the surplus is positive.

A theta-specific quantitative hypothesis consistent with this model is, for some δ>0 independent of n,

 B_Y+C_XY ≤ [1−δ/(n+1)]A_X.                                         (3)

Here C_XY must retain the actual old signed inverse and all correlated source cross terms. Unlike the exact inequality with δ=0, (3) is quantitatively stronger than mere positivity; the Gaussian permits δ≤1 and attains δ=1. It is nevertheless an unproved hypothesis, not an arithmetic estimate or proof. It may be stronger than necessary for theta, and no lower bound on its mismatch or degree-uniform δ is known here. A statement with δ=0 simply restates the next-pivot sign through the exact identity.
