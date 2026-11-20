# Log-feature capture and central/odd alignment reduction

## 0. Status and claim boundary

This note isolates one common finite-dimensional approximation problem behind
the central-band obstruction and the odd-pole obstruction in the direct
Xi--prolate--Weil bridge.  Its conclusions are exact identities, explicit
Taylor estimates, and conditional reductions.

The new observation is limited but useful.  On the logarithmic physical
interval, a space containing the projections of the first `r` monomials
captures the Fourier evaluation vectors in the central band with a completely
explicit factorial tail.  The same space captures the odd pole
`sinh(x/2)` with a factorial tail when `r` is proportional to the logarithmic
length.  Thus one source-angle theorem at squared scale

\[
 o\!\left({L\over\lambda}\right)                       \tag{0.1}
\]

would remove both *necessary low-feature obstructions*.  Through the admitted
full-source right inverse, a sufficient source-side target for that angle is

\[
 \left\|(I-P_F)B_XP_{V_r}\right\|^2
 =o\!\left({L\over\lambda^3}\right).                  \tag{0.2}
\]

Neither (0.1) nor (0.2) is proved here for the prescribed prolate source
family.  In particular, central-band capture does not control the exterior
part of the full signed multiplier defect.  This note proves no actual
source-tail estimate, no full physical weighted-capture estimate, no signed
sector floor, no equation (5.2) of `DIRECT_RH_ATTACK.md`, no locally uniform
determinant convergence, and no Riemann-hypothesis conclusion.  The repository
state remains `P0_INVALIDATED`.

## 1. Locked conventions

Put

\[
 \ell=\log\lambda,\qquad L=2\ell,\qquad
 I_\lambda=[-\ell,\ell]=[-L/2,L/2].                   \tag{1.1}
\]

The physical space uses Lebesgue measure in logarithmic coordinates,
equivalently `du/u` before taking logarithms, and all physical functions are
extended by zero.  The Fourier convention and Plancherel measure are

\[
 \widehat f(t)=\int_{I_\lambda}f(x)e^{-itx}\,dx,
 \qquad d\nu(t)={dt\over2\pi}.                        \tag{1.2}
\]

Thus the Fourier sign in (1.2) is fixed.  Inversion is reflection,
`Jf(x)=f(-x)`.  The exact complete multiplier is

\[
 m_\lambda(t)=2\theta'(t)-2
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).               \tag{1.3}
\]

The minus sign on the prime block is mandatory, and every prime power at the
inclusive endpoint `n<=lambda^2` is retained.  No list of zeta zeros and no
global Weil-positivity hypothesis is admitted.

On inversion parity `epsilon=+1,-1`, the pole term is

\[
 2\epsilon|p_\epsilon\rangle\langle p_\epsilon|,
 \qquad p_+(x)=\cosh(x/2),\quad p_-(x)=\sinh(x/2).     \tag{1.4}
\]

In particular, the odd pole has the negative sign.  A Fourier residue class
is not substituted for inversion parity.

The prolate source functions live on the distinct interval
`[-lambda,lambda]`, with Lebesgue measure and zero extension.  Their locked
source normalization, the zero-integral correction, and the actual source
Gram are retained.  If `C` synthesizes the corrected source columns, then

\[
 P_F=C(C^*C)^\dagger C^*,\qquad F=\operatorname {ran}C. \tag{1.5}
\]

Replacing `C^*C` by the identity without an orthonormality proof is rejected.
Unit-normalizing the distinguished combined source changes its limiting
scalar and is also rejected.

## 2. The compressed central-band operator

Let `X` be any declared finite-dimensional subspace of
`L^2(I_lambda,dx)`, and let `P_X` be its orthogonal projector.  For real `t`,
put

\[
 e_t(x)=e^{itx},\qquad b_t=P_Xe_t.                     \tag{2.1}
\]

The sign in `e_t` is the one dual to the minus sign in (1.2).  Fix the
physical central-band range `0<delta<pi/2` and define

\[
 B_\delta=[-\delta/L,\delta/L],\qquad
 T_{B_\delta}=\int_{B_\delta}
       |b_t\rangle\langle b_t|\,{dt\over2\pi}.        \tag{2.2}
\]

This is the exact compression to `X` of the multiplier
`1_(B_delta)`.  It is positive semidefinite and

