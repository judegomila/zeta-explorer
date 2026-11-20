# Independent audit: X16 targeted loss and weighted signed far majorant

> Curated source/review. Mathematical formulas and proof order are retained. Operational reviewer identifiers and private executor paths were removed; the manifest records original and published hashes. Historical receipt locations refer to the original audit layout. Current accepted scope is stated in the app module; internal review is not external peer review.

29 October 2026. **PASS in the precise scopes below.** Original failed full-head surrogate and the actual 8193-dimensional compression theorem remain unchanged. This audit does not certify the repaired complete head matrix or the actual full operator at lambda=4.

## Results

Independent exact-input, outward-Arb replays confirm:

* The historical N128 proposal is not the failed-surrogate witness: its original surrogate value is positive.
* The separately frozen 2049-coordinate rational vector has actual Rayleigh `+1.848548689162235e-74`, but original lower-surrogate value `-1.313930878124952e-75`.
* Doubling J to 16384, including all added actual coupling rows and recomputing all far inputs, leaves the original separated majorant negative on that vector: `-3.983110258814881e-76`.
* Signed mean cross retention with a constant far inverse floor remains negative at both J values; at J=16384 its value is `-7.482962546919821e-77`.
* The specified single 48-band nonincreasing inverse-weight profile, signed mean cross term and fixed sigma=1/8 give far upper charge `3.472495168681191227040222511644477e-76` and **positive lower-surrogate value `6.898438502638110453117504402106913e-78` on the same exact vector**.

All mathematical and metadata fields of the final signed/weighted/geometry replay receipts equal the producer's, excluding elapsed seconds. The separate direct core-witness replay also matches excluding seconds. No approximate inverse-action accuracy is assumed: discovery coordinates become exact decimal rationals and their forms are freshly evaluated.

## Analytic all-head majorant

Fix N=2048, J=16384, L=36 and the already audited full N-tail comparison D_N >= diag(d_j)>0, where

`d_j = Re psi(5/4+i*pi*j/W)-log(pi)-Gamma_ref(W)-Pschur-H_K(W)/N`.

The derivative of Re psi(a+it) is the positive convergent sum
`sum_{n>=0} 2t(n+a)/((n+a)^2+t^2)^2`; hence d_j increases for every future j. There are 48 consecutive finite integer bands from J to 64J (eight equal subdivisions of each of six dyadic octaves). On a<j<=b use w_j=1/d_(a+1), and after 64J use 1/d_(64J+1). These weights are positive, nonincreasing, and >=1/d_j. They are a valid enlargement of the diagonal-inverse upper bound, not an equality for the true inverse.

For the even coupling expansion put
`f_j=sum A_l J^(2l)/j^(2l+1)` and
`g_j=sum C_l J^(2l+1)/j^(2l+2)`.
The principal row is sqrt(2)(-1)^j(b_j f_j-g_j), with the previously certified geometric remainder. Write b_j=beta_j+e_j, |e_j|<=1.3/j. First weighted Young at eps_b splits off the beta-error. The beta phase mean is 1/4 and beta-squared mean is m. Thus the mean principal square is
`m|f|^2+|g|^2-(1/2)Re(f conjugate(g))`
`=(m-1/16)|f|^2+|g-f/4|^2`.
This proves its PSD nature, including complex head vectors.

The weighted moments are evaluated as finite Hurwitz-zeta differences plus the final infinite plateau. Scaling J^(p-2) gives precisely HA, HC and HX. In particular HC has the extra J^2 and HX the extra J compared with HA. The beta-error matrix is HC/J^2.

For each nonconstant phase the geometric partial sums are bounded by 2/|1-exp(i theta)|. Since w_j/j^p decreases to zero, Abel summation gives the entire oscillatory tail bound using only its first value. It does not charge every band separately. The AA and mixed coefficient errors consequently have operator norms bounded by
`delta_A=L Cosc w_first/(J+1)^2`,
`delta_X=L Clin w_first/(J+1)^2`.
The mixed term is bounded by `2 delta_X ||A||||C||`, then by the quadratic form `delta_X(sigma||A||^2+sigma^-1||C||^2)` with fixed sigma=1/8. This is a uniform all-head inequality, not a parameter chosen from the witness.

The source's exact block matrix is therefore a valid coefficient majorant: its off-diagonal block is `-(1+eps_b)(1+eps)HX/2`; its beta-error is `2(1+1/eps_b)(1+eps)1.3^2 HC/J^2`; its diagonal oscillation allowances are as stated in the proof. **The moment matrices already contain inverse weights, so there is no second division by d_first.** Only the geometric remainder retains the safe first-floor inverse factor. The complete bound is the N<j<=J diagonal-inverse charge plus the far coefficient form plus the isotropic remainder. It is not an additive splitting of D_N^{-1} itself.

All entries are evaluated outward directly with Arb (including high-order Hurwitz zeta). There is no midpoint substitution, entrywise-upper-endpoint PSD inference, or unverified floating Hankel input. The outward LDL factor recursion encloses the factor of the specified exact H; all 72 coefficient pivots are positive. The residual H-FF* interval check is an additional consistency test, not the sole justification of factor containment.

## Attribution and limitations

The original 83.7161% AA-mean, 8.82623% AA-oscillation, and 7.45766% CC shares describe parts of an analytic upper estimate, not separate physical gamma/prime energies. The signed mixed scalar is negative on this witness, so retaining its minus sign increases the mean charge; the improvement is removal of the larger worst-case Young separation, not presumed favorable cancellation. The finite-vector geometry receipt is also independently reproduced: distance approximately 0.00011396144 from the old N128 vector, with squared mass above index 128 approximately 2.58706e-75. Neither is an actual eigenvector assertion.

A positive coefficient H is not positivity of C-P*HP. Repair of one witness does not imply repair of every direction, and no Loewner domination of the old majorant by the new one is asserted. Negative earlier lower-surrogate values do not prove actual negativity. The actual even full-support positivity range remains lambda<=sqrt(12) until a new complete certificate and independent replay pass.

A separately authorized one-shot full modified-majorant test must still pass its own source-delta/small-dense gate and, if successful, an independent full replay. It is not covered by this receipt.

## Evidence

Companion JSON pins the final producer proof, exact vectors, scripts, receipts, immutable numerical helpers, both copied replay workspaces and the earlier analytic/full-failure audits. The 174MB midpoint triangular discovery file is not a trusted mathematical input and is not required to reproduce the accepted scalar signs. Frozen V5 and the previous local addendum snapshots were not edited.
