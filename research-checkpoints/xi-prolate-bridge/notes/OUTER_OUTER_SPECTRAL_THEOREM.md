# Source-locked outer--outer spectral theorem

Status: admitted analytic component theorem.  This note combines the pinned
zero-sampling inputs in `ZERO_SAMPLING_SOURCE_LOCK.json` with the complete
weighted translation theorem in
`OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md`.  It proves an absolute
outer--outer spectral bound for the actual corrected, source-normalized and
inversion-reflected state.  It also proves that this term is negligible at
the fixed-index `d_8` scale.

This is not a signed sector-floor theorem, a shifted-resolvent theorem, a
locally uniform determinant limit, or a conclusion about RH.  No zero is
assumed real globally, no zero list is read, and no positivity of the Weil
form is used.  The formal project state remains `P0_INVALIDATED`.

## 1. State, transform, and the already-proved domain passage

Retain the state of the weighted translation theorem,

\[
 K_\lambda=S\mathcal E(\widetilde h_\lambda),\qquad
 O_\lambda=(1-C_\lambda)K_\lambda,\qquad S={1+J\over2}.       \tag{1.1}
\]

Thus `O_lambda` contains both inversion-reflected physical tails and the
fixed invisible bump.  The additive Fourier convention in the source
variable is

\[
 \widehat f(\xi)=\int_{\mathbb R}f(t)e^{2\pi i t\xi}\,dt,
\]

whereas the angular log-Fourier transform used for zero sampling is

\[
 F_\lambda(z)=\int_{\mathbb R}O_\lambda(t)e^{-izt}\,dt.       \tag{1.2}
\]

If `rho=beta+i gamma` is a nontrivial zeta zero, put

\[
 s_\rho=\gamma+i(1/2-\beta).                                 \tag{1.3}
\]

The exact two-sided radical theorem gives, at both evaluations,

\[
 \widehat O(s_\rho)=-\widehat X(s_\rho),\qquad
 \widehat O(\overline{s_\rho})=-\widehat X(\overline{s_\rho}),
 \qquad X=C_\lambda K_\lambda.                              \tag{1.4}
\]

The zero extension of `X` is compact and of bounded variation.  Fejer means
on the logarithmic circle lie in the trigonometric core, converge to `X` in
the closed logarithmic form domain, and have uniformly bounded variation and
support after zero extension.  Integration by parts therefore bounds their
transforms, and the transform of `X`, by
`O_lambda((1+|Re z|)^(-1))` uniformly on the full closed strip
`|Im z|<=1/2`.  Since the classical zero count gives
`sum_rho (1+|gamma|)^(-2)<infinity`, dominated convergence identifies the
core explicit forms with the absolutely convergent spectral sum.  Together
with termwise radicality this gives

\[
 W_Z(O_\lambda,O_\lambda)
 =\sum_\rho F_\lambda(s_\rho)F_\lambda(\overline{s_\rho})
 =q_\lambda(X,X).                                            \tag{1.5}
\]

This is the already-proved compact-BV bypass.  The theorem below does not
extend the pole--archimedean--prime distribution to arbitrary noncompact
outer states; sampling is used only to obtain a defect-relative bound for
the absolutely convergent sum (1.5).

## 2. The physical input with every constant displayed

For `lambda>=2`, `|y|<1/2`, and `0<h<=1/2`, let
`epsilon(y)=1/2-|y|`.  The admitted weighted translation theorem proves

\[
 \|\tau_h(e^{y\,\cdot}O_\lambda)-e^{y\,\cdot}O_\lambda\|_2^2
 \le D_S(\lambda)\epsilon(y)^{-1}h^{\epsilon(y)}d_4,          \tag{2.1}
\]

and

\[
 \|e^{y\,\cdot}O_\lambda\|_2^2
 \le D_S(\lambda)\epsilon(y)^{-1}d_4.                       \tag{2.2}
\]

Here `q=1`,

\[
 a_4={\sqrt3\over2^{11/4}},
\]

\[
 C_2={40\,3^{-1/4}e^{-(1+\sqrt3)/2}
          \over(1-1/\sqrt3)^2},
 \quad C_{\phi,3}=222816\sqrt e,
 \quad C_{\psi,3}=9C_{\phi,3},                              \tag{2.3}
\]

\[
 C_b={2C_2^2+(C_{\psi,3}+4C_2)^2\over36},                   \tag{2.4}
\]

and

\[
\boxed{
\begin{aligned}
 D_S(\lambda)
={}&36864\pi^2a_4^2\lambda^3
 \left(32+256\pi\lambda^3
              +16384\sqrt{2\pi}\lambda^4\right)\\
 &+8a_4^2\lambda C_b .
\end{aligned}}                                               \tag{2.5}
\]

The mandatory endpoint estimate used in (2.1) is

\[
 \|\Delta_h[1_{s\ge0}e^{-\delta s}P(Ae^s)]\|_2^2
 \le128\delta^{-1}A^\delta h^\delta.                        \tag{2.6}
\]

Its phase factor `A^delta` is retained.  In the source state
`A=lambda^2`; it cancels only after the exact boundary shift contributes
`lambda^(-2 delta)`.  Neither an unreflected one-tail state nor the false
phase-free estimate is used here.

