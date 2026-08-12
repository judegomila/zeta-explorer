# Screw margin and the collective-routing rank-one barrier

## 0. Claim boundary

This note asks exactly what the checkpoint-0.80 favorable screw margin can
do for the full anchored weighted-Loewner graph.  It gives an all-edge and
all-vertex normal form in the screw cosine moments, and separates the scalar
endpoint margin from the remaining collective operator.

The favorable scalar contributes a signed complete graph whose Laplacian is

\[
 {2\Psi(L)\over L}\{pp^T-P\operatorname {diag}(p)\},
 \qquad P=\sum_jp_j.                                      \tag{0.1}
\]

When the endpoint trace `P` vanishes, this is only the rank-one matrix
`2*Psi(L)*p*p^T/L`.  For the eventual prolate sign pattern, its positive
graph is connected but its minimum-norm routing lies exactly on the
noncontractive boundary.  Thus even ideal low-frequency locking of all
screw moments does not by itself produce a strict collective gap; the
moment-difference operator on the large nullspace is decisive.

An exact smooth counterfamily then keeps the actual anchor coordinates,
the strict endpoint margin `Psi(L)>0`, and the stronger scalar flatness
`J_L=0`, while making the positive graph connected, the first alternating
degree negative, and the routing norm arbitrarily large.  This counterfamily
is a synthetic cosine-moment profile.  It is **not** the pinned
pole--archimedean--minus-prime source, does not satisfy its half-plane
logarithmic-derivative identity, and makes no assertion about the signs of
the actual arithmetic graph.  Its role is to prove that the central margin,
fixed-mode anchor asymptotics, and scalar all-order cancellation alone are
logically insufficient.

No actual-source vertex-1 sign, positive-graph connectivity, routing
contraction, finite real-rootedness, Riemann-hypothesis conclusion, or
Lambda bound is proved.  The formal project state remains `P0_INVALIDATED`.
The binding conventions remain centered `exp(-izt)`, `L=2*log(lambda)`,
Lebesgue measure, zero extension, source normalization, the inclusive
inventory `1<n<=lambda^2`, and the pole--archimedean--minus-prime signs in
`P0_SOURCE_LOCK.json` and `P0_NORMALIZATION_AUDIT.md`.

## 1. Exact all-edge screw-moment form

On the untranslated interval `[0,L]`, write the projected even anchor as

\[
 f_N(t)={1\over\sqrt L}\sum_{n=0}^Np_n
              \cos {2\pi nt\over L},                 \tag{1.1}
\]

where

\[
 p_0=x_0,\qquad p_n=2x_n\quad(n\geq1).                \tag{1.2}
\]

For the scalar-deleted complete source discrepancy `R` of
`notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md`, put

\[
 A_n=\int_0^LR(t)\cos {2\pi nt\over L}\,dt,
 \qquad g=A_0,\qquad \Psi=-g,                         \tag{1.3}
\]

and

\[
 J_L=\int_0^LR(t)f_N(t)\,dt
 ={1\over\sqrt L}\sum_{n=0}^Np_nA_n.                 \tag{1.4}
\]

The exact source integration by parts gives

\[
 b_n=-{2n\over L}A_n,
 \qquad c_0=0,
 \qquad c_n=nb_n=-{2n^2\over L}A_n.                  \tag{1.5}
\]

The anchored weighted-Loewner weights are

\[
 w_{ij}=-p_ip_j{c_i-c_j\over i^2-j^2}\quad(i\ne j). \tag{1.6}
\]

### Theorem 1.1 (all-edge and all-vertex normal form)

For every distinct `i,j` in `{0,...,N}`,

\[
 \boxed{
 w_{ij}={2p_ip_j\over L}
 {i^2A_i-j^2A_j\over i^2-j^2}.}                     \tag{1.7}
\]

For every vertex `k`, define

\[
 T_0=0,
 \qquad
 T_k=k^2\sum_{\substack{0\leq j\leq N\\j\ne k}}
 p_j{A_k-A_j\over k^2-j^2}\quad(k\geq1).             \tag{1.8}
\]

