# Cutoff-free actual-dangerous endpoint-jet profile observability barrier

## 0. Exact outcome and fail-closed boundary

Retain the literal cutoff-free arithmetic adjoint, the actual complete
multiplier-dangerous projector, and the additive prolate prefixes of
checkpoints 1.67--1.69.  Write

\[
 I_L=[-L/2,L/2],\qquad L=2\log\lambda,\qquad a=-L/2,
                                                               \tag{0.1}
\]

and let `A_(lambda,0)^*` be the exact adjoint into the even zero-integral
additive source.  For

\[
 p_j(s)={(s-a)^j\over j!},\qquad
 \Phi_j=A_{\lambda,0}^*p_j,                           \tag{0.2}
\]

the finite Taylor identity gives the exact decomposition

\[
 \boxed{
 A_{\lambda,0}^*y
 =\sum_{j=0}^K y^{(j)}(a)\Phi_j
   +A_{\lambda,0}^*\rho_Ky,\qquad
 \rho_Ky=y-\sum_{j=0}^K y^{(j)}(a)p_j.}              \tag{0.3}
\]

This is not merely a formal Taylor split.  Put

\[
 q_k(D)=\prod_{\ell=0}^{k-1}
             \left(D-\ell-{1\over2}\right),
 \qquad q_0(D)=1.                                    \tag{0.4}
\]

At every positive arithmetic breakpoint `a_n=n/lambda`, the complete
right-minus-left derivative jump is

\[
 \boxed{
 \Delta\left(A_{\lambda,0}^*y\right)^{(k)}(a_n)
 ={\lambda^{k+1/2}\over2n^{k+1}}q_k(D)y(a).}         \tag{0.5}
\]

Thus, for each derivative order, the whole breakpoint jump vector is one
universal arithmetic profile `n^(-(k+1))` times one endpoint-jet scalar.
The profile `Phi_j` has no jumps through order `j-1` and has the normalized
order-`j` jump

\[
 \Delta\Phi_j^{(j)}(a_n)
 ={\lambda^{j+1/2}\over2n^{j+1}}.                   \tag{0.6}
\]

The profiles have exact additive-prolate coefficient and Gram matrices.
They are linearly independent, and a sufficiently long prolate prefix
captures their fixed finite span uniformly.  The prefix supplied by this
argument is, however, non-effective.  At a declared prefix `E`, its profile
singular value is identically zero when `K+1>dim E`.

There is also a positive endpoint-observability theorem on the actual
dangerous range.  If

\[
 v(t)\leq {1\over2}
 \log{1+4T_\lambda^2\over1+4t^2}\,
       {\bf1}_{[-T_\lambda,T_\lambda]}(t),           \tag{0.7}
\]

and `W_vartheta=Ran 1_[vartheta,infinity)(T_v)`, then for `k>=1`

\[
 \boxed{
 \|y^{(k)}\|_{L^2(\mathbb R)}
 \leq {M_k(T_\lambda)\over\vartheta}\|y\|_2,
 \qquad
 M_k(T)\leq {T^k\over ek}.}                         \tag{0.8}
\]

This sharpens the crude `mathcal A_lambda T_lambda^k` bound.  It yields an
explicit finite-jet observability certificate, but its uniform Taylor
order is on the scale

\[
 K=O\!\left(LT_\lambda+\log_+\vartheta^{-1}\right). \tag{0.9}
\]

The currently certified `T_lambda` may be exponential on the frozen
absolute-amplitude schedule.  By contrast, a near-Shannon prefix has only
`O(lambda^2)` rows.  Whenever the certified Taylor order exceeds that row
count, the profile singular value vanishes by rank.  This is an exact
incompatibility of the two available certificates, not a theorem that the
actual dangerous eigenspace requires exponential jet order.

Finally, bottom normalization does not remove cancellation.  With

\[
 R_Y=P_YAA^*P_Y|_Y,\qquad
 N_Y=P_YR_Y^{-1/2},\qquad J_Y=A^*N_Y,                \tag{0.10}
\]

