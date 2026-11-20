# Trimmed-mean leverage, feature Schur load, and the all-even coframe theorem

## 1. Claim boundary

This note sharpens the physical-complement part of the direct
Xi--prolate--Weil program in three exact ways.

1.  It identifies the best scalar high-space floor obtainable from the
    leverage trace as a lower-one trimmed mean of the complete signed
    multiplier.
2.  It factors the positive short and the exact high-eliminated negative
    load in feature space, including singular high blocks and a convergent
    Neumann remainder bound.
3.  It gives an explicit Mobius right inverse for the arithmetic map and
    proves that some finite prefix of *all* even zero-integral prolate
    combinations spans every fixed finite physical parity space.

These are reductions, not the missing asymptotic theorem.  In particular,
the all-even prefix mixes the two residue classes modulo four, has no
effective terminal label, and does not prove the prescribed buffered
coframes.  No common unbounded schedule, signed low floor, equation (5.2) of
`DIRECT_RH_ATTACK.md`,
locally uniform determinant limit, or Riemann-hypothesis proof follows.  The
repository state remains `P0_INVALIDATED`.

The Fourier convention is

\[
 \widehat f(t)=\int_{-\log\lambda}^{\log\lambda}
 f(y)e^{-ity}\,dy,
 \qquad
 \|f\|^2={1\over2\pi}\int_{\mathbb R}|\widehat f(t)|^2dt.       \tag{1.1}
\]

The exact arithmetic multiplier retains the source minus sign and inclusive
prime-power endpoint:

\[
 m_\lambda(t)=2\theta'(t)-2S_\lambda(t),\qquad
 S_\lambda(t)=\sum_{1<n\leq\lambda^2}
 {\Lambda(n)\over\sqrt n}\cos(t\log n).                       \tag{1.2}
\]

Additive inversion is reflection, `Jf(y)=f(-y)`.  Nothing below assumes that
the unreflected arithmetic state is inversion even.

## 2. Exterior-volume formula for physical leverage

Let `X` be a `d`-dimensional physical Fourier space.  Let `W` be a finite
column synthesis matrix, put

\[
 K=\operatorname{ran}W,\qquad H=K^\perp,\qquad k=\operatorname{rank}W,
                                                                    \tag{2.1}
\]

and let `a(t)` be the Fourier-evaluation column on `X`.  Define

\[
 E_k(W)=\sum_{|I|=k}\det(W_I^*W_I)
       =\operatorname{pdet}(WW^*),\qquad E_0(W)=1.                  \tag{2.2}
\]

Here the pseudo-determinant of the zero operator is one.  Every nonzero
`k`-column minor spans `K`.  The Gram determinant after appending `a(t)` is
therefore its original Gram determinant times the squared distance of
`a(t)` from `K`.  Summing the minors proves

\[
 \boxed{E_{k+1}([W,a(t)])=E_k(W)\,\kappa_H(t)},\qquad
 \kappa_H(t)=\|P_Ha(t)\|^2.                                     \tag{2.3}
\]

Consequently, with

\[
 \Gamma_H(s)=\operatorname{tr}(P_H\mathsf T_sP_H)
             ={1\over2\pi}\int e^{its}\kappa_H(t)dt,             \tag{2.4}
\]

one has

\[
 \Gamma_H(s)={1\over E_k(W)}{1\over2\pi}
 \int e^{its}E_{k+1}([W,a(t)])dt,\qquad
 \Gamma_H(0)=d-k.                                                \tag{2.5}
\]

For every nonnegative multiplier `v`,

\[
 V_H={1\over2\pi}\int v(t)\kappa_H(t)dt
 ={1\over E_k(W)}{1\over2\pi}
 \int v(t)E_{k+1}([W,a(t)])dt.                                  \tag{2.6}
\]

The unabsorbed odd pole costs exactly

\[
 c_-=2\|P_Hp_-\|^2
    =2{E_{k+1}([W,p_-])\over E_k(W)}.                            \tag{2.7}
\]

