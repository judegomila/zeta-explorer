# Odd multiplier-dangerous exterior-coframe reduction

## 0. Claim boundary and outcome

This note combines two exact constructions which were previously used with
different odd high spaces:

1. the complete source multiplier, with the negative odd pole retained as
   one explicit direction, gives a far block with a strict positive floor;
2. the arbitrary-vector odd Mobius lift represents the Schur complement by
   one canonical exterior-tail operator.

The resulting retained space has dimension `exp(O(lambda))` on the locked
schedule.  This improves the honest cost of the raw-Fourier odd Feshbach
space, which was `exp(O(lambda*log(lambda)))`, without changing the sign
claim.  The new constant `beta_(lambda,-)^mv` is positive exactly when the
complete shifted odd matrix `Q_- - U I` is positive.  No lower bound for that
constant is proved here.

Every arithmetic formula below uses the source Fourier sign, the centered
logarithmic interval, the negative odd pole, the minus sign on the prime
block in source equation (3.19), and every prime power through the inclusive
endpoint `n<=lambda^2`.  No zero table, global Weil positivity, or stored
matrix eigenvector is used.  This note proves neither the odd sign on an
unbounded schedule, equation (5.2) of `DIRECT_RH_ATTACK.md`, locally uniform
determinant convergence, nor the Riemann hypothesis.  The formal project
state remains `P0_INVALIDATED`.

## 1. Pole-first complete-symbol dangerous space

Put

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},
 \qquad N=2^{2400p^2},\qquad L=2\log\lambda,           \tag{1.1}
\]

and let `V=E_N^-`.  Let `U>=0` be the live source-normalized Ritz upper
shift and set

\[
 B_-=Q_- - U I_V.                                      \tag{1.2}
\]

The complete real-axis multiplier is

\[
 m_\lambda(t)=
 \operatorname {Re}\psi\!\left({1\over4}+{it\over2}\right)-\log\pi
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).                \tag{1.3}
\]

For finite parameters `g>delta>0`, define

\[
 v(t)=[g+U-m_\lambda(t)]_+,
 \qquad T_v=C_\lambda^*\mathcal F^*M_v\mathcal F C_\lambda. \tag{1.4}
\]

After compression to `V`, the exact parity-multiplier identity is

\[
 \boxed{B_-=gI+T_a-T_v-2|p_N\rangle\langle p_N|,}
 \qquad p_N=P_N\sinh(x/2),\qquad T_a\succeq0.          \tag{1.5}
\]

Thus the odd pole has not been discarded or assigned the even sign.
Its exact Fourier coefficients are nonzero for every nonzero mode, so
`p_N!=0` for `N>=1`.  Put

\[
 e={p_N\over\|p_N\|},\qquad P_0=I-|e\rangle\langle e|,
 \qquad R=P_0T_vP_0\big|_{e^\perp}.                    \tag{1.6}
\]

Let

\[
 \Pi=1_{[g-\delta,\infty)}(R),\qquad
 \mathcal Y_0=\operatorname {Ran}\Pi,\qquad
 \mathcal Y^-=\mathbb Ce\oplus\mathcal Y_0,
 \qquad \mathcal F^-=(\mathcal Y^-)^\perp.           \tag{1.7}
\]

This is the orthogonal pole-first version of the rank-one odd construction
in Section 5.1 of `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md`.

### Theorem 1.1 (odd far floor and retained rank)

Relative to `V=mathcal Y^- direct-sum mathcal F^-`, write

\[
 B_-=
 \begin{bmatrix}D&\Gamma^*\\ \Gamma&H\end{bmatrix}.   \tag{1.8}
\]

Then

\[
 \boxed{H\succeq\delta I_{\mathcal F^-}}              \tag{1.9}
\]

and

\[
 \boxed{
 \dim\mathcal Y^-
 \leq1+{L\,\Phi_\lambda(U,g)\over2\pi(g-\delta)},
 \qquad
 \Phi_\lambda(U,g)=
 \int_{\mathbb R}[g+U-m_\lambda(t)]_+\,dt.}           \tag{1.10}
\]

Both conclusions are uniform in the much larger outer Fourier cutoff `N`.

**Proof.**  If `f in mathcal F^-`, then `f perpendicular p_N` and
`f in ker(Pi)`.  Hence the pole term in (1.5) vanishes on `f` and

\[
 \langle f,T_vf\rangle=\langle f,Rf\rangle
 <(g-\delta)\|f\|^2.
\]

Dropping only the positive term `T_a` from (1.5) proves (1.9).  Since
`R>=0`, compression monotonicity of the trace and the exact concentration
trace give

