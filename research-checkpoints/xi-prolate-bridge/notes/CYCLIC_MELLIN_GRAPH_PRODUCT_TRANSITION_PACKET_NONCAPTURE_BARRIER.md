# Cyclic Mellin graph product and transition-packet noncapture barrier

## 0. Exact result and fail-closed boundary

Use the common locked schedule

\[
 \lambda_j=j+{1\over2},\qquad p_j=2j+1,\qquad
 L_j=2\log\lambda_j,\qquad
 N_j=2^{2400(2j+1)^2}=2^{9600\lambda_j^2}.          \tag{0.1}
\]

Let `p=a*kappa` be the actual projected, source-normalized even anchor,
let

\[
 Q_+=\begin{pmatrix}q&b^*\\b&A\end{pmatrix}
 \quad\hbox{on}\quad {\mathbb C}\kappa\oplus\mathcal K,
 \qquad \|\kappa\|=1,                               \tag{0.2}
\]

Put `r=||b||`.  For `r>0`, set `w=b/r`,
`c=<w,Aw>`, and use the exact lower two-vector Ritz value

\[
 u={q+c-\sqrt{(c-q)^2+4r^2}\over2},\qquad
 B=A-u I.                                             \tag{0.3}
\]

If `r=0`, set `u=q`.  This note uses `U=u` throughout.  In particular it
does not use the stronger absolute-sampling shift

\[
 U_Z={\epsilon_\lambda\over a^2},\qquad q\leq U_Z. \tag{0.3a}
\]

Indeed, signs at `U_Z` would imply the two `q`-shifted signs by adding
`(U_Z-q)I`.  On the widening Fourier core those `q`-shifted signs are
already an RH-level gate.  Thus `U_Z` is retained only as a scalar-shift
diagnostic, not substituted into `B` in the determinant route.

The two strict signs

\[
 \boxed{B=A-uI\succ0,\qquad Q_--u I\succ0}          \tag{0.4}
\]

are retained as hypotheses.  They are not proved here and are not proved by
any frozen transition theorem.

For a fixed compact set `Omega` in the open Mellin strip, let `g_z` be the
Riesz vector on `mathcal K` for Mellin evaluation.  The honest uncentered
source-checkable determinant-sufficient graph target is

\[
 \boxed{
 a^2\langle b,B^{-1}b\rangle
 \sup_{z\in\Omega}\langle g_z,B^{-1}g_z\rangle
 \longrightarrow0.}                                  \tag{0.5}
\]

It is not logically minimal.  For any onto source synthesis
`W:X->mathcal K`, set `mathfrak B=W^*BW`.  If `mu` is the actual ground
value, put

\[
 C=A-\mu I=B+(u-\mu)I,
 \qquad \mathfrak C=W^*CW
 =\mathfrak B+(u-\mu)W^*W.                            \tag{0.5a}
\]

The exact determinant observable is the mixed quotient row

\[
 \boxed{
 a\widehat z_\mu(z)
 =-y_z^*\mathfrak C^\dagger\rho_R,}
 \qquad z_\mu=C^{-1}b,                                \tag{0.5b}
\]

up to the fixed inner-product convention.  Local uniform convergence only
needs the right side of (0.5b) to tend to zero uniformly on each compact.
The product (0.5) is a source-checkable sufficient majorant at the known
lower Ritz shift `u`, not the minimal determinant statement.

This note proves the following exact statements.

1.  If `W:X->mathcal K` is any onto source synthesis and

    \[
      \mathfrak B=W^*BW,
    \]

    then (0.5) is exactly the product of the inverse energies of the weak
    residual row `rho_R` and the Mellin rows `y_z` in the quotient metric
    `mathfrak B`.  At the actual shift, (0.5b) is the strictly weaker mixed
    quotient target.
2.  Ordinary absolute zero sampling gives a small residual numerator, but
    neither it nor the quotient identity bounds the first inverse energy.
    A signed residual-to-graph comparison is still missing.  The second
    inverse energy likewise requires a source-specific Mellin leverage
    inequality.
3.  The realized transition space `E` does not supply either comparison.
    It has fixed dimension, no frozen capture or reducing relation with the
    cyclic forcing and Mellin spans, and its positive nonresonant-prime
    frame is canceled at leading order by the continuous block in the
    complete central form.
