# Source-compatible ground projective response

## 0. Scope, source lock, and exact outcome

This note proves two finite reconstructions of the same projective low-mode
ground correction.

1. A bordered determinant cross-ratio gives the correction exactly and a
   finite positive secant controls it once the cyclic spectral cap is kept.
2. At the true simple ground, the first derivative of the **unbordered full
   ambient homotopy** `Q+t Pi_M` selects the ground line rather than tracing
   every cutoff-visible complementary direction.  It differs from the
   desired projective correction only by one explicit high-mode cross term.
3. An orthogonal decomposition separates that derivative into the squared
   ground component transverse to the cutoff-visible anchor line and the
   same explicit high-mode term.  On the admitted nested projection
   schedule, the still-missing response rate is therefore exactly a
   ground-alignment estimate, up to an exponentially small error.

The second reconstruction is source-compatible: the symmetric centered
Fourier projection commutes with the source mode operator and inversion.
The bordered matrices in the first reconstruction are readout minors; they
are not themselves claimed to have the source Cauchy displacement.

For the actual arithmetic specialization, all entries of `Q` are assembled
from the complete pole minus archimedean minus prime formula before an
adjugate, determinant, inverse, or absolute value is formed.  The prime block
retains the minus sign in source equation (3.19), and every prime power
`1<n<=lambda^2`, including the endpoint, is retained.  Centered logarithmic
coordinates use

\[
 [-L/2,L/2],\qquad L=2\log\lambda,
\]

Lebesgue measure, zero extension, reflection as inversion, and

\[
 \widehat f(z)=\int_{-L/2}^{L/2}f(x)e^{-izx}\,dx.       \tag{0.1}
\]

The prolate combination is kept in its locked source normalization.  No
zeta-zero table, assumed real-zero list, or global Weil positivity is used.

The binding finite source remains Connes--Consani--Moscovici, *Zeta
Spectral Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The source-lock erratum is retained: the printed normalization tends to
`Xi/4`, so the factor four is applied only to the final characteristic
function and is not silently absorbed into `h_lambda`.

The finite identities below do not prove either shifted sector sign or the
new scalar response rate on an unbounded arithmetic schedule.  They do not
prove the full-`L2` target (5.2) of `DIRECT_RH_ATTACK.md`, a locally uniform
limit for the actual source matrices, or the Riemann hypothesis.  The formal
project state remains `P0_INVALIDATED`.

## 1. Finite complex Hermitian ground geometry

Let `Q=Q*` commute with inversion and let `kappa` be a unit even vector.  In
the even sector write

\[
 Q_+=\begin{pmatrix}q&b^*\\ b&A\end{pmatrix}
 \quad\hbox{on}\quad
 \mathbb C\kappa\oplus\kappa^\perp.                 \tag{1.1}
\]

Assume that `mu` is a simple even ground eigenvalue and that

\[
 H:=Q_+-\mu I\succeq0,
 \qquad \dim\ker H=1.                                \tag{1.2}
\]

The ground line is not orthogonal to `kappa` whenever the strict
complement sign used below holds.  Let `x` be its coefficient-normalized
representative,

\[
 Hx=0,\qquad \langle\kappa,x\rangle=1.               \tag{1.3}
\]

Thus, in the block chart of (1.1),

\[
 x=\kappa-Wz,
 \qquad z=(A-\mu I)^{-1}b.                           \tag{1.4}
\]

Use the standard complex convention `u^*v`; every displayed transpose below
is therefore a conjugate transpose.  Let `Pi=Pi_(M,+)` be the even
restriction of the ambient symmetric centered cutoff and put

\[
 k_{00}=\langle\kappa,\Pi\kappa\rangle,
 \qquad E_M=\|\Pi(x-\kappa)\|^2.                    \tag{1.5}
\]

Because `Pi` is an orthogonal projection, the final `Pi` in (1.5) may
equivalently be written inside the quadratic form once.

The locked source state is

\[
 p_{\lambda,N}=P_Nk_\lambda^+=a_{\lambda,N}\kappa,
 \qquad a_{\lambda,N}=\|P_Nk_\lambda^+\|>0.         \tag{1.6}
\]

If `xi` is the unit ground and its phase is chosen so that
`gamma=<kappa,xi>>0`, then `x=gamma^(-1)xi`.  Consequently the actual
source-scaled low error is

\[
 \boxed{
 \|\Pi(a_{\lambda,N}\gamma^{-1}\xi-p_{\lambda,N})\|^2
 =a_{\lambda,N}^2E_M.}                              \tag{1.7}
\]

The factor in (1.7) is not optional.

The normalization regression is quantitative.  The locked limiting test
function satisfies

\[
 \|h\|_2={\sqrt{33}\over2^{17/4}}\ne1.              \tag{1.8}
\]

Replacing it by unit norm changes the limiting projected-state scalar by
`2^(17/4)/sqrt(33)` and changes the squared observable in (1.7) by the
square of that factor, even though the unit anchor and `E_M` are unchanged.