Equivalently, in finite dimension,

\[
 V_H=\lim_{\varepsilon\downarrow0}
 \varepsilon\operatorname{tr}
 ((WW^*+\varepsilon I)^{-1}T_v).                                \tag{2.8}
\]

Thus exact full row rank makes `H=0` and annihilates the leverage deficit;
no quantitative lower determinant is needed for that qualitative fact.
Below full row rank, determinant magnitude cannot encode orientation.  If
`h=d-k` and `tau_1<=...<=tau_d` are the eigenvalues of `T_v|_X`, Ky Fan gives

\[
 \sum_{j=1}^{h}\tau_j\leq V_H
 \leq\sum_{j=d-h+1}^{d}\tau_j,                                  \tag{2.9}
\]

and rotations of `K` attain both extremes.

## 3. Stop-loss duality and the optimal leverage-trace floor

Put

\[
 d\mu_H(t)=\kappa_H(t){dt\over2\pi},\qquad
 d_H=\mu_H(\mathbb R)=\dim H,\qquad
 w(t)=m_\lambda(t)-U.                                           \tag{3.1}
\]

For `g>0`, the negative multiplier in the split
`w=g+[w-g]_+-[g-w]_+` has leverage

\[
 V_H(g)=\int(g-w(t))_+\,d\mu_H(t).                              \tag{3.2}
\]

Assume `d_H>=1` and `w` is integrable against `mu_H`.  Define the lower-one
trimmed mean

\[
 \ell_H=\inf\left\{
 \int\alpha(t)w(t)d\mu_H(t):
 0\leq\alpha\leq1,\ \int\alpha d\mu_H=1\right\}.                \tag{3.3}
\]

For every feasible `alpha`, the pointwise inequality
`(g-w)_+>=alpha(g-w)` gives

\[
 g-V_H(g)\leq\int\alpha w\,d\mu_H.                             \tag{3.4}
\]

Choosing `alpha` on the lowest unit of `w`-mass, with the required fraction
of a level set, gives the reverse extremum identity

\[
 \boxed{\sup_{g\in\mathbb R}\{g-V_H(g)\}=\ell_H.}              \tag{3.5}
\]

If `d_H>1`, a finite lower-unit quantile `q` satisfies

\[
 \mu_H\{w<q\}\leq1\leq\mu_H\{w\leq q\},\qquad
 q-V_H(q)=\ell_H.                                               \tag{3.6}
\]

If `d_H=1`, integrability gives
`g-V_H(g)->int w dmu_H=ell_H` as `g` tends to infinity.  The supremum may
also be attained at finite `g` (for example when `w` is bounded above); only
the limiting identity is universal.  These two cases prove the exact
positive-threshold statements

\[
 \boxed{\exists g>0:\ V_H(g)<g\quad\Longleftrightarrow\quad
 \ell_H>0,}                                                     \tag{3.7}
\]

and, for an unabsorbed odd pole,

\[
 \boxed{\exists g>0:\ V_H(g)+c_-<g\quad\Longleftrightarrow\quad
 \ell_H>c_-.}                                                   \tag{3.8}
\]

Strictness is essential.  Equality in (3.7) or (3.8) is a failure.  A
necessary condition is `mu_H{m_lambda<=U}<1`.

The same number is a direct high-space multiplier floor.  For a unit vector
`h in H`,

\[
 \alpha_h(t)={|\widehat h(t)|^2\over\kappa_H(t)}                 \tag{3.9}
\]

is set to zero where `kappa_H=0`; it lies in `[0,1]` and has `mu_H`-mass one.
Therefore

\[
 \boxed{P_HT_{m_\lambda-U}P_H\succeq\ell_HI_H.}                \tag{3.10}
\]

Equation (3.10) does not determine the oriented low--high cross block.

## 4. Archimedean trimmed mean and exact prime moments

Let

