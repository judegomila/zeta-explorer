# Core/tail Schur transport and actual covariance repair: independent audit

2 November 2026. PASS for exact identities and the explicitly zero-shift numerical demonstration. This is not an all-degree core-sign theorem.

## Exact structural identities

Differentiating A r=b with A'=-A0 and b'=-b0 gives r'=-A^-1(b0-A0r). Differentiating c-b*A^-1b gives the stated S' formula. Completing the local square is valid only where A0 is positive definite; the proof correctly warns that integrated lower-block positivity does not imply this pointwise hypothesis. Integration backward from H* has the stated sign.

For two blocks with positive lower weights Ac,At, completing the common projection square gives the parallel-sum covariance identity. The matrix expression Ac-Ac(Ac+At)^-1Ac equals (Ac^-1+At^-1)^-1 even for noncommuting weights. The correction is positive. The tail-adapted formula without Ac positivity follows by replacing b with (At+Ac)r0+e; all cross terms cancel. The interpolation second derivative is -2(bc-Ac r_s)*(At+sAc)^-1(bc-Ac r_s), as stated. Matrix-channel versions use Hermitian products. None of these identities gives endpoint positivity without an actual residual bound.

The integrated Gaussian mixture is a valid lower reference from the reviewed outer theorem. Replacing it by a single smaller variance is not valid in Loewner order; the polynomial-square counterexample checks. The fixed-matrix lower-weight covariance estimate follows by minimization and the weighted variance identity, subject to finite positive Lambda and finite displayed integrals.

The scalar tail moment identity checks by expanding (d_y-d_x)^2=(d_y+d_x)^2-4d_xd_y. Integrating the even diagonal derivatives against 2h² yields the displayed three boundary terms; the j=1 bulk correction is -n4^n integral |psi^(n-1)|². At H=0 boundary derivatives are odd and vanish. It is an exact but potentially unstable representation; high-order floating experiments are not treated as evidence.

## Actual complete-theta H5 covariance repair

Independently replayed the campaign-authored certify_covariance_repair.py into this separate directory. Added explicit first-diagonal positivity assertions to every 2x2 inversion in addition to determinant positivity. Replay PASS, 256 adaptive Simpson cells; lower blocks and parallel-sum inverse blocks are positive definite.

**Scope:** K_0 = lim_(a->0) C_a/a, with density 2h² times the signed derivative-product moments. Core is [0,1/16], tail [1/16,infinity). The full moment enclosure is conservatively inherited from the previously independently reviewed first shift bin [0,1/24], which includes zero. The core is nevertheless calculated exactly at a=0. Consequently this decomposition/result cannot be advertised as uniform over that bin or over all a.

The congruence divides odd channels 1,3,5 by [1,200,80000]. These Schur complements are in that fixed scaling, not eigenvalue lower bounds.

Verified intervals (outward rounded here):
- Core Schur S_c in [-0.000066190602809, -0.000066190602613].
- Tail Schur S_t in [0.127139889406, 0.132002362673].
- Actual covariance gain in [0.000596788064246, 0.000646729212246].
- Gain plus S_c >0.000530597461437.
- Core deficit/(tail reserve+gain) <0.000518181.
- Full Schur S >0.127714233553.

The gain alone exceeds the core deficit by more than a factor of nine. This is genuine repair of a negative *integrated* core by changing projection coefficients when merging actual core and tail; it is stronger as a mechanistic example than merely observing a negative pointwise slice. It is not needed to re-prove the already reviewed all-shift H5 theorem and supplies no order-uniform estimate.

## Tails, quadrature and dependencies

The reused integrated_h5_v1/certify.py complete profile routine encloses all n>=11 terms and derivatives through 14. The fourth-derivative weight bound used by Simpson is uniform over 0<=a<=1/2 and so valid for zero shift. Dyadic core endpoints/midpoints are exact. Each cell's Simpson error is bounded by sup|f''''| d^5/2880. The base certificate includes its spatial infinity remainder; subtracting the independently enclosed core from that full integral encloses the actual tail despite interval dependency. Interval operations may overestimate but cannot invalidate the signs.

Dependencies: integrated_h5_v1/certify.py SHA256 6c996272d3facfbe06f6136b37ebc8008665e41060f0947ef1edee68f0519d15; certificate.json SHA256 ad3dfbd3951d9527a8e42ff27345ccefcfee9c7475324f05d1cfcc260312befa. These were audited previously. No acquired code was executed.
