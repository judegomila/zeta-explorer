# Zero-height curvature and quantitative coefficient reserve

## 0. Claim boundary and outcome

This note isolates a stronger but substantially simpler route to the first
paired-trace gate.  Under the exact finite simple-even and odd-positive
hypotheses, the half-paired quotient trace at physical height zero is

\[
 Z_{\lambda,N}^{(0)}
 =\left({L\over2\pi}\right)^2{p_1\over p_0},
 \qquad L=2\log\lambda,                              \tag{0.1}
\]

where `p_0,p_1` are only the first two coefficients of the real-rooted
ground polynomial from
`notes/EVEN_GROUND_COEFFICIENT_CONE_AUDIT.md`.  The same scalar is the
origin quadratic logarithmic coefficient of the boundary-normalized finite
ground transform after subtracting one explicit positive exterior-lattice
tail.

There are six exact conclusions.

1. The zero-height half-paired trace has equivalent coefficient, generalized
   pencil, cofactor, ground-coordinate, odd-resolvent, and transform-curvature
   formulas.
2. A uniform bound for this scalar implies every fixed positive-height first
   trace bound, a quantitative two-height determinant floor, and bounds for
   all positive resolvent moments.  Together with `N/L^2` bounded away from
   zero, it also implies local boundedness of the origin-normalized
   characteristic products.
3. In the exact coefficient cone, the quantitative target is simply
   `p_1/p_0=O(L^(-2))`.  Positivity of all coefficients supplies the sign but
   not this scale.
4. If the boundary-normalized finite ground polynomial is pointwise
   nonnegative, the target is exactly a centered second-moment tightness
   bound, up to the explicit exterior tail.
5. Relative to the projected source-normalized prolate anchor, the target is
   an origin projective-curvature functional.  Two complete-source
   inverse-energy products give a cancellation-preserving sufficient
   criterion.
6. Exact rank-one Hellmann--Feynman and mixed-cofactor formulas reconstruct
   the positive-height ratio as a ground-projector leverage ratio, but do not
   bound it.  The evaluation directions are
   noncollinear, so ordinary rank-one Loewner comparison cannot supply the
   missing inequality.

The zero-height condition is stronger than the fixed positive-height
normal-family gate, but it is compatible with the desired limiting
characteristic function and uses only the integral and centered second
moment of the actual finite ground line.  No current source estimate proves
the required `O(L^(-2))` arithmetic cancellation, either shifted sector sign,
equation (5.2) of `DIRECT_RH_ATTACK.md`, or locally uniform determinant
convergence.  On a schedule with `N/L^2` bounded away from zero, a bounded
first trace gives local boundedness, not identification of the limit.  The
formal project state remains
`P0_INVALIDATED`.

The binding finite source is Connes--Consani--Moscovici, *Zeta Spectral
Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The source inputs are Lemma 5.1 (5.2), Lemma 5.2 (5.3), Lemma 5.4
(5.5), equation (5.25), and Theorem 5.10.  The complete finite matrix retains
the pole, corrected archimedean, and **minus** prime blocks, with every prime
power `1<k<=lambda^2` included.  No zero table or global Weil positivity is
used.

## 1. Exact finite setup and domain

Fix `lambda>1` and an integer `N>=1`.  Put

\[
 L=2\log\lambda,
\]

and use the source modes `V_n`, `-N<=n<=N`, the inversion
`JV_n=V_(-n)`, and the integer mode operator `DV_n=nV_n`.  The transform is

\[
 \widehat f(z)=\int_{-L/2}^{L/2}f(y)e^{-izy}\,dy.     \tag{1.1}
\]

Assume first that the complete source matrix `Q` has a simple
inversion-even full ground `x`, with eigenvalue `epsilon`, and

\[
 c=\langle\eta,x\rangle\ne0,
 \qquad
 \xi_0={x_0\over c}>0.                              \tag{1.2}
\]

Normalize its line by `c`:

\[
 {x\over c}=\sum_{n=-N}^{N}\xi_nV_n,
 \qquad \xi_{-n}=\xi_n,
 \qquad \xi_0+2\sum_{n=1}^{N}\xi_n=1.              \tag{1.3}
\]

Put

\[
 T=Q-\epsilon I=T_+\oplus T_-,
 \qquad T_-\succ0,                                  \tag{1.4}
\]

and let `C=D|_(H_-):H_- -> H_+`.  The positive parity pencil is

\[
 G=T_-^{-1/2}C^*T_+C T_-^{-1/2}.                    \tag{1.5}
\]

Condition (1.2) excludes a zero quotient pair.  Equivalently, all eigenvalues
`s_k^2`, `1<=k<=N`, of `G` are strictly positive.  Define their physical
scales

