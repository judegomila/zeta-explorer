# Addendum: weakest exact ridge condition and scale-dependent theta budgets

## Scope

This addendum refines the sufficient power-law example in
the durable wave36 note
`../../green-ridge-boundary-wave36-20261104/GREEN_RIDGE_BOUNDARY_WAVE36_20261104.md`.
The fixed exponent `2+alpha` is only
a convenient sufficient hypothesis; it is not necessary.  The exact
condition is logarithmic `L1` control of the coupled spectral mass below.
No actual-theta estimate or Riemann-hypothesis conclusion is asserted.

## 1. Invariant actual-theta spectral measure

On the old `Q`-positive prefix, let

\[
 S_n=X_{E_n}^{-1/2}Q_{E_n}X_{E_n}^{-1/2}>0
\]

and let `c_n` be the `X`-normalized selected cross column.  In an
`X`-orthonormal eigenbasis,

\[
 S_ne_{j,n}=r_{j,n}e_{j,n},
 \qquad
 c_{j,n}=-Q(P_n/\sqrt{A_n},e_{j,n}).
\]

For the actual theta source,

\[
 c_{j,n}=-{1\over\sqrt{A_n}}
 \int_{\mathbb R}2(F'^2-FF'')P_ne_{j,n}.
\]

Define the positive spectral measure

\[
 \nu_n(B)=\sum_{r_{j,n}\in B}c_{j,n}^2
\]

and its cumulative function

\[
 M_n(t)=\nu_n((0,t]).
\]

The selected correction is small exactly when

\[
 s_{2,n}=\int r^{-2}\,d\nu_n(r)\longrightarrow0.
\]

## 2. Weakest exact Dini condition

Put

\[
 \eta_n(t)={M_n(t)\over t^2},
 \qquad \rho_n=\min_jr_{j,n}.
\]

Finite Tonelli gives the identity

\[
 \boxed{
 s_{2,n}=\eta_n(1)
 +2\int_{\rho_n}^1\eta_n(t){dt\over t}.}
\]

Therefore

\[
 \boxed{
 s_{2,n}\to0
 \quad\Longleftrightarrow\quad
 \eta_n(1)+2\|\eta_n\|_{L^1([\rho_n,1],dt/t)}\to0.}
\]

This is necessary and sufficient, with no fixed power, uniform gap lower
bound, or pointwise envelope assumed.

Pointwise `eta_n(t)->0` is not sufficient when the logarithmic interval grows.
Conversely, a large value on a logarithmically narrow scale interval is
allowed if its logarithmic area tends to zero.

## 3. Scale-dependent sufficient envelope

A usable sufficient criterion is to construct nonnegative envelopes
`E_n(t)` such that

\[
 M_n(t)\le t^2E_n(t)
 \qquad(\rho_n\le t\le1)
\]

and

\[
 E_n(1)+2\int_{\rho_n}^1E_n(t){dt\over t}\longrightarrow0.
\]

This permits a shrinking boundary layer.  For example, a rank-one layer of
height `delta_n` and width `rho_n` has

\[
 M_n(t)=\delta_n\rho_n^2
 \quad(t\ge\rho_n),
 \qquad
 E_n(t)=\delta_n(\rho_n/t)^2.
\]

Its envelope has logarithmic integral `delta_n/2` up to a vanishing endpoint
correction, regardless of how small `rho_n` is.  Hence `delta_n->0` suffices
without any relation between `delta_n` and `log(1/rho_n)`.

## 4. Equivalent dyadic budget

For integer `k>=0`, let

\[
 I_k=(2^{-k-1},2^{-k}],
 \qquad
 m_{n,k}=\nu_n(I_k).
\]

Use the finite set of shells meeting `[rho_n,1]`, with the final shell cut at
`rho_n` if necessary.  Since `r^(-2)` lies between `4^k` and `4^(k+1)` on
`I_k`,

\[
 \boxed{
 \sum_k4^km_{n,k}\le s_{2,n}
 \le4\sum_k4^km_{n,k}.}
\]

Thus the weakest scale-local target is a positive budget

\[
 \sum_k\varepsilon_{n,k}\longrightarrow0,
 \qquad
 4^km_{n,k}\le\varepsilon_{n,k}.
\]

This form may be better suited to signed theta/Ewald cell estimates: each
spectral scale may receive its own payment, and no common Hölder exponent is
required.

## 5. Why a fixed `2+alpha` exponent is too strong

Let

\[
 \rho_n=e^{-n^2},
 \qquad \delta_n={1\over n},
 \qquad b_n^2=\delta_n\rho_n^2.
\]

The rank-one construction of the main memo, with

\[
 K_n=1-\rho_n,
 \qquad h_n={b_n^2\over1-\rho_n},
\]

has positive old and enlarged `Q` blocks and

\[
 s_{2,n}={b_n^2\over\rho_n^2}=\delta_n\to0.
\]

But at `t=rho_n`, for every fixed `alpha>0`,

\[
 {M_n(t)\over t^{2+\alpha}}
 =\delta_n\rho_n^{-\alpha}\longrightarrow\infty.
\]

Thus no `epsilon_n->0` can satisfy a uniform
`M_n(t)<=epsilon_n t^(2+alpha)` estimate, even though the exact desired
alignment holds.  Likewise the crude critical shortcut
`epsilon_n log(1/rho_n)->0` fails when `epsilon_n=delta_n`, while the exact
Dini integral still tends to zero.

## 6. Stiffness-coordinate version

In the `Q`-orthonormal stiffness basis,

\[
 H(f_{j,n},e)=\mu_{j,n}Q(f_{j,n},e),
 \qquad r_{j,n}=(1+\mu_{j,n})^{-1},
\]

and

\[
 a_{j,n}=Q(P_n/\sqrt{A_n},f_{j,n}),
 \qquad c_{j,n}^2={a_{j,n}^2\over1+\mu_{j,n}}.
\]

Define

\[
 A_n(U)=\sum_{\mu_{j,n}\ge U}{a_{j,n}^2\over1+\mu_{j,n}}.
\]

The same exact condition becomes

\[
 \boxed{
 s_{2,n}=A_n(0)
 +2\int_0^{\mu_{\max,n}}(1+U)A_n(U)\,dU
 \longrightarrow0.}
\]

Indeed the change of variables is `t=(1+U)^(-1)`.  This is the precise
complete-theta high-stiffness load that an arithmetic commutator or modular
cell argument must pay.  A scale-dependent upper envelope with vanishing
weighted integral is sufficient; a fixed spectral Hölder exponent is not
required.

## 7. Audit of the main memo's wording

The main memo first labels

\[
 \sum_j(1+\mu_{j,n})|a_{j,n}|^2\to0
\]

and the equivalent layer-cake limit as the **precise unresolved all-degree
condition**.  It later labels `M_n(t)<=epsilon_n t^(2+alpha)` as **a concrete
sufficient estimate**, and labels the critical-exponent statement as
**sufficient only with** its additional logarithmic condition.  The power
law is therefore not presented as necessary.  No wording correction is
required; this addendum only records a weaker and exact scale-dependent
formulation.

## 8. Exact `Q_lambda` homotopy and action identity

The Dini budget has an equivalent path-action form that does not require a
fixed spectral exponent.

### Finite-prefix assumptions

Fix one finite old same-parity prefix `E`.  Assume:

1. `X` is positive definite on `E` and the adjoining monic direction;
2. `H` is positive semidefinite there;
3. `Q=X-H` is positive definite on `E`.

No positivity of the enlarged `Q` pivot is assumed.  Put

\[
 Q_\lambda=X-\lambda H=Q+(1-\lambda)H,
 \qquad 0\le\lambda\le1.
\]

Every `Q_lambda` is positive definite on `E`.  Therefore there is a unique
monic polynomial `q_lambda` in the enlarged affine slice satisfying

\[
 Q_\lambda(q_\lambda,e)=0\qquad(e\in E).
\]

Its coefficients depend smoothly on `lambda`.  At the endpoints,

\[
 q_0=P,
 \qquad q_1=q,
\]

where `P` is the `X`-selected monic polynomial and `q` is the `Q`-selected
monic residual.  Set `A=X[P]`.

### Differentiated stationarity

Differentiate the Galerkin equations.  Since
`partial_lambda Q_lambda=-H`,

\[
 Q_\lambda(\dot q_\lambda,e)=H(q_\lambda,e)
 \qquad(e\in E).
\]

Because `dot q_lambda` lies in `E`, taking `e=dot q_lambda` gives

\[
 Q_\lambda[\dot q_\lambda]
 =H(q_\lambda,\dot q_\lambda)\ge0.
\]

If

\[
 p(\lambda)=Q_\lambda[q_\lambda]
\]

is the monic pivot, the envelope theorem and the preceding identity give

\[
 p'(\lambda)=-H[q_\lambda],
 \qquad
 p''(\lambda)=-2Q_\lambda[\dot q_\lambda]\le0.
\]

Thus the usual pivot concavity is exactly the nonnegative motion energy of
the selected path.

### Exact action formula

In the block eigenbasis of the main memo, the old `H` eigenvalues are `k_j`
and the selected cross coordinates are `b_j`.  Direct elimination gives

\[
 {q_\lambda-P\over\sqrt A}
 =\sum_j{\lambda b_j\over1-\lambda k_j}e_j,
\]

so

\[
 {1\over A}Q_\lambda[\dot q_\lambda]
 =\sum_j{b_j^2\over(1-\lambda k_j)^3}.
\]

For each mode,

\[
 {d\over d\lambda}
 \left({\lambda^2\over(1-\lambda k_j)^2}\right)
 ={2\lambda\over(1-\lambda k_j)^3}.
\]

Integration from zero to one therefore proves

\[
 \boxed{
 {X[q-P]\over A}=s_2
 ={2\over A}\int_0^1
 \lambda Q_\lambda[\dot q_\lambda]\,d\lambda.}
\]

The same formula follows without diagonalizing: integrate
`-lambda p''(lambda)` by parts and use the exact endpoint identities for
`p(0)`, `p(1)`, and `p'(1)`.

This gives a scale-dependent sufficient criterion.  If nonnegative functions
`E_n(lambda)` satisfy, for the actual degree-`n` path,

\[
 |H(q_{n,\lambda},e)|^2
 \le A_nE_n(\lambda)Q_\lambda[e]
 \qquad(e\in E_n),
\]

then duality and differentiated stationarity give

\[
 Q_\lambda[\dot q_{n,\lambda}]
 \le A_nE_n(\lambda).
\]

Consequently

\[
 2\int_0^1\lambda E_n(\lambda)d\lambda\longrightarrow0
 \quad\Longrightarrow\quad s_{2,n}\longrightarrow0.
\]

For the actual theta forms, the directional hypothesis retains the complete
signed expression

\[
 \left|\int_{\mathbb R}F^2q_{n,\lambda}'e'\right|^2
 \le A_nE_n(\lambda)
 \left\{
 \int_{\mathbb R}2(F'^2-FF'')e^2
 +(1-\lambda)\int_{\mathbb R}F^2e'^2
 \right\}.
\]

It is a theorem-shaped sufficient estimate, not a proved theta inequality.

## 9. Ridge-coordinate equivalent

Put

\[
 \tau={1-\lambda\over\lambda},
 \qquad \lambda={1\over1+\tau},
\]

and let `q_tau` be the same selected path written as the monic residual for

\[
 \widetilde Q_\tau=Q+\tau X
 ={1\over\lambda}Q_\lambda.
\]

Then `q_0=q` and `q_tau` tends to `P` as `tau` tends to infinity.
Differentiated ridge stationarity gives

\[
 \widetilde Q_\tau(\dot q_\tau,e)=-X(q_\tau,e),
 \qquad
 \widetilde Q_\tau[\dot q_\tau]\ge0.
\]

If `m(tau)=widetilde Q_tau[q_tau]`, then

\[
 m'(\tau)=X[q_\tau],
 \qquad
 m''(\tau)=-2\widetilde Q_\tau[\dot q_\tau].
\]

The change of variables above converts the finite homotopy action exactly
into

\[
 \boxed{
 s_2={2\over A}\int_0^\infty
 (Q+\tau X)[\dot q_\tau]\,d\tau.}
\]

Equivalently, with
`R(tau)=m'(tau)/A-1`, this is

\[
 s_2=\int_0^\infty[-R'(\tau)]d\tau=R(0).
\]

The action density may concentrate in an arbitrarily narrow endpoint layer;
only its integrated mass is relevant.  This is why the action formulation is
compatible with the exact Dini criterion and does not impose a fixed Hölder
exponent.

## 10. Nonclaims

- Old-prefix positivity is an explicit assumption; it is not proved here.
- The action identities do not prove positivity of the enlarged `Q` pivot.
- No estimate of the actual-theta action density or its integral is proved.
- The displayed directional theta inequality is sufficient, not established.
- No finite computation is promoted to an all-degree statement.
- No conclusion about the Riemann hypothesis follows from these identities.

