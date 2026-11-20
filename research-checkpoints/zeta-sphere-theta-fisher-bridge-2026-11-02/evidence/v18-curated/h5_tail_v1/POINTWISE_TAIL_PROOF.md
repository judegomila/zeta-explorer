# H5: pointwise positivity beyond the signed core

2026-11-02. Independent review, symbolic checks and full interval replay PASS. See ../post_v7_audit/ for the combined all-shift H5 audit. This is one ingredient of the integrated all-shift proof, not an all-order result.

## Statement

The original Bell-fiber odd H5 block is positive definite for h≥1/8. More strongly, it is positive definite wherever z=pi exp(2h)≥4. Below this cutoff, pointwise positivity is NOT asserted; the h=0 block is independently certified indefinite.

## Exact polynomial

Write X=−ell'', Y=ell⁽⁴⁾, Z=−ell⁽⁶⁾, W=ell⁽⁸⁾, V=−ell⁽¹⁰⁾. The signed moments through8 are those in the H4 note. The new moment is

mu5=2V+180XW+840YZ+5040X²Z+12600XY²+50400X³Y+30240X⁵.

For O=[mu_(j+k+1)]_(j,k=0)^2, its exact determinant is

192VX⁴+144VX²Y+8VXZ−8VY²−8W²X
+9600WX⁵+3360WX³Y−80WX²Z−1360WXY²+16WYZ
+368640X⁹+1198080X⁷Y+168960X⁶Z+867840X⁵Y²
+115200X⁴YZ+220800X³Y³−992X³Z²+53440X²Y²Z
−56000XY⁴+3536XYZ²−2240Y³Z−8Z³.

The first leading minor2X and the leading2×2 minor are positive by the independently proved pointwise H3 estimate. Thus positive determinant suffices for O positive definite.

## Compact interval

`certify_pointwise_h5_tail.py` uses the full theta derivative representation and tail bound from H4, through order11, to enclose even log derivatives through10 by Taylor-centered mean-value bounds. The positive infinite-tail ratio is at most (8/7)^26 exp(−15z)<1/2. It tests each rational cell of width1/200 covering [4,32] for X>17 and det O>10000X⁹. All tail terms are retained as rigorous interval errors, not discarded. See the final JSON/run output for completed results.

## Analytic half-line z≥32

On the complex u-disk radius1/16, the earlier geometric estimates give Re z'>(55/64)z and the summand ratio bound<2n⁴. Thus

|r|<64 exp(−165/2)<2^(−104),  |log(1+r)|<2^(−103).

Cauchy's bound is k!16^k 2^(−103)<1 through k=10. Therefore the full log derivatives differ from first-summand derivatives by less than1.

For t=3/(2z)≤3/64, exact rational geometric sums give

16Σm³t^m<2,
64Σm⁵t^m<10,
256Σm⁷t^m<168,
1024Σm⁹t^m<5159.

In particular the following conservative inequalities hold uniformly:

X>4z−1≥127,
|Y|<16z+3≤5X,
0<Z<64z+11≤17X,
|W|<256z+169≤90X,
0<V<1024z+5160≤300X.

The last inequality holds since z≥32 gives176z≥5632>5460. For every nonleading monomial in the displayed determinant, substitute |Y|≤5X, |Z|≤17X, |W|≤90X, |V|≤300X. All resulting powers have degree<9. Since X≥127, the entire absolute cost divided by X⁹ is at most48710.648402, rigorously less than68640. Therefore

det O >300000X⁹.

`analytic_tail_checks.py` verifies the exact rational inequalities, including this cost sum. This proves the unbounded half-line.

Finally, h≥1/8 implies z≥pi exp(1/4)>4: pi>25/8 and exp(1/4)>1+1/4+1/32=41/32, whose product is1025/256>4.

## Integration is essential

This theorem is compatible with the negative pointwise determinant near h=0. It is intended to combine with a separately certified positivity of the tail matrices F(H)=∫_H^∞2h²ψ(h)²M(h)dh for0≤H≤1/8. If all these tail matrices are positive, integration by parts against the increasing ratio sinh(2ah)/(2ah) yields the integrated H5 result for every a>0. This note alone does not assert that low-H tail-matrix condition.