\[
 \operatorname {tr}T_{B_\delta}
 =\int_{B_\delta}\|b_t\|^2{dt\over2\pi}
 \leq {\delta\over\pi},                              \tag{2.3}
\]

because `||b_t||^2<=||e_t||^2=L`.

For an integer `r>=1`, let `Pi_(r-1)` be the polynomials of degree strictly
less than `r`, restricted to `I_lambda`, and put

\[
 V_r=\operatorname {ran}\bigl(P_X|_{\Pi_{r-1}}\bigr)
 \subseteq X.                                         \tag{2.4}
\]

The dimension of `V_r` may be smaller than `r`; no rank assertion is being
made.  Write `P_V=P_(V_r)` and

\[
 \tau_r=\operatorname {tr}
 \bigl((I-P_V)T_{B_\delta}(I-P_V)\bigr).              \tag{2.5}
\]

### Theorem 2.1 (factorial central-band tail)

For every finite `X`, every `0<delta<pi/2`, and every integer `r>=1`,

\[
 \boxed{
 \tau_r\leq {\delta\over\pi}
 { (\delta/2)^{2r}\over(2r+1)^2(r!)^2}.}              \tag{2.6}
\]

In particular, the weaker bound

\[
 \tau_r\leq {\delta\over\pi}
 { (\delta/2)^{2r}\over(r!)^2}                        \tag{2.7}
\]

also holds.

**Proof.**  For `t in B_delta`, the Taylor polynomial

\[
 s_{r,t}(x)=\sum_{j=0}^{r-1}{(itx)^j\over j!}          \tag{2.8}
\]

has degree less than `r`, so `P_Xs_(r,t)` lies in `V_r`.  Taylor's integral
remainder on the real line gives

\[
 |e^{itx}-s_{r,t}(x)|\leq {|tx|^r\over r!}.           \tag{2.9}
\]

Since both `P_X` and `I-P_V` are contractions,

\[
 \|(I-P_V)b_t\|^2
 \leq { |t|^{2r}\over(r!)^2}
       \int_{-L/2}^{L/2}|x|^{2r}\,dx.                 \tag{2.10}
\]

Integrating (2.10) over `B_delta`, and using

\[
 \int_{-L/2}^{L/2}|x|^{2r}\,dx
 ={L(L/2)^{2r}\over2r+1},\qquad
 \int_{-\delta/L}^{\delta/L}|t|^{2r}{dt\over2\pi}
 ={(\delta/L)^{2r+1}\over\pi(2r+1)},                 \tag{2.11}
\]

gives (2.6).  Equation (2.7) follows by discarding
`(2r+1)^(-2)`.  `square`

This theorem concerns a target feature space `V_r`.  It does not say that
the prescribed finite prolate source range captures `V_r`.

## 3. Angle-to-trace conversion

Let `K` be a declared captured subspace of `X`, put

\[
 H=K^\perp,\qquad P_H=I-P_K,\qquad
 \alpha_r=\|P_HP_V\|.                                 \tag{3.1}
\]

Thus `alpha_r` is the largest uncaptured component of a unit vector in
`V_r`; a column count or a rank upper bound does not estimate it.

### Theorem 3.1 (central trace from feature angle)

With the notation above,

\[
 \boxed{
 \operatorname {tr}(P_HT_{B_\delta}P_H)
 \leq
 \left(\alpha_r\sqrt{\delta/\pi}+\sqrt{\tau_r}\right)^2.} \tag{3.2}
\]

**Proof.**  Since `T_(B_delta)>=0`, the left side of (3.2) is
`||P_H T_(B_delta)^(1/2)||_HS^2`.  Insert `P_V+(I-P_V)` before the square
root and use the Hilbert--Schmidt triangle inequality:

\[
 \begin{aligned}
 \|P_HT_{B_\delta}^{1/2}\|_{\rm HS}
 &\leq\|P_HP_VT_{B_\delta}^{1/2}\|_{\rm HS}
     +\|P_H(I-P_V)T_{B_\delta}^{1/2}\|_{\rm HS}\\
 &\leq\alpha_r
       \{\operatorname {tr}(P_VT_{B_\delta}P_V)\}^{1/2}
       +\tau_r^{1/2}\\
 &\leq\alpha_r\sqrt{\delta/\pi}+\tau_r^{1/2},
 \end{aligned}                                        \tag{3.3}
\]

where (2.3) was used in the last line.  Squaring proves (3.2).  `square`

