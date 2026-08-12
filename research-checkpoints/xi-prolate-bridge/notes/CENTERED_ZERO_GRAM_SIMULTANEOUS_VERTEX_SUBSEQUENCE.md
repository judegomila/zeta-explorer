# Centered-zero Gram form and simultaneous fixed-vertex subsequences

## 0. Claim boundary

This note gives two exact reorganizations of the checkpoint-0.80 screw
route.

1.  The complete scalar-deleted discrepancy has an unconditional centered-
    zero expansion.  On RH, its finite cosine moments turn the full
    weighted-Loewner off-diagonal array into one explicit positive Gram
    matrix.  The difference between that Gram matrix and the anchored graph
    Laplacian is a diagonal row-sum defect, and that defect is exactly a
    weighted evaluation residual of the finite projected anchor at the
    `Xi` zeros.
2.  On the RH branch of the checkpoint-0.80 favorable strict-half-integer
    subsequence, the same zero expansion controls all of the resonant
    history moments for any fixed finite set of vertices.  Consequently
    `d_0,...,d_K` are simultaneously positive for every fixed `K`, and
    `d_k/d_0 -> 4` for every fixed positive `k`.

Both conclusions are conditional where explicitly labelled RH.  They do
not prove RH and cannot be inserted into a proof by assuming that the
centered zeros are imaginary.  A separate conditional theorem treats the
non-RH case only when the centered zero set has an isolated rightmost
vertical line.  No such rightmost-line gap is known for the actual zeta
zeros.  The scalar Landau argument of checkpoint 0.80 does not provide it
and does not control the vector of history moments.

Even on the simultaneous degree subsequence, every fixed principal block
has a rank-one leading limit.  Its determinants of order at least two are
therefore decided by lower-order terms of unknown sign.  No routing minor,
positive-graph connectivity, contractive routing, finite real-rootedness,
Riemann-hypothesis conclusion, or Lambda bound is proved.  The formal
project state remains `P0_INVALIDATED`.

The Platt--Trudgian verified-height input used by the separate collar note
is pinned but unreplayed.  It is not used anywhere below.  No numerical zero
table is used.  The binding finite conventions remain those of
`P0_SOURCE_LOCK.json` and `P0_NORMALIZATION_AUDIT.md`: `L=2*log(lambda)`,
centered `exp(-izt)`, Lebesgue measure, zero extension, source normalization,
the inclusive inventory `1<n<=lambda^2`, and the locked
pole--archimedean--minus-prime signs.

## 1. Unconditional centered-zero expansion

Put

\[
 X(q)=\xi_R(1/2+q),                                   \tag{1.1}
\]

where `xi_R` is the completed function in the checkpoint-0.80 central screw
note.  The functional equation makes `X` even.  Let `Z_+` contain one zero
`alpha` from each pair `{alpha,-alpha}`, with multiplicity.  Pairing
conjugates is understood.  The locked global zero count gives

\[
 \sum_{\alpha\in Z_+}|\alpha|^{-2}<\infty.            \tag{1.2}
\]

Moreover `alpha=0` is absent: `xi_R(1/2)>0`, as proved in checkpoint 0.80.
The centered paired Hadamard product is therefore

\[
 X(q)=X(0)\prod_{\alpha\in Z_+}
             \left(1-{q^2\over\alpha^2}\right),       \tag{1.3}
\]

with compact-uniform convergence.  In particular,

