# Unprojected odd `nu`: exact Fourier compression and a two-sided sign obstruction

## 0. Claim boundary

This note re-derives the unprojected odd third-moment gate without replacing
the finite-interval operator by a whole-line multiplier.  It proves two new
source-specific facts.

1. The residual transform is the Paley--Wiener projection

   \[
    \widehat R=\Pi_\lambda\bigl((m_\lambda-\tau)\widehat p\bigr),
   \]

   so the exact `nu` gate is a compressed-multiplier quadratic form.  The
   projection `Pi_lambda` is mandatory.
2. For every locked `lambda>=5/2` and every nonnegative shift `beta`, the
   actual source multiplier `m_lambda-beta` is strictly negative on an
   explicit interval about zero and strictly positive on an explicit tail.
   The actual nonzero residual has nonzero Fourier mass in both regions.
   Consequently the positive and negative parts in the exact `nu`
   decomposition are both strictly nonzero.

This is a decisive obstruction to a pointwise-multiplier, support, or
prime-jump proof of the sign: the required statement is an oriented
quantitative comparison between two nonzero source terms.  The theorem does
not determine which term is larger.  In particular, it proves no positive
`nu`, transverse floor, inverse-load margin, signed odd-sector floor,
equation (5.2) of `DIRECT_RH_ATTACK.md`, determinant convergence, or the
Riemann hypothesis.  The formal project state remains `P0_INVALIDATED`.

No zero list, global Weil positivity, or reality of a nontrivial zero is
used.  The conventions are those of `P0_SOURCE_LOCK.json`,
`ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md`,
`ODD_JUMP_FINITE_KRYLOV_ATTACK.md`, and
`ODD_NU_TRANSVERSE_SIGN_ATTACK.md`.  In particular,

\[
 \widehat f(t)=\int_{-\ell}^{\ell}f(x)e^{-itx}\,dx,
 \qquad {dt\over2\pi},
 \qquad \ell=\log\lambda,
 \qquad L=2\ell,                                      \tag{0.1}
\]

and

\[
 m_\lambda(t)=2\theta'(t)
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).                \tag{0.2}
\]

The endpoint in (0.2) is inclusive, and the displayed minus sign is the
source minus sign on the prime block.

## 1. The exact Paley--Wiener projection formula

Let `I_lambda=[-ell,ell]`, let `C_lambda` be zero extension from this
interval, and use the unitary Fourier realization from (0.1).  Put

\[
 A_\lambda=C_\lambda^*\mathcal F^*M_{m_\lambda}
                    \mathcal F C_\lambda.             \tag{1.1}
\]

On the inversion-odd subspace, define

\[
 p(x)=\sinh(x/2),
 \qquad
 \mu=\|p\|^2={\lambda-\lambda^{-1}-2\log\lambda\over2}, \tag{1.2}
\]

\[
 \tau={\langle p,A_\lambda p\rangle\over\mu},
 \qquad
 R=A_\lambda p-\tau p.                               \tag{1.3}
\]

The exact pole term in the complete odd operator is
`-2|p><p|`.  It changes the pole-axis diagonal from `tau` to
`alpha=tau-2*mu`, but it vanishes on `p^perp`; in particular it does not
change the form on `R`.

Let

\[
 \Pi_\lambda=\mathcal F C_\lambda C_\lambda^*\mathcal F^* \tag{1.4}
\]

be the orthogonal projection onto the Fourier transforms of functions
supported in `I_lambda`.  Its exact integral kernel is

\[
 (\Pi_\lambda g)(t)
 =\int_{\mathbb R}D_\lambda(t-s)g(s){ds\over2\pi},
 \qquad
 D_\lambda(u)=
 \begin{cases}
  2\sin(\ell u)/u,&u\ne0,\\
  2\ell,&u=0.
 \end{cases}                                         \tag{1.5}
\]

The pole transform, with the Fourier sign in (0.1), is

\[
 \widehat p(t)=
 {2i\{t\sinh(\ell/2)\cos(t\ell)
 -(1/2)\cosh(\ell/2)\sin(t\ell)\}
  \over t^2+1/4}.                                    \tag{1.6}
\]

### Theorem 1.1 (exact compressed-multiplier residual)

One has

\[
 \boxed{
 \tau={1\over\mu}\int_{\mathbb R}m_\lambda(t)
                    |\widehat p(t)|^2{dt\over2\pi},} \tag{1.7}
\]

