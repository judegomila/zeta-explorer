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
- Even dangerous rank strictly below the physical-range dimension, an
  isometric physical synthesis, and an exactly positive low compression do
  not imply capture.  The exact three-dimensional model in
  `notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md` has dangerous rank one below
  dimension two but capture angle squared `16/25`; a continuous family with
  the same low block reaches angle one.
- Exact dangerous-space capture plus positive low and high diagonal blocks
  does not remove the low--high cross.  The exact model with low block
  `diag(3,2)`, high block `11`, and cross squared norm `36` has full
  determinant `-6`.  The strict quotient-relative cross reserve is a separate
  hypothesis if one works with the raw form.  The valid successor in
  `notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md` first takes the Krein short of
  the positive part.  That absorbs its cross, after which positivity of the
  negative part gives an automatic cross estimate.  This does not prove the
  remaining signed shorted low floor or physical leverage reserve.
- Failure of the trace test `V_H<g` is not failure of the high inverse.
  `R_HH=diag(9/16,9/16)` at `g=1` has trace `9/8>1` but operator norm
  `9/16<1`.  Use the lower-one trimmed mean to optimize the trace route, or a
  higher-moment/norm bound when trace loses the high-rank factor.
- The lower-one trimmed mean is not the ordinary mean: its selector has both
  unit mass and the capacity constraint `0<=alpha<=1`.  Dropping the capacity
  or accepting `ell_H=c_-` destroys the stop-loss duality and strict odd-pole
  reserve.
- Full positive shorting is sufficient, not necessary.  The exact matrix
  `gI+C-R=[[8,9],[9,11]]` is positive with determinant seven for
  `g=2`, `C=[[9,9],[9,9]]`, and `R=diag(3,0)`, while `C_/K=0` makes the
  fully shorted low scalar `-1`.  Failure of the fully shorted test is not
  failure of the original matrix; retain an oriented/full Schur test or the
  valid positive interpolation when needed.
- Equal diagonal leverage data do not determine the negative round-trip
  load.  With the same `V_H=rho=1/4` and `R_KK=1`, aligned and orthogonal
  feature vectors give effective loads `4/3` and `1`.  Prime moments can
  certify the high inverse and its Neumann tail, but not the oriented first
  coefficients by themselves.
- Positive sampling cannot choose the sign of the paired Weil form or create
  a strict reserve.  The swap model has `S^*S=2` but `S^*JS=-2`, while the
  rank-one Gram from `S=[1,1]` reaches the gluing threshold at equality.
  Absolute sampling bounds may still be combined with additional sharp
  information, but they do not by themselves imply the signed low or cross
  inequalities.
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
- Full rank of every confluent breakpoint-jet matrix is not finite Fourier
  rank.  The exact arithmetic adjoint rows do have nonzero even and odd
  Vandermonde jet determinants, but the parity-preserving functions
  `h_j=(I-P_(N,s))q_j` retain an identity jump-jet matrix while
  `P_(N,s)h_j=0` for every column.  A proof still needs the actual matched
  prolate moment determinant or an equivalent fully source- and
  target-whitened volume bound.
- Choosing moment order `O(log(lambda))` does not by itself prove a
  high-space floor.  The sharp one-sided conversion also needs a
  cancellation-preserving scalar width of order `O(log(lambda))`; a chosen
  `lambda`-scale width at matched dimension forces order `Omega(lambda)`.
  A wide positive even pole can spoil the centered-moment lower bound at
  every order despite being harmless in Loewner order, so it should be
  removed before a sufficient generic even-sector moment estimate.
- From `B>=gI-R` one may compare the ordered eigenvalues and conclude
  `tr(gI-B)_+^r<=tr(R^r)`.  One may not promote this to the generally false
  noncommutative Loewner inequality `(gI-B)_+^r<=R^r`.
- A small ambient soft-defect moment is not available: the complete
  prime-minus-archimedean multiplier has a central `lambda`-scale defect
  direction in both parity sectors.  The physical leverage deficit or an
  equivalent source-capture theorem is essential.
- A small projection error for the single Xi comparison state is not a
  weighted-capture trace theorem.  The cap-free even target is the
  Hilbert--Schmidt distance
  `inf_Y||(I-WY)D_nu^(1/2)||_HS^2`; its central band requires
  control of every uncaptured target direction at total scale
  `O(log(lambda)/lambda)`.
- A factorial Taylor tail for the central-band evaluation vectors is not a
  physical capture theorem.  It reduces the target to the principal angle
  between the physical prolate range and a logarithmic-dimensional projected
  polynomial space; neither a sufficient column count nor full rank of a
  different map bounds that angle.  Equal-rank subspaces can have capture
  angles zero and one.
- Conversely, failure of the worst central principal angle is not failure of
  central capture.  The exact central loss weights each missed direction by
  its Fourier covariance eigenvalue.  A direction can have angle one and
  factorially small weight, so the honest target is the covariance-weighted
  cross-Gram trace, not an unweighted maximum angle.
- Excellent Legendre--Fourier conditioning inside the target projection is
  not arithmetic-prolate alignment.  It proves that the economical
  `O(L/log(L))` polynomial coordinates survive the centered-Fourier cutoff;
  it says nothing about their angle to the image of the prescribed source
  columns.
- A small tail for one selected arithmetic right inverse is not an intrinsic
  capture statement.  Adding any map into the transform kernel changes that
  raw source tail without changing the physical feature angle.  The
  invariant quantity is the minimum-tail quotient, equivalently the physical
  cross-Gram/least-squares angle.
- Perfect capture of the central band does not control the exterior part of
  the cap-free weighted defect.  The two positive compressed multiplier
  pieces add, and an arbitrarily large exterior defect may remain after the
  central trace is exactly zero.
- Decomposing the combined exterior defect into `O(log(lambda))` dyadic
  level operators does not reduce it to `O(log(lambda))` directions.  Each
  spectral layer may have large effective rank, and a rank excess over the
  physical range forces an uncaptured direction.
- An interval-union phase-volume and transition-trace bound controls only the
  effective spectral tail of an exterior level.  The exact `k`-width formula
  contains a separate top-eigenspace principal-angle term.  Two captured
  spaces can share all level-set and eigenvalue data while having angles zero
  and one, so effective rank cannot be promoted to physical alignment.
- The scale `O(log(lambda)/lambda)` for the squared feature angle, or
  `O(log(lambda)/lambda^3)` for its right-inverse source tail, is not by
  itself a strict odd or even pass.  The leading constant and starting
  threshold must fit the declared reserve.  In positive-excess spectral
  tests, `[0,sigma)` is the low window for the upper bound while
  `[0,sigma]` is mandatory in the converse; dropping the threshold
  eigenspace changes a singular boundary into a false pass.
- Scalar odd moments do not imply the required pole-direction resolvent
  bound.  The moment remainder has a sharp signed directional deficit; in
  the worst orientation every scalar moment can leave the load at its upper
  endpoint.  A physical edge deficit or equivalent alignment theorem is
  still required.
- The sharp first odd edge moment is an if-and-only-if test only for its own
  chord upper certificate, not for the true resolvent load.  Exact spectral
  measures with the same pole norm and first moment have loads `9/8` and
  `39/40`.  Likewise, the faster Chebyshev remainder is useful only after the
  actual signed directional moments and a positive shifted base are proved.
- Nonzero augmented prolate determinants at isolated finite inputs do not
  prove a matched coframe.  The quantitative target is the fully whitened
  adjoint-tail bound `Theta<1`; ordinary separate-sign Andreief arguments
  fail because the sparse raw prolate families are not Chebyshev systems.
- The Cauchy majorant `Theta=(2*lambda/s)||A||^2` is sufficient,
  not the exact coframe loss.  The exact operator is
  `A^*A+(A^*e)(A^*e)^*/s`.  Conversely, a finite fixture where
  this sharper norm is below one does not prove the actual growing prolate
  coframe.
- Capping the odd lower comparison removes large positive multiplier
  outliers, but it does not remove the negative pole.  The capped criterion
  still requires squared pole leakage `O(log(lambda)/lambda)` or a separate
  one-direction Schur reserve.
- The odd chord correction `chi_beta` cannot be silently dropped,
  and the inverse must be shifted by the desired floor.  Using
  `(c*L*I-R)^(-1)` only tests positivity; it does not certify a
  positive `beta*L` floor.  Every transverse block in the associated
  one-direction Schur complement must be shifted by that same floor; mixing
  a shifted pole direction with an unshifted transverse block changes the
  reserve.  Load exactly one is singular, the odd pole has the required
  negative sign, and neither a positive-pole substitution nor a nonpositive
  shifted Schur reserve is ever a pass.
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
- The source-normalized Mellin transform of the limiting comparison state is
  `Xi/4`, not `Xi`.  Replacing the scalar by one or unit-normalizing the
  finite state changes the limiting characteristic normalization and is
  rejected even though it leaves a zero set visually unchanged.