Then its degree is exactly

\[
 \boxed{
 d_k={2p_k\over L}
 \{\sqrt L\,J_L-p_kA_k+T_k\}.}                      \tag{1.9}
\]

Equivalently, with

\[
 E_k=\sqrt L\,J_L-p_k(A_k-g)+T_k,                    \tag{1.10}
\]

one has the scalar-main-term decomposition

\[
 \boxed{
 d_k={2p_k^2\over L}\Psi+{2p_k\over L}E_k.}          \tag{1.11}
\]

For `k=0`, equations (1.10)--(1.11) mean `E_0=sqrt(L)*J_L`
and recover the checkpoint-0.80 central screw identity.

**Proof.**  Substitute (1.5) into (1.6).  The quotient is

\[
 {c_i-c_j\over i^2-j^2}
 =-{2\over L}{i^2A_i-j^2A_j\over i^2-j^2},
\]

which proves (1.7), including `i=0` or `j=0`.  The elementary identity

\[
 {k^2A_k-j^2A_j\over k^2-j^2}
 =A_j+k^2{A_k-A_j\over k^2-j^2}                     \tag{1.12}
\]

and (1.4) give

\[
 \sum_{j\ne k}p_j{k^2A_k-j^2A_j\over k^2-j^2}
 =\sqrt L\,J_L-p_kA_k+T_k.
\]

Summing (1.7) proves (1.9).  Adding and subtracting `p_k*g`, and using
`Psi=-g`, proves (1.10)--(1.11).  \(\square\)

The important distinction is that fixed-index control of `A_k-g` does not
control `T_k`: the latter contains every index through the growing natural
cutoff `N=M(lambda)=ceil(lambda)`.

## 2. Exact collective rank-one decomposition

Put

\[
 \Delta_n=A_n-g,\qquad \Delta_0=0,
 \qquad P=\sum_{n=0}^Np_n,                            \tag{2.1}
\]

and, for `i!=j`,

\[
 \Theta_{ij}
 ={i^2\Delta_i-j^2\Delta_j\over i^2-j^2}.            \tag{2.2}
\]

Let `L_w` be the graph Laplacian with off-diagonal entries `-w_(ij)`.
Let `L_Delta` be the graph Laplacian with edge weights

\[
 w^{\Delta}_{ij}={2p_ip_j\over L}\Theta_{ij}.         \tag{2.3}
\]

### Theorem 2.1 (scalar screw plus moment-difference operator)

One has the exact matrix identity

\[
 \boxed{
 L_w={2\Psi\over L}
 \{pp^T-P\operatorname {diag}(p)\}+L_\Delta.}         \tag{2.4}
\]

In particular, the scalar endpoint margin controls only the first summand.
All strictness transverse to its range must come from the endpoint trace
`P` and the moment-difference Laplacian `L_Delta`.

**Proof.**  Equations (1.7), (2.1), and (2.2) split every edge as

\[
 w_{ij}=-{2\Psi\over L}p_ip_j+w^\Delta_{ij}.          \tag{2.5}
\]

The off-diagonal entries of the Laplacian of the first term are
`2*Psi*p_i*p_j/L`.  Its `i`th diagonal is

\[
 -{2\Psi\over L}p_i(P-p_i)
 ={2\Psi\over L}(p_i^2-Pp_i),
\]

which is exactly the first matrix on the right of (2.4).  \(\square\)

### Corollary 2.2 (ideal locking is the routing boundary)

Assume `N>=2`, every `p_i` is nonzero,

\[
 P=0,\qquad \Delta_i=0\quad(0\leq i\leq N),           \tag{2.6}
\]

and the vector `p` has both signs and at least two coordinates of one sign.
Then

\[
 \boxed{L_w={2\Psi\over L}pp^T.}                     \tag{2.7}
\]

If `Psi>0`, the positive graph is the complete bipartite graph between the
two sign classes and is connected.  Nevertheless `L_w` has rank one and a
kernel of dimension `N`.  Since a negative edge is present, the
minimum-norm routing matrix of the positive graph satisfies

