# Growing-transition Weber-edge reciprocal channel theorem

## 0. Exact result and claim boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad L=2\log\lambda .                 \tag{0.1}
\]

For a prolate separation value `mu`, put

\[
 \alpha={c^2-\mu\over c}.
\]

This note proves the exact one-edge/one-far Fourier channel used by the
same-side reciprocal branch.  It covers

\[
 -C_0L\leq\alpha\leq B_+(L),\qquad
 B_+(L)=(\log L)^4,                                     \tag{0.2}
\]

All assertions below involving a synthesis of prolate labels,
positive-tail orthogonality, `D`-normalization, or an exterior-metric
operator norm are restricted to one fixed Fourier phase.  The project
application is the plus family

\[
 \nu\equiv0\pmod4.                                      \tag{0.2a}
\]

This phase restriction concerns synthesis only.  The scalar
`F_c(N,\alpha)` theorem remains valid for any real `\alpha` satisfying
its stated bound `|\alpha|\leq B`.  Its project use in (0.2) is uniform
in the retained supercritical part `alpha<=0`.  The exact flat Weber
multiplier is

\[
 F_0(N,\alpha)={-i\over\sqrt{N^2-1}}
 \exp\left\{{i\alpha\over4}
       \log{N+1\over N-1}\right\},\qquad N>1.           \tag{0.3}
\]

If `F_c` is the Abel Fourier transform of the endpoint-normalized solution
of the exact edge equation, then there are absolute constants `C,c_0`
such that, for `B>=1`, `|alpha|<=B`, `N>=2`, and
`c>=c_0(1+B)^3`,

\[
 \boxed{
 F_c(N,\alpha)=F_0(N,\alpha)G_c(N,\alpha),\qquad
 |G_c-1|+N|\partial_NG_c|
 \leq {C(1+B)^3\over cN^2}.}                            \tag{0.4}
\]

Consequently the carrier-removed dyadic operator variation on a spectral
space with `||A||<=B` is

\[
 \boxed{
 \|F_c(2X,A)\|+
 \int_X^{2X}\|\partial_NF_c(N,A)\|\,dN
 \leq {4\over X}+{B\over X^2}
       +{C(1+B)^3\over cX^3}.}                          \tag{0.5}
\]

The same-side stationary-index calculation is also exact: after the
sampler equality `m=N` is removed, a reciprocal stationary branch in the
range (0.2) can have only the unshifted sampler index `m=1`; the shifted
index `N=l n` is at least two.  At the affine far base one has the exact
pointwise half density

\[
 \{c(N^2-1)\}^{-1/2}.                                  \tag{0.6}
\]

Equation (0.6) is not, by itself, an operator factorization.  The actual
edge-to-far matrix element contains a variable Jost coefficient evaluated
at `Nu+c(N-1)` and a cutoff.  The scalar Abel identity (0.4) controls the
constant-amplitude Fourier functional; it does not permit that coefficient
to be frozen at `u=0`.  Consequently this note does **not** claim the
complete decay `c^{-1/2}(N^2-1)^{-1}`, absolute summability, or an `o(L)`
operator bound for the actual reciprocal block.  Section 7 records the
exact scalar parity gain and states the one weighted-composition lemma
still needed for that promotion.

This is deliberately an **edge reciprocal channel theorem**, not a full
same-side floor.  It does not prove the subcritical bulk action-Hilbert
commutator, assemble every separated `m,l>=2` branch, estimate the reflected
operator, insert the origin bump or compact projection, compare with
`P_0`, prove equation (5.2) of `DIRECT_RH_ATTACK.md`, or prove RH.  A global
replacement `A_c=A_0+o(1)` on a spectral band is explicitly false in
operator norm; Section 8 records the coherent-translation obstruction.
The formal project state remains `P0_INVALIDATED`.

## 1. Exact tail isometry, sampler, and edge operator

Fix a finite label set `I` in the chosen Fourier phase.  If
`H_\nu={\cal F}_ah_{\nu,\lambda}` denotes the Fourier transform of the
normalized prolate with label `\nu`, set

\[
 H(v)=\sum_{\nu\in I}a_\nu H_\nu(v),\qquad
 D=\int_{|v|\geq\lambda}|H(v)|^2\,dv.                  \tag{1.0}
\]

