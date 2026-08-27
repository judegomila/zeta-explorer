# First-window vertical-$y$ and stable-$\gamma$ theorem

## Claim boundary

This package proves a uniform vertical transport theorem on the first complete
early-$P97$ selector window of the parked ramp.  It covers both vertical
faces and all four one-sided charts at the two bounding seams.

It does **not** bound the retained correlated cocycle on that window.  In
particular, it does not certify the first selector window, the early mantle,
the swept tube, or $\Lambda\leq0.14$.

## 1. Exact window

Use

\[
 t(\lambda)=\frac{26399999+\lambda}{200000000},\qquad
 R(\lambda)=6000000185827+59993999999971158\lambda,
\]

and the two faces $x=R(\lambda)+u$, $u\in\{0,17/20\}$.
The directed producer solves the exact seam equation

\[
 \lambda_n(u)=
 \frac{4\pi(n^2-26399999/(16\cdot200000000))-6000000185827-u}
 {59993999999971158+\pi/(4\cdot200000000)}.             \tag{1}
\]

It covers selector $N=690989$ from the $n=690989$ seam to the
$n=690990$ seam on each face.  The closed seam chart pairs are

\[
 (690988,1),(690989,0)
\]

at the lower seam and

\[
 (690989,1),(690990,0)
\]

at the upper seam.  The common directed hull is

\[
 0.131999995000000000999\ldots<t<
 0.131999995000000002447\ldots,
\]

\[
 6.0000121748691\times10^{12}<x<
 6.0000295413295\times10^{12}.                         \tag{2}
\]

The vertical coordinate is evaluated in the exact form

\[
 y^2=\frac7{25}-2t+\frac{18}{25}\eta,
 \qquad 0\leq\eta\leq1,                               \tag{3}
\]

so that $Y(t)\leq y\leq U(t)$.  The full height is less than
$0.731414$.

## 2. Cancellation-stable gamma transport

Put

\[
 s_n=\frac{1-y+ix}{2},\qquad s_d=\frac{1+y-ix}{2},
\]

and let

\[
 \beta_t(s)=\frac{d}{ds}\log M_t(s)
 =\alpha(s)+\frac t2\alpha(s)\alpha'(s).
\]

For

\[
 \gamma(t,x,y)=\frac{M_t(s_n)}{M_t(s_d)},
\]

ordinary differentiation gives the exact identity

\[
 \boxed{
 \frac{\partial}{\partial y}\log\gamma(t,x,y)
 =-\frac{\beta_t(s_n)+\beta_t(s_d)}2.}                 \tag{4}
\]

This is the stable formulation: the two huge values of $\log M_t$ are
never subtracted on a broad $y$-box.  The directed 160-bit enclosure on
the whole domain is

\[
 -13.445880630866<
 \Re\,\partial_y\log\gamma
 <-13.445879183665,                                    \tag{5}
\]

\[
 -7.15\times10^{-14}<
 \Im\,\partial_y\log\gamma
 <-1.05\times10^{-14}.                                 \tag{6}
\]

Consequently, with $y_0=Y(t)$, there are real
$r_\gamma>0$ and $\theta_\gamma$ such that

\[
 \frac{\gamma(t,x,y)}{\gamma(t,x,y_0)}
 =r_\gamma e^{i\theta_\gamma},                         \tag{7}
\]

\[
 5.3571373908\times10^{-5}<r_\gamma\leq1,
 \qquad |\theta_\gamma|<5.22922\times10^{-14}.         \tag{8}
\]

Thus the vertical gamma carrier is a positive real contraction up to a
phase ball of radius less than $5.23\times10^{-14}$.

## 3. Both ladder coefficients contract

The primary exponent is

\[
 s_B=s_d+\frac t2\alpha(s_d),
\]

and hence

\[
 S_y:=\partial_y s_B
 =\frac12+\frac t4\alpha'(s_d).                         \tag{9}
\]

The producer proves on the full hull

\[
 \Re S_y>\frac12,
 \qquad
 5.49995\times10^{-15}<\Im S_y<5.50001\times10^{-15}. \tag{10}
\]

For $L_n=\log n$, define the exact primary term and the kappa-removed
reflected reference term

\[
 p_n(y)=e^{tL_n^2/4-s_B L_n},
\]

\[
 q_n(y)=\gamma(t,x,y)
 e^{tL_n^2/4+yL_n-\overline{s_B}L_n}.                  \tag{11}
\]

Their logarithmic derivatives are

\[
 \partial_y\log p_n=-S_yL_n,                           \tag{12}
\]

\[
 \partial_y\log q_n=\partial_y\log\gamma
 +(1-\overline{S_y})L_n.                               \tag{13}
\]

For every $1\leq n\leq690990$, equations (5), (10), and directed
evaluation of (12)--(13) prove

\[
 \Re\,\partial_y\log p_n\leq0,
\]

with the strict uniform bound

\[
 \Re\,\partial_y\log p_n<-0.3465735902799
 \quad(n\geq2),                                       \tag{14}
\]

and

\[
 \Re\,\partial_y\log q_n<-6.7229388682325.            \tag{15}
\]

Therefore

\[
 \frac{p_n(y)}{p_n(y_0)}=r_{n,+}e^{i\theta_{n,+}},
 \qquad 0<r_{n,+}\leq1,
 \qquad |\theta_{n,+}|<5.40898\times10^{-14},          \tag{16}
\]

and

\[
 \frac{q_n(y)}{q_n(y_0)}=r_{n,-}e^{i\theta_{n,-}},
 \qquad 0<r_{n,-}\leq1,
 \qquad |\theta_{n,-}|<4.63822\times10^{-14}.          \tag{17}
\]

The index ceiling $690990$ includes the new endpoint term in the upper
one-sided seam chart.  Gamma and the coefficient transports are independent
of which fixed-index chart represents the physical seam, so (7)--(17) apply
to all four seam labels above.

## 4. What this removes, and what remains

The vertical complex-phase problem on this window has been reduced to a
real-contraction problem with a sub-$10^{-12}$ phase charge.  A future
event-DAG/Fresnel--Airy kernel may therefore freeze the bottom phases and
retain the positive real attenuation parameters $r_{n,+}$ and
$r_{n,-}$, adding the displayed phase balls.

It is not valid to replace those real contractions by $1$: the common
gamma modulus can fall to about $5.36\times10^{-5}$ at the top.  Nor does
termwise amplitude contraction imply monotonicity of the modulus of a
correlated signed sum.  The still-open theorem is a directed enclosure of
the recombined 15,849-branch $P97$ event-DAG center under these real
attenuations, on the bottom and both vertical faces.

Here $q_n$ is the kappa-removed reference used by the retained cocycle.
The exact Polymath reflected exponent is
$s_A=\overline{s_B}+\kappa-y$; the separately certified $e_\kappa$
transfer remains mandatory and is not part of this package.

```text
FIRST_WINDOW_VERTICAL_GAMMA_CERTIFIED true
FIRST_WINDOW_COCYCLE_CERTIFIED false
EARLY_P97_MANTLE_CERTIFIED false
GLOBAL_SWEPT_TUBE_CERTIFIED false
LAMBDA_LE_0_14 false
```
