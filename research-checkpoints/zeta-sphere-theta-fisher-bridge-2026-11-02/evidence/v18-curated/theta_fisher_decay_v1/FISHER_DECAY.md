# Actual theta orbit Fisher information relaxes exponentially on the positive half-line

Status: analytic derivation, independent review, and Arb constant replay passed. This is the orbit probability metric, not the complete bridge/jet metric.

Use the complete positive orbit law p_n(h)=f_n(h)/psi(h), h>=0, z=pi exp(2h), f_n=4exp(h/2)zn²(2zn²-3)exp(-zn²). The unnormalized score is
 S_n=9/2+6/(2zn²-3)-2zn²,
 and p'_n=p_n(S_n-E_p S). Its actual Fisher information is
 I(h)=sum_n p_n (S_n-E_pS)²=sum_(n<m)p_n p_m Delta_nm²,
 Delta_nm=S_n-S_m>0.
All differentiations of these nonnegative sums are justified locally uniformly by Gaussian orbit decay times finite polynomials.

## 1. Uniform mean-score deficit and initial Fisher upper bound
The full-tail ratio bound from orbit_covariance_transport_v1 is
 f_n/f_1 <=(48/25)n^4 exp[-z(n²-1)], z>=pi>157/50.
For n>=2,
 Delta_1n=2z(n²-1)+6/(2z-3)-6/(2zn²-3)
 <=2z(n²-1)+2.
For x>= (157/50)(n²-1)>1, both (2x+2)exp(-x) and (2x+2)²exp(-x) decrease. Also
 (157/25)(n²-1)+2 <=(339/50)n².
Consequently the full mean deficit c(h)=S_1-E_pS obeys
 c(h)<=sum_(n>=2)(f_n/f_1)Delta_1n
 <(48/25)(339/50) sum_(n>=2)n^6 exp[-(157/50)(n²-1)] <.068.
Similarly variance is no larger than squared distance from the fixed score S_1, so
 I(h)<=sum_(n>=2)p_n Delta_1n²
 <(48/25)(339/50)² sum_(n>=2)n^8 exp[-(157/50)(n²-1)] <2.
The n^6 and n^8 sum ratios are respectively at most
 (3/2)^6 exp(-157/10)<2*10^-6,
 (3/2)^8 exp(-157/10)<4*10^-6.
With exp(471/50)>12300 this gives rational bounds .067734 and1.83695. constants.py validates the transcendental constants with Arb; no finite orbit approximation is used.

## 2. Every pairwise Fisher summand contracts
For m>n,
 Delta_nm=2z(m²-n²)+6/(2zn²-3)-6/(2zm²-3).
The second term is positive and decreasing in h. Indeed its derivative equals
 -24z[n²/(2zn²-3)²-m²/(2zm²-3)²]<0,
 because a/(2za-3)² decreases in a>=1. Hence
 Delta'_nm<=4z(m²-n²)<=2Delta_nm.
The logarithmic derivative of an individual Fisher summand is therefore
 (log[p_n p_m Delta_nm²])'
 =S_n+S_m-2E_pS+2Delta'_nm/Delta_nm
 <=S_1+S_2-2E_pS+4
 =-Delta_12+2c(h)+4
 <=-6z+2c(h)+4
 <-6*(157/50)+.136+4=-14.704<-14.
Thus summing the rigorously dominated derivatives proves
 I'(h)<=-14I(h),  h>=0.
In particular
 0<I(h)<2exp(-14h).
The bound can be sharpened, but the deliberately simple constant14 is enough to certify genuine information relaxation of the full theta orbit law.

## 3. Consequences and exact scope
For two independent orbit indices, Fisher information is2I(h)<4exp(-14h). The Fisher path length from h to infinity is bounded by
 integral_h^infinity sqrt(I(u))du <sqrt(2)/7 exp(-7h).
The square-root probability embedding has speed sqrt(I)/2. Thus it has finite length and converges to the first-orbit point mass; the unscaled square-root distance ||sqrt(p(h))-sqrt(delta_1)||_2 is bounded by half the displayed Fisher length (and the conventionally normalized Hellinger distance is smaller by another factor sqrt(2)).

This does not prove bridge positivity, monotonicity of the original jet Schur reserves, or a contraction in their complete lower-block metric. The already-reviewed modular high-jet variance obstruction shows why: increasingly differentiated observables can amplify the rare orbits even while the probability law relaxes rapidly. A successful bridge argument must additionally control the exact derivative drift and score covariance relative to that actual metric.
