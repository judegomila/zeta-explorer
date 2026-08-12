# Cutoff-free full-source adjoint and prolate-capture barrier

## 0. Exact outcome and claim boundary

Let

\[
 \lambda>1,\qquad L=2\log\lambda,
 \qquad I_\lambda=[\lambda^{-1},\lambda],
 \qquad \mathcal G=L^2(I_\lambda,du/u),                 \tag{0.1}
\]

and let `A_lambda` be the full arithmetic source map

\[
 (A_\lambda f)(u)=\sqrt u
       \sum_{n\leq\lambda/u}f(nu).                     \tag{0.2}
\]

This note computes the adjoint of (0.2) on the even zero-integral source
space without suppressing either the evenization factor or the integral
correction.  For `g in G`, put

\[
 r_g(x)=x^{-1/2}\sum_{n\leq\lambda x}
                 n^{-1/2}g(x/n),
 \qquad \lambda^{-1}\leq x\leq\lambda,                \tag{0.3}
\]

and

\[
 c_g={1\over2\lambda}
       \int_{\lambda^{-1}}^\lambda r_g(x)\,dx.          \tag{0.4}
\]

Then the exact adjoint into the even zero-integral source is

\[
 \boxed{
 (A_{\lambda,0}^*g)(x)
 ={1\over2}{\bf1}_{\{|x|\geq\lambda^{-1}\}}
             r_g(|x|)-c_g.}                            \tag{0.5}
\]

For a definite physical inversion parity, (0.5) is the only nonzero
component of the two-copy full-source adjoint.  Its projection onto a
phase-separated leading prolate prefix has an exact coefficient formula:
raw coefficient energy minus one rank-one integral penalty.  In the
one-dimensional ground line this gives

\[
 \boxed{
 \gamma_{\sigma,m}(g)=
 {\displaystyle
   \sum_{n\in I_{\sigma,m}}|\beta_n(g)|^2
   -{\left|\sum_{n\in I_{\sigma,m}}
                   \overline{I_n}\beta_n(g)\right|^2
      \over s_{\sigma,m}}
  \over\displaystyle \|A_{\lambda,0}^*g\|^2}.}        \tag{0.6}
\]

Here `I_n=int h_(n,lambda)`,
`s_(sigma,m)=sum_(n in I_(sigma,m)) |I_n|^2`, and
`beta_n(g)=<A_(lambda,0)^*g,h_(n,lambda)>`.  Formula (0.6), including its
rank-one subtraction, is the scalar specialization of the principal-angle
quantity in the weighted radical coframe reduction.

The ground equation gives a rigorous theorem, but in the opposite direction
from a free capture estimate.  If `g` is a unit ground of value `mu_lambda`,
then

\[
 \boxed{
 |\mu_\lambda|^2
 \|P_{F_m}A_{\lambda,0}^*g\|^2
 \leq \mathcal C_{F_m}^2d_m.}                           \tag{0.7}
\]

Together with the full-source floor this implies

\[
 \boxed{
 |\mu_\lambda|^2\gamma_{\sigma,m}(g)
 \leq8\lambda^4\mathcal C_{F_m}^2d_m.}                 \tag{0.8}
\]

Thus, if the ground stays uniformly negative, its normalized adjoint is
forced to evacuate a sufficiently low-defect prefix.  The ground equation
does not furnish a lower bound for (0.6); a lower bound at the KRD scale is
already an RH-strength input through (0.8).

Finally, an exact arithmetic-adjoint countermodel shows that the currently
frozen spectral inputs cannot supply that lower bound.  It keeps the actual
map (0.2), its full-source floor, either physical parity, the exact
diagonal-plus-Cauchy form, compact resolvent, and every displayed
high-Fourier coercivity envelope.  Nevertheless its definite-parity ground
can be chosen so that, for `m<=4lambda^2-1`,

\[
 \gamma_{\sigma,m}
 \leq 8\,\dim(F_{\sigma,m})\lambda^6
              e^{-C_a(\lambda)/8}
 \leq 16\lambda^8e^{-C_a(\lambda)/8}.                  \tag{0.9}
\]

