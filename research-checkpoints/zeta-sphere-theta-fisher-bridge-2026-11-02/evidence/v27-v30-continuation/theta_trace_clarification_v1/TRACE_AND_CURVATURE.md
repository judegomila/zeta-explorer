# Trace R is an additional boundary-versus-mass comparison

New analytical clarification awaiting independent audit. This separates a valid prefix positivity consequence from an invalid curvature shortcut. The counterfamily below is not the theta profile and is not a counterexample to RH or to the full scalar payment criterion.

## 1. Exact definitions and what the positive prefix provides

For the actual complete theta phi=psi_lambda and normalized physical prefix Y_j=T_j(D)phi/sqrt(sigma_j), let K_j=T_j'(D)phi/sqrt(sigma_j), M_r=integral_0^infinity h^r YY^T, and K=Cconn Y. Two different matrices occur:
 H=B'=2M_2+Cconn M_1+M_1 Cconn^T,
 R=2M_1+Cconn M_0+M_0 Cconn^T.
H is the first tilt derivative of the positive half-line h-Gram. R is its physical Green-adjoint defect, H(f,Dg)+H(Df,g)=-R(f,g). It is not another notation for H.

Known actual normalized signed-prefix positivity implies H_ij=delta_ij/2 WITHIN each parity. Thus trace H=(N+1)/2. It imposes no such diagonal normalization on R. R has zero opposite-parity blocks, but its same-parity entries retain the actual boundary residue. In particular trace R need not equal(N+1)/2, N+1, or a positive squared norm.

The exact actual-theta inequality trace R>=0 is
 sum_(j=0)^N [integral_0^infinity h(T_j(D)phi)^2 dh]/sigma_j
 >= sum_(j=0)^N B_j,                                  (1)
where B_j is the nonnegative boundary-square expression in the audited BOUNDARY_SQUARES note. Every T_j and sigma_j is from the CURRENT actual prefix. All even theta jets on the right can be evaluated using the complete orbit recurrence. No next pivot enters (1).

This is only a trace comparison. Even proving(1) does not prove the scalar modular payment: the lower current-parity components in4y^Tc_W' and the entire signed quadratic -2gamma^THgamma must still be retained.

## 2. Analytic obstruction to deriving(1) from prefix positivity and log-curvature alone

Consider the smooth, positive, even, real-analytic profile
 phi_(epsilon,delta)(h)=exp[-sqrt(h²+epsilon²)-delta h²], epsilon,delta>0.
It has Gaussian decay and
 -(log phi)''=epsilon²/(h²+epsilon²)^(3/2)+2delta>=2delta.
For fixed delta>0, let epsilon->0. The profile and first derivative converge in all weighted integrals used below to the half-line formula phi_delta(h)=exp(-h-delta h²), h>=0. Dominated convergence applies, since |phi'|<=(1+2delta|h|)exp(-|h|-delta h²), while phi(0)->1.

For current degree N=1 the actual monic polynomials are T_0=1,T_1=D. Their normalized signed pivots are
 sigma_0=4 integral_0^infinity h² phi²,
 sigma_1=4 integral_0^infinity h²(phi')²-2 integral_0^infinity phi².
Both are exact first-tilt conventions, matching H parity entries1/2.

Expanding at delta=0 on the limiting half-line profile, using integral h^k exp(-2h)=k!/2^(k+1), yields
 integral phi²=1/2-delta/2+O(delta²),
 integral h²(phi')²=1/4+O(delta²),
 sigma_0=1-6delta+O(delta²),
 sigma_1=delta+O(delta²)>0.
The two residue diagonals are
 R_00=2 integral hphi²/sigma_0=1/2+O(delta),
 R_11=[2 integral h(phi')²-phi(0)²]/sigma_1.
Since integral h(phi')²=1/4+delta/4+O(delta²),
 R_11=[-1/2+delta/2+O(delta²)]/[delta+O(delta²)],
 and consequently trace R=-1/(2delta)+O(1)<0.
Choose delta sufficiently small and then epsilon sufficiently small; continuity preserves BOTH strictly positive current pivots and strictly negative trace R for the smooth analytic profile, not just the cusp limit.

Finally replace phi(h) by phi(sh). Then sigma_0 scales as s^-3, sigma_1 as s^-1, both normalized residue diagonals scale as s, and their trace retains its sign. Taking s=sqrt(17/(2delta)) makes the log-curvature lower bound at least17. Any other prescribed positive curvature bound is handled identically.

Thus even the combination of actual positive current parity prefix and a uniform log-curvature bound as strong as the known theta bound does not logically imply trace R>=0. This is an analytic counterfamily to that proposed inference only. It does not decide the inequality for the complete theta function.

## 3. Consequence for further theta work

The complete theta orbit/incomplete-gamma data might enforce a sharper boundary-versus-mass comparison than curvature alone. It must be proved for(1), retaining the true sigma_j denominators and the simultaneous root-dependent boundary squares. Existing positivity of the individual orbit law, the continuous gamma model, or the positive parent Gram cannot replace this comparison. At present neither(1) nor its failure for growing theta degree is established here.