\[
 \rho_k={2\pi s_k\over L}.                           \tag{1.6}
\]

The same domain can instead be reached from the simple lowest even-
compression ground, the two nonvanishing conditions `c!=0`, `x_0!=0`, and
the coefficient-cone inequalities `p_j>0` for every `j`.  Those hypotheses
prove the odd sign; they are not assumed consequences of finite numerics.

The scale-invariant finite ground transform is

\[
 M_N(\sigma)={\widehat x(i\sigma)\over c}.           \tag{1.7}
\]

It is an even analytic function of `sigma`, and the source formula is

\[
 M_N(\sigma)
 ={2\sinh(\sigma L/2)\over\sigma\sqrt L}
 {\prod_{k=1}^{N}(s_k^2+\alpha^2)
  \over\prod_{n=1}^{N}(n^2+\alpha^2)},
 \qquad \alpha={\sigma L\over2\pi}.                \tag{1.8}
\]

At the origin,

\[
 M_N(0)=\sqrt L\,\xi_0>0.                          \tag{1.9}
\]

## 2. The zero-height trace identity

Let

\[
 P_x(s)=\det(X+sI)=\prod_{k=1}^{N}(s_k^2+s)
       =\sum_{j=0}^{N}p_js^j,                       \tag{2.1}
\]

where `X=D_-^2-|u><d|` is the exact even-ground squared-mode pencil.

### Theorem 2.1 (six equivalent zero-height formulas)

Under (1.2)--(1.5), the physical half-paired zero-height trace

\[
 Z_{\lambda,N}^{(0)}
 :=\sum_{k=1}^{N}{1\over\rho_k^2}                   \tag{2.2}
\]

obeys

\[
 \boxed{
 Z_{\lambda,N}^{(0)}
 =\left({L\over2\pi}\right)^2{p_1\over p_0}.}      \tag{2.3}
\]

The full trace over both signs `+/-rho_k` is twice (2.2); every formula in
this note uses the repository's half-paired convention.

The coefficient ratio is

\[
 \boxed{
 {p_1\over p_0}
 =\sum_{k=1}^{N}{1\over s_k^2}
 =\sum_{n=1}^{N}{1\over n^2}
  +{2\over\xi_0}\sum_{n=1}^{N}{\xi_n\over n^2}.}   \tag{2.4}
\]

Let

\[
 \mathfrak K=C^*T_+C.                               \tag{2.5}
\]

Then

\[
 \boxed{
 {p_1\over p_0}
 =\operatorname {Tr}(\mathfrak K^{-1}T_-)
 =\left.{d\over ds}\log\det(\mathfrak K+sT_-)
   \right|_{s=0}.}                                  \tag{2.6}
\]

Equivalently,

\[
 \boxed{
 p_0={\det\mathfrak K\over\det T_-},
 \qquad
 p_1={\operatorname {Tr}(\operatorname {adj}(\mathfrak K)T_-)
       \over\det T_-}.}                            \tag{2.7}
\]

Finally, with the derivative taken in the real variable `sigma` in (1.7),

\[
 \boxed{
 Z_{\lambda,N}^{(0)}
 ={M_N''(0)\over2M_N(0)}
 -\left({L\over2\pi}\right)^2
   \sum_{n>N}{1\over n^2}.}                       \tag{2.8}
\]

The exterior term is positive and satisfies

\[
 0<\left({L\over2\pi}\right)^2\sum_{n>N}{1\over n^2}
 \leq {L^2\over4\pi^2N}.                          \tag{2.9}
\]

**Proof.**  Since `p_0=product_k s_k^2`, differentiating (2.1) at zero
gives

\[
 {p_1\over p_0}=\sum_k{s_k^{-2}},
\]

which proves (2.3).  The coefficient formulas from the 0.47 coefficient
audit give

\[
 p_0=(N!)^2\xi_0,
\]

\[
 p_1=(N!)^2\left(
 \xi_0\sum_{n=1}^{N}{1\over n^2}
 +2\sum_{n=1}^{N}{\xi_n\over n^2}\right),         \tag{2.10}
\]

proving (2.4).

The determinant identity

\[
 \det(\mathfrak K+sT_-)=\det(T_-)P_x(s)             \tag{2.11}
\]

proves (2.6)--(2.7).  For (2.8), divide (1.8) by its nonzero value at zero
and use the canonical product for `sinh`:

\[
 {M_N(\sigma)\over M_N(0)}
 =\prod_{k=1}^{N}\left(1+{\sigma^2\over\rho_k^2}\right)
  \prod_{n>N}\left(1+{\sigma^2\over(2\pi n/L)^2}\right). \tag{2.12}
\]

