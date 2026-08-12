# RH even zero-Gram Gevrey relative-reserve barrier

## 0. Exact outcome and claim boundary

Let `lambda` tend to infinity and put

\[
 L=2\log\lambda,
 \qquad N=\lceil\lambda L^3\rceil.                  \tag{0.1}
\]

On the branch where every nontrivial zero is on the critical line, let
`A_circ` be the unshifted positive-index even zero Gram from checkpoints
1.37--1.38.  Its least value controls the even localizing reserve

\[
 \epsilon_+={\mu\over\lambda_{\min}(A^\circ)},
 \qquad \delta_+=1-\epsilon_+.                       \tag{0.2}
\]

The explicit even global radical

\[
 J_\infty=K_\infty'',
 \qquad \widehat J_\infty(z)=-{z^2\Xi(z)\over4}      \tag{0.3}
\]

has zero full central Fourier coefficient.  Project it into the centered
even Fourier space and delete the small finite central coefficient exactly.
The resulting nonzero vector lies in the positive-index even coordinate
space and has Rayleigh value

\[
 r_N^+=O\!\left(e^{-c_{\rm ev}\lambda L^2}\right),
 \qquad
 \boxed{\lambda_{\min}(A^\circ)\leq r_N^+.}          \tag{0.4}
\]

The reflected-height factor two and the repository two-slot sampling norm
are retained explicitly below.  Polynomial losses from finite projection,
variation, and central deletion can be absorbed after reducing the positive
constant `c_ev`.

Thus the desired quantitative reserve has a necessary relative comparison,
not an absolute one.  For every fixed `0<rho<1`,

\[
 \boxed{
 \delta_+>\rho\quad\Longrightarrow\quad
 {\mu\over r_N^+}<1-\rho,}                            \tag{0.5}
\]

and

\[
 \boxed{
 \epsilon_+=o(L^{-1})\quad\Longrightarrow\quad
 {\mu\over r_N^+}=o(L^{-1}).}                        \tag{0.6}
\]

These implications are necessary only.  The finite strict hypotheses give

\[
 0\leq\mu<\lambda_{\min}(A^\circ)\leq r_N^+,         \tag{0.7}
\]

but no quantitative separation inside this chain.  The frozen estimates
`mu<=q_N=O(exp(-c_q*lambda*L^2))` and (0.4) are two upper bounds with
unrelated positive constants.  They do not prove (0.5) for the
checkpoint-1.38 fixed-zero uniqueness threshold and do not prove (0.6).

The matrix `A_circ` here is the unshifted positive-index even zero Gram.  It
is not the prolate-anchor complement and is not the shifted operator `B`
from the transverse moment-angle obstruction.  No local uniqueness for the
genuine shifted nodes, determinant convergence, prolate-anchor response
bound, actual-arithmetic sign failure, new zero theorem, RH proof or
converse, or de Bruijn--Newman `Lambda` bound is obtained.  The standard
eight are unchanged, the logical lattice model below is not the zeta
divisor, and the formal state remains `P0_INVALIDATED`.

## 1. Frozen inputs