one has `J_Y^*J_Y=I_Y`, but the normalized prefix map is exactly a finite
jet profile block plus a Taylor remainder and the complete safe piece.
Its Gram retains both signed cross terms.  Endpoint jets of the dangerous
piece can be cancelled by the safe piece whenever those safe traces exist;
at form level the always-valid cancellation is in the prolate
coefficients themselves.

The note therefore proves a useful positive finite-jet theorem and a sharp
stopping line.  It does not prove an actual near-Shannon cross-angle,
bridge gate, endpoint observability rate, profile singular-value rate,
safe-cross reserve, bottom-space dimension bound, determinant convergence,
zero theorem, Riemann-hypothesis conclusion, converse, or
de Bruijn--Newman bound.  The standard eight are untouched and the formal
state remains `P0_INVALIDATED`.

## 1. Frozen dependency

No external source, numerical ground, cached prolate artifact, or new
source-lock is used.  The sole direct pair is:

| Frozen path | SHA-256 |
|---|---|
| `notes/CUTOFF_FREE_ACTUAL_DANGEROUS_ADJOINT_REGULARITY_BARRIER.md` | `76bed7bff24f2bdced30c357d3a61b7cbcc16964085901070f723035aeb92337` |
| `tests/test_cutoff_free_actual_dangerous_adjoint_regularity_barrier.py` | `034fe9fa18d0ae587ac3d9c5c3f9e0179a5cbf80dd96ef5aab21e5034f8223ec` |

That pair fixes the literal adjoint, actual multiplier envelope, dangerous
spectral inverse, full-source constants, normalized bottom Gram, safe-piece
cancellation, additive-prolate leakage identity, and claim boundary.  All
earlier KRD, BBK, Slepian, full-source, complete-symbol, and bridge lineage
is transitive only.

## 2. Universal arithmetic endpoint-jet profiles

On the positive source half-interval, define

\[
 r_j(x)=x^{-1/2}\sum_{n\leq\lambda x}n^{-1/2}
          {\log(\lambda x/n)^j\over j!},
 \qquad
 c_j={1\over2\lambda}\int_{\lambda^{-1}}^\lambda
                    r_j(x)\,dx.                     \tag{2.1}
\]

The exact full-source adjoint formula gives

\[
 \boxed{
 \Phi_j(x)={1\over2}{\bf1}_{\{|x|\geq\lambda^{-1}\}}
                   r_j(|x|)-c_j,
 \qquad |x|\leq\lambda.}                            \tag{2.2}
\]

Equations (0.2)--(0.3) now follow from linearity.  They include the even
reflection and the zero-integral correction; no constant or factor of two
is suppressed.

To prove the full jump law, consider the new `n`-th summand at
`a_n=n/lambda`.  With `D=d/ds`, the elementary Euler identity is

\[
 {d^k\over dx^k}
 \left[x^{-1/2}y\!\left(a+\log{x\over a_n}\right)\right]
 =x^{-1/2-k}
 \left[\prod_{\ell=0}^{k-1}
       \left(D-\ell-{1\over2}\right)y\right]
       \!\left(a+\log{x\over a_n}\right).           \tag{2.3}
\]

Multiplying by `n^(-1/2)/2` and setting `x=a_n` proves (0.5).
The polynomial `q_k` is monic of degree `k`.  Since `p_j` has a zero of
order `j` at `a`,

\[
 q_k(D)p_j(a)=0\quad(k<j),\qquad
 q_j(D)p_j(a)=1.                                    \tag{2.4}
\]

This proves (0.6).  It also proves that `Phi_0,...,Phi_K` are linearly
independent: in a first nonzero linear combination, its lowest profile
index has a nonzero first surviving derivative jump.  Subtracting (0.3)
kills every interior arithmetic jump through order `K` in the remainder.
It does not kill the outer source-boundary value or the smooth-cell
derivative of that remainder.

The ordinary Taylor jets may be replaced by jump-diagonal jets.  Because
the matrix

\[
 \left(q_k(D)p_j(a)\right)_{0\leq k,j\leq K}         \tag{2.5}
\]

