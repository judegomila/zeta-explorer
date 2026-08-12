# Ground-transform tilt and projective-jet reduction

## 0. Claim boundary and outcome

This note reduces the positive parity-pencil effective-dimension gate to one
scale-invariant scalar property of the actual finite ground transform.  It
has five exact conclusions.

1. At one fixed imaginary height, the effective dimension is the logarithmic
   derivative of the finite ground transform, minus an explicit exterior
   Fourier-lattice tail.
2. Every higher positive quotient-resolvent trace moment is a logarithmic
   derivative with respect to the squared imaginary height, minus its exact
   exterior tail.  These are finite cumulant identities, not asymptotic
   moment limits.
3. At two fixed heights, the quotient determinant ratio is the ground-
   transform ratio times an explicit product over `n>N`.  Sharp scalar
   inequalities make a uniform positive ratio floor equivalent to a bounded
   effective dimension.
4. Relative to the source-normalized projected prolate state, the one-height
   condition is an exact projective jet, or Wronskian, condition.  Two
   cancellation-preserving inverse-energy products give a concrete finite
   sufficient theorem.
5. There is an exact Cauchy-displacement family with a strictly positive
   boundary-normalized ground polynomial and a uniformly conditioned positive
   odd block for which the effective dimension grows linearly in `L`.
   Therefore pointwise ground positivity, all-imaginary-axis positivity,
   ordinary interlacing, exact rank-two displacement, and odd conditioning do
   not imply the required bound.

The first four conclusions apply to the complete source matrix with its pole,
signed archimedean, and signed finite prime-power contributions already
combined.  In particular, the finite prime block retains the minus sign of
source equation (3.19), and the endpoint `n<=lambda^2` is inclusive.  No
triangle inequality between source blocks is used.

This note does **not** prove a bounded effective dimension for the arithmetic
matrices, a uniform first paired trace, any higher trace-moment limit, a
shifted sector sign on an unbounded schedule, equation (5.2) of
`DIRECT_RH_ATTACK.md`, locally uniform determinant convergence, or a
Riemann-hypothesis conclusion.  The formal project state remains
`P0_INVALIDATED`.

The binding finite source is Connes--Consani--Moscovici, *Zeta Spectral
Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The finite inputs are Lemma 5.1 (5.2), Lemma 5.2 (5.3), Lemma 5.4
(5.5), equation (5.25), and Theorem 5.10.  The parity-pencil and finite
ground-transform identities are derived in
`notes/PARITY_PENCIL_TRACE_REDUCTION.md` and
`notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md`.

## 1. Locked conventions and finite setup

Fix `lambda>1`, put

\[
 L=2\log\lambda,
\]

and work in logarithmic coordinates on
`[-L/2,L/2]=[-log(lambda),log(lambda)]` with Lebesgue measure and zero
extension.  The Fourier--Mellin convention is

\[
 \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt.       \tag{1.1}
\]

The real-frequency Weil integrals use `dt/(2*pi)`.  Before the arithmetic
map is formed, the prolate source functions live on `[-lambda,lambda]` with
Lebesgue measure and are extended by zero; no finite-`lambda` inversion
evenness is assumed before the physical state is explicitly evenized.

The centered orthonormal modes have the locked phase

\[
 \phi_n(t)=(-1)^nL^{-1/2}e^{2\pi int/L},               \tag{1.2}
\]

inversion is `Jf(t)=f(-t)`, and the source mode operator satisfies
`D V_n=nV_n`.  In the normalized parity bases,

\[
 e_0^+=V_0,\qquad
 e_n^+={V_n+V_{-n}\over\sqrt2},\qquad
 e_n^-={V_n-V_{-n}\over\sqrt2}.                       \tag{1.3}
\]

The inner product is antilinear in its first argument.  Put

\[
 \eta=\sum_{|n|\leq N}V_n,
 \qquad
 \beta=\sum_{|n|\leq N}b_nV_n.                       \tag{1.4}
\]

The source Cauchy and displacement identities are

\[
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),
 \qquad b_{-n}=-b_n,                                  \tag{1.5}
\]

