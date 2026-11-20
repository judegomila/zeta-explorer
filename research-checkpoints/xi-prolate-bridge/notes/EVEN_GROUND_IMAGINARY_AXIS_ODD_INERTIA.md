# Even-ground imaginary-axis criterion for the odd inertia

## 0. Claim boundary and outcome

This note gives an exact converse to the odd-response implication used in
`notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md`.  It assumes only a simple lowest
eigenpair in the **even** compression of the finite source matrix.  It does
not assume that this eigenvalue is lowest in the full space and does not
assume positivity of the odd compression.

The source rank-two commutator then produces a rank-one squared-mode pencil

\[
 X=D_-^2-|u\rangle\langle d|.                         \tag{0.1}
\]

Under two explicit nonvanishing hypotheses on the even eigenvector, the
inertia of the odd shifted block is exactly the inertia of `X`.  Its negative
inertia is therefore counted, with multiplicity, by the positive zeros of a
single rational function `A_x(alpha)`.  The same function is the
imaginary-axis transform of the even eigenvector after source boundary
normalization.  In particular,

\[
 Q_- -\epsilon I\succ0
 \quad\Longleftrightarrow\quad
 \widehat x(i\sigma)/\langle\eta,x\rangle>0
 \quad\hbox{for every }\sigma\geq0.                  \tag{0.2}
\]

This is a reduction, not a sign theorem.  Positivity on the whole expanding
imaginary axis is not proved for the arithmetic even ground vector.  A
two-dimensional exact counterexample below shows that positivity on any
prescribed finite imaginary interval does not imply (0.2).  Moreover, the
strict comparison needed in `DIRECT_RH_ATTACK.md` is against a Ritz upper
value `U>=epsilon`, not merely against `epsilon`; Section 6 isolates the
additional quantitative margin.

