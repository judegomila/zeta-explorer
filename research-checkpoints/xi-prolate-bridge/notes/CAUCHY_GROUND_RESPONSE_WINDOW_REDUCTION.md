# Cauchy ground-response profile and real-window reduction

## 0. Scope and conclusion

This note asks whether the source Cauchy matrix and commutator reduce the
real-window ground-transform problem to a few boundary or logarithmic-
derivative scalars.  There is an exact reduction, but it stops one step
short of that conclusion.

For a trial energy `u` outside the odd spectrum, one odd resolvent constructs
a boundary-normalized even vector `Phi_u`.  A single scalar equation decides
whether this vector is an even eigenvector.  If it is, its complete transform
on every real or complex frequency is

\[
 \widehat\Phi_u(t)=K_L(t)\,\mathcal A_u(tL/(2\pi)),
\]

where `K_L` is the explicit central Fourier factor and `mathcal A_u` is one
meromorphic scalar odd-response **profile**.  The same profile on the
imaginary axis gives the exact odd-inertia test.  Thus the full even
Feshbach correction need not be reconstructed in Euclidean coordinates.

This scalarization is not a collapse to one number, one derivative, or any
fixed finite jet.  An exact `N=3` positive Cauchy family below has

* the same source displacement vector and the same uniform anchor;
* a simple global inversion-even ground and a positive odd sector;
* ground corrections with zero boundary value and equal Euclidean norm;
* identical ground-transform value and logarithmic derivative at one real
  frequency; but
* opposite nonzero corrections at another real frequency.

Consequently the Cauchy displacement identity, boundary data, one local
logarithmic derivative, and even the complete correction norm do not imply a
bounded-real-window estimate.  What remains is a source-specific uniform
estimate for the response profile (or one of the already proved graph or
projective alternatives) together with the sector signs.

The counterfamily is a logical finite Cauchy model, not the arithmetic Weil
matrix.  For the arithmetic matrix every pole, archimedean, and **minus-prime**
entry is still combined before the resolvent is formed, and the prime-power
endpoint remains inclusive.  No zero table, global Weil positivity, or
matrix imported from a diagnostic preprint is used.  No unbounded source
schedule, equation (5.2) of `DIRECT_RH_ATTACK.md`, determinant limit, or
Riemann-hypothesis conclusion is proved.  The formal state remains
`P0_INVALIDATED`.

The binding finite source is Connes--Consani--Moscovici, *Zeta Spectral
Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The source inputs are Lemma 5.1 (5.2), Lemma 5.2 (5.3), Lemma 5.4,
equation (5.25), and Theorem 5.10.  The source normalization and factor-four
repair are unchanged.

## 1. Locked finite notation

Fix `lambda>1`, put `L=2 log(lambda)`, and use the source orthonormal modes
`V_n`, `-N<=n<=N`, in
`L2([lambda^(-1),lambda],du/u)`.  In centered logarithmic coordinates the
interval is `[-L/2,L/2]`, the measure is Lebesgue measure, functions are
zero-extended, and

\[
 \widehat f(t)=\int_{-L/2}^{L/2}f(x)e^{-itx}\,dx.       \tag{1.1}
\]

Let

\[
 DV_n=nV_n,\qquad JV_n=V_{-n},
\quad \eta=\sum_{|n|\leq N}V_n,
\quad \beta=\sum_{|n|\leq N}b_nV_n.                 \tag{1.2}
\]

The exact source Cauchy and displacement identities are

\[
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),
 \qquad b_{-n}=-b_n,                                \tag{1.3}
\]