\[
 \boxed{
 \widehat R
 =\Pi_\lambda\bigl((m_\lambda-\tau)\widehat p\bigr).} \tag{1.8}
\]

Consequently, for every real `beta`,

\[
 \boxed{
 \nu_{\lambda,\beta}^{\infty}
 ={1\over\mu}\int_{\mathbb R}(m_\lambda(t)-\beta)
 \left|\Pi_\lambda\bigl((m_\lambda-\tau)
                         \widehat p\bigr)(t)\right|^2
 {dt\over2\pi}.}                                    \tag{1.9}
\]

**Proof.**  Plancherel applied to (1.1) gives (1.7).  Fourier transforming
the zero extension of `A_lambda p` gives

\[
 \mathcal F C_\lambda A_\lambda p
 =\Pi_\lambda(m_\lambda\widehat p).
\]

Because `p` is supported in `I_lambda`, its transform belongs to the range
of `Pi_lambda`.  Subtracting `tau*widehat p` proves (1.8).  The residual is
orthogonal to `p`, so both transverse projections and the negative odd pole
drop from its quadratic form.  Applying Plancherel once more proves (1.9).
\(\square\)

The projection in (1.8)--(1.9) cannot be deleted.  In general,

\[
 \Pi_\lambda(m_\lambda\widehat p)
 \ne m_\lambda\widehat p.                            \tag{1.10}
\]

Thus the spectral measure of the compressed operator is not the pushforward
of `|widehat p(t)|^2 dt/(2*pi)` by the scalar function `m_lambda`.

Since the locked prime jump proves `R!=0`, define the finite residual
Rayleigh value

\[
 \rho_R={\displaystyle\int m_\lambda(t)|\widehat R(t)|^2
                         {dt\over2\pi}
          \over\displaystyle\int|\widehat R(t)|^2{dt\over2\pi}}.
                                                               \tag{1.11}
\]

Then the shift dependence is exactly affine:

\[
 \boxed{
 \nu_{\lambda,\beta}^{\infty}
 ={\|R\|^2\over\mu}(\rho_R-\beta).}                 \tag{1.12}
\]

Therefore the positive-`nu` gate is precisely the strict, quantitative
inequality `rho_R>beta`; nonvanishing of `R` alone gives no sign.

## 2. Explicit sign change of the actual source multiplier

Write

\[
 a(t)=2\theta'(t)
 =\operatorname {Re}\psi_\Gamma\!\left({1\over4}+{it\over2}\right)
 -\log\pi,                                            \tag{2.1}
\]

\[
 c_\Gamma=-\psi_\Gamma(1/4)+\log\pi
 =\gamma_E+{\pi\over2}+3\log2+\log\pi,              \tag{2.2}
\]

and retain the exact finite prime mass

\[
 \Sigma_\lambda=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}.   \tag{2.3}
\]

### Lemma 2.1 (two-sided explicit digamma bound)

For every real `t`,

\[
 \boxed{
 {1\over2}\log(1+4t^2)
 \leq a(t)+c_\Gamma
 \leq4+{1\over2}\log(1+4t^2).}                     \tag{2.4}
\]

**Proof.**  The exact digamma series gives, for `a_0>0` and real `y`,

\[
 \operatorname {Re}\psi_\Gamma(a_0+iy)-\psi_\Gamma(a_0)
 =\sum_{k=0}^{\infty}
 {y^2\over(k+a_0)((k+a_0)^2+y^2)}.                   \tag{2.5}
\]

The summand as a function of `k+a_0` is positive and decreasing.  Its
integral from `a_0` to infinity is

\[
 {1\over2}\log(1+y^2/a_0^2),                         \tag{2.6}
\]

while its first value is at most `1/a_0`.  The lower and upper integral
tests, with `a_0=1/4` and `y=t/2`, prove (2.4).  \(\square\)

Put

\[
 \delta_\Gamma
 =c_\Gamma-4-{1\over2}\log(5/4)>0.                  \tag{2.7}
\]

The positivity is elementary and has ample rational slack.  For a fully
rational check, the standard lower sum for Euler's constant gives

\[
 \gamma_E>H_7-\log8.
\]

The `atanh` series for `log(2)` gives both

\[
 \log2>2/3,
 \qquad
 \log2
 <2\left\{{1\over3}+{1\over3}
       \sum_{k\geq1}3^{-(2k+1)}\right\}
 ={25\over36}.
\]

