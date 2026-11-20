# Subturning Laplace--Volterra turning-resonance barrier

## 0. Exact outcome and claim boundary

Retain the two fixed labels `j=0,4`, the action

\[
 D_c(s)=c\left\{\sqrt{1+(s/2c)^2}-1
 -{s\over2c}\operatorname {arsinh}(s/2c)\right\},
 \qquad c\longrightarrow\infty,                    \tag{0.1}
\]

and the exact Riccati coefficient from the frozen recurrence,

\[
 \alpha_j(s)={s+2\over s+1}{b_j(s+4)\over b_j(s)}
 \exp\{D_c(s+j+3)-D_c(s+j-1)\}.                    \tag{0.2}
\]

This note closes one proposed route to Closure Lemma CL, but it does
**not** close CL itself.  Its exact conclusions are as follows.

1.  After the shift `z=s-3`, `alpha_j(3+z)` is the Laplace transform of a
    finite signed measure `a_(j,c)` supported on `[0,infinity)`.  Its total
    variation and first moment are bounded uniformly in large `c`.
2.  That measure is not positive.  An exact Bessel factor has a fixed
    negative lobe, so `alpha_j(3+z)` is not completely monotone.
3.  On the unrestricted measure algebra

    \[
     L^1_1(0,\infty)=
     \left\{f:\int_0^\infty(1+u)|f(u)|\,du<\infty\right\},              \tag{0.3}
    \]

    the actual Volterra operator

    \[
     \mathcal L_{j,c}=I+C_{a_{j,c}}M_{e^{-2u}}                       \tag{0.4}
    \]

    has no uniform inverse bound.  Localized packets at the turning
    frequency `xi_c=2c` give

    \[
     \|\mathcal L_{j,c}^{-1}\|_{L^1_1\to L^1_1}
     \geq c_jc^{1/4}                                                   \tag{0.5}
    \]

    whenever the inverse exists.

The frequency in (0.5) lies outside the project window

\[
 |\operatorname {Im}s|\leq2Y_c=2c^{3/4}.                              \tag{0.6}
\]

Thus (0.5) refutes only an unrestricted translation-invariant Laplace
algebra.  It does not refute a space which explicitly removes, quotients,
or jointly controls turning-scale frequencies.  It does not disprove the
conditional factorization in the frozen closure note, prove a Birkhoff
connection theorem, prove an arithmetic sign, or prove the Riemann
hypothesis.  The project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

Exactly two frozen note/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/SUBTURNING_MINIMAL_RICCATI_EULER_CLOSURE_BARRIER.md | faa787a3cc96fe83f41aeeec44b868feaa1e6755b90b925921e2448c3e029ac8 |
| tests/test_subturning_minimal_riccati_euler_closure_barrier.py | 6b2e347793020deb48730a3d11ce36c1f8f926e2c63768f376f1c4bbbd54a204 |
| notes/EXACT_PROLATE_MELLIN_RECURRENCE_BIRKHOFF_CONNECTION_BARRIER.md | d1191bdc6f0d2edd0ae900e1a7d73f61cea7f78693e2074b6850df7aec36a041 |
| tests/test_exact_prolate_mellin_recurrence_birkhoff_connection_barrier.py | 836949d060b03d697574731aad2ede90241b2f6ccb29e58d123908218ef7955f |

The recurrence pair supplies the exact coefficient (0.2).  The closure
pair supplies the proposed Laplace-algebra route and fixes the subturning
height.  Nothing from the standard eight is modified or imported here.

## 2. Exact rational--action factorization

Use the shifted Laplace convention

\[
 \mathcal L\mu(z)=\int_{[0,\infty)}e^{-zu}\,d\mu(u),
 \qquad \operatorname {Re}z\geq0,                                    \tag{2.1}
\]

and put

\[
 r_c(p)={\sqrt{p^2+4c^2}-p\over2c},
 \qquad \beta_j=j+4.                                                   \tag{2.2}
\]

All square roots and logarithms below are the branches obtained from the
positive real half-plane.  Direct differentiation of (0.1) gives

\[
 D_c'(p)=-{1\over2}\operatorname {arsinh}(p/2c)
 ={1\over2}\log r_c(p).                                                \tag{2.3}
\]

Write

\[
 R_j(s)={s+2\over s+1}{b_j(s+4)\over b_j(s)},
 \qquad E_{j,c}(s)=\exp\{D_c(s+j+3)-D_c(s+j-1)\}.                     \tag{2.4}
\]

Then `alpha_j=R_jE_(j,c)` exactly.  Centering the four-unit action
difference at `z+beta_j` yields

\[
 E_{j,c}(3+z)=r_c(z+\beta_j)^2e^{q_{j,c}(z)},                           \tag{2.5}
\]

