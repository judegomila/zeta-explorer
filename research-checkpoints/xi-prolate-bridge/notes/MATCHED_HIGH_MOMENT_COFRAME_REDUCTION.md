# Matched high-moment and coframe reduction

## 0. Claim boundary

This note gives exact finite-dimensional reductions for the common matched
schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 N=\lceil\lambda^2\rceil={p^2+3\over4}.                 \tag{0.1}
\]

It proves:

1. a coordinate-invariant adjoint-tail identity for the prescribed matched
   source family, with the source Gram retained;
2. a normalized `N`-minor criterion for an absolute and relative row-frame
   floor;
3. sharp complete-sign centered-moment and one-sided-moment lower bounds for
   the physical high compression;
4. exact cyclic-kernel formulas that retain the minus sign on the prime block
   and the parity sign of the pole;
5. an explicit matched projection formula and lower bound for the odd pole,
   together with the angle forced by every estimate that charges that pole
   separately; and
6. exact countermodels delimiting what source counts, qualitative
   injectivity, even moments, and absolute prime moments can prove.

None of these statements proves the matched coframe hypothesis, a positive
signed sector, the residual--gap limit in equation (5.2) of
`DIRECT_RH_ATTACK.md`, locally uniform determinant convergence, or the
Riemann hypothesis.  No zeta-zero list, global Weil-positivity assumption,
cached Weil eigenspace, or numerical extrapolation is used.  Strict
inequalities below remain strict: equality at a proposed positive margin is
not a pass.

## 1. Locked conventions and matched spaces

Put

\[
 \ell=\log\lambda,\qquad L=2\ell,\qquad
 I_\lambda=[-\ell,\ell].                                  \tag{1.1}
\]

The additive logarithmic coordinate is `x=log u`.  Lebesgue measure is used
on `I_lambda`, and every function is extended by zero.  The Fourier
convention and Plancherel measure are

\[
 \widehat f(t)=\int_{I_\lambda}f(x)e^{-itx}\,dx,
 \qquad d\nu(t)={dt\over2\pi}.                            \tag{1.2}
\]

Multiplicative inversion is reflection, `Jf(x)=f(-x)`.  The complete
real-axis multiplier is

\[
 \boxed{
 m_\lambda(t)=2\theta'(t)-2S_\lambda(t),\qquad
 S_\lambda(t)=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).}                  \tag{1.3}
\]

The archimedean derivative in (1.3) is reconstructed with the locked gamma
branch as

\[
 2\theta'(t)=
 \operatorname{Re}\psi\!\left({1\over4}+{it\over2}\right)-\log\pi.
                                                                  \tag{1.3a}
\]

The endpoint is inclusive: every prime power `n<=lambda^2` occurs.  The
minus sign in (1.3) is the sign in source equation (3.19).  It is not
replaced by an absolute prime sum.

On inversion parity `epsilon in {+1,-1}`, the pole is

\[
 2\epsilon |p_\epsilon\rangle\langle p_\epsilon|,
 \qquad
 p_+(x)=\cosh(x/2),\qquad p_-(x)=\sinh(x/2).              \tag{1.4}
\]

Equivalently, with `ell_epsilon(f)=fhat(i/2)`, its sesquilinear form is

\[
 P_\epsilon(f,g)=
 2\epsilon\,\overline{\ell_\epsilon(f)}\ell_\epsilon(g).
                                                                  \tag{1.4a}
\]

Thus the even pole is positive and the odd pole is negative.  Reflection may
not be dropped.

The source functions live on `[-lambda,lambda]`, with Lebesgue measure and
zero extension.  Let

\[
 \mathcal H_0^{\rm ev}=
 \left\{f\in L^2[-\lambda,\lambda]:
 f(-x)=f(x),\ \int_{-\lambda}^{\lambda}f(x)\,dx=0\right\}.
                                                                  \tag{1.5}
\]

Every finite prolate combination below keeps its actual zero-Lebesgue-
integral source normalization.  It is not replaced by a unit-norm
representative.

Let `E_N^+` and `E_N^-` be the locked centered Fourier parity spaces.  In
the plus sector, assume the projected comparison anchor is nonzero, normalize
it to `kappa`, and put

\[
 X_{N,+}=E_N^+\cap\kappa^\perp,
 \qquad X_{N,-}=E_N^-.                                   \tag{1.6}
\]

Both spaces in (1.6) have dimension `N`.  The eventual nonvanishing theorem
for the plus anchor on (0.1) has a non-effective threshold; it must not be
used as a finite certificate below that threshold.

For either sign `sigma`, let

\[
 (A_\lambda f)(u)=\sqrt u\sum_{m\leq\lambda/u}f(mu),
 \qquad S_\sigma={I+\sigma J\over2},                      \tag{1.7}
\]

and, with `X=X_(N,epsilon)`, define the full-source map

\[
 T=P_XS_\sigma A_\lambda:\mathcal H_0^{\rm ev}\longrightarrow X.
                                                                  \tag{1.8}
\]

