# Odd prime jumps: finite Galerkin transfer and the remaining Krylov gate

## 0. Claim boundary

This note closes one qualitative gap left in
`ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md`.  For each fixed locked
half-integer parameter, the centered cross numerator of the exact finite
Fourier compression converges in `L2` to the complete unprojected
archimedean-minus-prime residual.  Hence the nonzero prime-power jump does
transfer to a nonzero finite cross vector for every sufficiently large
outer cutoff.  A localized dyadic Fourier band also has an exact
`1/K` jump-energy asymptotic, and this gives a two-scale finite lower bound
with an explicit graph-error hypothesis.

The result is deliberately limited.  It supplies no uniform cutoff
`N(lambda)`, no asymptotic residual size, no positive value of the third
moment `nu_beta`, no transverse floor, and no upper enclosure of the inverse
load.  It does not prove either signed sector floor, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant convergence, or the Riemann hypothesis.
No zero table, zero-reality assumption, or global Weil positivity is used.
The project state remains `P0_INVALIDATED`.

All conventions below are those of `P0_SOURCE_LOCK.json` and
`ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md`.  In particular,

\[
 \widehat f(t)=\int_{-\ell}^{\ell}f(x)e^{-itx}\,dx,
 \qquad d\nu(t)={dt\over2\pi},
 \qquad L=2\ell=2\log\lambda,                         \tag{0.1}
\]

the prime-power endpoint is inclusive, and the non-pole multiplier is

\[
 m_\lambda(t)=2\theta'(t)
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).                \tag{0.2}
\]

Thus the source minus sign on the prime block is retained before any norm is
taken.

## 1. The complete non-pole operator and an explicit graph majorant

Let `C_lambda` denote zero extension from
`I_lambda=[-ell,ell]` to the real line and put

\[
 A_\lambda=C_\lambda^*\mathcal F^*M_{m_\lambda}
                 \mathcal F C_\lambda.                 \tag{1.1}
\]

This is the complete archimedean-minus-prime operator.  It is not split into
separate residuals below.  The unprojected odd pole is

\[
 p(x)=\sinh(x/2),\qquad
 \mu=\|p\|^2={\lambda-\lambda^{-1}-2\log\lambda\over2}. \tag{1.2}
\]

For later use, define the exact finite prime mass

\[
 \Sigma_\lambda=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}       \tag{1.3}
\]

and

\[
 c_\Gamma=-\psi_\Gamma(1/4)+\log\pi
 =\gamma_E+{\pi\over2}+3\log2+\log\pi.                \tag{1.4}
\]

### Lemma 1.1 (source-explicit logarithmic multiplier bound)

For every real `t`,

\[
 \boxed{
 |m_\lambda(t)|\leq
 c_\Gamma+4+2\Sigma_\lambda
       +{1\over2}\log(1+4t^2).}                       \tag{1.5}
\]

Consequently, for every `0<s<1/2`,

\[
 |m_\lambda(t)|
 \leq K_{\lambda,s}(1+t^2)^{s/2},                     \tag{1.6}
\]

where the displayed finite constant is

\[
 \boxed{
 K_{\lambda,s}=c_\Gamma+4+2\Sigma_\lambda
                   +\log2+{1\over s}.}                \tag{1.7}
\]

**Proof.**  For `a>0`, the exact digamma series gives

\[
 \operatorname {Re}\psi_\Gamma(a+iy)-\psi_\Gamma(a)
 =\sum_{k=0}^\infty
 {y^2\over(k+a)((k+a)^2+y^2)}.                         \tag{1.8}
\]

The summand is positive and decreasing as a function of `k+a`.  Its first
value plus its integral therefore gives

\[
 0\leq\operatorname {Re}\psi_\Gamma(a+iy)-\psi_\Gamma(a)
 \leq {1\over a}+{1\over2}\log(1+y^2/a^2).            \tag{1.9}
\]

Take `a=1/4`, `y=t/2`, use (1.4), and then bound the finite cosine sum in
(0.2) by its exact mass (1.3).  This proves (1.5).  Finally,