\[
 (g-\delta)\dim\mathcal Y_0
 \leq\operatorname {tr}R
 \leq\operatorname {tr}T_v
 ={L\over2\pi}\Phi_\lambda(U,g).
\]

Adding the pole direction proves (1.10).  \(\square\)

There is no hidden unspecified finite constant in the cost bound.  Put

\[
 \Sigma_\lambda=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n},
 \qquad
 A_\lambda(U,g)=g+U+2\Sigma_\lambda-\psi(1/4)+\log\pi. \tag{1.11}
\]

The exact digamma comparison gives

\[
 \Phi_\lambda(U,g)\leq
 \begin{cases}
 0,&A_\lambda(U,g)\leq0,\\[1mm]
 \sqrt{e^{2A_\lambda(U,g)}-1}
 -\arctan\sqrt{e^{2A_\lambda(U,g)}-1},&A_\lambda(U,g)>0.
 \end{cases}                                          \tag{1.12}
\]

With

\[
 C_\psi=1+9.22022
 \left({3\over0.8476836}\right)^3e^{-3},              \tag{1.13}
\]

the pinned Fiori--Kadiri--Swidinsky estimate gives

\[
 \Sigma_\lambda\leq C_\psi(2\lambda-1).              \tag{1.14}
\]

Choose `g=1` and `delta=1/2`.  On the admitted tail where `0<=U<=1`,
(1.10)--(1.14) give the completely explicit majorant

\[
 \boxed{
 \dim\mathcal Y^-
 \leq1+{L\over\pi}
 \exp\!\left(
 4C_\psi\lambda+2-2C_\psi-\psi(1/4)+\log\pi
 \right).}                                           \tag{1.15}
\]

In particular, `dim(mathcal Y^-)=exp(O(lambda))`.  The exact projector in
(1.7), not the magnitude envelope in (1.15), defines the retained space.

## 2. Exact odd Schur family

Because of (1.9), define for every `sigma>=0`

\[
 \mathsf E_\sigma^-y=
 \left(y,-(H+\sigma I)^{-1}\Gamma y\right),           \tag{2.1}
\]

\[
 \Sigma_\sigma^-
 =D+\sigma I-\Gamma^*(H+\sigma I)^{-1}\Gamma.         \tag{2.2}
\]

Block multiplication gives

\[
 (B_-+\sigma I)\mathsf E_\sigma^-y
 =i_{\mathcal Y^-}\Sigma_\sigma^-y.                  \tag{2.3}
\]

In particular,

\[
 \boxed{B_-\succ0\quad\Longleftrightarrow\quad
        \Sigma_0^-\succ0.}                            \tag{2.4}
\]

No norm estimate has replaced the high feedback in (2.2).

## 3. Canonical odd exterior operator on the smaller space

For every `v in V`, use the additive-even Mobius source, invisible
zero-integral central-hole correction, arithmetic transform, and physical
odd projection from Theorem 2.1 of
`notes/ODD_RADICAL_PARITY_SCHUR_REDUCTION.md`.  Denote the resulting global
two-sided radical by `K_v` and put

\[
 R_v=K_v-\widetilde v=(1-C_\lambda)K_v.                \tag{3.1}
\]

For `u in mathcal Y^-`, define

\[
 \langle u,T_{\rm ext}^{\mathcal Y^-}v\rangle
 =\mathcal W_Z(u,R_v).                                 \tag{3.2}
\]

The compact finite-Fourier transforms make the polarized zero series
absolutely convergent.  Radical cancellation therefore makes (3.2)
independent of the chosen admissible lift and gives

\[
 \boxed{
 T_{\rm ext}^{\mathcal Y^-}
 =-P_{\mathcal Y^-}Q_-\big|_V.}                       \tag{3.3}
\]

Combining (2.3) with (3.3) yields the exact all-shift identity

\[
 \boxed{
 \Sigma_\sigma^-
 = (\sigma-U)I_{\mathcal Y^-}
   -T_{\rm ext}^{\mathcal Y^-}\mathsf E_\sigma^-.}   \tag{3.4}
\]

The two minus signs in (3.3)--(3.4) restore the complete action of `Q_-`.
In particular, (3.4) retains the negative odd pole and the source
minus-prime block rather than turning either one into a positive term.

## 4. Sharp odd multiplier-dangerous coframe constant

Let `Delta_->0` be any fixed source-defined metric on `V`, and put

\[
 \mathcal D_\sigma^-=
 \left((\mathsf E_\sigma^-)^*\Delta_-^2
                    \mathsf E_\sigma^-\right)^{1/2}.  \tag{4.1}
\]

For the sign-only criterion one may take `Delta_-=I`.  Define

