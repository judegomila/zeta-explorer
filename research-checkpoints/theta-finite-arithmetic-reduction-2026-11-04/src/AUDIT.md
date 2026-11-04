# Independent checks of the finite-arithmetic reduction

2026-11-04. The full reduction was independently audited and cross-checked against the originating derivation.

- The positive-half-line theta series is analytic on a fixed disk about every u≥0, including disks crossing slightly into Re u<0. Its tail is uniformly O(exp(−d M²e^(2u))). Polynomial prefactors are absorbed before Cauchy differentiation. Consequently k!r^(-k) is the complete derivative-order cost; constants do not silently depend on k.
- Reflection is applied separately to each derivative, using exact evenness of the original kernel. Values at u=0 are irrelevant to L² norms. No distributional derivative of the reflected finite sum is taken.
- The Fourier formulas are f=p(−iD)ψ, h=p'(−iD)ψ, and g=−2iu f−h. The explicit k in the derivative polynomial is required. The construction preserves conjugation symmetry and polynomial parity.
- Legendre coefficient bounds and the audited actual-source floor control coefficient sums before summing derivative remainders. The factorial cost is exp[O(N log N)], and M² proportional to N log N dominates it. This is uniform over the whole finite-dimensional polynomial space.
- Target H error uses a polynomial bound on H/X. Either the stronger arithmetic diagonal bound or the weaker elementary source/reference bound suffices; no assumed selected derivative decay enters the proof.
- Quadratic estimates imply source-relative spectral estimates because the forms are Hermitian. They imply positivity of X_M when the error is less than one, not positivity of X_M−H_M.
- The incomplete-gamma representation retains all ordered arithmetic pairs and source cross terms. Its entries are not asserted to be rational or algebraic. No certified numerical precision or bit-complexity result is claimed.
- The selected ratio comparison uses the actual source-relative reselection lemma, including its polynomial target-operator cost. The ratio error remains superexponentially small after that cost is absorbed by increasing the cutoff constant.
- This is absolute accuracy on the source scale. It is not relative accuracy on an arbitrarily small Schur defect, and it does not control a separate derivative minimum without its own argument.

Core inputs are the exact theta strip/series representation, the newly audited polynomial comparison in ../theta_polynomial_comparison_20261104, and the finite-dimensional perturbation lemmas in ../theta_polynomial_selected_obstruction_20261104. All old payloads remain unchanged.

The remaining work is an analytic signed estimate for the growing finite arithmetic model. The approximation theorem does not perform that step. No RH, selected coherence, or new defect positivity is asserted.