The coefficient of `sigma^2` in the logarithm is the right side of (2.8)
before subtraction.  The integral bound on the reciprocal-square tail proves
(2.9).  \(\square\)

The tail in (2.8) must not be dropped at finite `N`.  It is `o(1)` on any
schedule with `N/L^2 -> infinity`.

### 2.1 Principal even block

There is a source-coordinate form which uses no quotient eigenvector or
cached inverse.  In the basis
`e_0^+ direct-sum span(e_1^+,...,e_N^+)`, write

\[
 T_+=\begin{bmatrix}h_{00}&y^*\\y&H\end{bmatrix},
 \qquad D_o=\operatorname {diag}(1,2,\ldots,N).     \tag{2.13}
\]

Because `T_+` is positive semidefinite with kernel `C*x` and `x_0!=0`, its
principal block `H` is positive definite.  Moreover

\[
 \mathfrak K=D_oHD_o,                               \tag{2.14}
\]

so (2.6) becomes

\[
 \boxed{
 {p_1\over p_0}
 =\operatorname {Tr}
  (D_o^{-1}H^{-1}D_o^{-1}T_-).}                    \tag{2.15}
\]

This is a positive trace under the declared odd sign.  Positivity does not
give its required `O(L^(-2))` size.

### 2.2 Exact odd-resolvent form

In the normalized odd basis put

\[
 g_0=\left({\sqrt2\over n}\right)_{n=1}^{N},
 \qquad
 h_0=\left({\sqrt2\over n^3}\right)_{n=1}^{N}.     \tag{2.16}
\]

The exact source response is

\[
 A(a)=1+\langle g_a,T_-^{-1}\beta\rangle,
 \qquad
 (g_a)_n={\sqrt2\,n\over n^2+a^2}.                 \tag{2.17}
\]

Thus `A(0)=xi_0` and differentiation in `s=a^2` gives

\[
 \boxed{
 {p_1\over p_0}
 =\sum_{n=1}^{N}{1\over n^2}
 -{\langle h_0,T_-^{-1}\beta\rangle
   \over1+\langle g_0,T_-^{-1}\beta\rangle}.}     \tag{2.18}
\]

The exact arithmetic zero-height target is therefore the relative
cancellation

\[
 {\langle h_0,T_-^{-1}\beta\rangle
  \over1+\langle g_0,T_-^{-1}\beta\rangle}
 =\sum_{n=1}^{N}{1\over n^2}+O(L^{-2}).            \tag{2.19}
\]

Neither odd positivity nor an ambient inverse norm proves (2.19).

## 3. Ground direction and centered second moment

The dangerous boundary normalization cancels completely from (2.4).  If

\[
 x=x_0e_0^++\sum_{n=1}^{N}x_n^+e_n^+              \tag{3.1}
\]

is any nonzero representative of the ground line, then

\[
 \boxed{
 {p_1\over p_0}={\langle z_N,x\rangle\over x_0},
 \qquad
 z_N=\left(\sum_{n=1}^{N}{1\over n^2}\right)e_0^+
     +\sqrt2\sum_{n=1}^{N}{e_n^+\over n^2}.}       \tag{3.2}
\]

Also

\[
 \|z_N\|^2
 =\left(\sum_{n=1}^{N}{1\over n^2}\right)^2
  +2\sum_{n=1}^{N}{1\over n^4}
 \leq {\pi^4\over20}.                              \tag{3.3}
\]

Hence an ordinary zero-mode reserve gives only

\[
 \left|{p_1\over p_0}\right|
 \leq{\pi^2\over\sqrt{20}}{\|x\|\over|x_0|}.      \tag{3.4}
\]

The physical target needs the much sharper cancellation
`<z_N,x>/x_0=O(L^(-2))`; qualitative nonvanishing of `x_0` is not enough.

There is an exact spatial interpretation.  Put

\[
 \theta={2\pi(y+L/2)\over L},
 \qquad
 F_N(\theta)=\xi_0+2\sum_{n=1}^{N}\xi_n\cos(n\theta). \tag{3.5}
\]

The boundary sum is `F_N(0)=1` and the mean is `xi_0`.  Define

\[
 \mathcal K_N(\theta)
 =\sum_{n=1}^{N}{1\over n^2}
  +2\sum_{n=1}^{N}{\cos(n\theta)\over n^2}.        \tag{3.6}
\]

Then

\[
 {p_1\over p_0}
 ={1\over2\pi\xi_0}\int_0^{2\pi}
       F_N(\theta)\mathcal K_N(\theta)\,d\theta.  \tag{3.7}
\]

The exact infinite Fourier series is

