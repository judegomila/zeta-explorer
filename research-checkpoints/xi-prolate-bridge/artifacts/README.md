# P0 artifacts

These artifacts include finite diagnostics, raw Arb ball outputs, and
outward-interval reconstructions of narrowly scoped analytic component
bounds.  Some component notes prove estimates on an explicit unbounded
schedule; no artifact asserts the complete residual--gap bridge, equation
(5.2), a signed low-sector floor, or locally uniform convergence.

- `p0_pilots/`: arbitrary-precision prolate projection and residual--gap
  producer/replay JSON, including the independently reconstructed source
  Cauchy-form commutator and conditional boundary-nonvanishing audit.
- `p0_ball_pilots/`: lossless Arb dumps plus readable ball enclosures for two
  independently assembled finite Weil matrices.
- `p0_schedule/raw/`: deterministic finite schedule points with both legacy
  signed gaps, sector-refined Ritz gaps, weighted resolvent values, and
  chordal distance bounds kept separately.  The intermediate `1.75`, `2.25`,
  and `2.75` points are retained at base and doubled precision; the last one
  fails closed in the odd sector on the `N=2*ceil(lambda^2)` schedule.  The
  additional `lambda2p75_N24` and `lambda2p75_N32` records show that the same
  finite point has positive shifted sectors at larger Fourier bandwidth;
  this is a bandwidth diagnostic, not a stable asymptotic conclusion.  The
  `N_3ceil_lambda2_summary.json` record collects the first four passing points
  of that deterministic schedule and reports both local slopes and OLS-only
  fit uncertainty, with extrapolation explicitly disallowed.  Its delicate
  `(2.25,18)` point is retained at base and higher precision and has an
  independent base replay.
- `p0_schedule/verifier/`: selected schedule points reconstructed from source
  parameters by the independent matrix/quadrature/direct-LU path.  Raw
  defects and explicit absolute/relative acceptance scales are serialized.
- `p0_schedule/rejected/`: under-resolved runs retained as explicit failure
  records; they are excluded from summaries.
- `prolate_window_probe/`: point-valued plus/minus prolate energy-window
  diagnostics whose low bases are fixed before the Weil matrix is assembled.
  These include the state-invisible codimension-two correction audit and the
  anisotropic Schur/resolvent decomposition, the source additive
  concentration-defect model, and an independent replay of the matrix lower
  model and forced-bound formulas.  The `lambda2p25_N12_two_window` pair
  records a stable nonpositive `X=0` lower model, while the `shannon4` pair
  grows the deterministic source window through the prolate Shannon index
  and restores point positivity.  Producer and verifier share mpmath.  The
  artifacts are neither interval enclosures nor asymptotic estimates.
- `projection_rate/`: an independent 256-bit Arb enclosure of the exact
  incomplete-gamma expression for `C_K` in
  `notes/PROJECTION_RATE_THEOREM.md`.  It proves the safe rational comparison
  `C_K<6006/1000`; it is only an analytic-constant ball, not a Weil-sector
  result.
- `chebyshev_rewrite/`: an independent point-valued replay of the exact
  combined Chebyshev-error integral at `(lambda,N)=(2,2)`.  The verifier
  reconstructs the Weil matrix and prime powers from source parameters,
  checks three off-diagonal entries plus one complex Rayleigh-shifted form,
  and records the explicit origin cutoff and precision at 80 and 160 decimal
  digits.  Its matrix and integral sides use independently coded source
  correlations and prime-power enumerators; the exact lists are compared and
  serialized.  It reads no producer matrix and proves no sign or asymptotic
  estimate; both paths still use `mpmath` transcendental arithmetic.
- `transition_window/`: exact rational Shannon indices, outward `mpmath.iv`
  endpoints for the pinned KRD transition scale, and the inclusive `n_*`
  half-defect check.  It concerns only the positive prolate model and carries
  explicit false fields for a signed Weil comparison.
- `transition_prolate_outer/`: `p=5` and `p=7` transition-mode certificates
  at 80 and 160 decimal digits.  The producer and clean-room replay bind the
  exact source bytes and independently reconstruct the strict `n<n_*`
  domain, `mu_n<3*c^2`, endpoint/Volterra constants, complete even-label
  sampled-series bound, and weighted norm/translation constants.  Raw
  outward-interval dyadics are retained; both formula paths share
  `mpmath.iv`.  These artifacts prove no quotient action, signed sector
  floor, equation (5.2), determinant convergence, or RH.
