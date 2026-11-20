# Growing-transition mixed-Weber ordinary-endpoint obstruction theorem

## 0. Result and exact scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad h_0={\pi\over4}.                              \tag{0.1}
\]

Use one realized polylogarithmic high--low modal pair

\[
 \alpha=CL+B_L+O(1),\qquad
 \beta=B_L+O(1),\qquad B_L=(\log L)^4,
 \qquad \alpha>\beta>0.                              \tag{0.2}
\]

The letter `h_0` in this note is the Weber action constant.  It is not the
dilation ratio below.  Take integers

\[
 m=A-r\leq A<q=A+s,\qquad d=r+s=q-m,
 \qquad \eta={q\over m}.                              \tag{0.3}
\]

Because `A` is an integer plus `1/4`, the ordinary endpoint lattice is

\[
 r\in\mathbb Z+{1\over4},\qquad
 s\in\mathbb Z+{3\over4},\qquad d\in\mathbb Z_{\geq1}. \tag{0.4}
\]

Put

\[
 R=U_m=2\pi r,\qquad
 V(U)=c(\eta-1)-\eta U,
 \qquad S=V(R)=2\pi s.                               \tag{0.5}
\]

For the endpoint-normalized curved profiles of the frozen two-endpoint
theorem, the compact/exterior scalar and its physical white coefficient
are

\[
 I^c_{mq}(\alpha,\beta)
 =\int_0^R p_\alpha(U)q_\beta(V(U))\,dU,              \tag{0.6}
\]

\[
 B^c_{mq}(\alpha,\beta)
 ={\pi\over2m\sqrt{J_\alpha J_\beta}}
 {1+\chi_\alpha\over\chi_\alpha}
 I^c_{mq}(\alpha,\beta).                             \tag{0.7}
\]

The exact affine geometry is

\[
 P=a_-(U)=2U-{U^2\over c},\qquad
 Q=a_+(V)=2V+{V^2\over c},
 \qquad \boxed{Q=K-\eta^2P},
 \quad K=c(\eta^2-1).                                \tag{0.8}
\]

There is a genuine ordinary-endpoint obstruction to a standalone
one-envelope curved-to-flat lemma for (0.6).  In the flat principal
problem the slow carrier of the truncated convolution contains an
incomplete beta function of size

\[
 {e^{h_0\alpha}\over\alpha+\beta},                   \tag{0.9}
\]

on a sequence of the quarter-lattice pairs with `d=L^M+O(1)`, for any
fixed sufficiently large integer `M`.  The completed beta function has
the additional factor `e^(-h_0 beta)`, but the ordinary truncation does
not.  Hence (0.9) exceeds every fixed-polylogarithmic multiple of the
oriented action `e^(h_0(alpha-beta))`.

On that sequence `m\asymp A`, while modal placement gives
`J_alpha,J_beta\asymp L` and `chi_alpha=1+o(1)`.  Thus the corresponding
flat-principal physical coefficient has size

\[
 {e^{h_0\alpha}\over A L(\alpha+\beta)},             \tag{0.9a}
\]

again larger than its oriented analogue by
`e^(h_0 beta)` up to powers of `L`.

The exact curved all-order counterterm is

\[
 \boxed{
 T^{\rm ord}_{mq}(\alpha,\beta)
 ={1\over\eta}\int_0^{2\pi s}
 p_\alpha\!\left({c(\eta-1)-V\over\eta}\right)
 q_\beta(V)\,dV.}                                    \tag{0.10}
\]

Indeed, if `U_0=c(1-eta^(-1))`, then `V(U_0)=0` and

\[
 I^c_{mq}+T^{\rm ord}_{mq}
 =\int_0^{U_0}p_\alpha(U)q_\beta(V(U))\,dU.          \tag{0.11}
\]

In the flat principal problem, no finite ordinary-endpoint jet can
replace the flat counterpart of (0.10) at the oriented polylogarithmic
accuracy.  Each fixed number of integrations by parts leaves
`e^(h_0 alpha)` times only a fixed inverse power of `L`, whereas
`e^(h_0 beta)=exp(h_0(log L)^4)` beats every such power.  Transferring
this finite-jet no-go to the exact curved kernel would itself require a
one-envelope curved comparison; that transfer is not asserted here.

The physical endpoint cancellation is instead coherent.  It occurs only
after the complete ordered inward sampler, including both `m<=A` and
`m>A`, has been formed.  With

\[
 \mathfrak a_x(t)={\sqrt\lambda\over2}
 C_x(\lambda e^{-t}),\qquad 0\leq t\leq L,           \tag{0.12}
\]

the seven-row space of the forced-prime theorem has