## 2. Exact adjugate and mixed-minor response

Put

\[
 C=\operatorname {adj}H,
 \qquad c_\kappa=\kappa^*C\kappa.                   \tag{2.1}
\]

### Theorem 2.1 (ground adjugate response)

Under (1.2)--(1.3),

\[
 \boxed{C=c_\kappa xx^*,\qquad c_\kappa>0.}         \tag{2.2}
\]

Hence

\[
 \boxed{
 E_M={ (C\kappa-c_\kappa\kappa)^*\Pi
             (C\kappa-c_\kappa\kappa)\over c_\kappa^2}.}  \tag{2.3}
\]

Equivalently,

\[
 \boxed{
 E_M=k_{00}
 -{2\operatorname {Re}(\kappa^*\Pi C\kappa)\over c_\kappa}
 +{\operatorname {tr}(\Pi C)\over c_\kappa}.}       \tag{2.4}
\]

**Proof.**  The adjugate of a positive semidefinite matrix of corank one has
range equal to its kernel and is positive semidefinite of rank one.  Thus
`C=tau*x*x^*` for `tau>0`.  Equation (1.3) makes `tau=c_kappa`, proving
(2.2).  Since `C*kappa=c_kappa*x`, expansion of (2.3) proves (2.4).  The
last term uses
`tr(Pi*C)/c_kappa=<x,Pi*x>`.  \(\square\)

The three terms in (2.4) are a cancellation-preserving combination.  A
triangle inequality on the separate terms is not the theorem.

Let `(e_j)` be any orthonormal basis of `Ran(Pi)` and define the mixed
bordered minors

\[
 m_j=-\det\begin{pmatrix}H&\kappa\\e_j^*&0\end{pmatrix}
     =e_j^*C\kappa.                                  \tag{2.5}
\]

The general complex bordered identity used here is

\[
 \det\begin{pmatrix}H&u\\v^*&0\end{pmatrix}
 =-v^*\operatorname {adj}(H)u.                      \tag{2.6}
\]

Therefore (2.3) has the eigenvector-free mode-minor form

\[
 \boxed{
 E_M={1\over c_\kappa^2}
       \sum_{e_j\in\operatorname {Ran}\Pi}
       |m_j-c_\kappa e_j^*\kappa|^2.}               \tag{2.7}
\]

Absolute values occur only after each combined mixed minor in (2.7) has
been formed.

## 3. Positive bordered cross-ratio and finite secant

Fix arbitrary `rho>0` and put

\[
 g=H\kappa,
 \qquad \mathcal L_\rho=H+\rho\kappa\kappa^*.       \tag{3.1}
\]

The rank-one ridge is positive definite because the kernel vector in (1.3)
has nonzero `kappa` coefficient.  Direct substitution gives

\[
 \boxed{\mathcal L_\rho^{-1}g=\kappa-x,\qquad
 E_M=g^*\mathcal L_\rho^{-1}\Pi\mathcal L_\rho^{-1}g.}
                                                               \tag{3.2}
\]

For `t>=0`, let

\[
 \mathcal A_t=H+t\Pi,
 \qquad D_t=\det(\mathcal L_\rho+t\Pi),             \tag{3.3}
\]

\[
 N_t=g^*\operatorname {adj}(\mathcal L_\rho+t\Pi)g,
 \qquad \alpha_t={N_t\over D_t}.                   \tag{3.4}
\]

The source core `A_t` is the full ambient diagonal homotopy.  The exact
bordered readouts are

\[
 \boxed{
 D_t=-\rho\det\begin{pmatrix}
       \mathcal A_t&\kappa\\
       \kappa^*&-\rho^{-1}
      \end{pmatrix},}                               \tag{3.5}
\]

\[
 \boxed{
 N_t=\rho\det\begin{pmatrix}
       \mathcal A_t&\kappa&g\\
       \kappa^*&-\rho^{-1}&0\\
       g^*&0&0
      \end{pmatrix}.}                               \tag{3.6}
\]

Both signs in (3.5)--(3.6) are mandatory.  The matrix determinant lemma
also gives

\[
 \det(\mathcal L_\rho+t\Pi+s gg^*)=D_t+sN_t.        \tag{3.7}
\]

For `s>0`, define the positive cross-ratio

\[
 \mathcal R_s(t)=
 \log{D_t(D_0+sN_0)\over D_0(D_t+sN_t)}
 =\log{1+s\alpha_0\over1+s\alpha_t}.                \tag{3.8}
\]

Here

\[
 \alpha_0=g^*\mathcal L_\rho^{-1}g=q-\mu.          \tag{3.9}
\]

Differentiating the inverse, rather than numerically differencing a
determinant, proves

\[
 \mathcal R_s'(t)=
 {s\over1+s\alpha_t}
 g^*(\mathcal L_\rho+t\Pi)^{-1}\Pi
       (\mathcal L_\rho+t\Pi)^{-1}g.                \tag{3.10}
\]

In particular,

