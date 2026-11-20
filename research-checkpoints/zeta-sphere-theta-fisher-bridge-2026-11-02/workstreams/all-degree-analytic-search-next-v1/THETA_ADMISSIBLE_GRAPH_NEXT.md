# The exact theta-admissible feature--derivative graph

## Scope and outcome

This note addresses the pointwise-graph question left open in
`PARALLEL_TRACE_MODULAR_NEXT.md`.  The two corrected channels

\[
 U_a=a(D)\psi,
 \qquad J_a=a'(D)\psi                                      \tag{1}
\]

are not independent as functions of `h`.  Their complete relation is an
Appell, or translation--shear, graph.  Its exponential generating vector is

\[
 \boxed{\mathcal V(h,\tau)
   =\sum_{j\geq0}{\tau^j\over j!}
      \binom{D^j\psi(h)}{jD^{j-1}\psi(h)}
   =\binom{\psi(h+\tau)}{\tau\psi(h+\tau)}.}       \tag{2}
\]

The exact raw modular determinants satisfy the still simpler division-free
identity

\[
 \boxed{\mathcal\Delta(h,\tau)=\tau\mathcal\Omega(h,\tau).} \tag{3}
\]

Thus modular reflection and the residue/drift EGF preserve the same graph
exactly; they do not add a hidden pointwise sign constraint.

In fact there is a concrete actual-theta obstruction to any pointwise
positivity proof.  In the even ladder, polynomials of degree at most two
already realize every pair `(U,J)` at every `h>0`.  Hence the negative
direction of the local signed matrix in `PARALLEL_TRACE_MODULAR_NEXT.md` is
attained by genuine complete-theta polynomial features, not only by treating
the channels abstractly.  In the odd ladder the actual polynomial `a(z)=z`
has strictly negative local density throughout a sufficiently small deleted
neighborhood of the modular center.

The correlation that survives is global: the same polynomial coefficients
must be used for all `h`.  A Fourier calculation retains that correlation
exactly, but reduces the integrated form back to the original Xi Laguerre
density.  It is therefore a coordinate identity, not a noncircular proof of
its sign.  No new all-degree positivity or RH conclusion is claimed.

## 1. The translation--shear generating vector

For the monomial symbol `z^j`, equation (1) gives

\[
 U_j=D^j\psi,
 \qquad J_j=jD^{j-1}\psi,                           \tag{4}
\]

where `J_0=0`.  Local uniform convergence of the translation Taylor series
of the complete theta profile gives (2).  Equivalently, for every polynomial
`a`,

\[
 \boxed{
 \binom{U_a(h)}{J_a(h)}
 =\left.a(\partial_\tau)
   \binom{\psi(h+\tau)}{\tau\psi(h+\tau)}
   \right|_{\tau=0}.}                              \tag{5}
\]

This is an exact all-degree formula, not a finite-degree inference.  It says
that the second component is the shear accompanying translation of the
first component.

There is also an intrinsic graph description.  Let

\[
 \mathcal C_\psi=\{a(D)\psi:a\in\mathbb R[z]\}.
\]

The map `a -> a(D)psi` is injective.  Indeed, if a nonzero polynomial
annihilated `psi`, then on the real Fourier line
`a(it)\widehat\psi(t)=0`.  The polynomial has only finitely many real-line
zeros, so continuity would force `\widehat\psi`, and hence `psi`, to vanish
identically, contrary to `psi>0`.

Consequently the coefficient-lowering operator

