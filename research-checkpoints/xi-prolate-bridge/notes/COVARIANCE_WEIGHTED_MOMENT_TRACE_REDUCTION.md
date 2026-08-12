# Covariance-weighted moment trace for the residual-ridged observable

## 0. Scope and outcome

This note sharpens the low term in
`FIXED_WINDOW_EVEN_MOMENT_SOFT_TRACE_REDUCTION.md`.  It is an exact finite
reduction, not an actual-source asymptotic estimate.

On the inversion-even anchor complement let

\[
 B>0,\qquad r>0,\qquad S_r=r(B+rI)^{-1},              \tag{0.1}
\]

and let \(K_T\) be the fixed-window time-band contraction.  If \(P_m\)
projects onto the declared even physical moment range, the earlier splice
bounded its low term by

\[
 r\operatorname {tr}(C_{r,m}^{-1})
 =\operatorname {tr}(P_mS_rP_m).                      \tag{0.2}
\]

That scalar is sufficient but stronger than the Hilbert--Schmidt argument
requires.  Keeping the time-band covariance inside the low term gives

\[
 \boxed{
 \sqrt{\operatorname {tr}(S_rK_T)}
 \leq
 \sqrt{\operatorname {tr}(P_mK_TP_mS_r)}
 +\sqrt{\operatorname {tr}(H_mK_TH_m)},}              \tag{0.3}
\]

where \(H_m=I-P_m\).  The second term has already been proved
superpolynomially small for \(m=\lceil LT\rceil\).  The exact remaining
quantity is therefore the covariance-weighted moment resolvent

\[
 \boxed{
 \mathcal L_{r,m,T}
 =r\operatorname {tr}(K_mR_{r,m}),}                   \tag{0.4}
\]

with

\[
 K_m=W_m^*K_TW_m,\qquad
 R_{r,m}=W_m^*(B+rI)^{-1}W_m,                         \tag{0.5}
\]

and \(W_m\) any isometry onto the moment range.  In particular, the
smallest eigenvalue of the complete Schur complement is not needed for this
route.

The exact threshold profile is the covariance-weighted angle

\[
 \Theta_{m,T}(u)
 =\operatorname {tr}\!\left(
 K_mW_m^*{\bf1}_{(0,u]}(B)W_m\right)
 =\left\|{\bf1}_{(0,u]}(B)W_mK_m^{1/2}\right\|_{HS}^2. \tag{0.6}
\]

For \(t=r/(u+r)\),

\[
 \boxed{
 t\Theta_{m,T}(u)
 \leq\mathcal L_{r,m,T}
 \leq t\operatorname {tr}(K_m)
       +(1-t)\Theta_{m,T}(u).}                        \tag{0.7}
\]

Consequently a sufficient actual-source target is

\[
 \Theta_{m,T}(u_L)
 +{r\over u_L}\operatorname {tr}(K_m)
 =o(L^{-3/2}).                                        \tag{0.8}
\]

Since \(\operatorname {tr}(K_m)\leq LT/\pi\), it is enough to prove

\[
 \Theta_{m,T}(u_L)=o(L^{-3/2}),\qquad
 {r\over u_L}=o(L^{-5/2}).                            \tag{0.9}
\]

This is strictly weaker than controlling the worst principal angle
\(\eta_m(u)=\|{\bf1}_{(0,u]}(B)P_m\|^2\) at the
\(o(L^{-5/2})\) scale.  It permits a badly aligned direction when that
direction carries sufficiently little fixed-window covariance.  No current
theorem proves (0.8) or (0.9) for the actual source matrix.

Every source specialization below uses Lebesgue measure on the centered
logarithmic interval, zero extension, reflection as inversion, the Fourier
sign \(e^{-itx}\), the source-normalized projected state, the inclusive
prime-power inventory \(n\leq\lambda^2\), and the minus sign on the prime
block.  The pole, archimedean, and prime blocks are assembled before the
positive operator \(B\) is formed.  No zero list or global Weil positivity
is used.  The formal project state remains `P0_INVALIDATED`.

## 1. Exact covariance-preserving splice

Let \(\mathcal K\) be a finite-dimensional Hilbert space, let
\(0\preceq K\preceq I\), let \(0\preceq S\preceq I\), and let \(P\) be an
orthogonal projection with \(H=I-P\).  In Hilbert--Schmidt norm,

\[
 K^{1/2}S^{1/2}
 =K^{1/2}PS^{1/2}+K^{1/2}HS^{1/2}.                   \tag{1.1}
\]

The triangle inequality gives

\[
 \sqrt{\operatorname {tr}(SK)}
 \leq
 \left\|K^{1/2}PS^{1/2}\right\|_{HS}
 +\left\|K^{1/2}HS^{1/2}\right\|_{HS}.              \tag{1.2}
\]

The two squared terms are

\[
 \left\|K^{1/2}PS^{1/2}\right\|_{HS}^2
 =\operatorname {tr}(PKPS),                          \tag{1.3}
\]

