# The actual theta odd sector is a Löwner kernel

Research continuation of PR #56, 14 November 2026. This note derives an exact Fourier representation of the Mellin-cutoff parity sectors. It identifies their full positivity as RH-strength already, using the classical one-variable Löwner theorem. This is a structural reduction and an audit of the proposed target, not a proof of the missing positivity or a claim of novelty.

## 1. Setup and the precise operator

Use the normalization

\[
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(u)e^{zu/2}\,du,
\qquad \kappa(u)=\Phi(u/4)>0,
\]

and fix \(\alpha>0\). Let \(K\) be convolution by the real even Schwartz kernel \(\kappa\), and let \(O\) be convolution by the real odd Schwartz kernel

\[
o(u)=\frac{\alpha u}{2}\kappa(u).
\]

Then

\[
A=K+O,\quad A^*=K-O,\quad K^*=K,\quad O^*=-O.
\]

Let \(Q\) be multiplication by \(\mathbf1_{(0,\infty)}\). The actual cutoff-energy operator at zero is

\[
\mathcal H=A^*QA-AQA^*
=2(KQO-OQK).
\tag{1}
\]

If \(S\) is multiplication by \(\operatorname{sgn}u\), the commuting convolution operators satisfy

\[
\mathcal H=KSO-OSK.
\tag{2}
\]

This is the operator whose physical-coordinate kernel is

\[
H_0(u,v)=2\alpha\int_{|(u+v)/2|}^{\infty}
r\kappa\!\left(r-\frac{u-v}{2}\right)
 \kappa\!\left(r+\frac{u-v}{2}\right)dr.
\tag{3}
\]

For any preimage \(a\in L^2(\mathbb R)\),

\[
\|QA^*a\|_2^2-\|QAa\|_2^2=-\langle a,\mathcal Ha\rangle.
\]

The operator is bounded, self-adjoint and real, and commutes with reflection \(Ja(u)=a(-u)\). The parity considered below is this **infinite-dimensional Mellin-coordinate parity**. It is not a finite even matrix or spectral-gap calculation from another representation.

## 2. Unitary Fourier normalization and the complete transformed kernel

Use the unitary transform

\[
(\mathscr Ua)(t)=\frac1{\sqrt{4\pi}}
\int_{\mathbb R}e^{itu/2}a(u)\,du.
\tag{4}
\]

Put

\[
f(t)=F(it)=\xi(1/2+it).
\]

The function \(f\) is real and even on the real axis. A prime on \(f\) below denotes the real spectral derivative \(d/dt\), so

\[
F'(it)=-if'(t).
\]

The convolution multipliers of \(A\) and \(A^*\) are therefore

\[
d(t)=f(t)-i\alpha f'(t),\qquad
\overline{d(t)}=f(t)+i\alpha f'(t).
\]

In this normalization the distribution kernel of \(\mathscr UQ\mathscr U^*\) is

\[
\frac12\delta(t-s)+\frac{i}{2\pi}\operatorname{pv}\frac1{t-s}.
\]

One may obtain it by inserting \(e^{-\varepsilon u}\) in the integral over \(u>0\) and taking the distributional limit. In the difference (1), the delta term cancels exactly. Indeed,

\[
\overline{d(t)}d(s)-d(t)\overline{d(s)}
=2i\alpha\big[f'(t)f(s)-f(t)f'(s)\big].
\]

The numerator vanishes at \(t=s\), removing the principal-value singularity. Thus the full transformed kernel, with Lebesgue measure \(ds\), is

\[
\boxed{
C(t,s)=\frac\alpha\pi
\frac{f(t)f'(s)-f'(t)f(s)}{t-s}.
}
\tag{5}
\]

There is no hidden diagonal or contact correction. Its continuous diagonal is

