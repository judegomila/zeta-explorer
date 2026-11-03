# Independent regularized arithmetic payment audit

Analytic PASS without corrections, 2026-11-03. No numerical ladder run or acquired-code execution.

DLMF25.2.8 (https://dlmf.nist.gov/25.2#E8), independently read, confirms the inclusive finite sum, positive integral counterterm, and negative fractional-part remainder -s integral_N^infinity {x}x^(-s-1)dx. Its derivative is bounded by the displayed N^-sigma[1/sigma+|s|(logN/sigma+1/sigma^2)]. Multiplying by A and differentiating gives E0/E1. Expansion of X_N+e yields exactly the two linear weighted Cauchy errors and E0E1. Gamma decay makes each weighted norm finite; A,A' are regular at sigma=1 and X_N is interpreted after removable pole cancellation. For fixed sigma and fixed p, weighted convergence also bounds X_N,X_N', giving the claimed O(N^-sigma logN) error. No uniform-degree constant follows.

F(t+ia)=2xi(1/2-a+it)=2xi(1/2+a-it); conjugation and functional symmetry therefore give L_a[p^2]=8 Re integral p^2 xi' conjugate(xi), including general real p, with p frozen.

For N1, pole cancellation gives X1=.5s^2 pi^(-s/2)Gamma(s/2). The beta transform is 4pi Gamma(sigma)/(2cosh u)^sigma, so t^2 and t^4 moment ratios are sigma and sigma(3sigma+2). Expansion of (sigma^2+t^2)^2 yields sigma(sigma+1)(sigma^2+sigma+2), proving the exact M1 formula. Differentiation gives2K1/M1. At sigma3/4, digamma monotonicity, gamma>.57 and log(2pi)>1.8 yield -611/5300 for the ratio and -611/10600 for K1/M1, both strict. Euler's constant bound is also documented by DLMF5.2.3.

This is an actual regularized-approximant counterexample at the scalar level, not an actual theta pivot failure. The complete scalar target remains positive. The error estimate is a valid finite-degree sufficient test, but establishing K_N[p_n]>E_N[p_n] without assuming the true pivot is the still-unpaid all-degree statement. Conditional eventual success is not a proof of the target sign.
