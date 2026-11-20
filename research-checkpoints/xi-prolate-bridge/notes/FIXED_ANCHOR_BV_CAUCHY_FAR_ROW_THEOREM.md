# Fixed-anchor BV/Cauchy far-row theorem

## 0. Exact result and scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 L=2\log\lambda,\qquad N=2^{9600\lambda^2},\qquad
 R=\sqrt N.                                           \tag{0.1}
\]

Let `p_4` be the actual compact-projected zero-integral label-4
arithmetic vector and let

\[
 \kappa={p_4\over\|p_4\|}.                            \tag{0.2}
\]

In the even source Fourier block write

\[
 Q_+=\begin{pmatrix}q&b^*\\b&A\end{pmatrix}
 \quad\hbox{on}\quad
 \mathbb C\kappa\oplus{\cal K},\qquad
 {\cal K}=H_+\cap\kappa^\perp.                       \tag{0.3}
\]

For every half-power far space used in the frozen reduction,

\[
 F\subset{\cal K}\cap\operatorname {ran}P_{>R}^+,   \tag{0.4}
\]

the separate anchor residual row satisfies

\[
 \boxed{
 \|b_F\|:=\|P_Fb\|
 \leq \|P_{>R}^+Q_+\kappa\|
 \leq {P_*(\lambda,L)\over\sqrt R},}                 \tag{0.5}
\]

where `P_*` is one fixed polynomial expression in `lambda` and `L`.
Consequently the pinned defect asymptotic gives

\[
 \boxed{
 \|b_F\|=o\!\left(\lambda\sqrt{d_4L}\right).}       \tag{0.6}
\]

When the frozen far floor

\[
 H_u\succeq G_RI_F,\qquad
 G_R=4800(\log2)\lambda^2+o(\lambda^2)               \tag{0.7}
\]

is invoked, (0.6) yields the conditional inverse-energy estimate

\[
 \boxed{
 \langle b_F,H_u^{-1}b_F\rangle=o(d_4L).}             \tag{0.8}
\]

Equation (0.5) itself is unconditional and does not assume the unproved
strict even lower-Ritz branch.  Equation (0.8) is only the far-block cost
under the stated positive far floor; it is not a full inverse-row theorem.

The proof does not put the anchor into the endpoint-null growing prefix.
Instead it uses two fixed-packet facts: the actual anchor profile has a
polynomial bounded-variation norm, hence Fourier coefficients `O(1/n)`
with a polynomial constant; and the complete Weil matrix has its exact
diagonal-plus-Cauchy form.  The Cauchy denominators preserve that decay in
the far output and produce the factor `R^(-1/2)`.

There is also an exact audit of the proposed endpoint shear.  If `s_8` is
the source whose compact image is the anchor-deflated singleton `W_8`, then

\[
 g_4=c_4-\theta s_8,\qquad
 \theta={\eta(c_4)\over\eta(s_8)}=O(\lambda^{-4})      \tag{0.9}
\]

is zero-integral and endpoint-null, and

\[
 p_4=Tg_4+\theta W_8.                                 \tag{0.10}
\]

This identity is valid eventually, when the frozen nonvanishing of the
label-8 endpoint applies.  It does not by itself close the row.  The
endpoint-null derivative and endpoint lemmas in the frozen far-cross proof
apply to the fixed source `g_4`, but its displayed operator theorem is
stated only on the actual `C_Q^#` range and does not cover the retained
non-endpoint-null singleton `W_8`.  The same fixed-packet BV/Cauchy proof
used for (0.5) controls `W_8`, so (0.9)--(0.10) become a valid alternative
proof.  Directly applying that proof to `p_4` is shorter.

Thus non-endpoint-null derivative atoms are a real blocker for the coarse
`||M v||/R` implementation of parity displacement, but not for the actual
fixed-anchor far row.  In exact Fourier coordinates they create `1/n`
tails, and the complete Cauchy form makes those tails super-exponentially
small at the locked half-power split.

