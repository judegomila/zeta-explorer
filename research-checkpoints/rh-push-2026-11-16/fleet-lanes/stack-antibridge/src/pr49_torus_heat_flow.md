# Heat flow on the twin-ladder torus and the opposite reflection

Research continuation, 9 November 2026. This note preserves the preceding
conversation's calculation. It makes no claim of a new numerical bound on the
de Bruijn–Newman constant or a proof of RH. The zero-dynamics interaction is
already present in the published Polymath argument; the torus provides a
coordinate description and the finite-window formula below extracts its size.

## 1. Coordinates and normalization

Use the standard de Bruijn–Newman family

$$
H_\tau(z)=\int_0^\infty e^{\tau u^2}\Phi(u)\cos(zu)\,du,
\quad H_0(z)=\tfrac18\xi(\tfrac12+iz/2),
\quad \partial_\tau H_\tau=-\partial_z^2H_\tau,
$$

where

$$
\Phi(u)=\sum_{n\ge1}(2\pi^2n^4e^{9u}-3\pi n^2e^{5u})
e^{-\pi n^2e^{4u}}.
$$

This positive, even theta kernel has superexponential decay. The function
$H_\tau$ is real entire, even, and of order one. Its zeros are all real
exactly when $\tau\ge\Lambda$; Rodgers–Tao prove $\Lambda\ge0$.
Thus an improvement toward RH means lowering an upper bound on $\Lambda$.
A strictly positive lower bound would refute RH.

