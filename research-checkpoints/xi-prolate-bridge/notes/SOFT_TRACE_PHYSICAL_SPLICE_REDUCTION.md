# Soft-trace physical splice and fixed-window obstruction

## 0. Scope and outcome

This note connects the residual-ridged target in
RAYLEIGH_SELF_REGULARIZED_OBSERVABLE.md to the repository's physical
short, leverage-deficit, compressed-multiplier, and time--band machinery.
It proves two exact finite identities and one exact inequality.

On the inversion-even anchor complement \(\mathcal K\), let

\[
 B=A-qI>0,\qquad r=\|b\|>0,\qquad S_r=r(B+rI)^{-1}.       \tag{0.1}
\]

For the exact bounded-frequency concentration operator

\[
 \langle f,K_Tf\rangle
 =\int_{-T}^T|\widehat f(t)|^2{dt\over2\pi},             \tag{0.2}
\]

the target is

\[
 L^{3/2}\operatorname {tr}(S_rK_T)\longrightarrow0.     \tag{0.3}
\]

For every declared physical projection \(P\) in \(\mathcal K\), put
\(H=I-P\) and let \(C_r\) be the exact Schur complement of \(B+rI\)
to \(P\mathcal K\).  Then

\[
 \boxed{
 \sqrt{\operatorname {tr}(S_rK_T)}
 \leq
 \sqrt{r\operatorname {tr}(C_r^{-1})}
 +\sqrt{\operatorname {tr}(HK_TH)}.}                    \tag{0.4}
\]

Thus the soft trace separates into a regularized signed physical solve and
a fixed-window physical leverage deficit.  There is also the exact
spectral-layer identity

\[
 \boxed{
 \operatorname {tr}(S_rK_T)
 =\int_0^\infty {r\over(u+r)^2}
   \operatorname {tr}\{\mathbf1_{(0,u]}(B)K_T\}\,du.}    \tag{0.5}
\]

It identifies the remaining quantity as the joint overlap of the low
\(B\) layers with the fixed time band.  Existing source theorems do not
bound that overlap on an unbounded schedule.  The compressed-multiplier
theorem bounds dimensions or total traces, while the current central
graph-spill theorem treats only the shrinking band
\(\lvert t\rvert\leq\delta/L\).  Neither implies (0.3).

All statements use the source Fourier sign, Lebesgue measure on
\([-\log\lambda,\log\lambda]\), zero extension, the source-normalized
anchor, the minus sign on the prime block, and every prime power
\(n\leq\lambda^2\).  No zeta-zero list or global Weil-positivity
hypothesis is used.  The source-specific estimates in (0.4) remain open,
so the formal state remains P0_INVALIDATED.

## 1. Locked source setting

Put

\[
 L=2\log\lambda,\qquad I_\lambda=[-L/2,L/2],\qquad
 \widehat f(t)=\int_{I_\lambda}f(x)e^{-itx}\,dx.         \tag{1.1}
\]

Inversion is reflection and physical functions are extended by zero.  The
projected arithmetic state is formed in the locked order

\[
 p=P_Nk_\lambda^+=a_\kappa\kappa,\qquad
 \|\kappa\|=1,\qquad a_\kappa=\|P_Nk_\lambda^+\|.        \tag{1.2}
\]

The scalar \(a_\kappa\) is fixed by the source limit of \(h_\lambda\); it is not
obtained by replacing \(h_\lambda\) with a unit-norm state.  At the raw
Rayleigh shift,

\[
 Q_+=\begin{pmatrix}q&b^*\\b&A\end{pmatrix}
 \quad\hbox{on}\quad
 \mathbb C\kappa\oplus\mathcal K,\qquad B=A-qI>0.       \tag{1.3}
\]

For any \(g>0\), the exact source multiplier decomposition restricted to
\(\mathcal K\) is

\[
 B=gI+C-R,\qquad
 C=T_a+2|P_{\mathcal K}p_+\rangle
              \langle P_{\mathcal K}p_+|\succeq0,\qquad
 R=T_v\succeq0,                                         \tag{1.4}
\]

where

\[
 m_\lambda(t)=2\theta'(t)
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n),                 \tag{1.5}
\]

\[
 w=m_\lambda-q,\qquad
 a(t)=[w(t)-g]_+,\qquad v(t)=[g-w(t)]_+.                \tag{1.6}
\]

The \(-2\) in (1.5) is the locked minus-prime sign.  The positive parts in
(1.6) are taken only after archimedean--prime cancellation.

## 2. Exact physical splice

Let \(P\) be any orthogonal projection on \(\mathcal K\), put \(H=I-P\),
and use block notation relative to \(P\mathcal K\oplus H\mathcal K\).
Since \(B>0\),

\[
 D_r:=B_{HH}+rI_H>0.                                    \tag{2.1}
\]

Define the \(r\)-regularized signed Schur complement

\[
 \boxed{
 C_r=B_{PP}+rI_P-B_{PH}D_r^{-1}B_{HP}>0.}               \tag{2.2}
\]

Block inversion gives the exact identity

\[
 \boxed{P(B+rI)^{-1}P=C_r^{-1}.}                        \tag{2.3}
\]