The inversion sign `sigma` in (1.8) is chosen for the physical parity under
consideration.  Define the Mobius mass

\[
 M_\mu(\lambda)=
 \sum_{n\leq\lfloor\lambda^2\rfloor}{|\mu(n)|\over\sqrt n}
 \leq2\lambda.                                           \tag{1.9}
\]

The full-source right inverse already proved in
`notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md` gives

\[
 \boxed{
 R:=TT^*\succeq
 {1\over2\lambda^2M_\mu(\lambda)^2}I_X
 \succeq {1\over8\lambda^4}I_X,}
 \qquad
 R\preceq{\lambda^2\over2}I_X.                           \tag{1.10}
\]

Equation (1.10) is a theorem for the full source space.  It says nothing by
itself about the prescribed finite buffered family.

## 2. Exact matched coframe and adjoint-tail identity

Let

\[
 C:\mathbb C^r\longrightarrow\mathcal H_0^{\rm ev}       \tag{2.1}
\]

synthesize the actual matched buffered source family for one parity.  In the
plus sector, `P_X` in (1.8) performs the exact anchor deflation.  If a further
declared source-coordinate map is used, it is included in `C`.  Put

\[
 D=C^*C,\qquad F=\operatorname{ran}C,\qquad W=TC.          \tag{2.2}
\]

The matrix `D` is mandatory.  It may not be silently replaced by the
identity.  Redundant source columns are allowed, in which case `D` is
singular and its Moore--Penrose inverse is used.

In the actual pinned orthonormal-source coordinates this Gram is explicit.
Write

\[
 I_n=\int_{-\lambda}^{\lambda}h_{n,\lambda}(x)\,dx,
 \qquad
 q=\left\lceil {2\over\pi^2}\log(50p^2+25)\log20\right\rceil,
 \qquad n_*=p^2+6+q.
\]

For the minus-family targets `t_j in {6,10,14,...}` with `t_j<n_*`, the odd
zero-integral columns are

\[
 a_j={I_{t_j}\over I_2},\qquad
 c_j^-=-e_{t_j}+a_j e_2,
 \qquad a=(a_j)_j,
 \qquad B_-=C_-^*C_-=I+aa^*,                             \tag{2.2a}
\]

For the plus targets `t_j in {8,12,16,...}` with `t_j<n_*`, put

\[
 \rho_4=-{I_4\over I_0},\qquad c_4=e_4+\rho_4e_0,
 \qquad
 \rho_j=-{I_{t_j}\over I_0},\qquad c_j=e_{t_j}+\rho_je_0,
\]

Define the undeflated plus physical map
`T_(+,N)^raw=P_(E_N^+) S_+ A_lambda`, and let
`p_4=T_(+,N)^raw c_4`, `p_j=T_(+,N)^raw c_j`.  Conditional on the declared
finite anchor hypothesis `p_4!=0`, define

\[
 \alpha_j={\langle p_4,p_j\rangle\over\|p_4\|^2},
 \qquad b_j=\rho_j-\rho_4\alpha_j.
\]

Exact plus-anchor deflation then gives

\[
 \widetilde c_j=e_{t_j}-\alpha_j e_4+b_j e_0,
 \qquad
 B_+=\widetilde C_+^*\widetilde C_+
 =I+\alpha\alpha^*+bb^*.                                 \tag{2.2b}
\]

Here `a`, `alpha`, and `b` are the pinned coefficient columns (the pinned
coordinates are real; the displayed adjoints give the complex convention).
The matrix determinant lemma gives the exact checks

\[
 \boxed{\det B_-=1+\|a\|^2,}
 \qquad
 \boxed{
 \det B_+=(1+\|\alpha\|^2)(1+\|b\|^2)
             -|\langle\alpha,b\rangle|^2.}              \tag{2.2c}
\]

Thus `D=B_-` or `D=B_+` for these declared families.  These are the full
source Grams, not diagonal surrogates; every frame, whitening, and minor
below retains them.

### Theorem 2.1 (matched adjoint-tail/frame identity)

The orthogonal source projection, restricted physical frame, and normalized
adjoint tail are

\[
 P_F=CD^\dagger C^*,\qquad
 \mathcal F=WD^\dagger W^*=TP_FT^*,                      \tag{2.3}
\]

\[
 Z=R^{-1/2}T,\qquad ZZ^*=I_X,\qquad
 \mathcal L_F=Z(I-P_F)Z^*.                               \tag{2.4}
\]

They obey the exact identities

\[
 \boxed{
 R^{-1/2}\mathcal F R^{-1/2}=I_X-\mathcal L_F,}
 \qquad
 \boxed{
 \|\mathcal L_F\|=\|(I-P_F)Z^*\|^2.}                    \tag{2.5}
\]

Consequently,

\[
 \boxed{
 \operatorname{ran}W=X
 \quad\Longleftrightarrow\quad
 \|\mathcal L_F\|<1,}                                  \tag{2.6}
\]

and, for every `0<gamma<=1`,