\[
 \boxed{\|B_+^\dagger B_-\|_{\rm op}=1,}              \tag{2.8}
\]

not the required strict inequality.

For the eventual fixed-mode prolate pattern, `p_0>0`, `p_1<0`, and
`p_2>0`, so the sign hypotheses are already present in the first three
coordinates.  Corollary 2.2 is an exact collective factorization, not an
asymptotic assertion about the actual moments.

**Proof.**  Equation (2.7) is (2.4).  By (2.5), an edge is positive exactly
when its endpoint coordinates have opposite signs, proving connectivity;
two same-sign coordinates supply a negative edge.  The rank and kernel
claims follow from `p!=0` and `p^T*1=P=0`.  The exact routing identity in
`notes/ANCHORED_WEIL_DIRICHLET_CONTRACTIVE_ROUTING.md` gives norm at most
one from positive semidefiniteness.  A norm strictly below one would make
the Laplacian strictly positive on `1^perp`, contradicting its additional
kernel.  Hence the norm is exactly one.  \(\square\)

## 3. What fixed-index asymptotics would and would not prove

The admitted fixed-mode anchor theorem gives, for every fixed `n`,

\[
 \sqrt L\,p_0\longrightarrow C,
 \qquad
 \sqrt L\,p_n\longrightarrow2(-1)^nC\quad(n\geq1),
 \qquad C={\Xi(0)\over4}>0.                           \tag{3.1}
\]

Consider an unbounded subsequence with `Psi(L)>0`.  If, for each displayed
fixed index,

\[
 A_n-g=o(\Psi),                                      \tag{3.2}
\]

then (1.7) gives the fixed-edge limits

\[
 \boxed{
 {L^2w_{0j}\over C^2\Psi}\longrightarrow-4(-1)^j
 \quad(j\geq1),}                                    \tag{3.3}
\]

\[
 \boxed{
 {L^2w_{ij}\over C^2\Psi}\longrightarrow
 -8(-1)^{i+j}
 \quad(i,j\geq1,\ i\ne j).}                        \tag{3.4}
\]

Thus every fixed edge eventually has the ideal parity sign: opposite
parities are positive and equal parities are negative.  This proves neither
a sign for a full degree nor connectivity of the graph through the moving
top vertex, because (3.2) is not uniform for `n<=ceil(lambda)`.

There is a self-contained check that (3.2) really does hold in the RH branch
of the checkpoint-0.80 case split.  It is conditional and is not used in the
unconditional counterfamily below.

### Lemma 3.1 (RH-conditional fixed-frequency locking)

Assume RH.  For each fixed positive integer `n`,

\[
 \boxed{A_n(L)-g(L)=O_n(L^{-1}).}                     \tag{3.5}
\]

Consequently, on the favorable checkpoint-0.80 subsequence, whose margin is
bounded below by a fixed positive constant, every fixed edge has the parity
asymptotics (3.3)--(3.4) in the RH branch.

**Proof.**  In the RH branch, checkpoint 0.80 gives the absolutely and
uniformly convergent representation

\[
 \Psi(t)=2\sum_{\gamma>0}{1-\cos(\gamma t)\over\gamma^2},
 \qquad \sum_{\gamma>0}\gamma^{-2}<\infty.            \tag{3.6}
\]

There is no zero at `gamma=0`, and discreteness gives a smallest positive
ordinate `gamma_*`.  With `a=2*pi*n/L`, integration by parts and
`a*L=2*pi*n` give

\[
 A_n-g=-a\int_0^L\Psi(t)\sin(at)\,dt
 =2a\sum_{\gamma>0}{1\over\gamma^2}
       \int_0^L\cos(\gamma t)\sin(at)\,dt.             \tag{3.7}
\]

The constant term in (3.6) integrates to zero over the integer number of
sine periods.  For large `L`, `a<=gamma_*/2`, and product-to-sum gives

