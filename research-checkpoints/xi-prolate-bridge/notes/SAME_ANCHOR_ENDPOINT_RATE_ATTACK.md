# Same-anchor endpoint-rate attack and the two-anchor escape

## 0. Claim boundary and outcome

This note attacks the endpoint bottleneck in
`POSITIVE_CONE_SHIFTED_ODD_RESERVE_TRANSFER.md`.  It has five conclusions.

1.  If the projected prolate state is retained as the Ritz anchor, the
    endpoint halfspace gives not only the previously recorded necessary
    inequality for the shifted solve, but a sharp ceiling for the **entire
    unused cone depth**.  If

    \[
      e=t_\kappa,
      \qquad T\geq\tau_+,
    \]

    then every positive comparison state used with this anchor satisfies

    \[
      \gamma\leq
      \Gamma_{\rm end}(e,T)
      :={e-T\sqrt{1-e^2}\over\sqrt{1+T^2}}.       \tag{0.1}
    \]

    The right side has to be positive.  Consequently the shifted-reserve
    theorem can pass only if two separate relative rates hold:

    \[
      T<{e\over\sqrt{1-e^2}},
      \qquad
      {N^2\chi_U\over g_+e^2}
      <{(1-\rho)^2\over1+T^2},
      \quad
      \rho={T\sqrt{1-e^2}\over e}.                \tag{0.2}
    \]

2.  On the locked half-integer exponential schedule, the normalized
    endpoint of the projected prolate anchor has an explicit **upper**
    estimate which is exponentially small.  The proof uses Poisson
    summation, the pinned prolate endpoint and exterior-sample bounds, and a
    quantitative Fourier endpoint lemma.  It supplies no nonzero lower
    estimate.  Thus a polynomial-in-`L` solve estimate, including an
    `O(L^(-5/2))` estimate, does not certify the same-anchor cone gate.  This
    is a failure of implication, not a proof that the actual solve cannot be
    much smaller.  This endpoint theorem is specific to that schedule.  The
    newer determinant criterion permits every schedule with
    `N/L^2 -> infinity`; no endpoint-starvation assertion is made here for
    all such schedules.

3.  At the two-vector Ritz shift, the Schur surplus has an exact spectral-
    spread formula.  The shifted solve and this surplus are independent
    relative quantities: the surplus can vanish for an arbitrarily
    prescribed solve, and it can be arbitrarily large while the solve is
    held fixed.

4.  The exact source Cauchy displacement and inversion algebra do not tie
    the endpoint overlap to the shifted solve.  An explicit diagonal
    `N=2` Cauchy family keeps the anchor and its endpoint overlap fixed while
    the solve tends to infinity, even though the odd block remains above the
    declared shift.

5.  There is a legitimate two-anchor escape.  A positive Fejer/Jackson
    state can be made the **Ritz anchor itself**, rather than merely a trial
    state compared with the endpoint-starved projected anchor.  The ground
    error then acquires the ordinary triangle term between the new anchor
    and the projected prolate state.  What is missing is an all-axis hybrid
    cone reserve and cancellation-preserving control of the rotated even
    complement, solve, and Schur surplus.  Ordinary
    `O(L^(-5/2))` Hilbert-space closeness supplies none of those quantities.

No assertion below assumes a list of real zeta zeros, global Weil
positivity, or a locally uniform determinant limit.  The complete source
matrix remains pole minus archimedean minus prime, with the inclusive prime
power endpoint and the source Fourier sign.  Nothing here proves equation
(5.2) of `DIRECT_RH_ATTACK.md` or the Riemann hypothesis.  The formal state
remains `P0_INVALIDATED`.

## 1. The sharp endpoint ceiling

Use the real even basis and response vectors from checkpoint 0.57,

\[
 b_\alpha=\left(1,{\sqrt2\alpha^2\over1+\alpha^2},\ldots,
 {\sqrt2\alpha^2\over N^2+\alpha^2}\right),
 \qquad b_\infty=(1,\sqrt2,\ldots,\sqrt2).          \tag{1.1}
\]

Let `kappa` be a unit even Ritz anchor and put