Since `C_a(lambda)>=4L(lambda-1)`, the last expression is at most
`16 lambda^(9-lambda)` and is superpolynomially small.  The model is not
the actual von-Mangoldt Weil operator.  It proves that parity, the ground
equation, the full-source floor, source-Cauchy displacement, and remote
logarithmic coercivity do not imply a polynomial near-Shannon capture
without new arithmetic orientation information.

No lower bound for the actual `gamma_(sigma,m)`, cutoff-free residual rate,
parity ordering, ground simplicity, new zero statement, converse, or RH is
proved.  The standard eight are untouched and the formal state remains
`P0_INVALIDATED`.

## 1. Frozen dependencies

No external source is added.  The exact repository inputs are:

| Dependency | SHA-256 |
|---|---|
| `notes/CUTOFF_FREE_WEIGHTED_RADICAL_COFRAME_REDUCTION_BARRIER.md` | `c84bc4ed8632aeedb8208e699350e0895a4437912b8ba735f10315b5cf1b7d8c` |
| `tests/test_cutoff_free_weighted_radical_coframe_reduction_barrier.py` | `d6d83b1a045b96da8ad7a49753a05f5981e9744b04ecb95470fbd5332bb87c11` |
| `notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md` | `3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81` |
| `tests/test_full_source_coframe_rank.py` | `dc322485178710618f9ace19cd2019200bf0dafeabcbe17cce4e47d41377d66a` |
| `notes/HIGH_FOURIER_COERCIVITY.md` | `5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821` |
| `tests/test_high_fourier_coercivity.py` | `64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae` |
| `notes/SOFT_DEFECT_PROLATE_ANGLE_REDUCTION.md` | `3bcccfda9d606c21fc61efb9c2fbc3dd95926a82586e3c156fc965c32748777b` |
| `tests/test_soft_defect_prolate_angle.py` | `f440a59456cc4cc604afc419bc1aebc9589a0a6010b179a4784c7f5c62ca2088` |

The weighted coframe pair fixes `F_(sigma,m)`, `d_m`, `C_(F_m)`, the
full-source normalization, and the exact KRD stopping line.  The full-source
pair supplies the row floor and the norm of `A_lambda`.  The coercivity pair
supplies the explicit diagonal envelopes and `C_a(lambda)`.  The soft-angle
pair supplies the earlier finite-target adjoint-tail identity and fixes the
rank-one integral geometry checked below.

## 2. Exact full-source adjoint

Let

\[
 \mathcal H_0^{\rm ev}
 =\left\{f\in L^2[-\lambda,\lambda]:
       f(-x)=f(x),\ \int_{-\lambda}^{\lambda}f(x)\,dx=0
   \right\}.                                           \tag{2.1}
\]

First ignore the zero-integral constraint.  With the target measure `du/u`,
Tonelli on finite sums gives

\[
\begin{aligned}
 \langle A_\lambda f,g\rangle_{\mathcal G}
 &=\sum_{n\geq1}
   \int_{\lambda^{-1}}^{\lambda/n}
       f(nu)\overline{g(u)}\,{du\over\sqrt u}\\
 &=\int_0^\lambda f(x)\overline{
      x^{-1/2}\sum_{n\leq\lambda x}n^{-1/2}g(x/n)}\,dx.
\end{aligned}                                               \tag{2.2}
\]

The sum is empty for `0<x<lambda^(-1)`.  The source norm counts the
positive half-interval twice.  Therefore the adjoint into the ambient even
space is

\[
 h_g(x)={1\over2}{\bf1}_{\{|x|\geq\lambda^{-1}\}}
                    r_g(|x|).                           \tag{2.3}
\]

The orthogonal projection from the even space onto (2.1) subtracts
`<h_g,1>/||1||^2`.  Since

