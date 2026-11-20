# Odd third moment, transverse sign, and the limit of the jump argument

## 0. Claim boundary

This note asks what the fixed-parameter graph convergence and the exact
prime-power jump actually imply about the odd third-moment gate

\[
 \nu_\beta=\langle b,C_\beta b\rangle,
 \qquad
 C_\beta=P_{e^\perp}(Q-\beta I)P_{e^\perp}.
\]

There are two positive conclusions.

1. At every fixed locked parameter, the finite values `nu_(beta,N)` converge
   to an exact unprojected combined-form value.  Thus a strict unprojected
   sign, if proved independently, transfers to all sufficiently large finite
   Fourier cutoffs.
2. The finite transverse spaces are nested conforming subspaces of the exact
   pole complement.  An independently proved positive unprojected
   transverse floor therefore transfers without spectral pollution, and the
   finite inverse loads converge to the unprojected load.

The prime jump supplies neither independent input.  It proves that the
combined residual is nonzero and gives a logarithmically weighted dyadic
contribution of order `(log K)/K`; that contribution tends to zero.  Exact
odd-pole-compatible countermodels below have the same `1/k` jump tail and
the same positive logarithmic high operator while `nu_beta` has either sign.
Other models keep the entire pole Krylov data fixed while changing the
transverse floor, or keep `b` and `nu_beta` fixed while putting the inverse
load on opposite sides of the Schur threshold.

Consequently no positive `nu_beta`, transverse floor, inverse-load margin,
or explicit unbounded cutoff schedule follows from the jump theorem.  The
missing estimate is a cancellation-preserving low/transverse signed
comparison for the complete archimedean-minus-prime operator.  This note
does not prove either signed sector floor, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant convergence, or the Riemann hypothesis.
It assumes no zero list, global Weil positivity, or reality of the
nontrivial zeros.  The formal project state remains `P0_INVALIDATED`.

All conventions are those of `P0_SOURCE_LOCK.json`,
`ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md`, and
`ODD_JUMP_FINITE_KRYLOV_ATTACK.md`.  In particular,

\[
 \widehat f(t)=\int_{-\ell}^{\ell}f(x)e^{-itx}\,dx,
 \qquad {dt\over2\pi},
 \qquad L=2\ell=2\log\lambda,                         \tag{0.1}
\]

and the complete non-pole multiplier is

\[
 m_\lambda(t)=2\theta'(t)
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).                \tag{0.2}
\]

The endpoint is inclusive and the displayed minus sign is the source minus
sign on the prime block.  No block is estimated separately in the sign
identities below.

## 1. The exact unprojected third-moment quantity

Let `H_-` be the inversion-odd subspace of
`L2(I_lambda)`, with every function extended by zero before its real-line
Fourier transform is taken.  Let

\[
 A_\lambda=C_\lambda^*\mathcal F^*M_{m_\lambda}
                    \mathcal F C_\lambda              \tag{1.1}
\]

be the complete archimedean-minus-prime operator.  The odd pole vector and
its norm are

\[
 p(x)=\sinh(x/2),
 \qquad
 \mu=\|p\|^2={\lambda-\lambda^{-1}-2\log\lambda\over2}.
                                                               \tag{1.2}
\]

Thus the complete odd operator is

\[
 Q_\lambda=A_\lambda-2|p\rangle\langle p|.            \tag{1.3}
\]

Put

\[
 e={p\over\sqrt\mu},
 \qquad
 \tau={\langle p,A_\lambda p\rangle\over\mu},
 \qquad
 R=A_\lambda p-\tau p.                               \tag{1.4}
\]

Then `R` is orthogonal to `p`.  The exact pole-axis value and transverse
cross vector are

\[
 \alpha=\tau-2\mu,
 \qquad
 b={R\over\sqrt\mu}.                                 \tag{1.5}
\]

For a real shift `beta`, let `c_(lambda,beta)` be the closed form

