# Correlated cross-Hardy angle and reverse Euler-cell curvature

## Scope and outcome

`EWALD_HARDY_BRIDGE_NEXT.md` proves that the actual Abel path is the
polarization of the complete-orbit Hardy form and that root Mellin
differentiation must occur after Euler subtraction. This note pushes both
surviving directions one step further without splitting their correlations.

There are four conclusions.

1. The directional cross-Hardy problem has an exact division-free
   logarithmic spectral form. If `mathcal U` sends a frequency profile to
   all root-centered logarithmic branches, then

   \[
    \boxed{\mathscr Q_q(U,V)
    ={2\over\kappa}
      \left\{\langle(\mathcal UU)',(\mathcal UV)'\rangle
      -{2\kappa-1\over4}
       \langle\mathcal UU,\mathcal UV\rangle\right\}.} \tag{1}
   \]

   Hence the bounded-gauge Wronskian is a single signed spectral-band
   correlation. This is the exact correlated angle inequality; it uses no
   separate Cauchy estimates.
2. The natural quotient proof is unavailable for the actual theta source.
   At every real zero of `W=2Xi`, an interior Ewald packet, and therefore
   its bounded-gauge direction, fails to share that zero for all but a
   discrete set of Abel parameters. The quotient by `W` consequently has
   poles on the Hardy zero set. The division-free form (1) is not optional.
3. The assembled root log-variance bound is exactly one correlated
   **double Euler-cell** inequality. Its entries are complete-theta
   correlations

   \[
    b_n^{(r)}(0)
    =2\pi\sum_j\langle v_j,(\log|D|)^rv_{j,n}\rangle,
    \qquad r=0,1,2,                              \tag{2}
   \]

   where `v_j` contains the complete theta profile and `v_(j,n)` contains
   one already-subtracted Ewald cell. All cells and all roots are summed
   before a sign is taken.
4. Neither reduction is automatically positive. The logarithmic Hardy
   operator in (1) is indefinite, every Ewald cell measure in (2) is
   signed, and the reverse-curvature pair kernel changes sign. Thus
   endpoint log variance does not pay the cross angle, and cellwise or
   diagonal positivity cannot prove the reverse curvature.

The output is a rigorous reduction to two explicit complete-theta
arithmetic inequalities, together with a theta-specific nodal obstruction
to the most natural angle proof. Neither inequality is proved here. No
finite orbit packet, separate component bound, endpoint sign, all-degree
theorem, or RH conclusion is used.

## 1. The common signed Hardy form

Assume the two old prefixes are positive, so the single actual residual

\[
 q(t)=t^rP_N(t^2)=\prod_{j=1}^{\kappa}(t-\rho_j) \tag{3}
\]

has real simple roots. Put

\[
 q_j(t)={q(t)\over t-\rho_j},\qquad
 W(t)=2\Xi(t).                                   \tag{4}
\]

For real rapidly decreasing profiles `U,V`, define the polarized Hardy form

\[
\begin{aligned}
 \mathscr Q_q(U,V)
 &:=\int_{\mathbb R}q(t)^2\mathcal B(U,V)(t)\,dt\\
 &=2\langle(qU)',(qV)'\rangle
   -\sum_{j=1}^{\kappa}\langle q_jU,q_jV\rangle,
\end{aligned}                                    \tag{5}
\]

where

\[
 \mathcal B(U,V)=U'V'-{1\over2}(UV''+U''V).     \tag{6}
\]

The second equality in (5) is the exact bilinear integration-by-parts
identity, using

\[
 q'^2-qq''=\sum_jq_j^2.                         \tag{7}
\]

Let `W_z=2mathcal E_z` be the complete Euler-renormalized Abel packet. Then

\[
 4\pi S_\pi(z)=\mathscr Q_q(W,W_z).             \tag{8}
\]

For the total cell-variation series

\[
 T_\pi(z)=\sum_{n\geq1}|e_n(\pi)|z^n,\qquad
 M_\pi=T_\pi(1),                                \tag{9}
\]

fix `alpha>0` and set

\[
 R_\alpha(z)=(1+\alpha)M_\pi-T_\pi(z),\qquad
 L_{\alpha,z}=R_\alpha(z)\partial_zW_z+T_\pi'(z)W_z. \tag{10}
\]

