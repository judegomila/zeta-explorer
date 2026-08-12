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
  output is the within-block source-coordinate Loewner bound only.  The
  successor `block_quotient_action/` artifacts close the low physical
  synthesis and cross-block quotient action; the physical high complement
  and both signed comparisons remain open.  Both paths share `mpmath.iv`.
- `block_quotient_action/`: exact half-integer inputs `p=5,7` at 80 and 160
  decimal digits.  The producer serializes outward intervals for the finite
  KRD ground-state reserve, rest-column norm, and the product `d_12*M_rest`;
  it does not invent a finite value of `d_12`.  The clean-room replay imports
  no producer or transition helper and reconstructs the formulas through a
  different expression tree.  Exact-rational regressions check a saturating
  two-block action, a nontrivial Moore--Penrose range action, the change
  `Gamma=1` to `Gamma=4` under an invalid full-metric substitution, and the
  physical-complement/Fourier-high counterexample.  Both interval paths share
  `mpmath.iv`.  The fixed-index limits are qualitative and non-effective;
  the artifacts prove the low positive action only, not a physical-high or
  shifted signed floor, equation (5.2), determinant convergence, or RH.
- `compressed_multiplier_trace/`: exact half-integer inputs `p=5,7` at 80
  and 160 decimal digits on `N=ceil(lambda^2)`.  The producer enumerates
  inclusive prime powers by a sieve/power path; the clean-room replay factors
  every integer independently and imports neither producer nor project
  helpers.  Raw outward dyadics, expanded by the locked vanishing exact-dyadic
  serialization guard, record the exact arithmetic sums, the
  self-contained dyadic logarithmic-Hilbert constant, the finite mean-square
  bound, the two central archimedean branches, the tail, trace, and dangerous
  rank ratios.  Exact rational regressions distinguish the inclusive rank
  projector from the strict capture projector and saturate both the capture
  floor and quotient-gluing factor.  The finite pilot rank bounds are
  explicitly marked ambient-dimension-vacuous; only the asymptotic
  `O(lambda^2)` scale on the displayed polynomial schedule is proved.  Replay
  requires every submitted interval to enclose its independent
  reconstruction; overlap alone is rejected.  Both paths share pinned
  `mpmath.iv` 1.4.1.  No physical capture, signed floor,
  equation (5.2), determinant convergence, or RH conclusion is claimed.
- `signed_quotient_capture/`: exact half-integer inputs `p=5,7` at 80 and
  160 decimal digits on `N=ceil(lambda^2)`.  The producer and clean-room
  replay independently reconstruct the noninjective quotient equivalence,
  quotient-relative cross identity, scalar-shift cancellation and sharp
  erosion model, two capture/cross countermodels, signed-sampling failures,
  and a rational ridge-majorant leakage identity.  The transition ceiling and
  buffered parity counts are enclosed with raw guarded dyadics; replay uses a
  different logarithmic expression tree, requires enclosure rather than
  overlap, and trusts no producer boolean or cached matrix.  Both paths share
  pinned `mpmath.iv` 1.4.1.  The artifacts prove exact reductions and show,
  conditional on the explicitly unproved projected-anchor nonvanishing, that
  there is no target-count dimension obstruction.  They prove no co-frame,
  physical capture, signed lower comparison, strict cross reserve, sector
  floor, equation (5.2), determinant convergence, or RH conclusion.
