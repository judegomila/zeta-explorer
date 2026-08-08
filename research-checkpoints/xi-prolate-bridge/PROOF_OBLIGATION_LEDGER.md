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
- [x] Convert the weak residual functional into the exact graph-dual identity
  `||D^(-1)b||=a^(-1) sup_v |W_Z(v,R)|/||Dv||`, prove the
  normalization cancellation in `a*D(tau)`, and give an exact two-sided
  radical counterexample in which all four scalar P/O pairings vanish while
  the weighted residual action stays nonzero.
- [x] Derive the exact Poisson time/frequency tail decomposition and its
  positive `L2` leakage Gram, while proving that this Gram is not the Weil
  pairing and depends on the representative modulo `ker(C_lambda E)`.
- [ ] Prove a direct relative bound between the single signed finite
  pole--archimedean--prime distribution and a locked, gauge-controlled
  positive prolate leakage model.  Do not use positivity of the spectral
  tail pairing or Weil-form Cauchy--Schwarz.
- [x] Prove the first complete-remainder side of the graph-dual
  absolute-sampling theorem.  The compact-BV estimate gives the valid baseline
  `||R||_Z^2<=d_4(4*C_spec*D_S(lambda)+2*B_P(lambda))=O(lambda^7*d_4)`
  on the locked exponential schedule, without a zero list, global zero
  reality, or Weil positivity.  This bound is retained even though the hybrid
  theorem below is sharper at the odd defect scale.
- [x] Prove the complete sampled exterior-series weighted `L2` bound and
  combine it blockwise with the admitted weighted-translation estimate.  The
  exact convergent minimum series satisfies
  `B_hyb(lambda)=O(lambda^3*polylog(lambda))`; together with projection
  sampling it gives `epsilon_lambda=||R||_Z^2=o(d_6)` on the locked schedule.
  Hence the common normalization-free scalar shift is `o(d_6)`.  This
  component alone proves no graph-dual residual action, signed sector floor,
  shifted odd Schur sign, or instance of equation (5.2).
- [x] Prove the missing projected-state norm lower bound.  The locked source
  comparison, periodic Fourier tail, and an explicit two-sided Gaussian tail
  give `||P_N k_lambda^+|| -> ||E(h)(exp(.))||_2>0` whenever
  `log(lambda)/(N+1)->0`.  Thus on the locked schedule the hybrid estimate
  also gives the normalized bound `U_Z=epsilon_lambda/a^2=o(d_6)`.  The
  threshold is qualitative because the pinned `delta_lambda=O(lambda^-2)`
  has no effective constant; the result supplies no signed floor or residual
  action.
- [x] Prove the quotient exterior-preconditioner theorem.  For a possibly
  rank-deficient physical synthesis `W` and positive source defect form
  `D_ext`, the minimum-energy quotient
  `Delta=(W*D_ext^(-1)*W^*)^dagger` on `ran(W)` converts
  `W^*G_ZW<=C_ext D_ext` into
  `G_Z<=C_ext Delta` and
  `||Delta^(-1)G_ZDelta^(-1)||
  <=C_ext||W D_ext^(-1/2)||^2`.  This removes the smallest physical
  singular value from the positive-sampling action, retains all Gram cross
  terms, and is independently replayed on an exact rank-deficient model.
  It proves neither the source exterior estimate nor a signed comparison.
- [x] Quantify the strongest unconditional full-`Y` exterior-sampling
  fallback.  The exact additive-even arithmetic bound
  `||A_lambda f||^2<=(lambda^2/2)||f||^2`, the all-index floor
  `d_LS=6*96^(-5-(320*pi/log(2))*lambda^2)`, and the compact-window constant
  give `C_ext<=B_abs*lambda^2/(2*d_LS)` and
  `C_ext||W D_ext^(-1/2)||^2<=B_abs*lambda^4/(4*d_LS^2)`, with every Gram
  cross term retained and source kernels quotiented.  Exact-dyadic outward
  interval artifacts and an independent formula replay are included.  The
  two-defect-loss bound is exponentially too large and does not close even
  the relaxed `O(lambda^4*polylog(lambda)/d_8)` scale.
- [x] Audit the common Rayleigh shift against the distinct fixed-index parity
  scales for the earlier compact-BV baseline.  Exact source constants give
  `d_8/d_6~(32*pi^2/7)*lambda^4`; hence
  `epsilon_lambda=O(lambda^7*d_4)=o(d_8)` gives only
  `epsilon_lambda/d_6=O(lambda^3)`, not odd-sector smallness.  This remains a
  valid audit of that argument; the complete-series hybrid theorem above
  bypasses it.
