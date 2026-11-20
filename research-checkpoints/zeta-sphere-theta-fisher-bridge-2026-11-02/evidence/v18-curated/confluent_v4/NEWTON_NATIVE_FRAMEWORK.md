# Collision-stable Newton/confluent Grams and the genuine all-order obstruction

2 November 2026. Scoped theorem for bounded-cardinality clusters; no assumption that the full kernel is globally positive definite.

## 1. Remove artificial coordinate conditioning

For a smooth stationary kernel K and distinct real nodes x_0,...,x_(J−1), let G_K=[K(x_i−x_j)]. Near collisions, its smallest eigenvalue can vanish merely because evaluation vectors coalesce. Dividing an entrywise tail bound by that eigenvalue can be an artificial obstruction.

Use the invertible real Newton transform

    (Tf)_i=alpha_i i! [x_0,...,x_i]f, alpha_i>0.

Then B_K=T G_K T^* is exactly congruent. Hermite–Genocchi's simplex formula gives

    (B_K)_ij=alpha_i alpha_j E[(-1)^j K^(i+j)(X_i−Y_j)],     (1)

where X_i,Y_j are independent uniform-simplex convex combinations of their prefix nodes. The factorials normalize simplex measure to probability. This identity is used directly, not computed by subtracting rounded near-equal values.

For nodes in a cluster of diameter delta, |X_i−Y_j|<=delta, independently of their minimum separation. The collision limit is

    (H_K)_ij=alpha_i alpha_j(-1)^j K^(i+j)(0).              (2)

Repeated-node forms are Hermite/confluent limits. The original repeated-evaluation matrices can be singular, but Loewner inequalities pass to them by continuity.

## 2. A uniform finite-cardinality relative theorem

Let K=D+E be real even C^(2J−1) kernels. Suppose H>0 is a confluent reference and, uniformly over all allowed node clusters,

    ||B_D−H||<=eta<lambda_min(H),  ||B_E||<=epsilon.

Then B_D>0 and

    ||B_D^(−1/2)B_E B_D^(−1/2)||
       <=epsilon/[lambda_min(H)−eta].                    (3)

If this is q<1, exact congruence gives E_Gram>=−qD_Gram for the original evaluations, independent of node separation. The same Loewner bound holds at repeated nodes by continuity, and smaller cardinalities follow by principal restriction.

Practical bounds follow directly from (1):

    |(B_E)_ij|<=alpha_i alpha_j sup_|v|<=delta|E^(i+j)(v)|. (4)

When the additional derivatives exist (through order 2J for the highest even jet), use evenness to improve reference variation: for even k,
|K^(k)(v)−K^(k)(0)|<=v²sup|K^(k+2)|/2;
for odd k, K^(k)(0)=0 and |K^(k)(v)|<=|v|sup|K^(k+1)|.

The weighted majorant matrix can be bounded by maximum row sum, rather than by J times the largest unscaled derivative. Whitening by H gives the valid further bound

||H^(−1/2)B_E H^(−1/2)|| <= || |H^(−1/2)|M|H^(−1/2)| ||

when M bounds entries of B_E. This retains the finite feature geometry. Congruence never creates positivity; it improves quantitative conditioning only.

## 3. Native feature-space interpretation

If E has integrable Fourier transform e(k), its quadratic form is

(1/2pi)integral e(k)|sum c_j exp(ikx_j)|²dk.

Normalized Newton features satisfy

|alpha_i i![x_0,...,x_i]exp(ikx)|<=alpha_i|k|^i.

Hence a nonnegative envelope b(k)>=|e(k)| gives the separation-independent majorant

M_ij=(alpha_i alpha_j/2pi)integral |k|^(i+j)b(k)dk,
|c^*B_Ec|<=|c|^T M|c|.                                    (5)

One computable choice is b(k)=min(||E||_1,||E^(r)||_1/|k|^r), with r large enough for the needed moments. The corrected Ewald tail admits bounds at every fixed finite order. Its holomorphic-strip bound supplies the derivative estimates used in the concrete certificate.

This is a finite native-feature norm. It is NOT a uniform contraction on the infinite-dimensional native space. Global stationary Loewner domination is pointwise spectral domination; see the complementary hierarchy/localization_v6 lane. Signed costs require the correct signed Schur range conditions, not automatic nullspace annihilation.

## 4. All cardinalities already encode the global sign

**Theorem.** Let K be a real even Schwartz kernel with signed spectral measure dmu(k)=hat K(k)dk/(2pi) satisfying integral exp(delta|k|)d|mu|(k)<infinity for some delta>0. Then positivity of EVERY finite confluent matrix [(-1)^j K^(i+j)(0)] is equivalent to global positive definiteness of K.

Proof: diagonal phase congruence converts these forms to integral|p(k)|²dmu>=0 for every polynomial. Polynomials are dense in L²(|mu|). Indeed an orthogonal f gives dnu=f d|mu| with an exponential moment of radius delta/2 by Cauchy–Schwarz. Its Fourier transform is analytic in that strip with every derivative at zero vanishing; the identity theorem and uniqueness of Fourier transforms of finite measures force nu=0 and f=0. Approximate indicators in L²(|mu|) by polynomials; squared moduli converge in L1(|mu|), forcing mu of every measurable set to be nonnegative. The converse is immediate.

The exponential hypothesis holds for the actual complete theta C_a and corrected Ewald D_(a,N), by holomorphic-strip extension and integrable horizontal-line bounds (on any smaller strip than |Imv|<pi/4). Gamma decay of the complete shear supplies an alternative verification. No RH assumption is involved.

Thus an all-cardinality confluent closure for every required shift would solve the original universal sign problem. Normalization removes artificial collision conditioning, not this all-order arithmetic obligation.

## 5. Smooth endpoint matching is insufficient

Do not weaken the analytic/exponential hypothesis to mere C-infinity. Add to exp(−v²) a smooth even bump supported away from zero, large enough that K(v0)>K(0). Every origin jet and every confluent jet matrix stays unchanged, while the necessary PD inequality |K(v)|<=K(0) fails. This is why finite or even infinite smooth jet matching alone cannot supply the global conclusion.

## 6. Domain growth and scope

For nodes spread across a large domain, a block-Hermite/reference-grid Gram must control derivatives at every inter-cluster difference. Its small eigenvalues need not be coordinate artifacts. As J grows, higher moments and derivative orders are required, and the confluent margin may deteriorate. No uniform-in-J margin or native-space contraction is asserted.

The companion certificate covers a continuum of at most three-node configurations in a small cluster, including arbitrary coalescence, with an exact arithmetic relative tail. It must not be extrapolated to all finite tests.

## 7. Quantifying the artificial collision loss

For a fixed distinct shape u_0,...,u_(J−1), take nodes x_j=x_*+delta u_j and assume the unscaled limiting confluent matrix H0=[(-1)^jK^(i+j)(0)] is positive definite. Newton congruence gives

    lambda_min(G_K)=Theta(delta^(2J−2))

as delta→0, with constants depending on the fixed shape and H0. Indeed the inverse Newton transform has smallest singular value comparable to delta^(J−1), while its transformed Gram tends to a positive definite limit. More explicitly,

    det G_K ~ delta^(J(J−1))
       [product_(i<j)(u_j−u_i)^2]/[product_(i=0)^(J−1)(i!)²]
       * det H0.

Thus the raw estimate J*epsilon/lambda_min(G_K) can deteriorate like delta^(−2J+2), even when the derivative-feature relative error stays bounded. This quantifies the coordinate defect that the present construction removes. The constants are not uniform as the shape itself degenerates or J increases; those require the confluent and all-order analyses above.
