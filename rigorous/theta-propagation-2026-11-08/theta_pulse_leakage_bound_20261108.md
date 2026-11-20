# An unconditional upper bound for the actual theta pulse leakage

## Result and scope

For the active choice \(\alpha=1\), let

\[
F(z)=\xi(1/2+z),\qquad
S(it)=\frac{F(it)-F'(it)}{F(it)+F'(it)},
\]

and let \(C_0\) be the actual ordinary-\(L^2\) Fourier multiplier with symbol
\(S(it)\). Use the Fourier convention
\(\widehat f(t)=\int f(u)e^{itu/2}\,du\). The quotient has modulus one almost
everywhere on the imaginary axis, independently of RH, so \(C_0\) is unitary.
Set

\[
f_0=\mathbf1_{[0,1]},\qquad g_0=C_0f_0,
\qquad Q_1=\mathbf1_{(1,\infty)}.
\]

**Computer-assisted theorem, with explicit analytical error bounds:**

\[
\boxed{\quad
0\le\|Q_1g_0\|_2^2
<0.124030166<\frac18.
\quad}
\]

Thus more than \(7/8\) of the actual output energy lies in \(( -\infty,1]\).
The full output energy is one, by unitarity. This is an upper bound on a
positive quantity; it does not prove that the quantity is nonzero.

This result does not establish zero leakage, exponential integrability,
causality, or RH. It uses no unproved positive-semidefiniteness assertion for
the cutoff kernel. It supplies a concrete bound on the actual pulse output,
with no analytic continuation or weighted-domain identification.

The companion script is `theta_pulse_leakage_certificate_20261108.py`; its
saved interval output is `theta_pulse_leakage_certificate_20261108.json`.
The exploratory script `theta_pulse_leakage_probe_20261108.py` helped select
the witness but is not used as a certificate.

## 1. Exact finite-feature comparison

Let

\[
\theta(t)=\sum_{n\in\mathbb Z}e^{-\pi n^2t},\qquad
\kappa(u)=\left(\frac{d^2}{du^2}-\frac1{16}\right)
             [e^{u/4}\theta(e^u)].
\]

The theta kernel is even, positive, smooth, and decays faster than every
exponential. Its bilateral transform is \(F\). Define

\[
h_\pm(u)=(1\pm u/2)\kappa(u).
\]

For every real center \(r\), the exact boundary multiplier identity gives

\[
C_0h_+(\,\cdot-r)=h_-(\,\cdot-r).
\]

This equality is in ordinary \(L^2\); isolated boundary zeros of the symbols
are immaterial. No inverse convolution or point-mass preimage in \(L^2\)
is asserted or needed.

Choose the following fixed rational centers and coefficients:

| Center \(r_j\) | Coefficient \(c_j\) |
|---|---:|
| \(0\) | \(-2\) |
| \(3/10\) | \(5\) |
| \(3/5\) | \(-9/8\) |

Let

\[
f=\sum_{j=1}^3c_jh_+(\,\cdot-r_j),\qquad
g=\sum_{j=1}^3c_jh_-(\,\cdot-r_j)=C_0f.
\]

The triangle inequality, the fact that \(Q_1\) is an orthogonal projection,
and unitarity give

\[
\begin{aligned}
\|Q_1g_0\|_2
&\le\|Q_1(g_0-g)\|_2+\|Q_1g\|_2\\
&\le\|f_0-f\|_2+\|Q_1g\|_2.
\end{aligned}
\tag{1}
\]

Write

\[
E=\|f_0-f\|_2^2
=1-2\int_0^1f(u)\,du+\int_{\mathbb R}f(u)^2\,du,
\qquad
T=\|Q_1g\|_2^2=\int_1^\infty g(u)^2\,du.
\]

It is therefore enough to enclose the three ordinary real integrals defining
\(E\) and \(T\). The required estimate is

