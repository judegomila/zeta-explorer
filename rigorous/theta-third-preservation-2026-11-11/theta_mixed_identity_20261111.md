# Oriented level-set compensation for the global mixed-source inequalities

Research continuation, 11 November 2026. This note turns one fixed,
anchor-free fifth source sign into the H half of the global mixed-source
criterion from PR #54. The new scalar input is

$$
K_H(t):=W_5(B',J',P',Q',H')(t)<0\qquad(t>0).                 \tag{1}
$$

The companion actual-theta certificate must prove (1) on the entire
positive axis. Given that input and the fixed results listed below,
this note proves

$$
W_{H,2}(a,c,t)>0\quad(a,c,t>0),
\qquad
\partial_a\partial_t\log f_H(a,t)>0\quad(a,t>0).            \tag{2}
$$

Every coincident-anchor case is included. Section 7 gives a companion
criterion for the P-source mixed inequality, using two further fixed
scalar source signs. Neither six-node positivity nor RH follows from
(2) alone; the scalar inputs for both parts must be proved independently.

## 1. Fixed inputs and conventions

The original pair is `(C,kappa)`, with

$$
H=C/\kappa,\quad B=4C''/\kappa,\quad J=4\kappa''/\kappa,
\quad P=16C^{(4)}/\kappa,\quad Q=16\kappa^{(4)}/\kappa.
$$

`W_m` uses ordinary derivative rows zero through `m-1`. Derivatives are
spatial unless a different coordinate is displayed. The exact factors
below are unchanged in sign by an increasing spatial reparametrization.

Fixed PR #53, commit `5d64d45acf37f4957a8f65c036b502e1b49292d0`, supplies:

- The positive source prefix `B'>0`, `W_2(B',J')>0`,
  `W_3(B',J',P')>0`.
- One negative-to-positive crossing for each original source
  `S_H=W_4(B',J',P',H')` and `S_Q=W_4(B',J',P',Q')`.
- Strictly positive first-reduced sources for every first anchor,
  including positive normalized origin limits. In particular
  `W_{P,1}=W_3(B_1',J_1',P_1')>0`.
- The positive Peano compensation kernel and the compensation theorem
  for a source with a single negative-to-positive sign transition.

Fixed PR #54, commit `7556c563be6845444d33b187d1ab8dc984664795`, supplies:

- Total nonnegativity of every finite order for the original Peano
  kernel, with strictly totally positive Gaussian-smoothed approximants
  converging at every interior pair and dominated on compact source sets.
- Strictly positive `t^6`-normalized limits of both `W_{H,2},W_{P,2}` for every positive
  anchor pair, including coalescence.
- The positive origin value `F_P(a)=lim_{t->0} f_P(a,t)/t^2>0`
  for every positive anchor, and the exact one-anchor source equivalence.

These are declared earlier proof inputs, not reproved here. The use of
`F_P` below is an origin input; it does not assume the global P
mixed-source inequality that this note is working to establish.

## 2. The fifth source controls the ratio of two signed densities

Use the increasing original source coordinate

$$
x=J'/B',\qquad Y=P'/B',\qquad w=Y_{xx}>0,
\qquad h_H=H'/B',\quad h_Q=Q'/B'.
$$

The two Peano source densities are

$$
\rho_H=(h_{H,xx}/w)_x,\qquad
\rho_Q=(h_{Q,xx}/w)_x.                                  \tag{3}
$$

Their signs are those of `S_H,S_Q`, since

$$
S_j=(B')^4x_t^6 w^2\rho_j.                              \tag{4}
$$

The monic operator annihilating `1,x,Y` is
`L=D_x^3-(w_x/w)D_x^2`. Thus `L h_j=w rho_j`. Applying the
unit-triangular row operators `1,D,D^2,L,DL` gives

$$
W_5(1,x,Y,h_Q,h_H)=w^3W_{2,x}(\rho_Q,\rho_H).
$$

The common-factor and coordinate-change identities therefore give

$$
\boxed{K_H=(B')^5x_t^{10}w^3
       W_{2,x}(\rho_Q,\rho_H).}                         \tag{5}
$$

All preceding factors are strictly positive. The hypothesis (1) is
exactly

$$
\left(\frac{\rho_H}{\rho_Q}\right)_x<0
\quad\text{wherever }\rho_Q\ne0.                       \tag{6}
$$

Let `q` be the unique zero of `rho_Q`. Its negative-to-positive crossing
implies `rho_Q'(q)>=0`. At that point (5) gives
`-rho_Q'(q)rho_H(q)<0`, so in fact

$$
\rho_Q'(q)>0,\qquad \rho_H(q)>0.                        \tag{7}
$$

The ratio in (6) is strictly decreasing on both sides of `q`, tends
to minus infinity on its left and plus infinity on its right, and is
positive on the entire right side because the H-source crossing lies
before `q`.

For **every real number** `c`, the function

$$
g_c(x)=\rho_H(x)-c\rho_Q(x)                             \tag{8}
$$

therefore has the sign pattern

$$
-\ ,\quad +\ ,\quad -\ ,                             \tag{9}
$$

with either exterior block possibly empty. Indeed, on the left side
of `q`, the decreasing ratio and the negative denominator permit only
a negative-to-positive transition. On the right side, the positive
denominator permits only a positive-to-negative transition. The
function is strictly positive at `q`. No estimate of a root location,
no constant positive combination, and no anchor-dependent hypothesis
is required for this conclusion.

## 3. Oriented variation diminution preserves the middle-positive pattern

The weak statement `S^-(Pi g)<=S^-(g)` alone is insufficient: it does
not explicitly exclude replacing `-,+,-` by `+,-,+` with the same
number of sign changes. Here is the needed orientation argument.

First take a strictly totally positive kernel `K(y,s)` and a function
`g` with two sign transitions at `r<s`, negative outside `(r,s)` and
positive inside. If its transform had signs `+,-,+` at ordered output
points `y_1<y_2<y_3`, form

$$
q(z)=\det\begin{pmatrix}
K(y_1,r)&K(y_1,s)&K(y_1,z)\\
K(y_2,r)&K(y_2,s)&K(y_2,z)\\
K(y_3,r)&K(y_3,s)&K(y_3,z)
\end{pmatrix}.                                         \tag{10}
$$

Strict total positivity and column ordering show that `q` has signs
`+,-,+` as `z` moves through the same three intervals. Hence
`q(z)g(z)<=0` everywhere and its integral is negative when `g` is
nonzero on a set of positive measure. Expanding the last column of
(10), the three coefficients have signs `+,-,+`, because they are
signed strictly positive two-by-two minors. Their scalar product with
the proposed transformed signs `+,-,+` is strictly positive. This
contradicts the preceding integral inequality.

If an exterior sign block is absent, the input has at most one sign
change, and the ordinary variation-diminishing theorem already
excludes two alternating output sign changes.

Now apply this to the actual, possibly non-strict Peano kernel `Pi`.
Suppose three output signs `+,-,+` existed. Absolute convergence lets
us truncate the source to a compact interval while retaining those
strict signs. The Gaussian-smoothed kernels from PR #54 are strictly
totally positive and converge to `Pi`; their compact-source domination
lets us choose a sufficiently small smoothing parameter while again
retaining the same three signs. This contradicts the strictly positive
case just proved. Consequently,

> A transform by the actual Peano kernel cannot turn the pattern
> `-,+,-`, with empty exterior blocks allowed, into `+,-,+`.

This passage takes the source truncation first. It does not assume a
uniform integrable bound for an untruncated signed density under every
smoothing parameter.

## 4. Every first-reduced H higher source has the needed crossing orientation

Fix the first anchor `a>0`, let `p=L(a)>0`, and use its common call
transform `T`. To retain the ordinary spatial derivative convention,
regard every call output as composed with its increasing hyperbolic
output coordinate `y=y(t)`: `Tq(t)=(call Tq)(y(t))`. All Wronskians
and primes in the canonical identities (14) and (24) then use `t`.
Relative to the call coordinate, each fourth Wronskian `I_j` gains
the common factor `(dy/dt)^6`, `G` gains `(dy/dt)^3`, and the final
derivative-source fourth Wronskian gains `(dy/dt)^10`. The displayed
identities therefore retain their literal factors. Multiplying the
Peano kernel by the same positive output factor `(dy/dt)^6` preserves
all its ordered-minor and orientation properties. Put

$$
g_1=TB,\quad g_2=TJ,\quad g_3=TP,\quad
G=W_3(g_1,g_2,g_3)>0,
$$

$$
I_H=W_4(g_1,g_2,g_3,TH)=\Pi\rho_H,\qquad
I_Q=W_4(g_1,g_2,g_3,TQ)=\Pi\rho_Q.                       \tag{11}
$$

The fixed first-reduced source theorem gives `I_Q>0`. For any real
`c`, linearity and (8) give

$$
I_H-cI_Q=\Pi g_c.
$$

Section 3 says that this expression cannot have signs `+,-,+` at
three ordered spatial points. Thus the positive-level sets of the
ratio

$$
R_a=I_H/I_Q                                              \tag{12}
$$

are intervals. More explicitly,

$$
R_a(y_2)\ge\min\{R_a(y_1),R_a(y_3)\}
\quad(y_1<y_2<y_3):                                    \tag{13}
$$

otherwise a level `c` strictly between the middle value and both outer
values would yield the forbidden signs. Equation (13) is quasiconcavity.
For a differentiable function on an interval, this means its derivative
can be positive and then negative, with zeros allowed, but cannot be
negative at an earlier point and positive at a later point.

The exact canonical column identity from PR #54 is

$$
S_{H,1}:=W_4(B_1',J_1',P_1',H_1')
=-\frac{a p^2}{(TB)^5G}W_2(I_Q,I_H)
=-\frac{a p^2I_Q^2}{(TB)^5G}\,(R_a)'.                    \tag{14}
$$

Every factor before the final minus sign is positive. Consequently
`S_H,1` has at most one sign transition, in the negative-to-positive
direction. The transition location may depend on `a`; a source already
nonnegative everywhere is permitted. Isolated or higher-order zeros
are permitted as well. We have not inferred a strictly nonzero derivative
from weak total nonnegativity.

## 5. The next Peano comparison has the required endpoint regularity

To use compensation for the first pair, its new positive source prefix
is `(B_1',J_1',P_1')`. The first two prefix signs follow from first full
preservation, and the third is the fixed positive source `W_P,1`.
We check the extra endpoint conditions, which do not follow from upper
derivative bounds alone.

### Spatial origin

Put `u=t^2`, `N=n_a/kappa`, and keep the original `B`. The exact identities
are

$$
B_1=p/N-a,\qquad J_1=a^2+(B-ap)/N,
$$

$$
\boxed{(J_{1,u}/B_{1,u})_u
=\frac{N B_u\phi_P}{4p N_u^2},\qquad
\phi_P=4\left(N_{uu}-\frac{B_{uu}}{B_u}N_u\right).}       \tag{15}
$$

The fixed origin theorem gives `phi_P(a,0)=F_P(a)>0`, and the original
kernel has `B_u(0)>0`. Also `N_u(0)<0`: the known `N_t<0` gives
`N_u(0)<=0`; equality, together with `phi_P(a,0)>0`, would imply
`N_uu(0)>0` and hence `N_u>0` at small positive `u`, a contradiction.
Thus `B_1,u(0)>0`, and (15) is strictly positive at zero.

The new coordinate `x_1=J_1'/B_1'=J_1,u/B_1,u` consequently has an
analytic inverse in `u` at the origin. The fixed strictly positive
limit of `W_P,1/t^6`, together with `B_1,u(0)>0` and
`x_1,u(0)>0`, gives a finite strictly positive limit for
`w_1=(P_1'/B_1')_{x_1x_1}`. All other source ratios have finite analytic
initial jets. These are precisely the lower-endpoint conditions used
in the Peano reconstruction.

### Spatial infinity

At fixed `a,p>0`, let `eta=pi exp(t)`. The canceled Volterra formula,
with its differentiated theta tail, gives

$$
n_a\sim\frac{t\kappa}{4\eta},\qquad
b_a\sim\frac{p\kappa}{4\eta^2}.
$$

The expansions hold with each required fixed finite number of spatial
derivatives. They follow by rescaling the Volterra tail and using the
first theta mode with its exponentially smaller omitted-mode remainder;
we are not differentiating an arbitrary unqualified asymptotic relation.
Consequently,

$$
B_1'\sim\frac{4p\eta}{t},\quad
J_1'\sim8\eta^2,\quad
P_1'\sim\frac{48p\eta^3}{t},\quad
H_1'\sim-\frac{p}{t\eta}.
$$

In particular,

$$
x_1\sim\frac{2t\eta}{p},\quad
(x_1)_t\sim\frac{2t\eta}{p},\quad
Y_1=P_1'/B_1'\sim12\eta^2,\quad
w_1\sim\frac{6p^2}{t^2}>0.                              \tag{16}
$$

The same differentiated expansions bound the generalized source ratios,
the needed reciprocal coordinate derivatives and `1/w_1`, and the
new source density by finite powers of `t,eta`. The measure for the
next fixed anchor is a fixed exponential tilt of
`n_a~t kappa/(4 eta)` and still decays double-exponentially. The proof
of Peano-integral convergence in PR #53 therefore applies to this new
prefix: truncated remainders vanish below their knots, their remaining
coefficients have the stated finite-power bounds, and theta decay
justifies Fubini and the differentiated integrals. No bound uniform
in both anchors is needed; the argument applies to each arbitrary
positive anchor pair.

## 6. Origin strictness supplies global strictness

Fix both positive anchors `a,c`. Let `Pi_1` be the new first-pair Peano
kernel for the second reduction, with call outputs composed with the
new increasing output map as in section 4, and let `rho_H,1` be its generalized
source density. Its sign is that of `S_H,1`, so section 4 gives a single
negative-to-positive pattern, with empty blocks allowed.

The exact next source identity is

$$
W_{H,2}=\frac{cR_1(c)}{(T_1B_1)^4}
\int\Pi_1(t,s)\rho_{H,1}(s)\,ds.                       \tag{17}
$$

Here `T_1` and `Pi_1` use the composed ordinary-`t` convention. Both
sides acquire the same factor `(dy_c/dt)^6` relative to their pure call
coordinate versions; that factor is already included in `Pi_1` and
is not multiplied in a second time. Every prefactor is positive. The all-anchor
origin theorem from PR #54 says that the left side, divided by its
forced `t^6` factor, has a strictly positive limit. Hence the output
integral in (17) is strictly positive on some initial interval.

An everywhere nonpositive source would make that integral nonpositive,
contradicting this origin input. If the source is everywhere nonnegative,
its nontriviality and `Pi_1>0` give strict positivity everywhere. Otherwise
there is a finite crossing point `s_*`, and the compensation inequality
from PR #53 gives, for any later output point,

$$
I(y)\ge\frac{\Pi_1(y,s_*)}{\Pi_1(y_0,s_*)}\,I(y_0)>0.
\tag{18}
$$

This proves `W_H,2(a,c,t)>0` for all positive `a,c,t`, including
coincident anchors. Strictness comes from the separately proved
origin sign and the positive kernel, not from a claim that every
nonnegative minor is strictly positive.

Finally the exact coalescent criterion from PR #54 turns this result
into the global H mixed inequality in (2), equivalently

$$
\boxed{f_H(f_H)_{at}-(f_H)_a(f_H)_t>0\quad(a,t>0).}        \tag{19}
$$

## 7. A companion orientation theorem for the P source

The mechanism uses two signed input densities rather than a positive
constant combination. Its reusable ingredients are: a strict orientation
of their density Wronskian, a positive transformed denominator, and an
origin sign for the subsequent compensation. It supplies an all-anchor
conclusion from a fixed one-variable source inequality.

For the P source define

$$
S_U=W_4(B',J',P',U'),\quad
K_U=W_5(B',J',P',Q',U'),\qquad U=64C^{(6)}/\kappa.
$$

The sufficient fixed scalar hypotheses are:

1. `S_U(t)>0` for every `t>0`.
2. There is a point `tau` after the unique zero `q` of `S_Q` such that
   `K_U<0` before `tau` and `K_U>0` after `tau`. A zero at `tau` is
   permitted; an exact single-crossing certificate supplies this property.

Let `h_U=U'/B'` and `rho_U=(h_U,xx/w)_x`. The same identities as (4)--(5)
show that `rho_U>0` and

$$
K_U=(B')^5x_t^{10}w^3 W_{2,x}(\rho_Q,\rho_U).
\tag{22}
$$

On the interval to the right of `q`, the positive ratio
`rho_U/rho_Q` consequently decreases up to `tau` and increases
thereafter. For any `c>0`, the input `rho_U-c rho_Q` is strictly
positive to the left of `q`, since `rho_U>0` and `rho_Q<0` there.
To its right the positive denominator and the single minimum give
the pattern `+,-,+`, with the middle or a terminal block allowed
to be empty. Thus its transform cannot have the opposite pattern
`-,+,-`: apply section 3 to the negated source.

For a fixed first anchor set `I_U=Pi rho_U`. Then `I_U>0` follows
from strict positivity of both the density and the Peano kernel, and
`I_Q>0` is the fixed earlier theorem. For levels `c<=0`,
`I_U-c I_Q>0` directly. For every positive level the preceding oriented
argument applies. Consequently the transformed ratio

$$
R_{U,a}=I_U/I_Q
$$

is **quasiconvex**:

$$
R_{U,a}(y_2)\le\max\{R_{U,a}(y_1),R_{U,a}(y_3)\}
\quad(y_1<y_2<y_3).
\tag{23}
$$

Its derivative cannot be positive at an earlier point and negative
at a later point. The exact positive canonical factor is

$$
\boxed{S_{Q,1}:=W_4(B_1',J_1',P_1',Q_1')
=\frac{p^2}{(TB)^5G}W_2(I_Q,I_U)
=\frac{p^2 I_Q^2}{(TB)^5G}(R_{U,a})'.}
\tag{24}
$$

Therefore `S_Q,1` has at most one negative-to-positive transition,
with the same allowance for zero values and empty sign blocks used
for `S_H,1`.

The new-prefix endpoint proof in section 5 also applies to the Q-source
column. At the origin `Q_1'/B_1'=Q_1,u/B_1,u` is analytic in `u`,
because `n_a(0)>0` and `B_1,u(0)>0`; the same positive `x_1,u(0)`
and `w_1(ell)` give its finite initial generalized jets. At infinity,
the differentiated canceled-tail expansion gives explicitly

$$
Q_1=16n_a^{(4)}/n_a\sim16\eta^4,\qquad
Q_1'\sim64\eta^4,\qquad
\frac{Q_1'}{B_1'}\sim\frac{16t\eta^3}{p}.
\tag{24a}
$$

Together with the reciprocal coordinate and `1/w_1` bounds in (16),
this supplies finite-power bounds for the Q-source generalized density
and the differentiated Peano integrals as well. The fixed all-anchor positive
origin limit for `W_P,2/t^6` then supplies strictness in the next
compensation exactly as in section 6. Hence these two scalar hypotheses
imply

$$
\boxed{W_{P,2}(a,c,t)>0\quad(a,c,t>0),\qquad
f_P(f_P)_{at}-(f_P)_a(f_P)_t>0\quad(a,t>0).}
\tag{25}
$$

No comparison between transformed and original origin ratios is needed.
Positivity of `rho_U` makes the two-sign-change orientation argument
sufficient. In particular this argument does not assume that the two
original signed sources possess a positive constant linear combination.

### Combined consequence and scope

If the actual-theta certificates establish (1) and both scalar hypotheses
above, then (19) and (25) close both global source gates. Together with
the all-anchor third-origin curvature from PR #54, the existing comparison
theorem makes the third canonical pair full. The Schur count then gives
strict six-node real Pick positivity. This implication requires
those three fixed scalar certificate conclusions. The companion H
and U/crossing certificates establish all three on the full unbounded
domain, as assembled in `theta_third_preservation_global_20261111.md`.
Canonical preservation at arbitrary depth and RH remain open.

More explicitly, for arbitrary positive anchors at every step, the
comparison implications and the already proved third-origin slope give

$$
R_0\text{ full}\ \longrightarrow R_1\text{ full}
\ \longrightarrow R_2\text{ full}\ \longrightarrow R_3\text{ full}
\ \longrightarrow R_4\text{ basic}\ \longrightarrow R_5\text{ positive}.
\tag{26}
$$

The last five strictly positive Schur reductions, followed by the final
positive diagonal value, yield

$$
\boxed{\left[\frac{L(x_i)+L(x_j)}{x_i+x_j}\right]_{i,j=1}^{6}\succ0
\quad\text{for every six distinct positive real }x_i.}
\tag{27}
$$

The canceled numerator and denominator transforms are positive on the
positive real axis, so the Schur factors at distinct nodes are nonzero.
Repeated canonical anchors in (26) use the analytic canceled limits
already included in the source and origin theorems. Equation (27)
asserts the six-node result at distinct evaluation nodes; it does not
claim positivity at arbitrary matrix size or deduce RH from one size.

## 8. Algebra verification

`theta_mixed_identity_20261111.py` checks fourteen exact identities and
leading-model limits: the fifth-source density factor, ratio derivative,
the actual-theta six-column factors, the canonical H source factor,
the strict origin-coordinate formula, the oriented three-node determinant,
the output ratio derivative, and three endpoint leading-model limits.
The global fifth-source sign is supplied by its own actual-theta
certificate. The sign-pattern, integral orientation, endpoint, and
compensation arguments above are analytic proof components.

The actual-theta scalar certificate can use the exact column formula

$$
\boxed{K_H=\frac{256}{\kappa^6}
W_6(\kappa,t\kappa',\kappa'',t\kappa''',\kappa^{(4)},C).}  \tag{20}
$$

For comparison,

$$
K_U=-\frac{4096}{\kappa^6}
W_6(\kappa,t\kappa',\kappa'',t\kappa''',\kappa^{(4)},t\kappa^{(5)}).
\tag{21}
$$

No literature-novelty or external peer-review claim is made.
