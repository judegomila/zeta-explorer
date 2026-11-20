# Actual-symbol boundary gauge and nested phase-angle barrier

## 0. Exact result and fail-closed boundary

Use the locked source interval and Fourier convention

\[
 I_L=[-L/2,L/2],\qquad L=2\log\lambda,\qquad
 \widehat f(t)=\int_{I_L}f(x)e^{-itx}\,dx.             \tag{0.1}
\]

The complete arithmetic multiplier is

\[
 m_\lambda(t)=
 \operatorname {Re}\psi\!\left({1\over4}+{it\over2}\right)-\log\pi
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).                \tag{0.2}
\]

Every prime power through the inclusive endpoint remains inside (0.2).  No
prime, Archimedean, pole, or boundary term is estimated separately below.

The critical boundary character is invisible after zero-extension
compression.  Consequently the **full actual symbol** has the exact gauge

\[
 \boxed{r_\lambda(t)=m_\lambda(t)+4\lambda\cos(Lt),}
                                                               \tag{0.3}
\]

\[
 \boxed{
 C_L^*\mathcal F^*M_{m_\lambda}\mathcal F C_L
 =C_L^*\mathcal F^*M_{r_\lambda}\mathcal F C_L.}       \tag{0.4}
\]

Thus the actual relative phase-angle inequality from the nested Feshbach
barrier is exactly a signed lower bound for the single remainder (0.3), not
a consequence of the positive and negative phase volumes.  If `G` is the
complete safe/captured harmonic lift and `P_(epsilon,S)` is the actual
positive side of the split at shift `S`, then its optimal relative angle is

\[
 \boxed{
 \rho_*(G;S)=
 \inf_{0\ne z}
 {\langle Gz,(Q_{\lambda,\epsilon}-SI)Gz\rangle
  \over
  \langle Gz,P_{\epsilon,S}Gz\rangle}.}              \tag{0.5}
\]

The proposed inequality holds with `rho>0` if and only if
`rho<=rho_*(G;S)`.  Substitution of (0.4) keeps the numerator combined:

\[
\boxed{
\begin{aligned}
 \langle Gz,(Q_{\lambda,\epsilon}-SI)Gz\rangle
 ={}&\int_{\mathbb R}r_\lambda(t)
                    |\widehat {Gz}(t)|^2{dt\over2\pi}
      -S\|Gz\|^2\\
 &+2\epsilon|\langle p_\epsilon,Gz\rangle|^2.
\end{aligned}}                                      \tag{0.6}
\]

For the pencil subtraction `theta*Delta`, the exact numerator in (0.6)
simply acquires
`-theta*<Gz,Delta Gz>`.  All metric and Schur returns remain inside the
same lift `G=G_(epsilon,m,theta)`.

The pinned PNT says only

\[
 r_\lambda(z/L)=o(\lambda)                            \tag{0.7}
\]

uniformly for `z` in a fixed compact interval.  This is a local statement;
it neither bounds the global form in (0.6) nor orients it on the
source-defined dangerous space.

There is a sharp obstruction to obtaining (0.5) from Remez, uncertainty,
component-counting, or fixed-symbol Toeplitz information.  In the exact
edge member

\[
 m_{\rm edge}(t)=-4\lambda\cos(Lt),                   \tag{0.8}
\]

the remainder (0.3) is zero.  After any finite capture which leaves a
pole-orthogonal direction, the relative phase inequality is impossible for
every nonnegative shift `S`.  For a negative lower-Ritz shift `-g<S<0`, its
largest possible angle on that direction is exactly

\[
 \boxed{\rho_{\rm edge}(S)
 ={ -S\over\overline v_S-S}
 ={\pi(-S)\over4\lambda}\{1+o(1)\},}                 \tag{0.9}
\]

when `g+|S|=o(lambda)`.  The corresponding absolute nested short is exactly
`-S`; the phase split creates no extra reserve.  Hence lowering to a
nonnegative Ritz value does not repair the boundary geometry, while a
negative Ritz value contributes only its own scalar shift in this model.

