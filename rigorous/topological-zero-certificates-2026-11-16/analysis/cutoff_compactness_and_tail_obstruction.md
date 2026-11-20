# The exact odd cutoff operator is compact: implications for spectral certificates

Date: 2026-11-16. Status: proved structural lemma from the audited PR56 kernel. No RH proof is claimed.

## 1. Exact kernel and a useful cancellation identity

The audited kernel is

\[
H_0(x,y)=\alpha\int_0^\infty(2r-x-y)\kappa(r-x)\kappa(r-y)\,dr,
\quad
H_-(x,y)=H_0(x,y)-H_0(x,-y),
\]

where \(\kappa\) is the exact real even theta kernel. Put
\(a=(x+y)/2\), \(d=(x-y)/2\), and translate \(u=r-a\). Since
\(\kappa(u-d)\kappa(u+d)\) is even in \(u\), the odd part of the integration interval cancels exactly:

\[
\boxed{
H_0(x,y)=\alpha\int_{|x+y|/2}^\infty
2u\kappa\!\left(u-\frac{x-y}{2}\right)
\kappa\!\left(u+\frac{x-y}{2}\right)du.
}
\tag{1}
\]

This identity is valid for all real \(x,y\); no positivity theorem is used. It is also the physical-kernel formula in the frozen operator-duality note, Eq. (3); the change of variables is repeated here to make the estimates self-contained. In particular, for \(x,y\ge0\),

\[
H_0(x,y)=\alpha\int_0^\infty
(x+y+2v)\kappa(x+v)\kappa(y+v)\,dv.
\tag{2}
\]

For positive \(\alpha\), the full kernel \(H_0\) is pointwise nonnegative. Pointwise positivity does not imply positive-semidefinite Gram matrices or operator positivity.

## 2. Hilbert-Schmidt bound

Let

\[
M=\sup_{v\in\mathbb R}|\kappa(v)|<\infty,
\qquad
F(r)=\int_r^\infty v|\kappa(v)|\,dv\quad(r\ge0).
\]

For \(x,y\ge0\), one of the arguments of \(\kappa\) in (1) has absolute value at least \(\max(x,y)\), both for \(H_0(x,y)\) and for \(H_0(x,-y)\). More explicitly, set \(v=u+|d|\); then the lower endpoint is \(|a|+|d|=\max(x,y)\), and \(u\le v\). Bound the other factor by \(M\). This proves

\[
|H_0(x,\pm y)|\le2|\alpha|M F(\max(x,y)),
\]

and hence

\[
|H_-(x,y)|\le4|\alpha|M F(\max(x,y)).
\tag{3}
\]

Because the exact theta kernel has double-exponential decay, \(\int_0^\infty rF(r)^2dr<\infty\). Splitting the first quadrant into \(x\ge y\) and \(y\ge x\) gives

\[
\boxed{
\|H_-\|_{\mathrm{HS}}^2
\le32\alpha^2M^2\int_0^\infty rF(r)^2\,dr<\infty.
}
\tag{4}
\]

Thus the integral operator on \(L^2(0,\infty)\) is Hilbert-Schmidt and compact, independently of RH or any signed-kernel positivity assertion.

## 3. Explicit spatial tail error

Let \(P_R\) denote multiplication by the indicator of \([0,R]\). It has infinite rank; it is a spatial cutoff, not yet a finite matrix projection. Equation (3) gives

\[
\boxed{
\|H_--P_RH_-P_R\|_{\mathrm{HS}}^2
\le32\alpha^2M^2\int_R^\infty rF(r)^2\,dr.
}
\tag{5}
\]

In the PR49/PR56 normalizations, \(\kappa(v)=\Phi(v/4)\). Let

\[
q_0=e^{-3\pi},\qquad
C_\Phi=2\pi^2\frac{1+11q_0+11q_0^2+q_0^3}{(1-q_0)^5}.
\]

