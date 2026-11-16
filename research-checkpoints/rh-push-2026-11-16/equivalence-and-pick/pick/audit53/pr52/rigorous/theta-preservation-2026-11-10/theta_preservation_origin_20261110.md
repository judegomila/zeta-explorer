# A positive origin slope for the reduced curvature, at every anchor

Research continuation, 10 November 2026. This note proves

$$
\boxed{\left(4n_a''/n_a\right)''(0)>0\qquad\text{for every }a>0.}
\tag{1}
$$

The statement concerns the actual first canceled theta numerator n_a.
It uses the global ratio theorem in PR #51, a finite set of rigorous
theta constant bounds, and an analytic large-anchor comparison. It does
not assume positivity of any new convexity determinant.

The companion [global proof](theta_preservation_global_20261110.md)
establishes strict convexity of J_new in the increasing coordinate
z=kappa/n_a. Together with that input, (1) proves J_new'>0 on the
entire positive spatial axis: its derivative is initially positive
by (1), and convexity in the increasing coordinate prevents that sign
from reversing. The origin result supplies the boundary sign for
that implication.

## 1. Exact origin condition

Use kappa,C,n_a,b_a,F,L as in PR #51. Let

$$
p=L(a)>0,\qquad d=1+ap,\qquad
c=-\frac{\kappa''(0)}{\kappa(0)}>0,
\qquad N_0=\frac{n_a(0)}{\kappa(0)}.
$$

Let V=-log kappa, B=tV'-1 and N=n_a/kappa. The identities

$$
(4D^2-a^2)n_a=(B-ap)\kappa,\qquad
J_{\rm new}=4n_a''/n_a=a^2+(B-ap)/N
$$

give B(0)=-1, B''(0)=2c and

$$
N''(0)=(a^2/4+c)N_0-d/4.
$$

Differentiating the quotient at the even symmetry point yields

$$
\boxed{
J_{\rm new}''(0)=
\frac{[d(a^2+4c)+8c]N_0-d^2}{4N_0^2}.
}
\tag{2}
$$

The equivalent lower-bound target is

$$
\boxed{N_0>\frac{d^2}{d(a^2+4c)+8c}.}
\tag{3}
$$

Writing c_n=-n_a''(0)/n_a(0), the same condition is

$$
\boxed{c_n<c+2c/d.}
\tag{4}
$$

## 2. Small and moderate anchors: 0<a<=20

PR #51 proves (n_a/C)'>0 on t>0. The even function log(n_a/C)
therefore has nonnegative second derivative at zero, giving

$$
c_n\le c_C:=-C''(0)/C(0)=\frac{\kappa(0)}{4C(0)}.
\tag{5}
$$

Also p'(a)>0 by the variance formula for the positive tilted theta
measure. The rigorous constant bounds established below are

$$
c>4.68,\qquad c_C<5.19,\qquad p(20)<0.7.
\tag{6}
$$

Thus d=1+ap<15 for 0<a<=20, and

$$
c+\frac{2c}d>
4.68\left(1+\frac2{15}\right)=5.304>5.19>c_n.
$$

The rational margin 5.304-5.19 is exactly 57/500. This proves (4)
throughout the first anchor region, without sampling anchors.

## 3. Large anchors: a>=20

Normalize the kernel by k(t)=kappa(t)/kappa(0), and put

$$
k_4=k^{(4)}(0),\qquad\lambda=a/2,\qquad r=\lambda^2.
$$

The further rigorous constants are

$$
c<4.7,\qquad k_4>56.8,\qquad
\sup_{t\in\mathbb R}|k^{(6)}(t)|<1500,
\qquad p(1)>0.04.
\tag{7}
$$

For a>=20, p(a)>=p(1) implies d>=9/5, while r>=100.
Taylor's theorem, evenness, and the global sixth derivative bound give
the global polynomial lower bound

$$
k(s)\ge1-\frac{cs^2}2+\frac{k_4s^4}{24}
-\frac{1500s^6}{720}\qquad(s\ge0).
\tag{8}
$$

This bound remains valid when its right side becomes negative. No
truncation of the spatial integral is made in the next step.

The exact canceled Green formula, integrated by parts at the origin,
gives

$$
\boxed{N_0=\frac14\int_0^\infty(s+2p)k(s)e^{-\lambda s}ds.}
\tag{9}
$$

The weight is positive. Integrating (8) against it and using
integral_0^infinity s^m exp(-lambda*s) ds=m!/lambda^(m+1) yields

$$
\boxed{
4N_0\ge
\frac d r-\frac{c(d+2)}{r^2}
+\frac{k_4(d+4)}{r^3}
-\frac{1500(d+6)}{r^4}.
}
\tag{10}
$$

The target (3) is equivalent to 4N_0>d^2/[d(r+c)+2c]. Multiplying
the difference between the right side of (10) and this target by the
positive denominator r^4[d(r+c)+2c] gives

$$
\begin{aligned}
&r^2\{k_4d(d+4)-c^2(d+2)^2\}\\
&\quad+r\{ck_4(d+2)(d+4)-1500d(d+6)\}
-1500c(d+2)(d+6).
\end{aligned}
\tag{11}
$$