\[
 \langle h_g,1\rangle
 =\int_{\lambda^{-1}}^\lambda r_g(x)\,dx,
 \qquad \|1\|^2=2\lambda,                              \tag{2.4}
\]

equations (2.3)--(2.4) prove (0.5).  They also give the exact norm

\[
 \boxed{
 \tau_g:=\|A_{\lambda,0}^*g\|^2
 ={1\over2}\int_{\lambda^{-1}}^\lambda|r_g(x)|^2\,dx
 -{1\over2\lambda}
     \left|\int_{\lambda^{-1}}^\lambda r_g(x)\,dx\right|^2.}
                                                               \tag{2.5}
\]

Let `Jg(u)=g(u^(-1))` and `S_sigma=(I+sigma J)/2`.  If `Jg=sigma g`, then

\[
 (S_\sigma A_\lambda|_{\mathcal H_0^{\rm ev}})^*g
 =A_{\lambda,0}^*g.                                    \tag{2.6}
\]

For the direct sum of the two source copies, a vector of definite physical
parity has (2.5) in the corresponding copy and zero in the other.  Equation
(2.6) does not identify physical inversion parity with additive Fourier
phase.

For reference, the complex centered log-Fourier mode

\[
 \psi_k(u)=L^{-1/2}u^{2\pi ik/L}                       \tag{2.7}
\]

has

\[
 r_{\psi_k}(x)
 ={x^{-1/2+2\pi ik/L}\over\sqrt L}
   \sum_{n\leq\lambda x}n^{-1/2-2\pi ik/L}.            \tag{2.8}
\]

Thus the adjoint kernels used below retain every arithmetic breakpoint;
they are not abstract freely rotated source vectors.

## 3. Exact additive-prolate coefficient formula

Let `h_(n,lambda)` be the real unit even additive prolate modes.  Put

\[
 I_n=\langle1,h_{n,\lambda}\rangle,
 \qquad
 \beta_n(g)=\langle A_{\lambda,0}^*g,h_{n,\lambda}\rangle.
                                                               \tag{3.1}
\]

Equation (0.5) gives the explicit coefficient

\[
 \boxed{
 \beta_n(g)=
 \int_{\lambda^{-1}}^\lambda
       r_g(x)\overline{h_{n,\lambda}(x)}\,dx
       -c_g\overline{I_n}.}                             \tag{3.2}
\]

Use the phase sets

\[
 I_{+,m}=\{0\leq n\leq m:n\equiv0\pmod4\},
 \qquad
 I_{-,m}=\{0\leq n\leq m:n\equiv2\pmod4\},           \tag{3.3}
\]

and define

\[
 E_{\sigma,m}=\operatorname {span}\{h_{n,\lambda}:
                          n\in I_{\sigma,m}\},
 \qquad
 F_{\sigma,m}=E_{\sigma,m}\cap\mathcal H_0^{\rm ev}. \tag{3.4}
\]

Let

\[
 s_{\sigma,m}=\|P_{E_{\sigma,m}}1\|^2
 =\sum_{n\in I_{\sigma,m}}|I_n|^2.                    \tag{3.5}
\]

The prefixes used in the frozen bridge have `s_(sigma,m)>0`.  Orthogonal
projection inside `E_(sigma,m)` removes the single direction
`P_E1/sqrt(s)`.  Therefore every `z in H_0^ev` satisfies

\[
 \boxed{
 \|P_{F_{\sigma,m}}z\|^2
 =\sum_{n\in I_{\sigma,m}}|\langle z,h_{n,\lambda}\rangle|^2
 -{\left|\sum_{n\in I_{\sigma,m}}
     \overline{I_n}\langle z,h_{n,\lambda}\rangle\right|^2
    \over s_{\sigma,m}}.}                              \tag{3.6}
\]

Taking `z=A_(lambda,0)^*g` proves (0.6).  A lower bound for the raw first
sum alone is insufficient: it may lie entirely in the removed integral
direction.

There is a basis-free complete-ground version.  On one physical parity
block let