\[
 \boxed{
 WD^\dagger W^*\succeq\gamma R
 \quad\Longleftrightarrow\quad
 \|\mathcal L_F\|\leq1-\gamma.}                       \tag{2.7}
\]

In particular, (1.10) and (2.7) give the absolute floor

\[
 \boxed{
 WD^\dagger W^*\succeq
 {\gamma\over2\lambda^2M_\mu(\lambda)^2}I_X
 \succeq{\gamma\over8\lambda^4}I_X.}                  \tag{2.8}
\]

**Proof.**  The standard projection formula for a possibly redundant
synthesis is `P_F=CD^dagger C^*`.  Multiplying by `T` and `T^*` proves
(2.3).  Since `R=TT^*>0`, equation (2.4) gives `ZZ^*=I_X`.  Therefore

\[
 \begin{aligned}
 R^{-1/2}\mathcal F R^{-1/2}
 &=R^{-1/2}TP_FT^*R^{-1/2}\\
 &=ZP_FZ^*=ZZ^*-Z(I-P_F)Z^*\\
 &=I_X-\mathcal L_F,
 \end{aligned}                                           \tag{2.9}
\]

which is the first identity in (2.5).  Also

\[
 \mathcal L_F={(I-P_F)Z^*\}^*\{(I-P_F)Z^*\},            \tag{2.10}
\]

which proves the norm identity.  Because `0<=mathcal L_F<=I_X`, the frame
in (2.9) is positive definite exactly when `||mathcal L_F||<1`, proving
(2.6).  The inequality in (2.7) is equivalent through (2.9) to
`I-mathcal L_F>=gamma I`, which is equivalent to
`||mathcal L_F||<=1-gamma`.  Finally (2.8) follows from (1.10).  `square`

The quantity in (2.5) is the normalized adjoint-source tail.  A raw physical
determinant, qualitative source injectivity, or an unnormalized column norm
does not control it.

## 3. Source-whitened normalized `N`-minor floor

Since `dim X=N`, form the target- and source-whitened matrix

\[
 \widetilde W=R^{-1/2}WD^{\dagger/2}:\mathbb C^r
                                      \longrightarrow X. \tag{3.1}
\]

By (2.3),

\[
 \widetilde W\widetilde W^*
 =R^{-1/2}WD^\dagger W^*R^{-1/2}
 =I_X-\mathcal L_F.                                      \tag{3.2}
\]

Choose any orthonormal coordinates on `X`.  For `I subset {1,...,r}` with
`|I|=N`, let `widetilde W_I` be the corresponding `N by N` column minor and
put

\[
 \mathcal V_N=\sum_{|I|=N}|\det\widetilde W_I|^2.         \tag{3.3}
\]

### Theorem 3.1 (normalized minor certificate)

Cauchy--Binet gives

\[
 \boxed{
 \mathcal V_N
 =\det(\widetilde W\widetilde W^*)
 =\det(I_X-\mathcal L_F).}                               \tag{3.4}
\]

Let `U>0` satisfy

\[
 U\geq\|\widetilde W\widetilde W^*\|.                   \tag{3.5}
\]

If, for some `gamma>0`,

\[
 \boxed{\mathcal V_N\geq\gamma U^{N-1},}                \tag{3.6}
\]

then

\[
 \boxed{
 WD^\dagger W^*\succeq\gamma R
 \succeq{\gamma\over8\lambda^4}I_X.}                  \tag{3.7}
\]

It is sufficient to prove (3.6) for one source-whitened minor:

\[
 |\det\widetilde W_I|^2\geq\gamma U^{N-1}.              \tag{3.8}
\]

Here (3.2) shows that `U=1` is always valid.  Thus the particularly simple
condition `mathcal V_N>=gamma>0` gives (3.7).

**Proof.**  Equation (3.4) is Cauchy--Binet applied to (3.1).  Let
`0<=s_1<=...<=s_N<=U` be the eigenvalues of
`widetilde W widetilde W^*`.  From (3.4)--(3.6),

\[
 s_1={\mathcal V_N\over s_2\cdots s_N}
 \geq{\mathcal V_N\over U^{N-1}}\geq\gamma.             \tag{3.9}
\]

Therefore `widetilde W widetilde W^*>=gamma I`.  Congruence by `R^(1/2)`
and (1.10) prove (3.7).  A single summand lower bound in (3.3) proves (3.6),
which gives (3.8).  `square`

The determinant in (3.4), and hence the sum in (3.3), is coordinate
invariant.  An individual minor is tied to the declared orthonormal target
coordinates and the declared source whitening, but remains a valid
certificate.  A minor of raw `W`, without `D^(dagger/2)`, is not a
source-normalized certificate.  Arbitrary rescaling of the source columns
can change raw minors while leaving (2.3) unchanged.

## 4. The complete signed physical-high operator

Let

\[
 K=\operatorname{ran}W,\qquad H=K^\perp\subset X,
 \qquad d=\dim H.                                        \tag{4.1}
\]

If Theorem 2.1 or 3.1 proves a positive matched row floor, then `H={0}` and
every physical-high obligation is vacuous.  Otherwise let `P_H` be the
orthogonal projection onto `H`, let `U` be a source-reconstructed real
shift, and put

