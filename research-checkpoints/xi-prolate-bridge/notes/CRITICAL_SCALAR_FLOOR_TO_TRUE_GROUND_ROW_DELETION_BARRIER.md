# Critical scalar floor to true-ground row-deletion barrier

## 0. Exact outcome and claim boundary

Assume RH only where the actual critical-zero Gram is used.  Fix

\[
 {1\over2\pi}<D_-<D_+<{1\over2},\qquad
 D\in[D_-,D_+],                                    \tag{0.1}
\]

and use the critical schedule from the frozen scalar-transfer theorem,

\[
 N=D e^L L+O_D(L),\qquad
 \Omega_N={2\pi N\over L}=2\pi D e^L+O_D(1).       \tag{0.2}
\]

That theorem proves, at one selected cutoff and one selected zero row,

\[
 {D_N^{\rm act}\over |d_N|^2}\gg_D(\log L)^2,
 \qquad (\eta_N^{\rm pr})^2=O_D((\log L)^{-2}).    \tag{0.3}
\]

This note proves that (0.3), even together with the critical zero count,
does not supply any presently missing true-ground finite gate.

First, Riemann--von Mangoldt gives an actual low-row nullspace of dimension

\[
 \boxed{
 \dim\ker \mathcal E^-_{\leq\Omega_N}
 \geq(1-\log D){N\over L}+O_D(L)=\Theta_D(e^L).}   \tag{0.4}
\]

Every nonzero odd vector in this nullspace has a favorable endpoint-zero
primitive comparison.  The comparison is nevertheless at least the
**constrained** odd minimum, whereas parity requires comparison with the
unconstrained true odd ground.  This is the wrong minimax direction.

Second, an exact positive `N=2` paired real-evaluation Gram, with nodes
`1/2,5/2,9/2` and weights `1,39,135`, has an odd global ground.  All of its
parity blocks, shifted Sylvester minors, source-Cauchy identities, and the
nonzero low-row projection onto the boundary-zero hyperplane are rational
and are displayed below.  This is a structural counterexample, not the
zeta divisor.

Third, the missing statements admit sharp row-deletion sufficient
criteria.  They compare the true odd or positive-even floor after all rows
through a height `T` are deleted with the undeleted floor.  Hellmann--
Feynman and concavity give the exact bridge from these ratios to the
ground-weighted low-row mass.

Finally, the exact source-Cauchy family

\[
 Q=\tau I+\varepsilon(I-|g\rangle\langle g|),
 \qquad g={\eta\over\sqrt{2N+1}},                  \tag{0.5}
\]

has strict parity and shifted gates and can have an arbitrarily large
single-row/end-point quotient, while

\[
 \delta_+=1-\frac{\mu_N}{\alpha_N}
 ={4\over2N+5}\longrightarrow0                   \tag{0.6}
\]

for the explicit choice `tau=R/5`, `epsilon=4R/5`.  Thus scalar selection
does not orient the reserve.

The surviving actual statistics are the primitive determinant `Delta_N`,
the two shifted-sector margin `Sigma_N`, and the true-ground reserve
statistic `Theta_N` (or the direct ratio `mu_N/alpha_N`).  None is proved
here.  No structural model is identified with the actual zeta Gram, and no
actual-zeta gate failure, literal-ceiling synchronization, determinant
limit, unconditional zero theorem, RH proof or converse, or
de Bruijn--Newman bound follows.  The formal state remains
`P0_INVALIDATED`.  This is a narrow post-checkpoint-1.53 barrier pair; it
changes none of the standard eight files.

## 1. Exact frozen inputs

