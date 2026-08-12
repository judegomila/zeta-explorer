# Fixed-window even-moment cutoff for the residual-ridged soft trace

## 0. Scope and outcome

This note closes the fixed-window high term in the physical splice of
`SOFT_TRACE_PHYSICAL_SPLICE_REDUCTION.md`.  It does not close the signed low
solve.

On the finite inversion-even anchor complement \(\mathcal K\), let

\[
 B=A-qI>0,\qquad r=\|b\|>0,\qquad
 S_r=r(B+rI)^{-1}.                                      \tag{0.1}
\]

For a fixed \(T>0\), let \(K_T\) be the exact time--band contraction.  If
\(P_m\) projects onto the first \(m\) **even physical moments** in
\(\mathcal K\), and \(H_m=I-P_m\), then

\[
 \boxed{
 \operatorname {tr}(H_mK_TH_m)
 \leq {LT\over\pi}
 { (LT/2)^{4m}
  \over (4m+1)^2\{(2m)!\}^2}.}                         \tag{0.2}
\]

This estimate is independent of the arithmetic source range and of every
prolate/source capture angle.  For the explicit choice

\[
 m=\lceil LT\rceil,                                    \tag{0.3}
\]

it gives

\[
 \operatorname {tr}(H_mK_TH_m)
 \leq {LT\over\pi(4m+1)^2}
       \left({e\over4}\right)^{4m},                   \tag{0.4}
\]

which is smaller than every fixed inverse power of \(L\).  The top \(m\)
finite prolate eigenvectors give a second, canonical projection with a high
trace no larger than (0.2).

Let \(C_{r,m}\) be the complete Schur complement of \(B+rI\) to the moment
range.  The exact splice therefore becomes

\[
 \boxed{
 \sqrt{\operatorname {tr}(S_rK_T)}
 \leq
 \sqrt{r\operatorname {tr}(C_{r,m}^{-1})}
 +\left\{ {LT\over\pi}
 { (LT/2)^{4m}
  \over (4m+1)^2\{(2m)!\}^2}\right\}^{1/2}.}          \tag{0.5}
\]

Thus, on (0.3), one sufficient remaining source estimate is

\[
 r\operatorname {tr}(C_{r,m}^{-1})=o(L^{-3/2}).        \tag{0.6}
\]

No existing coframe, compressed-multiplier, graph-spill, or projection
estimate proves (0.6).  The Gevrey projection schedule supplies an
exponentially small upper bound for \(r\), so any subexponential lower floor
for \(C_{r,m}\) on that scale would suffice; such a floor is not currently
proved.  The formal state remains `P0_INVALIDATED`.

All formulas retain the source Fourier sign, Lebesgue measure, the
zero-extension convention, the source-normalized anchor, the minus sign on
the prime block, and every prime power \(n\leq\lambda^2\).  No list of zeta zeros and no
global Weil-positivity assumption is used.

## 1. Locked finite setting

Put

\[
 L=2\log\lambda,\qquad
 I_\lambda=[-L/2,L/2],\qquad
 \widehat f(t)=\int_{I_\lambda}f(x)e^{-itx}\,dx.       \tag{1.1}
\]

Functions are extended by zero outside \(I_\lambda\), and inversion is
reflection.  Let \(\mathcal K\) be the finite inversion-even complement of
the source-normalized projected state \(\kappa\).  Define

\[
 \mathcal A_T:\mathcal K\longrightarrow
 L^2([-T,T],dt/(2\pi)),\qquad
 (\mathcal A_Tf)(t)=\widehat f(t),                     \tag{1.2}
\]

\[
 K_T=\mathcal A_T^*\mathcal A_T.                       \tag{1.3}
\]

Zero-extension Plancherel gives \(0\preceq K_T\preceq I\).  The soft-trace
target imported from `RAYLEIGH_SELF_REGULARIZED_OBSERVABLE.md` is

\[
 L^{3/2}\operatorname {tr}(S_rK_T)\longrightarrow0.   \tag{1.4}
\]

The finite operator \(B\) retains the complete combined arithmetic formula
before absolute values.  In particular, for every declared \(g>0\),

\[
 B=gI+T_a+2|p_{+,\mathcal K}\rangle
                 \langle p_{+,\mathcal K}|-T_v,       \tag{1.5}
\]

where \(a=[m_\lambda-q-g]_+\), \(v=[g-(m_\lambda-q)]_+\), and