\[
 \boxed{
 \mathfrak a_x(L)={\sqrt\lambda\over2}C_x(\lambda^{-1})
 =\lambda\Gamma_{\rm in}(x)
 =\lambda\Gamma_{\rm out}(x)=0.}                   \tag{0.13}
\]

Thus the hard endpoint of a common profile-level integration by parts
factors through `Gamma_out` and vanishes.  A pairwise carrier integration
by parts does not have this property: its reciprocal phase gap depends on
`(m,q)`, so its endpoint terms no longer factor through the complete row.

The minimal legal analytic target is therefore the coherent Volterra
cross

\[
 \mathsf S(\mathfrak a,\mathcal V_{\mu_D}\mathfrak b),
 \qquad \mu_D=\sum_{n\geq2}{\Lambda(n)\over n}
                 \delta_{\log n}-dr,                \tag{0.14}
\]

formed after the complete ordered row.  The density part must be split
only at that stage: it is exactly
`\mathsf S(\mathcal A_0,\mathcal B_0)`, and it cancels the continuous pole
(or vanishes on the imposed `mathcal A_0=0` row).  This theorem does not
bound (0.14); the frozen moving-discrepancy theorem proves that its
compression is in fact forced at scale `T_L`.

The theorem proves an obstruction and the minimal coherent completion.
It does not assert a new upper bound for the raw curved kernel, a
short-interval prime estimate, a complete central sign, a determinant
conclusion, or RH.  The project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_CURVED_TWO_ENDPOINT_FIO_SHELL_THEOREM.md` | `ddb1769d6e6f2b3214cb8191d631a161a1312f18c5bfbba4ca2ad11bb9f93341` |
| `tests/test_growing_transition_curved_two_endpoint_fio_shell_theorem.py` | `8d6bf688ffc938691789a558900ac95467a6631203f5fd262a5f4356431422cb` |
| `notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md` | `7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564` |
| `tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py` | `caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_EDGE_UNION_MOVING_DIVISOR_REDUCTION_THEOREM.md` | `47dd1decdb3a099cdb15ad929426d293f3f34ccb799b177ae02308c2051fa68c` |
| `tests/test_growing_transition_ordered_prime_edge_union_moving_divisor_reduction_theorem.py` | `6b37ecbf1534d0d140294bb995d0be1ad1da39a185ae4e5ae32bf7aee49fcdb6` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_MOVING_DIVISOR_DENSITY_DISCREPANCY_VOLTERRA_THEOREM.md` | `3c2005552a6c18919f31391d64a33d54be0ce51fc8a9190474fec58b06477f83` |
| `tests/test_growing_transition_ordered_prime_moving_divisor_density_discrepancy_volterra_theorem.py` | `ba54a785c91db4898a4243c99253a540b8ba855e4243eba41836b950398d658e` |

The dependency test below resolves every literal path.  No PNT,
short-interval estimate, zero list, external FIO theorem, or numerical
prolate datum is used.

## 2. Exact mixed geometry and completion

At the hard endpoint, direct substitution gives

\[
\begin{aligned}
 V(R)
 &=c\left({q\over m}-1\right)-{q\over m}\,2\pi r\\
 &=2\pi s.
\end{aligned}                                        \tag{2.1}
\]

The elementary curved identities