\[
 \sum_{n=1}^{\infty}{1\over n^2}
 +2\sum_{n=1}^{\infty}{\cos(n\theta)\over n^2}
 ={(\theta-\pi)^2\over2},
 \qquad0\leq\theta\leq2\pi.                     \tag{3.8}
\]

Since `F_N` has degree `N`, its pairing with every omitted cosine vanishes.
Equations (3.7)--(3.8) therefore reproduce exactly

\[
 {M_N''(0)\over2M_N(0)}
 ={1\over2}
 {\displaystyle\int_{-L/2}^{L/2}y^2{x(y)\over c}\,dy
  \over
  \displaystyle\int_{-L/2}^{L/2}{x(y)\over c}\,dy}
 =Z_{\lambda,N}^{(0)}
  +\left({L\over2\pi}\right)^2\sum_{n>N}{1\over n^2}. \tag{3.9}
\]

If `F_N>=0` pointwise, then

\[
 d\mu_N(\theta)={F_N(\theta)\over2\pi\xi_0}\,d\theta \tag{3.10}
\]

is a probability measure and (3.9) says

\[
 y={L(\theta-\pi)\over2\pi}
\]

under this probability law, and

\[
 \boxed{
 Z_{\lambda,N}^{(0)}
 ={1\over2}\mathbb E_{\mu_N}[y^2]
 -\left({L\over2\pi}\right)^2\sum_{n>N}{1\over n^2}.} \tag{3.11}
\]

Thus, under the stronger pointwise-positive-ground property, (3.11) is the
exact relation between the new target and centered second-moment tightness.
On schedules with `N/L^2->infinity`, the exterior term is `o(1)` and the two
bounds are equivalent.  With no lower control of `N/L^2`, bounded `Z^(0)`
alone does not bound the second moment.  Pointwise positivity alone gives
only the trivial `O(L^2)` support bound and does not prove tightness.

## 4. Consequences of a bounded zero-height trace

### Theorem 4.1 (fixed-height and two-height gates)

For every `sigma>=0`,

\[
 S^{\rm q}_{1;\lambda,N}(\sigma)
 =\sum_{k=1}^{N}{1\over\rho_k^2+\sigma^2}
 \leq Z_{\lambda,N}^{(0)}.                          \tag{4.1}
\]

For fixed `0<=tau<sigma`, the quotient determinant ratio satisfies

\[
 \boxed{
 R^{\rm q}_{\lambda,N}(\tau,\sigma)
 \geq\exp\left[-(\sigma^2-\tau^2)
                    Z_{\lambda,N}^{(0)}\right].}    \tag{4.2}
\]

For every integer `m>=1`,

\[
 \boxed{
 S^{\rm q}_{m;\lambda,N}(\sigma)
 \leq\left(Z_{\lambda,N}^{(0)}\right)^m.}          \tag{4.3}
\]

**Proof.**  Equation (4.1) is termwise.  Also

\[
 -\log R^{\rm q}(\tau,\sigma)
 =\sum_k\log\left(1+{\sigma^2-\tau^2
                       \over\rho_k^2+\tau^2}\right)
 \leq(\sigma^2-\tau^2)Z^{(0)},                    \tag{4.4}
\]

which proves (4.2).  Finally,

\[
 \sum_k(\rho_k^2+\sigma^2)^{-m}
 \leq\sum_k\rho_k^{-2m}
 \leq\left(\sum_k\rho_k^{-2}\right)^m,           \tag{4.5}
\]

proving (4.3).  \(\square\)

These are bounds, not moment-limit identifications.  They do not exclude a
finite number of low roots, identify a limiting zero set, or prove
characteristic convergence.

### Theorem 4.2 (origin-normalized local boundedness)

Define

\[
 \nu_n={2\pi n\over L},
 \qquad
 \mathcal F_{\lambda,N}(z)
 ={\widehat x(z)\over\widehat x(0)}.               \tag{4.6}
\]

Then

\[
 \boxed{
 \mathcal F_{\lambda,N}(z)
 =\prod_{k=1}^{N}\left(1-{z^2\over\rho_k^2}\right)
  \prod_{n>N}\left(1-{z^2\over\nu_n^2}\right).}  \tag{4.7}
\]

For every `R>0`,

\[
 \sup_{|z|\leq R}|\mathcal F_{\lambda,N}(z)|
 \leq\exp\left{R^2\left[
 Z_{\lambda,N}^{(0)}
 +\left({L\over2\pi}\right)^2\sum_{n>N}{1\over n^2}
 \right]\right\}.                                  \tag{4.8}
\]

Consequently, on any schedule with bounded `Z^(0)` and `N/L^2` bounded away
from zero, the origin-normalized ground transforms form a locally bounded
family on the whole complex plane.  If `N/L^2->infinity`, the exterior term
in (4.8) tends to zero.