\[
 \mathfrak c_{\lambda,\beta}[f,g]
 =\int_{\mathbb R}(m_\lambda(t)-\beta)
       \widehat f(t)\overline{\widehat g(t)}{dt\over2\pi}.
                                                               \tag{1.6}
\]

On `p^perp` this is also the form of `Q_lambda-beta*I`, because the
negative rank-one pole vanishes there.

### Lemma 1.1 (the residual belongs to the combined form domain)

For every fixed `lambda>1`, `R` belongs to the form domain of
`c_(lambda,beta)` for every real `beta`.

**Proof.**  The zero-extended pole belongs to `H^s(R)` for every
`0<s<1/2`.  The source-explicit multiplier estimate from the preceding note
implies, for every positive `epsilon`,

\[
 |m_\lambda(t)|\leq C_{\lambda,\epsilon}
                    (1+t^2)^{\epsilon/2}.             \tag{1.7}
\]

Hence `A_lambda` maps `H^s(I_lambda)` continuously into
`H^(s-epsilon)(I_lambda)` whenever
`0<epsilon<s<1/2`.  Choose `epsilon<s` so that `s-epsilon>0`.
Then `A_lambda p`, and therefore `R`, belongs to a positive Sobolev space.
Every positive Sobolev space embeds continuously into the logarithmically
weighted form domain in (1.6).  \(\square\)

### Theorem 1.2 (exact unprojected `nu` identity)

The unprojected third-moment gate is the single combined form

\[
 \boxed{
 \nu_{\lambda,\beta}^{\infty}
 ={1\over\mu}\mathfrak c_{\lambda,\beta}[R,R]
 ={1\over\mu}\int_{\mathbb R}(m_\lambda(t)-\beta)
                   |\widehat R(t)|^2{dt\over2\pi}.}   \tag{1.8}
\]

In particular, since the locked prime jump proves `R!=0`,

\[
 \boxed{
 \nu_{\lambda,\beta}^{\infty}>0
 \quad\Longleftrightarrow\quad
 {\mathfrak c_{\lambda,0}[R,R]\over\|R\|^2}>\beta.} \tag{1.9}
\]

**Proof.**  Since `b=R/sqrt(mu)` lies in `p^perp`, both projections in
`C_beta` act trivially in its quadratic form and the pole term in (1.3)
vanishes.  Equations (1.6) and (1.5) give (1.8).  The jump theorem gives
`R!=0`, so division by its norm gives (1.9).  \(\square\)

Equation (1.8) preserves the archimedean-minus-prime cancellation.  It is
not the sum of the absolute forms of the two blocks.  It also makes the
logical gap exact: a nonzero `R` does not determine on which side of `beta`
its combined-form Rayleigh quotient lies.

There is an equivalent spectral-measure statement.  If `omega_p` is the
probability spectral measure of `A_lambda` generated by `e=p/sqrt(mu)`, then

\[
 \tau=\int x\,d\omega_p(x),
 \qquad
 \boxed{
 \nu_{\lambda,\beta}^{\infty}
 =\int (x-\tau)^2(x-\beta)\,d\omega_p(x).}            \tag{1.10}
\]

Thus the positive residual spectral mass above `beta` must dominate the
negative residual spectral mass below `beta`, with the exact cubic weight.
The physical prime jump gives
`integral (x-tau)^2 d omega_p>0`; it gives no
location of that mass relative to `beta` and hence no sign in (1.10).

## 2. Fixed-parameter finite transfer

Use the centered source Fourier modes

\[
 \phi_k(x)=(-1)^kL^{-1/2}e^{2\pi ikx/L},
 \qquad
 P_N=\sum_{|k|\leq N}|\phi_k\rangle\langle\phi_k|.    \tag{2.1}
\]

Put

\[
 p_N=P_Np,
 \quad \mu_N=\|p_N\|^2,
 \quad e_N={p_N\over\sqrt{\mu_N}},                   \tag{2.2}
\]

