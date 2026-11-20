# Analytic first-shell domination for the actual-theta `J=1` response

## Result and scope

Put

\[
x=\pi e^{2h},\qquad y={\pi^2\over x},\qquad
K=4\pi^{-1/4},
\]

\[
b(t)=t^{5/4}(t-1)e^{-t},\qquad
q(x)=b(x)+b(y).
\]

Then `F_1=Kq`.  For the actual complete theta profile,

\[
\psi=K\sum_{n\geq1}p_n,
\qquad
p_n=Nx^{5/4}(2Nx-3)e^{-Nx},\quad N=n^2.
\]

This note proves, without a finite scan,

\[
\boxed{W:=\psi'F_1'-\psi''F_1>0\quad\hbox{whenever }F_1>0.}
\]

It does not prove the sign topology of `F_1`, the finite Green correlation by
itself, any all-degree statement, or RH.

## 1. Exact shell decomposition

Let `D=d/dh=2x partial_x`, with `y=pi^2/x`, and define

\[
\begin{aligned}
A_1(t)&=-4t^2+15t-{15\over2},\\
A_2(t)&=8t^3-56t^2+{165\over2}t-{75\over4},\\
B_1(t)&=-2t^2+{13\over2}t-{5\over2}.
\end{aligned}
\]

Writing

\[
U=x^{5/4}e^{-x},\qquad V=y^{5/4}e^{-y},
\]

direct differentiation gives

\[
Dp_n=Nx^{5/4}e^{-Nx}A_1(Nx),\qquad
D^2p_n=Nx^{5/4}e^{-Nx}A_2(Nx),
\]

\[
Dq=U B_1(x)-V B_1(y).
\]

Consequently

\[
{W\over K^2}
=\sum_{n\ge1}Nx^{5/4}e^{-Nx}
 \{U C_{N,x}+V C_{N,y}\},                                      \tag{1}
\]

where

\[
\begin{aligned}
C_{N,x}&=A_1(Nx)B_1(x)-A_2(Nx)(x-1),\\
C_{N,y}&=-A_1(Nx)B_1(y)-A_2(Nx)(y-1).
\end{aligned}                                                     \tag{2}
\]

The first direct coefficient collapses exactly to

\[
C_{1,x}=x(8x^2-16x+15)\geq4x^3\qquad(x\geq\pi).                 \tag{3}
\]

The last inequality follows because
`4x^2-16x+15` is increasing for `x>2` and is positive at `x=3`.

## 2. The positive-response region lies below `4 pi`

For `x>=4 pi`, one has `0<y<=pi/4<1`, so `b(x)>0>b(y)`.  Set

\[
R(x)={b(x)\over-b(y)}
=\left({x\over y}\right)^{5/4}{x-1\over1-y}e^{-(x-y)}.
\]

Since `y'= -y/x`,

\[
{d\over dx}\log R
={5\over2x}+{1\over x-1}-{y\over x(1-y)}-1-{y\over x}<0.        \tag{4}
\]

Indeed `x>12`, and the two displayed positive terms are less than
`5/24+1/11<1`.  At `x=4 pi`,

\[
R(4\pi)=128{4\pi-1\over4-\pi}e^{-15\pi/4}<1728e^{-11}<1.       \tag{5}
\]

Here `3<pi<22/7` and `e>2` suffice.  Thus `q<0` for `x>=4 pi`, and

\[
q>0\quad\Longrightarrow\quad \pi\leq x<4\pi.                  \tag{6}
\]

This is only a one-sided localization; it does not prove connectedness of
the positive set.

## 3. Positivity of the reflected first shell

For `N=1`,

\[
C_{1,y}=-A_1(x)B_1(y)-A_2(x)(y-1).                              \tag{7}
\]

We prove `C_(1,y)>0` on the entire interval in (6).

### `pi <= x <= 4`

On `[3,4]`, `A_2` is convex and its endpoint values are
`A_2(3)=-237/4`, `A_2(4)=-291/4`; hence `A_2<-50`.
Also `|A_1|<=23/2`, `|B_1(y)|<3`, and
`y-1>=pi^2/4-1>5/4`.  Therefore

\[
C_{1,y}>-69/2+50(5/4)=28>0.                                    \tag{8}
\]

### `4 <= x <= 5`

Here `A_1<0`, `A_2<0`, `y>1`, and `B_1(y)>0`.
The last sign follows from `3/4<y<5/2`, on which the concave quadratic
`B_1` is at least `5/4`.  Both terms in (7) are positive.