is unit lower triangular, there are unique polynomials `ell_(j,K)` of
degree at most `K` satisfying

\[
 q_k(D)\ell_{j,K}(a)=\delta_{kj}
 \qquad(0\leq k,j\leq K).                            \tag{2.6}
\]

Their adjoint images isolate one derivative-jump order at a time.  This is
only an invertible finite-dimensional change of coordinates; it does not
improve any singular value without a quantitative bound for that change of
basis.

## 3. Exact additive-prolate coefficient and capture matrices

Let `h_m` be the real unit even additive prolate modes and put

\[
 I_m=\langle1,h_m\rangle,\qquad
 b_{mj}=\langle\Phi_j,h_m\rangle.                    \tag{3.1}
\]

The literal adjoint formula gives the computable coefficient

\[
 \boxed{
 b_{mj}=\int_{\lambda^{-1}}^\lambda
       r_j(x)\overline{h_m(x)}\,dx-c_j\overline{I_m}.} \tag{3.2}
\]

For a finite raw prefix with mode set `mathcal I_E`, let

\[
 B_{E,K}=(b_{mj})_{
        m\in\mathcal I_E,\ 0\leq j\leq K}.           \tag{3.3}
\]

If `u=J_Ky=(y(a),...,y^(K)(a))^T`, then the profile contribution to the
raw coefficient vector is exactly `B_(E,K)u`.  The polynomial Taylor Gram
is the positive matrix

\[
 \boxed{
 (G_K)_{ij}=\langle p_i,p_j\rangle_{L^2(I_L)}
 ={L^{i+j+1}\over i!j!(i+j+1)}.}                    \tag{3.4}
\]

The total profile Gram and raw-prefix profile Gram are

\[
 H_K=(\langle\Phi_i,\Phi_j\rangle)_{i,j=0}^K,
 \qquad H_{E,K}=B_{E,K}^*B_{E,K}.                   \tag{3.5}
\]

By Section 2, `H_K>0`.  As complete even prolate prefixes increase,

\[
 H_K^{-1/2}H_{E_R,K}H_K^{-1/2}\longrightarrow I_{K+1}
 \quad\hbox{in operator norm}.                       \tag{3.6}
\]

This proves a positive finite-profile theorem: for fixed
`lambda,K,epsilon`, some finite prefix has normalized profile capture at
least `1-epsilon`.  Neither its index nor a near-Shannon rate follows.

The Taylor-normalized declared-prefix singular value is

\[
 \boxed{
 \sigma_{E,K}=s_{\min}(B_{E,K}G_K^{-1/2}).}          \tag{3.7}
\]

Here `s_min` includes all `K+1` domain directions.  Therefore

\[
 \boxed{K+1>\dim E\quad\Longrightarrow\quad
        \sigma_{E,K}=0.}                             \tag{3.8}
\]

For the admissible zero-integral prefix `M=E cap 1^perp`, put
`i_E=(I_m)_(m in mathcal I_E)` and `s_E=||i_E||^2`.  Its exact profile
Gram is instead

\[
 \boxed{
 H_{M,K}=B_{E,K}^*
 \left(I-{i_Ei_E^*\over s_E}\right)B_{E,K}.}        \tag{3.9}
\]

Thus even the finite-profile calculation retains the same rank-one
integral correction as the full bridge.  Raw coefficient energy alone
does not prove admissible-source capture.

## 4. Sharpened dangerous-range derivative and rank bounds

Let `mathcal A_lambda>0` and define `T=T_lambda` by

\[
 \mathcal A_\lambda={1\over2}\log(1+4T^2).          \tag{4.1}
\]

The checkpoint-1.69 envelope becomes (0.7).  Define

\[
 M_k(T)=\sup_{0\leq t\leq T}
 {t^k\over2}\log{1+4T^2\over1+4t^2}.               \tag{4.2}
\]

For `k>=1` and `0<t<=T`,

\[
 {1\over2}\log{1+4T^2\over1+4t^2}
 \leq\log{T\over t}.                                \tag{4.3}
\]