\[
 e=t_\kappa={|\langle b_\infty,\kappa\rangle|
                   \over\sqrt{2N+1}}.               \tag{1.2}
\]

Let `z` be any unit vector in the open response cone, let

\[
 m=m_{\mathcal C}(z),\qquad
 \theta=\angle(\kappa,z),                            \tag{1.3}
\]

and suppose the cone transfer is attempted with a certified solve enclosure
`T`:

\[
 \theta+\arctan T<\arcsin m.                        \tag{1.4}
\]

The unused cone depth is

\[
 \gamma=\sin(\arcsin m-\theta-\arctan T).          \tag{1.5}
\]

### Theorem 1.1 (endpoint-limited unused depth)

Every datum satisfying (1.2)--(1.5) obeys

\[
 \boxed{
  0<\gamma\leq\Gamma_{\rm end}(e,T)
  ={e-T\sqrt{1-e^2}\over\sqrt{1+T^2}}.}            \tag{1.6}
\]

In particular, (1.4) requires

\[
 \boxed{T<{e\over\sqrt{1-e^2}}}                    \tag{1.7}
\]

when `e<1`.

**Proof.**  Lemma 2.2 of
`POSITIVE_CONE_SHIFTED_ODD_RESERVE_TRANSFER.md` gives the sharp endpoint
halfspace inequality

\[
 \arcsin m-\theta\leq\arcsin e.                    \tag{1.8}
\]

The arguments of the sine in (1.5) and on the right of (1.8) lie in its
increasing branch.  Hence

\[
 \gamma\leq\sin(\arcsin e-\arctan T).
\]

Expanding the sine proves (1.6), and positivity of its numerator proves
(1.7).  The endpoint inequality is sharp: take the constant positive trial
and move the anchor on the shortest geodesic toward the endpoint
hyperplane.  Thus no angle-only improvement of (1.6) is possible.  \(\square\)

The shifted odd theorem of checkpoint 0.57 uses

\[
 \chi_U<{g_+\gamma^2\over R_N(\gamma)},
 \qquad R_N(\gamma)=N^2+\overline M_2\geq N^2.      \tag{1.9}
\]

Combining (1.6) and (1.9) gives a second necessary condition for that
particular certificate.

### Corollary 1.2 (two-rate feasibility barrier)

If the same-anchor checkpoint-0.57 certificate passes, then

\[
 \boxed{
  {N^2\chi_U\over g_+}
  <\Gamma_{\rm end}(e,T)^2.}                       \tag{1.10}
\]

For `e>0`, define

\[
 \rho={T\sqrt{1-e^2}\over e}.
\]

Then (1.10) is exactly the second strict inequality in (0.2).  Thus even
`T=o(e)` leaves the independent scale

\[
 {\chi_U\over g_+}=O\!\left({e^2\over N^2}\right) \tag{1.11}
\]

to be proved.  If `rho` approaches one, the allowed surplus collapses by
the additional factor `(1-rho)^2`.  These are necessary conditions for this
cone/coefficient certificate, not necessary conditions for the actual odd
block to be positive.

The universal cubic sufficient gate from checkpoint 0.57 is still more
demanding:

\[
 {\chi_U\over g_+}< {\gamma^3\over2N^2}.           \tag{1.12}
\]

It should not be confused with the necessary quadratic barrier (1.10).

## 2. A source-pinned upper bound for the projected endpoint

This section concerns the locked half-integer schedule

\[
 \lambda=j+\tfrac12,\qquad
 N=2^{2400(2j+1)^2},\qquad j\geq2.                 \tag{2.1}
\]

The determinant height-profile theorem has the much broader dimension
hypothesis `N/L^2 -> infinity`.  The estimates below use the exponential
value in (2.1) essentially when passing from (2.19) to (2.20).  They do not
prove (2.20) for an arbitrary determinant-admissible schedule.

Put

\[
 a=\log\lambda,\qquad L=2a,qquad
 F_\lambda(t)=k_\lambda^+(e^t),\quad -a\leq t\leq a.
                                                               \tag{2.2}
\]

The endpoint traces of `F_lambda` agree after periodic identification.
Let

\[
 p_{\lambda,N}=P_NF_\lambda,qquad
 \kappa={p_{\lambda,N}\over\|p_{\lambda,N}\|}.    \tag{2.3}
\]