Drop the positive term r*c*k_4*(d+2)*(d+4), use k_4>284/5 and
c<47/10, and define the smaller polynomial

$$
\begin{aligned}
P(d,r)={}&r^2\left\{\frac{284}{5}d(d+4)
-\left(\frac{47}{10}\right)^2(d+2)^2\right\}\\
&-1500r d(d+6)-7050(d+2)(d+6).
\end{aligned}
$$

For d=9/5+X and r=100+Y it expands exactly as

$$
\begin{aligned}
P={}&\frac{3471}{100}X^2Y^2+5442X^2Y+190050X^2\\
&+\frac{65949}{250}XY^2+\frac{191796}{5}XY+1116180X\\
&+\frac{685031}{2500}Y^2+\frac{843562}{25}Y+425162.
\end{aligned}
\tag{12}
$$

Every coefficient is positive. Therefore P>0 on X,Y>=0, proving
(3) for every a>=20. Together with Section 2, this proves (1) for
all positive anchors.

## 4. Rigorous certificate of the constants

The self-contained executable `theta_preservation_origin_20261110.py`
uses python-flint at 224-bit precision. It recomputes all constants;
no rounded diagnostic decimal is a proof input.

### Theta jets and the sixth derivative

For r_n=pi*n^2*exp(t), the exact derivative polynomials satisfy

$$
P_0(r)=2r^2-3r,\qquad
P_{j+1}(r)=(1/4-r)P_j(r)+rP_j'(r).
$$

Consequently

$$
\kappa^{(j)}(t)=\sum_{n\ge1}e^{t/4-r_n}P_j(r_n).
$$

Sixteen theta terms are retained. If M_j is the sum of absolute
coefficients of P_j, the omitted terms are bounded by

$$
2M_j(4e^t17^2)^{j+2}\exp(t/4-3e^t17^2).
\tag{13}
$$

The code checks the geometric ratio bound even on t>=-1/2; this
slight extension contains any outward rounding below zero in the
first interval cell. On that region pi*exp(t)>1, and the derivative
polynomial majorant and geometric-series argument are valid.

On [0,4], 4,096 closed dyadic intervals of width 1/1024 give

$$
|\kappa^{(6)}|/\kappa(0)<1256.623<1500.
$$

For t>=4, bound every theta term by its absolute coefficient norm.
The full series is at most

$$
2M_6(4e^t)^8e^{t/4-3e^t}.
$$

The geometric ratio is bounded by 2^16 exp(-9e^t)<1/2. Each
majorant decreases with t, since 33/4-3e^t<0. At t=4 the normalized
bound is less than 6*10^(-48). Evenness extends the sixth derivative
bound to negative t. This proves the global constant in (7).

### Integrated constants and anchors

The finite theta sum is entire, so FLINT's rigorous complex ball
integration applies on [0,4]. The omitted theta sum has the explicit
bound (13). For the needed positive anchors a=1,20, compute

$$
p(a)=
\frac{\int_0^\infty t\kappa(t)\sinh(at/2)dt/2}
{\int_0^\infty\kappa(t)\cosh(at/2)dt}.
$$

Both integrals are evaluated on [0,4] with outward error enclosures.
To bound their spatial tails, put T=4, lambda=a/2, and
v=V'(T). The known Q'>0 implies V' increases; since v>lambda,

$$
\kappa(s)e^{\lambda s}
\le\kappa(T)e^{\lambda T}e^{-(v-\lambda)(s-T)}
\qquad(s\ge T).
$$

Thus the denominator tail is at most K/(v-lambda), and the numerator
tail is at most K[T/(v-lambda)+1/(v-lambda)^2]/2, where
K=kappa(T)*exp(lambda*T). These explicit nonnegative errors are added
to the finite integral balls. The C(0) computation similarly uses
the known tail bound C(4)<kappa(4)/(4Q(4)).

The replay encloses

| Quantity | Approximate center; the script retains its full rigorous ball |
| --- | --- |
| c | 4.6817262323758302921 |
| k_4 | 56.8172479346539912093 |
| c_C | 5.1872238249992109374 |
| p(1) | 0.04613592806046257536 |
| p(20) | 0.66654952389985012436 |

The script checks the broad rational bounds (6)--(7), the positive
coefficients in (12), and the small-anchor rational margin. The stored
replay is `theta_preservation_origin_replay_20261110.json`.

## Dependencies and scope

The needed prior theorems are the theta ratio sandwich, classical
theta concavity Q'>0, and exact first canceled Green identity from
[PR #51](https://github.com/judegomila/mathexplorer/pull/51), fixed
commit `afdac28948ab084e80214c31ef72c9520d943760`, and its immutable
preceding references. No finite-height zero theorem is used.

This is a computer-assisted proof of the single all-anchor boundary
inequality (1). The convexity propagation argument needs its separate
spatial determinant theorem. No all-depth preservation or RH conclusion
is claimed by this note.