- `leverage_trimmed_mean_feature_schur/`: exact-rational `p=5,7` theorem
  regressions at the 80 and 160 digit metadata labels.  The producer computes
  exterior volumes from column-Gram determinants, physical complements from
  a range projector, trimmed means by capacity-constrained lower-tail fill,
  and negative Schur loads from physical blocks.  The clean-room replay binds
  the exact producer bytes and instead uses double minors, a nullspace
  projector, stop-loss breakpoint duality, and a feature resolvent.  It also
  rebuilds singular positive shorting, a non-unit-`g` Neumann tail, strict
  odd-pole equality rejection, trace/norm and orientation countermodels,
  over-shorting, a normalized coframe tail, and finite Möbius convolution.
  The right-inverse oracle also reconstructs a zero-integral central-hole
  correction and verifies that it lies in the physical sampling kernel.
  Both paths share Python `fractions.Fraction`.  These are algebraic theorem
  regressions, not physical pilots, an unbounded-schedule estimate, equation
  (5.2), determinant convergence, or RH.
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
- `soft_defect_prolate_angle/`: exact-rational regression certificates and
  outward `mpmath.iv` formula intervals at `lambda=5/2,9/2`, repeated at 80
  and 160 decimal digits.  The clean-room replay binds the exact producer
  bytes, re-hashes the 18-entry source lock, and independently reconstructs
  clipped-defect, leverage-excess, capped odd-pole, source-Gram principal-angle,
  augmented-determinant, square-root projection, and central-band formulas.
  Producer and verifier share Python `Fraction` and pinned `mpmath.iv` 1.4.1.
  These finite reductions prove no physical leverage-excess estimate, actual
  odd reserve, matched prolate coframe, signed sector floor, equation (5.2),
  determinant convergence, or RH.
- `physical_defect_adjoint_tail/`: exact-rational regression
  certificates and seven outward `mpmath.iv` formula intervals at
  `lambda=5/2,9/2`, repeated at 80 and 160 decimal digits.  The
  clean-room replay binds the exact canonical producer bytes, re-hashes the
  16-entry source lock, and independently reconstructs the cap-free weighted
  capture, exact central-band domination oracle, source-tail competitor,
  exact coframe rank-one correction, nonzero shifted chord correction,
  monotone moment hierarchy, aligned positive excess, load-one/sign guards,
  and shifted one-direction Schur fixtures.  Canonical inputs are range
  checked before interval initialization.  Producer and verifier share
  Python `Fraction` and pinned
  `mpmath.iv 1.4.1`.  These finite reductions prove no physical
  capture estimate, growing-family coframe reserve, actual odd reserve,
  signed sector floor, equation (5.2), determinant convergence, or RH.
- `log_feature_capture_alignment/`: exact-rational orientation, source-tail,
  shifted-moment, pole-axis, spectral-endpoint, and central-versus-exterior
  regressions plus eleven outward `mpmath.iv` formula intervals at
  `lambda=5/2,9/2`, each repeated at 80 and 160 decimal digits.  The
  clean-room verifier imports no producer module, re-hashes the six-entry
  source lock, reconstructs every rational fixture through a separate
  formula tree, encloses all transcendental quantities independently, and
  binds the exact canonical producer bytes.  Both paths share Python
  `Fraction` and pinned `mpmath.iv 1.4.1`.  The conditional angle and
  source-tail budgets are formula probes only: the artifacts prove no actual
  prolate feature angle, targeted source-tail rate, exterior weighted
  capture, shifted odd reserve, signed sector floor, equation (5.2),
  determinant convergence, or RH.
- `intrinsic_feature_dyadic_defect/`: exact-rational gauge, minimum-tail,
  corrected sparse-residue, physical cross-Gram, noncommuting dyadic-layer,
  spectral-endpoint, odd-directional, and aligned-versus-oblique regressions,
  plus outward `mpmath.iv` combined-symbol and optimal-remainder formula
  intervals at `lambda=5/2,9/2`, each repeated at 80 and 160 decimal digits.
  The clean-room verifier imports no producer module, re-hashes the ten-entry
  source lock, reconstructs the rational fixtures through separate formula
  trees, and binds the exact producer bytes.  Both paths share Python
  `Fraction` and pinned `mpmath.iv 1.4.1`.  These artifacts prove no actual
  feature-angle rate, exterior-layer effective-rank alignment, odd
  directional edge deficit, signed sector floor, equation (5.2), determinant
  convergence, or RH.