Every source mode has value `L^(-1/2)` at the endpoint, and therefore

\[
 e=t_\kappa
 ={\sqrt L\,|p_{\lambda,N}(a)|
       \over\sqrt{2N+1}\,\|p_{\lambda,N}\|}.       \tag{2.4}
\]

### 2.1 The unprojected endpoint trace

Write `h_lambda` for the locked source-normalized `0/4` combination and
`H_lambda` for its additive Fourier transform.  Since
`integral(h_lambda)=0` and `lambda^2` is not an integer on (2.1), Poisson
summation gives

\[
 h_\lambda(0)+2\sum_{m=1}^{\lfloor\lambda^2\rfloor}
       h_\lambda(m/\lambda)
 =2\lambda\sum_{r\geq1}H_\lambda(r\lambda).       \tag{2.5}
\]

Consequently the evenized endpoint is exactly

\[
 \boxed{
 F_\lambda(a)
 ={\sqrt\lambda\over2}
 \left(h_\lambda(\lambda)+H_\lambda(\lambda)
       +\sum_{r\geq2}H_\lambda(r\lambda)\right)
 -{h_\lambda(0)\over4\sqrt\lambda}.}             \tag{2.6}
\]

All signs in (2.6) follow from the locked positive finite-Fourier phase for
labels `0` and `4`; no Weil block has been separated.

Use the pinned quantities

\[
 \begin{aligned}
 a_4&={\sqrt3\over2^{11/4}},\\
 \beta_\lambda&={2\over\pi^2}\log(200\lambda^2+25),\\
 D_\lambda&=10\exp\!\left(-{
       \lfloor4\lambda^2\rfloor-11\over\beta_\lambda}\right),\\
 E_\lambda&=16\pi a_4(1+2\sqrt2\lambda)
                    \sqrt{\lambda D_\lambda}.
 \end{aligned}                                      \tag{2.7}
\]

The locked endpoint theorem gives

\[
 |h_\lambda(\lambda)|, |H_\lambda(\lambda)|
 \leq E_\lambda,qquad
 |h_\lambda(0)|\leq2\sqrt2a_4\sqrt\lambda D_\lambda. \tag{2.8}
\]

The exterior sampled-tail theorem, applied at `u=lambda` to each source
mode before taking the fixed `0/4` combination, gives

\[
 \left|\sum_{r\geq2}H_\lambda(r\lambda)\right|
 \leq {12E_\lambda\over\pi\lambda}
       \{1+\log(2+2\pi\lambda^2)\}.                \tag{2.9}
\]

Thus (2.6) proves the completely specified bound

\[
 \boxed{
 |F_\lambda(a)|\leq B_{\rm tr}(\lambda),}          \tag{2.10}
\]

where

\[
 B_{\rm tr}(\lambda)
 ={\sqrt\lambda E_\lambda\over2}
  \left[2+{12\over\pi\lambda}
       \{1+\log(2+2\pi\lambda^2)\}\right]
 +{a_4D_\lambda\over\sqrt2}.                      \tag{2.11}
\]

This is smaller than every inverse power of `lambda`.  It is only an upper
bound; cancellation in (2.6) prevents it from being read as a lower bound.

### 2.2 A quantitative Fourier endpoint lemma

The following elementary lemma converts (2.10) into a bound for the actual
orthogonal projection rather than silently replacing it by the unprojected
trace.

### Lemma 2.1

Let `F` be a real periodic BV function of period `L`, continuous at `0`.
Suppose the restriction of its distributional derivative to
`(-delta,delta)` is absolutely continuous with an `L2` density.  Let `V` be
its circular total variation and let `H` be the `L2` norm of that density
(or any upper bound obtained by extending the density over all smooth
pieces).  Then

\[
 \boxed{
 |P_NF(0)-F(0)|
 \leq {1\over\pi}
 \left{
 H\sqrt{{8L\over N+1}}
 +{LV\over2(N+1)\delta}
 \right}.}                                         \tag{2.12}
\]

**Proof.**  Integration by parts against the derivative measure and pairing
the positive and negative Fourier modes give

