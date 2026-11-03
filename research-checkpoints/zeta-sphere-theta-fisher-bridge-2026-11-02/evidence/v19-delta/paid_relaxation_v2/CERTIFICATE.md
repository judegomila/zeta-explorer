# Candidate Arb rectangle certificate for n2, a=1/4, lambda in [0,1]

Status: author and independent N60000,L1000 Arb replay PASS; analytic proof, interval semantics and infinite tails independently accepted. Coarse meshes in certify_n2.json and certify_n2_fine.json FAIL by overestimation; they are retained as failed attempts, not mathematical counterexamples. certify_n2_final.json is the refined run. All reported Q energies omit the common positive factor pi/2, so the sign and paid comparison are unchanged.

## Enclosure method
certify_n2.py is self-authored. It uses installed Arb via python-flint at128 bits. It encloses each u interval in [0,3] and lambda interval in [0,1], sums rectangle enclosures for A,b,d, obtains alpha=b/A only after certifying A>0, and bounds the positive part of each paired J interval by ((J+|J|)/2).upper(). Multiplying the positive-part integral by2 and integrating lambda yields the exact paid budget upper enclosure. Endpoint lambda1 uses the actual residual S=d-b²/A. Thus PASS requires the entire terminal enclosure to exceed the entire paid budget enclosure.

The derivative polynomials are P0=-3z+2z², P1=-(15/2)z+15z²-4z³, P2=-(75/4)z+(165/2)z²-56z³+8z⁴, with psi^(j)(h)=4exp(h/2)sum_n Pj(z_n)e^{-z_n}, z_n=pi n²exp2h for h>=0. Negative arguments use even/odd reflection. Ten orbits are evaluated; infinite tails are enclosed as follows.

## Uniform missing-orbit bound
For j<=2 and z>=1, |Pj(z)|<=166 z⁴. Since exp(h/2)<=z_n^{1/4}, each missing derivative term is at most664 z_n⁵e^{-z_n}. For n>=11, z_n>=3n²>=363, and z⁵e^{-z} decreases. Therefore the missing sum is bounded by
 664 sum_(n>=11)(3n²)⁵e^{-3n²}
 <=664*363⁵e^{-363}/(1-10^{-20}) <10^{-140}.
The ratio is at most(12/11)^10 e^{-69}<10^{-20}. The final numeric inequality is checked in the script; the ratio inequality is elementary and independently checkable. Symmetric Arb radius10^{-140} is added to EACH derivative value on every u cell.

## Infinite spatial tail
For u>=3, z=pi exp2u>1200. The same derivative-polynomial bound and a geometric orbit bound give |psi^(j)(u)|<=1328 z⁵e^{-z}, j<=2 (the n>=2 tail is much smaller than the first term; the factor2 is conservative).
For 0<=lambda<=1,a=1/4, differentiation of g=e^{au+lambda u²}psi and its reflected value yields, for j<=2,
 |g^(j)(+/-u)|<=28000 u² z⁵ exp(u²+u/4-z)<=exp(-z/2).
To check the last inequality, at u3 its logarithmic prefactor is less64 while z/2>600. Its derivative is at most2u+11, while the derivative of z/2 is z>=1200 exp(2(u-3))>2u+11. Thus the inequality holds on the whole tail.
The code verifies |alpha|<100 on every lambda cell. Hence |f|<=101exp(-z/2). Each missing paired A,b,d integrand is bounded by2u exp(-z); the positive-part J integrand is bounded by30000u³exp(-z). Since z>=1200+2400(u-3), each integrated tail is less10^{-100}. The script adds symmetric radius10^{-100} to A,b,d and upper10^{-100} to every lambda-cell J integral. These bounds also dominate the endpoint tails.

## Required audit scope
Check the interval constructors, positivity-part enclosure, use of whole-line integration by parts for b=integral u(g')², halfline reflection signs, and the above two infinite-tail estimates. A passing result is only the finite n2,a1/4,lambda0..1 paid certificate. It gives no higher-degree or all-shift claim and uses an already-known finite-order target; its purpose is to certify a working paid-cancellation mechanism.

## Author run completed
The refined N=60000,L=1000 run returned PASS. Endpoint_summary.py independently re-encloses the endpoint and combines it with the completed budget. Its conservative lower bounds are:
 terminal S1 >3.6442681947430138 (unscaled),
 budget <3.1520578244213186 (unscaled),
 original S0 >.4922103693903727 (unscaled), hence >.7731622305426291 with the common pi/2 Fourier normalization.
The slight extra rounding in the final lower bound is retained. Independent auditor replay completed PASS with the identical budget. Directed endpoint summaries are stored separately in endpoint_summary.json; they are not the coarse default Arb display strings in certify_n2_final.json.
