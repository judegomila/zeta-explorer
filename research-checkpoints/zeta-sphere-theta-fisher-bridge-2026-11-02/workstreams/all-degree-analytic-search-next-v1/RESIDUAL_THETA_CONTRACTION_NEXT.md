# Residual-dependent theta contractions and the assembled Ewald defect

## Scope and outcome

`TURAN_ARITHMETIC_FACTOR_NEXT.md` proves that a degree-independent
translation-intertwining contraction between the complete positive and
negative theta channels is equivalent to the still-open first Xi Laguerre
sign.  This note asks the narrower question left open there: what is the exact
contraction problem on one old prefix and its one actual Galerkin extension?

There are four conclusions.

1. The one-rung problem has a canonical defect-space factorization.  Its
   prescribed extension is contractive exactly when one positive-channel
   innovation dominates one *joint* old-defect lift.  No separate bound on a
   mismatch vector or an inverse old metric occurs.
2. The actual signed Galerkin residual has an explicit Julia-operator lift.
   Both of its channel images are obtained from the same old contraction
   resolvent.  This gives a second derivation of the paid Schur scalar and
   fixes every inverse, range, and normalization factor.
3. The remaining contraction margin is exactly eight times the fully
   assembled Ewald scalar of the actual residual.  The harmonic-weighted and
   Abel-path compensations therefore survive unchanged inside the
   defect-space formulation; cellwise positivity is not required.
4. A damped Abel lemma gives a genuinely weaker sufficient route than
   pointwise positivity of the Abel derivative.  It allows negative Abel
   derivative after previously accumulated positive reserve.  Proving its
   hypotheses for the complete-theta residual is the new arithmetic task;
   they do not follow from self-duality or Schwartz decay alone.

The factorization is exact but does not sign its defect.  No new Xi pivot,
first Laguerre inequality, all-degree positivity theorem, or RH result is
claimed.

## 1. The finite-rung channel contraction

Retain the complete channels of `TURAN_ARITHMETIC_FACTOR_NEXT.md`,

\[
 \mathbf A p=
 \binom{p(D)(2h\psi)}{p(D)((1+h^2)\psi)},
 \qquad Bp=p(D)((1-h^2)\psi),                    \tag{1}
\]

on one fixed parity ladder.  Their exact normalization is

\[
 \boxed{
 \delta(p,q):=
 \langle\mathbf A p,\mathbf A q\rangle
 -\langle Bp,Bq\rangle
 =8\mathfrak q(p,q).}                            \tag{2}
\]

Let `V` be a finite old polynomial prefix and assume

\[
 \delta(q,q)>0\qquad(0\ne q\in V).               \tag{3}
\]

Put `M=mathbf A V`.  The map

\[
 C(\mathbf A q)=Bq\qquad(q\in V)                 \tag{4}
\]

is well defined and is a strict contraction on the finite-dimensional space
`M`.  Indeed, (3) first makes `mathbf A` injective on `V`, and then gives
`||C||<1`.  Define the invertible defect operators

\[
 D_C=(I_{\mathcal M}-C^*C)^{1/2},\qquad
 D_{C^*}=(I-CC^*)^{1/2}.                         \tag{5}
\]

Adjoin a polynomial `p` outside `V`.  Let `q_+ in V` be its positive-channel
regression and set

\[
 \phi=p-q_+,\qquad
 x_\perp=\mathbf A\phi\perp\mathcal M,\qquad
 z=B\phi=Bp-C(\mathbf A q_+).                    \tag{6}
\]

The prescribed one-rung extension must be

\[
 \widetilde C(m+\alpha x_\perp)=Cm+\alpha z,
 \qquad m\in\mathcal M.                          \tag{7}
\]

Since the two domain summands in (7) are orthogonal,

\[
 I-\widetilde C\widetilde C^*
 =D_{C^*}^2-{z\otimes z\over\|x_\perp\|^2}.
\]

