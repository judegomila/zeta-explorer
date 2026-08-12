# Growing-transition complete central-form reduction

## 0. Exact result and fail-closed boundary

Work on the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2={p^2\over4},\qquad L=2\log\lambda,
 \qquad N=2^{2400p^2}=2^{9600\lambda^2}.              \tag{0.1}
\]

This note proves only an exact reduction.  For the complete admitted
plus-phase transition synthesis, including label `8`, all rest columns, the
anchor rows, and every cross entry, it proves

\[
 \boxed{
 -\delta_qD_{\rm full}\preceq
 \Sigma_N-Q_X
 \preceq\delta_qD_{\rm full},}                         \tag{0.2}
\]

where `Sigma_N` is the actual compact projected signed matrix,
`Q_X=q_lambda(X,X)` is the complete unprojected central form, and

\[
 \boxed{
 \delta_q=2\sqrt{B_{{\rm out},q}B_{{\rm proj},q}}
              +B_{{\rm proj},q}
 =O\!\left(q\operatorname {poly}(\lambda,\log\lambda)
          e^{-M_{2400}\lambda^2}\right),}              \tag{0.3}
\]

\[
 M_{2400}=4800\log2-{160\pi\log96\over\log2}
 =17.14329605896023403855\ldots>0.                     \tag{0.4}
\]

The estimate survives the exact endpoint shear by congruence in the
**full** source exterior metric.  No endpoint-shear coefficient bound and no
block-diagonal replacement of that metric are used.

The elementary divisor masks are also recorded exactly.  They show that the
both-miss mask `B` remains in the outer--outer prime fold.  It is not an
outer--projection term.  Only the complete pole--Archimedean--minus-prime
radical identity converts the physical outer representation to `Q_X`.

This note proves no lower bound for `Q_X`, no signed floor for `Sigma_N`, no
complete same-side or reflected operator estimate, no standalone estimate
for `B`, no `P_0` comparison, no singleton Schur inequality, no residual
action, no equation (5.2) of `DIRECT_RH_ATTACK.md`, no determinant limit, and
no RH conclusion.  Section 7 separates a strong, sufficient whole-span
conductor estimate from the weaker project-minimal fixed-`mu_0` Schur target.
Neither statement is proved here, and the former is not asserted to be
necessary.  The project state remains `P0_INVALIDATED`.

## 1. Frozen repository inputs