Only the following twelve frozen repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md` | `384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c` |
| `tests/test_gevrey_prolate_remainder.py` | `93dd3e8053c5d363264479c93457a88898cea11d65994b80b3df6b58ebcdd058` |
| `notes/RH_ODD_ZERO_GRAM_GEVREY_RELATIVE_FLOOR_BARRIER.md` | `295e387c1e0ea9935bebb8458a9fea255ed60919116832dc4cd3756b033bea89` |
| `tests/test_rh_odd_zero_gram_gevrey_relative_floor_barrier.py` | `e8517b2baa6ec084d724826136bc4d15b427416211c2679bfbdca2be76a19c29` |
| `notes/TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md` | `e5a0888f54ae4ae97d00462b7cfd00cbc9d98638ff9d36aea0fdb7a1c861e77f` |
| `tests/test_transverse_xi_radical_moment_angle_obstruction.py` | `3cbea43c78355fcece4dec25a76280ee23e5c706b0d509c2951b003d3a531c75` |
| `notes/ANTI_CARRIER_LOG_SCHEDULE_AUDIT.md` | `ceb3e7067ed9ef9f02f443b665a83f778500630ded912e60df128abc8c17514a` |
| `tests/test_anti_carrier_log_schedule.py` | `304175ece40e36ae979dffa44c43009d1b796be2d72a820d7021758a34472a1b` |
| `notes/SHIFTED_ZERO_SELECTOR_GAUSSIAN_QUADRATURE_BARRIER.md` | `1a2c95f9cf352a89b5eda544ac7158124761b1afe49ead464ca881ca08d6acd1` |
| `tests/test_shifted_zero_selector_gaussian_quadrature_barrier.py` | `2da21833bf1d79977c7b1b656be3f40d9bfbe9e2483ecb5c65941fabb6dde2d0` |
| `notes/RH_ZERO_GAUSSIAN_SQUARE_FREE_LIMIT_THEOREM.md` | `6622d6ee81f08daef596850ecd4dfbb071c5a2a087e083ee5f68a5bc1b211742` |
| `tests/test_rh_zero_gaussian_square_free_limit_theorem.py` | `680c2ad7ebef01683b218d4f2e4693047d01a0452346fe89b8277f7bd31c84fb` |

The Gevrey and odd-barrier pairs supply the analytic-strip projection and
compact-BV sampling conversion, including the repository factor convention.
The transverse pair supplies the exact `K_infinity`, source operator, and
second-derivative radical identities.  The anti-carrier pair supplies the
only available growing minor scale and the count-compatible lattice model.
The checkpoint-1.37 and checkpoint-1.38 pairs define `A_circ`, its strict
reserve, and the exact quantitative gates.  No zero table, external source,
standard-eight edit, or numerical artifact is added.

## 2. Exact RH even zero Gram

Put

\[
 \alpha={2\pi\over L},
 \qquad
 e_n^+={V_n+V_{-n}\over\sqrt2},\quad1\leq n\leq N.   \tag{2.1}
\]

For a positive ordinate, the even evaluation row is

\[
 b_N(\gamma)_n=
 {2\sqrt{2/L}\,\gamma\sin(L\gamma/2)
  \over \gamma^2-\alpha^2n^2}.                       \tag{2.2}
\]

Carrier values are interpreted continuously.  At an in-band carrier
`gamma=alpha*m`, the row is supported only in coordinate `m`; an out-of-band
carrier gives the zero row.  On RH, reflected negative ordinates give

\[
 \boxed{
 A^\circ=2\sum_{\gamma>0}m_\gamma
        |b_N(\gamma)\rangle\langle b_N(\gamma)|.}     \tag{2.3}
\]

If a real even function `f` has only the positive coordinates (2.1), define
the paired two-slot seminorm

\[
 \|f\|_{\mathfrak Z}^2
 :=4\sum_{\gamma>0}m_\gamma|\widehat f(\gamma)|^2.
                                                               \tag{2.4}
\]

Then the exact normalization is

\[
 \boxed{
 \langle f,A^\circ f\rangle
 ={1\over2}\|f\|_{\mathfrak Z}^2.}                 \tag{2.5}
\]

Algebraic multiplicity changes the row weight and never creates derivative
jets.  Formula (2.5), rather than a hidden change of sampling convention,
fixes the factor used in Section 4.

## 3. The central-zero even radical

The limiting source state has

\[
 K_\infty(x)={\cal E}(g_0)(e^x),
 \qquad \widehat K_\infty(z)={\Xi(z)\over4},          \tag{3.1}
\]

where `g_0` is a finite Fourier-invariant even Hermite combination with
`g_0(0)=0` and `integral(g_0)=0`.  For

\[
 {\cal L}={1\over2}+y{d\over dy},                    \tag{3.2}
\]

the source identities are

\[
 {d\over dx}{\cal E}(g)(e^x)={\cal E}({\cal L}g)(e^x),
 \quad
 ({\cal L}g)(0)={g(0)\over2},
 \quad
 \int_{\mathbb R}{\cal L}g=-{1\over2}\int_{\mathbb R}g.
                                                               \tag{3.3}
\]

Applying (3.3) twice proves

\[
 J_\infty:=K_\infty''
 ={\cal E}({\cal L}^2g_0)(e^x),
 \quad
 ({\cal L}^2g_0)(0)=0,
 \quad
 \int_{\mathbb R}{\cal L}^2g_0=0.                  \tag{3.4}
\]

Thus `J_infinity` is an exact two-slot global zero-evaluation radical,
without assuming RH.  Fourier differentiation gives (0.3), and therefore

\[
 \widehat J_\infty(0)=\int_{\mathbb R}J_\infty(x)\,dx=0.
                                                               \tag{3.5}
\]

It is nonzero because `-z^2*Xi(z)/4` is not identically zero.  Moreover the
unitary additive Fourier transform obeys

\[
 {\cal F}{\cal L}=-{\cal L}{\cal F},
 \qquad
 {\cal F}{\cal L}^2g_0={\cal L}^2g_0.                \tag{3.6}
\]

Hence the complexified Poisson reflection for `J_infinity` has even parity,
and the fixed-source strip majorant is the same absolute type as for the
odd radical `K_infinity'`.  The two applications of `mathcal L` change only
fixed polynomial constants; they do not change the strip width or the
exponential class.

