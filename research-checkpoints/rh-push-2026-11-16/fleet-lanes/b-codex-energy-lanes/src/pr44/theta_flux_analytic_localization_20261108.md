# Analytic localization and an order-two jet certificate for the full theta flux

Research note, 8 November 2026. These are deductions within the current theta-convolution formulation. No claim of novelty or proof of the Riemann hypothesis is made. The central positivity statement remains open in this work.

## 1. Exact kernel and the question

Set

\[
\theta(t)=\sum_{n\in\mathbb Z}e^{-\pi n^2t},\qquad
H(u)=e^{u/4}\theta(e^u),\qquad
\kappa(u)=\left(\frac{d^2}{du^2}-\frac1{16}\right)H(u).
\]

Jacobi's transformation makes \(H\), and hence \(\kappa\), even on the real line. For \(u\ge0\), the exact convergent theta series is

\[
\kappa(u)=\sum_{n=1}^{\infty}
\left(2\pi^2n^4 e^{9u/4}-3\pi n^2e^{5u/4}\right)e^{-\pi n^2e^u}.
\]

For \(\alpha>0\), write \(h_\pm(u)=(1\pm\alpha u/2)\kappa(u)\). The actual cutoff-energy kernel at cutoff zero is

\[
\mathcal H_\alpha(u,v)
=\alpha\int_0^\infty(2r-u-v)\kappa(r-u)\kappa(r-v)\,dr. \tag{1}
\]

It is also

\[
\mathcal H_\alpha(u,v)
=2\alpha\int_{|(u+v)/2|}^{\infty}
t\kappa\!\left(t-\frac{u-v}{2}\right)
\kappa\!\left(t+\frac{u-v}{2}\right)\,dt. \tag{2}
\]

The question is positive semidefiniteness for all finite point configurations and all complex coefficients. Entrywise positivity, every two-point determinant, a fixed finite jet, and separated point configurations are weaker statements.

## 2. A holomorphic cutoff-feature curve

Let

\[
\mathscr K=L^2(0,\infty)\oplus L^2(0,\infty),\qquad
J=\operatorname{diag}(I,-I),
\]

and use the Hilbert inner product linear in its second argument. Define

\[
\Phi(z)=\big(h_+(r-z),h_-(r-z)\big)_{r>0}. \tag{3}
\]

For real \(u,v\), expansion of the two products gives the exact indefinite Gram representation

\[
\mathcal H_\alpha(u,v)=\langle\Phi(u),J\Phi(v)\rangle_{\mathscr K}. \tag{4}
\]

This identity uses the full theta kernel and no inverse of the convolution operator.

### Lemma 1: the feature curve is holomorphic on a connected strip

The map \(\Phi\) is holomorphic with values in \(\mathscr K\) on

\[
\mathcal S=\{z\in\mathbb C:|\operatorname{Im}z|<\pi/2\}.
\]

**Proof.** For \(w\in\mathcal S\), \(\operatorname{Re}(e^w)>0\), so the theta series defining \(H(w)\) and its differentiated series converge locally uniformly. Therefore \(h_\pm(w)\) are holomorphic there.

Take a compact set \(K\subset\mathcal S\). Choose \(M<\infty\) and \(\varepsilon>0\) so that

\[
|\operatorname{Re}z|\le M,\qquad
|\operatorname{Im}z|\le\pi/2-\varepsilon\quad(z\in K).
\]

For real \(r\),

\[
\operatorname{Re}(e^{r-z})
\ge e^{r-M}\sin\varepsilon.
\]

Consequently, for all sufficiently large \(r\), the differentiated theta series gives constants \(C_K,c_K>0\) such that

\[
|h_+(r-z)|+|h_-(r-z)|
\le C_K(1+r)e^{9r/4}e^{-c_Ke^r},\qquad z\in K. \tag{5}
\]

For example, after setting \(A=\pi e^{r-M}\sin\varepsilon\ge1\), the sums \(\sum n^j e^{-An^2}\), for the finitely many powers needed, are bounded by \(e^{-A}\sum n^j e^{-(n^2-1)}\). The bounded interval of remaining \(r\)'s is controlled by continuity on a compact subset of \(\mathcal S\). The right side of (5) is square integrable in \(r\). Local scalar holomorphy and this uniform \(L^2\) domination establish Hilbert-valued holomorphy. Applying the same estimate on a slightly larger compact subset and Cauchy's formula also bounds every derivative \(\Phi^{(m)}\) in \(\mathscr K\). \(\square\)

## 3. Full continuum tail positivity is already the global problem

### Theorem 2: positivity localizes analytically

Let \(I\subset\mathbb R\) be any nonempty open interval. The following are equivalent:

1. \(\mathcal H_\alpha\) is positive semidefinite on every finite configuration in \(\mathbb R\).
2. \(\mathcal H_\alpha\) is positive semidefinite on every finite configuration in \(I\).

