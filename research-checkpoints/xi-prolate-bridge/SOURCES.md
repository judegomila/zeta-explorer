# Primary sources and status

## Main construction

- A. Connes, C. Consani, and H. Moscovici, *Zeta Spectral Triples*,
  arXiv:2511.22755v1 (2025),
  <https://arxiv.org/abs/2511.22755>.  The finite self-adjoint operator and
  determinant identity are Theorem 1.1 / Section 5.  The prolate limit is
  Lemma 7.3.  Section 8 explicitly states the two missing steps.  A published
  version is listed by EMS Press at <https://ems.press/books/elm/323/6477>.
  P0 audit note: the pinned v1 formulas imply a factor `Xi/4` in Section 7,
  and printed (4.14) double-counts `c(L)` relative to (3.15)/(4.4). These
  discrepancies and the scalar-safe repair are recorded in
  `P0_SOURCE_ERRATA.md`; the printed claims are not used silently.
  Lemma 7.2, equations (7.7)--(7.12), is also the pinned asymptotic input to
  `notes/PROJECTION_RATE_THEOREM.md`.  That note independently restores the
  omitted limiting-Hermite lattice tail and derives the Fourier projection
  bound; the lemma's implicit constant is not presented as an effective
  finite enclosure.
  The finite boundary route uses Lemma 5.1 (5.2), Lemma 5.2(ii) (5.3), the
  argument after Definition 5.3, (5.15), and the shifted application in
  Theorem 5.10; it is reproduced in
  `notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md`.
  The complete quotient-metric self-adjointness theorem, spectral-cut phase,
  regularized determinant factorization, arbitrary-rescaling audit, and
  conditional locally uniform normalization are reproduced in
  `notes/DETERMINANT_LIMIT_AUDIT.md`.  That audit also makes explicit that the
  unit-vector comparison functions are dephased, nowhere-zero entire
  multiples of the literal boundary-normalized determinants.
  The pole, archimedean, and minus-prime formulas (3.13)--(3.19) are also
  recombined directly in `notes/CHEBYSHEV_ERROR_REWRITE.md` into one exact
  Stieltjes/Chebyshev-error integral.  That rewrite is a derivation from the
  locked formulas, not an additional source claim or a positivity theorem.
  Likewise, the closed logarithmically weighted Cauchy form, explicit
  high-mode coercivity, and bounded low--high coupling in
  `notes/HIGH_FOURIER_COERCIVITY.md` are repository derivations from the
  pinned finite coefficients; they are not attributed to a source theorem
  and supply no signed low-sector floor.
  `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` is likewise a repository
  derivation: it reconstructs the complete real-axis multiplier and parity
  pole signs and reduces the unresolved floors to a phase-volume dangerous
  space and finite Schur complement.  Its desired polynomial phase-volume
  estimate is not a CCM claim and is not proved here.
  `notes/PHASE_VOLUME_SCALE_AUDIT.md` proves the finite-orbit moment-length
  obstruction and records that the exact locked global upper bound remains
  exponential in `lambda`; it neither proves nor disproves the polynomial
  target.

- A. Connes, C. Consani, and H. Moscovici, *Zeta zeros and prolate wave
  operators*, arXiv:2310.18423,
  <https://arxiv.org/abs/2310.18423>.

## Prolate concentration audit

- S. Karnik, J. Romberg, and M. A. Davenport, *Improved bounds for the
  eigenvalues of prolate spheroidal wave functions and discrete prolate
  spheroidal sequences*, arXiv:2006.00427v2,
  <https://arxiv.org/abs/2006.00427v2>.  The exact v2 PDF is vendored and
  hashed in `P2_SOURCE_LOCK.json`.  Corollary 3 gives the admitted explicit
  transition-window bounds for the positive sinc-kernel eigenvalues.  With
  `c=2*pi*lambda^2`, its denominator is
  `(2/pi^2)*log(200*lambda^2+25)`; reversing that fraction is rejected.  The
  result supplies a buffered additive high-window floor, not a signed Weil
  comparison.  KRD Section 6.2 invokes a DPSS-to-PSWF spectral comparison;
  its primary source, Boulsane--Bourguiba--Karoui
  arXiv:1905.08354v1,
  <https://arxiv.org/abs/1905.08354v1>, Proposition 1 (32)/(37), is also
  vendored and hashed in `P2_SOURCE_LOCK.json`, closing that transition-bound
  dependency.

