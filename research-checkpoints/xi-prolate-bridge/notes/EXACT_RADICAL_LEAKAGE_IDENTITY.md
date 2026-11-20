# Exact radical and finite-window leakage identity

## Claim boundary

This note records an unconditional algebraic identity and a new domain-extension
lemma for the prolate--Weil program.  It does not prove positivity of the Weil
form, an unbounded-schedule estimate, equation (5.2) of
`DIRECT_RH_ATTACK.md`, or RH.

The source theorem is the global radical statement.  The bounded-variation
extension and the hard-window spectral-tail pairing below are new.  In
particular, the right side of the leakage identity is not asserted to be a
positive quadratic form.

## 1. Locked transforms and the source radical

Use the additive and multiplicative Fourier transforms

\[
 \mathcal F_{\!a}f(y)=\int_{\mathbb R}f(x)e^{2\pi ixy}\,dx,
 \qquad
 \widehat g(z)=\int_0^\infty g(u)u^{-iz}\,\frac{du}{u}.
\]

The additive sign is the one printed in arXiv:2106.01715v1, Section 3.
The functions below are even, so changing the sign would not change their
additive transforms, but the convention is still locked.

Let

\[
 \mathcal S^{\rm ev}_0=
 \left\{f\in\mathcal S(\mathbb R):f(-x)=f(x),\quad
 f(0)=0,\quad \widehat f_a(0)=\int_{\mathbb R}f(x)\,dx=0\right\}
\]

and

\[
 \mathcal E(f)(u)=u^{1/2}\sum_{n\ge1}f(nu),\qquad u>0.       \tag{1.1}
\]

For

\[
 m_f(z)=\int_0^\infty f(v)v^{1/2-iz}\,\frac{dv}{v},
\]

the source calculation gives, initially in the absolute-convergence half
plane and then by analytic continuation,

\[
 \widehat{\mathcal E(f)}(z)
   =\zeta\!\left(\frac12-iz\right)m_f(z).          \tag{1.2}
\]

The possible pole at `z=i/2` is canceled by
`m_f(i/2)=integral_0^infinity f(v)dv=0`.  On the bounded-variation class
below, the same zero-integral condition gives the square-integrable
`O(u^(1/2))` behavior of `E(f)` at zero.  The condition `f(0)=0` belongs to
the source codimension-two class and, with even smoothness, supplies the
`O(x^2)` origin behavior needed for the larger Mellin continuation.

Write a nontrivial zero as

\[
 \rho=\frac12+is.
\]

No reality of `s` is assumed.  Functional-equation and conjugation symmetry
give

\[
 \zeta\!\left(\frac12-is\right)=\zeta(1-\rho)=0,
 \qquad
 \zeta\!\left(\frac12-i\bar s\right)=\zeta(\bar\rho)=0. \tag{1.3}
\]

Consequently both evaluations of `E(f)` that occur in the source spectral
Weil pairing vanish.  Thus, on the source test class,

\[
 QW(\mathcal E(f),g)=QW(g,\mathcal E(f))=0.        \tag{1.4}
\]

This is a two-sided algebraic radical statement.  It does not assume RH and
does not use a table of zeros.  There is no contradiction with strictness of
a compactly supported Weil form under RH: the nonzero global function
`E(f)` is not compactly supported in a two-sided multiplicative interval.

## 2. New bounded-variation extension

The zero extension of a finite prolate eigenfunction is generally not
Schwartz: it has endpoint jumps.  The following extension is therefore
needed before (1.4) can be used for the finite prolate state.

**Lemma 1 (BV Mellin extension).**  Suppose `f` is even, compactly supported,
piecewise `C^1` and of bounded variation, is `O(x^2)` at zero, and satisfies

\[
 f(0)=0,\qquad \int_{\mathbb R}f(x)\,dx=0.         \tag{2.1}
\]

Then `k=E(f)` is `O(u^(1/2))` at zero, vanishes for all sufficiently large
`u`, belongs to `L^2(R_+^*,du/u)`, and (1.2) holds throughout
`Im z>-1/2`.  In particular both Mellin evaluations in (1.3) vanish at every
nontrivial-zero parameter.  This lemma alone does not extend the source's
closed Weil form to the noncompact BV vector `k`.

**Proof.**  The bounded-variation Riemann-sum estimate in Lemma 6.1 of the
locked source gives `E(f)(u)=O(u^(1/2))` at zero.  Compact support makes the
sum vanish for large `u`, hence gives the stated `L^2` property and makes its
Mellin transform holomorphic for `Im z>-1/2`.

For `Im z>1/2`, absolute convergence and the substitution `v=nu` give