\[
 b(t)=2\theta'(t)-U,\qquad
 M_H=\int S_\lambda(t)^2d\mu_H(t).                             \tag{4.1}
\]

Let `ell_b` be the lower-one trimmed mean of `b` with respect to `mu_H`.
For every feasible `alpha`, Cauchy--Schwarz and `alpha<=1` give

\[
 \left|\int\alpha(w-b)d\mu_H\right|
 \leq2\sqrt{M_H}.
\]

Taking the two infima yields

\[
 \boxed{|\ell_H-\ell_b|\leq2\sqrt{M_H}.}                      \tag{4.2}
\]

The digamma series shows that `b(t)` is strictly increasing in `|t|`.
Hence, when `d_H>1`, there is a unique generalized threshold `T_H` with

\[
 \int_{-T_H}^{T_H}d\mu_H=1,
 \qquad
 \ell_b=\int_{-T_H}^{T_H}b(t)d\mu_H(t).                        \tag{4.3}
\]

For `d_H=1`, use `T_H=infinity`.  The density is continuous, so no boundary
atom is present.  Combining (3.10) and (4.2) gives the operational bound

\[
 \boxed{P_HT_{m_\lambda-U}P_H
 \succeq(\ell_b-2\sqrt{M_H})I_H.}                              \tag{4.4}
\]

The even pole improves this floor.  The odd floor loses `c_-` unless the odd
pole is placed in `K` and the source synthesis and metric are augmented by
the same direction.

The exact source formula for `M_H` remains

\[
 M_H={1\over2}\sum_{n,m\leq\lambda^2}c_nc_m
 \left(\operatorname{Re}\Gamma_H(\log(n/m))
      +\operatorname{Re}\Gamma_H(\log(nm))\right),
 \quad c_n={\Lambda(n)\over\sqrt n}.                            \tag{4.5}
\]

Every prime power is included.  Because the physical states are supported on
the logarithmic interval of length `2 log lambda`, the terms at translation
magnitude at least `2 log lambda` vanish, including the exact endpoint.

For even `p=2k`, define

\[
 P_{p,H}=\int|S_\lambda(t)|^p d\mu_H(t).                        \tag{4.6}
\]

Expanding the cosines gives the exact phase-sensitive formula

\[
 P_{p,H}=2^{-p}\sum_{n_1,\ldots,n_p\leq\lambda^2}
 \left(\prod_{j=1}^pc_{n_j}\right)
 \sum_{\varepsilon\in\{-1,1\}^p}
 \operatorname{Re}\Gamma_H\!\left(
 \log\prod_{j=1}^pn_j^{\varepsilon_j}\right).                 \tag{4.7}
\]

Let `c_0=psi(1/4)-log pi` and

\[
 u_g(t)=\left[g+U-c_0-\tfrac12\log(1+4t^2)\right]_+,
 \qquad A_{p,H}=\int u_g(t)^p d\mu_H(t).                       \tag{4.8}
\]

The locked digamma lower bound gives `v<=(u_g+2|S_lambda|)`.  If
`R_HH=P_HT_vP_H` and `rho=||R_HH||`, diagonalizing `R_HH`, applying scalar
Jensen to each eigenvector, and then applying Minkowski proves

\[
 \boxed{
 \rho\leq(\operatorname{tr}R_{HH}^{p})^{1/p}
 \leq A_{p,H}^{1/p}+2P_{p,H}^{1/p}.}                           \tag{4.9}
\]

In particular,

\[
 \rho\leq\sqrt{A_{2,H}}+2\sqrt{M_H},\qquad
 V_H\leq A_{1,H}+2\sqrt{d_HM_H}.                              \tag{4.10}
\]

The moments control the high inverse, but their diagonal data do not control
the orientation of the effective low load.

## 5. Feature-space positive short and negative round trips

Work in a finite orthogonal split `E=K direct-sum H`.  Factor the positive
and negative parts as

