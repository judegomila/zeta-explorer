# Actual phase-volume long-block threshold and negative-index barrier

## 0. Exact outcome and fail-closed boundary

Put

\[
 x=\lambda^2,\qquad L=\log x=2\log\lambda,           \tag{0.1}
\]

and retain the complete inclusive prime-power polynomial

\[
 D_\lambda(t)=P_x(t)+H_x(t)
 =\sum_{1<n\leq x}{\Lambda(n)\over\sqrt n}n^{it}.   \tag{0.2}
\]

Here `P_x` contains the primes and `H_x` contains every proper prime power.
Let

\[
 c_0=\psi(1/4)-\log\pi,
 \qquad h(t)={1\over2}\log(1+4t^2).                 \tag{0.3}
\]

The exact digamma series gives the two-sided theorem

\[
 \boxed{
 2\theta'(t)=c_0+h(t)+\varepsilon_\theta(t),
 \qquad
 0\leq\varepsilon_\theta(t)\leq
 q(t):={16t^2\over1+4t^2}<4.}                       \tag{0.4}
\]

Consequently, with `C=g+U-c_0`, the actual phase volume satisfies

\[
 \boxed{
 \int_{\mathbb R}[C-h-q+2\operatorname {Re}D_\lambda]_+dt
 \leq\Phi_\lambda(U,g)
 \leq
 \int_{\mathbb R}[C-h+2\operatorname {Re}D_\lambda]_+dt.}
                                                               \tag{0.5}
\]

This is a genuine two-sided sandwich for the full actual prime-power
polynomial.  It does not split `D_lambda` before the positive part.

On a fixed translated block

\[
 I_{x,s}=[Ax^s,2Ax^s],\qquad s>1,\quad A>0,          \tag{0.6}
\]

assume

\[
 {C\over L}\longrightarrow\kappa.                   \tag{0.7}
\]

For the standard logarithmic retained schedule this is
`g=kappa L`, `U=O(1)`.  If `sigma_(x,s)` is the standard deviation of
`Re P_x` on the block, the actual normalized phase threshold is

\[
 \boxed{
 \sup_{t\in I_{x,s}}
 \left|{h(t)+\varepsilon_\theta(t)-C
               \over2\sigma_{x,s}}-(s-\kappa)\right|
 \longrightarrow0.}                                 \tag{0.8}
\]

It is `s-kappa`, not the adjustable centered-remainder threshold
`s(1-alpha)`.

Let `r=floor(s)` and let `rho_r` be the largest zero of the probabilists'
Hermite polynomial `He_r`.  The checkpoint-1.68/1.69 macroscopic moment
argument transfers to actual phase volume only under

\[
 \boxed{s-\kappa<\rho_r.}                            \tag{0.9}
\]

Under (0.9), it proves

\[
 \boxed{\Phi_\lambda(U,g)\gg_{A,s,\kappa}x^sL.}    \tag{0.10}
\]

For the standard schedule `kappa<=1`, condition (0.9) is impossible for
every fixed `s>1`.  Thus none of the macroscopic centered-remainder lower
bounds in checkpoint 1.68 implies an actual phase-volume lower bound on
that schedule.

There is one narrower positive conclusion.  On the checkpoint-1.69 odd
shelf

\[
 r+{1\over2}\leq s<r+1,\qquad
 s-\kappa<\rho_{r+1},                                \tag{0.11}
\]

the full actual phase volume obeys

\[
 \boxed{
 \Phi_\lambda(U,g)\gg_{A,s,r,\kappa}
 x^{s-r}L^{2r+1}.}                                   \tag{0.12}
\]

For `0<kappa<1`, this can occur only on the `r=1` and `r=2` shelves.  The
bound is always

\[
 x^{s-r}L^{2r+1}=o(x/L),                             \tag{0.13}
\]

so it neither disproves nor proves the desired `O(x/L)` phase-volume
target.

Finally, phase volume enters the retained negative-index theorem only in
the direction

\[
 n_-(PH_uP)\leq{L\Phi_\lambda(U_Z,g)
                       \over2\pi(g-\delta)}.          \tag{0.14}
\]