The PR49 envelope becomes

\[
0<\kappa(v)\le C_\Phi e^{9v/4-\pi e^v}\quad(v\ge0).
\tag{6}
\]

It also yields \(M\le C_\Phi e^{-\pi}\), since \(9v/4-\pi e^v\) is strictly decreasing for \(v\ge0\).

For \(R>0\), put

\[
a_R=\pi e^R-\frac94-\frac1R,
\qquad
b_R=2\pi e^R-\frac92-\frac3R.
\]

If \(a_R,b_R>0\), logarithmic concavity of the scalar envelopes gives

\[
F(r)\le\frac{C_\Phi r}{a_r}e^{9r/4-\pi e^r}\quad(r\ge R),
\]

and, because \(a_r\) increases with \(r\),

\[
\boxed{
\|H_--P_RH_-P_R\|_{\mathrm{HS}}^2
\le
\frac{32\alpha^2M^2C_\Phi^2R^3}{a_R^2b_R}
\exp\left(\frac92R-2\pi e^R\right).
}
\tag{7}
\]

To verify the last integral step, use the concave exponent
\(h(r)=3\log r+(9/2)r-2\pi e^r\), whose derivative at \(R\) is \(-b_R\). Its integral is bounded by \(e^{h(R)}/b_R\).

Equation (7) supplies a rigorous absolute norm tail bound. A finite matrix approximation still needs a separate, justified discretization error on \([0,R]^2\).

## 4. A decisive obstruction to a naive coercive tail certificate

A compact self-adjoint operator \(K\) on an infinite-dimensional Hilbert space cannot satisfy

\[
QKQ\succeq dQ,\qquad d>0,
\tag{8}
\]

on any infinite-dimensional closed tail subspace \(QH\). Indeed, choose an orthonormal sequence \(e_n\) in that subspace. It converges weakly to zero, so compactness implies \(\|Ke_n\|\to0\). Then \(\langle e_n,Ke_n\rangle\to0\), contradicting (8).

Therefore the raw exact odd cutoff operator cannot have the positive constant tail gap required by a naive finite-block-plus-coercive-tail argument. It also is not Fredholm at spectral value zero on this infinite-dimensional space, so the usual zero-level spectral-flow construction cannot simply be applied to it.

This does not rule out a relative or preconditioned certificate. It identifies an additional theorem that such a route needs: construct a justified positive reference form and prove the appropriate relative bound on common domains. One cannot assume bounded inverse square roots of compact diagonal blocks.

Absolute truncation convergence proves only an approximate lower bound. If a finite approximation is positive and the operator error is at most \(\epsilon\), the immediate conclusion is \(K\succeq-\epsilon I\), not \(K\succeq0\). Very small negative modes can remain beyond any chosen finite certificate.

For an elementary illustration of why positive compact operators do not have an open positivity neighborhood, the norm-continuous compact diagonal path

\[
K_t=\operatorname{diag}\left(\frac1{n^2}-\frac{t}{n}\right)_{n\ge1}
\]

is strictly positive at \(t=0\), but has infinitely many negative eigenvalues for every \(t>0\). Crossings accumulate at the starting parameter. This is not a model of the actual theta operator; it demonstrates the invalidity of transferring positivity merely by continuity in the compact setting.

## 5. Implication for the proof attack

The spatial tail is quantitatively tiny and can be enclosed explicitly by (7). The remaining difficulty is relative sign, not uncontrolled spatial magnitude. A productive next target would control the tail relative to the vanishing positive energies, or exploit an exact factorization that survives the compact spectrum accumulating at zero. The audited all-order Taylor criterion still requires every order; (7) does not convert it into a finite positivity test.

Source: `../reference/pr56-local-to-global.md`, Eq. (9), together with the theta envelope in `../reference/pr49-collective-certificate.md`, Eq. (7.3) and its preceding definition. The arguments (1)–(8) are derived here.
