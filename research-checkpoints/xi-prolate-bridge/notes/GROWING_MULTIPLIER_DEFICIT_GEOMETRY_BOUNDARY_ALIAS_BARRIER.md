# Growing multiplier deficit-geometry boundary-alias barrier

## 0. Exact outcome and fail-closed boundary

Use the locked schedule and Fourier convention

\[
 \lambda={p\over2},\qquad L=2\log\lambda,\qquad
 I_L=[-L/2,L/2],\qquad
 \widehat f(t)=\int_{I_L}f(x)e^{-itx}\,dx .             \tag{0.1}
\]

The actual complete multiplier is

\[
 m_\lambda(t)=2\theta'(t)-2S_\lambda(t),\qquad
 S_\lambda(t)=\sum_{1<n\leq\lambda^2}
 {\Lambda(n)\over\sqrt n}\cos(t\log n).                \tag{0.2}
\]

The endpoint is inclusive and the prime block retains its source minus
sign.  This note tests whether pointwise deficit geometry can orient the
actual-multiplier Feshbach operator.  The answer is a sharp barrier.

The pinned PNT gives, uniformly for `z` in every fixed compact interval,

\[
 \boxed{m_\lambda(z/L)=-4\lambda\cos z+o(\lambda).}    \tag{0.3}
\]

The leading profile in (0.3) lies exactly at the boundary-alias scale for a
source interval of length `L`.  If `C_L` denotes zero extension from `I_L`,
then

\[
 \boxed{
 C_L^*\mathcal F^*M_{\cos(Lt)}\mathcal F C_L=0.}       \tag{0.4}
\]

More generally, every continuous `2*pi`-periodic symbol `q` satisfies

\[
 \boxed{
 C_L^*\mathcal F^*M_{q(Lt)}\mathcal F C_L
 ={1\over2\pi}\int_0^{2\pi}q(z)\,dz\ I.}             \tag{0.5}
\]

Consequently the positive and negative pieces of the leading profile each
compress to scalar operators of size `4*lambda/pi+o(lambda)`, while their
difference compresses exactly to zero.  Bernstein derivative bounds,
component counting, a thick-set uncertainty theorem, and fixed-symbol
Toeplitz asymptotics therefore split two `Theta(lambda)` terms whose
cancellation contains the desired sign.  They do not produce a positive
floor on the dangerous compression.

Keeping a nonnegative shift `U`, a split height `g>0`, and the exact parity
poles, the edge-profile model reduces to

\[
 \boxed{
 B_\epsilon^{\rm edge}
 =-U I+2\epsilon|p_\epsilon\rangle\langle p_\epsilon|,
 \qquad
 p_+(x)=\cosh(x/2),\quad p_-(x)=\sinh(x/2).}           \tag{0.6}
\]

Thus every finite captured space still leaves `-U` directions after the
pole direction is removed, provided the ambient dimension is larger by at
least two.  At `U=0` these directions have zero, not a strict positive
floor.  This is a countermodel to the proposed *geometry-only proof
methods*.  It is not the actual arithmetic operator and does not assert
that the genuine retained short is negative or singular.

The archimedean term makes the actual deficit integrable, and the
non-endpoint prime frequencies and signed PNT discrepancy break the exact
periodicity.  Those terms are not discarded: they are precisely the
unresolved orientation after the leading alias cancels.  The local
`o(lambda)` remainder in (0.3) is far too coarse to decide an `O(L)` or
constant-scale Feshbach margin.