The same result holds with \(I\) replaced by any real set with a finite accumulation point.

**Proof.** Write

\[
V_I=\overline{\operatorname{span}}\{\Phi(u):u\in I\},\qquad
V_{\mathbb R}=\overline{\operatorname{span}}\{\Phi(u):u\in\mathbb R\}.
\]

If \(w\in V_I^\perp\), then the holomorphic scalar function

\[
z\longmapsto\langle w,\Phi(z)\rangle
\]

vanishes on \(I\). By the identity theorem it vanishes on the connected strip \(\mathcal S\), and hence on the real line. Thus \(V_I^\perp=V_{\mathbb R}^\perp\), or

\[
V_I=V_{\mathbb R}. \tag{6}
\]

Positivity of every finite kernel matrix in \(I\) says exactly that \(\langle v,Jv\rangle\ge0\) on the finite linear span of the corresponding features. Because \(J\) is bounded, this remains true on its closure. Equation (6) extends it to every global finite feature combination, proving global kernel positivity. The reverse implication is immediate. The proof for an accumulating set is identical. \(\square\)

### Consequences and scope

In particular, proving full positive semidefiniteness on a continuum tail \((R,\infty)\), for any finite \(R\), proves full global positive semidefiniteness. There is no easier complete continuum-tail block hidden by moving sufficiently far out.

Conversely, if a global negative direction exists, then every nonempty real interval contains some finite point configuration with a negative direction. This does not impose a bound on its cardinality, coefficient size, minimum point spacing, or conditioning. Those quantities may deteriorate dramatically when the interval moves outward or shrinks.

This is consistent with positivity for every fixed finite offset configuration far enough out, and with a uniform theorem for arbitrary cardinality under a fixed positive minimum spacing. Neither type of theorem controls all point collisions. The exact unresolved regime consists of arbitrarily fine configurations, equivalently the complete derivative-jet hierarchy below.

## 4. All derivative jets at one point are enough, and necessary

For any fixed real \(x_0\), define

\[
\mathcal J_N(x_0)=
\left[
\partial_u^m\partial_v^n\mathcal H_\alpha(u,v)
\big|_{u=v=x_0}
\right]_{m,n=0}^N. \tag{7}
\]

Hilbert-valued holomorphy and (4) show that its entries are

\[
\langle\Phi^{(m)}(x_0),J\Phi^{(n)}(x_0)\rangle.
\]

### Corollary 3: the complete jet criterion

Global positive semidefiniteness of \(\mathcal H_\alpha\) is equivalent to positive semidefiniteness of \(\mathcal J_N(x_0)\) for every finite \(N\), at one arbitrarily chosen real point \(x_0\).

**Proof.** If a vector is orthogonal to all \(\Phi^{(m)}(x_0)\), the scalar analytic function obtained by pairing with \(\Phi(z)\) has every Taylor coefficient zero at \(x_0\), so it vanishes throughout \(\mathcal S\). Thus the closed span of all derivatives at \(x_0\) equals \(V_{\mathbb R}\). The bounded-form argument in Theorem 2 then applies. Conversely, derivatives are limits in \(\mathscr K\) of finite differences of real features, so global kernel positivity implies positivity on all derivative combinations. \(\square\)

A finite-order certificate remains useful and substantive, but cannot replace the quantifier over every \(N\).

## 5. Exact order-two jet and its rigorous positive certificate

This section verifies one condition beyond the two-point inequalities. Put

\[
I_j=\int_0^\infty u\big(\kappa^{(j)}(u)\big)^2\,du,
\qquad j=0,1,2,\qquad k_0=\kappa(0).
\]

Evenness gives \(\mathcal H_\alpha(-u,-v)=\mathcal H_\alpha(u,v)\). One way to see this directly from (1) is that the full-line integral of its integrand is zero: after shifting by \((u+v)/2\), it is an odd function. Therefore also

\[
\mathcal H_\alpha(u,v)
=\alpha\int_0^\infty(2r+u+v)\kappa(r+u)\kappa(r+v)\,dr. \tag{8}
\]