\[
 \boxed{E_M={1+s\alpha_0\over s}\mathcal R_s'(0).} \tag{3.11}
\]

An exact determinant-only derivative is

\[
 \mathcal R_s'(0)={D_0'\over D_0}
 -{D_0'+sN_0'\over D_0+sN_0}.                       \tag{3.12}
\]

Thus (3.11) never requires a finite-difference approximation.

### Theorem 3.1 (finite secant with cyclic cap)

Let

\[
 R=\mathcal L_\rho^{-1/2}\Pi\mathcal L_\rho^{-1/2},
 \qquad w=\mathcal L_\rho^{-1/2}g,                  \tag{3.13}
\]

and let `Lambda_cyc` be the largest point in the spectral support of `R`
seen by the cyclic subspace generated by `w`.  Then, for every `t>0`,

\[
 \boxed{
 {tE_M\over1+t\Lambda_{\rm cyc}}
 \leq\alpha_0-\alpha_t\leq tE_M.}                  \tag{3.14}
\]

Moreover,

\[
 \alpha_0-\alpha_t
 ={1+s\alpha_0\over s}\{1-e^{-\mathcal R_s(t)}\}, \tag{3.15}
\]

so

\[
 \boxed{
 {\alpha_0-\alpha_t\over t}
 \leq E_M\leq
 (1+t\Lambda_{\rm cyc}){\alpha_0-\alpha_t\over t}.} \tag{3.16}
\]

**Proof.**  The spectral measure of `R` generated by `w` gives

\[
 \alpha_t=\int{1\over1+t\nu}\,d\sigma_w(\nu),
 \qquad E_M=\int\nu\,d\sigma_w(\nu).               \tag{3.17}
\]

On its support,
`nu/(1+t*Lambda_cyc)<=nu/(1+t*nu)<=nu`.  Integration proves
(3.14), while (3.15) is algebraic rearrangement of (3.8).  \(\square\)

The full cap `||R||` is always a safe substitute for `Lambda_cyc`; it must
not be labelled the cyclic cap without a cyclic-support proof.  The upper
factor in (3.16) is sharp for spectral mass concentrated at
`Lambda_cyc`.

A cap-free finite-secant upper bound is false.  In the scalar family
`R=Lambda`, `||w||^2=1`, one has `E_M=Lambda`, while for fixed `s,t>0`

\[
 \mathcal R_s(t)
 =\log{1+s\over1+s/(1+t\Lambda)}\longrightarrow\log(1+s). \tag{3.18}
\]

Thus a bounded finite response can coexist with arbitrarily large `E_M`.
If `g=0`, then `x=kappa` and `E_M=N_t=mathcal R_s(t)=0`; this is an exact
separate branch.

### 3.2 Cap-free spectral truncation

The global cyclic cap can be replaced by an exact vector-specific spectral
tail, but that tail is a new arithmetic obligation.  For `X>0`, define

\[
 T_X=\int_{(X,\infty)}\nu\,d\sigma_w(\nu).           \tag{3.19}
\]

The atom at `X` belongs to the low interval `[0,X]`; this convention avoids
double counting.  On that interval,

\[
 \nu\leq(1+tX){\nu\over1+t\nu}.
\]

Splitting (3.17) at `X` therefore proves, for every `t>0`,

\[
 \boxed{
 E_M\leq{1+tX\over t}(\alpha_0-\alpha_t)+T_X.}      \tag{3.20}
\]

The scale-matched choice `t=1/X` gives

\[
 \boxed{E_M\leq2X(\alpha_0-\alpha_{1/X})+T_X}       \tag{3.21}
\]

and hence, by (3.15),

\[
 \boxed{
 E_M\leq{2X(1+s\alpha_0)\over s}
 \{1-e^{-\mathcal R_s(1/X)}\}+T_X.}                \tag{3.22}
\]

More generally, if the vector-specific moment

\[
 m_{1+p}=\int\nu^{1+p}\,d\sigma_w(\nu)
\]

is finite, then

\[
 T_X\leq X^{-p}m_{1+p}\qquad(p>0).                 \tag{3.23}
\]

Equations (3.20)--(3.23) avoid a global spectral cap, but no current source
estimate controls `T_X` or a suitable growing moment on the arithmetic
schedule.  Dropping this tail would recreate the false cap-free inference
refuted by (3.18).

### 3.3 Elimination into ambient source minors

The explicit ridge can be eliminated algebraically without changing the
source core:

\[
 D_t=\det\mathcal A_t
 +\rho\,\kappa^*\operatorname {adj}(\mathcal A_t)\kappa, \tag{3.24}
\]

\[
 N_t=g^*\operatorname {adj}(\mathcal A_t)g
 +\rho\,[uv]\det(\mathcal A_t
        +u\kappa\kappa^*+vgg^*).                    \tag{3.25}
\]