\[
 \tau_N={\langle p_N,A_\lambda p_N\rangle\over\mu_N},
 \qquad
 r_N=P_NA_\lambda p_N-\tau_Np_N,
 \qquad
 b_N={r_N\over\sqrt{\mu_N}}.                        \tag{2.3}
\]

The exact finite odd matrix is

\[
 Q_N=P_NA_\lambda P_N-2|p_N\rangle\langle p_N|.      \tag{2.4}
\]

Let

\[
 G=p^\perp\cap H_-,
 \qquad
 G_N=P_NH_-\cap p_N^\perp.                           \tag{2.5}
\]

For a vector already in `P_NH_-`, orthogonality to `p_N` is exactly
orthogonality to `p`.  Therefore

\[
 \boxed{G_N=P_NH_-\cap G,\qquad G_N\subset G_{N+1}\subset G.} \tag{2.6}
\]

This elementary identity is important: the moving normalized pole vector
does not create a nonconforming transverse Galerkin space.

### Lemma 2.1 (one more graph step)

For every fixed `lambda>1`, there is a positive `delta<1/2` for which

\[
 \boxed{r_N\longrightarrow R\quad\hbox{in }H^\delta(I_\lambda).} \tag{2.7}
\]

Consequently,

\[
 \mathfrak c_{\lambda,\beta}[r_N,r_N]
 \longrightarrow
 \mathfrak c_{\lambda,\beta}[R,R].                  \tag{2.8}
\]

**Proof.**  Choose numbers

\[
 0<\epsilon/2<\delta<s-\epsilon<s<1/2.              \tag{2.9}
\]

so that the logarithmic multiplier is form-continuous on `H^delta`.
The periodic Fourier sums of `p` converge to `p` in `H^s`, and zero
extension is bounded in this range.  By (1.7),

\[
 A_\lambda p_N\longrightarrow A_\lambda p
       \quad\hbox{in }H^{s-\epsilon}(I_\lambda).      \tag{2.10}
\]

The centered projectors are uniformly bounded in that Sobolev space and
converge strongly there.  Thus

\[
 P_NA_\lambda p_N\longrightarrow A_\lambda p
       \quad\hbox{in }H^\delta(I_\lambda).            \tag{2.11}
\]

The already-proved polarization argument gives `tau_N->tau`, while
`p_N->p` in `H^delta`.  This proves (2.7).  Finally, the inequality
`epsilon/2<delta` in (2.9), (1.7), and weighted Cauchy--Schwarz give

\[
 |\mathfrak c_{\lambda,\beta}[f,g]|
 \leq C_{\lambda,\beta,\delta}
       \|f\|_{H^\delta}\|g\|_{H^\delta}.             \tag{2.12}
\]

Equations (2.7) and (2.12) prove (2.8).  \(\square\)

### Theorem 2.2 (finite `nu` converges to the unprojected gate)

For fixed `lambda` and `beta`, define

\[
 C_{\beta,N}=P_{e_N^\perp}(Q_N-\beta I)
                       P_{e_N^\perp}\big|_{G_N},
 \qquad
 \nu_{\beta,N}=\langle b_N,C_{\beta,N}b_N\rangle.   \tag{2.13}
\]

Then

\[
 \boxed{
 \nu_{\beta,N}
 ={1\over\mu_N}\mathfrak c_{\lambda,\beta}[r_N,r_N]
 \longrightarrow \nu_{\lambda,\beta}^{\infty}.}   \tag{2.14}
\]

The same conclusion holds for real shifts `beta_N->beta`.

**Proof.**  The vector `r_N` is orthogonal to `p_N`, so the transverse
projections and the negative pole disappear from its quadratic form.  This
gives the identity in (2.14).  Now use `mu_N->mu`, Lemma 2.1, and, for a
varying shift, `||r_N||->||R||`.  \(\square\)

