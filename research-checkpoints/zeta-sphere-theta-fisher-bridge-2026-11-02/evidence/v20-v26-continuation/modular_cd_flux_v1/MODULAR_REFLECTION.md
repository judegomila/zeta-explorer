# Actual theta modular reflection reduces the CD flux to one boundary vector

Status: new exact relations awaiting independent audit. Both parity ladders and actual pivot denominators are retained. No next-pivot or reflected-flux sign is assumed.

## 1. The actual theta modular boundary condition

Let theta(t)=sum_(m in Z)exp(-pi m²t), t=e^{2u}, and B(u)=e^{u/2}theta(e^{2u}). The Poisson functional equation theta(t)=t^(-1/2)theta(1/t) says B(-u)=B(u). Direct differentiation gives the actual campaign density
 psi(u)=(D²-1/4)B(u)
       =e^{u/2}[4t²theta''(t)+6t theta'(t)].
The constant theta mode is annihilated by D²-1/4. Thus psi is even, and psi_lambda=e^{lambda u²}psi is even as well. For g=e^{au}psi_lambda with a>0,
 g(-u)=e^{-2au}g(u).
All differentiated forms below retain the full theta function; no finite orbit head replaces the modular reflection.

## 2. Use both parity ladders in the true pivot metric

Let p_j(t),j=0,...,N+1 be monic orthogonal polynomials for the ACTUAL even bridge moment functional. Assume its actual pivots s_0,...,s_N are positive, so p_(N+1) is defined; its own pivot is NOT assumed positive. Positivity of the two actual parity blocks through degree N gives precisely this prefix hypothesis. Constants pi/2 are omitted.

Define real parity polynomials T_j(x)=i^j p_j(-ix), physical F_j=T_j(D)g, and s_j=integral uF_j². With beta_j=s_j/s_(j-1), the full even-moment recurrence gives
 T_(j+1)(x)=xT_j(x)+beta_j T_(j-1)(x).
Normalize only known pivots: Y_j=F_j/sqrt(s_j), j<=N, and Z=F_(N+1)/sqrt(s_N). Then
 Y'=X_N Y+e_N Z,
where X_N is skew-symmetric tridiagonal, (X_N)_(j,j+1)=sqrt(s_(j+1)/s_j), (X_N)_(j+1,j)=minus that number. There is no normalization by the unknown next pivot.

## 3. Finite modular reflection matrix and exact rank-one defect

Differentiating the modular boundary condition gives
 F_j(-h)=e^{-2ah}T_j(2a-D)g(h).
Define the lower-triangular real matrix R by the polynomial identity
 T_i(2a-x)/sqrt(s_i)=sum_(j<=i) R_ij T_j(x)/sqrt(s_j).
Then
 Y(-h)=e^{-2ah}R Y(h), R²=I, R_ii=(-1)^i.
This is the finite representation of polynomial reflection x ->2a-x, involving BOTH parity ladders. Dropping opposite-parity components would destroy the identity.

For the unnormalized-next feature define the unique boundary vector r by
 T_(N+1)(2a-x)/sqrt(s_N)
 =(-1)^(N+1)T_(N+1)(x)/sqrt(s_N)+sum_(j=0)^N r_j T_j(x)/sqrt(s_j).
Thus Z(-h)=e^{-2ah}[(-1)^(N+1)Z(h)+r^T Y(h)]. Differentiating the vector reflection relation and inserting the degree derivative recurrence yields the EXACT finite-rank identity
 X_N R+R X_N-2aR=-e_N r^T.
The apparent bulk mismatch is only rank one; its highest coefficient is fixed explicitly:
 r_N=2a(N+1)(-1)^N.
One proof is polynomial leading coefficients; another multiplies the rank-one identity by R and takes traces, using tr X_N=0 and R e_N=(-1)^N e_N.

## 4. Reflected CD flux contains no independent negative-side functions

For the true pivot-normalized kernel K_N(u,v)=Y(u)^T Y(v), skew-symmetry of X_N gives
 (D_u+D_v)K_N(u,v)=Z(u)Y_N(v)+Y_N(u)Z(v).
Along v=-u the reflected flux is therefore
 C_N(h)=e^{-2ah}[Z(h) sum_(j<N)R_Nj Y_j(h)+Y_N(h)r^T Y(h)].
The leading ZY_N terms cancel EXACTLY. All reflected functions are replaced by positive-side functions, one finite reflection matrix and ONE boundary vector fixed by actual pivot ratios and a. This reduces independent unknowns; it is not an inequality. The remaining quadratic/cross expression has no sign proved here.

## 5. A genuine positive modular metric, with its limitation explicit

The explicit matrix G=I+R^T R is positive definite and satisfies R^T G R=G. Thus
 Y(-h)^T GY(-h)=e^{-4ah}Y(h)^T GY(h),
 h[Y(h)^T GY(h)-Y(-h)^T GY(-h)]
   =h(1-e^{-4ah})Y(h)^T GY(h)>=0 for h>=0.
This supplies a conserved positive modular combination in the ACTUAL pivot-scaled coordinates. It is NOT permission to replace the target metric I by G.

At the modular midpoint, RY(0)=Y(0) and (I+R)Y'(0)=2aY(0). The plus/minus eigenspaces of R are G-orthogonal, so
 Y(0)^T GY'(0)=a Y(0)^T GY(0)>=0.
The true unweighted pivot-kernel boundary quantity Y(0)^T Y'(0) need not inherit this sign unless the distortion/cross term between I and G is separately controlled.

Indeed for K_G(u,v)=Y(u)^T GY(v), its first-order kernel identity contains the explicit interior commutator
 (D_u+D_v)K_G=Y(u)^T(GX_N-X_NG)Y(v)
                +Z(u)e_N^T GY(v)+Y(u)^T Ge_N Z(v).
It vanishes in the true CD metric G=I, but not automatically in the positive modular metric. This is the exact unpaid transfer term. No Fisher/parent norm is used to declare it positive.

The theta modular condition therefore does reduce reflected unknowns and gives a positive invariant combination, but the remaining task is to control this commutator/boundary interaction in the true pivot metric. No all-order sign law or RH conclusion follows from the invariant metric alone.

## 6. The unpaid commutator has exactly one negative direction

The rank-one modular defect determines the apparently full interior commutator. Put v=R^T e_N. Transpose the defect, using X_N^T=-X_N, and eliminate RX_N+X_NR to obtain
 C:=GX_N-X_NG=4aR^TR-vr^T-rv^T.
Congruence by the involution R gives
 R^T C R=4aI-e_N w^T-w e_N^T, w=R^Tr,
 w_N=2a(N+1).
Moreover reflecting the next polynomial twice shows R^Tr=(-1)^N r, so w is not an additional unknown vector.

Write w=w_Ne_N+w_perp and z=RY. Then the exact square completion is
 Y^T C Y
 =4a||z_perp-z_N w_perp/(4a)||²
  -[4aN+||w_perp||²/(4a)]z_N².
All actual pivot ratios remain in R and w. The only negative term is a SINGLE reflected-top-degree defect, not an arbitrary signed spatial forcing matrix.

For N>=1, the congruent matrix is4aI on the complement of span(e_N,w_perp). On that span its nontrivial block is
 [[-4aN,-||w_perp||],[-||w_perp||,4a]].
Its determinant is strictly negative. If w_perp=0, the same conclusion follows directly from the diagonal matrix. Hence C has exactly one negative and N positive eigenvalues. At N=0, C=0. This inertia statement is exact, not a numerical signature check.

The scalar defect coefficient kappa_N=4aN+||r_perp||²/(4a) is explicit but need not be small. Its comparison with the actual next-pivot/boundary reserve is still unpaid. Discarding that term, or replacing the target kernel metric by G, would be invalid. The useful reduction is that the modular boundary leaves only one signed direction to couple to the next-rung feedback.
