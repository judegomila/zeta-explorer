# Paired trace as an odd-resolvent compensation gate

## 0. Claim boundary and outcome

This note sharpens the unresolved first-trace condition in
`notes/LOCALLY_UNIFORM_DETERMINANT_ATTACK.md` for the actual finite CCM Weil
quotient.  Under the exact finite simple-even hypotheses, the first paired
quotient trace has an identity in terms of one scalar response of the shifted
odd Weil block.  Equivalently, the trace is uniformly bounded if and only if
one quotient characteristic-function ratio at two fixed imaginary heights is
bounded away from zero.

On schedules with `N/L^2 -> infinity`, where `L=2 log(lambda)`, the elementary
central-lattice factor in this ratio decays like

\[
 {\sigma\over\tau}\exp\!\left(-{(\sigma-\tau)L\over2}\right)
 \qquad(0<\tau<\sigma<1/2).
\]

Therefore the exact shifted-odd response must compensate on the reciprocal
exponential scale.  A subexponential response forces the first paired
quotient trace to grow at least linearly in `L`.  This is a sharp obstruction
to obtaining the normal-family gate from bounds which are only polynomial in
`L` (equivalently polylogarithmic in `lambda`).

No such exponential compensation estimate is proved here for the arithmetic
Weil matrices.  No quotient trace limit, locally uniform determinant limit,
equation (5.2), signed unbounded-schedule theorem, or Riemann-hypothesis
conclusion follows.  The project state remains `P0_INVALIDATED`.