No new external source is used.  The exact repository inputs are frozen at
the following bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` | `3d8b4f79d4d9249d36abe8a898a50565528d34711fc8b151f2f72c1c13bb2edd` |
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md` | `f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079` |
| `notes/GROWING_REST_SIGNED_RADICAL_TAIL_SCHUR_REDUCTION.md` | `000be1947a8cc22e7f96a080b8775ce0343fbeb36f886929c7ea5188191e0932` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P0_MATRIX_FORMULAS.md` | `73aa4d0a746bf1a553372d4c7bdc1c671cd69c9cc36682091d94731e1dac74dd` |

The radical and projection identities below are repository derivations, not
claims imported from the external papers cited by those dependencies.  The
divisor-mask lemma in Section 5 is proved directly here.

## 2. Complete source synthesis and the four radical pieces

Let `mathcal C_lambda` synthesize the complete admitted plus-phase raw source
columns into the even prolate basis.  Its range lies in the zero-integral
hyperplane.  If `d_n=1-chi_n^2`, its exact full source exterior metric is

\[
 D_{\rm full}
 =\mathcal C_\lambda^*\operatorname {diag}(d_n)
       \mathcal C_\lambda.                              \tag{2.1}
\]

This includes every anchor and cross term.  In the anchor coordinates of the
growing sampling theorem it is, before any later shear,

\[
 D_{\rm block}=D_T+d_4\alpha\alpha^*+d_0bb^*.           \tag{2.2}
\]

Equation (2.2) is not replaced by `D_T` or by its diagonal compressions.

For a coefficient vector `a`, write `f_a=mathcal C_lambda a` and apply the
locked linear invisible origin correction

\[
 \widetilde f_a=f_a-f_a(0)\psi(2\lambda\,\cdot).        \tag{2.3}
\]

Then `widetilde f_a(0)=integral widetilde f_a=0`.  The bump is invisible on
the central multiplicative window and remains part of the global outer
state.  Put

\[
 K_a=S_+\mathcal E(\widetilde f_a),\qquad
 S_+={1+J\over2},                                      \tag{2.4}
\]

and, with `C_lambda` denoting restriction to
`[lambda^(-1),lambda]`, define

\[
 X_a=C_\lambda K_a,\qquad
 p_a=P_NX_a,\qquad
 P_a=(I-P_N)X_a,\qquad
 O_a=(I-C_\lambda)K_a.                                 \tag{2.5}
\]

Thus

\[
 Y_a:=K_a-p_a=O_a+P_a,
 \qquad X_a=p_a+P_a.                                   \tag{2.6}
\]

Let `q_lambda` be the complete compact source form with its locked sign

\[
 q_\lambda=W_{0,2}-W_R-W_p.                            \tag{2.7}
\]

For two coefficient vectors define

\[
 \Sigma_N(a,b)=q_\lambda(p_a,p_b),\qquad
 Q_X(a,b)=q_\lambda(X_a,X_b).                          \tag{2.8}
\]

Every occurrence of `q_lambda`, `Sigma_N`, or `Q_X` below means the already
combined form (2.7).  No pole, Archimedean, or prime block is separately
radical.

## 3. Exact radical algebra and signs

The codimension-two construction makes every `K_a` a two-sided global
zero-evaluation radical.  The compact factors have the required bounded
variation, while the growing sampling theorem makes the outer quadratic
zero pairing absolutely convergent.  Consequently the polarized identity
of the exact radical theorem gives

\[
 \boxed{
 \Sigma_N(a,b)
 =\mathcal W_Z(Y_a,Y_b).}                              \tag{3.1}
\]

The source-core outer--projection reduction, with its mandatory minus sign,
is

\[
 \boxed{
 \begin{aligned}
 \mathcal W_Z(O_a,P_b)&=-q_\lambda(X_a,P_b),\\
 \mathcal W_Z(P_a,O_b)&=-q_\lambda(P_a,X_b),\\
 \mathcal W_Z(P_a,P_b)&= q_\lambda(P_a,P_b).
 \end{aligned}}                                        \tag{3.2}
\]

Expanding (3.1), retaining all four terms, and using `X=p+P` gives

\[
 \boxed{
 \mathcal W_Z(O_a,O_b)=q_\lambda(X_a,X_b)=Q_X(a,b).}   \tag{3.3}
\]

Indeed the three projection-containing terms are exactly

\[
\begin{aligned}
 E_N(a,b)
 &:={\cal W}_Z(O_a,P_b)+{\cal W}_Z(P_a,O_b)
      +{\cal W}_Z(P_a,P_b)\\
 &=-q_\lambda(p_a,P_b)-q_\lambda(P_a,p_b)
      -q_\lambda(P_a,P_b)\\
 &=\Sigma_N(a,b)-Q_X(a,b).                              \tag{3.4}
\end{aligned}
\]

There is one, not three, surviving `P--P` term in (3.4): each mixed
orientation contributes `-q(P,P)`, and the explicit `P--P` pairing adds one
copy back.  In particular, keeping only the two mixed orientations gives

\[
 \mathcal W_Z(O,O)+\mathcal W_Z(O,P)+\mathcal W_Z(P,O)
 =\Sigma_N-q_\lambda(P,P).                             \tag{3.5}
\]

Thus `P--P` may be small, but it may not be deleted from the exact identity.

## 4. Exponential Loewner error in the full metric

Let `q` be the actual number of modal rows in the admitted same-phase
synthesis.  The growing transition theorem supplies the complete outer and
projection estimates

\[
 \|ZO_a\|^2\leq B_{{\rm out},q}\,a^*D_{\rm full}a,
 \qquad
 \|ZP_a\|^2\leq B_{{\rm proj},q}\,a^*D_{\rm full}a.   \tag{4.1}
\]

Here `B_(out,q)` is the exact convergent series in equation (2.8) of the
growing sampling theorem.  It is exactly linear in `q` and satisfies

\[
 B_{{\rm out},q}=O(q\lambda\operatorname {polylog}\lambda). \tag{4.2}
\]

For completeness, the projection constant is

\[
 d_{\rm LS}=6\,96^{-5-(320\pi/\log2)\lambda^2},
 \qquad
 V_*=46\lambda(2\pi\lambda^2)^3+108\pi\lambda^2,      \tag{4.3}
\]

\[
 X_q={qLV_*^2\over2\pi^2Nd_{\rm LS}},                 \tag{4.4}
\]

\[
 A_N=3(1+\sqrt{2N})+{3L\over4\pi\sqrt{2N}},\qquad
 H_N=\max\left\{1,{2\pi^2NA_N^2\over L}\right\},    \tag{4.5}
\]

\[
\boxed{
\begin{aligned}
 B_{{\rm proj},q}={}&192\sqrt e\,\lambda(1+\log\lambda)^2X_q\\
 &\times\left[Z_{\rm finite}+{C_Z\over\pi}
 \left((\pi+1)\log(H_N+2)+1\right)\right].
\end{aligned}}                                         \tag{4.6}
\]

It is also exactly linear in `q`, and

\[
 B_{{\rm proj},q}
 =O\!\left(q\operatorname {poly}(\lambda,\log\lambda)
                e^{-2M_{2400}\lambda^2}\right).       \tag{4.7}
\]

Apply the absolute sequence-space Cauchy inequality to (3.4), before using
any sign of the Weil form.  On the diagonal,

\[
\begin{aligned}
 |E_N(a,a)|
 &\leq2\|ZO_a\|\,\|ZP_a\|+\|ZP_a\|^2\\
 &\leq\delta_q\,a^*D_{\rm full}a,                     \tag{4.8}
\end{aligned}
\]

with `delta_q` as in (0.3).  Since `E_N` is Hermitian, (4.8) is equivalent to
the Loewner estimate (0.2).  Polarization also gives

\[
 |E_N(a,b)|\leq\delta_q
 \sqrt{a^*D_{\rm full}a}\sqrt{b^*D_{\rm full}b}.      \tag{4.9}
\]

The admitted inventory satisfies `q<=3*lambda^2/2`.  Its polynomial growth
does not erode the positive exponent in (0.3).  This proves a uniform
exponential projection erosion, not a signed lower bound for `Q_X`.

## 5. Exact divisor masks and placement of the both-miss term

This section is finite arithmetic.  It does not use a prime-number theorem.
Fix an integer product `M>A`, put

\[
 y=\log(M/A),\qquad 0\leq\rho\leq y,\qquad
 z=e^\rho,\qquad w=e^{y-\rho}={M\over Az}.             \tag{5.1}
\]

For every ordered triple of positive integers `m,l,n` with `mln=M`, extract
the common product half-density and retain the weight `Lambda(n)`.  Define

\[
\begin{array}{ll}
 R: & n>A,\ m\leq z,\ l\leq w,\\
 C_R: & m>z,\ l\leq w,\\
 C_L: & m\leq z,\ l>w,\\
 B: & n<A,\ m>z,\ l>w.
\end{array}                                             \tag{5.2}
\]

Because

\[
 {m\over z}{l\over w}={A\over n},                     \tag{5.3}
\]

the four masks in (5.2) are disjoint and exhaustive.  The locked value
`A=p^2/4` is nonintegral, so `n=A` never occurs.  At `m=z` or `l=w`, the
inequalities in (5.2) are the ordered representatives of the common Fejer
midpoint convention; changing their values at those isolated `rho` does not
change the correlation integral.

Write the same letters for the corresponding weighted sums.  The unrestricted
divisor coefficient is

\[
\begin{aligned}
 G_M
 &=\sum_{n\mid M}\Lambda(n)d(M/n)
 =\sum_{k\mid M}\sum_{n\mid k}\Lambda(n)\\
 &=\sum_{k\mid M}\log k
 ={1\over2}d(M)\log M.                                 \tag{5.4}
\end{aligned}
\]

The two one-sided divisor layers are exactly

\[
 L_R=R+C_R=\sum_{\substack{k\mid M\\k\geq Az}}\log k,
 \qquad
 L_L=R+C_L,                                             \tag{5.5}
\]

where the second formula is the reflected version of the first.  Therefore

\[
 G_M=R+C_R+C_L+B,\qquad
 L_R+L_L-G_M=R-B,                                      \tag{5.6}
\]

and

\[
 \boxed{R+C_R+C_L=G_M-B.}                              \tag{5.7}
\]

With the locked source sign `q=W_(0,2)-W_R-W_p`, the reflected and two
same-side sign quadrants have the common prime normalization
`-2*Lambda(n)/sqrt(n)` before the product half-densities are combined.
Consequently (5.7) enters the physical outer--outer prime fold as

\[
 \boxed{-2(G_M-B)=-2G_M+2B.}                           \tag{5.8}
\]

There is no extra factor two or one quarter in (5.8).

The location of `B` can also be seen directly on the outer profile.  For a
corrected source `f`, put `H=mathcal F_a f` and

\[
 \phi_f(s)={\sqrt\lambda\over2}e^{s/2}H(\lambda e^s).
                                                                    \tag{5.9}
\]

For `n<A`, set `d_n=log(A/n)` and, for `0<=a<=d_n`, let
`u=lambda*e^(-a)`.  With midpoint values at a sampled boundary,

\[
\begin{aligned}
 W_{-,f}(a)
 &:=\sum_{m\geq e^a}m^{-1/2}\phi_f(\log m-a)\\
 &={\sqrt u\over2}\sum_{mu\geq\lambda}H(mu)\\
 &={1\over2}\mathcal E(H)(u)
   -{\sqrt u\over2}\sum_{1\leq m<e^a}H(mu).           \tag{5.10}
\end{aligned}
\]

The exact Poisson identity and `H(0)=f(0)=0` give

\[
 \boxed{
 W_{-,f}(a)={1\over2}\mathcal E(f)(e^a/\lambda)
 -{\sqrt{\lambda e^{-a}}\over2}
  \sum_{1\leq m<e^a}H(m\lambda e^{-a}).}              \tag{5.11}
\]

Thus the first term is an inverted central radical value and the second is
the finite inside-frequency sampler.  Their difference is still the physical
outer profile; it is not the log-Fourier projection remainder `P`.

On a quadratic source, the `+2B` term in (5.8) is

\[
 \boxed{
 \mathfrak B_f
 =2\sum_{1<n<A}{\Lambda(n)\over\sqrt n}
 \operatorname {Re}\int_0^{d_n}
 W_{-,f}(a)\overline{W_{-,f}(d_n-a)}\,da.}             \tag{5.12}
\]

The finite reflection `a -> d_n-a` has both symmetric and antisymmetric
subspaces, so (5.12) is not a positive form.  Equations (3.3)--(3.4) do not
say that (5.12) equals an `O--P`, `P--O`, or `P--P` term.  Rather,

\[
 \boxed{
 \text{`B' stays in the `O--O' prime fold, while }
 \mathcal W_Z(O,O)=q_\lambda(X,X)
 \text{ only for the complete combined distribution.}}             \tag{5.13}
