# Positive Xi kernel, Fejer state, and ground-transfer audit

## 0. Claim boundary and outcome

This note asks whether positivity of the locked limiting arithmetic state can
replace the still-missing shifted odd-sector estimate.  It has four exact
conclusions.

1. The locked function

   \[
   K(t)=E(h)(e^t),\qquad
   h(x)={\pi\over2}x^2(2\pi x^2-3)e^{-\pi x^2},
   \]

   is strictly positive for every real `t`.  This uses only the locked
   arithmetic sum and its exact Poisson inversion symmetry.
2. Ordinary centered Fourier projection does not preserve this positivity.
   For every fixed odd degree, its value at the endpoint is eventually
   negative as the logarithmic window grows.  In contrast, the Fejer mean,
   or any normalized nonnegative Jackson kernel, gives a strictly positive
   inversion-even finite trigonometric state.  A diagonal choice of degrees
   retains the locked locally uniform transform limit `Xi/4`, without unit
   normalization.
3. Positivity of that finite comparison state does not enter the existing
   odd-inertia equivalence.  That equivalence applies to the actual simple
   even ground eigenvector.  Applied to a non-eigenvector, the source
   commutator has an exact residual defect amplified by the Fourier-mode
   operator and by inverse boundary normalization.
4. Ordinary `L2` approximation, even together with a vanishing Ritz
   residual and a fixed spectral gap, cannot transfer all-imaginary-axis
   positivity to the ground vector.  An exact family below has a positive
   comparison state, squared error `4/M`, squared residual
   `4M/(M+4)^2`, and unit ground gap, while the boundary-normalized ground
   transform is strictly negative at a declared imaginary height.

Thus positive Fejer states are legitimate alternative finite comparison
states, but positivity alone proves neither the live shifted Schur gate nor
the odd-sector sign.  The exact missing input is a **boundary-normalized
relative uniform ground estimate**, followed separately by the Ritz-shift
reserve.  No such source-specific estimate is proved here.

The pole, archimedean, and minus-prime blocks of the finite Weil matrix are
not modified.  No zeta-zero list, global Weil positivity, determinant limit,
equation (5.2), or Riemann-hypothesis conclusion is used.  The formal project
state remains `P0_INVALIDATED`.

## 1. Exact positivity of the locked limiting state

Put `u=exp(t)`.  For `t>=0`, one has `u>=1`, and the locked arithmetic
formula is

\[
 K(t)=u^{1/2}\sum_{m\geq1}h(mu).                    \tag{1.1}
\]

Every summand in (1.1) is strictly positive.  Indeed, `mu>=1` and

\[
 2\pi (mu)^2-3\geq2\pi-3>0.                        \tag{1.2}
\]

The Gaussian makes the sum absolutely convergent, and already the `m=1`
term is positive.  Hence `K(t)>0` for `t>=0`.

The locked Hermite combination is additive-Fourier invariant and satisfies

\[
 h(0)=0,\qquad \int_{\mathbb R}h(x)\,dx=0.
\]

Poisson summation therefore has no endpoint correction and gives the exact
inversion formula

\[
 E(h)(u)=E(h)(u^{-1}).                              \tag{1.3}
\]

Consequently `K(-t)=K(t)`, and (1.1)--(1.3) prove

\[
 \boxed{K(t)>0\quad(t\in\mathbb R).}                \tag{1.4}
\]

The same Gaussian estimate shows that

\[
 \int_{\mathbb R}K(t)e^{\eta|t|}\,dt<\infty
 \quad\hbox{for every fixed }\eta\geq0.             \tag{1.5}
\]

In particular, `K` is integrable and its integral is strictly positive.
No statement about a zero of zeta is involved.

## 2. Why the orthogonal projection is not positivity preserving

Let `a=log(lambda)`, `L=2a`, restrict `K` to `[-a,a]`, and identify the
endpoints periodically.  This is continuous because `K(-a)=K(a)`.  Let
`P_N^(a)` be the centered orthogonal projection onto modes `|n|<=N`.
With

\[
 D_N(\theta)=\sum_{n=-N}^N e^{in\theta},
\]

the endpoint value is exactly

\[
 (P_N^{(a)}K)(a)
 ={1\over L}\int_{-a}^a
 K(s)D_N\!\left(\pi- {\pi s\over a}\right)ds.       \tag{2.1}
\]

Fix `N` and let `a` tend to infinity.  The Dirichlet kernel is bounded for
fixed `N`, while (1.5) supplies an integrable dominating function.  Dominated
convergence gives

\[
 \lim_{a\to\infty}L(P_N^{(a)}K)(a)
 =D_N(\pi)\int_{\mathbb R}K(s)\,ds
 =(-1)^N\int_{\mathbb R}K(s)\,ds.                  \tag{2.2}
\]

The last integral is positive.  Therefore, for every fixed odd `N`,

\[
 \boxed{(P_N^{(a)}K)(a)<0\quad\hbox{for all sufficiently large }a.}
                                                               \tag{2.3}
\]

This is a refutation of positivity preservation, not a claim that every
possible growing-degree orthogonal schedule is negative.  Such a schedule
would require its own pointwise certificate.

