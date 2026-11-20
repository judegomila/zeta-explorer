# Global mixed-source positivity, third preservation, and the six-node consequence

Research continuation, 11 November 2026. This note closes the two global
source conditions isolated in PR #54. It uses the fixed earlier proofs
listed in [SOURCES.md](SOURCES.md), the new scalar certificates, and the
analytic orientation theorem in this directory. All claims below concern
the actual infinite theta kernel.

## 1. Statement and fixed normalization

For $t\ge0$, put

$$
\kappa(t)=e^{t/4}\sum_{n\ge1}
\{2(\pi n^2e^t)^2-3\pi n^2e^t\}e^{-\pi n^2e^t},
\qquad C(t)=\frac14\int_t^\infty s\kappa(s)\,ds,
$$

and extend both functions evenly. The transform convention is

$$
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}\,dt,
\qquad L=F'/F.
$$

At anchor $a>0$, the canonical reduction of a positive pair $(u,v)$
is $(b,n)$, with the canceled, decaying solutions

$$
n+ab=u,\qquad an+4b''=R(a)v,
\qquad R(z)=z\frac{\mathcal L u(z)}{\mathcal L v(z)}.
\tag{1}
$$

For the initial pair $(C,\kappa)$, $R=L$. For each pair define

$$
H=u/v,\quad B=4u''/v,\quad J=4v''/v,\quad
P=16u^{(4)}/v,\quad Q=16v^{(4)}/v.
$$

A pair is in the **full comparison class** when

$$
H'<0,\quad B'>0,\quad J'>0,\qquad
\frac{d^2H}{dB^2}>0,\qquad\frac{d^2J}{dB^2}>0.
\tag{2}
$$

Subscripts denote the number of canonical reductions; unsubscripted
ratios below refer to the initial pair. Write $p=L(a)$ and
$N(a,t)=n_a(t)/\kappa(t)$, and define