This is not the inverse of the raw compression \(B_{PP}+rI_P\): the
complete low--high coupling in (2.2) is mandatory.

### Theorem 2.1 (physical soft-trace splice)

If \(0\preceq K\preceq I\) is any positive contraction, then

\[
 \boxed{
 \sqrt{\operatorname {tr}(S_rK)}
 \leq
 \sqrt{r\operatorname {tr}(C_r^{-1})}
 +\sqrt{\operatorname {tr}(HKH)}.}                     \tag{2.4}
\]

**Proof.**  Finite-dimensional trace duality gives

\[
 \operatorname {tr}(S_rK)
 =\|S_r^{1/2}K^{1/2}\|_{\rm HS}^2.                     \tag{2.5}
\]

Insert \(I=P+H\) between the square roots and use the Hilbert--Schmidt
triangle inequality:

\[
 \|S_r^{1/2}K^{1/2}\|_{\rm HS}
 \leq\|S_r^{1/2}PK^{1/2}\|_{\rm HS}
      +\|S_r^{1/2}HK^{1/2}\|_{\rm HS}.                 \tag{2.6}
\]

Because \(0\preceq K\preceq I\) and \(0\prec S_r\prec I\),

\[
 \|S_r^{1/2}PK^{1/2}\|_{\rm HS}^2
 \leq\operatorname {tr}(PS_rP),                        \tag{2.7}
\]

\[
 \|S_r^{1/2}HK^{1/2}\|_{\rm HS}^2
 \leq\operatorname {tr}(HKH).                          \tag{2.8}
\]

Finally, (2.3) gives

\[
 \operatorname {tr}(PS_rP)
 =r\operatorname {tr}(C_r^{-1}).                       \tag{2.9}
\]

Equations (2.5)--(2.9) prove (2.4).  \(\square\)

Apply the theorem with \(K=K_T\).  Its high term has the exact physical
leverage form

\[
 \boxed{
 \operatorname {tr}(HK_TH)
 =\int_{-T}^T\kappa_H(t){dt\over2\pi},\qquad
 \kappa_H(t)=\langle e_t,He_t\rangle.}                 \tag{2.10}
\]

Here \(e_t=P_{\mathcal K}(x\mapsto e^{itx})\) is the Riesz evaluation vector
on \(\mathcal K\).  Zero-extension Plancherel gives
\(0\preceq K_T\preceq I\), so Theorem 2.1 applies with no hidden band factor.

Thus a sufficient source condition for (0.3) is

\[
 \sqrt{r\operatorname {tr}(C_r^{-1})}
 +\sqrt{\operatorname {tr}(HK_TH)}
 =o(L^{-3/4}).                                          \tag{2.11}
\]

For example, if \(d_P=\operatorname {rank}P\) and
\(C_r\succeq c_rI_P\), then

\[
 r\operatorname {tr}(C_r^{-1})\leq{rd_P\over c_r}.     \tag{2.12}
\]

The exact signed factorization in
PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md applies directly to \(C_r\): apply its
Section 2 to
\(B+rI=(g+r)I+X^*X-Y^*Y\), with the same complete source features.
Hence (2.2) introduces no unpinned operator.  What is missing is a
favorable actual-source bound for its inverse trace, together with the
fixed-window capture rate in (2.10).

For comparison, a global floor \(B\succeq\beta I\) gives the coarser bound

\[
 \operatorname {tr}(S_rK_T)
 \leq {r\over\beta+r}\operatorname {tr}K_T
 \leq {r\over\beta+r}{LT\over\pi}.                     \tag{2.13}
\]

Thus \(L^{5/2}r/(\beta+r)\to0\) would suffice.  No such
actual-source floor/rate pair is presently proved, and (2.4) permits a
more anisotropic route.

## 3. Exact spectral layers and the multiplier-rank limitation

Let

\[
 E_u=\mathbf1_{(0,u]}(B).                               \tag{3.1}
\]

For every scalar \(\beta>0\),

\[
 {r\over\beta+r}
 =\int_0^\infty {r\over(u+r)^2}
                 \mathbf1_{\{\beta\leq u\}}\,du.        \tag{3.2}
\]

Finite spectral calculus and Tonelli's theorem therefore prove

\[
 S_r=\int_0^\infty {r\over(u+r)^2}E_u\,du,              \tag{3.3}
\]

\[
 \boxed{
 \operatorname {tr}(S_rK_T)
 =\int_0^\infty {r\over(u+r)^2}
                  \operatorname {tr}(E_uK_T)\,du.}     \tag{3.4}
\]

Equation (3.4) is the exact low-energy/time-band overlap profile.  It is
strictly stronger data than the eigenvalue list of either factor alone.

The compressed-multiplier reduction enters through (1.4).  If
\(0<u<g\), then on \(\operatorname {ran}E_u\),

\[
 E_uRE_u=gE_u+E_uCE_u-E_uBE_u\succeq(g-u)E_u.           \tag{3.5}
\]

Consequently

\[
 \operatorname {rank}E_u
 \leq{\operatorname {tr}(E_uRE_u)\over g-u}
 \leq{\operatorname {tr}R\over g-u}.                   \tag{3.6}
\]

