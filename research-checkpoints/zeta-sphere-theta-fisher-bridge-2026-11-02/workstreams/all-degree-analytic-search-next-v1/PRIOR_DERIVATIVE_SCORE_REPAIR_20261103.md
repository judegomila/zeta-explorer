# A recurrence-aware prior-derivative score repair

## Outcome and scope

Let `q_(epsilon,N)` be the actual monic same-parity Galerkin residual and put

\[
 V_N^{\rm prior}
 =\operatorname {span}\{q_N',\,tq_N,\,q_{N-1}'\}.             \tag{1}
\]

Complete-orbit Arb enclosures prove that the projected score auxiliary for
(1) is strictly positive on every rung covered by the frozen old signed
moments `M_0,...,M_14`:

- even degrees `kappa=4,6,...,14`;
- odd degrees `kappa=3,5,...,15`.

At the actual odd degree 15, where the fixed dictionary
`span{q_N',tq_N,t^2q_N'}` is rigorously negative, the prior-derivative rule
gives

\[
 \boxed{
 \mathcal H_{V_7^{\rm prior}}
 \in[6.611165481170336,6.611172265806858]10^{25}>0.}          \tag{2}
\]

Only `M_0,...,M_14` enter.  The new signed moment `M_15` is absent.  Thus (2)
is a noncircular repair of the failed auxiliary at this rung.

This is still a finite route-selection certificate.  Thirteen positive rungs
do not prove a uniform inequality, a first Xi--Laguerre theorem, or RH.

## 1. Why the prior derivative is the natural old-data channel

Write the residual recurrence at fixed parity as

\[
 q_{N+1}=(t^2-\alpha_{N+1})q_N-\beta_{N+1}q_{N-1}.          \tag{3}
\]

Differentiation gives the exact two-sided identity

\[
 t^2q_N'
 =q_{N+1}'+\alpha_{N+1}q_N'-2tq_N
   +\beta_{N+1}q_{N-1}'.                                  \tag{4}
\]

The failed feature `t^2q_N'` therefore mixes a forward derivative with the
backward recurrence channel.  The forward residual `q_(N+1)` needs the new
signed data and cannot be used in a noncircular current-rung certificate.
The predecessor `q_(N-1)`, by contrast, is already determined by a strict
subset of the old moments.  Replacing `t^2q_N'` by `q_(N-1)'` isolates this
available backward channel rather than bounding the two pieces separately.

In the variable `x=t^2`, `q_N=t^epsilon P_N(x)` and `P_(N-1)` is the
immediate predecessor in the signed orthogonal family.  Thus the pair
`(q_N,q_(N-1))` is the usual Christoffel--Darboux boundary data.  Equation
(1) uses the derivative of its backward component.  No Christoffel--Darboux
positivity is asserted; the interpretation only explains why the feature is
recurrence-compatible and old-data measurable.

For `kappa=2N+epsilon>=3`, the three feature polynomials have distinct leading
degrees and coefficients:

\[
 \begin{array}{c|ccc}
   &tq_N&q_N'&q_{N-1}'\\ \hline
 \deg&\kappa+1&\kappa-1&\kappa-3\\
 [t^{\deg}]&1&\kappa&\kappa-2.
 \end{array}                                                \tag{5}
\]

Hence (1) has exact rank three before any numerical Gram calculation.

## 2. Exact inverse-free condition

All inner products below use the positive measure `W^2dt`.  Put

\[
 \begin{array}{lll}
 A=\langle q',q'\rangle,&B=\langle q,q''\rangle,
   &C=\langle q,q\rangle,\\
 D=\langle tq,tq\rangle,&E=\langle q',tq\rangle,
   &Y=C+E,\\
 F=\langle q',r\rangle,&G=\langle tq,r\rangle,
   &T=\langle r,r\rangle,\\
 &&R=\langle q,r'\rangle,
 \end{array}                                                \tag{6}
\]

where `r=q_(N-1)'`.  The Gram matrix and score vector are

\[
 K_3=\begin{pmatrix}A&E&F\\E&D&G\\F&G&T\end{pmatrix},
 \qquad y_3=\begin{pmatrix}B\\Y\\R\end{pmatrix}.          \tag{7}
\]

Define

\[
 \begin{aligned}
 \Delta_2&=AD-E^2,\\
 H_{\rm num}&=DB^2-2EBY+AY^2-A\Delta_2,\\
 S_{\rm num}&=T\Delta_2-(DF^2-2EFG+AG^2),\\
 D_{\rm num}&=R\Delta_2-(DF-EG)B-(AG-EF)Y,\\
 N_{\rm prior}&=D_{\rm num}^2+H_{\rm num}S_{\rm num}.
 \end{aligned}                                               \tag{8}
\]

Exact block algebra gives

\[
 S_{\rm num}=\det K_3,
 \qquad
 \mathcal H_{V_N^{\rm prior}}
 ={N_{\rm prior}\over4\Delta_2S_{\rm num}},               \tag{9}
\]

and

\[
 \det\begin{pmatrix}K_3&y_3\\y_3^T&A\end{pmatrix}
 =-{N_{\rm prior}\over\Delta_2}.                           \tag{10}
\]