No retained sign, complete parity sign, source-angle theorem, determinant
limit, zero statement, or Riemann-hypothesis conclusion is proved.  The
formal state remains `P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

The following exact repository bytes are used.

| Dependency | SHA-256 |
|---|---|
| `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` | `c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81` |
| `notes/PHASE_VOLUME_SCALE_AUDIT.md` | `bae7414fed2ac861ac3211175cd8f8b7743c33bd37379e186a71d700554b7fcd` |
| `notes/ANNULAR_GRAY_MASS_OBSTRUCTION.md` | `85e26feefbb18482eacd9761ecca4d3743c26ff480a53983bcc5651e3ae80b5a` |
| `notes/GROWING_MIXED_BRIDGE_ACTUAL_MULTIPLIER_DANGEROUS_FESHBACH_REDUCTION.md` | `cc2a62d6be1c62985ab9d5e2893c74c9ae773280f6bff4015f998364ccbd924e` |

The first note fixes the Fourier normalization, exact pole parity, and
weighted-concentration split.  The next two fix the PNT core asymptotic and
the finite-orbit claim boundary.  The last fixes the actual retained
Feshbach target.  No new external source is added.

## 2. The exact boundary-alias lemma

Let `q` be a continuous `2*pi`-periodic function and write

\[
 \bar q={1\over2\pi}\int_0^{2\pi}q(z)\,dz.             \tag{2.1}
\]

### Lemma 2.1 (critical periodic Wiener--Hopf collapse)

On `L^2(I_L)`, in the quadratic-form sense,

\[
 \boxed{
 W_{q,L}:=C_L^*\mathcal F^*M_{q(Lt)}\mathcal F C_L
 =\bar q I.}                                          \tag{2.2}
\]

**Proof.**  First take a trigonometric polynomial

\[
 q(z)=\sum_{|k|\leq K}q_ke^{ikz}.                     \tag{2.3}
\]

Plancherel and the translation rule give

\[
 \int_{\mathbb R}e^{ikLt}|\widehat f(t)|^2{dt\over2\pi}
 =\int_{\mathbb R}\overline{C_Lf(x)}C_Lf(x+kL)\,dx. \tag{2.4}
\]

For every nonzero integer `k`, the two supports in (2.4) are disjoint up to
a null endpoint.  Thus only `k=0` remains and `W_(q,L)=q_0 I`.
Fejer polynomials converge uniformly to a continuous periodic `q`; bounded
quadratic-form convergence proves (2.2).  `square`

In particular, take

\[
 m_{\rm edge}(t)=-4\lambda\cos(Lt).                   \tag{2.5}
\]

Its mean vanishes, so (2.2) proves (0.4).  This is not a small-norm
estimate: the compressed operator is exactly zero even though

\[
 \|m_{\rm edge}\|_\infty=4\lambda,
 \qquad \|m_{\rm edge}'\|_\infty=4\lambda L.          \tag{2.6}
\]

The source interval length and the multiplier oscillation are locked at the
same scale.  The inverse Fourier kernel is supported at translations
`+-L`, exactly where the two zero-extended source intervals cease to
overlap.

## 3. Exact deficit split and its scale

Put

\[
 \beta=g+U,
 \qquad
 v_\beta(t)=[\beta-m_{\rm edge}(t)]_+,
 \qquad
 a_\beta(t)=[m_{\rm edge}(t)-\beta]_+.               \tag{3.1}
\]

Assume `0<=beta<4*lambda` and define

\[
 r={\beta\over4\lambda},\qquad
 \alpha=\arccos(-r).                                  \tag{3.2}
\]

Both symbols in (3.1) are continuous and `2*pi/L`-periodic.  Direct
integration over one period gives

\[
 \boxed{
 \bar v_\beta={\beta\alpha+4\lambda\sin\alpha\over\pi},
 \qquad
 \bar a_\beta=\bar v_\beta-\beta.}                   \tag{3.3}
\]

Therefore Lemma 2.1 gives

\[
 T_{v_\beta}=\bar v_\beta I,
 \qquad T_{a_\beta}=\bar a_\beta I,                  \tag{3.4}
\]

and the exact shifted multiplier split is

\[
 \boxed{
 gI+T_{a_\beta}-T_{v_\beta}=-U I.}                   \tag{3.5}
\]

If `beta=o(lambda)`, then

\[
 \bar v_\beta={4\lambda\over\pi}+{\beta\over2}
       +O(\beta^2/\lambda),\qquad
 \bar a_\beta={4\lambda\over\pi}-{\beta\over2}
       +O(\beta^2/\lambda).                           \tag{3.6}
\]

Thus each side of the split has operator size `Theta(lambda)`, whereas
their difference is the exact scalar `-(g+U)` before the base `gI` is
restored.  On the project scale `g+U=O(L)`, an `o(lambda)` control of either
side cannot orient (3.5).

Moreover, whenever `bar(v_beta)>=g-delta`, the multiplier-dangerous
projector at threshold `g-delta` is the identity.  This happens eventually
for `g+U=O(L)` and any fixed `0<delta<g`.  A trace or phase-volume reduction
cannot create a safe block in this edge model.

## 4. Exact pole parity and the shift

The source pole restrictions are

\[
 P_\epsilon=2\epsilon
 |p_\epsilon\rangle\langle p_\epsilon|,
 \qquad \epsilon\in\{+1,-1\}.                        \tag{4.1}
\]

Their norms are

\[
 2\|p_+\|^2=\lambda-\lambda^{-1}+L,
 \qquad
 2\|p_-\|^2=\lambda-\lambda^{-1}-L.                  \tag{4.2}
\]

Adding (4.1) to (3.5) proves (0.6).  Let `S` be any finite captured space in
one parity sector.  If the ambient dimension is larger than
`dim(S)+1`, choose a unit vector

\[
 f\perp S,\qquad f\perp p_\epsilon.                   \tag{4.3}
\]

Then

\[
 \boxed{
 \langle f,B_\epsilon^{\rm edge}f\rangle=-U.}         \tag{4.4}
\]

For `U>0`, (4.4) is negative; for `U=0`, it is zero.  The positive even
pole can change only one direction.  The negative odd pole is retained
with its actual sign and makes its own pole direction still less favorable.
Subtracting a positive source-angle metric cannot improve (4.4).

This model does not satisfy the full arithmetic identities away from the
PNT edge profile.  Equation (4.4) is therefore not a counterexample to the
genuine retained sign.  It is an exact counterexample to any inference of a
strict floor from the leading deficit geometry plus a finite captured space
and the separate pole data.

## 5. Audit of the proposed time--frequency routes

### 5.1 Bernstein bounds and fragmentation

The edge model saturates the natural Bernstein scale in (2.6).  Its deficit
set in each period has length

\[
 {2\alpha\over L},                                    \tag{5.1}
\]

and the complementary positive set has length

\[
 {2(\pi-\alpha)\over L}.                              \tag{5.2}
\]

For `beta=o(lambda)`, both are `pi/L+o(1/L)`.  On `[-T,T]` the component
count is `TL/pi+O(1)`, which saturates the natural exponential-type count
`O(LT)`.  A derivative bound supplies the correct critical width but no
orientation of (3.5).

### 5.2 Nazarov and Logvinenko--Sereda

Both sets in (5.1)--(5.2) are relatively dense at scale `2*pi/L`.  In fact
Lemma 2.1 gives more than a generic uncertainty estimate: compression of
either periodic indicator is exactly its density times the identity.
Hence every source has exactly the same total Fourier mass fraction in
each periodic set.  Even this optimal observation statement leaves the two
weighted means in (3.3), whose difference is only `beta`.  Thickness alone
cannot choose its sign after the shift.

For the actual nonperiodic deficit, a Nazarov bound based only on its total
measure is weaker still: its exponential constant does not retain the
signed cancellation between `T_a` and `T_v`.

### 5.3 Toeplitz and Wiener--Hopf theory

Equation (2.2) is the exact finite Wiener--Hopf answer for the double-scaled
symbol `q(Lt)`.  Fixed-symbol Szego or Garding asymptotics do not apply
uniformly when the symbol oscillation scale moves with the interval length.
At the locked scale the entire nonconstant periodic symbol aliases to the
boundary and disappears.  A successful Wiener--Hopf argument must therefore
factor the nonperiodic arithmetic remainder, not the leading point symbol.

### 5.4 Diagonal dominance

The complete edge compression is zero in every orthonormal basis.  If the
positive and negative pieces are assembled separately, their diagonal
operators have size `4*lambda/pi+o(lambda)` and cancel by (3.5).  Entrywise
absolute values or row dominance destroy exactly the cancellation that must
be resolved.  The high-Fourier diagonal theorem remains valid for the
actual source matrix, but it does not orient the low dangerous Feshbach
operator.

## 6. What the archimedean term changes

The exact archimedean part is

\[
 h(t)=\operatorname {Re}\psi(1/4+it/2)-\log\pi.       \tag{6.1}
\]

For fixed `Z`, analyticity and evenness at zero give

\[
 h(z/L)=h(0)+O_Z(L^{-2}).                              \tag{6.2}
\]

Together with the pinned PNT and `g+U=O(L)=o(lambda)`, equations
(0.2) and (6.2) prove (0.3) and the local positive-part profiles

\[
 [g+U-m_\lambda(z/L)]_+
 =4\lambda[\cos z]_++o(\lambda),                     \tag{6.3}
\]

\[
 [m_\lambda(z/L)-g-U]_+
 =4\lambda[-\cos z]_++o(\lambda)                     \tag{6.4}
\]

uniformly on fixed compact `z`-sets.

Globally, `h(t)` tends to `+infinity`.  It makes the actual deficit
integrable and breaks the periodic model.  The signed prime discrepancy,
all non-endpoint translations, the archimedean tail, the pole, and the
captured/bridge feedback then form the true remainder.  No estimate in this
note bounds the compression of that global remainder by `o(L)` or by a
constant.  Therefore the correct next theorem is still a signed remainder
or Feshbach inf--sup estimate; the leading deficit geometry cannot replace
it.

## 7. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_multiplier_deficit_geometry_boundary_alias_barrier -v

The regression checks the frozen inputs, the exact periodic compression,
the split means and shift identity, critical thickness and Bernstein
scales, exact pole parity, finite-cap countermodel, fail-closed claim scope,
displayed TeX, and ASCII hygiene.
