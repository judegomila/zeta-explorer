# Full positive-shift degree-nine positivity, with a compact cutoff rectangle

This finite theorem fills the remaining compact shift interval through degree nine. It is not an all-degree result or RH proof.

The direct interval certificate proves both signed five-channel blocks positive simultaneously for
                 0<=a<=1/2, 0<=H<=1/8.             (1)
At the untruncated cutoff H=0, the previously established outer-strip argument supplies positivity for every a>=1/2. Consequently the full original ten-channel degree-at-most9 matrix is positive for every a>0, with its normalized a=0 endpoint also certified. The large-a conclusion is only asserted at H=0; no outer-strip argument is applied to spatially truncated tails.

## 1. Exact matrices and retained signed structure

Use the same a=0-continuous moment normalization as POSITIVE_SHIFT_CUTOFF_RECTANGLE.md:
 m_j(a,H)=2 integral_H^infinity u² sinhc(2au) psi(u)² g_j(u)du,
 B_epsilon(a,H)=[m_(i+j+epsilon)(a,H)]_(i,j=0..4),
 epsilon=0,1.
The even block represents0,2,4,6,8 and the odd block1,3,5,7,9. This normalization divides out the vanishing bridge factor at a=0; it is not unit-mass normalization by C_a(0).

Both fixed upper-triangular rational bases P are exactly those retained in shift_rational_basis.json. The owned floating Cholesky only selected candidate decimal rationals. The new proof directly interval-evaluates the actual transformed signed matrices P^TBP; no accuracy or orthogonality of that candidate-generation step is an assumption.

The normalized kernel is even in its translation variable for every a, so mixed-parity polynomial entries vanish. Therefore positivity of both blocks is exactly the finite full degree-at-most9 conclusion. This does not use the distinct auxiliary positive-parent Gram, whose physical cross-parity entries need not vanish.

## 2. Direct shift slabs rather than the coarse a² perturbation debit

Split[0,1/2] into16 closed slabs
 I_s=[s/32,(s+1)/32], s=0,...,15.
For each slab the same calculation encloses EVERY shift in that interval, not only its endpoints or midpoint.

Let sigma_ij(u) be an entry of the rational-basis transformed a=0 local signed matrix, and w(a,u)=sinhc(2au). Positive Taylor coefficients show w is nondecreasing in a and u for nonnegative arguments. At a spatial midpoint u_mid, therefore,
 w(a,u_mid) in[w(a_lo,u_mid),w(a_hi,u_mid)].
The function at zero is evaluated by its exact limit1, avoiding a0/0 division.

For an entire spatial cell with upper endpoint U, put x=2a_hi U. The integral representation w=integral_0^1 cosh(2aut)dt gives the rigorous bounds
 0<w<=v0=cosh(x),
 0<=partial_u w<=v1=a_hi sinh(x),
 0<=partial_u² w<=v2=(4a_hi²/3)cosh(x).
Hence throughout the slab and spatial cell,
 |partial_u²(w sigma)|
 <=v0|sigma''|+2v1|sigma'|+v2|sigma|.               (2)
The full-theta interval routine encloses sigma,sigma',sigma'' first, with the exact signed basis combinations retained. The right side of(2) then supplies the complete midpoint remainder. No derivative in a is needed because the parameter interval itself is enclosed.

For each slab,4000 cells integrate its starting tail matrix over[1/8,2]. Each entry is midpoint width times the signed transformed source times the full midpoint shift interval, plus the symmetric error width³ sup(2)/24. All dependency losses are outward enclosures. Entry symmetry is retained explicitly.

## 3. Complete infinite tails and continuous spatial cutoff

The theta routine includes all orbits using the reviewed log-derivative20 enclosure. Since the highest moment is9, second spatial derivatives need log jets only through20. No finite theta truncation is substituted for the full profile.

For u>=2 and0<=a<=1/2,
 sinhc(2au)<=exp(2au)<=exp(u)=sqrt(z/pi), z=pi exp2u.
Combining this with the preceding complete moment envelopes bounds each omitted full-line moment tail by
 T_j=(256/pi)(2j)!9^j Z^(j+5)exp(-2Z),
 Z=pi exp4, j=0,...,9.                             (3)
Indeed the new factor exp(u) raises the earlier exponent by1/2 and changes its prefactor from256/sqrt(pi) to256/pi. The logarithmic derivative of z^(j+5)exp(-2z) is below-1 here, since2-14/Z>1. Each transformed entry receives the full symmetric tail radius sum_k |coefficient_k|T_k. Formula(3) is uniform over every shift slab.

