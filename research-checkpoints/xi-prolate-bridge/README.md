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

For the signed floors, `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` rewrites
the complete real-axis form using the exact multiplier `m_lambda`, retains
the opposite rank-one pole signs in the two parity sectors, and confines the
uncontrolled sign to an explicit phase-volume dangerous space plus a finite
Schur complement.  `notes/PHASE_VOLUME_SCALE_AUDIT.md` proves why neither the
fixed-lambda Haar law nor the usual fixed-moment/equidistribution argument
controls the needed finite orbit: the moment length and time scale are
incompatible.  The only source-locked global phase-volume upper bound remains
exponential in `lambda`; the desired polynomial bound is neither proved nor
disproved.

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
10. `DEFECT_RELATIVE_PROJECTION_SOURCE_LOCK.json` -- exact source bytes and
    theorem substitutions for the defect-relative projection schedule.
11. `notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` -- the source-core theorem
    for both mixed projection orientations of the corrected combined state.
12. `ZERO_SAMPLING_SOURCE_LOCK.json` -- exact MTY v1, HSW v1, and PT v1
    source bytes, constants, height ranges, and disclosed external-computation
    dependencies used in the outer--outer sampling theorem.
13. `notes/OUTER_OUTER_SPECTRAL_THEOREM.md` -- the admitted absolute
    outer--outer bound and locked-schedule Ritz-energy corollary.

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

`notes/GROWING_WINDOW_THEOREM.md` proves exact all-window source Gram and
determinant formulas, including the actual plus-anchor deflation.  The pinned
Karnik--Romberg--Davenport bound gives an explicit `O(log(lambda))` buffer
beyond `4*lambda^2` after which every positive concentration defect is at
least `1/2`.  This removes a source-coordinate rank and high-window-floor
obstruction.  It does not bound the physical arithmetic map, the fixed
leading defects, or the signed Weil form.

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
- Source-normalized finite prolate comparison state implemented: **yes,
  diagnostic Galerkin approximation without an infinite-dimensional enclosure**.
- Fourier projection rate on `N=C*ceil(lambda^2)`: **yes, qualitatively from
  the pinned prolate approximation theorem, with an exact finite inequality;
  an effective interval constant for the prolate supremum remains open**.
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
- Phase-sensitive parity multiplier/Schur reduction:
  **yes as an exact reduction; the required polynomial phase-volume bound and
  positive finite Schur floors are not proved, and the only locked global
  phase-volume upper bound is exponential in `lambda`**.
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
but neither the prolate state nor the weighted solve is interval-enclosed, and
no unbounded-schedule estimate follows from them.
The next deterministic point on the same schedule, `(lambda,N)=(3,18)`,
fails closed because both shifted sector margins are negative; it therefore
supplies no weighted inverse value.  This makes the present finite evidence
mixed rather than monotone.

Any numerical agreement, including agreement to many digits, is evidence for
the bridge and not a substitute for the uniform analytic estimates.
