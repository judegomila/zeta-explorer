# Candidate finite-compression multiplier trace bound

> Historical candidate.  The Montgomery--Vaughan route in this file remains
> non-admitted, but it is no longer needed: the self-contained dyadic
> logarithmic-Hilbert proof in
> `notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md` establishes the same
> polynomial finite-compression scale with explicit constants and no new
> external source.

## 1. Admission status

This note records the earlier schedule-sensitive alternative to the global
phase-volume estimate in
`notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md`.  It reduces the finite
compressed dangerous rank to polynomial scale under an explicit growth
hypothesis on the shift.

The derivation uses one external theorem which is **not yet admitted to a
repository source lock**: Montgomery--Vaughan, *Hilbert's Inequality*,
J. London Math. Soc. (2) 8 (1974), 73--82, Theorem 2 (1.7) and Corollary 2
(1.8)--(1.9), DOI `10.1112/jlms/s2-8.1.73`.  An author-hosted scan is at
`https://personal.science.psu.edu/rcv4/personal/Publications/s2-8-1-73.pdf`.
The constant `3*pi/2` was checked against the primary scan, but the PDF bytes
have not been vendored or SHA-256 pinned.  Consequently the
Montgomery--Vaughan derivation below supports no component flag or admitted
claim.  The separate self-contained successor theorem, not this candidate,
is the admitted component.

No zero table, reality assumption, or Weil positivity enters the candidate.
Even after source admission it would not prove the finite Schur complement,
a signed sector floor, equation (5.2), or RH.

## 2. Exact compressed spectral density

Put

\[
 x=\lambda^2,\qquad L=\log x=2\log\lambda,
 \qquad d=2N+1,
 \qquad \omega_n=\frac{2\pi n}{L}.
\]

Assume throughout this finite-compression calculation that `N>=1`.

For the centered locked source modes,

\[
 \widehat\phi_n(t)
 =\frac{2\sin(tL/2)}{\sqrt L(t-\omega_n)},
\]

with the removable values understood.  Define

\[
 K_N(t)=\sum_{|n|\le N}|\widehat\phi_n(t)|^2.                \tag{2.1}
\]

The partial-fraction identity

\[
 \sum_{n\in\mathbb Z}\frac1{(z-n)^2}
 =\frac{\pi^2}{\sin^2\pi z}
\]

and angular Plancherel give the exact facts

\[
 0\le K_N(t)\le L,
 \qquad
 \int_{\mathbb R}K_N(t)\frac{dt}{2\pi}=d.                  \tag{2.2}
\]

Let

\[
 \Omega=\frac{2\pi N}{L},\qquad
 R=(1+\eta)\Omega,\qquad\eta>0.
\]

For `|t|>=R`, every denominator in (2.1) is at least
`|t|-Omega`, and hence

\[
 K_N(t)\le\frac{4d}{L(|t|-\Omega)^2}.                        \tag{2.3}
\]

## 3. Central and tail trace bounds

Retain the exact complete multiplier

\[
 m_\lambda(t)=2\theta'(t)-2S_\lambda(t),
 \qquad
 S_\lambda(t)=\sum_{p^r\le x}
   \frac{\log p}{p^{r/2}}\cos(rt\log p),                    \tag{3.1}
\]

and set

\[
 B=U+g,\qquad v(t)=[B-m_\lambda(t)]_+.
\]

Use the exact inclusive sums

\[
 \Sigma=\sum_{p^r\le x}\frac{\log p}{p^{r/2}},
 \quad
 A_2=\sum_{p^r\le x}\frac{(\log p)^2}{p^r},
 \quad
 B_2=\sum_{p^r\le x}(\log p)^2,                              \tag{3.2}
\]

and

\[
 c_0=\psi(1/4)-\log\pi,
 \quad
 A_+=(B+2\Sigma-c_0)_+,
 \quad
 C_+=(B-c_0)_+.
\]

The locked digamma lower bound gives on the tail

\[
 v(t)\le A_+.
\]

Equations (2.3) and `R-Omega=eta Omega` therefore give

\[
 \int_{|t|\ge R}v(t)K_N(t)\frac{dt}{2\pi}
 \le\frac{2dA_+}{\pi^2\eta N}.                              \tag{3.3}
\]

On `|t|<=R`, put

\[
 b(t)=B-c_0-\frac12\log(1+4t^2).
\]

