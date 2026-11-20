# Exact square energy and compensated prime forcing for a Schur residual

Research continuation, 9 November 2026. This note derives an exact energy
identity for the finite exponential residual in the xi Pick induction.
The gamma contribution is an explicit convergent sum of squares. The
remaining contribution is expressed using a single compensated prime
count, keeping the pole and prime terms together. The identity is
unconditional on the specified domain; its total sign at arbitrary order remains unproved.

## 1. Domain and the actual residual

Write

\[
F(w)=\xi(1/2+w),\qquad L(w)=F'(w)/F(w),\qquad h=1/2.
\]

Throughout, the rates \(x_j\) are real and greater than \(h\), and

\[
v(t)=\sum_{j=1}^m b_j e^{-x_jt},\qquad
r(t)=-v'(t)=\sum_{j=1}^m b_jx_j e^{-x_jt}.
\tag{1}
\]

The coefficients may be complex. Define the finite quadratic form

\[
Q_L(v)=\sum_{i,j}b_i\overline{b_j}
\frac{L(x_i)+L(x_j)}{x_i+x_j}.
\tag{2}
\]

The exact arithmetic-to-Pick bridge from the previous checkpoint gives
\(Q_L(v)=\mathfrak b(r,r)\), where \(\mathfrak b\) is the Suzuki screw
kernel form. No global boundedness or positivity assumption on that
kernel is required here.

For the next Schur step, take the old-node coefficients to be
\(-P_N^{-1}p(x)\) and the new-node coefficient to be 1. Then

\[
\boxed{\Delta_N(x)=Q_L(v).}
\tag{3}
\]

All the formulas below therefore evaluate the actual Schur defect, not a
different test form. They also apply to arbitrary finite exponential
combinations in this domain.

## 2. The exact gamma and arithmetic split

Set

\[
\lambda_k=2k+5/2,\qquad
c_0=\frac{\log\pi-\psi(5/4)}2,
\qquad c_n=\frac{\Lambda(n)}{\sqrt n},\quad \ell_n=\log n.
\]

The anchored split established in the preceding gamma note is

\[
\begin{aligned}
L(p)&=A(p)+\frac1{p-h}-c_0-
\sum_{n\ge2}c_n e^{-p\ell_n},\qquad \Re p>h,\\
A(p)&=\sum_{k\ge0}\frac{p}{\lambda_k(\lambda_k+p)}.
\end{aligned}
\tag{4}
\]

In particular, all the arithmetic series used below are absolutely
convergent at the specified rates. The separated pole in (4) is only
used on this domain. Across \(p=h\), the regular object is the combined
logarithmic derivative of \((s-1)\zeta(s)\); the separated terms must not
be continued independently.

Introduce backward convolution states

\[
\begin{aligned}
J_\lambda(t)&=\int_0^\infty e^{-\lambda s}v(t+s)\,ds
=\sum_j\frac{b_j e^{-x_jt}}{x_j+\lambda},\\
H_\lambda(t)&=v(t)-\lambda J_\lambda(t)
=\sum_j\frac{b_jx_j e^{-x_jt}}{x_j+\lambda}.
\end{aligned}
\tag{5}
\]