The last coefficient is the quadratic exterior, or `(n-2)`-compound,
minor associated with `kappa wedge g`.  Equations (3.24)--(3.25) show that
the border is a compact readout of full ambient minors.  They do not turn
the non-diagonal rank-one readouts into source-Cauchy homotopies.

The existing boundary identity gives only one special contraction of an
adjugate.  It cannot determine all `kappa` and `g` contractions in
(3.24)--(3.25).  For example,

\[
 A_1=\begin{pmatrix}1/2&0\\0&2\end{pmatrix},
 \qquad A_2=\begin{pmatrix}1&1\\1&2\end{pmatrix}    \tag{3.26}
\]

have the same determinant and the same first boundary cofactor, but for
`kappa=e_2` they have different values of
`kappa^*adj(A_i)kappa`.  A new mixed-minor response is real information, not
an algebraic consequence of the old scalar factorization.

## 4. Unbordered source-compatible singular derivative

Define

\[
 \boxed{
 S_M=\langle x,\Pi x\rangle
 ={\operatorname {tr}(\Pi\operatorname {adj}H)
    \over\kappa^*\operatorname {adj}(H)\kappa}
 ={[\partial_t\det(H+t\Pi)]_{t=0}\over c_\kappa}.}  \tag{4.1}
\]

Although `Pi` is a projection, `x` is coefficient-normalized rather than
unit-normalized, so `S_M` need not be at most one.

Put `y=x-kappa`.  Since `<kappa,y>=0`, orthogonal low/high splitting gives

\[
 \langle\Pi\kappa,\Pi y\rangle
 =-\langle(I-\Pi)\kappa,(I-\Pi)y\rangle.             \tag{4.2}
\]

Expanding `S_M` therefore proves the corrected identity

\[
 \boxed{
 S_M-k_{00}=E_M
 -2\operatorname {Re}
 \langle(I-\Pi)\kappa,(I-\Pi)(x-\kappa)\rangle.}    \tag{4.3}
\]

The sign before the high cross term is minus.  Consequently, with

\[
 t_\kappa=\|(I-\Pi)\kappa\|,                        \tag{4.4}
\]

\[
 \boxed{
 |E_M-(S_M-k_{00})|
 \leq2t_\kappa\|x-\kappa\|.}                       \tag{4.5}
\]

Under the Ritz hypotheses of
`notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md`,

\[
 \|x-\kappa\|=\|z\|\leq C_{\rm R}((q-U)/r),         \tag{4.6}
\]

so

\[
 \boxed{
 |E_M-(S_M-k_{00})|
 \leq2t_\kappa C_{\rm R}((q-U)/r).}                 \tag{4.7}
\]

There is no established sign for the high inner product in (4.3).  In
particular, `E_M<=S_M-k_{00}` cannot be asserted from (4.3) alone.

### 4.1 Source factorization of the cofactor normalization

Let

\[
 O_\mu=Q_--\mu I.                                   \tag{4.8}
\]

Let `eta` be the source endpoint vector, `e_0` the central mode, and let
`Phi_mu` be the boundary-normalized ground reconstructed from the odd
resolvent:

\[
 \Phi_\mu=
 \left(1+\langle\eta,\mathfrak D^\dagger
        O_\mu^{-1}\beta\rangle\right)e_0
 -\mathfrak D^\dagger O_\mu^{-1}\beta,
 \qquad \langle\eta,\Phi_\mu\rangle=1.              \tag{4.9}
\]

The source characteristic-ratio identity extends polynomially through the
simple even root:

\[
 \det O_\mu
 =\langle\eta,\operatorname {adj}(H)e_0\rangle.     \tag{4.10}
\]

Both sides of

\[
 \operatorname {adj}(H)e_0=(\det O_\mu)\Phi_\mu     \tag{4.11}
\]

lie on the same ground line and have boundary value `det O_mu`, proving
(4.11).  Write

\[
 p_\mu=\langle\kappa,\Phi_\mu\rangle\ne0.           \tag{4.12}
\]

Rank-one cofactor algebra then gives

\[
 \boxed{
 c_\kappa={\det(O_\mu)|p_\mu|^2\over
                   \langle e_0,\Phi_\mu\rangle}.}   \tag{4.13}
\]

Under the simple-even and positive-odd hypotheses, the denominator in
(4.13) is real and positive.  Combining (4.1) and (4.13) yields the entirely
source-reconstructible ratio

\[
 \boxed{
 S_M={
 [\partial_t\det(H+t\Pi)]_{t=0}
 \langle e_0,\Phi_\mu\rangle
 \over
 \det(O_\mu)|\langle\kappa,\Phi_\mu\rangle|^2}.}    \tag{4.14}
\]

Thus the generic `kappa` cofactor is factorized into an odd determinant and
two overlaps of the independently source-reconstructed ground.  It is not
eliminated without equivalent ground-alignment information.

### 4.2 Exact anchor-transverse alignment decomposition

Let

\[
 R=I-\Pi,\qquad p=\Pi\kappa,\qquad
 h=\langle R\kappa,R(x-\kappa)\rangle.             \tag{4.15}
\]