The binding finite source is Connes--Consani--Moscovici, *Zeta Spectral
Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf` with SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The exact inputs are Lemma 5.1, equation (5.2) (the Cauchy matrix), Lemma
5.2(ii), equation (5.3) (the rank-two commutator), Lemma 5.4, equation (5.5)
(the quotient characteristic polynomial), and equation (5.25) (the finite
ground transform).  The interval, Fourier sign, inversion, inclusive
prime-power endpoint, and source minus-prime convention are those locked in
`P0_SOURCE_LOCK.json` and reproduced in
`notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md`.

No zero table, global Weil positivity, or matrix imported from a diagnostic
preprint is used.  All pole, archimedean, and finite prime-power terms,
including the minus sign on the prime block, enter only through the exact
source matrix `Q`.  This note proves neither shifted sector sign on an
unbounded arithmetic schedule, equation (5.2), determinant convergence, nor
a Riemann-hypothesis conclusion.  The formal project state remains
`P0_INVALIDATED`.

## 1. Finite source setup

Fix `lambda>1`, put `L=2 log(lambda)`, and use the source modes
`V_n`, `-N<=n<=N`.  Let

\[
 D V_n=nV_n,\qquad J V_n=V_{-n},                       \tag{1.1}
\]

\[
 \eta=\sum_{|n|\leq N}V_n,\qquad
 \beta=\sum_{|n|\leq N}b_nV_n.                       \tag{1.2}
\]

The exact Cauchy formula and source displacement identity are

\[
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),\qquad
 [D,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|.                   \tag{1.3}
\]

Here `Q` is real Hermitian, commutes with `J`, `eta` is even, and `beta` is
odd.  Let `H_+` and `H_-` be the two inversion sectors.  In the normalized
parity bases

\[
 e_0^+=V_0,\qquad
 e_n^+={V_n+V_{-n}\over\sqrt2},\qquad
 e_n^-={V_n-V_{-n}\over\sqrt2}\quad(1\leq n\leq N), \tag{1.4}
\]

write

\[
 \mathcal D=P_-D|_{H_+}:H_+\longrightarrow H_-.
                                                               \tag{1.5}
\]

Thus `mathcal D e_0^+=0`, `mathcal D e_n^+=n e_n^-`, and

\[
 D_-^2:=\mathcal D\mathcal D^*
       =\operatorname {diag}(1^2,2^2,\ldots,N^2).       \tag{1.6}
\]

The plus-to-minus block of (1.3) is

\[
 \boxed{\mathcal DQ_+-Q_-\mathcal D
        =|\beta\rangle\langle\eta|.}                 \tag{1.7}
\]

Assume now only that `epsilon` is the simple lowest eigenvalue of `Q_+`.
Choose a real unit eigenvector `x` and put

\[
 Q_+x=\epsilon x,\qquad
 T_+=Q_+-\epsilon I\succeq0,\qquad
 \ker T_+=\mathbb Cx,                                \tag{1.8}
\]

\[
 T_-=Q_- -\epsilon I.                                \tag{1.9}
\]

The two additional hypotheses used below are

\[
 c:=\langle\eta,x\rangle\ne0,
 \qquad x_0:=\langle e_0^+,x\rangle\ne0.             \tag{1.10}
\]

They are distinct.  The first permits the source boundary normalization;
the second says that the even eigenvector is not contained in the range of
`mathcal D^*`.  Neither is inferred here from odd positivity.  Changing the
real phase of `x` lets us take `c>0`.

Define the odd vectors

\[
 d=\mathcal D\eta,
 \qquad u={\mathcal D x\over c},                       \tag{1.11}
\]

and the Hermitian positive-semidefinite matrix

\[
 K=\mathcal D T_+\mathcal D^*.                         \tag{1.12}
\]

## 2. Exact factorization by the quotient squared-mode pencil

### Theorem 2.1 (source factorization)

Under (1.8)--(1.11),

\[
 \boxed{T_-u=-\beta,}                                  \tag{2.1}
\]

and

\[
 \boxed{
 K=T_-X,\qquad
 X=D_-^2-|u\rangle\langle d|.}                        \tag{2.2}
\]

The operator `X` is exactly the restriction to `H_-` of the square of the
source quotient-mode operator

\[
 D'=D-|Dx/c\rangle\langle\eta|.                       \tag{2.3}
\]

**Proof.**  Apply (1.7) to `x`.  Since `Q_+x=epsilon*x` and
`<eta,x>=c`,

\[
 \epsilon\mathcal Dx-Q_-\mathcal Dx=\beta c.
\]

Division by `c` proves (2.1).  The scalar shift commutes with `D`, so (1.7)
also gives

\[
 \mathcal DT_+-T_-\mathcal D
 =|\beta\rangle\langle\eta|
 =-T_-|u\rangle\langle\eta|.                         \tag{2.4}
\]

Multiply (2.4) on the right by `mathcal D^*` and use
`eta^* mathcal D^*=d^*`.  This gives (2.2).  Finally, if `y in H_-`, then
`<eta,y>=0`, so `D'y=Dy`; applying `D'` once more gives

\[
 (D')^2y=D_-^2y-u\langle d,y\rangle=Xy.               \tag{2.5}
\]

This proves the last assertion.  \(\square\)

The factorization is algebraic.  No sign of `T_-` has entered it.

## 3. Positive symmetrizer and exact inertia transfer

### Lemma 3.1 (strict positivity of `K`)

Under (1.8) and `x_0!=0`,

\[
 \boxed{K\succ0.}                                      \tag{3.1}
\]

**Proof.**  If `<y,Ky>=0`, positivity of `T_+` implies
`mathcal D^*y in ker(T_+)=C*x`.  But the zero-mode coordinate of
`mathcal D^*y` is zero.  Since `x_0!=0`, the proportionality scalar is zero.
The map `mathcal D^*:H_- -> span{e_1^+,...,e_N^+}` is invertible, so `y=0`.
\(\square\)

Since `K=T_-X` has full rank, both `T_-` and `X` are invertible.  Put

\[
 H=K^{-1/2}T_-K^{-1/2}.                              \tag{3.2}
\]

This is an ordinary nonsingular Hermitian matrix.  From `K=T_-X`,

\[
 I=H\bigl(K^{1/2}XK^{-1/2}\bigr),                    \tag{3.3}
\]

and hence

\[
 \boxed{K^{1/2}XK^{-1/2}=H^{-1}.}                    \tag{3.4}
\]

### Theorem 3.2 (odd inertia equals pencil inertia)

All eigenvalues of `X` are real and nonzero, and

\[
 \boxed{
 n_+(T_-)=n_+(X),\qquad
 n_-(T_-)=n_-(X),\qquad n_0(T_-)=n_0(X)=0.}           \tag{3.5}
\]

**Proof.**  Equation (3.4) makes `X` similar to the Hermitian matrix
`H^(-1)`.  Congruence by `K^(-1/2)` gives `inertia(H)=inertia(T_-)`, and
inversion preserves the signs of nonzero Hermitian eigenvalues.  Therefore
`H^(-1)`, `X`, and `T_-` have the same positive and negative counts.
\(\square\)

This is stronger than a determinant-sign test.  It transfers the complete
odd inertia, including multiplicities, to a rank-one perturbation determined
by the even eigenvector.

## 4. Scalar rational function and zero-count criterion

For `alpha>=0`, define

\[
 \boxed{
 A_x(\alpha)=1-
 \left\langle d,(D_-^2+\alpha^2I)^{-1}u\right\rangle.} \tag{4.1}
\]

The matrix determinant lemma gives

\[
 \boxed{
 \det(X+\alpha^2I)
 =\left\{\prod_{n=1}^N(n^2+\alpha^2)\right\}A_x(\alpha).} \tag{4.2}
\]

Moreover,

\[
 A_x(0)={x_0\over c},
 \qquad A_x(\alpha)\longrightarrow1
 \quad(\alpha\longrightarrow\infty).                \tag{4.3}
\]

The first identity follows directly from
`c=x_0+sqrt(2)*sum_(n>=1)x_n^+` in the parity basis.

### Corollary 4.1 (exact odd negative-index count)

The negative odd inertia is the number, counted with algebraic
multiplicity, of positive roots `s=alpha^2>0` of the numerator in (4.2):

\[
 \boxed{
 n_-(Q_- -\epsilon I)
 =\#\{\alpha^2>0:A_x(\alpha)=0\}.}                    \tag{4.4}
\]

Consequently,

\[
 \boxed{
 Q_- -\epsilon I\succ0
 \quad\Longleftrightarrow\quad
 A_x(\alpha)>0\quad\hbox{for every }\alpha\geq0.}   \tag{4.5}
\]

**Proof.**  By Theorem 3.2, each negative eigenvalue `-alpha^2` of `X`
gives, with the same multiplicity, a positive zero in (4.2), and every such
zero arises this way.  The denominator product in (4.2) is strictly positive
on `alpha>=0`.  Since `X` is nonsingular, zero is not a root.  If there is
no positive root, continuity and the limit `A_x(alpha)->1` make `A_x`
strictly positive on the whole half-line.  The converse is immediate.
\(\square\)

There is a simultaneous algebraic consequence for the finite quotient
operator.  The rank-one perturbation `D'` kills `x`, anticommutes with
inversion on the quotient, and has square `X` on the odd half of that
quotient.  Since `X` is similar to a nonsingular Hermitian matrix, it is
diagonalizable with real nonzero eigenvalues.  Therefore all `2N` finite
quotient zeros are either real or purely imaginary.  More precisely, every
positive eigenvalue `r^2` of `X` contributes the real pair `+/-r`, while
every negative eigenvalue `-a^2` contributes the imaginary pair `+/-ia`.
Thus

