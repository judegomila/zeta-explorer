# Spectral closure of the endpoint defect condition

## Scope

This note identifies the exact spectral content of the directional
contractive-extension inequality in `DEFECT_FACTORIZATION.md`.  It is a
reformulation, not a new positivity theorem.  In particular, introducing a
square root of the spectral density below would assume the sign that remains
to be proved.

Use the nonunitary Fourier convention

\[
\widehat g(\nu)=\int_{\mathbb R}g(h)e^{-i\nu h}\,dh,
\qquad \widehat\psi(\nu)=2\Xi(\nu).
\]

Let `p` be a real polynomial of one fixed parity and put

\[
P(\nu)=p(i\nu),\qquad
X p=2h\,p(D)\psi+p'(D)\psi,
\qquad Yp=p'(D)\psi.
\]

The two Fourier images are

\[
\widehat{Xp}=i\{\widehat\psi P'+2\widehat\psi'P\},
\qquad
\widehat{Yp}=-i\widehat\psi P'. \tag{1}
\]

Because `p` has fixed parity, `P` has a constant real or imaginary phase on
the real axis.  Hence

\[
2\operatorname{Re}(P'\overline P)=(|P|^2)'.
\]

After Plancherel and one integration by parts, with the boundary term killed
by the complete-theta decay,

\[
\begin{aligned}
\int_{\mathbb R}
 (|\widehat{Xp}|^2-|\widehat{Yp}|^2)\,d\nu
 &=2\int_{\mathbb R}
 (\widehat\psi'^2-\widehat\psi\widehat\psi'')|P|^2\,d\nu.
\end{aligned} \tag{2}
\]

The squared norms are even, so the half-line target form

\[
\mathfrak q(p)=\frac12
\left(\|Xp\|_{L^2(0,\infty)}^2-
      \|Yp\|_{L^2(0,\infty)}^2\right)
\]

therefore has the exact spectral representation

\[
\boxed{
\mathfrak q(p)=\frac1\pi\int_{\mathbb R}
 \bigl(\Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu)\bigr)
 |p(i\nu)|^2\,d\nu .
} \tag{3}
\]

Equivalently, the bridge density used in the frozen spectral audit is

\[
f_{\rm bridge}(t)=\frac14\left[
\widehat\psi'(t/2)^2-
\widehat\psi(t/2)\widehat\psi''(t/2)
\right]
=\Xi'(t/2)^2-\Xi(t/2)\Xi''(t/2).
\]

equation (3) is

\[
\mathfrak q(p)=\frac1{2\pi}\int_{\mathbb R}
 f_{\rm bridge}(t)|p(it/2)|^2\,dt. \tag{4}
\]

## Consequence for the rung-by-rung defect

At a finite same-parity grade, the target Gram is precisely the moment Gram
of the signed density in (3).  Assuming the old target block is positive
definite, its next Schur pivot is nonnegative exactly when the one-point
defect inequality

\[
\left\|D_{T^*}^{-1}
 (Yp_n-TP_{\mathcal M}Xp_n)\right\|
\leq\left\|(I-P_{\mathcal M})Xp_n\right\|
\]

holds for the new residual polynomial.  Thus the contractive-extension
condition and the signed Christoffel pivot are the same condition in spatial
and spectral coordinates, respectively.

The complete-theta strip decay supplies exponential moments.  The standard
polynomial-density argument recorded in
`evidence/v18-curated/spectral_relative_limit_audit/AUDIT.md` therefore gives,
separately in either full parity ladder,

\[
\mathfrak q(p)\geq0\text{ for every polynomial }p
\quad\Longleftrightarrow\quad
f_{\rm bridge}(t)\geq0\text{ for almost every }t.
\tag{5}
\]

Continuity upgrades the right side to pointwise nonnegativity.  For the odd
ladder the forced zero at the origin changes only a measure-zero point.

## Proof-design implication

Equation (5) is a closure test, not a shortcut.  A factorization such as
`sqrt(f)` or a positive spectral Gram is circular unless `f>=0` has already
been proved.  Likewise, an abstract extension theorem cannot manufacture the
new contractive value: its feasibility condition is exactly the next signed
Christoffel pivot.  A successful proof must add source-specific information
that establishes the spectral sign (or, equivalently, every directional
defect inequality) without assuming it.

Finite endpoint reconstructions remain useful for auditing the spatial
factorization and rejecting lossy estimates, but they cannot establish (5)
at all grades.

## Exact Hankel and cross-parity border recurrence

Put `u=t^2/4` and define the signed pushforward moments

\[
m_k=\frac1{2\pi}\int_{\mathbb R}
f_{\rm bridge}(t)u^k\,dt. \tag{6}
\]

After the harmless alternating diagonal signs coming from `(it/2)^(2j)`,
the monomial target Grams are

\[
H_n=(m_{j+k})_{j,k=0}^n,
\qquad
H_n^{(1)}=(m_{j+k+1})_{j,k=0}^n, \tag{7}
\]

for the even and odd ladders respectively.  Write

\[
\Delta_n=\det H_n,\qquad
\Delta_n^{(1)}=\det H_n^{(1)}.
\]

Use the empty-determinant convention
`Delta_(-1)=Delta_(-1)^(1)=1`.  The following ratios are asserted when their
preceding determinants are nonzero; in the intended induction this is the
positive-old-prefix hypothesis.

The monic signed-Christoffel pivots are

\[
h_n=\frac{\Delta_n}{\Delta_{n-1}},
\qquad
\widetilde h_n=\frac{\Delta_n^{(1)}}
 {\Delta_{n-1}^{(1)}}. \tag{8}
\]

Thus the spatial defect identity at the new even rung is exactly

\[
\|(I-P_{\mathcal M})Xp_n\|^2-\|z_n\|^2=2h_n, \tag{9}
\]

and the odd version has \(2\widetilde h_n\); the actual nonmonic graded basis
adds only the square of its leading coefficient.

There is also an exact relation between the two parity borders.  If `pi_n` is
the monic polynomial orthogonal for the signed pushforward measure, then

\[
\pi_n(0)=(-1)^n\frac{\Delta_{n-1}^{(1)}}{\Delta_{n-1}},
\qquad
\boxed{
\widetilde h_n=-h_n\frac{\pi_{n+1}(0)}{\pi_n(0)}.
} \tag{10}
\]

Consequently, given the required nonzero old even and odd prefixes and
`h_n>0`, the odd border is positive exactly when
`pi_(n+1)(0)/pi_n(0)<0`.  This is a sharp cross-parity recurrence, but requiring
it for every grade is equivalent to the same spectral sign in (5), not a
weaker positivity lemma.

## Operator recurrences and the unavoidable extra channel

Define

\[
A p=h\,p(D)\psi,\qquad Bp=p(D)(h\psi).
\]

Then

\[
X=A+B,\qquad Y=B-A. \tag{11}
\]

On the polynomial range, let `C(Ap)=Bp`.  The candidate reflected operator is
the Cayley transform

\[
T=(C-I)(C+I)^{-1}. \tag{12}
\]

Its contractivity is equivalent to accretivity
`Re <C Ap,Ap> >= 0`, which is exactly the target form (3).  Thus the abstract
Cayley transform supplies no positivity for free.

The grade shift exhibits the same obstruction algebraically.  Let

\[
S:p\mapsto zp,\qquad Vp=p(D)\psi.
\]

For every integer `m>=1`, direct commutation gives

\[
VS^m=D^mV,\qquad
XS^m=D^mX-mD^{m-1}V,\qquad
YS^m=D^mY+mD^{m-1}V. \tag{13}
\]

Therefore

\[
\begin{aligned}
\mathfrak q(z^mp)
={}&\frac12\left(\|D^mXp\|^2-\|D^mYp\|^2\right)\\
&-m\operatorname{Re}\langle
D^m(Xp+Yp),D^{m-1}Vp\rangle .
\end{aligned} \tag{14}
\]

The two pure `V` squares cancel exactly, leaving a signed cross channel.  In
particular the same-parity step `m=2` is triangular only after augmenting by
`V`. Any argument that discards the surviving cross term and budgets `V`
separately loses the exact compensation.  This is the operator form of the
independent residue and residue-drift coordinates `-C(t)` and `-tC(t)`.

Finally, if \(F=\widehat\psi=2\Xi\), \(g=p(i\cdot)F\), and \(u=F'/F\),
then away from zeros of \(F\),

\[
\widehat{Xp}=i(\partial+u)g,
\qquad
\widehat{Yp}=-i(\partial-u)g. \tag{15}
\]

The difference of these two first-order energies is again (3).  The apparent
supersymmetric intertwiner therefore restates the missing sign, and `u` has
poles at zeros of `Xi`; it is not an unconditional bounded factorization.