\[
 {1\over2}\log(1+4t^2)
 \leq\log2+{1\over2}\log(1+t^2)
 \leq\left(\log2+{1\over s}\right)(1+t^2)^{s/2},       \tag{1.10}
\]

which proves (1.6)--(1.7).  \(\square\)

In particular, with the `H^s(R)` norm normalized using
`(1+t^2)^s dt/(2*pi)`,

\[
 \|A_\lambda f\|_2
 \leq K_{\lambda,s}\|C_\lambda f\|_{H^s(\mathbb R)}. \tag{1.11}
\]

This bound is used only to prove graph convergence.  The finite residual
itself always retains the combined multiplier (0.2).

## 2. Exact finite cross numerator and graph convergence

Let

\[
 \phi_k(x)=(-1)^kL^{-1/2}e^{2\pi ikx/L},
 \qquad
 P_N=\sum_{|k|\leq N}|\phi_k\rangle\langle\phi_k|,      \tag{2.1}
\]

and set

\[
 p_N=P_Np,\qquad \mu_N=\|p_N\|^2,
 \qquad e_N={p_N\over\sqrt{\mu_N}}.                   \tag{2.2}
\]

The exact coefficients, with the Fourier normalization in (0.1), are

\[
 \langle\phi_k,p\rangle
 ={2i\kappa_k\sinh(\ell/2)
   \over\sqrt L(\kappa_k^2+1/4)},
 \qquad \kappa_k={2\pi k\over L},                     \tag{2.3}
\]

and the coefficient at `k=0` is zero.  In particular,

\[
 \|p-p_N\|^2
 =2\sum_{k>N}{4\kappa_k^2\sinh^2(\ell/2)
                    \over L(\kappa_k^2+1/4)^2}
 \leq {2L\sinh^2(\ell/2)\over\pi^2N}.                \tag{2.4}
\]

The source finite odd matrix is exactly

\[
 Q_N=P_NA_\lambda P_N-2|p_N\rangle\langle p_N|.       \tag{2.5}
\]

Define the non-pole Rayleigh values and centered residuals

\[
 \tau={\langle p,A_\lambda p\rangle\over\mu},
 \qquad
 R=A_\lambda p-\tau p,                                \tag{2.6}
\]

\[
 \tau_N={\langle p_N,A_\lambda p_N\rangle\over\mu_N},
 \qquad
 r_N=P_NA_\lambda p_N-\tau_Np_N.                     \tag{2.7}
\]

If

\[
 b_N=P_{e_N^\perp}Q_Ne_N,                              \tag{2.8}
\]

then the negative pole is parallel to `e_N` and drops out exactly, giving

\[
 \boxed{r_N=\sqrt{\mu_N}\,b_N.}                       \tag{2.9}
\]

### Theorem 2.1 (fixed-parameter finite Galerkin transfer)

For every fixed `lambda>1`,

\[
 \boxed{
 r_N\longrightarrow R\quad\hbox{in }L^2(I_\lambda),
 \qquad
 \|b_N\|\longrightarrow{\|R\|\over\sqrt\mu}.}      \tag{2.10}
\]

**Proof.**  The periodic function `p` is smooth away from its identified
endpoint jump, so its symmetric Fourier sums converge in periodic `H^s` for
every `0<s<1/2`.  Restriction followed by zero extension is bounded from
`H^s(I_lambda)` to `H^s(R)` in exactly this range.  Hence

\[
 \|C_\lambda(p_N-p)\|_{H^s(\mathbb R)}\longrightarrow0. \tag{2.11}
\]

Equations (1.11) and (2.11) imply
`A_lambda p_N -> A_lambda p` in `L2`.  Also `P_N` converges strongly to the
identity in `L2`, while (2.4) gives `mu_N -> mu`.  It follows by ordinary
polarization that `tau_N -> tau`.  Therefore

\[
 P_NA_\lambda p_N-\tau_Np_N
 \longrightarrow A_\lambda p-\tau p,                 \tag{2.12}
\]

which is the first assertion.  Divide the norms in (2.9) by
`sqrt(mu_N)` to obtain the second.  \(\square\)