## 4. Projection and exact central deletion

Let `C_lambda` restrict to `[-L/2,L/2]`, let `P_N^+` be the centered even
Fourier projection through index `N`, and put

\[
 w_N=P_N^+C_\lambda J_\infty,
 \qquad e_0=L^{-1/2}{\bf1}_{[-L/2,L/2]}.              \tag{4.1}
\]

The finite central coefficient is

\[
 \begin{aligned}
 c_N&=\langle e_0,C_\lambda J_\infty\rangle\\
 &=L^{-1/2}\int_{-L/2}^{L/2}K_\infty''(x)\,dx
 ={2K_\infty'(L/2)\over\sqrt L}.
 \end{aligned}                                       \tag{4.2}
\]

The last equality uses evenness of `K_infinity`.  The fixed polynomial
Gaussian source tail gives constants `c_0,C_0>0` and a fixed power `A_0`
such that

\[
 |c_N|\leq C_0\lambda^{A_0}e^{-c_0\lambda^2}.        \tag{4.3}
\]

Delete this coefficient exactly:

\[
 z_N=w_N-c_Ne_0
 =\left(P_N^+-|e_0\rangle\langle e_0|\right)
       C_\lambda J_\infty.                            \tag{4.4}
\]

Thus `z_N` belongs to the positive-index even coordinate space of
`A_circ`.  Central deletion is harmless in the zero-sampling seminorm.  On
the real axis,

\[
 \widehat e_0(\gamma)
 ={2\sin(\gamma L/2)\over\sqrt L\,\gamma},
 \qquad
 \|e_0\|_{\mathfrak Z}^2
 \leq{16\over L}\sum_{\gamma>0}{m_\gamma\over\gamma^2}<\infty.
                                                               \tag{4.5}
\]

The convergence of the final sum follows from the centered Hadamard
product and retains multiplicities.

For the full projection `w_N`, the fixed-source version of the admitted
analytic-strip estimate has cutoff

\[
 \Omega_N={2\pi(N+1)\over L}\asymp\lambda L^2.       \tag{4.6}
\]

The Fourier-invariant parity in (3.6), the endpoint estimate of order
`poly(lambda)*exp(-c*lambda^2)`, and the compact-BV sampling conversion give
positive constants `c_1,C_1` such that

\[
 \|w_N-J_\infty\|_2\longrightarrow0,
 \qquad
 \|J_\infty-w_N\|_{\mathfrak Z}^2
 \leq C_1e^{-c_1\lambda L^2}.                        \tag{4.7}
\]

These are qualitative asymptotic constants.  They are not compared with
the independently obtained constant in the prolate-state bound for `q_N`.
Equations (4.3), (4.5), and the triangle inequality reduce the exponent if
necessary and yield

\[
 \boxed{
 \|z_N\|_2\longrightarrow\|J_\infty\|_2>0,
 \qquad
 \|J_\infty-z_N\|_{\mathfrak Z}^2
 \leq Ce^{-c_{\rm ev}\lambda L^2}.}                 \tag{4.8}
\]

At every nontrivial-zero parameter, the samples of `z_N` are the negatives
of the samples of `J_infinity-z_N`.  No term is split after zero sampling.

## 5. Even quasi-null and necessary reserve ratios

Normalize

\[
 v_N={z_N\over\|z_N\|_2}.                            \tag{5.1}
\]

Using the exact factor in (2.5), radical cancellation, and (4.8),

\[
 \begin{aligned}
 r_N^+
 &:=\langle v_N,A^\circ v_N\rangle\\
 &= {2\sum_{\gamma>0}m_\gamma
       |\widehat{(J_\infty-z_N)}(\gamma)|^2
       \over\|z_N\|_2^2}\\
 &= {\|J_\infty-z_N\|_{\mathfrak Z}^2
       \over2\|z_N\|_2^2}
 \leq Ce^{-c_{\rm ev}\lambda L^2}.
 \end{aligned}                                       \tag{5.2}
\]

Min--max proves (0.4).  Under the checkpoint-1.37 strict even hypothesis,
`A_circ-mu*I>0`, and hence (0.7) follows.  In particular,

\[
 \epsilon_+={\mu\over\lambda_{\min}(A^\circ)}
 \geq{\mu\over r_N^+}.                              \tag{5.3}
\]

Equation (5.3) proves (0.5)--(0.6).  It cannot be reversed: one Rayleigh
upper test need not approximate the actual minimum.  Therefore even a proof
that `mu/r_N^+` is small would remain only a necessary compatibility check,
not by itself a sufficient reserve theorem.

For checkpoint 1.38, fix `j` and `eta>0`, and write

\[
 \rho_j=\left({\gamma_j\over\gamma_{j+1}}\right)^2+\eta<1.
                                                               \tag{5.4}
\]

Its sufficient uniqueness hypothesis `delta_+>rho_j` necessarily implies

\[
 \boxed{
 {\mu\over r_N^+}<
 1-\left({\gamma_j\over\gamma_{j+1}}\right)^2-\eta.} \tag{5.5}
\]

The frozen absolute estimates are only

\[
 0\leq\mu\leq q_N
 =O\!\left(e^{-c_q\lambda L^2}\right),
 \qquad
 \lambda_{\min}(A^\circ)\leq r_N^+
 =O\!\left(e^{-c_{\rm ev}\lambda L^2}\right).       \tag{5.6}
\]

Both statements are upper bounds, and `c_q` and `c_ev` are unrelated.
No ordering of their envelopes determines the actual ratio in (5.5).
There is also no frozen positive lower bound for `mu` that would turn the
quasi-null into an actual failure of the reserve.

## 6. Available minor scale and count-only singularity

The anti-carrier odd minor transfers exactly to the even rows.  For

\[
 x_j=\left({\gamma_j\over\alpha}\right)^2,           \tag{6.1}
\]

let `A_Gamma` and `B_Gamma` be the odd and positive-index even evaluation
matrices on the same `N` distinct ordinates.  Their entries are

\[
 \begin{aligned}
 (A_\Gamma)_{jn}
 &= {\sqrt{2L}\over\pi}
    {n\sin(\pi\sqrt{x_j})\over x_j-n^2},\\
 (B_\Gamma)_{jn}
 &= {\sqrt{2L}\over\pi}
    {\sqrt{x_j}\sin(\pi\sqrt{x_j})\over x_j-n^2}.
 \end{aligned}                                       \tag{6.2}
\]

Consequently

\[
 \boxed{
 |\det B_\Gamma|
 ={\prod_{j=1}^N\sqrt{x_j}\over N!}
  |\det A_\Gamma|.}                                  \tag{6.3}
\]

Each even row has squared norm at most `L`.  The same Loewner and determinant
argument therefore gives

\[
 \boxed{
 \lambda_{\min}(A^\circ)
 \geq{2|\det B_\Gamma|^2\over(NL)^{N-1}}}            \tag{6.4}
\]

on any schedule where the selected minor is nonzero.  On the admitted
implicit anti-carrier schedule, the selected band height is at least `N`,
so the factor in (6.3) is at least `(L/(2*pi))^N` and is eventually larger
than one.  The resulting lower estimate is still only

\[
 \lambda_{\min}(A^\circ)
 \geq\exp\{-O(\lambda^2L^7)\}.                       \tag{6.5}
\]

Its exponent is vastly worse than `lambda*L^2`; it is available only on the
implicit zero-dependent schedule and cannot compare (5.6).

The count-compatible lattice model from the odd barrier also transfers to
the even block.  At length `L_k=kL_0`, every lattice-tail carrier row is
supported only in coordinate `km`, or is zero outside the band.  A fixed
finite beginning adds rank at most `J_*`, so

\[
 \operatorname {rank}B_{N_k,+}
 \leq\left\lfloor{N_k\over k}\right\rfloor+J_*<N_k
                                                               \tag{6.6}
\]

eventually.  Thus the corresponding logical even Gram is singular.  This
is not the zeta divisor and does not contradict the separately assumed
finite strictness.  It shows only that critical-line location, the pinned
multiplicity count, its coarse distinctness consequence, and any fixed
HSW-compatible prefix do not supply a quantitative even reserve.

## 7. Relation to the transverse moment-angle obstruction

The earlier transverse vector is

\[
 W_\infty=K_\infty''+m_2K_\infty,
 \qquad
 \widehat W_\infty(0)={m_2\Xi(0)\over4}\ne0.         \tag{7.1}
\]

It is projected off the actual prolate anchor and tested against
`B=P_K(Q-qI)P_K` on that anchor complement.  Deleting its central Fourier
coordinate directly would introduce a coefficient of order `L^(-1/2)`,
not the exponentially small endpoint term (4.3).

The present vector uses the exact central-cancelled combination

\[
 \boxed{K_\infty''=W_\infty-m_2K_\infty.}            \tag{7.2}
\]

This is why it enters the coordinate complement `e_0^perp` with only the
finite endpoint correction.  The operator, complement, normalization, and
quantitative conclusion are different.  The previous moment-angle theorem
therefore does not already prove (0.4), although its source identities make
the cancellation (7.2) transparent.

## 8. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. turns the upper bound `lambda_min(A_circ)<=r_N^+` into a lower bound;
2. compares `c_q` and `c_ev` without a new relative theorem;
3. treats (0.5) or (0.6) as sufficient rather than necessary;
4. identifies `A_circ` with the prolate-anchor complement;
5. omits the exact finite central coefficient before using `K_infinity''`;
6. drops the factor `1/2` in (2.5) or replaces multiplicity by jets;
7. treats the lattice model as the actual zeta divisor; or
8. infers shifted-node uniqueness, determinant convergence, RH, a converse
   from RH, or a de Bruijn--Newman `Lambda` bound.

The remaining live input is a cancellation-preserving relative estimate
for `mu/lambda_min(A_circ)`, strong enough for (5.4), or the still stronger
`o(1/L)` estimate.  Absolute Gevrey smallness on both sides does not provide
that comparison.
