# Tail-discrepancy normal form for the transverse endpoint Schur gate

## 0. Claim boundary and outcome

This note combines the weighted-PNT normal form with the endpoint Schur
gate without separating the pole, archimedean, and prime contributions.
It proves two finite source identities.

1. After the source scalar has been removed, the complete Weil form is one
   ordinary integral of a **cumulative tail discrepancy** against the
   derivative of the zero-extension translation correlation.
2. The combined endpoint vector
   `s=D(Q_+-q)kappa-(delta kappa)beta` and its inverse-weighted transverse
   load are therefore one explicit signed-discrepancy functional.  No
   separate norm of either term in `s` occurs.

An exact `N=2` killed-jump model at the genuine prime shift `log 2` then
shows the limitation sharply.  The model has a positive Dirichlet form, a
nonzero source commutator vector, a positive directional scalar, and a
positive transverse compression, but its scalar Schur short is negative.
Thus positivity of the unshifted prime Dirichlet form cannot supply the
missing live-shift correlation inequality.

The identities are a new normal form, not the missing asymptotic estimate.
They prove no transverse sign for the actual arithmetic family, no
equation (5.2) of `DIRECT_RH_ATTACK.md`, no determinant limit, and no
Riemann-hypothesis conclusion.  The formal project state remains
`P0_INVALIDATED`.

The binding source and conventions are those pinned in
`P0_SOURCE_LOCK.json`: Connes--Consani--Moscovici, *Zeta Spectral Triples*,
arXiv:2511.22755v1, source equations (3.5), (3.8)--(3.16), (3.19), and
(4.1)--(4.4).  In particular, the prime block keeps the minus sign from
source equation (3.19), and the inventory includes every prime power
`n<=lambda^2`.

## 1. Locked tail and discrepancy data

Put

\[
 a=\log\lambda,\qquad L=2a,\qquad I=[-a,a],            \tag{1.1}
\]

use Lebesgue measure, and extend every function by zero outside `I`.  For
`h>=0`, let

\[
 (K_hf)(x)=\widetilde f(x+h)+\widetilde f(x-h).         \tag{1.2}
\]

Define the global weighted discrepancy, and let `D_lambda` denote its
restriction to the finite source interval `[0,L]`:

\[
 D_\infty(h)=
 \sum_{1<n\leq e^h}{\Lambda(n)\over\sqrt n}
       -2(e^{h/2}-1),\qquad h\geq0,
 \qquad D_\lambda=D_\infty|_{[0,L]}.                  \tag{1.3}
\]

The global object is used only for the Laplace audit in (2.7).  Every
finite form below uses `D_lambda`; prime powers larger than `lambda^2`
never enter the finite operator.

The pole-cancelled archimedean tail is

\[
 \omega_{\rm tail}(h)={e^{-5h/2}\over1-e^{-2h}},
 \qquad h>0.                                           \tag{1.4}
\]

Thus, with the right-continuous inclusive endpoint convention,

\[
 dD_\lambda(h)=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
       \delta_{\log n}(dh)-e^{h/2}\,dh.                \tag{1.5}
\]

Define the tail primitive and the global cumulative tail discrepancy by

\[
 H_{\rm tail}(t)=\int_t^\infty\omega_{\rm tail}(u)\,du,
 \qquad
 \boxed{\mathcal F_\infty(t)=D_\infty(t)-H_{\rm tail}(t),\qquad t>0.}
                                                               \tag{1.6}
\]

For the finite source form, write

\[
 \mathcal F=\mathcal F_\infty|_{(0,L]}
            =D_\lambda-H_{\rm tail}|_{(0,L]}.        \tag{1.6a}
\]

If `r=exp(-t/2)`, the full archimedean primitive in
`notes/BOUNDARY_DISCREPANCY_CONVOLUTION_REDUCTION.md` gives the exact closed
form

\[
 \boxed{
 H_{\rm tail}(t)=
 {1\over2}\log {1+r\over1-r}+\arctan r-2r.}            \tag{1.7}
\]

In particular,

\[
 d\mathcal F=dD_\lambda+\omega_{\rm tail}(t)\,dt.      \tag{1.8}
\]

Let

\[
 c_*=\psi(1/4)-\log\pi+4.                             \tag{1.9}
\]

The exact weighted-PNT normal form is