\[
\|Q_1g_0\|_2^2\le(\sqrt E+\sqrt T)^2.
\tag{2}
\]

All signs of the coefficients are retained. The three-feature witness is
not an application of the two-point positivity theorem.

## 2. Interval enclosures

The certificate uses 35 decimal digits of interval precision and the exact
rational mesh width \(h=1/1000\). It applies composite Simpson quadrature to

\[
\int_{-3}^{4}f(u)^2\,du,\qquad
\int_0^1 f(u)\,du,\qquad
\int_1^4 g(u)^2\,du,
\]

with the analytical fourth-derivative bounds in the next section. Four theta
terms are retained at each point, with a positive uniform remainder interval.
The omitted spatial tails are bounded analytically.

Outward-rounded summaries of the resulting rigorous enclosures are

\[
E\in[0.10462488144556,\;0.10462778778890],
\]

\[
T\in[0.00082342003102,\;0.00082466479526].
\]

Using the full stored intervals before rounding gives

\[
(\sqrt E+\sqrt T)^2
\in[0.12401173037606061981,\;0.12403016538138754540].
\tag{3}
\]

The lower endpoint in (3) is **not a lower bound on the actual leakage**.
It bounds the explicitly chosen triangle-estimate expression. Equations
(2) and (3) establish only the stated upper bound for the actual leakage.

## 3. Rigorous quadrature error

### Theta derivative bounds

For \(u\ge0\), put \(x=\pi n^2e^u\). The individual theta terms and their
derivatives have the form

\[
\kappa_n^{(j)}(u)=e^{u/4-x}P_j(x),\qquad
P_0(x)=2x^2-3x,
\]

\[
P_{j+1}(x)=xP_j'(x)+(1/4-x)P_j(x).
\tag{4}
\]

The script records the exact rational coefficients for \(j=0,\ldots,4\).
For a monomial of degree \(k\), set \(q=k+1/4\). Since
\(e^{u/4}=x^{1/4}/(\pi n^2)^{1/4}\), its absolute contribution is at most
the coefficient magnitude times \(x^qe^{-x}\).

For \(n=1\), \(x\ge\pi>3\), so this term is bounded by

\[
\max_{x\ge3}x^qe^{-x}
=\max(3,q)^q e^{-\max(3,q)}.
\]

For \(n\ge2\), \(x\ge3n^2\ge12>q\). Successive upper bounds
\((3n^2)^qe^{-3n^2}\) have ratio at most

\[
(3/2)^{25/2}e^{-15}<1/20000,
\]

because \(q\le25/4\). Thus their sum is bounded by
\(12^qe^{-12}/(1-1/20000)\). Applying this bound to all coefficients gives
the global caps

\[
|\kappa^{(j)}(u)|\le K_j,\qquad
(K_0,K_1,K_2,K_3,K_4)=(2,9,53,376,3245).
\tag{5}
\]

Evenness extends the bounds to negative \(u\). The interval script verifies
each numerical inequality used to obtain these integer caps.

### Bounds for the finite witness

All translated arguments in the three quadratures have absolute value at
most four. Since \(\sum|c_j|=65/8=:C\), Leibniz's rule gives

\[
|f^{(j)}|,\ |g^{(j)}|
\le L_j:=C\left(3K_j+\frac j2K_{j-1}\right),
\tag{6}
\]

where the second term is omitted for \(j=0\). Consequently

\[
|(f^2)^{(4)}|,\ |(g^2)^{(4)}|
\le B:=2L_0L_4+8L_1L_3+6L_2^2.
\tag{7}
\]

For composite Simpson quadrature with an even number of intervals, the
absolute error is at most \((b-a)h^4\sup|q^{(4)}|/180\). Therefore the three
quadrature error bounds used are respectively

\[
\frac7{180}h^4B=0.000001452224921875,
\]

\[
\frac1{180}h^4L_4<0.000000000473372,
\]

\[
\frac3{180}h^4B=0.000000622382109375.
\]