- [x] Audit whether the source-normalized `0/4` cancellation removes that
  loss.  It cancels the origin datum, but
  `(a_0*e_0)/(a_4*e_4)~(3/(256*pi^2))*lambda^(-4)`, so the label-4 hard
  endpoint survives.  Qualitative boundedness of `a_0` improves the absolute
  estimate only to `O(lambda^5*d_4)=O(lambda*d_6)` and has no effective
  threshold.  This disproves the coefficient-only shortcut; it does not
  contradict the complete-series hybrid bound.  The endpoint cancellation
  remains false, and a signed odd floor or direct shifted odd Schur theorem
  remains required.
- [x] Complete the low split-block positive graph action.  With the deliberately
  block-diagonal metric `D_8 direct-sum D_rest`, the quotient theorem retains
  cross-block sampling orientation and the finite synthesis estimates give
  `Gamma_low=O(lambda^3*polylog(lambda)/d_8)`.  The exact replay checks both a
  nontrivial range model and the counterexample in which switching to the full
  exterior metric changes `Gamma` from `1` to `4`.  The fixed-index inputs are
  qualitative and have no effective threshold.
- [ ] Complete the physical-high and signed graph-action assembly.  The
  conditional extension is
  `Gamma<=Gamma_low+B_H/g^2`, but no usable signed comparison metric `g` is
  proved on `K_low^perp`.  Fourier-high coercivity cannot be transferred to
  that physical complement: an exact three-dimensional counterexample has
  positive physical-low and Fourier-high compressions while the physical
  complement contains a negative direction.  The direct compact-BV fallback
  pays `d_LS^(-2)`, and scalar polarization is still ruled out by the exact
  radical counterexample.
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
- [x] Prove the exact leading differential-prolate oscillation hypothesis.
  Disjoint sine packets of length `pi/c` give an exact `p^2`-dimensional
  Rayleigh quotient `c^2-1` on `lambda=p/2`, hence
  `mu_n(c)<=c^2-1<c^2` for every `0<=n<4*lambda^2`.  The independent exact
  replay reconstructs the scaled cosine moments, packet tiling, minus sign,
  and index range.  This proves no lower bound for `d_n` and no signed Weil
  floor.
- [x] Extend the defect-relative endpoint and complete sampled-tail estimates
  through the deterministic KRD transition buffer.  For every locked odd
  `p>=5`, `n<n_*` implies `mu_n(c)<3c^2`; a Liouville--Pruefer argument gives
  `|h_n(lambda)|^2<=2592*pi^2*lambda*d_n`, and the explicit complete-series
  norm and translation constants are polynomial.  The independent 80/160
  digit replay reconstructs the threshold, finite constants, intervals, and
  even-label domain without a prolate eigenvalue table or zeta-zero list.
- [x] Lift the transition estimates to the growing corrected source blocks,
  including the invisible origin correction, arbitrary plus-anchor
  deflation, both reflected tails, compact projection remainder, and every
  within-block zero-sampling cross term.  The locked Loewner theorem gives
  `C_8=O(lambda*polylog(lambda))` and
  `C_rest=O(lambda^3*polylog(lambda))` on the exponential schedule, with one
  all-index defect-floor loss in the exponentially small projection term.
  It does not identify a full cross-block exterior Gram with a block-diagonal
  quotient metric or prove a signed comparison.
- [x] Assemble the two plus blocks with an explicitly chosen block-diagonal
  quotient metric and bound the physical synthesis factors.  The retained
  squared-sum action gives
  `Gamma_low=O(lambda^3*polylog(lambda)/d_8)`, stronger than the relaxed low
  positive target.  Exact-rational replay rejects both a full-metric
  substitution and identification of the physical complement with the
  Fourier-high subspace.  No physical-high or shifted signed floor follows.
- [x] Prove the same-parity differential-eigenvalue bound
  `mu_(n+2r)(c)-mu_n(c)>=(16*r*pi/(225*K^2))*exp(-2*pi*K)`, with
  `K^2=max(1,2*c^2+(n+2r)(n+2r+1))`, from standard qualitative Sturm theory,
  the endpoint-normalized half-line Volterra equation, and lifted phase
  `phi(mu_m)=m*pi/2`.  The independent replay reconstructs the locked
  transcendental formula and exact `c=0` Legendre oracles without a numerical
  Sturm solve; the all-`c` homotopy is proof-only.  The exponentially small bound is
  not a growing-window conditioning estimate or a signed Weil-sector floor.
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
- [x] Sharpen the odd dangerous-space count by isolating the negative pole as
  one explicit span.  This gives a one-dimension alternative to the older
  pole-norm trace penalty; the better finite bound may be used, while the
  multiplier/Schur sign remains open.