\]

Separating the prime block before applying radicality would invalidate
(5.13).

## 6. Endpoint shear is an exact full-metric congruence

Order the complete raw columns as `(8,R)`.  Let

\[
 \eta(f)=f(\lambda),\qquad
 \gamma_t={\eta(f_t)\over\eta(f_8)},                   \tag{6.1}
\]

where the locked shear is defined with `eta(f_8) != 0`.  In column
coordinates put

\[
 S_\eta=
 \begin{pmatrix}1&-\gamma\\0&I_R\end{pmatrix},
 \qquad
 f_t^\#=f_t-\gamma_tf_8.                               \tag{6.2}
\]

Then every rest column is endpoint-null and

\[
 \eta(\mathcal C_\lambda S_\eta a)=\eta(f_8)a_8.       \tag{6.3}
\]

The invisible bump in (2.3) is supported strictly inside the endpoint, so
the correction is linear, commutes with this source congruence, and does not
change (6.3).  All four radical pieces therefore transform on columns by
the same `S_eta`.  In particular,

\[
 D_{\rm full}^\#=S_\eta^*D_{\rm full}S_\eta,
 \quad
 \Sigma_N^\#=S_\eta^*\Sigma_NS_\eta,
 \quad
 Q_X^\#=S_\eta^*Q_XS_\eta.                             \tag{6.4}
\]

