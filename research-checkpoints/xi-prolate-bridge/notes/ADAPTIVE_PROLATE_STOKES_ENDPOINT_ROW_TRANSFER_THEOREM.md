# Adaptive prolate Stokes endpoint and row transfer theorem

## 0. Exact outcome and claim boundary

Assume RH and use the cofinal adaptive ordinates selected in
`ADAPTIVE_GONEK_ENDPOINT_FILTER_SELECTION_THEOREM.md`.  Write

\[
 a={L\over2},\qquad h={2\pi\over L},\qquad t_k=kh,
 \qquad m=N+1,\qquad T=t_m,\qquad c=2\pi\lambda^2,
 \qquad U={c^{3/4}\over2}.                              \tag{0.1}
\]

This note closes the two analytic remainders left after the subturning
Newton factorization.

First, if `F_lambda` is the full even logarithmic arithmetic state,

\[
 X=1_{[-a,a]}F_\lambda,\qquad O=F_\lambda-X,
 \qquad b_k=\widehat O(t_k),                            \tag{0.2}
\]

with midpoint values at `+/-a`, then the two adjacent endpoint errors

\[
 r_n=\sqrt L F_\lambda(a)-q_nE_{n,O},\qquad
 q_n=-{2(-1)^n\over\sqrt L},\qquad
 E_{n,O}=\sum_{j\geq0}(-1)^jb_{n+j}                  \tag{0.3}
\]

obey

\[
 \boxed{|r_m|^2+|r_{m+1}|^2
       \leq P_0(\lambda,L)d_4}                         \tag{0.4}
\]

for a fixed polynomial-logarithmic function `P_0`.  The proof controls
the common mode, not merely the already known difference
`r_(m+1)-r_m=q_m b_m`.

Second, let the `end` norm be the two-adjacent Euclidean norm and let the
`row` norm be the corresponding carrier-safe norm at the selected singleton
zero.  The full-source endpoint and row contributions from `t_k>=U`, and
the complete exterior row (including its direct transform term), obey

\[
 \boxed{
 \|{\cal T}^{F}_{\rm end,>U}\|_{\rm end}
 +\|{\cal T}^{F}_{\rm row,>U}\|_{\rm row}
 +\|{\cal R}_{O,\rm row}\|_{\rm row}
 \leq P_1(\lambda,L)
 \left(e^{-\kappa c^{3/4}}+\sqrt{d_4}\right)}          \tag{0.5}
\]

for some fixed `kappa>0`.  The endpoint tails are Abel tails when needed.
No derivative of a far endpoint Abel series is asserted or needed.

The Gonek selection can be strengthened, without a new number-theoretic
input, so that the same ordinate also satisfies

\[
 |Z(T)|^2\geq a_0\log Y,\qquad
 |e_m|^2+\rho_m^2|e_{m+1}|^2\leq C L|Z(T)|^2          \tag{0.6}
\]

with fixed `a_0>0`.  The Newton theorem then gives the actual selected
carrier lower scale

\[
 |\widehat F_\lambda(T)|
 \geq P_2(T,L)^{-1}
 \exp\{-\pi T/4+\operatorname {Re}D_c(7/2-iT)\}.       \tag{0.7}
\]

The endpoint error is little-oh of `|q_L|` times (0.7), and the row error
is little-oh of `|q_L|/h` times (0.7).  Consequently all four relative
errors in the normalized endpoint/row interface tend to zero on the
selected adaptive sequence.
The ideal quotient `>>L` from the frozen endpoint-filter theorem therefore
transfers to the actual finite-prolate quotient:

\[
 {D_n^{\rm act}\over|d_n^{\rm act}|^2}\geq c_0L
 \quad\hbox{for some }n\in\{m,m+1\},                 \tag{0.8}
\]

unless the separately declared zero-endpoint branch already succeeds.
In the positive-denominator branch this gives

\[
 \boxed{(\eta_n^{\rm pr})^2=O(L^{-1})\longrightarrow0.} \tag{0.9}
\]

This is an RH-conditional, cofinal, adaptive-schedule transfer theorem.  It
does not synchronize the selected cutoff with the finite simple-ground,
boundary, shifted-sign, or reserve gates.  It proves no literal ceiling
schedule, no prescribed fixed-origin theorem, no differentiated far
endpoint tail, no unconditional zeta-zero statement, no implication to RH,
and no de Bruijn--Newman bound.  The formal state remains `P0_INVALIDATED`.
This is an unbound post-checkpoint theorem/test pair and changes none of the
standard eight files.

## 1. Frozen inputs

The following note/test pairs are imported byte for byte.