\[
C(t,t)=\frac\alpha\pi\big[f'(t)^2-f(t)f''(t)\big].
\tag{6}
\]

These identities hold first on Schwartz tests and extend by boundedness. They also agree with the ordinary double Fourier transform of the smooth rapidly decreasing kernel (3).

## 3. Exact odd and even half-line kernels

The Fourier transform preserves the odd and even complex Hilbert subspaces. For real odd physical inputs its Fourier transform is purely imaginary and odd; multiplication by a constant phase does not affect the quadratic form. Thus passage to complex half-line tests introduces no new positivity assumption. Since \(\mathcal H\) is real symmetric, positivity for all real inputs in a parity sector is also equivalent to positivity for their complexifications.

Using unitary half-line embeddings with the factor \(1/\sqrt2\), the transformed parity kernels are

\[
C_-(t,s)=C(t,s)-C(t,-s),\qquad
C_+(t,s)=C(t,s)+C(t,-s),\qquad t,s>0.
\tag{7}
\]

Define the entire function \(G\) by the power series identity

\[
f(t)=G(t^2).
\]

The notation \(G(z)=f(\sqrt z)\) is branch independent because \(f\) is even. Away from zeros of \(G\), put

\[
\varphi(z)=-\frac{G'(z)}{G(z)},\qquad
\psi(z)=z\varphi(z).
\tag{8}
\]

For a real analytic function \(g\), use the divided-difference kernel

\[
L_g(x,y)=\begin{cases}
\dfrac{g(x)-g(y)}{x-y},&x\ne y,\\
g'(x),&x=y.
\end{cases}
\]

Since \(f'(t)/f(t)=2tG'(t^2)/G(t^2)=-2t\varphi(t^2)\), direct simplification of (5)--(7) gives

\[
\boxed{
C_-(t,s)=\frac{4\alpha}{\pi}
ts f(t)f(s)L_\varphi(t^2,s^2),
}
\tag{9}
\]

\[
\boxed{
C_+(t,s)=\frac{4\alpha}{\pi}
f(t)f(s)L_\psi(t^2,s^2).
}
\tag{10}
\]

The identities are initially written where the logarithmic derivatives exist. The original Wronskian expressions extend continuously through all real zeros.

In particular,

\[
C_-(t,t)=\frac\alpha\pi
\left[f'(t)^2-f(t)f''(t)+\frac{f(t)f'(t)}t\right]
=\frac{4\alpha}{\pi}t^2f(t)^2\varphi'(t^2),
\tag{11}
\]

\[
C_+(t,t)=\frac\alpha\pi
\left[f'(t)^2-f(t)f''(t)-\frac{f(t)f'(t)}t\right]
=\frac{4\alpha}{\pi}f(t)^2\psi'(t^2).
\tag{12}
\]

For completeness, changing half-line variable to \(x=t^2\) unitarily means

\[
(Rp)(x)=\frac{p(\sqrt x)}{\sqrt2\,x^{1/4}}.
\]

The resulting odd kernel is exactly

\[
\frac{2\alpha}{\pi}
x^{1/4}G(x)\,y^{1/4}G(y)L_\varphi(x,y),
\tag{13}
\]

and the even kernel has the weights \(x^{-1/4}G(x)\), \(y^{-1/4}G(y)\) and \(L_\psi\). On any compact positive zero-free interval these multiplication weights are bounded and bounded away from zero. Thus this is a genuine local invertible congruence, not a discarded weight.

## 4. Positivity of either full parity sector is already equivalent to RH

Fix any nonempty bounded open interval \(I\subset(0,\infty)\) on which \(G\) has no zero. Such an interval exists near zero because \(G(0)=F(0)>0\). It need not be chosen using an assumed zero theorem.

### Theorem

For the actual completed xi function, the following are equivalent:

1. RH.
2. \(\mathcal H\) is positive semidefinite on all odd \(L^2(\mathbb R)\) preimages.
3. \(\mathcal H\) is positive semidefinite on all even \(L^2(\mathbb R)\) preimages.
4. Every finite matrix \([L_\varphi(x_i,x_j)]\), with distinct \(x_i\in I\), is positive semidefinite.
5. Every finite matrix \([L_\psi(x_i,x_j)]\), with distinct \(x_i\in I\), is positive semidefinite.

The choice of a single fixed positive zero-free interval in (4) or (5) is enough. The quantifier is over **all finite orders and all configurations** in that interval.

### From operator positivity to finite matrices

Suppose (2). Apply the unitary transforms (4), (7), and (13). For any finite set of nodes in \(I\), choose smooth disjoint approximate delta functions centered there. Their quadratic forms converge to the corresponding finite kernel form because the kernel is continuous. Each approximate delta is in \(L^2\); its norm need not remain bounded in the approximation, since the assumed positivity is for all tests. The nonzero diagonal weights in (13) can be absorbed into the coefficients. Therefore every matrix in (4) is positive semidefinite. The even argument gives (3) implies (5).

### From one interval of all-order positivity to zero location