Here is an exact error majorant that will be used below.  Put

\[
\begin{aligned}
 g_N&=\|p_N-p\|,\\
 h_N&=\|A_\lambda(p_N-p)\|,\\
 q_N&=\|(I-P_N)A_\lambda p\|,                         \tag{2.13}\\
 d_N&={g_N\|A_\lambda p\|+\sqrt{\mu_N}h_N\over\mu_N}
       +{|\tau|g_N^2\over\mu_N},\\
 E_N&=h_N+q_N+d_N\sqrt{\mu_N}+|\tau|g_N.
\end{aligned}
\]

Then expansion of the two Rayleigh quotients gives

\[
 |\tau_N-\tau|\leq d_N,
 \qquad
 \boxed{\|r_N-R\|\leq E_N,\qquad E_N\longrightarrow0.} \tag{2.14}
\]

All actions in (2.13) use the complete multiplier (0.2).  Thus (2.14) does
not replace the archimedean--prime cancellation by the sum of their separate
residual norms.  Formula (1.11) proves `h_N -> 0`; it need not be used as a
sharp numerical estimate.

## 3. Localized jump energy in a dyadic Fourier band

Now impose the locked grid

\[
 \lambda={p_0\over2},\qquad p_0\geq5\text{ odd}.       \tag{3.1}
\]

Let

\[
 \mathcal S_\lambda=
 \{\,\pm\log(m/\lambda):1<m\leq\lambda^2,
                         \ \Lambda(m)>0\,\}.          \tag{3.2}
\]

For a prime power `n<=lambda^2`, put

\[
 x_n=\log(n/\lambda),
 \qquad
 J_{\lambda,n}={\Lambda(n)\over\sqrt n}
                         \sinh(\ell/2)>0.              \tag{3.3}
\]

The locked odd numerator `p_0^2` prevents a collision between `x_n` and a
reflected arithmetic threshold.  Hence

\[
 d_{\lambda,n}={1\over3}\min\left(
 \ell-|x_n|,
 \min_{y\in\mathcal S_\lambda\setminus\{x_n\}}|x_n-y|
                         \right)>0,                    \tag{3.4}
\]

where an empty inner minimum is ignored.  Define the source-parameter
cutoff

\[
 \chi_{\lambda,n}(x)=
 \begin{cases}
 \exp\!\left(1-{1\over1-u^2}\right),
     &|u|<1,\quad u=(x-x_n)/d_{\lambda,n},\\
 0,&|u|\geq1.
 \end{cases}                                           \tag{3.5}
\]

Thus `0<=chi<=1`, `chi(x_n)=1`, and its support contains no other
arithmetic threshold or interval endpoint.

Put

\[
 F_{\lambda,n}=\chi_{\lambda,n}R.                     \tag{3.6}
\]

Interior pseudolocality makes the archimedean action smooth on the support
of `chi`.  The prime action is analytic on either side of `x_n`, and its
only value jump there is (3.3).  Therefore, on the length-`L` circle,

\[
 DF_{\lambda,n}=J_{\lambda,n}\delta_{x_n}+g_{\lambda,n}(x)\,dx,
                                                               \tag{3.7}
\]

where `g_(lambda,n)` is compactly supported and of bounded variation.  Set

\[
 B_{\lambda,n}=\operatorname {TV}(g_{\lambda,n})<\infty. \tag{3.8}
\]

This is an exact combined-residual quantity.  No effective upper bound for
it, uniform in `lambda`, is asserted here.

Let

\[
 F_k=\langle\phi_k,F_{\lambda,n}\rangle.              \tag{3.9}
\]

Taking Fourier coefficients of (3.7) gives, for `k!=0`,

\[
 {2\pi ik\over L}F_k
 ={(-1)^kJ_{\lambda,n}\over\sqrt L}e^{-2\pi ikx_n/L}
   +{(-1)^k\over\sqrt L}\int g_{\lambda,n}(x)
                         e^{-2\pi ikx/L}\,dx.         \tag{3.10}
\]

The last term tends to zero.  More quantitatively, bounded variation gives

