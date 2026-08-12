# Growing mixed-bridge actual-multiplier dangerous Feshbach reduction

## 0. Exact outcome and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad L=2\log\lambda,\qquad
 N=2^{9600\lambda^2},\qquad R=\sqrt N=2^{4800\lambda^2}.
                                                               \tag{0.1}
\]

This note combines the genuine complete von-Mangoldt multiplier with the
retained-complement two-stage Schur gate.  It proves an exact cost
reduction, not a sign.

For the complete shifted even and odd operators, the actual multiplier
produces source-defined dangerous spaces with common safe floor `delta`.
After any already justified positive far elimination, pull those physical
dangerous spaces back through the exact harmonic lift.  Adjoining the
captured parity cap and coherent bridge gives a coordinate space
`mathcal S_lambda` such that

\[
 \boxed{
 \dim\mathcal S_\lambda
 \leq O(L)+1+{L\Phi_\lambda(U,g)\over\pi(g-\delta)}
 =O(L)+\exp(O(\lambda)).}                            \tag{0.2}
\]

The orthogonal complement of `mathcal S_lambda` has a strict floor for the
zero-metric-subtraction retained operator.  Exact Feshbach elimination
therefore reduces its positivity from a space of size at least
`R-O(L)` to the operator on `mathcal S_lambda`.  This is an actual-multiplier
reduction: the projector is defined by the complete source symbol with its
inclusive von-Mangoldt sum, and the odd negative pole costs one explicit
direction.

There are two essential limitations.

1. For the source-angle operator

   \[
    T_\theta=\Sigma_u-\theta\Delta_Y,                 \tag{0.3}
   \]

   the same reduction needs the additional safe-space metric inequality
   `theta C_(Delta,mathcal F)<delta`.  It is automatic at `theta=0`, but no
   frozen theorem proves it at the desired positive `theta`.

2. In the original captured/bridge/retained order, the first unsupported
   line remains

   \[
    \boxed{R_{1,\theta}:=
    R_\theta-X_\theta A_\theta^{-1}X_\theta^*\succeq0.}
                                                               \tag{0.4}
   \]

   If this short is positive, the remaining bridge obligation is the
   constant-scale inverse leverage

   \[
    \boxed{
    y_{1,\theta}^*R_{1,\theta}^{-1}y_{1,\theta}
       \leq q_{1,\theta},\qquad q_{1,\theta}\geq c_b=\Theta(1).}
                                                               \tag{0.5}
   \]

Thus the multiplier reduces the dimension of the exact obstruction, but
does not orient it.  The sharp remaining source-specific target is the
signed-discrepancy Feshbach inf--sup recalled in Section 6.

No retained sign, complete even or odd sector sign, source-angle theorem,
determinant limit, zero statement, or Riemann-hypothesis conclusion is
proved.  The formal state remains `P0_INVALIDATED`, and the standard eight
are unchanged.

## 1. Frozen inputs

