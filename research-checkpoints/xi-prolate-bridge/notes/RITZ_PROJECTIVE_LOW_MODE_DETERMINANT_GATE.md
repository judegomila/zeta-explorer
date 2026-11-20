# Ritz projective low-mode determinant gate

## 0. Scope and exact outcome

This note combines two finite results without strengthening either one's
hypotheses:

1. the mandatory Ritz moment gives a residual-ridged Loewner bound for the
   coefficient-normalized ground graph; and
2. the projective low-mode bridge needs only a low Fourier approximation,
   while a bounded high-mode graph may be discarded by the exact centered
   Fourier estimate.

The resulting observable is a positive finite determinant increment for the
*ambient symmetric Fourier cutoff*.  Let `Pi_M` denote the orthogonal
projection onto the modes `|n|<=M`.  Its complement compression is

\[
 K_M=W^*\Pi_MW,
\]

but the source-Cauchy homotopy is the full ambient homotopy

\[
 \boxed{Q+t\Pi_M.}                                  \tag{0.1}
\]

It is not the complement-only perturbation
`Q+t W K_M W^*`.  The full perturbation retains mandatory anchor and cross
terms in the Schur scalar.

For fixed `theta>0`, the finite gate is

\[
 \boxed{
 \|\Pi_M(\gamma^{-1}\xi-\kappa)\|^2
 \leq {A_{\rm R}(d/r)\over\log(1+\theta)}
       {\cal F}_{\theta,M}.}                        \tag{0.2}
\]

Here `xi` is the exact unit ground vector, `gamma=<kappa,xi>>0`, and

\[
 {\cal F}_{\theta,M}
 =\log {\det(B+rI+\theta rK_M)\over\det(B+rI)}.     \tag{0.3}
\]

Together with the exact high-mode transform estimate, (0.2) yields a
projective locally uniform characteristic-function criterion.  With
`M=ceil(lambda)`, bounded `d/r`, and the already proved projection and
normalization estimates, the concrete sufficient response rate is

\[
 \boxed{A_{\rm R}(d/r){\cal F}_{\theta,M}
        =O(\lambda^{-1}).}                          \tag{0.4}
\]

This is a sufficient localized trace gate, not a necessary one.  It does not
prove its response rate, either shifted sector sign, equation (5.2) of
`DIRECT_RH_ATTACK.md`, or a locally uniform limit for the actual source
matrices.  No zero table or global Weil positivity is used.  The formal
project state remains `P0_INVALIDATED`.

All actual-source specializations retain the interval
`[-L/2,L/2]`, `L=2 log(lambda)`, Lebesgue measure, zero extension,
reflection as inversion, the Fourier sign

\[
 \widehat f(z)=\int_{-L/2}^{L/2}f(x)e^{-izx}\,dx,
\]

every prime power `1<n<=lambda^2`, and the minus sign on the prime block.
The pole, archimedean, and minus-prime blocks are combined before an inverse,
determinant, or absolute value is formed.  The source-normalized prolate state
is not replaced by a unit-normalized state.

## 1. Ritz graph and its exact projective scale

Let `Q=Q*` commute with the self-adjoint unitary inversion `J`.  Let `kappa`
be a real unit even vector and write the even restriction, relative to
`C kappa direct-sum K`, as

\[
 Q_+=\begin{pmatrix}q&b^*\\ b&A\end{pmatrix},
 \qquad r=\|b\|.                                    \tag{1.1}
\]

An isometry `W` identifies the coordinate complement with
`K=H_+ intersect kappa^perp`; thus ambient complementary vectors are `Wz`.
When `r>0`, let `u` be the lower Ritz value on
`span{kappa,b/r}`.  Choose

\[
 u\leq U\leq q,
 \qquad d=q-U,
 \qquad B=A-UI\succ0,                               \tag{1.2}
\]

and require the independent odd sign

\[
 Q_--UI\succ0.                                     \tag{1.3}
\]

These signs make the global ground simple and even.  Write its value as
`mu=U-h`, `h>=0`.  After choosing phase, its unit vector has the exact graph
form

\[
 \boxed{
 \xi=\gamma(\kappa-Wz),
 \qquad z=(B+hI)^{-1}b,
 \qquad \gamma=(1+\|z\|^2)^{-1/2}>0.}              \tag{1.4}
\]

Consequently the zero-preserving projective scalar `s=gamma^(-1)` gives

