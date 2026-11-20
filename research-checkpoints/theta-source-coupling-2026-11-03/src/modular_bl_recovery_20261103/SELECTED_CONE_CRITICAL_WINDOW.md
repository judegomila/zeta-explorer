# The selected Gaussian cone has a strictly positive critical window

Status: independent analytic audit PASS. This is an obstruction to cone-only continuation, not to positivity of the signed form.

Fix the actual selected monic even residual q of degree 2m≥2, under the positive full old-prefix assumptions of SELECTED_EVEN_GAUSSIAN_WINDOW. Define f_s as the inverse Fourier transform of (−1)^m q(t)e^(−st²/2). The audited root/heat argument proves f_s>0 for all sufficiently large s.

If f_s≥0 for some s>0, then for every d>0,

 f_(s+d)=G_d*f_s>0,

where G_d is the strictly positive Gaussian heat kernel. Conversely, after setting u=√s x and normalizing by the positive factor e^(−x²/2)s^(−m), the inverse polynomial converges locally uniformly as s↓0 to the nonconstant Hermite polynomial He_(2m)(x). That polynomial has real simple zeros and changes sign. Therefore f_s changes sign for all sufficiently small s>0.

The set {s>0:f_s≥0 everywhere} is closed by pointwise continuity in s, is upward closed by the heat semigroup, is nonempty by the explicit old-Jacobi bound, and avoids some interval (0,ε). It is exactly a ray [s*,∞) with 0<s*<∞. For q₂(t)=t²−β, f_s is a positive Gaussian times β−1/s+u²/s², so s*=1/β exactly.

Thus the positive-inverse cone certificate necessarily fails before the unwindowed limit for every selected even degree ≥2. This does not say that ∫λq²e^(−st²) becomes negative: the Gaussian source has positive signed form at all s even below the cone threshold. Any window removal must leave the pointwise-positive inverse cone and pay signed cross terms or use additional theta arithmetic.
