# Arithmetic theta geometry and the twin ladder — v0.2

**Status:** conditional geometric compression. The frame arguments, arithmetic packing refinement, and exact lattice-cost equivalence are proved in the accompanying notes. The external source now has located generic S76 and selected-family suppliers; their full dependencies and a direct arithmetic realization of the twin-ladder Weil form remain unverified here. This work does not prove RH or claim historical novelty.

Read the [manuscript](https://exploreriemann.com/research/rh/arithmetic-theta-geometry/RH_Geometric_Compression.pdf) or its [editable source](https://exploreriemann.com/research/rh/arithmetic-theta-geometry/RH_Geometric_Compression.tex). This revision adds a shorter arithmetic counting argument, an exact diagnosis of the completion target, and a more precise source map.

## 1. Geometry accounts for the complete form

For actual maps \(T_u:E_u\to H\), positivity is available before any estimate. The identity

\[
S=\sum_uT_uT_u^*,\qquad
\operatorname{tr}(S^2)=\sum_{u,v}\|T_u^*T_v\|_{\mathrm{HS}}^2
\]

retains every ordered Gram block. Cauchy–Schwarz bounds the source and ambient projection losses by \((\kappa+\sqrt{\kappa e})R\) and \(\sqrt{\delta\alpha}R\), giving the displayed frame theorem without a uniform spectral gap.

The singular Schur residual is a squared distance when all its blocks come from maps into one positive Hilbert space. Applying that identity to the twin ladder requires an arithmetic identification of the even, odd, and mixed entries. Positive diagonal blocks, favourable trace ratios, or a family average do not supply that identification.

## 2. Integral labels need no zero-support split

Let \(E\) be a CM number field of degree \(2f\), and let \(\Phi\) contain one embedding from each conjugate pair. For distinct \(a,b\in\mathcal O_E\),

\[
\prod_{\sigma\in\Phi}|\sigma(a-b)|^2
=|N_{E/\mathbb Q}(a-b)|\ge1.
\]

A common integral Hermitian lattice makes mixed frame minors integral: each pairing lies in \(\mathcal O_E\), and its determinant remains integral. Positivity of the Hermitian form is unnecessary for this particular step.

Half-unit square addresses and summable coordinate weights then give, for finite \(B\subset\mathcal O_E\) and \(U\ge1\),

\[
\sum_{b\in B}\prod_{\sigma\in\Phi}
\max(1,|\sigma(b)|/U)^{-3}\le(18U)^{2f}.
\]

Now take integers \(0\le j\le r\), positive scales \(s_\ell\) for \(1\le\ell\le j\), and a finite set \(A\) of distinct integral sequences satisfying \(a_0=1\) and \(a_\ell=0\) for \(\ell>j\). Define

\[
\begin{aligned}
\Sigma_\sigma(a)&=\max\!\left(\{1\}\cup
\{|\sigma(a_\ell)|/s_\ell:1\le\ell\le j\}\right),\\
K(a)&=\prod_{\sigma\in\Phi}\Sigma_\sigma(a),
\qquad R_\ell=\max(1,s_\ell).
\end{aligned}
\]

Then

\[
\boxed{\sum_{a\in A}K(a)^{-3r}
\le\prod_{\ell=1}^{j}(18R_\ell)^{2f}.}
\]

Each coordinate factor is bounded by its corresponding maximum, and \(j\le r\). The first \(j\) coordinates determine the entire sequence, so summing the product weights is bounded by the product of the coordinate sums. Zero coordinates have weight exactly one. The proof therefore removes the source's extra \(2^j\) factor from counting nonzero-coordinate subsets.

All assumptions matter: repeated labels or free initial/tail coordinates can invalidate the injection. When \(j=0\), at most one sequence is allowed. The constant 18 already appears inside the source's packing proof; this refinement makes no priority claim for it. The full proof and concrete minor-label dictionary are in [ARITHMETIC_FAMILY.md](https://github.com/judegomila/zeta-explorer/blob/main/research-checkpoints/rh-arithmetic-theta-2026-11-20/geometric-compression/ARITHMETIC_FAMILY.md).

## 3. The minimum complete lattice cost is exact

For an injective integral map \(T:L\to M\) of real Euclidean lattices, put \(r=\operatorname{rank}L>0\), \(N=M\cap\operatorname{span}_{\mathbb R}T(L)\), and \(I=[N:T(L)]\). Let \(s_1,\ldots,s_r>0\) be its singular values. Covolumes use the respective metrics and spans. Then

\[
\begin{aligned}
\mathcal C(T)
&=\log\frac{\operatorname{covol}L}{\operatorname{covol}N}
+\frac r2\log\frac{\|T\|_{\mathrm{HS}}^2}{r}\\
&=\log I+
\frac r2\log
\frac{r^{-1}\sum_{\ell=1}^rs_\ell^2}
{(\prod_{\ell=1}^rs_\ell^2)^{1/r}}.
\end{aligned}
\]

The last term is nonnegative, vanishing exactly for equal singular values. Consequently,

\[
\min_{\substack{T\text{ injective integral}\\I(T)\ge Q}}
\mathcal C(T)=\log Q\qquad(Q\ge1\text{ an integer}).
\]

Multiplication by \(Q\) on \(\mathbb Z\) attains the minimum. With free metrics, a pullback metric also attains it at any prescribed positive rank.

Uniform source or target rescaling preserves \(\mathcal C\). Anisotropic changes may reduce the excess above \(\log I\), but cannot remove that index cost. The determinant cost, including covolumes, is exactly \(\log I\) under arbitrary positive metrics.

## 4. The prime encoding identifies an equivalent completion target

Retain every prime power:

\[
R(X)=\sum_{p^k\le X}\log p\,(X/p^k-1),\qquad
a_p(X)=\sum_{k:p^k\le X}(X/p^k-1).
\]

For \(X\ge2\), \(m=\lceil\sqrt X\rceil\), and
\(Q_{X,m}=\prod_{p\le X}p^{\lfloor ma_p(X)\rfloor}\),

\[
0\le mR(X)-\log Q_{X,m}
<\vartheta(X)\le4(\log2)X.
\]

Put \(M(X)=X\log X-(1+\gamma_E)X\) and \(G=R-M\). The unrestricted existence of lattice maps with

\[
I\ge Q_{X,m},\qquad
\mathcal C(T)\le mM(X)+mC_\varepsilon X^{1/2+\varepsilon}
\]

for every fixed \(\varepsilon>0\) and all sufficiently large real \(X\) is **equivalent** to the full-ray upper bound \(G(X)\le C'_\varepsilon X^{1/2+\varepsilon}\) with the same quantifier order. One direction uses the index inequality and rounding; the converse uses rank-one multiplication by \(Q_{X,m}\).

The prior Mellin–Landau theorem makes this equivalent to RH. The reverse analytic direction is explicit: the classical RH estimate for \(\psi(t)-t\), Abel summation, and the Laurent constant at one yield

\[
G(X)=-X\int_X^\infty\frac{\psi(t)-t}{t^2}\,dt
=O(\sqrt X\log^2X).
\]

Thus arbitrary lattice existence restates the problem. Progress requires an independent bound for a specified arithmetic construction. [LADDER_COMPLETION.md](https://github.com/judegomila/zeta-explorer/blob/main/research-checkpoints/rh-arithmetic-theta-2026-11-20/geometric-compression/LADDER_COMPLETION.md) gives every implication and its classical dependencies.

## 5. The source supplies a window route with fixed analytic level

A generic supplier for `PeriodFamilyStatement` has been located. The visible applications from `Main` instead reach a selected off-diagonal supplier, actual family constructors, and a character-window endpoint with exponent \(3/2\). These are substantive source-body findings; the complete proof terms and deep arithmetic inputs have not been independently verified.

The analytic level \(\Lambda\) and its averaged function stay fixed when applying the window theorem. Auxiliary arithmetic families may depend on \(\varepsilon\), provided their comparison controls that same fixed function and their windows extend arbitrarily far. This is different from substituting unrelated analytic functions on successive intervals.

Arbitrarily large windows do not mean every sufficiently large point is controlled. A full-ray bridge follows from sufficiently small gaps between good points; bounded derivative alone is insufficient. The companion note constructs a \(C^2\), globally Lipschitz counterexample with convex uncentred ramp and large peaks between its good windows. The source's special meromorphic-transform window argument therefore remains a genuine analytic input.

Consecutive integer \(k\)th powers near \(x\) have gaps of order \(x^{1-1/k}\) for fixed \(k\ge2\). Squares satisfy the spacing condition in Lemma 5 for every \(\theta>1/2\). For \(k>2\), the gaps are too wide when \(1/2<\theta<1-1/k\). Crossley obtains an RH criterion on every fixed power grid for a tent sum over ordinary primes by bounding the rounding error in terms of the supremum of the real parts of the nontrivial zeta zeros. [Proof on perfect powers](https://doi.org/10.5281/zenodo.24411621)

The [source report](https://github.com/judegomila/zeta-explorer/blob/main/research-checkpoints/rh-arithmetic-theta-2026-11-20/geometric-compression/S76_CLOSURE.md) and [application map](https://github.com/judegomila/zeta-explorer/blob/main/research-checkpoints/rh-arithmetic-theta-2026-11-20/geometric-compression/S76_CLOSURE_MAP.json) preserve this distinction.

## 6. What was checked, and what still completes the argument

The pinned [static inventory](https://github.com/judegomila/zeta-explorer/blob/main/research-checkpoints/rh-arithmetic-theta-2026-11-20/geometric-compression/SOURCE_SNAPSHOT.json) reaches **175,187 project Lean files** through Main's textual imports. This counts import-reachable files, not necessary theorem dependencies or verified proofs. The generic and full-ray modules are in that import graph even though their use in the final proof term has not been established.

Four Python checkers cover frame identities, lattice rounding, arithmetic labels and dimension examples, and the new cost/window arguments. Finite examples check algebra; the universal results rest on the written proofs. No Lean compilation, axiom-closure audit, or independent kernel replay was performed.

The remaining [proof obligations](https://github.com/judegomila/zeta-explorer/blob/main/research-checkpoints/rh-arithmetic-theta-2026-11-20/geometric-compression/PROOF_OBLIGATIONS.md) are to validate the selected arithmetic inputs and their uniform estimates, retain the correct window endpoint, and construct the exact whole-form transport into the twin-ladder test space. The revised geometry states these requirements more precisely and shortens one arithmetic counting step.
