# Proof-obligation ledger

Checked items below include finite source, normalization, and linear-algebra
obligations together with narrowly scoped analytic component theorems.  No
checked item supplies the complete unbounded-sequence bridge needed for RH.

## P0 -- exact source normalization

- [x] Pin the exact version of the Connes--Consani--Moscovici formulas.
- [x] Reproduce every entry of `Q_(lambda,N)` from the pole,
  archimedean, and finite prime-power blocks.
- [x] Verify the unitary map between multiplicative and logarithmic
  coordinates, the Fourier convention, and the inversion matrix.
- [x] Prove that inversion is a self-adjoint unitary involution and that it
  commutes with `Q_(lambda,N)` and `P_N`.
- [x] Reproduce the determinant theorem without importing numerical floors or
  assuming Weil positivity.  The source-pinned derivation records the exact
  Cauchy commutator, mandatory lowest-eigenvalue shift, quotient Hilbert
  metric, spectral cut, determinant phase, and real-zero factorization; see
  `notes/DETERMINANT_LIMIT_AUDIT.md`.

## P1 -- prolate state

- [x] Implement finite Galerkin diagnostics for `h_(0,lambda)` and
  `h_(4,lambda)` in the source
  normalization.
- [x] Construct the zero-integral combination `h_lambda`, fix its scalar by
  `h_lambda->h` in the source normalization, and form
  `k_lambda=E(h_lambda)`.
- [x] Form the evenized diagnostic state
  `k_lambda^+=(k_lambda+Jk_lambda)/2` rather
  than assuming finite-`lambda` inversion symmetry.
- [x] Recheck the source normalization: the locked formulas give
  `widehat{k_lambda}->Xi/4`, not the printed `Xi`; record the explicit final
  factor-four repair in `P0_SOURCE_ERRATA.md`.
- [x] Prove the exact finite Fourier projection inequality and, using pinned
  Lemma 7.2, the qualitative rate
  `e_(lambda,N)=O(lambda^(-1/2))` for every fixed
  `N=C*ceil(lambda^2)`.  The proof retains the omitted limiting-Hermite
  lattice tail and gives `C_K<6.006`; an effective interval constant for
  `delta_lambda` remains open.
- [x] Verify algebraically that `P_N k_lambda^+` is inversion even and that
  the evenized unprojected transform retains the locked `Xi/4` limit, with
  the explicit final factor-four repair.
- [x] Pin the unconditional global `Ran(E)` radical sources and their exact
  additive/multiplicative Fourier conventions in `P1_SOURCE_LOCK.json`.
- [x] Prove the bounded-variation Mellin extension needed for zero-extended
  finite prolate functions; no endpoint Poisson assertion is imported.
- [x] Enforce `f(0)=integral(f)=0` with the explicit invisible bump supported
  below `1/lambda`, proving that `E(f)` and the locked source state agree
  pointwise throughout `[lambda^(-1),lambda]` before evenization/projection.

## P2 -- residual identity

- [x] Derive the exact finite identity for `(Q-q)kappa` before applying
  absolute values.
- [x] Serialize the signed cancellation joining the pole, archimedean, and
  prime blocks in independently replayed finite pilots.
- [x] Combine the complete Rayleigh-shifted finite Weil form into the exact
  single integral against
  `G(x)=exp(x)-psi_C(exp(x))-(1/2)log(1-exp(-2x))`, with the inclusive
  prime-power endpoint, zero-origin subtraction, and minus-prime sign
  preserved.  Independently replay off-diagonal entries and a complex shifted
  form without reading a producer matrix.
- [x] Express the residual exactly as the oppositely signed correlation with
  the global radical remainder and justify the bounded-variation/far-prime
  passage.  This identity is sign-indefinite and is not a positivity estimate.
- [x] Prove an explicit source-normalized far-frequency envelope for the
  corrected labels `0,4` prolate state from the exterior prolate ODE, with the
  KRD leading-defect upper bound and invisible-bump constant fully specified.
  This closes only the far-prime correlation for polynomial schedules.