**Proof.**  Analytic continuation of (2.12) gives (4.7).  The elementary
bound `|1-z^2/a^2|<=exp(|z|^2/a^2)` gives (4.8).  \(\square\)

Local boundedness only gives subsequential compactness.  It does not identify
any subsequential limit with `Xi`; pointwise transform convergence on a
uniqueness set or the derivative/moment identifications remain independent
obligations.  Real-axis eigenvalue agreement cannot replace them.

The schedule condition is necessary for this implication.  At `N=1`, take
the exact coefficient family

\[
 \xi_0=L^2,
 \qquad \xi_1={1-L^2\over2},
 \qquad P_x(s)=s+L^2.                               \tag{4.9}
\]

It lies in the finite coefficient cone and has
`Z^(0)=1/(4*pi^2)`, while the exterior term in (4.8) grows quadratically in
`L`.  As in the `N=1` construction in Section 5, this is compatible with an
exact Cauchy structural matrix and a positive odd block.  Moreover, for
`L>=1`,

\[
 F_1(\theta)=L^2+(1-L^2)\cos\theta\geq1,           \tag{4.10}
\]

so it is also a pointwise-positive-ground family.  It is not an arithmetic
source family.

This is genuine failure of local boundedness, not merely failure of the
upper bound (4.8).  Here `s_1^2=L^2`, hence `rho_1=2*pi`, and for every fixed
`R>0`, (4.7) gives

\[
 \mathcal F_{\lambda,1}(iR)
 =\left(1+{R^2\over4\pi^2}\right)
   \prod_{n>1}\left(1+{R^2L^2\over4\pi^2n^2}\right)
 \geq 1+{R^2L^2\over16\pi^2}\longrightarrow\infty. \tag{4.11}
\]

The inequality retains only the `n=2` exterior factor and drops the first
factor, which is at least one.

## 5. Quantitative coefficient cone

Under the coefficient-cone hypotheses, every `p_j` is positive.  Put

\[
 y_k={1\over s_k^2}>0.                                \tag{5.1}
\]

Then

\[
 {p_j\over p_0}=e_j(y_1,\ldots,y_N),
 \qquad
 {p_1\over p_0}=\sum_ky_k.                          \tag{5.2}
\]

The elementary symmetric bound gives

\[
 \boxed{
 0<{p_j\over p_0}
 \leq{1\over j!}\left({p_1\over p_0}\right)^j.}   \tag{5.3}
\]

Thus the finite quantitative cone slice

\[
 \boxed{
 p_j>0\ (0\leq j\leq N),
 \qquad
 0<{p_1\over p_0}\leq {C\over L^2}}               \tag{5.4}
\]

simultaneously proves the odd sign and every bound in Theorem 4.1.  It proves
Theorem 4.2 only together with the stated lower control of `N/L^2`.  Formula
(5.3) propagates the first-coefficient reserve to every normalized
coefficient, but it does not identify their limits.

Cone membership alone has no quantitative content.  For `N=1`, boundary
normalization gives

\[
 P_x(s)=s+\xi_0.                                    \tag{5.5}
\]

The complete coefficient cone is merely `xi_0>0`, while

\[
 {p_1\over p_0}={1\over\xi_0}                       \tag{5.6}
\]

can be arbitrarily large.  This example is compatible with an exact
two-dimensional even Cauchy block and a positive odd block: choose any
simple even ground direction with `x_0/c=xi_0>0`, reconstruct
`b_1=(Q_+)_(0,1)/sqrt(2)`, and complete the raw matrix by the source Cauchy
formula.  It is a structural finite model, not an arithmetic source matrix.

### 5.1 Eigenvector-free coefficient orientation

The coefficient inequalities can be reconstructed from the singular even
matrix without trusting a stored ground vector.  For `0<=r<=N`, define

\[
 g_r=e_r(E_N)e_0^+
    +\sqrt2\sum_{n=1}^{N}
       e_r(E_N\setminus\{n^2\})e_n^+,
 \qquad E_N=\{1^2,\ldots,N^2\}.                    \tag{5.7}
\]

Let `T_+=Q_+-epsilon*I`, where `epsilon` is the simple lowest even
eigenvalue.  Since `T_+` is positive semidefinite with a one-dimensional
kernel,

\[
 \operatorname {adj}(T_+)=\Delta_e
 {|x\rangle\langle x|\over\|x\|^2},
 \qquad \Delta_e>0                                  \tag{5.8}
\]

for any nonzero real ground representative `x`.  The homogeneous coefficient
formula gives

\[
 \boxed{
 p_{N-r}
 ={\langle g_r,\operatorname {adj}(T_+)\eta\rangle
   \over
   \langle\eta,\operatorname {adj}(T_+)\eta\rangle}.} \tag{5.9}
\]

