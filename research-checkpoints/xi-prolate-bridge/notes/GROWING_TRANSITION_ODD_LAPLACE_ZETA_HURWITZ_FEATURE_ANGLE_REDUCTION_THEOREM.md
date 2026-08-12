# Growing-transition odd-Laplace zeta--Hurwitz feature-angle reduction theorem

## 0. Exact result and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi\lambda^2,\qquad
 L=2\log\lambda .                                      \tag{0.1}
\]

Let `f` be an admitted corrected even transition source, supported on
`[-lambda,lambda]`, with the one-sided regularity used below.  Put

\[
 \eta(f)=f(\lambda),\qquad
 \Gamma_{\rm out}(f)={1\over2\sqrt\lambda}
       \sum_{1\leq n<A}f(n/\lambda).                    \tag{0.2}
\]

This note proves an exact physical reduction of the continuous odd-Laplace
gate left open by the common-representative theorem.

1.  The ordered complete inward profile has the exact weighted reflection

    \[
     a_f(L-s)=\lambda e^{-s}a_f(s).                     \tag{0.3}
    \]

    After conjugating by `e^(-s/2)`, it becomes an even centered
    multiplicative theta profile.  On `eta=0`, the outward profile is the
    exterior half of that same centered profile.

2.  The Fourier transform of the centered profile is the symmetrized
    zeta--Mellin product.  Thus the physical restriction is retained; no
    abstract profile class is inserted.

3.  Every ordinary odd row `z=3,5,...` is an explicit cross between a
    generalized-harmonic row and a Hurwitz-zeta tail row.  The powers of
    `lambda` cancel exactly in each cross.  Under

    \[
     f(0)=0,\qquad \int_{\mathbb R}f=0,\qquad \eta(f)=0, \tag{0.4}
    \]

    the inherited `z=0` row is an ordinary convergent row and the exact
    formulas continue through `z=1` and `z=0`.

4.  The bad `z=0` cross can be rewritten as a positive rank-one Gram, one
    explicit finite-part Mellin row, and the all-odd cross.  Complete
    monotonicity gives a positive **block** Gram for the two feature maps,
    but it gives no sign for their off-diagonal cross.

5.  The compact prolate ODE reduces the ordinary moment part to spectral
    polynomials in the separation eigenvalue.  It does not reduce the
    floor-function harmonic rows.  Those rows are the precise coherent
    Bernoulli/Hurwitz lattice frame still requiring a signed theorem.

6.  On the exact double-null space, the high odd rows are asymptotically
    anti-aligned.  If the endpoint derivative row is also nulled, their
    fixed-`lambda` tail has a negative leading Gram.  The error constant is
    not uniform in `lambda`, so this is neither a disproof of the desired
    `o(tau_L)` lower bound nor a license to exchange the high-row and
    growing-transition limits.