- `weighted_spectral_alignment_chebyshev_edge/`: exact-rational
  covariance-weighted central, exterior spectral `k`-width, open-threshold,
  sharp first-moment, and equal-moment opposite-outcome regressions, plus 27
  outward `mpmath.iv` enclosures at `lambda=5/2,9/2`, each repeated at 80
  and 160 decimal digits.  The clean-room verifier imports no producer code,
  re-hashes the ten-entry source lock, independently enumerates the inclusive
  prime powers, reconstructs every exact model, and checks the factorial,
  Legendre-conditioning, interval-union, and Chebyshev-tail formulas.  Both
  paths share Python `Fraction` and pinned `mpmath.iv 1.4.1`.  These artifacts
  prove no actual weighted central capture, exterior alignment, odd reserve,
  signed sector floor, equation (5.2), determinant convergence, or RH.
- `mellin_projection_soft_symbol_graph_spill/`: exact-rational
  soft-symbol, effective-tail, graph-spill, odd harmonic-short,
  edge-localization, and equal-moment opposite-load regressions, together
  with outward `mpmath.iv` probes of the logarithmic-squared Mellin cutoff,
  central graph constants, matched pole mass, exact inclusive
  pole--minus-prime cancellation, and the first-Riesz center at
  `lambda=5/2,9/2`, repeated at 80 and 160 decimal digits.  The clean-room
  verifier imports no producer code, re-hashes all 18 dependencies and four
  vendored sources, rebuilds the prime-power inventory and formulas through
  a separate expression tree, and binds the producer bytes.  Both paths
  disclose their shared Python `Fraction` and pinned `mpmath.iv 1.4.1`
  limitation.  No zero list or zero-series value is serialized.  These
  artifacts prove no actual central graph-spill rate, exterior alignment,
  odd reserve, signed sector floor, equation (5.2), determinant convergence,
  or RH.
- `covariance_annular_odd_subsequence/`: exact-rational minimum-tangent,
  relative-shell, gray-mass, and closed-endpoint regressions plus 35 outward
  `mpmath.iv` formula intervals at `lambda=5/2,9/2`, each repeated at 80 and
  160 decimal digits.  The clean-room verifier imports no producer code,
  re-hashes 17 dependencies and three vendored primary sources, independently
  enumerates every prime power through `n<=lambda^2`, reconstructs the
  central Fourier tail and annular constants, and checks two differently
  assembled pole--prime identities.  No zero ordinate, API key, or environment
  secret is read or serialized.  Both paths disclose their shared Python
  `Fraction` and pinned `mpmath.iv 1.4.1` limitation.  The artifacts prove no
  prescribed-family central source ratio, exterior physical alignment,
  transverse odd Schur margin, signed sector floor, equation (5.2),
  determinant convergence, or RH.
- `residue_coframe_mixed_krylov/`: exact-rational coupled mixed-frame,
  opposite-orientation odd-Krylov, and delayed-coframe regressions plus
  outward interval reconstructions at `lambda=5/2,9/2`, each repeated at 80
  and 160 decimal digits.  The clean-room verifier imports no producer code,
  re-hashes all 24 dependencies and both primary source files, factors every
  candidate integer independently for the inclusive prime-power inventory,
  and reconstructs the exact moments, positive-`nu` gate, inverse loads,
  Schur gaps, annular rank bound, BV certificate ratio, and two independently
  assembled prime-action formulas.  Every locked prime-power jump is
  positive and collision-free in the unprojected fixture.  No zero ordinate,
  API key, or environment secret is read or serialized.  Both paths disclose
  their shared Python `Fraction` and pinned `mpmath.iv 1.4.1` limitation.
  These artifacts prove no prescribed residue-family coframe rate, effective
  mixed schedule, signed floor, finite-compression jump bound, equation
  (5.2), determinant convergence, or RH.