\[
 \boxed{
 n_-(Q_- -\epsilon I)
 =\hbox{the number of purely imaginary quotient pairs},} \tag{4.6}
\]

with algebraic multiplicities.  This statement uses only the simple even
ground hypotheses and (1.10); quotient self-adjointness has not been
assumed.  Odd positivity is exactly what removes the imaginary pairs.

The apparent all-axis test also has an exact finite reduction once the
boundary-normalized coefficients are known.  Write

\[
 {x\over c}=\sum_{n=-N}^N\xi_nV_n,
 \qquad \xi_{-n}=\xi_n,                              \tag{4.7}
\]

so that

\[
 A_x(\alpha)=1-2\sum_{n=1}^N
 {n^2\xi_n\over n^2+\alpha^2}.                       \tag{4.8}
\]

For every `alpha>0`,

\[
 \boxed{
 A_x(\alpha)\geq
 1-{2\sum_{n=1}^N n^2|\xi_n|\over\alpha^2}.}        \tag{4.9}
\]

If `M_2=2*sum_(n=1)^N n^2*|xi_n|`, then `A_x(alpha)>=1/2` for
`alpha^2>=2M_2` (with the zero-`M_2` case immediate).  Hence, for a fixed
finite matrix, it is enough to prove positivity on the explicit compact
interval

\[
 0\leq\alpha\leq\sqrt{2M_2}.                         \tag{4.10}
\]

This is only a reduction.  No current theorem bounds the
boundary-normalized second absolute coefficient moment `M_2` suitably on an
unbounded arithmetic schedule; it can be very large when the boundary value
`c` is small.

## 5. Imaginary-axis transform of the even eigenvector

Write the zero-extended Fourier--Mellin transform with the locked sign as

\[
 \widehat x(z)=\int_{-L/2}^{L/2}x(t)e^{-izt}\,dt.     \tag{5.1}
\]

Pairing the `+/-n` coefficients exactly as in source equation (5.25), with

\[
 \alpha={\sigma L\over2\pi},                         \tag{5.2}
\]