The maximum of `t^k log(T/t)` occurs at `t=T exp(-1/k)` and equals
`T^k/(ek)`.  This proves the second part of (0.8).  If
`y in W_vartheta`, write `y=T_vx` with
`||x||<=vartheta^(-1)||y||`.  Plancherel then gives

\[
 \|y^{(k)}\|_2
 =\|t^kv(t)\widehat x(t)\|_2
 \leq {M_k(T)\over\vartheta}\|y\|_2,               \tag{4.4}
\]

which proves (0.8).  For `k=0`, the corresponding bound is
`mathcal A_lambda/vartheta`.

The same envelope improves the crude rank audit.  Direct integration gives

\[
 \int_{-T}^T{1\over2}
       \log{1+4T^2\over1+4t^2}\,dt
 =2T-\arctan(2T).                                    \tag{4.5}
\]

Since the diagonal of the compressed convolution kernel is constant,

\[
 \operatorname {tr}T_v
 \leq {L\over2\pi}\{2T-\arctan(2T)\}.              \tag{4.6}
\]

Consequently

\[
 \boxed{
 \dim W_\vartheta
 \leq {L\{2T-\arctan(2T)\}\over2\pi\vartheta}
 <{LT\over\pi\vartheta}.}                          \tag{4.7}
\]

This is only an upper bound.  It neither proves a polynomial dangerous
rank nor supplies the necessary bottom-space dimension bound.

## 5. Explicit endpoint observability and the order mismatch

Taylor's integral remainder and Cauchy--Schwarz give, for every
`y in W_vartheta`,

\[
 \|\rho_Ky\|_{L^2(I_L)}
 \leq {L^{K+1}\over
 K!\sqrt{(2K+1)(2K+2)}}\|y^{(K+1)}\|_{L^2(I_L)}.
                                                               \tag{5.1}
\]

Put

\[
 \boxed{
 \epsilon_K={L^{K+1}M_{K+1}(T)\over
 \vartheta K!\sqrt{(2K+1)(2K+2)}}.}                 \tag{5.2}
\]

Equations (4.4)--(5.2) prove

\[
 \|\rho_Ky\|_2\leq\epsilon_K\|y\|_2.              \tag{5.3}
\]

If `epsilon_K<1`, the reverse triangle inequality and (3.4) give the
positive endpoint-observability theorem

\[
 \boxed{
 \|G_K^{1/2}J_Ky\|_2
 =\left\|\sum_{j=0}^K y^{(j)}(a)p_j\right\|_2
 \geq(1-\epsilon_K)\|y\|_2.}                       \tag{5.4}
\]

There are two exact limitations.  First, injectivity of `J_K` is necessary
for any positive constant in (5.4), so rank-nullity gives

\[
 \boxed{
 \dim W_\vartheta>K+1
 \quad\Longrightarrow\quad
 \ker(J_K|_{W_\vartheta})\ne\{0\}.}                \tag{5.5}
\]

Second, the current uniform certificate is long.  From (0.8),

\[
 \epsilon_K
 \leq{(LT)^{K+1}\over
 e\vartheta(K+1)K!\sqrt{(2K+1)(2K+2)}}.             \tag{5.6}
\]

Using `K!>=(K/e)^K`, one sufficient integer choice is

\[
 \boxed{
 K\geq\max\left\{
 2eLT,\ 2+\log_2^+{LT\over\vartheta}
 \right\}.}                                        \tag{5.7}
\]

Here `log_2^+(u)=max{0,log_2(u)}`.  Indeed, the exponential factor in
(5.6) is then at most `2^(-K)`, and the remaining prefactor is strictly
below one.  Formula (5.7) is a sufficient order for the displayed
certificate, not a lower bound on the actual minimal observable jet order.

Now combine (3.8) and (5.7).  A near-Shannon mixed prefix has
`dim E=O(lambda^2)`.  If the certified Taylor order in (5.7) is larger than
that dimension, then the same profile block which observes all of
`W_vartheta` cannot inject into `E`:

\[
 \boxed{
 K+1>\dim E
 \quad\Longrightarrow\quad
 \sigma_{E,K}=0,
 \quad\hbox{even when }\epsilon_K<1.}               \tag{5.8}
\]

