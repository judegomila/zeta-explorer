# An elementary large-real-axis bound for the third Pick curvature

Independent audit and proof, 9 November 2026.

Let

\[
F(x)=\xi(1/2+x),\qquad L(x)=F'(x)/F(x),
\]

and define

\[
G(x)=L(x)^2+xL(x)L'(x)+x^2L(x)L''(x)-2x^2L'(x)^2.
\tag{1}
\]

Then the following fully explicit bound holds without a zero-location
assumption:

\[
\boxed{G(x)>\frac{58}{225}>0\qquad(x\ge100).}
\tag{2}
\]

Equivalently, if \(h(u)=L(\sqrt u)/\sqrt u\), then
\(h h''-2h'^2>0\) on \(u\ge10^4\), because

\[
h(u)h''(u)-2h'(u)^2=\frac{G(\sqrt u)}{4u^3}.
\tag{3}
\]

This is a bound on one real-axis third-order curvature. It is not a
half-plane positivity theorem or an RH proof.

## 1. Exact expression and the prime terms

Put

\[
y=\frac x2+\frac54,\qquad
D_k(x)=\sum_{n=2}^{\infty}\Lambda(n)(\log n)^k n^{-x-1/2}
\quad(k=0,1,2).
\tag{4}
\]

The xi definition and the gamma recurrence give

\[
F(x)=(x-1/2)\pi^{-(x+1/2)/2}\Gamma(y)\zeta(x+1/2).
\tag{5}
\]

The logarithmic derivative of the absolutely convergent Euler product
therefore yields, for \(x>1/2\),

\[
\begin{aligned}
L(x)&=\frac1{x-1/2}+\frac12[\psi(y)-\log\pi]-D_0(x),\\
L'(x)&=-\frac1{(x-1/2)^2}+\frac14\psi'(y)+D_1(x),\\
L''(x)&=\frac2{(x-1/2)^3}+\frac18\psi''(y)-D_2(x).
\end{aligned}
\tag{6}
\]

Here \(\Lambda\) is the von Mangoldt function. The series and their
derivatives converge absolutely throughout the range used in this proof.
The standard starting formulas are [DLMF 25.4.4](https://dlmf.nist.gov/25.4.E4)
and [DLMF 25.2.11](https://dlmf.nist.gov/25.2.E11); (6) follows by
differentiation.

For \(n\ge2\), \(0\le\Lambda(n)\le\log n\le\sqrt n\). The last
inequality follows, for example, by maximizing \(\log t/\sqrt t\): its
maximum for \(t\ge1\) is \(2/e<1\). For \(k=0,1,2\),

\[
\Lambda(n)(\log n)^k n^{-x-1/2}
\le n^{-x+k/2}\le n^{1-x}.
\tag{7}
\]

As \(x^k\le x^2\) for \(x\ge100\), comparison with a decreasing
integral proves

\[
\begin{aligned}
0\le x^kD_k(x)
&\le x^2\sum_{n=2}^{\infty}n^{1-x}\\
&\le x^2\left[2^{1-x}+\int_2^\infty t^{1-x}\,dt\right]\\
&=x^2 2^{1-x}\left(1+\frac2{x-2}\right).
\end{aligned}
\tag{8}
\]

Both factors \(x^2 2^{1-x}\) and \(1+2/(x-2)\) strictly decrease on
\([100,\infty)\). For the former, the logarithmic derivative is
\(2/x-\log2<0\). At the left endpoint,

\[
100^2 2^{-99}\left(1+\frac2{98}\right)
=\frac{500000}{49}\,2^{-99}<\frac1{1000}.
\tag{9}
\]

The last inequality can be checked using only \(2^{30}>10^9\), since
\(500000/(49\cdot10^9)<1/1000\). Consequently, the uniform bounds needed
below are

\[
\boxed{D_0(x)<10^{-3},\qquad xD_1(x)<10^{-3},
\qquad x^2D_2(x)<10^{-3}.}
\tag{10}
\]

The common estimate (8) is intentionally much looser than the actual
prime tail; it keeps all derivative factors explicit and controlled.

## 2. Elementary gamma bounds

For \(y>0\), the partial-fraction formulas for the digamma and trigamma
functions give

\[
\boxed{
\psi(y)\ge\log y-\frac1y,
\qquad
\frac1y\le\psi'(y)\le\frac1y+\frac1{y^2},
\qquad
\psi''(y)\ge-\frac1{y^2}-\frac2{y^3}.
}
\tag{11}
\]

These estimates follow directly from series-integral comparisons.
Specifically,

\[
\psi(y)=\lim_{m\to\infty}
\left[\log m-\sum_{k=0}^{m-1}\frac1{y+k}\right],
\]

and
\(\sum_{k=0}^{m-1}(y+k)^{-1}
\le y^{-1}+\int_0^{m-1}(y+t)^{-1}dt\), proving the first bound.
Next,

\[
\psi'(y)=\sum_{k=0}^{\infty}(y+k)^{-2},\qquad
\psi''(y)=-2\sum_{k=0}^{\infty}(y+k)^{-3}.
\]

Bounding each decreasing sum between its integral and its first term
plus its integral proves the other bounds. The starting series are
[DLMF 5.7.6](https://dlmf.nist.gov/5.7.E6) and
[DLMF 5.15.1](https://dlmf.nist.gov/5.15.E1).

## 3. Three uniform bounds on L and its derivatives

For \(x\ge100\), \(y\ge205/4\). The elementary bound \(\pi<22/7\)
implies

\[
y/\pi>\frac{1435}{88}>16.
\tag{12}
\]

Moreover,

\[
\log4=4\operatorname{arctanh}(1/3)
=4\sum_{j=0}^{\infty}\frac{(1/3)^{2j+1}}{2j+1}
>4\left(\frac13+\frac1{81}\right)=\frac{112}{81}.
\tag{13}
\]

Dropping the positive rational term in (6), and using (10)--(13), gives

\[
\begin{aligned}
L(x)
&\ge\frac12\log(y/\pi)-\frac1{2y}-D_0(x)\\
&>\log4-\frac1x-\frac1{1000}\\
&>\frac{112}{81}-\frac{11}{1000}>\frac43.
\end{aligned}
\tag{14}
\]

Since \(y\ge x/2\), the upper bound for \(\psi'\) gives

\[
xL'(x)
\le\frac{x}{4y}+\frac{x}{4y^2}+xD_1(x)
<\frac12+\frac1x+\frac1{1000}
\le\frac{511}{1000}<\frac35.
\tag{15}
\]

Also, \(\psi'(y)\ge1/y\) and \(D_1\ge0\) give

\[
L'(x)\ge-\frac1{(x-1/2)^2}+\frac1{4y}>0,
\tag{16}
\]

because \((x-1/2)^2>4y=2x+5\) for \(x\ge100\).
Thus the positivity of \(L'\) here does not require a separate theta
inequality.

Finally, the lower bound for \(\psi''\) gives

\[
\begin{aligned}
x^2L''(x)
&\ge-\frac{x^2}{8y^2}-\frac{x^2}{4y^3}-x^2D_2(x)\\
&>-\frac12-\frac2x-\frac1{1000}\\
&\ge-\frac{521}{1000}>-\frac35.
\end{aligned}
\tag{17}
\]

The three desired bounds are therefore

\[
\boxed{
L(x)>\frac43,\qquad 0<xL'(x)<\frac35,
\qquad x^2L''(x)>-\frac35\quad(x\ge100).
}
\tag{18}
\]

## 4. The positive curvature margin

Write \(A=xL'(x)\), \(B=x^2L''(x)\). From (18),

\[
\begin{aligned}
G(x)&=L(x)^2+L(x)A+L(x)B-2A^2\\
&>L(x)^2-\frac35L(x)-\frac{18}{25}.
\end{aligned}
\tag{19}
\]

The polynomial on the right strictly increases for \(L\ge4/3\).
Evaluating it at \(L=4/3\) yields

\[
G(x)>\frac{16}{9}-\frac45-\frac{18}{25}
=\boxed{\frac{58}{225}}.
\tag{20}
\]

This completes the uniform large-real-axis proof. The [companion curvature note](theta_three_node_curvature_20261109.md)
supplies the bounded-interval argument, completing the curvature proof
on the whole positive real axis.
