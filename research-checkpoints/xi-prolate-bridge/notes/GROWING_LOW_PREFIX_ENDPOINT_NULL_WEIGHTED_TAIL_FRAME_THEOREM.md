# Growing low-prefix endpoint-null weighted-tail frame theorem

## 0. Result and strict scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 k=2\pi\lambda,\qquad c=k\lambda=2\pi\lambda^2 .       \tag{0.1}
\]

Let

\[
 {\cal I}_Q=\{0,4,8,\ldots,4Q\},\qquad q=|{\cal I}_Q|=Q+1,
                                                               \tag{0.2}
\]

and suppose

\[
 4Q+1\leq {2c\over\pi}.                                \tag{0.3}
\]

For the conclusions involving the arithmetic sampler \(m=1\), fix an
absolute \(C_0\) and additionally assume

\[
 Q\leq C_0\log c,                                      \tag{0.3a}
\]

with \(c\) sufficiently large in terms of \(C_0\).  The far-tail
compression (0.8) itself needs only (0.3).

For a same-phase modal combination

\[
 f=\sum_{n\in{\cal I}_Q}a_nh_{n,\lambda},\qquad
 \eta(f):=f(\lambda)=0,                                \tag{0.4}
\]

write \(H={\cal F}_af\) and

\[
 D(f)=\int_{|v|\geq\lambda}|H(v)|^2\,dv
     =\sum_{n\in{\cal I}_Q}d_n|a_n|^2 .               \tag{0.5}
\]

The exact one-tail exterior isometry is

\[
 (Uf)(s)=\sqrt{2\lambda}\,e^{s/2}H(\lambda e^s),
 \qquad \|Uf\|_{L^2(0,\infty)}^2=D(f).                 \tag{0.6}
\]

For real \(|y|<1/2\) and \(M\geq2\), define on the
exterior-defect unit sphere

\[
 B_y(M)=U^*{\bf1}_{[\log M,\infty)}e^{2ys}U .           \tag{0.7}
\]

The first theorem is the dimension-free source-operator estimate

\[
 \boxed{
 \|B_y(M)|_{\ker\eta}\|
 \leq C Q^3 M^{-3+2y},\qquad M\geq2,\quad |y|<1/2,}
                                                               \tag{0.8}
\]

where \(C\) is absolute.  The word dimension-free means that no final
Hilbert-space Cauchy--Schwarz factor equal to the dimension of a chosen
column realization occurs.  The explicit \(Q^3\) is the Riesz norm of the
spectral endpoint-difference row.  When \(Q\leq C_0\log c\), it is a fixed
polylogarithmic factor.

Let

\[
 (R_mg)(s)={\bf1}_{\{s\geq0\}}m^{-1/2}g(s+\log m),
 \qquad (M_yg)(s)=e^{ys}g(s).                            \tag{0.9}
\]

Then (0.8) gives the cancellation which was absent from the modewise
positive estimates:

\[
 \boxed{
 \|M_yR_mU|_{\ker\eta}\|^2\leq C Q^3m^{-4},
 \qquad m\geq1.}                                       \tag{0.10}
\]

The exponent is independent of \(y\).  For

\[
 \epsilon={1\over2}-|y|,
 \qquad 0<h\leq{1\over2},                              \tag{0.11}
\]

zero extension and the exact exterior derivative estimate also give

\[
\boxed{
\begin{aligned}
 &\lambda^{2y}\|\Delta_hM_yR_mU|_{\ker\eta}\|^2
 +\lambda^{-2y}\|\Delta_hM_{-y}R_mU|_{\ker\eta}\|^2\\
 &\hspace{35mm}\leq
 C Q^3\lambda\epsilon^{-1}h^\epsilon m^{-4+\epsilon},
 \qquad m\geq1 .
\end{aligned}}                                           \tag{0.12}
\]

Here \(\Delta_h=\tau_h-I\) acts on zero-extended half-line profiles.
No boundary value at \(s=0\) is discarded.

For dyadic sampler windows

\[
 W_j=\{m\in\mathbb N:2^j\leq m<2^{j+1}\},\qquad j\geq0,
                                                               \tag{0.13}
\]

the exact centered block Grams of equations (6.6)--(6.7) in the frozen
collective-dilation reduction satisfy

\[
 \left(\sum_{j\geq0}\sqrt{|W_j|F_{W_j,y}^{\rm ctr}}
       \right)^2\leq C Q^3\lambda,                     \tag{0.14}
\]

