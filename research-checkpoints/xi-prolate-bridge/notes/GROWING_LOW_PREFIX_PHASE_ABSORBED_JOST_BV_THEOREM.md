# Growing low-prefix phase-absorbed Jost BV theorem

## 0. Result and claim boundary

Use the locked schedule

\[
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad Q\leq C_0L,                                  \tag{0.1}
\]

and the same-phase labels

\[
 {\cal I}_Q=\{0,4,8,\ldots,4Q\}.                    \tag{0.2}
\]

For the endpoint-normalized exterior prolate row put

\[
 e_n=h_{n,\lambda}(\lambda),\qquad
 F_n(t)={{\cal F}_ah_{n,\lambda}(t)\over e_n},
 \qquad d_n=1-\chi_n^2.                              \tag{0.3}
\]

This note proves three narrow facts, uniformly for `n in I_Q`.

First, the exact exterior Jost equation admits a phase-absorbed coefficient
system whose Volterra mass on
`x>=x_0:=c^(-1/4)` is

\[
 \boxed{K_n(x_0)\leq
 C\{c^{-3/4}+Q^2/c\}.}                               \tag{0.4}
\]

Every fixed finite number of spectral-parameter derivatives has the
same estimate with a polynomial in `Q`, rather than an exponential in
`Q`.  The phase-absorbed coefficient system is written explicitly in
Section 2.  In particular, on every unit log shell and for every sampler
`m>=2`, the exact finite-Fejer Jost symbols have the cutoff-uniform BV
bound

\[
 \boxed{
 \|\vartheta_r b_{n,m}\|_\infty
   +\operatorname {Var}(\vartheta_r b_{n,m})
 \leq {C e^{-r/2}\over m},}                           \tag{0.5}
\]

while the phase-absorbed Volterra correction obeys the summable bound

\[
 \boxed{
 \|\vartheta_r e_{n,m}\|_\infty
   +\operatorname {Var}(\vartheta_r e_{n,m})
 \leq {C Q^2\over c}\,{e^{-5r/2}\over m^3}.}          \tag{0.6}
\]

Here `vartheta_r` is any fixed bounded-overlap unit-shell partition;
changing finitely many derivatives in (0.5)--(0.6) changes only the
fixed polynomial power of `Q`.

Second, the hard-edge Liouville graph upgrades the previously available
one-sided endpoint estimate to the uniform endpoint-white asymptotic

\[
 \boxed{
 {e_n^2\over2\pi\lambda d_n}=1+O(c^{-1/4}),
 \qquad n\in{\cal I}_Q.}                              \tag{0.7}
\]

Thus replacing the exact defect-white Jost amplitude by its common
principal amplitude costs `O(c^(-1/4))` in the same shell BV norm.

Third, the exact hard-edge parametric graph remains polynomial in the
moving label and the one-hard reciprocal **principal** carrier is
absolutely summable through the Jost/Bessel-to-endpoint transition.  If
`N=nl`, its interior stationary and endpoint-length majorants are

\[
 {C\over\sqrt c\,n l^2},\qquad
 {C\over n^{3/2}l^{5/2}},                              \tag{0.8}
\]

respectively.  After the ordered prime weight `Lambda(n)/sqrt(n)`, their
double sums are `O(c^(-1/2))` and `O(c^(-1))`.