\[
 \boxed{
 \beta_{\lambda,-}^{\rm mv}
 =\inf_{\substack{\sigma\geq0\\y\in\mathcal Y^-\setminus\{0\}}}
 {\|(\sigma-U)y-
       T_{\rm ext}^{\mathcal Y^-}\mathsf E_\sigma^-y\|
  \over
  \|\Delta_-\mathsf E_\sigma^-y\|}.}                 \tag{4.2}
\]

### Theorem 4.1 (sharp reduced odd criterion)

At every fixed finite parameter,

\[
 \boxed{
 \beta_{\lambda,-}^{\rm mv}>0
 \quad\Longleftrightarrow\quad
 Q_--UI\succ0.}                                       \tag{4.3}
\]

With a singular shifted inverse assigned the extended value `+infinity`,

\[
 \boxed{
 (\beta_{\lambda,-}^{\rm mv})^{-1}
 =\sup_{\sigma\geq0}
 \|\Delta_-(B_-+\sigma I)^{-1}i_{\mathcal Y^-}\|.}   \tag{4.4}
\]

Consequently, under the hypotheses of the raw-high odd reduction,

\[
 \boxed{
 \beta_{\lambda,-}^{\rm mv}>0
 \quad\Longleftrightarrow\quad\vartheta_->0.}         \tag{4.5}
\]

The two constants use different retained spaces, but both are exact tests
of the same complete shifted odd matrix.

**Proof.**  Whenever the inverses exist, (2.3) gives

\[
 (B_-+\sigma I)^{-1}i_{\mathcal Y^-}
 =\mathsf E_\sigma^-(\Sigma_\sigma^-)^{-1}.           \tag{4.6}
\]

Equations (3.4) and (4.6) identify (4.2) with the reciprocal norm in
(4.4).  If `B_->0`, then every `Sigma_sigma^->0`.  The quotient in (4.2)
has a positive minimum on each compact `sigma` interval.  If

\[
 d=\|D\|,\qquad \gamma=\|\Gamma\|,
\]

then (1.9) gives

\[
 \lambda_{\min}(\Sigma_\sigma^-)
 \geq\sigma-d-{\gamma^2\over\sigma+\delta},
 \qquad
 \|\mathsf E_\sigma^-\|
 \leq\sqrt{1+{\gamma^2\over(\sigma+\delta)^2}}.      \tag{4.7}
\]

Thus the quotient tends to infinity as `sigma->infinity`, and its global
infimum is positive.

Conversely, if `B_-` is not positive, take
`sigma_0=max(0,-lambda_min(B_-))`.  Then `B_-+sigma_0 I` is singular while
`H+sigma_0 I>0`.  Exact Schur elimination makes
`Sigma_(sigma_0)^-` singular, and (3.4) forces the quotient in (4.2) to
vanish.  This proves (4.3)--(4.4).  Equation (4.5) follows from Theorem 4.1
of `notes/ODD_RADICAL_PARITY_SCHUR_REDUCTION.md`.  \(\square\)

## 5. Cancellation-preserving arithmetic form

Let

\[
 W(X)=\sum_{1<n\leq X}{\Lambda(n)\over\sqrt n},
 \qquad
 D_\lambda(t)=W(e^t)-2(e^{t/2}-1),                    \tag{5.1}
\]

and, for the reflected zero-extension translation `K_t`, put

\[
 C_{u,w}(t)=\langle u,K_tw\rangle.                    \tag{5.2}
\]

The exact normal form is

\[
 Q_-=c_*I+A_{\rm tail}-T_D,
 \qquad c_*=\psi(1/4)-\log\pi+4.                     \tag{5.3}
\]

It already contains the exact cancellation of the negative odd pole, the
continuous weighted-prime main density, and the first archimedean Levy
term.  Since `D_lambda(0)=0` and `C_(u,w)(L)=0`, Stieltjes integration by
parts gives

\[
\boxed{
\begin{aligned}
 \beta_{\lambda,-}^{\rm mv}
 =\inf_{\substack{\sigma\geq0\\
                   y\in\mathcal Y^-\setminus\{0\}}}
  \sup_{\substack{u\in\mathcal Y^-\\\|u\|=1}}
 {1\over\|\Delta_-\mathsf E_\sigma^-y\|}
 \Bigg|{}&(c_*+\sigma-U)\langle u,y\rangle
 +\mathfrak a_{\rm tail}(u,\mathsf E_\sigma^-y)\\
 &+\int_0^L D_\lambda(t)
       {d\over dt}C_{u,\mathsf E_\sigma^-y}(t)\,dt
 \Bigg|.
\end{aligned}}                                          \tag{5.4}
\]

