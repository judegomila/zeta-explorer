# Adaptive Gonek exact-carrier singleton `PW1` theorem

## 0. Exact outcome and claim boundary

Assume RH.  Put

\[
 \mathscr L_U={1\over2\pi}\log {U\over2\pi},
 \qquad
 W(x)=1-\left({\sin \pi x\over\pi x}\right)^2.       \tag{0.1}
\]

Gonek's correctly normalized zero-sampled second moment and an exact
dyadic subtraction imply the following.  Fix `x=1/4`.  For every
sufficiently large dyadic parameter `Y`, some zero ordinate
`gamma_Y in (Y,2Y]`, counted with its algebraic multiplicity, has

\[
 t_Y=\gamma_Y+{x\over\mathscr L_{2Y}},
 \qquad
 \left|\zeta\left({1\over2}+it_Y\right)\right|^2
 \geq {W(1/4)\over2}\log Y,
 \qquad
 W(1/4)=1-{8\over\pi^2}>0.                           \tag{0.2}
\]

Apply the frozen adaptive exact-carrier inverse to `t_Y`.  It gives an
integer `N>=0` and a real `L`, with `h=2*pi/L`, such that

\[
 t_Y=(N+1)h,
 \qquad
 N=e^{L/2}L^3+O(L),
 \qquad
 {L\over\log t_Y}\longrightarrow2.                 \tag{0.3}
\]

The selected zero then has the exact carrier coordinate

\[
 y_Y={t_Y-\gamma_Y\over h}
 =x{L\over\log(2Y/(2\pi))}\longrightarrow {1\over2}. \tag{0.4}
\]

Choose one fixed admissible even microscopic profile which equals one
near `y=+/-1/2`.  On the singleton carrier block `J={N+1}`, the selected
zero alone gives

\[
 S_{N+1}^{\rm ph}\geq
 {\sin^2(\pi y_Y)\over y_Y^2}=4+o(1).               \tag{0.5}
\]

Consequently, for every fixed `kappa<4`, all sufficiently large members
of this cofinal adaptive sequence satisfy the exact hypothesis

\[
 \boxed{
 {\sf PW1}(J):\quad
 \mathcal R_J^{\rm ph}
 \geq\kappa\sum_{j\in J}|Z_j|^2,
 \qquad J=\{N+1\}.}                                 \tag{0.6}
\]

The Gonek lower bound makes the Hardy source at the carrier nonzero.  The
profile is the compact physical profile in the adjacent-cutoff theorem;
there is no passage here through the Fourier-compact auxiliary statistic
of the fixed-grid explicit-formula note.

This closes `PW1` only on a cofinal **adaptive** exact-carrier `p=1`
sequence with `N=e^(L/2)L^3+O(L)`.  It is not a theorem for the literal
rule `N=ceil(e^(L/2)L^3)`, not a uniform theorem for a prescribed locked
origin, and not an estimate for the global four-channel prime/divisor
shifted convolution.  It proves no endpoint-frame hypothesis `NY`, no
actual finite-prolate Stokes transfer, and no synchronization with the
finite strict gates.  It therefore proves no `eta_N^pr` decay, no new
zeta-zero theorem, no RH implication or converse, and no
de Bruijn--Newman `Lambda` bound.  The formal state remains
`P0_INVALIDATED`.

## 1. Frozen internal inputs and external source

Exactly two frozen internal theorem/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/ADAPTIVE_EXACT_CARRIER_GEVREY_SCHEDULE_FINITE_GATE_BARRIER.md | ecfb29e9e95bb031b95abb27e2eac97c1f466b84a795335a4645d0a6c9cb668f |
| tests/test_adaptive_exact_carrier_gevrey_schedule_finite_gate_barrier.py | e2ed609e22ec3f81c53c237f9dfd73d972cc0963ad74fd5943222110d192198d |
| notes/ADJACENT_CUTOFF_PHASE_ALIAS_AGGREGATE_REDUCTION_BARRIER.md | 2afaba5a1fca497a6aa28ba1ab41b66736002b1eaece49035059f5c96e0a2a87 |
| tests/test_adjacent_cutoff_phase_alias_aggregate_reduction_barrier.py | d4ea9d9fd2ae5e6ff841f8963932bce56f37a9569ba4a3d918be5879f0757b97 |