- An `O((log(lambda))^2)` projection cutoff for the distinguished Xi state is
  not a central capture theorem.  The constant Legendre direction retains
  fixed central-band energy while its overlap with that single normalized
  state is only `O(L^(-1/2))`; the actual source range must solve the
  covariance-weighted graph problem with a small high-mode spill.
- The hard-layer BV average is not the soft-symbol transition trace.  The
  exact soft identity has an additional gray-mass term, and translating a
  defect preserves its spectrum and variation while rotating its top
  eigenspace away from any fixed captured range.
- Solving the low-mode graph equation is not enough.  An ill-conditioned
  right inverse can have arbitrarily large high-mode spill; the weighted
  spill, not row rank or low interpolation alone, is the remaining central
  quantity.
- Adding the residual odd pole direction to the dangerous space does not
  weaken the sign condition.  Its scalar Schur complement is positive
  exactly when the original harmonic resolvent load is below one.  A pole-
  axis positive-excess expectation is necessary but not sufficient because
  the transverse Schur coupling remains.
- No fixed finite list of odd edge moments determines the load sign.  Exact
  positive measures can share every moment through any prescribed order and
  have loads on opposite sides of one; a proved remainder or edge-
  localization bound is indispensable.
- The positive constant at the center of the full-pole asymptotic is not an
  odd reserve.  The exact first Riesz mean is not `o(sqrt(X))`; under RH its
  normalized zero contribution is a nonconstant almost-periodic term, so
  replacing it by its center discards the decisive cancellation.
- Low graph solvability, column surplus, or a positive raw low coframe is not
  a central spill estimate.  The exact minimum is the covariance-weighted
  tangent trace; even a unit raw coframe can coexist with arbitrarily large
  shell spill.  The relevant source quantity is the relative ratio
  `epsilon/gamma`, not either factor alone.
- The phrase “complete exterior defect” cannot hide whether the sharp
  central cutoff is present.  The actual exterior summand contains
  `1_(|t|>delta/L)` and therefore has two reflected BV jumps.  Dropping the
  cutoff changes the operator, while retaining it makes the full hard-layer
  average `Omega(lambda)`.
- A larger soft-symbol cap cannot remove annular gray mass.  The normalized
  transition may shrink, but the unnormalized product `A*chi` remains
  `Omega(lambda)` in both parities.  Consequently the hard-layer average is
  not a substitute for the soft transition and the current trace majorant
  cannot certify an `O(log(lambda))` budget.
- An unconditional favorable subsequence for the odd pole axis is not an
  odd-sector floor.  Its positive diagonal entry must still survive the
  shifted transverse block and the inverse-weighted Schur cross term; a
  diagonal Rayleigh lower bound alone cannot supply either condition.
- A full-source Möbius right inverse is not a prescribed residue-family
  coframe.  Its exact jumps prevent membership in the finite analytic
  prolate spans, and the unmatched locked breakpoint gives only a positive
  fixed-inventory angle, not a uniform asymptotic lower bound.
- A periodic-BV spill upper bound that diverges on the proposed schedule
  does not prove that the optimized spill diverges.  It invalidates that
  certificate; turning it into a lower bound would reverse the inequality.
- A total fail-closed mixed-prefix search is not a useful asymptotic cost
  bound.  It now gives an effective finite-target diagonal and even a fully
  explicit `O(lambda^18/(log(lambda))^3)` source-BV majorant, but that scale
  is far outside the transition regime.  An onto, well-conditioned coframe
  preserves the inertia of the coupled physical form and cannot manufacture
  a positive signed floor from two separated comparisons.
- A larger ordinary prefix does not remove its fixed low-defect direction.
  The exact generalized defect comparison is always at most `d_2`, even when
  the explicit terminal label is enormous.  Reusing an `L2` trace estimate
  in the defect metric therefore pays the missing factor `1/d_2`.
- Whole-target capture does not simplify the complete signed spectrum.  Once
  the physical Gram is retained, the normalized quotient is unitarily
  equivalent to the original physical shifted matrix and has exactly the
  same determinant and inertia.  Replacing the physical shift by a source
  `L2` or defect metric changes the pencil.
- A fixed-parameter high-only tail is not a uniform asymptotic coframe.  It
  eventually spans every fixed finite target and avoids the low-defect mode.
  Its defect cutoff can now be written explicitly, but an exact Fourier
  direction cancels all breakpoint jumps through order `2N-1`, forcing the
  high-tail floor down at least as fast as the explicit `R^(-2d+1)` upper
  bound and the right-inverse norm up on the `R^(d-1/2)` scale.  The
  Vandermonde proof therefore gives no advance terminal-label lower bound.
- Full-rank endpoint jets do not create a prescribed physical coframe.  At
  fixed parameter the jet-zero residue core has exactly the same finite
  physical range as the unrestricted core; high-label jet correction is a
  regularization device, not a rank theorem or a transition-scale schedule.
- A fixed positive gap below the odd critical inverse load is not necessary.
  On any successful favorable schedule with a sublinear shift, the critical
  load itself tends to one from below; the certified Krylov remainder must be
  compared with the shrinking pole surplus.
- Prime-power jumps prove more than unprojected non-eigenvector behavior:
  fixed-parameter graph convergence makes the finite cross vector eventually
  nonzero and transfers a localized `1/K` band law.  They still provide no
  uniform cutoff, positive third moment, transverse spectral floor, or
  orientation of the inverse-weighted cross term.
- Multiplying the jump-band law by the logarithmic high symbol does not make
  it a positive third-moment reserve.  Its guaranteed contribution is only
  `Theta(log(K)/K)` and tends to zero.  Exact models with the same jump tail
  and positive high operator have either third-moment sign; even the complete
  cyclic data can miss a negative reducing direction, and a fixed third
  moment does not determine the inverse load.
- Complete `L2` convergence of the finite ground vector is sufficient but
  not necessary for locally uniform characteristic convergence.  The exact
  centered Cauchy transform suppresses high Fourier rotations; what remains
  is a projective low-mode or compact Mellin-graph estimate.  This weakening
  does not prove that the actual ground line has the required low component.
- A complete low-resolvent norm still overcharges the scalar-aligned
  direction.  The exact projective distance sees only the component
  perpendicular to `P_M kappa`, or equivalently the anchor-normalized wedge.
  Dropping that direction is legitimate only through the proved transverse
  projection or wedge identity, not by deleting a resolvent component by
  inspection.
- Honest far-tail coercivity does not control the transverse resolvent.  The
  separated Cauchy bound makes direct far feedback super-polynomially small,
  but the retained low-plus-middle short can amplify its effective forcing.
  The exact remaining object is `sup_(h>=0)||Omega_h^(-1)eta_h||`; small
  residual, small Ritz lowering, and even strict sector signs do not bound it.
- Loewner monotonicity of positive resolvents does not survive an arbitrary
  low-mode projection as vector-norm monotonicity.  The valid localized
  target uses `sup_(s<=U)||P_M(A-sI)^(-1)b||`, or the proved product of the
  forced inverse energy and low inverse leverage.  Replacing the supremum by
  the endpoint value without a commutation theorem is invalid.
- The displayed high-Fourier coercivity theorem cannot be inserted at
  `M=ceil(lambda)`: its own source-triangle constants make its lower bound
  strictly negative there.  Its enormous positive cutoff is an honest
  sufficient bound, not evidence that the actual lambda-scale compression
  is negative.
- Entire finite characteristic functions with only real zeros do not form a
  normal family merely because they are normalized at one nonreal point.
  Uniform first paired-resolvent trace is a necessary gate.  The exact
  diagonal Cauchy countermodel has every finite determinant hypothesis and a
  first trace growing like `log(lambda)`.
- Qualitative nonvanishing or positivity of the odd response `A(alpha)` does
  not bound that first trace.  On `N/L^2->infinity`, the exact two-height
  identity requires `A(gamma)/A(alpha)` to compensate a central-lattice
  factor that is exponentially small in `L`; any subexponential response
  forces trace growth of order at least `L`.
- A bounded first paired trace is only the normal-family gate.  It neither
  identifies the higher paired-resolvent trace moments nor proves the locally
  uniform determinant limit.
- Eventual positivity of the complete nonpole multiplier and a nonzero
  prime-power jump do not sign the odd third moment.  For the actual source
  multiplier there is also an explicit negative core, and the exact
  Paley--Wiener-projected residual has nonzero mass in both sign regions.
  The positive and negative weighted energies must be compared
  quantitatively, and even a positive third moment does not replace the
  transverse floor or reciprocal-load margin.