\[
 w(t)=m_\lambda(t)-U.                                    \tag{4.2}
\]

For any real multiplier `r` used below, its finite compression is defined by

\[
 \langle f,T_rg\rangle=
 \int_{\mathbb R}\overline{\widehat f(t)}\widehat g(t)
 r(t)\,d\nu(t),\qquad f,g\in X.                          \tag{4.2a}
\]

The complete signed high compression is

\[
 \boxed{
 A_{\epsilon,H}
 =P_HT_wP_H+2\epsilon
 |p_{\epsilon,H}\rangle\langle p_{\epsilon,H}|,
 \qquad p_{\epsilon,H}=P_Hp_\epsilon.}                  \tag{4.3}
\]

This is precisely the compression of `Q_lambda-U I` to `H`: the even pole
has its positive sign and the odd pole its negative sign.  Write

\[
 M_H=P_HT_wP_H,
 \qquad P_\epsilon=|p_{\epsilon,H}\rangle
                    \langle p_{\epsilon,H}|.             \tag{4.4}
\]

No separate absolute norm is taken in (4.3).

## 5. A sharp complete-sign centered-moment floor

### Theorem 5.1 (centered `2k`-moment floor)

Let `A=A^*` act on a `d`-dimensional space, where `d>=2`, and let `k>=1`.
Define

\[
 \bar a={\operatorname{tr}A\over d},\qquad
 C_{2k}=\operatorname{tr}(A-\bar a I)^{2k}.               \tag{5.1}
\]

Then

\[
 \boxed{
 \lambda_{\min}(A)\geq
 \bar a-
 \left\{ {C_{2k}\over1+(d-1)^{1-2k}}\right\}^{1/(2k)}.}
                                                                  \tag{5.2}
\]

The constant is sharp.  For `d=1`, `lambda_min(A)=tr A` exactly.

**Proof.**  Let the eigenvalues be `a_1<=...<=a_d` and put

\[
 q=\bar a-a_1\geq0,\qquad x_j=a_j-\bar a.                \tag{5.3}
\]

Then `x_1=-q` and `sum_(j=2)^d x_j=q`.  Holder's inequality gives

\[
 q^{2k}
 =\left|\sum_{j=2}^d x_j\right|^{2k}
 \leq(d-1)^{2k-1}\sum_{j=2}^d|x_j|^{2k}.                \tag{5.4}
\]

Consequently,

\[
 C_{2k}=q^{2k}+\sum_{j=2}^d|x_j|^{2k}
 \geq q^{2k}\{1+(d-1)^{1-2k}\}.                        \tag{5.5}
\]

Solving for `q` proves (5.2).  Equality holds when

\[
 a_1=\bar a-q,\qquad
 a_2=\cdots=a_d=\bar a+{q\over d-1},                    \tag{5.6}
\]

so the constant is sharp.  `square`

Apply Theorem 5.1 directly to `A_(epsilon,H)` in (4.3).  Then the complete
prime sign, all archimedean--prime covariances, and the parity pole are
inside `bar a` and `C_(2k)`.  If the right side of (5.2) is strictly
positive in both parity sectors on the same matched schedule, it is a
rigorous physical-high floor.  This note does not prove the source estimates
needed to make that happen.

### Corollary 5.2 (matched moment order)

Suppose, for explicit constants `alpha>beta>0`,

\[
 \bar a\geq\alpha L,
 \qquad C_{2k}\leq d(\beta L)^{2k}.                       \tag{5.7}
\]

Then

\[
 \lambda_{\min}(A)\geq
 L\left[
 \alpha-\beta
 \left\{{d\over1+(d-1)^{1-2k}}\right\}^{1/(2k)}
 \right].                                                \tag{5.8}
\]

In particular, the simpler strict condition

\[
 k>{\log d\over2\log(\alpha/\beta)}                     \tag{5.9}
\]

makes the bracket in (5.8) positive.  If `d` is comparable to the matched
dimension `N`, then `log d` is comparable to `log(lambda)`.  Thus an
extensive bound of the form (5.7) generally requires moment order
`2k=Omega(log lambda)`.  A fixed variance or fixed moment order does not
remove the factor `d^(1/(2k))`.

## 6. A sign-sensitive one-sided moment floor

Even centered moments are necessarily invariant under
`A-bar a I -> -(A-bar a I)`.  The following alternative retains one-sided
information through raw, and in particular odd, moments.

### Theorem 6.1 (one-sided `M`-moment floor)

Let `A=A^*` act on a finite-dimensional space, let `p>=1` be an integer, and
let `M` be a certified real upper bound

\[
 M\geq\lambda_{\max}(A).                                  \tag{6.1}
\]

Then

\[
 \boxed{
 \lambda_{\min}(A)\geq
 M-\{\operatorname{tr}(MI-A)^p\}^{1/p}.}                 \tag{6.2}
\]

**Proof.**  The operator `B=MI-A` is positive semidefinite and

