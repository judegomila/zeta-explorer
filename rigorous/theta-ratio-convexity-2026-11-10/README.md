# Global theta ratios and the next preservation problem

Research continuation, 10 November 2026. Both pointwise ratio signs left
open in PR #50 are now proved for the actual theta kernel, for every
positive anchor and every positive spatial argument. This is a
computer-assisted mathematical proof: an analytic comparison removes
the anchor, interval certificates cover the bounded spatial interval,
and explicit analytic bounds cover the infinite tail.

The result proves positivity of both second canceled kernels and gives
a direct theta proof of every three-node real Pick inequality. It does
not prove preservation at arbitrary depth or RH. The fourth-stage
result in PR #50 remains a separate theorem with its stated
finite-height zero input; this checkpoint advances the kernel mechanism
without raising the largest matrix order already established there.

## 1. The theorem

Use the established even theta kernel and normalization

$$
\kappa(t)=e^{t/4}\sum_{n\ge1}
\bigl[2(\pi n^2e^t)^2-3\pi n^2e^t\bigr]e^{-\pi n^2e^t},
\quad t\ge0,
$$

$$
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}dt,
\qquad L=F'/F,\qquad C(t)=\frac14\int_t^\infty s\kappa(s)ds.
$$

For an anchor $a>0$, put $p=L(a)>0$. The positive even first
canceled pair satisfies

$$
n_a+a b_a=C,\qquad an_a+4b_a''=p\kappa.
$$

The new theorem is

$$
\boxed{(n_a/b_a)'(t)>0,\qquad(n_a/\kappa)'(t)<0
\quad\text{for every }a,t>0.}
$$

Equivalently, the logarithmic derivatives lie in the strict band