The bounded-gauge Wronskian is

\[
 \boxed{
 4\pi\mathcal W_{\pi,\alpha}(z)
 =\mathscr Q_q(W,L_{\alpha,z}).}                \tag{11}
\]

Both (8) and (11) retain the signed Ewald packet and the single actual
residual.

## 2. Exact all-root logarithmic angle

For any profile `U`, any root `rho_j`, and the two choices of sign, define

\[
 (\mathcal U_jU)_\pm(y)
 =e^{y/2}q_j(\rho_j\pm e^y)U(\rho_j\pm e^y),
 \qquad y\in\mathbb R.                           \tag{12}
\]

Collect all `2kappa` branches into the vector

\[
 \mathcal UU=((\mathcal U_jU)_\pm)_{j,\pm}
 \in L^2(\mathbb R;\mathbb R^{2\kappa}).        \tag{13}
\]

The unitary Jacobian gives

\[
 \langle\mathcal UU,\mathcal UV\rangle
 =\sum_{j=1}^{\kappa}\langle q_jU,q_jV\rangle.  \tag{14}
\]

For every fixed `j`, the rootwise integration-by-parts identity is

\[
 \langle(qU)',(qV)'\rangle
 =\langle(\mathcal U_jU)',(\mathcal U_jV)'\rangle
  +{1\over4}\langle\mathcal U_jU,\mathcal U_jV\rangle. \tag{15}
\]

Summing (15) over the roots yields

\[
 \kappa\langle(qU)',(qV)'\rangle
 =\langle(\mathcal UU)',(\mathcal UV)'\rangle
  +{1\over4}\langle\mathcal UU,\mathcal UV\rangle. \tag{16}
\]

Substitution in (5) proves (1), namely

\[
 \boxed{
 \mathscr Q_q(U,V)
 ={2\over\kappa}
 \langle\mathcal UU,\mathcal A_\kappa\mathcal UV\rangle,}
 \qquad
 \mathcal A_\kappa=-\partial_y^2-{2\kappa-1\over4}. \tag{17}
\]

The equality is read in quadratic-form sense; complete-theta decay makes
all branch boundary terms vanish.

For the bounded gauge, put

\[
 \mathbf u=\mathcal UW,\qquad
 \boldsymbol\ell_{\alpha,z}=\mathcal UL_{\alpha,z}. \tag{18}
\]

Equations (11) and (17) give the exact correlated angle

\[
 \boxed{
 4\pi\mathcal W_{\pi,\alpha}(z)
 ={2\over\kappa}
 \langle\mathbf u,\mathcal A_\kappa
        \boldsymbol\ell_{\alpha,z}\rangle.}      \tag{19}
\]

With the unitary Fourier transform in `y` and

\[
 a_\kappa={\sqrt{2\kappa-1}\over2},             \tag{20}
\]

condition `mathcal W_(pi,alpha)(z)>=0` is equivalently the signed band
balance

\[
\boxed{
\begin{aligned}
 &\int_{|\xi|\geq a_\kappa}
   (\xi^2-a_\kappa^2)
   \operatorname {Re}
   \langle\widehat{\mathbf u}(\xi),
          \widehat{\boldsymbol\ell_{\alpha,z}}(\xi)\rangle\,d\xi\\
 &\qquad\geq
 \int_{|\xi|<a_\kappa}
   (a_\kappa^2-\xi^2)
   \operatorname {Re}
   \langle\widehat{\mathbf u}(\xi),
          \widehat{\boldsymbol\ell_{\alpha,z}}(\xi)\rangle\,d\xi .
\end{aligned}}                                   \tag{21}
\]

Neither integral in (21) is separately positive. Equation (21) is one
correlated inequality, not a comparison of separate norms.

The seed has the same form:

\[
 4\pi S_\pi(z_*)
 ={2\over\kappa}
 \langle\mathbf u,\mathcal A_\kappa\mathcal UW_{z_*}\rangle. \tag{22}
\]

Thus, for example, the bounded gauge with `z_*=alpha=1/2` reduces to (21)
on `[1/2,1)` together with the single signed seed (22).

## 3. A theta-specific obstruction to the quotient angle

One might try to prove (19) by writing

\[
 L_{\alpha,z}=r_{\alpha,z}W
\]

