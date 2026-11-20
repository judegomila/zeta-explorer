# Exact paired eta-filter curvature, with its compulsory energy payment

Independently reviewed analytic PASS. This tests a paired arithmetic mechanism; it is not a replacement for the signed divisor core.

Let F(t)=hat psi(t) be the actual real even complete-theta transform on the real axis. Fix b=2, L=log2, c=sqrt2, and
 a(t)=1-c exp(itL), H(t)=a(t)F(t), B(t)=|a(t)|²=1+c²-2c cos(tL)>0.
This H is precisely the Fourier transform of the fixed arithmetic filter psi(u)-sqrt2 psi(u+log2). Define the real Hermitian curvature
 W_H(t)=|H'(t)|²-Re[H''(t) conjugate(H(t))].

## 1. Exact paired identity

Direct differentiation gives
 W_H=B Lambda_F+c L²(2c-cos(tL))F²,
 Lambda_F=F'^2-FF''.
The terms proportional to FF' cancel exactly between the two Hermitian terms. In particular
 Lambda_F=W_H/B-kappa(t)F²,
 kappa(t)=c L²(2c-cos(tL))/(1+c²-2c cos(tL)).       (1)
No sign assumption on Lambda_F was used, and no phase or boundary term is omitted.

For c>1, kappa is strictly increasing as a function of cos(tL), with derivative cL²(3c²-1)/B². Therefore
 kappa_min=cL²(2c+1)/(c+1)² <=kappa(t)
 <=cL²(2c-1)/(c-1)²=kappa_max.                    (2)
These are finite positive constants for the fixed b=2 filter.

## 2. Both original residuals retain the exact same subtraction

For the actual even residual p(t)=P_N(t²), or odd residual p(t)=tQ_N(t²),
 h[p]=integral p² Lambda_F
     =integral p² W_H/B - integral p² kappa F².     (3)
All terms are integrable for the actual theta transform and any fixed polynomial. The actual prefix inverse remains in p; replacing it by an auxiliary parent residual would change the target.

The compulsory second term is at least
 kappa_min integral p² F².
Thus positivity of W_H alone is not sufficient. It must dominate a specific nonzero parent-energy cost, with the same actual polynomial coefficients. This is a paired identity preserving cancellation, not a new free positive reserve. It also leaves the original odd arithmetic remainder unchanged; if one uses the divisor certificate, that remainder must still be paid.

## 3. Explicit counterexample to the filtered-positivity shortcut

Consider the auxiliary even positive smooth Gaussian-mixture profile with Fourier transform
 F_*(t)=exp(-epsilon t²/2)(1+alpha cos t)/(1+alpha),
 epsilon=3/4, alpha=1/2.
It is the convolution of a Gaussian of variance epsilon with a positive three-atom distribution. F_*>0 on the real line. Its original curvature ratio is
 Lambda_*/F_*²=epsilon+(alpha cos t+alpha²)/(1+alpha cos t)².
For alpha=1/2 the second term increases with cos t and lies in[-1,1/3]. Consequently
 Lambda_*/F_*²>=-1/4,
but at t=pi it equals -1/4, so the original curvature is negative there.

Apply the SAME fixed b=2 filter. Since c=sqrt2>1,
 c(2c+1)/(c+1)²>3/4,
and log2>2/3. Therefore kappa_min>1/3. Equation(1) now yields
 W_(H_*)/(B F_*²)>-1/4+1/3=1/12
for EVERY real t. The filtered Hermitian curvature is strictly positive everywhere while the original target is negative on a neighborhood of pi.

This is not the actual theta profile and does not disprove a theta-specific domination in(3). It proves that even global positivity of the paired filtered curvature cannot justify dropping its exact energy payment. A successful eta-filter argument must exploit additional complete-theta structure to prove the domination, not merely positivity of the filtered object.

## 4. Scope

The exact pairing cancels the mixed derivative term and exposes a uniformly positive, explicitly bounded subtraction. It applies equally to both parity residuals, with no unknown next norm assumed. No degree-expanding sector or uniform signed-core inequality is obtained. The unresolved comparison is precisely the first integral in(3) versus its actual kappa-weighted parent-energy subtraction.