For the positive Fourier tail define

\[
 \phi(s)={\sqrt\lambda\over2}e^{s/2}H(\lambda e^s),
 \qquad
 ({\cal U}_c\phi)(u)={\phi(\log(1+u/c))\over\sqrt{c+u}}.
                                                                    \tag{1.1}
\]

Then

\[
 q(u):=({\cal U}_c\phi)(u)
 ={1\over2}\sqrt{\lambda\over c}\,
 H\!\left(\lambda(1+u/c)\right),\qquad
 \|q\|_2^2={D\over8}.                                  \tag{1.2}
\]

The logarithmic sampler becomes the exact affine pullback

\[
 \boxed{
 {\cal U}_cR_m{\cal U}_c^{-1}q(u)=q(\tau_m(u)),\qquad
 \tau_m(u)=m u+c(m-1).}                                 \tag{1.3}
\]

No amplitude is omitted in (1.3): `c+tau_m(u)=m(c+u)` cancels the
`m^(-1/2)` in `R_m`.  Equations (1.1)--(1.3) are linear statements for
the fixed-phase synthesis (1.0).

For one label `\nu\in I`, write `q=q_\nu` and
`\alpha=\alpha_\nu=(c^2-\mu_\nu)/c`.  Writing its exterior prolate
equation in `u=c(t/lambda-1)` gives

\[
 \boxed{
 A_cq=\alpha q,\qquad
 A_c=-{d\over du}\left(a_c(u){d\over du}\right)-a_c(u),
 \qquad a_c(u)=2u+{u^2\over c}.}                         \tag{1.4}
\]

At the regular endpoint,

\[
 q'(0)=-{\alpha\over2}q(0).                             \tag{1.5}
\]

For distinct prolate labels within this one fixed Fourier phase, the
positive exterior tails are orthogonal.  After multiplying the
`\nu`-th tail by `sqrt(8/d_\nu)`, (1.2) is an exact isometry from the
fixed-phase coefficient space.  Every synthesis-level operator estimate
below is therefore in that fixed-phase exterior metric, not a diagonal
approximation to an endpoint-sheared metric.

## 2. Stationary-index theorem

Use the radial variable

\[
 z_j(s)=\sqrt{j^2e^{2s}-1}.
\]

The principal squared momentum for parameter `alpha` is

\[
 P_\alpha(z)^2/c^2
 ={(1+z^2)(z^2+\alpha/c)\over z^2}
 =z^2+1+{\alpha\over c}\left(1+{1\over z^2}\right).    \tag{2.1}
\]

Suppose `m,N>=2`, `m!=N`, and
`|alpha|,|beta|<=C_0L+B_+`.  Since

\[
 |z_N(s)^2-z_m(s)^2|=|N^2-m^2|e^{2s}\geq5,             \tag{2.2}
\]

whereas the two parameter corrections in (2.1) have total absolute size
at most

\[
 {8(C_0L+B_+)\over3c}=o(1),                             \tag{2.3}
\]

the two principal momenta cannot agree for large `c`.  If `m=N`, this is
the sampler-equality branch already retained by the equality-conductor
theorem.  Since a prime translate has `N=ln>=2`, every non-equality
reciprocal stationary point therefore has

\[
 \boxed{m=1.}                                            \tag{2.4}
\]

For equal subcritical parameters, put `r^2=alpha/c`.  Subtracting (2.1)
at the two samples factors exactly as

\[
 P_\alpha(z_N)^2-P_\alpha(z_m)^2
 =c^2(z_N^2-z_m^2)\left(1-{r^2\over z_m^2z_N^2}\right).
                                                                    \tag{2.5}
\]

Thus the alternatives are `z_m=z_N` and `z_mz_N=r`.  With `m=1`, the
reciprocal point is the positive root of

\[
 N^2y^2+(N^2-1)y-\alpha/c=0,
 \qquad y=z_1^2,                                        \tag{2.6}
\]

and hence

\[
 u_*={\alpha\over2(N^2-1)}
 +O\!\left({\alpha^2\over c(N^2-1)^2}\right).          \tag{2.7}
\]