\[
 T_a=P_{\mathcal K}a(D)P_{\mathcal K},\qquad
 T_v=P_{\mathcal K}v(D)P_{\mathcal K},\qquad
 p_{+,\mathcal K}=P_{\mathcal K}P_{E_N^+}\cosh(x/2), \tag{1.5a}
\]

all acting on \(\mathcal K\).  Here

\[
 m_\lambda(t)=2\theta'(t)
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).                \tag{1.6}
\]

The minus sign in (1.6) is not changed in any estimate below.

## 2. The explicit even-moment projection

For an integer \(m\geq1\), put

\[
 u_j=P_{\mathcal K}(x^{2j}),\qquad 0\leq j<m,          \tag{2.1}
\]

\[
 V_m=\operatorname {span}\{u_0,\ldots,u_{m-1}\},
 \qquad P_m=P_{V_m},\qquad H_m=I-P_m.                 \tag{2.2}
\]

No independence assertion is required; \(\dim V_m\leq m\).  If
\(h\in H_m\mathcal K\), then, because \(h\in\mathcal K\),

\[
 \langle h,x^{2j}\rangle
 =\langle h,P_{\mathcal K}x^{2j}\rangle=0,
 \qquad 0\leq j<m.                                   \tag{2.3}
\]

This is an exact target-space construction.  It does not require a finite
arithmetic source family to span \(V_m\).

### Theorem 2.1 (fixed-window even-moment tail)

For every finite inversion-even \(\mathcal K\subset L^2(I_\lambda)\), every
\(T>0\), and every integer \(m\geq1\),

\[
 \boxed{
 \operatorname {tr}(H_mK_TH_m)
 \leq \tau_m(L,T):={LT\over\pi}
 { (LT/2)^{4m}
  \over (4m+1)^2\{(2m)!\}^2}.}                        \tag{2.4}
\]

**Proof.**  If \(h\) is even, then

\[
 \widehat h(t)=\int_{I_\lambda}h(x)\cos(tx)\,dx.      \tag{2.5}
\]

Let

\[
 p_{m-1}(y)=\sum_{j=0}^{m-1}{(-1)^jy^{2j}\over(2j)!}.
                                                                    \tag{2.6}
\]

Taylor's integral remainder on the real axis gives

\[
 |\cos y-p_{m-1}(y)|\leq {|y|^{2m}\over(2m)!}.        \tag{2.7}
\]

The moment equations (2.3) imply that the integral of
\(h(x)p_{m-1}(tx)\) vanishes for every \(h\in H_m\mathcal K\).  If
\(h_1,\ldots,h_s\) is an orthonormal basis of \(H_m\mathcal K\), Bessel's
inequality and (2.7) give

\[
 \begin{aligned}
 \operatorname {tr}(H_mK_TH_m)
 &=\int_{-T}^T\sum_{\ell=1}^s
       |\widehat h_\ell(t)|^2{dt\over2\pi}\\
 &\leq {1\over\{(2m)!\}^2}
 \int_{-T}^T|t|^{4m}{dt\over2\pi}
 \int_{-L/2}^{L/2}|x|^{4m}\,dx.                      \tag{2.8}
 \end{aligned}
\]

The two elementary integrals are

\[
 \int_{-T}^T|t|^{4m}{dt\over2\pi}
 ={T^{4m+1}\over\pi(4m+1)},\qquad
 \int_{-L/2}^{L/2}|x|^{4m}\,dx
 ={L(L/2)^{4m}\over4m+1}.                             \tag{2.9}
\]

Substitution proves (2.4).  \(\square\)

### Corollary 2.2 (canonical finite prolate cutoff)

Let

\[
 \eta_1\geq\eta_2\geq\cdots\geq0                    \tag{2.10}
\]

be the eigenvalues of the compressed \(K_T\) on \(\mathcal K\).  Then

\[
 \boxed{\sum_{j>m}\eta_j\leq\tau_m(L,T).}            \tag{2.11}
\]

Consequently, the projection onto the top \(m\) finite prolate eigenvectors
has a complementary \(K_T\)-trace no greater than (2.4).

**Proof.**  The map

\[
 f\longmapsto
 \sum_{j=0}^{m-1}{(-1)^jt^{2j}\over(2j)!}
       \int_{I_\lambda}x^{2j}f(x)\,dx                 \tag{2.12}
\]

has rank at most \(m\).  The Hilbert--Schmidt error estimate in (2.8) is
\(\tau_m(L,T)\).  The Eckart--Young variational principle for the singular
values of \(\mathcal A_T\) gives (2.11).  Equivalently, Ky Fan's principle
says that the top spectral rank-\(m\) projector minimizes the complementary
trace among all rank-at-most-\(m\) competitors.  \(\square\)