\[
 \langle f,Q_\lambda g\rangle
 =c_*\langle f,g\rangle+\mathfrak h_\lambda(f,g),      \tag{1.10}
\]

where

\[
\begin{aligned}
 \mathfrak h_\lambda(f,g)
 ={}&\int_0^\infty
 \{2\langle f,g\rangle-\langle f,K_hg\rangle\}
       \omega_{\rm tail}(h)\,dh\\
 &-\int_{[0,L]}\langle f,K_hg\rangle\,dD_\lambda(h).
                                                               \tag{1.11}
\end{aligned}
\]

The first integrand in (1.11) must remain combined at zero.  Its two terms
are separately divergent.

## 2. Exact cumulative-discrepancy collapse

For finite source Fourier vectors define

\[
 C_{f,g}(h)=\langle f,K_hg\rangle,
 \qquad 0\leq h\leq L.                               \tag{2.1}
\]

Zero extension gives

\[
 C_{f,g}(0)=2\langle f,g\rangle,
 \qquad C_{f,g}(L)=0.                                 \tag{2.2}
\]

The correlation is absolutely continuous on `[0,L]`.  At zero,
`2< f,g >-C_(f,g)(h)=O(h)`, while `mathcal F(h)=O(|log h|)`, so the product
of these two quantities tends to zero.

### Theorem 2.1 (tail-discrepancy form)

For every pair of finite source Fourier vectors,