Thus a strict nonzero unprojected sign is eventually the finite sign.  The
jump theorem proves only that the vector in (1.8) is nonzero; it gives no
sign to transfer.

### Theorem 2.3 (conditional floor and inverse-load transfer)

Let

\[
 \kappa_{\lambda,\beta}^{\infty}
 =\inf_{0\ne v\in G}
   {\mathfrak c_{\lambda,\beta}[v,v]\over\|v\|^2},
 \qquad
 \kappa_{\lambda,\beta,N}
 =\inf_{0\ne v\in G_N}
   {\mathfrak c_{\lambda,\beta}[v,v]\over\|v\|^2}. \tag{2.15}
\]

Then

\[
 \boxed{
 \kappa_{\lambda,\beta,N}\downarrow
 \kappa_{\lambda,\beta}^{\infty}.}                 \tag{2.16}
\]

If `kappa_(lambda,beta)^infinity>0`, define

\[
 \chi_{\lambda,\beta}^{\infty}
 =\langle b,C_\beta^{-1}b\rangle,
 \qquad
 \chi_{\lambda,\beta,N}
 =\langle b_N,C_{\beta,N}^{-1}b_N\rangle.            \tag{2.17}
\]

Then

\[
 \boxed{
 \kappa_{\lambda,\beta,N}
 \geq\kappa_{\lambda,\beta}^{\infty}>0,
 \qquad
 \chi_{\lambda,\beta,N}\longrightarrow
 \chi_{\lambda,\beta}^{\infty}.}                  \tag{2.18}
\]

Consequently, a strict unprojected Schur pass or fail transfers to the
finite compressions at that fixed parameter.

**Proof.**  The infinite source Cauchy form has the decomposition
`D_a+B`, where `B` is bounded and

\[
 a_k=\log(|k|)+O_\lambda(1).                          \tag{2.19}
\]

The explicit two-sided bounds and the bounded commutator are proved in
`HIGH_FOURIER_COERCIVITY.md`.  Hence the closed form is semibounded, has
compact resolvent, and centered trigonometric polynomials are a form core.

Equation (2.6) makes the spaces `G_N` nested conforming subspaces, so their
minimum Rayleigh quotients decrease and remain above the full transverse
infimum.  They are form-dense in `G`: if `v` belongs to the full form domain
and is orthogonal to `p`, then

\[
 v_N=P_Nv-{\langle P_Nv,p_N\rangle\over\mu_N}p_N   \tag{2.20}
\]

belongs to `G_N` and converges to `v` in form norm.  This proves (2.16).

Under the strict positive floor, the inverse load has the variational
representation

\[
 \chi_{\lambda,\beta}^{\infty}
 =\sup_{v\in G}
 \{2\operatorname {Re}\langle b,v\rangle
        -\mathfrak c_{\lambda,\beta}[v,v]\},         \tag{2.21}
\]

and the finite load is the same supremum over `G_N` with `b_N` in place of
`b`.  Form-core density gives convergence for the fixed forcing `b`, while
the common coercive lower bound and `b_N->b` in `L2` make the forcing
replacement tend to zero.  This proves (2.18).  The pole-axis values also
converge because
`alpha_N=tau_N-2*mu_N -> tau-2*mu=alpha`; hence a strict Schur comparison
transfers.  \(\square\)

Theorem 2.3 is conditional in exactly the important place: it transfers a
positive unprojected transverse floor but does not prove one.  Its constants
and convergence threshold are fixed-parameter quantities.  It supplies no
uniform relation between `N` and a varying `lambda`.

## 3. What high-frequency positivity sees

Let `C_a(lambda)`, `c_lambda`, and

\[
 g_{\lambda,M}
 =\log{M+1\over2}-{1\over2\pi(M+1)}
                 -C_a(\lambda)-c_\lambda             \tag{3.1}
\]

be the explicit source constants in `HIGH_FOURIER_COERCIVITY.md`.  For the
infinite form, obtained by passing through its finite principal
compressions, one has

