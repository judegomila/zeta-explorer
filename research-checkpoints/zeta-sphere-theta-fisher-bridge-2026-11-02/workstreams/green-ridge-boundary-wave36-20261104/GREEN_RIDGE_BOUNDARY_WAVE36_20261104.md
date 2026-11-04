# Infinite Green positivity and the ridge boundary layer

## Scope

This checkpoint records two exact reductions for the actual-theta selected
problem.  The first closes the infinite-left-cutoff Green correlation.  The
second shows why positive-ridge estimates away from zero do not by themselves
control the selected endpoint.  Neither result proves the finite `J=1`
Green inequality, an all-degree selected bound, or the Riemann hypothesis.

## 1. Infinite-left-cutoff correlation

Let `psi` be the complete positive theta profile and put

\[
 v=-{\psi'\over\psi},\qquad f=-h\psi'=h\psi v.
\]

Wave 35 supplies the actual-theta first-level log-concavity input
`v'(h)>0` for `h>0`.  In the infinite left cutoff, the modularly paired
response satisfies exactly

\[
 F_\infty={Q_\infty'\over C}=\psi,
 \qquad g_\infty=hF_\infty=h\psi.
\]

Since `f=v g_infty`,

\[
 f'g_\infty-fg_\infty'=v'g_\infty^2=h^2\psi^2v'.
\]

Combining this with `(fg)'=f'g+fg'` gives

\[
 f'g_\infty={1\over2}(fg_\infty)'
             +{1\over2}h^2\psi^2v'.
\]

The endpoint term vanishes.  At zero, even analyticity gives
`v(h)=O(h)` and hence `fg_infty=h^2 psi^2 v=O(h^3)`.  At infinity,
complete-theta decay gives `h^2 psi^2 v -> 0`.  Therefore

\[
 \boxed{
 I_\infty:=\int_0^\infty f'g_\infty\,dh
 ={1\over2}\int_0^\infty h^2\psi(h)^2v'(h)\,dh>0.}
\]

This is an exact complete-theta statement.  It does not automatically pass
to a finite Ewald cutoff.

## 2. Exact finite-`J=1` remainder

For the first paired Ewald cell, define `F_1=Q_1'/C`.  If one also proves
that `F_1>0` through the unique theta hump, that its positive set is one
connected interval, and that it has no positive re-entry, then a sufficient
ratio lemma is

\[
 \left({-\psi'\over F_1}\right)'>0
 \quad\hbox{where }F_1>0,
\]

equivalently

\[
 \boxed{W:=\psi'F_1'-\psi''F_1>0.}
\]

With `x=pi exp(2h)`, `y=pi^2/x`, and
`b(t)=t^(5/4)(t-1)exp(-t)`, the exact first response is

\[
 F_1=4\pi^{-1/4}\{b(x)+b(y)\}.
\]

The required response sign topology is itself still unproved.  Expanding
`psi` by natural theta shells gives a no-error-function series for `W`.
Define

\[
 K=4\pi^{-1/4},\qquad q(x)=b(x)+b(\pi^2/x),
\]

\[
 D=2x\partial_x,\qquad
 p_n(x)=n^2x^{5/4}(2n^2x-3)e^{-n^2x}.
\]

At `h=0`, the contribution of every natural shell `n>=2` is

\[
 \boxed{W_n(0)=-K^2q(\pi)D^2p_n(\pi)<0.}
\]

Thus positivity of every natural individual theta shell is impossible
already at the modular center.  A proof must establish aggregate first-shell
domination of the genuinely negative higher-shell contribution there,
together with control away from the center and the missing response topology.
No actual-theta counterexample to the aggregate inequality is known here.

## 3. Exact positive-ridge response

Let `X` be positive definite, `H` positive semidefinite, and `Q=X-H`.
On an old prefix `E`, assume `Q>0`.  Let `P` be the enlarged monic
`X`-selected polynomial, `A=X[P]`, and `u=P/sqrt(A)`.  Choose a
`Q`-orthonormal generalized stiffness basis with

\[
 Q(f_i,f_j)=\delta_{ij},\qquad
 H(f_i,f_j)=\mu_j\delta_{ij},\qquad \mu_j\ge0,
\]

and put `a_j=Q(u,f_j)`.  The selected correction has the exact costs

\[
 s_1=\sum_j a_j^2,
 \qquad
 s_2=\sum_j(1+\mu_j)a_j^2.
\]

For the monic Schur pivot `m(tau)` of `Q+tau X`,

\[
 R(\tau):={m'(\tau)\over A}-1
 =\sum_j{(1+\mu_j)a_j^2
          \over[1+\tau(1+\mu_j)]^2}.
\]

Consequently

\[
 \boxed{R(0)=s_2,\qquad
        \int_0^\infty R(\tau)\,d\tau=s_1.}
\]

Small pivot excess controls the area of the ridge response, whereas selected
alignment asks for its endpoint height.

## 4. Boundary-layer obstruction

For fixed `c>0` and `0<rho<1/(c+1)`, take one old coordinate and

\[
 K=1-\rho,\qquad b=-\sqrt c\,\rho,
 \qquad h={c\rho^2\over1-\rho}.
\]

The resulting `H` block is rank-one positive semidefinite, the old `Q`
gap is `rho`, and the enlarged `Q` pivot is positive.  Nevertheless

\[
 s_1=c\rho\to0,\qquad s_2=c,
 \qquad R(\tau)={c\rho^2\over(\rho+\tau)^2}.
\]

The response has height `c`, width of order `rho`, and area `c rho`.
Taking `rho_n=exp(-n)` makes every inverse-polynomial-scale ridge estimate
exponentially small while leaving `R_n(0)=c`.  This is a generic quadratic
form obstruction, not an actual-theta counterexample.

## 5. Sharpened actual-theta target

For the actual theta forms,

\[
 Q(p,e)=\int_{\mathbb R}2(F'^2-FF'')pe.
\]

On the old prefix define the genuine spectral subspace

\[
 E_t=X_E^{-1/2}\operatorname{Ran}{\bf1}_{(0,t]}
 \left(X_E^{-1/2}Q_EX_E^{-1/2}\right).
\]

A sufficient all-scale directional estimate is: for fixed `alpha>0` and
`epsilon_n->0`,

\[
 \boxed{
 |Q(P_n,e)|^2
 \le A_n\epsilon_n t^{2+\alpha}X[e]
 \quad(e\in E_t),}
\]

uniformly down to the true gap scale.  A stronger projector-free form is

\[
 |Q(P_n,e)|^2\le
 A_n\epsilon_n{Q[e]^{2+\alpha}\over X[e]^{1+\alpha}}
 \qquad(e\ne0).
\]

The polynomial-comparison checkpoint controls `X` and reference conditioning,
not this signed `Q/X` spectral load.  Ordinary `H`-Cauchy supplies no power
of `t`; even a noncircular `Q`-Cauchy bound would supply only one.  The
required second-plus-order cancellation is the remaining theta-specific
analytic problem.

## Nonclaims

- The finite `J=1` aggregate inequality remains open.
- The displayed spectral-load estimate is a sufficient target, not proved.
- The boundary-layer model is not an actual-theta counterexample.
- No all-degree positivity or RH conclusion is claimed.