\[
 F(0)-P_NF(0)
 =-{1\over\pi}\int
 \left(\sum_{n>N}{\sin(2\pi nt/L)\over n}\right)dF(t).
                                                               \tag{2.13}
\]

The elementary harmonic sine-tail bounds are

\[
 \left|\sum_{n>N}{\sin(n\theta)\over n}\right|
 \leq\min\left\{4,
 {1\over(N+1)|\sin(\theta/2)|}\right\}.            \tag{2.14}
\]

For `|t|<=L/2`, `sin(pi|t|/L)>=2|t|/L`.  The square of
the right side of (2.14), integrated over `(-delta,delta)`, is at most
`8L/(N+1)`.  Cauchy--Schwarz controls the absolutely continuous part there.
Every remaining derivative contribution is at distance at least `delta`
and is bounded by `LV/[2(N+1)delta]`.  This proves (2.12).  \(\square\)

The evenized arithmetic state is piecewise smooth, so it has no
singular-continuous derivative.  Its nearest non-endpoint jump on (2.1) is

\[
 \delta_\lambda
 =\log{\lambda^2\over\lfloor\lambda^2\rfloor}
 =\log\left(1+{1\over4\lfloor\lambda^2\rfloor}\right)
 \geq{1\over4\lambda^2}.                            \tag{2.15}
\]

The apparent source jump at the identified endpoint is removed by exact
evenization: the two one-sided formulas are interchanged, so the periodic
state is continuous there.

The dilation-generator and variation estimates already proved for the two
prolate modes give

\[
 \begin{aligned}
 H_\lambda^{\rm ac}
 &\leq a_4(1+2\sqrt2\lambda)\sqrt2\lambda
              \left(2\pi\lambda^2+\tfrac12\right),\\
 V_\lambda
 &\leq a_4(1+2\sqrt2\lambda)V_*(\lambda),\\
 V_*(\lambda)
 &=4\lambda\left(2\pi\lambda^2+\tfrac12\right)
   +32\pi\lambda^2\sqrt{D_\lambda}.
 \end{aligned}                                      \tag{2.16}
\]

Applying Lemma 2.1 after shifting the endpoint to zero gives

\[
 \boxed{
 |p_{\lambda,N}(a)-F_\lambda(a)|
 \leq B_{\rm proj}(\lambda,N),}                    \tag{2.17}
\]

with

\[
 B_{\rm proj}
 ={a_4(1+2\sqrt2\lambda)\over\pi}
 \left[
 4\lambda\left(2\pi\lambda^2+\tfrac12\right)
       \sqrt{L\over N+1}
 +{LV_*(\lambda)\over2(N+1)\delta_\lambda}
 \right].                                           \tag{2.18}
\]

Equations (2.4), (2.10), and (2.17) therefore prove the finite implication

\[
 \boxed{
 t_\kappa\leq
 {\sqrt L\{B_{\rm tr}(\lambda)+B_{\rm proj}(\lambda,N)\}
  \over\sqrt{2N+1}\,A}}
 \quad\hbox{whenever}\quad
 \|p_{\lambda,N}\|\geq A>0.                      \tag{2.19}
\]

The existing projected-state norm theorem gives
`||p_(lambda,N)|| -> a_infinity>0` on (2.1).  Since
`log N=9600(log 2)lambda^2`, (2.7), (2.15), and (2.18)--(2.19) imply

\[
 \boxed{t_\kappa=O(e^{-c\lambda^2})}               \tag{2.20}
\]

for some `c>0` on the locked schedule.  The first index at which a fixed
constant works is not effective because the source comparison and norm
limits have noncomputed thresholds.  The finite formula (2.19), supplied
with an independently certified norm lower bound, has no such ambiguity.

There is no lower bound in this argument.  In particular, (2.20) and a
separate upper estimate `T=O(L^(-5/2))` cannot be ordered in the direction
required by (1.7).  The solve could in principle be exponentially smaller;
that would require a new source theorem.  On a different schedule satisfying
only `N/L^2 -> infinity`, both `t_kappa` and the solve must be estimated
again; the locked-schedule upper bound cannot be transplanted.

## 3. What the Schur surplus measures at the Ritz shift