The square in (3.2), including its cross term, is mandatory.  Estimating the
two pieces separately and silently dropping the cross term is invalid.

### 3.1 Exact weighted projector identities

For any positive semidefinite operator `D` on `X`,

\[
 \boxed{
 \operatorname {tr}(P_HDP_H)
 =\|P_HD^{1/2}\|_{\rm HS}^2
 =\operatorname {tr}D-\operatorname {tr}(P_KDP_K).}   \tag{3.4}
\]

Relative to any auxiliary projector `P`, the exact, pre-inequality
decomposition is

\[
 \begin{aligned}
 \|P_HD^{1/2}\|_{\rm HS}^2
 ={}&\|P_HPD^{1/2}\|_{\rm HS}^2
   +\|P_H(I-P)D^{1/2}\|_{\rm HS}^2\\
 &+2\operatorname {Re}\operatorname {tr}
 \bigl(D^{1/2}PP_H(I-P)D^{1/2}\bigr).                 \tag{3.5}
 \end{aligned}
\]

The last term need not vanish and has no fixed sign.  Formula (3.2) is the
safe triangle majorant when `P=P_V`.

If `D=D_0+D_1` with `D_0,D_1>=0`, then additivity gives the different exact
split

\[
 \operatorname {tr}(P_HDP_H)
 =\operatorname {tr}(P_HD_0P_H)
 +\operatorname {tr}(P_HD_1P_H).                      \tag{3.6}
\]

For a nonnegative multiplier weight `d`, one may take
`D_0=T_(d 1_(B_delta))` and `D_1=T_(d 1_(B_delta^c))`.
Controlling the first summand does not control the second.

## 4. The source right-inverse reduction

Let

\[
 T:\mathcal H_0^{\rm ev}\longrightarrow X             \tag{4.1}
\]

be the full source arithmetic/parity map, where the source is even and has
zero Lebesgue integral.  Let `B_X:X->H_0^ev` be the admitted full-source right
inverse.  The locked bounds are

\[
 TB_X=I_X,\qquad
 \|T\|\leq{\lambda\over\sqrt2},\qquad
 \|B_X\|\leq\sqrt2\,\lambda M_\mu(\lambda),
 \quad M_\mu(\lambda)\leq2\lambda.                   \tag{4.2}
\]

Let `F` be the corrected finite prolate source space with projector (1.5),
and set

\[
 K=\operatorname {ran}(TP_F),\qquad H=K^\perp.         \tag{4.3}
\]

### Theorem 4.1 (right-inverse feature tail)

Define

\[
 \varepsilon_{F,V}
 =\|(I-P_F)B_XP_V\|.                                  \tag{4.4}
\]

Then

\[
 \boxed{
 \alpha_r
 \leq\|T(I-P_F)B_XP_V\|
 \leq{\lambda\over\sqrt2}\,\varepsilon_{F,V}.}      \tag{4.5}
\]

**Proof.**  Since `P_H` annihilates `ran(TP_F)`, for `v in V_r`,

\[
 P_Hv=P_HTB_Xv=P_HT(I-P_F)B_Xv.                       \tag{4.6}
\]

Taking the operator norm over unit `v in V_r`, dropping the contraction
`P_H`, and applying (4.2) proves (4.5).  `square`

Combining (3.2), (4.5), and (2.6) gives the entirely explicit conditional
bound

\[
 \boxed{
 \operatorname {tr}(P_HT_{B_\delta}P_H)
 \leq\left{
 {\lambda\over\sqrt2}\varepsilon_{F,V}
       \sqrt{\delta/\pi}
 +\sqrt{{\delta\over\pi}}
 { (\delta/2)^r\over(2r+1)r!}
 \right}^2.}                                         \tag{4.7}
\]

For fixed `delta` and any `r` growing linearly with `L`, the factorial term
is negligible relative to `L/lambda`.  Consequently the qualitative source
target

\[
 \boxed{
 \varepsilon_{F,V}^2=o(L/\lambda^3)}                  \tag{4.8}
\]

would imply

\[
 \alpha_r^2=o(L/\lambda),\qquad
 \operatorname {tr}(P_HT_{B_\delta}P_H)=o(L/\lambda). \tag{4.9}
\]

These are implications, not estimates established for the actual prolate
space.

### 4.1 Strict constants, not big-O labels

For the cap-free even defect, put

