# Nonattained zero-edge record filter theorem

## 0. Exact outcome and claim boundary

This note keeps the two explicit `p_k` terms in equation (2.9) of
`notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md` signed.  Together
with the main screw term they form the exact fourth-order filter

\[
 \boxed{\Phi_{k,L}=(I-qT_q)^2,\qquad
 q=\left({2\pi k\over L}\right)^2,}                 \tag{0.1}
\]

whose centered-zero multiplier is

\[
 \boxed{{\alpha^4\over(\alpha^2+q)^2}.}             \tag{0.2}
\]

The causal correction kernel changes sign, so a running maximum of
`e^(-eta*t)Psi(t)` does not by itself make (0.1) positive for an arbitrary
function.  For the actual centered-zero screw, however, inverse-square
summability gives the exact zero-edge envelope

\[
 |\Psi(t)|\leq C_Ze^{Bt},\qquad
 C_Z=4\sum_{\alpha\in Z_+}|\alpha|^{-2}.             \tag{0.3}
\]

This envelope suppresses every negative filter lobe before it can reach a
terminal record, for every positive edge `B`.

Let `x_0` be the first positive zero of

\[
 3\sin x+x\cos x=0.
\]

Then `x_0=2.455643862879...`.  Put

\[
 \theta_k=1-{x_0\over2\pi k}<1.                    \tag{0.4}
\]

Suppose the centered-zero right edge
`B=sup_(alpha in Z_+) Re(alpha)>0` is not attained.  For every fixed
`K>=1`, choose

\[
 \boxed{B\theta_K<\eta<B.}                          \tag{0.5}
\]

Such an `eta` always exists because `theta_K<1`.  There is an unbounded
strict-half-integer natural-cutoff sequence on which

\[
 \boxed{d_k(L)>0\qquad(0\leq k\leq K)}              \tag{0.6}
\]

eventually.  No `A_4` comparison is assumed.  In particular, the conclusion
holds for arbitrarily small `B>0` and also when `B=1/2`.  The sequence and
`eta` depend on the fixed prefix.  A diagonal extraction does give some
unquantified sequence with a positive prefix whose length tends to infinity,
but it gives no growth rate for that prefix, no comparison with the natural
outer dimension `N(L)`, and no positivity of all vertices in a finite
section.  The positive lobes are not bounded relatively, so the argument
also proves no degree-ratio limit.

No RH statement, graph routing, Lambda bound, or equation (5.2) of
`DIRECT_RH_ATTACK.md` is proved.  The formal project state remains
`P0_INVALIDATED`.

## 1. Frozen dependencies and notation