\[
 \begin{aligned}
 \widehat k(z)
 &=\sum_{n\ge1}\int_0^\infty
      u^{1/2}f(nu)u^{-iz}\,\frac{du}{u}\\
 &=\sum_{n\ge1}n^{-1/2+iz}
      \int_0^\infty f(v)v^{1/2-iz}\,\frac{dv}{v}\\
 &=\zeta\!\left(\frac12-iz\right)m_f(z).
 \end{aligned}                                                   \tag{2.2}
\]

The Mellin integral `m_f` is holomorphic at least for `Im z>-5/2`.
At the only zeta pole in the larger half-plane, `z=i/2`, condition (2.1)
gives `m_f(i/2)=0`.  The right side of (2.2) is therefore holomorphic for
`Im z>-1/2`.  The identity theorem proves (2.2) there.  Equation (1.3) then
proves the two zero evaluations.  No distributional Poisson formula at an
endpoint is needed for this argument.  \(\square\)

The `O(x^2)` hypothesis is automatic for an even `C^2` combination that
vanishes at zero.  Endpoint jumps are allowed.

## 3. An exact state-invisible codimension-two correction

The source-normalized state `h_lambda` made from labels 0 and 4 has zero
integral, but it need not vanish exactly at zero.  Thus it is not, as written,
in the domain of the radical construction.  This can be repaired without
changing the semilocal arithmetic state at all.

Fix once and for all

\[
 \phi(x)=
 \begin{cases}
  \exp\!\left(1-\dfrac1{1-x^2}\right),&|x|<1,\\
  0,&|x|\ge1,
 \end{cases}
 \qquad
 \psi(x)=2\phi(2x)-\phi(x).                       \tag{3.1}
\]

Then `phi` and `psi` are even and smooth, `psi(0)=1`, and
`integral_R psi=0`.  Set

\[
 a_\lambda=\frac1{2\lambda},\qquad
 \psi_\lambda(x)=\psi(x/a_\lambda),\qquad
 \widetilde h_\lambda(x)
   =h_\lambda(x)-h_\lambda(0)\psi_\lambda(x).    \tag{3.2}
\]

The correction is supported in `|x|<a_lambda<lambda^(-1)`, and

\[
 \widetilde h_\lambda(0)=0,
 \qquad
 \int_{\mathbb R}\widetilde h_\lambda(x)\,dx=0. \tag{3.3}
\]

For every `u` in `[lambda^(-1),lambda]` and every integer `n>=1`,
`nu>=lambda^(-1)>a_lambda`.  Hence

\[
 C_\lambda\mathcal E(\widetilde h_\lambda)
 =C_\lambda\mathcal E(h_\lambda)                 \tag{3.4}
\]

pointwise.  The same equality holds after inversion symmetrization and after
`P_N`.  Thus (3.2) preserves the exact producer state, every finite matrix
diagnostic, and the locked source normalization—not just their limits.

The source estimate `h_lambda -> h` and `h(0)=0` gives
`h_lambda(0)->0`, so the fixed-amplitude bump profile in (3.2) does not alter
the limiting scalar.  Its `L^2` size is explicitly
`|h_lambda(0)| sqrt(a_lambda) ||psi||_2`, and its total variation is
`|h_lambda(0)| Var(psi)`.

For comparison with compressed-Fourier diagnostics, if
`v_n=h_{n,lambda}(0)` and

\[
 \int h_{n,\lambda}=(-1)^{n/2}\chi_n v_n,
 \qquad 0<\chi_n<1,
\]

then the uncorrected source state satisfies the exact boundary formula

\[
 h_\lambda(0)=a_4v_4\frac{\chi_0-\chi_4}{\chi_0}. \tag{3.5}
\]

An optional prolate-only cross-check is obtained from

\[
 g_\lambda=h_{2,\lambda}-\frac{\int h_{2,\lambda}}
                                  {\int h_{0,\lambda}}h_{0,\lambda},
 \qquad
 f_\lambda^{\rm pro}=h_\lambda-
       \frac{h_\lambda(0)}{g_\lambda(0)}g_\lambda.              \tag{3.6}
\]

Here

\[
 \frac{h_\lambda(0)}{g_\lambda(0)}
 =a_4\frac{v_4}{v_2}
       \frac{\chi_0-\chi_4}{\chi_0+\chi_2}.       \tag{3.7}
\]

This also satisfies both codimension-two conditions, but unlike (3.2) it
changes the finite arithmetic state.  It is therefore a regression
cross-check, not the binding correction.

## 4. Spectral-tail leakage identity

Let `C_lambda` multiply by the characteristic function of
`I_lambda=[lambda^(-1),lambda]`, let `Jg(u)=g(u^(-1))`, and put
`S=(1+J)/2`.  Let `P_N` be the locked **orthogonal** log-Fourier projection
in `L^2(I_lambda,du/u)`, extended by zero outside the window.  Both
`C_lambda` and `P_N` commute with `J`.

