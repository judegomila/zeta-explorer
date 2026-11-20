# Local tree payments, adaptive merging, and the limits of refinement

Independent analytic review and both frozen-input numerical replays PASS. Numerical consequences reuse previously certified complete-theta moments; there is no new quadrature or new ladder rung.

## 1. Exact multi-region identity without metric commutation

Let each leaf region have actual old matrix A_i>0, cross column b_i, target c_i, optimizer z_i=-A_i^-1b_i, and signed Schur remainder s_i=c_i-b_i^T A_i^-1b_i. For any binary merge node with children L,R, sum the matrices, columns and target entries to obtain the parent. Then
 s_parent=s_L+s_R+V_node,
 V_node=(z_L-z_R)^T(A_L^-1+A_R^-1)^-1(z_L-z_R)>=0. (1)
Iterating,
 S_global=sum_leaf s_i+sum_internalnode V_node.     (2)
All old inverses are the actual integrated ones. The binary parallel-sum formula is valid for noncommuting matrices. A naive complete-graph formula with presumed positive pair weights is not used.

Refining a valid positive-old leaf into two positive-old children reduces the sum of leaf Schur terms by exactly the additional V_node; it does not change the global S. Changing the merge tree changes the allocation of corrections, not their total. More regions therefore do not create reserve for free.

A local sufficient test at a merge is available if A_L<=gamma A_R:
 s_L+V_node/(1+gamma)>0 and s_R>=0 imply s_parent>0. (3)
This is the reviewed common-imbalance metric bound. Once a subtree has a positive target block, another positive-target block may be appended using(1), with no comparison constant required between them. This is where a tree can avoid an unnecessarily expensive comparison to a remote tail.

## 2. Actual three-region tests in both parity ladders

Take C:|u|<=1/8, M:1/8<=|u|<=1/2, T:|u|>=1/2. Obtain middle moments by interval subtraction of the certified half-core and eighth-core moments. This conservatively retains all original errors; correlations are not assumed to cancel. Both middle old matrices are independently checked positive by interval LDL.

The owned `check_three_region_payment.py` evaluates the tree(C+M)+T using only the four frozen odd7/even6 input moment files. It computes every internal optimizer and correction in its actual metric. Numerical units are h/(4pi).

Odd7:
- s_C is negative, as previously certified.
- s_M>3573645880 and s_T>919945172.
- V_CM>470510430; A_C< (1/8) A_M.
- The local metric-only payment gives s_C+V_CM/(1+1/8)>70475839.
- S_(C+M)>3696400656, and complete tree S>6003487786.

Even6:
- s_C is negative, as previously certified.
- s_M>44888176 and s_T>7736143.
- V_CM>2386577; A_C<(1/4)A_M.
- The local metric-only payment gives s_C+V_CM/(1+1/4)>1165848.
- S_(C+M)>46531340, and complete tree S>63310885.

Thus the critical negative core is paid using a nearby middle region with a small actual metric comparison. After that, the positive remote target block can be appended without its large core-versus-tail comparison constant. The outer correction is still explicitly retained in the full numerical bound. These are finite existing rungs, not a claim that an analogous nearby region works uniformly in degree.

## 3. A concrete theta obstruction to indiscriminate refinement

For the odd old local block on t,t³,t⁵, take the exact integer vector
                       v=(678,-66,1).
`check_fixed_core_witness.py` uses the previously proved full-theta derivative10 bounds and certifies
        v^T A(u)v < -1455319, for0<=u<=1e-8.        (4)
The coefficients are fixed integers; candidate selection is not a floating proof dependency.

Because w=u²psi² is strictly positive for u>0, every nondegenerate spatial bin contained in this neighborhood has a negative integrated quadratic form in the same fixed direction. Its first odd scalar moment remains positive, so that old regional matrix is indefinite. Such bins cannot be leaves in a positive-metric tree, even though the coarser actual core[0,1/8] old matrix is positive.

Therefore arbitrarily fine partitioning is not a monotone improvement. Adaptive merging must absorb harmful local contributions before applying positive-metric variance identities. The certificate does not claim that1e-8 is the maximal negative neighborhood or identify a unique transition.

## 4. Equal scalar mass does not ensure matrix comparability

For an abstract exact counterexample, take
 A=diag(1,epsilon), B=diag(epsilon,1), 0<epsilon<1.
They have equal trace and both are positive definite, but A<=gamma B requires gamma>=1/epsilon. Thus balancing scalar mass or trace cannot by itself guarantee bounded regional metric comparisons. This is a matrix counterexample, not an assertion about a particular theta partition. Actual theta metric bounds in Section2 were checked as matrix inequalities.

## 5. Fixed-degree availability of old regional metrics

There is a limited useful existence statement, with no target-positivity assumption. Fix a finite polynomial old space in either parity, and suppose its *global* original old block has already been proved positive. Then some finite cutoff H gives positive old matrices both on|u|<=H and|u|>=H.

Proof: g0=1 exactly. For each fixed j>=1, full-theta dominant-orbit asymptotics give, with z=pi exp(2u),
 ell^(2j)(u)=-2^(2j)z+O_j(z^-1),
 g_j(u)=(2j-1)!!(2z)^j+O_j(z^(j-1)).               (5)
The remaining orbit logarithm and each fixed derivative are exponentially small, so the asymptotic is for the complete profile. For old basis t^(2i+epsilon), epsilon=0 or1, congruence by diagonal entries(2z)^(-i-epsilon/2) makes the local old block tend to
 G_ij=(2(i+j+epsilon)-1)!!,
with(-1)!!=1. This is the positive definite Gaussian Gram matrix of the independent monomials x^(2i+epsilon). Hence the local old block is positive for all sufficiently large u, separately at each fixed degree. Its integral over a sufficiently remote tail is positive and tends to zero. The complementary core matrix tends to the already-positive global old matrix, so is positive as well for large enough H.

This is only a fixed-degree old-metric existence theorem. The asymptotic constants and Gaussian conditioning depend on degree; no uniform cutoff or comparison constant is obtained. In particular, it is compatible with local and cumulative-tail counterexamples at fixed cutoffs as degree grows. It does not bound target Schur remainders or guarantee any finite computational payment test succeeds.

## 6. Exact conditions still needed for a uniform adaptive argument

A useful degree-dependent tree needs:
1. Certified positive integrated old matrices at every leaf; indefinite local pieces must be merged rather than inverted as positive metrics.
2. Actual signed target remainders, including full tails, with no discarded negative leaf.
3. Sufficient local correction/reserve bounds at the nodes that absorb negative leaves, retaining their actual inverses and regression differences.
4. Positive target blocks, or further signed payment bounds, for whatever remote pieces are appended.

The finite tests satisfy these conditions at their stated degrees. Equations(1)-(5), equal-mass balancing, or merely adding more regions do not supply them uniformly. The invariant global S still contains the original unresolved signed comparison.