Conjugating by `D_(C*)^(-1)` gives the exact rank-one criterion

\[
 \boxed{
 \widetilde C\text{ is contractive}
 \quad\Longleftrightarrow\quad
 \|D_{C^*}^{-1}z\|^2\leq\|x_\perp\|^2.}         \tag{8}
\]

This is a directional statement on `V+span{p}`, not a contraction on a full
cyclic parity range.  It may depend on the rung and on the actual residual,
and it need not intertwine translation.  It is therefore genuinely weaker
in scope than the universal contraction classified in the preceding note.
Its scalar condition is nevertheless the exact next pivot, not an
independent proof of that pivot.

## 2. The actual residual is a Julia-defect lift

Let `pi=phi+w`, with `w in V`, be the monic residual orthogonal to `V` in the
*signed* metric:

\[
 \delta(q,\pi)=0\qquad(q\in V).                  \tag{9}
\]

Writing `m=mathbf A w in M`, equations (4), (6), and the orthogonality of
`x_perp` to `M` turn (9) into

\[
 D_C^2m=C^*z.                                    \tag{10}
\]

The standard defect resolvent identities

\[
 D_C^{-2}C^*=C^*D_{C^*}^{-2},\qquad
 I+CD_C^{-2}C^*=D_{C^*}^{-2}                     \tag{11}
\]

then give both actual channel images without any separate estimate:

\[
 \boxed{
 \begin{aligned}
 \mathbf A\pi&=x_\perp+C^*D_{C^*}^{-2}z,\\
 B\pi&=D_{C^*}^{-2}z.
 \end{aligned}}                                  \tag{12}
\]

Thus the actual Galerkin correction is the canonical Julia-defect lift of
the positive-channel innovation.  In particular, it is amplified in every
near-unit singular direction of `C`, in agreement with the sampling
resolvent in `ACTUAL_RESIDUAL_ALIGNMENT_NEXT.md`.

Subtracting the two norms in (12), using `x_perp perp M`, yields

\[
 \boxed{
 \delta[\pi]
 =\|x_\perp\|^2-\|D_{C^*}^{-1}z\|^2.}           \tag{13}
\]

Equations (8) and (13) also show that the same prescribed extension maps the
actual channel vector correctly:

\[
 \widetilde C(\mathbf A\pi)=B\pi.
\]

Hence a contractive one-rung extension exists exactly when the actual next
signed Galerkin pivot is nonnegative.

### Coordinate and range audit

Choose any basis of `V` and write

\[
 G_+=(\langle\mathbf A q_i,\mathbf A q_j\rangle),\qquad
 G_-=(\langle Bq_i,Bq_j\rangle),\qquad
 Q=G_+-G_->0,                                    \tag{14}
\]

\[
 s_i=\langle Bq_i,z\rangle.                      \tag{15}
\]

In this note `Q` is the Gram of `delta=8 mathfrak q`.  It is therefore eight
times the old `mathfrak q` Gram and four times the matrix
`G_X-G_Y=2A_old` denoted by `Q` in `PAID_SCHUR_NEXT.md`.  This local notation
keeps the channel identity (2) literal; the conversion factor must be retained
when comparing the two coordinate systems.

The Woodbury defect identity is

\[
 \boxed{
 \|D_{C^*}^{-1}z\|^2
 =\|z\|^2+s^*Q^{-1}s.}                           \tag{16}
\]

All inverses in (10)--(16) are legitimate under (3): `D_C` and `Q` are
strictly positive, while `D_(C*)` is boundedly invertible on the whole
negative-channel Hilbert space because `||C||<1`.  Substitution into (13)
gives

\[
 \delta[\pi]
 =\|\mathbf A\phi\|^2-\|B\phi\|^2-s^*Q^{-1}s,  \tag{17}
\]

which is the positive-parent/full-feedback scalar, now derived independently
from the prescribed contraction.  In the chosen basis, the coefficient
vector of the correction `w` in (9) is `Q^{-1}s`; dropping it or replacing
`Q` by either positive channel Gram changes the actual residual.