Starting from those rigorously computed H=1/8 matrices, another4000 cells propagate inward to H=0. At each cell, the actual local signed matrix entry w(a,u)sigma_ij(u) is enclosed over both variables. Every partial-cell increment lies between
 width min(0,lower(local entry)) and
 width max(0,upper(local entry)).
Adding these entrywise hulls to the current integrated matrix encloses every cutoff in the cell. The endpoints are advanced by the sharper midpoint update with the same derivative remainder(2). No local matrix positivity or cutoff monotonicity is assumed.

An interval5x5 LDL factorization is applied to EVERY resulting whole-cell matrix for EVERY shift slab. All pivots are strictly positive. This checks the actual old inverse and target Schur feedback together; it does not infer a new target from old conditioning alone.

## 4. Quantitative compact-range result

The owned16-slab,4000-tail-cell,4000-cutoff-cell run reports no failed slabs in either parity. Conservative common lower bounds for the five actual LDL pivots in the fixed rational bases are:

Even block:
 (.99999957, .99999955, .99999780, .99990807, .99431382).
Odd block:
 (.99999959, .99999928, .99998940, .99924763, .95580603).

These are LDL pivots, NOT eigenvalue lower bounds. Their strict positivity establishes the full matrix signs. The final pivot is the Schur remainder in the last rational-basis polynomial. Because P is upper triangular with leading coefficient P_44, division by P_44² gives the original monic target Schur reserve. Uniformly on(1), the stronger retained directed calculations imply
 even8 monic Schur >658,509,314,218;
 odd9 monic Schur >82,637,820,677,424.              (4)
All reserves refer to the displayed m_j normalization, without division by total mass. They are uniform only on the compact a/H rectangle(1).

The checker catches failed interval LDL tests as INCONCLUSIVE, not as negative matrices. In the accepted run the failed-slab lists are empty. No sample interpolation or assumed sign fills a gap between slabs or cells.

## 5. Global outer shifts: separate standard argument

For H=0, the original bridge Fourier identity is
 C_hat_a(2t)=W_a(t),
 W_a(t)=|Xi(t+ia)|²[-Im(Xi'/Xi)(t+ia)].
The standard zero strip gives |Im rho|<1/2 for every zero rho=gamma+i delta of Xi. Evenness and order one yield its paired Hadamard product with no linear exponential factor. Taking the imaginary part of the logarithmic derivative gives
 -Im(Xi'/Xi)(t+ia)
 =sum_rho (a-delta)/[(t-gamma)²+(a-delta)²]>0
 for every a>=1/2.
The imaginary-part series is absolutely convergent because delta is bounded and sum |rho|^-2 converges. Xi is nonzero there. Thus W_a is strictly positive for every real t. Its finite moments exist, and every nonzero polynomial has a strictly positive moment quadratic form. This supplies every finite global Gram matrix at these outer shifts, independently of the numerical compact-range proof.

This is the same previously accepted argument recorded in source_2354_audit/H6_AUDIT.md, source_0145_audit/EVEN_A4_AUDIT.md, and their retained proof dependencies; it is not a new RH assumption. The owned compact calculation now joins it at a=1/2 with no uncovered interval. Multiplying back by the positive original bridge normalization preserves the sign for a>0.

The Fourier identity in this paragraph is for H=0. Spatially cutting the h integral does not preserve its expression as the Xi logarithmic derivative. Therefore the argument does NOT extend the H>0 cutoff rectangle to arbitrarily large a.

## 6. What is newly covered relative to the named earlier audits

The named earlier sources certified full H6 for all positive shifts and the even0,2,4,6,8 block for all positive shifts. They explicitly left the odd block through7 and hence full H7/H8 unproved. Separately, the odd-through19 certificate covered normalized a=0 only.

The present direct compact-shift certificate supplies the odd1,3,5,7,9 block continuously on0<=a<=1/2. Joining the standard outer region therefore extends the named full all-positive-shift coverage through H9 (and its lower principal blocks). It does not extend the previously known normalized odd maximum degree19.

Precisely:
- H=0: full degree<=9 positivity for EVERY a>0, plus its normalized a=0 endpoint;
- 0<=H<=1/8: full degree<=9 positivity for0<=a<=1/2;
- no claim for arbitrary H, for larger degree, or for uniform control as degree tends to infinity.

This is a finite computer-assisted result with explicit continuum enclosures and complete tails. It does not prove the all-order moment hierarchy, positive definiteness at arbitrary configurations, or RH.
