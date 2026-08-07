# Signed sectors: exact parity Loewner form and the middle-window obstruction

## 1. Scope

This note audits whether the source Cauchy representation

\[
 Q_{nn}=a_n,\qquad
 Q_{nm}=\frac{b_n-b_m}{n-m}\quad(n\ne m),             \tag{1.1}
\]

can by itself supply the missing inversion-even-complement and inversion-odd
shifted floors.  Here `a_(-n)=a_n`, `b_(-n)=-b_n`, and the source signs,
including the minus sign on the prime block, are those locked in
`P0_MATRIX_FORMULAS.md`.

There are two conclusions.

1. The parity blocks have exact Loewner-type formulas, but the relevant
   symbols are not known to be matrix monotone and the current source bounds
   do not make their Loewner matrices positive.
2. More sharply, the scalar information proved in
   `notes/HIGH_FOURIER_COERCIVITY.md` admits explicit Cauchy-form
   countermodels whose shifted even and odd blocks are both indefinite in
   the unresolved middle window.  Therefore high-mode coercivity plus the
   positive additive prolate Gram is not a sector-floor theorem.

This is an analytic obstruction to a class of proof attempts.  It says
nothing adverse about the exact arithmetic Weil matrices and supplies no
asymptotic floor, resolvent estimate, determinant limit, or RH conclusion.

## 2. Exact parity reduction

For `n>=1`, put

\[
 e_n^+=\frac{V_n+V_{-n}}{\sqrt2},\qquad
 e_n^-=\frac{V_n-V_{-n}}{\sqrt2},
\]

and retain `e_0^+=V_0`.  Direct substitution into (1.1) gives, for distinct
positive `n,m`,

\[
 \boxed{
 Q^+_{nm}
 =\frac{2(nb_n-mb_m)}{n^2-m^2}},                 \tag{2.1}
\]

\[
 \boxed{
 Q^-_{nm}
 =\frac{2(mb_n-nb_m)}{n^2-m^2}
 =2nm\frac{b_n/n-b_m/m}{n^2-m^2}}.              \tag{2.2}
\]

The diagonal and zero-mode entries are

\[
 Q^+_{nn}=a_n+\frac{b_n}{n},\qquad
 Q^-_{nn}=a_n-\frac{b_n}{n},                    \tag{2.3}
\]

\[
 Q^+_{00}=a_0,\qquad Q^+_{0n}=\sqrt2\frac{b_n}{n}. \tag{2.4}
\]

Thus the off-diagonal part of the plus block is the divided-difference
matrix of the sampled symbol `F(n^2)=n b_n`, while the minus block is the
diagonally weighted divided-difference matrix of
`G(n^2)=b_n/n`.  This observation is exact, but it is not positivity.

The diagonal completion can also be written exactly.  Extend the source
coefficient to a real parameter by

\[
 b(t)=-\frac1\pi\left\langle\mathcal D,
       \sin\frac{2\pi tx}{L}\right\rangle,
 \qquad
 s(t)=\left\langle\mathcal D,
       \cos\frac{2\pi tx}{L}\right\rangle.       \tag{2.5}
\]

Differentiating the first pairing and using the source diagonal correlation
gives

\[
 a_n=b'(n)+2s(n).                                 \tag{2.6}
\]

Put `x_n=n^2`, `F(x)=sqrt(x)b(sqrt(x))`, and
`H(x)=b(sqrt(x))/sqrt(x)`.  If `L_F` and `L_H` denote the complete Loewner
matrices, including derivative diagonals, and `D=diag(n)`, then on positive
indices

\[
 \boxed{Q^+=2L_F+2\operatorname{diag}(s(n)),}     \tag{2.7}
\]

\[
 \boxed{Q^-=2D L_H D+2\operatorname{diag}(s(n)).} \tag{2.8}
\]

Indeed, the natural Loewner diagonals in (2.7)--(2.8) are respectively
`b'(n)+b_n/n` and `b'(n)-b_n/n`; equation (2.6) completes them to (2.3).
Thus a Loewner positivity argument would need both a matrix-monotonicity or
conditional-positivity theorem for the exact arithmetic symbols and control
of the signed cosine diagonal.  Neither follows from oddness of `b`, its
uniform bound, or the combined Chebyshev rewrite.