- D. Slepian, *Prolate Spheroidal Wave Functions, Fourier Analysis and
  Uncertainty--IV: Extensions to Many Dimensions; Generalized Prolate
  Spheroidal Functions*, Bell System Technical Journal 43 (1964),
  3009--3057,
  <https://doi.org/10.1002/j.1538-7305.1964.tb01037.x>.  A lawful primary scan
  is vendored and hashed in `PROLATE_DEFECT_SOURCE_LOCK.json`.  Equations
  (89)--(93), together with the one-dimensional reduction on pages
  3037--3039, give the qualitative fixed-index concentration-defect
  asymptotic and `d_4/d_8=O(c^(-4))`.  The printed `O(1/c)` has no explicit
  constant or threshold, so this is not a finite bound and supplies no
  signed Weil floor.

- W. H. J. Fuchs, *On the eigenvalues of an integral equation arising in the
  theory of band-limited signals*, J. Math. Anal. Appl. 9 (1964), 317--330,
  <https://doi.org/10.1016/0022-247X(64)90017-4>.  This is the historical
  source usually cited for the ordinary fixed-index formula.  The present
  proof chain does not depend on inaccessible Fuchs bytes because the pinned
  Slepian paper independently derives the same formula.

- A. Bonami, P. Jaming, and A. Karoui, *Non-Asymptotic behaviour of the
  spectrum of the Sinc Kernel Operator and Related Applications*,
  arXiv:1804.01257v1, <https://arxiv.org/abs/1804.01257v1>.  This primary
  research paper transcribes the Fuchs asymptotic and proves an explicit
  one-sided bound.  The explicit bound loses an exponential factor relative
  to the fixed-index scale and is insufficient for the required determinant
  comparison.  Exact conventions and the effective/non-effective boundary
  are recorded in `notes/PROLATE_DEFECT_SOURCE_AUDIT.md`.

## Exact global radical input

- A. Connes and C. Consani, *BC-system, absolute cyclotomy and the
  quantized calculus*, arXiv:2112.08820v1,
  <https://arxiv.org/abs/2112.08820v1>, published in *EMS Surveys in
  Mathematical Sciences* 9 (2022), DOI
  <https://doi.org/10.4171/EMSS/64>.  Published Section 4.3, (13)--(14),
  fixes the transform/Poisson normalizations; Section 4.5, (26)--(27),
  states the global `Ran(E)` radical inclusion.  Proposition 4.10 is only a
  semilocal identification and is not a positive finite-window theorem.

- A. Connes and C. Consani, *Spectral Triples and Zeta-Cycles*,
  arXiv:2106.01715v1, <https://arxiv.org/abs/2106.01715v1>.  Equations
  (1.1)--(1.4), (3.1)--(3.2), and (6.4) give the spectral Weil pairing,
  the map `E`, Poisson symmetry, and its zeta-factor Mellin transform.
  The resulting statement that `Ran(E)` lies in the two-sided global
  algebraic radical is unconditional.  The source does not give a positive
  hard-window leakage theorem.

- A. Connes, *Trace formula in noncommutative geometry and the zeros of the
  Riemann zeta function*, arXiv:math/9811068v1,
  <https://arxiv.org/abs/math/9811068v1>.  Section III (6), (18), and (19)
  supplies the codimension-two space and the original isometric `E` map;
  Appendix I contains the Poisson/Mellin antecedent.

