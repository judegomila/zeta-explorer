# Renormalizing the sign-twisted bridge: a limit and the arithmetic it removes

This continues [the correlated bridge investigation](correlated-twist-bridge-2026-09-30.md).
We construct a nonzero limit, track its normalization back to zeta in a genuine
common domain, and locate the remaining RH-equivalent continuation problem.
These are unrefereed derivations, not a proof of RH or a novelty claim.

## 1. Deterministic rescaling cannot repair the pointwise random limit

At s=1/2 the previous bridge is

\[
 M_P=\prod_{p\le P}(1+\varepsilon_p b_p),\qquad
 b_p=\frac{2\sqrt p}{p+1},
\]

with independent fair signs. Put

\[
 a_p=\operatorname{atanh} b_p,\quad
 d_P=\tfrac12\sum_{p\le P}\log(1-b_p^2),\quad
 v_P=\sum_{p\le P}a_p^2.
\]

The exact identity `log M_P = d_P + Σ ε_p a_p` separates drift and fluctuation.
The a_p are bounded and tend to zero, while v_P diverges since a_p≥b_p and
Σ_p b_p² diverges. Thus the Lindeberg condition is eventually empty for every
fixed threshold after dividing by sqrt(v_P). The Lindeberg–Feller theorem gives

\[
 \frac{\sum_{p\le P}\varepsilon_p a_p}{\sqrt{v_P}}
 \ \Longrightarrow\ N(0,1).
\]

Convergence of distribution functions to a continuous distribution function is
uniform. Therefore, for every fixed interval length L,

\[
 \sup_x\Pr\left\{\sum_{p\le P}\varepsilon_p a_p\in[x,x+L]\right\}
 \longrightarrow0.
\]

Indeed the corresponding normal interval has length L/sqrt(v_P), and its mass
is at most that length divided by sqrt(2π); the two distribution-function
errors tend uniformly to zero. Endpoint atoms can be bounded by the same
uniform error, or by enlarging the interval by any fixed positive amount.

Consequently, for **any deterministic numbers c_P>0** and any 0<A<B<∞,

\[
 \Pr\{A\le c_PM_P\le B\}\longrightarrow0.\tag{1}
\]

In particular no such rescaling converges in distribution to a random variable
that is finite and strictly positive almost surely. If a finite distributional
limit exists, it must be zero almost surely. This covers rescaling by the
geometric mean and by any deterministic variance correction. It concerns the
pointwise product at t=0; it does not exclude random measures, spatially
averaged limits, or sign-dependent renormalization.

## 2. Removing sign-dependent terms produces a nonzero analytic limit

Use two independent complex variables first. This provides a common
Euler-product domain in which we can check what arithmetic is retained. Set

\[
 x_p=p^{-u},\quad y_p=p^{-v},\quad
 b_p(u,v)=\frac{x_p+y_p}{1+x_py_p},
\]

and

\[
 M_{\varepsilon,P}(u,v)=
 \prod_{p\le P}\frac{(1+\varepsilon_p x_p)(1+\varepsilon_p y_p)}{1+x_py_p}
 =\prod_{p\le P}(1+\varepsilon_p b_p).
\]

The original direct/dual bridge is the slice `(u,v)=(s,1−s)`. Define

\[
 R_{\varepsilon,P}(u,v)=M_{\varepsilon,P}(u,v)
 \exp\!\left[-\sum_{p\le P}\varepsilon_p b_p
                 +\tfrac12\sum_{p\le P}b_p^2\right].\tag{2}
\]

**Proposition.** For every sign assignment, R converges locally uniformly to a
holomorphic, nowhere-zero function on `Re u>1/3, Re v>1/3`. Convergence is
uniform over all sign assignments on every compact subset. In particular the
original slice has a nonzero holomorphic limit in `1/3<Re s<2/3` and is
strictly positive for every s=1/2+it.

**Proof.** On a compact subset, choose α>1/3 below both real parts. Then
`|b_p|≤C p^(−α)`, uniformly. For sufficiently large primes, |b_p|≤1/2, and

