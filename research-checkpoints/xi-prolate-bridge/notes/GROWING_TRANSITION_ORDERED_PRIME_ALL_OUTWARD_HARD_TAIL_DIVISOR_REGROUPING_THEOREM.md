# Growing-transition ordered-prime all-outward hard-tail divisor-regrouping theorem

## 0. Result and exact scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A .       \tag{0.1}
\]

Use the fixed realized two-cluster packet, its exact exterior-defect
whitening, and the seven-row space `E` of the frozen forced-prime theorem.
Put

\[
 I=[\lambda^{-1},\lambda],\qquad
 (T_kx)(u)=H_x(ku),\quad u\in I.                    \tag{0.2}
\]

At finite Fejer cutoff `F` and auxiliary prime cutoff `R`, restrict the
exact ordered upper prime form to

\[
 m>A,\qquad n>A,\qquad n\leq R,\qquad l\geq1.       \tag{0.3}
\]

Define

\[
 \begin{aligned}
 S_{A,F}&=\sum_{m>A}\omega_F(m)T_m,\\
 p_{A,F,R}(k)
  &=\sum_{\substack{n\mid k\\A<n\leq R}}
       \Lambda(n)\omega_F(k/n),\\
 P_{A,F,R}&=\sum_{k>A}p_{A,F,R}(k)T_k.
 \end{aligned}                                      \tag{0.4}
\]

Then the finite-cutoff direct and Hermitian hard blocks are exactly

\[
 \boxed{
 Q^\uparrow_{>>,F,R}={1\over2}S_{A,F}^*P_{A,F,R},
 \qquad
 Q^{\rm raw}_{>>,F,R}
 ={1\over4}\{S_{A,F}^*P_{A,F,R}
                  +P_{A,F,R}^*S_{A,F}\}.}           \tag{0.5}
\]

The right coefficient in (0.4) contains the outward weight
`omega_F(k/n)` and does not contain a spurious `omega_F(k)`.  The latter
appears only when the left index is resonant with `k`.

Take `R to infinity` first and then the ordered limit `F to infinity`,
both at fixed `lambda`.  The limiting maps are

\[
 S_A=\sum_{m>A}T_m,
 \qquad
 P_A=\sum_{k>A}\mathcal P_A(k)T_k,
 \qquad
 \mathcal P_A(k)=\sum_{\substack{n\mid k\\n>A}}\Lambda(n). \tag{0.6}
\]

The elementary divisor identity gives

\[
 \boxed{
 0\leq\mathcal P_A(k)
 \leq\sum_{d\mid k}\Lambda(d)=\log k.}             \tag{0.7}
\]

No sum over the outward sampler remains in (0.6).  All `l>=1` rows have
been collected into the exact coefficient `mathcal P_A(k)`.

Let `K_0` be the fixed exponent in the frozen near-band fold large sieve.
The near- and far-band estimates give

\[
 \begin{aligned}
 \|S_A\|&\leq C_m\{A^{1/4}L^{K_0/2}+1\},\\
 \|P_A\|&\leq C_m\{A^{1/4}L^{(K_0+1)/2}+L\}.
 \end{aligned}                                      \tag{0.8}
\]

Consequently the ordered raw hard block satisfies

\[
 \boxed{
 \|P_EQ^{\rm raw}_{>>}P_E\|
 \leq C_m A^{1/2}L^{K_0+1/2}
 =c^{1/2+o(1)}.}                                    \tag{0.9}
\]

For the forced packet put

\[
 T_L={A^\sigma\over L^{2m}},\qquad {1\over2}<\sigma<1. \tag{0.10}
\]

The strict lower inequality in (0.10) is binding, and (0.9) yields

\[
 \boxed{\|P_EQ^{\rm raw}_{>>}P_E\|=o(T_L).}         \tag{0.11}
\]

The ordered resonance inside the hard block is not discarded.  It is

\[
 \boxed{
 Q_{{\rm res},>>}
 ={1\over2}\sum_{k>A}\mathcal P_A(k)T_k^*T_k
 \succeq0.}                                         \tag{0.12}
\]

It is a positive coordinate subblock of the frozen complete ordered
resonance, so

