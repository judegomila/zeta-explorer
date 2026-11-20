# Correlated Ewald pairing and the scale-curvature criterion

## Scope

`MODULAR_EWALD_GROUPING_NEXT.md` constructs left Euler/Ewald cells
`epsilon_n` whose sum is the complete theta profile and whose convergence is
valid against every polynomial weight.  Individual cells, and every nonzero
finite real packet of cells, change Fourier sign.  This note asks whether
correlation **across** cells repairs that obstruction while keeping the full
`Xi` leg and the actual mismatch-corrected residual assembled.

There are three exact outcomes.

1. For a fixed global residual, every Ewald paid contribution is a right-hand
   Euler quadrature error of one scalar continuous-scale source `J_pi(x)`.
2. Averaging the left and right Ewald decompositions gives a trapezoidal
   grouping whose complete paid sum is

   \[
    \frac12\int_0^\infty \{x\}(1-\{x\})J_\pi''(x)\,dx.          \tag{1}
   \]

   This yields a rigorous signed regional-curvature compensation lemma.
3. Adjacent differences and all fixed-order Newton differences give exact,
   absolutely convergent all-degree decompositions.  They accelerate the
   cell-index decay and can cancel finitely many physical tail modes, but no
   nonzero finite-band block acquires a Fourier sign.  Nonnegative finite-band
   blocks also fail to acquire a physical sign.

The continuous source is itself Fourier self-dual in the scale variable and
has zero mean.  Consequently it must change sign unless it vanishes, and
global monotonicity or convexity cannot prove (1).  The surviving question is
a genuinely correlated placement-of-curvature inequality, not blockwise
positivity.  No paid sign, endpoint theorem, or RH conclusion is proved.

## 1. The continuous-scale paid source

Use the continuous orbit and its even completion

\[
 \omega_x(h)=4z_x(2z_x-3)e^{h/2-z_x},\qquad
 z_x=\pi x^2e^{2h},
\]

\[
 \sigma_x(h)=\frac12\{\omega_x(h)+\omega_x(-h)\},\qquad x>0.
\]

With the Fourier convention of the earlier notes, put

\[
 C_x(t)=\frac12\widehat{\sigma_x}(t)
       =\frac12\operatorname {Re}\{K(t)x^{-s}\},
 \quad s=\frac12-it,
 \quad K(t)=s(s-1)\pi^{-s/2}\Gamma(s/2).            \tag{2}
\]

The left Ewald cell and its transform are

\[
 \varepsilon_n=\sigma_n-\int_{n-1}^n\sigma_x\,dx,
 \qquad
 E_n=C_n-\int_{n-1}^nC_x\,dx.                     \tag{3}
\]

Fix an old positive prefix and a new representative, and form the actual
global residual **before** making any orbit decomposition:

\[
 \pi=p-q_X+q_{Q^{-1}r}=p-q_A,
 \qquad W_\pi(t)=|P_\pi(t)|^2.                    \tag{4}
\]

For the symmetric Turan bilinear

\[
 \mathcal B(A,B)=A'B'-\frac12(AB''+A''B),
\]

define the scalar continuous-scale source

\[
 \boxed{
 J_\pi(x)=\frac1\pi\int_{\mathbb R}
 \mathcal B(\Xi,C_x)(t)W_\pi(t)\,dt.}             \tag{5}
\]

This is not a blockwise regression.  `Xi`, `pi`, `Q`, and `Q^(-1)r` in (5)
are the complete global objects.

Linearity and (3) give the first exact reduction:

\[
 \boxed{
 \mathfrak q_n^{\rm Ew}(\pi,\pi)
 =J_\pi(n)-\int_{n-1}^nJ_\pi(x)\,dx
 =\int_{n-1}^n(x-n+1)J_\pi'(x)\,dx.}             \tag{6}
\]

Thus an Ewald cell is precisely a right-endpoint quadrature error of the
already-correlated paid source.

### Domain control

The inverse profile of `B(Xi,C_x)` is

\[
 R_x(u)=\frac1{16}\int_{\mathbb R}v^2
 \psi\!\left(\frac{u+v}{2}\right)
 \sigma_x\!\left(\frac{u-v}{2}\right)dv,         \tag{7}
\]

and hence

\[
 J_\pi(x)=2[\pi(D)\pi(-D)R_x](0).                 \tag{8}
\]

Every derivative of (8) is a finite sum of correlations between derivatives
and polynomial multiples of `psi` and of `sigma_x`.  The scale law

\[
 \omega_x(h)=x^{-1/2}\omega_1(h+\log x)           \tag{9}
\]

turns these into translated correlations.  The complete profile `psi` and
all its derivatives decay superexponentially at both ends.  At infinity,
splitting the correlation where `|h|` is comparable with `log x` shows rapid
decay with all `x` derivatives.  At zero, the convergent small-`x` expansion
of the Gaussian orbit contains only even powers and begins with `x^2`.
Consequently `J_pi` extends smoothly and evenly across zero and satisfies

\[
 J_\pi(x)=O(x^2),\qquad J_\pi'(x)=O(x)\quad(x\to0),
 \qquad J_\pi^{(j)}(x)\to0\quad(x\to\infty).     \tag{10}
\]

All integrations, summations, and the integrations by parts below are
consequently ordinary absolutely controlled operations.  Equation (8),
rather than an illicit interchange with the non-absolutely `x`-integrable
raw Fourier family, is the domain justification.

## 2. Poisson self-duality of the correlated source

The polynomial Gaussian defining `omega_x` is exactly Fourier reciprocal.
For `a=e^h`, the standard identity

\[
 \int_{\mathbb R}e^{-\pi a^2x^2}e^{-2\pi ixy}dx
 =a^{-1}e^{-\pi y^2/a^2}
\]

and the Fourier differentiation rule for the `x^2` and `x^4` terms gives

\[
 \int_{\mathbb R}\omega_x(h)e^{-2\pi ixy}dx
 =\omega_y(-h).                                   \tag{11}
\]

Since the orbit is even in the scale variable, symmetrization yields, for
`y>=0`,

\[
 \boxed{
 \int_0^\infty\sigma_x(h)\cos(2\pi xy)dx
 =\frac12\sigma_y(h).}                            \tag{12}
\]

At `y=0`, both sides are zero by the continuum identity
`int_0^infinity sigma_x dx=0`.

The map in (5) is linear in `C_x`; its `t` derivatives commute with the
cosine transform.  Equations (10)--(12) therefore imply the exact inherited
self-duality

\[
 \boxed{
 \int_0^\infty J_\pi(x)\cos(2\pi xy)dx
 =\frac12J_\pi(y).}                               \tag{13}
\]

In particular,

\[
 J_\pi(0)=0,\qquad \int_0^\infty J_\pi(x)dx=0.   \tag{14}
\]

Unless `J_pi` is identically zero, (14) forces it to take both signs.  This is
a source-level obstruction, stronger than the sign failure of an individual
Ewald cell.  It also explains why Poisson resummation alone cannot manufacture
a sign: for example, with `B_1(u)=u-1/2`,

\[
 \begin{aligned}
 \mathfrak q(\pi)
 &=\int_0^\infty B_1(\{x\})J_\pi'(x)dx\\
 &=2\sum_{m\geq1}\int_0^\infty
 J_\pi(x)\cos(2\pi mx)dx
 =\sum_{m\geq1}J_\pi(m).                         \tag{15}
 \end{aligned}
\]

The dual sum is exactly the original discrete sum.  Modular self-duality
closes the identity, but does not supply positivity.

## 3. The left--right trapezoidal grouping

Let

\[
 I_A(h)=\int_A^\infty\sigma_x(h)dx
 =2\pi A^3\{e^{5h/2-\pi A^2e^{2h}}
             +e^{-5h/2-\pi A^2e^{-2h}}\}.
\]

Besides the left cells (3), use the audited right decomposition

\[
 \rho_0=I_1,\qquad
 \rho_n=\sigma_n-I_n+I_{n+1}\quad(n\geq1),
 \qquad
 \psi=\rho_0+\sum_{n\geq1}\rho_n.                \tag{16}
\]

Average the two decompositions cell by cell:

\[
 \tau_1=\frac12(\varepsilon_1+\rho_0),\qquad
 \tau_n=\frac12(\varepsilon_n+\rho_{n-1})\quad(n\geq2). \tag{17}
\]

With `sigma_0=0`, every cell has the unified trapezoidal form

\[
 \boxed{
 \tau_n=\frac{\sigma_{n-1}+\sigma_n}{2}
          -\int_{n-1}^n\sigma_x\,dx.}             \tag{18}
\]

Indeed, `int_0^1 sigma_x dx=-I_1` handles the first cell.  The partial sums
are

\[
 \sum_{n=1}^N\tau_n
 =\sum_{n=1}^{N-1}\sigma_n+\frac12\sigma_N+I_N
 \longrightarrow\psi.                            \tag{19}
\]

The Peano-kernel formula gives

\[
 \tau_n(h)=\frac12\int_{n-1}^n
 (x-n+1)(n-x)\,\partial_x^2\sigma_x(h)dx.         \tag{20}
\]

Consequently, for every weighted `W^(j,1)` seminorm,

\[
 \|\tau_n\|_{j,M}
 \leq C_{j,M}(1+\log n)^M(n-1)^{-5/2}\quad(n\geq2), \tag{21}
\]

so (19) converges absolutely in the full all-degree topology.

On the Mellin side, write

\[
 \widehat{\tau_n}(t)=\operatorname {Re}\{K(t)r_n(s)\}.
\]

Then

\[
 r_1(s)=\frac{s+1}{2(s-1)},                       \tag{22}
\]

and, for `n>=2`,

\[
 \boxed{
 r_n(s)=\frac{(n-1)^{-s}+n^{-s}}2
 -\frac{n^{1-s}-(n-1)^{1-s}}{1-s}.}              \tag{23}
\]

Equivalently,

\[
 r_n(s)=\frac{s(s+1)}2\int_{n-1}^n
 (x-n+1)(n-x)x^{-s-2}dx,                          \tag{24}
\]

and

\[
 \sum_{n\geq1}r_n(s)=\zeta(s),\qquad 0<\Re s<1. \tag{25}
\]

The first cell carries the boundary compensation.  At `s=1/2`, with
\(c_0=\pi^{-1/4}\Gamma(5/4)\),

\[
 \widehat{\tau_1}(0)=\frac32c_0>0,               \tag{26}
\]

whereas strict convexity of `x^(-1/2)` and (23) give

\[
 \widehat{\tau_n}(0)<0\qquad(n\geq2).             \tag{27}
\]

All the cells have the physical tail

\[
 \tau_n(h)=-\pi e^{-5h/2}\{1+o(1)\}
 \qquad(h\to+\infty).                            \tag{28}
\]

Moreover, (22)--(23) and the chirped-phase argument from the audited Ewald
note show that every `widehat(tau_n)` takes both signs infinitely often.
Thus the improved quadrature order is not a hidden positive-definite
factorization.

## 4. Exact correlated curvature compensation

Let

\[
 T_n(t)=\frac12\widehat{\tau_n}(t),\qquad
 \widetilde g_n(t)=\mathcal B(\Xi,T_n)(t),
\]

and define `widetilde q_n` by integrating `widetilde g_n` against the same
global weight `W_pi/pi` as in (5).  Equations (5) and (18) give

\[
 \boxed{
 \widetilde{\mathfrak q}_n(\pi,\pi)
 =\frac{J_\pi(n-1)+J_\pi(n)}2
  -\int_{n-1}^nJ_\pi(x)dx
 =\frac12\int_{n-1}^n
 (x-n+1)(n-x)J_\pi''(x)dx.}                      \tag{29}
\]

The boundary formula uses `J_pi(0)=0`.  Summing (29) proves the announced
identity

\[
 \boxed{
 \mathfrak q(\pi)
 =\sum_{n\geq1}\widetilde{\mathfrak q}_n(\pi,\pi)
 =\frac12\int_0^\infty
 \{x\}(1-\{x\})J_\pi''(x)dx.}                   \tag{30}
\]

The actual paid border is therefore

\[
 \boxed{
 A_X-B_Y-C_{XY}
 =\int_0^\infty\{x\}(1-\{x\})J_\pi''(x)dx.}    \tag{31}
\]

The factor two in (31) is the usual
\(A_X-B_Y-C_{XY}=2\mathfrak q(\pi)\).

The inverse profiles remain explicit:

\[
 \widetilde R_n(u)=\frac1{16}\int_{\mathbb R}v^2
 \psi\!\left(\frac{u+v}{2}\right)
 \tau_n\!\left(\frac{u-v}{2}\right)dv,
 \qquad \widehat{\widetilde R_n}=\widetilde g_n. \tag{32}
\]

No inverse is formed for a cell.  The only inverse in the construction is the
original global `Q^(-1)r` already present in `pi`.

### A rigorous regional compensation lemma

Formula (30) gives a concrete sufficient inequality which allows both signs
of curvature.  Fix `0<delta<=1/2`, and put

\[
 \mathcal C_\delta=\{x:\{x\}\in[\delta,1-\delta]\},
 \qquad
 \mathcal E_\delta=(0,\infty)\setminus\mathcal C_\delta.
\]

Write `(J_pi'')_+=max(J_pi'',0)` and
`(J_pi'')_-=max(-J_pi'',0)`.  Since

\[
 \frac{\delta(1-\delta)}2
 \leq\frac{u(1-u)}2\leq\frac18
 \quad(u\in[\delta,1-\delta])
\]

and `u(1-u)/2<=delta(1-delta)/2` on the edge region, (30) implies

\[
 \begin{aligned}
 \mathfrak q(\pi)\geq{}&
 \frac{\delta(1-\delta)}2
 \int_{\mathcal C_\delta}(J_\pi'')_+\,dx
 -\frac18\int_{\mathcal C_\delta}(J_\pi'')_-\,dx\\
 &-\frac{\delta(1-\delta)}2
 \int_{\mathcal E_\delta}(J_\pi'')_-\,dx.        \tag{33}
 \end{aligned}
\]

Hence the all-degree paid direction follows from the explicit correlated
regional condition

\[
 \boxed{
 4\delta(1-\delta)
 \int_{\mathcal C_\delta}(J_\pi'')_+\,dx
 \geq
 \int_{\mathcal C_\delta}(J_\pi'')_-\,dx
 +4\delta(1-\delta)
 \int_{\mathcal E_\delta}(J_\pi'')_-\,dx.}       \tag{34}
\]

This is a genuine signed compensation inequality: positive curvature in the
interior of the scale cells pays for negative curvature both there and near
the integer seams.  It is sufficient, not asserted here for the theta source.

Pointwise convexity is too strong.  By (10), if `J_pi''>=0` globally, then
`J_pi'` is nondecreasing with equal zero limits, and hence `J_pi` is zero.
The same observation rules out global monotonicity.  Any successful proof of
(34) must use the placement and amount of both curvature signs.

## 5. The Newton--Abel finite-difference hierarchy

There is also an exact hierarchy using only the audited left cells.  Let

\[
 \Delta a_n=a_n-a_{n+1},\qquad
 w_{n,k}=\binom{n+k-1}{k}\quad(k\geq1).
\]

Then, in every weighted `W^(j,1)` topology,

\[
 \boxed{
 \psi=\sum_{n\geq1}w_{n,k}\Delta^k\varepsilon_n.} \tag{35}
\]

For example,

\[
 \psi=\sum_{n\geq1}n(\varepsilon_n-\varepsilon_{n+1}). \tag{36}
\]

To prove the domain statement, use

\[
 \beta_n(h)=\int_0^1u\,\partial_x\omega_{n-1+u}(h)du
\]

and

\[
 \partial_x^{k+1}\omega_x(h)
 =x^{-k-3/2}\prod_{r=0}^k
 \left(\partial_h-r-\frac12\right)
 \omega_1(h+\log x).                              \tag{37}
\]

Repeated finite differences and reflection give

\[
 \|\Delta^k\varepsilon_n\|_{j,M}
 \leq C_{k,j,M}(1+\log n)^M(n-1)^{-k-3/2}
 \quad(n\geq2).                                   \tag{38}
\]

Multiplication by `w_(n,k)=O(n^k)` leaves a summable
`O(n^(-3/2)log^M n)` majorant; the finitely many initial blocks, including
`n=1`, are treated directly.  The discrete inverse

\[
 a_n=\sum_{m\geq n}
 \binom{m-n+k-1}{k-1}\Delta^ka_m
\]

and the hockey-stick identity prove (35).

The Mellin version is equally explicit.  From

\[
 d_n(s)=-s\int_0^1u(n-1+u)^{-s-1}du,
\]

one obtains

\[
 \boxed{
 \Delta^kd_n(s)=-s(s+1)_k\int_0^1u
 \int_{[0,1]^k}
 (n-1+u+v_1+\cdots+v_k)^{-s-k-1}
 \,dv\,du.}                                      \tag{39}
\]

For `n>=2`,

\[
 |\Delta^kd_n(s)|
 \leq\frac{|s(s+1)_k|}{2(n-1)^{\Re s+k+1}}.      \tag{40}
\]

Put

\[
 H_{n,k}(t)=\frac12\operatorname {Re}
 \{K(t)\Delta^kd_n(1/2-it)\}.
\]

Equations (35)--(40) give the exact all-degree identities

\[
 \Xi=\sum_{n\geq1}w_{n,k}H_{n,k},\qquad
 \Xi'^2-\Xi\Xi''
 =\sum_{n\geq1}w_{n,k}\mathcal B(\Xi,H_{n,k}).   \tag{41}
\]

If `mathfrak q_(n,k)` denotes the corresponding form evaluated on the one
global residual (4), then

\[
 \boxed{
 A_X-B_Y-C_{XY}
 =2\sum_{n\geq1}w_{n,k}
 \mathfrak q_{n,k}(\pi,\pi).}                    \tag{42}
\]

Again, no cellwise inverse or regression occurs.

## 6. What finite differences repair, and what they cannot

The large-`h` expansion is exact asymptotically term by term:

\[
 \varepsilon_n(h)\sim\sum_{m\geq1}A_mr_m(n)
 e^{-(2m+1/2)h},                                  \tag{43}
\]

where

\[
 A_m=\frac{2(-1)^m(2m+1)\pi^m}{(m-1)!},\qquad
 r_m(n)=n^{2m}
 -\frac{n^{2m+1}-(n-1)^{2m+1}}{2m+1}.            \tag{44}
\]

The polynomial `r_m` has degree `2m-1`.  Hence a `k`th difference cancels
every tail mode with `2m-1<k`.  In particular,

\[
 \Delta\varepsilon_n(h)
 =6\pi e^{-5h/2}\{1+o(1)\},                      \tag{45}
\]

whereas

\[
 \Delta^2\varepsilon_n(h)
 =40\pi^2(3n+2)e^{-9h/2}\{1+o(1)\}.              \tag{46}
\]

Thus the second difference really removes the first physical tail mode.  It
does not produce a sign.

In fact, no nonzero finite real stencil can cancel every tail mode.  If

\[
 \eta_n=\sum_{j=0}^ra_j\varepsilon_{n+j}
\]

annihilated every polynomial `r_m`, the compact signed measure

\[
 \mu=\sum_{j=0}^ra_j
 \{\delta_{n+j}-\mathbf1_{[n+j-1,n+j]}(x)dx\}
\]

would have every even moment equal to zero.  Its total mass is already zero.
Polynomials in `x^2` are dense in the continuous functions on its compact
support, so `mu=0`; its distinct atoms then force every `a_j=0`.  A finite
stencil can cancel finitely many modes, but not the whole modular tail.

The difference blocks also retain positive mass.  If

\[
 m_n=\int_{\mathbb R}\varepsilon_n(h)dh,
\]

then

\[
 m_n=c_0\int_0^1\{(n-u)^{-1/2}-n^{-1/2}\}du
\]

and the Laplace representation is

\[
 m_n=\frac{c_0}{\sqrt\pi}\int_0^\infty
 t^{-1/2}e^{-nt}
 \left\{\frac{e^t-1}{t}-1\right\}dt.             \tag{47}
\]

Applying `Delta^k` inserts the strictly positive factor
`(1-e^(-t))^k`; hence

\[
 \Delta^km_n>0.                                   \tag{48}
\]

Nevertheless, every nonzero fixed finite-band packet has a Fourier transform
which takes both signs infinitely often, by the audited chirped-phase lemma.
This applies to every Newton block in (35).  For nonnegative stencil
coefficients the obstruction is visible in physical space too: the mass is
positive while (43) has a negative leading tail.  For example,

\[
 \varepsilon_n+\varepsilon_{n+1}
 =-2\pi(6n+1)e^{-5h/2}\{1+o(1)\}
\]

and has positive mass.

Ordinary positive Abel smoothing cannot evade this conclusion.  With
`S_n=sum_(j<=n)E_j`, finite summation by parts gives

\[
 \sum_{n=1}^Nw_nE_n
 =w_NS_N+\sum_{n=1}^{N-1}(w_n-w_{n+1})S_n.       \tag{49}
\]

If `w_n` is nonnegative and nonincreasing, the Abel pieces are nonnegative
finite combinations of the original cells.  Every nonzero such piece still
has positive mass, a negative physical tail, and an infinitely sign-changing
Fourier transform.  The identical identity holds after applying
`B(Xi,cdot)`, but linearity does not convert these signed legs into positive
paid blocks.

This is a rigorous no-go for finite-band, adjacent-positive, and positive-Abel
strategies whose sign certificate is assigned to each theta leg separately.
It does **not** rule out the correlated curvature compensation (30)--(34),
where signs are paid only after retaining the full `Xi` source.

## 7. Resulting analytic target

The trapezoidal grouping and the Newton hierarchy are exact infinite-sum
mechanisms, not finite orbit evidence.  They establish:

- complete all-degree domain control after adjacent or higher differences;
- exact retention of the global residual and regression correction;
- a positive Peano kernel multiplying the signed scale curvature `J_pi''`;
- a quantitative regional inequality, (34), sufficient for the paid sign;
- a sharp no-go for obtaining that sign from any fixed finite-band theta leg.

The next genuine lemma is therefore not another degree or orbit cutoff.  It
is a theta-specific proof of (34), or a stronger estimate of the same form,
for the actual globally corrected source (5).  The self-duality (13) should
be retained in that estimate: it is the exact arithmetic relation coupling
the positive and negative scale regions.

## Nonclaims

- Neither (30) nor (34) is asserted nonnegative here.
- Fourier or physical sign changes of a block do not disprove positivity of
  the fully correlated sum.
- The finite-band no-go concerns blockwise leg-sign certificates; it does not
  rule out an inequality using `B(Xi,H)` after the infinite sum is coupled.
- No blockwise `Q^(-1)`, Schur complement, or residual is used.
- No finite computation, endpoint sign, or RH conclusion is claimed.