$$
f_H=\frac{H''}{H'}N_t-N_{tt},\qquad
f_P=N_{tt}-\frac{B''}{B'}N_t.
\tag{3}
$$

Their strict positivity for $a,t>0$ is an earlier first-pair comparison
theorem. The new result is

$$
\boxed{\partial_a\partial_t\log f_H>0,\qquad
\partial_a\partial_t\log f_P>0\quad(a,t>0).}
\tag{4}
$$

Equivalently, both cleared expressions
$D_j=f_j(f_j)_{at}-(f_j)_a(f_j)_t$ are strictly positive. The exact
coalescent criterion from PR #54 identifies (4) with

$$
\boxed{W_{H,2}=W_3(B_2',J_2',-H_2')>0,\qquad
W_{P,2}=W_3(B_2',J_2',P_2')>0}
\tag{5}
$$

for every positive pair of anchors and every $t>0$, including equal
anchors. Here $W_m$ has ordinary derivative rows $0,\ldots,m-1$.

Combining (5) with PR #54's strict third-origin curvature for every
positive anchor triple proves that the third pair satisfies (2).
The fixed canonical comparison and Schur theorems then yield

$$
\boxed{\left[\frac{L(x_i)+L(x_j)}{x_i+x_j}\right]_{i,j=1}^{6}\succ0
\quad\text{for all six distinct positive real }x_i.}
\tag{6}
$$

Equation (6) concerns six interpolation nodes. It does not count or
locate six zeros. Repeated canonical anchors are included in the
construction; the matrix statement here is for distinct evaluation
nodes, since repeated identical nodes would produce repeated rows.

## 2. What was open and how this proof resolves it

PR #53 established the full class through the second pair. PR #54
proved the positive normalized origins of both quantities in (5),
the third-origin curvature condition, and total nonnegativity of the
auxiliary compensation kernel at every finite order. It also reduced
the remaining all-spatial source problem exactly to (4).

Total nonnegativity of that kernel alone does not fix the signs of a
transform of signed data. The new proof supplies a specific ordering
of the theta source densities, then uses an oriented form of variation
diminution and the already positive origins. The anchor is arbitrary
throughout that analytic argument.

The new scalar inputs are

$$
K_H=W_5(B',J',P',Q',H'),\qquad
S_U=W_4(B',J',P',U'),\qquad
K_U=W_5(B',J',P',Q',U'),
$$

where $U=64C^{(6)}/\kappa$. The certificates prove

$$
K_H(t)<0,\qquad S_U(t)>0\qquad(t>0),
\tag{7}
$$

and exactly one simple negative-to-positive zero of $K_U$ at

$$
\tau\in(1/2,9/16).
\tag{8}
$$

The earlier source $S_Q=W_4(B',J',P',Q')$ has its unique
negative-to-positive zero in $(0,3/16)$. Thus the order of these
crossings is certified, not inferred from a plot.

## 3. The signed-density argument

The original positive source prefix gives an increasing coordinate
$x=J'/B'$ and a function $Y=P'/B'$ with $w=Y_{xx}>0$. For
$j\in\{H,Q,U\}$, set

$$
h_j=j'/B',\qquad \rho_j=(h_{j,xx}/w)_x.
$$

Exact row and column elimination gives

$$
S_j=(B')^4x_t^6w^2\rho_j,
\qquad
K_j=(B')^5x_t^{10}w^3W_{2,x}(\rho_Q,\rho_j)
\quad(j=H,U).
\tag{9}
$$

All displayed factors are positive. Let $q$ denote the zero of
$\rho_Q$ in this coordinate. Its order relative to other spatial
points is unchanged by the increasing coordinate map.

For H, $K_H<0$ says that $\rho_H/\rho_Q$ strictly decreases on
each side of $q$. At $q$, the strict Wronskian sign implies
$\rho_Q'(q)>0$ and $\rho_H(q)>0$. For every real level $c$,
$\rho_H-c\rho_Q$ therefore has the pattern $-,+,-$, with either
exterior block permitted to be empty.

For P, $S_U>0$ gives $\rho_U>0$. The sign change of $K_U$ after
$q$ says that the positive ratio $\rho_U/\rho_Q$ on the right of
$q$ decreases and then increases. For every positive level $c$,
$\rho_U-c\rho_Q$ has pattern $+,-,+$, allowing empty blocks.
It is positive to the left of $q$.

Fix an arbitrary first anchor and apply its Peano transform $\Pi$.
Write $I_j=\Pi\rho_j$. The earlier source theorem gives $I_Q>0$;
the new positivity of $\rho_U$ gives $I_U>0$.

The orientation needed here is stronger than merely counting at most
two sign changes. A strictly totally positive kernel cannot turn
$-,+,-$ into $+,-,+$: a three-by-three determinant with columns at
the two source crossings and the integration variable has signs
$+,-,+$. Its integral against the input is nonpositive, whereas
expansion along that column would give a strictly positive combination
of three proposed alternating output values. This contradiction proves
the required orientation. Missing exterior blocks are handled by
ordinary variation diminution.

For the actual weakly totally nonnegative kernel, first truncate the
source to a compact interval while retaining any hypothetical strict
output signs, then use the strictly totally positive smoothed kernels
proved in PR #54. Compact domination justifies the limit. This order
of operations avoids assuming domination on the entire untruncated
source domain for every smoothing parameter.

It follows that $I_H/I_Q$ is quasiconcave and $I_U/I_Q$ is
quasiconvex as a function of the spatial point. In one dimension this
means their derivatives have, respectively, a possible positive-to-negative
and a possible negative-to-positive transition, with zeros allowed.
For nonpositive levels in the U argument, positivity of $I_U,I_Q$
supplies the required conclusion directly.

For the following canonical identities, compose each call-transform
output with its increasing hyperbolic output coordinate $y=y(t)$
and take every derivative and Wronskian in $t$. Relative to the call
coordinate, $I_j$ and its Peano kernel gain the common positive output
factor $(dy/dt)^6$, and $G$ gains $(dy/dt)^3$. These changes preserve
total nonnegativity and every ratio-level ordering above. Both sides
of the following derivative-source identities scale by $(dy/dt)^{10}$,
so their literal factors are consistent:

$$
S_{H,1}=-\frac{ap^2I_Q^2}{(TB)^5G}(I_H/I_Q)',\qquad
S_{Q,1}=\frac{p^2I_Q^2}{(TB)^5G}(I_U/I_Q)',
\tag{10}
$$

where $T$ is the common call transform composed as just specified and
$G=W_3(TB,TJ,TP)>0$. Therefore both first-pair higher sources have
at most one negative-to-positive transition. This is the ordering
needed for the second compensation step. It does not assert that
all higher source Wronskians are positive.

The full proof, exact factors, and endpoint conditions are in
[the oriented compensation note](theta_mixed_identity_20261111.md).

## 4. Why this yields strict positivity everywhere

The first-pair prefix $(B_1',J_1',P_1')$ has the required positive
initial Wronskians by the earlier full-class and first-source theorems.
Its source coordinate is regular at the origin. In $u=t^2$,

$$
\left(\frac{J_{1,u}}{B_{1,u}}\right)_u
=\frac{N B_u\phi_P}{4pN_u^2}>0\quad\text{at }u=0,
\qquad f_P=t^2\phi_P.
$$

Here the separate positive origin theorem gives $\phi_P(a,0)>0$,
and the known decrease of $N$ forces $N_u(a,0)<0$. The normalized
first-source origin gives the remaining strictly positive curvature
of this new prefix. Thus the inverse source coordinate and its
generalized jets are analytic at the endpoint.

At infinity, for each fixed anchor, the canceled Volterra expression
gives differentiated leading forms

$$
n_a\sim\frac{t\kappa}{4\eta},\qquad
b_a\sim\frac{p\kappa}{4\eta^2},\qquad \eta=\pi e^t.
$$

These imply finite-power growth bounds for all generalized ratios,
reciprocal coordinate derivatives, and source densities required by
the next Peano representation. The tilted theta measure decays
double-exponentially, so all the relevant integrals and differentiated
integrals converge. These are fixed-anchor statements for arbitrary
anchors; no uniform bound over both anchors is required.

For either second source, let $\rho$ be the first-pair density and
$I(y)=\int\Pi_1(y,s)\rho(s)\,ds$. The sign of $\rho$ has at
most one negative-to-positive transition. PR #54 supplies a strictly
positive $t^6$-normalized origin for the corresponding source, so
$I(y_0)>0$ at every sufficiently small positive output point.

If the source is nonnegative throughout, its nontriviality and
$\Pi_1>0$ give strict positivity everywhere. A nonpositive source
throughout would contradict the positive origin. In the remaining
case let $s_*$ separate its negative and positive parts. The positive
two-by-two minors give the compensation inequality

$$
I(y)\ge
\frac{\Pi_1(y,s_*)}{\Pi_1(y_0,s_*)}I(y_0)>0
\qquad(y>y_0).
\tag{11}
$$

The point $y_0$ can be chosen below any given positive output point.
Consequently both sources in (5) are strictly positive on the entire
positive spatial axis. Applying the canceled coalescent identity
establishes the strict local inequalities (4), not only positivity for
distinct anchor pairs.

## 5. Full-domain certificates for the three scalar inputs

The two primary implementations prove (7)--(8) with interval arithmetic
on bounded regions and exact analytic estimates on the infinite tail.

| Spatial region | H certificate | Joint U/crossing certificate |
| --- | --- | --- |
| $0<t\le3/16$ | $K_H/t^{15}<-5.59\cdot10^{12}$ | $S_U/t^{10}>7.48\cdot10^{14}$ and $K_U/t^{15}<-5.10\cdot10^{21}$ |
| $3/16\le t\le1/2$ | $K_H<0$ | $S_U>0$, $K_U<0$ |
| $1/2\le t\le9/16$ | $K_H<0$ | $S_U>0$, $(K_U/t^{15})'>1.0387\cdot10^{22}$ |
| $9/16\le t\le4$ | $K_H<0$ | $S_U>0$, $K_U>0$ |
| $t\ge4$ | $K_H<-1/2$ | $S_U>1/2$, $K_U>1/2$ |

The H compact certificate gives the common margin $K_H<-63.15$.
The U compact certificate gives $S_U>34{,}000{,}000$. The crossing
endpoints satisfy $K_U(1/2)<-2.646\cdot10^{16}$ and
$K_U(9/16)>3.761\cdot10^{16}$. Together with the strict derivative
sign, these prove existence, uniqueness, simplicity and orientation
of the crossing; a pointwise root estimate is not used.

Each primary certificate uses 256 closed origin cells at degree 56
and 1,980 closed compact Taylor cells at order 16, with 512-bit balls
and sixteen explicit theta modes. All omitted modes and every required
derivative are enclosed. Analytic even-coordinate deflation gives the
strict limits at zero. The H certificate includes the integral defining
$C$ and its propagation error.

On $t\ge4$, let $z=\pi e^t>160$. Shifted polynomial coefficient
checks give strict first-mode margins. The omitted-mode logarithmic
jets are bounded by $2^{122}z^{10}e^{-3z}$, and explicit determinant
degree and coefficient norms bound their effect below $1/2$ throughout
the tail. The H integral is also enclosed before its source sign is
assigned. The calculations apply to the complete theta series.

The runner carries out 137 exact symbolic checks and 70 exact tail
checks, with 4,472 primary interval-cell evaluations. The two
certificates use the same 2,236-cell spatial partition for different
source statements. A separate implementation of $S_U>0$ corroborates
the U part; its overlapping cells are not added to these primary counts.

## 6. Third full preservation and the finite Schur count

From the already full second pair, the first comparison gives the
third positive pair with $H_3'<0$ and $B_3'>0$. The now-proved
sources (5) give both comparison convexities of the third pair.
The earlier theorem $J_3''(0)>0$ for every positive anchor triple
starts $J_3'>0$ near zero; convexity in the increasing $B_3$ coordinate
propagates it throughout the spatial axis. This establishes (2) at
the third pair for arbitrary anchors.

The fixed comparison implications then give the following finite chain:

$$
\mathcal P_0\text{ full}\ \longrightarrow
\mathcal P_1\text{ full}\ \longrightarrow
\mathcal P_2\text{ full}\ \longrightarrow
\mathcal P_3\text{ full}\ \longrightarrow
\mathcal P_4\text{ basic}\ \longrightarrow
\mathcal P_5\text{ positive}.
$$

Here basic means a positive pair with $H'<0$ and $B'>0$, the
comparison inequalities needed by the next positivity step. Five
successive positive Schur reductions, followed by the final positive
diagonal value, prove (6). Canceled numerator and denominator transforms
are strictly positive on the positive real axis, so the congruence
factors at distinct nodes are nonzero. This uses the exact finite
Schur theorem at the fixed earlier commit, not a numerical eigenvalue
test of selected matrices.

### Energy consequence on the established test class

Let $v(t)=\sum_{i=1}^{m}c_i e^{-x_i t}$ be nonzero, with distinct
real rates $x_i>1/2$ and $m\le6$. Equation (6), or its principal
submatrices, gives

$$
Q_L(v)=\sum_{i,j=1}^{m}\overline{c_i}c_j
\frac{L(x_i)+L(x_j)}{x_i+x_j}>0.
\tag{12}
$$

The fixed [arithmetic/theta energy identity from PR #48](https://github.com/judegomila/mathexplorer/blob/499528b487e3249c5a35602f83343aaa53cec848/rigorous/theta-schur-kernels-2026-11-09/theta_schur_residual_energy_20261109.md)
identifies this same quadratic form with the previously derived gamma,
pole and prime-autocorrelation energy. The restriction $x_i>1/2$
keeps that arithmetic expansion absolutely convergent; the Pick
matrix theorem itself holds for all positive real nodes. This extends
the positive energy test class from five to six rates. It does not
assert positivity for arbitrarily many rates or for arbitrary fields.

## 7. Supporting boundary results

Two additional analytic components were derived while resolving the
global problem. Their own estimates have the following precise scopes.

For each fixed $T>0$, uniformly on $0\le t\le T$ after even
origin normalization,

$$
\frac{a^6D_H}{(p-ap')t^5}\longrightarrow
\frac{W_{H,0}}{-H't^5},\qquad
\frac{a^8D_P}{(p+ap')t^5}\longrightarrow
\frac{W_{P,0}}{B't^5}.
$$

The limiting functions are strictly positive, and the proof controls
the anchor derivative of the resolvent remainder. Combining this with
the earlier compact-anchor origin theorem yields an independently
proved uniform strip: some $\delta>0$ works for all $a>0$ and
$0<t\le\delta$. The proof does not assign a numerical $\delta$.

For $z=\pi e^t$ and $q=a/(2z)$ in any fixed compact subset of
$(0,\infty)$, including $q=1$,

$$
\partial_a\partial_t\log f_j
=\frac{6z}{(a+2z)^2}\{1+O(1/t)\}>0
$$

eventually and uniformly. A positive double integral for the
log-gamma Stein kernel controls the differentiated remainder at the
turning region. Separate formulas cover fixed compact positive anchor
intervals as $t\to\infty$. No finite starting height or uniformity at
$a=0$ is claimed by those particular asymptotic estimates. The global
theorem (4) is supplied by sections 2--5, so these limited asymptotic
scopes leave no hole in its domain.

## 8. Remaining research obligation

The fixed all-order interpolation theorem gives a conditional route
from positive Pick matrices of every finite size to the desired
zero-free continuation and RH. Equation (6) supplies one finite size.
It does not satisfy the every-size premise.

The next structural target is to propagate the required density
ordering and strict origin conditions at every canonical depth.
The auxiliary kernel's total nonnegativity is already an all-order
theorem. This checkpoint proves that the actual sources at one further
depth meet its hypotheses, via the fixed signs of $K_H,S_U,K_U$.
Those three specific scalar certificates do not by themselves form
an induction invariant. A general replacement must be proved, including
the endpoint and strictness conditions, before claiming arbitrary-depth
preservation.

The result is an internally checked, computer-assisted research
argument relative to declared earlier proofs. No external peer review,
formal verification, literature novelty, new zero-free height, or proof
of RH is claimed.