The denominator is
`Delta_e*|<eta,x>|^2/||x||^2>0`.  Therefore coefficient-cone membership is
exactly the finite family of source-entry orientation inequalities

\[
 \langle g_r,\operatorname {adj}(T_+)\eta\rangle>0
 \qquad(0\leq r\leq N).                            \tag{5.10}
\]

Equivalently,

\[
 \det\begin{bmatrix}T_+&\eta\\g_r^*&0\end{bmatrix}<0
 \qquad(0\leq r\leq N),                            \tag{5.11}
\]

because the bordered determinant is the negative mixed cofactor.  Positivity
of `adj(T_+)` does not sign a mixed pairing of two different vectors, so
(5.9) is an exact reconstruction rather than an automatic cone theorem.

### 5.2 Cancellation-preserving upper edge and shifted reserve

Inside the coefficient cone, the positive eigenvalues of `X` are
`s_1^2,...,s_N^2`.  Hence

\[
 \boxed{
 \lambda_{\max}(X)\leq\operatorname {Tr}X=p_{N-1}
 =\sum_{n=1}^{N}n^2-2\sum_{n=1}^{N}n^2\xi_n.}      \tag{5.12}
\]

This is an alternative to the absolute-coefficient bound `N^2+M_2` in the
0.47 shifted-reserve note.  It preserves the signed coefficient cancellation;
it is not uniformly smaller without an arithmetic estimate for `p_(N-1)`.

Let `g_e` be the gap from `epsilon` to the second even eigenvalue.  The exact
positive-symmetrizer argument gives, for any nonzero representative `x`,

\[
 \boxed{
 \lambda_{\min}(Q_- -\epsilon I)
 \geq {g_e|x_0|^2\over\|x\|^2p_{N-1}}.}           \tag{5.13}
\]

For a Ritz upper bound `U`, put
`g_+=lambda_min(A)-U>0` and retain the exact Schur surplus `chi_U` from the
0.47 note.  For a unit representative, the sufficient shifted sign becomes

\[
 \boxed{
 \chi_U<{g_+|x_0|^2\over p_{N-1}}.}                \tag{5.14}
\]

In boundary-normalized, scale-invariant form, define

\[
 \|\xi\|^2=|\xi_0|^2+2\sum_{n=1}^{N}|\xi_n|^2,    \tag{5.15}
\]

and

\[
 \mathcal C_x^{\rm tr}
 =p_{N-1}{\|\xi\|^2\over|\xi_0|^2}.                \tag{5.16}
\]

Then

\[
 \boxed{
 {\chi_U\over g_+}\mathcal C_x^{\rm tr}<1}        \tag{5.17}
\]

implies `Q_- -U*I>0`.  This is still conditional on actual arithmetic cone
membership and quantitative coefficient control.  The trace bound (5.12)
is invalid without positive real eigenvalues of `X`.

## 6. Origin projective-curvature criterion

Let the unit projected prolate anchor be

\[
 \kappa={P_Nk_\lambda^+\over\|P_Nk_\lambda^+\|},
\]

and decompose the exact even block relative to
`H_+=C*kappa direct-sum mathcal K`, where
`mathcal K=H_+ intersect kappa^perp`:

\[
 Q_+=\begin{bmatrix}q&b^*\\b&A\end{bmatrix}.       \tag{6.1}
\]

Let `U` be a finite Ritz upper bound and assume the strict complete-source
comparison

\[
 B=A-U I\succ0.                                     \tag{6.2}
\]

For the simple even ground eigenvalue `mu=epsilon<=U`, use the existing
ground vector `x`.  Condition (6.2) forces `<kappa,x>!=0`, so normalize its
line by its `kappa` coefficient:

\[
 w={x\over\langle\kappa,x\rangle}
  =\kappa-z_\mu,
 \qquad z_\mu=(A-\mu I)^{-1}b.                     \tag{6.3}
\]

For an inversion-even vector `v`, define the two origin functionals

\[
 \ell_0(v)=\widehat v(0),
 \qquad
 \ell_2(v)=\left.{d\over dt}\widehat v(i\sqrt t)
              \right|_{t=0}
 ={1\over2}\int_{-L/2}^{L/2}y^2v(y)\,dy.           \tag{6.4}
\]

Put

\[
 K_0=\ell_0(\kappa),
 \qquad K_2=\ell_2(\kappa),
 \qquad
 \mathcal J_0^{(2)}(v)=K_0\ell_2(v)-K_2\ell_0(v). \tag{6.5}
\]

Assume `K_0!=0`, as holds eventually on the admitted projected-prolate
schedule.  If

