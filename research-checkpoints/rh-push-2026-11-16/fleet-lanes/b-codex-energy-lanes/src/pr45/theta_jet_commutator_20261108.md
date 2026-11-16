# A Gaussian boundary factor, its exact theta defect, and a higher-order concavity obstruction

Research note, 8 November 2026. This note gives an exact identity at every finite derivative order, an analytic positive representation for the first odd jet, and an explicit counterexample to extending that representation using squared-variable concavity alone. It does not establish positivity of the complete theta jet or prove the Riemann hypothesis. No novelty claim is made.

## 1. Kernel, jet, and hypotheses

The actual theta kernel is

\[
\theta(t)=\sum_{n\in\mathbb Z}e^{-\pi n^2t},\qquad
\kappa(u)=\left(D^2-\frac1{16}\right)
\left[e^{u/4}\theta(e^u)\right],\qquad D=\frac d{du}.
\]

The cutoff-energy kernel, with \(\alpha>0\), is

\[
\mathcal H_\alpha(u,v)=\alpha\int_0^\infty
(2r-u-v)\kappa(r-u)\kappa(r-v)\,dr.
\]

Evenness implies the equivalent expression

\[
\mathcal H_\alpha(u,v)=\alpha\int_0^\infty
(2r+u+v)\kappa(r+u)\kappa(r+v)\,dr. \tag{1}
\]

Define its derivative jet at zero by

\[
J_{mn}=\partial_u^m\partial_v^n\mathcal H_\alpha(0,0).
\]