For `k=E(tilde h_lambda)`, put

\[
 K=Sk,\qquad p_N=P_NC_\lambda K,
\]

and retain the combined remainder

\[
 \begin{aligned}
 R_N&=K-p_N\\
 &=S(1-C_\lambda)k
   +(C_\lambda-P_NC_\lambda)K\\
 &=:R_N^{\rm out}+R_N^{\rm proj}.                 \tag{4.1}
 \end{aligned}
\]

Inversion preserves the zero-parameter set, so both Mellin evaluations of
`K` vanish at every zero parameter.  Hence

\[
 \widehat R_N(s)=-\widehat p_N(s),\qquad
 \widehat R_N(\bar s)=-\widehat p_N(\bar s).      \tag{4.2}
\]

The compact piecewise-smooth function `p_N` has multiplicative transform
`O(1/|s|)` uniformly in the critical strip.  Each quadratic or polarized
summand contains two such factors and is therefore `O(1/|s|^2)`.  Together
with the classical zero-counting bound, this makes the bilinear spectral Weil
sum absolutely convergent.  No absolute convergence of a linear zero sum is
claimed.
Equation (4.2) therefore defines an absolutely convergent spectral-tail
pairing for `R_N` and proves

\[
 QW_\lambda(p_N,p_N)=\mathcal W_Z(R_N,R_N).        \tag{4.3}
\]

More generally the polarized identity holds for two corrected states.
Crucially, (4.3) retains all four terms

\[
 \begin{aligned}
 \mathcal W_Z(R_N,R_N)
 &=\mathcal W_Z(R_N^{\rm out},R_N^{\rm out})
  +\mathcal W_Z(R_N^{\rm out},R_N^{\rm proj})\\
 &\quad+\mathcal W_Z(R_N^{\rm proj},R_N^{\rm out})
  +\mathcal W_Z(R_N^{\rm proj},R_N^{\rm proj}).   \tag{4.4}
 \end{aligned}
\]

The cross terms must not be discarded or bounded separately before their
cancellation is understood.

For the finite residual, let `a=||p_N||`, `kappa=p_N/a`, and let
`ell_R` be the Riesz vector on `E_N` of the functional
`v -> W_Z(v,R_N)`.  This cross pairing is also absolutely convergent because
at every zero evaluation `R_N=-p_N`, so its summand again has two
`O(1/|s|)` compact factors.  Since the Mellin evaluations of `K` vanish,

\[
 (Q_{\lambda,N}-q)\kappa
 =-\frac1a(1-|\kappa\rangle\langle\kappa|)\ell_R,
 \qquad
 r=\frac{\|(1-|\kappa\rangle\langle\kappa|)\ell_R\|}{a}. \tag{4.5}
\]

Equation (4.5) is an exact cancellation-preserving residual decomposition.
It uses no stored Weil eigenvector.

## 5. Exact time/frequency leakage and the positive comparison model

The spectral-tail identity becomes geometrically explicit before the Weil
distribution is applied.  Let `P_lambda^a` multiply additive functions by
the characteristic function of `[-lambda,lambda]`, and let

\[
 T_\lambda r(u)=1_{u>\lambda}\mathcal E(r)(u),
 \qquad
 \beta_\lambda(u)=\frac{1_{u>\lambda}}{2\sqrt u}. \tag{5.1}
\]

Poisson summation, with midpoint values at sampled discontinuities, gives the
following boundary formula almost everywhere (and pointwise away from the
countable discontinuity set):

\[
 \mathcal E(f)(u)=\mathcal E(\widehat f_a)(u^{-1})
 +\frac12\left(u^{-1/2}\widehat f_a(0)-u^{1/2}f(0)\right). \tag{5.2}
\]

When `integral f=widehat f_a(0)=0`, the outer multiplicative tail is, almost
everywhere,

\[
 (1-C_\lambda)\mathcal E(f)
 =T_\lambda(1-P_\lambda^a)f
 +J\left[T_\lambda(1-P_\lambda^a)\widehat f_a
          -f(0)\beta_\lambda\right].             \tag{5.3}
\]

Thus the zero integral is mandatory: otherwise (5.3) also contains a
non-`L^2(du/u)` high-tail multiple of `sqrt(u)`.  For a time-limited source,
the first term in (5.3) is zero.  For the corrected state (3.2)--(3.3),
`f(0)=0`
as well, and the formula reduces to

\[
 (1-C_\lambda)\mathcal E(\widetilde h_\lambda)
 =J T_\lambda(1-P_\lambda^a)
       \widehat{\widetilde h}_{\lambda,a}.        \tag{5.4}
\]

This is the exact bridge from the multiplicative outer tail to additive
frequency leakage.

Put

