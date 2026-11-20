# Codex prompt: Xi prolate--Weil bridge, proof item zero

You are working on a direct analytic Riemann-hypothesis research project.  Do
not work on the de Bruijn--Newman upper-bound campaign in this run.

Read `README.md`, `DIRECT_RH_ATTACK.md`, `PROOF_OBLIGATION_LEDGER.md`,
`FALSE_SHORTCUTS.md`, `SOURCES.md`, and `P0_SOURCE_LOCK.json` completely
before editing.

For work beyond the finite P0 replay, also read `P1_SOURCE_LOCK.json`,
`P2_SOURCE_LOCK.json`, `P3_SOURCE_LOCK.json`,
`PROLATE_DEFECT_SOURCE_LOCK.json`,
`COMPRESSED_MULTIPLIER_TRACE_SOURCE_LOCK.json`,
`SIGNED_QUOTIENT_CAPTURE_SOURCE_LOCK.json`,
`DEFECT_RELATIVE_PROJECTION_SOURCE_LOCK.json`,
`ZERO_SAMPLING_SOURCE_LOCK.json`,
`COMPACT_ABSOLUTE_SAMPLING_SOURCE_LOCK.json`,
`notes/CHEBYSHEV_ERROR_REWRITE.md`, `notes/GROWING_WINDOW_THEOREM.md`,
`notes/PROLATE_TAIL_ENVELOPE.md`,
`notes/NEAR_SIGNED_HANKEL_REDUCTION.md`,
`notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md`,
`notes/HIGH_FOURIER_COERCIVITY.md`,
`notes/COMPACT_PROJECTION_WEIL_BOUND.md`,
`notes/OUTER_PROJECTION_RADICAL_REDUCTION.md`,
`notes/OUTER_OUTER_ENDPOINT_OBSTRUCTION.md`,
`notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md`,
`notes/OUTER_OUTER_SPECTRAL_THEOREM.md`,
`notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md`,
`notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md`,
`notes/PHASE_VOLUME_SCALE_AUDIT.md`,
`notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md`,
`notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md`, and
`notes/DETERMINANT_LIMIT_AUDIT.md` completely before using their conclusions.

## Claim discipline

The repository contains no RH proof.  Numerical agreement is not a theorem.
Never emit `RH_PROVED`, `CERTIFIED`, or a new Lambda bound.  Allowed terminal
states are `P0_EXACT_FORMULAS_PASS`, `P0_DIAGNOSTIC_PASS`, `P0_UNRESOLVED`,
and `P0_INVALIDATED`.

The current locked-source audit state is `P0_INVALIDATED`.  Preserve that
state: the documented scalar/formula repairs permit diagnostics without
turning the pinned printed source into an exact-formulas pass.

## Proof item zero

Build a source-pinned, independently checked implementation of the exact
finite Weil matrix and the prolate comparison state.  The output of this run
is the first honest residual--gap scaling dataset and a symbolic residual
decomposition; it is not the asymptotic proof.

1. Pin exact source versions and formulas for every entry of
   `Q_(lambda,N)`.  Record the Fourier/Mellin convention, logarithmic interval,
   pole term, archimedean term, finite von Mangoldt sum, and inversion
   involution.  Preserve the minus sign on the prime block in source equation
   (3.19).  If any required constant is left as an unspecified `O(1)` in
   a finite formula, stop unresolved.

2. Re-derive the matrix from the source.  Do not copy stored matrices,
   eigenvalues, eigenvectors, or zero tables from a diagnostic preprint.
   Verify Hermitian symmetry and commutation with inversion symbolically and
   numerically.

3. Implement the source-normalized prolate functions `h_(0,lambda)` and
   `h_(4,lambda)`, their zero-integral combination `h_lambda` with scalar
   fixed by the source limit `h_lambda->h`, and the arithmetic transform
   `k_lambda=E(h_lambda)`.  Use the source domain `[-lambda,lambda]`, Lebesgue
   measure, and zero-extension convention.  Do not assume it is inversion even.  Form
   `k_lambda^+=(k_lambda+Jk_lambda)/2` and project that state into `E_N`.
   Prove that its transform tends to Xi by evenness.  Serialize all
   normalizations.

