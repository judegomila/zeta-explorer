# Explicit positive-shift and spatial-cutoff rectangles

This finite theorem extends the verified normalized cutoff family to an explicit continuum of positive bridge shifts. It retains complete theta, the original signed moments, and the actual full Gram matrix. It is not an all-shift or all-degree result.

## 1. Actual normalized shifted target

Define sinhc(x)=sinh(x)/x, with sinhc(0)=1. In the same normalized bridge convention as the previously reviewed moment formulation, set
 B_epsilon(a,H)_(ij)=2 integral_H^infinity u² sinhc(2au) psi(u)² g_(i+j+epsilon)(u) du,
 i,j=0,...,4, epsilon=0,1.                         (1)
The bases are1,t²,t⁴,t⁶,t⁸ and t,t³,t⁵,t⁷,t⁹. At a=0 these are exactly the matrices of the preceding cutoff-family certificate. For positive a, the positive bridge weight is proportional to u sinh(2au); its normalization by a gives (1). Thus this is the actual shifted signed target, not a positive-parent surrogate. Conventions using mu_j=4^j g_j differ by positive diagonal congruence and a positive scalar.

Let P_epsilon be the fixed upper-triangular rational coefficient matrices in `shift_rational_basis.json`. Their decimal entries are interpreted as exact rationals. A numerical Cholesky computation only suggested these candidates; all assertions below use interval evaluation of their actual signed Grams. No claim relies on floating Cholesky accuracy or exact orthogonality.

## 2. A common a=0 reserve for every cutoff

The owned checker first establishes
 P_0^T B_0(0,H)P_0 >= beta_even I,
 P_1^T B_1(0,H)P_1 >= beta_odd I,
 simultaneously for every0<=H<=1/8, with
 beta_even>.9456613389480649,
 beta_odd >.9389382127993650.                       (2)

This is checked directly, not inferred merely from endpoint Schur values. Starting moments atH=1/8 are the independently evaluated target/old/cross data from the preceding packet. Across4000 inward cells, signed partial-increment hulls enclose every moment on the whole cell, while midpoint updates include complete second-derivative errors. On each transformed5x5 interval matrix, diagonal lower endpoints minus absolute off-diagonal row sums give a uniform Gershgorin reserve. Row minima are directed lower endpoints. Every cell passes. This retains possible local negative directions.

In particular P_epsilon is nonsingular: a singular coefficient matrix could not have a strictly positive transformed Gram. Its upper-triangular shape and nonzero diagonal are also explicit in the retained rational data.

## 3. A quantitative signed perturbation estimate

Let sigma_ij(u) be the entries of the transformed a=0 local density:
 sigma_ij(u)=[P_epsilon^T (2u²psi²[g_(r+s+epsilon)]) P_epsilon]_(ij).
These functions are signed. They are never assumed positive.

For x>=0,
 sinhc(x)=integral_0^1 cosh(tx)dt,
 0<=sinhc(x)-1<=x²cosh(x)/6.
Indeed cosh(y)-1<=y²cosh(y)/2 and integrate t². For0<=a<=1/2 this gives
 0<=sinhc(2au)-1 <=(2/3)a²u²cosh(u).               (3)

Consequently, uniformly in0<=H<=1/8,
 |[P^T(B(a,H)-B(0,H))P]_(ij)|
 <=(2/3)a² integral_0^infinity u²cosh(u)|sigma_ij(u)|du.
Taking maximum absolute row sum bounds the symmetric operator norm:
 ||P^T(B(a,H)-B(0,H))P|| <=a² K_epsilon,           (4)
where the complete-theta calculation gives
 K_even<6.530529530463590,
 K_odd <35.71145596579880.                          (5)

The cost uses absolute values only for this finite shift perturbation. It does not claim that absolute-value estimates solve the original signed target in every degree. The already certified full-matrix reserve (2) pays the actual signed perturbation (4).

## 4. Complete orbit and spatial bounds for the cost