## 3. A strictly positive finite Fejer state

Define the Fejer kernel

\[
 F_N(\theta)={1\over N+1}
 \left({\sin((N+1)\theta/2)\over\sin(\theta/2)}\right)^2
 =\sum_{|n|\leq N}\left(1-{|n|\over N+1}\right)e^{in\theta},
                                                               \tag{3.1}
\]

with the continuous value `F_N(0)=N+1`.  It is nonnegative and has circle
average one.  Set

\[
 p_{a,N}(t)={1\over L}\int_{-a}^a
 F_N\!\left({2\pi(t-s)\over L}\right)K(s)\,ds.       \tag{3.2}
\]

Then `p_(a,N)` lies exactly in the source finite mode space `E_N`.  Because
`K(s)>0` everywhere and `F_N` is nonnegative and nonzero almost everywhere,

\[
 \boxed{p_{a,N}(t)>0\quad(-a\leq t\leq a).}          \tag{3.3}
\]

Both factors in the periodic convolution are even, so `p_(a,N)` is
inversion even.  Formula (3.2) is linear and no unit normalization has been
introduced: it retains the scalar of the locked `K`.

The same conclusion holds for a Jackson kernel.  For example, normalize
`F_m^2` to have circle average one and take `2m<=N`.  Its convolution with
`K` is a strictly positive even state in `E_N`.

There is also a clean limiting statement.  For each fixed `a`, Fejer's
theorem gives uniform convergence of (3.2) to the continuous periodic
restriction of `K`.  Choose any `a_j -> infinity`, and then choose `N_j`
large enough that

\[
 \|p_{a_j,N_j}-K\|_{L^\infty([-a_j,a_j])}
 \leq e^{-a_j^2}.                                   \tag{3.4}
\]

After zero extension, for every fixed `eta>=0` and every `z` with
`|Im z|<=eta`,

\[
\begin{aligned}
 |\widehat p_{a_j,N_j}(z)-\widehat K(z)|
 &\leq 2a_j e^{\eta a_j-a_j^2}
   +\int_{|t|>a_j}K(t)e^{\eta|t|}\,dt\\
 &\longrightarrow0.                                \tag{3.5}
\end{aligned}
\]

Thus the convergence is locally uniform in `z`, and the locked
normalization audit gives

\[
 \widehat p_{a_j,N_j}(z)\longrightarrow
 \widehat K(z)={\Xi(z)\over4}.                      \tag{3.6}
\]

This is an existence diagonal, not an effective low-cost schedule.  It does
show that positivity and the correct limiting scalar are compatible in a
finite state.

## 4. Why comparison positivity is not ground positivity

Use the centered source modes

\[
 \phi_n(t)=(-1)^nL^{-1/2}e^{2\pi int/L}.
\]

Every mode has value `L^(-1/2)` at `t=a`.  Hence, for any finite state `p`,

\[
 c_p:=\langle\eta,p\rangle=\sqrt L\,p(a).            \tag{4.1}
\]

For the Fejer state, `c_p>0` and `p/c_p` is pointwise positive.  Its
imaginary-axis transform is therefore positive.  But the equivalence in
`EVEN_GROUND_IMAGINARY_AXIS_ODD_INERTIA.md` is an equivalence for the
**actual simple even ground eigenvector** `x`, not for an arbitrary positive
trial state.

The obstruction is visible directly in the source commutator.  Let

\[
 \mathcal DQ_+-Q_-\mathcal D
 =|\beta\rangle\langle\eta|,                        \tag{4.2}
\]

take any even trial state `p` with `c_p!=0`, choose any scalar `v`, and put

\[
 \rho=(Q_+-vI)p.
\]

Applying (4.2) to `p` gives the exact defective eigenvector identity

\[
 \boxed{
 (Q_--vI){\mathcal Dp\over c_p}
 ={\mathcal D\rho\over c_p}-\beta.}                 \tag{4.3}
\]

For the ground eigenvector, `rho=0`, and (4.3) is the identity from which
the rank-one pencil and odd-inertia equivalence are derived.  For a trial
state, the extra term has no sign.  Since `||mathcal D||=N`, its elementary
bound is only

\[
 \left\|{\mathcal D\rho\over c_p}\right\|
 \leq {N\|\rho\|\over|c_p|}.                       \tag{4.4}
\]

Thus an ordinary small residual is not the missing estimate: high modes and
a small boundary value can amplify it.

Nor does pointwise positivity enter the live shifted Schur criterion.  For
a comparison state `kappa`, that criterion still requires

\[
 B_U\succ0,\qquad
 a_U-\langle c_U,B_U^{-1}c_U\rangle>0,              \tag{4.5}
\]

for the complete source matrix `Q=pole-archimedean-prime`, with the source
minus sign on the prime block.  Positivity of `kappa(t)` supplies neither
inequality in (4.5).

## 5. The exact relative estimate that would transfer positivity

Suppose `x` is the actual simple even ground vector and orient it so that
`c_x=<eta,x>>0`.  Let `p` be any strictly positive even comparison state
with `c_p>0`, and define

\[
 m_p=\min_{|t|\leq a}{p(t)\over c_p}>0.              \tag{5.1}
\]

