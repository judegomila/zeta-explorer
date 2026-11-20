# Signed quotient and physical-capture reduction

## 1. Scope

This note isolates the next two source-level estimates in the direct
prolate--Weil program.  It proves:

1. an exact source-coordinate form of the signed low comparison and the
   quotient-relative low--high cross norm;
2. a phase-sensitive capture bound expressed through multiplier-weighted
   physical Gram traces rather than a cached dangerous eigenspace;
3. an exact matched-bandwidth count showing that the buffered physical
   families are dimensionally large enough to fill both parity sectors; and
4. exact countermodels showing why rank, physical conditioning, positive
   sampling, and positive diagonal compressions do not supply the missing
   sign or cross reserve.

The note does **not** prove the source-coordinate signed lower bound, the
co-frame inequality, the physical high floor, the strict cross reserve, an
unbounded sector floor, equation (5.2) of `DIRECT_RH_ATTACK.md`, or a
determinant limit.  The repository state remains `P0_INVALIDATED`.

All spaces below are finite-dimensional.  Thus every Moore--Penrose inverse,
spectral function, trace, and compression is unambiguous.  No Weil
eigenvector, zeta-zero table, or global Weil-positivity assumption is used.

## 2. The signed quotient lives in source coordinates

Let `X` be a source-coordinate space, `H` a physical Hilbert space, `D>0` on
`X`, and

\[
 W:X\longrightarrow H,
 \qquad A=WD^{-1/2},
 \qquad K=\operatorname {ran}A.                         \tag{2.1}
\]

Put

\[
 \mathcal R=AA^*,\qquad
 \Delta=\mathcal R^\dagger\big|_K,                       \tag{2.2}
\]

let `P_K` be the orthogonal projector onto `K`, and let `P_0` be the
orthogonal projector onto `(ker A)^perp`.  The quotient theorem in
`notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md` gives, for `x in (ker A)^perp`,

\[
 \boxed{\langle Ax,\Delta Ax\rangle=\|x\|^2.}             \tag{2.3}
\]

Consequently, for every Hermitian physical operator `B` and every real
`mu`,

\[
\boxed{
 P_KBP_K\succeq\mu\Delta
 \quad\Longleftrightarrow\quad
 P_0A^*BA P_0\succeq\mu P_0.}                            \tag{2.4}
\]

This equivalence does not require injectivity of `W` and contains no inverse
smallest physical Gram.  It follows immediately by writing every vector in
`K` uniquely as `Ax` with `x in (ker A)^perp` and using (2.3).

Let `P_H=I-P_K`.  There is also an exact cross identity:

\[
\boxed{
 \|P_HBP_K\Delta^{-1/2}\|=\|P_HBA\|.}                   \tag{2.5}
\]

To prove it, take a singular-value decomposition

\[
 A=U\Sigma V^*,\qquad
 \mathcal R=U\Sigma^2U^*,\qquad
 \Delta^{-1/2}=U\Sigma U^*\quad\hbox{on }K.              \tag{2.6}
\]

The two operators in (2.5) are respectively
`P_H B U Sigma U^*` and `P_H B U Sigma V^*`; their products with their
adjoints are identical.  Hence their norms are equal.

For the shifted source operator

\[
 B=Q-U_0I,                                                \tag{2.7}
\]

the scalar shift disappears from (2.5), because `P_HA=0`:

\[
\boxed{
 \|P_HBP_K\Delta^{-1/2}\|
 =\|P_HQWD^{-1/2}\|.}                                    \tag{2.8}
\]

Thus both missing signed quantities have exact source-coordinate forms:

\[
 P_0D^{-1/2}W^*QWD^{-1/2}P_0\succeq\mu_0P_0,             \tag{2.9}
\]

and

\[
 \|P_HQWD^{-1/2}\|^2<\eta\mu.                            \tag{2.10}
\]

They retain every low/low and low/high orientation.  Positive
zero-sampling estimates do not determine their signs.

## 3. The already-controlled scalar shift is harmless on the quotient

Suppose (2.9) holds.  Since

\[
 P_0A^*(Q-U_0I)AP_0
 =P_0A^*QAP_0-U_0P_0A^*AP_0,                              \tag{3.1}
\]

and `A^*A <= ||A||^2 P_0` on `(ker A)^perp`, (2.4) gives the direct
physical conclusion

\[
\boxed{
 P_K(Q-U_0I)P_K\succeq
 \left\{\mu_0-(U_0)_+\|A\|^2\right\}\Delta,
 \qquad (U_0)_+=\max(U_0,0).}                             \tag{3.2}
\]

For the split plus block in
`notes/BLOCK_QUOTIENT_ACTION_THEOREM.md`,