\[
 \boxed{d_{\rm pr}:=s\xi-\kappa=-Wz.}              \tag{1.5}
\]

This identity is why no separate lower bound on
`||Pi_M xi||` is needed.  It also shows where the source scale enters later:
if `p=P_N k_lambda^+=a kappa`, then

\[
 as\xi-p=a d_{\rm pr}.                              \tag{1.6}
\]

For `delta=d/r`, the Ritz-moment theorem gives

\[
 zz^*\preceq A_{\rm R}(\delta)r(B+rI)^{-1},
 \qquad \|z\|^2\leq C_{\rm R}(\delta)^2,           \tag{1.7}
\]

where

\[
 A_{\rm R}(\delta)=
 \begin{cases}
  1+\delta+\tfrac12\delta(1+\delta)^2,&0\leq\delta\leq1,\\
  1+\delta+2\delta^2,&\delta\geq1,
 \end{cases}                                       \tag{1.8}
\]

and, for `delta>0` and `alpha=delta^(-2)`,

\[
 C_{\rm R}(\delta)^2=
 \begin{cases}
  1+2/\alpha,&0<\alpha\leq\tfrac12,\\[1mm]
  1+\displaystyle{4(2\sqrt{1+6\alpha}-1)
       \over3(\sqrt{1+6\alpha}-1)^2},&\alpha\geq\tfrac12.
 \end{cases}                                       \tag{1.9}
\]

At `delta=0`, set `A_R(0)=C_R(0)=1`.  These conventions apply when
`r>0`.  The exact `r=0` branch is treated separately in Section 6.

## 2. Positive low-mode determinant gate

Use the centered modes

\[
 \phi_n(x)={(-1)^n\over\sqrt L}e^{2\pi inx/L},
 \qquad |n|\leq N,                                  \tag{2.1}
\]

and let `Pi_M` be the symmetric cutoff `|n|<=M`, with

\[
 \boxed{1\leq M<N.}                                \tag{2.2}
\]

It is an orthogonal projection commuting with both the mode operator and
inversion.  Its complement compression

\[
 K_M=W^*\Pi_MW                                     \tag{2.3}
\]

is a positive contraction, even though it need not itself be a projection.
Put

\[
 D=B+rI,
 \qquad X_M=rD^{-1/2}K_MD^{-1/2}.                  \tag{2.4}
\]

Then `0<=X_M<=I`, and for fixed `theta>0`,

\[
 \begin{aligned}
 {\cal H}_M&=\operatorname {tr}X_M
 =r\operatorname {tr}(D^{-1}K_M),\\
 {\cal F}_{\theta,M}
 &=\operatorname {tr}\log(I+\theta X_M)
 =\log{\det(D+\theta rK_M)\over\det D}.
 \end{aligned}                                      \tag{2.5}
\]

The chord inequality for `0<=x<=1` is

\[
 \log(1+\theta)x\leq\log(1+\theta x)\leq\theta x.
                                                               \tag{2.6}
\]

### Theorem 2.1 (finite Ritz projective cutoff gate)

Under (1.1)--(1.3), with `r>0`, `1<=M<N`, and fixed `theta>0`,

\[
 \boxed{
 \begin{aligned}
 \|\Pi_Md_{\rm pr}\|^2
 &=\langle z,K_Mz\rangle\\
 &\leq A_{\rm R}(d/r){\cal H}_M\\
 &\leq {A_{\rm R}(d/r)\over\log(1+\theta)}
          {\cal F}_{\theta,M},                     \tag{2.7}\\
 \|(I-\Pi_M)d_{\rm pr}\|
 &\leq C_{\rm R}(d/r).                             \tag{2.8}
 \end{aligned}}
\]

**Proof.**  Equation (1.5), orthogonality of `Pi_M`, and (2.3) give

\[
 \|\Pi_Md_{\rm pr}\|^2
 =\|\Pi_MWz\|^2=\langle z,K_Mz\rangle.
\]

Taking the trace of (1.7) against the positive matrix `K_M` proves the
second line of (2.7).  Summing the left chord in (2.6) over the eigenvalues
of `X_M` proves the third line.  Finally, (1.5), contractivity of
`I-Pi_M`, and (1.7) prove (2.8).  \(\square\)

The square in (2.7) is essential.  If a weight `w_j` and positive bounds
`Y_j` satisfy only `w_j Y_j->0`, it need not follow that
`w_j sqrt(Y_j)->0`; take `w_j=j` and `Y_j=j^(-2)`.  Thus the low-mode rate
below contains the square of the compact-transform weight.