\[
 \left\|K^{1/2}HS^{1/2}\right\|_{HS}^2
 =\operatorname {tr}(HKHS).                          \tag{1.4}
\]

Because \(0\preceq S\preceq I\) and \(HKH\succeq0\),

\[
 \operatorname {tr}(HKHS)
 \leq\operatorname {tr}(HKH).                        \tag{1.5}
\]

Equations (1.2)--(1.5) prove

\[
 \boxed{
 \sqrt{\operatorname {tr}(SK)}
 \leq\sqrt{\operatorname {tr}(PKPS)}
       +\sqrt{\operatorname {tr}(HKH)}.}              \tag{1.6}
\]

Taking \(S=S_r\), \(K=K_T\), and \(P=P_m\) proves (0.3).  The older
splice follows only after the additional estimate \(PK_TP\preceq P\):

\[
 \operatorname {tr}(PK_TPS_r)
 \leq\operatorname {tr}(PS_rP)
 =r\operatorname {tr}(C_{r,m}^{-1}).                  \tag{1.7}
\]

Thus (0.3) never weakens the admitted bound and can be strictly sharper.
It does not replace the complete resolvent by a raw compression: the full
low--high feedback remains in \((B+rI)^{-1}\).

## 2. Whitened and raw moment coordinates

Assume the moment range \(V_m\) is nonzero and let

\[
 W:\mathbb C^{d_m}\longrightarrow\mathcal K,
 \qquad W^*W=I,\qquad WW^*=P_m.                       \tag{2.1}
\]

Define

\[
 K_m=W^*K_TW,\qquad R_m=W^*(B+rI)^{-1}W.              \tag{2.2}
\]

Both matrices are positive semidefinite, and \(R_m\) is positive definite.
Cyclicity of the finite trace gives

\[
\begin{aligned}
 \operatorname {tr}(P_mK_TP_mS_r)
 &=r\operatorname {tr}\!\left(
   WK_mW^*(B+rI)^{-1}\right)\\
 &=r\operatorname {tr}(K_mR_m).                       \tag{2.3}
\end{aligned}
\]

Although \(K_mR_m\) need not be Hermitian, its trace is nonnegative because

\[
 \operatorname {tr}(K_mR_m)
 =\operatorname {tr}(R_m^{1/2}K_mR_m^{1/2}).          \tag{2.4}
\]

Equation (2.3) proves (0.4).

The same scalar can be reconstructed without selecting an orthonormal
moment basis.  Let \(U\) be any injective synthesis onto \(V_m\), and put

\[
 G=U^*U,\qquad K_U=U^*K_TU,\qquad
 R_U=U^*(B+rI)^{-1}U.                                 \tag{2.5}
\]

With \(W=UG^{-1/2}\), equation (2.3) becomes

\[
 \boxed{
 \mathcal L_{r,m,T}
 =r\operatorname {tr}(G^{-1}K_U G^{-1}R_U).}          \tag{2.6}
\]

Under a basis change \(U\mapsto US\), all three raw matrices transform by
the same congruence.  The right side of (2.6) is unchanged.  Raw monomial
scaling therefore cannot alter the diagnostic.

There is also an exact first-determinant-slope representation.  Put

\[
 \mathcal M_{r,m,T}=R_m^{1/2}K_mR_m^{1/2}\succeq0.    \tag{2.7}
\]

Then

\[
 \boxed{
 \mathcal L_{r,m,T}
 =-r\left.{d\over dz}
 \log\det(I-z\mathcal M_{r,m,T})\right|_{z=0}.}       \tag{2.8}
\]

Thus the observable requires the first slope of a positive weighted
determinant, not a lower bound for its smallest reciprocal root.  Higher
slopes contain additional information but are not needed for (0.8).

If \(V_m=\{0\}\), all matrices above are empty and
\(\mathcal L_{r,m,T}=0\) by convention.

## 3. Covariance-weighted low-spectral profile

For \(u>0\), let

\[
 E_u={\bf1}_{(0,u]}(B),
 \qquad
 \Theta_{m,T}(u)=\operatorname {tr}(K_mW^*E_uW).      \tag{3.1}
\]

The second expression in (0.6) follows from

\[
 \Theta_{m,T}(u)
 =\operatorname {tr}\!\left(
 K_m^{1/2}W^*E_uWK_m^{1/2}\right).                    \tag{3.2}
\]

In particular \(\Theta_{m,T}(u)\geq0\), it is nondecreasing and
right-continuous in \(u\), and

\[
 0\leq\Theta_{m,T}(u)\leq\operatorname {tr}(K_m).     \tag{3.3}
\]

Finite spectral calculus gives the exact layer formula

\[
 \boxed{
 \mathcal L_{r,m,T}
 =\int_0^\infty {r\over(u+r)^2}
   \Theta_{m,T}(u)\,du.}                              \tag{3.4}
\]

Indeed, for every positive eigenvalue \(\beta\) of \(B\),