These are well defined for \(\lambda>-x_{\min}\), including all the
\(\lambda_k\) and \(\lambda=-h\). Also \(J_\lambda'=-H_\lambda\).

## 3. A convergent square factorization of the gamma Pick energy

For \(f_\lambda(p)=p/[\lambda(\lambda+p)]\), elementary algebra gives

\[
\frac{f_\lambda(p)+f_\lambda(q)}{p+q}
=\frac1{(p+\lambda)(q+\lambda)}
\left(1+\frac{2pq}{\lambda(p+q)}\right).
\tag{6}
\]

The first term is a rank-one square. Using
\(1/(p+q)=\int_0^\infty e^{-(p+q)t}\,dt\) in the second term gives

\[
\boxed{
E_\gamma(v):=Q_A(v)
=\sum_{k\ge0}\left[
|J_{\lambda_k}(0)|^2+
\frac2{\lambda_k}\|H_{\lambda_k}\|_{L^2(0,\infty)}^2
\right]\ge0.
}
\tag{7}
\]

This is the precise square energy for the finite exponential residual.
It is the backward-time counterpart of the passive gamma realization in
the earlier note. Boundary storage at time zero is part of the formula;
it cannot be discarded.

For completeness, put
\(B=\sum_j|b_j|\) and \(B_1=\sum_j|b_j|x_j\). Then

\[
|J_\lambda(0)|^2\le B^2/\lambda^2,
\qquad
\|H_\lambda\|_2^2\le
\frac{B_1^2}{2x_{\min}\lambda^2}\quad(\lambda>0).
\tag{8}
\]

Thus the series in (7) converges absolutely. These estimates also justify
interchanging the finite coefficient sums, the gamma series, and the
integral. The gamma tail after \(K\) modes is bounded above by
\(B^2\sum_{k\ge K}\lambda_k^{-2}
+(B_1^2/x_{\min})\sum_{k\ge K}\lambda_k^{-3}\), and is nonnegative.

## 4. The complete energy identity

Define the one-sided autocorrelation

\[
C_v(\ell)=\int_0^\infty v(t+\ell)\overline{v(t)}\,dt
=\sum_{i,j}\frac{b_i\overline{b_j}}{x_i+x_j}e^{-x_i\ell}.
\tag{9}
\]

The pole contribution has the exact factorization

\[
\frac{1/(p-h)+1/(q-h)}{p+q}
=\frac1{(p-h)(q-h)}
-\frac{2h}{(p-h)(q-h)(p+q)}.
\tag{10}
\]

Consequently

\[
Q_{1/(p-h)}(v)=|J_{-h}(0)|^2-2h\|J_{-h}\|_2^2
=2\Re\int_0^\infty e^{h\ell}C_v(\ell)\,d\ell.
\tag{11}
\]

The constant and each prime-power term contribute

\[
Q_{-c_0}(v)=-2c_0\|v\|_2^2,
\qquad
Q_{-c_ne^{-p\ell_n}}(v)=-2c_n\Re C_v(\ell_n).
\tag{12}
\]

Combining (7), (11), and (12), with \(2h=1\), proves

\[
\boxed{
\begin{aligned}
Q_L(v)={}&E_\gamma(v)
+|J_{-1/2}(0)|^2-\|J_{-1/2}\|_2^2
-2c_0\|v\|_2^2\\
&-2\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}
\Re C_v(\log n).
\end{aligned}}
\tag{13}
\]

This is an explicit exact energy decomposition, not a positivity result
for its sum. The pole contribution itself has a negative norm term. The
prime contributions are signed autocorrelation terms.

To audit the pole boundary sign directly, (5) gives
\(J_{-h}'=-v-hJ_{-h}\). Hence

\[
2\Re\int_0^\infty J_{-h}\overline v\,dt
=|J_{-h}(0)|^2-2h\|J_{-h}\|_2^2,
\]

with the boundary at infinity equal to zero. This agrees with (10).

## 5. Preserve the pole-prime cancellation using one compensated count

Define the right-continuous real function

\[
\boxed{
M(\ell)=2(e^{\ell/2}-1)
-\sum_{n\le e^\ell}\frac{\Lambda(n)}{\sqrt n}.
}
\tag{14}
\]

Its Stieltjes derivative on the positive half-line is

\[
dM(\ell)=e^{\ell/2}\,d\ell-
\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}\delta_{\log n}(d\ell).
\tag{15}
\]

The pole and the prime sum in (13) combine exactly into
\(2\Re\int C_v\,dM\). Integration by parts then yields the main
cancellation-preserving formula:

\[
\boxed{
Q_L(v)=E_\gamma(v)-2c_0\|v\|_2^2
-2\Re\int_0^\infty M(\ell)C_v'(\ell)\,d\ell.
}
\tag{16}
\]

Here \(M(0)=0\). The elementary bound \(\Lambda(n)\le\log n\) gives
\(M(\ell)=O((1+\ell)e^{\ell/2})\). Meanwhile,

\[
|C_v(\ell)|\le\frac{B^2}{2x_{\min}}e^{-x_{\min}\ell},\qquad
|C_v'(\ell)|\le\frac{BB_1}{2x_{\min}}e^{-x_{\min}\ell}.
\tag{17}
\]

Because \(x_{\min}>1/2\), both integrals converge absolutely, and the
boundary product \(M(\ell)C_v(\ell)\) vanishes at infinity. This proves
the improper Stieltjes integration by parts without an RH assumption or
a prime number theorem error estimate.

