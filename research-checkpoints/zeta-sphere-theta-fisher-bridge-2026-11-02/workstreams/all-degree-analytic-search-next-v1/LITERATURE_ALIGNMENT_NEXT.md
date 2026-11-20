# Literature alignment of the endpoint blocker

## Scope

This note identifies the endpoint density in this workstream with a named
Laguerre inequality for the Riemann Xi function.  The identification is an
exact normalization calculation.  It does not prove the inequality, prove
RH, or establish that no post-2014 proof exists.  A targeted primary-source
search performed on 2026-11-03 found the original open problem and no
authoritative resolution.

## Exact normalization

The present complete-theta profile is, for `h >= 0`,

\[
 \psi(h)=\sum_{n\geq1}4z_n(2z_n-3)e^{h/2-z_n},
 \qquad z_n=\pi n^2e^{2h}.                         \tag{1}
\]

Csordas uses the Jacobi-theta kernel

\[
 \Phi(t)=\sum_{n\geq1}\pi n^2
 (2\pi n^2e^{4t}-3)e^{5t-\pi n^2e^{4t}}.          \tag{2}
\]

Putting `h=2t` in (1) gives the exact relation

\[
 \boxed{\psi(2t)=4\Phi(t).}                        \tag{3}
\]

In Csordas' notation,

\[
 H(x)=\int_0^\infty\Phi(t)\cos(xt)\,dt
     ={1\over8}\Xi(x/2),                          \tag{4}
\]

where the last equality follows either from his displayed normalization or
from (3) and `widehat psi(nu)=2 Xi(nu)`.  Consequently

\[
 \Xi(\nu)=8H(2\nu)                                 \tag{5}
\]

and therefore

\[
 \boxed{
 \Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu)
 =256\{H'(2\nu)^2-H(2\nu)H''(2\nu)\}.}            \tag{6}
\]

Thus the sign of the endpoint density in
`SPECTRAL_DEFECT_CLOSURE.md` is exactly the sign in Csordas' Open Problem
4.7, up to the positive constant and the harmless dilation in (6).

The real-space kernels agree just as exactly.  With

\[
 K_1(r)=\int_{\mathbb R}s^2\Phi(s+r)\Phi(s-r)\,ds,                 \tag{7}
\]

the conditional-variance profile in `THETA_TURAN_NEXT.md` satisfies

\[
\begin{aligned}
 R(u)
 &=\frac1{16}\int_{\mathbb R}v^2
   \psi\!\left(\frac{u+v}{2}\right)
   \psi\!\left(\frac{u-v}{2}\right)dv\\
 &=\boxed{64K_1(u/4)}.                              \tag{8}
\end{aligned}
\]

Thus positive definiteness of `R` is precisely positive definiteness of
Csordas' associated `K_1`, again up to a positive scale and dilation.  His
Proposition 3.10 also supplies an equivalent scalar sine-tail criterion.  If
`Gbar(t)=integral_t^infinity K_1(s)ds` and `A=Gbar(0)`, then the missing sign
is equivalent to

\[
 \int_0^\infty \overline G(t)\sin(xt)\,dt\leq {A\over x}
 \qquad(x>0).                                      \tag{9}
\]

This is a potentially useful proof target, not a known consequence of the
pointwise positivity or log-concavity already available.

## Consequence for the all-prefix target

The polynomial-density closure already proved in this workstream says,
separately in either parity ladder,

\[
 \mathfrak q(p)\geq0\text{ for every parity polynomial }p
 \quad\Longleftrightarrow\quad
 \Xi'^2-\Xi\Xi''\geq0\text{ on }\mathbb R.         \tag{10}
\]

Equations (6) and (10) show that an all-degree proof of the directional
paid-Schur inequality would settle Open Problem 4.7.  Conversely, a proof of
that Laguerre inequality would make every endpoint moment Gram positive
semidefinite and close every nonsingular endpoint Schur pivot.  The present
directional inequality is therefore a finite-prefix coordinate form of this
known hard Fourier-sign problem, not a generic regression estimate waiting
for a routine Cauchy bound.

This alignment also sharpens the nonclaim.  The first Laguerre inequality is
necessary, but not sufficient in general, for a real entire function to have
only real zeros.  Csordas gives the explicit counterexample
`e^(-x^2)(1+x^2)`, which has nonreal zeros while its first Laguerre
expression is nonnegative.  Hence solving (6) would be significant but would
not, by this fact alone, prove RH.

## Primary-source record

- George Csordas, *Fourier transforms of positive definite kernels and the
  Riemann xi-Function*, records
  `H(x)=Xi(x/2)/8`, represents its generalized Laguerre expressions by the
  associated kernels, and states
  `H'(x)^2-H(x)H''(x)>=0` as Open Problem 4.7:
  <https://arxiv.org/abs/1309.0055>.
- The same paper emphasizes that the first Laguerre inequality is only a
  necessary condition in general and that positive definiteness of the
  associated `K_1` kernel is the hard step.
- The 2026 arXiv preprint by Michel Planat and Patrick Sole,
  *Second-Level Concavity of the Riemann Xi Kernel*, proves a different
  statement: log-concavity of the first
  Laguerre expression of `s(t)=Phi(sqrt(t))`, a function of the theta kernel
  before Fourier transformation.  Its abstract explicitly makes no RH
  assertion.  It must not be substituted for (6):
  <https://arxiv.org/abs/2608.19160>.
- Suvrit Sra, *On some positivity properties of the Riemann Xi function*
  (arXiv preprint, submitted 2026-11-02), proves all generalized Laguerre
  inequalities only on the finite interval supplied by published zero
  verification.  Its introduction explicitly states that the global first
  Laguerre inequality remains open:
  <https://arxiv.org/abs/2611.02944>.

The last source is current primary-source evidence for the open status as of
2026-11-02, not a guarantee against a later result.  Any claimed closure
should still be checked against current expert literature.

## Proof-design implication

The useful remaining target is source-specific positive definiteness of the
conditional-variance kernel `R` in `THETA_TURAN_NEXT.md`, the sine-tail
inequality (9), or equivalently a direct proof of (6).  Kernel
log-concavity, pointwise positivity, the 2026
second-level theta-kernel theorem, and separate orbit positivity do not by
themselves supply that Fourier sign.
