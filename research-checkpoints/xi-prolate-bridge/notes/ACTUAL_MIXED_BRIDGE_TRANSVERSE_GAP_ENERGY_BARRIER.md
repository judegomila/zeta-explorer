# Actual mixed-bridge transverse gap and energy barrier

## 0. Outcome and exact claim boundary

Work in the odd physical sector and retain the actual complete-source sign.
Let

\[
 Q_-=H_--2|p_\lambda\rangle\langle p_\lambda|,
 \qquad M=\|p_\lambda\|^2,
 \qquad e={p_\lambda\over\sqrt M}.                   \tag{0.1}
\]

Suppose that the live eigenvalue is on the nonexceptional pole-created
branch

\[
 \mu<a_1:=\inf\sigma(H_-),
 \qquad 2\langle p_\lambda,(H_--\mu)^{-1}p_\lambda\rangle=1.
                                                               \tag{0.2}
\]

Put

\[
 P_\perp=I-|e\rangle\langle e|,
 \qquad B_\mu=P_\perp(H_--\mu)P_\perp|_{e^\perp},
 \qquad \kappa=\inf\sigma(B_\mu).                  \tag{0.3}
\]

If `g` is the normalized loaded odd ground, `gamma` is the loaded odd
gap, and `alpha=|<e,g>|`, then the exact transverse-gap comparison is

\[
 \boxed{\max\{a_1-\mu,\gamma\alpha^2\}
        \leq\kappa\leq\gamma.}                       \tag{0.4}
\]

The Birman--Schwinger normalization is also exact.  With the notation of
Section 3,

\[
 \boxed{1+\|B_\mu^{-1}r\|^2
       =\alpha^{-2}=4M F'(\mu),
 \qquad F(z)=\langle p_\lambda,(H_--z)^{-1}p_\lambda\rangle.}
                                                               \tag{0.5}
\]

For the raw odd bridge `w=w_lambda`, put

\[
 x={\beta_\lambda\over\sqrt M}>0,
 \qquad \beta_\lambda=\langle p_\lambda,w_\lambda\rangle,
 \qquad E=\langle w_\lambda,(Q_--\mu)w_\lambda\rangle.
                                                               \tag{0.6}
\]

The central new consequence is the denominator-free energy alternative

\[
 \boxed{
 |\langle g,w_\lambda\rangle|
 \geq\left[x-{1\over2}\sqrt{E\over\kappa}\right]_+.}
                                                               \tag{0.7}
\]

In particular, exact cancellation forces

\[
 \boxed{\langle g,w_\lambda\rangle=0
 \quad\Longrightarrow\quad E\geq4\kappa x^2.}       \tag{0.8}
\]

The frozen pole row gives the exact scale

\[
 4\kappa x^2
 =\sqrt2\,\kappa{\log^2\lambda\over\lambda}
   \{1+o(1)\}.                                       \tag{0.9}
\]

Thus the sufficient bridge-energy input

\[
 E=o\!\left(\kappa{\log^2\lambda\over\lambda}\right)
                                                               \tag{0.10}
\]

would prove an overlap of the explicit pole-row scale, without separately
bounding the Birman--Schwinger normalization.  No frozen theorem proves
(0.10).  In particular, the coherent beta diagonal is a signed
two-parity combination, not the individual odd energy `E`.

The sharp rational two-dimensional model in Section 7 shows that both the
factor `gamma*alpha^2` in (0.4) and the normalization in (0.5) can saturate.
It also shows that the structural inputs alone permit `kappa` to be smaller
than `exp(-o(lambda^2))`.  This is a no-go model, not a counterexample for
the actual source operator.

No lower bound for the actual `kappa`, no estimate (0.10), no
bottom-projector floor, no new zero statement, and no Riemann-hypothesis
conclusion is proved.  The formal state remains `P0_INVALIDATED`; the
standard eight are untouched.

## 1. Frozen inputs

No external zero table or numerical constant is imported.  The exact
repository inputs are:

| Dependency | SHA-256 |
|---|---|
| `notes/ACTUAL_MIXED_BRIDGE_POLE_ROW_RESOLVENT_CANCELLATION_REDUCTION.md` | `610aa2b58734ab191e561bbaa7529f0558e1f979fa67461273e69f6d6253cde2` |
| `tests/test_actual_mixed_bridge_pole_row_resolvent_cancellation_reduction.py` | `678e6da6c989c536ba6131fdfd38fe5927c60d464b29e8d358d94af0a9c0f2a4` |
| `notes/MIXED_BRIDGE_XI_OVER_S_BOUNDARY_OBSTRUCTION_THEOREM.md` | `4c4bb0344735a0d605e1052ac06b383144f2cdbb85d2c088bf0b6683e67f06a2` |
| `tests/test_mixed_bridge_xi_over_s_boundary_obstruction_theorem.py` | `1bc81194a9fa2fd4eac92491a08c60bc58f3640ac16e4e5e17864da8a2970c67` |
| `notes/GROWING_MIXED_BRIDGE_COHERENT_BETA_ROW_FLOOR_THEOREM.md` | `43a7a2a9c32dd01a223926b17c7e344d6c256980ad9b4762dc2dc5808face1e2` |
| `tests/test_growing_mixed_bridge_coherent_beta_row_floor_theorem.py` | `95a3548414eb0d33805cede160312bbc6091c278984fb5ec4144f1127152ab4a` |
| `notes/HIGH_FOURIER_COERCIVITY.md` | `5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821` |
| `tests/test_high_fourier_coercivity.py` | `64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae` |
| `notes/GROWING_MIXED_BRIDGE_ACTUAL_MULTIPLIER_DANGEROUS_FESHBACH_REDUCTION.md` | `cc2a62d6be1c62985ab9d5e2893c74c9ae773280f6bff4015f998364ccbd924e` |
| `tests/test_growing_mixed_bridge_actual_multiplier_dangerous_feshbach_reduction.py` | `1bbe3d751efedb86ab412921a5f99d243b1ebffef33afe325e2930a5d5670a0c` |

The pole-row note supplies the actual finite bridge `L2` transfer, the
asymptotic for `beta_lambda`, and the exact pole-axis Feshbach formula.  The
Xi-over-s note is used only to audit what is, and is not, known separately
in odd parity.  The coherent-beta note is used only to identify its
two-parity diagonal.  The high-Fourier and actual-multiplier notes supply
two exact reductions of the transverse problem; neither supplies the
remaining low Schur floor.  These roles are not interchangeable.

## 2. Spectral setup and simplicity

The Birman--Schwinger equation in (0.2) implies

\[
 (Q_--\mu)(H_--\mu)^{-1}p_\lambda=0.                \tag{2.1}
\]

Because `mu<a_1`, the resolvent is positive and injective.  The rank-one
Birman--Schwinger principle therefore makes `mu` a simple eigenvalue and
the bottom of `Q_-`.  A normalized ground is proportional to
`(H_--mu)^(-1)p_lambda`.

Let

\[
 \gamma=\inf\bigl(\sigma(Q_-)\setminus\{\mu\}\bigr)-\mu>0,
 \qquad \alpha=|\langle e,g\rangle|.                 \tag{2.2}
\]

If an even block is also present, put

\[
 \delta_{\rm par}=\inf\sigma(Q_+)-\mu,
 \qquad \Gamma=\min\{\gamma,\delta_{\rm par}\}.    \tag{2.3}
\]

The full parity gap gives the weaker but sometimes convenient corollary

\[
 \boxed{\kappa\geq\Gamma\alpha^2.}                  \tag{2.4}
\]

A parity or simple-ground gap alone does not control `kappa`: the pole
visibility `alpha` is essential.

## 3. Exact Schur factor and Birman--Schwinger normalization

Write the pole-axis block of `H_--mu` as

\[
 H_--\mu=
 \begin{bmatrix}A&r^*\\ r&B\end{bmatrix},
 \qquad B=B_\mu,
 \qquad r=P_\perp H_-e.                              \tag{3.1}
\]

Set

\[
 y=B^{-1}r,
 \qquad s=A-r^*B^{-1}r.                              \tag{3.2}
\]

Block inversion and (0.2) give

\[
 s=2M,
 \qquad (H_--\mu)^{-1}p_\lambda
 ={1\over2\sqrt M}(e-y),
 \qquad g={e-y\over\sqrt{1+\|y\|^2}}.              \tag{3.3}
\]