- [x] Audit the phase-volume scale: prove the fixed-lambda Cesaro/Haar
  identities and the finite-orbit moment-length obstruction, and retain the
  exact source-locked finite upper bound.  That bound is only
  `exp(O(lambda))`; the desired polynomial phase-volume estimate is neither
  proved nor disproved.
- [x] Replace the unpinned Montgomery--Vaughan candidate by a self-contained
  dyadic logarithmic-Hilbert theorem.  The discrete Fourier multiplier,
  inclusive prime-power sums, pinned FKS Chebyshev constants, and exact
  finite Fourier density give an explicit `O(lambda^2 log lambda)` trace and
  `O(lambda^2)` dangerous-rank scale when `N` is comparable to `lambda^2`,
  `U=o(log(lambda^2))`, and `g=kappa log(lambda^2)`.  Independent 80/160
  digit replay reconstructs the arithmetic sums and interval constants.  The
  finite bound may be ambient-dimension-vacuous and neither captures the
  dangerous space nor signs its Schur complement.
- [x] Put the signed low comparison and quotient-relative cross action in
  exact source coordinates.  Prove scalar-shift cancellation in the cross,
  quantify the `o(lambda^(-2))` quotient erosion, derive phase-sensitive
  trace-majorant and moment capture criteria, and compute the exact
  matched-bandwidth target counts.  Independently replay exact rational
  countermodels showing that rank, conditioning, positive sampling, and
  positive diagonal blocks do not imply the missing capture/sign/reserve.
  This is a reduction and obstruction theorem, not any one of those missing
  estimates.
- [x] Prove eventual nonvanishing of the matched quadratic comparison anchor
  from the source-normalized projected-state norm limit.  Derive the exact
  physical leverage deficit, short the positive multiplier to the physical
  range, and use positivity of the negative operator to obtain an automatic
  quotient-relative cross estimate and scalar/anisotropic Schur criteria.
  Exact rational producer and clean-room replay models test the theorem and
  reject capture-to-raw-cross inference.  This supplies no effective finite
  anchor threshold and proves none of the required prolate--Weil reserves.
- [x] Optimize the trace-leverage comparison by lower-one stop-loss duality,
  identify the same trimmed mean as a direct high-space multiplier floor,
  and separate it into a central archimedean trimmed mean minus twice the
  square root of the exact prime second moment.  Factor the singular positive
  short and exact negative Schur round trips in feature space, including a
  Neumann tail.
  Prove an explicit Möbius right inverse with an invisible central-hole
  zero-integral correction and hence eventual full row span by some finite
  all-even prolate prefix at each fixed physical space.  Exact-rational
  producer/replay models reject equality, trace-as-necessity, lost
  orientation, and over-shorting.  The prefix is non-effective and mixes
  both residue classes modulo four.
- [ ] Prove, on one common unbounded schedule, both (i) a signed lower bound
  for `gI-R_KK+C_/K` against the quotient metric and (ii) the physical
  high-space margin.  For (ii), it is enough to prove the sharpened target
  `ell_b>2*sqrt(M_H)+c_-`, or a higher-moment bound
  `A_(2k,H)^(1/(2k))+2*P_(2k,H)^(1/(2k))+c_-<g`, from
  `notes/LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR.md`.  Then close the exact
  oriented feature-Schur condition or a certified Neumann truncation.  The
  total trace/rank theorem and diagonal moments alone do not determine the
  required orientation.
- [ ] Establish either criterion for the exact combined Weil form relative to
  explicit source-normalized prolate windows growing through the Shannon
  transition index, including all coupling, forcing-orientation, and
  Galerkin errors.
- [x] Prove qualitative injectivity of both continuous parity arithmetic maps
  on every finite-dimensional analytic source space along the locked
  half-integer schedule, using the unmatched `u=lambda/2` arithmetic
  breakpoint.  Prove eventual Fourier injectivity at each fixed `lambda` and
  the exact pre-parity Möbius bound `||f||<=2lambda||E(f)||` on the visible
  interval.
- [ ] For any route that explicitly orthonormalizes the growing physical
  source columns, make the correct-scale leading-defect lower bound effective
  and prove the normalized physical Gram determinant/minor inequality from
  `notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md`.  The quotient
  exterior-preconditioner route bypasses this lower determinant on the
  positive-sampling side, but still needs a full shifted signed comparison
  on the quotient physical range.  The all-even coframe theorem proves only
  fixed-space eventual span; the prescribed separate `0 mod 4` and `2 mod 4`
  buffered coframes still require a quantitative normalized adjoint-source
  tail bound.
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
