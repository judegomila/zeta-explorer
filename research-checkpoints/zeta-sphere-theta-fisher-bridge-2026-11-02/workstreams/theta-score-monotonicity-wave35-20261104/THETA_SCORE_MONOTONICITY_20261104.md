# Analytic monotonicity of the actual-theta first score

## Result and scope

Let

\[
 v=-\psi'/\psi,\qquad \mathcal S(h)=h(v-v'/v).
\]

Using the analytic Jacobi invariant region and exact autonomous system
recorded by Planat and Solé for the classical Riemann theta kernel, this note
proves

\[
 \boxed{\mathcal S'(h)>0\qquad(h>0).}
\]

Together with the already established endpoint limits
`S(0+)=-1` and `S(infinity)=infinity`, this gives exactly one positive
zero/crossing of the wave-32 factor

\[
 Y_1=h\psi v(\mathcal S-1).
\]

The word positive matters: `Y_1(0)=0` at the boundary as well.  This closes
one first-rung analytic subproblem.  It does not order the positive crossing
against the Green-response crossing, sign the remaining Green correlation,
provide an all-degree estimate, or imply RH.

## Score identities

Elementary cancellation gives

\[
 \mathcal S(h)=-h\,\psi''(h)/\psi'(h).
\]

Use `psi(h)=4 Phi(h/2)` and the variables of Planat--Solé,
*Second-Level Concavity of the Riemann Xi Kernel*, arXiv:2608.19160:

\[
 L=2h,\quad G(L)=\log\Phi(L/4),\quad
 P=G',\quad P_j=G^{(j+1)}.
\]

Then `v=-2P`, `v'=-4P_1`, and `v''=-8P_2`.  Put

\[
 C=-P^2/P_1=v^2/v',\qquad
 \alpha=PP_2/P_1^2=vv''/(v')^2,
\]

\[
 \delta=1-L^{-1}P/P_1=1-v/(hv').
\]

The imported first-level log-concavity is
`H=L^(-1)P-P_1>0`.  Together with `P<0` and `P_1<0`, this gives
`0<delta<1`.  Direct algebra gives

\[
 \mathcal S={C-1\over1-\delta},
\]

\[
 \boxed{
 \mathcal S'(h)={v'/v\over1-\delta}
 \{C(2-\delta)+\delta-\alpha\}.}
\]

The stronger inequality

\[
 C>\alpha
 \Longleftrightarrow vv'>v''
 \Longleftrightarrow PP_1+P_2>0                         \tag{1}
\]

implies `S'(h)>0`, because the brace is

\[
 (C-\alpha)+C(1-\delta)+\delta>0.
\]

## Jacobi invariant reduction

For the exact Jacobi variables in the cited preprint,

\[
 P=a(5/4-R)+{R\kappa\over R-3/2},
\]

\[
 a'={1\over2}(1-a^2)(R-1),\quad R'=R\kappa,
\]

\[
 \kappa'=a(R+1)\kappa+{1\over2}
 \{(1-a^2)R^2-2(2-a^2)R-(1+a^2)\}.
\]

Set `q=kappa/a` and `x=a^2`.  Exact symbolic differentiation gives

\[
 PP_1+P_2={aF(x,R,q)\over32(2R-3)^3},                  \tag{2}
\]

where `F` is affine in `x` and cubic in `q`.  At `x=0,1`, write `F` in
the cubic Bernstein basis on `0<=q<=1`.  After `R=4+y`, the four Bernstein
coefficients at each endpoint are degree-five polynomials in `y`; their
coefficients in descending order are:

| `x` | Bernstein index | coefficients |
|---:|---:|:---|
| 0 | 0 | 128, 2264, 13604, 35054, 36695, 9275 |
| 0 | 1 | 128, 6664/3, 39068/3, 32766, 103201/3, 31265/3 |
| 0 | 2 | 128, 6536/3, 37324/3, 30478, 96317/3, 34705/3 |
| 0 | 3 | 128, 2136, 11860, 28190, 29811, 12715 |
| 1 | 0 | 256, 3648, 19136, 44560, 42000, 8000 |
| 1 | 1 | 256, 10432/3, 17568, 40432, 123160/3, 13600 |
| 1 | 2 | 256, 9920/3, 48256/3, 36464, 115184/3, 45760/3 |
| 1 | 3 | 256, 3136, 14688, 32656, 34600, 15264 |

Every listed number is positive.  Affinity in `x` and Bernstein positivity
in `q` therefore give

\[
 F(x,R,q)>0
 \quad(0\le x\le1,\ 0\le q\le1,\ R\ge4).             \tag{3}
\]

## Why the physical orbit lies in the positive region

The cited Jacobi invariant theorem gives, for `L>0`,

\[
 0<\kappa<a<1,\qquad R\ge R_*.
\]

Thus `0<a<1` and `0<q<1`.  It remains only to compare `R_*` with 4.  The
same source records

\[
 R_*=\rho(1/2)^{-2},\qquad
 \rho(m)={1\over2}
 {{ }_2F_1(1/2,1/2;2;m)\over{ }_2F_1(1/2,1/2;1;m)}.
\]

At `m=1/2`, the two positive hypergeometric series have the same constant
term, while every positive-degree numerator coefficient is the corresponding
denominator coefficient divided by `n+1`.  Hence
`rho(1/2)<1/2` and `R_*>4`.

The physical orbit therefore lies strictly inside (3).  Equations (1)--(3)
prove `S'(h)>0` for every `h>0`.

## Imported result and nonclaims

The autonomous system, analytic invariant inequalities, and first-level
log-concavity are imported from the cited primary source and its classical
theta inputs.  The symbolic reduction from those inputs to (2)--(3) is exact
and independently replayed here.  This argument does not use the paper's
computer-assisted compact certificates for its main second-level theorem,
and it does not independently re-prove the imported analytic invariant
results from first principles.

Primary source:
<https://arxiv.org/abs/2608.19160>.