For `alpha<0`, (2.6) has no positive reciprocal root.  The exact Fourier
channel below still controls the corresponding complex-saddle/nonstationary
continuation uniformly.

## 3. Metaplectic flat-edge diagonalization

Put `u=rho^2/2`.  On radial `L^2(R^2)`,

\[
 A_0=-{d\over du}\left(2u{d\over du}\right)-2u
\]

is the radial inverted oscillator `p^2-rho^2`.  A metaplectic rotation by
`pi/4` sends it to the symmetrized dilation generator.  In `u` variables,

\[
 M^*A_0M=-4D_u,
 \qquad D_u=-i\left(u{d\over du}+{1\over2}\right).       \tag{3.1}
\]

The Mellin transform diagonalizes `D_u`.  A regular generalized
`A_0`-eigenfunction is

\[
 w_{0,\alpha}(u)=e^{iu}
 {}_1F_1\!\left({1\over2}-{i\alpha\over4};1;-2iu\right),
 \quad w_{0,\alpha}(0)=1,
 \quad w_{0,\alpha}'(0)=-\alpha/2.                      \tag{3.2}
\]

For `epsilon>0`, the elementary Laplace identity

\[
 \int_0^\infty e^{-su}{}_1F_1(a;1;zu)\,du
 =s^{a-1}(s-z)^{-a}                                     \tag{3.3}
\]

applies with `Re(s)>0`.  Taking the Abel limit gives, for `N>1`,

\[
 \boxed{
 \begin{aligned}
 \lim_{\epsilon\downarrow0}\int_0^\infty
 e^{-\epsilon u}w_{0,\alpha}(u)e^{-iNu}\,du
 &={-i\over\sqrt{N^2-1}}e^{i\alpha\ell_N/4},\\
 \lim_{\epsilon\downarrow0}\int_0^\infty
 e^{-\epsilon u}w_{0,\alpha}(u)e^{ iNu}\,du
 &={ i\over\sqrt{N^2-1}}e^{-i\alpha\ell_N/4},
 \end{aligned}\qquad
 \ell_N=\log{N+1\over N-1}.}                           \tag{3.4}
\]

The reciprocal canonical relation is therefore the energy-preserving
translation

\[
 (x,\alpha)\longmapsto(x\pm\ell_N/4,\alpha)             \tag{3.5}
\]

in the coordinate conjugate to `alpha`, with exact half density
`(N^2-1)^(-1/2)`.

## 4. Exact Fourier equation for `A_c`

Let `w_{c,alpha}` be the regular solution of