4. For deterministic small pilot pairs `(lambda,N)`, compute with arbitrary
   precision:

   - `q=<kappa,Q kappa>`;
   - residual `r=||(Q-q)kappa||`;
   - the exact complementary minimum
     `Delta=min_(v perpendicular kappa) <v,Qv>-q`;
   - inversion-even and inversion-odd sector gaps;
   - the two-dimensional Ritz upper value `u`, shifted gaps
     `Gamma=alpha-u` and `omega-u`, and the scalar fallback `r/Gamma`;
   - the weighted resolvent diagnostic
     `tau=||(A-uI)^(-1)(Q-q)kappa||` and the phase-aligned chordal bound
     `D(tau)=sqrt(2-2/sqrt(1+tau^2))`;
   - deterministic low/high prolate-window blocks, the complete anisotropic
     Schur lower matrix `S_0=A-C^*C/G`, and the forced-resolvent bound
     `T_AS`; never replace failure of `S_0` by failure of only the weaker
     scalar `lambda_min(A)-||C||^2/G`;
   - the source boundary-normalization hypotheses and, optionally, the
     stronger generic boundary reserves using both `D(tau)` with the full
     functional norm and `tau` with its projection to the even complement;
   - the projection error.

   Include a mandatory normalization regression showing that replacing the
   source normalization of `h_lambda` by unit norm changes the limiting scalar
   and is rejected.

   These values are diagnostics.  Repeat at doubled precision and with an
   independent matrix assembly path.

5. Preserve the combined residual before absolute values.  Produce a
   symbolic decomposition showing how the pole, archimedean, and prime
   blocks cancel on the prolate state.  Also report the much larger separate
   block norms so later work can see where a triangle inequality loses the
   effect.