\[
 P_{>M}(Q_\lambda-\beta I)P_{>M}
 \succeq G_{\lambda,M,\beta}P_{>M},
 \qquad
 G_{\lambda,M,\beta}=g_{\lambda,M}-\beta,             \tag{3.2}
\]

and

\[
 \|P_{>M}Q_\lambda P_{\leq M}\|\leq c_\lambda.       \tag{3.3}
\]

These are complete-source bounds; the prime sign has not been changed.

Split the exact residual as

\[
 R=R_{\rm lo}+R_{\rm hi},
 \qquad R_{\rm lo}=P_{\leq M}R.                      \tag{3.4}
\]

Because `R` is orthogonal to `p`, its complete pole form vanishes globally,
and (1.8) can equally be written with `Q_lambda-beta*I`.  If
`G_(lambda,M,beta)>0`, (3.2)--(3.3) give the honest lower estimate

\[
\boxed{
 \begin{aligned}
 \mu\nu_{\lambda,\beta}^{\infty}
 \geq{}&\langle R_{\rm lo},(Q_\lambda-\beta I)
                         R_{\rm lo}\rangle\\
 &-2c_\lambda\|R_{\rm lo}\|\|R_{\rm hi}\|
 +G_{\lambda,M,\beta}\|R_{\rm hi}\|^2.
 \end{aligned}}                                      \tag{3.5}
\]

The first line and the low--high orientation remain uncontrolled.  If `H`
is the exact high block and `C` the exact low-to-high block, completing the
square gives the sharper identity

\[
\begin{aligned}
 \mu\nu_{\lambda,\beta}^{\infty}
={}&\langle R_{\rm hi}+H^{-1}CR_{\rm lo},
              H(R_{\rm hi}+H^{-1}CR_{\rm lo})\rangle\\
 &+\langle R_{\rm lo},
       (L_{\rm lo}-C^*H^{-1}C)R_{\rm lo}\rangle .     \tag{3.6}
\end{aligned}
\]

Thus a positive high block moves the sign question to the complete signed
low Schur complement; it does not answer it.

### Lemma 3.1 (the jump's logarithmic energy tends to zero)

Let `F_(lambda,n)=chi_(lambda,n)R` be the localized residual in the
preceding jump note, and let `F_k` be its source-normalized periodic Fourier
coefficients.  Then

\[
 \boxed{
 {K\over\log K}
 \sum_{K<|k|\leq2K}\log(|k|+2)|F_k|^2
 \longrightarrow {LJ_{\lambda,n}^2\over4\pi^2}.}    \tag{3.7}
\]

In particular,

\[
 \sum_{K<|k|\leq2K}\log(|k|+2)|F_k|^2
 \sim {LJ_{\lambda,n}^2\over4\pi^2}{\log K\over K}
 \longrightarrow0.                                  \tag{3.8}
\]

**Proof.**  The localized jump theorem gives

\[
 K\sum_{K<|k|\leq2K}|F_k|^2
 \longrightarrow {LJ_{\lambda,n}^2\over4\pi^2}.     \tag{3.9}
\]

Uniformly on the dyadic band,
`log(|k|+2)/log K -> 1`.  Multiplying (3.9) by this uniformly convergent
weight proves (3.7).  \(\square\)

There are two separate reasons that (3.7) does not sign (1.8).

1. Localization does not commute with the complete source operator or its
   Fourier high projector.  Passing from `chi*R` to `R` needs an explicit
   commutator estimate and retains all low and complementary pieces.
2. Even if the localized logarithmic contribution could be inserted with
   its favorable sign for free, its guaranteed size is only
   `(log K)/K`, which vanishes.  In (3.5), the scalar coupling loss associated
   with a merely `K^(-1/2)` tail is of the larger order `K^(-1/2)`, and the
   complete low form is order-uncontrolled.

