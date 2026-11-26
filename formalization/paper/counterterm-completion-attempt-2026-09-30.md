# Direct counterterm attack and an explicit completion criterion

This continues the [renormalized bridge](renormalized-twist-bridge-2026-09-30.md).
The proof is **not complete**. We remove the auxiliary bridge algebra from the
missing step, construct finite approximants, and prove exactly which uniform
bound would finish this route. We also test the proposed inference from finite
positivity with an off-axis-pole control. These derivations are unrefereed;
there is no claim of novelty or formal verification.

## 1. The frozen bridge correction is explicitly harmless

Fix the second variable at v=2. Write x=p^(-u), y=p^(-2), and

\[
 b=\frac{x+y}{1+xy},\qquad
 d_p(u)=b+\tfrac12b^2-x-\tfrac12x^2.
\]

There is an exact factorization

\[
 b-x=\frac{y(1-x^2)}{1+xy},\qquad
 d_p=(b-x)\left(1+\frac{b+x}{2}\right).\tag{1}
\]

Hence `D(u)=Σ_p d_p(u)` is absolutely and locally uniformly convergent on
Re u>0. More explicitly, on Re u≥σ₀>0 set

\[
 r=2^{-\sigma_0},\quad B=\frac{r+1/4}{1-r/4},\quad
 C=\frac{1+r^2}{1-r/4}\left(1+\frac{B+r}{2}\right).
\]

Then |d_p|≤C/p², and for integer P≥2,

\[
 \left|\sum_{p>P}d_p(u)\right|\le C/P.\tag{2}
\]

This bound is uniform in imaginary height. For the prime zeta function
`P(u)=Σ_p p^(−u)`, initially defined in Re u>1, the old counterterm is exactly

\[
 Q(u,2)=P(u)+\tfrac12P(2u)+D(u).\tag{3}
\]

Define a second explicitly convergent correction

\[
 H_3(u)=\sum_p\sum_{k\ge3}\frac{p^{-ku}}{k},
 \qquad \Re u>1/3.
\]

Since `log ζ(u)=P(u)+P(2u)/2+H₃(u)` in Re u>1, the missing function becomes

\[
 J(u)=\frac{\exp(H_3(u)-D(u))}{(u-1)\zeta(u)}.\tag{4}
\]

Thus **all the frozen-bridge corrections are now absolutely convergent
nonvanishing exponential factors** on Re u>1/3. There is no remaining
cancellation to be obtained merely by bounding those corrections more sharply.
For any other fixed real v>1, the same argument gives a correction convergent
on Re u>0, since b−x=O(p^(−v)). Changing that frozen parameter only multiplies
J by an explicitly nonzero holomorphic factor; it does not change its poles.
This statement is limited to this particular family of frozen bridges.

## 2. Entire finite approximants with the correct arithmetic and pole removal

The necessary arithmetic includes prime powers, not just primes. Let Λ be the
von Mangoldt function, and let X≥2 be an integer cutoff. Set

\[
 I_X(u)=\int_1^X\frac{x^{-2}-x^{-u}}{\log x}\,dx,
\]

with the removable endpoint value at x=1, and define

\[
 L_X(u)=\sum_{n\le X}\frac{\Lambda(n)}{\log n}
                  (n^{-2}-n^{-u})-I_X(u),\qquad
 F_X(u)=\frac{\exp L_X(u)}{\zeta(2)}.\tag{5}
\]

Only prime powers contribute; for n=p^k their coefficient is exactly 1/k.
Every F_X is entire and nowhere zero, and `F_X(2)=1/ζ(2)` exactly. The
integral is entire in u because its domain is finite and the endpoint is
removable. If ℓ=log X, it can be evaluated without a branch choice as

\[
 I_X(u)=\operatorname{Ein}((u-1)\ell)-\operatorname{Ein}(\ell),\qquad
 \operatorname{Ein}(z)=\sum_{k\ge1}\frac{(-1)^{k+1}z^k}{k\,k!}.
\]

In Re u>1 both sums and integrals converge locally uniformly, and Frullani's
integral gives `I_∞(u)=log(u−1)` with its branch real on u>1. Consequently

\[
 F_X(u)\longrightarrow\frac1{(u-1)\zeta(u)}\qquad(\Re u>1).\tag{6}
\]

These approximants have the right normalization and a proved common domain;
no unknown continuation has been inserted in their definition.

### The exact completion theorem

For the family (5), the following are equivalent:

1. RH.
2. For every compact K contained in Re u>1/2,
   `sup_{X≥2} sup_{u∈K}|F_X(u)|<∞`.
3. F_X converges locally uniformly to a finite holomorphic function on
   Re u>1/2 agreeing with `1/((u−1)ζ(u))` in Re u>1.

**Proof that the proposed bound completes RH.** Condition 2 and Cauchy's
estimates give equicontinuity on each smaller compact subset. Successive
Arzelà–Ascoli extraction on a compact exhaustion produces a locally uniformly
convergent subsequence with a holomorphic limit F. Equation (6) identifies it
on Re u>1. The holomorphic function `Z₀(u)=(u−1)ζ(u)` is defined on the whole
half-plane, and the identity theorem gives `Z₀ F=1` throughout it. Thus Z₀ has
no zeros there, and the functional equation gives RH. Every subsequential
limit is the same, so the full sequence converges as in 3. Condition 3 implies
2, since a convergent tail is bounded and the finitely many initial cutoffs
are bounded on each compact set.

For RH⇒3, the explicit arithmetic error formula below proves local uniform
convergence, including at u=1. This completes the equivalence. ∎

Equivalently, the precise missing inequality is an **upper bound only**:

\[
 \boxed{\quad
  \forall K\Subset\{\Re u>1/2\},\qquad
  \sup_{X\ge2}\sup_{u\in K}\Re L_X(u)<\infty.
 \quad}\tag{7}
\]

No lower bound or uniform positive spectral gap is required. We have not
proved (7). Checking finitely many cutoffs or sampling finitely many u is not
a substitute for its two uniform quantifiers.

## 3. Direct arithmetic attempt: the exact error and the failed bound

Let `E(x)=ψ(x)−x+1`, with ψ including all prime powers. Differentiating (5)
gives an entire function

\[
 G_X(u)=L_X'(u)=\sum_{n\le X}\Lambda(n)n^{-u}-\int_1^X x^{-u}\,dx.
\]

Stieltjes integration by parts gives the exact finite identity

\[
 G_X(u)=E(X)X^{-u}+u\int_1^X E(x)x^{-u-1}\,dx.\tag{8}
\]

The endpoint term is essential, including when X is itself a prime power.
If for some α and C we had `|E(x)|≤C x^α` for every x≥1, the integral would
converge locally uniformly in Re u>α, and with
`G(u)=u∫₁^∞ E(x)x^(−u−1)dx`,

\[
 |G_X(u)-G(u)|
 \le C X^{\alpha-\sigma}
      \left(1+\frac{|u|}{\sigma-\alpha}\right),\qquad \sigma>\alpha.\tag{9}
\]

Integrating along paths from 2 proves local uniform convergence of L_X and
F_X. RH gives such bounds for every α>1/2, which proves RH⇒3 above. Using
those same bounds to prove RH here would be circular.

The elementary estimate `ψ(x)≤Σ_{n≤x}log n≤x log x` yields an absolutely
convergent majorant only for σ>1. Even a usual subexponential PNT error
majorant of the form `Cx exp(−c sqrt(log x))` does not supply this absolute
integrability at any fixed σ<1: after t=log x, its integral contains
`exp((1−σ)t−c sqrt(t))`. The majorant diverges. This is failure of that
estimate, not proof that the actual signed integral diverges.

Nor does E have a globally usable fixed sign: for 1<x<2 it equals 1−x<0,
at x=5 it equals `log 60−4>0` (including the power 4). The checker
encloses this positive value between 0.0943 and 0.0944. More fundamentally,
complex u introduces an oscillatory factor, so a real-axis sign argument
would not on its own bound Re L_X on all the compact subsets in (7).

The signed estimate (7) is less prescriptive than the sufficient absolute
estimate (9). It remains a legitimate target, but no bound proving it is
obtained by the present calculation.

## 4. A control that rejects a tempting completion shortcut

Finite entire zero-freeness, critical-line positivity, and direct/dual symmetry
are not enough for condition (7). This can be checked with a completely
explicit family. Put z=u−1/2, a=1/4+2i, and

\[
 W_N(u)=\exp\!\left[\sum_{k=1}^N
       \frac{(z^2/a^2)^k+(z^2/\bar a^2)^k}{k}\right].\tag{10}
\]

Each W_N is entire, nowhere zero, invariant under u↔1−u, and respects complex
conjugation. It is strictly positive on the critical line, since the two terms
in each numerator there are conjugates. Yet inside |z|<|a|,

\[
 W_N(u)\longrightarrow
 \frac1{(1-z^2/a^2)(1-z^2/\bar a^{\,2})}.
\]

The limiting rational function has four poles
at `u=1/2±a` and `u=1/2±conj(a)`, all off the critical line. At z=a the first
sum is the harmonic sum; the second converges by Dirichlet's test because
`a²/(conj(a))²` lies on the unit circle and is not 1. Thus |W_N(1/2+a)| tends
to infinity and this family is not locally bounded there.

This is a control on the proposed analytic inference, not a counterexample to
RH or a claim that W_N has the arithmetic of zeta. It shows exactly why
positivity of the renormalized ladder cannot supply the missing compact bound
without an additional arithmetic argument.

## Finite experiment: useful diagnostics, no uniform bound

At u=0.75+14i the certified absolute error against the independently evaluated
regularized reciprocal decreases from about 0.06209 at X=100 to 0.02399 at
X=1,000 and 0.01059 at X=10,000. At the real point u=0.75 it decreases from
0.03414 to 0.001662 and then increases to 0.001913. These are finite pointwise
computations with rigorous numerical enclosures. They neither prove
convergence nor a bound over a continuous compact set and all larger cutoffs.
The nonmonotonic example also prevents treating the last observed increment
as an automatic tail estimate.

## Status and reproduction

The bridge normalization has been reduced to absolutely convergent corrections
and the explicit prime-power inequality (7). The finite approximants and the
completion implication are constructed. The cutoff-independent bound is
still unproved; there is no complete RH proof to report.

```sh
python -m pip install -r scripts/requirements-rh-audit.txt
python scripts/audit-counterterm-completion.py --output research-inputs/rh-positivity-audit/counterterm-completion.json
```

The checker verifies finite identities with Arb/Acb enclosures, includes the
endpoint-term and prime-versus-prime-power negative controls, and records
finite approximant values separately from any infinite-cutoff claim. The
entire-integral series uses an explicit remainder bound. The finite checks do
not formally verify the analytic argument.

Classical inputs: [DLMF §27.4](https://dlmf.nist.gov/27.4) for Euler products;
[DLMF §25.16](https://dlmf.nist.gov/25.16) for ψ and the RH-equivalent family of
prime-distribution error bounds. The compactness implication is proved above
from Cauchy's estimates, Arzelà–Ascoli, and the identity theorem.