\[
 C=X^*X,\qquad R=Y^*Y,
 \qquad X=[X_K\ X_H],\quad Y=[Y_K\ Y_H].                       \tag{5.1}
\]

The positive Krein short remains valid when `C_HH` is singular:

\[
 \boxed{C_{/K}=X_K^*(I-P_{\operatorname{ran}X_H})X_K
 =C_{KK}-C_{KH}C_{HH}^\dagger C_{HK}.}                         \tag{5.2}
\]

Put

\[
 Z=Y_HY_H^*,\qquad \rho=\|Z\|=\|R_{HH}\|,
 \qquad \tau_H=\operatorname{tr}R_{HH}
              =\|P_HY^*\|_{\rm HS}^2.                       \tag{5.2a}
\]

If `rho<g`, the exact Schur complement of the shorted lower comparison is

\[
 \boxed{
 S_K=gI+C_{/K}-Y_K^*(I-Z/g)^{-1}Y_K.}                          \tag{5.3}
\]

Indeed, the Woodbury identity gives

\[
 Y_K^*(I-Z/g)^{-1}Y_K
 =R_{KK}+R_{KH}(gI-R_{HH})^{-1}R_{HK}.                         \tag{5.4}
\]

The effective negative load has the convergent expansion

\[
 Y_K^*(I-Z/g)^{-1}Y_K
 =R_{KK}+\sum_{j\geq1}g^{-j}
 R_{KH}R_{HH}^{j-1}R_{HK}.                                   \tag{5.5}
\]

After terms `j=0,...,q`, its positive remainder obeys

\[
 \boxed{
 0\preceq\mathcal R_q
 \preceq{(\rho/g)^{q+1}\over1-\rho/g}R_{KK}.}                 \tag{5.6}
\]

Since `rho<=tau_H`, `tau_H<g` gives the coarser exact majorant

\[
 Y_K^*(I-Z/g)^{-1}Y_K
 \preceq{g\over g-\tau_H}R_{KK}.                             \tag{5.7}
\]

For the multiplier-only negative block, `tau_H=V_H`.  If the odd pole is
left as an additional negative feature, `tau_H=V_H+c_-`.  Thus the symbol
`V_H` must not be used as the trace of a generic feature factorization.

The norm or higher-moment bound can be much sharper than the trace.  More
importantly, retaining (5.3) or the first oriented terms of (5.5) can be much
sharper than either scalar majorant.

Two inverse-free certificates are available.  First,

\[
 \tau_H=\operatorname{tr}R_{HH}=\|P_HY^*\|_{\rm HS}^2
 =\inf_Z\|Y^*-WZ\|_{\rm HS}^2.                                \tag{5.8}
\]

Second, if `L` is any contraction on the positive feature space satisfying
`LX_H=0`, then

\[
 \boxed{C_{/K}\succeq X_K^*L^*LX_K.}                          \tag{5.9}
\]

Thus explicit trial approximation and annihilation maps can certify the two
geometric quantities without trusting a physical pseudoinverse.

Full shorting is only sufficient, not necessary.  Positive low--high cross
coupling can be essential.  For `0<=theta<=1`, the interpolation

\[
 C_\theta=\theta C+(1-\theta)
 \begin{bmatrix}C_{/K}&0\\0&0\end{bmatrix}\preceq C           \tag{5.10}
\]

runs from the fully shorted comparison to the exact full positive block and
provides a rigorous escape from over-shorting.

## 6. Explicit arithmetic right inverse and the all-even coframe

Return to the multiplicative interval

\[
 I_\lambda=[\lambda^{-1},\lambda],\qquad
 (A_\lambda f)(u)=\sqrt u\sum_{m\leq\lambda/u}f(mu).            \tag{6.1}
\]

For arbitrary `g in L^2(I_lambda,du/u)`, define on the visible positive
source interval