4.  The frozen exact `N=1` source-Cauchy model already shows that Cauchy
    displacement, both strict signs, and a residual tending to zero can
    coexist with a lower-Ritz Mellin graph product tending to `pi`, rather
    than zero.  A second finite model retains the residual sampling
    inequality, transition
    cancellation and prime-frame scales, and all quotient identities while
    the product in (0.5) diverges.
5.  The exact missing scale is nevertheless favorable.  If the two
    source-graph comparisons (3.6)--(3.7) below hold, then

    \[
    \begin{aligned}
     &a^2\langle b,B^{-1}b\rangle
       \sup_{z\in\Omega}\langle g_z,B^{-1}g_z\rangle\\
     &\qquad\leq
       \epsilon_\lambda C_R(\lambda)C_E(\lambda)
       {M_\Omega(L)\over d_8}.
    \end{aligned}                                    \tag{0.6}
    \]

    Here `M_Omega(L)` is the exact raw Mellin-row norm in (3.4).  The frozen
    hybrid estimate and fixed-index defect ratio give

    \[
      {\epsilon_\lambda\over d_8}
      =O\!\left(\lambda^{-5}\operatorname {polylog}\lambda\right)
       +o(\lambda^{-8}).                              \tag{0.7}
    \]

No frozen input proves (3.6), (3.7), either `u`-shifted sign in (0.4), or
(0.5).  The stronger `U_Z`-shifted signs are deliberately not hypotheses:
because `q<=U_Z`, they imply the `q`-shifted signs and are already RH-level
on the admitted widening core.  No RH assumption, global zero-frame
positivity, uniform ambient gap, zero
table, or numerical prolate datum is used.  This note proves no determinant
limit, equation (5.2) of `DIRECT_RH_ATTACK.md`, or RH conclusion.  The
formal state remains `P0_INVALIDATED`.

## 1. Frozen inputs

