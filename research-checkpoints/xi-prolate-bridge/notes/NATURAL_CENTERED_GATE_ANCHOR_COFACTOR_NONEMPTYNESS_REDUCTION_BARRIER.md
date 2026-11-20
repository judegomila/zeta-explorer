# Natural centered-gate anchor-cofactor nonemptiness reduction/barrier

## 0. Exact outcome and claim boundary

This note isolates the finite nonemptiness input left on the eta-free simple
branch after checkpoint 1.59.  It proves the following exact reductions.

1. A simple lowest eigenvector of the inversion-even source-Cauchy
   compression is axis-rooted even when its boundary pairing vanishes.
   Therefore the strict simple branch may normalize the ground line as
   `g=P*kappa/s`, rather than with `P*eta`.
2. The centered compression

   \[
    H_q=P_{\kappa^\perp}(A-qI)P_{\kappa^\perp}
        \big|_{\kappa^\perp},
    \qquad q=\langle\kappa,A\kappa\rangle,          \tag{0.1}
   \]

   is affine-linear in the complete source.  The sufficient condition
   `H_q>0` implies the strict lower-Ritz gate and the sharp bound
   `0<(q-u)/r<1`.  If `r=0`, the same condition makes `kappa` the exact
   unique ground and closes the projective observable immediately.
3. For every real `t`, positivity of the anchor compression is equivalent
   to one eigenvalue count and one signed anchor cofactor:

   \[
    H_t\succ0
    \quad\Longleftrightarrow\quad
    \mu_2(A)>t\ \hbox{ and }
    D(t):=\langle\kappa,\operatorname {adj}(A-tI)\kappa\rangle>0.
                                                               \tag{0.2}
   \]

4. For `r>0`, the bounded Ritz ratio is exactly a normalized cubic-moment
   condition.  For the actual universal-`G` matrices, `D(q)` is a
   growing-order determinant correlation.  At each prime-power threshold,
   its Jacobi derivative has an adaptive cofactor contrast with no fixed
   sign.

The minimal actual-source theorem still needed for centered-gate
nonemptiness is therefore the occurrence, on cofinally many odd dyadic
blocks, of an index `p` for which

\[
 \boxed{\mu_{2,p}>q_p,\qquad D_p(q_p)>0.}           \tag{0.3}
\]

This occurrence is not proved.  Once it holds, checkpoint 1.59 supplies an
automatic positive anchor weight and the eta-free weighted Plucker target;
the weighted covariance estimate itself remains a separate unproved input.
Boundary visibility remains relevant only to the canonical multiple-ground
branch.

Two exact source-Cauchy families mark the stopping line.  A rank-one
boundary family works with any prescribed unit anchor, including the actual
natural prolate anchor, has the exponential quasimode scalar scale, and
makes the centered, simple, and canonical good sets empty.  A second family has
`r>0`, the strict simple gate, and bounded Ritz ratio, but
`P_E*eta=0`; it shows only that eta visibility must not be restored on the
simple branch.