## 3. Explicit factorial rate

The elementary factorial bound

\[
 n!\geq(n/e)^n                                          \tag{3.1}
\]

gives

\[
 { (LT/2)^{2m}\over(2m)!}
 \leq\left({eLT\over4m}\right)^{2m}.                  \tag{3.2}
\]

If \(m\geq LT\), then

\[
 \boxed{
 \tau_m(L,T)
 \leq {LT\over\pi(4m+1)^2}
       \left({e\over4}\right)^{4m}.}                 \tag{3.3}
\]

For fixed \(T>0\), the choice \(m=\lceil LT\rceil\) is \(O(L)\) and makes
the right side \(o(L^{-A})\) for every fixed \(A>0\).  On the Gevrey
schedule \(N=\lceil\lambda L^3\rceil\), one has \(m<N\) eventually, so the
cutoff is an actual proper finite-compression subspace.  No estimate proved
on another schedule is imported here.

The parity reduction matters.  A parity-blind Taylor approximation uses
all powers through degree \(d-1\), has rank \(d\), and yields the analogous
bound with \(d!\) and exponent \(2d\).  In the inversion-even complement,
only the \(m\) even moments are needed.

## 4. Exact signed Schur splice

Split

\[
 \mathcal K=V_m\oplus H_m\mathcal K.                   \tag{4.1}
\]

Since \(B>0\),

\[
 D_{r,m}=H_m(B+rI)H_m>0.                               \tag{4.2}
\]

Define the complete regularized moment Schur complement

\[
 \boxed{
 C_{r,m}=P_m(B+rI)P_m
 -P_mBH_mD_{r,m}^{-1}H_mBP_m>0.}                      \tag{4.3}
\]

The cross terms contain \(B\), rather than \(B+rI\), only because
\(P_mH_m=0\).  Block inversion gives

\[
 P_m(B+rI)^{-1}P_m=C_{r,m}^{-1}.                       \tag{4.4}
\]

The physical splice and Theorem 2.1 now prove

\[
 \boxed{
 \sqrt{\operatorname {tr}(S_rK_T)}
 \leq\sqrt{r\operatorname {tr}(C_{r,m}^{-1})}
       +\sqrt{\tau_m(L,T)}.}                          \tag{4.5}
\]

For \(m=\lceil LT\rceil\), equation (3.3) makes the second term smaller
than every inverse power of \(L\).  Hence (0.6) is sufficient for (1.4).

When \(V_m\ne\{0\}\), define

\[
 c_{r,m}=\lambda_{\min}(C_{r,m}).                     \tag{4.6}
\]

Then \(\operatorname {rank}P_m\leq m\) gives

\[
 r\operatorname {tr}(C_{r,m}^{-1})
 \leq {rm\over c_{r,m}}.                              \tag{4.7}
\]

Thus, for fixed \(T\), the scalar-floor condition

\[
 \boxed{{r\over c_{r,m}}=o(L^{-5/2})}                 \tag{4.8}
\]

is sufficient.  More precisely, the condition before replacing
\(m\) by its order is \(rm/c_{r,m}=o(L^{-3/2})\).

If \(V_m=\{0\}\), the low trace
\(r\operatorname {tr}(C_{r,m}^{-1})\) is zero by the empty-space
convention, and no scalar floor is needed.  Thus (4.6)--(4.10) are invoked
only on the nonzero moment range.

The admitted absolute endpoint estimate on the same Gevrey schedule is

\[
 r=O\!\left(e^{-c_1\lambda L^2}\right)                \tag{4.9}
\]

for some source constant \(c_1>0\).  Therefore any new actual-source bound

\[
 \log^+\!\left(c_{r,m}^{-1}\right)=o(\lambda L^2)     \tag{4.10}
\]

where \(\log^+x=\max\{0,\log x\}\), would imply (4.8).  Equation (4.10) is
only a sufficient target, not a proved estimate.

## 5. What the existing physical machinery supplies

The cutoff above resolves one of the two terms in the 0.61 physical splice:
the fixed-window physical leverage deficit.  It does so directly and does
not need any of the following unproved substitutions.

1. **Physical source capture.**  The full-source coframe theorem gives an
   explicit row floor for the unrestricted source map, and a non-effective
   finite-prefix floor at each fixed \(\lambda\).  It does not give a
   growing-schedule floor for the complete signed \(C_{r,m}\).

