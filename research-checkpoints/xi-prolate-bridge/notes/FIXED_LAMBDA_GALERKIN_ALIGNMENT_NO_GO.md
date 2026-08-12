# Fixed-lambda Galerkin alignment no-go

## 0. Scope, source lock, and outcome

This note answers one narrow question about the pinned finite Weil matrices:
what can be obtained, at a fixed source parameter `lambda`, by sending the
outer Fourier cutoff `N` to infinity?  The exact answer is that the finite
matrices converge spectrally to the compact-resolvent semilocal source
operator.  If that infinite operator has a simple isolated even ground, its
finite even ground lines converge to that line.  They do not thereby converge
to the prolate comparison state.  In particular, large `N` only removes
Galerkin error; it does not create ground alignment.

The binding source remains Connes--Consani--Moscovici, *Zeta Spectral
Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The locked conventions are

\[
 L=2\log\lambda,\qquad I_\lambda=[-L/2,L/2],
 \qquad
 \widehat f(z)=\int_{I_\lambda}f(t)e^{-izt}\,dt,             \tag{0.1}
\]

with Lebesgue measure, zero extension before source translations,

\[
 V_n(t)={(-1)^n\over\sqrt L}e^{2\pi int/L},
 \qquad JV_n=V_{-n}.                                        \tag{0.2}
\]

Every actual-source matrix below is assembled as

\[
 Q=W_{0,2}-W_R-W_p,                                         \tag{0.3}
\]

so the minus sign on the prime block in source equation (3.19) is retained,
and the finite von Mangoldt inventory is inclusive through `1<n<=lambda^2`.
No zero table and no assumption of global Weil positivity is used.

The two diagonal families in Sections 5--6 are exact structural
countermodels.  They satisfy the source Cauchy displacement, inversion,
boundary determinant, logarithmic coercivity, and compact-resolvent
properties, but they are not the pinned arithmetic Weil matrix and their
finite-support anchors are not the actual source-normalized prolate state.
They show exactly what cannot follow from the present structural inputs.
This note proves no signed actual-source alignment rate, no locally uniform
limit to `Xi`, no equation (5.2) of `DIRECT_RH_ATTACK.md`, and no conclusion
about the Riemann hypothesis.  The project status remains `P0_INVALIDATED`.

## 1. The fixed-lambda infinite source operator

Fix `lambda>1`.  Source Lemma 5.1 gives, on every symmetric finite mode
range, entries which are restrictions of two sequences indexed by all
integers:

\[
 Q_{nn}=a_n,\qquad
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),
 \qquad a_{-n}=a_n,\quad b_{-n}=-b_n.              \tag{1.1}
\]

With

\[
 H_{nm}=\begin{cases}(n-m)^{-1},&n\ne m,\\0,&n=m,\end{cases}
 \qquad D_b=\operatorname {diag}(b_n),              \tag{1.2}
\]

the infinite form has the exact source-Cauchy representation

\[
 Q_\lambda=D_a+B_\lambda,
 \qquad B_\lambda=D_bH-HD_b.                       \tag{1.3}
\]

Equations (2.3)--(2.4) of
`notes/COMPACT_PROJECTION_WEIL_BOUND.md` prove that `H` has norm `pi`, that
`b_n` is uniformly bounded at fixed `lambda`, and hence that `B_lambda` is a
bounded self-adjoint operator.  Equations (2.5), (2.10), and (2.7)--(2.11)
of that note prove

\[
 a_n=\log|n|+O_\lambda(1),
 \qquad
 \mathcal D_\lambda=
 \left\{x:\sum_{n\in\mathbb Z}\log(2+|n|)|x_n|^2<\infty\right\}       \tag{1.4}
\]

as the closed form domain, and identify this closure with the complete
signed semilocal source form.  In particular, finite centered Fourier sums
are a form core.  The same conclusion is recorded explicitly in the proof
of Theorem 2.3 of `notes/ODD_NU_TRANSVERSE_SIGN_ATTACK.md`: the form is
semibounded, has compact resolvent, and centered trigonometric polynomials
are a form core.

For clarity, compactness does not use a sign of the Weil form.  After a
fixed scalar shift, the form norm is equivalent to

\[
 \sum_n\{1+\log(2+|n|)\}|x_n|^2.                  \tag{1.5}
\]