For every `f in E_N`, Cauchy--Schwarz in the orthonormal Fourier basis gives

\[
 \|f\|_\infty\leq
 \sqrt{{2N+1\over L}}\,\|f\|_2.                    \tag{5.2}
\]

Consequently the exact sufficient transfer estimate is

\[
 \boxed{
 \sqrt{{2N+1\over L}}
 \left\|{x\over c_x}-{p\over c_p}\right\|_2<m_p.} \tag{5.3}
\]

Under (5.3), `x/c_x` is strictly positive pointwise, so its transform is
positive on the whole imaginary axis.  Subject to the nonvanishing
hypotheses in the ground-inertia theorem, this proves
`Q_- - epsilon I > 0`.

Estimate (5.3) is boundary normalized and relative to the positivity
reserve.  A unit-vector angle or an unnormalized `o(1)` error does not imply
it.  Even after (5.3), the direct bridge compares the odd block with a Ritz
upper value `U>=epsilon`; the separate quantitative reserve

\[
 U-\epsilon<\lambda_{\min}(Q_--\epsilon I)           \tag{5.4}
\]

is still required.  The explicit sufficient version in the existing
ground-inertia note may be used, but neither (5.3) nor (5.4) follows from
Fejer positivity.

## 6. Exact no-go for ordinary approximation and residual bounds

The failure is not merely a concern about constants.  Fix `M>=1`, take a
finite even space containing modes through `17M`, and define real symmetric
coefficients

\[
 \xi_n=
 \begin{cases}
 -1/M,&M<n\leq2M,\\
 +1/M,&16M<n\leq17M,\\
 0,&\text{otherwise}.
 \end{cases}                                         \tag{6.1}
\]

Put

\[
 f_M=\phi_0+\sum_{n\geq1}\xi_n(\phi_n+\phi_{-n}),
 \qquad p=\phi_0.                                    \tag{6.2}
\]

The positive and negative coefficient blocks each have total magnitude one,
so

\[
 f_M(a)=p(a)=L^{-1/2},\qquad
 \|f_M-p\|_2^2={4\over M},\qquad
 \|f_M\|_2^2=1+{4\over M}.                          \tag{6.3}
\]

The boundary-normalized imaginary-axis factor of `f_M` is

\[
 A_M(\alpha)=1-2\sum_{n\geq1}
 {n^2\xi_n\over n^2+\alpha^2}.                     \tag{6.4}
\]

At `alpha=0`, the two coefficient blocks cancel and `A_M(0)=1`.  At
`alpha=4M`, every low-block weight is at most `1/5`, while every high-block
weight is strictly greater than `16/17`.  Therefore

\[
 \sum_{n\geq1}{n^2\xi_n\over n^2+16M^2}
 >{16\over17}-{1\over5}={63\over85},
\]

and hence

\[
 \boxed{A_M(4M)<-{41\over85}<0.}                    \tag{6.5}
\]

The positive prefactor in the source transform formula shows that
`f_M` has negative imaginary-axis transform at
`sigma=8*pi*M/L`, although it converges in `L2` to the strictly positive
state `p`.

This can also be made an exact residual--gap counterexample.  Let

\[
 x_M={f_M\over\sqrt{1+4/M}},\qquad
 Q_{+,M}=I-|x_M\rangle\langle x_M|.                 \tag{6.6}
\]

The ground eigenvalue is simple and equal to zero, and the rest of the
spectrum is exactly one.  For the positive unit trial state `p=phi_0`,

\[
 q_M=\langle p,Q_{+,M}p\rangle={4\over M+4},         \tag{6.7}
\]

\[
 \boxed{
 \|(Q_{+,M}-q_MI)p\|_2^2
 =q_M(1-q_M)={4M\over(M+4)^2}.}                     \tag{6.8}
\]

Thus the trial residual divided by the unit ground gap tends to zero, while
the boundary-normalized ground vector `x_M/<eta,x_M>=f_M` fails the
all-imaginary-axis sign by (6.5).

The family (6.6) is an abstract exact Hermitian even-block model, not the
arithmetic source matrix.  Its role is precise: no argument using only
ordinary Hilbert-space approximation, residual size, and a spectral gap can
prove the desired ground positivity.  A successful arithmetic argument must
use additional source structure to establish a relative estimate such as
(5.3), control the commutator defect (4.3), and then prove the independent
shift reserve (5.4).

## 7. Resulting route boundary

The locked kernel provides a genuine positive comparison object, and Fejer
averaging gives a rigorous positive finite realization with the correct
limiting scalar.  This may be useful as a diagnostic alternative to the
orthogonal prolate projection.  It does not replace the source-normalized
prolate state required by proof item zero, and it loses the orthogonal
Pythagorean projection identity used in the present leakage analysis.

The smallest new theorem that would make positivity relevant to the direct
bridge is therefore source-specific: prove (5.3), or an equivalent direct
all-imaginary-axis inequality for the actual even ground line, on an
unbounded schedule; then separately prove the shifted margin (5.4).  The
ordinary projection, approximation, and residual estimates currently in the
repository do not supply either statement.
