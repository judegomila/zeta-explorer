# Odd theta oscillations: a finite high-precision audit and exact diagnostics

14 November 2026. This note advances the finite audit of the actual odd theta cutoff kernel. It also gives an exact positive model and a necessary local moment inequality. The computations do not establish global odd-sector positivity or RH.

## 1. The seven-node sign is resolved numerically

The preceding double-precision audit left the smallest eigenvalue of the normalized odd kernel at the nodes

\[
x_j=0.15j,\qquad j=1,\ldots,7
\]

unresolved. Recomputing every symmetric matrix entry at 45 and 70 decimal digits gives

\[
\lambda_{\min}=4.65841625815219469581900622128845\times10^{-14}.
\]

The maximum normalized entry difference under this precision refinement is
\(5.21\times10^{-46}\); the smallest eigenvalues differ by less than
\(4.41\times10^{-47}\). The next two eigenvalues are approximately
\(2.39065174373419\times10^{-11}\) and
\(1.67863261491220\times10^{-8}\).

The unit weakest vector is approximately

\[
(0.187398929,-0.525956822,0.645028254,-0.471316886,
0.215901367,-0.058187096,0.007132225).
\]

Its alternating signs illustrate the cancellation that the positive-entry theorem does not control. The earlier double-precision value near \(3.7\times10^{-14}\) should be replaced by this multiprecision value when discussing this particular finite matrix.

This is strong finite numerical evidence of a positive sign. It is **not an interval certificate**: the quadrature backend returns numerical error estimates, and precision agreement alone does not prove those estimates.

### Integral and error controls

At heat time zero and \(\alpha=1\), put

\[
c=(x+y)/2,\quad d=(x-y)/2,\quad
a=\sqrt{q+c^2},\quad b=\sqrt{q+d^2}.
\]

The odd entry is evaluated directly as the difference integral

\[
H_-(x,y)=\int_0^\infty
\{\kappa(a-d)\kappa(a+d)-\kappa(b-c)\kappa(b+c)\}\,dq.
\]

This avoids forming the difference of separately rounded matrix entries. The positive-coordinate theta formula is

\[
\kappa(u)=\sum_{n=1}^\infty
\pi n^2(2\pi n^2e^u-3)
e^{5u/4-\pi n^2e^u},\qquad u\ge0,
\]

with even reflection for negative arguments. The script uses eight terms and cuts the integral at \(Q=16\). It splits at \(q=xy\), the possible zero-argument point, as well as at 1 and 4.

Both truncations have analytical bounds, separate from the numerical quadrature error. With \(n_0=N+1\),

\[
r_N=\left(\frac{n_0+1}{n_0}\right)^4e^{-\pi(2n_0+1)},\qquad
R_N=\frac{2\pi^2n_0^4e^{-\pi n_0^2}}{1-r_N},
\]

the omitted theta series is at most \(R_N\), uniformly on the real axis. Indeed, each upper-bounding term
\(2\pi^2n^4e^{9u/4-\pi n^2e^u}\) decreases for \(u\ge0\), and the remaining terms have successive ratio at most \(r_N\).

The uniform envelope

\[
0<\kappa(u)\le4\pi^2e^{9|u|/4-\pi e^{|u|}}
\le B:=4\pi^2e^{-\pi}
\]

follows by bounding the positive theta terms. One elementary justification of the constant is \(n^4\le e^{n^2-1}\) for \(n\ge2\) and \(n^2-1\ge3(n-1)\), which bounds the normalized sum by a geometric series smaller than 2. The error from replacing both products by the eight-term series on \([0,Q]\) is therefore at most

\[
4QB R_N<4.325\times10^{-104}.
\]

For the sampled nodes, \(Q>xy\), so all four positive-tail arguments can be used without reflection. If \(A=\sqrt Q\) and \(c_Q=2\pi e^A-9/2\), an absolute bound for the omitted difference integral is

\[
64\pi^4e^{(9/2)A-2\pi e^A}
\left(\frac{A}{c_Q}+\frac1{c_Q^2}\right)
<5.012\times10^{-140}.
\]

To obtain it, bound both products by
\(16\pi^4e^{(9/2)\sqrt q-2\pi e^{\sqrt q}}\), substitute \(q=a^2\), and use the tangent exponential envelope with slope \(-c_Q\).