Its unit ball has uniformly small ordinary `l2` tails, so its embedding into
`l2(Z)` is compact.  Adding the bounded operator in (1.3) preserves this
property.  Since (1.1) commutes with `J`, the inversion-even restriction
`Q_(lambda,+)` is also semibounded with compact resolvent.

## 2. Exact fixed-parameter Galerkin theorem

Let

\[
 E_{N,+}=\operatorname {span}\{V_n:-N\le n\le N\}\cap H_+,
 \qquad Q_{\lambda,N,+}=P_{N,+}Q_{\lambda,+}P_{N,+}.          \tag{2.1}
\]

Write the eigenvalues, with multiplicity, as

\[
 \mu_{1,N}\le\mu_{2,N}\le\cdots\le\mu_{N+1,N},
 \qquad
 \mu_1\le\mu_2\le\cdots                                  \tag{2.2}
\]

for the finite and infinite even operators respectively.

### Theorem 2.1 (fixed-lambda Ritz convergence)

For every fixed `k`, once `N+1>=k`,

\[
 \boxed{\mu_{k,N}\downarrow\mu_k\quad(N\to\infty).}         \tag{2.3}
\]

If an infinite eigenvalue cluster

\[
 \mu_j=\cdots=\mu_{j+m-1}
\]

is isolated from its neighboring eigenvalues, the corresponding
`m`-dimensional Ritz subspace converges in gap to the infinite eigenspace.
In particular, if

\[
 \boxed{\mu_1<\mu_2,}                                      \tag{2.4}
\]

then `mu_(1,N)` is simple for every sufficiently large `N`.  Unit finite
ground vectors `phi_N` can be phased so that

\[
 \boxed{\phi_N\longrightarrow\phi
        \quad\hbox{in `L2` and in the shifted form norm},}   \tag{2.5}
\]

where `phi` spans the infinite even ground line.

**Proof.**  The spaces `E_(N,+)` are nested.  The min--max principle makes
each finite Ritz value nonincreasing and bounded below by its infinite
counterpart.  The form-core statement in Section 1 approximates every
finite-dimensional span of infinite eigenvectors in form norm; applying
min--max to those approximating spans gives the reverse limiting
inequality, proving (2.3).

For an isolated cluster, normalized Ritz vectors have bounded shifted form
norm.  Compactness of the form-domain embedding gives strongly convergent
`L2` subsequences.  Testing the Galerkin equations against the common core
identifies every limit with the target infinite eigenspace.  Min--max fixes
the cluster dimension, so the subspace gap tends to zero.  Under (2.4),
both `mu_(1,N)` and `mu_(2,N)` converge to distinct limits, hence their gap
is eventually positive.  The limiting ground line is unique, and energy
convergence upgrades (2.5) to shifted-form convergence.  \(\square\)

The hypothesis (2.4) is essential.  Compact resolvent guarantees a
finite-dimensional bottom eigenspace, not that its dimension is one.  The
current actual-source estimates do not prove (2.4) on an unbounded
`lambda` schedule.  In particular,
`notes/POSITIVITY_IMPROVING_SOURCE_GROUND_OBSTRUCTION.md` proves that the
standard Perron--Frobenius/Beurling--Deny route fails once the source
interval leaves its small-parameter regime.

## 3. Limit of the alignment observable

Let `X_lambda` be the fixed inversion-even prolate comparison state before
the outer Fourier projection.  Its membership in the logarithmic form
domain is recorded in Section 1 of
`notes/OUTER_PROJECTION_RADICAL_REDUCTION.md`.  Put

\[
 a_N=\|P_NX_\lambda\|,
 \qquad \kappa_N={P_NX_\lambda\over a_N},
 \qquad a_\infty=\|X_\lambda\|,
 \qquad \kappa_\infty={X_\lambda\over a_\infty}.            \tag{3.1}
\]

Coordinate truncation in (1.4) gives

\[
 \kappa_N\longrightarrow\kappa_\infty
 \quad\hbox{in `L2` and in form norm}.                      \tag{3.2}
\]

Assume (2.4) and the nonorthogonality

\[
 c_\infty=\langle\kappa_\infty,\phi\rangle\ne0.            \tag{3.3}
\]

For all sufficiently large `N`, let `x_N` be the unique representative of
the finite ground line with

\[
 \langle\kappa_N,x_N\rangle=1,                              \tag{3.4}
\]

and normalize `x_infinity` on the infinite ground line in the same way.
Equations (2.5), (3.2), and (3.3) imply