\[
 \|A\|^2=\|AA^*\|\leq M_8+M_R,                           \tag{3.3}
\]

with the finite source bounds

\[
 M_8\leq{\lambda^2(1+\rho_8^2)\over2d_8},                \tag{3.4}
\]

\[
 M_R\leq{3\lambda^4(5+32\pi\lambda^2)\over4d_{12}}.     \tag{3.5}
\]

The pinned fixed-index asymptotics give

\[
 {d_8\over d_6}\sim{32\pi^2\over7}\lambda^4,
 \qquad
 M_8+M_R=O(\lambda^2/d_8).                                \tag{3.6}
\]

The already proved normalized shift satisfies `U_0=o(d_6)` on the locked
exponential schedule.  Therefore

\[
\boxed{(U_0)_+(M_8+M_R)=o(\lambda^{-2}).}                 \tag{3.7}
\]

This proves only that a uniform positive `mu_0` in (2.9) would survive the
known shift.  It does not prove such a `mu_0`, and it does not transfer the
exponential-schedule sampling theorem to a polynomial Fourier cutoff.

## 4. Phase-sensitive capture without dangerous eigenvectors

Let `mathscr R>=0` and suppose on one parity sector that

\[
 B\succeq gI-\mathscr R,
 \qquad g>0.                                               \tag{4.1}
\]

Let `P=P_K`, `P_H=I-P`, choose `0<delta<g`, put

\[
 \tau=g-\delta,
 \qquad
 \Pi_>=1_{(\tau,\infty)}(\mathscr R),
 \qquad r=\|\mathscr R\|.                                \tag{4.2}
\]

For every nonnegative Borel function `F` on `[0,r]` satisfying

\[
 F(t)\geq1\quad(t>\tau),                                  \tag{4.3}
\]

define the captured-leakage score

\[
 \mathcal C_F(K,\mathscr R)
 =\operatorname {tr}\big(P_HF(\mathscr R)P_H\big).       \tag{4.4}
\]

Spectral calculus gives `Pi_> <= F(mathscr R)`.  Hence

\[
\begin{aligned}
 s^2
 &:=\|\Pi_>P_H\|^2
   =\|P_H\Pi_>P_H\|\\
 &\leq\min\{1,\mathcal C_F(K,\mathscr R)\}.              \tag{4.5}
\end{aligned}
\]

Combining (4.5) with the exact capture floor in
`notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md` proves

\[
\boxed{
 P_HBP_H\succeq
 \left\{\delta-[r-\tau]_+
 \min(1,\mathcal C_F)\right\}P_H.}                       \tag{4.6}
\]

This is phase-sensitive: it depends on the orientation of the physical
range relative to a function of the exact negative multiplier compression.

If `W_0` is any synthesis of `K`, `G=W_0^*W_0`, then

\[
 P=W_0G^\dagger W_0^*.                                    \tag{4.7}
\]

Cyclicity of the finite trace gives the source-reconstructible identity

\[
\boxed{
 \mathcal C_F
 =\operatorname {tr}F(\mathscr R)
 -\operatorname {tr}\left(
   G^\dagger W_0^*F(\mathscr R)W_0\right).}               \tag{4.8}
\]

Thus a verifier can reconstruct the capture observable from the source
multiplier and physical columns without trusting a cached dangerous
projector.

Two useful majorant families are:

\[
 F_k(t)=\left({t\over\tau}\right)^k,qquad k=1,2,\ldots,  \tag{4.9}
\]

and, for `a>0`, the bounded ridge majorant

\[
 F_{a,\tau}(t)={\tau+a\over\tau}{t\over t+a}.              \tag{4.10}
\]

Both satisfy (4.3).  The ridge function equals one at `t=tau`, is increasing,
and remains bounded by `(tau+a)/tau`; it therefore avoids overweighting a
very large dangerous eigenvalue as severely as (4.9).

For completeness, put

\[
 L_k=\operatorname {tr}(P_H\mathscr R^kP_H).               \tag{4.11}
\]

For every unit `h in K^perp`, Jensen's inequality for the spectral measure
of `mathscr R` gives

\[
 \langle h,\mathscr Rh\rangle^k
 \leq\langle h,\mathscr R^kh\rangle\leq L_k.              \tag{4.12}
\]

Consequently

\[
\boxed{
 P_HBP_H\succeq\left(g-L_k^{1/k}\right)P_H.}              \tag{4.13}
\]

One may take the best proved value over several `k`.  No assertion is made
that increasing `k` always improves the bound.

### 4.1 The odd pole can be moved wholly into the low range

In the odd sector the negative operator is