The first pair supplies the exact integer carrier inverse and the
`N=e^(L/2)L^3+O(L)` analytic schedule.  The second supplies the exact
definition of `PW1`, the microscopic profile, the adjacent endpoint and
Cauchy recurrences, and the weighted aggregate inequality.

The only external input is Corollary 2 of S. M. Gonek,
[*Mean values of the Riemann zeta-function and its derivatives*](https://www.sas.rochester.edu/mth/people/faculty/gonek-steve/assets/pdf/5-mvzdrvs.pdf),
Invent. Math. 75 (1984), 123--141.  It is a primary, external, unvendored,
and nonbinding source.  No numerical zero table or prime table is used.

## 2. Gonek's normalization and the dyadic subtraction

Let every nontrivial zero be counted with algebraic multiplicity.  Gonek's
Corollary 2 says, under RH, that

\[
 \boxed{
 \sum_{1\leq\gamma\leq U}
 \left|\zeta\left({1\over2}
       +i\left(\gamma+{a\over\mathscr L_U}\right)\right)\right|^2
 =W(a){U\over2\pi}\log^2U+O(U\log U).}             \tag{2.1}
\]

The error constant is independent of the real parameter `a` in the
stated range `|a|<mathscr L_U/2`.  Only fixed bounded values of `a` are
used below.

Fix a nonzero real `x`; later `x=1/4`.  Define

\[
 \delta_Y={x\over\mathscr L_{2Y}},
 \qquad
 a_Y=x{\mathscr L_Y\over\mathscr L_{2Y}}.           \tag{2.2}
\]

The two shifts are exactly the same:

\[
 {a_Y\over\mathscr L_Y}
 ={x\over\mathscr L_{2Y}}=\delta_Y.                \tag{2.3}
\]

Apply (2.1) at `U=2Y` with parameter `x`, and at `U=Y` with parameter
`a_Y`, then subtract.  This is an exact subtraction of the same summand,
not a comparison of two nearby shifts:

\[
 \begin{aligned}
 &\sum_{Y<\gamma\leq2Y}
 \left|\zeta\left({1\over2}
       +i(\gamma+\delta_Y)\right)\right|^2\\
 &\quad={Y\over2\pi}
 \{2W(x)\log^2(2Y)-W(a_Y)\log^2Y\}
 +O(Y\log Y).
 \end{aligned}                                      \tag{2.4}
\]

Since

\[
 a_Y=x+O_x((\log Y)^{-1}),
 \qquad
 W(a_Y)=W(x)+O_x((\log Y)^{-1}),                   \tag{2.5}
\]

equation (2.4) becomes

\[
 \boxed{
 \sum_{Y<\gamma\leq2Y}
 \left|\zeta\left({1\over2}
       +i(\gamma+\delta_Y)\right)\right|^2
 =W(x){Y\over2\pi}\log^2Y+O_x(Y\log Y).}          \tag{2.6}
\]

The Riemann--von Mangoldt formula, with the same algebraic-multiplicity
convention, gives

\[
 \mathcal N(2Y)-\mathcal N(Y)
 ={Y\over2\pi}\log Y+O(Y).                        \tag{2.7}
\]

For `x!=0`, `W(x)>0`.  Dividing (2.6) by (2.7) proves that at least one
`gamma_Y in (Y,2Y]` satisfies

\[
 \left|\zeta\left({1\over2}
       +i(\gamma_Y+\delta_Y)\right)\right|^2
 \geq\{W(x)+O_x((\log Y)^{-1})\}\log Y.            \tag{2.8}
\]

For `x=1/4`, (0.2) follows for all sufficiently large `Y`.  Taking, for
example, `Y=2^k` makes the selected ordinates and target heights cofinal.

## 3. Exact adaptive integer carrier

Put `t_Y=gamma_Y+delta_Y`.  The adaptive theorem applies once `Y` is
large.  For clarity, its construction starts from the unique real
`ell>=1` satisfying

\[
 t_Y=2\pi\left(e^{\ell/2}\ell^2+{1\over\ell}\right),
 \qquad
 m_*={t_Y\ell\over2\pi}=e^{\ell/2}\ell^3+1.         \tag{3.1}
\]

Choose a nearest integer `m` to `m_*` and define

\[
 L={2\pi m\over t_Y},
 \qquad
 N=m-1,
 \qquad
 h={2\pi\over L}.                                  \tag{3.2}
\]

Then `m=N+1` is a positive integer for large `Y`, and

\[
 \boxed{t_Y=mh={2\pi(N+1)\over L}.}                 \tag{3.3}
\]

The frozen exact schedule-error formula implies

\[
 \left|N-e^{L/2}L^3\right|
 \leq {L\over4}+1+o(1),                             \tag{3.4}
\]

and its scale audit gives

\[
 L=2\log t_Y-4\log\log t_Y+O(1),
 \qquad
 {L\over\log t_Y}\longrightarrow2.                \tag{3.5}
\]

Because `Y<gamma_Y<=2Y` and `delta_Y=o(1)`, one also has

\[
 {\log t_Y\over\log(2Y/(2\pi))}\longrightarrow1.  \tag{3.6}
\]

No ceiling identity has been used: (3.2) is the adaptive nearest-integer
construction, and (3.4) is an `O(L)` perturbation of the `p=1` schedule.

## 4. The selected zero lands at half a carrier cell

At the exact carrier `t_m=t_Y`, define the selected zero coordinate

\[
 y_Y={t_m-\gamma_Y\over h}.                         \tag{4.1}
\]

Equations (2.2), (3.2), (3.5), and (3.6) give the exact identity and
limit

\[
 \boxed{
 y_Y={\delta_YL\over2\pi}
 =x{L\over\log(2Y/(2\pi))}\longrightarrow2x.}      \tag{4.2}
\]

With `x=1/4`, `y_Y->1/2`.  In particular, for all sufficiently large
`Y`, `y_Y` is not an integer.  Since

\[
 {\gamma_Y\over h}=m-y_Y,                           \tag{4.3}
\]

the selected ordinate is a noncarrier row and belongs to the set
`Gamma` in the adjacent-cutoff theorem.

The exact carrier phase is

\[
 \sin^2\left({\gamma_YL\over2}\right)
 =\sin^2(\pi y_Y).                                  \tag{4.4}
\]

There is no asymptotic replacement in (4.4).

## 5. Singleton compact-profile `PW1`

Fix constants `0<a<1/2<b<1`.  Choose one even smooth function `u` with

\[
 0\leq u\leq1,
 \qquad
 \operatorname {supp}u\subset\{y:a<|y|<b\},
 \qquad
 u(y)=1\quad\hbox{near }y=\pm{1\over2}.             \tag{5.1}
\]

For the singleton block `J={m}`, put

\[
 u_{m,\gamma}=u\left({t_m-\gamma\over h}\right),
 \qquad
 u_{j,\gamma}=0\quad(j\notin J).                  \tag{5.2}
\]

This is an admissible compact physical microscopic profile.  Its pair
overlap constant obeys `B_u<=1`, because only one carrier index can carry
a nonzero weight.

For all sufficiently large `Y`, the selected zero has `u(y_Y)=1`.
Algebraic multiplicity is at least one, all other summands are
nonnegative, and hence

\[
 \begin{aligned}
 S_m^{\rm ph}
 &=\sum_{\gamma\in\Gamma}m_\gamma u_{m,\gamma}
 {\sin^2(\pi y_{m,\gamma})\over y_{m,\gamma}^2}\\
 &\geq m_{\gamma_Y}{\sin^2(\pi y_Y)\over y_Y^2}
 \geq {\sin^2(\pi y_Y)\over y_Y^2}
 =4+o(1).
 \end{aligned}                                      \tag{5.3}
\]

For the Hardy--Xi source, the gamma/polynomial envelope divided out in
`f_m=A_mZ_m` is positive at `t_Y`.  Equation (0.2) therefore gives
`Z_m!=0`.  For every fixed `kappa<4`, (5.3) now yields

\[
 \begin{aligned}
 \mathcal R_J^{\rm ph}
 &=|Z_m|^2S_m^{\rm ph}\\
 &\geq\kappa|Z_m|^2
 =\kappa\sum_{j\in J}|Z_j|^2,
 \end{aligned}                                      \tag{5.4}
\]

which is exactly `PW1(J)`, not an auxiliary analytic-profile analogue.

More generally, if a prescribed nonzero smooth profile is positive at a
noninteger point `y_0`, the same argument with `x=y_0/2` gives the
positive limiting constant

\[
 u(y_0){\sin^2(\pi y_0)\over y_0^2}.               \tag{5.5}
\]

The choice `y_0=1/2` is used here because it gives the clean constant
four.

## 6. What remains: one two-endpoint anti-cancellation bound

For `J={m}`, the exact adjacent endpoint recurrence is

\[
 Z_m=e_m+r_me_{m+1},
 \qquad
 r_m={A_{m+1}\over A_m}>0.                          \tag{6.1}
\]

Because `Z_m!=0`, the positivity part of `NY(J)` is automatic:

\[
 |e_m|^2+|e_{m+1}|^2>0.                             \tag{6.2}
\]

The only missing singleton endpoint-frame input is an upper bound.  The
weakest envelope-matched version needed by the weighted aggregate theorem
is

\[
 \boxed{
 |e_m|^2+r_m^2|e_{m+1}|^2
 \leq C_E(L)|Z_m|^2.}                               \tag{6.3}
\]

It does not follow from (6.1).  Indeed, for `Z_m=1`, any real `M` is
compatible with

\[
 e_m=M,
 \qquad
 e_{m+1}={1-M\over r_m},                            \tag{6.4}
\]

and the left side of (6.3) tends to infinity with `|M|`.

The weighted adjacent theorem and `B_u<=1` give

\[
 A_m^2D_m^{\rm id}+A_{m+1}^2D_{m+1}^{\rm id}
 \geq {\kappa\over18}h^{-2}A_m^2|Z_m|^2.           \tag{6.5}
\]

If (6.3) holds, comparison of the two nonnegative weighted sums selects
`n in {m,m+1}` with

\[
 {D_n^{\rm id}\over|e_n|^2}
 \geq {\kappa\over18C_E(L)}h^{-2},                 \tag{6.6}
\]

unless an endpoint-zero row already gives the separate zero-endpoint
success.  A uniform `C_E(L)=O(1)` gives the desired squared-logarithmic
ideal gain.  For mere divergence of the ideal quotient, the strictly
weaker condition

\[
 C_E(L)=o(L^2)                                      \tag{6.7}
\]

would suffice.

There is an even weaker dyadic selection formulation.  Construct the
adaptive carrier separately for every shifted zero in `(Y,2Y]`.  It is
enough to prove the summed endpoint-frame estimate

\[
 \sum_{Y<\gamma\leq2Y}m_\gamma
 A_{m(\gamma)}^2
 \{|e_{m(\gamma)}|^2+r_{m(\gamma)}^2
                 |e_{m(\gamma)+1}|^2\}
 \leq C
 \sum_{Y<\gamma\leq2Y}m_\gamma
 A_{m(\gamma)}^2|Z_{m(\gamma)}|^2.                 \tag{6.8}
\]

When the right side is nonzero, weighted pigeonholing selects one member
with (6.3).  Formula (6.8) is weaker than a pointwise endpoint frame, but
it is not a consequence of Gonek's scalar shifted moment.  Proving it for
the complete two-branch Hardy approximate functional equation and the
one-sided alternating multiplier remains new arithmetic analysis.

## 7. Stopping line

The fixed-grid prime/divisor barrier is bypassed only for the existential
singleton `PW1` statement: a zero is selected first by Gonek, its nearby
nonzero Hardy value is made an exact carrier, and its own positive row
proves `PW1`.  No sign of a Poisson alias or shifted convolution is needed
for that cofinal adaptive construction.

Three independent obligations remain.

1. Prove the singleton bound (6.3), or the weaker dyadic bound (6.8), for
   the actual normalized alternating Hardy--Xi tail.
2. Transfer the ideal endpoint and row pair through the actual
   finite-`lambda` Stokes/operator interface with relative errors.
3. Put the cutoff selected from `{m,m+1}` at the same parameter as the
   simple-ground, boundary, shifted-sign, denominator, and reserve gates.

Neither Gonek's theorem, the adaptive carrier inverse, nor singleton
`PW1` proves any of these.  In particular, this pair creates no literal
ceiling schedule, no actual finite gate, no gate-restricted arithmetic
winner, and no checkpoint-level RH conclusion.