\[
 T_\sigma=P_{X_\sigma}S_\sigma A_\lambda,
 \qquad R_\sigma=T_\sigma T_\sigma^*,
 \qquad Z_\sigma=R_\sigma^{-1/2}T_\sigma.              \tag{3.7}
\]

For `y in X_sigma` define

\[
 z_y=A_{\lambda,0}^*R_\sigma^{-1/2}y,
 \qquad \mathcal B_{\sigma,m}y
   =(\langle z_y,h_{n,\lambda}\rangle)_{n\in I_{\sigma,m}},
                                                               \tag{3.8}
\]

and let `i_(sigma,m)=(I_n)_(n in I_(sigma,m))`.  Because `Z_sigma^*` is an
isometry, `||z_y||=||y||`, and (3.6) gives

\[
 \boxed{
 \gamma_{\sigma,m}
 =\lambda_{\min}\!\left[
 \mathcal B_{\sigma,m}^*
 \left(I-{i_{\sigma,m}i_{\sigma,m}^*\over s_{\sigma,m}}\right)
 \mathcal B_{\sigma,m}\right].}                       \tag{3.9}
\]

For a one-dimensional block spanned by the unit ground `g`,
`R_sigma=tau_g I` and (3.9) is exactly (0.6).  For a multiple bottom,
one-vector estimates do not replace the smallest eigenvalue in (3.9).  On
the complete parity split `X=X_+ direct-sum X_-`, all maps in (3.7) are
block diagonal and

\[
 \gamma_m=\min_{\sigma:X_\sigma\ne\{0\}}\gamma_{\sigma,m}.    \tag{3.10}
\]

## 4. What the ground equation actually proves

Let `K_m:F_(sigma,m)->H_lambda` be the legal cutoff-free radical map of the
weighted coframe note.  Its ground projection agrees with the compact
arithmetic map:

\[
 P_\lambda\mathcal K_m
 =P_\lambda S_\sigma A_\lambda|_{F_{\sigma,m}}.         \tag{4.1}
\]

Let `g in Ran P_lambda` be a unit definite-parity ground,
`Q_lambda g=mu_lambda g`.  For every `f in F_(sigma,m)`, self-adjointness
and (4.1) give

\[
\begin{aligned}
 \mu_\lambda\langle A_{\lambda,0}^*g,f\rangle
 &=\mu_\lambda\langle g,\mathcal K_mf\rangle\\
 &=\langle g,Q_\lambda\mathcal K_mf\rangle.
\end{aligned}                                               \tag{4.2}
\]

Thus there is an exact source-vector identity

\[
 \boxed{
 \mu_\lambda P_{F_{\sigma,m}}A_{\lambda,0}^*g
 =(Q_\lambda\mathcal K_m)^*g.}                         \tag{4.3}
\]

On this finite source `Delta_m>0` and `Delta_m<=d_mI`.  By the definition

\[
 \mathcal C_{F_m}
 =\|Q_\lambda\mathcal K_m\Delta_m^{-1/2}\|,            \tag{4.4}
\]

one has

\[
 \|Q_\lambda\mathcal K_m\|
 \leq\mathcal C_{F_m}\sqrt{d_m}.                       \tag{4.5}
\]

Equations (4.3)--(4.5) prove (0.7), including `mu_lambda=0`.  Apply the
full-source theorem to the target line `span{g}`.  It gives

\[
 \tau_g=\|A_{\lambda,0}^*g\|^2
 \geq{1\over2\lambda^2M_\mu(\lambda)^2}
 \geq{1\over8\lambda^4}.                              \tag{4.6}
\]

Dividing (0.7) by (4.6) proves (0.8).  This is precisely the scalar form of
the weighted-coframe implication; the explicit adjoint exposes no hidden
reverse inequality.

If RH is false, the frozen cutoff-free dichotomy gives a fixed `delta>0`
with `mu_lambda<=-delta` eventually.  Then (0.8) yields the actual
evacuation estimate