Suppose first that

\[
 k_{00}=\|p\|^2>0,\qquad
 \mathcal L_M=\operatorname {Ran}\Pi\cap p^\perp. \tag{4.16}
\]

The orthogonal projection onto this anchor-transverse low space is

\[
 P_{\mathcal L_M}=\Pi-{pp^*\over k_{00}}.          \tag{4.17}
\]

Since `y=x-kappa` satisfies `<kappa,y>=0`,

\[
 \langle p,\Pi y\rangle=-h.                        \tag{4.18}
\]

Moreover, `P_(mathcal L_M)kappa=0`, so orthogonal decomposition along
`C*p direct-sum mathcal L_M` proves

\[
 \boxed{
 E_M=\|P_{\mathcal L_M}x\|^2+{|h|^2\over k_{00}}.} \tag{4.19}
\]

Combining (4.19) with (4.3) yields the sharper exact identity

\[
 \boxed{
 S_M-k_{00}=\|P_{\mathcal L_M}x\|^2
 +{|h|^2\over k_{00}}-2\operatorname {Re}h.}       \tag{4.20}
\]

The branch `k_(00)=0` must be stated separately: then `p=0`, `h=0`,
`mathcal L_M=Ran(Pi)`, and

\[
 E_M=S_M=\|P_{\mathcal L_M}x\|^2.                 \tag{4.21}
\]

No quotient by `k_(00)` is defined in this branch.  On the actual schedule,
`||kappa||=1` gives

\[
 k_{00}=1-t_\kappa^2,                              \tag{4.22}
\]

so any tail estimate with `t_kappa->0` gives `k_(00)>=1/2` eventually.
Equations (4.19)--(4.20) are exact in the complex Hermitian setting; in
particular, the modulus square and real part cannot be dropped.

## 5. Actual-source BV tail and a polynomial low cutoff

The preceding additive error was too large at `M=ceil(lambda)` if one used
only a bounded correction norm.  The already-proved bounded-variation
estimate for the **actual combined source state** permits a larger
polynomial cutoff while the separately locked Fourier dimension remains
exponential.

In the notation of
`notes/OUTER_PROJECTION_RADICAL_REDUCTION.md`, write the actual source
combination as

\[
 X=a_4K_4-a_{0,\lambda}K_0,
 \qquad a_4={\sqrt3\over2^{11/4}},
 \qquad |a_{0,\lambda}/a_4|\leq2\sqrt2\lambda.      \tag{5.1}
\]

That theorem proves

\[
 \overline V_\lambda=
 4\lambda(2\pi\lambda^2+1/2)+32\pi\lambda^2,
 \qquad S_\lambda=a_4(1+2\sqrt2\lambda),            \tag{5.2}
\]

\[
 V_\lambda=S_\lambda\overline V_\lambda,
 \qquad A_\lambda={\sqrt L\over2\pi}V_\lambda,     \tag{5.3}
\]

and, for the centered Fourier coefficients `x_n=<V_n,X>`,

\[
 |x_n|\leq {A_\lambda\over|n|}\quad(n\ne0).         \tag{5.4}
\]

For `1<=M<N`, (5.4) gives

\[
 \sum_{M<|n|\leq N}|x_n|^2
 \leq {2A_\lambda^2\over M}.                        \tag{5.5}
\]

On the locked exponential `N=N(lambda)` schedule, the projected-state norm
theorem gives constants `0<a_-<=a_(lambda,N)<=a_+<infinity` eventually.
Since `kappa=P_NX/a_(lambda,N)`, equations (5.2)--(5.5) prove

\[
 \boxed{
 t_\kappa\leq{\sqrt2A_\lambda\over
                    a_{\lambda,N}\sqrt M}
 =O\!\left(\lambda^4\sqrt{L/M}\right).}             \tag{5.6}
\]

For

\[
 M=\lceil\lambda^p\rceil<N(\lambda),                \tag{5.7}
\]

this is

\[
 \boxed{
 t_\kappa=O\!\left(
 \lambda^{4-p/2}\sqrt{\log\lambda}\right).}        \tag{5.8}
\]

This is an estimate for the locked source-normalized combination, not a
unit-normalized substitute.

### Theorem 5.1 (conditional `p=12` projective criterion)

Take the locked exponential `N(lambda)` and

\[
 M(\lambda)=\lceil\lambda^{12}\rceil.               \tag{5.9}
\]

Assume, on an unbounded locked arithmetic schedule,

1. the sharp even and odd signs in Section 6;
2. `r>0` and `(q-u)/r` remains bounded, with the Ritz correction bound
   (4.7) taken at the same exact shift `U=u`; and
3. the source-compatible singular response satisfies

\[
 \boxed{|S_M-k_{00}|=O(\lambda^{-1}).}               \tag{5.10}
\]

Then the complete projective locally-uniform criterion of
`notes/RITZ_PROJECTIVE_LOW_MODE_DETERMINANT_GATE.md` holds.