- A scalar lower floor for the generalized parity pencil does not bound its
  effective dimension.  The first quotient-trace gate is the full sum
  `Tr(alpha^2*(G+alpha^2*I)^(-1))`; bounding each summand without controlling
  how many lie near the physical scale loses the dimension factor.
- Raw low/high Sylvester separation does not remove the constrained middle
  graph direction.  Even exact vanishing of the raw separated coupling and a
  coercive far block can coexist with a fixed nonzero transverse middle
  response.  Moreover, the odd `2 by 2` Weyl reconstruction collapses exactly
  to the normalized even resolvent: separately bounding both odd responses
  and the Weyl denominator discards a common scalar factor.  Such bounds are
  sufficient but stronger than the cancellation-preserving target
  `sup_(s<=U)||P_L(A-sI)^(-1)b||`.
- Positivity, boundedness, or boundary normalization of the finite ground
  transform at one imaginary height does not control its logarithmic
  derivative.  The effective dimension is that derivative minus an explicit
  exterior lattice tail.  The exact positive-ground, uniformly odd-
  conditioned countermodel still has `d_eff~sigma*L/4`, so pointwise ground
  positivity, all-axis positivity, ordinary interlacing, and odd conditioning
  cannot replace the arithmetic tilt or two-height estimate.
- A projective ground correction must be controlled through its Wronskian or
  the proved jet-leverage products.  Bounding only the correction value, or
  deleting its scalar-aligned part without the exact projective identity,
  does not bound the logarithmic derivative.  Likewise, controlling the
  first ground-transform cumulant does not identify the higher cumulants
  required for locally uniform determinant convergence.
- Positivity of the boundary-normalized even-ground transform on any fixed
  compact imaginary interval does not prove the odd-sector sign.  Later
  imaginary quotient pairs may occur; the exact coefficient-tail reduction
  requires positivity through its coefficient-dependent endpoint, which is
  not uniformly controlled on an arithmetic schedule.
- Pointwise nonnegativity of the boundary-normalized even ground polynomial is
  a sufficient odd-sign certificate, not a proved property of the arithmetic
  ground vector.  Dense-grid positivity or small distance to the prolate state
  cannot be promoted to pointwise positivity without a rigorous enclosure.
- Cauchy form and positive prime weights do not put the even ground line in the
  exact coefficient-positive cone.  The complete source off-diagonal signs
  obstruct a formal diagonal-sign Perron, `M`-matrix, or strict-total-
  positivity argument, and alternating Fourier coefficients do not imply
  pointwise nonnegativity.  The equivalence `p_j>0` for every `j` is a finite
  criterion to prove, not evidence that the arithmetic coefficients satisfy
  it.
- Positivity of `Q_- -epsilon*I` does not by itself give the shifted sign
  `Q_- -U*I>0` required by the bridge.  The explicit quantitative Ritz reserve
  also needs control of the even gap, the zero-mode mass, the largest
  squared-mode pencil root, and `U-epsilon`; none may be omitted.  The exact
  estimate `lambda_max(X)<=N^2+M_2` is not a schedule bound until the
  boundary-normalized coefficient moment and zero-mode conditioning are
  controlled, and the Schur-surplus inequality does not supply them.
- Strict positivity of every coefficient of `P_x(s)` proves the finite odd
  sign but gives no quantitative scale for `p_1/p_0`.  Already at `N=1`,
  `P_x(s)=s+t` lies in the complete cone for every `t>0`, while
  `p_1/p_0=1/t` is arbitrarily large.
- A bounded zero-height quotient trace does not by itself make the normalized
  finite products locally bounded.  The exact curvature/product formula also
  contains the exterior lattice tail.  The `N=1`, `xi_0=L^2` family has
  bounded `Z^(0)` but an exterior factor growing like `L^2`; a schedule with
  `N/L^2` bounded away from zero is indispensable.
- Pointwise nonnegativity of the boundary-normalized ground polynomial turns
  the zero-height target into a centered second-moment formula, but it does
  not prove moment tightness.  Without an arithmetic concentration estimate
  it yields only the trivial `O(L^2)` bound from the support interval.
- Mixed cofactors, Hellmann--Feynman derivatives, and coefficient-probability
  laws reconstruct the required ground-projector ratios but do not compare
  the noncollinear evaluation directions.  Even after local boundedness is
  obtained, it neither identifies the limiting function nor supplies the
  higher trace moments needed for locally uniform determinant convergence.
- The projected prolate anchor having the correct origin two-jet does not
  prove that the actual finite Weil ground has that two-jet.  The transfer
  still requires a positive complete-source shifted complement and a
  quantitative projective correction; ordinary `L^2` closeness, scalar
  radical pairings, or Fourier-high coercivity do not supply it.
- The anchor two-jet schedule `N/L^(7/5)->infinity` is enough for its origin
  curvature, but not by itself for the `O(L^(-2))` inverse-square coefficient
  rate.  The exact coefficient identity retains an exterior tail, and that
  rate additionally needs `N/L^2` bounded away from zero.
- A bounded height-one-half ground-transform ratio is not the zero-height
  trace bound until the exterior lattice product is divided out.  Omitting
  `E_N(1/2)` changes the finite statement, just as omitting the exterior
  curvature tail does.
- Pole-block positivity does not bound the pole leverage of the actual
  ground projector.  The projector is formed from the complete
  pole--archimedean--minus-prime matrix; taking separate block norms before
  the mixed cofactor destroys the cancellation being sought.
- The logarithmic scales `r/gamma=O(L^(-5/2))` and
  `tau_U=O(L^(-5/2))` are sufficient gates, not established source
  estimates.  A finite positive gap, a small radical sampling norm, or
  separately small scalar block pairings cannot be substituted for either
  complete-source bound on an unbounded schedule.
- Pole-deleted index-one inertia and the exact leverage
  `<p_+,S_+^(-1)p_+>=-1/2` do not lower-bound the mixed orientation
  `<e_0^+,S_+^(-1)p_+>`.  The exact two-dimensional rational family keeps
  both identities while that mixed entry tends to zero.
- The inequality `c_0+2*d_0^2>=0` does not itself give the required reserve.
  It becomes useful only after a source-specific negative estimate
  `c_0<=-kappa/L`; index-one geometry supplies no such sign or scale.
- In exact principal Schur coordinates,
  `c_0=-2(1-2*mu)d_0^2`; thus a negative `c_0` already assumes the extra
  condition `mu<1/2`.  The height-one-half principal/odd pole cancellation
  reconstructs the same response ratio `g/p_0` and does not furnish that
  sign or the missing scale.
- Positive conditioning of the odd pole-deleted block, pointwise positivity
  of a boundary-normalized ground polynomial, exact Cauchy displacement, and
  a quadratic schedule do not force the relative odd response to decay.  The
  locked nonarithmetic Cauchy family has all of those properties while its
  response ratio tends to `4/3` and its mixed reserve collapses.
- Deleting the pole does not make the remaining source multiplier positive.
  The even operator necessarily has one negative direction, and separate
  archimedean and prime-block norms destroy the signed cancellation in the
  exact combined multiplier equation.
- Subtracting the exact scalar minimum does make the unshifted nonpole
  multiplier a positive Bernstein--Levy Dirichlet form.  This still does not
  prove the mixed reserve: the actual ground shift places the even inverse in
  its first spectral gap.  A positive killed-jump form with a positive
  constant ground can have the exact pole leverage while its mixed entry
  tends to zero.
- The exact cancellation
  `Q_lambda=c_*I+A_tail-T_D` does not make `T_D` small.  The unconditional
  absolute PNT envelope for `D_lambda` still grows at the endpoint, and
  inserting it entrywise destroys the signed translation geometry required
  for ground localization.
- The continuous prime main density is not a good zeroth-order ground model
  for the reserve.  When `D_lambda=0`, the remaining killed tail ground
  delocalizes on the growing interval and its critical `cosh(y/2)` moment
  grows exponentially.  The discrete signed discrepancy must do essential
  work rather than enter as an absolute perturbation.
- The archimedean tail cannot be cut off at the interval length.  Translations
  with `|h|>L` have disjoint support but contribute a nonzero boundary-killing
  scalar to the zero-extension Dirichlet form.
- Positive entries of the actual natural even matrix do not imply total
  nonnegativity or an oscillatory-matrix theorem.  At `lambda=2,N=4`, two
  independent ball paths enclose a strictly negative all-off-diagonal
  order-two minor and a strictly positive principal order-two minor.  This is
  a finite route obstruction, not a claim about every parameter.
- The boundary quotient `C_lambda(x)` is not a probability expectation.
  Neither the finite ground `x/X` nor the signed sawtooth `F=D-H_0` has the
  positivity needed for Jensen, Markov, or a maximum principle, and `F` has
  an integrable negative logarithmic endpoint.