The maximum mpmath quadrature estimate at 70 digits was about \(10^{-73}\) before normalization. It remains a numerical estimate, not a rigorous enclosure. The explicit series/tail bounds rule out those two truncations as explanations for a \(10^{-14}\) finite eigenvalue, but they do not convert the quadrature into interval arithmetic.

## 2. An exact positive factorization for quartic exponential controls

There is an exact factorization for the class

\[
\kappa(u)=e^{-b u^2-a u^4},\qquad a>0,\quad b\in\mathbb R.
\]

This is a positive control, not an assertion that the theta kernel belongs to this class.

After substituting \(q=t^2-m^2\) in the actual cutoff kernel,

\[
H_0(x,y)=\alpha\kappa(x)\kappa(y)
\int_0^\infty e^{-2aq^2-2bq}
e^{-4aqx^2}e^{-4aqy^2}e^{4aqxy}\,dq.
\]

The identity follows from the exact fourth-power sum

\[
(\sqrt{q+m^2}-d)^4+(\sqrt{q+m^2}+d)^4
=x^4+y^4+2q^2+4q(x^2+y^2-xy).
\]

Thus

\[
H_-(x,y)=2\alpha\kappa(x)\kappa(y)
\int_0^\infty e^{-2aq^2-2bq}
e^{-4aqx^2}e^{-4aqy^2}\sinh(4aqxy)\,dq.
\]

Expanding the hyperbolic sine gives positive Gram features:

\[
H_-(x,y)=2\alpha\sum_{k=0}^\infty\int_0^\infty
e^{-2aq^2-2bq}\frac{(4aq)^{2k+1}}{(2k+1)!}
\phi_{q,k}(x)\phi_{q,k}(y)\,dq,
\]

\[
\phi_{q,k}(x)=\kappa(x)e^{-4aqx^2}x^{2k+1}.
\]

Consequently this control's odd quadratic form is nonnegative for **arbitrary** complex or oscillatory tests. The corresponding expansion of the ordinary exponential gives the full kernel a positive Gram factorization as well. Rapid decay and boundedness extend the compact-test identity to the natural \(L^2\) domain. The factorization is valid for any finite real \(b\), because \(a>0\) supplies the required decay.

At \(a=0,b>0\), the Gaussian cutoff kernel has rank one and the odd kernel vanishes. The quartic term is therefore the first exact positive control that supplies nonzero odd energy through all the odd-power features.

The companion factorization note gives a polynomial-Gaussian counterexample despite strict convexity of \(-\log\kappa(\sqrt t)\). Taken together, these controls show the distinction: the positive feature expansion above uses more structure than that convexity alone.

## 3. A scalar necessary condition for the first oscillatory directions

Assume an even, sufficiently smooth rapidly decaying kernel, and define

\[
I_j=\int_0^\infty r[\kappa^{(j)}(r)]^2dr,
\qquad k_0=\kappa(0),\quad k_2=\kappa''(0).
\]

The odd Taylor coefficient matrix in the first two monomials \((x,x^3)\) is

\[
\boxed{
J=\alpha\begin{pmatrix}
4I_1-2k_0^2&-(2I_2+k_0k_2)/3\\
-(2I_2+k_0k_2)/3&I_3/9-k_2^2/6
\end{pmatrix}.}
\]

Here the coefficients multiply \(xy\), \(x^3y+xy^3\), and \(x^3y^3\); other higher terms are present in the full kernel.

### Derivation

Differentiate the exact cutoff representation

\[
H_0(u,v)=\alpha\int_0^\infty
(2r-u-v)\kappa(r-u)\kappa(r-v)dr.
\]

For odd positive integers \(m,n\), its \(u^mv^n\) coefficient is

\[
\frac\alpha{m!n!}\int_0^\infty
\bigl[2r\kappa^{(m)}\kappa^{(n)}
+m\kappa^{(m-1)}\kappa^{(n)}
+n\kappa^{(m)}\kappa^{(n-1)}\bigr]dr.
\]

The odd half-line difference doubles this coefficient. Integration by parts, using evenness at zero and decay at infinity, then gives the displayed matrix for \((m,n)=(1,1),(1,3),(3,3)\).