Decompose the even block about a unit anchor as

\[
 Q_+=\begin{pmatrix}q&b^*\\b&A\end{pmatrix},
 \qquad r=\|b\|>0,qquad w=b/r.                    \tag{3.1}
\]

Let `u` be the lower Ritz eigenvalue of the compression to
`span{kappa,w}` and assume `B=A-uI>0`.  Put

\[
 m_j=\langle w,B^jw\rangle,
 \qquad j=1,-1,-2.                                  \tag{3.2}
\]

The two-by-two characteristic equation is

\[
 (q-u)m_1=r^2.                                      \tag{3.3}
\]

### Theorem 3.1 (exact Ritz-surplus spread identity)

At `U=u`,

\[
 \boxed{
 \begin{aligned}
 \tau_+^2&=r^2m_{-2},\\
 \chi_u&=r^2\left(m_{-1}-{1\over m_1}\right)\\
 &= {r^2\over2m_1}
 \iint{(x-y)^2\over xy}\,d\nu_w(x)d\nu_w(y)\geq0,
 \end{aligned}}                                      \tag{3.4}
\]

where `nu_w` is the spectral measure of `B` at `w`.  Equality
`chi_u=0` holds exactly when this measure is supported at one point, i.e.
when `w` lies in one eigenspace of `B`.

**Proof.**  The first line is the definition of the shifted solve.  The
Schur surplus and (3.3) give

\[
 \chi_u=r^2m_{-1}-(q-u)
       =r^2(m_{-1}-m_1^{-1}).
\]

Finally,

\[
 m_1m_{-1}-1
 ={1\over2}\iint{(x-y)^2\over xy}\,d\nu_w(x)d\nu_w(y),
\]

which proves the last line and its equality case.  \(\square\)

Thus `tau_+` is an inverse second moment, while `chi_u` is a spectral-spread
defect.  Neither determines the other.

For an exact separation family, let `s>=4`, take

\[
 B_s=\operatorname {diag}(1,s^2,s^4),               \tag{3.5}
\]

and choose a unit vector `w_s` whose squared coordinates are

\[
 p_0=s^{-8},\qquad p_1=s^{-1},qquad
 p_2=1-s^{-1}-s^{-8}.                               \tag{3.6}
\]

Fix any desired solve `T_0>0`, put

\[
 r_s={T_0\over\sqrt{m_{-2}}},\qquad
 q_s={r_s^2\over m_1},\qquad u=0,                  \tag{3.7}
\]

and form the Hermitian even block with complement `B_s` and coupling
`b_s=r_sw_s`.  Its two-vector lower Ritz value is exactly zero,
`g_+=1`, and `tau_+=T_0`.  Directly from (3.6),

\[
 m_{-2}\leq{5\over4}s^{-5},qquad
 m_{-1}-{1\over m_1}\geq{1\over2}s^{-3}.          \tag{3.8}
\]

Therefore

\[
 \boxed{{\chi_0\over g_+}\geq{2\over5}T_0^2s^2.} \tag{3.9}
\]

The surplus is unbounded while the solve is fixed.  Conversely, taking
`B=aI` and `r=aT_0` gives the same solve `T_0` and exactly zero surplus.
This proves that the second condition in (0.2) is genuinely independent of
the first.  These are Hermitian separation models, not arithmetic Weil
matrices.

## 4. Exact Cauchy-algebra separation of endpoint and solve

There is also a counterfamily inside the exact finite source Cauchy algebra.
It is structural, not assembled from the actual prime inventory.

Take `N=2`, set every odd Cauchy coefficient `b_n` to zero, and in the
ordered complex modes choose

\[
 Q(M)=\operatorname {diag}(M,1,0,1,M),\qquad M>1.  \tag{4.1}
\]

Then every off-diagonal entry is exactly
`(b_n-b_m)/(n-m)=0`; inversion symmetry and the source rank-two
commutator hold.  The even and odd blocks are

\[
 Q_+=\operatorname {diag}(0,1,M),qquad
 Q_-=\operatorname {diag}(1,M).                    \tag{4.2}
\]

Fix the unit even anchor

\[
 \kappa={1\over13}(12,3,4).                        \tag{4.3}
\]