Congruencing (0.2) proves

\[
 \boxed{
 -\delta_qD_{\rm full}^\#\preceq
 \Sigma_N^\#-Q_X^\#
 \preceq\delta_qD_{\rm full}^\#.}                    \tag{6.5}
\]

No estimate on `gamma` is needed.  This is why the reduction must be proved
on the entire label-8/rest span before shearing; a theorem for an isolated
edge--edge block cannot be conjugated through (6.2) while its edge--bulk rows
are absent.

For an endpoint-null source the leading physical Poisson row

\[
 {f(\lambda)\over2\sqrt\lambda}e^{-s/2}P(Ae^s)         \tag{6.6}
\]

vanishes exactly.  This does not set `W_-` or `mathfrak B_f` to zero: the
complete `B_2`/Volterra remainder remains, and no estimate for it is asserted
here.

## 7. Sufficient central bound versus the project-minimal Schur gate

### 7.1 A sufficient conductor-preserving bound

Let `mathfrak E_eq` be the already proved raw sampler-equality conductor
subsystem.  On the same zero-integral source synthesis it satisfies

\[
 \mathfrak E_{\rm eq}
 \succeq\left({L\over4}-{1\over4}\log L-C\right)
 D_{\rm full}.                                         \tag{7.1}
\]

Equation (7.1) is not a lower bound for `Q_X`.  One clean **sufficient**
conductor-preserving estimate would be the one-sided, whole-span bound

\[
 \boxed{
 Q_X-\mathfrak E_{\rm eq}
 \succeq-\varepsilon_\lambda D_{\rm full},
 \qquad \varepsilon_\lambda=o(L),}                    \tag{7.2}
\]

uniformly on the complete admitted plus transition span, including the
label-8/rest and edge--bulk cross rows.  Equivalently, on the support of
`D_full`, the negative part of

\[
 D_{\rm full}^{-1/2}
 (Q_X-\mathfrak E_{\rm eq})D_{\rm full}^{-1/2}          \tag{7.3}
\]

must have norm `o(L)`.  Equations (0.2) and (6.5) show that log-Fourier
projection is not the obstruction to (7.2).

Statement (7.2) is **not proved in this note**.  It is stronger than the
project-minimal target below and is not claimed to be necessary.  In
particular, a complete transition matrix may have only a fixed positive
floor even when the equality subsystem is of conductor size; that behavior
would not contradict the actual project target.

Existing inputs do not
control all unequal-sample, non-equality prime, reflected, pole, and
label-8/transition cross contributions in one signed operator estimate.
If a proof is organized through physical outer channels, (5.12) must remain
inside that complete combined estimate.  No standalone `B` theorem and no
standalone raw-prime-discrepancy theorem is logically required when the
complete central form is attacked directly, but neither is supplied here.

### 7.2 The project-minimal fixed-floor target

The actual downstream target is weaker.  Retain the declared split source
metric

\[
 D=D_8\oplus D_R>0,
 \qquad P_0=1_{(0,\infty)}(D^{-1/2}GD^{-1/2}),          \tag{7.4}
\]

and do **not** identify this `D` with `D_full`.  Put

\[
 \mathcal R_0=D^{1/2}P_0D^{1/2}.                       \tag{7.5}
\]

This raw pullback of the physical quotient metric transforms by congruence
under the endpoint shear, even though the normalized coordinate matrix
called `P_0` must be recomputed after changing `D`.

For a fixed real `mu`, define the actual and central raw comparison forms

\[
 F_\mu=\Sigma_N-UG-\mu\mathcal R_0,
 \qquad
 \widehat F_\mu=Q_X-UG-\mu\mathcal R_0.                \tag{7.6}
\]

Thus `F_mu=widehat F_mu+(Sigma_N-Q_X)`.  In the raw column split `(8,R)`,
write

\[
 F_\mu=
 \begin{pmatrix}s_\mu&c_\mu^*\\c_\mu&K_\mu\end{pmatrix}.             \tag{7.7}
\]

The exact project-minimal target is the existence of one fixed
`mu_0>0` and one unbounded locked schedule for which one of the following
equivalent singleton branches holds:

\[
 \boxed{
 \begin{array}{ll}
 s_{\mu_0}>0:&
 K_{\mu_0}-{c_{\mu_0}c_{\mu_0}^*\over s_{\mu_0}}\succeq0,\\[4pt]
 s_{\mu_0}=0:&c_{\mu_0}=0\ \hbox{ and }\ K_{\mu_0}\succeq0.
 \end{array}}                                           \tag{7.8}
\]

The branch `s_{mu_0}<0` is impossible.  This is exactly the unproved
constant-floor condition `F_{mu_0}\succeq0`, equivalently the physical
comparison `B\succeq mu_0 Delta`; it does not require (7.2).

The central reduction gives the following fail-closed sufficient route to
(7.8), with no comparison between `D` and `D_full`:

\[
 \boxed{
 \widehat F_{\mu_0}\succeq\delta_qD_{\rm full}
 \quad\Longrightarrow\quad
 F_{\mu_0}\succeq0.}                                  \tag{7.9}
\]

The same implication holds after the endpoint shear with all three raw
forms congruenced.  Proving (7.9)'s left side, or proving the actual Schur
condition (7.8) by a sharper argument which uses the signed error, is the
remaining whole-span task.  A conductor-scale comparison with
`mathfrak E_eq` is only one sufficient strategy, not the project-minimal
theorem.

This reduction does not prove (7.2), (7.8), or (7.9), and does not alter the
fail-closed project status.