- `growing_transition_sampling/`: rest-block pilots at 80 and 160 decimal
  digits (`p=5,q=8` and `p=7,q=14`); the singleton `q<=3` case follows from
  the replayed exact q-linearity and serialized singleton row bound.  The
  independent replay reconstructs the origin correction, exact q-linearity, hybrid
  positive series, one-loss compact-projection exponent, complete Minkowski
  constant, and the rejection of a full-metric block shortcut.  The admitted
  output is the within-block source-coordinate Loewner bound only; physical
  synthesis, block quotient/cross-block/high-complement assembly, and both
  signed comparisons remain open.  Both paths share `mpmath.iv`.
- `prufer_same_parity_gap/`: outward intervals at 80 and 160 decimal digits
  for the elementary same-parity differential prolate non-collision bound at
  `lambda=2`, `n=0`, `r=2`, together with exact `c=0` Legendre center and
  phase-derivative oracles.  The verifier imports no producer module and
  rebuilds `c^2`, `K^2`, and the exponential bound through a different
  expression tree.  Binary endpoints are serialized as exact signed dyadics;
  decimal strings are display-only, and the replay checks higher-precision
  interval containment rather than rounded-decimal overlap.  Both paths share
  `mpmath.iv`.  The qualitative all-`c` Sturm homotopy is proof-only, not a
  replay claim.  No numerical Sturm solve, growing-window conditioning claim,
  or signed Weil-sector claim is present.
- `prolate_tail/`: the explicit corrected-state far-frequency envelope and
  far-prime pairing bound at 80 and 160 decimal digits, with independent
  formula reconstruction at higher precision.  The producer and verifier
  share `mpmath.iv`; the component theorem is uniform, but it is not a bound
  for the near signed residual or equation (5.2).
- `chebyshev_hankel/`: outward intervals for the three uniform moments of the
  complete normalized Chebyshev-error kernel, repeated at doubled precision
  and independently reconstructed from the pinned FKS v3 constants and
  local PDF hash.  These are upper moments only, not a signed lower bound.
- `near_hankel_geometry/`: deterministic 50- and 100-digit point replays of
  the centered-log Hankel, parity, and projection-Toeplitz identities.  The
  replay uses smooth toy profiles to catch signs and boundary terms; it is
  not an arithmetic-kernel enclosure.
- `defect_relative_projection/`: exact half-integer schedule input at
  `j=2`, with 80/160-digit outward `mpmath.iv` intervals and independent
  100/200-digit formula replays.  Raw dyadic endpoints, the unmaterialized
  power-of-two exponent, source/dependency hashes, and the ordinary plus
  log-weighted relative projection bounds are serialized.  Both paths share
  `mpmath.iv`.  This artifact group alone makes no signed pairing or sector
  claim; the separate compact-projection group below closes only P--P.
- `high_fourier_coercivity/`: explicit source-Cauchy diagonal, commutator,
  low/high coupling, and sufficient-cutoff constants at 80 and 160 digits.
  The replay independently hashes the CCM source and reconstructs the
  constants.  This is a high-block isolation theorem, not a low-sector sign.
- `compact_projection_weil/`: outward intervals for the defect-relative
  compact projection--projection Weil-form bound on the locked `j=2`
  schedule point, repeated at doubled precision and independently replayed.
  This group closes only the pure `P--P` correlation; the separate
  `outer_projection_weil/` group closes both cross orientations for the
  actual corrected combined state.  Both paths share `mpmath.iv`.
- `outer_projection_weil/`: outward intervals for both source-core
  outer--projection orientations of the actual corrected source-normalized
  `0/4` state.  The replay reconstructs the two-sided radical reduction, the
  hard-endpoint BV coefficient bounds, the separated `1/N` Cauchy sum, and
  the compact `P--P` contribution from exact `j=2` input at 80 and 160
  digits.  It does not assert a modewise radical, an arbitrary outer
  multiplier theorem, an `O--O` estimate, or a sector floor.  Both paths
  share `mpmath.iv`.
- `weak_residual_duality/`: exact integer/rational reconstruction of the
  five-dimensional two-sided-radical obstruction.  The producer evaluates
  the weighted action at arbitrary precision; the verifier imports no
  producer code and reconstructs all radical and scalar-pairing identities
  with `fractions.Fraction`, using `decimal.Decimal` only for the displayed
  square-root values.  Provenance hashes are serialized.  This is an
  obstruction to a scalar-to-action inference, not an RH counterexample or
  an asymptotic residual estimate.