and estimating a scalar multiplier `r_(alpha,z)`. For the actual theta
profile this quotient is generically singular.

Let `tau` be any real zero of `W`. Such zeros exist infinitely often by the
classical Hardy theorem, and every zero has finite multiplicity. At fixed
`tau`, the interior Ewald packet is

\[
 W_z(\tau)=2\sum_{n\geq1}E_n(\tau)z^n,          \tag{23}
\]

where, with `s_tau=1/2-i tau`,

\[
 E_n(\tau)={1\over2}\operatorname {Re}
       \{K(\tau)d_n(s_\tau)\},\qquad
 d_n(s)=-s\int_0^1u(n-1+u)^{-s-1}\,du.          \tag{24}
\]

The large-cell expansion is

\[
 E_n(\tau)
 =-{1\over4}n^{-3/2}
   \operatorname {Re}
   \{s_\tau K(\tau)e^{i\tau\log n}\}
   +O_\tau(n^{-5/2}).                            \tag{25}
\]

Since `s_tau K(tau) ne 0`, the leading logarithmic sinusoid cannot be
`O(1/n)` for every sufficiently large integer `n`. For `tau=0` its
coefficient is already a nonzero real number. For `tau ne 0`, choose real
points `x_k` tending to infinity at which the phase of
`s_tau K(tau)x_k^(i tau)` is an integer multiple of `2pi`, and choose an
integer `n_k` nearest to `x_k`. Then
`tau log(n_k/x_k)=O(1/x_k)`, so the real part in (25) tends in magnitude to
`|s_tau K(tau)|`, rather than to zero. Consequently

\[
 z\longmapsto W_z(\tau)
\]

is not the zero analytic function on `0<z<1`.

Suppose now that `L_(alpha,z)(tau)` vanished identically on an open
`z`-interval. The functions involved are real-analytic for `0<z<1`, so the
identity theorem extends that vanishing throughout the connected interior.
Equation (10) would give

