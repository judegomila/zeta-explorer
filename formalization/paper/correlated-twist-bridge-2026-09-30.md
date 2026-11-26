# Following the correlated sign-twist idea

This follows the [infinite-twist construction](infinite-sign-twisted-ladders-2026-09-30.md)
with three explicit tests: a weighted projection onto reciprocal zeta, a
continuously biased family, and a shared-sign direct/dual coupling. The outcome
is exact identities and scoped obstructions to simple continuation arguments.
There is no new RH proof or assertion of novelty.

## 1. An exact weighted reconstruction of reciprocal zeta

For independent fair prime signs ε_p define, over finitely many primes p≤P,

\[
 G_{\varepsilon,P}(s)=\prod_{p\le P}(1+\varepsilon_p p^{-s}),\qquad
 D_{\delta,P}(\varepsilon)=\prod_{p\le P}(1-p^{-\delta}\varepsilon_p).
\]

For δ>0 the density D is positive, with expectation one. Sharing the same
signs between D and G gives the exact correlation

\[
 \mathbb E[D_{\delta,P}G_{\varepsilon,P}(s)]
 =\prod_{p\le P}(1-p^{-(s+\delta)})
 =\frac1{\zeta_P(s+\delta)}.
 \tag{1}
\]

For δ>1/2 and σ=Re s>1/2 both factors converge in L². Indeed

\[
 \mathbb E D_{\delta,P}^2=\prod_{p\le P}(1+p^{-2\delta}),\qquad
 \mathbb E|G_{\varepsilon,P}(s)|^2=\prod_{p\le P}(1+p^{-2\sigma}).
\]

The limit in (1) is then justified, but σ+δ>1: it is still inside the ordinary
Euler-product region. The algebra reconstructs exactly the desired function;
the elementary norm bound does not extend its known domain.

### Changing diagonal weights cannot repair this bound

In the orthogonal squarefree-character basis the two coefficient sequences
have magnitudes `n^(-σ)` and `n^(-δ)`. For any positive diagonal weights w_n,
if both weighted norms used in Cauchy–Schwarz are finite, then

\[
 \sum_{n\text{ squarefree}}n^{-(\sigma+\delta)}
 \le
 \left(\sum_n w_n n^{-2\sigma}\right)^{1/2}
 \left(\sum_n w_n^{-1}n^{-2\delta}\right)^{1/2}<\infty.
\]

The sum on the left diverges when σ+δ≤1. Thus no positive diagonal weighting
of this particular absolute Cauchy–Schwarz argument reaches the critical strip.
This does not exclude estimates retaining the Möbius signs, non-diagonal
correlations, or other representations.

## 2. Small bias already contains the full continuation problem

Instead of p^(-δ), use a constant bias 0<r≤1:

\[
 D_{r,P}=\prod_{p\le P}(1-r\varepsilon_p),\qquad
 F_{r,P}(s)=\mathbb E[D_{r,P}G_{\varepsilon,P}(s)]
           =\prod_{p\le P}(1-rp^{-s}).
\]

The densities have mean one but `E D_{r,P}²=(1+r²)^{π(P)}`. Their L² norms are
not bounded as P grows. More revealingly, in Re s>1 their limiting Euler
product satisfies

\[
 F_r(s)=\zeta(s)^{-r}H_r(s),\qquad
 H_r(s)=\exp\!\left[
 \sum_p\sum_{k\ge2}\frac{r-r^k}{k}p^{-ks}\right].
 \tag{2}
\]

This follows by subtracting the logarithmic Euler expansions. The exponent
defining H_r converges absolutely and locally uniformly in Re s>1/2: on a
compact subset with σ≥σ₀>1/2 its absolute value is bounded by a constant times
`Σ_p p^(-2σ₀)`. Consequently H_r is holomorphic and nowhere zero there.

The zeta pole must be removed before asking for a holomorphic continuation.
Define, initially in Re s>1 with branches fixed by positive real s,

\[
 B_r(s)=(s-1)^{-r}F_r(s)
       =H_r(s)\bigl((s-1)\zeta(s)\bigr)^{-r}.
 \tag{3}
\]

**Proposition.** For any fixed r in (0,1], the function B_r has a single-valued
holomorphic continuation to Re s>1/2 if and only if RH holds.

**Proof.** Under RH, `Z₀(s)=(s−1)ζ(s)` is holomorphic and nonzero in that simply
connected half-plane. It has a holomorphic logarithm agreeing with the initial
branch, so (3) constructs the continuation. Conversely, suppose B_r continues
holomorphically. It is not identically zero, and meromorphic identity gives

