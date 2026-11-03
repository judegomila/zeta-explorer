# All-degree monotonic paired remainder from a derivative-closed theta design

Status: new exact theorem awaiting independent review. This proves a signed remainder inequality for EVERY finite degree; it does not prove the remaining next-pivot payment inequality.

Fix the actual complete even theta profile psi_lambda=e^{lambda h²}psi and g_a=e^{ah}psi_lambda. Let the current monic physical polynomial T_N(a,D) be defined by the actual positive prefix, and q_a=D[T_N(a,D)g_a]. No next signed norm is assumed positive or used as a denominator.

## 1. A prescribed adaptive design with exact closure

Choose a finite set R of nonnegative integer spatial powers containing0. Let
 U_N,R(a)=span{h^r D^j g_a: r in R, 0<=j<=N}.
Because (D+a)^j is triangular in D,
 U_N,R(a)=e^{ah} W_N,R,
 W_N,R=span{h^r D^j psi_lambda: r in R,0<=j<=N}.
The parameter dependence is therefore PURE exponential tilt of one fixed finite space, even though individual derivative features depend on a.

The monic source satisfies
 e^{-ah}q_a=D^{N+1}psi_lambda + a linear combination of D^j psi_lambda, j<=N.
All lower terms belong to W_N,R. They may depend on the true signed regression coefficients, but positive projection removes them exactly. Hence the augmented positive error innovation equals
 E_N,R(a)=min_b integral_0^infinity h e^{2ah}
   [D^{N+1}psi_lambda-sum_(r,j)b_(r,j) h^rD^jpsi_lambda]² dh.
This identity uses the original full theta function; it does not deform its zeros or assume a positive spectral measure.

All displayed functions are independent for the actual theta profile at every fixed finite degree: as h->infinity the first orbit has leading derivative factor (-2pi e^{2h})^j times the same positive superexponential envelope, while omitted orbits are exponentially smaller. At the largest j, distinct powers h^r cannot cancel; descending in j proves independence. The source degree N+1 is not in the design by the same argument. This fixed-degree use of the theta tail does NOT assume a finite orbit head is uniform in growing degree. Positive design Grams are consequently invertible, and the regression coefficients are smooth for real a on compact parameter intervals.

## 2. Exact positive remainder derivative, with no forcing penalty

Let e_a be the optimal physical residual. Positive projection orthogonality and the envelope theorem give
 E_N,R'(a)=2 integral_0^infinity h² e_a(h)² dh >0.
This is valid at every finite degree and every finite real a. No rank-changing inverse is differentiated and no next signed pivot is used.

Equivalently, in the symbol-derivative proof from the previous packet, every derivative of a design feature's differential-operator symbol remains inside the design (this is not physical differentiation in h), and the source's D-symbol derivative has degree<=N inside it. The cross forcing term therefore vanishes by exact regression orthogonality. There is no ||L_res||² error penalty to estimate.

Reflection preserves W_N,R, since h^rD^jpsi_lambda has parity r+j. Consequently the negative-side innovation equals E_N,R(-a), and for a>0
 E_N,R(a)-E_N,R(-a)>0.
Thus the common positive error is safely retained as a favorable paired remainder, rather than dropped on only one side.

## 3. Noncircular bound for the original parity innovation

Let delta(a) be the positive innovation using only the OLD NEXT-PARITY features, and define L_N,R(a)=delta(a)-E_N,R(a)>=0 (the extra projection gain). The design contains that old span. Then the new ALL-DEGREE inequality is
 delta(a)-delta(-a) >= L_N,R(a)-L_N,R(-a), a>0.
With the exact old-target resolvent cost Delta^TKDelta retained,
 s_(N+1) >= L_N,R(a)-L_N,R(-a)-Delta^TKDelta.
No unknown next signed positivity has entered this inequality.

At the normalized endpoint, under the previously stated positive normalized-prefix hypothesis and raw plus-minus convention,
 sigma_(N+1)=2[delta'(0)-f_actual] >=2[L_N,R'(0)-f_actual].
Therefore the sufficient scalar payment test for the modular one-direction cost becomes
 2[L_N,R'(0)-f_actual] >= (4N+||d_perp||²) M_N.
This removes the previous forcing-norm penalty by an ACTUAL all-degree sign theorem for the paired remainder. The displayed payment test itself is NOT proved uniformly. Actual inverse conditioning in L and f is retained.

## 4. Prefix-only evaluation is still possible

For the minimal closed design R={0}, its size is N+1 and both parity ladders are present. For all lower columns V_j, <V_j,q>_h is reduced by integration by parts to current degree<=N. The only top column is proportional to the current F_N, and
 <F_N,F_N'>_h=-(1/2)integral F_N².
Its a derivative is -integral F_N(F_N)_a. These also use only the current prefix. Thus L and L' are differences of positive projected energies computed from current-prefix Grams, not from the next pivot.

For an enlarged closed design R={0,1,3}, the top pairings obey
 <h^r F_N,F_N'>_h=-(r+1)/2 integral h^rF_N².
All lower differential-degree columns again reduce by integration by parts. The exact moment transport and previously proved full-theta spatial moment bounds are applicable to these prefix moments.

## 5. What adaptive scaling is proved—and what is not

Two isolated witnesses hF_N,h³F_N are not symbol-derivative closed: their descendants hT_N^(k)(D)g and h³T_N^(k)(D)g are missing. For exact closure each chain has N+1 independent polynomial degrees, because T_N is monic. Retaining both spatial witnesses and absorbing the source derivative by the plain prefix gives the explicit closed design R={0,1,3}, of size3(N+1). The minimal alternative R={0} has size N+1.

This is a rigorous linear-in-degree adaptive design that eliminates the signed forcing penalty. It is NOT a proof that fixed two witnesses necessarily fail, nor that the enlarged positive Grams have uniform conditioning. In particular the established full-filtration conditioning warning remains relevant; no positive-parent coercivity is substituted for the true signed inverse.

## 6. Restricted sanity check, not evidence of uniform sufficiency

Own-source probe_closed.py checks only the already-verified original-theta normalized rungs N2->3,N4->5,N5->6, with minimal R={0}. Floating sufficient margins divided by the actual current normalized pivot are approximately +5.41605,+8.45606,+16.78350. The exact E'=2 integral h²e² identity agrees to relative error below4e-12 on this mesh. Positive design condition numbers grow from about151 to29357 in these three checks; that conditioning cost is not hidden.

No new finite-degree certificate or higher-degree run is claimed. The newly proved component is the all-degree positive paired remainder. The outstanding theta-specific work is to bound the explained-gain derivative against the actual inverse-feedback and modular cost uniformly.