For a computable truncation of (13), the absolute prime-tail error beyond
\(n=N\ge3\) is at most

\[
\frac{B^2}{x_{\min}}N^{1-\sigma}
\left(\frac{\log N}{\sigma-1}+\frac1{(\sigma-1)^2}\right),
\qquad \sigma=x_{\min}+1/2>1.
\tag{18}
\]

This follows by bounding \(\Lambda(n)\) by \(\log n\) and comparing the
decreasing tail with its integral. It controls fixed finite tests. It
does not give a uniform induction margin as the number of nodes grows.

## 6. What the Schur constraints do and do not provide

For the actual residual, algebraic orthogonality says

\[
\sum_j b_j\frac{L(x_j)+L(a_i)}{x_j+a_i}=0
\tag{19}
\]

at every old node \(a_i\). Equivalently, with the explicit rational
functions

\[
V(z)=\sum_j\frac{b_j}{z+x_j},\qquad
D(z)=\sum_j\frac{b_jL(x_j)}{z+x_j},
\]

the constraints are \(D(a_i)+L(a_i)V(a_i)=0\).
They do not state \(v(0)=0\), and no zero-boundary condition on \(v\)
has been inserted in (7), (13), or (16).

For every finite exponential combination,

\[
\Re C_v'(0)=-|v(0)|^2/2,
\tag{20}
\]

but this pointwise boundary fact is not a sign theorem for
\(\Re C_v'(\ell)\) at positive lags. For example,
\(v(t)=e^{-t}-2e^{-2t}\) has

\[
C_v(\ell)=-\tfrac16e^{-\ell}+\tfrac13e^{-2\ell},
\qquad
C_v'(\ell)=\tfrac16e^{-\ell}-\tfrac23e^{-2\ell}.
\]

Its autocorrelation is negative after \(\log2\), and its derivative is
positive after \(\log4\). This example is a warning about the unrestricted
test class; it is not claimed to be an actual xi Schur residual.

The compensated count itself is not nonnegative. The companion integer
arithmetic certificate gives the exact bound
\(M(\log24137)<-35889296433/10^{12}<0\); near zero it is positive.
Thus (16) is not an integral of a positive weight against a universally
positive autocorrelation derivative.

The exact remaining inequality for each orthogonal residual is

\[
\boxed{
2c_0\|v\|_2^2+
2\Re\int_0^\infty M(\ell)C_v'(\ell)\,d\ell
\ \le\ E_\gamma(v).
}
\tag{21}
\]

Equation (21) is a concrete domination target for the arithmetic term on
the recursively constrained residuals. Establishing it uniformly is
still the open step. Neither the explicit square factorization nor the
compensated prime formula proves that domination. The accompanying
[three-node theorem](theta_three_node_curvature_20261109.md) proves
\(Q_L(v)>0\) for every nonzero combination with at most three distinct
rates. Therefore (21) holds strictly throughout that test class, including
the first three ladder stages. Its arbitrary-order extension remains open.

## Sources and normalization

- Previous checkpoint: [gamma note](https://github.com/judegomila/mathexplorer/blob/7e6d01d9dae527a5785ed31d770cd4b8acd38e17/rigorous/theta-interpolation-2026-11-08/theta_archimedean_passivity_20261108.md), equations
  (1.3), (1.4), and (2.1), for the anchored split.
- Previous checkpoint: [exact Pick bridge](https://github.com/judegomila/mathexplorer/blob/7e6d01d9dae527a5785ed31d770cd4b8acd38e17/rigorous/theta-interpolation-2026-11-08/theta_exact_pick_bridge_20261108.md), equations
  (4) and (7), for the exact relation to the Suzuki form and Schur defect.
- Masatoshi Suzuki, *Aspects of the screw function corresponding to the
  Riemann zeta-function*, JLMS 108 (2023), 1448–1487, Theorem 1.1.
  https://doi.org/10.1112/jlms.12785 ; https://arxiv.org/abs/2206.03682

The new identities in this note follow from finite exponential algebra
and the absolute-convergence bounds displayed above. No normalization
error was found in the preceding arithmetic-to-Pick bridge. No novelty
claim, all-orders positivity claim, or RH proof is made.
