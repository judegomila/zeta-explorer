# Proof audit and limits

Research continuation, 10 November 2026.

## Established claims

1. A covariance comparison lemma determines strict derivative signs
   of ratios of centered call covariances from strict concavity or
   convexity of one increasing source as a function of another.
2. The exact canceled theta Green inverse has that covariance form.
   It reduces the two ratio targets for every anchor to three signs
   for the original kernel: W'>0, D_W>0, D_h>0.
3. All three signs hold on the entire positive half-line. The origin
   and bounded interval have rigorous ball-arithmetic enclosures;
   the full tail has explicit analytic bounds.
4. Hence (n_a/b_a)'>0 and (n_a/kappa)'<0 for all a,t>0. The strict
   logarithmic-derivative sandwich also proves n_a'<0 there.
5. Both second canceled kernels are strictly positive for every pair
   of positive anchors. The Schur identities give an intrinsic theta
   proof of strict three-node real Pick positivity and its finite
   energy consequence.
6. For the proposed stronger two-kernel class, one reduction proves
   the basic shape signs of the new canonical pair. Exact formulas
   isolate three additional preservation conditions; their truth is
   not asserted.

## Proof dependencies

The classical input is the actual theta kernel's positivity, evenness,
decay, decrease, and squared-variable strict log-concavity. The latter
is Theorem 4.2(b) in the Csordas reference in SOURCES.md. In this
normalization kappa(t)=Phi(t/4), Q=-kappa'/(t*kappa)>0 and Q'>0.
It implies 4QC<kappa and (C/kappa)'<0. The existing canceled Green
formula and positive first pair are used from their fixed repository
proofs, independently of the finite-zero proof of higher Pick orders.

The new proof uses no computed zero ordinates, finite-height zero
theorem, RH assumption, or assumed positivity of an unknown spectral
tail. No claim is made that Q'>0 alone implies the new convexities.

## Compact certificate correctness

- Origin: the even analytic kernel is expanded in u=t^2. Coefficients
  through degree 20 include explicit errors for all theta terms beyond
  n=16. A complex-disk Cauchy bound controls every omitted Taylor term
  and derivatives through order four. Thirty-two exact dyadic cells
  cover 0<=u<=1/64. The determinant factors 8t^3 are retained, so
  arbitrarily small t>0 is covered.
- Endpoint C values: FLINT complex ball integration encloses the
  finite entire integrand on [t,t+4]. Explicit majorants cover the
  omitted theta series and remaining spatial tail. The finite integral
  is not substituted for the improper integral without an error bound.
- Core: 1,984 dyadic cells cover [1/8,4] with no gap. Every derivative
  Taylor model has a Lagrange remainder containing the full theta
  tail. Polynomial products retain their complete degrees. C is
  propagated from its rigorously enclosed value at 4, with absolute
  integrated remainder bounds on both halves of each cell.
- Positivity gates test ball lower bounds, not midpoints or sampled
  signs. Conservative displayed decimal margins lie strictly below
  the computed lower bounds. Failure of a cell assertion aborts the
  runner. The C(1/8) direct/propagated overlap is an extra consistency
  check and is not used as a substitute for the propagation proof.

The implementation relies on the correctness of Python, SymPy, and
python-flint/FLINT/Arb as installed. Package versions are pinned.
Ordinary Python assertions are active in the recorded run; do not
invoke the runner with Python optimization that disables assertions.
The proof is computer assisted, not formally verified in a proof
assistant. The stored JSON is a replay summary; rerunning the scripts
recomputes the enclosures rather than trusting the stored summary.

## Tail proof correctness

For t>=4, P=pi*exp(t)>128. The first theta term supplies rational
expressions for its logarithmic derivatives. A positive rational
subsolution bounds the integrated ratio from below. Exact coefficient
checks after P=128+X and t=4+Y establish first-term margins above one.
Explicit Gaussian tail and derivative estimates control every other
theta term, logarithmic derivative, and integrated ratio. A common
error bound below 2^(-288) gives margins above one half for the actual
kernel. The 56 exact checks audit the finite algebra; the analytic
remainder derivation is in the tail note.

## Verification recorded in this checkpoint

The packaged `run_checks.py` passed under Python 3.12.14,
python-flint 0.9.0, at 224-bit precision:

| Gate | Result |
| --- | --- |
| Comparison algebra | 21 exact checks passed |
| Origin certificate | 32 interval cells passed, including rigorous C(0) input |
| Core numerator identities | Four exact symbolic checks passed |
| Core certificate | 1,984 interval cells passed, including rigorous C(4) input |
| Tail algebra | 56 exact checks passed |

Independent internal mathematical review checked the covariance
comparison, its normalization and application, the tail constants and
integrated subsolution, the C endpoint enclosures, and the bounded
interval Taylor/remainder implementation. These reviews are part of
the research workflow and do not constitute external peer review.

## Claims deliberately left open

- The three extra signs preserving the stronger class for the first
  reduced pair at all anchors and all t.
- Any theorem preserving a sufficient class at arbitrary depth.
- The fifth Pick stage or positivity at every matrix size.
- An unconditional all-order energy inequality or an RH proof.
- A purely analytic replacement for the compact interval certificate.
- Literature novelty of the proved finite-order or kernel properties.

PR #50 already proves four-node positivity by a different argument.
This checkpoint does not remove that argument's finite-zero input or
claim to increase the proved matrix order. The new content is the
global pointwise theta-ratio mechanism and its intrinsic three-node
consequence.

## Diagnostics and scope of changes

Files in `diagnostics/` use high-precision numerical quadrature and
explicitly do not claim rigorous interval enclosures. Sixteen first
reduced-pair cases passed the proposed three signs; three extreme cases
were stable at 65 and 95 digits. These checks can guide subsequent
work but cannot justify a continuum or all-depth assertion.

Only this new research directory and the new decision record are
included. The base is main at
`942ba1760c4ef54a519750ab91c37a661c31e0ce`. Prior checkpoint files,
application files, and workflows are not modified. Repository CI, if
run for the PR, checks the repository's configured gates; the new
mathematical certificate was run separately and is not implicitly
claimed to be executed by the existing CI workflow.