The discrepancy integral has a plus sign: `T_D=int C dD=-int D C'`, while
`Q=c_*I+A_tail-T_D`.  A prime power at `n=lambda^2` remains in (5.1) even
though its endpoint correlation vanishes.  Formula (5.4) is an exact
inf--sup for the actual signed arithmetic orientation, not a positive lower
bound for it.

## 6. Odd continuous-discrepancy obstruction

The zero-discrepancy model obeys every hypothesis which controls
`D_lambda` only by its magnitude.  In that model

\[
 Q_\lambda^{\rm cont}=c_*I+A_{\rm tail},
 \qquad
 c_*=4-\gamma_E-\frac\pi2-3\log2-\log\pi<-1.          \tag{6.1}
\]

Fix `m>=1`, put `a=log(lambda)`, and use the exact odd Fourier space

\[
 \mathcal W_m^-=
 \operatorname {span}\{e_1^-,\ldots,e_m^-\}.          \tag{6.2}
\]

Every member of `mathcal W_m^-` vanishes at both endpoints.  For a unit
vector `f in mathcal W_m^-`, zero extension therefore belongs to
`H^1(R)` and

\[
 \|f'\|_2^2\leq{\pi^2m^2\over a^2},
 \qquad
 \|\tau_h\widetilde f-\widetilde f\|_2
 \leq |h|\,\|f'\|_2.                                  \tag{6.3}
\]

With the exact finite second moment

\[
 \sigma_{\rm tail}^2=
 \int_{\mathbb R}h^2\nu_{\rm tail}(dh)
 ={1\over2}\zeta(3,5/4),                              \tag{6.4}
\]

one obtains

\[
 \mathfrak a_{\rm tail}(f,f)
 \leq{\sigma_{\rm tail}^2\pi^2m^2\over2a^2}=o(1).   \tag{6.5}
\]

Hence `Q_cont-U I` is negative definite on `mathcal W_m^-` for every fixed
`m` and all sufficiently large locked parameters.  Its odd negative index
is unbounded.  Repeat the construction of Section 1 with the comparison
multiplier and its own source-defined dangerous projector.  The resulting
far block is positive by Theorem 1.1, so Haynsworth inertia transfers every
surviving negative direction to that comparison retained Schur complement.
Therefore

\[
 \boxed{\beta_{\lambda,-,{\rm cont}}^{\rm mv}=0}       \tag{6.6}
\]

for all sufficiently large parameters in each fixed-`m` test.  This does
not describe the actual prime discrepancy.  It proves that an absolute PNT
envelope cannot establish (4.3); the signed translation orientation in
(5.4) is indispensable.

## 7. Exact rational regression and remaining theorem

The block and exterior identities have an exact `Fraction` regression.
Take

\[
 g=2,\quad\delta=1,\quad U={1\over7},\quad
 T_v=\operatorname {diag}\left({1\over5},{3\over2},{1\over2}\right),
 \quad p={1\over4}e_1,                                \tag{7.1}
\]

and `T_a=|w><w|` with `w=(1,1/2,1/3)`.  The pole-first projector retains
`e_1,e_2` and leaves `e_3` in the far space.  The exact matrix is

\[
 B=
 \begin{bmatrix}
 107/40&1/2&1/3\\
 1/2&3/4&1/6\\
 1/3&1/6&29/18
 \end{bmatrix},                                      \tag{7.2}
\]

so `H=29/18>delta` and

\[
 \Sigma_0=
 \begin{bmatrix}
 3023/1160&27/58\\
 27/58&85/116
 \end{bmatrix},
 \qquad \det\Sigma_0={1571\over928}>0.                \tag{7.3}
\]

With `Q=B+U I` and `T_ext=-P_(e_1,e_2)Q`, direct exact Gaussian elimination
at

\[
 \sigma=0,{1\over5},{7\over3}
\]

verifies, entry by entry,

\[
 \Sigma_\sigma=(\sigma-U)I-T_{\rm ext}\mathsf E_\sigma,
 \quad
 (B+\sigma I)\mathsf E_\sigma=i_Y\Sigma_\sigma,
 \quad
 (B+\sigma I)^{-1}i_Y
 =\mathsf E_\sigma\Sigma_\sigma^{-1}.                \tag{7.4}
\]

This is an algebraic theorem regression, not an arithmetic Weil fixture.

The exact remaining odd theorem is now smaller in honest dimension but not
weaker in content: on one source-selectable unbounded locked schedule, prove

\[
 \boxed{\beta_{\lambda,-}^{\rm mv}>0}                 \tag{7.5}
\]

for the actual complete source operator and the actual projector (1.7).
Equivalently, prove the signed inf--sup (5.4).  One positive pole direction,
the rank bound (1.10), and a magnitude bound for `D_lambda` do not orient
the other retained directions.  The formal state therefore remains
`P0_INVALIDATED`.