- `effective_mixed_endpoint_jump/`: exact-rational trace-stop/Neumann-floor,
  residue-plus-bridge coordinate, endpoint-recurrence, and Vandermonde
  fixtures plus outward high-label and odd-jump band intervals at
  `lambda=5/2,9/2`, each repeated at 80 and 160 decimal digits.  The
  clean-room verifier imports no producer module, re-hashes all 18
  dependencies and both primary source files, factors the inclusive
  prime-power inventory independently, retains the common `(-1)^k` Fourier
  phase, and reconstructs every exact and interval formula.  No API key,
  environment secret, zero ordinate, cached matrix, or binary64 parameter is
  read.  Both paths disclose their shared Python `Fraction` and pinned
  `mpmath.iv 1.4.1` limitation.  The rational residual trace and variation
  data are theorem regressions, not an executed actual-prolate stopping run.
  These artifacts prove no useful asymptotic prefix cost, prescribed residue
  coframe, positive odd moment gate, transverse or signed floor, equation
  (5.2), determinant convergence, or RH.
- `explicit_mixed_prefix_cost/`: exact rational target dimensions, rational
  ground-integral endpoint, and 15 outward interval reconstructions of the
  complete unsigned terminal-count formula at `lambda=5/2,9/2`, each at 80
  and 160 digits.  The independent verifier rebuilds `N=ceil(lambda^2)`,
  both inversion-sector dimensions, `Gamma`, `B`, `rho`, `R`, `M`, and the
  simpler degree-18 majorant without importing producer code.  The resulting
  labels are a priori upper bounds, not executed prolate trace stops or
  signed comparisons.
- `effective_mixed_signed_quotient/`: exact-rational normalized-quotient,
  characteristic-polynomial, physical-versus-source-pencil, defect-metric,
  high-tail, and bridge-collapse fixtures, together with outward
  Vandermonde-node checks at `lambda=5/2,9/2` and doubled precision.  The
  artifacts verify identities and countermodels; they do not assign a sign
  to the physical Weil matrix.
- `odd_nu_transverse_sign/`: exact-rational third-moment, conforming-floor,
  jump-compatible sign, invisible-direction, and inverse-load fixtures plus
  outward logarithmic-tail sums at `lambda=5/2,9/2` and 80/160 digits.  The
  replay distinguishes a positive `nu` gate from a transverse floor and an
  inverse-load pass.  No actual unbounded odd sign or uniform cutoff is
  claimed.
- `pnt_discrepancy_normal_form/`: direct source and independently assembled
  weighted-PNT-discrepancy normal forms at `lambda=2,N=2`, repeated at 80 and
  160 decimal digits.  The producer preserves the pole, archimedean, prime,
  continuous-main, tail, signed-discrepancy, and combined residual matrices
  before absolute values.  The clean-room verifier factors candidate
  integers independently, uses a distinct translation kernel, integrates the
  pole directly, and reconstructs the unsplit archimedean distribution.
  Both paths share `mpmath` and are point-valued.
- `p0_ball_pilots/lambda2_N4/`: two independently assembled raw finite Weil
  matrices at 256 and 512 bits, plus exact-decimal interval replays of the
  natural-even minors.  The replays recompute entrywise overlap without
  trusting printed booleans and enclose an all-off-diagonal order-two minor
  strictly below zero while a principal order-two minor is strictly above
  zero.  The checkpoint-0.54 exact-decimal replay also reconstructs a declared
  rational even state and certifies failure of its odd Schur gate at both the
  raw Rayleigh shift and the mandatory two-vector Ritz shift.  That state is
  not the projected prolate state.  Both matrix paths share FLINT/Arb; these
  are finite route obstructions, not asymptotic matrix theorems.
- `boundary_discrepancy_convolution/`: source-parameter reconstructions of the
  checkpoint-0.52 weak boundary identity at `lambda=2,N=2`, repeated at 80
  and 160 decimal digits.  The producer uses the split source formulas and a
  direct prime-breakpoint integral of the combined signed function
  `F=D-H_0`.  The clean-room verifier factors `{2,3,4}`, assembles the unsplit
  archimedean source matrix, independently diagonalizes the even block, and
  evaluates the same convolution by atom tails and a Fubini interchange.
  Signed residuals are retained before absolute values.  Both paths share
  `mpmath` and `eigsy`; these finite point diagnostics prove no uniform
  one-sided localization, complementary gap, equation (5.2), or determinant
  convergence.