The proof is bound to the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md` | `4488516bd33ad71cf8f9efe665c84b328fba4399501143ad26fc24792a9883be` |
| `notes/PRIME_SIDE_SIGNED_RIESZ_HISTORY_BARRIER.md` | `ca6fd1e6d34b7872fc55f20e6005cdec0c9c7f81a4ad3ac50187a8b30db5521c` |
| `notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md` | `ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171` |
| `notes/NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md` | `baa9a4d07f1bfa2e298efeca5ed8d226c2e991330a2f029f5586380ccb8d5c1c` |
| `notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md` | `18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b` |
| `notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md` | `cdea3cf9d1756d76f7fc2524c66b031728ef8817825f4f68ea55887ef82cf91d` |

Retain the natural schedule and fixed-mode asymptotics

\[
 \lambda={r\over2},\quad r\geq5\text{ odd},\quad
 L=2\log\lambda,\quad N=\lceil\lambda\rceil,
 \qquad |p_k|\asymp_k L^{-1/2}.                    \tag{1.1}
\]

Fix `k>=1`, and put

\[
 a={2\pi k\over L},\qquad q=a^2.                  \tag{1.2}
\]

On functions on `[0,L]`, let `T_q` be the causal zero-data inverse

\[
 (T_qu)(t)=\int_0^t{\sin(a(t-v))\over a}u(v)\,dv.
                                                               \tag{1.3}
\]

Thus `(D^2+q)T_q=I` and both initial data of `T_qu` vanish.

## 2. Exact signed multiplier

For one centered zero `alpha`, write

\[
 C_\alpha(L)=\cosh(\alpha L)-1,
 \qquad \Psi_\alpha(L)={2C_\alpha(L)\over\alpha^2}. \tag{2.1}
\]

The two explicit `p_k` terms in equation (2.9) of the frozen fourth-moment
note sum to

\[
 \begin{aligned}
 E^{\rm exp}_{k,\alpha}
 &=-{2p_kqC_\alpha\over\alpha^2+q}
 \left({1\over\alpha^2+q}+{1\over\alpha^2}\right)\\
 &=-p_kq\Psi_\alpha(L)
 {2\alpha^2+q\over(\alpha^2+q)^2}.                 \tag{2.2}
 \end{aligned}
\]

Because `aL=2*pi*k`, direct solution of the zero-data equations gives

\[
 T_q\Psi_\alpha(L)={\Psi_\alpha(L)\over\alpha^2+q},
 \qquad
 T_q^2\Psi_\alpha(L)={\Psi_\alpha(L)\over(\alpha^2+q)^2}. \tag{2.3}
\]

The constant part of (2.1) contributes zero to both values in (2.3):
`T_q1(L)=T_q^2 1(L)=0` at the resonance.  Compact-uniform absolute
convergence of the centered-zero screw formula permits termwise
application of these bounded finite-interval operators.  Hence, with

\[
 {\cal R}_q=2T_q-qT_q^2,
 \qquad \Phi_q=I-q{\cal R}_q=(I-qT_q)^2,            \tag{2.4}
\]

the signed explicit contribution is

\[
 \boxed{E_k^{\rm exp}(L)=-p_kq{\cal R}_q\Psi(L),}  \tag{2.5}
\]

and main plus explicit contribution is `p_k*Phi_q*Psi(L)`.  Algebraically,

\[
 1-q{2\alpha^2+q\over(\alpha^2+q)^2}
 ={\alpha^4\over(\alpha^2+q)^2},                  \tag{2.6}
\]

which proves (0.2).

## 3. The correction kernel and its unavoidable sign change

The convolution kernels of `T_q` and `T_q^2` are

\[
 {\sin(au)\over a},\qquad
 {\sin(au)-au\cos(au)\over2a^3},                  \tag{3.1}
\]

respectively.  Therefore

\[
 \boxed{
 r_q(u)={3\sin(au)+au\cos(au)\over2a},
 \qquad ({\cal R}_qu)(L)=\int_0^Lr_q(L-t)u(t)\,dt.} \tag{3.2}
\]

This kernel cannot be replaced by a nonnegative causal kernel representing
the same multiplier.  Indeed,

\[
 r_q(u)>0\quad(0<u\ll a^{-1}),
 \qquad r_q(\pi/a)=-{\pi\over2a}<0.                \tag{3.3}
\]

Uniqueness of the Laplace transform then rules out a positive representing
measure for the rational multiplier in (2.2).

The exact limitation of record information can be seen without an
asymptotic model.  Fix `L`, `eta>0`, and `A>0`.  Choose a nonnegative smooth
cutoff `h_0` equal to `A*e^(eta*t)` near zero and zero near `L`, and set

\[
 \Psi_0(t)=Ae^{\eta t}-h_0(t).                     \tag{3.4}
\]

Then `Psi_0` has zero initial jets, has endpoint `A*e^(eta*L)`, and obeys
`Psi_0(t)<=A*e^(eta*t)` throughout.  If `phi>=0` is a smooth interior bump,
then `Psi_C=Psi_0-C*phi` has the same properties for every `C>=0`, while

\[
 \Phi_q\Psi_C(L)=\Phi_q\Psi_0(L)+Cq({\cal R}_q\phi)(L). \tag{3.5}
\]

Putting `phi` in a positive or a negative lobe of `r_q(L-t)` makes the last
term have either sign and arbitrarily large magnitude.  Thus endpoint data,
zero initial jets, and the exact running-record upper envelope do not sign
the fourth-order filter.

This bump construction is an information-theoretic obstruction to the
record/positive-kernel argument.  It is not a zeta-zero countermodel and
does not refute a stronger arithmetic comparison such as the general
`A_4` gate.

## 4. The first negative lobe

Let

\[
 g(x)=3\sin x+x\cos x.                              \tag{4.1}
\]

It is positive on `[0,pi/2]`.  On `(pi/2,pi)`,

\[
 g'(x)=4\cos x-x\sin x<0,                          \tag{4.2}
\]

while `g(pi/2)=3` and `g(pi)=-pi`.  Hence there is a unique first zero
`x_0` in that interval.  In particular,

\[
 r_q(u)<0\quad\Longrightarrow\quad
 u\geq{x_0\over a}.                                \tag{4.3}
\]

At the terminal convolution variable `u=L-t`, (4.3) says that all negative
kernel mass is supported before

\[
 t\leq\theta_kL,
 \qquad \theta_k=1-{x_0\over2\pi k}.               \tag{4.4}
\]

Also, uniformly on `[0,L]`,

\[
 q|r_q(u)|\leq {C_k\over L}.                        \tag{4.5}
\]

The separation in (4.4), not a false global kernel positivity, drives the
zero-edge theorem.

## 5. The zero-edge envelope and running records

Choose every representative in `Z_+` with nonnegative real part and write
`beta=Re(alpha)`.  The unconditional centered-zero expansion and
inverse-square summability give, for every `t>=0`,

\[
 \begin{aligned}
 |\Psi(t)|
 &\leq\sum_{\alpha\in Z_+}
 {e^{\beta t}+e^{-\beta t}+2\over|\alpha|^2}\\
 &\leq4e^{Bt}\sum_{\alpha\in Z_+}|\alpha|^{-2}
 =C_Ze^{Bt}.                                       \tag{5.1}
 \end{aligned}
\]

This includes the backward exponentials and the constant terms in the
screw.  It is valid whether or not the edge is attained and, in particular,
at `B=1/2`.  The theorem remains focused on the unresolved nonattained
branch.

Fix `K` and choose

\[
 B\theta_K<\eta<B.                                 \tag{5.2}
\]

The strengthened scalar Landau lemma in the frozen fourth-moment note gives

\[
 \limsup_{t\to\infty}e^{-\eta t}\Psi(t)=+\infty.  \tag{5.3}
\]

Taking maxima on successive compact intervals supplies running-record
times `T_n->infinity` and record heights

\[
 R_n=e^{-\eta T_n}\Psi(T_n)\longrightarrow+\infty,
 \qquad \Psi(t)\leq R_ne^{\eta t}\quad(0\leq t\leq T_n). \tag{5.4}
\]

For a resonant terminal length `L<=T_n`, define

\[
 h_n(t)=R_ne^{\eta t}-\Psi(t)\geq0.                \tag{5.5}
\]

An exact differentiation of the resolvent formula gives

\[
 \begin{aligned}
 \Phi_q(e^{\eta\,\cdot})(L)
 ={}&e^{\eta L}{\eta^4\over(\eta^2+q)^2}
 +{q(2\eta^2+q)\over(\eta^2+q)^2}
 +{q\eta L\over2(\eta^2+q)}>0.                    \tag{5.6}
 \end{aligned}
\]

The exact endpoint-deficit formula is

\[
 \Phi_q\Psi(L)
 =R_n\Phi_q(e^{\eta\,\cdot})(L)
  +q({\cal R}_qh_n)(L)-h_n(L).                      \tag{5.7}
\]

If `L=T_n`, the last term vanishes.  At a floor-grid point it will be
negligible by Section 6.

Discard the positive lobes in (5.7).  Equations (4.3)--(4.5), positivity
of `h_n`, and (5.1) give, uniformly for `1<=k<=K`,

\[
 \begin{aligned}
 q({\cal R}_qh_n)(L)
 &\geq-{C_K\over L}\int_0^{\theta_kL}h_n(t)\,dt\\
 &\geq-C_{K,\eta}R_nL^{-1}e^{\eta\theta_kL}
        -C_{K,B}L^{-1}e^{B\theta_kL}.              \tag{5.8}
 \end{aligned}
\]

The two terms in the last line, divided by `R_n*e^(eta*L)`, are bounded by

\[
 {C_{K,\eta}\over L}e^{-\eta(1-\theta_K)L},
 \qquad
 {C_{K,B}\over LR_n}e^{-(\eta-B\theta_K)L},       \tag{5.9}
\]

and both tend to zero by (5.2) and `R_n->infinity`.  Therefore

\[
 q({\cal R}_qh_n)(L)\geq-o_K\{R_ne^{\eta L}\}.    \tag{5.10}
\]

The first term in (5.6) is at least `(1/2)e^(eta*L)` for all sufficiently
large `L`, uniformly over the fixed prefix.  Equations (5.6)--(5.10) prove
a positive lower bound of order `R_n*e^(eta*L)` once the endpoint deficit
is negligible.  They intentionally give no relative upper bound: positive
kernel lobes can make the filtered value larger.

## 6. Natural-grid transfer and the low/high zero split

For each record time choose the largest strict-half-integer natural-grid
length `L_n<=T_n`.  The elementary grid spacing gives

\[
 0\leq T_n-L_n\leq C e^{-T_n/2}.                   \tag{6.1}
\]

The pinned prime-side PNT discrepancy bound, used already in the frozen
Landau-grid proof, bounds `|Psi'(t)|=|R(t)|` almost everywhere by
`C(1+t)^m*e^(t/2-c*sqrt(t))`.  Since `h_n(T_n)=0`, (6.1) therefore gives