The edge member is not the actual von-Mangoldt multiplier.  Its role is
precisely limited: it proves that boundary geometry and uncertainty alone
cannot establish the actual signed remainder estimate (0.6).  The full
arithmetic remainder may still orient the actual finite operator.
No actual sector sign is proved.  Nor is any harmonic capture floor, lower-Ritz sign,
one-vector response estimate, determinant limit, zero statement, or
Riemann-hypothesis conclusion proved.
The formal state remains `P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

Only the following repository bytes are used.

| Dependency | SHA-256 |
|---|---|
| `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` | `c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81` |
| `notes/GROWING_MULTIPLIER_DEFICIT_GEOMETRY_BOUNDARY_ALIAS_BARRIER.md` | `2e5b38892f73848b4d081de5fef45f10819bd4e7f6a8be5a4edb8f85dae11141` |
| `notes/GROWING_FIXED_CAPTURE_MULTIPLIER_DANGER_NESTED_FESHBACH_BARRIER.md` | `0abc50aabff9e630001e1164eafba8de52ef5804e1c2251e70e1367e5b7c9197` |
| `notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md` | `3efbbf5cd0888d2a645b11c73b625007bf38bf010881d5e0c9d8ecbc964fb1a6` |
| `DIRECT_RH_ATTACK.md` | `b8c5eb77013f00d9a48aa24c244c4a1d1d86957eab041e28282927d7d55c0fa2` |

The first two rows fix the actual multiplier, parity poles, positive-part
split, local PNT profile, and exact critical alias.  The third fixes the
complete two-level harmonic lift.  The final two fix the genuinely weaker
lower-Ritz response route and equation (5.2) of `DIRECT_RH_ATTACK.md`.

## 2. Exact full-symbol boundary gauge

Let `C_L` be zero extension from `I_L`.  For every `f` in `L^2(I_L)`,
Plancherel and the translation rule give

\[
 \int_{\mathbb R}e^{iLt}|\widehat f(t)|^2{dt\over2\pi}
 =\int_{\mathbb R}\overline{C_Lf(x)}C_Lf(x+L)\,dx=0. \tag{2.1}
\]

The two supports meet only at a null endpoint.  Taking real parts proves

\[
 C_L^*\mathcal F^*M_{\cos(Lt)}\mathcal F C_L=0.       \tag{2.2}
\]

Equations (0.3)--(0.4) follow immediately.  This is an exact quadratic-form
identity.  It does not replace (0.2) by a PNT approximation: (0.2) is kept
inside `r_lambda` byte for byte.

For a real shift `S` and `g>0`, define the actual pointwise split only after
the complete arithmetic cancellation:

\[
 a_S(t)=[m_\lambda(t)-S-g]_+,
 \qquad v_S(t)=[g+S-m_\lambda(t)]_+.                 \tag{2.3}
\]

Let `T_(a_S)` and `T_(v_S)` be their zero-extension Fourier compressions.
On parity `epsilon=+1,-1`, put

\[
\begin{aligned}
 P_{+,S}&=gI+T_{a_S}+2|p_+\rangle\langle p_+|,
 &N_{+,S}&=T_{v_S},\\
 P_{-,S}&=gI+T_{a_S},
 &N_{-,S}&=T_{v_S}+2|p_-\rangle\langle p_-|.
\end{aligned}                                       \tag{2.4}
\]

Then

\[
 \boxed{Q_{\lambda,\epsilon}-SI=P_{\epsilon,S}-N_{\epsilon,S}.}
                                                               \tag{2.5}
\]

Both sides of (2.4) retain every prime power and the full Archimedean
symbol.  In particular, neither `T_(a_S)` nor `T_(v_S)` is replaced by the
edge split in any assertion about the actual operator.
On the even side of the application, (2.4)--(2.5) are simply surrounded by
the orthogonal projection to `kappa^perp`; every later lift already has
range in that compressed sector.

## 3. Exact relative-angle equivalence after every return

Let `V` be finite dimensional and let `G:V->H_epsilon` be any injective map
whose range lies in the common form domain.  In the application, `G` is exactly
`G_(epsilon,m,theta)` from the nested Feshbach theorem, so it already
contains the safe return, captured return, cross terms, and the complete
metric dependence.

Because `P_(epsilon,S)>=gI`, its pullback is strictly positive.  Define

\[
 \rho_*(G;S)=\lambda_{\min}
 \left((G^*P_{\epsilon,S}G)^{-1/2}
       G^*(P_{\epsilon,S}-N_{\epsilon,S})G
       (G^*P_{\epsilon,S}G)^{-1/2}\right).           \tag{3.1}
\]

This is the quotient in (0.5).  Pure algebra gives

\[
\boxed{
 G^*N_{\epsilon,S}G
 \preceq(1-\rho)G^*P_{\epsilon,S}G
 \quad\Longleftrightarrow\quad
 G^*(Q_{\lambda,\epsilon}-SI)G
 \succeq\rho G^*P_{\epsilon,S}G.}                   \tag{3.2}
\]

Thus (3.2) holds exactly when `rho<=rho_*(G;S)`.  Combining (2.2) and
(2.5) proves (0.6).

For the positive-angle pencil

\[
 T_{S,\theta}=Q_{\lambda,\epsilon}-SI-\theta\Delta,
 \qquad\theta\geq0,                                  \tag{3.3}
\]

the corresponding statement is

\[
\boxed{
 G^*(N_{\epsilon,S}+\theta\Delta)G
 \preceq(1-\rho)G^*P_{\epsilon,S}G
 \quad\Longleftrightarrow\quad
 G^*T_{S,\theta}G\succeq\rho G^*P_{\epsilon,S}G.}  \tag{3.4}
\]

No metric can be inserted after forming `G`; (3.4) uses the lift belonging
to the same pencil.

One may lower a previously fixed shift `U` without recomputing positive
parts.  If `d=U-S>=0`, then

\[
 Q_{\lambda,\epsilon}-SI
 =(P_{\epsilon,U}+dI)-N_{\epsilon,U}.                \tag{3.5}
\]

This gives an alternative exact angle with positive side
`P_(epsilon,U)+dI`.  It is different from the split recomputed at `S`, but
both have the same signed numerator (0.6).  Hence lowering the shift adds
only the explicit scalar `d||Gz||^2`; it does not manufacture orientation
of the actual remainder.

## 4. Why local PNT and Remez do not bound the gauge remainder

The pinned PNT profile is

\[
 m_\lambda(z/L)=-4\lambda\cos z+o(\lambda)           \tag{4.1}
\]

on every fixed compact `z`-interval.  Therefore (0.3) gives (0.7).  But
the form in (0.6) integrates over the whole real axis.

The gap cannot be crossed by an unqualified Paley--Wiener uncertainty
statement.  Fix a nonzero smooth even function `chi` compactly supported
inside `I_L`.  The parity-preserving modulations

\[
 f_T^+(x)=\chi(x)\cos(Tx),
 \qquad f_T^-(x)=\chi(x)\sin(Tx)                     \tag{4.2}
\]

have Fourier mass near `+-T`.  For every fixed bounded frequency set `E`,

\[
 {\int_E|\widehat f_T^\epsilon(t)|^2dt
  \over\|f_T^\epsilon\|_2^2}\longrightarrow0
 \qquad(T\longrightarrow\infty).                   \tag{4.3}
\]

This follows directly from translation of `widehat chi` and its `L^2`
tail.  Thus a local estimate such as (0.7) supplies no operator-form bound
on either parity sector.  Equation (4.3) is not a dangerous-space
near-extremizer: membership in the actual spectral dangerous projector is
not proved.  It isolates the additional graph/localization theorem that a
successful use of (0.7) would require.

Remez or Logvinenko--Sereda information about the positive and negative
edge sets is stronger locally but still loses the sign.  Section 5 gives
the exact equality case.

## 5. Sharp edge phase-angle calculation

Replace the actual multiplier only in this section by (0.8).  Put

\[
 \beta=g+S,\qquad0\leq\beta<4\lambda,
 \qquad \alpha=\arccos\!\left(-{\beta\over4\lambda}\right).
                                                               \tag{5.1}
\]

The exact means of the negative and positive parts are

\[
 \boxed{
 \overline v_S={\beta\alpha+4\lambda\sin\alpha\over\pi},
 \qquad
 \overline a_S=\overline v_S-\beta.}                \tag{5.2}
\]

Critical periodic Wiener--Hopf collapse makes their compressions scalar:

\[
 T_{v_S}=\overline v_S I,
 \qquad T_{a_S}=\overline a_S I.                    \tag{5.3}
\]

In particular,

\[
 gI+T_{a_S}-T_{v_S}=-SI.                             \tag{5.4}
\]

On a vector `f` orthogonal to the parity pole, the edge positive and
negative energies are therefore

\[
 \langle f,P_{\epsilon,S}^{\rm edge}f\rangle
   =(\overline v_S-S)\|f\|^2,
 \qquad
 \langle f,N_{\epsilon,S}^{\rm edge}f\rangle
   =\overline v_S\|f\|^2.                            \tag{5.5}
\]

The signed quotient is

\[
 \boxed{
 {\langle f,(P_{\epsilon,S}^{\rm edge}
                  -N_{\epsilon,S}^{\rm edge})f\rangle
  \over\langle f,P_{\epsilon,S}^{\rm edge}f\rangle}
 ={ -S\over\overline v_S-S}.}                       \tag{5.6}
\]

Consequently:

1. if `S>0`, the quotient is negative;
2. if `S=0`, it is zero;
3. if `-g<S<0`, the largest admitted positive angle on this line is exactly
   `(-S)/(bar(v_S)-S)`.

When `g+|S|=o(lambda)`, direct expansion of (5.2) gives

\[
 \overline v_S={4\lambda\over\pi}+{g+S\over2}
       +O((g+S)^2/\lambda),                           \tag{5.7}
\]

which proves (0.9).  Notice that multiplying the relative angle in (5.6)
by its positive energy gives exactly `-S`; the `Theta(lambda)` positive and
negative pieces add no absolute floor.

This is sharper than a generic uncertainty counterexample.  Both edge
phase sets are relatively dense at the critical scale, and every physical
vector observes their periodic weights through the exact scalar means
(5.2).  Optimal observation still leaves the quotient (5.6).

## 6. Finite capture and the lower-Ritz cases

The edge deficit compression in (5.3) is scalar and eventually exceeds the
danger threshold whenever `g+|S|=O(L)`.  Hence its multiplier-dangerous space
is the whole finite ambient parity space and there is no safe return.

Let `W` be any finite captured coordinate and `U=W^perp`.  Suppose the
captured edge pivot is positive so that the second Feshbach step is legal.
If

\[
 0\ne f\in U\cap p_\epsilon^\perp,                   \tag{6.1}
\]

then

\[
 (Q_{\epsilon}^{\rm edge}-SI)f=-Sf,
 \qquad P_W(Q_{\epsilon}^{\rm edge}-SI)f=0.          \tag{6.2}
\]

Thus the captured cross vanishes on `f`, the combined lift leaves `f`
unchanged, and the exact nested short satisfies

\[
 \boxed{\mathcal K_{m,0}^{\rm edge}f=-Sf.}           \tag{6.3}
\]

Condition (6.1) is automatic when `dim(U)>=2`.  Therefore no finite capture
can turn the edge geometry into a positive phase angle for `S>=0`.  The
statement is conditional on a positive captured pivot; if that pivot is not
positive, the nested reduction stops even earlier.

Take now `S=u_R`, the lower two-vector Ritz shift.  The exact cases are:

- `u_R>=0`: (5.6) and (6.3) give no positive edge angle;
- `-g<u_R<0`: the edge angle is positive but bounded sharply by (0.9), and
  its complete absolute short is only `-u_R`.

The actual lower-Ritz program does not require a uniform relative phase
angle.  Under

\[
 A-u_RI\succ0,\qquad Q_--u_RI\succ0,                 \tag{6.4}
\]

it is enough to prove the one-vector rate

\[
 \|(A-u_RI)^{-1}b\|
 =O(\lambda^{-1/2}\operatorname {polylog}\lambda)    \tag{6.5}
\]

for equation (5.2) of `DIRECT_RH_ATTACK.md`.  Neither (6.4) nor (6.5)
follows from the edge calculation.  Sections 3--6 show only that a
Remez/uncertainty proof of a stronger phase angle must use the actual signed
remainder (0.3), and that lowering the scalar shift does not avoid that
obligation unless its own negative reserve is already sufficient.

## 7. Exact stopping line

The boundary alias can be used positively as a gauge, but not as a sign.
After the gauge, the required theorem is the actual cancellation-preserving
inequality

\[
\begin{aligned}
 &\int_{\mathbb R}r_\lambda(t)|\widehat {Gz}(t)|^2{dt\over2\pi}
 -S\|Gz\|^2+2\epsilon|\langle p_\epsilon,Gz\rangle|^2\\
 &\hspace{25mm}\geq
 \rho\,\langle Gz,P_{\epsilon,S}Gz\rangle,
\end{aligned}                                        \tag{7.1}
\]

with the same actual combined lift on both sides.  For a positive pencil
angle, subtract `theta*<Gz,Delta Gz>` on the left.  Equation (7.1) keeps the
inclusive von-Mangoldt inventory and all Schur returns intact.

Local PNT controls only a compact frequency window of the left side.
Critical-set uncertainty controls observation but not the signed remainder.
The pure edge equality shows that both pieces may be observed optimally
while the relative angle is nonpositive.  The missing input is therefore a
source-specific global signed-remainder/graph theorem on the actual
dangerous harmonic range, or the separate lower-Ritz signs and one-vector
response route.

Neither input is proved here.

## 8. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_actual_symbol_boundary_gauge_phase_angle_barrier -v

The regression checks every frozen hash, the boundary gauge, exact actual
angle algebra, metric subtraction, edge means and split, all three shift
cases, the nested pole-orthogonal short, lower-Ritz scope, displayed TeX,
ASCII hygiene, and the fail-closed boundary.