For later comparison define the completely explicit constant

\[
\boxed{
 C_D=36864\pi^2a_4^2
 \left(2+128\pi+16384\sqrt{2\pi}\right)
       +{a_4^2C_b\over8}.}                                   \tag{2.7}
\]

For `lambda>=2`, the four elementary inequalities

\[
 32\lambda^3\le2\lambda^7,\quad
 256\pi\lambda^6\le128\pi\lambda^7,\quad
 \lambda^7=\lambda^7,\quad
 8a_4^2C_b\lambda\le{a_4^2C_b\over8}\lambda^7
\]

give

\[
 \boxed{D_S(\lambda)\le C_D\lambda^7.}                      \tag{2.8}
\]

## 3. Pinned zero inputs and the exact overlap function

Put

\[
 T_0=30610046000,\qquad U=2(T_0+1)=61220092002,              \tag{3.1}
\]

\[
 M(t)={t\over2\pi}\log{t\over2\pi e},\qquad
 R(t)=0.103787\log t+0.257297\log\log t+9.367419,           \tag{3.2}
\]

and

\[
 Z_{\rm finite}=1+M(U)-{1\over8}+R(U).                       \tag{3.3}
\]

The binding zero count is HSW Theorem 1.1,

\[
 |N(t)-M(t)+1/8|\le R(t),\qquad t\ge T_0,                   \tag{3.4}
\]

with multiplicity.  The rounded HSW corollary is not substituted.  Define
the exact piecewise overlap bound

\[
 Z(T)=
 \begin{cases}
 Z_{\rm finite},&3\le T<T_0+1,\\
 1+\pi^{-1}\log(2T+1)+2R(2T+1),&T\ge T_0+1.
 \end{cases}                                                 \tag{3.5}
\]

For `T>=3`, the pinned Mossinghoff--Trudgian--Yang region and the functional
equation, rather than an assumed critical-line location, give

\[
 \delta_T={1\over55.241(\log(2T))^{2/3}
                   (\log\log(2T))^{1/3}},\qquad r_T={\delta_T\over4}. 
                                                                    \tag{3.6}
\]

Indeed, the region controls `beta`, and applying it to the zero
`1-conjugate(rho)` controls `1-beta`.  Hence every sampling disk remains in
the Mellin strip and has `epsilon(y)>=3 delta_T/4`.

The all-height MTY theorem imports a finite-height verification and,
indirectly, an HSW/LMFDB computation in its proof.  Those external
computations are disclosed in the source lock and are not replayed here.
No decimal zero table is vendored or read by this theorem.

## 4. The low block, including `gamma=0`

There is no nontrivial zero with `gamma=0`.  For real `0<sigma<1`, pair the
alternating eta series:

\[
 \eta(\sigma)=\sum_{n\ge1}
 \big((2n-1)^{-\sigma}-(2n)^{-\sigma}\big)>0.                \tag{4.1}
\]

Since `1-2^(1-sigma)<0` and
`zeta(sigma)=eta(sigma)/(1-2^(1-sigma))`, one has
`zeta(sigma)<0`.  Thus the argument below does not silently extend a
positive-height computation to the real segment.

The pinned Platt--Trudgian theorem puts every zero with
`0<|gamma|<3` on the center line; the large computation supporting that
published theorem is not replayed.  For the positive-height half, apply
submean on disks of radius `r_0=1/4`.  Their overlap is at most
`Z_finite`, and angular Plancherel gives

\[
\begin{aligned}
 \sum_{0<\gamma<3}|F_\lambda(\gamma)|^2
 &\le {16Z_{\rm finite}\over\pi}
   \int_{-1/4}^{1/4}\int_{\mathbb R}
       |F_\lambda(x+iy)|^2\,dx\,dy\\
 &=32Z_{\rm finite}\int_{-1/4}^{1/4}
       \|e^{y\,\cdot}O_\lambda\|_2^2\,dy\\
 &\le64Z_{\rm finite}D_S(\lambda)d_4.                       \tag{4.2}
\end{aligned}
\]

Here `epsilon(y)>=1/4`, so (2.2) contributes the factor four.  Conjugation
supplies the negative-height half.  Finally
`2|ab|<=|a|^2+|b|^2`, and the functional-equation involution permutes
`s_rho` with `conjugate(s_rho)`.  Therefore

\[
 \boxed{
 |W_Z^{|\gamma|<3}(O_\lambda,O_\lambda)|
 \le C_{\rm low}D_S(\lambda)d_4,
 \qquad C_{\rm low}=128Z_{\rm finite}.}                     \tag{4.3}
\]

No extra factor two is needed for polarization after the full positive and
negative sampling sum has been formed.

## 5. The exact convergent high dyadic series

Set

\[
 T_j=3\,2^j,\qquad \delta_j=\delta_{T_j},                    \tag{5.1}
\]

and define, with `Z` exactly as in (3.5),

\[
\boxed{
 a_j=Z(T_j){4\over3}\delta_j^{-3}
        (2T_j)^{-3\delta_j/4},\qquad
 \mathcal S_{\rm high}=\sum_{j=0}^{\infty}a_j.}             \tag{5.2}
\]