Since

\[
 F'(\mu)=\|(H_--\mu)^{-1}p_\lambda\|^2,             \tag{3.4}
\]

equation (3.3) proves (0.5).  It also turns the shifted loaded operator into
the exact positive-semidefinite Schur factor

\[
 Q_--\mu=
 \begin{bmatrix}y^*By&y^*B\\ By&B\end{bmatrix}
 =C^*BC,
 \qquad C(a,v)=v+ay.                                 \tag{3.5}
\]

Consequently

\[
 CC^*=I+|y\rangle\langle y|.                         \tag{3.6}
\]

In closed quadratic-form language, take `T=B^(1/2)C`.  The nonzero spectra
of `T^*T=C^*BC` and `TT^*=B^(1/2)CC^*B^(1/2)` agree, with multiplicity.
Hence

\[
 \boxed{\gamma
 =\inf\sigma\!\left(B^{1/2}(I+|y\rangle\langle y|)B^{1/2}\right)
 \geq\kappa.}                                       \tag{3.7}
\]

This is the exact nonzero-spectrum identity behind the upper inequality
`kappa<=gamma` in (0.4).

## 4. Proof of the transverse-gap comparison

Put `d=a_1-mu`.  Since

\[
 H_--\mu\succeq dI,                                  \tag{4.1}
\]

compression gives `B_mu>=dI`, hence `kappa>=d`.

For a unit vector `z` in `e^perp`, the pole term vanishes and the spectral
gap of `Q_-` gives

\[
 \langle z,B_\mu z\rangle
 =\langle z,(Q_--\mu)z\rangle
 \geq\gamma\{1-|\langle g,z\rangle|^2\}.            \tag{4.2}
\]

Orthogonal projection of `g` onto `e^perp` yields

\[
 \sup_{\substack{z\perp e\\\|z\|=1}}
 |\langle g,z\rangle|^2=1-\alpha^2.                 \tag{4.3}
\]

Taking the infimum in (4.2) proves `kappa>=gamma*alpha^2`.
Equation (3.7) proves `kappa<=gamma`, completing (0.4).

For compact resolvent the qualitative statement is exact:

\[
 \boxed{\kappa>0
 \quad\Longleftrightarrow\quad
 \mu\hbox{ is a simple odd bottom and }\alpha>0.}    \tag{4.4}
\]

Under (0.2) these two right-hand properties are automatic.  The statement
is qualitative and supplies no rate in `lambda`.

## 5. Scalar nonpole-gap criterion

Monotonicity of the positive resolvent below `a_1` gives, for every
`delta>0`,

\[
 \boxed{
 d\geq\delta
 \quad\Longleftrightarrow\quad
 2\langle p_\lambda,(H_--a_1+\delta)^{-1}p_\lambda\rangle
 \geq1.}                                             \tag{5.1}
\]

Moreover,

\[
 F'(\mu)\leq{M\over d^2},
 \qquad
 1+\|B_\mu^{-1}r\|^2\leq{4M^2\over d^2}.           \tag{5.2}
\]

Thus a source-specific bound `d>=exp(-o(lambda^2))` would simultaneously
give the same lower scale for `kappa` and a subexponential
Birman--Schwinger normalization.  Equation (5.1), not rank or retained
dimension alone, is the exact missing arithmetic scalar criterion.

## 6. Denominator-free bridge-energy lemma

Decompose the actual raw bridge as

\[
 w=xe+v,
 \qquad v\perp e,
 \qquad x={\beta_\lambda\over\sqrt M}>0.             \tag{6.1}
\]

Put

\[
 h=v+xy,
 \qquad u=\|y\|,
 \qquad D=\sqrt{1+u^2},
 \qquad t=\sqrt{E\over\kappa}.                      \tag{6.2}
\]

The Schur factor (3.5) and `B>=kappa I` give

\[
 E=\langle h,Bh\rangle,
 \qquad \|h\|\leq t.                                \tag{6.3}
\]

At the same time, (3.3) gives