Equations (8)--(10) avoid a midpoint inverse.  The verifier separately
encloses `Delta_2>0`, `S_num>0`, and `N_prior>0`, and checks the direct Arb
solve, Schur-gain form, cleared form, and bordered determinant overlap.
`ADAPTIVE_SCORE_FINITE_DEGREE_BARRIER_NEXT.md` independently derives the same
one-feature condition as part of the general old-data block-gain formula and
explains why a uniform theorem still needs theta arithmetic.

## 3. The critical degree-15 enclosure

At `kappa=15`, the failed two-feature baseline and the prior-feature gain are

\[
 \begin{aligned}
 \mathcal H_{\{q',tq\}}
 &\in[-4.078210818763494,-4.078210650305328]10^{26},\\
 {\delta^2\over4\sigma}
 &\in[4.739327610252632,4.739327633513910]10^{26}.
 \end{aligned}                                               \tag{11}
\]

Their difference is the positive interval (2).  The rank-safe quantities
also satisfy

\[
 \begin{aligned}
 \Delta_2&>3.795179189770072\,10^{59},\\
 S_{\rm num}=\det K_3&>1.076481733039687\,10^{83},\\
 N_{\rm prior}&>1.080381572245252\,10^{169},\\
 \det\begin{pmatrix}K_3&y_3\\y_3^T&A\end{pmatrix}
 &<-2.846720398008033\,10^{109}.
 \end{aligned}                                               \tag{12}
\]

The strict signs in (12), not conditioning of a floating inverse, certify
(2).

## 4. Available-ladder falsifier check

The same frozen verifier gives the following rigorous lower endpoints.  The
common positive spectral scale is omitted consistently.

| parity | `kappa` | lower bound for `H_(V_prior)` |
|---|---:|---:|
| odd | 3 | `1.1478437754e2` |
| even | 4 | `3.2965303290e3` |
| odd | 5 | `6.8864677098e4` |
| even | 6 | `9.4861353824e6` |
| odd | 7 | `1.7149280770e9` |
| even | 8 | `1.5345578512e11` |
| odd | 9 | `4.0719579491e12` |
| even | 10 | `9.8182221411e13` |
| odd | 11 | `3.5396436818e17` |
| even | 12 | `6.2054037149e19` |
| odd | 13 | `5.5790888456e21` |
| even | 14 | `2.2293608344e24` |
| odd | 15 | `6.6111654811e25` |

This table is useful because it does not immediately falsify the
recurrence-aware rule on the available ladder.  It is not evidence that the
infimum over all degrees is positive.  A general proof must establish the
cleared inequality `N_prior>0` from complete-theta arithmetic uniformly in
`N`, or find a later exact counterexample.

## 5. Complete moments, reproduction, and provenance

The signed receipt contains certified `mu_j=4^jM_j`, `0<=j<=14`.  Outward
decimal padding is applied before exact division by `4^j`.  At each rung the
residual `q_N` uses only `M_0,...,M_(kappa-1)`; the new `M_kappa` is absent.

Positive half-line moments `n_j=||psi^(j)||_2^2`, `0<=j<=16`, use exact theta
orbits one through eight and an analytic norm tail containing every orbit
`n>=9`.  The extended tail ratio is

\[
 (10/9)^{35}e^{-19\pi}<1/2.                                \tag{13}
\]

From the checkpoint root, run

```text
<arb-python> workstreams/all-degree-analytic-search-next-v1/src/verify_prior_derivative_score_20261103.py \
  --root . --precision-bits 800 \
  --output workstreams/all-degree-analytic-search-next-v1/results/prior_derivative_score_20261103.json
```

Frozen SHA-256 values:

```text
verifier source
  45467394a474ae3e53cda98d91eb6c4ebde62afe84d76264ed1cef1c72683aeb
800-bit receipt
  77cb034a3c488d77a3ec52ae9429a3f14b92ba8a796a15745b4c80248c92ddfe
800-bit canonical payload
  be6376819d0a5759b3e4474d7c3159e925b6d488743b06fd294ce2f02bf85f34
900-bit precision replay
  98b2090ee2ea53d6313e3f91209ea05fccfeb7a926f7b1ff5ed3379f9061b6ab
```

Two clean 800-bit runs are byte-identical.  The separate 900-bit run confirms
every strict sign.  These are internal interval replays, not proof-assistant
formalization or external peer review.

## Consequence for the search

The fixed feature `t^2q_N'` fails because it keeps the forward and backward
recurrence channels coupled.  The old-data predecessor derivative repairs the
first known failure with no increase in dictionary width and with a lower
maximum polynomial degree.  The resulting exact theorem-shaped target is

\[
 \boxed{N_{\rm prior}(N,\epsilon)>0
 \quad\text{for every }2N+\epsilon\ge3.}                   \tag{14}
\]

Equation (14) is open.  It is narrower and more recurrence-specific than an
arbitrary adaptive-feature search, while retaining the noncircular old-data
gate.  A useful next step is an analytic theta bound for the correlated
backward innovation `D_num`, not a larger finite degree sweep.
