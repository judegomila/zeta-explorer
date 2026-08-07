# Exact leading prolate oscillation theorem

Status: exact variational component theorem.  It supplies the growing-index
inequality `mu_n<c^2` needed by the physical-tail estimates, without adding
an external asymptotic or a numerical eigenvalue table.  It does not bound a
concentration defect from below, compare the signed Weil form, prove a sector
floor, establish equation (5.2), or prove RH.  The project status remains
`P0_INVALIDATED`.

## 1. Locked differential convention

On `(-1,1)` use the prolate quadratic form

\[
 q_c[y]=\int_{-1}^1(1-x^2)|y'(x)|^2\,dx
       +c^2\int_{-1}^1x^2|y(x)|^2\,dx,             \tag{1.1}
\]

on the natural Legendre form domain

\[
 \mathcal V=\{y\in L^2(-1,1):y\in H^1_{\rm loc}(-1,1),
          \sqrt{1-x^2}\,y'\in L^2(-1,1)\}.                \tag{1.2}
\]

Its associated natural self-adjoint realization is

\[
 \mathcal D_c y=-((1-x^2)y')'+c^2x^2y.             \tag{1.3}
\]

Write its variational eigenvalues, counted from zero and with multiplicity,
as

\[
 \mu_n(c)=\inf_{\substack{S\subset\mathcal V\\\dim S=n+1}}
       \ \sup_{0\ne y\in S}{q_c[y]\over\|y\|_2^2},
 \qquad \mu_0(c)\le\mu_1(c)\le\cdots.             \tag{1.4}
\]

Only this min--max definition and the inclusion
`H_0^1(-1,1) subset V` are used below; simplicity is not assumed.  The
repository conversion is

\[
 c=2\pi\lambda^2,\qquad {2c\over\pi}=4\lambda^2. \tag{1.5}
\]

## 2. An exact packet identity

Let `c>0`, put

\[
 \ell={\pi\over c},\qquad r=\left\lfloor{2c\over\pi}\right\rfloor,
                                                               \tag{2.1}
\]

and suppose `r>=1`.  Choose `r` pairwise disjoint intervals
`I_j=[a_j,a_j+ell]` inside `[-1,1]`.  On each interval define

\[
 \phi_j(x)=
 \begin{cases}
  \sin\!\left({\pi(x-a_j)\over\ell}\right),&x\in I_j,\\
  0,&x\notin I_j.
 \end{cases}                                                 \tag{2.2}
\]

These functions belong to `H_0^1(-1,1)`.  Their unweighted norm is

\[
 \|\phi_j\|_2^2={\ell\over2}.                       \tag{2.3}
\]

For an independently replayable algebraic derivation, put
`J_k=integral_0^1 u^k cos(2*pi*u)du`.  Direct integration by parts, using
`sin(2*pi)=0` and `cos(2*pi)=1`, gives the exact scaled identities

\[
 \pi J_0=0,\qquad \pi^2J_1=0,\qquad \pi^2J_2={1\over2}.    \tag{2.4}
\]

After `t=ell*u`, these become the only three Fourier moments needed:

\[
 \int_0^\ell\cos{2\pi t\over\ell}\,dt=0,
 \qquad
 \int_0^\ell t\cos{2\pi t\over\ell}\,dt=0,
\]

\[
 \int_0^\ell t^2\cos{2\pi t\over\ell}\,dt
 ={\ell^3\over2\pi^2}.                              \tag{2.5}
\]

Since `1-(a_j+t)^2` has quadratic coefficient `-1`, equations
(2.1)--(2.5) give the exact identity

\[
\begin{aligned}
 q_c[\phi_j]-c^2\|\phi_j\|_2^2
 &=c^2\int_0^\ell
   (1-(a_j+t)^2)\cos{2\pi t\over\ell}\,dt\\
 &=-{c^2\ell^3\over2\pi^2}
 =-{\ell\over2}
 =-\|\phi_j\|_2^2.                              \tag{2.6}
\end{aligned}
\]

The result is independent of the packet position.  In particular, the
strict margin is exact rather than asymptotic.  The producer and verifier
serialize the three scaled identities in (2.4), reconstruct (2.5), and only
then derive (2.6).

## 3. Growing-index theorem

**Theorem 1 (leading prolate oscillation).**  For every `c>0` with
`r=floor(2c/pi)>=1`,

\[
 \boxed{\mu_{r-1}(c)\le c^2-1<c^2.}              \tag{3.1}
\]

Consequently

\[
 \mu_n(c)\le c^2-1<c^2,
 \qquad 0\le n<\left\lfloor{2c\over\pi}\right\rfloor. \tag{3.2}
\]

**Proof.**  The supports in (2.2) are disjoint up to endpoints.  Hence every
`y=sum_j z_j phi_j` satisfies, with no cross terms,

\[
 q_c[y]=(c^2-1)\|y\|_2^2.                         \tag{3.3}
\]

The span has dimension `r` and lies in `H_0^1(-1,1) subset V`.  The
variational definition (1.4) applied to this trial space gives (3.1), and
eigenvalue ordering gives (3.2).  No prolate
eigenvalue or eigenvector is read numerically.  \(\square\)

## 4. Exact locked-schedule specialization

On the project schedule write

\[
 \lambda={p\over2},\qquad p\ge5\text{ odd}.
\]

Then

\[
 c={\pi p^2\over2},\qquad
 r={2c\over\pi}=p^2=4\lambda^2,
 \qquad \ell={2\over p^2}={1\over2\lambda^2}.    \tag{4.1}
\]

The intervals

\[
 I_j=\left[-1+{2j\over p^2},-1+{2(j+1)\over p^2}\right],
 \qquad 0\le j<p^2,                              \tag{4.2}
\]

tile `[-1,1]` exactly.  Every packet has

\[
 \|\phi_j\|_2^2={1\over p^2},\qquad
 q_c[\phi_j]-c^2\|\phi_j\|_2^2=-{1\over p^2}.   \tag{4.3}
\]

Thus

\[
 \boxed{\mu_n(2\pi\lambda^2)\le
        (2\pi\lambda^2)^2-1
        \quad(0\le n<4\lambda^2).}              \tag{4.4}
\]

All source targets in the leading plus family
`{8,12,16,...,4lambda^2-1}` and leading minus family
`{6,10,14,...,4lambda^2-3}`, when present, therefore satisfy the oscillatory
hypothesis `mu_n<c^2`.

## 5. Consequence for the graph-action program

The endpoint, Volterra, and complete sampled-tail estimates in
`notes/PROLATE_TAIL_ENVELOPE.md` and
`notes/OUTER_OUTER_ENDPOINT_OBSTRUCTION.md` assume `mu_n<c^2`.  Previously
the repository verified that premise only for the fixed labels `0` and `4`.
Equation (4.4) verifies it uniformly for the complete leading family on the
locked schedule.

This removes one input to the proposed growing-family hybrid sampling
theorem.  It does not by itself prove that theorem.  The next step must still
collect the modewise bounds relative to the complete exterior-defect Gram,
control the invisible origin correction and projection remainder uniformly,
and retain every sampling cross term.  Even after the positive graph-action
bound is closed, the signed finite Schur/leverage comparison remains a
separate obligation.

## 6. Claim boundary and regressions

The theorem proves only the differential inequality (3.2)/(4.4).  In
particular:

- it does not turn the KRD leading upper bound on `d_n` into a lower bound;
- it does not assert `Lambda_n>=1/2` or use a Landau median theorem;
- it does not assume a real-zero list or global Weil positivity;
- it does not infer a signed Weil-sector floor from a positive prolate form;
- it does not establish locally uniform determinant convergence.

The exact replay must reject an extra transition index, `lambda` in place of
`lambda^2`, a packet length other than `pi/c`, loss of the minus sign in
(2.6), binary64 parameters, or promotion of the component to equation (5.2)
or an RH conclusion.