- [x] Reduce the near physical outer correlation exactly to a parity-filtered
  boundary Hankel operator and the finite projection correlation exactly to
  a Toeplitz operator.  Pin an unconditional PNT bound and derive explicit
  uniform `L1`, `L2`, and first weighted `L2` moments for the complete
  Chebyshev-error kernel.  These are absolute upper estimates, not a
  defect-relative signed comparison.
- [x] Pin the exact Egidi--Seelmann v2 source bytes and every geometric and
  Fourier-convention substitution.  On the deterministic half-integer
  schedule `N_j=2^(2400*(2j+1)^2)`, prove that the ordinary and
  logarithmically weighted projection tails of the fixed labels `0` and `4`
  are `o(sqrt(d_n))`, and transfer the estimate with its source scalar to the
  corrected `0/4` combination.
- [x] Close the source Cauchy form on the logarithmically weighted Fourier
  domain and use that continuity to prove the compact
  projection--projection signed Weil pairing is
  `o(sqrt(d_n*d_m))` for labels `0` and `4` on the locked schedule.  This is
  the pure P--P term only and uses no Weil positivity.
- [x] For the actual corrected, source-normalized combined `0/4` state, use
  the two-sided radical identity before the triangle step and the separated
  high--low Cauchy sum to prove both mixed orientations
  `W(O,P)=o(d_4)` and `W(P,O)=o(d_4)` on the locked schedule.  This is not a
  modewise radical assertion and not a generic multiplier bound on arbitrary
  outer and compact pairs.
- [x] Prove the exterior monotone-energy identity, a defect-relative `L2`
  bound for the sampled physical outer profile, and the exact all-range
  two-outer correlation.  Identify the hard-endpoint Bernoulli/Vasyunin term
  and prove that an `H1` or bounded-variation estimate for this tail is not
  available.
- [x] Prove the complete weighted translation modulus for the actual
  corrected, source-normalized and inversion-reflected outer state, retaining
  the endpoint phase factor and the invisible bump, with explicit
  `D_S(lambda)=O(lambda^7)` and `q=1`.
- [x] Pin the exact MTY v1 zero-free region, HSW v1 zero count, and PT v1
  finite-height theorem, including their unreplayed finite-computation and
  indirect database dependencies.  Combine them with the full closed-strip
  Fejer/BV domain passage to prove
  `|W_Z(O_lambda,O_lambda)|/d_8 -> 0` without a zero list, global zero
  reality, or Weil positivity.
- [x] Combine all four P/O remainder pairings in the exact radical identity
  to obtain the unnormalized locked-schedule scalar energy
  `q_lambda(p,p)=o(d_8)`.  This does not estimate `(Q-q)kappa` or imply a
  signed sector floor.
- [x] Derive the exact finite-`N` spectral-tail identity
  `QW(p_N,p_N)=W_Z(K-p_N,K-p_N)`, retaining all physical-tail/projection
  cross terms, and the corresponding weak residual functional.
- [x] Derive the exact Poisson time/frequency tail decomposition and its
  positive `L2` leakage Gram, while proving that this Gram is not the Weil
  pairing and depends on the representative modulo `ker(C_lambda E)`.
- [ ] Prove a direct relative bound between the single signed finite
  pole--archimedean--prime distribution and a locked, gauge-controlled
  positive prolate leakage model.  Do not use positivity of the spectral
  tail pairing or Weil-form Cauchy--Schwarz.
- [ ] Upgrade the now-controlled scalar quadratic energy to an action or weak
  residual estimate at the required scale.  Small `q_lambda(p,p)` for an
  indefinite form does not control `(Q-q)kappa`.
- [ ] Obtain an asymptotic formula with a rigorous remainder for
  `r_(lambda,N)`.
- [ ] Control the residual in the shifted even-complement resolvent, not only
  by its norm: prove a certified upper bound
  `T_(lambda,N) >= ||(A-U I)^(-1)b||` on a deterministic unbounded schedule.