There is also no termwise positive Loewner decomposition of the prime block.
Equation (3.1) of `notes/HIGH_FOURIER_COERCIVITY.md` shows that a prime-power
atom contributes

\[
 b_n^{(k)}=A_k\sin(n\theta_k),\qquad
 A_k>0,\qquad \theta_k=\frac{2\pi\log k}{L}.      \tag{2.9}
\]

Unless `theta_k` is an integer multiple of `pi`, both
`n*sin(n*theta_k)` and `sin(n*theta_k)/n` change sign.  A matrix-monotone
Loewner symbol is in particular scalar monotone, so (2.9) cannot be assigned
a nonnegative termwise Loewner matrix.  The pole, archimedean, and all prime
atoms must be combined before a sign could emerge.

The high-precision independently assembled pilots in
`artifacts/p0_schedule/raw` also show, as a diagnostic only, that both full
sampled sequences `n b_n` and `b_n/n` change their monotonic direction.  The
theorem below does not rely on those point values.

## 3. A simultaneous parity countermodel

Let `B>0`, fix a real shift `U`, and choose an integer `r>=1`.  On the four
indices `\pm r,\pm(r+1)`, set

\[
 b_{r+1}=B,\qquad b_r=-B,\qquad b_{-n}=-b_n,     \tag{3.1}
\]

and

\[
 a_r=a_{r+1}=a_{-r}=a_{-(r+1)}=U.               \tag{3.2}
\]

Complete the entries on these four indices by (1.1); on a larger consecutive
index set choose arbitrary parity-compatible coefficients on the remaining
indices and again use (1.1).  The displayed principal matrix is real
Hermitian, commutes with inversion, has the exact Cauchy displacement form,
and satisfies `|b_n|<=B`.

In the ordered parity bases `(e_(r+1)^+,e_r^+)` and
`(e_(r+1)^-,e_r^-)`, respectively, the shifted principal blocks are

\[
 \left.(Q^+-UI)\right|_r
 =\begin{bmatrix}
 B/(r+1)&2B\\
 2B&-B/r
 \end{bmatrix},                                  \tag{3.3}
\]

\[
 \left.(Q^--UI)\right|_r
 =\begin{bmatrix}
 -B/(r+1)&2B\\
 2B&B/r
 \end{bmatrix}.                                  \tag{3.4}
\]

Both determinants are exactly

\[
 \boxed{
 -4B^2-\frac{B^2}{r(r+1)}<0.}                   \tag{3.5}
\]

Each block therefore has a negative direction.  The even direction is also
orthogonal to the independent even vector `V_0`, so taking the trial vector
to be `V_0` does not remove the counterexample from the even complement.

This construction is not asserted to be the arithmetic source sequence.
Its purpose is logical: any proposed proof which uses only Cauchy form,
inversion symmetry, `|b_n|<=B`, and diagonal scalar bounds must also apply to
(3.1)--(3.2), and hence cannot infer either shifted-sector sign.

## 4. Compatibility with the proved source bounds

The explicit bounds in `notes/HIGH_FOURIER_COERCIVITY.md` are

\[
 |b_n|\le B_b(\lambda),                           \tag{4.1}
\]

\[
 a_n\ge \ell_{\lambda,n}
 :=\log\frac n2-\frac1{2\pi n}-C_a(\lambda),    \tag{4.2}
\]

\[
 |a_n|\le \log(n+2)+C_{|a|}(\lambda).           \tag{4.3}
\]

Take `B=B_b(lambda)`.  Whenever

\[
 \ell_{\lambda,r}\le U,\qquad
 \ell_{\lambda,r+1}\le U,\qquad
 |U|\le\min_{n\in\{r,r+1\}}
       \bigl(\log(n+2)+C_{|a|}(\lambda)\bigr),  \tag{4.4}
\]

