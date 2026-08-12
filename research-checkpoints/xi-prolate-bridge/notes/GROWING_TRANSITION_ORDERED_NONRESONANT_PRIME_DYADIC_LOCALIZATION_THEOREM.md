# Growing-transition ordered nonresonant prime dyadic-localization theorem

## 0. Result and exact scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=2\log\lambda,
 \qquad h={\pi\over4}.                              \tag{0.1}
\]

This theorem is restricted to the realized polylogarithmic-base packet

\[
 B_L=(\log L)^4,\qquad
 \alpha_i=CL+B_L+a_i+O(L^{-1}),\qquad
 \beta_j=B_L+b_j+O(L^{-1}),                        \tag{0.2}
\]

with `m>7` fixed nodes in each cluster, the same plus Fourier phase, and

\[
 {1\over2}<\sigma:=hC<1.                            \tag{0.3}
\]

Form the physical source and impose exactly the seven rows

\[
 \ell_{\rm int},\quad \Gamma_{\rm in},\quad
 \rho_{\rm out},\quad \eta,\quad
 \widehat{\mathcal A}^{1,{\rm mod}}_0,\quad
 \widehat{\mathcal A}_1,\quad \ell_0.              \tag{0.4}
\]

Here `ell_0(g)=a_0(g)=g(0)`.  Thus the fixed invisible-origin correction
vanishes identically on `E`; it is not an eighth row.

Let `E` and `P_E` be the resulting nonzero subspace and its exact
exterior-defect-white orthogonal projection from the frozen forced-prime
theorem.  Thus

\[
 \dim E\geq m-7>0,\qquad
 T_L={e^{hCL}\over L^{2m}}
 ={(c/(2\pi))^\sigma\over L^{2m}},                 \tag{0.5}
\]

and, for one fixed `c'_m>0`,

