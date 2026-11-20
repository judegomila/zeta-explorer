# RH even spectral cluster, ground primitive, and evaluation barrier

## 0. Exact outcome and claim boundary

Let

\[
 L=2\log\lambda,\qquad
 N=\lceil\lambda L^3\rceil,\qquad
 a_n={2\pi n\over L},\qquad
 \Omega_N=a_N.                                      \tag{0.1}
\]

Work on the conditional branch where every nontrivial zeta zero is on the
critical line, and retain the finite strict hypotheses of checkpoints
1.37--1.41.  Order the distinct positive ordinates by

\[
 0<\gamma_1^\#<\gamma_2^\#<\cdots,                  \tag{0.2}
\]

while retaining the algebraic multiplicity \(m_\gamma\) in every Gram
sum.  Write

\[
 \alpha_N=\lambda_{\min}(A^\circ),\qquad
 \mu_N=\lambda_{\min}(Q_{N,+}^Z),\qquad
 \epsilon_{+,N}={\mu_N\over\alpha_N}.               \tag{0.3}
\]

The actual projected-prolate scalars remain separate:

\[
 q_N={\|p_N^{\rm pr}\|_{\mathfrak Z}^2
                 \over2\|p_N^{\rm pr}\|_2^2},
 \qquad
 r_N^{\rm pr}={\|(p_N^{\rm pr})''\|_{\mathfrak Z}^2
                 \over2\|(p_N^{\rm pr})''\|_2^2},
 \qquad
 \kappa_N={r_N^{\rm pr}\over\alpha_N}.              \tag{0.4}
\]

This note proves three narrowly scoped results.

First, fix \(1/2<\theta<1\), put \(M=\lfloor\theta N\rfloor\), and take
an integer

\[
 1\leq k\leq N-M-1,\qquad s=N-M-k.                  \tag{0.5}
\]

There is an exact \(k\)-dimensional subspace of the positive-index even
space which annihilates the first \(M\) distinct actual zero rows and is
flat through order \(2s-1\) at both physical endpoints.  Uniformly on
its unit sphere,

\[
 \langle h,A^\circ h\rangle
 \leq C L T_M\log T_M
       \left({\Omega_N\over T_M}\right)^{4s},
 \qquad T_M=\gamma_M^\#.                            \tag{0.6}
\]

Consequently, with eigenvalues numbered increasingly,

\[
 \boxed{\lambda_k(A^\circ)
 \leq C L T_M\log T_M
       \left({\Omega_N\over T_M}\right)^{4s}.}       \tag{0.7}
\]

If \(k_N/N\longrightarrow\delta<1/2\), optimization gives

\[
 \boxed{
 \lambda_{k_N}(A^\circ)
 \leq\exp\{-(c_\delta-o(1))N\},\qquad
 c_\delta={4(1-\delta)(w_\delta-1)^2\over w_\delta},
 \quad
 w_\delta=W(2e(1-\delta)).}                         \tag{0.8}
\]

For \(k_N=o(N)\), this has the checkpoint-1.40 constant

\[
 c_0={4(W(2e)-1)^2\over W(2e)}
     =0.4087565478\ldots .                           \tag{0.9}
\]

Thus a growing collection of bottom eigenvalues lies below the same
exponential scale.  This blocks an orientation argument which treats one
small trial vector as the only low direction or assumes an absolute bulk
gap from that vector alone.  It does not bound
\(\lambda_2(A^\circ)/\lambda_1(A^\circ)\), rule out a relative ground
gap, identify the actual ground direction, or compare \(\mu_N\) with
\(\alpha_N\).

Second, the clamped twice primitive does not require endpoint flatness.
For every positive-mode vector \(h\), an explicit full-even vector
\(\mathcal R_Nh\) satisfies

\[
 (\mathcal R_Nh)''=h,\qquad
 \mathcal R_Nh(\mathord\pm L/2)
 =(\mathcal R_Nh)'(\mathord\pm L/2)=0,\qquad
 \widehat{\mathcal R_Nh}(t)=-{\widehat h(t)\over t^2}. \tag{0.10}
\]

