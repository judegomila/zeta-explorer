# Parity-pencil reduction of the quotient trace

## 0. Claim boundary and outcome

This note rewrites the finite simple-even CCM quotient as one positive
generalized eigenvalue pencil between the inversion sectors.  It has four
exact consequences.

1. The squares of the finite quotient roots are the generalized eigenvalues
   of

   \[
     (C^*T_+C,T_-),
   \]

   where `C=D|_(H_-)`, `T=Q-epsilon I`, and `T_+`, `T_-` are the two
   inversion-sector blocks.
2. The odd-response scalar `A(alpha)` is an exact relative determinant of
   this pencil and the unperturbed Fourier lattice.
3. Every physical half-paired quotient-resolvent trace moment is a Schatten
   moment of one positive whitened pencil resolvent.  In particular, the
   first-trace gate is exactly a bounded effective-dimension assertion.
4. An explicit nonexceptional Cauchy-form countermodel has `beta!=0`,
   `D xi!=0`, strict positivity on the odd sector, and strict quotient-root
   interlacing, but its response has the wrong monotonicity and its first
   physical trace still grows linearly in `L`.

The pencil is a pullback of the **combined** shifted Weil form.  Therefore
the pole, archimedean, and finite minus-prime contributions remain combined;
no triangle inequality or blockwise sign replacement is used in the exact
identity.

The new representation does not prove the required effective-dimension
bound for the arithmetic matrices.  It proves no unbounded simple-even
schedule, shifted sector sign, trace-moment limit, locally uniform
determinant limit, equation (5.2), or Riemann-hypothesis conclusion.  The
formal project state remains `P0_INVALIDATED`.

The binding finite source is Connes--Consani--Moscovici, *Zeta Spectral
Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The source inputs are Lemma 5.1 (5.2), Lemma 5.2 (5.3), Lemma 5.4
(5.5), and Theorem 5.10 (5.26).  The conventions and source signs are
locked in `P0_SOURCE_LOCK.json` and reproduced in
`notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md`.

## 1. Finite simple-even setup

Fix `lambda>1`, put

\[
 L=2\log\lambda,
\]

and work on the source modes `V_n`, `-N<=n<=N`.  Let

\[
 D V_n=nV_n,
 \qquad
 J V_n=V_{-n},
 \qquad
 \eta=\sum_{|n|\leq N}V_n,
 \qquad
 \beta=\sum_{|n|\leq N}b_nV_n.                 \tag{1.1}
\]

The exact Cauchy form and displacement identity are

\[
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),
 \qquad b_{-n}=-b_n,                             \tag{1.2}
\]