\[
 (R_\lambda g)(x)=\sum_{n\leq\lambda/x}\mu(n)
 {g(nx)\over\sqrt{nx}},\qquad \lambda^{-1}\leq x\leq\lambda.  \tag{6.2}
\]

Finite divisor convolution gives

\[
 \begin{aligned}
 A_\lambda R_\lambda g(u)
 &=\sum_{k\leq\lambda/u}{g(ku)\over\sqrt k}
   \sum_{n\mid k}\mu(n)=g(u),                                \tag{6.3}\\
 \|R_\lambda g\|_{L^2(dx)}
 &\leq S_\lambda\|g\|_{L^2(du/u)},\qquad
 S_\lambda=\sum_{n\leq\lfloor\lambda^2\rfloor}
 {|\mu(n)|\over\sqrt n}\leq2\lambda.                        \tag{6.4}
 \end{aligned}
\]

Extend (6.2) evenly, initially by zero on the central hole
`|x|<1/lambda`.  If `J=int_(1/lambda)^lambda R_lambda g(x)dx`, put the
constant `-lambda J` on that hole.  The resulting even source `f_g` has
zero Lebesgue integral, the correction is invisible to (6.1), and

\[
 \boxed{A_\lambda f_g=g,\qquad
 \|f_g\|_{L^2[-\lambda,\lambda]}
 \leq\sqrt2\lambda S_\lambda\|g\|_{L^2(du/u)}.}               \tag{6.5}
\]

The map used here is bounded.  Indeed, equation (6.8e) of
`DIRECT_RH_ATTACK.md` gives, on the additive-even source space,

\[
 \|A_\lambda f\|_{L^2(I_\lambda,du/u)}^2
 \leq {\lambda^2\over2}\|f\|_{L^2[-\lambda,\lambda]}^2.       \tag{6.5a}
\]

Thus `A_lambda` maps the full even zero-integral source space onto
`L^2(I_lambda,du/u)`.  For either inversion parity `sigma`, and every finite
physical parity space `X`,

\[
 P_XS_\sigma A_\lambda:\mathcal F_0^{\rm ev}\longrightarrow X \tag{6.6}
\]

is onto.

For completeness, use the parameter and label convention pinned in
`PROLATE_DEFECT_SOURCE_LOCK.json` and rescale to `[-1,1]`.  The sinc
concentration operator

\[
 (K_cf)(x)=\int_{-1}^{1}{\sin(c(x-y))\over\pi(x-y)}f(y)dy
\]

is compact, self-adjoint, commutes with reflection, and

\[
 \langle f,K_cf\rangle={1\over2\pi}
       \int_{-c}^{c}|\widehat f(\xi)|^2d\xi.                  \tag{6.6a}
\]

If `K_cf=0`, this integral vanishes.  Because `f` has compact support,
`fhat` is entire; vanishing on the band forces `fhat=0` identically and
therefore `f=0`.  Thus `K_c` is injective.

The same modes are the differential prolate modes, rather than a second
unrelated eigenbasis.  With

\[
 L_c=-{d\over dx}\left((1-x^2){d\over dx}\right)+c^2x^2,
 \qquad k_c(z)={\sin(cz)\over\pi z},
\]

direct differentiation gives