## 3. Exact crosswalk to all-index Ewald compensation

The residual `pi` in (9) is the globally corrected residual `p-q_A` used in
`EWALD_WEIGHTED_PIVOT_NEXT.md`.  Its correlation source satisfies

\[
 J_\pi\in\mathcal S(\mathbb R),\qquad
 \widehat J_\pi=J_\pi,\qquad J_\pi(0)=0.          \tag{18}
\]

Set

\[
 a_k=kJ_\pi(k),\quad
 \Delta a_k=a_k-a_{k+1},\quad
 H_k=\sum_{j=1}^k{1\over j},\quad
 W_k=(k+1)H_k-k.                                  \tag{19}
\]

Also retain the left-cell Ewald errors

\[
 e_n(\pi)=J_\pi(n)-\int_{n-1}^nJ_\pi(x)\,dx,    \tag{20}
\]

and their Abel path

\[
 \mathcal S_\pi(z)=\sum_{n\geq1}e_n(\pi)z^n,
 \qquad
 \mathcal A_\pi(z)=\mathcal S_\pi'(z).          \tag{21}
\]

The seam-free Ewald bounds make (21) smooth through `z=1`.  Combining the
channel normalization (2), the defect factorization (13), and the three
audited Ewald forms gives one exact identity:

\[
 \boxed{
 \begin{aligned}
 \|x_\perp\|^2-\|D_{C^*}^{-1}z\|^2
 &=8\mathfrak q[\pi]\\
 &=8\sum_{m\geq1}J_\pi(m)\\
 &=8\sum_{k\geq1}W_k\Delta^2a_k\\
 &=8\mathcal S_\pi(1)
  =8\int_0^1\mathcal A_\pi(z)\,dz.
 \end{aligned}}                                  \tag{22}
\]

Equation (22) is the desired non-translation-invariant crosswalk.  It does
not require any Ewald cell, second difference, or Abel derivative to be
positive.  It requires only their complete signed compensation after the
old contraction defect and the actual Galerkin correction have both been
formed.  In particular, applying the Ewald decomposition to `phi` instead of
`pi`, or estimating `z` and `D_(C*)^(-1)` separately, no longer computes the
left side of (22).

## 4. A signed Abel criterion weaker than pointwise Abel monotonicity

There is a concrete theorem-shaped way to exploit the last equality in (22)
without asking for `A_pi(z)>=0` pointwise.

**Damped Abel lemma.**  Let `0<=z_0<1`.  Suppose a real function `S` is
absolutely continuous on `[z_0,1]`, `lambda in L1([z_0,1])` is real, and

\[
 S(z_0)\geq0,\qquad
 S'(z)+\lambda(z)S(z)\geq0
 \quad\text{for a.e. }z\in[z_0,1].               \tag{23}
\]

Then `S(1)>=0`.

Indeed, with

\[
 \mu(z)=\exp\!\left(\int_{z_0}^z\lambda(u)\,du\right)>0,
\]

one has `(mu S)'=mu(S'+lambda S)>=0`, so
`mu(1)S(1)>=S(z_0)>=0`.

Applied to `S=mathcal S_pi`, (23) is a residual- and degree-dependent
sufficient condition for the contraction (8).  It permits signed
compensation: for example,

\[
 S(z)=ze^{-2z},\qquad \lambda(z)=2
\]

satisfies `S'+lambda S=e^(-2z)>0`, although `S'(z)<0` for `z>1/2`.
Thus (23) is strictly weaker than pointwise nonnegativity of the Abel
derivative.  Taking `z_0>0` also permits negative early cells, provided an
assembled analytic argument first establishes the seed `S(z_0)>=0`.

