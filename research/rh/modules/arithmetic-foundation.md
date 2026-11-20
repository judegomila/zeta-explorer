# Arithmetic foundation: one-sided Landau continuation and exact shells

**Status: accepted reductions; the required global bound is conditional and unproved.** These are attributed classical mechanisms applied to the exact discrepancy. No new zero-free strip is claimed.

## 1. The exact discrepancy and its Laplace transform

For every real \(W\ge0\), define
\[
D(W)=\sum_{n<e^W}\frac{\Lambda(n)}{\sqrt n}(W-\log n)
-\int_0^W e^{r/2}(W-r)\,dr.
\]
An endpoint event contributes zero. The continuum integral is \(4e^{W/2}-2W-4\). The elementary Chebyshev estimate \(\psi(x)\le3x\) implies \(|D(W)|=O(e^{W/2})\). For \(\Re q>1/2\), absolute convergence and
\(\int_r^\infty(W-r)e^{-qW}\,dW=e^{-qr}/q^2\) give
\[
\int_0^\infty D(W)e^{-qW}\,dW
=\frac1{q^2}\left[-\frac{\zeta'(q+1/2)}{\zeta(q+1/2)}-\frac1{q-1/2}\right]=M(q).
\]
The apparent pole at \(q=1/2\) cancels exactly. The expression is holomorphic near every positive **real** \(q\): zeta is positive for real \(s>1\), and negative for \(0<s<1\) by its paired alternating series. This does not assume a nonreal zero-free half-plane.

## 2. Conditional one-sided theorem, with proof

**Theorem.** Fix \(0\le\alpha<1/2\). If fixed \(C>0\), \(m\ge0\), and \(W_0\ge0\) satisfy
\[
D(W)\le C(1+W)^m e^{\alpha W}\quad\text{for every real }W\ge W_0,
\]
then zeta has no zero in \(\Re s>1/2+\alpha\). At \(\alpha=0\), functional-equation reflection gives RH. The displayed hypothesis is not established here.

**Landau lemma.** If \(f\ge0\) is locally integrable and its Laplace convergence abscissa \(\sigma_c\) is finite, the transform cannot be holomorphic near the real point \(\sigma_c\).

For if it were, expand at \(s_1>\sigma_c\) close enough to the boundary. Its Taylor series towards the left has nonnegative coefficients
\[
\sum_{n\ge0}\frac{h^n}{n!}\int_0^\infty W^nf(W)e^{-s_1W}\,dW.
\]
Tonelli identifies the convergent series with the Laplace integral at \(s_1-h<\sigma_c\), contradiction.

To apply the lemma, increase \(m\) to an integer and put \(P(W)=C(1+W)^m e^{\alpha W}\), \(f=0\) before \(W_0\), and \(f=P-D\) afterwards. Its abscissa is at most \(1/2\). Initially
\[
\mathcal L_f(q)=R(q)-M(q)-E(q),\quad
R(q)=C\sum_{k=0}^m\binom mk\frac{k!}{(q-\alpha)^{k+1}},
\]
where \(E\) is the entire transform of the omitted compact initial interval. If \(\sigma_c>\alpha\), the right side is holomorphic near the positive real point \(\sigma_c\) and continues the transform, contradicting the lemma. Hence \(\sigma_c\le\alpha\). Consequently \(M=R-E-\mathcal L_f\) is holomorphic for \(\Re q>\alpha\). A zeta zero there would create a logarithmic-derivative pole whose nonzero multiplicity residue cannot be cancelled by the pole subtraction at \(s=1\). This proves the theorem, including \(\alpha=0\) without any assertion at \(q=0\).

## 3. Exact triangular shells and all-real reconstruction

Fix \(h=\log2\), \(c_h=8(\cosh(h/2)-1)\), and
\[
S_h(W)=D(W+h)-2D(W)+D(W-h).
\]
For \(W\ge h\), taking the second difference of each hinge yields exactly
\[
S_h(W)=\sum_n\frac{\Lambda(n)}{\sqrt n}(h-|\log n-W|)_+-c_he^{W/2}.
\]
The continuum constant is \(\int_{-h}^h(h-|u|)e^{u/2}\,du\); the tent vanishes at both endpoints.

If \(S_h(W)\le C(1+W)^m e^{\alpha W}\) for every sufficiently large real \(W\), choose any residue \(v\in[W_0,W_0+h)\), set \(d_n=D(v+nh)\), and use
\[
d_n=d_0+n(d_1-d_0)+\sum_{j=1}^{n-1}(n-j)S_h(v+jh).
\]
This follows by induction on its exact second difference. Every coefficient is nonnegative. Compactness of the residue interval bounds the initial terms uniformly. For \(\alpha>0\), the remaining geometric sum is bounded by \(\sum_{k\ge1}ke^{-\alpha hk}\); for \(\alpha=0\), its cost is at most \(n^2/2\). Thus an all-real shell bound reconstructs an all-real discrepancy bound, with two extra polynomial powers at exponent zero.

A bound on just one progression leaves the other residues untested. Fixed-grid sampling is not enough: the available distributional inequality \(D''\ge-e^{W/2}\) permits an excess above a cell chord as large as \(e^{(b+\delta)/2}\delta^2/8\).

## 4. Prime powers and exact Vaughan centering

Write \(S_h=T_h+R_h\), where \(T_h\) contains ordinary primes and the continuum term. For \(x=e^W\ge2\), a direct count gives
\[
0\le R_h(W)\le2h\log(2x)\lfloor\log_2(2x)\rfloor=O((1+W)^2).
\]
Indeed \(x/2\le p^k\le2x\) forces \(k\le\log_2(2x)\); each term is at most \(h\log(2x)\sqrt{2/x}\), with at most \(\sqrt{2x}\) bases for each \(k\ge2\). Thus the one-sided prime and prime-power shell targets are equivalent when fixed polynomial factors are allowed.

The exact convolution identity
\[
\Lambda=\mu_{\le U}*\log-\mu_{\le U}*1*\Lambda_{\le V}
+\Lambda_{\le V}+\mu_{>U}*1*\Lambda_{>V}
\]
follows from \(\mu*1=\delta\), \(\log=1*\Lambda\), and splitting \(\mu\) at \(U\). Applying it to the tent weight retains the signed Type-I/Type-II terms and subtracts the continuum main term **once**. Better lattice quadrature does not establish the remaining arithmetic cancellation. Replacing the centered signed remainder by independent absolute values is not the theorem's hypothesis.

## Scope and sources

These derivations are preserved in the delivered V7 manuscript's arithmetic sections, with a research cutoff of 30 October 2026, 08:00 UTC. Later finite scalar and spectral improvements are separate modules, not silent edits to that historical edition. The manifest records exact source hashes. The old unavailable 1.1 GB historical arithmetic package is not used in these derivations and is not claimed recovered or reproducible.
