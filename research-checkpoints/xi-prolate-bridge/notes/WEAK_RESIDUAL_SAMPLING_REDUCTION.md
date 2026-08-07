# Weak-residual duality and the absolute-sampling window target

## 1. Claim boundary

This note upgrades the exact radical leakage identity to a dual formulation
of the missing residual action.  It also gives a sufficient absolute-sampling
window theorem and an exact counterexample showing why the already-proved
scalar quadratic cancellations cannot imply that theorem.

Everything below is finite-dimensional linear algebra or ordinary
Cauchy--Schwarz on an absolutely summable sequence.  No reality of a zeta
zero, positivity of the Weil form, or zero table is used.  The separate
compact-BV theorem now proves the complete-remainder hypothesis (3.4), but
the required growing-window Bessel estimates, reciprocal defect sum,
left-preconditioned sector comparisons, and odd sector floor are not proved.
Equation (5.2) of `DIRECT_RH_ATTACK.md` therefore remains open, and the
repository state remains `P0_INVALIDATED`.

## 2. Exact graph-dual identity

Use the notation of `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md`.  Let

\[
 p=a\kappa,\qquad a=\|p\|>0,\qquad
 R=K_{\rm global}-p=O+P,
\]

and put

\[
 \mathcal K=E_N^+\cap\kappa^\perp,
 \qquad b=(Q-q)\kappa,
 \qquad A=P_{\mathcal K}Q|_{\mathcal K}.
\]

Equation (4.5) of the leakage note says, for every
`v in mathcal K`,

\[
 \langle v,b\rangle=-\frac1a\,\mathcal W_Z(v,R).             \tag{2.1}
\]

Let `D` be any positive self-adjoint operator on `mathcal K`.  The change of
variables `w=Dv` in Hilbert-space duality gives the exact identity

\[
\boxed{
 \|D^{-1}b\|
 =\frac1a\sup_{v\ne0}
       \frac{|\mathcal W_Z(v,R)|}{\|Dv\|}.}                  \tag{2.2}
\]

This is not an inequality and does not use positivity of `mathcal W_Z`.
It identifies the precise test ball

\[
 \mathcal T_D=\{v\in\mathcal K:\|Dv\|\le1\}.                \tag{2.3}
\]

The graph norm in (2.2) is `||Dv||`, not `||D^(1/2)v||`.
The latter gives the different dual quantity `||D^(-1/2)b||`; converting it
to the Euclidean resolvent norm can reintroduce the smallest scale in `D`,
exactly as warned in equations (2.10)--(2.11) of
`notes/PRECONDITIONED_RESOLVENT_PROGRAM.md`.

Let `U>=u`, set `B=A-U I`, and suppose the already-proved left-preconditioned
hypothesis holds:

\[
 \rho=\|D^{-1}(B-D)\|\le\rho_0<1.                            \tag{2.4}
\]

Lemma 1 of the preconditioner note and (2.2) then give

\[
\boxed{
 \tau\le\|B^{-1}b\|
 \le\frac1{a(1-\rho_0)}
   \sup_{v\ne0}\frac{|\mathcal W_Z(v,R)|}{\|Dv\|}.}         \tag{2.5}
\]

Thus a weak estimate on the explicit ball (2.3), rather than another scalar
estimate on `R` alone, is the exact missing residual input.

## 3. A positive sampling seminorm that is not Weil positivity

For a state `f`, let

\[
 \|f\|_{\mathfrak Z}^2
 =\sum_\rho\left(
   |F_f(s_\rho)|^2+|F_f(\overline{s_\rho})|^2\right),        \tag{3.1}
\]

whenever the right side converges absolutely.  This is a positive seminorm
of two ordinary value sequences (and a norm on the quotient by their common
kernel).  It is not the signed Weil quadratic form.
Ordinary sequence Cauchy--Schwarz gives

\[
 |\mathcal W_Z(f,g)|
 \le\|f\|_{\mathfrak Z}\|g\|_{\mathfrak Z}.                 \tag{3.2}
\]

Equation (3.2) is valid without putting any zero on the real parameter axis.
It is the same noncircular sequence argument used in equation (4.9) of
`notes/OUTER_OUTER_SPECTRAL_SAMPLING_REDUCTION.md`.