\[
 \gamma_{\sigma,m}(g)
 \leq{8\lambda^4\mathcal C_{F_m}^2d_m\over\delta^2}.   \tag{4.7}
\]

This conditional asymptotic becomes useful if the separate uniform graph
transfer makes `C_(F_m)` polynomial.  It is an upper bound, not the missing
capture theorem.

## 5. Exact-arithmetic-map coercivity countermodel

The obstruction can be made while keeping `A_lambda` itself.  In centered
logarithmic coordinates, let

\[
 \psi_n(u)=L^{-1/2}u^{2\pi in/L},
\]

The frozen source convention is `V_n=(-1)^n psi_n`.  This diagonal unit
phase changes neither inversion parity nor any diagonal model below.

and, for `n>=1`, let

\[
 \phi_n^+={\psi_n+\psi_{-n}\over\sqrt2},
 \qquad
 \phi_n^-={\psi_n-\psi_{-n}\over i\sqrt2}.             \tag{5.1}
\]

For either fixed sign, these are orthonormal physical inversion-parity
modes.  Put

\[
 v_n^\sigma=A_{\lambda,0}^*\phi_n^\sigma.              \tag{5.2}
\]

The target-line full-source floor and upper norm are uniform in `n`:

\[
 \|v_n^\sigma\|^2\geq{1\over8\lambda^4},
 \qquad \|A_\lambda\|^2\leq{\lambda^2\over2}.          \tag{5.3}
\]

Fix any `d`-dimensional source space `F` and any integer `K>=1`.  If
`(e_j)_(j=1)^d` is an orthonormal basis of `F`, Bessel's inequality in the
physical parity block gives

\[
\begin{aligned}
 \sum_{n=K}^{2K-1}\|P_Fv_n^\sigma\|^2
 &=\sum_{j=1}^d\sum_{n=K}^{2K-1}
       |\langle\phi_n^\sigma,S_\sigma A_\lambda e_j\rangle|^2\\
 &\leq\sum_{j=1}^d\|S_\sigma A_\lambda e_j\|^2
 \leq{d\lambda^2\over2}.
\end{aligned}                                               \tag{5.4}
\]

Consequently some `N in [K,2K-1]` satisfies

\[
 {\|P_Fv_N^\sigma\|^2\over\|v_N^\sigma\|^2}
 \leq{4d\lambda^6\over K}.                            \tag{5.5}
\]

Now use the explicit constant `C_a(lambda)` from the high-Fourier theorem
and take

\[
 K=\max\{2,\lfloor e^{C_a(\lambda)/8}\rfloor\}.        \tag{5.6}
\]

Choose `N` furnished by (5.5), and define a cutoff-free operator in the
complex log-Fourier basis by

\[
 Q_\lambda^{(N)}\psi_n=a_n\psi_n,
 \qquad
 a_n=\begin{cases}
 0,&n=\pm N,\\
 \log(|n|+2),&n\ne\pm N.
 \end{cases}                                           \tag{5.7}
\]

This is the source-Cauchy form with `b_n=0`:

\[
 Q_\lambda^{(N)}=D_a+D_bH-HD_b,\qquad D_b=0.           \tag{5.8}
\]

It commutes with inversion, is nonnegative, and has compact resolvent.  Its
complete ground is `span{psi_N,psi_(-N)}`; each parity restriction has the
simple ground `phi_N^sigma` with eigenvalue zero.

The exceptional diagonal entry lies inside the remote window left open by
the coercivity theorem.  For all sufficiently large `lambda`, the maximum
with `2` in (5.6) is inactive.  Then `N<2K` and (5.6) give

\[
 \log(N/2)\leq\log K\leq C_a(\lambda)/8,                \tag{5.9}
\]

so at `n=N`

\[
 a_N=0\geq
 \log(N/2)-{1\over2\pi N}-C_a(\lambda).                \tag{5.10}
\]

At every other nonzero index the same lower envelope is immediate from
`log(|n|+2)>=log(|n|/2)`, and the frozen upper envelope is also satisfied.
The oddness and size conditions on `b_n` hold because `b_n=0`.  Hence every
displayed premise of the high-Fourier compression theorem is retained.

