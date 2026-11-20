# Green quotients, modular seam cancellation, and the rootwise Hardy gate

## Scope and outcome

Let

\[
 W(t)=\widehat\psi(t)=2\Xi(t),\qquad
 q(t)=t^rP_N(t^2),\qquad \kappa=\deg q=r+2N,
\tag{1}
\]

and suppose the old-prefix hypotheses in `COMPLETE_ORBIT_HARDY_NEXT.md` make
the zeros `rho_1,...,rho_kappa` of `q` real and simple.  Put

\[
 q_j(t)={q(t)\over t-\rho_j},\qquad
 G=qW,\qquad H_j=q_jW={G\over t-\rho_j}.
\tag{2}
\]

The rootwise criterion and its Mellin sufficient condition are

\[
 \sum_{j=1}^{\kappa}{1\over\gamma_j}\leq2,
 \qquad
 \gamma_j={\int(t-\rho_j)^2H_j'(t)^2dt\over\int H_j(t)^2dt},
\tag{3}
\]

and

\[
 Z_j(s)=\int_{\mathbb R}|t-\rho_j|^sH_j(t)^2dt,
 \qquad V_j=(\log Z_j)''(0).
\tag{4}
\]

This note tests whether the exact complete-theta Green representation and
the cancellation of every modular-center seam jet control `gamma_j` or
`V_j`.  The answer separates domain from size.

1. The quotient `H_j=G/(t-rho_j)` has an exact zero-cancelled oscillatory
   Green formula.  For the complete theta sum it is also exactly the
   differential feature `q_j(-iD)psi`; no division by `W` or by a zero of
   `W` occurs.
2. Modular cancellation of all odd center jets is indispensable merely to
   put the high-degree features in `L2`.  If a finite positive theta packet
   has first uncancelled odd jet of order `2 ell+1`, then its rootwise
   `Z_j(0)` diverges whenever `kappa>=2 ell+3`.  Natural first-`M` packets
   have `ell=0`, so they already fail for `kappa>=3`, before either the
   Hardy ratio or Mellin variance can be formed.
3. Cancellation of all seam jets by itself supplies no quantitative gap.
   An explicit family of positive even Schwartz sources has every odd
   center jet zero, yet for any fixed real-rooted `q` it satisfies

   \[
    \gamma_j\longrightarrow{1\over4},\qquad
    V_j\sim {L^2\over12}
   \]

   simultaneously for all roots.  Thus the complete-theta orbit *weights*,
   not smooth modular completion alone, would have to prove the budget.

The finite-packet result is a rigorous route obstruction, not evidence
against the actual complete-theta criterion.  The actual bounds (3)--(4)
remain open.  No finite-height statement, next-pivot sign, or RH conclusion
is asserted.

## 1. The real-root quotient is an exact Green transform

Use

\[
 \widehat f(t)=\int_{\mathbb R}f(h)e^{-ith}dh,
 \qquad
 f(h)={1\over2\pi}\int_{\mathbb R}\widehat f(t)e^{ith}dt.
\tag{5}
\]

Define the complete theta differential features

\[
 g=q(-iD)\psi,\qquad h_j=q_j(-iD)\psi,
 \qquad D={d\over dh}.
\tag{6}
\]

Since `widehat(-iDf)(t)=t widehat f(t)`, equations (1)--(2) give

\[
 \widehat g=G,qquad \widehat h_j=H_j,
 \qquad (-iD-\rho_j)h_j=g.
\tag{7}
\]

Moreover

\[
 \int_{\mathbb R}e^{-i\rho_jx}g(x)dx=G(\rho_j)=0.
\tag{8}
\]

Solving the first-order equation in (7) from either end of the line and
using (8) gives the two equal Green formulas

\[
 \boxed{
 h_j(x)=i e^{i\rho_jx}\int_{-\infty}^x
           e^{-i\rho_jy}g(y)dy
       =-i e^{i\rho_jx}\int_x^\infty
           e^{-i\rho_jy}g(y)dy.}
\tag{9}
\]

Thus the apparent division in `G/(t-rho_j)` is the zero-cancelled
oscillatory Volterra inverse of `-iD-rho_j`.  It is also the `b downarrow 0`
real-root analogue of the shifted exponential Green quotient in
`DIRECTIONAL_DEFECT_THETA_NEXT.md`.  For the complete theta source,
`g,h_j` are Schwartz and both integrals in (9) are valid.

On the positive half-line write the actual orbit expansion as

\[
 \psi(h)=\sum_{n\geq1}\phi_n(h),
 \qquad
 \phi_n(h)=4z_n(2z_n-3)e^{h/2-z_n},
 \quad z_n=\pi n^2e^{2h}.
\tag{10}
\]

Its whole-line form is the modularly completed sum of the evenized orbits
`phi_n^e(h)=phi_n(abs(h))`.  Equations (6) and (9) must be applied after that
sum is complete.  Applying `q_j(-iD)` to individual cusped evenized orbits
creates seam distributions at high degree; the next section gives the
equivalent exact frequency-domain obstruction.

## 2. Exact finite-packet Mellin domain

Let `S` be a nonempty finite set of positive theta-orbit indices and put

\[
 A_S(h)=\sum_{n\in S}\phi_n(h)\quad(h\geq0),
 \qquad
 W_S(t)=2\int_0^\infty A_S(h)\cos(th)dh.
\tag{11}
\]

Let `2 ell+1` be the first odd order for which

\[
 A_S^{(2\ell+1)}(0+)\ne0.
\tag{12}
\]

Such an order always exists.  If all odd jets vanished, analyticity would
make the analytic continuation of `A_S` even; but

\[
 A_S(h)=-12e^{5h/2}\sum_{n\in S}\pi n^2+O(e^{9h/2})
 \quad(h\to-\infty),
\tag{13}
\]

whereas `A_S(-h)` is super-exponentially small.  Repeated integration by
parts in (11) therefore gives a nonzero real `c_S` with

\[
 \boxed{
 W_S(t)=2c_S t^{-2\ell-2}+O(t^{-2\ell-4}).}
\tag{14}
\]

The polynomial `q_j` is monic of degree `kappa-1`.  Consequently its packet
root feature has the exact leading tail

\[
 \boxed{
 H_{j,S}(t):=q_j(t)W_S(t)
 =2c_S t^{\kappa-2\ell-3}\{1+O(t^{-1})\}.}
\tag{15}
\]

For complex `s`, define the packet analogue

\[
 Z_{j,S}(s)=\int_{\mathbb R}|t-\rho_j|^sH_{j,S}(t)^2dt.
\tag{16}
\]

Near `rho_j`, the function `H_(j,S)` is bounded, so `Re(s)>-1` is always a
valid local condition.  (An accidental zero of `W_S` at `rho_j` can extend
that lower boundary.)  At infinity, (15) gives the sharp condition

\[
 \operatorname {Re}s<4\ell+5-2\kappa.
\]

Hence the uniformly valid Mellin strip is

\[
 \boxed{
 -1<\operatorname {Re}s<4\ell+5-2\kappa.}
\tag{17}
\]

Its upper boundary is sharp, independently of any behavior at `rho_j`.

In particular,

\[
 \boxed{
 \kappa\geq2\ell+3
 \quad\Longrightarrow\quad
 Z_{j,S}(0)=\|H_{j,S}\|_2^2=+\infty.}
\tag{18}
\]

This conclusion holds for every root `rho_j`; lower polynomial coefficients
cannot alter the leading tail.

The same threshold invalidates the Hardy energy identity.  Put
`m=kappa-2 ell-3`.  If `m>=1`, then

\[
 (t-\rho_j)^2H_{j,S}'(t)^2
 \sim4c_S^2m^2|t|^{2m},
\]

so both the numerator and denominator in (3) diverge.  If `m=0`, the
denominator still diverges, while

\[
 G_S=qW_S\sim2c_St,
 \qquad G_S'\sim2c_S,
\]

and `||G_S'||_2` diverges.  The integration by parts used to identify the
rootwise numerator with `||G'||_2^2` then has a nonvanishing boundary term.
Thus no extended-value ratio repairs (3): the packet lies outside its
operator domain.

For the natural packet `S={1,...,M}`, the first seam already occurs at order
one.  Indeed

\[
 b_n=\phi_n'(0+)
 =e^{-\pi n^2}\{-16(\pi n^2)^3+60(\pi n^2)^2-30\pi n^2\},
\tag{19}
\]

with `b_1>0`, `b_n<0` for `n>=2`, and

\[
 \sum_{n=1}^M b_n=-\sum_{n>M}b_n>0.
\tag{20}
\]

Therefore `ell=0`, `W_S(t)=-2(sum_(n<=M)b_n)t^-2+O(t^-4)`, and every
`Z_(j,S)(0)` diverges once `kappa>=3`.  The complete-orbit Hardy reduction
has `N>=2`, hence `kappa=r+2N>=4`; no raw first-`M` orbit packet even defines
its rootwise norms.

In the physical variable, (18) says the same thing as the seam-distribution
test.  The evenization of `A_S` is `C^(2 ell)` but its derivative of order
`2 ell+1` jumps at zero.  Applying the degree-`kappa-1` operator
`q_j(-iD)` reaches a delta seam precisely when
`kappa-1>=2 ell+2`, which is (18).

## 3. What complete modular cancellation does—and does not—give

For the actual complete theta source, modular smoothness supplies

\[
 \sum_{n\geq1}\phi_n^{(2a+1)}(0+)=0
 \qquad(a\geq0).
\tag{21}
\]

All algebraic terms in (14) cancel before the polynomial multiplier is
applied.  The completed `W` has exponential real-axis decay, so

\[
 H_j=q_jW\in\mathcal S(\mathbb R),
 \qquad
 Z_j(s)<\infty\quad(\operatorname {Re}s>-1),
\tag{22}
\]

and the derivatives at `s=0` defining `V_j` are legitimate.  Thus (21)
proves the *domain statement* which every finite packet misses.

It does not contain a quantitative lower bound for `gamma_j` above `1/4`,
nor an upper bound for `V_j`.  The following family proves that even
positivity of the physical source, entire frequency data, rapid decay, and
vanishing of every odd center jet do not supply such a bound.

Fix any monic real-rooted polynomial `q` of degree `kappa>=1`, with simple
roots `rho_j`, and put

\[
 \beta=\kappa-{1\over2}.
\]

For `L>1`, define the positive even entire function

\[
 \boxed{
 W_L(t)=\int_{e^{-2L}}^1
 a^{\beta/2-1}e^{-at^2}da.}
\tag{23}
\]

Its inverse Fourier transform is, up to the fixed positive Fourier
constant,

\[
 \psi_L(h)=\int_{e^{-2L}}^1
 a^{\beta/2-3/2}e^{-h^2/(4a)}da>0.
\tag{24}
\]

For each finite `L`, `psi_L` is positive, even, and Schwartz.  In particular
all its odd center derivatives vanish.  Thus it has every qualitative seam
cancellation property used in passing from (21) to (22).

The scale mixture in (23) is chosen so that its middle logarithmic region
exactly compensates the degree of `q_j`.  For `t=e^y`, substitution
`u=at^2` gives

\[
 e^{\beta y}W_L(e^y)
 =\int_{e^{2(y-L)}}^{e^{2y}}
 u^{\beta/2-1}e^{-u}du.
\tag{25}
\]

Let

\[
 c_\beta=\Gamma(\beta/2).
\]

For every fixed `M>0`, the right side of (25) converges uniformly to
`c_beta` on `M<=y<=L-M` as `M` tends to infinity, uniformly in larger `L`.
Since

\[
 q_j(t)=t^{\kappa-1}\{1+O(t^{-1})\},
\tag{26}
\]

the two logarithmic branch functions

\[
 u_{j,\pm,L}(y)=e^{y/2}q_j(\rho_j\pm e^y)
                  W_L(\rho_j\pm e^y)
\tag{27}
\]

have magnitude `c_beta+o_M(1)` throughout that interval.  The identity

\[
 \int_{e^{2(y-L)}}^{e^{2y}}u^{\beta/2-1}e^{-u}du
 =A_\beta(y)-A_\beta(y-L),
\quad
 A_\beta(y)=\int_0^{e^{2y}}u^{\beta/2-1}e^{-u}du,
\tag{28}
\]

shows that the two edge transitions have `L2` derivative bounded
independently of `L`.  The `O(t^-1)` corrections in (26) and their
derivatives are integrable on the logarithmic line.  Therefore, with

\[
 B_{j,L}=\int\{|u_{j,+,L}|^2+|u_{j,-,L}|^2\}dy,
 \qquad
 K_{j,L}=\int\{|u_{j,+,L}'|^2+|u_{j,-,L}'|^2\}dy,
\]

one obtains

\[
 \boxed{
 B_{j,L}=2c_\beta^2L+O(1),
 \qquad K_{j,L}=O(1),}
\tag{29}
\]

where the constants may depend on `q` but not on `L`.  The exact logarithmic
Hardy identity now yields, simultaneously for every root,

\[
 \boxed{
 \gamma_{j,L}={1\over4}+{K_{j,L}\over B_{j,L}}
 \longrightarrow{1\over4}.}
\tag{30}
\]

The normalized densities in (27) are asymptotically uniform on a log
interval of length `L`, with only bounded edge mass.  Their first two moments
therefore give

\[
 \boxed{
 \bar y_{j,L}={L\over2}+O(1),
 \qquad
 V_{j,L}={L^2\over12}+O(L).}
\tag{31}
\]

Thus neither a strict universal improvement of the Hardy constant `1/4` nor
any finite universal Mellin-variance bound follows from all-jet seam
cancellation, even when the completed physical source is positive.

The family (23)--(24) is not the Jacobi theta source.  Its role is only to
separate the qualitative modular conclusion (smooth even completion) from
the quantitative theta arithmetic still needed for (3)--(4).

## 4. Consequence for the theta Hardy/Mellin route

The Green and packet calculations rule out the following continuation.

- One cannot form `gamma_j` or `V_j` for a first-`M` positive-orbit packet
  and then pass `M` to infinity.  At every finite `M`, the quantities are
  outside their domain for all degrees in the complete-orbit reduction.
- One cannot differentiate individual evenized orbits through
  `q_j(-iD)` and estimate their norms positively.  The resulting delta seams
  are precisely the algebraic tails in (14)--(18).
- One cannot use the cancellation identities (21) alone as a Poincare gap
  on logarithmic radius.  The positive scale mixtures (23) have the same
  qualitative cancellations and approach the sharp gapless constant.

A viable theta proof must instead sum a modularly complete infinite group
*before* applying `q_j`, taking an `L2` norm, or differentiating the Mellin
transform.  It must then use quantitative information absent from (21), for
example the exact Jacobi weights and their scale separation, to prove the
collective budget

\[
 \sum_{j=1}^{\kappa}{4V_j\over1+V_j}\leq2
\tag{32}
\]

or a direct lower bound on the assembled `gamma_j`.  The first-orbit
dominance method which closes the isolated first odd norm inequality does
not automatically extend here: the polynomial degree `kappa-1` exposes
every uncancelled seam and the needed variance scale shrinks like
`1/kappa`.

Failure of this stronger Mellin budget would not refute the next pivot.  It
would only retire this particular sufficient mechanism.

## Self-audit and nonclaims

- The signs in (9) follow from
  `(-iD-rho_j)h_j=g`; the equality of its two Volterra forms uses exactly
  `G(rho_j)=0`.
- The tail exponent in (15) is
  `(kappa-1)-(2 ell+2)=kappa-2 ell-3`.  Squaring it gives the upper Mellin
  boundary `4 ell+5-2 kappa` in (17).
- The threshold in (18) agrees with the physical seam test:
  `deg(q_j)=kappa-1` reaches the first delta derivative at order
  `2 ell+2`.
- Equations (29)--(31) use both logarithmic branches.  The power
  `beta=kappa-1/2` is exactly the value for which
  `e^(y/2)q_j(e^y)W_L(e^y)` has a constant middle plateau.
- The Gaussian scale mixture is an ambient positive-source countermodel,
  not a theta-orbit replacement and not a counterexample to the actual
  rootwise criterion.
- No estimate for the actual complete-theta `gamma_j` or `V_j` has been
  proved.  No finite computation, Xi Laguerre sign, next-pivot sign, or RH
  conclusion is claimed.