This theorem closes only `b_F=P_Fb`.  It does not control the retained row
`b_R`, the retained Schur complement, the growing full-metric Toeplitz dual
row, either complete strict sector sign, equation (5.2) of
`DIRECT_RH_ATTACK.md`, a determinant limit, a zero statement, or RH.  The
formal state remains `P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

Only the following repository bytes are used.

| Dependency | SHA-256 |
|---|---|
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `tests/test_fixed_even_prefix_arithmetic_synthesis_theorem.py` | `6e89f2f1af22260e5796eb67221fccd86d2668556e9cb23dd903ea283d5f069f` |
| `notes/GROWING_LOW_PREFIX_HALF_POWER_FAR_CROSS_THEOREM.md` | `c0428b5c0ab43719b8e82b24ff21f7c40ebfde978ddb8d4185f92abb633ab55f` |
| `tests/test_growing_low_prefix_half_power_far_cross_theorem.py` | `be358852f5f5749e25aca722a18cfb081b8c36bab7aeed74343b624d49ef0569` |
| `notes/HIGH_FOURIER_COERCIVITY.md` | `5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821` |
| `tests/test_high_fourier_coercivity.py` | `64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae` |
| `notes/PROLATE_TAIL_ENVELOPE.md` | `309337a98721d0e0cffb40391a227ad29fbc0de315c6f532109c9376370ed59d` |
| `tests/test_prolate_tail_envelope.py` | `bb5b5ec58f6357a8defcf36b19d3a1674091518903c5438f56c17ae6eef0581e` |
| `notes/STRUCTURED_FULL_BLOCK_EXTERIOR_METRIC_QUOTIENT_BRIDGE_THEOREM.md` | `ad11c56795dd721f09b4bdfce286c69ba8825867ccf03e3a127e27957f93aa86` |
| `tests/test_structured_full_block_exterior_metric_quotient_bridge_theorem.py` | `bd772ad22906038480061226b9271ecfb76b3b5099065e6ae7b958d2d423095d` |
| `notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md` | `c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b` |
| `tests/test_fixed_even_endpoint_null_volterra_pnt_correlation_barrier.py` | `195f71b516553b18bccd0ed9b873191abf463b6f72c79f2c4418f041f3f1bd73` |

The fixed-prefix theorem fixes the exact zero-integral label-4 source,
the compact state, and its nonzero limiting norm.  The half-power theorem
fixes the physical schedule, far space, arithmetic derivative bound, and
far floor.  The high-coercivity theorem fixes the complete Cauchy form and
its explicit coefficient bounds.  The tail envelope bounds the prolate
endpoint.  The final two inputs fix the retained label-8 endpoint shear and
the defect-relative endpoint asymptotics used in (0.9).

## 2. Polynomial BV norm of the actual anchor profile

Write the exact finite zero-integral source as

\[
 c_4=q_{4,\lambda}=h_{4,\lambda}+\rho_4h_{0,\lambda},
 \qquad \int c_4=0.                                    \tag{2.1}
\]

The fixed-label expansion makes `rho_4` bounded.  Put

\[
 g_f(t)=e^{t/2}\sum_{m\leq\lambda e^{-t}}f(me^t),
 \qquad
 K_f(t)={g_f(t)+g_f(-t)\over2},
 \qquad -L/2\leq t\leq L/2.                           \tag{2.2}
\]

The actual compact anchor is

\[
 p_4=P_NK_{c_4}.                                      \tag{2.3}
\]

Away from the arithmetic thresholds

\[
 t_m=\log(\lambda/m),\qquad1\leq m\leq\lfloor\lambda^2\rfloor,
                                                               \tag{2.4}
\]

ordinary differentiation gives

\[
 g_f'(t)=(A_\lambda{\cal L}f)(e^t),
 \qquad {\cal L}={1\over2}+x{d\over dx}.            \tag{2.5}
\]

At `t_m` the value jump has magnitude

\[
 |j_m|=\sqrt{\lambda/m}\,|f(\lambda)|.               \tag{2.6}
\]

The exact arithmetic-map norm, Cauchy--Schwarz on the interval of length
`L`, and the frozen fixed-mode derivative estimate give

\[
 \int_{-L/2}^{L/2}|g_{c_4}'(t)|\,dt
 \leq\sqrt L\,{\lambda\over\sqrt2}
                 \|{\cal L}c_4\|_2
 \leq C\lambda c^3\sqrt L,\qquad c=2\pi\lambda^2.    \tag{2.7}
\]

The endpoint envelope and `d_0,d_4<=1` give

\[
 |c_4(\lambda)|
 \leq16\pi\sqrt\lambda
       \{\sqrt{d_4}+|\rho_4|\sqrt{d_0}\}
 \leq C\sqrt\lambda.                                 \tag{2.8}
\]

Since

\[
 \sum_{m\leq\lambda^2}m^{-1/2}\leq2\lambda,
\]

the complete jump variation is at most `C lambda^2`.  Reflection and
averaging do not increase variation.  Therefore

\[
 \boxed{
 \operatorname {Var}_{\mathbb R/L\mathbb Z}(K_{c_4})
 \leq C\{\lambda c^3\sqrt L+\lambda^2\}.}            \tag{2.9}
\]

Evenization makes the two periodic endpoint traces agree.  Thus (2.9)
includes every interior threshold atom and needs no endpoint-null
assumption.

Let `k_n` be the normalized Fourier coefficients of `K_(c_4)`.  Periodic
Stieltjes integration by parts gives, for `n!=0`,

\[
 |k_n|\leq {\sqrt L\over2\pi|n|}
       \operatorname {Var}(K_{c_4}).                  \tag{2.10}
\]

The arithmetic-map norm also bounds `|k_0|` polynomially.  Finally, the
fixed-prefix theorem gives

\[
 \|p_4\|\longrightarrow A_4>0.                       \tag{2.11}
\]

After increasing the locked threshold, the Fourier coefficients `x_n` of
the normalized anchor `kappa` therefore obey

\[
 \boxed{
 |x_n|\leq{C_{\rm anc}(\lambda,L)\over1+|n|},
 \qquad |n|\leq N,}                                   \tag{2.12}
\]

with one fixed polynomial `C_anc`.  This is the only regularity estimate
needed below.

## 3. The Cauchy matrix preserves the fixed-packet tail

In the complete source Fourier basis the Weil matrix is exactly

\[
 Q=D_a+D_bH-HD_b,                                    \tag{3.1}
\]

\[
 H_{nm}=\begin{cases}(n-m)^{-1},&n\ne m,\\0,&n=m,
          \end{cases}                                 \tag{3.2}
\]

and its frozen coefficient bounds are

\[
 |a_n|\leq\log(|n|+2)+C_{|a|}(\lambda),
 \qquad |b_n|\leq B_b(\lambda).                      \tag{3.3}
\]

For `2<=|n|<=N`, split the sum at `|m|=|n|/2`.  On the
first part `|n-m|` is comparable to `|n|`; on the second part
`1+|m|` is comparable to `|n|`.  The two harmonic sums give the elementary
bound

\[
 \boxed{
 \sum_{\substack{|m|\leq N\\m\ne n}}
 {1\over(1+|m|)|n-m|}
 \leq {C_H\log(N+2)\over1+|n|}.}                     \tag{3.4}
\]

Apply (3.4) first to `x` and then to `D_bx`.  Equations
(2.12) and (3.1)--(3.4) imply

\[
 |(Q\kappa)_n|
 \leq {P_*(\lambda,L)\over1+|n|},\qquad |n|>R,       \tag{3.5}
\]

where one may take

\[
 P_*=C C_{\rm anc}
 \left\{\log(N+2)+C_{|a|}(\lambda)
       +B_b(\lambda)\log(N+2)\right\}.               \tag{3.6}
\]

Here `log N=9600(log 2)lambda^2`, and every other displayed factor is
an explicit elementary polynomial or polylogarithmic quantity.  Hence
`P_*` has the claimed fixed polynomial scale.

Summing (3.5) gives

\[
 \|P_{>R}Q\kappa\|^2
 \leq2P_*^2\sum_{n>R}{1\over n^2}
 \leq {2P_*^2\over R}.                               \tag{3.7}
\]

Since `kappa` is even and `F` lies in the even far range, (3.7) proves
(0.5).  Moreover

\[
 R^{-1/2}=N^{-1/4}=2^{-2400\lambda^2}.                \tag{3.8}
\]

The fixed label-4 defect has

\[
 d_4\sim A_4'\lambda^9e^{-4\pi\lambda^2}.            \tag{3.9}
\]

Because

\[
 2400\log2-2\pi>0,                                   \tag{3.10}
\]

every fixed polynomial is absorbed by the exponential margin between
(3.8) and `sqrt(d_4)`.  This proves (0.6), and (0.7) then proves (0.8).

## 4. Exact endpoint-nullization audit

Let `c_8` be the raw zero-integral label-8 source and let

\[
 s_8=c_8-\alpha_8c_4,
 \qquad Ts_8=W_8.                                     \tag{4.1}
\]

In pure labels this is

\[
 s_8=h_8-\alpha_8h_4+b_8h_0,
 \qquad b_8=\rho_8-\rho_4\alpha_8.                   \tag{4.2}
\]

Put `eta(f)=f(lambda)`.  The fixed endpoint theorem gives

\[
 {\eta(c_4)^2\over D_4}\sim2\pi\lambda,
 \qquad
 {\eta(s_8)^2\over D_8}\sim2\pi\lambda,             \tag{4.3}
\]

while `D_4~d_4`, `D_8~d_8`, and

\[
 {d_4\over d_8}=\Theta(\lambda^{-8}).                 \tag{4.4}
\]

Thus `eta(s_8)` is nonzero eventually and

\[
 \theta={\eta(c_4)\over\eta(s_8)}=O(\lambda^{-4}).   \tag{4.5}
\]

The source

\[
 g_4=c_4-\theta s_8                                  \tag{4.6}
\]

has zero integral and zero endpoint, and linearity gives the exact
physical identity (0.10).

The use of the deflated source `s_8` is essential for that identity.  If
one instead endpoint-nullizes with the raw `c_8`, putting

\[
 \zeta={\eta(c_4)\over\eta(c_8)},\qquad
 g_4^{\rm raw}=c_4-\zeta c_8,                         \tag{4.7}
\]

then `p_8=W_8+alpha_8 p_4` gives

\[
 \boxed{
 (1-\zeta\alpha_8)p_4=Tg_4^{\rm raw}+\zeta W_8.}     \tag{4.8}
\]

Dropping the factor on the left would be an exact algebraic error.

The frozen endpoint shear retains `W_8` as the singleton with nonzero
endpoint and makes only the rest columns endpoint-null.  Therefore the
existing endpoint-null half-power theorem cannot be cited for `W_8`.
Nevertheless `s_8` is another fixed modal packet with bounded coefficients,
`W_8` has a nonzero limiting norm, and Sections 2--3 apply verbatim to it.
This supplies the missing estimate in (0.10).

## 5. Why the derivative atoms are not silently discarded

For an endpoint-null source, the threshold jumps (2.6) vanish and the
frozen parity-displacement proof controls `||M v||` in ordinary `L^2`.
For `c_4` or `s_8`, they do not vanish.  Truncating a derivative atom at
Fourier cutoff `N` can cost a factor of order `sqrt(N)` in the unweighted
derivative norm.  The coarse estimate

\[
 {\|Q_-\|\over R}\|M v\|                              \tag{5.1}
\]

therefore does not retain the `R^(-1/2)` tail gain and is not a licensed
extension of the endpoint-null theorem.

Sections 2--3 keep the atoms instead.  Bounded variation turns them into
the exact Fourier decay `1/n`; the diagonal logarithm and both Cauchy
orientations preserve that decay up to harmonic logarithms.  Summation
only after restricting to `|n|>R` produces (3.7).  Thus the atoms are not
declared zero or estimated termwise at defect-white scale.

## 6. Strict stopping line

The anchor-to-far row is no longer a missing gate:

\[
 b_F=P_Fb=o\!\left(\lambda\sqrt{d_4L}\right).         \tag{6.1}
\]

The retained component

\[
 b_R=P_{R_Q}b,
 \qquad R_Q=Y\ominus{\cal K}_Q,                      \tag{6.2}
\]

does not lie in a high Fourier tail and receives no estimate from (3.7).
Nor does (3.7) enlarge the endpoint-null low-prefix range or bound the
retained Schur inverse.  The earliest remaining inverse-row gate is still
the retained energy

\[
 e_Q^*S_Q^{-1}e_Q=O(d_4L),                            \tag{6.3}
\]

or a stronger residual-containing full-metric theorem.

## 7. Reproduction

Run

    python3 -B -m unittest \
      tests.test_fixed_anchor_bv_cauchy_far_row_theorem -v

The regression checks every frozen hash, bounded-variation Fourier decay,
the discrete Cauchy convolution lemma, the exact deflated/raw endpoint
shear identities, the locked exponential margin, displayed TeX, ASCII
hygiene, and the fail-closed scope.