A noncircular use of this lemma must construct `z_0` and `lambda` from the
complete theta/Euler source and prove both inequalities in (23) without using
the unknown endpoint sign.  Choosing `lambda=-S'/S` only after assuming
`S>0` would merely restate the target.  Likewise, a finite sample check of
the seed is not an all-index proof: `S(z_0)` is the complete Abel correlation
built from the Euler-renormalized source

\[
 D(z,s)=\operatorname {Li}_s(z)
 -{1-z\over1-s}\operatorname {Li}_{s-1}(z),
 \quad 0\leq z<1,\quad0<\operatorname {Re}s<1.   \tag{24}
\]

The finite-coordinate interpolation theorem in
`EWALD_WEIGHTED_PIVOT_NEXT.md` shows that self-duality, Schwartz decay,
`J(0)=0`, and finitely many cells cannot imply (23): those generic data allow
the endpoint scalar to have either sign.  Any successful damping must use
additional complete-theta arithmetic.

## 5. The exact next lemma and route boundaries

Assume the old prefix (3) is positive.  A genuinely new one-step theorem
would be the following source-specific statement.

> For the actual residual `pi` produced by (9)--(12), construct directly from
> the Euler-renormalized complete-theta source a number `z_0 in [0,1)` and an
> integrable real `lambda_pi` such that
> `S_pi(z_0)>=0` and
> `A_pi+lambda_pi S_pi>=0` almost everywhere on `[z_0,1]`.

By (22)--(23), that statement gives the next contractive extension while
allowing signed cells and a negative Abel derivative.  Repeating it by
parity and rung would be an induction mechanism, but no such construction is
proved here.

The exact classifications are:

- A contraction only on the line `span{mathbf A pi}` is insufficient because
  it ignores compatibility with the old channel map.  The defect lift in
  (8) is the complete compatibility condition.
- The innovation inequality `||B phi||<=||mathbf A phi||` drops the positive
  feedback `s^*Q^(-1)s` in (16) and is necessary but not sufficient.
- A coherent degree-independent extension on a full derivative-cyclic parity
  range returns to the universal first-Laguerre sign.  The escape in this
  note is precisely rung dependence or broken translation invariance.
- Pointwise fractional placement, termwise Ewald positivity, and sample
  convexity remain valid sufficient conditions but are strictly stronger
  than the scalar compensation in (22).
- The damped Abel lemma is not a hidden finite certificate.  Its seed and
  differential inequality must be proved for the infinite assembled theta
  path with the actual mismatch retained.

## Independent checks

The defect identities were checked in two independent ways.

1. The operator derivation (10)--(13) uses only the two resolvent identities
   in (11).  The coordinate derivation (14)--(17) independently applies the
   Woodbury identity and reproduces the same feedback scalar with the same
   sign.
2. An exact-rational `3 by 2` matrix replay, with

   \[
   C=\begin{pmatrix}1/3&1/5\\1/7&1/4\\1/6&-1/8\end{pmatrix},
   \qquad z=(2/7,-1/9,1/10)^T,
   \]

   verified
   `m=C^*(I-CC^*)^(-1)z`,
   `z+Cm=(I-CC^*)^(-1)z`, both norm-difference derivations in (13),
   and the Woodbury equality (16).  The exact defect payment was
   `212623849/1837207575`.
3. Differentiating the integrating factor in (23) is an independent scalar
   check of the Abel implication; the displayed `ze^(-2z)` example confirms
   that it genuinely permits a negative derivative.

These checks validate the algebra and normalization only.  They are not
evidence for the missing complete-theta inequality.

## Nonclaims

- The existence of the contraction in (8) is equivalent to the one next
  pivot, not a proof of it.
- The Julia-defect formulas do not bound a near-unit old sampling direction;
  they preserve its full amplification.
- Equation (22) does not make the Ewald cells or the Abel derivative positive.
- The damped Abel criterion is proposed as a source-specific next lemma; its
  hypotheses have not been established for Xi.
- No finite matrix, finite cell family, or finite degree calculation proves
  an all-degree sign or RH.