For the identities below, a general kernel is allowed provided that it is smooth, positive, even, satisfies \(\kappa'(u)<0\) for \(u>0\) and \(\kappa''(0)<0\), and has sufficient decay for the displayed integrals, derivatives under integrals, and integrations by parts. Define

\[
b(u)=-\frac{u\kappa(u)}{\kappa'(u)}\quad(u>0),\qquad
b(0)=-\frac{\kappa(0)}{\kappa''(0)}. \tag{2}
\]

Because \(\kappa'(u)/u\) extends smoothly and has a nonzero value at zero, \(b\) extends smoothly and evenly there. The required endpoint conditions for a polynomial \(P\) are that \(b|P(D)\kappa|^2\) tends to zero at infinity and that all commutator integrals below converge absolutely. These conditions hold for the actual theta kernel and the explicit Gaussian example in Section 5.

For the actual theta kernel,

\[
\kappa(u)=2\pi^2e^{9u/4-\pi e^u}
\left(1-\frac{3e^{-u}}{2\pi}
+O\!\left(e^{-3\pi e^u}\right)\right)
\qquad(u\to+\infty). \tag{3}
\]

Every fixed number of derivatives has the corresponding differentiated superexponential bound. In particular,

\[
b(u)\sim\frac{u}{\pi e^u-9/4},\qquad
b^{(j)}(u)=O_j((1+u)e^{-u})
\]

for each fixed \(j\). These bounds verify all of the endpoint and integrability conditions used here.

The theta-specific concavity input is that \(\log\kappa(\sqrt x)\) is strictly concave for \(x>0\). It is the rescaled form of the result for \(\Phi\) in Csordas, *Fourier Transforms of Positive Definite Kernels and the Riemann ξ-Function*, Theorem 4.2(b): \(\kappa(u)=\Phi(u/4)\). The proof below uses this input only where explicitly identified. Primary source: https://arxiv.org/pdf/1309.0055 .

The needed strict negativity at the origin also has a short independent bound. Write

\[
p_2(t)=2t^4-14t^3+\frac{165}{8}t^2-\frac{75}{16}t,
\qquad
\kappa''(0)=\sum_{n\ge1}p_2(\pi n^2)e^{-\pi n^2}.
\]

For \(n\ge2\), \(0<p_2(\pi n^2)<2\pi^4n^8\). The ratio of consecutive \(n^8e^{-\pi n^2}\) terms is at most \((3/2)^8e^{-5\pi}\). Therefore

\[
p_2(\pi)e^{-\pi}<\kappa''(0)
<p_2(\pi)e^{-\pi}
+\frac{2\pi^4\,256e^{-4\pi}}{1-(3/2)^8e^{-5\pi}}.
\]

The companion interval script verifies the outward-rounded enclosure

\[
-2.179508<\kappa''(0)<-2.005581<0. \tag{3a}
\]

## 2. An exact polynomial identity at every finite derivative order

Differentiating (1) gives

\[
J_{mn}=\alpha\int_0^\infty
\left[
2u\kappa^{(m)}\kappa^{(n)}
+m\kappa^{(m-1)}\kappa^{(n)}
+n\kappa^{(m)}\kappa^{(n-1)}
\right]du, \tag{4}
\]

with terms having a zero prefactor omitted. Let

\[
P(X)=\sum_{n=0}^N c_nX^n,\qquad
f=P(D)\kappa,\qquad
Q(P)=\sum_{m,n=0}^N\overline{c_m}J_{mn}c_n.
\]

The polynomial commutator \([P(D),u]=P'(D)\) converts (4) into

\[
Q(P)=2\alpha\operatorname{Re}\int_0^\infty
\overline f\,P(D)(u\kappa)\,du. \tag{5}
\]

Since \(u\kappa=-b\kappa'\),

\[
P(D)(u\kappa)=-bf'-[P(D),b]\kappa'.
\]

One integration by parts therefore gives the exact identity

\[
\boxed{
Q(P)=\alpha b(0)|f(0)|^2
+\alpha\int_0^\infty b'(u)|f(u)|^2du
-2\alpha\operatorname{Re}\int_0^\infty
\overline{f(u)}\,[P(D),b]\kappa'(u)\,du.
} \tag{6}
\]

No asymptotic approximation, truncation of the theta series, or unbounded inverse is used. The identity holds separately for every polynomial degree; the constants in any estimates of its terms need not be uniform in that degree.

The finite commutator expansion is

\[
[P(D),b]
=\sum_{j=1}^{N}\frac{b^{(j)}(u)}{j!}\,P^{(j)}(D), \tag{7}
\]

where \(P^{(j)}\) means the \(j\)-th derivative of the polynomial in its argument. Thus all higher derivatives of \(b\) enter the all-orders problem.

## 3. The positive Gaussian factor and the sign of the theta defect

For a Gaussian \(\kappa(u)=Ce^{-\beta u^2}\), \(\beta>0\), one has \(b=1/(2\beta)\). Both integrals in (6) vanish, leaving the exact positive rank-one factorization

\[
Q(P)=\frac{\alpha}{2\beta}|P(D)\kappa(0)|^2\ge0. \tag{8}
\]

For a general kernel, write \(\kappa(u)=e^{-V(u^2)}\). Then

\[
b(u)=\frac1{2V'(u^2)},\qquad
b'(u)=-\frac{uV''(u^2)}{(V'(u^2))^2}. \tag{9}
\]

Therefore the established theta concavity gives \(b'\le0\). In (6), the first term is positive, while the bulk term \(\int b'|f|^2\) is nonpositive. The commutator must provide the compensating contribution. Concavity alone supplies no signs for all of the derivatives in (7).

This is a precise defect in the attempted Gaussian factorization: a valid positive boundary term survives, but it is accompanied by a nonpositive bulk term and a higher-derivative commutator. Dropping either remainder, or treating their sum as positive without proof, would be invalid.

## 4. A complete analytic Gram formula for the first odd jet

For \(P(D)=D\), one has \(f=\kappa'\), \(f(0)=0\), and \([D,b]\kappa'=b'\kappa'\). Equation (6) simplifies to

\[
\boxed{
J_{11}=-\alpha\int_0^\infty b'(u)(\kappa'(u))^2du
=\alpha\left\|\sqrt{-b'}\,\kappa'\right\|_{L^2(0,\infty)}^2.
} \tag{10}
\]

Equivalently,

\[
2\int_0^\infty u(\kappa'(u))^2du-\kappa(0)^2
=\int_0^\infty(-b'(u))(\kappa'(u))^2du\ge0. \tag{11}
\]

Strict squared-variable concavity makes the right side positive for the actual theta kernel. This proves the first odd jet entry analytically, without relying on its previous interval certificate. It is a genuine positive representation, but only for this particular derivative direction.

### An actual derivative-pulse propagation theorem

Set

\[
h_\pm(u)=(1\pm\alpha u/2)\kappa(u),\qquad
f=h_+',\qquad g=h_-'.
\]

Both \(f\) and \(g\) are Schwartz functions. Differentiation of the convolution of the two Schwartz kernels gives the exact equation

\[
h_+*g=h_+*h_-'=h_-*h_+'=h_-*f. \tag{11a}
\]

With \(F(z)=\int_{\mathbb R}\kappa(u)e^{zu/2}du\), consequently \(g=C_0f\) for the actual boundary multiplier with symbol
\((F-\alpha F')/(F+\alpha F')\) on the Fourier line, interpreted almost everywhere at isolated common zeros. This follows from the Fourier transform of (11a); it does not assume an \(L^2\) preimage of a distributional input.

Expanding the two derivative squares and using (10) gives the analytic energy identity

\[
\boxed{
\int_0^\infty\bigl(|f(u)|^2-|g(u)|^2\bigr)du
=J_{11}
=\alpha\left\|\sqrt{-b'}\,\kappa'\right\|_2^2>0.
} \tag{11b}
\]

For every real cutoff \(c\), the translates
\(f_c(u)=h_+'(u-c)\), \(g_c(u)=h_-'(u-c)\) satisfy the same convolution equation, and their energy difference on \((c,\infty)\) is the same positive number.

This is a rigorous propagation and energy result for these particular actual theta derivative pulses. It gives no conclusion for arbitrary pulses or the zero-free Gaussian probe. In particular, the transform of \(f\) contains the denominator factor \(F+\alpha F'\), so this special pulse does not detect the denominator's zeros in the zero-free-probe criterion.

## 5. Strong squared-variable concavity fails to control the next odd block

Consider the auxiliary kernel

\[
\widetilde\kappa(u)=e^{-u^2}\left(\frac32+\cosh u\right). \tag{12}
\]

This is not the Riemann theta kernel. It is used to test the sufficiency of a proposed general inequality. It is smooth, even, positive, rapidly decreasing, and satisfies all endpoint hypotheses above. Its coefficient \(b\) is smooth, tends to \(1/2\) at infinity, and its derivatives have polynomial decay, so the commutator integrals converge.

### Ordinary strict log concavity

For \(A=3/2\), let \(r(u)=\log(A+\cosh u)\). Then

\[
r''(u)=\frac{A\cosh u+1}{(A+\cosh u)^2}.
\]

As a function of \(q=\cosh u\ge1\), its derivative is

\[
\frac{A^2-Aq-2}{(A+q)^3}<0.
\]

Consequently \(r''(u)\le1/(A+1)=2/5\), and

\[
(\log\widetilde\kappa)''(u)=-2+r''(u)\le-\frac85<0. \tag{13}
\]

In particular \(\widetilde\kappa'(u)<0\) for \(u>0\). Its first two even values are \(\widetilde\kappa(0)=5/2\) and \(\widetilde\kappa''(0)=-4\).

### Strict concavity after the square-root change of variable

For \(x=u^2>0\),

\[
\frac{d^2}{dx^2}\log\widetilde\kappa(\sqrt x)
=\frac{u r''(u)-r'(u)}{4u^3}. \tag{14}
\]

The numerator is strictly negative exactly when

\[
\mathcal A_A(u)=\sinh u\cosh u-u-A(u\cosh u-\sinh u)>0.
\]

For \(u>0\), \(u\cosh u-\sinh u>0\), since it vanishes at zero and has derivative \(u\sinh u>0\). Moreover,

\[
\mathcal A_2(0)=0,\qquad
\mathcal A_2'(u)=2\sinh u(\sinh u-u)>0.
\]

Thus

\[
\mathcal A_{3/2}(u)
=\mathcal A_2(u)+\frac12(u\cosh u-\sinh u)>0.
\]

This proves strict squared-variable concavity for all \(x>0\). The continuous value of the second derivative at zero is also strictly negative, namely \(-1/150\).

### A fixed rational derivative direction is negative

Despite both strict concavity properties, the exact cutoff jet for (12), with \(\alpha=1\), satisfies the following outward-rounded certified enclosures:

| Entry or form | Certified enclosure |
|---|---:|
| \(\widetilde J_{11}\) | \([0.03357395085244677,\ 0.03357395085244678]\) |
| \(\widetilde J_{13}\) | \([-0.16406130346482511,\ -0.16406130346482510]\) |
| \(\widetilde J_{33}\) | \([0.79715264533331741,\ 0.79715264533331742]\) |
| \(\widetilde J_{11}\widetilde J_{33}-\widetilde J_{13}^2\) | \([-0.000152547558258704,\ -0.000152547558258703]\) |
| \(Q(D+\tfrac15D^3)\) | \([-0.000164464720150575,\ -0.000164464720150574]\) |

Hence the odd derivative block indexed by \(1,3\) is indefinite. In particular,

\[
\boxed{Q(D+\tfrac15D^3)<0.} \tag{15}
\]

This is a counterexample to deriving all-orders positivity from the concavity properties already used, even with smoothness, positivity, evenness, rapid decay, and strict ordinary log concavity included. It does not disprove positivity for the actual theta kernel. It shows that its additional structure must enter a successful proof.

The bilateral transform also makes the obstruction transparent:

\[
\int_{\mathbb R}\widetilde\kappa(u)e^{zu/2}du
=\sqrt\pi e^{z^2/16}
\left[\frac32+e^{1/4}\cosh(z/4)\right].
\]

Because \((3/2)e^{-1/4}>1\), it has explicit off-axis zeros. The negative jet certificate above is independent of this transform argument.

## 6. The obstruction persists with theta-type superexponential decay

The Gaussian decay of (12) is not responsible for the failure. Put

\[
R(u)=\cosh u-1-\frac{u^2}{2},\qquad
\kappa_\epsilon(u)=e^{-\epsilon R(u)}\widetilde\kappa(u),
\qquad0<\epsilon\le1. \tag{16}
\]

For every such \(\epsilon\), this kernel is smooth, positive and even. It retains both strict concavity properties:

\[
(\log\kappa_\epsilon)''
=(\log\widetilde\kappa)''-\epsilon(\cosh u-1)<0,
\]

and

\[
\log\kappa_\epsilon(\sqrt x)
=\log\widetilde\kappa(\sqrt x)
-\epsilon\sum_{n=2}^\infty\frac{x^n}{(2n)!}.
\]

The subtracted series has strictly positive second derivative for \(x\ge0\). Also \(\kappa_\epsilon(0)=5/2\) and \(\kappa_\epsilon''(0)=-4\), since \(R\) vanishes to fourth order at zero.

For fixed \(\epsilon>0\) and \(u\ge0\),

\[
0<\kappa_\epsilon(u)
\le\frac52e^\epsilon
\exp\!\left[-(1-\epsilon/2)u^2+u-\frac\epsilon2e^u\right]. \tag{17}
\]

Thus its real tails decay on the same double-exponential scale as the theta kernel. The kernel itself is entire. Its translated cutoff features are holomorphic as \(L^2\)-valued maps on \(|\operatorname{Im}z|<\pi/2\), because on compact substrips the positive real part of \(\cosh(r-z)\) supplies a bound \(e^{-c e^r}\). No equality with the Jacobi theta series is asserted.

### Uniform domination and persistence of the negative jet

For \(u\ge0\), \(R\ge0\) and

\[
|R'|,|R''|,|R'''|\le e^u.
\]

For \(E_\epsilon=e^{-\epsilon R}\), its first three derivatives are

\[
E_\epsilon'=-\epsilon R'E_\epsilon,\quad
E_\epsilon''=(\epsilon^2(R')^2-\epsilon R'')E_\epsilon,
\]

\[
E_\epsilon'''=
[-\epsilon^3(R')^3+3\epsilon^2R'R''-\epsilon R''']E_\epsilon.
\]

Uniformly over \(0\le\epsilon\le1\), they are bounded in absolute value by \(e^u\), \(2e^{2u}\), and \(5e^{3u}\), respectively, while \(|E_\epsilon|\le1\). The explicit Gaussian formulas for \(\widetilde\kappa\), followed by the product rule, therefore give

\[
|\kappa_\epsilon^{(j)}(u)|
\le C(1+u)^3e^{-u^2+4u},\qquad0\le j\le3, \tag{18}
\]

with one constant independent of \(\epsilon\in[0,1]\). Every derivative through order three converges pointwise to its \(\epsilon=0\) value. The jet integrand for the fixed polynomial \(P(D)=D+D^3/5\), using (4), is dominated by

\[
C'(1+u)^7e^{-2u^2+8u},
\]

which is integrable. Dominated convergence proves

\[
Q_\epsilon(D+D^3/5)\longrightarrow Q_0(D+D^3/5)<0.
\]

Consequently there exists \(\epsilon_*>0\) such that

\[
\boxed{Q_\epsilon(D+D^3/5)<0\qquad(0<\epsilon<\epsilon_*).} \tag{19}
\]

This is an existential analytic corollary, not a numerical certificate for a specified positive \(\epsilon\).

For completeness, the entire bilateral transform of each fixed \(\kappa_\epsilon\) has order one. From (17), its maximum modulus satisfies

\[
M_\epsilon(r)\le C_\epsilon(2/\epsilon)^{r/2+1}
\Gamma(r/2+1),
\]

so \(\log M_\epsilon(r)\le(r/2)\log r+O_\epsilon(r)\). On the positive real axis, restrict the positive integral to \(u\in[\log r,\log r+1/r]\). The explicit formula (16) gives the matching lower bound

\[
\log M_\epsilon(r)\ge(r/2)\log r-O_\epsilon(r)-O((\log r)^2).
\]

Thus adding order-one transform growth and double-exponential real decay to the two concavity assumptions still does not imply all-orders cutoff-jet positivity. The actual theta arithmetic remains an additional, unused requirement.

## 7. Exact-form interval certificate

The companion script `theta_jet_concavity_obstruction_20261108.py` evaluates no improper integral numerically. Expand

\[
\widetilde\kappa(u)=\frac32e^{-u^2}
+\frac12e^{-u^2+u}+\frac12e^{-u^2-u}.
\]

For \(b\in\{-1,0,1\}\), generate exact integer-coefficient derivative polynomials by

\[
D^ne^{-u^2+bu}=p_n(u;b)e^{-u^2+bu},\qquad
p_0=1,\quad p_{n+1}=p_n'+(b-2u)p_n.
\]

All entries in the odd \(1,3\) block reduce to moments

\[
M_j(B)=\int_0^\infty u^j e^{-2u^2+Bu}\,du,
\qquad B\in\{-2,-1,0,1,2\},\quad0\le j\le7.
\]

Completing the square and integrating by parts gives exactly

\[
M_0(B)=\frac{\sqrt\pi}{2\sqrt2}e^{B^2/8}
\left[1+\operatorname{erf}\!\left(\frac{B}{2\sqrt2}\right)\right],
\]

\[
M_1(B)=\frac{BM_0(B)+1}{4},\qquad
M_{j+1}(B)=\frac{BM_j(B)+jM_{j-1}(B)}4\quad(j\ge1).
\]

For \(|x|\le1/\sqrt2\), the script encloses the error function using 40 terms of

\[
\operatorname{erf}(x)=\frac2{\sqrt\pi}
\sum_{n=0}^{\infty}\frac{(-1)^nx^{2n+1}}{n!(2n+1)}.
\]

Its absolute terms decrease, so the first omitted absolute term bounds the remainder. All polynomial coefficients and weights are exact rational numbers. `mpmath.iv` at 50 decimal digits encloses \(\pi\), exponentials, square roots, the finite arithmetic, and the final quadratic form. The script asserts positivity of the two diagonal entries, negativity of the odd-block determinant, and reports the negative value for the fixed rational polynomial in (15).

## 8. Precise remaining requirement

Equation (6) identifies the missing estimate concretely. A full proof must control the sum of the bulk and commutator terms, uniformly over polynomial degree and coefficients, using information stronger than \(b'\le0\). The theta heat equation and exact modular identity may constrain those higher terms, but no such order-uniform estimate has been obtained here.

The Gaussian boundary factor, the analytic identity (10), and the explicit failure (15) distinguish what is already positive from the higher-order compensation that still requires proof. They do not rule out other transformations or positive representations of the exact theta kernel.
