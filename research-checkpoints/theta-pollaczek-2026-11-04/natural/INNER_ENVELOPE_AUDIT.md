# Independent audit: inner Pollaczek envelope and natural reference

2026-11-04. Verdict: UNIFORM_INNER_ENVELOPE.md establishes its stated inner estimates by a sound Fourier/contour argument. The natural-reference recurrence and quadratic comparison in NATURAL_GAMMA_REFERENCE.md also pass. This audit does not validate any global turning-point estimate or actual trial H/X decay not yet supplied.

## Fourier normalization and contour

For the Fourier transform convention integral g(t)exp(-itu/2)dt, inversion has coefficient 1/(4pi). Multiplying the Pollaczek generating function by W and integrating produces

    [4pi Gamma(2lambda)/2^(2lambda)]
        [cosh(u/2)+iz sinh(u/2)]^(-2lambda).

Its z^n coefficient is h_n(-i tanh(u/2))^n sech(u/2)^(2lambda), where h_n=4pi Gamma(n+2lambda)/(2^(2lambda)n!). Thus the coefficient in (3) is correct. Interchanging generating series and integration is justified initially for z in a sufficiently small neighborhood of zero, and finite coefficient extraction follows. Fourier inversion is valid for each fixed n because W times a polynomial has exponential decay and is smooth.

The strip 0<=Im u<=pi/2 contains no zeros of cosh(u/2), whose nearest upper zero is at Im u=pi. An analytic logarithm and the corresponding noninteger power therefore exist on the strip. The integer power of tanh is analytic there as well. On the vertical ends, exponential amplitude decay dominates at each fixed n and t; no estimate uniform in n is required merely to establish the exact contour identity. The shifted integral has precisely the factor exp(-pi t/4).

On the new line, tanh((u+i pi/2)/2)=(sinh u+i)/cosh u has modulus one, and a smooth argument has derivative -sech u. The remaining complex amplitude is sech((u+i pi/2)/2)^(2lambda); all its fixed-order derivatives are bounded by constants times exp(-lambda|u|). Therefore the phase and amplitude bounds in the note hold without omitting an n-dependent amplitude factor.

## Uniform partition and repeated integration by parts

For 1<=t<=n/4, U=arcosh(2n/t)>=arcosh8. Thus the two fixed-width saddle neighborhoods remain separated from the central interval uniformly. On either saddle neighborhood, |phi''| is comparable to t, and the amplitude supremum plus variation is O(exp(-lambda U))=O((t/n)^lambda). The second-derivative bound gives the stated n^(-lambda)t^(lambda-1/2) estimate.

In the outer region u>=U+1, |phi'| is bounded below by a positive constant times t, and one integration by parts gives O(n^(-lambda)t^(lambda-1)). In the intervening region, the zero of phi' is excluded by a fixed u gap; hence each fixed-order derivative of 1/phi' is O(n^(-1)exp u). K integrations by parts, with integer K>lambda, give an integrable bound

    C_K n^(-K)exp((K-lambda)u).

Integration up to U yields O(n^(-lambda)t^(lambda-K)), plus O(n^(-K)) from the central transition. Since integer K>=1, the powers are bounded by the saddle estimate for t>=1. The central O(n^(-K)) is also bounded by the required estimate throughout t<=n/4, including 0<lambda<1/2.

Smooth cutoffs can be chosen with fixed-width transitions and uniformly bounded derivatives; the regions overlap rather than introduce physical endpoints. Derivatives of the translated cutoffs have the same uniform bounds. The argument remains valid even when U is at its smallest value.

For t<=1, the split at log n is valid: the whole outer and transition region has absolute integral O(n^(-lambda)), while the region ending at log n-1 has |phi'| bounded below by a constant times n exp(-|u|). Repeated integration gives the same O(n^(-lambda)) bound. This proves (4) uniformly, including t=0.

Using sqrt(W) comparable to (1+t)^(lambda-1/2)exp(-pi t/4) and Gamma(n+2lambda)/n! = O(n^(2lambda-1)) gives sqrt(W)|Q_n|=O(n^(lambda-1)), exactly the power in (1).

## Differentiation

Differentiating the shifted identity is justified by the integrable first moment of its amplitude for fixed n,t. The new integral has factor iu/2; the extracted exponential contributes -pi/4. At a saddle its magnitude costs O(1+U), and in the outer/inner regions the same integration-by-parts estimates with uA or its derivatives cost at most this factor. For t<=1 it becomes O(1+log n). Uniformly these are O(1+log(n/(1+t))) on the specified inner range.

The real logarithmic derivative W'/W is bounded, by compact smoothness and gamma asymptotics. Solving (WQ)'=WQ'+W'Q therefore proves (2). No differentiation of an unspecified asymptotic remainder occurs.

## Natural gamma comparison and recurrence

Gamma recurrence directly gives

    a^2/W_(9/4)=16(t^2+1/4)/(t^2+25/4),

whose range is [16/25,16). The reference norm is therefore comparable to the exact amplitude norm globally, but not to the actual arithmetic factor F^2=a^2Z^2 from below.

Differentiating the generating function in z gives

    (n+1)Q_(n+1)=tQ_n-(n+2lambda-1)Q_(n-1).

In orthonormal coordinates its off-diagonal coefficients are sqrt(j(j+2lambda-1)), giving sqrt(j(j+7/2)) at lambda=9/4. Multiplication by t consequently has norm O(n+1) on the degree-n prefix into degree n+1. Together with the audited derivative Hilbert–Schmidt bound and F^2+F'^2<=C(1+t^2)W, this proves the general C(n+1)^3 upper source bound and the individual C(n+1)^2 bound in NATURAL_GAMMA_REFERENCE.md.

Its lower reference comparison follows from the earlier good-point/Markov proof with the new polynomial envelope power 7/2, giving the stated factor (n+1)^(9/2) before absorption. Monic leverage and both Gram-conditioning conclusions then follow as stated.

## Scope

These notes provide a proven origin/inner envelope and a subexponential norm comparison. They do not yet supply the turning-point and outer envelopes, a full bulk stationary-phase remainder, a cutoff-tail transfer of the top-mode theorem, or an actual natural-family H/X ratio. Those remain separate audit targets.