\[
 \left(\sum_{j\geq0}\sqrt{|W_j|
          F_{W_j,y}^{\Delta,{\rm ctr}}(h)}
       \right)^2
 \leq C Q^3\lambda\epsilon^{-1}h^\epsilon .           \tag{0.15}
\]

Thus the missing positive operator-valued unequal-dilation lemma is proved
for the slowly growing low prefix \(Q=O(\log c)\), including the arithmetic
sampler \(m=1\) and its hard edge.  This arithmetic sampler must not be
confused with a retained source singleton.  The result is **not** proved
for the old full transition inventory \(q\asymp\lambda^2\).

The theorem is an exact full-exterior-metric statement for modal column
syntheses and remains so after the endpoint shear is applied by congruence.
The locked compactly supported invisible-origin bump is not a prolate modal
column; as in the frozen ledger, it remains a separate rapidly decaying
correction.  No block metric is silently substituted for the full metric.

Equations (0.8)--(0.15) are positive frame estimates.  They do not bound
the signed reflected Stieltjes quadrature, the non-equality prime block,
the pole/projection cross, or the negative part of the complete signed
complement.  They prove no complete signed floor, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant limit, Riemann-hypothesis conclusion,
or Lambda bound.  The project state remains `P0_INVALIDATED`, and the
standard eight are unchanged.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_ENDPOINT_NULL_COLLECTIVE_DILATION_FRAME_REDUCTION.md` | `bbffec21c91b1e1150e36c9b2120b9255f1d0aa1bd4a1c7ec226e02db8d6abe6` |
| `tests/test_growing_transition_endpoint_null_collective_dilation_frame_reduction.py` | `eb25ab43e4f5fdeea96d89aa425ac2a9ab4f7cbdd0feaad3294e494387840f66` |
| `notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md` | `fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c` |
| `tests/test_fixed_even_endpoint_null_complete_volterra_caustic_quadrature_theorem.py` | `b734c0e93d264cca9bfe31a141f06907724e526de08781295b6a7cd3bcc0b47c` |
| `notes/PROLATE_TAIL_ENVELOPE.md` | `309337a98721d0e0cffb40391a227ad29fbc0de315c6f532109c9376370ed59d` |
| `tests/test_prolate_tail_envelope.py` | `bb5b5ec58f6357a8defcf36b19d3a1674091518903c5438f56c17ae6eef0581e` |
| `notes/LEADING_PROLATE_OSCILLATION_THEOREM.md` | `d65e9221642b09cb66b0f0c46d716f5d7fae98980f4c3ed3289033dacb9a266b` |
| `tests/test_leading_prolate_oscillation.py` | `00f5c5740c3f9002e2c9159b280a8764e955a356ac68ca365627de52b7c0eba5` |
| `notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md` | `f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079` |
| `tests/test_growing_transition_equality_conductor_garding_theorem.py` | `61713e1f3007042eecfea5be0f1178b02311e5b9d4387af8c0123be293fc73ba` |
| `notes/STRUCTURED_FULL_BLOCK_EXTERIOR_METRIC_QUOTIENT_BRIDGE_THEOREM.md` | `ad11c56795dd721f09b4bdfce286c69ba8825867ccf03e3a127e27957f93aa86` |
| `tests/test_structured_full_block_exterior_metric_quotient_bridge_theorem.py` | `bd772ad22906038480061226b9271ecfb76b3b5099065e6ae7b958d2d423095d` |

No numerical prolate value, prime estimate, zero table, or external
analytic estimate is used.

## 2. A moving low-index eigenvalue bound

The fixed-label expansion

\[
 \Theta_n=(2n+1)c+O_n(1)                                \tag{2.1}
\]

has the wrong quantifier order for \(n=O(\log c)\).  A direct min--max
bound is enough here.

### Lemma 2.1 (central packet min--max)

If \(N+1\leq2c/\pi\), then

\[
 \boxed{\mu_N(c)\leq\pi c(N+1).}                       \tag{2.2}
\]

**Proof.**  Put

\[
 R^2={\pi(N+1)\over2c}\leq1,
 \qquad \ell={2R\over N+1}.                            \tag{2.3}
\]

Tile \([-R,R]\) by \(N+1\) intervals of length \(\ell\), and on each
interval take the first Dirichlet sine, extended by zero.  The functions
have disjoint supports and belong to the natural prolate form domain.  For
every vector in their span,

\[
 {q_c[u]\over\|u\|_2^2}
 \leq {\pi^2\over\ell^2}+c^2R^2
 ={\pi c(N+1)\over2}+{\pi c(N+1)\over2}.
                                                               \tag{2.4}
\]

The min--max principle proves (2.2).  \(\square\)

With \(N=4Q\), condition (0.3) also puts every selected label strictly
below \(2c/\pi\).  The frozen leading-oscillation theorem therefore gives

\[
 0\leq\mu_n<c^2\qquad(n\in{\cal I}_Q),               \tag{2.5}
\]

while Lemma 2.1 gives the uniform spectral diameter bound

\[
 |\mu_n-\mu_r|\leq\pi c(4Q+1)\qquad(n,r\in{\cal I}_Q).
                                                               \tag{2.6}
\]

This is the only growing-label eigenvalue input.

## 3. Exact divided differences, including one derivative

For \(n\in{\cal I}_Q\), put

\[
 e_n=h_{n,\lambda}(\lambda),\qquad
 F_n(t)={H_n(t)\over e_n},\qquad
 p(t)=t^2-\lambda^2.                                  \tag{3.1}
\]

Write \(\chi_n>0\) for the concentration eigenvalue on this phase, so

\[
 d_n=1-\chi_n^2,\qquad H_n(\lambda)=\chi_ne_n,
 \qquad F_n(\lambda)=\chi_n.                          \tag{3.1a}
\]

The regular endpoint relation shows \(e_n\ne0\).  All labels have the same
outgoing Fourier phase.  In fact, integration by parts gives the common
asymptotic amplitude

\[
 \sqrt{p(t)}F_n(t)={1\over\pi}\sin(2\pi\lambda t)+o(1).
\]

For \(w=\sqrt p\,F_n\), the exact Liouville frequency is the decreasing
function in (3.6).  Its Pruefer amplitude is increasing to \(1/\pi\), so
it never exceeds that limit.  This argument is uniform whenever
\(0\leq\mu_n<c^2\), and (2.5) therefore gives

\[
 |\sqrt{p(t)}F_n(t)|\leq{1\over\pi},\qquad t\geq2\lambda,
                                                               \tag{3.2}
\]

and the defect-relative endpoint bound

\[
 {e_n^2\over d_n}\leq256\pi^2\lambda .                \tag{3.3}
\]

For \(n\ne r\), set

\[
 W_{nr}={F_n-F_r\over\mu_n-\mu_r}.                     \tag{3.4}
\]

Subtraction of the two exact exterior equations gives

\[
 \{pW_{nr}'\}'+(k^2t^2-\mu_r)W_{nr}=F_n.               \tag{3.5}
\]

This identity is exact.  Normalization by \(e_n\) cancels the common
order-\(t^{-1}\) outgoing coefficient before any estimate is taken.

For completeness, the derivative estimate needed below follows from the
same outgoing Green formula as the frozen value estimate.  Put

\[
 Z=\sqrt p\,W_{nr},\qquad
 Z''+\Omega_r^2Z={F_n\over\sqrt p},
\]

\[
 \Omega_r^2=k^2+{c^2-\mu_r\over p}+{\lambda^2\over p^2}.
                                                               \tag{3.6}
\]

On \(t\geq2\lambda\), \(\Omega_r\) decreases to \(k\) and is bounded by
an absolute multiple of \(k\).  The two unit-amplitude outgoing Pruefer
solutions have modulus at most one and derivative at most an absolute
multiple of \(k\).  Their Wronskian is \(k\).  Hence their Green kernel
obeys

\[
 |G_r(t,s)|\leq{2\over k},\qquad
 |\partial_tG_r(t,s)|\leq3,\qquad s\geq t\geq2\lambda.
                                                               \tag{3.7}
\]

By (3.2),

\[
 \left|{F_n(s)\over\sqrt{p(s)}}\right|
 \leq{1\over\pi p(s)},
 \qquad
 \int_t^\infty{ds\over p(s)}\leq{4\over3t}.           \tag{3.8}
\]

Equations (3.6)--(3.8), followed by one differentiation of
\(W=Z/\sqrt p\), prove the uniform pair of bounds

\[
 \boxed{
 |F_n(t)-F_r(t)|
 \leq {16\over3\pi\sqrt3}
       {|\mu_n-\mu_r|\over kt^2},}                     \tag{3.9}
\]

\[
 \boxed{
 |F_n'(t)-F_r'(t)|
 \leq C_1{|\mu_n-\mu_r|\over t^2},}
 \qquad t\geq2\lambda,                                \tag{3.10}
\]

with an absolute \(C_1\).  Equation (3.9) is the frozen complete Jost
divided-difference bound; (3.10) is its differentiated Green-kernel
companion.  Neither estimate expands the endpoint series.

## 4. Endpoint nullity and the \(Q^3\) Riesz row

Choose any \(r\in{\cal I}_Q\).  From (0.4),

\[
 \boxed{
 H(t)=\sum_{n\in{\cal I}_Q}a_ne_n\{F_n(t)-F_r(t)\}.}  \tag{4.1}
\]

Weighted Cauchy--Schwarz gives

\[
 \left(\sum_n|a_ne_n||\mu_n-\mu_r|\right)^2
 \leq D(f)\,{\cal S}_{Q,r},                          \tag{4.2}
\]

where

\[
 {\cal S}_{Q,r}
 :=\sum_{n\in{\cal I}_Q}{e_n^2\over d_n}
             |\mu_n-\mu_r|^2 .                         \tag{4.3}
\]

Equations (2.6) and (3.3) imply

\[
 \boxed{{\cal S}_{Q,r}\leq C_2\lambda c^2Q^3}         \tag{4.4}
\]

after increasing an absolute constant to include \(Q=1\).  Therefore
(3.9)--(3.10) give, for \(t\geq2\lambda\),

\[
 |H(t)|^2\leq {C_3D(f){\cal S}_{Q,r}\over k^2t^4},
 \qquad
 |H'(t)|^2\leq {C_4D(f){\cal S}_{Q,r}\over t^4}.
                                                               \tag{4.5}
\]

The endpoint ODE also makes the first surviving endpoint jet transparent:

\[
 \kappa(f)=f'(\lambda)
 ={1\over2\lambda}\sum_na_n\mu_ne_n
 \quad\hbox{on }\ker\eta .                            \tag{4.6}
\]

Consequently

\[
 {|\kappa(f)|^2\over\lambda^3D(f)}\leq C Q^3.          \tag{4.7}
\]

### Lemma 4.1 (hard-edge divided-difference graph)

Under (0.3a),

\[
 \boxed{
 \int_\lambda^{2\lambda}v^2|H'(v)|^2\,dv
 \leq Cc^2Q^3D(f).}                                    \tag{4.8}
\]

**Proof.**  The point \(v=\lambda\) is singular in the exterior equation,
so (3.10) is not extended through it.  Instead put

\[
 z=c\sqrt{v^2/\lambda^2-1},\qquad
 Y_n(z)=F_n\!\left(\lambda\sqrt{1+z^2/c^2}\right).
                                                               \tag{4.9}
\]

On \(0\leq z\leq\sqrt3c\), the exact radial equation is

\[
 Y_n''+\left({1\over z}+{z\over c^2+z^2}\right)Y_n'
 +\left(1-{\mu_n\over c^2+z^2}\right)Y_n=0.            \tag{4.10}
\]

For \(n\ne r\), subtract the two equations and remove the endpoint
value:

\[
\begin{aligned}
 {\cal W}_{nr}(z)
 :={}&{Y_n(z)-Y_r(z)\over\mu_n-\mu_r}\\
 &-{\chi_n-\chi_r\over(\mu_n-\mu_r)\chi_r}Y_r(z).
\end{aligned}                                           \tag{4.11}
\]

Then \({\cal W}_{nr}(0)={\cal W}_{nr}'(0)=0\), and

\[
 {\cal L}_r{\cal W}_{nr}={Y_n\over c^2+z^2},            \tag{4.12}
\]

where \({\cal L}_r\) is the left side of (4.10) with index \(r\).

For every real spectral parameter
\(\mu\) between the selected eigenvalues, let \(G_\mu\) be the regular
solution of (4.10) normalized by \(G_\mu(0)=1\).  Then

\[
 {\cal W}_{nr}
 =\chi_n\,{\displaystyle G_{\mu_n}-G_{\mu_r}
                    \over\displaystyle\mu_n-\mu_r}.    \tag{4.17a}
\]

Put \(R=c^2+z^2\), \(\rho=z\sqrt R/c\), and
\(u_\mu=\sqrt\rho\,G_\mu\).  Direct conjugation gives

\[
 u_\mu''+\Omega_\mu^2u_\mu=0,\qquad
 \Omega_\mu^2
 =1-{\mu\over R}+{1\over4z^2}
       -{c^2+z^2/4\over R^2}.                          \tag{4.17b}
\]

For \(1\leq z\leq\sqrt3c\), equations (2.2) and (0.3a) give
\[
 {1\over2}\leq\Omega_\mu^2\leq{3\over2},\qquad
 \operatorname {Var}\log\Omega_\mu\leq C.              \tag{4.17c}
\]
Indeed \(-\mu/R\) and \(1/(4z^2)\) are monotone, while

\[
 {d\over dz}{c^2+z^2/4\over R^2}
 =-{z(7c^2+z^2)\over2R^3}.
\]

Thus
\(\operatorname {Var}(\Omega_\mu^2)\leq
\mu/c^2+1/4+O(c^{-2})\), and the positive lower bound proves the
variation assertion.  The associated homogeneous energy therefore has
an absolutely bounded propagator.

On \(0\leq z\leq1\), the regular Bessel Volterra equation gives

\[
 |G_\mu|+|G_\mu'|\leq C,\qquad
 |\partial_\mu G_\mu|\leq {Cz^2\over c^2},\qquad
 |\partial_z\partial_\mu G_\mu|\leq {Cz\over c^2}.
                                                               \tag{4.17d}
\]

Consequently \(|u_\mu(1)|+|u_\mu'(1)|\leq C\) and the corresponding
two quantities after \(\partial_\mu\) are \(O(c^{-2})\).
Differentiation in \(\mu\) gives

\[
 (\partial_\mu u_\mu)''+\Omega_\mu^2\partial_\mu u_\mu
 ={u_\mu\over R}.                                      \tag{4.17e}
\]

The bounded propagator and Duhamel's formula yield

\[
 |\partial_\mu u_\mu(z)|+|\partial_z\partial_\mu u_\mu(z)|
 \leq CI(z),\qquad
 I(z):={1\over c^2}+\int_1^z{dw\over c^2+w^2}
 \leq C\min\left\{{z\over c^2},{1\over c}\right\}.
                                                               \tag{4.17f}
\]

This treats \(\mu/R\) as part of the phase and uses no long-interval
Neumann absorption.  Since

\[
 s={1\over2}\log(1+z^2/c^2),\qquad ds={z\,dz\over R},
 \qquad \partial_s={R\over z}\partial_z,              \tag{4.17g}
\]

and

\[
 \partial_z\partial_\mu G_\mu
 =\rho^{-1/2}\left\{\partial_z\partial_\mu u_\mu
       -{\rho'\over2\rho}\partial_\mu u_\mu\right\},
 \qquad {\rho'\over\rho}\leq{2\over z},
\]

equation (4.17f), split at \(z=c\), gives

\[
 \int_1^{\sqrt3c}|\partial_s\partial_\mu G_\mu|^2\,ds
 \leq C\int_1^{\sqrt3c}{c\sqrt R\,I(z)^2\over z^2}\,dz
 \leq {C\over c}.                                      \tag{4.17h}
\]

The interval \(0\leq z\leq1\) contributes \(O(c^{-2})\) by
(4.17d).  The same calculation without the derivative gives the second
bound below:

\[
 \int_0^{\log2}|\partial_s\partial_\mu G_\mu|^2\,ds
 \leq {C\over c},\qquad
 \int_0^{\log2}|\partial_\mu G_\mu|^2\,ds
 \leq {C\over c^3}.                                    \tag{4.17i}
\]

The same homogeneous-energy calculation also gives

\[
 \int_0^{\log2}|\partial_sG_\mu|^2\,ds\leq Cc^2,
 \qquad
 \int_0^{\log2}|G_\mu|^2\,ds\leq {C\over c}.          \tag{4.17j}
\]

Equations (4.17a) and (4.17i) prove the hard-edge parametric graph without
a fixed-label asymptotic or a same-phase eigenvalue expansion.

The physical change of variables is

\[
 dv={\lambda z\over c^2\sqrt{1+z^2/c^2}}\,dz,\qquad
 \partial_v={c^2\sqrt{1+z^2/c^2}\over\lambda z}\partial_z.
                                                               \tag{4.18}
\]

Since \(v\leq2\lambda\), (4.17a), (4.17i), and (4.18) give

\[
 \int_\lambda^{2\lambda}v^2
 \left|\partial_v{\cal W}_{nr}\right|^2\,dv
 \leq C{\lambda\over c}\leq {C\over\lambda}.           \tag{4.19}
\]

It remains to restore the small endpoint-value term in (4.11).  Put
\(S=2c/\pi=4\lambda^2\) and retain the frozen leading-side defect bound

\[
 d_n\leq10\exp\left\{-{S-n-7\over\beta_\lambda}\right\},
 \qquad
 \beta_\lambda={2\over\pi^2}\log(200\lambda^2+25).      \tag{4.20}
\]

Put

\[
 \delta_Q=10\exp\left\{-{S-4Q-7\over\beta_\lambda}\right\}.
                                                               \tag{4.20a}
\]

For \(n\leq4Q\) and (0.3a), \(\delta_Q\) is smaller than every fixed
negative power of \(c\).  Since \(\chi_n>0\) on this phase,
\(0\leq1-\chi_n\leq d_n\leq\delta_Q\).  Endpoint nullity and (3.3)
therefore give

\[
 |H(\lambda)|^2
 =\left|\sum_na_ne_n(\chi_n-1)\right|^2
 \leq CD(f)\lambda Q\delta_Q^2.                        \tag{4.21}
\]

The regular homogeneous radial graph of \(Y_r/\chi_r\), transformed by
(4.18), is at most \(C\lambda c^2\), by (4.17j).  Increase
\(c_0(C_0)\) so that \(\lambda^2\delta_Q^2\leq Q^2\).  Thus (4.21)
makes its contribution to the left side of (4.8) at most
\(Cc^2Q^3D(f)\).

Finally use the exact decomposition

\[
 H=\sum_{n\ne r}a_ne_n(\mu_n-\mu_r){\cal W}_{nr}
 +{H(\lambda)\over\chi_r}F_r.                          \tag{4.22}
\]

Weighted Cauchy--Schwarz, (4.4), (4.19), and (4.21) prove (4.8).
\(\square\)

Two immediate hard-edge consequences will also be used.  The isometry
(0.6) and (4.8) give

\[
 \int_0^{\log2}|(Uf)'(s)|^2\,ds
 \leq Cc^2Q^3D(f).                                     \tag{4.23}
\]

Moreover the one-dimensional Sobolev--FTC inequality on
\([0,\log2]\), the isometry (0.6), and (4.23) give the safe boundary
strip bound

\[
 \sup_{0\leq s\leq\log2}|Uf(s)|^2
 \leq C\{\|Uf\|_2^2+\|Uf\|_2\|(Uf)'\|_2\}
 \leq CcQ^3D(f).                                       \tag{4.24}
\]

For the fixed \(8/12\) endpoint-null direction,
\(\kappa/\lambda^{3/2}\) has a nonzero defect-white limit.  Thus the
power \(M^{-3+2y}\) in (0.8)
is sharp in general.  What is uniform here is the complete divided
difference, not merely the isolated \(B_2\) term.

## 5. Weighted tail compression

For \(D(f)=1\), equations (0.6), (4.4), and (4.5), with
\(v=\lambda e^s\), give

\[
 |Uf(s)|^2\leq C Q^3e^{-3s},\qquad s\geq\log2,       \tag{5.1}
\]

and

\[
 |(Uf)'(s)|^2\leq Cc^2Q^3e^{-s},\qquad s\geq\log2.     \tag{5.2}
\]

Indeed the powers of \(\lambda\) cancel exactly because
\(c=k\lambda\): the factor in (4.4) is
\(\lambda c^2Q^3\), while (0.6) contributes \(2v\), and (3.9)
contributes \(k^{-2}v^{-4}\).

Integrating (5.1) proves

\[
 \int_{\log M}^\infty e^{2ys}|Uf(s)|^2\,ds
 \leq {CQ^3\over3-2y}M^{-3+2y}
 \leq CQ^3M^{-3+2y},                                  \tag{5.3}
\]

which is (0.8).  By the change of variables \(t=s+\log m\),

\[
 \|M_yR_mUf\|_2^2
 =m^{-1-2y}\int_{\log m}^\infty
             e^{2yt}|Uf(t)|^2\,dt .                   \tag{5.4}
\]

For \(m\geq2\), equations (5.3)--(5.4) prove (0.10).  For \(m=1\),
split at \(\log2\).  On the first interval, \(e^{2ys}\leq2\) and the
isometry (0.6) applies; on the second, use (5.3).  Hence

\[
 \|M_yU|_{\ker\eta}\|^2\leq CQ^3,                     \tag{5.5}
\]

which proves the missing \(m=1\) case of (0.10).  The exact cancellation
of \(y\) in (5.4) is the source of the fourth sampler power for
\(m\geq2\).

## 6. Zero-extension translation modulus

Put

\[
 g_{m,y}=M_yR_mUf .                                    \tag{6.1}
\]

For \(m\geq2\), equations (5.1)--(5.2) give

\[
 |g_{m,y}(s)|^2\leq CQ^3m^{-4}e^{-(3-2y)s},            \tag{6.2}
\]

\[
 \|g_{m,y}'\|_2^2
 \leq CQ^3\left\{m^{-4}
       +{c^2m^{-2}\over1-2y}\right\}.                  \tag{6.3}
\]

If a half-line \(H^1\) function is extended by zero, then for
\(0<h\leq1/2\),

\[
 \|\Delta_hg\|_2^2
 \leq h^2\|g'\|_2^2+\int_0^h|g(s)|^2\,ds .             \tag{6.4}
\]

The second term is the boundary strip; it cannot be omitted even though
the original source is endpoint null.  Combining (6.2)--(6.4) with the
trivial estimate \(\|\Delta_hg\|_2^2\leq4\|g\|_2^2\), and using

\[
 \min(A,B)\leq A^{1-\epsilon/2}B^{\epsilon/2},         \tag{6.5}
\]

gives, whenever both \(1/2-y\) and \(1/2+y\) are at least
\(\epsilon=1/2-|y|\),

\[
 \|\Delta_hM_{\pm y}R_mU|_{\ker\eta}\|^2
 \leq C Q^3c^\epsilon\epsilon^{-1}h^\epsilon
                 m^{-4+\epsilon}.                     \tag{6.6}
\]

This proves (6.6) for \(m\geq2\).  For \(m=1\), equations (4.23), (5.2),
and (5.5) give

\[
 \|g_{1,y}'\|_2^2
 \leq {Cc^2Q^3\over1-2y},\qquad
 \|g_{1,y}\|_2^2\leq CQ^3.                             \tag{6.6a}
\]

The hard-edge boundary strip is estimated by (4.24), not by the far
envelope (6.2):

\[
 \int_0^h|g_{1,y}(s)|^2\,ds\leq CcQ^3h.              \tag{6.6b}
\]

Apply (6.4) and take the minimum with the trivial norm bound.  For
\(0<\epsilon\leq1/2\),

\[
\begin{aligned}
 \min\{CQ^3,Cc^2Q^3\epsilon^{-1}h^2\}
 &\leq CQ^3c^\epsilon\epsilon^{-1}h^\epsilon,\\
 \min\{CQ^3,CcQ^3h\}
 &\leq CQ^3c^\epsilon h^\epsilon.
\end{aligned}                                           \tag{6.6c}
\]

Thus (6.6) also holds for \(m=1\).  This is a genuine arithmetic
hard-edge estimate; no source singleton is being invoked.

For \(y\geq0\),

\[
 \lambda^{2y}c^\epsilon=(2\pi)^\epsilon\lambda,
 \qquad
 \lambda^{-2y}c^\epsilon
 =(2\pi)^\epsilon\lambda^{1-4y}\leq(2\pi)^\epsilon\lambda.
                                                               \tag{6.7}
\]

The case \(y<0\) follows by exchanging the branches.  Equations
(6.6)--(6.7) prove (0.12).  This is precisely where the centered physical
weights and the allowed strip margin cancel the fractional derivative
scale \(c^\epsilon\).

## 7. Operator blocks and dyadic ledgers

Let

\[
 A_{m,y}^{\rm ctr}x
 =\left(\lambda^yM_yR_mUx,
        \lambda^{-y}M_{-y}R_mUx\right).                \tag{7.1}
\]

The profile in the frozen collective reduction is

\[
 \Phi x={\sqrt\lambda\over2}e^{s/2}H(\lambda e^s)
       ={1\over2\sqrt2}Ux.                              \tag{7.1a}
\]

Thus its exact centered block Gram is \(1/8\) times the Gram of the
following row synthesis.  For every finite sampler window
\(W\subset\mathbb N\), including \(W=\{1\}\), that synthesis is

\[
 (x_m)_{m\in W}\longmapsto
        \sum_{m\in W}A_{m,y}^{\rm ctr}x_m .            \tag{7.2}
\]

No block orthogonality is assumed.  Ordinary Hilbert-space Cauchy--Schwarz
in the **sampler** index, followed by (0.10) and the exact centered branch
factors in (7.1), gives

\[
 F_{W,y}^{\rm ctr}
 \leq {1\over8}\sum_{m\in W}\|A_{m,y}^{\rm ctr}\|^2
 \leq CQ^3\lambda\sum_{m\in W}m^{-4}.                 \tag{7.3}
\]

Writing \(\Delta_hA_{m,y}^{\rm ctr}\) for componentwise zero-extended
translation, the same sampler-index argument and (0.12) give directly

\[
 F_{W,y}^{\Delta,{\rm ctr}}(h)
 \leq {1\over8}\sum_{m\in W}
          \|\Delta_hA_{m,y}^{\rm ctr}\|^2
 \leq CQ^3\lambda\epsilon^{-1}h^\epsilon
           \sum_{m\in W}m^{-4+\epsilon}.              \tag{7.4}
\]

For \(W_j\) in (0.13),

\[
 |W_j|\leq2^j,\qquad
 \sum_{m\in W_j}m^{-4}\leq2^{-3j},\qquad
 \sum_{m\in W_j}m^{-4+\epsilon}\leq2^{(-3+\epsilon)j}.
                                                               \tag{7.5}
\]

Hence the summands in (0.14) are bounded by
\(CQ^{3/2}\lambda^{1/2}2^{-j}\), while those in (0.15) are bounded by

\[
 CQ^{3/2}\lambda^{1/2}\epsilon^{-1/2}h^{\epsilon/2}
     2^{(-1+\epsilon/2)j}.                              \tag{7.6}
\]

Since \(0<\epsilon\leq1/2\), both geometric sums are uniform.  This proves
(0.14)--(0.15), and therefore the restricted low-prefix forms of
(6.6)--(6.9) in the frozen collective reduction.

## 8. Exact full metric and endpoint shear

The theorem is invariant under the actual corrected modal column
coordinates.  Let \(C\) synthesize any collection of columns into the pure
modal coefficients on \({\cal I}_Q\), and put

\[
 D_{\rm full}=C^*\operatorname {diag}(d_n)C .           \tag{8.1}
\]

On the quotient by its kernel,

\[
 \operatorname {diag}(\sqrt{d_n})C D_{\rm full}^{-1/2}
                                                               \tag{8.2}
\]

is an isometry.  Thus (4.2) is applied in pure exterior-orthogonal
coordinates **after** exact full-metric whitening; there is no modal-count
loss from the column realization.

If \(T_\eta\) is the triangular endpoint shear, then

\[
 C^\#=CT_\eta,\qquad
 D_{\rm full}^\#=T_\eta^*D_{\rm full}T_\eta .          \tag{8.3}
\]

The transformed rest satisfies \(\eta C^\#|_R=0\), and (8.2) with
\(C^\#\) and \(D_{\rm full}^\#\) proves (0.8)--(0.15) there.  This is an
exact congruence statement.  Dropping the pulled-back metric cross would
not be licensed.

The interior invisible-origin correction changes no endpoint jet, but it
is not one of the modal columns in (8.1).  It remains in the separately
controlled bump term of the complete sampling ledger.  This theorem makes
no full-metric assertion after adjoining an arbitrary nonmodal vector.

## 9. Fixed \(B_2\), the complete hierarchy, and the larger-span boundary

The first nonzero endpoint term on \(\ker\eta\) is the \(B_2\) row governed
by \(\kappa\), and (4.7) is its defect-relative low-prefix Riesz bound.
Termwise higher endpoint jets do grow rapidly.  In particular, the exact
endpoint recurrence contains powers of \(c^2\), so no fixed Bernoulli
truncation is uniform in the growing prefix.

The proof above does not sum those jet bounds.  Equations (3.5) and (4.1)
instead resum the **complete** exterior profile as a spectral divided
difference before taking absolute values.  The outgoing Green estimate is
uniform to infinity and directly produces the complete \(t^{-2}\) decay.
Thus fixed \(B_2\) control is a sharp diagnostic, while the complete
divided difference is the actual theorem.

For the full transition inventory \(Q\asymp\lambda^2\), the factor \(Q^3\)
in (0.8) is a conductor power, not a polylogarithm.  Moreover the low-index
spectral diameter (2.6) is then no longer the relevant small scale.  The
present argument therefore does not close the old full-transition version
of the collective lemma.  That larger problem remains open.

Finally, even on the low prefix, (0.14)--(0.15) control a positive
operator-valued dilation frame.  They do not determine the sign of the
reflected continuous-minus-prime Stieltjes quadrature.  That signed
assembly is a separate remaining theorem.