\[
 \mathscr R_-=T_v+2|p_-\rangle\langle p_-|.                \tag{4.14}
\]

If the odd physical range is augmented by the projected pole representer,

\[
 K_-^{\rm aug}=K_-+\operatorname {span}\{P_{E_N^-}p_-\},  \tag{4.15}
\]

then `P_HP_{E_N^-}p_-=0`, where `P_H` is the complement of the augmented
range inside `E_N^-`.  The compressed pole contributes neither to the high
compression nor to the low--high cross block.  Therefore the
**high-compressed** capture and moment
estimates (4.4)--(4.13) may use `P_{E_N^-}T_vP_{E_N^-}` alone.  This does not
assert the false global inequality `B\succeq gI-T_v`: the negative pole
remains, correctly, inside the signed low comparison.

## 5. A matched-bandwidth co-frame alternative

Take the locked half-integer schedule

\[
 \lambda={p\over2},\qquad p\geq5\hbox{ odd},
 \qquad N=\lceil\lambda^2\rceil={p^2+3\over4}.             \tag{5.1}
\]

Let

\[
 q=\left\lceil {2\over\pi^2}
       \log(50p^2+25)\log20\right\rceil.                  \tag{5.2}
\]

The pinned transition index is

\[
 n_*=p^2+6+q.                                              \tag{5.3}
\]

The strict buffered target counts from
`notes/GROWING_WINDOW_THEOREM.md` are therefore exactly

\[
\boxed{
 r_+^{\rm buf}
 =N+\left\lfloor{q+2\over4}\right\rfloor-1,}             \tag{5.4}
\]

\[
\boxed{
 r_-^{\rm buf}
 =N+\left\lfloor{q\over4}\right\rfloor.}                 \tag{5.5}
\]

The quantity inside the ceiling in (5.2) is increasing in `p`.  At `p=5`
it is greater than four (for example `log(1275)>7`, `log(20)>2.9`, and
`pi^2<10`), so `q>=5`.  Hence

\[
\boxed{r_+^{\rm buf}\geq N,qquad r_-^{\rm buf}\geq N+1.} \tag{5.6}
\]

Assume here, explicitly, that the projected anchor
`P_{E_N^+}p_4` is nonzero, and write `kappa` for its normalization.  This is
the same finite nonvanishing hypothesis used by the growing-window and block
quotient reductions; the current theorem does not prove that
`N=ceil(lambda^2)` is beyond its eventual fixed-`lambda` threshold.  Under
this hypothesis, `kappa^perp` inside `E_N^+` has dimension `N`, while
`E_N^-` has dimension `N`.  Thus there is no dimension obstruction to a
full-row physical synthesis at matched bandwidth.

Let `W_+^{buf}` synthesize the anchor-deflated plus targets and let
`W_-^{buf}` synthesize the odd targets.  Consider the quantitative co-frame
inequalities

\[
 W_+^{\rm buf}(W_+^{\rm buf})^*
 \succeq\gamma_+P_{\kappa^\perp},
 \qquad
 W_-^{\rm buf}(W_-^{\rm buf})^*
 \succeq\gamma_-I_{E_N^-},
 \qquad \gamma_\pm>0.                                    \tag{5.7}
\]

On the comparison spaces
`X_{N,+}=E_N^+ intersect kappa^perp` and `X_{N,-}=E_N^-`, (5.7) would make
each physical range equal its whole ambient comparison space.  Each high
complement is then zero, so the capture angle is zero and the low--high cross
block is absent.  Equation
(5.7) is **not proved**.  The existing physical-map theorem is a
source-side injectivity statement and cannot be reversed into this
row-surjectivity claim.

This alternative also does not import the exponential-schedule relative
projection estimates into `N=ceil(lambda^2)`.  Even if (5.7) were proved,
the full-sector source-coordinate signed comparison would remain.

## 6. Exact obstructions to weaker data

### 6.1 Rank, conditioning, and a positive low block do not imply capture

On `R^3`, let `K=span(e_1,e_2)`, `P_K=diag(1,1,0)`, `g=2`, `delta=1`, and

\[
 u=\left({3\over5},0,{4\over5}\right)^T,
 \qquad
 \mathscr R=3uu^T,
 \qquad
 A_+= {27\over25}e_1e_1^T.                                \tag{6.1}
\]

Put

\[
 B=2I+A_+-\mathscr R
 =\begin{bmatrix}
 2&0&-36/25\\
 0&2&0\\
 -36/25&0&2/25
 \end{bmatrix}.                                            \tag{6.2}
\]