where

\[
 q_{j,c}(z)={1\over2}\int_{-2}^{2}
 \{\log r_c(z+\beta_j+v)-\log r_c(z+\beta_j)\}\,dv.                  \tag{2.6}
\]

The rational factors can be inverted without an estimate.  For label
zero,

\[
 R_0(3+z)=1+{1\over z+4},
 \qquad
 r_0=\delta_0+e^{-4u}\,du.                                             \tag{2.7}
\]

For label four, put `P(s)=4s^2-4s+3`.  Polynomial division gives

\[
 R_4(s)=1+{27\over11(s+1)}
       +{288s+1008\over11(4s^2-4s+3)},                                \tag{2.8}
\]

and hence

\[
\begin{split}
 r_4={}&\delta_0+\rho_4(u)\,du,\\
 \rho_4(u)={}&{27\over11}e^{-4u}
 +e^{-5u/2}\left\{{72\over11}\cos{u\over\sqrt2}
 +{288\sqrt2\over11}\sin{u\over\sqrt2}\right\}.
\end{split}                                                            \tag{2.9}
\]

For later reference, crude absolute bounds from (2.7)--(2.9) are

\[
 \|r_0\|_{\rm TV}\leq{5\over4},\quad m_1(r_0)={1\over16},
 \qquad
 \|r_4\|_{\rm TV}<20,\quad m_1(r_4)<8,                               \tag{2.10}
\]

where `m_p(mu)=int u^p d|mu|(u)`.

## 3. Exact Bessel--Laplace measure

For `nu>0`, `a>0`, and `Re p>0`, the classical elementary Laplace
identity is

\[
 \int_0^\infty e^{-pu}{\nu J_\nu(au)\over u}\,du
 =\left({\sqrt{p^2+a^2}-p\over a}\right)^\nu.                          \tag{3.1}
\]

Indeed, differentiation in `p` reduces (3.1) to the standard Laplace
transform of `J_nu`, and both sides vanish at positive infinity.  With
`nu=2` and `a=2c`, define

\[
 k_{\beta,c}(u)={2e^{-\beta u}J_2(2cu)\over u}.                        \tag{3.2}
\]

Then

\[
 \mathcal L(k_{\beta,c}\,du)(z)=r_c(z+\beta)^2.                      \tag{3.3}
\]

There is also an exact integrable kernel for the correction (2.6).  Since

\[
 {1\over\sqrt{p^2+4c^2}}
 =\int_0^\infty e^{-pu}J_0(2cu)\,du,                                  \tag{3.4}
\]

differentiating (2.6), and using `q_(j,c)(z)->0` as `Re z->infinity`,
gives

\[
 q_{j,c}(z)=\mathcal L\kappa_{\beta_j,c}(z),                          \tag{3.5}
\]

with

\[
 \kappa_{\beta,c}(u)=e^{-\beta u}J_0(2cu)
 \left\{{\sinh(2u)/u-2\over u}\right\}.                             \tag{3.6}
\]

The apparent singularity at zero is removable in the measure sense:

\[
 {\sinh(2u)/u-2\over u}={4\over3}u+O(u^3).                            \tag{3.7}
\]

At infinity the same bracket is `O(e^(2u)/u^2)`.  Because
`beta_j>=4`, (3.6) is absolutely integrable.

For a finite signed measure `mu`, let

\[
 \operatorname {Exp}_*(\mu)
 =\delta_0+\sum_{n\geq1}{\mu^{*n}\over n!}.                           \tag{3.8}
\]

The series converges in total variation.  Equations (2.5), (3.3), and
(3.5) now give the exact measure

\[
 e_{j,c}=(k_{\beta_j,c}\,du)*
 \operatorname {Exp}_*(\kappa_{\beta_j,c}\,du),
 \qquad
 \mathcal Le_{j,c}(z)=E_{j,c}(3+z).                                  \tag{3.9}
\]

Finally,

\[
 a_{j,c}=r_j*e_{j,c},
 \qquad \mathcal La_{j,c}(z)=\alpha_j(3+z).                          \tag{3.10}
\]

This is a positive-support representation, meaning support in the
positive half-line; it is not a positivity assertion about the measure.

## 4. Uniform variation and moment bounds

For fixed integer order, the elementary Bessel bounds

\[
 |J_\nu(x)|\leq C_\nu\min\{x^\nu,x^{-1/2}\},
 \qquad x>0,                                                           \tag{4.1}
\]

give

\[
 \|k_{\beta,c}\,du\|_{\rm TV}
 \leq K_2:=2\int_0^\infty {|J_2(v)|\over v}\,dv<\infty.              \tag{4.2}
\]

