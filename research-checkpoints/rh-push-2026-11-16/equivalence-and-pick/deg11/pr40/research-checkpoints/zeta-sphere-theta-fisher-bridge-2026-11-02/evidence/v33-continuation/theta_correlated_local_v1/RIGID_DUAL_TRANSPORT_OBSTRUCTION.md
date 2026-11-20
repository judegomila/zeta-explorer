# Actual-theta obstruction to rigid supporting-plane transport

Status: independent analytic review PASS.

## 1. The chain telescopes exactly

Use the definitions and exact signed identity of DUAL_PREFIX_CONTINUATION.md. At successive actual selected coefficient vectors c_j, the prescribed transport is
v_(j+1)=v_j+(c_(j+1)-c_j).
Consequently, regardless of the number or widths of the shift steps,

v_final=v_start+c_final-c_start.                            (1)

Starting with the zero supporting vector supplied by the eventual-margin theorem gives the final pointwise remainder

q_final=f_(c_final)-2c_final^T z_(c_final)
                         +2c_start^T z_(c_final).           (2)

This is an exact formula in the original complete-theta local moments. It is not an accumulated error estimate. Subdivision cannot change it.

## 2. A quadratic counterexample at a fixed critical shift

Fix, for example, a_final=1/4. Set
alpha(a)=M_1(a)/M_0(a), p_(2,a)(t)=t^2-alpha(a).
Only the positive scalar old block M_0 is needed to select this polynomial. Write alpha_f=alpha(a_final). The local source and zero-mean cross density are

f_f(u)=g_2(u)-2alpha_f g_1(u)+alpha_f^2,
z_f(u)=g_1(u)-alpha_f.

The independently audited complete-theta curvature-square theorem gives, for every real alpha and every u,

g_2-2alpha g_1+alpha^2 >1254/8.                            (3)

Indeed, with ell=log psi and k=ell'', g_1=-k/2 and the left side is
(alpha+k/2)^2+(4k^2+k'')/8,
and the already established full-theta inequality is 4k^2+k''>1254. Thus the zero supporting vector works at every starting and ending shift for this quadratic family; in particular lambda*_final>=1254/8. No target norm is assumed.

Choose any finite u_* for which Delta=g_1(u_*)-alpha_f>0. Such a point exists because the actual full-theta asymptotic g_1(u)~2pi exp(2u) is unbounded. Starting at shift A with v_start=0, equation (1) gives v_final=alpha(A)-alpha_f, and hence

q_final(u_*)=f_f(u_*)-2[alpha(A)-alpha_f]Delta.               (4)

Therefore q_final(u_*)<0 whenever

alpha(A)>alpha_f+f_f(u_*)/(2Delta).                         (5)

The audited full-theta moment asymptotic gives alpha(A)=A+O(1) as A tends to infinity, so (5) holds for every sufficiently large A. Its threshold is finite but not numerically evaluated here. Equations (4)-(5) are exact and do not use a truncated theta profile.

This is an actual inverse-selected residual at a fixed critical shift, with an independently positive optimized margin and target pivot, for which rigid transport from sufficiently large shift gives a negative pointwise certificate. It is NOT a negative optimized-dual witness. Returning the final supporting vector to zero repairs this quadratic example immediately.

## 3. The same transport obstruction at every fixed nonconstant design size

Fix n=epsilon+2N with N>=1, and a finite ending shift at which the actual old prefix is known positive. Let c_f be the selected coefficients and z_f its zero-mean cross vector. Its zeroth component is
z_(f,0)=sum_(i=0)^N c_(f,i) g_(epsilon+i), c_(f,N)=1.
The distinct full-theta leading powers show z_(f,0) is not identically zero. Its expectation under the positive spatial density rho_final is exactly zero. Continuity and strict positivity of that density on u>0 therefore imply z_(f,0) has both positive and negative values.

At starting shift A tending to infinity, the audited actual-prefix Hermite limit gives
c_(start,i)/A^(N-i) -> h_i,
h_0=(-1)^N n!/(2^N N!) !=0.
Choose a fixed u_* with h_0 z_(f,0)(u_*)<0. Dividing (2) by A^N gives

q_final(u_*)/A^N -> 2h_0 z_(f,0)(u_*)<0.                  (6)

The terms with i>=1 vanish in this limit; no large-degree limit is taken. Thus the rigid transport fails for every sufficiently large starting shift, at each such fixed degree and ending prefix. A positive ending target is not needed for this general statement. If the ending shift is in the independently positive exterior, its target positivity is separately known at every degree. Section 2 additionally supplies an explicit already-positive critical-shift example.

## 4. Consequences for the continuation strategy

The positive transfer criterion cannot hold at every link of any chain with these fixed endpoints and the prescribed vector updates: otherwise each link would maintain a positive pointwise remainder, contradicting (4) or (6). Arbitrarily fine shift subdivision does not remove the obstruction.

This does not refute optimized dual positivity, adaptive re-optimization of v, or another continuation rule. It does not prove the true eventual-margin thresholds grow with degree. It identifies a precise defect in chaining the specific audited sufficient criterion from a very large starting shift: the zero-mean gauge accumulates in a direction whose pointwise sign necessarily changes.

A viable continuation proof must pay for genuinely re-optimizing or re-anchoring the supporting vector, rather than merely controlling the actual coefficient displacement and propagating v by (1). For the quadratic example such re-anchoring is known to succeed by (3). For general degrees its uniformly positive margin remains unproved. No numerical degree expansion is performed.

Dependencies: DUAL_PREFIX_CONTINUATION.md; EVENTUAL_SELECTED_DUAL_MARGIN.md; THETA_CURVATURE_PAYMENT.md; SELECTED_ORTHOGONALITY_DUAL.md. All cited ingredients were independently audited for the original complete theta kernel.