\[
 \left|{1\over\sqrt L}\int g_{\lambda,n}(x)
                         e^{-2\pi ikx/L}\,dx\right|
 \leq{\sqrt L B_{\lambda,n}\over2\pi|k|}.            \tag{3.11}
\]

### Theorem 3.1 (localized jump-band law)

One has the exact asymptotic

\[
 \boxed{
 |k|^2|F_k|^2\longrightarrow
 {LJ_{\lambda,n}^2\over4\pi^2}}                     \tag{3.12}
\]

and, if `Pi_K=P_(2K)-P_K`,

\[
 \boxed{
 K\|\Pi_KF_{\lambda,n}\|^2
 \longrightarrow {LJ_{\lambda,n}^2\over4\pi^2}.}    \tag{3.13}
\]

For any `0<eta<1`, every integer

\[
 K\geq K_0(\lambda,n,\eta):=
 \max\left\{1,
 \left\lceil{LB_{\lambda,n}\over
                    2\pi\eta J_{\lambda,n}}\right\rceil\right\} \tag{3.14}
\]

satisfies

\[
\begin{aligned}
 \|\Pi_KF_{\lambda,n}\|^2
 &\geq{(1-\eta)^2LJ_{\lambda,n}^2\over2\pi^2}
       \sum_{k=K+1}^{2K}{1\over k^2}\\
 &\geq{(1-\eta)^2LJ_{\lambda,n}^2\over8\pi^2K}.      \tag{3.15}
\end{aligned}
\]

**Proof.**  Equation (3.10) and the Riemann--Lebesgue lemma give (3.12).
Summing the positive and negative modes in the dyadic band and using

\[
 K\sum_{k=K+1}^{2K}k^{-2}\longrightarrow{1\over2}
\]

gives (3.13).  Under (3.14), (3.11) is at most
`eta*J_(lambda,n)/sqrt(L)`, so the reverse triangle inequality in (3.10)
gives

\[
 |F_k|\geq{(1-\eta)J_{\lambda,n}\sqrt L\over2\pi|k|}.
\]

Sum over both signs and use
`sum_(K<k<=2K) k^(-2)>=1/(4K)` to obtain (3.15).  \(\square\)

The `1/K` in (3.13)--(3.15) is the energy of a *moving high-frequency
band*.  It is not a growing partial-sum norm.  The ordinary partial
projections converge to `F_(lambda,n)` in `L2`; no linear accumulation of
unweighted jump energy is being claimed.

## 4. A rigorous two-scale lower bound for the finite cross vector

Use `M` for the outer Galerkin cutoff and `K` for the localized Fourier
probe.  Assume `M>=2K`.  Since multiplication by `chi_(lambda,n)` and
`Pi_K` are contractions in `L2`, (2.14) and (3.15) give

\[
\boxed{
 \sqrt{\mu_M}\,\|b_M\|
 \geq
 (1-\eta)J_{\lambda,n}
       \sqrt{L\over8\pi^2K}-E_M}                     \tag{4.1}
\]

whenever `K>=K_0(lambda,n,eta)`.  Indeed,

\[
\begin{aligned}
 \|r_M\|
 &\geq\|\Pi_K(\chi_{\lambda,n}r_M)\|\\
 &\geq\|\Pi_KF_{\lambda,n}\|
       -\|\chi_{\lambda,n}(r_M-R)\|,
\end{aligned}                                         \tag{4.2}
\]

and the last norm is at most `E_M`.

In particular, the explicit relative-error hypothesis

\[
 \boxed{
 E_M\leq{1\over2}(1-\eta)J_{\lambda,n}
                   \sqrt{L\over8\pi^2K}}             \tag{4.3}
\]

implies

\[
 \boxed{
 \|b_M\|\geq
 {(1-\eta)J_{\lambda,n}\over2\sqrt{\mu_M}}
                   \sqrt{L\over8\pi^2K}>0.}          \tag{4.4}
\]

For example, `eta=1/2` reduces (4.4) to

\[
 \|b_M\|\geq
 J_{\lambda,n}\sqrt{L\over128\pi^2K\mu_M}.          \tag{4.5}
\]