On the frozen amplitude schedule, the certified `T_lambda` may be
`exp(O(lambda))`, so (5.7) does not certify a polynomial-order overlap
with the near-Shannon row budget.  A future proof could escape (5.8) only by
showing actual low-order endpoint observability, proving direct capture
without profile factorization, or finding a much smaller actual spectral
radius on the relevant bottom slice.

## 6. Bottom-normalized profile factorization and safe cancellation

Put

\[
 C=AA^*,\qquad
 m_\lambda I\preceq C\preceq M_\lambda I,
 \qquad
 m_\lambda={1\over2\lambda^2M_\mu(\lambda)^2},
 \quad M_\lambda={\lambda^2\over2}.                 \tag{6.1}
\]

Let `Y` be a declared bottom space, use (0.10), and let
`Pi=1_[vartheta,infinity)(T_v)`.  Define

\[
 U_K=J_K\Pi N_Y                                      \tag{6.2}
\]

and

\[
 Q_{E,K}=P_EA^*\rho_K\Pi N_Y
          +P_EA^*(I-\Pi)N_Y.                        \tag{6.3}
\]

The exact normalized finite-jet factorization is

\[
 \boxed{
 P_EJ_Y=B_{E,K}U_K+Q_{E,K}.}                        \tag{6.4}
\]

Therefore the capture Gram is

\[
 \boxed{
 \begin{aligned}
 \mathfrak G_E
 &=(B_{E,K}U_K+Q_{E,K})^*(B_{E,K}U_K+Q_{E,K})\\
 &=U_K^*B_{E,K}^*B_{E,K}U_K+Q_{E,K}^*Q_{E,K}\\
 &\quad+U_K^*B_{E,K}^*Q_{E,K}
       +Q_{E,K}^*B_{E,K}U_K.
 \end{aligned}}                                     \tag{6.5}
\]

The last line is signed.  It contains both the dangerous Taylor-remainder
cross and the complete safe-piece cross.

Here is a precise conditional lower bound.  Suppose on `Y`

\[
 \|\Pi y\|\geq a_\vartheta\|y\|,
 \qquad
 \|(I-\Pi)y\|\leq b_\vartheta\|y\|.               \tag{6.6}
\]

The actual physical-angle theorem supplies such numbers, but not a useful
small `b_vartheta` at the hard threshold.  Equations (3.7), (5.4), and
(6.1) imply

\[
 s_{\min}(B_{E,K}U_K)
 \geq{\sigma_{E,K}(1-\epsilon_K)a_\vartheta
             \over\sqrt{M_\lambda}}.               \tag{6.7}
\]

Also (5.3) and (6.1) give

\[
 \|Q_{E,K}\|
 \leq\sqrt{M_\lambda\over m_\lambda}
       (\epsilon_K+b_\vartheta).                    \tag{6.8}
\]

Thus the exact singular-value triangle inequality proves

\[
 \boxed{
 \mathfrak q_E(Y)
 \geq\left[
 {\sigma_{E,K}(1-\epsilon_K)a_\vartheta
        \over\sqrt{M_\lambda}}
 -\sqrt{M_\lambda\over m_\lambda}
       (\epsilon_K+b_\vartheta)
 \right]_+^2.}                                      \tag{6.9}
\]

This is a positive theorem, but it is quantitatively vacuous with the
present inputs.  The profile singular value has no near-Shannon lower
bound, the explicit remainder requires the long order (5.7), and the safe
term pays the full-source condition scale.

At a finite smooth compression, the endpoint traces make cancellation
especially transparent:

\[
 J_K(\Pi y)+J_K((I-\Pi)y)=J_Ky.                     \tag{6.10}
\]

The two vectors can cancel.  At the cutoff-free form level the safe piece
need not have point traces, so (6.10) is not used as an extra assumption.
The always-valid statement is (6.4)--(6.5): safe prolate coefficients can
cancel the dangerous profile coefficients.  Bottom normalization makes
`J_Y` an isometry but does not change their sign.