\[
 \left|\int_0^L\cos(\gamma t)\sin(at)\,dt\right|
 \leq {1\over\gamma+a}+{1\over\gamma-a}
 \leq {3\over\gamma}.                                 \tag{3.8}
\]

Since `sum(gamma^(-3))` converges, (3.7)--(3.8) prove (3.5).  \(\square\)

The first three vertices already show why fixed edges cannot be substituted
for a growing-cutoff theorem.  Under (3.2), divide the Laplacian of the
**induced** graph on `{0,1,2}` by `2*C^2*Psi/L^2`.  Equations
(3.1)--(3.4) give the limit

\[
 K_3=qq^T-(q^T\mathbf1)\operatorname {diag}(q)
 =\begin{pmatrix}
 0&-2&2\\
 -2&6&-4\\
 2&-4&2
 \end{pmatrix},
 \qquad q=(1,-2,2)^T.                                 \tag{3.9}
\]

Its eigenvalues are

\[
 \boxed{0,\quad4-2\sqrt 7,\quad4+2\sqrt 7,}           \tag{3.10}
\]

so this fixed prefix is indefinite.  This does not prove that the full
actual graph is indefinite: edges from the prefix to the moving tail add to
the vertex diagonals.  It proves instead that those tail contributions are
essential at leading order and cannot be discarded after checking finitely
many edge signs.

For a fixed vertex `k`, the exact sufficient relative condition is

\[
 \boxed{E_k=o(|p_k|\Psi),}                            \tag{3.11}
\]

where `E_k` is the full-tail quantity (1.10), not a fixed finite sum.  Under
(3.11),

\[
 d_0\sim{2C^2\Psi\over L^2},
 \qquad
 d_k\sim{8C^2\Psi\over L^2}\quad(k\geq1\text{ fixed}),
 \qquad {d_k\over d_0}\longrightarrow4.             \tag{3.12}
\]

Checkpoint 0.80 proves (3.11) only for `k=0`: there
`E_0=sqrt(L)*J_L` is flat and the favorable subsequence has a fixed positive
margin.  It proves no estimate (3.11) for `k>=1`.  Even proving (3.11) for
every fixed `k` would leave the growing-dimensional nullspace in (2.7) and
would not imply a uniform collective routing gap at `M=ceil(lambda)`.

## 4. A margin-preserving smooth collective no-go

The next construction is stronger than an arbitrary Loewner-array
counterexample: all of its displacement coefficients are cosine moments of
one smooth function, and its prolate-weighted convolution is exactly zero.

### Theorem 4.1 (central margin and exact scalar flatness do not route)

Fix `L>0`, `N>=2`, `eta>0`, and a real anchor vector

\[
 p=(p_0,\ldots,p_N),
 \qquad p_i\ne0,
 \qquad p_0>0,\quad p_1<0,\quad p_2>0.                \tag{4.1}
\]

For every prescribed `Q>0`, there is a real smooth cosine polynomial
`R_delta` on `[0,L]` such that, with its moments `A_n` as in (1.3),

\[
 \boxed{A_0=-\eta,\qquad J_L=0,\qquad d_0={2p_0^2\eta\over L}>0,} \tag{4.2}
\]

the positive-edge graph is connected, but

\[
 \boxed{d_1<0,
 \qquad\|B_+^\dagger B_-\|_{\rm op}^2>Q.}            \tag{4.3}
\]

The construction may in particular use the coordinate vector of every
sufficiently large actual prolate anchor for which all coordinates are
nonzero; its `R_delta` remains synthetic.  If one coordinate vanishes, that
vertex has no incident weighted-Loewner edges, so the strict full-graph gate
already fails for that anchor.

**Proof.**  Let `delta>0` be a parameter.  Define Loewner data

\[
 c_0=0,\qquad c_1=\delta,\qquad
 c_j=-\delta\operatorname {sign}(p_j)\quad(3\leq j\leq N), \tag{4.4}
\]

and choose the remaining value exactly as