These are analytic error bounds, not differences between numerical grids or
an adaptive quadrature package's error estimates.

## 4. Theta truncation and spatial tails

### Four-term theta truncation

For \(u\ge0\), the exact positive series is

\[
\kappa(u)=\sum_{n\ge1}
e^{u/4-\pi n^2e^u}
\left[2(\pi n^2e^u)^2-3\pi n^2e^u\right].
\]

Writing \(n=5+j\), use
\(n^4\le625e^{4j/5}\), \(n^2\ge25+10j\), and monotonicity of
\(v^{9/4}e^{-25\pi v}\) for \(v=e^u\ge1\). The omitted positive sum is
bounded by

\[
\frac{2\pi^2\,625e^{-25\pi}}
     {1-e^{4/5-10\pi}}
<10^{-30}.
\tag{8}
\]

The interval \([0,10^{-30}]\) is added to every computed kernel value.
Evenness covers every negative argument used in the quadrature. All mesh
points, centers, and coefficients are evaluated as rational intervals.

### Spatial tails

For \(v=e^u\ge1\),

\[
\sum_{n\ge2}n^4e^{-\pi(n^2-1)v}
\le\frac{16e^{-3\pi v}}{1-e^{2-4\pi v}}<\frac12.
\]

This gives

\[
\kappa(u)\le3\pi^2e^{9u/4-\pi e^u}\qquad(u\ge0).
\tag{9}
\]

Both feature signs obey
\(|h_\pm(u)|\le(1+|u|/2)\kappa(|u|)\). For \(u=3+v\), \(v\ge0\), use

\[
(1+u/2)^2\le\frac{25}{4}e^{2v/5},\qquad e^v\ge1+v.
\]

Consequently, on either sign of the spatial tail,

\[
\int_3^\infty(1+u/2)^2\kappa(u)^2\,du
\le\tau:=
\frac{(225/4)\pi^4e^{27/2-2\pi e^3}}
     {2\pi e^3-49/10}
<5.122\times10^{-48}.
\tag{10}
\]

Every translated argument has magnitude at least three on the omitted
intervals \(u<-3\) and \(u>4\). Weighted Cauchy–Schwarz gives

\[
\left|\sum_jc_jh_\pm(u-r_j)\right|^2
\le C\sum_j|c_j|\,|h_\pm(u-r_j)|^2.
\]

Thus the omitted contribution to \(\int f^2\) is at most \(2C^2\tau\),
and the omitted contribution to \(T\) is at most \(C^2\tau\). These terms
are included as positive interval remainders. They are negligible relative
to the displayed Simpson bounds, but are not discarded.

## 5. What this establishes for the ongoing pulse problem

The certificate evaluates a finite, explicitly specified theta witness and
bounds the actual unitary response. It is independent of the unresolved
positivity of three-point or higher cutoff Gram matrices: no such assertion
is needed even though the witness contains three centers.

The method also supplies a systematic, auditable family of upper bounds.
For every other finite combination of translated features, the same inequality
(1) is valid. Rational witnesses can be selected numerically and then checked
with interval quadrature and analytic tails as above. A claimed improvement
must be supported by its own certificate.

The remaining zero-tail target requires upper bounds tending to zero or an
analytic theorem forcing the tail to vanish. The present positive bound does
not supply either conclusion. In particular, it cannot be promoted to an
exponentially weighted estimate: an arbitrarily small ordinary-\(L^2\) tail
may still fail the required weighted integrability.

## Reproduction

Run the companion script with Python and `mpmath` installed. It writes the
adjacent JSON result and exits successfully only if all analytical interval
checks pass, including the strict final comparison with \(1/8\).
The certificate was executed successfully with `mpmath` version 1.3.0.
The numerical enclosures depend on the directed-rounding guarantees of its
interval backend; this is a computer-assisted calculation, not a formal
proof-assistant verification.