The finite source is Connes--Consani--Moscovici, *Zeta Spectral Triples*,
arXiv:2511.22755v1, vendored as `vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The inputs are Lemma 5.1 (5.2), Lemma 5.2 (5.3), Lemma 5.4 (5.5), and
Theorem 5.10 (5.26).  The derivation below uses no zero table, no global Weil
positivity, and no matrix or eigenvector imported from a diagnostic preprint.

## 1. Exact finite setup

Fix `lambda>1`, put

\[
 L=2\log\lambda,
\]

and let `E_N` have the source orthonormal basis `V_n`, `-N<=n<=N`.  Write

\[
 D V_n=nV_n,\qquad
 \eta=\sum_{|n|\le N}V_n,\qquad
 \beta=\sum_{|n|\le N}b_nV_n.                    \tag{1.1}
\]

The exact Cauchy form and its displacement identity are

\[
 Q_{nm}=\frac{b_n-b_m}{n-m}\quad(n\ne m),
 \qquad
 [D,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|,              \tag{1.2}
\]

with `b_(-n)=-b_n`.  All pole, archimedean, and finite prime-power terms,
including the source minus sign on the prime block, are contained in `Q`.

Assume that the actual lowest eigenvalue `epsilon` of `Q` is simple and has
an inversion-even eigenvector.  Put

\[
 T=Q-\epsilon I\ge0.                              \tag{1.3}
\]

Choose the real even kernel vector `xi` so that

\[
 T\xi=0,\qquad \langle\eta,\xi\rangle=1.          \tag{1.4}
\]

This is the source normalization used in Lemma 5.4; it differs by a harmless
nonzero scalar from `delta_N(xi)=1`.  Let `H_-` be the inversion-odd sector
and let `T_-` be the restriction of `T` to `H_-`.  Simplicity and evenness of
the kernel imply

\[
 T_->0.                                           \tag{1.5}
\]

The source commutator proof gives the exact forced odd equation

\[
 T D\xi=-\beta,
 \qquad
 D\xi=-T_-^{-1}\beta.                             \tag{1.6}
\]

Let `D''` be the source self-adjoint quotient operator on
`E_N/C xi` in the `T` metric, and restore the physical scale by

\[
 B_{\lambda,N}={2\pi\over L}D''.                  \tag{1.7}
\]

Lemma 5.4 gives its characteristic polynomial as

\[
 P(s):=\det(D''-s)
 =\det(D-s)h(s),
 \qquad
 h(s)=\sum_{j=-N}^{N}{\xi_j\over j-s}.            \tag{1.8}
\]

The quotient metric is essential in the self-adjointness assertion.  It
implies that the `2N` roots of `P` are real.  Inversion evenness pairs them as
`+/-s_k`, `1<=k<=N`, including a possible zero pair with multiplicity.

## 2. The exact odd-response scalar

For `n>=1`, use the real normalized odd basis

\[
 e_n^-={V_n-V_{-n}\over\sqrt2}.                   \tag{2.1}
\]

For every `alpha>0`, define

\[
 g_\alpha
 =\sum_{n=1}^{N}{\sqrt2\,n\over n^2+\alpha^2}e_n^-,
 \qquad
 \boxed{
 A(\alpha)=1+\langle g_\alpha,T_-^{-1}\beta\rangle.}       \tag{2.2}
\]

This is a scalar response of the actual shifted odd block; it is not a
generic coefficient bound.

### Proposition 2.1 (Cauchy scalar equals odd response)

For every `alpha>0`,

\[
 \boxed{h(i\alpha)={i\over\alpha}A(\alpha).}       \tag{2.3}
\]

Moreover `A(alpha)>0`.

**Proof.**  Evenness gives `xi_(-n)=xi_n`, while (1.4) gives
`xi_0+2 sum_(n=1)^N xi_n=1`.  Direct pairing of the `+/-n` terms yields

\[
\begin{aligned}
 h(i\alpha)
 &=i\left({\xi_0\over\alpha}
       +2\alpha\sum_{n=1}^{N}{\xi_n\over n^2+\alpha^2}\right)\\
 &={i\over\alpha}
   \left(1-2\sum_{n=1}^{N}{n^2\xi_n\over n^2+\alpha^2}\right). \tag{2.4}
\end{aligned}
\]

The coefficient of `e_n^-` in `D xi` is `sqrt(2)n xi_n`, so

\[
 \langle g_\alpha,D\xi\rangle
 =2\sum_{n=1}^{N}{n^2\xi_n\over n^2+\alpha^2}.     \tag{2.5}
\]

Equations (1.6), (2.2), and (2.4)--(2.5) prove (2.3).  Since the spectrum of
`D''` is real, `P(i alpha)` is nonzero.  Also `det(D-i alpha)` is nonzero, so
(1.8) gives `h(i alpha)!=0` and hence `A(alpha)!=0`.  Finally
`A(alpha)->1` as `alpha->infinity`; continuity then gives `A(alpha)>0` on
the whole positive axis. \(\square\)

Qualitative boundary nonvanishing alone says only `A(alpha)!=0`.  The trace
gate below needs a quantitative comparison of `A` at two heights.

## 3. Exact quotient ratio and trace

Fix once and for all

\[
 0<\tau<\sigma<{1\over2},
 \qquad
 \alpha={\sigma L\over2\pi},
 \qquad
 \gamma={\tau L\over2\pi}.                       \tag{3.1}
\]

The letter `gamma` here is only the lower imaginary-height parameter; it is
not a zeta-zero ordinate.  Define the positive quotient ratio

\[
 R^{\rm q}_{\lambda,N}(\tau,\sigma)
 ={P(i\gamma)\over P(i\alpha)}
 =\prod_{k=1}^{N}
   {((2\pi s_k/L)^2+\tau^2)
    \over((2\pi s_k/L)^2+\sigma^2)}.              \tag{3.2}
\]

### Theorem 3.1 (odd compensation identity)

One has the exact finite identity

\[
 \boxed{
 R^{\rm q}_{\lambda,N}(\tau,\sigma)
 ={A(\gamma)\over A(\alpha)}
  \prod_{n=1}^{N}{n^2+\gamma^2\over n^2+\alpha^2}.}        \tag{3.3}
\]

**Proof.**  Pairing the diagonal factors gives

\[
 \det(D-i\alpha)
 =(-i\alpha)(-1)^N\prod_{n=1}^{N}(n^2+\alpha^2). \tag{3.4}
\]

Insert (2.3) into (1.8):

\[
 P(i\alpha)=(-1)^N A(\alpha)
             \prod_{n=1}^{N}(n^2+\alpha^2).       \tag{3.5}
\]

Taking the ratio at `gamma` and `alpha` proves (3.3). \(\square\)

There is an exact bridge back to the finite ground transform.  Source
equation (5.25), with `s=zL/(2*pi)`, gives

\[
 \widehat\xi(z)
 =-{\sqrt L\over\pi}\sin(zL/2)h(s).
\]

At the two imaginary heights, Proposition 2.1 therefore gives

\[
 \boxed{
 \widehat\xi(i\sigma)
 ={2\sinh(\sigma L/2)\over\sigma\sqrt L}A(\alpha),
 \qquad
 \widehat\xi(i\tau)
 ={2\sinh(\tau L/2)\over\tau\sqrt L}A(\gamma).}     \tag{3.3a}
\]

If `C_infinity` denotes (5.2), then (3.3) becomes the exact projective
two-height identity

\[
 \boxed{
 R^{\rm q}_{\lambda,N}(\tau,\sigma)
 ={\widehat\xi(i\tau)\over\widehat\xi(i\sigma)}
   {C_N(\gamma,\alpha)\over
    C_\infty(\gamma,\alpha)}.}                       \tag{3.3b}
\]

Thus the exponential growth in `A(gamma)/A(alpha)` is precisely the factor
which cancels the hyperbolic-sine decay in the compactly supported ground
transform.  When `N/L^2->infinity`, the second factor in (3.3b) tends to one
by (5.3).  The first-trace gate is then equivalent to a quantitative lower
bound for one scale-free ground-transform ratio.  This links the trace route
to the anchor-normalized projective-wedge criterion; it does not prove that
either condition holds for the arithmetic matrices.

Define the finite quotient part of the first paired trace by

\[
 S^{\rm q}_{\lambda,N}(\sigma)
 ={1\over2}\operatorname {Tr}_{E'_N}
      (B_{\lambda,N}^2+\sigma^2)^{-1}
 =\sum_{k=1}^{N}{1\over(2\pi s_k/L)^2+\sigma^2}. \tag{3.6}
\]

### Theorem 3.2 (exact logarithmic-derivative formula)

For every `alpha>0`, with `sigma=2 pi alpha/L` and
`A'=dA/dalpha`,