This is the same kind of dangerous-dimension information supplied by the
compressed-multiplier trace theorem.  But (3.4) needs
\(\operatorname {tr}(E_uK_T)\).  The only orientation-free consequence is

\[
 \operatorname {tr}(E_uK_T)\leq\operatorname {rank}E_u, \tag{3.7}
\]

which does not become small merely because the rank is polynomially
bounded.  The sharper exact inequality

\[
 (g-u)\operatorname {tr}(E_uK_T)
 \leq\operatorname {tr}\{(E_uRE_u)(E_uK_TE_u)\}         \tag{3.8}
\]

still contains the missing joint orientation.  Total multiplier trace,
phase volume, or a dangerous-space dimension cannot replace it.

## 4. Why shrinking-band capture does not give fixed-window capture

The covariance graph-spill theorem currently controls

\[
 B_\delta=[-\delta/L,\delta/L].                         \tag{4.1}
\]

The operator in (0.2), however, uses the fixed band \([-T,T]\).  This scale
difference is substantive.  Fix \(0<t_0<T\) and take

\[
 f_L(x)=L^{-1/2}e^{it_0x},\qquad |x|\leq L/2.           \tag{4.2}
\]

Then

\[
 \widehat f_L(t)
 ={2\sin((t-t_0)L/2)\over\sqrt L\,(t-t_0)}.            \tag{4.3}
\]

For \(L>2\delta/t_0\), elementary integration gives

\[
 \int_{|t|\leq\delta/L}|\widehat f_L(t)|^2{dt\over2\pi}
 \leq {4\delta\over
  \pi L^2(t_0-\delta/L)^2}\longrightarrow0,             \tag{4.4}
\]

whereas Plancherel and \(|\sin|\leq1\) give

\[
 \int_{-T}^T|\widehat f_L(t)|^2{dt\over2\pi}
 \geq1-{2\over\pi L}
 \left({1\over T-t_0}+{1\over T+t_0}\right)
 \longrightarrow1.                                     \tag{4.5}
\]

Along compatible subsequences with \(t_0=2\pi n/L\), this is exactly one of
the centered Fourier modes used by the finite source compression.  More
generally one may take the nearest centered mode `n_L`, whose frequency
tends to the fixed interior value `t_0`, and the same two estimates hold for
all sufficiently large `L`.  Hence a theorem that captures only (4.1) cannot
be substituted for the fixed-window high trace in (2.10).

## 5. Exact two-dimensional orientation obstruction

Separate spectra, ranks, and traces of \(S_r\) and \(K_T\) do not determine
their overlap.  For integers \(M\geq2\), put

\[
 r_M=M^{-2},\qquad
 B_M=\begin{pmatrix}r_M&0\\0&1\end{pmatrix},\qquad
 S_M=r_M(B_M+r_MI)^{-1}
 =\begin{pmatrix}1/2&0\\0&r_M/(1+r_M)\end{pmatrix}.     \tag{5.1}
\]

Use the isospectral positive contractions

\[
 K_M^\parallel=\begin{pmatrix}1&0\\0&0\end{pmatrix},
 \qquad
 K_M^\perp=\begin{pmatrix}0&0\\0&1\end{pmatrix}.        \tag{5.2}
\]

They have identical rank, trace, Hilbert--Schmidt norm, and eigenvalue
multiset, while \(B_M\) and \(r_M\) are unchanged.  Nevertheless

\[
 \operatorname {tr}(S_MK_M^\parallel)={1\over2},
 \qquad
 \operatorname {tr}(S_MK_M^\perp)={1\over M^2+1}.       \tag{5.3}
\]

Therefore

\[
 M^{3/2}\operatorname {tr}(S_MK_M^\parallel)
 \longrightarrow\infty,\qquad
 M^{3/2}\operatorname {tr}(S_MK_M^\perp)
 \longrightarrow0.                                     \tag{5.4}
\]

This is a structural orientation model, not an arithmetic Weil matrix.
It proves that separate compressed-multiplier and time-band spectral data
cannot imply (0.3).  Their joint physical alignment, measured by (2.4) or
(3.4), is indispensable.

## 6. Exact remaining source theorem

On one common unbounded source schedule, it is sufficient to prove

\[
 r\operatorname {tr}(C_r^{-1})=o(L^{-3/2}),\qquad
 \operatorname {tr}(HK_TH)=o(L^{-3/2})                 \tag{6.1}
\]

for one declared physical range \(P\), or any sharper joint estimate making
the right side of (2.4) \(o(L^{-3/4})\).  The first term must use the
complete signed Schur complement, and the second must cover the fixed
window \([-T,T]\), not only a shrinking central band.

Alternatively, one may prove the layer-profile estimate in (3.4) directly.
The physical soft-short theorem supplies an exact algebraic factorization
of \(C_r\); the physical leverage identity supplies (2.10); the
compressed-multiplier theorem supplies only (3.6)-type information; and
the current graph-spill theorem supplies only shrinking-band capture.  No
existing actual-source estimate closes (6.1), so this note proves neither
the unbounded shifted sector signs nor the determinant limit.