- A uniform absolute bound on `C_lambda`, `D`, `H_0`, or their separate
  convolutions misses the required cancellation.  The exact identity shows
  that even `C_lambda=O(1)` would yield only `h/X=O(sqrt(lambda))`; the target
  is a one-sided window of width `O(lambda^(-1/2))` with a strict upper edge.
- The completed-xi Laplace identity is derived as an ordinary transform only
  for `Re(s)>1/2`.  Its meromorphic continuation is not a zero-insensitive
  estimate: using control after moving left would assume the spectral
  information that the bridge is meant to establish.
- The compressed ground equation may be tested weakly against the constant
  mode because that mode lies in `E_N`.  It does not justify applying the
  singular uncompressed generator pointwise to the finite ground.
- A magnitude envelope for the weighted-PNT discrepancy cannot prove the
  retained even all-shift inequality.  Setting that discrepancy to zero
  obeys every such envelope, while exact finite Fourier test spaces give
  unbounded negative index for the resulting continuous model.
- A positive odd pole-axis Rayleigh limit, even the neutral value `2*c0`, does
  not sign the raw-low odd Schur complement.  Exact high elimination makes
  the direct high-axis feedback `o(1)` but leaves the orientation of every
  other retained direction unresolved.
- Writing the boundary discrepancy as a centered-zero convolution does not
  estimate the finite ground moment: the exact zero sum reduces to the same
  finite eigenvalue already present in the weak ground equation.  Likewise,
  an explicit convolution criterion equivalent to the critical-line
  statement is not progress unless its boundedness is proved without assuming
  the zero location it is meant to establish.
- Uniformly small zero evaluations of the projected source anchor do not
  transfer to the finite Weil ground.  The elementary transfer factor blows
  up as a zero approaches the strip boundary and requires the same open
  ground comparison; one anchor column also supplies no signed floor or
  shifted sampling inverse.
- A radical-admissible exterior lift for every finite vector does not prove
  the exterior coframe floor.  Its canonical tail operator is exactly
  `-P_low*Q` on the retained space, so the lift rewrites the original Schur
  theorem without adding a lower bound.  Treating Mobius surjectivity as
  positivity would be circular.
- Even one-sided subexponential control of the four-fold box-spline residual
  would force the critical-line statement by Landau's theorem.  The pinned
  PNT magnitude estimate has exponential type `1/2`; monotonicity,
  right-continuity, and the endpoint convention do not bridge that gap.
- Multiplicity-aware centered-zero uniqueness is not stable sampling or
  interpolation.  The same `Omega(R*log R)` jet density that forces a
  finite-type transform to vanish also rules out a complete finite-type
  cardinal/Hermite family, while the projected radical anchor proves that
  the unrestricted positive sampling floor is at most `U_Z=o(d_6)`.
- Extending the radical-admissible lift to every odd finite vector does not
  prove the odd sign.  The canonical exterior operator is exactly
  `-P_low*Q_-` and therefore rewrites, rather than lower-bounds, the original
  raw-low Schur complement.
- The rank-one parity-coupled Schur displacement is rectangular, not a
  Hermitian congruence.  The exact `N=1` source-Cauchy model with
  `Q_+>0` and `Q_-<0` satisfies that displacement, so it cannot transfer
  inertia or positivity without additional arithmetic orientation.
- Replacing the raw high cutoff by the complete-symbol dangerous projector
  improves the honest retained dimension to `exp(O(lambda))` and supplies a
  strict far floor.  Dimension and cost control do not orient its Schur
  complement or prove the quantitative signed coframe lower bound; the
  zero-discrepancy continuous model still has unbounded negative index.
- A small zero-shift weighted inverse on the dangerous space does not control
  the all-shift coframe when the quotient metric fails to commute with the
  shifted matrix.  The exact `3 by 3` metric-rotation family has endpoint
  inverse norm tending to zero but an intermediate-shift inverse norm tending
  to infinity.  One must control every shift, the complete cyclic
  enlargement, or a valid commutation/invariance substitute.
- The even and odd complete-symbol projectors need not be intertwined by the
  source derivative.  Their exact Schur relation has two transfer maps; a
  single-map version pays projector--derivative leakage which can have full
  retained rank.  A rank-one source or boundary commutator tending to zero
  does not by itself bound that leakage: an exact rational two-dimensional
  family has one fixed cross block while its commutator is `O(epsilon)`.
  The trace-selected common threshold now supplies an adjacent gap of size
  `exp(-O(lambda))`, but that fact alone does not make the oriented boundary
  loads or harmonic graph slopes small enough to absorb its reciprocal.
- Forcing an exact derivative-compatible orthogonal split does not preserve
  a generic rotated dangerous space.  Since `D^*D` has simple spectrum, every
  exactly compatible full-parity retained space is a raw Fourier coordinate
  span.  After anchor removal the corresponding missing hypothesis is
  commutation with the derivative metric, not merely a phase-volume rank
  bound.
- A positive determinant of the pulled `2 by 2` reserve does not prove that
  reserve positive.  The exact `N=2` source-Cauchy model in
  `notes/ARITHMETIC_TWO_DIRECTION_RESERVE_NORMAL_FORM.md` has positive even
  complement and completed core, but its reserve is negative definite even
  though its determinant is `128/191>0`.  Both principal-minor signs, or the
  exact scalar radius `rho_2<1`, remain necessary.
- A small boundary-Hankel/pole seed does not make its exact cyclic
  enlargement small; an arbitrarily small nonzero seed may be cyclic for an
  entire high block.  Even when the complete cyclic enlargement is used,
  its zero-shift metric inverse can be parametrically larger than the true
  all-shift norm.  Likewise, the covariance margin `mu-epsilon>0` is a new
  source estimate, not a consequence of the existing quotient-action
  bounds.
- A trace-selected common spectral gap and a rank-two boundary commutator do
  not make the oriented leakage loads small.  A positive compactly supported
  symbol family has a fixed selected gap while its second exact load grows
  like `sqrt(N)`, because almost all endpoint mass lies in the wrong
  orientation.  Enlarging one retained space by the derivative image kills
  only one cross block; the surviving block contains both an old-base term
  and an unproved residual derivative-metric covariance.  The paired atom
  leaves an endpoint-large old-base cross-block before harmonic composition,
  while a separate abstract base-zero model makes the covariance grow and
  its alternating closures fill the whole finite space.
- Cancellation between the two rank-one terms in `nu_2` cannot conceal an
  ordinarily sized retained boundary vector once the displayed packet
  conditions hold.  The Hilbert--Schmidt Gram scalar and an explicit
  high-frequency witness give finite necessary bounds forcing `P_-^0r_v` to
  beat the `sqrt(N)` endpoint scale up to source factors.  Trace, support,
  and unsigned PNT envelopes do not supply this oriented decay.
- Adding the odd pole direction does not let its row cancel the multiplier
  row: the outputs are orthogonal.  Even with `v=0` and a maximal selected
  gap, the exact truncated source pole has row norm of order `sqrt(N)`.
  Pole alignment is a separate source-specific condition.
- Conversely, the large exact Euclidean combination of the pole row and
  `nu_2/ell_*` does not lower-bound the composed leakage.  The harmonic graph
  slope can avoid its forcing vector, and the two complete leakage terms can
  still cancel.  Replacing that oriented composition by a product of scalar
  norms loses precisely the geometry still at issue.
- Nonnegativity, evenness, compact support, and a trace-selected common gap
  do not force positive boundary leverage.  Scaling any fixed nonzero
  positive symbol by a sufficiently small factor leaves those structural
  properties intact while making
  `||P_Nr_v||^2-(tau-ell_*/2)c_v` negative.  The one-dimensional continuum
  quotient must be estimated for the actual inclusive prime--digamma symbol;
  a generic concentration theorem cannot supply its sign.
- The actual central PNT lobe cannot simply be dropped into the full
  boundary quotient.  Its standalone leverage grows linearly, but an added
  nonnegative outer symbol can contribute a boundary vector with negative
  covariance.  Scalar phase volume, peak height, and infinite-time Haar
  statistics do not control the required finite-height low-frequency
  transforms uniformly in the live threshold.
- Nor does retaining a growing `o(L)` number of actual PNT lobes settle the
  full quotient.  That core has the stronger proved coefficient
  `2/pi-1/2`, and its immediately adjacent growing annulus cannot cancel it
  at leading order, but this near-orthogonality cannot be iterated.  The
  actual annulus out to the FKS mesoscopic scale has normalized covariance
  `-1/(2*(2/pi-1/2))` with the inner core.
  The adjacent annulus already has the same feature energy as the core, so
  the triangle-inequality requirement that all outer energy be below
  `(2/pi-1/2)/4` of the core is impossible.  Replacing signed covariance by
  energy loses the proved near-orthogonality.