\[
 |\langle g,w\rangle|
 ={\left|xD^2-\langle y,h\rangle\right|\over D}
 \geq{xD^2-ut\over D}                               \tag{6.4}
\]

whenever `t<=2x`; in that range the last numerator is nonnegative because
`D^2-2u=(u-1)^2`.  The affine endpoint inequalities

\[
 {D^2\over D}\geq1,
 \qquad {D^2-2u\over D}\geq0                        \tag{6.5}
\]

imply for every `0<=t/x<=2` that

\[
 {xD^2-ut\over D}\geq x-{t\over2}.                  \tag{6.6}
\]

For `t>=2x` the positive part on the right is zero.  This proves (0.7).
If the overlap vanishes, (0.7) gives `t>=2x`, proving (0.8).

The same cancellation threshold follows by a sharp direct minimization.
Cancellation makes

\[
 \langle y,h\rangle=x(1+u^2),                       \tag{6.7}
\]

so Cauchy and (6.3) imply

\[
 E\geq\kappa x^2{(1+u^2)^2\over u^2}
 \geq4\kappa x^2.                                   \tag{6.8}
\]

The universal constant four is attained in a one-dimensional transverse
block at `u=1`, with `h` parallel to `y` and `B=kappa I`.  For a fixed
general `B`, equality additionally requires the spectral condition
`<h,Bh>=kappa*||h||^2`, namely that `h` lie in the `kappa` spectral
subspace.  The geometric conditions alone are insufficient.  Indeed, the
exact two-dimensional transverse counterfixture

\[
 B=\begin{bmatrix}\kappa&0\\0&2\kappa\end{bmatrix},
 \qquad y=\begin{bmatrix}0\\1\end{bmatrix},
 \qquad h=2xy,
 \qquad \langle y,h\rangle=2x=x(1+\|y\|^2),
 \qquad E=\langle h,Bh\rangle=8\kappa x^2             \tag{6.8a}
\]

has `u=1`, exact cancellation, and `h` parallel to `y`, but its energy is
twice the universal lower threshold because `y` belongs to the
`2*kappa` spectral subspace.

The frozen actual pole row and mass are

\[
 \beta_\lambda=2^{-5/4}\log\lambda+O(1),
 \qquad
 M={\lambda-\lambda^{-1}\over2}-\log\lambda.       \tag{6.9}
\]

Therefore

\[
 x=2^{-3/4}{\log\lambda\over\sqrt\lambda}\{1+o(1)\},
 \qquad
 4x^2=\sqrt2\,{\log^2\lambda\over\lambda}\{1+o(1)\},
                                                               \tag{6.10}
\]

which proves (0.9).  Under (0.10), equation (0.7) gives

\[
 |\langle g,w_\lambda\rangle|
 \geq2^{-3/4}{\log\lambda\over\sqrt\lambda}\{1-o(1)\}.
                                                               \tag{6.11}
\]

## 7. Sharp rational saturation model

Let `M>0`, `0<epsilon<1`, and `s^2=1-epsilon^2`.  On a real
two-dimensional odd space define

\[
 Q_-=
 \begin{bmatrix}0&0\\0&1\end{bmatrix},
 \qquad e=\begin{bmatrix}\varepsilon\\s\end{bmatrix},
 \qquad p=\sqrt M e,
 \qquad H_-=Q_-+2|p\rangle\langle p|.               \tag{7.1}
\]

Then

\[
 H_-=
 \begin{bmatrix}
 2M\varepsilon^2&2M\varepsilon s\\
 2M\varepsilon s&1+2Ms^2
 \end{bmatrix},
 \quad
 \det H_-=2M\varepsilon^2,
 \quad
 \operatorname {tr}H_-=1+2M.                       \tag{7.2}
\]

Take

\[
 \mu=0,
 \qquad g=\begin{bmatrix}1\\0\end{bmatrix},
 \qquad z=\begin{bmatrix}-s\\\varepsilon\end{bmatrix}.
                                                               \tag{7.3}
\]

The exact Birman--Schwinger and gap data are

\[
 2\langle p,H_-^{-1}p\rangle=1,
 \qquad \gamma=1,
 \qquad \alpha=\varepsilon,
 \qquad \kappa=\langle z,H_-z\rangle=\varepsilon^2.
                                                               \tag{7.4}
\]