The explicit coercive cutoff in the earlier theorem is
`M=exp(O(lambda*log lambda))` under its coarse source triangles.  At such a
cutoff the jump-guaranteed quantity in (3.8) is exponentially small.  This
does not say that the actual high residual is that small; it says that the
jump lower bound alone certifies no usable positive reserve.

## 4. Exact jump-compatible obstruction models

The following models are logical counterexamples to implications from jump
energy and high coercivity.  They are not modifications of the arithmetic
source operator.

Work in a real odd circle space with orthonormal sine basis
`s_1,s_2,...`.  Put

\[
 u=s_1,\qquad w=s_2,
 \qquad
 z=j\sum_{k=3}^{\infty}{1\over k}s_k,
 \qquad b=u+z,                                        \tag{4.1}
\]

where `j>0`.  The classical sine series `sum sin(kx)/k` is a sawtooth;
removing two smooth modes does not change its nonzero jump.  Moreover,

\[
 K\sum_{K<k\leq2K}|\langle z,s_k\rangle|^2
 \longrightarrow {j^2\over2}.                       \tag{4.2}
\]

On the tail put

\[
 Ds_k=d_ks_k,
 \qquad d_k=1+\log k,qquad k\geq3,                  \tag{4.3}
\]

and define the finite positive constants

\[
 S_1=j^2\sum_{k=3}^{\infty}{d_k\over k^2},
 \qquad
 S_{-1}=j^2\sum_{k=3}^{\infty}{1\over d_kk^2}.       \tag{4.4}
\]

Every model below has exactly the same jump vector `b` and exactly the same
positive logarithmic high operator `D`.

### Countermodel 4.1 (the same jump permits either sign of `nu`)

Choose `M>S_1` and define, on `u direct-sum w direct-sum tail`,

\[
 C_+=M|u\rangle\langle u|+|w\rangle\langle w|+D,
 \qquad
 C_-=-M|u\rangle\langle u|+|w\rangle\langle w|+D.    \tag{4.5}
\]

Then

\[
 \boxed{
 \langle b,C_+b\rangle=M+S_1>0,
 \qquad
 \langle b,C_-b\rangle=-M+S_1<0.}                  \tag{4.6}
\]

The jump law and the high logarithmic compression are identical.  Only one
smooth low direction has changed.  Therefore those two retained inputs do
not imply the positive-`nu` gate.

### Countermodel 4.2 (the cyclic data do not imply a transverse floor)

Keep `M>0` and define

\[
 C_{\rm good}=M|u\rangle\langle u|
             +|w\rangle\langle w|+D,
 \qquad
 C_{\rm bad}=M|u\rangle\langle u|
             -|w\rangle\langle w|+D.                \tag{4.7}
\]

Because `b` has no `w` component and `w` is reducing,

\[
 \langle b,C_{\rm good}^rb\rangle
 =\langle b,C_{\rm bad}^rb\rangle
 \quad\hbox{for every integer }r\geq0.               \tag{4.8}
\]

All pole-generated Krylov data, including `nu`, are identical.  Yet
`C_good` is strictly positive and `C_bad` has eigenvalue `-1`.  Thus even
the complete cyclic data of the jump vector cannot sign an orthogonal
reducing transverse direction.

### Countermodel 4.3 (the same `b` and `nu` permit opposite load decisions)

On `span(u,w)`, put

\[
 C_1^{\rm lo}=\begin{bmatrix}2&0\\0&2\end{bmatrix},
 \qquad
 C_2^{\rm lo}=\begin{bmatrix}2&3/2\\3/2&2\end{bmatrix},             \tag{4.9}
\]

and let both operators equal `D` on the tail.  Both are strictly positive.
Since `b=u+z`,

\[
 \boxed{
 \langle b,C_1b\rangle
 =\langle b,C_2b\rangle=2+S_1.}                     \tag{4.10}
\]

But direct inversion gives

