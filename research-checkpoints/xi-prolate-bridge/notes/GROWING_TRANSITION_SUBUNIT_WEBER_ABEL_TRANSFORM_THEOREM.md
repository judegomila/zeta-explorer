# Growing-transition subunit Weber Abel-transform theorem

## 0. Exact result and claim boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad L=2\log\lambda .                \tag{0.1}
\]

Let

\[
 a_c(u)=2u+{u^2\over c}
\]

and let `w_{c,alpha}` be the endpoint-normalized outward solution

\[
 (a_cw')'+(a_c+\alpha)w=0,\qquad
 w(0)=1,\qquad w'(0)=-{\alpha\over2}.                  \tag{0.2}
\]

For `sigma=+1` or `-1`, its lateral Abel transform is

\[
 F_{c,\sigma}(N,\alpha)
 =\lim_{\epsilon\downarrow0}\int_0^\infty
 e^{-\epsilon u}w_{c,\alpha}(u)e^{-i\sigma Nu}\,du .  \tag{0.3}
\]

The sign in (0.3) also fixes the continuation: `sigma=+1` is continued
below the real `N` axis and `sigma=-1` above it.  Put

\[
 h={\pi\over4},\qquad
 \delta_N=1-N^2,\qquad
 \ell_N^{<}=\log{1+N\over1-N},\qquad
 K_\alpha=1-{\alpha^2\over4}.                          \tag{0.4}
\]

There are absolute constants `C_0,C_1`.  If

\[
 \alpha\geq\alpha_0>0,\qquad
 c\geq C_0(1+\alpha)^3,\qquad |N|\leq{1\over2},       \tag{0.5}
\]

then

\[
\boxed{
 F_{c,\sigma}(N,\alpha)
 ={e^{-h\alpha}\over\sqrt{\delta_N}}
 e^{i\sigma\alpha\ell_N^{<}/4}
 \left\{1+{g_{1,\sigma}(N,\alpha)\over c}
              +R_{c,\sigma}(N,\alpha)\right\},}      \tag{0.6}
\]

where the exact first transport coefficient is

\[
\boxed{
 g_{1,\sigma}
 ={\pi K_\alpha\over8}+{\alpha\over4\delta_N}
 -i\sigma K_\alpha
 \left({\ell_N^{<}\over8}+{N\over4\delta_N}\right),}
                                                               \tag{0.7}
\]

and

\[
\boxed{
 \partial_Ng_{1,\sigma}
 ={\alpha N-i\sigma K_\alpha\over2\delta_N^2}.}       \tag{0.8}
\]

The matched Weber estimate is uniform in (0.5):

\[
 |R_{c,\sigma}|\leq {C_1(1+\alpha)^6\over c^2},\qquad
 |\partial_NR_{c,\sigma}|
 \leq {C_1(1+\alpha)^7\over c^2}.                     \tag{0.9}
\]

More generally, on a closed subinterval of `(-1,1)`, the same proof gives
the deliberately safe distance-explicit version

\[
 |R_{c,\sigma}|
 \leq {C_1(1+\alpha)^6\over c^2\delta_N^4},\qquad
 |\partial_NR_{c,\sigma}|
 \leq {C_1(1+\alpha)^7\over c^2\delta_N^5},           \tag{0.10}
\]

provided `c delta_N^2 >= C_0(1+alpha)^3`.  In particular,

\[
 |G_{c,\sigma}-1|
 \leq {C(1+\alpha)^3\over c\delta_N^2},\qquad
 |\partial_NG_{c,\sigma}|
 \leq {C(1+\alpha)^4\over c\delta_N^3},               \tag{0.11}
\]

where `G_{c,sigma}` is the brace in (0.6).  The powers of `delta_N` in
(0.10)--(0.11) are not asserted to be sharp.  Their purpose is to make the
separation from the two endpoint layers explicit.

At every subunit reciprocal frequency `N=1/n`, `n>=2`, define

\[
 \delta_n=1-{1\over n^2},\qquad
 \ell_n=\log{n+1\over n-1}.
\]

Then (0.6) becomes

\[
\boxed{
\begin{aligned}
 F_{c,\sigma}(1/n,\alpha)
 &={n e^{-h\alpha}\over\sqrt{n^2-1}}
 e^{i\sigma\alpha\ell_n/4}
 \left\{1+{g_{1,\sigma}^{(n)}(\alpha)\over c}
 +O\left({(1+\alpha)^6\over c^2}\right)\right\},\\
 g_{1,\sigma}^{(n)}(\alpha)
 &={\pi K_\alpha\over8}
   +{\alpha n^2\over4(n^2-1)}
   -i\sigma K_\alpha
    \left\{{\ell_n\over8}+{n\over4(n^2-1)}\right\}.
\end{aligned}}                                         \tag{0.12}
\]

The error and its `N` derivative are uniform for all `n>=2`.  Consequently

\[
 |F_{c,\sigma}(1/n,\alpha)|
 \leq C e^{-h\alpha},\qquad
 |\partial_NF_{c,\sigma}(1/n,\alpha)|
 \leq C(1+\alpha)e^{-h\alpha},                         \tag{0.13}
\]

and

\[
 \left|{d\over dn}F_{c,\sigma}(1/n,\alpha)\right|
 \leq {C(1+\alpha)e^{-h\alpha}\over n^2}.             \tag{0.14}
\]

This is a scalar theorem for the endpoint-normalized outward solution.  It
does **not** identify a cutoff-weighted shell matrix element with (0.3),
freeze a variable far Jost amplitude, prove a two-endpoint Fourier-integral
operator estimate, assemble a prime or sampler sum, compare physical and
flat exterior metrics, prove a `PA` or `P_0` floor, prove equation (5.2) of
`DIRECT_RH_ATTACK.md`, or prove RH.  The formal project state remains
`P0_INVALIDATED`.

## 1. Frozen input and exact Fourier equation

This theorem uses only the following already frozen scalar edge package.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_WEBER_EDGE_RECIPROCAL_CHANNEL_THEOREM.md` | `16db62873056fb419bc740154c67a8f27ce6ecea2b85201abab7b89aa20d56d0` |
| `tests/test_growing_transition_weber_edge_reciprocal_channel_theorem.py` | `5be3b86c8538f1234db40373a6562ac226604ed925dad9d13ef7e37516a82df6` |

For `sigma=+1`, integration by parts with the positive Abel regulator gives

\[
 (N^2-1)F_c''+\{2N+2ic(1-N^2)\}F_c'
 +(c\alpha-2icN)F_c=0.                                \tag{1.1}
\]

The endpoint normalization fixes the Jost condition

\[
 F_c(N,\alpha)\sim{-i\over N}\qquad(N\longrightarrow+\infty).
                                                               \tag{1.2}
\]

The other sign follows by conjugation because (0.2) is real for real
`alpha`.

There is a useful exact check on (1.1).  Set

\[
 S_c(N,\alpha)=e^{-icN}F_c(N,\alpha).
\]

Then (1.1) is exactly

\[
 (N^2-1)S_c''+2NS_c'
 +\{c^2(N^2-1)+c\alpha\}S_c=0.                        \tag{1.3}
\]

Thus in the open unit interval

\[
 \boxed{(\delta_NS_c')'+(c^2\delta_N-c\alpha)S_c=0.}   \tag{1.4}
\]

Equation (1.4) is the angular prolate equation.  This identity is only an
ODE reduction.  No finite Fourier eigenfunction relation or physical shell
factorization is being assumed.

## 2. Exact flat branch on the open unit interval

The regular flat Weber solution is

\[
 w_{0,\alpha}(u)=e^{iu}
 {}_1F_1\left({1\over2}-{i\alpha\over4};1;-2iu\right).
                                                               \tag{2.1}
\]

For `Re z>0`, its Laplace transform is

\[
 W_\alpha(z)
 =(z-i)^{-1/2-i\alpha/4}(z+i)^{-1/2+i\alpha/4},        \tag{2.2}
\]

with both logarithms inherited from the right half-plane.  Equivalently,

\[
 W_\alpha(z)={1\over\sqrt{1+z^2}}
 \exp\left\{-{\alpha\over2}\arctan{1\over z}\right\}.
                                                               \tag{2.3}
\]

For `|N|<1`, the two lateral limits obey

\[
 \arctan{1\over\epsilon+i\sigma N}
 \longrightarrow {\pi\over2}
 -{i\sigma\over2}\log{1+N\over1-N}.                  \tag{2.4}
\]

Therefore

\[
\boxed{
 W_\alpha(0^++i\sigma N)
 ={e^{-\pi\alpha/4}\over\sqrt{1-N^2}}
 e^{i\sigma\alpha\ell_N^{<}/4}.}                     \tag{2.5}
\]

The factor `e^(-pi alpha/4)` is a branch factor, not an absolute-value
estimate.  In particular it cannot be replaced by an additive `O(1/c)`
error when `alpha` grows.

For `sigma=+1`, the same branch is obtained from

\[
 \Phi_\alpha(N)
 =-i(N-1)^{-1/2-i\alpha/4}
       (N+1)^{-1/2+i\alpha/4},                         \tag{2.6}
\]

initially for `N>1` and then continued below `N=1`.  On entering the unit
interval, `arg(N-1)` changes from `0` to `-pi`; hence the two factors
`-i` and `exp(i*pi/2)` cancel and the modulus acquires exactly
`exp(-pi*alpha/4)`.  The upper continuation is the conjugate branch.

## 3. Exact transport equation and its first coefficient

Write

\[
 F_c(N,\alpha)=\Phi_\alpha(N)G_c(N,\alpha),\qquad
 p=N^2-1,
\]

on the lower lateral branch.  Since

\[
 {\Phi_\alpha'\over\Phi_\alpha}
 =-{N+i\alpha/2\over p},                              \tag{3.1}
\]

substitution in (1.1) gives the exact equation

\[
\boxed{
 pG_c''-(i\alpha+2icp)G_c'-dG_c=0,\qquad
 d={-1-i\alpha N+\alpha^2/4\over p}.}                 \tag{3.2}
\]

The Jost normalization is

\[
 G_c\longrightarrow1,\qquad G_c'\longrightarrow0
 \quad(N\longrightarrow+\infty).                     \tag{3.3}
\]

Insert `G_c=1+c^(-1)g_1+...` in (3.2).  The order-one
transport equation is

\[
 -2ipg_1'=d.                                           \tag{3.4}
\]

On the interior side this is

\[
 g_1'={1+i\alpha N-\alpha^2/4\over
                 2i(1-N^2)^2}.                        \tag{3.5}
\]

Let `K=1-alpha^2/4`.  A primitive on the inherited lower branch is

\[
 P(N)={K\over8i}\operatorname {Log}{1+N\over1-N}
      +{KN\over4i(1-N^2)}+{\alpha\over4(1-N^2)}.       \tag{3.6}
\]

For `N` tending to positive infinity below the real axis,

\[
 \operatorname {Log}{1+N\over1-N}\longrightarrow-i\pi,
 \qquad P(\infty)=-{\pi K\over8}.                     \tag{3.7}
\]

Thus `g_1=P-P(infinity)`, which is exactly (0.7) for `sigma=+1`.
Conjugation gives the other sign.  Direct differentiation uses

\[
 (\ell_N^{<})'={2\over\delta_N},\qquad
 \left({N\over\delta_N}\right)'={1+N^2\over\delta_N^2}
\]

and proves (0.8).  Notice that the real constant `pi*K/8` is forced by
the lateral continuation.  Omitting it gives the wrong finite-`c`
transmission coefficient even though the local differential equation
(3.5) is still satisfied.

## 4. Uniform matched Weber lemma

The only delicate point is that a real-axis perturbation argument cannot
be run directly through `N=1`: the coefficient of `F_c''` vanishes there,
and the complementary solution has carrier `exp(2icN)`.  The Abel side of
the endpoint must be retained before the regulator is removed.

Set

\[
 t=2ic(N-1),\qquad A={1\over2}+{i\alpha\over4}.         \tag{4.1}
\]

On the lower Abel side one has `Re t>0`.  Rewriting (1.1) without dropping
any coefficient gives

\[
\boxed{
 \{t\partial_t^2+(1-t)\partial_t-A\}F_c
 +{i\over4c}
 \{-t^2\partial_t^2+(t^2-2t)\partial_t+t\}F_c=0.}     \tag{4.2}
\]

The first brace is Kummer's equation.  Its Jost solution in the right
half-plane is

\[
 U(A,1,t)\sim t^{-A}.                                  \tag{4.3}
\]

The continuation from `arg t=+pi/2` to `arg t=-pi/2` is made inside
`Re t>0`.  Hence (4.3) changes its modulus by

\[
 {\left|(-i|t|)^{-A}\right|
  \over\left|( i|t|)^{-A}\right|}=e^{-\pi\alpha/4},   \tag{4.4}
\]

and no `e^t t^(A-1)` solution is admitted.  This is the endpoint form of
the lateral branch calculation (2.5).

For completeness, the quantitative matching estimate used here is the
following elementary one-endpoint Weber lemma.  If `a=1+alpha`,
`c>=C_0 a^3`, and a point of the open interval has
`delta_N^2 c>=C_0 a^3`, then the Jost solution of (4.2), normalized by
(3.3), satisfies

\[
 \begin{aligned}
 G_c&=1+{g_1\over c}+R_c,\\
 |R_c|&\leq {C a^6\over c^2\delta_N^4},\qquad
 |R_c'|\leq {C a^7\over c^2\delta_N^5}.
 \end{aligned}                                         \tag{4.5}
\]

Here is a proof with the dependence needed in this note.  Split the lower
lateral contour into the endpoint zone `|t|<=4a^3`, the two overlap zones
`4a^3<=|t|<=c delta_N/2`, and the outer zone.  In the endpoint zone use
`U(A,1,t)` and the companion Kummer solution in variation of constants,
but put the coefficient of the companion equal to zero on `Re t>0`.
After the weight `t^A` is applied, the perturbation in the second brace of
(4.2), its first `t` derivative, and the Kummer Green kernel give

\[
 \|E\|+a^{-1}\|t\partial_tE\|
 \leq {C a^3\over c}
 \left(1+\|E\|+a^{-1}\|t\partial_tE\|\right).         \tag{4.6}
\]

The factor `a^3` consists of at most two differentiations of `t^(-A)` and
one integration across the `|t|=O(a)` turning zone.  In the overlap zones,
one integration by parts against the complementary carrier gives the same
bound with the additional factor `1/(c delta_N^2)`.  In the outer zone,
factor `Phi_alpha` and use (3.2); the source and its derivative obey

\[
 |d/p|\leq {Ca^2\over\delta_N^2},\qquad
 |(d/p)'|\leq {Ca^2\over\delta_N^3}.                   \tag{4.7}
\]

Two integrations by parts against `exp(2icN)` give, after the first
transport term is removed,

\[
 \|R_c\|_{\delta^4}+a^{-1}\|R_c'\|_{\delta^5}
 \leq {Ca^6\over c^2}
 +{Ca^3\over c\delta_N^2}
  \left(\|R_c\|_{\delta^4}
       +a^{-1}\|R_c'\|_{\delta^5}\right),             \tag{4.8}
\]

where `||R||_(delta^q)=sup delta^q|R|` along the remaining contour.
The second term is absorbed by the hypothesis.  The overlap expansions of
`U(A,1,t)` and `Phi_alpha(1+g_1/c)` agree because both have the same Jost
normalization and because (3.4) fixes their first transport coefficient.
Thus no free matching constant remains.  Equations (4.6)--(4.8) prove
(4.5).  Taking the lower or upper lateral limit only conjugates the
estimate.  On `|N|<=1/2`, `delta_N>=3/4`, so (4.5) is (0.9).

This proof also explains why an additive estimate is insufficient.  The
Kummer normalization is imposed before continuation, so the perturbation
is relative to `U(A,1,t)` and acquires the same factor (4.4).  There is no
unsuppressed `O(1/c)` term on the admitted Abel branch.

## 5. Reciprocal samples and variation

At `N=1/n`,

\[
 {1\over\sqrt{\delta_N}}={n\over\sqrt{n^2-1}},\qquad
 \ell_N^{<}=\ell_n,qquad
 {N\over4\delta_N}={n\over4(n^2-1)}.                  \tag{5.1}
\]

Substitution in (0.6)--(0.8) proves (0.12).  Since `delta_N>=3/4` for
`n>=2`, the constants are uniform in the complete reciprocal family.

The flat logarithmic derivative is

\[
 {\partial_NW_\alpha(0^++i\sigma N)
  \over W_\alpha(0^++i\sigma N)}
 ={N+i\sigma\alpha/2\over\delta_N}.                   \tag{5.2}
\]

Combining (5.2), (0.8), and (0.9) gives (0.13).  The chain rule

\[
 {d\over dn}F_{c,\sigma}(1/n,\alpha)
 =-{1\over n^2}\partial_NF_{c,\sigma}(1/n,\alpha)     \tag{5.3}
\]

then proves (0.14).  One also obtains the useful endpoint value

\[
 F_{c,\sigma}(0,\alpha)
 =e^{-h\alpha}
 \left\{1+{1\over c}
 \left({\pi K_\alpha\over8}+{\alpha\over4}\right)
 +O\left({(1+\alpha)^6\over c^2}\right)\right\}.      \tag{5.4}
\]

Consequently

\[
 |F_{c,\sigma}(1/n,\alpha)-F_{c,\sigma}(0,\alpha)|
 \leq {C(1+\alpha)e^{-h\alpha}\over n}.               \tag{5.5}
\]

For a self-adjoint scalar energy variable with spectrum in
`[alpha_0,C L]`, (0.13)--(0.14) therefore give a subunit multiplier of
size at most a polynomial in `L` times `exp(-h alpha_0)`, and its total
reciprocal-index variation has the same exponential factor.  This last
sentence is only spectral calculus for the scalar multiplier.  It does
not supply the variable-amplitude composition excluded in Section 0.
