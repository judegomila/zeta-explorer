# Safe-Herglotz factorization and an actual-source Schur obstruction

## 0. Claim boundary and outcome

This note tests the most direct Herglotz route suggested by the exact
tail-discrepancy identity

\[
 \int_0^\infty\left(\mathcal F_\infty(t)-{c_*\over2}\right)
 e^{-st}\,dt
 =-{1\over s}{\xi'\over\xi}\!\left({1\over2}+s\right),
 \qquad \Re s>{1\over2}.                              \tag{0.1}
\]

It gives one positive and one negative conclusion.

1. The derivative transfer function in (0.1) is positive real throughout
   the source-safe half-plane.  This gives an unconditional positive
   Fourier-multiplier Gram after a damping larger than one half.
2. That Gram does not sign the undamped live-shift form.  In fact, for the
   **actual independently assembled source matrix** at
   `lambda=2, N=4`, an exact rational even state has a positive transverse
   compression and a positive derivative direction, but fails both the
   `q`-shift Schur gate and the weaker two-dimensional Ritz-`u` gate.

The finite witness is not the source-normalized projected prolate state.  It
is therefore a route obstruction, not a counterexample to the proposed
prolate schedule.  It proves no asymptotic sign, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant limit, or Riemann-hypothesis conclusion.
The formal project state remains `P0_INVALIDATED`.

All finite entries below come from the source-pinned CCM matrix with the
minus sign on the prime block and every prime power through
`n<=lambda^2`.  The two formula trees are the existing 256- and 512-bit
FLINT/Arb producer and direct-distribution verifier outputs.  They are
independent assemblies but share the FLINT/Arb library family.

## 1. What the safe-half-plane transform really signs

Put

\[
 \Xi_c(s)=\xi\!\left({1\over2}+s\right),\qquad
 H(s)={\Xi_c'(s)\over\Xi_c(s)},\qquad
 g(t)=\mathcal F_\infty(t)-{c_*\over2}.              \tag{1.1}
\]

Thus (0.1) is `L g=-H/s`.  Let `Z_c` be the centered nontrivial-zero
multiset and choose one representative `z_p` from each `+-` orbit.  The
paired Hadamard product already used in
`notes/CENTERED_ZERO_BOUNDARY_CONVOLUTION_OBSTRUCTION.md` gives

\[
 H(s)=\sum_{\mathfrak p}
 \left({1\over s-z_{\mathfrak p}}+{1\over s+z_{\mathfrak p}}\right)
 =\sum_{\mathfrak p}{2s\over s^2-z_{\mathfrak p}^2}. \tag{1.2}
\]

The paired series is locally absolutely convergent.  Write
`s=sigma+i tau` and `z_p=beta+i gamma`.  Since every centered zero obeys
`|beta|<1/2`, for `sigma>=1/2` one has term by term

\[
\begin{aligned}
 \Re\left({1\over s-z_{\mathfrak p}}
          +{1\over s+z_{\mathfrak p}}\right)
 ={}&{\sigma-\beta\over
        (\sigma-\beta)^2+(\tau-\gamma)^2}\\
 &+{\sigma+\beta\over
        (\sigma+\beta)^2+(\tau+\gamma)^2}>0.          \tag{1.3}
\end{aligned}
\]

Consequently

\[
 \boxed{\Re H(s)>0\quad(\Re s\geq1/2).}              \tag{1.4}
\]

For every `sigma>=1/2` and every Schwartz function `phi`, (1.4) defines the
honest finite positive quadratic form

\[
 \boxed{
 \mathcal P_\sigma[\phi]
 ={1\over2\pi}\int_{\mathbb R}
 2\Re H(\sigma+i\tau)|\widehat\phi(\tau)|^2\,d\tau
 \geq0.}                                             \tag{1.5}
\]

This is the positive-real factorization supplied by the safe Laplace
identity.  It belongs to the **derivative transfer** `-s Lg=H`, with the
safe exponential displacement `sigma`; it is not the undamped correlation
form in equation (3.8) of
`notes/TAIL_DISCREPANCY_TRANSVERSE_SCHUR_NORMAL_FORM.md`.

The stopping line is exact.  The following are equivalent:

\[
\begin{array}{ll}
\text{(i)}&H\text{ is holomorphic and positive real on }\Re s>0;\\
\text{(ii)}&\text{every centered nontrivial zero has }\Re z=0.
\end{array}                                           \tag{1.6}
\]

Indeed, a centered zero with positive real part is a pole of `H` in the
right half-plane.  Conversely, if every centered zero is imaginary, both
reciprocals in every summand of (1.2) have positive real part for
`Re(s)>0`; local absolute convergence gives (i).  Functional-equation
symmetry turns absence of positive-real-part centered zeros into (ii).
Thus continuing this particular Herglotz factorization from the safe line
to every positive damping is equivalent to the zero-location target; it is
not an unconditional way around it.

## 2. An exact rational state in the actual source matrix

Take

\[
 \lambda=2,\qquad L=2\log2,\qquad N=4.                \tag{2.1}
\]

In the full source Fourier basis `V_-4,...,V_4`, define

\[
\begin{aligned}
 v={}&702V_0-484(V_1+V_{-1})
       +139(V_2+V_{-2})-4(V_3+V_{-3}),\\
 \|v\|^2={}&999990,\qquad \kappa={v\over\sqrt{999990}}.
                                                               \tag{2.2}
\end{aligned}
\]

This state is exactly inversion even.  Its unnormalized endpoint sum is
`4`, not zero, and its derivative is nonzero.  Put

\[
 q=\langle\kappa,Q_+\kappa\rangle,qquad
 r_+=(Q_+-qI)\kappa,qquad r^2=\|r_+\|^2.             \tag{2.3}
\]

When `r>0`, let `u` be the lower eigenvalue of the compression of `Q_+` to
`span{kappa,r_+}`.  This is the two-dimensional Ritz upper bound used in
`DIRECT_RH_ATTACK.md`:

\[
 u={q+c-\sqrt{(c-q)^2+4r^2}\over2}<q,qquad
 c={\langle r_+,Q_+r_+\rangle\over r^2}.             \tag{2.4}
\]

For odd coordinates use the unnormalized basis

\[
 w_n=V_n-V_{-n},\qquad 1\leq n\leq4.                 \tag{2.5}
\]

If `A` is the odd source matrix in this basis, then

\[
 A_{nm}=Q_{nm}-Q_{n,-m}-Q_{-n,m}+Q_{-n,-m},qquad
 \left\|\sum t_nw_n\right\|^2=2\sum t_n^2.          \tag{2.6}
\]

The derivative direction is proportional to

\[
 c_0=(-242,139,-6,0)^T.                              \tag{2.7}
\]

An exact basis of its orthogonal complement is

\[
 g_1=(3,0,-121,0)^T,quad
 g_2=(0,6,139,0)^T,quad
 g_3=(0,0,0,1)^T.                                   \tag{2.8}
\]

Write `G=(g_1,g_2,g_3)`, `S_q=A-2qI`, and

\[
 B_q=G^TS_qG.                                        \tag{2.9}
\]

The factor two in `S_q` is the norm convention in (2.6), not an extra
spectral normalization.

## 3. Interval-certified failure at both live shifts

The focused replay parses the raw midpoint/radius lines as exact rational
decimals and recomputes every quantity below.  It does not trust producer
booleans.  Both independent paths and both precisions give the strict
enclosures

\[
 4.7894\,10^{-6}<q<4.7895\,10^{-6},                  \tag{3.1}
\]

\[
 11.459<c_0^TS_qc_0<11.460.                           \tag{3.2}
\]

The three leading Sylvester minors of `B_q` obey

\[
\begin{aligned}
 38505&<d_1<38506,\\
 36150&<d_2<36151,\\
 2906&<d_3<2907.
\end{aligned}                                        \tag{3.3}
\]

Hence `B_q>0`, while the derivative direction in (3.2) is also positive.
Nevertheless,

\[
 -3.725\,10^{-8}<\det S_q<-3.724\,10^{-8}.           \tag{3.4}
\]

The exact change-of-basis determinant is

\[
 \det(c_0,G)=-233763.                                 \tag{3.5}
\]

Since `det(B_q)>0`, (3.4)--(3.5) give the coordinate Schur short

\[
\begin{aligned}
 \mathscr S_q
 ={}&c_0^TS_qc_0
 -c_0^TS_qG(B_q)^{-1}G^TS_qc_0,\\
 &\boxed{-0.701<\mathscr S_q<-0.700.}                 \tag{3.6}
\end{aligned}
\]

Thus the inverse load, not either diagonal block, defeats the `q`-shift
gate.

The direct bridge uses the easier shift `u<q`, so failure at `q` alone is
not enough.  To test the actual Ritz shift, take the rational odd vector

\[
 z=8847w_1-4657w_2+162w_3+87w_4                    \tag{3.7}
\]

and let `R=<z,Q_-z>/||z||^2`.  The ball replay proves

\[
 3.0460\,10^{-7}<R<3.0461\,10^{-7}.                  \tag{3.8}
\]

No square root is needed to compare `R` with `u`.  In the orthogonal basis
`{kappa,r_+}`, the generalized Ritz pencil shifted by `R` is

\[
 \begin{pmatrix}
 q-R&r^2\\
 r^2&\langle r_+,Q_+r_+\rangle-Rr^2
 \end{pmatrix}                                      \tag{3.9}
\]

against the metric `diag(1,r^2)`.  The replay proves

\[
\begin{aligned}
 4.4848\,10^{-6}&<q-R<4.4849\,10^{-6},\\
 3.4794\,10^{-6}&<r^2<3.4796\,10^{-6},\\
 2.9063\,10^{-6}
 &<\langle r_+,Q_+r_+\rangle-Rr^2<2.9065\,10^{-6},\\
 9.279\,10^{-13}&<\det(3.9)<9.280\,10^{-13}.
                                                               \tag{3.10}
\end{aligned}
\]

Both leading minors in (3.9) are positive, so the entire two-dimensional
even Ritz compression lies strictly above `R`.  In particular,

\[
 \boxed{R<u<q.}                                       \tag{3.11}
\]

It follows that `Q_- -uI` has a negative value on the explicit vector `z`.
At the same time, with `t=q-u>0`,

\[
 B_u=B_q+2tG^TG>0,\qquad
 c_0^T(A-2uI)c_0=c_0^TS_qc_0+2t\|c_0\|^2>0.         \tag{3.12}
\]

Therefore the exact `u`-shift Schur short is also negative.  This conclusion
uses the accompanying even Ritz block; it is not inferred merely from the
failure at `q`.

## 4. What the obstruction excludes

The safe positive-real identity (1.4), actual cumulative discrepancy,
source Cauchy commutator, inversion parity, a nonzero endpoint, a positive
derivative direction, and a positive transverse compression do not imply
the inverse-weighted Schur inequality at either live shift.  A successful
proof for the direct attack must use a property special to the
source-normalized projected prolate state and control its actual Ritz
correction; a state-independent passivity or conditional-positive-kernel
argument cannot close the gate.

The witness does not show that the projected prolate state fails on any
unbounded schedule.  It also does not rule out a different factorization
that uses its exact radical divisor, prolate flatness, and arithmetic phase
together.  Those remain the relevant source-specific possibilities.