If the odd kernel is positive semidefinite, its derivative Gram matrices must be positive semidefinite: these are limits of matrices tested on finite differences. More explicitly, for two small positive nodes \(x=\varepsilon a,y=\varepsilon b\), \(a\ne b\), the determinant has leading term

\[
\varepsilon^8 a^2b^2(a^2-b^2)^2\det J.
\]

Thus a negative \(\det J\) produces an actual negative two-node odd test near the origin. A necessary scalar inequality is

\[
\boxed{
(4I_1-2k_0^2)(I_3/9-k_2^2/6)
\ge\frac{(2I_2+k_0k_2)^2}{9}.}
\]

This does not follow merely from positive kernel entries. It tests the first cancellations between two different odd profiles.

### Actual theta value and exact negative control

For theta, the 70-digit diagnostic gives

\[
J\approx\begin{pmatrix}
0.02176460436417&-0.06305706034996\\
-0.06305706034996&0.18671831971069
\end{pmatrix},
\]

\[
\det J\approx8.76574960678654\times10^{-5},\qquad
\frac{\det J}{J_{11}J_{22}}\approx0.02157006001401.
\]

These particular decimal values are numerical diagnostics. The separate interval calculation in section 4 certifies the strict positive sign of this local determinant; it does not certify all odd directions. The derivative integrals use the explicit recurrence
\(P_{j+1}(v)=(1/4-v)P_j(v)+vP_j'(v)\), \(P_0(v)=2v^2-3v\), in
\(\kappa^{(j)}(u)=e^{u/4}\sum_nP_j(\pi n^2e^u)e^{-\pi n^2e^u}\).

For the companion exact control

\[
\kappa(u)=(1+u^2/10+u^4/300)e^{-u^2},
\]

direct Gaussian moment integration instead gives

\[
J=\begin{pmatrix}121/30000&-37/10000\\-37/10000&61/18000\end{pmatrix},
\qquad\det J=-29/1350000000<0.
\]

This independently verifies the companion factorization's negative determinant through a different calculation.

## 4. A targeted interval certificate and local two-node theorem

The first \(2\times2\) jet has now also been enclosed using outward-rounded interval arithmetic. This calculation does not use mpmath's adaptive quadrature or its error estimates. It uses interval midpoint values and an analytical midpoint error bound on each subinterval.

At 40 decimal digits, with four theta terms, 512 subintervals on \([0,3]\), and the explicit omitted-series and infinite-tail bounds below, the enclosures are

\[
J_{11}\in[0.0217486262211940,\ 0.0217805822064087],
\]

\[
J_{13}\in[-0.0630932159055948,\ -0.0630292473604319],
\]

\[
J_{33}\in[0.1866087755127211,\ 0.1868278626782592],
\]

and, using the unrounded interval values in the calculation,

\[
\boxed{\det J\in
[0.00007773061491088038,\ 0.00009653359868893574]>0.}
\]

The displayed bounds above have been widened outward. The exact interval output is retained in `theta-odd-jet-interval.json`. The certificate assumes the correctness of mpmath 1.3.0's outward-rounded interval operations and the host Python runtime; it is not a formal proof-assistant verification. The implementation uses only interval arithmetic, exponentials and the interval value of \(\pi\), with polynomial coefficients supplied as exact rational numbers.

### Midpoint integration bound

For \(f_j(r)=r[\kappa^{(j)}(r)]^2\), the exact second derivative is

\[
f_j''(r)=4\kappa^{(j)}(r)\kappa^{(j+1)}(r)
+2r\{[\kappa^{(j+1)}(r)]^2+
\kappa^{(j)}(r)\kappa^{(j+2)}(r)\}.
\]

On a subinterval of width \(h\), an interval evaluation of this expression supplies a bound \(M\) on \(|f_j''|\). The midpoint error is at most \(Mh^3/24\). The script sums the midpoint intervals plus these symmetric error intervals. Derivatives through order five are generated using the exact polynomial recurrence stated above.

### Derivative-series and infinite-tail bounds

Let \(C_j\) be the sum of the absolute coefficients of \(P_j\). Since its degree is \(j+2\), for \(v\ge1\),

\[
|P_j(v)|\le C_jv^{j+2}.
\]

For \(N=4\), the omitted derivative series on every \(u\ge0\) is bounded by

\[
T_{j,N}=\frac{C_j\pi^{j+2}(N+1)^{2j+4}
e^{-\pi(N+1)^2}}{1-r_{j,N}},
\]

\[
r_{j,N}=\left(\frac{N+2}{N+1}\right)^{2j+4}
e^{-\pi(2N+3)}.
\]

The upper-envelope terms decrease with \(u\) because
\(\pi(N+1)^2>j+9/4\), for all \(0\le j\le5\). Their successive ratios decrease in the summation index. Each derivative interval includes the full symmetric error \([-T_{j,N},T_{j,N}]\). The largest of these six errors is below \(3.740\times10^{-18}\), for the fifth derivative.

For \(u\ge R=3\), successive summation envelopes have ratio at most
\(2^{2j+4}e^{-3\pi e^R}<1/2\). Therefore

\[
|\kappa^{(j)}(u)|\le
2C_j\pi^{j+2}e^{(j+9/4)u-\pi e^u}.
\]

Put \(p_j=2j+9/2\) and \(\beta_j=2\pi e^R-p_j>0\). The full omitted moment is at most

\[
(2C_j\pi^{j+2})^2e^{p_jR-2\pi e^R}
\left(\frac R{\beta_j}+\frac1{\beta_j^2}\right).
\]

For \(j=1,2,3\), these bounds are respectively below
\(7.761\times10^{-43}\), \(3.056\times10^{-38}\), and
\(1.580\times10^{-33}\). Thus the entire infinite integration domain and infinite theta series are accounted for in the jet enclosure.

### Consequence: all sufficiently small two-node odd matrices are positive

The actual theta cutoff kernel is analytic near the origin. For complex arguments in a sufficiently small neighborhood of the real axis, the theta series converges locally uniformly because the real part of its exponential argument remains positive. For small complex node parameters, the fixed-lower-limit cutoff integral over `r>=0` has a common integrable double-exponential envelope as `r` tends to infinity. Local uniform convergence therefore permits holomorphic parameter integration. This establishes analyticity, rather than only differentiability, of the kernel near the origin. The odd kernel consequently has the local form

\[
H_-(x,y)=xy\,G(x^2,y^2),
\]

where \(G\) is symmetric and analytic, with

\[
G(X,Y)=a+b(X+Y)+cXY+d(X^2+Y^2)+\cdots,
\]

and \(a=J_{11},b=J_{13},c=J_{33}\). Define

\[
D(X,Y)=G(X,X)G(Y,Y)-G(X,Y)^2.
\]

Symmetry and vanishing on the diagonal show that \(D/(X-Y)^2\) extends analytically across the diagonal. Its value at \((0,0)\) is

\[
ac-b^2=\det J>0.
\]

The separate \(d(X^2+Y^2)\) terms cancel from this leading coefficient. Since also \(a>0\), continuity proves that there is some \(\delta>0\) such that

\[
\boxed{
\begin{pmatrix}H_-(x,x)&H_-(x,y)\\H_-(y,x)&H_-(y,y)\end{pmatrix}
\succ0
\quad(0<x\ne y<\delta).}
\]

This permits arbitrary complex coefficients on two sufficiently small odd feature pairs, including coefficients with opposite signs. It is a local two-node result in the odd sector, equivalently a restricted four-center antisymmetric configuration for the full cutoff kernel. Repeated nodes or a zero node are excluded from strictness. No explicit numerical radius \(\delta\) is claimed: obtaining one requires a controlled analytic remainder bound. The statement is still far weaker than positivity at arbitrary node count or on all half-line functions.

## Reproduction

Run `python3 theta-odd-high-precision.py` for the seven-node computation and its explicit truncation bounds. Run `python3 theta-odd-confluent.py` for the high-precision derivative-moment diagnostic. Run `python3 theta-odd-jet-interval.py` for the interval jet certificate. They require mpmath 1.3.0. JSON files retain the raw and normalized matrices, eigenvalues, precision settings, and error-scope labels.

The theta definitions and the distinction between entry positivity and quadratic-form positivity are those of the frozen PR #56 checkpoint. The exact quartic factorization and the local-jet formula above are direct derivations. No assertion about a complete theta Gram factorization or the unresolved global bridge estimate is implicit.