- `quotient_exterior_preconditioner/`: a rank-deficient exact rational
  regression for minimum-source-energy descent to the physical range.  The
  producer evaluates the quotient, sampling Loewner descent, alignment, two
  action bounds, and a low/high cross-term model at arbitrary precision.  The
  verifier imports no producer code and reconstructs the matrices and
  inequalities with `fractions.Fraction` and `decimal.Decimal`; the complete
  replay is recorded at 80 and 160 decimal digits.  The source
  exterior sampling estimate and both shifted signed comparisons remain
  explicitly false in the artifact.
- `full_exterior_sampling_fallback/`: the source-explicit unconditional
  full-`Y` Gram fallback at `lambda=5/2`, `N=24`, repeated at 80 and 160
  decimal digits.  Every closed-form quantity is stored with exact dyadic
  endpoints of an outward `mpmath.iv` interval; decimal strings are
  display-only.  The verifier imports no producer code, re-hashes the
  ten-entry source/dependency lock, and independently rebuilds the intervals
  through a logarithmic expression tree.  The artifacts retain all sampling
  cross terms, quotient source kernels, and record the explicit bound
  `B_abs*lambda^4/(4*d_LS^2)`.  This bound is exponentially enormous and
  explicitly does not close even the relaxed
  `O(lambda^4*polylog(lambda)/d_8)` alignment target, either signed sector,
  equation (5.2), determinant convergence, or RH.
- `hybrid_outer_sampling_odd_shift/`: outward intervals at 80 and 160
  decimal digits for the complete-series weighted `L2` constant, hybrid
  dyadic switch, stable exact-integer ceilings, polynomial-absorption
  margin, and stretched-exponential tail certificate at `lambda=5/2`.
  Exact dyadic endpoints are serialized and the verifier imports no producer
  module, although both formula assemblies share pinned `mpmath.iv` 1.4.1.
  Each verifier artifact binds the exact producer-file SHA-256, input,
  declared and replay precision, complete source/runtime hash inventories,
  and independently reconstructed raw dyadic intervals.  A precision-scaled
  width check rejects widened intervals and false precision promotion.  The
  artifacts do not numerically truncate the exact infinite blockwise-minimum
  series.
  The admitted theorem proves complete-remainder sampling `o(d_6)` and hence
  a small common normalization-free shift on the locked schedule.  It does
  not make the normalized bound `epsilon_lambda/a^2` small without separate
  control of `a`, and proves no signed sector floor, Schur sign, residual
  action, equation (5.2), or RH.
- `projected_state_norm_lower_bound/`: outward intervals at 80 and 160
  decimal digits for the explicit positive limiting-state norm lower bound,
  source-comparison error, periodic Fourier tail, elementary half-integer
  incomplete-gamma majorants, both inversion-reflected limiting tails, and
  the unit-normalization rejection factor.  The supplied finite
  `delta_upper` is deliberately recorded as a diagnostic input rather than
  promoted to an effective source enclosure.  Producer and verifier use
  independent formula trees but share pinned `mpmath.iv` 1.4.1.  Combined
  with the qualitative pinned `delta_lambda=O(lambda^-2)` and the hybrid
  theorem, this proves `U_Z=o(d_6)`; it proves no signed floor, residual
  action, equation (5.2), determinant convergence, or RH.
- `leading_prolate_oscillation/`: exact-rational `lambda=5/2` and `7/2`
  packet/min--max certificates.  The clean-room replay binds the exact
  producer bytes, re-hashes every locked dependency, derives the scaled
  cosine moments by an independent expression tree, and reconstructs all
  `p^2` packet and target counts.  No binary64 or transcendental arithmetic
  is used; both paths share Python's standard-library `Fraction`.  These are
  differential-eigenvalue upper bounds only, not concentration-defect lower
  bounds, signed floors, equation (5.2), determinant convergence, or RH.
- `physical_map_conditioning/`: exact half-integer breakpoint arithmetic,
  finite Möbius data, endpoint-jet leading coefficients, and an independent
  factorization/rational replay at `lambda=5/2`.  It records qualitative
  parity-map injectivity and explicitly keeps uniform physical conditioning
  false.  Provenance hashes are serialized.
- `compact_absolute_sampling/`: arbitrary-precision point evaluations of the
  explicit compact-BV zero-sampling theorem at the first locked exponential
  schedule point, repeated at 80 and 160 digits and independently replayed
  at 120 and 220 digits.  The producer and verifier reconstruct the exact
  17-entry source dependency set and all 18 displayed values separately, but
  share `mpmath` point arithmetic.  The artifacts prove no window Bessel
  bound, reciprocal defect sum, shifted sector floor, equation (5.2), or RH.

The replay script regenerates the binding pilots at doubled precision and the
selected delicate schedule replay. File hashes are recorded in
`ARTIFACT_MANIFEST.sha256` after replay.