The downloaded byte hashes, exact transform signs, and domain caveat are in
`P1_SOURCE_LOCK.json`.  The new bounded-variation extension, exact
codimension-two correction of the finite source state, and spectral-tail
identity are proved separately in
`notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md`; they are not attributed to the
sources.  `notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` applies that
two-sided identity to the actual corrected, source-normalized combined
`0/4` state and then uses repository-derived Fourier/Cauchy estimates to
close both mixed projection orientations.  It neither attributes a
modewise radical statement to these sources nor proves a generic outer
multiplier theorem.

## Combined Chebyshev-kernel moment input

- A. Fiori, H. Kadiri, and J. Swidinsky, *Sharper bounds for the Chebyshev
  function psi(x)*, arXiv:2204.02588v3,
  <https://arxiv.org/abs/2204.02588v3>.  Corollary 1.4 of the vendored v3 PDF
  gives the unconditional bound
  `|psi(X)-X|/X < 9.22022*(log X)^(3/2)*exp(-0.8476836*sqrt(log X))`
  for every `X>2`.  The arXiv abstract HTML retains the older decimal
  `9.22106`; the PDF bytes and their SHA-256 hash in `P3_SOURCE_LOCK.json`
  are binding.  The source bound proves finite `L1`, `L2`, and first weighted
  `L2` moments of the complete normalized Chebyshev-error kernel.  The
  boundary-Hankel and projection-Toeplitz identities and the explicit
  incomplete-gamma conversions in
  `notes/NEAR_SIGNED_HANKEL_REDUCTION.md` are repository derivations, not
  source claims.  The exact all-range two-outer correlation, sampled-tail
  `L2` bound, and hard-endpoint obstruction in
  `notes/OUTER_OUTER_ENDPOINT_OBSTRUCTION.md` are also repository
  derivations.  By themselves they do not establish the complete signed
  outer--outer estimate; that pairing is instead closed by the separate
  weighted-translation and zero-sampling theorem described below.  Although
  the source proof uses a finite verified-height
  computation, its theorem is unconditional; this project imports no zero
  table and assumes no global zero reality.

## Zero-free, zero-count, and finite-height sampling inputs

- M. J. Mossinghoff, T. S. Trudgian, and A. Yang, *Explicit zero-free
  regions for the Riemann zeta-function*, arXiv:2212.06867v1,
  <https://arxiv.org/abs/2212.06867v1>.  Theorem 1.1 supplies the exact
  all-height Vinogradov--Korobov region with constant `55.241` for
  `|t|>=3`.  The exact v1 PDF is vendored and hashed in
  `ZERO_SAMPLING_SOURCE_LOCK.json`.  Its proof uses the PT finite-height
  verification, numerical optimization, and HSW Corollary 1.2 as equation
  (3.8); the resulting indirect finite-database dependency is disclosed and
  is not replayed here.

- E. Hasanalizade, Q. Shen, and P.-J. Wong, *Counting zeros of the Riemann
  zeta function*, arXiv:2107.06506v1,
  <https://arxiv.org/abs/2107.06506v1>.  The binding input is Theorem 1.1 with
  the first row of Table 2 at `T_0=30610046000`, including the source-critical
  `+1/8` in `|N(T)-M(T)+1/8|<=R(T)`.  The sampling overlap does not directly
  use the rounded, database-assisted Corollary 1.2; it uses the analytic
  theorem at an explicit higher endpoint.  MTY's separate indirect use of
  that corollary remains disclosed.

- D. Platt and T. Trudgian, *The Riemann hypothesis is true up to
  3·10^12*, arXiv:2004.09765v1,
  <https://arxiv.org/abs/2004.09765v1>.  Theorem 1 gives the exact verified
  height `3000175332800` used for the low block.  The paper reports Arb ball
  arithmetic and a Turing-method count.  This repository pins and hashes the
  v1 bytes and statement but does not replay that large computation and does
  not read a decimal zero list.

