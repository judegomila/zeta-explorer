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
