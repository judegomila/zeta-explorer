# Fixed-width score projections and the finite-Gram escape

## Scope and outcome

This note separates three statements that can otherwise look deceptively
similar.

1. A finite correlated score space has an exact, noncircular projection
   criterion for the signed Sobolev pivot.
2. The actual three-term residual recurrence gives an exact **operator**
   recurrence on two consecutive rungs.  In this sense the vectors do close.
3. If one instead asks for a fixed finite **scalar feature span**, or for the
   corresponding fixed finite Gram matrix to be the complete state, the top
   multiplication layer escapes at every step.  The operator `M=t^2` creates
   a new feature and hence new inner products.

Only the third statement is an obstruction.  It does not rule out a
theta-specific inequality for a fixed-width projection, direct evaluation of
that projection at every rung, or an induction which controls `M` by new
complete-theta arithmetic.  The actual degree-ten failure of the
two-generator auxiliary shows that its discarded reserve is material; it does
not show that every finite enlargement fails.

No all-degree theta pivot, first Xi--Laguerre inequality, or RH conclusion is
claimed.

## 1. Exact formula for an arbitrary polynomial score space

Let `W` be a nonzero real `C^1` Schwartz function, let `q` be a nonzero real
polynomial, and put

\[
 a=q'W,\qquad s=-q'W-2qW',\qquad A=\|a\|_2^2.    \tag{1}
\]

For linearly independent real polynomials `p_1,...,p_m`, define

\[
 V=\operatorname {span}\{p_1W,\ldots,p_mW\},
 \quad G_{ij}=\int p_ip_jW^2,
 \quad b_i=\int qp_i'W^2.                         \tag{2}
\]

The Gram matrix is positive definite.  Integration by parts, with no boundary
term, gives the division-free identity

\[
 \boxed{\langle s,p_iW\rangle=b_i.}              \tag{3}
\]

Indeed, (3) is just the integral of `(qp_iW^2)'` rearranged.  Therefore the
finite-score auxiliary and its exact reserve are

\[
 \boxed{
 4\mathcal H_V=b^TG^{-1}b-A
 =\|P_Vs\|_2^2-\|a\|_2^2,}                       \tag{4}
\]

\[
 \boxed{
 2\pi\mathcal S[q]-\mathcal H_V
 ={1\over4}\|(I-P_V)s\|_2^2\geq0,}              \tag{5}
\]

where the signed Sobolev identity is

\[
 8\pi\mathcal S[q]=\|s\|_2^2-\|a\|_2^2.         \tag{6}
\]

Thus `H_V>=0` is a sufficient condition which uses only the old polynomial
features and the positive `W^2` metric.  Enlarging `V` can only increase
`H_V`, and the gain must be calculated in the joint inverse Gram metric.

The gain from one proposed polynomial feature `pW` is especially explicit.
Let

\[
 g_i=\langle p_iW,pW\rangle,\quad
 d=\|pW\|_2^2-g^TG^{-1}g,
 \quad
 \eta=\int qp'W^2-g^TG^{-1}b.                   \tag{4a}
\]

If `pW` is not already in `V`, then `d>0`, and the block inverse (equivalently,
one Gram--Schmidt step) gives

\[
 \boxed{
 \mathcal H_{V+\operatorname {span}\{pW\}}
 =\mathcal H_V+{\eta^2\over4d}.}                \tag{4b}
\]

Thus, when `H_V<0`, a single direction repairs the auxiliary exactly when its
score innovation satisfies `eta^2> -4d H_V`.  Formula (4b) is constructive at
one rung, but by itself provides no uniform lower bound on the innovation-to-
Schur ratio.

For the score form, normalize

\[
 d\nu={q^2W^2\over C}dt,\quad C=\int q^2W^2,
 \quad X={q'\over q},\quad L={W'\over W},
 \quad Z=L+{X\over2}.                             \tag{7}
\]

Let `U=span{p_i/q}` in `L^2(nu)`.  The apparent quotients are harmless after
multiplication by `q^2W^2`.  Then

\[
 {\mathcal H_V\over C}
 =\|P_UZ\|_\nu^2-{\|X\|_\nu^2\over4}.           \tag{8}
\]