\[
 \boxed{
 \mathfrak h_\lambda(f,g)
 =\int_0^L\mathcal F(h)C_{f,g}'(h)\,dh.}              \tag{2.3}
\]

The identity includes a prime-power atom at `h=L` correctly.  Such an atom
is annihilated by `C_(f,g)(L)=0`; it is not removed from the inventory.

**Proof.**  Put `C_0=2< f,g >` and `R(h)=C_0-C_(f,g)(h)`.  Since `K_h=0`
for `h>=L` up to null endpoints, (1.11) becomes

\[
\begin{aligned}
 \mathfrak h_\lambda(f,g)
 ={}&\int_0^L R(h)\omega_{\rm tail}(h)\,dh
      +C_0H_{\rm tail}(L)\\
 &-C_0D_\lambda(L)+\int_{[0,L]}R(h)\,dD_\lambda(h)\\
 ={}&\int_{[0,L]}R(h)\,d\mathcal F(h)-C_0\mathcal F(L).
                                                               \tag{2.4}
\end{aligned}
\]

Here `R(0)=0`, `R(L)=C_0`, and the zero-end product just noted vanishes.
Stieltjes integration by parts, including the possible endpoint jump, gives

\[
 \int_{[0,L]}R\,d\mathcal F
 =C_0\mathcal F(L)-\int_0^L\mathcal F(h)R'(h)\,dh.
                                                               \tag{2.5}
\]

Since `R'=-C_(f,g)'`, (2.3) follows.  \(\square\)

This proof explains the sign in (2.3).  The atomic part of (1.5) still
enters (1.11) as `-<f,K_(log n)g> Lambda(n)/sqrt(n)`.  The plus sign in
`d mathcal F=dD_lambda+omega_tail dh` does not reverse the source minus-prime
convention; it is followed by the integration by parts in (2.5).

There is also an exact completed-function check.  If `F_infty` denotes the
global full-boundary discrepancy of the boundary-convolution note, then

\[
 \mathcal F_\infty(t)=F_\infty(t)+2e^{-t/2}.           \tag{2.6}
\]

Its safe-half-plane Laplace transform simplifies to

\[
 \boxed{
 \int_0^\infty\left(\mathcal F_\infty(t)-{c_*\over2}\right)e^{-st}\,dt
 =-{1\over s}{\xi'\over\xi}\!\left({1\over2}+s\right),
 \qquad \Re s>{1\over2}.}                            \tag{2.7}
\]

Indeed, adding `2/(s+1/2)` to the locked transform of `F-c_*/2` cancels
both elementary rational terms.  Formula (2.7) is an audit of all constants
in (1.6), not a sign theorem.  Continuing it toward the critical axis is
zero-sensitive and cannot be used as an unconditional bound.

## 3. The combined endpoint vector and exact inverse load

Let `kappa` be the normalized projected even source state and put

\[
 q=\langle\kappa,Q_+\kappa\rangle,
 \quad r=(Q_+-qI)\kappa,
 \quad d=\delta\kappa,
 \quad x=D\kappa\ne0.                                \tag{3.1}
\]

In this section, the argument-free `D` is the integer Fourier-mode
derivative.  The weighted discrepancy from Section 1 always appears as
`D_lambda(t)`, `D_infty(t)`, or through `mathcal F`; the objects are not
identified.

The source commutator gives the **combined** vector

\[
 \boxed{s=Dr-d\beta=(Q_--qI)x.}                       \tag{3.2}
\]

Let `y=x/||x||`, `G=y^perp`, and

\[
 B_\perp=P_G(Q_--qI)P_G|_G,
 \qquad c_\perp={P_Gs\over\|x\|}.                   \tag{3.3}
\]

For `z,w in G`, Theorem 2.1 gives the source-specific transverse form

\[
 \boxed{
 \langle z,B_\perp w\rangle
 =(c_*-q)\langle z,w\rangle
   +\int_0^L\mathcal F(h)C_{z,w}'(h)\,dh.}            \tag{3.4}
\]

The scalar direction and cross functional are

\[
 \boxed{
 a={\langle x,s\rangle\over\|x\|^2}
 =c_*-q+\int_0^L\mathcal F(h)C_{y,y}'(h)\,dh,}       \tag{3.5}
\]

\[
 \boxed{
 \langle z,c_\perp\rangle
 ={\langle z,s\rangle\over\|x\|}
 =\int_0^L\mathcal F(h)C_{z,y}'(h)\,dh,
 \qquad z\in G.}                                    \tag{3.6}
\]

Thus neither `Dr` nor `d beta` appears separately in the transverse
functional.  The source scalar disappears from (3.6) because `z` is
orthogonal to `y`.

If `B_perp>0`, its inverse-weighted load is exactly

\[
 \boxed{
 \langle c_\perp,B_\perp^{-1}c_\perp\rangle
 =\sup_{0\ne z\in G}
 {\left|\displaystyle\int_0^L
       \mathcal F(h)C_{z,y}'(h)\,dh\right|^2
  \over
  (c_*-q)\|z\|^2+
       \displaystyle\int_0^L
       \mathcal F(h)C_{z,z}'(h)\,dh}.}               \tag{3.7}
\]

Consequently the endpoint Schur gate is the single signed-correlation
inequality

\[
 \boxed{
 B_\perp>0,\qquad
 c_*-q+\int_0^L\mathcal F C_{y,y}'
 >\sup_{0\ne z\in G}
 {\left|\int_0^L\mathcal F C_{z,y}'\right|^2
  \over (c_*-q)\|z\|^2+\int_0^L\mathcal F C_{z,z}'}.} \tag{3.8}
\]

This is necessary and sufficient for `q<lambda_min(Q_-)`.  It is not a
new sufficient estimate: (3.8) exposes exactly the still-unproved source
correlation.  Total-variation or separate absolute bounds on `D_lambda`
and `H_tail` discard the signed cancellation in every integral in (3.8).

## 4. Exact single-prime-shift Dirichlet countermodel

The following model uses the exact zero-extension translation geometry and
a genuine source prime shift and weight, but it is not the full arithmetic
operator.

Take

\[
 \lambda=4,\qquad L=4\log2,\qquad h=\log2={L\over4},
 \qquad w={\Lambda(2)\over\sqrt2}={\log2\over\sqrt2}, \tag{4.1}
\]

and compress to the modes `-2<=n<=2`.  Define

\[
 Q^{\rm J}=w(3I-K_h)=wI+w(2I-K_h).                    \tag{4.2}
\]

The second summand is the symmetric killed-jump Dirichlet form, so

\[
 Q^{\rm J}\succeq wI>0.                              \tag{4.3}
\]

For exact arithmetic, multiply by the positive scalar `pi/w` and write
`Q_tilde=(pi/w)Q^J=pi(3I-K_h)`.  In the normalized parity bases

\[
 e_0^+=V_0,\quad e_n^+={V_n+V_{-n}\over\sqrt2},\quad
 e_n^-={V_n-V_{-n}\over\sqrt2},                     \tag{4.4}
\]

direct zero-extension integration gives

\[
 \boxed{
 \widetilde Q_+=
 \begin{pmatrix}
  3\pi/2&\sqrt2&0\\
  \sqrt2&3\pi+1&-2/3\\
  0&-2/3&9\pi/2
 \end{pmatrix},\qquad
 \widetilde Q_-=
 \begin{pmatrix}
  3\pi-1&-4/3\\
  -4/3&9\pi/2
 \end{pmatrix}.}                                    \tag{4.5}
\]

Its Cauchy coefficients are

\[
 \widetilde b_n=\sin(\pi n/2),\qquad
 \widetilde\beta_-=\binom{\sqrt2}{0},\qquad
 \eta_+=\begin{pmatrix}1\\\sqrt2\\\sqrt2\end{pmatrix}. \tag{4.6}
\]

With

\[
 D=\begin{pmatrix}0&1&0\\0&0&2\end{pmatrix},       \tag{4.7}
\]

one checks exactly that

\[
 D\widetilde Q_+-\widetilde Q_-D
 =|\widetilde\beta_-\rangle\langle\eta_+|.          \tag{4.8}
\]

Thus the endpoint correction is nonzero; this is not a commuting diagonal
example.

Choose

\[
 \kappa={e_0^++e_1^++e_2^+\over\sqrt3},\qquad
 \rho={2\sqrt2\over3}-{1\over9}.                    \tag{4.9}
\]

Then

\[
 \widetilde q=3\pi+\rho,\qquad
 d={1+2\sqrt2\over\sqrt3},\qquad
 x={e_1^-+2e_2^-\over\sqrt3}.                       \tag{4.10}
\]

Writing `r_tilde=(Q_tilde_+-q_tilde)kappa`, the two terms in the endpoint
commutator combine as

\[
\boxed{
 D\widetilde r-d\widetilde\beta
 ={1\over\sqrt3}
 \binom{-11/3-\rho}{3\pi-4/3-2\rho}
 =(\widetilde Q_--\widetilde qI)x.}                 \tag{4.11}
\]

Dropping `-d beta` makes (4.11) false.

Let

\[
 y={1\over\sqrt5}\binom{1}{2},\qquad
 z={1\over\sqrt5}\binom{-2}{1}.                    \tag{4.12}
\]

The scalar direction, transverse scalar, and cross term of
`Q_tilde_- - q_tilde I` are

\[
\begin{aligned}
 a&={6\pi\over5}-{2\sqrt2\over3}-{52\over45},\\
 b&={3\pi\over10}-{2\sqrt2\over3}+{17\over45},\\
 c&={3(\pi+2)\over5}.                               \tag{4.13}
\end{aligned}
\]

The elementary bounds `3<pi<22/7` and `sqrt(2)<3/2` give

\[
 a>{13\over9}>0,\qquad b>{5\over18}>0.              \tag{4.14}
\]

On the other hand, they also give

\[
 a<4,\qquad b<{4\over3},\qquad c>3,                 \tag{4.15}
\]

and hence

\[
 ab-c^2<{16\over3}-9<0,\qquad
 \boxed{a-{c^2\over b}<0.}                          \tag{4.16}
\]

The positive scaling between `Q^J` and `Q_tilde` preserves every sign.
Therefore this exact killed-jump model has `a>0` and `B_perp>0`, yet fails
the inverse-weighted endpoint Schur gate.

The model deliberately omits the other prime powers and the archimedean
tail, so it says nothing about the sign of the actual finite source matrix.
It proves a narrower logical point: the correct prime sign and location,
positive jump weight, positive killed-jump Dirichlet form, exact Cauchy
commutator, nonzero endpoint correction, positive directional value, and
positive transverse floor do not imply the required shifted correlation
short.  Any successful argument must use additional information about the
complete arithmetic cumulative discrepancy in (3.8).

## 5. Audited stopping point

The four audited reductions are consistent:

1. the weighted-PNT scalar is `c_*`, and the residual form is
   `A_tail-T_D`;
2. the full boundary primitive differs from the tail primitive by exactly
   `2 exp(-t/2)`, producing the pure completed logarithmic derivative in
   (2.7);
3. the pole-deleted positive Levy form is evaluated at a live spectral
   shift, so unshifted Dirichlet Cauchy--Schwarz does not control (3.7); and
4. the source commutator sign gives `s=Dr-d beta`, with the minus sign
   confirmed independently by (4.11).

The remaining theorem is therefore precise: prove (3.8) for the actual
`mathcal F`, projected source-normalized state, and a common unbounded
schedule.  No result currently in this note supplies that sign.