\[
 r_{\varepsilon,p}
 =\log(1+\varepsilon_p b_p)-\varepsilon_p b_p+\tfrac12 b_p^2
 =\sum_{k\ge3}\frac{(-1)^{k+1}\varepsilon_p^k b_p^k}{k},
\]

\[
 |r_{\varepsilon,p}|\le\frac{|b_p|^3}{3(1-|b_p|)}.\tag{3}
\]

This is absolutely summable, uniformly in signs and on the compact subset.
Every individual factor in (2) is holomorphic and nonzero: in the larger
domain Re u,Re v>0, |x_p|,|y_p|<1, so neither numerator factor nor denominator
vanishes. The finite initial product times the exponential of the convergent
tail proves the claim. On the critical slice b_p is real with |b_p|<1, so each
factor is positive and its limiting real logarithm is finite. ∎

For a concrete infinite-product bound at the center, (3) and
`b_p≤2/sqrt(p)` imply, for P>4,

\[
 \sum_{p>P}|r_{\varepsilon,p}|
 \le \frac{16}{3(1-2/\sqrt P)\sqrt P}.\tag{3a}
\]

Here we bound the prime tail by all integers and use
`Σ_{n>P}n^(−3/2)≤2/sqrt(P)` for integer P. At P=10,000 this is less than
0.054422. Also `r_{+,p}−r_{−,p}=2(atanh b_p−b_p)>0` at the center.
The interval calculation therefore certifies the deliberately rounded bound

\[
 0.034<R_\varepsilon(1/2,1/2)<2.237
 \qquad\text{for every sign assignment}.
\]

Its mean is between 0.4078 and 0.4548, so this normalization demonstrably
changes the raw bridge's mean of one. The bounds include all primes through
the analytic tail estimate, rather than extrapolating a finite experiment.

This construction is unconditional and includes the deterministic all-minus
assignment. Its zero-freeness is a consequence of subtracting the first two
terms of each logarithmic local factor; it has not established zeta's
zero-freeness.

There is also a hierarchy: subtract the first m Taylor terms of
`log(1+ε_p b_p)` in the exponent. The remainder is O(|b_p|^(m+1)), so the
result converges for `Re u,Re v>1/(m+1)`. On the direct/dual slice this gives
`1/(m+1)<Re s<1−1/(m+1)`. These are different normalized functions for different
m, not a single function already continued throughout the critical strip.
More subtraction alone does not restore the discarded arithmetic.

## 3. Averaging remains justified, but the average has changed

At finite P, independence gives exactly

\[
 \mathbb E R_{\varepsilon,P}(u,v)
 =\prod_{p\le P} e^{b_p^2/2}
       (\cosh b_p-b_p\sinh b_p).\tag{4}
\]

Uniform convergence over signs on compact subsets from (3) allows expectation
to pass through the limit in the domain of Proposition 2. Unlike the raw
bridge, the normalized product has no loss of expectation there. However its
mean is the product in (4), not 1 and not a demonstrated zeta reconstruction.
The local mean starts as `1−b_p⁴/4+O(b_p⁶)`, so the product on the right even
converges locally uniformly for `Re u,Re v>1/4`. Outside the domain of
Proposition 2 this assertion only concerns the deterministic product; it does
not assert convergence of the individual random products. We make no global
zero-freeness claim for this complex-valued mean.

Pairing opposite sign assignments gives another exact check:

\[
 R_{\varepsilon,P}R_{-\varepsilon,P}
 =\prod_{p\le P}(1-b_p^2)e^{b_p^2}.\tag{5}
\]

The linear fluctuations cancel, but the deterministic factor remains. Thus
cancelling twists does not automatically return the original zeta function.

## 4. Recovering zeta places the missing theorem in the counterterm

Let R_-(u,v) denote the limit for all signs −1. On the genuine common domain
Re u,Re v>1, ordinary absolutely convergent Euler products give

\[
 M_-(u,v)=\frac{\zeta(2u+2v)}{\zeta(u+v)\zeta(u)\zeta(v)}.\tag{6}
\]

The numerator and denominator in this ratio matter: the normalization divides
by `∏(1+p^(−u−v))=ζ(u+v)/ζ(2u+2v)`.
Define, initially in that same domain,

\[
 Q(u,v)=\sum_p\left(b_p(u,v)+\tfrac12 b_p(u,v)^2\right).
\]