This is an exact positive series, not a fitted or truncated constant.  The
finite-cover branch is used for precisely `0<=j<=33`; the analytic branch is
used from `j=34` onward.

For one positive block, submean contributes
`16/(pi delta_j^2)`.  On the block-enlarged real interval, the filter
`h=1/(2T_j)` satisfies

\[
 |e^{ihx}-1|^2\ge {1\over10},                                \tag{5.3}
\]

and angular Plancherel contributes `20 pi`.  Equation (2.1), with
`epsilon>=3 delta_j/4`, therefore yields the factor `320 a_j`.  The locked
factor four covers the negative-height and polarized bookkeeping, giving

\[
 \boxed{
 |W_Z^{|\gamma|\ge3}(O_\lambda,O_\lambda)|
 \le1280D_S(\lambda)d_4\,\mathcal S_{\rm high}.}             \tag{5.4}
\]

For completeness, the convergence does not hide an unspecified finite
constant.  From `j>=34`, put `L_j=log(2T_j)`.  Equations (3.2) and (3.5)
give the explicit bound

\[
 Z(T_j)\le2C_ZL_j,
 \quad C_Z=1+{1\over\pi}
       +2(0.103787+0.257297)+2(9.367419),                     \tag{5.5}
\]

and hence

\[
 a_j\le {8C_Z\over3}(55.241)^3L_j^3\log L_j
 \exp\!\left[-{3\over4(55.241)}
       {L_j^{1/3}\over(\log L_j)^{1/3}}\right].              \tag{5.6}
\]

The logarithm of the polynomial factor in (5.6) is `O(log j)`, whereas the
displayed exponent divided by `log j` tends to infinity.  The right side is
therefore summable by comparison, proving
`S_high<infinity`.  The constant used in the theorem remains the exact
series (5.2), not this upper majorant.

## 6. The admitted outer--outer theorem

Define the lambda-independent constant

\[
\boxed{
 C_{\rm spec}=128Z_{\rm finite}+1280\mathcal S_{\rm high}.}  \tag{6.1}
\]

Combining (4.3) and (5.4) proves, for every `lambda>=2`,

\[
\boxed{
 |W_Z(O_\lambda,O_\lambda)|
 \le C_{\rm spec}D_S(\lambda)d_4.}                           \tag{6.2}
\]

All constants in (6.2) are either elementary closed expressions or terms of
the exact explicitly convergent positive series (5.2).  Numerical evaluation
of a truncated series is not used to prove (6.2).

The pinned Slepian fixed-index limit is

\[
 c=2\pi\lambda^2,\qquad
 c^4{d_4\over d_8}\longrightarrow{105\over256}.             \tag{6.3}
\]

Equivalently,

\[
 \lambda^8{d_4\over d_8}
 \longrightarrow {105\over4096\pi^4}.                       \tag{6.4}
\]

Using (2.8), (6.2), and (6.4),

\[
 { |W_Z(O_\lambda,O_\lambda)|\over d_8}
 \le {C_{\rm spec}C_D\over\lambda}
       \left(\lambda^8{d_4\over d_8}\right)
 \longrightarrow0.                                          \tag{6.5}
\]

This conclusion is qualitative: Slepian's source supplies no effective
starting threshold.  No finite value of `lambda` is promoted by (6.5).

## 7. Locked-schedule Ritz-energy corollary

On the already locked half-integer exponential schedule, write

\[
 K=p+P+O,qquad R=K-p=P+O.                                   \tag{7.1}
\]

The exact radical identity gives

\[
 q_\lambda(p,p)=W_Z(R,R).                                   \tag{7.2}
\]

The compact projection theorem proves `W_Z(P,P)=o(d_4)`, and the two mixed
theorems prove `W_Z(O,P)=o(d_4)` and `W_Z(P,O)=o(d_4)`.  Equation (6.3)
implies `d_4/d_8->0`, while (6.5) gives `W_Z(O,O)=o(d_8)`.  Expanding (7.2)
therefore yields

\[
 \boxed{q_\lambda(p,p)=o(d_8)}                               \tag{7.3}
\]

on that schedule.  This is an unnormalized Ritz-energy statement.  It does
not supply a sign, a low even-sector floor, an odd-sector floor, a simple
ground state, a shifted-resolvent estimate, or the locally uniform
characteristic-function convergence required by the final bridge.

## 8. Replay boundary

`src/outer_outer_spectral_theorem.py` reconstructs the source locks, the
physical constant, the explicit degree-seven majorant, the low constant, and
selected exact dyadic terms from decimal source parameters.
`verifier/outer_outer_spectral_theorem_replay.py` does not import that
producer.  It rechecks the source bytes and reconstructs the transcendental
constants by algebraically different formulas.  Both paths use `mpmath.iv`
for the new interval fields, and the serialized artifact discloses that
shared-library limitation.

The verifier rejects a global real-zero assumption, a rounded HSW-corollary
substitution, an omitted reflected tail, an omitted endpoint phase factor,
binary64 inputs, or any promotion of the formal terminal state.