### `5 <= x <= pi^2`

Write

\[
s=-A_1(x)=4x^2-15x+{15\over2}>0.
\]

For `5<=x<pi^2`, one has `1<y<2` and

\[
{B_1(y)\over y-1}={9\over2}-2y+{2\over y-1},                    \tag{9}
\]

\[
{A_2(x)\over s}=2x-{13\over2}-{30(x-1)\over s}.                \tag{10}
\]

Since `s<x(4x-13)` and `p=pi^2<10`, the difference of (9) and
(10) is strictly larger than

\[
G_{10}(x)=11-2x-{20\over x}+{2x\over10-x}
          +{30(x-1)\over x(4x-13)}.                             \tag{11}
\]

After multiplication by the positive denominator
`x(10-x)(4x-13)`, the numerator is

\[
P(x)=8x^4-142x^3+867x^2-2160x+2300.                             \tag{12}
\]

It is positive on `[5,10)` by the following exact shifts:

\[
\begin{aligned}
P(5+u)&=425-140u-63u^2+18u^3+8u^4>222 &&(0\le u\le1),\\
P(6+u)&=248-180u+39u^2+50u^3+8u^4\ge68 &&(0\le u\le1),\\
P(7+u)&=165+80u+237u^2+82u^3+8u^4>0 &&(u\ge0).
\end{aligned}                                                    \tag{13}
\]

Thus `s B_1(y)>A_2(x)(y-1)`, proving (7).  At `x=pi^2`, the
second factor `y-1` vanishes and the result is immediate.

### `pi^2 <= x < 4 pi`

Here `A_1<0`, `A_2>0`, `3/4<y<=1`, and `B_1(y)>0`.  Again both
terms in (7) are positive.  This completes

\[
\boxed{C_{1,y}>0\quad(q>0).}                                   \tag{14}
\]

## 4. Uniform higher-shell bound

For `n>=2`, put `N=n^2`.  Then `Nx>=4pi>12`, and elementary
polynomial bounds give

\[
|A_1(Nx)|<4N^2x^2,\qquad 0<A_2(Nx)<8N^3x^3.                    \tag{15}
\]

For `x>=pi`, `|B_1(x)|<2x^2` and `x-1<x`.  For `0<y<=pi`,
`|B_1(y)|<3` and `|y-1|<3`.  Hence

\[
|C_{N,x}|\le16N^3x^4,
\qquad
|C_{N,y}|\le36N^3x^3.                                         \tag{16}
\]

Use the positive first-direct term in (1) as the baseline.  Equations
(3) and (16) show that the direct higher-shell absolute tail divided by
that baseline is at most

\[
4x\sum_{n\ge2}n^8e^{-(n^2-1)x}
\le4\pi S,                                                       \tag{17}
\]

where

\[
S=\sum_{n\ge2}n^8e^{-(n^2-1)\pi}.
\]

For the reflected tail, the scale factor is

\[
{V\over U}e^{-(N-1)x}
=\left({y\over x}\right)^{5/4}e^{-(N-2)x-y}.                   \tag{18}
\]

Its logarithmic derivative is

\[
-{5\over2x}-(N-2)+{y\over x}<0,                                \tag{19}
\]

so (18) is at most its value `e^(-(N-1)pi)` at `x=pi`.
The reflected higher-shell absolute tail is consequently at most `9S`
times the same baseline.  In total,

\[
{\text{higher-shell absolute tail}\over\text{first-direct term}}
\le(4\pi+9)S.                                                   \tag{20}
\]

Finally, `pi>3` and the exponential series bound `e^3>20` give

\[
S< {4\over125}+{1\over1{,}500{,}000}<{1\over31}.               \tag{21}
\]

For completeness, the first term is `256e^(-9)<4/125`.  For
`n>=3`, the first tail term is less than `6561/20^8<1/3,000,000`,
and successive terms have ratio less than
`(4/3)^8e^(-21)<10/20^7<10^(-8)`, so the tail is less than twice
its first term.

Using `pi<22/7`, (20)--(21) give

\[
(4\pi+9)S<{151\over7}{1\over31}={151\over217}<1.               \tag{22}
\]

The reflected first shell is positive by (14).  The first direct shell
therefore dominates the absolute value of every higher shell, and (1)
proves

\[
\boxed{W>0\quad\hbox{on the whole positive-response set}.}
\]

The explicit margin is more than `66/217` of the first-direct contribution.

