# Direct geometric proof attempt: explicit theta kernel and prime geometry

**21 November 2026 · Public research note.** The exact identities and the stated obstructions have complete proofs. Positive definiteness of the complete kernel and the required coupled arithmetic inequality remain unproved. **This attempt does not prove RH.** The reviews are internal and AI-assisted; no historical novelty, external peer review, or Lean verification is claimed.

Read [RH_Direct_Geometric_Attempt.pdf](RH_Direct_Geometric_Attempt.pdf) and its [editable source](RH_Direct_Geometric_Attempt.tex). The earlier [geometric compression v0.2](../geometric-compression/README.md) and [arithmetic-theta manuscript](../release-v0.1/RH_Arithmetic_Theta_Completion.pdf) remain separate releases.

## What was attempted

Two positive geometric constructions were pursued against the exact Weil/Pick form, including all mixed terms.

### 1. An explicit kernel made from the actual theta function

With the established normalization

\[
F(w)=\xi(1/2+w)=\int_{\mathbb R}\kappa(t)e^{wt/2}\,dt,
\qquad L=F'/F,
\]

define

\[
\mathcal K(t,u)=\frac12\int_{|(t+u)/2|}^{\infty}
r\,\kappa\!\left(r+\frac{t-u}{2}\right)
\kappa\!\left(r-\frac{t-u}{2}\right)\,dr.
\]

The note proves

\[
\iint\mathcal K(t,u)e^{xt/2+yu/2}\,dt\,du
=\frac{F'(x)F(y)+F(x)F'(y)}{x+y}.
\]

Thus diagonal normalization by `F(x_i)` produces exactly the complete Pick form. The kernel is entrywise positive, symmetric, and reflection invariant. Gaussian-weighted density proves that its positive definiteness is equivalent to positivity of every sparse project prefix, hence to RH using the prior manuscript's stated analytic criterion. The full positive-definiteness assertion remains open.

The natural Gaussian construction was tested explicitly. For any positive `alpha`,

\[
\mathcal K(t,u)=\frac{\kappa(t)\kappa(u)}{8\alpha}+\mathcal R_\alpha(t,u).
\]

The proposed sign of the remainder fails. At the curvature-matched value `alpha = -kappa''(0)/(2 kappa(0))`, interval arithmetic with explicit analytic tails proves

\[
\mathcal R_\alpha(0,0)<-1/2500.
\]

There is a stronger analytic obstruction: for every nonzero constant-coefficient polynomial `p` and every `c>0`, the kernel

\[
\mathcal K-c\,p(\partial)\kappa\otimes\overline{p(\partial)\kappa}
\]

is not positive definite. Exponential tests would force `L(x)/x >= c |p(-x/2)|^2`, while `L(x)/x -> 0`. This excludes the specified fixed differential channels; variable-coefficient maps, integral features, and finite-test approximations are outside its scope.

### 2. A positive energy on the actual prime-power edges

For a finite exponential test `v`, with smallest rate `x_*`, choose `1/2 < a < 2 x_* - 1/2`. Then

\[
\mathcal D_a(v)=\sum_{n\ge2}\Lambda(n)n^{a-1/2}
\|v(\cdot+\log n)-n^{-a}v\|_2^2\ge0
\]

is a genuine Gram form defined directly from prime powers. It reproduces the required signed correlations only after subtracting its exact diagonal counterterms:

\[
-2\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}\Re C_v(\log n)
=\mathcal D_a(v)-\Gamma_a\|v\|_2^2-\int B_a(t)|v(t)|^2\,dt.
\]

The complete formula retains the gamma and pole terms as well. The note proves that `B_1` cannot be bounded by a fixed multiple of the ordinary squared norm, even on the actual sparse-prefix union. The proof uses powers of two and divided differences, with no prime number theorem or RH assumption. A coupled estimate involving all terms could still succeed; that estimate remains the missing sign theorem.

## Evidence and scope

| Item | Evidence | What it establishes |
|---|---|---|
| Exact transform and density | Written proof, separately checked in two internal reviews | Correct complete-form identification and RH equivalence |
| Fixed differential-channel obstruction | Written asymptotic proof | Failure of the explicitly specified positive-channel strategy |
| Gaussian comparison at the origin | Arb interval Riemann sum plus analytic tails | A strict negative remainder for the actual theta kernel |
| Prime-delay graph | Written square expansion and convergence proof | An independently constructed positive graph energy with its exact counterterm |
| Unbounded potential | Powers-of-two bound and divided-difference proof | Failure of uniform ordinary-norm absorption on the sparse space |
| Generic geometry control | Exact Gaussian-mixture calculation | Positivity, symmetry, smoothness, Gaussian decay, and strong log-concavity alone are insufficient |
| Integral normalization sample | Independent completed-zeta and theta-integral evaluations | Floating-point consistency, not an interval positivity certificate |

The Gaussian-mixture control gives `-3/(1394 log 2)` on a two-node test. It does not share the complete arithmetic structure, entire-function order, and double-exponential decay of the Riemann kernel.

## Files and reproducibility

- [THETA_KERNEL_REVIEW.md](THETA_KERNEL_REVIEW.md): independent internal derivation, density proof, and cross-review of the prime construction.
- [ADVERSARIAL_REVIEW.md](ADVERSARIAL_REVIEW.md): adversarial mathematical review and certificate-tail audit.
- [PRIME_DELAY_GEOMETRY.md](PRIME_DELAY_GEOMETRY.md): complete prime-graph construction and its stopping point.
- [REVIEW.md](REVIEW.md): release verification levels and unresolved claims.
- [SHA256SUMS](SHA256SUMS): release-file hashes.

From this directory, in an isolated Python environment:

```sh
python -m pip install -r requirements.txt
sha256sum -c SHA256SUMS
python obstruction_check.py
python check_prime_delay_identity.py
python check_gaussian_obstruction_interval.py
python check_theta_kernel_exploratory.py
```

The exact scripts record 10 symbolic/rational controls, 112 prime-delay mixed-entry identities, and 28 nonzero-counterterm controls. The interval script proves the strict negative inequality with 160-bit Arb arithmetic, eight theta terms, and 4096 interval subdivisions. Its tail bounds are proved in the manuscript. The exploratory script compares the three-node sparse Pick matrix at three quadrature resolutions and reports a finite seven-point kernel sample; those computations do not establish global positivity. Hashes verify the published snapshot before regeneration; exploratory floating-point outputs can vary in their last digits across environments.

A standard LaTeX installation can compile the manuscript with `pdflatex` twice. Build logs and intermediate files are not part of the release.

## The remaining mathematical step

A completed direct proof needs an independently defined positive factorization of the displayed complete kernel, or a proved whole-form lower comparison with vanishing error on every fixed sparse prefix. The prime-graph alternative needs the displayed coupled domination of its exact counterterms. These conditions remain RH-equivalent and have not been established by this attempt.

The local factorizations ruled out here do not exhaust geometric approaches. This release records a concrete attempt and its demonstrated limits; it does not support a quantitative claim that the full proof is close.
