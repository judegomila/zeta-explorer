# Xi Prolate--Weil Bridge

This is a direct analytic Riemann-hypothesis research lane.  It is separate
from the de Bruijn--Newman upper-bound computation.

The project starts from the finite construction of
Connes--Consani--Moscovici.  When its lowest Weil-matrix eigenvector is simple,
inversion even, and validly boundary-normalized, the resulting operator is
self-adjoint and its regularized characteristic function has only real zeros.
An explicit prolate state `k_lambda` is also known. Under the locked printed
formulas its Fourier--Mellin transform converges locally uniformly to one
quarter of the Riemann Xi function in the open critical strip; an explicit
final factor four restores Xi without changing zeros. See
`P0_SOURCE_ERRATA.md`. The missing bridge is to prove that the
ground state of the finite Weil matrix approaches an explicitly evenized
version of that prolate state quickly
enough.

The central finite result is now the inversion-sector residual--Ritz and
resolvent-weighted estimate in `DIRECT_RH_ATTACK.md`.  It treats the even
compression and odd spectral floor separately, retains the two-vector Ritz
lowering of the trial energy, and then applies the complementary resolvent to
the actual residual direction.  The resulting diagnostic

`tau=||(A-uI)^(-1)b||`

can be much smaller than the scalar fallback `r/Gamma`.  A proof would require
rigorous upper bounds `T_j>=tau_j` on an explicit unbounded schedule and the
weighted convergence condition (5.2) with `D(T_j)`.  The projection-error
term in (5.2) is now proved to be `O(lambda^(-1/2))` for every fixed schedule
`N=C*ceil(lambda^2)`; the required `T_j` bounds have not been proved.

The complete Rayleigh-shifted Weil form has also been combined exactly before
absolute values.  `notes/CHEBYSHEV_ERROR_REWRITE.md` proves that it is a
single signed integral against

`G(x)=exp(x)-psi_C(exp(x))-(1/2)log(1-exp(-2x))`.

The independent replay reconstructs the matrix from source parameters and
checks this formula without reading a producer matrix.  This is a sharper
description of the missing estimate, not a positivity result: the normalized
Chebyshev-error kernel changes sign.

Several further analytic components are now explicit.  First,
`notes/PROLATE_TAIL_ENVELOPE.md` uses the exterior prolate ODE and the pinned
KRD leading-eigenvalue estimate to prove a super-polynomial envelope for the
corrected state's far-frequency primitive; this closes the far-prime
leakage-correlation component for polynomial schedules.  Second,
`notes/NEAR_SIGNED_HANKEL_REDUCTION.md` proves that the physical outer
remainder is an exact parity-filtered boundary Hankel convolution and the
finite projection remainder is an exact Toeplitz correlation.  The pinned
PNT bound in `P3_SOURCE_LOCK.json` makes the complete-kernel moment constants
finite and explicit.

`notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md` locks every use of the
Egidi--Seelmann uncertainty estimate and proves that both the ordinary and
logarithmically weighted projection tails for the fixed labels `0` and `4`
are `o(sqrt(d_n))` on the exact half-integer schedule
`N_j=2^(2400*(2j+1)^2)`.  This is an intentionally enormous analytic
schedule, not a cost-optimized computation.

`notes/HIGH_FOURIER_COERCIVITY.md` closes the source Cauchy form on its
logarithmically weighted Fourier domain and proves an explicit coercive high
compression with uniformly bounded low--high coupling.  Combining that
continuity with the relative projection theorem,
`notes/COMPACT_PROJECTION_WEIL_BOUND.md` proves that the pure compact
projection--projection signed Weil pairing is `o(sqrt(d_n*d_m))` for the
locked labels and schedule.  This is only the P--P term; it does not provide
a signed low-sector floor.

`notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` closes the other two
projection-containing orientations on the same locked schedule.  For the
actual corrected, source-normalized combined `0/4` state, the two-sided
global radical identity and a separated `1/N` high--low Cauchy sum give
`W(O,P)=o(d_4)` and `W(P,O)=o(d_4)`.  This conclusion must not be split into
claims that the individual `0` and `4` modes are global radicals, and it is
not a generic multiplier theorem for arbitrary outer `L2` states.

The last quadratic remainder term is now closed.  The hard-endpoint
Bernoulli/Vasyunin obstruction in
`notes/OUTER_OUTER_ENDPOINT_OBSTRUCTION.md` still rules out the tempting
`H1`/bounded-variation argument, but
`notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md` proves the correct
weighted translation modulus for the actual corrected, source-normalized,
inversion-reflected state with an explicit degree-seven constant.  Combining
it with the exact MTY/HSW/PT source lock and the full closed-strip Fejer/BV
domain passage, `notes/OUTER_OUTER_SPECTRAL_THEOREM.md` proves

`|W_Z(O_lambda,O_lambda)|/d_8 -> 0`.

Together with the already closed P--P and mixed terms, the exact radical
identity then gives the unnormalized locked-schedule Ritz energy
`q_lambda(p,p)=o(d_8)`.  This is a quadratic-energy theorem only.  It does
not control `(Q-q)kappa`, prove either signed sector floor, establish the
shifted-resolvent decay in equation (5.2), or give locally uniform
determinant convergence.

`notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md` now identifies the missing
operator action exactly.  For any positive source-defined preconditioner
`D`, the weighted numerator is the graph dual

`||D^(-1)b||=||p||^(-1) sup_v |W_Z(v,R)|/||Dv||`.

An ordinary absolute zero-sampling/Bessel estimate on growing prolate windows
would therefore feed the existing resolvent theorem directly, and the factor
`||p||` cancels in the determinant-bridge error.  The same note contains an
exact two-sided-radical counterexample where every known scalar P/O pairing
vanishes but the weighted action is nonzero.  Thus scalar polarization is not
enough; the displayed sampling theorem is one explicit sufficient route, and
any alternative source-specific argument must control the same graph-dual
action by other means.

`notes/SIGNED_GRAPH_OBSERVABILITY_REDUCTION.md` isolates the exact
preconditioner-free specialization.  If the complete shifted even-complement
operator `B_+` is positive and the paired-sampling Gram satisfies
`G_+<=C_lambda*B_+^2`, then
`a^2*tau^2<=epsilon_lambda*C_lambda`.  The sufficient locked-schedule target
is `C_lambda=O(lambda^4*polylog(lambda)/d_8)`.  This is finite-dimensional
algebra already implicit in the weak-residual theorem, not a new arithmetic
estimate: positivity of `B_+` and the shifted odd block, and the displayed
graph comparison for the actual source matrix, all remain open.

`notes/LOCKED_HALF_POWER_GRAPH_SCHUR_REDUCTION.md` now places the far
boundary at the exact cutoff `R=sqrt(N)`.  The far block has floor
`4800*log(2)*lambda^2+o(lambda^2)` and the associated Schur shear is
bounded in norm by `2+o(1)`, so sign and floor transfer lose only a constant.
Its exact block inverse replaces the global graph map by a
cancellation-preserving retained map and a far map.  Neither is yet bounded
at the required scale.  A rational
two-dimensional countermodel proves that the existing quotient action, even
when supplemented by a signed Loewner comparison, can remain one power of
`lambda` too weak.

The first remainder-side estimate in that criterion is now closed.
`notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md` proves an explicit absolute
zero-sampling theorem for every real compact BV profile on the locked
logarithmic interval.  Applied to the actual projection tail, it gives
`||P_lambda||_Z^2=o(d_4)` and `o(d_8)` on the locked exponential schedule;
combined with the earlier physical-outer estimate it gives the valid baseline

`||R_lambda||_Z^2 <= d_4(4 C_spec D_S(lambda)+2 B_P(lambda)) = O(lambda^7 d_4)`.

A sharper complete-series estimate now reaches the first odd defect scale.
`notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md` retains the complete
sampled exterior series in a weighted `L2` bound and takes, on each dyadic
height block, the better of that bound and the admitted weighted-translation
bound.  It proves an exact convergent positive series `B_hyb(lambda)` with

`B_hyb(lambda)=O(lambda^3 polylog(lambda))`

and hence, after the compact projection contribution is restored,

`epsilon_lambda:=||R_lambda||_Z^2=o(d_6)`.

`HYBRID_OUTER_SAMPLING_SOURCE_LOCK.json`, the producer, and the independent
replay reconstruct the finite constants and explicit summation threshold
without a zero list, global zero-reality assumption, or Weil positivity.
The final fixed-index comparison is qualitative; no effective asymptotic
threshold is claimed.
This proves that the common normalization-free scalar shift is
`o(d_6)`.  The separate
`notes/PROJECTED_STATE_NORM_LOWER_BOUND.md` supplies the missing
normalization control: `||P_N k_lambda^+||` converges to the strictly
positive norm of the fixed source-normalized limiting state.  Hence the
normalized upper shift `U_Z=epsilon_lambda/a^2` is also `o(d_6)` on the
locked schedule.  This still does not control the graph-dual residual
action, prove an even or odd signed sector floor, prove the shifted odd Schur
complement positive, or establish equation (5.2).

The original windowwise Bessel/reciprocal-sum route is still not proved, but
its sharper source-coordinate alternative is now closed on each prescribed
split plus block.  `notes/TRANSITION_PROLATE_OUTER_THEOREM.md` replaces the
invalid endpoint monotonicity in the logarithmic KRD buffer by a uniform
Liouville--Pruefer estimate and proves explicit defect-relative endpoint,
complete-series, weighted-norm, and translation bounds for every even
`n<n_*`.  `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` then keeps the
zero-integral correction, arbitrary anchor deflation, compact projection,
both reflected tails, and every within-block zero-sampling cross term inside
one Loewner inequality.  On the locked exponential schedule its admitted
constants have the scales

`C_8=O(lambda*polylog(lambda))`,

`C_rest=O(lambda^3*polylog(lambda))`.

The producer and clean-room replay reconstruct the finite constants at 80
and 160 decimal digits without a zero list, global zero-reality assumption,
or Weil positivity.  The two formula trees share `mpmath.iv`, which is
recorded as a library limitation.

`notes/BLOCK_QUOTIENT_ACTION_THEOREM.md` now closes the corresponding low
physical action without identifying the block metric with a full cross-block
exterior Gram.  It deliberately sets `D_bd=D_8 direct-sum D_rest`, forms the
minimum-energy quotient on the actual range, and retains the cross-block
sampling orientation.  The finite synthesis estimates are

`M_8 <= lambda^2(1+rho_8^2)/(2d_8)`,

`M_rest <= 3lambda^4(5+32pi lambda^2)/(4d_12)`.

The pinned qualitative fixed-index limits then give

`Gamma_low=O(lambda^3*polylog(lambda)/d_8)`,

which is stronger than the relaxed positive target on this low range.  The
producer and clean-room replay reconstruct exact quotient counterexamples and
the finite product `d_12 M_rest` at 80 and 160 digits; the fixed-index limits
remain explicitly non-effective.  The physical high complement and both
shifted signed comparisons are still open, so neither the global action nor
equation (5.2) follows.

`notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md` now removes the lower physical
Gram determinant from this positive-sampling route.  If `D_ext` is the
positive source exterior-defect form, `W` is physical synthesis, and

`W^* G_+ W <= C_ext D_ext`,

then the minimum-source-energy quotient on `K=ran(W)` is

`Delta_K=(W D_ext^(-1) W^*)^dagger|_K`.

It satisfies

`G_+ <= C_ext Delta_K`

and

`||Delta_K^(-1) G_+ Delta_K^(-1)||
 <= C_ext ||W D_ext^(-1/2)||^2`.

Only the largest singular value occurs; source kernels are removed by the
quotient instead of being inverted.  The theorem is independently replayed
on a rank-deficient exact rational model.  By itself it does not prove the
displayed source Gram inequality or either signed comparison.  The new
relaxed positive-sampling target is the full, cross-term-preserving exterior
estimate `Y^* Z^* Z Y <= C_ext D_ext` together with
`C_ext ||W D_ext^(-1/2)||^2=O(lambda^4*polylog(lambda)/d_8)`.  A generic
compact-BV insertion still squares the bad inverse-defect factor and remains
insufficient.

`notes/FULL_EXTERIOR_SAMPLING_FALLBACK.md` now makes that generic insertion
fully source-explicit.  For additive-even sources, the exact arithmetic-map
bound is

`||A_lambda f||^2 <= (lambda^2/2)||f||^2`.

With the all-index floor
`d_LS=6*96^(-5-(320*pi/log(2))*lambda^2)`, it proves the complete,
cross-term-preserving Gram estimate with

`C_ext <= B_abs lambda^2/(2 d_LS)`

and the quotient alignment fallback

`C_ext ||W D_ext^(-1/2)||^2
 <= B_abs lambda^4/(4 d_LS^2)`.

Source and physical kernels are quotiented correctly, and paired sampling
introduces no extra factor two on a fixed complexified parity sector.  The
80/160-digit producer and independent replay store exact dyadic endpoints of
outward intervals.  The bound is unconditional but exponentially enormous:
it pays two inverse all-index defects and does not close even the relaxed
`O(lambda^4*polylog(lambda)/d_8)` target, either signed sector, or equation
(5.2).

For the signed floors, `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` rewrites
the complete real-axis form using the exact multiplier `m_lambda`, retains
the opposite rank-one pole signs in the two parity sectors, and confines the
uncontrolled sign to an explicit phase-volume dangerous space plus a finite
Schur complement.  `notes/PHASE_VOLUME_SCALE_AUDIT.md` proves why neither the
fixed-lambda Haar law nor the usual fixed-moment/equidistribution argument
controls the needed finite orbit: the moment length and time scale are
incompatible.  The only source-locked global phase-volume upper bound remains
exponential in `lambda`; the desired polynomial bound is neither proved nor
disproved.  The odd pole count has been sharpened: because it is rank one, it
costs at most one dangerous direction rather than its older trace-norm
penalty.  `notes/COMPRESSED_MULTIPLIER_TRACE_CANDIDATE.md` also records a
historical Montgomery--Vaughan route.  The admitted successor
`notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md` replaces that external input
by a self-contained dyadic logarithmic-Hilbert proof.  It gives an explicit
`O(lambda^2 log lambda)` compressed trace and `O(lambda^2)` dangerous-rank
scale when `N` is comparable to `lambda^2` and the displayed shift schedule
holds.  Its finite constants can be order-vacuous, it does not apply with the
same scale after silently substituting the separate exponential projection
schedule, and it proves neither physical capture nor the signed Schur sign.
`notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md` identifies the signed low and
physical-capture objects without an inverse smallest Gram: the signed low
condition is a source-coordinate compression, and the quotient-relative cross norm is
exactly `||P_H Q W D^(-1/2)||`.  The known scalar shift erodes a hypothetical
uniform source floor by only `o(lambda^(-2))`.  Phase-sensitive trace
majorants give a reconstructible capture observable, while exact rational
countermodels show that rank, physical conditioning, positive sampling, and
positive diagonal blocks do not imply capture or strict gluing.
`notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md` is the exact successor.  The
projected-state norm theorem makes the matched quadratic anchor nonzero
eventually, although with no effective finite threshold.  The physical high
trace is an exact leverage deficit, and shorting the positive multiplier
absorbs its cross block before gluing.  Positivity of the negative operator
then supplies an automatic quotient-relative cross bound.  The remaining
analytic estimates are a signed shorted low floor and a leverage deficit
smaller than `g` on the same unbounded schedule; neither is proved.  A
quantitative co-frame determinant and the final determinant limit also remain
open.

`notes/LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR.md` optimizes that leverage route.
The best scalar trace floor is exactly the lower-one trimmed mean of
`m_lambda-U`, and it is also a direct high-space multiplier floor.  Separating
the archimedean term from the prime polynomial gives the explicit sufficient
target `ell_b>2*sqrt(M_H)+c_-`.  Feature factorization supplies the exact
singular positive short, the oriented negative round-trip resolvent, and a
Neumann tail bound.  An explicit Möbius right inverse plus an invisible
central-hole correction proves that some finite all-even prolate prefix spans
every fixed finite parity space.  That prefix is non-effective and mixes the
two residue classes modulo four, so it does not prove either prescribed
buffered coframe, a common unbounded margin, a signed low floor, or equation
(5.2) of `DIRECT_RH_ATTACK.md`.  Exact-rational producer and clean-room replay
artifacts include the strict and adversarial boundaries.

`notes/LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR.md` preserves two cancellations
that the preceding scalar targets lose.  The total prime second moment is
replaced by an exact upper-one localized energy, and the combined multiplier
gets sharp scalar and Hermitian mean--variance floors.  On the low space, the
source pullback retains `g*A^*A`, while an exact signature-feature Woodbury
identity gives a necessary-and-sufficient contraction test for the original
signed Schur complement once its high block is positive.  Exact rational
models show the anisotropic contraction passing when the older scalar reserve
fails.  None of the localized energy, covariance, coframe, or contraction
reserves is proved on a common unbounded physical schedule.

`notes/PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md` now specializes that complete
signed criterion to the actual multiplier and parity-pole features.  A
non-spectral `LDL*` factorization eliminates the abstract positive/negative
spectral split and gives an exact `g`-soft positive short together with a
residualized negative feature.  This identity is for the original signed
operator, not merely a sufficient hard-shorted minorant.  It keeps the odd
pole in the negative feature, the even pole in the positive feature, and
`g*A^*A` in source coordinates.  Exact rational producer/replay models show
that the soft criterion can pass when hard over-shorting fails, while
rejecting `theta=1`, a zero high gap, and omission of the odd pole.  No
physical high ratio, residual-feature reserve, coframe floor, or sector gap
is proved on an unbounded schedule.

`notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md` separates the full source map from
the prescribed finite source inventory.  The explicit Mobius right inverse
gives the untruncated even zero-integral map the row floor
`T*T^*>=(8*lambda^4)^(-1)I` for `lambda>1`.  Density then gives a quantitative
floor for some finite mixed all-even prolate prefix for every fixed
`lambda>1` and finite target space, but the terminal label is non-effective
and the prefix mixes residue classes.  In
the other direction, exact rank-nullity shows that the displayed buffered
family has only `ceil(lambda^2)+O(log(lambda))` columns: it is not count-
obstructed at matched bandwidth, but it is row-rank deficient at
`N=3*ceil(lambda^2)` and on the locked exponential Fourier schedule.  This
does not prove either prescribed matched coframe or any signed sector floor.

`notes/MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md` now isolates the two honest
matched-bandwidth alternatives.  For the actual source synthesis `C`, it
retains the full Gram `D=C^*C` and proves the coordinate-invariant identity

`R^(-1/2) W D^dagger W^* R^(-1/2)=I-L_F`.

Thus a normalized adjoint-source tail below one, or a source-whitened
`N`-minor with a positive quantitative lower bound, would certify the
prescribed matched coframe.  If the coframe is incomplete, the same note
gives sharp complete-sign centered-moment and one-sided-moment lower bounds
for the actual physical high compression, with the archimedean term, minus
prime block, and signed parity pole kept inside one operator.  Cyclic kernel
formulas reconstruct all raw moments without a cached matrix.  The exact odd
pole projection shows that any route charging it separately needs capture
angle `O(log(lambda)/lambda)`.  Fixed-order even moments, column counts,
continuous injectivity, and absolute prime moments are each ruled out by
exact countermodels.  The checkpoint proves none of the required physical
minor, complete signed high margin, sector floor, or equation (5.2).

`notes/MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_AUDIT.md` sharpens both
alternatives without promoting either one.  It reconstructs every centered
log-Fourier row of the arithmetic map and its exact derivative jumps.  The
confluent even and odd jump-jet matrices are full rank, but a
parity-preserving function-level countermodel has the same full jump-jet
rank while its entire declared finite Fourier projection is zero.  Thus the
missing coframe input is an actual matched prolate moment determinant or a
fully source- and target-whitened volume estimate, not another qualitative
breakpoint argument.  On the high-space side, the note proves the sharp one-sided
moment-order threshold, shows why a `lambda`-scale width forces linear rather
than logarithmic order, and isolates a smaller odd-pole directional Neumann
test conditional on an unproved two-sided `O(log(lambda))` multiplier bound.
It also proves that a wide harmless positive even pole can spoil generic
centered moments at every order, so that pole should be dropped in Loewner
order before a sufficient even multiplier estimate.  No physical width,
directional reserve, matched coframe, signed sector floor, or equation (5.2)
is proved.

Start with:

1. `DIRECT_RH_ATTACK.md` -- theorem and proof reduction.
2. `PROOF_OBLIGATION_LEDGER.md` -- what remains open.
3. `CODEX_MASTER_PROMPT.md` -- a focused implementation/research prompt.
4. `FALSE_SHORTCUTS.md` -- routes already falsified or shown insufficient.
5. `SOURCES.md` -- primary sources and status.
6. `P0_SOURCE_LOCK.json` -- exact source versions for the first run.
7. `P2_SOURCE_LOCK.json` -- the explicit positive-prolate transition bound.
8. `P3_SOURCE_LOCK.json` -- the explicit combined-kernel moment input.
9. `PROLATE_DEFECT_SOURCE_LOCK.json` -- Slepian's qualitative fixed-index
   defect asymptotic and its non-effective boundary.
10. `COMPRESSED_MULTIPLIER_TRACE_SOURCE_LOCK.json` -- the self-contained
    finite-compression trace/rank theorem and exact capture/gluing reduction.
11. `DEFECT_RELATIVE_PROJECTION_SOURCE_LOCK.json` -- exact source bytes and
    theorem substitutions for the defect-relative projection schedule.
12. `notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` -- the source-core theorem
    for both mixed projection orientations of the corrected combined state.
13. `ZERO_SAMPLING_SOURCE_LOCK.json` -- exact MTY v1, HSW v1, and PT v1
    source bytes, constants, height ranges, and disclosed external-computation
    dependencies used in the outer--outer sampling theorem.
14. `notes/OUTER_OUTER_SPECTRAL_THEOREM.md` -- the admitted absolute
    outer--outer bound and locked-schedule Ritz-energy corollary.
15. `COMPACT_ABSOLUTE_SAMPLING_SOURCE_LOCK.json` -- exact dependency and
    formula contract for compact-BV and complete-remainder sampling.
16. `notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md` -- the complete-remainder
    absolute-sampling bound on the locked exponential schedule.
17. `notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md` -- exact graph-dual residual
    target, absolute-sampling window lemma, and scalar/action obstruction.
18. `notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md` -- minimum-energy descent of
    a source defect form to the physical range, eliminating the smallest
    singular-value loss from the positive-sampling action.
19. `FULL_EXTERIOR_SAMPLING_SOURCE_LOCK.json` and
    `notes/FULL_EXTERIOR_SAMPLING_FALLBACK.md` -- the explicit unconditional
    full-`Y` Gram fallback and its quantified two-defect loss.
20. `notes/PRUFER_SAME_PARITY_GAP_THEOREM.md` -- elementary explicit
    same-parity differential-eigenvalue non-collision bound and its severe
    exponential conditioning limitation.
21. `notes/PARITY_SHIFT_SCALE_AUDIT.md` -- exact fixed-index comparison of
    the common Rayleigh shift with the distinct even `d_8` and odd `d_6`
    scales.
22. `notes/OUTER_NORMALIZATION_CANCELLATION_AUDIT.md` -- proof that the
    source `0/4` normalization cancels at the origin but not at the hard
    endpoint, isolating the obstruction to the endpointwise absolute route.
23. `notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md` -- qualitative parity-map
    injectivity and the normalized Gram/minor target for routes that
    explicitly orthonormalize physical source columns.
24. `HYBRID_OUTER_SAMPLING_SOURCE_LOCK.json` and
    `notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md` -- the pinned
    complete-series weighted `L2` and hybrid sampling theorem proving the
    common normalization-free shift `epsilon_lambda` is `o(d_6)` on the
    locked schedule.
25. `PROJECTED_STATE_NORM_SOURCE_LOCK.json` and
    `notes/PROJECTED_STATE_NORM_LOWER_BOUND.md` -- the explicit positive
    limiting-state norm bound, finite projected-norm lower formula, and
    normalized-shift corollary `U_Z=o(d_6)`.
26. `LEADING_PROLATE_OSCILLATION_SOURCE_LOCK.json` and
    `notes/LEADING_PROLATE_OSCILLATION_THEOREM.md` -- the exact sine-packet
    min--max proof of `mu_n<c^2` for every leading label below
    `4*lambda^2` on the locked schedule.
27. `TRANSITION_PROLATE_OUTER_SOURCE_LOCK.json` and
    `notes/TRANSITION_PROLATE_OUTER_THEOREM.md` -- the explicit buffered
    endpoint, complete even-label series, weighted norm, and translation
    theorem.
28. `GROWING_TRANSITION_SAMPLING_SOURCE_LOCK.json` and
    `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` -- the corrected
    growing-family sampling/projection Loewner theorem with all within-block
    cross terms retained.
29. `SIGNED_QUOTIENT_CAPTURE_SOURCE_LOCK.json` and
    `notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md` -- exact source-coordinate
    signed-low/cross identities, phase-sensitive capture observables,
    matched-bandwidth counts, and independently replayed countermodels.
30. `PHYSICAL_LEVERAGE_SHORTED_SCHUR_SOURCE_LOCK.json` and
    `notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md` -- eventual matched-anchor
    nonvanishing, exact physical leverage, the positive-part Krein short,
    automatic negative cross control, and independently replayed exact
    theorem-regression models.
31. `LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR_SOURCE_LOCK.json` and
    `notes/LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR.md` -- exterior-volume
    leverage, optimized stop-loss/trimmed-mean high floors, feature-space
    Schur round trips, and the non-effective all-even coframe theorem with
    independently replayed exact rational countermodels.
32. `LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR_SOURCE_LOCK.json` and
    `notes/LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR.md` -- upper-one localized
    prime energy, sharp scalar/matrix covariance floors, source-whitened
    shorted and complete signed-feature Schur criteria, and the quantitative
    coframe necessity with independent exact-rational replay.
33. `PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_SOURCE_LOCK.json` and
    `notes/PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md` -- actual parity/pole feature
    maps, the non-spectral feature factorization, the exact `g`-soft signed
    Schur identity, source-whitened contraction and full-gap reductions, and
    independent exact-rational adversarial replay.
34. `FULL_SOURCE_COFRAME_RANK_SOURCE_LOCK.json` and
    `notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md` -- explicit full-source row
    floor, coordinate-invariant restricted frame, non-effective mixed
    all-even finite-prefix floor, and exact buffered-family row-nullity
    obstructions with independent replay.
35. `MATCHED_HIGH_MOMENT_COFRAME_SOURCE_LOCK.json` and
    `notes/MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md` -- matched normalized
    adjoint-tail/minor criteria, complete-sign high-moment and one-sided
    floors, cyclic source reconstruction, the odd-pole capture scale, and
    exact obstruction models with independent 80/160-digit replay.
36. `MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_SOURCE_LOCK.json` and
    `notes/MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_AUDIT.md` -- exact
    arithmetic Fourier rows and confluent breakpoint jumps, the finite
    projection countermodel, sharp moment-width conversion, positive-pole
    obstruction, and the conditional odd directional Neumann criterion with
    independent 80/160-digit replay.
37. `SOFT_DEFECT_PROLATE_ANGLE_SOURCE_LOCK.json` and
    `notes/SOFT_DEFECT_PROLATE_ANGLE_REDUCTION.md` -- the square-root
    projection schedule, clipped complete-sign lower defect, exact physical
    leverage-excess target, ambient central-outlier obstruction, capped odd
    pole reserve, augmented prolate determinants, and fully whitened
    principal-angle criterion, with independent 80/160-digit replay.
38. `PHYSICAL_DEFECT_ADJOINT_TAIL_SOURCE_LOCK.json` and
    `notes/PHYSICAL_DEFECT_ADJOINT_TAIL_REDUCTION.md` -- cap-free weighted
    physical capture, the exact normalized coframe correction, and shifted
    odd chord/moment reductions with independent 80/160-digit replay.
39. `LOG_FEATURE_CAPTURE_ALIGNMENT_SOURCE_LOCK.json` and
    `notes/LOG_FEATURE_CAPTURE_ALIGNMENT_REDUCTION.md` -- factorial central
    polynomial features, targeted source-tail implications, and the joint
    central/odd feature-angle reduction with independent replay.
40. `INTRINSIC_FEATURE_DYADIC_DEFECT_SOURCE_LOCK.json` and
    `notes/INTRINSIC_FEATURE_DYADIC_DEFECT_REDUCTION.md` -- the intrinsic
    quotient feature angle, corrected sparse-prolate tail, exact combined
    exterior layers, and sharp odd-reserve reduction.
41. `WEIGHTED_SPECTRAL_ALIGNMENT_CHEBYSHEV_EDGE_SOURCE_LOCK.json` and
    `notes/WEIGHTED_SPECTRAL_ALIGNMENT_CHEBYSHEV_EDGE_REDUCTION.md` -- the
    covariance-weighted central target, explicit Legendre--Fourier
    conditioning, interval-union effective spectral tails, exterior
    `k`-width alignment, and faster odd Chebyshev-edge reduction, with
    independent 80/160-digit replay.
42. `MELLIN_PROJECTION_SOFT_SYMBOL_GRAPH_SPILL_SOURCE_LOCK.json`,
    `notes/MELLIN_PROJECTION_SOFT_SYMBOL_REDUCTION.md`, and
    `notes/ODD_POLE_HARMONIC_CHEBYSHEV_OBSTRUCTION.md` -- the exact `Xi/4`
    Mellin projection tail and `O((log lambda)^2)` cutoff, complete
    soft-symbol and layer identities, covariance-weighted graph-spill
    criterion, distinguished-anchor obstruction, exact odd harmonic short,
    edge-localization hierarchy, pole--prime cancellation, and proof that
    the proposed first-Riesz `o(sqrt(X))` route is impossible.  The
    RH-conditional first-Riesz main term is nonconstant almost periodic, not
    a limiting positive constant.  The producer and clean-room replay use
    independent formula trees but share Python `Fraction` and pinned
    `mpmath.iv 1.4.1`; their artifacts retain the formal state
    `P0_INVALIDATED`.
43. `WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM_SOURCE_LOCK.json` and
    `notes/WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM.md` -- the exact cancellation
    of the pole, continuous weighted-prime main density, and first
    archimedean Levy term; the resulting `c_*I+A_tail-T_D` form; the critical
    ground-moment reserve; the continuous-main magnitude-only no-go; and the
    independently ball-enclosed finite natural-even total-positivity route
    obstruction.

`notes/DETERMINANT_LIMIT_AUDIT.md` reproduces the complete finite
self-adjointness/determinant theorem from the pinned CCM source and separates
the literal boundary-normalized determinant from the unit-vector,
explicitly dephased comparison function used in the conditional limit.  It
also records why arbitrary eigenvector scaling is harmless only when it is
reciprocally compensated.

`notes/PROJECTION_RATE_THEOREM.md` proves the new projection estimate.  Its
finite inequality retains the Gaussian lattice tail omitted from the
abbreviated source display and gives an explicit bound `C_K<6.006` for the
limiting logarithmic derivative.  The asymptotic step uses the pinned
Lemma 7.2 estimate `delta_lambda=O(lambda^(-2))`; extracting an effective
numerical constant from its Meixner--Schaefke input remains separate.
Combined with an explicit two-tail bound for the limiting arithmetic state,
`notes/PROJECTED_STATE_NORM_LOWER_BOUND.md` upgrades the earlier upper norm
bound to
`||P_N k_lambda^+|| -> ||E(h)(exp(.))||_2>0`.  The theorem also rejects unit
normalization because it changes this limit by `2^(17/4)/sqrt(33)`.

`notes/GROWING_WINDOW_THEOREM.md` proves exact all-window source Gram and
determinant formulas, including the actual plus-anchor deflation.  The pinned
Karnik--Romberg--Davenport bound gives an explicit `O(log(lambda))` buffer
beyond `4*lambda^2` after which every positive concentration defect is at
least `1/2`.  This removes a source-coordinate rank and high-window-floor
obstruction.  It does not bound the physical arithmetic map, the fixed
leading defects, or the signed Weil form.

`notes/LEADING_PROLATE_OSCILLATION_THEOREM.md` removes a separate
differential-equation premise for the complete unbuffered leading family.  A
`p^2`-dimensional span of disjoint sine packets on the locked schedule
`lambda=p/2` has the exact Rayleigh quotient `c^2-1`.  Min--max therefore
gives `mu_n(c)<=c^2-1<c^2` for every `0<=n<4*lambda^2`.  The exact-rational
producer and clean-room replay reconstruct the packet tiling, scaled cosine
moments, form difference, and index range without numerical prolate data.
This is not a lower bound for `d_n`, a signed Weil comparison, or equation
(5.2).  The separate transition, growing-family, and block-action theorems
listed above now close the split-block sampling/projection successor and its
low positive quotient action, but not the physical high complement or signed
use.

`notes/PRUFER_SAME_PARITY_GAP_THEOREM.md` supplies a separate,
non-collision bound for the differential prolate eigenvalues.  It uses the
standard qualitative one-dimensional Sturm package and derives all
quantitative constants by an elementary half-line argument.
For `j=n+2r` and

`K^2=max(1,2c^2+j(j+1))`,

the half-line Volterra estimate and lifted phase
`phi(mu_m)=m*pi/2` give

`mu_j(c)-mu_n(c) >= (16 r pi/(225 K^2)) exp(-2 pi K)`.

The producer and independent replay use no numerical Sturm solve and check
the locked formula plus the exact `c=0` Legendre phase oracles; the all-`c`
Sturm homotopy is proof-only.  On `c=2*pi*lambda^2` this is only an
exponentially small lower bound; multiplying many such bounds can lose
`exp(-O(c^3))`.  It therefore proves neither growing-window conditioning nor
a signed Weil-sector floor.

The two scale audits prevent an invalid transfer from the earlier even-scale
estimate to the odd sector.  The baseline
`epsilon_lambda=O(lambda^7*d_4)=o(d_8)` gives only
`epsilon_lambda/d_6=O(lambda^3)`, not `o(1)`.  Moreover, the zero-integral
`0/4` relation cancels the origin datum, while
`a_4 e_4-a_0 e_0~a_4 e_4` at the hard endpoint.  Even the qualitative use of
`a_0=O(1)` improves that endpointwise absolute estimate only to
`O(lambda^5*d_4)=O(lambda*d_6)`, with no effective threshold.

The hybrid theorem bypasses, rather than contradicts, those audits: it keeps
the complete sampled exterior series together in the weighted `L2` estimate
and switches dyadically to the translation bound only where advantageous.
This proves `epsilon_lambda=o(d_6)` and removes the common
normalization-free scalar-shift obstruction.  It does not by itself prove
that the normalized Ritz bound `U_Z=epsilon_lambda/a^2` is `o(d_6)` without
separate control of `a`; the projected-state norm theorem now supplies that
separate control and proves `U_Z=o(d_6)`.  The endpoint cancellation itself
remains false, and an odd sector floor or positive shifted Schur complement
is still unproved.

`notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md` removes the qualitative rank
question on the locked half-integer schedule.  An unmatched arithmetic
breakpoint proves that both continuous parity maps are injective on every
finite-dimensional analytic source family, and hence their finite Fourier
maps are eventually injective at each fixed `lambda`.  The theorem is
non-effective.  Uniform conditioning is reduced to an explicit normalized
physical Gram determinant or row-minor lower bound; no such bound is yet
proved through the growing transition window.  The quotient theorem above
shows that this lower determinant is not intrinsically needed for the
positive-sampling/action estimate.  It remains relevant to implementations
and proof routes that first orthonormalize the growing physical columns.

The next analytic program is isolated in
`notes/PRECONDITIONED_RESOLVENT_PROGRAM.md`: it proves finite sufficient
preconditioner/Schur lemmas and lists the still-missing cancellation-preserving
prolate--Weil estimates.  It is a research blueprint, not the missing bound.

The exact global `E`-radical source audit and the new finite-window reduction
are in `P1_SOURCE_LOCK.json` and
`notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md`.  The radical statement is
unconditional.  A state-invisible bump enforces both codimension-two
conditions without changing the implemented semilocal state, and the finite
Weil value becomes an exact spectral-tail pairing with all projection/tail
cross terms retained.  That pairing is not known positive; treating it as a
positive leakage norm would assume the RH-level Weil positivity.

`notes/PROLATE_WINDOW_PROBE.md` and `src/prolate_window_probe.py` give one
finite `(2,8)` energy-window probe whose low basis is defined entirely from
source-normalized prolate modes before `Q` is assembled.  The exact point
Schur complements are positive, while the scalar norm Schur bounds are
negative.  Retaining the full coupling Gram instead gives positive rigorous-form
matrix lower models in both sectors and a forced-resolvent point bound only
about `1.8 percent` above the direct solve.  The source additive concentration
Gram is also two-sided comparable to the point low Schur matrices.  This
locates the next analytic need more precisely: uniform anisotropic matrix
control through the transition windows, not another scalar gap estimate.

The refined stress test makes that last sentence concrete.  At
`(lambda,N)=(2.25,12)`, the fixed two-window `X=0` model fails even though the
exact Schur complements are positive.  Enlarging the source-defined low basis
through the classical prolate Shannon index, using even labels
`8,12,16,20` and odd labels `6,10,14,18`, restores positive point lower
models in both sectors without a high-block solve.  At `(2.75,16)`, however,
the complete odd shifted margin is negative and the schedule fails closed.
At the same `lambda=2.75`, increasing the Fourier bandwidth to `N=24` and
`N=32` restores positive point margins in both sectors.  The `N=24` result is
stable when the prolate Galerkin basis is enlarged from 60 to 80 and when
precision is increased from 50 to 80 decimal digits.  Thus the
`N=16` failure diagnoses an under-resolved bandwidth schedule rather than a
finite disproof of the bridge.  The evidence remains mixed: it identifies a
growing transition-window comparison and a stronger Galerkin schedule as
the plausible proof objects, but it supplies neither the uniform signed Weil
estimate nor equation (5.2).

The first four points of the deterministic schedule
`N=3*ceil(lambda^2)`, at `lambda=1.75,2,2.25,2.75`, all pass the finite
sector and weighted-resolvent diagnostics.  The corresponding `tau` values
decrease from about `2.1225e-3` to `2.2142e-4`.  A purely exploratory
four-point power fit gives exponent `4.9828`, OLS-only standard error
`0.4467`, and local exponents from `3.8171` to `6.2712`.  This very short fit
has no asymptotic force.  The delicate `(2.25,18)` signs survive an
independent base replay and a `45`- to `70`-digit repeat with the prolate
basis enlarged from 50 to 70, but no analytic truncation rule, interval
enclosure, or uniform estimate along an unbounded sequence has been obtained.

`notes/PHYSICAL_DEFECT_ADJOINT_TAIL_REDUCTION.md` now removes the
auxiliary cap from the even leverage obligation exactly: the remaining
quantity is a weighted Hilbert--Schmidt distance from the physical prolate
range.  It also replaces the coarse prolate-angle Cauchy majorant by the exact
rank-one coframe loss and shifts the odd resolvent test to the desired
positive floor, with a nonincreasing directional-moment hierarchy and an
aligned-positive-excess identity.  These are finite reductions.  No current
estimate proves the required central-band trace capture, exact coframe
reserve, shifted odd reserve, signed sector floor, equation (5.2), or
determinant limit.

`notes/LOG_FEATURE_CAPTURE_ALIGNMENT_REDUCTION.md` sharpens the central and
odd obstructions to one smaller geometric target.  If `V_r` is the target
projection of the physical polynomials of degree below `r`, the complete
central-band trace outside the physical range is bounded by its principal
angle to `V_r` plus an explicit factorial Taylor tail.  The same `V_r`, with
`r=O(log(lambda))`, approximates the actual odd pole.  Thus the conditional
common target is squared angle `o(log(lambda)/lambda)`, or the targeted
right-inverse source tail `o(log(lambda)/lambda^3)`.  The note also gives an
exact geometric remainder for the shifted odd moment hierarchy and strict
positive-excess spectral-alignment tests.  No theorem presently proves that
the actual prolate range attains this angle, and central capture does not
control the exterior weighted defect.

`notes/INTRINSIC_FEATURE_DYADIC_DEFECT_REDUCTION.md` removes an ambiguity in
that conditional source-tail route.  A right inverse can be changed by an
arbitrary map into the kernel of the arithmetic transform, so the raw tail
of a chosen lift is not intrinsic.  The note identifies the exact
minimum-tail quotient, proves the corrected sparse-prolate coefficient
identity, and gives a physical cross-Gram/least-squares formula for the
actual feature angle.  It also keeps the combined archimedean-minus-prime
symbol intact in an exact dyadic exterior-layer reduction, with distinct
open upper and closed lower spectral endpoints, and derives the sharp
orientation-free odd-pole reserve and optimal directional-moment remainder.
The remaining targets are now intrinsic: prove the actual feature-angle
rate, effective-rank alignment for every relevant exterior layer, and an
odd directional edge deficit on one unbounded schedule.  None is proved;
the formal state remains `P0_INVALIDATED`.

`notes/WEIGHTED_SPECTRAL_ALIGNMENT_CHEBYSHEV_EDGE_REDUCTION.md` now shows
that the worst principal angle is stronger than the central problem actually
requires.  The exact central loss is a covariance-weighted cross-Gram trace;
a maximally missed direction can carry only factorially small central mass.
Consequently the central polynomial inventory can be reduced to
`r=ceil(c*L/log(L))`, `c>1/4`, while the odd pole is tracked by its own exact
cross Gram.  The note also proves an explicit Legendre--Fourier conditioning
bound, an interval-union effective-tail theorem and exact spectral `k`-width
decomposition for every exterior level, and a Chebyshev odd-resolvent
expansion with a strictly faster remainder than the preceding Neumann bound.
These are sharper targets, not their missing arithmetic estimates: the
actual covariance-weighted prolate capture, exterior component/alignment
bounds, and odd directional reserve remain open on an unbounded schedule.

`notes/MELLIN_PROJECTION_SOFT_SYMBOL_REDUCTION.md` removes the old
quadratic-in-`lambda` projection cost for the distinguished comparison
state.  Its source-normalized full transform is exactly `Xi/4`; an explicit
Xi envelope and two endpoint-sensitive integrations by parts give the
cutoff `N_star=ceil((L^2+26*L)/(2*pi^2))`.  It also proves complete
soft-symbol and hard-layer identities, including the mandatory gray term,
and reduces central capture to an exact low-mode graph plus a weighted
high-mode spill.  The single comparison anchor is proved insufficient for
fixed central-band energy.

`notes/ODD_POLE_HARMONIC_CHEBYSHEV_OBSTRUCTION.md` proves that adjoining the
odd pole merely rewrites the original resolvent-load sign test as an exact
harmonic short.  It supplies monotone edge moments and localization filters,
but fixed finite moments cannot decide the sign.  On the full unprojected
pole it keeps the pole and minus-prime blocks combined and exposes the first
Riesz mean of `psi(X)-X`.  That mean is not `o(sqrt(X))`; conditional on RH
its normalized contribution is a nonconstant almost-periodic zero sum, not
convergence to its small positive center.  This closes a false route, not
the odd reserve.  The formal state remains `P0_INVALIDATED`.

Checkpoint 0.40 sharpens all three remaining sector mechanisms without
claiming that any sector floor has closed.  In
`notes/COVARIANCE_TANGENT_GRAPH_SPILL.md`, the least possible spill of an
exact low graph lift is the covariance-weighted principal-angle tangent

`Gamma_min^2=tr(D U_M^*(R_M^dagger-P_ran(R_M))U_M)`.

The exact central Fourier tail is
`H_M<=delta^3/(6*pi^3*(M-delta/(2*pi)))`, so
`M=ceil(lambda*L)` makes every non-graph central term negligible.  A
source-metric theorem reduces the actual missing rate to the single relative
condition `epsilon_lambda/gamma_lambda=o(1/lambda)`.  Row rank alone cannot
imply it; an exact rational countermodel has a unit raw low coframe and
arbitrarily large spill.

`notes/ANNULAR_GRAY_MASS_OBSTRUCTION.md` resolves the earlier ambiguity
between the uncut defect and the hard exterior summand.  On any fixed
rescaled annulus between `delta` and `pi/2`, both inversion sectors have
unnormalized gray mass `Omega(lambda)`.  Hence the current global trace/BV
route cannot certify an `O(L)` exterior budget, and the operator route needs
a closed-projector squared angle `O(L/lambda)`.  On the logarithmic-squared
Mellin cutoff its effective-rank requirement fills the entire target.  For
the actual hard-cut exterior symbol, the two reflected cutoff jumps also
make the full hard-layer average itself `Omega(lambda)`.  These are no-go and
necessary-angle results, not a theorem that the full arithmetic--prolate
range is misaligned.

`notes/ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md` proves unconditionally that the
complete unprojected odd pole form has

`limsup_(locked lambda) G_lambda/lambda >= c0`,

where `c0=1+EulerGamma/2-log(2*sqrt(pi))>0`.  The proof is a one-sided
Mellin/Landau case split and does not assume zero reality or read zero
ordinates.  `notes/ODD_FAVORABLE_EXPONENTIAL_BANDWIDTH_TRANSFER.md` computes
the exact pole Fourier coefficients and a complete-form projection bound.
It proves that the same source-selected subsequence works at the fixed locked
bandwidth `N_exp=2^(9600*lambda^2)`.  Its explicit error is below
`lambda/1000<c0*lambda/8` from the first locked parameter, so every favorable
parameter has normalized odd pole-direction Rayleigh value at least
`3*c0/4`.  `notes/ODD_LOCKED_HIGH_FESHBACH_REDUCTION.md` then eliminates the
honestly coercive high tail exactly, leaving an
`exp(O(lambda*log(lambda)))+1` dimensional Feshbach matrix and proving that
any successful shifted sign has critical load tending to one.  The retained
Feshbach sign and strict inverse-weighted load remain open, so this one
positive direction is not promoted to an odd floor.
The source lock, producer, and independent replay reconstruct exact tangent,
gray-mass, endpoint, prime-power, and pole--prime fixtures plus 35 outward
interval probes for `p=5,9` at 80 and 160 digits.  The two paths share
Python `Fraction` and `mpmath.iv 1.4.1`, as disclosed.

Checkpoint 0.41 audits the three quantitative steps left exposed by
checkpoint 0.40.  `notes/PRESCRIBED_RESIDUE_COFRAME_AUDIT.md` proves that a
finite analytic source image cannot equal any nonzero finite log-analytic
feature on the locked half-integer grid: the arithmetic image has an
unmatched prime-power breakpoint.  This gives a positive fixed-inventory
principal angle, but no uniform lower bound.  The exact coframe/spill
comparison shows that a successful diagonal needs that angle to decay at
least at the `o(lambda^(-1/2))` scale.  It also shows that the present
periodic-BV certificate grows polynomially on the proposed schedule, so
that certificate cannot prove the needed relative spill rate.  This does
not rule out the actual optimized tangent.

`notes/MIXED_PREFIX_COUPLED_SIGNED_AUDIT.md` proves that for every fixed
`lambda` and finite target there is some non-effective mixed all-even prefix
with full simultaneous capture and row floor at least
`1/(16*lambda^4)`.  The exact bridge Gram and triangular coordinate change
retain all cross-family terms.  An exact rational countermodel then shows
why separate positive residue-family comparisons do not imply positivity of
the coupled signed form: an onto coframe preserves inertia rather than
creating sign.  No effective common prefix or signed floor follows.

`notes/ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md` isolates the complete odd
residual `b=(Q-alpha)e`, derives moment and Krylov lower/upper enclosures for
the inverse load, and gives a quantitative Schur floor whenever the verified
upper enclosure is below the pole surplus.  The associated critical load
tends to one from below on any successful favorable schedule; a fixed load
gap is therefore the wrong target.  The exact unprojected prime action has a
strict positive jump at every locked prime-power threshold, proving that the
pole is not an exact eigenvector before Fourier compression.  These jump and
orientation obstructions do not provide the missing finite transverse
floor.  The 24-dependency source lock, producer, and independent replay
reconstruct the coupled-frame, delayed-coframe, orientation-twin,
positive-`nu`, annular-rank, BV-ratio, inclusive-prime-power, and two-path
prime-action fixtures for `p=5,9` at 80 and 160 digits.  The two paths share
Python `Fraction` and `mpmath.iv 1.4.1`, as disclosed.  The formal state
remains `P0_INVALIDATED`.

Checkpoint 0.42 turns the qualitative mixed-prefix existence statement into
a fail-closed computation for every finite computable physical target.
`notes/EFFECTIVE_MIXED_PREFIX_SCHEDULE_ATTACK.md` projects the explicit
Mobius right inverse into the actual corrected all-even prolate prefix and
stops only when an outward enclosure proves
`tr(B^*(I-P_F)B)<1/(8*lambda^2)`.  The resulting Neumann right inverse gives
the invariant simultaneous row floor `9/(128*lambda^4)`.  A separate
source-BV/Sturm argument supplies a coarse parameter-explicit advance label.
This is an effective finite-target schedule, but it has no useful
transition-scale cost bound and it does not change the inertia of the
coupled signed form.

`notes/AUGMENTED_ENDPOINT_JET_COFRAME_ATTACK.md` proves that, at fixed
`lambda` and fixed jet order, high labels in either prescribed residue
family provide cheap exact endpoint-jet corrections.  Jet-zero sources are
`L2`-dense in the corresponding algebraic residue core and have exactly the
same finite physical range.  Endpoint cancellation can therefore preserve
an existing prescribed coframe, but cannot create the missing rank.  The
elementary certified labels start beyond roughly `4^(2K)*lambda^4`, so this
does not provide the needed transition-scale diagonal.

`notes/ODD_JUMP_FINITE_KRYLOV_ATTACK.md` proves fixed-parameter graph
convergence of the exact finite centered odd residual to the complete
archimedean-minus-prime residual.  The prime-power jump consequently gives a
nonzero finite cross vector for every sufficiently large cutoff, and its
localized dyadic Fourier band has the exact `1/K` energy law.  No uniform
cutoff, positive third-moment gate, transverse floor, or inverse-load margin
follows.  The 18-dependency source lock and independent producer/replay keep
the `(-1)^k` Fourier phase, inclusive prime powers, minus-prime sign, bridge
metric, and source normalization explicit.  The formal state remains
`P0_INVALIDATED`.

Checkpoint 0.43 makes the coarse mixed-prefix cost fully explicit.
`notes/EXPLICIT_MIXED_PREFIX_COST_ATTACK.md` derives an elementary lower
bound for the normalized ground-prolate integral and an explicit variation
bound for every Fourier/Mobius lift.  For `N=ceil(lambda^2)` it proves an
a priori terminal count of order `lambda^18/(log(lambda))^3`, with all
constants displayed.  The independently replayed values are already about
`4.58e14` at `lambda=5/2` and `2.44e18` at `lambda=9/2`; this closes
finite effectiveness, not the missing transition-scale signed comparison.

`notes/EFFECTIVE_MIXED_SIGNED_QUOTIENT_ATTACK.md` proves that the normalized
whole-target source quotient is unitarily equivalent to the complete
physical shifted Weil operator.  Spectrum, determinant, and inertia are
therefore unchanged by capture.  The ordinary prefix retains an
exponentially small `c_2` defect direction no matter how large its terminal
label is.  At each fixed parameter, every sufficiently far high-only tail
still captures the full finite target and eventually satisfies
`H>=(1/4)D`; the defect cutoff is explicit below, but no advance spanning
terminal-label bound or signed floor follows.

`notes/QUANTITATIVE_HIGH_TAIL_BREAKPOINT_COFRAME_ATTACK.md` sharpens that
high-tail statement.  It gives an explicit `R_0(lambda)` after which
`H>=(1/4)D`, but also constructs an exact unit Fourier direction cancelling
all arithmetic-breakpoint jumps through order `2N-1`.  Its high-tail
coframe floor is at most an explicit quantity of scale `R^(-2d+1)`, so any
right inverse grows at least on the `R^(d-1/2)` scale.  Thus the naive
breakpoint/Vandermonde route is quantitatively ill-conditioned and supplies
no advance terminal label.

`notes/ODD_NU_TRANSVERSE_SIGN_ATTACK.md` identifies the exact unprojected
third-moment gate as
`mu^(-1)*integral (m_lambda-beta)*|Rhat|^2 dt/(2*pi)`.  Fixed-parameter
Galerkin values, transverse floors, and inverse loads converge to their
unprojected counterparts, so a strict independently proved sign would
transfer.  The jump itself supplies only a nonzero residual and a guaranteed
logarithmic energy of order `(log K)/K`, which tends to zero.  Exact
pole-compatible countermodels show that the same jump tail and positive high
operator permit either third-moment sign, an invisible negative transverse
direction, and opposite inverse-load decisions.  The 0.43 source lock and
three independent producer/replay paths retain the source conventions and
formal state `P0_INVALIDATED`.

Checkpoint 0.44 weakens the limiting bridge without weakening its zero-set
logic.  `notes/PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md` proves the exact
centered-mode transform

`widehat(phi_n)(z)=2*sin(z*L/2)/(sqrt(L)*(z-2*pi*n/L))`

and an outer-cutoff-uniform low/high compact-window bound.  After an allowed
nonzero rescaling of each simple-even finite ground line, local uniform
convergence only requires a projective comparison on modes
`|n|<=ceil(lambda)` at the `O(lambda^(-1/2))` scale; a bounded high-mode
rotation is invisible on every fixed substrip.  This is a strictly weaker
sufficient target, not a proof that the actual ground line satisfies it.

`notes/VECTOR_SPECIFIC_EQUATION_52_ATTACK.md` identifies the rescaled exact
ground-line correction as `-(A-mu*I)^(-1)b`.  Its low observable is bounded
by the product of one forced inverse energy and one low Green-function
leverage, and the characteristic function can alternatively be controlled
directly by a compact Mellin graph product.  Exact quotient-pseudoinverse
formulas reconstruct those factors without paying a physical-source coframe
condition number.  The current high-Fourier coercivity theorem's displayed
coarse lower bound is proved negative at `M=ceil(lambda)` under its
source-triangle constants, so that bound does not supply the required
shifted sign or leverage estimate.

`notes/LOCALLY_UNIFORM_DETERMINANT_ATTACK.md` gives an independent route.
After normalization at a fixed `i*sigma`, convergence is equivalent to all
trace moments of the positive paired resolvent
`K=diag((rho^2+sigma^2)^(-1))`; the target moments are derivatives of `Xi`
and use no zero table.  The Fourier-lattice tail vanishes explicitly when
`N/(log(lambda))^2->infinity`, but the finite quotient trace remains
uncontrolled.  An exact diagonal Cauchy countermodel satisfies the finite
simple-even commutator and boundary hypotheses while its first trace grows
like `log(lambda)`, so finite real-zero determinants are not automatically a
normal family.

Finally, `notes/UNPROJECTED_ODD_NU_SIGN_ATTACK.md` restores the mandatory
Paley--Wiener projection in the exact odd residual transform.  For every
locked `lambda>=5/2` and nonnegative shift, the complete source multiplier
has an explicit negative core and positive tail, and the nonzero residual
has Fourier mass in both.  Thus the odd third moment is the difference of
two strictly positive source terms; the prime jump and high-tail positivity
do not choose its sign or the independent inverse-load margin.  None of the
0.44 reductions proves the finite shifted signs, the low graph product, the
trace moments, equation (5.2), or locally uniform determinant convergence.

Checkpoint 0.45 makes the projective freedom and the first determinant gate
quantitative.  `notes/PROJECTIVE_WEDGE_RESOLVENT_REDUCTION.md` proves that the
low projective distance depends only on the component of
`P_M(A-mu*I)^(-1)b` perpendicular to `P_M kappa`, with the scalar-aligned
component removed by an exact low--high cancellation.  At
`M=ceil(lambda)`, the resulting sufficient target is the transverse bound

`Lambda_(M,perp)(U)=lambda^(-1/2+o(1))`

together with a subpolynomial complete shifted solve.  Equivalently, the
transverse target follows from the one-inverse product
`E_U*Theta_(M,perp)(U)=lambda^(-1+o(1))`.  On compact subsets of the strip,
normalization at one fixed nonreal anchor replaces the whole correction by
the exact projective wedge.  The corresponding anchor and wedge graph-product
limits are a sufficient locally uniform criterion, conditional on the strict
finite shifted signs.  The actual arithmetic graph products are not proved.

`notes/THREE_SCALE_TRANSVERSE_RESOLVENT_REDUCTION.md` identifies the adjoint
range of that transverse observation with a genuinely low-supported raw
Fourier space.  It gives an explicit separated low-to-far Cauchy norm, shorts
the honestly coercive far block exactly, and proves that direct far feedback
is super-polynomially small at the admitted huge cutoff.  What remains is the
vector-specific middle-window ratio
`sup_(h>=0)||Omega_h^(-1)eta_h||`.  An exact abstract countermodel shows that
small residual, small Ritz lowering, strict sector signs, and perfect far
coercivity do not control this ratio.  No bound for the actual middle-window
effective forcing is claimed.

`notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md` expresses the first paired quotient
trace through the scalar shifted-odd response
`A(alpha)=1+<g_alpha,T_-^(-1)beta>`.  For two fixed imaginary heights it proves
that a uniform first trace is equivalent to the quotient ratio being bounded
away from zero, and it links that ratio exactly to the finite ground-transform
ratio.  When `N/L^2->infinity`, the central lattice contributes
`(sigma/tau) exp(-(sigma-tau)L/2)`, so the odd response must compensate on the
reciprocal exponential scale; any subexponential response forces the first
trace to grow at least linearly in `L`.  Positivity of `A` alone is therefore
insufficient.  The required exponential compensation, all limiting trace
moments, equation (5.2), and locally uniform determinant convergence remain
open, and the formal state remains `P0_INVALIDATED`.

Checkpoint 0.46 puts the quotient trace, the constrained middle solve, and the
odd-sector sign into three exact parity reductions.  In
`notes/PARITY_PENCIL_TRACE_REDUCTION.md`, the squared finite quotient roots are
the generalized eigenvalues of the positive pencil
`(C^*T_+C,T_-)`.  Every physical half-paired trace moment is a Schatten moment
of its whitened resolvent, and the first trace is exactly the effective
dimension

`d_eff(alpha)=Tr(alpha^2*(G+alpha^2*I)^(-1))`.

Thus the first normal-family gate is the source-specific bound
`d_eff(sigma*L/(2*pi))=O(1)`, equivalently the corresponding physical trace is
`O(1)`.  The identity is proved; that bound and the subsequent trace-moment
limits are not.

`notes/ODD_RESOLVENT_WEYL_RECONSTRUCTION.md` reconstructs the constrained even
middle inverse from the two actual odd responses
`(Q_- -s*I)^(-1)beta` and `(Q_- -s*I)^(-1)D*kappa` plus an explicit `2 by 2`
scalar Weyl system.  It also proves that raw low/high Fourier separation misses
a scalar graph direction, and supplies an exact Cauchy-form countermodel where
the raw separated coupling vanishes but the transverse middle response does
not.  No uniform bound for the two arithmetic odd responses or their scalar
Weyl determinant is proved.

`notes/EVEN_GROUND_IMAGINARY_AXIS_ODD_INERTIA.md` starts only from a simple
lowest even eigenpair and two explicit nonvanishing conditions.  It transfers
the complete inertia of `Q_- -epsilon*I` to a rank-one squared-mode pencil and
counts its negative directions by positive zeros of the boundary-normalized
even-ground transform on the imaginary axis.  Consequently, odd positivity
above `epsilon` is equivalent to all-axis positivity of that transform; all
finite quotient roots are then real, while each failed sign produces a purely
imaginary pair.  A coefficient-moment tail gives an exact finite interval to
check, pointwise nonnegativity of the boundary-normalized even ground
trigonometric polynomial is a sufficient certificate, and an explicit Ritz
reserve converts positivity above `epsilon` to positivity above `U`.  None of
the arithmetic all-axis sign, pointwise nonnegativity, coefficient-uniform
interval control, or shifted Ritz reserve is proved on an unbounded schedule.
In particular, checkpoint 0.46 proves neither equation (5.2) nor locally
uniform determinant convergence and changes no RH conclusion; the formal
state remains `P0_INVALIDATED`.

Checkpoint 0.47 makes the ground-transform, Weyl, and coefficient gates
exactly scalar without supplying their missing arithmetic estimates.
`notes/GROUND_TRANSFORM_TILT_JET_REDUCTION.md` identifies the positive-pencil
effective dimension with the logarithmic derivative of the actual finite
ground transform minus an explicit exterior lattice tail, expresses every
higher paired trace moment as a squared-height logarithmic cumulant, and
factors the two-height quotient determinant ratio through the corresponding
ground-transform ratio.  Its one-anchor Wronskian identity gives a concrete
projective-jet sufficient gate through two cancellation-preserving inverse-
energy products.  An exact Cauchy-displacement countermodel has a strictly
positive boundary-normalized ground polynomial and a uniformly conditioned
positive odd block but `d_eff` still grows like `sigma*L/4`; positivity,
ordinary interlacing, and odd conditioning therefore do not prove the
arithmetic log-derivative bound.

`notes/WEYL_COLLAPSE_SHIFTED_COEFFICIENT_RESERVE.md` proves that the odd Weyl
system collapses exactly:

`mathfrak D_s=-m_s/h_s=-det(A-s*I)/det(Q_- -s*I)`

and its reconstructed middle response is the normalized even resolvent
`-P_L(Q_+-s*I)^(-1)kappa/<kappa,(Q_+-s*I)^(-1)kappa>`, equivalently
`P_L(A-s*I)^(-1)b`.  Thus a separate Weyl-determinant floor can discard an
exact cancellation and is stronger than the middle estimate actually needed.
The same note proves the conditional coefficient reserve
`lambda_max(X)<=N^2+M_2`, the Schur-surplus bound
`U-epsilon<=chi_U`, and the scale-invariant sufficient shifted gate
`(chi_U/g_+)*C_x<1`, after the all-axis odd sign has first been established.
None of the required arithmetic coefficient conditioning or middle-resolvent
decay is proved.

`notes/EVEN_GROUND_COEFFICIENT_CONE_AUDIT.md` gives the exact finite
coefficient form of the odd sign.  Under the simple-even-ground and two
nonvanishing hypotheses, `P_x(s)=det(X+s*I)` is monic and real-rooted,
`p_0=(N!)^2*x_0/c`, and `Q_- -epsilon*I>0` is equivalent to strict positivity
of every coefficient `p_j`.  The locked pole--archimedean--minus-prime entries
also show why Cauchy form, positive prime weights, diagonal signatures,
Perron--Frobenius, total positivity, or coefficient alternation do not place
the actual arithmetic ground line in this cone.

The actual ground-transform logarithmic derivative or two-height ratio, the
projective-jet leverage products, all higher cumulant limits, the arithmetic
coefficient cone, the shifted coefficient reserve, and the cancellation-
preserving middle target all remain open on an unbounded schedule.  Equation
(5.2) and locally uniform determinant convergence remain open as well.
Checkpoint 0.47 proves no RH statement or new bound, and the formal state
remains `P0_INVALIDATED`.

Checkpoint 0.48 isolates the strongest presently available zero-height
version of the first paired-trace gate.  Under the exact finite simple-even
and odd-positive hypotheses,

`Z^(0)=(L/(2*pi))^2*(p_1/p_0)`

is the physical half-paired reciprocal-square trace.  The same ratio is
reconstructed exactly as a generalized-pencil trace, a determinant
logarithmic derivative, a cofactor ratio, a ground-coordinate functional,
and a relative odd-resolvent cancellation.  The origin quadratic coefficient
of the finite ground transform equals `Z^(0)` plus the mandatory positive
exterior tail `(L/(2*pi))^2*sum_(n>N)n^(-2)`; omitting that tail changes the
finite statement.

A bounded `Z^(0)` controls every fixed positive-height trace moment and gives
a two-height quotient-determinant floor.  It gives local boundedness of the
origin-normalized finite products only when `N/L^2` is bounded away from
zero.  An exact `N=1` coefficient-cone family has bounded `Z^(0)` but an
unbounded exterior factor even though its ground polynomial is pointwise
positive for `L>=1`, proving that the schedule condition cannot be dropped.
If the actual boundary-normalized ground polynomial were proved
pointwise nonnegative, the target would become a centered second-moment
tightness statement; pointwise nonnegativity alone supplies only the trivial
`O(L^2)` support bound.

Inside the finite coefficient cone,
`0<p_j/p_0<=(p_1/p_0)^j/j!`, so the quantitative arithmetic target reduces
to `p_1/p_0=O(L^(-2))`.  Cone membership alone has no rate.  Every coefficient
sign has an eigenvector-free mixed-adjugate and bordered-determinant formula,
and the positive-pencil upper edge satisfies
`lambda_max(X)<=Tr(X)=p_(N-1)`.  This yields a cancellation-preserving
conditional shifted odd reserve, but no source estimate currently bounds the
required coefficient conditioning on an unbounded schedule.

Relative to the projected source-normalized prolate anchor, the same scalar
is controlled by an exact origin projective-curvature identity and two
complete-source inverse-energy products.  Positive-height mixed-cofactor,
Hellmann--Feynman, and coefficient-probability identities reconstruct the
ground-projector leverage ratio but do not bound it; the two evaluation
directions are noncollinear, so rank-one Loewner comparison does not close the
gap.  The actual arithmetic coefficient cone, the `p_1/p_0=O(L^(-2))` rate,
the origin leverage products, the shifted reserve, higher trace-moment
limits, equation (5.2), and locally uniform determinant convergence all
remain open.  Checkpoint 0.48 proves no RH statement or new bound, and the
formal state remains `P0_INVALIDATED`.

Checkpoint 0.49 proves the corresponding statement for the projected
source-normalized prolate anchor.  Direct origin-functional estimates retain
both limiting-state tails and give

`ell_0(kappa) -> Xi(0)/(4*a_infinity)`

and

`ell_2(kappa) -> -Xi''(0)/(8*a_infinity)`

whenever `N/L^(7/5) -> infinity`, using only the pinned non-effective
`delta_lambda=O(lambda^(-2))` theorem.  When `N/L^2` is bounded away from
zero, the exact exterior-tail identity then proves the anchor coefficient
functional is `O(L^(-2))`.  This includes both the quadratic diagnostic
schedule and the locked exponential schedule.  Unit normalization remains
rejected because it rescales the unnormalized `Xi/4` transform and limiting
norm, although that positive scalar cancels exactly in the normalized anchor
and its origin jets.

For the actual finite ground line, the same checkpoint proves the fixed-
height product sandwich

`log(B_sigma)/sigma^2 <= Z^(0) <= (B_sigma-1)/sigma^2`.

At height `1/2`, `B_sigma` is reconstructed from the complete-matrix pole
leverage, a mixed cofactor, and the relative odd response
`A(L/(4*pi))/A(0)`.  Thus the actual rate is reduced to the explicit target
`A(L/(4*pi))/A(0)=O(L*exp(-L/4))` on schedules with bounded exterior product.
Exact origin-Wronskian norms also show that either
`r/gamma=O(L^(-5/2))` or the weaker one-solve bound
`tau_U=O(L^(-5/2))` would suffice for bounded true-ground origin curvature.

No source estimate presently proves the shifted complement sign, positive
gap floor, relative-response decay, residual--gap rate, or one-solve rate on
an unbounded schedule.  The anchor theorem therefore does not transfer to
the actual ground state, equation (5.2) remains open, and no locally uniform
determinant limit follows.  The formal state remains `P0_INVALIDATED`.

Checkpoint 0.50 removes the finite pole from that height-one-half gate only
after the complete source matrix has been assembled and shifted.  If
`T_+=Q_+-epsilon*I` and `p_+` is the projected even pole Riesz vector, then

`S_+=T_+-2*|p_+><p_+|`

is invertible with exactly one negative direction and satisfies
`S_+^(-1)p_+=-x/(2<p_+,x>)`.  Thus the full zero-height target is equivalent,
on schedules with `N/L^2` bounded below, to the single mixed inverse reserve

`-d_0=-<e_0^+,S_+^(-1)p_+> >> L^(-1/2)`.

The exterior product is mandatory:
`d_0=-1/(2*sqrt(L)*E_N(1/2)*B)`, giving an exact two-sided trace sandwich.
An adjugate formula and a rank-two determinant identity reconstruct `d_0`
without reading an eigenvector.  The diagonal inequality
`c_0+2*d_0^2>=0` shows that the source-specific estimate
`c_0<=-kappa/L` would suffice, but that estimate is not proved.  Deleting the
opposite-sign odd pole gives an exact Woodbury response quotient; it exposes,
rather than removes, the remaining cancellation.

The exact principal Schur coordinates sharpen this further.  With `C` the
positive `e_0`-deleted block, `g=p_0-<p,C^(-1)b>`, and
`mu=<p,C^(-1)p>`, one has `d_0=-1/(2g)` and
`c_0=-2(1-2*mu)d_0^2`.  The height-one-half pole terms cancel exactly
between the principal even and odd blocks, but the resulting determinant
ratio is again `A(L/(4*pi))/A(0)=g/p_0`; it is not a new estimate.

After subtracting its exact value at zero, and before the ground shift, the
complete nonpole multiplier has an exact positive Bernstein--Levy form: its
digamma difference is a complete Bernstein function of `t^2`, and every
prime power contributes the positive
translation energy `2*Lambda(n)/sqrt(n)*(1-cos(t*log(n)))`.  After zero
extension this is a symmetric Dirichlet form.  The required inverse is,
however, shifted into its first even spectral gap, so positive Markov
resolvent or absolute-value Agmon estimates do not cross the negative ground
direction.

Exact rational, Cauchy-displacement, and killed-Markov countermodels keep the
relevant finite inertia, pole leverage, positivity, and conditioning data
while their mixed reserve collapses.  They are not arithmetic models.
Consequently the missing step is now a signed estimate for the combined
archimedean--minus-prime source multiplier, or an equivalent complete
middle/full graph comparison.  The four stored reconnaissance points are
point-valued and do not certify an asymptotic rate.  The formal state remains
`P0_INVALIDATED`.

Checkpoint 0.51 identifies the exact signed arithmetic object in that
remaining estimate.  With

`D_lambda(h)=sum_(1<n<=exp(h)) Lambda(n)/sqrt(n)-2*(exp(h/2)-1)`,

the complete finite source operator has the form identity

`Q_lambda=c_* I+A_tail-T_D`,

where `c_*=psi(1/4)-log(pi)+4`, `A_tail` is the full zero-extension
Dirichlet form for density
`exp(-5*|h|/2)/(1-exp(-2*|h|))`, and `T_D` is the signed two-sided
Stieltjes translation by `dD_lambda`.  This follows from an exact
cancellation of the pole, the continuous weighted-PNT main density, and the
first archimedean Levy summand.  All lambda-dependent scalar mass cancels.
The tail beyond the interval remains as boundary killing, and an endpoint
prime power remains mandatory even though the finite correlation kernel
vanishes at that endpoint.

For the actual even ground, the checkpoint-0.50 reserve is now exactly

`g/sqrt(L)=integral cosh(y/2)*x(y)dy / integral x(y)dy`.

Thus the missing theorem is a uniform critical exponential-moment bound for
the ground of `A_tail-T_D`, using the sign and translation geometry of the
actual weighted PNT discrepancy.  The continuous-main model `D_lambda=0`
delocalizes and violates this reserve, so an absolute discrepancy envelope
cannot replace that signed arithmetic information.

At the ball-enclosed pilot `lambda=2,N=4`, an entirely off-diagonal natural-
even order-two minor is strictly negative at both 256 and 512 bits, while a
principal order-two minor is strictly positive.  This invalidates a direct
total-nonnegativity or sign-regularity proof for the actual natural even
matrix at that pilot; it is not an asymptotic counterexample.  The new normal
form proves no uniform mixed reserve, complementary gap, equation (5.2), or
locally uniform determinant limit.  The formal state remains
`P0_INVALIDATED`.

`notes/SUZUKI_SCREW_SOURCE_CANDIDATE_AUDIT.md` separately audits Suzuki's
2026 screw-function preprint.  Its fixed-interval continuum deficiency-vector
function is an interesting alternative real-zero object, but it neither
identifies the finite Weil ground determinant nor proves the large-interval
limit.  Because the v1 compact-limit statement has a meromorphic target and
the audit finds two additional proof/formula passages needing repair, the
paper remains explicitly unadmitted and changes no component claim.

`notes/UNADMITTED_SUZUKI_SHIFTED_METRIC_REAL_POLE_AUDIT.md` checks the
natural positive-shift repair separately.  It proves the abstract
contour-local fact that meromorphic limits of functions with only real poles
cannot acquire a nonreal pole.  But the proposed scalar de-shift mixes the
two operator scales: adding `c_a I` to the `A`-scale becomes `c_a/z^2` on
the formal `G`-scale.  More basically, the cited identity for
`xi'/(z^2 xi)` is a one-sided transform in `Im z>1/2`; it cannot be the
bilateral transform of the stated even screw function.  No shifted
characteristic normalization or meromorphic large-interval convergence is
proved, so this remains an unadmitted obstruction audit.

`notes/PROLATE_DEFECT_SOURCE_AUDIT.md` records the exact conversion to the
classical sinc-kernel parameter and the fixed-index defect scale.  Slepian's
primary 1964 derivation is now vendored, hashed, and admitted for qualitative
fixed-index asymptotics.  It proves `d_4/d_8=O(c^(-4))` along an unbounded
schedule, but its unspecified remainder gives no effective starting
threshold or finite floor.  The available explicit one-sided bound is
exponentially too weak for the required determinant comparison, and neither
source supplies a signed Weil floor.

`src/p0_diagnostic.py` constructs the source-normalized finite prolate state,
projects it, and evaluates the finite residual--gap quantities and signed
block cancellation.  `src/sector_bridge.py` implements the independently
proved finite sector--Ritz and weighted-resolvent lemmas.
`src/source_boundary.py` reconstructs the exact source Cauchy form and
rank-two commutator used for boundary nonvanishing.  For the main pilot,
the producer evaluates `tau` by spectral decomposition of the even complement,
while the independent replay reconstructs the formulas and uses a direct LU
solve.  Both paths currently share `mpmath`; this is an independence
limitation. `src/p0_matrix_arb.c` and
`verifier/p0_matrix_arb_replay.c` independently enclose the finite Weil matrix
with Arb balls. These are finite diagnostics, not an asymptotic proof.

## Claim status

- RH proved here: **no**.
- New upper bound on the de Bruijn--Newman constant: **no**.
- Exact sufficient theorem isolated: **yes**.
- Connes--Consani--Moscovici finite matrices implemented and independently
  ball-replayed here: **yes, finite cases only**.
- Source-normalized finite prolate comparison state implemented: **yes**.  The
  general path remains a diagnostic Galerkin approximation; checkpoint 0.56
  separately encloses the infinite-Jacobi labels `0,4` and projected
  coefficients only at `lambda=2`, `N=3,4`.
- Fourier projection rate on `N=C*ceil(lambda^2)`: **yes, qualitatively from
  the pinned prolate approximation theorem, with an exact finite inequality;
  an effective interval constant for the prolate supremum remains open**.
- Distinguished-state Mellin projection on
  `N_star=O((log(lambda))^2)`: **yes with an explicit finite tail and the
  source scalar `Xi/4`; this does not transfer any signed floor, graph-spill
  rate, or equation (5.2) estimate to the smaller schedule**.
- Defect-relative ordinary and log-weighted projection on the locked
  half-integer exponential schedule: **yes for fixed labels `0` and `4`, from
  a separately pinned uncertainty theorem; this is not a signed Weil or
  sector estimate**.
- Source Cauchy-form high Fourier coercivity and low--high coupling bound:
  **yes, with explicit constants and cutoff; no low signed sector floor is
  inferred**.
- Compact projection--projection signed Weil pairing at the geometric-mean
  defect scale: **yes on the locked schedule**.
- Both mixed outer--projection orientations at the defect scale: **yes on the
  locked schedule for the actual corrected, source-normalized combined `0/4`
  state via the two-sided radical reduction; not for individual-mode radicals
  and not as a generic multiplier theorem**.
- Physical outer sampled-tail conditioning and all-range correlation:
  **yes; the hard-endpoint `H1`/bounded-variation route remains invalid, but
  the separate complete weighted-translation and source-locked spectral
  argument proves `|W_Z(O,O)|/d_8 -> 0` without assuming zero reality or Weil
  positivity**.
- Complete locked-schedule remainder quadratic energy:
  **yes, `q_lambda(p,p)=o(d_8)` after all four P/O pairings are combined; this
  is not a residual-action estimate, signed sector floor, or equation (5.2)**.
- Complete locked-schedule absolute remainder at the first odd defect scale:
  **yes, `epsilon_lambda=||R_lambda||_Z^2=o(d_6)`, so the common
  normalization-free shift is odd-scale negligible**.
- Projected-state lower normalization and normalized odd-scale shift:
  **yes, `||P_N k_lambda^+||` tends to the nonzero fixed source-normalized
  limit, so `U_Z=epsilon_lambda/a^2=o(d_6)`; this is not a graph-dual
  residual action bound, either signed sector floor, a shifted Schur theorem,
  or equation (5.2)**.
- Full-`Y` exterior sampling Gram:
  **yes with the unconditional explicit fallback
  `C_ext<=B_abs*lambda^2/(2*d_LS)`; no at the required scale, because the
  resulting alignment bound is `B_abs*lambda^4/(4*d_LS^2)` and is
  exponentially too large**.
- Phase-sensitive parity multiplier/Schur reduction:
  **yes as an exact reduction; the required polynomial phase-volume bound and
  positive finite Schur floors are not proved, and the only locked global
  phase-volume upper bound is exponential in `lambda`**.
- Matched coframe/high-moment alternative: **yes as an exact normalized
  adjoint-tail/minor and complete-sign moment reduction; no physical matched
  minor, high-space margin, or sector floor is proved**.
- Matched breakpoint/directional-moment audit: **yes for the exact arithmetic
  Fourier rows, full-rank confluent jump jets, finite-projection
  countermodel, sharp moment-width threshold, and conditional odd
  directional criterion; no actual prolate determinant, logarithmic-width
  multiplier theorem, directional reserve, or signed floor is proved**.
- Soft-defect/prolate-angle reduction: **yes for lower-defect clipping without
  an upper spectral bound, the exact leverage-excess and capped odd-pole
  criteria, the ambient central-outlier obstruction, augmented determinant
  identities, and the normalized adjoint-tail criterion; no physical
  leverage-excess estimate, actual odd reserve, matched prolate coframe, or
  signed floor is proved**.
- Physical-defect/adjoint-tail reduction: **yes for exact cap cancellation,
  the weighted-capture least-squares identity, the necessary central-band
  trace scale, the exact coframe rank-one correction, and the floor-shifted
  odd Schur/chord/moment identities; no physical weighted-capture bound,
  growing-family coframe reserve, actual shifted odd reserve, or signed floor
  is proved**.
- Log-feature capture/alignment reduction: **yes for the factorial
  central-band polynomial tail, its exact principal-angle trace bound, the
  targeted right-inverse source-tail implication, the odd-pole Taylor bound,
  and the shifted odd geometric/alignment identities; no actual feature
  angle, source-tail rate, exterior weighted capture, shifted odd reserve, or
  signed floor is proved**.
- Complete soft-symbol, graph-spill, and odd harmonic-short reduction:
  **yes for the exact gray/difference and layer identities, one-projector
  effective tail, periodic-BV spill criterion, odd edge filters, and
  first-Riesz obstruction; no actual graph spill, exterior alignment,
  retained-excess harmonic short, odd reserve, or signed floor is proved**.
- Exact minimum central graph spill and smaller central cutoff: **yes; the
  optimum is the covariance-weighted tangent trace, `M=ceil(lambda*L)` is
  sufficient for the non-graph tail, and `epsilon/gamma=o(1/lambda)` is a
  source-metric sufficient condition; no such ratio is proved for the
  prescribed arithmetic--prolate family**.
- Annular exterior gray-mass audit: **yes; `A*chi=Omega(lambda)` in both
  parities, the surviving operator route needs squared closed-projector
  angle `O(L/lambda)`, and the hard-cut layer average is itself
  `Omega(lambda)`; no actual multi-column exterior alignment or coframe is
  proved**.
- Favorable locked odd-pole subsequence: **yes unconditionally, with an
  effective complete-form transfer to the fixed locked exponential bandwidth
  from the first parameter and normalized pole-direction Rayleigh value at
  least `3*c0/4`; a source-selectable neutral subsequence has normalized
  pole-direction Rayleigh value tending to `2*c0`; exact high elimination
  has `o(1)` direct pole-axis feedback and leaves an
  `exp(O(lambda*log(lambda)))` retained Feshbach sign with a necessarily
  critical inverse load whose strict reserve remains unproved**.
- Prescribed residue-family coframe audit: **yes for the exact finite
  determinant/adjoint-tail criteria, unmatched-breakpoint analytic
  intersection obstruction, principal-angle necessity, and failure of the
  present periodic-BV certificate at the needed scale; no uniform angle
  bound or prescribed coframe rate is proved**.
- Simultaneous mixed-prefix capture and signed coupling audit: **yes for a
  non-effective whole-target mixed prefix at each fixed parameter, the exact
  bridge Gram, annular source-tail implication, quotient inertia theorem,
  and an exact countermodel to separated sign promotion; no effective
  diagonal schedule or signed floor is proved**.
- Odd Krylov and critical-load audit: **yes for the combined-residual moment
  test, rigorous Krylov inverse-load enclosure, conditional quantitative
  Schur floor, critical-load asymptotic, and strict unprojected prime-power
  jumps; no actual transverse lower bound, inverse-load margin, harmonic
  short, or odd floor is proved**.
- Effective mixed-prefix schedule: **yes for every finite computable target,
  using a strict outward trace stop and the source-normalized floor
  `9/(128*lambda^4)`; no useful transition-scale cost, prescribed
  residue-family coframe, or signed floor is proved**.
- Endpoint-jet augmentation: **yes at fixed parameter for a quantitative
  high-label jet right inverse, jet-zero density, exact physical-range
  equivalence, and stable transfer of an existing coframe; no new rank,
  transition-scale schedule, or derivative-tail theorem is proved**.
- Odd finite jump transfer: **yes at each fixed locked parameter for graph
  convergence, eventual nonzero finite cross vector, and a localized
  `1/K` band law; no uniform cutoff, positive-`nu` gate, transverse floor,
  or inverse-load sign is proved**.
- Residual and complementary gap proved asymptotically: **not yet**.
- Finite inversion-sector residual--Ritz theorem proved and adversarially
  tested: **yes; finite linear algebra only**.
- Finite resolvent-weighted eigenvector theorem proved and independently
  replayed: **yes; point-valued arbitrary-precision diagnostics, not interval
  certificates**.
- Exact finite source commutator theorem giving boundary nonvanishing from a
  simple even ground state: **yes; independently reconstructed Cauchy form and
  rank-two commutator, with no uniform lower bound**.
- Complete finite determinant theorem and its scale-free unit-vector
  normalization: **yes, reproduced from the pinned source; locally uniform
  convergence of those finite functions is not proved**.
- Shifted-resolvent bounds `T_j` making the remaining weighted term in (5.2)
  vanish on an unbounded sequence: **not yet**.
- Exact cancellation-preserving Chebyshev-error formula for the complete
  shifted Weil form: **yes; independently replayed at one finite pilot, but
  the kernel is sign-indefinite and no uniform bound follows**.
- Growing positive-prolate source Grams and explicit buffered high-sector
  floor: **yes; exact source-coordinate algebra from a pinned nonasymptotic
  eigenvalue bound, without physical-map conditioning or a signed comparison**.
- Leading differential-prolate oscillation hypothesis: **yes, by an exact
  sine-packet min--max certificate for every `n<4*lambda^2` on the locked
  half-integer schedule; this gives no concentration-defect lower bound or
  signed Weil floor**.
- Transition and growing corrected-source sampling/projection: **yes for the
  split plus blocks, with explicit `C_8=O(lambda*polylog(lambda))` and
  `C_rest=O(lambda^3*polylog(lambda))` and every within-block cross term
  retained**.
- Split-block quotient action: **yes on the low physical range, including
  finite synthesis factors, cross-block orientation, and
  `Gamma_low=O(lambda^3*polylog(lambda)/d_8)`; no for a usable physical-high
  metric, either signed comparison, the global action, or equation (5.2)**.
- Half-power far graph reduction: **yes for an exact `R=sqrt(N)` far floor,
  bounded Schur shear, far-shorted sampling identity, and an
  `O((1+log(lambda))/sqrt(lambda))` far sampling inverse; the pulled-back
  harmonic metric preserves the effective sampling cancellation, but no
  retained Schur sign or required retained inverse bound is proved**.
- Rotated-high graph reduction: **yes for replacing the half-power retained
  space by an honest high-coercivity cutoff of dimension
  `exp(O(lambda*log(lambda)))`, with exponentially small rank-one rotation,
  high floor `2*c_lambda+1-o(1)`, shear at most `1/2+o(1)`, and one all-shift
  retained inequality sufficient for both sign and graph control.  A
  radical-admissible Mobius lift for every finite even vector rewrites that
  inequality as the exact signed exterior-tail coframe target
  `beta_lambda >> 1/(sqrt(lambda)*polylog(lambda))`; the target is not
  proved**.
- Complete-symbol dangerous-space reduction: **yes for an exact multiplier
  projector, far floor `1/2`, and retained dimension `exp(O(lambda))` on the
  locked schedule.  The reduced all-shift constant
  `beta_lambda^mv` is positive exactly when the complete shifted even
  complement is positive, but its required quantitative lower bound is not
  proved**.
- Odd exterior-coframe and parity-Schur reduction: **yes for a
  radical-admissible lift of every finite odd vector, the exact criterion
  `vartheta_->0` if and only if `Q_--U*I>0`, and the rank-one rectangular
  parity displacement after high elimination.  An exact source-Cauchy model
  shows that this displacement is not a sign-transfer theorem.  Combining
  the lift with the pole-first complete-symbol projector reduces the honest
  odd retained dimension to `exp(O(lambda))` and gives the equivalent
  criterion `beta_(lambda,-)^mv>0`; the actual odd sign remains open**.
- Parity pullback and all-shift audit: **yes for an exact anchor-complement
  derivative congruence, a Hermitian core minus two explicit shorted
  directions, and a two-map Schur displacement for the nonmatching
  complete-symbol projectors.  Exact derivative-compatible orthogonal
  splits revert to raw Fourier coordinates.  A trace-selected common
  threshold now supplies an explicit `exp(-O(lambda))` adjacent buffer,
  constant far floors, and oriented rank-two leakage numerators; those
  numerators and the harmonic graph slopes are not yet small enough on the
  locked schedule.  A separate exact `3 by 3` model proves that an improving
  zero-shift weighted inverse need not control the required all-shift
  coframe**.
- Arithmetic two-direction reserve: **yes for an exact nonorthogonal anchor
  chart, signed weighted-PNT assembly of the pulled core and two reserve
  columns, and the single scalar criterion `rho_2<1`.  If that criterion and
  the core floor hold, the odd floor is explicit; neither is proved on the
  locked schedule.  An exact Cauchy model shows that a positive reserve
  determinant can hide two negative reserve eigenvalues**.
- Even quotient-metric covariance: **yes for the exact signed commutator,
  the sufficient margin `mu-epsilon`, and the complete boundary-Hankel/pole
  cyclic seed.  Existing action estimates control neither covariance nor
  the cyclic inverse, and an exact model shows the complete cyclic upper
  bound can lose an extra unbounded factor relative to the true all-shift
  norm**.
- Centered-zero boundary convolution: **yes for the distributional paired
  zero expansion, its absolutely convergent finite-ground convolution, and
  the exact source-anchor zero divisor with exterior and projection defects;
  the ground zero sum reconstructs its eigenvalue rather than bounding its
  boundary moment.  On the locked exponential diagonal the projected anchor
  transform tends uniformly to zero over the complete centered zero set.  A
  four-fold box-spline convolution gives exact fourth- and fifth-Riesz prime
  formulas and one-sided subexponential criteria equivalent to the
  critical-line statement, but none of those estimates is proved**.
- Centered-zero Paley--Wiener audit: **yes for multiplicity-aware uniqueness,
  impossibility of complete cardinal/Hermite interpolation at finite
  exponential type, noncompactness of every nonzero exact radical divisor,
  and collapse of the unrestricted positive sampling floor along the
  projected anchor.  None of these statements supplies the retained signed
  coframe floor**.
- Fixed-index prolate defect asymptotic: **yes, qualitatively from a vendored
  and hashed Slepian source, including the eventual `d_4/d_8` scale; no
  effective threshold, growing-index uniformity, or signed Weil floor**.
- Exact global radical and finite spectral-tail reduction: **yes; algebraic
  and noncircular, but not a positive Weil leakage estimate**.
- Prolate-defined `(2,8)` Schur-window probe: **yes; point diagnostic without
  interval enclosure or an unbounded-schedule theorem**.
- Finite anisotropic matrix-Schur and forced-resolvent theorem: **yes; complex
  Hermitian and adversarially tested, with an independent formula replay, but
  no interval or uniform prolate--Weil estimate**.
- Current P0 terminal state: **`P0_INVALIDATED`**, because the locked printed
  source formulas require the documented scalar/formula repairs; this is not
  an RH conclusion.

At `(lambda,N)=(2,8)`, the diagnostic progression is
`r/Delta = 114.895444313775669157175913197`,
`r/Gamma = 0.42107222966085073402298345045`, and
`tau = 0.000679977440374583012591377029228`, while the odd-sector Ritz margin
remains positive.  At the main `(2,2)` pilot the corresponding progression is
`549.528066899644295... -> 2.45330491932471507... ->
0.112682831365121419...`, followed by the sharper
phase-aligned chordal bound
`D(tau)=0.112150646561454600...`.  These are
encouraging finite diagnostics,
but that displayed prolate state and weighted solve are not interval-enclosed,
and no unbounded-schedule estimate follows from them.  The later checkpoint-
0.56 `lambda=2,N=3,4` state balls do not retroactively enclose this `N=8`
solve.
The next deterministic point on the same schedule, `(lambda,N)=(3,18)`,
fails closed because both shifted sector margins are negative; it therefore
supplies no weighted inverse value.  This makes the present finite evidence
mixed rather than monotone.

Any numerical agreement, including agreement to many digits, is evidence for
the bridge and not a substitute for the uniform analytic estimates.

## Checkpoint 0.52: boundary-discrepancy convolution reduction

Checkpoint 0.52 sharpens the remaining checkpoint-0.51 ground-orientation
problem to one exact signed scalar.  With

`F(t)=W(exp(t))-2*(exp(t/2)-1)-H_0(t)`

and

`H_0(t)=integral_t^infinity exp(-u/2)/(1-exp(-2u)) du`,

weak testing of the finite inversion-even ground `x` against the constant
mode gives

`C_lambda(x)+epsilon-c_*=-4*(h/X)/sqrt(lambda)`,

where `X=integral x`, `h=integral cosh(y/2)x(y)dy`, and
`C_lambda(x)=2*X^(-1)*integral_0^(2 log lambda) F(t)x(log(lambda)-t)dt`.
This is a weak compressed identity, not a pointwise uncompressed
eigen-equation, and `C_lambda` is a signed quotient rather than an
expectation.

Consequently, assuming `X!=0` and `h/X>0`, the desired bound `h/X<=B` is
equivalent to the one-sided window

`c_*-epsilon-4B/sqrt(lambda)<=C_lambda(x)<c_*-epsilon`.

The note also proves the completed-xi ordinary-Laplace identity for
`Re(s)>1/2`; meromorphic continuation to a zero-sensitive region supplies no
estimate.  The 80/160-digit pilot is independently replayed from source
parameters by a direct unsplit matrix assembly and a Fubini-tail convolution.
It is a finite point-arithmetic regression, not the missing uniform
`lambda^(-1/2)` localization theorem.  Equation (5.2), both complementary
sector floors, and locally uniform determinant convergence remain open, and
the formal state remains `P0_INVALIDATED`.

The post-0.52 theorem in
`notes/CRITICAL_HEIGHT_ANCHOR_TRANSFER_THEOREM.md` proves the projected
anchor limit `H(p)->1/8` with an explicit finite error and gives exact
anchor-to-ground transfer bounds.  It corrects the dependency direction:
an endpoint-rate ground comparison makes the signed 0.52 window a
consequence, whereas that window is not an input to equation (5.2).  The
active analytic target is therefore a common-schedule signed
graph-resolvent theorem proving both strict sector signs and the required
vector-specific shifted solve.

Two post-0.52 reductions now put that target on one schedule.
`notes/SIGNED_GRAPH_OBSERVABILITY_REDUCTION.md` proves the exact sufficient
implication
`G_+<=C_lambda*B_+^2 => a^2*tau^2<=epsilon_lambda*C_lambda`; the target
`C_lambda=O(lambda^4*polylog(lambda)/d_8)` would give the rate needed by
equation (5.2).  Independently,
`notes/ODD_FAVORABLE_EXPONENTIAL_BANDWIDTH_TRANSFER.md` transfers the
source-selected favorable odd pole direction to the same locked exponential
bandwidth with an effective error valid from the first locked parameter.
`notes/ODD_LOCKED_HIGH_FESHBACH_REDUCTION.md` shortens the remaining odd sign
to a retained low Feshbach inequality.  Its direct high pole-axis feedback is
`o(1)`, and a source-selectable neutral subsequence fixes the distinguished
raw-low Rayleigh limit at `2*c0`, but neither fact signs the other retained
directions.  On the even side,
`notes/LOCKED_HALF_POWER_GRAPH_SCHUR_REDUCTION.md` now closes the far sampling
inverse and transfers the complete sampling map through a harmonic-lift
metric.  The sharper
`notes/LOCKED_ROTATED_HIGH_GRAPH_SCHUR_REDUCTION.md` reduces the retained
dimension to `exp(O(lambda*log(lambda)))` and packages its two missing claims
as one all-shift inverse inequality.  An annular correction to the full
Mobius right inverse makes a global radical lift for every finite even
vector, so this inequality is exactly a signed exterior-tail coframe floor,
or equivalently a cancellation-preserving weighted-PNT discrepancy inf--sup.
This is a matrix-wide reformulation of the original Schur family, not a new
lower bound.  The continuous-discrepancy model has unbounded negative index
on exact finite Fourier test spaces, so no magnitude-only discrepancy
argument can prove it.  The retained shifted even and odd signs and the
cancellation-preserving retained inverse therefore remain open, and the
formal state remains `P0_INVALIDATED`.

Several later audits sharpen this endpoint without changing its status.
`notes/LOCKED_MULTIPLIER_DANGEROUS_EXTERIOR_COFRAME_REDUCTION.md` uses the
complete source multiplier to define an exact dangerous projector, gives a
far floor `1/2`, and reduces the retained dimension to `exp(O(lambda))` on
the locked schedule.  Its sharp constant `beta_lambda^mv` is positive
exactly when the shifted even complement is positive; the needed bound
`beta_lambda^mv >> 1/(sqrt(lambda)*polylog(lambda))` remains unproved.
`notes/ODD_RADICAL_PARITY_SCHUR_REDUCTION.md` extends the radical lift to
every finite odd vector and derives both the odd all-shift exterior-coframe
criterion and an exact rank-one parity-coupled Schur displacement.  A
three-dimensional source-Cauchy countermodel has a positive even block and a
negative odd block, so the displacement alone cannot transfer sign.
Finally,
`notes/CENTERED_ZERO_PALEY_WIENER_INTERPOLATION_OBSTRUCTION.md` proves that
the complete multiplicity-aware centered-zero jets are a uniqueness set for
each finite Paley--Wiener type, but cannot support a cardinal or Hermite
interpolation family.  The projected anchor also forces the unrestricted
ordinary sampling floor to be at most `U_Z=o(d_6)`.  These are exact route
obstructions, not the retained signed coframe bound.

`notes/ODD_MULTIPLIER_DANGEROUS_EXTERIOR_COFRAME_REDUCTION.md` now combines
the sharp odd complete-symbol split with the arbitrary-vector odd radical
lift.  The negative pole is retained as one explicit direction, the far
block has floor `1/2`, the retained dimension is `exp(O(lambda))`, and
`beta_(lambda,-)^mv>0` is exactly the still-open shifted odd sign.  The
zero-discrepancy odd comparison has unbounded negative index, so a
magnitude-only PNT envelope cannot orient this coframe.

`notes/PARITY_DANGEROUS_ALL_SHIFT_METRIC_ROTATION_AUDIT.md` records the
common parity cost and the exact cyclic-enlargement bound for the shift
supremum.  Its rational `3 by 3` family has a positive complete block, a
uniform far floor, rank-one danger, and a zero-shift weighted inverse tending
to zero, while an intermediate shift makes the all-shift coframe tend to
zero.  Thus an endpoint inverse is insufficient without metric commutation
or control of the complete cyclic enlargement.

`notes/ANCHOR_COMPLEMENT_PARITY_PULLBACK_REDUCTION.md` pulls the odd
block back through the derivative restricted to the projected-anchor
complement.  It isolates the common finite sign problem as an even
complement, one Hermitian core, and a `2 by 2` shorted reserve.  With the two
nonmatching multiplier projectors the exact identity instead contains two
transfer maps and an explicit leakage.  Exact derivative-compatible
orthogonal splits are necessarily raw coordinate spans.  The combined
phase-volume trace now selects a deterministic threshold in `[1/2,3/4]`
with both adjacent gaps at least `exp(-O(lambda))`, far floor `1/4`, and the
same `exp(O(lambda))` retained cost.  Factoring the boundary commutator also
replaces its global norm by two oriented loads.  The remaining open estimate
is to make those loads, the pole row, and the harmonic graph slopes overcome
the explicit reciprocal-buffer loss.  The endpoint audit now gives an exact
Gram-determinant formula for each combined rank-two load, preserving the
cancellation before absolute values.  It also supplies a positive compactly
supported symbol family with a fixed trace-selected gap but second oriented
load of order `sqrt(N)`.  Hence trace selection and boundary rank alone cannot
close the leakage estimate.  One-sided saturation kills one cross block but
decomposes the survivor into an old-base term and an unproved residual
derivative-metric covariance.  In the paired atom model the old-base
cross-block grows at the endpoint scale before composition by the harmonic
slope; that final composition remains unproved.  A separate abstract
base-zero model shows that the covariance itself has no structural bound.
The corrected projector
uses the Moore--Penrose inverse of
`i_+^*T^*(I-P_0)Ti_+`; exact Fraction tests now cover a genuinely singular
residual Gram, the complete surviving term, the positive saturated block,
and its cyclic metric leakage.  Subject to its explicit frequency and
positive-`alpha_C` checks, a cancellation-preserving high-frequency witness
further shows that small `nu_2` forces the actual retained boundary vector
`P_-^0r_v` to beat the explicit `sqrt(N)` endpoint scale up to the displayed
source factors.  The same
condition has an eigenvector-free form as a boundary-leverage excess for the
complete symbol `v=[g+U-m_lambda]_+`.  A separate exact `v=0` structural
model gives a pole-row norm of order `sqrt(N)` even with a maximal common
gap, so the pole orientation cannot be absorbed into the multiplier load.
The exact pole augmentation gives a stronger tradeoff: the Euclidean
combination of the normalized pole row and `nu_2/ell_*` is bounded below by
an explicit source envelope asymptotic to `sqrt(L*N)/pi` on the locked
schedule.  This rules out making both scalar loads small, but it does not
lower-bound their composition with the harmonic graph slope or prevent
cancellation between the two complete leakage terms.

The same note now reconstructs the boundary-leverage excess from
one-dimensional quadratures of the complete positive-part prime--digamma
symbol.  When `supp(v) subseteq [-Omega,Omega]` and
`omega_(N+1)>=2*Omega`, its continuum quotient has the explicit
`32*c_v^2/(9*L*N)` projection tail; the locked schedule checks these
hypotheses eventually.  It also has a sharper finite Moore--Penrose lower
bound.  A scaling
counterfamily proves that positivity, evenness, compact support, and the
adaptive trace gap alone cannot sign this quotient.  The missing theorem is
the source-specific uniform reserve `rho_infty>tau-ell_*/2`; it is presently
unproved.  Rounded 60/120-decimal small pilots have negative raw excess at
`(lambda,N)=(1.5,5),(2,4),(2,8),(2,12)`, so the coarse positive-part lower
bound is vacuous there despite a nonzero retained boundary vector.  Those
point-arithmetic pilots are diagnostics only and share `mpmath`.

The actual-symbol analysis now gives the explicit finite, uniform bound
(15.8), hence the honest asymptotic bracket
`exp(-(8+o(1))*lambda)<=rho_infty<=(4+o(1))*lambda`.  The signed-PNT central
lobe alone has `rho_c~0.0471233973017*lambda`, but adding the nonnegative
outer symbol is not monotone for this quotient: its boundary vector can
anti-align with the central vector.  The missing source estimate is exactly
a uniform finite-height bound on that outer covariance, equivalently on the
thresholded low-frequency transforms `k_v(s)` for `0<=s<=L`.  Scalar phase
volume and ordinary PNT do not provide it.

A growing-window refinement now proves more without changing that frontier.
For every even `M->infinity` with `M=o(L)`, the actual restricted source
profile converges uniformly to `4*(cos x)_+` on `|x|<=pi*M`, and its exact
boundary quotient satisfies
`rho_infty(v_M)~(2/pi-1/2)*lambda`, uniformly in the live shift.  The
asymptotic survives the finite Fourier projection when `N/M->infinity`, and
the immediately adjacent growing annulus has only lower-order covariance
with the core.  The remaining farther symbol is uncontrolled: an
orientation-free closure would require its feature energy to be less than
`(2/pi-1/2)/4` times the core energy, but the adjacent annulus alone has
energy asymptotic to the whole core.  Thus that sufficient condition is
provably impossible even though the annulus has negligible leading
covariance; only a signed orientation estimate can preserve the gain.  A
shrinking auxiliary threshold window can force the scalar
boundary excess positive exactly, but its buffer becomes exponentially
small and the second oriented load becomes large on the locked diagonal;
this rules out a small-`nu_2/ell_*` use of that workaround.  Conversely, an
exact shrinking-window family has fixed positive scalar excess and
divergent `nu_2/ell_*` while both composed leakage terms cancel for every
shift.  Numerator size in either direction is therefore not the missing
orientation theorem.

The recurrence audit makes the missing source input sharper.  A single-atom
surrogate preserving the exact archimedean term, inclusive total prime mass,
CND structure, peak, envelope, live shift, and the uniform `M=o(L)`
growing-core asymptotic has
`rho_infty~32*Sigma_lambda^(-3/2)/(15*pi^(3/2))`; those data alone are
therefore compatible with a quotient tending to zero.  What the surrogate
changes is the individual `log(n)` inventory.  For the actual inventory,
the explicit FKS remainder extends the source profile to
`T_lambda=exp(0.8476836*sqrt(L)/(4*sqrt(2)))`.  The resulting mesoscopic
core has
`||r_T||^2~(1/2-4/pi^2)*lambda^2*L^2/(4*pi^2)` and
`rho_infty(v_T)~1.5595558887*lambda/sqrt(L)`.  Its sign-sensitive transform
is the combined Bessel/exponential envelope
`2*K_0(|s|/2)/pi^2-exp(-s/2)*1_(s>0)/2`.

This larger core also exposes a genuine cancellation hidden by the earlier
adjacent-annulus estimate.  For
`M=2*floor(sqrt(L)/2)`, the annulus between the growing and mesoscopic cores
has normalized covariance tending to
`-1/(2*(2/pi-1/2))`; adjacent-annulus near-orthogonality cannot be iterated.
Nevertheless, reusing the centered finite mean-square theorem on dyadic
intervals, an explicit FKS buffer, and the exact separated boundary kernel
proves the complete continuum residual floor
`||r_v||^2>=(1/2-4/pi^2+o(1))*lambda^2*L^2/(4*pi^2)`, uniformly in the live
shift.  Thus global residual cancellation is no longer the frontier.
A second dyadic use of the same centered mean-square theorem proves that
the complete feature energy below
`Y_lambda=lambda^2/(L*log(L))` is `o(lambda^2*L^2)`.  The remaining frontier
is the endpoint-weighted finite-orbit excursion mass above this
near-quadratic height.  An independently audited prime-torus moment bound,
self-contained logarithmic-Hilbert mean value, and exact positive-part
inequality make the standard higher-moment repair fully finite.  Optimized
at block height `X=(lambda^2)^a`, that explicit bound gives only
`O(lambda^2*L)` at `a=1` and remains `exp((2+o(1))*lambda)` at the top of
the support.
This stops that particular bound chain; it does not show the actual tail is
large or rule out a source-specific one-sided method.

The finite bridge can now bypass that global tail.  On the explicit schedule
`N=ceil(lambda*L^3)`, the positive-part symbol above
`Y=lambda^2/(L*log(L))` has even compression norm
`O(L^6*log(L)/lambda)=o(lambda^(-1/2))`, with still smaller odd and boundary
tails.  A localized feature inequality retains the complete mesoscopic
boundary floor inside every fixed dangerous spectral window without using
the full tail energy.  The same estimates transfer a full shifted solve from
the `|t|<=Y`-truncated system by an exact resolvent residual bound.  This is
a genuine finite-compression reduction at the `lambda^(-1/2)` action scale,
but a vanishing tail norm need not be small relative to a much smaller
shrinking sector gap.  The source-normalized first prolate correction now
removes the schedule-transfer issue asymptotically: a direct quasimode
calculation gives
`h_lambda=h+lambda^(-2)*g_1+O_L2(lambda^(-4))`, where
`g_1=x^2*(201-414*pi*x^2+224*pi^2*x^4-32*pi^3*x^6)*exp(-pi*x^2)/128`.
It is Fourier invariant with zero value and integral, and
`widehat(E(g_1))(z)=(2*z^2-21)*Xi(z)/(128*pi)`.  The Hermite quasimode
recursion now extends this calculation to every fixed order: every source
correction is Fourier invariant, vanishes at zero, has zero integral, and
its arithmetic image is rapidly decreasing in logarithmic coordinates.
High-order periodic projection and the existing compact-BV sampler therefore
give, on the same polynomial schedule,
`e_(lambda,N)=O_A(lambda^(-A))` and `U_Z=O_A(lambda^(-A))` for every fixed
`A`.  A growing-order audit now proves that the recursion is genuinely
Gevrey-1: its unique highest Hermite path has coefficient
`sqrt((n+4j)!/n!)/((64*pi)^j*j!)`, and truncation at a small multiple of
`lambda^2` leaves `O(exp(-c*lambda^2))` in source `L2`.  Analytic-strip
projection then sharpens the existing `N=ceil(lambda*L^3)` schedule to
`e_(lambda,N),U_Z=O(exp(-c*lambda*L^2))`; on the still-polynomial schedule
`N=ceil(D*lambda^2*L^2)` they are `O(exp(-c*lambda^2))`.  These bounds are
qualitative and non-effective and do not prove the truncated sector floors
or the solve.  The next obstruction is the
signed angle between the two rank-one graph loads, for which scalar norms
allow exact cancellation.  Consequently no graph estimate follows yet.

The first truncated-sector gate is now explicit.  In the weighted-PNT
normal form `Q=c_nf*I+A_tail-T_D`, testing the first odd sine shows that any
fixed odd floor forces
`(4*pi/L)*int_0^L D_lambda(h)*(1-h/L)*sin(2*pi*h/L)dh` below a fixed negative
constant.  The exact inclusive prime-power sum for this moment is recorded,
as are the full Loewner floor, cross-action, and projected-coherence
conditions.  Its exact Perron kernel is
`-4*omega^2/(L*(z^2+omega^2)^2)`.  A zero-table-free residue and Landau
case split proves that, if there is no right-half zero, the moment is
`c_nf+pi^2*zeta(3,5/4)/L^2+O(L^-3)`, while a right-half zero makes its
limsup and liminf infinite.  Thus a fixed odd floor is impossible uniformly
for all large parameters and, in the critical-line branch, along every
unbounded schedule.  Only a shrinking-floor route is compatible with the
target.  This is a stopping theorem and an equivalent critical-line
criterion, not a proof of that criterion.

The live-shift and odd-floor audits are now sharper on the same polynomial
schedule.  If `Z` is the paired zero-evaluation map, radicality gives
`U_Z=||kappa_N||_Z^2` exactly.  The first-correction theorem proves the
previously missing positive projection improvement, and the growing-order
Gevrey theorem strengthens it to exponential absolute decay.  A fixed
comparison shift is nevertheless unusable because
the target odd floor also tends to zero.  In the no-right-zero branch the
first odd Rayleigh value is an exact critical-zero Gram of generic order
`L^(-3)`, with no uniform lower coefficient.  Exact `d`-mode annihilators
make the full growing-sector minimum smaller than every fixed power of
`L^(-1)`; a degree proportional to `L` gives an exponential upper witness
below the present far-tail envelope provided the first ordinate exceeds the
exact threshold `3*pi/(4*atanh(1/sqrt(2)))`.  The current source lock does
not certify that small initial zero-free interval, so this last comparison
remains conditional.

The apparent signed shortcut also collapses on the branch that must be
handled: there `q_N=U_Z/2`, so cancellation cannot improve the positive
sampling energy.  Any admissible shift must satisfy the original relative
inequality `U_N<mu_(N,-)`, where the mandatory choice is the lower
two-vector Ritz value `u_N` and any replacement `U_N` must be a
source-reconstructed variational upper bound for the even ground.  The
older inequality `q_N<mu_(N,-)` is stronger and remains sufficient, but is
not required by the direct bridge.  Proving a small signed scalar without
comparing the actual Ritz upper bound to this super-polynomially collapsing
odd minimum does not supply the shrinking floor, solve, or graph
orientation.

The conditional odd zero Gram now has an exact Cauchy-minor formula.  It
turns a lower-frame proof into quantitative separation of distinct zero
ordinates and anti-resonance with the carrier lattice `2*pi*Z/L`.  The
pinned multiplicity-aware zero count supplies a coarse linearly large
one-separated subset, but not carrier-scale conditioning.  Exact log-sine
averaging nevertheless selects an implicit unbounded schedule with a
strictly positive Cauchy minor.  Its lower bound is only
`exp(-O(exp(L)*L^7))`, far below even the exponential prolate sampling
upper bound.
Conversely, one fixed symmetric all-critical carrier-lattice multiset can
satisfy the same `T*log(T)+O(log(T))` count while making the odd Gram exactly
singular along an infinite preassigned length sequence.  This is a logical
count-only countermodel, not a claim about the zeta zeros.  Together the two
results show that density plus schedule selection gives rank, not the
missing source-specific relative frame theorem.

There is now a cancellation-preserving alternative to the generic frame
bound.  The source Cauchy commutator identifies the odd block exactly with
the derivative-metric pullback of an oblique boundary compression of the
even block, and gives
`det(Q_--z)=det(Q_+-z)*<eta,(Q_+-z)^(-1)e_0>`.  For the projected prolate
state, set `r=(Q_+-q)kappa`, `x=Dkappa`, and
`s=Dr-(delta kappa)*beta`.  Then `q<mu_-` is equivalent to positivity of the
transverse compression `B` of `Q_--q` and the single strict Schur inequality
`<x,s>/||x||^2-<c,B^(-1)c>>0`.  This retains the combined source
cancellation and is the stronger `q`-shift sufficient gate.  The actual
direct gate is the corresponding statement at a source-derived Ritz upper
bound `U<=q`, as recorded at checkpoint 0.54 below.  Exact positive Cauchy
models show that abstract parity
interlacing, an even ground, and an arbitrarily small ordinary residual do
not imply the gate; the transverse signed floor and inverse-weighted
orientation are the precise open inputs.  Even strengthening the model to
an exact positive Fourier-evaluation Gram does not sign the boundary Weyl
residues: a reflected integer-multiplicity `N=1` example has one negative
residue and places the odd root above both even roots.  Detailed arithmetic
placement of the actual ordinates, or a direct prime-side orientation
estimate, remains indispensable.

Logarithmic differentiation of the exact global radical does not bypass
this gate.  If `p=P_N C K`, `x=Dp`, and `d=delta p`, then the odd samples of
`x` are exactly the ordinate-weighted even samples of the boundary-zero
primitive `p-d*e_0`.  The endpoint sign and factor two are fixed by direct
integration by parts.  On `N=ceil(lambda*L^3)`, differentiated Fourier-tail
estimates give the limiting moment
`||K_infinity'||^2/||K_infinity||^2 =
int t^2|Xi(t)|^2 dt/int |Xi(t)|^2 dt`, while the finite endpoint trace is
flat to every fixed inverse power.  Neither fact is relative to the much
smaller sampling energy.  After ordinate weighting the separate `e_0`
samples need not be square summable under the admitted hypotheses, so the
endpoint correction must remain combined.  A positive derivative Rayleigh
value controls only one direction of the Schur matrix and supplies neither
its transverse floor nor its inverse-weighted coupling bound.

## Checkpoint 0.53: tail-discrepancy transverse Schur audit

The zero-side follow-up now states the corresponding all-vector target
exactly.  On the branch where all nontrivial zeros are on the critical
line, the odd minimum is one half of the infimum of the ordinate-weighted
even sampling norm over the boundary-zero hyperplane.  The currently pinned
finite-height line verification and multiplicity-aware count certify only a
finite low-zero Gram and coarse one-separated nodes.  They do not control
the signed high-zero remainder, the carrier-scale frame, or the endpoint
ratio needed for the projected derivative direction.  In addition, that
direction gives an upper bound on the odd minimum, so even a favorable
directional estimate has the wrong quantifier for the required floor.

All higher odd derivatives and the cancellation-preserving boundary Krylov
chain have also been closed algebraically.  If all positive Fourier
coefficients are nonzero, the first `N` odd derivatives form a Vandermonde
basis, and their complete cross-energy matrix is congruent to `Q_--qI`.
If `Dkappa` is cyclic, moments through order `2N-1` reconstruct both the
transverse compression and the inverse-weighted endpoint load.  These are
exact finite criteria, but at full dimension they are equivalent to the
original shifted odd sign.  An exact positive Fourier-evaluation Gram shows
that every displayed derivative diagonal energy can be positive while the
cross-energy matrix is indefinite.

The prime-side follow-up gives a second exact normal form without splitting
the endpoint residual.  With
`F_tail=D_lambda-H_tail`, the scalar-deleted Weil form is
`int_0^L F_tail(t)*d< f,K_t g >/dt dt`; the prime-power atom at `L` is
annihilated by the zero-extension correlation, both endpoint terms cancel,
and the archimedean tail remains combined inside `F_tail`.
Consequently the transverse block, combined vector
`D(Q_+-q)kappa-(delta kappa)beta`, and its inverse Schur load are all
functionals of this same cumulative discrepancy.  A genuine single-prime
killed-jump model has positive unshifted Dirichlet form, positive directional
and transverse scalars, and a negative live Schur short.  Thus the remaining
theorem is source-specific: prove the complete signed cumulative-discrepancy
inequality for the actual projected state on one common unbounded schedule.

The harmonic audit reconstructs the next orientation as a screened endpoint
feature overlap and keeps the `T_a`/positive-pole cancellation in one
Sherman--Morrison formula.  A rational family with fixed gaps, positive far
floors, and the source-form rank-two displacement has pole forcing of order
`M` but composed leakage of order `1/M`; its two leakage terms cancel for
every shift.  Thus the large pole--multiplier load cannot be promoted to a
composed lower bound without a new source-specific feature-overlap theorem.
The exact Green transport formula shows that this overlap depends on a
transported Green vector, two signed boundary moments, and the opposite
harmonic lift.  Moreover, the positive feature and every negative
multi-lobe core are pointwise orthogonal before compression; their only
interaction after compression is a signed Hankel defect plus the pole.

`notes/ARITHMETIC_TWO_DIRECTION_RESERVE_NORMAL_FORM.md` reconstructs the
pulled odd reserve entirely from source quantities.  An explicit oblique
anchor chart diagonalizes the derivative, keeps the complete signed
weighted-PNT residual, and reduces reserve positivity to
`rho_2=lambda_max(Z^*P_hat^(-1)Z)<1`.  This gives an explicit odd floor when
proved.  The note does not prove the core floor or `rho_2<1`; its exact
`N=2` Cauchy model rules out using the reserve determinant alone.  The two
conditions together now collapse exactly to positivity of the pole-deleted
odd operator `M=gI+T_a-T_v` and the Green gate
`1-2<p,M^(-1)p>0`.  The pulled forcing satisfies
`<T^*p,(T^*MT)^(-1)T^*p>=<p,M^(-1)p>`, so its endpoint growth cancels through
the inverse.  A one-mode family flips the gate while keeping all
`v`-boundary data fixed; an oriented estimate for the complete pole-deleted
operator remains indispensable.  The gate is exactly the transverse Schur
short: if its short is `s` and `mu=||p||^2`, then its margin is
`s/(2*mu+s)`.  On the source-selectable neutral diagonal every successful
margin is at most `(2*c0+o(1))/lambda`; a fixed Green reserve is therefore
not available.  Both signed Green moments now have exact inclusive
weighted-PNT/prolate replay formulas, but they evaluate the same uncontrolled
harmonic direction `e-D^(-1)c`; scalar Green data and the source Cauchy
displacement do not fix its transverse sign.

`notes/EVEN_QUOTIENT_METRIC_COVARIANCE_AUDIT.md` tests the two remaining
all-shift repairs.  It gives the exact signed source formula for
`[Delta^(-1),B]`, a sufficient covariance margin, and the exact
boundary-Hankel/pole seed of the complete `B`-cyclic enlargement.  Neither
source covariance nor small cyclic spread follows from the current
estimates.  In the exact metric-rotation family the cyclic zero-shift upper
bound is `Theta(M^2)` while the actual all-shift norm is only `Theta(M)`.

Separately,
`notes/CENTERED_ZERO_BOUNDARY_CONVOLUTION_OBSTRUCTION.md` inserts the paired
Hadamard product into the checkpoint-0.52 Laplace identity.  For the finite
ground the resulting absolutely convergent centered-zero convolution cancels
back to the ground eigenvalue, so it supplies no independent boundary-moment
estimate.  The full BV-corrected source anchor does vanish at every centered
nontrivial zero; restriction and Fourier projection leave exactly an exterior
transform defect and an interior projection defect.  For a fixed four-fold
box-spline profile, boundedness, either one-sided subexponential bound, or a
fifth-Riesz subexponential primitive is equivalent to the critical-line
statement.  The prime side is an exact fourth finite difference of weighted
Riesz sums and the full archimedean series.  The pinned PNT gives only
exponential type `1/2`, and positive monotone countermodels satisfy that same
magnitude envelope while violating either one-sided bound.  Separately, the
projected source anchor is now proved to have transform tending uniformly to
zero at every centered zero on the locked diagonal.  That is a genuine
uniform approximate divisor, but transferring it to the `lambda`-dependent
finite ground still requires the open ground comparison and shifted inverse.

## Checkpoint 0.54: Ritz-shifted singular Schur frontier

The direct bridge has now been put at its actual live scalar.  Let `U` be a
source-reconstructed variational upper bound for the lowest even eigenvalue,
with the mandatory choice `U=u` equal to the lower two-vector Ritz value,
and put `t_U=q-U`.  For `x=Dkappa` and the combined endpoint vector

`s_q=D(Q_+-q)kappa-(delta kappa)beta=(Q_--q)x`,

the unsplit transport is

`s_U=s_q+t_U*x=(Q_--U)x`.

In the endpoint Schur chart this gives exactly

`B_U=B_q+t_U*I`, `a_U=a_q+t_U`, and `c_U=c_q`.

Thus the mandatory odd condition is `U<mu_-`, equivalently
`B_U>0` and `a_U-<c_U,B_U^(-1)c_U>>0`; the old `q<mu_-` condition is
strictly stronger.  The Schur short is increasing in `t`, with derivative
`1+||(B_q+tI)^(-1)c_q||^2`.  For the first Ritz value,
`t(c_R-q+t)=r^2`, so this improvement is reconstructed from the combined
even residual rather than chosen freely.

A larger even Krylov space can legitimately lower `U`.  The exact
Krylov--Feshbach and moment-pencil formulas show how a declared polynomial
trial vector gives a noncircular upper bound before cyclic closure.  An exact
source-Cauchy `N=3` model has a three-vector Ritz value satisfying both sector
comparisons while the mandatory two-vector value fails the odd one, and the
three-vector space is provably not invariant.  At cyclic closure the method
reconstructs the ground eigenpair on the cyclic reducing subspace; a second
exact model shows that the complete comparison-state moment sequence can be
blind to a lower orthogonal reducing complement.  Higher Krylov lowering is
therefore a real scalar route, not a sector-floor theorem.

The cumulative-discrepancy analysis also has a sharp stopping line.  For
`H(s)=xi'(1/2+s)/xi(1/2+s)`, the paired Hadamard product gives
`Re H(s)>0` on the source-safe half-plane `Re(s)>=1/2`, producing a positive
damped derivative-transfer Gram.  Extending this same holomorphic
positive-real property to all `Re(s)>0` is equivalent to the missing
zero-location statement, so it is not an unconditional bypass.  Moreover,
the two independent assembly paths at `(lambda,N)=(2,4)`, which share the
FLINT/Arb arithmetic family, enclose an exact rational, non-prolate even state
with positive derivative scalar and positive transverse block but negative
Schur short at both `q` and the mandatory `u`.  This is a route obstruction
for state-independent passivity, not an asymptotic counterexample for the
projected prolate state.

For that projected state, the fixed-order prolate expansion yields an
explicit normalized derivative correction, and every formal derivative
correction is a global odd Weil-radical.  These corrections generate
arbitrarily large fixed-dimensional transverse near-null spaces.  Whenever
`B_q` is positive, any fixed number of its lowest eigenvalues is smaller
than every algebraic power; after Ritz transport they lie at
`t_U+O_A(lambda^(-A))`.  The scalar, cross, and combined endpoint action are
also beyond all algebraic orders, while the undifferentiated residual keeps
its admitted exponential upper bound.  These are absolute estimates only:
the inverse load is a quotient of unresolved small quantities, and finitely
many discrepancy moments cannot determine the growing carrier transforms
sampled by the exact matrix.  Current source-pinned PNT estimates do not sign
either shifted Schur inequality.

The unadmitted Suzuki operator audit identifies one legal transfer after
deleting the derivative zero mode.  With `K=(DD^*)^(-1)`, `S_c=G+cK`, and
`H=K^(-1/2)G K^(-1/2)`, both a boundary resolvent element and the canonical
trace obey exact spectral recentering, for example
`m_c(z+c)=m_0(z)`.  This also removes any benefit of the positive shift.
Bounded boundary vectors have insufficient total residue mass to reproduce
the full logarithmic-derivative divisor, the legal poles are those of the
localized Weil operator rather than Suzuki's differential extension, and
the required Hilbert--Schmidt bound and all resolvent-moment limits remain
unproved.  No Suzuki source is admitted by this checkpoint.

The remaining direct task is consequently relative and source-specific: on
one common unbounded schedule, prove the even-complement comparison
`alpha>U`, the shifted odd Schur gate `U<mu_-`, and the weighted solve in
equation (5.2), then establish the separate locally uniform determinant
limit.  Checkpoint 0.54 proves none of these asymptotic inequalities.  The
formal state remains `P0_INVALIDATED`.

## Checkpoint 0.55: complete leakage, orientation, and live Krylov audit

The fixed-dimensional higher-Ritz route is now written directly in the
unnormalized source state.  If `p` is the projected source-normalized state,
`a^2=||p||^2`, `R=K-p`, and `ell_R` is the Riesz vector of the complete
radical-tail functional, then

`Qp=-ell_R`, `M_0=a^2`, `M_1=W_Z(R,R)`, and
`M_j=<ell_R,Q^(j-2)ell_R>` for `j>=2`.

These moments give the exact Hankel pencil for every fixed Krylov value.  In
centered coordinates, with `g=(Q-q)p`, `C=P_(p^perp)(Q-q)P_(p^perp)`, and
`sigma_j=<g,C^j g>`, the lowering `t_m=q-U_m` satisfies one raw Feshbach
equation.  For `m=3` it is an explicit cubic in
`a^2,sigma_0,...,sigma_3`, including the mandatory projection-return
subtractions.  All powers are formed only after assembling
`Q=Q_pole-Q_arch-Q_prime`.

This exact formula does not supply the missing relative scale.  The admitted
Gevrey and fixed-order estimates give upper flatness for the complete
leakage but no lower bound and no limit for its normalized complement
spectral measure.  Two exact flat families with uniformly positive even
complements have the same allowed absolute bounds while `t_m` is respectively
negligible and dominant relative to the same odd near-null scale.  Thus no
fixed-dimensional higher-Ritz versus odd-tower comparison follows from the
current asymptotic inputs alone.

The even and odd finite objects do share one exact exterior-leakage calculus.
Writing the paired absolute Gram as `A`, the signed Weil Gram as `S`, and the
anti-aligned orientation defect as `E=A-S>=0`, the live odd condition at the
same `U` is exactly

`A_--U*I>0` and
`||(A_--U*I)^(-1/2) E_- (A_--U*I)^(-1/2)||<1`.

At the lowest even Ritz value, the analogous quotient on a common space
containing the Ritz null direction is either undefined or saturated at
exactly one.  A strict common positive-Gram contraction therefore cannot
close both sides.  An exact source-Cauchy twin preserves the two-vector
moment pencil, commutator, positive absolute Gram, even-complement margin,
and positive odd transverse block while flipping the live odd Schur short.
Its synthetic paired-slot factorization is an algebraic stress test, not an
arithmetic zero-evaluation model; higher moments distinguish the twins.

There is also a positive comparison object.  The locked limiting kernel
`K(t)=E(h)(e^t)` is strictly positive: for `t>=0` every arithmetic summand is
positive, and Poisson inversion makes `K` even.  Ordinary centered Fourier
projection is not positivity preserving, whereas Fejer or Jackson averaging
produces strictly positive even finite states and admits an existence
diagonal with locally uniform transform limit `Xi/4`, without unit
rescaling.  This does not prove the odd sign because the all-imaginary-axis
criterion applies to the actual even ground line.  The exact missing transfer
is the boundary-normalized uniform estimate

`sqrt((2N+1)/L)*||x/c_x-p/c_p||_2 < min(p/c_p)`,

followed by a separate reserve from the ground value to `U`.  An exact family
with unit ground gap, vanishing trial residual, and `L2` error tending to zero
still has a negative boundary-normalized imaginary-axis transform, so
ordinary residual-gap control cannot replace this estimate.

Finally, the historical projected-prolate point replay at `lambda=2` exposes
the finite mechanism.  At `N=3`, the `q` and two-vector `u` Schur shorts are
negative, while the proper three-vector value `U_3` gives a positive short
about `2.3818e-6` before cyclic closure.  At `N=4`, the raw `q` gate already
has transverse floor about `1.1561e-3` and positive short about `2.2378e-7`;
`u` and `U_3` improve it monotonically.  Four independent Arb matrix outputs
overlap at `N=4`, but that checkpoint-0.55 replay consumes only a 35-digit
`mpmath` coefficient vector.  Checkpoint 0.56 separately encloses the
`lambda=2,N=3,4` projected coefficients; it does not retroactively enclose
the historical `U_2/U_3`, inverse-load, or weighted-solve values.

The remaining theorem is narrower but still open: prove the source-specific
anti-aligned leakage contraction, or an equivalent cumulative-discrepancy
orientation bound, together with the even complement and weighted solve on
one unbounded schedule; then prove the separate locally uniform determinant
limit.  Checkpoint 0.55 proves none of these asymptotic obligations.  The
formal state remains `P0_INVALIDATED`.

## Checkpoint 0.56: relative orientation, cone angle, and finite state balls

Absolute orientation control is now separated from the missing relative
arithmetic estimate.  For positive `C` and `0<=E<=C`,

`1-||C^(-1/2) E C^(-1/2)||
 = lambda_min(C^(-1/2)(C-E)C^(-1/2))`.

An all-`N` exact source-Cauchy synthetic family preserves the admitted Ritz,
commutator, absolute-Gram, and even-complement data while this relative slack
changes sign.  This proves a non-implication only: it is not the actual
arithmetic matrix and supplies no unbounded source schedule.

For a positive comparison transform, the exact spherical-cap calculation
gives the sharp conditional transfer gate

`arctan(tau_+) + angle(kappa,z) < arcsin(m_C(z))`.

Here `tau_+` is the even resolvent angle and `m_C(z)` is the normalized
pointwise cone margin.  The gate converts a sufficiently close actual ground
line into the positive cone, but the required source-specific closeness and
the separate shifted odd reserve remain unproved.

At `lambda=2`, a new producer and a differential-form replay independently
enclose the infinite-Jacobi prolate labels `0,4`, their source orientation and
normalization, and the projected coefficients for `N=3,4`, at 256 and 512
bits.  The first omitted Jacobi coupling is retained.  A mandatory regression
rejects unit normalization because it changes the limiting scalar.  Both
paths share FLINT/Arb transcendental arithmetic.

For `N=4`, four state balls and four independently assembled Weil-matrix
balls give

`q = 7.99356612363419941472825457581657e-8 +/- 1.38e-34`,

`||(Q-q)kappa|| = 5.29022713318068927275139926249219e-5 +/- 3.13e-34`,

and interval LDL proves

`lambda_min(Q_-)-q > 2.20064338763658005852717454104824e-7`.

This last quantity is only the finite odd-sector floor minus the raw Rayleigh
quotient.  It is not the full complementary minimum `Delta`, a projection-
error enclosure, a Krylov/Schur certificate, a scaling law, or an asymptotic
result.  Equation (5.2) and locally uniform determinant convergence remain
open, so the formal state stays `P0_INVALIDATED`.

## Checkpoint 0.57: height profile, shifted cone reserve, and uniform Jacobi tail

The positive-cone route now reaches the shifted odd sector by an exact
finite theorem.  With `B=A-U*I>0`, `g_+=lambda_min(B)`,
`tau_+=||B^(-1)b||`, and

`chi_U=<b,B^(-1)b>-(q-U)`,

a positive trial state whose cone depth dominates its angle from the
projected prolate state plus `arctan(tau_+)` gives an explicit ground-free
squared-mode pencil radius.  The inequality

`chi_U < g_+*gamma^2/R_N(gamma)`

then proves `Q_--U*I>0` without assuming an odd floor.  For the same anchor,
however, this route necessarily requires

`tau_+ < t_kappa/sqrt(1-t_kappa^2)`,

where `t_kappa` is the normalized endpoint value of the projected state.
Thus qualitative cone membership is not enough: the actual arithmetic
schedule still needs a relative endpoint-scale estimate, or a different
positive anchor.

The determinant problem has also been reduced to a first-resolvent profile.
For normalized even finite real-rooted determinants and any fixed
`0<a<b<1/2`, locally uniform convergence to `Xi` is equivalent to

`integral_a^b 2s*|S_j(s)-S_Xi(s)| ds -> 0`.

The same interval norm supplies the normal-family bound, and monotonicity
turns the integral test into a growing finite-mesh criterion.  Exact
rational countermodels show that any fixed finite set of heights is
insufficient.  In the source variables the missing statement is the
cancellation of the hyperbolic term and the actual shifted odd response
against `d/ds log Xi(is)` on one imaginary interval; that cancellation has
not been proved.  Proving it would itself establish the locally uniform
determinant limit by the criterion above; it is not followed by a second,
independent determinant-convergence obligation.

Finally, the even-Legendre prolate Jacobi tail has the exact floor
`J_c^(M)>=2M(2M+1)I`.  For `M>=ceil(2c)`, its scalar self-energy continued
fraction contracts by less than `1/1764` per retained tail step, with
terminal enclosure width at most `c^2/135`.  Together with exact
piecewise-power projection integrals, this gives a finite architecture for
turning a source-state `L2` ball into a projection-error ball.  It also shows
that `N=O(log(lambda)^2)` is not dimension-obstructed by projection.  No
source-specific projection ball on an unbounded schedule, signed shifted
solve, equation (5.2), height-profile limit, or locally uniform determinant
limit is proved.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 0.58: polylog determinant gate, two-anchor escape, and variable state ball

The determinant branch now has a weaker exact conditional target.  Write
`L=2*log(lambda)` and take any schedule with `N/L^2 -> infinity`.  If one
source-derived Ritz upper bound has both strict shifted sector signs and

`tau_U=||(A-U*I)^(-1)b||=O(L^(-5/2))`,

then the coefficient-normalized finite ground differs from the projected
prolate state by `O(L^(-5/2))`.  The origin second-jet error is merely
bounded, which bounds the complete zero-height trace; the real-axis
transform error is `O(L^(-2))`, which identifies every normal-family limit.
The off-axis-normalized finite determinants therefore converge locally
uniformly to `Xi`.  Big `O` is enough.  This is a conditional theorem: no
unbounded source schedule currently proves either strict sector sign or the
polylogarithmic shifted solve.

The source height response also has an exact cancellation identity before
absolute values: its pole/central-lattice, shifted odd-response, and target
terms combine into the total variation of one renormalized response.  A
growing mesh of source transform values suffices for the same determinant
limit.  A single endpoint value does not; an exact equal-rank rational model
passes that endpoint gate while having a different first trace.

The positive-cone branch is sharper but more restrictive.  For the projected
anchor, endpoint overlap `e` and solve enclosure `T` force the complete unused
depth below

`(e-T*sqrt(1-e^2))/sqrt(1+T^2)`.

Thus the solve must be small relative to `e`, and the Schur surplus needs a
separate `e^2/N^2` rate.  On the locked half-integer exponential schedule
only, the projected endpoint has an exponentially small upper bound.  A
polylogarithmic solve estimate alone therefore cannot certify that
same-anchor route.  An endpoint-centered Fejer direction gives a legitimate
two-anchor Ritz escape with limiting endpoint overlap `sqrt(3)/2`, but its
all-response hybrid cone reserve and rotated inverse-metric Schur estimates
remain unproved.

Finally, independent FLINT/Arb assemblies now enclose a second finite source
state at `lambda=5/2,N=3`, using exact parameter parsing,
`floor(lambda^2)=6`, labels `0,4`, and 256/512-bit replay.  The true projection
error is enclosed above by approximately `4.868665874324075e-4`; unit
normalization is rejected.  The producer uses the Jacobi recurrence and real
antiderivatives, while the verifier uses the differential form and complex
antiderivatives.  Both share FLINT/Arb, and the executable deliberately fails
closed above `floor(lambda^2)=10000`.  This finite ball is not an unbounded
schedule, a shifted Weil solve, equation (5.2), or an RH proof.  The formal
state remains `P0_INVALIDATED`.

## Checkpoint 0.59: real-axis normality, observable solve, and rotated Schur geometry

The finite determinant chain has now been re-audited directly against the
pinned source bytes.  A simple global inversion-even lowest eigenvector gives
an even entire transform whose complete zero multiset is real: the finite
self-adjoint quotient roots and the unchanged exterior lattice
`2*pi*n/L`, `|n|>N`, both matter.  If those source ground transforms converge
to `Xi/4` uniformly on one fixed real interval on which `Xi` is positive, the
zero-free interval ratio gives

`T^2*sum_rho rho^(-2) <= -log(F(T)/F(0))`.

This bounds the complete inverse-square zero trace and supplies normality on
the whole plane.  Consequently no separate origin-curvature estimate is
needed.  A complete ground correction satisfying
`sqrt(L)*||f-p||_2 -> 0` is sufficient, and the still weaker projective gate
requires only `sqrt(L)*||P_M(f-p)||_2 -> 0` and
`sqrt(L/M)*||f-p||_2 -> 0`.  The exterior lattice by itself forces
`N=Omega(L^2)` under this ratio gate.  Two isolated endpoint values are not a
substitute for uniform positivity on the intervening interval.

The full shifted solve is stronger than this determinant argument requires.
With `B=A-U*I`, forcing energy `E_U=<b,B^(-1)b>`, and bounded-frequency
leverage

`L_T(U)=sup_|t|<=T <g_t,B^(-1)g_t>`,

the exact graph Cauchy estimate shows that `a^2*E_U*L_T(U)->0` transfers the
projected source-normalized anchor to the actual ground transform on the real
window.  This is an oriented sufficient condition, not a proved arithmetic
estimate.  The scalar identity `tau_U^2=-d'(U)-1` also shows why values of the
Feshbach function do not bound the solve: concavity gives the secant
inequality in the wrong direction.

On the two-anchor branch, the optimal normalized depth of the complete source
response cone is `Theta(1/sqrt(log N))`, attained by an explicit geometric
scale mixture.  Therefore the existing cone/coefficient certificate still
requires the independent relative scale
`chi_U/g_+=O(1/(N^2*log N))`.  Rotation to a second unit anchor
`z=a*kappa+v` is governed exactly by

`D_z=|a-<b,B^(-1)v>|^2-chi*<v,B^(-1)v>`:

the rotated complement is positive exactly when `D_z>0`, and then
`chi_z=chi/D_z`, with the rotated solve and inverse reconstructed from
`T^(-1)z`.  Ordinary Hilbert-space closeness does not control this sign.

The standard Perron route has a sharp structural obstruction.  After all
source blocks are combined, the continuous jump density is

`exp(-5h/2)/(1-exp(-2h))-exp(h/2)`.

It changes sign at `h=log(rho)`, where `rho^3-rho-1=0`.  Hence the full
pointwise-cone semigroup is positivity preserving only when
`L<=log(rho)`, equivalently `lambda<=sqrt(rho)`, and cannot support an
unbounded schedule.  Positive, Doob, or sign multiplication gauges preserve
the obstruction; parity folding and the natural pole quotient do not repair
it.  This eliminates a proof route, not the simple-even source-ground claim
itself.

None of the exact source matrices is yet proved to have both strict shifted
sector signs together with the real-window observable estimate, nor are the
rotated `D_z`, floor, solve, and relative surplus controlled on one unbounded
schedule.  Equation (5.2) and the unconditional characteristic-function
limit remain open.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 0.60: residual ridge, response profile, and pole-load crossing

At the raw Rayleigh shift `U=q`, the exact ground displacement
`h=q-mu` is a self-consistent ridge:

`h=<b,(B+h*I)^(-1)b>`, with `B=A-q*I>0`.

Every `sigma` satisfying
`<b,(B+sigma*I)^(-1)b><=sigma` obeys `sigma>=h` and gives the exact
bounded-frequency estimate

`|<g_t,(B+h*I)^(-1)b>|^2
 <= sigma*<g_t,(B+sigma*I)^(-1)g_t>`.

The fully explicit choice `sigma=r=||b||` always works.  Thus the determinant
branch needs only the residual-ridged leverage

`a^2*r*sup_|t|<=T <g_t,(B+r*I)^(-1)g_t> -> 0`,

which contains no inverse of the unshifted collapsing complement.  A further
trace-to-supremum argument reduces this to the positive soft-overlap target

`L^(3/2)*tr(r*(B+r*I)^(-1)*K_T) -> 0`.

Both formulas retain the combined pole--archimedean--minus-prime operator.
Neither target is proved for the source matrices, and an exact source-Cauchy
family shows that `r->0` plus both finite signs is insufficient by itself.

The commutator admits a complementary scalarization.  For a trial energy
`u`, the odd resolvent constructs a boundary-normalized even vector
`Phi_u`; one scalar equation decides whether it is an even eigenvector, and
its complete transform is

`widehat(Phi_u)(t)=K_L(t)*A_u(t*L/(2*pi))`.

The meromorphic response profile `A_u` also contains the full imaginary-axis
odd-inertia test.  It is a function, not a finite scalar.  Exact positive
Cauchy twins can agree in boundary value, solve norm, and any prescribed
finite transform jet while differing elsewhere on the real window.  Hence no
fixed number of local response samples replaces the uniform profile estimate.

Finally, introducing a common pole load `s` gives

`H_+(s)=A_+ + 2*s*|p_+><p_+|`,
`H_-(s)=A_- - 2*s*|p_-><p_-|`.

The sector gap decreases monotonically with `s`.  On the ordered,
nonexceptional branch, the crossing satisfies
`F_+(z_c)+F_-(z_c)=0`, and the source sign is exactly the requirement that
the first crossing load exceed `1`.  The universal sufficient gap bound

`a_- - a_+ > 2*s*(||p_+||^2+||p_-||^2)`

is sharp: a positivity-improving two-point killed-jump model with the exact
hyperbolic pole norms attains equality and realizes even, double, and odd
loaded grounds.  Nonpole positivity and the pole signs therefore cannot
prove the arithmetic sector order without a source-specific paired-resolvent
comparison.

The actual source sector signs, residual-ridged soft trace, uniform response
profile, equation (5.2), and unconditional determinant limit remain open.
The formal state remains `P0_INVALIDATED`.

## Checkpoint 0.61: physical soft-trace splice and folded source Hankel obstruction

The positive residual-scale soft trace now has an exact physical splice.
For `S_r=r*(B+r*I)^(-1)`, the time-band contraction `K_T`, any declared
physical projection `P`, and `H=I-P`, let `C_r` be the exact Schur complement
of `B+r*I` to `P`.  Then

`sqrt(tr(S_r*K_T))
 <= sqrt(r*tr(C_r^(-1))) + sqrt(tr(H*K_T*H))`.

The first term is the regularized complete signed physical short, including
all low--high coupling; the second is the fixed-window physical leverage
deficit.  Spectral calculus also gives the exact layer formula

`tr(S_r*K_T)=integral_0^infinity
 r/(u+r)^2 * tr(1_(0,u](B)*K_T) du`.

Thus the remaining observable is the joint orientation of the low-`B`
spectral layers and the fixed time band.  Existing compressed-multiplier
rank/trace bounds do not control that orientation, and the available
graph-spill theorem covers only the shrinking band `|t|<=delta/L`.  An exact
interval exponential separates shrinking-band from fixed-window capture,
while a two-dimensional isospectral model makes the scaled overlap either
diverge or vanish with identical separate spectra, ranks, and traces.

The parity comparison has also been folded to the positive half-interval.
For the common nonpole Levy measure `j_lambda` and pole load `s`, the full
folded source forms obey

`Q_-(s)-Q_+(s)=2*H_(j_lambda-2*s*cosh(h/2)dh)`.

At the source load `s=1`, the continuous signed Hankel density is

`exp(-h/2)/(1-exp(-2h))-2*cosh(h/2)`.

It changes sign at `h=log(rho)`, `rho^3-rho-1=0`.  Once `L>log(rho)`, a
smooth nonnegative bump can avoid every finite prime-power atom and gives a
strict negative direction.  Hence the global **uncompressed** full-form
Loewner shortcut `Q_-(1)>=Q_+(1)` is unavailable beyond that threshold.
This does not imply the same statement for every finite Galerkin pair, does
not order the two lowest eigenvalues, and does not sign the paired resolvent.
The exact finite identity

`F_+(z)+F_-(z)
 = (1/2)*d/ds log(det(H_+(s)-zI)/det(H_-(s)-zI)) at s=0`

records the still-missing ground-specific cancellation.

No actual unbounded source schedule proves the two physical-splice rates,
the paired-resolvent sign, either strict shifted sector sign, equation (5.2),
or the determinant limit.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 0.62: fixed-window moments, constrained ground, and source pilot

The fixed-window high term in the residual-ridged physical splice is now
closed.  On the inversion-even anchor complement, project onto the first
`m` even physical moments and write `H_m` for the complementary projection.
For the exact time-band contraction `K_T`,

`tr(H_m K_T H_m)
 <= (L*T/pi)*(L*T/2)^(4*m)/((4*m+1)^2*((2*m)!)^2)`.

With `m=ceil(L*T)`, this is bounded by

`L*T/(pi*(4*m+1)^2)*(e/4)^(4*m)`

and is therefore smaller than every fixed inverse power of `L`.  The top
`m` finite time-band eigenvectors do at least as well.  The only remaining
term in this splice is the complete regularized signed moment short
`r*tr(C_(r,m)^(-1))`; no raw compression is substituted for the Schur
complement.

That low term now has an exact determinant and angle reduction.  For an
injective moment synthesis `U`, put

`G=U^*U`, `R=U^*(B+rI)^(-1)U`.

Then

`c_(r,m)^(-1)=||G^(-1/2) R G^(-1/2)||`,

`det(C_(r,m)-zI)=det(G-zR)/det(R)`.

Equivalently, `r/c_(r,m)=||P_m r(B+rI)^(-1)P_m||`.  If
`eta_m(u)=||1_(0,u](B)P_m||^2`, the sharp two-layer bounds are

`r/(u+r)*eta_m(u) <= r/c_(r,m)
 <= r/(u+r)+u/(u+r)*eta_m(u)`.

Thus the missing source datum is a growing-moment/low-spectral-layer angle,
not a separate eigenvalue list or coframe rank.  An exact inversion-symmetric
source-Cauchy family with a simple even ground and arbitrarily small residual
makes `r/c_(r,m)` tend to one.  It proves only that the generic ridge floor is
sharp; it is not the arithmetic Weil family.

The paired pole-load problem has also collapsed to one constrained ground.
For the projected one-sided exponential `w=P_(E_N) exp(x/2)=p_++p_-`,

`F_+(z)+F_-(z)=<w,(A_N-zI)^(-1)w>`.

The opposite parity pole ranks compress identically to zero on `w^perp`.
Under the stated finite nonexceptional hypotheses, the lowest eigenvalue
`zeta` of the nonpole operator on `w^perp` is the first parity-collision
energy and

`s_c=1/(2*F_-(zeta))=-1/(2*F_+(zeta))`.

At that energy the full direct-sum determinant ratio is
`(1-s/s_c)^2`, so an unlabelled determinant loses the orientation needed to
decide whether the source load `s=1` lies before the crossing.  The bare sign
of the paired Weyl function is likewise insufficient unless its first-gap
spectral-location condition is retained.

A new actual-source point pilot at `lambda=2`, `N=4`, and exact `T=1`
assembles `K_T` by direct arbitrary-precision quadrature; the replay rebuilds
the source matrix and prolate state through the independent existing paths
and uses closed Si/Ci antiderivatives for `K_T`.  At 40 and 80 decimal digits
it stably gives `r approximately 5.29023e-5`,
`tr(S_r K_T) approximately 7.87951e-2`, and
`L^(3/2) tr(S_r K_T) approximately 1.28612e-1`, while both raw-`q` sector
gaps are positive.  These are point values, not interval enclosures or an
asymptotic trend; both paths share `mpmath` transcendental arithmetic.

No actual-source moment-angle decay, constrained-ground unit-load
orientation, unbounded shifted-sector sign theorem, equation (5.2), or
locally uniform determinant limit has been proved.  The formal state remains
`P0_INVALIDATED`.

## Checkpoint 0.63: covariance profile, transverse radical, and labelled load reserve

The low Hilbert--Schmidt term can be kept in its exact time-band covariance
instead of replacing that covariance by the identity.  If `W_m` is an
isometry onto the even physical-moment range, put

`K_m=W_m^* K_T W_m`, `R_m=W_m^*(B+rI)^(-1)W_m`.

Then its square is exactly

`L_(r,m,T)=r*tr(K_m R_m)`.

For `E_u=1_(0,u](B)` the relevant layer profile is

`Theta_(m,T)(u)=tr(K_m W_m^* E_u W_m)`.

With `t=r/(u+r)`, spectral calculus gives

`t*Theta <= L_(r,m,T) <= t*tr(K_m)+(1-t)*Theta`.

Thus the covariance-weighted target is strictly less restrictive than the
worst principal-angle target.  It is not a new source estimate, however.  If

`Phi(u)=tr(E_u K_T E_u)`,

then the fixed-window moment theorem gives

`|sqrt(Phi(u))-sqrt(Theta_(m,T)(u))|<=sqrt(tau_m(L,T))`,

and the same `Phi` is the spectral distribution function of the complete
residual-ridged soft trace.  The arithmetic problem is still the joint
orientation of the exact combined source operator and the time-band family.

That orientation now has an explicit actual-source obstruction.  For the
limiting source-normalized state `K_infinity`, define

`W_infinity=K_infinity''+m_2*K_infinity`,
`m_2=||K_infinity'||^2/||K_infinity||^2`.

It is a nonzero even global radical, orthogonal to `K_infinity`, with

`hat(W_infinity)(t)=(m_2-t^2)*Xi(t)/4`.

Projecting it into the same finite source space and off the actual anchor
gives a unit vector `omega` with Rayleigh energy
`epsilon=<omega,B omega>`.  Its fixed-window transform retains nonzero mass,
and the exact spectral estimate forces every successful threshold to satisfy
`u_L=O(epsilon)`.  Consequently either the older angle target or the simpler
covariance/direct-profile target necessarily requires

`r/epsilon=o(L^(-5/2))` for that one-threshold/common-floor certificate.
This is a sufficient route-specific scale, not an intrinsic necessary scale
for the exact soft trace.

Existing all-order flatness proves only separate superpolynomial upper bounds
for `r` and `epsilon`; it does not compare them.  This is a new signed
relative-leakage obligation, not an asymptotic proof.

The unit-load question also has a new labelled variational certificate.  For
any normalized constrained trial `phi in w^perp`, let

`U=<phi,A_N phi>`, `B_U=H_-(1)-U*I`.

If `B_U>0` and `chi_U=<p_-,B_U^(-1)p_->`, then the labelled even ground stays
strictly below the labelled odd ground for

`1<=s<1+1/(2*chi_U)`.

Under the four existing first-gap hypotheses this proves

`s_c>=1+1/(2*chi_U)>1`.

If `B_U>=delta*I`, the explicit weaker reserve is
`s_c>=1+delta/(2*||p_-||^2)`.  Strict positivity is essential; a nonnegative
floor permits collision exactly at unit load.  The theorem retains sector
labels and cannot be replaced by the unlabelled determinant square or a Weyl
sign sampled after a later pole.

The new `lambda=2,N=4` point diagnostic reconstructs the source matrix,
source-normalized prolate state, moment columns, pole vectors, constrained
ground, and labelled load through producer and replay paths at 40 and 80
decimal digits.  It gives `s_c-1 approximately 2.05981e-7`; its complete
moment-space ratio `r/c_(r,4) approximately 0.669224` is not small.  The
artifact samples the older `eta_m` profile and the finite labelled-load
identity only: it does not compute `Theta`, `Phi`, the transverse-radical
energy, or `r/epsilon`.  It is point arithmetic, not an interval enclosure or
an unbounded trend.

No common unbounded schedule proves the relative radical leakage, the
covariance/direct-profile decay, a constructive constrained-trial odd floor,
both strict shifted-sector signs, equation (5.2), or locally uniform
determinant convergence.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 0.64: reciprocal reserve and the source prolate secant

The exact residual-ridged soft trace has a sharper rank-one factorization.
For a transverse unit state `omega`, write

`epsilon=<omega,B omega>`, `c^2=<omega,K_T omega>`, and
`S_r=tr(r(B+rI)^(-1)K_T)`.

Then

`S_r=c^2*r/(epsilon+r)*R_r`, where `R_r>=1` is the exact reciprocal
crowding reserve.  If `c` stays bounded away from zero and `R_r=O(1)`, the
intrinsic target `L^(3/2)S_r->0` is equivalent to
`r/epsilon=o(L^(-3/2))`.  The older `L^(-5/2)` ratio remains a stronger
sufficient condition, but it is required only by a route that replaces the
reciprocal spectral tail by one threshold and the full `O(L)` covariance
trace.

The threshold-free upper target is

`r*tr(B^(-1)K_T)=o(L^(-3/2))`,

or, after a split at `u`,

`Phi(u)+r*H(u)=o(L^(-3/2))`,

where `H` retains the reciprocal moment of the high spectral tail.  These
identities identify a sharper obligation; no actual-source bound for the
reserve or reciprocal tail is proved.

The first source-normalized prolate correction also fixes a canonical
transverse direction.  If `z0` is the projected limiting state and `kappa`
the actual projected source anchor, the exact secant
`t=(I-kappa*kappa^*)z0` satisfies

`lambda^2*t -> W_infinity/(16*pi)`

on the admitted qualitative schedule.  At every finite stage, writing
`z0=alpha*kappa+beta*omega` splits the complete relative residual into a
signed scalar mismatch and an independent orthogonal residual:

`(r/epsilon)^2=(-beta/(2*alpha)+D0/(2*alpha*beta*epsilon))^2`
`+||b_perp||^2/epsilon^2`.

Thus control of the scalar radical leakage alone cannot control the complete
residual.

The new source-pinned `lambda=2,N=4,T=1` point pilot independently rebuilds
the Weil matrix, fixed 30-mode source-normalized prolate Galerkin state,
time-band matrix, and projected limiting state at 40 and 80 decimal digits.
The replay uses differential-form prolate quadrature, closed Si/Ci formulas,
and incomplete-gamma segment integrals instead of the producer paths.  It
finds `r/epsilon approximately 1.45105e-1`, captures only about
`8.40888e-4` of `r^2` in the secant coordinate, and gives reciprocal crowding
reserve about `4.82947`.  These are stable point values, not interval
enclosures, a diagonal schedule, or evidence of decay.  The fixed prolate
truncation has no tail enclosure, and both paths share `mpmath`.

The remaining proof obligations are now explicit: prove both strict shifted
sector signs on one unbounded source schedule and either a bounded reciprocal
reserve together with `r/epsilon=o(L^(-3/2))`, the reciprocal-tail target, or
a growing transverse-block estimate strong enough to imply the soft-trace
decay.  Equation (5.2) and locally uniform determinant convergence remain
open.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 0.65: graph-shorted reciprocal response

The reciprocal reserve now has an exact one-step Feshbach decomposition.  In
the anchor complement, split along the canonical secant `omega` and write

`B=[[epsilon,g*],[g,C]]`, `delta_r=epsilon+r-g*(C+rI)^(-1)g`, and
`v_r=omega-U(C+rI)^(-1)g`.

Then

`(B+rI)^(-1)=delta_r^(-1)|v_r><v_r|+U(C+rI)^(-1)U*`

and hence

`S_r=r*<v_r,K_T v_r>/delta_r+r*tr((C+rI)^(-1)K_F)`.

Both terms are nonnegative.  Thus the target `L^(3/2)S_r->0` is exactly the
joint problem of controlling the graph-shorted secant and the deflated bulk;
one scalar `r/epsilon` estimate cannot replace either term.  The shorted
energy also satisfies

`delta_0=min_(<omega,x>=1)<x,Bx>=det(B)/det(C)`
`=1/<omega,B^(-1)omega>`.

For the actual projected limiting state, the transverse graph load is the
signed vector identity `a0_F=alpha*b_F+beta*g`.  This exposes the missing
inverse-weighted vector cancellation rather than hiding it inside the scalar
secant identity.

Two further exact reductions delimit plausible next steps.  First, the
fixed-window matrix itself has source-Cauchy displacement, so `Q+sK_T`
remains in the same displacement class.  Differentiating the parity and
anchor determinant factorizations expresses the reciprocal trace as an odd
trace minus two large logarithmic derivatives.  At the finite pilot those
terms cancel at roughly the million scale, so separate absolute estimates
lose the relevant quantity.  An exact source-Cauchy family proves that the
current commutator, boundary, residual, and strict-sign data still do not
bound the positive reciprocal tail.

Second, the complete natural prolate-radical prefix is the polynomial-Xi
tower.  Exact anchor-orthogonal moment witnesses prove that its minimum
fixed-window covariance eigenvalue has `d`-th root tending to zero.  A
dimension-independent floor on that complete prefix is therefore impossible.
Only fixed-depth transfer to finite prolate corrections is currently
admitted; a growing-depth theorem would require a new uniform synthesis
enclosure.

The new source-pinned `lambda=2,N=4,T=1` producer and standalone replay agree
at 40 and 80 decimal digits.  At 80 digits,
`delta_r approximately 7.93200e-5`; the soft trace splits as approximately
`7.87284e-2 + 6.66915e-5`, and the normalized reserve splits as approximately
`4.82538 + 0.00408763`.  The unregularized reciprocal trace splits as
approximately `4498.64146 + 1.26214`.  This identifies the graph extension as
the dominant finite-pilot effect, but it is point arithmetic in the same
unenclosed 30-mode prolate space and is not an asymptotic estimate.

No unbounded shorted-energy rate, deflated-bulk bound, shifted-sector sign,
equation (5.2), or locally uniform determinant limit is proved.  The formal
state remains `P0_INVALIDATED`.

## Checkpoint 0.66: signed leakage and finite determinant increments

The stronger raw-Rayleigh route is now delimited exactly.  If both complete
`q`-shifted sector signs hold, then the finite matrix obeys

`Q >= (q-r)I`.

The coefficient of `r` is sharp without a quantitative complement floor.
On the admitted Gevrey diagonal, the widening centered-Fourier spaces form a
Weil-form core; together with the admitted decay of `|q|+r`, eventual
`q`-shifted signs would therefore imply the global Weil criterion.  Those
two signs are not a preliminary estimate: they already contain RH-level
signed arithmetic information, and this checkpoint does not prove them.

For every certified `U<=q`, the regularized secant short has the exact signed
weak-residual representation

`delta_(r,U)/(epsilon_U+r)`
`=1-<ell,(C_U+rI)^(-1)ell>/(beta^2*(epsilon_U+r))`,

where `ell=beta*g` is represented by the combined mismatch
`-W_Z(v,R_0)+(alpha/a)W_Z(v,R_lambda)`.  A growing exact source-Cauchy family
at its actual two-vector Ritz shift passes the existing scalar secant tests
while its short collapses and its graph soft term stays bounded below.  Thus
the new signed inverse-energy inequality is genuinely additional arithmetic
work; separate absolute remainder bounds cannot replace it.

The positive finite-increment reduction gives, for fixed `theta>0`,

`G_theta/theta <= H_bulk <= G_theta/log(1+theta)`

and the exact nested split `F_theta=G_theta+J_theta`, with corresponding
nonlinear bounds for the graph term.  The source-Cauchy factorization shows
how the odd determinant, boundary Weyl factor, anchor short, and secant short
must cancel as one combined response.  At `U=q` this finite trace belongs to
the admitted self-regularized ground-transfer route, conditional on the
already RH-level complete signs.  At a genuine Ritz shift `U<q`, however,
the ground Feshbach equation is

`q-U+h_U=<b,(B_U+h_UI)^(-1)b>`.

The extra `q-U` term invalidates the coefficient-one transplant of the
Rayleigh theorem.  The Ritz secant moment repairs the transfer: for the
mandatory two-vector Ritz shift, or a certified
`u<=U<=q`,

`zz* <= A_R((q-U)/r) r(B_U+rI)^(-1)`.

The explicit ratio-dependent factor is mandatory.  This makes the positive
increment a valid localized ground observable, but does not make its
arithmetic decay true and does not by itself prove the full `L2` equation
(5.2).

The source-pinned `lambda=2,N=4,T=1` checkpoint reconstructs the even-block
increments at 40 and 80 decimal digits through producer and independent
replay paths.  At 80 digits, the raw-`q` values are approximately
`S=0.0787951172855`, `F=0.0758447905407`, with
`H_graph=0.0787284257402` and `H_bulk=0.0000666915452814`; the Ritz-`u` row
has `A_R((q-u)/r)=1.0004773604...`, so its soft trace is a valid finite
localized bound after that factor is retained.  This checkpoint does not
numerically replay the separate actual-source factors
`det O_s,m_s,sigma_s,delta_s`.  It is point arithmetic in the same unenclosed
30-mode prolate space, proves no unbounded response rate, shifted signs,
equation (5.2), or determinant limit, and leaves the formal state
`P0_INVALIDATED`.

## Checkpoint 0.67: Ritz-moment ground transfer

The missing finite lower-shift implication is now explicit.  If `u` is the
lower Ritz value of the compression to `span{kappa,b/||b||}` and
`u<=U<=q`, then

`(q-U)<w,(A-U)w> <= r^2`.

Together with the exact ground Feshbach equation, this proves

`zz* <= A_R((q-U)/r) r(B_U+rI)^(-1)`,

where `A_R(x)=1+x+x(1+x)^2/2` for `0<=x<=1` and
`A_R(x)=1+x+2x^2` for `x>=1`.  The factor is indispensable: the exact
two-dimensional Ritz example `[[1,2],[2,1]]` rejects coefficient one, and
an arbitrary lower shift not certified above `u` admits no finite
ratio-only replacement.

The source-pinned `lambda=2,N=4,T=1` producer and independent replay rebuild
the complete source matrix and normalized state at 40 and 80 decimal digits.
At 80 digits they give

`d/r = 0.000318172767532683...`,
`A_R = 1.00047736040131396...`,
`H_T = 0.0787783596798519...`, and
`<z,K_T z> = 0.000106522199936584...`.

The same run records the identity observation and the unrestricted low-band
envelope; the pilot has no eigenvalue of `B_U` below `d`.  All values are
shared-`mpmath` point diagnostics in the same unenclosed 30-mode prolate
space.  The theorem makes checkpoint 0.66's positive increment a valid
localized Ritz-ground observable only after the exact `A_R` factor is
retained.  It proves neither the required weighted response decay on an
unbounded source schedule nor the full `L2` equation (5.2), complex-strip
convergence, a locally uniform determinant limit, or RH.  The formal state
remains `P0_INVALIDATED`.

## Checkpoint 0.68: Ritz projective low-mode determinant gate

The finite Ritz transfer now observes exactly the Fourier modes needed by
the projective compact-transform bridge.  For the ambient symmetric cutoff
`Pi_M` with `1<=M<N`, fixed `theta>0`, and certified Ritz and simple-even
sector hypotheses, the coefficient-normalized ground correction satisfies

`||Pi_M(gamma^(-1)xi-kappa)||^2`
`<=A_R(d/r) H_M`
`<=A_R(d/r) F_(theta,M)/log(1+theta)`,

while its complementary norm is at most `C_R(d/r)`.  Here

`F_(theta,M)=log(det(B_U+rI+theta*r*K_M)/det(B_U+rI))`

is a positive finite determinant increment and
`K_M=W^*Pi_MW`.  The square on the low-mode norm, the source projection
scale, and the divisor `log(1+theta)` are mandatory.

The source-Cauchy calculation must use the full ambient homotopy
`Q+t*Pi_M`, not a complement-only perturbation.  With `zeta=U-r`, it gives
the exact combined factorization

`F_(theta,M)`
`=log(det(C_(theta*r))*sigma_0*m_0`
`/(det(C_0)*sigma_(theta*r)*m_(theta*r)))`.

The anchor and cross terms in `a_t` and `b_t` are retained, both parity
blocks are reconstructed, and the pole--archimedean--minus-prime source is
combined before determinants or absolute values.  This is a finite identity;
it does not supply either required sector sign or a response estimate.

The source-pinned `lambda=2,N=4,M=2,theta=1` producer and independent replay
rebuild checkpoint 0.64 live at 40 and 80 decimal digits.  At 80 digits they
give `A_R=1.00047736040131396...`,
`F_(theta,M)=0.511419068993410882...`, low-mode squared norm
`0.0009485085965985847...`, and high-mode norm
`0.0025768264530973075...`; the full source-factorization residual is about
`4.42e-78`.  These are shared-`mpmath` point diagnostics in the same
unenclosed 30-mode prolate space, not interval or ball enclosures.

The finite theorem yields a sufficient projective compact-transform
criterion only if its projection, low-mode determinant-response, and
high-mode rates are separately proved along an unbounded source schedule.
For `M=ceil(lambda)`, bounded `d/r`, and bounded nonzero projected-state
scale, the concrete sufficient response target is
`A_R(d/r)F_(theta,M)=O(lambda^(-1))`.  The trace gate is sufficient rather
than necessary: low-Fourier-visible near-null complement directions can keep
it large even when the actual projective ground error is small.
No such unbounded source response, either shifted sector sign, equation
(5.2), or locally uniform determinant limit is proved.  No RH conclusion
follows, and the formal state remains `P0_INVALIDATED`.

## Checkpoint 0.69: source-compatible ground-projective response

The cutoff-visible correction can now be reconstructed without paying for
unrelated complement directions.  At the true simple even ground, put
`H=Q_+-mu*I`, let `x` be the coefficient-normalized ground
`H*x=0`, `<kappa,x>=1`, and write `C=adj(H)`.  Then exactly

`C=c_kappa*x*x^*`, with `c_kappa=<kappa,C*kappa>`,

and the projective low-mode energy is the cancellation-preserving cofactor
combination

`E_M=||Pi_M(x-kappa)||^2`
`=k00-2*Re(<kappa,Pi_M*C*kappa>)/c_kappa`
` +tr(Pi_M*C)/c_kappa`.

Equivalently it is a sum of squared **combined** mixed minors; absolute
values are taken only after each source-complete minor is formed.

A positive bordered determinant cross-ratio has derivative exactly
proportional to `E_M`.  A finite positive secant controls that derivative
from above only when its cyclic spectral cap is retained.  An exact cap-free
alternative retains a vector-specific spectral tail `T_X`; dropping that
tail is false.  The bordered matrices are readout minors and are not
themselves source-Cauchy homotopies.

The source-compatible unbordered homotopy is the full ambient
`Q+t*Pi_M`.  Its singular derivative gives the ground mass `S_M`, with the
corrected identity

`S_M-k00=E_M-2*Re(<R_M*kappa,R_M*(x-kappa)>)`.

The high cross term has no known favorable sign.  The actual combined-state
bounded-variation estimate controls it at a larger polynomial cutoff.  On
the locked exponential `N(lambda)` schedule, choosing
`M=ceil(lambda^12)` makes the anchor tail
`O(lambda^(-2)*sqrt(log lambda))`.  Consequently the two strict shifted
sector signs at `u`, bounded `(q-u)/r`, and the new arithmetic estimate

`|S_M-k00|=O(lambda^(-1))`

would imply the complete projective locally-uniform bridge.  This is a
conditional criterion, not an established response bound, and it is weaker
than the full-`L2` target (5.2).

The response premise has an exact sharper form.  Let
`L_M=Ran(Pi_M) intersect (Pi_M*kappa)^perp`.  When `k00>0`, the singular
response splits as

`S_M-k00=||P_(L_M)x||^2+|h_M|^2/k00-2*Re(h_M)`,

where `h_M=<R_M*kappa,R_M*(x-kappa)>`.  The admitted Gevrey projection
theorem and nested cutoffs make `h_M` exponentially small at
`M=ceil(lambda^12)`.  Thus the missing response rate is equivalent to the
single normalized ground-alignment estimate

`||P_(L_M)Phi_mu||^2`
`=O(lambda^(-1))*|<kappa,Phi_mu>|^2`,

where `Phi_mu` is reconstructed from the odd resolvent.  This is a
reformulation of the existing odd-resolvent obstruction, not a proof of its
decay.  An exact diagonal source-Cauchy family has zero anchor tail, bounded
Ritz ratio, and both strict signs while this normalized alignment stays
equal to `1/3`.

The missing signs are now exact finite Schur inequalities.  At the lower
two-vector Ritz value `u`, the even sign is equivalent to
`C_u-e_u*e_u^*/(q-u)>0`.  The odd sign is equivalent to positivity of
`A_q+(q-u)I` together with its one-dimensional Schur scalar.  Neither gate
follows from Ritz interlacing, source displacement, one determinant, or the
finite pilot.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 0.70: natural-cutoff signed ground alignment

The remaining ground-orientation scalar now has a complete signed source
normal form.  With

`Q=c_*I+A_tail-T_D`,

form the complementary forcing and true-ground operator only after the two
source blocks have been combined:

`b_D=P_(kappa^perp)(A_tail-T_D)kappa`,

`B_mu=P_(kappa^perp)(Q_+-mu I)P_(kappa^perp)`.

For the coefficient-normalized ground `x=kappa-B_mu^(-1)b_D` and the low
anchor-transverse projector `P_(L_M)`, the unresolved positive scalar is

`A_M=||P_(L_M)x||^2`
`=b_D^*B_mu^(-1)P_(L_M)B_mu^(-1)b_D`.

It is also the normalized adjugate trace and the normalized odd-resolvent
alignment.  The unbordered response retains the exact high cross:

`S_M-k00=A_M+|h_M|^2/k00-2*Re(h_M)`.

The cumulative arithmetic form distinguishes
`F_align=D-H_tail` from `F_boundary=D-H_0`; they differ by
`2*exp(-t/2)`.  The exact identity
`dF_align=-exp(-t/2)dG` keeps every inclusive prime-power atom and preserves
the pole--archimedean--minus-prime cancellation inside each common-inverse
amplitude.  Substituting separate inverse norms loses the observable.

The admitted Gevrey prolate estimate is strong enough at the natural centered
cutoff `M=ceil(lambda)`: choosing formal Hermite order `J=floor(A0*L)` gives
an anchor tail `O(exp(-c*L^2))` on the locked exponential outer schedule.
Consequently, exact-`u` strict sector signs, bounded `(q-u)/r`, and the still
unproved arithmetic estimate

`|S_(ceil(lambda))-k00|=O(lambda^(-1))`

would imply the existing projective locally-uniform bridge.  This remains a
conditional criterion and is not the full-`L2` equation (5.2).  An exact
diagonal source-Cauchy counterfamily has zero tail and both strict signs but
keeps `A_M=16/9`, so the missing alignment decay is genuinely arithmetic.

The source-pinned `lambda=2,N=8,M=2` producer and standalone verifier rebuild
the source, 60-mode prolate anchor, true ground, exact-`u` signs, signed normal
form, common-inverse response, and literal adjugate at 40 and 80 decimal
digits.  At 80 digits,

`A_M = 4.5869412232585823e-7`,
`E_M = 4.5869425404329501e-7`, and
`S_M-k00 = -2.6714910817226289e-7`.

The two separate resolved block norms are each about `1.177017e6`, while
their combined response norm is about `6.77e-4`, a triangle-loss factor of
about `3.48e9`.  This is precisely why the combined response is serialized
before absolute values.  The independent 80-digit replay has 37 finite gates
and a maximum scaled defect below `9e-72`.

All of these values are shared-`mpmath` point diagnostics in an unenclosed
60-mode prolate truncation.  They prove neither the required unbounded signed
alignment rate nor either sector sign on an unbounded arithmetic schedule,
equation (5.2), or locally uniform convergence.  The formal state remains
`P0_INVALIDATED`.

## Checkpoint 0.71: even-sector cross-root limit bridge

Checkpoint 0.71 is a theorem-only refinement of the finite determinant
route.  It adds no numerical artifact and proves no new actual-source
asymptotic estimate.  The full proof and exact regressions are in
`notes/EVEN_SECTOR_CROSS_ROOT_LIMIT_BRIDGE.md` and
`tests/test_even_sector_cross_root_limit_bridge.py`.

Let `x=sum_(|n|<=N)x_n V_n` be the real simple lowest eigenvector of the
inversion-even compression `Q_+`, with `x_(-n)=x_n`.  Put
`s=zL/(2*pi)` and

`p_x(y)=x_0*product_(m=1)^N(y-m^2)`
` +2*y*sum_(n=1)^N x_n*product_(m!=n)(y-m^2)`.

The exact centered transform is

`hat(x)(z)=(sqrt(L)/pi)*(sin(pi*s)/s)`
` *p_x(s^2)/product_(m=1)^N(s^2-m^2)`,

with removable lattice values.  If `c=<eta,x>!=0`, the source rank-two
commutator gives an operator `A` on the positive even quotient such that

`p_x(y)=c*det(y*I-A)` and
`inertia(A)=inertia(Q_--mu*I)`.

Equivalently,

`G_+*A=C^*(Q_--mu*I)C`.

Thus `A` has real spectrum even when the odd shifted block is indefinite.
Positive eigenvalues give real transform-zero pairs and negative eigenvalues
give purely imaginary pairs.  The proof uses only that `x` is the simple
lowest vector of `Q_+`; it does not require `x_0!=0` or a global finite
ground state.

The boundary-degenerate branch `c=0` is included.  A source-Cauchy-preserving
even diagonal perturbation produces nearby simple even grounds with
nonzero boundary pairing.  Hellmann--Feynman comparison of the even vector
and its odd derivative prevents the boundary pairing from vanishing
identically.  Coefficientwise closure of the resulting real-rooted
polynomials then proves

`zeros(hat(x)) subset R union iR`

without defining a nonexistent boundary-normalized determinant at `c=0`.

This weaker finite zero geometry is sufficient for the limit step.  A
locally uniform limit of functions whose zeros lie on the two axes is
zero-free in every open quadrant by Hurwitz.  On the remaining imaginary
segment, `Xi(i*y)=xi(1/2-y)>0` for `|y|<1/2`, using the positive alternating
eta series and the sign of `zeta(s)` on `0<s<1`.  Hence locally uniform
convergence of the scaled even-ground transforms to `Xi` would still force
all zeros in the open strip onto the real axis.

The resulting frontier is strictly smaller than the checkpoint-0.70
two-sector frontier.  For this cross-root route it is enough to prove, on
one actual-source unbounded schedule,

1. the strict even complementary gate at the exact lower Ritz value `u`;
2. bounded `(q-u)/r`;
3. the signed natural-cutoff alignment rate
   `|S_(ceil(lambda))-k00|=O(lambda^(-1))`, or the exact weaker projective
   rate; and
4. the existing projective transform estimates giving locally uniform
   convergence.

The fixed-parameter companion audit is
`notes/FIXED_LAMBDA_GALERKIN_ALIGNMENT_NO_GO.md`, with pure exact
regressions in `tests/test_fixed_lambda_galerkin_alignment_no_go.py`.  At
each fixed `lambda`, the actual source matrices are conforming compressions
of one semibounded compact-resolvent even operator: every fixed Ritz value
converges downward, and a simple isolated infinite even ground would give an
eventually simple convergent finite ground line.  Simplicity of that
infinite ground is a hypothesis, not a consequence of high-mode coercivity.

If the infinite ground is simple and has nonzero prolate overlap, then for
fixed `M` the coefficient-normalized observable has the exact limit

`A_(M,N) -> A_(M,infinity)`.

Nothing forces `A_(M,infinity)` to vanish.  Exact infinite diagonal
source-Cauchy families with rational harmonic high diagonals have the same
logarithmic coercivity and compact-resolvent structure while keeping
`A_(M,N)=16/9` for every outer cutoff, or while keeping the even bottom
two-dimensional for every cutoff.  Thus `N->infinity` removes Galerkin error
only; it proves neither ground alignment, eventual simplicity without an
infinite spectral gap, nor convergence of the ground transforms to `Xi`.

The shifted odd sign is no longer required for this route.  It remains
necessary if one insists that every finite transform be real-rooted through
the positive CCM quotient metric.  The actual-source even gate, signed
alignment, and locally uniform limit are still unproved; no full-`L2`
equation (5.2) follows.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 0.72: even--odd Krylov reduction and anchor-strip no-go

Checkpoint 0.72 is theorem-only.  It creates no source lock or numerical
artifact.  The exact finite-algebra audit is in
`notes/EVEN_ODD_MULTIPLICITY_KRYLOV_SIMPLICITY.md`, with standard-library
regressions in `tests/test_even_odd_multiplicity_krylov_simplicity.py`.  The
projected-anchor zero audit is in
`notes/PROLATE_ANCHOR_STRIP_ROOT_NO_GO.md`, with exact regressions in
`tests/test_prolate_anchor_strip_root_no_go.py`.

For the real source-Cauchy matrix, write `Q_+` and `Q_-` for the inversion-
even and inversion-odd blocks, `eta=sum V_n`, and
`beta=sum b_n V_n`.  In normalized parity bases the source commutator is

`D*Q_+-Q_-*D=|beta><eta|`.

If `k_+(mu)` and `k_-(mu)` are the two multiplicities at a real level
`mu`, the exact symmetric bounds are

`k_+(mu)<=k_-(mu)+1`,  `k_-(mu)<=k_+(mu)+1`.

Thus a multiple even level necessarily collides with an odd level.  In
particular, for `mu_+=min spec(Q_+)`, the sign-free condition
`det(Q_--mu_+*I)!=0` proves that the even bottom is simple; it does not
require the stronger order `min spec(Q_-)>mu_+`.

Let `A=Q_+`, `p(z)=det(A-zI)`, `q(z)=det(Q_--zI)`, and let
`K_A(u)=[u,Au,...,A^N u]`.  The boundary determinant and resultant
identities are

`q(z)=<eta,adj(A-zI)e_0>`,

`Res(p,q)=(-1)^(N*(N+1)/2)*det K_A(e_0)*det K_A(eta)`.

Consequently parity noncollision is equivalent to both boundary Krylov
determinants being nonzero.  Either determinant alone makes its boundary
vector cyclic and hence makes the entire even spectrum simple.  The source
commutator also gives the exact transport identity

`det K_(Q_+)(e_0)=det K_(Q_-)(beta)/N!`.

The stronger true-ground separation is equivalent to positivity of
`Q_--mu_+*I`, positivity of every coefficient of
`det(Q_--mu_+*I+sI)`, and positivity of its exact derivative-metric
pullback on `ker<eta,.>`.  These are finite equivalences, not an
actual-source sign theorem.  On a fixed-prime-inventory cell the relevant
discriminants, resultants, and Krylov determinants are real analytic.  A
certified rational search terminates only after a nonidentity theorem is
proved on that cell.  Exact analytic source-Cauchy counterfamilies with
nonzero `beta` have persistent even multiplicity and parity collisions, so
analyticity and the rank-two commutator alone do not prove nonidentity.

The fixed-`lambda` companion is also sharpened without changing that
conclusion.  For a simple infinite even ground `phi` with eigenvalue `mu`,
the exact low-mode Feshbach--Schur matrix `F_M(mu)` is nonnegative with
`ker F_M(mu)=C*P_M phi`; hence `A_(M,infinity)=0` is equivalent to
`F_M(mu)P_M kappa_infinity=0`.  A quantitative finite-to-infinite bound is
proved in terms of the unknown ground tail, its shifted-form energy, the
infinite ground gap, and the prolate overlap.  The available finite values
do not enclose those inputs, so a decreasing finite alignment trend
encloses neither zero nor a nonzero infinite limit.

The second audit keeps the physical Fourier scale visible.  If `y=A+iB` is
a root of the raw even polynomial and

`v(y)=sqrt((|y|-A)/2)`,  `delta=L/(4*pi)`,

then the associated transform zero has
`|Im z|=(2*pi/L)*v(y)`.  Open-strip exclusion therefore requires every root
to lie in `[0,infinity)` or satisfy `v(y)>=delta`; equivalently, it must
avoid the open parabola

`A>-delta^2`,  `B^2<4*delta^2*(A+delta^2)`

off the nonnegative real axis.

For every fixed mode, the correctly source-normalized projected prolate
coefficients satisfy

`sqrt(L)*c_n(lambda)->(-1)^n*Xi(0)/4`.

At fixed `N=2` the projective coefficient limit is `(1,-1,1)`, so the raw
polynomial tends to

`p_*(y)=y^2+y+4`,  `y_+/-=(-1+/-i*sqrt(15))/2`.

Here `v(y_+/-)=sqrt(5)/2`, and the corresponding physical zeros satisfy

`|Im z_lambda|=(pi*sqrt(5)/L)*(1+o(1))->0`.

Hence every sufficiently large fixed-`N=2` projected anchor has nonreal
zeros inside `|Im z|<1/2`.  This rejects a universal finite-anchor strip
claim and also catches unit-normalization or Fourier-scale substitutions.
It is not a counterexample on a projection-convergent schedule: at fixed
`N`, the projected norm tends to zero while the full state norm stays
positive.  Under a separately proved locally uniform limit to `Xi`, compact-
eventual off-axis exclusion is equivalent to the desired open-strip zero
statement for `Xi`; zeros may still escape horizontally, so a global finite
exclusion would be stronger.

The exact surviving obligations are unchanged in kind.  No actual-source
unbounded schedule is known to prove `beta`- or `e_0`-cyclicity, parity
noncollision, projection-convergent strip exclusion, the signed ground-
alignment rate, equation (5.2), or locally uniform convergence of the
ground transforms.  The formal state remains `P0_INVALIDATED`.

The two new checkpoint-0.72 modules pass `14/14`; the four checkpoint-0.71
and 0.72 frontier modules pass `28/28`.  At the checkpoint-0.72 freeze,
discovery contained `1550` tests.  The last complete repository suite remains
checkpoint 0.70 at `1522/1522`; the current checkpoint-0.73 discovery and
focused counts are recorded below.

## Checkpoint 0.73: canonical boundary ground and source-metric no-go

Checkpoint 0.73 is theorem-only.  It creates no source lock or numerical
artifact.  The finite selection theorem is in
`notes/CANONICAL_BOUNDARY_GROUND_CROSS_ROOT.md`, with exact regressions in
`tests/test_canonical_boundary_ground_cross_root.py`.  The harmonic
source-metric reduction is in
`notes/HARMONIC_ALIGNMENT_SOURCE_METRIC_NO_GO.md`, with exact regressions in
`tests/test_harmonic_alignment_source_metric_no_go.py`.

Let `A=Q_+`, `mu=min spec(A)`,

`E=ker(A-mu*I)`, `eta=sum_(|n|<=N)V_n`, `u=P_E eta`.

When `u!=0`, the canonical boundary ground

`x=u/||u||`

is cross-rooted even if `E` is multiple.  Indeed, the finite auxiliary

`Q_epsilon=Q-epsilon*|eta><eta|`

remains exactly source-Cauchy with

`a_n^(epsilon)=a_n-epsilon`,
`b_n^(epsilon)=b_n-epsilon*n`,

and its odd block is unchanged.  Negative rank-one interlacing gives exactly
one simple even eigenvalue below `mu`; its oriented eigenvector tends to
`P_E eta/||P_E eta||` at fixed `N`.  The checkpoint-0.71 theorem applies to
the simple auxiliary grounds, and coefficientwise closure gives

`p_x` real-rooted, hence `zeros(hat(x)) subset R union iR`.

Thus finite simplicity, parity noncollision, and boundary Krylov cyclicity
are no longer required for this canonical cross-root route when `P_E eta` is
nonzero.  They remain useful for other routes and for quantitative spectral
control.  The auxiliary is not a pinned arithmetic Weil matrix at a new
parameter and is not an infinite-rank construction: its norm is
`epsilon*(2*N+1)`, so the selection limit is taken at each fixed finite
`N`.

The boundary visibility condition is essential.  If `P_E eta=0`, the
rank-one term leaves `E` unchanged.  The exact source-Cauchy family

`Q=mu*I+c*|eta><eta|`, `c>0`,

has this failure for a multiple even bottom.  At `N=3` it contains a ground
vector whose raw polynomial is `p_x(y)=y^2+1`, so arbitrary vectors in a
multiple lowest eigenspace need not be cross-rooted.  An inversion-paired
diagonal shell perturbation does prove that every finite lowest even
eigenspace contains at least one cross-root vector, but that selector is
basis-dependent and does not identify the prolate-aligned direction.

Boundary visibility also does not imply prolate visibility.  The overlap

`alpha=<kappa,x>`

must still be nonzero and quantitatively controlled.  With
`p=Pi_M*kappa`, `k00=||p||^2`,
`L_M=Ran(Pi_M) intersect p^perp`,
`A_x=||P_(L_M)x||^2`, and `c_M=<Pi_M*x,p>`, the exact
multiplicity-safe projective identity, when
`k00*A_x+|c_M|^2>0`, is

`min_s ||Pi_M(s*x-kappa)||^2`
`=k00^2*A_x/(k00*A_x+|c_M|^2)`.

It uses no adjugate, simple-ground cofactor, or odd resolvent.  It also shows
that the separate alignment and overlap estimates have not disappeared.

The harmonic Schur reduction sharpens the remaining actual-source target.
At a simple true ground with nonzero anchor overlap, put
`X=x/alpha`, so `<kappa,X>=1`, and define the coefficient-normalized
alignment `A_M=||P_(L_M)X||^2=A_x/|alpha|^2`.  Write the positive
anchor-complement operator and complete combined forcing as

`B_mu=[[A,C^*],[C,D]]`, `b=(b_L,b_H)`,

relative to `K=L_M direct-sum H_M`, and define

`S=A-C^*D^(-1)C`, `f=b_L-C^*D^(-1)b_H`,

`U*ell=(ell,-D^(-1)C*ell)`.

Then

`B_mu*U=iota_L*S`, `U^*B_mu^2*U=S^2`, `U^*b=f`,

and the exact low alignment is

`A_M=f^*S^(-2)f`.

Consequently `A_M<=C0^2/lambda` is equivalent to the sharp rank-one
inequality

`f*f^* <= (C0^2/lambda)*S^2`.

Pulling this bordered inequality through the admitted full-source row metric
is only a congruence.  If

`R0=U^*(T*T^*)U`,
`H=R0^(-1/2)S^2R0^(-1/2)`,
`g=R0^(-1/2)f`,

then

`g^*H^(-1)g=f^*S^(-2)f=A_M`.

Source whitening can expose anisotropic generalized spectral clusters, but
it cannot change the exact certificate.  Replacing the clusters by the
single scalar bound `(g^*g)/lambda_min(H)` is lossy and can overestimate
`A_M` by an arbitrarily large factor.  An exact diagonal source-Cauchy
counterfamily also has zero anchor tail and strict shifted sectors while
keeping `A_M=16/9`.

With the inclusive ordinary Chebyshev discrepancy

`G_lambda(t)=exp(t)-psi_C(exp(t))`
` -(1/2)*log(1-exp(-2*t))`

and `q_v(t)=<v,K_t*kappa>`, the complete pole--archimedean--minus-prime
identity reduces the missing rate to the exact actual-source inequality

`| integral_0^L G_lambda(t)`
`   *(exp(-t/2)*q_(U*ell)(t))' dt |^2`
` <= (C0^2/lambda)*||B_mu*U*ell||^2`

for every `ell in L_M`, with `C0` uniform on one admitted unbounded
schedule.  This is equation (8.4) of the harmonic no-go note.  A pointwise
PNT estimate against fixed tests, separate source-block norms, a source row
frame, or scalar worst-direction whitening does not prove it because the
test vectors `U*ell` depend on the complete signed operator.

Checkpoint 0.73 therefore removes finite simplicity and cyclicity only from
the boundary-visible cross-root selection step.  It proves neither
`P_E eta!=0` on an actual-source schedule, nonzero prolate overlap, the
uniform inequality above in the simple-ground harmonic branch, the
corresponding multiplicity-safe projective rate in a multiple-ground
branch, equation (5.2), nor locally uniform convergence of the normalized
ground transforms.  The formal state remains `P0_INVALIDATED`.

The two checkpoint-0.73 modules pass `16/16` exact standard-library tests.
Together, the six checkpoint-0.71/0.72/0.73 frontier modules pass `44/44`.
Current discovery contains `1566` tests.  No complete-suite recount is claimed
here; the last complete repository suite remains checkpoint 0.70 at
`1522/1522`.

## Checkpoint 0.74: mixed projector, selector cone, and screened near-null no-go

Checkpoint 0.74 is source-locked and theorem-only.  It creates no source
lock, numerical artifact, or asymptotic certificate.  Its three frozen
packages are

* `notes/CANONICAL_GROUND_MIXED_PROJECTOR_OVERLAP.md`, with regressions in
  `tests/test_canonical_ground_mixed_projector_overlap.py`;
* `notes/SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md`, with
  regressions in
  `tests/test_source_cauchy_selector_cone_projective_tradeoff.py`; and
* `notes/SCREENED_NEAR_NULL_FORCING_RESPONSE.md`, with regressions in
  `tests/test_screened_near_null_forcing_response.py`.

For the finite even block `A=Q_(lambda,N,+)`, let

`mu=min spec(A)`, `E=ker(A-mu*I)`, `m=dim(E)`, `P=P_E`,

and retain the finite boundary vector `eta` and the unit source-normalized
projected prolate anchor `kappa`.  With the fixed sign convention

`p(z)=det(z*I-A)`, `C(z)=adj(z*I-A)`,

the first package proves the multiplicity-safe projector formula

`P=m*C^(m-1)(mu)/p^(m)(mu)`.

If `P*eta!=0` and

`b(z)=eta^T*C(z)*eta`, `c(z)=kappa^T*C(z)*eta`,

then the canonical overlap

`alpha=<kappa,P*eta>/sqrt(<eta,P*eta>)`

is exactly

`|alpha|^2=m*|c^(m-1)(mu)|^2`
` /(p^(m)(mu)*b^(m-1)(mu))`.

The denominator is positive because it equals
`m!*(m-1)!*g(mu)^2*<eta,P*eta>` when
`p(z)=(z-mu)^m*g(z)`.  Thus the ordinary adjugate is not substituted on a
multiple branch, where `C(mu)=0`.

The same overlap has a finite resolvent reconstruction.  If

`R_delta=(A-mu*I+delta*I)^(-1)`,
`y_delta=R_delta*eta/||R_delta*eta||`,

and `gamma` is the gap above the complete lowest even eigenspace, then

`||y_delta-P*eta/||P*eta||||`
` <=delta*||(I-P)*eta||/(||P*eta||*(gamma+delta))`.

This supplies a rigorous finite-`delta` lower enclosure, not an asymptotic
bound.  On an unbounded schedule the exact missing condition is equivalently

`|<kappa,P*eta>|^2`
` >=lambda^(-2*epsilon_lambda)*<eta,P*eta>`,
`epsilon_lambda->0`.

No such actual-source inequality is proved.  The boundary vector has
`||eta_N||^2=2*N+1` and no `l^2` limit, so the finite selector and resolvent
do not define an infinite-space rank-one perturbation.  An exact diagonal
source-Cauchy counterfamily has zero residual, a fixed gap above the complete
ground space, and exponentially small `alpha`; residual, gap, inversion,
and displacement structure therefore do not imply the missing rate.

The second package classifies finite source-Cauchy selectors.  Every
positive rank-one even block is either a coordinate direction or lies on
the compactified rational curve

`w_tau=e_0^+ + sum_(n=1)^N`
` sqrt(2)*tau/(tau+n^2)*e_n^+`.

Here `tau=0` is the central coordinate, `tau=infinity` is the boundary
vector, and the projective pole `tau=-j^2` is the `j`-th paired shell.  For
regular finite `tau`, the unique full source-Cauchy extension factorizes as

`H=|u><u|-tau*|v><v|`,

so its full rank is at most two.  The complete positive cone of even
source-Cauchy blocks is the finite moment cone generated by these rays; at
most `2*(N+1)-1` atoms are needed.

For a multiple lowest even eigenspace, let

`Y=||P*kappa||`, `T=tr(P_L*P)`,

where `P_L` is the low-mode projector perpendicular to the projected
anchor.  The exact coordinate-frame identities imply that some normalized
coordinate selector `x_j=P*e_j^+/||P*e_j^+||` satisfies, when `T>0`,

`||P_L*x_j||^2/|<kappa,x_j>|^2 <=2*T/Y^2`,

`|<kappa,x_j>|^(-2) <=2*m/Y^2`.

For `T=0`, the leakage is zero and the second constant improves to
`m/Y^2`.  Thus

`T=O(Y^2/lambda)`, `sqrt(m)/Y=lambda^o(1)`

is a sufficient conditional replacement for the multiple-ground alignment
inputs.  It is not proved for the pinned matrices.  The exact diagonal
separation countermodel has `Y^2=1`, `T=2`, zero residual and projection
tail, while its prolate-direction polynomial is `y^2+y+4`.  Every
cross-root selector stays a definite projective distance away, with
`A_x/|<kappa,x>|^2>=1/294`.  The selector classification therefore supplies
no projector trace rate or prolate orientation by itself.

The third package starts from the exact harmonic graph of checkpoint 0.73.
For

`S^2*v_j=vartheta_j*R0*v_j`, `v_i^*R0*v_j=delta_(ij)`,

put `r_j=S*v_j/sqrt(vartheta_j)` and `y=S^(-1)*f`.  Then `(r_j)` is
Euclidean orthonormal and

`<v_j,f>=sqrt(vartheta_j)*<r_j,y>`.

This is exactly one automatic square-root factor.  A second factor would
require a new actual-source estimate on `<r_j,y>`.

Under the displayed finite invertibility, boundary normalization, and
nonzero-overlap hypotheses of the screened note, define

`Rcal=P_(kappa,Phi)*D0^(-1)*O^(-1)`.

The source commutator gives the exact transport

`I_K=Rcal*D*B+(Rcal*D*kappa)*phi_b`.

With the inner product antilinear in its first variable, the transported
generalized mode contains `conj(a_j)`, and the complete combined-source
functional gives

`(1-gamma)*a_j=c_j`,

`1-conj(gamma)=det(Rcal*(D|_K)*B)!=0`.

Consequently

`A_M=||P_L*D^*Rcal^*b||^2/|1-gamma|^2`.

For a threshold `tau`, the exact low generalized cluster plus the complete
forcing energy `beta_0=<f,R0^(-1)f>` yields

`A_M <= ||P_(<=tau)^r*P_L*D^*Rcal^*b||^2/|1-gamma|^2`
`       +beta_0/tau`.

This is a conditional reorganization, not a rate.  The exact
nonzero-displacement `N=1` source-Cauchy countermodel has a simple even
ground, strict odd shifted sign, nonzero boundary and anchor overlaps, and
positive source metric, yet `A_M=121/4`.  Its screened ratio is
`c/(1-gamma)=11/2`; the odd resolvent cancels the small forcing rather than
creating a second spectral factor.

Only the perturbed fixed-`N` auxiliary vector `x_epsilon` is asserted
simple.  Its selected limit can lie in a multiple original ground
eigenspace.  Checkpoint 0.74 proves no actual-source mixed
projector lower bound, selector trace or projected-mass rate, screened
cancellation or complementary-energy bound, uniform feedback denominator,
signed alignment rate, projection-convergent strip exclusion, equation
(5.2), or locally uniform ground-transform limit.  All locked conventions
remain unchanged: `L=2*log(lambda)`, centered `exp(-i*z*t)`, Lebesgue
measure, zero extension, inversion reflection, source normalization, the
inclusive prime-power inventory `1<n<=lambda^2`, and the minus sign on the
source equation (3.19) prime block.  The formal state remains
`P0_INVALIDATED`.

The three checkpoint-0.74 modules pass `21/21` exact standard-library
tests.  Together, the nine checkpoint-0.71/0.72/0.73/0.74 frontier modules
pass `65/65`.  Current discovery contains `1587` tests.  The last complete
repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`1587`-test recount is pending.

## Checkpoint 0.75: parity collision and feedback-origin collapse

Checkpoint 0.75 is source-locked and theorem-only.  It creates no source
lock, numerical artifact, or asymptotic certificate.  Its two packages are

* `notes/PARITY_COLLISION_PROJECTOR_ORIENTATION.md`, with exact regressions
  in `tests/test_parity_collision_projector_orientation.py`; and
* `notes/SCREENED_FEEDBACK_ORIGIN_COLLAPSE.md`, with exact regressions in
  `tests/test_screened_feedback_origin_collapse.py`.

For the even and odd blocks

`A=Q_+`, `B=Q_-`, `mu=min spec(A)`,

put `P=P_(ker(A-mu*I))`, let `F` project onto
`ker(B-mu*I)`, and retain the exact source displacement

`D*A-B*D=|beta><eta|`.

On the regular noncollision branch `F=0`, the even ground is simple and
boundary visible.  If `x=P*eta/||P*eta||`,
`alpha=<kappa,x>`, `Y=||P*kappa||`, and
`T=tr(P_L*P)`, then

`|alpha|^2=Y^2`, `T<=1-Y^2`.

Thus a rigorous tangent majorant `tan(theta)<=tau` gives simultaneously

`|alpha|^(-2)<=1+tau^2`,
`T/Y^2<=tau^2`.

In particular, `tau=O(lambda^(-1/2))` would close the checkpoint-0.74
mixed overlap and trace rates on this branch.  That actual-source tangent
or shifted-solve rate is not proved.

The visible collision branch has a different exact decomposition.  Put

`u=P*eta`, `t=<eta,P*eta>`,
`S=(B-mu*I)^dagger`, `d=D*eta`.

When `t>0`, the source commutator gives

`F*beta=0`, `D^* Ran(F) subset ker(A-mu*I)`,

`D*u=F*d-t*S*beta`, `u=g+t*h`, `t=||g+t*h||^2`.

The collision image `W=Ran(D^*F)` is an actual subspace of the even ground
space and forces

`T>=tr(P_L*P_W)=sum_j cos(phi_j)^2`.

The term `F*d` is invisible to every estimate driven only by the usual odd
forcing `beta`.  Hence a visible collision needs a separate principal-angle
and mixed-numerator theorem; screened control of `S*beta` cannot supply it.
If `t=0`, the canonical boundary ground and `alpha` are undefined and the
branch fails closed.  An exact nonzero-displacement fixture has
`F*beta!=0`, so division by `t` would create a false conclusion.

The second package evaluates the checkpoint-0.74 feedback determinant
exactly.  Under its finite simple-ground, boundary, invertibility, and
source-relative-determinant gates, let `xi` be the unit even ground,
`alpha=<kappa,xi>`, and write

`kappa_0=<e_0,kappa>`, `xi_0=<e_0,xi>`,
`x=xi/alpha`.

Then, with the declared antilinear-first complex convention,

`1-conj(gamma)=conj(kappa_0*alpha/xi_0)`,

and therefore

`1-gamma=kappa_0*alpha/xi_0=kappa_0/x_0`.

The screened denominator is not an independent cancellation reserve.  The
adjoint transport collapses as well:

`P_L*D_K^*Rcal^*b=-(kappa_0/xi_0)*P_L*xi`.

Consequently every screened cluster amplitude is exactly the corresponding
projective ground component.  In particular,

`sum_(theta_j<=tau)|c_j|^2/|1-gamma|^2`
` =||P_(<=tau)^r*P_L*xi||^2/|alpha|^2`,

and the full identity is

`A_M=||P_L*xi||^2/|alpha|^2`.

The complementary energy is the same orientation with the generalized
weights retained.  Screening therefore reorganizes the ground orientation;
it does not produce a new decay factor.

For the actual source-normalized projected anchor, on the admitted integer
schedules `N(lambda)/L^(7/5) -> infinity`, the origin theorem gives
`sqrt(L)*kappa_0 -> Xi(0)/(4*a_infinity)>0`.  Conditional on the still
unproved overlap rate `|alpha|^(-1)=lambda^o(1)`, the exact collapse gives
`|1-gamma|^(-1)=lambda^o(1)`.  This removes the feedback denominator as a
separate obligation but does not prove the overlap or alignment rate.  Exact
complex and source-Cauchy counterfixtures reject lost conjugations, zero
finite gates, and any uniform feedback or orientation inference from the
source-Cauchy structure alone.

Checkpoint 0.75 proves no actual-source parity noncollision, no visible-
collision principal-angle rate, no `tau=O(lambda^(-1/2))` theorem, no
subpolynomial overlap, no projective ground-alignment rate, equation (5.2),
or locally uniform ground-transform limit.  All locked conventions remain
unchanged: `L=2*log(lambda)`, centered `exp(-i*z*t)`, Lebesgue measure, zero
extension, inversion reflection, source normalization, the inclusive
inventory `1<n<=lambda^2`, and the minus sign on the source equation (3.19)
prime block.  The formal state remains `P0_INVALIDATED`.

The two checkpoint-0.75 modules pass `15/15` exact standard-library tests.
Together, the eleven checkpoint-0.71/0.72/0.73/0.74/0.75 frontier modules
pass `80/80`.  Current discovery contains `1602` tests.  The last complete
repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`1602`-test recount is pending.

## Checkpoint 0.76: spectral-cluster diagonal-selector no-go

Checkpoint 0.76 is source-locked and theorem-only.  It creates no source
lock, numerical artifact, or asymptotic certificate.  The finite theorem and
its exact regressions are recorded in
`notes/SPECTRAL_CLUSTER_DIAGONAL_SELECTOR_BRIDGE.md` and
`tests/test_spectral_cluster_diagonal_selector_bridge.py`.

Let `A=A^*` be the even block of a real inversion-symmetric finite
source-Cauchy matrix, let `P` be a bottom-cluster projector, put `R=I-P`, and
shift the cluster bottom so that

`0<=P*A*P<=w*P`, `R*A*R>=G*R`, `G>w>=0`.

For a unit target `v in Ran(P)`, suppose a real inversion-even diagonal
selector `H` obeys

`P*H*P=|v><v|`, `||H||<=chi`, `c=||R*H*P||`.

Then `B=A-epsilon*H` remains in the finite source-Cauchy class.  If

`Delta=G-w-epsilon*(chi-1)>0`, `epsilon>w`,

and `x=y+z`, `y=P*x`, `z=R*x`, is a unit lowest vector of `B`, the direct
block theorem gives

`rho=epsilon*c/Delta`,

`q=(w+epsilon^2*c^2/Delta)/(epsilon-w)`,

`||z||/||y||<=rho`,

`||(P-|v><v|)y||/||y||<=q`,

`sin angle(x,v)<=sqrt(rho^2+q^2)`.

If `rho^2+q^2<1/2`, the lowest eigenvalue is simple.  With only `c<=chi`,
the balanced choice `epsilon=sqrt(w*G)/chi` exposes the sharp norm-only
scale

`w*chi^2/G -> 0`,

not `w*chi/G -> 0`.  The exact diagonal realization test is the symmetric-
square range condition for `P*diag(h)*P`; surjectivity is equivalent to
`rank(P o P)=m*(m+1)/2`, and its Euclidean right-inverse cost is governed by
`1/sqrt(lambda_min^+(P o P))`.  The intrinsic target cost is instead the
`l_infinity` linear-program value `chi_v`.

This yields a conditional natural-cutoff bridge.  For the projected,
source-normalized prolate anchor `kappa`, put

`Y=||P*kappa||`, `v=P*kappa/Y`, `r=(I-P)*kappa`.

Scaling the selected ground by `Y` gives the exact identity

`Y*x-kappa=Y*(x-v)-r`.

At `M=ceil(lambda)`, a convenient sufficient hypothesis is

`sqrt(w*chi^2/G)+||P_M*(I-P)*kappa||=O(lambda^(-1/2))`.

Together with the admitted outer projection rate and all finite gates, this
would give simple source-Cauchy even grounds whose correctly normalized
transforms converge locally uniformly to `Xi`.  This implication is
conditional: none of its actual-source spectral inputs is proved.

The no-go boundary is sharp.  Exact diagonal realization can fail, in which
case `chi=+infinity`; it can also hold with diverging cost even in fixed
dimension, exact capture, bounded spectral diameter, and vanishing residual.
An exact diagonal source-Cauchy family has selector cost asymptotic to
`8/(17*tau^2)`.  Residual-shell and two-vector Ritz data do not force a
proper bottom cluster, useful width-to-gap ratio, symmetric-square
realization, or conditioning.  Optimizing over the larger full source-Cauchy
selector space is a separate problem and is not completed here.

Checkpoint 0.76 therefore proves no actual-source bottom-cluster capture,
selector realization, selector-cost bound, spectral leakage rate, or
`w*chi^2/G=O(lambda^(-1))` window on an unbounded schedule.  It proves no RH
statement, Lambda bound, projection-convergent strip exclusion, equation
(5.2), or locally uniform ground-transform theorem.  All locked conventions
remain unchanged: `L=2*log(lambda)`, centered `exp(-i*z*t)`, Lebesgue
measure, zero extension, inversion reflection, source normalization, the
inclusive inventory `1<n<=lambda^2`, and the minus sign on the source
equation (3.19) prime block.  The formal state remains `P0_INVALIDATED`.

The checkpoint-0.76 module passes `7/7` exact standard-library tests.
Together, the twelve checkpoint-0.71/0.72/0.73/0.74/0.75/0.76 frontier
modules pass `87/87`.  Current discovery contains `1609` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`1609`-test recount is pending.

## Checkpoint 0.77: diagonal-anchor root geometry

Checkpoint 0.77 is source-locked and theorem-only.  It creates no source
lock, numerical artifact, or effective asymptotic certificate.  The exact
finite shell-forcing and root-pencil reductions are recorded in
`notes/DIAGONAL_ANCHOR_FORCING_SIGNED_LAPLACIAN_STRIP_GATE.md`, with
regressions in
`tests/test_diagonal_anchor_forcing_signed_laplacian_strip_gate.py`.  The
natural-cutoff negative-real-root theorem is recorded in
`notes/NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md`, with regressions in
`tests/test_natural_cutoff_negative_real_root_exclusion.py`.

Let `A=Q_+` be the even block of a finite real inversion-symmetric
source-Cauchy matrix, and let the displayed even anchor `kappa` have no zero
coordinate.  For a requested real eigenvalue `mu`, the unique raw shell
diagonal forcing that anchor is

`h_j=(A*kappa)_j/kappa_j-mu`.

Changing `mu` changes only the scalar gauge, so the shifted operator is
unchanged.  The forcing preserves the off-diagonal source-Cauchy data and
the source commutator.  With

`w_ij=-A_ij*kappa_i*kappa_j`,

the forced shifted even block `T_+` obeys the exact congruence

`diag(kappa)*T_+*diag(kappa)=L_w`.

Thus the forced anchor is a lowest even eigenvector exactly when the signed
Laplacian `L_w` is positive semidefinite, and it is the simple lowest line
exactly when `ker(L_w)=span(1)`.  For `N>=1`, this strict division-free gate
itself forces all anchor coordinates to be nonzero.  When the positive-edge
graph is connected, the negative inertia is exactly the number of eigenvalues
greater than one of

`R_-=W_-^(1/2)*C_-^*L_+^dagger*C_-*W_-^(1/2)`.

For one negative edge this reduces to the sharp effective-resistance test
`q*R_eff<=1`, with equality producing another zero direction.

The same forced shell has an exact parity-pencil reduction.  Under the
stated finite nonvanishing gates, the raw anchor polynomial satisfies

`p_kappa(y)=c*det(y*I-X)`

and, when `T_-` is nonsingular,

`det(K-y*T_-)=(-1)^N*(det(T_-)/c)*p_kappa(y)`.

If some real shift has `C=K+sigma*T_->0` and
`R=C^(-1/2)*T_-*C^(-1/2)`, every root is real and has the form
`y=1/r-sigma`.  Writing `delta=L/(4*pi)`, the exact sufficient finite-strip
gate is

`(I-sigma*R)*(I+(delta^2-sigma)*R)>=0`.

Identical-inertia source-Cauchy counterfamilies place nonreal roots on both
sides of the physical strip boundary.  Inertia therefore counts possible
conjugate pairs but does not control their height.  The strict anchored
Dirichlet/signed-Laplacian gate is sufficient for the already stated
axis-rooted limit route only conditionally on one projection-convergent
unbounded schedule.  Neither it, its effective-resistance form, nor the
stronger shifted-pencil gate is proved for the actual source.

The second checkpoint-0.77 theorem gives one asymptotic advance within the
admitted prolate estimates.  At the natural cutoff
`M=ceil(lambda)`, for the source-normalized projected prolate anchor
`f_lambda`, the growing-order Gevrey estimate yields

`sup_(|tau|<=1/2)|widehat(f_lambda)(i*tau)-Xi(i*tau)/4| -> 0`.

Because `Xi(i*tau)>0` on the closed segment, the corresponding raw
polynomial eventually has no root in the closed interval

`[-(L/(4*pi))^2,0]`.

This exclusion is qualitative and non-effective: no finite starting
`lambda` is certified.  It settles only the negative-real branch.  The
nonreal branch remains unresolved; local uniform convergence and Rouche's
theorem show that an off-axis zero of `Xi` in the open strip would force a
forbidden nonreal raw root on every sufficiently large natural cutoff.
Consequently full nonreal-root exclusion has RH strength.  A global finite
exclusion would additionally need to prevent roots from escaping
horizontally.

Checkpoint 0.77 proves no actual-source anchored sign gate, no nonreal-root
exclusion, no `DIRECT_RH_ATTACK.md` equation (5.2), no RH conclusion, and no
Lambda bound.  All locked conventions remain unchanged: `L=2*log(lambda)`,
centered `exp(-i*z*t)`, Lebesgue measure, zero extension, inversion
reflection, source normalization, the inclusive inventory
`1<n<=lambda^2`, and the minus sign on the source equation (3.19) prime
block.  The formal state remains `P0_INVALIDATED`.

The two checkpoint-0.77 modules pass `21/21` exact standard-library tests.
Together, the fourteen checkpoint-0.71/0.72/0.73/0.74/0.75/0.76/0.77
frontier modules pass `108/108`.  Current discovery contains `1630` tests.
The last complete repository suite remains checkpoint 0.70 at `1522/1522`;
a complete `1630`-test recount is pending.

## Checkpoint 0.78: anchored routing and strip winding index

Checkpoint 0.78 is source-locked and theorem-only.  It creates no source
lock, numerical artifact, or actual-source asymptotic certificate.  The
anchored Weil--Dirichlet and contractive-routing reductions are recorded in
`notes/ANCHORED_WEIL_DIRICHLET_CONTRACTIVE_ROUTING.md`, with regressions in
`tests/test_anchored_weil_dirichlet_contractive_routing.py`.  The exact
natural-cutoff winding and Cauchy-index reduction is recorded in
`notes/NATURAL_CUTOFF_STRIP_WINDING_INDEX.md`, with regressions in
`tests/test_natural_cutoff_strip_winding_index.py`.

For the forced even block of checkpoint 0.77, write `z=diag(kappa)*f` and
`d_f=sum_i kappa_i*|f_i|^2*e_i`.  The anchored energy is exactly the complete
source distribution applied to

`Omega_(kappa,f)=q(z,z)-(q(d_f,kappa)+q(kappa,d_f))/2`,

and

`Omega_(kappa,f)=-sum_(i<j) kappa_i*kappa_j*|f_i-f_j|^2*q(e_i,e_j)`.

In particular, `Omega_(kappa,f)(0)=Omega_(kappa,f)(L)=0`, and the pole,
archimedean, and minus-prime pieces combine before any estimate into

`E_(lambda,N)(f)=-integral_0^L G(x)*(d/dx)(e^(-x/2)*Omega_(kappa,f)(x)) dx`,

where `G(x)=e^x-psi_C(e^x)-log(1-e^(-2x))/2`.  The cross correlations are
explicit sine polynomials, and the off-diagonal anchored weights have the
weighted-Loewner form

`w_ij=-p_i*p_j*(c_i-c_j)/(t_i-t_j)`.

This form is blind to the source diagonal.  Its tests vanish at the origin,
so they are not dense in the nonzero ordinary Weil-square cone in any
source-test topology where origin evaluation is continuous; exact source-
Cauchy fixtures also show that finite Weil positivity and anchored positivity
are structurally incomparable.

The strict anchored gate itself forces the positive-edge graph to be
connected.  With `B_+=C_+*W_+^(1/2)`, `B_-=C_-*W_-^(1/2)`, its unique
minimum-norm negative-edge routing is `S=B_+^dagger*B_-`.  Then
`B_-=B_+*S`, `S^*S=R_-`, and the exact energy square is

`E_(lambda,N)(f)=||(I-S*S^*)^(1/2)*B_+^*f||^2`.

Consequently the strict gate is equivalent to positive-graph connectedness
and `||S||_op<1`, equivalently `lambda_max(R_-)<1`, with
`lambda_max(R_-)=0` by convention when there are no negative edges.
Separate strict
one-edge effective-resistance tests do not imply this collective
contraction.  Nor does a small anchor residual control the forced diagonal:
a widening-core passage needs inverse-coordinate control of
`(A*kappa)_i/kappa_i`.  Neither the routing contraction nor that inverse-
coordinate estimate is proved for the actual source on an unbounded
schedule.

The second package makes the remaining natural-cutoff nonreal-root target
an exact finite index equality.  For

`Phi(y)=p_x(y)/D_M(y)=c+2*sum_(n=1)^M n^2*x_n/(y-n^2)`

and `Gamma_h(t)=Phi((t+i*h)^2)`, let `W_h` be the oriented winding of
`Gamma_h` and let

`I_h=-Ind^up_(RP^1)(B_h/A_h)=2*W_h`,

where `A_h` and `B_h` are the exact real polynomial clearings of the real
and imaginary boundary parts.  In the generic branch, the number `Z_h` of
zeros of `p_x(s^2)` in `|Im(s)|<h` is `Z_h=2*M-I_h`.  After separating
positive-real roots, negative roots in `(-h^2,0)`, and conjugate nonreal
pairs, one gets

`2*R_-(h)+4*C_h=I_(0+)-I_h`.

Removable lattice factors are canceled first, a vanishing leading
coefficient uses the polynomial boundary loop, and a root on the parabolic
boundary uses the inward index `I_(h-)`.

At `h=delta=L/(4*pi)`, checkpoint 0.77's closed negative-real exclusion
therefore gives

`4*C_delta=I_(0+)-I_(delta-)`.

Thus the necessary and sufficient finite certificate for the remaining
nonreal branch is exactly `I_(delta-)=I_(0+)`.

This equality is not supplied by functional symmetry, imaginary-segment
positivity, or the admitted absolute Gevrey estimates.  An exact finite
polynomial family remains positive on the entire imaginary axis while its
index drop changes by four, and a real-even Gevrey-small factor can insert
off-axis zeros that escape horizontally.  No actual-source index equality,
contractive routing theorem, global finite strip exclusion,
`DIRECT_RH_ATTACK.md` equation (5.2), RH conclusion, or Lambda bound is
proved.

All locked conventions remain unchanged: `L=2*log(lambda)`, centered
`exp(-i*z*t)`, Lebesgue measure, zero extension, inversion reflection,
source normalization, the inclusive inventory `1<n<=lambda^2`, and the
minus sign on the source equation (3.19) prime block.  The formal state
remains `P0_INVALIDATED`.

The two checkpoint-0.78 modules pass `21/21` exact standard-library tests.
Together, the sixteen checkpoint-0.71/0.72/0.73/0.74/0.75/0.76/0.77/0.78
frontier modules pass `129/129`.  Current discovery contains `1651` tests.
The last complete repository suite remains checkpoint 0.70 at `1522/1522`;
a complete `1651`-test recount is pending.

## Checkpoint 0.79: shrinking collar and routing vertex obstruction

Checkpoint 0.79 is source-locked and theorem-only.  It creates no source
lock, numerical artifact, or actual-source asymptotic certificate.  The
weaker natural-cutoff collar and horizontal-escape reduction is recorded in
`notes/NATURAL_CUTOFF_SHRINKING_COLLAR_ESCAPE_REDUCTION.md`, with regressions
in `tests/test_natural_cutoff_shrinking_collar_escape_reduction.py`.  The
actual-source weighted-Loewner vertex obstruction is recorded in
`notes/ACTUAL_SOURCE_ANCHORED_ROUTING_VERTEX_OBSTRUCTION.md`, with regressions
in `tests/test_actual_source_anchored_routing_vertex_obstruction.py`.

For positive raw heights `0<a<b`, let `Z_(r-)` and `Z_(r+)` be the inward
and outward zero counts for the reduced polynomial `p_x(s^2)`.  Once the
closed negative-real branch is excluded, the exact open-collar count is

`4*C_(a,b)=Z_(b-)-Z_(a+)`.

In the nonzero-leading-coefficient branch this is equivalently

`4*C_(a,b)=I_(a+)-I_(b-)`;

the vanishing-leading-coefficient branch uses the corresponding polynomial
loop winding.  Thus an index gap in `[0,4)` forces collar equality.  At the
natural cutoff, choose any explicit physical height `epsilon_lambda->0` and
put

`a_lambda=epsilon_lambda*L/(2*pi)`.

The already-admitted locally uniform convergence to `Xi/4` shows that the
eventual equality

`Z_(delta-)=Z_(a_lambda+)`, `delta=L/(4*pi)`,

would exclude every off-axis zero of `Xi` in the open strip.  This is a
strictly weaker sufficient reduction than global finite real-rootedness: it
allows finite nonreal splitting below the shrinking inner height.  It is
still RH-strength and is not proved for the actual source.

Every individual finite transform also has an exact horizontal root bound.
If `c!=0`, use `a_0=c` and
`B_0=2*sum n^2*|x_n|`.  If `c=0`, let `a_k=mu_k` be the first nonzero even
secular moment and put `B_k=2*sum n^(2*k+2)*|x_n|`.  Then every nonlattice
zero obeys

`|Re(s)|^2<=M^2+B_k/|a_k|`.

The coefficient `a_k` is exactly the first nonzero even endpoint jet of the
finite trigonometric state.  No admitted actual-source estimate bounds
`B_k/|a_k|`, so this finite theorem supplies no uniform escape rate.
Shifted Hermite--Biehler has the opposite inside-strip geometry, a positive
symmetrizer for the rank-one secular matrix would already require the
missing real spectrum, and exact polynomial and Gevrey-scale families retain
imaginary-axis positivity and compact agreement while splitting or escaping
horizontally.  None closes the collar.

For the routing route, the actual combined source weights are

`w_ij=-p_i*p_j*(c_i-c_j)/(t_i-t_j)`, `c_n=n*b_n`.

Strict anchored positivity requires every vertex degree to be positive when
`N>=1`.  The central degree is the exact signed covariance

`d_0=(2*x_0/sqrt(L))*integral_0^L F_align(t)*(f_N(t)-x_0/sqrt(L)) dt`,

where `dF_align=-exp(-t/2)*dG_lambda` retains the complete
pole--archimedean--minus-prime source.  The first alternating degree gives
the separate necessary inequality

`b_1*x_0+2*sum_(m>=2) x_m*(b_1-m*b_m)/(1-m^2)>0`.

The central Stieltjes formula is interpreted improperly at zero; its
logarithmic endpoint is canceled by the primitive of the zero-mean anchor
part.  The same final displacement has the exact finite truncated-transform
formula

`b_n=Re((a_n+i/2)*D_L(-1/2-i*a_n))/pi`.

Replacing `D_L` by a formally continued infinite logarithmic derivative is
not a proved limit theorem and cannot sign either vertex inequality.

An exact unbounded source-Cauchy countermodel preserves the admitted fixed-
mode anchor direction, arbitrarily small combined displacement, zero forced
anchor residual, and a connected positive graph, yet has `d_1<0` and

`liminf ||B_+^dagger*B_-||_op^2>=2`.

Global scaling of the final displacement leaves this routing ratio
unchanged.  Therefore projection convergence, residual smallness, diagonal
coercivity, and absolute coefficient bounds do not imply the actual-source
gate.  The first live arithmetic targets are the two signed vertex
inequalities, positive-graph connectivity, and the collective contraction
`lambda_max(R_-)<1`; the stronger scalar trace bound
`sum_(e in E_-)|w_e|*R_eff^(+)(e)<1` would suffice but is also unproved.

No actual-source shrinking-collar equality, endpoint-jet relative lower
bound, signed vertex inequality, positive-graph connectivity, collective
routing contraction, global finite strip exclusion, `DIRECT_RH_ATTACK.md`
equation (5.2), RH conclusion, or Lambda bound is proved.  All locked
conventions remain unchanged: `L=2*log(lambda)`, centered `exp(-i*z*t)`,
Lebesgue measure, zero extension, inversion reflection, source
normalization, the inclusive inventory `1<n<=lambda^2`, and the minus sign
on the source equation (3.19) prime block.  The formal state remains
`P0_INVALIDATED`.

The two checkpoint-0.79 modules pass `23/23` exact standard-library tests.
Together, the eighteen checkpoint-0.71/0.72/0.73/0.74/0.75/0.76/0.77/0.78/
0.79 frontier modules pass `152/152`.  Current discovery contains `1674`
tests.  The last complete repository suite remains checkpoint 0.70 at
`1522/1522`; a complete `1674`-test recount is pending.

## Checkpoint 0.80: verified-height collar and screw subsequence

Checkpoint 0.80 is source-locked and theorem-only.  It creates no new
source lock or numerical artifact.  The bounded verified-height collar is
recorded in `notes/VERIFIED_HEIGHT_SHRINKING_COLLAR_PARTIAL_THEOREM.md`,
with regressions in
`tests/test_verified_height_shrinking_collar_partial_theorem.py`.  The
central weighted-Loewner screw reduction and subsequence theorem are
recorded in `notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md`, with
regressions in `tests/test_anchored_central_degree_screw_barrier.py`.

The collar implication needs only an unbounded certified subsequence whose
physical inner heights have lower limit zero; in raw units it is enough
that `liminf a_lambda/L=0`.  Likewise, a single synchronized cofinal family
of compact rectangles is enough for the compact phase alternative.  These
are weaker formulations of the surviving global target, not proofs of its
actual-source certificate.

There is nevertheless a genuine bounded actual-source theorem.  Let

`H_PT=3000175332800`.

The finite-height critical-line theorem already pinned in
`ZERO_SAMPLING_SOURCE_LOCK.json`, together with the admitted fixed-compact
Gevrey factorization, implies that for every fixed `0<R<H_PT` all
sufficiently large natural-cutoff anchors satisfy

`hat(f_lambda)(z)!=0` when
`|Re(z)|<=R` and `1/L<=|Im(z)|<=1/2`.

No simplicity of the verified zeros is used.  The proof factors
`4*hat(f_lambda)=Xi*A_(lambda,R)+E_(lambda,R)`, with
`A_(lambda,R)-1=O_R(lambda^(-2))` and
`E_(lambda,R)=O_R(exp(-c_R*L^2))`, and compares this with the finite
real-zero lower bound `|Xi(x+i*y)|>=b_R*|y|^(m_R)`.  The starting threshold
is doubly non-effective, and the pinned Platt--Trudgian Arb/Turing
computation is disclosed but not independently replayed here.  Most
importantly, `R` is fixed: this theorem supplies no cofinal horizontal
window and no global shrinking-collar equality.

For the metric route, let `R(t)=F_align(t)-c_infinity` be the scalar-deleted
complete pole--archimedean--minus-prime discrepancy and

`g(T)=integral_0^T R(t) dt`.

The exact one-sided transform is

`integral_0^infinity exp(-q*T)*g(T) dT`
`=-(1/q^2)*(xi_R'/xi_R)(1/2+q)`, `Re(q)>1/2`.

For the actual source-normalized natural-cutoff anchor, the central degree
has the cancellation-preserving decomposition

`d_0=(2*x_0/sqrt(L))*J_L-(2*x_0^2/L)*g(L)`,

where the arithmetic--prolate convolution satisfies
`J_L=O_A(lambda^(-A))` for every fixed `A>0`.  Hence

`d_0=-(2*x_0^2/L)*g(L)+O_A(lambda^(-A))`.

An unconditional law-of-the-excluded-middle argument, using the locked
zero count in the RH branch and an eventual-nonnegative Laplace barrier in
the non-RH branch, produces odd integers `p_j->infinity` such that
`lambda_j=p_j/2`, `-g(2*log(lambda_j))>1/(2*T_*^2)` with
`T_*=30610046000`, and consequently `d_0(lambda_j)>0` eventually.  This is
an existential unbounded central-vertex subsequence theorem only.  It does
not prove central positivity on the full natural schedule.

The pointwise sign `g(T)<=0` for every positive `T` remains unresolved and
is RH-equivalent in the explicitly unadmitted Suzuki context cited by the
note; that paper is not used as a theorem dependency.  The exact vertex-1
companion identity still contains uncontrolled low-frequency screw
differences and a collective term, so no vertex-1 sign, all-vertex sign,
positive-graph connectivity, or routing contraction follows.

No cofinal actual-source collar equality, asymptotically unbounded
verified-height window, endpoint-jet relative lower bound, full-schedule
screw sign, vertex-1 sign, collective routing contraction, global finite
strip exclusion, `DIRECT_RH_ATTACK.md` equation (5.2), RH conclusion, or
Lambda bound is proved.  All locked conventions remain unchanged:
`L=2*log(lambda)`, centered `exp(-i*z*t)`, Lebesgue measure, zero extension,
inversion reflection, source normalization, the inclusive inventory
`1<n<=lambda^2`, and the minus sign on the source equation (3.19) prime
block.  The formal state remains `P0_INVALIDATED`.

The two checkpoint-0.80 modules pass `24/24` exact standard-library tests.
Together, the twenty checkpoint-0.71/0.72/0.73/0.74/0.75/0.76/0.77/0.78/
0.79/0.80 frontier modules pass `176/176`.  Current discovery contains
`1698` tests.  The last complete repository suite remains checkpoint 0.70
at `1522/1522`; a complete `1698`-test recount is pending.

## Checkpoint 0.81: resonant, collective, and full-forcing barriers

Checkpoint 0.81 is source-locked and theorem-only.  It creates no source
lock or numerical artifact.  The exact vertex-1 resonant reduction is in
`notes/ANCHORED_VERTEX_ONE_RESONANT_SCREW_MOMENT_BARRIER.md`, the collective
all-edge reduction is in
`notes/SCREW_MARGIN_COLLECTIVE_ROUTING_RANK_ONE_BARRIER.md`, and the full
source-Cauchy forcing classification is in
`notes/FULL_SOURCE_CAUCHY_ANCHOR_FORCING_FEASIBILITY.md`.  Their regressions
are the correspondingly named `tests/test_*.py` modules.

Put `omega=2*pi/L`, `Psi(T)=-g(T)`, and write

`sqrt(L)*f_N(t)=sum_(j=0)^N p_j*cos(j*omega*t)`.

The vertex-1 error has the exact cancellation-preserving form

`E_1=sqrt(L)*J_L+omega*integral_0^L Psi(t)*W_(1,L)(t) dt`,

where

`W_(1,L)=p_1*sin(omega*t)`
`+sum_(j!=1)p_j*(j*sin(j*omega*t)-sin(omega*t))/(1-j^2)`.

Consequently

`d_1=(2*p_1^2/L)*Psi(L)+(2*p_1/L)*E_1`.

On the checkpoint-0.80 favorable subsequence the `sqrt(L)*J_L` term is
negligible relative to `|p_1|*Psi(L)`, but the remaining resonant screw
moment is not controlled.  The exact new relative target is

`omega*integral_0^L Psi(t)*W_(1,L)(t) dt`
`=o(|p_1|*Psi(L))`.

This gap is structural: applying the resonant Green transform to a formal
correction `hat(H)(z)=P(z^2)*Xi(z)` produces the entire divided difference

`omega^2*sqrt(L)*(hat(H)(z)-hat(H)(omega))/(z^2-omega^2)`,

which generally is nonzero at zeros of `Xi`.  Hence the `Xi` divisibility
that flattened the central convolution does not flatten vertex 1.  An exact
smooth synthetic discrepancy keeps the actual anchor coordinates, a fixed
positive screw margin, `J_L=0`, and `d_0>0`, yet has `d_1<0`.  It is not the
pinned arithmetic source.

For every edge and vertex the complete screw moments give

`w_(ij)=(2*p_i*p_j/L)*(i^2*A_i-j^2*A_j)/(i^2-j^2)`,

`d_k=(2*p_k/L)*(sqrt(L)*J_L-p_k*A_k+T_k)`.

With `Delta_n=A_n-g`, `P=sum_n p_n`, the graph Laplacian splits exactly as

`L_w=(2*Psi/L)*(p*p^T-P*diag(p))+L_Delta`.

If `P=0` and every `Delta_n=0`, the scalar part is rank one.  Its positive
graph is connected under the eventual alternating sign pattern, but its
minimum-norm routing has operator norm exactly one, not strictly less than
one.  A second smooth synthetic family retains the actual anchor
coordinates, `Psi(L)>0`, `J_L=0`, and a connected positive graph while
forcing `d_1<0` and `||B_+^dagger*B_-||_op^2>Q` for any prescribed `Q`.
Under RH, each fixed mode satisfies `A_n-g=O_n(L^(-1))`; this does not
control the moving full-tail terms through `N=ceil(lambda)`.

Finally, allow an arbitrary real inversion-symmetric source-Cauchy
perturbation `H`.  The linear equation making a nonzero even anchor `kappa`
an eigenvector is always solvable.  Making it a simple lowest eigenvector is
equivalent to the exact homogeneous SDP

`K in S_N`, `K*kappa=0`, `K>=P_(kappa^perp)`.

The positive annihilating face is generated by selector rays at the
distinct real projective roots of the homogeneous raw anchor polynomial.
If there are `r` such roots, the maximal rank in that face is exactly `r`.
Thus a simple ground is feasible if and only if the degree-`N` anchor
polynomial has `N` distinct real projective roots.  Full source-Cauchy
forcing therefore restates the strict real-root target rather than proving
it.  If the original commutator is preserved, the perturbation displacement
must vanish, so the freedom collapses back to raw diagonal forcing and the
earlier signed-Laplacian gate.  The fixed `N=2` direction `(1,-1,1)` has
polynomial `y^2+y+4` and only the zero positive annihilator.

No actual-source vertex-1 sign, all-vertex sign, positive connectivity,
contractive routing, strict real-projective-root theorem, cofinal collar
equality, global finite strip exclusion, `DIRECT_RH_ATTACK.md` equation
(5.2), RH conclusion, or Lambda bound is proved.  All source conventions
and historical source locks remain unchanged, and the formal state remains
`P0_INVALIDATED`.

The three checkpoint-0.81 modules pass `28/28` exact standard-library
tests.  Together, the twenty-three checkpoint-0.71/0.72/0.73/0.74/0.75/
0.76/0.77/0.78/0.79/0.80/0.81 frontier modules pass `204/204`.  Current
discovery contains `1726` tests.  The last complete repository suite remains
checkpoint 0.70 at `1522/1522`; a complete `1726`-test recount is pending.

## Checkpoint 0.82: zero-Gram and adaptive-hyperbolicity barriers

Checkpoint 0.82 is source-locked and theorem-only.  It creates no source
lock or numerical artifact.  The unconditional centered-zero expansion and
the RH-conditional fixed-vertex theorem are in
`notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md`; the fixed-
`lambda` Fourier-section limit and one-way Laguerre--Polya obstruction are in
`notes/ADAPTIVE_OUTER_CUTOFF_HYPERBOLICITY_BARRIER.md`; the moving-frequency
phase kernel is in `notes/MOVING_TAIL_PHASE_WEIGHTED_XI_GRAM_BARRIER.md`; the
exact infinite nonhyperbolic indicator subsequence is in
`notes/LP_FOURIER_CARDINAL_INFINITE_NONHYPERBOLIC_SUBSEQUENCE.md`; and the
finite transverse-frame criterion is in
`notes/FINITE_GRAM_DEFECT_TRANSVERSE_FRAME_BARRIER.md`.  Their regressions
are the five correspondingly named `tests/test_*.py` modules.

For the centered completed function `X(q)=xi_R(1/2+q)`, the paired zero set
gives unconditionally

`Psi(T)=sum_(alpha in Z_+) 2*(cosh(alpha*T)-1)/alpha^2`

and an exact formula for every cosine-moment difference `A_n-g`.  On RH,
those moments form a positive zero-evaluation Gram matrix `G` and the full
anchored Laplacian is exactly

`L_w=G-diag(G*1)`.

The row-sum defect is the weighted sampling residual of the finite projected
anchor at the `Xi` zeros.  On the RH branch of the checkpoint-0.80 favorable
strict-half-integer subsequence, every separately fixed set of degrees
`d_0,...,d_K` is eventually positive and `d_k/d_0 -> 4` for fixed `k>0`.
This is not unconditional: the non-RH analogue is proved only under an
unknown isolated-rightmost-zero-line hypothesis.  The scalar Landau
selection does not control the vector of history moments, and every fixed
principal-block leading limit is rank one, leaving higher minors unresolved.

For fixed `lambda`, the Fourier-cardinal quotients converge locally uniformly
off the squared lattice to the meromorphic quotient of the full compact-
support transform.  If a cofinal sequence of raw numerator polynomials has
all projective roots real, then the square-variable full transform is in the
Laguerre--Polya class.  This necessary condition is not a converse.  For the
even indicator of `[-pi/2,pi/2]` in `[-pi,pi]`, the square-variable transform
is Laguerre--Polya, yet its prescribed numerator is nonhyperbolic for every

`N=4*r-1` or `N=4*r`, `r>=1`.

The proof uses an exact negative reciprocal-square Newton sum after removing
the forced real lattice factors.  It does not classify the complementary
sections and therefore does not exclude a specially chosen good cofinal
subsequence or prove anything analogous for the actual prolate anchor.

On the physical moving-frequency scale, the actual projected anchor has the
uniform compact profile

`sqrt(L)*p_n ~ rho_n*(-1)^n*Xi(2*pi*n/L)/2`.

Under RH, the staggered Gram part has an exact positive kernel weighted by
the phases `1-cos(gamma*L)`.  Those phases have no sharp `L->infinity` limit;
the Xi Christoffel--Darboux kernel is only their Cesaro phase average, and
its positivity has RH/Laguerre--Polya strength.  The full finite Laplacian
still subtracts the unresolved row-sum diagonal, including the moving tail
and its projective-infinity endpoint trace.

Finally, for any finite positive Gram matrix `G=V*V^T`, positivity of
`G-diag(G*1)` is equivalent to an exact deflated transverse second-frame and
orientation inequality on `1^perp`.  Exact zero sampling closes the defect,
but small absolute sampling residual does not.  A full-rank three-vertex
family has arbitrarily small residual, positive degrees, and connected
positive edges while its row-sum-corrected Laplacian remains indefinite.
Thus the actual source still needs a relative transverse-frame/orientation
theorem, not only a small Gevrey sampling estimate.

No unconditional simultaneous fixed-vertex selection, actual-source
transverse-frame gate, sharp moving-tail operator limit, positive
connectivity, contractive routing, eventual or cofinal actual-source
hyperbolicity, cofinal collar equality, global finite strip exclusion,
`DIRECT_RH_ATTACK.md` equation (5.2), RH conclusion, or Lambda bound is
proved.  All source conventions and historical locks remain unchanged, and
the formal state remains `P0_INVALIDATED`.

The five checkpoint-0.82 modules pass `38/38` exact standard-library tests.
Together, the twenty-eight checkpoint-0.71/0.72/0.73/0.74/0.75/0.76/0.77/
0.78/0.79/0.80/0.81/0.82 frontier modules pass `242/242`.  Current discovery
contains `1764` tests.  The last complete repository suite remains checkpoint
0.70 at `1522/1522`; a complete `1764`-test recount is pending.

## Checkpoint 0.83: attained-edge, deflated-frame, and all-sections barriers

Checkpoint 0.83 is source-locked and theorem-only.  It creates no source lock
or numerical artifact.  The gap-free attained-edge theorem is in
`notes/ATTAINED_RIGHT_EDGE_VECTOR_SELECTION_THEOREM.md`; the exact actual-zero
application of the finite deflated-frame formulas, conditional on RH, is in
`notes/ACTUAL_ZERO_FEATURE_DEFLATED_FRAME_BARRIER.md`; and the completed LP
indicator counterfamily is in
`notes/LP_FOURIER_CARDINAL_ALL_SECTIONS_NONHYPERBOLIC.md`.  Their regressions
are the three correspondingly named `tests/test_*.py` modules.

Let `B=sup Re(alpha)` over the centered zeros in the right half strip.  If RH
is false and this positive edge is attained, absolute Hadamard summability and
dominated convergence give the gap-free asymptotic

`exp(-B*T)*Psi(T)=H_B(T)+o(1)`,

even when lower zero lines accumulate at `B`.  The nonzero uniformly almost-
periodic edge sum `H_B`, grid transfer, and exact history moments then give an
unbounded strict-half-integer sequence on which every fixed prefix
`d_0,...,d_K` is positive and `d_k/d_0 -> 4` for `1<=k<=K`.  Thus an isolated
rightmost line is unnecessary once the edge is attained.  If the edge is not
attained, the extra inverse ordinate gives the exact absolute escape
`A_3/A_2 -> 0`, but the needed signed peak comparison is still open.  Exact
Fejer blocks show that the generic strip, count, conjugation, and Hadamard-
coefficient rules alone do not provide a uniform signed-to-RMS peak theorem.

On the RH branch, the complete positive zero-feature matrix has rows

`T_(gamma,n)=r_gamma*p_n/(a_n^2-gamma^2)`.

Every `N`-row transverse minor has an exact rectangular Cauchy formula with
one explicit anchor-orientation factor `Theta_Gamma`, and Cauchy--Binet sums
their squares to the complete transverse determinant.  Selecting `N+1` rows
gives the residual-deflated column-volume bound

`eta_Lambda^2*det(B_Lambda^T*B_Lambda)>=d*|det(T_Lambda)|^2`.

These determinant identities are finite algebra for arbitrary real ordinate
sets.  Their application to the actual zeta-zero feature rows is conditional
on RH.

At a fully nonresonant length, infinitely many distinct zero rows yield the
sharp qualitative kernel: the transverse Gram is positive definite exactly
when at most one displayed anchor coordinate vanishes.  This proves existence
of some finite spanning row set, not a quantitative relative floor.  Strict
row-sum-corrected graph positivity still requires every coordinate nonzero,
and the admitted count, phase averaging, and small Gevrey sampling residual do
not control `Theta_Gamma`, the anchor product, or the deflated second singular
value at the needed scale.

Finally, the LP indicator obstruction now covers every section.  For an odd
number `M>=3` of retained odd modes, exact beta-tail cancellation and rational
tail bounds give the reciprocal-root Hankel determinant

`H_M=S_2*S_4-S_3^2 < -13/(4000*(2*M+1)^6) < 0`.

Together with the frozen even-`M` theorem, this proves that the prescribed
Fourier-cardinal numerator is nonhyperbolic for every `N>=3`.  The result
eliminates the good-cofinal loophole for this explicit compact-support
Laguerre--Polya fixture only.  It neither classifies nor proves eventual
hyperbolicity for the actual projected prolate anchors.

No unconditional solution of the nonattained-edge vector problem, actual-
source relative transverse-frame floor, positive connectivity, contractive
routing, eventual or cofinal actual-source hyperbolicity, cofinal collar
equality, global finite strip exclusion, `DIRECT_RH_ATTACK.md` equation (5.2),
RH conclusion, or Lambda bound is proved.  All source conventions and
historical locks remain unchanged, and the formal state remains
`P0_INVALIDATED`.

The three checkpoint-0.83 modules pass `28/28` exact standard-library tests.
Together, the thirty-one checkpoint-0.71/0.72/0.73/0.74/0.75/0.76/0.77/
0.78/0.79/0.80/0.81/0.82/0.83 frontier modules pass `270/270`.  Current
discovery contains `1792` tests.  The last complete repository suite remains
checkpoint 0.70 at `1522/1522`; a complete `1792`-test recount is pending.

## Checkpoint 0.84: filtered Landau and fourth-moment barriers

Checkpoint 0.84 is source-locked and theorem-only.  It creates no source lock
or numerical artifact.  Its six modules are
`notes/PRIME_SIDE_SIGNED_RIESZ_HISTORY_BARRIER.md`,
`notes/GLOBAL_RMS_COUNTERCONFIGURATION_AND_A3_FEJER_BOUNDARY.md`,
`notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md`,
`notes/GLOBAL_FOURTH_MOMENT_DIAGONAL_COUNTERCONFIGURATION.md`,
`notes/NONATTAINED_HIGH_EDGE_RECORD_FILTER_THEOREM.md`, and
`notes/INDIVIDUAL_FILTERED_DEGREE_LANDAU_THEOREM.md`, with the six
correspondingly named `tests/test_*.py` regressions.

The complete pole--archimedean--minus-prime history has an exact signed Riesz
form.  Natural-cutoff localization gives

`||S_(k,L)''||_1=O_k(L^(-3/2))`,

so the cancellation-free nonattained-edge condition improves to

`A_3(L)+1=o(L*Psi(L))`.

This remains only a sufficient comparison.  A positive synthetic Chebyshev
measure with PNT-size mass, positive prime-like jumps, and strong short-
interval mass has nonvanishing normalized history at every fixed vertex.
It is not the von Mangoldt measure and does not model the zeta zeros.  A
separate centered-zero counterconfiguration defeats a generic RMS implication
at scale `Q_2/(L*Psi)`, but its `A_3` is much smaller; the ordered
commensurate Fejer mechanism is proved unable to defeat the sharper `A_3/L`
scale.

At actual centered zeros, the exact finite-anchor rational factor and the
Gevrey projection remainder give, for fixed `b>0`,

`|M_k^(>=b)(L)| <= C_(k,b)*|p_k|*L^(-2)*A_(4,b)(L)+O(exp(-d_b*L^2))`.

The complementary low edge is negligible on a strengthened strict-grid
Landau sequence.  Hence `A_(4,b)=o(L^2*Psi)` on that same sequence would give
simultaneous positivity of every fixed degree prefix and ratios tending to
four.  It is not proved for the actual zeros.  Indeed, a simple-zero
Gaussian-packet multiset with reflection/conjugation symmetry, inverse-square
summability, Riemann--von Mangoldt count magnitude, and local `O(log H)` count
satisfies the reverse inequality globally while retaining strict-grid scalar
Landau peaks.  This is an order-level synthetic no-go, not the zeta-zero set
and not a realization of a sharp numerical HSW bound.

Keeping the two explicit history terms signed reveals the exact fourth-order
filter

`Phi_(k,L)=(I-q*T_q)^2`,  `q=(2*pi*k/L)^2`,

with zero multiplier `alpha^4/(alpha^2+q)^2`.  Its causal correction kernel
changes sign.  For the actual centered-zero screw, however, inverse-square
summability gives the exact envelope `|Psi(t)|<=C_Z*exp(B*t)`.  If the
positive edge is not attained, then for every fixed `K` one may choose
`B*theta_K<eta<B`; record-time negative-lobe separation gives one strict-grid
sequence on which `d_0,...,d_K` are eventually positive for every `B>0`.
No `A_4` comparison is needed.

Diagonal extraction gives some sequence and some unquantified `K_j->infinity`
with `d_k(L_j)>0` for `0<=k<=K_j`.  Checkpoint 0.83 supplies the same fixed-
prefix input when the positive edge is attained, so every RH-false right-edge
case has such an existential growing positive-degree prefix.  There is no
rate for `K_j`, no comparison between `K_j` and the natural outer dimension
`N(L_j)`, no positivity theorem for all vertices in a finite section, and no
degree-ratio, Laplacian-PSD, connectivity, or routing conclusion.

Independently, for every `0<B<=1/2`, direct filtered Landau continuation
proves that each fixed `k>=1` has its own strict-grid sequence with `d_k>0`.
The divided higher-screw terms soften zero poles to bounded logarithmic
branches, while the undivided pole survives.  This scalar proof by itself
gives no sign for `Psi` or `d_0` on the same sequence and does not synchronize
different vertices; the record theorem supplies the stronger fixed-prefix
conclusion.

No controlled growing-prefix rate, full natural-cutoff positive section,
Laplacian positivity, global finite strip exclusion, positive routing theorem,
`DIRECT_RH_ATTACK.md` equation (5.2), RH conclusion, Lambda bound, new source
lock, numerical artifact, or locally uniform actual-ground-transform theorem
follows.  All historical locks and source conventions remain unchanged, and
the formal state remains `P0_INVALIDATED`.

The six checkpoint-0.84 modules pass `61/61` exact standard-library tests.
Together, the thirty-seven checkpoint-0.71 through checkpoint-0.84 frontier
modules pass `331/331`.  Current discovery contains `1853` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`1853`-test recount is pending.

## Checkpoint 0.85: Laplacian covariance and edge synchronization

Checkpoint 0.85 is source-locked and theorem-only.  It creates no source lock
or numerical artifact.  Its six modules are
`notes/GROWING_POSITIVE_DEGREE_PREFIX_LAPLACIAN_NO_GO.md`,
`notes/FIRST_LAPLACIAN_MINOR_TURAN_BARRIER.md`,
`notes/FIXED_PREFIX_LAPLACIAN_COVARIANCE_SCHUR_BARRIER.md`,
`notes/UNIQUE_ATTAINED_EDGE_FIRST_MINOR_OBSTRUCTION.md`,
`notes/FIXED_PREFIX_EDGE_SIGN_SYNCHRONIZATION.md`, and
`notes/FINITE_ATTAINED_EDGE_ANTIPODAL_TURAN_OBSTRUCTION.md`, with the six
correspondingly named `tests/test_*.py` regressions.

Positive degrees are only one-by-one principal-minor conditions.  Two exact
synthetic source-Cauchy fixtures show the missing matrix content.  One has all
degrees positive but a disconnected positive-edge graph.  An all-odd-size
family has every degree positive, a connected positive graph, the admitted
fixed-mode prolate direction on every fixed index, and arbitrarily small
absolute displacement, yet

`det L_w[{0,1}]=-(2/3)*epsilon*(q+epsilon)<0`.

Its routing norm is strictly larger than one.  Even as
`d_1/d_0 -> 4` and `w_(01)/d_0 -> 2`, the subleading first minor has the wrong
sign.  These fixtures are not the actual zeta source; they invalidate only
the proposed generic implications from positive degrees, connectivity,
fixed-mode limits, or absolute displacement smallness to Laplacian positivity
and routing contraction.

For the actual nonattained right-edge record sequence, the first edge is
positive, but the exact normalized first minor is

`(Psi+rho_0)*(Y+rho_1)-U^2`,

whose zero-side main term is the signed Turan covariance

`q^2*{Psi*(T_q^2 Psi)-(T_q Psi)^2}`.

The complete prime, Gaussian, low-edge, and finite-anchor residual is
`o(q^2*P_n^2)`.  A positive same-sequence covariance margin would therefore
be sufficient, but no such margin is proved.  Under RH the expression is a
nonnegative weighted variance, but that is an RH-conditional sign and gives
no strict residual-dominating margin in the RH-false branch.

The complete fixed-prefix calculation makes the higher gate equally exact.
After eliminating vertex `0`, the anchored block is diagonally congruent to

`Q*Sigma/Psi*Q + diag(rho_i)
 + rho_0*U*U^T/{Psi*(Psi+rho_0)}`,

where

`Sigma_(ij)=Psi*(T_i*T_j Psi)-(T_i Psi)*(T_j Psi)`.

On the nonattained record extraction the last two terms are
`o_K(L^(-4)*Psi)` entrywise.  Thus the first unresolved actual-source matrix
object is a signed resolvent covariance/Hankel hierarchy, not another scalar
degree.  RH makes `Sigma` positive semidefinite only conditionally, while one
off-axis conjugate pair contributes a negative-semidefinite rank-one sector.
Neither observation signs the complete RH-false covariance or supplies its
least-eigenvalue margin.

There is nevertheless an actual-source connectivity advance in the
nonattained branch.  On the same fixed-prefix record sequence every cross
filter satisfies

`Z_(ij)=(F_i*F_j Psi)(L_n)>0`,  `0<=i,j<=K`,

and the exact divided difference is `D_(ij)=-Z_(ij)`.  Since the fixed-mode
coordinate signs alternate, the fixed-prefix edge signs obey

`w_(ij)>0` exactly when `i+j` is odd.

Hence the positive graph on every fixed prefix is complete bipartite and
connected.  Diagonal extraction gives an unquantified growing connected
prefix.  It gives no prefix growth rate, comparison with `N(L)`, all-vertex
statement for a natural finite section, positive reduced Laplacian, or bound
on the same-parity negative-edge effective-resistance load.

The attained-edge packages give narrow conditional obstructions, not a
general attained-edge theorem.  If the actual attained right edge consists
of one conjugate orbit, there is an unbounded strict natural-grid sequence
with `d_0,d_1,w_(01)>0` but `d_0*d_1-w_(01)^2<0`.  More generally, the same
conclusion holds when the attained edge is a finite union of conjugate orbits
whose frequency hull contains the global antipode `(-1,...,-1)`.  Equivalently,
every integer relation among the edge ordinates has even coefficient sum;
rational independence is sufficient.  No gap below the edge is required.
These are conditional results for the locked actual zeta source, but the
edge hypotheses are not known to occur.  A finite phase-locked edge without
the antipode and a countably infinite attained edge remain open, so no claim
is made for an arbitrary finite attained edge.

No controlled growing-prefix rate, full natural-cutoff positive section,
all-vertex Laplacian positivity, routing contraction, global finite strip
exclusion, `DIRECT_RH_ATTACK.md` equation (5.2), RH conclusion, Lambda bound,
new source lock, numerical artifact, or locally uniform actual-ground-
transform theorem follows.  All historical locks and source conventions
remain unchanged, and the formal state remains `P0_INVALIDATED`.

The six checkpoint-0.85 modules pass `61/61` exact standard-library tests.
Together, the forty-three checkpoint-0.71 through checkpoint-0.85 frontier
modules pass `392/392`.  Current discovery contains `1914` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`1914`-test recount is pending.

## Checkpoint 0.86: Countable-edge nonflatness and finite phase synchronization

Checkpoint 0.86 is source-locked and theorem-only.  It creates no source lock
or numerical artifact.  Its two modules are
`notes/COUNTABLE_ATTAINED_EDGE_ANTIPODAL_NONFLATNESS_THEOREM.md` and
`notes/FINITE_EDGE_PHASE_SYNCHRONIZATION_CRITERIA.md`, with the two
correspondingly named `tests/test_*.py` regressions.

For a countably attained right edge with multiplicities `r_j`, put
`b_j=(B+i*gamma_j)^(-2)` and assume `sum_j r_j*|b_j|<infinity`.  The leading
edge functions `P,V,W` and `C=P*W-V^2` then converge uniformly on the
countable frequency hull.  Truncation and Haar orthogonality give the exact
strictly negative mean

`int_K C=-4*sum_j r_j^2*|b_j|^2*(Im b_j)^2<0`.

Negative mean alone does not synchronize the sign of `P`.  A sufficient
structural hypothesis is that the global antipode belongs to the hull and
the zero set of `P` has empty interior in that hull.  Joint rational
independence of all edge ordinates proves both conditions by identifying the
hull with the full countable torus.  Independently, a finite head can certify
`P!=0,C<0` whenever its margins dominate the explicit coefficient tails;
the same global antipode then selects `P>0`.  Positive-semiorbit recurrence
and a finite-head/tail argument transfer the strict phase to the natural grid
without a frequency-moment assumption.  The checkpoint-0.84 residual then
conditionally gives an unbounded actual-source sequence with
`d_0,d_1,w_(01)>0` and `d_0*d_1-w_(01)^2<0`.

This is not an arbitrary countable-edge theorem.  Bare `l1` summability does
not prove nonflatness on a dependent hull, and a locally flat countable edge
is not excluded.  The actual zeta edge is not proved to be countably
attained, jointly rationally independent, antipodal, nonflat, or certified by
the finite-tail margin.

For a finite edge, the global antipode is sufficient but not necessary.
Three exact alternatives force a phase with `P>0` and `C<0`: boundary
transversality `P=0,V!=0`; strict domination of all cross coefficients by
the negative self-pair term; and a squarefree Laurent polynomial whose
regular torus sign boundary is Zariski dense in its complex hypersurface.
An exact `B=1`, two-frequency abstract fixture violates the antipode parity
condition and is nevertheless favorable.  That fixture is not an actual
zeta edge.  The universal finite phase-locked case, including the exceptional
geometry in which every sign-changing boundary zero of `P` is shared by
`V`, remains open.

No arbitrary finite- or countable-edge obstruction, full natural-cutoff
positive section, all-vertex Laplacian positivity, routing contraction,
global finite strip exclusion, `DIRECT_RH_ATTACK.md` equation (5.2), RH
conclusion, Lambda bound, new source lock, numerical artifact, or locally
uniform actual-ground-transform theorem follows.  All historical locks and
source conventions remain unchanged, and the formal state remains
`P0_INVALIDATED`.

The two checkpoint-0.86 modules pass `23/23` exact standard-library tests.
Together, the forty-five checkpoint-0.71 through checkpoint-0.86 frontier
modules pass `415/415`.  Current discovery contains `1937` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`1937`-test recount is pending.

## Checkpoint 0.87: Two-frequency phase transversality

Checkpoint 0.87 is source-locked and theorem-only.  It creates no source lock
or numerical artifact.  Its single module is
`notes/TWO_FREQUENCY_PHASE_TRANSVERSALITY_THEOREM.md`, with exact regression
`tests/test_two_frequency_phase_transversality_theorem.py`.

Fix commensurable frequencies `p*omega<q*omega`, an edge displacement `B>0`,
and positive orbit weights.  The determinant for a common zero of the leading
signals `P` and `V` is a nonzero trigonometric polynomial of degree `p+q`.
Consequently the positive common-zero candidate set `E_(p,q)(B,omega)` is
finite with cardinality at most `2*(p+q)`.  Every weight ratio outside this
set has a sign-changing boundary zero with `P=0,V!=0`, and therefore a nearby
phase with

`P>0,  C=P*W-V^2<0`.

The candidate set is not the failure set: failure can occur only inside `E`.
For the primitive `1:2` hull, an exact self-inversive-quartic quotient argument
proves that the failure set is empty for every `B,omega,r_1,r_2>0`, while the
common-zero candidate set is nonempty for some parameters.  No global hull
antipode is required.  If the actual zeta
right edge were separately proved to be finite and to consist of exactly two
conjugate orbits with ordinates in this `1:2` geometry, the frozen recurrence,
strict-grid transfer, and checkpoint-0.84 residual would conditionally give
`d_0,d_1,w_(01)>0` with `d_0*d_1-w_(01)^2<0` along an unbounded natural-grid
sequence.  No such actual edge geometry is proved here.

For other mixed-parity primitive `p:q` pairs, which ratios in `E` actually
fail, if any, remains unknown.  Finite phase-locked edges with three or more
orbits, arbitrary finite or countable attained edges, full natural-
cutoff positive sections, all-vertex Laplacian positivity, routing
contraction, global finite strip exclusion, `DIRECT_RH_ATTACK.md` equation
(5.2), RH, and every Lambda bound remain open.  All historical locks and
source conventions remain unchanged, and the formal state remains
`P0_INVALIDATED`.

The checkpoint-0.87 module passes `10/10` exact standard-library tests.
Together, the forty-six checkpoint-0.71 through checkpoint-0.87 frontier
modules pass `425/425`.  Current discovery contains `1947` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`1947`-test recount is pending.

## Checkpoint 0.88: Short-gap and resultant transversality

Checkpoint 0.88 is source-locked and theorem-only.  It creates no source lock
or numerical artifact.  Its two modules are
`notes/SHORT_GAP_TWO_FREQUENCY_PHASE_THEOREM.md` and
`notes/GENERIC_FINITE_PHASE_TRANSVERSALITY_RESULTANT.md`, with their two
correspondingly named `tests/test_*.py` exact regressions.

For two commensurable frequencies `p*omega<q*omega`, a denominator-free
Bezout remainder bounds the number of distinct common roots of `P` and `V`
by `2*(q-p)`.  A distinct-sign Sturm--Hurwitz argument independently forces
at least `2*p` distinct sign-changing zeros of `P`.  Since failure makes
every sign boundary common, the two counts are incompatible when `q<2*p`.
Combining this strict short-gap theorem with the frozen primitive `1:2`
boundary case after gcd reduction proves a favorable phase

`P>0,  C=P*W-V^2<0`

for every positive weight ratio whenever `q<=2*p`.  This includes the
primitive nonantipodal `2:3` hull.  It does not classify the long-gap range;
in particular, the finite `1:4` elimination remains open.

For any fixed finite one-dimensional commensurable support, the Sylvester
resultant of the polynomial lifts of `P` and `V` is a nonzero polynomial in
the positive weights.  Every failure vector lies in its proper real-
algebraic zero set.  Thus favorable weights contain an open dense full-
measure subset of the positive orthant.  This is generic, not universal:
the exceptional resultant set can be nonempty, its points are not proved to
fail or to be favorable, and prescribed positive integer multiplicities are
not settled.  Exact three-frequency fixtures are favorable and diagnostics
found no actual failure, but neither observation excludes an exceptional
failure for `m>=3`.

Actual-source use is conditional on a separately proved finite attained zeta
right edge with the stated commensurable geometry.  No such geometry, no
arbitrary finite or countable attained-edge obstruction, full natural-cutoff
positive section, all-vertex Laplacian positivity, routing contraction,
global finite strip exclusion, `DIRECT_RH_ATTACK.md` equation (5.2), RH, or
Lambda bound is proved.  All historical locks remain unchanged, and the
formal state remains `P0_INVALIDATED`.

The two checkpoint-0.88 modules pass `23/23` exact standard-library tests.
Together, the forty-eight checkpoint-0.71 through checkpoint-0.88 frontier
modules pass `448/448`.  Current discovery contains `1970` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`1970`-test recount is pending.

## Checkpoint 0.89: Common-root lift and `1:4` transversality

Checkpoint 0.89 is source-locked and theorem-only.  It creates no source lock
or numerical artifact.  Its two modules are
`notes/COMMON_ROOT_LIFT_BOUND_TWO_FREQUENCY_THEOREM.md` and
`notes/ONE_FOUR_PHASE_TRANSVERSALITY_THEOREM.md`, with their two
correspondingly named `tests/test_*.py` exact regressions.

For a primitive two-frequency hull `p:q`, the exact common-root lift analysis
improves the global budget to

`2*gcd(q-p,2*p)`

distinct common phase roots of `P` and `V`.  The proof includes the degenerate
lift branch and uses no false modulus exclusion.  If `p` and `q` have opposite
parity and `p>=2`, this budget is at most two, while the distinct-sign
Sturm--Hurwitz theorem gives at least `2*p` sign-changing roots of `P`; hence a
boundary-transverse, favorable phase exists for every positive weight ratio.
If a primitive pair has the same parity, both frequencies are odd and the
frozen hull antipode synchronizes a negative-covariance phase.  Thus every
primitive pair with `p>=2` is favorable, leaving only `p=1` with even `q` in
the two-frequency family.

The second package closes the primitive `1:4` case for every
`B,omega,r_1,r_4>0`.  Its exact certificate reduces common roots to a
quadratic lift-divisibility condition and checks the resulting branches using
bounded 150-prime CRT reconstruction, exact Sylvester resultants,
characteristic-zero division and gcds, Sturm isolators, exact phase signs,
and explicit repeated-root and multiplier-degenerate handling.  The common
root budget is at most two, whereas every surviving branch has an additional
sign-changing boundary, so some phase has

`P>0,  C=P*W-V^2<0`.

Together with the frozen primitive `1:2` theorem, only primitive `1:q` with
even `q>=6` remains unresolved among two-frequency hulls.  This does not solve
exceptional finite supports with three or more orbits.  Actual-source use is
conditional on separately proving a finite attained zeta right edge with the
stated exact two-orbit geometry; no such geometry is proved here.  No
arbitrary finite or countable attained-edge obstruction, full natural-cutoff
positive section, all-vertex Laplacian positivity, routing contraction,
global finite strip exclusion, `DIRECT_RH_ATTACK.md` equation (5.2), RH, or
Lambda bound follows.  All historical locks remain unchanged, and the formal
state remains `P0_INVALIDATED`.

The two checkpoint-0.89 modules pass `17/17` exact standard-library tests.
Together, the fifty checkpoint-0.71 through checkpoint-0.89 frontier modules
pass `465/465`.  Current discovery contains `1987` tests.  The last complete
repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`1987`-test recount is pending.

## Checkpoint 0.90: Universal two-orbit phase synchronization

Checkpoint 0.90 is source-locked and theorem-only.  It creates no source lock
or numerical artifact.  Its single module is
`notes/ONE_EVEN_FAMILY_PHASE_SYNCHRONIZATION_THEOREM.md`, with exact regression
`tests/test_one_even_family_phase_synchronization_theorem.py`.

The new theorem closes the final primitive commensurable family left by
checkpoint 0.89.  For every even `q>=4` and every
`B,omega,r_1,r_q>0`, a contradiction argument starting from exactly two
shared sign boundaries centers the roots and derives the real-linear pencil

`c*D*A=D*(a*A)`.

Its determinant gives a positive reciprocal parameter `h` with

`h+1/h=q+1/q+((q^2-1)^2/(4*q))*x^2`.

The branch `0<h<1` contradicts the signs at antipodal boundary midpoints.  On
`h>1`, cyclic variation diminution for `(I+x*d/dt)^(-1)`, shared-root
multiplicity, and a convexity argument force `P` and `V` to have opposite
nodal orientations.  That is impossible for `x<=1`; for `x>1`, the pencil
forces strict high-harmonic dominance and therefore at least `2*q` sign
boundaries, again contradicting the exact-two consequence of failure.  Hence
some phase has

`P>0,  C=P*W-V^2<0`.

The theorem completes the exact two-frequency hierarchy.  For rationally
related frequencies, primitive reduction combines the new even `1:q` result
with the frozen `1:2`, common-root, and odd-antipode theorems.  For an
irrational ratio, the two-dimensional hull contains the global antipode.
Thus every abstract two-orbit hull is favorable for all positive weights.

Consequently, if the actual zeta right edge were separately proved to be
attained and to consist of exactly two conjugate orbits, then for any
frequency ratio the frozen recurrence, strict-grid transfer, and
checkpoint-0.84 residual would conditionally give an unbounded sequence with
`d_0,d_1,w_(01)>0` and `d_0*d_1-w_(01)^2<0`.  No such actual edge geometry is
proved here.  Phase-locked supports with at least three orbits, arbitrary
finite and countable attained edges, full natural-cutoff positive sections,
all-vertex Laplacian positivity, routing contraction, global finite strip
exclusion, `DIRECT_RH_ATTACK.md` equation (5.2), RH, and every Lambda bound
remain unresolved.  All historical locks remain unchanged, and the formal
state remains `P0_INVALIDATED`.

The checkpoint-0.90 module passes `14/14` exact standard-library tests.
Together, the fifty-one checkpoint-0.71 through checkpoint-0.90 frontier
modules pass `479/479`.  Current discovery contains `2001` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`2001`-test recount is pending.

## Checkpoint 0.91: Low forcing and full-metric barriers

Checkpoint 0.91 is source-locked and theorem-only.  It creates no source lock
or numerical artifact.  Its three modules are
`notes/ADAPTIVE_ALL_EVEN_PREFIX_BRIDGE_OBSTRUCTION.md`,
`notes/ANISOTROPIC_SCHUR_IDENTICAL_MARGINALS_NO_GO.md`, and
`notes/LOW_BLOCK_FORCING_RATE_FULL_METRIC_BARRIER.md`, with their three
correspondingly named `tests/test_*.py` exact regressions.

For every fixed finite Fourier cutoff, the all-even coframe theorem supplies
a finite source prefix spanning the prescribed physical spaces in both
parities.  The construction can be chosen pointwise on any preselected
countable sequence, so the physical high complements vanish at those finite
points.  This is not an effective schedule theorem: it gives no bound on the
last source label and no comparison with the transition window.  More
importantly, zero physical high complement only returns the original signed
low matrix.  The exact source-coordinate identity

`T^2=b_s^*L_s^(-1) G L_s^(-1)b_s`

rewrites the shifted action but does not bound it.  An exact model has full
source span, both strict sector comparisons, and `T=1` for every value of the
external parameter.

The anisotropic-Schur package isolates the missing coupling information.
Two positive semidefinite `2 x 2` negative blocks have identical
`R_KK=R_HH=V_H=rho=3/5<g`, identical low and high diagonal reserves, and yet
anisotropic Schur values `2/5` and `-1/2`.  Thus diagonal leverage, trace,
norm, and reserve data cannot decide condition (7.8); the actual low--high
coupling or an equivalent residualized signed factorization is indispensable.

There is nevertheless one positive rate conclusion.  On the declared
label-8/rest physical low range, the locked sampling and defect estimates
give the unconditional positive-sampling forcing factor

`||Delta_L^(-1)c_L|| = o(lambda^(-1/2) P(lambda)^(1/2))`

for one fixed positive polylogarithmic factor `P`.  A signed inverse-action
bound at the same scale follows only conditionally on a uniform reserve
`||Delta_L^(-1)(B_L-Delta_L)||<=rho_0<1`; it represents a component of the
full inverse only when the declared range reduces the full signed operator.
Neither requirement is proved.  Exact rational families also show that the
full exterior quotient is not determined by its two diagonal source-Gram
blocks and that fixed positive low/high compression floors do not control a
signed inverse action when the coupling is unknown.

Therefore checkpoint 0.91 reaches the target scale only for the positive-
sampling forcing factor.  It proves no actual shifted action, signed sector
floor, full-metric comparison, or `DIRECT_RH_ATTACK.md` equation (5.2).
Locally uniform determinant convergence, RH, every Lambda bound, full
natural-section Laplacian positivity, and routing remain unproved.  All
historical locks remain unchanged, and the formal state remains
`P0_INVALIDATED`.

The three checkpoint-0.91 modules pass `31/31` exact standard-library tests.
Together, the fifty-four checkpoint-0.71 through checkpoint-0.91 frontier
modules pass `510/510`.  Current discovery contains `2032` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`2032`-test recount is pending.

## Checkpoint 0.92: Signed-kernel and action-transfer barriers

Checkpoint 0.92 is source-locked and theorem-only.  It creates no source lock
or numerical artifact.  Its two modules are
`notes/TRANSPORTED_SIGNED_KERNEL_LEFT_RESERVE_BARRIER.md` and
`notes/ONE_SIDED_LOEWNER_ACTION_TRANSFER_BARRIER.md`, with their two
correspondingly named `tests/test_*.py` exact regressions.

The first package identifies the exact signed estimate missing after the
checkpoint-0.91 forcing theorem.  On the combined label-8/rest physical low
range,

`rho_L=||Delta_L^(-1)(B_L-Delta_L)||=||A E_L A^dagger||`,

where `E_L=A^*B_LA-P_0`.  This identity includes every diagonal and cross
entry and remains exact when the normalized synthesis `A` is noninjective.
The cancellation-preserving Chebyshev rewrite supplies the corresponding
complete signed correlation kernel.  Positive sampling controls a different,
positive Gram.  Moreover, endpoint cancellation together with the frozen P3
moment finiteness permits an arbitrary Hermitian entry in an exact formal
matrix-correlation construction.  This is a no-implication theorem for those
inputs alone, not a realization by actual prolate source states.

An exact positive `2 x 2` family sharpens the gap: its forcing vector tends to
zero and saturates the positive forcing inequality, while its signed inverse
action diverges.  Every member is invertible and has `rho_L<1`, but the
reserve `1-rho_L` tends to zero.  Thus pointwise signed invertibility cannot
replace the uniform transported reserve required by the conditional action
theorem.

The second package proves that a one-sided floor
`B>=mu*Delta>0` transfers action without loss only in the `Delta`-energy norm.
In the physical Euclidean norm the available estimate retains a conditioning
factor.  A quotient-compatible family has

`Delta<=B<=3*Delta`,

all relevant positive-sampling constants equal to one, and shrinking forcing
with constant or divergent action.  For `M>2+sqrt(3)`, no positive scalar
rescaling of `Delta` is Euclidean left-close, and scalar rescaling leaves the
dominating-action estimate invariant.  With the currently proved label-8/rest
constants, a uniform one-sided floor yields only

`||B_L^(-1)c_L||=o(mu_lambda^(-1)*lambda^(1/2)*P(lambda)^(1/2))`,

losing a full factor `lambda` relative to the forcing rate.  Closing the rate
therefore needs genuinely new signed orientation information: for example a
growing relative floor, commutation/reduction, a restricted
`B^(-1)Delta` bound on the sampling-generated range, or a carefully scoped
source-envelope comparison.  None is presently proved for the actual source.

Checkpoint 0.92 proves no actual residual action, uniform transported reserve,
signed sector floor, reducing property, full low/high comparison, or
`DIRECT_RH_ATTACK.md` equation (5.2).  Locally uniform determinant convergence,
RH, every Lambda bound, full natural-section Laplacian positivity, and routing
remain unproved.  All historical locks and artifacts remain unchanged, and
the formal state remains `P0_INVALIDATED`.

The two checkpoint-0.92 modules pass `26/26` exact standard-library tests.
Together, the fifty-six checkpoint-0.71 through checkpoint-0.92 frontier
modules pass `536/536`.  Current discovery contains `2058` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`2058`-test recount is pending.

## Checkpoint 0.93: Fixed label-eight arithmetic synthesis gain

Checkpoint 0.93 is source-locked and theorem-only.  It creates no source lock
or numerical artifact.  Its single module is
`notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md`, with exact regressions
in `tests/test_fixed_label_eight_arithmetic_synthesis_gain.py`.

The new package explicitly extends the moving-domain Hermite quasimode
argument to label 8.  It proves

`mu_8=-147/4`,
`u_8=(sqrt(105)/(16*pi))*h_4-(3*sqrt(330)/(32*pi))*h_12`,

with `L2` and point-value remainder `O(lambda^(-4))`, and derives

`rho_8=-sqrt(70)/16+(3*sqrt(70)/(64*pi))*lambda^(-2)
       +O(lambda^(-4))`.

The exact zero-integral label-4 and label-8 source combinations then transfer
through the arithmetic map on the locked odd-half-integer schedule with
`N=2^(2400*p^2)`.  Their projected physical columns converge in `L2`.  The
positive Mellin transforms satisfy

`Q_8(s)=(sqrt(105)/210)*(2*s^2-2*s+23)*Q_4(s)`,

so the two limiting arithmetic vectors are not collinear.  Consequently the
anchor-deflated label-8 column converges to a nonzero vector `W_infinity`.
Together with the exact fixed-index defect ratios, this proves

`D_8/d_8 -> 1`,
`d_8*M_8 -> ||W_infinity||^2 > 0`,
and `M_8=Theta(1/d_8)`.

The improved singleton scale sharpens the cross-aware positive action
constant and forcing factor to

`Gamma_L=O(lambda*P(lambda)/d_8)`,
`||Delta_L^(-1)c_L||=o(lambda^(-3/2)*P(lambda)^(1/2))`,

for one fixed enlarged positive polylogarithmic factor `P`.  The forcing
statement is unconditional.  A left-close signed action at the same improved
scale remains conditional on a uniform reserve.  Under only the separate,
still-unproved one-sided floor `B_L>=mu_lambda*Delta_L`, the dominating-action
theorem now gives

`||B_L^(-1)c_L||
 =o(mu_lambda^(-1)*lambda^(-1/2)*P(lambda)^(1/2))`.

Neither signed hypothesis is proved.  Even a conditional low-range action
still requires reduction or a full low/high Schur comparison before it
controls the full inverse.  Checkpoint 0.93 proves no uniform signed reserve,
one-sided floor, reducing property, physical high-complement comparison, odd
sector floor, or `DIRECT_RH_ATTACK.md` equation (5.2).  Locally uniform
determinant convergence, RH, every Lambda bound, full natural-section
Laplacian positivity, and routing remain unproved.  All historical locks and
artifacts remain unchanged, and the formal state remains `P0_INVALIDATED`.

The checkpoint-0.93 module passes `13/13` exact standard-library tests.
Together, the fifty-seven checkpoint-0.71 through checkpoint-0.93 frontier
modules pass `549/549`.  Current discovery contains `2071` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`2071`-test recount is pending.

## Checkpoint 0.94: Fixed label-six odd arithmetic synthesis gain

Checkpoint 0.94 is source-locked and theorem-only.  It creates no source lock
or numerical artifact.  Its single module is
`notes/FIXED_LABEL_SIX_ODD_ARITHMETIC_SYNTHESIS_GAIN.md`, with exact
regressions in
`tests/test_fixed_label_six_odd_arithmetic_synthesis_gain.py`.

Using the phase positive at the origin throughout the Hermite residue class
`n=2 mod 4`, the package proves the two moving-domain quasimodes

`mu_2=-15/4`,
`u_2=-(3*sqrt(10)/(32*pi))*h_6`,

`mu_6=-87/4`,
`u_6=(3*sqrt(10)/(32*pi))*h_2
     -(3*sqrt(35)/(16*pi))*h_10`,

with `L2` and point-value remainder `O(lambda^(-4))`.  The exact
zero-integral label-6 source has

`a_6=I_6/I_2=sqrt(10)/4-(3*sqrt(10)/(32*pi))*lambda^(-2)
     +O(lambda^(-4))`,

and its inversion-odd arithmetic column converges on the locked
odd-half-integer schedule with `N=2^(2400*p^2)`:

`p_6=K_6+lambda^(-2)*K_(6,1)+O_L2(lambda^(-3))`.

The exact Mellin and logarithmic-derivative identities are

`Q_6(s)=((2*s-1)/sqrt(30))*Q_4(s)`,
`K_6=-(2/sqrt(30))*K_4'`.

Thus `K_6` is nonzero and

`D_6/d_6 -> 1`,
`d_6*M_6 -> ||K_6||^2=(2/15)*||K_4'||^2 > 0`,
`M_6=Theta(1/d_6)`.

For the deliberately block-diagonal label-6/rest odd quotient, the remaining
targets have `M_R=O(lambda^(-3)/d_6)`.  Consequently

`d_6*||Delta_-^(-1)|| -> ||K_6||^2`,
`lambda_min(Delta_-)/d_6 -> ||K_6||^(-2)`,
`Gamma_-(Delta_-)=O(lambda*P(lambda)/d_6)`.

The last bound is a positive paired-zero sampling action, not an odd residual
action.  The actual residual forcing is inversion even.  Since the already
proved scalar shift satisfies `U_0=o(d_6)`, the package also proves only the
unconditional erosion estimate

`(U_0)_+*||A_-||^2=o(1)`.

Therefore a separately proved uniform unshifted odd quotient floor would
survive the known shift, but neither the unshifted nor shifted floor is proved.
The block-diagonal comparison metric is not identified with the full exterior
source Gram, and the result is confined to the exponential projection
schedule.  No odd forcing/action theorem, physical coframe, high-complement
floor, low/high cross reserve, reducing property, polynomial-cutoff transfer,
full-metric comparison, or `DIRECT_RH_ATTACK.md` equation (5.2) follows.
Locally uniform determinant convergence, RH, every Lambda bound, full natural-
section Laplacian positivity, and routing remain unproved.  All historical
locks and artifacts remain unchanged, and the formal state remains
`P0_INVALIDATED`.

The checkpoint-0.94 module passes `14/14` exact standard-library tests.
Together, the fifty-eight checkpoint-0.71 through checkpoint-0.94 frontier
modules pass `563/563`.  Current discovery contains `2085` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`2085`-test recount is pending.

## Checkpoint 0.95: Growing-rest signed radical-tail Schur reduction

Checkpoint 0.95 is source-locked and theorem-only.  It creates no source lock
or numerical artifact.  Its single module is
`notes/GROWING_REST_SIGNED_RADICAL_TAIL_SCHUR_REDUCTION.md`, with exact
regressions in
`tests/test_growing_rest_signed_radical_tail_schur_reduction.py`.

For the actual split label-8/rest synthesis `A=W*D^(-1/2)`, let
`P_0=1_(ker A)^perp`, `Delta=(A*A^*)^dagger` on `ran A`, and
`B=P_K*(Q-U*I)*P_K`.  The package proves, without assuming injectivity,

`B>=mu*Delta  iff  A^*B*A-mu*P_0>=0`,

with `P_0=1_(0,infinity)(D^(-1/2)*W^*W*D^(-1/2))`.  The anchor deflation and
the state-invisible origin correction are linear in every source coefficient.
Their global two-sided radical remainders therefore form one linear synthesis
`R`, and polarization gives the complete actual signed matrix

`Sigma=W^*Q*W=W_Z(R,R)`,

including every label-8/rest cross entry.

Congruence by `D^(1/2)` turns the physical comparison into the exact raw
source inequality

`Sigma-U*G>=mu*D^(1/2)*P_0*D^(1/2)`,  `G=W^*W`.

Writing `P_0=[[pi,eta^*],[eta,Pi]]`, define

`s_mu=Sigma_88-U*G_88-mu*D_8*pi`,

`c_mu=Sigma_R8-U*G_R8-mu*D_R^(1/2)*eta*D_8^(1/2)`,

`K_mu=Sigma_RR-U*G_RR-mu*D_R^(1/2)*Pi*D_R^(1/2)`.

If `s_mu>0`, the comparison is equivalent to

`K_mu-c_mu*c_mu^*/s_mu>=0`.

If `s_mu=0`, it is equivalent to `c_mu=0` and `K_mu>=0`; if `s_mu<0`, it is
impossible.  The equivalent rest-pivot criterion retains the Moore--Penrose
range condition when the rest block is singular.  Thus the exact remaining
actual target is one positive `mu_0` and one unbounded locked schedule on
which the appropriate complete singleton-shorted rest branch holds.

The weighted-PNT normal form rewrites the same target as the
`D_R`/`P_0`-relative signed Stieltjes translation covariance after the
singleton short.  It keeps the pole, archimedean, and minus-prime terms
combined.  The known scalar shift is small only after whitening:

`||U*A_8^*A_8||=o(lambda^(-4))`,
`||U*A_R^*A_R||=o(lambda^(-6))`,
`||U*A_R^*A_8||=o(lambda^(-5))`.

No corresponding raw-`U*G` scale is asserted.  A paired-slot implication
family preserves the positive absolute Gram, a favorable singleton, and
zero singleton/rest cross while its rest floor tends to zero or becomes
negative.  This family is not an actual prolate--Weil realization; it proves
only that the current positive inputs do not imply the missing signed rest
frame.

Checkpoint 0.95 proves no actual growing-rest lower frame, uniform signed
low floor, residual action, odd-sector floor, reducing property, physical
high-complement or low/high cross comparison, full exterior metric theorem,
or `DIRECT_RH_ATTACK.md` equation (5.2).  Locally uniform determinant
convergence, RH, every Lambda bound, full natural-section Laplacian
positivity, and routing remain unproved.  All historical locks and artifacts
remain unchanged, and the formal state remains `P0_INVALIDATED`.

The checkpoint-0.95 module passes `16/16` exact standard-library tests.
Together, the fifty-nine checkpoint-0.71 through checkpoint-0.95 frontier
modules pass `579/579`.  Current discovery contains `2101` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`2101`-test recount is pending.

## Checkpoint 0.96: Fixed even-prefix arithmetic synthesis theorem

Checkpoint 0.96 is source-locked and theorem-only.  It creates no source lock
or numerical artifact.  Its single theorem module is
notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md, with exact
standard-library regressions in
tests/test_fixed_even_prefix_arithmetic_synthesis_theorem.py.

Fix \(m\geq3\).  On the locked odd-half-integer, exponential-projection
schedule, every label \(t=4j\leq4m\) has the explicit first quasimode

\[
 \mu_t=-{2t^2+2t+3\over4},
\]

\[
 u_t={\sqrt{t(t-1)(t-2)(t-3)}\over64\pi}h_{t-4}
 -{\sqrt{(t+1)(t+2)(t+3)(t+4)}\over64\pi}h_{t+4}.
\]

The theorem proves the corresponding \(L^2\) and point-value errors
\(O_t(\lambda^{-4})\).  With

\[
 r_t={\sqrt{t!}\over2^{t/2}(t/2)!},
\]

it also proves

\[
 {u_t(0)\over h_t(0)}=-{3(2t+1)\over64\pi},\qquad
 \rho_t=-r_t+{3tr_t\over32\pi}\lambda^{-2}
                 +O_t(\lambda^{-4}).
\]

The exact finite source \(q_{t,\lambda}\) has zero integral, but its point
value is generally only beyond-all-orders small.  Only the limiting
coefficients \(q_t\) and \(q_{t,1}\) have both exact zero point value and
exact zero integral.  Their arithmetic images give

\[
 p_t=K_t+\lambda^{-2}K_{t,1}+O_{t,L^2}(\lambda^{-3}).
\]

The Mellin factors of \(K_{4j}\) are triangular polynomials of degree
\(j-1\) in \(s(s-1)\), while the first corrections have degree \(j\).
Consequently \(K_4,K_8,\ldots,K_{4m}\) are independent.  After anchor
deflation, the raw fixed-prefix Gram converges to a positive-definite matrix,
so the fixed-prefix synthesis is eventually injective with bounded raw-Gram
conditioning.  Every constant and threshold here may depend on the fixed
\(m\).

For fixed \(s<t\), the exact defect hierarchy is

\[
 {d_s\over d_t}\sim {t!\over s!}(16\pi)^{s-t}
                    \lambda^{-2(t-s)}.
\]

The scalar column metrics satisfy \(D_t/d_t\to1\).  The full fixed-prefix
metric is \(I+O_m(\lambda^{-8})\) relative to its diagonal defect metric,
and the fixed rest metric is \(I+O_m(\lambda^{-16})\).  The omitted
singleton/rest exterior cross is \(O_m(\lambda^{-12})\) after diagonal
whitening.  These are fixed-prefix comparisons, not a growing full-metric
theorem.

For each column,

\[
 d_tM_t\longrightarrow\|W_{t,\infty}\|^2>0.
\]

The combined and rest synthesis scales are

\[
 \|A_m\|^2=\Theta_m(d_8^{-1}),\qquad
 \|A_{R,m}\|^2=\Theta_m(d_{12}^{-1}).
\]

The ratio \(d_{4m}/d_8\) is the condition number of the whitened Gram, or
equivalently of the nonzero squared singular spectrum.  It is not the
condition number of the synthesis:

\[
 \operatorname {cond}_2(A_m)
 =\Theta_m\!\left(\sqrt{d_{4m}/d_8}\right)
 =\Theta_m(\lambda^{4m-8}).
\]

Finally, the proved scalar shift \(U=o(d_6)\) gives only the fixed-depth
whitened estimates

\[
 \|UA_m^*A_m\|=o(\lambda^{-4}),\quad
 \|UA_{R,m}^*A_{R,m}\|=o(\lambda^{-12}),\quad
 \|UA_{R,m}^*A_8\|=o(\lambda^{-8}).
\]

They are not raw-coordinate \(UG\) statements.  Checkpoint 0.96 proves no
uniform-in-depth frame, growing-rest floor, signed floor, residual action,
odd floor, physical high-complement or low/high cross theorem, reducing
property, full natural-cutoff positivity, equation (5.2) of
DIRECT_RH_ATTACK.md, locally uniform determinant convergence, RH conclusion,
or Lambda bound.  All historical locks and artifacts remain unchanged, and
the formal state remains P0_INVALIDATED.

The checkpoint-0.96 module passes 18/18 exact standard-library tests.
Together, the sixty checkpoint-0.71 through checkpoint-0.96 frontier modules
pass 597/597.  Current discovery contains 2119 tests.  The last complete
repository suite remains checkpoint 0.70 at 1522/1522; a complete
2119-test recount is pending.

## Checkpoint 0.97: Restricted forcing and diagonal-covariance signed-tail dichotomy

Checkpoint 0.97 is source-locked and theorem-only.  It creates no source
lock or numerical artifact.  The two new theorem modules are
`notes/RESTRICTED_FORCING_ACTION_TRANSFER_THEOREM.md` and
`notes/FIXED_EVEN_PREFIX_DIAGONAL_COVARIANCE_COLLAPSE_AND_SIGNED_TAIL_DICHOTOMY.md`,
with exact standard-library regressions in the corresponding test modules.

For an onto, possibly noninjective normalized synthesis
\(A:X\to K\), put

\[
 S=(\ker A)^\perp,\qquad J=A^*A,\qquad
 \Delta=(AA^*)^{-1},\qquad H=A^*BA,\qquad g=A^*c.
\]

The polar map \(U=AJ_S^{-1/2}:S\to K\) is unitary and gives the exact,
order-sensitive identities

\[
 U^*(B^{-1}\Delta)U=J_S^{1/2}H_S^{-1}J_S^{-1/2},
\]

\[
 B^{-1}c=AH_S^{-1}g,\qquad
 A^\dagger B^{-1}c=H_S^{-1}g,\qquad
 A^*B^{-1}c=J_SH_S^{-1}g.
\]

Thus the one-forcing transfer factor is exactly

\[
 K_c^2={\|B^{-1}c\|^2\over\|\Delta^{-1}c\|^2}
 ={\langle H_S^{-1}g,J_SH_S^{-1}g\rangle
        \over\langle g,J_Sg\rangle}.
\]

Equivalently, if \(u=\Delta^{-1}c\), \(T=B^{-1}\Delta\), and
\(\nu_u\) is the spectral measure of \(T^*T\) generated by \(u\), then

\[
 K_c^2=\int s\,d\nu_u(s)
      =\sum_\sigma \sigma^2
        {\|P_\sigma u\|^2\over\|u\|^2},
\]

where \(\sigma\) ranges over distinct singular-value levels and
\(P_\sigma\) is the full spectral projection.  This formulation remains
basis safe at repeated singular values.  A uniformly bounded first moment
is necessary and sufficient for this one forcing vector; a cap on the
complete right-singular cyclic support is sufficient but strictly stronger.

A fixed two-sided Loewner comparison does not supply the first-moment
bound.  The exact family

\[
 J_\varepsilon=\operatorname {diag}(\varepsilon^2,1),\qquad
 H=\begin{pmatrix}3/2&-1/2\\-1/2&3/2\end{pmatrix}
\]

satisfies

\[
 \Delta_\varepsilon\preceq B_\varepsilon
 \preceq2\Delta_\varepsilon,\qquad
 K_c^2={9\over16}+{\kappa(J_\varepsilon)\over16}.
\]

Hence the general floor-only conditioning loss is sharp in order.  This is
an abstract implication countermodel, not a bound or failure for the actual
prolate--Weil forcing.

The second theorem fixes \(T>0\) and transfers the complete
polynomial--Xi covariance collapse to one actual diagonal of finite
anchor-deflated prefixes.  There is a strictly increasing locked sequence
\(\lambda_m=p_m/2\), with \(p_m\) odd, for which

\[
 \gamma_{m,\lambda_m}(T)^{1/m}\longrightarrow0.
\]

This diagonal may simultaneously retain transition inclusion, finite-prefix
injectivity, every fixed-prefix metric comparison, and a vanishing whitened
scalar shift.  The quantifier is existence of one non-effective diagonal;
it is not collapse on every growing schedule.

For the actual radical remainder, paired zero sampling gives

\[
 Y=Z{\cal R}_{\lambda,m}D^{-1/2},\qquad
 \widehat A=Y^*Y,\qquad
 \widehat\Sigma=Y^*JY,\qquad
 \widehat E=2Y^*\Pi_{\rm anti}Y,
\]

and therefore the exact signed factorization

\[
 \widehat\Sigma=\widehat A-\widehat E.
\]

With

\[
 \widehat G=D^{-1/2}G_{m,\lambda}D^{-1/2},\quad
 P_0=1_{(0,\infty)}(\widehat G),\quad
 C_\mu=\widehat A-U\widehat G-\mu P_0,
\]

the proposed signed floor is equivalent, including the singular branch, to

\[
 C_\mu\succeq0,\qquad
 {\rm ran}\widehat E\subseteq{\rm ran}C_\mu,\qquad
 \|C_\mu^{\dagger/2}\widehat E C_\mu^{\dagger/2}\|\leq1.
\]

Moreover, collapse of
\(\lambda_{\min}(P_0(\widehat A+|U|\widehat G)P_0)\) is a sufficient
certificate that no uniform positive signed floor exists.  The theorem does
not prove that this actual quantity collapses.

The real-window covariance denominator is the raw polynomial--Xi Gram
\(G\), not the exterior defect metric \(D\), and real-window restriction is
not the absolute paired-zero tail Gram.  The proved diagonal covariance
collapse therefore does not prove signed-tail failure.  A growing
\(G/D\) comparison and a source-specific real-window-to-zero-tail transfer
remain missing, followed by the independent signed orientation condition.

Checkpoint 0.97 proves no actual one-forcing first-moment bound, no actual
growing-rest signed-floor failure or positive floor, no residual action,
odd-sector floor, physical high-complement or low/high reduction theorem,
equation (5.2) of `DIRECT_RH_ATTACK.md`, locally uniform determinant
limit, RH conclusion, or Lambda bound.  All historical locks and artifacts
remain unchanged, and the formal state remains `P0_INVALIDATED`.

The two checkpoint-0.97 modules pass `28/28` exact standard-library
tests.  Together, the sixty-two checkpoint-0.71 through checkpoint-0.97
frontier modules pass `625/625`.  Current discovery contains
`2147` tests.  The last complete repository suite remains checkpoint
0.70 at `1522/1522`; a complete `2147`-test recount is
pending.

## Checkpoint 0.98: Endpoint-null Bernoulli prime quadrature and zero-tail carrier-transfer barriers

Checkpoint 0.98 is source-locked and theorem-only.  It creates no source
lock or numerical artifact.  The three new modules are
`notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md`,
`notes/FIXED_EVEN_ENDPOINT_NULL_BERNOULLI_PRIME_QUADRATURE_BOUND.md`,
and `notes/REAL_WINDOW_TO_ZERO_TAIL_CARRIER_TRANSFER_BARRIER.md`,
with exact standard-library regressions in their corresponding test files.

For every fixed even prefix, endpoint normalization gives

\[
 {E_t^2\over D_t}\sim2\pi\lambda .
\]

The leading two-tail sawtooth profile is therefore universal after defect
whitening:

\[
 G_{0,m}\longrightarrow{\pi\over12}{\bf1}{\bf1}^*.
\]

This is a rank-one real-line Gram, not a paired-zero Gram.  The complete
additive leakage of one fixed unbumped column is exactly \(D_t/2\), while
its leading sine endpoint model has leakage asymptotic to \(D_t/\pi\).
Thus

\[
 \liminf{\|H_t-L_t\|\over\sqrt{D_t}}
 \geq\left|{1\over\sqrt2}-{1\over\sqrt\pi}\right|>0.
\]

The globally radical correction changes this by only \(o(D_t)\).

On the defect-whitened label-\(8/12\) endpoint-null direction, the exact
spheroidal gap is

\[
 \Theta_{12,\lambda}-\Theta_{8,\lambda}
 =8c-42+O(\lambda^{-2}).
\]

The first nonzero sampled endpoint term is

\[
 \kappa_\lambda e^{-3s/2}B_2(\lambda^2e^s),\qquad
 \kappa_\lambda\longrightarrow-2\pi^{3/2},
\]

and its isolated two-tail norm squared tends to

\[
 {2\pi^3\over135}.
\]

The corresponding additive endpoint model has energy \(8/(3\pi)\), while
the full endpoint-null prolate combination has energy \(1/2+o(1)\).  Hence
the two-term additive remainder is also nonvanishing.  These are exactly
the first endpoint truncation and the first nonzero endpoint-null
\(B_2\) truncation; no theorem for every finite endpoint order is proved.

The reflected \(B_2\)--\(B_2\) term reduces to the absolutely convergent
scalar \({\cal M}_{11,A}\).  The earlier direct PNT envelope gives only a
growing normalized bound.  Oscillation inside the Bernoulli
self-convolution closes the scalar scale instead.  With

\[
 K_+={3\zeta(9/4)^2\over\pi^{9/2}},\qquad
 K_-={\zeta(5/2)^2\over\pi^5},
\]

the exact correlation satisfies

\[
 |C_A(y)|\leq K_+A^{-1/2}e^{-5y/4}
                  +K_-A^{-1}e^{-3y/2}.
\]

Integration by parts, including every right-continuous prime jump and the
archimedean remainder, gives

\[
 {\cal M}_{11,A}=-\int_0^\infty C_A(y)\,dy
 +\sum_{n>A}{\Lambda(n)\over n}C_A\!\left(\log{n\over A}\right)
 +A^{-3}\int_0^\infty
 {e^{-3y}C_A(y)\over1-A^{-2}e^{-2y}}\,dy.
\]

Moreover,

\[
 0\leq\int_0^\infty C_A(y)\,dy
 \leq{\zeta(3)^2\over\pi^6A^2}.
\]

Chebyshev partial summation now proves

\[
 |{\cal M}_{11,A}|\leq {9C_\psi K_+\over5}A^{-1/2}
 +{5C_\psi K_-\over3}A^{-1}
 +{\zeta(3)^2\over\pi^6}A^{-2}
 +{A^{-3}\over576(1-A^{-2})}.
\]

Thus \({\cal M}_{11,A}=O(\lambda^{-1})\) for \(A=\lambda^2\), and its
mandatory coefficient \(8\pi^3\lambda+o(\lambda)\) is bounded at the
own-defect normalization.  This is an absolute estimate, not a signed
asymptotic: the same-sign stationary phases lead to nonlinear
von Mangoldt sums for which no sign, limit, or little-oh improvement is
proved.  Complete
Volterra and near-range arithmetic terms may still cancel the isolated
pieces.

The carrier theorem supplies a separate exact no-transfer mechanism.  For
two declared critical-line zeros satisfying the stated height and
separation hypotheses, their nearest compact Fourier carriers span a
two-dimensional space \(H_L\) on which every unit vector obeys

\[
 \int_{-T}^T|F_v(x)|^2\,dx
 \leq {512T\over L\gamma_{\min}^2},\qquad
 \|v\|_{\mathfrak Z}^2\geq {L\over8\pi^2}.
\]

For any one-dimensional even anchor, the section

\[
 J_L=H_L\cap\kappa_L^\perp
\]

is nonzero, and the same estimates hold there.  The exact all-vector
radical lift preserves the carrier samples as negatives of its exterior
remainder samples.  At each fixed finite stage, the unrestricted complete
polynomial--Xi tower also saturates the whole even physical space and,
after anchor projection, its complement.  This qualitative saturation has
an unknown depth and condition number and is not the actual fixed-prefix
metric theorem.

The exact missing source gate is the defect-weighted right-inverse bound

\[
 {\cal R}_D(J_L;m,\lambda)
 =\|A_{D,m,\lambda}^{\dagger}|_{J_L}\|^2\leq CL.
\]

If an allowed prefix contains \(J_L\) and satisfies this estimate, then a
minimum-\(D\) carrier preimage has zero-sampling quotient at least
\(1/(8\pi^2C)\).  No admitted theorem proves this bound at a depth
containing the moving carriers, and it gives no \(D\)-cost estimate for the
separate polynomial moment-ratio witness.

Finally, the logarithmic mean plus nearest-locked-grid argument gives an
explicit nonzero carrier product for every fixed finite zero set.  Its
sufficient condition loses \(2^K\), so it fails for the natural growing
\(K\) used by the anti-carrier construction.  This is failure only of that
method; it does not prove that no favorable locked point exists.

Checkpoint 0.98 proves no all-finite-\(K\) endpoint expansion, no specific
moment-witness \(D\)-cost, no additive-to-paired-zero transfer, no actual
absolute- or signed-tail conclusion, no singleton or growing-rest floor,
residual action, odd floor, physical high-complement or low/high reduction
theorem, equation (5.2) of `DIRECT_RH_ATTACK.md`, locally uniform
determinant limit, RH conclusion, or Lambda bound.  All historical locks
and artifacts remain unchanged, and the formal state remains
`P0_INVALIDATED`.

The three checkpoint-0.98 modules pass `42/42` exact standard-library
tests.  Together, the sixty-five checkpoint-0.71 through checkpoint-0.98
frontier modules pass `667/667`.  Current discovery contains
`2189` tests.  The last complete repository suite remains checkpoint
0.70 at `1522/1522`; a complete `2189`-test recount is
pending.

## Checkpoint 0.99: Fixed-endpoint Bernoulli matrix quadrature and jet growth

Checkpoint 0.99 is source-locked and theorem-only.  It creates no source
lock or numerical artifact.  The new module is
`notes/FIXED_ENDPOINT_BERNOULLI_MATRIX_QUADRATURE_AND_JET_GROWTH_THEOREM.md`,
with an exact standard-library regression in
`tests/test_fixed_endpoint_bernoulli_matrix_quadrature_and_jet_growth_theorem.py`.

For fixed Bernoulli orders \(q,r\geq1\), put

\[
 g_{q,A}(t)=e^{-(q-1)t}\widetilde B_q(Ae^t){\bf1}_{t\geq0},
 \qquad C_{q,r;A}=g_{q,A}*g_{r,A},
\]

and let \(d=\min(q,r)\), \(\alpha_d=d-3/4\), and
\(\beta_d=d-1/2\).  The exact constants

\[
 K^+_{q,r}={12q!r!\over(2\pi)^{q+r}\sqrt\pi}
 \zeta\!\left(q+{1\over4}\right)
 \zeta\!\left(r+{1\over4}\right),
\]

\[
 K^-_{q,r}={4q!r!\over\pi(2\pi)^{q+r}}
 \zeta\!\left(q+{1\over2}\right)
 \zeta\!\left(r+{1\over2}\right)
\]

give the uniform fixed-order estimate

\[
 |C_{q,r;A}(y)|\leq K^+_{q,r}A^{-1/2}e^{-\alpha_dy}
 +K^-_{q,r}A^{-1}e^{-\beta_dy}.
\]

This includes \(q=1\): Fejer approximation composes with the physical
convolution, and the weighted van der Corput argument loses no factor two.
The convolution is locally absolutely continuous, has value zero at the
lower endpoint, and retains every right-continuous prime-jump and
archimedean boundary.

The exact quadrature is

\[
 \begin{aligned}
 {\cal Q}_{q,r;A}={}&-\int_0^\infty C_{q,r;A}(y)\,dy
 +\sum_{n>A}{\Lambda(n)\over n}
 C_{q,r;A}\!\left(\log{n\over A}\right)\\
 &+A^{-3}\int_0^\infty
 {e^{-3y}C_{q,r;A}(y)\over1-A^{-2}e^{-2y}}\,dy.
 \end{aligned}
\]

With \(J_q=2q!\zeta(q+1)/\{\pi(2\pi)^q\}\), the continuous term is at most
\(J_qJ_rA^{-2}\) in magnitude, and Chebyshev partial summation proves

\[
 \boxed{{\cal Q}_{q,r;A}=O_{q,r}(A^{-1/2})
 =O_{q,r}(\lambda^{-1})},\qquad A=\lambda^2.
\]

Thus every fixed Bernoulli-coordinate matrix
\(2\lambda({\cal Q}_{q,r;A})_{q,r\leq R}\) has bounded norm for fixed
\(R\).  The order convention is
\({\cal M}_{jk,A}={\cal Q}_{j+1,k+1;A}\); this covers both the leading
\(P\)--\(P\) entry and the frozen \(B_2\)--\(B_2\) entry.

The exact endpoint-jet recurrence is

\[
 \begin{aligned}
 2(j+1)P_{j+1}={}&\{\Theta-c^2-j(j+1)\}P_j
 -2jc^2P_{j-1}-j(j-1)c^2P_{j-2},\\
 &P_0=1,\qquad P_{-1}=P_{-2}=0.
 \end{aligned}
\]

For fixed labels \(8,12\), a raw fixed-column coefficient of order \(q\)
has size \(\lambda^{2q-2}\).  On the exact endpoint-null line,

\[
 \widehat\gamma_{q,v}\sim
 (-1)^{q-1}{2^q\pi^{2q-5/2}\over(q-2)!q!}
 \lambda^{2q-4}\qquad(q\geq2).
\]

Thus \(\widehat\gamma_{2,v}\to-2\pi^{3/2}\) and the order-one row vanishes
exactly.  Pulling the bounded coordinate matrix back through these jets
gives only \(O_R(\lambda^{4R-8})\) on the endpoint-null line.  For
\(R\geq3\) this is a weak growing upper bound, not a lower bound: signed
entries and different endpoint orders may cancel.  It proves neither
boundedness nor divergence of the finite truncation or complete tail.

Nothing in checkpoint 0.99 controls the complete Volterra remainder, sums
the endpoint series, or is uniform in growing Bernoulli order, label, or
prefix depth.  It proves no signed asymptotic, absolute- or signed-tail
floor or failure, residual action, odd floor, physical high-complement or
low/high reduction theorem, equation (5.2) of `DIRECT_RH_ATTACK.md`, RH
conclusion, or Lambda bound.  All historical locks and artifacts remain
unchanged, and the formal state remains `P0_INVALIDATED`.

The checkpoint-0.99 module passes `17/17` exact standard-library tests.
Together, the sixty-six checkpoint-0.71 through checkpoint-0.99 frontier
modules pass `684/684`.  Current discovery contains `2206` tests.  The
last complete repository suite remains checkpoint 0.70 at `1522/1522`;
a complete `2206`-test recount is pending.

## Checkpoint 1.00: Moving-label carrier coframe and complete Volterra caustic quadrature

Checkpoint 1.00 is source-locked and theorem-only.  It creates no source
lock or numerical artifact.  The two new modules are
`notes/MOVING_LABEL_CARRIER_COFRAME_DEFECT_RIGHT_INVERSE_THEOREM.md` and
`notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md`,
with exact standard-library regressions in the correspondingly named test
modules.

For the carrier theorem put

\[
 \lambda_A={p_A\over2},\qquad L_A=2\log\lambda_A\in[A,A+1],
\]

where the odd integers (p_A) lie on an infinite locked schedule separated
quantitatively from every zero of Ξ.  With

\[
 N_A=\lceil C_N(A+1)^2\rceil,\quad J_A=N_A+1,
 \quad K_A=\lceil\kappa L_A^3\log L_A\rceil,
 \quad Q_A=J_A+K_A,
\]

the actual zero-integral even prolate columns with labels
(4,8,\ldots,4Q_A) map onto the complete centered even log-Fourier space
(E_{N_A}^+).  Deflating by the actual label-four physical anchor leaves
the labels (8,\ldots,4Q_A) surjective onto the anchor complement.  In the
exact exterior-defect metric (D), the coordinate-invariant minimum-cost
right inverse obeys

\[
 \boxed{
 {cal R}_D(\kappa_A^\perp;Q_A,\lambda_A)
 \leq \exp\left\{-{2\lambda_A^2\over L_A}
                  +C_0L_A^4\log L_A\right\}=o(1).}
\]

Consequently the nonzero two-zero carrier section (J_{L_A}) from the
real-window barrier lies in the actual wide-prefix range and has
({\cal R}_D(J_{L_A};Q_A,\lambda_A)=o(1)).  This closes the absolute
defect-weighted carrier gate on the locked schedule.  The prefix is wide:
its depth is (O(L^3\log L)), not (O(L^2)).  The theorem neither proves
the square first-(J_A) determinant nor gives signed orientation or
residual action.

For the complete fixed-label Volterra theorem set

\[
 c=2\pi\lambda^2,\qquad A=\lambda^2,
\]

and let (H_v) be the corrected, fully metric-normalized label-(8/12)
endpoint-null source.  Its complete one-tail profile and physical
correlation are

\[
 B_\lambda(s)={\sqrt{\lambda e^s}\over2}
   \sum_{m\geq1}H_v(m\lambda e^s),\qquad
 g_\lambda(s)=e^{s/2}B_\lambda(s),\qquad
 C_\lambda=g_\lambda*g_\lambda.
\]

The mandatory factor (e^{s/2}) gives
(C_\lambda(y)=e^{y/2}(B_\lambda*B_\lambda)(y)).  Uniformly for (y\geq0),

\[
 |C_\lambda(y)|\leq K\left\{
 c^{-1/4}{\mathbf1_{|y-\log2|\leq\eta}
   \over(1+c^{1/2}|y-\log2|)^{1/2}}
 +c^{-1/2}(1+y)e^{-y}\right\}.
\]

There is exactly one quartic caustic: the positive phase and sample pair
((m,l)=(1,1)) at (y=\log2), (s=\frac12\log2).  Its locked center has
the exact positive local asymptotic

\[
 \boxed{C_\lambda(\log2)=
 {\Gamma(1/4)\cos(\pi/8)\over4\pi}c^{-1/4}
 +o(c^{-1/4}).}
\]

The complete scalar has the exact Stieltjes quadrature

\[
 \begin{aligned}
 {cal M}_{v,A}={}&-\int_0^\infty C_\lambda(y)\,dy
 +\sum_{n>A}{\Lambda(n)\over n}
 C_\lambda\!\left(\log{n\over A}\right)\\
 &+A^{-3}\int_0^\infty
 {e^{-3y}C_\lambda(y)\over1-A^{-2}e^{-2y}}\,dy,
 \end{aligned}
\]

and the pinned prime estimate plus exact near-caustic lattice counting
prove

\[
 \boxed{{\cal M}_{v,A}=O(c^{-1/2})=O(\lambda^{-1}).}
\]

Therefore the mandatory reflected prefactor (2\lambda) leaves a bounded
complete fixed-(8/12) physical outer contribution.  The positive local
caustic coefficient does not decide the signed quadrature: the proof takes
absolute values and establishes neither a sign nor a limit.

The carrier result is absolute, not signed or residual.  The Volterra
result is fixed-label and magnitude-only, not a growing-rest theorem.
Checkpoint 1.00 proves no even or odd signed floor, residual action,
shifted solve, reducing or physical high-complement property, low/high
comparison, equation (5.2) of `DIRECT_RH_ATTACK.md`, RH conclusion, or
Lambda bound.  Historical locks and artifacts remain unchanged, and the
formal state remains `P0_INVALIDATED`.

The two checkpoint-1.00 modules pass `39/39` exact standard-library tests.
Together, the sixty-eight checkpoint-0.71 through checkpoint-1.00 frontier
modules pass `723/723`.  Current discovery contains `2245` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a
complete `2245`-test recount is pending.

## Checkpoint 1.01: Fixed 8/12 endpoint-null Archimedean directional lower bound

Checkpoint 1.01 is source-locked and theorem-only.  It creates no source
lock or numerical artifact.  The new module is
`notes/FIXED_EVEN_ENDPOINT_NULL_ARCHIMEDEAN_FLOOR_THEOREM.md`, with an
exact standard-library regression in
`tests/test_fixed_even_endpoint_null_archimedean_floor_theorem.py`.

On the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,
\]

let (v_\lambda) be the exact label-(8/12) endpoint-null direction,
rescaled to have unit full exterior-defect norm.  If (K_{v,\lambda}) is
its origin-corrected global radical lift, (W_{v,\lambda}) its actual
compact projected physical column, and

\[
 R_{v,\lambda}=K_{v,\lambda}-W_{v,\lambda}
 =O_\lambda+P_\lambda,
\]

then the exact shifted scalar is

\[
 \boxed{\mathcal S_\lambda=
 \mathcal W_Z(R_{v,\lambda},R_{v,\lambda})
 -U_\lambda\|W_{v,\lambda}\|_2^2.}
\]

In particular, the shift multiplies the compact metric (W^*W), not the
global remainder norm.

For the complete one-tail profile (B_\lambda), define

\[
 \boxed{
 E={1\over4}+{1\over2\pi}\sum_{m\geq2}{1\over m}
 \left\{\arcsin{1\over m}
 -{\sqrt{m^2-1}(m^2-2)\over m^4}\right\}
 =0.282628070905254\ldots .}
\]

The complete fixed-label WKB analysis, including the hard edge and Jost
errors, proves

\[
 2\|B_\lambda\|_2^2\longrightarrow E,
 \qquad
 2\int_{|\xi|\geq c/2}|\widehat B_\lambda(\xi)|^2
 {d\xi\over2\pi}\longrightarrow E.
\]

For the angular Fourier convention used here, the exact even
Archimedean multiplier is

\[
 a(\xi)=\operatorname {Re}\psi\!\left({1\over4}+{i\xi\over2}\right)
 -\log\pi .
\]

Its high-frequency logarithmic growth gives the same-side bound

\[
 \boxed{Q_{\rm ar}^{\rm same}(O_\lambda,O_\lambda)
 \geq {E\over2}\log c-C.}
\]

The same-side prime term is bounded below by a constant, the exact
reflected cross-tail term is bounded in absolute value by the checkpoint
1.00 complete Volterra theorem, and the even pole is nonnegative.  A
fixed-(8/12) compact Fourier-tail argument proves all projection-containing
signed pairings are (o(1)), while the exact Rayleigh ledger gives
(|U_\lambda|\|W_{v,\lambda}\|_2^2=o(1)).  Therefore

\[
 \boxed{\mathcal S_\lambda\geq {E\over2}\log c-C,}
\]

so this one fully normalized fixed direction is eventually positive and
tends to (+\infty).

This is a directional value only.  It is not a minimum on the label-(8/12)
plane, a singleton-shorted floor, a fixed-prefix floor, or a growing-rest
floor, and it is not uniform in a moving label or growing prefix.  It
determines neither a constant term nor an exact finite renormalized limit.
Checkpoint 1.01 proves no residual action, shifted inverse, reducing or
physical high-complement theorem, low/high comparison, equation (5.2) of
`DIRECT_RH_ATTACK.md`, RH conclusion, or Lambda bound.  Historical locks
and artifacts remain unchanged, and the formal state remains
`P0_INVALIDATED`.

The checkpoint-1.01 module passes `14/14` exact standard-library tests.
Together, the sixty-nine checkpoint-0.71 through checkpoint-1.01 frontier
modules pass `737/737`.  Current discovery contains `2259` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a
complete `2259`-test recount is pending.

## Checkpoint 1.02: Fixed label-8/12 plane Archimedean-arithmetic floor

Checkpoint 1.02 is source-locked and theorem-only.  It creates no source
lock or numerical artifact.  The new module is
`notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md`,
with an exact standard-library regression in
`tests/test_fixed_even_8_12_plane_archimedean_arithmetic_floor_theorem.py`.

On the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,
\]

let \(F_\lambda:\mathbb C^2\to L^2(-\lambda,\lambda)\) synthesize the
actual uncorrected anchor-deflated prolate labels \(8\) and \(12\).  The
exact full-exterior metric and endpoint row are

\[
 D_\lambda=F_\lambda^*(I-\mathcal P_\lambda)F_\lambda\succ0,
 \qquad \eta_\lambda z=(F_\lambda z)(\lambda).
\]

The invisible origin correction is not included in \(F_\lambda\) or
\(D_\lambda\), because it changes source exterior leakage; it enters only
the later global radical lift.  Whiten the endpoint row and form the exact
real endpoint/null basis \(e_\lambda,v_\lambda\).  Its raw pullbacks
\(f_{e,\lambda},f_{v,\lambda}\) satisfy

\[
 \langle f_i,(I-\mathcal P_\lambda)f_j\rangle=\delta_{ij},
 \qquad f_{v,\lambda}(\lambda)=0,
 \qquad f_{e,\lambda}(\lambda)>0.
\]

For the two complete physical one-tail profiles \(B_e,B_v\), diagonal
oscillatory averaging, including the hard edge and complete Jost errors,
proves the matrix limit

\[
 2\begin{pmatrix}
 \langle B_e,B_e\rangle&\langle B_e,B_v\rangle\\
 \langle B_v,B_e\rangle&\langle B_v,B_v\rangle
 \end{pmatrix}
 \longrightarrow \begin{pmatrix}F&0\\0&E\end{pmatrix},
 \qquad F>E>0,
\]

where

\[
 E=0.282628070905254\ldots,
 \qquad F=0.427511972026948\ldots .
\]

Uniform low-frequency exclusion below \(c/2\), followed by the exact even
digamma multiplier, upgrades the checkpoint-1.01 directional estimate to
the genuine matrix inequality

\[
 \boxed{Q_{\rm ar}^{\rm same}
 \succeq {E\over2}\log c\,I_2-CI_2.}
\]

The complete same-side prime matrix is \(O(1)\).  Its endpoint sawtooth
uses the exact integer-dilation covariance

\[
 \int_0^1P(x)P(nx)\,dx={1\over12n},
\]

which supplies the additional inverse-\(n\) factor.  The repaired
complete-Jost proof retains the intermediate-sample \(1/m\) endpoint
boundary, passes through Fejer limits uniformly, and treats the hard edge
without splitting the growing endpoint jets term by term.

The complete reflected Stieltjes matrix also satisfies

\[
 \|{-2\lambda\mathcal M_A}\|=O(1).
\]

Here the endpoint atom is handled by local absolute continuity, and one
real caustic rotation cancels only the available cosine/null coefficient;
the remaining trigonometric branch is retained and estimated.  Thus the
same-side and reflected arithmetic bounds are complete matrix bounds,
not scalar or termwise endpoint substitutions.

Let \(K_i\) be the origin-corrected global radical lift, \(W_i\) the actual
compact projected column, and \(R_i=K_i-W_i\).  The exact projection
transfer gives, in operator norm,

\[
 [\mathcal W_Z(R_i,R_j)]_{i,j=e,v}
 =[\mathcal W_Z(O_i,O_j)]_{i,j=e,v}+o(1),
 \qquad \|U_\lambda W^*W\|=o(\lambda^{-4}).
\]

The even pole matrix is positive semidefinite.  Consequently the exact
shifted fixed-plane compression

\[
 \mathsf H_{ij}(\lambda)=
 \mathcal W_Z(R_{i,\lambda},R_{j,\lambda})
 -U_\lambda\langle W_{i,\lambda},W_{j,\lambda}\rangle
\]

satisfies

\[
 \boxed{\mathsf H(\lambda)
 \succeq {E\over2}\log c\,I_2-CI_2.}
\]

Hence the least eigenvalue of the exact shifted label-\(8/12\) compression
tends to \(+\infty\).  This closes only the fixed two-label plane.  It
does not control labels \(16,20,\ldots\), a moving or growing prefix, the
growing rest or its singleton Schur complement, or the full \(P_0\) floor.
It proves no residual action, physical high-complement comparison,
low/high cross or reducing property, determinant bridge, equation (5.2)
of `DIRECT_RH_ATTACK.md`, RH conclusion, or Lambda bound.  Historical
locks and artifacts remain unchanged, and the formal state remains
`P0_INVALIDATED`.

The checkpoint-1.02 module passes `19/19` exact standard-library tests.
Together, the seventy checkpoint-0.71 through checkpoint-1.02 frontier
modules pass `756/756`.  Current discovery contains `2278` tests.  The
last complete repository suite remains checkpoint 0.70 at `1522/1522`;
a complete `2278`-test recount is pending.

## Checkpoint 1.03: Reciprocal `chi_4` von Mangoldt cancellation

Checkpoint 1.03 is an isolated theorem-only package.  It preserves every
historical source lock and numerical artifact.  Its external analytic
input is Montgomery--Vaughan's primary PDF, which is cited explicitly but
is not vendored or assigned a repository source-lock hash.  The theorem is
recorded in
`notes/RECIPROCAL_CHI4_VON_MANGOLDT_DYADIC_CANCELLATION_THEOREM.md`, with
an exact standard-library regression in
`tests/test_reciprocal_chi4_von_mangoldt_dyadic_cancellation_theorem.py`.

For every fixed real \(A\geq1\), uniformly for \(N\leq X\leq2N\) and
\(0\leq z\leq N^A\), the theorem proves

\[
 \boxed{\left|\sum_{N<k\leq X}\Lambda(k)\chi_4(k)e^{-iz/k}\right|
 \leq C_A N\exp\{-\kappa_A\sqrt{\log N}\}.}
\]

The proof uses a growing phase threshold
\(H_N=\exp\{\eta\sqrt{\log N}\}\).  Fixed-modulus prime-number-theorem
cancellation treats \(z/N\leq H_N\); Vaughan Type I and Type II estimates,
with a fixed derivative order chosen after \(A\), treat the remaining
fixed-polynomial phase range.  The sharp partial endpoint \(X\) remains an
interval throughout.  The quantifier order is essential: \(A\) is fixed
before \(N\to\infty\).

If the dyadic operator-amplitude variation factors \(V_N\) are already
known to be uniformly bounded, write \({\cal D}(c)\) for the dyadic
integers at most \(c\).  An epsilon split then gives the scalar consequence

\[
 \sum_{N\in{\cal D}(c)}{V_N\over N}
 \sup_{|a|\leq1}\sup_{N\leq X\leq2N}
 \left|\sum_{N<k\leq X}\Lambda(k)\chi_4(k)e^{-ica/k}\right|
 =o(\log c).
\]

This closes the scalar reciprocal-prime exponential-sum input only.  It
does not prove the exact Fourier-integral reduction, uniform matrix
amplitude variation, the equality-branch/Archimedean combination, a
matrix or \(P_0\) compression, or a signed growing-rest floor.  In
particular, it cannot splice the small-cutoff carrier coframe into the
exponential-cutoff transition theorem: those constructions have different
physical maps, support projections, and quotient metrics.  It proves no
residual action, equation (5.2) of `DIRECT_RH_ATTACK.md`, RH conclusion,
or Lambda bound.  The formal state remains `P0_INVALIDATED`.

The checkpoint-1.03 module passes `15/15` exact standard-library tests.
Together, the seventy-one checkpoint-0.71 through checkpoint-1.03 frontier
modules pass `771/771`.  Current discovery contains `2293` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a
complete `2293`-test recount is pending.

## Checkpoint 1.04: Growing-transition equality-conductor Garding floor

Checkpoint 1.04 is an equality-subsystem-only theorem package.  It creates
no source lock or numerical artifact and preserves all historical package
bytes.  The theorem is recorded in
`notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md`, with its
exact standard-library regression in
`tests/test_growing_transition_equality_conductor_garding_theorem.py`.

For a zero-integral same-Fourier-phase prolate combination with labels
strictly below the locked transition endpoint, put

\[
 \phi(t)={\sqrt\lambda\over2}e^{t/2}H(\lambda e^t),\qquad
 R_m\phi(s)={\bf1}_{s\geq0}m^{-1/2}\phi(s+\log m),
 \qquad 8\|\phi\|_2^2=D.
\]

The exact sampler-equality form is

\[
 \mathfrak E_\lambda
 =2\sum_{m\geq1}\langle R_m\phi,a(D)R_m\phi\rangle
 -4\int_0^\infty L_{\lfloor e^t\rfloor}|\phi(t)|^2\,dt,
\]

where

\[
 a(\xi)=\operatorname {Re}\psi\!\left({1\over4}
             +{i\xi\over2}\right)-\log\pi.
\]

Burnol's conductor conversion, with every dilation and Mellin factor
retained, gives an exact divisor/conductor identity.  Its arithmetic
bracket is nonnegative.  Splitting the inverse-position logarithm at
\(R=\lambda/L\), a central defect spectral-kernel estimate controls the
\(m=1\) term, while a nonstationary Prüfer--BV argument controls every exact
hard cutoff \(m\geq2\).  The result is the uniform coherent lower bound

\[
 \boxed{\mathfrak E_\lambda(f)
 \geq\left({L\over4}-{1\over4}\log L-C\right)D(f).}
\]

The exact full exterior synthesis satisfies

\[
 8\|\Phi x\|_2^2=x^*D_{\rm full}x,
\]

and the inequality survives the one lower-triangular endpoint shear by
congruence.  A separate estimate for the locked origin bump transfers the
same floor to the actual origin-corrected sampler equality subsystem,
including all bump sampler self/cross terms inside that subsystem.

This is not a floor for the complete physical outer block or for
\(P_0\).  Unequal-sample Archimedean correlations, non-equality prime terms,
reflected tails, pole, compact projection pieces and crosses, the complete
signed matrix, singleton Schur load, and physical quotient comparison all
remain open.  No residual action, high-complement reduction, equation
(5.2) of `DIRECT_RH_ATTACK.md`, determinant limit, RH conclusion, or Lambda
bound follows.  The formal state remains `P0_INVALIDATED`.

The sole new external normalization input is J.-F. Burnol,
*The Explicit Formula and the Conductor Operator*, arXiv:math/9902080.  It
is cited explicitly, is not vendored, and is not assigned a repository
source-lock hash.  The checkpoint-1.04 module passes `11/11`; together, the
seventy-two checkpoint-0.71 through checkpoint-1.04 frontier modules pass
`782/782`.  Current discovery contains `2304` tests.  The last complete
repository suite remains checkpoint 0.70 at `1522/1522`; a complete
`2304`-test recount is pending.

## Checkpoint 1.05: Growing-transition subcritical LG radial action-BV theorem

Checkpoint 1.05 is a theorem-only, radial-action-BV-only package.  It creates
no source lock or numerical artifact and preserves every earlier theorem and
fail-closed boundary.  Its frozen theorem is
`notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md`, with an exact
standard-library regression in
`tests/test_growing_transition_subcritical_lg_action_bv_theorem.py`.

On the locked schedule

\[
 c=2\pi\lambda^2,\qquad L=2\log\lambda,\qquad
 r^2=1-\mu/c^2,\qquad \alpha=cr^2,
\]

the theorem treats only the subcritical radial bulk

\[
 \alpha\geq\alpha_0=(\log L)^4.
\]

After the exact `m=0` Dunster Liouville--Green transformation and the scaling
`q=x^2/r^2`, `T_r(x)=r^2\tau_r(q)`, the Bessel perturbation is

\[
 \Psi_r(q)={1\over16\tau_r(q)^2}-{1\over4q(1+q)}
 +{3+(8+r^2)q+6r^2q^2\over16q(1+q)^3}.
\]

Its apparent endpoint pole cancels exactly and
`Psi_r(0)=(r^2+2)/12`.  A three-region proof gives, for `j+k<=2`,

\[
 \int_0^\infty
 |(r\partial_r)^j(q\partial_q)^k\Psi_r(q)|\,d\tau_r(q)\leq C_{jk}.
\]

Keeping the `J_0/Y_0` carriers rather than differentiating their envelope
then proves that the complete Volterra coefficient matrix and its first two
fixed-phase logarithmic radial derivatives are `I+O(alpha^(-1))`.  After
composition at fixed `q`, this `O(alpha^(-1))` statement holds only through
the first derivative; the second fixed-`q` derivative is asserted only to be
`O(1)`.  The first fixed-`x` derivative is `O(alpha^(-1))`, and the complete
fixed-`q` Volterra variation over the bulk is `O(alpha_0^(-1))`.

For the completed exterior phase, the exact action identity is

\[
 \partial_\sigma\{c[T_r(x)+C(r)]\}=1-u_r(x).
\]

Together with elliptic and geometric variation bounds and the exact leakage
normalization

\[
 \mathcal N_r={J(r)\over\pi c}\{1+\varepsilon_r\},\qquad
 |(r\partial_r)^j\varepsilon_r|
 \leq C_j{\log(2+\alpha)\over\alpha},\quad 0\leq j\leq2,
\]

this gives `O(log L)=o(L)` action-amplitude variation for the scalar,
exterior-defect-whitened radial row.  The Volterra contribution itself has
variation `O((log L)^(-4))`.

The exact algebraic transformation is traced to T. M. Dunster,
*Asymptotics of Prolate Spheroidal Wave Functions*, arXiv:1601.00699.  The
article is cited explicitly but is not vendored or assigned a source-lock
hash.  Dunster's fixed-distance uniform asymptotic theorem is not imported;
the near-separatrix uniform estimates are proved directly from the displayed
exact perturbation.

This theorem does not assemble radial rows over sampler indices, prove the
same-side Hankel commutator or any reflected reciprocal Fourier-integral
operator estimate, cover the Weber edge `alpha<alpha_0`, control endpoint
shear coefficients, or prove a prime, signed-matrix, singleton Schur, or
`P_0` floor.  It proves no residual action, physical high-complement or
low/high reduction, equation (5.2) of `DIRECT_RH_ATTACK.md`, determinant
limit, RH conclusion, or Lambda bound.  The formal state remains
`P0_INVALIDATED`.

The checkpoint-1.05 module passes `12/12`; together, the seventy-three
checkpoint-0.71 through checkpoint-1.05 frontier modules pass `794/794`.
The canonical checkpoint-1.05 discovery count is `2316` tests.  Raw worktree
discovery is `2329` because one frozen but unintegrated post-checkpoint module
contributes exactly `13` tests; those bytes are excluded from checkpoint 1.05
and from its frontier.  The last complete repository suite remains checkpoint
0.70 at `1522/1522`; a complete canonical `2316`-test recount is pending.

## Checkpoint 1.06: Growing-transition Weber-edge reciprocal channel theorem

Checkpoint 1.06 is a theorem-only, edge-reciprocal-channel-only package.  It
creates no source lock or numerical artifact and preserves every earlier
fail-closed boundary.  Its frozen theorem is
`notes/GROWING_TRANSITION_WEBER_EDGE_RECIPROCAL_CHANNEL_THEOREM.md`, with an
exact standard-library regression in
`tests/test_growing_transition_weber_edge_reciprocal_channel_theorem.py`.

All synthesis, positive-tail orthogonality, `D`-normalization, and exterior
operator statements are restricted to one fixed Fourier phase; the project
application is the plus family `nu=0 mod 4`.  The scalar transform theorem,
however, holds for every real `alpha` with `|alpha|<=B`.  The exact affine
change of variables gives

\[
 \tau_m(u)=m u+c(m-1),\qquad
 A_c=-{d\over du}\left((2u+u^2/c){d\over du}\right)-(2u+u^2/c),
\]

and every non-equality reciprocal stationary branch in the edge window has
the unshifted sampler index `m=1`.  The regular flat-edge solution and Abel
multiplier are

\[
 w_{0,\alpha}(u)=e^{iu}
 {}_1F_1\left({1\over2}-{i\alpha\over4};1;-2iu\right),\qquad
 F_0(N,\alpha)={-i\over\sqrt{N^2-1}}
 e^{i\alpha\ell_N/4},
 \quad \ell_N=\log{N+1\over N-1}.
\]

For the actual edge equation the Abel transform satisfies the exact ODE

\[
 (N^2-1)F_c''+[2N+2ic(1-N^2)]F_c'
 +(c\alpha-2icN)F_c=0.
\]

The corrected terminal-Volterra bootstrap retains all of the
`B/N^2+B^2/N^3+B^3/N^4` source and
`B/N^2+B^2/N^3` feedback terms.  It proves, when
`c>=c_0(1+B)^3`,

\[
 F_c=F_0G_c,\qquad
 |G_c-1|+N|\partial_NG_c|
 \leq {C(1+B)^3\over cN^2}.
\]

This yields the stated dyadic carrier-removed multiplier variation and the
exact locked parity: odd `l` produces the frozen `chi_4(n)` carrier, while
even `l` has the scalar reciprocal gain uniformly over the real spectral
window.

The pointwise far half density
`{c(N^2-1)}^(-1/2)` is not an operator factorization.  The actual Jost
coefficient is evaluated at `Nu+c(N-1)`, and coherent Mellin packets prevent
a global replacement of `A_c` by `A_0`.  Thus the required cutoff-uniform
weighted-composition factorization and its adjoint remain open.  In
particular, checkpoint 1.06 proves no complete
`c^(-1/2)(N^2-1)^(-1)` actual-channel decay, absolute summability, or `o(L)`
operator estimate.  It also proves no subcritical bulk commutator, complete
same-side floor, reflected estimate, full `Sigma`, endpoint-sheared floor,
`P_0` comparison, residual action, physical high/cross reduction, equation
(5.2), determinant limit, RH conclusion, or Lambda bound.  The formal state
remains `P0_INVALIDATED`.

The checkpoint-1.06 module passes `13/13`; together, the seventy-four
checkpoint-0.71 through checkpoint-1.06 frontier modules pass `807/807`.
Canonical and raw worktree discovery both contain `2329` tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a complete
canonical `2329`-test recount is pending.

## Checkpoint 1.07: Deterministic edge--edge higher-alias compression

Checkpoint 1.07 is a theorem-only package for the deterministic finite-Fejer
aliases `|h|>=2`.  It creates no numerical artifact or source lock.  Its
frozen theorem and standard-library regression are
`notes/GROWING_TRANSITION_EDGE_EDGE_HIGHER_ALIAS_THEOREM.md` and
`tests/test_growing_transition_edge_edge_higher_alias_theorem.py`.

The space is strictly the unsheared, defect-whitened, fixed plus phase
`nu=0 mod 4` with `|alpha_nu|<=B=(log L)^4`.  If

\[
 \widehat K(h)={1\over4\sqrt h}T^*D_h\mathcal F_+T,
 \qquad S_h=\widehat K(h)+\widehat K(-h),
\]

the unilateral block is never assigned a scalar prolate eigenvalue.  The
exterior-cutoff identity `F_+^*D_h^*=D_hF_+^*` first pairs the two aliases,
after which the full even exterior relation gives the exact factor `1/4`
and the affine far row `q_beta(hu+c(h-1))`.  The `h=1` audit correspondingly
has Hermitian part `-chi_beta/8`.

Global and far Liouville--Green energy variation, the frozen exact `F_c`
channel, Wiener splitting, physical Bessel synthesis, and the uniform
endpoint bound give

\[
 \sum_{h\ge2}\|P_BS_he_\beta\|
 \le C\{1+(1+B)^3+(1+B)^6/c\}.
\]

The Bonami--Karoui action bracket and the two transition action-length
bounds give `Q_B=O(L(1+B))`.  Therefore the symmetric finite-Fejer
edge--edge compression is uniformly Hilbert--Schmidt

\[
 O\!\left(\sqrt{L(1+B)}
   \{1+(1+B)^3+(1+B)^6/c\}\right)
 =O\!\left(\sqrt L(\log L)^{14}\right)=o(L).
\]

Bonami--Karoui arXiv:1405.3676v2 is an explicit primary dependency for the
rank bracket, but it is unvendored and not source locked.  The theorem does
not include the retained supercritical interval `-C_0L<=alpha<-B`, endpoint
shear, edge--bulk or bulk--edge terms, the raw prime discrepancy `R_D`, any
complete reflected or same-side operator, full `Sigma`, `P_0`, a signed
floor, residual action, physical high/cross reduction, equation (5.2), a
determinant limit, RH, or a Lambda bound.  The formal state remains
`P0_INVALIDATED`.

The checkpoint-1.07 module passes `12/12`; the seventy-five
checkpoint-0.71 through checkpoint-1.07 frontier modules pass `819/819`.
Canonical and raw discovery both contain `2341` tests.  The last complete
repository suite remains checkpoint 0.70 at `1522/1522`; a complete
canonical `2341`-test recount is pending.

## Checkpoint 1.08: Complete central-form reduction and spectral erratum

Checkpoint 1.08 is an exact-reduction and non-mutating-erratum package.  It
creates no numerical artifact or source lock.  Its frozen files are
`notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md`,
`tests/test_growing_transition_complete_central_form_reduction.py`,
`notes/OUTER_OUTER_SPECTRAL_THEOREM_ERRATUM.md`, and
`tests/test_outer_outer_spectral_theorem_erratum.py`.

For the complete admitted plus-phase synthesis, including label `8`, every
rest and anchor row, and every cross entry, put

\[
 X=C_\lambda K,\qquad p=P_NX,\qquad P=X-p,
 \qquad O=(1-C_\lambda)K.
\]

The exact two-sided radical and source-core identities give

\[
 \Sigma_N=\mathcal W_Z(O+P,O+P),\qquad
 \mathcal W_Z(O,O)=Q_X:=q_\lambda(X,X),
\]

and, with all signs and the single surviving `P--P` copy retained,

\[
 \Sigma_N-Q_X
 =-q_\lambda(p,P)-q_\lambda(P,p)-q_\lambda(P,P).
\]

The growing transition sampling bounds then imply the full-metric Loewner
estimate

\[
 -\delta_qD_{\rm full}\preceq\Sigma_N-Q_X
 \preceq\delta_qD_{\rm full},
\]

where

\[
 \delta_q=2\sqrt{B_{{\rm out},q}B_{{\rm proj},q}}
              +B_{{\rm proj},q}
 =O\!\left(q\operatorname {poly}(\lambda,\log\lambda)
 e^{-M_{2400}\lambda^2}\right),
\]

and

\[
 M_{2400}=4800\log2-{160\pi\log96\over\log2}
 =17.143296058960234\ldots>0.
\]

This estimate survives the endpoint shear by one congruence of both the
signed form and the complete exterior metric; no shear-coefficient bound or
block-diagonal metric replacement is used.  The exact divisor masks also
give `G_M=R+C_R+C_L+B` and hence
`-2(G_M-B)=-2G_M+2B`.  Thus the both-miss term stays inside the complete
outer--outer prime fold.  It is indefinite and is not a projection error;
only the complete pole--Archimedean--minus-prime radical identity identifies
the physical outer form with `Q_X`.

The accompanying erratum preserves the historical bytes and source-lock
hashes of `notes/OUTER_OUTER_SPECTRAL_THEOREM.md`.  Its correct signed
diagonal summand is

\[
 F(s_\rho)\overline{F(\overline{s_\rho})}.
\]

For a real-even source this equals `F(s_rho)^2`, not an absolute square, and
is indefinite off the critical line.  Every historical absolute-value
bound, constant, `o(d_8)` conclusion, and absolute Ritz-energy conclusion
remains valid because the proof first applies
`2|ab|<=|a|^2+|b|^2` to the same two sampling slots.  No positivity may be
inferred from real-even symmetry.

The sole complete signed analytic target is now the unprojected central form
`Q_X` on the whole admitted transition span.  A conductor-preserving bound
`Q_X-E_eq >= -o(L)D_full` is sufficient but is not claimed necessary.  The
project-minimal target remains the fixed-`mu_0` singleton/P0 Schur gate.
Neither target is proved.  There is no complete central or `Sigma_N` floor,
singleton Schur floor, `P_0` comparison, residual action, physical high/cross
reduction, equation (5.2), determinant limit, RH conclusion, or Lambda
bound.  The formal state remains `P0_INVALIDATED`.

The two checkpoint-1.08 modules pass `15/15`; the seventy-seven
checkpoint-0.71 through checkpoint-1.08 frontier modules pass `834/834`.
Canonical and raw discovery both contain `2356` tests.  The last complete
repository suite remains checkpoint 0.70 at `1522/1522`; a complete
canonical `2356`-test recount is pending.

## Checkpoint 1.09: Conditional bulk floor and post-core obstruction gates

Checkpoint 1.09 freezes five theorem/obstruction packages and creates no
numerical artifact or source-lock JSON.  The complete-central Plemelj module
derives the correct one-sided sampler traces, retains both boundary rows, and
identifies the logarithmic boundary--bulk completion.  Conditional on the
explicitly unproved complete physical assembly `PA` and on external input
`EH`, its bulk fibers are

\[
 \mathcal P_x=I+iM_x,
 \qquad
 \|M_x\|\leq {8\over9}e^{10/\alpha_0},
\]

so their conditional floor is
`1-(8/9)exp(10/alpha_0)`.  The Preissmann--Leveque/Preissmann weighted-Hilbert
input behind `EH` is unvendored, unhashed, and not a binding source lock.
The module does not prove `PA` or a floor for `Q_X`.

The both-miss reciprocal-core module proves the exact center identity

\[
 B_N=G_N-2\log N+\Lambda(N),
\]

the Landen phase and Maslov sign of the first reciprocal alias, the exact
paired normalization `S_1=-mathsf X/4`, and the favorable internal constant
piece `(-2L)S_1=(L/2)mathsf X`.  That piece belongs inside `PA`; it cannot be
added after a completed Plemelj floor.  True mask transitions are ordinary,
but their cutoff-uniform signed sum is not proved.

The post-Plemelj action reduction gives a dimension-free sequence estimate:
after the physical Plemelj boundary is removed, diagonal `L1` control and a
second action-derivative BV seminorm control the regular bulk operator with
constant `4/27`.  The hard-end Hankel--Christoffel--Darboux projector removes
a spurious dimension loss, but the exact LG multiplier and arithmetic mask
still require a scalar hypothesis.  The finite-Fejer companion proves that
subtracting the limiting `2L` core under `sup_M` is false.  At finite cutoff,

\[
 C_M(N)=2\omega_M(1)\ell_M(N)-\omega_M(1)^2\Lambda(N),
\]

and `C_1(N)=Lambda(N)/4`.  One must use cutoff-matched `PA_M` or take the
sampler limit first.  Atomic mask jumps require a Stieltjes transition
estimate; ordinary `Var(q'_M)` does not contain them.

Finally, the edge Carleman scattering module proves an obstruction for an
isolated local Weber channel.  Its exactly whitened two-energy Hermitian
minor is negative and its flat local kernel has arbitrarily large negative
index.  This is not a counterexample to `Q_X`, `PA`, or a complete edge
floor.  It proves that the upper conjugated-Hilbert coefficient must cancel
in the complete pre-shear assembly, factor through killed rows, or be
controlled together with another same-order channel; branchwise positivity
or branchwise `o(1)` is insufficient.

All five packages are fail-closed.  `PA`, `EH`, the ordered scalar arithmetic
gate `SB`, the hard `m_a` composition, complete pre-shear Weber cancellation,
edge--bulk and anchor crosses, a full central floor, the fixed-`mu_0`
singleton/`P_0` Schur gate, equation (5.2), determinant control, RH, and every
Lambda bound remain open.  The formal state remains `P0_INVALIDATED`.

The five checkpoint-1.09 modules pass `56/56`; the eighty-two
checkpoint-0.71 through checkpoint-1.09 frontier modules pass `890/890`.
Canonical and raw discovery both contain `2412` tests.  The last complete
repository suite remains checkpoint 0.70 at `1522/1522`; a complete
canonical `2412`-test recount is pending.

## Checkpoint 1.10: Direct-source slot bridge and scalar assembly gates

Checkpoint 1.10 freezes three theorem/gate packages and creates no numerical
artifact or source-lock JSON.  The Xi-Wronskian package isolates the
finite-Fejer ordered commutator.  In the absolute-convergence half-plane its
pure-carrier candidate is

\[
 {2Z_M(s)Z_M(t)\over s-t}
 \left\{{\xi_R'\over\xi_R}(s)-{\xi_R'\over\xi_R}(t)\right\},
\]

with the mandatory `1/(g(s)g(t))` factor after the ordered sampler limit.
It also proves the exact retained-last-boundary correction and shows that the
finite sampler is not the Christoffel--Darboux numerator of `gZ_M`.  At that
stage the formula is an assembly target: scalar masks determine carrier signs
but not physical inward/outward slots.

The locked-carrier package proves `exp(icN)=i^N`, the convergent Weber power
series for every `N>=2`, the exact modulo-four von Mangoldt transforms with
their two-adic corrections, and the finite-Fejer twisted moment expansion.
It is a flat scalar identity for `sigma>0`.  It does not suppress the possible
`s=1` pole, take `sigma` to zero or `M` to infinity, promote through the Jost
coefficient and cutoff, or prove an operator bound.

The direct-source package closes the missing ordered physical-slot bridge at
`M=infinity` without assigning scalar masks.  Both physical boundaries give
the same `X_j -> O_k` upper slot, the adjoint gives `O_j -> X_k`, and the
source formula fixes the pole--Archimedean--prime signs as `(-,+,+)` and the
ordered prime triple as `m` on the left and `ln` on the right.  It validates
the pure-carrier Xi logarithmic-derivative core together with the exact
finite-`L` tail.  A finite-`M` pair is only the ordered cross regularization
`-W_Z(X_M,O_M)`, not two pieces of a global radical; it need not be Hermitian
before averaging and must not be identified with `q_lambda(X_M,X_M)`.

The local Archimedean `1/r` principal survives on the full profile space.
This identifies the remaining task as a complete source-level transition
operator estimate after restriction to the actual growing columns; it does
not prove cancellation or a floor on that compression.  `PA`, the unvendored
and unhashed external input `EH`, the full transition operator estimate,
complete Weber-edge cancellation, edge--bulk and anchor crosses, critical
boundary values or continuation of the tails, a whole-span central floor,
the fixed-`mu_0` singleton/`P_0` Schur gate, residual action, equation (5.2),
determinant control, RH, and every Lambda bound remain open.  The formal state
remains `P0_INVALIDATED`.

The three checkpoint-1.10 modules pass `36/36`; the eighty-five
checkpoint-0.71 through checkpoint-1.10 frontier modules pass `926/926`.
The exact `replay.sh` unittest block, including its twelve checkpoint-0.66
through checkpoint-0.70 support modules, passes `1054/1054` in `2632.278`
seconds.
Canonical checkpoint-1.10 discovery contains `2448` tests.  Raw worktree
discovery contains `2470` because two immutable but unintegrated
post-checkpoint modules contribute exactly `22` excluded tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a complete
canonical `2448`-test recount is pending.

## Checkpoint 1.11: Ordered two-jet shear and higher-sampler scalar gate

Checkpoint 1.11 freezes two theorem/gate packages and creates no numerical
artifact or source-lock JSON.  The ordered direct-profile package first
invalidates the finite-Fejer continuation
`a_M(L+t)=lambda b_M(t)`.  After the prescribed ordered unweighted Poisson
limit, the identity does hold on `eta(f)=f(lambda)=0`.  Its singular upper
cross is then a separated off-diagonal Cauchy block with paired positive and
negative inertia, not a positive Carleman square.

On the corrected fixed labels `8,12`, the pulled-back `D`-white endpoint map
for

\[
 \eta(f)=f(\lambda),\qquad
 \rho(f)=-{2\lambda\over c}f'(\lambda)-c f(\lambda)
\]

converges, after the stated scalar normalization, to

\[
 \begin{pmatrix}1&1\\-17&-25\end{pmatrix},
\]

whose determinant is `-8`.  This gives an eventually stable two-jet anchor
for `eta=rho=0`, equivalently `eta=kappa=0`, without the earlier unproved
sampler-trace determinant.  Here `rho` is the source endpoint-jet row, not
the outward test row `beta_0-lambda beta_L`.  After `eta=0`, the complete pair
of internal second-derivative atomic families factors through
`kappa=f'(lambda)`; its
Hermitian part has rank at most two and its rest--rest compression vanishes
after the shear.  The next `q=3` row contains the uncontrolled `alpha^2`
moment.  An anchor floor of order `L` therefore needs only an `o(L)`
anchor--rest cross for `o(L)` Schur erosion; `o(sqrt(L))` is the stronger
threshold needed for `o(1)` erosion.

The higher-sampler package keeps every coherent pair `m,l>=2`.  Its exact
affine Abel corner is a difference of two positive Cauchy Grams and can be
negative.  Nevertheless, the coherently summed physical affine compression
is `O(1)` in exterior-defect coordinates, using

\[
 \sum_{m,l\geq2}{1\over ml(m+l)}=2\zeta(3)-{3\over2}.
\]

For the curved regular block, the `x>=1` geometry is a completely positive
Loewner contraction with dimension-free projective variation.  The full
conditional conclusion still requires the cutoff-matched scalar seminorm
`mathfrak S^sharp_{>=2}(L)=o(L)`, including the exact `m_a`-weighted hard
factorization on `x<1`.  Constant-amplitude unweighted modulo-four residues
cancel at `s=1`; the corresponding finite-Fejer coefficient generally does
not, so this identity does not prove the scalar gate.

These are fail-closed reductions.  They do not prove `PA`, kill the retained
sampler trace `Gamma`, control the `q=3` or Volterra rows, prove the hard
factorization/scalar seminorm, bound the coherent `q=2` row in the pulled-back
`D` metric, complete the whole-profile Mellin/Bernoulli frame, handle any
`m=1` or `l=1` channel, cancel the Weber edge, control edge--bulk/anchor
crosses or the raw prime discrepancy, or prove a whole-span central floor.
The fixed-`mu_0` singleton/`P_0` Schur gate, residual action, equation (5.2),
determinant control, RH, and every Lambda bound remain open.  The formal state
remains `P0_INVALIDATED`.

The two checkpoint-1.11 modules pass `23/23`; the eighty-seven
checkpoint-0.71 through checkpoint-1.11 canonical frontier modules pass
`949/949` in `188.752` seconds.  The exact `replay.sh` unittest set, including
its twelve checkpoint-0.66 through checkpoint-0.70 support modules, passes
`1077/1077` in split fresh frontier/support runs totaling `2636.181` seconds.
Canonical checkpoint-1.11 discovery contains `2471` tests.  Raw worktree
discovery contains `2493` because two other immutable but unintegrated
post-checkpoint modules contribute exactly `22` excluded tests.  The last
complete repository suite remains checkpoint 0.70 at `1522/1522`; a complete
canonical `2471`-test recount is pending.

## Checkpoint 1.12: Realized two-cluster packet and forced-cancellation wall

Checkpoint 1.12 freezes nine strict-PASS packages, one of them a new
binding primary-source lock.  It does not promote the local packet to a
negative complete central form.

The complete affine flat-Weber calculation gives the exact canonical
zero-residue formula, including the exterior rapidity completion and the
two conductor-collar saddles.  Functional-equation quartets realify the
formula but do not turn its difference of Grams into a positive Gram.  This
is an affine obstruction theorem only: the full prime shell has macroscopic
finite-`c` curvature, so no physical shell estimate follows from fixed
flat-Weber convergence.

For the physical continuous `m=l=1` block, the repaired narrow-schedule
theorem proves an `m`-dimensional raw negative packet of size

\[
 {e^{hCL}\over L^{2m-1}}
\]

under its explicit strict exponent margins.  The radial theorem controls
`(chi_gamma z_gamma)^2`, not `z_gamma^2`; consequently the exact forward
physical pair factor is

\[
 {\lambda\over4c}(1+\chi_\alpha)\chi_\beta z_\alpha z_\beta
 = {\pi(1+\chi_\alpha)\over
     8\chi_\alpha\sqrt{J_\alpha J_\beta}}\{1+o(1)\}.
\]

The curved two-endpoint theorem separately proves that the complete local
`m=l=1` prime shell, including its `n>A` tail, is lower order at the raw
continuous scale.  The polylog-base corollary makes both conclusions uniform
when the lower cluster is polylogarithmic and retains the leakage gate
`inf chi_gamma>0` before claiming exterior-defect-white scaling.

That leakage gate is then discharged for actual same-phase PSWF rows.  The
new Bonami--Karoui source lock vendors arXiv:1405.3676v2 and binds Theorem 1
to the action bracket

\[
 {\pi n\over2}<\sqrt{\mu_n}\,
 E\!\left({c\over\sqrt{\mu_n}}\right)<{\pi(n+1)\over2}.
\]

Together with the locked KRD leakage estimate, this yields distinct labels
`n_gamma=0 mod 4` with

\[
 |\widehat\gamma-\gamma|\le {24\pi\over L},\qquad
 d_{n_\gamma}\le 10e^{-\pi\gamma/64},\qquad
 \chi_{n_\gamma}\longrightarrow1.
\]

For these realized rows the exact exterior-defect-white physical pair is
`pi/(4 sqrt(J_alpha J_beta)){1+o(1)}=Theta(L^-1)`.  The source row plus the
two Plemelj rows cost at most three dimensions; adding the endpoint value
and derivative rows raises the inventory to at most five.  This is only a
finite-row realization statement, not a complete-source congruence.

The complete central identity and absolute sampling theorem impose the new
decisive consistency wall.  For fixed modal count `q`, if
`Q_loc<=-tau_L I` on a realized row-null subspace and
`R_comp=Q_X-Q_loc`, then

\[
 P_E R_{\rm comp}P_E\succeq
   (\tau_L-B_{{\rm out},q})P_E,
 \qquad B_{{\rm out},q}=c^{1/2+o(1)}.
\]

For `tau_L=c^{hC+o(1)}/L^{2m}` and `hC>1/2`, the complete omitted assembly
must therefore contribute a positive compression `(1-o(1))tau_L`.  A proof
cannot both retain this local negative packet and show every mixed,
full-profile, equality, transition, midpoint, and retained-row sector is
`o(tau_L)`.  The remaining task is a coherent signed whole-profile
assembly, not an all-remainders-small estimate.

The local direct block is not a literal summand or compression of the
equality conductor.  The local representative is the inward--outward cross
`-W_Z(X,O)` with factor `(1+chi_j)chi_k`; the equality representative is the
outward--outward form `W_Z(O,O)` with factor `chi_j chi_k`.  Their multiplier
ratio `1+1/chi_j` tends to `2` on the realized rows, but their kernels and
quadrant orientations differ.  On the common plus-family, strict-label-range,
zero-integral synthesis where the frozen equality theorem applies, its
Garding floor therefore gives only a formal matrix comparison, not a
physical remainder decomposition.
The same-prime equality term has nonpositive form sign and cannot by itself
supply the forced positive compression.

Within one common ordered direct representative, the complete
pole--Archimedean kernel is exactly

\[
 k_{\rm cont}(r)={1\over\sinh r}-2(1+e^{-r})
 =-2+2\sum_{\nu\geq1}e^{-(2\nu+1)r}.
\]

The apparent Laplace row at `z=1` therefore cancels.  The remaining
continuous mixed/full-profile block is an exact norm-absolutely convergent
odd-Laplace row assembly at fixed finite Fejer cutoff, in the required
ordered limits.  Every cross row is a difference of positive Grams, so this
identity has no hidden sign.  On the exact double-null subspace, the complete
inward and outward corner traces vanish and the mixed/full axes cancel the
local constant conormal trace, but growing first jets prevent promotion to a
uniform bound.

On the realized polylogarithmic packet, where modal placement supplies
`chi_gamma->1` and the polylog corollary controls the white local prime
shell, removing that `(1,1)` shell localizes forced compensation to the
exact continuous remainder plus the ordered non-`(1,1)` prime assembly.
Their sum has the required positive compression for `hC>1/2`; neither
summand is proved positive or even one-sided small.  This localization
remains a signed whole-profile gate, not a central-sign theorem.

Checkpoint 1.12 explicitly excludes four raw-worktree modules.  The two
checkpoint-1.11 exclusions remain the fixed-8/12 sampler-row determinant
candidate (`10` tests) and the direct-source two-anchor bulk-trace candidate
(`12` tests).  The finite-`c` subunit Weber package, hashes beginning
`144051cd`/`3edab986`, is rejected, and the conditional continuous negative
packet, hashes `0ec602eb...`/`584a8083...`, is superseded by the repaired
unconditional theorem.  The old continuous hashes beginning
`3928...`/`125ac...` and old modal hashes beginning `681a...`/`a479...` are
also superseded and are not frozen.  The failed odd-Laplace pair beginning
`671d3140...`/`d06c7ff9...` is superseded by the admitted repaired pair.

The post-checkpoint-1.11 raw inventory is exactly eleven modules and `139`
tests: the nine admitted modules contribute `113`, while the rejected
subunit and superseded conditional-packet modules contribute `26`.  Together
with the two carried checkpoint-1.11 exclusions (`22` tests), this accounts
for every raw-worktree module outside the canonical frontier.

The nine admitted checkpoint-1.12 modules pass `113/113`.  The ninety-six
checkpoint-0.71 through checkpoint-1.12 canonical frontier modules pass
`1062/1062` in fresh split runs.  The unchanged twelve-module checkpoint-0.66
through checkpoint-0.70 support block passes `128/128` in `2421.457` seconds,
so the exact 108-module `replay.sh` unittest set passes `1190/1190` across
the split fresh runs.  Canonical discovery contains `2584` tests, while raw
worktree discovery contains `2632`; the difference is exactly the four
explicit exclusions totaling `48` tests.  The last complete repository suite
remains checkpoint 0.70 at `1522/1522`; a complete canonical `2584`-test
recount is pending.  No
complete Plemelj assembly, whole-profile cancellation theorem, central sign,
singleton/`P_0` Schur floor, residual action, equation (5.2), determinant
limit, RH, or Lambda bound follows.  The formal state remains
`P0_INVALIDATED`.

## Checkpoint 1.13: Ordered-sector feature geometry and the mixing gate

Checkpoint 1.13 advances both physical sectors without assigning either one
the forced positive compression.

At finite Fejer cutoff, the prime remainder after deleting only the local
`(m,l)=(1,1)` triples retains the ordered inward index `m` and outward index
`ln`.  The resonance `ln=m` is an exact positive exterior Gram.  On a fixed
`q` realized packet its exterior-white compression satisfies

\[
 0\preceq \widehat Q_{{\rm res},M}
 \preceq O_q(L^2)I=o(\tau_L)I
\]

uniformly in the cutoff, so the resonance cannot supply the forced
exponential compensation.  The nonresonant ordered prime block remains an
exact difference of positive Grams with no proved sign.  Moreover,

\[
 -\mathcal W_Z(X_M,O_M)
 =\mathcal W_Z(O_M,O_M)-\mathcal W_Z(K_M,O_M),
 \qquad K_M=X_M+O_M,
\]

and `K_M` is not a radical at finite cutoff.  Outer-only POST masks,
midpoint rows, sharp atoms, and the hard patch therefore cannot be pasted
into the direct form while dropping the complete
pole--Archimedean--prime radical defect.

For the continuous block, the complete ordered inward profile obeys
`a_f(L-s)=lambda exp(-s)a_f(s)`.  Conjugation by `exp(-s/2)` produces an even
centered multiplicative theta profile whose Fourier transform is the
symmetrized `zeta(s)M_f(s)` Mellin product.  Every odd row `z=3,5,...` is an
exact, scale-free cross between generalized-harmonic and Hurwitz-zeta-tail
features, and the low rows continue through `z=1` and `z=0` under the stated
source nulls.  Complete monotonicity controls the positive block Gram but not
its off-diagonal Hermitian cross.  High odd rows are asymptotically
anti-aligned at fixed `lambda`; the error is not uniform in the
growing-transition limit.  Hence neither a continuous sign nor a
contradiction to the desired lower bound follows.  The remaining continuous
obligation is a finite-dimensional exterior-white feature-angle inequality.

The global radical gives the pointwise paired-zero identity

\[
 ZK=0,\qquad ZX=-ZO.
\]

Thus the physical `X` and `O` zero features are exactly antipodal, with
positive Gram block `[[A,-A],[-A,A]]` and signed block
`[[Q,-Q],[-Q,Q]]`.  The finite-cutoff continuous and finite-prime-truncation
rows instead give artificial source Krein factorizations.  The ordered
source/Abel limit recovers the signed pullback `Z_O^*Sigma Z_O`, but the
positive norm of a generic nonzero repeated inward row in the untruncated
raw prime feature diverges.  No frozen
identity matches a source positive Gram to `Z_O^*Z_O`; no feature-space
isometry follows, and `K_M` is not a radical at finite cutoff.

An orthogonal pole--Archimedean--prime feature decomposition carrying the
current local block would force `tau_L<=B_out,q`, contradicting the strict
forced-cancellation regime `hC>1/2`.  The required completion must mix
sectors in the positive Hilbert metric.  The exact missing object is a
sector-resolving Krein intertwiner together with its non-block-diagonal
positive cross-sector Gram.  A twin finite-dimensional model preserves the
frozen signed identities and primitive row magnitudes while moving the
forced compensation between the continuous remainder and the nonresonant
prime frame, so those identities alone do not select a sector sign.

The three admitted checkpoint-1.13 modules are internal and add no external
source or numerical artifact.  The earlier global-radical pairs beginning
`beacf9d4...`/`c83618d8...` and `a96c9940...`/`0a53f576...` failed strict
audits and are superseded by the admitted repaired pair.  The four
checkpoint-1.12 raw exclusions remain unchanged and contribute exactly `48`
tests.

The three modules pass `41/41`.  The ninety-nine checkpoint-0.71 through
checkpoint-1.13 canonical frontier modules pass `1103/1103`; with the
unchanged twelve-module support block at `128/128`, the exact 111-module
`replay.sh` unittest set passes `1231/1231`.  Canonical discovery contains
`2625` tests and raw worktree discovery `2673`.  No nonresonant prime-frame
sign, continuous feature-angle bound, sector-resolving intertwiner, complete
Plemelj assembly, central sign, singleton/`P_0` Schur floor, equation (5.2),
determinant limit, RH, or Lambda bound follows.  The formal state remains
`P0_INVALIDATED`.

## Checkpoint 1.14: Renormalized packet intertwiner and the middle-band wall

Checkpoint 1.14 constructs a scoped feature map only on a fixed,
endpoint-null source packet and identifies why neither that construction nor
a generator-level positivity assertion closes the physical sign problem.

On a fixed finite packet satisfying the source, integral, and endpoint nulls,
the ordered-prime gauge

\[
 r_{m,l,n}={m\over ln},\qquad
 \mathcal A'_{m,l,n}=r_{m,l,n}\mathcal A_{m,n},\qquad
 \mathcal B'_{m,l,n}=r_{m,l,n}^{-1}\mathcal B_{ln,n}
\]

preserves every cross term exactly.  Unlike the raw gauge from checkpoint
1.13, its complete unweighted positive feature norm is summable at each fixed
`lambda`.  Together with the endpoint-null continuous odd tower it gives a
genuine direct-sum source Krein map `T` with continuous part `T_c` and prime
part `T_p`.  After quotienting the finite coefficient packet by the
source-synthesis kernel, the explicit
Moore--Penrose map

\[
 U_0=Z_OT^\dagger
\]

is bounded and satisfies `U_0T=Z_O` and equality of the signed forms on
`ran T`.  Its positive pullback is the packet-dependent metric

\[
 G_0=T^{\dagger *}(Z_O^*Z_O)T^\dagger,
 \qquad T^*G_0T=Z_O^*Z_O.
\]

This is an endpoint-null, finite-packet completion.  It is not a uniform
growing-`lambda` estimate, a canonical generator-level extension, or an
operator identity on the whole source feature space.  It proves no
continuous or prime-sector sign.

The complete infinite-half-line carrier clarifies the generator-level
obstruction.  Its paired Hadamard factorization is complex-symmetric and has
the binding minus sign

\[
 2Z(s)Z(t){F(s)-F(t)\over s-t}
 =-\sum_\rho {\sqrt2 Z(s)\over s-\rho}
              {\sqrt2 Z(t)\over t-\rho}.
\]

It is not a positive Hermitian Gram.  In the critical variable, positivity
of the corresponding Pick kernel on the entire upper half-plane is
equivalent to every zero of `Xi` being real, hence to RH.  A global
generator-positive metric therefore cannot be imported as an unconditional
lemma.  The realized source-integrated finite compression is strictly weaker
than that global assertion, and its sign remains open.  No density or
separation theorem is proved that would make the full asymptotic family of
such packet conditions RH-equivalent.

The continuous obstruction is concentrated in a nonuniform odd-row band.
For the exact flat Kummer product, the odd lattice is a Riemann
discretization of the local Cauchy kernel.  Rows

\[
 z=\Theta(c/L)
\]

contain a fixed fraction of the forward high--low mass, while the enlarged
band `3<=z<=c K log(L)/L` recovers the local two-cluster matrix in operator
norm below its smallest singular scale.  Deleting `z=1`, imposing any fixed
`r<m` source or endpoint rows, or using the fixed-`lambda` high-odd expansion
does not remove the whole negative packet.  Any favorable continuous
feature-angle estimate must instead prove coherent same-scale cancellation
with the generalized-harmonic and Hurwitz alias pieces.  This checkpoint
proves neither that cancellation nor reinforcement, and supplies no physical
counterpacket.

The first middle-band candidate, hashes
`ef43c753...`/`9d6e6f3d...`, failed strict audit because its Section 6
single-inward-row ratio omitted the fixed-linear base slope.  It is
superseded by the repaired admitted pair
`6863fd55...`/`7c0c1a4a...`; the failed bytes are not an additional raw
module.

All three checkpoint-1.14 packages are internal and add no external source,
source lock, or numerical artifact.  The three modules pass `40/40`.  The
102 checkpoint-0.71 through checkpoint-1.14 canonical frontier modules pass
`1143/1143`; with the unchanged twelve-module support block at `128/128`,
the exact 114-module `replay.sh` unittest set passes `1271/1271`.  Canonical
discovery contains `2665` tests and raw worktree discovery `2713`; the same
four explicit exclusions account for the `48`-test difference.  No uniform
sector-resolving intertwiner, continuous feature-angle sign, nonresonant
prime-frame sign, complete Plemelj assembly, central sign, singleton/`P_0`
Schur floor, equation (5.2), determinant limit, RH, or Lambda bound follows.
The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.15: Complete continuous negativity and forced prime compensation

Checkpoint 1.15 closes the physical generalized-harmonic/Hurwitz alias
problem on the fixed-dimensional realized packets, controls every odd row,
and identifies the ordered nonresonant prime frame that must compensate the
resulting continuous negative form.

The one-sided local theorem first proves the missing physical row estimates
directly, rather than inferring them from a two-sided Cauchy product.  Euler
summation then gives the exact completed-row identity

\[
 \mathcal A_z=C_z-\mathcal L_z-\lambda^{1-2z}\mathcal R_z,
 \qquad \mathcal B_z=\mathcal R_z,
\]

with the right-continuous endpoint convention and the empty-range formulas
retained.  The curved/hard completion keeps both Bernoulli jump measures,
including the reciprocal hard endpoint.  Uniformly over all selected high
and low nodes and over
`3<=z<=c K_0 log(L)/L`, `K_0>8m/C`, all three alias blocks are `o(T_L)`.
Thus, after the fixed row nulls,

\[
 P_E\widehat Q_{\rm full}^{I_L}P_E
 \preceq-{c'_m\over2}T_LP_E,
 \qquad T_L={e^{hCL}\over L^{2m}}.
\]

The complete odd-tail theorem controls the rows above that band without a
nonuniform growing-`lambda` jet expansion.  It subtracts the full local
block, requires the uncorrected modal local pole row
`\widehat{\mathcal A}^{1,mod}_0` to vanish, and estimates only the ordered
alias slots.  The corrected origin bump is used only on the positive odd
rows; no false `c^(-1/2)` bound is assigned to its `z=0` modal row.  The
mesoscopic and `z>c` tails are `o(T_L)`, so on the surviving six-row-null
packet

\[
 P_E\widehat Q_{\rm cont}P_E
 \preceq-{c'_m\over4}T_LP_E.
\]

The prime conclusion is deliberately narrower.  On the realized
polylogarithmic-base schedule, with `1/2<hC<1`, one additional
pre-correction row `g(0)=0`, and `m>7`, the seven-row intersection is
nonzero.  In the exact ordered representative,

\[
 \widehat Q_X=\widehat Q_{\rm cont}+\widehat Q_{p,11}
              +\widehat Q_{\rm res}+\widehat Q_{\rm off}.
\]

Absolute sampling makes `Q_X=o(T_L)`, the frozen polylogarithmic shell
makes `Q_(p,11)=o(T_L)`, and ordered resonance is positive but only
`O(L^2)=o(T_L)`.  Consequently

\[
 P_E\widehat Q_{\rm off}P_E
 \succeq {c'_m\over8}T_LP_E.
\]

The reciprocal cross-preserving gauge supplies genuine fixed-`lambda`
positive Hilbert branches for this ordered nonresonant difference of Grams;
it does not create a growing-`lambda` raw-feature limit.  A further dyadic
theorem localizes the compensation without regrouping the ordered indices.
For `sigma=hC` and any fixed `delta>0`, the complement of

\[
 n\leq c^{5-\sigma+\delta},\qquad
 m,l\leq c^{4-\sigma+\delta}
\]

is `o(T_L)`.  The retained triples occupy `O(L^3)` ordinary coordinate
dyadic boxes, so at least one box has a positive eigenvalue of order
`T_L/O(L^3)`.  This is an eigenvalue/direction conclusion, not a Loewner
lower bound for one box.

Several same-path candidates are disclosure-only supersessions.  The Euler
pair `045e1e1b...`/`70b6d3b7...` failed strict audit.  The first curved pair
`7ed2fed9...`/`80cb2a81...` did not consume the alias error in its final
constant and is replaced by the admitted half-constant theorem.  The first
full-tail pair `db40ed98...`/`78bbaae7...` used a false modal `z=0` pole
bound; the intermediate note `5daccdeb...` was then superseded by the
literal hard-endpoint scale correction.  The forced-prime pair
`198a918f...`/`3db15eeb...` incorrectly promoted a raw ordered Gram to a
limiting Hilbert feature and is replaced by the renormalized branch theorem.
Because all these bytes were overwritten at the same paths, none is an
additional raw module.

All six checkpoint-1.15 packages are internal and add no external source,
source lock, or numerical artifact.  They pass `91/91`.  The 108-module
checkpoint-0.71 through checkpoint-1.15 canonical frontier passes
`1234/1234`; with the unchanged twelve-module support block at `128/128`,
the exact 120-module `replay.sh` unittest set passes `1362/1362` across the
fresh frontier and unchanged support runs.  Canonical discovery contains
`2756` tests.  Current raw discovery contains `2831`: the four carried
excluded modules contribute `48`, while the post-checkpoint hard-tail
PNT/Gram and far-annulus large-sieve candidates contribute `12` and `15`
tests.  Both are explicitly unadmitted and reserved for later checkpoints.
No fixed-linear forced-prime theorem, boxwise Loewner sign,
complete central sign, singleton/`P_0` Schur floor, equation (5.2),
determinant limit, RH, or Lambda bound follows.  The formal state remains
`P0_INVALIDATED`.

## Checkpoint 1.16: Hard-tail removal and coherent edge discrepancy

Checkpoint 1.16 admits the hard-tail and far-annulus candidates reserved by
checkpoint 1.15, closes the transition band with an exact regular-Bessel
fold large sieve, and controls every outward sampler in the complete
coordinate set `m>A,n>A`.  All statements retain the ordered finite-Fejer
and prime-cutoff limits at fixed `lambda`.

For `T_nx(u)=H_x(nu)`, the exact `l=1` PNT--Gram identity separates a
positive lattice Gram, one von-Mangoldt discrepancy cross, and the positive
resonance diagonal.  No prime-number theorem is invoked.  The complementary
large sieves are

\[
 \left\|\sum_{A<n<2A}a_nT_n\right\|^2
 \ll {L^{K_0}\over\sqrt A}\sum|a_n|^2,
 \qquad
 \left\|\sum_{X<n\leq Y}a_nT_n\right\|^2
 \ll {A\log(2X)\over LX^2}\sum|a_n|^2
\]

for `2A<=X<Y<=2X`.  The first retains the true fold discriminant and
distinguishes its possible-row and coherent widths; the second uses the
exact exterior Pruefer carrier.  Elementary Chebyshev bounds suffice for
the arithmetic coefficients.

Grouping all `l>=1` rows only in the right slot gives

\[
 {\cal P}_A(k)=\sum_{n\mid k,\ n>A}\Lambda(n)\leq\log k.
\]

Hence, for `T_L=A^sigma/L^(2m)` and the binding strict range
`1/2<sigma<1`,

\[
 \|P_EQ_{>>}^{\rm raw}P_E\|+
 \|P_EQ_{{\rm off},>>}P_E\|=o(T_L).
\]

The proof fails closed at `sigma=1/2`.  Exact subtraction confines the
forced compensation to the disjoint edge union `m<=A or n<=A`.  Its moving
cross `Q_mov=(1/4)S(C,P)` satisfies

\[
 \|P_E(Q_{\rm mov}+Q_{\rm cont})P_E\|=o(T_L),
 \qquad P_EQ_{\rm mov}P_E\succeq {c'_m\over8}T_LP_E.
\]

This lower frame is inherited from complete matching, not from a
positive-square identity.  In logarithmic variables the density main
cancels the continuous pole and the imposed `A_0=0` row leaves exactly

\[
 \left.Q_{\rm mov}\right|_E
 =\left.S(\mathfrak a,{\cal V}_{\mu_D}\mathfrak b)\right|_E,
 \qquad
 \mu_D=\sum_{n\geq2}{\Lambda(n)\over n}\delta_{\log n}-dr.
\]

The coherent discrepancy feature is forced at scale `T_L`; it is not
bounded directly by a pointwise PNT or arithmetic discrepancy theorem.
The mixed-Weber ordinary-endpoint theorem shows why pairwise repair fails:
the truncated slow carrier can lose the completed `exp(-h_0 beta)` factor,
and no fixed endpoint jet restores it.  Legal endpoint cancellation occurs
only after the complete inward profile is formed and factors through
`Gamma_out=0`.

The superseded hard-tail `3630a07d...`/`45247498...`, edge
`ae3bdeb9...`/`921bd23d...`, moving-discrepancy
`99dcf547...`/`9dd2f775...`, and mixed-Weber
`845a7c27...`/`476ce209...` pairs occupied the same paths and add no raw
modules.  The seven admitted packages pass `91/91`; the 115-module
canonical frontier passes `1325/1325`; and the exact 127-module replay set
passes `1453/1453` with the unchanged twelve-module support block at
`128/128`.  Canonical discovery is `2847`, raw discovery is `2895`, and the
four carried exclusions account for the `48`-test difference.  No complete
central sign, singleton/`P_0` Schur floor, residual action, equation (5.2),
determinant limit, RH, or Lambda bound follows.  The formal state remains
`P0_INVALIDATED`.

## Checkpoint 1.17: Zero-orbit and lower-Ritz graph barriers

Checkpoint 1.17 admits exactly two post-checkpoint-1.16 strict-PASS
packages.  They sharpen the stopping point on the coherent discrepancy and
determinant routes; neither supplies a new sign or determinant limit.

The discrepancy package derives the canonical inverse-Laplace distribution

\[
 d\mu_D=C_*\delta_0-
 \sum_\rho^{\rm can}\{e^{-(1-\rho)r}dr+\rho^{-1}\delta_0\}
 +\sum_{\nu\geq1}\{(2\nu+2)^{-1}\delta_0-e^{-(2\nu+1)r}dr\}.
\]

The formal delta terms annihilate the finite convolution row before any
infinite sum is taken.  After the trivial-zero tower cancels the continuous
odd-Laplace contribution, the complete central form has an exact canonical
zero-row cross representation.  This rewrites the already-proved matching;
it is not an independent zero estimate.  A critical-line conjugate pair
collapses to a positive Gram only after the physical reflection relations
are imposed.  An off-line quartet has exchange signature, and no uniform
source-to-zero-row intertwiner is proved.  On the prime side, the outward
derivative retains a periodic-Bernoulli leading term and the corner row
`J_L`; an absolute-BV or termwise mixed-Weber estimate therefore does not
bound the required coherent Mertens correlation.

The determinant package uses the genuine lower two-vector Ritz shift

\[
 u={q+c-\sqrt{(c-q)^2+4r^2}\over2},\qquad B=A-uI,
\]

and retains `B>0` and `Q_--uI>0` only as hypotheses.  For an onto source
synthesis `W`, with `mathfrak B=W^*BW`, residual row `rho_R`, and Mellin
rows `y_z`, the lower-Ritz graph product is exactly

\[
 (\rho_R^*\mathfrak B^\dagger\rho_R)
 \sup_{z\in\Omega}(y_z^*\mathfrak B^\dagger y_z).
\]

It is sufficient but not minimal.  At the actual ground shift,
`mathfrak C=W^*(A-mu I)W`, the quotient identity gives, up to the fixed
inner-product convention,

\[
 a\widehat z_\mu(z)=-y_z^*\mathfrak C^\dagger\rho_R.
\]

Hence local uniform convergence only needs

\[
 \sup_{z\in\Omega}|y_z^*\mathfrak C^\dagger\rho_R|\longrightarrow0.
\]

Lower-Ritz geometry gives the exact first-factor decomposition
`<b,B^(-1)b>=d+chi_u`, where `d=q-u` and `chi_u>=0`, but no source upper
bound for `chi_u`.  The Mellin leverage remains independent.  A full
sampling comparison `mathfrak G<=C_R mathfrak B` and the row comparison
`y_z y_z^*<=C_E M_Omega(L)d_8^(-1)mathfrak B` would imply the sufficient
budget

\[
 {\epsilon_\lambda\over d_8}C_RC_EM_\Omega(L)\to0,
 \qquad
 {\epsilon_\lambda\over d_8}
 =O(\lambda^{-5}\operatorname {polylog}\lambda)+o(\lambda^{-8}).
\]

Neither comparison is proved.  The realized transition packet has no
proved capture or reducing relation with the cyclic forcing and Mellin
spans, and its positive prime frame cancels the continuous block at leading
order.  Exact lower-Ritz source-Cauchy and transition-noncapture models keep
both shifted signs while the graph product fails to tend to zero.  The
absolute-sampling shift `U_Z` is deliberately excluded: `q<=U_Z`, so signs
at `U_Z` imply the `q`-shifted signs, which are already RH-level on the
widening source core.

The rejected zero-orbit pair
`63f3091e...`/`75a3fe05...` shadowed the locked schedule exponent in its
probe formula, omitted the complex-domain and diagonal divided-difference
conditions, and overstated the number of integrations by parts needed for
the Bernoulli tail.  The rejected cyclic pair
`1d740658...`/`7a704466...` used `U=U_Z`, making its sign hypotheses
RH-level and its graph route redundant.  The repaired pre-audit cyclic note
`a60d5cf2...` was then superseded because it called the full Loewner
comparison equivalent to the strictly weaker row-specific `chi_u` bound;
its test bytes already had the final hash.  All are same-path historical
bytes and add no raw modules.

The two admitted packages pass `22/22`.  The 117-module canonical frontier
passes `1347/1347`; with the byte-unchanged twelve-module support block
pinned at its checkpoint-1.16 result `128/128`, the exact 129-module
`replay.sh` inventory is `1475/1475`.  Canonical discovery is `2869`, raw
discovery is `2917`, and the four carried exclusions account for the
`48`-test difference.  No direct coherent-discrepancy bound, uniform
zero-row intertwiner, lower-Ritz shifted sign, source graph comparison,
Mellin leverage estimate, equation (5.2), determinant limit, RH, or Lambda
bound follows.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.18: Growing low-prefix floors and mixed-bridge barriers

Checkpoint 1.18 admits thirty strict-PASS internal packages.  The first group
closes several finite-prefix questions without claiming growing uniformity.
The actual anchor-deflated full and block exterior metrics are
`1+O(lambda^(-4))` Loewner-equivalent, but this does not improve endpoint
leverage.  The genuine lower-Ritz reduction remains conditional on both
shifted signs and reduces the source-angle target to a half-power Schur
margin.  Endpoint shear removes the common sawtooth only; it does not remove
the derivative/Bernoulli row.  The exact label-`4/12` calculation gives

\[
 {\mathcal W_Z(R_{12},R_4)\over d_8L}
 \longrightarrow {\mathcal G}_8\sqrt{14/99}>0.
\]

Thus the earlier sufficient `o(d_8L^(-1/2))` cross condition is false, but
this neither contradicts positivity nor makes the `4/12` minor negative.
For every fixed prefix, the complete defect-white Weil matrix has asymptotic
`(log c)T_M+o_M(log c)` with `T_M>=I/4`, hence an eventual
`(log c)/8` floor.  Entrywise fixed-label asymptotics alone do not make this
uniform when the prefix grows.

The slow-prefix group supplies that uniformity for `Q<=C_0L`.  Endpoint-null
unequal-dilation frames, the complete-profile FIO reduction, phase-absorbed
Jost/BV bounds, the centered Toeplitz floor, the admitted fractional
multiplier estimate, and exact same-side/reflected non-equality remainders
combine to give

\[
 \widehat Q_{X,Q}^{\#}
  =(\log c)J_Q^*T_{Q+1}J_Q+P_Q+E_Q,\qquad
 P_Q\succeq0,\quad \|(E_Q)_-\|=o(L),
\]
\[
 \widehat Q_{X,Q}^{\#}\succeq L/8,\qquad
 \widehat\Sigma_{N,Q}^{\#}\succeq L/8.
\]

The residue-two odd prefix has the same `L/8` outer and compact-projected
floor.  For the even physical synthesis,

\[
 V_Q^*V_Q\succeq cL/\lambda^2,\qquad
 cd_8I\preceq\Delta_Q\preceq C\lambda^2/L,
\]

and the exact half-power source-Cauchy displacement makes the prefix-to-far
cross superpolynomially small.  Consequently the far Schur erosion is
`o(L)`.  These conclusions cover the endpoint-sheared even and odd captured
prefixes separately; they do not cover the one-dimensional mixed bridge or
the signed retained complement `R_Q=Y\ominus{\cal K}_Q`.

The bridge packages explain why this last omission cannot be repaired by
splitting terms.  For
`b=h_2-(I_2/I_0)h_0`, an endpoint-null representative still has modal
energy `Theta(d_2)` and a nonzero limiting origin value.  In the raw gauge
its beta row is `L2` but has divergent pole evaluation; in the corrected
gauge the shrinking bump costs `Theta(lambda^(-1))`, much larger than
`d_2=Theta(lambda^(-4))`.  In the Hermite limit,

\[
 \zeta(s)B_\infty(s)=-2^{3/4}{\xi(s)\over s}.
\]

The two centered boundary carriers do not vanish at a nontrivial centered
zero.  A bounded estimate for either separately split response is equivalent
to RH, so the needed defect-scale estimate cannot be obtained termwise.
Only coherent ordered modal--beta--bump finite-part cancellation could avoid
that RH-strength barrier; no such Plemelj theorem is proved.

The retained-complement near block is reduced exactly to a finite
Wiener--Hopf collar,

\[
 Q_{\rm raw,near}(f)=2\Re\langle C_1\phi,C_\Lambda\phi\rangle .
\]

A collar samples the Fejer-averaged finite symbol, not a point multiplier.
The explicit quasimode has the binding factor `1/8`, but an arbitrary
linear prefix requires a genuine unbounded-schedule negative-index density
theorem plus a compatible physical source lift.  The finite `p=41`
negative computation remains only a regression diagnostic.

Finally, the radical quotient is `[X]=-[O]`, not `[X]=0`.  The ordinary
even `L2` quotient collapses because polynomial-Xi radicals are dense and
zero sampling is not `L2`-closable.  The absolute-sampling quotient
completion is unconditional but signed.  The invisible-origin retraction
preserves the compact central state exactly, and pure codimension-two modal
prefixes are fixed-`lambda` dense in `L2` and the exterior seminorm.
There is no growing-prefix graph-norm rate.  Captured graph-core density
together with positivity would imply the Weil criterion and is therefore
itself RH-strength.

The logarithmic-WKB pair
`4503251a.../8981e211...` is an explicit **UNADMITTED DRAFT** with ten
tests.  The near-Wiener--Hopf pre-audit pair
`e1c9f610.../01f5390d...` is superseded at the same paths by the admitted
repair and adds no raw module.  The thirty admitted modules pass `348/348`.
Canonical discovery contains `3217` tests and raw discovery `3275`: the
four carried exclusions contribute `48`, and the WKB draft contributes
`10`.  The 147-module frontier inventories `1695` tests; with the
unchanged twelve-module support block, `replay.sh` inventories 159 modules
and `1823` tests.  The expensive frontier and complete canonical runs were
not repeated at this freeze.

No complete mixed-bridge raw-row finite-part bound, Plemelj closure,
retained-complement signed floor, graph-core positivity, complete sector
sign, equation (5.2), determinant limit, RH, or Lambda bound follows.  The
formal state remains `P0_INVALIDATED`.

## Checkpoint 1.19: Coherent bridge floor and retained Feshbach barrier

Checkpoint 1.19 admits five strict-PASS internal packages.  The first closes
the one-dimensional mixed bridge on the finite captured even--odd cap.  For
the endpoint-sheared bridge `b#`, with `A_lambda=b#(0)`, the coherent beta
self is

\[
 q_{bb}={A_\lambda^2C_\xi\over4\lambda}+o(\lambda^{-1}),
 \qquad C_\xi=2+\gamma_E-\log(4\pi)>0.
\]

An ordered finite-Fejer, compact-BV, Abel explicit-formula argument gives
the complete captured-to-beta row norm squared `o(L/lambda)`, uniformly for
`1<=Q<=C_0L`.  Together with the checkpoint-1.18 captured floors this yields

\[
 \widehat\Sigma_{N,{\rm mix},Q}^{\#}
 \succeq {C_\xi\over2\sqrt2}
       \operatorname {diag}(D_{C,Q},\lambda^{-1}),
\]

and hence a positive floor relative to the actual corrected exterior Gram.
The bridge bump is retained as the corrected representative of the leading
beta self.  This is a theorem for the finite captured-plus-bridge span, not
a general `L2` Plemelj or zero-sampling closability theorem.

After the bridge is pivoted, the exact retained condition is the two-stage
short

\[
 R_\theta-X_\theta A_\theta^{-1}X_\theta^*
 -(y_\theta-X_\theta A_\theta^{-1}r_\theta^*)
 q_{1,\theta}^{-1}
 (y_\theta^*-r_\theta A_\theta^{-1}X_\theta^*)\succeq0.
\]

The captured pivot costs `1/L`, while the bridge pivot costs a fixed
constant.  The retained space has dimension `R-O(L)~R`, so the finite cap
cannot exhaust it.  Exact source-Cauchy countermodels show that the proved
cap, bridge, and high floors do not by themselves orient this short; they do
not assert that the genuine arithmetic short is negative.

The strongest current negative-index inputs also do not close the retained
sign.  The polynomial compressed-trace theorem does not transfer to the
half-power cutoff, while the available complete phase-volume and scalar
high-mode estimates leave exponentially many possible dangerous directions.
For the actual inclusive von-Mangoldt multiplier, however, the dangerous
projector pulls back through the harmonic lift and reduces the zero-metric
retained problem to a Feshbach space of dimension

\[
 O(L)+1+{L\Phi_\lambda(U,g)\over\pi(g-\delta)}
 =O(L)+\exp(O(\lambda)).
\]

This is a genuine dimension reduction, not a sign.  At positive source-angle
parameter it additionally requires an unproved safe-space metric bound, and
the first unsupported line remains
`R_theta-X_theta A_theta^(-1)X_theta^*>=0`.

Finally, the pinned PNT resolves the critical edge profile

\[
 m_\lambda(z/L)=-4\lambda\cos z+o(\lambda).
\]

For zero extension from an interval of length `L`, every continuous
`2*pi`-periodic `q` satisfies

\[
 C_L^*\mathcal F^*M_{q(Lt)}\mathcal F C_L
 ={1\over2\pi}\int_0^{2\pi}q(z)\,dz\ I.
\]

Thus the leading cosine compresses exactly to zero, while its positive and
negative pieces separately have size `Theta(lambda)`.  Deficit geometry,
component counts, uncertainty estimates, and fixed-symbol Toeplitz
asymptotics therefore split the cancellation whose sign is needed; the
nonendpoint prime frequencies, archimedean term, and signed PNT discrepancy
remain the unresolved orientation.

The five admitted modules pass `58/58`.  Canonical discovery contains
`3275` tests and raw discovery `3333`; the unchanged four carried exclusions
contribute `48`, and the checkpoint-1.18 WKB draft contributes `10`.  The
152-module frontier inventories `1753` tests; with the byte-unchanged
twelve-module support block pinned at `128/128`, `replay.sh` inventories
164 modules and `1881` tests.  No retained-complement floor, complete sector
sign, equation (5.2), determinant limit, RH, or Lambda bound follows.  The
formal state remains `P0_INVALIDATED`.

## Checkpoint 1.20: Signed-discrepancy Feshbach passivity-scale barrier

Checkpoint 1.20 admits exactly one strict-PASS internal package.  After the
critical boundary alias is removed, it centers the actual multiplier-dangerous
Feshbach numerator as

\[
 \mathfrak B_{\epsilon,\sigma}(u,y)
 = (\sigma-U_Z)\langle u,y\rangle
 +\int_0^L\left(D_\lambda(t)-H_{\rm tail}(t)-{c_*\over2}\right)
 {d\over dt}C_{u,\mathsf E_{\epsilon,\sigma}y}(t)\,dt.
\]

At `sigma=U_Z` the scalar term vanishes exactly.  The signed derivative
transfer itself must therefore prove the required even and odd inf--sup.
Direct Stieltjes variation is only `O(lambda)` and misses the constant retained
short and the `lambda^(-1/2)/polylog(lambda)` coframe scale.  The pinned PNT
magnitude bound still diverges even on one fixed Fourier mode, while on the
actual dangerous space the needed derivative-graph estimate is absent.

The associated Laplace transfer is positive real in the unconditional safe
half-plane `Re(s)>=1/2`.  Its positive-real continuation to `Re(s)>0` is
exactly equivalent to RH.  Causal damping at the safe value `eta=1/2` loses
`exp(-eta L)=lambda^(-1)` when transported back across the interval, below the
required even coframe scale.  Reaching that scale by the same mechanism would
require

\[
 \eta\leq {1\over4}+O\!\left({\log L\over L}\right),
\]

which is already an unproved zero-free strip.  Two-sided physical damping is
not a common positive congruence.  The current frequency-dependent
critical-line estimate of Grigutis--Turcinskas does not repair this: it controls
only the critical-line contribution, while a complete same-height off-line
pair has a negative well and the Fejer comparison loses an unresolved
`O(L^2)` factor.  Zero-density averages do not yield the smallest singular
value of the moving finite restriction, and variable damping introduces
uncontrolled projector commutators.

At one fixed finite parameter, the dangerous restriction tests only a finite,
source-dependent family of correlations and is not itself equivalent to RH.
It is nevertheless incorrect to call the paired widening-schedule target
strictly weaker.  Exact Feshbach equivalence gives positivity of each dangerous
inf--sup exactly when the corresponding complete `U_Z`-shifted sector block is
positive.  Since `q<=U_Z`, the paired `U_Z` signs imply the paired `q`-shifted
signs, and the frozen widening-core gate makes that target already RH-strength
without any density argument.  Only the genuine lower-Ritz route is
individually weaker; its scalar reserve again vanishes at `sigma=u_R` (when
`u_R>=0`), and no frozen schedule bound reaches the coframe scale.

The admitted module passes `11/11`.  Canonical discovery contains `3286`
tests and raw discovery `3344`; the unchanged five carried exclusions
contribute exactly `58`.  The 153-module frontier inventories `1764` tests;
with the byte-unchanged twelve-module support block pinned at `128/128`,
`replay.sh` inventories 165 modules and `1892` tests.  The checkpoint-1.19
164-module replay passed `1881/1881`; the expanded checkpoint-1.20 frontier,
replay set, and complete canonical suite were not rerun at this freeze.

No even or odd dangerous inf--sup, retained sign, complete parity-sector sign,
source-angle theorem, equation (5.2), determinant limit, zero statement, RH,
or Lambda bound follows.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.21: Centered-zero Krein factorization barrier

Checkpoint 1.21 admits exactly one strict-PASS internal package.  For the
zero-extended finite Fourier vectors used by the source construction, it
keeps the complete centered two-sided form intact and proves

\[
 {1\over2\pi}\int_{\mathbb R}M_L(\tau)
 \overline{\widehat u(\tau)}\widehat w(\tau)\,d\tau,
 \qquad
 M_L(\tau)=-2\tau\int_0^Lg_\lambda(t)\sin(\tau t)\,dt.
\]

The small-end terms remain combined, and the inclusive large-endpoint jump
cancels its matching boundary alias.  The paired Hadamard expansion gives
the absolutely convergent centered-zero feature formula

\[
 \mathcal Q_{L,\epsilon}(u,w)
 =2\epsilon\sum_{\mathfrak p}
 \overline{A_u(\overline z_{\mathfrak p})}A_w(z_{\mathfrak p}).
\]

A critical-line orbit is a positive square in either parity.  A complete
off-line quartet instead contributes

\[
 \epsilon\left(|A_f(z)+A_f(\overline z)|^2
 -|A_f(z)-A_f(\overline z)|^2\right),
\]

an exact Krein block of signature `(1,1)`.  Odd parity reverses the channels;
it does not remove the negative one.  This identifies the cancellation
geometry but does not orient the actual multiplier-dangerous restriction.

The complete integration-by-parts endpoint remainder is zero.  At an
admissible centering value `sigma=S`, the harmonic lift is the same unshifted
lift `E_Q`, whether `S=U_Z` or a nonnegative lower-Ritz shift.  Thus the
proposed `q-u_R` scalar reserve does not survive centering.  If `u_R<0`, its
centering point lies outside the admissible half-line and no frozen estimate
controls the remaining signed form at `sigma=0`.

A positive-Hamiltonian, de Branges, Pick, or Herglotz factorization of the
complete compact form would be RH-strength.  A fixed finite compression can
still mask a negative Krein channel, so no converse from RH to the finite
`U_Z` signs is claimed.  Along the locked widening schedule, paired eventual
`U_Z` signs imply the paired `q`-shifted signs through `q<=U_Z`; the frozen
core gate then gives global Weil positivity and RH.

The admitted module passes `13/13`.  Canonical discovery contains `3299`
tests and raw discovery `3357`; the unchanged five exclusions contribute
exactly `58`.  The 154-module frontier inventories `1777` tests; with the
byte-unchanged twelve-module support block pinned at `128/128`, `replay.sh`
inventories 166 modules and `1905` tests.  The checkpoint-1.19 164-module
replay passed `1881/1881`; the expanded checkpoint-1.20 and checkpoint-1.21
frontier, replay set, and complete canonical suite were not rerun.

No even or odd dangerous inf--sup, coframe floor, lower-Ritz sector theorem,
retained or complete sector sign, determinant limit, zero statement, RH, or
Lambda bound follows.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.22: Fixed source-block shift asymptotics

Checkpoint 1.22 admits exactly one strict-PASS internal package.  On the
locked schedule with

\[
 N_{\rm proj}=2^{9600\lambda^2},
\]

and for every source depth `m` fixed independently of `lambda`, it proves

\[
 {q\over d_4L}\longrightarrow {\Gamma_0\over A_4^2},\qquad
 {\mu_{+,m}\over d_8L}\longrightarrow
 {\tau_m\over\|W_{8,\infty}\|_2^2},\qquad
 {\mu_{-,m}\over d_6L}\longrightarrow
 {\tau_m\over\|K_6\|_2^2},
\]

where the exact common-sample Toeplitz representation gives
`tau_m>=1/4`.  The defect hierarchy and `0<=q<=U_Z=o(d_6)` then make both
fixed captured blocks eventually positive after either the `q` shift or the
stronger `U_Z` shift.

The fixed source-label depth, the growing source depth `Q=O(L)`, and the
log-Fourier projection cutoff are distinct.  The frozen growing-prefix
floors do not promote the fixed-depth coefficient asymptotics to a uniform
growing-depth theorem or make the captured ranges whole physical sectors.
Resolving the exponentially small defect scale requires the exact frozen
projection admissibility condition; the anchor bound gives the sufficient
threshold

\[
 \log N_{\rm proj}>4\pi\lambda^2+O(\log\lambda).
\]

Thus a fixed cutoff or `N_proj=O(L)` is inadmissible for these asymptotics.
The finite `lambda=5/2`, `N=7,14` diagnostics are neither interval
certificates nor eventual-threshold evidence.

The admitted module passes `11/11`.  Canonical discovery contains `3310`
tests in 297 modules and raw discovery `3368` tests in 302 modules; the
unchanged five exclusions contribute exactly `58`.  The 155-module frontier
inventories `1788` tests; with the
byte-unchanged twelve-module support block pinned at `128/128`, `replay.sh`
inventories 167 modules and `1916` tests.  The checkpoint-1.19 164-module
replay passed `1881/1881`; the expanded checkpoint-1.20 through
checkpoint-1.22 frontier, replay set, and complete canonical suite were not
rerun at this freeze.

Checkpoint 1.22 proves, on the locked exponentially resolved schedule and
for every fixed captured source depth, the asymptotics `q asymp d_4 L`,
`mu_{+,m} asymp d_8 L`, and `mu_{-,m} asymp d_6 L`, with Toeplitz Schur
reserve `tau_m >= 1/4`. Hence both fixed captured blocks are eventually `q`-
and `U_Z`-shift positive. This is not a whole-sector result: the captured
ranges are not proved exhaustive, dense graph cores, or reducing; the
retained multiplier-dangerous complement remains uncontrolled; the
fixed-depth asymptotics are not uniform at growing source depth; and fixed
or `O(L)` Fourier cutoffs do not resolve the exponentially small defect
scale. The finite `N=7,14` diagnostics are noncertifying. No effective
threshold, whole-sector sign, dangerous inf--sup, equation (5.2), determinant
limit, zero statement, RH, or Lambda bound is proved. The formal state
remains `P0_INVALIDATED`.

## Checkpoint 1.23: Nested Feshbach and lower-Ritz feature barriers

Checkpoint 1.23 admits six strict-PASS internal packages.  They sharpen the
remaining whole-sector obstruction without asserting a sign.  First, safe
elimination followed by a positive harmonic captured pivot gives the exact
nested Feshbach equivalence

\[
 T_{\epsilon,\theta}\succeq0
 \quad\Longleftrightarrow\quad
 \mathcal K_{\epsilon,m,\theta}\succeq0.
\]

Checkpoint 1.22 physical captured positivity does not prove that harmonic
pivot.  Exact source-Cauchy multiplier models show separately that a
positive physical capture may have a negative harmonic pivot, and that a
positive harmonic pivot may still leave a negative uncaptured short.

For the genuine lower two-vector Ritz value `u`, the retained inverse spread
is exactly the shorted Ritz-residual energy

\[
 \langle b,(A-uI)^{-1}b\rangle=(q-u)+\chi_u,
 \qquad \chi_u\geq0.
\]

The actual ground correction has an exact Galerkin split.  A determinant-only
route is reduced conditionally to a direct Ritz-row limit and a residual
inverse-row limit.  Neither strict lower-Ritz sign nor either limit is proved
on the actual unbounded schedule.

For a hypothetical fixed off-line quartet, both physical parities have an
explicit ambient two-channel Gram floor, and the projected, anchor-deflated
interpolation cost is controlled.  This does not supply the corresponding
metric Gram on the multiplier-dangerous harmonic range.  A finite feature
compression may mask the quartet's negative Krein channel.

The complete arithmetic symbol also has the exact zero-extension boundary
gauge

\[
 C_L^*\mathcal F^*M_{m_\lambda}\mathcal F C_L
 =C_L^*\mathcal F^*M_{m_\lambda+4\lambda\cos(L\cdot)}\mathcal F C_L.
\]

The pure-edge member proves that boundary observation alone yields no
positive phase angle.  The exact Chebyshev-error history retains the full
arithmetic cancellation, while the pinned FKS magnitude estimate is too
coarse to resolve a polynomial-size negative lower shift.  Finally, the
actual anchor/label-12 row proves `r >= (C_12+o(1)) d_8 L`; this reduces the
direct Mellin row to the still unproved scalar estimate `q-u=O(d_4 L)`.
The residual inverse row remains independent.

The six modules pass `60/60`.  Canonical discovery contains `3370` tests in
303 modules and raw discovery contains `3428` tests in 308 modules; the same
five exclusions contribute exactly `58`.  The 161-module frontier inventories
`1848` tests.  With the byte-unchanged 12-module, 128-test support block,
`replay.sh` inventories 173 modules and `1976` tests.  The checkpoint-1.19
164-module replay passed `1881/1881`; the expanded checkpoint-1.20 through
checkpoint-1.23 frontier, replay set, and complete canonical suite were not
rerun at this freeze.

No actual sector sign, dangerous angle or metric-Gram floor, equation (5.2),
determinant limit, zero statement, RH, or Lambda bound is proved.  The formal
state remains `P0_INVALIDATED`.

## Checkpoint 1.24: Post-far lower-Ritz row reductions

Checkpoint 1.24 admits seven strict-PASS internal packages.  The actual
label-16 residual coordinate has a positive fixed limit at scale
`sqrt(d_4 d_16)L`, so

\[
 {\|b\|\over d_8L}\longrightarrow\infty.
\]

Thus label 12, or any other fixed low modal list, cannot capture the full
residual direction.  The exact replacement for the desired lowering
`t=q-u=O(d_4L)` is the forward-action estimate

\[
 t={\|b\|^4\over\langle b,(A-uI)b\rangle}.
\]

This identity does not prove the required action bound.

Conditionally on the unproved strict lower-Ritz branch, eliminating the far
block and then the captured block gives the exact inverse-energy split

\[
 b^*(A-uI)^{-1}b
 =b_F^*H_u^{-1}b_F+c^*P^{-1}c
   +\rho_1^*R_1^{-1}\rho_1.
\]

The growing endpoint-null prefix is an anchor-deflated physical range;
invertible re-coordination cannot add the missing anchor or remove the
retained inverse-energy term.  The fixed-anchor BV/Cauchy theorem does close
the separate far row:

\[
 b_F^*H_u^{-1}b_F=o(d_4L).
\]

Pulling the actual multiplier projector through both harmonic returns gives
an exact safe/dangerous split.  The generic safe inverse-energy estimate
still loses polynomial powers, but its compact-strip Mellin cross tends to
zero.  Enlarging the dangerous space by the returned forcing vector itself
then makes the complementary forcing vanish identically and reduces the
entire retained inverse row to one Schur row on a space of dimension at most
`exp(O(lambda))+1`.  This is a coordinate reduction, not the missing
dangerous-row bound.

For the captured block, the far return is negligible and the captured
inverse-energy target is equivalent to the raw growing anchor row in the
actual prefix metric.  That raw row remains open.  Nevertheless, after
pulling both the positive-sampling and Mellin rows through the same ridged
harmonic lift, the source-normalized captured determinant summand is `o(1)`
uniformly on every fixed compact strip `|Im z|<1/2` and every nonnegative
ridge, hence at the actual ground ridge.

The seven modules pass `64/64`.  Frozen canonical discovery contains `3434`
tests in 310 modules and frozen raw discovery contains `3492` tests in 315
modules; the same five exclusions contribute exactly `58`.  A seven-test
ground-ridge overlay created after the inventory freeze is explicitly
unadmitted, unbound, and outside both frozen discovery counts.  The
168-module frontier inventories `1912` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 180 modules and
`2040` tests.  The
checkpoint-1.19 164-module replay passed `1881/1881`; the expanded
checkpoint-1.20 through checkpoint-1.24 frontier, replay set, and complete
canonical suite were not rerun at this freeze.

The strict lower-Ritz signs, the forward-action bound `q-u=O(d_4L)`, the raw
growing anchor inverse row, and the forcing-adapted dangerous retained row
remain unproved.  No complete sector sign, equation (5.2), determinant
limit, zero statement, RH, or Lambda bound is proved.  The formal state
remains `P0_INVALIDATED`.

## Checkpoint 1.25: Ground-ridge arithmetic Krein RH gate

Checkpoint 1.25 admits exactly two post-freeze strict-PASS packages.  Redoing
the far, captured, and forcing-adapted eliminations at the actual ground
ridge gives the exact complete response split

\[
 \begin{aligned}
 g_z^*(A-\mu I)^{-1}b
 ={}&g_{F,z}^*H_{F,h}^{-1}b_F
   +a_{C,z,h}^*P_h^{-1}c_h\\
 &+\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h,
 \qquad h=u-\mu\geq0.
 \end{aligned}
\]

The first two observations are `o(1)` after multiplication by the exact
source normalization, uniformly on every fixed compact subset of
`|Im z|<1/2`.  Thus the full ground correction is reduced to the single
forcing-adapted dangerous row

\[
 \alpha_{\lambda,N}\sup_{z\in\Omega}
 \left|\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h\right|
 \longrightarrow0.
\]

The ridge energy identity, positive safe floor, and
`exp(O(lambda))+1` dangerous-rank bound do not prove this row: an exact
source-Cauchy family satisfies the favorable generic hypotheses while its
dangerous response has a nonzero limit.

The arithmetic/Krein theorem then identifies the same unresolved scalar in
three cancellation-preserving languages.  It is one resolvent row of

\[
 Q_\lambda=c_*I+A_{\rm tail}-T_D,
\]

the solution row of the full boundary-gauged multiplier equation, and the
Mellin observation of the solution to the unconditional centered-zero Krein
interpolation system.  The strict even-complement and odd-sector signs are
the same two positive infima in the discrepancy, boundary-gauge, and
centered-zero representations.  The exact ground-transform identity gives

\[
 \widehat p_{\lambda,N}(z)-\widehat f_{\lambda,N}(z)
 =\alpha_{\lambda,N}g_z^*(A-\mu I)^{-1}b,
\]

so, after the proved far and captured limits, dangerous-row decay is
equivalent to source-normalized ground-transform alignment.  If the two
strict signs and that decay held eventually on one unbounded locked
schedule, then `4 widehat(f_(lambda,N)) -> Xi` locally uniformly, and the
finite real-rooted determinant theorem would imply RH.  This is a
conditional RH-strength gate and supplies no converse from RH.

The two modules pass `17/17`.  Frozen canonical discovery contains `3451`
tests in 312 modules and frozen raw discovery contains `3509` tests in 317
modules; the unchanged five exclusions contribute exactly `58`.  The
170-module frontier inventories `1929` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 182 modules and
`2057` tests.  The checkpoint-1.19 164-module replay passed `1881/1881`;
the expanded checkpoint-1.20 through checkpoint-1.25 frontier, replay set,
and complete canonical suite were not rerun at this freeze.

Neither strict lower-Ritz sign nor the dangerous-row decay is proved.  The
checkpoint proves no determinant limit, zero statement, RH, converse from
RH, or Lambda bound.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.26: Capture-free actual-ground parity response

Checkpoint 1.26 admits exactly one post-freeze strict-PASS note/test pair.
Under the same finite simple-even-ground and shifted-sector hypotheses used
at checkpoint 1.25, it identifies the complete invariant actual-ground
response, for every complex frequency, with the boundary-normalized odd
profile:

\[
 \mathfrak R_\lambda(z)
 =\widehat\kappa(z)
  -\frac{K_L(z)\mathcal A_\mu(r)}{p_\mu},
 \qquad r=\frac{zL}{2\pi}.
\]

This is the complete response before any captured projection or Feshbach
chart.  The Cauchy sums and `mathcal A_mu` are first meromorphic in `r`; the
formula means their entire continuation after the zeros of `sin(pi r)` in
`K_L` cancel the retained lattice poles, with the removable value used at
`r=0`.  Combining this identity with checkpoint 1.25's already proved far
and captured `o(1)` limits makes its source-normalized dangerous-row target
equivalent to the capture-free profile on every fixed compact strict-strip
set.

The exact parity characteristic identity refines the profile to

\[
 \mathcal A_\mu(r)
 =1+\frac{\langle\chi_r^-,\operatorname{adj}(O_\mu)\beta\rangle}
          {\det O_\mu}.
\]

The numerator is a mixed odd directional cofactor.  It is not determined by
the scalar odd determinant, and the anchor normalization `p_mu` is likewise
not quantitatively controlled.  The regularized determinant gives an exact
logarithmic-derivative ODE only with the unknown ground determinant as its
coefficient.  A second mode multiplication introduces the singular even
reduced inverse and a central boundary-selected ground component; iteration
produces an alternating Krylov tower whose order grows with the cutoff.
Thus the determinant/log-ODE and Krylov routes are exact rewritings, not
decay estimates.

The admitted module passes `11/11`.  Frozen canonical discovery contains
`3462` tests in 313 modules and frozen raw discovery contains `3520` tests
in 318 modules; the unchanged five exclusions contribute exactly `58`.
The 171-module frontier inventories `1940` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 183 modules and
`2068` tests.  The checkpoint-1.19 164-module replay passed `1881/1881`;
the expanded checkpoint-1.20 through checkpoint-1.26 frontier, replay set,
and complete canonical suite were not rerun at this freeze.

No response decay, strict sector sign, locally uniform determinant limit,
zero statement, RH, converse from RH, or Lambda bound is proved.  The formal
state remains `P0_INVALIDATED`.

## Checkpoint 1.27: Source-quotient Pick/Herglotz interlacing barrier

Checkpoint 1.27 admits exactly one post-freeze strict-PASS note/test pair.
For the boundary-normalized actual ground

\[
 \Phi_\mu=\sum_{j=-N}^{N}\xi_jV_j,
 \qquad \xi_{-j}=\xi_j,
 \qquad \sum_{j=-N}^{N}\xi_j=1,
\]

the source secular function, quotient polynomial, and checkpoint-1.26 odd
profile satisfy

\[
 h(s)=\sum_{j=-N}^{N}\frac{\xi_j}{j-s},
 \qquad
 \mathcal A_\mu(r)=-r h(r),
 \qquad
 P(s)=\det(D-sI)h(s).
\]

The residue classification is exact: `h` is Pick--Herglotz if and only if
all `xi_j` are nonnegative; a nonconstant `mathcal A_mu` is neither
Herglotz nor anti-Herglotz because its residues at `+n` and `-n` have
opposite signs; and `F_mu(t)=A_mu(i sqrt(t))` is Stieltjes exactly when all
noncentral `xi_n` are nonpositive.  The first and third conditions can
coexist only on the exceptional branch `D Phi_mu=0`.

Quotient self-adjointness proves the roots of `P` are real, but it is not a
Euclidean orthogonal compression of `D` and supplies no integer-lattice
interlacing.  An exact `N=2` source-Cauchy countermodel satisfies both
abstract checkpoint-1.25 strict Ritz signs while its four quotient roots are
real and noninterlacing, with two outside the source lattice and mixed Pick
and Stieltjes residues.  Thus the natural polynomial pair need not be
Hermite--Biehler.  Conversely, the favorable hyperplane-projection family
has genuine Herglotz residues and strict interlacing but still misses the
required exponential paired-trace compensation.  These are structural
source-Cauchy countermodels, not actual prime-power matrices.

The admitted module passes `10/10`.  Frozen canonical discovery contains
`3472` tests in 314 modules and frozen raw discovery contains `3530` tests
in 319 modules; the unchanged five exclusions contribute exactly `58`.
The 172-module frontier inventories `1950` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 184 modules and
`2078` tests.  The checkpoint-1.19 164-module replay passed `1881/1881`;
the expanded checkpoint-1.20 through checkpoint-1.27 frontier, replay set,
and complete canonical suite were not rerun at this freeze.

No residue sign or interlacing theorem for the actual arithmetic ground,
actual strict sector sign, actual response decay or nondecay, locally
uniform determinant limit, zero statement, RH, converse from RH, or Lambda
bound is proved.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.28: Actual-ground residue and source-deformation barriers

Checkpoint 1.28 admits exactly two post-freeze strict-PASS note/test pairs.
The first starts from the actual boundary-normalized even ground and proves
the exact centered-mode sample identity

\[
 \sqrt L\,\xi_{n,\lambda}
 =(-1)^n\widehat\Phi_\lambda(2\pi n/L).
\]

Consequently, conditional on the still-unproved projectively normalized
actual-ground target

\[
 s_\lambda\widehat\Phi_\lambda(z)\longrightarrow\frac{\Xi(z)}4
\]

locally uniformly near zero, every fixed coefficient prefix eventually
alternates and

\[
 s_\lambda\sqrt L\,\xi_{n,\lambda}
 \longrightarrow(-1)^n\frac{\Xi(0)}4.
\]

In the literal determinant normalization `s_lambda=sqrt(L)`.  Thus a
target-convergent actual-ground schedule cannot eventually have either the
all-nonnegative Pick weights or the all-nonpositive noncentral Stieltjes
weights from checkpoint 1.27; its Pick negative index diverges.  This is a
conditional route-selection theorem.  It does not prove the actual-ground
limit or any unconditional coefficient sign.

The second pair audits the mixed cofactor

\[
 C_\mu(r)=\langle\chi_r^-,\operatorname{adj}(O_\mu)\beta\rangle.
\]

Its formal Hermitian polarization differentiates `det(O_mu)`, but a nonzero
pure odd direction is never tangent to the full source-Cauchy family.  An
exact cocycle criterion characterizes which odd blocks lift at all, and an
`N=3` source-Cauchy fixture satisfying both strict checkpoint-1.25 signs
violates that criterion.  The genuine symmetric-node extension has the
exact derivative

\[
 \Delta_r'(0)=4r\langle\chi_r^-,
 \operatorname{adj}(O_\mu)(D_+^2-r^2I)^{-1}\beta\rangle,
\]

which leaves an independent weighted row rather than controlling `C_mu`.
Its large-node expansion is nonuniform when `N>>|r|`; Schur positivity and
the discriminant reduce exactly to Cauchy--Schwarz, while the added diagonal
is free.  In the favorable Herglotz family `C_0(0)/p_0=-2N`, although the
complete normalized profile is `A_0(0)/p_0=1` by exact cancellation.  Hence
this is a deformation-method barrier, not a response-growth theorem.

The two focused modules pass `18/18`.  Frozen canonical discovery contains
`3490` tests in 316 modules and frozen raw discovery contains `3548` tests
in 321 modules; the unchanged five exclusions contribute exactly `58`.
The 174-module frontier inventories `1968` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 186 modules and
`2096` tests.  The checkpoint-1.19 164-module replay passed `1881/1881`;
the expanded checkpoint-1.20 through checkpoint-1.28 frontier, replay set,
and complete canonical suite were not rerun at this freeze.

Actual-ground transform convergence, unconditional actual coefficient
signs, mixed-cofactor control, both strict sector signs, response decay or
nondecay, a locally uniform determinant limit, any zero statement, RH,
converse from RH, and every Lambda bound remain unproved.  The formal state
remains `P0_INVALIDATED`.

## Checkpoint 1.29: Normalized source-quotient response barrier

Checkpoint 1.29 admits exactly the strict normalized source-quotient
response note/test pair.  For a boundary-normalized even ground with
`p_mu=xi_0!=0` and nonzero real quotient roots `+-rho_k`, it proves the
exact cancellation-preserving factorization

\[
 {\mathcal A_\mu(r)\over p_\mu}
 =\frac{\displaystyle\prod_{k=1}^{N}
     (1-r^2/\rho_k^2)}
 {\displaystyle\prod_{n=1}^{N}(1-r^2/n^2)},
 \qquad
 \prod_{k=1}^{N}\rho_k^2=p_\mu(N!)^2.
\]

Real-rootedness alone therefore supplies neither a quantitative lower bound
for `p_mu` nor separation of the quotient zeros from the integer poles.

The exact `N=2` family with ground

\[
 \Phi(a)=(-a,a,1,a,-a)^T,
 \qquad a>0,
\]

satisfies both abstract checkpoint-1.25 strict signs and has quotient

\[
 P_a(r)=r^4-(5+6a)r^2+4
\]

with four simple real roots.  Scaling the complete source matrix by `a`
leaves the ground and normalized profile unchanged while the positive even,
odd, and anchor-complement gaps all have floor one.  Nevertheless

\[
 {\mathcal A_0(r)\over p_0}
 =1-\frac{6ar^2}{(1-r^2)(4-r^2)},
 \qquad
 {\mathcal A_0(i)\over p_0}=1+\frac{3a}{5},
\]

so no compact normalized-profile bound follows from strict signs, quotient
real-rootedness, and uniform gaps.

The favorable family `T_N=I-|eta><eta|/(2N+1)` has more structure.  If
`q_N(r)=prod_(j=-N)^N(r-j)` and `M=2N+1`, then

\[
 G_N(r)={\mathcal A_0(r)\over p_0}
 ={rq_N'(r)\over q_N(r)},
 \qquad
 G_N(i\sqrt t)=1+2t\sum_{n=1}^{N}{1\over t+n^2}.
\]

Thus the imaginary-axis profile is complete Bernstein, its quotient by `t`
and its reciprocal have positive Stieltjes representations, and
`q_N+i q_N'/M` is Hermite--Biehler with a positive de Branges kernel.  These
qualitative structures still do not control the physical entire response.
With `r=zL/(2*pi)`, exact cardinal continuation gives retained noncentral
grid samples of magnitude `sqrt(L)`, while for fixed `0<y<1/2` and
`N/L->infinity`,

\[
 |R_{N,L}(iy)|\sim\sqrt L\cosh(yL/2).
\]

The focused module passes `10/10`.  Frozen canonical discovery contains
`3500` tests in 317 modules and frozen raw discovery contains `3558` tests
in 322 modules; the unchanged five exclusions contribute exactly `58`.
The 175-module frontier inventories `1978` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 187 modules and
`2106` tests.  The checkpoint-1.19 164-module replay passed `1881/1881`;
the expanded checkpoint-1.20 through checkpoint-1.29 frontier, replay set,
and complete canonical suite were not rerun at this freeze.  The post-freeze
twisted-boundary note/test pair contributes one module and 10 tests to the
later live worktree but is unadmitted, unbound, and outside these frozen
inventories.

These structural families are not actual prime-power matrices and prove no
actual-arithmetic failure.  Quantitative control of the actual `p_mu`, actual
quotient-zero placement, actual physical response, actual strict sector
signs, response decay or nondecay, a locally uniform determinant limit, any
zero statement, RH, converse from RH, and every Lambda bound remain unproved.
The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.30 opposite-boundary twisted Weyl/source-quotient barrier

Let `e=exp(i*pi*D)eta`, so `e_n=(-1)^n`.  In centered modes `eta` evaluates
the common periodic endpoint, whereas `e` evaluates the midpoint.  Hence the
twisted secular function is

\[
 g(s)=\langle e,(D-sI)^{-1}\Phi\rangle
     =\sum_{n=-N}^{N}{(-1)^n\xi_n\over n-s}.
\]

It is Pick--Herglotz exactly when all twisted weights
`(-1)^n xi_n` are nonnegative; strict positivity gives the corresponding
auxiliary interlacing and Hermite--Biehler structure.  Checkpoint 1.28,
however, supplies only conditional positivity on every fixed prefix under
the still-unproved target convergence.  It does not prove the full growing
retained cone, its total mass, or a uniform frame estimate.

If `a=<e,Phi>!=0`, the alternate rank-one quotient

\[
 D'_e=D-{|D\Phi\rangle\langle e|\over a}
\]

satisfies the exact characteristic identity

\[
 \det(D'_e-sI)=-{s\over a}\det(D-sI)g(s).
\]

For `T=Q-mu I` and `TD Phi=-beta`, its metric defect is

\[
 TD'_e-D_e'^*T
 =|\beta\rangle\langle e/a-\eta|
  -|e/a-\eta\rangle\langle\beta|.
\]

The second vector is nonzero even and `beta` is odd, so the defect is
nonzero for nontrivial forcing.  Direct source-boundary replacement forces
the source row to vanish, while a full diagonal gauge twists both boundary
and ground and returns the original secular function rather than `g`.

Exact `N=2` fixtures make both stopping lines sharp.  One has both abstract
strict signs, scaled positive gaps at least one, but `<e,Phi>=0`, so the
alternate normalization is undefined.  A target-compatible comparison has
both strict signs and globally positive twisted weights for `0<a<3/20`, so
the cone itself does not force failure.  A favorable `T_2` example instead
has alternate quotient `s^4+s^2+4`, with no real zeros.  Finally, the
two-boundary matrix Weyl route gives only Cauchy--Schwarz with a free mass;
it does not control `p_mu` or the physical cancellation-preserving response.

The focused module passes `10/10`.  Frozen canonical discovery contains
`3510` tests in 318 modules and frozen raw discovery contains `3568` tests
in 323 modules; the unchanged five exclusions contribute exactly `58`.
The 176-module frontier inventories `1988` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 188 modules and
`2116` tests.  The expanded checkpoint-1.20 through checkpoint-1.30
frontier, replay set, and complete canonical suite were not rerun.

The fixtures are structural source-Cauchy models, not actual prime-power
matrices.  No actual global twisted cone, actual twisted total-mass bound,
actual twisted Paley--Wiener/frame control, quantitative actual `p_mu`
bound, actual physical response control, actual strict sector sign, locally
uniform determinant limit, zero statement, RH, converse from RH, or Lambda
bound is proved.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.31 global twisted-mass strict-Ritz source-Cauchy barrier

For even `N`, fix `0<epsilon<=1/100`, set

\[
 \rho_k=k+(-1)^{k+1}\epsilon,
 \quad q_N(s)=\prod_{j=-N}^{N}(s-j),
 \quad P_N(s)=-\prod_{k=1}^{N}(s^2-\rho_k^2),
\]

and define `xi_n=-P_N(n)/q_N'(n)`.  The partial-fraction identity

\[
 {P_N(s)\over q_N(s)}=\sum_{n=-N}^{N}{\xi_n\over n-s}
\]

gives `xi_(-n)=xi_n`, `sum_n xi_n=1`, and

\[
 w_n=(-1)^n\xi_n={-P_N(n)\over(N+n)!(N-n)!}>0.
\]

Thus the boundary-normalized even ground lies in the global twisted cone.
With `v(r)_n=1/(n-r)`, the exact Gram family

\[
 Q_N=\sum_{k=1}^{N}
 \bigl(|v(\rho_k)\rangle\langle v(\rho_k)|
      +|v(-\rho_k)\rangle\langle v(-\rho_k)|\bigr)
\]

is positive semidefinite, inversion symmetric, source-Cauchy, and has the
simple kernel `R Phi_N`.  Its source row is
`b_n=-sum_k((n-rho_k)^(-1)+(n+rho_k)^(-1))`, so it obeys the exact frozen
source-displacement identity.

For `epsilon=1/100`, exact parity Grams and discrete-Hilbert/Schur bounds
give even-anchor and odd-sector floors greater than `8464`.  If `u_N` is
the genuine lower Ritz value of the even block on `span{V_0,c}`, then
`0<=u_N<5`; hence

\[
 A_N-u_NI\succ8459I,
 \qquad Q_{N,--}-u_NI\succ8459I.
\]

This uses the genuine Ritz shift, not the unshifted ground eigenvalue.
Nevertheless, with `a_N=sum_n w_n` and `p_N=xi_0`, the exact gamma-product
asymptotics and Fatou's lemma prove

\[
 {a_N\over p_N}\longrightarrow+\infty
 \qquad(N\longrightarrow\infty,\ N\ \text{even}).
\]

At fixed `epsilon`, all quotient roots remain exactly `epsilon` from the
lattice while the mass ratio diverges.  Taking `epsilon_N->0` preserves the
uniform shifted signs and makes the root clearance vanish.  The structural
hypotheses therefore bound neither mass/anchor nor positive root clearance.

The focused module passes `8/8`.  Frozen canonical discovery contains
`3518` tests in 319 modules and frozen raw discovery contains `3576` tests
in 324 modules; the unchanged five exclusions contribute exactly `58`.
The 177-module frontier inventories `1996` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 189 modules and
`2124` tests.  The expanded checkpoint-1.20 through checkpoint-1.31
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.31 proves by an exact growing structural source-Cauchy Gram family that the global twisted cone, quotient real-rootedness, and both genuine lower-Ritz shifted signs with uniform margins do not bound the twisted total-mass-to-anchor ratio or force positive quotient-root clearance. The family is not an actual prime-power matrix and proves no actual arithmetic failure. No actual global twisted cone, actual mass/anchor bound, actual root clearance, actual strict sector sign, actual response decay or nondecay, locally uniform determinant limit, zero statement, RH, converse from RH, or Lambda bound is proved. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.32 actual source-row exclusion and selector-moment gate

The paired-root Gram family admitted at checkpoint 1.31 is not compatible
with the pinned actual arithmetic source on the locked schedule.  At the
even edge its source row satisfies

\[
 -b_N^{\mathrm G}\geq {1\over\epsilon}
 +\log {N+\epsilon\over1+\epsilon},
 \qquad N=2^{9600\lambda^2},
\]

so `liminf(-b_N^G/lambda^2)>=9600 log 2`.  The actual source theorem gives
`|b_N^act|<=B_b(lambda)=O(lambda log lambda)`.  This excludes that
structural family before its divergent mass mechanism can be transferred.
The source row is invariant under scalar shifts; the accompanying bounded
Gram diagonal versus logarithmic actual diagonal mismatch is not.

Under the still-unproved actual global twisted cone and both strict
lower-Ritz signs, the shifted actual matrix nevertheless has an exact
positive selector representation

\[
 Q-\mu I=\sum_{j=1}^N\theta_j
 \{|v(r_j)\rangle\langle v(r_j)|
   +|v(-r_j)\rangle\langle v(-r_j)|\},
 \qquad \theta_j>0.
\]

Writing `S(x)=sum_j theta_j/(x-r_j^2)` gives

\[
 b_n=-2nS(n^2),
 \qquad
 -S'(n^2)={a_n-\mu-b_n/n\over4n^2},
 \qquad
 q_0=a_0-\mu=2\sum_j{\theta_j\over r_j^2}.
\]

The resulting weighted-average inequality is

\[
 \min_j{|n^2-r_j^2|\over r_j}
 \leq n\sqrt{{2q_0\over a_n-\mu-b_n/n}}.
\]

Current actual estimates give only
`O(N sqrt(log(lambda)/lambda))` at the edge, not a unit neighborhood.
They do not supply the `N^(-2)` central-moment scale or an atom-weight
lower bound needed for root separation.  Here `q_0` is the shifted central
Fourier-coordinate moment, not the projected prolate-anchor Rayleigh
quadratic; no transfer between them is proved.  The central ground equation
controls only a signed harmonic moment and does not bound the total twisted
mass.

The focused module passes `8/8`.  Frozen canonical discovery contains
`3526` tests in 320 modules and frozen raw discovery contains `3584` tests
in 325 modules; the unchanged five exclusions contribute exactly `58`.
The 178-module frontier inventories `2004` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 190 modules and
`2132` tests.  The expanded checkpoint-1.20 through checkpoint-1.32
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.32 proves that the checkpoint-1.31 paired-root Gram family violates the pinned actual edge source-row bound on the locked schedule, and proves the exact positive selector-moment representation and central-moment localization inequality under the still-unproved actual global twisted cone and strict signs. The source-row exclusion applies only to that structural family; it proves no actual-arithmetic failure. The available actual bounds give only nonlocal O(N sqrt(log lambda/lambda)) root control and prove neither an actual mass/anchor bound nor actual quotient-root separation. No actual global twisted cone, actual strict sector sign, actual response decay or nondecay, locally uniform determinant limit, zero statement, RH, converse from RH, or Lambda bound is proved. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.33 moving-grid twisted-cone target incompatibility

A direct 256-bit FLINT/Arb completed-zeta calculation and an independent
512-bit Hardy-Z calculation certify

\[
 {2905\over10^6}<\Xi(13)<{2906\over10^6},\qquad
 {-706\over10^6}<\Xi(15)<{-705\over10^6}.
\]

Thus continuity proves at least one real zero of `Xi` in `(13,15)`.  The
certificates do not isolate, enumerate, or prove simplicity of a zero.
They use distinct completed-zeta and Hardy-Z formula trees, although both
programs share the pinned FLINT 3.6.0/Arb transcendental primitives.

Let `L_k=2 log(lambda_k)`, with `lambda_k -> infinity` and
`N_k/L_k -> infinity`.  For the centered Fourier ground and twisted
weights `w_(n,k)=(-1)^n xi_(n,k)`, exact sampling gives

\[
 \widehat\Phi_k(2\pi n/L_k)=\sqrt {L_k}\,w_{n,k}.
\]

Conditional on the still-unproved projectively normalized target

\[
 a_k\widehat\Phi_k(z)\longrightarrow {\Xi(z)\over4}
\]

locally uniformly on the physical strip, the nearest retained moving
indices to 13 and 15 satisfy opposite twisted signs.  Fixed sign intervals
around those points each contain `Omega(L_k)` retained indices, so both
inertia indices of the twisted Pick kernel grow linearly:

\[
 \kappa_-(K_k)=\Omega(L_k),\qquad
 \kappa_+(K_k)=\Omega(L_k).
\]

Therefore the target convergence is incompatible with every global
one-sign twisted cone and every fixed-index Pontryagin replacement.  This
is a conditional target-incompatibility theorem, not a proof of the target
convergence or an unconditional failure of the actual cone.

The focused module passes `9/9`.  Frozen canonical discovery contains
`3535` tests in 321 modules and frozen raw discovery contains `3593` tests
in 326 modules; the unchanged five exclusions contribute exactly `58`.
The 179-module frontier inventories `2013` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 191 modules and
`2141` tests.  The expanded checkpoint-1.20 through checkpoint-1.33
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.33 independently certifies Xi(13)>0>Xi(15) with direct completed-zeta and Hardy-Z FLINT/Arb computations, hence proves at least one real zero of Xi in (13,15). Conditional on the still-unproved locally uniform actual-ground target convergence along an unbounded schedule, it proves opposite twisted-weight signs on moving O(L) indices, both Pick-kernel inertia indices Omega(L), and incompatibility with every one-sign twisted cone and fixed-index Pontryagin substitute. It does not prove the actual-ground target convergence, simple/even actual-ground existence on that schedule, or an unconditional failure of the actual global twisted cone; the conditional incompatibility proves no actual-arithmetic failure. The finite certificates give no zero isolation beyond (13,15), enumeration, uniqueness, simplicity, global zero theorem, off-line exclusion, RH, converse from RH, or Lambda bound. No actual strict sector sign, response decay or nondecay, or locally uniform determinant limit is proved. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.34 strict-odd selector-shell localization

Let `T=Q-mu I` be a finite inversion-symmetric source-Cauchy matrix with a
simple boundary-normalized even ground, `T_+>=0` with one-dimensional
kernel, and `T_->0`.  No coordinate sign assumption on the ground is
needed.  The positive selector face and strict odd block force exactly `N`
distinct finite nonzero negative selector parameters and the decomposition

\[
 T=\sum_{j\in R}\theta_j
 \{|v(r_j)\rangle\langle v(r_j)|
   +|v(-r_j)\rangle\langle v(-r_j)|\}
 +\sum_{k\in S}\vartheta_k
 \{|V_k\rangle\langle V_k|+|V_{-k}\rangle\langle V_{-k}|\},
\]

with positive regular and shell weights.  Shell roots are exactly the
zero coordinates of the even ground.  The strict odd block, not a global
twisted coordinate cone, excludes zero, infinity, and positive selector
parameters.

Writing `q_0=T_(0,0)` and `D_n=T_(n,n)-b_n/n`, the exact shell-inclusive
moments are

\[
 q_0=2\sum_{j\in R}{\theta_j\over r_j^2},\qquad
 D_n=4n^2\sum_{j\in R}{\theta_j\over(n^2-r_j^2)^2}
     +\vartheta_n>0.
\]

They imply

\[
 \min_{\rho\in\{r_j:j\in R\}\cup S}
 {|n^2-\rho^2|\over\rho}
 \leq n\sqrt{{2q_0\over D_n}}.
\]

If `q_0=0`, every root is a shell, the ground is `V_0`, and both sides are
zero at every positive retained integer.  Thus no illegal division by
`q_0` is needed.  This preserves the checkpoint-1.32 localization gate
without resurrecting the incompatible global-cone mass argument.

The focused module passes `9/9`.  Frozen canonical discovery contains
`3544` tests in 322 modules and frozen raw discovery contains `3602` tests
in 327 modules; the unchanged five exclusions contribute exactly `58`.
The 180-module frontier inventories `2022` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 192 modules and
`2150` tests.  The expanded checkpoint-1.20 through checkpoint-1.34
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.34 proves for every finite inversion-symmetric source-Cauchy matrix with a simple boundary-normalized even ground and strictly positive odd block that the selector face has exactly N positive atoms at finite nonzero negative parameters, with a unique positive regular-pair plus shell decomposition; shell roots are exactly zero ground coordinates. It proves the exact shell-inclusive source, diagonal, and localization identities, including the all-shell q_0=0 branch, so the global twisted coordinate cone is not needed for this finite selector-localization theorem. The actual simple/even ground and genuine shifted signs remain unproved on an unbounded schedule; no actual root clearance, mass-to-anchor bound, response decay or nondecay, determinant convergence, or actual-arithmetic failure is proved. It adds no zero statement beyond checkpoint 1.33 and proves no RH, converse from RH, or Lambda bound. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.35 q_0-free selector secant and root parity

Under the checkpoint-1.34 finite selector hypotheses, write

\[
 S(x)=\sum_{j\in R}{\theta_j\over x-y_j},\qquad
 -S'(x)=\sum_{j\in R}{\theta_j\over(x-y_j)^2}.
\]

For integers `1<=h<n<=N-h`, absence of a regular root or shell from
`[(n-h)^2,(n+h)^2]` implies the sharp positive-measure secant bound

\[
 -S'(n^2)\leq
 {S((n-h)^2)-S((n+h)^2)\over4nh}.
\]

At `h=1`, the actual source row and shell-inclusive diagonal identity give

\[
 D_n>B_b(\lambda){n^2\over n^2-1}
 \quad\Longrightarrow\quad
 \text{some selector radius }r\in[n-1,n+1].
\]

This local test uses neither `q_0` nor a global twisted coordinate cone.
The frozen source and diagonal envelopes activate it, conditional on the
unproved actual simple/even ground and genuine shifted signs, throughout
the locked far tail `ceil(sqrt(N))<=n<=N-1`; disjoint windows then contain
`Omega(N)` distinct roots.  The same theorem proves the exact monic law

\[
 w_n={(-1)^N p(n^2)\over(N-n)!(N+n)!},
\]

so adjacent twisted signs determine only the parity of the root count in a
lattice gap.  It also gives exact two-pole realizations showing that one
same-point first/second Cauchy-moment pair alone does not force a bracket.

The focused module passes `11/11`.  Frozen canonical discovery contains
`3555` tests in 323 modules and frozen raw discovery contains `3613` tests
in 328 modules; the unchanged five exclusions contribute exactly `58`.
The 181-module frontier inventories `2033` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 193 modules and
`2161` tests.  The expanded checkpoint-1.20 through checkpoint-1.35
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.35 proves, under the finite checkpoint-1.34 simple-even and strict-odd hypotheses, a sharp Q0-free positive-secant criterion: if D_n > B_b(lambda)n^2/(n^2-1), some selector radius lies in [n-1,n+1]. The frozen source and diagonal envelopes activate this criterion conditionally on the locked high tail and yield Omega(N) distinct constant-scale root windows. It also proves the exact twisted-weight/root-count parity law and exact same-point (b_n,D_n) nonrigidity. The actual simple/even ground, genuine shifted signs, and checkpoint-1.33 target convergence remain unproved on an unbounded schedule; the low n=O(L) criterion is not activated; and no one-root-per-gap theorem, two-sided root conclusion, subunit quotient clearance, exact gap count, linear root lower bound in the checkpoint-1.33 target intervals, response decay or nondecay, determinant convergence, actual-arithmetic failure, or new zero statement is proved. It proves no RH, converse from RH, or Lambda bound. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.36 RH-conditional fixed-zero selector capture

Take the polynomial Gevrey schedule

\[
 L=2\log\lambda,\qquad N=\lceil\lambda L^3\rceil.
\]

Assume RH and, separately, the finite actual simple inversion-even ground,
boundary normalization, and genuine shifted odd sign required by the
checkpoint-1.35 selector theorem.  For every fixed positive critical
ordinate `gamma_0`, counted with multiplicity, put

\[
 r_0={\gamma_0L\over2\pi},\qquad n_L=\operatorname{nint}(r_0).
\]

The RH zero Gram and the actual source row give the same lattice samples as
the quotient-selector Stieltjes measure.  At `n_L`, the fixed zero contributes
a positive diagonal-minus-secant defect bounded below by
`64m_0L/(25pi^2)` unless it is an exact carrier.  At an exact carrier it is a
separate shell of weight exactly `m_0L`.  All other distinct zero atoms
contribute only `O(L^-3)`, while min--max and the Gevrey sampling theorem give
`0<=mu<=U_Z/2=o(L)`.  The sharp checkpoint-1.35 contrapositive therefore
forces a quotient selector radius `rho_L` with

\[
 |\rho_L-n_L|\leq1,\qquad
 \left|{2\pi\rho_L\over L}-\gamma_0\right|\leq{3\pi\over L}.
\]

The conclusion holds simultaneously for every fixed finite set of distinct
positive ordinates, whose radius windows are eventually disjoint.  The
checkpoint-1.33 certificate `Xi(13)>0>Xi(15)` and continuity supply at least
one ordinate in `(13,15)`, hence at least one RH-conditional captured selector
frequency in that physical band for all sufficiently large `L`.

The focused module passes `10/10`.  Frozen canonical discovery contains
`3565` tests in 324 modules and frozen raw discovery contains `3623` tests in
329 modules; the unchanged five exclusions contribute exactly `58`.  The
182-module frontier inventories `2043` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 194 modules and
`2171` tests.  The expanded checkpoint-1.20 through checkpoint-1.36 frontier,
replay set, and complete canonical suite were not rerun.

Checkpoint 1.36 proves, assuming RH and the finite simple-even, boundary-normalized, strict-shifted selector hypotheses on the polynomial Gevrey schedule N=ceil(lambda L^3), that every fixed positive critical ordinate of any multiplicity eventually forces a quotient selector radius within one lattice unit of its nearest carrier, hence within 3pi/L in physical frequency. The result holds simultaneously for every fixed finite zero set, treats exact carrier collisions by the shell weight mL, and bounds all other distinct-zero contributions by O(L^-3); the frozen Xi(13)>0, Xi(15)<0 certificate therefore yields at least one conditional captured selector frequency in (13,15). RH, the actual simple/even ground, boundary normalization, and genuine shifted signs remain assumptions, not conclusions. No growing-zero-uniform capture, one-root-per-gap theorem, zero enumeration, isolation, or simplicity, determinant convergence, response bound, actual-arithmetic sign failure, RH proof or converse, or Lambda bound is proved. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.37 shifted zero-selector quadrature and odd relative-floor barriers

Under the finite checkpoint-1.36 selector hypotheses, the regular RH-zero
measure, exact carrier shells, and scalar ground subtraction define a
shell-aware functional `mathfrak L_mu` through degree `2N-1`.  Its positive
`N`-node quadrature is exactly the regular-plus-shell selector measure.  If
`M_mu` and `H_mu` are its moment and multiplication-by-`y` moment matrices,
then the selector squares are the generalized eigenvalues of
`H_mu-yM_mu`, and

\[
 {\det(H_\mu-yM_\mu)\over\det M_\mu}
 =\prod_{j=1}^N(y_j-y),\qquad
 p_\mu={\det H_\mu\over(N!)^2\det M_\mu}.
\]

The odd block is the moment Gram and the positive-index even block is the
localizing Gram.  Their exact relative reserves do not supply a moving
local-pencil inertia bound or an absolute Gaussian-weight lower envelope.
Exact paired-Cauchy families preserve prescribed captures, every retained
root parity, and `p_mu`, while their normalized response diverges; an exact
retuned fixture has one versus three roots in the same lattice gap.  These
families are not the actual arithmetic source and do not certify the genuine
lower-Ritz shifted signs.

Separately, on RH and `N=ceil(lambda L^3)`, the derivative radical with
transform `iz Xi(z)/4` supplies an odd quasi-null Rayleigh test

\[
 \mu_{N,-}\leq r_N^-=O(e^{-c_-\lambda L^2}),
\]

while `q_N` has only an independent upper bound of the same Gevrey class.
The available Cauchy-minor lower bound has exponent `lambda^2 L^7` and
cannot compare the two quantities.  A repaired HSW-compatible tail-splice
model, retaining any HSW-compatible fixed finite prefix, has singular odd
Gram on an unbounded polynomial schedule.  This is a logical insufficiency
model, not the zeta divisor: it proves that RH location, the pinned count,
its coarse distinctness consequence, and finite verified ordinates do not
by themselves imply the required relative odd sampling floor.

The two focused modules pass `18/18`.  Frozen canonical discovery contains
`3583` tests in 326 modules and frozen raw discovery contains `3641` tests
in 331 modules; the unchanged five exclusions contribute exactly `58`.
The 184-module frontier inventories `2061` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 196 modules and
`2189` tests.  The expanded checkpoint-1.20 through checkpoint-1.37
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.37 proves, under the finite checkpoint-1.36 simple-even, boundary-normalized, strict-shifted selector hypotheses, the exact shell-aware degree-2N-1 transformed zero/selector Gaussian quadrature identity, odd moment and positive-even localizing congruences, generalized-eigenvalue root formulas, and anchor determinant ratio. It proves relative odd/even conditioning reserves but no absolute Gaussian-weight floor or moving local-pencil inertia. Structural paired-Cauchy families preserve prescribed captures, retained parities, exact anchor normalization, and strict ground-complement signs while normalized response diverges, and permit one versus three roots in one gap; they are not the actual source and do not certify genuine lower-Ritz shifted signs. Separately, assuming RH on the polynomial Gevrey schedule, the derivative radical supplies only an upper quasi-null Rayleigh test, while the available determinant minor is too weak to compare with the projected-state scale. The repaired HSW-compatible tail-splice model is a logical count-compatible countermodel, not the zeta divisor, and shows that RH location, the pinned count, its coarse distinctness consequence, and any HSW-compatible finite prefix do not by themselves prove the odd floor. The actual relative odd sampling floor, shifted sign, local uniqueness or multiplicity transfer, response bound, and determinant convergence remain unproved. No actual-arithmetic failure, new zero theorem, RH proof or converse, or Lambda bound is obtained. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.38 RH zero Gaussian square-free auxiliary limit

Assume RH and the finite checkpoint-1.37 strict hypotheses, including
`0<=mu<=q_N` and `M_mu>0`, so that `M_0=M_mu+mu*S_N>0`.  At `mu=0` the
shell-aware functional is a positive transformed RH zero measure.  If
`t_(j,L)` is its `j`th squared Gaussian node, `s_(j,L)` is the squared
rescaled `j`th distinct positive ordinate, and
`tau_(j,L)=(2pi/L)sqrt(t_(j,L))`, then for each fixed `j`

\[
 s_{j,L}\leq t_{j,L}\leq s_{j,L}+O_j(1),\qquad
 \gamma_j\leq\tau_{j,L},\qquad
 \tau_{j,L}^2=\gamma_j^2+O_j(L^{-2}).
\]

The proof uses only the degree-`2N-1` form domain and includes carrier
shells before min--max.  It gives exactly one auxiliary Gaussian radius in
each fixed carrier window, fixed-atom Christoffel saturation, and the global
reciprocal-node bound.  The exact central-normalized product converges
locally uniformly to the square-free product over distinct positive
critical ordinates.  That limit equals `Xi(z)/Xi(0)` exactly when all
positive critical zeros are simple; multiplicity remains in the atom
weights and does not repeat Gaussian nodes.

For the genuine shifted functional, the Gevrey estimate preserves the
fixed-index upper Ritz bound only.  Together with checkpoint-1.36 capture,
local uniqueness would follow from the quantitative even reserve
`delta_+>(gamma_j/gamma_(j+1))^2+eta`; the frozen strict inequality gives
only `delta_+>0`.  The central coefficient `xi_0` is not identified with the
prolate-anchor overlap `<kappa_prolate,Phi>`.

The focused module passes `8/8`, and the module plus its exact direct
dependency union passes `27/27`.  Frozen canonical discovery contains
`3591` tests in 327 modules and frozen raw discovery contains `3649` tests
in 332 modules; the unchanged five exclusions contribute exactly `58`.
The 185-module frontier inventories `2069` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 197 modules and
`2197` tests.  The expanded checkpoint-1.20 through checkpoint-1.38
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.38 assumes RH and the finite checkpoint-1.37 strict hypotheses, including 0<=mu<=q_N and M_mu>0, so M_0>0; it does not derive those hypotheses from RH. For the auxiliary positive transformed zero functional at mu=0, using moments only through degree 2N-1 and including carrier shells, it proves for every fixed distinct positive ordinate gamma_j that s_(j,L)<=t_(j,L)<=s_(j,L)+O_j(1), hence gamma_j<=tau_(j,L) and tau_(j,L)^2=gamma_j^2+O_j(L^-2), exactly one Gaussian radius in the fixed carrier window, fixed-atom Christoffel saturation, the reciprocal-node bound, and locally uniform convergence of the central-normalized product to the square-free critical-zero product. The limit equals Xi(z)/Xi(0) if and only if all positive critical zeros are simple; multiplicity remains in weights and does not repeat nodes. For the genuine shifted functional the frozen Gevrey estimate preserves only the fixed-index upper Ritz bound, and checkpoint-1.36 capture yields uniqueness only under the unproved quantitative gate delta_+>(gamma_j/gamma_(j+1))^2+eta; frozen strictness gives only delta_+>0. The central coefficient xi_0 is not identified with the prolate-anchor overlap <kappa_prolate,Phi>. No actual shifted-node convergence or local uniqueness, multiplicity transfer, determinant convergence, prolate-anchor normalized-response bound, actual-arithmetic sign failure, new zeta-zero theorem, RH proof or converse, or Lambda bound is obtained. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.39 even reserve, local Uvarov, and central-normalization barriers

On RH, the exact even second-derivative radical has transform
`-z^2 Xi(z)/4` and zero full central coefficient.  After exact finite
central deletion it supplies only the upper quasi-null test

\[
 \lambda_{\min}(A^\circ)\leq r_N^+
 =O(e^{-c_{\rm ev}\lambda L^2}).
\]

Thus the checkpoint-1.38 uniqueness threshold and the stronger
`epsilon_+=o(L^-1)` target require a new relative comparison.  The frozen
upper bounds for `mu` and `r_N^+` have unrelated constants, and the
available minor lower bound has exponent `lambda^2 L^7`; neither proves the
needed even reserve.

The exact negative multi-Uvarov formulas contain the global inverse
`(I-C^(1/2)K_X C^(1/2))^(-1)`.  An all-lattice-site structural
truncated-moment family has exact target Christoffel saturation, the
checkpoint nearest-mass scaling, and strict moment and positive-localizing
Grams, yet changes one target-window node into two while both relative
reserves collapse.  This is a nonimplication family, not the transformed
zeta-zero functional.

Finally, write `c_mu=<e_0,Phi_mu>` and
`a_mu=<kappa,Phi_mu>`.  Under the finite nonzero-overlap gates, the missing
normalization transfer is exactly

\[
 \sqrt L\,{c_\mu\over a_\mu}\longrightarrow K_\infty
 \quad\Longleftrightarrow\quad
 \gamma_{\rm fb}\longrightarrow0,
\]

equivalently an oriented relative principal-compression determinant
asymptotic.  The frozen subpolynomial feedback reserve is weaker.  An exact
source-Cauchy structural family, using the projected-prolate anchors only
as comparison vectors, passes the qualitative finite gates while its
feedback tends to one.

The three focused modules pass `28/28`, and they plus their exact unique
direct dependency union pass `90/90`.  Frozen canonical discovery contains
`3619` tests in 330 modules and frozen raw discovery contains `3677` tests
in 335 modules; the unchanged five exclusions contribute exactly `58`.
The 188-module frontier inventories `2097` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 200 modules and
`2225` tests.  The expanded checkpoint-1.20 through checkpoint-1.39
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.39 admits three internal barrier results. On RH and under the finite strict checkpoint hypotheses, the even second-derivative radical gives only `lambda_min(A_circ)<=r_N^+=O(exp(-c_ev*lambda*L^2))`; the checkpoint-1.38 uniqueness reserve and any `o(1/L)` reserve therefore require a new relative estimate for `mu/lambda_min(A_circ)`. The two frozen absolute upper bounds and the available `exp(-O(lambda^2*L^7))` minor do not provide that comparison, while the count-compatible singular lattice is only a logical model, not the zeta divisor. Separately, the exact multi-Uvarov/Woodbury formulas and a structural truncated-moment family show that fixed-atom Christoffel saturation, nearest-mass scaling, and qualitative positivity do not control the global inverse or the local shifted-node count; the family is not the transformed zeta-zero functional and proves no actual shifted-node failure. Finally, under the nonzero-overlap finite gates, central-to-prolate normalization transfer is equivalent to `gamma_fb->0`, equivalently an oriented relative principal-compression determinant asymptotic. Only a subpolynomial nonvanishing reserve is frozen, and the source-Cauchy structural family uses the projected-prolate anchors only as comparison vectors; it is not the actual arithmetic matrix. The checkpoint-1.38 auxiliary `mu=0` square-free limit cannot be applied directly to the actual shifted profile. No actual quantitative even reserve, shifted-node convergence or uniqueness, determinant or normalization transfer, prolate-normalized response control, zero-simplicity theorem, new zeta-zero theorem, RH proof or converse, or de Bruijn--Newman `Lambda` bound follows. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.40 actual derivative comparison and endpoint-flat floor obstruction

On RH and under the retained finite strict hypotheses, let `p_N` be the
actual projected finite prolate state, put
`f_N=p_N-sqrt(L)*p_N(L/2)*e_0`, and let `r_N^pr` be the even-zero-Gram
Rayleigh value of `p_N''`.  The centered Fourier convention gives the exact
endpoint and transform identities

\[
 f_N(\pm L/2)=f_N'(\pm L/2)=0,
 \qquad \widehat {p_N''}(t)=-t^2\widehat f_N(t).
\]

Consequently, with `eta_N^pr` the actual endpoint-trace leakage ratio,

\[
 {r_N^{\rm pr}\over q_N}
 \geq\gamma_*^4{\|p_N\|_2^2\over\|p_N''\|_2^2}
 (1-\eta_N^{\rm pr})_+^2,
 \qquad
 {\|p_N''\|_2^2\over\|p_N\|_2^2}\longrightarrow m_4.
\]

An exact rational formula identifies `eta_N^pr` as the endpoint value at
projective infinity relative to the weighted family of actual zero rows.
The frozen endpoint decay is only absolute and gives no lower bound for the
zero-sampling norm, so it does not prove `eta_N^pr->0`.  Even if that limit
were supplied, the sufficient reserve gate still contains the saturation
factor `kappa_N=r_N^pr/lambda_min(A_circ)`, for which no frozen all-vector
bound is available.

Independently, a source-Cauchy quotient vector annihilating the first
`floor(theta*N)` distinct actual positive zero rows is endpoint-flat to
growing order.  The multiplicity-safe HSW tail estimate proves only

\[
 \lambda_{\min}(A^\circ)
 \leq\exp\{-(c_*-o(1))N\},
 \qquad c_*=0.4087565478\ldots .
\]

This is an upper-floor obstruction.  It excludes any fixed-constant
all-vector lower frame at scale `exp(-C*N/L)`, but it neither compares
`q_N` or `mu` with the floor nor proves or disproves the even reserve.

The two focused modules pass `21/21`, and they plus their exact unique
direct dependency union pass `61/61`.  Frozen canonical discovery contains
`3640` tests in 332 modules and frozen raw discovery contains `3698` tests
in 337 modules; the unchanged five exclusions contribute exactly `58`.
The 190-module frontier inventories `2118` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 202 modules and
`2246` tests.  The expanded checkpoint-1.20 through checkpoint-1.40
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.40 admits two RH-conditional internal barrier results. For the actual projected finite prolate state, exact central deletion makes `f_N` endpoint-flat through first order and gives `hat(p_N'')(t)=-t^2 hat(f_N)(t)`, the relative comparison `r_N^pr/q_N>=gamma_*^4*(||p_N||_2^2/||p_N''||_2^2)*(1-eta_N^pr)_+^2`, and `||p_N''||_2^2/||p_N||_2^2->m_4`. The exact rational quotient identifies `eta_N^pr` with the endpoint trace at projective infinity relative to all actual zero rows. Frozen absolute endpoint decay gives no lower bound for the zero-sampling norm, so it does not prove `eta_N^pr->0`; even if it did, the sufficient reserve gate retains the uncontrolled saturation factor `kappa_N=r_N^pr/lambda_min(A_circ)`. Separately, an endpoint-flat source-Cauchy quotient vector annihilating the first `floor(theta*N)` distinct actual positive zero rows proves only the upper-floor obstruction `lambda_min(A_circ)<=exp(-(c_*-o(1))*N)`, with `c_*=0.4087565478...`, and rules out an all-vector lower bound at scale `exp(-C*N/L)`. This upper bound does not compare the actual projected-prolate `q_N` or `mu` with the floor and does not prove or disprove the even reserve; the finite phase models are structural sampling models, not the actual prolate state or zeta divisor. No actual quantitative even reserve, shifted-node convergence or uniqueness, determinant or normalization transfer, prolate-normalized response control, zero-simplicity theorem, new zeta-zero theorem, RH proof or converse, or de Bruijn--Newman `Lambda` bound follows. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.41 endpoint-flat ground shift and actual endpoint variance

Retain RH and the finite strict checkpoint hypotheses.  The endpoint-flat
positive-index quotient witness has an exact clamped twice primitive in the
full centered even space.  With
`alpha_N=lambda_min(A_circ)` and
`varkappa_N^flat=r_N^flat/alpha_N`, min--max gives

\[
 {\mu\over\alpha_N}
 \leq {D_N^{\rm flat}\over T_N^4}\varkappa_N^{\rm flat}
 \leq \left({\Omega_N\over T_N}\right)^4
       \varkappa_N^{\rm flat}.
\]

At the optimized checkpoint-1.40 proportion, the explicit scalar tends to
`0.2232886136...`.  The saturation factor remains uncontrolled, so this is
not an even-reserve theorem.  The same simple-ground equation isolates the
oriented relative target exactly:

\[
 {\mu\over\alpha_N}
 ={s_0\over\alpha_N(1+\ell_\mu)},
 \qquad s_0={\det Q_+^Z\over\det A^\circ}.
\]

A shifted-hyperplane source-Cauchy family, using the same projected-prolate
vectors as comparison anchors, preserves the stated finite source,
strictness, determinant, and cofactor identities while
`mu/alpha_N->1`.  It is structural rather than the actual arithmetic or
zeta-zero Gram and need not obey the actual zero-support contraction.

For the actual projected prolate state, the source scalar fixes the weighted
mean of the rational zero rows and yields the exact variance decomposition

\[
 \sum_{\gamma>0}w_\gamma H_N(s_\gamma)
 =-{\sqrt L\,J_L\over4},
 \qquad
 D_N=S_0\operatorname {Var}_w(H_N)+{LJ_L^2\over16S_0}.
\]

Thus

\[
 (\eta_N^{\rm pr})^2
 ={d_N^2\over
 \operatorname {Var}_w(H_N)+LJ_L^2/(16S_0^2)}.
\]

The flat upper bound for `J_L` controls only the mean and supplies no
variance floor.  On the nonzero-endpoint branch, coefficientwise absolute
control reaches projective infinity only beyond every fixed polynomial
zero-height scale, where current zero counting supplies no phase-weighted
mass lower bound.

The two focused modules pass `18/18`, and they plus their exact unique
direct dependency union pass `84/84`.  Frozen canonical discovery contains
`3658` tests in 334 modules and frozen raw discovery contains `3716` tests
in 339 modules; the unchanged five exclusions contribute exactly `58`.
The 192-module frontier inventories `2136` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 204 modules and
`2264` tests.  The expanded checkpoint-1.20 through checkpoint-1.41
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.41 admits two RH-conditional internal barrier results. The endpoint-flat quotient witness has an exact clamped full-even primitive and gives `mu/alpha_N<=(D_N^flat/T_N^4)*varkappa_N^flat<=(Omega_N/T_N)^4*varkappa_N^flat`; at the optimized proportion the explicit scalar tends to `0.2232886136...`, but the saturation `varkappa_N^flat=r_N^flat/alpha_N` remains uncontrolled. The simple-ground Schur equation also gives `mu/alpha_N=s_0/[alpha_N*(1+ell_mu)]`, so an oriented relative Schur/cofactor estimate or quantitative leverage growth is still required. A shifted-hyperplane source-Cauchy family with the same projected-prolate comparison anchors has `mu/alpha_N->1` while preserving the stated finite source, strictness, determinant, and cofactor identities, but it is not the actual arithmetic or zeta-zero Gram and need not obey the actual zero-support contraction. Separately, the actual source scalar fixes only the weighted mean `sum w_gamma*H_N=-sqrt(L)*J_L/4`; the exact identities give `D_N=S_0*Var_w(H_N)+L*J_L^2/(16*S_0)` and `(eta_N^pr)^2=d_N^2/[Var_w(H_N)+L*J_L^2/(16*S_0^2)]`. The flat upper bound for `J_L` supplies no variance floor. On the nonzero-endpoint branch, coefficientwise absolute control reaches projective infinity only beyond every fixed polynomial zero-height scale, and current zero counting supplies no phase-weighted mass lower bound there. This proves neither decay nor failure of `eta_N^pr`. No quantitative actual even reserve, endpoint-relative estimate, shifted-node convergence or uniqueness, determinant or normalization transfer, prolate-normalized response control, actual-arithmetic sign conclusion, zero-simplicity theorem, new zeta-zero theorem, RH proof or converse, or de Bruijn--Newman `Lambda` bound follows. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.42 continuous-L phase shell and spectral-cluster primitive barrier

The multiplicity-aware parity-bin selection in `(T,2T]` gives a separated
ordinate shell with

\[
 U_T\gg {\log T\over T},\qquad
 \int_A^{A+h}|C_T(L)|^2\,dL\ll_h{\log^3T\over T^3}.
\]

Outside a bad set of measure `O_h(log(T)/T)`, its phase mass satisfies
`W_T(L)>=U_T/4`, and fixed-length `L` intervals therefore yield a cofinal
phase-good sequence compatible with the locked ceiling schedule.  The
resulting lower bound for `D_N` remains conditional on an independent
high-row amplitude lower bound at the same `L`; the phase theorem alone
does not control the moving rational amplitude.

Separately, for `M=floor(theta*N)` and `1<=k<=N-M-1`, exact quotient
partial fractions give a `k`-plane which annihilates the first `M`
distinct actual zero rows and is endpoint-flat through order
`2(N-M-k)-1`.  Min--max gives

\[
 \lambda_k(A^\circ)
 \leq C L T_M\log T_M
 \left({\Omega_N\over T_M}\right)^{4(N-M-k)}.
\]

When `k_N/N->delta<1/2`, the optimized exponent is
`c_delta=4(1-delta)*(W(2e(1-delta))-1)^2/W(2e(1-delta))`; for `k_N=o(N)`
it is `0.4087565478...`.  The exact clamped primitive of an actual ground
removes the earlier one-vector saturation algebraically but leaves the
negative-Sobolev/low-row conditioning ratio

\[
 {\mu_N\over\alpha_N}
 \leq {\int\gamma^{-4}\,d\nu_\alpha(\gamma)
       \over\|\mathcal R_Nh_\alpha\|_2^2}.
\]

The real-evaluation appendix identifies the full finite PSD real
source-Cauchy cone with positive real Fourier-evaluation Grams and gives
integer-weight approximants to the shifted-hyperplane obstruction.  It
does not realize zeta ordinates, an HSW-compatible prefix, or the actual
source row.

The two focused modules pass `17/17`, and they plus their exact unique
direct dependency union pass `57/57`.  Frozen canonical discovery contains
`3675` tests in 336 modules and frozen raw discovery contains `3733` tests
in 341 modules; the unchanged five exclusions contribute exactly `58`.
The 194-module frontier inventories `2153` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 206 modules and
`2281` tests.  The expanded checkpoint-1.20 through checkpoint-1.42
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.42 admits two RH-conditional internal results. The multiplicity-aware HSW parity-bin construction proves a continuous-L mean-square bound, an asymptotically full-measure phase-shell lower bound of order log(T)/T, and a cofinal extraction compatible with the locked ceiling schedule. Its bounds for D_N and eta_N^pr remain conditional on an independent high-row amplitude lower bound at the same L; no joint phase-amplitude estimate, high-row amplitude theorem, or eta decay is proved. Separately, for M=floor(theta*N), 1/2<theta<1, and 1<=k<=N-M-1, the actual-zero quotient construction gives an exact k-dimensional positive-even subspace annihilating the first M distinct actual rows, including carrier and multiplicity branches, flat through order 2(N-M-k)-1, and proves lambda_k(A_circ)<=C*L*T_M*log(T_M)*(Omega_N/T_M)^(4(N-M-k)). If k_N/N->delta<1/2, the optimized exponent is c_delta=4(1-delta)*(W(2e(1-delta))-1)^2/W(2e(1-delta)); for k_N=o(N) this is c_*=0.4087565478... . These are only eigenvalue upper bounds and prove no relative bottom gap, ground orientation, or comparison among mu, q_N, r_N^pr, and the floor. For a unit actual A_circ ground h_alpha, the exact clamped primitive gives mu/alpha_N <= [int gamma^(-4) d nu_alpha]/||R_N h_alpha||_2^2, eliminating kappa_N algebraically but exposing an uncontrolled negative-Sobolev denominator and relative low-row mass. The full finite PSD real source-Cauchy cone equals the positive real Fourier-evaluation Gram cone, so the shifted-hyperplane reserve obstruction has an exact positive-real-weight evaluation representation and arbitrarily close integer-weight finite representations; none is the actual zeta zero Gram, and no HSW-compatible prefix, divisor, padding, zeta-ordinate, or pole–archimedean–minus-prime source realization is proved. No actual saturation or quantitative even reserve, actual minimal-eigenspace alignment, shifted-node convergence or uniqueness, determinant or normalization transfer, actual-arithmetic sign conclusion, new zero theorem, RH proof or converse, or de Bruijn–Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.43 ideal Stokes filter and LP cardinal-tail barriers

For a damped Paley--Wiener model whose bandwidth stays below alternating
Nyquist, the exact multiplier gives a uniform fixed-`Delta` estimate

\[
 \int_{\mathbb R}\sup_{\delta\leq\Delta\leq B}
 \left|\mathscr S_\Delta-{\mathscr E\over\Delta}\right|^2
 \leq C_{\epsilon,\delta,B}h^2\|\mathscr E\|_2^2.
\]

The exact near-edge Cauchy factorization, together with explicit relative
endpoint, row, and kernel-remainder hypotheses, then gives
`|H_N/d_N|>=T/(16B)`.  On a fixed physical micro interval, the HSW count
and exact phase average would conditionally give
`(eta_N^pr)^2=O(1/log(T))`.  The actual finite-`lambda` relative Stokes
transfer and the required joint phase-amplitude micro-window inequality
are not proved.

Separately, an exact `M+1`-coordinate barycentric tail has endpoint sum one,
one-signed unalternated samples, and annihilates `M` prescribed distinct
below-edge Cauchy rows.  An explicit even order-one Laguerre--Polya
interpolant realizes the tail, and a simple-zero Hermite--Biehler
perturbation makes all normalized rows arbitrarily small.  Its artificial
carrier lattice has density one and type `pi`; it is not HSW-compatible and
does not model the actual zeta or finite-prolate tail.  The sub-Nyquist
half-lattice attempt also shows why killing a complete prefix can kill the
endpoint sum itself.

The two focused modules pass `19/19`, and they plus their exact shared
direct dependency union pass `38/38`.  Frozen canonical discovery contains
`3694` tests in 338 modules and frozen raw discovery contains `3752` tests
in 343 modules; the unchanged five exclusions contribute exactly `58`.
The 196-module frontier inventories `2172` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 208 modules and
`2300` tests.  The expanded checkpoint-1.20 through checkpoint-1.43
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.43 admits two internal theorem/barrier results. For a damped Paley--Wiener tail whose bandwidth stays a fixed distance below alternating Nyquist, the exact Fourier multiplier and Delta-Sobolev estimates show that the Stieltjes tail differs from E_m/Delta by O(h) in squared-average norm, uniformly on a fixed Delta-window and outside an exceptional set carrying O(h^2) endpoint energy. The exact near-edge Cauchy factorization and explicit relative endpoint, row, and kernel-remainder hypotheses imply |H_N/d_N|>=T/(16B). Together with the fixed physical HSW micro-window count and exact phase average this would imply (eta_N^pr)^2=O(1/log T), but only conditionally: the actual finite-lambda relative Stokes representation, its positive slow multiplier, all relative remainders, and the required q_L-weighted joint Hardy--Cauchy micro-window inequality are unproved, and separate phase and amplitude averages cannot be multiplied. Separately, an exact M+1-coordinate barycentric tail has nonzero endpoint E=1, one-signed unalternated samples, and annihilates M prescribed distinct below-edge Cauchy rows. An explicit even order-one Laguerre--Polya interpolant realizes it, and a simple-zero Hermite--Biehler perturbation makes the normalized rows arbitrarily small. This is a Nyquist-saturating artificial carrier lattice of density one and type pi, not an HSW-compatible zeta model or the actual finite-lambda tail; the sub-Nyquist half-lattice attempt with a killed complete prefix also kills the endpoint sum, so no obstruction under the correct density/type/slow-frequency margin is proved. Algebraic multiplicity, carrier limits, and endpoint/row remainders remain explicit. No actual eta decay or failure, actual high-row amplitude theorem, actual zeta-tail cancellation, quantitative even reserve, actual-arithmetic sign conclusion, new zeta-zero theorem, RH proof or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.44 complex Mellin, joint phase-energy, and recurrence barriers

The central fourth-quadrant prolate saddle has exact relative action

\[
 D_c(\sigma)=c\left\{
 \sqrt{1+(\sigma/(2c))^2}-1
 -{\sigma\over2c}\operatorname {arsinh}(\sigma/(2c))\right\}.
\]

At the locked edge it is positive and slowly varying, and the exact
label-`0/4` ratios exclude leading saddle cancellation.  The corresponding
carrier-safe projection identity keeps the phase weight on every actual
zero row.  If the ideal joint constant is `kappa` and both operator-relative
endpoint and row errors are at most `1/4`, the actual Hilbert-space transfer
constant is exactly at least `9*kappa/25`.  The complex-sector prolate
factorization and those relative error bounds remain unproved.

On the arithmetic side, the fixed HSW micro-window contains a phase-good
set of explicit positive relative measure.  A single endpoint-energy
nonconcentration condition, equivalently a covariance gap, would imply the
missing weighted joint Hardy--Cauchy inequality.  A local LP model with the
correct Riemann--Siegel type and local density nevertheless has normalized
joint energy `o(1)`.  It is not the actual Hardy source, one global
HSW-compatible zeta divisor, or a transport through the locked ceiling.

Finally, the physical prolate Mellin transform obeys an exact
boundary-complete recurrence and a critical-line forward form using only
positive-real-part transforms.  Watson normalization selects the small
root; the subturning roots stay separated; and the label mixture is both an
exact diagonal two-channel system and an exact scalar five-term equation.
The remaining theorem must construct the canonical Birkhoff connection,
remove nonconstant `2`-periodic connection factors, and control one ordinate
derivative and the minimal Green function.

The three focused modules pass `33/33`, and they plus their exact unique
direct dependency union pass `56/56`.  Frozen canonical discovery contains
`3727` tests in 341 modules and frozen raw discovery contains `3785` tests
in 346 modules; the unchanged five exclusions contribute exactly `58`.
The 199-module frontier inventories `2205` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 211 modules and
`2333` tests.  The expanded checkpoint-1.20 through checkpoint-1.44
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.44 admits three internal theorem/barrier results. First, the exact fourth-quadrant prolate Mellin action is positive and slowly varying on the locked edge, the label-0/4 mixture has no leading saddle cancellation, and the exact carrier-safe phase-weighted projection identity transfers an ideal joint constant kappa to 9*kappa/25 under operator-relative endpoint and row errors at most 1/4. The required finite-lambda complex-sector factorization and operator-relative remainders remain unproved. Second, the HSW micro-window contains a phase-good subset of explicit positive relative measure, and one endpoint-energy nonconcentration condition, equivalently a covariance gap, would imply the missing weighted joint Hardy--Cauchy inequality. A correct-type, correct-density local LP model has normalized joint energy tending to zero, showing that local real-zero geometry, density/type, slow positivity, and separate phase/amplitude information do not force that gate; it is not the actual Hardy source, a global HSW-compatible zeta divisor, or a locked-ceiling transport. Third, the physical prolate Mellin transform satisfies an exact boundary-complete recurrence, a positive-real-part critical-line forward form, Watson small-root normalization, separated subturning action branches, and exact diagonal two-channel and scalar five-term label-mixture equations. What remains is a uniform subturning Birkhoff connection theorem excluding nonconstant 2-periodic connection factors and controlling the minimal Green function and one ordinate derivative. Consequently no actual finite-lambda Stokes transfer, actual joint inequality, decay or failure of eta_N^pr, actual arithmetic sign, new zeta-zero theorem, RH implication or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.45 adaptive carrier, aggregate alias, and closure barriers

Every sufficiently large target height can be made the exact first-omitted
carrier with an integer cutoff

\[
 {2\pi(N+1)\over L}=t,\qquad N=e^{L/2}L^3+O(L).
\]

Keeping that `N` fixed on a micro-plateau removes the literal ceiling
schedule's fixed-window edge drift without changing the proved Gevrey
scale.  It does not transport the simple-even ground, boundary
normalization, shifted signs, response reserve, or strict denominator
branch to the selected cutoff.

The exact adjacent-cutoff endpoint and Cauchy recurrences, used in squared
aggregate form, repair the separate-winner defect and reduce an ideal
`(log T)^2` quotient to a discrete phase-weighted first-alias theorem, an
endpoint frame, operator-relative Stokes transfer, and intersection with
the finite strict gates.  These inputs remain unproved.

The minimal-Riccati calculation now has an exact gamma-action gauge.  It
also shows why the attempted finite-order Euler closure fails: the omitted
vertical term is `|Im(s)|/c`, and a resonant forcing defeats every finite
top-derivative seminorm.  The desired subturning factorization is therefore
conditional on the explicit unproved all-order/tail Closure Lemma `CL`.

For a Fourier-compact Guinand--Weil auxiliary profile only, Poisson
summation and the explicit formula compute the `k=0,+1,-1` modes and reduce
the first fixed-grid aliases to a prime-power/divisor shifted convolution
with all four approximate-functional-equation channels.  RH-PNT is too
weak even on the same-branch diagonal at the locked and critical interval
scales.  Translation averaging selects some translated lattice, not the
required origin.  No exact passage from this auxiliary statistic to the
compact physical `PW1` profile is claimed.

The four focused modules pass `47/47`, and they plus their exact 18-path
dependency union pass `110/110`.  Frozen canonical discovery contains
`3774` tests in 345 modules and frozen raw discovery contains `3832` tests
in 350 modules; the unchanged five exclusions contribute exactly `58`.
The 203-module frontier inventories `2252` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 215 modules and
`2380` tests.  The expanded checkpoint-1.20 through checkpoint-1.45
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.45 admits four internal theorem/barrier results in topological order. First, every sufficiently large target can be made an exact first-omitted carrier with N=e^(L/2)L^3+O(L), and a constant-N microplateau removes fixed-window edge drift while leaving finite simple-ground, boundary, shifted-sign, and reserve gates unsynchronized. Second, exact adjacent-cutoff endpoint/Cauchy recurrences and their squared block form reduce the desired ideal quotient to a discrete phase-weighted first-alias theorem, an endpoint frame, operator-relative Stokes transfer, and finite-gate/cutoff intersection; none is proved. Third, the exact minimal-Riccati/gamma gauge shows the finite-order Euler argument fails because of |Im(s)|/c and resonant top-seminorm losses; the claimed subturning factorization remains conditional on unproved all-order/tail Closure Lemma CL. Fourth, for a Fourier-compact Guinand--Weil auxiliary profile only, Poisson summation and the explicit formula reduce the first fixed-grid aliases to a prime-power/divisor shifted convolution with all four approximate-functional-equation channels; RH-PNT is too weak at the locked and critical interval scales, translation averaging does not select the fixed origin, and no exact passage to the compact physical PW1 profile is claimed. The Bettin--Fazzari continuous theorem and Gonek's correctly normalized T(log T)^2/(2pi) zero-sampled moment do not supply the fixed-grid theorem. Consequently no actual finite-lambda Stokes transfer, compact physical PW1 estimate, finite-gate synchronization, eta decay or failure, actual arithmetic sign, new zeta-zero theorem, RH implication or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.46 finite-gate synchronization and Volterra-resonance barriers

At fixed dimension, the finite-gate transport problem now has an exact
quantitative criterion.  Weyl bounds preserve the simple-even ground and
both shifted sector signs when the matrix and lower-Ritz moduli are smaller
than their strict margins; separate boundary, Stokes-denominator, and
reserve moduli preserve the remaining gates.  On the adaptive constant-`N`
microplateau the sufficient condition is `A/t<R_sync`.  No actual relative
margin or modulus estimate establishing that inequality is proved.

This missing information cannot be replaced by qualitative source-Cauchy
or nesting arguments.  Exact positive source-Cauchy models can have an
arbitrarily small good radius, flip from an even to an odd ground under a
positive principal extension, and remain bad through an arbitrarily long
adjacent-cutoff window.  The actual prime-power block is continuous at a
threshold but has an exact rank-one derivative jump there.  These are
structural barriers, not failures of the actual arithmetic matrices.  The
finite selector quantity `D_n^(sel)` is also distinct from the Stokes
zero-row denominator `D_N^(St)`; a gate-restricted arithmetic estimate
remains a new input.

The exact Riccati coefficient also has a positive-support Laplace
representation by a finite signed measure with uniformly bounded total
variation and first moment.  A fixed negative `J_2` lobe rules out
positivity and complete monotonicity.  Turning-frequency packets at
`xi_c=2c` force at least `c_j c^(1/4)` growth of the inverse norm on the
unrestricted `L1_1` Volterra algebra, whenever that inverse exists.
However, `2c` lies outside the project window ending at `2c^(3/4)`, so this
does not refute a restricted or quotient construction and does not close
all-order/tail Closure Lemma `CL`.

The two focused modules pass `23/23`, and they plus their exact 10-path
dependency union pass `75/75`.  Frozen canonical discovery contains `3797`
tests in 347 modules and frozen raw discovery contains `3855` tests in 352
modules; the unchanged five exclusions contribute exactly `58`.  The
205-module frontier inventories `2275` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 217 modules and
`2403` tests.  The expanded checkpoint-1.20 through checkpoint-1.46
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.46 admits two internal theorem/barrier results. First, quantitative fixed-dimensional margins and moduli give an exact finite-gate transport criterion across a constant-N microplateau, while exact source-Cauchy countermodels have arbitrarily small good radii, parity-flipping positive principal extensions, and arbitrarily long bad adjacent-cutoff windows. These are structural models, not the actual prime-power/archimedean matrices or zeta-zero Grams; the finite selector quantity D_n^(sel) is not the Stokes zero-row denominator D_N^(St), and neither actual margin/modulus estimates nor a gate-restricted aggregate arithmetic theorem is proved. Second, the exact Riccati coefficient is the Laplace transform of a uniformly controlled finite signed measure, not a positive or completely monotone one, and turning-frequency quasimodes invalidate a uniform inverse on the unrestricted L1_1 Volterra algebra. That resonance occurs at frequency 2c, outside the target strip ending at 2c^(3/4), so restricted all-order/tail Closure Lemma CL and the conditional subturning factorization remain open. Consequently no actual finite gate or gate failure, finite-gate/arithmetic-winner intersection, finite-lambda Stokes transfer, compact physical PW1 estimate, eta decay or failure, actual arithmetic sign, new zeta-zero theorem, RH implication or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.47 finite-order subturning closure and adaptive Gonek `PW1`

The first nonlinear Riccati cherry cannot be returned with a uniform norm
to the global positive-support Laplace/Wiener atom class.  At the turning
height its exact effective forcing has size
`(|I|^2+o(1))*c^(2/3)`, where
`|I|^2=0.349831425170034047...`; holomorphic continuation turns this into
the same lower bound for the total variation of every exact global
positive-support representing measure.  This invalidates that global
terminal class, but not a genuinely band-local or approximate closure.

The subturning factorization itself is now unconditional for labels `0`
and `4`.  Thirteen finite homogeneous Riccati orders leave an
`O(c^(-14))` weighted `C^1` residual, and one exact Newton correction with
an `O(c^6)` Green loss closes the equation.  Watson minimality, the
Casoratian, annular control of the `2`-periodic quotient, and the real
anchor then give, uniformly for `sqrt(c)<=t<=c^(3/4)/2`,

\[
 P_j(1/2-it)=e^{D_c(j-1/2-it)}H_j(1/2-it)(1+\varepsilon_j),
 \qquad
 |\varepsilon_j|+|\partial_t\varepsilon_j|
 \ll {1\over t}+{t\over c}.
\]

This finite-order/Newton proof bypasses rather than proves all-order/tail
Closure Lemma `CL`, and it does not exactly eliminate every nonconstant
periodic connection factor outside the stated asymptotic window or provide
operator-relative Stokes bounds.

Under RH, Gonek's shifted zero-sampled second moment and exact dyadic
subtraction select a zero `gamma_Y in (Y,2Y]` with a nonzero Hardy value at
`t_Y=gamma_Y+(1/4)/mathscr L_(2Y)`.  Making `t_Y` the exact first-omitted
carrier gives `N=e^(L/2)L^3+O(L)` and carrier coordinate tending to `1/2`.
The selected row alone therefore proves the exact compact physical
singleton `PW1({N+1})` inequality with every fixed constant `kappa<4` on
a cofinal adaptive sequence.  This is not the literal ceiling schedule,
does not prove `NY`, and supplies neither finite-`lambda` Stokes transfer
nor intersection with the finite strict gates.

The three focused modules pass `36/36`, and they plus their exact 14-path,
seven-pair direct dependency union pass `97/97`.  Frozen canonical
discovery contains `3833` tests in 350 modules and frozen raw discovery
contains `3891` tests in 355 modules; the unchanged five exclusions
contribute exactly `58`.  The 208-module frontier inventories `2311`
tests.  With the byte-unchanged 12-module, 128-test support block,
`replay.sh` inventories 220 modules and `2439` tests.  The expanded
checkpoint-1.20 through checkpoint-1.47 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.47 admits three theorem/barrier results in order. First, the first Riccati cherry forces c^(2/3) growth in every exact global positive-support Wiener terminal representation, invalidating that uniform global class but not all-order/tail Closure Lemma CL or a band-local construction. Second, thirteen finite perturbative orders and one polynomial-loss Newton correction prove the actual label-0/4 subturning Mellin factorization with one ordinate derivative throughout the stated window; the proof bypasses CL and does not prove exact global periodic-factor exclusion or operator-relative Stokes transfer. Third, under RH, Gonek's shifted zero-sampled moment proves exact compact physical singleton PW1 with every fixed kappa<4 on a cofinal adaptive exact-carrier schedule N=e^(L/2)L^3+O(L). It is not the literal ceiling schedule and proves neither NY, finite-gate synchronization, nor finite-lambda Stokes transfer. Consequently no eta decay or failure, actual arithmetic sign, new unconditional zeta-zero theorem, RH proof or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.48 adaptive Gonek endpoint-filter selection

Assume RH.  For every sufficiently large dyadic `Y`, the shifted Gonek
moment, a two-branch sub-Nyquist alternating endpoint filter, and a
multiplicity-safe Sobolev sampling estimate select the same
`gamma_Y in (Y,2Y]` for which the Hardy value is nonzero and, on its own
adaptively rounded exact-carrier singleton,

\[
 {sf PW1}(\{m\})\quad(\hbox{every fixed }\kappa<4),
 \qquad
 |e_m|^2+r_m^2|e_{m+1}|^2\leq C L|Z(t_{\gamma_Y})|^2.
\]

Thus singleton `NY` now holds at the same ordinate as singleton `PW1`,
with `C_E(L)=O(L)=o(L^2)`.  The frozen adjacent-cutoff reduction selects
`n in {m,m+1}` with

\[
 {D_n^{\rm id}\over |e_n|^2}\geq c_\kappa L\longrightarrow\infty,
\]

subject to its separately declared zero-endpoint alternative.  This is an
ideal, unweighted arithmetic quotient.  The exponentially envelope-weighted
formula (6.8), the literal ceiling or prescribed locked-origin schedule,
actual finite-prolate Stokes/operator transfer, intersection with every
finite strict gate, and eta decay all remain unproved.

The one checkpoint-1.48 module passes `14/14`; it and its exact six-path,
three-pair frozen dependency union pass `49/49`.  Frozen canonical/raw
discovery contains `3847/3905` tests in `351/356` modules, with the unchanged
five exclusions contributing exactly `58`.  The 209-module frontier
inventories `2325` tests; with the byte-unchanged 12-module, 128-test support
block, `replay.sh` inventories 221 modules and `2453` tests.  The expanded
checkpoint-1.20 through checkpoint-1.48 frontier, replay set, and complete
canonical suite were not rerun.

This checkpoint also repairs a stale checkpoint-1.47 `HANDOFF_MANIFEST.json`
projection: four proved subturning gates are synchronized from `false` to
`true`, all thirteen omitted checkpoint-1.47 claim keys are added, and
`replay.sh` now checks an explicit required checkpoint-1.47/1.48 key list
for existence and equal values across `PROJECT_STATUS.json`,
`P0_STATUS.json`, and `HANDOFF_MANIFEST.json`.  No intersection-filtered
comparison is used.

Checkpoint 1.48 admits one RH-conditional theorem. On every sufficiently large dyadic interval, Gonek's shifted zero-sampled moment, a two-branch sub-Nyquist endpoint filter, and multiplicity-safe Sobolev sampling select the same adaptively rounded exact-carrier ordinate with nonzero Hardy value, singleton PW1 for every fixed kappa<4, and singleton NY with C_E(L)=O(L)=o(L^2). The frozen adjacent-cutoff reduction then gives D_n^(id)/|e_n|^2 >= c_kappa L for one of the two adjacent cutoffs, subject to its zero-endpoint alternative. This is an unweighted selection theorem and does not prove weighted formula (6.8), the literal ceiling or locked-origin schedule, actual finite-prolate Stokes/operator transfer, finite-gate intersection, or eta decay. The checkpoint also repairs stale HANDOFF claim metadata by synchronizing four checkpoint-1.47 promotions, adding all thirteen omitted checkpoint-1.47 keys, and installing an explicit cross-surface replay preflight. No actual arithmetic sign, unconditional zeta-zero theorem, RH proof or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.49 adaptive prolate Stokes endpoint/row transfer

Assume RH and retain the same cofinal adaptively rounded exact-carrier
sequence selected at checkpoint 1.48.  Exact periodization of the exterior
state identifies the two-adjacent endpoint common mode and proves

\[
 |r_m|^2+|r_{m+1}|^2\leq P_0(\lambda,L)d_4.
\]

An intermediate-order Gevrey split, explicit arithmetic-jump variation,
and phase-weighted Abel summation control the undifferentiated far endpoint
and row values, including the complete exterior selected row.  Combining
those estimates with the repaired finite-order Newton lower scale and an
absolute, cancellation-safe multiplier comparison makes all normalized
actual-minus-ideal endpoint/row errors `o(1)`.  Thus one adjacent cutoff
satisfies

\[
 {D_n^{\rm act}\over |d_n^{\rm act}|^2}\geq c_0L,
 \qquad (\eta_n^{\rm pr})^2=O(L^{-1})\longrightarrow0
\]

in the positive-denominator branch.  This is an adaptive selected-cutoff
result only.  A differentiated far endpoint tail, literal-ceiling or
fixed-origin transfer, finite-gate intersection, and the independent
reserve/saturation gates remain unproved.

The new module passes `9/9`; it and its exact 18-path, nine-pair direct
dependency union pass `107/107`.  Frozen canonical/raw discovery contains
`3856/3914` tests in `352/357` modules, with the unchanged five exclusions
contributing `58`.  The 210-module frontier inventories `2334` tests.  With
the byte-unchanged 12-module, 128-test support block, `replay.sh` inventories
222 modules and `2462` tests.  The expanded checkpoint-1.20 through
checkpoint-1.49 frontier, replay set, and complete canonical suite were not
rerun.

Checkpoint 1.49 admits one RH-conditional adaptive transfer theorem. On the same cofinal selected exact-carrier sequence, exact exterior periodization controls the two adjacent endpoint common mode by a polynomial multiple of d_4; an intermediate Gevrey split and defect-relative jump estimate control the undifferentiated far endpoint and phase-weighted row values, including the complete exterior selected row; and the finite-order Newton lower scale plus an absolute cancellation-safe multiplier comparison makes every normalized actual-minus-ideal endpoint/row error o(1). Therefore the ideal adjacent quotient transfers to D_n^(act)/|d_n^(act)|^2 >= cL for one of the two adjacent cutoffs, and in its positive-denominator branch (eta_n^pr)^2=O(L^(-1))->0. This does not control a differentiated far endpoint tail, return to the literal ceiling or a fixed origin, synchronize the selected cutoff with the finite gates, or prove the missing reserve/saturation bounds. No actual arithmetic sign, unconditional zeta-zero theorem, RH proof or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.50 parity criterion and saturation-orientation barrier

Assume RH.  For the actual finite odd zero-Gram ground `g_-`, its exact
endpoint-zero even primitive `P g_-` gives a sharp one-vector criterion:

\[
 {\sum_{\gamma>0}m_\gamma|\widehat g_-(\gamma)|^2/\gamma^2
  \over
  \sum_{\gamma>0}m_\gamma|\widehat g_-(\gamma)|^2}
 <{\|P g_-\|_2^2\over\|g_-\|_2^2}
 \quad\Longrightarrow\quad \lambda_+<\lambda_-.
\]

The strict inequality would force a simple inversion-even global ground
and boundary nonvanishing.  It is exactly a Christoffel-weighted comparison
between the actual-zero and carrier means.  The comparison itself remains
unproved.  An exact positive integer-multiplicity real-evaluation Gram has
an odd global ground, so positivity, reflection, source-Cauchy displacement,
and separate moment positivity cannot replace it.

On the adaptive Stokes sequence, selecting the larger adjacent actual row
gives both the order-`L` quotient and an absolute selected-carrier lower
scale.  Together with the actual-zero spectral-cluster upper bound,

\[
 q_K^{\rm pr},r_K^{\rm pr}
 \geq\exp\{-(\pi^2+o(1))K/L\},
 \qquad
 \lambda_{k_K}(A_K^\circ)
 \leq\exp\{-(c_\delta-o(1))K\}.
\]

Thus the derivative saturation `r_K^pr/alpha_K` diverges exponentially,
and the bottom-cluster share of its sampling energy vanishes.  This
invalidates the sufficient derivative-reserve route, but gives neither an
ordinary Hilbert-space angle nor an orientation of `mu_K/alpha_K`.  The
actual parity, even-reserve, finite-gate, and literal-ceiling gates remain
open.

The two focused modules pass `19/19`; they and their exact nine-path direct
dependency union pass `50/50`.  Frozen canonical/raw discovery contains
`3875/3933` tests in `354/359` modules, with the unchanged five exclusions
contributing `58`.  The 212-module frontier inventories `2353` tests.  With
the byte-unchanged 12-module, 128-test support block, `replay.sh` inventories
224 modules and `2481` tests.  The expanded checkpoint-1.20 through
checkpoint-1.50 frontier, replay set, and complete canonical suite were not
rerun.

Checkpoint 1.50 admits two RH-conditional theorem/barrier pairs. First, the exact clamped primitive of the actual odd Gram ground yields a finite Rayleigh/Christoffel mean criterion whose strict positivity would imply lambda_+<lambda_- and hence simple-even ground and boundary nonvanishing; the criterion is not proved, and an exact positive integer-multiplicity evaluation Gram with an odd ground shows that positivity, source-Cauchy displacement, reflection symmetry, and separate moment positivity do not force it. Second, on the adaptive Stokes sequence, larger-row selection and the selected-carrier lower scale show q_K^pr,r_K^pr >= exp{-(pi^2+o(1))K/L}, while the actual-zero cluster gives lambda_{k_K}(A_K^circ)<=exp{-(c_delta-o(1))K}; hence derivative saturation diverges exponentially and its bottom-cluster sampling-energy fraction vanishes. This invalidates that sufficient derivative-reserve route but does not orient mu_K/alpha_K, prove a Hilbert-space angle, the actual simple-even or even-reserve gates, finite-gate synchronization, or a literal-ceiling result. No unconditional zeta-zero theorem, RH proof or converse, actual arithmetic parity conclusion, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.51 actual-ground response scalars

Checkpoint 1.51 admits the strict-PASS actual-ground Christoffel and
commutator response barrier.  For the actual odd ground, its Euler equation
collapses the missing determinant to the boundary and response scalars

\[
 \Delta_N=-\sigma_e(yp_-^2)p_-(0)\omega_-(p_-)
          =-\sigma_e(yp_-^2)^2\lambda_-'(0).
\]

The same sign is exactly a central source-commutator correlation and an
odd-ground negative-Sobolev mass comparison.  These are identities only:
neither the boundary product nor `lambda_-'(0)` is signed.

For the true positive-index even ground, the twice-clamped primitive gives
the exact squared-commutator and second-Christoffel scalar

\[
 \alpha_K\|f_2\|_2^2(\Theta_K-1)
 =2\{(a_0-\alpha_K)S_2^2-S_2B_3-B_1S_4\}.
\]

The low-row mass is also the logarithmic ground response
`alpha'(1)/alpha(1)`, and concavity reduces its control to a relative
row-deletion floor together with `G_K`.  No such relative floor or useful
upper bound for `Theta_K` is proved.  Exact positive `N=2` models give the
opposite odd sign and `Theta=159/67>1`, so the frozen structural inputs do
not orient either actual statistic.

The focused module passes `8/8`; it and its exact four-path, two-pair direct
dependency union pass `27/27`.  Frozen canonical/raw discovery contains
`3883/3941` tests in `355/360` modules, with the unchanged five exclusions
contributing `58`.  The 213-module frontier inventories `2361` tests.  With
the byte-unchanged 12-module, 128-test support block, `replay.sh` inventories
225 modules and `2489` tests.  The expanded checkpoint-1.20 through
checkpoint-1.51 frontier, replay set, and complete canonical suite were not
rerun.

Checkpoint 1.51 admits one RH-conditional internal theorem/barrier pair. It proves exact odd-ground boundary-functional, Christoffel-derivative, source-commutator, and negative-Sobolev scalar reductions; exact even-ground squared-commutator, second-Christoffel, low-row logarithmic-response/concavity, and inverse-fourth-moment scalar reductions; and two exact N=2 structural nonimplications. No sign or orientation is proved, no useful upper bound for Theta_K or relative row-deletion stability is obtained, and no structural model is identified with the zeta divisor. The actual parity, simple-even, boundary, even-reserve, finite-gate synchronization, literal-ceiling, determinant-convergence, and all unresolved gates remain false. No unconditional zeta-zero theorem, RH proof or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.52 critical covariance and Mellin transport

Checkpoint 1.52 first admits the strict-PASS critical near-Nyquist
two-branch covariance barrier.  On
`N=D lambda^2 L+O(1)`, with `D` in a compact subset of
`(1/(2*pi),1/2)`, the exact Lerch ratio is

\[
 r_x(e^{-zh})
 =z\log(1/h)-z\{\log z+\gamma_0+\psi(x)\}
  +O(h\log(1/h)).
\]

The scalar gain is therefore `z log L+O(1)`, but the real conjugate-pair
block has smallest gain

\[
 g_R=\Theta_{\mathcal D,x}(R\log L/L),\qquad 2\leq R=o(L).
\]

Thus no sublinear cutoff block preserves a fixed fraction of the scalar
logarithmic gain.  A fixed zero loses that gain over a linear block, every
finite frozen multi-frequency section has an exact endpoint-nonzero row
nullspace, and exact carrier filters cannot remove the first Poisson
aliases or the four approximate-functional-equation channels.  These are
coefficient-space and alias obstructions, not a failure theorem for the
actual Hardy coefficients.  The actual zero-energy covariance, or its
prime-power/divisor shifted-convolution equivalent, remains unproved.

Second, checkpoint 1.52 admits the strict-PASS critical-density prolate
Mellin transport theorem.  With `c=2*pi*lambda^2`, its essential transport
is

\[
 T_j(z)={2^{j+1}r(z)\over
 (1+r(z))^{j+1/2}\sqrt{1+r(z)^2}},
 \qquad r(z)={\sqrt{z^2+4}-z\over2}.
\]

The exact forward recurrence extends the outer solution to
`Re(s)=1/2`.  Inner overlap and Laurent propagation then give, uniformly
at fixed critical density and with one ordinate derivative, the physical
connection with relative error `O(c^(-1/2))`.  The normalized recurrence
defect is `O(c^(-2))`, the forward-minimal Green cost is `O(sqrt(c))`, and
the action phase cancels the phase of `T_j`, leaving a positive leading
label-0/4 source multiplier.  This closes the analytic critical Mellin
continuation only.  It does not prove an operator-relative Stokes transfer
or the supercritical Abel tail for `t>=c`.

The two focused modules pass `20/20`; they and their exact 14-path,
seven-pair unique direct dependency union pass `98/98`.  Frozen
canonical/raw discovery contains `3903/3961` tests in `357/362` modules,
with the unchanged five exclusions contributing `58`.  The 215-module
frontier inventories `2381` tests.  With the byte-unchanged 12-module,
128-test support block, `replay.sh` inventories 227 modules and `2509`
tests.  The expanded checkpoint-1.20 through checkpoint-1.52 frontier,
replay set, and complete canonical suite were not rerun.

Checkpoint 1.52 admits two internal theorem/barrier pairs in topological order. First, at N=D lambda^2 L+O(1), D compact in (1/(2pi),1/2), the exact Lerch symbol has scalar gain z log L+O(1), but the real two-branch gain is Theta(R log L/L) for R=o(L); every finite multi-frequency section has an endpoint-nonzero row nullspace, and exact carrier filters retain the k=+-1 aliases and all four AFE channels. This proves no failure of the actual Hardy coefficients: the required actual zero-energy covariance or prime-power/divisor shifted-convolution theorem remains open. Second, the critical-density prolate Mellin continuation to Re(s)=1/2 is proved with the essential transport T_j, positive label-0/4 leading multiplier, uniform O(c^-2) normalized defect, O(sqrt(c)) forward-minimal Green cost, and relative connection error O(c^-1/2) with one ordinate derivative. It proves no operator-relative Stokes transfer or supercritical Abel tail for t>=c. The actual critical arithmetic covariance, finite-gate synchronization, parity, simple-even/boundary, reserve, literal-ceiling, determinant-convergence, and all unresolved gates remain false. No unconditional zeta-zero theorem, RH proof or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.53 adaptive critical covariance, full-source Abel tail, and scalar transfer

Checkpoint 1.53 admits three strict-PASS pairs in the topological order
`A, B -> C`.  First, under RH, assigning an exact critical carrier after
each zero and using the global positive tangent envelope gives

\[
 A_Y\gg YL^3(\log L)^2,\qquad B_Y\ll YL^3.
\]

One and the same ordinate therefore satisfies
`|C|^2 >> (log L)^2 |E|^2` and
`|C|^2 >> L^2 (log L)^2`.  This is an adaptive same-zero theorem, not the
checkpoint-1.52 fixed-origin covariance theorem; the existing
`critical_actual_zero_energy_covariance_gap_proved` and
`critical_prime_power_divisor_shifted_convolution_gate_proved` claims stay
false.

Second, for arbitrary real `lambda>1`, the complete full-source Abel
endpoint tail is a polynomial times `exp(-2c/5)` from `0.9c` and a
polynomial times `exp(-c/2)` from `c`.  The carrier-safe sampled Cauchy row
has the same `2/5` exponent.  The proof uses full-source recombination,
transition contour control, and Euler-periodized real-lambda BV image
pairs; it neither differentiates an Abel tail nor leaves a gap between a
compact endpoint and an exterior tail.

Third, at that same selected zero and the single cutoff `N=m-1`, the exact
endpoint and phase-row identities, the critical Mellin multiplier, and
the full-source tail make every actual-minus-ideal error negligible at the
absolute selected-carrier scale.  Thus either the favorable zero-endpoint
branch holds or

\[
 {D_N^{\rm act}\over |d_N|^2}\gg(\log L)^2,
 \qquad
 (\eta_N^{\rm pr})^2=O((\log L)^{-2})\longrightarrow0
\]

under RH.  This is an adaptive one-cutoff scalar transfer.  It does not
put that cutoff on the literal-ceiling or prescribed half-integer schedule
and does not synchronize it with the finite simple-ground, boundary,
shifted-sign, response-reserve, or strict-denominator gates.

The three focused modules pass `34/34`; their dependency-ordered exact
12-module closure passes `144/144`.  The declared `FROZEN` union has 22
paths, or 11 note/test pairs, and the complete union including C has 24
paths, or 12 pairs.  Frozen canonical/raw discovery contains `3937/3995`
tests in `360/365` modules, with the unchanged five exclusions contributing
exactly `58`.  The 218-module frontier inventories `2415` tests.  With the
byte-unchanged 12-module, 128-test support block, `replay.sh` inventories
230 modules and `2543` tests.  The expanded checkpoint-1.20 through
checkpoint-1.53 frontier, replay set, and complete canonical suite were not
rerun.

Checkpoint 1.53 admits three results in topological order. First, under RH, adaptive exact carriers assigned after each zero prove the global-positive-tangent same-zero bounds A_Y >> YL^3(log L)^2, B_Y << YL^3, and select one ordinate with |C|^2 >> (log L)^2|E|^2 and |C|^2 >> L^2(log L)^2. This is not the fixed-origin covariance theorem. Second, for arbitrary real lambda>1, the complete full-source Abel endpoint tail is P(c,L)e^(-2c/5) from 0.9c, P(c,L)e^(-c/2) from c, and the carrier-safe sampled Cauchy row has the same 2/5 bound, without differentiating an Abel tail or splitting a compact endpoint from an exterior tail. Third, at the same adaptively selected zero and cutoff N=m-1, these inputs give the actual one-cutoff quotient D_N^(act)/|d_N|^2 >> (log L)^2, or the favorable zero-endpoint branch, and hence (eta_N^pr)^2=O((log L)^(-2))->0 under RH. The literal-ceiling and prescribed half-integer schedules, finite simple-ground, boundary, shifted-sign, response-reserve and strict-denominator gates, determinant convergence, and all unconditional zero claims remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.54 critical odd-half-grid ceiling and true-ground deletion barrier

Checkpoint 1.54 first admits the strict-PASS adaptive critical
odd-half-grid literal-ceiling theorem.  Under RH, a third-derivative van
der Corput estimate and Erdos--Turan discrepancy select an odd `p_Y` near
each checkpoint-1.53 adaptive carrier.  With

\[
 \lambda'_Y={p_Y\over2},\qquad L'_Y=2\log\lambda'_Y,
 \qquad
 D'_Y=D_Y+O(t_Y^{-1/4}),
\]

the primed cutoff satisfies the exact identity

\[
 N'_Y=\left\lceil D'_Y(\lambda'_Y)^2L'_Y\right\rceil.
\]

The normalized tangent endpoint and same-zero row filters are stable under
this perturbation.  A fresh parameter-uniform rerun of the
checkpoint-1.53 scalar interface at the primed cutoff therefore gives
either its favorable zero-endpoint branch or

\[
 {D_{N'_Y}^{\rm act}\over|d_{N'_Y}|^2}\gg(\log L'_Y)^2,
 \qquad
 (\eta_{N'_Y}^{\rm pr})^2=O((\log L'_Y)^{-2})\longrightarrow0.
\]

This is a varying-density theorem: `D'_Y` is an output.  It proves neither
the same ceiling for one prescribed fixed density nor the legacy Gevrey
ceiling `ceil(lambda*L^3)`.  It transports the explicit tangent filters,
not finite endpoint or Gram data across the `O(t^(3/4))` cutoff change.

Second, checkpoint 1.54 admits the strict-PASS critical scalar-floor to
true-ground row-deletion barrier.  Riemann--von Mangoldt gives the actual
critical low-row nullity

\[
 \dim\ker\mathcal E^-_{\leq\Omega_N}
 \geq(1-\log D){N\over L}+O_D(L)=\Theta_D(e^L),
\]

but a favorable primitive built in that nullspace compares with a
constrained odd minimum, which is at least the unconstrained true odd
ground.  This is the wrong minimax direction.  An exact positive `N=2`
paired real-evaluation Gram has an odd global ground, and an exact positive
source-Cauchy family simultaneously has strict shifted gates, an
arbitrarily large scalar row/end-point quotient, and reserve

\[
 \delta_+={4\over2N+5}\longrightarrow0.
\]

The note also proves sharp odd and true-even row-deletion sufficient
criteria.  They isolate the surviving actual-zeta statistics
`Delta_N>0`, `Sigma_N>0`, and `Theta_N<=1-rho` (or directly
`mu_N/alpha_N<=1-rho`).  None is established for the actual zeta Gram, and
the structural examples prove no actual-zeta gate failure.

The two focused modules pass `20/20`, and the exact eight-module direct
dependency closure passes `81/81`.  Their declared `FROZEN` union has 12
paths, or six note/test pairs; the complete union has 16 paths, or eight
pairs.  Projected canonical/raw discovery contains `3957/4015` tests in
`362/367` modules, with the unchanged five exclusions contributing `58`.
The 220-module frontier inventories `2435` tests.  With the byte-unchanged
12-module, 128-test support block, `replay.sh` inventories 232 modules and
`2563` tests.  The expanded checkpoint-1.20 through checkpoint-1.54
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.54 admits two results. First, under RH, a third-derivative van der Corput and Erdos--Turan selector retunes each adaptive critical carrier to an odd half-grid lambda'_Y=p_Y/2 and a varying density D'_Y=D_Y+O(t_Y^{-1/4}) with N'_Y=ceil(D'_Y lambda'^2_Y L'_Y) exactly; tangent endpoint and row filters are stable, and the checkpoint-1.53 scalar interface is rerun at the primed cutoff. This does not prove a prescribed fixed-D ceiling or the old Gevrey ceiling ceil(lambda L^3). Second, the critical low-zero nullspace, an exact positive paired-evaluation odd-ground example, sharp row-deletion criteria, and a positive source-Cauchy reserve-collapse family show that the scalar floor does not imply the actual primitive determinant, shifted-sector margin, or true-ground reserve. This is a structural nonimplication, not an actual-zeta gate failure. All finite simple-ground, boundary, shifted-sign, response-reserve, strict-denominator, determinant-convergence, and unconditional zero claims remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.55 mixed-cofactor target and negative-Sobolev no-escape barrier

Checkpoint 1.55 first admits the strict-PASS critical odd-ground mixed
Vandermonde cofactor target.  For a simple actual odd ground, under RH when
the zeta-zero functional is used, the favorable primitive sign is exactly
equivalent to each of

\[
 a^T\operatorname {adj}(Q_--\lambda I)
       \{(a_0-\lambda)a-d\}<0,
\]

positivity of the corresponding bordered determinant,
`F_t(lambda,0)<0` for the Christoffel--Geronimus pencil, and

\[
 R<\lambda s_0K.
\]

The coefficient of the origin-atom term is exactly one.  Andreief's
identity expands `R` and `K` as alternating sums whose individual mixed
zero--carrier Vandermonde volumes are nonnegative.  This isolates the
remaining finite arithmetic statement but does not prove its sign.  A
growing family of positive evaluation Grams has a simple odd ground and
realizes either derivative sign by changing one free boundary mass; it is
not the zeta divisor.

Second, checkpoint 1.55 admits the strict-PASS critical-ground
negative-Sobolev no-escape barrier.  If `gamma_1` is the least positive
zeta-zero ordinate, support alone gives the sufficient conditions

\[
 L^2J_1(u)>\left({2\pi\over\gamma_1}\right)^2,
 \qquad
 L^4J_2(h)\geq {1\over\tau}
       \left({2\pi\over\gamma_1}\right)^4.
\]

They are not consequences of source-Cauchy displacement, positivity,
simple strict grounds, nodal structure, or zero counting.  An exact
positive inversion-symmetric source-Cauchy family has a simple odd ground,
a simple even global ground strictly below it, nonzero boundary pairing,
and positive-index ground statistics

\[
 J_1={3\over N^2},\qquad J_2={3\over N^4}+O(N^{-6}).
\]

Its paired real-evaluation representation, and arbitrarily close
integer-multiplicity versions, retain the structural escape.  A separate
HSW-compatible carrier-lattice multiset gives the same obstruction at the
count level, but its Gram is singular and its ground is degenerate.  None
of these models is the actual zeta Gram.

The two focused modules pass `20/20`, and their deduplicated exact
seven-module direct dependency closure passes `58/58`.  The declared
`FROZEN` union has 10 paths, or five note/test pairs; adding the two target
pairs gives a complete union of 14 paths, or seven pairs.  Projected
canonical/raw discovery contains `3977/4035` tests in `364/369` modules,
with the unchanged five exclusions contributing `58`.  The 222-module
frontier inventories `2455` tests.  With the unchanged 12-module, 128-test
support block, `replay.sh` inventories 234 modules and `2583` tests.  The
expanded checkpoint-1.20 through checkpoint-1.55 frontier, replay set, and
complete canonical suite were not rerun.

Checkpoint 1.55 admits two internal theorem/barrier results. First, for a simple actual odd ground under RH, the remaining primitive sign is exactly equivalent to a negative mixed adjugate cofactor, a positive bordered determinant, a negative Christoffel--Geronimus derivative, and R<lambda*s_0*K with coefficient exactly one; Andreief gives alternating expansions in nonnegative mixed zero--carrier Vandermonde volumes. None of these identities proves the inequality, and a growing positive evaluation-Gram family realizes either derivative sign without being the zeta divisor. Second, support above gamma_1 gives sufficient negative-Sobolev conditions for the odd primitive comparison and true-even reserve, but exact positive source-Cauchy and nearby integer-multiplicity evaluation Grams have simple strict grounds with J_1=3/N^2 and J_2=3/N^4+O(N^-6); an HSW-compatible carrier multiset supplies a separate singular count-level obstruction. These are structural and count-level nonimplications, not actual-zeta ground escape or actual gate failure. The actual mixed sign, negative-Sobolev lower bound, all finite gates, determinant convergence, and unconditional zero claims remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.56 natural half-grid cross-root schedule and projective-alignment barrier

Checkpoint 1.56 first admits the strict-PASS unconditional natural-halfgrid
cross-root schedule theorem.  For every sufficiently large positive odd
integer `p`, put

\[
 \lambda_p={p\over2},\qquad L_p=2\log\lambda_p,
 \qquad M_p={p+1\over2}.
\]

The natural outer rules `N_p=M_p+1` and
`N_p=ceil(C*lambda_p)`, with fixed `C>1`, are deterministic and cofinal.
The exact half-grid mesh is `O(lambda_p^(-1))`, while the frozen
multiplicity-safe HSW shell has a certified phase-stability radius at least
`1/(16T)`.  With `T asymp N/L`, the mesh-to-radius ratio is

\[
 O\left({N\over\lambda L}\right).
\]

Thus the natural rules admit a deterministic cofinal HSW-phase-good
odd-halfgrid subsequence.  More generally, the certified rounding argument
is asymptotically safe when `N=o(lambda*L)`.  This argument does not reach
the critical schedule `N asymp D*lambda^2*L`, the older Gevrey schedule
`N asymp lambda*L^3`, or the exponential schedule; failure of the rounding
argument does not prove those grids phase-bad.  The natural prolate tail,
normalization, frequency separation, and projective transform rates remain
valid, but HSW selection supplies no actual finite source gate or alignment.

Second, checkpoint 1.56 admits the strict-PASS cross-root even-sector
projective-alignment reduction and barrier.  On the simple-line branch the
remaining finite gate is the even complement

\[
 P_{\kappa^\perp\cap H_+}(Q_+-uI)
 P_{\kappa^\perp\cap H_+}\succ0
\]

together with bounded Ritz ratio.  On a multiple lowest-even space `E`, the
canonical branch requires `P_E*eta!=0`, subpolynomial mixed overlap with the
prolate anchor, and the same projective rate.  In both cases the exact
positive statistic is

\[
 \mathcal A_{N,M}=\|P_{\mathcal L_M}X\|^2,
 \qquad
 \boxed{\mathcal A_{N,\lceil\lambda\rceil}=O(\lambda^{-1})}.
\]

After the frozen prolate tail, this is equivalent to the signed response
rate.  The checkpoint-0.71 cross-root implication needs no global
full-matrix parity, odd shifted sign, simple-line boundary denominator, or
true-even reserve.  It still needs the even complement or the visible
canonical projector and the displayed projective decay.

An exact growing positive diagonal source-Cauchy family has endpoint scalar
zero, strict even complement, bounded Ritz ratio, nonzero canonical
visibility, and fixed anchor overlap, yet

\[
 \mathcal A_{N,M}=S_M-k_{00}={1\over2}
\]

for every `M>=1`.  Hence the checkpoint-1.53 through checkpoint-1.55 scalar,
half-grid, saturation, row-deletion, cofactor, and negative-Sobolev inputs do
not imply the projective alignment.  The model is not the pinned arithmetic
matrix and proves no actual-zeta failure.

The focused modules pass `23/23`, and the exact 13-module deduplicated
target/direct-dependency closure passes `126/126`.  The declared `FROZEN`
union has 24 paths: 11 note/test pairs and two already-frozen source locks.
Adding the two target pairs gives 28 paths: 13 pairs and two locks.
Projected canonical/raw discovery contains `4000/4058` tests in `366/371`
modules, with the unchanged five exclusions contributing `58`.  The
224-module frontier inventories `2478` tests.  With the unchanged 12-module,
128-test support block, `replay.sh` inventories 236 modules and `2606`
tests.  The expanded checkpoint-1.20 through checkpoint-1.56 frontier,
replay set, and complete canonical suite were not rerun.

Checkpoint 1.56 admits two internal theorem/barrier results. First, without assuming RH, the exact odd half-grid supports deterministic cofinal natural cutoffs and a multiplicity-safe HSW phase-good subsequence at the natural scale; more generally, the certified rounding argument applies when N=o(lambda L). It does not reach the critical N asymp lambda^2 L or Gevrey N asymp lambda L^3 schedules and supplies no actual finite source gate or projective alignment. Second, the checkpoint-0.71 cross-root route bypasses global parity, the odd shifted sign, the simple-line boundary denominator, and the true-ground reserve, but still requires an even complement or visible canonical lowest-even projector together with A_(N,M)=O(lambda^(-1)). An exact growing positive source-Cauchy/evaluation-Gram family satisfies the favorable scalar and even-sector inputs while keeping A_(N,M)=1/2, so checkpoint-1.53 through checkpoint-1.55 scalar inputs do not imply alignment. This is an abstract nonimplication, not an actual-zeta failure. The actual even complement/canonical overlap, projective alignment, determinant convergence, and unconditional zero claims remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.57 first-zero support-gap barrier and natural cross-root weighted-projector target

Checkpoint 1.57 first admits the strict-PASS first-zero support-gap
Geronimus alignment barrier.  On the critical schedule

\[
 N=De^LL+O_D(L),\qquad {1\over2\pi}<D<{1\over2},
\]

the exact carrier has only `O(L)` positive atoms below
`g=gamma_1^2`, but its constant-direction mean is

\[
 {\sigma_e(y)\over\sigma_e(1)}
 ={\pi^2De^L\over L}\{1+o_D(1)\}\gg g.
\]

For every sufficiently large critical `N`, a positive free-weight moment
measure can be chosen with support starting exactly at `g`, with a
Riemann--von Mangoldt main count up to `O(1)`, a positive simple
generalized odd ground, and

\[
 \Delta_N<0.
\]

All Gaussian nodes and Sturm roots remain above `g`.  The same construction
can keep the carrier polynomial arbitrarily close to the constant while

\[
 J_1={4N-1\over N^2},\qquad
 J_2={(4N-1)(4N-3)\over N^3(3N-2)}
\]

at the constant direction, so `L^2*J_1` and `L^4*J_2` vanish at critical
density.  This proves that the first-zero support gap, zero count, root
location, and free positive weights do not orient the mixed cofactor or
the negative-Sobolev reserve.  The weights are not the actual zeta weights,
the support is not the zeta divisor, and no actual-zeta failure follows.

Second, checkpoint 1.57 admits the strict-PASS natural cross-root
weighted-projector average target.  For the natural odd-halfgrid schedule
`N_p=M_p+1`, put `u_p=P_p*eta_p`,
`a_p=<kappa_p,u_p>`, `k_p=1-|<e_p,kappa_p>|^2`, and
`L_p=span{e_p,kappa_p}^perp`.  The exact codimension-two identity is

\[
 {\Delta_p\over k_p}=\|P_{{\cal L}_p}u_p\|^2,
 \qquad
 {\Delta_p\over k_p|a_p|^2}
 =\|P_{{\cal L}_p}(u_p/a_p)\|^2.
\]

At a lowest eigenvalue of arbitrary multiplicity this is exactly the
derivative-cofactor square with the common nonnegative weight
`omega_p=|d_p|^2`; on the simple branch it is the common complete-source
inverse response.  If the same finite-good set is nonempty, has positive
total visibility, and satisfies

\[
 \sum_{p\in{\cal G}_P}{\Delta_p\over k_p}
 \leq {C(\log P)^B\over P}
       \sum_{p\in{\cal G}_P}|a_p|^2,
\]

then weighted selection gives the projective rate needed by the cross-root
bridge.  Every fixed logarithmic loss is harmless.  The displayed actual
arithmetic average, good-set nonemptiness, and positive visibility are not
proved; a standard entrywise prime large sieve does not control the
adaptive high-high cofactor square.

The two focused modules pass `21/21`, and the exact nine-module
deduplicated target/direct-dependency closure passes `93/93`.  Their
declared `FROZEN` union has 14 paths, or seven note/test pairs; adding the
two target pairs gives a complete union of 18 paths, or nine pairs.
Projected canonical/raw discovery contains `4021/4079` tests in `368/373`
modules, with the unchanged five exclusions contributing `58`.  The
226-module frontier inventories `2499` tests.  With the unchanged
12-module, 128-test support block, `replay.sh` inventories 238 modules and
`2627` tests.  The expanded checkpoint-1.20 through checkpoint-1.57
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.57 admits two internal barrier/target results. First, at critical density the exact carrier has only O(L) atoms below the first-zero support, but a positive count-compatible free-weight measure can have a positive simple generalized odd ground, all Gaussian and Sturm roots above that support, and Delta_N<0, while its negative-Sobolev statistics vanish at the critical scale. This proves only that support gap, zero count, root location, and free positive weights do not force alignment; the construction is not the zeta divisor and proves no actual-zeta failure. Second, the natural cross-root statistic has exact codimension-two, multiplicity-safe derivative-cofactor, and simple complete-source inverse-response forms. A gate-restricted weighted average with any fixed logarithmic loss would select the required projective rate, provided the same good set is nonempty and has positive total visibility. The arithmetic average, gate nonemptiness, visibility, actual projective alignment, determinant convergence, and unconditional zero claims remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.58 HSW scalar/frame barrier and natural outer-shell inverse spread

Checkpoint 1.58 first admits the strict-PASS unconditional natural-halfgrid
HSW scalar-to-even-frame barrier.  On the explicitly RH-conditional
positive-zero branch, the selected shell Gram has the exact factorization

\[
 G_T^+={8W_T\over L}\mathcal C_T,
 \qquad (\mathcal C_T)_{00}=1.
\]

The frozen carrier-safe shell nevertheless has rank less than `N/4`
eventually, so its projected even-complement covariance floor is exactly
zero.  Even all positive rows through the carrier `Omega` remain rank
deficient.  At higher shells, row count alone gives neither distinctness,
phase activity, nor a quantitative frame floor.  Off RH an off-line quartet
contributes a signature `(1,1)` Krein block, so `W_T` is not an
unconditional positive subform of the complete source.  The exact
conditional and signed-source Schur reductions expose the sufficient ratio

\[
 \mathcal A\leq {q-\mu\over a^{\rm cmp}-\mu},
\]

but do not prove the actual complement gate or its required
`O(lambda^(-1))` weighted average.

Second, checkpoint 1.58 admits the strict-PASS natural outer-shell
large-sieve/inverse-spread theorem and barrier.  For odd integer indices
`p` in `C_P={p:P<p<=2P, p odd}` and `1<=R<=P/4`, the actual outer even
source column satisfies

\[
 {1\over|\mathcal C_P|}\sum_{p\in\mathcal C_P}
       \|\Pi_Rh_p\|^2
 \ll {(R+1)(\log P)^6\over P}
       +{R^3(\log P)^2\over P^2}.
\]

Thus every fixed or polylogarithmic raw prefix has the desired inverse-`P`
scale up to logarithms.  This estimate is pre-inverse and unweighted.  On
the active simple-ground branch, exact identities reduce the checkpoint-1.57
target to the missing gate-weighted adaptive inverse-spread estimate

\[
 \sum_{p\in\mathcal G_P}\chi_p
   \|\overline P_pR_ph_p\|^2
 \ll { (\log P)^B\over P}
 \sum_{p\in\mathcal G_P}\chi_p|s_p|^2.
\]

A positive synthetic source-Cauchy family has vanishing fixed prefixes but
alignment tending to one, so raw prefix decay alone cannot imply this
inverse estimate.  It is neither the actual arithmetic source nor the
natural prolate anchor.

The two focused modules pass `30/30`.  Their declared `FROZEN` union has 10
paths, or five note/test pairs; adding the targets gives a seven-module,
14-path complete union whose exact closure passes `86/86`.  Projected
canonical/raw discovery contains `4051/4109` tests in `370/375` modules;
the unchanged five exclusions contribute `58`.  The 228-module frontier
inventories `2529` tests.  With the unchanged 12-module, 128-test support
block, `replay.sh` inventories 240 modules and `2657` tests.  The expanded
checkpoint-1.20 through checkpoint-1.58 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.58 admits two theorem/barrier results. First, on the explicitly RH-conditional positive-zero branch, the selected HSW shell Gram factors as G_T^+=(8W_T/L)C_T with (C_T)_(00)=1, but the frozen carrier-safe shell has rank less than N/4 and projected even-complement covariance floor exactly zero; even all positive rows through Omega remain rank deficient. Off RH an off-line quartet gives a signature-(1,1) Krein block, so W_T is not an unconditional positive subform of the complete source. The conditional covariance-to-alignment and complete signed-source Schur reductions identify, but do not prove, the actual complement gate or O(lambda^(-1)) relative response. Second, the actual natural outer even source column satisfies the unconditional fixed/polylogarithmic-prefix mean-square bound, and exact simple-ground identities reduce the checkpoint-1.57 statistic to a gate-weighted adaptive inverse-spread mean. A positive synthetic source-Cauchy family proves that raw prefix decay alone does not imply this inverse estimate; it is neither the actual arithmetic source nor the natural prolate anchor. The actual signed covariance bound, inverse-spread estimate, finite-good-set nonemptiness, positive visibility, actual projective alignment, determinant convergence, and unconditional zero claims remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.59 natural Gevrey/Temple and adjugate/Plucker barriers

Checkpoint 1.59 first admits the strict-PASS natural Gevrey quasimode and
Temple orientation theorem/barrier.  On the odd natural halfgrid, with

\[
 \lambda_p={p\over2},\qquad M_p=\lceil\lambda_p\rceil,
 \qquad N_p=M_p+1,
\]

the genuine source-normalized prolate/arithmetic state satisfies at both
adjacent cutoffs

\[
 e_{\lambda_p,M_p}+e_{\lambda_p,N_p}
 =O\!\left(\exp\left[-c{\lambda_p\over L_p}\right]\right),
\]

and the complete sampled remainder, normalized shift, Rayleigh scalar, and
undifferentiated residual have the same exponential class.  The exact
Temple/Davis--Kahan chain reduces the missing projective estimate to

\[
 \mu_2-q\geq\sqrt\lambda\,r,
 \qquad r=\|(Q_+-qI)\kappa\|,
\]

but no actual arithmetic relative gap or canonical multiple-ground
orientation is proved.  An exact positive inversion-symmetric source-Cauchy
family retains the absolute exponential scale and favorable finite gates
while its alignment statistic is identically `1/2`; it is a structural
nonimplication, not the actual arithmetic source.

Second, checkpoint 1.59 admits the strict-PASS natural adjugate/Plucker and
inverse-Christoffel covariance reduction/barrier.  On the active simple
outer-border branch, the characteristic-derivative and determinant scales
cancel in boundary and anchor projections of the same canonical null
vector.  The remaining numerator is a positive normalized second-Plucker
norm and the automatic simple-branch anchor denominator is one bordered
determinant.  After the fixed parity congruence,
source-Cauchy displacement gives exactly two inverse-Christoffel generators
and the factor `(2N-1)^(-1)`.  Positivity supplies no uniform bound for
those generators.  The minimal missing arithmetic input is the
gate-restricted, anchor-weighted eta-free estimate

\[
 {\cal G}_P\ne\varnothing,
 \qquad
 \sum_{p\in{\cal G}_P}{\varpi_p^\kappa\over k_p}
       \|q_p\wedge Y_p\|^2
 \leq {C(\log P)^B\over P}
 \sum_{p\in{\cal G}_P}\varpi_p^\kappa
       |\langle\kappa_p,z_p\rangle|^2,
\]

where the strict simple gate makes every summand on the right positive.
Thus any nonempty strict-simple good set automatically has positive total
anchor weight; no separate eta-visibility hypothesis is needed there.  The
estimate and good-set nonemptiness remain unproved.  The canonical multiple
branch still requires mixed boundary visibility.  The formal fixed-parameter
degree audit, all-pole trace, and adjacent-block contiguity do not convert
this target into a fixed-order prime correlation or a complete
adjacent-cutoff projector estimate.

The two focused modules pass `25/25`.  Their disjoint declared `FROZEN`
union has 12 paths, or six note/test pairs; adding the targets gives an
eight-module, 16-path complete union whose exact closure passes `77/77`.
Projected canonical/raw discovery contains `4076/4134` tests in `372/377`
modules; the unchanged five exclusions contribute `58`.  The 230-module
frontier inventories `2554` tests.  With the unchanged 12-module, 128-test
support block, `replay.sh` inventories 242 modules and `2682` tests.  The
expanded checkpoint-1.20 through checkpoint-1.59 frontier, replay set, and
complete canonical suite were not rerun.

Checkpoint 1.59 admits two internal theorem/barrier results. First, on the odd natural halfgrid with adjacent cutoffs M=ceil(lambda) and N=M+1, the genuine source-normalized prolate/arithmetic state has projection error, complete sampled remainder, normalized shift, Rayleigh scalar, and undifferentiated residual O(exp(-c lambda/L)). The exact Temple/Davis--Kahan chain shows that the relative gap condition mu_2-q >= sqrt(lambda) r would imply O(lambda^(-1)) simple-ground alignment, but no such actual arithmetic gap or canonical multiple-ground orientation is proved. A positive inversion-symmetric source-Cauchy diagonal family has the same absolute exponential scale and favorable finite gates while its alignment statistic equals 1/2, so it is only a structural nonimplication, not the actual arithmetic source. Second, on the simple outer-border branch, characteristic-derivative and determinant scales cancel in boundary and anchor projections of the same canonical null vector; the numerator is a positive normalized second-Plucker norm, the automatic simple-branch anchor denominator is one bordered determinant, and source-Cauchy displacement gives exactly two inverse-Christoffel generators with the factor (2N-1)^(-1). The strict simple gate makes the anchor cofactor weight positive, so any nonempty strict-simple good set automatically has positive total anchor weight and no separate eta-visibility hypothesis is needed there. Positivity does not uniformly bound the inverse-Christoffel generators, and the checkpoint-1.58 synthetic family realizes only that obstruction. The formal fixed-mu/fixed-anchor-weight degree audit is not a literal prime-correlation theorem after substituting the adaptive bottom root, gate, and anchor cofactor weights; the all-pole trace does not isolate the ground projector; and contiguous adjacent prime blocks do not transport the complete matrix. The simple branch still needs a nonempty finite-good set and the actual eta-free gate-restricted, anchor-weighted normalized Plucker/inverse-Christoffel covariance estimate; the canonical multiple branch still needs mixed boundary visibility. Actual projective alignment, determinant convergence, and every unconditional zero claim remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.60 centered-gate/cofactor and kappa-deflated coframe barriers

Checkpoint 1.60 first admits the strict-PASS centered-gate anchor-cofactor
nonemptiness reduction.  Every simple lowest inversion-even source-Cauchy
line is axis-rooted, including when its boundary pairing vanishes, so the
repaired simple branch uses the eta-free normalization `P*kappa`.  For the
projected-prolate anchor `kappa`, Rayleigh scalar `q`, residual norm `r`, and
complement compression

\[
 H_q=P_{\kappa^\perp}(Q_+-qI)P_{\kappa^\perp}\big|_{\kappa^\perp},
\]

the map from the complete source to `H_q` is affine-linear.  The condition
`H_q>0` gives the strict lower-Ritz gate and
`0<(q-u)/r<1`; under the same strict centered-complement condition the
`r=0` branch closes projectively at once.  More generally,

\[
 H_t>0\quad\Longleftrightarrow\quad
 \mu_2(Q_+)>t\ \hbox{ and }\qquad
 D(t):=\langle\kappa,\operatorname {adj}(Q_+-tI)\kappa\rangle>0.
\]

Thus actual centered-good-set nonemptiness is exactly the cofinally-many
block occurrence of an index with `mu_2>q` and `D(q)>0`; it is not proved.
The exact Ritz ratio is a normalized cubic moment.  The determinant is a
growing-order signed source correlation, and its adaptive prime-threshold
cofactor contrast has no fixed sign.  Separate source-Cauchy counterfamilies
show that absolute quasimode/source-Cauchy information need not give a good
index and that a strict simple gate need not give eta visibility.  Neither
counterfamily is the actual arithmetic source, and the eta-free weighted
covariance estimate remains open.

Second, checkpoint 1.60 admits the strict-PASS complete-source
kappa-deflated coframe obstruction.  The source-independent scalar cancels
exactly from the centered compression, leaving one signed relative
discrepancy inequality.  Assuming RH only for the diagnostic zero-Gram
calculation, a two-dimensional rational-residue family contains, for every
anchor, a kappa-deflated unit vector which annihilates the first
`floor(theta*N)` distinct positive-zero rows and is flat to growing order at
both endpoints.  Multiplicity-safe counting and the endpoint-flat tail give

\[
 \lambda_{\min}\!\left(P_{\kappa^\perp}Q_+P_{\kappa^\perp}
      \big|_{\kappa^\perp}\right)
 \leq \exp\{-(0.4087565479\ldots-o(1))N\}.
\]

This is an upper obstruction, not a lower frame estimate or a proof of gate
failure.  The frozen one-sided estimate
`|q|=O(exp(-c*N/L))` cannot be reversed into the missing positive lower
bound.  Off RH, an off-line quartet contributes a signature-`(1,1)` Krein
block, so critical-line squares are not a positive subform of the complete
source.

The two focused modules pass `23/23`.  Their deduplicated declared `FROZEN`
union has 12 paths, or six note/test pairs; the natural Gevrey pair is the
only overlap.  Adding the targets gives an eight-module, 16-path complete
union whose exact closure passes `95/95`.  Projected canonical/raw discovery
contains `4099/4157` tests in `374/379` modules; the unchanged five
exclusions contribute `58`.  The 232-module frontier inventories `2577`
tests.  With the unchanged 12-module, 128-test support block, `replay.sh`
inventories 244 modules and `2705` tests.  The expanded checkpoint-1.20
through checkpoint-1.60 frontier, replay set, and complete canonical suite
were not rerun.

Checkpoint 1.60 admits two internal theorem/barrier results. First, every simple lowest inversion-even source-Cauchy line is axis-rooted, including the zero-boundary-pairing case, so the repaired simple branch is normalized by `P*kappa`. The centered compression `H_q` is affine-linear in the complete source; under the strict condition `H_q>0` it supplies the lower-Ritz gate and `0<(q-u)/r<1`, while the same strict centered-complement condition gives immediate projective closure when `r=0`. Moreover, `H_t>0` is equivalent to `mu_2(A)>t` together with `D(t)>0`. The Ritz statistic is an exact normalized cubic moment, whereas `D_p(q_p)` is a growing-order signed determinant correlation and its adaptive prime-threshold cofactor contrast has no fixed sign. Two synthetic source-Cauchy families show separately that absolute quasimode/source-Cauchy data do not force a centered-good index and that a strict simple gate need not give eta visibility; neither is the actual arithmetic source. The actual cofinally-many-block occurrence `mu_2,p>q_p` and `D_p(q_p)>0`, and the actual eta-free weighted covariance estimate, remain unproved. Second, the source-independent scalar cancels exactly from the complete centered compression, leaving the signed relative discrepancy inequality. Under RH only, a kappa-deflated two-dimensional rational-residue construction annihilates the first `floor(theta*N)` distinct positive-zero rows and is flat to growing order at both endpoints, proving the low-height rank deficits and the coframe upper obstruction with exponent `0.4087565479...`. This is an upper obstruction, not a lower frame estimate or centered-gate failure: the available one-sided bound `|q|=O(exp(-cN/L))` cannot be reversed into a positive lower bound. Off RH, every off-line quartet contributes a signature-`(1,1)` Krein block, so critical-line squares are not a positive subform of the complete source. Actual centered-good-set nonemptiness, the relative complete-source gate, eta-free covariance, canonical-multiple mixed visibility, projective alignment, determinant convergence, and every unconditional zero claim remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.61 halfgrid Gevrey/coframe mismatch and multiple-ground shell selector barriers

Checkpoint 1.61 first admits the strict-PASS halfgrid
Gevrey--coframe exponent mismatch barrier.  For every odd-halfgrid-roundable
outer cutoff satisfying

\[
 L^2=o(R),\qquad R=o(\lambda L),
\]

the frozen estimates for the actual source-normalized prolate anchor give

\[
 e_{\lambda,R}+|q_R|+
 \|(Q_{R,+}-q_RI)\kappa_R\|
 =O\!\left(\exp[-cR/L]\right)
\]

without assuming RH.  This is the strongest exponent class furnished by
the frozen strip estimates, not a lower bound for the true error.  Under RH
only, Lambert inversion and the kappa-deflated two-dimensional endpoint-flat
residue family give the general coframe upper coefficient

\[
 c(\theta,\rho)=4(1-\theta)\log{\theta\over\rho}
\]

and its optimizer.  Halfgrid roundability forces
`limsup rho_R<=1/2`, hence uniformly

\[
 a_R\leq\exp\{-(0.408756547856\ldots-o(1))R\}.
\]

Thus an RH-branch centered gate would require `q_R` below this scale, while
the frozen scalar estimate is only a one-sided `exp(-cR/L)` upper class.
Changing the lower bridge projection or moving within the roundable
schedule range does not remove the factor-`L` mismatch.  The formal
near-quadratic balancing scale violates `R=o(lambda*L)`.  This proves
neither an actual gate nor gate failure; off RH the positive zero Gram is
unavailable.

Second, checkpoint 1.61 admits the strict-PASS natural multiple-ground
coordinate-shell selector barrier.  Axis-rooted vectors in a multiple
lowest eigenspace, with zero adjoined, form a closed cone, and every
source-Cauchy-preserving limit of selected simple lowest lines lies in that
cone.  Legal positive rank-one selectors are restricted to coordinate
shells and one rational Cauchy-kernel curve.  An exact synthetic
`y^2+1` counterfamily shows that `P*kappa` need not be selectable even when
`P*eta=0`; it is not the actual arithmetic source.  Nevertheless every
nonzero `P*e_j^+` is axis-rooted, and `P*kappa!=0` guarantees qualitative
existence of a coordinate-selected line with nonzero anchor overlap.

Exact full- and low-overlap shell sums give the low projective formula and
a simultaneous selector.  The quantitative bridge still needs the low
visibility `Y_M`, a tail margin, and the universal `sqrt(N+1)` normalization
loss.  Full visibility and a small trace alone do not supply that rate.  At
the natural adjacent cutoff,

\[
 T\geq\max\{0,d-2\},
\]

so the trace-rate sufficient condition handles at most a double bottom
space eventually, although the trace condition is not necessary.

The two focused modules pass `22/22`.  Their declared `FROZEN` sets are
disjoint and have 10 paths, or five note/test pairs.  Adding the targets
gives a seven-module, 14-path complete union whose exact closure passes
`78/78`.  Projected canonical/raw discovery contains `4121/4179` tests in
`376/381` modules; the unchanged five exclusions contribute `58`.  The
234-module frontier inventories `2599` tests.  With the unchanged
12-module, 128-test support block, `replay.sh` inventories 246 modules and
`2727` tests.  The expanded checkpoint-1.20 through checkpoint-1.61
frontier, replay set, and complete canonical suite were not rerun.

Checkpoint 1.61 admits two internal theorem/barrier results. First, on every odd-halfgrid-roundable schedule with `L^2=o(R)` and `R=o(lambda*L)`, the frozen actual source-normalized prolate estimates give projection error, `|q_R|`, and undifferentiated residual `O(exp(-cR/L))` without RH. This is the strongest exponent class furnished by the frozen estimates, not a lower bound for the true error. Under RH only, Lambert inversion and a kappa-deflated two-dimensional endpoint-flat residue family give the general coframe upper exponent `c(theta,rho)=4(1-theta)log(theta/rho)`, its optimizer, and the schedule-uniform upper obstruction `a_R<=exp(-(0.408756547856...-o(1))R)`. Thus a centered gate would require `q_R` below that scale, whereas the proved scalar estimate is only a one-sided `exp(-cR/L)` upper class. Neither changing the lower bridge projection nor moving within the halfgrid-roundable schedule range removes the factor-`L` mismatch; the formal near-quadratic balancing scale violates `R=o(lambda*L)`. This proves neither an actual centered gate nor gate failure, and off RH the positive zero Gram is unavailable. Second, the axis-rooted vectors in a multiple lowest eigenspace, with zero adjoined, form a closed cone, and every source-Cauchy-preserving limit of selected simple lowest lines lies in that cone. Legal positive rank-one selectors are restricted to coordinate shells and the rational Cauchy-kernel curve. An exact synthetic `y^2+1` counterfamily shows that `P*kappa` need not be selectable even when `P*eta=0`; it is not the actual arithmetic source. Nevertheless every nonzero coordinate projection `P*e_j^+` is axis-rooted, and `P*kappa!=0` guarantees qualitative existence of a coordinate-selected line with nonzero anchor overlap. Exact full- and low-overlap shell identities, the low projective formula, simultaneous selector bounds, and tail transfer isolate the sufficient quantitative minimum-shell rate, its required tail margin, and its universal `sqrt(N+1)` normalization loss. Full visibility and a small trace alone do not supply that rate. At the natural adjacent cutoff the trace obeys `T>=max(0,d-2)`, so the trace-rate sufficient condition handles at most a double bottom space eventually, although the trace condition is not necessary. Actual-source low visibility, quantitative minimum-shell selection, finite-good-set nonemptiness, projective convergence, determinant convergence, and every unconditional zero claim remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.62 shrinking-collar coefficients and direct-projector adjugate alignment

Checkpoint 1.62 first admits the strict-PASS natural projected-anchor
shrinking-collar coefficient barrier.  At the strict direct cutoff

\[
 M=\lceil\lambda\rceil,
\]

the raw secular numerator has exact barycentric, endpoint-moment, and
squared-lattice recurrence formulas.  For its actual degree `d`, the
shifted polynomial

\[
 \mathscr R_r(w)={(-1)^d\over a_d}p(-(w+r)^2)
\]

converts an empty physical collar into equality of two one-sided
right-half-plane root counts.  On the regular stratum these counts are
Hurwitz-determinant sign variations; zero pivots require epsilon-Routh,
signed subresultants, or an equivalent Cauchy-index convention.

This exact criterion is a reformulation, not an actual sign theorem.  The
direct Rouche route requires a relative lower bound for the first nonzero
endpoint moment, while the frozen Gevrey estimates give upper bounds in the
opposite direction.  Exact checkerboard flat-jet and high-shell
perturbations preserve imaginary-axis positivity, any fixed coefficient
prefix, and the admitted absolute compact estimates while inserting a
prescribed collar pair or horizontally escaping root.  These families are
structural, not the actual source.  The strongest actual theorem remains
the fixed-horizontal verified-height strip.

Second, checkpoint 1.62 admits the strict-PASS natural direct-bottom-
projector adjugate alignment barrier.  If `P` is a simple visible bottom
projector and

\[
 \rho=\langle\kappa,P\kappa\rangle,
 \qquad X={P\kappa\over\rho},
\]

then the direct projective observable satisfies

\[
 \boxed{\mathcal A\leq\rho^{-1}-1.}
\]

Thus `rho=1-O(lambda^(-1))` is sufficient without the centered or lower-Ritz
gates.  With `J=adj(mu*I-A)`, the same observable has the globally safe
formula

\[
 \mathcal A={\|P_{\mathcal L}J\kappa\|^2
                 \over|\langle\kappa,J\kappa\rangle|^2},
\]

which does not depend on a possibly vanishing outer cofactor column.  At a
multiple bottom, legal coordinate-shell selection gives qualitative
visibility, but the quantitative target is a minimum of coordinate
cofactor ratios.  Analytic genericity, rank-one threshold jumps, Perron
arguments, and trace averaging do not prove this rate.  An actual-anchor
diagonal source-Cauchy family has a simple visible axis-rooted bottom and
nevertheless `mathcal A=L/K_infinity^2+o(L)`; it is synthetic, not the
actual prime source.

The two focused modules pass `23/23`.  Their disjoint declared `FROZEN`
sets have 19 unique paths: eight complete note/test pairs plus three
additional frozen bytes.  Adding the targets gives a 10-module, 23-path
complete union whose exact closure passes `103/103`.  Projected
canonical/raw discovery contains `4144/4202` tests in `378/383` modules;
the unchanged five exclusions contribute `58`.  The 236-module frontier
inventories `2622` tests.  With the unchanged 12-module, 128-test support
block, `replay.sh` inventories 248 modules and `2750` tests.  The expanded
checkpoint-1.20 through checkpoint-1.62 frontier, replay set, and complete
canonical suite were not rerun.  Two later checkpoint-1.63 candidate
modules contribute 22 tests to the live worktree but are unadmitted and
outside these projected checkpoint-1.62 inventories.

Checkpoint 1.62 admits two internal theorem/barrier results. First, at the strict direct cutoff `M=ceil(lambda)`, the projected-anchor secular numerator has exact barycentric, endpoint-moment, and lattice-recurrence formulas, while a shifted Routh polynomial gives a necessary-and-sufficient empty-collar criterion through one-sided Hurwitz sign variations, with epsilon-Routh or signed-subresultant treatment at zero pivots. Direct Rouche closure requires a relative lower bound for the first nonzero endpoint moment; the frozen Gevrey bounds are upper bounds in the opposite direction. Exact checkerboard flat-jet and high-shell perturbations show that imaginary-axis positivity, every fixed coefficient prefix, endpoint upper bounds, and absolute compact control do not supply a uniform Routh-minor margin. These families are structural and are not the actual source; the strongest actual theorem remains the fixed-horizontal verified-height strip, not a cofinal shrinking collar. Second, on a simple visible even bottom, `A<=rho^(-1)-1`, so `rho=1-O(lambda^(-1))` is sufficient without the centered or lower-Ritz gates, and the same observable is the globally safe `J*kappa` adjugate/Gram ratio. At a multiple bottom, legal coordinate-shell cofactor selection is qualitatively visible and the quantitative obligation is a minimum of coordinate ratios. Analytic genericity, rank-one threshold jumps, Perron arguments, and trace averaging do not prove that rate. An actual-anchor diagonal source-Cauchy family has a simple visible axis-rooted ground while `A=L/K_infinity^2+o(L)`; it is synthetic, not the actual prime source. The actual one-sided Routh determinant margin, actual finite-good/cofinal simple index, denominator reserve, and `O(lambda^(-1))` relative cofactor orientation remain unproved. No determinant convergence, unconditional zero theorem, RH proof or converse, or de Bruijn--Newman bound follows. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.63 Jensen wedge and cutoff-free ground-alignment dichotomy

Checkpoint 1.63 first admits the strict-PASS Jensen hyperbolicity-wedge
diagonal-limit theorem/barrier, conditional on the precisely pinned external
arXiv v1 theorem and asymptotics.  The classical unshifted normalization
has the locally uniform limit `E`, and hence `Xi` after `w=-t^2`.  Every
joint wedge sequence instead satisfies `d/n->0`; on the only nondegenerate
origin scale,

\[
 {J^{d,n}(w/(dR_{1,n}))\over\gamma(n)}\longrightarrow e^w,
 \qquad w=-t^2\Longrightarrow e^{-t^2}.
\]

At the paper's centered scale, a positive proportion of zeros remains in
each interior compact interval, excluding every nonzero locally uniform
entire limit.  Exact differentiation shows that the shifted polynomial is
an almost-total derivative of an unshifted one, whose reconstruction needs
an uncontrolled degree-`n-1` prefix.  Reverse integration is not
hyperbolicity preserving, while coefficientwise inverse shift would require
a new RH-strength multiplier or interlacing theorem.

Second, checkpoint 1.63 admits the strict-PASS cutoff-free prolate
ground-alignment RH dichotomy.  The complete anchor lies in the operator
domain and the locked halfgrid estimates pass to the cutoff-free operator:

\[
 {q_{\lambda_p,\infty}\over d_{4,p}L_p}
 \longrightarrow {\Gamma_0\over A_4^2}>0,
 \qquad r_{\lambda_p,\infty}\longrightarrow0.
\]

For the complete bottom projector,

\[
 |\mu_\lambda-q_{\lambda,\infty}|\sqrt{\rho_\lambda}
 \leq r_{\lambda,\infty}.
\]

Consequently,

\[
 \limsup_{p\to\infty}\rho_{\lambda_p}>0
 \Longrightarrow \lim_{\lambda\to\infty}\mu_\lambda=0
 \Longrightarrow \mathrm {RH},
 \qquad
 \mathrm {RH}\text{ false}\Longrightarrow
 \rho_{\lambda_p}\longrightarrow0.
\]

This is a dichotomy, not a proof of its nonvanishing premise.  The family
is a domain exhaustion of the global translation-invariant Weil form, not
a rank-one or norm-resolvent oscillator limit.  An even-block overlap alone
does not supply full-ground parity ordering, and the actual full-ground
overlap or spectral isolation remains unproved.

The focused pair passes `22/22`.  Pair A has no local `FROZEN` dependency;
Pair B has 12 declared local dependency paths.  Adding the four targets
gives a 16-path, seven-module complete union whose exact closure passes
`81/81`.  Projected canonical/raw discovery contains `4166/4224` tests in
`380/385` modules; the unchanged five exclusions contribute `58`.  The
238-module frontier inventories `2644` tests.  With the unchanged
12-module, 128-test support block, `replay.sh` inventories 250 modules and
`2772` tests.  The expanded checkpoint-1.20 through checkpoint-1.63
frontier, replay set, and complete canonical suite were not rerun.

The Jensen input is Jonathan Holland, *A new hyperbolicity wedge and a
joint semicircle limit for Jensen polynomials of Riemann's xi-function*,
arXiv:2608.08682v1.  Its observed PDF digest is a provenance pin only: the
PDF remains external and unvendored and is not independently certified.
The cutoff-free pair directly freezes the already-vendored CCM-ZST v1 PDF
and eleven internal dependency paths; it adds no new external or vendored
byte, source lock, zero table, numerical ground, artifact, or computation.

Checkpoint 1.63 admits two theorem/barrier results. First, conditional on the precisely pinned external arXiv v1 hyperbolicity-wedge theorem and asymptotics, the classical unshifted Jensen normalization tends to E, and to Xi after w=-t^2, whereas every joint wedge sequence has d/n->0. At the only nondegenerate origin scale the diagonal limit is exp(w), hence exp(-t^2), and at the paper's centered scale a positive proportion of zeros in compact intervals excludes every nonzero locally uniform entire limit. The shifted polynomial is an almost-total derivative whose exact inverse requires an uncontrolled degree-(n-1) prefix; general reverse integration fails, and the coefficientwise inverse shift is a new RH-strength multiplier/interlacing theorem, not an admitted consequence. The external preprint is unvendored and not independently certified; no local GUE, unshifted Jensen hyperbolicity, inverse-shift preservation, zero theorem, converse, or de Bruijn--Newman bound follows. Second, the complete cutoff-free prolate anchor lies in the operator domain, its locked halfgrid scalar tends to zero at the stated positive d4L scale and its residual tends to zero, and the full-bottom projector satisfies |mu-q|sqrt(rho)<=r. Thus limsup rho>0 along the halfgrid forces the full monotone ground to zero and hence RH by pinned CCM Corollary 3.8, while RH false forces rho->0. This is a dichotomy, not a proof of its nonvanishing premise. The lambda-family is domain exhaustion of the global translation-invariant Weil form, not a rank-one or norm-resolvent oscillator limit; an even-block overlap alone lacks parity ordering. The actual full-ground overlap lower bound, simplicity/parity ordering, and required spectral isolation/complement bound remain unproved. No determinant convergence, unconditional zero-location theorem, RH proof or converse follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.64 cutoff-free frames and centered phase remainder

Checkpoint 1.64 admits three strict-PASS theorem/barrier pairs:

- `notes/CUTOFF_FREE_MULTI_ANCHOR_GROUND_FRAME_BARRIER.md`, SHA-256
  `2e07843d54f00bce9e53afadc0b434efbaf8f97da95dadda54225de6cfecb34d`,
  and its test, SHA-256
  `0fdc307a051d50ff4ece21ae8b01f89b745a14788f093ec4127f5da6026bde9f`;
- `notes/ACTUAL_PHASE_VOLUME_CENTERED_PNT_REMAINDER_REDUCTION_BARRIER.md`,
  SHA-256
  `2b2a40a4ec087c77145b45fc54d8a5782a85ecd122b2d599d2c2d8a067b714f1`,
  and its test, SHA-256
  `7fbcdf15dde20d3d2a00303f74d5441ee143af74ae269992fe79b1fb0c97456f`;
- `notes/CUTOFF_FREE_WEIGHTED_RADICAL_COFRAME_REDUCTION_BARRIER.md`,
  SHA-256
  `c84bc4ed8632aeedb8208e699350e0895a4437912b8ba735f10315b5cf1b7d8c`,
  and its test, SHA-256
  `d6d83b1a045b96da8ad7a49753a05f5981e9744b04ecb95470fbd5332bb87c11`.

The first pair proves the exact complete-bottom family estimate

\[
 (|\mu|-q_*)_+^2\sum_j\rho_j\leq\sum_jr_j^2
\]

and its operator-frame version, together with the explicit locked-anchor
residual `O(lambda^8 L exp(-2 pi lambda^2))`.  It converts either the
residual-weighted family correlation or a full-bottom operator frame into
the already-pinned monotone CCM implication, but proves neither missing
lower bound.  The spectral-flow, resolvent-residue, paired-translation, and
translation-average formulas are exact; the phase-volume, Shannon-scale,
coframe, source-Cauchy, and prime-jump comparisons isolate barriers rather
than an unconditional ground capture.

The second pair splits the actual prime polynomial exactly as
`D_lambda=M_lambda+R_lambda`, with `R_lambda` the Stieltjes transform of the
centered Chebyshev error.  The continuous main term and the admitted
low-time range contribute `o(lambda^2/log lambda)` on both retained
schedules.  The remaining sufficient target is the positive high-time
centered-remainder mass.  The pinned PNT error and admitted moment methods
do not prove that bound, and no reverse inequality is asserted.

The third pair defines the basis-invariant weighted coframe

\[
 \Lambda_F=\lambda_{\min}^+(T_F\Delta_F^\dagger T_F^*)
\]

and proves by the minimum-defect right inverse that
`|mu_lambda|<=C_F/sqrt(Lambda_F)`.  For a hard prefix it proves
`Lambda_F>=gamma_m/(8 lambda^4 d_m)` and the exact KRD stopping line.
The finite-section residual is polynomial, but a uniform cutoff-free family
graph transfer and normalized leading capture remain open.  A rational
orientation family shows why the full row floor and defect spectrum alone
cannot supply them.

The focused modules pass `34/34`, and the exact eleven-module deduplicated
target/direct-dependency closure passes `142/142`.  Projected
canonical/raw discovery contains `4200/4258` tests in `383/388` modules;
the unchanged five exclusions contribute `58`.  The 241-module frontier
contains `2678` tests, and the 253-module replay inventory contains `2806`,
including the unchanged 12-module, 128-test support block.  The expanded
canonical/frontier/replay suites were not rerun.

Checkpoint 1.64 admits three theorem/barrier results. First, every finite family of cutoff-free domain anchors with real targets satisfies the multiplicity- and parity-safe full-bottom inequality (|mu|-q_*)_+^2 sum_j rho_j<=sum_j r_j^2, while a bottom frame P K K^* P>=c_lambda P gives (|mu|-q_*)_+<=||E||/sqrt(c_lambda). The locked label-4 anchor has r_(lambda,infinity)<=C lambda^8 L exp(-2 pi lambda^2), so q_*->0 and (sum_j r_j^2)/(sum_j rho_j)->0 imply RH through the pinned monotone CCM route. This is conditional and proves no actual correlation. Rank-one load derivatives, the bottom resolvent residue, paired translates, and the translation average identify exact formulations, but no uniform frame rate follows; current phase-volume/coercivity bounds, the separate compressed-trace schedule, the Shannon scale, full-source coframes, the source-Cauchy countermodel, and finite threshold jumps do not close capture. Second, the exact split D_lambda=M_lambda+R_lambda removes the continuous PNT density before absolute values and gives a one-way phase-volume bound by an explicit polynomial main term plus a centered remainder statistic. On both bounded-gap and logarithmic retained schedules the main and low-time terms are o(lambda^2/log lambda), reducing the missing input to the high-time positive mass of the centered Chebyshev-error Mellin transform. The pinned FKS bound controls only a much shorter harmless window, and admitted mean-square or higher-moment methods do not prove the required remainder bound or any converse. Third, the weighted coframe Lambda_F=lambda_min^+(T_F Delta_F^dagger T_F^*) and residual constant C_F give |mu_lambda|<=C_F/sqrt(Lambda_F) by the exact minimum-defect right inverse, with no source-dimension loss. For a hard leading prefix, Lambda_F>=gamma_m/(8 lambda^4 d_m), so 8 C_F^2 lambda^4 d_m/gamma_m->0 implies RH conditionally; KRD reduces polynomial residual and capture losses to a prefix O((log lambda)^2) below the Shannon edge. The finite-section residual is polynomial, but the uniform cutoff-free graph transfer and actual normalized capture are unproved, and an exact orientation family shows that the full row floor and defect spectrum alone do not control them. The actual multi-anchor correlation/frame, centered high-time remainder bound, polynomial phase volume, dangerous-projector capture, weighted radical coframe rate, uniform graph transfer, parity order, determinant convergence, unconditional zero theorem, RH proof or converse, and de Bruijn--Newman bound remain unproved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.65 graph transfer, centered fourth moment, and bridge leverage

Checkpoint 1.65 admits exactly five new strict-PASS theorem/barrier pairs,
in dependency order:

- `notes/CUTOFF_FREE_UNIFORM_RADICAL_GRAPH_TRANSFER_THEOREM.md`, SHA-256
  `aa69ac86e6b5d5256ba3b243b9fc07d9c5ad49bed7a70e3d570d0c57325bce18`,
  and its test, SHA-256
  `b2708c8f72ce8bad831b2aea44c49ef3a8ec5f9c38551c288a1c982d097ee727`;
- `notes/CUTOFF_FREE_FULL_SOURCE_ADJOINT_PROLATE_CAPTURE_BARRIER.md`,
  SHA-256
  `157bffc55aeec592c263d5973effe1b9506e02dd97311652ecb2fdee0c3ff0e9`,
  and its test, SHA-256
  `d7f70dffbd10021ce7d6e8887d10589a482b2dc64c9ebbe8c48cc35568c233ae`;
- `notes/ACTUAL_CENTERED_REMAINDER_PRIME_FOURTH_MOMENT_LOWER_BARRIER.md`,
  SHA-256
  `920b6434cc89c663ae95f6f7803780cd164e99b8e5cdc82c2de1a3655171035a`,
  and its test, SHA-256
  `de1e282b5106d0dc3ecb95a19773433baff029f1ff7cb5c45229e86374696fe7`;
- `notes/CUTOFF_FREE_DENSE_MIXED_PREFIX_BRIDGE_RESIDUAL_BARRIER.md`,
  SHA-256
  `909380b93eb72cffd3841a592f96aa0cd1d72285f799210bf4244cdf82c2ed0f`,
  and its test, SHA-256
  `59813cca879d08d482bf2268e6c27cd8693d3e635eb59ec461aae50ca51265f2`;
- `notes/CUTOFF_FREE_BRIDGE_LEVERAGE_RANK_ONE_INNOVATION_REDUCTION.md`,
  SHA-256
  `808c314d6b0cf1926ddf8b0a5b83c324ccbbc252d18efea283781fefd1751097`,
  and its test, SHA-256
  `2c79244dd68e9fd56ddb67f7278f4572cb72bae9803b82047ccf9ad58196faba`.

The graph-transfer theorem closes the residual-map side of the
phase-separated hard-prefix criterion: uniformly before the Shannon edge,
the cutoff-free graph tail is exponentially small and the exact residual
constant is polynomial.  It does not prove the remaining normalized
bottom-capture lower bound.

The full-source adjoint pair retains the evenization factor `1/2`, the
zero-integral rank-one correction, and the exact prolate coefficient Gram.
The ground equation gives an upper evacuation estimate, not a lower capture
bound.  An exact-arithmetic-map diagonal-well countermodel shows that the
full-source floor, parity, and remote coercivity do not supply the missing
orientation.

The centered-remainder pair proves unconditionally that, for every fixed
`alpha` with `1-1/(8 sqrt(2))<alpha<1`, both the full and high-time centered
statistics are `Omega(lambda^4 log(lambda^2))`.  Hence the previously
proposed `O(lambda^2/log(lambda^2))` sufficient upper bound is false in this
range.  The phase-volume decomposition is one-way, so this is not a lower
bound for the actual phase volume.

The dense mixed-prefix pair removes the phase-separated density caveat and
proves the mixed graph tail is exponentially small.  The actual bridge,
however, makes the complete modal-defect residual constant exponentially
large.  The safe two-row bump-aware metric leaves the scalar normalized
angle ratio bounded away from zero even at perfect capture; only its exact
weighted stopping line remains viable and unproved.

The bridge-leverage pair diagonalizes the source metric and proves

\[
 S_M=S_F+|v_b\rangle\langle v_b|,
 \qquad
 \theta_b=1-r_b(w_b)={\det S_F\over\det S_M}.
\]

Thus `theta_b>0` is the exact finite-bottom bridge-elimination criterion,
`kappa_b=||w_b|| ||ell_b B_M||<1` is a quantitative sufficient condition,
and one bridge cannot repair bulk nullity at least two.  Under a proved
codimension-one bulk gap the remaining statistic is the single corrected
adjoint coefficient
`|beta_2-(I_2/I_0)beta_0|/sqrt(s_b)`.  No frozen input bounds that scalar on
the actual missed bottom line.

The five focused modules pass `61/61`.  With `PYTHONPATH=src`, the exact
19-module deduplicated target/direct-dependency closure passes `254/254`
under `python3 -B`.  Projected canonical/raw discovery contains
`4261/4319` tests in `388/393` modules; the unchanged five exclusions
contribute `58`.  The 246-module frontier contains `2739` tests, and the
258-module replay inventory contains `2867`, including the unchanged
12-module, 128-test support block.  Expanded canonical/frontier/replay
suites were not rerun.

The fourth-moment proof uses Montgomery and Vaughan, *Hilbert's
Inequality*, JLMS (2) 8 (1974), 73--82, Corollary 2, equations
(1.8)--(1.9).  That paper is external and unvendored; no local source lock
or digest is claimed.  The dependency union otherwise reuses existing
internal bytes, `P3_SOURCE_LOCK.json`, and the already-vendored FKS v3 PDF.
No new vendored byte, source lock, artifact, zero table, numerical ground,
cached matrix, or external computation is admitted.

Checkpoint 1.65 admits five theorem/barrier results. First, the phase-separated cutoff-free graph tail is uniformly exponentially small before the Shannon edge and the exact residual constant is polynomial, but the normalized bottom-capture lower bound remains unproved. Second, the exact full-source adjoint and rank-one zero-integral coefficient Gram give only an upper ground-evacuation estimate, while an exact-arithmetic-map coercive-well countermodel excludes capture from the frozen orientation-free inputs. Third, for every fixed alpha with 1-1/(8 sqrt(2))<alpha<1, the full and high-time centered remainder statistics are Omega(lambda^4 log(lambda^2)), so the proposed O(lambda^2/log(lambda^2)) sufficient upper target is false there; the one-way phase-volume split gives no phase-volume lower bound. Fourth, the dense mixed source is genuinely dense and has an exponentially small graph tail, but its bridge makes the modal-defect residual exponentially large, and the bump-aware scalar normalized-angle route cannot vanish even at perfect capture; only the exact augmented weighted stopping line remains. Fifth, the augmented bottom Gram is the phase-bulk Gram plus one rank-one bridge innovation, with exact determinant-ratio and kappa elimination criteria and a codimension-one corrected-adjoint scalar, but no actual leverage lower bound is proved. The actual normalized capture, augmented weighted decay, bridge leverage, centered phase-volume lower bound, parity ordering, determinant convergence, unconditional zero theorem, RH proof or converse, and de Bruijn--Newman bound remain unproved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.66 centered prime third moment and half-alpha barrier

Checkpoint 1.66 admits the strict-PASS pair
`notes/ACTUAL_CENTERED_REMAINDER_PRIME_THIRD_MOMENT_HALF_ALPHA_BARRIER.md`,
SHA-256
`0d9a8326abe3752e2cdaf13333c7e768816a1d0d3773df998842b1333d313287`,
and
`tests/test_actual_centered_remainder_prime_third_moment_half_alpha_barrier.py`,
SHA-256
`acf9f91fd1dd8b76adee84eeaa22ba42dfb05b6c70282aaa04eb88dc509499d9`.

On `I_x=[Ax^2,2Ax^2]`, prime and semiprime frequency supports are
disjoint.  Four-phase polarization of the inherited Montgomery--Vaughan
mean-value estimate therefore gives

\[
 \mathbb E_x(P_x^2\overline {P_x})=O_A(L^2),
 \qquad
 \mathbb E_xY_x^3=O_A(L^2)=o(L^3).
\]

After normalization by the exact second-moment scale, the prime polynomial
has asymptotic mean zero, variance one, vanishing third moment, and uniformly
bounded fourth moment.  The compact deterministic moment lemma then proves

\[
 \liminf_{x\to\infty}\mathbb E_x(Z_x-c)_+>0
 \qquad(0<c<1).
\]

The centered split threshold satisfies

\[
 {q_x\over\sigma_x}\longrightarrow2(1-\alpha).
\]

Consequently, for every fixed `A>0` and every fixed `1/2<alpha<1`,

\[
 \mathfrak R_{\lambda,\alpha},\quad
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg_{A,\alpha}\lambda^4\log(\lambda^2).
\]

Thus the proposed `O(lambda^2/log(lambda^2))` sufficient upper route is
false throughout that range.  The symmetric two-point `+/-1` model is
sharp for the stated moment data at `alpha=1/2`, so nothing is proved at or
below the endpoint.  The phase-volume comparison remains one-way and gives
no actual phase-volume lower bound.

The focused module passes `14/14`, and the exact three-module
target/direct-dependency closure passes `37/37` under `PYTHONPATH=src
python3 -B`.  Projected canonical/raw discovery contains `4275/4333` tests
in `389/394` modules; the unchanged five exclusions contribute `58`.  The
247-module frontier contains `2753` tests, and the 259-module replay
inventory contains `2881`, including the unchanged 12-module, 128-test
support block.  Expanded canonical/frontier/replay suites were not rerun.

The direct dependency union contains four paths, exactly the frozen
phase-reduction and fourth-moment note/test pairs.  Adding the target gives
six paths, or three complete pairs.  No new external paper, source-lock
JSON, vendored source, artifact, zero table, numerical ordinate, cached
matrix, source sample, serialized numerical artifact, or external
computation is added.  Montgomery--Vaughan Corollary 2, equations
(1.8)--(1.9), remains external, unvendored, unhashed, and inherited through
the fourth-moment pair; the P3/FKS lineage is transitive only.

Checkpoint 1.66 proves, by prime/semiprime support disjointness and four-phase Montgomery--Vaughan polarization, that the normalized prime third moment vanishes. Together with the frozen second- and fourth-moment estimates, a compact moment lemma forces positive excess above every fixed normalized level c<1. Therefore, for every fixed A>0 and 1/2<alpha<1, both the full and high-time centered-remainder statistics are Omega_(A,alpha)(lambda^4 log(lambda^2)), so the proposed O(lambda^2/log(lambda^2)) sufficient upper target is false throughout that range. The symmetric two-point endpoint model shows that the stated moment data do not cross alpha=1/2; nothing is proved for 0<alpha<=1/2. The frozen phase-volume comparison is one-way, so no actual phase-volume lower bound follows. Polynomial phase volume, parity ordering, determinant convergence, an unconditional zero theorem, RH proof or converse, and a de Bruijn--Newman bound remain unproved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.67 bridge mixed-adjoint-tail prefactor reduction

Checkpoint 1.67 admits the strict-PASS pair
`notes/CUTOFF_FREE_BRIDGE_MIXED_ADJOINT_TAIL_PREFACTOR_REDUCTION.md`,
SHA-256
`53dd9fefd8cc05a29cd3e0a043e6f86f8bbdc7545d2c203d29bc59cbbe1a04f8`,
and
`tests/test_cutoff_free_bridge_mixed_adjoint_tail_prefactor_reduction.py`,
SHA-256
`e532a958742feda3efe00adc37e1ea2879a3676f23b63a47c238e348aaf5b17c`.

For the actual omitted bridge `b=h_2-(I_2/I_0)h_0`, its ordinary-source
innovation against the phase-separated zero-integral prefix is exactly

\[
 b_\perp=I_2\left({q_-\over s_-}-{q_+\over s_+}\right),
 \qquad
 \varrho_b=\|b_\perp\|^2
 =I_2^2\left({1\over s_-}+{1\over s_+}\right).
\]

The defect-orthogonal representative of the same quotient has uniformly
bounded ordinary norm.  On a unit codimension-one missed line, with
`z_0=A_(lambda,0)^*e_0`, the bridge orientation is therefore

\[
 a_b^2={\varrho_b\over s_b}\|P_Mz_0\|^2,
 \qquad
 {\varrho_b\over s_b}\gg{1\over\lambda d_2}
 \asymp {e^{4\pi\lambda^2}\over\lambda^6}.
\]

Thus the source/defect prefactor is favorable rather than the remaining
loss.  The exact scalar gate is the combined-phase adjoint-tail threshold

\[
 \Theta_{\rm mix}(e_0)<1
 \quad\Longleftrightarrow\quad
 \mathfrak q_E(e_0)>\delta_E,
 \qquad
 \delta_E=1-{\|P_E1\|^2\over2\lambda}.
\]

If `Theta_mix<=1-eta`, the full-source row floor gives

\[
 a_b^2\gtrsim {\eta e^{4\pi\lambda^2}\over\lambda^{10}},
 \qquad
 \omega_b\gtrsim{\eta\over\lambda^7}.
\]

Together with a codimension-one phase-bulk gap `alpha`, this yields

\[
 S_M\succeq{1\over2}\min\{a_b^2,\alpha\omega_b\}I_X.
\]

Hence polynomial `alpha` and polynomial strict tail reserve `eta` would
give a polynomial augmented bottom floor.  This is a one-vector condition
on the unique missed line, not the earlier separate-phase operator-norm
tail condition.

No frozen input proves the strict reserve or even nonvanishing of the exact
actual missed-line scalar.  At an allowed near-Shannon prefix, the constant
tail has `delta_E>=1/(16*pi^2*lambda^2)`, while the frozen literal-adjoint
diagonal-well construction has `mathfrak q_E<delta_E` eventually.  It
therefore forces `Theta_mix>1` in that synthetic model, proving a structural
nonimplication only.  The model is not the actual Weil operator and is not
a counterexample to actual bridge nonvanishing.  On the genuinely singular
codimension-one branch, `theta_b=0` and `kappa_b>=1`; the old sufficient
condition `kappa_b<1` belongs only to the alternative already-onto branch.

The focused module passes `17/17`.  With `PYTHONPATH=src`, the exact
eight-module target/direct-dependency closure passes `129/129` under
`python3 -B`; adding the inherited high-Fourier coercivity verifier gives
an optional nine-module check passing `138/138`.  Projected canonical/raw
discovery is `390/4292` and `395/4350`; frontier/replay is `248/2770` and
`260/2898`; support remains `12/128` and exclusions remain `5/58`.
Expanded canonical/frontier/replay suites were not rerun.

The declared direct dependency union has 17 paths: seven complete note/test
pairs, the unpaired `notes/GROWING_WINDOW_THEOREM.md`, and the existing
`P2_SOURCE_LOCK.json` and `PROLATE_DEFECT_SOURCE_LOCK.json`.  Adding the
target pair gives 19 paths: eight complete pairs plus those three extra
bytes.  All 17 dependency digests were rechecked exactly.

No new external paper, source-lock JSON, vendored source, artifact, zero
table, numerical ordinate, cached matrix, source sample, serialized
numerical artifact, or external computation is added.  The already-pinned
Karnik--Romberg--Davenport/Boulsane--Bourguiba--Karoui transition lineage is
inherited through `P2_SOURCE_LOCK.json`, and the already-pinned Slepian
fixed-index lineage is inherited through `PROLATE_DEFECT_SOURCE_LOCK.json`.
All other provenance is inherited through frozen internal dependencies.

Checkpoint 1.67 computes the exact ordinary-source bridge innovation and defect-orthogonal representative, proves a uniformly bounded representative norm and an exponentially favorable one-sided source/defect prefactor, and reduces codimension-one bridge repair to one scalar combined-phase adjoint-tail excess above the constant-tail threshold. A polynomial strict reserve together with a polynomial phase-bulk gap would give a polynomial augmented bottom floor. No frozen input proves the reserve, the codimension-one phase-bulk premise, or even nonvanishing of the actual missed-line scalar. The literal-adjoint diagonal-well model proves only structural nonimplication and is not the actual Weil operator or a counterexample to actual nonvanishing. Actual bridge leverage, bottom-projector capture, cutoff-free determinant convergence, an unconditional zero theorem, RH proof or converse, and a de Bruijn--Newman bound remain unproved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.68 long-block Hermite and multiplier-dangerous prolate cross-angle barriers

Checkpoint 1.68 admits two independently audited strict-PASS pairs:

| Target | SHA-256 |
|---|---|
| `notes/ACTUAL_CENTERED_REMAINDER_LONG_BLOCK_HERMITE_MOMENT_BARRIER.md` | `1997f8b14c5f90977f744788d069f6e771da078c06562dac2d78c671c01a95c1` |
| `tests/test_actual_centered_remainder_long_block_hermite_moment_barrier.py` | `cbbc300b9a050ac161d9f8feae996947b522043ae50663799dfc194ed4d3dd2d` |
| `notes/CUTOFF_FREE_MULTIPLIER_DANGEROUS_PROLATE_CROSS_ANGLE_BARRIER.md` | `bfabbf6b7c4879d027e4ea1be8e1103b22468519b2bd68aa0d121642000120ed` |
| `tests/test_cutoff_free_multiplier_dangerous_prolate_cross_angle_barrier.py` | `dd91d397332f3096f531e0c8742e1752891d53c1c257a9a78d82dcef67dc002a` |

For `x=lambda^2`, an integer `k>=2`, and the translated block
`I_(x,k)=[A x^k,2A x^k]`, the frozen Montgomery--Vaughan mean-value
theorem controls the normalized real prime polynomial through degree
`2k`.  If `rho_k` is the largest zero of the probabilists' Hermite
polynomial `He_k`, Hermite localization gives

\[
 k(1-\alpha)<\rho_k
 \quad\Longrightarrow\quad
 \mathfrak R_{\lambda,\alpha},
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg_{A,\alpha,k}x^k\log x.
\]

Among this integer translated-block hierarchy, `k=4` is optimal and

\[
 \rho_4=\sqrt{3+\sqrt6}.
\]

Consequently

\[
 \alpha>1-{\sqrt{3+\sqrt6}\over4}
 \quad\Longrightarrow\quad
 \mathfrak R_{\lambda,\alpha},
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg_{A,\alpha}\lambda^8\log(\lambda^2).
\]

This includes `alpha=1/2` and a nonempty fixed interval below it, but it
does not prove the whole `alpha<=1/2` regime and proves nothing at or below
`1-sqrt(3+sqrt(6))/4`.  On the original `x^2` block, even the exact first
four Gaussian moments admit a three-atom level-one nonimplication model;
the fifth mixed moment is not controlled by the frozen theorem.

For a bottom space `Y`, the second pair normalizes the full-source
additive-prolate capture by

\[
 R_Y=P_YAA^*P_Y\big|_Y,
 \qquad
 J_Y=A^*P_YR_Y^{-1/2},
 \qquad
 J_Y^*J_Y=I_Y,
\]

and identifies the exact Gram

\[
 \mathfrak q_E(Y)=s_{\min}(P_EJ_Y)^2.
\]

Thus `dim Y>dim E` forces zero capture.  The actual multiplier comparison
does prove a physical dangerous-space angle: for
`Pi_t=1_[t,infinity)(mathcal V)`,

\[
 \|\Pi_t y\|^2\geq
 {g+\kappa-t\over\|\mathcal V\|-t}\|y\|^2.
\]

It does not survive projection to the additive-prolate prefix without a
new cross-angle input.  With the exact dangerous and safe pieces `D_E`
and `S_E`, the available stopping line is only

\[
 \mathfrak q_E(Y)^{1/2}
 \geq[\Delta_E]_+,
 \qquad
 \Delta_E=s_{\min}(D_E)-\|S_E\|.
\]

The checkpoint-1.67 one-line bridge gate remains the sharper exact
condition `mathfrak q_E(e_0)>delta_E`.  A synthetic critical-edge symbol
keeps the literal source map, prolate prefix, parity, pole, and full-source
normalization while forcing zero capture by rank or a missed line.  It is
not the actual full von-Mangoldt Weil symbol and proves structural
nonimplication only.

The two focused modules pass `30/30`.  With `PYTHONPATH=src`, the exact
ten-module deduplicated target/direct-dependency closure passes `149/149`
under `python3 -B`.  Projected canonical/raw discovery is `392/4322` and
`397/4380`; frontier/replay is `250/2800` and `262/2928`; support remains
`12/128` and exclusions remain `5/58`.  Expanded canonical/frontier/replay
suites were not rerun.

The two direct dependency sets are disjoint and contain 16 paths, exactly
eight complete note/test pairs.  Adding the four targets gives 20 paths,
or ten complete pairs.  Pair A inherits the already-disclosed
Montgomery--Vaughan 1974 mean-value theorem through frozen internal pairs;
that primary source remains external, unvendored, unhashed, and
non-byte-bound.  Pair B adds no independent external input.  All KRD,
BBK, Slepian, P3/FKS, and source-lock lineage is transitive only.  No new
external paper, source-lock JSON, vendored byte, artifact, zero table,
numerical ordinate, cached matrix, source sample, serialized numerical
artifact, or external computation is added.

Checkpoint 1.68 proves Gaussian prime moments through degree 2k on translated x^k blocks and a Hermite-localized centered-remainder lower bound whenever k(1-alpha)<rho_k. The optimal integer member is k=4, giving Omega(lambda^8 log(lambda^2)) for every fixed alpha>1-sqrt(3+sqrt(6))/4, including alpha=1/2 and a nonempty range below; the method proves nothing at or below that threshold, and the phase-volume comparison remains one-way. Separately, it gives the exact normalized prolate capture Gram, multiplicity obstruction, actual multiplier physical-angle bound, and cross-angle stopping line. The synthetic critical-edge model proves structural nonimplication only and is not the actual full von-Mangoldt Weil symbol. No frozen input proves the actual source-prefix cross-angle, bottom-space dimension bound, missed-line bridge gate, or phase-bulk premise. Actual phase volume, bottom-projector capture, determinant convergence, an unconditional zero theorem, RH proof or converse, and a de Bruijn--Newman bound remain unproved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.69 fractional odd moments, shifted top moments, and actual-dangerous adjoint regularity

Checkpoint 1.69 admits three independently audited strict-PASS pairs:

| Target | SHA-256 |
|---|---|
| `notes/ACTUAL_CENTERED_REMAINDER_FRACTIONAL_BLOCK_ODD_MOMENT_UI_BARRIER.md` | `c5510f3491d2d6ff173581bd6be540edc1b8b5c4bbb0afb56b636bfd68b51f19` |
| `tests/test_actual_centered_remainder_fractional_block_odd_moment_ui_barrier.py` | `71e1480ae0e4265ec4e45c3eb181a2682ee070bc8382eba815c3543a9f626871` |
| `notes/ACTUAL_CENTERED_REMAINDER_SHIFTED_CORRELATION_TOP_MOMENT_UI_BARRIER.md` | `8ab0f30e32fe715a4f839228f5d05dc581292c99c2a04f42804f0ff4d2d878d9` |
| `tests/test_actual_centered_remainder_shifted_correlation_top_moment_ui_barrier.py` | `ecaf4f1eaaab4a3a146c277eb0897e79d5323bfe9b79709bbc5cac5d423bd787` |
| `notes/CUTOFF_FREE_ACTUAL_DANGEROUS_ADJOINT_REGULARITY_BARRIER.md` | `76bed7bff24f2bdced30c357d3a61b7cbcc16964085901070f723035aeb92337` |
| `tests/test_cutoff_free_actual_dangerous_adjoint_regularity_barrier.py` | `034fe9fa18d0ae587ac3d9c5c3f9e0179a5cbf80dd96ef5aab21e5034f8223ec` |

For a fixed real exponent `s>1`, the normalized prime polynomial on
`[A x^s,2A x^s]` has Gaussian moments through the exact guaranteed degree

\[
 M(s)=\lfloor2s\rfloor.
\]

At a half-integer the first new odd moment is controlled, but the next
even absolute moment is not uniformly bounded.  Consequently the usable
macroscopic Hermite index remains `floor(s)`, and

\[
 \sup_{s\geq2}{\rho_{\lfloor s\rfloor}\over s}
 ={\sqrt{3+\sqrt6}\over4}.
\]

The fractional odd shelf still gives, for
`r+1/2<=s<r+1` and `s(1-alpha)<rho_(r+1)`, the weaker actual bound

\[
 \mathfrak R_{\lambda,\alpha},\quad
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg x^{s-r}L^{2r+1}.
\]

For every fixed `s<r+1` this is `o(x/L)`.  Its best threshold occurs at
`r=2`, `s=5/2`, but its scale is only `lambda L^5`.  A positive
Gaussian--Radau escaping-mass model shows that the loss cannot be removed
from the stated finite moments, deterministic support, tail, and elementary
derivative inputs alone.  This is a structural nonimplication model, not a
claim that the prime polynomial realizes it.

The shifted-correlation pair makes the next arithmetic fork exact.  The
first central odd term contains fixed-shift equations

\[
 \prod_{i=1}^{k+1}p_i-\prod_{j=1}^{k}q_j=h,
 \qquad |h|=O_A(1),
\]

whereas the required top even moment contains a growing shift band up to
`|h|<<_A x`.  On the optimal `k=4` block, Montgomery--Vaughan gives only
`O_A(x^(1/2)L^(9/2))` for the central ninth term and an
`O_A(xL^5)` error for the tenth moment.  The required improvements are,
respectively, beyond `x^(1/2)/L^(9/2)` and `x/L^5`.  An exact positive
Jacobi-boundary measure plus a vanishing remote atom matches the Gaussian
moments through degree nine while its positive excess vanishes and its
tenth moment diverges.  Thus odd-moment control alone cannot move the
Hermite threshold without next-even-moment uniform integrability.

For the actual complete multiplier, define

\[
 v(t)=[g+U-m_\lambda(t)]_+,
 \qquad T_v=C_L^*\mathcal F^*M_v\mathcal F C_L.
\]

The third pair proves an explicit compact support envelope for `v`.  Every
positive spectral subspace `W_vartheta` of `T_v` consists of restrictions
of entire functions of the certified exponential type and obeys explicit
real-axis derivative bounds.  The literal arithmetic adjoint nevertheless
creates the exact breakpoint jump

\[
 \Delta(A_{\lambda,0}^*y)(n/\lambda)
 ={\sqrt\lambda\over2n}y(-L/2),
\]

with the analogous first nonzero endpoint-jet formula.  The resulting BV
estimate gives a finite defect-relative prolate sufficient condition, but
the available constants do not certify it at the near-Shannon prefix.
Moreover, only the dangerous component has the regularity theorem; the safe
component can cancel it after `A^*`, and the exact capture Gram retains the
signed cross term.  A buffered commutator controls separated spectral
pieces with the sharp factor `1/(2h)`, but leaves the gray band and the
dangerous diagonal floor uncontrolled.  Fixed-`lambda` compactness gives
only a generally non-effective finite prefix.

The three focused modules pass `39/39`.  With `PYTHONPATH=src`, the exact
eight-module deduplicated target/direct-dependency closure passes `113/113`
under `python3 -B`.  Projected canonical/raw discovery is `395/4361` and
`400/4419`; frontier/replay is `253/2839` and `265/2967`; support remains
`12/128` and exclusions remain `5/58`.  Expanded canonical/frontier/replay
suites were not rerun.

The exact direct-dependency union has ten paths, five complete note/test
pairs.  Pairs A and B share the checkpoint-1.68 long-block pair; pair C
freezes four distinct existing pairs.  Adding the six targets gives 16
paths, exactly eight complete pairs.  Pairs A and B inherit the
already-disclosed Montgomery--Vaughan theorem through the frozen long-block
pair; it remains external, unvendored, unhashed, and non-byte-bound.  Pair C
adds no independent external input.  KRD/BBK/Slepian, P3/FKS,
complete-symbol, and all source-lock lineage is transitive only.  No new
external paper, source-lock JSON, vendored byte, artifact, zero table,
numerical ordinate, cached matrix, source sample, serialized numerical
artifact, or external computation is added.

Checkpoint 1.69 proves that a fixed real block exponent s controls Gaussian moments only through floor(2s), while macroscopic Hermite uniform integrability reduces the usable index to floor(s); the fractional odd shelf yields an explicit lower bound x^(s-r)L^(2r+1), but for fixed s<r+1 it is o(x/L), so the checkpoint-1.68 k=4 threshold remains optimal at the required scale. It identifies the first missing odd fixed-shift almost-prime correlation and the next even growing-shift top moment, quantifies the Montgomery--Vaughan deficits, and gives a positive Jacobi/remote-atom countermodel showing that odd-moment control alone cannot move the Hermite threshold without next-even-moment uniform integrability. Separately, it proves an actual-symbol support envelope and Paley--Wiener regularity theorem for positive dangerous spectral subspaces, exact arithmetic-adjoint breakpoint/endpoint-jet jumps, an explicit BV-to-prolate sufficient condition, a sharp buffered commutator bound, and fixed-lambda qualitative prefix capture. The available constants do not reach the near-Shannon prefix, and the safe component can cancel the regular dangerous component after the literal adjoint. No required-scale centered-remainder obstruction at or below the checkpoint-1.68 threshold, actual phase-volume lower bound, actual bottom Gram/cross-angle or bridge gate, determinant convergence, unconditional zero theorem, RH proof or converse, or de Bruijn--Newman bound is proved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.70 endpoint jets, top-even global cancellation, and phase-volume threshold

Checkpoint 1.70 admits exactly three independently audited strict-PASS
theorem/barrier pairs:

| Target | SHA-256 |
|---|---|
| `notes/CUTOFF_FREE_ACTUAL_DANGEROUS_ENDPOINT_JET_PROFILE_OBSERVABILITY_BARRIER.md` | `e7583ff8784410db5b5488250737845936a43420cb787ddd714d71242c880a5d` |
| `tests/test_cutoff_free_actual_dangerous_endpoint_jet_profile_observability_barrier.py` | `2c248744839039c052e3dbfcdc9857230147f9cf315e9abb34d212742e19435a` |
| `notes/ACTUAL_CENTERED_REMAINDER_TOP_EVEN_NEAR_BAND_GLOBAL_CANCELLATION_BARRIER.md` | `e3c660f12f8d147f6d1caff14805d22325cee679a1a6b38ff5f9ec78d99b812f` |
| `tests/test_actual_centered_remainder_top_even_near_band_global_cancellation_barrier.py` | `41311bb75b9fc0c2e832dcf334ed318ee6fde3aaf1b5f1a6a0c015db0138cae7` |
| `notes/ACTUAL_PHASE_VOLUME_LONG_BLOCK_THRESHOLD_NEGATIVE_INDEX_BARRIER.md` | `964b58396b1913013b017be6393cef768891d253e553a22979c3189a5c603f56` |
| `tests/test_actual_phase_volume_long_block_threshold_negative_index_barrier.py` | `149a7034c83a952b4069574cf5892583540f66b5fcea385afb2a90ecd66a979c` |

The exact deduplicated direct-dependency union is:

| Dependency | SHA-256 |
|---|---|
| `notes/CUTOFF_FREE_ACTUAL_DANGEROUS_ADJOINT_REGULARITY_BARRIER.md` | `76bed7bff24f2bdced30c357d3a61b7cbcc16964085901070f723035aeb92337` |
| `tests/test_cutoff_free_actual_dangerous_adjoint_regularity_barrier.py` | `034fe9fa18d0ae587ac3d9c5c3f9e0179a5cbf80dd96ef5aab21e5034f8223ec` |
| `notes/ACTUAL_CENTERED_REMAINDER_SHIFTED_CORRELATION_TOP_MOMENT_UI_BARRIER.md` | `8ab0f30e32fe715a4f839228f5d05dc581292c99c2a04f42804f0ff4d2d878d9` |
| `tests/test_actual_centered_remainder_shifted_correlation_top_moment_ui_barrier.py` | `ecaf4f1eaaab4a3a146c277eb0897e79d5323bfe9b79709bbc5cac5d423bd787` |
| `notes/ACTUAL_PHASE_VOLUME_CENTERED_PNT_REMAINDER_REDUCTION_BARRIER.md` | `2b2a40a4ec087c77145b45fc54d8a5782a85ecd122b2d599d2c2d8a067b714f1` |
| `tests/test_actual_phase_volume_centered_pnt_remainder_reduction_barrier.py` | `7fbcdf15dde20d3d2a00303f74d5441ee143af74ae269992fe79b1fb0c97456f` |
| `notes/ACTUAL_CENTERED_REMAINDER_LONG_BLOCK_HERMITE_MOMENT_BARRIER.md` | `1997f8b14c5f90977f744788d069f6e771da078c06562dac2d78c671c01a95c1` |
| `tests/test_actual_centered_remainder_long_block_hermite_moment_barrier.py` | `cbbc300b9a050ac161d9f8feae996947b522043ae50663799dfc194ed4d3dd2d` |
| `notes/ACTUAL_CENTERED_REMAINDER_FRACTIONAL_BLOCK_ODD_MOMENT_UI_BARRIER.md` | `c5510f3491d2d6ff173581bd6be540edc1b8b5c4bbb0afb56b636bfd68b51f19` |
| `tests/test_actual_centered_remainder_fractional_block_odd_moment_ui_barrier.py` | `71e1480ae0e4265ec4e45c3eb181a2682ee070bc8382eba815c3543a9f626871` |
| `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` | `c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81` |
| `tests/test_parity_multiplier_schur.py` | `94ee818e2747e703d521cfa2a980765569cccfdf442b700b1a6b33ac4ceababb` |

Pair A freezes solely the checkpoint-1.69 actual-dangerous
adjoint-regularity pair.  Pair B freezes the shifted-correlation pair,
which is also one of pair C's five dependency pairs.  The deduplicated
dependency union therefore has 12 paths, exactly six complete note/test
pairs.  Adding the six targets gives 18 paths, exactly nine complete
pairs.  Every dependency and target digest was rechecked.

For the actual dangerous projector, define the endpoint Taylor profiles

\[
 p_j(s)={(s+L/2)^j\over j!},\qquad
 \Phi_j=A_{\lambda,0}^*p_j.
\]

The literal adjoint has the exact all-order jump law

\[
 \Delta(A_{\lambda,0}^*y)^{(k)}(n/\lambda)
 ={\lambda^{k+1/2}\over2n^{k+1}}
 \prod_{\ell=0}^{k-1}(D-\ell-1/2)y(-L/2).
\]

The profiles have exact additive-prolate coefficient and Gram matrices,
and the sharpened multiplier estimate gives an explicit finite-jet
observability certificate.  The certified Taylor order can be as large as
`O(L T_lambda+log_+(vartheta^-1))`, while the near-Shannon prefix has only
`O(lambda^2)` rows.  If the profile count exceeds the row count, its
singular value vanishes by rank.  Bottom normalization is an isometry but
retains the signed Taylor-remainder and safe-piece cross terms, so this
finite-jet theorem does not prove the actual near-Shannon capture gate.

For the top even moment with `r=k+1`, `T=Ax^(r-1)`, and `X=x^r`, the
restricted top product shell contains a positive off-diagonal near-band
core

\[
 \mathcal N_{r,A}(x)\gg_{A,r}x,
 \qquad |n-m|\ll_A X/T\asymp_Ax.
\]

Consequently, a bound of order `O_(A,r)(L^(2r))` cannot be obtained by
discarding the near band or taking absolute values.  The complementary
signed kernel must cancel this positive core to polylogarithmic accuracy.
At `k=4`, the positive core is `Omega_A(x)`, its restricted-shell diagonal
is `O(L^5)`, and the full diagonal is asymptotic to `120 S_x^5`, of order
`L^10`.  No theorem here proves the required complete cancellation or the
next-even top-moment uniform-integrability bound.

For the full inclusive prime-power polynomial, the exact digamma series
gives the two-sided phase sandwich

\[
 \int[C-h-q+2\operatorname {Re}D_\lambda]_+
 \leq\Phi_\lambda(U,g)
 \leq\int[C-h+2\operatorname {Re}D_\lambda]_+,
 \qquad 0\leq q(t)<4.
\]

On `I_(x,s)=[Ax^s,2Ax^s]` with `C/L` tending to `kappa`, the true
normalized threshold is `s-kappa`, not `s(1-alpha)`.  The macroscopic
Hermite route transfers only if `s-kappa<rho_floor(s)`, which is impossible
for the standard schedule `kappa<=1`.  A narrower fractional odd-shelf
argument gives an actual lower bound `x^(s-r)L^(2r+1)`, but this remains
`o(x/L)`.  Phase-volume lower bounds cannot reverse the one-sided retained
negative-index inequality.

The three focused modules pass `41/41`.  With `PYTHONPATH=src`, the exact
nine-module deduplicated target/direct-dependency closure passes `121/121`
under `python3 -B`.  Projected canonical/raw discovery is `398/4402` and
`403/4460`; frontier/replay is `256/2880` and `268/3008`; support remains
`12/128` and exclusions remain `5/58`.  Expanded canonical/frontier/replay
suites were not rerun.

Pairs B and C inherit the already-disclosed Montgomery--Vaughan theorem
through frozen shifted-correlation, long-block, and fractional-block
pairs.  It remains external, unvendored, unhashed, non-byte-bound, and not
independently certified; P3/FKS lineage is transitive only.  Pair A adds no
independent external input; KRD/BBK/Slepian, complete-symbol, full-source,
bridge, parity, digamma, and all source-lock provenance is inherited
transitively.  No new external paper, source-lock JSON, vendored source,
artifact, zero table, numerical ground, numerical ordinate, cached matrix,
source sample, serialized numerical artifact, or external computation is
admitted.

Checkpoint 1.70 proves exact endpoint-jet jump profiles, finite-profile prolate coefficient/Gram formulas, sharpened dangerous derivative/trace bounds, and a finite-jet observability certificate, but the certified Taylor order can exceed the near-Shannon row count and the bottom-normalized Gram retains signed remainder/safe cancellation. It proves that the top-even growing near band contains a positive Omega(x) core and therefore any O(L^(2r)) top-moment bound requires global complementary cancellation; it does not prove that cancellation or the next-even UI bound. It also proves a two-sided full-prime-power phase-volume sandwich, identifies the true normalized threshold s-kappa, a conditional Hermite lower bound, and a sub-x/L odd-shelf lower bound; the standard kappa<=1 schedule misses the macroscopic Hermite condition, and phase-volume lower bounds do not reverse the one-sided negative-index inequality. No actual near-Shannon cross-angle/bridge gate, next-even top-moment UI, required-scale phase-volume obstruction or upper target, negative-index lower bound, determinant convergence, unconditional zero theorem, RH proof or converse, or de Bruijn--Newman bound is proved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.71 one-direction capture and cyclicity-rate barrier

Checkpoint 1.71 admits exactly two independently audited strict-PASS
theorem/barrier pairs:

| Target | SHA-256 |
|---|---|
| `notes/CUTOFF_FREE_ONE_DIRECTION_WEIGHTED_GROUND_CAPTURE_THEOREM.md` | `770087b56766e0102a915a31e08aba5389065d78dd59a55135adb5f5b6eea948` |
| `tests/test_cutoff_free_one_direction_weighted_ground_capture_theorem.py` | `a9cd2abbf8c3de284e1b375beffc7f186a7f4bebc3ecd7fba111195f435b86fc` |
| `notes/CUTOFF_FREE_CYCLICITY_EFFECTIVE_DIMENSION_CAPTURE_BARRIER.md` | `e27463c41c6a45fcb6a3a332b8e5ab173178f35a4abb9fd5eff07dfbbc27eccd` |
| `tests/test_cutoff_free_cyclicity_effective_dimension_capture_barrier.py` | `1bc88d49195b54c185be767a217d952145839962bf894e06dfe38ce9bfbed515` |

Their exact deduplicated direct-dependency union is:

| Dependency | SHA-256 |
|---|---|
| `notes/CUTOFF_FREE_MULTI_ANCHOR_GROUND_FRAME_BARRIER.md` | `2e07843d54f00bce9e53afadc0b434efbaf8f97da95dadda54225de6cfecb34d` |
| `tests/test_cutoff_free_multi_anchor_ground_frame_barrier.py` | `0fdc307a051d50ff4ece21ae8b01f89b745a14788f093ec4127f5da6026bde9f` |
| `notes/CUTOFF_FREE_WEIGHTED_RADICAL_COFRAME_REDUCTION_BARRIER.md` | `c84bc4ed8632aeedb8208e699350e0895a4437912b8ba735f10315b5cf1b7d8c` |
| `tests/test_cutoff_free_weighted_radical_coframe_reduction_barrier.py` | `d6d83b1a045b96da8ad7a49753a05f5981e9744b04ecb95470fbd5332bb87c11` |
| `notes/CUTOFF_FREE_UNIFORM_RADICAL_GRAPH_TRANSFER_THEOREM.md` | `aa69ac86e6b5d5256ba3b243b9fc07d9c5ad49bed7a70e3d570d0c57325bce18` |
| `tests/test_cutoff_free_uniform_radical_graph_transfer_theorem.py` | `b2708c8f72ce8bad831b2aea44c49ef3a8ec5f9c38551c288a1c982d097ee727` |
| `notes/CUTOFF_FREE_BRIDGE_LEVERAGE_RANK_ONE_INNOVATION_REDUCTION.md` | `808c314d6b0cf1926ddf8b0a5b83c324ccbbc252d18efea283781fefd1751097` |
| `tests/test_cutoff_free_bridge_leverage_rank_one_innovation_reduction.py` | `2c79244dd68e9fd56ddb67f7278f4572cb72bae9803b82047ccf9ad58196faba` |
| `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` | `c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81` |
| `tests/test_parity_multiplier_schur.py` | `94ee818e2747e703d521cfa2a980765569cccfdf442b700b1a6b33ac4ceababb` |
| `notes/HIGH_FOURIER_COERCIVITY.md` | `5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821` |
| `tests/test_high_fourier_coercivity.py` | `64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae` |
| `notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md` | `3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81` |
| `tests/test_full_source_coframe_rank.py` | `dc322485178710618f9ace19cd2019200bf0dafeabcbe17cce4e47d41377d66a` |
| `notes/EVEN_ODD_MULTIPLICITY_KRYLOV_SIMPLICITY.md` | `a027a83a79078f6b6fb61a12dcb3bad28c7f73d429c4fae9587ed398a4d079a8` |
| `tests/test_even_odd_multiplicity_krylov_simplicity.py` | `fcceb2cdfad61c0eb23cd51350f0c021f72288edc0f1cab781f3c6bf4f793408` |

Pair A freezes five complete pairs.  Pair B freezes four complete pairs
and shares the multi-anchor pair with A.  The dependency union therefore
has 16 paths, exactly eight complete pairs.  Adding the four targets gives
20 paths, exactly ten complete pairs.  Every digest was rechecked.

For any finite radical synthesis, put

\[
 B_F=\mathcal K_F(\Delta_F^\dagger)^{1/2},\qquad
 \mathcal C_F=\|Q_\lambda B_F\|,
\]

and let `P_lambda` be the complete bottom projector.  Checkpoint 1.71
proves the exact scalar-bottom identity and largest-capture estimate

\[
 P_\lambda Q_\lambda B_F=\mu_\lambda P_\lambda B_F,
 \qquad
 |\mu_\lambda|\sqrt{\Lambda_F^{\max}}\leq\mathcal C_F,
\]

where

\[
 \Lambda_F^{\max}=\|P_\lambda B_F\|^2.
\]

Thus only one defect-weighted captured direction in the complete bottom
space is needed.  A smallest frame eigenvalue, surjectivity onto every
bottom direction, bottom simplicity, and parity order are unnecessary for
this conditional implication.  The vectorwise and Hilbert--Schmidt forms
are also exact.  For the physical adjoint, the remaining target is one
actual coefficient packet whose defect-weighted capture beats the proved
polynomial residual.  The bridge-only version is the arithmetic contrast

\[
 \beta_2(e_0)-{I_2\over I_0}\beta_0(e_0).
\]

Birman--Schwinger theory controls overlap with the odd pole vector, not
with this bridge innovation.  An exact two-dimensional model has a simple
negative pole-created ground, saturated pole overlap, positive bridge
self-energy, and zero bridge contrast.

The second pair proves that a bottom vector has fixed positive physical
mass in a low Fourier band of dimension

\[
 D_\lambda=\exp\{O(\lambda\log\lambda)\}
           =\exp\{o(\lambda^2)\}.
\]

This is not prolate-prefix capture.  Normalizing the literal full-source
adjoint gives an isometry `J_X`, and every source prefix `F` of dimension
`m<dim X` has the exact kernel

\[
 \dim\ker(P_FJ_X)\geq\dim X-m.
\]

Qualitative cyclicity gives positive cofactor weights but no lower rate.
Analytic source-Cauchy and parity-complete exact models permit
superquadratically small ground weight or saturation of the residual-
weighted projector inequality.  These are structural nonimplication
models, not the actual Weil source.

The two focused modules pass `20/20`.  With `PYTHONPATH=src` and
`PYTHONDONTWRITEBYTECODE=1`, the exact ten-module deduplicated
target/direct-dependency closure passes `127/127` under `python3 -B`.
Projected canonical/raw discovery is `400/4422` and `405/4480`;
frontier/replay is `258/2900` and `270/3028`; support remains `12/128` and
exclusions remain `5/58`.  Expanded canonical/frontier/replay suites were
not rerun.

Neither pair adds an independent external input.  Existing pinned CCM,
KRD/BBK/Slepian, P3/FKS, complete-symbol, full-source, bridge, parity,
high-Fourier, and source-Cauchy provenance is inherited transitively
through frozen internal pairs.  No vendor byte or source-lock JSON is a
direct checkpoint-1.71 dependency.  No new external paper, source-lock
JSON, vendored source, artifact, zero table, numerical ground, numerical
ordinate, cached matrix, source sample, serialized numerical artifact, or
external computation is admitted.

Checkpoint 1.71 proves the exact full-bottom vectorwise, operator-norm, and Hilbert--Schmidt projector identities and replaces the all-bottom smallest-eigenvalue coframe demand by a strictly weaker largest defect-weighted one-direction capture criterion. It isolates the exact mixed-bridge contrast and proves that odd-pole Birman--Schwinger data do not force that contrast. Separately, it proves fixed positive ground mass inside an exp(O(lambda log lambda)) physical Fourier band, the normalized full-source isometry and prefix rank kernel, and structural cofactor, analytic source-Cauchy, and parity-complete models showing that qualitative cyclicity and analyticity provide no required capture rate. The structural models are not the actual Weil source. No actual lower bound for the largest weighted capture, actual bridge contrast, prolate-prefix overlap, exp(-o(lambda^2)) ground weight, or quantitative ground cofactor is proved. No parity order, determinant convergence, unconditional zero theorem, RH proof or converse, or de Bruijn--Newman bound is proved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.72 pole-row, Schatten, and commuting-filter barriers

Checkpoint 1.72 admits exactly three independently audited strict-PASS
pairs.  The first computes the actual finite-source mixed-bridge pole row.
With

\[
 M_\lambda={\lambda-\lambda^{-1}\over2}-\log\lambda,
 \qquad \beta_\lambda=\langle p_\lambda,w_\lambda\rangle,
\]

it proves

\[
 \beta_\lambda
 =2^{-5/4}\log\lambda
 -{2^{3/4}\over8}\{4+\gamma_E-\log(4\pi)\}
 +O(\lambda^{-1}),
\]

and therefore eventual positivity, with a qualitative starting threshold.
The limiting odd bridge is strictly positive on the positive half-line.
For the pole-created branch, however, the exact normalized overlap is

\[
 |\langle g_\mu,w_\lambda\rangle|^2
 ={\left|\beta_\lambda/\sqrt{M_\lambda}
 -\langle B_\mu^{-1}r_\lambda,w_\lambda^\perp\rangle\right|^2
 \over1+\|B_\mu^{-1}r_\lambda\|^2}.
\]

The explicit pole term is of order
`log(lambda)/sqrt(lambda)`, but no frozen estimate prevents the actual
transverse resolvent term from cancelling it or controls the normalizer at
the required scale.  Reflected prime atoms also give an exact sign
counterexample to generic inverse positivity of the literal nonpole odd
resolvent.  Thus profile positivity alone cannot close the overlap.

The second pair proves an all-`p` conversion from centered scalar source
moments to an operator dangerous-space bound.  For
`K_I=D_bH_I-H_ID_b`,

\[
 \operatorname {rank}{\bf1}_{(\tau,\infty)}(|K_I|)
 \leq\left({2\pi\over\tau}\right)^p
       \sum_{n\in I}|b_n-c|^p.
\]

After adjoining the coordinate indices whose complete diagonal lies below
the same shell threshold, the orthogonal complement has quadratic-form
floor `G`.  The same-shell threshold and the exact normalized `s=2`
half-scale are frozen explicitly.  Even under the optimistic admitted
moment hierarchy, the largest available saving is only `O(s log s)`,
whereas reducing `x^s` directions to `O(x)` requires `(s-1)log x`.
This is a method obstruction, not a lower bound for the actual dangerous
dimension, and dimension alone gives no angle with the prolate source
range.

The third pair audits bounded commuting spectral filters.  For a radical
anchor `kappa`, bounded filters `Phi`, and source metric `Delta`, it proves

\[
 \Lambda_\Phi
 =\|P B_\Phi\|^2
 =\|P\kappa\|^2
  \|\boldsymbol\phi(\mu)\Delta^{-1/2}\|^2,
 \qquad
 \|(Q-qI)B_\Phi\|^2
 \geq|\mu-q|^2\Lambda_\Phi.
\]

The upper estimate inherited from the original anchor pays the factor

\[
 {M_{\Phi,\Delta}
  \over\|\boldsymbol\phi(\mu)\Delta^{-1/2}\|}\geq1,
\]

so it cannot improve the certified residual-to-capture statistic.  A
source-realizable low-Fourier Mobius family has large unweighted bottom
capture, but its residual is the original Weil action rather than a small
prolate defect.  The logarithmic source-Cauchy example is structural, not
the actual Weil operator.

The three focused modules pass `29/29`.  With `PYTHONPATH=src` and
`PYTHONDONTWRITEBYTECODE=1`, the exact ten-module deduplicated
target/direct-dependency closure passes `98/98` under `python3 -B`.
Projected canonical/raw discovery is `403/4451` and `408/4509`;
frontier/replay is `261/2929` and `273/3057`; support remains `12/128` and
exclusions remain `5/58`.  Expanded canonical/frontier/replay suites were
not rerun.

Checkpoint 1.72 proves the actual fixed-label mixed-bridge pole-row asymptotic and eventual positivity, the strict positivity of the limiting odd bridge profile, and the exact pole-axis Feshbach overlap formula. It also proves that the literal nonpole odd resolvent has no generic inverse-positivity sign theorem. The eventual threshold is qualitative, and the actual transverse resolvent response may cancel the explicit subexponential pole row while the normalizer remains uncontrolled. Separately, it proves the centered all-p Schatten exceptional-rank bound and exact dangerous-space floor, including the same-shell coordinate threshold and exact fixed-s=2 half-scale; the admitted moment hierarchy cannot reduce the dangerous space to O(lambda^2), and dimension gives no source angle. Finally, it proves exact bottom-row and bottom-atom identities for bounded commuting filters, shows that the certified envelope cannot improve the anchor statistic, and constructs a source-realizable low-Fourier family with large unweighted capture but no small defect-relative residual. The random-phase paragraph and logarithmic source-Cauchy example are heuristic or structural only, not actual arithmetic or Weil conclusions. No actual transverse-cancellation lower bound, bottom-projector floor, O(lambda^2) dangerous-space bound, source-angle bound, filtered one-direction pass, parity order, determinant convergence, unconditional zero theorem, RH proof or converse, or de Bruijn--Newman bound is proved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.73 transverse-gap, mixed-resolvent, and Xi-ideal barriers

The first new pair keeps the actual odd complete-source sign and studies the
nonexceptional pole-created branch.  If `kappa` is the pole-transverse floor,
`gamma` the loaded odd gap, and `alpha` the pole visibility of the normalized
ground, then

\[
 \max\{a_1-\mu,\gamma\alpha^2\}\leq\kappa\leq\gamma,
 \qquad
 1+\|B_\mu^{-1}r\|^2=\alpha^{-2}=4M F'(\mu).
\]

For the raw bridge, with
`x=beta_lambda/sqrt(M)` and
`E=<w_lambda,(Q_--mu)w_lambda>`, it also proves

\[
 |\langle g,w_\lambda\rangle|
 \geq\left[x-{1\over2}\sqrt{E\over\kappa}\right]_+.
\]

Thus exact cancellation costs `E>=4*kappa*x^2`, and
`E=o(kappa*log^2(lambda)/lambda)` would force the desired overlap without a
separate normalization estimate.  No frozen theorem proves either that energy
bound or an `exp(-o(lambda^2))` lower bound for `kappa`; the coherent beta
diagonal is a two-parity signed quantity, not the individual odd energy.

The second pair rewrites the same overlap through the signed mixed spectral
measure.  Below the pole-free spectrum,

\[
 m(z)=\langle p,(H-zI)^{-1}p\rangle,
 \qquad
 F(z)=\langle w,(H-zI)^{-1}p\rangle,
 \qquad
 |\langle w,g_\mu\rangle|^2={|F(\mu)|^2\over m'(\mu)}.
\]

Exact cyclic simple-spectrum counterpairs have the same positive pole row,
the same two complete diagonal measures, the same pole-load branch and load
derivatives, a polynomial gap, and a bounded denominator, while one has
`F(0)=0` and the other has `F(0)>0`.  The literal arithmetic source retains
more structure: its full-even adjoint has the required factor `1/2`, its
zero-integral projection subtracts the exact constant, and the unresolved
quantity is the generalized harmonic row of `(H-mu)^(-1)p`.  No sign or
anti-cancellation theorem for that row is proved.

The third pair proves that every admitted actual source radical has transform

\[
 \widehat{\mathcal E(f)}(z)=\Xi(z)A_f(z)
\]

on the open critical strip.  Source dilation, the dilation generator,
inversion symmetrization, admissible source logarithmic moments, and finite
mixing preserve this principal ideal.  Coordinate multiplication can
differentiate `Xi`, but it is not an actual-source operation unless the
source restores every removed divisor; it also leaves a global bulk residual
which truncation cannot remove.  Finite-window coefficients retain the exact
form

\[
 (p_a)_n=L^{-1/2}\Xi(\omega_n)A_a(\omega_n)+e_{a,n}.
\]

For the locked anchor, complete-period translation loses the uniform
`exp(-c*lambda^2)` outer scale, while every translation measure supported in
a fixed boundary-safe interval has the binomial frame upper bound

\[
 c_{N,S}(p)\leq
 \|p\|^2{(2\pi S/L)^{2N}\over\binom{2N}{N}}.
\]

At `N` comparable to `lambda^2` this is
`exp(-Theta(lambda^2 log log lambda))`.  A high-complexity common-`Xi`
family is not ruled out, but would require new sampled minimum-modulus,
cofactor-conditioning, and moving-order residual estimates.

The three focused modules pass `34/34`.  With `PYTHONPATH=src` and
`PYTHONDONTWRITEBYTECODE=1`, the exact eleven-module deduplicated
target/direct-dependency closure passes `125/125` under `python3 -B`.
Projected canonical/raw discovery is `406/4485` and `411/4543`;
frontier/replay is `264/2963` and `276/3091`; support remains `12/128` and
exclusions remain `5/58`.  Expanded canonical/frontier/replay suites were
not rerun.

Checkpoint 1.73 proves exact transverse-gap, normalization, bridge-energy, mixed-resolvent, actual-source-adjoint, Xi-ideal, finite-window, tail, and translation-frame reductions. The exact countermodels are structural and are not the actual Weil source. No actual transverse floor, individual odd bridge-energy estimate, mixed-resolvent phase lower bound, sampled Xi minimum-modulus estimate, controlled high-complexity common-divisor frame, bottom-projector floor, parity order, determinant convergence, unconditional zero theorem, RH proof or converse, or de Bruijn--Newman bound is proved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.74 paired-Floquet Xi floor and Pair-C barrier

Put `L=2 log(lambda)` and let `N=O(lambda^2)`.  There is an unconditional
choice `theta in [1/(2L),3/(2L)]` for which the two grids
`t_(n,+/-theta)=(2*pi*n+/-theta)/L`, simultaneously for `|n|<=N`, are
polynomially separated from every complex zero of `Xi`, with multiplicity.
A local logarithmic-derivative factorization, rather than a global Hadamard
product estimate, then gives

\[
 \min_{\substack{|n|\leq N\\ \varepsilon\in\{-1,1\}}}
 |\Xi(t_{n,\varepsilon\theta})|
 \geq \exp\left\{-{\pi^2N\over2L}-CL^2\right\}
 =\exp\{-o(\lambda^2)\}.
\]

This statement is unconditional and uses neither RH nor zero simplicity.
Folding the paired grids repairs reflection parity.  After normalizing the
zero-index cosine row and omitting the near-zero zero-index sine row, the shifted
cosine and sine Grams satisfy

\[
 \|G_\theta^\pm-I\|\leq C|\theta|=O(L^{-1}),
\]

so the parity repair has a uniform Riesz condition number.

The common-Xi floor solves only the ideal diagonal factor.  Complete-circle
Floquet translation diagonalizes that factor but wraps the locked anchor
across the finite-window seam, producing order-one error for some shifts.
For actual global translations, a probability measure `nu` with unsafe mass
`epsilon_S=nu{|tau|>S}` obeys the exact upper obstruction

\[
 c_N^\theta(p;\nu)
 \leq \|p\|^2{(2\pi S/L)^{2N}\over\binom{2N}{N}}
      +\varepsilon_S\|p\|^2.
\]

Retaining a fixed Gaussian residual forces `epsilon_S` to be exponentially
small, while the safe term is
`exp(-Theta(lambda^2 log log lambda))` at quadratic inventory.  Weighting
boundary-unsafe shifts therefore does not repair the translation route.

For a nontranslation finite actual source prefix, let

\[
 c_{\theta,m}=\lambda_{\min}
   (W_{\theta,m}G_m^\dagger W_{\theta,m}^*).
\]

If a new dangerous-space theorem literally embeds the complete bottom space
in the selected parity Floquet band, the frozen full-source upper bound gives

\[
 \gamma_m\geq{2c_{\theta,m}\over\lambda^2};
\]

a graph embedding divides the right side by the squared graph-lift norm.
Thus an `exp(-o(lambda^2))` finite-prefix floor and an
`exp(-c lambda^2)` defect would close Pair C.  The ideal polynomial-Xi matrix
is algebraically full rank, but its frozen inverse majorant is much larger
than `exp(o(lambda^2))` at quadratic inventory, and the frozen moving-label
Gevrey series is no longer perturbative there.  The full-source row floor
does not imply this finite-prefix principal angle.

Divided differences and logarithmic-derivative compensation also do not
escape the actual-source divisor.  Holomorphy at every zeta zero forces the
cancellation that restores the common divisor; without it, the Mellin factor
is meromorphic and the profile carries a global bulk residual.

The focused module passes `14/14`.  With `PYTHONPATH=src` and
`PYTHONDONTWRITEBYTECODE=1`, the exact six-module deduplicated
target/direct-dependency closure passes `92/92` under `python3 -B`.
Projected canonical/raw discovery is `407/4499` and `412/4557`;
frontier/replay is `265/2977` and `277/3105`; support remains `12/128` and
exclusions remain `5/58`.  Expanded canonical/frontier/replay suites were
not rerun.

Checkpoint 1.74 proves an unconditional paired-Floquet sampled-Xi minimum-modulus bound of exp(-o(lambda^2)) on a quadratic mode band and exact parity Riesz conditioning. It also records the complete-circle seam and boundary-safe weighted-translation obstructions, the insufficiency of the frozen moving-label inverse majorant at quadratic inventory, and divisor/source-escape barriers. The sampled bound conditions only the common Xi factor. It does not prove an actual residual-safe finite transition-prefix floor, dangerous-space embedding, bottom-projector capture, Pair-C stopping condition, parity order, determinant convergence, an unconditional zero theorem, RH proof or converse, or a de Bruijn--Newman bound. The formal state remains P0_INVALIDATED.

## Checkpoint 1.75 individual beta-carrier RH barrier

For the actual fixed-label bridge, let

\[
 {\cal S}_\lambda=\sum_\rho{\lambda^{-2\rho}\over\rho^2},
 \qquad
 C_\xi=\sum_\rho{1\over\rho(1-\rho)},
\]

with algebraic multiplicity.  Paired-slot reflection gives the exact
individual carrier split

\[
 {\mathfrak b}_{\lambda,+}
 ={A_\lambda^2C_\xi\over8\lambda}
  +{A_\lambda^2\over8}{\cal S}_\lambda,
 \qquad
 {\mathfrak b}_{\lambda,-}
 ={A_\lambda^2C_\xi\over8\lambda}
  -{A_\lambda^2\over8}{\cal S}_\lambda.
\]

Thus the same-tail term cancels from the coherent two-parity beta diagonal
but remains in either individual carrier.  If

\[
 G(a)=e^a{\cal S}_{e^a}
     =\sum_\rho{e^{(1-2\rho)a}\over\rho^2},
\]

then boundedness of `G` on the continuous family is equivalent to RH by a
noncancelling Landau--Laplace pole argument.  The same equivalence holds on
the complete natural halfgrid `lambda_p=p/2`, with `p` every sufficiently
large odd positive integer.  Zero counting gives

\[
 |G(a+h)-G(a)|\leq Ce^ah\log^2(2/h),
\]

and the all-odd logarithmic mesh is `O(e^(-a))`, so bounded samples imply
only polynomial continuous growth, which is already enough for the same
Laplace-pole contradiction.  This is not a prime-only or arbitrary sparse
subsequence statement.

These identities stop at the spectral beta-carrier level.  The physical
corrected row contains the bump, while the beta representative agrees with
it only after nontrivial-zero evaluation.  The missing ordered paritywise
finite-part theorem is precisely the step needed to identify the physical
odd self with the odd carrier up to `o(lambda^(-1))`.  Even after such an
identity, the shifted energy retains `-mu*||w_lambda||^2`, and the sharp
cancellation comparison still requires a quantitative
`kappa*log^2(lambda)` reserve.

The focused module passes `12/12`.  With `PYTHONPATH=src` and
`PYTHONDONTWRITEBYTECODE=1`, the exact six-module deduplicated
target/direct-dependency closure passes `73/73` under `python3 -B`.
Projected canonical/raw discovery is `408/4511` and `413/4569`;
frontier/replay is `266/2989` and `278/3117`; support remains `12/128` and
exclusions remain `5/58`.  Expanded canonical/frontier/replay suites were
not rerun.

Checkpoint 1.75 proves the exact individual even/odd beta-carrier split and shows that the surviving same-tail zero sum is bounded at the lambda^(-1) carrier scale on either the continuous family or the complete all-odd natural halfgrid iff RH. This is an RH-equivalence barrier, not a proof that the bound holds. The identities are spectral carrier identities only. It does not prove the paritywise ordered physical finite-part identification, an individual physical odd self bound, live-shift control, the kappa log^2(lambda) reserve, bridge-energy relative smallness, bottom-projector capture, Pair-C closure, parity order, determinant convergence, any new zero theorem, RH, or a de Bruijn--Newman bound. The formal state remains P0_INVALIDATED.

## Checkpoint 1.76 compact-side odd carrier transfer

Let `w_lambda=S_-X_lambda` be the compact physical odd row and put

\[
 q^{\rm phys}_{\lambda,-}
 =\langle w_\lambda,Q_-w_\lambda\rangle,
 \qquad
 {\mathfrak b}_{\lambda,-}
 ={A_\lambda^2C_\xi\over8\lambda}
  -{A_\lambda^2\over8}{\cal S}_\lambda.
\]

The compact-BV explicit formula is reached through symmetric normalized
Fejer means in the logarithmic form norm.  Orbit-realified two-slot
normalization, including the repository factor `1/2`, then gives the exact
positive sequence-space Cauchy bound.  Corrected-radical polarization moves
the compact physical row to its spectral representative only after zero
evaluation; it does not identify the underlying physical and spectral rows.

On the complete natural halfgrid

\[
 \lambda_p={p\over2},
 \qquad p\text{ every sufficiently large odd positive integer},
\]

the frozen positive modal sampling and endpoint-shear estimates yield

\[
 \boxed{
 q^{\rm phys}_{\lambda_p,-}
 ={\mathfrak b}_{\lambda_p,-}+r_p,
 \qquad r_p=o(\lambda_p^{-1}).}
\]

In fact the remainder is smaller than every fixed inverse power on this
schedule.  Combining the transfer with checkpoint 1.75 proves

\[
 \boxed{
 q^{\rm phys}_{\lambda_p,-}=O(\lambda_p^{-1})
 \quad\Longleftrightarrow\quad {\rm RH}.}
\]

This is a complete-all-odd-halfgrid equivalence, not an unconditional bound.
The continuous result retained from checkpoint 1.75 is carrier-only; the
frozen modal estimate does not license a continuous physical transfer or a
prime-only or arbitrary sparse-subsequence conclusion.  The literal
noncompact ordered physical finite part also remains open because the
gauge-null row is known to vanish only after zero evaluation.

The focused module passes `14/14`.  With `PYTHONPATH=src` and
`PYTHONDONTWRITEBYTECODE=1`, the exact seven-module deduplicated
target/direct-dependency closure passes `80/80` under `python3 -B`.
Projected canonical/raw discovery is `409/4525` and `414/4583`;
frontier/replay is `267/3003` and `279/3131`; support remains `12/128` and
exclusions remain `5/58`.  Expanded canonical/frontier/replay suites were
not rerun.

Checkpoint 1.76 proves on the complete all-odd natural halfgrid that the compact physical odd self equals the checkpoint-1.75 odd beta carrier plus o(lambda^(-1)), using compact-BV Fejer passage, orbit-realified paired-slot normalization, corrected-radical polarization, and positive absolute modal/cross sampling. Consequently the physical odd O(lambda^(-1)) bound on that complete halfgrid is equivalent to RH; this is not an unconditional bound and no continuous physical transfer is proved. It does not prove the literal noncompact ordered physical finite-part identity, live-shift control, the kappa log^2(lambda) reserve, shifted-energy smallness, bridge overlap, bottom-projector capture, Pair-C closure, parity order, determinant convergence, any new zero theorem, RH, or a de Bruijn--Newman bound. The formal state remains P0_INVALIDATED.

## Checkpoint 1.77 continuous compact-side odd carrier transfer

Checkpoint 1.77 removes the halfgrid restriction from the compact physical
transfer without interpolating between samples.  For every real
`lambda>=2`, the three fixed source labels satisfy

\[
 0\leq\mu_n(c)\leq c^2+n(n+1)<3c^2,
 \qquad n\in\{0,2,6\},\qquad c=2\pi\lambda^2.
\]

Thus the endpoint, complete harmonic-tail, weighted-norm, and translation
proofs from the transition outer theorem apply directly to each pure modal
row.  The dyadic positive zero sampler then gives a polynomial envelope

\[
 \|ZO_{n,{\rm modal}}\|_{{\mathfrak Z},{\rm repo}}^2
 \leq B_{\rm fix}(\lambda)d_n,
 \qquad B_{\rm fix}(\lambda)
 =O\!\left(\lambda\operatorname {polylog}\lambda\right).
\]

The sampler is applied mode by mode.  Sequence-space Minkowski and
Cauchy--Schwarz combine labels `0`, `2`, and `6`, retaining all cross terms.
The growing corrected-combination theorem is not applied to the
mixed-residue bridge, and neither its KRD transition window nor its compact
projection is promoted to all real parameters.

Using the checkpoint-1.76 gauge identity only after zero evaluation gives,
for every sufficiently large real `lambda`,

\[
 \boxed{
 q^{\rm phys}_{\lambda,-}
 ={\mathfrak b}_{\lambda,-}+o(\lambda^{-N})
 \quad\text{for every fixed }N>0.}
\]

Consequently

\[
 \boxed{
 q^{\rm phys}_{\lambda,-}=O(\lambda^{-1})
 \text{ for every sufficiently large real }\lambda
 \quad\Longleftrightarrow\quad {\rm RH}.}
\]

This is a continuous compact physical-self equivalence, not an
unconditional bound.  It does not identify the literal noncompact ordered
physical finite part and gives no bound for the shifted energy, the live
shift, or the `kappa*log^2(lambda)` reserve.

The focused module passes `14/14`.  With `PYTHONPATH=src` and
`PYTHONDONTWRITEBYTECODE=1`, the exact six-module deduplicated
target/direct-dependency closure passes `69/69` under `python3 -B`.
Projected canonical/raw discovery is `410/4539` and `415/4597`;
frontier/replay is `268/3017` and `280/3145`; support remains `12/128` and
exclusions remain `5/58`.  Expanded canonical/frontier/replay suites were
not rerun.

Checkpoint 1.77 proves for every sufficiently large real lambda that the compact physical odd self equals the checkpoint-1.75 odd beta carrier plus o(lambda^(-N)) for every fixed N, by deriving all-real fixed-label modal sampling for n in {0,2,6} without the growing corrected-combination, KRD, or compact-projection steps and then using the checkpoint-1.76 gauge equality only after zero evaluation. Consequently the continuous compact physical odd O(lambda^(-1)) condition is equivalent to RH; this is not an unconditional bound. It does not prove the literal noncompact ordered physical finite-part identity, shifted-energy control, live-shift control, the kappa log^2(lambda) reserve, bridge overlap, bottom-projector capture, Pair-C closure, parity order, determinant convergence, any new zero theorem, RH, or a de Bruijn--Newman bound. The formal state remains P0_INVALIDATED.

## Checkpoint 1.78 odd energy capture and circularity barrier

Let `mu_-` be the simple odd bottom, `g` its normalized ground, `gamma`
the odd spectral gap, and `kappa` the transverse pole-kernel floor.  For the
raw odd bridge, checkpoint 1.78 combines the ordinary gap estimate with the
pole-row Schur estimate to give

\[
 |\langle g,w_\lambda\rangle|^2
 \geq\max\left\{
 \left[n_\lambda-{E_\lambda\over\kappa}\right]_+,
 \left[x_\lambda-{1\over2}
       \sqrt{{E_\lambda\over\kappa}}\right]_+^2
 \right\}.
\]

The weighted continuation is legal only in one metric at a time.  The raw
bridge `w_lambda=K_M b` is paired with its raw defect `d_b`; after Schur
orthogonalization, the innovation `w_b` is paired with its Schur defect
`s_b`.  If the odd ground belongs to the complete bottom eigenspace, the
raw version gives

\[
 \Lambda_M^{\max}
 \geq{|\langle g,w_\lambda\rangle|^2\over d_b},
 \qquad
 |\mu_{\rm full}|
 \leq {\cal C}_M\sqrt{{d_b\over R_\lambda}}.
\]

The actual domain exhaustion adds a decisive circularity constraint.  Fix
a two-dimensional odd compact common-core space `V`.  A unit vector in
`V cap p_lambda^perp` is always available, and the common-core form is
independent of `lambda`.  Thus, for one fixed finite constant `C_V`,

\[
 \kappa_\lambda\leq C_V-\mu_-(\lambda).
\]

With `epsilon_lambda=E_lambda/kappa_lambda`, the identity
`E_lambda=q_lambda-mu_-*n_lambda` yields

\[
 \mu_-(\lambda)(n_\lambda-\epsilon_\lambda)
 \geq q_\lambda-\epsilon_\lambda C_V.
\]

Since checkpoint 1.77 gives `q_lambda->0` and
`n_lambda->n_infinity>0`, the unproved premise
`epsilon_lambda->0` forces `mu_-(lambda)->0`.  Odd-domain nesting then
makes `mu_-` nonnegative on the complete real family, so `q_lambda>=0`;
the one-sided Landau theorem forces RH.  The same argument works from any
cofinal schedule.  The rational three-dimensional saturation model does
not contradict this implication because its whole pole-orthogonal energy
grows and it has no fixed common-core ceiling.

The upper and lower one-sided `O(lambda^(-1))` conditions for the physical
odd self are separately RH-equivalent.  So are each of the sectoral and
global lower-shift `-o(1)` conditions and shifted-energy `o(1)` conditions.
None of those estimates is proved.  In particular, checkpoint 1.78 proves
neither `E_lambda/kappa_lambda->0`, the residual gate
`C_M^2*d_b->0`, nor the odd/full-bottom parity identification.

The focused module passes `15/15`.  With `PYTHONPATH=src` and
`PYTHONDONTWRITEBYTECODE=1`, the exact five-module deduplicated
target/direct-dependency closure passes `60/60` under `python3 -B`.
Projected canonical/raw discovery is `411/4554` and `416/4612`;
frontier/replay is `269/3032` and `281/3160`; support remains `12/128` and
exclusions remain `5/58`.  Expanded canonical/frontier/replay suites were
not rerun.

Checkpoint 1.78 proves an exact max overlap floor, the legal matching-metric raw/innovation weighted splice, and the common-core ceiling kappa_lambda <= C_V-mu_-(lambda). Consequently E_lambda/kappa_lambda -> 0 on the complete family or any cofinal schedule would force mu_-(lambda) -> 0, full-real q_lambda >= 0, and RH. The energy-ratio premise is not proved and is itself RH-strength. The one-sided physical odd self bounds and the sectoral/global lower-shift and shifted-energy o(1) statements are RH-equivalence barriers, not established estimates. No residual gate, odd/full-bottom parity identification, unconditional physical one-over-lambda bound, literal noncompact ordered finite part, transverse lower reserve, new zero theorem, RH, or de Bruijn--Newman bound is proved. The formal state remains P0_INVALIDATED.