Let

\[
 \mathcal K=\bigoplus_m\mathcal K_m,
 \qquad D=\sum_m d_mP_m,
 \qquad d_m>0,                                               \tag{3.3}
\]

where the windows are defined from source-normalized prolate data, not from
Weil eigenvectors.  Suppose explicit quantities `epsilon_lambda` and
`beta_m` satisfy

\[
 \|R\|_{\mathfrak Z}^2\le\epsilon_\lambda,                  \tag{3.4}
\]

and

\[
 \sup_{\substack{v\in\mathcal K_m\\\|v\|=1}}
       \|v\|_{\mathfrak Z}^2\le\beta_m d_m.                  \tag{3.5}
\]

Then (2.1)--(3.2), applied separately on every orthogonal window, prove

\[
 \|P_mb\|^2
 \le\frac{\epsilon_\lambda\beta_m d_m}{a^2},                \tag{3.6}
\]

and hence

\[
\boxed{
 \|D^{-1}b\|^2
 \le\frac{\epsilon_\lambda}{a^2}
       \sum_m\frac{\beta_m}{d_m}.}                           \tag{3.7}
\]

Combining (2.4), (2.5), and `D_chord(t)<=t` gives the normalization-free
form needed by the determinant bridge:

\[
\boxed{
 aD_{\rm chord}(\tau)
 \le a\tau
 \le\frac1{1-\rho_0}
   \left(\epsilon_\lambda
         \sum_m\frac{\beta_m}{d_m}\right)^{1/2}.}           \tag{3.8}
\]

The factor `a=||p||` cancels.  No lower bound for the norm of the projected
comparison state is required by this route.

## 4. Why the scale is promising, and what is still absent

The proof of `notes/OUTER_OUTER_SPECTRAL_THEOREM.md` bounds the complete
absolute sample-square sequence for the actual corrected physical outer
state by an explicit constant times

\[
 D_S(\lambda)d_4=O(\lambda^7d_4).                            \tag{4.1}
\]

The pinned fixed-index prolate asymptotic gives

\[
 \lambda^8\frac{d_4}{d_8}
 \longrightarrow\frac{105}{4096\pi^4}.                     \tag{4.2}
\]

Consequently, if the full remainder satisfies (3.4) at the scale in (4.1)
and the growing source windows satisfy

\[
 \sum_m\frac{\beta_m}{d_m}=O(d_8^{-1}),                     \tag{4.3}
\]

then the square of the right side of (3.8) is `O(lambda^(-1))`.
This would give the desired `O(lambda^(-1/2))` weighted action.
`notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md` now proves, on the locked
half-integer exponential schedule, the explicit complete-remainder bound

\[
 \|R\|_{\mathfrak Z}^2
 \le d_4\left(4C_{\rm spec}D_S(\lambda)+2B_P(\lambda)\right)
 =O(\lambda^7d_4),                                         \tag{4.4}
\]

with `B_P(lambda)->0`.  Thus hypothesis (3.4) is closed for the actual
remainder.  Equations (4.1)--(4.4) still do not complete the route: the
repository lacks

1. the window Bessel constants `beta_m` through the growing transition
   range, including physical lift and Gram conditioning;
2. the reciprocal-window sum (4.3); and
3. the left-preconditioned comparisons in both parity sectors.

The later hybrid theorem sharpens the sufficient scale in (4.3).  Its
displayed finite majorants give

\[
 \epsilon_\lambda
 =O(\lambda^3\operatorname {polylog}(\lambda)d_4)+o(d_4).
                                                               \tag{4.4a}
\]

Since `d_4/d_8=Theta(lambda^(-8))`, it is enough to prove the relaxed
reciprocal-window estimate

\[
 \boxed{
 \sum_m{\beta_m\over d_m}
 =O\!\left({\lambda^4\operatorname {polylog}(\lambda)\over d_8}
       \right).}                                             \tag{4.4b}
\]

Indeed, (3.8), (4.2), and (4.4a)--(4.4b) then give

\[
 aD_{\rm chord}(\tau)
 =O(\lambda^{-1/2}\operatorname {polylog}(\lambda)),         \tag{4.4c}
\]