\[
 \boxed{x_N\longrightarrow x_\infty
        \quad\hbox{in `L2` and in form norm}.}               \tag{3.5}
\]

Fix a centered low cutoff `M`; `M=ceil(lambda)` is fixed while `N` tends to
infinity.  For `N>=M`, set

\[
 p_N=P_{M,+}\kappa_N,
 \qquad
 \mathcal L_{M,N}=\operatorname {Ran}P_{M,+}\cap p_N^\perp. \tag{3.6}
\]

Assume also that `p_infinity` is nonzero.  Then

\[
 P_{\mathcal L_{M,N}}
 =P_{M,+}-{p_Np_N^*\over\|p_N\|^2}
 \longrightarrow
 P_{\mathcal L_{M,\infty}}                                  \tag{3.7}
\]

in operator norm.  Therefore the finite observable from
`notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md` has the exact limit

\[
 \boxed{
 A_{M,N}=\|P_{\mathcal L_{M,N}}x_N\|^2
 \longrightarrow
 A_{M,\infty}=\|P_{\mathcal L_{M,\infty}}x_\infty\|^2.}     \tag{3.8}
\]

Nothing in Galerkin convergence forces the right side of (3.8) to vanish.

\[
 A_{M,\infty}=0
 \quad\Longleftrightarrow\quad
 P_{M,+}x_\infty\in\mathbb C P_{M,+}\kappa_\infty.          \tag{3.9}
\]

Thus vanishing is an exact relative-orientation statement about the
infinite source ground, not a consequence of a large outer cutoff.  The
signed response `S_(M,N)-k_(00,N)` converges in the same way, using the
identity

\[
 S_M-k_{00}=A_M+{|h_M|^2\over k_{00}}
                     -2\operatorname {Re}h_M                 \tag{3.10}
\]

from the natural-cutoff note.  It converges to the corresponding infinite
signed response; it does not automatically converge to zero.

If (3.3) fails, the coefficient normalization in (3.4) becomes singular.
That is an additional obstruction, not a way to select a favorable line.
If `p_infinity=0`, the normalized rank-one projectors in (3.7) need not
converge without an additional directional hypothesis; this is another
obstruction, not an automatic zero branch.
If the infinite bottom is multiple, Theorem 2.1 controls its complete
spectral subspace but supplies no canonical limiting `x_N` inside it.

### 3.1 Exact Schur-kernel criterion for zero limiting alignment

The condition in (3.9) can be written without an infinite ground vector in
the final formula.  Use the orthonormal even basis

\[
 e_0=V_0,\qquad e_n={V_n+V_{-n}\over\sqrt2}\quad(n\geq1).
\]

The source-Cauchy coefficients in (1.1) give the exact infinite even matrix

\[
 (Q_+)_{00}=a_0,\qquad
 (Q_+)_{0n}={\sqrt2\,b_n\over n},\qquad
 (Q_+)_{nn}=a_n+{b_n\over n},                              \tag{3.11}
\]

\[
 (Q_+)_{nm}={2(nb_n-mb_m)\over n^2-m^2}
 \quad(n,m\geq1,\ n\ne m).                                \tag{3.12}
\]

Let `P=P_(M,+)`, `R=I-P`, `p=P kappa_infinity`, and suppose the infinite
even ground `phi` is simple, has eigenvalue `mu`, and satisfies `P phi!=0`.
The high compression

\[
 Q_H=RQ_+R\big|_{R H_+}
\]

obeys

\[
 \mu<\inf\sigma(Q_H).                                      \tag{3.13}
\]

Indeed, `Q_+-mu I` is nonnegative.  Compact resolvent makes the bottom of
the finite-codimensional high compression an eigenvalue.  Equality in
(3.13) would therefore give a ground vector in `R H_+`, linearly
independent of `phi` because `P phi!=0`, contradicting simplicity.

Consequently the Feshbach--Schur complement

\[
 \boxed{
 F_M(\mu)=P(Q_+-\mu I)P
   -PQ_+R(Q_H-\mu I)^{-1}RQ_+P}                            \tag{3.14}
\]

is a nonnegative finite matrix and

\[
 \boxed{\ker F_M(\mu)=\mathbb C P\phi.}                   \tag{3.15}
\]

To see this, the `mu`-harmonic lift of a low vector `y` is

\[
 E_\mu y=y-(Q_H-\mu I)^{-1}RQ_+Py,
\]

