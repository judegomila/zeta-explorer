# Exact signed transport gauge: block costs become endpoint energies

Status: new exact algebra awaiting independent review. Full theta retained; no all-degree sign claim. Common positive pi/2 normalization omitted below.

Let g_lambda=e^{au+lambda u²}psi and let p_lambda be the monic degree-n actual SAME-PARITY Schur residual. On any parameter interval where its old signed Gram A is invertible (positive in the intended induction), its coefficients are differentiable. Strip the fixed unit phase and write
 F=T_lambda(D)g_lambda, K=T_lambda'(D)g_lambda, L=T_lambda''(D)g_lambda.
Primes on T denote polynomial-symbol differentiation; a dot denotes parameter differentiation of its coefficients ONLY. The actual old-feature stationarity is integral_R u F v=0 for every v in the old same-parity feature span.

The commutator source is J=u³F²+2u²FK, with s'=2 integral J and s=integral uF². Exact product differentiation gives
 partial_lambda F=u²F+2uK+L+dot(T)g.
Both L and dot(T)g lie in the OLD same-parity span. Therefore the analytically prescribed free gauge
 q_transport=L+dot(T)g
has zero global source integral, and more strongly
 J+uF q_transport = (1/2) partial_lambda[uF²] POINTWISE.
Unlike a fitted gauge, its coefficients are fixed by the actual signed regression transport. No derivative of an externally fitted gauge and no approximate entropy flow is used.

For a fixed radial spatial block I=[-b,-a] union[a,b], define its SIGNED energy s_I(lambda)=integral_I uF_lambda². Then
 integral_(lambdaA)^lambdaB integral_I (J+uF q_transport)
   = (1/2)[s_I(lambdaB)-s_I(lambdaA)].
All negative credit inside the space-time block is preserved exactly. The usual positive-block paid return bound becomes
 s_0 >= s_1 - sum_I [s_I(1)-s_I(0)]_+.
The SAME lambda interval[0,1] is used. There is no lambda quadrature left in this transport-gauge budget. Infinite spatial tails still must be included or bounded; they are not presumed positive.

The endpoint bound is algebraically equivalent to
 s_0 >= sum_I min(s_I(0),s_I(1)).
This disclosure is essential: using ONE global block would just repackage the unknown sign of s_0. Multiple local blocks can be independently certified, but the identity alone supplies no uniform sign. As a direct endpoint inequality it does not require a positive old Gram throughout the interior; only the dynamical interpretation of q_transport requires the actual differentiable residual path. Endpoint residuals and the intended induction hypothesis must still be verified where needed.

## Explicit analytic coefficients, retaining true feedback

Use polynomial degrees i,j of the same parity and full-line monomial Gram H_ij=integral u[(-iD)^i g] conjugate[(-iD)^j g]. Integration by parts gives
 H_ij=M_((i+j)/2,0), M_(k,r)=integral u^(2r+1)(g^(k))².
All boundary terms at infinity vanish. Thus
 dot H_ij=2M_(k,1)-2k(k+1)M_(k-1,0), k=(i+j)/2,
with the second term omitted for k=0. This uses the exact mixed-moment hierarchy and does NOT increase jet degree.

Write p=t^n+c^T old_monomials, A=H_old, b=H_old,n. Then
 c=-A^-1 b,
 dot c=-A^-1(dot b+dot A c).
The q_transport coefficients are consequently rational functions of ACTUAL full-theta moments and the ACTUAL old signed inverse. This feedback conditioning is not normalized away or replaced by an auxiliary positive covariance.

If G_I is the physical local signed Gram, s_I=c_ext^T G_I c_ext and
 dot s_I=c_ext^T dot G_I c_ext+2 dot c_ext^T G_I c_ext.
The second term sums to ZERO across all spatial blocks by global stationarity, but it is generally nonzero blockwise. It is the exact signed regression-feedback transfer between blocks. Replacing it by separate positive norms would discard the very cancellation this gauge preserves. Local cross moments must NOT be reduced to full-line diagonal moments without their boundary terms.

## Actual-theta diagnostics, not certificates

Own-source probe_endpoint_blocks.py uses a=.25,240 GL nodes PER positive spatial block, ten theta orbits, |u|<=3, actual endpoint regression solves. Spatial edges:0,1/8,1/4,1/2,1,2,3.
The endpoint transport paid ratios sum[delta s_I]_+/s_1 are:
 n2 .25787083; n3 .02412638; n4 .29191402; n5 .09020829;
 n7 .02402940; n9 .27574337; n12 .13859623; n15 .23517223; n19 .34142922.
For n5 the earlier analytic fixed gauge with block integration gave .20093777; this transport gauge preserves substantially more cancellation. These computations do NOT include a certified infinite tail, interval rounding, or full old-Gram path proof, and are not accepted certificates. The values do not imply persistence at unbounded degree.

The next mathematical target is a theta-specific recurrence/comparison for these signed regional endpoint energies, with their shared endpoint fluxes and actual regression inverse retained—not a positive Cauchy bound on the source variance.