\[
 [D,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|.                  \tag{1.6}
\]

Assume for the finite identities below that the actual complete source
matrix has a simple inversion-even lowest eigenvector `x`, with eigenvalue
`epsilon`, and that its source boundary value

\[
 c=\langle\eta,x\rangle                               \tag{1.7}
\]

is nonzero.  The source commutator theorem proves this nonvanishing once the
simple-even full-ground hypotheses hold.  Scaling `x` by a nonzero constant
does not affect any transform ratio or logarithmic derivative below.  When
needed, take `c>0` and replace `x` by `x/c`.

Write

\[
 T=Q-\epsilon I=T_+\oplus T_-,
 \qquad T_+\succeq0,
 \qquad \ker T_+=\mathbb Cx,
 \qquad T_-\succ0.                                    \tag{1.8}
\]

Let `C=D|_(H_-):H_- -> H_+`.  The exact positive parity pencil is

\[
 G=T_-^{-1/2}C^*T_+C T_-^{-1/2}\succeq0.             \tag{1.9}
\]

Denote its eigenvalues by `s_k^2`, `1<=k<=N`, including multiplicity.
For `sigma>0`, set

\[
 \alpha={\sigma L\over2\pi}.                         \tag{1.10}
\]

The effective dimension and physical half-paired trace are

\[
 d_{\rm eff}(\alpha)
 =\sum_{k=1}^N{\alpha^2\over s_k^2+\alpha^2},         \tag{1.11}
\]

\[
 S^{\rm q}_{1;\lambda,N}(\sigma)
 =\sum_{k=1}^N
 {1\over(2\pi s_k/L)^2+\sigma^2},
 \qquad
 d_{\rm eff}(\alpha)=\sigma^2S^{\rm q}_1(\sigma).   \tag{1.12}
\]

Finally define the scale-invariant positive imaginary-axis ground transform

\[
 M_N(\sigma)={\widehat x(i\sigma)\over c}.            \tag{1.13}
\]

The source formula is

\[
 \boxed{
 M_N(\sigma)
 ={2\sinh(\sigma L/2)\over\sigma\sqrt L}
 A_N\!\left({\sigma L\over2\pi}\right),}            \tag{1.14}
\]

where

\[
 A_N(a)
 ={\prod_{k=1}^N(s_k^2+a^2)
   \over\prod_{n=1}^N(n^2+a^2)}>0.                  \tag{1.15}
\]

The strict positivity in (1.15) is finite and follows from (1.8).  It is not
an assumption of an infinite Weil positivity statement.

The prolate comparison state retains its separate locked normalization:
`4*hat(k_lambda^+) -> Xi`.  Unit-normalizing the source function `h_lambda`
is rejected.  Unit-normalizing its projected physical image later is allowed
only with its explicit norm restored, as in Section 6.

## 2. One-height logarithmic-tilt identity

### Theorem 2.1 (exact effective-dimension tilt)

For every `sigma>0`, with `alpha` as in (1.10),

\[
 \boxed{
 d_{\rm eff}(\alpha)
 ={\sigma\over2}{d\over d\sigma}\log M_N(\sigma)
 -H_{1,N}(\alpha),}                                \tag{2.1}
\]

where the exact exterior Fourier-lattice tail is

\[
 H_{1,N}(\alpha)
 =\alpha^2\sum_{n>N}{1\over n^2+\alpha^2}.          \tag{2.2}
\]

It obeys

\[
 \boxed{0\leq H_{1,N}(\alpha)\leq{\alpha^2\over N}.} \tag{2.3}
\]

**Proof.**  Differentiate (1.14).  Since
`sigma*L/2=pi*alpha`,

\[
 {\sigma\over2}{d\over d\sigma}\log M_N(\sigma)
 ={\pi\alpha\over2}\coth(\pi\alpha)-{1\over2}
 +{\alpha\over2}{A_N'(\alpha)\over A_N(\alpha)}.  \tag{2.4}
\]

On the other hand, logarithmic differentiation of (1.15) gives

\[
 d_{\rm eff}(\alpha)
 =\alpha^2\sum_{n=1}^N{1\over n^2+\alpha^2}
 +{\alpha\over2}{A_N'(\alpha)\over A_N(\alpha)}.  \tag{2.5}
\]

The classical product for `sinh` gives

\[
 \alpha^2\sum_{n=1}^{\infty}{1\over n^2+\alpha^2}
 ={\pi\alpha\coth(\pi\alpha)-1\over2}.             \tag{2.6}
\]

Subtracting (2.5) from (2.4) proves (2.1).  Finally,

\[
 \sum_{n>N}{1\over n^2+\alpha^2}
 \leq\sum_{n>N}{1\over n^2}
 \leq\int_N^\infty{x^{-2}}\,dx={1\over N},         \tag{2.7}
\]

which proves (2.3). \(\square\)

For a fixed physical height `sigma`, if `N/L^2 -> infinity`, then
`H_(1,N)=o(1)`.  Hence

\[
 \boxed{
 d_{\rm eff}(\sigma L/(2\pi))=O(1)
 \quad\Longleftrightarrow\quad
 {M_N'(\sigma)\over M_N(\sigma)}=O(1).}             \tag{2.8}
\]

This is a statement about the actual finite ground line.  Boundary
normalization cannot prove it, because a constant rescaling cancels from the
ratio in (2.8).

In physical coordinates, (2.1) is the signed exponential-tilt identity

\[
 d_{\rm eff}+H_{1,N}
 ={\sigma\over2}
 {\displaystyle\int_{-L/2}^{L/2}t\,{x(t)\over c}e^{\sigma t}\,dt
  \over
  \displaystyle\int_{-L/2}^{L/2}{x(t)\over c}e^{\sigma t}\,dt}. \tag{2.9}
\]

If `x/c` is pointwise nonnegative, the quotient is a tilted barycenter.
Pointwise positivity alone gives no uniform tightness of that barycenter;
Section 7 gives an exact counterexample.

## 3. Every positive trace moment as a ground-transform cumulant

Put `t=sigma^2` and

\[
 \mathcal M_N(t)=M_N(\sqrt t),\qquad t>0.            \tag{3.1}
\]

For every integer `m>=1`, define the physical half-paired quotient moment

\[
 S^{\rm q}_{m;\lambda,N}(\sigma)
 =\sum_{k=1}^N
 {1\over\bigl((2\pi s_k/L)^2+\sigma^2\bigr)^m}.    \tag{3.2}
\]

### Theorem 3.1 (exact trace/cumulant identity)

For every `m>=1`,

\[
 \boxed{
 S^{\rm q}_{m;\lambda,N}(\sigma)
 ={(-1)^{m-1}\over(m-1)!}
 \left({d\over dt}\right)^m\log\mathcal M_N(t)
 \bigg|_{t=\sigma^2}
 -H^{\rm phys}_{m,N}(\sigma),}                    \tag{3.3}
\]

where

\[
 H^{\rm phys}_{m,N}(\sigma)
 =\left({L\over2\pi}\right)^{2m}
 \sum_{n>N}{1\over(n^2+\alpha^2)^m}.              \tag{3.4}
\]

The tail satisfies

\[
 \boxed{
 0\leq H^{\rm phys}_{m,N}(\sigma)
 \leq {1\over2m-1}
       \left({L\over2\pi}\right)^{2m}
       N^{-(2m-1)}.}                              \tag{3.5}
\]

**Proof.**  The product of (1.14)--(1.15) and the canonical product for
`sinh` has positive-axis factors from the `N` quotient roots and from the
uncancelled exterior lattice roots `n>N`.  Therefore

\[
 {d\over dt}\log\mathcal M_N(t)
 =\sum_{k=1}^N{1\over(2\pi s_k/L)^2+t}
  +\sum_{n>N}{1\over(2\pi n/L)^2+t}.              \tag{3.6}
\]

Differentiating `m-1` further times proves (3.3).  The integral estimate

\[
 \sum_{n>N}n^{-2m}
 \leq\int_N^\infty x^{-2m}\,dx
 ={N^{-(2m-1)}\over2m-1}                         \tag{3.7}
\]

proves (3.5). \(\square\)

For every fixed `m`, the exterior tail tends to zero on
`N/L^2 -> infinity`.  Equation (3.3) identifies the exact derivative datum
needed for each moment.  A bounded first moment bounds the higher positive
moments at a fixed `sigma`, because each physical resolvent eigenvalue is at
most `sigma^(-2)`, but it does not identify their limits.  Convergence of
all the cumulants in (3.3), not merely boundedness of the first, remains the
trace route to locally uniform determinant convergence.

## 4. Two-height exterior product and sharp finite comparison

Fix once and for all

\[
 0<\tau<\sigma<\frac12,
 \qquad
 \gamma={\tau L\over2\pi},
 \qquad
 \alpha={\sigma L\over2\pi},
 \qquad
 \theta={\gamma\over\alpha}={\tau\over\sigma}.     \tag{4.1}
\]

The quotient determinant ratio is

\[
 R^{\rm q}_{\lambda,N}(\tau,\sigma)
 =\prod_{k=1}^N{s_k^2+\gamma^2\over s_k^2+\alpha^2}. \tag{4.2}
\]

Define the exterior correction

\[
 \mathcal T_N(\gamma,\alpha)
 =\prod_{n>N}{n^2+\alpha^2\over n^2+\gamma^2}.      \tag{4.3}
\]

### Theorem 4.1 (exact ground-ratio factorization)

One has

\[
 \boxed{
 R^{\rm q}_{\lambda,N}(\tau,\sigma)
 ={M_N(\tau)\over M_N(\sigma)}
  \mathcal T_N(\gamma,\alpha).}                    \tag{4.4}
\]

The exterior factor obeys

\[
 \boxed{
 0\leq\log\mathcal T_N(\gamma,\alpha)
 \leq{\alpha^2-\gamma^2\over N}.}                  \tag{4.5}
\]

**Proof.**  The infinite central-lattice product is

\[
 \prod_{n=1}^{\infty}{n^2+\gamma^2\over n^2+\alpha^2}
 ={\alpha\over\gamma}
  {\sinh(\pi\gamma)\over\sinh(\pi\alpha)}
 ={\sigma\over\tau}
  {\sinh(\tau L/2)\over\sinh(\sigma L/2)}.        \tag{4.6}
\]

Combining (4.6) with (1.14)--(1.15) proves (4.4).  For (4.5),

\[
\begin{aligned}
 \log\mathcal T_N
 &=\sum_{n>N}\log\left(
    1+{\alpha^2-\gamma^2\over n^2+\gamma^2}\right)\\
 &\leq(\alpha^2-\gamma^2)\sum_{n>N}{1\over n^2}
 \leq{\alpha^2-\gamma^2\over N}.
\end{aligned}                                      \tag{4.7}
\]

This proves the theorem. \(\square\)

### Theorem 4.2 (sharp finite effective-dimension comparison)

For every finite pencil,

\[
 \boxed{
 (1-\theta^2)d_{\rm eff}(\alpha)
 \leq-\log R^{\rm q}_{\lambda,N}(\tau,\sigma)
 \leq\log(\theta^{-2})d_{\rm eff}(\alpha).}        \tag{4.8}
\]

Equivalently,

\[
\boxed{
 \log\mathcal T_N+(1-\theta^2)d_{\rm eff}
 \leq\log{M_N(\sigma)\over M_N(\tau)}
 \leq\log\mathcal T_N+\log(\theta^{-2})d_{\rm eff}.} \tag{4.9}
\]

**Proof.**  For `u>=0`, put

\[
 q_\theta(u)=\log{u+1\over u+\theta^2}.             \tag{4.10}
\]

The elementary inequalities

\[
 {1-\theta^2\over u+1}
 \leq q_\theta(u)
 \leq{\log(\theta^{-2})\over u+1}                  \tag{4.11}
\]

are sharp at `u=infinity` and `u=0`, respectively.  The lower bound follows
from `log(1+y)>=y/(1+y)`.  For the upper bound,
`(u+1)q_theta(u)` is decreasing because its derivative is
`log(1+y)-y<=0`, where `y=(1-theta^2)/(u+theta^2)`.  Apply (4.11) with
`u=s_k^2/alpha^2` and sum over `k`.  Equation (4.9) then follows from
(4.4). \(\square\)

On any schedule with `N/L^2 -> infinity`, (4.5) and (4.8) give the exact
equivalence

\[
 \boxed{
 d_{\rm eff}(\sigma L/(2\pi))=O(1)
 \quad\Longleftrightarrow\quad
 \sup {M_N(\sigma)\over M_N(\tau)}<\infty.}        \tag{4.12}
\]

This is the smallest scale-invariant two-height scalar target exposed by the
finite determinant.  It contains no zero table.

## 5. Interlacing is a no-go route for this gate

Ordinary rank-one self-adjoint interlacing is not merely insufficient here;
it has the wrong scale.  If, for example,

\[
 0<s_1<1<s_2<2<\cdots<s_N<N,                       \tag{5.1}
\]

then `s_k<k` gives

\[
 d_{\rm eff}(\alpha)
 \geq\sum_{k=1}^N{\alpha^2\over k^2+\alpha^2}.     \tag{5.2}
\]

When `N/alpha^2 -> infinity`, (2.6) implies

\[
 d_{\rm eff}(\alpha)
 \geq{\pi\alpha\over2}-{1\over2}-o(1).            \tag{5.3}
\]

More generally, any uniformly bounded counting-function discrepancy between
the quotient roots and the integer lattice leaves a statistical dimension of
order `alpha`.  A successful arithmetic pencil must move order-`alpha`
spectral mass out of the central scaled window.  This is possible because
the rank-one squared-mode pencil is symmetrized by `T_-`; it is not an
ordinary Euclidean self-adjoint rank-one perturbation of `D_-^2`.  A proof
that silently replaces it by such a perturbation would force the wrong
interlacing conclusion.

## 6. One-anchor projective jet and inverse-leverage theorem

Let

\[
 p_{\lambda,N}=P_Nk_\lambda^+,
 \qquad
 a_{\lambda,N}=\|p_{\lambda,N}\|,
 \qquad
 \kappa={p_{\lambda,N}\over a_{\lambda,N}}.         \tag{6.1}
\]

The proved normalization theorem gives `a_(lambda,N) -> a_infinity>0` on
the admitted schedules, while the corrected source limit gives, locally
uniformly in the open strip,

\[
 \widehat\kappa(z)
 \longrightarrow{\Xi(z)\over4a_\infty}.            \tag{6.2}
\]

In particular, at every fixed `0<sigma<1/2`,

\[
 K_\sigma:=\widehat\kappa(i\sigma)
\]

is eventually bounded away from zero, and both `K_sigma` and
`dot K_sigma=d K_sigma/d sigma` are bounded.  The derivative statement
follows from local uniform convergence on a slightly larger closed substrip,
not from real-axis agreement.

Write the even block of `Q` relative to
`H_+=mathbb C*kappa direct-sum mathcal K` as

\[
 Q_+=\begin{bmatrix}q&b^*\\b&A\end{bmatrix}.        \tag{6.3}
\]

For the finite identities in this section, assume
`<kappa,xi>!=0` and `K_sigma!=0`.  The anchor-overlap condition is automatic
under Theorem 6.2: if the ground were orthogonal to `kappa`, it would lie in
`mathcal K` and put `mu` in the spectrum of `A`, contradicting
`A-U I>0` with `U>=mu`.  The second condition holds for every sufficiently
large pair on the admitted schedules by (6.2), but is stated explicitly for
a standalone finite pair.

Let `mu` be the simple even ground eigenvalue and normalize its line by its
`kappa` coefficient:

\[
 w={\xi\over\langle\kappa,\xi\rangle}
   =\kappa-z_\mu,
 \qquad
 z_\mu=(A-\mu I)^{-1}b.                            \tag{6.4}
\]

Put

\[
 Z_\sigma=\widehat{z_\mu}(i\sigma),
 \qquad
 M_\sigma=\widehat w(i\sigma)=K_\sigma-Z_\sigma.   \tag{6.5}
\]

The transform `M_sigma` is a nonzero scalar multiple of the boundary-
normalized transform in Section 2, so its logarithmic derivative is the same.

Define the one-anchor jet functional

\[
 \boxed{
 \mathcal J_\sigma(v)
 =K_\sigma{d\over d\sigma}\widehat v(i\sigma)
  -\dot K_\sigma\widehat v(i\sigma).}              \tag{6.6}
\]

### Lemma 6.1 (exact projective jet identity)

One has

\[
 \boxed{
 {\dot M_\sigma\over M_\sigma}
 ={\dot K_\sigma\over K_\sigma}
 -{\mathcal J_\sigma(z_\mu)
    \over K_\sigma M_\sigma}.}                     \tag{6.7}
\]

Equivalently, if

\[
 \mathcal W_\sigma(\kappa,w)
 =K_\sigma\dot M_\sigma-\dot K_\sigma M_\sigma,  \tag{6.8}
\]

then

\[
 \mathcal W_\sigma(\kappa,w)
 =-\mathcal J_\sigma(z_\mu).                       \tag{6.9}
\]

Both sides of the normalized quotient
`mathcal W/(K_sigma*M_sigma)` are invariant under nonzero rescaling of either
line.  Thus (6.7) removes the scalar-aligned correction exactly; it is not a
complete-resolvent norm estimate.

**Proof.**  Substitute `M=K-Z` and simplify:

\[
 {\dot M\over M}-{\dot K\over K}
 ={K(\dot K-\dot Z)-\dot K(K-Z)\over KM}
 =-{K\dot Z-\dot KZ\over KM}.                      \tag{6.10}
\]

This is (6.7)--(6.9). \(\square\)

Combining Theorem 2.1 and Lemma 6.1 gives

\[
 \boxed{
 d_{\rm eff}
 ={\sigma\over2}\left(
 {\dot K_\sigma\over K_\sigma}
 -{\mathcal J_\sigma(z_\mu)\over K_\sigma M_\sigma}
 \right)-H_{1,N}.}                                 \tag{6.11}
\]

This is the exact one-anchor projective form of the first trace gate.

### Theorem 6.2 (finite jet-leverage sufficient criterion)

Let `U>=mu` be a finite Ritz upper bound and suppose the strict even
comparison

\[
 B=A-U I\succ0                                      \tag{6.12}
\]

has been proved.  For a continuous functional `ell` on `mathcal K`, write

\[
 \mathcal L_\ell(U)
 =\|B^{-1/2}\ell^*\|^2.                            \tag{6.13}
\]

Define

\[
 E_U=\langle b,B^{-1}b\rangle,
 \quad
 \mathcal L_0(U)=\mathcal L_{v\mapsto\widehat v(i\sigma)}(U),
 \quad
 \mathcal L_J(U)=\mathcal L_{\mathcal J_\sigma}(U). \tag{6.14}
\]

Then

\[
 |Z_\sigma|^2\leq E_U\mathcal L_0(U),
 \qquad
 |\mathcal J_\sigma(z_\mu)|^2
 \leq E_U\mathcal L_J(U).                         \tag{6.15}
\]

Suppose there are constants `0<=eta<1` and `C_J<infinity` such that

\[
 \boxed{
 E_U\mathcal L_0(U)\leq\eta^2|K_\sigma|^2,}       \tag{6.16}
\]

\[
 \boxed{
 E_U\mathcal L_J(U)\leq C_J^2|K_\sigma|^4.}       \tag{6.17}
\]

Then

\[
 |M_\sigma|\geq(1-\eta)|K_\sigma|,               \tag{6.18}
\]

\[
 \left|{\dot M_\sigma\over M_\sigma}
       -{\dot K_\sigma\over K_\sigma}\right|
 \leq{C_J\over1-\eta},                            \tag{6.19}
\]

and hence

\[
 \boxed{
 d_{\rm eff}(\alpha)
 \leq{\sigma\over2}\left(
 \left|{\dot K_\sigma\over K_\sigma}\right|
 +{C_J\over1-\eta}\right).}                       \tag{6.20}
\]

In particular, uniform constants in (6.16)--(6.17) prove the first normal-
family trace gate.

**Proof.**  Cauchy--Schwarz in the positive metric `(A-mu I)^(-1)` gives

\[
 |\ell(z_\mu)|^2
 \leq\langle b,(A-\mu I)^{-1}b\rangle
      \| (A-\mu I)^{-1/2}\ell^*\|^2.              \tag{6.21}
\]

Since `mu<=U` and both inverses are scalar functions of the same Hermitian
`A`, each factor in (6.21) is bounded by its `B^(-1)` counterpart.  This
proves (6.15).  Equations (6.16) and (6.5) give (6.18), while (6.17),
(6.18), and Lemma 6.1 give (6.19).  Equation (6.20) follows from (6.11) and
`H_(1,N)>=0`. \(\square\)

The two products in (6.16)--(6.17) preserve the combined source
cancellation.  They need only remain inside fixed reserves; they need not
tend to zero.  If their normalized square roots tend to zero, then (6.11)
also identifies the first trace limit as

\[
 d_{\rm eff}(\alpha)
 \longrightarrow{\sigma\over2}{d\over d\sigma}
 \log\Xi(i\sigma),                                \tag{6.22}
\]

provided `N/L^2 -> infinity`.  This is a derivative-defined target and uses
no zero table.  It still says nothing about the higher limits in (3.3).

### Quotient reconstruction

The inverse quantities in Theorem 6.2 do not require a cached physical
inverse.  If `W:mathcal X -> mathcal K` is any onto source synthesis, then

\[
 \boxed{
 B^{-1}=W(W^*BW)^\dagger W^*.}                     \tag{6.23}
\]

Consequently `E_U`, `mathcal L_0`, and `mathcal L_J` are reconstructed from
the source pullback `W^*BW`, the source coordinates of `b`, and the two
declared evaluation functionals.  Formula (6.23) quotients `ker(W)` before
inversion; zero ambient eigenvalues are not physical gaps.  It also retains
the complete pole--archimedean--minus-prime form inside `B`.

The exact projective condition is the bounded normalized Wronskian in
(6.11).  Splitting it into (6.16)--(6.17) is a robust sufficient route, not a
necessary one: a nearly scalar-aligned correction can make `M_sigma` small
while its projective Wronskian vanishes exactly.

## 7. Strictly positive-ground, uniformly conditioned countermodel

This section constructs an exact finite Cauchy-displacement family satisfying
every abstract hypothesis used to obtain odd positivity, but not the actual
arithmetic pole--archimedean--prime coefficients.

Fix `N>=2`.  In the plus parity basis, take the boundary-normalized vector

\[
 x={3\over4}e_0^+ +{\sqrt2\over8}e_1^+.            \tag{7.1}
\]

Since `eta=e_0^++sqrt(2)sum_(n=1)^N e_n^+`,

\[
 \langle\eta,x\rangle=1,
 \qquad x_0={3\over4}\ne0.                        \tag{7.2}
\]

In the raw trigonometric coordinate, apart from the harmless locked centered
phase and after removing the common positive factor `L^(-1/2)`, its
coefficient profile is

\[
 f_N(t)=L^{1/2}x(t)
 ={3\over4}-{1\over4}\cos(2\pi t/L),              \tag{7.3}
\]

so

\[
 {1\over2}\leq f_N(t)\leq1                        \tag{7.4}
\]

pointwise on the whole interval.

Let `mathcal D:H_+ -> H_-` be the parity block of `D`, put

\[
 u=\mathcal Dx={\sqrt2\over8}e_1^-,
 \qquad
 d=\mathcal D\eta=\sum_{n=1}^N\sqrt2\,n e_n^-,   \tag{7.5}
\]

and define

\[
 X=D_-^2-|u\rangle\langle d|.                      \tag{7.6}
\]

Its matrix is upper triangular: its diagonal is

\[
 {3\over4},\ 2^2,\ 3^2,\ldots,N^2,                 \tag{7.7}
\]

and its first-row entry in column `n>=2` is `-n/4`.

For `n>=2`, put

\[
 c_n=-{n\over4n^2-3},
 \qquad
 c=(0,c_2,\ldots,c_N)^T,
 \qquad
 S=I+|e_1^-\rangle\langle c|.                      \tag{7.8}
\]

Then exactly

\[
 X=S\Lambda S^{-1},
 \qquad
 \Lambda=\operatorname {diag}(3/4,2^2,\ldots,N^2). \tag{7.9}
\]

Define

\[
 T_-=S^{-T}S^{-1},
 \qquad
 K=T_-X=S^{-T}\Lambda S^{-1}.                      \tag{7.10}
\]

Both matrices are real symmetric positive definite.  Moreover,

\[
 |c_n|\leq{1\over3n}\quad(n\geq2),
 \qquad
 \|c\|<\frac13.                                   \tag{7.11}
\]

Therefore the singular values of `S` lie in `(2/3,4/3)` and

\[
 \boxed{{9\over16}I\prec T_-\prec{9\over4}I}       \tag{7.12}
\]

uniformly in `N`.

It remains to construct the plus block rather than assume it.  Let

\[
 D_o=\operatorname {diag}(1,2,\ldots,N),
 \qquad
 B=D_o^{-1}KD_o^{-1},
 \qquad
 r={\sqrt2\over8}e_1.                              \tag{7.13}
\]

Relative to `e_0^+ direct_sum span(e_1^+,...,e_N^+)`, set

\[
 T_+=
 \begin{bmatrix}
 r^*Br/x_0^2&-r^*B/x_0\\
 -Br/x_0&B
 \end{bmatrix},
 \qquad x_0={3\over4}.                             \tag{7.14}
\]

Then

\[
 T_+\succeq0,
 \qquad
 \ker T_+=\mathbb Cx,
 \qquad
 \mathcal DT_+\mathcal D^*=K.                     \tag{7.15}
\]

Finally put

\[
 \beta=-T_-u.                                      \tag{7.16}
\]

The factorization `K=T_-X` gives

\[
 \mathcal DT_+-T_-\mathcal D
 =|\beta\rangle\langle\eta|.                      \tag{7.17}
\]

For completeness, multiply the difference between the two sides of (7.17)
on the right by `mathcal D^*`; it vanishes by (7.6), (7.10), and (7.15).
The same difference annihilates `x` by (7.2) and (7.16).  The range of
`mathcal D^*` together with `x` spans `H_+` because `x_0!=0`, proving
(7.17).  Its adjoint supplies the other parity block.

Set

\[
 Q=T_+\oplus T_-                                  \tag{7.18}
\]

in parity coordinates and take `epsilon=0`.  It is a real Hermitian
inversion-symmetric matrix with a simple even full ground, strictly positive
odd block, nonzero `Dx`, nonzero `beta`, and the exact source rank-two
displacement.  Returning to raw modes, (1.6) gives the exact Cauchy formula
(1.5), with the raw odd coefficients of `beta` defining `b_n` and the raw
diagonal entries defining `a_n`.

The response and quotient roots are

\[
 A_N(a)=1-{1\over4(1+a^2)}
 ={a^2+3/4\over a^2+1},                           \tag{7.19}
\]

\[
 s_1^2={3\over4},
 \qquad
 s_n^2=n^2\quad(2\leq n\leq N).                  \tag{7.20}
\]

Thus `A_N(a)>0` for every `a>=0`, exactly as required by the all-imaginary-
axis odd-sign criterion.  Nevertheless,

\[
 d_{\rm eff}(\alpha)
 ={\alpha^2\over\alpha^2+3/4}
 +\sum_{n=2}^N{\alpha^2\over n^2+\alpha^2}.       \tag{7.21}
\]

If `alpha->infinity` and `N/alpha^2->infinity`, then (2.6) gives

\[
 \boxed{
 d_{\rm eff}(\alpha)
 ={\pi\alpha\over2}-{1\over2}+o(1)
 ={\sigma L\over4}-{1\over2}+o(1).}               \tag{7.22}
\]

This family satisfies strict pointwise positivity and the uniform odd bounds
(7.12), not merely qualitative odd positivity.  It proves that those
hypotheses do not control the tilted barycenter (2.9) or the projective jet
(6.11).  The model is not the arithmetic Weil matrix and is not promoted to
an arithmetic counterexample.

## 8. Exact remaining arithmetic target

Fix rational heights

\[
 0<\tau<\sigma<\frac12                              \tag{8.1}
\]

and an explicit unbounded schedule satisfying

\[
 \lambda_j\longrightarrow\infty,
 \qquad
 {N_j\over(\log\lambda_j)^2}\longrightarrow\infty. \tag{8.2}
\]

After proving the strict finite simple-even and shifted-sector hypotheses for
the **actual** source-assembled matrices, the smallest exact scalar target is

\[
 \boxed{
 \inf_j{M_{N_j}(\tau)\over M_{N_j}(\sigma)}>0.}     \tag{8.3}
\]

By Theorems 4.1--4.2, (8.3) is equivalent to
`d_eff(sigma*L_j/(2*pi))=O(1)`.  It is also equivalent to a positive uniform
floor for the complete combined-pencil determinant ratio.  It is not an
asymptotic theorem currently available from the source.

The one-anchor cancellation-preserving sufficient target is the pair

\[
 \boxed{
 {E_{U_j}\mathcal L_{0,j}(U_j)\over|K_{\sigma,j}|^2}
 \leq\eta^2<1,}                                    \tag{8.4}
\]

\[
 \boxed{
 {E_{U_j}\mathcal L_{J,j}(U_j)\over|K_{\sigma,j}|^4}
 =O(1).}                                            \tag{8.5}
\]

These are the exact remaining arithmetic inverse-energy products for the
first trace gate.  They use only the actual combined pole--archimedean--minus-
prime matrix, the actual projected source-normalized prolate state, and two
declared imaginary-axis evaluation functionals.  They do not read a zero
table or assume global Weil positivity.

Proving (8.4)--(8.5) would establish a normal-family bound only.  Identifying
all derivative limits in Theorem 3.1, proving the independent finite signs,
and solving the projective ground-line or equation-(5.2) bridge would still
remain before locally uniform characteristic convergence.