The divisor `log(1+theta)` is also essential if `theta` varies.  For a
fixed nonzero eigenvalue `x`,

\[
 {\log(1+\theta x)\over\log(1+\theta)}\longrightarrow x
 \quad(\theta\downarrow0),                          \tag{2.9}
\]

whereas the numerator alone tends to zero.

## 3. Full compact Xi error and sufficient rates

Let `lambda_j->infinity`, `L_j=2 log(lambda_j)`, and let

\[
 k_j=k_{\lambda_j}^+,
 \quad p_j=P_{N_j}k_j,
 \quad a_j=\|p_j\|>0,
 \quad \kappa_j=p_j/a_j.                            \tag{3.1}
\]

Assume the finite signs (1.2)--(1.3), and let `xi_j`, `gamma_j`, and
`d_(pr,j)` be given by (1.4)--(1.5).  The zero-preserving entire function is

\[
 \mathscr X_j(z)=4a_j\gamma_j^{-1}\widehat\xi_j(z). \tag{3.2}
\]

It has the same zeros as the source determinant associated with the simple
even ground.  Put

\[
 e_j=\|P_{N_j}k_j-k_j\|.                            \tag{3.3}
\]

For a compact rectangle

\[
 \mathcal K_{B,\eta}=\{z:|\operatorname {Re}z|\leq B,
                              |\operatorname {Im}z|\leq\eta\},
 \qquad T=\sqrt{B^2+\eta^2},                        \tag{3.4}
\]

require eventually

\[
 {2\pi(M_j+1)\over L_j}\geq2T.                    \tag{3.5}
\]

The exact centered Fourier estimate and Theorem 2.1 give

\[
 \boxed{
 \begin{aligned}
 \sup_{z\in\mathcal K_{B,\eta}}
 |\mathscr X_j(z)-4\widehat k_j(z)|
 \leq{}&4\sqrt{L_j}\lambda_j^\eta e_j\\
 &+4a_j\sqrt{L_j}\lambda_j^\eta
   \left({A_{\rm R}(d_j/r_j){\cal F}_{\theta,M_j}
                 \over\log(1+\theta)}\right)^{1/2}\\
 &+{8\sqrt2\over\pi}a_j\lambda_j^\eta
      \sqrt{L_j\over M_j}\,C_{\rm R}(d_j/r_j).
                                                               \tag{3.6}
 \end{aligned}}
\]

No hidden unit normalization is present: `a_j` is the norm of the locked
source-normalized projected state.

### Theorem 3.1 (Ritz projective determinant criterion)

Suppose `theta>0` is fixed, `1<=M_j<N_j`, (3.5) holds eventually on every
fixed compact rectangle, and the simple-even signs hold.  If, for every
fixed `eta<1/2`,

\[
 \sqrt{L_j}\lambda_j^\eta e_j\longrightarrow0,     \tag{3.7}
\]

\[
 \boxed{
 {a_j^2L_j\lambda_j^{2\eta}
  A_{\rm R}(d_j/r_j){\cal F}_{\theta,M_j}
  \over\log(1+\theta)}\longrightarrow0,}           \tag{3.8}
\]

and

\[
 \boxed{
 a_j\lambda_j^\eta\sqrt{L_j/M_j}
 C_{\rm R}(d_j/r_j)\longrightarrow0,}              \tag{3.9}
\]

then `mathscr X_j` converges locally uniformly to `Xi` on
`|Im z|<1/2`.

**Proof.**  Conditions (3.7)--(3.9) make the three terms in (3.6) tend to
zero.  The corrected locked source normalization gives
`4 widehat(k_j)->Xi` locally uniformly.  \(\square\)

If `theta=theta_j` varies, (3.8) must retain the displayed
`1/log(1+theta_j)` factor.  Merely proving that
`A_R F_(theta_j,M_j)` tends to zero as `theta_j` tends to zero is
uninformative.

The conclusion of Theorem 3.1 is the projective locally uniform bridge.  It
does not assert the stronger complete-`L2` condition (5.2) of
`DIRECT_RH_ATTACK.md`.

## 4. Exact source-Cauchy factorization

Let `mathsf M phi_n=n phi_n` be the finite mode operator.  Since the
symmetric cutoff satisfies