- `live_prolate_krylov_schur_audit/`: a compact hash-pinned replay summary for
  the actual projected-prolate `lambda=2,N=3,4` states.  The verifier ignores
  cached eigenvalues, residual-gap fields, and pass booleans, reconstructs the
  state from decimal Fourier coefficients, replays the Krylov bases and both
  shifted solves, and at `N=4` uses the midpoint of the four-way intersection
  of the existing producer/verifier 256/512-bit Arb matrix balls.  The
  `N=3` three-vector shift changes the point Schur short from negative to
  positive before cyclic closure; the `N=4` raw `q` gate is already positive.
  The state producer and replay both use `mpmath`; this historical replay
  does not consume the later checkpoint-0.56 state balls, so its
  higher-Krylov, inverse-load, and weighted-solve values remain point
  diagnostics.  The directory has its own `SHA256SUMS`; it contains no
  secret, zero table, or asymptotic claim.
- `p0_prolate_state_ball/`: source-oriented `lambda=2` infinite-Jacobi state
  enclosures and projected coefficient balls for `N=3,4`, produced and
  independently replayed at 256/512 bits.  A downstream verifier intersects
  all four state and all four Weil-matrix outputs, encloses raw `q` and the
  residual, and proves only a positive `N=4` odd-floor-minus-`q` margin by
  interval LDL.  Unit normalization is rejected.  Both state paths share
  FLINT/Arb; no full complementary minimum, projection-error rate, schedule,
  or asymptotic result is claimed.
- `variable_lambda_prolate_state_ball/`: exact-parameter
  `lambda=5/2,N=3,M=79,K=85` infinite-Jacobi source-state and projection-error
  balls at 256/512 bits.  The producer uses recurrence/real-antiderivative
  formulas and the replay uses differential-form/complex-antiderivative
  formulas; both certify the continued-fraction width against a lower
  endpoint of `c^2`, retain all arithmetic indices through
  `floor(lambda^2)=6`, reject unit normalization, and share FLINT/Arb 3.6.0.
  The serialized allocation guard `floor(lambda^2)<=10000` makes this a
  finite variable-input implementation, not an unbounded schedule or a
  shifted-Weil/determinant result.
- `residual_ridged_fixed_window/`: actual-source point diagnostics at exact
  `lambda=2,N=4,T=1`, repeated at 40 and 80 decimal digits.  The producer
  rebuilds the complete pole-minus-archimedean-minus-prime Weil matrix, the
  source-normalized evenized projected prolate state, and `K_T` by direct
  evaluation-vector quadrature.  The standalone replay imports no producer
  code, rebuilds the matrix and state through independent formula paths, and
  assembles `K_T` from closed Si/Ci antiderivatives.  It reconstructs both
  raw-`q` sector gaps, the residual ridge, complete rank-one physical Schur
  splice, structural defects, and every serialized derived scalar.  Strict
  parsing rejects binary64 parameters, omitted prime powers, convention or
  normalization changes, nonpositive gaps, stale hashes, and unchecked
  diagnostic promotion.  Both paths share `mpmath`; the values are neither
  interval enclosures nor evidence of an unbounded soft-trace rate.
- `checkpoint063_moment_angle_constrained_ground/`: actual-source point
  diagnostics at exact `lambda=2,N=4`, repeated at 40 and 80 decimal digits.
  The producer rebuilds the pole-minus-archimedean-minus-prime matrix, the
  source-normalized prolate state, projected physical moments, projected
  hyperbolic pole vectors, regularized moment floors, sampled principal-angle
  profile, constrained ground, and labelled load reserve.  The standalone
  replay imports no producer code and uses separate source/state formula
  trees, closed moment and pole-vector formulas, and an analytic removable
  limit after a transformed archimedean quadrature.  Both paths hash the two
  vendored CCM PDFs and share `mpmath` transcendental arithmetic and `eigsy`.
  The constrained-ground trial is an existential identity check, not a
  constructive asymptotic trial.  These files do not compute the
  covariance-weighted `Theta` profile, direct `Phi` profile, transverse Xi
  radical energy, or `r/epsilon`; they are neither interval enclosures nor
  evidence of an unbounded rate or load orientation.
