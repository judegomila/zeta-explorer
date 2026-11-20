# Spectral alignment and positive-ridge reduction

## Scope

This checkpoint sharpens the signed-projection gap left open by wave 33.  It
replaces a sufficient but unnecessarily strong global-gap condition by an
exact, column-dependent spectral identity and a positive-ridge sufficient
condition.  It is finite-dimensional form algebra.  The actual-theta estimate
identified below remains open, so this is neither an all-degree theorem nor an
RH conclusion.

## Exact spectral coordinates

Use the notation of wave 33.  In an `X`-orthonormal basis of the old prefix,
diagonalize

\[
 Q_E=I-K=\operatorname{diag}(r_j),\qquad 0<r_j\le 1,
\]

and put `u=P/sqrt(A)` and

\[
 b_j=H(e_j,u)=-Q(e_j,u).
\]

The last equality uses `X(e_j,u)=0`.  If `w=q-P`, then exactly

\[
 {w\over\sqrt A}=\sum_j {b_j\over r_j}e_j,
 \qquad
 {Q[w]\over A}=s_1=\sum_j{b_j^2\over r_j},
 \qquad
 {X[w]\over A}=s_2=\sum_j{b_j^2\over r_j^2}.
\]

For the actual theta source,

\[
 T p=Fp'+2F'p,
 \quad X(p,q)=\int(Tp)(Tq),
 \quad H(p,q)=\int F^2p'q'.
\]

Expanding and integrating the mixed term by parts gives, under the same
polynomial-times-theta decay hypothesis used in wave 33,

\[
 Q(p,q)=X(p,q)-H(p,q)
 =\int 2(F'^2-FF'')pq.
\]

Consequently

\[
 b_j=-{1\over\sqrt A}\int 2(F'^2-FF'')P e_j.
\]

This is a generalized-eigenvector statement, not a claim of localization in
the Pollaczek coefficient basis.

## Exact layer-cake identity

Define the cumulative coupled spectral mass

\[
 M(t)=\sum_{r_j\le t}b_j^2,
 \qquad \rho=\min_j r_j.
\]

Since

\[
 r^{-2}=1+\int_r^1 2t^{-3}\,dt,
\]

Tonelli for the finite positive sum gives

\[
 \boxed{
 s_2=M(1)+2\int_\rho^1 {M(t)\over t^3}\,dt.}
\]

The `M(1)` term carries any atom at `r=1`; endpoint conventions for the
integral do not change atoms at `rho`.  Immediate consequences are

\[
 M(t)\le t^2s_2,
\]

and, for fixed `alpha>0`, if the displayed hypothesis holds uniformly for
every `t` in `[rho_n,1]`,

\[
 M(t)\le\varepsilon_n t^{2+\alpha}
 \quad\Longrightarrow\quad
 s_2\le(1+2/\alpha)\varepsilon_n.
\]

At the critical exponent, again with the hypothesis uniform for every `t` in
`[rho_n,1]`,

\[
 M(t)\le\varepsilon_n t^2
 \quad\Longrightarrow\quad
 s_2\le\varepsilon_n\{1+2\log(1/\rho_n)\}.
\]

Thus the live requirement is a Dini spectral-alignment estimate for the
actual theta cross-column.

## Why the global-gap target is not necessary

The wave-33 inequality `s2<=s1/rho` is minimax-sharp when all coupled mass is
on a bottom mode, but `s1=o(rho)` is not necessary.  Take

\[
 K=\operatorname{diag}(1-\rho_N,1/2),\quad
 b=(0,\sqrt{\varepsilon_N}),\quad h=2\varepsilon_N,
\]

with `rho_N=N^-10` and `epsilon_N=N^-1`.  The full `H` block is positive
semidefinite because

\[
 h-b^TK^{-1}b=0.
\]

The old `Q` block is positive, and for `N>4` the enlarged `Q` Schur complement
is

\[
 1-h-s_1=1-4/N>0.
\]

Nevertheless

\[
 s_1=2/N,\qquad s_2=4/N\to0,
 \qquad s_1/\rho_N=2N^9\to\infty,
\]

while

\[
 {H[q]\over X[q]}={8/N\over1+4/N}\to0.
\]

The tiny-gap mode is uncoupled from the selected column.  This is a generic
positive-form countermodel to necessity of the scalar shortcut, not an
actual-theta counterexample.

## Positive-ridge route

Let `m(tau)` be the monic pivot for `Q+tau X` in the enlarged slice and set

\[
 g(\tau)=\sum_j{b_j^2\over r_j+\tau}.
\]

Block elimination gives

\[
 {m(\tau)\over A}=1-h+\tau-g(\tau),\qquad
 {m'(\tau)\over A}-1=\sum_j{b_j^2\over(r_j+\tau)^2}.
\]

For every `t>0`,

\[
 g(t)-g(2t)
 =\sum_j {t b_j^2\over(r_j+t)(r_j+2t)}.
\]

When `r_j<=t`, the kernel is at least `1/(6t)`, with equality at `r_j=t`.
Therefore

\[
 \boxed{
 M(t)\le 6t\{g(t)-g(2t)\}
 =6t\left\{{m(2t)-m(t)\over A}-t\right\}.}
\]

It is enough to prove, uniformly for `rho_n<=t<=1`,

\[
 {m_n(2t)-m_n(t)\over A_n}-t
 \le {\varepsilon_n\over6}t^{1+\alpha},
\]

with fixed `alpha>0` and `epsilon_n->0`.  Every positive ridge removes the
raw endpoint inverse singularity, but no such actual-theta increment bound is
proved here.

## Remaining blocker

The next analytic step is a theta-specific upper bound on regularized pivot
increments, or directly on

\[
 M_n(t)=\sum_{r_{j,n}\le t}{1\over A_n}
 \left|\int2(F'^2-FF'')P_ne_{j,n}\right|^2.
\]

Selected-column nonlocality in the Pollaczek basis does not by itself settle
this generalized-spectral alignment question.