**Proof.**  Bounded `(q-u)/r` makes `C_R` bounded when (4.7) is used at
`U=u`.  Equations (4.7) and
(5.8), with `p=12`, give

\[
 E_M=O(\lambda^{-1})
 +O(\lambda^{-2}\sqrt{\log\lambda})
 =O(\lambda^{-1}).                                  \tag{5.11}
\]

The source normalization `a_(lambda,N)` is bounded above and below.  Thus,
for every fixed `eta<1/2`,

\[
 a_{\lambda,N}^2L\lambda^{2\eta}E_M
 =O(\log\lambda\,\lambda^{2\eta-1})\longrightarrow0. \tag{5.12}
\]

The high-mode bridge term obeys

\[
 a_{\lambda,N}\lambda^\eta\sqrt{L/M}\,C_R
 =O(\lambda^{\eta-6}\sqrt{\log\lambda})\longrightarrow0. \tag{5.13}
\]

The existing projection theorem makes
`sqrt(L)*lambda^eta*||P_Nk_lambda^+-k_lambda^+||` tend to zero on the locked
exponential schedule.  Also `M<N` and the compact frequency-separation
condition hold eventually.  These are exactly the three hypotheses of the
projective bridge.  \(\square\)

Theorem 5.1 is conditional.  It proves that (5.10), together with the two
sector gates, is sufficient; it does not prove any of those arithmetic
premises.  Its conclusion is the projective locally-uniform criterion, not
the stronger full-`L2` equation (5.2).

### Corollary 5.2 (alignment form of the missing response rate)

There is also a stronger admitted tail estimate, but it must be invoked with
its own hypotheses rather than attributed to the finite checkpoint.  The
nested centered projections in
`notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md` give, for a sufficiently
large fixed `D`,

\[
 N_0(\lambda)=\lceil D\lambda^2L^2\rceil,
 \qquad \|(I-P_{N_0})X\|=O(e^{-c\lambda^2}).        \tag{5.14}
\]

Take the same locked exponential outer dimension `N(lambda)` as in Theorem
5.1 and `M=ceil(lambda^12)`.  Eventually

\[
 N_0(\lambda)\leq M(\lambda)<N(\lambda).           \tag{5.15}
\]

Because all three centered Fourier projections are nested, and because the
locked source normalization `a_(lambda,N)=||P_NX||` is bounded below,

\[
 \begin{aligned}
 t_\kappa
 &= {\|(I-P_M)P_NX\|\over a_{\lambda,N}}\\
 &= {\|(P_N-P_M)X\|\over a_{\lambda,N}}
 \leq {\|(I-P_{N_0})X\|\over a_{\lambda,N}}
 =O(e^{-c\lambda^2}).                              \tag{5.16}
 \end{aligned}
\]

Assume `r>0`, use the exact lower Ritz shift `U=u`, and assume `d/r=(q-u)/r`
is bounded.  The Ritz theorem then gives `||x-kappa||=O(1)`.  Hence

\[
 |h|\leq t_\kappa\|x-\kappa\|=O(e^{-c\lambda^2}),
 \qquad k_{00}\geq\tfrac12                         \tag{5.17}
\]

eventually.  Equation (4.20) therefore proves

\[
 (S_M-k_{00})-\|P_{\mathcal L_M}x\|^2
 =O(e^{-c\lambda^2})=o(\lambda^{-1}).              \tag{5.18}
\]

Let `Phi_mu` be the boundary-normalized ground in (4.9) and retain the
mandatory nonvanishing overlap `p_mu=<kappa,Phi_mu>`.  Since
`x=Phi_mu/p_mu`, (5.18) gives the exact reduction

\[
 \boxed{
 |S_M-k_{00}|=O(\lambda^{-1})
 \quad\Longleftrightarrow\quad
 \|P_{\mathcal L_M}\Phi_\mu\|^2
 =O(\lambda^{-1})|\langle\kappa,\Phi_\mu\rangle|^2.} \tag{5.19}
\]

The already-proved BV estimate (5.8) also makes the error in (5.18)
`o(lambda^(-1))` at `p=12`; the Gevrey route records the sharper admitted
nested-projection remainder.  Formula (5.19) reformulates the existing
unresolved odd-resolvent ground-alignment obstruction in
`notes/ODD_RESOLVENT_WEYL_RECONSTRUCTION.md`.  It supplies no
decay estimate for that alignment, and therefore proves neither premise in
(5.19) for the arithmetic Weil/prolate matrices.

## 6. Exact finite sector gates

Neither the Ritz scalars nor the source displacement force the two strict
sector signs.  The following Schur forms state the exact missing finite
inequalities.

### 6.1 Sharp even gate at the lower two-vector Ritz value

Assume `r=||b||>0`, put `w=b/r`, and let `u` be the lower Ritz value on
`span{kappa,w}`.  Set

\[
 d=q-u>0,
 \qquad \mathcal F=(\operatorname {span}\{\kappa,w\})^\perp, \tag{6.1}
\]