and direct block multiplication gives

\[
 \langle y,F_M(\mu)y\rangle
 =\langle E_\mu y,(Q_+-\mu I)E_\mu y\rangle.              \tag{3.16}
\]

The right side vanishes exactly when the lift lies on the simple ground
line.  Since `p!=0`, (3.9) is therefore equivalent to each of the exact
conditions

\[
 \boxed{
 A_{M,\infty}=0
 \Longleftrightarrow F_M(\mu)p=0
 \Longleftrightarrow \langle p,F_M(\mu)p\rangle=0.}        \tag{3.17}
\]

The last scalar equivalence uses the proved nonnegativity of `F_M(mu)`; it
is not an assumption of global Weil positivity.

Equations (3.11)--(3.14) also make the condition a complete Fourier
recurrence.  Write `p=(p_0,...,p_M)` and

\[
 t=-(Q_H-\mu I)^{-1}RQ_+Pp=(t_{M+1},t_{M+2},\ldots).       \tag{3.18}
\]

Then (3.17) holds exactly when

\[
 (a_0-\mu)p_0
 +\sum_{j=1}^M{\sqrt2 b_j\over j}p_j
 +\sum_{j>M}{\sqrt2 b_j\over j}t_j=0,                     \tag{3.19}
\]

and, for every `1<=n<=M`,

\[
 {\sqrt2 b_n\over n}p_0+\left(a_n+{b_n\over n}-\mu\right)p_n
 +\sum_{\substack{1\leq j\leq M\\j\ne n}}
       {2(nb_n-jb_j)\over n^2-j^2}p_j
 +\sum_{j>M}{2(nb_n-jb_j)\over n^2-j^2}t_j=0.             \tag{3.20}
\]

The prolate equations do not imply (3.17)--(3.20).  They diagonalize the
time--frequency concentration operator before the arithmetic transform;
the locked combination uses two different prolate eigenvalues, and its
Fourier coordinates do not satisfy the source-Cauchy ground recurrence.
The arithmetic coefficients `a_n,b_n`, including the complete signed prime
inventory, enter (3.19)--(3.20) only through `Q_+` and its high resolvent.
The pinned source itself calls `k_lambda` an educated guess and identifies
the comparison with the true lowest eigenfunction as the main missing
step.  The strict finite-parameter concentration defect
`0<1-chi_(4,lambda)^2` explains why an extremely small nonzero limiting
misalignment is plausible, but it neither proves that (3.17) fails nor
rules out an accidental low-coordinate equality.

### 3.2 Quantitative finite-to-infinite error theorem

The qualitative limit (3.8) has the following explicit a posteriori form.
Normalize the simple infinite ground `phi` and its finite Ritz ground
`phi_N` to unit norm and choose their phases with nonnegative overlap.  Put

\[
 R_N=I-P_N,\qquad
 \tau_N=\|R_N\phi\|,
\]

\[
 e_N^2=\langle R_N\phi,(Q_+-\mu I)R_N\phi\rangle,
 \qquad
 \epsilon_N={e_N^2\over1-\tau_N^2}.                       \tag{3.21}
\]

For `v_N=P_N phi` and `y_N=v_N/||v_N||`, the weak eigen-equation gives the
exact shifted-form tail identity

\[
 \langle v_N,(Q_+-\mu I)v_N\rangle
 =\langle R_N\phi,(Q_+-\mu I)R_N\phi\rangle=e_N^2.         \tag{3.22}
\]

Thus the Rayleigh excess of `y_N` is exactly `epsilon_N`.  If

\[
 g_N=\mu_{2,N}-\mu_{1,N}>0,
\]

the finite spectral expansion and min--max principle give

\[
 \sin^2\angle(y_N,\phi_N)\leq{\epsilon_N\over g_N}.       \tag{3.23}
\]

If `g=mu_2-mu>0` is the infinite simple-ground gap, then

\[
 g_N\geq g-\epsilon_N,                                    \tag{3.24}
\]

because `mu_(2,N)>=mu_2` and
`mu_(1,N)<=<y_N,Q_+y_N>=mu+epsilon_N`.  Hence, whenever
`epsilon_N<g`,