A lower bound for `Phi_lambda` cannot reverse (0.14).  Positive safe
energy and, in the even sector, the positive pole can still remove negative
directions; the odd pole is instead a separate rank-one dangerous term
whose alignment is not encoded by phase volume.  Frequency arrangement and
compression create further loss.  No lower negative-index bound,
dangerous-space capture, determinant convergence, zero theorem,
Riemann-hypothesis conclusion, converse, or de Bruijn--Newman bound is
proved.  The standard eight are untouched and the formal state remains
`P0_INVALIDATED`.

## 1. Frozen dependencies

No new external source, source lock, numerical orbit, or cached artifact is
used.  The exact local dependencies are:

| Frozen path | SHA-256 |
|---|---|
| `notes/ACTUAL_PHASE_VOLUME_CENTERED_PNT_REMAINDER_REDUCTION_BARRIER.md` | `2b2a40a4ec087c77145b45fc54d8a5782a85ecd122b2d599d2c2d8a067b714f1` |
| `tests/test_actual_phase_volume_centered_pnt_remainder_reduction_barrier.py` | `7fbcdf15dde20d3d2a00303f74d5441ee143af74ae269992fe79b1fb0c97456f` |
| `notes/ACTUAL_CENTERED_REMAINDER_LONG_BLOCK_HERMITE_MOMENT_BARRIER.md` | `1997f8b14c5f90977f744788d069f6e771da078c06562dac2d78c671c01a95c1` |
| `tests/test_actual_centered_remainder_long_block_hermite_moment_barrier.py` | `cbbc300b9a050ac161d9f8feae996947b522043ae50663799dfc194ed4d3dd2d` |
| `notes/ACTUAL_CENTERED_REMAINDER_FRACTIONAL_BLOCK_ODD_MOMENT_UI_BARRIER.md` | `c5510f3491d2d6ff173581bd6be540edc1b8b5c4bbb0afb56b636bfd68b51f19` |
| `tests/test_actual_centered_remainder_fractional_block_odd_moment_ui_barrier.py` | `71e1480ae0e4265ec4e45c3eb181a2682ee070bc8382eba815c3543a9f626871` |
| `notes/ACTUAL_CENTERED_REMAINDER_SHIFTED_CORRELATION_TOP_MOMENT_UI_BARRIER.md` | `8ab0f30e32fe715a4f839228f5d05dc581292c99c2a04f42804f0ff4d2d878d9` |
| `tests/test_actual_centered_remainder_shifted_correlation_top_moment_ui_barrier.py` | `ecaf4f1eaaab4a3a146c277eb0897e79d5323bfe9b79709bbc5cac5d423bd787` |
| `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` | `c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81` |
| `tests/test_parity_multiplier_schur.py` | `94ee818e2747e703d521cfa2a980765569cccfdf442b700b1a6b33ac4ceababb` |

The first pair fixes the complete multiplier, phase volume, centered
remainder, and retained-index direction.  The second fixes Gaussian prime
moments, Hermite localization, and proper-prime-power noise on integer
blocks.  The third fixes the real-exponent moment ceiling and weak odd-shelf
theorem.  The fourth identifies the shifted-correlation and next-even-moment
inputs missing beyond that ceiling.  The last fixes the exact digamma
series and multiplier normalization.

## 2. Exact two-sided archimedean bound

For positive `a` and real `y`, the digamma series is

\[
 \operatorname {Re}\psi(a+iy)-\psi(a)
 =\sum_{n=0}^\infty
 {y^2\over(n+a)((n+a)^2+y^2)}.                       \tag{2.1}
\]

Set

\[
 f_{a,y}(u)={y^2\over u(u^2+y^2)}.                   \tag{2.2}
\]

This function is nonnegative and decreasing for `u>0`.  The integral test
therefore gives

\[
 \int_a^\infty f_{a,y}(u)du
 \leq\sum_{n=0}^\infty f_{a,y}(n+a)
 \leq f_{a,y}(a)+\int_a^\infty f_{a,y}(u)du.         \tag{2.3}
\]

The integral is

\[
 \int_a^\infty f_{a,y}(u)du
 ={1\over2}\log\left(1+{y^2\over a^2}\right).      \tag{2.4}
\]

Take `a=1/4` and `y=t/2`.  Then (2.4) is `h(t)`, while

\[
 f_{1/4,t/2}(1/4)={16t^2\over1+4t^2}=q(t).          \tag{2.5}
\]

Since

\[
 2\theta'(t)=
 \operatorname {Re}\psi(1/4+it/2)-\log\pi,          \tag{2.6}
\]