\[
 c_2={4\over p_2}\left{-{2p_0\eta\over L}
 -p_1c_1-\sum_{j=3}^N{p_jc_j\over j^2}\right}.       \tag{4.5}
\]

As `delta` decreases to zero,

\[
 c_2\longrightarrow-{8p_0\eta\over Lp_2}<0.          \tag{4.6}
\]

Take `delta` small enough that `c_2<0`, and put

\[
 A_0=-\eta,
 \qquad A_n=-{Lc_n\over2n^2}\quad(1\leq n\leq N),    \tag{4.7}
\]

\[
 R_\delta(t)=-{\eta\over L}
 -\sum_{n=1}^N{c_n\over n^2}\cos {2\pi nt\over L}.   \tag{4.8}
\]

Cosine orthogonality makes (4.7) exactly the moment sequence of (4.8).
Equation (4.5) gives

\[
 \sum_{n=0}^Np_nA_n
 =-p_0\eta-{L\over2}\sum_{n=1}^N{p_nc_n\over n^2}=0, \tag{4.9}
\]

so `J_L=0`.  The central identity (1.11) proves (4.2).

For every `j>=1`,

\[
 w_{0j}=-{p_0p_jc_j\over j^2}>0.                     \tag{4.10}
\]

For `j=1` this uses `p_1<0<c_1`; for `j=2` it uses
`p_2>0>c_2`; and for `j>=3` it follows from (4.4).
Thus the positive graph contains a star centered at zero and is connected.

The edge from `1` to `2` is

\[
 w_{12}={p_1p_2(c_1-c_2)\over3}
 \longrightarrow {8p_0p_1\eta\over3L}<0.             \tag{4.11}
\]

For `j>=3`, (4.4) gives either `w_(1j)=0` when `p_j<0`, or
`w_(1j)<0` when `p_j>0`.  Hence the only positive edge incident to vertex
one is

\[
 w_{01}=-p_0p_1\delta\downarrow0.                    \tag{4.12}
\]

Equations (4.11)--(4.12) imply `d_1<0` for all sufficiently small
`delta`.  With `E_+` and `E_-` denoting the positive and negative graph
energies,

\[
 {E_-(e_1)\over E_+(e_1)}
 \geq{-w_{12}\over w_{01}}\longrightarrow+\infty.    \tag{4.13}
\]

Positive connectivity makes the minimum-norm routing `S=B_+^dagger B_-`
well defined and `B_-=B_+S`.  Therefore

\[
 \|S\|_{\rm op}^2\geq
 {\|B_-^*e_1\|^2\over\|B_+^*e_1\|^2}
 ={E_-(e_1)\over E_+(e_1)}.                          \tag{4.14}
\]

Choose `delta` still smaller so that (4.13) exceeds `Q`.  This proves
(4.3).  \(\square\)

The counterfamily may take `eta` equal to any fixed lower screw margin.
It has `J_L=0`, which is stronger than being flat to every inverse power.
It nevertheless is not an arithmetic counterexample: (4.8) was engineered
after the anchor was fixed and does not obey the locked completed-zeta
Laplace transform.

## 5. Surviving actual-source target

The favorable checkpoint-0.80 subsequence settles one scalar direction and
no more.  To advance the actual source, one must control the moment-
difference operator `L_Delta` on the near-nullspace of the rank-one screw
term.  Equivalent concrete gates are:

1. for each fixed vertex, prove the full-tail estimate (3.11), not merely
   `A_k-g=o(Psi)` at finitely many indices;
2. for the growing cutoff, prove positive connectivity using uniform signed
   information on all divided differences `Theta_(ij)`; and
3. prove a strictly positive lower bound for (2.4) on `1^perp`, equivalently
   `||B_+^dagger B_-||_op<1`, after resolving the `N-1` transverse directions
   left null by (2.7).

Neither the scalar margin, the endpoint trace, nor a finite list of vertex
degrees controls that transverse operator.  Any successful theorem must use
new source-specific relations among the full family of cosine moments,
beyond the all-order cancellation of their single prolate-weighted sum.