\[
 L\,U_a=U_{a'}                                      \tag{6}
\]

is well defined on `C_psi`, and the admissible graph is exactly

\[
 \boxed{\mathcal G_\psi=\{(U,LU):U\in\mathcal C_\psi\}.} \tag{7}
\]

If `D` denotes spatial differentiation on this cyclic space, then

\[
 (LD-DL)U_a
 =U_{(za)'}-U_{za'}=U_a,
 \qquad\boxed{[L,D]=I.}                            \tag{8}
\]

This Weyl relation, together with the cyclic vector `psi`, is the complete
polynomial-symbol correlation.  It is a relation across the entire function
of `h`, not a scalar relation between two values at one spatial point.

## 2. Exact residue cancellation in the modular determinant EGF

Write `Psi_j` for the raw feature in the requested modular coordinates, so

\[
 D^j\psi=\Psi_j-e_j\chi.
\]

The exact residue EGF is

\[
 E(\tau)=\sum_{j\geq0}e_j{\tau^j\over j!}
 =3(1-e^{2\tau})
   \exp\!\left({5\tau\over2}-{3\over2}(e^{2\tau}-1)\right). \tag{9}
\]

Therefore the raw-feature EGF is

\[
 \mathcal P(h,\tau)
 :=\sum_{j\geq0}\Psi_j(h){\tau^j\over j!}
 =\psi(h+\tau)+E(\tau)\chi(h).                    \tag{10}
\]

Put

\[
 D_\epsilon(h)=\chi(-h)-\epsilon\chi(h),
 \qquad \epsilon\in\{+1,-1\},                    \tag{11}
\]

and form the full mixed-parity determinant EGF

\[
 \mathcal\Omega(h,\tau)
 =\chi(-h)\mathcal P(h,\tau)
  -\chi(h)\mathcal P(-h,\tau).                    \tag{12}
\]

The two residue terms cancel before any division.  Since `psi` is even,

\[
 \boxed{\mathcal\Omega(h,\tau)
 =\chi(-h)\psi(h+\tau)-\chi(h)\psi(h-\tau).}      \tag{13}
\]

For the derivative symbol, linearity and the Appell rule give

\[
 \sum_{j\geq0}\Psi_{(z^j)'}(h){\tau^j\over j!}
 =\tau\mathcal P(h,\tau).
\]

Taking the same modular determinant proves (3) directly.  In coefficient
language this is simply the exact identity

\[
 \Delta_a=\Omega_{a'},                             \tag{14}
\]

but (3) records simultaneously every grade and the exact residue-drift
cancellation.

To expose the parity domains, let the subscript `epsilon=+1` mean the even
part in `tau` and `epsilon=-1` the odd part.  Define

\[
 \mathcal U_\epsilon(h,\tau)
 ={\psi(h+\tau)+\epsilon\psi(h-\tau)\over2}.       \tag{15}
\]

Parity projection of (13) and (3) gives

\[
 \boxed{
 \begin{aligned}
  \mathcal\Omega_\epsilon
    &=D_\epsilon\mathcal U_\epsilon,\\
  \mathcal J_\epsilon
    &={\tau\over2}
      \{\psi(h+\tau)-\epsilon\psi(h-\tau)\}
      =\tau\mathcal U_{-\epsilon},\\
  \mathcal\Delta_\epsilon
    &=\tau\mathcal\Omega_{-\epsilon}
      =D_{-\epsilon}\mathcal J_\epsilon.
 \end{aligned}}                                    \tag{16}
\]

Here `D_(-1)=q>0` on the closed half-line and `D_(+1)=2q'>0` on `h>0`.
At `h=0`, `D_(+1)=0`; equations (13) and (16) are the division-free
statements, and the corresponding quotient is read by its analytic
removable limit.  Thus no conclusion below divides through the modular
center.

For a polynomial of parity `epsilon`, applying `a(\partial_\tau)` at zero to
the appropriate line of (16) recovers exactly

\[
 U_a={\Omega_a\over D_\epsilon},
 \qquad J_a={\Delta_a\over D_{-\epsilon}}.         \tag{17}
\]

Equations (15)--(17) show that modular reflection neither enlarges nor
shrinks the admissible graph: it gives a domain-controlled realization of
the same translation--shear jets.

## 3. The actual pointwise graph contains the negative cone

Fix `h_0>0`.  The complete theta profile is positive and strictly decreasing
on the positive half-line, so

\[
 \psi(h_0)>0,
 \qquad \psi'(h_0)<0.                              \tag{18}
\]

Consider only even symbols of degree at most two,
`a(z)=alpha+beta z^2`.  At `h_0`,

\[
 \binom{U_a}{J_a}
 =
 \begin{pmatrix}
   \psi&\psi''\\
   0&2\psi'
 \end{pmatrix}_{h=h_0}
 \binom{\alpha}{\beta}.                           \tag{19}
\]

The determinant in (19) is

\[
 2\psi(h_0)\psi'(h_0)<0.                          \tag{20}
\]

Hence

\[
 \boxed{\{(U_a(h_0),J_a(h_0)):a\text{ even},\deg a\leq2\}
       =\mathbb R^2.}                              \tag{21}
\]

This is a complete-theta statement.  It uses the same polynomial in both
channels and does not replace either channel by a free auxiliary function.
In particular there can be no nontrivial universal pointwise algebraic
constraint on `(U,J)` in the even ladder.

The local signed density is

\[
 \rho_h[U,J]=4h^2U^2+4hUJ=4hU(hU+J).              \tag{22}
\]

Choose in (19)

\[
 \beta=-{h_0\over\psi'(h_0)},
 \qquad
 \alpha={1-\beta\psi''(h_0)\over\psi(h_0)}.      \tag{23}
\]

Then the genuine even polynomial `a(z)=alpha+beta z^2` satisfies

\[
 U_a(h_0)=1,
 \qquad J_a(h_0)=-2h_0,
 \qquad\boxed{\rho_{h_0}[U_a,J_a]=-4h_0^2<0.}     \tag{24}
\]

By continuity, the same fixed polynomial has negative density on a
nonempty interval about `h_0`.

There is an equally direct odd-ladder obstruction at the modular center.
Strict log-concavity and evenness give, with

\[
 \psi_0=\psi(0)>0,
 \qquad \psi_2=\psi''(0)<0,
\]

the Taylor expansions

\[
 \psi(h)=\psi_0+{\psi_2\over2}h^2+O(h^4),
 \qquad
 \psi'(h)=\psi_2h+O(h^3).                         \tag{25}
\]

For the actual odd polynomial `a(z)=z`, one has `U_a=psi'` and `J_a=psi`.
Thus

\[
 \boxed{
 \rho_h[U_z,J_z]
 =4h\psi'(h)\{h\psi'(h)+\psi(h)\}
 =4\psi_0\psi_2h^2+O(h^4)<0}                     \tag{26}
\]

for every sufficiently small `h>0`.  Formula (26) is evaluated in the
corrected feature itself and therefore crosses no `D_(+1)=0` quotient.

As an even center check, put

\[
 \kappa=-{\psi_2\over\psi_0}>0,
 \qquad a(z)=1+{z^2\over2\kappa}.
\]

Then direct substitution into (22) gives

\[
 \rho_h[U_a,J_a]=-\psi_0^2h^2+O(h^4)<0            \tag{27}
\]

near the center.  Thus both parity ladders contain actual local negative
directions even without tailoring a symbol to an arbitrary `h_0`.

Equations (21), (24), and (26) close the specific loophole in the preceding
independent-channel determinant calculation: restricting to a single
polynomial's exact theta graph does not make the spatial density pointwise
positive.

## 4. What remains of the graph after spatial integration

The obstruction above is local.  The coefficients of `a` are nevertheless
fixed globally, so it does not follow that the integral of (22) is negative.
The exact global content of the graph can be displayed on the Fourier line.

Use

\[
 \widehat f(t)=\int_{\mathbb R}f(h)e^{-ith}\,dh,
 \qquad \Phi(t)=\widehat\psi(t)=2\Xi(t),           \tag{28}
\]

and put

\[
 m(t)=a(it),
 \qquad M(t)=|m(t)|^2.
\]

For a real fixed-parity polynomial, `M` is a real even polynomial.  The
division-free Fourier graph is

\[
 \widehat U_a=m\Phi,
 \qquad
 \widehat J_a=a'(it)\Phi=-i m'\Phi.               \tag{29}
\]

For

\[
 X a=2hU_a+J_a,
 \qquad Ya=J_a,
\]

the commutator terms combine, without being discarded, as

\[
 \widehat{Xa}=i\{2m\Phi'+m'\Phi\},
 \qquad
 \widehat{Ya}=-im'\Phi.                           \tag{30}
\]

Therefore

\[
 |\widehat{Xa}|^2-|\widehat{Ya}|^2
 =4M(\Phi')^2+2M'\Phi\Phi'
 =4M(\Phi')^2+M'(\Phi^2)'.                        \tag{31}
\]

All functions involving `Phi` are rapidly decreasing, so the following
integrations by parts have no boundary term.  Since `Xa` and `Ya` have fixed
parity, half-line Plancherel and (31) give

\[
\begin{aligned}
 Q[a]
 &:=\|Xa\|_{L^2(0,\infty)}^2-\|Ya\|_{L^2(0,\infty)}^2\\
 &= {1\over4\pi}\int_{\mathbb R}
    \{4M(\Phi')^2-M''\Phi^2\}\,dt\\
 &=\boxed{{1\over2\pi}\int_{\mathbb R}
    M(t)\{(\Phi')^2-\Phi\Phi''\}\,dt}.           \tag{32}
\end{aligned}
\]

Equivalently, with the actual Xi Laguerre density

\[
 f(t)=\Xi'(t)^2-\Xi(t)\Xi''(t),
\]

equation (32) is

\[
 \boxed{Q[a]={2\over\pi}\int_{\mathbb R}
       |a(it)|^2 f(t)\,dt.}                        \tag{33}
\]

Thus imposing the exact global Appell graph and integrating does not produce
a new positive conditional variance.  It reproduces the original signed
target functional exactly.  In particular, applying (33) to the Galerkin
residual `pi` from `PARALLEL_TRACE_MODULAR_NEXT.md` gives the same unresolved
quantity

\[
 g-C_{XY}=Q[\pi].                                  \tag{34}
\]

Using positivity of (32) or (33) to justify the desired shorting would
therefore assume the sign that the shorting argument was meant to prove.

## 5. Consequence for a viable continuation

The exact admissible graph supplies two facts, not a sign theorem.

1. Locally, the graph has enough freedom to attain the negative cone of the
   signed `(U,J)` density.  Pointwise shorting, pointwise Cholesky, or a
   pointwise conditional-variance interpretation cannot work, even after
   exact modular reflection.
2. Globally, the common polynomial coefficients impose the Appell relation
   (7)--(8).  Retaining it exactly yields (32)--(33), which is the original
   theta/Xi signed form rather than an independently positive parent.

A noncircular continuation must therefore use additional information about
the *particular Galerkin residual* `pi` across spatial regions: for example,
an exact core--tail compensation, a regression orthogonality that couples
the negative center to a positive reserve, or complete-theta orbit
arithmetic beyond the universal polynomial graph.  It cannot be obtained
from positivity of the modular denominators, the EGF relation
`Delta=tau Omega`, or the formal Weyl relation alone.

## Nonclaims

- The local negative examples do not show that their integrated `Q[a]` is
  negative.  Cross-region compensation is precisely what a successful
  proof would have to exploit.
- Equations (24), (26), and (27) are not counterexamples to an established
  finite positive prefix and are not counterexamples to RH.
- The Fourier identity (33) does not assert a sign for `f`; it shows that
  the graph-restricted integrated question is the existing signed target.
- No finite-degree trend, truncation, or numerical approximation is used to
  infer an all-degree statement.
- No division through the vanishing center denominator `D_(+1)` is used.