\[
 [\mathsf M,\Pi_M]=0,
 \qquad J\Pi_M=\Pi_MJ,                              \tag{4.1}
\]

the full homotopy `Q+t Pi_M` has exactly the same source-Cauchy displacement
as `Q`.  Put

\[
 \zeta=U-r,
\]

and define the full even and odd homotopies

\[
 \mathcal A_t=Q_+-\zeta I+t\Pi_{M,+},
 \qquad
 \mathcal C_t=Q_--\zeta I+t\Pi_{M,-}.              \tag{4.2}
\]

Relative to `C kappa direct-sum K`, set

\[
 \begin{aligned}
 B_t&=B+rI+tK_M,\\
 k_M&=W^*\Pi_M\kappa,\\
 b_t&=b+tk_M,\\
 k_{00}&=\langle\kappa,\Pi_M\kappa\rangle,\\
 a_t&=d+r+tk_{00},                                  \tag{4.3}\\
 \sigma_t&=a_t-b_t^*B_t^{-1}b_t.
 \end{aligned}
\]

Let `eta=sum_(|n|<=N) phi_n`, let
`delta(f)=<eta,f>` be the pinned source boundary functional, let `e_0` be
the central mode, and put

\[
 m_t=\delta\,\mathcal A_t^{-1}e_0.                  \tag{4.4}
\]

The source boundary-pullback identity and ordinary anchor Schur
factorization give

\[
 \det\mathcal C_t
 =\det\mathcal A_t\,m_t
 =\det B_t\,\sigma_t\,m_t.                         \tag{4.5}
\]

Therefore the determinant response in Theorem 2.1 has the exact combined
form

\[
 \boxed{
 {\cal F}_{\theta,M}
 =\log{
   \det\mathcal C_{\theta r}\,\sigma_0m_0
   \over
   \det\mathcal C_0\,\sigma_{\theta r}m_{\theta r}}.}
                                                               \tag{4.6}
\]

For `r>0`, all factors in (4.6) are nonzero.  Indeed,

\[
 \sigma_0
 =d+r-b^*(B+rI)^{-1}b>d\geq0,                     \tag{4.7}
\]

because `B>0` and `||b||=r`.  The odd factor is positive by (1.3), and
adding `t Pi_M` preserves positivity.  Equation (4.5) then also makes the
boundary factor nonzero.

Equation (4.6) preserves the complete pole--archimedean--minus-prime
cancellation inside `Q`.  Its odd determinant, anchor self-energy, and
boundary response must remain combined.  A triangle inequality on those
three responses is not justified by (4.6).

The full homotopy in (4.2) is mandatory.  Although its complement block is
`B_t`, the complement-only ambient perturbation is

\[
 W K_MW^*=P_{\mathcal K}\Pi_MP_{\mathcal K},
 \qquad P_{\mathcal K}=WW^*.
\]

The anchor projection `P_{\mathcal K}` generally does not commute with the
mode operator.  Consequently
`P_{\mathcal K} Pi_M P_{\mathcal K}` need not have zero mode commutator,
and applying (4.5) to `Q+t W K_MW^*` would be an unjustified shortcut.  The
terms `k_M`, `b_t`, `k_00`, and `a_t` in (4.3) cannot be dropped.

## 5. The `M=ceil(lambda)` corollary

Assume the locked projected-state theorem on a deterministic schedule, so

\[
 0<a_-\leq a_j\leq a_+<\infty,                     \tag{5.1}
\]

and the proved projection estimate gives

\[
 e_j=O(\lambda_j^{-1/2}).                           \tag{5.2}
\]

Take

\[
 M_j=\lceil\lambda_j\rceil<N_j.                    \tag{5.3}
\]

Then (3.5) holds eventually on every fixed compact rectangle.  Suppose in
addition that `d_j/r_j` is bounded and, for one fixed `theta>0`,

\[
 \boxed{
 A_{\rm R}(d_j/r_j){\cal F}_{\theta,M_j}
 =O(\lambda_j^{-1}).}                              \tag{5.4}
\]

Bounded `d_j/r_j` makes both `A_R` and `C_R` bounded.  For every fixed
`eta<1/2`,

\[
 L_j\lambda_j^{2\eta}
 A_{\rm R}{\cal F}_{\theta,M_j}
 =O(\log\lambda_j\,\lambda_j^{2\eta-1})\to0,       \tag{5.5}
\]

and