\[
 {X'(q)\over X(q)}
 =\sum_{\alpha\in Z_+}{2q\over q^2-\alpha^2}.         \tag{1.4}
\]

Recall the exact screw transform

\[
 \int_0^\infty e^{-qT}\Psi(T)\,dT
 ={1\over q^2}{X'(q)\over X(q)},
 \qquad \Re q>{1\over2}.                             \tag{1.5}
\]

### Theorem 1.1 (centered-zero screw and cosine moments)

Unconditionally, with locally uniform absolute convergence on every
bounded real `T` interval,

\[
 \boxed{
 \Psi(T)=\sum_{\alpha\in Z_+}
 {2\{\cosh(\alpha T)-1\}\over\alpha^2}.}              \tag{1.6}
\]

Let

\[
 a_n={2\pi n\over L},\qquad
 A_n(L)=\int_0^LR(t)\cos(a_nt)\,dt,
 \qquad g(L)=A_0(L)=-\Psi(L).                         \tag{1.7}
\]

Then, with removable resonant values understood,

\[
 \boxed{
 A_n(L)=-2\sum_{\alpha\in Z_+}
 {\cosh(\alpha L)-1\over\alpha^2+a_n^2},}             \tag{1.8}
\]

and

\[
 \boxed{
 A_n(L)-g(L)=\sum_{\alpha\in Z_+}
 {a_n^2\over\alpha^2+a_n^2}
 {2\{\cosh(\alpha L)-1\}\over\alpha^2}.}             \tag{1.9}
\]

**Proof.**  The inverse Laplace identity

\[
 \int_0^\infty e^{-qT}
 {2\{\cosh(\alpha T)-1\}\over\alpha^2}\,dT
 ={2\over q(q^2-\alpha^2)}                            \tag{1.10}
\]

and (1.2), (1.4)--(1.5) prove (1.6).  Compact-uniform
convergence also follows directly from
`|Re(alpha)|<1/2` and (1.2).

For `n>=1`, the exact integration by parts in the vertex-one barrier gives

\[
 A_n-g=-a_n\int_0^L\Psi(t)\sin(a_nt)\,dt.             \tag{1.11}
\]

Because `a_n*L=2*pi*n`, direct integration gives

\[
 \int_0^Le^{\beta t}\sin(a_nt)\,dt
 ={a_n\{1-e^{\beta L}\}\over\beta^2+a_n^2}.          \tag{1.12}
\]

Insert (1.6) into (1.11).  The constant term integrates to zero, and
(1.12) with `beta=+/-alpha` proves (1.9).  Since `g=-Psi(L)`, subtracting
one from the multiplier in (1.9) proves (1.8).  If
`alpha^2+a_n^2=0`, the numerator vanishes because `a_n*L` is an integer
multiple of `2*pi`; the original integral supplies the removable value.
\(\square\)

Equation (1.9) is an actual centered-zero identity.  It does not replace a
finite truncated transform by the meromorphic continuation of an infinite
integral.

## 2. Exact finite Gram form under RH

Assume RH only in this section.  Write the positive critical-line ordinates
as `gamma`, with multiplicity.  Then `alpha=i*gamma` in (1.8), and

\[
 \boxed{
 A_n(L)=2\sum_{\gamma>0}
 {1-\cos(\gamma L)\over a_n^2-\gamma^2}.}             \tag{2.1}
\]

Use the normalized-even anchor coordinates

\[
 F_L(t)=\sqrt L\,f_N(t)=\sum_{n=0}^Np_n\cos(a_nt),
 \qquad p_0=x_0,\quad p_n=2x_n\ (n\geq1).             \tag{2.2}
\]

For distinct `i,j`, define

\[
 D_{ij}={a_i^2A_i-a_j^2A_j\over a_i^2-a_j^2}.         \tag{2.3}
\]

The exact anchored edge weight is

\[
 w_{ij}={2\over L}p_ip_jD_{ij}.                       \tag{2.4}
\]

### Theorem 2.1 (zero-evaluation Gram decomposition)

Under RH,

\[
 \boxed{
 D_{ij}=-2\sum_{\gamma>0}
 {\{1-\cos(\gamma L)\}\gamma^2
  \over(a_i^2-\gamma^2)(a_j^2-\gamma^2)}.}           \tag{2.5}
\]

Define, with resonances interpreted by their removable limits,

\[
 v_{i\gamma}={2\over\sqrt L}
 {\sqrt{1-\cos(\gamma L)}\,\gamma p_i
  \over a_i^2-\gamma^2},                             \tag{2.6}
\]

and let `G=V*V^T`.  Then

\[
 \boxed{w_{ij}=-G_{ij}\quad(i\ne j),}                \tag{2.7}
\]

and the full graph Laplacian is exactly

\[
 \boxed{L_w=G-\operatorname {diag}(G\mathbf1).}       \tag{2.8}
\]

Thus the only difference from a positive Gram matrix is its forced row-sum
diagonal.

To identify that diagonal, put

\[
 s={\gamma L\over2\pi},\qquad
 H_N(s)=p_0+s^2\sum_{n=1}^N{p_n\over s^2-n^2}.        \tag{2.9}
\]

This is the rational factor in the exact finite projected-anchor transform.
One has

\[
 \boxed{
 \sum_{n=0}^N{p_n\over a_n^2-\gamma^2}
 =-{H_N(s)\over\gamma^2}.}                           \tag{2.10}
\]

Consequently the feature row sum is

\[
 \boxed{
 \sum_{n=0}^Nv_{n\gamma}
 =-{2\over\sqrt L}
 {\sqrt{1-\cos(\gamma L)}\over\gamma}H_N(s),}        \tag{2.11}
\]

and `G*1` is exactly the weighted collective finite-anchor evaluation
residual at the actual `Xi` zeros.

**Proof.**  For each ordinate, the divided difference in (2.3) is

\[
 {a_i^2/(a_i^2-\gamma^2)
       -a_j^2/(a_j^2-\gamma^2)\over a_i^2-a_j^2}
 =-{\gamma^2\over
 (a_i^2-\gamma^2)(a_j^2-\gamma^2)}.                  \tag{2.12}
\]

Equations (2.1)--(2.4) prove (2.5)--(2.7).  The Laplacian has off-diagonal
entries `-w_(ij)=G_(ij)` and diagonal entries

\[
 \sum_{j\ne i}w_{ij}=-\sum_{j\ne i}G_{ij}
 =G_{ii}-(G\mathbf1)_i,
\]

which proves (2.8).

Finally, `a_n=(2*pi/L)*n` gives

\[
 \sum_{n=0}^N{p_n\over a_n^2-\gamma^2}
 =\left({L\over2\pi}\right)^2
 \left\{-{p_0\over s^2}
        +\sum_{n=1}^N{p_n\over n^2-s^2}\right\}
 =-{H_N(s)\over\gamma^2},
\]

proving (2.10)--(2.11).  \(\square\)

If all active feature row sums vanished, (2.8) would reduce to the positive
Gram square `L_w=G`.  The actual finite anchor does not vanish at every
`Xi` zero.  Available local uniform convergence controls fixed compact
sets of zeros, not the collective high-zero residual in (2.11).  Therefore
(2.8) is a reduction, not a positivity theorem.

For comparison, deleting the oscillatory factors in (2.5) gives the formal
Christoffel--Darboux kernel

\[
 {x\Xi'(x)\Xi(y)-y\Xi'(y)\Xi(x)\over x^2-y^2}
 =-2\sum_{\gamma>0}\gamma^2
 {\Xi(x)\over x^2-\gamma^2}
 {\Xi(y)\over y^2-\gamma^2}.                         \tag{2.13}
\]

This conditional negative Gram identity explains the structure, but (2.5)
is the exact finite-source formula; (2.13) may not replace it.

## 3. Every fixed vertex has one controlled history moment under RH

For a fixed positive integer `k`, define

\[
 Q_{k,L}(t)=k^2\sum_{\substack{0\leq j\leq N\\j\ne k}}
 p_j{\cos(k\omega t)-\cos(j\omega t)\over k^2-j^2},
 \qquad \omega={2\pi\over L},                        \tag{3.1}
\]

\[
 S_{k,L}(t)=-p_k\{\cos(k\omega t)-1\}+Q_{k,L}(t).    \tag{3.2}
\]

For `k=0`, put `S_(0,L)=0` and `M_0=0`.  Let `E_k` be the exact all-vertex remainder in
`notes/SCREW_MARGIN_COLLECTIVE_ROUTING_RANK_ONE_BARRIER.md`.

### Proposition 3.1 (all fixed resonant moments)

For every fixed `k>=1`,

\[
 \boxed{
 E_k=\sqrt L\,J_L+{\cal M}_k(L),\qquad
 {\cal M}_k(L)=\int_0^L\Psi(t)S_{k,L}'(t)\,dt.}       \tag{3.3}
\]

Moreover

\[
 S_{k,L}(0)=S_{k,L}(L)=S_{k,L}'(0)=S_{k,L}'(L)=0.    \tag{3.4}
\]

On the natural cutoff `N=ceil(lambda)`, for each fixed `k`,

\[
 \boxed{\|S_{k,L}''\|_{L^1(0,L)}=O_k(L^{-1}).}        \tag{3.5}
\]

Finally, unconditionally,

\[
 \boxed{
 {\cal M}_k(L)=\sum_{\alpha\in Z_+}{1\over\alpha^3}
 \left\{
 \int_0^Le^{-\alpha t}S_{k,L}''(t)\,dt
 -\int_0^Le^{\alpha t}S_{k,L}''(t)\,dt
 \right\}.}                                         \tag{3.6}
\]

**Proof.**  The all-vertex formula gives

\[
 E_k=\sqrt L\,J_L-p_k(A_k-g)
 +k^2\sum_{j\ne k}p_j{A_k-A_j\over k^2-j^2}.
\]

The last two terms equal `integral(R*S_(k,L))`.  Since `R=-Psi'` and the
endpoint values in (3.4) vanish, integration by parts proves (3.3).  The
derivative endpoint values in (3.4) follow from the sine factors.

Termwise differentiation gives

\[
 Q_{k,L}''+(k\omega)^2Q_{k,L}
 =-k^2\omega^2\{F_L-p_k\cos(k\omega t)\}.             \tag{3.7}
\]

The natural source-normalized anchor has bounded `L2` norm, so

\[
 \|F_L\|_1\leq\sqrt L\|F_L\|_2=O(L).                \tag{3.8}
\]

Duhamel's formula for (3.7) gives

\[
 \|Q_{k,L}\|_\infty
 \leq k\omega\|F_L\|_1+{|p_k|k\omega L\over2}
 =O_k(1).                                            \tag{3.9}
\]

Using (3.2) and (3.7),

\[
 S_{k,L}''=-k^2\omega^2F_L
 +2p_kk^2\omega^2\cos(k\omega t)
 -k^2\omega^2Q_{k,L}.                               \tag{3.10}
\]

Equations (3.8)--(3.10), together with the fixed-mode bound
`p_k=O_k(L^(-1/2))`, prove (3.5).

For one summand in (1.6), the constant part integrates to zero by (3.4).
If

\[
 I(\beta)=\int_0^Le^{\beta t}S_{k,L}'(t)\,dt,
\]

then the derivative endpoint values in (3.4) give

\[
 I(\beta)=-{1\over\beta}
              \int_0^Le^{\beta t}S_{k,L}''(t)\,dt.   \tag{3.11}
\]

Insert `beta=+alpha` and `beta=-alpha` into (1.6).  This proves (3.6), with
compact truncation followed by the absolutely convergent limit justified by
(1.2), (3.5), and `|Re(alpha)|<1/2`.  \(\square\)

### Theorem 3.2 (RH-conditional simultaneous fixed-vertex subsequence)

Assume RH and fix `K>=1`.  There are odd integers `r_j->infinity` such that,
with

\[
 \lambda_j={r_j\over2},\qquad L_j=2\log\lambda_j,
 \qquad N_j=\lceil\lambda_j\rceil,                   \tag{3.12}
\]

one has, for all sufficiently large `j`,

\[
 \boxed{
 \Psi(L_j)>c_{\rm screw},\qquad
 d_k(L_j)>0\quad(0\leq k\leq K).}                   \tag{3.13}
\]

Moreover, for each fixed `1<=k<=K`,

\[
 \boxed{{d_k(L_j)\over d_0(L_j)}\longrightarrow4.}   \tag{3.14}
\]

**Proof.**  Use the strict-half-integer sequence constructed in the RH
branch of Theorem 3.5 of the central screw note.  It has the first inequality
in (3.13).  Under RH, (3.6) and (3.5) give

\[
 |{\cal M}_k(L)|
 \leq2\|S_{k,L}''\|_1
       \sum_{\gamma>0}\gamma^{-3}=O_k(L^{-1}).        \tag{3.15}
\]

The admitted all-order theorem gives

\[
 J_L=O_A(\lambda^{-A})\quad\hbox{for every fixed }A, \tag{3.16}
\]

and the fixed-mode theorem gives

\[
 \sqrt L\,p_0\to C,
 \qquad \sqrt L\,p_k\to2(-1)^kC\quad(k\geq1),       \tag{3.17}
\]

where `C=Xi(0)/4>0`.  Therefore, uniformly for the fixed finite set
`0<=k<=K`,

\[
 {\sqrt L|J_L|+|{\cal M}_k(L)|
  \over |p_k|\Psi(L)}\longrightarrow0.               \tag{3.18}
\]

The exact degree identity

\[
 d_k={2p_k^2\over L}\Psi(L)
       +{2p_k\over L}E_k                              \tag{3.19}
\]

now proves simultaneous positivity.  Equations (3.17)--(3.19) prove
(3.14).  \(\square\)

This theorem is not an unconditional vertex theorem: RH is an explicit
hypothesis.  Its purpose is to show that the moving history moment itself is
not an obstruction in the RH branch, and to isolate the non-RH selection
problem.

## 4. Conditional non-RH rightmost-line selection

The same argument works off RH under one precise spectral hypothesis.  In
this section choose representatives with `Re(alpha)>=0`.

### Hypothesis R (`rightmost line with a gap`)

There are `b>0` and `delta>0` such that

\[
 \max_{\alpha\in Z_+}\Re\alpha=b,                    \tag{4.1}
\]

and every representative satisfies either `Re(alpha)=b` or
`Re(alpha)<=b-delta`.

After decreasing `delta` if necessary, take `0<delta<b`; this does not
weaken the hypothesis and makes bounded lower-order terms part of the error
in (4.3).

### Theorem 4.1 (conditional off-line simultaneous subsequence)

Assume RH is false and Hypothesis R holds.  For every fixed `K`, there is an
unbounded strict-half-integer natural-cutoff subsequence on which

\[
 \Psi(L_j)\geq c_b e^{bL_j},
 \qquad d_k(L_j)>0\quad(0\leq k\leq K)               \tag{4.2}
\]

eventually, for some `c_b>0`.  The ratios in (3.14) also hold.

**Proof.**  The rightmost part of (1.6) is

\[
 \Psi(L)=e^{bL}{\cal H}_b(L)+O(e^{(b-\delta)L}),      \tag{4.3}
\]

where

\[
 {\cal H}_b(L)=
 \sum_{\Re\alpha=b}{e^{i(\Im\alpha)L}\over\alpha^2} \tag{4.4}
\]

is real after conjugate pairing and is an absolutely convergent uniformly
almost-periodic function.  There is no real zero of `xi_R` in `0<s<1`, so
every frequency in (4.4) is nonzero.  The Bohr mean of `H_b` is zero, while
`H_b` is not identically zero.  It therefore has a positive value, and
almost-periodic recurrence supplies arbitrarily large `t_j` on which it is
bounded below by one fixed positive constant.

The strict-half-integer logarithmic grid has spacing `O(e^(-t/2))` near
`t`.  Uniform continuity transfers this lower bound to nearest grid points
`L_j`, proving the first assertion of (4.2).

Equations (3.5)--(3.6) and Hypothesis R give

\[
 |{\cal M}_k(L_j)|
 \leq {C_k\over L_j}
 \sum_{\alpha\in Z_+}
 {e^{(\Re\alpha)L_j}+1\over|\alpha|^3}
 =O_k(e^{bL_j}/L_j).                                 \tag{4.5}
\]

Since `|p_k|` is asymptotic to a positive constant times `L^(-1/2)`, (4.2)
and (4.5) make the relative history error `O_k(L^(-1/2))`.  The all-order
`J_L` error is smaller still.  Equations (3.17)--(3.19) finish the proof.
\(\square\)

Hypothesis R is not known for the zeta zeros.  The real parts of off-line
zeros could approach a supremum which is not attained, or could accumulate
toward the edge with no fixed gap.  The theorem is therefore a conditional
reduction, not the missing non-RH branch of an unconditional proof.

## 5. Why scalar Landau does not presently vectorize

The scalar checkpoint-0.80 Landau argument proves that `Psi` is unbounded
above if RH is false.  It does not identify a dominant zero or compare a
positive value of the signed sum (1.6) with the vector of sums (3.6).
Without Hypothesis R, the available absolute estimate is only

\[
 |{\cal M}_k(L)|
 \leq {C_k\over L}
 \sum_{\alpha\in Z_+}
 {e^{(\Re\alpha)L}+1\over|\alpha|^3},                \tag{5.1}
\]

whereas `Psi(L)` is the signed exponential sum with coefficients
`alpha^(-2)`.  A positive scalar limsup gives no lower bound comparing that
signed value with the absolute majorant in (5.1).

For finitely many rightmost frequencies, almost-periodic recurrence solves
the problem as in Section 4.  If successively righter zeros occur at
successively larger ordinates, a finite truncation is not uniform in `L`:
the small tail coefficients may be multiplied by larger exponentials before
a simultaneous recurrence time is reached.  Current zero-free regions do
not exclude this configuration.  This is the exact actual-zero obstruction
to promoting the scalar Landau selection; an arbitrary smooth discrepancy
countermodel is not needed.

A genuine unconditional vector selection theorem would have to prove, on
some strict-half-integer sequence,

\[
 \Psi(L)>0,
 \qquad
 {\cal M}_k(L)=o(|p_k|\Psi(L))\qquad(1\leq k\leq K), \tag{5.2}
\]

without assuming a rightmost spectral gap.  No admitted theorem supplies
(5.2).

## 6. Fixed principal blocks remain rank-one at leading order

Even the simultaneous degree theorem is not a routing theorem.  Fix a
finite index set `I` and put

\[
 q_0=1,\qquad q_n=2(-1)^n\quad(n\geq1).               \tag{6.1}
\]

Under RH, (1.9) gives `A_n-g=O_n(L^(-2))` for fixed `n`; on the favorable
subsequence this is `o(Psi)`.  Equations (2.4), (3.13), and (3.17)--(3.19)
therefore give the entrywise limit

\[
 \boxed{
 {L^2\over2C^2\Psi(L)}L_w[I,I]
 \longrightarrow q_Iq_I^T.}                         \tag{6.2}
\]

No endpoint-trace estimate for `P=sum_n p_n` is used here.  The diagonal of
the principal block is the **full** degree, including every edge from `I`
to its complement, and its limit follows from the full-tail history estimate
(3.18)--(3.19).  Deriving the same diagonal only from the scalar matrix in
the rank-one split would require an additional endpoint estimate; (6.2)
does not take that route.

The limit has rank one.  Hence every normalized principal determinant of
order at least two tends to zero, and its eventual sign is not determined
by (6.2).  The same conclusion holds under Hypothesis R along the sequence
of Theorem 4.1.  Fixed vertex degrees are the one-by-one minors and are
positive; higher minors, positive connectivity, and the collective routing
norm require new lower-order control.

The exact Gram defect (2.8)--(2.11) identifies that control: it is a
collective high-zero evaluation problem for the finite projected anchor,
not another scalar consequence of the endpoint screw margin.