If `q'` belongs to `span{p_i}`, then `X` belongs to `U` and (5) is

\[
 2\pi\mathcal S[q]-\mathcal H_V
 =C\|(I-P_U)L\|_\nu^2.                           \tag{9}
\]

Equation (9) measures exactly how much score reserve remains outside a chosen
finite space.

## 2. What source-free projection geometry cannot prove

Let `U` be a proper closed Hilbert subspace containing a nonzero vector `X`.
Choose nonzero `v` perpendicular to `U` and set `Z=lambda*v`, with
`lambda*||v||>||X||/2`.  Then

\[
 \|Z\|^2-{\|X\|^2\over4}>0,
 \qquad
 \|P_UZ\|^2-{\|X\|^2\over4}<0.                 \tag{10}
\]

This is deliberately only an abstract Hilbert-space observation.  It does
not assert that an arbitrary `(X,Z)` is realized by a polynomial residual and
a Schwartz profile, still less by the complete theta source.  It says exactly
that target positivity and finite-dimensional geometry alone cannot return
the orthogonal term in (5).  A successful fixed-width proof needs an
additional source-specific angle or margin inequality.

The rigorously replayed complete-theta case `(N,epsilon)=(5,0)` realizes this
separation for `V=span{q'W,tqW}`: the signed target pivot is positive while
`H_V<0`.  That computation is a falsifier of this one proposed auxiliary,
not a generic fixed-width theorem.

The companion bounded calculation in `ENLARGED_SCORE_PROJECTION_NEXT.md`
also proves why a blanket fixed-width obstruction would be false.  In the
same half-line positive-moment normalization, the degree-ten baseline is
about `-1.019e14`, while adding the single direction `t^2q'W` gives

\[
 \mathcal H_{\operatorname {span}\{q'W,tqW,t^2q'W\}}
 \in[6.3933727580,6.3954807774]\times10^{13}>0. \tag{10a}
\]

The one-feature Schur identity (4b) certifies the gain.  Equation (10a) is a
complete-orbit finite-rung result and a route selector only; it supplies no
uniform lower bound.  It demonstrates that the obstruction below must concern
finite-Gram **propagation**, not the ability of a fixed-width space to work at
an individual actual theta rung.

## 3. The operator recurrence really does close

Let the actual monic same-parity residuals satisfy

\[
 q_{r+1}=(t^2-\alpha_r)q_r-\beta_rq_{r-1}.       \tag{11}
\]

With `M` denoting multiplication by `t^2` and

\[
 a_r=q_r'W,\qquad b_r=tq_rW,\qquad
 s_r=-q_r'W-2q_rW',                              \tag{12}
\]

direct differentiation gives

\[
\boxed{
\begin{aligned}
a_{r+1}&=(M-\alpha_r)a_r+2b_r-\beta_ra_{r-1},\\
b_{r+1}&=(M-\alpha_r)b_r-\beta_rb_{r-1},\\
s_{r+1}&=(M-\alpha_r)s_r-2b_r-\beta_rs_{r-1}.
\end{aligned}}                                   \tag{13}
\]

No backward term is omitted.  Formula (13) is an exact two-rung operator
recurrence.  Calling it nonclosed would be false.  The narrower issue is that
`M` is an operator on the ambient function space, not a scalar matrix acting
inside the fixed feature span used by a finite Gram certificate.

## 4. Exact escape from a bounded multiplication band

Fix `R>=0` and retain the scalar feature space

\[
 E_R(r)=\operatorname {span}\{M^ja_r,M^jb_r,
       M^ja_{r-1},M^jb_{r-1}:0\leq j\leq R\}.    \tag{14}
\]

Multiplying the second recurrence in (13) by `M^R` gives

\[
 M^Rb_{r+1}
 =M^{R+1}b_r-\alpha_rM^Rb_r-\beta_rM^Rb_{r-1}.  \tag{15}
\]

If `deg q_r=k`, the polynomial multiplier of the first term in (15) has
degree `k+2R+3`.  Every multiplier in (14) has degree at most
`k+2R+1`; the prior residual is two degrees lower.  Since `W` is nonzero on a
set of positive measure, distinct polynomial degrees cannot become linearly
dependent after multiplication by `W`.  Hence