\[
 \lambda_{\max}(B)=M-\lambda_{\min}(A).                  \tag{6.3}
\]

Since `B>=0`,

\[
 \lambda_{\max}(B)^p\leq\operatorname{tr}B^p.           \tag{6.4}
\]

Taking the `p`th root and rearranging proves (6.2).  `square`

For odd `p`, expansion of `(MI-A)^p` contains odd raw moments of `A`; it
therefore distinguishes lower-tail orientation that every collection of
even centered moments can miss.

If `M=alpha L` and a source estimate proves

\[
 \operatorname{tr}(MI-A)^p\leq d(\beta L)^p,
 \qquad0<\beta<\alpha,                                   \tag{6.5}
\]

then

\[
 \lambda_{\min}(A)\geq L(\alpha-\beta d^{1/p}).          \tag{6.6}
\]

The strict sufficient order is

\[
 p>{\log d\over\log(\alpha/\beta)}.                     \tag{6.7}
\]

Again this is logarithmic in `lambda` when `d` is comparable to the matched
dimension.  Equations (6.5)--(6.7) are a scaling criterion, not a proved
source bound.

## 7. Source reconstruction of the complete moments

Choose an orthonormal basis `(u_j)_(j=1)^d` of `H` and define the Fourier
projection kernel

\[
 K_H(s,t)=\sum_{j=1}^d
       \overline{\widehat u_j(s)}\widehat u_j(t),
 \qquad \kappa_H(t)=K_H(t,t).                             \tag{7.1}
\]

This definition is basis independent.  The matrix entries of `M_H` are

\[
 (M_H)_{ij}=\int_{\mathbb R}
       \overline{\widehat u_i(t)}\,w(t)\widehat u_j(t)
       \,d\nu(t).                                        \tag{7.2}
\]

All integrals below are absolutely convergent.  Indeed, every vector in the
finite centered Fourier space is a trigonometric polynomial on
`[-ell,ell]` followed by zero extension, so its Fourier transform is
`O((1+|t|)^(-1))`; each integration variable in the cyclic product occurs
in two Fourier factors, while `w(t)` grows only logarithmically.

### Theorem 7.1 (cyclic kernel trace)

For every integer `j>=1`,

\[
 \boxed{
 \operatorname{tr}M_H^j
 =\int_{\mathbb R^j}
   \left\{\prod_{\nu=1}^jw(t_\nu)\right\}
   \left\{\prod_{\nu=1}^j
      K_H(t_{\nu+1},t_\nu)\right\}
   \prod_{\nu=1}^j d\nu(t_\nu),}
 \qquad t_{j+1}=t_1.                                     \tag{7.3}
\]

**Proof.**  Expand the trace of the product using (7.2).  At the link from
`t_nu` to `t_(nu+1)`, summing the repeated basis index gives

\[
 \sum_{a=1}^d\widehat u_a(t_\nu)
       \overline{\widehat u_a(t_{\nu+1})}
 =K_H(t_{\nu+1},t_\nu).                                  \tag{7.4}
\]

Doing this at every link proves (7.3).  `square`

Every occurrence of `w` in (7.3) is

\[
 w(t)=2\theta'(t)-U
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                               \cos(t\log n).             \tag{7.5}
\]

Thus expansion of (7.3) retains the prime minus sign, every mixed
archimedean--prime term, all prime--prime phases, and every prime power at
the inclusive endpoint.  Replacing (7.3) by moments of `|S_lambda|` loses
this information.

The parity pole is also reconstructed without a cached eigenvector.  With
`P_epsilon` from (4.4), direct word expansion gives

\[
 \boxed{
 \operatorname{tr}A_{\epsilon,H}^j
 =\sum_{\omega\in\{0,1\}^j}
 (2\epsilon)^{|\omega|}
 \operatorname{tr}
 \left(B_{\omega_1}\cdots B_{\omega_j}\right),}
 \quad B_0=M_H,\quad B_1=P_\epsilon.                     \tag{7.6}
\]

For example,

\[
 \operatorname{tr}A_{\epsilon,H}
 =\operatorname{tr}M_H+2\epsilon\|p_{\epsilon,H}\|^2,   \tag{7.7}
\]

\[
 \operatorname{tr}A_{\epsilon,H}^2
 =\operatorname{tr}M_H^2
  +4\epsilon\langle p_{\epsilon,H},M_Hp_{\epsilon,H}\rangle
  +4\|p_{\epsilon,H}\|^4.                              \tag{7.8}
\]

Every mixed word is reconstructible from (7.2); consecutive rank-one
insertions reduce to factors of
`<p_(epsilon,H),M_H^a p_(epsilon,H)>`.  Equivalently, the matrix determinant
lemma gives the exact parity-sensitive generating identity

\[
 \boxed{
 \det(zI-A_{\epsilon,H})
 =\det(zI-M_H)
 \left\{1-2\epsilon
 \langle p_{\epsilon,H},(zI-M_H)^{-1}
                          p_{\epsilon,H}\rangle\right\}.} \tag{7.9}
\]