Equations (2) and (6) yield the exact reconstruction

\[
 R_-(u,v)=\frac{\zeta(2u+2v)}{\zeta(u+v)\zeta(u)\zeta(v)}e^{Q(u,v)}.\tag{7}
\]

We must not use the prime sum defining Q outside its proved convergence
domain. Fixing v=2 makes the remaining obstruction particularly transparent.
For Re u>1 define the pole-regularized inverse counterterm

\[
 J(u)=\frac{e^{-Q(u,2)}}{u-1}.
\]

Rearranging (7) gives

\[
 J(u)=\frac{A(u)}{(u-1)\zeta(u)},\qquad
 A(u)=\frac{\zeta(2u+4)}{\zeta(u+2)\zeta(2)R_-(u,2)}.\tag{8}
\]

A is holomorphic and nowhere zero on Re u>1/3: all shifted zeta arguments
are in their ordinary zero-free Euler-product region, and R_- is nonzero by
Proposition 2. Thus (8) supplies a meromorphic continuation of J, with a pole
at every zeta zero in that domain of exactly the same multiplicity. The
apparent singularity at u=1 is removed because `(u−1)ζ(u)` has value 1 there.

**Corollary.** J has a holomorphic continuation to Re u>1/2 if and only if RH
holds. Under RH the denominator in (8) never vanishes there. Conversely a
holomorphic J cannot have the poles that any zeta zero there would force;
the functional equation then gives RH.

Equivalently, the regularized forward counterterm `(u−1)e^{Q(u,2)}` has an
unconditional holomorphic continuation, but it carries exactly zeta's zeros
in Re u>1/3. One cannot infer that continuation remains nonzero merely because
the initial expression was an exponential. A holomorphic logarithm across
those potential zeros is precisely what has not been constructed.

This two-variable calculation avoids a false shortcut: at `(u,v)=(s,1−s)`
there is no common region where both ordinary zeta Euler products converge.
We do not identify that slice with the ratio in (6) by multiplying two
unjustified infinite products.

## 5. What has and has not been gained

We now have an explicit, nonzero, positive-on-the-line normalized family,
with a uniform convergence proof that works for every sign assignment.
We also have exact arithmetic reconstruction in a common domain. Tracking
that reconstruction shows that the difficult zeros have moved into the
counterterm. Its required continuation is RH-equivalent, not yet proved.

The concrete remaining target for this construction is to control J directly
from its counterterm definition across Re u>1/2, including regularity at u=1,
without using zero-freeness of ζ or assuming a continued logarithm. Alternatively,
a different correlation would need an exact identity with the completed Weil
form and positivity for all compact pole-free tests. Neither target is met here.
A positive scalar function on the critical line is insufficient for the latter.

## Verification and sources

Run:

```sh
python -m pip install -r scripts/requirements-rh-audit.txt
python scripts/audit-renormalized-twist-bridge.py --output research-inputs/rh-positivity-audit/renormalized-twist-bridge.json
```

The checker uses exact rational arithmetic for finite Euler reconstruction and
192-bit Arb/Acb enclosures for complex factor identities, finite sign averages,
opposite-sign cancellation, and center-point bounds with an explicit infinite
tail. These checks do not certify the analytic proofs, CLT, or RH equivalence;
they need independent mathematical review. No Monte Carlo or assumptions on
zeta zeros are used.

For the classical tools used here, see [DLMF §27.4](https://dlmf.nist.gov/27.4)
(Euler products and their convergence domains) and
[Sourav Chatterjee, *Stats 310A lecture notes*, Theorem 7.10.1](https://souravchatterjee.su.domains/stat310a-lecture-notes.pdf)
(Lindeberg–Feller). The renormalization and counterterm calculations are derived
above; these references are not cited as proving them.

## Direct completion attempt

The [counterterm completion analysis](counterterm-completion-attempt-2026-09-30.md)
reduces the frozen-bridge correction to absolutely convergent prime sums,
constructs entire prime-power approximants, and proves that a specified
cutoff-independent compact upper bound would complete RH. The required bound
is unproved; finite positivity and symmetry are tested against an off-axis
control and do not suffice.