- [ ] Prove a rate strong enough for the weighted equation (5.2) of
  `DIRECT_RH_ATTACK.md`; the scalar `r/(alpha-u)` estimate remains a valid
  fallback but is not required to be sharp.

## P3 -- complementary gap

- [x] Split the finite matrix into inversion-even and inversion-odd sectors.
- [x] Prove the finite inversion-sector residual--Ritz theorem using the even
  compression floor `alpha`, Ritz upper bound `u`, and odd floor `omega`.
- [x] Prove the finite resolvent-weighted refinement
  `||xi-kappa|| <= D(tau) <= tau <= r/(alpha-u)`, including the complex
  Hermitian and exact `r=0` branches.
- [x] Derive the conditional fail-closed shifted-solve enclosure formula from
  a rigorous Ritz upper bound `U`, complete sector-floor lower bounds, and an
  outward-rounded solve residual; this check does not assert that those
  enclosures have been obtained on an unbounded schedule.
- [x] Prove finite left-preconditioned and low/high Schur-complement criteria
  that would simultaneously establish the shifted sector signs and retain
  the residual's prolate energy weighting.
- [x] Construct a finite plus/minus prolate-window split at `(2,8)` without
  Weil eigenvectors.  Its point Schur complements recover the tiny shifted
  scales and its block solve reproduces `tau`; this is a non-certified
  structural diagnostic only.
- [x] Prove the finite anisotropic Schur lower criterion
  `S_0=A_X-g^(-1)E^*E<=A-C^*H^(-1)C` and its Euclidean forced-resolvent
  bound without using the false Loewner-to-vector-norm shortcut.  At `(2,8)`,
  the `X=0` matrix criterion succeeds in both sectors although the scalarized
  Schur bounds fail; this remains a point diagnostic.
- [x] Push the exact additive prolate concentration-defect Gram
  `C^*diag(1-chi_n^2)C` into the deterministic low physical windows and
  compare it with the point Schur matrices.  This is a positive chosen model,
  not an identity with the Weil form; bump-corrected lifts require all bump
  cross terms.
- [x] Pin the Karnik--Romberg--Davenport v2 transition estimate and prove the
  exact all-window source Gram/determinant formulas, including the actual
  plus-anchor deflation.  The explicit index
  `n_*=ceil(4*lambda^2)+6+ceil((2/pi^2)*log(200*lambda^2+25)*log(20))`
  gives `1-chi_n^2>=1/2` for all `n>=n_*`.  This is a positive additive
  source-coordinate theorem only.
- [x] Stress the deterministic `N=2*ceil(lambda^2)` schedule at intermediate
  points and enlarge the `(2.25,12)` low basis through the source prolate
  Shannon window.  The enlarged point `X=0` lower models are positive in both
  sectors, while `(2.75,16)` fails closed in the odd sector; neither result is
  interval-enclosed or asymptotic.
- [x] Recheck the fail-closed `lambda=2.75` point at larger Fourier
  bandwidth.  Both shifted sectors are positive at `N=24` and `N=32`, and
  the `N=24` result is stable under a 60-to-80 prolate-basis increase and a
  50-to-80 decimal-digit repeat.  The change with `N` remains nonmonotone and
  supplies no uniform Galerkin rule.
- [x] Test the first four points of `N=3*ceil(lambda^2)` without cost
  optimization.  All four finite sector tests pass and `tau` decreases on
  `lambda=1.75,2,2.25,2.75`; the four-point exponent fit is recorded with
  OLS-only uncertainty and explicitly barred from extrapolation.  The
  delicate `(2.25,18)` point has an independent base replay and a stable
  45-to-70-digit, 50-to-70-basis repeat.
- [x] Prove that deterministic Krylov parametrices can control only the
  negative Schur correction: `S_(0,k)<=S`.  Per-column CG/GMRES residual
  estimates do not control the full residual Gram orientation and cannot
  replace a signed source lower model.
- [x] Pin Slepian's primary fixed-index concentration asymptotic, map its
  generalized one-dimensional labels and normalization to
  `c=2*pi*lambda^2`, and derive
  `c^4*d_4/d_8 -> 105/256` together with an eventual positive `d_8` scale.
  The source gives no effective threshold, no growing-index uniformity, and
  no signed Weil floor.
