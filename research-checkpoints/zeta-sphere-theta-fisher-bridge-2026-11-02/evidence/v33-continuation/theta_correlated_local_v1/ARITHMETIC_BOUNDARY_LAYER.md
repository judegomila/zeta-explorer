# The exact arithmetic boundary layer in modular regularization

Status: independent analytic review PASS. This quantifies the failure of a fixed regularized approximant near the endpoint a=1/2. It concerns the approximant, not the complete-theta bridge sign.

Use X_N,Y_N,F_N and the retained counterterm of MODULAR_REGULARIZED_GROUPING.md. Let epsilon=1/2-a>0. Functional symmetry gives the exact identity on the imaginary Fourier axis
 F_N(ia)=2xi(epsilon)-e_N(epsilon)-e_N(1-epsilon),
 e_N(s)=xi(s)-X_N(s)=A(s)R_N(s).                      (1)
The apparent zeta poles in xi and A are already canceled; A extends analytically at0 with A(0)=-1, while xi(0)=1/2.

## 1. Separate the mean arithmetic remainder, not its sign

For integer N and real s>0 write {x}=1/2+B1(x), and let
 H_N(x)=integral_N^x B1(v)dv.
On every integer cell, H_N(x)=(r^2-r)/2, r={x}, so -1/8<=H_N<=0 and H_N vanishes at the integer endpoints. Integration by parts gives
 R_N(s)=-(1/2)N^(-s)+delta_N(s),
 delta_N(s)=-s(s+1) integral_N^infinity H_N(x)x^(-s-2)dx,
               0<=delta_N(s)<= (s/8)N^(-s-1).        (2)
This is an exact mean-plus-paid-oscillation decomposition of the arithmetic remainder. In particular the mean term cannot be neglected near s=0 even at large N.

For0<s<=1, differentiating the last integral gives
 |delta_N'(s)| <= (N^(-s-1)/8)[(2s+1)/(s+1)
                                      +s log N+s/(s+1)].   (3)
The formula follows from integral x^(-s-2)=N^(-s-1)/(s+1) and its logarithmic derivative. It is sufficient below; no sign of delta_N' is assumed.

## 2. A nonvanishing boundary layer at width1/log N

Fix any c>0 and take epsilon_N=c/log N, N tending to infinity through integers (eventually epsilon_N<1/2). Then (1)-(3), analyticity of A and xi near0 and1, and A(0)=-1 imply
 F_N(i(1/2-epsilon_N)) -> 1-(1/2)exp(-c),             (4)
 [partial_a F_N(ia)]_(a=1/2-epsilon_N)/log N
                              -> -(1/2)exp(-c).     (5)
For clarity, R_N(epsilon_N)=-(1/2)exp(-c)+O(epsilon_N/N),
 R_N'(epsilon_N)=(1/2)(log N)exp(-c)+O(log N/N),
while e_N(1-epsilon_N) and its derivative are O((1+log N)/N) with c fixed. The A' terms at epsilon_N are bounded; their leading derivative contribution comes from A R_N', with A tending to -1. All omitted constants may depend on c, not on an unknown zero or pivot.

The pole-free spectral bridge density of this approximant at t=0 therefore obeys
 U_a(F_N)(0)/log N ->
       -(1/2)exp(-c)[1-(1/2)exp(-c)]<0               (6)
along these shifts. Thus the negative spectral region proved abstractly in the previous note has a concrete arithmetic boundary-layer mechanism: for any fixed0<c1<c2, uniform versions of these estimates give a negative band c in[c1,c2] of width(c2-c1)/log N and negative height of orderlog N. This does not bound the total extent of the negative region. No numerical certificate is needed.

The complete-theta value along the same path tends to2xi(0)=1, not the smaller limit(4). This failure of uniform convergence at the boundary is exactly why the fixed-compact Euler estimates cannot be extended uniformly to a=1/2. It does not indicate a negative complete-theta bridge. A construction using these approximants must either retain and estimate this mean correction explicitly, or combine a degree/shift-dependent truncation with a different argument near the boundary. No all-degree signed payment follows from this observation.
