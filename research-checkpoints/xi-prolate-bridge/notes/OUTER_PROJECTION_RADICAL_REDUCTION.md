# Outer--projection terms by radical reduction and BV Fourier separation

Status: analytic component theorem for the actual corrected,
source-normalized `0/4` state.  On the locked half-integer schedule this
note proves that both outer--projection orientations are `o(d_4)`.  Since
`d_4=sqrt(d_4 d_4)`, this is the required geometric-mean scale for the
quadratic source state.

The theorem does **not** split the source state into putative global
label-`0` and label-`4` radicals.  An individual prolate mode has nonzero
integral and its arithmetic transform is not the global `L2` radical used
below.  The cancellation between labels `0` and `4`, the invisible bump,
and inversion reflection are therefore retained until after the radical
identity is applied.  No global Weil positivity, zero table, sector floor,
equation (5.2) of `DIRECT_RH_ATTACK.md`, or determinant limit is used.

## 1. Exact states and source-core meaning of the cross term

Put

\[
 \lambda_j=j+\frac12,\qquad
 N_j=2^{2400(2j+1)^2},\qquad j\geq2,                 \tag{1.1}
\]

and let `L=2 log(lambda)`.  Use the source basis

\[
 V_r(t)=L^{-1/2}\exp\left(2\pi i r(t+\log\lambda)/L\right).
                                                               \tag{1.2}
\]

Let `K=S E(tilde h_lambda)` be the corrected global radical state from
`notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md`.  Its correction is supported in
`|x|<1/(2 lambda)`, so its restriction to the source window is exactly the
uncorrected arithmetic state.  With `C` denoting restriction to
`[-log(lambda),log(lambda)]`, define

\[
 X=CK,\qquad p=P_NX,\qquad P=(I-P_N)X,\qquad O=(I-C)K.           \tag{1.3}
\]

The operators `C` and `P_N` commute with inversion.  Thus all four states
in (1.3) are inversion even.  In particular, `O` contains both the right
physical tail and its reflected left tail; no reflection term has been
dropped.

For a finite trigonometric polynomial `u`, the pinned two-sided radical
identity gives

\[
 W(K,u)=W(u,K)=0.                                               \tag{1.4}
\]

The combined explicit distribution, with source sign

\[
 Q=W_{0,2}-W_R-W_p,                                             \tag{1.5}
\]

therefore gives, before any blockwise absolute value,

\[
 W(O,u)=-q_\lambda(X,u),\qquad
 W(u,O)=-q_\lambda(u,X).                                      \tag{1.6}
\]

Here `q_lambda` is the closed semilocal form reconstructed from the exact
finite source matrices.  This passage is not merely a definition of a
convenient compact form.  Both `X` and `P` are compact BV functions after
zero extension, so their multiplicative transforms are `O(1/|s|)` uniformly
in every closed substrip of the critical strip.  At every nontrivial-zero
parameter the radical identity gives `widehat O=-widehat X`, with the
conjugate evaluation treated in the same way and without assuming that the
parameter is real.  Thus every polarized `O--P` spectral summand is the
negative of a product of two compact `O(1/|s|)` transforms.  The classical
zero-counting bound makes this quadratic tail absolutely convergent.  It is
exactly the spectral-tail cross pairing used for the complete remainder in
`notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md`.

Equivalently, the explicit-form extension to `u=P` is the limit along
symmetric finite Fourier truncations of `P`.  This limit exists because
`X,P` belong to the logarithmic form domain and the right sides of (1.6)
converge there.  The BV explicit-form passage and the absolutely convergent
spectral tail agree on the trigonometric core and hence in this limit.
Consequently

\[
 \boxed{
 W(O,P)=-q_\lambda(X,P),\qquad
 W(P,O)=-q_\lambda(P,X).}                                     \tag{1.7}
\]