The expansion at infinity of (7.9) reconstructs the same mixed moments.
Equations (7.3) and (7.6), rather than producer booleans or stored
eigenvectors, are the independent analytic reconstruction path.

## 8. Exact matched odd-pole projection and angle obstruction

Use the centered Fourier modes

\[
 \phi_n(x)=(-1)^nL^{-1/2}e^{i\omega_nx},
 \qquad \omega_n={2\pi n\over L}.                         \tag{8.1}
\]

The phase `(-1)^n` is part of the locked centered convention.  Let `P_N`
be the orthogonal projection onto `span{phi_n:-N<=n<=N}`.  Since `p_-` is
odd, `P_Np_-` lies in `E_N^-`.

### Theorem 8.1 (odd-pole Fourier coefficients)

For `n!=0`,

\[
 \boxed{
 \langle\phi_n,p_-\rangle
 ={2i\omega_n\sinh(\ell/2)
   \over\sqrt L(\omega_n^2+1/4)},}
 \qquad \langle\phi_0,p_-\rangle=0.                    \tag{8.2}
\]

Consequently,

\[
 \boxed{
 \|P_Np_-\|^2
 ={8\sinh^2(\ell/2)\over L}
 \sum_{n=1}^N
 {\omega_n^2\over(\omega_n^2+1/4)^2}.}                 \tag{8.3}
\]

Moreover,

\[
 \boxed{
 \|P_Np_-\|^2\geq B_{\lambda,N}:=
 \sinh\ell-\ell-
 {2L\sinh^2(\ell/2)\over\pi^2N}.}                     \tag{8.4}
\]

At `N=ceil(lambda^2)`,

\[
 \boxed{
 B_{\lambda,N}=
 {\lambda-\lambda^{-1}\over2}-\log\lambda
 -{\log\lambda\,(\lambda+\lambda^{-1}-2)\over\pi^2N},}
 \qquad
 {B_{\lambda,N}\over\lambda/2}\longrightarrow1.       \tag{8.5}
\]

**Proof.**  Since `omega_n ell=pi n`, elementary integration gives

\[
 \begin{aligned}
 \int_{-\ell}^{\ell}\sinh(x/2)e^{-i\omega_nx}\,dx
 &=-2i\int_0^\ell\sinh(x/2)\sin(\omega_nx)\,dx\\
 &={2i\omega_n(-1)^n\sinh(\ell/2)
    \over\omega_n^2+1/4}.                                \tag{8.6}
 \end{aligned}
\]

Multiplication by the conjugate phase `(-1)^n/sqrt(L)` proves (8.2).
Adding the equal contributions of `n` and `-n` proves (8.3).  Also

\[
 \|p_-\|^2
 =\int_{-\ell}^{\ell}\sinh^2(x/2)\,dx
 =\sinh\ell-\ell.                                       \tag{8.7}
\]

For the omitted tail, use

\[
 {\omega_n^2\over(\omega_n^2+1/4)^2}
 \leq{1\over\omega_n^2},
 \qquad
 \sum_{n>N}{1\over n^2}\leq{1\over N}.                \tag{8.8}
\]

Equations (8.3), (8.7), and (8.8) give

\[
 \|(I-P_N)p_-\|^2
 \leq{2L\sinh^2(\ell/2)\over\pi^2N},                  \tag{8.9}
\]

which proves (8.4).  Finally
`sinh(ell)=(lambda-lambda^(-1))/2` and
`sinh^2(ell/2)=(lambda+lambda^(-1)-2)/4`, which give the exact formula
in (8.5).  Since `N>=lambda^2`, division by `lambda/2` makes every term
after the leading `lambda/2` tend to zero.  This proves the limit in (8.5).
`square`

Let

\[
 p_{-,N}=P_Np_-,\qquad
 \eta_{\rm pole}=
 {\|P_Hp_{-,N}\|^2\over\|p_{-,N}\|^2}.                 \tag{8.10}
\]

The separately charged odd-pole load is exactly

\[
 c_-=2\|P_Hp_{-,N}\|^2
 =2\eta_{\rm pole}\|p_{-,N}\|^2.                       \tag{8.11}
\]

### Corollary 8.2 (necessary angle for separated-pole tests)

Every certificate of the form

\[
 \text{nonnegative multiplier load}+c_-<g                \tag{8.12}
\]

necessarily satisfies

\[
 \boxed{
 \eta_{\rm pole}<{g\over2\|p_{-,N}\|^2}.}              \tag{8.13}
\]

Whenever `B_(lambda,N)>0`, (8.4) yields the explicit weaker necessary
condition

\[
 \boxed{
 \eta_{\rm pole}<{g\over2B_{\lambda,N}}.}               \tag{8.14}
\]

For the compressed-multiplier scale `g=kappa L`, with fixed `kappa>0`,

\[
 {g\over2B_{\lambda,N}}
 \sim {2\kappa\log\lambda\over\lambda}.                \tag{8.15}
\]

