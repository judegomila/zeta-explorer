# Common metric, canonical source, and mixed-gap audit

Analytic PASS, 2026-11-03. All finite numerical probes are diagnostics, not certificates. Requested one terminology clarification: the translation/shear family is strongly continuous with each operator bounded; it is not uniformly bounded over all real translations. v25 remains unchanged.

## Common actual-prefix metric

Differentiating L=c^T B^-1c-c_V^T A^-1c_V and subtracting f=(c_V'-A'alpha)^T A'^-1(c_V'-A'alpha) cancels the alpha terms exactly. Completing the remaining x-square gives displayed(1). The actual normalized same-parity halfline derivative blocks are I/2 because the raw signed normalized block is twice the halfline derivative. Expanding the two Euclidean square completions verifies(2)-(3), including every factor2. No definiteness of mixed H or sign of the last square is dropped.

For the bilinear H(f,g)=2 integral h²fg+integral h(K_f g+fK_g), the symbol identity K_(Dg)=g+D K_g and integration by parts give H(f,Dg)+H(Df,g)=-[2 integral hfg+integral(K_f g+fK_g)]=-R(f,g). The h and h² factors remove the origin boundaries. The degree recurrence uses only b_i=sqrt(sigma_(i+1)/sigma_i),i<N. Diagonal recurrence telescopes to H_i,i+1=-sum_(k<=i)R_kk/(2b_i). Off-diagonal odd anti-diagonals can then be generated from their central adjacent entry, moving outward via already-known lower anti-diagonals and positive prefix ratios. No unknown next ratio is used.

Since parity diagonal blocks equal I/2, mixed H is PSD iff ||2J||<=1, and adjacent entries require |sum R_kk|<=b_i. These are conditional necessary conditions, not established theta inequalities.

## Canonical next-source cancellation

The monic next polynomial is constructed by old-prefix orthogonality with no next norm sign. Its difference from DF_N is an old next-parity term with even-a coefficient. Thus the positive innovations and their gain L are unchanged at every applicable a; at0 the coefficient derivative vanishes, so the true feedback f is unchanged as well. Signed old orthogonality, plus equal-parity reflection, implies c_V'(0)=0. This is construction of the next residual, not an assumption that its signed norm is positive.

With A'=I/2, alpha'=-A^-1alpha/2 and f=||alpha||²/2. The derivative of the old positive projection term cancels it exactly, yielding L'-f=2y^T c_W'-gamma^T H gamma. Actual old-target inverse was used in the derivation; the remaining positive regression B^-1c still carries conditioning. The sufficient scalar comparison4y^T c_W'-2gamma^T Hgamma>=kappa0 M_N is not proved by this cancellation.

The accepted opposite-parity raw physical cross identity halves to R_ij=0 for opposite parity. It does not force J=0. Applying Green to q=sqrt(sigma_N)(DY_N+bY_(N-1)) gives c_j'/sqrt(sigma_N)=-(XH)_jN-R_jN+bH_j,N-1 for j<N. The top pairing gives-R_NN/2+bH_N,N-1=-trace(R)/2 by adjacent telescoping. For old-next parity these formulas cancel to0 using only current parity diagonal entries. All source pairings reduce to prefix data; no next norm is inserted.

## No uniform mixed gap, conditional on indefinite continuation of positive prefixes

On X=L²(R,(1+h²)dh)^2, translation with shear T(t)(f,k)=(f(.+t),k(.+t)+t f(.+t)) is a strongly continuous group, with finite bounded operator norm for each finite t. Its generator(Df,f+Dk) has A^j(phi,0)=(D^jphi,jD^(j-1)phi). Full theta strip analyticity and weighted square domination give a common positive analytic-vector radius; each fixed polynomial orbit vector has the same open radius, though constants depend on its degree. Taylor expansions put small translates in the closed real polynomial orbit. Boundedness for each fixed shift extends this to the closure, and finite iteration gives every finite real translate. This is simultaneous approximation of f and its SYMBOL derivative k, not arbitrary spatial replacement.

Both H[p] and H[p-reflected] are continuous quadratic forms on X, using Cauchy for integral hfk. For the limiting translated vector, substitution gives H_plus=2 integral_t^infinity v(v-t)phi(v)² and H_minus=2 integral_-t^infinity v(v+t)phi(v)². Evenness yields H_plus+H_minus=2m2 exactly, while H_plus>0 tends to0. No signed infinite theta-orbit sum is interchanged here.

Under the explicit all-degrees positive parity-prefix hypothesis, normalized coordinate parity blocks are I/2. Reflection changes only the mixed terms, hence ||z||²=H[p]+H[p-reflected] is the ACTUAL coefficient norm. Rayleigh quotient and polynomial approximation imply ||2J_N|| arbitrarily close to1 from below (or already above it). Nested actual bases make these norms nondecreasing. Thus liminf||2J_N||>=1, excluding a degree-independent positive mixed-metric gap. If positive prefixes fail first, that is a distinct alternative, not hidden by this conditional statement.

No explicit approximation degree N(t,eta) or rate in N is supplied. No failure of the correlated scalar payment criterion follows, because canonical source and regression terms are correlated with J. All-degree favorable paired remainder remains valid. This audit establishes the stated algebra and conditional obstruction only, not target positivity or RH.