- Exact conditional negative definiteness, the archimedean term, total
  inclusive prime mass, peak height, support envelope, and the uniform
  `M=o(L)` growing-core asymptotic do not determine the full quotient.
  Collapsing the prime locations to one atom at `L` preserves those data but
  gives a quotient of order `lambda^(-3/2)`.  The individual `log(n)`
  recurrence geometry is indispensable.
- A complete residual-numerator floor does not close the quotient.  The
  FKS mesoscopic core, centered dyadic mean-square estimate, and exact
  separated kernel now prove
  `||r_v||^2>=(1/2-4/pi^2+o(1))*lambda^2*L^2/(4*pi^2)`, despite the strong
  inner anti-alignment.  They do not bound the positive feature denominator:
  a second dyadic argument removes the intermediate loss only up to
  `lambda^2/(L*log(L))`, while the endpoint-weighted excursion tail beyond
  that near-quadratic height remains uncontrolled and the global support
  estimate is exponential.
- Raising the complete prime polynomial to an absolute high moment does not
  presently repair that tail estimate.  The audited finite bound has a
  mean-value length `X+2*pi*(lambda^2)^k`; near `X=lambda^2` the first moment
  gives only `O(lambda^2*L)`, while higher moments immediately pay the
  longer polynomial length.  This proves only that the explicit
  Hoeffding/log-Hilbert bound chain stops, not that the actual tail is large
  or that every refined high-moment argument must fail.
- Conversely, failure to prove the global tail-mass estimate is not a
  finite-matrix obstruction.  On `N=ceil(lambda*L^3)`, the symbol above the
  near-quadratic cutoff has vanishing compressed operator and boundary
  norms, even though its unweighted feature mass is uncontrolled.  Feeding
  the exponential support envelope into the finite matrix discards this
  inverse-frequency suppression.  But a norm tending to zero cannot be
  discarded when the sector gap tends to zero faster; the perturbative
  transfer still requires `epsilon_tail<gamma_lambda`.
- A large retained boundary floor is not a small graph load.  The localized
  finite-compression theorem proves a norm of order `lambda*L`, but the
  operative graph term is a signed difference of two rank-one operators.
  Without a projective angle or the complete screened-feature cancellation,
  the two terms can cancel exactly after their harmonic lifts.
- An absolute PNT error bound does not sign the truncated sector, and a
  fixed negative first-sine moment is not a viable replacement.  The exact
  fourth-order zero filter tends to `c_nf` in the no-right-zero branch and
  oscillates unboundedly if a right-half zero exists.  Therefore a fixed
  odd floor is incompatible with the target; only a shrinking signed
  Loewner/action estimate can be relevant.  The continuous `D=0` and signed
  sine models still show why a magnitude envelope cannot provide it.
- A small signed Weil/Rayleigh scalar does not bound the positive live-shift
  norm.  Exact radicality gives `U_Z=||kappa_N||_Z^2`, whereas sequence
  Cauchy--Schwarz gives only `|q_N|<=U_Z`.  The first-prolate-correction
  theorem and its Gevrey-1 extension now prove exponential absolute decay,
  including `U_Z=O(exp(-c*lambda*L^2))` on the original polynomial schedule,
  but this still does not compare it with the potentially much smaller
  shrinking odd minimum.
- A fixed shift such as `U=1` cannot be admitted merely because the signed
  Rayleigh value is at most one.  In the no-right-zero target branch the
  signed scalar is itself positive sampling energy, exactly `q_N=U_Z/2`,
  while the bridge requires a source-derived Ritz upper bound
  `U_N<mu_(N,-)` (mandatorily `U_N=u_N`).  The older inequality
  `q_N<mu_(N,-)` is stronger and sufficient; setting `U_N=q_N` merely gives
  that stronger gate and discards the legitimate Ritz lowering.
- The first odd mode does not determine the growing odd-sector floor.  Its
  generic `L^(-3)` zero-Gram scale has no uniform lower coefficient, and
  exact rational multi-mode filters force the sector minimum below every
  fixed inverse power of `L`.  Extrapolating a first-mode fit to a polynomial
  floor discards these moment cancellations.
- Critical-line location and a multiplicity-aware Riemann--von Mangoldt
  count do not supply a useful relative odd sampling frame.  The count does
  give a coarse one-separated subset, and log-sine averaging yields a
  positive Cauchy minor on an implicit schedule, but only at determinant
  scale `exp(-O(exp(L)*L^7))`.  A count-compatible symmetric carrier-lattice
  multiset can still make the odd evaluation Gram exactly singular along
  infinitely many preassigned logarithmic lengths.  Carrier-scale
  conditioning remains necessary; replacing multiplicities by derivative
  samples changes the operator and is not allowed.
- The source boundary commutator does not by itself force parity
  interlacing, and even an interlacing positive matrix with a simple even
  ground and arbitrarily small ordinary residual need not satisfy even the
  stronger `q_N<mu_(N,-)` gate.  At a source-derived `U_N<=q_N`, the exact
  endpoint vector is the combined quantity
  `D(Q_+-U_N)kappa_N-(delta kappa_N)beta`; equivalently it is the `q_N`
  vector plus `(q_N-U_N)Dkappa_N`.  Splitting either representation or
  omitting the transverse inverse-weighted Schur correction loses the
  remaining orientation.
- Conditional positivity as a real zero-evaluation Gram does not sign the
  boundary Weyl residues either.  An exact reflected integer-multiplicity
  evaluation Gram crosses a carrier pole, remains strictly positive and in
  source Cauchy form, yet has a negative residue and its odd root above both
  even roots.  Total-positivity intuition from one pole-free Cauchy rectangle
  cannot be applied across the carrier lattice.
- Differentiating the exact global radical does not remove the endpoint
  obstruction.  The odd samples of `Dp` weight the combined primitive
  `p-(delta p)e_0`; after ordinate multiplication the separate constant-mode
  samples need not be square summable, and no separate bound is proved.
  Absolute flatness of `delta p`, or a
  positive derivative Rayleigh scalar, therefore cannot replace the missing
  endpoint-relative estimate, transverse signed floor, and inverse-weighted
  Schur orientation.
- Raw spatial or frequency separation does not give the graph angle after a
  spectral cut.  A vector and a nearly orthogonal high-frequency perturbation
  can project to the same retained line.  Moreover the negative feature
  proving the boundary floor and the complementary positive feature in the
  harmonic screen are pointwise disjoint before pullback.
- Shrinking the auxiliary trace window until the explicit endpoint lower
  bound exceeds its threshold is not a graph-estimate shortcut.  It does
  make the scalar boundary excess positive, but also shrinks the common
  buffer and forces the second oriented numerator large on the locked
  diagonal.  Positivity of that one scalar is not sector positivity.
- A divergent oriented numerator on that shrinking window does not force
  composed leakage either.  An exact positive structural family has fixed
  scalar excess, divergent `nu_2/ell_*`, perfect boundary--pole alignment,
  and a uniformly healthy Green scalar, yet its harmonic gain kills both
  terms and their signed difference is zero for every shift.
- A large pole forcing vector does not force large harmonic leakage.  The
  screened feature can be nearly orthogonal to the retained feature range,
  and an inverse-scale graph slope can erase the forcing.  An exact rational
  family makes the two leakage terms cancel for every shift while retaining
  positive far floors and a fixed spectral gap.
- The positive feature cannot inherit the multi-lobe boundary quotient by
  feature overlap.  The positive and negative multiplier parts have
  pointwise disjoint supports, hence orthogonal feature ranges before time
  compression.  Their compressed interaction is a signed Hankel defect;
  full-symbol and core spectral projectors are not nested by Loewner order.
- The pulled two-direction reserve is not independent leverage beyond the
  pole-deleted odd Green gate.  Under derivative congruence its inverse pole
  scalar is exactly `<p,M^(-1)p>`; the endpoint scale cancels through the
  inverse.  Boundary data for `v` alone can remain fixed while the discarded
  positive multiplier moves this gate across its threshold.
- A favorable pole-axis value does not yield a fixed Green margin.  The
  margin is exactly `s/(2*||p||^2+s)` for the transverse Schur short `s`;
  on the neutral source diagonal every successful margin is at most order
  `1/lambda`.  Its inverse amplification and signed Green moments must stay
  inside the cancellation analysis.
- A common complex phase for the two source Green moments is not their
  missing real orientation.  Both moments evaluate the same harmonic vector
  `e-D^(-1)c`; an exact sign-flip family keeps the spectrum, transverse
  floor, Schur short, Green scalar, load, and rank-two displacement fixed
  while reversing every transverse Green probe.
- Finite-height critical-line verification cannot be promoted to a growing
  odd sampling frame by discarding the unverified high-zero block.  That
  block is Hermitian but signed until center-line location is proved, and a
  fixed verified height supplies only finite rank.  A global zero count also
  gives no carrier-scale lower frame.