\[
 \boxed{
 S^{\rm q}_{\lambda,N}(\sigma)
 =\left({L\over2\pi}\right)^2
  \left\{
    \sum_{n=1}^{N}{1\over n^2+\alpha^2}
    +{A'(\alpha)\over2\alpha A(\alpha)}
  \right\}.}                                      \tag{3.7}
\]

**Proof.**  From the paired roots,

\[
 {d\over d\alpha}\log|P(i\alpha)|
 =2\alpha\sum_{k=1}^{N}{1\over s_k^2+\alpha^2}.  \tag{3.8}
\]

Taking the same derivative in (3.5) and restoring the physical scale proves
(3.7). \(\square\)

Formula (3.7) shows the cancellation needed for a uniform trace.  The
positive central-lattice sum is of order `1/L` when `alpha` is of order
`L`; after multiplication by `L^2`, it would diverge linearly unless the
logarithmic derivative of `A` cancels it to relative precision `O(1/L)`.

## 4. A two-height criterion equivalent to the first trace

Put `a=sigma^2-tau^2`.  For the physical paired quotient roots
`rho_k=2 pi s_k/L`, equation (3.2) reads

\[
 R^{\rm q}_{\lambda,N}
 =\prod_{k=1}^{N}(1-x_k),
 \qquad
 x_k={a\over\rho_k^2+\sigma^2},
 \qquad
 0\le x_k\le1-{\tau^2\over\sigma^2}<1.           \tag{4.1}
\]

For `0<=x<=c<1`,

\[
 x\le-\log(1-x)\le{x\over1-c}.                   \tag{4.2}
\]

Summing (4.2) with `c=1-tau^2/sigma^2` proves the sharp fixed-constant
comparison

\[
 \boxed{
 aS^{\rm q}_{\lambda,N}(\sigma)
 \le-\log R^{\rm q}_{\lambda,N}(\tau,\sigma)
 \le {a\sigma^2\over\tau^2}
       S^{\rm q}_{\lambda,N}(\sigma).}            \tag{4.3}
\]

Equivalently,

\[
 {\tau^2\over a\sigma^2}(-\log R^{\rm q})
 \le S^{\rm q}_{\lambda,N}(\sigma)
 \le {-\log R^{\rm q}\over a}.                  \tag{4.4}
\]

### Corollary 4.1 (one scalar is the uniform first-trace gate)

Along any sequence of finite simple-even Weil quotients, the following are
equivalent:

1. `sup_j S^q_(lambda_j,N_j)(sigma)<infinity`;
2. `inf_j R^q_(lambda_j,N_j)(tau,sigma)>0`.

Thus one two-height quotient ratio is necessary and sufficient for the
normal-family first-trace bound.  This does not identify any limiting trace
moment and therefore does not prove convergence to `Xi`.

## 5. The forced exponential compensation

Isolate the central-lattice product

\[
 C_N(\gamma,\alpha)
 =\prod_{n=1}^{N}{n^2+\gamma^2\over n^2+\alpha^2}.          \tag{5.1}
\]

The classical product for `sinh` gives

\[
 C_\infty(\gamma,\alpha)
 ={\sinh(\pi\gamma)/(\pi\gamma)
   \over\sinh(\pi\alpha)/(\pi\alpha)}.           \tag{5.2}
\]

The finite/infinite error has the explicit one-sided bound

\[
 0\le\log{C_N\over C_\infty}
 \le(\alpha^2-\gamma^2)\sum_{n>N}{1\over n^2+\gamma^2}
 \le{\alpha^2-\gamma^2\over N}.                  \tag{5.3}
\]

Consequently, if `N/L^2->infinity`, then

\[
 C_N(\gamma,\alpha)
 ={\sigma\over\tau}
  e^{-(\sigma-\tau)L/2}
  {1-e^{-\tau L}\over1-e^{-\sigma L}}
  e^{o(1)}.                                       \tag{5.4}
\]

Combine (3.3), (4.3), and (5.4).

### Theorem 5.1 (exponential odd-response necessity)

Suppose `lambda_j->infinity`, `N_j/L_j^2->infinity`, and the finite
simple-even hypotheses hold.  If

\[
 \sup_j S^{\rm q}_{\lambda_j,N_j}(\sigma)<\infty, \tag{5.5}
\]

then there are constants `0<c<=C<infinity` such that, eventually,

\[
 \boxed{
 c\,{\tau\over\sigma}e^{(\sigma-\tau)L_j/2}
 \le {A_j(\gamma_j)\over A_j(\alpha_j)}
 \le C\,{\tau\over\sigma}e^{(\sigma-\tau)L_j/2}.}        \tag{5.6}
\]

Conversely, the lower bound in (5.6), with any fixed positive `c`, implies
the uniform trace bound (5.5).  The upper bound is automatic for an actual
quotient because `R^q<=1`.

If instead

\[
 \log{A_j(\gamma_j)\over A_j(\alpha_j)}=o(L_j),    \tag{5.7}
\]

then

\[
 \boxed{
 S^{\rm q}_{\lambda_j,N_j}(\sigma)
 \ge {\tau^2\over(\sigma^2-\tau^2)\sigma^2}
      \left({\sigma-\tau\over2}L_j+o(L_j)\right),}        \tag{5.8}
\]

so the first quotient trace diverges at least linearly in `L_j`.

**Proof.**  A uniform trace bound and (4.3) put `R^q` between two positive
constants.  Equation (3.3) then says that `A(gamma)/A(alpha)` is between two
positive constant multiples of `C_N^(-1)`, and (5.4) proves (5.6).  The
converse follows from the upper trace bound in (4.4).  Under (5.7), equations
(3.3) and (5.4) give

\[
 -\log R^q={\sigma-\tau\over2}L+o(L).
\]

The lower trace bound in (4.4) proves (5.8). \(\square\)

There is also a local differential version.  The elementary identity

\[
 \sum_{n=1}^{\infty}{1\over n^2+\alpha^2}
 ={\pi\alpha\coth(\pi\alpha)-1\over2\alpha^2}     \tag{5.9}
\]

and (3.7) show that (5.5), at
`alpha=sigma L/(2 pi)`, forces

\[
 {A'(\alpha)\over A(\alpha)}=-\pi+O(L^{-1})        \tag{5.10}
\]

when `N/L^2->infinity`.  Thus the needed response is not merely large in
norm; its logarithmic slope must nearly saturate the cancellation of the
central lattice.

## 6. Exact smallest remaining lemma

For the first-trace normal-family gate, it is enough to fix one rational pair,
for example

\[
 \tau={1\over8},\qquad\sigma={1\over4},            \tag{6.1}
\]

and prove on one explicit unbounded simple-even schedule with
`N/L^2->infinity` that

\[
 \boxed{
 {A(\tau L/(2\pi))\over A(\sigma L/(2\pi))}
 \ge {c\over C_N(\tau L/(2\pi),\sigma L/(2\pi))}}
 \qquad(c>0\text{ independent of }\lambda).       \tag{6.2}
\]

Here every object is reconstructed from the actual source matrix:

\[
 A(\alpha)=1+\langle g_\alpha,
    (Q-\epsilon I)|_{H_-}^{-1}\beta\rangle.        \tag{6.3}
\]

The existing source commutator proves only that (6.3) is positive.  The
current high-Fourier bounds, scalar quadratic cancellation, prime-power jump,
and finite odd inverse-load diagnostics do not prove the exponential ratio
(6.2).  Conversely, any estimate that leaves the ratio in (6.3)
subexponential is quantitatively incompatible with a uniform first trace by
(5.8).

Even after (6.2), a determinant proof would still have to identify the
quotient trace moments, or establish pointwise convergence on a uniqueness
set, as required by `notes/LOCALLY_UNIFORM_DETERMINANT_ATTACK.md`.  The
present theorem isolates the exact first gate and the cancellation that any
successful arithmetic estimate must preserve.