Exactly four frozen note/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/CRITICAL_ARITHMETIC_TO_ACTUAL_SCALAR_TRANSFER_THEOREM.md` | `8c453f25d75ab351a15faa65a8b7ce5eaaf96ba3b83043b4cdb037f5daa379d8` |
| `tests/test_critical_arithmetic_to_actual_scalar_transfer_theorem.py` | `6e313a0fdeb2db8f11721ce805ff02c60567d370ec4430b63e6a8faae3e00408` |
| `notes/RH_ACTUAL_ODD_GROUND_PRIMITIVE_CHRISTOFFEL_PARITY_BARRIER.md` | `29475ddb8b57f227530b6aa296b088f07c4ac9db0cadd1a2d230b40a780b3157` |
| `tests/test_rh_actual_odd_ground_primitive_christoffel_parity_barrier.py` | `c03b4325d8f04266091dc3cd8ad17f6bf4f91ca97773cf7dfcaedb44f46caeb6` |
| `notes/RH_ACTUAL_GROUND_CHRISTOFFEL_COMMUTATOR_RESPONSE_BARRIER.md` | `aa1186ccef2d81c6428973b6a9757846f00758ad14eb6607854beab5fcded272` |
| `tests/test_rh_actual_ground_christoffel_commutator_response_barrier.py` | `a86e9751e2fd2d3fb4076a72438dda37d3e6cde7e04a8a36075af2ef8f0c2c67` |
| `notes/ADAPTIVE_PROLATE_SATURATION_DIVERGENCE_ORIENTATION_BARRIER.md` | `7882db630232ec094318e52689b0b12bf28b0d74ee2c012259a6e91fe666268b` |
| `tests/test_adaptive_prolate_saturation_divergence_orientation_barrier.py` | `5efe525cd79bc7279fe5198ae9af8ec9da8941e5bd3a4f1baa4479de56336798` |

The first pair supplies only the critical one-vector scalar floor (0.3).
The second supplies the exact endpoint-zero odd primitive, the
Christoffel determinant `Delta_N`, and the source-Cauchy/evaluation-Gram
conventions.  The third supplies the true-ground response and row-deletion
identities.  The fourth supplies `alpha_N`, `mu_N`, the twice-clamped true
ground, and `Theta_N`.  No external source, numerical zeta ordinate, zero
table, or new source lock is used.

## 2. The critical Riemann--von Mangoldt nullspace

Let `mathcal N(T)` count positive zeta-zero ordinates through `T`, with
algebraic multiplicity.  Riemann--von Mangoldt gives

\[
 \mathcal N(T)={T\over2\pi}\log{T\over2\pi}
               -{T\over2\pi}+O(\log T).           \tag{2.1}
\]

From (0.2),

\[
 {\Omega_N\over2\pi}={N\over L}=D e^L+O_D(1),
 \qquad
 \log{\Omega_N\over2\pi}=L+\log D+O_D(e^{-L}).  \tag{2.2}
\]

Substitution in (2.1) yields

\[
 \mathcal N(\Omega_N)
 =N-(1-\log D){N\over L}+O_D(L).                  \tag{2.3}
\]

The odd source space has dimension `N`.  Repeated zero rows cannot raise
rank, so counting with multiplicity is a valid rank upper bound.  Hence

\[
 \dim\ker \mathcal E^-_{\leq\Omega_N}
 \geq N-\mathcal N(\Omega_N),                     \tag{2.4}
\]

which proves (0.4).  The same dimension scale is available for the
positive-index even evaluation map.  This is an actual RH-conditional
dimension statement, not a lower bound for either true Gram floor.

## 3. Favorable primitives and the wrong minimax quantifier

Let `g` be a nonzero odd vector and let `Pg` be its endpoint-zero even
primitive from the frozen Christoffel pair.  Put

\[
 G_-(g)=\Omega_N^2{\|Pg\|_2^2\over\|g\|_2^2}.
                                                               \tag{3.1}
\]

Since every odd Fourier frequency in the finite source space is at most
`Omega_N`, the exact coefficient norm gives

\[
 G_-(g)\geq1.                                      \tag{3.2}
\]

Equality in the frequency bound would require support only at the top
mode, while the clamped primitive then has a nonzero central component;
thus the comparison below is strict for every nonzero admissible `g`.

Suppose `g` annihilates every actual zero row through a height
`T>=Omega_N`, and its odd Rayleigh quotient `R_-(g)` is positive.  The
identity `widehat{Pg}(gamma)=widehat g(gamma)/(i gamma)` gives

\[
 \boxed{
 {R_+(Pg)\over R_-(g)}
 \leq{(\Omega_N/T)^2\over G_-(g)}<1.}              \tag{3.3}
\]

This looks favorable but has the wrong quantifier.  Let

\[
 \lambda_-^{>T}
 =\min_{0\ne g\in\ker\mathcal E^-_{\leq T}}R_-(g),
 \qquad
 \lambda_- =\min_{0\ne g}R_-(g).                 \tag{3.4}
\]

Minimization over the smaller space gives

\[
 \lambda_-^{>T}\geq\lambda_-.                    \tag{3.5}
\]

For a constrained minimizer `g_T`, (3.3) proves only

\[
 \lambda_+\leq R_+(Pg_T)<\lambda_-^{>T}.          \tag{3.6}
\]

It does not prove `lambda_+<lambda_-`.  A theorem comparing the two floors
in (3.5), rather than another vector in the large nullspace, is required.

## 4. Exact `N=2` paired-evaluation counterexample

Take `L=2*pi`, `N=2`, and the paired positive nodes and weights

\[
 (r_1,w_1)=\left({1\over2},1\right),\qquad
 (r_2,w_2)=\left({5\over2},39\right),\qquad
 (r_3,w_3)=\left({9\over2},135\right),             \tag{4.1}
\]

with the same weight at each reflected negative node.  In the aligned raw
source basis, the scaled Gram entries are

\[
 \pi Q_{nm}=\sum_{j=1}^3w_j\left\{
 {1\over(r_j-n)(r_j-m)}+{1\over(r_j+n)(r_j+m)}
 \right\}.                                      \tag{4.2}
\]

This is a positive paired real-evaluation Gram.  The reflected
partial-fraction identity also gives the exact source-Cauchy displacement

\[
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),qquad
 b_n=nQ_{n0},\qquad b_{-n}=-b_n.                  \tag{4.3}
\]

In normalized even and odd parity bases, direct rational arithmetic gives

\[
 E:=\pi Q_+=
 \begin{pmatrix}
 {2536\over75}&{6056\sqrt2\over231}&{9896\sqrt2\over195}\\
 {6056\sqrt2\over231}&{3557104\over53361}&{1769552\over15015}\\
 {9896\sqrt2\over195}&{1769552\over15015}&{26702032\over114075}
 \end{pmatrix},                                    \tag{4.4}
\]

\[
 O:=\pi Q_-=
 \begin{pmatrix}
 {759232\over53361}&{163712\over5005}\\
 {163712\over5005}&{15123712\over114075}
 \end{pmatrix}.                                    \tag{4.5}
\]

Put `q=29/5`.  The three leading Sylvester minors of `E-qI` are

\[
 {2101\over75},\qquad
 {6609793151\over20010375},\qquad
 {47896442166707\over2282683528125},              \tag{4.6}
\]

and are all positive.  Hence `E` is strictly above `q`.  The odd block is
positive because

\[
 O_{11}={759232\over53361}>0,
 \qquad
 \det O={709944672256\over869593725}>0,            \tag{4.7}
\]

but

\[
 \det(O-qI)=-{43224625753\over30435780375}<0.     \tag{4.8}
\]

Therefore

\[
 0<\lambda_{\min}(O)<q<\lambda_{\min}(E),         \tag{4.9}
\]

and the full positive evaluation Gram has a simple odd global ground.

The row at the low node `r=1/2`, after removing its common nonzero scalar,
is

\[
 e=\left(2,-{2\sqrt2\over3},-{2\sqrt2\over15}\right),
 \qquad \eta=(1,\sqrt2,\sqrt2).                  \tag{4.10}
\]

Its exact projection onto the boundary-zero hyperplane is

\[
 k=e-{2\over25}\eta
 =\left({48\over25},-{56\sqrt2\over75},
                    -{16\sqrt2\over75}\right).   \tag{4.11}
\]

One has

\[
 \boxed{\langle\eta,k\rangle=0,
 \qquad \langle e,k\rangle=\|k\|_2^2
 ={5504\over1125}>0.}                              \tag{4.12}
\]

Thus neither positive evaluation structure nor passage to the
boundary-zero primitive hyperplane deletes the dangerous low row.
Equations (4.1)--(4.12) are a finite structural non-implication only; the
nodes are not zeta ordinates.

## 5. Sharp odd row-deletion criterion

Let `g_-` be a unit true odd ground, let `lambda_->0`, and let
`nu_-` be its sampling-energy probability on the positive actual zero
ordinates.  For `T>Omega_N>gamma_*`, where `gamma_*` is the least positive
ordinate, define

\[
 \rho_{-,T}=\nu_-((0,T]),\qquad
 a_2=\left({\Omega_N\over T}\right)^2,
 \qquad b_2=\left({\Omega_N\over\gamma_*}\right)^2. \tag{5.1}
\]

The primitive identity and a split at `T` give

\[
 {R_+(Pg_-)\over\lambda_-}
 ={1\over G_-}\int\left({\Omega_N\over\gamma}\right)^2
                       d\nu_-(\gamma)
 \leq {a_2+(b_2-a_2)\rho_{-,T}\over G_-},         \tag{5.2}
\]

where `G_-=G_-(g_-)`.  Consequently

\[
 \rho_{-,T}<{G_--a_2\over b_2-a_2}                \tag{5.3}
\]

is sufficient for the strict primitive determinant `Delta_N>0`.

Let `A_-^{>T}` and `A_-^{\leq T}` be the true odd Gram contributions and
put

\[
 \lambda_-(s)=\lambda_{\min}
       (A_-^{>T}+sA_-^{\leq T}),\qquad
 \lambda_-^{>T}=\lambda_-(0).                     \tag{5.4}
\]

On a simple ground branch, Hellmann--Feynman gives

\[
 \rho_{-,T}={\lambda_-'(1)\over\lambda_-(1)}.     \tag{5.5}
\]

Since the smallest eigenvalue of an affine Hermitian pencil is concave,

\[
 \rho_{-,T}\leq1-{\lambda_-^{>T}\over\lambda_-}. \tag{5.6}
\]

For a multiple ground, the same statement uses the left derivative and a
ground vector maximizing the low-row form inside the ground eigenspace.
Combining (5.3) and (5.6) proves the sharp sufficient row-deletion test

\[
 \boxed{
 {\lambda_-^{>T}\over\lambda_-}
 >1-{G_--a_2\over b_2-a_2}
 \quad\Longrightarrow\quad\Delta_N>0.}            \tag{5.7}
\]

The right side is useful when `G_->a_2`.  Riemann--von Mangoldt controls
the dimension of the deleted-row kernel; it supplies no lower bound for
the ratio on the left of (5.7).

## 6. Sharp true-even reserve criterion

Let `A_N^circ` be the positive-index even block, let `h_alpha` be a unit
ground with floor `alpha_N>0`, and let `nu_alpha` be its sampling-energy
probability.  Retain the twice-clamped primitive `mathcal R_N h_alpha` and
put

\[
 G_+=\Omega_N^4\|\mathcal R_Nh_\alpha\|_2^2\geq1,
 \qquad
 \Theta_N={\displaystyle\int\gamma^{-4}
                         d\nu_\alpha(\gamma)
             \over\|\mathcal R_Nh_\alpha\|_2^2}. \tag{6.1}
\]

The frozen min--max theorem gives

\[
 {\mu_N\over\alpha_N}\leq\Theta_N.               \tag{6.2}
\]

For `T>Omega_N>gamma_*`, define

\[
 \rho_{+,T}=\nu_\alpha((0,T]),\qquad
 a_4=\left({\Omega_N\over T}\right)^4,
 \qquad b_4=\left({\Omega_N\over\gamma_*}\right)^4. \tag{6.3}
\]

Splitting the inverse fourth moment gives

\[
 \Theta_N\leq
 {a_4+(b_4-a_4)\rho_{+,T}\over G_+}.              \tag{6.4}
\]

Let `alpha_N^{>T}` be the smallest eigenvalue after deleting all rows
through `T`.  Hellmann--Feynman and the same concavity argument give

\[
 \rho_{+,T}\leq1-{\alpha_N^{>T}\over\alpha_N}.    \tag{6.5}
\]

Therefore, for any target `0<tau<1` with `tau G_+>a_4`,

\[
 \boxed{
 {\alpha_N^{>T}\over\alpha_N}
 >1-{\tau G_+-a_4\over b_4-a_4}
 \quad\Longrightarrow\quad
 {\mu_N\over\alpha_N}<\tau.}                     \tag{6.6}
\]

Thus a fixed reserve `delta_+>rho` follows by taking `tau=1-rho`.
The scalar theorem (0.3) concerns the projected-prolate vector, not
`h_alpha`; it bounds neither side of (6.6).

## 7. Exact reserve-collapse family with a divergent scalar row

Let `d=2N+1`, let `eta=sum_(|n|<=N)V_n`, and put

\[
 g={\eta\over\sqrt d},\qquad
 Q=\tau I+\varepsilon(I-|g\rangle\langle g|),
 \qquad \tau,\varepsilon>0.                       \tag{7.1}
\]

In the raw source basis,

\[
 Q_{nm}=(\tau+\varepsilon)\delta_{nm}
         -{\varepsilon\over d}.                   \tag{7.2}
\]

For `n!=m`, (7.2) is the exact source-Cauchy rule with

\[
 b_n=-{\varepsilon n\over d},\qquad
 {b_n-b_m\over n-m}=-{\varepsilon\over d},
 \qquad b_{-n}=-b_n.                              \tag{7.3}
\]

The eigenvalue along `g` is `tau`; every orthogonal eigenvalue is
`tau+epsilon`.  The frozen source-Cauchy cone theorem therefore also gives
an exact finite positive paired real-evaluation representation of (7.1).
It is unrestricted structural evaluation data, not zeta data.

Choose a constituent even evaluation row `e_*` not parallel to `g` and
put

\[
 u={P_{g^\perp}e_*\over\|P_{g^\perp}e_*\|},
 \qquad
 k_s=\sqrt{1-s^2}\,u+s g,\qquad0<s<1.             \tag{7.4}
\]

Such a row exists because the even block is positive definite in
dimension `N+1`, not rank one.  The boundary and transverse-row quotient
are exactly

\[
 |\langle\eta,k_s\rangle|^2=d s^2,
 \qquad
 { |\langle u,k_s\rangle|^2
  \over |\langle\eta,k_s\rangle|^2}
 ={1-s^2\over d s^2}\sim{1\over d s^2}.           \tag{7.5}
\]

The actual constituent row `e_*` has the same divergence up to its fixed
positive transverse coefficient.  Thus a one-row/end-point quotient can
be made arbitrarily large.

For every `s>0`, the two-vector Krylov space generated by `k_s` contains
`g` and `u`; its lower Ritz value is exactly

\[
 u_N=\tau.                                         \tag{7.6}
\]

The even second eigenvalue and odd first eigenvalue are both
`tau+epsilon`, so both shifted gates are strict.  The positive-index even
compression has floor

\[
 \alpha_N=\tau+{\varepsilon\over d},
 \qquad \mu_N=\tau.                               \tag{7.7}
\]

Taking

\[
 \tau={R\over5},\qquad \varepsilon={4R\over5},
 \qquad R>0,                                      \tag{7.8}
\]

gives the exact reserve collapse

\[
 \boxed{
 \delta_+=1-{\mu_N\over\alpha_N}
 ={\varepsilon\over d\tau+\varepsilon}
 ={4\over2N+5}\longrightarrow0.}                 \tag{7.9}
\]

Equations (7.5) and (7.9) can hold simultaneously.  Hence no scalar
row/end-point theorem, including (0.3), can by itself force a uniform
true-ground reserve inside the exact positive source-Cauchy/evaluation
class.

## 8. Irreducible actual statistics and stopping line

Let `mu_2^+` be the second even eigenvalue, let `mu_1^-` be the first odd
eigenvalue, and let `u_N` be the exact lower two-vector Ritz shift used by
the finite selector.  The remaining actual conditions may be recorded as

\[
 \boxed{\Delta_N>0,}                               \tag{8.1}
\]

\[
 \boxed{
 \Sigma_N:=\min\{\mu_2^+-u_N,\mu_1^--u_N\}>0,}   \tag{8.2}
\]

and, for a desired fixed `rho>0`, either

\[
 \boxed{
 \Theta_N={\displaystyle\int\gamma^{-4}
                         d\nu_\alpha(\gamma)
             \over\|\mathcal R_Nh_\alpha\|_2^2}
 \leq1-\rho,}                                     \tag{8.3}
\]

or the direct exact, logically weaker target

\[
 \boxed{{\mu_N\over\alpha_N}\leq1-\rho.}        \tag{8.4}
\]

The primitive condition (8.1) forces strict even-below-odd parity and then
simple-even ground and boundary nonvanishing by the frozen commutator
theorem.  Condition (8.2) is the exact shifted-sector margin.  Conditions
(8.3)--(8.4) are the true-ground reserve.  The row-deletion tests
(5.7) and (6.6) are concrete sufficient zeta-specific routes to (8.1) and
(8.3), respectively.

None follows from the critical scalar floor, nullity, positivity, or zero
count.  Any downstream use must reject an argument which

1. replaces the unconstrained odd ground by a low-row-null vector;
2. reverses the minimax inequality in (3.5);
3. treats Riemann--von Mangoldt nullity as a floor estimate;
4. drops `G_-` or `G_+` from (5.2) or (6.4);
5. invokes (6.6) when `tau G_+<=a_4`;
6. transfers the projected-prolate scalar distribution to a true ground;
7. identifies either structural family with the zeta divisor; or
8. claims an actual gate failure, literal-ceiling synchronization,
   determinant convergence, RH, a converse from RH, or a
   de Bruijn--Newman bound.

The terminal result is a barrier and a precise next target: prove a
relative row-deleted actual-ground floor, or prove the equivalent
ground-weighted statistics directly.  The formal state remains
`P0_INVALIDATED`.