equations (2.1)--(2.6) prove (0.4), including the signs and the constant
four.

The complete multiplier is

\[
 m_\lambda(t)=2\theta'(t)-2\operatorname {Re}D_\lambda(t).
                                                               \tag{2.7}
\]

Thus the exact phase integrand is

\[
 [g+U-m_\lambda(t)]_+
 =[C-h(t)-\varepsilon_\theta(t)
             +2\operatorname {Re}D_\lambda(t)]_+.   \tag{2.8}
\]

Monotonicity of the positive part and
`0<=epsilon_theta<=q` prove the pointwise sandwich

\[
 [C-h-q+2\operatorname {Re}D_\lambda]_+
 \leq[g+U-m_\lambda]_+
 \leq[C-h+2\operatorname {Re}D_\lambda]_+,          \tag{2.9}
\]

and integration proves (0.5).

The lower inequality is the information absent from the earlier one-way
centered split.  It does not make the centered statistic equivalent to
phase volume: that statistic uses `R_lambda=D_lambda-M_lambda` and the
smaller adjustable threshold `(1-alpha)h`.

## 3. The true normalized long-block threshold

Retain the prime polynomial and normalized block average

\[
 P_x(t)=\sum_{p\leq x}{\log p\over\sqrt p}p^{it},
 \qquad Y_x(t)=\operatorname {Re}P_x(t),             \tag{3.1}
\]

\[
 \mathbb E_{x,s}F={1\over Ax^s}
       \int_{Ax^s}^{2Ax^s}F(t)dt,
 \qquad
 \sigma_{x,s}^2=\mathbb E_{x,s}Y_x^2.               \tag{3.2}
\]

The frozen real-exponent theorem gives

\[
 \sigma_{x,s}=\left({1\over2}+o(1)\right)L.         \tag{3.3}
\]

Uniformly on `I_(x,s)`,

\[
 h(t)=sL+O_A(1),\qquad
 0\leq\varepsilon_\theta(t)<4.                      \tag{3.4}
\]

Define the actual prime threshold

\[
 b_{x,s}(t)={h(t)+\varepsilon_\theta(t)-C\over2}.
                                                               \tag{3.5}
\]

Equations (0.7) and (3.3)--(3.5) prove (0.8).  Since
`D_lambda=P_x+H_x`, the block contribution to phase volume is exactly

\[
 \boxed{
 \Phi_\lambda(U,g;I_{x,s})
 =2Ax^s\mathbb E_{x,s}
       [Y_x+\operatorname {Re}H_x-b_{x,s}]_+.}       \tag{3.6}
\]

The proper-prime-power estimates used below are

\[
 \mathbb E_{x,s}|H_x|=O_{A,s}(1),
 \qquad
 \|H_x\|_\infty\leq\left({1\over2}+o(1)\right)L.  \tag{3.7}
\]

They retain every prime power and do not replace `D_lambda` by its prime
part inside (3.6).

For comparison, the centered statistic on this block tests

\[
 { (1-\alpha)h(t)/2\over\sigma_{x,s}}
 \longrightarrow s(1-\alpha).                       \tag{3.8}
\]

Its threshold lies strictly above the actual phase threshold exactly when

\[
 s(1-\alpha)>s-\kappa
 \quad\Longleftrightarrow\quad
 \kappa>s\alpha.                                    \tag{3.9}
\]

With strict margins, (3.9) makes the checkpoint centered block lower bound
a phase-volume lower bound.  Without (3.9), mass between the two thresholds
can contribute to the centered statistic while contributing nothing to
phase volume.

## 4. Macroscopic Hermite theorem and the standard-schedule barrier

Let `r=floor(s)`.  Gaussian moment convergence through degree `2r`, plus
the frozen uniform-integrability argument, gives for every fixed
`c<rho_r`

\[
 \mathbb E_{x,s}(Y_x-c\sigma_{x,s})_+\gg_{A,s,c}L.  \tag{4.1}
\]

Assume (0.9), and choose

\[
 s-\kappa<c<\rho_r.                                  \tag{4.2}
\]

Equation (0.8) makes `b_(x,s)(t)<=c sigma_(x,s)`
uniformly for large `x`.  The elementary noise inequality gives

\[
 [Y_x+\operatorname {Re}H_x-b_{x,s}]_+
 \geq(Y_x-c\sigma_{x,s})_+-|H_x|.                  \tag{4.3}
\]