- [x] Reconstruct the source Cauchy diagonal and off-diagonal coefficients on
  the infinite logarithmically weighted Fourier domain.  Prove an explicit
  coercive high-mode compression, a sufficient cutoff, and a uniform
  low--high coupling bound.  This isolates the high block only; it does not
  provide a signed floor for the finite low compression.
- [x] Reconstruct the complete real-axis multiplier with the inclusive
  prime-power endpoint and minus-prime sign, prove the opposite rank-one pole
  signs in the two parity sectors, and reduce each shifted sector to an
  explicit phase-volume dangerous space plus an exact finite Schur
  complement.  This is a reduction, not a positive floor.
- [x] Audit the phase-volume scale: prove the fixed-lambda Cesaro/Haar
  identities and the finite-orbit moment-length obstruction, and retain the
  exact source-locked finite upper bound.  That bound is only
  `exp(O(lambda))`; the desired polynomial phase-volume estimate is neither
  proved nor disproved.
- [ ] Establish either criterion for the exact combined Weil form relative to
  explicit source-normalized prolate windows growing through the Shannon
  transition index, including all coupling, forcing-orientation, and
  Galerkin errors.
- [ ] Make the correct-scale leading-defect lower bound effective and prove a
  uniform restricted-conditioning bound for the physical
  arithmetic/evenization/projection map on the growing source family.  The
  qualitative fixed-index limit and source Gram rank theorem alone do not
  imply either statement.
- [ ] Prove uniform strict bounds `alpha_L-U>0` and `omega_L-U>0` along an
  unbounded schedule.
- [ ] Prefer a low-energy prolate comparison or Schur complement over an
  unnecessarily strong global operator-norm comparison, and retain the
  spectral weighting in `(A-U I)^(-1)b` where possible.
- [ ] Keep the bound explicit and uniform on a sequence with
  `lambda_j->infinity`.

## P4 -- boundary normalization

- [x] Reproduce the exact finite source commutator argument showing
  `<delta_N,xi> != 0` for a simple even lowest eigenvector, with the mandatory
  shift `T=QW_lambda^N-epsilon_N I`; see
  `notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md`.
- [x] Record `delta_N`, its vector/function convention, and
  `||delta_N||=sqrt((2N+1)/(2 log lambda))`.
- [ ] Optionally prove either weighted generic reserve
  `|delta(kappa)| > ||delta|| D(T)` or
  `|delta(kappa)| > ||delta_K|| T`; retain `||delta|| r/Gamma` and the old
  full-complement reserve as legacy diagnostics, and do not make any generic
  reserve a prerequisite when the exact source lemma applies.
- [ ] If the literal source normalization `delta_N(xi)=1` is used in the
  limiting characteristic functions, control its conditioning uniformly.
  This is optional for the zero-set route, which may rescale each nonzero
  characteristic function explicitly and dephase it by `lambda^(iz)`; finite
  strict nonvanishing alone gives no quantitative lower bound.  The exact
  scale-invariant relation is proved in
  `notes/DETERMINANT_LIMIT_AUDIT.md`.

## P5 -- limit theorem

- [ ] Assemble the projection and chordal eigenvector errors using the exact
  Fourier--Mellin bound on every closed substrip and the certified quantity
  `D(T_j)` from weighted equation (5.2).
- [ ] Prove locally uniform convergence of normalized regularized
  characteristic functions, not merely eigenvalue or real-axis convergence.
- [ ] Apply Rouché/Hurwitz with multiplicity to conclude RH.

## Computation policy

High-precision numerics may identify the scale of the residual and gap.
Interval arithmetic may certify individual finite cases.  Neither certifies
a sequence tending to infinity without a proved uniform tail.  Every status
report must distinguish `DIAGNOSTIC`, `FINITE_INTERVAL_ENCLOSED`, and
`ANALYTIC_UNIFORM`.
