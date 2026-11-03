# Explicit adaptive orbit-tail envelope beyond the imaginary-order transition

2 November 2026. Independent hierarchy-lane review PASS; see CONTOUR_REVIEW_HIERARCHY.md. This bounds the exact omitted mixed-orbit Fourier tail on the natural exponential scale, not relative to an unknown signed head.

Let k=2tau>0, m=N+1, s0=2pi m, and assume s0>tau. Put

 theta=arcsin(tau/s0), c=cos(theta)>0, beta=2pi c.

For the exact corrected Ewald head D_(a,N), all 0<a<=1/2,

 |hat(C_a-D_(a,N))(k)/a|
 <= sqrt(pi/2) exp(-tau theta-beta m)/(1-exp(-beta))
    [(k²+2)/(beta^(3/2)sqrt(m))
       +(k²+4)²/(8 beta^(7/2)m^(5/2))].                 (1)

This is uniform as a decreases to zero and uses no zero locations.

## Derivation

For one positive mixed orbit with s=2pi nm and phase exp(-ik log(n/m)/2), its normalized Fourier contribution is

 (1/(32a))partial_a{P_a(k) integral_1^infinity
      2x^(-1/2)cosh(a logx) K_(i tau)(sx)dx}.

The complete axis block is retained exactly and does not enter the tail. For 0<a<=1/2,

 2x^(-1/2)cosh(a logx)<=2,
 [partial_a 2x^(-1/2)cosh(a logx)]/a<=2(logx)².

Use |P_a'|/a<=16(k²+2), P_a<=(k²+4)². Shifting the integral representation

 K_(i tau)(z)=(1/2)integral_R exp(-z cosh u+i tau u)du

to u+i theta is justified by exponential decay for theta<pi/2. It gives

 |K_(i tau)(z)|<=exp(-tau theta)K_0(zc)
 <=exp(-tau theta)sqrt(pi/(2zc))exp(-zc).

The last bound follows directly from cosh u>=1+u²/2. With b=sc, use x^(-1/2)<=1 and logx<=x-1 to obtain

 |hat I_nm(k)/a|<=sqrt(pi/2)exp(-tau theta-b)
       [(k²+2)b^(-3/2)+(k²+4)² b^(-7/2)/8].            (2)

Every omitted pair has product j=nm>=m. The number of positive ordered pairs with product j is at most j. Summing (2), bounding j^(-1/2)<=m^(-1/2) and j^(-5/2)<=m^(-5/2), and summing the remaining geometric series gives (1). Overcounting retained pairs with product>=m is harmless.

## Frequency-dependent regime and remaining sign obligation

If s0=u tau with any fixed u>1, then

 tau theta+beta m=pi tau/2+tau Phi(u),
 Phi(u)=sqrt(u²-1)-arccos(1/u)>0.

Positivity follows from Phi(1)=0 and Phi'(u)=sqrt(u²-1)/u>0. With u bounded away from1 and infinity, the prefactor in (1) is O_u(tau^(3/2)). Therefore the exact orbit tail is

 O_u(tau^(3/2)exp(-pi tau/2-tau Phi(u))).

This is exponentially smaller than the already proved N=1-head baseline tau³exp(-pi tau/2). The cutoff is N+1=u tau/(2pi), up to rounding. The rounding only increases s0 and may be incorporated directly in (1).

However D_(a,N) is NOT D_(a,1). Its added arithmetic orbits can almost cancel the N=1 baseline, as the universality obstruction demonstrates. Formula(1) does not supply a lower bound for D_(a,N). It provides an explicit viable tail budget for a future phase-correlated adaptive-head sign estimate; it cannot replace that estimate. There is no conflict with the fixed-head relative-gap obstruction.

This improves the mechanism of tail control compared with a height-independent spatial L1 estimate: the contour retains the oscillatory exponential decay before taking absolute values. Near u=1 the prefactor degenerates; a uniform turning-point treatment would be needed to approach the transition sharply. No such refinement is asserted here.

## Product-grouped adaptive head: fewer orbits, exact arithmetic phases

The same estimate applies without change to the hyperbolic cutoff

 D^times_(a,M)=A_a+sum_(nm<=M) I_nm,

with m=M+1 in (1). This preserves n,m interchange and the exact direct/dual Mellin pairing, while retaining only sum_(j<=M)d(j)=O(M log M) ordered pairs rather than a square with O(M²) pairs. The elementary count follows from sum_(n<=M)floor(M/n)<=M(1+log M).

More precisely the sum of all phases with product j is the real divisor polynomial

 B_j(tau)=sum_(d|j) exp[-i tau log(d²/j)]
         =sum_(d|j) cos[tau log(d²/j)].

Thus the entire product-j block is exactly

 [B_j(tau)/(32a)] partial_a{P_a(2tau) integral_1^infinity
       2x^(-1/2)cosh(a logx)K_(i tau)(2pi jx)dx}.

The adaptive finite arithmetic obligation is consequently a one-dimensional sum of these correlated product blocks plus the exact axis. All products above M≈u tau/(2pi) have the explicit exponentially smaller contour tail (1). This is a concrete grouping candidate, not a positive-weight representation: already B_p(tau)=2cos(tau log p) for a prime p takes both signs. Its phases must remain coupled to the Bessel/Mellin factor. Neither taking absolute values of these head terms nor claiming that each product block is positive is justified.

## A simple all-parameter certification budget

One need not optimize theta. Choose theta=pi/4 and m=M+1>=tau/(sqrt(2)pi), tau>=1. Repeating the same proof with beta=sqrt(2)pi gives the convenient elementary bound

 |hat(C_a-D^times_(a,M))(2tau)/a|
       <=5 tau^(3/2) exp[-(1+pi/4)tau].                 (3)

Indeed beta m>=tau; k²+2<=6tau² and (k²+4)²/8<=8tau⁴. The remaining prefactor is at most

 [14/(2sqrt(pi)(1-exp(-sqrt(2)pi)))]tau^(3/2)
       <5tau^(3/2).

The scalar inequality needs no numerical evaluation: pi>3, sqrt(2)>4/3, sqrt(pi)>5/3 and e^4>50 imply that its coefficient is <210/49<5.

Thus a fully explicit sufficient finite-head certificate at any tau>=1 is

 hat D^times_(a,M)(2tau)/a
       >5tau^(3/2)exp[-(1+pi/4)tau],
 M+1>=tau/(sqrt(2)pi).

No unknown full function appears in this test. It is not a proof that the test holds for every height. Relative to the positive N=1 baseline tau³exp(-pi tau/2), the certified tail allowance is at most

 5tau^(-3/2)exp[-(1-pi/4)tau].

The substantial missing step is a rigorous lower bound for this different, phase-bearing product head on the required heights and shifts. The universality result warns that the full head margin cannot simply be replaced by a fixed fraction of the N=1 baseline.

Primary standard identity: NIST DLMF 10.32.9, https://dlmf.nist.gov/10.32.E9, gives the real-line K integral used above. The contour displacement, Gaussian majorant, arithmetic counting and all constants are derived here.