Then

\[
 v(t)\le b(t)_++2|S_\lambda(t)|.                            \tag{3.4}
\]

Define

\[
 H_N=\int_{-R}^{R}K_N(t)b(t)_+\frac{dt}{2\pi},
 \qquad
 M_2(R)=\int_{-R}^{R}S_\lambda(t)^2\frac{dt}{2\pi}.         \tag{3.5}
\]

Weighted Cauchy--Schwarz with (2.2) proves

\[
 \int_{-R}^{R}2|S_\lambda(t)|K_N(t)\frac{dt}{2\pi}
 \le2\sqrt{dL M_2(R)}.                                      \tag{3.6}
\]

Moreover,

\[
 H_N\le\min\left\{dC_+,\frac{L}{2\pi}F(C_+)\right\},       \tag{3.7}
\]

where `F(0)=0` and, for `C>0`,

\[
 F(C)=\sqrt{e^{2C}-1}-\arctan\sqrt{e^{2C}-1}.                \tag{3.8}
\]

This is the same exact logarithmic-envelope integral as equation (4.12) of
the parity reduction, but weighted by the finite compression before the
global trace is taken.

## 4. Candidate Montgomery--Vaughan insertion

Put

\[
 D(t)=\sum_{1<n\le x}\frac{\Lambda(n)}{\sqrt n}e^{it\log n},
 \qquad S_\lambda(t)=\operatorname {Re}D(t).                 \tag{4.1}
\]

For distinct integer frequencies `n,m<=x`,

\[
 |\log n-\log m|\ge\log(1+1/n)\ge\frac{2}{3n}.              \tag{4.2}
\]

The weighted Hilbert inequality with the original valid constant
`3*pi/2`, applied at both endpoints of an interval of length `2R`, gives

\[
 \int_{-R}^{R}|D(t)|^2dt
 \le2R A_2+\frac{9\pi}{2}B_2.                                \tag{4.3}
\]

Also every frequency in `D(t)^2` is at least `2 log 2`, so direct integration
gives

\[
 \left|\int_{-R}^{R}D(t)^2dt\right|
 \le\frac{\Sigma^2}{\log2}.                                 \tag{4.4}
\]

Since `(Re D)^2=(|D|^2+Re D^2)/2`, equations (4.3)--(4.4) imply

\[
\boxed{
 M_2(R)\le
 \frac{RA_2}{2\pi}+\frac98B_2
 +\frac{\Sigma^2}{4\pi\log2}.}                             \tag{4.5}
\]

Combining (3.3), (3.6), (3.7), and (4.5) yields the finite candidate bound

\[
\boxed{
 \operatorname {tr}(P_NT_vP_N)
 \le H_N+2\sqrt{dL M_2(R)}
       +\frac{2dA_+}{\pi^2\eta N}.}                         \tag{4.6}
\]

Every arithmetic sum in (4.6) is the inclusive prime-power sum reconstructed
from `lambda`; no global phase volume appears.

## 5. Conditional polynomial-scale consequence

Pinned PNT partial summation gives the qualitative sizes

\[
 A_2=O(L^2),\qquad B_2=O(xL),\qquad\Sigma=O(\sqrt x).
\]

Suppose an explicit diagonal, with fixed `eta>0`, has

\[
 N\asymp x,\qquad U=o(L),\qquad
 g=\kappa L,\quad0<\kappa<1,
 \qquad\delta=\rho g,\quad0<\rho<1.                         \tag{5.1}
\]

Then `R=O(x/L)`, (3.7) is
`O(L x^(kappa+o(1)))=o(xL)`, (4.5) is
`O(xL)`, and (4.6) gives

\[
 \operatorname {tr}(P_NT_vP_N)=O(xL).                       \tag{5.2}
\]

After division by `g-delta`, the dangerous rank is `O(x)=O(lambda^2)`.
In the odd sector, equation (5.8) of the parity reduction shows that the
pole adds at most one additional direction.

This bypasses the fixed-moment obstruction for the **finite compression**.
It does not show that the resulting constant is below the available prolate
transition budget, prove the Schur complement on that `O(lambda^2)` space,
or establish the shift hypothesis in (5.1).  Second-moment information alone
is too coarse to force a strict transition-space fraction: the standard
stop-loss estimate at the natural variance scale gives
`1/(4 kappa(1-kappa))>=1`.