the countermodel satisfies every scalar coefficient bound currently used in
the high-mode theorem on these indices.  Condition (4.4) includes a very
large range because (4.2) becomes positive only after an exponential
Fourier index.

This is distinct from the genuine high compression.  The proved sufficient
cutoff is

\[
 M_*(\lambda,U,G)
 =\left\lceil2\exp\left(C_a(\lambda)+c_\lambda+U+G
                  +\frac1{2\pi}\right)\right\rceil-1,       \tag{4.5}
\]

where `c_lambda=2*pi*B_b(lambda)`.  Above (4.5), the diagonal lower bound
does dominate the complete commutator norm and gives a true shifted floor
`G`.  Below it, (3.1)--(4.4) prove that the same scalar information has no
sign content.  Calling the block below (4.5) "high" because its dimension
exceeds the prolate Shannon index does not change this fact.

For scale, the elementary positive summands in the locked constants give

\[
 C_a(\lambda)\ge8(\lambda-1)\log\lambda,
 \qquad
 c_\lambda\ge8(\lambda-1)\log\lambda.           \tag{4.6}
\]

Hence, when `U+G>=-1/(2*pi)`, the sufficient cutoff (4.5) obeys

\[
 M_*\ge
 \left\lceil2\lambda^{16(\lambda-1)}\right\rceil-1.        \tag{4.7}
\]

The additive prolate transition theorem, by contrast, isolates only

\[
 n_*(\lambda)=4\lambda^2+O(\log\lambda).         \tag{4.8}
\]

source labels.  Equations (4.7)--(4.8) exhibit the uncontrolled middle
window left by merely juxtaposing the two existing theorems.  This is a
proof-level distinction, not a cost complaint: the additive Gram is defined
on its source-generated physical range.  If `L_lambda` is the image of all
selected source columns below `n_*`, then

\[
 \dim L_\lambda\le n_*(\lambda),
 \qquad
 \dim(E_M\cap L_\lambda^\perp)
 \ge 2M+1-n_*(\lambda).                          \tag{4.9}
\]

The additive Gram supplies no lower form on the latter space.  The analogous
parity counts give the same conclusion separately in the plus and minus
blocks.  Dimension counting does not say those directions are negative; it
says their sign is absent from the current comparison theorem.

## 5. Why the combined Chebyshev moments do not repair the sign

The exact shifted form is

\[
 \langle v,(Q-U I)w\rangle
 =(q-U)\langle v,w\rangle
 -\int_0^L G(x)\frac d{dx}
   \left(e^{-x/2}\omega^q_{v,w}(x)\right)dx.     \tag{5.1}
\]

The lock in `P3_SOURCE_LOCK.json` supplies explicit `L1`, `L2`, and first
weighted `L2` upper moments for `delta_*(x)=e^{-x}G(x)`.  Such bounds control
absolute Hankel and Toeplitz pairings, but they contain no lower-form sign.
Formally, the class of kernels satisfying only those norm upper bounds is
closed under `delta -> -delta`, while the integral term in (5.1) changes
sign.  Therefore no positive Loewner or Schur lower bound can be deduced from
those moments alone.

The exact arithmetic kernel is of course fixed rather than freely
sign-flippable.  A successful proof must consequently use additional
phase-sensitive information from that exact kernel.  Replacing it by the
PNT envelope, or replacing `(b_n-b_m)/(n-m)` by its uniform commutator norm,
discards precisely the information that could decide the low-block sign.

## 6. Required new input

The obstruction leaves two noncircular options.

1. Prove a localized, cancellation-preserving comparison for the exact
   arithmetic parity matrices through every mode below the true high cutoff,
   with the complete low/high coupling Gram retained.
2. Prove that the source-normalized growing physical prolate range is
   uniformly conditioned and captures every potentially small direction,
   then establish a signed relative lower bound for (5.1) on that range and
   a positive lower bound on its orthogonal complement.

Either route needs information strictly stronger than (4.1)--(4.3) and the
absolute Chebyshev moments.  In particular, a positive additive source Gram
cannot be extended by zero to the middle complement and then called a lower
model for the signed Weil form.