\[
 (L_{c,x}-L_{c,y})k_c(x-y)
 =(x+y)\{(x-y)(k_c''+c^2k_c)+2k_c'\}=0.                    \tag{6.6b}
\]

Integration by parts has no endpoint term because the Sturm coefficient
`1-y^2` vanishes there, so `L_cK_c=K_cL_c` on the regular Sturm core.  The
pinned one-dimensional Sturm package gives a simple complete orthogonal
eigenbasis for `L_c`, split into even and odd modes.  Commutation and
injectivity make each Sturm mode a nonzero `K_c` eigenmode; simplicity fixes
the common mode up to scale.  Hence these are precisely a complete prolate
eigenbasis in the pinned label convention.  Sturm oscillation orders the
ground mode as even and zero-free.  Choosing its sign positive gives

\[
 I_0=\int_{-\lambda}^{\lambda}h_0(x)dx>0.                    \tag{6.6c}
\]

If `I_j=int h_j`, the combinations

\[
 c_{2j}=h_{2j}-{I_{2j}\over I_0}h_0\quad(j\geq1)               \tag{6.7}
\]

have dense span in `F_0^ev`: apply the bounded integral functional to the
even-basis partial sums and remove their residual integral with `h_0/I_0`.
By (6.5a), `P_XS_sigma A_lambda` is bounded.  Its range is all of the
finite-dimensional space `X` by (6.6), so the images of the dense span are
dense in `X`, hence span `X`; a finite subset, and therefore some finite
prefix, spans `X` exactly.

This theorem deliberately does **not** imply that the `0 mod 4` family spans
the prescribed even comparison space or that the `2 mod 4` family spans the
odd space.  It gives no bound on the last required label and no relation to
the buffered transition cutoff.

There is a coordinate-free quantitative target.  Let

\[
 T=P_XS_\sigma A_\lambda,\qquad R=TT^*>0,\qquad
 Z=R^{-1/2}T,\quad ZZ^*=I_X.                                  \tag{6.8}
\]

For an orthogonally whitened source subspace `F`,

\[
 TP_FT^*=R^{1/2}(I-L_F)R^{1/2},\qquad
 L_F=Z(I-P_F)Z^*,\quad0\preceq L_F\preceq I.                  \tag{6.9}
\]

Hence the coframe is full row exactly when `||L_F||<1`; the stronger scalar
condition `tr L_F<1` suffices.  Moreover,

\[
 \det(TP_FT^*)=\det(R)\det(I-L_F)
 =\det(R)\prod_{j=1}^{\dim X}\cos^2\vartheta_j,               \tag{6.10}
\]

where the `vartheta_j` are the principal angles between `ran Z^*` and `F`.
The missing prescribed-coframe estimate is therefore a normalized
adjoint-source tail estimate, not a raw determinant-magnitude estimate.

## 7. Exact countermodels and remaining target

Three finite models prevent promotion of the reductions.

1.  **Trace versus norm.**  With `g=1` and
    `R_HH=diag(9/16,9/16)`, the trace is `9/8>g` while
    `rho=9/16<g`; the true high inverse exists.
2.  **Orientation.**  With `g=1`, `Y_H=(1/2,0)^T`, and either
    `Y_K=(1,0)^T` or `Y_K=(0,1)^T`, both models have the same
    `V_H=rho=1/4` and `R_KK=1`, but their effective loads in (5.3) are
    `4/3` and `1`.
3.  **Over-shorting.**  For

    \[
    g=2,\quad C=\begin{bmatrix}9&9\\9&9\end{bmatrix},\quad
    R=\begin{bmatrix}3&0\\0&0\end{bmatrix},                  \tag{7.1}
    \]

    the full matrix `gI+C-R` is positive definite with determinant seven,
    but `C_/K=0` and the fully shorted scalar low block equals `-1`.

The clean new high-space target is

\[
 \boxed{\ell_b>2\sqrt{M_H}+c_-}                               \tag{7.2}
\]

on one common unbounded schedule, or the more flexible higher-moment
condition

\[
 A_{2k,H}^{1/(2k)}+2P_{2k,H}^{1/(2k)}+c_-<g.                 \tag{7.3}
\]

Here `c_-=0` only when the odd pole has already been absorbed into another
certified block; an unabsorbed negative odd-pole feature requires the shown
surcharge.

Neither inequality is presently proved.  Even if one is proved, the signed
source-coordinate low estimate and an oriented Schur/cross estimate remain.
The subsequent bridge still has to prove equation (5.2) of
`DIRECT_RH_ATTACK.md`, sector floors, and locally uniform determinant
convergence.  Finite exact models and numerical agreement cannot replace any
of those steps.