For every fixed locked `lambda`, (2.14) makes (4.3) true for all sufficiently
large `M` after `K` has been fixed.  Independently, Theorem 6.2 of the
preceding note gives `R!=0`.  Thus Theorem 2.1 also yields the simpler
conclusion

\[
 \boxed{b_M\ne0\quad\hbox{for every sufficiently large }M} \tag{4.6}
\]

without choosing a local probe.

There is a common but non-effective diagonal with the favorable pole-axis
subsequence.  Choose the locked favorable parameters `lambda_j` from
`ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md`; use the always-present prime power
`n=2`; choose

\[
 K_j\geq\max\{j,K_0(\lambda_j,2,1/2)\};              \tag{4.7}
\]

then choose `M_j>=max(j,2K_j)` large enough that both the favorable finite
pole-axis inequality and (4.3) hold.  Such an `M_j` exists by the two fixed
parameter convergence theorems.  This is an existence diagonal only.  No
bound for `K_j` or `M_j` as a function of `lambda_j` has been proved, so
(4.7) is not the schedule required by equation (5.2).

## 5. What this does and does not give to Krylov

For the finite compression, put as before

\[
 \sigma_M^2=\|b_M\|^2,
 \qquad
 C_{\beta,M}=P_{e_M^\perp}(Q_M-\beta I)P_{e_M^\perp},
 \qquad
 \nu_{\beta,M}=\langle b_M,C_{\beta,M}b_M\rangle.     \tag{5.1}
\]

The transfer theorem proves `sigma_M>0` eventually.  It proves no sign for
`nu_(beta,M)`.  The mandatory three-moment gate remains

\[
 \boxed{
 \nu_{\beta,M}>0,
 \qquad
 (\alpha_M-\beta)\nu_{\beta,M}>\sigma_M^4.}           \tag{5.2}
\]

Both comparisons are strict.  A nonzero jump cannot replace the first
inequality, and the product inequality is not admissible when `nu<=0`.

If an independent source argument proves

\[
 C_{\beta,M}\succeq\kappa_M I,qquad\kappa_M>0,        \tag{5.3}
\]

then the existing Krylov identity applies unchanged:

\[
 \chi_{\beta,M}
 =\chi_{k,M}+\langle\rho_{k,M},
                         C_{\beta,M}^{-1}\rho_{k,M}\rangle,
\]

\[
 \chi_{k,M}\leq\chi_{\beta,M}
 \leq\chi_{k,M}+{\|\rho_{k,M}\|^2\over\kappa_M}.     \tag{5.4}
\]

The jump lower bound supplies neither the floor (5.3) nor an upper bound for
the Krylov residual term.  High Fourier coercivity alone does not repair
this: a localized jump forces some high-band energy, but the low block and
low--high coupling can still make `nu_(beta,M)` nonpositive.  This is the
same orientation obstruction exhibited by the exact finite twins in the
preceding note.

## 6. Exact obstruction and next lemma

The transfer mechanism is now precise.  Two quantitative inputs are still
missing on a common unbounded schedule.

1. An explicit source-parameter upper bound for
   `B_(lambda,2)=TV(g_(lambda,2))`.  By (3.14), this would make the local
   Fourier threshold effective.  The prime part is a finite elementary
   expression.  The unresolved piece is a uniform interior variation bound
   for the regularized archimedean action after the endpoint singularities
   have been cut off.
2. A cancellation-preserving bound

   \[
    E_M\leq G(\lambda,M)                                \tag{6.1}
   \]

   strong enough to satisfy (4.3) with a declared relation between `M`,
   `K`, and `lambda`.  Bounding the archimedean and prime residuals
   separately is not an acceptable substitute for the complete graph error
   in (2.13).

Even those two estimates would yield only a quantitative nonzero cross
vector.  A usable inverse-load enclosure still additionally needs the
positive-`nu` gate (5.2) and a transverse or cyclic spectral floor such as
(5.3).  The next genuinely sign-bearing lemma must therefore combine the
source-local graph estimate with a positive transverse comparison; jump
energy by itself cannot supply that orientation.