Applied to a unit actual ground vector \(h_\alpha\) of \(A^\circ\), this
eliminates the one-vector saturation \(\kappa_N\) from the comparison:

\[
 \boxed{
 {\mu_N\over\alpha_N}
 \leq
 {\displaystyle\int\gamma^{-4}\,d\nu_\alpha(\gamma)
  \over
  \|\mathcal R_Nh_\alpha\|_2^2}.}                   \tag{0.11}
\]

Here \(\nu_\alpha\) is the exact probability distribution of the actual
ground sampling energy over positive ordinates.  Formula (0.11) exposes,
rather than solves, a negative-Sobolev/low-row conditioning ratio.  No
frozen theorem puts the actual ground sampling mass above the carrier edge
relative to its total energy.

Third, every positive semidefinite full real source-Cauchy matrix is a
finite positive real Fourier-evaluation Gram.  The shifted-hyperplane
family therefore is an exact real-evaluation Gram and has

\[
 {\mu\over\alpha}={\tau\over\tau+\varepsilon/(2N+1)}
 \longrightarrow1                                  \tag{0.12}
\]

for a fixed positive ratio \(\tau/\varepsilon\).  Its weights can be
approximated by positive rationals and cleared to give
arbitrarily close integer-weight finite Grams.  This is an obstruction inside the
unrestricted real-evaluation cone only.  It is not the actual zeta zero Gram,
does not place its nodes at zeta ordinates, and makes no unconditional
HSW-compatible divisor/prefix claim.

In particular, (0.7), (0.11), and (0.12) do not prove that
\(r_N^{\rm pr}\) saturates the floor, that the actual \(p_N''\) direction
is close to a minimal eigenspace, that \(q_N\), \(r_N^{\rm pr}\),
\(\alpha_N\), and \(\mu_N\) share a scale, or that the actual reserve is
positive.  No shifted-node uniqueness, determinant convergence, new zero
theorem, RH proof or converse, or de Bruijn--Newman \(\Lambda\) bound is
obtained.  The standard eight are unchanged and the formal state remains
P0_INVALIDATED.

## 1. Frozen inputs

Exactly the following three frozen pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/RH_EVEN_QUOTIENT_ENDPOINT_FLAT_FLOOR_OBSTRUCTION.md | b0a561a048df0b0eede249be8cc014ce29b8aa8fa29efb61de5d9bf773822d8c |
| tests/test_rh_even_quotient_endpoint_flat_floor_obstruction.py | 1f9caeec9487afd7a632b8572e1e401dbca22a2acb2b37b5359d5b5bf6ce1742 |
| notes/RH_EVEN_ENDPOINT_FLAT_GROUND_SHIFT_RATIO_BARRIER.md | 3aefae1160a823e7cd2ea4b5d35dc3c2048ea98faf855297a7b3e3212fae7d1e |
| tests/test_rh_even_endpoint_flat_ground_shift_ratio_barrier.py | cd3edcc91392261de65e84cac3f4d94a9effe358d87a3e2d4108761d23cb61ee |
| notes/SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md | e624c94412a3266de20161e30d7c130d9bcd623affa4b24d9558a0fa88e8fc26 |
| tests/test_source_cauchy_selector_cone_projective_tradeoff.py | f0314d289ec750c0668d4dab30a5fe34c63cc7b2577830c35aecf2b1650605ee |

The first pair supplies the actual even rows, the multiplicity-safe HSW
count, the quotient tail estimate, and the carrier conventions.  The
second fixes \(\alpha_N,\mu_N,q_N,r_N^{\rm pr},\kappa_N\), the centered
primitive convention, and the shifted-hyperplane comparison.  The third
supplies the source-Cauchy parameterization and the binary-form
moment-cone proof pattern.