Only the following exact repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_MIXED_BRIDGE_RETAINED_COMPLEMENT_TWO_STAGE_SCHUR_BARRIER.md` | `102f69ec567803153d5648316874c8369cd558ee17cfce71f3cca2e9bb259f81` |
| `tests/test_growing_mixed_bridge_retained_complement_two_stage_schur_barrier.py` | `0613ef6cb25d6c1c7182011d7092fb42786af3a1d25244d2d0451f26f8098a15` |
| `notes/GROWING_RETAINED_NEGATIVE_INDEX_CAPTURE_BARRIER.md` | `9fc64fedde255791775861e7a3bb2b2d55eab1a3d402cf8b842d9e0d8519424c` |
| `tests/test_growing_retained_negative_index_capture_barrier.py` | `1e6067e8e4795eac284a8efc12bfc235ff7a6590efce28428b4569320257c4aa` |
| `notes/PARITY_DANGEROUS_ALL_SHIFT_METRIC_ROTATION_AUDIT.md` | `23f0a23f39cb52d6d754dc88e1ea0d779948a78edffc7e5db3ee2cb687e035ea` |
| `notes/LOCKED_MULTIPLIER_DANGEROUS_EXTERIOR_COFRAME_REDUCTION.md` | `5cc71bf159432e4b651ecad4db2b1702a5288e647ce4025fcf1fb3378bd36d2c` |
| `notes/ODD_MULTIPLIER_DANGEROUS_EXTERIOR_COFRAME_REDUCTION.md` | `85efc9bcb2228f0007af10943c693276b8a819fe9198bd76176d4a329574657a` |
| `notes/LOWER_RITZ_HALF_POWER_ONE_INVERSE_SOURCE_ANGLE_REDUCTION.md` | `aed972d7f32b599179c0f769a6255401cd0127c7ba9dec4340494e73815b3dce` |
| `tests/test_lower_ritz_half_power_one_inverse_source_angle_reduction.py` | `27b8284faefe471934d40ca0937bdba4cb4a764b7aa1597559fd1cc0c774a9ed` |
| `notes/PHASE_VOLUME_SCALE_AUDIT.md` | `bae7414fed2ac861ac3211175cd8f8b7743c33bd37379e186a71d700554b7fcd` |
| `notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md` | `ec2881e0f233c2c57101e960e3b43cd0abfbf9ee25f342f08a01f35827883d7f` |

The first pair fixes the exact two-stage retained gate and its
`R-O(L)` unresolved dimension.  The second pair fixes the strongest
outer-cutoff-uniform negative-index scale.  The three multiplier notes fix
the actual even and odd dangerous projectors, the pole convention, and the
all-shift obstruction.  The lower-Ritz note fixes the harmonic lift and
the one-power metric.  The last two notes fix why available phase-volume
and compressed-trace estimates do not give a polynomial retained theorem.

## 2. Actual paired multiplier and dangerous space

Retain the complete source multiplier

\[
 m_\lambda(t)=
 \operatorname {Re}\psi\!\left({1\over4}+{it\over2}\right)-\log\pi
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).              \tag{2.1}
\]

For `g>delta>0` and the admitted upper shift `U`, put

\[
 v(t)=[g+U-m_\lambda(t)]_+,
 \qquad T_v=C_\lambda^*\mathcal F^*M_v\mathcal F C_\lambda,
 \qquad
 \Phi_\lambda(U,g)=\int_{\mathbb R}v(t)\,dt.         \tag{2.2}
\]

On the anchor-compressed even sector and the odd sector, respectively, the
exact identities are

\[
 B_+=gI+T_a-T_v+2|p_+\rangle\langle p_+|,
 \qquad
 B_-=gI+T_a-T_v-2|p_-\rangle\langle p_-|,            \tag{2.3}
\]

after the indicated finite compressions.  Here every occurrence of `T_a`
is positive.  The prime term in (2.1) retains its source minus sign, and the
negative odd pole in (2.3) is not discarded.

Let `mathcal Y_+` be the even spectral subspace of the compressed `T_v`
above threshold `g-delta`.  Let `mathcal Y_-^sharp` be the corresponding
odd multiplier subspace together with `span{p_-}`.  Put

\[
 \mathcal D_{\rm mv}=\mathcal Y_+\oplus\mathcal Y_-^\sharp,
 \qquad
 \mathcal G_{\rm mv}=\mathcal D_{\rm mv}^{\perp}.     \tag{2.4}
\]

The exact multiplier theorem gives

\[
 P_{\mathcal G_{\rm mv}}(B_+\oplus B_-)
 P_{\mathcal G_{\rm mv}}\succeq\delta I,             \tag{2.5}
\]

and

\[
 \boxed{
 \dim\mathcal D_{\rm mv}
 \leq1+{L\Phi_\lambda(U,g)\over\pi(g-\delta)}.}      \tag{2.6}
\]

The same projector works for every lower scalar shift `u<=U`, because the
complete paired operator gains `(U-u)I`.  Its safe floor is then at least
`delta+U-u`.

With `g+U=O(L)`, `g-delta` not exponentially small, and only the frozen
absolute phase-volume estimate, (2.6) gives

\[
 \dim\mathcal D_{\rm mv}=\exp(O(\lambda)).            \tag{2.7}
\]

This is uniform in the much larger outer cutoff.  It is not an
`O(lambda^2)` or `O(L)` result.

## 3. Pullback through the already proved far elimination

Let `mathcal K=Y\oplus F` be any of the already justified positive far
splits of the same complete shifted operator, and write

\[
 \mathbb B_u=
 \begin{bmatrix}D_u&\Gamma_u^*\\
                 \Gamma_u&H_u\end{bmatrix},
 \qquad H_u\succ0.                                   \tag{3.1}
\]

This statement is sectorwise.  On a sector with no preliminary far
elimination, take `F={0}` and `mathsf E_u=I`; taking the even/odd direct sum
then gives the paired version used below.

The exact harmonic lift and retained Schur complement are

\[
 \mathsf E_uy=(y,-H_u^{-1}\Gamma_uy),
 \qquad
 \Sigma_u=\mathsf E_u^*\mathbb B_u\mathsf E_u.       \tag{3.2}
\]

Let `Pi_mv` be the orthogonal projector onto `mathcal D_mv` and define its
coordinate pullback

\[
 \boxed{
 \mathcal D_Y=\operatorname {Ran}(\mathsf E_u^*\Pi_{\rm mv})
 \subseteq Y.}                                       \tag{3.3}
\]

Then

\[
 \dim\mathcal D_Y\leq\dim\mathcal D_{\rm mv}.        \tag{3.4}
\]

Moreover, for `y perpendicular mathcal D_Y`, duality gives
`Pi_mv mathsf E_u y=0`.  Hence (2.5) and the identity component in
`mathsf E_u` give

\[
 \boxed{
 \langle y,\Sigma_uy\rangle
 =\langle\mathsf E_uy,\mathbb B_u\mathsf E_uy\rangle
 \geq\delta\|\mathsf E_uy\|^2
 \geq\delta\|y\|^2.}                                \tag{3.5}
\]

This elementary pullback is the exact point at which the actual physical
multiplier reaches the retained half-power Schur.  It uses neither a
structural Cauchy model nor a trace-to-sign inference.

## 4. Exact small Feshbach operator

Let

\[
 \mathcal C=K_0\oplus\mathbb Cb,
 \qquad
 \mathcal S_\lambda=\mathcal C+\mathcal D_Y,
 \qquad
 \mathcal F_\lambda=Y\ominus\mathcal S_\lambda.      \tag{4.1}
\]

Here `K_0` is the captured parity cap and `b` is the coherent bridge from
the frozen two-stage theorem.  Since `dim K_0=O(L)`, equations
(2.6), (3.4), and (4.1) prove (0.2).  On
`Y=mathcal S_lambda direct-sum mathcal F_lambda`, write

\[
 \Sigma_u=
 \begin{bmatrix}D_{\mathcal S}&\Gamma_{\mathcal S}^*\\
                 \Gamma_{\mathcal S}&H_{\mathcal F}
 \end{bmatrix}.                                      \tag{4.2}
\]

Equation (3.5) gives `H_(mathcal F)>=delta I`.  Therefore

\[
 \boxed{
 \Sigma_u\succeq0
 \quad\Longleftrightarrow\quad
 \mathfrak F_0:=D_{\mathcal S}
 -\Gamma_{\mathcal S}^*H_{\mathcal F}^{-1}
                         \Gamma_{\mathcal S}\succeq0.} \tag{4.3}
\]

This is the promised exact reduction from the `R-O(L)` retained problem to
dimension `O(L)+exp(O(lambda))`.  The feedback in (4.3) is retained
exactly; no norm bound or absolute-value replacement has oriented it.

For the positive metric subtraction, let

\[
 \Delta_Y=\mathsf E_u^*\Delta\mathsf E_u,
 \qquad
 C_{\Delta,\mathcal F}:=
 \sup_{0\ne y\in\mathcal F_\lambda}
 {\langle\mathsf E_uy,\Delta\mathsf E_uy\rangle
  \over\|\mathsf E_uy\|^2}.                         \tag{4.4}
\]

If

\[
 \boxed{\theta C_{\Delta,\mathcal F}<\delta,}        \tag{4.5}
\]

then the `mathcal F_lambda` compression of `T_theta` has floor
`delta-theta C_(Delta,mathcal F)>0`.  Writing its blocks as
`D_(theta,mathcal S)`, `Gamma_(theta,mathcal S)`, and
`H_(theta,mathcal F)`, exact Feshbach elimination gives

\[
 \boxed{
 T_\theta\succeq0
 \quad\Longleftrightarrow\quad
 \mathfrak F_\theta:=D_{\theta,\mathcal S}
 -\Gamma_{\theta,\mathcal S}^*
 H_{\theta,\mathcal F}^{-1}
 \Gamma_{\theta,\mathcal S}\succeq0.}              \tag{4.6}
\]

Condition (4.5) is automatic only at `theta=0`.  An estimate such as
`C_(Delta,mathcal F)<=||Delta||` is formally valid but is not known to
leave the desired positive angle below `delta`.  Consequently (4.6) is a
conditional positive-`theta` reduction, not a source-angle theorem.

## 5. The first short and constant bridge inverse leverage

Return to the frozen decomposition

\[
 T_\theta=
 \begin{bmatrix}
 A_\theta&r_\theta^*&X_\theta^*\\
 r_\theta&q_\theta&y_\theta^*\\
 X_\theta&y_\theta&R_\theta
 \end{bmatrix}
 \quad\hbox{on}\quad
 K_0\oplus\mathbb Cb\oplus\mathcal R_Q.             \tag{5.1}
\]

The finite theorem gives, in its admitted range,

\[
 A_\theta\succeq c_AL I,
 \qquad
 q_{1,\theta}:=q_\theta-r_\theta A_\theta^{-1}
 r_\theta^*\geq c_b=\Theta(1).                      \tag{5.2}
\]

Put

\[
 y_{1,\theta}=y_\theta-X_\theta A_\theta^{-1}r_\theta^*,
 \qquad
 R_{1,\theta}=R_\theta-X_\theta A_\theta^{-1}X_\theta^*.
                                                               \tag{5.3}
\]

After eliminating `A_theta`, the remaining block is

\[
 \begin{bmatrix}q_{1,\theta}&y_{1,\theta}^*\\
                 y_{1,\theta}&R_{1,\theta}
 \end{bmatrix}.                                      \tag{5.4}
\]

Thus (0.4) is the earliest unsupported positivity line.  If
`R_(1,theta)>0`, the exact reverse-order bridge criterion is

\[
 \boxed{
 T_\theta\succeq0
 \quad\Longleftrightarrow\quad
 q_{1,\theta}-y_{1,\theta}^*R_{1,\theta}^{-1}
 y_{1,\theta}\geq0.}                                 \tag{5.5}
\]

If `R_(1,theta)` is merely semidefinite, (5.5) becomes

\[
 R_{1,\theta}\succeq0,\qquad
 \operatorname {ran}y_{1,\theta}\subseteq
        \operatorname {ran}R_{1,\theta},\qquad
 y_{1,\theta}^*R_{1,\theta}^{\dagger}y_{1,\theta}
       \leq q_{1,\theta}.                            \tag{5.6}
\]

Because `q_(1,theta)` has a fixed positive floor, the correct bridge target
is an `O(1)` inverse response.  Neither `y_(1,theta)=o(1)` nor an
entrywise cross bound is necessary, and no frozen theorem proves (5.6).

Whenever (4.5) holds, the exact equivalences (4.6) and (5.5) show that the
large retained short and the small actual-multiplier Feshbach operator are
two coordinate descriptions of the same unresolved sign:

\[
 S_{\mathcal R,\theta}\succeq0
 \quad\Longleftrightarrow\quad T_\theta\succeq0
 \quad\Longleftrightarrow\quad\mathfrak F_\theta\succeq0. \tag{5.7}
\]

At `theta=0`, the last equivalence is unconditional.

## 6. Phase-sensitive target left on the small space

For `epsilon` equal to `+` or `-`, let `mathcal Y_epsilon` be the actual
multiplier-dangerous space, `H_epsilon>=delta I` its safe block, and

\[
 \mathsf E_{\epsilon,\sigma}y=
 \left(y,-(H_\epsilon+\sigma I)^{-1}\Gamma_\epsilon y\right).
                                                               \tag{6.1}
\]

With the source-defined metric `Delta_epsilon`, the exact constants from
the frozen multiplier notes are

\[
 \beta_{\lambda,\epsilon}^{\rm mv}
 =\inf_{\substack{\sigma\geq0\\0\ne y\in\mathcal Y_\epsilon}}
 \sup_{\substack{u\in\mathcal Y_\epsilon\\\|u\|=1}}
 { |\mathfrak B_{\epsilon,\sigma}(u,y)|
  \over\|\Delta_\epsilon\mathsf E_{\epsilon,\sigma}y\|},
 \qquad
 \beta_{\lambda,{\rm pair}}^{\rm mv}
 =\min\{\beta_{\lambda,+}^{\rm mv},
         \beta_{\lambda,-}^{\rm mv}\}.              \tag{6.2}
\]

Here the complete signed arithmetic numerator is

\[
\boxed{
\begin{aligned}
 \mathfrak B_{\epsilon,\sigma}(u,y)
 ={}&(c_*+\sigma-U)\langle u,y\rangle
 +\mathfrak a_{\rm tail}
       (u,\mathsf E_{\epsilon,\sigma}y)\\
 &+\int_0^L D_\lambda(t){d\over dt}
 C_{u,\mathsf E_{\epsilon,\sigma}y}(t)\,dt,
\end{aligned}}                                       \tag{6.3}
\]

where

\[
 D_\lambda(t)=
 \sum_{1<n\leq e^t}{\Lambda(n)\over\sqrt n}
       -2(e^{t/2}-1).                                 \tag{6.4}
\]

The discrepancy integral in (6.3) has a plus sign after Stieltjes
integration by parts.  The prime-power endpoint `n=lambda^2` remains
inclusive.

At each fixed finite parameter,

\[
 \beta_{\lambda,+}^{\rm mv}>0
 \quad\Longleftrightarrow\quad B_+\succ0,
 \qquad
 \beta_{\lambda,-}^{\rm mv}>0
 \quad\Longleftrightarrow\quad B_-\succ0.            \tag{6.5}
\]

The strongest currently isolated common-schedule target is

\[
 \boxed{
 \beta_{\lambda,+}^{\rm mv}
 \gg{1\over\sqrt\lambda\operatorname {polylog}(\lambda)},
 \qquad
 \beta_{\lambda,-}^{\rm mv}>0.}                     \tag{6.6}
\]

Equation (6.6), or a direct lower bound for the equivalent small Feshbach
operator in (4.3), is the viable phase-sensitive next lemma.  It is not
proved here.

## 7. Why known size inputs stop short

The available inputs fail for distinct exact reasons.

* The absolute phase-volume bound gives only (2.7).  A polynomial rank
  would require a new estimate such as

  \[
   \Phi_\lambda(U,g)\ll{\lambda^2\over\log\lambda},  \tag{7.1}
  \]

  which the frozen phase-volume audit leaves open.

* The compressed multiplier trace gives `O(lambda^2)` dangerous rank on
  its polynomial cutoff `N_pol asymp lambda^2`.  At the locked half-power
  cutoff `N_pol=R`, its square-root trace term is `O(RL)`, hence its rank
  allowance is `O(R)`.

* A negative-index or rank bound says where a failure may live, not how the
  signed prime discrepancy orients the Feshbach feedback.  PNT magnitude,
  fixed moments, and infinite-time Haar information do not prove (6.6).

* Setting the signed discrepancy to zero preserves every magnitude upper
  bound used in these routes, yet the frozen continuous comparison has
  arbitrarily large negative finite compressions.  Therefore a
  magnitude-only argument cannot replace (6.3).

The actual multiplier has nevertheless achieved a genuine reduction:
the remaining obstruction is no longer an arbitrary `R`-dimensional
matrix.  It is a source-defined Feshbach/inf--sup problem of dimension at
most `O(L)+exp(O(lambda))`, with the exact signed discrepancy still present.

## 8. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_mixed_bridge_actual_multiplier_dangerous_feshbach_reduction -v

The regression checks every frozen hash, the dangerous-projector harmonic
pullback, exact Feshbach inertia, the positive-`theta` metric condition, the
two-stage inverse-leverage scale, phase-volume cost arithmetic, fail-closed
scope, displayed TeX, and ASCII hygiene.