\[
 \boxed{
 \|\phi_N-\phi\|
 \leq
 \sqrt{2\left(1-\sqrt{1-\tau_N^2}\right)}
 +\sqrt{{2\epsilon_N\over g_N}}
 \leq\sqrt2\,\tau_N+
       \sqrt{{2\epsilon_N\over g-\epsilon_N}}.}           \tag{3.25}
\]

This separates the ordinary ground tail from its shifted-form energy; one
cannot replace `e_N` by the prolate projection error.

There is also no hidden motion of the low anchor line.  For unit
`kappa=kappa_infinity`, set

\[
 \sigma_N=\|R_N\kappa\|,
 \qquad \kappa_N={P_N\kappa\over\|P_N\kappa\|}.
\]

For every `N>=M`, `P kappa_N` is a nonzero scalar multiple of `P kappa`, so
the projector onto its orthogonal low complement is exactly independent of
`N`, not merely convergent.  Moreover

\[
 \|\kappa_N-\kappa\|
 =\sqrt{2\left(1-\sqrt{1-\sigma_N^2}\right)}
 \leq\sqrt2\,\sigma_N.                                    \tag{3.26}
\]

Let

\[
 c=|\langle\kappa,\phi\}|>0,\qquad
 \eta_N=\|\phi_N-\phi\|,
 \qquad \zeta_N=\|\kappa_N-\kappa\|.
\]

If `eta_N+zeta_N<c/2`, the coefficient-normalized lines

\[
 x_N={\phi_N\over\langle\kappa_N,\phi_N\rangle},
 \qquad
 x_\infty={\phi\over\langle\kappa,\phi\rangle}
\]

satisfy

\[
 \|x_N-x_\infty\|
 \leq D_N:={2\eta_N\over c}
       +{2(\eta_N+\zeta_N)\over c^2},                     \tag{3.27}
\]

and therefore

\[
 \boxed{
 |A_{M,N}-A_{M,\infty}|\leq{3D_N\over c}.}                \tag{3.28}
\]

The present point data do not instantiate (3.28).  They report the
`L2` projection tail of the prolate anchor, not the unknown infinite-ground
shifted-form tail `e_N`; substituting one for the other would assume the
alignment being sought.  Nor is there a certified positive infinite gap,
while the observed finite gaps are extremely small point values.  Thus a
decreasing finite sequence `A_(M,N)` presently encloses neither zero nor a
nonzero value of `A_(M,infinity)`.

## 4. Transform convergence and the valid diagonal principle

On every compact `K` in the complex plane, Cauchy--Schwarz and (0.1) give

\[
 \sup_{z\in K}|\widehat{x_N}(z)-\widehat{x_\infty}(z)|
 \leq \sqrt L\,
 e^{(L/2)\sup_{z\in K}|\operatorname {Im}z|}
 \|x_N-x_\infty\|_2.                                    \tag{4.1}
\]

Hence fixed-lambda Galerkin ground transforms converge locally uniformly to
the transform of the infinite source ground.  They converge to the prolate
transform only if that infinite target already has the required relation to
`kappa_infinity`.  In the strongest full-transform version, injectivity of
the Fourier transform on the compact interval gives

\[
 \widehat{x_N}-\widehat{\kappa_N}\longrightarrow0
 \text{ locally uniformly}
 \quad\Longleftrightarrow\quad
 x_\infty=\kappa_\infty.                                  \tag{4.2}
\]

There is one valid non-effective diagonal argument.  Let `lambda_j` tend to
infinity.  Suppose, separately, that for every `j`:

1. the infinite even ground is simple and has nonzero overlap with
   `kappa_infinity`;
2. its infinite alignment already satisfies
   `A_(ceil(lambda_j),infinity)=O(lambda_j^(-1))`; and
3. its normalized transform already satisfies the projective comparison
   estimates needed for the locally uniform `Xi` limit.

Then (2.5), (3.8), and (4.1) allow a non-effective choice of `N_j` making
the finite-to-infinite errors smaller than any prescribed positive
tolerance.  This diagonal choice transfers an already-proved infinite
statement.  It proves none of the three premises.  In particular, premise
2 is the surviving signed arithmetic ground-alignment problem in another
form.

## 5. Exact compact-resolvent counterfamily with stable alignment

The finite counterfamily in Section 7 of
`notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md` can be made into one
infinite logarithmically coercive operator.  Let

\[
 \mathcal H_n=\sum_{j=1}^n{1\over j},                       \tag{5.1}
\]

fix real `U` and `0<epsilon<G`, and take

