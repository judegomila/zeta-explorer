# Exact sign topology of the first Green response

Let

\[
x=\pi e^{2h},\qquad y=\pi^2/x=\pi e^{-2h},
\]

\[
b(t)=t^{5/4}(t-1)e^{-t},\qquad
F_1(h)=Kq(h),\quad K=4\pi^{-1/4}>0,
\]

\[
q(h)=b(x)+b(y).
\]

## 1. Exactly one positive zero

Put \(H=\tfrac12\log\pi\).  If \(0<h\le H\), then \(x>1\) and
\(y\ge1\), so \(q(h)>0\).

For \(h>H\), one has \(0<y<1\) and \(x=\pi^2/y>\pi^2\).  Define

\[
R(y)={b(x)\over-b(y)}
={x^{5/4}(x-1)e^{-x}\over y^{5/4}(1-y)e^{-y}}.
\]

Since \(dx/dy=-x/y\), direct differentiation gives

\[
{d\over dy}\log R
={x-\frac52-\frac{x}{x-1}\over y}
 +{1\over1-y}+1.
\]

Here \(x>\pi^2>9\), hence

\[
x-\frac52-\frac{x}{x-1}
>9-\frac52-\frac98>0.
\]

Thus \(R\) is strictly increasing on \((0,1)\).  Moreover
\(R(y)\to0\) as \(y\downarrow0\), while \(R(y)\to\infty\) as
\(y\uparrow1\).  There is exactly one \(y_0\in(0,1)\) with \(R(y_0)=1\).
Consequently, with

\[
h_0={1\over2}\log(\pi/y_0)>H,
\]

\(F_1>0\) on \((0,h_0)\), \(F_1(h_0)=0\), and \(F_1<0\) on
\((h_0,\infty)\).  There is no positive re-entry.

## 2. The theta hump occurs before the response zero

Use the exact forward theta shells

\[
\psi=K\sum_{n\ge1}p_n(x),\qquad
p_n(x)=n^2x^{5/4}(2n^2x-3)e^{-n^2x},
\]

and \(D=d/dh=2x\partial_x\).  With \(z=n^2x\),

\[
Dp_n=n^2x^{5/4}e^{-z}A_1(z),
\]

\[
D^2p_n=n^2x^{5/4}e^{-z}A_2(z),
\]

where

\[
A_1(z)=-4z^2+15z-\frac{15}{2},
\]

\[
A_2(z)=8z^3-56z^2+\frac{165}{2}z-\frac{75}{4}.
\]

At \(h=H\), \(x=\pi^2\), so every shell has \(z\ge\pi^2>9\).
On \([9,\infty)\), \(A_1<0\): its derivative is negative there and
\(A_1(9)=-393/2\).  Also \(A_2>0\), since

\[
A_2(9)=\frac{8079}{4}>0,\qquad
A_2'(9)=\frac{2037}{2}>0,\qquad
A_2''(z)=48z-112>0\quad(z\ge9).
\]

Finally, since \(e<3<\pi\), one has \(H>1/2\), and hence

\[
A_1(z)+HA_2(z)>A_1(z)+\frac12A_2(z)=P(z),
\]

\[
P(z)=4z^3-32z^2+\frac{225}{4}z-\frac{135}{8}.
\]

Indeed

\[
P(9)=\frac{6507}{8}>0,\qquad
P'(9)=\frac{1809}{4}>0,\qquad
P''(z)=24z-64>0\quad(z\ge9).
\]

Absolute convergence permits summation shell by shell.  Therefore

\[
\psi'(H)<0,
\qquad
\psi'(H)+H\psi''(H)>0.
\]

For the wave-35 score \(\mathcal S=-h\psi''/\psi'\), this gives
\(\mathcal S(H)>1\).  Since wave 35 proves that \(\mathcal S\) is strictly
increasing and has a unique crossing \(\mathcal S(h_*)=1\),

\[
h_*<H<h_0.
\]

Thus the response is positive through the entire increasing branch of
\(f=-h\psi'\), has one zero after its maximum, and never re-enters the
positive region.  This proves only the missing response topology; it does
not prove the aggregate ratio inequality or RH.