\[
 [D,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|.                 \tag{1.4}
\]

All formulas below use the complete `Q`; no norm is taken on a source block
before the signed blocks have been combined.

Use the parity bases

\[
 e_0^+=V_0,\qquad
 e_n^+={V_n+V_{-n}\over\sqrt2},\qquad
 e_n^-={V_n-V_{-n}\over\sqrt2}.                    \tag{1.5}
\]

For a real trial energy `u` such that

\[
 T_-(u):=Q_- -uI                                    \tag{1.6}
\]

is invertible, set

\[
 v_u=T_-(u)^{-1}\beta.                              \tag{1.7}
\]

Let `D^dagger V_0=0` and `D^dagger V_n=n^(-1)V_n` for `n!=0`, and define

\[
 \boxed{
 \Phi_u=
 \left(1+\langle\eta,D^\dagger v_u\rangle\right)V_0
       -D^\dagger v_u.}                            \tag{1.8}
\]

Then

\[
 \langle\eta,\Phi_u\rangle=1,
 \qquad D\Phi_u=-v_u.                              \tag{1.9}
\]

## 2. One scalar equation reconstructs the even eigenline

### Proposition 2.1 (odd-resolvent eigenline equation)

There is a real scalar

\[
 \alpha(u)=\langle V_0,(Q-uI)\Phi_u\rangle          \tag{2.1}
\]

such that

\[
 \boxed{(Q-uI)\Phi_u=\alpha(u)V_0.}                 \tag{2.2}
\]

In particular,

\[
 \boxed{\alpha(u)=0
 \quad\Longleftrightarrow\quad
 Q_+\Phi_u=u\Phi_u.}                               \tag{2.3}
\]

**Proof.**  Equations (1.7)--(1.9) give

\[
 (Q_- -uI)D\Phi_u=-\beta.                           \tag{2.4}
\]

For an even vector `f`, (1.4) reduces to
`[D,Q]f=beta<eta,f>`.  Using `<eta,Phi_u>=1` in (2.4) gives

\[
 D(Q-uI)\Phi_u=0.                                   \tag{2.5}
\]

The kernel of `D` is the line generated by `V_0`, proving (2.2).
The vector `Phi_u` is nonzero because its boundary sum is one, so (2.3)
follows. \(\square\)

This is the exact scalar Weyl equation behind the even line.  To make `u`
the lowest simple eigenvalue of the even block one must still prove

\[
 Q_+-uI\succeq0,\qquad
 \ker(Q_+-uI)=\mathbb C\Phi_u.                     \tag{2.6}
\]

Equation (2.3) does not supply (2.6).

## 3. Complete transform from one response profile

For complex `r` away from `+/-1,...,+/-N`, define the odd Cauchy Riesz
vector

\[
 g_r=\sum_{n=1}^N{\sqrt2\,n\over n^2-\bar r^2}e_n^- \tag{3.1}
\]

and the scalar meromorphic response

\[
 \boxed{
 \mathcal A_u(r)=1+\langle g_r,v_u\rangle.}         \tag{3.2}
\]

The project inner product is antilinear in its first entry.  The conjugate
in (3.1) is therefore mandatory: it makes the scalar in (3.2) meromorphic
in `r`, rather than antimeromorphic.  On the real and imaginary axes this
distinction does not change the displayed rational coefficients.

Suppose `alpha(u)=0`, and write

\[
 \Phi_u=\sum_{n=-N}^N\xi_nV_n,
 \qquad \xi_{-n}=\xi_n,
 \qquad \sum_{n=-N}^N\xi_n=1.                    \tag{3.3}
\]

Since `D Phi_u=-v_u`, (3.2) becomes

\[
 \boxed{
 \mathcal A_u(r)
 =1-2\sum_{n=1}^N{n^2\xi_n\over n^2-r^2}.}         \tag{3.4}
\]

### Theorem 3.1 (real-window response identity)

Put

\[
 r={tL\over2\pi},\qquad
 K_L(t)={2\sin(tL/2)\over t\sqrt L}
       ={\sqrt L\over\pi}{\sin(\pi r)\over r},     \tag{3.5}
\]

with continuous values at zero.  Then

\[
 \boxed{
 \widehat\Phi_u(t)=K_L(t)\mathcal A_u(r).}          \tag{3.6}
\]

At the interior lattice points the right side is interpreted by analytic
continuation: a pole of `mathcal A_u` cancels the zero of `sin(pi*r)`.

**Proof.**  Source equation (5.25), in centered coordinates, gives

\[
 \widehat\Phi_u(t)
 ={\sqrt L\over\pi}\sin(\pi r)
   \sum_{n=-N}^N{\xi_n\over r-n}.                  \tag{3.7}
\]

Pairing the `+/-n` terms and using the boundary sum in (3.3) gives

\[
 r\sum_{n=-N}^N{\xi_n\over r-n}
 =1-2\sum_{n=1}^N{n^2\xi_n\over n^2-r^2}
 =\mathcal A_u(r).                                 \tag{3.8}
\]

Substitution proves (3.6). \(\square\)

Away from zeros, poles, and the removable central singularity, logarithmic
differentiation gives the exact formula

\[
 \boxed{
 {d\over dt}\log\widehat\Phi_u(t)
 ={L\over2}\cot(tL/2)-{1\over t}
  +{L\over2\pi}{\mathcal A_u'(r)\over\mathcal A_u(r)}.} \tag{3.9}
\]

Thus a boundary scalar and the logarithmic derivative **as a function on an
interval** reconstruct the transform.  A single value of that derivative
does not.

## 4. Exact projective and Feshbach versions

Let `p` be any real even vector with

\[
 c_p=\langle\eta,p\rangle\ne0,
 \qquad {p\over c_p}=\sum_{n=-N}^Np_nV_n.           \tag{4.1}
\]

Define its coefficient response

\[
 \mathcal A_p(r)
 =1-2\sum_{n=1}^N{n^2p_n\over n^2-r^2}.            \tag{4.2}
\]

The same elementary calculation as in Theorem 3.1 gives the exact
boundary-matched identity

\[
 \boxed{
 \widehat{c_p\Phi_u}(t)-\widehat p(t)
 =c_pK_L(t)\{\mathcal A_u(r)-\mathcal A_p(r)\}.}   \tag{4.3}
\]

This is a direct scalar-profile form of the real-window approximation
problem.  It is useful only when the boundary normalization is quantitatively
admissible; qualitative nonvanishing is not a lower bound.

There is a boundary-free projective form.  If `t_0` is any point at which
both transforms are nonzero, then

\[
 {\widehat\Phi_u(t)\over\widehat\Phi_u(t_0)}
 ={K_L(t)\over K_L(t_0)}
  {\mathcal A_u(r)\over\mathcal A_u(r_0)},
 \qquad r_0={t_0L\over2\pi}.                       \tag{4.4}
\]

All products and ratios in (4.4)--(4.5) are interpreted by analytic
continuation at lattice points, after cancelling the common sine zeros;
the stated nonvanishing condition applies to the resulting continued
denominator.

Consequently the normalization of `Phi_u` chosen to agree with `p` at
`t_0` obeys

\[
\boxed{
 {\widehat p(t_0)\over\widehat\Phi_u(t_0)}
       \widehat\Phi_u(t)-\widehat p(t)
 =\widehat p(t_0){K_L(t)\mathcal A_u(r)
                    \over K_L(t_0)\mathcal A_u(r_0)}
  -\widehat p(t).}                                  \tag{4.5}
\]

This is the one-profile specialization of the projective-wedge gate.

Finally take a unit even anchor `kappa`.  Assume `u` is the simple even
ground value, `<kappa,Phi_u>!=0`, and the compression to
`K=kappa^perp` is invertible.  The coefficient-normalized ground and exact
Feshbach correction are

\[
 w_u={\Phi_u\over\langle\kappa,\Phi_u\rangle},
 \qquad z_u=\kappa-w_u.                             \tag{4.6}
\]

If

\[
 Q_+=\begin{bmatrix}q&b^*\\b&A\end{bmatrix}
 \quad\hbox{on }\mathbb C\kappa\oplus\mathcal K,
\]

then `z_u=(A-uI)^(-1)b`, but no Euclidean solve is needed to evaluate it:

\[
 \boxed{
 \widehat z_u(t)=\widehat\kappa(t)
 -{K_L(t)\mathcal A_u(r)\over
       \langle\kappa,\Phi_u\rangle}.}              \tag{4.7}
\]

## 5. The same profile contains the odd-inertia gate

Suppose (2.6) holds and the zero-mode coefficient of `Phi_u` is nonzero.
For `alpha>=0`, equation (3.4) gives

\[
 \mathcal A_u(i\alpha)
 =1-2\sum_{n=1}^N{n^2\xi_n\over n^2+\alpha^2}.     \tag{5.1}
\]

The finite squared-mode factorization derived from (1.4) gives

\[
 \boxed{
 Q_- -uI\succ0
 \quad\Longleftrightarrow\quad
 \mathcal A_u(i\alpha)>0
 \quad\hbox{for every }\alpha\ge0.}               \tag{5.2}
\]

Equivalently, by (3.6), the boundary-normalized even eigenvector has a
positive transform on the complete imaginary axis.  This is the exact
simple-global-even reduction after the even gap is known.  It is not a sign
proof.  Positivity on a fixed compact part of that axis does not suffice,
and comparison against a Ritz value `U>u` additionally needs a quantitative
odd reserve exceeding `U-u`.

The combined direct program exposed by Sections 2--5 is therefore:

1. locate a root `alpha(u)=0` and prove the simple even-complement sign;
2. prove the complete imaginary-axis sign (5.2), with the needed shifted
   reserve; and
3. prove the real-window response-ratio convergence in (4.3) or (4.5).

This bypasses the full Euclidean correction but does not remove either
source-specific analytic estimate.

## 6. Exact positive Cauchy counterfamily

The response profile cannot be replaced by one local scalar.  Take `N=3`,
write an even vector by its coefficients at `0,1,2,3`, and set

\[
 \bar x_n={1\over7},                                \tag{6.1}
\]

\[
 (h_0,h_1,h_2,h_3)
 =\left(-{4\over245},{27\over245},-{54\over49},1\right),
 \qquad h_{-n}=h_n.                                \tag{6.2}
\]

An exact calculation gives

\[
 h_0+2(h_1+h_2+h_3)=0.                              \tag{6.3}
\]

With `epsilon=1/100`, put

\[
 x_n^\pm={1\over7}\pm\epsilon h_n.                 \tag{6.4}
\]

Every coefficient is strictly positive, the vectors are inversion even,
and their boundary sums are one.  Define

\[
 \boxed{
 Q^\pm=\operatorname {diag}(1/x_n^\pm)
       -|\eta\rangle\langle\eta|.}                 \tag{6.5}
\]

For `n!=m`, `Q^+_(nm)=Q^-_(nm)=-1`.  Both matrices therefore have the exact
Cauchy form (1.3) with the **same** coefficients

\[
 b_n=-n.                                            \tag{6.6}
\]

Their diagonal entries are even.  Moreover,

\[
 \langle y,Q^\pm y\rangle
 =\sum_n{|y_n|^2\over x_n^\pm}
  -\left|\sum_ny_n\right|^2\ge0                    \tag{6.7}
\]

by weighted Cauchy--Schwarz, with equality exactly on the line
`C*x^pm`.  Thus each `Q^pm` has a simple global even ground value zero and a
strictly positive odd sector.  This is stronger than merely assuming an
even candidate line.

Let

\[
 \kappa={\eta\over\sqrt7}.                          \tag{6.8}
\]

Since `<kappa,x^pm>=1/sqrt(7)`, the coefficient-normalized grounds and
Feshbach corrections are

\[
 w^\pm=\sqrt7x^\pm,
 \qquad
 z^\pm=\kappa-w^\pm
 =\mp{\sqrt7\over100}h.                            \tag{6.9}
\]

Equation (6.3) gives `z^pm perpendicular kappa` and
`<eta,z^pm>=0`.  Positivity and the nonorthogonality of the kernel to
`kappa` make the compression to `kappa^perp` positive, so (6.9) is exactly
the complement Feshbach solve.  The two solves also have the same norm:

\[
 \|z^+\|^2=\|z^-\|^2
 ={7\over10000}\,{267324\over60025}.               \tag{6.10}
\]

Thus their ground Feshbach functions have the same value and first
derivative at the root.

## 7. Exact local agreement and window disagreement

For an even coefficient vector `a`, define its rational Cauchy transform

\[
 C_a(r)={a_0\over r}
 +\sum_{n=1}^3a_n\left({1\over r-n}+{1\over r+n}\right). \tag{7.1}
\]

The transform in (3.7) is the common sine factor times `C_a`.  Direct exact
arithmetic applied to (6.2) gives

\[
 \boxed{
 C_h(1/2)=0,\qquad C_h'(1/2)=0,}                    \tag{7.2}
\]

but

\[
 \boxed{C_h(1/3)=-{243\over13720}\ne0.}            \tag{7.3}
\]

The common base value is

\[
 C_{\bar x}(1/2)={2\over49}\ne0.                  \tag{7.4}
\]

It follows that the two ground transforms have exactly the same nonzero
value and the same logarithmic derivative at `r=1/2`.  Their corrections
have zero value and zero first derivative there.  Nevertheless (7.3) makes
the corrections opposite and nonzero at `r=1/3`.

This counterfamily preserves substantially more than the proposed local
data: exact Cauchy displacement, inversion, Hermitian symmetry, simple-even
globality, odd positivity, boundary scalar, correction norm, and the local
ground-transform one-jet.  Therefore no implication from those data to a
uniform real-window estimate can follow from the abstract finite Cauchy
algebra.  The actual arithmetic response profile in (3.2) must be estimated
on the whole required window.

### Proposition 7.1 (no fixed finite jet is sufficient)

The preceding construction extends to an arbitrary prescribed finite jet.
Fix a nonlattice real point `r_0` and an integer `k>=0`.  Choose
`N>=k+2`.  In the `N+1` dimensional space of even coefficient lists
`(h_0,...,h_N)`, impose the `k+2` homogeneous linear conditions

\[
 h_0+2\sum_{n=1}^Nh_n=0,
 \qquad C_h^{(j)}(r_0)=0\quad(0\le j\le k).          \tag{7.5}
\]

Their common kernel contains a nonzero `h`.  The rational functions

\[
 {1\over r},\qquad {1\over r-n}+{1\over r+n}
 \quad(1\le n\le N)                                \tag{7.6}
\]

are linearly independent, as is seen from their distinct poles.  Hence
`C_h` is not identically zero, and there is another nonlattice point `r_*`
with `C_h(r_*)!=0`.

Take the strictly positive uniform boundary-normalized vector
`bar(x)_n=1/(2N+1)` and choose a positive rational `epsilon` small enough
that `bar(x)+/-epsilon*h` remains coefficientwise positive.  Equations
(6.5)--(6.9) apply verbatim.  The two exact positive Cauchy models then have
the same ground-transform `k`-jet at `r_0` and different transforms at
`r_*`.  If the common transform value at `r_0` is nonzero, their logarithmic
jets agree there as well.  A finite collection of sample points and
derivatives is handled by replacing `k+2` with the total number of linear
constraints and increasing `N`.

Thus finite-dimensional rational interpolation can recover the response at
one fixed `N` if sufficiently many data are supplied, but no number of local
scalars fixed independently of the growing cutoff controls the unbounded
schedule.

## 8. Remaining source obligation

The exact reduction replaces a vector-valued target by two scalar objects:
the eigenline equation `alpha(u)=0` and the meromorphic response profile
`mathcal A_u`.  It does not make the problem finite-dimensional uniformly in
`N`: the profile acquires one pole pair for every retained Fourier mode.

On an unbounded arithmetic schedule, the still-missing common theorem must
prove

* the even-complement and shifted odd-sector signs;
* a uniform real-window estimate for (4.3) or the projective ratio (4.5);
  and
* the already proved source-normalized prolate projection and factor-four
  limit with all normalizations unchanged.

No current source estimate supplies those first two bullets on one schedule.