| Dependency | SHA-256 |
|---|---|
| `notes/VECTOR_SPECIFIC_EQUATION_52_ATTACK.md` | `79b9af2baddd0b2ae794e77bccf749c6fa0458afbf4637ca8b84931d8206788f` |
| `notes/POLYLOG_SHIFTED_SOLVE_OBSERVABLE_REDUCTION.md` | `5b7618305c56e2b1b403cd437c4cffad0ea4214396739ce2fed7a351ebb9fcfa` |
| `notes/PROJECTIVE_WEDGE_RESOLVENT_REDUCTION.md` | `aae9399deac920452a4dc9a3f865503bf987ac2be7fc3c11c515ae2ad02b9b55` |
| `notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md` | `78e0b9a7c3512bcd2b5fe34d48594734b6323fc57ca55db5e4090d6d6a277fb3` |
| `tests/test_q_shift_sector_weil_core_gate.py` | `714f9839b0514c779f1fc05d558dd9446654de360dd1f0cc70502cba75fa6bf2` |
| `notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md` | `b0254889d35ae41a92ee926dd116b473ee427e2762f8853903f4e80e307860ed` |
| `tests/test_weak_residual_duality.py` | `0f1f9847497b63b6b2c9e4b9f267dd8157ab71547f80b127d65cbda16af9d659` |
| `notes/SIGNED_GRAPH_OBSERVABILITY_REDUCTION.md` | `172890ec08c6c0db47fefe275870bfabaa196c43f18b765d94aa51d09c9fad6e` |
| `notes/RAYLEIGH_SELF_REGULARIZED_OBSERVABLE.md` | `96cb3e7302c95ed5357cff66a2c3df261b326e3e489700b1191c56fa3b6e14f3` |
| `tests/test_rayleigh_self_regularized_observable.py` | `672c8b09e8f836231bd63a6f257d2e931d0140f0acd1464e81ab55c9295d7f1f` |
| `notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md` | `3efbbf5cd0888d2a645b11c73b625007bf38bf010881d5e0c9d8ecbc964fb1a6` |
| `tests/test_ritz_moment_self_regularized_transfer.py` | `9ef4ed1d6fc282de372f6c91518b5f02207ea80d9ed98306efff6f8477867d4c` |
| `notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md` | `113be74d52f48d66903c1babf1525ec6d130243321acfa31562abd8640868a3a` |
| `tests/test_hybrid_outer_sampling_odd_shift.py` | `9ecd210103e73853f242ef5301ee676e8cd89198a6e5554f89773b2c90dcba0d` |
| `notes/PROLATE_DEFECT_SOURCE_AUDIT.md` | `b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d` |
| `tests/test_prolate_defect_source_lock.py` | `7caa8d088522d68dc4dedfad8d00d8e5c7e15070065c743d9e2a41f9e7faa519` |
| `notes/PROJECTED_STATE_NORM_LOWER_BOUND.md` | `3847cbcb6e5bfc458af7bf957ff67afb0b943155d62f4239129b40332d270fbf` |
| `tests/test_projected_state_norm_lower_bound.py` | `d740587d2af62c5ef1b1255dc8184d8bea0833c70740b6697407678f90e1d079` |
| `notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md` | `787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79` |
| `tests/test_growing_transition_forced_ordered_nonresonant_prime_frame_theorem.py` | `73913c60eb3862668631a0f846be2d40c82978c62248c9084c173d76913a44b7` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_MOVING_DIVISOR_DENSITY_DISCREPANCY_VOLTERRA_THEOREM.md` | `3c2005552a6c18919f31391d64a33d54be0ce51fc8a9190474fec58b06477f83` |
| `notes/GROWING_TRANSITION_DISCREPANCY_ZERO_ORBIT_BERNOULLI_TAIL_BARRIER.md` | `29270fcd5a38282ca06d0726afa1fc0334ae0fd2cdb64b9cf3ee6ef9b3ba5d48` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |

The positive sampling Gram used below is the ordinary two-evaluation
sequence Gram.  It is not the signed Weil form and does not require zeros to
lie on the critical line.

## 2. Exact quotient graph product

Let `X` be a finite source-coordinate space and let

\[
 W:X\longrightarrow\mathcal K                              \tag{2.1}
\]

be onto.  It may have a kernel and may be arbitrarily ill-conditioned in
the source Euclidean metric.  Under the first sign in (0.4), put

\[
 \mathfrak B=W^*BW\succeq0,
 \qquad \ker\mathfrak B=\ker W.                         \tag{2.2}
\]

The exact quotient inverse identity is

\[
 \boxed{W\mathfrak B^\dagger W^*=B^{-1}.}             \tag{2.3}
\]

Let `R_glob` be the complete radical remainder.  If `rho_R` represents

\[
 x\longmapsto\mathcal W_Z(Wx,R_{\rm glob}),              \tag{2.4}
\]

then the weak residual identity gives

\[
 \rho_R=-aW^*b.                                          \tag{2.5}
\]

For Mellin evaluation let `ell_z` be the full Riesz vector and put

\[
 g_z=P_{\mathcal K}\ell_z,
 \qquad y_z=W^*g_z.                                     \tag{2.6}
\]

Equations (2.3)--(2.6) prove

\[
 \boxed{
 a^2\langle b,B^{-1}b\rangle
   =\rho_R^*\mathfrak B^\dagger\rho_R,}                 \tag{2.7}
\]

\[
 \boxed{
 \langle g_z,B^{-1}g_z\rangle
   =y_z^*\mathfrak B^\dagger y_z.}                      \tag{2.8}
\]

Thus the source version of (0.5) is exactly

\[
 \boxed{
 \left(\rho_R^*\mathfrak B^\dagger\rho_R\right)
 \sup_{z\in\Omega}
 \left(y_z^*\mathfrak B^\dagger y_z\right)\longrightarrow0.}
                                                               \tag{2.9}
\]

The pseudoinverse in (2.7)--(2.9) removes redundant source coordinates.  It
does not bound either quadratic form.  In particular, no condition number
of `W` appears, but positivity and small eigenvalues of the complete signed
form are unchanged.

### 2.1 The strictly weaker actual-shift mixed row

Let `mu<=u` be the actual simple even ground value supplied conditionally by
the two signs, and set

\[
 h=u-\mu\geq0,
 \qquad C=A-\mu I=B+hI,                               \tag{2.10}
\]

\[
 \mathfrak C=W^*CW
 =\mathfrak B+hW^*W.                                  \tag{2.11}
\]

The quotient inverse identity also gives

\[
 W\mathfrak C^\dagger W^*=C^{-1}.                    \tag{2.12}
\]

Since `z_mu=C^(-1)b`, equations (2.5), (2.6), and (2.12) prove, up to the
fixed choice of which inner-product slot is linear,

\[
 \boxed{
 a\widehat z_\mu(z)
 =a\langle g_z,C^{-1}b\rangle
 =-y_z^*\mathfrak C^\dagger\rho_R.}                  \tag{2.13}
\]

Thus the logically minimal uncentered compact-observable target is

\[
 \boxed{
 \sup_{z\in\Omega}
 |y_z^*\mathfrak C^\dagger\rho_R|\longrightarrow0.} \tag{2.14}
\]

Positive-metric Cauchy--Schwarz at the actual shift gives the intermediate
majorant

\[
 |y_z^*\mathfrak C^\dagger\rho_R|^2
 \leq
 (\rho_R^*\mathfrak C^\dagger\rho_R)
 (y_z^*\mathfrak C^\dagger y_z).                     \tag{2.15}
\]

The known-shift graph argument then gives

\[
 \boxed{
 |y_z^*\mathfrak C^\dagger\rho_R|^2
 \leq
 (\rho_R^*\mathfrak B^\dagger\rho_R)
 (y_z^*\mathfrak B^\dagger y_z).}                    \tag{2.16}
\]

Equation (2.16) is exactly why (2.9) is sufficient.  It can be strict by an
arbitrarily large factor: the self-consistent positive ridge `hW^*W` and
the mixed orientation can suppress (2.13) even when one or both unshifted
inverse energies are large.  The price of the sharper target (2.14) is that
`mu`, hence `mathfrak C`, is not known from the Ritz certificate
alone.

The lower Ritz shift also carries a separate finite residual-ridged
alternative which must not be lost by replacing `u` with `U_Z`.  For
`r=||b||>0`, put `d=q-u`.  The frozen Ritz-moment theorem gives

\[
 z_\mu z_\mu^*\preceq
 A_{\rm R}(d/r)\,r(B+rI)^{-1},                         \tag{2.17}
\]

where

\[
 A_{\rm R}(x)=
 \begin{cases}
  1+x+\tfrac12x(1+x)^2,&0\leq x\leq1,\\
  1+x+2x^2,&x\geq1.
 \end{cases}                                          \tag{2.18}
\]

Consequently another sufficient, source-checkable compact target is

\[
 \boxed{
 a^2A_{\rm R}(d/r)r
 \sup_{z\in\Omega}\langle g_z,(B+rI)^{-1}g_z\rangle
 \longrightarrow0.}                                  \tag{2.19}
\]

This ridged target and the unshifted product (2.9) are alternative
majorants of the same minimal mixed row (2.14).  No frozen arithmetic input
proves (2.19) either; in particular no current estimate controls the
multiplier `A_R(d/r)` together with the Mellin response at the required
rate.

There is one further exact piece of information about the first unshifted
factor.  Since `U=u`, the two-vector Ritz determinant vanishes and forces

\[
 d\langle w,Bw\rangle=r^2.                            \tag{2.20}
\]

Consequently

\[
 \boxed{
 E_u:=\langle b,B^{-1}b\rangle=d+\chi_u,}             \tag{2.21}
\]

where

\[
 \chi_u=r^2\left\{
 \langle w,B^{-1}w\rangle-{1\over\langle w,Bw\rangle}
 \right\}\geq0.                                      \tag{2.22}
\]

The last sign is metric Cauchy--Schwarz.  Thus lower-Ritz geometry fixes
the harmonic-mean contribution `d`, but it gives no upper bound for the
spectral-spread term `chi_u`.  An upper bound for `a^2(d+chi_u)` of the
needed size is still missing.  Even the favorable case `chi_u=0` does not
control the independent Mellin leverage: the exact one-dimensional
source-Cauchy model in Section 5 has `chi_u=0` and a graph product tending
to `pi`.

The absence of an upper bound for `chi_u` is sharp already in two
complementary dimensions.  For `0<epsilon<1`, take

\[
 u=0,\quad q=d=\epsilon,\quad r=\epsilon,\quad
 w={e_1+e_2\over\sqrt2},\quad b=rw,                  \tag{2.23}
\]

and

\[
 B=A=\operatorname {diag}
       (\epsilon^4,2\epsilon-\epsilon^4).             \tag{2.24}
\]

Then `<w,Bw>=epsilon`, so the compression to `span{kappa,w}` is
`[[epsilon,epsilon],[epsilon,epsilon]]` and its lower Ritz value is exactly
`u=0`.  Both `u`-shifted signs hold after taking `Q_-=I`.  With `a=1`,
`epsilon_lambda=epsilon`, and `G_+=I`, one also has

\[
 bb^*\preceq\epsilon_\lambda G_+,
 \qquad q=U_Z=\epsilon.                               \tag{2.25}
\]

Nevertheless

\[
 E_u={\epsilon^2\over2}
 \left\{\epsilon^{-4}+{1\over2\epsilon-\epsilon^4}\right\}
 \longrightarrow\infty.                              \tag{2.26}
\]

The stronger `q`-shifted even sign fails because
`epsilon^4-epsilon<0`.  This is a sharpness model for the abstract frozen
inequalities, not an arithmetic Weil matrix; Section 5 separately retains
the exact source-Cauchy architecture.

## 3. Residual sampling, Mellin-row size, and the exact missing scale

Let `mathsf Z` be the ordinary paired-zero sampling analysis on `mathcal K`
and put

\[
 G_+=\mathsf Z^*\mathsf Z\succeq0,
 \qquad \mathfrak G=W^*G_+W.                            \tag{3.1}
\]

With `c=ab`, ordinary sequence Cauchy--Schwarz gives

\[
 cc^*\preceq\epsilon_\lambda G_+.                       \tag{3.2}
\]

Pulling (3.2) back by `W` and using (2.5) gives the exact source inequality

\[
 \boxed{\rho_R\rho_R^*\preceq
          \epsilon_\lambda\mathfrak G.}                 \tag{3.3}
\]

This is a small numerator, not an inverse estimate.

For the Fourier convention

\[
 \widehat v(z)=\int_{-L/2}^{L/2}v(x)e^{-izx}\,dx,
\]

define the exact raw row size

\[
\boxed{
 M_\Omega(L):=\sup_{z\in\Omega}\|\ell_z\|^2
 =\sup_{z\in\Omega}
 \begin{cases}
 L,&\operatorname {Im}z=0,\\[1mm]
 {\sinh(L\operatorname {Im}z)\over\operatorname {Im}z},
     &\operatorname {Im}z\ne0.
 \end{cases}}                                           \tag{3.4}
\]

Projection gives only `||g_z||^2<=M_Omega(L)`.  If
`eta=max_(z in Omega)|Im z|`, then

\[
 M_\Omega(L)=
 \begin{cases}
  L,&\Omega\subset\mathbb R,\\
  O_\Omega(\lambda^{2\eta}),&0<\eta<1/2.
 \end{cases}                                            \tag{3.5}
\]

No ambient lower gap is inserted.  The source-specific comparisons needed
for the two rows are instead

\[
 \boxed{\mathfrak G\preceq C_R(\lambda)\mathfrak B,}    \tag{3.6}
\]

and

\[
 \boxed{
 y_zy_z^*\preceq
 C_E(\lambda){M_\Omega(L)\over d_8}\mathfrak B
 \quad(z\in\Omega).}                                    \tag{3.7}
\]

Both inequalities are understood on `(ker W)^perp`; all displayed rows
annihilate `ker W`.  Congruence by `mathfrak B^(dagger/2)` in (3.3), (3.6),
and (3.7) proves

\[
 \rho_R^*\mathfrak B^\dagger\rho_R
 \leq\epsilon_\lambda C_R(\lambda),                    \tag{3.8}
\]

\[
 \sup_{z\in\Omega}y_z^*\mathfrak B^\dagger y_z
 \leq C_E(\lambda){M_\Omega(L)\over d_8}.              \tag{3.9}
\]

This proves (0.6).  Inequality (3.7) is a Mellin-observable graph estimate;
it allows arbitrarily soft directions invisible to the chosen Mellin rows
and is strictly narrower than an ambient bound `B>=c*d_8*I`.  Likewise,
(3.6) compares only the positive sampling directions to the complete signed
graph.

The hybrid theorem gives the exact finite majorant

\[
 \epsilon_\lambda
 \leq2B_{\rm hyb}(\lambda)d_4+o(d_4),
 \qquad
 B_{\rm hyb}(\lambda)
 =O(\lambda^3\operatorname {polylog}\lambda).          \tag{3.10}
\]

The pinned defect ratio is

\[
 \lambda^8{d_4\over d_8}
 \longrightarrow {105\over4096\pi^4}.                  \tag{3.11}
\]

Equations (3.10)--(3.11) prove (0.7).  Therefore a sufficient exact growth
condition is

\[
 \boxed{
 {\epsilon_\lambda\over d_8}
 C_R(\lambda)C_E(\lambda)M_\Omega(L)\longrightarrow0.}   \tag{3.12}
\]

In particular, after absorbing the fixed polylogarithmic majorant from
(3.10), it is sufficient that

\[
 C_RC_E=o\!\left({\lambda^5\over
             L\operatorname {polylog}\lambda}\right)
 \quad(\Omega\subset\mathbb R),                         \tag{3.13}
\]

or

\[
 C_RC_E=o\!\left({\lambda^{5-2\eta}\over
             \operatorname {polylog}\lambda}\right),
 \qquad 0<\eta<1/2.                                    \tag{3.14}
\]

Bounded `C_R,C_E` are much stronger than necessary.  No frozen theorem
proves even a divergent pair within (3.13)--(3.14).  The first quantitative
failure in the natural proof order is (3.6): without it, (3.3) does not
bound the forcing inverse energy at all.  Even granting (3.6), the Mellin
leverage (3.7) remains independent.

## 4. Why the transition and zero-row theorems do not apply

First separate the two possible shifts.  The weak-residual theorem proves
`q<=U_Z`, so hypothetical signs at the absolute-sampling shift would give

\[
 A-qI=(A-U_ZI)+(U_Z-q)I\succ0,                       \tag{4.0a}
\]

\[
 Q_--qI=(Q_--U_ZI)+(U_Z-q)I\succ0.                  \tag{4.0b}
\]

The pinned `q`-shift core gate shows that (4.0a)--(4.0b), on the admitted
widening source core, already imply the Weil criterion and hence are
RH-level.  This is why (0.4) uses the genuine lower Ritz shift `u<=q`, not
`U_Z`.  The uncontrolled lowering `q-u` is precisely what prevents the
`u`-shifted signs alone from giving that conclusion.

The forced transition theorem starts with an `m`-dimensional local negative
space for fixed `m>7` and imposes seven scalar rows.  Its surviving space

\[
 E=E_-\cap\bigcap_{r=1}^7\ker\ell_r,
 \qquad 0<\dim E\leq m                                  \tag{4.1}
\]

is white in the exterior-defect quotient of that one modal packet.  The
determinant complement `mathcal K` on (0.1) has growing dimension.  No
frozen result proves any of

\[
 b\in E,\qquad g_z\in E,\qquad
 \|P_Eb\|\geq c\|b\|,\qquad
 \|P_Eg_z\|\geq c\|g_z\|,\qquad BE\subset E.          \tag{4.2}
\]

Even granting a physical embedding of `E` into `mathcal K`, this lack of
capture and reduction prevents a compression estimate from controlling a
full inverse quadratic form.

More decisively, on `E` the frozen complete matching is

\[
 \|P_E(Q_{\rm off}+Q_{\rm cont})P_E\|=o(T_L),
 \qquad
 P_EQ_{\rm cont}P_E\preceq-cT_LP_E,
 \qquad
 P_EQ_{\rm off}P_E\succeq c'T_LP_E.                    \tag{4.3}
\]

Thus the positive nonresonant-prime frame is canceled by the continuous
block at the same scale.  It is not a lower bound for the complete `B` in
(0.3).  The moving-discrepancy theorem and its zero-orbit rewrite preserve
this same cancellation.

The completed zero-row formula also cannot replace (3.6).  At a
critical-line conjugate pair it becomes a positive Gram only after using
the critical-line relation.  Off the line a full quartet has exchange
signature, and no frozen source-compatible uniform intertwiner identifies
the row Krein form with a positive Hilbert feature.  Treating the completed
zero rows as a global positive `G_+` would therefore assume the missing
RH-strength conclusion.

## 5. Exact source-Cauchy strictness model

The exact centered `N=1` structural model from the frozen Rayleigh note uses
raw indices `-1,0,1`.  Take `a=1`; for `epsilon>0`, set

\[
 b_0=0,\qquad b_1=-\epsilon,\qquad b_{-1}=\epsilon,
 \qquad
 a_0=0,\qquad a_1=a_{-1}=2\epsilon^2+\epsilon,       \tag{5.1}
\]

\[
 Q_{nn}=a_n,
 \qquad Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m).     \tag{5.2}
\]

Thus the exact source Cauchy displacement and inversion symmetry hold.  In
the normalized even basis `kappa=V_0`,
`e_1^+=(V_1+V_(-1))/sqrt(2)`,

\[
 Q_+=
 \begin{pmatrix}
 0&-\sqrt2\epsilon\\
 -\sqrt2\epsilon&2\epsilon^2
 \end{pmatrix},
 \qquad Q_-=2\epsilon^2+2\epsilon.                  \tag{5.3}
\]

Because this even sector is two dimensional, its lower two-vector Ritz
value is its actual even ground value,

\[
 u=\mu=\epsilon^2-\epsilon\sqrt{\epsilon^2+2}.
                                                               \tag{5.4}
\]

Thus at the genuine lower Ritz shift

\[
 B=A-uI
 =\epsilon\{\epsilon+\sqrt{\epsilon^2+2}\}>0,
 \qquad Q_--uI
 =\epsilon\{\epsilon+2+\sqrt{\epsilon^2+2}\}>0,       \tag{5.5}
\]

while

\[
 \qquad b=-\sqrt2\epsilon e_1^+,
 \qquad \|b\|\longrightarrow0.                       \tag{5.6}
\]

Fix `L=2*pi`.  At the bounded real frequency `t=1`, the actual Mellin row
after anchor removal is

\[
 g_1=-\sqrt\pi\,e_1^+.                                \tag{5.7}
\]

Therefore the two lower-Ritz inverse factors are exactly

\[
 \langle b,B^{-1}b\rangle
 ={2\epsilon\over\epsilon+\sqrt{\epsilon^2+2}},
 \qquad
 \langle g_1,B^{-1}g_1\rangle
 ={\pi\over\epsilon\{\epsilon+\sqrt{\epsilon^2+2}\}}.
                                                               \tag{5.8}
\]

Their product, and also the square of the actual mixed observable because
`mu=u` and the complement is one dimensional, is

\[
 \boxed{
 {2\pi\over\{\epsilon+\sqrt{\epsilon^2+2}\}^2}
 \longrightarrow\pi.}                                \tag{5.9}
\]

Hence neither the sufficient product nor the minimal mixed row tends to
zero.  At the stronger Rayleigh shift `q=0`, one instead has
`B_q=2*epsilon^2`, residual energy one, Mellin leverage
`pi/(2*epsilon^2)`, and a divergent product.  That sharper diagnostic is
not the main theorem shift because `q`-shifted signs are RH-level for the
arithmetic widening core.  The lower-Ritz failure (5.9) is the relevant
one here.  It is stronger than an arbitrary soft direction: the bad
direction is an actual bounded-frequency evaluation row and the matrix has
the exact finite source-Cauchy architecture.  The model is structural, not
the arithmetic Weil matrix, and does not contain the transition packet.
The next model isolates that independent noncapture issue.

## 6. Finite transition-noncapture countermodel

Let `E` be any nonzero finite Hilbert space, let `h` be a unit vector
orthogonal to it, and put

\[
 \mathcal K=E\oplus{\mathbb C}h.                          \tag{6.1}
\]

Choose sequences

\[
 T_j\longrightarrow\infty,
 \qquad \epsilon_j\downarrow0,                         \tag{6.2}
\]

and set

\[
 \delta_j=\epsilon_j^{3/4},
 \qquad d_j={\epsilon_j\over\delta_j}=\epsilon_j^{1/4},
 \qquad B_j=I_E\oplus\delta_j I_h.                       \tag{6.3}
\]

Take `a=1`, `q=0`, and use the genuine lower Ritz shift

\[
 U_j=u_j=-d_j<q\leq U_{Z,j}=\epsilon_j.                \tag{6.4}
\]

Define

\[
 A_j=U_jI+B_j,\qquad b_j=\sqrt{\epsilon_j}\,h,
 \qquad Q_--u_j I=I.                                    \tag{6.5}
\]

After shifting the `kappa,h` compression by `u_j`, its matrix is

\[
 \begin{pmatrix}
  d_j&\sqrt{\epsilon_j}\\
  \sqrt{\epsilon_j}&\delta_j
 \end{pmatrix},
 \qquad d_j\delta_j=\epsilon_j.                       \tag{6.6}
\]

It is positive semidefinite of determinant zero and positive trace.
Therefore `u_j` is exactly the lower two-vector Ritz value; because (6.5)
has both strict complement signs, it is also the simple global ground
value.  Notice that the `q`-shifted even complement fails on `h`, since

\[
 \langle h,(A_j-qI)h\rangle=\delta_j-d_j<0             \tag{6.7}
\]

eventually.  Thus this model exercises the intended lower-Ritz route, not
the RH-level `q`- or `U_Z`-shift route.

Let

\[
 G_+=hh^*,\qquad g_{z_0}=h.                            \tag{6.8}
\]

Then

\[
 b_jb_j^*=\epsilon_jG_+,                               \tag{6.9}
\]

but

\[
 \langle b_j,B_j^{-1}b_j\rangle
 ={\epsilon_j\over\delta_j}=\epsilon_j^{1/4},
 \qquad
 \langle g_{z_0},B_j^{-1}g_{z_0}\rangle
 ={1\over\delta_j}=\epsilon_j^{-3/4}.                 \tag{6.10}
\]

Their product, which here is also the square of the actual mixed row, is

\[
 \boxed{{\epsilon_j\over\delta_j^2}
 =\epsilon_j^{-1/2}\longrightarrow\infty.}            \tag{6.11}
\]

The transition compression can be imposed simultaneously by defining on
`E`

\[
 Q_{{\rm cont},j}=-T_jI_E,
 \qquad Q_{{\rm off},j}=(T_j+1-d_j)I_E.                \tag{6.12}
\]

Then

\[
 Q_{{\rm off},j}+Q_{{\rm cont},j}
 =(1-d_j)I_E=o(T_j),                                   \tag{6.13}
\]

while the separate negative and positive frame bounds hold with room.  The
complete compression `(1-d_j)I_E` agrees with the `E` block of `A_j`,
while shifting by `u_j=-d_j` leaves the `E` block `I_E` of `B_j`.

Finally take `W=I_(mathcal K)`.  Then

\[
 \mathfrak B=B_j,
 \qquad \rho_R=-b_j,
 \qquad y_{z_0}=g_{z_0},                              \tag{6.14}
\]

so every quotient identity (2.3), (2.7), and (2.8) is literal.  This model
does not imitate the arithmetic source.  It proves the precise logical
point: the presently frozen residual numerator, strict signs, transition
packet compressions, and quotient algebra do not imply the product.  In
combination with the spread model (2.23)--(2.26), they give no useful upper
bound for either inverse factor.  A new source-specific signed comparison
is mathematically necessary.

## 7. Remaining theorem

On the explicit schedule (0.1), the earliest complete route is:

1. prove both strict lower-Ritz-shifted signs (0.4) for the exact
   pole--Archimedean--minus-prime matrix;
2. prove the residual signed-graph comparison (3.6) and the Mellin-row
   leverage (3.7), or prove their product directly at the scale (3.12);
3. retain the exact quotient form `mathfrak B=W^*BW`, the weak residual row,
   and every Mellin row before taking pseudoinverses; and
4. combine (0.5) with the already-proved source projection and determinant
   transfer theorem.

Conditionally on the signs, the first missing row-specific control is an
upper bound for `a^2(d+chi_u)` in (2.21)--(2.22).  The full Loewner
comparison (3.6) is one sufficient source-signed way to obtain it, but is
strictly stronger because it controls every sampling direction.  Even
after either first-factor bound, (3.7) is independent.  The
residual-ridged route (2.19) is a legitimate alternative to step 2, but its
multiplier and Mellin response are likewise unbounded by the frozen inputs.

Substituting `U_Z` for `u` is not a shortcut.  Since `q<=U_Z`, proving both
`U_Z`-shifted signs would prove the `q`-shifted signs (4.0a)--(4.0b), which
are already RH-level on this widening core; the graph product would then be
logically redundant.

The transition prime frame, completed zero rows, a scalar residual norm, or
strict positivity without a quantitative graph comparison closes none of
these steps.