- Positivity of several odd derivative Rayleigh energies does not prove the
  odd block positive.  When the derivative vectors span the sector, their
  complete cross-energy matrix is congruent to the original shifted block;
  its diagonal entries can all be positive while its determinant is
  negative.  A shorter Krylov chain can also miss a reducing complement.
- Positivity of the unshifted killed-jump Dirichlet form does not control the
  live inverse-weighted endpoint Schur load.  The complete source form must
  retain the cumulative prime--archimedean discrepancy and its cross
  correlations.  A genuine single-prime-shift model passes the directional
  and transverse scalar tests while its Schur short is negative.
- Adding a scalar positive shift to Suzuki's `A`-scale cannot be subtracted
  as the same scalar from a `G`-scale reciprocal.  The derivative pullback
  changes `c_a I` into `c_a K_a`, formally `c_a/z^2`; moreover the cited
  logarithmic-derivative identity is one-sided and cannot be used as the
  bilateral Fourier multiplier of an even function.  Real zeros at each
  finite interval matter only after contour-local meromorphic convergence
  and characteristic normalization are actually proved.

## Checkpoint 0.54: further rejected shortcuts

- Failure of the `q`-shift Schur gate is not failure of the direct bridge.
  The bridge uses the lower two-vector Ritz value `u`, or another declared
  source-derived variational upper bound `U<=q`.  The exact transport is
  `B_U=B_q+(q-U)I`, `a_U=a_q+(q-U)`, and `c_U=c_q`; testing only `q` can
  reject a valid instance.
- Conversely, lowering the even Ritz value is not an odd-floor theorem.  A
  fixed higher-Krylov polynomial can give a genuine improvement before
  cyclic closure, but complete cyclic closure reconstructs the visible
  ground eigenpair and all moments remain blind to an orthogonal reducing
  complement.  The independent comparisons `alpha>U` and `mu_->U` are
  still required.
- Positive diagonal endpoint energy and a positive transverse compression
  do not imply a positive Schur short, even at the mandatory Ritz shift.
  The independently enclosed `(lambda,N)=(2,4)` source witness has both
  properties but a negative inverse-weighted short at `q` and `u`.  It is a
  non-prolate route obstruction, not an asymptotic counterexample.
- Positive-real behavior of `xi'(1/2+s)/xi(1/2+s)` on the source-safe
  half-plane cannot be continued toward the imaginary axis for free.  The
  safe theorem is only `Re(s)>=1/2`; holomorphic positive-real extension to
  all `Re(s)>0` is equivalent to the missing zero-location conclusion.
- Beyond-all-orders prolate residuals do not make the shifted inverse
  harmless.  The formal derivative corrections generate a growing
  transverse radical tower, so the smallest transverse eigenvalues and the
  cross action vanish together.  Their quotient is not controlled by their
  separate absolute upper bounds.
- A fixed finite list of moments of the cumulative PNT discrepancy cannot
  sign the endpoint Schur inverse.  The exact finite matrix samples
  sine/cosine transforms at a carrier set growing through
  `2*pi*N/L`; moment-preserving compact perturbations can change those
  samples.
- Real poles and exact recentering of a legal finite Suzuki pencil do not
  identify the target logarithmic derivative.  A bounded boundary vector
  has insufficient total residue mass, the canonical trace has the wrong
  unproved spectrum, and recentering makes the positive scalar shift
  analytically vacuous.  Uniform resolvent control, all moment limits, and a
  spectral-identification theorem remain separate obligations.

## Checkpoint 0.55: complete-leakage and positivity shortcuts rejected

- An explicit higher-Ritz Hankel or Feshbach formula is not a relative lower
  bound for its lowering.  Present prolate estimates make the complete
  leakage flat from above but do not control its nonzero scale or normalized
  complement spectral measure.  Exact flat families reverse the comparison
  between `q-U_m` and the same odd near-null scale.
- Absolute exterior sampling is not signed Weil positivity.  It decomposes
  into aligned plus anti-aligned Grams, while the signed form is their
  difference.  The odd gate needs a strict bound for the anti-aligned defect,
  not merely an upper bound for the absolute Gram.
- One strict absolute-Gram contraction cannot include the live even Ritz
  null direction and also close the odd sector.  At the Ritz value the even
  signed pencil is singular, so the corresponding normalized orientation
  quotient is either undefined or exactly one.
- The Cauchy commutator, a finite Ritz pencil, a positive absolute leakage
  Gram, and positive transverse scalars do not determine the Schur short.
  An exact source-Cauchy twin preserves all of those data and flips the odd
  short.  Its paired-slot factorization is synthetic and proves only this
  algebraic non-implication; it is not a zeta zero-evaluation model.
- Positivity of the limiting kernel does not imply positivity of its ordinary
  Fourier projection.  At every fixed odd degree the centered projected
  endpoint is eventually negative as the window grows.  A schedule needs an
  actual pointwise certificate.
- Positivity of a Fejer or Jackson trial state is not positivity of the even
  ground eigenvector.  The ground-inertia equivalence applies only after the
  eigenvector equation removes the commutator defect; for a trial state that
  defect is amplified by `N/|c_p|`.
- Vanishing `L2` error and trial residual, even with a unit spectral gap, do
  not transfer all-imaginary-axis positivity.  Boundary-normalized high-mode
  blocks can converge in norm while keeping a negative transform at a height
  growing with the bandlimit.  The required estimate is relative to the
  trial's pointwise reserve and must be followed by the separate Ritz-shift
  margin.
- A positive three-vector Schur diagnostic at one finite pilot is not an
  asymptotic theorem.  The `lambda=2,N=3` sign change is point-valued, and the
  independently enclosed `N=4` matrix does not enclose the projected prolate
  coefficients.  Neither pilot estimates a diagonal exponent or equation
  (5.2).

## Checkpoint 0.56: finite enclosures do not supply asymptotics

- Small absolute orientation defect is not a relative contraction.  The
  exact slack is measured in the shifted base metric, and synthetic all-`N`
  families preserve the admitted absolute data while reversing that slack.
- A positive trial transform is not automatically the actual even ground
  transform.  The sharp cone gate still requires a source-specific angle
  estimate and then a separate reserve from the ground value to the live
  odd shift.
- Enclosing the infinite-Jacobi labels and projected coefficients at the
  single value `lambda=2` does not enclose a projection-error rate, the full
  complementary minimum, or a diagonal schedule.
- The positive finite quantity `lambda_min(Q_-)-q` is not `Delta` and does
  not certify the checkpoint-0.55 higher-Krylov/Schur or weighted-solve
  point values.  It may not be extrapolated to equation (5.2).

## Checkpoint 0.57: profile, cone, and tail shortcuts rejected

- First resolvent traces at any fixed finite list of imaginary heights do
  not identify a determinant.  Exact equal-rank rational Cauchy-residue
  models agree at all listed heights and differ elsewhere.  The proved
  substitute is convergence on an interval, or a growing mesh with its
  stated monotonicity control.
- Qualitative membership in the positive cone does not give a uniform
  shifted odd reserve.  The same-anchor transfer has the necessary endpoint
  bottleneck `tau_+<t_kappa/sqrt(1-t_kappa^2)`, so a relative endpoint-scale
  estimate or a genuinely different positive anchor is still required.
- A uniform prolate Jacobi tail enclosure and a small state or projection
  residual do not control the shifted Weil inverse.  The exact two-by-two
  model has residual `epsilon`, complement floor `epsilon^2`, and solve norm
  `1/epsilon`; equation (5.2) therefore remains a separate obligation.
- An `O(log(lambda)^2)` projection dimension that is not obstructed by the
  prolate tail is not a signed arithmetic schedule.  It supplies neither the
  shifted sector signs nor the height-profile cancellation or determinant
  limit.
- Unaccompanied real-axis eigenvalue agreement is not locally uniform
  determinant convergence.  Checkpoint 0.59 gives a valid weaker repair:
  strict source sector signs first supply a simple even ground with the
  complete all-real zero divisor, and uniform ground-transform convergence
  on a fixed positive real interval then bounds the inverse-square trace by a
  zero-free product ratio.  Without those source and interval hypotheses the
  shortcut remains invalid.
- Convergence of two signed moments at the origin does not uniformly control
  `widehat f(i/L)-widehat f(0)` on expanding support.  The optional
  moving-height proof needs the source comparison with the limiting kernel
  and its explicit weighted Fourier tail; an abstract two-jet is insufficient.
- An exponentially small **upper** bound for the projected endpoint does not
  prove that the same-anchor cone gate fails.  It shows only that a separate
  polylogarithmic upper bound for the solve is insufficient to order the two;
  the actual solve could be still smaller.
- A Fejer direction with order-one endpoint overlap does not have an
  order-one full response-cone margin after it is mixed with the prolate
  anchor.  The all-`alpha` hybrid reserve and the rotated inverse-metric Schur
  data must be proved directly.
