# Paid relaxation v2: cancel the derivative square before estimating

Status: exact identities plus explicitly labelled floating diagnostics. The finite n2,a1/4,lambda[0,1] Arb paired-budget certificate is independently accepted; see CERTIFICATE.md. Growing-degree and Gaussian-budget diagnostics retain their stated floating-only status. No extension of known finite positivity order or all-order RH claim.

## Exact forcing cancellation
Use the conventions of information_relaxation_v1/COMPENSATED_SCHUR.md. Put g(u)=e^{au}e^{lambda u²}psi(u), f=p(-iD)g and k=p'(-iD)g, where p has one parity. Parseval and the commutator [p(-iD),u]=-i p'(-iD) give
 D_lambda[p]=Q^[1][p]-Q[p']
 =(pi/2) integral_R u (|u f-i k|²-|k|²)du
 =(pi/2) integral_R [u³|f|²+2u² Re(i f conjugate(k))]du.
The entire |k|² term cancels identically. It must be cancelled before an upper estimate; separate Cauchy estimates throw it away.

For the even degree-two residual p(t)=t²-alpha, f=-g''-alpha g and k=-2ig'. Then
 J(u)=u³ f(u)²-4u² f(u)g'(u),
 D=(pi/2) integral_0^infinity [J(u)+J(-u)]du.
The safe paired budget is
 B_pair=(pi/2) integral_0^infinity max(J(u)+J(-u),0)du >=D.
It assumes neither local nor global forcing positivity. It is suitable for the same paid inequality S0>=S_Lambda-2 integral B_pair.

Additional exact n2 simplification: alpha=b/A=integral u(g')²/integral ug², since integration by parts gives b=integral u g(-g'')=integral u(g')². Thus
 D=(pi/2)[integral u³ f²-8alpha integral ug²].
This last expression is an exact identity, not a positivity assertion.

## Actual theta diagnostic
Own-source theta_budget_n2.py uses the full-form theta series truncated at ten orbits and |u|<=3 with floating adaptive quadrature. It has NO rigorous tail/roundoff certificate. At a=1/4, n=2:
 S0 approximately 6.68755279629143;
 D0 approximately .0228435346068983;
 separate Cauchy budget B0 approximately 41.3355043247799.
For Lambda=.1, the separate budget divided by terminal S is 1.23605 (fails); the paired budget ratio is .0323096 (passes numerically).
For Lambda=1, terminal S approximately 6.77112044920128; separate budget ratio12.2923 fails, while paired ratio .333242 gives a positive numerical paid lower bound4.51469647384007.
The exact signed evolution S_Lambda-2 integral D=S0 replays within2e-14 in these floating calculations. This is a consistency test, not rigorous error control.

These data identify a finite full-theta cancellation gain of roughly37x in the integrated budget at Lambda1. They do not claim an all-degree constant.

## Exact Gaussian benchmark for the generic-budget loss
For psi=e^{-beta u²}, b=beta-lambda, the monic Hermite residual has
 S_n=C a n! b^{n-3/2}exp(a²/(2b)), C=pi sqrt(2pi)/8,
 D/S=(3-2n)/(4b)+a²/(4b²).
The generic positive Cauchy budget satisfies the closed formula
 B/S=sqrt(A C2)/(4ab²)+n sqrt((2n-1)b+a²)/(ab),
 A=(2n+1)b+a²,
 C2=(6n²-2n+3)b²+(4n+6)a²b+a⁴.
For n=0 the second term is absent. These follow from Gaussian Hermite moments E[t²p_n²]=(2n+1)b E[p_n²] and E[t⁴p_n²]=(6n²+6n+3)b² E[p_n²].
At beta1,a=.25,Lambda.1, diagnostic budget/terminal ratios are n2:5.26459, n5:24.87446, n19:447.57796, even though all true bridges are positive. Corresponding small Lambda crossing estimates are .0198080,.00494071,.000661350. This quantifies the cost of ignoring phase and signed forcing cancellation.

## Scope and next useful estimate
The paired formula is degree-general but has not been controlled uniformly on actual Schur residual polynomials. Theta-specific arithmetic/reflection structure must keep the integrated positive part below the available terminal reserve as degree grows. The existing strong-concavity multiplier estimates alone still pay higher derivatives and do not prove that relative budget.

## Growing-degree diagnostic: what the paired budget still loses
A separate self-authored vectorized replay theta_budget_degrees.py uses1600 spatial and80 deformation Gauss-Legendre nodes, a=.25,Lambda1, ten orbits and |u|<=3. It is floating-only, with sampled (not certified pathwise) lower-block positivity. Paired budget/terminal ratios are approximately:
 n2 .3332445; n3 .6000270; n4 .8978336; n5 1.1641353; n6 1.4140354; n7 1.6868115.
Thus pairing repairs the generic Cauchy budget at degrees2–4 in this diagnostic, but by degree5 its local positive-part bound is too expensive. The true terminal residuals remain positive in the diagnostic. Signed integration recovers original residuals to floating relative precision. This does not refute any finite positivity claim: it identifies the remaining loss from discarding negative spatial forcing credit. No all-degree extrapolation is justified.