\[
 \boxed{
 \langle b,C_1^{-1}b\rangle={1\over2}+S_{-1},
 \qquad
 \langle b,C_2^{-1}b\rangle={8\over7}+S_{-1}.}      \tag{4.11}
\]

Choose the same pole-axis surplus in the two models,

\[
 a={3\over4}+S_{-1}.                                 \tag{4.12}
\]

Then the first inverse load is strictly below `a` and the second is
strictly above `a`, despite identical `b`, residual norm, `nu`, jump law,
and high logarithmic operator.

All three countermodels can be embedded in the exact odd-pole algebra.  Add
a unit vector `e` orthogonal to the transverse space, choose any `mu>0` and
real `beta`, and set

\[
 Q_j-\beta I=
 \begin{bmatrix}a&b^*\\ b&C_j\end{bmatrix},
 \qquad
 p=\sqrt\mu\,e,
 \qquad
 T_j=Q_j+2|p\rangle\langle p|.                      \tag{4.13}
\]

Then

\[
 Q_j=T_j-2|p\rangle\langle p|,                       \tag{4.14}
\]

and the centered pole residual is exactly `b`.  Thus the negative odd pole,
its disappearance from the transverse data, the jump tail, graph
convergence of finite truncations, and logarithmic high coercivity all hold
simultaneously.  The three missing conclusions remain independent.

## 5. No unbounded schedule follows, and the minimal new estimates

At a fixed `lambda`, Theorems 2.2--2.3 give an honest conditional transfer:
if the exact unprojected quantities have strict margins, a source-only
increase of `N` eventually certifies the corresponding finite margins.  This
does not yield an unbounded schedule from the current inputs for four
reasons.

1. No theorem proves `nu_(lambda,beta)^infinity>0` on infinitely many of the
   favorable locked parameters.
2. No theorem proves a positive unprojected transverse floor there.
3. The jump variation threshold and the Sobolev/form convergence thresholds
   are fixed-parameter and nonuniform in `lambda`.
4. Even after a floor is known, `nu>0` is only the first Krylov gate; it does
   not upper-bound the full inverse load.

The exact new estimates required by this route can now be stated without an
ambiguity about projection.

### 5.1 Residual-direction sign

On selected locked parameters, prove a strict combined-form margin

\[
 \boxed{
 \delta_\lambda
 :={1\over\mu}\mathfrak c_{\lambda,\beta}[R,R]>0,}   \tag{5.1}
\]

together with a quantitative form-Galerkin error smaller than the declared
margin.  This is exactly the positive-`nu` gate.  A jump norm lower bound is
not a substitute.

### 5.2 Full transverse sign

Choose an explicit high cutoff with `H>=G I>0` and prove the complete low
Schur estimate

\[
 \boxed{
 L_{\rm lo}-C^*H^{-1}C\succeq\kappa_\lambda I,
 \qquad \kappa_\lambda>0.}                           \tag{5.2}
\]

This is necessary and sufficient for the corresponding full transverse
floor once the high block is positive.  It retains the low--high
orientation; replacing it by jump energy or a separate block triangle is
strictly weaker.

### 5.3 Inverse-load margin

After (5.2), the existing source-frozen Krylov enclosure must satisfy

\[
 \boxed{
 \chi_{k,\lambda}
 +{\|\rho_{k,\lambda}\|^2\over\kappa_\lambda}
 <\alpha_\lambda-\beta.}                             \tag{5.3}
\]

The favorable-subsequence theorem controls only the right-hand pole-axis
quantity before the inverse correction.  The critical-load identity shows
that the admissible retained-load gap may tend to zero, so (5.3) cannot be
replaced by a fixed gap below one.

Equations (5.1)--(5.3), with quantitative Galerkin errors on one common
unbounded schedule, are the minimal sign-bearing successors to the jump
theorem.  The current source inputs establish none of them.  The jump result
is therefore correctly classified as a non-eigenvector and finite-cross
transfer theorem, not as evidence for a positive third moment or an odd
sector floor.