Its normalized endpoint is independent of `M`:

\[
 t_\kappa={12+7\sqrt2\over13\sqrt5}.              \tag{4.4}
\]

Use the Rayleigh upper shift

\[
 U=q={9+16M\over169}.                               \tag{4.5}
\]

In the orthonormal complement

\[
 v_1={(-1,4,0)\over\sqrt{17}},\qquad
 v_2={(-16,-4,51)\over13\sqrt{17}},               \tag{4.6}
\]

the shifted complement is

\[
 B={1\over2873}
 \begin{pmatrix}
 2551-272M&-208\\
 -208&-137+2329M
 \end{pmatrix}.                                    \tag{4.7}
\]

Its determinant numerator is

\[
 P(M)=-633488M^2+5978543M-392751.                  \tag{4.8}
\]

Let `M_*` be the larger root of `P`; numerically
`M_*=9.3713428051...`.  For `1<M<M_*`, `B>0`, while

\[
 b={1\over\sqrt{17}}
 \left({12\over13},{12(17M-1)\over169}\right).     \tag{4.9}
\]

The first component of `adj(2873B)` applied to the vector proportional to
`b` is `33813M-1989`, which stays positive.  Hence

\[
 \boxed{\|(A-qI)^{-1}b\|\longrightarrow\infty
        \quad(M\uparrow M_*).}                     \tag{4.10}
\]

At the same time `q<1=lambda_min(Q_-)` throughout this interval.  Thus the
actual shifted odd sign is favorable while the same-anchor solve becomes
arbitrarily bad at a fixed endpoint overlap.  Source Cauchy displacement,
inversion symmetry, and an odd shifted floor do not supply (1.7).

## 5. The two-anchor escape

The endpoint ceiling in Theorem 1.1 follows the **Ritz anchor**.  It can be
avoided only by changing that anchor, not by keeping `kappa` and choosing a
different positive trial `z`.

Let `kappa_p` be the unit projected prolate target and let `z` be a unit
positive comparison state which is now used as the Ritz anchor.  Decompose

\[
 Q_+=\begin{pmatrix}q_z&b_z^*\\b_z&A_z\end{pmatrix}
 \quad\hbox{on}\quad
 \mathbb Cz\oplus z^\perp.                          \tag{5.1}
\]

Suppose a certified upper shift `U_z` gives

\[
 B_z=A_z-U_zI>0,quad
 g_z=\lambda_{\min}(B_z),quad
 T_z\geq\|B_z^{-1}b_z\|,                            \tag{5.2}
\]

and define `chi_z` as in checkpoint 0.57.  With

\[
 \gamma_z=\sin\{\arcsin m_{\mathcal C}(z)-\arctan T_z\},
                                                               \tag{5.3}
\]

the already-proved finite theorem gives

\[
 \arctan T_z<\arcsin m_{\mathcal C}(z),qquad
 \chi_z<{g_z\gamma_z^2\over R_N(\gamma_z)}
 \quad\Longrightarrow\quad Q_--U_zI>0.             \tag{5.4}
\]

The associated simple even ground `x` obeys

\[
 \|x-z\|\leq D(T_z),qquad
 \boxed{\|x-\kappa_p\|
 \leq\|z-\kappa_p\|+D(T_z).}                      \tag{5.5}
\]

Thus a determinant approximation target of size `delta_lambda` can use a
two-anchor construction if both terms on the right of (5.5) have that size.
This is the precise abstract theorem behind the proposed escape.

### 5.1 Constant floors and Fejer endpoint lifts

A normalized constant direction is `e_0^+`.  Its normalized endpoint
overlap is only

\[
 {1\over\sqrt{2N+1}}.                               \tag{5.6}
\]

Therefore an `L2` constant-floor perturbation of size `delta` changes the
normalized endpoint by only `delta/sqrt(2N+1)`.  A literal constant floor
does not by itself create an endpoint reserve comparable to `delta` in a
growing space.

An endpoint-centered Fejer direction is much more efficient.  In the real
even basis its unnormalized coefficients are

\[
 (1,\sqrt2(1-1/(N+1)),\ldots,
       \sqrt2(1-N/(N+1))).                          \tag{5.7}
\]