which satisfies equation (5.2) for every fixed `eta<1/2`.  The original
`O(d_8^(-1))` target remains a convenient stronger condition, but is no
longer the smallest sufficient asymptotic scale.  The corresponding weaker
global target, which may retain cross-window orientation, is
`Gamma_+(D_+)=O(lambda^4*polylog(lambda)/d_8)`.

A natural proof of (3.5) would construct, for every window vector, a
uniformly conditioned two-sided radical lift

\[
 K_v=v+R_v.
\]

At every zero parameter, radicality gives `F_v=-F_(R_v)`.  A
defect-relative absolute-sampling estimate for `R_v` would then prove (3.5)
without invoking Weil positivity.

### 4.1 Why direct compact-BV sampling loses one defect

The new compact-BV theorem cannot itself prove (3.5).  This failure is
quantitative already in the first fixed window.  Put `L=2log(lambda)`, and
let `v` be a real unit vector in the trigonometric space with modes
`|r|<=N`.  Parseval and Bernstein give

\[
 \|v'\|_2\le {2\pi N\over L},
 \qquad
 \operatorname {TV}_{[-L/2,L/2]}(v)
 \le {2\pi N\over\sqrt L}.                                 \tag{4.5}
\]

Cauchy--Schwarz in the orthonormal Fourier basis gives either endpoint trace
at most `sqrt((2N+1)/L)`.  Hence the real-line variation of the zero extension
satisfies

\[
 V_N^0={2\pi N+2\sqrt{2N+1}\over\sqrt L}.                 \tag{4.6}
\]

Insert `E=1`, `V=V_N^0` into equation (2.17) of
`notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md`.  With

\[
 H_N=\max\left\{1,
       \left(V_N^0+{3\over4}\sqrt L\right)^2\right\},     \tag{4.7}
\]

every normalized vector in every physical window obeys the completely
explicit absolute bound

\[
\begin{aligned}
 \|v\|_{\mathfrak Z}^2\le B_{\rm abs}(\lambda,N)
 :={}&192\sqrt e\,\lambda(1+\log\lambda)^2\\
 &\times\left[Z_{\rm finite}+{C_Z\over\pi}
 \left((\pi+1)\log(H_N+2)+1\right)\right].                \tag{4.8}
\end{aligned}
\]

On the locked exponential schedule this is only
`O(lambda^3(log lambda)^2)`.  To force (3.5) from (4.8), one must take
`beta_m=B_abs/d_m`, so its reciprocal contribution is

\[
 {\beta_m\over d_m}={B_{\rm abs}\over d_m^2}.              \tag{4.9}
\]

For the first target `m=8`, (4.9) already exceeds the earlier stronger
`O(d_8^(-1))` scale by the factor `B_abs/d_8`, which tends to infinity by
the pinned fixed-index asymptotic.  It also exceeds the relaxed target by an
exponential factor, so neither regrouping the growing windows nor improving
their count can repair the direct insertion.

The first missing inequality is genuinely defect-relative,

\[
 \sup_{v\in\mathcal K_m,\|v\|=1}\|v\|_{\mathfrak Z}^2
 \le C_m d_m,                                              \tag{4.10}
\]

followed by a growing-index reciprocal ladder.  The earlier
`sum_(m=8,12,...) C_m/d_m=O(1/d_8)` target is stronger than the relaxed
target (4.4b).  Current KRD upper bounds and the very weak all-index
Logvinenko--Sereda lower bound prove neither statement.

### 4.2 The sharper global sampling-Gram target

There is a window-free form of the same missing estimate.  Let `G_+` be the
positive sampling Gram on `mathcal K`, defined by

\[
 \langle v,G_+v\rangle=\|v\|_{\mathfrak Z}^2,
 \qquad c=ab.
\]

The exact leakage identity and ordinary sequence Cauchy--Schwarz give the
Loewner inequality

\[
 \boxed{cc^*\le\epsilon_\lambda G_+.}                     \tag{4.11}
\]

The same sequence inequality and radical identity give
`|a^2q|=|W_Z(R,R)|<=epsilon_lambda`.  Hence
`U_Z=epsilon_lambda/a^2` is a rigorous upper bound for both `q` and the
two-vector Ritz value `u`.  In normalization-free variables the shifted
parity operators are

