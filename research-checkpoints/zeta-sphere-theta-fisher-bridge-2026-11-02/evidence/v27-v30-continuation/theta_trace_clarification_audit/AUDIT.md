# Trace versus curvature clarification audit

Independent analytic PASS, 2026-11-03. No floating theta probe is certified by this review.

H=B' and R are distinct: H has the actual normalized same-parity blocks I/2, whereas R is the Green defect with one less spatial h factor. Thus traceH=(N+1)/2 does not normalize traceR. Using the independently checked boundary squares gives traceR=2 sum_j integral h(T_j phi)²/sigma_j-2 sum_j B_j. The displayed inequality is exactly equivalent to traceR>=0, with normalized boundary costs used consistently.

For the proposed smooth even positive analytic family, -(logphi)''=epsilon²/(h²+epsilon²)^(3/2)+2delta. The claimed first-derivative majorant follows from |h|/sqrt(h²+epsilon²)<=1 and sqrt(h²+epsilon²)>=|h|. Therefore all displayed weighted phi/phi' integrals converge as epsilon→0 for fixed positive delta, including the boundary phi(0)²→1.

For the limiting halfline exponential, let I_k=k!/2^(k+1). Expanding exp(-2delta h²) and (1+2delta h)² gives integral phi²=I0-2delta I2+O(delta²)=1/2-delta/2+O(delta²); integral h²phi'²=I2+delta(4I3-2I4)+O(delta²)=1/4+O(delta²); integral hphi'²=I1+delta(4I2-2I3)+O(delta²)=1/4+delta/4+O(delta²). Also sigma0=4(I2-2delta I4)+O(delta²)=1-6delta+O(delta²). The raw first-tilt sigma1 formula gives delta+O(delta²), strictly positive for small delta. The remainder orders follow by dominated polynomial Taylor estimates for delta≥0 near0.

R00=1/2+O(delta), whereas R11=(-1/2+delta/2+O(delta²))/(delta+O(delta²)); hence traceR=-1/(2delta)+O(1)<0. Choosing delta first and sufficiently small epsilon second preserves positive current pivots and negative trace by continuity. It is the smooth analytic profile, not merely the cusp limit, which is the counterexample.

Under phi(h)→phi(sh), sigma0 scales s^-3, sigma1 s^-1, R00 and R11 each scale s. Log-curvature lower bound scales by s²; s=sqrt(17/(2delta)) gives at least17. Thus the inference from positive current N1 parity prefix and strong uniform log-curvature to traceR>=0 is false. This family is not the complete theta profile and does not include its modular/arithmetic identities. It does not refute actual theta trace positivity or the full correlated payment criterion. No growing-degree sign or asymptotic theorem for theta is inferred. v26 remains unchanged.