The geometric construction from [PR #43](https://github.com/[user]/mathexplorer/pull/43)
is

$$
E_r:\eta^2=(w^2+r^2)(w^2+r^{-2}),\qquad r>1,
\quad w=(s-1)/s,\quad s=1/(1-w).
$$

Its functional-equation involution is
$I(w,\eta)=(w^{-1},\eta/w^2)$, which corresponds to $z\mapsto-z$.
The deck involution $(w,\eta)\mapsto(w,-\eta)$ is a different map.
Both sheets carry the same pulled-back scalar function; their duplicate
zeros must not be counted as additional zeros of $H_\tau$.

The reciprocal involution has four fixed points:

$$
p_\pm=(1,\pm(r+r^{-1})),\qquad
q_\pm=(-1,\pm(r+r^{-1})).
$$

The points $p_\pm$ are the essential punctures over $s=\infty$.
The points $q_\pm$, interpreted here as the opposite anti-bridge anchors,
lie over $s=1/2$, hence $z=0$. For every real heat time,

$$
H_\tau(0)>0,\qquad H_\tau'(0)=0,\qquad
\partial_\tau H_\tau(0)>0.
$$

The finite anchors are therefore symmetry sites, not zero-collision sites.
If “anti-bridge” instead denotes a second cut between sheets, that cut has
no additional scalar zero condition without an independently established
coupling equation.

## 2. Exact explanation of apparent freezing

On either critical oval,

$$
w=e^{i\theta},\qquad
s=\tfrac12+\tfrac i2\cot(\theta/2),\qquad
z=\cot(\theta/2).
$$

Writing $f_\tau(\theta)=H_\tau(\cot(\theta/2))$, the chain rule gives

$$
\partial_\tau f_\tau
=-(1-\cos\theta)^2\partial_\theta^2f_\tau
 -(1-\cos\theta)\sin\theta\,\partial_\theta f_\tau.
\tag{1}
$$

The leading coefficient vanishes to fourth order at the infinity point
$\theta=0$; at the opposite anchor $\theta=\pi$ it equals $-4$.
The visual slowing at infinity is coordinate compression of the original
evolution. It supplies no extra force or zero pinning.

For completeness define
$\Xi_\tau(s)=8H_\tau(-2i(s-1/2))$. Then
$\partial_\tau\Xi_\tau=\tfrac14\partial_s^2\Xi_\tau$, and its pullback
$X_\tau(w)=\Xi_\tau(1/(1-w))$ obeys

$$
\partial_\tau X_\tau
=\tfrac14\big[(1-w)^4\partial_w^2X_\tau
 -2(1-w)^3\partial_wX_\tau\big].
\tag{2}
$$

The restriction of $H_\tau$ to real $z$ is Schwartz, so its oval
restriction extends flatly with value zero at $\theta=0$. The complex
function nevertheless retains essential singularities at $p_\pm$.
Contour and energy arguments must keep their limiting boundary terms.
An ordinary compact-torus diffusion operator would be a different flow.

Normalized endpoint values cannot fix a numerical threshold: the shifted
family $H_{\tau+c}/H_{\tau+c}(0)$ has the same torus, normalized finite
anchor, and flat oval endpoints, while its real-zero threshold is
$\Lambda-c$.

## 3. Quartet contraction and its quantitative size

Let $z=x+iy$, $y>0$, be a simple zero attaining the global maximal
imaginary height. Standard zero dynamics give the symmetrically grouped sum

$$
\dot z=2\operatorname{PV}\sum_{\rho\ne z}\frac1{z-\rho}.
\tag{3}
$$

There are no purely imaginary zeros, since
$H_\tau(iy)=\int_0^\infty e^{\tau u^2}\Phi(u)\cosh(yu)du>0$.
Thus the distinct quartet is $z,\bar z,-z,-\bar z$.
For $U=y^2$, its partners contribute

| Partner | Contribution to $\dot U$ |
|---|---:|
| $\bar z$ | $-2$ |
| $-z$ | $-2U/(x^2+U)$ |
| $-\bar z$ | $0$ |

All other contributions are nonpositive at a global maximum, so

$$
\dot U\le-2-\frac{2U}{x^2+U}.
\tag{4}
$$

Polymath, Section 3, Proposition 3.3's proof already separates this quartet
and uses the strict negative contribution from $-z$. This note does not
claim discovery of that term.

If all branches attaining the global upper-height envelope remain within
$|x|\le X$, then
$\dot U\le-2(X^2+2U)/(X^2+U)$. Starting with $U\le\Delta^2$,
the resulting landing-time comparison is

$$
B_X(\Delta)
=\int_0^{\Delta^2}\frac{X^2+u}{2(X^2+2u)}du
=\frac{\Delta^2}{4}
 +\frac{X^2}{8}\log(1+2\Delta^2/X^2).
\tag{5}
$$

Consequently $\Lambda\le\tau_0+B_X(\Delta)$, conditional on a global
initial strip, uniform confinement of its upper envelope through the
comparison interval, and the standard limiting/first-contact treatment of
multiple zeros. A maximum over a finite sampled window does not supply
those hypotheses.

The improvement over $\Delta^2/2$ is
$\Delta^4/(4X^2)+O(\Delta^6/X^4)$; it is negligible at very large
spectral height. A useful numerical improvement therefore needs collective
nearby interactions or stronger true-function estimates.

## 4. Heat deformation of the actual theta bridge

The prior boundary-energy normalization is

$$
\kappa(u)=\Phi(u/4),\qquad
F_\tau(a)=8H_\tau(-2ia)
=\int_{\mathbb R}\kappa_\tau(u)e^{au/2}du,
\quad\kappa_\tau(u)=e^{\tau u^2/16}\kappa(u).
\tag{6}
$$

Here $u$ is the real theta/convolution variable, Mellin-dual to the
spectral coordinate. Its two tails are not automatically the spectral
punctures $p_\pm$ or the anti-bridge $q_\pm$.

For $\alpha>0$, define
$h_{\tau,\pm}(u)=(1\pm\alpha u/2)\kappa_\tau(u)$.
The exact cutoff-energy kernel is

$$
K_{\tau,c}(u,v)=2\alpha\int_{|c-(u+v)/2|}^\infty
t\,\kappa_\tau(t+(u-v)/2)\kappa_\tau(t-(u-v)/2)dt.
\tag{7}
$$

If $A_\tau$ is convolution by $h_{\tau,+}$ and
$Q_c=1_{(c,\infty)}$, then

$$
\|Q_cA_\tau^*a\|_2^2-\|Q_cA_\tau a\|_2^2
=-\langle a,K_{\tau,c}a\rangle.
\tag{8}
$$

The known strict convexity of $V(v)=-\log\kappa(\sqrt v)$ gives
the prior two-point theorem. Under heat flow,

$$
V_\tau(v)=V(v)-\tau v/16,\qquad V_\tau''(v)=V''(v).
\tag{9}
$$

Thus every two-point principal matrix remains positive for every real
$\tau$. The fixed-finite one-end sech limit also persists, uniformly for
bounded times and compact offset sets, because the heat weight is
subdominant to the theta superexponential tail. These properties hold at
negative times, when the actual family has nonreal zeros. They cannot alone
locate $\Lambda$.

For $c=0$, set $m=(u+v)/2,d=(u-v)/2$. Changing variable
$s=t^2-m^2$ in (7) yields the exact time-sensitive decomposition

$$
K_{\tau,0}(u,v)
=\alpha e^{\tau(u^2+v^2)/16}
\int_0^\infty e^{\tau s/8}
\kappa(\sqrt{s+m^2}+d)\kappa(\sqrt{s+m^2}-d)ds.
\tag{10}
$$

On any frozen finite set this is a positive diagonal congruence of the
matrix of weighted integrals. The endpoint rescaling cannot change the
inertia; the integral of the signed superposition must be controlled.

## 5. What freezing must preserve

A genuine lower-bound collision would satisfy
$H_\tau(a)=\partial_zH_\tau(a)=0$ at finite spectral $a$.
Neither an essential puncture nor the positive finite anchor supplies it.
Branch-point criticality in a torus uniformizer also does not imply
$\partial_zH_\tau=0$.

For an upper bound, retain either a rigorous zero-free strip certificate,
a collision-exclusion continuation with a uniform tail theorem, or an
explicit collective-field certificate. The exact coupling must survive
the approximation. See `analytic_continuation.md` for the two-end theorem
and the subsequent obstruction to an unrestricted uniform tail shortcut;
see `collective_certificate.md` for a usable approximation/error interface.

## References

- D. H. J. Polymath, *Effective approximation of heat flow evolution of the
  Riemann xi function, and a new upper bound for the de Bruijn–Newman
  constant*, [arXiv:1904.12438v2](https://arxiv.org/html/1904.12438v2).
- B. Rodgers and T. Tao, *The de Bruijn–Newman constant is non-negative*,
  [arXiv:1801.05914v5](https://arxiv.org/abs/1801.05914v5).
- G. Csordas, *Fourier transforms of positive definite kernels and the
  Riemann xi-function*, Theorem 4.2(b),
  [arXiv:1309.0055v2](https://arxiv.org/pdf/1309.0055v2).
- Prior checkpoint [69d4049f](https://github.com/[user]/mathexplorer/tree/69d4049f289217812051188378a0a9f3f061a169/rigorous/theta-bridge-2026-11-08),
  especially `geometry_and_twistors.md`, `theta_boundary_energy.md`, and
  `theta_boundary_two_point.md`. That checkpoint remains a separate PR.
