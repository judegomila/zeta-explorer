# Independent audit: selected orthogonality dual

2026-11-03. Analytic PASS. No numerical probe is promoted to a certificate.

## Prefix and normalization

The lower coefficient column uses only cross moments through n-1, with a known positive lower block. Its exact equations imply E_rho z=0. Since rho=2u^2 psi^2/M0 on the positive half-line and all g_j are even, h[p]=4pi M0 E_rho f. Therefore the lower-bound direction h>=4pi M0 lambda_* is correct. Constant dual coefficients add only established zero-mean quantities. A spatially varying coefficient or a weighted divergence would require a different argument; the note correctly distinguishes these.

Multiplication of the pointwise inequality by T0^2 is legitimate because it is everywhere strictly positive. It does not normalize by the missing norm or suppress actual inverse-selected coefficients.

## Tail and finite-dimensional attainment

The accepted complete-theta fixed-order expansion gives kappa2=2Z+O(1), and higher even cumulants are O(Z). In the Bell expansion, only the j repeated kappa2 factors have degree j, with coefficient (2j)!/(2^j j!), giving (2j)!Z^j/j!. Lower fixed-order terms have degree at most j-1. Thus f has positive leading degree n and z_k has degree epsilon+N+k<=n-1. The leading powers of the z_k are distinct. All estimates are fixed-degree and retain actual selected coefficients.

Consequently f-2a.z is coercive in u uniformly for a in a bounded parameter set. Its infimum is attained; the minimizing sets are locally uniformly compact. This supplies continuity as well as concavity of lambda(a).

For N>0, every nonzero linear combination of z is nontrivial by its distinct leading powers. Its true mean is zero under a full-support positive density, so it takes both signs. Finite covering of the unit sphere gives finitely many samples whose support function is uniformly positive, and hence a convex hull containing a ball about zero. This proves lambda(a)<=Fmax-2delta||a|| and existence of a finite attained maximum. For N=0 the compact-minimum argument applies for n=1; n=0 is separately constant f=1. No uniform conditioning or optimizer-size bound is obtained.

## Atomic dual

At an optimizer, failure of 0 to lie in the convex hull of active z-values gives a strictly separating direction. Choosing the sign of the parameter change to increase every active affine function contradicts maximality; compactness and the uniform coercive tail prevent a competing minimizer from escaping. Thus the active convex hull contains zero. Caratheodory yields at most N+1 active samples with probability weights and exact zero z-mean. Their f-mean equals lambda_*.

Conversely, integrating f-2a.z>=lambda(a) gives weak duality for every feasible probability measure. With finite f-expectation, z integrability follows from z=o(f) and boundedness on compact sets; infinite positive f-expectation cannot improve the minimum. The resulting equality is a genuine attained atomic dual, without constraining the unknown target moment. Strict positivity of every feasible atomic witness would imply positive lambda_* because an optimizer exists; it is not established here.

## Counterexample and limits

The abstract two-state example has selected c=-1, old scalar block 1, actual integrated target 1, zero cross-density z, and f values -1 and 3. Hence lambda_*=-1 despite a positive actual norm. It is correctly labeled non-theta and need not obey the linear-independence or curvature premises used for the actual-theta attainment proof.

Accepted result: a fixed-degree, normalized-a=0, noncircular variational lower bound and exact finite atomic dual. No positivity of its margin, uniform degree bound, positive-shift extension, new rung, or RH result follows. Probe files remain uncertified and unused.

## Added explicit coercivity constants

PASS for N>0. Independence and full support give Cz>0. Interpolation ||Y||2<=||Y||1^(1/3)||Y||4^(2/3) implies E|Y|>=c0^(3/2)/sqrt(C4); zero mean gives EY_+>=delta0. The positive tilt has E_nu Y=E(Y_+^2)/EY_+>=EY_+>=delta0. Cauchy bounds its f-mean in absolute value by sqrt(F2 C2)/delta0. Integrating the pointwise infimum against this tilt proves lambda(a)<=C0-2delta0||a||. Comparing a maximizer with lambda(0)=inf f proves the stated norm bound. The a=0 case follows directly without a directional tilt. All these integrals converge at fixed degree by the full-theta tails. They are auxiliary positive-parent quantities, not a substitution for the actual signed prefix or an assumed target margin; no uniform degree estimate follows.