\[
 0\leq h_n(L_n)=R_ne^{\eta L_n}-\Psi(L_n)
          =o\{R_ne^{\eta L_n}\}.                   \tag{6.2}
\]

Indeed, the exponential-comparator displacement is relatively
`O(T_n-L_n)`, while the discrepancy integral over `[L_n,T_n]` is
`O((1+T_n)^m*e^{-c*sqrt(T_n)})`.  Consequently (5.6)--(5.10) give,
simultaneously for `1<=k<=K`, the stronger lower bound

\[
 \boxed{
 \Phi_{k,L_n}\Psi(L_n)\geq c_{K,\eta}R_ne^{\eta L_n}>0.} \tag{6.3}
\]

eventually.

It remains to respect that the Gaussian `H_N` estimate is available only
away from the critical edge.  Choose one fixed

\[
 0<b_0<\eta,                                       \tag{6.4}
\]

and split the zero sum into `Re(alpha)<b_0` and `Re(alpha)>=b_0`.  Denote
the corresponding screw functions by `Psi_<` and `Psi_>=`.  Equation (2.9)
of the frozen fourth-moment note, summed only over the high part, gives

\[
 {\cal M}_k
 =-p_kq{\cal R}_q\Psi_>(L)+{\cal H}_{k,>}(L)
   +{\cal M}_{k,<}(L),                              \tag{6.5}
\]