Equations (3.6)--(3.7) and (4.1)--(4.3) prove (0.10).

For `r>=2`, equivalently, a centered-remainder theorem with its admitted
parameter `0<alpha<1` transfers when

\[
 s\alpha<\kappa,
 \qquad s(1-\alpha)<\rho_r.                          \tag{4.4}
\]

There exists such an `alpha` exactly when `s-kappa<rho_r`, again giving
(0.9).  On the exceptional shelf `r=1`, the direct phase argument remains
valid if (0.9) holds, but no admitted centered threshold lies below
`rho_1=0`.

Now suppose `kappa<=1`.  If `1<s<2`, then `r=1`, `rho_1=0`, and
`s-kappa>0`.  For `r>=2`,

\[
 \rho_r\leq r-1.                                     \tag{4.5}
\]

Indeed, `rho_2=1`, `rho_3=sqrt(3)<2`, and
`rho_4=sqrt(3+sqrt(6))<3`.  For `r>=5`, the frozen bound
`rho_r<7r/12` is smaller than `r-1`.  Since `s>=r`,

\[
 s-\kappa\geq r-1\geq\rho_r.                        \tag{4.6}
\]

The strict condition (0.9) therefore fails, including the boundary case
`s=2`, `kappa=1`, where both sides equal one.  In particular, at the
checkpoint-1.68 optimal block,

\[
 4-\kappa\geq3>\sqrt{3+\sqrt6}=\rho_4.             \tag{4.7}
\]

The large lower bound for the centered statistic at its smaller threshold
cannot be promoted across this gap.

## 5. The genuine odd-shelf phase-volume lower bound

Let

\[
 r+{1\over2}\leq s<r+1.                              \tag{5.1}
\]

Moments through degree `2r+1` give the weighted `He_(r+1)` tail, while the
deterministic prime-polynomial support supplies the weak first-excess scale.
Assume (0.11), and choose

\[
 s-\kappa<c<\rho_{r+1}.                              \tag{5.2}
\]

The frozen odd-shelf proof splits the weighted tail at a fixed
`K>c+3`.  If the bounded part carries half the weighted mass, it gives a
fixed normalized first excess and hence a stronger `x^sL` lower bound after
(3.7).  Otherwise, with

\[
 B_x\ll{\sqrt x\over L},                             \tag{5.3}
\]

the remote part gives

\[
 \mathbb E_{x,s}\{(Z_{x,s}-c)_+;Z_{x,s}>K\}
 \gg B_x^{-2r}\gg x^{-r}L^{2r}.                     \tag{5.4}
\]

On `Z>K`, the pointwise proper-prime-power bound in (3.7) costs at most one
normalized unit, while `Z-c>3`.  Thus a fixed fraction of (5.4) remains in
the exact phase integrand (3.6).  Multiplication by
`Ax^s sigma_(x,s)` proves (0.12).

For `0<kappa<1`, the permitted shelves are explicit.

For `r=1`,

\[
 {3\over2}\leq s<2,
 \qquad s<\kappa+1.                                  \tag{5.5}
\]

This range is nonempty exactly when `kappa>1/2`.  For `r=2`,

\[
 {5\over2}\leq s<3,
 \qquad s<\kappa+\sqrt3,                             \tag{5.6}
\]

which is nonempty exactly when

\[
 \kappa>{5\over2}-\sqrt3=0.767949\ldots .           \tag{5.7}
\]

For `r>=3`, the range is empty.  At `r=3`,
`rho_4<5/2`; for `r>=4`,

\[
 \rho_{r+1}<{7(r+1)\over12}\leq r-{1\over2},       \tag{5.8}
\]

while `s-kappa>r-1/2`.

Since `s-r<1`, equation (0.13) follows.  A useful optimized corollary is:
for fixed `1/2<kappa<1` and

\[
 0<\epsilon<\kappa-{1\over2},\qquad
 s=\kappa+1-\epsilon,                                \tag{5.9}
\]

the first shelf gives

\[
 \boxed{
 \Phi_\lambda(U,g)\gg_{A,\kappa,\epsilon}
 x^{\kappa-\epsilon}L^3=o(x/L).}                    \tag{5.10}
\]

This may improve the elementary near-zero lower check on such a retained
schedule, but it remains below the scale relevant to the negative-index
upper target.

## 6. What finite moments and large deviations could change

