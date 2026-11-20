# Tauberian refinement of the selected ridge blocker

## Scope

This note sharpens wave 36.  It does not prove the missing actual-theta
estimate.  It shows that the previously stated bound

\[
M_n(t)\le \varepsilon_n t^{2+\alpha},\qquad \varepsilon_n\to0,
\]

is stronger than necessary.  A fixed all-degree Dini modulus, combined with
vanishing normalized pivot loss, is enough.  It also gives an exact
necessary-and-sufficient no-boundary-layer criterion.

## 1. Spectral coordinates

On the old prefix, whiten `X` and put

\[
B_n=X_{E_n}^{-1/2}Q_{E_n}X_{E_n}^{-1/2},
\qquad 0<B_n\le I.
\]

Let `c_n` be the normalized selected cross column and set

\[
d_n=B_n^{-1}c_n.
\]

In an eigenbasis `B_ne_j=r_je_j`, this is the wave-34/36 notation

\[
c_{j,n}=\pm b_{j,n},\qquad d_{j,n}={c_{j,n}\over r_{j,n}}.
\]

The two exact correction costs are

\[
s_{1,n}=\langle d_n,B_nd_n\rangle
       =\sum_j{b_{j,n}^2\over r_{j,n}}
       ={Q[P_n]-Q[q_n]\over A_n},
\]

\[
s_{2,n}=\|d_n\|^2
       =\sum_j{b_{j,n}^2\over r_{j,n}^2}
       ={X[q_n-P_n]\over A_n}.
\]

Define

\[
M_n(t)=\|{\bf1}_{(0,t]}(B_n)c_n\|^2
      =\sum_{r_{j,n}\le t}b_{j,n}^2.
\]

## 2. Fixed Dini modulus plus scalar pivot loss

Assume that one nonnegative function `omega` works for every sufficiently
large `n`:

\[
M_n(t)\le t^2\omega(t),\qquad 0<t\le1,
\]

and that

\[
\Omega(t):=\omega(t)+2\int_0^t{\omega(s)\over s}\,ds
\longrightarrow0\qquad(t\downarrow0).
\]

For each `t`, split the correction energy at `t`.  The exact layer-cake
identity on the low spectral block gives

\[
\sum_{r_j\le t}{b_j^2\over r_j^2}
={M_n(t)\over t^2}
 +2\int_0^t{M_n(s)\over s^3}\,ds
\le\Omega(t).
\]

On the complementary block, `r_j>t` gives

\[
\sum_{r_j>t}{b_j^2\over r_j^2}
\le {1\over t}\sum_{r_j>t}{b_j^2\over r_j}
\le {s_{1,n}\over t}.
\]

Therefore

\[
\boxed{s_{2,n}\le\Omega(t)+{s_{1,n}\over t}.}
\]

If `s_(1,n)->0`, choose any `t_n->0` with `s_(1,n)/t_n->0`.
Then `s_(2,n)->0`.  Thus the directional modulus need not carry a vanishing
factor `epsilon_n`; scalar smallness can come from the separate pivot-loss
channel.

There is a second version using the selected derivative/source ratio

\[
h_n={H[P_n]\over A_n},
\]

which must tend to zero in any successful version of the residual route
anyway.  In the whitened block, old `H` has eigenvalues `1-r_j`.  Positivity
of the full `H` block gives

\[
\sum_{r_{j,n}<1}{b_{j,n}^2\over1-r_{j,n}}\le h_n,
\qquad b_{j,n}=0\ \hbox{when }r_{j,n}=1,
\quad\Longrightarrow\quad
\sum_j b_{j,n}^2\le h_n,
\]

where the first expression is the old-`H` pseudoinverse Schur bound.  Hence

\[
\boxed{s_{2,n}\le\Omega(t)+{h_n\over t^2}.}
\]

Thus `h_n->0` plus the same fixed Dini modulus also closes the correction,
without separately proving `s_(1,n)->0`.  It then follows automatically that
`s_(1,n)<=s_(2,n)->0`.

### Power modulus

If

\[
M_n(t)\le C t^{2+\alpha}
\]

with fixed `C,alpha>0`, then

\[
s_{2,n}\le C(1+2/\alpha)t^\alpha+s_{1,n}/t.
\]

For small `s_(1,n)`, choosing

\[
t=\left({s_{1,n}\over C(1+2/\alpha)}\right)^{1/(1+\alpha)}
\]

gives

\[
\boxed{
s_{2,n}\le
2\{C(1+2/\alpha)\}^{1/(1+\alpha)}
s_{1,n}^{\alpha/(1+\alpha)}.}
\]

The derivative-ratio alternative gives

\[
s_{2,n}\le C(1+2/\alpha)t^\alpha+h_n/t^2,
\]

and therefore

\[
\boxed{
s_{2,n}\le
2\{C(1+2/\alpha)\}^{2/(2+\alpha)}
h_n^{\alpha/(2+\alpha)}}
\]

for the balancing choice
`t={h_n/[C(1+2/alpha)]}^{1/(2+alpha)}`.