- `checkpoint064_reciprocal_secant/`: source-pinned point diagnostics at exact
  `lambda=2,N=4,T=1`, repeated at 40 and 80 decimal digits.  The producer
  reconstructs the combined Weil matrix, fixed 30-mode source-normalized
  prolate Galerkin anchor, direct-quadrature `K_T`, projected limiting anchor,
  secant geometry, reciprocal trace, crowding reserve, and spectral-tail
  profile.  The standalone replay imports no producer code and uses the
  independent source/prolate formula trees, closed Si/Ci time-band formulas,
  and incomplete-gamma segment integrals.  Both paths validate immutable
  hashes for the source lock, normalization audit, and vendored PDFs and
  reject binary64/nonfinite inputs, normalization replacement, omitted prime
  powers, convention changes, cached pass booleans, and nonpositive gaps.
  The fixed prolate truncation has no tail enclosure, the Gaussian-tail
  expressions are nondirected point values, and both paths share `mpmath`;
  these files prove no unbounded reciprocal reserve, asymptotic ratio,
  equation (5.2), or determinant limit.
- `checkpoint065_shorted_secant/`: source-pinned graph-shorted point
  diagnostics at exact `lambda=2,N=4,T=1`, repeated at 40 and 80 decimal
  digits.  The producer rebuilds checkpoint-0.64 source objects live and
  evaluates the regularized and unregularized one-step Feshbach splits,
  shorted determinant identities, graph-load vector identity, and sharp
  reserve envelope.  The standalone replay imports no checkpoint-0.65
  producer code and reconstructs the source matrix, prolate state,
  fixed-window operator, and limiting state through the independent
  source/differential-prolate/Si-Ci/incomplete-gamma paths before performing
  fresh Schur solves.  Both paths share `mpmath` and the same unenclosed
  30-mode prolate truncation.  The artifacts are point diagnostics, not an
  interval enclosure, unbounded shorted-energy or deflated-bulk estimate,
  equation (5.2), or determinant limit.
- `checkpoint066_finite_increment_response/`: source-pinned even-block
  finite-increment diagnostics at exact `lambda=2,N=4,T=1`, repeated at 40
  and 80 decimal digits.  The producer rebuilds the checkpoint-0.64 live
  source objects and computes fresh direct determinants; the standalone
  replay imports no checkpoint-0.66 producer, rebuilds through the
  independent source/differential-prolate/Si-Ci/incomplete-gamma path, and
  computes log determinants from fresh symmetric eigenvalues.  It verifies
  `F=G+J`, the graph/bulk trace split, the sharp positive-increment bounds,
  exact normalization rejection, both finite shifted-sector gaps, and direct
  theorem dependency hashes.  The raw-`q` row has coefficient one.  For the
  Ritz-`u` row, checkpoint 0.67 supplies the mandatory
  `A_R((q-u)/r)` multiplier which repairs localized ground transfer while
  retaining the extra `q-u` term.  The artifacts do not replay the
  separate source factors `det O_s,m_s,sigma_s,delta_s`, provide no interval
  enclosure or prolate-tail bound, and prove no unbounded response rate,
  equation (5.2), or determinant limit.
- `checkpoint067_ritz_moment_transfer/`: source-pinned Ritz-moment transfer
  diagnostics at exact `lambda=2,N=4,T=1`, repeated at 40 and 80 decimal
  digits.  The producer rebuilds the checkpoint-0.64 live source objects;
  the standalone replay imports no checkpoint-0.67 producer and reconstructs
  the source matrix, differential-form prolate state, closed-Si/Ci time-band
  operator, and limiting state through the independent checkpoint-0.64 path.
  Both paths recompute the exact two-vector Ritz moment, the explicit
  `A_R((q-u)/r)` multiplier, the finite true-ground diagnostic, the
  residual-ridged Loewner gate, fixed-window and identity log-determinant
  observations, and the disjoint-endpoint unrestricted spectral envelope.
  They reject coefficient one, non-Ritz lower shifts, binary64 inputs,
  normalization replacement, missing prime powers, nonpositive sector
  signs, and repaired-hash numeric tampering.  Both use the same unenclosed
  30-mode prolate space and share `mpmath`; the outputs are point values, not
  interval or ball enclosures, and prove no unbounded weighted response,
  equation (5.2), locally uniform determinant convergence, or RH.