\[
 \boxed{M^{R+1}b_r\notin E_R(r),
 \qquad M^Rb_{r+1}\notin E_R(r).}                \tag{16}
\]

The corresponding Gram entries involving `M^(R+1)b_r` are therefore not
entries of the old fixed Gram matrix.  Equation (16) does **not** say that
they are unknowable: complete-theta identities may determine or bound them.
It says only that exact scalar-span propagation creates new data.

## 5. The same escape for any fixed differential dictionary

The bounded-band statement has a useful invariant form.  Let

\[
 T_i=\sum_{j=0}^{d_i}p_{ij}(t)D^j,
 \qquad p_{ij}\in\mathbb R[t],\quad 1\leq i\leq m \tag{17}
\]

be a fixed finite family of nonzero polynomial differential operators.  This
includes every fixed finite collection of multiplication and derivative
words.  Define the effective degree shift

\[
 \delta(T)=\max_j\{\deg p_j-j:p_j\ne0\}.         \tag{18}
\]

On `t^k`, the coefficient at degree `k+delta(T)` is

\[
 \sigma_T(k)=
 \sum_{\deg p_j-j=\delta(T)}
       \operatorname {lc}(p_j)(k)_j.             \tag{19}
\]

The falling factorials `(k)_j` are linearly independent, so `sigma_T` is a
nonzero polynomial.  Apart from finitely many exceptional low degrees,

\[
 \deg(Tq)=\deg q+\delta(T)                       \tag{20}
\]

for a monic polynomial `q`.

Let `delta_*` be the largest shift in the dictionary and choose `T_*` which
attains it.  Define the old scalar feature space

\[
 \mathcal E_r=\operatorname {span}\{T_iq_rW,T_iq_{r-1}W:
                                      1\leq i\leq m\}.       \tag{21}
\]

For all sufficiently large `k=deg q_r`,

\[
 \deg(T_*q_{r+1})=k+2+\delta_*,
 \qquad
 \deg(T_iq_r)\leq k+\delta_*.                   \tag{22}
\]

The prior features are lower still.  Therefore

\[
 \boxed{T_*q_{r+1}W\notin\mathcal E_r.}          \tag{23}
\]

The same conclusion holds with any fixed finite number of prior residuals.
We record (23) as the precise obstruction:

> **Finite-Gram escape theorem.**  A fixed finite polynomial differential
> dictionary on the current and finitely many prior monic residuals is not
> closed under **scalar-span propagation** along a degree-two ladder.  Its
> highest-shift new feature eventually lies two polynomial degrees above the
> whole old span.

This theorem does not contradict the operator recurrence (13), because (13)
uses `M` to leave the old scalar span.  Nor does it prove that a fixed-width
theta inequality is impossible: such an inequality could control the new
Gram entries without expressing the new feature in the old span.

## 6. Consequence for the all-degree route

The theorem blocks only the finite-state scheme

\[
 \text{old fixed Gram matrix}
 \Longrightarrow
 \text{new fixed Gram matrix by scalar algebra and (13) alone}.             \tag{24}
\]

It leaves three honest analytic routes:

- prove a complete-theta angle or margin inequality for one fixed projection
  at every rung;
- let the multiplication tower grow and control the resulting hierarchy; or
- use a different signed-compensation mechanism which does not demand a
  positive finite-score auxiliary.

A finite enlargement may capture the degree-ten reserve and still not close
as a finite Gram state: applying the same highest layer at the next rung
produces (15) or (23).  Thus a successful degree-independent score space must
bring genuinely source-specific information, not merely exact recurrence.

## 7. Exact replay

The standard-library checker

```text
src/verify_fixed_width_gram_escape.py
```

uses exact integer polynomial arithmetic to replay the product rule behind
(3), all three recurrences in (13) in a formal two-component `W,W'` module,
the bounded-band escape (15)--(16), and the eventual degree-shift test
(18)--(23).  Its receipt is

```text
results/fixed_width_gram_escape.json
```

The replay checks algebra, not theta signs.  Finite trials are diagnostics for
the exact formulas and are not promoted to an all-degree proof.