\[
 \widehat B_+=a^2A-\epsilon_\lambda I,
 \qquad
 \widehat B_-=a^2Q_- -\epsilon_\lambda I.                 \tag{4.12}
\]

The historical compact-BV estimate
`epsilon_lambda=O(lambda^7d_4)`, together with
`d_4/d_8=O(lambda^(-8))`, made the normalization-free scalar shift in
(4.12) `O(lambda^(-1)d_8)`.  The later hybrid complete-series theorem proves
the sharper statement `epsilon_lambda=o(d_6)`.  Thus the normalization-free
shift `epsilon_lambda I` in (4.12) is also negligible at the first fixed odd
scale.  The separate theorem in
`notes/PROJECTED_STATE_NORM_LOWER_BOUND.md` proves
`a->||E(h)(exp(.))||_2>0`; together they give the normalized bound
`U_Z=epsilon_lambda/a^2=o(d_6)`.  This supplies no lower bound for the
unshifted signed operators `A` or `Q_-`, so both parity comparisons remain
separate obligations.

The word "both" must not be read as a common defect scale.  The pinned
fixed-index constants give

\[
 {d_8\over d_6}\sim {32\pi^2\over7}\lambda^4.
\]

Therefore the older compact-BV estimate implied only

\[
 \epsilon_\lambda=O(\lambda^3d_6),
\]

not `epsilon_lambda=o(d_6)`.  This upper bound did not prove that the shift
was large; it only exposed the loss in that historical route.  The hybrid
theorem supplies the missing `o(d_6)` normalization-free estimate by a
different complete-series argument.  See
`notes/PARITY_SHIFT_SCALE_AUDIT.md` for the updated scale audit.

For the even action, let `D_+>0` and assume the standing uniform
left-preconditioned comparison

\[
 \rho=\|D_+^{-1}(A-U_ZI-D_+)\|\le\rho_0<1.
\]

Define the exact positive alignment constant

\[
 \Gamma_+(D_+)
 =\|D_+^{-1}G_+D_+^{-1}\|
 =\sup_{v\ne0}{\|v\|_{\mathfrak Z}^2\over\|D_+v\|^2}.     \tag{4.13}
\]

Equations (2.5) and (4.11) give

\[
 \boxed{
 a\tau\le {\sqrt{\epsilon_\lambda\Gamma_+(D_+)}\over1-\rho}.}
                                                                  \tag{4.14}
\]

Together with the hybrid estimate (4.4a), the relaxed sufficient global
sampling theorem is the Loewner comparison `G_+<=Gamma D_+^2` with
`Gamma=O(lambda^4*polylog(lambda)/d_8)`.  The older `O(1/d_8)` target is a
stronger convenient condition.  Windowwise hypotheses imply a global bound
after a Cauchy--Schwarz sum, but a direct comparison can retain cross-window
orientation and be sharper.  In contrast, the generic compact-BV estimate
gives only `G_+<=B_abs I`; when the smallest scale in `D_+` is `d_8`, this yields
`Gamma_+(D_+)<=B_abs/d_8^2`, again one full defect factor too weak.

### 4.3 Quotient preconditioning removes the lower Gram determinant

The global comparison can be formulated before physical
orthonormalization.  Let \(X\) be a source-coordinate window space,
\(D_{\rm ext}>0\) its positive exterior concentration form, and
\(W:X\to\mathcal K_L\) the physical synthesis.  Source injectivity is not
required.  On the actual range \(K=\operatorname {ran}W\), define

\[
 \Delta_K=(W D_{\rm ext}^{-1}W^*)^\dagger\big|_K.            \tag{4.15}
\]

The minimum-energy quotient theorem in
`notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md` proves

\[
 \langle v,\Delta_Kv\rangle
 =\inf_{Wx=v}\langle x,D_{\rm ext}x\rangle,\qquad
 \lambda_{\min}(\Delta_K)
 ={1\over\|W D_{\rm ext}^{-1/2}\|^2}.                        \tag{4.16}
\]

Suppose the complete source-coordinate sampling Gram, including every
cross term, satisfies

\[
 W^*G_+W\preceq C_{\rm ext}D_{\rm ext}.                      \tag{4.17}
\]

Taking the infimum over all preimages gives