\[
 (a_-')^2=4\left(1-{a_-\over c}\right),\qquad
 (a_+')^2=4\left(1+{a_+\over c}\right)              \tag{2.2}
\]

show that affine transport by `V=c(eta-1)-eta U` gives

\[
 a_+(V)=c(\eta^2-1)-\eta^2a_-(U),                   \tag{2.3}
\]

which proves (0.8).  Moreover

\[
 U_0={c(\eta-1)\over\eta},\qquad
 U_0-R={2\pi ms\over q}>0.                           \tag{2.4}
\]

Changing from `U` to `V` on `[R,U_0]` proves (0.10)--(0.11).  This is an
exact identity for the curved profiles.  The added interval lies below
the physical hard endpoint `u=lambda^(-1)`; it is a diagnostic completion,
not a same-sample exterior term and not an authorized enlargement of the
prime form.

## 3. Exact flat carrier coefficient

The regular flat profile is

\[
 w_\gamma(x)=e^{ix}
 {}_1F_1\left({1\over2}-{i\gamma\over4};1;-2ix\right). \tag{3.1}
\]

Put `a_gamma=1/2-i gamma/4`.  Euler's integral, followed by its two
endpoint expansions, gives, uniformly for
`x>=32(1+|gamma|)^3`,

\[
 w_\gamma(x)=c_\gamma x^{-1/2+i\gamma/4}e^{ix}
 +\overline{c_\gamma}x^{-1/2-i\gamma/4}e^{-ix}
 +O\left({L^K|c_\gamma|\over x^{3/2}}\right),        \tag{3.2}
\]

where

\[
 \boxed{
 c_\gamma={(2i)^{-a_\gamma}\over\Gamma(1-a_\gamma)},
 \qquad
 |c_\gamma|^2={1+e^{-2h_0\gamma}\over4\pi}.}        \tag{3.3}
\]

The second identity follows from
`|Gamma(1/2+iy)|^2=pi/cosh(pi y)`.  In particular,

\[
 |c_{-\alpha}c_\beta|\asymp e^{h_0\alpha},          \tag{3.4}
\]

with no factor `e^(-h_0 beta)`.

## 4. The incomplete-beta counterterm

Take the flat principal replacement
`V(U)=D-U`, which retains the intercept `D=R+S=2*pi*d` while replacing
only the exact slope `eta` by its limit one.  This is not the literal
substitution `eta=1` in `c(eta-1)-eta*U`.  Let

\[
 D=R+S=2\pi d,\qquad x={R\over D}={r\over d},
 \quad a={1\over2}-{i\alpha\over4},
 \quad b={1\over2}+{i\beta\over4}.                  \tag{4.1}
\]

The leading slow `+/+` carrier in the truncated flat convolution is

\[
 \boxed{
 c_{-\alpha}c_\beta e^{iD}D^{i(\beta-\alpha)/4}
 B_x(a,b),}                                          \tag{4.2}
\]

up to the uniform carrier remainder in (3.2), where

\[
 B_x(a,b)=\int_0^x t^{a-1}(1-t)^{b-1}\,dt.           \tag{4.3}
\]

The slow `-/-` carrier is the complex conjugate of (4.2).  Since
`D=2*pi*d` with integer `d`, `e^(iD)=1`; hence the complete slow pair is

\[
 \boxed{2\operatorname {Re}\left\{
 c_{-\alpha}c_\beta D^{i(\beta-\alpha)/4}B_x(a,b)
 \right\}.}                                          \tag{4.3a}
\]

All phase alignment below is applied to the paired real quantity (4.3a),
not to one complex carrier in isolation.

Completing the ordinary endpoint replaces `B_x` by `B`.  The exact
counterterm identity is

\[
 \boxed{B_x(a,b)=B(a,b)-B_{1-x}(b,a).}               \tag{4.4}
\]

Stirling's formula gives

\[
 |c_{-\alpha}c_\beta B(a,b)|
 \leq L^K e^{h_0(\alpha-\beta)}.                    \tag{4.5}
\]

By contrast, for `epsilon<=x<=1-epsilon`, a single endpoint-uniform
nonstationary integration by parts gives

\[
\begin{aligned}
 B_x(a,b)
 &= {4i\sqrt{x(1-x)}\over
          \alpha(1-x)+\beta x}
 x^{-i\alpha/4}(1-x)^{i\beta/4}\\
 &\quad+O_\epsilon\left({1\over(\alpha+\beta)^2}
             +e^{-h_0\alpha}L^K\right).
\end{aligned}                                        \tag{4.6}
\]

The exponentially small term in (4.6) is the inherited singular-endpoint
boundary value.  The displayed ordinary endpoint has no exponential
gain.  Equations (3.4) and (4.6) prove the scale (0.9).

## 5. Quarter-lattice lower sequence and finite jets

Let `K` dominate the fixed polynomial carrier losses in (3.2), (4.5),
and (5.3).  After `K` is fixed, choose an integer

\[
 M>\max\{16,2(K+1)\},                                \tag{5.0}
\]

and an integer

\[
 d=L^M+O(1).                                         \tag{5.1}
\]

For all sufficiently large locked schedules, this satisfies
`d<A/L`, so the sequence lies inside the requested near-edge range.

Let `r` range through `Z+1/4` with `d/3<=r<=2d/3`, and put `s=d-r`.
The phase of the complex quantity inside (4.3a), including (4.6), has
derivative

\[
 -{\alpha\over4x}-{\beta\over4(1-x)}                \tag{5.2}
\]

with respect to `x`.  Its total variation across `[1/3,2/3]` is
`Theta(alpha+beta)`, while one lattice step changes it by
`O((alpha+beta)/d)=o(1)`.  Hence some lattice point in every sufficiently
large schedule makes the absolute value of the paired real part in
(4.3a) at least one half of the modulus of one slow carrier.

The remaining two flat carrier products are the fast `+/-` and `-/+`
carriers.  They have phase gap bounded below by a positive constant.
Using (3.2) once by parts, and adding all asymptotic matching remainders,
gives

\[
 O\left({L^Ke^{h_0\alpha}\over\sqrt d}
          +L^Ke^{h_0(\alpha-\beta)}\right),          \tag{5.3}
\]

The choice (5.0) gives `L^K/sqrt(d)=o(L^(-1))`, while
`L^(K+1)e^(-h_0 beta)=o(1)`.  Thus (5.3) is smaller than the paired slow
term (0.9).  Therefore along a quarter-lattice sequence,

\[
 \boxed{
 \left|\int_0^{2\pi r}w_{-\alpha}(U)
              w_\beta(2\pi d-U)\,dU\right|
 \geq {c_\epsilon e^{h_0\alpha}\over\alpha+\beta}.} \tag{5.4}
\]

Since `d^2/A=o(1)`, replacing `2*pi*d-U` by the exact affine flat
argument `c(eta-1)-eta*U` changes the carrier phase and symbol by `o(1)`
on this mesoscopic sequence.  Equation (5.4) is a flat-principal
obstruction.  Promoting it to a lower bound for the exact curved kernel
would require a one-envelope curved comparison; no such promotion is
claimed here.

Within the flat principal problem, repeated integration by parts in
(4.3) produces an ordinary-endpoint symbol with successive fixed inverse
powers of `alpha+beta`.  For every fixed `N`, after subtracting its first
`N` endpoint jets, one can make the same lattice choice away from the
zeros of the next coefficient and the flat remainder has scale

\[
 {e^{h_0\alpha}\over L^{N+1}}.                       \tag{5.5}
\]

Relative to the oriented action this contains
`e^(h_0 beta)/L^(N+1)`, which diverges.  Thus a finite flat-principal jet
cannot replace the flat all-order endpoint counterterm.  No corresponding
statement for the exact curved remainder is made without a separately
proved one-envelope curved comparison.

Finally, (0.11) is only an algebraic completion.  A proof that its exact
curved value has the oriented action would still require a new complete
shell theorem for `eta-1` tending to zero.  The present result neither
assumes nor asserts that theorem.

## 6. Why only the coherent row cancels physically

The exact ordered inward sampler is

\[
 C_x(u)=\sum_{m\geq1}\{f_x+H_x\}(mu).                \tag{6.1}
\]

Its log profile is (0.12).  The frozen trace identities are

\[
 \mathfrak a_x(0)=\Gamma_{\rm in}(x),\qquad
 \mathfrak a_x(L)=\lambda\Gamma_{\rm in}(x),
 \qquad
 \Gamma_{\rm in}-\Gamma_{\rm out}
 ={\sqrt\lambda\over2}\eta_{\rm end}.              \tag{6.2}
\]

On the seven-row space,
`eta_end=Gamma_in=0`, hence (0.13).  If a common primitive
`mathcal R_x(t)` is used after the complete ordered row has been formed,
its hard boundary is exactly

\[
 \mathfrak a_x(L)^*\mathcal R_y(L)
 =\lambda\Gamma_{\rm out}(x)^*\mathcal R_y(L)=0.     \tag{6.3}
\]

For a single pair, carrier integration by parts instead divides by

\[
 \eta\Omega_\beta(Q)-\Omega_\alpha(P),               \tag{6.4}
\]

or by one of the other three pair-dependent phase gaps.  Summing (6.4)
does not reconstruct (6.3).  The same-`m` exterior piece also does not
supply (0.10), because (0.10) lies beyond the physical lower endpoint.

The exact complete prime cross is already known in the coherent form

\[
 Q_{\rm mov}=\mathsf S(\mathfrak a,
                         \mathcal V_\mu\mathfrak b). \tag{6.5}
\]

Only after (6.5) is formed may one write `mu=dr+mu_D`.  Then

\[
 \mathsf S(\mathfrak a,\mathcal V_{dr}\mathfrak b)
 =\mathsf S(\mathcal A_0,\mathcal B_0),              \tag{6.6}
\]

which cancels the continuous pole with the exact factor.  Equations
(6.3), (6.5), and (6.6) define the minimal coherent Volterra gate.  A
termwise split into deterministic and `Lambda-1` coefficients before this
analytic assembly loses both the endpoint factorization and the exact
density cancellation.

## 7. Conclusion

The mixed compact/exterior shell has exact affine geometry, but affine
geometry does not erase an ordinary endpoint.  Its flat slow carrier is
an incomplete beta function.  Completion supplies the desired
`e^(-h_0 beta)` factor; truncation leaves an all-order counterterm of
size `e^(h_0 alpha)` times only algebraic decay.  The quarter lattice does
not cancel it and in fact contains phase-aligned subsequences.

The only exact physical endpoint cancellation currently available is the
complete ordered-row identity `C(lambda^(-1))=0`, which mixes both sides
of the sampler threshold and factors through `Gamma_out`.  Therefore the
next admissible analytic lemma must act on the coherent discrepancy
Volterra cross, not on standalone `B^c_(mq)` entries.