The exact formulas, hashes, theorem locations, and dependency boundary are
in `ZERO_SAMPLING_SOURCE_LOCK.json` and
`notes/ZERO_SAMPLING_SOURCE_AUDIT.md`.  These external theorems are combined
with the repository-derived degree-seven weighted translation theorem and a
full closed-strip Fejer/BV domain passage in
`notes/OUTER_OUTER_SPECTRAL_THEOREM.md`.  The result is the admitted bound
`|W_Z(O_lambda,O_lambda)|/d_8 -> 0` and, after the other three remainder
pairings, `q_lambda(p,p)=o(d_8)` on the locked schedule.  These are quadratic
energy statements, not signed sector floors, residual-action bounds,
equation (5.2), or determinant convergence.

## Defect-relative projection input

- M. Egidi and A. Seelmann, *An abstract Logvinenko--Sereda type theorem for
  spectral subspaces*, arXiv:2010.11901v2,
  <https://arxiv.org/abs/2010.11901v2>.  The exact v2 TeX gzip is vendored and
  hashed, both before and after decompression, in
  `DEFECT_RELATIVE_PROJECTION_SOURCE_LOCK.json`.  Theorem 1.2 is applied on
  `R` to the observation set `R\[-lambda,lambda]` with
  `(gamma,rho)=(1/2,4lambda)` and the disjoint interval covering
  `(kappa,l_1,eta)=(1,4lambda,1)`.  With the angular-frequency Laplacian
  energy `(2*pi*lambda)^2`, this gives the explicit lower concentration
  defect bound used in `notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md`.  That
  repository theorem controls ordinary and logarithmically weighted Fourier
  projection tails on an enormous exponential diagonal; it does not by
  itself control a signed Weil-distribution pairing or a shifted sector.
  After combining it with the separately derived closed Cauchy-form
  continuity, `notes/COMPACT_PROJECTION_WEIL_BOUND.md` does control the pure
  compact P--P pairing at the geometric-mean defect scale.  This second step
  is a repository theorem, not a claim of Egidi--Seelmann.  Combined with the
  independently pinned two-sided radical identity,
  `notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` also closes both mixed
  orientations for the actual corrected combined source state.  The
  complete outer--outer pairing is closed separately by
  `notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md` and
  `notes/OUTER_OUTER_SPECTRAL_THEOREM.md`; this does not upgrade any of these
  scalar pairings to a signed operator floor or residual-action estimate.

## Independent computational context, not theorem input

- A. Groskin, *High-Precision Approximation of Riemann Zeros via the
  Truncated Weil Form*, arXiv:2605.20224,
  <https://arxiv.org/abs/2605.20224>.  This is a 2026 preprint and explicitly
  makes no RH proof claim.

- A. Groskin, *A finite Guinand--Weil dictionary and archimedean tail order
  for the truncated Weil quadratic form*, arXiv:2607.02828,
  <https://arxiv.org/abs/2607.02828>.  This is a recent preprint; its formulas
  and code require independent verification before reuse.

## Comparison routes

- M. Suzuki, *A canonical system of differential equations arising from the
  Riemann zeta-function*, arXiv:1204.1827,
  <https://arxiv.org/abs/1204.1827>.  This supplies the shifted
  Hermite--Biehler/canonical-system architecture, but positivity for all small
  shifts remains the hard condition.

- D. Romik, *Orthogonal polynomial expansions for the Riemann xi function*,
  arXiv:1902.06330, <https://arxiv.org/abs/1902.06330>.  The expansions provide
  useful coordinates but no known real-zero-preserving truncation theorem.

- D. H. J. Polymath, *Effective approximation of heat flow evolution of the
  Riemann xi function, and a new upper bound for the de Bruijn--Newman
  constant*, arXiv:1904.12438,
  <https://arxiv.org/abs/1904.12438>.  This belongs to the separate Lambda
  lane and is not an input to the direct residual--gap theorem.

The recent 2026 preprints are exploratory sources, not established consensus.
The core proof route should be rebuilt from exact formulas and independently
checked.