Furthermore,

\[
 H_-^{-1}p={g\over2\sqrt M\varepsilon},
 \qquad
 1+\|B^{-1}r\|^2=\varepsilon^{-2}.                  \tag{7.5}
\]

Thus `kappa=gamma*alpha^2` and (0.5) both saturate.  The nonpole gap is

\[
 d={1+2M-\sqrt{(1+2M)^2-8M\varepsilon^2}\over2},
 \qquad d\leq\kappa.                                \tag{7.6}
\]

For the exact rational regression choose

\[
 M=4,
 \qquad \varepsilon={3\over5},
 \qquad s={4\over5},
 \qquad p=\begin{bmatrix}6/5\\8/5\end{bmatrix},
 \qquad H_-={1\over25}
 \begin{bmatrix}72&96\\96&153\end{bmatrix}.       \tag{7.7}
\]

Then `kappa=9/25`, `B^(-1)r=4/3`, and the normalization is `25/9`.

Adjoin an even scalar block at `2` and a diagonal tail with entries
`2+log(k+1)`.  The global loaded gap remains one, the resolvent is compact,
and the high tail is logarithmically coercive.  Taking formally
`epsilon_lambda=exp(-lambda^3)` gives

\[
 \kappa_\lambda=\exp(-2\lambda^3),                  \tag{7.8}
\]

which is smaller than `exp(-o(lambda^2))`.  This family obeys the abstract
rank-one, parity, compact-resolvent, simple-ground, and high-tail
structures.  It does not obey the full actual von-Mangoldt matrix entries
and therefore proves only a structural no-go.

## 8. Actual source and the two finite reductions

With the complete source multiplier retained,

\[
 m_\lambda(t)=
 \operatorname {Re}\psi\!\left({1\over4}+{it\over2}\right)-\log\pi
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).              \tag{8.1}
\]

On the actual odd physical domain, the transverse floor has the exact
variational form

\[
 \boxed{
 \kappa=\inf_{\substack{f\perp p_\lambda\\\|f\|=1}}
 \left\{\int_{\mathbb R}m_\lambda(t)|\widehat f(t)|^2
                 {dt\over2\pi}-\mu\right\}.}        \tag{8.2}
\]

For odd `f`, the constraint is equivalently

\[
 \langle p_\lambda,f\rangle=0
 \quad\Longleftrightarrow\quad \widehat f(i/2)=0.   \tag{8.3}
\]

Thus `kappa` is an actual Mellin-zero Poincare constant for the complete
signed symbol; replacing the prime term by its absolute value would change
the problem.

The frozen high-Fourier theorem gives, uniformly in every finite outer
cutoff, a high block of `Q_--mu` with any prescribed fixed floor `G>0`
after its explicit cutoff `M_*(lambda,mu,G)`, and a low/high coupling at
most `c_lambda`.  For the admitted shifts covered by its frozen elementary
bounds, this cutoff is `exp(O(lambda log lambda))`.  Pole augmentation
improves the high diagonal, while

\[
 2\|p_{\rm hi}\|\,\|p_{\rm lo}\|
 \leq\|p_{\rm hi}\|^2+\|p_{\rm lo}\|^2=M.          \tag{8.4}
\]

Hence the low/high coupling of `H_--mu` is at most `c_lambda+M`.  If `S`
is its exact low Schur complement and `sigma=inf sigma(S)>0`, block
congruence gives

\[
 \boxed{
 {\min\{\sigma,G\}\over
       \{1+(c_\lambda+M)/G\}^2}
 \leq d,
 \qquad H_--\mu\succeq dI\Longrightarrow S\succeq dI.}
                                                               \tag{8.5}
\]

The actual-multiplier dangerous-space theorem gives a different reduction:
the complete retained obstruction can be pulled back to dimension
`O(log lambda)+exp(O(lambda))`, with a strict safe floor on its complement.
After a positive far block `D_F>=delta_0 I` is eliminated, let `S_B` be
the resulting transverse Schur operator.  If `inf sigma(S_B)>0`, the same
congruence gives

