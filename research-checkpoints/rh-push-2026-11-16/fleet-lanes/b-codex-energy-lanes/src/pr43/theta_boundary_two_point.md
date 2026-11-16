# Two-point positivity and finite-order end-region positivity for the theta flux kernel

This note records derivations for the exact theta kernel in the current project.
It makes no claim of novelty in the literature and no claim to prove RH.

## 1. Kernel and normalization

Let

\[
\theta(t)=\sum_{n\in\mathbb Z}e^{-\pi n^2t},\qquad
\kappa(u)=\left(\frac{d^2}{du^2}-\frac1{16}\right)
          [e^{u/4}\theta(e^u)].
\]

The kernel is even, positive, smooth, and rapidly decreasing. Fix \(\alpha>0\),
and write

\[
h_\pm(u)=(1\pm\alpha u/2)\kappa(u).
\]

For a cutoff \(c\in\mathbb R\), define the real symmetric flux kernel

\[
\mathcal H_{c,\alpha}(u,v)
=\alpha\int_c^\infty(2r-u-v)\kappa(r-u)\kappa(r-v)\,dr.
\tag{1}
\]

Using \(m=(u+v)/2\), \(d=(u-v)/2\), evenness gives

\[
\mathcal H_{c,\alpha}(u,v)
=2\alpha\int_{|c-m|}^\infty
 a\kappa(a+d)\kappa(a-d)\,da.
\tag{2}
\]

In particular all entries are positive. The cutoff is only a translation:

\[
\mathcal H_{c,\alpha}(u,v)
=\mathcal H_{0,\alpha}(u-c,v-c).
\tag{3}
\]

This is the kernel in the exact cutoff energy identity. If \(A\) is convolution
by \(h_+\), then \(A^*\) is convolution by \(h_-\). For \(f=Aa\), \(g=A^*a\),
and \(Q_c\) multiplication by \(\mathbf1_{(c,\infty)}\),

\[
\|Q_cg\|_2^2-\|Q_cf\|_2^2
=-\langle a,\mathcal H_{c,\alpha}a\rangle.
\tag{4}
\]

The note below concerns positivity of this actual energy kernel, not the
different fixed-midpoint kernel previously shown to fail positive definiteness.

## 2. The stronger theta concavity input

