# Corrected arithmetic refinement is not ordered in the bridge metric

Status: independent analytic review PASS. This tests a natural comparison mechanism, retaining both endpoint counterterms. It gives no negative complete-theta target and no lower bound on a particular actual residual.

## 1. A true arithmetic order on real values

Write h_N(x)=-H_N(x)>=0. On each unit cell x=k+r, h_N(x)=r(1-r)/2, with integral1/12. For real0<s<1, the exact corrected remainder is
 delta_N(s)=s(s+1)integral_N^infinity h_N(x)x^(-s-2)dx>0.
Since A(s)<0, Z_N(s)=xi(s)-A(s)delta_N(s)>xi(s), and Z_N decreases strictly to xi as N increases. The same statements hold for the functional-equation grouped T_N(s)=(Z_N(s)+Z_N(1-s))/2. Both endpoints are exact: T_N(0)=T_N(1)=1/2.

Set B(s)=-A(s)s(s+1)>0 on0<s<1 and
 I_N(s)=integral_N^(N+1) h_N(x)x^(-s-2)dx.
Then the exact retained arithmetic increment is
 Delta_N(s)=T_N(s)-T_(N+1)(s)
        =(1/2)[B(s)I_N(s)+B(1-s)I_N(1-s)]>0.          (1)
This is not an assumed positivity of an oscillatory Fourier expression: (1) is a positive real Mellin-cell integral. It is symmetric about1/2 and vanishes at0 and1 after analytic continuation of B.

## 2. The value order does not transfer to bridge order

The actual real-segment xi values are positive; for example this follows from the positive complete-theta profile and its imaginary-axis cosh transform. Thus
 W_N(s)=T_N(s)^2-T_(N+1)(s)^2>0 for0<s<1,
 W_N(1)=0.
In particular W_N(1/2)>0, so W_N'(s)<0 somewhere in1/2<s<1. Since W_N'/2 is the difference of the two real-axis spectral densities Re(T_N' conjugate T_N) at t=0, the positive value increment does not give a nonnegative increment of bridge density. This statement holds for every N.

There is a stronger two-sided failure for sufficiently large N. Uniformly in a fixed complex neighborhood of s=1/2, differentiation under the finite cell integral gives
 I_N(s)=(1/12)N^(-s-2)(1+O(1/N)),                    (2)
where derivatives of the O(1/N) factor of each fixed order are also O(1/N). This follows by writing x=N+r: (1+r/N)^(-s-2)=1+O(1/N), and its s derivatives add powers log(1+r/N)=O(1/N).

Let B0=B(1/2)>0. Equations(1)-(2) imply
 Delta_N(1/2)~(B0/12)N^(-5/2),
 Delta_N''(1/2)~(B0/12)N^(-5/2)(log N)^2.             (3)
The already-proved corrected error bounds give T_N^(r)(1/2)->xi^(r)(1/2), r=0,1,2; the first derivatives vanish exactly by symmetry. Hence
 W_N''(1/2)/(N^(-5/2)(log N)^2)
                    ->2xi(1/2)B0/12>0.              (4)
For all sufficiently large N, W_N' is therefore positive just to the right of1/2, while it is negative somewhere before1. Refinement changes the pointwise bridge density in both directions within the required critical shift interval. No threshold N is computed or needed for this asymptotic obstruction.

## 3. Exact scope for a comparison proof

The finite Gamma/Dirichlet expressions have real-even Fourier bridge densities with exponential t decay. At a shift where their density difference is negative at t=0, continuity and the exponential-moment polynomial-density argument supply a polynomial squared giving a negative quadratic difference. Thus the corrected arithmetic approximants cannot form a globally monotone increasing or decreasing bridge-matrix sequence over all degrees and critical shifts, despite their strict monotone order as real values.

This does not specify the sign on an actual inverse-selected residual, nor exclude a more subtle correlated comparison with degree-dependent error. It rules out obtaining the missing all-degree signed lower bound merely by monotone refinement of these exact positive Mellin-cell increments. Every counterterm and the endpoint symmetry were retained throughout.
