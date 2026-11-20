# H4 extension and the first pointwise obstruction

2026-11-02. **Completed certificate; independent audit and full interval replay PASS.** See ../post_v7_audit/H4_AUDIT.md. No all-order or RH claim.

## Exact fourth-channel determinant

Use the notation X=−ell'', Y=ell⁽⁴⁾, Z=−ell⁽⁶⁾ from H3, and put W=ell⁽⁸⁾. The normalized pointwise product kernel has signed even moments

mu0=1,
mu1=2X,
mu2=2Y+12X²,
mu3=2Z+60XY+120X³,
mu4=2W+112XZ+140Y²+1680X²Y+1680X⁴.

(The subscript j means derivative order 2j.) After a diagonal sign congruence, its even H4 block is M=[mu_(j+k)]_(j,k=0)^2. Schur reduction of its upper-left1 gives A=2Y+8X², B=2Z+56XY+96X³, and D=2W+112XZ+136Y²+1632X²Y+1536X⁴. The exact determinant is

det M = AD−B²
=4[4WX²+WY+768X⁶+1344X⁴Y+128X³Z+304X²Y²+68Y³−Z²].

The goal proved by the certificate below is det M>500X⁶, with X>17 and A>0, for every h≥0. This proves pointwise even-block positive definiteness. H3 supplies the odd block. Integrating these positive definite matrices against the actual positive bridge weight proves H4(a)>0 for every a>0. There is no restriction to sampled a.

## Compact-domain certificate

The exact full theta and analytic infinite-tail enclosure are the same as H3, now through ordinary-z derivative order9. The positive tail ratio is bounded by (8/7)^22 exp(−15z)<1/2 on z≥3.

For numerical sharpness, the first summand is separated before logarithmic differentiation. If T=S−(2z−3)=(2z−3)r, then
r^(k)=[T^(k)−2k r^(k−1)]/(2z−3).
Ordinary derivatives of q=log(1+r) follow the exact logarithmic recurrence. The first-term derivatives are evaluated without cancellation using

D^k log f1=−2^k z−(−2)^k Σ_{m≥1}m^(k−1)t^m, t=3/(2z), D=2z∂z.

The sum is the exact rational expression Σ_j Stirling2(k−1,j) j! t^j/(1−t)^(j+1). For even k=2,4,6,8, evaluate ell^(k) at each rational-cell midpoint, then include the mean-value enclosure

|ell^(k)(z)−ell^(k)(z_mid)| ≤ radius·sup_cell |ell^(k+1)/(2z)|.

All products defining this radius bound are evaluated outwardly with intervals. This reduces cancellation but makes no numerical assumption. Each cell [3+i/1000,3+(i+1)/1000], i=0,...,12999, is checked for X>17,A>0 and det M−500X⁶>0. `certify_h4.py` and its output specify all parameters. An earlier natural interval implementation failed to certify its first cell because of overestimation; it is retained and clearly named as a failed bound, not used as evidence.

## Analytic half-line z≥16

Use the Cauchy disk |w|≤1/16 around real h, and z'=z exp(2w). Then
Re z' ≥(7/8)(127/128)z > (55/64)z,
|z'|< (8/7)z.
The exact theta-tail ratio obeys

|r(h+w)| <2Σ_{n≥2} n⁴ exp[−(55/4)(n²−1)] <64 exp(−165/4) <2^(−49).

The coefficient-ratio estimate follows from |n²(2n²z'−3)/(2z'−3)|<(554/343)n⁴<2n⁴. The series ratio is at most (3/2)^4 exp(−275/4)<1/2. As exp(3/4)>2, exp(165/4)>2^55. Therefore |q|<2^(−48), and

|q^(k)| < k!16^k 2^(−48) ≤40320/65536 <1, k≤8.

The exact positive geometric sums at t=3/32 give
16Σm³t^m=2176512/707281<4,
64Σm⁵t^m=26021566464/594823321<44,
256Σm⁷t^m=654465412718592/500246412961<1309.

Consequently
X>4z−1≥63,
|Y|<16z+5≤5X,
0<Z<64z+45≤17X,
|W|<256z+1310≤90X.

In the determinant polynomial, the terms128X³Z and304X²Y² are nonnegative. Bounding the remaining potentially negative terms yields

det M/4 ≥768X⁶−6720X⁵−8860X³−739X² >600X⁶,

using X≥63. In addition A=2Y+8X²>8X²−10X>0. Thus det M>2400X⁶ on this half-line, stronger than the target500.

## A rigorous limit of this method: pointwise H5 fails

The same full-theta interval representation, through derivative10 at z=pi, gives the odd3×3 matrix [mu_(j+k+1)]_(j,k=0)^2 with determinant enclosed near

−11,946,774,304,288,648.75504405632436.

Its full endpoints and moments are in `pointwise_h5_obstruction.json`; the independently authored checker is `certify_pointwise_h5_obstruction.py`. Since the determinant is strictly negative at h=0 and continuous, it is negative on a nonempty positive-h neighborhood. Thus the pointwise moment matrices cannot all be positive semidefinite.

This does NOT disprove positivity of the integrated H5(a), the actual kernel C_a, or RH. The bridge integrates over h with a positive weight, so a negative local block can be outweighed by other h regions. It does prove that this successful H3/H4 sufficient mechanism cannot simply be iterated without new integration or cancellation control. The all-order target must use that structure, a different representation, or an integrated signed-cost estimate.