Equation (1.7) is important claim discipline.  It is not an assertion that
the signed Weil distribution is bounded on arbitrary pairs of `L2` outer
and log-weighted compact vectors.  The defect-relative outer `L2` theorem
ensures that `O` is the locked physical outer state, while (1.7) uses the
additional exact radical cancellation to define and evaluate its source
cross pairing.  Thus no unproved `L2` multiplier theorem is smuggled in.

## 2. Explicit Fourier bounds for the complete source state

For each normalized prolate label `n=0,4`, write

\[
 g_n(t)=E(h_{n,\lambda})(e^t),\qquad
 K_n(t)=\frac{g_n(t)+g_n(-t)}2.
\]

The variation theorem in
`notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md` proves

\[
 \operatorname {TV}(K_n)
 \leq4\lambda\left(2\pi\lambda^2+\frac12\right)
       +32\pi\lambda^2\sqrt{d_n}.                              \tag{2.1}
\]

The last term in (2.1) is the hard-endpoint jump contribution.  It is kept
in the derivation; using only `sqrt(d_n)<=1` gives the common explicit
majorant

\[
 \overline V_\lambda=
 4\lambda\left(2\pi\lambda^2+\frac12\right)+32\pi\lambda^2.
                                                               \tag{2.2}
\]

There is also an elementary mean bound which does not require a pointwise
estimate.  Changing variables `x=m exp(t)`, interchanging the finite sum,
and using `sum_(m<=M)m^(-1/2)<=2 sqrt(M)` gives

\[
\begin{aligned}
 \int_{-\log\lambda}^{\log\lambda}|g_n(t)|\,dt
 &\leq2\sqrt\lambda\int_{1/\lambda}^{\lambda}|h_{n,\lambda}(x)|\,dx\\
 &\leq2\sqrt2\,\lambda.                                      \tag{2.3}
\end{aligned}
\]

Reflection and averaging do not increase this `L1` bound.

Retain the source normalization

\[
 a_4=\frac{\sqrt3}{2^{11/4}},\qquad
 X=a_4K_4-a_{0,\lambda}K_0,\qquad
 |a_{0,\lambda}/a_4|\leq2\sqrt2\lambda.                      \tag{2.4}
\]

Define

\[
 S_\lambda=a_4(1+2\sqrt2\lambda),\quad
 V_\lambda=S_\lambda\overline V_\lambda,                    \tag{2.5}
\]

\[
 A_\lambda=\frac{\sqrt L}{2\pi}V_\lambda,qquad
 M_\lambda=\frac{2\sqrt2\lambda}{\sqrt L}S_\lambda.        \tag{2.6}
\]

If `x_r=<V_r,X>`, periodic Stieltjes integration by parts and (2.3) give
the exact coefficient bounds

\[
 \boxed{|x_r|\leq A_\lambda/|r|\ (r\ne0),\qquad
        |x_0|\leq M_\lambda.}                                \tag{2.7}
\]

No unit-norm replacement of (2.4) is made.

## 3. The separated high--low Cauchy sum

The infinite source Cauchy form is

\[
 q_\lambda=D_a+D_bH-HD_b,qquad
 H_{rs}=\begin{cases}(r-s)^{-1},&r\ne s,\\0,&r=s,\end{cases} \tag{3.1}
\]

with `|b_r|<=B_b(lambda)`, where the fully explicit `B_b` is the one in
`notes/HIGH_FOURIER_COERCIVITY.md`, equation (2.3).  The prime contribution
to that bound uses every prime power at or below `lambda^2` and retains the
minus sign in (1.5).

Because `P` has modes `|r|>N` and `p` has modes `|s|<=N`, the diagonal
operator `D_a` has **zero** high--low matrix element.  The remaining double
series is absolutely convergent by (2.7).  Let `H_N=sum_(k=1)^N 1/k`.  For
one positive same-sign quadrant,

\[
\begin{aligned}
 \sum_{r>N}\sum_{s=1}^N\frac1{rs(r-s)}
 &=\sum_{r>N}\frac1{r^2}
   \left(H_N+\sum_{s=1}^N\frac1{r-s}\right)\\
 &\leq\frac{2H_N}{N}.                                         \tag{3.2}
\end{aligned}
\]