For every fixed integer `p>=1`, changing variables `v=2cu` gives

\[
\begin{split}
 m_p(k_{\beta,c}\,du)
 &=2^{1-p}c^{-p}\int_0^\infty
   v^{p-1}e^{-\beta v/(2c)}|J_2(v)|\,dv\\
 &\leq C_{p,\beta}c^{-1/2}.
\end{split}                                                            \tag{4.3}
\]

Using (3.7), the large-`u` bound after it, and
`|J_0(2cu)|<=C(1+cu)^(-1/2)`, split the integral at `u=1/c`.  This gives

\[
 \|\kappa_{\beta,c}\,du\|_{\rm TV}
 +m_p(\kappa_{\beta,c}\,du)
 \leq C_{p,\beta}c^{-1/2},
 \qquad p\geq1.                                                       \tag{4.4}
\]

If `A=||mu||_(TV)` and `B=m_1(mu)`, convolution and (3.8) imply

\[
 \|\operatorname {Exp}_*(\mu)\|_{\rm TV}\leq e^A,
 \qquad
 m_1(\operatorname {Exp}_*(\mu))\leq Be^A.                           \tag{4.5}
\]

Consequently,

\[
 \|e_{j,c}\|_{\rm TV}\leq K_2e^{C_jc^{-1/2}},
 \qquad
 m_p(e_{j,c})\leq C_{j,p}c^{-1/2},\quad p\geq1.                       \tag{4.6}
\]

Together with (2.10), this proves

\[
 \sup_{c\geq c_0}
 \{\|a_{j,c}\|_{\rm TV}+m_1(a_{j,c})\}<\infty,
 \qquad j=0,4.                                                        \tag{4.7}
\]

Thus failure of a naive Neumann estimate is not caused by an infinite
measure norm.  It is a resonance of the inverse.

## 5. The measure is signed, not completely monotone

Equation (4.4) also yields

\[
 \|\operatorname {Exp}_*(\kappa_{\beta,c}\,du)-\delta_0\|_{\rm TV}
 \leq e^{C_\beta c^{-1/2}}-1=O_\beta(c^{-1/2}).                       \tag{5.1}
\]

Choose a compact interval `I` strictly inside a negative lobe of `J_2`.
Under the dilation `v=2cu`, (3.2) gives

\[
 (k_{\beta,c}\,du)\left({I\over2c}\right)
 =2\int_I e^{-\beta v/(2c)}{J_2(v)\over v}\,dv
 \longrightarrow2\int_I{J_2(v)\over v}\,dv<0.                      \tag{5.2}
\]

By (4.2) and (5.1), the same set has a fixed negative `e_(j,c)` mass for
all sufficiently large `c`.  Write `r_j=delta_0+rho_j(u)du`; (2.7) and
(2.9) show that `rho_j` is bounded.  Hence

\[
 |(\rho_j\,du*e_{j,c})(I/(2c))|
 \leq { |I|\over2c}\|\rho_j\|_\infty\|e_{j,c}\|_{\rm TV}
 =O_j(c^{-1}).                                                         \tag{5.3}
\]

Equations (3.10), (5.2), and (5.3) prove that `a_(j,c)` has negative mass
for both labels.  Uniqueness of the Laplace transform of finite measures,
together with Bernstein's theorem, therefore gives

\[
 \alpha_j(3+z)\text{ is not completely monotone on }(0,\infty),
 \qquad j=0,4,                                                        \tag{5.4}
\]

for all sufficiently large `c`.

## 6. Actual turning-frequency quasimode

Let `C_mu f=mu*f` on the positive half-line, extend `f` by zero to the
negative half-line, and use the norm in (0.3).  The elementary estimate

\[
 \|C_\mu f\|_{L^1_1}
 \leq\{\|\mu\|_{\rm TV}+m_1(\mu)\}\|f\|_{L^1_1}                    \tag{6.1}
\]

and (4.7) make `C_(a_(j,c))` uniformly bounded.

The obstruction occurs at the genuine turning frequency.  If `rho` lies
in a fixed compact subset of `(0,infinity)`, then, uniformly there,

\[
 r_c(\rho+2ic)=-i+O_\rho(c^{-1/2}),
 \qquad
 \log r_c(\rho+2ic)=-{i\pi\over2}+O_\rho(c^{-1/2}).                  \tag{6.2}
\]

Indeed, the radical in (2.2) is the square root of
`2i rho/(2c)+O(c^(-2))`.  Insert (6.2) into the centered integral behind
(2.5).  Since `R_j(3+2ic)=1+O_j(c^(-1))`, one obtains