| Dependency | SHA-256 |
|---|---|
| notes/TRANSITION_PROLATE_OUTER_THEOREM.md | 215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6 |
| tests/test_transition_prolate_outer.py | bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433 |
| notes/PROLATE_TAIL_ENVELOPE.md | 309337a98721d0e0cffb40391a227ad29fbc0de315c6f532109c9376370ed59d |
| tests/test_prolate_tail_envelope.py | bb5b5ec58f6357a8defcf36b19d3a1674091518903c5438f56c17ae6eef0581e |
| notes/SAME_ANCHOR_ENDPOINT_RATE_ATTACK.md | 9324d758eca900f646eb5a6187cb5f316ece99b64ec77d7da2eb72cc7c7ff4a4 |
| tests/test_same_anchor_endpoint_rate_attack.py | dd63d4a84cbd8330893c11d273648435f57ee858ebd06231e7b3ad811a5712fb |
| notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md | 3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f |
| tests/test_defect_relative_projection.py | 21b33670a9d017d363f53776ba05ca93ce3588eb049ba9dcb7e61f202bc01999 |
| notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md | 384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c |
| tests/test_gevrey_prolate_remainder.py | 93dd3e8053c5d363264479c93457a88898cea11d65994b80b3df6b58ebcdd058 |
| notes/SUBTURNING_FINITE_ORDER_NEWTON_CLOSURE_THEOREM.md | b6597337ed033bf889eb31d06da669edb7a97ddc1e32a4c9c90fb5185dad7dc4 |
| tests/test_subturning_finite_order_newton_closure_theorem.py | 763d6a7b5d641d013d05ece675a3aaa7496bebbeb4e6111bb12878d33180f526 |
| notes/ADAPTIVE_GONEK_ENDPOINT_FILTER_SELECTION_THEOREM.md | 7354d464d4a3d53cb32c83b941a24aac60c5cbbf9b87c5bf56a907193459bd46 |
| tests/test_adaptive_gonek_endpoint_filter_selection_theorem.py | e8e96cab5e5bd817650c0f323f248d00772802e439474b1f9d890083f8ca6396 |
| notes/COMPLEX_MELLIN_ACTION_PHASE_WEIGHTED_STOKES_INTERFACE_REDUCTION.md | aaebb3565089bde5d2a62b3883762e72c2b7544613c9b7e3436d348b0eb6b2b6 |
| tests/test_complex_mellin_action_phase_weighted_stokes_interface_reduction.py | 6b81fd05e26837adad8c9c9ccf36b534d6aa9c0c8fb71b0b2e931ba820c8bdc6 |
| notes/ADJACENT_CUTOFF_PHASE_ALIAS_AGGREGATE_REDUCTION_BARRIER.md | 2afaba5a1fca497a6aa28ba1ab41b66736002b1eaece49035059f5c96e0a2a87 |
| tests/test_adjacent_cutoff_phase_alias_aggregate_reduction_barrier.py | d4ea9d9fd2ae5e6ff841f8963932bce56f37a9569ba4a3d918be5879f0757b97 |

The outer theorem supplies the complete sampled-series and exponentially
weighted exterior bounds.  The tail-envelope and same-anchor notes supply
the endpoint and exact Poisson trace.  The defect-relative note supplies
the jump variation.  The Gevrey note supplies the growing Hermite
majorant and strip estimate.  Newton supplies the actual subturning
factorization.  The last three pairs supply the selected ideal endpoint,
the carrier-safe row normalization, and the adjacent aggregate theorem.

## 2. Exact exterior periodization and one-sided Abel algebra

Use the angular Fourier convention

\[
 \widehat O(t)=\int_{\mathbb R}O(x)e^{-itx}\,dx.        \tag{2.1}
\]

At the cut endpoints use the Fourier midpoint convention

\[
 X(\pm a)=O(\pm a)={F_\lambda(a)\over2}.              \tag{2.2}
\]

This does not change any `L2` quantity.  It fixes the Abel trace without an
implicit one-sided choice.  Define the periodization

\[
 ({\cal P}_LO)(x)=\sum_{\ell\in\mathbb Z}O(x+\ell L).  \tag{2.3}
\]

The weighted exterior theorem makes this series locally `L2` and gives its
Fourier coefficients exactly:

\[
 \widehat {({\cal P}_LO)}(k)={b_k\over L},\qquad
 b_k=\widehat O(t_k).                                  \tag{2.4}
\]

Since `O` is real and even, `b_(-k)=b_k` is real.  At `x=a`,
`exp(i*t_k*a)=(-1)^k`, so Abel summation gives

\[
 \boxed{
 L({\cal P}_LO)(a)=b_0+2\sum_{k\geq1}(-1)^kb_k.}      \tag{2.5}
\]

The point on the left is the common symmetric trace.  The direct sampled
series in Section 4 below is normally convergent there, so (2.5) is also
the ordinary midpoint limit of the Abel means.

Put

\[
 S_n=\sum_{k\geq n}(-1)^kb_k=(-1)^nE_{n,O}.           \tag{2.6}
\]

The normalizations in (0.3) give

\[
 q_nE_{n,O}=-{2\over\sqrt L}S_n,
 \qquad
 \boxed{r_n=\sqrt L F_\lambda(a)+{2\over\sqrt L}S_n.} \tag{2.7}
\]

Subtracting the finite prefix in (2.5) gives the exact common-mode identity

\[
 \boxed{
 2S_n=L({\cal P}_LO)(a)-b_0
       -2\sum_{1\leq k<n}(-1)^kb_k.}                 \tag{2.8}
\]

In particular, (2.8) controls the part which disappears from the adjacent
difference `r_(n+1)-r_n=q_nb_n`.