\[
 d_\nu(t)=(\nu L-w(t))_+,qquad
 A_{\lambda,\nu,\delta}
 =\operatorname*{ess\,inf}_{t\in B_\delta}d_\nu(t).  \tag{4.10}
\]

If `A_(lambda,nu,delta)>0`, the desired strict even floor necessarily
requires

\[
 \operatorname {tr}(P_HT_{B_\delta}P_H)
 <{(\nu-\mu)L\over A_{\lambda,\nu,\delta}}.           \tag{4.11}
\]

Thus the exact feature-tail target supplied by this route is

\[
 \boxed{
 \left{
 {\lambda\over\sqrt2}\varepsilon_{F,V}
       \sqrt{\delta/\pi}
 +\sqrt{{\delta\over\pi}}
 { (\delta/2)^r\over(2r+1)r!}
 \right}^2
 <{(\nu-\mu)L\over A_{\lambda,\nu,\delta}}.}         \tag{4.12}
\]

If an explicit theorem gave `A_(lambda,nu,delta)>=a_0 lambda` with
`a_0>0`, then, after reserving a declared part of the right side for the
factorial and cross terms, a bound
`epsilon_(F,V)^2 <= C L/lambda^3` could work only when the explicit constant
`C` is small enough relative to `a_0`, `delta`, `nu-mu`, and that reserve.
The notation `O(L/lambda^3)` alone supplies neither a strict inequality nor a
starting threshold and cannot be reported as a pass.

Moreover, (4.12) addresses only the necessary central-band obstruction.  It
does not upper-bound
`tr(P_H T_(d_nu 1_(B_delta^c)) P_H)` and therefore does not prove the full
even estimate.

## 5. The same feature space and the odd pole

Let

\[
 p_-(x)=\sinh(x/2),\qquad p_X=P_Xp_-,\qquad
 p=P_Hp_X.                                             \tag{5.1}
\]

The exact ambient physical norm is

\[
 S_L:=\|p_-\|^2
 =\sinh(L/2)-L/2<\lambda/2.                            \tag{5.2}
\]

For `r>=1`, let

\[
 q_r(x)=\sum_{\substack{j<r\\j\text{ odd}}}
                  {(x/2)^j\over j!},
 \qquad v_r=P_Xq_r\in V_r,                            \tag{5.3}
\]

and define the physical Taylor error

\[
 \epsilon_{p,r}=\|p_--q_r\|_{L^2(I_\lambda)}.         \tag{5.4}
\]

### Theorem 5.1 (odd-pole factorial tail and angle bound)

For every integer `r>=1`,

\[
 \boxed{
 \epsilon_{p,r}^2
 \leq {L\lambda\over2r+1}
       { (L/4)^{2r}\over(r!)^2}.}                     \tag{5.5}
\]

Moreover,

\[
 \boxed{
 \|p\|^2
 \leq\left\{
 \alpha_r\sqrt{S_L}+\epsilon_{p,r}\right\}^2.}      \tag{5.6}
\]

**Proof.**  Taylor's theorem and the bound on every derivative of
`sinh(x/2)` on `I_lambda` give

\[
 |p_-(x)-q_r(x)|
 \leq e^{|x|/2}{(|x|/2)^r\over r!}.                  \tag{5.7}
\]

Since `e^|x|<=e^(L/2)=lambda`, direct integration gives

\[
 \epsilon_{p,r}^2
 \leq{\lambda\over(r!)^2}
 \int_{-L/2}^{L/2}(|x|/2)^{2r}\,dx
 ={L\lambda\over2r+1}{(L/4)^{2r}\over(r!)^2},        \tag{5.8}
\]

which is (5.5).  Next,

\[
 \begin{aligned}
 \|p\|
 &\leq\|P_HP_Vp_X\|+\|P_H(I-P_V)p_X\|\\
 &\leq\alpha_r\|P_Vp_X\|+\epsilon_{p,r}\\
 &\leq\alpha_r\sqrt{S_L}+\epsilon_{p,r}.
 \end{aligned}                                        \tag{5.9}
\]

Here `(I-P_V)p_X=(I-P_V)P_X(p_--q_r)` because
`P_Xq_r=v_r in V_r`.  Thus its norm is at most `epsilon_(p,r)`, while
`||P_Vp_X||<=||p_X||<=sqrt(S_L)`.  Squaring proves (5.6).  `square`

Take the deterministic feature order