These results remove exponential moving-label Jost constants and a
nonsummable hard reciprocal sampler as possible obstructions to the
low-prefix complete-profile reduction.  They do **not** prove `CP-FIO`.
They control exterior radial symbols in the regular part of the exact
direct-source or outer-only forms.  They do not control the inward
`f+H` source profile, `Gamma_in`, `Gamma_out`, the
completed singular Carleman kernel, its Weber edge, or the edge--bulk
crosses.  The pinned
direct-source theorem removes the formerly suspected scalar-mask and
finite-Fejer both-miss coefficient `C_(N,M)` bridge from the preferred
route; it does not supply the missing compressed operator estimate.
Section 7 states the corrected direct-source boundary and the honest
weighted outer-only targets.  In particular, this note proves no complete
signed complement floor, determinant or zero theorem, equation (5.2) of
`DIRECT_RH_ATTACK.md`, or Riemann-hypothesis conclusion.  The formal state
remains `P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

The proof uses the following exact repository bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md` | `173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc` |
| `tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py` | `5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b` |
| `notes/MOVING_LABEL_CARRIER_COFRAME_DEFECT_RIGHT_INVERSE_THEOREM.md` | `caaa4df57d43f74ef56fed6df907da6db0daa7b0f89da23cce30bc2ac9369acd` |
| `tests/test_moving_label_carrier_coframe_defect_right_inverse_theorem.py` | `31f8ffad0dc5a1f2b6a00a47b55238d64d9bc6550813d5b77b15c00da1757913` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `tests/test_growing_transition_complete_central_form_reduction.py` | `a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de` |
| `notes/GROWING_TRANSITION_BOTH_MISS_RECIPROCAL_CORE_THEOREM.md` | `0211d021fa37b423f41b2839aeda96630aaac931de0ea3d7d028f95705de29a8` |
| `tests/test_growing_transition_both_miss_reciprocal_core_theorem.py` | `0ec59c581c1109e07d57306dc3eb6752f3ba3a4080cbf4b2683c1ddfe3b41d4c` |
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_TWO_ANCHOR_BULK_TRACE_OBSTRUCTION_THEOREM.md` | `cb2afb9b28cbcaf4dbd55802b72e59a3f71cad0fa84e69ee18252c5f7dbef591` |
| `tests/test_growing_transition_direct_source_two_anchor_bulk_trace_obstruction_theorem.py` | `bd888e61906c5c696f8a7338dbf4d1b6861c888ee863d2ba6ba9ab14d05d8892` |
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/FIXED_4_12_COMPLETE_NONARCHIMEDEAN_CROSS_THEOREM.md` | `efde844cb3aa14a97277d3a7f62af4bf51f02578e4c2a06f1dc4354934713dca` |
| `tests/test_fixed_4_12_complete_nonarchimedean_cross_theorem.py` | `12a8624458a1da4cdc361e71b36356acfe0097284cb9ddb8c3bd4e15a238bca1` |

The tail theorem supplies the exact exterior equation, common outgoing
normalization, hard parametric graph, endpoint shear, and full-metric
congruence.  The moving-label theorem supplies

\[
 \mu_n=(2n+1)c-{2n^2+2n+3\over4}+O(Q^4/c),
 \qquad 0\leq n\leq4Q,                               \tag{1.1}
\]

so that, with `nu_n=mu_n/(2c)`,

\[
 |\nu_n|\leq C(Q+1),\qquad
 \nu_n=n+{1\over2}+O(Q^2/c).                         \tag{1.2}
\]

Only the first inequality is needed for the Volterra estimate.  The
second controls replacement of the exact label carrier by the integral
Fourier carrier.

## 2. Exact phase absorption

Put

\[
 t=\lambda\sqrt{1+x^2},\qquad
 \beta(x)=\arctan(1/x),                               \tag{2.1}
\]

and define

\[
 {\cal U}_n(x)=\pi\lambda\{x\sqrt{1+x^2}\}^{1/2}
 F_n(\lambda\sqrt{1+x^2}).                            \tag{2.2}
\]

The exact radial equation gives

\[
 {\cal U}_n''+
 \left(c^2-{\mu_n\over1+x^2}+Q_0(x)\right){\cal U}_n=0,
                                                                    \tag{2.3}
\]

\[
 Q_0(x)={1\over4x^2}-{1+x^2/4\over(1+x^2)^2}
       ={1-2x^2\over4x^2(1+x^2)^2}.                  \tag{2.4}
\]

For a real parameter `nu` in the interval containing all selected
`nu_n`, set

\[
 \phi_\nu(x)=cx+\nu\beta(x),\qquad
 p_\nu=\phi_\nu'=c-{\nu\over1+x^2},                  \tag{2.5}
\]