gives, for every `sigma>0`,

\[
 \boxed{
 {\widehat x(i\sigma)\over c}
 ={2\sinh(\sigma L/2)\over\sigma\sqrt L}
 A_x\!\left({\sigma L\over2\pi}\right).}           \tag{5.3}
\]

At `sigma=0`, the continuous limit of the prefactor is `sqrt(L)`, in
agreement with `A_x(0)=x_0/c`.  With the phase chosen so that `c>0`, the
prefactor in (5.3) is positive.  Corollary 4.1 therefore becomes

\[
 \boxed{
 Q_- -\epsilon I\succ0
 \quad\Longleftrightarrow\quad
 \widehat x(i\sigma)>0
 \quad\hbox{for every }\sigma\geq0.}                 \tag{5.4}
\]

Thus the odd sign can, in principle, be proved after establishing only the
even ground line: it is an all-imaginary-axis sign theorem for that even
ground transform.  This is the converse direction absent from the use of
`A(alpha)` in `notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md`, where odd
positivity was assumed first.

There is one elementary sufficient certificate.  If the
boundary-normalized even trigonometric polynomial

\[
 f(t)={x(t)\over c}                                   \tag{5.5}
\]

is pointwise nonnegative on `[-L/2,L/2]`, and is not identically zero, then

\[
 {\widehat x(i\sigma)\over c}
 =\int_{-L/2}^{L/2} f(t)e^{\sigma t}\,dt>0           \tag{5.6}
\]

for every real `sigma`.  Its integral is also positive, so `x_0/c>0`.
Together with `c!=0`, (5.4) proves the odd sign without assuming odd
positivity.  Pointwise nonnegativity of the actual arithmetic even ground
polynomial is not proved, however, and cannot be inferred merely from its
small `L2` distance to the prolate comparison state.

## 6. The additional Ritz-shift margin

The bridge in `DIRECT_RH_ATTACK.md` needs `Q_- -U I>0` for a source-derived
Ritz upper value `U>=epsilon`.  Equation (5.4) proves only positivity above
`epsilon`.  When (4.5) holds, (3.4) also gives the quantitative lower bound

\[
 \boxed{
 \lambda_{\min}(T_-)
 \geq {\lambda_{\min}(K)\over\lambda_{\max}(X)}.}     \tag{6.1}
\]

Here `lambda_max(X)` is well-defined and positive because `X` is similar to
the positive Hermitian matrix `H^(-1)`.  Indeed,
`lambda_min(H)=1/lambda_max(X)` and
`T_-=K^(1/2) H K^(1/2)`.

If `g_e` is the spectral gap from `epsilon` to the second even eigenvalue,
then for the unit vector `x`,

\[
 \boxed{\lambda_{\min}(K)\geq g_e|x_0|^2.}            \tag{6.2}
\]

To prove (6.2), put `z=mathcal D^*y`, so `z` has zero `e_0^+` coordinate.
The angle from `z` to the line `C*x` gives

\[
 \|P_{x^\perp}z\|^2\geq |x_0|^2\|z\|^2,
 \qquad \|z\|\geq\|y\|,                              \tag{6.3}
\]

and the even gap gives
`<z,T_+z> >= g_e*||P_(x^perp)z||^2`.

Combining (6.1)--(6.2), the explicit sufficient shifted comparison is

\[
 \boxed{
 U-\epsilon
 <{g_e|x_0|^2\over\lambda_{\max}(X)}
 \quad\Longrightarrow\quad Q_- -U I\succ0.}          \tag{6.4}
\]

This bound can be conservative, especially when the boundary-normalized
vector `x/c` is large.  It nevertheless identifies the exact two extra
quantities hidden by a merely qualitative odd sign: the largest squared-mode
pencil root and the Ritz lowering `U-epsilon`.

## 7. Exact finite-interval counterexample

Control of (5.3) on a fixed imaginary interval cannot replace the all-axis
condition.  The obstruction already occurs for `N=2` in the exact
rank-one-pencil class.

Take `c=1` and, in the plus parity basis, set

\[
 x=36e_0^+-{85\sqrt2\over3}e_1^+
             +{65\sqrt2\over6}e_2^+.                 \tag{7.1}
\]

Since `eta=e_0^++sqrt(2)e_1^++sqrt(2)e_2^+`, one checks exactly that
`<eta,x>=1`.  Equations (1.11) and (0.1) give

\[
 X={1\over3}
 \begin{bmatrix}173&340\\-130&-248\end{bmatrix}.    \tag{7.2}
\]