\[
 H_f=T_\lambda(1-P_\lambda^a)\widehat f_a-f(0)\beta_\lambda.
\]

For a time-limited, zero-integral `f`, the supports of `H_f` and `JH_f`
are disjoint.  Since `P_N` is the orthogonal `L^2(du/u)` projection, the
inversion-even tail and the finite projection remainder have the positive
`L^2` identities

\[
 \|S(1-C_\lambda)\mathcal E(f)\|_2^2
   =\frac12\|H_f\|_2^2,                           \tag{5.5}
\]

and

\[
 \|R_N\|_2^2
 =\frac12\|H_f\|_2^2
  +\|(C_\lambda-P_NC_\lambda)S\mathcal E(f)\|_2^2. \tag{5.6}
\]

Also `||beta_lambda||_2^2=1/(4lambda)`.  Equations (5.5)--(5.6) give an
explicit positive prolate concentration model for a possible preconditioner.
They do **not** identify the Weil tail pairing in (4.3) with an `L^2` norm.

There is also a gauge issue.  Every even correction supported strictly in
`|x|<lambda^(-1)` lies in the kernel of `C_lambda E`, although its additive
frequency leakage can be made large.  Thus the raw right side of (5.6)
depends on the chosen global representative even when the finite arithmetic
state does not.  Any preconditioner built from it must either use the
explicitly locked bump (3.1)--(3.2), minimize over this kernel class, or be
reformulated in the quotient of multiplicative remainders by global
zero-evaluation vectors.  The raw multiplicative remainder itself also
changes with the representative; only its zero-evaluation pairing is
invariant.  No representative-independent `L2` equality with `QW_lambda` is
possible without a gauge or quotient choice.

For the uncorrected source combination, the exact boundary defect is (3.5),
and orthogonality of the prolate modes gives

\[
 \|(1-P_\lambda^a)\widehat h_{\lambda,a}\|_2^2
 =|a_4|^2(1-\chi_4^2)+|a_{0,\lambda}|^2(1-\chi_0^2). \tag{5.7}
\]

The boundary term in (5.3), the frequency leakage (5.7), the hard-endpoint
passage, and the log-Fourier projection error must all remain explicit.

## 6. Circularity audit and what remains

The zero sum in (4.3)--(4.5) proves the identity, but it is not an allowed
route to the required quantitative bound: estimating it from an assumed list
of real zeros would be circular.  Subsequent notes rewrite the combined
functional through the explicit pole, archimedean, and von Mangoldt blocks
and control P--P plus both mixed O--P/P--O terms for the actual corrected
combined state.  The complete signed O--O expression remains the quantitative
radical-remainder obstruction.

Likewise, positivity of `W_Z(R,R)` cannot be inferred from (4.3).  It becomes
a sum of absolute squares only after all zero parameters are known to be
real.  Applying a Weil-form Cauchy--Schwarz inequality here would therefore
import the RH-level positivity that the project is trying to prove.

Connes's positive cutoff trace does not remove this obstruction.  Its global
trace-formula limit to the Weil distribution is stated in the locked 1999
source as an RH-equivalent condition.  Over the real place the exact
time/frequency intersection is zero; the prolate modes supply only an
approximate intersection.  Identifying that positive trace object with the
finite prime-inclusive Weil form would be circular.

The noncircular next step is narrower: use the positive model (5.6) as an
explicit preconditioner and prove a direct relative bound for the single
combined signed distribution `pole - archimedean - prime`.  The prime sum in
the physical tail is not cut off at `lambda^2`; all far-prime,
archimedean, and pole cancellations have merely moved to the remainder and
must be controlled together.

Even a successful residual estimate would not settle the project.  Uniform
positive lower bounds for the shifted even complement and the full odd
sector, followed by the weighted resolvent estimate required in (5.2), remain
separate obligations.

## Sources

- A. Connes and C. Consani, *Spectral Triples and Zeta-Cycles*,
  arXiv:2106.01715v1: (1.1)--(1.4), (3.1)--(3.2), Lemma 6.1, and (6.4).
- A. Connes, *Trace formula in noncommutative geometry and the zeros of the
  Riemann zeta function*, arXiv:math/9811068v1: Section III (6), (18),
  (19), and the Poisson/Mellin argument in Appendix I.
- A. Connes, C. Consani, and H. Moscovici, *Zeta zeros and prolate wave
  operators*, arXiv:2310.18423v2: (29) and Proposition 3.6.
- A. Connes and C. Consani, *BC-system, absolute cyclotomy and the
  quantized calculus*, arXiv:2112.08820v1 / EMS Surveys in Mathematical
  Sciences 9 (2022): published Section 4.5, (26)--(27).

Exact versions and hashes are serialized in `P1_SOURCE_LOCK.json`.
