# Even-sector cross-root limit bridge

## 0. Scope and claim boundary

This note weakens the finite real-root hypothesis in the CCM determinant
bridge.  It proves that a simple lowest eigenvector of the **even inversion
compression** has a Fourier--Mellin transform whose zeros lie on the union
of the real and imaginary axes.  No sign assumption on the odd compression
is used.  Axis-rooted approximants are enough for the final locally uniform
limit argument because the limiting completed zeta function is nonzero on
the open imaginary segment.

This is a finite algebraic theorem and a conditional limit reduction.  It
does not prove the actual-source even ground alignment, equation (5.2) of
`DIRECT_RH_ATTACK.md`, locally uniform convergence, or the Riemann
hypothesis.  The project status remains `P0_INVALIDATED`.

The binding source is Connes--Consani--Moscovici, *Zeta Spectral Triples*,
arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The finite inputs are source Lemma 5.1 and (5.2), Lemma 5.2 and (5.3),
the algebraic part of Lemma 5.4, and the transform formula (5.25).  The
source interval, Fourier sign, inversion, and matrix assembly remain those
locked in `P0_SOURCE_LOCK.json`.  In particular,

\[
 \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt,
 \qquad L=2\log\lambda,                            \tag{0.1}
\]

and the complete Weil matrix retains the pole, archimedean, and finite
minus-prime contributions before any spectral operation.  The prime block
keeps the minus sign in source (3.19), and its inventory is inclusive through
`n<=lambda^2`.  The theorem below never replaces that matrix by a zero table
or by an assumption of global Weil positivity.

## 1. Exact raw-mode polynomial and transform

Use the centered source modes

\[
 V_n(t)={(-1)^n\over\sqrt L}e^{2\pi int/L},
 \qquad -N\le n\le N,                              \tag{1.1}
\]

and let `D V_n=nV_n`, `J V_n=V_(-n)`.  Let

\[
 x=\sum_{n=-N}^Nx_nV_n,
 \qquad x_{-n}=x_n\in\mathbb R.                    \tag{1.2}
\]

Thus `x` is inversion even.  Put

\[
 s={zL\over2\pi},
 \qquad c=\langle\eta,x\rangle
       =x_0+2\sum_{n=1}^Nx_n,
 \qquad \eta=\sum_{n=-N}^NV_n.                    \tag{1.3}
\]

Define the raw-mode polynomial

\[
 \boxed{
 p_x(y)=x_0\prod_{m=1}^N(y-m^2)
 +2y\sum_{n=1}^Nx_n
       \prod_{\substack{1\le m\le N\\m\ne n}}(y-m^2).} \tag{1.4}
\]

Its leading coefficient is exactly `c`.  Directly pairing the `+/-n`
terms in source (5.25) gives, with every apparent lattice singularity
interpreted by continuity,

\[
 \boxed{
 \widehat x(z)
 ={\sqrt L\over\pi}{\sin(\pi s)\over s}
 {p_x(s^2)\over\prod_{m=1}^N(s^2-m^2)}.}           \tag{1.5}
\]

There is no unrecorded phase in (1.5): the `(-1)^n` in (1.1) cancels the
corresponding endpoint sine factor.  At the origin, (1.5) gives
`widehat(x)(0)=sqrt(L)*x_0`.  At `s=+/-n`, the zero of `sin(pi*s)` removes
the displayed pole.  If `x_n=0`, a zero can remain there, but it is real.
Consequently every nonlattice zero of `widehat(x)` is obtained by taking a
square root of a zero of `p_x`.

An exact polynomial identity useful for independent replay is

\[
 p_x(s^2)
 =\det(D-sI)\sum_{j=-N}^N{x_j\over j-s}.           \tag{1.6}
\]

Both sides of (1.6) are polynomials after cancellation, so the equality also
holds at integer `s`.

## 2. The nondegenerate boundary case

Assume that the exact source matrix has the real Cauchy form

\[
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),
 \qquad b_{-n}=-b_n,                               \tag{2.1}
\]

with even diagonal, and hence

