# Regional angular budgets: exact obstructions and the surviving wedge target

## Scope and verdict

This note attacks the regional sufficient condition (34) of
`INTEGRATED_COVARIANCE_REPAIR_NEXT.md`.  It keeps the global old-block
whitening, permits indefinite regional lower blocks, and retains the exact
factor \(2\delta_{ij}a_i a_j\).

There is a rigorous obstruction to a degree-uniform positive angular gap.
At the actual first nontrivial odd extension, every nonzero regional border
is a positive scalar.  Thus every regional angle is zero for every spatial
partition.  More generally, splitting a region can increase the displayed
angular covariance only by exactly the amount by which it worsens the
scalar-anchor remainder.  Partition refinement creates no net reserve.

For a shrinking center, the useful core--tail covariance is controlled by
the projective angle between the center border and the complete border.  It
can vanish through order \(H^7\), and its relative size is always suppressed
by the smaller whitened regional mass.  Moving the cutoff far into the
Gaussian outer zone does not fix this: at fixed degree the limiting angle is
a global partial-correlation gap, for which the outer theorem supplies no
degree-uniform lower bound.

There is nevertheless a precise H5-specific candidate.  The angular gap is
bounded below by a whitened wedge determinant, which in two dimensions is an
exact squared difference of regional averages of \(c_4/c_3\).  Proving a
quantitative theta ratio gap together with mass balance and the signed
regional remainders would close that rung.  No all-degree version of those
three estimates is proved here.

## 1. Exact regional identity

Use the notation of the preceding note.  The complete old block \(A>0\),
regional borders \(b_j\), and global-whitened borders are

\[
 u_j=A^{-1/2}b_j,\qquad a_j=\|u_j\|,\qquad
 L_{\mathcal P}=\sum_j a_j.                         \tag{1}
\]

For nonzero \(u_i,u_j\), define

\[
 \delta_{ij}
 =1-\frac{\operatorname{Re}u_i^*u_j}{a_i a_j}
 \in[0,2].                                         \tag{2}
\]

The optimized scalar-anchor identity is

\[
 \boxed{\mathcal S=
 \underbrace{\sum_j(d_j-L_{\mathcal P}a_j)}
             _{\mathcal R_{\mathcal P}=d-L_{\mathcal P}^2}
 +\underbrace{2\sum_{i<j}\delta_{ij}a_i a_j}
             _{\Gamma_{\mathcal P}}.}              \tag{3}
\]

Only \(A\) is inverted.  The regional old blocks may be indefinite.  A
lower angular bound is useful only when it is coupled to a lower bound for
\(\mathcal R_{\mathcal P}\).

## 2. Actual-theta zero-angle theorem

Consider the odd \(2\)-by-\(2\) extension, namely \((r,n)=(1,1)\).  Its old
block is scalar and, on a measurable region \(E\),

\[
 b_E=2\int_E h^2c_2(h)\,dh.                         \tag{4}
\]

Write \(X=-(\log\psi)''\) and \(Y=(\log\psi)^{(4)}\).  The normalized local
moment is

\[
 \mu_2=2Y+12X^2,\qquad c_2=\frac{\psi^2}{16}\mu_2.  \tag{5}
\]

The independently audited pointwise H4 theorem proves
\(2Y+8X^2>0\) and \(X>0\).  Hence

\[
 \boxed{c_2(h)>0\quad(h\ge0).}                      \tag{6}
\]

It follows that \(b_E>0\) for every nonnull region.  Since the whitening is
one-dimensional, every \(u_E\) is a positive scalar.  Therefore, for
**every** finite or countable partition into nonnull regions,

\[
 \boxed{\delta_{ij}=0,\qquad \Gamma_{\mathcal P}=0.} \tag{7}
\]

This is an actual complete-theta obstruction, not an abstract countermodel:

> There is no constant \(\delta_*>0\) that lower-bounds the nonzero regional
> angular separations uniformly across the Bell-fiber ladder, even when the
> partition is allowed to depend on the theta source.

The established odd H3 pivot is positive; at this rung it is paid entirely
by the signed remainder in (3).  Thus angular repair is not a universal
ingredient and cannot be required at every degree.

