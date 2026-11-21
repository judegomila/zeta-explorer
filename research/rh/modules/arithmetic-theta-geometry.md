# Arithmetic theta geometry and the twin ladder

**Status:** partial geometric compression and a conditional research note, not a complete compression of an RH proof. The finite geometry is proved; the decisive arithmetic family, kernel and dimension estimates, and combined chain cost remain unproved in this synthesis. RH remains unproved by this work. The underlying geometric facts are standard; no historical novelty is claimed.

Read the complete [geometric manuscript](https://exploreriemann.com/research/rh/arithmetic-theta-geometry/RH_Geometric_Compression.pdf) or its [LaTeX source](https://exploreriemann.com/research/rh/arithmetic-theta-geometry/RH_Geometric_Compression.tex). The public checkpoint contains the proofs and exact checkers; access to the historical private research repository is unnecessary.

## 1. Why the frame bound is geometric

The displayed theorem above measures energy remaining after directions are removed from the source spaces and then from the ambient space. Hilbert–Schmidt Cauchy–Schwarz bounds the respective trace losses by

\[
(\kappa+\sqrt{\kappa e})R,
\qquad \sqrt{\delta\alpha}\,R.
\]

These produce the exact constants in the source's `Conclusion2Family`. Positivity comes from the actual maps, before the trace estimate. A nearly optimal trace ratio alone cannot establish positivity: a diagonal matrix with one entry \(-1\) and all remaining entries \(1\) is a counterexample in growing dimension. A correlation average for one family also need not control each pair or every subfamily.

For the twin ladder, the singular Schur identity gives a squared distance only after arithmetic maps reproduce every even, odd, and mixed entry. Choosing a factorization after assuming positivity would be circular. The [frame proof and source dictionary](https://github.com/judegomila/zeta-explorer/blob/main/research-checkpoints/rh-arithmetic-theta-2026-11-20/geometric-compression/FRAME_GEOMETRY.md) retain this distinction.

## 2. Integral separation gives weighted packing

Let \(\mathcal P\subset\mathbb C^d\) be finite and \(U\ge1\). If distinct points satisfy \(\prod_i|p_i-q_i|\ge1\), then

\[
\sum_{p\in\mathcal P}\prod_{i=1}^d
\max(1,|p_i|/U)^{-3}
\le(18U)^{2d}\le(64U)^{2d}.
\]

Half-unit square addresses are injective under this separation condition; summable coordinate weights then bound the total. Nonzero algebraic-integer norms can supply separation, once the required integrality and embedding conventions are established. Both constants occur in the pinned [weighted lattice proof](https://github.com/Deicyde/riemann-hypothesis/blob/712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9/src/Formalism/SharpRestriction/CuspSpanNormBounds/WeightedLatticeSum.lean). Its exponential dependence on dimension remains part of the cost.

## 3. Divisibility has a metric cost

For an injective integral map \(T:L\to M\) of real Euclidean lattices, let \(r=\operatorname{rank}L>0\), \(N=M\cap\operatorname{span}_{\mathbb R}T(L)\), and \(q=[N:T(L)]\). Covolumes are measured in each lattice's span. Determinant accounting and arithmetic–geometric mean give

\[
\log q\le
\underbrace{\log\frac{\operatorname{covol}L}{\operatorname{covol}N}
+\frac r2\log\!\left(\frac{\|T\|_{\mathrm{HS}}^2}{r}\right)}_{\mathcal C(T)}.
\]

Uniformly rescaling the target metric changes the two terms by opposite amounts. Making a map isometric therefore cannot erase its arithmetic cost. The [lattice proof](https://github.com/judegomila/zeta-explorer/blob/main/research-checkpoints/rh-arithmetic-theta-2026-11-20/geometric-compression/LATTICE_AND_TWIN_LADDER.md) also treats trace-dual norms and product-formula normalization.

## 4. The prime ladder gives a literal integer

Retain every prime power in the ramp

\[
S(X)=\sum_{p^k\le X}\log p\,(X/p^k-1),
\qquad a_p(X)=\sum_{k:p^k\le X}(X/p^k-1).
\]

For integers \(m\ge1\), define \(Q_{X,m}=\prod_{p\le X}p^{\lfloor ma_p(X)\rfloor}\). Fractional parts give, for \(X\ge2\),

\[
0\le mS(X)-\log Q_{X,m}<\vartheta(X)\le4(\log2)X.
\]

Thus \(m=\lceil\sqrt X\rceil\) gives square-root rounding loss after division by \(m\). Encoding is not a saving: multiplication by \(Q_{X,m}\) on \(\mathbb Z\) has index and operator norm both equal to \(Q_{X,m}\).

## 5. The explicit open arithmetic condition

Set \(M(X)=X\log X-(1+\gamma_E)X\). For every fixed \(\varepsilon>0\), independently construct the lattice maps above for all sufficiently large \(X\), with \(m=\lceil\sqrt X\rceil\), such that

\[
q\ge Q_{X,m},\qquad
\mathcal C(T)\le mM(X)+mC_\varepsilon X^{1/2+\varepsilon}.
\]

The proved implication then yields \(S(X)-M(X)\le(C_\varepsilon+4\log2)X^{1/2+\varepsilon}\); the earlier manuscript's full-ray Mellin/Landau argument implies RH. The independent construction and favorable combined cost bound remain unproved here. The ultimate `S76` supplier and complete Lean import closure were not independently checked. The [source dependency audit](https://github.com/judegomila/zeta-explorer/blob/main/research-checkpoints/rh-arithmetic-theta-2026-11-20/geometric-compression/SOURCE_DEPENDENCY_AUDIT.md) records that inspection boundary without treating it as a defect in the external proof.