\[
 E_{j,c}(3+2ic)=-1+O_j(c^{-1/2}),
 \qquad
 \alpha_j(3+2ic)=-1+O_j(c^{-1/2}).                                   \tag{6.3}
\]

Now fix a nonzero `chi` in `C_c^1((1,2))`, and put

\[
 W=c^{-1/4},\qquad \xi_c=2c,
 \qquad y_c(u)=e^{i\xi_cu}\chi(u/W).                                 \tag{6.4}
\]

The moment bounds (4.6), including `p=2`, and the translation
fundamental theorem of calculus give

\[
 {\|C_{e_{j,c}}y_c-E_{j,c}(3+i\xi_c)y_c\|_{L^1_1}
  \over\|y_c\|_{L^1_1}}
 \leq {C_jc^{-1/2}\over W}.                                          \tag{6.5}
\]

For the fixed rational density `rho_j`, define its oscillatory tail

\[
 P_{j,\xi}(v)=\int_v^\infty e^{-i\xi t}\rho_j(t)\,dt.                 \tag{6.6}
\]

One integration by parts in (6.6), using the exponential formulas
(2.7) and (2.9), gives

\[
 \int_0^\infty(1+v)|P_{j,\xi}(v)|\,dv\leq {C_j\over|\xi|}.           \tag{6.7}
\]

A second integration by parts, now in the convolution against the
envelope `chi(u/W)`, yields

\[
 {\|C_{r_j}y_c-R_j(3+i\xi_c)y_c\|_{L^1_1}
  \over\|y_c\|_{L^1_1}}
 \leq {C_j\over cW}.                                                   \tag{6.8}
\]

Combining (3.10), (6.5), and (6.8), and using

\[
 {\|(M_{e^{-2u}}-I)y_c\|_{L^1_1}\over\|y_c\|_{L^1_1}}
 \leq C W,                                                            \tag{6.9}
\]

gives

\[
 {\|\mathcal L_{j,c}y_c\|_{L^1_1}\over\|y_c\|_{L^1_1}}
 \leq C_j\left(c^{-1/2}+W+{c^{-1/2}\over W}+{1\over cW}\right)
 \leq C_jc^{-1/4}.                                                     \tag{6.10}
\]

This proves (0.5).  More generally, no uniformly translated convolution
space which contains these packets with comparable input and output norms
can have a uniform inverse bound.

## 7. A positive delay already has square-root loss

Positivity would not repair the unrestricted algebra.  Consider the
model coefficient

\[
 \widetilde\alpha_c(s)=e^{-(s+1)/c},
 \qquad h={1\over c},\qquad A=e^{-4/c}.                               \tag{7.1}
\]

In the shifted convention (2.1), its measure is the positive measure
`A delta_h`.  Thus

\[
 (\widetilde{\mathcal L}_ck)(u)
 =k(u)+Ae^{-2(u-h)}k(u-h)\boldsymbol1_{u\geq h}.                       \tag{7.2}
\]

Let `g` be supported in `[0,h)` with `||g||_1=1`.  For `0<=x<h`, direct
recursion gives the exact inverse cells

\[
 k(x+nh)=(-1)^nA^n
 \exp\{-2nx-hn(n-1)\}g(x),
 \qquad n\geq0.                                                       \tag{7.3}
\]

Their supports are disjoint, and their masses obey

\[
 \int_0^h|k(x+nh)|\,dx
 \geq\exp\left\{-{n^2+5n\over c}\right\}.                           \tag{7.4}
\]

Summing (7.4) for `0<=n<=sqrt(c)/4` proves

\[
 \|\widetilde{\mathcal L}_c^{-1}\|_{L^1\to L^1}
 \geq c_0\sqrt c.                                                     \tag{7.5}
\]

The same lower bound holds from `L^1_1` to itself because the input is
supported in `[0,1/c)` and the weighted output norm dominates its
unweighted norm.  Thus positive support, positivity of the measure, and
Volterra triangularity do not by themselves imply a uniform inverse.

## 8. Exact stopping point

The unrestricted `L^1` plus first-moment realization proposed for CL is
false: the actual coefficient has the turning quasimode
(6.4), and even a positive approximate delay has the stronger model loss
(7.5).  The negative `J_2` lobe also rules out a complete-monotonicity or
positive-measure accretivity proof for the actual coefficient.

This is deliberately narrower than a failure of CL.  The required
subturning strip ends at `2c^(3/4)`, whereas the packets in Section 6 live
at frequency `2c`.  A future proof may still use a restricted spectral
space, a quotient norm blind to the turning packets, or a joint norm which
controls them by additional data.  Such a space must state that
restriction explicitly and prove that the Riccati nonlinearity and one
`t` derivative preserve it.  No such construction is asserted here.
