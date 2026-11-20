# Independent audit: theta SOS localization

Reviewed 2026-11-03. PASS subject to the minor m=0 strict-inequality correction communicated to the author. No new target-degree positivity or all-degree construction is certified.

## Arithmetic denominator and domains

The exact numerator factor 16 is correct: P0=8(q^2 Theta''+(3/2)q Theta')/Theta and Theta includes both positive and negative integers. Dividing by y=pi^2 q^2 theta2^4 theta4^4 gives the displayed full-series formula. For q>=1 every numerator orbit is positive. The geometric bounds use m(m+1)>=2m and n^2>=1+3(n-1), respectively. Theta4 is positive by its product and less than 1 by its alternating series. pi>3 and the independently replayed rational Taylor bound exp(3)>20 imply the strict bound T0>2/5. Reflection extends it to all real L.

For m>=1 the inverse bound is strict; for m=0 it is equality. The note's original strict statement for every nonnegative integer must be replaced by <=, or restricted to m>=1. This does not affect any integral or certificate.

Every fixed polynomial flux divided by a fixed power of T0 has vanishing mu-weighted endpoints. Its derivative is integrable: the denominator is uniformly bounded, VT0 is polynomial, and the previous full-theta superexponential tail controls each numerator. The drift is exactly -m R VT0/T0^(m+1). Clearing denominators is an algebraic identity, not multiplication of the original integral by a variable positive factor.

## Quadratic identity and normalization

Independently replayed the owned Sympy checker. Exact quadratic flux and localized SOS identities passed, as did the rational constants. Output: theta_sos_localization_independent.txt. The weighted product rule Ghat(Tj Tk)=(Tj+1 Tk+Tj Tk+1)/2 follows directly from the accepted T recurrence. The flux degree is at most 7 and source degree at most 8 (alpha is a fixed coefficient).

For p=t^2-alpha, the signed source is correct. For alpha>=0 the two root-deletion norms sum to 2T1^2+2alpha T0^2; for arbitrary real alpha the same integrated identity follows from pp''-p'^2, without a real-root claim.

Direct expansion of ell''''+4ell''^2 gives exactly Wnum/T0^4 with coefficients 1,-4,1,4,-2. The positive generator g2 is therefore imported only from the already independently audited complete-theta curvature bound >1254. Completing the square yields the stated denominator T0^2 and constant 1254/16. This is a reexpression of an existing degree-two payment, not a fresh numerical proof of that generator.

The ratio recurrence Rj+1=2V Rj+(T1/T0)Rj and -2V(T1/T0)=k>17 have the correct physical-u versus L factors. Each exact ratio reduces to Tj/T0; this does not make the recurrence sign-preserving or uniformly conditioned in degree.

## Accepted limits

The uniform denominator bound controls a known positive normalization only. It does not bound actual selected-polynomial coefficients, prefix inverses, unknown pivots, higher positive generators, or an all-degree SOS construction. Actual degree and inverse selection remain essential. No extension to positive-shift target positivity is established here.

## Final correction and upper-bound addition

The m=0 statement is corrected to <=. The appended T0<2 bound also passes: theta4>1-2E>9/10 by alternation, theta2^4>=16E, Theta>=1; n<=2^(n-1) implies n^4<=16^(n-1), and n^2-1>=3(n-1) supplies the convergent geometric series. The rational upper bound (10/9)^4/(1-16/8000)<2 was included in the refreshed independent checker replay. Thus 4/25 mu < mu T0^2 < 4 mu pointwise, only for these positive normalization weights, not signed-prefix matrices. Final reviewed prose SHA256 b8ffbd9441ceabe10cdd40966e0ad6e228725ddf1774585c45c7d6d77c30c6f7 (before permitted status-only freeze edit). All pending points resolved: PASS.