\[
 C_u=P_\mathcal F(Q_+-uI)P_\mathcal F|_\mathcal F,
 \qquad c_u=P_\mathcal FQ_+w.                       \tag{6.2}
\]

The two-vector Ritz equation is

\[
 d\,\langle w,(Q_+-uI)w\rangle=r^2.                \tag{6.3}
\]

Relative to `kappa^perp=C w direct-sum F`,

\[
 B_u=P_{\kappa^\perp}(Q_+-uI)P_{\kappa^\perp}
 =\begin{pmatrix}r^2/d&c_u^*\\c_u&C_u\end{pmatrix}. \tag{6.4}
\]

Define

\[
 y_u=\kappa-{d\over r}w,
 \qquad e_u=(Q_+-uI)y_u=-{d\over r}c_u\in\mathcal F. \tag{6.5}
\]

Ordinary Schur complementation gives the sharp equivalence

\[
 \boxed{
 B_u\succ0
 \quad\Longleftrightarrow\quad
 C_u-{1\over d}e_ue_u^*\succ0.}                    \tag{6.6}
\]

The vector `e_u` is formed from the complete combined source action.  The
Ritz identity controls only the first scalar in (6.4), not (6.6).

### 6.2 Sharp odd source-response gate

Let `mathfrak D` be the even-to-odd mode map in the parity source identity

\[
 \mathfrak DQ_+-Q_-\mathfrak D
 =|\beta\rangle\langle\eta|.                        \tag{6.7}
\]

Assume `x_D=mathfrak D*kappa` is nonzero, put

\[
 \delta_\kappa=\langle\eta,\kappa\rangle,
 \qquad s_q=\mathfrak D(Q_+-qI)\kappa
             -\delta_\kappa\beta
          =(Q_--qI)x_D.                             \tag{6.8}
\]

At `u=q-d`,

\[
 s_u=s_q+dx_D=(Q_--uI)x_D.                          \tag{6.9}
\]

Let

\[
 y_D={x_D\over\|x_D\|},
 \qquad \mathcal G=y_D^\perp,                      \tag{6.10}
\]

\[
 A_q=P_\mathcal G(Q_--qI)P_\mathcal G|_\mathcal G,
 \quad a_q={\langle x_D,s_q\rangle\over\|x_D\|^2},
 \quad c_q={P_\mathcal Gs_q\over\|x_D\|}.         \tag{6.11}
\]

Then

\[
 Q_--uI=
 \begin{pmatrix}
 a_q+d&c_q^*\\c_q&A_q+dI
 \end{pmatrix}                                     \tag{6.12}
\]

on `C*y_D direct-sum G`, and hence

\[
 \boxed{
 Q_--uI\succ0
 \Longleftrightarrow
 \begin{cases}
 A_q+dI\succ0,\\
 a_q+d-c_q^*(A_q+dI)^{-1}c_q>0.
 \end{cases}}                                      \tag{6.13}
\]

The boundary identity

\[
 \det(Q_--zI)
 =\langle\eta,\operatorname {adj}(Q_+-zI)e_0\rangle \tag{6.14}
\]

reconstructs the odd determinant, not its inertia.  A positive determinant
alone cannot replace (6.13).

For `U` with `u<=U<=q`, the corresponding exact tests are simply
`A-UI>0` in the even complement and `Q_--UI>0` in the odd sector.  If the
tests pass at `q`, lowering to `U` preserves them by adding `(q-U)I`; the
Ritz value alone does not make them automatic.  The `r=0` branch must be
handled at the Rayleigh shift `q` and must not form `d/r`.

## 7. Counterexamples and fail-closed boundary

### 7.1 Ritz and source displacement do not force the signs

On complex modes `0,\pm1,\pm2`, take the inversion-symmetric diagonal
source-Cauchy matrix with diagonal values

\[
 0,2,2,-1,-1                                             \tag{7.1}
\]

and displacement vector `beta=0`.  In the even sector choose

\[
 \kappa={e_0^++e_1^+\over\sqrt2}.                    \tag{7.2}
\]

Then `q=1`, `r=1`, and the lower two-vector Ritz value is `u=0`.  But the
even complement contains `e_2^+` with value `-1`, and the odd sector
contains `e_2^-` with value `-1`.  Thus neither strict sign follows from
`q,u,r` and the source displacement identity.

There is also a nonzero-displacement all-dimensional source-Cauchy family.
For `n!=0`, set

\[
 b_n=-{9n\over5n^2-2},
 \qquad \kappa={2\sqrt2e_0+3e_1^+\over\sqrt{17}}.    \tag{7.3}
\]

With the diagonal parameters in
`notes/UNBOUNDED_RELATIVE_ORIENTATION_INSTABILITY.md`, both members have
the same lower Ritz value `u=12-sqrt(22)` and satisfy
`B_u>=10^(-2)I`.  The fail member nevertheless has the odd low determinant

\[
 -{28\over9}+{\sqrt{22}\over2}<0.                   \tag{7.4}
\]

