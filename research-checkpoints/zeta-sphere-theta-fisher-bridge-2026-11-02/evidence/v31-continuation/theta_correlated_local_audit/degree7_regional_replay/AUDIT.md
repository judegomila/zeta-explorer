# Independent degree7 regional payment audit

Owned4000-cell Arb192 replay completed PASS. In h/(4pi) units: core Schur>3729767162.63, tail Schur>919945172.03, variation core>206522714.69, variation tail>1186343779.95, total variation>1392866494.60, combined>6042578829.16. Direct global Schur independently formed from the same moment enclosures is>6072812186.69 and overlaps the combined enclosure, as required. This is not independent data for the two expressions; both retain the same complete-theta inputs.

No existing target moment, pivot certificate, or external acquired code was used. Only campaign-owned source and installed Arb were executed. M1..M7 are integrated from complete theta. The calculation reproduces normalized odd degree7, already included in earlier odd19 work; it is not a ladder extension or nonzero-shift theorem.

## Exact differentiation and integration
Q0=2 sum even ell_j r^j has spatial derivatives Q1=2 sum even (j+1)ell_(j+1)r^j and Q2=2 sum even(j+1)(j+2)ell_(j+2)r^j. Thus exp(Q0)'=exp(Q0)Q1 and exp(Q0)''=exp(Q0)(Q2+Q1²). Extracting coefficient2j and multiplying(-1)^j(2j)!/4^j gives g_j and its first two spatial derivatives. The source includes the linear h/2 in ell, needed for the weight derivatives, while it correctly omits odd/constant terms in Q0,Q1,Q2. Derivative16 suffices for g7's second derivative; no derivative18 is needed.

For weight w=2u²psi², w'=(4u+4u²ell')psi² and w''=(4+16u ell'+4u²(ell''+2ell'^2))psi². The source combines w''g+2w'g'+wg''. Whole-cell interval bounds give the exact midpoint error width³ sup|f''|/24. The split at u=.5 is an exact cell boundary. No pointwise positivity of local g-matrices is assumed.

## All tails
The existing geometric rational-derivative bound through16 gives |D^j A_n|<=2^20 n4 2^j j!; Leibniz gives C=2^21*16!*4^16 times n36 z16 exp(-(n²-1)z). Consecutive n>=9 ratio<1/2 justifies the inserted2C9^36 tail. Arb series coefficient errors are divided by j! before composing logarithms. The compact derivative tail is retained even at midpoint evaluations.

At z>=100 the improved A coefficient2 gives outer epsilon=8*16!*4^16*2^36*z16 exp(-3z), decreasing and tiny. The source explicitly verifies16!*epsilon*(1+epsilon)^15<1, paying the logarithmic composition constants. Hence the prior moment majorant |g_j|<=(2j)!9^j z^j applies throughj7. The complete spatial integral afteru=2 is bounded by256/sqrt(pi)*(2j)!9^j Z^(9/2+j)exp(-2Z), with Z=pi exp4 exceeding every exponent9/2+j. These errors are added symmetrically to the outer regional moments.

## Actual old inverse and variation
The LDL factors for each regional old3x3 block and the global old block are computed from their moment intervals; all three pivots are asserted strictly positive before use. Forward/back substitution, cost=sum y_j²/d_j, regression coefficients -A^-1b, and the quadratic v^TAv via L^Tv are exact. Regional coefficients and global coefficients are subtracted in the actual same basis. Interval dependency only widens the result; it cannot create a false lower bound. The regional Schur remainders happen to be positive in this run, so the computation does not claim a negative regional Schur was paid. It does demonstrate positive regional metrics and quantified positive variation despite previously certified local old-metric indefiniteness.

Final author proof note pending separate wording review.

Final DEGREE7_REGIONAL_PAYMENT.md reviewed PASS. All coarse directed bounds, regional target masses, inverse-cost ranges and largest spatial error<3.089e-104 agree with the independent output. The explanation of normalized generating coefficients correctly excludes Q1/Q2 constants while retaining the linear term for the weight. Reproduction status and absence of demonstrated negative regional target-remainder cancellation are explicit and accurate. No mathematical changes requested.