\[
 \|P_EQ_{{\rm res},>>}P_E\|=O_m(L^2)=o(T_L).        \tag{0.13}
\]

Therefore the exact nonresonant hard block

\[
 Q_{{\rm off},>>}=Q^{\rm raw}_{>>}-Q_{{\rm res},>>} \tag{0.14}
\]

obeys

\[
 \boxed{\|P_EQ_{{\rm off},>>}P_E\|=o(T_L).}         \tag{0.15}
\]

Thus the rows with both `m>A` and `n>A`, after summing every outward
sampler `l>=1`, cannot carry the forced scale.  This note does not assert
a Loewner sign for the complementary union `m<=A or n<=A`, does not assign
the compensation to either edge channel, and does not produce a sign for
an individual `l`.

At `sigma=1/2`, (0.9) is only `A^(1/2)poly(L)`, whereas
`T_L=A^(1/2)/L^(2m)`.  The argument therefore fails closed at the endpoint;
it supplies no `o(T_L)` estimate there.  The theorem proves no complete
central sign, determinant conclusion, or RH statement.  The project state
remains `P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_ORDERED_PRIME_HARD_TAIL_PNT_GRAM_REDUCTION.md` | `b8439dcfa6f969fd84dae8fafb5474c3e176ba14d84c7d73140fabeac042a4be` |
| `tests/test_growing_transition_ordered_prime_hard_tail_pnt_gram_reduction.py` | `1101aebef550259387eb6220cf8b2740d728c2f52ddf6349b253d6a555248cb6` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_FAR_ANNULUS_DILATION_LARGE_SIEVE_THEOREM.md` | `c09ae35ef96a9d897446221354199e6a945c7e4b6d118a4b934b223452e137cc` |
| `tests/test_growing_transition_ordered_prime_far_annulus_dilation_large_sieve_theorem.py` | `1b09dd1eac6356e5a9faecbee8b400911d28577e473ee3583cfb1df349587f1b` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_NEAR_BAND_FOLD_LARGE_SIEVE_THEOREM.md` | `93a42acf8f33a2706e67ca53a929755d021c291a0dd3907099eb3176524e2675` |
| `tests/test_growing_transition_ordered_prime_near_band_fold_large_sieve_theorem.py` | `4d1075a2b61ef9d1cb510b2e21ac0225b94f702829b426014b8581c5ee6a72e6` |
| `notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md` | `787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79` |
| `tests/test_growing_transition_forced_ordered_nonresonant_prime_frame_theorem.py` | `73913c60eb3862668631a0f846be2d40c82978c62248c9084c173d76913a44b7` |

No prime-number theorem, short-interval estimate, external FIO theorem,
zero list, or numerical prolate datum is added.

## 2. Exact finite-cutoff divisor grouping

For `n>A`, the lower endpoint in the direct source formula is exactly

\[
 u_n=\max\{\lambda/n,\lambda^{-1}\}=\lambda^{-1}.   \tag{2.1}
\]

For `m>A` and `u in I`, one has `mu>lambda`.  The compact source sample
therefore vanishes and the inward row is `T_m`.  Every triple in (0.3)
has the same target Hilbert space `L^2(I,du)`.  The exact finite direct
form is consequently

\[
 Q^\uparrow_{>>,F,R}
 ={1\over2}\sum_{\substack{m>A,\ A<n\leq R\\l\geq1}}
 \omega_F(m)\Lambda(n)\omega_F(l)T_m^*T_{ln}.       \tag{2.2}
\]

Both sampler sums are finite at fixed `F`, while the prime sum is finite
at fixed `R`.  Put `k=ln` only in the right slot.  Collecting identical
right rows gives

\[
 \begin{aligned}
 \sum_{\substack{A<n\leq R\\l\geq1}}
   \Lambda(n)\omega_F(l)T_{ln}
 &=\sum_{k>A}
   \left\{\sum_{\substack{n\mid k\\A<n\leq R}}
       \Lambda(n)\omega_F(k/n)\right\}T_k\\
 &=P_{A,F,R}.
 \end{aligned}                                      \tag{2.3}
\]

This proves the direct identity in (0.5).  Hermitian averaging means
`(Q^up+(Q^up)^*)/2`, which proves the factor `1/4` in the second identity.
There is no unnormalized adjoint and no additional midpoint row.