This is a source-Cauchy structural counterfamily, not the pinned arithmetic
Weil matrix.

### 7.2 Determinant and boundary data do not sign inertia

The Hermitian matrix `diag(-1,-1)` has positive determinant and is negative
definite.  More generally, the characteristic polynomial of a Hermitian
matrix `T` gives the exact sign gate

\[
 T\succ0
 \Longleftrightarrow
 \text{every coefficient of }\det(T+sI)\text{ is positive}, \tag{7.5}
\]

because all characteristic roots are real.  Checking only the constant
coefficient is insufficient.

### 7.3 Strict signs and zero tail do not force ground alignment

The missing estimate in (5.19) is not a consequence of the structural
identities, strict sector signs, or tail decay.  On even modes
`e_0,e_1^+,...,e_N^+` and odd modes `e_1^-,...,e_N^-`, let

\[
 Q_+e_0=0,\qquad Q_+e_n^+=e_n^+\ (n\geq1),
 \qquad Q_-=I,                                      \tag{7.6}
\]

and choose

\[
 \kappa={\sqrt3\over2}e_0+{1\over2}e_1^+.         \tag{7.7}
\]

This is an inversion-symmetric diagonal source-Cauchy family.  Its source
displacement is zero, and its boundary identity is the polynomial identity

\[
 \det(Q_--zI)=(1-z)^N
 =\langle e_0,\operatorname {adj}(Q_+-zI)e_0\rangle. \tag{7.8}
\]

The two-vector Ritz space is `span{e_0,e_1^+}` and

\[
 \mu=u=0,\quad q=d={1\over4},\quad r={\sqrt3\over4},
 \quad {d\over r}={1\over\sqrt3}.                  \tag{7.9}
\]

The even complementary block has eigenvalues `3/4,1,...,1`, the sharp
even transverse Schur gate is the identity, and `Q_--uI=I`; hence both
strict signs pass.  For every `M>=1`, the normalized ground and the anchor
are entirely cutoff-visible:

\[
 \Phi_\mu=e_0,\quad p_\mu={\sqrt3\over2},\quad
 x={2\over\sqrt3}e_0,\quad t_\kappa=h=0,
 \quad k_{00}=1.                                   \tag{7.10}
\]

Nevertheless,

\[
 \boxed{
 S_M-k_{00}=E_M=\|P_{\mathcal L_M}x\|^2={1\over3},}
                                                               \tag{7.11}
\]

and equivalently

\[
 \|P_{\mathcal L_M}\Phi_\mu\|^2={1\over4}
 ={1\over3}|\langle\kappa,\Phi_\mu\rangle|^2.    \tag{7.12}
\]

Thus the alignment response has no decay even with exact ground shift,
bounded `d/r`, strict signs, exact source Cauchy structure, and identically
zero high tail.  This growing family is a structural counterexample, not
the pinned arithmetic Weil/prolate family.

### 7.4 Mandatory rejections

Any theorem implementation or replay must reject a claimed pass if it

1. replaces a conjugate transpose by a transpose or drops the real part in
   (2.4) or (4.3);
2. changes either bordered sign in (3.5)--(3.6), drops an anchor/cross term,
   or describes the augmented border as source-Cauchy;
3. uses a numerical finite difference as the exact derivative in (3.11);
4. uses a positive finite secant as an upper bound without the cyclic cap,
   or labels the full cap as the cyclic cap without proof;
5. substitutes `U`, a rounded shift, or a real-axis eigenvalue match for the
   true simple ground `mu` in the singular adjugate formulas;
6. divides by `c_kappa`, `det(O_mu)`, or `<kappa,Phi_mu>` without proving it
   nonzero, or divides by `k_(00)` without taking the separate zero branch;
7. uses the incorrect plus sign before the high cross term in (4.3), or
   assumes the cross term has the favorable pilot sign;
8. replaces the locked source normalization by unit norm.  Such a change
   may leave `E_M` invariant while changing `a_(lambda,N)^2E_M` and the
   limiting scalar;
9. infers either sector sign from Ritz interlacing, the source displacement,
   one determinant, or real-axis eigenvalue agreement;
10. reads source parameters through binary64, imports cached matrices or
    eigenvectors, assumes a real-zero list or global Weil positivity, omits
    a prime power, changes the Fourier sign, confuses `lambda` with
    `lambda^2`, or drops inversion reflection; or
11. infers the alignment estimate (5.19) from strict sector signs, zero
    high tail, the diagonal source-Cauchy structure, or the counterexample's
    boundary determinant identity; or
12. promotes the finite identities, the conditional theorem, or a pilot to
    equation (5.2), an actual unbounded response estimate, locally uniform
    convergence without the stated premises, a new Lambda bound, or RH.

The only terminal labels allowed by the project remain
`P0_EXACT_FORMULAS_PASS`, `P0_DIAGNOSTIC_PASS`, `P0_UNRESOLVED`, and
`P0_INVALIDATED`.