$$
\boxed{\frac{C'}C<\frac{n_a'}{n_a}<\frac{\kappa'}\kappa<0.}
$$

Thus the first numerator itself decreases on the positive half-line.
At zero the displayed first derivatives vanish by evenness; strict
ratio derivative signs are asserted only for $t>0$.

## 2. Why a theorem for every anchor became tractable

Define quantities of the original kernel alone:

$$
V=-\log\kappa,\quad f=tV',\quad
W=4\kappa''/\kappa,\quad h=C/\kappa.
$$

The [comparison proof](theta_ratio_analytic_20261110.md) establishes
that the known signs $f'>0$, $h'<0$, together with

$$
\boxed{W'>0,\qquad W''f'-W'f''>0,\qquad h''f'-h'f''>0,}
$$

imply both ratio signs simultaneously for every anchor. These are two
convexity conditions in the increasing coordinate f: W is increasing
and strictly convex, and h is decreasing and strictly convex.

The key identity expresses the canceled Green inverse as a covariance
with $(Y-y)_+$ after $Y=\tanh(as/2)$. A proved comparison lemma
turns convexity of the source functions into monotonicity of the
quotient of their Green inverses. No grid of anchor values enters the
proof.

The [global proof](theta_ratio_global_20261110.md) verifies the three
original-kernel inequalities exhaustively:

| Spatial region | Proof | Certificate size |
| --- | --- | --- |
| $0<t\le1/8$ | Even Taylor expansion in $u=t^2$, explicit complex-disk Cauchy remainder | 32 dyadic interval cells |
| $1/8\le t\le4$ | Full interval Taylor models, explicit theta-derivative tails, rigorous backward integration of C | 1,984 dyadic interval cells |
| $t\ge4$ | First-theta-term rational subsolution and explicit bound for every omitted theta term | Analytic half-line proof; 56 exact algebra checks |

The bounded certificates use 224-bit ball arithmetic and recompute
their integrated endpoint inputs rigorously. They cover every point
of each interval. The proof uses classical theta concavity, but no
finite-height zero verification, assumed positive zero measure, or RH
assumption.

## 3. Consequences for the second bridge and finite energy

At a second anchor $c>0$, write $q=R_a(c)>0$. The two second
sources are

$$
S_U=n_a-cq b_a,\qquad
S_V=qp\kappa-(aq+c)n_a.
$$

The two proved ratio signs force exactly one negative-to-positive
crossing for each source. Their cosh-weighted masses vanish at c, so
the canceled Green lemma makes both resulting kernels strictly
positive for every $a,c>0$, including at the spatial origin.

Consequently the second response $R_{a,c}(x)=xU(x)/V(x)$ is
positive for all $x>0$. The exact Schur congruences yield

$$
\boxed{\left[\frac{L(x_i)+L(x_j)}{x_i+x_j}\right]_{i,j=1}^3
\succ0\quad\text{for three distinct positive real }x_i.}
$$

For any nonzero coefficient vector and at most three distinct rates
$x_i>1/2$, the corresponding finite quadratic energy

$$
\sum_{i,j}\overline{b_i}b_j
\frac{L(x_i)+L(x_j)}{x_i+x_j}
$$

is strictly positive. The previously derived arithmetic energy identity
can therefore use this intrinsic theta proof at three rates. This
does not remove the finite-zero input from the different four-rate
proof in PR #50.

## 4. The exact remaining preservation target

For a positive even canonical pair $(u,v)$ with response $zU/V$,
set

$$
H=u/v,\qquad B=4u''/v,\qquad J=4v''/v.
$$

The stronger candidate class requires $H'<0$, $B'>0$, $J'>0$,
and strict convexity of H and J as functions of B. The actual starting
pair $(C,\kappa)$ now satisfies that class: $H=h$, $B=f-1$,
$J=W$.

One reduction followed by a canonical swap gives the positive pair
$(b,n)$. With $r=R(a)$ and the increasing spatial coordinate
$z=v/n$, its ratios are exactly

$$
H_{\rm new}=(Hz-1)/a,\quad
B_{\rm new}=rz-a,\quad
J_{\rm new}=a^2+(B-ar)z.
$$

The basic signs $H_{\rm new}'<0$ and $B_{\rm new}'>0$ follow
from the comparison theorem. The additional conditions needed to
preserve the stronger class are precisely

$$
\boxed{
\frac{d}{dz}[(B-ar)z]>0,\qquad
\frac{d^2}{dz^2}(Hz)>0,\qquad
\frac{d^2}{dz^2}(Bz)>0.
}
$$

These three signs remain unproved. There is no assertion that they
follow automatically from the input class. The next useful question
is whether they hold for the actual reduced theta pair and, beyond
that, whether a sufficient class is preserved at every reduction.

The [diagnostic note](diagnostics/theta_reduced_class_diagnostic_20261110.md)
derives exact formulas for testing these signs. Sixteen selected cases
and three extreme cases repeated at higher precision found no failure.
Those observations are explicitly numerical evidence, not part of
the global theorem or a preservation certificate.

## 5. Reproduce and review

From this directory, use an ordinary Python invocation without `-O`:

```bash
python -m pip install -r requirements.txt
python run_checks.py
```

The runner recomputes rigorous C endpoints, checks all interval cells,
and executes 21 comparison identities, four cleared-numerator
identities, and 56 tail algebra checks. Captured output is
[proof_replay.json](proof_replay.json). The analytic arguments in the
notes remain part of the proof; this is not a formal proof-assistant
verification. Diagnostic scripts are not invoked by the proof runner.

Read [AUDIT.md](AUDIT.md) for proof inputs, limitations, and review
coverage, [SOURCES.md](SOURCES.md) for primary references and immutable
preceding checkpoints, and `MANIFEST.json` for hashes. The
[asymptotic companion](theta_ratio_asymptotic_20261110.md) gives
additional boundary checks; those are auxiliary to the exhaustive
global proof.

This continuation adds a dedicated research directory and one decision
record, based on main at
`942ba1760c4ef54a519750ab91c37a661c31e0ce`. Prior research branches are
linked at fixed commits; their merge is not presumed. No literature
novelty claim is made.