\[
 r_L=\lceil3L/2\rceil.                                 \tag{5.10}
\]

The elementary factorial bound `r!>=(r/e)^r`, together with
`e/6<1/2`, gives

\[
 \boxed{
 \epsilon_{p,r_L}^2
 \leq {L\lambda\over2r_L+1}2^{-2r_L}
 \leq L\exp\{(1/2-3\log2)L\}
 =L\lambda^{1-6\log2}.}                             \tag{5.11}
\]

In particular, `epsilon_(p,r_L)^2=o(L/lambda)`.  Combining (5.6) with
`S_L<lambda/2` shows that

\[
 \alpha_{r_L}^2=o(L/\lambda)
 \quad\Longrightarrow\quad
 \|P_HP_Xp_-\|^2=o(L).                                \tag{5.12}
\]

Thus the conditional source-tail scale (4.8), for this same `V_(r_L)`, also
implies the odd pole-leakage scale in (5.12).

For the shifted capped odd test, let

\[
 q=(c-\beta)L,\qquad h=(a-\beta)L,qquad
 M_\beta=qI-R\succeq hI,qquad h>0.                   \tag{5.13}
\]

Then

\[
 2\langle p,M_\beta^{-1}p\rangle
 \leq {2\|p\|^2\over h}.                             \tag{5.14}
\]

If `a-beta` is a fixed positive constant, (5.12) would make the right side
`o(1)` and hence strictly less than one eventually.  This implication still
depends on proving the actual feature angle and on establishing the declared
positive capped base.  It is not an odd signed-floor theorem.

## 6. Exact odd resolvent bookkeeping

Assume

\[
 0\preceq R\preceq(q-h)I,\qquad 0<h<q,
 \qquad M_\beta=qI-R\succeq hI,                       \tag{6.1}
\]

and put

\[
 \mu_0=\|p\|^2,\qquad
 \rho_j=\langle p,R^jp\rangle.                       \tag{6.2}
\]

For every integer `k>=0`, define

\[
 \boxed{
 U_k=2\left(
 \sum_{j=0}^{k-1}{\rho_j\over q^{j+1}}
 +{\rho_k\over hq^k}\right),}                        \tag{6.3}
\]

where the sum is empty for `k=0`.

### Theorem 6.1 (exact moment expansion and remainders)

For every `k>=0`,

\[
 \begin{aligned}
 2\langle p,M_\beta^{-1}p\rangle
 ={}&2\sum_{j=0}^{k-1}{\rho_j\over q^{j+1}}\\
 &+{2\over q^k}
 \langle p,R^k(qI-R)^{-1}p\rangle,                   \tag{6.4}
 \end{aligned}
\]

and

\[
 \boxed{
 U_k-2\langle p,M_\beta^{-1}p\rangle
 ={2\over hq^k}
 \langle p,R^k\{(q-h)I-R\}(qI-R)^{-1}p\rangle
 \geq0.}                                              \tag{6.5}
\]

The hierarchy is monotone because

\[
 \boxed{
 U_k-U_{k+1}
 ={2\over hq^{k+1}}
 \langle p,R^k\{(q-h)I-R\}p\rangle\geq0.}           \tag{6.6}
\]

Writing

\[
 \mathcal L_0=2\langle p,M_\beta^{-1}p\rangle,
 \qquad \gamma_0={q-h\over q}<1,                     \tag{6.6a}
\]

the exact remainder (6.5) has the geometric corollary

\[
 \boxed{
 0\leq U_k-\mathcal L_0
 \leq {2\mu_0\over h}\gamma_0^{k+1}.}                 \tag{6.6b}
\]

Indeed, for every spectral value `0<=r<=q-h`,

\[
 {q-h-r\over q-r}\leq{q-h\over q}=\gamma_0,
 \qquad {r^k\over q^k}\leq\gamma_0^k.                \tag{6.6c}
\]

If the stronger bound `R<=gamma q I` holds for some `0<=gamma<1`, then the
exact last term in (6.4) has the geometric majorant

\[
 \boxed{
 0\leq {2\over q^k}
 \langle p,R^k(qI-R)^{-1}p\rangle
 \leq {2\mu_0\gamma^k\over q(1-\gamma)}.}            \tag{6.7}
\]

**Proof.**  The finite resolvent identity