\[
 b_n^{\rm C}=0,\qquad
 a_0=U,\qquad a_{\pm1}=U+\epsilon,\qquad
 a_{\pm n}=U+G+\mathcal H_n\quad(n\ge2).                   \tag{5.2}
\]

All off-diagonal entries obey the exact Cauchy formula

\[
 Q_{nm}={b_n^{\rm C}-b_m^{\rm C}\over n-m}=0.               \tag{5.3}
\]

The integral comparison

\[
 \log(n+1)\leq\mathcal H_n\leq1+\log n                     \tag{5.4}
\]

shows `a_n=log|n|+O(1)`.  Thus the infinite diagonal operator has the same
logarithmic form domain and compact-resolvent tail as the actual-source
operator.  Its finite parity blocks are

\[
 Q_{N,+}=\operatorname {diag}
 (U,U+\epsilon,U+G+\mathcal H_2,\ldots,U+G+\mathcal H_N),   \tag{5.5}
\]

\[
 Q_{N,-}=\operatorname {diag}
 (U+\epsilon,U+G+\mathcal H_2,\ldots,U+G+\mathcal H_N).     \tag{5.6}
\]

For every `N`, the boundary determinant identity is exact:

\[
 \det(Q_{N,-}-zI)
 =\langle\eta,\operatorname {adj}(Q_{N,+}-zI)e_0\rangle
 =(U+\epsilon-z)
   \prod_{n=2}^N(U+G+\mathcal H_n-z).                       \tag{5.7}
\]

Let

\[
 c={3\over5},\qquad s={4\over5},\qquad
 \kappa=ce_0+se_1^+,
 \qquad w=-se_0+ce_1^+.                                    \tag{5.8}
\]

For every `N>=M>=1`, the anchor tail beyond `M` is zero.  Exact arithmetic
gives

\[
 q=U+{16\over25}\epsilon,
 \qquad (Q-qI)\kappa={12\over25}\epsilon\,w,
 \qquad r={12\over25}\epsilon,                             \tag{5.9}
\]

\[
 u=\mu=U,qquad d=q-u={16\over25}\epsilon,
 \qquad {d\over r}={4\over3}.                              \tag{5.10}
\]

The active even complementary value at `u` is
`9*epsilon/25`, every high complementary value is
`G+mathcal H_n`, and the odd floor is `epsilon`.  Thus both shifted signs
are strict.  The coefficient-normalized ground is

\[
 x={5\over3}e_0,
 \qquad \langle\kappa,x\rangle=1.                           \tag{5.11}
\]

Since `P_M kappa=kappa`, one obtains, for every outer cutoff,

\[
 \boxed{A_{M,N}=\|P_{\mathcal L_M}x\|^2
       =\|x-\kappa\|^2={16\over9}.}                         \tag{5.12}
\]

This limit is stable and nonzero despite exact Cauchy structure, inversion,
the boundary identity, compact resolvent, logarithmic high coercivity, zero
anchor tail, strict signs, and bounded `d/r`.  No choice of a larger `N`
changes it.

## 6. Exact compact-resolvent counterfamily with a multiple bottom

Keep (5.1) and (5.3), but set

\[
 a_0=a_{\pm1}=U,
 \qquad a_{\pm n}=U+G+\mathcal H_n\quad(n\ge2),
 \qquad G>0.                                               \tag{6.1}
\]

For every `N>=1`,

\[
 Q_{N,+}=\operatorname {diag}
 (U,U,U+G+\mathcal H_2,\ldots,U+G+\mathcal H_N).            \tag{6.2}
\]

Its lowest even eigenvalue has multiplicity exactly two for every finite
section and for the infinite compact-resolvent operator.  The exact source
Cauchy formula and boundary determinant identity still hold.  Consequently,
logarithmic high coercivity and form-core convergence do not imply an
eventually simple even bottom.

## 7. Conclusion

For the actual pinned matrix, fixed-lambda Galerkin convergence is strong
and unconditional: it identifies the limiting compact-resolvent source
operator and transfers isolated spectral data to sufficiently large finite
sections.  What it cannot do is identify the infinite even ground with the
prolate comparison state, prove that ground is simple, or make the limiting
alignment in (3.8) small.  A non-effective outer diagonal is therefore a
valid error-removal device only after the infinite signed alignment and
transform comparison have been proved independently.  The open arithmetic
premise is not removed, and the status remains `P0_INVALIDATED`.
