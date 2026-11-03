# Integrated complete-theta H5 positivity beyond the pointwise obstruction

2026-11-02. Computer-assisted interval theorem; no global RH claim. Scope 0<a≤1/2, including a removable normalized a=0 limit.

## Result and normalization

Let C_a be the established bridge kernel and define μ_n(a)=(-1)^n C_a^(2n)(0)/a. The odd three-channel block, after diagonal sign congruence, is

G_a=[[μ1,μ2,μ3],[μ2,μ3,μ4],[μ3,μ4,μ5]].

The attached interval integration proves G_a>0 uniformly 0≤a≤1/2. Combined with an independently certified even {0,2,4} block (H4), this proves H5>0. The odd-block certificate itself does NOT rely on H4.

This is not pointwise positivity in the spatial integration variable. The pointwise odd3×3 moment block has a validated negative determinant at h=0; the present result shows that integration restores positivity through this finite order.

## Exact integrands and derivative bounds

Set z=πe^(2h), P0(z)=2z²−3z and
P_(j+1)(z)=(1/2)P_j+2z(P_j′−P_j).
Then ψ^(j)(h)=4e^(h/2)Σ_(n≥1)P_j(n²z)e^(−n²z).
All coefficients are exact rational numbers; their absolute sums for j≤14 are less than10^40.

The r-th v jet product and its j-th h derivative are exactly

T_(r,j)=Σ_(k=0)^r Σ_(l=0)^j binom(r,k)(−1)^k binom(j,l) ψ^(k+l)ψ^(r−k+j−l).

Integrate (−1)^(r/2)w_a(h)T_(r,0), r=2,4,6,8,10, where
w_a(h)=h sinh(2ah)/a=2h²∫_0^1 cosh(2ath)dt.
This formula removes division by a and defines the a=0 limit.

For k≤4, all 0≤a≤1/2 and h≥0,
|w_a^(k)(h)|≤2cosh(h)Σ_(l=0)^min(k,2) binom(k,l) (2!/(2−l)!)h^(2−l)/(k−l+1).

The fourth derivative of the integrand is bounded by the binomial product rule, retaining every signed T_(r,j) before taking its interval absolute bound.

## Complete theta-index tail

The code keeps n≤10. For j≤14, deg P_j≤16 and the coefficient norm≤10^40, so
|P_j(n²z)|≤10^40 n^32(1+z)^16.
For z≥π>3, the successive ratio in n^32 exp(−(n²−1)z), n≥11, is at most
(12/11)^32 e^(−69)<1/2.
Moreover 8·10^40·11^32 e^(−360)<10^−70 (a very loose bound).
Hence the omitted tail of every ψ derivative is bounded by
10^−70 e^(h/2−z)(1+z)^16.
This symmetric interval is included in every derivative evaluation. It is not a finite theta truncation assumption.

## Spatial integral tail h≥4

The same estimate gives |ψ^(j)(h)|≤10^42 e^(h/2)(1+z)^16e^(−z) for all j≤14.
Using r≤10, w_a≤2h²e^h, h²≤e^h for h≥4, and z≥πe^8>9000, the absolute integration tail is at most
2^42·10^84 ∫_9000^∞ z^33e^(−2z)dz.
Since log z≤sqrt(z) and 33sqrt(z)≤z/2 on z≥9000, this is less than
2^43·10^84 e^(−13500)<10^−1000.
The code adds ±10^−1000 to each integrated jet interval.

## Validated quadrature and shift coverage

There are12 closed shift bins [j/24,(j+1)/24], j=0,...,11. Interval division constructs outward enclosures of their rational endpoints, so coverage has no floating-point gaps. Pointwise weight evaluation uses
w_a=2h²Σ_(k=0)^20(2ah)^(2k)/(2k+1)! plus a nonnegative remainder.
On h≤4 and a≤1/2 the remainder of the series is below
2·4^42/43!<10^−27,
since successive terms have ratio<1/2. This remainder is included before multiplication by2h².

Adaptive Simpson quadrature on dyadic subdivisions of [0,1/2],[1/2,1],[1,2],[2,4] uses the exact error bound interval fourth-derivative-supremum times length^5/2880. At each node the full closed shift bin is evaluated as an interval; this bounds every shift in it, not only selected shifts. Dyadic quadrature nodes are exactly represented at the working precision. Arithmetic uses mpmath.iv at40 decimal digits. The signed derivative moments are enclosed, not estimated from floating-point eigenvalues.

For the odd block use the fixed diagonal congruence S=diag(1,200,80000) and interval LDL on S^−1G_aS^−1. All12 bins have strictly positive pivots; the actual pivot intervals, all moment intervals, quadrature leaf count and runtime are stored in certificate.json. Positive pivots imply positive definiteness for every matrix enclosed by those intervals. No pointwise fiber-positivity hypothesis is used.

## Limits and next step

This certifies six derivative channels only when combined with H4, not all cardinalities or all derivative orders. It establishes that the first certified pointwise obstruction can be overcome by the actual full theta integration. Uniform all-order control of the integrated negative cost remains open. The analytic reflected Sobolev formula in ../all_order_closure_v1 provides one exact representation of that unresolved cost.

## Completed interval outcomes and all-shift extension

Corrected outward-bin run: all12 bins PASS, independently replayed with identical intervals. The minimum third normalized LDL pivot is greater than0.09778764. The low-core tail-matrix run in certify_tail_core.py also passes for every H∈[0,1/8], independently replayed; minimum pivots exceed1.34115,0.43514,0.10210. An exploratory attempt to cover [0,1/4] with the same coarse rectangle enclosure failed from interval width; its result is labeled exploratory and is not used.

SPATIAL_TAIL_PROPAGATION.md gives the exact all-shift extension. The complementary pointwise outer theorem is in ../h5_tail_v1/POINTWISE_TAIL_PROOF.md and its certificate; together with the low-core tail certificate, it implies the odd block is positive for every a>0 and Loewner-monotone after normalization by a. The independent outer-tail5600-cell replay and analytic half-line audit have passed, completing this all-positive-shift extension. Together with the reviewed H4 theorem, full H5 is strictly positive for every a>0.
