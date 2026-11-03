# Frequency-relative error: rigorous limits and usable bounds

## Summary

Exact signed tail closure preserves the full answer. Finite endpoint matching does not yield frequency-relative accuracy. Even exact matching of EVERY endpoint jet plus small error in ANY prescribed finite set of weighted derivative norms does not guarantee global relative shear accuracy. A concrete modulation counterexample is given below. These obstructions concern classes of estimates, not the impossibility of a theta-specific global sign theorem.

## 1. Finite matching cannot be globally relative

Suppose an approximate half-line profile q satisfies the smoothness/decay assumptions of the source's general odd-jet theorem, and its first nonzero odd derivative is q^(2m+1)(0)=d!=0. Put p=4m+6 and c=(2m+2)a d²>0, with fixed a>0. Then

W[q](t)=-c t^-p+O(t^-p-2).

The complete modular W[psi] is Schwartz. Hence, for sufficiently large t,

|W[q](t)-W[psi](t)| >= (c/2)t^-p.

For every L>p there exists B_L<infinity with |W[psi](t)|<=B_L t^-L for t>=1. At every sufficiently large t with W[psi](t)!=0,

|W[q](t)-W[psi](t)|/|W[psi](t)| >= [c/(2B_L)]t^(L-p) -> infinity.

If W[psi](t)=0, the usual relative error is undefined and the approximate error is still nonzero at all sufficiently large t. This applies to any finite asymptotic correction that leaves a residual odd jet. Increasing the number of matched terms postpones, but does not remove, the obstruction.

## 2. All jets plus finite norm control still do not suffice

Fix a>0 and an integer M>=0. Choose a nonzero, even, nonnegative C-infinity function g supported in b<=|u|<=c for 0<b<c<infinity. For T tending to infinity put

e_T(u)=epsilon_T cos(Tu)g(u), epsilon_T=T^(-M-1),
q_T(u)=psi(u)+e_T(u).

Every q_T is smooth even; every derivative of e_T vanishes at zero, so ALL endpoint jets of q_T and psi agree exactly. For sufficiently large T, q_T is strictly positive: on the support use the positive minimum of psi and boundedness of g, and off the support q_T=psi. For every fixed exponential weight and j<=M,

||exp(A|u|) e_T^(j)(u)||_1=O(T^(j-M-1))=O(T^-1).

Thus the error tends to zero in every chosen finite set of weighted derivative norms. Polynomial weights are harmless on this fixed compact support.

Let A_g,B_g be the half-line transforms of g in the source convention. Product-to-sum gives EXACTLY at t=T,

A[e_T](T)=epsilon_T [A_g(0)+A_g(2T)]/2,
B[e_T](T)=epsilon_T B_g(2T)/2,
A[e_T]'(T)=epsilon_T A_g'(2T)/2,
B[e_T]'(T)=epsilon_T [B_g'(0)+B_g'(2T)]/2.

(The zero-frequency sine terms vanish.) All four transforms at 2T decrease faster than every inverse power, since g is smooth and compactly supported away from zero. Therefore

W[e_T](T)=epsilon_T² C_a+o(epsilon_T²),
C_a=A_g(0) B_g'(0)/4>0,
A_g(0)=integral_0^infinity g(u)cosh(au)du>0,
B_g'(0)=integral_0^infinity u g(u)sinh(au)du>0.

The cross shear between psi and e_T is O_L(epsilon_T T^-L) for every L: all transforms of psi and their t derivatives are Schwartz, whereas those of e_T at T are O(epsilon_T). Choosing L>M+1 gives

W[q_T](T)-W[psi](T)=C_a epsilon_T²+o(epsilon_T²).

Since W[psi](T)=O_L(T^-L) for every L, the relative error diverges faster than any prescribed positive polynomial along nonzero-denominator points, despite exact endpoint matching and arbitrarily small prescribed finite-norm error.

Scope: q_T need not be an arithmetic theta tail. This counterexample disproves a generic inference from evenness, endpoint matching, positivity of the profile and finite derivative norm smallness to a global relative shear estimate. It does NOT refute a more restrictive theorem exploiting the exact arithmetic tail. No RH assumption is used.

## 3. Legitimate all-height absolute bounds after full smooth cancellation

Here is an error estimate that DOES hold. Suppose f and r are smooth even profiles with sufficient integrable weighted derivatives, and psi=f+r. For 0<=a<=A define s_a(u)=sinh(au)/a, continued as s_0(u)=u, and the four full-line integrands

g_0[q]=q(u)cosh(au),
g_1[q]=q(u)s_a(u),
g_2[q]=u q(u)cosh(au),
g_3[q]=u q(u)s_a(u).

Their respective cosine/sine transforms, with the half-line normalization, bound A[q], B[q]/a, -A[q]', B[q]'/a. The first and fourth integrands are even, and the second and third odd, so full-line Fourier integration by parts has no endpoint defects.

For arbitrary integer m>=0 set

Q_i(q,t)=1/2 min( ||g_i[q]||_1, |t|^-m ||partial_u^m g_i[q]||_1 ),

using the first entry at t=0. One can take the supremum of the displayed norms over 0<=a<=A to obtain a bound uniform as a decreases to zero. All four transform magnitudes are bounded by their corresponding Q_i. Exact polarization then gives, for every real t and 0<a<=A,

|W[f+r](t)-W[f](t)|/a
 <= Q_0(f)Q_3(r)+Q_0(r)Q_3(f)
  + Q_2(f)Q_1(r)+Q_2(r)Q_1(f)
  + Q_0(r)Q_3(r)+Q_2(r)Q_1(r).

This gives an explicit all-height envelope that is bounded near zero and O(|t|^-2m) at infinity. Different derivative orders may be used on different factors. In contrast to an unweighted moment bound, it exploits frequency cancellation. If f or r is only an evenly reflected ordinary finite theta cutoff, arbitrary m is not allowed because of the cusp; the endpoint terms must instead be retained explicitly, or the exactly cancelling sums must be combined BEFORE applying the smooth estimate.

A relative bound on a particular regime S follows only after an independent positive lower bound ell(t) for W[psi](t)/a, or a corresponding verified lower bound for W[f]/a with error margin, is supplied on S. The displayed upper envelope itself supplies no such lower bound. In particular, O(|t|^-2m) is not relative to a Schwartz-scale target just because m is large.

## 4. Quantified regime distinctions

* Fixed compact frequency window: the modular worker's moment bound or the sharper envelope above can certify a positive lower margin, including uniformly small a after division by a. It needs actual lower bounds on that window.
* All sufficiently large frequencies, finite matching: the relative-error obstruction in Section 1 is unavoidable; the approximate shear eventually has the wrong algebraic leading behavior.
* All frequencies, full smooth cancellation: the envelope in Section 3 is valid and decays to any fixed algebraic order when enough derivatives are controlled, but gives absolute, not relative, accuracy.
* Exact arithmetic signed tail retained: there is no approximation error. The remaining task is the sign of the exactly summed quantity, not convergence of the tail representation.
* Theta-specific exponentially sharp/relative estimates: not ruled out, but no independent all-height positive lower bound or signed relative remainder estimate is presently established here.

These distinctions prevent a fast-decaying upper bound from being mistaken for a sign theorem.