## 3. Weighted lattice norm

Fix `y=1/4`.  For `x in [-a,a]`,

\[
 \sum_{\ell\in\mathbb Z}e^{-2y|x+\ell L|}\leq3
 \qquad(\lambda\geq2).                                \tag{3.1}
\]

Cauchy--Schwarz in (2.3), followed by integration over one period, gives

\[
 \|{\cal P}_LO\|_2^2
 \leq3\|e^{y|\cdot|}O\|_2^2.                         \tag{3.2}
\]

Parseval with (2.4) is

\[
 \sum_{k\in\mathbb Z}|b_k|^2
 =L\|{\cal P}_LO\|_2^2
 \leq3L\|e^{y|\cdot|}O\|_2^2.                       \tag{3.3}
\]

For one prolate label, equation (4.4) of the frozen outer theorem, with
`epsilon=1/4`, is

\[
 \|e^{y\cdot}O_j\|_2^2
 \leq4250896\,\lambda L_\lambda^2d_j,
 \qquad L_\lambda=1+\log(2+2\pi\lambda^2).           \tag{3.4}
\]

Evenness turns this into the corresponding `e^(y|.|)` estimate.  The
source coefficient satisfies

\[
 |a_{0,\lambda}/a_4|\leq2\sqrt2\lambda,\qquad d_0\leq d_4. \tag{3.5}
\]

The exceptional Poisson term is a multiple of `exp(-|x|/2)` with
coefficient

\[
 |h_\lambda(0)|\leq2\sqrt2a_4\sqrt\lambda d_4,        \tag{3.6}
\]

and therefore has a smaller bound of the same form.  Thus

\[
 \boxed{
 \|e^{y|\cdot|}O\|_2^2
 \leq C_Oa_4^2(1+8\lambda^2)\lambda L_\lambda^2d_4}  \tag{3.7}
\]

with, for example, a fixed `C_O=9000000` after absorbing (3.6).

Equations (2.8) and (3.3) now imply, for every `n>=1`,

\[
 |S_n|\leq{L\over2}|({\cal P}_LO)(a)|
       +\sqrt{3nL}\,\|e^{y|\cdot|}O\|_2.             \tag{3.8}
\]

Consequently

\[
 \boxed{
 |r_n|\leq\sqrt L\{|F_\lambda(a)|+|({\cal P}_LO)(a)|\}
       +2\sqrt{3n}\,\|e^{y|\cdot|}O\|_2.}           \tag{3.9}
\]

## 4. The periodized endpoint trace

The midpoint convention gives the exact trace

\[
 \boxed{
 ({\cal P}_LO)(a)=F_\lambda(a)
       +2\sum_{j\geq1}F_\lambda((2j+1)a).}            \tag{4.1}
\]

Let `h_lambda` be the source-normalized label `0/4` additive state and
`H_lambda` its additive Fourier transform.  Put

\[
 A_\partial=16\pi a_4(1+2\sqrt2\lambda)\sqrt{\lambda d_4}.
                                                               \tag{4.2}
\]

The endpoint theorem and (3.5) give

\[
 |h_\lambda(\lambda)|+|H_\lambda(\lambda)|\leq2A_\partial.
                                                               \tag{4.3}
\]

The exact Poisson endpoint formula is

\[
 F_\lambda(a)={\sqrt\lambda\over2}
 \left(h_\lambda(\lambda)+H_\lambda(\lambda)
       +\sum_{r\geq2}H_\lambda(r\lambda)\right)
 -{h_\lambda(0)\over4\sqrt\lambda}.                \tag{4.4}
\]

Equation (3.6) of the frozen outer theorem gives

\[
 \left|\sum_{r\geq2}H_\lambda(ru)\right|
 \leq{28A_\partial\over\pi u}
 \left(1+\log\left(2+{2\pi\lambda^3\over u}\right)\right)
 \qquad(u\geq\lambda).                               \tag{4.5}
\]

For `u>=2lambda`, the same theorem also gives

\[
 |H_\lambda(u)|\leq{6A_\partial\over\pi u}.          \tag{4.6}
\]

Equations (3.6) and (4.2)--(4.5) show

\[
 |F_\lambda(a)|\leq C(1+\lambda)\lambda
       L_\lambda\sqrt{d_4}.                           \tag{4.7}
\]

For `u>lambda`, Poisson summation with zero source integral gives

\[
 F_\lambda(\log u)={\sqrt u\over2}
       \sum_{r\geq1}H_\lambda(ru)
       -{h_\lambda(0)\over4\sqrt u}.                 \tag{4.8}
\]

Apply (4.5)--(4.6) at `u=lambda^(2j+1)`, `j>=1`.  The resulting geometric
series in `u^(-1/2)` proves

\[
 \sum_{j\geq1}|F_\lambda((2j+1)a)|
 \leq C(1+\lambda)L_\lambda\sqrt{d_4}.               \tag{4.9}
\]

Combining (4.1), (4.7), and (4.9),

\[
 \boxed{
 |F_\lambda(a)|+|({\cal P}_LO)(a)|
 \leq C(1+\lambda)\lambda L_\lambda\sqrt{d_4}.}     \tag{4.10}
\]