\[
 G_+\preceq C_{\rm ext}\Delta_K,\qquad
 \Gamma_+(\Delta_K)
 \le C_{\rm ext}\|W D_{\rm ext}^{-1/2}\|^2.                  \tag{4.18}
\]

Thus the positive-sampling action does not require a lower bound for the
smallest singular value of \(W\), an endpoint-jet determinant, or a
normalized physical Gram minor.  With (4.4a), the relaxed sufficient scale is

\[
 C_{\rm ext}\|W D_{\rm ext}^{-1/2}\|^2
 =O(\lambda^4\operatorname {polylog}(\lambda)d_8^{-1}).      \tag{4.19}
\]

The previous `O(d_8^(-1))` scale remains a stronger sufficient target.

For the radical family, if \(Y\) synthesizes the corrected complete
remainder and \(Z\) is the two-evaluation sampling map, exact radicality
gives \(ZW=-ZY\).  Hence (4.17) is exactly

\[
 Y^*Z^*ZY\preceq C_{\rm ext}D_{\rm ext}.                    \tag{4.20}
\]

Neither (4.19) nor (4.20) is proved.  The generic compact-BV estimate gives
only
\[
 C_{\rm ext}\le B_{\rm abs}
 \|W D_{\rm ext}^{-1/2}\|^2,
\]
which squares the inverse-defect factor in (4.18).  Modewise diagonal bounds
also do not imply (4.20), because the source sampling Gram can have coherent
off-diagonal terms.

On an orthogonal high complement with metric \(gI\) and sampling norm
\(B_H\), all low/high sampling cross terms are retained by

\[
 \Gamma_+(\Delta_K\oplus gI)
 \le C_{\rm ext}\|W D_{\rm ext}^{-1/2}\|^2+{B_H\over g^2}.
                                                                    \tag{4.21}
\]

The full shifted signed operator must still dominate, or be left-close to,
this complete quotient preconditioner.  A comparison only on its low
compression does not control the full inverse in the presence of low/high
coupling.

## 5. Exact obstruction to a scalar-to-action inference

The need for new bilinear information is logical, not merely technical.
On the finite space with basis `(kappa,e,o)`, let

\[
 J=\operatorname{diag}(1,1,-1),\qquad
 Q=\begin{bmatrix}
 0&-1&0\\
 -1&1&0\\
 0&0&2
 \end{bmatrix}.                                               \tag{5.1}
\]

Then

\[
 q=0,\qquad b=-e,\qquad A=1,\qquad
 \alpha=1,\qquad\omega=2,                                  \tag{5.2}
\]

and the lower two-dimensional Ritz value and weighted action are

\[
 u=\frac{1-\sqrt5}{2},\qquad
 \tau=\frac1{1-u}=\frac{\sqrt5-1}{2}.                       \tag{5.3}
\]

Both strict sector comparisons hold.  With `U=0` and `D=1`, the
left-preconditioned defect is exactly zero, but `tau` remains bounded away
from zero.

This example can also satisfy the complete two-sided radical algebra and
all four scalar P/O conclusions.  On the global basis `(p,O,P,e,o)`, put

\[
 W=\begin{bmatrix}
 0&0&0&-1&0\\
 0&0&0& 1&0\\
 0&0&0& 0&0\\
 -1&1&0&1&0\\
 0&0&0&0&2
 \end{bmatrix}.                                               \tag{5.4}
\]

The compression to `(p,e,o)` is (5.1).  Moreover,

\[
 K_{\rm global}=p+O+P
\]

is a two-sided radical, while, for `R=O+P`,

\[
 W(O,O)=W(O,P)=W(P,O)=W(P,P)=W(R,R)=0.                       \tag{5.5}
\]

Nevertheless,

\[
 W(e,R)=1,\qquad W(e,p)=-1.                                  \tag{5.6}
\]

Thus `W(p,p)=W(R,R)=0=o(d_8)` for any positive sequence `d_8->0`, but the
residual column and `tau` do not decay.  Polarization within
`span(O,P)` remains identically zero and cannot recover the missing row
against `e`.  The counterexample does not refute a source-specific sampling
window theorem or another source-specific operator argument.  It proves only
that the existing scalar P/O identities and their polarization cannot supply
the missing graph-dual action bound.  The sampling-window theorem above is
one explicit sufficient route to that bound.