## 3. Refinement covariance is exactly zero-sum

Suppose one region with whitened border \(u\), \(a=\|u\|\), is split into
two pieces \(u_1+u_2=u\).  Put

\[
 \tau=\|u_1\|+\|u_2\|-\|u\|\ge0.                    \tag{8}
\]

If the old partition has total length \(L\), the refined partition has
\(L'=L+\tau\).  Since
\(\Gamma_{\mathcal P}=L_{\mathcal P}^2-\|\sum_j u_j\|^2\), one has the exact
changes

\[
 \boxed{
 \Gamma_{\mathcal P'}-\Gamma_{\mathcal P}
 =2L\tau+\tau^2,\qquad
 \mathcal R_{\mathcal P'}-\mathcal R_{\mathcal P}
 =-(2L\tau+\tau^2).}                               \tag{9}
\]

Thus creating more angular covariance by refining the spatial partition
does not create any Schur margin.  It transfers exactly the same quantity
out of the signed anchor remainder.  A source-adapted partition can still
be useful if it makes independent regional estimates possible, but neither
fine angular binning nor a larger displayed \(\Gamma\) is itself progress.

## 4. Shrinking-core and mass-imbalance obstruction

For a core \(C_H=[0,H]\), let \(\beta(h)\) be the unweighted Bell border, so
that \(b(h)=2h^2\beta(h)\).  Even analyticity gives

\[
 b_C(H)=\lambda_H\beta(0)+O(H^5),\qquad
 \lambda_H=\frac{2H^3}{3}.                         \tag{10}
\]

Set

\[
 v_0=A^{-1/2}\beta(0),\qquad U=A^{-1/2}b.           \tag{11}
\]

Assume \(v_0,U\ne0\).  Then

\[
 u_C=\lambda_Hv_0+O(H^5),\qquad
 u_T=U-\lambda_Hv_0+O(H^5),                        \tag{12}
\]

and consequently

\[
 \boxed{
 \delta_{C,T}(H)
 =1-\frac{\operatorname{Re}v_0^*U}{\|v_0\|\|U\|}
  +O(H^2),}                                        \tag{13}
\]

\[
 \boxed{
 \Gamma_{C,T}(H)
 =2\lambda_H\bigl(\|v_0\|\|U\|
       -\operatorname{Re}v_0^*U\bigr)+O(H^5).}     \tag{14}
\]

If \(v_0\) is a positive multiple of \(U\), the leading bracket vanishes.
The two directions then differ by \(O(H^2)\), so

\[
 \delta_{C,T}(H)=O(H^4),\qquad
 \Gamma_{C,T}(H)=O(H^7).                           \tag{15}
\]

The scalar theorem (7) realizes the stronger identity
\(\Gamma\equiv0\).  In particular, the negative H5 center pivot and the
positive integrated H5 pivot do not by themselves force a nonzero
core--tail angle; a positive tail pivot could in principle perform the
entire repair.  This logical point has an exact block model.  Let
\(\mathcal A_0=I_2\), \(\beta_0=e_1\), and \(\delta_0=0\), so the center
pivot is \(-1\).  Let the complete matrix have
\[
 A=I_2,\qquad b=e_1,\qquad d=2,
\]
and split off \(\lambda
\begin{psmallmatrix}I_2&e_1\\e_1^*&0\end{psmallmatrix}\), \(0<\lambda<1\).
Both regional old blocks are positive, their regression vectors are exactly
the same \(e_1\), and hence their covariance is zero.  The core pivot is
\(-\lambda\), the tail pivot is \(1+\lambda\), and the complete pivot is
\(1\).  This is not a theta counterexample; it proves that the two known H5
signs alone cannot imply angular separation.

There is a second, independent obstruction.  For two regions put

\[
 w=\frac{a_C}{a_C+a_T}.
\]

Then exactly

\[
 \boxed{
 \frac{\Gamma_{C,T}}{(a_C+a_T)^2}
 =2\delta_{C,T}w(1-w)
 \le4w(1-w).}                                      \tag{16}
\]

Thus even an antiparallel angle cannot provide a fixed relative reserve
when one whitened regional mass is small.  For a shrinking core,
\(w=O(H^3)\).

As a diagnostic only, the already audited odd-degree-19 split at
\(H=1/16\) has

\[
 \delta_{C,T}\simeq0.13565,\qquad
 w\simeq0.0003493,\qquad
 \frac{\Gamma}{L^2}\simeq9.47\cdot10^{-5}.          \tag{17}
\]

The finite example is not extrapolated.  It falsifies only the intuition
that a visibly nonzero angle must provide a large budget.

Equations (3) and (14) also show why shrinking around the negative H5 fiber
does not manufacture a proof: the increase in \(\Gamma\) is subtracted
exactly from \(\mathcal R=d-L^2\), as in (9).

## 5. The far-tail angle is a global partial correlation

Fix \(n,r\) and let \(H\to\infty\).  Put \(z=\pi e^{2h}\).  The first theta
orbit and its exponentially smaller remainder give

\[
 \psi(h)=8e^{h/2}z^2e^{-z}\bigl(1+O(z^{-1})\bigr). \tag{18}
\]

For each fixed \(k\), the Bell coefficient therefore has the asymptotic

\[
 \boxed{
 c_k(h)=\psi(h)^2\frac{(2k)!}{k!}z^k
       \bigl(1+O_k(z^{-1})\bigr).}                 \tag{19}
\]

Indeed the quadratic logarithmic cumulant is \(-4za^2\); taking it \(k\)
times supplies the unique \(z^k\) term, while every higher cumulant uses
fewer factors and is lower order in \(z\).

The raw border entries are
\(2h^2c_{r+n+i}(h)\), \(0\le i<n\).  Endpoint Laplace asymptotics in the
tail integral show that its normalized raw direction tends to the last
coordinate \(e_{n-1}\).  After global whitening,

\[
 \frac{u_T(H)}{\|u_T(H)\|}
 \longrightarrow
 \frac{A^{-1/2}e_{n-1}}{\|A^{-1/2}e_{n-1}\|}.      \tag{20}
\]

When \(b\ne0\), \(u_C(H)\to U=A^{-1/2}b\), and the limiting separation is

\[
 \boxed{
 \delta_\infty
 =1-\frac{\operatorname{Re}\,b^*A^{-1}e_{n-1}}
 {\sqrt{b^*A^{-1}b}\,
  \sqrt{e_{n-1}^*A^{-1}e_{n-1}}}.}                 \tag{21}
\]

This is a global old-prefix partial-correlation gap.  The outer Gaussian
theorem proves local positivity but gives no lower bound for (21).
Moreover, if a raw direction is within \(\varepsilon\) of \(e_{n-1}\), the
naive transfer through \(A^{-1/2}\) costs

\[
 \frac{\|A^{-1/2}(x-e_{n-1})\|}
      {\|A^{-1/2}e_{n-1}\|}
 \le \sqrt{\kappa(A)}\,\varepsilon.                 \tag{22}
\]

No degree-uniform condition-number or partial-correlation estimate is
present in the current theta inputs.  Therefore moving a fixed core--tail
cutoff to the outer threshold \(H_J\) does not, by itself, produce a
degree-uniform angular gap.  The asymptotic (19)--(21) is fixed-degree; no
uniformity in growing \(n\) is asserted.

## 6. Exact projective determinant criterion

For two real regional borders define

\[
 q_i=b_i^*A^{-1}b_i=a_i^2,\qquad
 g_{ij}=b_i^*A^{-1}b_j,
\]

\[
 \Delta_{ij}=q_iq_j-g_{ij}^2\ge0.                  \tag{23}
\]

Then

\[
 \delta_{ij}=1-\frac{g_{ij}}{\sqrt{q_iq_j}},
\qquad
 \sin^2\theta_{ij}=\frac{\Delta_{ij}}{q_iq_j}.      \tag{24}
\]

Since \(1-\cos\theta\ge\frac12\sin^2\theta\),

\[
 \boxed{
 \Delta_{ij}\ge\eta q_iq_j
 \quad\Longrightarrow\quad
 \delta_{ij}\ge\frac{\eta}{2}.}                    \tag{25}
\]

A degree-uniform angular proof therefore needs a source-specific lower
bound on a \(2\)-by-\(2\) Gram determinant in the complete old-prefix
metric.  It also needs mass balance: from (16), a lower angle is ineffective
if \(a_i/L\) tends to zero.  Neither requirement follows from \(A>0\).
The exact zero-angle theorem has \(\Delta_{ij}=0\).

## 7. A concrete H5 wedge target

At odd H5 the old block has size two and

\[
 b(h)=2h^2\binom{c_3(h)}{c_4(h)}.                  \tag{26}
\]

Pointwise H3 positivity gives \(c_3(h)>0\).  Define

\[
 \mathcal R_5(h)=\frac{c_4(h)}{c_3(h)},\qquad
 m_E=\int_E2h^2c_3(h)\,dh,
\]

\[
 \overline{\mathcal R}_{5,E}
 =\frac1{m_E}\int_E2h^2c_3(h)\mathcal R_5(h)\,dh.  \tag{27}
\]

Then

\[
 b_E=m_E\binom{1}{\overline{\mathcal R}_{5,E}}.    \tag{28}
\]

For a core/tail pair, the two-dimensional wedge is exact:

\[
 \boxed{
 \Delta_{C,T}
 =\frac{m_C^2m_T^2
   \bigl(\overline{\mathcal R}_{5,T}
        -\overline{\mathcal R}_{5,C}\bigr)^2}
        {\det A}.}                                 \tag{29}
\]

Combining (25) and (29) gives

\[
 \boxed{
 \delta_{C,T}\ge
 \frac{m_C^2m_T^2
   \bigl(\overline{\mathcal R}_{5,T}
        -\overline{\mathcal R}_{5,C}\bigr)^2}
      {2\det(A)\,q_Cq_T},}                         \tag{30}
\]

and hence the exact-factor angular payment has the lower bound

\[
 2\delta_{C,T}a_Ca_T\ge
 \frac{m_C^2m_T^2
   \bigl(\overline{\mathcal R}_{5,T}
        -\overline{\mathcal R}_{5,C}\bigr)^2}
      {\det(A)\sqrt{q_Cq_T}}.                      \tag{31}
\]

This suggests a genuinely source-adapted H5 partition: separate level sets
of \(\mathcal R_5\), retaining a middle region rather than discarding it.
The outer asymptotic is

\[
 \mathcal R_5(h)=14z\bigl(1+O(z^{-1})\bigr),       \tag{32}
\]

so separated outer and inner averages are plausible at this fixed rung.
What is not proved is a global monotonicity or a quantitative average gap,
the mass balance in (16), or the signed regional remainders in (3).

The all-degree analogue of (29) would require uniform projective minors of
the regional Bell-border curve in the changing metric \(A^{-1}\).  The
pointwise outer theorem and old-prefix positivity do not supply those
minors.

## 8. Resulting obstruction and nonclaims

The natural claim

\[
 \delta_{ij}\ge\delta_*>0
\]

for a fixed core--tail rule, or even for every nonzero cell of a
source-adapted partition, is false on the actual theta ladder by (7).
Shrinking the core cannot create net reserve by (9), and a nonzero angle is
quantitatively weak under mass imbalance by (16).  Moving the tail outward
reduces the problem to the uncontrolled global partial correlation (21).

The surviving theorem-shaped target is joint, not purely angular:

1. choose a degree-dependent partition;
2. prove projective determinant bounds such as (25);
3. prove lower and upper regional mass fractions;
4. prove the signed remainder budget in (3) at the same partition.

At H5, equations (29)--(31) identify an exact ratio-average version of this
target.  No degree-uniform theta estimates establishing it are presently
available.  The note proves an obstruction to the fixed/angular-only route,
not failure of the integrated Hankel target, the endpoint sign, or RH.

The only finite data used above are the already audited degree-19 values in
(17), used as a diagnostic falsifier and not as evidence for any asymptotic
claim.

The pointwise inputs in (5)--(7) are from
`evidence/v18-curated/h4_attack_v1/H4_PROOF.md` and its independent audit.
The diagnostic in (17) is from
`evidence/v18-curated/adaptive_common_anchor_v1/certificate.json`.
The fixed-degree tail asymptotic (18)--(21) is derived here and should be
independently audited before it is used as a dependency.
