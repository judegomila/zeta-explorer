# Spatial-tail propagation and all-shift H5 audit

2 November2026. Analytic and low-core replay PASS; final high-core interval replay outcome appended below. Separate from immutablev7.

## Exact matrix lemma

For Hermitian full-theta densityB(h), F(H)=integral_H^infinity B(h)dh, and r_a=sinh(2ah)/(2ah), entrywise integration by parts gives J(a)=F(0)+integral r_a'(H)F(H)dH. Boundary terms vanish at infinity because the actual density and tail decay faster than every fixed exponential; r_a(0)=1. If F(H)>=0 for everyH, this proves J(a)>=F0. Positive power-series coefficients also show r_b'-r_a'>=0 for b>=a>=0, yielding the asserted Loewner monotonicity. This is a conditional matrix-order statement, not an inference from entrywise positivity.

For the oddH5 density2h²[m_(j+k+1)], J(a) is exactly the sign-conjugated odd block of C_a/a. Normalizations and parity indices check.

## Low-core certificate, independently replayed

Using my independently replayed corrected integratedH5 first-bin enclosure of F0, tail_core_replay.py checked everyH in[0,1/8] through1024dyadic cells. Each prefix is an interval rectangle integral of the actual complete-theta density, and each partial cell uses[0,width] times its interval density. This covers signed entries and allH, not only endpoints. Symmetric-matrix intervalLDL is then a sufficient uniform positivity check.

PASS. Worst scaledpivot lower bounds:
1.341152862578103331620733531226471814505675275132813481715;
0.435142344594830323726562612485620072012338967040032631745;
0.102104929274533153676434104810101088043822375157306857051.
These are LDLpivots, not smallest eigenvalues. First-bin shift uncertainty is conservative and includesa0.

## Pointwise tail proof

Read h5_tail_v1/POINTWISE_TAIL_PROOF.md and its authored interval and analytic checks. Independently derived the moment mu5 and the odd3x3 determinant symbolically. The22-term polynomial and absolute-cost bound match: after removing the leading368640X9 term, substituting |Y|<=5X,|Z|<=17X,|W|<=90X,|V|<=300X andX>=127 gives total cost48710.6484014026<68640. Every nonleading degree is below9.

The exact first-summand geometric sums at3/64 were independently recomputed. The radius1/16Cauchy disk and fulltail estimates give derivatives oflog(1+r)through10 below1 forz>=32. The claimed X,Y,Z,W,V bounds and determinant>300000X9 then follow. Leading minors remain positive by the previous globally reviewed pointwiseH3 inequality. The rational boundpi>25/8 andexp(.25)>41/32 ensuresh>=1/8 impliesz>4.

The compact[4,32] checker uses the same audited first-term/logtail separation and midpoint mean-value scheme asH4, now throughderivative11. The omitted theta-tail ratio bound remains<1/2. No integration sign is assumed here. The separate independent5600cell replay must pass before accepting the complete tail claim.

## Consequence upon completion

Combining positive tail fibers forh>=1/8 with the validated low-Htail matrices gives F(H)>=0 for everyH. The matrix lemma then extends the oddH5 block from the compact-shift certificate to everya>0, with normalizeda0endpoint, and proves its normalized-shift Loewner monotonicity. Together withH4's even block this gives fullH5 positive definite for everya>0. Integration is essential because the originalpointwiseoddH5 block is indefinite nearh0. This is a finite-order advance, not an all-order orRH proof.

## Final outer replay outcome21:20UTC

PASS all5600cells. Independent h5_tail_replay.py completed in74.997seconds and reproduced minX lower19.75730766225646, determinant-minus10000X9 lower12569546420753165.17, anddet/X9 lower37268.9890687261433235446288179532056077886948749504180926756. Independently executed the campaign-authored symbolic identity checker as well; Bell mu5 and both determinant polynomial identities pass.

All components of the consequence above are now independently reviewed and replayed. Thus fullH5 positivity is established for everya>0, with the continuous normalizeda0case. The odd block ofC_a/a is additionally Loewner-monotone in a. This uses cumulative integrated tail positivity to overcome the actual negative pointwise core. It does not supply all-order tail positivity orRH.