No actual gate, cofactor sign, weighted covariance, determinant limit,
zeta-zero theorem, Riemann hypothesis, converse, or de Bruijn--Newman bound
is proved.  No standard-eight file is changed, and the formal state remains
`P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly four note/test pairs are frozen.

| Dependency | SHA-256 |
|---|---|
| `notes/EVEN_SECTOR_CROSS_ROOT_LIMIT_BRIDGE.md` | `c8656f4c5e574ac30972b0645015a3bb57492908efbf0e57ddef5de9c0c6e9c2` |
| `tests/test_even_sector_cross_root_limit_bridge.py` | `73d7705dc170c7081cf99a7669bd74493ed937cac75dcaa075beacdbf9e3b3b1` |
| `notes/NATURAL_ADJUGATE_PLUCKER_INVERSE_CHRISTOFFEL_COVARIANCE_REDUCTION_BARRIER.md` | `4506f01ad61c6110bd09f05b98be5318a4f47a35172a37b2560c350057a06146` |
| `tests/test_natural_adjugate_plucker_inverse_christoffel_covariance_reduction_barrier.py` | `3fdd3f9f8196eab4d99d73bb31eec3e716dc873b4d6dac6ca6f273e41a24a2ea` |
| `notes/NATURAL_OUTER_SHELL_LARGE_SIEVE_INVERSE_SPREAD_BARRIER.md` | `79be0448f5e144819ee9eb2e249021c3c5ffe44949a58b75002e2a117c1b85da` |
| `tests/test_natural_outer_shell_large_sieve_inverse_spread_barrier.py` | `e65c890a6f97def68b48825ccb8c3148926c744cd77f27754fb7790534dbabf8` |
| `notes/NATURAL_GEVREY_QUASIMODE_TEMPLE_ORIENTATION_BARRIER.md` | `c5cabe812995379a9e93fb32bb4ea648d97cbc52c7494d794ef1146cccc4b5c6` |
| `tests/test_natural_gevrey_quasimode_temple_orientation_barrier.py` | `1ce65c5ebd600120f65665cb650dec029f479fc7e95310b408570688e689c212` |

The first pair supplies the checkpoint-0.71 theorem that every simple
lowest even source-Cauchy eigenvector has an axis-rooted transform, including
the zero-boundary-pairing case.  The second supplies the repaired eta-free
`P*kappa` normalization and anchor-weighted Plucker target.  The third
supplies the universal Chebyshev error, complete combined-source formula,
and inclusive prime-power convention.  The fourth supplies the genuine
natural odd-halfgrid exponential quasimode scale.

All centered-gate, inertia, cubic-moment, determinant-correlation,
prime-threshold, and countermodel calculations below are proved directly.
No new external source, source lock, zero table, ordinate, artifact, or
numerical computation is used.

## 2. Eta-free simple line and checkpoint-0.71 axis roots

Let `A` be the finite inversion-even compression of a real source-Cauchy
matrix and suppose its lowest even eigenvalue `mu` is simple.  Let `P` be
the corresponding rank-one projector.  The checkpoint-0.71 theorem proves
that every zero of the raw-mode polynomial of this eigenvector is real,
even when

\[
 \langle\eta,\operatorname {Ran}P\rangle=0.         \tag{2.1}
\]

Its Fourier--Mellin transform is therefore axis-rooted.  Boundary pairing
is not needed for this finite conclusion.

Let `g` be a unit vector on the simple ground line, choose its phase
arbitrarily, and put

\[
 s=\langle g,\kappa\rangle,
 \qquad P\kappa=s g.                              \tag{2.2}
\]

Let `kappa` be a unit anchor and assume the strict simple gate at a real
shift `t`:

\[
 P_{\kappa^\perp}(A-tI)P_{\kappa^\perp}
       \big|_{\kappa^\perp}\succ0,
 \qquad \mu\leq t.                                  \tag{2.3}
\]

The ground line cannot be orthogonal to `kappa`.  Otherwise a unit ground
vector `g` would lie in `kappa^perp` and would satisfy

\[
 \langle g,(A-tI)g\rangle=\mu-t\leq0,              \tag{2.4}
\]

contradicting (2.3).  Hence

\[
 s\ne0,
 \qquad g={P\kappa\over s},
 \qquad \rho=\langle\kappa,P\kappa\rangle=|s|^2
             =\|P\kappa\|^2>0,
 \qquad X={P\kappa\over\rho},
 \qquad \langle\kappa,X\rangle=1.                 \tag{2.5}
\]

Both `g=P*kappa/s` and the coefficient-normalized vector `X` span the same
axis-rooted ground line, without using `P*eta`.  The phase-dependent scalar
`s` disappears from every projector identity below.

At adjacent cutoffs `N=M+1`, let `e_N` be the outer even mode and put

\[
 k=1-|\langle e_N,\kappa\rangle|^2,
 \qquad
 \Delta^\kappa=\det\operatorname {Gram}
       (e_N,\kappa,P\kappa).                       \tag{2.6}
\]

For `k>0` and
`cal L=span(e_N,kappa)^perp`, the Gram Schur complement gives

\[
 \boxed{
 {\Delta^\kappa\over k}=\|P_{\cal L}P\kappa\|^2,
 \qquad
 {\Delta^\kappa\over k\rho^2}=\|P_{\cal L}X\|^2.} \tag{2.7}
\]

Thus the simple-branch dyadic target is

\[
 \boxed{
 \sum_{p\in{\cal G}_P}{\Delta_p^\kappa\over k_p}
 \leq {C(\log P)^B\over P}
       \sum_{p\in{\cal G}_P}\rho_p^2.}            \tag{2.8}
\]

Every summand on the right is positive.  Consequently nonemptiness of the
strict-simple good set is its only nonvacuity condition.  The estimate
(2.8) remains unproved.

## 3. The affine centered gate and the exact Ritz bound

Now let `A` be any Hermitian matrix on a finite-dimensional space of
dimension at least two.  For a unit `kappa`, set

\[
 q=\langle\kappa,A\kappa\rangle,
 \qquad b=(A-qI)\kappa\in\kappa^\perp,
 \qquad r=\|b\|.                                   \tag{3.1}
\]

Let `K=kappa^perp`, `B=P_K A P_K|_K`, and

\[
 H_t=B-tI_K.
                                                               \tag{3.2}
\]

For a fixed anchor, the map

\[
 A\longmapsto H_q
 =P_K\{A-\langle\kappa,A\kappa\rangle I\}P_K|_K  \tag{3.3}
\]

is linear, hence affine-linear in every source parametrization of `A`.
This is the advantage of centering at `q` rather than at the nonlinear
Ritz root.

Assume first that `r>0`, put `w=b/r`, and define

\[
 a=\langle w,Aw\rangle.                            \tag{3.4}
\]

The two-vector Ritz matrix on `span(kappa,w)` is

\[
 \begin{pmatrix}q&r\\r&a\end{pmatrix}.             \tag{3.5}
\]

Let `u<q` be its lower eigenvalue, `d=q-u`, and

\[
 \tau={d\over r}>0.                                \tag{3.6}
\]

Its characteristic equation gives the two exact identities

\[
 \boxed{d(a-u)=r^2,
 \qquad {a-q\over r}=\tau^{-1}-\tau.}             \tag{3.7}
\]

If `H_q>0`, then

\[
 a-q=\langle w,H_qw\rangle>0.                    \tag{3.8}
\]

Equations (3.7)--(3.8) imply

\[
 \boxed{0<\tau<1,
 \qquad H_u=H_q+dI_K\succ0.}                      \tag{3.9}
\]

In particular, the strict complement floor satisfies

\[
 \beta_u:=\lambda_{\min}(H_u)
 =\lambda_{\min}(H_q)+d>d>0.                     \tag{3.10}
\]

Thus `H_q>0` is a stronger affine-source sufficient gate that supplies both
strictness and a uniformly bounded exact Ritz ratio.

If `r=0`, then `A*kappa=q*kappa`.  When `H_q>0`, the decomposition
`span(kappa) direct-sum K` is reducing and

\[
 A=q\oplus(qI_K+H_q).                              \tag{3.11}
\]

Therefore `kappa` is the unique lowest eigenvector.  In (2.5), `P*kappa` is
`kappa`, `rho=1`, and `P_L*kappa=0`; the projective observable is exactly
zero.  This is the immediate `r=0` closure branch.

## 4. One-level count and signed anchor cofactor

Let

\[
 \mu_1\leq\mu_2\leq\cdots\leq\mu_n              \tag{4.1}
\]

be the eigenvalues of `A`, and let

\[
 \nu_1\leq\cdots\leq\nu_{n-1}                   \tag{4.2}
\]

be the eigenvalues of its compression `B` to `kappa^perp`.  Cauchy
interlacing gives

\[
 \mu_j\leq\nu_j\leq\mu_{j+1}.                   \tag{4.3}
\]

Define the anchor cofactor

\[
 D(t)=\det H_t
 =\boxed{\langle\kappa,
        \operatorname {adj}(A-tI)\kappa\rangle}.  \tag{4.4}
\]

The equality follows by choosing an orthonormal basis whose first vector is
`kappa`: the displayed quadratic form is the corresponding principal
cofactor.

If `H_t>0`, then `nu_1>t`, hence `mu_2>=nu_1>t`, and `D(t)>0`.  Conversely,
if `mu_2>t`, interlacing gives

\[
 \nu_j>t\qquad(2\leq j\leq n-1).                 \tag{4.5}
\]

All factors of `D(t)=product_j(nu_j-t)` except possibly the first are then
positive.  The sign `D(t)>0` forces `nu_1>t`.  This proves (0.2), including
the two-dimensional case where (4.5) is empty.

For the centered shift,

\[
 \boxed{
 H_q\succ0
 \quad\Longleftrightarrow\quad
 \mu_2(A)>q\ \hbox{ and }\ D(q)>0.}               \tag{4.6}
\]

For the literal lower Ritz gate, the same theorem gives

\[
 \boxed{
 H_u\succ0
 \quad\Longleftrightarrow\quad
 \mu_2(A)>u\ \hbox{ and }\ D(u)>0.}               \tag{4.7}
\]

The eigenvalue count in (4.6) is essential.  A positive determinant alone
does not exclude two or any even number of negative compression directions.

## 5. The normalized cubic moment

For `r>0`, let

\[
 m_3=\langle\kappa,(A-qI)^3\kappa\rangle.         \tag{5.1}
\]

Using `(A-qI)kappa=r*w` twice gives

\[
 m_3=r^2\langle w,(A-qI)w\rangle=r^2(a-q).       \tag{5.2}
\]

Hence the self-normalized cubic statistic is exactly

\[
 \boxed{
 \chi={m_3\over r^3}={a-q\over r}
 =\tau^{-1}-\tau.}                                \tag{5.3}
\]

For every prescribed `C>0`, monotonicity of `tau^(-1)-tau` on the positive
axis gives

\[
 \boxed{
 \tau\leq C
 \quad\Longleftrightarrow\quad
 \chi\geq C^{-1}-C.}                              \tag{5.4}
\]

The natural Gevrey theorem controls the absolute second moment `r^2` at
the scale `exp(-c*lambda/L)`.  It does not control the self-normalized
third moment (5.3), the count in (4.6), or the sign of `D(q)`.  The centered
gate bypasses a separate cubic estimate because `H_q>0` already forces
`chi>0` and `tau<1`.

## 6. Universal-`G` determinant correlation

Specialize to the actual even matrix `A_p`, the actual natural prolate
anchor `kappa_p`, and the interval length `L=L_p`.  Let

\[
 (K_tf)(x)=\widetilde f(x+t)+\widetilde f(x-t),
 \qquad C_{f,g}(t)=\langle f,K_tg\rangle.          \tag{6.1}
\]

The universal Chebyshev error is

\[
 G(t)=e^t-\psi_C(e^t)-{1\over2}\log(1-e^{-2t}),
 \qquad t>0.                                      \tag{6.2}
\]

Choose an orthonormal chart `R:C^d -> kappa_p^perp` with columns
`v_1,...,v_d`, where `d=dim(kappa_p^perp)`.  The scalar part of the complete
source cancels between `A_p` and `q_p*I`.  The exact combined-source
integration by parts, applied by polarization, gives

\[
 \boxed{
 (H_{q_p})_{ij}
 =-\int_0^LG(t){d\over dt}\left[
 e^{-t/2}\{C_{v_i,v_j}(t)
       -\delta_{ij}C_{\kappa_p,\kappa_p}(t)\}\right]dt.} \tag{6.3}
\]

Both endpoint terms vanish: at `t=0`, the expression in braces is
`2*delta_ij-2*delta_ij=0`, and at `t=L` zero extension kills both
correlations.

Put

\[
 \Phi_{ij}(t)={d\over dt}\left[
 e^{-t/2}\{C_{v_i,v_j}(t)
       -\delta_{ij}C_{\kappa_p,\kappa_p}(t)\}\right]. \tag{6.4}
\]

Column multilinearity of the determinant and finite-dimensional Fubini
then give the exact representation

\[
 \boxed{
 D_p(q_p)=(-1)^d\int_{[0,L]^d}
 \left\{\prod_{j=1}^dG(t_j)\right\}
 \det[\Phi_{ij}(t_j)]_{i,j=1}^d\,
 dt_1\cdots dt_d.}                                \tag{6.5}
\]

On the natural odd halfgrid, `d=N_p=(p+3)/2`.  Thus (6.5) is a
growing-order signed correlation, not a fixed quadratic Montgomery--Vaughan
mean or a fixed exterior minor.  Fixed-degree information cannot determine
the sign in (4.6) without an additional negative-index theorem.

## 7. Prime-threshold Jacobi contrast

Let `L` vary continuously with the finite dimension fixed, and let
`L_0=log m` be a prime-power threshold.  Write `Delta partial_L` for the
right derivative minus the left derivative.  The new prime-power term in
the exact source coefficient satisfies

\[
 \Delta\partial_L\beta_n(L_0)
 =-{2\Lambda(m)\over L_0\sqrt m}\,n.              \tag{7.1}
\]

Consequently the complete even matrix has the rank-one derivative jump

\[
 \boxed{
 \Delta\partial_LA(L_0)
 =-c_m|\eta\rangle\langle\eta|,
 \qquad c_m={2\Lambda(m)\over L_0\sqrt m}>0.}     \tag{7.2}
\]

The natural anchor and an orthonormal chart `R` of its complement are
source-independent and smooth across the threshold.  Therefore

\[
 \Delta\partial_Lq=-c_m|\langle\eta,\kappa\rangle|^2, \tag{7.3}
\]

and

\[
 \boxed{
 \Delta\partial_LH_q
 =-c_m\left\{
 |R^*\eta\rangle\langle R^*\eta|
 -|\langle\eta,\kappa\rangle|^2I_K\right\}.}     \tag{7.4}
\]

Jacobi's adjugate formula, valid also when `H_q` is singular, gives

\[
\boxed{
 \Delta\partial_LD(q)
 =-c_m\left\{
 \langle R^*\eta,\operatorname {adj}(H_q)R^*\eta\rangle
 -|\langle\eta,\kappa\rangle|^2
       \operatorname {tr}\operatorname {adj}(H_q)\right\}.} \tag{7.5}
\]

At a simple gate boundary, `H_q` has one zero eigenvalue and every other
eigenvalue is positive.  If `v` spans its kernel, then

\[
 \operatorname {adj}(H_q)=\Gamma|v\rangle\langle v|,
 \qquad \Gamma>0,                                  \tag{7.6}
\]

and (7.5) becomes

\[
 \boxed{
 -c_m\Gamma\left\{
 |\langle\eta,Rv\rangle|^2
 -|\langle\eta,\kappa\rangle|^2\right\}.}        \tag{7.7}
\]

The contrast has no fixed sign.  In the positive region one equivalently
has the inverse-Christoffel jump

\[
 \Delta\partial_L\log D(q)
 =-c_m\left\{
 \langle R^*\eta,H_q^{-1}R^*\eta\rangle
 -|\langle\eta,\kappa\rangle|^2
       \operatorname {tr}H_q^{-1}\right\}.        \tag{7.8}
\]

Equations (7.5)--(7.8) identify the first local arithmetic spectral-flow
statistic.  Analytic noncollision, interlacing, and adjacency of the new
prime blocks alone do not orient it.

## 8. Arbitrary-anchor empty-good-set family

Fix `N>=2` and let

\[
 \eta=\sum_{n=-N}^NV_n,
 \qquad \|\eta\|^2=2N+1.                           \tag{8.1}
\]

Let `kappa` be any prescribed unit inversion-even anchor.  It may be the
actual natural projected prolate anchor.  For any `epsilon>0`, set

\[
 c={\varepsilon\over2N+1},
 \qquad Q=c|\eta\rangle\langle\eta|.              \tag{8.2}
\]

This is an exact inversion-symmetric source-Cauchy matrix.  In raw
coordinates take

\[
 b_n=cn,\qquad a_n=c.                              \tag{8.3}
\]

Then for `n!=m`,

\[
 Q_{nm}={b_n-b_m\over n-m}=c,                     \tag{8.4}
\]

and the diagonal is also `c`.  Moreover

\[
 \|Q\|=c\|\eta\|^2=\varepsilon.                  \tag{8.5}
\]

For the arbitrary anchor,

\[
 \theta=\left|\left\langle{\eta\over\|\eta\|},
                    \kappa\right\rangle\right|^2,
 \qquad q=\varepsilon\theta,
 \qquad r=\varepsilon\sqrt{\theta(1-\theta)}
             \leq{\varepsilon\over2}.            \tag{8.6}
\]

Choose

\[
 \varepsilon_p=\exp\left(-C{\lambda_p\over L_p}\right). \tag{8.7}
\]

The genuine natural prolate anchor retains the checkpoint-1.59 projection
error, while (8.6) has the same exponential scalar class.

In the even sector, the lowest eigenspace is

\[
 E=\eta_+^\perp,
 \qquad \dim E=N\geq2,                             \tag{8.8}
\]

so the bottom is not simple.  The canonical boundary projection also
vanishes:

\[
 \boxed{P_E\eta_+=0.}                              \tag{8.9}
\]

The centered gate fails for every anchor as well.  If `0<theta<=1`, then
`E intersect kappa^perp` contains a nonzero vector and `H_q` has quadratic
form `-q<0` there.  If `theta=0`, that intersection contains a nonzero
zero direction of `H_q`.  Hence every centered, simple, or canonical
finite-good set is empty, for every choice of anchor, despite source-Cauchy
displacement and exponential absolute quasimode data.  This is a
structural synthetic source, not the actual pole--archimedean--minus-prime
matrix.

## 9. Strict simple gate with zero eta visibility

The preceding family blocks every finite branch.  A separate family shows
why eta visibility must not be required after the simple gate has passed.
On raw modes put

\[
 Q=c|\eta\rangle\langle\eta|+\operatorname {diag}(d_n),
 \qquad
 d_n=\begin{cases}0,&|n|\leq1,\\1,&2\leq|n|\leq N,
       \end{cases}                                  \tag{9.1}
\]

with `c>0`.  It is source-Cauchy with

\[
 b_n=cn,
 \qquad a_n=c+d_n.                                 \tag{9.2}
\]

In the orthonormal even basis, put `K=N-1` and

\[
 x={\sqrt2e_0-e_1\over\sqrt3},
 \qquad h={e_0+\sqrt2e_1\over\sqrt3},
 \qquad t={1\over\sqrt K}\sum_{j=2}^Ne_j.         \tag{9.3}
\]

The vector `x` is the unique even ground with eigenvalue zero and

\[
 \langle\eta_+,x\rangle=0.                        \tag{9.4}
\]

The positive block on `span(h,t)` is

\[
 \begin{pmatrix}
 3c&c\sqrt{6K}\\
 c\sqrt{6K}&1+2cK
 \end{pmatrix},                                    \tag{9.5}
\]

whose determinant is `3c>0`.  Let `y` be a unit eigenvector for its lower
positive eigenvalue `nu`.  Define the synthetic anchor

\[
 \kappa=\sqrt{2\over3}\,x+{1\over\sqrt3}\,y.      \tag{9.6}
\]

The lower two-vector Ritz space is `span(x,y)`, and direct calculation gives

\[
 \boxed{
 q={\nu\over3},\qquad
 r={\sqrt2\nu\over3},\qquad
 u=0,\qquad {q-u\over r}={1\over\sqrt2}.}         \tag{9.7}
\]

On `kappa^perp`, the direction in `span(x,y)` has energy `2nu/3`.  The
other positive-block eigenvalue exceeds `nu`, while the orthogonal outer
directions have eigenvalue one and `0<nu<1`.  Consequently the exact
complement floors at the lower Ritz root and at the centered shift are

\[
 \lambda_{\min}(H_u)={2\nu\over3},
 \qquad \lambda_{\min}(H_q)={\nu\over3}.          \tag{9.8}
\]

In particular,

\[
 P_{\kappa^\perp}(Q_+-uI)P_{\kappa^\perp}
       \big|_{\kappa^\perp}\succ0,
 \qquad H_q\succ0.                                \tag{9.9}
\]

Nevertheless, for the ground projector `P=|x><x|`,

\[
 \boxed{P\eta_+=0,
 \qquad P\kappa=\sqrt{2\over3}\,x\ne0,
 \qquad \rho={2\over3}.}                          \tag{9.10}
\]

Thus the canonical boundary weight is zero while the eta-free simple
weight is automatic and strictly positive.  This family does not obstruct
the repaired simple branch; it distinguishes that branch from the
canonical multiple-ground branch.

## 10. Minimal actual theorem and fail-closed stopping line

For odd `p` in a dyadic block, define

\[
 {\cal C}_P=\{p:P<p\leq2P,\ p\ {\rm odd}\},
 \qquad
 {\cal G}_P^{\rm cen}=\{p\in{\cal C}_P:H_{q_p}\succ0\}. \tag{10.1}
\]

By (4.6), exact nonemptiness is the Boolean arithmetic statement

\[
 \boxed{
 \sum_{p\in{\cal C}_P}
 1_{\{\mu_{2,p}>q_p\}}1_{\{D_p(q_p)>0\}}>0.}      \tag{10.2}
\]

A stronger signed sufficient condition is

\[
 \boxed{
 \sum_{\substack{p\in{\cal C}_P\\\mu_{2,p}>q_p}}
 D_p(q_p)>0.}                                      \tag{10.3}
\]

Either assertion on cofinally many blocks would supply a centered-good odd
index.  At an index with `r_p>0`, Section 3 supplies the strict simple gate
and `tau_p<1`; at an index with `r_p=0`, Section 3 closes the projective
observable immediately.  For the remaining `r_p>0` indices, checkpoint
1.59's eta-free weighted covariance estimate is still required to select
the projective rate.

Any downstream use must reject a claimed pass if it

1. treats (10.2) or (10.3) as proved for the actual source;
2. drops the count `mu_2>t` and infers positivity from `D(t)>0` alone;
3. infers a relative gap, cubic bound, or cofactor sign from absolute
   Gevrey residual smallness;
4. restores eta visibility as a hypothesis on the strict simple branch;
5. uses the `r=0` closure without the strict centered complement `H_q>0`;
6. treats the growing-order correlation (6.5) as a fixed quadratic prime
   mean;
7. assigns a favorable sign to the threshold contrast (7.7);
8. identifies either synthetic source-Cauchy family with the actual
   arithmetic source, or its synthetic anchor with the actual prolate
   anchor except where Section 8 explicitly permits an arbitrary prescribed
   anchor;
9. claims canonical multiple-ground visibility from the eta-free simple
   normalization; or
10. claims determinant convergence, a zeta-zero theorem, RH, a converse,
    or a de Bruijn--Newman bound.

The proved content is the affine centered-gate theorem, the exact
count/cofactor characterization, the cubic identity, the universal-`G`
determinant and threshold reductions, and the two structural
counterfamilies.  Actual centered-good-set nonemptiness and the actual
eta-free covariance estimate remain open.  The formal state remains
`P0_INVALIDATED`.