On the adaptive schedule `m,m+1=O(lambda*L^3)`.  Substitution of
(3.7) and (4.10) into (3.9), followed by squaring, proves (0.4).

## 5. Intermediate-order Gevrey tail

The Newton factorization is required only through `t=U`.  Let
`H_(lambda,J)` be the formal Hermite source and put

\[
 G_J(x)={\cal E}(H_{\lambda,J})(e^x),\qquad
 {\cal E}(v)(u)=u^{1/2}\sum_{r\geq1}v(ru).            \tag{5.1}
\]

Choose

\[
 K_U=\left\lceil{U\over h}\right\rceil,
 \qquad
 J=\left\lfloor{\delta U\over\log(U+2)}\right\rfloor, \tag{5.2}
\]

where `delta>0` is fixed below.  The formal source has Hermite support

\[
 Q\leq4J+4.                                             \tag{5.3}
\]

For every fixed strip `0<sigma<pi/4`, the Gevrey strip theorem gives

\[
 |\widehat G_J(\omega)|
 \leq\exp\{C_\sigma Q\log(Q+2)-\sigma|\omega|\}.      \tag{5.4}
\]

Choose `delta` so small that, eventually,

\[
 C_\sigma Q\log(Q+2)\leq{\sigma U\over4}.            \tag{5.5}
\]

Summing (5.4) on `t_k>=U`, and retaining the endpoint restriction term in
equation (5.4) of the Gevrey note, gives

\[
 \sum_{k\geq K_U}|\widehat {1_{[-a,a]}G_J}(t_k)|
 \leq C L e^{-\sigma U/2}+P(\lambda)e^{-c_1\lambda^2}. \tag{5.6}
\]

Only values are summed here.  No differentiated far endpoint tail is
claimed.  The growing-order source remainder satisfies

\[
 \|h_\lambda-H_{\lambda,J}\|_2
 \leq C\left\{e^{-c_2\lambda^2}
       +\left({B(J+1)\over\lambda^2}\right)^{J+1}\right\}
 =:{\cal E}_J.                                          \tag{5.7}
\]

Since `U=Theta(lambda^(3/2))`, (5.2) gives

\[
 \log {\lambda^2\over B(J+1)}\geq {L\over6},
 \qquad
 J\geq{\delta U\over2\log U}.                         \tag{5.8}
\]

As `log U=(3/4)L+O(1)`,

\[
 \left({B(J+1)\over\lambda^2}\right)^{J+1}
 \leq e^{-\delta U/9},\qquad
 {\cal E}_J\leq C e^{-\kappa_0U}.                    \tag{5.9}
\]

We next split the tiny jumps explicitly.  Equations (4.5) and (4.10) of
the defect-relative theorem give the actual jump variation

\[
 \boxed{
 V_{\rm act}\leq32\pi a_4(1+2\sqrt2\lambda)
             \lambda^2\sqrt{d_4}.}                  \tag{5.10}
\]

The compactly restricted formal proxy also has arithmetic jumps.  The
derivative Mehler estimate from Section 3.1 of the Gevrey theorem, at
support height `Q=o(lambda^2)`, gives

\[
 |H_{\lambda,J}(\lambda)|
 +\lambda|H_{\lambda,J}'(\lambda)|
 \leq P(\lambda,Q)e^{-c_3\lambda^2},
 \qquad
 V_{\rm prox}\leq P(\lambda,Q)e^{-c_3\lambda^2}.    \tag{5.11}
\]

The outside-proxy term has the opposite proxy jumps.  Keeping both instead
of cancelling them gives the safe total

\[
 V_{\rm step}\leq V_{\rm act}+2V_{\rm prox}
 \leq P(\lambda,L)\{\sqrt{d_4}+e^{-c_4\lambda^2}\}. \tag{5.12}
\]

Exact evenization removes the circular endpoint jump.  For an even step
function, derivative atoms at `+/-x` have opposite signs, so integration by
parts pairs their exponentials into sines.  The uniform bound

\[
 \left|\sum_{k>K}{\sin(k\theta)\over k}\right|\leq4  \tag{5.13}
\]

therefore bounds every one-sided alternating endpoint tail of the step
part by `C*h^(-1)*V_step<=C*L*V_step`, uniformly in its starting index.

After removing this step part, the remainder is periodic and continuous.
We derive its `H1` norm instead of assuming a trace upgrade.  On the source
interval put `r_J=h_lambda-H_(lambda,J)`.  For each exact prolate mode the
finite-Fourier identity gives

\[
 \chi_j\|f_{j,\lambda}''\|_2
 \leq\|H_j''\|_{L^2(\mathbb R)}
 \leq(2\pi\lambda)^2.                                \tag{5.14}
\]

The corresponding norm for the formal Hermite sum is polynomial in `Q`.
The endpoint theorem, the Mehler estimate, and the exact regular-endpoint
identity

\[
 2\lambda f_{j,\lambda}'(\lambda)
 =\{\mu_j(c)-c^2\}f_{j,\lambda}(\lambda)              \tag{5.15}
\]

give

