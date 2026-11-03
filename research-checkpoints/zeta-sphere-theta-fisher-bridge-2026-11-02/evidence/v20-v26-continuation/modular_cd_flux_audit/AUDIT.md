# Both-parity modular reflection / CD audit

Analytic PASS, 2026-11-03; final Section6 and reflection-eigenvector addition checked. Independently replayed check_reflection.py for N=0..6; all exact symbolic checks passed. The general identities were checked algebraically, not inferred from those examples.

The normalization psi=(D²-1/4)[exp(u/2)theta(exp(2u))] gives the full density8z²-12z per positive orbit. Poisson reflection makes psi even; multiplying exp(lambda u²) preserves it. Thus g(-u)=exp(-2au)g(u) exactly, not approximately for a finite orbit cutoff.

The even bridge moment functional makes the full monic polynomial family alternate parity. With s0,...,sN>0 and Tj=i^j pj(-ix), recurrence Tnext=xTj+beta_j Tprev gives Y'=XY+eN Z, X skew, Z=Fnext/sqrt(sN). It uses no square root, sign, or inverse of the unknown next pivot.

Reflection is represented by lower triangular R, R²=I, diag R=(-1)^j. Differentiating Y(-h)=exp(-2ah)RY(h), with the unnormalized next reflection, yields XR+RX-2aR=-eN r^T. Leading coefficients give rN=2a(N+1)(-1)^N; multiplying by R and taking trace gives the same sign. The reflected first-order CD flux cancels its leading ZY_N terms exactly, leaving the displayed lower-degree cross expression. Its sign is unproved.

G=I+R^TR is positive and R^TGR=G. The modular midpoint plus/minus R eigenspaces are G-orthogonal, yielding Y(0)^T GY'(0)=aY(0)^T GY(0). This is a statement in G, not the target I metric.

For C=GX-XG, transposing the rank-one relation and subtracting gives C=4aR^TR-vr^T-rv^T, v=R^TeN. Since R is an involution, R^TCR=4aI-eNw^T-weN^T with w=R^Tr and wN=2a(N+1). For z=(z_<N,zN), its form equals
4a sum_(j<N)(zj-zN wj/(4a))² - [4aN+sum_(j<N)wj²/(4a)]zN².
For a>0,N>=1 this has exactly N positive and one negative direction by invertible completion of squares; N=0 gives zero. This is a congruence/inertia statement, not a bound on eigenvalues in the actual target metric. The single negative channel must still be paid by the true boundary/source interaction. An invariant positive modular metric alone cannot prove target positivity.

Scope: raw a>0 and both actual parity prefixes through degreeN positive. Modular evenness and orthogonal-polynomial algebra provide a concrete finite-rank reduction; they do not give any theta-specific sign inequality, all-order induction, or RH proof. A normalized a=0 limit needs separate justification. v22 remains unchanged.

Final addition: applying next-polynomial reflection twice gives R^T r=(-1)^N r. Therefore the displayed kappa using ||r_perp|| agrees with ||w_perp||. No new sign assumption enters.