On[0,2],8000 interval cells enclose the transformed local entries using the reviewed complete-theta derivative20 routine. Multiplying their absolute interval bounds by u²cosh(u) and cell width gives upper rectangle integrals. No sampled quadrature or unbounded derivative remainder is involved in these cost estimates. Exact rational polynomial-coefficient convolutions are used before taking the entrywise absolute value.

For u>=2, z=pi exp(2u), the complete theta and log-derivative bounds give
 psi(u)²<=256 z^4 exp(u) exp(-2z),
 |g_j(u)|<=(2j)!(9z)^j, j<=9.
Use u²<=z and cosh(u)<=exp(u)=sqrt(z/pi). After the change du=dz/(2z), the additional u²cosh(u) weighted full-line moment tail is bounded by
 (256/pi)(2j)!9^j Z^(j+6)exp(-2Z), Z=pi exp4.      (6)
Here2-(j+6)/Z>1 for everyj<=9, so integrating the decreasing exponential-polynomial majorant costs at most its endpoint value. Every orbit is included through the existing analytic omitted-orbit enclosure; (6) is the entire remaining spatial tail.

Each transformed entry tail is bounded by the exact absolute coefficient sum times (6). The maximum weighted tail entry is below2.194e-107 for the even basis and7.939e-104 for the odd basis. These small tails are actually included, not simply declared negligible.

## 5. Explicit rectangles and paid inverse consequences

Combining (2)-(5) proves
 P_0^T B_0(a,H)P_0 >.5375032432940905 I
 for every0<=a<=1/4 and0<=H<=1/8;

 P_1^T B_1(a,H)P_1 >.3809467133337588 I
 for every0<=a<=1/8 and0<=H<=1/8.                  (7)

The first numerical checker selected a dyadic endpoint preserving at least half the initial reserve; that conservative selector reports1/16 for odd9. The separate exact consequence checker verifies the stronger1/8 endpoint in(7), whose still-positive reserve is about.38095. This is a direct use of the same interval inequalities, not an extrapolation or a new sample.

Full Gram positivity controls every actual old principal block and its target Schur complement. It does not omit the inverse cost. More explicitly, because P is upper triangular, a monic top-degree polynomial has last P-coordinate1/P_44. From(7), minimization over all its lower coefficients gives the actual monic Schur bounds
 even8: S(a,H)>355,975,026,946 throughout its rectangle;
 odd9:  S(a,H)>32,936,186,988,246 throughout its rectangle.
These use the full signed target metric and include the optimally reoptimized lower coefficients. They are not obtained by identifying a positive parent norm with a signed Schur reserve.

The normalized spectral kernel remains even for every a. Thus mixed-parity entries vanish, and both results combine to degree-at-most9 positivity for the full normalized target on the common rectangle
             0<=a<=1/8, 0<=H<=1/8.                (8)
For positive a, multiplying back by the positive bridge-normalization factor preserves the original target's sign.

## 6. Exact additional scope and remaining gap

The named prior audits established global even8 for0<=a<=1/2, plus the outer-strip sign for larger positive shifts. Therefore the even global spectral-shift range here is not an extension. Its cutoff rectangle is the relevant extra statement in this packet.

The named odd-through19 certificate established normalized a=0. The finite-shift action evaluations in fisher_bridge_v3/ENDPOINT_AND_ACTION.md were explicitly exploratory at1/64,1/8,1/4,.49; they were not uniform positive-shift interval certificates. Relative to those reviewed sources, (7)-(8) supply an explicit continuous positive-shift interval through odd9, simultaneously with the spatial cutoff interval. This scope statement does not claim mathematical novelty or absence of any other independently reviewed result elsewhere.

Nothing here controls the remaining shift gap beyond1/8 in the odd9 block, arbitrary spatial cutoffs, larger degrees, or all-degree correlated compensation. In particular, (8) is a finite positive-shift H9-range statement, not full all-shift H9 or RH. The quantitative argument is a finite-dimensional perturbation paid by a verified reserve, not a general inference from pointwise/local positivity.
