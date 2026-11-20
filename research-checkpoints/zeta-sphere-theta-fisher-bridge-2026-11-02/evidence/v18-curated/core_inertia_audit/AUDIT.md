# Degree-19 core negative subspace and necessary tail reserve: independent audit

2 November 2026. PASS after independent replay. Scope is the complete-theta normalized a=0 core [0,1/16], odd polynomial channels through degree 19. No full integrated negative direction or RH counterexample is asserted.

## Validated quadrature

The integer polynomial recurrence for psi derivatives is exact: pulling out 4 exp(h/2)2^-k gives Q_(k+1)=(1-4z)Q_k+4zQ'_k. The n>=17 absolute derivative tail has polynomial degree k+2 and a geometric ratio below 1/2 for every k<=58 and z>=3. The given loose estimate (18/17)^120 exp(-105)<1/2 suffices. The factor 8 in the tail includes the geometric factor two.

The product derivative coefficients are those of (1-t)^(2n)(1+t)^j. Their reversal symmetry for even 2n justifies combining paired psi derivatives even when j is odd. Leibniz weight coefficients 2h²,4h,4 and the symmetric-cell Taylor integrals delta^(j+1)/(2^j(j+1)!) are correct. All cell centers and widths are exact dyadics.

For the Cauchy remainder, complex h-disks of radius 1/20 and v-disks of radius 3/10 give |Im(h±v)|<=7/20 and real part in [-7/20,33/80]. The bounds Re(pi exp(2u))>1 and |pi exp(2u)|<10 hold. Thus the full complex theta series is bounded by 2760<3000, using the explicitly summed n^4 exp(-n²) majorant below two. With |2h²|<.026, the stated M_n=1e6 (2n)! (10/3)^(2n) safely dominates the v-Cauchy derivative bound. The h-Taylor coefficient bound and q=5/512 give total remainder (1/16)M_n q^21/(1-q). This covers every cell and every omitted theta term, not a sampled quadrature check.

Independently replayed the campaign-authored checker using the fixed exact rational witnesses.json, with no eigenvector-generation dependency. All three negative-Gram LDL pivots are positive. Floating exploration only selected candidates; the final verification is interval arithmetic of the actual full-theta Gram.

## Quantitative margin is checked separately from LDL

The LDL pivots alone are not eigenvalue bounds. Here the actual witness Gram is nearly diagonal. Using exact rational conversion of its printed intervals, with an extra 1e-60 padding at every endpoint, checked Gershgorin lower margins for its negative:
4.320093421753891, 0.0003767665166975141, 0.000004439009854678468 (rounded illustrations).
All exceed epsilon=4/1e6. Exact fractions and the padding are recorded in independent_reserve_check.json. Thus W*CW<=-epsilon I3 is justified by strict diagonal dominance, independently of the LDL assertion.

Also checked the original two-channel core lower block directly from moments: A00>0 and determinant >2.083963435587. Completing the square yields Z*ScZ<=W*CW<=-epsilon I3, so Z has rank three in these fixed rational witness coordinates.

## Necessary tail repair cost

For any actual tail with At positive definite, binary covariance has form (Rc-Rt)*(Ac:At)(Rc-Rt). Restricted to Z it has rank at most two. Every unit vector q in the kernel of (Rc-Rt)Z therefore receives no covariance repair and has core deficit at least epsilon. Positive semidefiniteness of the full Schur complement necessarily requires q*Z*StZq>=epsilon (strict for strict positivity).

The kernel exists by dimension. The cross-product construction is an exact algebraic construction from the actual two rows when independent; no numerical approximation to the actual tail kernel vector has been certified here. This is a necessary cost, not a claimed violation: the actual tail may pay it. It does not bound continuum or multi-region covariance by rank two, and it does not establish unbounded negative index as degree grows.