\[
 W_0=\ell_0(w)=K_0-\ell_0(z_\mu),                  \tag{6.6}
\]

then direct algebra gives the exact projective identity

\[
 \boxed{
 {\ell_2(w)\over\ell_0(w)}
 ={K_2\over K_0}
 -{\mathcal J_0^{(2)}(z_\mu)\over K_0W_0}.}        \tag{6.7}
\]

The quotient is invariant under nonzero rescaling of either ground-line
representative.

For a continuous functional `ell` on `mathcal K`, set

\[
 \mathcal L_\ell(U)=\|B^{-1/2}\ell^*\|^2,
 \qquad
 E_U=\langle b,B^{-1}b\rangle.                    \tag{6.8}
\]

Write `L_0(U)=L_(ell_0)(U)` and
`L_(J,0)(U)=L_(mathcal J_0^(2))(U)`.

### Theorem 6.1 (finite origin-curvature leverage gate)

Suppose there are constants `0<=eta<1` and `C_2<infinity` such that

\[
 \boxed{
 E_U\mathcal L_0(U)\leq\eta^2|K_0|^2,}             \tag{6.9}
\]

\[
 \boxed{
 E_U\mathcal L_{J,0}(U)\leq C_2^2|K_0|^4.}        \tag{6.10}
\]

Then

\[
 |W_0|\geq(1-\eta)|K_0|,                           \tag{6.11}
\]

\[
 \left|{\ell_2(w)\over\ell_0(w)}
       -{K_2\over K_0}\right|
 \leq{C_2\over1-\eta}.                            \tag{6.12}
\]

If `|K_2/K_0|` is uniformly bounded and the finite odd-positive hypotheses
hold, then `Z_(lambda,N)^(0)` is uniformly bounded.

**Proof.**  Cauchy--Schwarz in the positive graph metric and monotonicity
from `mu<=U` give

\[
 |\ell_0(z_\mu)|^2\leq E_U\mathcal L_0(U),
 \qquad
 |\mathcal J_0^{(2)}(z_\mu)|^2
       \leq E_U\mathcal L_{J,0}(U).               \tag{6.13}
\]

Equations (6.9) and (6.6) prove (6.11); (6.10), (6.11), and (6.7) prove
(6.12).  The left side of (2.8) is nonnegative, so (2.8) and (6.12) give the
last assertion.  \(\square\)

Let
`a_infinity=lim ||P_N k_lambda^+||>0` be the nonzero projected-state norm
limit proved in `notes/PROJECTED_STATE_NORM_LOWER_BOUND.md`.  On any admitted
projection schedule for which
`hat(kappa)(z) -> Xi(z)/(4*a_infinity)` locally uniformly in a complex
neighborhood of zero, the projected-prolate limit makes `K_0` eventually
bounded away from zero and `K_2/K_0` bounded, without reading any zero table.
This assertion is not made for an arbitrary relation between `N` and `L`.
In the centered raw Fourier basis

\[
 \phi_n(y)=(-1)^nL^{-1/2}e^{2\pi iny/L},            \tag{6.14}
\]

the two functionals are explicit:

\[
 \ell_0(\phi_0)=\sqrt L,
 \qquad \ell_0(\phi_n)=0\quad(n\ne0),              \tag{6.15}
\]

\[
 \ell_2(\phi_0)={L^{5/2}\over24},
 \qquad
 \ell_2(\phi_n)={L^{5/2}\over4\pi^2n^2}
 \quad(n\ne0).                                    \tag{6.16}
\]

Thus the new graph target uses only the zero mode and an inverse-square
Fourier moment.  It retains the complete pole--archimedean--minus-prime
matrix inside `B`; splitting the source blocks before forming (6.8) would
discard the cancellation being sought.

## 7. Positive-height cofactor audit

The stronger origin route does not make the original two-height gate
automatic from generic perturbation theory.  Let

\[
 B_+=Q_+-\epsilon I,
 \qquad \eta_+=(1,\sqrt2,\ldots,\sqrt2)^T,          \tag{7.1}
\]

and let `x` be a unit simple kernel vector.  Fix `0<tau<sigma`.  For `u>0`,
put

\[
 a_u={uL\over2\pi},
\]

\[
 \ell_u={2\sinh(uL/2)\over u\sqrt L}
 \left(1,{\sqrt2a_u^2\over1+a_u^2},\ldots,
             {\sqrt2a_u^2\over N^2+a_u^2}\right)^T. \tag{7.2}
\]

Then

\[
 M_N(u)={\ell_u^*x\over\eta_+^*x}.                 \tag{7.3}
\]

Since

\[
 \operatorname {adj}(B_+)=
 \left(\prod_{j=2}^{N+1}(\epsilon_j-\epsilon)\right)
 |x\rangle\langle x|,                              \tag{7.4}
\]