\[
 [D,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|,
 \qquad JQ=QJ.                                     \tag{2.2}
\]

Let `Q_+` and `Q_-` be the inversion-sector compressions.  Suppose `mu` is
the simple lowest eigenvalue of `Q_+`, with real eigenvector `x`, and put

\[
 T_+=Q_+-\mu I\succeq0,
 \quad\ker T_+=\mathbb Cx,
 \qquad T_-=Q_--\mu I.                             \tag{2.3}
\]

No sign or invertibility is imposed on `T_-`.

### Theorem 2.1 (even quotient and cross-root polynomial)

If `c=<eta,x>!=0`, then every zero of `p_x` is real.  More precisely, there
is an operator `A` on an `N`-dimensional positive Hilbert space such that

\[
 \boxed{p_x(y)=c\det(yI-A),}                       \tag{2.4}
\]

`A` is self-adjoint in that positive metric, and

\[
 \boxed{\operatorname {inertia}(A)
       =\operatorname {inertia}(T_-).}             \tag{2.5}
\]

The assertion does not require `x_0!=0`.

**Proof.**  Normalize `xi=x/c`, so `<eta,xi>=1`, and define

\[
 T=Q-\mu I,
 \qquad D'=D-|D\xi\rangle\langle\eta|.            \tag{2.6}
\]

Then `D'xi=0`, `JD'=-D'J`, and `D'` descends to

\[
 E'=E_N/\mathbb C\xi
   =(H_+/\mathbb C\xi)\mathbin\oplus H_-.         \tag{2.7}
\]

The algebraic determinant calculation in source Lemma 5.4 does not use
positivity of `T_-`.  It gives

\[
 \det(D''-sI)
 =\det(D-sI)\sum_{j=-N}^N{\xi_j\over j-s}
 ={p_x(s^2)\over c}.                              \tag{2.8}
\]

Put `K_+=H_+/C*xi` and give it the positive inner product

\[
 G_+([f],[g])=\langle T_+f,g\rangle.              \tag{2.9}
\]

Relative to `K_+ direct-sum H_-`, parity gives

\[
 D''=\begin{bmatrix}0&B\\C&0\end{bmatrix},
 \quad B:H_-\to K_+,
 \quad C:K_+\to H_-.                              \tag{2.10}
\]

The map `C` is bijective.  Indeed, if `D'f=0` for an even representative,
then

\[
 D(f-\langle\eta,f\rangle\xi)=0,
\]

so `f-<eta,f>xi=aV_0`.  Pairing with `eta`, and using both
`<eta,xi>=1` and `<eta,V_0>=1`, gives `a=0`.  Thus the quotient kernel is
zero, and the domain and codomain both have dimension `N`.

Equation (2.2), `Txi=0`, and parity imply

\[
 TD\xi=-\beta,
 \qquad TD'=D'^*T.                                \tag{2.11}
\]

Taking parity blocks in (2.11) gives, for `A=BC`,

\[
 \boxed{G_+A=C^*T_-C.}                            \tag{2.12}
\]

Therefore

\[
 G_+^{1/2}AG_+^{-1/2}
 =G_+^{-1/2}C^*T_-CG_+^{-1/2}                    \tag{2.13}
\]

is an ordinary Hermitian matrix.  It is congruent to `T_-` because `C` is
bijective.  This proves that `A` has real spectrum and proves (2.5).  Finally,
the block determinant in (2.10) is

\[
 \det(D''-sI)=\det(s^2I-BC),                      \tag{2.14}
\]

so (2.8) proves (2.4).  \(\square\)

### Corollary 2.2 (negative odd directions)

For `c!=0`, every negative eigenvalue `-alpha^2` of `A` contributes the
purely imaginary quotient pair `+/-i*alpha`; every positive eigenvalue
contributes a real pair.  Counts include algebraic multiplicity.  Hence

\[
 n_-(Q_--\mu I)
 =\#\{\hbox{purely imaginary quotient pairs}\}.   \tag{2.15}
\]

Full finite real-rootedness is therefore equivalent to `T_-` being positive
semidefinite.  The strict inequality `T_->0` additionally excludes a zero
pair and is what follows when `mu` is a simple lowest eigenvalue of the full
matrix.  Negative odd directions do not create arbitrary complex roots:
they create only imaginary pairs.

If `x_0=0`, Theorem 2.1 still applies.  In that case `p_x(0)=0`, so zero is
a real quotient root; correspondingly `T_-` is singular.  The nonzero
central coefficient used in the positive odd-symmetrizer argument of
`notes/EVEN_GROUND_IMAGINARY_AXIS_ODD_INERTIA.md` is not needed on the
positive even quotient.

## 3. Removal of the boundary hypothesis

The boundary-degenerate case is not discarded and no generic boundary
reserve is assumed.

### Theorem 3.1 (Cauchy-preserving closure at `c=0`)

Under (2.1)--(2.3), including simplicity of the lowest even eigenvalue, the
polynomial `p_x` is real-rooted even when `<eta,x>=0`.

**Proof.**  Rescale `x` to unit norm and work in the real parity basis,
writing

\[
 x=x_0e_0^++\sum_{n=1}^Nx_n^+e_n^+,
 \qquad e_n^+={V_n+V_{-n}\over\sqrt2}.             \tag{3.1}
\]

If `<eta,x>=0`, then `Dx!=0`; otherwise `x` would be a nonzero multiple of
`V_0`, whose boundary pairing is nonzero.  Choose a real even diagonal
matrix `R`,

\[
 Re_0^+=r_0e_0^+,
 \quad Re_n^+=r_ne_n^+,
 \quad Re_n^-=r_ne_n^-,                            \tag{3.2}
\]

such that

\[
 \langle x,Rx\rangle
 \ne{\langle Dx,RDx\rangle\over\|Dx\|^2}.         \tag{3.3}
\]

Such an `R` must exist.  If equality held for every choice of the `r_n`,
comparison of the `r_0` coefficient would give `x_0=0`.  Comparison of every
remaining coefficient would force all nonzero `x_n^+` to occur at one value
of `n`.  A nonzero vector supported on one even Fourier shell cannot be
orthogonal to `eta`, a contradiction.

Set

\[
 Q(t)=Q+tR.                                        \tag{3.4}
\]

This changes only the even diagonal entries `a_(-n)=a_n`.  It therefore
preserves the source Cauchy off-diagonal formula, inversion, and the exact
commutator (2.2).  For sufficiently small real `t`, the simple lowest even
eigenpair has a real-analytic continuation `mu(t),x(t)`.

Put `c(t)=<eta,x(t)>`.  If `c(t)` vanished identically near zero, applying
the unchanged commutator to the even vector `x(t)` would give

\[
 Q(t)Dx(t)=\mu(t)Dx(t).                            \tag{3.5}
\]

Thus the same analytic eigenvalue would have both the even eigenvector
`x(t)` and the odd eigenvector `Dx(t)`.  Differentiating the two eigenvalue
equations and using Hermitian symmetry gives the two Hellmann--Feynman
identities

\[
 \mu'(0)=\langle x,Rx\rangle,
 \qquad
 \mu'(0)={\langle Dx,RDx\rangle\over\|Dx\|^2},     \tag{3.6}
\]

contrary to (3.3).  Hence `c(t)` is not identically zero.  There is a sequence
`t_k->0` for which `c(t_k)!=0` and the even ground remains simple.

Theorem 2.1 makes every `p_(x(t_k))` real-rooted.  Their coefficients converge
to those of `p_x`.  A locally uniform limit of polynomials with no zeros off
the real axis either has no zeros off that axis or is identically zero.
The latter is impossible: (1.4) evaluated at `0,1^2,...,N^2` recovers all
coefficients of the nonzero vector `x`.  Therefore `p_x` is real-rooted.
\(\square\)

Combining Theorems 2.1 and 3.1 gives the finite conclusion without either
`<eta,x>!=0` or `x_0!=0`:

\[
 \boxed{Z(\widehat x)\subset\mathbb R\cup i\mathbb R.} \tag{3.7}
\]

When `c=0`, the literal CCM boundary-normalized rank-one perturbation is not
defined and the direct inertia count (2.15) need not persist: roots can escape
to infinity as the leading coefficient of `p_x` tends to zero.  Equation
(3.7), rather than an unsupported determinant normalization, is the result
used below.

## 4. Optional finite strip gates

Axis-rootedness is sufficient for the limit argument in Section 5.  If one
nevertheless wants each finite transform to have no imaginary zero in the
open band `0<|Im z|<eta`, Theorem 2.1 gives the exact condition.  Put

\[
 A_{\rm ph}=\left({2\pi\over L}\right)^2A.         \tag{4.1}
\]

Then

\[
 \boxed{
 \operatorname {spec}(A_{\rm ph})\cap(-\eta^2,0)=\varnothing} \tag{4.2}
\]

is necessary and sufficient.  Since `A_ph` is self-adjoint in `G_+`, this is
equivalently the nonconvex polynomial inequality

\[
 \boxed{G_+A_{\rm ph}(A_{\rm ph}+\eta^2I)\succeq0.} \tag{4.3}
\]

When also `c!=0` and `x_0!=0`, use the odd square

\[
 X_{\rm ph}=(D'_{\rm ph})^2|_{H_-},
 \qquad
 K_{\rm ph}=\mathcal D_{\rm ph}T_+
             \mathcal D_{\rm ph}^*>0.             \tag{4.4}
\]

The source factorization is `K_ph=T_-X_ph`, and (4.2) is equivalently

\[
 \boxed{K_{\rm ph}+\eta^2T_-\succeq0.}            \tag{4.5}
\]

At the full open half-strip height `eta=1/2`, the physical coefficient in
(4.5) is `1/4`.  In integer-mode units it is `(L/(4*pi))^2`.

Let `C_ph=(2*pi/L)C` be the physical plus-to-minus quotient block.  The
superficially similar inequality

\[
 T_-+\eta^2C_{\rm ph}^{-*}G_+C_{\rm ph}^{-1}\succeq0 \tag{4.6}
\]

has the opposite meaning.  Congruence by `C_ph` turns (4.6) into
`G_+(A_ph+eta^2*I)>=0`; it forces negative roots to have imaginary height at
most `eta`, rather than excluding them from that band.  Neither (4.2) nor
(4.5) is required for the cross-root limit argument.

## 5. Cross-rooted Hurwitz lemma

Recall

\[
 \Xi(z)=\xi\!\left({1\over2}+iz\right),
 \qquad S=\{z:|\Im z|<1/2\}.                      \tag{5.1}
\]

### Lemma 5.1 (axis-rooted locally uniform limit)

Let `F_j` be holomorphic on `S`, suppose

\[
 Z(F_j)\subset\mathbb R\cup i\mathbb R,           \tag{5.2}
\]

and suppose `F_j->Xi` locally uniformly on `S`.  Then every zero of `Xi` in
`S` is real.

**Proof.**  On every connected component of
`S minus (R union iR)`, all `F_j` are zero-free.  Hurwitz's theorem makes
`Xi` zero-free there because `Xi` is not identically zero.

It remains only to inspect the open imaginary segment.  If `z=iy` and
`|y|<1/2`, put `sigma=1/2-y`, so `0<sigma<1`.  The alternating Dirichlet
series

\[
 \eta_D(\sigma)=\sum_{n\ge1}(-1)^{n-1}n^{-\sigma} \tag{5.3}
\]

is strictly positive, while

\[
 \eta_D(\sigma)=(1-2^{1-\sigma})\zeta(\sigma)     \tag{5.4}
\]

has a strictly negative parenthetical factor.  Hence `zeta(sigma)<0`.
All remaining real factors in

\[
 \xi(\sigma)={1\over2}\sigma(\sigma-1)
 \pi^{-\sigma/2}\Gamma(\sigma/2)\zeta(\sigma)    \tag{5.5}
\]

show that `xi(sigma)>0`.  Thus `Xi(iy)!=0`, completing the proof. \(\square\)

The lemma does not say that the finite functions are zero-free on compact
sets meeting the imaginary axis; they may have imaginary pairs.  It says
that no quantitative odd-sector gate is needed once exact axis-rootedness
and locally uniform convergence are both available.

## 6. Reduced checkpoint-0.70 bridge hypotheses

The projective transform estimates in
`notes/PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md` use only the transform of
the selected even ground line.  Their analytic inequalities do not require
that line to be the lowest eigenspace of the full matrix.  The axis-rooted
lemma therefore permits the following reduction of Theorem 6.1 in
`notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md`.

On an unbounded deterministic schedule, retain:

1. the exact source matrix and inversion symmetry, and the source-normalized
   even projected state `kappa`;
2. the exact lower two-vector Ritz value `u`, with `r>0` and bounded
   `(q-u)/r`;
3. only the strict even complementary comparison

   \[
   P_{\kappa^\perp\cap H_+}(Q_+-uI)
   P_{\kappa^\perp\cap H_+}\succ0;                \tag{6.1}
   \]

4. the resulting simple lowest even eigenline and the complete signed
   alignment estimate at `M=ceil(lambda)`, for example

   \[
   |S_M-k_{00}|=O(\lambda^{-1});                   \tag{6.2}
   \]

5. the already stated natural-cutoff tail, projected-state norm, compact
   frequency separation, and the three projective transform rates.

Condition (6.1) gives the simple lowest eigenvector of `Q_+` and the same
even resolvent/projective correction bounds used in checkpoint 0.70.  The
proof of the low-mode alignment uses the even inverse or adjugate formulas
in Sections 1--2 of the natural-cutoff note.  It must not invoke the
odd-resolvent formulas there unless their separate invertibility hypotheses
are actually proved.

The following are no longer hypotheses of the cross-root route:

- `Q_- -uI>0` or any shifted odd reserve;
- that the selected even eigenvalue is the global finite ground;
- nonzero or uniformly bounded boundary normalization;
- `x_0!=0`; and
- self-adjointness of the finite CCM perturbation in a positive full quotient
  metric.

With the retained projective rates, define the scaled entire functions from
the actual even eigenvectors exactly as in the existing projective bridge.
The transform comparison is unchanged, while Theorems 2.1--3.1 replace
finite real-rootedness by (3.7).  Lemma 5.1 is then the appropriate final
conditional limit lemma.

This reduction does not prove (6.2), the actual-source even-complement
comparison, any full-`L2` eigenvector estimate, or locally uniform
convergence.  In checkpoint 0.70 the surviving arithmetic obstruction is
the signed even alignment/action estimate.

## 7. Exact structural examples and limitations

### 7.1 Strict separation from odd positivity

For `N=1`, in mode order `(-1,0,1)`, take

\[
 Q=\begin{bmatrix}0&1&1\\1&2&1\\1&1&0\end{bmatrix},
 \qquad x=(1,-1,1)^T.                              \tag{7.1}
\]

This is the exact Cauchy form with `b_1=1`, `b_0=0`, `b_(-1)=-1`, diagonal
`(0,2,0)`.  The even eigenvalue of `x` is `mu=0`; the other even eigenvalue
is `3`, so `x` is the simple even ground.  The odd eigenvalue is `-1`, hence
`Q_- -mu*I` is negative.  Nevertheless `c=1` and

\[
 p_x(y)=y+1,                                      \tag{7.2}
\]

so the only nonlattice quotient pair is `s=+/-i`.  This proves that the
even-ground hypothesis is strictly weaker than odd positivity inside the
source Cauchy-displacement class.  It is a structural model, not a claim
about an arithmetic Weil matrix on an unbounded schedule.

### 7.2 Why extremality is essential

An arbitrary simple even eigenvector need not be cross-rooted.  For `N=2`,
take raw coefficients

\[
 x_0=1,\qquad x_1=-5/6,\qquad x_2=5/6.             \tag{7.3}
\]

Then

\[
 p_x(y)=y^2+4,                                    \tag{7.4}
\]

which has nonreal `y`-roots.  The exact Cauchy matrix with `b_1=b_2=-6`
and diagonals

\[
 a_0=-5,\qquad a_1=-26/5,\qquad a_2=13/5          \tag{7.5}
\]

has `Qx=0`, and the even zero eigenspace is one-dimensional.  But
`<V_0,QV_0>=-5`, so this eigenvector is not the lowest even eigenvector.
Thus simplicity and parity alone are insufficient; positivity of the
shifted even quotient is the decisive input in (2.13).

The finite theorem is therefore an honest reduction, not an asymptotic
proof.  Establishing the reduced even comparison and alignment on one
actual-source unbounded schedule remains open.