\[
 (qI-R)^{-1}
 =\sum_{j=0}^{k-1}{R^j\over q^{j+1}}
 +{R^k\over q^k}(qI-R)^{-1}                           \tag{6.8}
\]

gives (6.4).  Subtracting (6.4) from (6.3), using commutativity of functions
of `R`, gives (6.5); subtracting consecutive definitions gives (6.6).  Under
the stronger hypothesis, `||R^k||<=(gamma q)^k` and
`||(qI-R)^(-1)||<=1/(q(1-gamma))`, which proves (6.7).  `square`

The strict odd floor requires the shifted load to be strictly less than one.
Equality is singular.  A big-O estimate without constants cannot replace
that strict comparison.

### 6.1 Positive excess must act on the pole axis

Let `A_+>=0` be retained positive excess and let `p!=0`.  If

\[
 M_\beta+A_+-2|p\rangle\langle p|\succ0,              \tag{6.9}
\]

then testing the unit vector `p/||p||` gives the necessary inequality

\[
 \boxed{
 \langle p,A_+p\rangle
 >2\|p\|^4-\langle p,M_\beta p\rangle.}               \tag{6.10}
\]

Only the positive-excess component on the pole axis appears.  A large norm in
a transverse direction cannot satisfy (6.10).  More precisely, with

\[
 S=M_\beta^{-1/2}A_+M_\beta^{-1/2},\qquad
 z=M_\beta^{-1/2}p,                                   \tag{6.11}
\]

the exact compensated load is

\[
 2\langle p,(M_\beta+A_+)^{-1}p\rangle
 =2\|z\|^2-2\langle z,S(I+S)^{-1}z\rangle.            \tag{6.12}
\]

Neither `||A_+||` alone nor an unshifted positivity test proves the requested
positive floor.

### 6.2 Spectral alignment of the positive excess

For `sigma>0`, let

\[
 E^S_{<\sigma}=\mathbf1_{[0,\sigma)}(S),\qquad
 E^S_{\leq\sigma}=\mathbf1_{[0,\sigma]}(S).           \tag{6.13}
\]

The open and closed endpoints in (6.13) serve different directions of the
estimate and cannot be interchanged.

### Theorem 6.2 (positive-excess alignment upper bound and converse)

Suppose `U_k` is any certified moment upper bound from (6.3), so that
`2||z||^2<=U_k`, and put

\[
 a_\sigma=\|E^S_{<\sigma}z\|^2.                      \tag{6.13a}
\]

Then

\[
 \boxed{
 2\langle p,(M_\beta+A_+)^{-1}p\rangle
 \leq2\left\{a_\sigma+{\|z\|^2-a_\sigma\over1+\sigma}\right\}
 \leq {U_k+2\sigma a_\sigma\over1+\sigma}.}          \tag{6.14}
\]

Conversely, the strict shifted load condition

\[
 2\langle p,(M_\beta+A_+)^{-1}p\rangle<1              \tag{6.15}
\]

necessarily implies

\[
 \boxed{
 \|E^S_{\leq\sigma}z\|^2<{1+\sigma\over2}.}          \tag{6.16}
\]

**Proof.**  The spectral theorem gives

\[
 2\langle p,(M_\beta+A_+)^{-1}p\rangle
 =2\int_{[0,\infty)}{1\over1+s}\,d\|E^S_s z\|^2.    \tag{6.17}
\]

On `[0,sigma)` use `(1+s)^(-1)<=1`; on `[sigma,infinity)` use
`(1+s)^(-1)<=1/(1+sigma)`.  Hence

\[
 \begin{aligned}
 2\langle p,(M_\beta+A_+)^{-1}p\rangle
 &\leq2\|E^S_{<\sigma}z\|^2
   +{2\over1+\sigma}\|(I-E^S_{<\sigma})z\|^2\\
 &= {2\|z\|^2+2\sigma\|E^S_{<\sigma}z\|^2
       \over1+\sigma},
 \end{aligned}                                        \tag{6.18}
\]

and `2||z||^2<=U_k` proves (6.14).  In the other direction,
`(1+s)^(-1)>=1/(1+sigma)` on the closed interval `[0,sigma]`, so

\[
 2\langle p,(M_\beta+A_+)^{-1}p\rangle
 \geq {2\over1+\sigma}\|E^S_{\leq\sigma}z\|^2.       \tag{6.19}
\]

Combining (6.19) with the strict inequality (6.15) proves (6.16).  `square`