\[
 {r\over\beta+r}
 =\int_\beta^\infty {r\over(u+r)^2}\,du.             \tag{3.5}
\]

For a fixed threshold \(u>0\), set \(t=r/(u+r)\).  The scalar inequality

\[
 t{\bf1}_{(0,u]}(\beta)
 \leq {r\over\beta+r}
 \leq t+(1-t){\bf1}_{(0,u]}(\beta)                   \tag{3.6}
\]

holds for every \(\beta>0\).  Apply it to \(B\), multiply against the
positive matrix \(P_mK_TP_m\), and take the trace.  This proves (0.7).

The relation to the previous worst-angle profile is

\[
 \boxed{
 \Theta_{m,T}(u)
 \leq\operatorname {tr}(K_m)\,
       \|E_uP_m\|^2.}                                \tag{3.7}
\]

It follows by bounding the positive compression \(W^*E_uW\) by its
operator norm.  The converse is false without a lower covariance floor on
\(K_m\).  This failure is useful here: a low-\(B\) direction which is nearly
invisible to the fixed transform window should not be charged at full unit
weight.

## 4. Exact sufficient asymptotic target

For the explicit even-moment range with

\[
 m=\lceil LT\rceil,                                   \tag{4.1}
\]

the admitted Taylor/Bessel estimate is

\[
 \operatorname {tr}(H_mK_TH_m)
 \leq {LT\over\pi(4m+1)^2}\left({e\over4}\right)^{4m}.
                                                               \tag{4.2}
\]

Moreover the full, uncompressed time-band operator has diagonal kernel
\(T/\pi\), so finite compression and anchor deflation give

\[
 \operatorname {tr}(K_m)
 \leq\operatorname {tr}(K_T)
 \leq {LT\over\pi}.                                  \tag{4.3}
\]

Equations (0.3), (0.7), and (4.2)--(4.3) prove that (0.8), and hence the
more explicit pair (0.9), is sufficient for

\[
 L^{3/2}\operatorname {tr}(S_rK_T)\longrightarrow0.   \tag{4.4}
\]

It is often convenient to normalize the covariance profile:

\[
 \overline\Theta_{m,T}(u)
 ={\Theta_{m,T}(u)\over\operatorname {tr}(K_m)}       \tag{4.5}
\]

when \(K_m\ne0\).  A compact sufficient form is

\[
 \operatorname {tr}(K_m)
 \left\{\overline\Theta_{m,T}(u_L)+{r\over u_L}\right\}
 =o(L^{-3/2}).                                        \tag{4.6}
\]

Unlike the scalar-floor target, (4.6) is an average principal-angle
condition in the exact time-band covariance.  It is still source-specific:
the spectral projector in (3.1) belongs to the complete combined operator
\(B\), and neither its trace nor its orientation can be inferred from an
eigenvalue list for \(K_T\).

## 5. Strictness and failure modes

The improvement from (0.2) to (0.4) can be arbitrarily large.  On a
one-dimensional moment space take

\[
 B=r=1,\qquad K_T=\varepsilon I.                      \tag{5.1}
\]

Then

\[
 r\operatorname {tr}(C_r^{-1})={1\over2},
 \qquad
 \mathcal L_{r,m,T}={\varepsilon\over2}.              \tag{5.2}
\]

This model only establishes strict logical weakening.  It is not the
actual time-band/moment geometry.

The new trace target must not be misread in either direction.

1. A small \(\Theta_{m,T}(u)\) does not prove the complete sector sign
   \(B>0\); that sign is a premise of the residual-ridge argument and must
   be proved independently at the same source-derived shift.
2. Separate spectra of \(K_T\) and \(B\) do not determine (3.1).  Their
   joint orientation remains essential.
3. The raw compression \(P_m(B+rI)P_m\) cannot replace \(R_m\).  Equation
   (2.2) uses the compression of the complete inverse and therefore retains
   every low--high Schur feedback term.
4. A point diagnostic of (0.4) or (0.6) is not an unbounded estimate.
5. Replacing \(K_m\) by the identity recovers the older sufficient floor
   route and discards the refinement proved here.

## 6. Remaining source theorem

On one deterministic unbounded schedule, first prove both strict shifted
sector signs for the exact source matrix.  Then, for each fixed \(T>0\),
prove (0.8) for the declared moment range, or prove directly that

\[
 r\operatorname {tr}(K_mR_m)=o(L^{-3/2}).             \tag{6.1}
\]

Together with (4.2), this closes the residual-ridged fixed-window observable.
It does not by itself prove the separate labelled pole-load ordering, the
full equation (5.2), or locally uniform determinant convergence.

The exact point implementation should serialize \(G,K_U,R_U\), the scalar
in (2.6), the weighted profile (3.1), and the unweighted profile separately.
Producer and verifier must rebuild the source matrix, projected prolate
state, moment columns, and time-band matrix rather than trusting cached
eigensystems or pass booleans.  If they share a transcendental arithmetic
library, that limitation must be stated.