\[
 \|r_J''\|_2\leq P(\lambda,Q),\qquad
 |r_J(\lambda)r_J'(\lambda)|
 +|r_J(-\lambda)r_J'(-\lambda)|
 \leq P(\lambda,Q)\{d_4+e^{-c_4\lambda^2}\}.        \tag{5.16}
\]

Thus graph-norm interpolation has no hidden boundary trace:

\[
 \begin{aligned}
 \|r_J'\|_2^2
 &=\operatorname {Re}[r_J'\overline {r_J}]_{-\lambda}^{\lambda}
   -\operatorname {Re}\langle r_J'',r_J\rangle\\
 &\leq P(\lambda,Q)
   \{{\cal E}_J+d_4+e^{-c_4\lambda^2}\}.
 \end{aligned}                                      \tag{5.17}
\]

For `D=1/2+x*d/dx`, this implies

\[
 \|Dr_J\|_2
 \leq P(\lambda,Q)
 \{{\cal E}_J^{1/2}+\sqrt{d_4}+e^{-c_5\lambda^2}\}. \tag{5.18}
\]

On every smooth arithmetic piece the exact transfer identities are

\[
 \|{\cal E}(r_J)\|_{L^2(du/u)}\leq\lambda\|r_J\|_2,
 \qquad
 \partial_x{\cal E}(r_J)(e^x)={\cal E}(Dr_J)(e^x),
 \qquad
 \|{\cal E}(Dr_J)\|_{L^2(du/u)}\leq\lambda\|Dr_J\|_2.
                                                               \tag{5.19}
\]

Subtracting the jumps counted in (5.12) makes this piece continuous and
periodic.  The outside formal-proxy term has `H1` norm
`P(lambda,Q)*exp(-c_5*lambda^2)` by the fixed-derivative Mehler estimate.
Equations (5.9), (5.12), and (5.17)--(5.19) prove

\[
 \boxed{
 \|R_{J,\rm cont}\|_{H^1(-a,a)}
 \leq P(\lambda,L)
 \{e^{-\kappa_1U}+\sqrt{d_4}\}.}                   \tag{5.20}
\]

For comparison, even the cruder trace interpolation which retains
`D_lambda^(1/4)` creates no new scale.  With

\[
 D_\lambda=10\exp\left\{-{\lfloor4\lambda^2\rfloor-11
 \over(2/\pi^2)\log(200\lambda^2+25)}\right\},
 \qquad
 D_\lambda^{1/4}\leq e^{-\kappa_2U}                \tag{5.21}
\]

eventually, because `lambda^2/L` dominates `U=Theta(lambda^(3/2))`.
No comparison of `D_lambda^(1/4)` with `sqrt(d_4)` is used.

Derivative Parseval and Cauchy--Schwarz now give

\[
 \sum_{k\geq K_U}|\widehat R_{J,\rm cont}(t_k)|
 \leq {CL\over\sqrt U}\|R_{J,\rm cont}'\|_2.       \tag{5.22}
\]

Equations (5.6), (5.12)--(5.13), and (5.20)--(5.22) control the compact
part of both adjacent far endpoint tails.  Finally (3.8) and (4.10), used
with `n=K_U`, give

\[
 \left|\sum_{k\geq K_U}(-1)^k\widehat O(t_k)\right|
 \leq P(\lambda,L)\sqrt{d_4}.                       \tag{5.23}
\]

Thus the full-source endpoint part of (0.5) follows.  This argument sums
only values of the far Abel endpoint tail.

## 6. Selected phase-weighted far row

We first define the quantities in (0.5).  For `n in {m,m+1}` let

\[
 \begin{aligned}
 E^F_{n,>U}
 &=\sum_{k\geq K_U}(-1)^{k-n}\widehat F_\lambda(t_k),\\
 C^F_{n,\gamma,>U}
 &=\sum_{k\geq K_U}(-1)^{k-n}\widehat F_\lambda(t_k)
       {\gamma^2\over\gamma^2-t_k^2},\\
 C_{n,\gamma,O}
 &=\sum_{k\geq n}(-1)^{k-n}b_k
       {\gamma^2\over\gamma^2-t_k^2}.
 \end{aligned}                                        \tag{6.1}
\]

All sums use Abel limits when required.  With
`q_n=-2*(-1)^n/sqrt(L)`, define the exact physical vectors

\[
 \begin{aligned}
 {\cal T}^{F}_{\rm end,>U}
 &=\bigl(q_nE^F_{n,>U}\bigr)_{n=m,m+1},\\
 {\cal T}^{F}_{\rm row,>U}
 &=\left(q_n{\sin(\gamma L/2)\over\gamma}
                 C^F_{n,\gamma,>U}\right)_{n=m,m+1},\\
 {\cal R}_{O,\rm row}
 &=\left(-q_n{\sin(\gamma L/2)\over\gamma}
                 C_{n,\gamma,O}
          -{\sqrt L\over2}\widehat O(\gamma)
   \right)_{n=m,m+1}.
 \end{aligned}                                        \tag{6.2}
\]

These are exactly the two adjacent endpoint tails, selected phase-weighted
rows, and full exterior rows in equations (5.5)--(5.7) of the frozen
adjacent theorem.  No envelope normalization has yet been suppressed.

Let `gamma<T` be the selected zero.  For `t_k>=U`,

\[
 \left|{\sin(\gamma L/2)\over\gamma}
 {\gamma^2\over\gamma^2-t_k^2}\right|
 \leq {2T\over t_k^2}.                                 \tag{6.3}
\]

The analytic and continuous compact pieces are absolutely summable by
Section 5.  For the step part, summation by parts uses the uniform
alternating tail in (5.13); the total variation of the kernel on
`[U,infinity)` is its first absolute value.  Hence

\[
 \left|{\sin(\gamma L/2)\over\gamma}
   \sum_{k\geq K_U}(-1)^k\widehat S(t_k)
       {\gamma^2\over\gamma^2-t_k^2}\right|
 \leq {C T\over U^2}L V_{\rm step}.                  \tag{6.4}
\]

This controls the full compact far row by
`P(lambda,L)*(exp(-kappa*U)+sqrt(d_4))`.

It remains to bound the complete exterior row, not only its part above
`U`.  The adaptive half-cell alignment gives

\[
 {T-\gamma\over h}\longrightarrow{1\over2},\qquad
 \operatorname {dist}(\gamma/h,\mathbb Z)\geq{1\over3} \tag{6.5}
\]

eventually.  Therefore, for either `n=m` or `n=m+1`,

\[
 \sum_{k\geq n}
 \left|{\sin(\gamma L/2)\over\gamma}
       {\gamma^2\over\gamma^2-t_k^2}\right|^2
 \leq\sum_{k\geq n}{1\over|\gamma-t_k|^2}
 \leq {C\over h^2}.                                  \tag{6.6}
\]

Equations (3.3), (3.7), and Cauchy--Schwarz now give

\[
 \left|{\sin(\gamma L/2)\over\gamma}C_{n,\gamma,O}\right|
 \leq {C\over h}\left(\sum_{k\geq n}|b_k|^2\right)^{1/2}
 \leq P(\lambda,L)\sqrt{d_4}.                       \tag{6.7}
\]

The direct term in (6.2) follows from weighted `L2` to `L1`:

\[
 |\widehat O(\gamma)|\leq\|O\|_1
 \leq\left(\int_{\mathbb R}e^{-2y|x|}dx\right)^{1/2}
       \|e^{y|\cdot|}O\|_2
 =2\|e^{y|\cdot|}O\|_2
 \leq P(\lambda,L)\sqrt{d_4}.                       \tag{6.8}
\]

Equations (5.23) and (6.3)--(6.8) prove (0.5), including the entire near
exterior range `n<=k<K_U` and the direct transform value.

For the precise normalization used downstream, put

\[
 {\mathscr A}_n=W_\lambda(T)A(t_n),\qquad
 \rho_n={{\mathscr A}_{n+1}\over{\mathscr A}_n}.
                                                               \tag{6.9}
\]

The endpoint main entries are `q_n*mathscr A_n*e_n`, and the row main
entries are `q_n*mathscr A_n*bar a_(n,gamma)`.  Componentwise division of
`(r_m,r_(m+1))+T^F_(end,>U)` by `q_n*mathscr A_n`, and of
`T^F_(row,>U)+R_(O,row)` by the same factors, gives exactly the exterior
error arrays in the second line of equation (5.7) of the adjacent theorem.
Thus the bounds in (0.4)--(0.5) are physical bounds before normalization,
not bounds with a hidden factor `A_n` removed.

## 7. Strengthened same-ordinate selection

Let

\[
 W_Y=\sum_{Y<\gamma\leq2Y}\nu_\gamma|Z(t_\gamma)|^2.
                                                               \tag{7.1}
\]

The frozen Gonek formula and Riemann--von Mangoldt count give fixed
positive constants `c_G,C_N` such that

\[
 W_Y\geq c_GY\log^2Y,
 \qquad
 \sum_{Y<\gamma\leq2Y}\nu_\gamma\leq C_NY\log Y.     \tag{7.2}
\]

Choose `a_0<c_G/(2C_N)` and discard ordinates with
`|Z(t_gamma)|^2<a_0 log Y`.  Their total contribution to (7.1) is less
than `W_Y/2`.  Thus the retained set carries at least half the Gonek
weight.

The endpoint-filter theorem also gives

\[
 \sum_{Y<\gamma\leq2Y}\nu_\gamma Q_\gamma
 \leq C_Q\log Y\,W_Y,                                 \tag{7.3}
\]

where

\[
 Q_\gamma=|e_\gamma|^2+\rho_\gamma^2|e_{\gamma,+}|^2. \tag{7.4}
\]

Weighted pigeonholing on the retained set selects the same ordinate with

\[
 |Z(T)|^2\geq a_0\log Y,
 \qquad
 Q_\gamma\leq2C_Q\log Y\,|Z(T)|^2.                   \tag{7.5}
\]

Since `L asymp log Y`, this is (0.6).  The `PW1` half-cell lower bound was
uniform in every ordinate and is unchanged by the restriction.

## 8. Relative exponent comparison and actual transfer

For the adaptive inverse,

\[
 T={2\pi(N+1)\over L}
 =2\pi\lambda L^2+O(1),
 \qquad {T\over U}=O\left({L^2\over\sqrt\lambda}\right)
 \longrightarrow0.                                     \tag{8.1}
\]

Here the second equality uses the rounded adaptive bound
`|N-lambda*L^3|<=L/4+1+o(1)`.  The continuous inverse identity
`T=2*pi*(lambda*L^2+1/L)` is not asserted on this nearest-integer schedule.

Put `f(t)=Xi(t)/4=-A(t)Z(t)`.  The exact Hardy--Xi envelope and (7.5)
give

\[
 |\Xi(T)|\geq P(T,L)^{-1}e^{-\pi T/4}.                \tag{8.2}
\]

The Newton theorem gives, separately for labels `0` and `4`,
`|epsilon_j|+|partial_t epsilon_j|=O(1/t+t/c)`.  Insert these two bounds into
the exact locked mixture identity

\[
 1+\varepsilon_{\rm src}
 =(1-\delta_t)(1+\varepsilon_4)
 +\delta_t e^{\Delta D}(1+\alpha_\lambda)
                 (1+\varepsilon_0),                 \tag{8.3}
\]

where `delta_t=3/(4*(t^2+1/4))`,
`alpha_lambda=O(c^(-1))`, and
`Delta D=D_c(s-1)-D_c(s+3)`.  The action difference and its derivative are
`O(t/c)` and `O(c^(-1))`, respectively.  Thus every label-mixture error is
accounted for and, uniformly on `T<=t<=U`,

\[
 \widehat F_\lambda(t)=W_\lambda(t)f(t),\qquad
 W_\lambda(t)=\operatorname {Re}
 \{e^{D_c(7/2-it)}(1+\varepsilon_{\rm src}(t))\},
                                                               \tag{8.4}
\]

\[
 W_\lambda(t)\asymp e^{\operatorname {Re}D_c(7/2-it)}>0,
 \qquad
 |\partial_t\log W_\lambda(t)|
 \leq C\left({1\over t}+{t\over c}\right).          \tag{8.5}
\]

In particular,

\[
 |\widehat F_\lambda(T)|
 \geq P(T,L)^{-1}
 e^{-\pi T/4+\operatorname {Re}D_c(7/2-iT)}.           \tag{8.6}
\]

The exact action expansion on (8.1) is

\[
 -{\pi T\over4}+\operatorname {Re}D_c(7/2-iT)
 =-\frac{\pi^2}{2}\lambda L^2+{\pi\over4}L^4+O(L).  \tag{8.7}
\]

On the other hand,

\[
 -\kappa U+{\pi T\over4}-\operatorname {Re}D_c(7/2-iT)
 \longrightarrow-\infty,                              \tag{8.8}
\]

because `U=Theta(lambda^(3/2))`.  From (5.21),

\[
 {1\over4}\log D_\lambda
 \leq-\left({\pi^2\over2}+o(1)\right){\lambda^2\over L},
 \qquad
 {1\over2}\log D_\lambda
 \leq-\left(\pi^2+o(1)\right){\lambda^2\over L}.     \tag{8.9}
\]

Both exponents dominate the negative scale in (8.7), since
`lambda/L >> L^2`.  Polynomial factors, `q_n`, and `h` do not change these
comparisons.

It remains to justify operator transfer despite cancellation in an
alternating tail.  Write `W_T=W_lambda(T)` and, for `n=m,m+1`, put

\[
 \begin{aligned}
 \Delta E_n^{\rm loc}
 &=\sum_{n\leq k<K_U}(-1)^{k-n}
        \{W_\lambda(t_k)-W_T\}f(t_k),\\
 \Delta C_{n,\gamma}^{\rm loc}
 &=\sum_{n\leq k<K_U}(-1)^{k-n}
        \{W_\lambda(t_k)-W_T\}f(t_k)
        {\gamma^2\over\gamma^2-t_k^2}.
 \end{aligned}                                      \tag{8.10}
\]

Stirling and convexity give, for `u>=0`,

\[
 {A(T+u)\over A(T)}
 \leq C(1+u/T)^2e^{-\pi u/5},qquad
 |Z(T+u)|\leq C(T+u)^{1/4}\log(T+u).                 \tag{8.11}
\]

Fix a large constant `B`.  For `0<=u<=B log T`, (8.5) gives

\[
 \left|{W_\lambda(T+u)\over W_T}-1\right|
 \leq Cu\left({1\over T}+{T+B\log T\over c}\right). \tag{8.12}
\]

Also `sum_(j>=0) (jh)*exp(-pi*j*h/5)<=C/h`.  For
`B log T<u<=U-T`, integration of (8.5) costs at most
`exp(C*u*U/c)`; since `U/c` tends to zero, this is absorbed into the
exponential in (8.11).  Choosing `B` large makes that complementary sum
`O(T^(-10))`.  Consequently the absolute, cancellation-safe estimate is

\[
 {\max_{n=m,m+1}|\Delta E_n^{\rm loc}|
  \over W_TA(T)|Z(T)|}
 \leq {C T^{1/4}\log T\over |Z(T)|h}
       \left({T\over c}+{1\over T}\right)+O(T^{-9})
 =O\{\lambda^{-3/4}P(L)\}=o(1),                    \tag{8.13}
\]

where (7.5) supplies `|Z(T)|>=sqrt(a_0*log Y)`.  Thus slow variation has
been used only after absolute damping; no endpoint cancellation is assumed.
For the selected row, (6.5) gives

\[
 \left|{\sin(\gamma L/2)\over\gamma}
       {\gamma^2\over\gamma^2-t_k^2}\right|
 \leq {C\over h(1+|k-m|)}\leq {C\over h}.           \tag{8.14}
\]

Applying (8.14) to the same absolute sum in (8.13) proves

\[
 \max_{n=m,m+1}\left|{\sin(\gamma L/2)\over\gamma}
       \Delta C_{n,\gamma}^{\rm loc}\right|
 =o\left({W_TA(T)|Z(T)|\over h}\right).             \tag{8.15}
\]

The ideal Hardy tails above `U` are `P(lambda,L)*exp(-pi*U/5)` by
(8.11).  Denote their physical two-adjacent endpoint and row vectors by
`T^(id)_(end,>U)` and `T^(id)_(row,>U)`; explicitly they are defined by
(6.1)--(6.2) with `Fhat_lambda(t_k)` replaced by `W_T*f(t_k)`.  Also put

\[
 \begin{aligned}
 {\boldsymbol\Delta}_{\rm end}^{\rm loc}
 &=\bigl(q_n\Delta E_n^{\rm loc}\bigr)_{n=m,m+1},\\
 {\boldsymbol\Delta}_{\rm row}^{\rm loc}
 &=\left(q_n{\sin(\gamma L/2)\over\gamma}
                  \Delta C_{n,\gamma}^{\rm loc}\right)_{n=m,m+1},\\
 {\mathfrak E}_{\rm end}
 &={\boldsymbol\Delta}_{\rm end}^{\rm loc}
   +(r_m,r_{m+1})+{\cal T}^{F}_{\rm end,>U}
   -{\cal T}^{\rm id}_{\rm end,>U},\\
 {\mathfrak E}_{\rm row}
 &={\boldsymbol\Delta}_{\rm row}^{\rm loc}
   +{\cal T}^{F}_{\rm row,>U}+{\cal R}_{O,\rm row}
   -{\cal T}^{\rm id}_{\rm row,>U}.
 \end{aligned}                                      \tag{8.16}
\]

These are the exact physical actual-minus-main vectors.  The actual tails
and complete exterior row satisfy (0.5).  Together with (0.4),
(8.8)--(8.9), and (8.13)--(8.15), this gives

\[
 \begin{aligned}
 \|{\mathfrak E}_{\rm end}\|_{\rm end}
   &=o\{|q_m|\,|\widehat F_\lambda(T)|\},\\
 \|{\mathfrak E}_{\rm row}\|_{\rm row}
   &=o\left\{{|q_m|\over h}|\widehat F_\lambda(T)|\right\}.
 \end{aligned}                                      \tag{8.17}
\]

The factors `q_m` in (8.17) are harmless polynomial factors but are shown
because they are part of the frozen interface normalization.

Finally the main norms have matching lower bounds.  The exact endpoint
recurrence is `-Z(T)=e_m+rho_m*e_(m+1)`.  With (6.9),

\[
 \|\boldsymbol b^{\rm main}\|_{\rm end}^2
 =|q_m|^2W_T^2A(T)^2
   \{|e_m|^2+\rho_m^2|e_{m+1}|^2\}
 \geq {|q_m|^2\over2}|\widehat F_\lambda(T)|^2.      \tag{8.18}
\]

The weighted singleton form of `PW1` gives, with its frozen positive
constant `c_PW`,

\[
 \|\boldsymbol a^{\rm main}\|_{\rm row}^2
 \geq c_{\rm PW}|q_m|^2h^{-2}W_T^2A(T)^2|Z(T)|^2
 =c_{\rm PW}{|q_m|^2\over h^2}
       |\widehat F_\lambda(T)|^2.                    \tag{8.19}
\]

Equations (8.13)--(8.19), after the componentwise normalization described
after (6.9), prove all four `o(1)` comparisons in equation (5.7) of the
adjacent-cutoff theorem.  Its Hilbert loss therefore tends to one.

The ideal same-ordinate theorem has `PW1` with fixed positive constant and
`C_E(L)=O(L)`.  Since `h^(-2)=Theta(L^2)`, the ideal quotient is `>>L`.
The actual transfer gives (0.8), and the frozen bounded zero-sampling
constant gives (0.9).

## 9. Stopping point

The endpoint common mode, the post-subturning endpoint tail, and the
selected phase-weighted Cauchy row are now controlled at the correct
defect-relative and selected-carrier scales.  Exact carriers remain in the
phase-weighted norm, and no pointwise division by the phase has been used.

The result is deliberately limited to the cofinal adaptive sequence and to
undifferentiated far endpoint Abel tails.  The finite-gate intersection is
still absent.  Therefore (0.9) is an analytic/arithmetic quotient result at
the selected cutoff, not a completed finite-gate RH proof.  The formal
state remains `P0_INVALIDATED`.