This is not the prohibited scalar regrouping by a product `mln`.  The
inward index `m`, the right index `k=ln`, the two source slots, and the
finite-cutoff weights are all retained.  It is simply the collection of
identical operators in a finite sum on the common interval (2.1).

For every fixed `k`, positivity of the Fejer weights gives

\[
 0\leq p_{A,F,R}(k)
 \leq\sum_{\substack{n\mid k\\n>A}}\Lambda(n)
 \leq\sum_{d\mid k}\Lambda(d)=\log k,              \tag{2.4}
\]

proving (0.7) in the limit.

## 3. Ordered limits and reciprocal-gauge compatibility

At each fixed `lambda`, endpoint-null `W^(2,1)` regularity gives, uniformly
on the unit sphere of the finite-dimensional white space `E`,

\[
 |H_x(t)|\leq C_{\lambda,E}(1+t)^{-2}.               \tag{3.1}
\]

Changing variables or integrating (3.1) directly on `I` gives

\[
 \|T_kP_E\|\leq C_{\lambda,E}k^{-2},\qquad k>A.     \tag{3.2}
\]

Hence

\[
 \sum_{k>A}(1+\log k)\|T_kP_E\|<\infty,
 \qquad
 \sum_{k>A}(\log k)\|T_kP_E\|^2<\infty.           \tag{3.3}
\]

Equations (2.4) and (3.3) justify operator-norm dominated convergence.
At fixed `F`, send `R to infinity`; then send `F to infinity` in the
prescribed ordered sense.  Since `omega_F(j) to 1` for each fixed integer
`j`, one obtains (0.6), (0.12), and

\[
 Q^{\rm raw}_{>>}
 ={1\over4}\{S_A^*P_A+P_A^*S_A\}.                  \tag{3.4}
\]

Only after these fixed-`lambda` limits are identified is `lambda` allowed
to grow along (0.1).

The reciprocal gauge from the forced-prime theorem is

\[
 s_{m,l,n}={m\over ln}={m\over k},\qquad
 T_m\mapsto s_{m,l,n}T_m,qquad
 T_k\mapsto s_{m,l,n}^{-1}T_k.                      \tag{3.5}
\]

It preserves each cross exactly.  Thus the coordinate block in (2.2) is
the same coordinate block used by the frozen positive Hilbert domination.
The gauged rows themselves are not divisor-regrouped: their scalars depend
on both `m` and `k`.  The divisor grouping is only the exact ungauged
finite-form identity (2.3).

## 4. Transition and far coefficient bounds

Let

\[
 \mathcal W=(A,2A)\cap\mathbb Z.                    \tag{4.1}
\]

If `k` lies in `mathcal W` and `n>A` divides `k`, then `k=ln<2A` forces `l=1`
and `n=k`.  Therefore

\[
 \boxed{\mathcal P_A(k)=\Lambda(k),\qquad k\in\mathcal W.} \tag{4.2}
\]

The frozen near-band theorem states that, for arbitrary complex
coefficients,

\[
 \left\|\sum_{k\in\mathcal W}a_kT_k\right\|^2
 \leq {C_mL^{K_0}\over\sqrt A}
            \sum_{k\in\mathcal W}|a_k|^2.           \tag{4.3}
\]

Since `mathcal W` has at most `A+1` members, (4.3) with `a_k=1` gives

\[
 \|S_A^{\rm tr}\|^2\leq C_mL^{K_0}\sqrt A.        \tag{4.4}
\]

The elementary Chebyshev bound gives

\[
 \sum_{k\in\mathcal W}\Lambda(k)^2
 \leq\log(2A)\psi(2A)\leq C A L.                  \tag{4.5}
\]

Equations (4.2), (4.3), and (4.5) therefore give

\[
 \|P_A^{\rm tr}\|^2\leq C_mL^{K_0+1}\sqrt A.      \tag{4.6}
\]

These estimates are uniform at finite cutoffs: `|omega_F(k)|<=1`, and on
the transition interval

\[
 p_{A,F,R}(k)=\omega_F(1)\Lambda(k)
                  \mathbf1_{k\leq R}.               \tag{4.7}
\]

For the far range use