Its eigenvalues are `-9` and `-16`, while

\[
 \boxed{
 A_x(\alpha)
 ={(\alpha^2-9)(\alpha^2-16)
   \over(\alpha^2+1)(\alpha^2+4)}.}                  \tag{7.3}
\]

Thus `A_x(alpha)>0` for every `0<=alpha<3`, but the odd inertia has two
negative directions.  The model can be realized with all the algebraic
hypotheses above, not merely as a formal rational function.  The eigenvector
in (7.1) is boundary-normalized rather than unit-normalized; rescaling it to
unit norm changes `c` by the same factor and therefore changes neither `u`,
`X`, nor `A_x`.  The eigenvector matrix

\[
 S=\begin{bmatrix}-17&-20\\10&13\end{bmatrix},
 \qquad X=S\operatorname {diag}(-9,-16)S^{-1},        \tag{7.4}
\]

gives the positive symmetrizer

\[
 K=441(S^{-1})^*S^{-1}
  =\begin{bmatrix}269&430\\430&689\end{bmatrix}.     \tag{7.5}
\]

Let `D_-=diag(1,2)`, put

\[
 B=D_-^{-1}KD_-^{-1},\qquad
 z=(x_1,x_2)^T,                                      \tag{7.6}
\]

and define

\[
 T_+=
 \begin{bmatrix}
 z^*Bz/x_0^2&-z^*B/x_0\\
 -Bz/x_0&B
 \end{bmatrix},
 \qquad T_-=KX^{-1}.                                 \tag{7.7}
\]

Then `T_+>=0`, \(\ker(T_+)=\mathbb Cx\),
`K=mathcal D T_+mathcal D^*`, and `T_-` is
Hermitian negative definite.  With `u=mathcal Dx`, define
`beta=-T_-u`.  If

\[
 R=\mathcal DT_+-T_-\mathcal D
   -|\beta\rangle\langle\eta|,                      \tag{7.8}
\]

then `R mathcal D^*=0` follows from `K=T_-X`, while `Rx=0` follows from the
kernel equation and `<eta,x>=1`.  The range of `mathcal D^*` together with
`x` spans `H_+` because `x_0!=0`; hence `R=0`.  This is (1.7), and its
adjoint gives the other block.  Therefore the construction extends to a real
Hermitian inversion-symmetric matrix with the exact Cauchy displacement form
(1.3).  It is a structural model, not the arithmetic Weil matrix.

More generally, replacing `9,16` in (7.3) by any distinct `a,b>R^2` gives

\[
 { (\alpha^2-a)(\alpha^2-b)
  \over(\alpha^2+1)(\alpha^2+4)},                    \tag{7.9}
\]

which is positive throughout any prescribed finite interval
`0<=alpha<=R` and has two later positive zeros.  Therefore compact-strip
convergence on a preassigned interval, without the coefficient-dependent
tail reduction (4.9) or another uniform expanding-axis theorem, cannot
certify the odd inertia.

## 8. Smallest remaining lemma and exact scope

On a proposed unbounded arithmetic schedule, this reduction would replace a
direct odd Schur proof by the following still-unproved inputs:

1. prove the strict even-complement comparison and hence a simple even
   lowest eigenvector `x`, without assuming the odd sign;
2. prove `c=<eta,x>!=0` and `x_0!=0` independently of odd positivity;
3. prove the source-specific all-axis inequality

   \[
    A_x(\alpha)>0\qquad(0\leq\alpha<\infty),          \tag{8.1}
   \]

   equivalently `xhat(i*sigma)>0` for every `sigma>=0`; by (4.9), it is
   enough to prove this through the coefficient-dependent endpoint
   `sqrt(2M_2)`, but no usable schedule bound for `M_2` is known;
4. prove the quantitative Ritz reserve (6.4), or a sharper direct lower
   bound for `lambda_min(T_-)`, when the comparison is against `U>epsilon`.

The existing high-Fourier coercivity theorem bounds a compression of `Q`; it
does not control zeros of `A_x` on the expanding imaginary axis.  The
favorable locked subsequence controls the complete odd form on one pole
direction; it does not control the even eigenvector in (8.1).  The prime-jump
and odd-Krylov theorems similarly give no all-axis sign for (5.3).  Finally,
the quotient trace identity in the paired-trace note requires a much sharper
two-height size ratio even after qualitative positivity is known.

Thus (8.1), together with the independent even comparison and the shifted
margin (6.4), is the smallest new source-specific sign lemma exposed here.
It is not established by any current source lock or asymptotic theorem.