After unit normalization its exact endpoint overlap is

\[
 \boxed{
 t_{F,N}=\left{
 {3(N+1)^3\over(2N+1)(2N^2+4N+3)}
 \right}^{1/2}\longrightarrow{\sqrt3\over2}.}      \tag{5.8}
\]

If `w_F` is this unit direction and

\[
 z={\kappa_p+\delta w_F\over\|\kappa_p+\delta w_F\|},
                                                               \tag{5.9}
\]

then

\[
 \|z-\kappa_p\|\leq2\delta,qquad
 t_z\geq{\delta t_{F,N}-t_{\kappa_p}\over1+\delta}. \tag{5.10}
\]

Hence `t_z` is comparable to `delta` whenever
`t_(kappa_p)=o(delta)`.  A normalized Jackson endpoint kernel has the same
qualitative feature.

Endpoint overlap is not cone depth.  The exact missing hybrid reserve for
(5.9) is

\[
 \boxed{
 \mathfrak h_{\delta}
 =\inf_{\alpha\in[0,\infty]}
 \{\langle\widehat b_\alpha,\kappa_p\rangle
   +\delta\langle\widehat b_\alpha,w_F\rangle\},
 \qquad
 m_{\mathcal C}(z)
 ={\mathfrak h_\delta\over\|\kappa_p+\delta w_F\|}.} \tag{5.11}
\]

The endpoint term in (5.11) is favorable by (5.8), and the zero-frequency
response of the projected prolate state has a positive limit.  Current
source estimates do not control the complete transition in `alpha`
uniformly, so they do not prove `mathfrak h_delta` is a positive multiple of
`delta`.

Even such a cone estimate would not preserve the Ritz block automatically.
Changing the anchor introduces the signed vector

\[
 P_{z^\perp}(Q_+-U_zI)(z-\kappa_p),                 \tag{5.12}
\]

and rotations of both complementary projectors.  An ordinary norm estimate
for `z-kappa_p` multiplies it by the full norm of the signed Weil matrix and
destroys the cancellation.  What is needed is direct control in the
`B_z^{-1}` and `B_z^{-2}` metrics which define `chi_z` and `T_z`.

If `m_C(z)` is comparable to `delta`, Theorem 1.1 also shows that the exact
checkpoint certificate needs at least

\[
 T_z<c\,\delta,qquad
 {\chi_z\over g_z}=O\!\left({\delta^2\over N^2}\right) \tag{5.13}
\]

with strict constant slack; the universal cubic sufficient condition asks
for `O(delta^3/N^2)`.  These relative rotated-anchor estimates, rather than
the Hilbert-space distance in (5.10), are the unresolved arithmetic input.

## 6. Exact remaining alternatives

The same-anchor route now has a completely explicit burden.  On one source
schedule it must prove

\[
 T_\lambda<t_{\kappa,\lambda}/
              \sqrt{1-t_{\kappa,\lambda}^2},
 \qquad
 {N^2\chi_{U,\lambda}\over g_{+,\lambda}}
 <\Gamma_{\rm end}(t_{\kappa,\lambda},T_\lambda)^2,
                                                               \tag{6.1}
\]

as well as the weighted determinant estimate.  On the locked exponential
schedule, (2.20) makes (6.1) an exponential relative theorem, not an
`O(L^(-5/2))` theorem.

On a general schedule allowed by the determinant criterion
`N/L^2 -> infinity`, this note supplies (1.6), (1.10), and the finite bound
(2.19) whenever its hypotheses are independently enclosed, but it supplies
no universal asymptotic scale for `t_kappa`.

The two-anchor route must instead prove all three of the following on a
common schedule:

1. a positive hybrid reserve `mathfrak h_delta` in (5.11);
2. the rotated even complement, solve, and Schur-surplus bounds in
   (5.2)--(5.4), preserving the complete signed source cancellation; and
3. the determinant approximation bound obtained from (5.5).

Neither route is completed by the current source lock.  The result of this
attack is the sharp rate ledger (0.2), the source endpoint upper estimate,
and a viable but still conditional two-anchor theorem—not an asymptotic
prolate--Weil bridge.