For a one-dimensional missed line `Y=span{e_0}`, (6.5) is simply the
literal coefficient identity

\[
 \boxed{
 \mathfrak q_E(e_0)
 ={1\over\|A^*e_0\|^2}
 \left\|B_{E,K}J_K(\Pi e_0)
 +P_EA^*\rho_K\Pi e_0
 +P_EA^*(I-\Pi)e_0\right\|^2.}                     \tag{6.11}
\]

No lower bound for one summand alone controls this signed norm.

## 7. What jet subtraction does and does not improve in BV

The remainder `rho_Ky` has zero endpoint value for every `K>=0`, so its
literal adjoint has no interior value jumps.  For `K>=1`, the same integral
remainder argument gives

\[
 \|(\rho_Ky)'\|_2
 \leq\epsilon'_K\|y\|_2,\qquad
 \epsilon'_K={L^KM_{K+1}(T)\over
 \vartheta (K-1)!\sqrt{(2K-1)(2K)}}.                \tag{7.1}
\]

Let `N_lambda=ceil(lambda^2)-1` and
`H_N=sum_(n=1)^(N_lambda)1/n`.  Repeating the literal cellwise BV
calculation without the now-vanished interior value jumps gives

\[
 \boxed{
 \begin{aligned}
 \operatorname {Var}(A_{\lambda,0}^*\rho_Ky)
 \leq{}&2H_N\sqrt{\lambda-\lambda^{-1}}
       (\epsilon'_K+\tfrac12\epsilon_K)\|y\|_2\\
 &+{\sqrt{(\lambda-\lambda^{-1})H_NN_\lambda}
       \over\lambda}\epsilon_K\|y\|_2.
 \end{aligned}}                                     \tag{7.2}
\]

The outer zero-extension jump is included in (7.2); it is controlled by
the preceding cellwise variation and the zero-integral correction.  The
profile part of (0.3) must still be treated by its exact coefficients, not
discarded.

For fixed small `K`, (7.1) retains the exponential spectral-radius scale.
Only the same long Taylor order that makes (5.2) small makes (7.2) small.
Thus finite-jet subtraction removes the harmonic sum of explicit interior
jumps, but it does not by itself remove the exponential smooth-cell
derivative loss, the outer boundary, or cancellation between the profile
and remainder coefficients.

## 8. Exact stopping line

The checkpoint-1.67 bridge condition on a missed line remains

\[
 \mathfrak q_E(e_0)>\delta_E.                        \tag{8.1}
\]

The present route would prove it if the bracket in (6.9) were strictly
larger than `sqrt(delta_E)`.  That requires, simultaneously:

1. an actual endpoint-observability order with `K+1<=dim E`;
2. a lower bound for `sigma_(E,K)` at the declared near-Shannon prefix;
3. a Taylor-remainder and safe-cross reserve after bottom normalization;
4. comparison with the actual `delta_E`, for which only a one-sided lower
   floor is currently frozen.

Neither qualitative finite-profile capture nor the explicit long-order
certificate supplies these four inputs.  The sharp finite-jet obstruction
is the paired rank statement (3.8), (5.5): too few jets cannot observe a
large dangerous range, while too many universal profiles cannot inject
into the declared prefix.  Any successful finite-jet proof must locate an
actual low-dimensional, low-order window between those two ranks and must
still control the signed remainder and safe terms in (6.5).

## 9. Reproduction and claim discipline

Run

    python3 -B -m unittest \
      tests.test_cutoff_free_actual_dangerous_endpoint_jet_profile_observability_barrier -v

The regression checks the frozen dependency hashes, the exact `q_k(D)`
jump law, universal profile formula, Taylor and jump-coordinate matrices,
additive-prolate coefficient and zero-integral Gram formulas, sharpened
multiplier derivative and trace bounds, endpoint observability, both rank
obstructions, the quantitative long-order certificate, bottom-normalized
factorization, signed safe cancellation, residual BV scale, displayed TeX,
and static hygiene.  It reads no zero table, cached ground, prolate
artifact, network resource, API key, or environment secret.