Thus an upper-bound proof must control the low-excess component on the open
interval `[0,sigma)`, while every successful load automatically satisfies a
closed-interval `[0,sigma]` necessity.  An eigenvector at the threshold
belongs to the favorable high part of (6.14) but remains part of the
necessary low-excess mass in (6.16).

## 7. A spectral-alignment alternative and its endpoints

The polynomial space `V_r` is one constructive feature space.  For reference,
there is also an exact spectral formulation for any positive operator.

### Theorem 7.1 (spectral-alignment upper and converse bounds)

Let `D>=0` act on finite-dimensional `X`, let `H` be any subspace, and fix
`sigma>0`.  With spectral projections

\[
 E_{\leq\sigma}=\mathbf1_{[0,\sigma]}(D),\qquad
 E_{>\sigma}=\mathbf1_{(\sigma,\infty)}(D),           \tag{7.1}
\]

one has the upper bound

\[
 \boxed{
 \operatorname {tr}(P_HDP_H)
 \leq\operatorname {tr}(DE_{\leq\sigma})
 +\|D\|\,\|P_HE_{>\sigma}\|_{\rm HS}^2.}            \tag{7.2}
\]

With

\[
 E_{\geq\sigma}=\mathbf1_{[\sigma,\infty)}(D),       \tag{7.3}
\]

one has the converse bound

\[
 \boxed{
 \operatorname {tr}(P_HDP_H)
 \geq\sigma\,\|P_HE_{\geq\sigma}\|_{\rm HS}^2.}    \tag{7.4}
\]

**Proof.**  In an orthonormal eigenbasis `Du_j=d_ju_j`,

\[
 \operatorname {tr}(P_HDP_H)
 =\sum_jd_j\|P_Hu_j\|^2.                              \tag{7.5}
\]

For `d_j<=sigma`, bound the projection factor by one; for `d_j>sigma`, bound
`d_j` by `||D||`.  This proves (7.2).  Restricting (7.5) to
`d_j>=sigma` and bounding those eigenvalues below by `sigma` proves (7.4).
`square`

The endpoint conventions are deliberate.  The upper bound uses the low
interval `[0,sigma]` and its complement `(sigma,infinity)`.  The converse
uses the high interval `[sigma,infinity)` and its complement `[0,sigma)`.
Dropping an eigenspace at the exact threshold from the converse is invalid.

Applied to `D=T_(B_delta)`, (7.4) says that a small central trace forces
capture, in Hilbert--Schmidt angle, of every central-band eigenvector whose
eigenvalue is at least `sigma`.  It does not identify the prescribed source
range with that spectral space.

## 8. Exact rational regressions and countermodels

The following finite models use exact rational data.  They are theorem
regressions and logical countermodels, not physical Xi--prolate matrices.

### 8.1 Sharp feature-angle regression

Take `X=R^2`,

\[
 D=\begin{pmatrix}1&0\\0&0\end{pmatrix},\qquad
 V=\operatorname {span}(e_1),\qquad
 K=\operatorname {span}\{(3/5,4/5)\}.                 \tag{8.1}
\]

Then `H` is spanned by `(-4/5,3/5)`,

\[
 \alpha=\|P_HP_V\|={4\over5},\qquad
 \tau=0,
 \qquad\operatorname {tr}(P_HDP_H)={16\over25}.       \tag{8.2}
\]

Thus the abstract angle bound with `tr(D)=1` is equality.  Replacing an angle
estimate by a rank statement would not recover `16/25`.

### 8.2 Spectral-threshold endpoint regression

Take

\[
 D=\operatorname {diag}(1,0),\qquad \sigma=1,
 \qquad H=X.                                          \tag{8.3}
\]

Then `tr(P_HDP_H)=1` and
`||P_H 1_[1,infinity)(D)||_HS^2=1`, so (7.4) is equality.  The incorrect
projection `1_(1,infinity)(D)` is zero and loses the entire threshold
eigenspace.

### 8.3 Central capture does not control the exterior

For any rational `M>0`, take

\[
 T_B=\operatorname {diag}(1,0),\qquad
 D_{\rm ext}=\operatorname {diag}(0,M),\qquad
 K=\operatorname {span}(e_1).                         \tag{8.4}
\]

Then

\[
 \operatorname {tr}(P_HT_BP_H)=0,
 \qquad
 \operatorname {tr}\{P_H(T_B+D_{\rm ext})P_H\}=M.   \tag{8.5}
\]