- To certify a positive continued-fraction width bound
  `width<c^2/C`, replacing `c^2` by the upper endpoint of its ball is
  directionally invalid.  The comparison must use a certified lower endpoint.
- A producer that explicitly rejects `floor(lambda^2)>10000` is a finite
  variable-parameter implementation, not an unbounded-`lambda` schedule.

## Checkpoint 0.59: normality, observable, and rotated-anchor shortcuts rejected

- Two positive transform values do not bound the inverse-square zero trace,
  even for even polynomials with only real zeros.  An even number of root
  pairs can lie between the sample points.  The valid product-ratio argument
  needs uniform convergence to a positive target on the whole intervening
  interval, or an independently proved zero-free interval.
- The exterior Fourier lattice cannot be discarded from the source
  determinant product.  Its inverse-square trace alone forces quadratic
  dimension order under a bounded zero-free-interval ratio.
- The `O(L^(-5/2))` complete shifted solve is sufficient but not logically
  necessary for the determinant bridge.  Conversely, a bounded-frequency
  observable estimate does not imply a small Euclidean solve; an exact
  high-frequency model has a diverging solve and a vanishing observable.
- Small Feshbach values or accurate ground-energy estimates do not bound the
  shifted solve.  The identity `tau_U^2=-d'(U)-1` and concavity put the secant
  inequality in the wrong direction.
- A multiscale anchor improves complete response-cone depth only to
  `Theta((log N)^(-1/2))`, not to a constant.  The existing coefficient
  certificate therefore still needs a separate relative
  `1/(N^2 log N)` Schur-surplus estimate.
- Hilbert-space closeness of two Ritz anchors does not preserve positivity of
  the rotated complement, even when the original shifted solve is zero.  The
  exact inverse-metric quantity `D_z`, including its oriented cancellation,
  must be positive.
- Positivity of the pole-deleted Levy operator does not make the complete
  source operator positivity preserving.  Restoring the pole changes the
  continuous jump density's sign at `log(rho)`, and neither a positive Doob
  gauge nor a sign multiplication gauge can remove an off-diagonal sign
  change on a connected interval.

## Checkpoint 0.60: ridge, profile, and pole-load shortcuts rejected

- A combined residual `r` tending to zero does not make the ground correction
  or its bounded-frequency transform small when the complement collapses on
  the same scale.  The exact replacement is the residual-ridged leverage
  `r<g_t,(B+rI)^(-1)g_t>`, which can remain order one in a source-Cauchy
  family satisfying both finite signs.
- Replacing an unshifted inverse by a ridge removes an artificial small-gap
  pole but does not prove the resulting soft spectral overlap vanishes.  The
  source still needs a cancellation-preserving estimate of
  `tr(r(B+rI)^(-1)K_T)` or the corresponding uniform leverage.
- The source commutator scalarizes the ground transform to a meromorphic
  response profile, not to one number or any fixed finite jet.  Exact positive
  Cauchy twins can agree in all such local data and differ elsewhere on the
  required real window.
- Positivity improvement of the nonpole Levy operator does not survive an
  unchecked unit pole load.  The even pole raises the even ground while the
  odd pole lowers the odd ground; a sharp killed-jump model realizes every
  loaded parity outcome with the same structural inputs and pole norms.

## Checkpoint 0.61: soft-overlap and folded-Hankel shortcuts rejected

- A shrinking central-band capture estimate is not a fixed-window
  time-band estimate.  A normalized interval exponential can have vanishing
  mass on `|t|<=delta/L` and asymptotically full mass on a fixed interior
  window.
- Separate eigenvalue lists, ranks, or traces for the soft spectral factor
  and the time-band factor do not control their trace overlap.  The exact
  layer profile `tr(1_(0,u](B)K_T)` retains indispensable orientation data.
- Replacing the regularized signed Schur complement by the inverse of its
  raw physical compression drops the low--high feedback.  The exact splice
  uses the complete `C_r` and a separate fixed-window high leverage term.
- Because the even and odd nonpole blocks come from one positive Levy
  operator, it does not follow that the loaded full forms have a favorable
  Loewner order.  Their exact folded difference has a continuous Hankel
  density that changes sign, and an atom-avoiding bump supplies a negative
  full-form direction beyond the plastic-constant threshold.
- A negative direction of the uncompressed odd-minus-even form does not
  order the lowest eigenvalues and is not automatically a negative direction
  in every finite parity compression.  A finite-schedule conclusion would
  need a separate Galerkin-density and space-identification argument.

## Checkpoint 0.62: moment-floor and paired-Weyl shortcuts rejected

- A superpolynomially small complementary time-band trace does not make the
  residual-ridged soft trace small.  The complete low Schur term can remain
  order one when the regularized moment floor collapses at the residual
  scale.
- The generic inequality `C_(r,m)>=rI` and an exponentially small residual do
  not imply `r/c_(r,m)->0`.  An exact inversion-symmetric source-Cauchy family
  makes that ratio tend to one while retaining a simple even ground.
- A moment Gram determinant by itself is not a Schur-floor certificate.  The
  invariant finite object is the pencil `G-zR`, with
  `R=U^*(B+rI)^(-1)U`; raw monomial scaling can otherwise change the apparent
  determinant.
- The sign of `F_+(z)+F_-(z)` does not locate `z` relative to the first paired
  zero after later nonpole poles.  The odd-floor/first-gap location condition
  is indispensable.
- The full direct-sum determinant at the parity collision is a perfect
  square.  Its nonnegative value at unit load cannot tell which side of the
  collision contains that load; one labelled parity factor or the oriented
  constrained residual must be retained.
- Stable 40/80-decimal agreement of the fixed-window point pilot is not an
  interval enclosure, an unbounded schedule, or locally uniform determinant
  convergence.

## Checkpoint 0.63: covariance and labelled-load shortcuts rejected

- Keeping the time-band covariance removes the worst principal-angle loss,
  but it does not create an arithmetic estimate.  Up to the already closed
  moment tail, the covariance profile is the direct low-spectral/time-band
  profile of the original soft trace.
- Separate superpolynomial upper bounds for the anchor residual `r` and the
  transverse-radical Rayleigh energy `epsilon` do not compare their scales.
  The explicit transverse Xi radical forces a successful threshold to obey
  `u_L=O(epsilon)`, so the simple weighted route still needs
  `r/epsilon=o(L^(-5/2))` for that one-threshold/common-floor route.  It is
  not an intrinsic necessary exponent for the exact soft trace.
- A nonnegative labelled odd trial margin is not a unit-load reserve.  Strict
  positivity of `H_-(1)-U I` is mandatory; equality permits the first
  collision exactly at source load one.
- The overlap-weighted two-sector trial is undefined when both pole overlaps
  vanish.  Assigning it a Rayleigh value by cancelling the zero denominator
  would manufacture a false certificate.
- Using the actual constrained ground in the inverse-load formula is an exact
  existential identity, not a constructive source trial.  A usable unbounded
  proof still needs a separately reconstructed trial and a strict labelled
  odd lower floor.
- A positive `lambda=2,N=4` point margin, even when repeated at doubled
  precision and independently replayed, is not an interval enclosure or an
  unbounded unit-load orientation theorem.  The checkpoint-0.63 artifacts do
  not compute the covariance profile or the transverse-radical ratio.

## Checkpoint 0.64: reciprocal and secant shortcuts rejected

- The older `r/epsilon=o(L^(-5/2))` target cannot be promoted from a
  one-threshold sufficient certificate to a necessary condition for the
  exact soft trace.  The rank-one obstruction has the intrinsic exponent
  `L^(-3/2)` when the reciprocal crowding reserve stays bounded.
- A small `r/epsilon` is not by itself sufficient.  The exact tilted-block
  identity leaves a nonnegative complementary Hilbert--Schmidt term, or
  equivalently a reciprocal crowding factor that still needs an upper bound.
- Separate estimates for the low spectral mass `Phi(u)` and the total trace
  may lose the cancellation-free reciprocal tail.  The sharper upper target
  is `Phi(u)+r*H(u)`, with the actual joint source/time-band orientation
  retained.
- The signed scalar secant identity does not control the full residual.  An
  orthogonal component `b_perp` can be arbitrarily large while all scalar
  secant data remain fixed.
- Agreement between a recurrence and differential-form assembly in one fixed
  30-mode prolate Galerkin space does not enclose the infinite Galerkin tail
  or turn the point state into an exact source eigenfunction.
- A nondirected arbitrary-precision evaluation of an analytic Gaussian-tail
  bound is not an outward-rounded interval endpoint.
- Stable 40/80-decimal values at `lambda=2,N=4,T=1`, including a positive
  finite gap or a bounded finite reciprocal reserve, do not establish a
  diagonal schedule, an asymptotic exponent, equation (5.2), or locally
  uniform determinant convergence.