### Logarithmic Dini modulus

Even every positive power is unnecessary.  If `beta>0` and

\[
M_n(t)\le {C t^2\over\log(e/t)^{1+\beta}},
\]

then

\[
\Omega(t)\le
{C\over\log(e/t)^{1+\beta}}
+{2C\over\beta\log(e/t)^\beta}\to0.
\]

This logarithmic form is compatible with the arithmetic scales appearing in
the theta/Pollaczek campaign and avoids an explicit minimum-gap lower bound.

### Fractional source interpretation

A stronger but standard operator form of the power modulus is the uniform
source condition

\[
c_n=B_n^{1+\alpha/2}y_n,
\qquad \|y_n\|\le C^{1/2}.
\]

Indeed its low spectral projection immediately gives
`M_n(t)<=C t^(2+alpha)`.  Equivalently, the correction
`d_n=B_n^(-1)c_n` has a uniformly bounded fractional representation
`d_n=B_n^(alpha/2)y_n`.  The cumulative modulus used above is weaker than
this exact range condition, but the formulation identifies the kind of
theta-specific commutator or smoothing theorem that would close the route.

## 3. Exact concentration-compactness criterion

Let

\[
D_n(t)=\|{\bf1}_{(0,t]}(B_n)d_n\|^2
      =\sum_{r_{j,n}\le t}{b_{j,n}^2\over r_{j,n}^2}.
\]

Then

\[
s_{2,n}\le D_n(t)+s_{1,n}/t.
\]

Consequently

\[
\boxed{
s_{2,n}\to0
\iff
s_{1,n}\to0
\ \hbox{and}\
\lim_{t\downarrow0}\limsup_{n\to\infty}D_n(t)=0.}
\]

The forward implication uses `s_(1,n)<=s_(2,n)` and `D_n(t)<=s_(2,n)`.
The reverse implication is the displayed split.  Thus small pivot loss forces
the correction energy either to vanish or to concentrate into collapsing
`Q/X` modes.  The rank-one wave-36 model is exactly the latter alternative:
`s1=c rho->0`, while a mass `c` sits at `r=rho->0`.

## 4. Equivalent ridge-derivative criterion

Let `m_n(tau)` be the monic pivot of `Q+tau X` and

\[
R_n(\tau)={m_n'(\tau)\over A_n}-1
=\sum_j{b_{j,n}^2\over(r_{j,n}+\tau)^2}.
\]

Then `R_n(0)=s_(2,n)` and `integral_0^infinity R_n=s_(1,n)`.  Moreover,

\[
R_n(\tau)\le {s_{1,n}\over4\tau},\qquad \tau>0,
\]

because `r/(r+tau)^2<=1/(4tau)`.  Hence

\[
\boxed{
s_{2,n}\to0
\iff
s_{1,n}\to0
\ \hbox{and}\
\lim_{\tau\downarrow0}\limsup_{n\to\infty}
\{R_n(0)-R_n(\tau)\}=0.}
\]

By the envelope theorem,

\[
{m_n'(\tau)\over A_n}={X[q_{n,\tau}]\over A_n},
\]

so the second condition is the scalar normalized source-energy excess
continuity

\[
R_n(0)-R_n(\tau)
={X[q_n]-X[q_{n,\tau}]\over A_n}\longrightarrow0
\]

uniformly as `tau` approaches zero after `n` becomes large.  It is not a
vector-norm continuity assertion.  This is a direct no-boundary-layer
statement, not a minimum-gap estimate.

## 5. Actual-theta consequence and remaining work

The ridge route can therefore be separated into two weaker tasks:

1. prove the scalar normalized pivot loss

   \[
   {Q[P_n]-Q[q_n]\over A_n}\to0;
   \]

2. prove an `n`-uniform Dini modulus for the actual signed selected load.

The Dini modulus is a convenient stronger sufficient condition.  The exact
weaker alternative, when combined with task 1, is the scalar ridge-derivative
boundary-excess continuity in Section 4; these two formulations should not be
called equivalent.

Alternatively, replace task 1 by the independently necessary selected
coherence `H[P_n]/A_n->0`; full-`H` positivity and the same modulus then imply
both `s_(2,n)->0` and `s_(1,n)->0` by the preceding estimate.

In the directional form used by wave 36, the power version now needs only a
fixed constant:

\[
|Q(P_n,e)|^2\le A_n C t^{2+\alpha}X[e]
\qquad(e\in E_{n,t}),
\]

not a factor `epsilon_n->0`, provided the separate scalar pivot loss tends to
zero.  The logarithmic Dini alternative is

\[
|Q(P_n,e)|^2\le
{A_n C t^2\over\log(e/t)^{1+\beta}}X[e].
\]

The polynomial-comparison checkpoint controls the positive source geometry
`X`, but supplies neither statement by itself.  Generic positivity and the
rank-one model cannot supply the modulus.  A proof still needs a
complete-theta correlation theorem; the refinement only removes the
unnecessary requirement that the directional modulus itself vanish with
`n`.

No actual-theta all-degree estimate or RH conclusion is proved here.