Then `A_+,mathscr R>=0`, `B>=2I-mathscr R`, the dangerous rank is one while
`dim K=2`, and the low compression is exactly `2I`.  The synthesis
`W=[e_1 e_2]` is an isometry and can have `D=Delta=I`.  Nevertheless

\[
 \|\Pi_>P_{K^\perp}\|^2={16\over25}.                       \tag{6.3}
\]

More explicitly, put

\[
 u_\theta=(\cos\theta,0,\sin\theta)^T,
 \qquad A_{+,\theta}=3\cos^2\theta\,e_1e_1^T.             \tag{6.4}
\]

As `theta` runs from zero to `pi/2`, this family keeps the dangerous rank,
conditioning, and low compression `2I` fixed while the capture angle ranges
from zero to one.  At `theta=pi/2`, `A_{+,\theta}=0` and
`B=diag(2,2,-1)`.  Hence even favorable rank strictly below `dim K` is not a
capture theorem.

### 6.2 Exact capture and positive diagonal blocks do not remove the cross

Again take `K=span(e_1,e_2)`, but put

\[
 \mathscr R=3e_1e_1^T,
 \qquad v=(2,0,3)^T,
 \qquad A_+=vv^T,                                         \tag{6.5}
\]

\[
 B=2I-\mathscr R+A_+
 =\begin{bmatrix}3&0&6\\0&2&0\\6&0&11\end{bmatrix}.    \tag{6.6}
\]

The dangerous range lies exactly in `K`, the low block is at least `2I`,
and the high block is `11`.  But the low Schur complement is

\[
 \operatorname {diag}(-3/11,2),                            \tag{6.7}
\]

and `det B=-6`.  Thus exact capture plus positive low and high compressions
still requires the strict quotient-relative cross reserve.

### 6.3 Positive sampling cannot choose the sign or create strict reserve

Let `J(z_1,z_2)=(z_2,z_1)` and `Sx=(x,-x)`.  Then

\[
 S^*S=2,
 \qquad S^*JS=-2.                                         \tag{6.8}
\]

The positive sampling Gram is unchanged while the paired signed form is
negative.  Separately, the row `S=[1\ 1]` has Gram

\[
 S^*S=\begin{bmatrix}1&1\\1&1\end{bmatrix}.              \tag{6.9}
\]

With quotient metric `Delta=1`, its low and high diagonal bounds are
`mu=eta=1` and its normalized cross satisfies `chi^2=mu=1`; equivalently,
the raw cross obeys `|B_HK|^2=eta*mu=1`.  The strict inequality required by
the gluing theorem fails at equality.  These examples show that the existing
absolute sampling bounds do not by themselves imply (2.9) or (2.10).

## 7. The exact remaining source estimates

For the split plus synthesis `A=W_LD_L^{-1/2}`, the missing low statement is

\[
\boxed{
 P_0D_L^{-1/2}W_L^*QW_LD_L^{-1/2}P_0
 \succeq\mu_0P_0,
 \qquad \mu_0>0.}                                        \tag{7.1}
\]

After the proved shift erosion, choose a physical-high estimate by either
(4.6), (4.13), or the co-frame alternative (5.7).  If its floor is `eta>0`,
the exact cross target is

\[
\boxed{
 \|P_HQW_LD_L^{-1/2}\|^2
 <\eta\left(\mu_0-(U_0)_+\|A\|^2\right).}                \tag{7.2}
\]

The same two estimates, with the negative pole retained in the low block or
handled by (4.15), are required in the odd sector.  They must hold on one
common projection schedule.  The currently proved positive sampling theorem
uses the exponential schedule, while the compressed multiplier rank theorem
uses `N` comparable to `lambda^2`; neither can be silently substituted into
the other.

Equations (7.1)--(7.2) are phase-sensitive statements about the combined
pole--archimedean--prime form.  The existing absolute sampling action remains
useful for the residual forcing after positivity is established, but it
cannot decide these two conditions.

## 8. Replay boundary

The exact producer/replay component serializes:

- the half-integer matched-bandwidth counts at base and doubled precision;
- a noninjective quotient model saturating (2.4);
- a nonzero-cross model saturating (2.5) and the shift cancellation (2.8);
- the rank/capture and exact-capture/cross countermodels in Section 6;
- the signed-sampling countermodels; and
- a rational ridge-majorant capture example for (4.5) and (4.8).

The verifier reconstructs every rational matrix and the transition ceiling
from source parameters.  It imports neither producer code nor project
helpers.  Both paths share the pinned `mpmath.iv` runtime for the transition
ceiling, and that common dependency is disclosed.  The replay is a check of
the exact reductions and failure modes, not evidence for (7.1), (7.2), or
the co-frame hypothesis.