**Proof.**  The multiplier term in (8.12) is nonnegative, so (8.12) implies
`c_-<g`.  Substitute (8.11) to get (8.13), then apply (8.4).  Equation
(8.15) follows from (8.5).  `square`

This angle is required by the leverage-trace, localized-energy, and absolute
higher-moment routes whenever they append `c_-` as a separate surcharge.  It
is not asserted to be necessary for the complete signed operator (4.3),
where multiplier--pole cancellation remains available.

There is nevertheless an exact necessary pole-axis test for the soft-short
high ratio.  Put

\[
 a=(w-g)_+,\qquad v=(g-w)_+,\qquad
 A_0=gI_H+P_HT_aP_H.                                    \tag{8.16}
\]

The odd soft ratio is

\[
 \zeta_-=
 \left\|A_0^{-1/2}
 \{P_HT_vP_H+2|p_H\rangle\langle p_H|\}
 A_0^{-1/2}\right\|,\qquad p_H=P_Hp_{-,N}.              \tag{8.17}
\]

If `p_H!=0` and `zeta_-<1`, testing its Rayleigh quotient on `p_H` proves

\[
 \boxed{
 {\langle p_H,T_vp_H\rangle\over\|p_H\|^2}
 +2\|p_H\|^2
 <g+{\langle p_H,T_ap_H\rangle\over\|p_H\|^2}.}        \tag{8.18}
\]

In particular,

\[
 \boxed{
 2\|p_H\|^2
 <g+{\langle p_H,T_ap_H\rangle\over\|p_H\|^2}.}        \tag{8.19}
\]

Thus the soft criterion must prove either strong pole capture or a positive
multiplier compensation on the pole axis.  It cannot simply omit the odd
row.  For the unsplit complete operator, positivity similarly requires

\[
 {\langle p_H,T_wp_H\rangle\over\|p_H\|^2}
 >2\|p_H\|^2,                                            \tag{8.20}
\]

obtained by testing (4.3) with `epsilon=-1` on `p_H`.  Equations
(8.18)--(8.20) retain the negative pole rather than replacing it by an even
one.

## 9. The matched and exponential schedules cannot be mixed

For (0.1), define

\[
 q=\left\lceil {2\over\pi^2}
       \log(50p^2+25)\log20\right\rceil.                 \tag{9.1}
\]

The exact transition-buffered column counts are

\[
 r_+=N+\left\lfloor{q+2\over4}\right\rfloor-1,
 \qquad
 r_-=N+\left\lfloor{q\over4}\right\rfloor.             \tag{9.2}
\]

Since `q>=5`, these counts obey

\[
 r_+\geq N,qquad r_-\geq N+1.                            \tag{9.3}
\]

For completeness, the quantity inside the ceiling in (9.1) increases with
`p`.  At `p=5`, the elementary bounds
`log(1275)>7`, `log(20)>29/10`, and `pi^2<10` make it greater
than four.  Hence `q>=5` throughout the locked range, which proves (9.3)
directly from (9.2).

Thus the matched inventory has no row-count obstruction.  Equations
(2.5), (3.4), or (3.6) are still required: count is not rank or a frame
floor.

For the locked exponential cutoff

\[
 N_{\exp}=2^{2400p^2},                                    \tag{9.4}
\]

the same prescribed inventory has exact row-nullity lower bounds

\[
 \boxed{
 \nu_+\geq N_{\exp}-{p^2+3\over4}
       -\left\lfloor{q+2\over4}\right\rfloor+1,}        \tag{9.5}
\]

\[
 \boxed{
 \nu_-\geq N_{\exp}-{p^2+3\over4}
       -\left\lfloor{q\over4}\right\rfloor.}           \tag{9.6}
\]

Both are strictly positive for every locked `p>=5`.  Hence the buffered
family cannot be a row coframe at (9.4).  Conversely, relative projection
or sampling estimates proved only on (9.4) cannot be inserted into the
matched coframe or matched high-moment argument.  The finite-compression
`O(lambda^2)` dangerous-rank theorem also assumes `N` comparable to
`lambda^2`; it does not retain that scale after substitution of (9.4).

A valid bridge must therefore prove its coframe or nonzero-high-complement
geometry, its signed high estimate, and its source-coordinate low/cross
estimates on one common schedule.  Taking the most favorable conclusion
from each of (0.1) and (9.4) is not a theorem.

Here is an explicit finite proof of the positivity assertion.  The bounds
`log(20)<3`, `pi^2>9`, and `50p^2+25<=51p^2` give

\[
 {2\log20\over\pi^2}\log(50p^2+25)
 <{2\over3}\log(51p^2)<p^2-1.                           \tag{9.7}
\]

For the last inequality, it holds at `p=5` already from
`log(1275)<8`, and the derivative of
`p^2-1-(2/3)log(51p^2)` is
`2p-4/(3p)>0`.  Since `p^2-1` is an integer, (9.7) gives
`q<=p^2-1`.  With `m=(p^2+3)/4`, this implies

\[
 r_+\leq2m-2,\qquad r_-\leq2m-1.                        \tag{9.8}
\]

