# Anchored Weil--Dirichlet form and contractive routing

## 0. Claim boundary

This is a finite, theorem-only source-Cauchy package.  It identifies the
strict anchored signed-Laplacian energy with the complete Weil source
distribution applied to an explicit family of signed correlations.  It then
gives the exact positive-square representation of that energy in terms of a
minimum-norm routing of all negative graph edges through the positive graph.

No actual-source routing inequality is proved.  In particular, nothing below
proves that the positive arithmetic graph is connected, that its collective
negative-edge routing is contractive on an unbounded schedule, or that the
inverse anchor coordinates are controlled on a widening Fourier core.  The
finite source-Cauchy counterexamples are structural fixtures, not matrices
assembled from the pinned arithmetic source.  There is no
Riemann-hypothesis conclusion.  The project state remains `P0_INVALIDATED`.

The binding finite conventions remain those of `P0_SOURCE_LOCK.json` and
`P0_NORMALIZATION_AUDIT.md`.  Thus

\[
 L=2\log\lambda,
 \qquad
 \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt,
 \qquad JV_n=V_{-n},                                      \tag{0.1}
\]

Lebesgue measure and zero extension are mandatory, and every prime power
\(1<n\leq\lambda^2\) remains included with the minus sign of the source
prime block.  All appearances of the source distribution below mean the
already-combined pole--archimedean--minus-prime distribution; its pieces are
not separately bounded.

## 1. Source correlation and the forced form

It is convenient to use the untranslated source interval `[0,L]`.  Put

\[
 U_n(t)=L^{-1/2}e^{2\pi int/L},\qquad n\in\mathbb Z,       \tag{1.1}
\]

and extend every finite-window function by zero.  For \(x\geq0\), define

\[
 \mathfrak q(v,w;x)
 =\int_{\mathbb R}
 \bigl(\overline{v(t)}w(t+x)
       +\overline{v(t+x)}w(t)\bigr)\,dt.                 \tag{1.2}
\]

This is antilinear in `v`, linear in `w`, and satisfies

\[
 \mathfrak q(v,w;0)=2\langle v,w\rangle,
 \qquad
 \mathfrak q(v,w;L)=0.                                  \tag{1.3}
\]

The second equality is an equality modulo null endpoints.  If
\(F(u)=\mathfrak q(v,w;\log u)\), source Proposition 3.2 gives

\[
 \langle v,Qw\rangle
 =\Psi^\#(F).                                            \tag{1.4}
\]