The current finite-moment barrier is sharp.  Gaussian moments through
degree `2r` force a positive first excess only below `rho_r`.  For every
`c>rho_r`, the Gaussian--Radau measures frozen in checkpoint 1.68/1.69
match those moments while being supported in `(-infinity,c]`, and hence
have zero excess above `c`.  At `c=rho_r`, a diagonal sequence of Radau
endpoints decreasing to `rho_r` has all those moments converging to the
Gaussian moments while its excess above `rho_r` tends to zero.  Conversely,
Gaussian measure has the same limiting moments and positive excess above
every finite `c`.  Thus the admitted moment convergence decides neither
side of the actual phase tail when `c=s-kappa>=rho_r`.

Abstractly, moments through degree `2K`, with the needed uniform
integrability, would cross the phase threshold if

\[
 \boxed{\rho_K>s-\kappa.}                             \tag{6.1}
\]

But Montgomery--Vaughan on a block of length `x^s` supplies only
`K<=floor(s)` at the macroscopic first-excess scale.  Raising `K` beyond
that ceiling requires the shifted almost-prime correlations and next-even
top moments isolated in the frozen shifted-correlation pair.  The first
missing odd moment without the next even uniform-integrability bound is
insufficient.

A genuine quantitative lower large-deviation theorem could also cross the
threshold.  For example, if for some fixed `eta,c_*>0`,

\[
 \mathbb E_{x,s}
 (Z_{x,s}-(s-\kappa+\eta))_+\geq c_*,                \tag{6.2}
\]

then (3.6)--(3.7) would give `Phi_lambda>>x^sL`.  Such a theorem would be a
large obstruction to the desired `O(x/L)` phase-volume target, not a proof
of that upper target.

Indeed, on one block of length `x^s`, an upper target `O(x/L)` would require
the normalized positive excess to have scale at most

\[
 O\left({x^{1-s}\over L^2}\right).                  \tag{6.3}
\]

A fixed collection of moments gives at best a constant Markov bound at a
fixed normalized threshold and cannot supply the polynomially vanishing
quantity in (6.3).  No uniform finite-orbit large-deviation estimate of
either sign is frozen.

## 7. Why phase mass does not give negative index

Let

\[
 T_v=C_L^*\mathcal F^*M_{[g+U-m_\lambda]_+}
                    \mathcal F C_L.                  \tag{7.1}
\]

Its trace is

\[
 \operatorname {tr}T_v={L\over2\pi}\Phi_\lambda(U,g).
                                                               \tag{7.2}
\]

On the two parity sectors, the retained signed operator has the exact form

\[
 B_\epsilon=gI+T_a-T_v
       +2\epsilon|p_\epsilon\rangle\langle p_\epsilon|,
 \qquad\epsilon\in\{+1,-1\}.                         \tag{7.3}
\]

Here `T_a>=0`.  Thus `B_+>=gI-T_v`, while
`B_->=gI-(T_v+2|p_-><p_-|)`; the latter rank-one term is handled separately
in the frozen retained-index reduction.  These one-way comparisons lead
to (0.14), but neither they nor min--max reverse.  A large trace in `T_v`
may be distributed among many eigenvalues below `g-delta`; even a large
dangerous eigenvalue may be canceled by `T_a` and, in the positive-pole
sector, by the pole after compression.  The negative odd pole supplies no
reverse trace inequality and its source alignment is absent from
`Phi_lambda`.

The phase volume is also insensitive to the arrangement of its frequency
mass at the `1/L` resolution of the finite interval.  Long-block moments
control a scalar frequency average, not a lower Ritz value of the complete
signed compression.  A lower negative-index theorem would require a
source-specific signed compression or Feshbach inequality, not a reverse
use of (0.14).

Thus (0.12) and (5.10) are actual phase-volume lower bounds but no
negative-index conclusions follow from them.

## 8. Reproduction and claim discipline

Run

    python3 -B -m unittest \
      tests.test_actual_phase_volume_long_block_threshold_negative_index_barrier -v

The regression checks every frozen hash, the exact digamma integral-test
constant, phase sandwich, normalized threshold, Hermite-root barrier,
centered-transfer condition, odd-shelf ranges and scales, higher-moment
stopping line, one-way negative-index fixture, displayed TeX, and static
hygiene.  It reads no zero table, numerical orbit, cached matrix, network
resource, API key, or environment secret.