The classical one-variable Löwner theorem says that all these divided-difference matrices being positive is equivalent to an analytic Pick-function extension from \(I\) to the upper half-plane, extending analytically across \(I\). Apply it to \(\varphi\) under (4), or to \(\psi\) under (5). The theorem allows a constant real Pick function as a degenerate case.

Here is why the extension excludes every nonreal zero of \(G\). The original \(\varphi=-G'/G\) is meromorphic in the plane, with a nonremovable pole of residue \(-m\) at each zero of multiplicity \(m\). The Pick extension agrees with it in a complex neighborhood of \(I\), by the identity theorem. The upper half-plane with the discrete zeros removed is connected, so equality continues throughout that punctured domain. At a hypothetical upper-half-plane zero of \(G\), the Pick extension is analytic while \(-G'/G\) has a pole, a contradiction. Conjugation excludes lower-half-plane zeros as well.

For \(\psi=-zG'/G\), multiplication by \(z\) cannot cancel a pole at a nonreal zero; its residue there is \(-mz\ne0\). The same argument applies.

It remains to exclude nonpositive real zeros of \(G\). Positivity of the actual theta kernel supplies this without RH:

\[
F(r)=\int_{\mathbb R}\kappa(u)e^{ru/2}\,du>0
\qquad(r\in\mathbb R).
\]

For \(x=-r^2\le0\),

\[
G(x)=f(ir)=F(-r)>0.
\]

Thus all zeros of \(G\) must be positive real. A centered xi zero \(z\) gives the zero \(-z^2\) of \(G\); positive reality of \(-z^2\) forces \(z\) to be purely imaginary. Hence RH follows. This proves (4) and (5) each imply (1).

### Converse and the exact conditional Gram factorization

Under RH, the centered xi zeros are \(\pm i\gamma_n\), with multiplicities \(\mu_n\). The entire even function \(f\) has order one, so \(G\) has order one half and the genus-zero product

\[
G(z)=G(0)\prod_n\left(1-\frac z{\lambda_n}\right)^{\mu_n},
\qquad \lambda_n=\gamma_n^2>0,
\qquad \sum_n\frac{\mu_n}{\lambda_n}<\infty.
\tag{14}
\]

There is no additional exponential or polynomial term in its logarithmic derivative. Therefore

\[
\varphi(z)=\sum_n\frac{\mu_n}{\lambda_n-z},
\]

\[
L_\varphi(x,y)=\sum_n
\frac{\mu_n}{(\lambda_n-x)(\lambda_n-y)},
\qquad
L_\psi(x,y)=\sum_n
\frac{\mu_n\lambda_n}{(\lambda_n-x)(\lambda_n-y)}.
\tag{15}
\]

These are positive Gram kernels. In the actual spectral variable,

\[
\boxed{
C_-(t,s)=\frac{4\alpha}{\pi}\sum_n\mu_n
\frac{t f(t)}{\lambda_n-t^2}
\frac{s f(s)}{\lambda_n-s^2},
}
\tag{16}
\]

\[
\boxed{
C_+(t,s)=\frac{4\alpha}{\pi}\sum_n\mu_n\lambda_n
\frac{f(t)}{\lambda_n-t^2}
\frac{f(s)}{\lambda_n-s^2}.
}
\tag{17}
\]

The apparent poles in individual features at \(t=\gamma_n\) are removable because \(f\) has the corresponding zero. The sums converge locally uniformly, including after those removable extensions: the tails are controlled by \(\sum\mu_n/\lambda_n\), while only finitely many features meet zeros on any compact interval. Equations (16)--(17) prove positivity on compactly supported spectral tests. Boundedness and density extend it to both full parity subspaces. They also prove (4)--(5), completing the equivalence.

This factorization is **conditional on RH**. Treating its positive real \(\lambda_n\) as already available would assume the target. Its value here is to identify the exact missing positive spectral representation.

## 5. A conditional negative witness in any one positive spectral window

An immediate consequence sharpens the scope of the remaining oscillatory problem. If RH fails, then for every interval \(I\) as above, some finite Löwner matrix for \(\varphi\) has a negative direction. Smooth approximate delta functions at its nodes then give an odd spectral test with negative \(\mathcal H\)-energy. After multiplying its Fourier profile by \(i\), one obtains a real odd physical preimage.

More explicitly, the odd spectral profile can be chosen smooth and compactly supported inside \(\sqrt I\cup(-\sqrt I)\). Its inverse Fourier transform is a real odd Schwartz function. Therefore a hypothetical off-line zero would force a negative odd test **even with Fourier support in an arbitrarily prescribed positive zero-free window and its reflection**.

This is an existence implication, not a discovered negative xi test or a bound on the required matrix order. Concentrating the spectral bumps can spread the physical-coordinate preimage over a very long range. The local spectral window does not remove the global complexity of the physical test.

## 6. Normalization controls

For an even Gaussian kernel, \(f(t)=c e^{-a t^2}\) with \(a>0\), we have \(\varphi=a\) constant. Equation (9) gives \(C_-=0\), agreeing with the rank-one even physical energy kernel. Equation (10) gives the positive rank-one even kernel \((4\alpha a/\pi)f(t)f(s)\).

A useful explicit negative control is

\[
\widetilde\kappa(u)=2e^{-u^2}
+\tfrac12e^{-(u-2)^2}+\tfrac12e^{-(u+2)^2}>0.
\]

Its Fourier trace is

\[
\widetilde f(t)=\sqrt\pi e^{-t^2/16}(2+\cos t).
\]

The associated logarithmic function is

\[
\widetilde\varphi(z)=\frac1{16}
+\frac{\sin\sqrt z}{2\sqrt z(2+\cos\sqrt z)}
=\frac1{16}+\frac16-\frac{z^2}{1080}+O(z^3).
\]

Thus \(\widetilde\varphi'(z)<0\) for sufficiently small positive \(z\), and (11) gives

\[
\widetilde C_-(t,t)=-\frac\alpha{15}t^4+O(t^6)<0.
\]

This positive even rapidly decreasing kernel therefore has a negative odd energy direction. It is not the theta kernel, and no stronger theta concavity is asserted for this control. It checks the Fourier sign and shows why pointwise positivity of the original convolution kernel is inadequate.

## 7. Consequence for the proof strategy

The odd-cone theorem of PR #56 is an unconditional restricted result. Extending it to arbitrary oscillating odd tests is not merely filling a small technical gap: for this actual operator it is already sufficient for RH. The same is true of complete positivity of its even sector.

The exact Fourier reduction suggests two precise types of further work:

1. Prove finite-order or quantitatively restricted Löwner positivity with an explicit order/domain limit, without presenting it as an all-orders theorem.
2. Obtain an unconditional positive spectral representation or a controlled residual bound for \(-G'/G\); any all-orders positive representation must exclude its possible nonreal poles.

It also preserves a narrower alternative: control only the explicit regularized pulse preimages required by the endpoint energy identity. Those form a much smaller family than all odd tests, and the theorem above does not identify their estimate with arbitrary odd-sector positivity.

## Sources

- Jim Agler, John E. McCarthy, N. J. Young, *Operator monotone functions and Löwner functions of several variables*, Annals of Mathematics 176 (2012), 1783--1826, [published PDF](https://annals.math.princeton.edu/wp-content/uploads/annals-v176-n3-p07-p.pdf). The one-variable divided-difference class is defined on p1784; **published Theorem 1.5, p1785**, gives the Pick-extension equivalence used above. The author preprint numbers the same statement Theorem 1.7. The later multivariable corrigendum concerns a different theorem and is not used here.
- [Frozen actual theta cutoff note](https://github.com/judegomila/mathexplorer/blob/69d4049f289217812051188378a0a9f3f061a169/rigorous/theta-bridge-2026-11-08/theta_boundary_energy.md), equations (2.1)--(2.4), fixes \(\mathcal H\), the right-tail orientation, and the convolution normalization.
- [Frozen paired-xi product and residual note](https://github.com/judegomila/mathexplorer/blob/146ce77aa8407e912ed54c73e30664d86936c253/rigorous/theta-fourth-stage-2026-11-09/theta_rational_residual_20261109.md), section 1, fixes the paired Hadamard normalization. The conditional product (14) is its real-zero specialization after squaring the spectral variable.
- [PR #56 annulus/theta comparison](https://github.com/judegomila/mathexplorer/blob/e6a9509df1a454ad69f4705851813b1d043365c5/rigorous/klein-annulus-coupling-2026-11-14/annulus_theta_coupling.md) establishes the distinct unconditional positive-entry/odd-cone result and records the parity distinctions.

All Fourier constants, diagonal limits, parity factors, analytic-continuation steps, and the absence of an extra exponential term are displayed above. No sign of the unknown xi residual has been assumed in the forward reduction.