\[
 X_j=2^{j+1}A,\qquad
 \mathcal W_j=(X_j,2X_j]\cap\mathbb Z,qquad j\geq0. \tag{4.8}
\]

The frozen far-annulus large sieve and (0.7) give

\[
 \begin{aligned}
 \left\|\sum_{k\in\mathcal W_j}\mathcal P_A(k)T_k\right\|^2
 &\leq {C_mA\log(2X_j)\over LX_j^2}
       \sum_{k\in\mathcal W_j}\mathcal P_A(k)^2\\
 &\leq {C_mA\log^3(2X_j)\over LX_j}.
 \end{aligned}                                      \tag{4.9}
\]

Thus

\[
 \begin{aligned}
 \|P_A^{\rm far}\|
 &\leq C_m\sum_{j\geq0}
   2^{-j/2}{(L+j+1)^{3/2}\over\sqrt L}
 \leq C_mL,\\
 \|S_A^{\rm far}\|
 &\leq C_m\sum_{j\geq0}
       2^{-j/2}\sqrt{1+{j+1\over L}}
 \leq C_m.
 \end{aligned}                                      \tag{4.10}
\]

The same estimates hold uniformly for `p_(A,F,R)(k)` because of (2.4).
Combining (4.4), (4.6), and (4.10) proves (0.8).

## 5. Raw block, resonance subtraction, and scale

From (3.4) and (0.8),

\[
 \begin{aligned}
 \|P_EQ^{\rm raw}_{>>}P_E\|
 &\leq {1\over2}\|S_AP_E\|\,\|P_AP_E\|\\
 &\leq C_m\{A^{1/4}L^{K_0/2}+1\}
       \{A^{1/4}L^{(K_0+1)/2}+L\}\\
 &\leq C_mA^{1/2}L^{K_0+1/2}.
 \end{aligned}                                      \tag{5.1}
\]

For fixed `K_0` and `m`,

\[
 {A^{1/2}L^{K_0+1/2}\over T_L}
 =A^{1/2-\sigma}L^{K_0+1/2+2m}\longrightarrow0
 \quad\text{exactly when }\sigma>{1\over2}.        \tag{5.2}
\]

This proves (0.11) and records the endpoint obstruction.

At finite cutoffs, resonance means `m=ln=k`.  Its exact coefficient is

\[
 Q_{{\rm res},>>,F,R}
 ={1\over2}\sum_{k>A}
   \omega_F(k)p_{A,F,R}(k)T_k^*T_k.                 \tag{5.3}
\]

Thus (3.3) gives (0.12) in the ordered limit.  Every summand in (5.3) is
positive and occurs in the complete resonance of the frozen forced-prime
theorem.  Coordinate deletion therefore gives

\[
 0\preceq Q_{{\rm res},>>,F,R}\preceq Q_{{\rm res},F},
 \qquad
 \sup_F\|P_EQ_{{\rm res},F}P_E\|=O_m(L^2).         \tag{5.4}
\]

Taking the prescribed limits proves (0.13).  Removing exactly (5.3) from
the raw hard block leaves precisely the triples with

\[
 m>A,\qquad n>A,\qquad l\geq1,\qquad ln\ne m.       \tag{5.5}
\]

Hence (0.14) is the actual ordered nonresonant coordinate block, not a
renamed raw direct form.  The triangle inequality with (0.11) and (0.13)
proves (0.15).

## 6. Claim boundary

The all-outward sum is controlled because its exact divisor coefficient
is at most `log k`; no estimate is obtained by summing separate fixed-`l`
bounds.  The result uses no PNT discrepancy estimate and gives no sign to
the raw or off-resonant hard block.

The theorem excludes the simultaneous hard-hard channel `m>A,n>A` from
carrying the forced `T_L` scale for `sigma>1/2`.  It deliberately makes no
edge-union Loewner claim and no assertion that either `m<=A` or `n<=A`
separately supplies a positive direction.  Such a statement would require
its own exact ordered edge partition and claim audit.

At `sigma=1/2`, the available fold frame and the Cauchy product in (5.1)
are insufficient by a fixed power of `L`.  No endpoint result is inferred.
There is no complete central sign, determinant convergence, or RH theorem.