## Checkpoint 0.65: shorted-response shortcuts rejected

- The secant energy `epsilon` is not the relevant denominator after coupling
  to its orthogonal graph.  The exact denominator is the shorted energy
  `delta_r=epsilon+r-g*(C+rI)^(-1)g`, which can be much smaller.
- A successful graph-shorted rank-one estimate does not control the deflated
  bulk `r*tr((C+rI)^(-1)K_F)`.  An exact source-Cauchy family has a perfect
  one-vector deflation while the bulk grows with phase volume.
- The source commutator does not close after one radical deflation: the
  resulting rectangular displacement has rank at most three and still acts
  on an `(N-1)`-dimensional reciprocal bulk.  Low displacement rank is not a
  trace bound.
- Writing the reciprocal trace as an odd-sector trace minus two logarithmic
  determinant derivatives does not permit separate absolute bounds.  The
  finite source pilot contains cancellation between terms of order millions
  before producing a trace of order thousands.
- A complete growing prefix of polynomial-Xi radicals cannot have a uniform
  fixed-window covariance floor.  Exact high-moment, anchor-orthogonal
  witnesses drive its minimum window eigenvalue to zero exponentially in
  prefix depth.
- The preceding covariance obstruction does not itself transfer to a growing
  finite prolate schedule.  Only fixed-depth convergence is admitted; using
  it uniformly in depth without a synthesis-tail enclosure is another false
  interchange of limits.
- The checkpoint-0.65 40/80-decimal split identifies the dominant term at one
  finite point only.  It does not prove an unbounded shorted-energy rate, a
  deflated-bulk rate, either shifted-sector sign, equation (5.2), or locally
  uniform determinant convergence.

## Checkpoint 0.66: shift and determinant shortcuts rejected

- Treating both complete `q`-shifted sector signs as an easier preliminary
  lemma is circular at the project scale.  On the admitted widening core,
  those signs and the existing `|q|+r` decay already imply the Weil
  criterion.  The checkpoint proves this implication, not the signs.
- A positive determinant does not certify both shifted sectors.  The exact
  simultaneous gate is the positivity of every coefficient of
  `det(B_q+sI)det(C_q+sI)`; an even number of negative eigenvalues can leave
  the determinant positive.
- Separate absolute estimates for `W_Z(v,R_0)` and
  `W_Z(v,R_lambda)` need not control their signed difference.  The graph
  load retains the exact combination
  `-W_Z(v,R_0)+(alpha/a)W_Z(v,R_lambda)`.
- Small `r/epsilon`, small orthogonal residual, and the scalar secant identity
  do not prevent graph-short collapse.  A growing exact source-Cauchy family
  at its true two-vector Ritz shift satisfies those tests while the graph
  soft term stays bounded below.
- The residual-self-regularized identity cannot be transplanted from `U=q`
  to an arbitrary Ritz shift.  At `U<q` the exact forcing energy is
  `q-U+h_U`, not `h_U`; a rational two-dimensional example rejects the false
  `r(B_U+rI)^(-1)` ground bound.
- Finite `F=G+J` agreement and the positive log-increment inequalities at a
  Ritz shift are exact algebraic diagnostics, not an estimate for equation
  (5.2).  Nor can real-axis determinant agreement substitute for locally
  uniform determinant convergence.
- Checkpoint 0.66 does not replay the actual-source factors
  `det O_s,m_s,sigma_s,delta_s`.  Its independent agreement covers the
  even-block finite increment only; it cannot be cited as a numerical check
  of the complete source-Cauchy cancellation formula.

## Checkpoint 0.67: Ritz-moment shortcuts rejected

- The mandatory Ritz moment repairs finite ground transfer only after the
  explicit factor `A_R((q-U)/r)` is retained.  The coefficient-one ridge is
  still false at a genuine lower Ritz shift.
- A small finite value of `(q-U)/r`, or even a sequence with
  `A_R((q-U)/r)->1`, does not make the ground correction or its observed
  determinant response small.  A source-specific response estimate is still
  required.
- The fixed-window trace is a localized observation.  It cannot be promoted
  to the complete `L2` equation (5.2), a complex-strip estimate, or a locally
  uniform determinant limit without the corresponding growing observation
  and tail bounds.

## Checkpoint 0.68: projective low-mode shortcuts rejected

- The determinant gate bounds the **squared** low-mode norm.  Dropping that
  square loses a square root in the compact-transform rate and gives the
  wrong asymptotic hypothesis.
- If the homotopy parameter varies, the divisor `log(1+theta)` is mandatory.
  Sending `theta` to zero makes the raw log increment vanish even when the
  observed low-mode energy stays fixed.
- Source-Cauchy factorization applies to the full ambient homotopy
  `Q+t*Pi_M`, in both parity sectors, with the anchor scalar and cross vector
  changing with `t`.  A complement-only perturbation generally fails to
  commute with the mode operator and has no such justified factorization.
- The choice `M=ceil(lambda)` requires an outer schedule with `N>M` and the
  independent projection-error estimate.  It cannot be combined silently
  with a smaller polylogarithmic outer cutoff.
- A small actual projected ground correction does not force the low-mode
  trace response to decay: an unrelated cutoff-visible near-null complement
  direction can keep the log increment bounded below.  The trace gate is
  sufficient, not necessary.
- A source-pinned finite pilot, doubled precision, or exact real-axis
  factorization does not prove the required `A_R`-weighted response rate on
  an unbounded arithmetic schedule.

## Checkpoint 0.69: ground-projective response shortcuts rejected

- The three terms in the adjugate formula for `E_M` must remain combined.
  Bounding `tr(Pi_M*adj(H))`, the mixed cofactor, and the anchor term
  separately destroys the cancellation that defines the projective error.
- A transpose cannot replace a conjugate transpose, and the real part in the
  mixed term cannot be dropped.  Exact complex Hermitian fixtures reject both
  substitutions.
- The bordered determinant cross-ratio is an exact readout, but its finite
  secant is not a cap-free upper bound for its derivative.  Retain a proved
  cyclic cap or the explicit vector-specific spectral tail.
- The bordered rank-one matrices are not source-Cauchy homotopies.  Of the
  constructions compared here, the full ambient diagonal perturbation
  `Q+t*Pi_M`, in both parity sectors, preserves the pinned displacement;
  the complement-only and bordered perturbations do not.
- The high cross term in
  `S_M-k00=E_M-2*Re(<R_M*kappa,R_M*(x-kappa)>)` has no established sign.
  The favorable sign seen in one point pilot cannot be assumed.
- The singular adjugate formulas require the true simple ground `mu`.
  Substituting a Ritz shift, a rounded spectral estimate, or real-axis
  eigenvalue agreement changes the formula.
- One determinant does not determine Hermitian inertia.  The even and odd
  Schur inequalities must each be checked; Ritz interlacing and the source
  commutator do not force them.
- The conditional `M=ceil(lambda^12)` criterion does not prove its
  `O(lambda^(-1))` cofactor response premise, either sector sign, the
  full-`L2` target (5.2), or an unbounded locally uniform limit.
- Exponentially small anchor tail does not force ground alignment.  A
  diagonal source-Cauchy family has zero tail, bounded exact-Ritz ratio, and
  both strict shifted signs, but its normalized anchor-transverse ground
  alignment is identically `1/3`.

## Checkpoint 0.70: natural-cutoff alignment shortcuts rejected

- The Gevrey estimate at `M=ceil(lambda)` is qualitative and has a
  noncomputed starting threshold.  It proves a superpolynomial anchor tail;
  it does not certify that the asymptotic bound is active at a finite pilot.
- The cumulative discrepancies
  `F_align=D-H_tail` and `F_boundary=D-H_0` differ by
  `2*exp(-t/2)`.  Replacing one by the other without the corresponding drift
  term changes the exact signed ground forcing.
- The `A_tail` and `T_D` forcing vectors must be combined before the common
  `B_mu` solve.  Solving and bounding the two responses separately can lose
  billions in the finite pilot and is not an admissible arithmetic estimate.
- The sign of `S_M-k00` is not fixed at finite dimension.  Its absolute
  asymptotic rate is equivalent to the positive alignment energy only after
  the separately proved superpolynomial high-cross estimate is invoked.
- A small residual, small Ritz lowering, both strict shifted signs, exact
  source-Cauchy displacement, and zero Fourier tail do not force alignment
  decay.  The exact diagonal counterfamily retains a fixed nonzero relative
  ground response as its residual tends to zero.
- Stable 40/80-digit agreement and a very large observed block-cancellation
  factor remain point diagnostics.  They prove neither the required
  `O(lambda^(-1))` source response nor either sign on an unbounded arithmetic
  schedule, equation (5.2), or locally uniform determinant convergence.