2. **Prolate angle or graph spill.**  Those theorems compare a prescribed
   arithmetic/prolate range with polynomial targets and currently control a
   shrinking central band.  Here \(P_m\) is itself an allowed physical
   projection in \(\mathcal K\); all its coupling to the complement is kept
   in (4.3).  No capture angle is needed for (2.4), and no angle estimate
   implies (4.8).

3. **Compressed-multiplier rank.**  A dangerous-space dimension or total
   multiplier trace does not lower-bound the signed Schur complement.  The
   negative feature may be almost critical on one of the \(O(L)\) moment
   directions.

4. **Projection and residual estimates.**  The all-order projection theorem
   and compact-BV sampling give (4.9), but an upper bound for \(r\) cannot by
   itself exclude \(c_{r,m}\asymp r\).

There is nevertheless an exact source reconstruction of (4.3).  Apply the
factorization in `PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md` to

\[
 B+rI=(g+r)I+{\cal X}_+^*{\cal X}_+
                   -{\cal Y}_+^*{\cal Y}_+,           \tag{5.1}
\]

with low space \(V_m\) and high space \(H_m\mathcal K\).  It expresses
\(C_{r,m}\) as the positive \((g+r)\)-soft short minus the complete
residualized negative feature.  The even pole stays in the positive feature,
the prime block keeps its minus sign, and all low--high coupling remains.
What is missing is a quantitative contraction margin, or an equivalent
lower bound such as (4.10).

## 6. Sharp low-term obstruction

Positivity of \(B\), exact fixed-window capture, and \(r\to0\) do not imply
(0.6).  Let \(\varepsilon_L>0\) tend to zero and take the one-dimensional
model

\[
 B_L=\varepsilon_L,qquad r_L=\varepsilon_L,qquad
 K_{T,L}=I.                                             \tag{6.1}
\]

With \(P=I\), the high trace is zero and

\[
 C_{r,L}=2\varepsilon_L,qquad
 r_L\operatorname {tr}(C_{r,L}^{-1})={1\over2},
 \qquad
 \operatorname {tr}(S_{r,L}K_{T,L})={1\over2}.        \tag{6.2}
\]

Thus the remaining floor cannot be replaced by strict positivity or by a
residual upper bound.

The exponent in the scalar-floor criterion is also sharp for information
consisting only of rank and a common floor.  On an \(s\)-dimensional low
space, take \(K_T=I\) and

\[
 B=(c-r)I,\qquad c>r.                                  \tag{6.3}
\]

Then \(C_r=cI\) and

\[
 \operatorname {tr}(S_rK_T)={rs\over c}.              \tag{6.4}
\]

For \(s\asymp L\), the target \(L^{3/2}\operatorname {tr}(S_rK_T)\to0\)
is exactly the scale \(r/c=o(L^{-5/2})\).  These are structural positive-
contraction models, not arithmetic Weil matrices.  They establish the
logical limitation of a rank-plus-floor argument without asserting that
the actual source realizes it.

## 7. Exact remaining theorem

For each fixed compact transform window \([-T,T]\), choose either

* the explicit moment range \(V_{\lceil LT\rceil}\), or
* the top \(\lceil LT\rceil\) eigenvectors of the finite compressed
  time--band operator.

The fixed-window high term then satisfies (3.3).  The residual-ridged
observable gate is reduced to the single complete-source estimate (0.6),
or to any sharper direct bound on the same signed Schur inverse.  A proof
must reconstruct \(C_{r,m}\) from (1.5)--(1.6), not from cached matrices or
producer booleans, and must retain the pole, archimedean, and inclusive
prime-power blocks before cancellation.

No current estimate proves (0.6), either shifted sector sign, or locally
uniform determinant convergence.  Numerical agreement cannot replace the
missing signed floor.

The precise imported dependencies are
`RAYLEIGH_SELF_REGULARIZED_OBSERVABLE.md` and
`SOFT_TRACE_PHYSICAL_SPLICE_REDUCTION.md` for the positive soft-trace gate,
`PROLATE_ENDPOINT_SCHUR_SINGULAR_ASYMPTOTICS.md` for (4.9), and
`PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md` for the complete signed factorization
of (4.3).  The audited non-implications use
`FULL_SOURCE_COFRAME_RANK_THEOREM.md`,
`COMPRESSED_MULTIPLIER_TRACE_THEOREM.md`,
`COVARIANCE_TANGENT_GRAPH_SPILL.md`, and
`WEIGHTED_SPECTRAL_ALIGNMENT_CHEBYSHEV_EDGE_REDUCTION.md`.