\[
 {\min\{\inf\sigma(S_B),\delta_0\}\over
       \{1+\|D_F^{-1}\Gamma\|\}^2}
 \leq\kappa\leq\inf\sigma(S_B).                     \tag{8.6}
\]

Neither (8.5) nor (8.6) supplies the missing smallest eigenvalue of its
retained Schur operator.  Dimension control, even subexponential dimension
control, gives no determinant or eigenvalue lower bound without arithmetic
separation.

## 9. Audit of the bridge energy

The frozen pole-row note proves

\[
 \|w_\lambda-W_\infty-\lambda^{-2}W_1\|_{L^2(-a,a)}
 =O(\lambda^{-3}),
 \qquad \|W_\infty\|>0.                              \tag{9.1}
\]

It does **not** prove the individual odd Rayleigh estimate

\[
 {\langle w_\lambda,Q_-w_\lambda\rangle
       \over\|w_\lambda\|^2}=o(1).                  \tag{9.2}
\]

The coherent-beta theorem proves instead

\[
 F_+(w_\rho)^2-F_-(w_\rho)^2
 ={A_\lambda^2\over4\lambda\rho(1-\rho)},
 \qquad
 q_{bb}={A_\lambda^2C_\xi\over4\lambda}+o(\lambda^{-1}).
                                                               \tag{9.3}
\]

This is the coherent even-minus-odd, two-parity diagonal after the rows are
concatenated.  It is not `E`, not the odd self in (9.2), and not an upper
bound for either one.  The Xi-over-s theorem separately identifies the
missing common finite-part physical identity.  Therefore (9.3) cannot be
inserted into (0.7).

For any nonzero odd bridge, spectral resolution gives the always-valid
inequality

\[
 \rho={|\langle g,w\rangle|^2\over\|w\|^2},
 \qquad
 E\geq\gamma(1-\rho)\|w\|^2
 \geq\kappa(1-\rho)\|w\|^2.                          \tag{9.4}
\]

Thus, for each fixed `eta>0`, the correct dichotomy is:

\[
 \begin{cases}
 \rho>1-\eta,
   &\text{strong ground capture},\\
 \rho\leq1-\eta,
   &\displaystyle\kappa\leq\gamma
      \leq{E\over\eta\|w\|^2}.
 \end{cases}                                        \tag{9.5}
\]

The first branch is already strong ground capture.  In the second branch,

\[
 {E\over\kappa}\geq\eta\|w\|^2.                   \tag{9.6}
\]

Since `||w_lambda||` tends to the nonzero `||W_infinity||`, condition
(0.10) is impossible on every fixed noncapture branch because
`log^2(lambda)/lambda` tends to zero.  Hence (0.10), if proved, would itself
force capture; it cannot coexist with a fixed noncapture alternative.

Finally, even if (9.2) were added as a new premise and `mu<=-delta`, one
could conclude only

\[
 E=\langle w,Q_-w\rangle-\mu\|w\|^2
 \geq\delta\|W_\infty\|^2+o(1).                    \tag{9.7}
\]

Equality with `delta*||W_infinity||^2` would additionally require
`mu=-delta+o(1)`.  The frozen inputs prove neither premise.

## 10. Exact stopping line

There are two sufficient arithmetic routes and one exact obstruction:

\[
 d\geq\exp\{-o(\lambda^2)\}
 \quad\Longrightarrow\quad
 \kappa\geq\exp\{-o(\lambda^2)\}                   \tag{10.1}
\]

together with the normalization control in (5.2), or directly

\[
 E=o\!\left(\kappa{\log^2\lambda\over\lambda}\right)
 \quad\Longrightarrow\quad\hbox{the overlap floor (6.11)}.   \tag{10.2}
\]

The exact cancellation obstruction is

\[
 \langle g,w_\lambda\rangle=0
 \quad\Longrightarrow\quad
 E\geq\sqrt2\,\kappa{\log^2\lambda\over\lambda}
       \{1+o(1)\}.                                   \tag{10.3}
\]

The scalar Birman--Schwinger test (5.1), a retained-Schur eigenvalue bound
in (8.5) or (8.6), or the individual odd bridge energy in (10.2) is the
missing arithmetic input.  None is supplied by the frozen two-parity beta
self.  The audit therefore fails closed and makes no RH claim.