\[
 \partial_zW_z(\tau)
 +{T_\pi'(z)\over R_\alpha(z)}W_z(\tau)=0.       \tag{26}
\]

Together with `W_0(tau)=0`, uniqueness for this scalar first-order equation
would force `W_z(tau)` to vanish identically, contradicting (25). Hence

\[
 \boxed{
 L_{\alpha,z}(\tau)\ne0
 \quad\text{for all but a discrete set of interior }z.} \tag{27}
\]

At such `z`, `L_(alpha,z)/W` has a pole at `tau`. It is not a bounded
multiplier and the formal identity

\[
 \mathcal B(W,rW)
 =r\,\mathcal B(W,W)-{1\over2}W^2r''            \tag{28}
\]

cannot be integrated across the nodal set without additional pole boundary
terms. A proof uniform on an Abel interval would have to establish common
vanishing at every Hardy zero, a property explicitly absent for generic
interior parameters by (27).

This obstruction is source-specific: it uses the actual real zeros of `Xi`
and the exact Euler cell asymptotic. It does not refute the division-free
angle (19).

## 4. Reverse curvature as one double Euler-cell inequality

Let

\[
 \Delta_nW(t)=W_n(t)-\int_{n-1}^nW_x(t)\,dx.    \tag{29}
\]

On the disjoint union

\[
 \Omega=\bigsqcup_{j=1}^{\kappa}\{j\}\times\mathbb R,
\]

define the logarithmic coordinate and signed cell measures

\[
 Y(j,t)=\log|t-\rho_j|,                          \tag{30}
\]

\[
 d\nu_n(j,t)
 =q_j(t)^2W(t)\Delta_nW(t)\,dt.                 \tag{31}
\]

Their Mellin transforms are exactly the already-subtracted cell functions

\[
 b_n(\sigma)=\int_\Omega e^{\sigma Y}\,d\nu_n
 =\sum_{j=1}^{\kappa}b_{j,n}(\sigma).           \tag{32}
\]

The subtraction in (29) occurs before any differentiation in `sigma`. The
weighted Ewald-cell topology and local integrability of
`log^2|t-rho_j|` give

\[
 \sum_{n\geq1}\int_\Omega(1+Y^2)\,d|\nu_n|<\infty.
\]

For `n>=2`, this follows directly from

\[
 |d_n(1/2-it)|
 \leq {|1/2-it|\over2(n-1)^{3/2}},
\]

combined with the exponential decay of the completed multipliers `W` and
`K`; the finitely many initial cells are ordinary Schwartz correlations.
In particular,

\[
 \boxed{
 \sum_{n\geq1}|b_n^{(r)}(0)|<\infty
 \qquad(r=0,1,2).}                              \tag{33}
\]

Therefore all single and double sums below are ordinary absolutely
convergent sums.

At the complete endpoint,

\[
 \nu:=\sum_{n\geq1}\nu_n,\qquad
 d\nu(j,t)=q_j(t)^2W(t)^2dt\geq0.               \tag{34}
\]

Put

\[
 B=\nu(\Omega)=\sum_nb_n(0)>0,\qquad
 \mathcal V=\operatorname {Var}_{\nu/B}(Y).     \tag{35}
\]

For two independent copies of the assembled law,

\[
 \boxed{
 B^2\mathcal V
 ={1\over2}\sum_{n,m\geq1}
 \iint_{\Omega^2}(Y-Y')^2\,d\nu_n\,d\nu_m.}     \tag{36}
\]

The individual `nu_n` are signed; positivity appears only after the complete
double sum is assembled.

Let

\[
 c_\kappa={1\over2\kappa-1}.                    \tag{37}
\]

The reverse Mellin-curvature sufficient condition
`mathcal V<=c_kappa` is exactly

\[
\boxed{
\sum_{n,m\geq1}
\iint_{\Omega^2}
\left\{c_\kappa-{1\over2}(Y-Y')^2\right\}
\,d\nu_n\,d\nu_m\geq0.}                         \tag{38}
\]

Equivalently, entirely in scalar Euler-cell data, (38) is

\[
\boxed{
\begin{aligned}
\sum_{n,m\geq1}\Bigl[
 &c_\kappa b_n(0)b_m(0)\\
 &-{1\over2}\{
 b_n''(0)b_m(0)+b_n(0)b_m''(0)
 -2b_n'(0)b_m'(0)\}\Bigr]\geq0.
\end{aligned}}                                   \tag{39}
\]

Equation (39) is the requested correlated reverse Euler-cell curvature
inequality. It is noncircular: its denominator `B` is positive independently
of the pivot, its cells use only the old actual residual and the complete
theta profile, and no endpoint target sign occurs.

## 5. Exact complete-orbit operator entries

The cell entries in (39) have a division-free physical-space form. Let
`epsilon_n` be the complete left Ewald cell, so

\[
 \widehat{\varepsilon_n}=\Delta_nW.             \tag{40}
\]

Define the complete and cell root features

\[
 f_j=q_j(-iD)\psi,\qquad
 f_{j,n}=q_j(-iD)\varepsilon_n,                 \tag{41}
\]

and center the root by modulation:

\[
 v_j(h)=e^{-i\rho_jh}f_j(h),\qquad
 v_{j,n}(h)=e^{-i\rho_jh}f_{j,n}(h).            \tag{42}
\]

No quotient by `W` occurs. The complete modular orbit sum is formed in
`psi` before `q_j(-iD)` is applied, while `epsilon_n` already contains its
discrete orbit and continuum subtraction.

For real `sigma` near zero, Plancherel and positive spectral calculus give

\[
 \boxed{
 b_n(\sigma)
 =2\pi\sum_{j=1}^{\kappa}
 \left\langle |D|^{\sigma/2}v_j,\,
 |D|^{\sigma/2}v_{j,n}\right\rangle.}           \tag{43}
\]

Consequently, with

\[
 \mathcal L=\log|D|,
\]

\[
 \boxed{
 b_n^{(r)}(0)
 =2\pi\sum_{j=1}^{\kappa}
 \langle v_j,\mathcal L^rv_{j,n}\rangle,
 \qquad r=0,1,2.}                               \tag{44}
\]

Equations (39) and (44) reduce the reverse-curvature route to explicit
complete-theta arithmetic. They keep every root modulation, every
off-diagonal Ewald-cell pair, and the continuum subtraction. Separate
absolute estimates for the two factors in (43) would discard precisely the
correlation in (39).

The operator domains are ordinary. Each `epsilon_n` is a smooth
Euler-renormalized cell with exponentially decreasing Fourier transform;
near the centered frequency zero, powers of `log|tau|` are locally
integrable. The complete feature `v_j` is Schwartz by modular cancellation.
Thus (43)--(44) are formed after the domain-restoring operations required by
the Green/Mellin audit.

## 6. What the exact reductions rule out

### Endpoint variance does not imply the cross angle

The root-variance condition controls the quadratic value

\[
 \langle\mathbf u,\mathcal A_\kappa\mathbf u\rangle.
\]

The bounded Abel route requires the directional value

\[
 \langle\mathbf u,\mathcal A_\kappa
 \boldsymbol\ell_{\alpha,z}\rangle.
\]

The operator `mathcal A_kappa` has spectrum
`[-(2kappa-1)/4,infinity)` and is indefinite. Positivity of its quadratic
value on one vector supplies no sign for its polarization with a second
vector. This is not a missing Cauchy estimate: Cauchy would give an absolute
upper bound in a positive parent norm, while (19) asks for a signed lower
angle. The nodal obstruction (27) also rules out treating the second vector
as a bounded positive multiple of the first.

### Euler cells cannot be signed separately

Every interior Ewald packet is signed in physical and Fourier space, and the
complete factor `W` is signed as well. Thus the measures `nu_n` in (31) are
a priori signed; no positive-measure structure follows for an individual
cell. The pair kernel

\[
 c_\kappa-{1\over2}(Y-Y')^2                     \tag{45}
\]

also takes both signs and is unbounded below as the two logarithmic radii
separate. Therefore neither cellwise positivity, diagonal-cell positivity,
nor deletion of the off-diagonal pairs can prove (38). The positive measure
in (34) appears only after every signed cell has been summed.

### Finite orbit substitution is outside the domain

The complete factors `W` and `psi` in (31), (41), and (43) cannot be
replaced by a finite positive theta packet. The uncancelled modular-center
seams then create algebraic frequency tails; at the degrees of the Hardy
reduction, the root features leave `L2` before (43) or (44) can be formed.
Thus (38)--(44) are complete-orbit statements, not limits of finite-packet
inequalities.

## 7. The two precise arithmetic continuations

The theta-specific search has now reached two explicit, noncircular
statements.

**Directional Ewald--Hardy angle.** For the fixed seed `z_*=1/2` and
`alpha=1/2`, prove

\[
 \langle\mathbf u,\mathcal A_\kappa\mathcal UW_{1/2}\rangle\geq0,
 \qquad
 \langle\mathbf u,\mathcal A_\kappa
       \boldsymbol\ell_{1/2,z}\rangle\geq0
 \quad(1/2\leq z<1).                            \tag{46}
\]

By the bounded Abel lemma, (46) proves the next pivot while allowing signed
cells and negative Abel derivative.

**Reverse Euler-cell curvature.** Prove either (38) or (39), with every
`b_n^(r)(0)` evaluated by the complete correlations (44). This yields

\[
 \mathcal V\leq{1\over2\kappa-1}
\]

and hence the next pivot by the assembled complete-orbit uncertainty
inequality.

The first statement is a signed spectral angle at logarithmic frequency
threshold `a_kappa`; the second is multiplicative thin-shell concentration
of the completely assembled root law. Neither follows from the other, and
the exact identities above do not currently sign either one.

## Self-audit and nonclaims

- Summing (15) over `j` produces the factor `kappa` in (16); this is the
  source of the constant `(2kappa-1)/4` in (17).
- The quotient obstruction uses only an interior Abel parameter. The
  pointwise source derivative need not exist at `z=1`, and none is used.
- The Euler error is formed in (29)--(32) before `sigma` differentiation.
  Absolute convergence (33) legitimizes the double rearrangement in
  (36)--(39).
- The factor `2pi` in (43)--(44) is the nonunitary Plancherel constant for
  `widehat f(t)=integral f(h)e^(-ith)dh`.
- The signed measures `nu_n` are bookkeeping devices, not probability
  measures. Only their complete sum (34) is positive.
- Conditions (46) and (38) are stronger sufficient routes. Failure of
  either one would not refute the exact next pivot.

No new Xi--Laguerre sign, all-degree contractive extension, or RH result is
claimed.