For one opposite-sign quadrant,

\[
 \sum_{r>N}\sum_{s=1}^N\frac1{rs(r+s)}\leq\frac{H_N}{N}.     \tag{3.3}
\]

There are two quadrants of each kind.  The zero low mode contributes at
most `2 A_lambda M_lambda/N` before the numerator bound.  Since
`|b_r-b_s|<=2B_b`, (3.2)--(3.3) prove

\[
 \boxed{
 |q_\lambda(P,p)|=|q_\lambda(p,P)|
 \leq T_{\lambda,N},}                                        \tag{3.4}
\]

where

\[
 T_{\lambda,N}=
 \frac{12B_bA_\lambda^2H_N+4B_bA_\lambda M_\lambda}{N}.      \tag{3.5}
\]

For the serialized finite bound we use only

\[
 H_N\leq1+\log N.                                             \tag{3.6}
\]

The factor `1/N` in (3.5), rather than the generic operator-norm factor
`1/sqrt(N)`, is decisive.  A direct application of logarithmic form
continuity to `q(X,P)` would be too weak after division by `d_4`.

## 4. Defect-relative outer--projection theorem

The compact projection--projection theorem gives, for the actual source
combination,

\[
 \frac{|q_\lambda(P,P)|}{d_4}
 \leq S_\lambda^2\mathcal B_j,                                \tag{4.1}
\]

where `mathcal B_j` is exactly equation (3.3) of
`notes/COMPACT_PROJECTION_WEIL_BOUND.md`.

The pinned Logvinenko--Sereda insertion gives

\[
 d_4\geq d_{\rm LS}(\lambda)
 :=6\,96^{-5-(320\pi/\log2)\lambda^2}.                       \tag{4.2}
\]

Combining (1.7), `X=p+P`, (3.5), and (4.1) yields the finite, explicit
bound for both orientations:

\[
 \boxed{
 \frac{|W(O,P)|}{d_4},\ \frac{|W(P,O)|}{d_4}
 \leq S_\lambda^2\mathcal B_j
       +\frac{T_{\lambda,N_j}}{d_{\rm LS}(\lambda)}.}         \tag{4.3}
\]

Every `W` and `q` on the left of the triangle step is the already-combined
pole--archimedean--minus-prime form.  Separate block norms are not inserted
in (4.3).

To prove the limit, note that

\[
 \log N_j=9600(\log2)\lambda_j^2.                             \tag{4.4}
\]

The exact exponent margin in the second term of (4.3) is

\[
\begin{aligned}
 M_{OP}
 &=9600\log2-\frac{320\pi\log96}{\log2}\\
 &=2\left(4800\log2-
        \frac{160\pi\log96}{\log2}\right)\\
 &=34.2865921179204680771\ldots>0.                            \tag{4.5}
\end{aligned}
\]

All remaining factors in (3.5) grow polynomially in `lambda` and
`log N`.  Hence `T_(lambda,N_j)/d_LS(lambda)->0`.  The first term in
(4.3) tends to zero by the compact `P--P` theorem.  Therefore

\[
 \boxed{
 W(O,P)=o(d_4),\qquad W(P,O)=o(d_4)}                           \tag{4.6}
\]

on (1.1).

## 5. What this closes and what it does not

The result closes the two projection-containing cross orientations for the
actual corrected source state, in the source-core sense of (1.7).  It also
explains why the outer `L2` estimate and the logarithmic projection estimate
alone were not a multiplier theorem: radicality plus the extra high--low
`1/N` separation is essential.

It does not prove an `O--O` bound.  Indeed, if all corresponding global
pairings are extended compatibly with the same two-sided radical, the formal
identity `W(O,O)=q_lambda(X,X)` shows why small outer `L2` norm alone cannot
control that term.  Establishing the precise combined-distribution domain
and cancellation for the complete remainder remains a separate obligation.
No low signed sector floor or asymptotic determinant conclusion follows
from (4.6).