\[
 \lambda_j^\eta\sqrt{L_j/M_j}\,C_{\rm R}
 =O(\lambda_j^{\eta-1/2}\sqrt{\log\lambda_j})\to0.\tag{5.6}
\]

The projection term has the same exponent as (5.6).  Thus Theorem 3.1 gives
local uniform convergence of the zero-preserving entire functions to `Xi`,
provided the exact sector signs and response estimate (5.4) are proved on
that schedule.  This corollary does not prove either premise.

## 6. Edge cases and fail-closed conditions

1. **Zero residual.**  If `r=0`, do not form `d/r`.  The signs at a lower
   shift `U<q` are not enough to identify the ground.  Require instead the
   exact Rayleigh signs `A-qI>0` and `Q_--qI>0` (equivalently take `U=q`
   with strict complement and odd signs).  Then `kappa` is the simple global
   ground: take `gamma=1`, `d_pr=0`, and set `F_(theta,M)=0`.  The generic
   parity logarithms at `zeta=q` may be singular and are unnecessary.
2. **Rayleigh shift with positive residual.**  If `d=0<r`, use
   `A_R(0)=C_R(0)=1`; the generic `r>0` proof and factorization remain valid.
3. **Homotopy size.**  Require `theta>0`.  If it varies with the schedule,
   retain `log(1+theta)` exactly.  `theta=0` supplies no observation.
4. **Cutoff range.**  The stated theorem requires `1<=M<N`.  A run with
   `M>=N` is outside this theorem and must not be reported as a pass under
   its label, even though a separate full-space statement could be written.
5. **Compact separation.**  Condition (3.5) is required for every compact
   rectangle eventually; real-axis agreement alone is not a substitute.
6. **Source scaling.**  The factors `a_j` in (3.6), (3.8), and (3.9) are
   mandatory until (5.1) is invoked.
7. **Certification.**  Point eigenvalues or stored eigenvectors do not prove
   (1.2)--(1.3), the response rate, or local uniform convergence.

## 7. Structural limitation and counterexample

The determinant trace in (2.5) observes every low-mode complementary
direction, not only the residual-forced ground graph.  This makes the gate
sufficient but not necessary.

Let `L_j,N_j` tend to infinity, choose `M_j>=2`, and let `s_j` tend to zero,
with `c_j=sqrt(1-s_j^2)`.  In the inversion parity basis take a diagonal
source-Cauchy matrix with

\[
 Qe_0=ae_0,
 \quad Qe_1^\pm=(a+1)e_1^\pm,
 \quad Qe_2^\pm=(a+2s_j^2)e_2^\pm,                 \tag{7.1}
\]

and put all remaining diagonal entries safely above `a`.  Set

\[
 \kappa_j=c_je_0+s_je_1^+,
 \qquad \omega_j=-s_je_0+c_je_1^+.                \tag{7.2}
\]

Then

\[
 q=a+s_j^2,
 \quad r=s_jc_j,
 \quad u=U=a,
 \quad d=s_j^2,
 \quad B=\operatorname {diag}(c_j^2,2s_j^2,\ldots).
                                                               \tag{7.3}
\]

The exact Ritz identity `d<w,Bw>=r^2` holds, both shifted sectors are
strictly positive, the simple ground is `e_0`, and

\[
 d/r=s_j/c_j\to0,
 \qquad z=(s_j/c_j)\omega_j\to0.                  \tag{7.4}
\]

Nevertheless `Pi_(M_j)e_2^+=e_2^+`, and the hidden low direction gives

\[
 \lambda_{\max}(X_{M_j})
 \geq {r\over2s_j^2+r}\longrightarrow1.           \tag{7.5}
\]

Hence, for every fixed `theta>0`,

\[
 {\cal F}_{\theta,M_j}
 \geq\log\left(1+\theta{r\over2s_j^2+r}\right)
 \longrightarrow\log(1+\theta),                  \tag{7.6}
\]

even though the actual projective ground error tends to zero and
`A_R(d/r)->1`.  The matrices are inversion-symmetric diagonal
source-Cauchy matrices, but they are not the pinned arithmetic Weil
matrices.  The example proves that source-Cauchy displacement, signs, the
Ritz moment, and small scalar data do not force (5.4).  An arithmetic proof
must exclude low-Fourier-visible near-null complementary directions, or use
a sharper vector-specific response which does not trace over them.

No conclusion about equation (5.2), determinant convergence for the actual
source schedule, or the Riemann hypothesis follows from this counterexample.