\[
 r_\nu=Q_0-{\nu^2\over(1+x^2)^2}.                    \tag{2.6}
\]

Then the coefficient in (2.3) is exactly `p_nu^2+r_nu`.
For sufficiently large `c`, uniformly on the selected parameter interval,

\[
 p_\nu\geq c/2.                                      \tag{2.7}
\]

Represent the exact outgoing solution as

\[
 {\cal U}_\nu=a_\nu\sin\phi_\nu+b_\nu\cos\phi_\nu,
 \qquad
 {\cal U}_\nu'=p_\nu
       (a_\nu\cos\phi_\nu-b_\nu\sin\phi_\nu).     \tag{2.8}
\]

The common outgoing normalization of the selected plus-phase modes is

\[
 (a_\nu,b_\nu)(\infty)=(1,0).                        \tag{2.9}
\]

This is also the natural boundary condition for the continuum outgoing
solution between two selected spectral parameters.  Substitution of
(2.8) into (2.3) is exact.  If

\[
 \zeta_\nu=-{p_\nu'\over p_\nu}
       (a_\nu\cos\phi_\nu-b_\nu\sin\phi_\nu)
       -{r_\nu\over p_\nu}
       (a_\nu\sin\phi_\nu+b_\nu\cos\phi_\nu),       \tag{2.10}
\]

then

\[
 a_\nu'=\zeta_\nu\cos\phi_\nu,
 \qquad b_\nu'=-\zeta_\nu\sin\phi_\nu.            \tag{2.11}
\]

Thus the phase term `mu/(1+x^2)` has been absorbed into `phi_nu`; it is
not iterated over a radial interval of length `O(c)`.

## 3. Small Volterra mass and parameter BV

Equations (2.7), (2.10), and (2.11) give the scalar majorant

\[
 k_\nu(x)={|p_\nu'(x)|+|r_\nu(x)|\over p_\nu(x)}.
                                                                    \tag{3.1}
\]

The elementary integrals

\[
 \int_x^\infty {2|\nu|z\over(1+z^2)^2}\,dz
 ={ |\nu|\over1+x^2},                                \tag{3.2}
\]

\[
 \int_x^\infty|Q_0(z)|\,dz
 \leq C\min\{x^{-1},x^{-3}\},                        \tag{3.3}
\]

\[
 \int_x^\infty{dz\over(1+z^2)^2}
 \leq C\min\{1,x^{-3}\}                             \tag{3.4}
\]

prove

\[
\begin{split}
 K_\nu(x):={}&\int_x^\infty k_\nu(z)\,dz\\
 \leq{}&{C\over c}\left\{
 { |\nu|\over1+x^2}
 +\min(x^{-1},x^{-3})
 +\nu^2\min(1,x^{-3})\right\}.
\end{split}                                           \tag{3.5}
\]

At `x_0=c^(-1/4)`, equations (1.2) and (3.5) prove (0.4).
Backward Gronwall applied to (2.11) now gives

\[
 \sup_{z\geq x}\{|a_\nu(z)-1|+|b_\nu(z)|\}
 +\operatorname {Var}_{[x,\infty)}(a_\nu,b_\nu)
 \leq C K_\nu(x).                                    \tag{3.6}
\]

For completeness, differentiation of (2.11) in `nu` does not reintroduce
a long-range phase loss.  Every derivative of a trigonometric factor
costs a bounded power of

\[
 |\partial_\nu\phi_\nu|=\beta(x)\leq\min\{\pi/2,x^{-1}\},
                                                                    \tag{3.7}
\]

and every derivative of `p_nu^(-1)` costs `C/c`.  Differentiating the
Volterra system and using (3.2)--(3.4) inductively yields, for each fixed
integer `J>=0`,

\[
\begin{split}
 &\sum_{j=0}^J\left[
 \|\partial_\nu^j(a_\nu-1,b_\nu)\|_{L^\infty[x_0,\infty)}
 +\operatorname {Var}_{[x_0,\infty)}
       \partial_\nu^j(a_\nu,b_\nu)\right]\\
 &\hspace{22mm}\leq
 C_J(Q+1)^{2J+2}c^{-3/4}.
\end{split}                                           \tag{3.8}
\]

This deliberately nonoptimal polynomial is sufficient for every fixed
finite stationary-phase derivative class.  The key point is that
`exp(CQ)` does not occur.

## 4. Uniform defect-white normalization

The exact exterior defect identity and evenness give

\[
 {d_n\over e_n^2}=2\int_\lambda^\infty|F_n(t)|^2\,dt.
                                                                    \tag{4.1}
\]

We split this integral at `x_0`.  On the Jost part, (2.2), (2.8), and

\[
 dt={\lambda x\over\sqrt{1+x^2}}\,dx                 \tag{4.2}
\]

give

\[
 \int_{x_0}^\infty|F_n|^2\,dt
 ={1\over\pi^2\lambda}
 \int_{x_0}^\infty
 {|a_n\sin\phi_n+b_n\cos\phi_n|^2\over1+x^2}\,dx.
                                                                    \tag{4.3}
\]

By (3.6), replacing the exact coefficient pair by `(1,0)` costs
`O(K_n(x_0)/lambda)`.  Moreover

\[
\begin{split}
 \int_{x_0}^\infty{\sin^2\phi_n\over1+x^2}\,dx
 ={}&{1\over2}\int_{x_0}^\infty{dx\over1+x^2}\\
 &-{1\over2}\operatorname {Re}
 \int_{x_0}^\infty{e^{2i\phi_n(x)}\over1+x^2}\,dx.
\end{split}                                           \tag{4.4}
\]

The function `1/(p_n(1+x^2))` is positive and decreasing.  One
integration by parts therefore bounds the last integral in (4.4) by
`C/c`.  Hence

\[
 \int_{x_0}^\infty{\sin^2\phi_n\over1+x^2}\,dx
 ={\pi\over4}+O\{x_0+c^{-1}\}.                       \tag{4.5}
\]

It remains to control, rather than extrapolate through, the hard edge.
Put `z=cx`, `R=c^2+z^2`, and

\[
 F_n(\lambda\sqrt{1+z^2/c^2})=\chi_nG_{\mu_n}(z),
 \qquad G_\mu(0)=1.                                  \tag{4.6}
\]

The exact hard-edge conjugation from the tail theorem is

\[
 \rho={z\sqrt R\over c},\qquad u_\mu=\sqrt\rho G_\mu,
                                                                    \tag{4.7}
\]

\[
 u_\mu''+\Omega_\mu^2u_\mu=0,
 \qquad
 \Omega_\mu^2=1-{\mu\over R}+{1\over4z^2}
              -{c^2+z^2/4\over R^2}.                 \tag{4.8}
\]

On `1<=z<=c^(3/4)`, `Omega_mu` is uniformly elliptic and
`Var(log Omega_mu)<=C`.  The regular initial estimate at `z=1` and the
homogeneous energy bound imply

\[
 |G_\mu(z)|\leq Cz^{-1/2}\quad(1\leq z\leq c^{3/4}),
 \qquad |G_\mu(z)|\leq C\quad(0\leq z\leq1).          \tag{4.9}
\]

Since

\[
 dt={\lambda z\over c^2\sqrt{1+z^2/c^2}}\,dz,        \tag{4.10}
\]

(4.9) proves

\[
 \int_\lambda^{\lambda\sqrt{1+x_0^2}}|F_n(t)|^2\,dt
 \leq {C\lambda\over c^2}
 \left(1+\int_1^{c^{3/4}}dz\right)
 \leq C\lambda c^{-5/4}.                             \tag{4.11}
\]

This is `O(c^(-1/4))` relative to the main scale `1/lambda`.  Combining
(3.5), (4.1), (4.3), (4.5), and (4.11) gives

\[
 {d_n\over e_n^2}
 ={1\over2\pi\lambda}\{1+O(c^{-1/4})\},             \tag{4.12}
\]

uniformly on the moving prefix.  The common plus-phase choice has
`e_n>0`, so taking the positive square root proves (0.7).

## 5. Sampled shell symbols

Let `B_{n,m}` denote the `m`th physical one-tail sampler of the pure
defect-white row `h_n/sqrt(d_n)`.  The normalization fixed in the
complete non-Archimedean theorem and the identity `Phi=U/(2sqrt(2))`
give, on the Jost range,

\[
 B_{n,m}(s)=\kappa_n q_m(s)
 \{a_n(x_m)\sin\phi_n(x_m)
       +b_n(x_m)\cos\phi_n(x_m)\},                    \tag{5.1}
\]

\[
 \kappa_n={e_n\over\sqrt{2\pi\lambda d_n}},\qquad
 q_m(s)={1\over\sqrt{2\pi m x_m(s)}},\qquad
 x_m(s)=\sqrt{m^2e^{2s}-1}.                           \tag{5.2}
\]

Equation (0.7) says `kappa_n=1+O(c^(-1/4))`.  If `m>=2` and
`s in [r,r+1]`, then

\[
 x_m(s)\asymp me^s,
 \qquad
 \|\vartheta_rq_m\|_\infty
  +\operatorname {Var}(\vartheta_rq_m)
 \leq {Ce^{-r/2}\over m}.                            \tag{5.3}
\]

Equations (3.5)--(3.6), with `x>=x_m(r)`, imply

\[
 \|\vartheta_rq_m(a_n-1,b_n)\|_\infty
 +\operatorname {Var}\{\vartheta_rq_m(a_n-1,b_n)\}
 \leq {CQ^2\over c}\,{e^{-5r/2}\over m^3}.          \tag{5.4}
\]

This proves (0.5)--(0.6).  The finite-Fejer weights lie in `[0,1]`, so
all estimates hold before the ordered cutoff limit and do not depend on
that cutoff.  The same argument after finitely many `nu` derivatives
uses (3.8).  Finally, replacing `nu_n` by `n+1/2` costs

\[
 |\nu_n-n-1/2|\,\beta(x_m)
 \leq {CQ^2\over cme^r},                              \tag{5.5}
\]

again a summable polynomial-`Q` BV symbol.

Endpoint-null source coordinates are obtained by restricting the raw
defect-white diagonal exterior space to the kernel of the endpoint row.
The endpoint shear is an exact congruence and subsequent full-metric
whitening is unitary on that restricted Hilbert space.  Thus (5.3)--(5.5)
may be used before the shear; no condition number of a chosen sheared
column realization is introduced.

## 6. Hard graph and the reciprocal sampler transition

The hard-edge parameter derivative is not estimated by iterating the
Bessel equation over a length `O(c)`.  Differentiating (4.8) and using
the bounded Liouville propagator gives the exact frozen graph

\[
 \int_0^{\log2}|\partial_s\partial_\mu G_\mu|^2\,ds
 \leq {C\over c},\qquad
 \int_0^{\log2}|\partial_\mu G_\mu|^2\,ds
 \leq {C\over c^3},                                  \tag{6.1}
\]

\[
 \int_0^{\log2}|\partial_sG_\mu|^2\,ds\leq Cc^2,
 \qquad
 \int_0^{\log2}|G_\mu|^2\,ds\leq {C\over c}.       \tag{6.2}
\]

Because `|mu_n-mu_r|<=CcQ`, (6.1) gives

\[
 \|G_{\mu_n}-G_{\mu_r}\|_2\leq {CQ\over\sqrt c},
 \qquad
 \|\partial_s(G_{\mu_n}-G_{\mu_r})\|_2
 \leq C\sqrt c\,Q.                                  \tag{6.3}
\]

The exponentially small `chi_n-chi_r` endpoint term is already included
in the KRD remainder of the tail theorem.  Thus the hard exact row has a
polynomial moving-label graph, and no fixed-label Bessel constant is used.

We also record the arithmetic summability of the one-hard reciprocal
principal carrier.  Its exact geometric critical point for `N=nl` is

\[
 x_1={1\over N},\qquad x_2=N,qquad
 s_0={1\over2}\log(1+N^{-2}).                        \tag{6.4}
\]

For the reflected leading amplitude

\[
 A_m(s)={\{1+x_m(s)^2\}^{1/4}
              \over\sqrt{2\pi}\,m\sqrt{x_m(s)}},    \tag{6.5}
\]

one has at (6.4)

\[
 A_1A_l\leq {C\sqrt N\over l},\qquad
 |\Phi''(s_0)|\asymp cN^3.                           \tag{6.6}
\]

The ordinary stationary-phase/BV estimate therefore gives

\[
 {A_1(s_0)A_l(s_0)\over\sqrt{cN^3}}
 \leq {C\over\sqrt c\,n l^2}.                       \tag{6.7}
\]

When the stationary width meets the endpoint, use the interval length
instead.  On `0<=s<=s_0`, `x_1(s)\asymp\sqrt{s}`, and hence

\[
 \int_0^{s_0}A_1(s)A_l(s)\,ds
 \leq {C\over l}\int_0^{CN^{-2}}s^{-1/4}\,ds
 \leq {C\over n^{3/2}l^{5/2}}.                      \tag{6.8}
\]

The two bounds match at `N asymp c`.  The Chebyshev consequence of the
pinned PNT gives

\[
 \sum_{n\leq X}{\Lambda(n)\over\sqrt n}\leq C\sqrt X,
 \qquad
 \sum_{n>X}{\Lambda(n)\over n^2}\leq {C\over X}.    \tag{6.9}
\]

Consequently

\[
 {1\over\sqrt c}\sum_{n,l\geq1}
 {\Lambda(n)\over n^{3/2}l^2}=O(c^{-1/2}),            \tag{6.10}
\]

and, splitting at `n=c`,

\[
 \sum_{nl\geq c}{\Lambda(n)\over n^2l^{5/2}}
 =O(c^{-1}).                                          \tag{6.11}
\]

Equations (6.1)--(6.11) prove that the hard reciprocal transition does
not create a nonsummable sample row.  The statement is deliberately for
the principal carrier plus the exact hard polynomial graph; promotion to
the complete signed source operator requires the compression estimate
below.

## 7. Exact direct-source and outer-only boundary

The pinned direct-source theorem supersedes a masked assembly target at
source level.  At finite Fejer cutoff its honest ordered form is

\[
 Q^\uparrow_{M,L}=-{\cal W}_Z(X_M,O_M),\qquad
 Q^{\rm herm}_{M,L}={Q^\uparrow_{M,L}+
                    (Q^\uparrow_{M,L})^*\over2}.       \tag{7.1}
\]

Its exact formula (3.4), boundary identity (4.4), ordered prime formula
(5.7), and carrier identities (6.8)--(6.9) need no scalar masks or
midpoint rows.  Thus `C_(N,M)` is bookkeeping for an alternative
partition, not an intrinsic missing coefficient in (7.1).

This correction does not turn (0.4)--(0.8) into a complete direct-source
operator theorem.  The left profile in (5.7) contains the inward samples
of `f+H`, whereas the present Jost theorem controls the exterior `H` row.
Moreover the exact continuous kernel has

\[
 {2\over e^r-e^{-r}}-2(1+e^{-r})={1\over r}-4+O(r),  \tag{7.2}
\]

so the corner `r=s+t=0` produces the Carleman kernel `1/(s+t)`.  The hard
graph in Section 6 controls a radial row through that corner; it does not
determine the sign of the compressed Carleman/Weber and edge--bulk
assembly.

For comparison, the exact outer-only route has a particularly transparent
finite-cutoff target.  Let `C_Q` synthesize endpoint-null columns into the
pure modal coefficients, put

\[
 D_Q^\#=C_Q^*\operatorname {diag}(d_n)C_Q,\qquad
 J_Q=\operatorname {diag}(\sqrt {d_n})C_Q(D_Q^\#)^{-1/2},
 \qquad J_Q^*J_Q=I,                                  \tag{7.3}
\]

and let `B_(M,Q)^#` be the complete physical one-tail row with Fejer
weights `omega_M`, endpoint shear, and this full-metric whitening.  The
correct finite-cutoff Toeplitz coefficients are weighted:

\[
 \Gamma_{r,M}={1\over2\pi}\sum_{m\geq1}{\omega_M(m)^2\over m}
 \int_0^{\arcsin(1/m)}\cos(4r\beta)\,d\beta,\qquad
 T_{Q+1,M}=(\Gamma_{j-k,M})_{0\leq j,k\leq Q}.       \tag{7.4}
\]

Accordingly the honest Gram comparison is

\[
 \sup_M\left\|2(B_{M,Q}^\#)^*B_{M,Q}^\#
          -J_Q^*T_{Q+1,M}J_Q\right\|
\leq C Q^B c^{-\eta}.                               \tag{7.5}
\]

Equation (7.5) is an unproved target in this note, not a fourth theorem.
The equal-sampler slow phase gives (7.4) exactly.  Equations
(0.4)--(0.8) supply the uniform normalization, Volterra, fast-phase, and
one-hard reciprocal estimates required for a proof of (7.5); for the
last hard sampler tail one may split at `m=c^(1/4)` and use the exact
`m^(-4)` tail frame beyond the split.  The cutoff weights never exceed
one.  What must not be done is compare a finite Fejer row to the
unweighted limiting matrix.  After the ordered limit, (7.4) tends to the
usual `T_(Q+1)`, and (7.3) preserves its quarter floor.

The centered Archimedean multiplier has a second, stricter target.  With

\[
 a(\xi)=\operatorname {Re}\psi\left({1\over4}+{i\xi\over2}\right)
        -\log\pi,                                    \tag{7.6}
\]

its leading weighted Toeplitz density is

\[
 \rho_M(\beta)=\left\{\sum_{m\leq\csc\beta}
       {\omega_M(m)^2\over2\pi m}\right\}
 \log {1\over2\pi\sin\beta\cos\beta}.             \tag{7.7}
\]

At Fourier resolution `1/Q`, its endpoint mass gives a uniform
compression bound `O(log^2(Q+2))=o(L)`.  To promote this principal symbol
to the exact row one still needs the finite-Fejer logarithmic-multiplier
WKB estimate

\[
 \sup_M\left\|2(B_{M,Q}^\#)^*\{a(D)-\log c\}B_{M,Q}^\#
             -J_Q^*T_{Q+1}(\rho_M)J_Q\right\|
 \leq C Q^B c^{-\eta}.                               \tag{7.8}
\]

The fixed finite derivative hierarchy in (3.8) and the hard graph (6.1)
are the analytic inputs to (7.8), but this note does not silently identify
shell BV with the nonlocal functional-calculus estimate.  Thus (7.8) is
the earliest outer-only estimate not proved here.

Even after (7.5)--(7.8), the complete direct-source negative remainder
requires a cutoff-uniform compression estimate for the regular kernel,
the inward `f+H` profile, the Weber edge, the edge--bulk crosses, and the
full source congruence together.  Imposing `eta=Gamma_out=0` only removes
the two total endpoint rows; the pinned two-anchor obstruction theorem
shows that it does not erase the completed Carleman bulk.  Consequently
the exact complete profile minus the already extracted same-side and
reflected principal frames is **not yet proved** to have negative norm
`o(L)`.

## 8. Reproduction

Run the focused regression with

```text
python3 -B -m unittest \
  tests.test_growing_low_prefix_phase_absorbed_jost_bv_theorem -v
```

The test checks the phase identity, Volterra integrals, defect
normalization scale, shell BV exponents, reciprocal hard transition,
frozen dependency hashes, scope language, ASCII hygiene, and displayed
TeX.