\[
 \frac{B_r'}{B_r}=\frac{H_r'}{H_r}-r\frac{Z_0'}{Z_0}.
\]

If ζ had a zero of multiplicity m in this half-plane, the right side would
have residue `−rm<0`. The logarithmic derivative of a holomorphic, nonzero-as-a-
function B_r can have only nonnegative integer residues, its zero orders.
This is a contradiction. The functional equation then gives RH. No simplicity
assumption on zeta zeros is used. At s=1, `Z₀(1)=1`, so the removed pole causes
no exception. ∎

At r=0 the regularized family is just 1. Every positive r already requires the
full RH-strength continuation statement. An argument based on turning on a
small bias cannot assume that continuation persists automatically. This
equivalence does not prove that a bias-based strategy is useless; it identifies
the substantive theorem such a strategy has to supply.

The all-minus completely multiplicative ladder from the preceding note equals
`ζ(2s)F₁(s)`. The extra factor ζ(2s) is holomorphic and nonzero in Re s>1/2,
so the Möbius formulation here and the Liouville formulation there expose the
same zero obstruction.

## 3. Couple the direct and dual ladders with the same signs

Test the simplest explicit direct/dual product:

\[
 M_{\varepsilon,P}(s)=
 \prod_{p\le P}
 \frac{(1+\varepsilon_p p^{-s})(1+\varepsilon_p p^{-(1-s)})}{1+p^{-1}}
 =\prod_{p\le P}(1+\varepsilon_p b_p(s)),
\]

where

\[
 b_p(s)=\frac{p^{-s}+p^{s-1}}{1+p^{-1}}.
\]

This is a specific coupling, not an assertion that an unspecified physical
bridge realizes the completed zeta function. It respects `s↔1−s`. On the
critical line,

\[
 b_p(1/2+it)=\frac{2\sqrt p\cos(t\log p)}{p+1}\in(-1,1).
\]

Hence **every finite product is strictly positive**, for every sign assignment
and every real t. Moreover its expectation is exactly 1. This is a real
positivity property of the proposed coupled family.

### The raw infinite limit nevertheless collapses at t=0

At t=0 put `b_p=2sqrt(p)/(p+1)`. Then

\[
 V_P=\sum_{p\le P}b_p^2\longrightarrow\infty,
 \qquad \sum_p |b_p|^3<\infty.
\]

The first assertion follows from divergence of `Σ_p 1/p`; the second follows
by comparison with `Σ_{n≥2}n^(-3/2)`. Taylor expansion, discarding finitely many
initial primes from the error estimate if necessary, gives

\[
 \log M_{\varepsilon,P}(1/2)
 =\sum_{p\le P}\varepsilon_p b_p-\tfrac12 V_P+O(1).
\]

The random sum divided by V_P tends to zero almost surely. One direct proof
is to observe that the martingale series with increments
`ε_p b_p/(1+V_p)` has summable variances; it converges almost surely, and
Kronecker's lemma gives the claimed normalized limit. Thus

\[
 \frac{\log M_{\varepsilon,P}(1/2)}{V_P}\longrightarrow-\tfrac12,
 \qquad M_{\varepsilon,P}(1/2)\longrightarrow0
 \quad\text{almost surely}.
 \tag{4}
\]

Finite expectation stays equal to 1, so these positive random variables are
not uniformly integrable. Passing the expectation through the limit is invalid.
This is a degeneration of this raw construction at one boundary point, not
a theorem excluding renormalized limits or holomorphy in an open half-plane.

Its finite moments are particularly explicit:

\[
 \mathbb E M_P^2=\prod_{p\le P}\left(1+\frac{4p}{(p+1)^2}\right),\qquad
 \exp(\mathbb E\log M_P)=\prod_{p\le P}\frac{p-1}{p+1}.
\]

The second expression is a geometric mean, not a median or a pointwise bound.
An interval computation gives these rounded summaries:

| Prime cutoff | Prime count | Mean (exact) | Second moment | Geometric mean |
|---:|---:|---:|---:|---:|
| 10 | 4 | 1 | 7.3916 | 0.083333 |
| 100 | 25 | 1 | 62.4360 | 0.023769 |
| 1,000 | 168 | 1 | 295.5286 | 0.010782 |
| 10,000 | 1,229 | 1 | 922.2483 | 0.006098 |
| 100,000 | 9,592 | 1 | 2242.8872 | 0.003910 |

These finite numbers illustrate the proved degeneration; they are not the
proof of (4), and no random sampling is used to compute them.

## 4. What this attempt changes

The weighted twist reconstruction is exact. Small constant bias, however,
does not make the continuation target logically weaker than RH. The simplest
shared-sign direct/dual bridge has finite positivity but loses its mass in the
raw infinite limit. The next construction would need both a justified limit
and a connection to the **completed Weil form**, not merely positivity of a
scalar product on the critical line. Such scalar positivity alone does not
exclude off-line zeros.

No estimate retaining the required deterministic arithmetic cancellation is
proved here. These results narrow the useful search to correlations or
renormalizations whose exact reconstruction and analytic control can both be
established. They do not establish that such a construction exists.

## Reproduce

```sh
python -m pip install -r scripts/requirements-rh-audit.txt
python scripts/audit-sign-twisted-ladders.py
python scripts/audit-correlated-twist-bridge.py
```

The follow-up checker performs 21 grouped exact/interval checks: weighted
reconstruction, density moments, bias factorization with an explicit series
tail, finite bridge positivity and moments. Its receipt is
`research-inputs/rh-positivity-audit/correlated-twist-bridge.json`, with source
hash and interval enclosures. These checks are not a formal verification of
the analytic proofs above, which need independent review.

Classical Euler-product normalizations are in
[DLMF §27.4](https://dlmf.nist.gov/27.4). For background on conditioning and
moment estimates for random multiplicative functions, see
[Harper, *Moments of random multiplicative functions, II*](https://arxiv.org/abs/1804.04114).
No random-function estimate from that paper is asserted to apply to the
deterministic all-minus assignment.

## Renormalization follow-up

The [renormalized bridge analysis](renormalized-twist-bridge-2026-09-30.md)
constructs a nonzero analytic limit after sign-dependent subtraction, rules
out deterministic pointwise rescaling at the center, and tracks the removed
counterterm through an exact two-variable zeta reconstruction. The required
inverse-counterterm continuation remains RH-equivalent.