For large `lambda`, `K>=exp(C_a/8)/2`.  Apply (5.5) to
`F=F_(sigma,m)`.  Since `m<=S-1`, `S=4lambda^2`,

\[
 d=\dim F_{\sigma,m}\leq\lambda^2+1\leq2\lambda^2.
                                                               \tag{5.11}
\]

Equations (5.5)--(5.6) prove (0.9).  Finally

\[
 C_a(\lambda)\geq R_\lambda=4L(\lambda-1)              \tag{5.12}
\]

shows

\[
 16\lambda^8e^{-C_a(\lambda)/8}
 \leq16\lambda^{9-\lambda}.                            \tag{5.13}
\]

This countermodel uses the literal adjoint kernels (2.8), and its small
capture is selected by the exact Bessel trace (5.4).  It is stronger than a
free rotation of a finite matrix.  Its only artificial step is the retained-
window diagonal well (5.7), which the current coarse arithmetic envelopes
do not exclude.  Therefore it does not assert failure for the actual Weil
diagonal; it identifies the exact information absent from coercivity.

## 6. Weakest new statistic and stopping line

For a one-dimensional ground line, the minimal statistic is the corrected
partial energy

\[
 \mathfrak E_{\sigma,m}(g)
 =\sum_{n\in I_{\sigma,m}}|\beta_n(g)|^2
 -{\left|\sum_{n\in I_{\sigma,m}}
                   \overline{I_n}\beta_n(g)\right|^2
      \over s_{\sigma,m}}.                             \tag{6.1}
\]

No norm of `g`, raw prolate coefficient count, or uncorrected partial energy
replaces (6.1).  The exact normalized statistic is

\[
 \gamma_{\sigma,m}(g)={\mathfrak E_{\sigma,m}(g)\over\tau_g}.
                                                               \tag{6.2}
\]

For a multiple bottom, the weakest basis-invariant version is the smallest
eigenvalue in (3.9).  Equivalently, one must prove the actual arithmetic
coefficient-Gram inequality

\[
 \mathcal B_{\sigma,m}^*
 \left(I-{i_{\sigma,m}i_{\sigma,m}^*\over s_{\sigma,m}}\right)
 \mathcal B_{\sigma,m}
 \succeq \underline\gamma_{\lambda,m} I_{X_\sigma}.    \tag{6.3}
\]

With the exact KRD defect estimate, the weakest rate needed by the hard-
prefix route is

\[
 \boxed{
 {S-m-7\over\beta_\lambda}
 -\log{1\over\underline\gamma_{\lambda,m}}
 -2\log\mathcal C_{F_m}-4\log\lambda
 \longrightarrow+\infty.}                             \tag{6.4}
\]

A polynomial lower bound at `m=S-O((log lambda)^2)` is a convenient
sufficient case, not the logically minimal statement.  Proving (6.3)--
(6.4) requires actual retained-window arithmetic orientation of the ground.
Remote Fourier coercivity controls only the modes outside that window;
physical inversion parity supplies no coefficient mass; and (4.3) controls
the same coefficients from above after multiplication by `|mu_lambda|`.

Possible stronger inputs include an actual retained-window ground spectral
measure theorem, a direct lower bound for (6.1), or a source-to-ground
coframe estimate that implies (6.3).  Without one of them the explicit
adjoint does not close the weighted radical route.

## 7. Reproduction and claim discipline

Run

    python3 -B -m unittest \
      tests.test_cutoff_free_full_source_adjoint_prolate_capture_barrier -v

The regression checks the even-adjoint factor and zero-mean correction, the
rank-one coefficient formula, the ground-residual identity, the exact
Bessel trace mechanism, the location of the diagonal well inside the
coercivity window, dependency hashes, and fail-closed language.  It uses no
zeta-zero table, numerical ground, cached prolate artifact, network access,
or RH premise.