Perfect central-band capture therefore supplies no upper bound on the full
weighted defect.

### 8.4 Transverse positive excess cannot repair the pole axis

Take

\[
 M_\beta=I_2,
 \qquad p=e_1,
 \qquad A_+=a|e_2\rangle\langle e_2|,
 \quad a\geq0.                                        \tag{8.6}
\]

Then the pole-axis condition (6.10) would require `0>1`, and indeed

\[
 M_\beta+A_+-2|p\rangle\langle p|
 =\operatorname {diag}(-1,1+a)                        \tag{8.7}
\]

is never positive.  An arbitrarily large transverse `a` is irrelevant.

### 8.5 Positive-excess spectral-window endpoints

Take

\[
 \sigma=1,\qquad S=\operatorname {diag}(0,1),\qquad
 E^S_{<1}=\operatorname {diag}(1,0),\qquad
 E^S_{\leq1}=I_2.                                    \tag{8.7a}
\]

For `z=(1/4,1/4)` and `U_k=2||z||^2=1/4`,

\[
 a_1={1\over16},\qquad
 \|E^S_{\leq1}z\|^2={1\over8},\qquad
 2\langle z,(I+S)^{-1}z\rangle={3\over16}.           \tag{8.7b}
\]

The upper bound (6.14) is exact:

\[
 {U_k+2a_1\over2}={3\over16}.                         \tag{8.7c}
\]

For `z=(1/2,1/2)`, the load is `3/4<1` and the closed-window mass is
`1/2<1`, as required by (6.16).  At the endpoint, however, `z=(0,1)` has

\[
 \|E^S_{<1}z\|^2=0,
 \qquad\|E^S_{\leq1}z\|^2=1,
 \qquad2\langle z,(I+S)^{-1}z\rangle=1.              \tag{8.7d}
\]

Thus the threshold eigendirection is correctly excluded from the sufficient
low window but included in the necessary low window; its load is the rejected
singular boundary.

### 8.6 The actual source Gram cannot be discarded

Let

\[
 C=\begin{pmatrix}1&1\\0&1\end{pmatrix},\qquad
 C^*C=\begin{pmatrix}1&1\\1&2\end{pmatrix}.          \tag{8.8}
\]

The columns span `R^2`, so

\[
 C(C^*C)^{-1}C^*=I_2.                                 \tag{8.9}
\]

Replacing the source Gram by the identity instead gives

\[
 CC^*=\begin{pmatrix}2&1\\1&1\end{pmatrix}\ne I_2. \tag{8.10}
\]

This is an exact normalization failure, not a harmless coordinate change.

### 8.7 Strict-boundary regression

On `X=H=R`, take `D=[1]` and a required threshold equal to one.  Then
`tr(P_HDP_H)=1`; equality does not satisfy a strict `<1` obligation.  A
nonpositive complementary gap or a load exactly one cannot be reported as a
pass.

## 9. Exact next obligations

Any continuation through this reduction must establish all of the following
on one common unbounded schedule.

1. Prove, for the actual corrected and source-normalized prolate family, the
   explicit strict feature-tail inequality (4.12), or a sharper direct angle
   theorem.  The qualitative scale (4.8), a column count, or a rank statement
   is not itself a strict certificate.
2. Bound the full exterior weighted defect in (3.6), preserving the combined
   archimedean-minus-prime cancellation before absolute values.  The minus
   prime sign and every prime power `n<=lambda^2` remain inside the weight.
3. Establish the declared capped positive base in the odd sector and either
   prove a strict shifted load below one using (6.4)--(6.7), or prove the exact
   shifted one-direction Schur reserve.  Positive excess must meet the
   pole-axis necessity (6.10).
4. Transfer the resulting estimates to strict even and odd signed sector
   floors and then prove the residual--gap and projection limits in equation
   (5.2) of `DIRECT_RH_ATTACK.md`.
5. Separately prove locally uniform convergence of the correctly normalized
   characteristic functions.  Real-axis eigenvalue agreement is not a
   substitute for determinant convergence.

No item in this list is discharged by the present note.  No source-tail
scale, central Taylor capture by the actual prolate range, odd-pole capture,
signed floor, determinant limit, or RH statement is promoted from a
conditional reduction to a theorem.  The only allowed status here is
`P0_INVALIDATED`.
