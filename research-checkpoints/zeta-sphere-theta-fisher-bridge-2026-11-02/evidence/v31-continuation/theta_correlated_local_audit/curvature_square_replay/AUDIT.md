# Independent audit: actual theta quadratic square payment

Mathematics and owned compact checker PASS, 2026-11-03. Independently replayed 4000 Arb cells at 160 bits; compact lower bound is >1254.97168240277899 on 0<=u<=1. No acquired code executed. Final author prose is reviewed separately when supplied.

## Identity
For C(r)=integral u² psi(r+u)psi(r-u)du and k=(log psi)'', evenness yields C''(0)=2 integral u²psi²k and C4(0)=integral u²psi²(12k²+2k''). Applying (D4/16+alpha D2/2+alpha²) gives exactly
h[t²-alpha]/(4pi)=integral u²psi²[(alpha+k/2)²+(4k²+k'')/8].
All integrations/differentiations are justified by complete-theta superexponential decay. Alpha is any real number; no inverse or next norm is used in this identity.

## Independent omitted-orbit derivative bound
Write r_n=n²(2n²z-3)/(2z-3) exp(-(n²-1)z), n>=2, z>=pi>3, and x=n²z>=12. The explicit first four derivatives of log r_n are differences of the displayed first-orbit scores. Since 2w-3>=w for w>=3, their absolute values are bounded respectively by 3x,5x,13x,60x. For the fourth score correction use 96(4+24/w+9/w²)/w<=1248/w; the two arguments contribute <=520 at z>=3,n>=2, and 16x+520<=60x. Analogously the third correction is <=144/w, and the second <=24/w. These verify all four bounds directly.

The fourth complete Bell polynomial has absolute value <=81x4+270x3+231x2+60x<106x4 for x>=12. All lower Bell orders are also <=106x4. Since r_n<=2n4 exp(-(n²-1)z), every derivative order j=0,...,4 obeys
|D^j r_n|<=212 n12 z4 exp(-(n²-1)z).
This is much stronger than both envelope coefficients used by the author.

For n>=9 and z>=pi, consecutive n12 exponential terms have ratio at most (10/9)^12 exp(-19pi)<1/2. Enlarging 212 to196608 and summing gives exactly 393216*9^12*z4 exp(-80z), the checker tail. For n>=2,z>=20, the ratio is at most (3/2)^12 exp(-100)<1/2. Enlarging 212 to24576 gives total <=201326592*z4 exp(-3z), the outer envelope. z4 exp(-3z) decreases on z>=20.

## Stable ratios and outer region
The checker uses exact log-ratio Bell derivatives and correct second/fourth derivatives of log(1+r), with symmetric full-tail enclosures. No unstable division by a tiny psi occurs. On z>=20 the derivative envelope eps<3e-13 yields log-correction derivatives2 and4 smaller than1e-12. The single-orbit fourth log derivative is >=-16z-3: the rational correction decreases with z and is checked at20. Hence |k|>=4z-1 and k''>=-16z-4, giving 4k²+k''>=4(4z-1)²-16z-4>0 (indeed >24640 at20 and increasing). The compact interval overlaps the tail because pi exp(2)>20. Evenness covers negative u.

Thus the all-real-u positivity is established and yields a positive quadratic-family contact for every real alpha. This is a theta-specific square-payment mechanism at the quadratic family, not an all-degree recurrence or a new ladder order.

Final THETA_CURVATURE_PAYMENT.md checked: PASS. The author's separate geometric-series/Stirling/Leibniz derivation is also sound through derivative order4. Its sum bound gives32*j!*4^j and hence196608 at j4; the improved outer A_n coefficient2 instead of16 gives24576. Both consecutive-n ratios are below1/2. The compact lower bound >1254.97 and outer bound >24640 justify the uniform >1254 statement. Consequently h[t²-alpha]>(1254/8)h[1] for every real alpha, with h[1]>0. The proof correctly limits this result to the quadratic family and does not extrapolate to universal local source-matrix positivity.

Post-PASS Section0 addition separately checked: h[p]=2||(pF)'||²+integral(pp''-(p')²)F² follows by expansion and one IBP. For real roots, p²(log p)''=-sum_j[p/(t-r_j)]², counting multiplicities, hence the exact root-deletion identity. Parseval contributes2pi. Actual real-simple roots require the requisite positive known prefix, including shifted x-prefix positivity in parity coordinates; the next pivot is not assumed. The initial odd formula h[t]/(2pi)=-integral u²psi² k also checks directly from C''(0). These are exact accounting identities, not a general root-deletion cost domination.