6. Test candidate diagonal schedules `N=N(lambda)` without optimizing cost.
   Preserve the legacy `r/Delta` and scalar fallback `r/Gamma`, but do not use
   either as the operative weighted quantity when a shifted solve is
   available.  Retain the requested finite exponent fits for `r/Delta` and
   projection error, and record the point diagnostics `tau` and `D(tau)`.
   Estimate any exponent only when enough passing points exist, always with
   uncertainty, local slopes, and no extrapolated theorem claim.  A
   nonmonotone, growing, or mixed-sign fit must be reported as such.

   The operative mathematical target is equation (5.2) of
   `DIRECT_RH_ATTACK.md`: on an explicit unbounded schedule, prove strict
   sector comparisons, construct rigorous shifted-solve upper bounds
   `T_j>=tau_j`, set `d_j=D(T_j)`, and prove

   `sqrt(log(lambda_j))*lambda_j^eta *
    (e_j+||P_(N_j)k_(lambda_j)^+||*d_j) -> 0`

   for every fixed `eta<1/2`.  Exact high-precision point values of `tau_j`
   are diagnostics, not substitutes for interval bounds `T_j` or a uniform
   sequence estimate.  The projection term is already
   `O(lambda^(-1/2))` on every fixed `N=C*ceil(lambda^2)` by
   `notes/PROJECTION_RATE_THEOREM.md`; do not redo it unless strengthening its
   effective prolate constant.  Retain `D(T_j)<=T_j` and a certified scalar
   `r/Gamma` only as conservative fallbacks.

   The current finite pilot shows that retaining `C^*C` is essential: both
   scalar Schur bounds are negative at `(2,8)`, while both matrix lower
   models are positive.  At `(2.25,12)` the same fixed two-window models fail,
   while growing the source-defined low basis through the Shannon index
   `4*lambda^2` restores point positivity.  The next analytic target is a
   uniform signed comparison of the complete shifted correlations with the
   source additive prolate concentration Gram.  Use the exact combined kernel
   `G(x)=exp(x)-psi_C(exp(x))-(1/2)log(1-exp(-2x))` from
   `notes/CHEBYSHEV_ERROR_REWRITE.md`; never split its pole, archimedean, and
   minus-prime pieces before absolute values.  The exact growing source Gram
   and the pinned `O(log(lambda))` KRD transition buffer are already in
   `notes/GROWING_WINDOW_THEOREM.md`.  Slepian's qualitative fixed-index
   asymptotic is now vendored and source-locked, but it gives no effective
   threshold, growing-index uniformity, or signed Weil floor.  The
   source-Cauchy high compression is coercive with bounded low--high coupling
   by `notes/HIGH_FOURIER_COERCIVITY.md`; this does not determine the sign of
   the finite low compression.  What remains is physical-map conditioning,
   effective leading-defect lower scales, low-sector signed floors, and
   forcing orientation.  The far-prime component is closed by the explicit
   uniform envelope in
   `notes/PROLATE_TAIL_ENVELOPE.md`; do not silently promote that component
   theorem to a complete residual estimate.  The locked half-integer
   exponential schedule in `notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md`
   gives ordinary and log-weighted projection tails at the leading-defect
   scale, and `notes/COMPACT_PROJECTION_WEIL_BOUND.md` closes the pure P--P
   signed correlation.  `notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` closes
   both O--P and P--O orientations on that schedule for the actual corrected,
   source-normalized combined `0/4` state.  Preserve the order of the proof:
   apply the two-sided radical identity to the combined state before using
   labelwise coefficient estimates.  Never reinterpret this as an
   individual-mode radical statement or as a generic multiplier theorem for
   arbitrary outer `L2` states.  The physical outer profile has a
   defect-relative `L2` bound and an exact all-range correlation, but
   `notes/OUTER_OUTER_ENDPOINT_OBSTRUCTION.md` proves that its hard endpoint
   invalidates the proposed `H1`/bounded-variation shortcut.  The replacement
   weighted translation theorem and the exact MTY/HSW/PT source-locked
   sampling/domain passage now prove
   `|W_Z(O_lambda,O_lambda)|/d_8 -> 0`; all four remainder pairings therefore
   give the unnormalized scalar Ritz energy `q_lambda(p,p)=o(d_8)` on the
   locked schedule.  Do not promote this quadratic-energy theorem to control
   of `(Q-q)kappa`, either signed sector floor, the shifted resolvent, equation
   (5.2), or determinant convergence.  Use the graph-dual identity in
   `notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md`.  The source-pinned compact-BV
   theorem gives the older actual complete-remainder baseline
   `||R||_Z^2=O(lambda^7*d_4)`.  The hybrid complete-series theorem in
   `notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md` now sharpens this to
   `||R||_Z^2=o(d_6)` on the locked exponential schedule, closing only the
   common normalization-free scalar-shift scale obstruction.  The projected-
   state norm theorem now proves `a->||E(h)(exp(.))||_2>0`, so together they
   give `U_Z=||R||_Z^2/a^2=o(d_6)`.  The source-locked transition and growing
   sampling theorems now supply the defect-relative within-block Loewner
   constants `C_8=O(lambda*polylog(lambda))` and
   `C_rest=O(lambda^3*polylog(lambda))`, including the compact projection and
   every within-block sampling cross term.  The split-block quotient theorem
   now combines these with finite physical synthesis factors and cross-block
   orientation to prove the low action
   `O(lambda^3*polylog(lambda)/d_8)`.  The next residual target is the physical
   complement and the full shifted signed comparison.  Do not transfer the
   Fourier-high floor to `K_low^perp`; the exact three-dimensional
   counterexample in `notes/BLOCK_QUOTIENT_ACTION_THEOREM.md` forbids that
   shortcut.  The older uniform growing-window
   Bessel/reciprocal-sum route remains an unproved sufficient alternative.
   The exact radical counterexample proves that
   scalar polarization cannot by itself supply this input.  The continuous physical
   parity maps are qualitatively injective on the half-integer schedule by
   `notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md`; the remaining quantitative
   target is its normalized Gram determinant/row-minor lower bound, not bare
   finite rank.  The exact parity-multiplier/Schur reduction confines the
   unresolved sign to a phase-volume dangerous space,
   but `notes/PHASE_VOLUME_SCALE_AUDIT.md` proves a finite-orbit
   moment-length obstruction and retains only an `exp(O(lambda))` global
   upper bound; its polynomial target is neither proved nor disproved.  The
   odd pole has a one-dimensional dangerous-span alternative.  The admitted
   self-contained finite-compression theorem gives an `O(lambda^2)`
   dangerous-rank scale only when `N` is comparable to `lambda^2`; do not
   turn rank into physical capture, and do not transfer that scale to the
   separate exponential projection schedule.  The next exact inputs are the
   dangerous-space capture angle, the signed low comparison against the same
   quotient metric, and the quotient-relative cross action.  Use
   `notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md`: work with the exact
   source-coordinate compression `P_0A^*QA P_0`, the cross
   `P_HQWD^(-1/2)`, and multiplier-weighted capture traces or moments.  The
   scalar shift cancels from the cross and has already negligible quotient
   erosion.  A matched-bandwidth full-row co-frame is an admissible
   alternative only after proving the projected anchor is nonzero and the
   quantitative row lower bound.  Rank, positive sampling, conditioning, and
   positive diagonal blocks have exact counterexamples and are not substitutes.
   The optimized successor
   `notes/LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR.md` identifies the best
   trace-leverage floor with the lower-one trimmed mean and reduces the high
   target to `ell_b>2*sqrt(M_H)+c_-`, or to the higher-moment norm condition
   `A_(2k,H)^(1/(2k))+2*P_(2k,H)^(1/(2k))+c_-<g`.  The final surcharge may
   be set to zero only if the odd pole has already been absorbed into a
   separately certified block.
   It also gives the exact oriented feature resolvent and Neumann tail.  Use
   those formulas rather than treating the trace condition as necessary.
   Its explicit Möbius right inverse proves only that some non-effective
   all-even prolate prefix spans each fixed finite parity space; it mixes the
   two residue classes modulo four and does not prove either prescribed
   buffered coframe.  The remaining quantitative coframe object is the
   normalized adjoint-source tail `L_F`, not a raw determinant magnitude.
   Do not
   treat CG/GMRES convergence for `HX=C` as a sign proof: every resulting
   lower model still
   satisfies `S_0<=S`.  The four passing `N=3*ceil(lambda^2)` points and their
   exploratory exponent fit are schedule reconnaissance only.  A finite
   point success is not an asymptotic theorem.  The finite determinant and
   scale-free rescaling identities are audited in
   `notes/DETERMINANT_LIMIT_AUDIT.md`; neither they nor real-axis eigenvalue
   agreement substitutes for the still-open locally uniform limit after
   equation (5.2).