George Csordas, *Fourier transforms of positive definite kernels and the Riemann
xi-function*, [arXiv:1309.0055](https://arxiv.org/pdf/1309.0055), Theorem 4.2(b),
states that \(\log\Phi(\sqrt t)\) is strictly concave for \(t>0\).
The normalization in that paper satisfies

\[
\kappa(u)=\Phi(u/4).
\]

Therefore

\[
V(t):=-\log\kappa(\sqrt t)
\]

is strictly convex for \(t>0\), and convex on \([0,\infty)\) by continuity.
This is stronger than ordinary log-concavity of \(\kappa(u)\). The remaining
arguments in this note are direct derivations from that result and the exact
theta series.

## 3. An explicit positive Gram majorant

For \(c=0\), substitute \(s=a^2-m^2\) into (2). Since \(a\ge|m|\),

\[
\mathcal H_{0,\alpha}(u,v)
=\alpha\int_0^\infty
 \kappa(\sqrt{s+m^2}+d)\kappa(\sqrt{s+m^2}-d)\,ds.
\tag{5}
\]

Let \(a=\sqrt{s+m^2}\). The two pairs of nonnegative numbers

\[
X_\pm=(a\pm d)^2,\qquad
Y_1=s+u^2,\quad Y_2=s+v^2
\]

have the same sum. Their absolute differences satisfy

\[
|X_+-X_-|=4|ad|\ge4|md|=|Y_1-Y_2|.
\]

Thus the \(X\)-pair is the more separated pair. Convexity of \(V\) gives

\[
V(X_+)+V(X_-)\ge V(Y_1)+V(Y_2).
\]

Evenness of \(\kappa\), followed by exponentiation, gives

\[
\kappa(a+d)\kappa(a-d)
\le\kappa(\sqrt{s+u^2})\kappa(\sqrt{s+v^2}).
\tag{6}
\]

Define

\[
\mathcal G_\alpha(u,v)
=\alpha\int_0^\infty
 \kappa(\sqrt{s+u^2})\kappa(\sqrt{s+v^2})\,ds.
\tag{7}
\]

This is a positive Gram kernel, with explicit feature
\(s\mapsto\sqrt\alpha\,\kappa(\sqrt{s+u^2})\). Equations (5)--(7) imply the
entrywise estimate

\[
0<\mathcal H_{0,\alpha}(u,v)\le\mathcal G_\alpha(u,v).
\tag{8}
\]

The diagonals agree exactly:

\[
\mathcal G_\alpha(u,u)=\mathcal H_{0,\alpha}(u,u)
=2\alpha\int_{|u|}^\infty t\kappa(t)^2\,dt.
\tag{9}
\]

If \(u\ne v\), the separation inequality is strict for every \(s>0\).
Strict convexity of \(V\) therefore makes (8) strict off the diagonal.

## 4. Every two-point principal Gram matrix is positive

Cauchy--Schwarz in the explicit feature space (7) gives

\[
\mathcal G_\alpha(u,v)^2
\le\mathcal G_\alpha(u,u)\mathcal G_\alpha(v,v).
\]

Together with (8)--(9), for \(u\ne v\),

\[
\boxed{\quad
\mathcal H_{0,\alpha}(u,v)^2
<\mathcal H_{0,\alpha}(u,u)\mathcal H_{0,\alpha}(v,v).
\quad}
\tag{10}
\]

Thus every two-point principal Gram matrix for distinct points is positive
definite. By (3), this holds for every cutoff \(c\). No assertion about larger
Gram matrices is implicit in this theorem.

### Why the Gram majorant is not a full factorization

Set \(\mathcal E=\mathcal G_\alpha-\mathcal H_{0,\alpha}\). It has zero diagonal
and strictly positive off-diagonal entries. For any two distinct points its
matrix is

\[
\begin{pmatrix}0&e\\e&0\end{pmatrix},\qquad e>0,
\]

which has eigenvalues \(e\) and \(-e\). Thus \(\mathcal E\) is indefinite.
The entrywise comparison \(\mathcal H\le\mathcal G\) is not an operator or
Loewner inequality, and subtracting this correction from a Gram kernel does
not establish full positive definiteness.

## 5. A check that the stronger theta property matters

Ordinary strict log-concavity does not imply even the flux two-point theorem.
Consider \(k(u)=e^{-u^2}+e^{-2u^2}\), which is positive, even, and strictly
log-concave: with \(p=e^{-u^2}/(1+e^{-u^2})\),
\((\log k)''=-2-2p+4u^2p(1-p)\le-2+4/e<0\).
Its associated flux kernel at \(\alpha=1,c=0\) satisfies

\[
\mathcal H_k(u,u)-\mathcal H_k(u,-u)
=\left[4\int_0^\infty a\,k'(a)^2\,da-2k(0)^2\right]u^2+O(u^4).
\]

Here \(k(0)^2=4\) and

\[
\int_0^\infty a\,k'(a)^2\,da
=\frac12+\frac12+\frac89=\frac{17}{9}.
\]

Consequently

\[
\mathcal H_k(u,u)-\mathcal H_k(u,-u)
=-\frac49u^2+O(u^4)<0
\]

for sufficiently small positive \(u\). The antisymmetric vector on the two
points \(\{u,-u\}\) has negative quadratic form. The stronger convexity of
\(-\log\kappa(\sqrt t)\) used above excludes this particular obstruction.

## 6. Theta-tail theorem: every fixed finite configuration eventually passes

This is a separate, finite-order result, and is not a uniform operator bound.
For positive \(U,V\), (1)--(2) imply

\[
\mathcal H_{0,\alpha}(U,V)
=\alpha\int_0^\infty
 (U+V+2s)\kappa(U+s)\kappa(V+s)\,ds.
\tag{11}
\]

The exact theta series gives

\[
\kappa(t)=2\pi^2e^{9t/4}e^{-\pi e^t}(1+O(e^{-t}))
\qquad(t\to+\infty).
\tag{12}
\]

Take \(U=R+u\), \(V=R+v\), with \(u,v\) in a fixed compact set, and set
\(\Lambda=\pi(e^U+e^V)\). Rescale \(s=z/\Lambda\) in (11). The product ratio

\[
\frac{\kappa(U+z/\Lambda)\kappa(V+z/\Lambda)}{\kappa(U)\kappa(V)}
\]

tends to \(e^{-z}\), locally uniformly in the offsets. For large \(R\), it is
bounded by a constant times \(e^{-z/2}\): this follows from
\(e^s-1\ge s\), the prefactor \(e^{9s/2}\), and (12). After including the
linear factor \(1+2z/[\Lambda(U+V)]\), dominated convergence proves

\[
\mathcal H_{0,\alpha}(U,V)
\sim\frac{\alpha(U+V)\kappa(U)\kappa(V)}{\pi(e^U+e^V)}.
\tag{13}
\]

The same formula on the diagonal gives the normalized limit

\[
\boxed{\quad
\frac{\mathcal H_{0,\alpha}(R+u,R+v)}
 {\sqrt{\mathcal H_{0,\alpha}(R+u,R+u)
             \mathcal H_{0,\alpha}(R+v,R+v)}}
\longrightarrow\operatorname{sech}\frac{u-v}{2}.
\quad}
\tag{14}
\]

The limiting kernel has the explicit positive Laplace Gram factorization

\[
\operatorname{sech}\frac{u-v}{2}
=\frac{2e^{(u+v)/2}}{e^u+e^v}
=\int_0^\infty
 \bigl[\sqrt{2e^u}e^{-e^u r}\bigr]
 \bigl[\sqrt{2e^v}e^{-e^v r}\bigr]dr.
\tag{15}
\]

Distinct offsets give distinct exponential rates, whose finite families are
linearly independent. Thus this Gram kernel is strictly positive definite.
Equivalently it has the strictly positive Fourier density

\[
\operatorname{sech}(s/2)
=\int_{\mathbb R}\operatorname{sech}(\pi y)e^{iys}\,dy.
\tag{16}
\]

For completeness, (16) follows by substituting \(t=e^{2\pi y}\), giving
\(\pi^{-1}\int_0^\infty t^{-1/2+is/(2\pi)}/(1+t)\,dt\), and evaluating the
Euler beta integral. The density is strictly positive; a nonzero finite
exponential sum cannot vanish almost everywhere.

Therefore, for any fixed finite set of distinct offsets \(u_1,\ldots,u_n\),
the actual flux Gram matrix at \(R+u_1,\ldots,R+u_n\) is positive definite
for all sufficiently large \(R\). Matrix convergence in (14), strict
positivity of the limiting matrix, and positive diagonal congruence prove the
claim. Simultaneous reflection gives the analogous result at the other end.

There is no bound uniform in the number of points or in arbitrary offset
configurations here. This theorem does not establish positivity of the full
flux operator, exclude negative directions with changing scales, or prove
the forbidden output tail vanishes.