Therefore

\[
 \gamma_E>{363\over140}-{25\over12}
 ={107\over210}>{1\over2}.
\]

Together with `pi/2>3/2`, `3*log(2)>2`, and `log(pi)>1`, this gives
`c_Gamma>5`.  Finally `log(5/4)<1/4`; hence

\[
 \delta_\Gamma>{7\over8}.                            \tag{2.8}
\]

For `lambda>1`, define the explicit core radius

\[
 r_\lambda=\min\left\{{1\over4},{\pi\over3L}\right\}>0. \tag{2.9}
\]

For a nonnegative shift `beta`, define the explicit tail threshold

\[
 T_{\lambda,\beta}
 ={1\over2}\sqrt{
 \exp\{2(c_\Gamma+2\Sigma_\lambda+\beta+1)\}-1}.    \tag{2.10}
\]

### Theorem 2.2 (actual-source two-sided sign regions)

For every locked `lambda>=5/2` and every `beta>=0`,

\[
 \boxed{
 m_\lambda(t)-\beta
 \leq-(\delta_\Gamma+\Sigma_\lambda+\beta)<0
 \quad (|t|\leq r_\lambda),}                         \tag{2.11}
\]

and

\[
 \boxed{
 m_\lambda(t)-\beta\geq1>0
 \quad (|t|\geq T_{\lambda,\beta}).}                \tag{2.12}
\]

**Proof.**  If `|t|<=r_lambda` and `1<n<=lambda^2`, then

\[
 |t|\log n\leq r_\lambda L\leq\pi/3,
\]

so every cosine in (0.2) is at least `1/2`.  The upper bound in (2.4),
`r_lambda<=1/4`, and (2.7) give `a(t)<=-delta_Gamma`.  Keeping the source
minus sign before the prime sum proves (2.11).  Notice that
`Sigma_lambda>0` on the locked range because the included prime power
`n=2` is already present.

For arbitrary real `t`, the lower bound in (2.4) and `cos<=1` give

\[
 m_\lambda(t)-\beta
 \geq-c_\Gamma+{1\over2}\log(1+4t^2)
             -2\Sigma_\lambda-\beta.                 \tag{2.13}
\]

Substitution of (2.10) proves (2.12).  \(\square\)

The tail threshold is deliberately coarse and enormous.  Its role is to
give a finite, source-explicit sign region, not a usable asymptotic cutoff.
No unnamed constant occurs in (2.9)--(2.12).

## 3. Both sides occur in the exact `nu` decomposition

Let

\[
 w_{\lambda,\beta}(t)=[m_\lambda(t)-\beta]_+,
 \qquad
 v_{\lambda,\beta}(t)=[\beta-m_\lambda(t)]_+.        \tag{3.1}
\]

The residual belongs to the logarithmically weighted form domain, so both
quantities

\[
 P_{\lambda,\beta}
 =\int_{\mathbb R}w_{\lambda,\beta}(t)
                    |\widehat R(t)|^2{dt\over2\pi},
 \qquad
 N_{\lambda,\beta}
 =\int_{\mathbb R}v_{\lambda,\beta}(t)
                    |\widehat R(t)|^2{dt\over2\pi}   \tag{3.2}
\]

are finite.

### Theorem 3.1 (strictly two-sided residual mass)

For every locked `lambda>=5/2` and every `beta>=0`,

\[
 \boxed{P_{\lambda,\beta}>0,qquad
        N_{\lambda,\beta}>0,}                         \tag{3.3}
\]

and the exact sign identity is

\[
 \boxed{
 \mu\nu_{\lambda,\beta}^{\infty}
 =P_{\lambda,\beta}-N_{\lambda,\beta}.}             \tag{3.4}
\]

More explicitly,

\[
 N_{\lambda,\beta}
 \geq(\delta_\Gamma+\Sigma_\lambda+\beta)
 \int_{|t|\leq r_\lambda}|\widehat R(t)|^2{dt\over2\pi}>0, \tag{3.5}
\]

and

\[
 P_{\lambda,\beta}
 \geq\int_{T_{\lambda,\beta}\leq|t|\leq
                  T_{\lambda,\beta}+1}
           |\widehat R(t)|^2{dt\over2\pi}>0.         \tag{3.6}
\]