We use the harmless shorthand
\(\Psi^\#(\mathfrak q(v,w))\) for the right side.

Use the real normalized even basis

\[
 e_0=U_0,
 \qquad
 e_n={U_n+U_{-n}\over\sqrt2},\quad 1\leq n\leq N,       \tag{1.5}
\]

and write \(A=Q_+\).  Let

\[
 \kappa=\sum_{i=0}^N\kappa_i e_i,
 \qquad \kappa_i\in\mathbb R\setminus\{0\}.            \tag{1.6}
\]

For an arbitrary real gauge `mu`, define

\[
 h_i={(A\kappa)_i\over\kappa_i}-\mu,
 \qquad
 T_+=A-\operatorname {diag}(h)-\mu I
     =A-\operatorname {diag}\left({(A\kappa)_i\over\kappa_i}\right).
                                                               \tag{1.7}
\]

Thus \(T_+\kappa=0\), and `T_+` is independent of `mu`.

## 2. The exact anchored Weil test

For \(f=(f_0,\ldots,f_N)\in\mathbb C^{N+1}\), put

\[
 z=D_\kappa f,
 \qquad D_\kappa=\operatorname {diag}(\kappa_0,\ldots,\kappa_N),
                                                               \tag{2.1}
\]

and define the real vector

\[
 d_f=\sum_{i=0}^N\kappa_i|f_i|^2e_i.                 \tag{2.2}
\]

### Theorem 2.1 (anchored source-distribution identity)

Define

\[
 \boxed{
 \Omega_{\kappa,f}
 =\mathfrak q(z,z)
 -{1\over2}\{\mathfrak q(d_f,\kappa)
                   +\mathfrak q(\kappa,d_f)\}.}       \tag{2.3}
\]

Then

\[
 \boxed{
 E_{\lambda,N}(f)
 :=\langle z,T_+z\rangle
 =\Psi^\#(\Omega_{\kappa,f}).}                       \tag{2.4}
\]

Moreover,

\[
 \boxed{
 \Omega_{\kappa,f}
 =-\sum_{0\leq i<j\leq N}
   \kappa_i\kappa_j|f_i-f_j|^2\,\omega_{ij},
 \qquad
 \omega_{ij}=\mathfrak q(e_i,e_j).}                  \tag{2.5}
\]

In particular,

\[
 \boxed{\Omega_{\kappa,f}(0)=\Omega_{\kappa,f}(L)=0.} \tag{2.6}
\]

**Proof.**  Source linearity gives

\[
 \Psi^\#(\mathfrak q(z,z))=\langle z,Az\rangle,
 \qquad
 \Psi^\#(\mathfrak q(d_f,\kappa))
 =\langle d_f,A\kappa\rangle.                       \tag{2.7}
\]

The latter scalar is real, so the symmetrization in (2.3) has the same
source value.  Since

\[
 \langle d_f,A\kappa\rangle
 =\sum_i\kappa_i|f_i|^2(A\kappa)_i,
                                                               \tag{2.8}
\]

equations (1.7), (2.1), and (2.8) prove (2.4).

The basis functions are real and the correlations `omega_(ij)` are real and
symmetric.  For each pair `i<j`, its coefficient in (2.3) is

\[
 \kappa_i\kappa_j
 \{2\operatorname {Re}(\overline f_i f_j)
        -|f_i|^2-|f_j|^2\}
 =-\kappa_i\kappa_j|f_i-f_j|^2,                    \tag{2.9}
\]

which proves (2.5).  Equations (1.3) and
\(\langle d_f,\kappa\rangle=\|z\|^2\) prove (2.6).
\(\square\)

### Corollary 2.2 (complete pole--archimedean--prime normal form)

Let

\[
 \psi_C(X)=\sum_{2\leq n\leq X}\Lambda(n)
\]

be right-continuous.  Since (2.6) removes the singular origin scalar, the
source definition gives exactly

\[
\begin{aligned}
 E_{\lambda,N}(f)
 &=\int_0^L\Omega_{\kappa,f}(x)
       \bigl(e^{x/2}+e^{-x/2}\bigr)\,dx\\
 &\quad-\int_0^L
       {e^{x/2}\Omega_{\kappa,f}(x)\over e^x-e^{-x}}\,dx\\
 &\quad-\sum_{1<n\leq\lambda^2}
       {\Lambda(n)\over\sqrt n}\,
       \Omega_{\kappa,f}(\log n).                  \tag{2.10}
\end{aligned}
\]

The final prime power is still included.  If it equals \(\lambda^2\), its
value happens to vanish by (2.6); that is not permission to change the
inclusive source inventory.

Equivalently, define the single combined Chebyshev-error kernel

\[
 G(x)=e^x-\psi_C(e^x)-{1\over2}\log(1-e^{-2x}).     \tag{2.11}
\]

Then the cancellation-preserving form is

\[
 \boxed{
 E_{\lambda,N}(f)
 =-\int_0^LG(x){d\over dx}
       \left(e^{-x/2}\Omega_{\kappa,f}(x)\right)dx.} \tag{2.12}
\]

No absolute value is taken before the three source pieces have combined.

## 3. Sine realization and diagonal blindness

### Theorem 3.1 (cross-correlation sine formulas)

For \(1\leq n\leq N\),

\[
 \boxed{
 \omega_{0n}(x)
 =-{\sqrt2\over\pi n}\sin{2\pi nx\over L}.}          \tag{3.1}
\]

For distinct \(n,m\geq1\),

\[
 \boxed{
 \omega_{nm}(x)
 ={2\{m\sin(2\pi mx/L)-n\sin(2\pi nx/L)\}
    \over\pi(n^2-m^2)}.}                             \tag{3.2}
\]

If the source displacement coefficients are

\[
 b_n=-{1\over\pi}
   \left\langle\mathcal D,\sin{2\pi nx\over L}\right\rangle,
 \qquad b_0=0,                                      \tag{3.3}
\]

then

\[
 \boxed{A_{0n}={\sqrt2b_n\over n},}                 \tag{3.4}
\]

\[
 \boxed{
 A_{nm}=2{nb_n-mb_m\over n^2-m^2}
 \quad(n\ne m,\ n,m\geq1).}                       \tag{3.5}
\]

**Proof.**  For raw modes, source equation (2.8) gives

\[
 \mathfrak q(U_r,U_s;x)
 ={\sin(2\pi sx/L)-\sin(2\pi rx/L)\over\pi(r-s)}
 \quad(r\ne s).                                    \tag{3.6}
\]

Insert (1.5) and combine the four signs.  This gives (3.1)--(3.2).
Applying (3.3) gives (3.4)--(3.5). \(\square\)

Every function in (2.5) is therefore a sine polynomial.  Conversely,
`omega_(0n)` supplies each sine mode, so

\[
 \operatorname {span}\{\omega_{ij}:i<j\}
 =\operatorname {span}\left\{
      \sin{2\pi nx\over L}:1\leq n\leq N\right\}.  \tag{3.7}
\]

The linear span of the anchored family itself is the same when every
`kappa_i` is nonzero.  Indeed, for a vertex subset `S` define its
cut-distance vector by

\[
 d_S=\bigl(|\mathbf1_S(i)-\mathbf1_S(j)|^2\bigr)_{i<j},
\]

and let `e_(ij)` denote the unit vector of the edge coordinate `(i,j)`.
Taking `f=1_S`, the identity

\[
 d_{\{i\}}+d_{\{j\}}-d_{\{i,j\}}=2e_{ij}        \tag{3.8}
\]

for cut-distance vectors isolates any chosen edge by linear combinations.

Equations (2.5) and (3.4)--(3.5) show that the complete anchored form is
blind to every source diagonal `a_n`.  The cancellation is exact: changing
the diagonal of `A` changes the forced shell diagonal by the same amount and
leaves `T_+`, `Omega_(kappa,f)`, and the energy unchanged.

## 4. Weighted-Loewner graph

Put

\[
 t_0=c_0=0,
 \qquad t_n=n^2,
 \qquad c_n=nb_n\quad(n\geq1),                      \tag{4.1}
\]

and

\[
 \alpha_0=1,
 \qquad \alpha_n=\sqrt2\quad(n\geq1).              \tag{4.2}
\]

Equations (3.4)--(3.5) become the single off-diagonal identity

\[
 \boxed{
 A_{ij}=\alpha_i\alpha_j{c_i-c_j\over t_i-t_j}
 \qquad(i\ne j).}                                  \tag{4.3}
\]

With

\[
 p_i=\alpha_i\kappa_i,                              \tag{4.4}
\]

the anchored edge weights are

\[
 \boxed{
 w_{ij}=-A_{ij}\kappa_i\kappa_j
       =-p_ip_j{c_i-c_j\over t_i-t_j}.}             \tag{4.5}
\]

Thus the missing arithmetic assertion may be stated entirely as a
weighted-Loewner graph assertion for the already-combined displacement
sequence `b_n`.  Formula (4.5) is not a Loewner-positivity theorem: both the
anchor factors and the divided differences can change sign.

## 5. Why this is not a dense Weil-square criterion

Let

\[
 \mathcal C_{\kappa,N}
 =\operatorname {cone}\{\Omega_{\kappa,f}:
                         f\in\mathbb C^{N+1}\}.       \tag{5.1}
\]

This is the image of the Euclidean squared-distance cone under the linear
map in (2.5).  Positivity of `Psi#` on this cone is exactly positivity of the
anchored graph Laplacian.  It is not positivity on a subcone of ordinary
Weil squares.

Indeed, every nonzero ordinary square satisfies

\[
 \mathfrak q(g,g;0)=2\|g\|^2>0,                     \tag{5.2}
\]

whereas every anchored test satisfies (2.6).  Consequently a pointwise
identity

\[
 \Omega_{\kappa,f}=\sum_r a_r\mathfrak q(g_r,g_r),
 \qquad a_r\geq0,                                  \tag{5.3}
\]

forces every `g_r=0` and hence `Omega_(kappa,f)=0`.  Origin evaluation is
continuous in the smooth source-test topology, so the anchored cone cannot
be dense in the nonzero Weil-square cone in that topology.

Polarization displays the unavoidable negative square explicitly:

\[
 \Omega_{\kappa,f}
 =\mathfrak q(z,z)
 -{1\over4}\mathfrak q(d_f+\kappa,d_f+\kappa)
 +{1\over4}\mathfrak q(d_f-\kappa,d_f-\kappa).       \tag{5.4}
\]

Thus ordinary Weil positivity does not sign (2.4).

### Proposition 5.1 (exact source-Cauchy incomparability)

There are real inversion-symmetric source-Cauchy matrices for which the full
finite matrix is positive definite but the anchored form is negative, and
others for which the full finite matrix is negative definite but the strict
anchored gate holds.

**Proof.**  Take `N=1`.  For \(\varepsilon\in\{+1,-1\}\), choose raw data

\[
 b_1={\varepsilon\over\sqrt2},
 \qquad a_0=2\varepsilon,
 \qquad a_1=\varepsilon\left(2-{1\over\sqrt2}\right). \tag{5.5}
\]

The normalized parity blocks are

\[
 A_\varepsilon
 =\varepsilon\begin{pmatrix}2&1\\1&2\end{pmatrix},
 \qquad
 (Q_-)_\varepsilon=\varepsilon(2-\sqrt2).           \tag{5.6}
\]

Hence the full raw matrix has the sign `epsilon`.  With
\(\kappa=2^{-1/2}(1,1)\), the forced form is

\[
 T_{+,\varepsilon}
 =\varepsilon\begin{pmatrix}-1&1\\1&-1\end{pmatrix}. \tag{5.7}
\]

For `epsilon=+1`, the full matrix is positive while the anchored quotient is
negative.  For `epsilon=-1`, the full matrix is negative while (5.7) is
positive semidefinite with kernel `C kappa`. \(\square\)

These are structural source-Cauchy fixtures.  They make no assertion about
the pinned arithmetic matrices or about an asymptotic schedule.

## 6. Strict graph gate and connectedness

Let `v=N+1` be the number of vertices and orient every nonzero edge
arbitrarily.  Split the weights in (4.5) into positive and negative edges:

\[
 L_w=L_+-L_-,
 \qquad
 L_+=C_+W_+C_+^*,
 \qquad
 L_-=C_-W_-C_-^*.                                \tag{6.1}
\]

Here

\[
 C_+\in\mathbb R^{v\times p},\quad
 W_+\in\mathbb R^{p\times p},\qquad
 C_-\in\mathbb R^{v\times m},\quad
 W_-\in\mathbb R^{m\times m},                    \tag{6.2}
\]

where `p` and `m` are the numbers of positive and negative edges and the
`W` matrices contain their positive magnitudes.  The anchored identity is

\[
 D_\kappa T_+D_\kappa=L_w,
 \qquad
 E_{\lambda,N}(f)=f^*L_wf.                         \tag{6.3}
\]

### Lemma 6.1 (strictness forces positive connectivity)

If

\[
 L_w\succeq0,
 \qquad \ker L_w=\mathbb C\mathbf1,               \tag{6.4}
\]

then the positive-edge graph is connected.

**Proof.**  Let `x in ker L_+`.  Then

\[
 0\leq x^*L_wx=-x^*L_-x\leq0.                     \tag{6.5}
\]

Thus `x in ker L_-` and hence `x in ker L_w=C 1`.  Therefore
`ker L_+=C 1`, which is exactly connectedness of the positive-edge graph.
\(\square\)

This also shows the sharp disconnected dichotomy.  A negative edge between
positive components produces a negative trial direction; if no negative
edge joins those components, their relative constants give an additional
kernel direction.

## 7. Minimum-norm routing and the exact square

Assume now that the positive graph is connected and put

\[
 B_+=C_+W_+^{1/2}\in\mathbb R^{v\times p},
 \qquad
 B_-=C_-W_-^{1/2}\in\mathbb R^{v\times m}.          \tag{7.1}
\]

Both ranges lie in `1^perp`, and connectedness gives
`Ran(B_+)=1^perp`.  Hence every negative edge can be routed through positive
edges.

### Theorem 7.1 (contractive-routing equivalence)

The unique minimum-Euclidean-norm routing matrix is

\[
 \boxed{
 S=B_+^\dagger B_-
  =W_+^{1/2}C_+^*L_+^\dagger C_-W_-^{1/2}
  \in\mathbb R^{p\times m}.}                       \tag{7.2}
\]

It satisfies

\[
 \boxed{B_-=B_+S}                                  \tag{7.3}
\]

and

\[
 \boxed{
 S^*S
 =W_-^{1/2}C_-^*L_+^\dagger C_-W_-^{1/2}
 =:\mathcal R_-\in\mathbb R^{m\times m}.}          \tag{7.4}
\]

For every \(f\in\mathbb C^v\), with
\(g=B_+^*f\in\mathbb C^p\),

\[
 \boxed{
 E_{\lambda,N}(f)
 =\|g\|^2-\|S^*g\|^2
 =g^*(I_p-SS^*)g.}                                  \tag{7.5}
\]

Consequently

\[
 \boxed{
 L_w\succeq0,\quad\ker L_w=\mathbb C\mathbf1
 \quad\Longleftrightarrow\quad
 G_+\text{ is connected and }\|S\|_{\rm op}<1}     \tag{7.6}
\]

and equivalently

\[
 \boxed{\lambda_{\max}(\mathcal R_-)<1.}           \tag{7.7}
\]

When `m=0`, there are no negative edges: `S` has zero columns and
`\mathcal R_-` is the `0 by 0` matrix.  In (7.7) we use the explicit
convention `lambda_max(R_-)=0`, so the no-negative-edge branch is
included rather than left to an undefined empty spectrum.

Under these conditions the promised positive-square representation is

\[
 \boxed{
 E_{\lambda,N}(f)
 =\left\|(I_p-SS^*)^{1/2}B_+^*f\right\|^2.}         \tag{7.8}
\]

**Proof.**  Connectedness gives (7.3), and the Moore--Penrose formula for
`B_+^dagger` gives (7.2).  Since
\(B_+B_+^*=L_+\), multiplication proves (7.4).  Taking adjoints in
(7.3) gives `B_-^*f=S^*B_+^*f`, proving (7.5).

If `||S||<1`, (7.5) is strictly positive whenever `B_+^*f` is nonzero;
connectedness makes its kernel exactly the constants.  Conversely, restrict
to `1^perp` and conjugate by the positive square root of `L_+`.  The result is

\[
 I-UU^*,
 \qquad U=L_+^{-1/2}B_-.                          \tag{7.9}
\]

Its nonzero squared singular values are the eigenvalues of
\(U^*U=\mathcal R_-=S^*S\).  Strict positivity is therefore equivalent to
(7.7), hence to `||S||<1`. \(\square\)

The routing is not an extra sufficient construction placed above the exact
gate: it is the minimum-norm routing, and (7.6) is necessary and sufficient.
Thus an actual-source weighted-Loewner contractive-routing lemma would be
precisely the missing arithmetic input, not a consequence proved here.

## 8. Collective loading cannot be checked edge by edge

Individual one-negative-edge tests do not control (7.7).  Consider the
positive unit-weight star on vertices `0,1,2,3`, with center `0`, and add
negative edges `(1,2)` and `(1,3)`, each of magnitude `2/5`.  Each leaf pair
has positive-network effective resistance `2`, so each separate load is

\[
 {2\over5}\,R_{\rm eff}^{(+)}={4\over5}<1.          \tag{8.1}
\]

The two routed chords share the positive edge `(0,1)`.  Their collective
resistance matrix is

\[
 \mathcal R_-
 =\begin{pmatrix}4/5&2/5\\2/5&4/5\end{pmatrix},    \tag{8.2}
\]

whose eigenvalues are `6/5` and `2/5`.  Hence the combined form fails.  The
trial vector

\[
 f=(0,2,-1,-1)                                      \tag{8.3}
\]

has positive-star energy `6`, negative-edge load `36/5`, and total energy
`-6/5`.

Thus every per-edge inequality can be strict while the collective operator
norm exceeds one.  A proof must control the matrix in (7.4), or an equivalent
operator-norm routing, rather than only its diagonal entries.

## 9. Inverse-coordinate obstruction to a Fourier-core passage

Because every `kappa_i` is nonzero, `z=D_kappa f` ranges over the full finite
even space.  This does not make the anchored tests ordinary Weil squares:

\[
 E_{\lambda,N}(f)
 =\langle z,Az\rangle-\langle z,V_\kappa z\rangle,
 \qquad
 V_\kappa=\operatorname {diag}
       \left({(A\kappa)_i\over\kappa_i}\right).      \tag{9.1}
\]

For a widening Fourier-core vector `z`, Cauchy--Schwarz only gives

\[
 \boxed{
 |\langle z,V_\kappa z\rangle|
 \leq\|A\kappa\|_2
 \left(\sum_i{|z_i|^4\over|\kappa_i|^2}\right)^{1/2}.} \tag{9.2}
\]

Small residual norm alone is therefore insufficient.  For example, let

\[
 \kappa^{(r)}=(1,r^{-2}),
 \qquad A_r=\operatorname {diag}(0,r),
 \qquad A_r\kappa^{(r)}=(0,r^{-1}).                 \tag{9.3}
\]

Then \(\|A_r\kappa^{(r)}\|_2\to0\), but the second forced ratio equals `r`
and diverges; on `z=(0,1)` the correction in (9.1) equals `r`.

A valid density passage would need the new test-specific statement

\[
 \sum_i{(A\kappa)_i\over\kappa_i}|z_i|^2\longrightarrow0       \tag{9.4}
\]

for every projected compact-core vector under consideration, or at least a
nonnegative lower limit in the direction required by the argument.  No such
inverse-coordinate estimate is proved here.

## 10. Exact frontier

The finite result is complete:

1. the anchored energy is the complete source distribution applied to the
   explicit zero-origin test (2.3);
2. the family is a weighted sine/Euclidean-distance cone and not a dense
   Weil-square cone;
3. finite Weil positivity and anchored positivity are structurally
   incomparable;
4. the strict gate itself forces positive-edge connectivity; and
5. the gate is exactly equivalent to the minimum-norm collective routing
   contraction (7.6)--(7.7).

What remains is wholly arithmetic and asymptotic: establish that contraction
for the actual combined source weights on a suitable schedule, or establish
a different gate.  This note supplies neither assertion and makes no RH
claim.