7. Write two code paths.  The verifier must reconstruct formulas and
   transcendental values from source parameters rather than trusting producer
   booleans or cached matrices.  Evaluate the weighted resolvent through
   genuinely different linear-algebra routes (for example, producer spectral
   decomposition and verifier direct LU solve), and compare `tau`, `D(tau)`,
   the shifted gaps, and solve residuals.  If both share the same arithmetic
   library, state that limitation.  A future finite certificate must replace
   the point solve with an outward-rounded verified solve and residual
   correction; an unbounded-sequence proof remains a separate obligation.

## Required deliverables

- `P0_SOURCE_LOCK.json`
- `P0_NORMALIZATION_AUDIT.md`
- `P0_MATRIX_FORMULAS.md`
- `P0_RESIDUAL_DECOMPOSITION.md`
- `P0_STATUS.json`
- `src/` producer
- `verifier/` independent assembly/replay path
- `tests/` including adversarial normalization tests
- `artifacts/` with exact inputs, precision, hashes, and raw interval or ball
  outputs
- `replay.sh`

## Mandatory failure tests

Reject a run when it uses an assumed list of real zeta zeros, assumes global
Weil positivity, omits a prime power `n<=lambda^2`, changes Fourier sign,
mixes `lambda` with `lambda^2`, drops inversion reflection, reads decimal
parameters through binary64, reports a nonpositive complementary gap as a
pass, or substitutes real-axis eigenvalue agreement for locally uniform
determinant convergence.

Begin with the source lock and normalization audit.  Do not start a large
sweep until two independently assembled pilot matrices agree entrywise to
certified precision.
