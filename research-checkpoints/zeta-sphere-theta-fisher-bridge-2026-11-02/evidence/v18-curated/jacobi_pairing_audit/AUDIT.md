# Independent Jacobi/arithmetic coupling audit
2026-11-02 23:24 UTC. Mathematical identities PASS; two wording refinements requested before freeze.

q=e^(u/2)theta(e^(2u)) is even by Poisson, and (D²-1/4) annihilates its constant theta contribution. Differentiating each nonzero orbit gives exactly8z²-12z after combining +/-n. Heat normalization1/(4pi) and derivative-polynomial recurrence checked.

Reflection h->-h makes every full product jet and even bridge weight identical. Its reflected feature vectors coincide, so their angular covariance term is exactly zero. This does not mean the feature graph edge vanishes: identical nonzero vectors have positive inner product. Requested replacing 'no positive edge budget' by 'no new nonparallel angular reserve' to preserve that distinction.

For local positive-half-line integrals, 2h² e^h dh becomes(1/4)x^-1/2(log x)²dx. At positive shift, h*sinh(2ah)*e^h dh/a becomes(log x)/(8a)*x^-1/2*(x^a-x^-a)dx. Therefore the factors1/4 and1/(8a), Mellin parameter k+l+1/2, binomial signs, and removable a0 limit all agree. Odd total jets cancel algebraically. Absolute convergence is justified for each fixed finite degree and bounded shifts because x>=1 and the full n,m Gaussian factors dominate powers/logs. No negative-h orbit interchange is invoked.

The tail estimate follows from n=M+l, log(1+l/M)<=l/M and n²>=M²+2Ml; pi*M²>d guarantees a positive denominator uniformly x>=1. Union bounding omitted double-index regions is safe. For shift bounds uniformly including a=0, requested explicit inequality (x^a-x^-a)/a<=2 log(x) x^amax; bounding each power alone and retaining1/a is not uniform. This is an elementary repair, not a defect in the exact representation.

The representation preserves all arithmetic cross terms and signs. Scalar incomplete-gamma positivity does not establish the signed matrix-anchor budget or control inversion by the complete lower block. No all-order positivity result follows.

## Final wording and positive-orbit transport companion
Requested a0-uniform tail and angular-versus-graph clarifications have been incorporated. Final mathematical status PASS.
The companion multiplier is exactly lambda^(5/4)(2lambda*z-3)/(2z-3) exp(-(lambda-1)z): lambda from z and lambda^(1/4) from e^(h/2). Positivity and denominator separation hold for z>=pi. Its finite-degree differentiated transport is the full Leibniz expansion, with D=2z partial_z acting on m_s and the explicitly signed higher terms retained. Log-derivative ell1, recursive ellr, Bell-polynomial formula, and normalized probability transport all check. Local convergence including s=0 follows from Gaussian lattice tails on compact h,s sets. Normalizing a diagonal multiplier gives only an ordinary orbit-l2 contraction, not the A-whitened differentiated-feature estimate. No all-degree norm control is supplied. Companion PASS.

## Monotone-likelihood-ratio addition
The exact simplification ell1=-2z(lambda-1)[1+6/((2lambda z-3)(2z-3))] is negative for s>0. Therefore normalized heat reweighting decreases expectations of any fixed increasing orbit-index function with finite expectations, by the displayed symmetric covariance identity. The one-orbit score9/2+6/(2z-3)-2z and its negative derivative are correct. Differentiating log sum f_n gives E[-4z-24z/(2z-3)^2]+Var(score), retaining the positive variance and explicit drift. This proves a genuine cone-order inequality, but high jet ratios/whitened features need not belong to that cone. Addition PASS without an all-degree anchor conclusion.