No zero table, numerical ordinate, external source, new source lock, or
standard-eight byte is imported.

## 2. An exact \(k\)-plane of actual-zero quotients

Define

\[
 D_N(y)=\prod_{n=1}^N(y-a_n^2),\qquad
 P_M(y)=\prod_{j=1}^M(y-(\gamma_j^\#)^2).           \tag{2.1}
\]

For every real polynomial \(U\) with \(\deg U<k\), put

\[
 x_n(U)={P_M(a_n^2)U(a_n^2)\over D_N'(a_n^2)},
 \qquad 1\leq n\leq N.                              \tag{2.2}
\]

Since

\[
 \deg(P_MU)\leq M+k-1\leq N-2,                     \tag{2.3}
\]

partial fractions give the exact identity

\[
 \boxed{
 {P_M(y)U(y)\over D_N(y)}
 =\sum_{n=1}^N{x_n(U)\over y-a_n^2}.}               \tag{2.4}
\]

The map \(U\mapsto x(U)\) is injective even if selected ordinates collide
with carriers.  Indeed, at most \(M\) of the \(N\) carrier squares can be
roots of \(P_M\).  If \(x(U)=0\), then \(U\) vanishes at every remaining
carrier square, hence at at least \(N-M\geq k+1\) distinct points.  Since
\(\deg U<k\), this forces \(U=0\).  Therefore

\[
 \mathcal X_{N,M,k}
 =\{x(U):U\in{\mathbb R}[y],\ \deg U<k\}            \tag{2.5}
\]

has dimension exactly \(k\).

Use the aligned positive-index even basis

\[
 e_n^+(x)=\sqrt{2/L}(-1)^n\cos(a_nx),\qquad
 1\leq n\leq N.                                     \tag{2.6}
\]

For nonzero \(x(U)\), normalize

\[
 h_U={1\over\|x(U)\|_2}
       \sum_{n=1}^Nx_n(U)e_n^+.                     \tag{2.7}
\]

Away from carriers its transform is

\[
 \widehat h_U(t)
 ={2\sqrt{2/L}\over\|x(U)\|_2}
 t\sin(Lt/2){P_M(t^2)U(t^2)\over D_N(t^2)}.         \tag{2.8}
\]

Every one of the first \(M\) distinct actual rows vanishes.  All branches
are exact:

* at a selected noncarrier, \(P_M(t^2)=0\);
* at a selected in-band carrier \(t=a_n\), the continuous row is supported
  on coordinate \(n\), while \(x_n(U)=0\);
* at a selected out-of-band carrier \(t=a_n\), \(n>N\), the retained row
  is identically zero; and
* multiplicity repeats the same value row and creates no derivative jet.

Thus

\[
 \boxed{
 \widehat h_U(\gamma_j^\#)=0,\qquad 1\leq j\leq M.} \tag{2.9}
\]

This includes every carrier collision and makes no simplicity assumption.

## 3. Uniform endpoint flatness and the \(k\)th eigenvalue

The quotient in (2.4) is \(O(y^{-s-1})\) at infinity, because

\[
 s=N-M-k.                                           \tag{3.1}
\]

On the other hand,

\[
 \sum_{n=1}^N{x_n(U)\over y-a_n^2}
 =\sum_{r\geq0}
   \left(\sum_{n=1}^Nx_n(U)a_n^{2r}\right)y^{-r-1}. \tag{3.2}
\]

Coefficient comparison gives, for every \(U\) of degree less than \(k\),

\[
 \boxed{
 \sum_{n=1}^Nx_n(U)a_n^{2r}=0,
 \qquad0\leq r\leq s-1.}                            \tag{3.3}
\]

All odd derivatives of (2.6) vanish at both endpoints.  The even endpoint
derivatives are common nonzero factors times \(a_n^{2r}\).  Hence every
vector in the subspace

\[
 \mathcal H_{N,M,k}
 =\left\{\sum_{n=1}^Nx_n(U)e_n^+:\deg U<k\right\}   \tag{3.4}
\]

satisfies

\[
 h^{(j)}(\mathord\pm L/2)=0,
 \qquad0\leq j\leq2s-1.                             \tag{3.5}
\]

For every unit \(h\in\mathcal H_{N,M,k}\), integration by parts and the
exact bandlimit give

\[
 |\widehat h(t)|
 \leq {|t|^{-2s}}\sqrt L\,\|h^{(2s)}\|_2
 \leq\sqrt L\left({\Omega_N\over|t|}\right)^{2s}.   \tag{3.6}
\]

The first \(M\) distinct rows vanish by (2.9).  The multiplicity-aware
HSW tail estimate frozen at checkpoint 1.40 then gives

\[
 \begin{aligned}
 \langle h,A^\circ h\rangle
 &=2\sum_{\gamma>0}m_\gamma|\widehat h(\gamma)|^2\\
 &\leq2L\Omega_N^{4s}
          \sum_{\gamma>T_M}m_\gamma\gamma^{-4s}\\
 &\leq C L T_M\log T_M
          \left({\Omega_N\over T_M}\right)^{4s}.
 \end{aligned}                                      \tag{3.7}
\]

The constant is independent of \(h,k\), and \(s\) once \(s\geq1\) and
the locked HSW starting height has been passed.  Since
\(\dim\mathcal H_{N,M,k}=k\), Courant--Fischer yields (0.7).

This is an upper bound for \(\lambda_k(A^\circ)\), not a lower frame
bound.  It contains no assertion that a quotient vector is an eigenvector.

## 4. Optimized cluster exponent

The frozen distinct-ordinate consequence of HSW is

\[
 \liminf_{N\longrightarrow\infty}
 {T_M\over\Omega_N}\geq2\theta.                    \tag{4.1}
\]

Suppose

\[
 {k_N\over N}\longrightarrow\delta,\qquad
 0\leq\delta<1/2,\qquad
 {1\over2}<\theta<1-\delta.                         \tag{4.2}
\]

The polynomial prefactor in (3.7) is \(\exp(o(N))\), while

\[
 {s\over N}=1-\delta-\theta+o(1).                  \tag{4.3}
\]

Therefore

\[
 \limsup_{N\longrightarrow\infty}{1\over N}
 \log\lambda_{k_N}(A^\circ)
 \leq-4(1-\delta-\theta)\log(2\theta),              \tag{4.4}
\]

with \(\log0=-\infty\) if an eigenvalue vanishes.

Put

\[
 c_\delta(\theta)
 =4(1-\delta-\theta)\log(2\theta).                  \tag{4.5}
\]

Its critical equation is

\[
 {1-\delta\over\theta}-1-\log(2\theta)=0.           \tag{4.6}
\]

Writing \(w_\delta=(1-\delta)/\theta\) turns (4.6) into

\[
 w_\delta+\log w_\delta
 =1+\log(2(1-\delta)),
 \qquad
 w_\delta e^{w_\delta}=2e(1-\delta).                \tag{4.7}
\]

For \(\delta<1/2\), the unique solution satisfies

\[
 w_\delta>1,\qquad
 {1\over2}<\theta_\delta
 ={1-\delta\over w_\delta}<1-\delta.                \tag{4.8}
\]

The derivative changes from positive to negative there, so
\(\theta_\delta\) is the unique maximizer and

\[
 c_\delta
 =c_\delta(\theta_\delta)
 ={4(1-\delta)(w_\delta-1)^2\over w_\delta}>0.      \tag{4.9}
\]

Equations (4.4)--(4.9) prove (0.8).  In particular, any sequence
\(k_N\longrightarrow\infty\) with \(k_N=o(N)\) gives the same exponent
\(c_0-o(1)\).  This is a growing bottom cluster, but it says nothing about
relative spacing inside that cluster.

## 5. The exact clamped primitive of the actual ground

Let

\[
 h=\sum_{n=1}^Nh_ne_n^+                             \tag{5.1}
\]

be arbitrary; no endpoint moment is imposed.  Define

\[
 \boxed{
 \mathcal R_Nh
 =\left(\sqrt2\sum_{n=1}^N{h_n\over a_n^2}\right)e_0
  -\sum_{n=1}^N{h_n\over a_n^2}e_n^+,
 \qquad e_0=L^{-1/2}.}                              \tag{5.2}
\]

Since \(e_n^+(\mathord\pm L/2)=\sqrt{2/L}\), the central term in (5.2)
cancels the positive-mode endpoint sum exactly.  Every first derivative
vanishes there, and coefficientwise differentiation gives

\[
 \boxed{
 \mathcal R_Nh(\mathord\pm L/2)
 =(\mathcal R_Nh)'(\mathord\pm L/2)=0,\qquad
 (\mathcal R_Nh)''=h.}                              \tag{5.3}
\]

Twice integrating by parts gives, for \(t\ne0\),

\[
 \widehat{\mathcal R_Nh}(t)
 =-{\widehat h(t)\over t^2}.                        \tag{5.4}
\]

Both sides have their continuous value at \(t=0\).  Orthogonality gives
the exact negative-Sobolev norm

\[
 \boxed{
 \|\mathcal R_Nh\|_2^2
 =\sum_{n=1}^N{|h_n|^2\over a_n^4}
  +2\left|\sum_{n=1}^N{h_n\over a_n^2}\right|^2
 \geq\Omega_N^{-4}\|h\|_2^2.}                      \tag{5.5}
\]

Let \(h_\alpha\) be a unit actual ground vector:

\[
 A^\circ h_\alpha=\alpha_Nh_\alpha,\qquad
 \|h_\alpha\|_2=1.                                  \tag{5.6}
\]

Under the finite strict hypotheses, \(\alpha_N>0\).  Define the actual
ground sampling probability

\[
 \nu_\alpha(\{\gamma\})
 ={m_\gamma|\widehat h_\alpha(\gamma)|^2
   \over
   \displaystyle\sum_{\beta>0}
          m_\beta|\widehat h_\alpha(\beta)|^2}.     \tag{5.7}
\]

The reflected-height factor two cancels in this probability.  Equations
(5.3)--(5.7) and min--max give

\[
 \begin{aligned}
 \mu_N
 &\leq
 {\langle\mathcal R_Nh_\alpha,
          Q_{N,+}^Z\mathcal R_Nh_\alpha\rangle
  \over\|\mathcal R_Nh_\alpha\|_2^2}\\
 &=\alpha_N\,
 {\displaystyle\int\gamma^{-4}\,d\nu_\alpha(\gamma)
  \over\|\mathcal R_Nh_\alpha\|_2^2}.
 \end{aligned}                                      \tag{5.8}
\]

Dividing by \(\alpha_N\) proves (0.11).  This comparison contains neither
\(r_N^{\rm pr}\) nor \(\kappa_N\).  It also contains no endpoint-flat
surrogate in place of the actual ground.

## 6. The remaining low-row conditioning ratio

For \(T=T_M\), split the actual ground energy by

\[
 \rho_{\alpha,M}
 ={\displaystyle\sum_{0<\gamma\leq T}
       m_\gamma|\widehat h_\alpha(\gamma)|^2
   \over
   \displaystyle\sum_{\gamma>0}
       m_\gamma|\widehat h_\alpha(\gamma)|^2}
 =\nu_\alpha((0,T]).                                \tag{6.1}
\]

If \(\gamma_1^\#\) is the least positive ordinate, then

\[
 \int\gamma^{-4}\,d\nu_\alpha(\gamma)
 \leq T^{-4}+
  \{(\gamma_1^\#)^{-4}-T^{-4}\}\rho_{\alpha,M}.      \tag{6.2}
\]

Combining (5.8), (5.5), and (6.2) gives the explicit but generally
nonclosing estimate

\[
 {\mu_N\over\alpha_N}
 \leq
 {T^{-4}
  +\{(\gamma_1^\#)^{-4}-T^{-4}\}\rho_{\alpha,M}
  \over\|\mathcal R_Nh_\alpha\|_2^2}.               \tag{6.3}
\]

The quotient \(k\)-plane has \(\rho_{\alpha,M}=0\) only for its own
vectors; (0.7) does not put the actual ground in that plane.  Absolute
smallness of \(\alpha_N\) gives absolute smallness of every low-row sample,
but it does not make the low-row energy small relative to the total
\(\alpha_N\).

Closing (6.3) requires an oriented assertion about at least one of

\[
 \rho_{\alpha,M},\qquad
 \|\mathcal R_Nh_\alpha\|_2^2,\qquad
 {\rm dist}(h_\alpha,\ker B_{\leq M}),              \tag{6.4}
\]

where \(B_{\leq M}\) is the first-\(M\)-row actual sampling map.  A useful
bound on the last quantity would itself require relative low-row singular
information and a comparison with the total ground energy.  RH plus the
HSW count supplies row locations and counts, not this conditioning.

Thus the primitive removes \(\kappa_N\) algebraically but does not prove
\(\epsilon_{+,N}<1-\rho\).  It identifies the exact actual-compatible
missing ratio.

## 7. The full real evaluation cone

This section is a finite theorem and uses no zeta source.  Put

\[
 I_N=\{-N,-N+1,\ldots,N\},\qquad d=2N+1.            \tag{7.1}
\]

In the aligned full Fourier basis, the real evaluation row at
\(t=2\pi r/L\) is

\[
 v_N(r)_n
 ={\sqrt L\sin(\pi r)\over\pi(r-n)},\qquad n\in I_N, \tag{7.2}
\]

with continuous interpretation at integer \(r\).  Define

\[
 \Delta_N(r)=\prod_{m\in I_N}(r-m),\qquad
 \ell_N(r)_n=\prod_{\substack{m\in I_N\\m\ne n}}(r-m)
          ={\Delta_N(r)\over r-n}.                  \tag{7.3}
\]

Away from carriers, \(v_N(r)\) is a nonzero real scalar multiple of
\(\ell_N(r)\).  Carrier limits give coordinate rays, and the projective limit
at infinity gives

\[
 \eta=(1,\ldots,1)^T.                               \tag{7.4}
\]

Let \(\mathcal S_N\) be the full real source-Cauchy space

\[
 H_{nn}=c_n,\qquad
 H_{nm}={b_n-b_m\over n-m}\quad(n\ne m).            \tag{7.5}
\]

The diagonal has \(d\) parameters and \(b\) has \(d-1\) parameters modulo
an additive constant, so

\[
 \dim\mathcal S_N=2d-1=4N+1.                       \tag{7.6}
\]

Every projective evaluation atom belongs to this space.  For finite
noncarrier \(r\), take

\[
 b_n=\Delta_N(r)\ell_N(r)_n
    ={\Delta_N(r)^2\over r-n}.                      \tag{7.7}
\]

Then

\[
 {b_n-b_m\over n-m}
 ={ \Delta_N(r)^2\over(r-n)(r-m)}
 =\ell_N(r)_n\ell_N(r)_m.                           \tag{7.8}
\]

Carrier and infinity atoms follow by continuity or direct substitution.

The polynomials \(\ell_N(r)_n\), \(n\in I_N\), form a basis of the real
polynomials of degree at most \(d-1\): evaluation at the \(d\) carrier
nodes makes their coefficient matrix invertible.  Hence an invertible
matrix \(C_N\) sends the projective moment curve

\[
 m(u,v)=(u^{d-1},u^{d-2}v,\ldots,v^{d-1})^T        \tag{7.9}
\]

to the projective \(\ell_N\)-curve.  The span of
\(m(u,v)m(u,v)^T\) is the \(2d-1\)-dimensional Hankel space, because its
entries contain exactly the monomials of total projective degree
\(2d-2\).  Equations (7.6)--(7.8) therefore prove

\[
 \boxed{
 \mathcal S_N=C_N\{\hbox{real Hankel matrices}\}C_N^T.} \tag{7.10}
\]

It remains to identify the positive cone.  If
\(K=(y_{i+j})_{0\leq i,j<d}\) is Hankel, let
\(\mathcal L_K\) be the functional on binary forms of degree \(2d-2\)
whose moments are \(y_0,\ldots,y_{2d-2}\).  Then

\[
 K\succeq0
 \quad\Longleftrightarrow\quad
 \mathcal L_K(F^2)\geq0
 \quad\hbox{for every binary form }F\hbox{ of degree }d-1. \tag{7.11}
\]

Every nonnegative real binary form \(G\) of degree \(2d-2\) is a
sum of two squares of real binary forms of degree \(d-1\):

\[
 G=F_1^2+F_2^2.                                    \tag{7.12}
\]

For completeness, factor \(G\) over \(\mathbb C\).  Its real projective
roots have even multiplicity.  Put half of each real multiplicity and one
root from every nonreal conjugate pair into a degree-\(d-1\) form
\(F_1+iF_2\); after a positive scalar normalization its product with its
conjugate is (7.12).

It follows from (7.11)--(7.12), duality on the compact real projective
line, and the bipolar theorem that

\[
 \boxed{
 K\succeq0
 \quad\Longleftrightarrow\quad
 K=\sum_{j=1}^J\theta_j
       m(u_j,v_j)m(u_j,v_j)^T,\qquad\theta_j>0,}    \tag{7.13}
\]

with \(J\leq2d-1\) by conic Caratheodory.  Congruence and the harmless
positive rescaling between \(\ell_N(r)\) and \(v_N(r)\) now give

\[
 \boxed{
 H\in\mathcal S_N,\ H\succeq0
 \quad\Longrightarrow\quad
 H=\sum_{j=1}^J\vartheta_j
       v_N(r_j)v_N(r_j)^T,\qquad\vartheta_j>0,}     \tag{7.14}
\]

where finite carriers and projective infinity are allowed in the closed
cone statement.

If \(H\succ0\), it lies in the relative interior of the cone.  Deleting
any prescribed finite set of projective parameters leaves a dense
generating set with the same linear span.  The relative interior of its
conic hull equals the relative interior of the closed cone.  Thus the
representation in (7.14) can be chosen to avoid that finite set.  In
particular, one may avoid

\[
 r=0,\qquad r\in I_N,\qquad r=\infty.               \tag{7.15}
\]

If \(H\) is invariant under mode reversal, average the representation with
its reversal.  Since

\[
 v_N(-r)=Jv_N(r),                                   \tag{7.16}
\]

this gives equal positive weights at paired nonzero parameters
\(\mathord\pm r\).

## 8. Shifted hyperplane and integer-weight approximation

Let \(g=\eta/\sqrt d\), and for \(\tau,\varepsilon>0\) define

\[
 \mathcal G_{\tau,\varepsilon}
 =\tau I+\varepsilon(I-|g\rangle\langle g|).        \tag{8.1}
\]

Its entries are

\[
 (\mathcal G_{\tau,\varepsilon})_{nn}
 =\tau+\varepsilon(1-d^{-1}),\qquad
 (\mathcal G_{\tau,\varepsilon})_{nm}
 =-{\varepsilon\over d}\quad(n\ne m).              \tag{8.2}
\]

It is source-Cauchy with

\[
 b_n=-{\varepsilon n\over d}.                       \tag{8.3}
\]

Its full ground is simple:

\[
 \mathcal G_{\tau,\varepsilon}g=\tau g,\qquad
 \mathcal G_{\tau,\varepsilon}|_{g^\perp}
 =(\tau+\varepsilon)I.                              \tag{8.4}
\]

The odd block is \((\tau+\varepsilon)I\).  After passing to the normalized
even basis and deleting the central mode, the positive-index block is

\[
 A^\circ_{\tau,\varepsilon}
 =(\tau+\varepsilon)I_N
  -{2\varepsilon\over d}{\bf1}{\bf1}^T.            \tag{8.5}
\]

Therefore

\[
 \alpha_{\tau,\varepsilon}
 =\tau+{\varepsilon\over d},\qquad
 \mu_{\tau,\varepsilon}=\tau,\qquad
 {\mu_{\tau,\varepsilon}\over\alpha_{\tau,\varepsilon}}
 ={\tau\over\tau+\varepsilon/d}.                   \tag{8.6}
\]

For example, taking

\[
 \tau={R\over5},\qquad\varepsilon={4R\over5}        \tag{8.7}
\]

gives

\[
 {\mu_{\tau,\varepsilon}\over\alpha_{\tau,\varepsilon}}
 ={1\over1+4/d}\longrightarrow1.                   \tag{8.8}
\]

The matrix in (8.1) is positive definite, reversal invariant, and belongs
to \(\mathcal S_N\).  Sections 7.14--7.16 therefore give an exact finite
representation by paired positive real evaluation rows, with all support
nonzero, finite, and away from carriers.  Thus the obstruction is not
merely a formal source-Cauchy matrix: it lies exactly in the unrestricted
real Fourier-evaluation Gram cone.

The exact positive weights in that representation need not be rational.
Approximate the finitely many paired weights by positive rationals,
preserving equal weights at \(\mathord\pm r_j\), to obtain

\[
 \|\widetilde{\mathcal G}
       -\mathcal G_{\tau,\varepsilon}\|_{\rm op}<\zeta \tag{8.9}
\]

for arbitrary \(\zeta>0\).  Clearing a common denominator makes every
weight an integer.  The common scalar does not change an eigenvalue ratio,
and eigenvalue continuity shows that the integer-weight finite Gram keeps
a simple ground, positive shifted blocks, and a ratio arbitrarily close
to (8.6) when \(\zeta\) is small.

This last approximation does not retain the hyperplane entries exactly.
More importantly, neither the exact real-weight representation nor its
integer-weight approximation is asserted to satisfy the locked HSW prefix,
the HSW error term, a common divisor condition across stages, the zeta
ordinates, or the pole--archimedean--minus-prime source row.  There is no
unconditional HSW-compatible divisor/prefix claim, and no padding theorem
is being used.

## 9. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. reverses (0.7) into a lower bound or a lower frame;
2. treats the \(k\)-plane as an actual eigenspace;
3. infers a bound for \(\lambda_2/\lambda_1\) from the bottom cluster;
4. omits the noncarrier, in-band carrier, out-of-band carrier, or
   multiplicity branch;
5. replaces repeated value rows by derivative jets;
6. identifies \(q_N\), \(r_N^{\rm pr}\), \(\alpha_N\), or \(\mu_N\);
7. infers that the actual \(p_N''\) direction is near a minimal
   eigenspace;
8. drops the negative-Sobolev denominator in (0.11);
9. turns absolute low-row smallness into the relative mass bound
   \(\rho_{\alpha,M}=o(1)\);
10. identifies a positive real-evaluation Gram or an integer-weight finite
    Gram with the actual zeta zero Gram;
11. asserts an unconditional HSW-compatible prefix, divisor, padding, or
    source-row realization; or
12. infers the even reserve, shifted-node uniqueness, determinant
    convergence, RH, a converse from RH, or a de Bruijn--Newman
    \(\Lambda\) bound.

The surviving actual target is an oriented negative-Sobolev/low-row
conditioning estimate for the true \(A^\circ\) ground, or independent
arithmetic information forcing the actual \(p_N''\) direction into its
minimal spectral cluster.  Neither is supplied here.
