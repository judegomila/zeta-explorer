# Arithmetic lattices and the twin-ladder observable

**Version 0.2 continuation:** [LADDER_COMPLETION.md](LADDER_COMPLETION.md) proves the exact singular-value slack, the attained minimum complete cost, and equivalence of the unrestricted lattice target with the full-ray ramp criterion and RH. The determinant cost is invariant under arbitrary metric changes; the Hilbert–Schmidt upper cost is invariant only under uniform rescaling. This earlier detailed note remains the source for the trace-dual proof and encoding identities. The current source map is [S76_CLOSURE.md](S76_CLOSURE.md).

20 November 2026. Geometric-compression continuation.

## Status

This note independently proves elementary lattice, determinant, and number-field norm statements that clarify part of the announced arithmetic route. It also gives an explicit integer encoding of the user's prime-ladder ramp, including its rounding cost and an exact example. None of these results establishes the missing arithmetic saving or RH. No historical novelty is claimed for the general lattice or product-formula facts.

The external source is inspected at commit `712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9` of `Deicyde/riemann-hypothesis`. Selected proof bodies were read; the full import closure was not replayed. This note does not identify the source's finite frame with the user's Weil/Pick matrix without an additional theorem.

## 1. A complete volume and slope comparison

Let \(L\) and \(M\) be discrete lattices in finite-dimensional real inner-product spaces. Assume \(L\ne0\), set \(r=\operatorname{rank}L\), and let \(T:L\to M\) be an injective homomorphism. Its unique real-linear extension on \(\operatorname{span}_{\mathbb R}L\) is also denoted by \(T\).

Let
\[
N=M\cap\operatorname{span}_{\mathbb R}T(L),\qquad
q=[N:T(L)].
\]
The space in this definition is rational with respect to \(M\), so \(N\) is a rank-\(r\) lattice and \(q\) is a positive finite integer. Volumes below are covolumes in each lattice's own real span. Write \(s_1,\ldots,s_r>0\) for the singular values of \(T\).

### Proposition 1: exact determinant accounting

\[
\boxed{
q\,\operatorname{vol}(N)
=\operatorname{vol}(T(L))
=\operatorname{vol}(L)\prod_{i=1}^r s_i.
}
\tag{1}
\]

Consequently,
\[
\log q
\le \log\frac{\operatorname{vol}(L)}{\operatorname{vol}(N)}
+r\log\|T\|_{\rm op},
\tag{2}
\]
and the Hilbert–Schmidt variant is
\[
\log q
\le \log\frac{\operatorname{vol}(L)}{\operatorname{vol}(N)}
+\frac r2\log\!\left(\frac{\|T\|_{\rm HS}^2}{r}\right).
\tag{3}
\]

**Proof.** A basis of \(T(L)\) has determinant of absolute value \(q\) relative to a basis of \(N\), giving the first equality. The second is the volume expansion of a linear map, which is the product of its singular values. Each \(s_i\le\|T\|_{\rm op}\), proving (2). Applying the arithmetic–geometric mean inequality to \(s_i^2\) gives
\(\prod s_i\le(\sum s_i^2/r)^{r/2}\), proving (3). Every logarithm has a positive argument because \(T\) is injective and \(r>0\). ∎

Define the slope by
\[
\mu(L)=-\frac1r\log\operatorname{vol}(L),
\]
and define \(\mu_{\max}(M)\) as the supremum of the slopes of nonzero primitive sublattices of \(M\). The supremum is finite: for each possible rank, nonzero lattice exterior products form a discrete set in the corresponding exterior power, so their lengths are bounded away from zero.

Since \(N\) is primitive, (3) gives
\[
\boxed{
\mu(L)+\frac{\log q}{r}
\le \mu_{\max}(M)
+\frac12\log\!\left(\frac{\|T\|_{\rm HS}^2}{r}\right).
}
\tag{4}
\]
The operator-norm version replaces the final term by \(\log\|T\|_{\rm op}\). The term \(\log q=\sum_p v_p(q)\log p\) is the exact arithmetic index contribution; it cannot be removed when normalizing the metric.