- `checkpoint068_ritz_projective_low_mode/`: source-pinned projective
  low-mode determinant diagnostics at exact `lambda=2,N=4,M=2,theta=1`,
  repeated at 40 and 80 decimal digits.  The producer rebuilds the complete
  checkpoint-0.64 source matrix and source-normalized prolate state live; the
  standalone replay imports no checkpoint-0.68 producer and reconstructs the
  source, state, lower two-vector Ritz shift, full ambient centered Fourier
  projector, parity blocks, ground graph, and determinant factors through
  the independent checkpoint-0.64 path.  Both paths check the squared
  low-mode identity, the `A_R(d/r)` trace/log-determinant transfer, positive
  shifted even and odd sectors, and the full `Q+t Pi_M` source-Cauchy
  factorization at `t=0,theta*r`, including odd, anchor, and cross terms.
  They also serialize the exact three-term compact-transform error split,
  but do not infer an asymptotic rate from this finite point.  The fixed
  30-mode prolate tail is unenclosed and both paths share `mpmath`; the files
  are not interval or ball enclosures and prove no equation (5.2), locally
  uniform determinant convergence, or RH.
- `checkpoint069_ground_projective_response/`: source-pinned singular
  ground-projective response diagnostics at exact `lambda=2,N=4,M=2`,
  repeated at 40 and 80 decimal digits.  The producer rebuilds the complete
  checkpoint-0.64 source and source-normalized prolate state live.  The
  standalone replay imports no checkpoint-0.69 producer, rebuilds the source
  through the independent path, locates the ground by determinant/inertia
  bisection, and reconstructs the ground and adjugate from direct minors.
  Both paths check the combined mixed-minor formula for `E_M`, the corrected
  high-cross sign in the singular unbordered response, the odd source
  cofactor normalization, two positive bordered gauges, the finite-secant
  bounds with the full spectral cap retained, and the exact even/odd
  Ritz-shifted Schur gates.  The fixed 30-mode prolate tail is unenclosed,
  literal cofactors can be ill-conditioned outside this small pilot, and
  both paths share `mpmath`; the files are point diagnostics and prove no
  unbounded response rate, schedule-wide sign, equation (5.2), locally
  uniform convergence, or RH.
- `checkpoint070_natural_cutoff_ground_alignment/`: source-pinned natural-
  cutoff alignment diagnostics at exact `lambda=2,N=8,M=2`, repeated at 40
  and 80 decimal digits with a 60-dimensional even Legendre prolate
  truncation.  The producer rebuilds direct and split finite Weil matrices,
  the complete weighted-PNT-discrepancy normal form, the source-normalized
  anchor, exact-`u` Ritz geometry, true finite ground, common-inverse signed
  response, and literal adjugate.  The standalone replay imports no
  checkpoint-0.70 producer and independently reconstructs the source,
  differential-prolate state, prime-power discrepancy operator, ground by
  inertia/direct-minor methods, and cofactors.  Both paths retain
  `A_tail-T_D` before the common solve and serialize the much larger separate
  response norms and their signed cross term.  The fixed prolate truncation
  is unenclosed and both paths share `mpmath`; the files are finite point
  diagnostics and prove no unbounded alignment rate, schedule-wide sign,
  equation (5.2), locally uniform convergence, or RH.

The replay script regenerates the binding pilots at doubled precision and the
selected delicate schedule replay. File hashes are recorded in
`ARTIFACT_MANIFEST.sha256` after replay.