Differentiate (8), use rapid decay to integrate by parts, and use \(\kappa'(0)=0\). The result is the exact identity

\[
\boxed{
\mathcal J_2(0)=\alpha
\begin{pmatrix}
2I_0&0&-2I_1\\
0&2I_1-k_0^2&0\\
-2I_1&0&2I_2
\end{pmatrix}.} \tag{9}
\]

For example,

\[
\int_0^\infty u\kappa\kappa''\,du
=\frac{k_0^2}{2}-I_1,
\qquad
\int_0^\infty\kappa'\kappa''\,du=0,
\]

which give the mixed even entry and the final diagonal entry. All odd-total-order entries vanish by simultaneous reflection.

The companion script `theta_flux_jet3_certificate_20261108.py` uses interval arithmetic, eight exact theta terms, explicit bounds for the infinite remainder, and a composite Simpson error bound. It proves the following deliberately rounded-out enclosures for \(\alpha=1\):

| Quantity | Certified enclosure |
|---|---:|
| \(2I_0\) | \([0.04024267831,\ 0.04024274183]\) |
| \(2I_1-k_0^2\) | \([0.01088075336,\ 0.01088385100]\) |
| \(-2I_1\) | \([-0.21042197189,\ -0.21041887425]\) |
| \(2I_2\) | \([1.12324289095,\ 1.12346518102]\) |
| Even-block determinant | \([0.00092489608,\ 0.00093521659]\) |
| Full \(3\times3\) determinant | \([0.00001006356616,\ 0.00001017875801]\) |

The positive odd entry and positive definite even block prove

\[
\mathcal J_2(0)\succ0\qquad(\alpha>0). \tag{10}
\]

This is a certificate for the exact full-theta kernel, not for a finite theta approximation. It establishes only this finite derivative order. It supplies no uniform statement as the jet order increases.

### Complete bounds used by the certificate

For the \(n\)-th theta term, let \(t=\pi n^2e^u\). Then

\[
\kappa_n^{(j)}(u)=e^{u/4}p_j(t)e^{-t},\qquad
p_0(t)=2t^2-3t,
\]

\[
p_{j+1}(t)=tp_j'(t)+(1/4-t)p_j(t). \tag{11}
\]

The script creates all coefficients through order six as exact rational numbers. It verifies uniform bounds on \(u\ge0\), for the full series and hence also the first eight terms in absolute value:

\[
|\kappa^{(j)}(u)|\le B_j,\quad
(B_0,\ldots,B_6)=(2,9,53,376,3245,33219,396103). \tag{12}
\]

For completeness, each monomial \(ct^k\) contributes at most

\[
|c|\left(t_*^{k+1/4}e^{-t_*}
+\frac{12^{k+1/4}e^{-12}}{0.999}\right),
\qquad t_*=\max(3,k+1/4).
\]

Here \(e^{u/4}=(t/(\pi n^2))^{1/4}\), the factor \((\pi n^2)^{-1/4}\) is bounded by one, and the ratio of successive \(n\ge2\) bounds is at most

\[
(3/2)^{33/2}e^{-15}<0.001.
\]

For derivative orders zero through two, the absolute coefficient sum of \(p_j\) is less than \(42\), with degree at most four. Consequently the omitted terms \(n\ge9\), uniformly for \(u\ge0\), are bounded by

\[
\frac{10752\,9^8e^{-243}}
{1-(10/9)^8e^{-57}}<10^{-92}. \tag{13}
\]

Their contribution to each integral \(I_j\) on \([0,3]\) is less than \(10^{-88}\).

On \(u\ge3\), the full derivatives satisfy

\[
|\kappa^{(j)}(u)|\le21504e^{17u/4-3e^u},\qquad j=0,1,2.
\]

Using \(t=e^u\), \(e^3>20\), and \(\log t\le\sqrt t\) for \(t\ge20\), this gives

\[
\int_3^\infty u\big(\kappa^{(j)}(u)\big)^2du
\le21504^2\int_{20}^\infty t^8e^{-6t}dt<10^{-32}. \tag{14}
\]

The final elementary integral is evaluated by the exact finite incomplete-gamma sum.

On \([0,3]\), take \(N=2000\) Simpson subintervals and \(h=3/N\). For \(f_j(u)=u(\kappa_8^{(j)}(u))^2\), define

\[
C_k(j)=\sum_{\ell=0}^k\binom{k}{\ell}B_{j+\ell}B_{j+k-\ell}.
\]

The product rule gives \(|f_j^{(4)}|\le3C_4(j)+4C_3(j)\). The integral error is bounded by

\[
\frac{3h^4}{180}\,[3C_4(j)+4C_3(j)]. \tag{15}
\]

For \(j=0,1,2\), these error bounds are respectively

\[
1.587785625\times10^{-8},\quad
7.7440606875\times10^{-7},\quad
5.55725134125\times10^{-5}.
\]

The script encloses all sampled exponentials, \(\pi\), arithmetic, and final determinants with `mpmath.iv` at 40 decimal digits, then adds the independent bounds (13)--(15). Its assertions check every auxiliary cap and the three positive quantities needed for (10).

## 6. What this changes in the remaining attack

There are now two distinct positive results: fixed-spacing tail configurations can be controlled at every cardinality, while the first nontrivial three-dimensional derivative jet can be certified directly from the full theta series. Analytic localization shows exactly why neither alone closes the full problem: positivity for arbitrarily coalescing points requires every derivative order, and full positivity on even one continuum interval would already settle the global cutoff-energy theorem.

The missing statement is an order-uniform control of the entire jet hierarchy, or an equivalent genuinely positive representation of the full cutoff-feature span. This note proves neither. It excludes a shortcut based on treating unrestricted continuum-tail positivity as a weaker independent input.