**Proof.**  The prime-jump theorem gives `R!=0`.  Since `R` is supported in
the bounded interval and belongs to `L2`, it belongs to `L1`, and
`widehat R` extends to an entire function.  A nonzero entire function cannot
vanish on a real interval.  Therefore its squared modulus has strictly
positive integral on both intervals appearing in (3.5)--(3.6).  Theorem 2.2
then proves those inequalities.  Splitting the real multiplier into its
positive and negative parts proves (3.4).  \(\square\)

This theorem is specific to the actual archimedean-minus-prime multiplier
and the actual prime-jump residual.  It strengthens the abstract orientation
countermodels: even in the source problem itself, neither sign is absent.
The desired conclusion is the strict quantitative comparison

\[
 \boxed{P_{\lambda,\beta}>N_{\lambda,\beta},}         \tag{3.7}
\]

not merely nonzero jump energy or eventual pointwise positivity of the
multiplier.

The localized jump theorem guarantees a positive logarithmic contribution
of order `(log K)/K` in a moving dyadic band, and that guaranteed quantity
tends to zero.  Equation (3.5) exhibits an actual nonzero low-frequency
debit which the sign proof must retain.  This does not say that the complete
positive term in (3.2) is small; it proves that the jump lower bound alone
cannot replace the full comparison (3.7).

## 4. The inverse-load margin is a separate spectral comparison

Let

\[
 G=p^\perp\cap H_-,
 \qquad
 C_0=P_GA_\lambda P_G,
 \qquad
 b={R\over\sqrt\mu}.                                  \tag{4.1}
\]

Let `eta_b` be the spectral measure of the self-adjoint form operator `C_0`
generated by `b`.  Then

\[
 \|b\|^2=\int d\eta_b(x),
 \qquad
 \boxed{
 \nu_{\lambda,\beta}^{\infty}
 =\int(x-\beta)\,d\eta_b(x).}                       \tag{4.2}
\]

If `C_0-beta` is strictly positive, its inverse load is

\[
 \boxed{
 \chi_{\lambda,\beta}^{\infty}
 =\int{d\eta_b(x)\over x-\beta}.}                   \tag{4.3}
\]

Thus positive `nu` is an arithmetic-mean condition, whereas the Schur
correction is a reciprocal-mean condition.  Cauchy--Schwarz gives only the
lower bound

\[
 \chi_{\lambda,\beta}^{\infty}
 \nu_{\lambda,\beta}^{\infty}\geq\|b\|^4,           \tag{4.4}
\]

not the upper bound needed for a pass.

For the complete odd operator, put

\[
 \alpha=\tau-2\mu,
 \qquad
 s_\beta=\alpha-\beta-\chi_{\lambda,\beta}^{\infty}. \tag{4.5}
\]

Throughout any interval below the transverse spectrum,

\[
 {d\over d\beta}\nu_{\lambda,\beta}^{\infty}
 =-\|b\|^2<0,                                        \tag{4.6}
\]

\[
 {d\over d\beta}\chi_{\lambda,\beta}^{\infty}
 =\int{d\eta_b(x)\over(x-\beta)^2}>0,
 \qquad
 \boxed{{d\over d\beta}s_\beta<-1.}                \tag{4.7}
\]

Hence a nonnegative scalar shift worsens both gates monotonically.  Even a
proof of (3.7) would leave the independent obligations

\[
 C_0-\beta\succ0,
 \qquad
 s_\beta>0.                                          \tag{4.8}
\]

The third moment cannot be substituted for the inverse load.

## 5. Exact consequence for the next attack

The source-specific sign problem is now isolated without a whole-line or
pointwise shortcut.  On one common favorable locked schedule, a successful
odd argument must prove all of the following with quantitative margins:

1. the directional concentration inequality (3.7), equivalently
   `rho_R>beta` in (1.12);
2. a positive floor for the complete transverse compression `C_0-beta`;
3. the reciprocal-load comparison `chi_(lambda,beta)<alpha-beta`;
4. Galerkin errors smaller than those strict margins for an explicit
   relation between the Fourier cutoff and `lambda`.

The actual multiplier has a negative core, so global pointwise positivity is
false.  It has a positive tail, but the residual has mass in the negative
core as well as in that tail.  The exact finite-interval projection in (1.8)
couples the two.  Therefore high-Fourier coercivity, analyticity, and the
prime jump are structural inputs only; none assigns the sign of `nu` or the
inverse-load margin.