Finally `N_exp=2^(2400p^2)>2m` for `p>=5`, so (9.5)--(9.6) are
strictly positive.  This proof uses only exact column counts; it makes no
spectral or numerical inference.

## 10. Exact countermodels

### 10.1 Column count and continuous injectivity do not give a matched coframe

Fix integers `N>=2` and `r>=N`.  Let `X=C^N`, let `p=e_N`, and let
`Y=C^r` be an exterior space.  In the standard source coordinates
`e_1,...,e_r`, whose source Gram is `D=I_r`, choose

\[
 w_j=e_j\quad(1\leq j\leq N-1),\qquad
 w_j=e_1\quad(N\leq j\leq r),                             \tag{10.1}
\]

and define a continuous map into `X direct-sum Y` by

\[
 \mathcal T e_j=(w_j,e_j).                                \tag{10.2}
\]

The map `mathcal T` is injective because its `Y` component is the identity.
Its declared finite projection onto `X` has `r>=N` columns but range

\[
 \operatorname{span}(w_1,\ldots,w_r)=p^\perp.            \tag{10.3}
\]

Thus its corrected finite frame `W D^(-1)W^*=WW^*` has the exact null
witness `p`.  If desired, enlarge the full source by one vector mapped to
`(p,0)`.  The full-source map is then onto `X` and has a right inverse, while
the selected `r`-column family remains rank deficient.  The `Y` coordinates
can be interpreted as Fourier modes beyond the declared cutoff: continuous
injectivity and eventual fixed-source projection injectivity remain
compatible with failure at a growing matched cutoff.

This model has the matched column surplus, a genuine source Gram, and
qualitative continuous injectivity, but no coframe.  It proves that none of
those weaker facts implies (2.6) or (3.6).

### 10.2 Even centered moments do not identify the lower tail

Put

\[
 A_{\rm good}=\operatorname{diag}(7/2,1/2,1/2),
 \qquad
 A_{\rm bad}=\operatorname{diag}(-1/2,5/2,5/2).          \tag{10.4}
\]

Both matrices have mean `3/2`.  Their centered spectra are respectively

\[
 (2,-1,-1),\qquad(-2,1,1).                               \tag{10.5}
\]

Therefore, for every `k>=1`,

\[
 \operatorname{tr}(A_{\rm good}-3I/2)^{2k}
 =\operatorname{tr}(A_{\rm bad}-3I/2)^{2k}
 =2^{2k}+2.                                               \tag{10.6}
\]

Nevertheless `lambda_min(A_good)=1/2>0`, whereas
`lambda_min(A_bad)=-1/2<0`.  Thus even the complete sequence of even
centered moments, together with the mean, cannot identify which side carries
the extreme tail.  The sharp bound (5.2) correctly gives only the common
worst-case conclusion.  Odd raw or one-sided moments such as (6.2) are
needed to distinguish this pair.

### 10.3 Absolute prime moments lose the source sign

Take a two-atom measure space with unit mass at each atom and put

\[
 b=(5,5),\qquad S=(4,1).                                  \tag{10.7}
\]

With the locked prime sign,

\[
 b-2S=(-3,3),\qquad \min_i(b_i-2S_i)=-3.                 \tag{10.8}
\]

If the prime sign is illegally reversed,

\[
 b+2S=(13,7),\qquad \min_i(b_i+2S_i)=7.                  \tag{10.9}
\]

Yet both cases have the same archimedean lower-one mean and the same
absolute prime data:

\[
 \min_i b_i=5,\qquad
 \mathfrak M=\sup_{0\leq\alpha\leq1,\ \int\alpha=1}
                    \int\alpha S^2=16,                  \tag{10.10}
\]

\[
 \int|S|^{2k}=4^{2k}+1\qquad(k\geq1).                   \tag{10.11}
\]

Thus localized energy and every absolute even prime moment can be identical
while the signed lower-one mean changes from negative to positive.  Such
moments give valid symmetric error bounds, but they do not retain the prime
sign.  The cyclic moments (7.3) or another genuinely one-sided signed
estimate are required.

## 11. Exact remaining alternatives

At matched bandwidth, a successful continuation must prove at least one of
the following source statements in both parity sectors:

1. a positive `gamma` in (2.7) or (3.6), which makes the high complement
   zero;
2. a strictly positive complete-sign moment floor from (5.2) or (6.2) on
   the actual nonzero high complement; or
3. a sharper signed high argument that proves the pole-axis compensation
   (8.18) and all remaining high directions.

The second route requires moments of the combined multiplier and pole, not
only `|S_lambda|`; at an extensive matched high dimension, the elementary
moment conversion indicates logarithmically growing order.  The third route
must either include the projected odd pole in the declared low range or
prove its compensation without dropping its negative sign.

Even after one of these high alternatives is established, the signed
source-coordinate low comparison and its strict quotient-relative gluing
reserve remain separate obligations.  Nothing in this note promotes a
finite matrix calculation, real-axis eigenvalue agreement, or a schedule
splice into the asymptotic bridge.
