# Actual phase-volume centered-PNT remainder reduction and barrier

## 1. Scope and frozen inputs

This note isolates the exact arithmetic statistic which remains after the
continuous prime-number-theorem main density is removed from the complete
source multiplier.  The result is a one-way sufficient reduction.  It is
not an equivalence, a polynomial phase-volume theorem, or a lower bound for
the actual phase volume.

No zero table, Weil-positivity assumption, random-phase law, or numerical
source sample is used.  In particular, none of the heuristic conclusions in
the earlier phase-volume audit is used in a theorem below.  The exact local
dependencies are:

| Frozen path | SHA-256 |
|---|---|
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` | `c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81` |
| `tests/test_parity_multiplier_schur.py` | `94ee818e2747e703d521cfa2a980765569cccfdf442b700b1a6b33ac4ceababb` |
| `notes/PHASE_VOLUME_SCALE_AUDIT.md` | `bae7414fed2ac861ac3211175cd8f8b7743c33bd37379e186a71d700554b7fcd` |
| `notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md` | `ec2881e0f233c2c57101e960e3b43cd0abfbf9ee25f342f08a01f35827883d7f` |
| `tests/test_compressed_multiplier_trace.py` | `ff7740f0e07db3674693a92e888935578036e4a745768bf47b10aea2c6a76f9c` |
| `notes/GROWING_RETAINED_NEGATIVE_INDEX_CAPTURE_BARRIER.md` | `9fc64fedde255791775861e7a3bb2b2d55eab1a3d402cf8b842d9e0d8519424c` |
| `tests/test_growing_retained_negative_index_capture_barrier.py` | `1e6067e8e4795eac284a8efc12bfc235ff7a6590efce28428b4569320257c4aa` |
| `notes/CUTOFF_FREE_MULTI_ANCHOR_GROUND_FRAME_BARRIER.md` | `2e07843d54f00bce9e53afadc0b434efbaf8f97da95dadda54225de6cfecb34d` |
| `tests/test_cutoff_free_multi_anchor_ground_frame_barrier.py` | `0fdc307a051d50ff4ece21ae8b01f89b745a14788f093ec4127f5da6026bde9f` |

The Fiori--Kadiri--Swidinsky input is used only in Section 5, through the
already-pinned source lock.  Sections 2--4 are internal consequences of the
complete multiplier, the locked digamma inequality, and elementary
Stieltjes calculus.

## 2. Complete symbol and the centered PNT split

Fix `lambda>1` and put

\[
 x=\lambda^2,\qquad \ell=\log\lambda,\qquad L=2\ell.       \tag{2.1}
\]

The complete inclusive prime polynomial and multiplier are

\[
 D_\lambda(t)=
 \sum_{1<n\leq x}{\Lambda(n)\over\sqrt n}e^{it\log n},
 \qquad
 m_\lambda(t)=2\theta'(t)-2\operatorname {Re}D_\lambda(t).
                                                                    \tag{2.2}
\]

Every prime power at `n<=lambda^2` is included.  The prime sign in
`m_lambda` is minus.  Set

\[
 c_0=\psi(1/4)-\log\pi,
 \qquad h(t)={1\over2}\log(1+4t^2).                    \tag{2.3}
\]

The locked digamma estimate is

\[
 2\theta'(t)\geq c_0+h(t).                              \tag{2.4}
\]

For real `U,g`, the exact phase volume is

\[
 \Phi_\lambda(U,g)=
 \int_{\mathbb R}[g+U-m_\lambda(t)]_+\,dt.             \tag{2.5}
\]

Remove the continuous PNT main density before taking an absolute value:

\[
 M_\lambda(t)=\int_1^x u^{-1/2+it}\,du
 = {\lambda e^{iLt}-1\over1/2+it},
 \qquad R_\lambda(t)=D_\lambda(t)-M_\lambda(t).         \tag{2.6}
\]

This is an exact finite identity, not an asymptotic PNT replacement.  If

\[
 \psi_C(u)=\sum_{1<n\leq u}\Lambda(n),
 \qquad E_\lambda(u)=\psi_C(u)-u+1\quad(1\leq u\leq x), \tag{2.7}
\]

then `E_lambda(1)=0`, `dE_lambda=dpsi_C-du`, and the inclusive Stieltjes
formula gives

\[
 \boxed{
 R_\lambda(t)=\int_{1^-}^x u^{-1/2+it}\,dE_\lambda(u).} \tag{2.8}
\]

Stieltjes integration by parts, with no lower endpoint term, gives the
equivalent ordinary-Chebyshev-error formula

\[
 \boxed{
 R_\lambda(t)=x^{-1/2+it}E_\lambda(x)
 +\left({1\over2}-it\right)
       \int_1^xE_\lambda(u)u^{-3/2+it}\,du.}            \tag{2.9}
\]

Thus `R_lambda`, rather than the full prime polynomial, is the centered
actual arithmetic remainder.

## 3. Exact one-way phase-volume reduction

Fix `0<alpha<1`, and define

\[
 C=C_\lambda(U,g):=g+U-c_0.                              \tag{3.1}
\]

Define the nonnegative centered-remainder statistic

\[
 \boxed{
 \mathfrak R_{\lambda,\alpha}:=
 \int_{\mathbb R}
 \left[2\operatorname {Re}R_\lambda(t)
             -(1-\alpha)h(t)\right]_+\,dt.}             \tag{3.2}
\]

It is finite: `D_lambda` is a finite trigonometric polynomial,
`M_lambda` is bounded, and `h(t)` tends to infinity.  From (2.4)--(2.6),

\[
 g+U-m_\lambda(t)
 \leq C-h(t)+2\operatorname {Re}M_\lambda(t)
                   +2\operatorname {Re}R_\lambda(t).    \tag{3.3}
\]

The elementary inequality `[a+b]_+<=[a]_++[b]_+` therefore proves

\[
 \boxed{
 \Phi_\lambda(U,g)
 \leq\mathfrak M_{\lambda,\alpha}(C)
              +\mathfrak R_{\lambda,\alpha},}           \tag{3.4}
\]

where

\[
 \mathfrak M_{\lambda,\alpha}(C)=
 \int_{\mathbb R}
 [C-\alpha h(t)+2\operatorname {Re}M_\lambda(t)]_+\,dt. \tag{3.5}
\]

No reverse inequality is asserted.  In particular, cancellation between
the two brackets in (3.3) can make `Phi_lambda` smaller than their separate
positive parts.

The continuous main term has an explicit polynomial bound.  Put

\[
 F(a)=
 \begin{cases}
 0,&a\leq0,\\
 \sqrt{e^{2a}-1}-\arctan\sqrt{e^{2a}-1},&a>0,
 \end{cases}                                             \tag{3.6}
\]

and

\[
 T_{\lambda,\alpha}(C)=
 \max\left\{2(\lambda+1),{1\over2}e^{(C+1)/\alpha}\right\}.
                                                            \tag{3.7}
\]

Since

\[
 |M_\lambda(t)|\leq{\lambda+1\over\sqrt{t^2+1/4}},     \tag{3.8}
\]

one has `2|M_lambda(t)|<=1` when `|t|>=2(lambda+1)`.  Also
`h(t)>=log(2|t|)`.  Consequently the integrand in (3.5) vanishes outside
`[-T_(lambda,alpha)(C),T_(lambda,alpha)(C)]`.  On that interval,

\[
 [C-\alpha h+2\operatorname {Re}M_\lambda]_+
 \leq[C-\alpha h]_++2|M_\lambda|.                       \tag{3.9}
\]

The exact integral used in the earlier phase audit and one elementary
antiderivative now give

\[
 \boxed{
 \mathfrak M_{\lambda,\alpha}(C)
 \leq \alpha F(C/\alpha)
 +4(\lambda+1)\operatorname {arsinh}
                    (2T_{\lambda,\alpha}(C)).}           \tag{3.10}
\]

Indeed,

\[
 \int_{\mathbb R}[C-\alpha h(t)]_+\,dt
       =\alpha F(C/\alpha),                               \tag{3.11}
\]

and

\[
 2\int_{-T}^{T}|M_\lambda(t)|\,dt
 \leq4(\lambda+1)\operatorname {arsinh}(2T).             \tag{3.12}
\]

Equations (3.4) and (3.10) are the advertised exact reduction.

## 4. Bounded and logarithmic retained schedules

The bounded-gap schedule is the cleanest interface with the retained-index
bound.  Suppose

\[
 g=O(1),\qquad U=O(1),\qquad g-\delta\geq\eta>0,       \tag{4.B1}
\]

with `eta` fixed, and choose any fixed `0<alpha<1`.  The cutoff-free route
has the stronger `U=U_Z->0`.  Now `C=O(1)` and
`T_(lambda,alpha)(C)=O(lambda)`, so (3.10) proves

\[
 \boxed{
 \mathfrak M_{\lambda,\alpha}(C)=O(\lambda L)
       =o\!\left({\lambda^2\over L}\right).}           \tag{4.B2}
\]

Consequently

\[
 \mathfrak R_{\lambda,\alpha}\ll{\lambda^2\over L}   \tag{4.B3}
\]

is sufficient for `Phi_lambda(U,g)=O(lambda^2/L)`.  The conversion to the
frozen notation has an exact factor two:

\[
 {\lambda^2\over\log\lambda}={2\lambda^2\over L}.       \tag{4.B3a}
\]

Thus a constant `K_log` in
`Phi_lambda<=K_log*lambda^2/log(lambda)` is the constant `K=2*K_log` in
the `lambda^2/L` normalization below.

The exact retained-index theorem is

\[
 n_-\!\left(PH_uP\right)
 \leq {L\Phi_\lambda(U_Z,g)\over2\pi(g-\delta)}.       \tag{4.B4}
\]

Thus, if `Phi_lambda(U_Z,g)<=K*lambda^2/L`, (4.B1) gives

\[
 \boxed{
 n_-\!\left(PH_uP\right)
 \leq {K\over2\pi\eta}\lambda^2.}                    \tag{4.B5}
\]

For the concrete choice `g=1`, `delta=1/2`, this is
`n_-(PH_uP)<=K*lambda^2/pi`.  Equivalently, the frozen normalization gives
`n_-(PH_uP)<=2*K_log*lambda^2/pi`.  No hidden dimension factor occurs.

For comparison, take the logarithmic retained-multiplier schedule below.

Take the retained-multiplier schedule

\[
 g=\kappa L,\qquad U=O(1),\qquad
 \delta=\rho g,\qquad0<\kappa,\rho<1,                   \tag{4.1}
\]

and choose any fixed

\[
 \kappa<\alpha<1.                                        \tag{4.2}
\]

The cutoff-free route has the stronger `U=U_Z->0`, so it is covered by
(4.1).  Since

\[
 C=2\kappa\ell+O(1),qquad
 T_{\lambda,\alpha}(C)
 =O\!\left(\lambda^{\max(1,2\kappa/\alpha)}\right),      \tag{4.3}
\]

and `2*kappa/alpha<2`, (3.10) proves

\[
 \boxed{
 \mathfrak M_{\lambda,\alpha}(C)
 =O(\lambda^{2\kappa/\alpha}+\lambda\log\lambda)
 =o\!\left({\lambda^2\over\log\lambda}\right).}       \tag{4.4}
\]

In this regime (4.B4) reads exactly

\[
 n_-\!\left(PH_uP\right)
 \leq{\Phi_\lambda(U_Z,\kappa L)
              \over2\pi\kappa(1-\rho)}.                \tag{4.L1}
\]

Thus the weaker phase-volume scale `O(lambda^2)` already gives an
`O(lambda^2)` index.  The stronger target
`O(lambda^2/log(lambda))` gives an
`O(lambda^2/log(lambda))` index.  By contrast, the bounded-gap schedule
needs the stronger target to obtain the exact `O(lambda^2)` dimension in
(4.B5).

Therefore the new actual-arithmetic estimate

\[
 \mathfrak R_{\lambda,\alpha}
 \ll{\lambda^2\over\log\lambda}                         \tag{4.5}
\]

would be sufficient for the frozen phase-volume target.  Equation (4.5) is
not proved here.

The already-proved absolute source envelope removes a larger elementary
low-time region.  Write

\[
 \Sigma_\lambda=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n},
 \qquad T_0={\lambda\over(\log\lambda)^2},               \tag{4.6}
\]

and define

\[
 \mathfrak R^{\rm hi}_{\lambda,\alpha}:=
 \int_{|t|>T_0}
 \left[2\operatorname {Re}R_\lambda(t)
             -(1-\alpha)h(t)\right]_+\,dt.              \tag{4.7}
\]

The bounds `|D_lambda|<=Sigma_lambda` and
`|M_lambda|<=2(lambda+1)` imply

\[
 0\leq\mathfrak R_{\lambda,\alpha}
       -\mathfrak R^{\rm hi}_{\lambda,\alpha}
 \leq4T_0\{\Sigma_\lambda+2(\lambda+1)\}.               \tag{4.8}
\]

The pinned all-range estimate

\[
 \Sigma_\lambda\leq C_\psi(2\lambda-1),\qquad
 C_\psi=1+9.22022
       \left({3\over0.8476836}\right)^3e^{-3},            \tag{4.9}
\]

makes (4.8) `O(lambda^2/(log lambda)^2)`.  Combining (3.4),
(4.B2), and (4.8) gives, for the bounded schedule,

\[
 \boxed{
 \Phi_\lambda(U,g)
 \leq o\!\left({\lambda^2\over\log\lambda}\right)
       +\mathfrak R^{\rm hi}_{\lambda,\alpha}.}          \tag{4.B6}
\]

Combining (3.4), (4.4), and (4.8) gives the same sharper one-way reduction
for the logarithmic schedule:

\[
 \boxed{
 \Phi_\lambda(U,\kappa L)
 \leq o\!\left({\lambda^2\over\log\lambda}\right)
       +\mathfrak R^{\rm hi}_{\lambda,\alpha}.}          \tag{4.10}
\]

Thus, in both schedules, the minimal remaining statistic in this route is
the centered Chebyshev-error phase mass (4.7), on actual times
`|t|>lambda/(log lambda)^2`.  A bound

\[
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \ll{\lambda^2\over\log\lambda}                         \tag{4.11}
\]

is sufficient.  Again, no converse is claimed.

## 5. What the pinned PNT error controls

For a finite quantitative audit, put

\[
 A=9.22022,\qquad a=0.8476836,
 \qquad c_a={1\over2}-{a^2\over24}>0.                   \tag{5.1}
\]

For `lambda>sqrt(2)`, the pinned FKS inequality and (2.7) give

\[
 {|E_\lambda(x)|\over\lambda}
 \leq {1\over\lambda}
      +A\lambda L^{3/2}e^{-a\sqrt L}.                    \tag{5.2}
\]

They also give

\[
 \int_1^x|E_\lambda(u)|u^{-3/2}\,du
 \leq B_\lambda,                                        \tag{5.3}
\]

where

\[
 B_\lambda:=2+A\int_{\log2}^{L}
       e^{s/2}s^{3/2}e^{-a\sqrt s}\,ds
 \leq2+{A\over c_a}\lambda L^{3/2}e^{-a\sqrt L}.        \tag{5.4}
\]

The final inequality is fully explicit.  For
`f(s)=e^(s/2)*s^(3/2)*e^(-a*sqrt(s))`,

\[
 {f'(s)\over f(s)}
 ={1\over2}+{3\over2s}-{a\over2\sqrt s}
 \geq {1\over2}-{a^2\over24}=c_a,                       \tag{5.5}
\]

because the left side is a quadratic in `1/sqrt(s)` with its minimum at
`a/6`.  Equations (2.9) and (5.2)--(5.4) therefore prove

\[
 \boxed{
 |R_\lambda(t)|
 \leq {1\over\lambda}
      +A\lambda L^{3/2}e^{-a\sqrt L}
      +\sqrt{t^2+1/4}\,B_\lambda.}                       \tag{5.6}
\]

For every fixed `0<b<a`, (5.6) implies

\[
 \sup_{|t|\leq e^{b\sqrt L}}|R_\lambda(t)|=o(\lambda).
                                                                    \tag{5.7}
\]

This is a genuine actual-source consequence, but
`e^(b*sqrt(L))=lambda^(o(1))`; it lies far inside the already harmless
window in (4.8).  The factor `sqrt(t^2+1/4)` in (5.6) grows on the unknown
high-time region (4.7).  Hence taking absolute values in the ordinary PNT
error representation does not prove (4.11).

## 6. Mean-square and higher-moment stopping line

The obstruction is not merely the endpoint term in (2.9).  On a dyadic
block `T<=|t|<=2T`, let

\[
 H_T=(1-\alpha)\log(2T).                                  \tag{6.1}
\]

Since `h(t)>=log(2T)` on that block and

\[
 2[r-H_T/2]_+\leq{r^2\over H_T},                          \tag{6.2}
\]

one obtains the exact method bound

\[
 \int_{T\leq|t|\leq2T}
 [2\operatorname {Re}R_\lambda-(1-\alpha)h]_+\,dt
 \leq {1\over H_T}
       \int_{T\leq|t|\leq2T}(\operatorname {Re}R_\lambda)^2\,dt.
                                                                    \tag{6.3}
\]

The frozen finite mean-square theorem for `D_lambda`, together with
(3.8), makes the right side at best

\[
 O\!\left({TL^2+xL+x/T\over\log T}\right)               \tag{6.4}
\]

from the admitted all-range coefficient estimates.  This grows with `T`
and cannot be summed to prove (4.11).  It is a limitation of this
mean-square argument, not a lower bound for the actual statistic.

The earlier phase audit proves the corresponding higher-moment resolution
barrier: a degree-`k` moment has Dirichlet support through `x^k`, so an
interval of length `T` supports the standard termwise diagonalization only
when `x^k` is smaller than `T`.  The resulting `k=O(log(T)/L)` ceiling does
not provide the `lambda^2/T` saving required to sum (6.3) over all blocks.
No random-phase prediction is promoted to a theorem here.

A proof of (4.11) therefore needs new finite-orbit large-deviation or
sublevel-volume information for the actual centered transform (2.8), not
another absolute PNT envelope.  A critical-line twisted-PNT theorem used
for that purpose must be audited independently for its zero hypotheses:
ordinary PNT controls the line `Re(s)=1`, while (2.8) is a truncated Mellin
transform on `Re(s)=1/2`.  Assuming a zero-location theorem in order to
obtain the missing estimate would be circular for this program.  Even RH's
usual pointwise Chebyshev-error consequence, inserted absolutely into
(2.9), retains the growing `|t|` factor and does not by itself prove
(4.11).

## 7. Consequence for the cutoff-free route

The monotone logarithmic archimedean term and the continuous PNT main
density are now rigorously harmless at the standard retained schedule.  The
remaining sufficient target is exactly (4.11), the high-time positive-log
sublevel volume of the centered actual Chebyshev-error Mellin transform.

This note proves neither (4.11) nor its failure.  It proves no signed-sector
floor, bottom-space overlap, determinant convergence, zero-location
theorem, RH implication beyond the already-frozen conditional route, or
de Bruijn--Newman bound.  The formal state remains `P0_INVALIDATED`.