\[
 (a_cw')'+(a_c+\alpha)w=0,
 \qquad w(0)=1,\quad w'(0)=-\alpha/2.                  \tag{4.1}
\]

For `Im N<0`, define its convergent half-line Fourier transform and then
take the boundary value from below:

\[
 F_c(N,\alpha)=\int_0^\infty w_{c,\alpha}(u)e^{-iNu}\,du.
                                                                    \tag{4.2}
\]

The exponential regulator makes every integration by parts legitimate.
Using

\[
 \int uw e^{-iNu}\,du=iF_c',\qquad
 \int u^2w e^{-iNu}\,du=-F_c'',                         \tag{4.3}
\]

and then taking the boundary value yields the exact ODE

\[
 \boxed{
 (N^2-1)F_c''+{2N+2ic(1-N^2)\}F_c'
 +(c\alpha-2icN)F_c=0.}                                 \tag{4.4}
\]

After division by `c`, its leading first-order equation is

\[
 2i(1-N^2)F'+(\alpha-2iN)F=0,                           \tag{4.5}
\]

and (0.3) is its solution with `F~-i/N` at infinity.

## 5. Terminal Volterra estimate

Put

\[
 p=N^2-1,\qquad H=pF_c',\qquad
 Z=H+(N+i\alpha/2)F_c.                                  \tag{5.1}
\]

Equation (4.4) is exactly equivalent to

\[
 \boxed{
 \begin{aligned}
 F_c'&=-{N+i\alpha/2\over p}F_c+{Z\over p},\\
 Z'&=\left(2ic+{N+i\alpha/2\over p}\right)Z+dF_c,\\
 d&={-1-i\alpha N+\alpha^2/4\over p}.
 \end{aligned}}                                         \tag{5.2}
\]

The large-`N` endpoint expansion gives `F_c/F_0 -> 1` and `Z -> 0`.
Consequently

\[
 Z(N)=-\int_N^\infty e^{-2ic(t-N)}
 \exp\left\{-\int_N^t{s+i\alpha/2\over s^2-1}\,ds\right\}
 d(t)F_c(t)\,dt.                                        \tag{5.3}
\]

The modulus of the second exponential is

\[
 \sqrt{N^2-1\over t^2-1}.                              \tag{5.4}
\]

One integration by parts in the `2c` carrier is the decisive step.  If
`q=(t+i\alpha/2)/(t^2-1)`, it gives

\[
 \begin{aligned}
 Z(N)={}&-{d(N)F_c(N)\over2ic}\\
 &-{1\over2ic}\int_N^\infty e^{-2ic(t-N)}e^{-\int_N^tq}
 \left\{(d'-2qd)F_c+{dZ\over t^2-1}\right\}dt .        \tag{5.5}
 \end{aligned}
\]

For `t>=2` and `|alpha|<=B`,

\[
 \begin{aligned}
 |q|&\leq C(t^{-1}+Bt^{-2}),\\
 |d|&\leq C(Bt^{-1}+B^2t^{-2}),\\
 |d'-2qd|&\leq C(Bt^{-2}+B^2t^{-3}+B^3t^{-4}).          \tag{5.6}
 \end{aligned}
\]

Write `F_c=F_0G`.  Since `|F_0|=p^(-1/2)`, a bootstrap `|G|<=2` in
(5.5) gives `|F_c(t)|\leq C/t`.  Also, for `t\geq x\geq N\geq2`,

\[
 \sqrt{x^2-1\over t^2-1}\leq C{x\over t}.
\]

The boundary term and the part containing
`(d'-2qd)F_c` therefore have the pointwise source bound

\[
 S_N={C\over c}\left(
 {B\over N^2}+{B^2\over N^3}+{B^3\over N^4}\right).   \tag{5.6a}
\]

To retain the full `B` dependence in the feedback, use the weighted tail
supremum

\[
 {\mathfrak M}_N=\sup_{x\geq N}
 \left({x\over N}\right)^2|Z(x)|.                      \tag{5.6b}
\]

This estimate may first be made on a finite terminal Volterra interval
and then passed to the limit.  Since
`|d(t)|/(t^2-1)\leq C(Bt^{-3}+B^2t^{-4})`, the last term
of (5.5) satisfies

\[
 \begin{aligned}
 \left({x\over N}\right)^2|Z(x)|
 &\leq S_N+{C_*\over c}
       \left({B\over x^2}+{B^2\over x^3}\right)
       {\mathfrak M}_N,\\
 {\mathfrak M}_N
 &\leq S_N+\kappa_N{\mathfrak M}_N,\qquad
 \kappa_N={C_*\over c}
 \left({B\over N^2}+{B^2\over N^3}\right).            \tag{5.6c}
 \end{aligned}
\]

For `N\geq2` and `c\geq c_0(1+B)^3`,

\[
 \kappa_N\leq {C_*\over c_0}
 {B/4+B^2/8\over(1+B)^3}< {1\over2}                   \tag{5.6d}
\]

after enlarging the absolute `c_0`.  Thus
`{\mathfrak M}_N\leq2S_N` and, in particular,

\[
 |Z(N)|\leq {C\over c}\left(
 {B\over N^2}+{B^2\over N^3}+{B^3\over N^4}\right)
 \leq {C(1+B)^3\over cN^2}.                            \tag{5.7}
\]

\[
 G'={Z\over pF_0},                                      \tag{5.8}
\]

so (5.7), integration from infinity, and
`c>=c_0(1+B)^3` close the bootstrap and prove (0.4).

## 6. Dyadic BV and the frozen reciprocal phase

Let

\[
 a_N=(N^2-1)^{-1/2}.
\]

For a self-adjoint `A` with `||A||<=B`, spectral calculus and (3.4) give

\[
 \left\|{d\over dN}\{a_Ne^{i\ell_NA/4}\}\right\|
 \leq {N\over(N^2-1)^{3/2}}
 +{B\over2(N^2-1)^{3/2}}.                               \tag{6.1}
\]

Since `ell_N'=-2/(N^2-1)`, integration on `[X,2X]`, with `X>=2`, proves

\[
 \|a_{2X}e^{i\ell_{2X}A/4}\|+
 \int_X^{2X}\left\|{d\over dN}
       (a_Ne^{i\ell_NA/4})\right\|dN
 \leq {4\over X}+{B\over X^2}.                         \tag{6.2}
\]

Equation (0.4) adds the last term of (0.5).

Moreover

\[
 \ell_N={2\over N}+\delta_N,\qquad
 0<\delta_N\leq {8\over9N^3},\qquad
 |\delta_N'|\leq {8\over3N^4}.                         \tag{6.3}
\]

Thus the phase in (3.4) is

\[
 e^{i\alpha\ell_N/4}
 =e^{i\alpha/(2N)}
  \left\{1+\text{an amplitude of dyadic variation }
        O(B/N^3)\right\}.                               \tag{6.4}
\]

The first factor is exactly the reciprocal phase in the frozen
`chi_4` theorem (up to conjugation, which is harmless).

## 7. Far half density, exact scalar parity, and the missing composition lemma

For `U>=c`, put `v=sqrt(a_c)w`.  Direct differentiation of (4.1) gives

\[
 v''+\Omega_\alpha(U)^2v=0,
 \qquad
 \Omega_\alpha^2=1+{\alpha\over a_c(U)}+{1\over a_c(U)^2}.
                                                                    \tag{7.1}
\]

If `|alpha|<=B=O(L)`, then

\[
 {1\over2}\leq\Omega_\alpha^2\leq{3\over2},\qquad
 \operatorname {Var}_{[c(N-1),\infty)}\log\Omega_\alpha
 \leq {C(1+B)\over c(N^2-1)}.                          \tag{7.2}
\]

Also, exactly,

\[
 \int_{c(N-1)}^\infty {dU\over a_c(U)}
 ={1\over2}\log{N+1\over N-1}={\ell_N\over2}.          \tag{7.3}
\]

At the affine base the physical half density is exactly

\[
 a_c(c(N-1))^{-1/2}={1\over\sqrt{c(N^2-1)}}.             \tag{7.4}
\]

It is essential that (7.4) is only a pointwise identity.  Indeed the exact
affine sampler gives

\[
 a_c(\tau_N(u))
 =c(N^2-1)+2N^2u+{N^2u^2\over c},                      \tag{7.5}
\]

so its half density is not constant on the half-line.  Neither (7.2) nor
the exact action (7.3) permits this factor to be pulled through the Abel
transform.  In particular, a Taylor expansion on `u=O(c)` says nothing
about the coherent packets from Section 8.

On the locked schedule, `p^2=1 mod 8`, so

\[
 e^{icN}=i^N.                                            \tag{7.7}
\]

The `-i` Maslov factor in the first line of (3.4) gives, for odd `n`:

- if `l` is odd, `(-i)i^{l n}=chi_4(l)chi_4(n)`;
- if `l=0 mod 4`, `(-i)i^{l n}=-i`;
- if `l=2 mod 4`, `(-i)i^{l n}= i`.

Thus odd `l` gives the frozen `chi_4(n)` carrier.  For even `l`, the
gain is uniform in the whole scalar spectral window, not merely at
`alpha=0`.  Namely, write

\[
 \theta_N(\alpha)={\alpha\ell_N\over4},\qquad
 \kappa_{l,n}=(-i)i^{l n}.
\]

For even `l`, `\kappa_{l,n}=\pm i`.  Equations (0.4), (3.4), and
`\ell_N\leq8/(3N)` give, with `N=l n`,

\[
 \boxed{
 \left|\operatorname {Re}\{i^{l n}F_c(l n,\alpha)\}\right|
 \leq {1\over\sqrt{(l n)^2-1}}
 \left\{{2B\over3l n}
       +{C(1+B)^3\over c(l n)^2}\right\}.}             \tag{7.8}
\]

This follows from
`|\operatorname {Re}(\pm i e^{i\theta})|=|\sin\theta|`
and is valid for every `|\alpha|\leq B`.  More generally, if an actual
two-energy principal coefficient is real, then its phase
`\theta=\ell_N(\epsilon_1\alpha+\epsilon_2\beta)/4` obeys

\[
 |\sin\theta|
 \leq\min\left(1,{4B\over3N}\right),
 \qquad |\alpha|,|\beta|\leq B.                         \tag{7.9}
\]

The word “real” is indispensable: an imaginary part contributes a cosine
with no `B/N` gain.  The scalar correction `G_c-1` is already covered by
the second term of (7.8), but reality of the additional far Jost
coefficient has not been proved here.

### Missing composition lemma

Let `b^\epsilon_{c,N,\beta}(u)` denote the actual carrier-removed far Jost
coefficient in the exact tail metric, including the cutoff and the factor
`a_c(\tau_N(u))^{-1/2}`.  The remaining, sufficient lemma is a
cutoff-uniform factorization of

\[
 {\cal K}_{c,N}^\epsilon(\alpha,\beta)
 =\int_0^\infty w_{c,\alpha}(u)
 b^\epsilon_{c,N,\beta}(u)e^{-iNu}\,du.                \tag{7.10}
\]

Precisely, it would suffice to prove that there are absolute `C,K,c_1`
such that, for

\[
 X\geq2,\qquad |\alpha|,|\beta|\leq B,\qquad
 c\geq c_1(1+B)^3,                                     \tag{7.11}
\]

the exact fixed-phase `D`-normalized channel and its adjoint admit

\[
 {\cal K}_{c,N}^\epsilon
 ={r^\epsilon_{c,N}(\beta)\over\sqrt{c(N^2-1)}}\,
   F_c(N,\alpha)+{\cal E}_{c,N}^\epsilon,               \tag{7.12}
\]

where the principal multiplier is real in the real prolate basis, the
opposite carrier is its adjoint, and on every dyad

\[
 \begin{aligned}
 |r^\epsilon_{c,2X}|+
 \int_X^{2X}|\partial_Nr^\epsilon_{c,N}|\,dN
 &\leq C(1+B)^K,\\
 \|{\cal E}_{c,2X}^\epsilon\|+
 \int_X^{2X}\|\partial_N{\cal E}_{c,N}^\epsilon\|\,dN
 &\leq {C(1+B)^K\over\sqrt c\,X^2}.                    \tag{7.13}
 \end{aligned}
\]

The second line is an operator estimate after exact fixed-phase exterior
normalization; its constant must be independent of the number of admitted
fixed-phase edge labels.  Equations (0.4), (7.8), and (7.12)--(7.13) would
then give
the desired `c^{-1/2}(N^2-1)^{-1}` decay, preserve the odd-`l`
`\chi_4(n)` carrier, control the even-`l` error absolutely, and make the
channel `o(L)` after any polynomial-`L` fixed-phase endpoint synthesis.
No estimate in Sections 1--6 proves (7.12)--(7.13).  This weighted
composition lemma, not the scalar Weber channel, is therefore the exact
remaining gap.

## 8. Coherent-packet obstruction and endpoint shear

Equation (3.1) shows why a tempting global argument is false.  After Mellin
diagonalization, an `A_0` spectral band is an ordinary Fourier band in
`x=log u`.  Translating a band-limited packet in `x` preserves both its norm
and spectral support while moving it to arbitrarily large `u`.  Therefore,
for every fixed spatial cutoff `chi`,

\[
 \|(1-\chi(u/U))1_{\{|A_0|\leq B\}}\|=1.                \tag{8.1}
\]

One endpoint-null linear condition does not remove the obstruction: two
separated translates can be combined to cancel one endpoint functional.
Likewise the `B/X^2` term in (0.5) is sharp, since a spectral vector at
`alpha=+/-B` attains the phase derivative.

Hence neither spectral localization nor endpoint shear licenses a global
near-identity replacement of `A_c` by `A_0`.  The scalar result proved here
uses the exact Fourier ODE (4.4); a complete edge-to-far result additionally
requires (7.12)--(7.13).  The project shear against label `8` should be
applied only after that estimate, as a congruence in the exact exterior
metric of the fixed plus phase.  Applying `A_c` band estimates directly
to a sheared column would be invalid, because that column contains the
fixed label-`8` component with `alpha_8` of order `c`.