The exact remaining statement is a finite-dimensional feature-angle
inequality after exterior-Gram whitening and compression to the realized
local negative subspace.  It is not proved here.  Nulling the finite-part
row or the `z=1` inward row does not prove it.  This package proves no
one-sided sign for the complete continuous sector, no uniform-in-`lambda`
tail estimate, no complete central sign, no Plemelj assembly, no RH
statement, and no Lambda bound.  The project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md` | `7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74` |
| `tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py` | `d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140` |
| `notes/GROWING_TRANSITION_ORDERED_DIRECT_PROFILE_CONTINUATION_TWO_JET_SHEAR_REDUCTION_THEOREM.md` | `e3b1228a1fb22270a01f061c198239f3e60cb00b675da55ddd13420f9929dea3` |
| `tests/test_growing_transition_ordered_direct_profile_continuation_two_jet_shear_reduction_theorem.py` | `7d6e46c302276563cfc88e4826903a344c0937eb29f3645daf473d5ba1917341` |
| `notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md` | `7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564` |
| `tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py` | `caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c` |
| `notes/GROWING_TRANSITION_POLYLOG_BASE_CONTINUOUS_PRIME_SHELL_COROLLARY.md` | `326d4d19a4c7bf93e920f2af1438fb0aba7dc797091bf0957abf9149bca018e1` |
| `tests/test_growing_transition_polylog_base_continuous_prime_shell_corollary.py` | `de07ecbac9c7404edc2508b54d3aa25a15f2d8f102b86199119af65ef9e6a2a7` |

No external source, zero table, prime estimate, or numerical prolate data is
used.

## 2. Centered ordered symmetry

After the ordered unweighted Poisson limit, the complete profiles are

\[
\begin{aligned}
 a_f(s)&={\sqrt\lambda\over2}\sum_{m\geq1}
       f(m\lambda e^{-s})
 +{e^s\over2\sqrt\lambda}\sum_{m\geq1}f(me^s/\lambda),\\
 b_f(t)&={1\over2\sqrt\lambda}\sum_{m\geq1}
       f(me^{-t}/\lambda).
\end{aligned}                                          \tag{2.1}
\]

Substitution of `L=2 log lambda` and interchange of the two sums gives

\[
 \boxed{a_f(L-s)=\lambda e^{-s}a_f(s).}                \tag{2.2}
\]

Define

\[
 g_f(s)=e^{-s/2}a_f(s),\qquad
 \Theta_f(u)=g_f(L/2+u).                               \tag{2.3}
\]

Then

\[
 \boxed{g_f(L-s)=g_f(s),\qquad \Theta_f(-u)=\Theta_f(u),} \tag{2.4}
\]

and direct substitution gives the physical theta series

\[
 \boxed{
 \Theta_f(u)={1\over2}\left\{
 e^{-u/2}\sum_{m\geq1}f(me^{-u})
 +e^{u/2}\sum_{m\geq1}f(me^u)\right\}.}             \tag{2.5}
\]

On `eta(f)=0`, ordered continuation gives

\[
 b_f(t)={a_f(L+t)\over\lambda}
        =e^{t/2}g_f(-t)=e^{t/2}\Theta_f(t+L/2).       \tag{2.6}
\]

For `q_z=z-1/2`, the exact rows therefore become

\[
\boxed{
\begin{aligned}
 \mathcal A_z(f)
 &=e^{-q_zL/2}\int_{-L/2}^{L/2}
       \Theta_f(u)e^{-q_zu}\,du,\\
 \mathcal B_z(f)
 &=e^{q_zL/2}\int_{L/2}^{\infty}
       \Theta_f(u)e^{-q_zu}\,du.
\end{aligned}}                                         \tag{2.7}
\]

If also `Gamma_out(f)=0`, then

\[
 \Theta_f(-L/2)=\Theta_f(L/2)=0.                      \tag{2.8}
\]

Equation (2.8) is only a two-point trace statement.  It does not set any
row in (2.7) to zero.

## 3. Exact zeta--Mellin spectrum

Put

\[
 \Upsilon_f(u)=e^{u/2}\sum_{m\geq1}f(me^u),\qquad
 M_f(s)=\int_0^\lambda f(x)x^{s-1}\,dx.              \tag{3.1}
\]

Then `Theta_f=(Upsilon_f(u)+Upsilon_f(-u))/2`.  In the
initial absolute-convergence half-plane, the substitution `x=me^u` gives

\[
 \int_{\mathbb R}\Upsilon_f(u)e^{(s-1/2)u}\,du
 =\zeta(s)M_f(s).                                     \tag{3.2}
\]

Under (0.4), the pole at `s=1` is removed by `M_f(1)=0`; the endpoint and
origin nulls give the decay needed to continue (3.2) to the critical line.
Thus, with the Fourier convention
`widehat Theta(xi)=int Theta(u)e^(-i xi u)du`, one has

\[
\boxed{
 \widehat\Theta_f(\xi)={1\over2}\left\{
 \zeta(\tfrac12-i\xi)M_f(\tfrac12-i\xi)
 +\zeta(\tfrac12+i\xi)M_f(\tfrac12+i\xi)
 \right\}.}                                          \tag{3.3}
\]

For a real source the second summand is the conjugate of the first.  This
identity is the physical source constraint missing from an abstract
profile countermodel.  It still supplies no sign after the central and
exterior restrictions in (2.7).

## 4. Generalized-harmonic and Hurwitz rows

For `1/lambda<=u<=lambda`, put

\[
 N(u)=\lfloor\lambda u\rfloor,\qquad
 H_N^{(z)}=\sum_{m=1}^Nm^{-z},\qquad
 P_N^{(z-1)}=\sum_{m=1}^Nm^{z-1}.                     \tag{4.1}
\]

Define the three source rows

\[
\begin{aligned}
 m_z(f)&=\int_0^\lambda f(u)u^{z-1}\,du,\\
 t_z(f)&=\int_{1/\lambda}^{\lambda}
       f(u)u^{z-1}H_{N(u)}^{(z)}\,du,\\
 p_z(f)&=\int_{1/\lambda}^{\lambda}
       f(u)u^{-z}P_{N(u)}^{(z-1)}\,du.
\end{aligned}                                          \tag{4.2}
\]

Mellin swapping in the inward branch gives

\[
 T_A(f;z)=\lambda^{-z}t_z(f),\qquad
 T_A(f;1-z)=\lambda^{z-1}p_z(f).                      \tag{4.3}
\]

Substitution in the exact ordered formulas proves, for `Re z>1`,

\[
\boxed{
 \mathcal A_z={\lambda^{1/2-z}\over2}(t_z+p_z),\qquad
 \mathcal B_z={\lambda^{z-1/2}\over2}
       \{\zeta(z)m_z-t_z\}.}                         \tag{4.4}
\]

The second row is explicitly a Hurwitz tail:

\[
\begin{aligned}
 \zeta(z)m_z-t_z={}&
 \zeta(z)\int_0^{1/\lambda}f(u)u^{z-1}\,du\\
 &+\int_{1/\lambda}^{\lambda}f(u)u^{z-1}
       \zeta(z,N(u)+1)\,du.
\end{aligned}                                         \tag{4.5}
\]

Consequently every ordinary odd cross has the scale-free exact form

\[
 \boxed{
 \mathsf S(\mathcal A_z,\mathcal B_z)
 ={1\over4}\mathsf S(t_z+p_z,\zeta(z)m_z-t_z),
 \qquad z=3,5,\ldots .}                               \tag{4.6}
\]

The positive weights in (4.2)--(4.5) do not make the source integrals
positive.  They act on oscillatory prolate combinations.  Moreover, at
each lattice point `u=n/lambda`, the dominant jumps of the `A_z` and `B_z`
weights have opposite signs.  Hence no source-independent positive scalar
relation `B_z=c_z A_z` follows from these formulas.

## 5. The ordinary low rows

Assume (0.4) and enough one-sided `C^2` regularity.  The endpoint null makes
the Fourier transform of the zero extension `O(y^(-2))`; hence
`b_f(t)=O_f(e^(-t))`.  Thus `B_z` is analytic for `Re z>-1`.  The pole of
`zeta(z)m_z` at one is removable because `m_1=0`, so (4.4) continues to
`z=1` and `z=0` and agrees with the inherited ordinary or Abel row.

Write

\[
\begin{aligned}
 m_0&=\int_0^\lambda {f(u)\over u}\,du,
 &m'_1&=\int_0^\lambda f(u)\log u\,du,\\
 t_0&=\int_{1/\lambda}^{\lambda}
       {f(u)N(u)\over u}\,du,
 &t_1&=\int_{1/\lambda}^{\lambda}
       f(u)H_{N(u)}^{(1)}\,du.
\end{aligned}                                          \tag{5.1}
\]

Since `p_1=t_0`, `p_0=t_1`, and `zeta(0)=-1/2`, one obtains

\[
\boxed{
\begin{aligned}
 \mathcal A_1&={t_1+t_0\over2\sqrt\lambda},
 &\mathcal A_0&={\sqrt\lambda\over2}(t_0+t_1)
                 =\lambda\mathcal A_1,\\
 \mathcal B_1&={\sqrt\lambda\over2}(m'_1-t_1),
 &\mathcal B_0&={1\over2\sqrt\lambda}
                 \left(-{m_0\over2}-t_0\right).
\end{aligned}}                                         \tag{5.2}
\]

In particular, neither `eta=0` nor `Gamma_out=0` kills `A_0` or `B_0`.
The complete continuous matrix is exactly

\[
\boxed{
\begin{aligned}
 Q_{\rm cont}={}&{1\over4}
 \mathsf S(t_0+t_1,{m_0\over2}+t_0)\\
 &+{1\over4}\sum_{z=3,5,\ldots}
 \mathsf S(t_z+p_z,\zeta(z)m_z-t_z).
\end{aligned}}                                         \tag{5.3}
\]

Equation (5.3), after exact source synthesis, exterior-Gram whitening, and
compression, is the promised finite matrix with an absolutely convergent
odd-row representation.  It is a reduction, not a lower bound.

## 6. Finite-part row and difference of feature Grams

Define the finite-part Mellin row

\[
 \varphi_0(f)=-{1\over4}m_0(f)+{1\over2}m'_1(f).      \tag{6.1}
\]

The bilateral `q=1/2` moment of the even profile is exactly

\[
 \int_{\mathbb R}\Theta_f(u)e^{-u/2}\,du=\varphi_0(f). \tag{6.2}
\]

Splitting that integral into the central interval and its two exterior
halves gives

\[
 \varphi_0=\sqrt\lambda(\mathcal A_1+\mathcal B_0)
             +\lambda^{-1/2}\mathcal B_1,             \tag{6.3}
\]

or

\[
 \boxed{\mathcal B_0=\lambda^{-1/2}\varphi_0
       -\mathcal A_1-\lambda^{-1}\mathcal B_1.}       \tag{6.4}
\]

Let the all-odd feature maps be

\[
 \mathscr A f=(\mathcal A_1f,\mathcal A_3f,\ldots),
 \qquad
 \mathscr B f=(\mathcal B_1f,\mathcal B_3f,\ldots).   \tag{6.5}
\]

Substitution of (6.4) in the odd-Laplace matrix gives

\[
\boxed{
 Q_{\rm cont}=2\lambda\mathcal A_1^*\mathcal A_1
 -\sqrt\lambda\,\mathsf S(\mathcal A_1,\varphi_0)
 +\mathscr A^*\mathscr B+\mathscr B^*\mathscr A.}    \tag{6.6}
\]

Equivalently,

\[
\begin{aligned}
 Q_{\rm cont}={}&
 \left(\sqrt{2\lambda}\mathcal A_1-{\varphi_0\over\sqrt2}\right)^*
 \left(\sqrt{2\lambda}\mathcal A_1-{\varphi_0\over\sqrt2}\right)
 -{1\over2}\varphi_0^*\varphi_0\\
 &+{1\over2}\left\{
 (\mathscr A+\mathscr B)^*(\mathscr A+\mathscr B)
 -(\mathscr A-\mathscr B)^*(\mathscr A-\mathscr B)
 \right\}.
\end{aligned}                                         \tag{6.7}
\]

The all-odd kernel in centered coordinates is

\[
 {e^{r/2}\over\sinh r}
 =2\sum_{\nu\geq0}e^{-(2\nu+1/2)r},                 \tag{6.8}
\]

which is completely monotone.  Formula (6.7) shows exactly why that fact
does not prove positivity: it produces the positive `2 by 2` block Gram of
`(mathscr A,mathscr B)`, while the desired object is its off-diagonal
Hermitian cross.

Imposing `A_1=0` costs one row and kills both `A_0` and the `z=1` cross.
Imposing `varphi_0=0` costs one row and removes the negative finite-part
square in (6.7).  Either operation still leaves the signed feature angle.

## 7. What the compact prolate equation reduces

Let `h_n` be an uncorrected plus-phase compact prolate mode, let
`H_n=chi_n h_n` on the band, put `k=2 pi lambda`, and write its separation
eigenvalue as

\[
 \mu_n=c^2-c\gamma_n.                                  \tag{7.1}
\]

For

\[
 m_z(n)=\int_0^\lambda h_n(u)u^{z-1}\,du,             \tag{7.2}
\]

the finite-Fourier relation at zero gives

\[
 \boxed{m_1(n)={\chi_n h_n(0)\over2}.}                 \tag{7.3}
\]

The compact prolate equation

\[
 \{(\lambda^2-u^2)h_n'(u)\}'
 +(\mu_n-k^2u^2)h_n(u)=0                              \tag{7.4}
\]

and two integrations by parts give, for odd `z>=1`,

\[
\boxed{
 k^2m_{z+2}(n)=\{\mu_n-z(z-1)\}m_z(n)
 +(z-1)(z-2)\lambda^2m_{z-2}(n).}                    \tag{7.5}
\]

At `z=1` the last term is absent and evenness kills the origin boundary.
For a source-null modal combination `x`, (7.1) and (7.5) give the exact
example

\[
 \sum_nm_1(n)x_n=0
 \quad\Longrightarrow\quad
 \sum_nm_3(n)x_n=-{1\over2\pi}
       \sum_n\gamma_nm_1(n)x_n.                       \tag{7.6}
\]

Thus the ordinary moment rows form a spectral-polynomial Krylov family.
Source nulling kills its common constant component, not the higher
`gamma` moments.

Equation (7.5) applies only to uncorrected prolate modes.  The admitted
source has the fixed invisible origin correction

\[
 f=g-g(0)\psi(2\lambda\,\cdot).                       \tag{7.7}
\]

The correction is supported in `|u|<1/(2lambda)`.  It therefore changes
the `m_z` rows by explicit moments but changes neither `t_z` nor `p_z`,
whose integrals begin at `1/lambda`.  The finite-part row `m_0` must be
formed from the corrected source as a whole; splitting its two origin
pieces separately would create divergent integrals.  Most importantly,
the recurrence does not close the floor rows `t_z,p_z`.  Modal placement,
`chi_n to 1`, and endpoint radial normalization do not supply their signed
frame estimate.

## 8. Exact high-odd anti-alignment

Assume now

\[
 \eta(f)=\Gamma_{\rm out}(f)=0,\qquad
 \kappa(f)=f'(\lambda-).                               \tag{8.1}
\]

Differentiating the complete profiles at the corner gives the growing
lattice derivative row

\[
 \boxed{
 J_L(f):=b_f'(0)=-{1\over2\sqrt\lambda}
 \sum_{1\leq n<A}{n\over\lambda}f'(n/\lambda),}       \tag{8.2}
\]

At fixed `lambda` this sum is finite, but on the locked odd-half-integer
schedule it has exactly `(p^2-1)/4=A+O(1)` entries.  Thus `J_L` is a
growing interior-lattice derivative row, not a fixed finite endpoint row
available for cost-free nulling across the transition.

and

\[
 \boxed{a_f'(0)=-{\lambda^{3/2}\over2}\kappa(f)-J_L(f).} \tag{8.3}
\]

At each fixed `lambda`, repeated Laplace integration by parts gives, as
real `z` tends to infinity,

\[
 \mathcal A_z={a_f'(0)\over z^2}+O_\lambda(z^{-3}),
 \qquad
 \mathcal B_z={J_L(f)\over z^2}+O_\lambda(z^{-3}).     \tag{8.4}
\]

For row maps on any fixed finite coefficient packet, put

\[
 C_N=\sum_{\nu\geq N}{1\over(2\nu+1)^4}
 ={1\over16}\zeta(4,N+\tfrac12)
 ={1\over6(2N+1)^3}+{1\over2(2N+1)^4}+O(N^{-5}).     \tag{8.5}
\]

Summing (8.4) yields, in fixed-`lambda` operator norm,

\[
\boxed{
\begin{aligned}
 \sum_{\nu\geq N}
 \mathsf S(\mathcal A_{2\nu+1},\mathcal B_{2\nu+1})
 =C_N\left\{-{\lambda^{3/2}\over2}\mathsf S(\kappa,J_L)
             -2J_L^*J_L\right\}
 +O_\lambda(N^{-4}).
\end{aligned}}                                         \tag{8.6}
\]

In particular, on `kappa=0`, the leading tail is

\[
 -2C_NJ_L^*J_L.                                       \tag{8.7}
\]

The scalar identity

\[
 \sum_{\nu\geq1}(2\nu+1)^{-4}={\pi^4\over96}-1       \tag{8.8}
\]

is only a diagnostic for the fourth-power sequence.  Formula (8.6) is an
asymptotic large-row statement and must not be evaluated by setting `N=1`.
Its remainder may grow with `lambda`, and no estimate here makes it
`o(tau_L)`.  Thus (8.6) rules out a positivity proof from high-row complete
monotonicity, but it does not disprove the desired whole continuous bound.

## 9. Minimal signed feature-angle gate

Let `D` be the exact exterior source Gram, use Moore--Penrose whitening on
its support, and let `E` be a realized subspace of the local negative
packet after the chosen finite source and endpoint rows are imposed.  Put

\[
 \tau_L={c^{hC+o(1)}\over L^{2m}}.                    \tag{9.1}
\]

Write hats for the whitened rows compressed to `E`.  Equations (6.6)--(6.7)
show that the desired one-sided lemma is exactly the Gram dominance

\[
\boxed{
\begin{aligned}
 &{1\over2}\widehat\varphi_0^*\widehat\varphi_0
 +{1\over2}(\widehat{\mathscr A}-\widehat{\mathscr B})^*
             (\widehat{\mathscr A}-\widehat{\mathscr B})\\
 &\quad\preceq
 \left(\sqrt{2\lambda}\widehat{\mathcal A}_1
       -{\widehat\varphi_0\over\sqrt2}\right)^*
 \left(\sqrt{2\lambda}\widehat{\mathcal A}_1
       -{\widehat\varphi_0\over\sqrt2}\right)\\
 &\qquad+{1\over2}(\widehat{\mathscr A}+\widehat{\mathscr B})^*
             (\widehat{\mathscr A}+\widehat{\mathscr B})
 +o(\tau_L)P_E.
\end{aligned}}                                         \tag{9.2}
\]

If `A_1=varphi_0=0` is imposed, (9.2) reduces to the minimal feature-angle
statement

\[
 \boxed{
 \|(\widehat{\mathscr A}-\widehat{\mathscr B})x\|^2
 \leq\|(\widehat{\mathscr A}+\widehat{\mathscr B})x\|^2
       +o(\tau_L)\|x\|^2,\qquad x\in E.}             \tag{9.3}
\]

Equivalently,

\[
 P_E(\widehat{\mathscr A}^{\,*}\widehat{\mathscr B}
 +\widehat{\mathscr B}^{\,*}\widehat{\mathscr A})P_E
 \succeq-o(\tau_L)P_E.                                \tag{9.4}
\]

The exact rows in (4.2)--(4.6) make (9.2) a concrete finite
zeta--Hurwitz/prolate matrix inequality, not an abstract BV condition.
No frozen theorem proves (9.2), and (8.6) shows that its high-row portion
is not automatically favorable.  The continuous sector may or may not be
the forced same-scale canceller; the ordered non-`(1,1)` prime assembly
remains the other exact alternative.  No further conclusion is licensed.