where

\[
 {\cal H}_{k,>}(L)=O_{k,b_0}(e^{-dL^2}),
 \qquad
 {\cal M}_{k,<}(L)=O_{k,b_0}(L^{-3/2}e^{b_0L}).    \tag{6.6}
\]

Absolute centered-zero summability and (3.2) also give

\[
 |\Psi_<(t)|=O_{b_0}(1+e^{b_0t}),
 \qquad
 q{\cal R}_q\Psi_<(L)=O_{k,b_0}(L^{-1}e^{b_0L}).  \tag{6.7}
\]

Using `E_k=sqrt(L)*J_L+M_k`, the exact degree identity becomes

\[
 \begin{aligned}
 d_k={2p_k^2\over L}\bigg\{
  \Phi_q\Psi(L)+q{\cal R}_q\Psi_<(L)
  +{{\cal H}_{k,>}(L)+{\cal M}_{k,<}(L)+\sqrt L J_L\over p_k}
 \bigg\}.                                         \tag{6.8}
\end{aligned}
\]

The error after `Phi_q*Psi` in (6.8) is, uniformly over the fixed prefix,

\[
 O_{k,b_0}(L^{-1}e^{b_0L})
 +O_{k,b_0}(\sqrt L e^{-dL^2})
 +O_{A,k}(L\lambda^{-A}).                           \tag{6.9}
\]

It is `o(R_n*e^(eta*L_n))` by (6.4).  Equations (6.3), (6.8), and
(6.9) prove `d_k(L_n)>0` for `1<=k<=K`.

At `k=0`, equation (6.2) first gives

\[
 \Psi(L_n)=R_ne^{\eta L_n}\{1+o(1)\}>0.           \tag{6.10}
\]

The history is absent and the exact degree formula is

\[
 d_0={2p_0^2\over L}\left\{
 \Psi(L)+{\sqrt L J_L\over p_0}\right\}.          \tag{6.11}
\]

The fixed-mode limit for `p_0` and the all-order estimate for `J_L` make
the second term negligible relative to (6.10).  Thus `d_0(L_n)>0`, proving
(0.6).

### Corollary 6.1 (unquantified growing-prefix extraction)

There are strict natural-grid lengths `L_j->infinity` and integers
`K_j->infinity` such that

\[
 \boxed{d_k(L_j)>0\qquad(0\leq k\leq K_j).}       \tag{6.12}
\]

**Proof.**  Apply (0.6) with `K=j`.  Its sequence is unbounded, so choose
one point `L_j` beyond both `L_(j-1)+1` and the eventual-positivity threshold
for that fixed prefix.  Taking `K_j=j` proves (6.12).  This diagonal choice
is purely existential and supplies no relation between `K_j` and `L_j`.
\(\square\)

## 7. Exact remaining scope

For every positive nonattained edge and every fixed finite `K`, the exact
zero-edge envelope synchronizes `d_0,...,d_K` on a strict natural-grid
sequence.  The old numerical edge threshold was an artifact of replacing
the actual zero-edge exponent `B` by the coarser PNT exponent `1/2` inside
the early negative lobes.

The fixed-prefix conclusion diagonalizes to (6.12), but with no quantitative
content: since `theta_K` tends to one, the choice (5.2), the record times,
and every error threshold depend on `K`.  The proof gives no lower bound on
the growth of `K_j`, no comparison such as `K_j` being comparable with the
natural outer dimension `N(L_j)`, and no positivity of all vertices at any
finite stage.  It also gives no relative upper bound for `Phi_q*Psi`, so it
proves no degree-ratio limit.  Consequently it does not prove graph routing,
finite-section positivity, RH, a Lambda bound, or equation (5.2) of
`DIRECT_RH_ATTACK.md`.
