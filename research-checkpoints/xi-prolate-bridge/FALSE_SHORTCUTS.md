# Rejected and insufficient shortcuts

This ledger prevents the direct project from repeating routes already tested.

## 1. One-crossing theta shells

For the exact sum/difference shell

\[
\mathcal H(p,x)=\int_{\mathbb R}
 \Psi\!\left(\frac{p+q}{2}\right)
 \Psi\!\left(\frac{p-q}{2}\right)\cos(xq)\,dq,
\]

the attractive conjecture that `p -> H(p,x)` crosses from negative to
positive at most once is false.  Independent floating-point quadratures show
multiple inner-shell sign changes near `x=18` and `x=20`; for example at
`x=20` the normalized sampled values have signs `-,+,-,+` at
`p=0.2,0.4,0.7,1.0`.  These are diagnostics, not interval certificates,
but two different quadrature schemes agree well beyond the displayed sign
margins.  The same phenomenon was independently observed at another scaling.

Thus shell-by-shell rearrangement and monotone-characteristic-function proofs
are not viable without a new, nonlocal modular grouping.

## 2. Vertical Xi energy

For real entire `X=Xi`, set `E=X+iX'`.  The identity

\[
|E(z)|^2-|E^\#(z)|^2
 =4\Im(X(z)\overline{X'(z)})
 =2\partial_y|X(x+iy)|^2
\]

gives a clean Hermite--Biehler formulation.  Proving strict positivity in the
upper half-plane is sufficient for RH, but the exact theta-shell expansion
has indefinite individual shells.  At present this criterion exposes RH; it
does not simplify its main oscillatory cancellation.

## 3. Generic fluid or Volterra positivity

Positivity, evenness, strong log-concavity, positive definiteness, and exact
heat evolution do not prevent a real-zero pair from colliding and leaving the
axis.  Explicit Gaussian/cosh and finite-measure counterfamilies exhibit this
behavior.  The positive Volterra medium is an exact coordinate system, not an
RH invariant by itself.

## 4. Total positivity and one Laguerre rung

The Riemann kernel is not `PF_infinity`, and the first Laguerre/Turán
inequality alone is insufficient for real-rootedness.  Eventual Jensen
hyperbolicity at fixed degree does not cover the unbounded-degree, zero-shift
region required by RH.

## 5. Operator pitfalls

- Self-adjoint finite matrices do not imply RH without locally uniform
  convergence of their characteristic functions.
- Strong-resolvent convergence alone permits spectral loss or pollution.
- Global positivity of the Weil form must not be assumed; it is an
  RH-equivalent statement.
- A construction using a spectral measure made from already-real zeta zeros
  is circular.
- Separately bounding the prime, pole, and archimedean residuals may destroy
  the cancellation the proof needs.
- After the zero-origin Rayleigh subtraction, the exact object is the single
  signed integral against
  `exp(x)-psi_C(exp(x))-(1/2)log(1-exp(-2x))`.  Replacing it by the sum of
  three absolute block bounds discards the proved cancellation, while
  treating its sign-indefinite normalized kernel as positive invents a sign.
- The Laplace transform of the complete normalized Chebyshev kernel is exact
  in a right half-plane, but continuing the finite Fourier weights to their
  natural line reaches `xi'/xi` on the critical line.  Its poles are the
  zeros under study, so a contour shift that assumes a uniform bound there is
  circular.  Integrating once more by parts is no substitute: it restores
  separately nonintegrable main and prime variations and destroys the
  Hilbert--Schmidt Hankel bound.
- The hard-endpoint Bernoulli/Vasyunin obstruction rules out the naive
  `H1`/bounded-variation proof for the physical outer tail, but it does not
  make the O--O pairing inaccessible.  The admitted replacement is the
  weighted translation theorem, whose endpoint estimate must retain the
  factor `A^epsilon`; deleting that phase factor is false.  Its cancellation
  occurs only after the exact source boundary shift and `A=lambda^2` are
  inserted.
- Conversely, the admitted limits
  `|W_Z(O,O)|/d_8 -> 0` and `q_lambda(p,p)=o(d_8)` are scalar quadratic-energy
  statements for an indefinite form.  They do not imply a bound on
  `(Q-q)kappa`, either parity floor, the shifted resolvent, equation (5.2), or
  locally uniform determinant convergence.  The five-dimensional exact
  model in `notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md` makes this logical gap
  sharp: every P/O scalar pairing and the total remainder quadratic value can
  vanish while the residual column and weighted action remain nonzero.
- Polarizing only among the already-controlled scalar remainder pieces does
  not recover their pairing against an arbitrary complementary test vector.
  The exact missing quantity is the graph dual
  `sup |W_Z(v,R)|/||Dv||`; a uniform bilinear/Bessel or absolute-sampling
  theorem on explicit source windows is one sufficient route to controlling
  it, not a consequence of the scalar identities.
- The earlier `||R||_Z^2=O(lambda^7*d_4)` bound and the sharper
  `||R||_Z^2=o(d_6)` hybrid theorem supply only the remainder factor in the
  graph-dual Cauchy--Schwarz argument.  Neither supplies uniform Bessel bounds
  for the growing complementary windows or the reciprocal defect sum, and
  therefore neither by itself bounds the shifted residual action.
- Modewise diagonal sample estimates do not imply a source Gram inequality.
  For `W=D=I_r` and `S=[1,...,1]`, every source column has sample norm one,
  while `W^*S^*SW` has top eigenvalue `r`.  Every coherent cross term must
  be retained in `Y^*Z^*ZY<=C_ext D_ext`.
- A source kernel is not an obstruction to positive-sampling descent, but it
  must not be inverted.  The valid quotient preconditioner is
  `(W D_ext^(-1)W^*)^dagger` restricted to `ran(W)`.  Its zero ambient
  eigenvalues are not physical floors.  This theorem removes the smallest
  singular value; it does not prove the required exterior Gram estimate or a
  signed sector comparison.
- Applying the compact-BV theorem to the entire physical vector does give an
  honest full-cross-term fallback, but not the needed scale.  The exact
  additive-even arithmetic estimate and all-index floor yield
  `C_ext<=B_abs*lambda^2/(2*d_LS)` and then
  `C_ext*||W D_ext^(-1/2)||^2<=B_abs*lambda^4/(4*d_LS^2)`.
  This pays two inverse Logvinenko--Sereda defects and is exponentially huge;
  it must not be relabeled as the relaxed
  `O(lambda^4*polylog(lambda)/d_8)` comparison (nor as the earlier stronger
  `O(1/d_8)` target).  Dropping one
  of the two defect factors, discarding Gram cross terms, adding an
  unneeded parity factor two, or ordinarily inverting `ker(D_ext)` is invalid.
- The earlier bound `epsilon_lambda=O(lambda^(-1)*d_8)` is, by itself, an
  even-scale statement, not an odd one.  Since
  `d_8/d_6~(32*pi^2/7)*lambda^4`, that argument gives only
  `epsilon_lambda/d_6=O(lambda^3)` and cannot be relabeled `o(d_6)`.  The
  later hybrid theorem reaches `o(d_6)` by a different complete-series
  argument.  Evenness alone never removes the scalar shift from the odd
  spectral comparison; the hybrid estimate controls it quantitatively by a
  separate argument.
- The zero-integral `0/4` normalization cancels the origin datum, not the hard
  endpoint.  In fact `(a_0*e_0)/(a_4*e_4)=O(lambda^(-4))`, so replacing
  `|a_0|=O(lambda)` by its qualitative bounded limit improves the absolute
  outer loss only to `O(lambda^5*d_4)=O(lambda*d_6)`.  This must not be
  promoted by itself to the `o(d_6)` shift estimate; the valid hybrid proof
  retains the complete sampled series before this endpoint split.
- Conversely, the hybrid conclusion `epsilon_lambda=o(d_6)` is an absolute
  sequence-norm and common normalization-free shift statement.  It does not
  imply `U_Z=epsilon_lambda/a^2=o(d_6)` *by itself*.  The separate
  projected-state norm theorem supplies the required lower control of `a`
  and now proves that normalized shift estimate.  Neither scalar result is
  an unshifted or shifted odd-sector floor, a positive odd Schur complement,
  a graph-dual residual-action bound, or equation (5.2).
  Replacing its blockwise minimum of two proved estimates by either branch
  alone also discards the mechanism that gives the odd-scale result.
- A shifted comparison on only the low compression `P_KBP_K` does not
  control `P_KB^(-1)c` when low/high couplings are present.  The complete
  operator must dominate, or be left-close to, the low/high quotient
  preconditioner with the cross couplings included.
- A quotient built from the diagonal block metrics is not the quotient of the
  full exterior Gram.  For `W=[1,1]`, `D_block=2I`, and
  `D_full=[[2,-1],[-1,2]]`, the two actions are respectively `1` and `4`.
  Any signed comparison must use the same explicitly chosen block metric all
  the way through.
- Fourier-high coercivity is not coercivity on the orthogonal complement of
  the physical low range.  With `Q=diag(1,-1,1)`, physical low
  `span(e1)`, and Fourier high `span(e3)`, both displayed compressions have
  floor `+1`, while the physical complement contains `e2` with form `-1`.
  A geometric or full signed comparison is required before transferring a
  floor between these decompositions.
- The pole cannot be assigned the same sign in the two parity sectors.  With
  the locked Fourier sign it is `2 epsilon |p_epsilon><p_epsilon|`: positive
  in the even sector and negative in the odd sector.  Dropping inversion
  reflection erases this source-critical distinction.
- Bounding every prime phase by its absolute amplitude in the exact
  multiplier gives only an `exp(O(lambda))` global phase-volume upper bound
  when the shift is linear.  It cannot be promoted to the desired polynomial
  dangerous-space bound.
- The fixed-`lambda` Haar law for the prime phases is an infinite-time
  identity, not a quantitative theorem on the finite orbit relevant to the
  archimedean cutoff.  Nor does the standard moment argument bridge the gap:
  its degree-`k` frequencies require time exceeding `(lambda^2)^k`, while a
  fixed polynomial time permits only bounded `k` and cannot yield the needed
  logarithmic-threshold saving.  The polynomial phase-volume target remains
  neither proved nor disproved.
- The admitted finite-compression theorem does not turn its
  `O(lambda^2)` dangerous-rank scale into physical capture.  Its explicit
  constants can exceed the ambient dimension; even a nonvacuous rank no
  larger than `dim K_low` gives only a dimension possibility, not a bound on
  `||Pi_dangerous P_(K_low^perp)||`.  It also uses `N` comparable to
  `lambda^2`; inserting the separate exponential projection schedule changes
  the scale.
- Measuring both parity sectors from the trial Rayleigh quotient `q` can
  discard the actual Ritz lowering `q-u`.  The old signed gap must still be
  reported, but the valid sector theorem uses the separate comparisons
  `alpha>u` and `omega>u`.
- Replacing `||(A-uI)^(-1)b||` immediately by `r/(alpha-u)` is valid as a
  fallback, but it discards the spectral location of the residual and can
  erase the weighted improvement.  It must not be presented as the only
  possible sector estimate.
- In a low/high split, replacing the complete Schur lower matrix
  `A-C^*C/g` by
  `(lambda_min(A)-||C||^2/g)I` can erase anisotropic cancellation.  The
  scalar expression is a valid sufficient fallback, but its failure is not
  failure of the matrix Schur criterion; the `(2,8)` pilot is an explicit
  diagnostic example where both scalar sector bounds are negative and both
  matrix lower models are positive.
- A fixed number of prolate low windows cannot be extrapolated through the
  transition range.  The `(2.25,12)` two-window `X=0` models fail while the
  source window grown through the Shannon index succeeds pointwise.  A proof
  must control a growing family, including its Gram conditioning and every
  coupling term.
- Non-collision of the differential prolate eigenvalues is not growing-window
  conditioning.  The proved same-parity bound is only
  `(16*r*pi/(225*K^2))*exp(-2*pi*K)` with `K=O(c)` in the transition range.
  Products of many such worst-case gaps can lose `exp(-O(c^3))`, so this
  theorem cannot be promoted to a polynomial Gram determinant, a physical
  singular-value bound, or a signed Weil-sector floor.
- Full rank of the growing additive source Gram does not imply full rank or
  uniform conditioning after the arithmetic transform, evenization, and
  Fourier projection.  Nor does the explicit trailing bound
  `chi_n^2<=1/2` provide a lower bound for the exponentially small leading
  defects; the leading KRD inequality has the opposite direction.  The
  continuous parity maps are now known to be qualitatively injective on the
  locked half-integer analytic source spaces, but qualitative injectivity and
  eventual fixed-`lambda` Fourier rank still do not supply a uniform smallest
  singular value or an explicit `N(lambda)`.
- A positive physical Gram determinant at each fixed `lambda` is not a
  conditioning theorem.  For a normalized `r`-dimensional Gram, the needed
  finite inequality is `det Rhat>=gamma*U^(r-1)` with
  `U>=||Rhat||`, or an equivalent normalized row-minor lower bound; bare
  nonvanishing may decay arbitrarily faster than the prolate defect scale.
- Convergence of an auxiliary CG or GMRES solve for `HX=C` cannot establish
  the missing Schur sign.  For every choice of the approximate map,
  `S_0=S-E^*(g^(-1)I-H^(-1))E<=S`; Krylov convergence only shrinks the
  negative correction.  Adaptive per-column residual estimates also do not
  imply a Loewner bound for the full cross-residual Gram `E^*E`.
- From `0<=X<=Y` one cannot in general conclude `||Xb||<=||Yb||`.  The
  resolvent-weighted proof is valid because `(A-mu I)^(-1)` and
  `(A-uI)^(-1)` are commuting scalar functions of the same Hermitian
  operator, so the squared-norm comparison follows from the spectral theorem.
- A high-precision inverse at one finite pair is not a certified resolvent
  bound.  Certification requires a rigorous Ritz upper bound `U`, complete
  lower bounds for both sector floors, strict positive shifted gaps, and an
  outward-rounded solve enclosure or residual correction.
- Small finite values of `tau` or `D(tau)` do not establish equation (5.2).
  The projection rate is now proved separately on fixed
  `N=C*ceil(lambda^2)` schedules, but the weighted resolvent bound still needs
  a proved rate on an explicit unbounded schedule.
- A fixed empirical multiplier in `N=C*ceil(lambda^2)` is not a Galerkin
  theorem.  The `lambda=2.75` point fails in the odd sector at `N=16` and
  passes at `N=24` and `N=32`, while the passing `tau` values are not monotone
  in `N`.  Four decreasing points on `N=3*ceil(lambda^2)` and their fitted
  exponent do not alter this: the bandwidth must follow from a relative
  analytic error bound.
- Generic boundary reserves based on `||delta||D(T)` or `||delta_K||T` are
  optional sufficient checks.  Failure of either does not invalidate the
  source commutator route, and passing a finite reserve does not replace the
  locally uniform determinant limit.
- Inversion commutation by itself does not imply the source boundary
  nonvanishing lemma.  That proof also needs the exact Cauchy off-diagonal
  form (5.2), hence the rank-two commutator (5.3), together with the shifted
  simple-even ground-state hypotheses.  An arbitrary centrosymmetric
  Hermitian matrix is insufficient.
- A higher-dimensional Ritz vector may be used only if it is reconstructed
  from source parameters and its distance from the prolate comparison state
  is controlled; importing a stored ground eigenvector would make the bridge
  diagnostic circular.