one has the exact mixed-cofactor formula

\[
 \boxed{
 {M_N(\tau)\over M_N(\sigma)}
 ={\ell_\tau^*\operatorname {adj}(B_+)\eta_+
   \over
   \ell_\sigma^*\operatorname {adj}(B_+)\eta_+}.} \tag{7.5}
\]

For the positive rank-one perturbation

\[
 Q_+(r;u)=Q_++r|\ell_u\rangle\langle\ell_u|,       \tag{7.6}
\]

Hellmann--Feynman gives

\[
 \left.{d\over dr}\epsilon(r;u)\right|_{r=0}
 =|\ell_u^*x|^2.                                   \tag{7.7}
\]

Therefore, in the positive-transform domain,

\[
 \boxed{
 \left({M_N(\tau)\over M_N(\sigma)}\right)^2
 ={\epsilon_\tau'(0)\over\epsilon_\sigma'(0)}.}   \tag{7.8}
\]

For `tau!=sigma`, the two vectors `ell_tau` and `ell_sigma` are noncollinear.
Neither rank-one matrix in (7.6) Loewner-dominates the other by a positive
constant: test on a vector orthogonal to one evaluation vector but not the
other.  Thus (7.8) is a reconstruction, not a monotonicity theorem.

There is an equivalent coefficient probability.  Put

\[
 \alpha={\sigma L\over2\pi},
 \qquad \gamma={\tau L\over2\pi},
\]

and define

\[
 D(t)=\det(G+tI)=\sum_{j=0}^{N}d_jt^j,
 \qquad
 \mathbb P(J=j)={d_j\alpha^{2j}\over D(\alpha^2)}. \tag{7.9}
\]

This is a Poisson-binomial law and

\[
 \mathbb E J=d_{\rm eff}(\alpha),
 \qquad
 R^{\rm q}(\tau,\sigma)
 =\mathbb E\left[\left({\tau\over\sigma}\right)^{2J}\right]. \tag{7.10}
\]

Consequently,

\[
 \boxed{
 {M_N(\tau)\over M_N(\sigma)}
 =\mathcal T_N(\gamma,\alpha)^{-1}
  \mathbb E\left[\left({\tau\over\sigma}\right)^{2J}\right],} \tag{7.11}
\]

where the explicit exterior product from the 0.47 ground-tilt note is

\[
 \mathcal T_N(\gamma,\alpha)
 =\prod_{n>N}{n^2+\alpha^2\over n^2+\gamma^2}.     \tag{7.12}
\]

Coefficient positivity says that (7.9) is a probability law; it does not
bound its mean.

The locked positive-ground countermodel has

\[
 s_1^2={3\over4},
 \qquad s_n^2=n^2\quad(2\leq n\leq N).             \tag{7.13}
\]

For it,

\[
 Z_{\lambda,N}^{(0)}
 =\left({L\over2\pi}\right)^2
 \left({4\over3}+\sum_{n=2}^{N}{1\over n^2}\right), \tag{7.14}
\]

which grows quadratically in `L` when `N` grows.  The model has exact Cauchy
displacement, a pointwise-positive ground, positive coefficients, and a
uniformly conditioned positive odd block.  Hence none of those abstract
properties proves the quantitative reserve.

## 8. Exact remaining arithmetic target

On one explicit unbounded schedule with `N/L^2` bounded away from zero,
after proving the finite simple-even and strict shifted-sector hypotheses for
the actual source matrices, the new strong scalar target is any one of the
equivalent bounds

\[
 \boxed{
 Z_{\lambda,N}^{(0)}=O(1),
 \qquad
 {p_1\over p_0}=O(L^{-2}),
 \qquad
 {\langle z_N,x\rangle\over x_0}=O(L^{-2}).}       \tag{8.1}
\]

The exact odd-resolvent version is (2.19).  The cancellation-preserving
projective sufficient target is (6.9)--(6.10).  If pointwise positivity of
the actual boundary-normalized ground is proved first, the geometric version
is the uniform centered second-moment bound in (3.11), with the stronger
condition `N/L^2->infinity` when using the exact equivalence stated after
that formula.

This stronger gate would establish local boundedness of the normalized
finite characteristic products and every fixed-height trace bound.  It would
not identify the limiting product, prove the higher moment limits, establish
the projective ground-line bridge, prove equation (5.2), or complete the
Riemann-hypothesis program.  A successful next estimate must use the actual
combined pole--archimedean--minus-prime coefficients; determinant minors,
Hellmann--Feynman identities, coefficient-cone membership, and generic
Cauchy displacement reconstruct the scalar but do not bound it.
