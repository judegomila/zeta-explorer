# Growing low-prefix half-power far-cross theorem

## 0. Result and exact scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 L=2\log\lambda,\qquad c=2\pi\lambda^2,                 \tag{0.1}
\]

\[
 N=2^{9600\lambda^2},\qquad
 R=\sqrt N=2^{4800\lambda^2},\qquad
 Q\leq C_0L,\qquad q=Q+1.                               \tag{0.2}
\]

Let \(W_Q^\#\) be the exact compact, anchor-deflated, endpoint-sheared
physical synthesis underlying the strict low-prefix matrix, and let

\[
 D_Q^\#=(C_Q^\#)^*\operatorname {diag}(d_n)C_Q^\#,
 \qquad
 V_Q=W_Q^\#(D_Q^\#)^{-1/2}.                             \tag{0.3}
\]

All inverse powers in this note are taken on the support of \(D_Q^\#\).
The range of \(C_Q^\#\) consists of zero-integral, endpoint-null combinations
of the same-phase modal inventory

\[
 {\cal I}_Q=\{0,4,8,\ldots,4Q\},\qquad f(\lambda)=0.     \tag{0.4}
\]

Let \(\kappa\) be the normalized physical anchor, put

\[
 {\cal K}=H_+\cap\kappa^\perp,\qquad
 A=P_{\cal K}Q_+P_{\cal K}|_{\cal K},                  \tag{0.5}
\]

and choose any allowed half-power split

\[
 {\cal K}=Y\oplus F,\qquad
 F\subset {\cal K}_L^\perp\cap\operatorname {ran}P_{>R}^+,
 \qquad
 {\cal K}_Q:=\operatorname {ran}V_Q
       \subset {\cal K}_L\subset Y.                    \tag{0.6}
\]

Then the exact source-Cauchy displacement, before any pole,
Archimedean, or prime block is separated, gives

\[
 \boxed{
 \|P_FAV_Q\|
 \leq {K_{\lambda,N}\over R}{\mathfrak M}_Q
 +{\sqrt2B_b(\lambda)\over\sqrt R}
       \left\{\sqrt L\,{\mathfrak E}_Q
                    +\sqrt{2\over N}\,{\mathfrak M}_Q\right\}.}
                                                                    \tag{0.7}
\]

Here

\[
 K_{\lambda,N}=\log(N+2)+C_{|a|}(\lambda)+c_\lambda,    \tag{0.8}
\]

\[
 d_{\rm LS}=6\,96^{-5-(320\pi/\log2)\lambda^2},
 \qquad
 {\mathfrak M}_Q={23L\lambda c^3\over2\sqrt2\pi}
                    \sqrt{q\over d_{\rm LS}},           \tag{0.9}
\]

and an absolute constant \(C\) may be used in

\[
 {\mathfrak E}_Q
 =Cq^{3/2}(1+\sqrt c)
   +{1\over4}\sqrt{qV_0(\lambda)\over\lambda},
 \qquad
 V_0(\lambda)={1\over\lambda}+8\pi\lambda.            \tag{0.10}
\]

Every factor in (0.7) is a frozen explicit elementary quantity except the
single absolute constant already admitted in the endpoint-null tail theorem.
In particular,

\[
 \boxed{
 \|P_FAV_Q\|
 =O_{C_0}\!\left(\operatorname {poly}(\lambda,L)
                  e^{-M_{2400}\lambda^2}\right)
 =o(\lambda\sqrt L),}                                  \tag{0.11}
\]

where

\[
 \boxed{
 M_{2400}=4800\log2-{160\pi\log96\over\log2}
 =17.14329605896023403855\ldots>0.}                     \tag{0.12}
\]

At the genuine lower Ritz value \(u\), write

\[
 B_u=A-uI=
 \begin{pmatrix}D_u&\Gamma_u^*\\ \Gamma_u&H_u\end{pmatrix},
 \qquad H_u\succeq G_RI_F,
 \qquad G_R=4800(\log2)\lambda^2+o(\lambda^2).          \tag{0.13}
\]

If

\[
 \Delta_Q=(V_QV_Q^*)^\dagger|_{{\cal K}_Q},\qquad
 \Gamma_Q=\Gamma_u|_{{\cal K}_Q},                      \tag{0.14}
\]

then the quotient polar identity and (0.11) give

\[
 \boxed{
 \ell_Q:=\|H_u^{-1/2}\Gamma_Q\Delta_Q^{-1/2}\|^2
 \leq {\|P_FAV_Q\|^2\over G_R}=o(L).}                 \tag{0.15}
\]

Thus the prefix-to-far erosion isolated in the physical-coframe barrier is
closed.  This theorem does not control the retained complement
\(R_Q=Y\ominus{\cal K}_Q\), prove a signed floor there, prove either complete
strict sector sign, establish equation (5.2) of `DIRECT_RH_ATTACK.md`, prove a
determinant limit, or prove the Riemann hypothesis.  The formal state remains
`P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

No new external source is used.  The exact repository inputs are frozen at
the following bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_LOW_PREFIX_PHYSICAL_COFRAME_HALF_POWER_SCHUR_BARRIER.md` | `1f37e551fe37a9274961032386aa995d98d45a0c88b8622cb39ad25ff9cfb032` |
| `notes/LOCKED_HALF_POWER_GRAPH_SCHUR_REDUCTION.md` | `1d900d615aaa21845f8413b9677286901bf41855d43c7df5c6fecea88f06a1b1` |
| `notes/RELATIVE_ODD_GAP_ENDPOINT_SCHUR_GATE.md` | `81bc4055b644a409c10d9d06f145040e822452dc5fc9a0fc4888c63fb535f3ab` |
| `tests/test_relative_odd_gap_endpoint_schur.py` | `cee76e8a21c3406b49bd123832a4e47bacd41ebf16622cf91c69fd48ba130127` |
| `notes/HIGH_FOURIER_COERCIVITY.md` | `5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821` |
| `tests/test_high_fourier_coercivity.py` | `64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae` |
| `notes/BLOCK_QUOTIENT_ACTION_THEOREM.md` | `31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4` |
| `tests/test_block_quotient_action.py` | `64a436a48fafbb481d7691f086ca1b49ed3fd692d90d08489a95d513df129b64` |
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `tests/test_growing_transition_sampling.py` | `ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac` |
| `notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md` | `173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc` |
| `tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py` | `5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b` |
| `notes/GROWING_LOW_PREFIX_OUTER_TOEPLITZ_CENTERED_MULTIPLIER_THEOREM.md` | `b08aef1bc818545f23f3f0d2dcf0c5a089c7ed9d409ed51019e0ce8f1370db44` |
| `tests/test_growing_low_prefix_outer_toeplitz_centered_multiplier_theorem.py` | `16944150af74b97ff3279b0cf35dc118adedd86295502d436ed9c173be649ba7` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md` | `3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f` |
| `tests/test_defect_relative_projection.py` | `21b33670a9d017d363f53776ba05ca93ce3588eb049ba9dcb7e61f202bc01999` |
| `notes/SAME_ANCHOR_ENDPOINT_RATE_ATTACK.md` | `9324d758eca900f646eb5a6187cb5f316ece99b64ec77d7da2eb72cc7c7ff4a4` |
| `tests/test_same_anchor_endpoint_rate_attack.py` | `dd63d4a84cbd8330893c11d273648435f57ee858ebd06231e7b3ad811a5712fb` |

The displacement and high-mode inputs fix the complete Weil matrix and its
rank-one parity commutator.  The arithmetic and transition inputs fix the
dilation and all-index defect bounds.  The endpoint-null tail input is used
only for the exact Fourier-transform samples at the physical endpoint.  No
zero table or global Weil positivity is used.

## 2. Anchor deflation, correction, and the exact physical representative

The anchor projection is already encoded on the source side.  For every raw
zero-integral source column \(c_t\), the split-block theorem gives

\[
 P_\kappa Tc_t=T(c_t-\alpha_tc_4).                       \tag{2.1}
\]

The later endpoint shear is another source-column congruence.  Consequently
every vector in the range of \(C_Q^\#\), including all anchor coefficients,
is one same-phase modal combination in (0.4).  There is no additional
physical \(P_\kappa\) to commute through a derivative estimate.

For a source vector \(z\) on the support of \(D_Q^\#\), put

\[
 f_z=C_Q^\#(D_Q^\#)^{-1/2}z.                             \tag{2.2}
\]

The full exterior metric, including every shear and anchor cross term, gives

\[
 D(f_z):=\sum_{n\in{\cal I}_Q}d_n|a_n(z)|^2=\|z\|^2.    \tag{2.3}
\]

In particular, no coordinate condition number appears below.

The radical-domain correction is

\[
 \widetilde f_z=f_z-f_z(0)\psi(2\lambda\,\cdot).         \tag{2.4}
\]

It is even, zero-integral, vanishes at the origin, and has the same endpoint
value as \(f_z\).  Both the bump and its dilation derivative are supported in
\(|x|<1/(2\lambda)\).  Since \(u\geq1/\lambda\) and \(m\geq1\) in the
central arithmetic sum, one has the two exact invisibility identities

\[
 A_\lambda\widetilde f_z=A_\lambda f_z,
 \qquad
 A_\lambda{\cal L}\widetilde f_z=A_\lambda{\cal L}f_z,
 \qquad
 {\cal L}={1\over2}+x{d\over dx}.                        \tag{2.5}
\]

Let \(\ell=L/2=\log\lambda\), write

\[
 g_f(t)=(A_\lambda f)(e^t)
 =e^{t/2}\sum_{m\leq\lambda e^{-t}}f(me^t),
 \qquad -\ell\leq t\leq\ell,                           \tag{2.6}
\]

and let

\[
 K_f(t)={g_f(t)+g_f(-t)\over2}.                          \tag{2.7}
\]

The actual compact synthesis is exactly

\[
 V_Qz=P_NK_{f_z}.                                        \tag{2.8}
\]

Equation (2.8) includes the anchor deflation because of (2.1), and includes
the corrected radical representative because of (2.5).

## 3. Endpoint nullity removes all derivative atoms

The zero extension of a single prolate mode has endpoint atoms under
\({\cal L}\), and its arithmetic sum jumps at every threshold
\(t_m=\log(\lambda/m)\).  For the combined source (2.2), each such jump is

\[
 \sqrt{\lambda/m}\,f_z(\lambda)=0.                      \tag{3.1}
\]

The source zero extension also has no endpoint delta because
\(f_z(\lambda)=f_z(-\lambda)=0\).  Thus termwise differentiation is an
identity in \(L^2\), not merely an identity away from thresholds:

\[
 g_{f_z}'(t)=(A_\lambda{\cal L}f_z)(e^t).                \tag{3.2}
\]

Inversion evenization interchanges the two endpoint traces, so \(K_{f_z}\)
is continuous after periodic identification.  Moreover

\[
 K_{f_z}'=S_-g_{f_z}',\qquad S_-={I-J\over2},             \tag{3.3}
\]

and \(S_-\) is a contraction.

For every admitted transition mode below the pinned transition index, the
growing sampling theorem gives

\[
 \|{\cal L}h_{n,\lambda}\|_2\leq23c^3.                  \tag{3.4}
\]

Weighted Cauchy--Schwarz, the all-index floor in (0.9), and (2.3) therefore
give

\[
 \|{\cal L}f_z\|_2
 \leq23c^3\sum_{n\in{\cal I}_Q}|a_n(z)|
 \leq23c^3\sqrt{q\over d_{\rm LS}}\,\|z\|.             \tag{3.5}
\]

The exact arithmetic-map norm on additive-even sources is

\[
 \|A_\lambda h\|_2\leq{\lambda\over\sqrt2}\|h\|_2.   \tag{3.6}
\]

Combining (3.2)--(3.6) proves

\[
 \|K_{f_z}'\|_2
 \leq{23\lambda c^3\over\sqrt2}
       \sqrt{q\over d_{\rm LS}}\,\|z\|.                \tag{3.7}
\]

Let \({\cal M}\) be the integer Fourier-index operator on the physical
circle.  Since the physical derivative is \((2\pi i/L){\cal M}\), (3.7)
first gives the unprojected operator bound and then, by (2.8), the projected
one:

\[
 \boxed{
 \|{\cal M}K_{f_\bullet}\|\leq{\mathfrak M}_Q,
 \qquad
 \|{\cal M}V_Q\|\leq{\mathfrak M}_Q.}                  \tag{3.8}
\]

Here \(z\mapsto K_{f_z}\) is the unprojected synthesis.  Projection causes no
loss in the second bound because \(P_N\) commutes with \({\cal M}\) and is an
orthogonal contraction.  The first bound is retained for the endpoint error
in Section 4.

## 4. Exact Poisson endpoint and finite-Fourier evaluation

Let \(H={\cal F}_af_z\).  Since \(\lambda^2\) is not an integer on the
locked half-integer schedule and \(\int f_z=0\), Poisson summation gives

\[
 f_z(0)+2\sum_{m\geq1}f_z(m/\lambda)
 =2\lambda\sum_{r\geq1}H(r\lambda).                     \tag{4.1}
\]

At the two physical endpoints,

\[
 g_{f_z}(\ell)=\sqrt\lambda f_z(\lambda),
 \qquad
 g_{f_z}(-\ell)={1\over\sqrt\lambda}
                    \sum_{m\geq1}f_z(m/\lambda).        \tag{4.2}
\]

Equations (4.1)--(4.2) and endpoint nullity give the exact combined formula

\[
 \boxed{
 K_{f_z}(\ell)
 ={\sqrt\lambda\over2}\sum_{r\geq1}H(r\lambda)
   -{f_z(0)\over4\sqrt\lambda}.}                        \tag{4.3}
\]

This is an identity for the complete physical state.  It is not obtained by
bounding the two endpoint branches separately.

Use the exact one-tail exterior isometry

\[
 U_f(s)=\sqrt{2\lambda}\,e^{s/2}H(\lambda e^s),
 \qquad \|U_f\|_2^2=D(f).                                \tag{4.4}
\]

On the defect-unit sphere, the endpoint-null tail theorem gives

\[
 |U_f(0)|^2\leq CcQ^3,
 \qquad
 |U_f(s)|^2\leq CQ^3e^{-3s}\quad(s\geq\log2).           \tag{4.5}
\]

Because

\[
 {\sqrt\lambda\over2}H(r\lambda)
 ={1\over2\sqrt2}\,r^{-1/2}U_f(\log r),                \tag{4.6}
\]

the \(r=1\) term in (4.3) costs \(C\sqrt c\,q^{3/2}\),
while the remaining sum is bounded by
\(Cq^{3/2}\sum_{r\geq2}r^{-2}\).  The zero-integral modal evaluation bound
is

\[
 |f_z(0)|^2\leq qV_0(\lambda)D(f_z).                    \tag{4.7}
\]

Equations (4.3)--(4.7) prove

\[
 \boxed{|K_{f_z}(\ell)|\leq{\mathfrak E}_Q\|z\|.}      \tag{4.8}
\]

It remains to evaluate the actual finite Fourier projection.  If
\(k_n\) are the normalized Fourier coefficients of the periodic
\(H^1\) function \(K_{f_z}\), then

\[
 \delta(P_NK_{f_z})=\sum_{|n|\leq N}k_n,
 \qquad
 \sqrt L\,K_{f_z}(\ell)=\sum_{n\in\mathbb Z}k_n.        \tag{4.9}
\]

The second series is absolutely convergent by Cauchy--Schwarz with the
\(H^1\) weight.  Keeping the two Fourier signs together gives

\[
 \begin{aligned}
 |\delta(P_NK_{f_z})-\sqrt L\,K_{f_z}(\ell)|
 &\leq\sum_{|n|>N}|k_n|\\
 &\leq\left(\sum_{|n|>N}{1\over n^2}\right)^{1/2}
          \|{\cal M}K_{f_z}\|_2\\
 &\leq\sqrt{2\over N}\,{\mathfrak M}_Q\|z\|.
 \end{aligned}                                          \tag{4.10}
\]

Therefore the exact boundary row on the whitened compact prefix obeys

\[
 \boxed{
 \|\delta V_Q\|
 \leq\sqrt L\,{\mathfrak E}_Q
      +\sqrt{2\over N}\,{\mathfrak M}_Q.}              \tag{4.11}
\]

No endpoint value of the unprojected state has been substituted silently for
the endpoint value of its projection.

## 5. Source-Cauchy displacement and the high row

Use the normalized parity bases

\[
 e_0^+=V_0,\qquad
 e_n^+={V_n+V_{-n}\over\sqrt2},\qquad
 e_n^-={V_n-V_{-n}\over\sqrt2}\quad(n\geq1).            \tag{5.1}
\]

Then

\[
 {\cal M}e_0^+=0,\qquad {\cal M}e_n^+=ne_n^-,
 \qquad
 \delta(e_0^+)=1,\qquad\delta(e_n^+)=\sqrt2.            \tag{5.2}
\]

The complete finite Weil matrix satisfies the exact parity displacement

\[
 \boxed{{\cal M}Q_+-Q_-{\cal M}=|\beta\rangle\delta,}
 \qquad
 \beta=\sum_{n=1}^N\sqrt2b_ne_n^-.                      \tag{5.3}
\]

Let \({\cal M}_{>R}^{-1}e_n^-=n^{-1}e_n^+\) for \(n>R\).
Applying (5.3) to an even vector \(v\) and retaining the entire combined
operator gives

\[
 P_{>R}^+Q_+v
 ={\cal M}_{>R}^{-1}P_{>R}^-Q_-{\cal M}v
  +{\cal M}_{>R}^{-1}P_{>R}^-\beta\,\delta(v).           \tag{5.4}
\]

The frozen Cauchy and diagonal bounds give

\[
 \|Q_-\|\leq K_{\lambda,N},\qquad |b_n|\leq B_b(\lambda). \tag{5.5}
\]

Moreover, the rank-one tail is square summable with its exact high
denominator:

\[
 \begin{aligned}
 \|{\cal M}_{>R}^{-1}P_{>R}^-\beta\|^2
 &=2\sum_{n=R+1}^N{|b_n|^2\over n^2}\\
 &\leq {2B_b(\lambda)^2\over R}.
 \end{aligned}                                          \tag{5.6}
\]

Because \(F\subset\operatorname {ran}P_{>R}^+\), equations
(5.4)--(5.6) imply the cancellation-preserving operator estimate

\[
 \boxed{
 \|P_FQ_+V_Q\|
 \leq {K_{\lambda,N}\over R}\|{\cal M}V_Q\|
      +{\sqrt2B_b(\lambda)\over\sqrt R}\|\delta V_Q\|.}
                                                                    \tag{5.7}
\]

This is the point at which taking separate absolute norms of the pole,
Archimedean, and prime matrices would lose the argument.  Equations
(3.8), (4.11), and (5.7) prove (0.7).

## 6. Compression, scale, and the far-return loss

Every \(v\in\operatorname {ran}V_Q\) belongs to \({\cal K}\), and
\(F\subset{\cal K}\).  Hence

\[
 P_FAv=P_FP_{\cal K}Q_+P_{\cal K}v=P_FQ_+v.             \tag{6.1}
\]

This proves that the anchor/complement compression does not alter (5.7).
Also \(F\perp{\cal K}_L\supset{\cal K}_Q\), so

\[
 P_F(A-uI)V_Q=P_FAV_Q.                                  \tag{6.2}
\]

The only inverse defect in (0.7) occurs in \({\mathfrak M}_Q\).  Explicitly,

\[
 d_{\rm LS}^{-1/2}
 ={96^{5/2}\over\sqrt6}
  \exp\!\left({160\pi\log96\over\log2}\lambda^2\right). \tag{6.3}
\]

Therefore

\[
 {1\over R}d_{\rm LS}^{-1/2}
 ={96^{5/2}\over\sqrt6}e^{-M_{2400}\lambda^2}.          \tag{6.4}
\]

The endpoint term in (0.7) has the stronger factor
\(R^{-1/2}=e^{-2400(\log2)\lambda^2}\), with no inverse defect.
The finite-Fourier endpoint-error term has both this factor and
\(N^{-1/2}d_{\rm LS}^{-1/2}\), so it is smaller again.  Since

\[
 K_{\lambda,N}=O(\lambda^2),\qquad
 B_b(\lambda)=O(\lambda\log\lambda),\qquad q=O(L),       \tag{6.5}
\]

equations (6.3)--(6.5) prove (0.11).

Finally take a singular-value decomposition

\[
 V_Q=U\Sigma Z^*.                                       \tag{6.6}
\]

Injectivity of the strict low-prefix synthesis makes \(Z\) unitary on the
source support and \(U\) unitary onto \({\cal K}_Q\).  Thus

\[
 \Delta_Q^{-1/2}=U\Sigma U^*,                            \tag{6.7}
\]

and, for every left operator \(T\),

\[
 \|T\Delta_Q^{-1/2}\|=\|TV_Q\|.                        \tag{6.8}
\]

Apply (6.8) with \(T=H_u^{-1/2}\Gamma_Q\), use (6.2), and then use
\(H_u\succeq G_RI\).  This proves (0.15).  Equality in (6.8) is an equality
of operator norms; the two displayed operators have different source
domains and are not asserted to be literally identical.

The resulting \(o(L)\) loss closes only the prefix-to-far gate.  The
generalized Schur conditions on \(R_Q=Y\ominus{\cal K}_Q\) remain exactly as
recorded in the physical-coframe barrier.

## 7. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_low_prefix_half_power_far_cross_theorem -v

The regression checks every frozen hash, the no-atom derivative identity,
the exact Poisson endpoint, the finite-Fourier endpoint error, the source
displacement and rank-one tail, the positive exponent margin, the quotient
polar identity, displayed TeX, ASCII hygiene, and the fail-closed scope.