**Direct source comparison.** The actual theorem `slopeInequality_of` in [SlopeInequality.lean](https://github.com/Deicyde/riemann-hypothesis/blob/712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9/src/Formalism/LatticeSlopes/LatticeSlopesProofs/SlopeInequality.lean) proves the corresponding inequality without the retained index term, given its named maximal-slope input. Its proof passes from lattice norm bounds to real norm bounds, compares Gram determinants and covolumes, and invokes the slope bound for the image lattice. Equations (1)–(4) above independently supply the finite-dimensional argument and retain the saturation index explicitly. They do not verify the source's construction of its particular lattices or maps.

## 2. An arithmetic norm lower bound actually present in the source

Here is a compact reconstruction of a genuine number-field step, rather than an unspecified appeal to geometric positivity.

Let \(K\) be a CM number field of degree \(d\), with conjugation, ring of integers \(\mathcal O_K\), different \(\mathfrak D\), and absolute discriminant \(\Delta=|\operatorname{disc}K|\). Let \(h\) be a Hermitian form, conjugate-linear in the first variable and linear in the second, such that every embedded form is positive definite. Let \(\Lambda\) be a full \(\mathcal O_K\)-lattice satisfying
\[
\Lambda\subseteq\Lambda^{\#},\qquad
q=[\Lambda^{\#}:\Lambda]<\infty,
\quad
\Lambda^{\#}=\{x:h(x,\Lambda)\subseteq\mathcal O_K\}.
\]
Let its trace-dual be
\[
\Lambda^{\rm tr}
=\{x:\operatorname{Tr}_{K/\mathbb Q}h(x,y)\in\mathbb Z
\text{ for all }y\in\Lambda\}.
\]

### Proposition 2: trace-dual vector lower bound

For \(0\ne x\in\Lambda^{\rm tr}\),
\[
\boxed{
\operatorname{Tr}_{K/\mathbb Q}h(x,x)
\ge \frac{d}{(q\Delta^2)^{1/d}}.
}
\tag{5}
\]

**Proof.** Put \(\beta=h(x,x)\). The trace-dual condition, applied also to \(a y\) for every \(a\in\mathcal O_K\), implies
\(h(x,\Lambda)\subseteq\mathfrak D^{-1}\). Since the different is invariant under the CM involution, \(\mathfrak D x\subseteq\Lambda^{\#}\).

Map \(\mathfrak D\) into the finite quotient \(\Lambda^{\#}/\Lambda\) by \(a\mapsto ax\). Its kernel
\[
J=\{a\in\mathfrak D:ax\in\Lambda\}
\]
is a nonzero integral ideal and satisfies
\[
\mathrm N J
=\mathrm N\mathfrak D\,[\mathfrak D:J]
\le \Delta q.
\]
For \(a\in J\), the vector \(ax\) belongs to \(\Lambda\), so
\(a\beta=h(x,ax)\in\mathfrak D^{-1}\). Hence
\(\beta J\mathfrak D\) is a nonzero integral ideal. Its norm is a positive integer, giving
\[
1\le |\mathrm N_{K/\mathbb Q}\beta|\,\mathrm N J\,\Delta
\le |\mathrm N_{K/\mathbb Q}\beta|\,q\Delta^2.
\]
Every conjugate of \(\beta\) is a positive real number. Arithmetic–geometric mean over all \(d\) embeddings now gives
\[
\operatorname{Tr}\beta
\ge d\,|\mathrm N\beta|^{1/d}
\ge d/(q\Delta^2)^{1/d}.
\]
This proves (5). ∎

This reconstructs the mathematical mechanism of `dual_lattice_vector_trace_lower_bound`, via `one_le_norm_mul_absNorm_discr` and `totally_positive_trace_ge_of_norm_bound`, in [TotallyPositiveTraceGeOfNormDiscr.lean](https://github.com/Deicyde/riemann-hypothesis/blob/712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9/src/Formalism/SharpRestriction/GlobalSchurBounds/TotallyPositiveTraceGeOfNormDiscr.lean). The assumptions above are explicit conventional lattice assumptions; no uninspected equivalence with every field of the source's `LatT` structure is asserted.

**Sharp control.** For \(K=\mathbb Q(i)\), \(h(x,y)=\bar x y\), and \(\Lambda=a\mathbb Z[i]\) with integer \(a\ge1\), one has \(d=2\), \(\Delta=4\), \(q=a^4\), and \(x=1/(2a)\in\Lambda^{\rm tr}\). Both sides of (5) equal \(1/(2a^2)\). Thus the discriminant and index factors in this elementary bound cannot simply be discarded.

## 3. Product-formula normalization and mixed inner products

Suppose \(K\hookrightarrow L\) is an embedding of number fields, \(L\) is totally complex, and \(0\ne\beta\in K\). Write \(r_2(L)=[L:\mathbb Q]/2\), and let \(v\) range over one representative of each conjugate pair of complex embeddings of \(L\). Then
\[
\boxed{
\frac1{r_2(L)}\sum_v\log|v(\beta)|
=\frac1{[K:\mathbb Q]}\log|\mathrm N_{K/\mathbb Q}\beta|.
}
\tag{6}
\]
Indeed,
\(\prod_v|v(\beta)|^2=|\mathrm N_{L/\mathbb Q}\beta|
=|\mathrm N_{K/\mathbb Q}\beta|^{[L:K]}\).
Taking logarithms and dividing by \([L:\mathbb Q]\) proves (6).

The source's actual theorem `mean_log_places_eq_log_norm` is this identity. Its `ColValG.lcvInf_eq` applies it to a Gram determinant. If \(G\) is a positive Hermitian Gram matrix over \(K\), with \(\beta=\det G\ne0\), then the normalized mean of \(\log\det G_v\) is the right side of (6). The corresponding mean of log Euclidean volumes is **one half** of that quantity, because volume is the square root of the Gram determinant. Our volume conventions in Section 1 retain this factor explicitly.

There is also a useful distinction concerning mixed terms. The source's theorem `ColValG.gram_eq` obtains full sesquilinear pairing equality by polarization from its hypothesis `bc_norm`, which holds **for every vector**. Equality of the norms of the vectors in a chosen basis would not suffice. Equality for every linear combination does suffice, but already contains all mixed information.

These source theorems identify the arithmetic column space with its own positive Hermitian form. They do not identify that form with the user's completed Weil form. In particular, the positive arithmetic norm in their hypotheses cannot be substituted for the target signed form solely because both constructions use theta functions.

## 4. Literal divisibility data from the prime ladder

Retain the user's actual prime-power operators
\[
\mathsf A e_{p,k}=k\log p\,e_{p,k},\qquad
\mathsf D e_{p,k}=\log p\,e_{p,k}.
\]
For real \(X\ge2\), define
\[
S(X)=\operatorname{Tr}[\mathsf D(Xe^{-\mathsf A}-I)_+]
=\sum_{p^k\le X}\log p\,(X/p^k-1),
\]
\[
a_p(X)=\sum_{k\ge1:p^k\le X}(X/p^k-1).
\]
All \(a_p(X)\) are nonnegative. For an integer \(m\ge1\), form the explicit positive integer
\[
\boxed{Q_{X,m}=\prod_{p\le X}p^{\lfloor m a_p(X)\rfloor}.}
\tag{7}
\]

### Proposition 3: exact rounding loss

Writing \(\theta(X)=\sum_{p\le X}\log p\), one has
\[
mS(X)=\log Q_{X,m}+R_{X,m},
\qquad 0\le R_{X,m}<\theta(X).
\tag{8}
\]
The proof is the identity
\(R_{X,m}=\sum_{p\le X}\{m a_p(X)\}\log p\), where every fractional part is in \([0,1)\).

A self-contained elementary estimate is
\[
\theta(X)\le 4(\log2)X\quad(X\ge2).
\tag{9}
\]
For integer \(n\ge1\), every prime \(n<p\le2n\) divides \(\binom{2n}{n}\), hence
\(\theta(2n)-\theta(n)\le2n\log2\).
Sum this over powers of two up to \(2^j\ge X\), choosing \(2^j<2X\), to obtain (9).

In particular, for \(m=\lceil\sqrt X\rceil\),
\[
0\le S(X)-\frac1m\log Q_{X,m}
\le 4(\log2)\sqrt X.
\tag{10}
\]

This is a literal arithmetic construction from the ladder's rungs. It shows that discretizing its weighted prime sum at square-root multiplicity can be done with square-root rounding loss. It does **not** explain why the external theta chain has the same scale, and it does not give a saving: the integer in (7) already contains the full prime sum in its size. A larger \(m\) further lowers rounding loss; a reason to balance at \(\sqrt X\) would also need a proved increasing geometric cost.

**Exact example.** At \(X=12\), \(m=4\), the exponents at \(p=2,3,5,7,11\) are \(30,13,5,2,0\). Thus
\[
Q_{12,4}=2^{30}3^{13}5^5 7^2,
\]
\[
R_{12,4}=\tfrac13\log3+\tfrac35\log5
+\tfrac67\log7+\tfrac4{11}\log11.
\]
The companion exact checker verifies these rational exponents and remainders.

## 5. Why encoding multiplicity does not create a bound

Take the rank-one map \(T:\mathbb Z\to\mathbb Z\), \(T(n)=Q_{X,m}n\), with the usual metrics. Its saturation index is \(Q_{X,m}\), its operator norm is \(Q_{X,m}\), and the slope inequality is the equality
\(\log Q_{X,m}\le\log Q_{X,m}\).

Rescale the target norm by \(1/Q_{X,m}\). Then \(T\) is an isometry, but the target lattice slope becomes \(\log Q_{X,m}\). The same cost remains. More generally, uniformly rescaling the target metric by \(c>0\) changes \(\mu_{\max}(M)\) by \(-\log c\) and \(\log\|T\|_{\rm op}\) by \(+\log c\), leaving their sum unchanged.

Thus an integral theta realization must supply a noncircular upper estimate for the **combined** norm and slope cost. A norm estimate alone, a large divisibility exponent alone, or a change of metric does not establish the prime error bound.

## 6. The exact remaining scalar comparison

Put
\[
C(X)=X\log X-(1+\gamma_E)X,
\qquad G_\zeta(X)=S(X)-C(X).
\]
Suppose independently constructed lattice data as in Section 1 have saturation index \(q_{X,m}\) divisible by \(Q_{X,m}\). Then (3), (8), and \(\mu(N)\le\mu_{\max}(M)\) imply
\[
\boxed{
G_\zeta(X)\le
\frac{\mathcal A_{X,m}-mC(X)}m
+\frac{\theta(X)}m,
}
\tag{11}
\]
where the entire geometric cost is
\[
\mathcal A_{X,m}
=r\bigl(\mu_{\max}(M)-\mu(L)\bigr)
+\frac r2\log\!\left(\frac{\|T\|_{\rm HS}^2}{r}\right).
\tag{12}
\]
No such favorable theta-lattice family is constructed here. Equations (11)–(12) are an explicit conditional interface, not a new independent estimate.

For example, if a construction with \(m=\lceil\sqrt X\rceil\) proved
\[
\mathcal A_{X,m}-mC(X)\le m C_\varepsilon X^{1/2+\varepsilon}
\]
for every \(\varepsilon>0\) and all sufficiently large \(X\), (11) would give the full-ray one-sided estimate needed by the manuscript's Mellin/Landau argument. The one-dimensional construction above merely rewrites that desired estimate and does not prove it.

The external source uses a more elaborate lattice, character, and weight construction, rather than the toy integer (7). Its actual `SizeWindows` and balance/error conditions must be checked at their stated normalizations. The manuscript already proves the elementary downstream implication of those conditions. A correspondence between those source objects and (7) is neither asserted nor necessary: the already exact scalar identity for \(G_\zeta\) suffices if the source arithmetic bound is independently verified.

## 7. Why the external frame is not yet the user's Weil Gram

The source's normalized frame controls kernels indexed by arithmetic words and spaces of dimensions \(d_u\). The user's matrix is indexed by specified exponential rates and has entries
\[
P_{ij}=\frac{L(x_i)+L(x_j)}{x_i+x_j},
\qquad L(z)=\frac{d}{dz}\log\xi(1/2+z).
\]
The following matching information is still absent from the inspected synthesis:

| Required identification | Why it matters |
|---|---|
| One linear map for all combinations of the fixed exponential tests | Matching only individual rates does not identify the mixed entries. |
| The actual arithmetic word family, its weights, and the associated spaces | The source's indices and dimensions are not the Pick-prefix dimension. |
| The complete archimedean, pole, and prime-power normalization | The positive column norm is not already the completed signed Weil energy. |
| Conversion from the source's relative Hilbert–Schmidt bounds to an absolute quadratic-form error | A small relative parameter may multiply a large dimensional scale. |
| An error tending to zero for each fixed test prefix | This is what the existing analytic completion theorem needs. |

There is a valid scalar path that avoids demanding this stronger matching theorem. Verify a lower-level arithmetic theorem yielding the source's bound for its \(G_z\), confirm the normalization with the exact ramp identity, and apply the manuscript's independent analytic conclusion. A geometric explanation of that proof can use the normed-lattice and frame theorems above. A full squared-distance realization of the user's Weil form would be an additional construction unless it emerges naturally from the same data.

## Sources and verification scope

- [SlopeInequality.lean](https://github.com/Deicyde/riemann-hypothesis/blob/712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9/src/Formalism/LatticeSlopes/LatticeSlopesProofs/SlopeInequality.lean): actual proof body for the lattice slope comparison, with its named maximal-slope input.
- [GramDetLe.lean](https://github.com/Deicyde/riemann-hypothesis/blob/712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9/src/Formalism/LatticeSlopes/LatticeSlopesProofs/GramDetLe.lean) and [CovolEqGram.lean](https://github.com/Deicyde/riemann-hypothesis/blob/712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9/src/Formalism/LatticeSlopes/LatticeSlopesProofs/CovolEqGram.lean): determinant and volume mechanisms inspected in the source.
- [TotallyPositiveTraceGeOfNormDiscr.lean](https://github.com/Deicyde/riemann-hypothesis/blob/712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9/src/Formalism/SharpRestriction/GlobalSchurBounds/TotallyPositiveTraceGeOfNormDiscr.lean): actual trace-dual, polarization, and normalized field-norm theorem bodies discussed above.
- [Original manuscript](../release-v0.1/RH_Arithmetic_Theta_Completion.tex), especially its scalar growth implication and Proposition 5.4: downstream algebra already independently proved, without constructing the arithmetic data.
- [Ramp and averaging](../twin-ladder-refinement/RAMP_AND_AVERAGING.md): original prime operators and exact centered-ramp transport.

The companion [check_lattice_bridge.py](check_lattice_bridge.py) and [LATTICE_BRIDGE_CHECKS.json](LATTICE_BRIDGE_CHECKS.json) verify finite exact examples: a nonorthonormal-metric determinant/index calculation, the sharp \(\mathbb Q(i)\) trace-dual example, the \(X=12,m=4\) divisibility encoding, and metric-rescaling invariance. General statements are proved in prose. These checks do not certify the external formalization or RH.