\[
 P_E\widehat Q_{\rm off}P_E
 \succeq {c'_m\over8}T_LP_E.                       \tag{0.6}
\]

For any fixed `delta>0`, define the integer cutoffs

\[
 \boxed{
 N_L=\left\lceil c^{5-\sigma+\delta}\right\rceil,
 \qquad
 M_L=J_L=\left\lceil c^{4-\sigma+\delta}\right\rceil.} \tag{0.7}
\]

Here `M_L` is the cutoff in the inward arithmetic index; it is not the
Fejer parameter, which is denoted by `F` below.  Let
`widehat Q_box` be the sum of the exact ordered nonresonant prime rows
with

\[
 1\leq r\leq M_L,\qquad 1\leq l\leq J_L,
 \qquad 2\leq n\leq N_L.                            \tag{0.8}
\]

The letter `r` in this note is the index called `m` in the reciprocal
gauge theorem.  No product regrouping has been made.  The complement of
(0.8) satisfies the uniform operator estimate

\[
 \boxed{
 \left\|P_E(\widehat Q_{\rm off}-\widehat Q_{\rm box})P_E\right\|
 =o(T_L).}                                          \tag{0.9}
\]

Partition (0.8) into the ordinary coordinate dyadic boxes

\[
 2^i\leq r<2^{i+1},\qquad
 2^j\leq l<2^{j+1},\qquad
 2^k\leq n<2^{k+1},                                \tag{0.10}
\]

intersected with `(r,l) ne (1,1)` and `ln ne r`.  There are at most

\[
 \mathcal B_L
 \leq(1+\lceil\log_2M_L\rceil)
       (1+\lceil\log_2J_L\rceil)
       (1+\lceil\log_2N_L\rceil)
 \leq C_\delta L^3                                \tag{0.11}
\]

nonempty boxes.  For all sufficiently large locked `lambda`, at least
one of them, denoted `mathcal D_L`, obeys

\[
 \boxed{
 \lambda_{\max}\!\left(
 P_E\widehat Q_{\mathcal D_L}P_E\bigm|_E\right)
 \geq {c'_mT_L\over16\mathcal B_L}
 \geq c_{m,C,\delta}{T_L\over L^3}>0.}             \tag{0.12}
\]

Equation (0.12) asserts one positive eigenvalue, equivalently one
positive direction, in one box.  It does **not** assert a Loewner lower
bound for that box.  The box can be indefinite.

The result is only for the polylogarithmic seven-row packet.  It does not
apply to a fixed-linear schedule, a fixed-product mask, a regrouping by
`rln`, a same-cutoff radical, or a growing packet dimension.  It proves
neither localization to one triple nor a complete central sign,
determinant statement, or RH.

## 1. Frozen inputs

The following repository bytes are binding inputs.  In particular, the
first pair is the superseding seven-row forced-prime core after its
independent strict audit.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md` | `787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79` |
| `tests/test_growing_transition_forced_ordered_nonresonant_prime_frame_theorem.py` | `73913c60eb3862668631a0f846be2d40c82978c62248c9084c173d76913a44b7` |
| `notes/GROWING_TRANSITION_ETA_NULL_RENORMALIZED_SOURCE_KREIN_INTERTWINER_THEOREM.md` | `0c7c20639645d912d0e896bf064f83e3bd26078d716a183fa703d1586673d0d5` |
| `tests/test_growing_transition_eta_null_renormalized_source_krein_intertwiner_theorem.py` | `fac207d0c4847e7f624848aa174fae013f7099382d9ba785651be634849c5505` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_RESONANCE_AND_NONRESONANT_FRAME_GATE_THEOREM.md` | `511abdb8dd5e9bfe765e518812f19ab8df351803438c0a731387f3dd8d413460` |
| `tests/test_growing_transition_ordered_prime_resonance_and_nonresonant_frame_gate_theorem.py` | `634ec6af8e27db305c22d305d12bdd650b834d947c8afa9a3d6dbf27120482b8` |
| `notes/TRANSITION_PROLATE_OUTER_THEOREM.md` | `215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6` |
| `tests/test_transition_prolate_outer.py` | `bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433` |
| `notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md` | `7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564` |
| `tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py` | `caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c` |
| `notes/GROWING_TRANSITION_CURVED_TWO_ENDPOINT_FIO_SHELL_THEOREM.md` | `ddb1769d6e6f2b3214cb8191d631a161a1312f18c5bfbba4ca2ad11bb9f93341` |
| `tests/test_growing_transition_curved_two_endpoint_fio_shell_theorem.py` | `8d6bf688ffc938691789a558900ac95467a6631203f5fd262a5f4356431422cb` |
| `notes/GROWING_TRANSITION_EULER_RESOLVENT_CURVED_HARD_ALIAS_COMPLETION_THEOREM.md` | `429488fd14d246a6bcbe0495e4a6290569535536e118ff05ac9ad581845ac0dd` |
| `tests/test_growing_transition_euler_resolvent_curved_hard_alias_completion_theorem.py` | `6f8b65303cd8611c0d0f54ad8996808d541de91ca03150531e57488758aeeb16` |
| `notes/GROWING_TRANSITION_COMPLETE_ODD_LAPLACE_TAIL_THEOREM.md` | `a65edf2f7268cf9be46cdb711a5999c90ce667c9928986b0bf607915a3d92408` |
| `tests/test_growing_transition_complete_odd_laplace_tail_theorem.py` | `3cde8608887da5354b6afebb84696f8110b573dae6b76a7abe6198ee52482e0e` |

The endpoint-null Krein theorem is used here only for the exact reciprocal
gauge, positive Hilbert domination, and fixed-`lambda` ordered
convergence.  Its source-dependent constant `C_H(x)` has no asserted
growing-`lambda` uniformity and is not used for (0.9).

## 2. Exact ordered rows, reciprocal gauge, and positive majorant

For `n>=2`, put

\[
 u_n=\max\{\lambda/n,\lambda^{-1}\},\qquad
 I_n=[u_n,\lambda].                                 \tag{2.1}
\]

For the physical source `f_x`, write `H_x=mathcal F_a f_x` and
`K_x=f_x+H_x`.  The exact ordered rows into `L^2(I_n,du)` are

\[
 (\mathcal A_{r,n}x)(u)=K_x(ru),\qquad
 (\mathcal B_{ln,n}x)(u)=H_x(lnu).                 \tag{2.2}
\]

Use the reciprocal scalar

\[
 s_{r,l,n}={r\over ln},\qquad
 \mathcal A'_{r,l,n}=s_{r,l,n}\mathcal A_{r,n},
 \qquad
 \mathcal B'_{r,l,n}=s_{r,l,n}^{-1}\mathcal B_{ln,n}. \tag{2.3}
\]

It preserves the cross exactly:

\[
 \mathsf S(\mathcal A'_{r,l,n},\mathcal B'_{r,l,n})
 =\mathsf S(\mathcal A_{r,n},\mathcal B_{ln,n}),
 \qquad \mathsf S(U,V)=U^*V+V^*U.                 \tag{2.4}
\]

Changing variables before estimating gives the exact squared norms

\[
 \begin{aligned}
 \|\mathcal A'_{r,l,n}x\|^2
 &= {r\over l^2n^2}
    \int_{ru_n}^{r\lambda}|K_x(v)|^2\,dv,\\
 \|\mathcal B'_{r,l,n}x\|^2
 &= {ln\over r^2}
    \int_{lnu_n}^{ln\lambda}|H_x(v)|^2\,dv.
 \end{aligned}                                     \tag{2.5}
\]

Let `mathcal U` be any set of ordered triples.  Insert an auxiliary prime
cutoff `R`, a Fejer cutoff `F`, and their weights in the exact direct
form:

\[
 \widehat Q_{\mathcal U,F,R}
 ={1\over4}\sum_{\substack{(r,l,n)\in\mathcal U\\n\leq R}}
 \omega_F(r)\omega_F(l)\Lambda(n)
 \mathsf S(\widehat{\mathcal A}_{r,n},
            \widehat{\mathcal B}_{ln,n}).           \tag{2.5a}
\]

Since `0<=omega_F<=1` and

\[
 2|\operatorname {Re}\langle ax,bx\rangle|
 \leq\|ax\|^2+\|bx\|^2,                            \tag{2.6}
\]

the reciprocal gauge gives, uniformly in both finite cutoffs,

\[
 \boxed{
 \|P_E\widehat Q_{\mathcal U,F,R}P_E\|
 \leq {1\over4}
 \sup_{\substack{x\in E\\ \|x\|_D=1}}
 \sum_{(r,l,n)\in\mathcal U}\Lambda(n)
 \left(\|\mathcal A'_{r,l,n}x\|^2
       +\|\mathcal B'_{r,l,n}x\|^2\right).}       \tag{2.7}
\]

Deleting the resonance or the `(1,1)` atoms only decreases the positive
right side.  Thus it is enough to estimate the unrestricted coordinate
tails of (2.5).

## 3. Uniform transition envelopes on the realized packet

Write a `D`-unit source on `E` as

\[
 g_x=\sum_{\gamma\in\mathcal G_L}a_\gamma h_\gamma,
 \qquad
 \sum_\gamma d_\gamma|a_\gamma|^2=1,              \tag{3.1}
\]

The seventh row inherited from the superseding forced-prime theorem gives

\[
 a_0=g_x(0)=0,\qquad f_x=g_x,
 \qquad H_{\rm bump}\equiv0.                       \tag{3.2}
\]

The row restriction also includes `eta(f)=f(lambda)=0`.

### 3.1 Band action and near exterior

For the endpoint-normalized mode

\[
 h_\gamma(\lambda(1-U/c))=e_\gamma p_\gamma(U),
 \qquad z_\gamma={e_\gamma\over\sqrt{d_\gamma}},
 \qquad b_\gamma=\sqrt{d_\gamma}a_\gamma.          \tag{3.3}
\]

Thus `sum_gamma |b_gamma|^2=1`.  Every first-slot band integral in
(2.5) starts at `ru_n>=lambda^(-1)`.  In the inward edge variable this is
precisely

\[
 0\leq U\leq c\left(1-{1\over\lambda^2}\right)=c-2\pi. \tag{3.4}
\]

The frozen radial normalization and curved regular-state/allowed-carrier
bounds give, uniformly for all `2m` nodes,

\[
 z_\gamma^2\leq C{c\over\lambda L},\qquad
 \sup_{0\leq U\leq c-2\pi}|p_\gamma(U)|
 \leq L^{K_0}e^{h\gamma}.                         \tag{3.5}
\]

On the band, `H_gamma=chi_gamma h_gamma`, and therefore the modal part
of the first-slot profile is exactly

\[
 K_x^{\rm mod}(v)
 =\sum_\gamma b_\gamma(1+\chi_\gamma)
          z_\gamma p_\gamma(U(v)).                 \tag{3.6}
\]

Cauchy--Schwarz in the fixed `2m` modal coordinates, followed by
(3.4)--(3.5) and integration over an interval of length at most
`lambda`, costs at most `c L^K e^(2h gamma_max)`.  There is no bump term
by (3.2).  Hence, with
`gamma_max=CL+B_L+O(1)`, one can fix

\[
 \boxed{
 \int_{1/\lambda}^\lambda|K_x(v)|^2\,dv\leq G_L^2,
 \qquad
 G_L^2\leq cL^{K_1}e^{2h\gamma_{\max}}
           =c^{1+2\sigma+o(1)}.}                  \tag{3.7}
\]

The exact modal exterior identity is

\[
 2\int_\lambda^\infty
 \left|\sum_\gamma a_\gamma H_\gamma(v)\right|^2\,dv
 =\sum_\gamma d_\gamma|a_\gamma|^2=1.            \tag{3.8}
\]

Consequently

\[
 \boxed{\int_\lambda^{2\lambda}|H_x(v)|^2\,dv\leq C.} \tag{3.9}
\]

### 3.2 Far exterior with exact Volterra constants

At each fixed `lambda`, the zero extension of `f_x` is continuous because
`eta=0`, and `f_x` is in `W^{2,1}([-lambda,lambda])`.  Two integrations
by parts, retaining the derivative jumps at the hard endpoints, give the
generic fixed-`lambda` estimate

\[
 |H_x(t)|\leq C_{\mathcal F}
 \left(\|f_x\|_{L^1}
       +|f_x'(\lambda-)|+|f_x'(-\lambda+)|
       +\|f_x''\|_{L^1}\right)(1+|t|)^{-2}.        \tag{3.10}
\]

For even sources the two displayed derivative magnitudes agree.  The
quantity in parentheses is the source-dependent `C_H(x)` of the
endpoint-null theorem.  That theorem gives no growing-packet bound for
it, so (3.10) alone cannot prove (0.9).

The realized same-phase modal expansion supplies the required uniform
replacement.  Put

\[
 k=2\pi\lambda,\qquad \mathcal K=k\lambda^2.
\]

For each selected mode the frozen outer theorem gives

\[
 H_\gamma(t)={h_\gamma(\lambda)\over\pi t}\sin(kt)
                  +R_\gamma(t),
 \qquad
 |R_\gamma(t)|\leq{18A_\gamma\mathcal K\over t^2},
 \quad t\geq2\lambda,                              \tag{3.11}
\]

where

\[
 A_\gamma={|h_\gamma(\lambda)|\over\pi},\qquad
 A_\gamma^2\leq2592\lambda d_\gamma.             \tag{3.12}
\]

Because all labels have the same phase and

\[
 \eta(f_x)=\sum_\gamma a_\gamma h_\gamma(\lambda)=0, \tag{3.13}
\]

the common `t^{-1}sin(kt)` term cancels exactly.  The exact constants in
(3.11)--(3.12), Cauchy--Schwarz, and (3.1) give

\[
 \begin{aligned}
 \left|\sum_\gamma a_\gamma R_\gamma(t)\right|
 &\leq {18\mathcal K\over t^2}
       \left(\sum_\gamma d_\gamma|a_\gamma|^2\right)^{1/2}
       \left(\sum_\gamma{A_\gamma^2\over d_\gamma}\right)^{1/2}\\
 &\leq {18\mathcal K\sqrt{2592(2m)\lambda}\over t^2}.
 \end{aligned}                                     \tag{3.14}
\]

Since `mathcal K=2pi lambda^3`, (3.14) proves the uniform bound

\[
 \boxed{
 |H_x(t)|\leq {C_{\infty,L}\over t^2}\quad(t\geq2\lambda),
 \qquad
 C_{\infty,L}^2\leq C_m\lambda^7.}                \tag{3.16}
\]

Thus no uncontrolled derivative/action constant remains on this realized
packet.  Without the modal expansion (3.11), the growing behavior of the
`W^{2,1}` quantity in (3.10) would be the earliest localization blocker.

## 4. The positive tail ledger

The elementary estimates used below are

\[
 \Lambda(n)\leq\log n,\qquad
 \sum_{n>N}{\Lambda(n)\over n^2}
 \ll {1+\log N\over N},                             \tag{4.1}
\]

\[
 \sum_{n\leq X}\Lambda(n)\ll X\log X,\qquad
 \sum_{n\leq X}n\Lambda(n)\ll X^2\log X,
 \qquad
 \sum_{j>Y}j^{-2}\ll Y^{-1}.                      \tag{4.2}
\]

These follow from `Lambda(n)<=log n`; no prime-number theorem is used.
Take `N>=2A`, `M>=2A`, and `J>=2`.  We estimate the union

\[
 \mathcal U_{N,M,J}=\{n>N\text{ or }r>M\text{ or }l>J\}. \tag{4.3}
\]

### 4.1 First slot: band and near exterior

In the band `0<=v<=lambda`, the first integral in (2.5) can be nonzero
only for

\[
 r\leq n\quad(n\leq A),\qquad
 r\leq A\quad(n>A).                                \tag{4.4}
\]

In `lambda<=v<=2lambda`, the corresponding bounds are `r<=2n` and
`r<=2A`.  Equations (3.7), (3.9), and

\[
 \sum_{r\leq2\min(n,A)}r\ll\min(n,A)^2             \tag{4.5}
\]

therefore give

\[
 \begin{aligned}
 \mathcal A_{n>N}^{\rm band+near}
 &\ll(1+G_L^2)A^2{1+\log N\over N},\\
 \mathcal A_{l>J}^{\rm band+near}
 &\ll(1+G_L^2){AL\over J},\\
 \mathcal A_{r>M}^{\rm band+near}&=0.
 \end{aligned}                                     \tag{4.6}
\]

For the second line, the two prime ranges are explicitly

\[
 \sum_{n\leq A}\Lambda(n)
 +A^2\sum_{n>A}{\Lambda(n)\over n^2}\ll AL.       \tag{4.7}
\]

### 4.2 First slot: far exterior

From (3.16),

\[
 \int_{\max(2\lambda,ru_n)}^\infty |H_x(v)|^2\,dv
 \leq {C_{\infty,L}^2\over
              3\max(2\lambda,ru_n)^3}.            \tag{4.8}
\]

The two scalar sums needed for (2.5) are

\[
 \sum_{r\geq1}{r\over\max(2\lambda,ru)^3}
 \ll {1\over\lambda u^2},                         \tag{4.9}
\]

and, because `M>=2A` and `u_n>=lambda^{-1}`,

\[
 \sum_{r>M}{r\over\max(2\lambda,ru_n)^3}
 ={1\over u_n^3}\sum_{r>M}r^{-2}
 \ll {1\over Mu_n^3}.                             \tag{4.10}
\]

Using `u_n=lambda/n` for `n<=A` and `u_n=lambda^{-1}` for `n>A` gives

\[
 \begin{aligned}
 \mathcal A_{n>N}^{\rm far}
 &\ll C_{\infty,L}^2\lambda{1+\log N\over N},\\
 \mathcal A_{r>M}^{\rm far}
 &\ll C_{\infty,L}^2{\lambda L\over M},\\
 \mathcal A_{l>J}^{\rm far}
 &\ll C_{\infty,L}^2{L\over\lambda J}.
 \end{aligned}                                     \tag{4.11}
\]

For example, the `r>M` line is exactly the sum of

\[
 {1\over M\lambda^3}\sum_{n\leq A}n\Lambda(n)
 \quad\hbox{and}\quad
 {\lambda^3\over M}\sum_{n>A}{\Lambda(n)\over n^2}, \tag{4.12}
\]

both of which are `O(lambda L/M)`.

### 4.3 Second slot: near exterior

The lower endpoint of the second integral in (2.5) is

\[
 l\lambda\quad(n\leq A),\qquad {ln\over\lambda}\quad(n>A). \tag{4.13}
\]

It is always at least `lambda`; hence there is no omitted compact-band
term in the second slot.  The interval `[lambda,2lambda]` occurs only
when `l<=2,n<=A`, or when `ln<=2A,n>A`.  By (3.9), its full positive
majorant is

\[
 \ll\sum_{r\geq1}r^{-2}
 \left\{\sum_{n\leq A}n\Lambda(n)
       +\sum_{A<n\leq2A}n\Lambda(n)\right\}
 \ll A^2L.                                         \tag{4.14}
\]

Consequently, with the harmless endpoint overcount in (4.14),

\[
 \mathcal B_{n>N}^{\rm near}=0,\qquad
 \mathcal B_{l>J}^{\rm near}=0,\qquad
 \mathcal B_{r>M}^{\rm near}\ll {A^2L\over M}.   \tag{4.15}
\]

### 4.4 Second slot: far exterior

After summing `r^{-2}`, the `l` sum in the two prime ranges is

\[
 \sum_{l\geq1}{ln\over\max(2\lambda,lnu_n)^3}
 \ll
 \begin{cases}
 n/\lambda^3,&n\leq A,\\
 \lambda^3/n^2,&n>A.
 \end{cases}                                      \tag{4.16}
\]

The second line includes the short transition range `A<n<2A`; there it
has the same `lambda^{-1}` size as the finitely many terms below the far
threshold.  Equations (4.1)--(4.2) give

\[
 \begin{aligned}
 \mathcal B_{n>N}^{\rm far}
 &\ll C_{\infty,L}^2\lambda^3{1+\log N\over N},\\
 \mathcal B_{r>M}^{\rm far}
 &\ll C_{\infty,L}^2{\lambda L\over M},\\
 \mathcal B_{l>J}^{\rm far}
 &\ll C_{\infty,L}^2{\lambda L\over J}.
 \end{aligned}                                     \tag{4.17}
\]

For `l>J>=2`, every retained lower endpoint is already in the far region;
`sum_(l>J)l^{-2}<<J^{-1}` proves the last line without a transition loss.

### 4.5 Combined bound

Adding (4.6), (4.11), (4.15), and (4.17), and enlarging harmless smaller
terms, proves

\[
\boxed{
 \begin{aligned}
 \|P_E\widehat Q_{\mathcal U_{N,M,J}}P_E\|
 \ll{}&(1+G_L^2)
 \left\{ {A^2(1+\log N)\over N}+{AL\over J}\right\}\\
 &+C_{\infty,L}^2
 \left\{{\lambda^3(1+\log N)\over N}
          +{\lambda L\over M}+{\lambda L\over J}\right\}
 +{A^2L\over M}.
 \end{aligned}}                                    \tag{4.18}
\]

The bound is uniform in the auxiliary prime and Fejer cutoffs.

## 5. Explicit cutoffs and ordered limits

On the polylogarithmic schedule,

\[
 A=c^{1+o(1)},\qquad \lambda=c^{1/2+o(1)},\qquad
 G_L^2\leq c^{1+2\sigma+o(1)},\qquad
 C_{\infty,L}^2\ll c^{7/2}.                        \tag{5.1}
\]

Insert (0.7) into (4.18).  The two dominant far terms have numerators

\[
 C_{\infty,L}^2\lambda^3=c^{5+o(1)},\qquad
 C_{\infty,L}^2\lambda L=c^{4+o(1)}.              \tag{5.2}
\]

After division by

\[
 T_L={(c/(2\pi))^\sigma\over L^{2m}},             \tag{5.3}
\]

both are `L^K c^{-delta}=o(1)`.  The band-action terms are smaller:

\[
 {G_L^2A^2/N_L\over T_L},\quad
 {G_L^2A/J_L\over T_L}
 \leq L^Kc^{2\sigma-2-\delta}=o(1),               \tag{5.4}
\]

and the remaining terms are smaller still.  Thus (4.18) proves (0.9).

The order of limits is binding.  At each fixed `lambda`:

1. form and Hermitianize the exact ordered rows with finite prime cutoff
   `R` and finite Fejer cutoff `F`;
2. take `R to infinity` at fixed `F`;
3. take `F to infinity` in the prescribed ordered sense; and
4. only afterward let `lambda to infinity` on (0.1).

The fixed-`lambda` positive Hilbert domination of the endpoint-null
reciprocal gauge justifies steps 2--3 by dominated convergence.  Estimate
(4.18), being uniform in both finite cutoffs, passes to the nested limit.
For every fixed finite dyadic box the Fejer weights tend pointwise to one.
The cutoffs in (0.7) are chosen only after the ordered form at that fixed
`lambda` has been identified.  No interchange with the growing limit is
used.

## 6. Dyadic pigeonhole and exact claim boundary

By (0.6) and (0.9), eventually

\[
 P_E\widehat Q_{\rm box}P_E
 \succeq {c'_m\over16}T_LP_E.                      \tag{6.1}
\]

The logarithms of all three cutoffs in (0.7) are `O(L)`, proving (0.11).
Choose any unit vector `x_L in E`.  Writing the finite coordinate sum as
the sum of its nonempty dyadic boxes gives

\[
 \sum_{\mathcal D}
 \langle\widehat Q_{\mathcal D}x_L,x_L\rangle
 \geq {c'_m\over16}T_L.                            \tag{6.2}
\]

Hence one box satisfies

\[
 \langle\widehat Q_{\mathcal D_L}x_L,x_L\rangle
 \geq {c'_mT_L\over16\mathcal B_L}.               \tag{6.3}
\]

The variational characterization of the largest eigenvalue proves
(0.12).  Nothing in (6.2)--(6.3) controls the other eigenvalues of that
box, so a boxwise Loewner conclusion is explicitly excluded.

The theorem uses no fixed-product masks and no information about prime
distribution beyond `Lambda(n)<=log n`.  Rows outside the seven-row
polylogarithmic packet, the fixed-linear schedule, the complete central
form, determinants, zero locations, and RH remain outside its scope.