\[
 \boxed{
 [D,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|.}             \tag{1.3}
\]

Assume that the lowest eigenvalue `epsilon` of the actual finite matrix `Q`
is simple and has an inversion-even eigenvector.  Set

\[
 T=Q-\epsilon I\geq0,
 \qquad
 T\xi=0,
 \qquad
 J\xi=\xi,
 \qquad
 \langle\eta,\xi\rangle=1.                     \tag{1.4}
\]

Let `H_+` and `H_-` be the even and odd sectors.  Relative to
`H_+ direct-sum H_-`, write

\[
 T=T_+\oplus T_-.
\]

Then

\[
 T_+\geq0,
 \qquad
 \ker T_+=\mathbb C\xi,
 \qquad
 T_->0.                                          \tag{1.5}
\]

Use the real parity bases

\[
 e_0^+=V_0,
 \qquad
 e_n^+={V_n+V_{-n}\over\sqrt2},
 \qquad
 e_n^-={V_n-V_{-n}\over\sqrt2}\quad(1\leq n\leq N). \tag{1.6}
\]

Define

\[
 C=D|_{H_-}:H_-\longrightarrow H_+.
\]

Thus `C e_n^-=n e_n^+`, `C^*e_n^+=n e_n^-`, and `C^*e_0^+=0`.  In block
form,

\[
 D=\begin{pmatrix}0&C\\ C^*&0\end{pmatrix}.     \tag{1.7}
\]

The source commutator proof gives

\[
 \boxed{T_-D\xi=-\beta.}                        \tag{1.8}
\]

## 2. The squared quotient is a positive parity pencil

The source rank-one perturbation of the mode operator is

\[
 D'=D-|D\xi\rangle\langle\eta|.                 \tag{2.1}
\]

Put

\[
 v=D\xi=C^*\xi\in H_-,
 \qquad
 w=D\eta=C^*\eta\in H_-.                        \tag{2.2}
\]

Because `v` is odd and `eta` is even, `D'` still anticommutes with
inversion.  Its parity blocks are exactly

\[
 D'=\begin{pmatrix}
       0&C\\
       C^*-|v\rangle\langle\eta|&0
     \end{pmatrix}.                              \tag{2.3}
\]

Consequently its square on the odd sector is

\[
 S:=(D')^2|_{H_-}
   =(C^*-|v\rangle\langle\eta|)C
   =C^*C-|v\rangle\langle w|.                   \tag{2.4}
\]

The last expression need not be Euclidean self-adjoint.  The source
commutator supplies the missing metric.

### Theorem 2.1 (exact parity-pencil identity)

One has

\[
 \boxed{T_-S=C^*T_+C.}                           \tag{2.5}
\]

Therefore

\[
 G:=T_-^{-1/2}C^*T_+C T_-^{-1/2}\geq0           \tag{2.6}
\]

is Euclidean self-adjoint, and `S` is similar to `G`.

**Proof.**  The two off-diagonal blocks of (1.3) are

\[
 C T_- -T_+C=-|\eta\rangle\langle\beta|,
 \qquad
 C^*T_+-T_-C^*=|\beta\rangle\langle\eta|.       \tag{2.7}
\]

Multiply the second identity on the right by `C`, use
`<eta|C=<w|`, and combine it with `T_-v=-beta` from (1.8):

\[
\begin{aligned}
 T_-S
 &=T_-C^*C-T_-|v\rangle\langle w|\\
 &=(C^*T_+-|\beta\rangle\langle\eta|)C
      +|\beta\rangle\langle w|\\
 &=C^*T_+C.
\end{aligned}                                    \tag{2.8}
\]

Finally,

\[
 T_-^{1/2}S T_-^{-1/2}=G,                        \tag{2.9}
\]

which proves the assertions. \(\square\)

Let `+/-s_k`, `1<=k<=N`, be the paired roots of the finite quotient
characteristic polynomial, with a possible zero pair.  Lemma 5.4 and the
parity anticommutation show that the eigenvalues of `S` are `s_k^2`.
Theorem 2.1 therefore proves the exact generalized eigenvalue statement

\[
 \boxed{
 C^*T_+C\,y=s_k^2T_-y.}                         \tag{2.10}
\]

This is a finite theorem under the simple-even hypotheses.  It is not an
assertion that the unshifted infinite Weil form is positive.

## 3. Cancellation-preserving pullback of the source form

For `alpha>0`, define

\[
 \mathcal F_\alpha:H_-\longrightarrow H_+\oplus H_-,
 \qquad
 \mathcal F_\alpha y=Cy\oplus\alpha y.           \tag{3.1}
\]

Then

\[
 \boxed{
 \mathcal F_\alpha^*T\mathcal F_\alpha
 =C^*T_+C+\alpha^2T_-.}                          \tag{3.2}
\]

For a fixed physical imaginary height `sigma>0`, put

\[
 \alpha={\sigma L\over2\pi},
 \qquad
 \mathcal F_\sigma:=\mathcal F_{\sigma L/(2\pi)}. \tag{3.3}
\]

Equation (3.2) is then the requested physical-height pullback

\[
 \boxed{
 \mathcal F_\sigma^*T\mathcal F_\sigma
 =C^*T_+C+\left({\sigma L\over2\pi}\right)^2T_-.} \tag{3.4}
\]

This formula preserves the source cancellation.  If the source-assembled
matrix is displayed only for bookkeeping as

\[
 Q=Q_{\rm pole}+Q_{\rm arch}+Q_{\rm prime},      \tag{3.5}
\]

where `Q_prime` includes the **minus sign** of source equation (3.19), then

\[
 \mathcal F_\alpha^*T\mathcal F_\alpha
 =\sum_{B\in\{\rm pole,arch,prime\}}
   \mathcal F_\alpha^*Q_B\mathcal F_\alpha
   -\epsilon\mathcal F_\alpha^*\mathcal F_\alpha. \tag{3.6}
\]

No absolute value has been inserted before the sum.  Thus a future estimate
may act directly on the combined pullback instead of separately bounding
the much larger source blocks.  Equation (3.6) is an identity, not a new
positivity result for any individual block.

## 4. Relative determinant and the odd response

For `t>0`, define the positive pencil

\[
 H_t=C^*T_+C+tT_-.
\]

Theorem 2.1 gives

\[
 \det H_t
 =\det(T_-)\det(G+tI)
 =\det(T_-)\prod_{k=1}^{N}(s_k^2+t).             \tag{4.1}
\]

On `H_-`, one also has

\[
 C^*C=D^2|_{H_-}
      =\operatorname {diag}(1^2,2^2,\ldots,N^2). \tag{4.2}
\]

Let `xi_n` be the coefficient of `V_n` in the boundary-normalized ground
vector.  For `t>0`, set

\[
 \mathcal A(t):=A(\sqrt t).
\]

The exact response formula in
`notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md` becomes

\[
\begin{aligned}
 \mathcal A(t)
 &=t\langle\eta,(D^2+tI)^{-1}\xi\rangle\\
 &=\xi_0+2\sum_{n=1}^{N}{t\xi_n\over n^2+t}\\
 &=1-2\sum_{n=1}^{N}{n^2\xi_n\over n^2+t}.      \tag{4.3}
\end{aligned}
\]

Since the quotient roots are real, the finite characteristic polynomial
also gives

\[
 \boxed{
 \mathcal A(t)
 ={\prod_{k=1}^{N}(s_k^2+t)
   \over\prod_{n=1}^{N}(n^2+t)}
 ={\det(C^*T_+C+tT_-)
   \over
   \det(T_-)\det(C^*C+tI)}.}                    \tag{4.4}
\]

Thus `mathcal A(t)>0` on the positive axis.  Its logarithmic derivative is
the exact trace difference

\[
 \boxed{
 {d\over dt}\log\mathcal A(t)
 =\operatorname {Tr}(H_t^{-1}T_-)
  -\sum_{n=1}^{N}{1\over n^2+t}.}                \tag{4.5}
\]

Fix `0<tau<sigma<1/2` and put

\[
 \gamma={\tau L\over2\pi},
 \qquad
 \alpha={\sigma L\over2\pi}.                  \tag{4.6}
\]

The two-height finite quotient ratio is now one determinant ratio:

\[
\boxed{
 R^{\rm q}_{\lambda,N}(\tau,\sigma)
 ={\det(C^*T_+C+\gamma^2T_-)
   \over
   \det(C^*T_+C+\alpha^2T_-)}
 ={\mathcal A(\gamma^2)\over\mathcal A(\alpha^2)}
  \prod_{n=1}^{N}{n^2+\gamma^2\over n^2+\alpha^2}.} \tag{4.7}
\]

The factors `det(T_-)` cancel.  This is the pencil form of the exact
odd-response compensation gate.

## 5. All physical trace moments and effective dimension

Whiten the positive pencil by defining

\[
 Z_\alpha
 :=T_-^{1/2}H_{\alpha^2}^{-1}T_-^{1/2}
 =(G+\alpha^2I)^{-1}>0.                          \tag{5.1}
\]

The second equality follows by factoring

\[
 H_{\alpha^2}
 =T_-^{1/2}(G+\alpha^2I)T_-^{1/2}.              \tag{5.2}
\]

For every integer `m>=1`, the half paired quotient trace moment at physical
height `sigma` is exactly

\[
\boxed{
 S^{\rm q}_{m;\lambda,N}(\sigma)
 :=\sum_{k=1}^{N}
   {1\over((2\pi s_k/L)^2+\sigma^2)^m}
 =\left({L\over2\pi}\right)^{2m}
  \operatorname {Tr}(Z_\alpha^m).}              \tag{5.3}
\]

Equivalently, if

\[
 K^{\rm q}_{\lambda,N;\sigma}
 :=\left({L\over2\pi}\right)^2Z_\alpha,         \tag{5.4}
\]

then

\[
 S^{\rm q}_{m;\lambda,N}(\sigma)
 =\|K^{\rm q}_{\lambda,N;\sigma}\|_{\mathcal S_m}^{m}. \tag{5.5}
\]

For `m=1`, introduce the soft generalized-eigenvalue count

\[
 d_{\rm eff}(\alpha)
 :=\operatorname {Tr}\!\left(
   \alpha^2(G+\alpha^2I)^{-1}\right)
 =\sum_{k=1}^{N}{\alpha^2\over s_k^2+\alpha^2}.  \tag{5.6}
\]

Because `alpha=sigma L/(2*pi)`, one has the exact scale conversion

\[
 \boxed{
 d_{\rm eff}(\alpha)
 =\sigma^2S^{\rm q}_{1;\lambda,N}(\sigma).}      \tag{5.7}
\]

Therefore the uniform first-trace gate is precisely

\[
 \boxed{d_{\rm eff}(\sigma L/(2\pi))=O(1),}      \tag{5.8}
\]

or, without square roots or generalized eigenvectors,

\[
 \boxed{
 \operatorname {Tr}\!\left[
  (C^*T_+C+\alpha^2T_-)^{-1}T_-
 \right]=O(L^{-2}).}                             \tag{5.9}
\]

For fixed `0<tau<sigma`, the elementary product comparison in
`notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md` makes (5.8) equivalent to a
positive uniform floor in (4.7).  This is a one-scalar determinant
formulation of the same first gate.

The full locally uniform determinant problem is stronger.  Along a schedule
with `N/L^2->infinity`, the explicit exterior Fourier-lattice contribution
to every trace moment tends to zero.  At one fixed off-axis height the
remaining finite quotient must then satisfy, for every `m>=1`,

\[
 \boxed{
 \left({L\over2\pi}\right)^{2m}
 \operatorname {Tr}(Z_\alpha^m)
 \longrightarrow \tau_m(\sigma),}              \tag{5.10}
\]

where the targets `tau_m(sigma)` are defined from derivatives of the
normalized `Xi` determinant in
`notes/LOCALLY_UNIFORM_DETERMINANT_ATTACK.md`, not from a zero table.
A bound in (5.8) bounds all higher positive moments because the physical
resolvent eigenvalues are at most `sigma^(-2)`, but it does not identify
their limits.  Thus (5.8) is the normal-family gate, while (5.10) is the
remaining Schatten-moment identification.

## 6. Stieltjes classification and a sign no-go theorem

Equation (4.3) gives the partial-fraction expansion

\[
 \mathcal A(t)
 =1+\sum_{n=1}^{N}{c_n\over t+n^2},
 \qquad
 c_n=-2n^2\xi_n.                                 \tag{6.1}
\]

This makes the missing sign information explicit.

### Proposition 6.1 (one-signed ground coefficients cannot compensate)

Let `0<g<a`.

1. If `xi_n<=0` for every `1<=n<=N`, then `mathcal A` is a Stieltjes
   rational function,

   \[
     1\leq{\mathcal A(g)\over\mathcal A(a)}
     \leq{a\over g}.                             \tag{6.2}
   \]

2. If `xi_n>=0` for every `1<=n<=N`, then `mathcal A` is increasing and

   \[
     0<{\mathcal A(g)\over\mathcal A(a)}\leq1.  \tag{6.3}
   \]

If all `xi_j` are strictly positive, the quotient roots strictly interlace
the integer poles and may be labelled so that

\[
 0<s_1<1<s_2<2<\cdots<s_N<N.                    \tag{6.4}
\]

**Proof.**  In the first case, `c_n>=0`, so (6.1) is decreasing.  Moreover,
write the ratio in (6.2) as the weighted average of `1` and

\[
 {a+n^2\over g+n^2}\leq{a\over g},              \tag{6.5}
\]

with respective positive denominator weights `1` and `c_n/(a+n^2)`.
This proves (6.2).  In the second case, differentiation of (4.3) gives

\[
 \mathcal A'(t)
 =2\sum_{n=1}^{N}{n^2\xi_n\over(n^2+t)^2}\geq0, \tag{6.6}
\]

and positivity follows from (4.4), proving (6.3).

For strict positivity of all coefficients, the secular function

\[
 h(s)=\sum_{j=-N}^{N}{\xi_j\over j-s}            \tag{6.7}
\]

is strictly increasing between consecutive integer poles, tends from
`-infinity` to `+infinity` on each such interval, and has exactly one zero
there.  Evenness pairs the zeros, which gives (6.4). \(\square\)

For `g=gamma^2` and `a=alpha^2`, the upper bound in (6.2) is the fixed
constant `(sigma/tau)^2`; (6.3) is smaller still.  Hence the reciprocal
exponential-in-`L` response required by (4.7) is impossible when the
noncentral ground coefficients have one sign.  Any successful arithmetic
proof must establish a quantitatively strong mixed-sign cancellation; mere
positivity or ordinary Stieltjes interlacing points in the wrong direction.

## 7. A nonexceptional exact Cauchy countermodel

The diagonal countermodel in
`notes/LOCALLY_UNIFORM_DETERMINANT_ATTACK.md` uses the exceptional branch
`D xi=0`.  The following family shows that neither a nonzero source
displacement nor `D xi!=0` repairs the finite-hypothesis gap.

For every `N>=1`, define on the source modes

\[
 \boxed{
 T_N=I-{1\over2N+1}|\eta\rangle\langle\eta|.}    \tag{7.1}
\]

Its entries are

\[
 (T_N)_{nn}={2N\over2N+1},
 \qquad
 (T_N)_{nm}=-{1\over2N+1}\quad(n\ne m).         \tag{7.2}
\]

This is exactly of source Cauchy form with

\[
 b_n=-{n\over2N+1},
 \qquad
 a_n={2N\over2N+1}.                              \tag{7.3}
\]

Indeed `(b_n-b_m)/(n-m)=-1/(2N+1)`.  The operator `T_N` is the orthogonal
projection onto `eta^perp`, so it is positive semidefinite with simple even
kernel \(\mathbb C\eta\).  Its boundary-normalized ground vector is

\[
 \xi={\eta\over2N+1}.                            \tag{7.4}
\]

Moreover,

\[
 D\xi={D\eta\over2N+1}\ne0,
 \qquad
 \beta=-{D\eta\over2N+1}\ne0,
 \qquad
 T_- = I_{H_-}>0,
 \qquad
 T_ND\xi=-\beta.                                \tag{7.5}
\]

Thus the nonexceptional source commutator branch is active and all abstract
finite simple-even hypotheses hold.

Every coefficient in (7.4) is positive.  Hence Proposition 6.1 applies,
and in this case

\[
 \mathcal A_N(t)
 ={1+2t\displaystyle\sum_{n=1}^{N}(n^2+t)^{-1}
   \over2N+1}                                    \tag{7.6}
\]

is strictly increasing.  The positive quotient roots obey

\[
 k-1<s_k<k\qquad(1\leq k\leq N).                \tag{7.7}
\]

Therefore, for every fixed `sigma>0`,

\[
\begin{aligned}
 S^{\rm q}_{1;\lambda,N}(\sigma)
 &\geq\sum_{k=1}^{N}
 {1\over(2\pi k/L)^2+\sigma^2}.                 \tag{7.8}
\end{aligned}
\]

If `L->infinity` and `N/L^2->infinity`, the omitted infinite-lattice tail
is `O(L^2/N)=o(1)`, while the classical `coth` identity gives

\[
 \sum_{k=1}^{\infty}{1\over(2\pi k/L)^2+\sigma^2}
 ={L\over4\sigma}\coth(\sigma L/2)
  -{1\over2\sigma^2}.                            \tag{7.9}
\]

Consequently,

\[
 \boxed{
 S^{\rm q}_{1;\lambda,N}(\sigma)
 \geq {L\over4\sigma}-{1\over2\sigma^2}-o(1),} \tag{7.10}
\]

and its effective dimension diverges linearly in `L`.  Equivalently,
`mathcal A_N(gamma^2)/mathcal A_N(alpha^2)<1`, so it cannot compensate the
exponentially small central product in (4.7).

This countermodel is not the arithmetic Weil matrix.  It proves sharply
that positivity, exact Cauchy displacement, inversion symmetry,
simple-evenness, strict odd positivity, nonzero `beta`, nonzero `D xi`,
boundary normalization, and even strict integer interlacing do not imply
the response estimate.

## 8. Exact remaining arithmetic lemma

For the first normal-family gate, the smallest pencil statement is now the
following.  On one explicit unbounded schedule with `N/L^2->infinity`, first
prove the finite simple-even hypotheses for the **actual** source-assembled
matrix and then prove, for one fixed rational `sigma` in `(0,1/2)`,

\[
 \boxed{
 \operatorname {Tr}\!\left[
   \alpha^2
   T_-^{1/2}(C^*T_+C+\alpha^2T_-)^{-1}T_-^{1/2}
 \right]\leq C_\sigma,
 \qquad
 \alpha={\sigma L\over2\pi}.}                  \tag{8.1}
\]

Equivalently, for one fixed rational pair `0<tau<sigma<1/2`, prove

\[
 \boxed{
 {\det(C^*T_+C+\gamma^2T_-)
  \over
  \det(C^*T_+C+\alpha^2T_-)}\geq c_{\tau,\sigma}>0.} \tag{8.2}
\]

These formulations use the combined pole--archimedean--minus-prime matrix
and do not require a zero table.  The exact odd-resolvent reconstruction in
`notes/ODD_RESOLVENT_WEYL_RECONSTRUCTION.md` provides a complementary route
to the constrained ground-line solve, but it does not establish (8.1).

Even after (8.1), the determinant target requires the complete arithmetic
Schatten data (5.10), as well as the separate finite signs and ground-line
comparison obligations.  The current repository proves neither (8.1) nor
(8.2) for the actual matrices.  The parity pencil identifies the exact
positive object on which the next cancellation-preserving arithmetic
estimate must act.
